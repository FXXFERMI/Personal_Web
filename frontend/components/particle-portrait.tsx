'use client';

import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
}

interface ParticlePortraitProps {
  imageSrc: string;
  particleGap?: number;
  mouseRadius?: number;
  returnSpeed?: number;
  className?: string;
}

export default function ParticlePortrait({
  imageSrc,
  particleGap = 4,
  mouseRadius = 100,
  returnSpeed = 0.08,
  className = '',
}: ParticlePortraitProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const mousePos = useRef({ x: -1000, y: -1000 });
  const animationFrameId = useRef<number | undefined>(undefined);

  // Load image and create particles
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      // Get the natural dimensions of the image
      const naturalWidth = img.naturalWidth;
      const naturalHeight = img.naturalHeight;
      const aspectRatio = naturalWidth / naturalHeight;

      // Calculate canvas dimensions based on container width
      const containerWidth = container.clientWidth;
      const canvasWidth = Math.min(containerWidth, 680);
      const canvasHeight = canvasWidth / aspectRatio;

      // Set canvas dimensions
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      setDimensions({ width: canvasWidth, height: canvasHeight });

      // Draw image to canvas to get pixel data
      ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
      const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
      const pixels = imageData.data;

      const newParticles: Particle[] = [];

      // Sample pixels at intervals to create particles
      for (let y = 0; y < canvasHeight; y += particleGap) {
        for (let x = 0; x < canvasWidth; x += particleGap) {
          const index = (Math.floor(y) * canvasWidth + Math.floor(x)) * 4;
          const r = pixels[index];
          const g = pixels[index + 1];
          const b = pixels[index + 2];
          const alpha = pixels[index + 3];

          // Only create particles for visible pixels
          if (alpha > 128) {
            newParticles.push({
              x,
              y,
              originX: x,
              originY: y,
              vx: 0,
              vy: 0,
              color: `rgb(${r}, ${g}, ${b})`,
              size: particleGap * 0.8,
            });
          }
        }
      }

      setParticles(newParticles);
      setIsLoaded(true);
    };

    img.src = imageSrc;
  }, [imageSrc, particleGap]);

  // Animation loop
  useEffect(() => {
    if (!isLoaded || particles.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      particles.forEach((particle) => {
        // Calculate distance from mouse
        const dx = mousePos.current.x - particle.x;
        const dy = mousePos.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Apply repulsion force if within mouse radius
        if (distance < mouseRadius) {
          const force = (mouseRadius - distance) / mouseRadius;
          const angle = Math.atan2(dy, dx);
          particle.vx -= Math.cos(angle) * force * 2;
          particle.vy -= Math.sin(angle) * force * 2;
        }

        // Apply return force to original position
        const returnDx = particle.originX - particle.x;
        const returnDy = particle.originY - particle.y;
        particle.vx += returnDx * returnSpeed;
        particle.vy += returnDy * returnSpeed;

        // Apply damping
        particle.vx *= 0.95;
        particle.vy *= 0.95;

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Draw particle
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size / 2, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isLoaded, particles, dimensions, mouseRadius, returnSpeed]);

  // Mouse move handler
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mousePos.current = {
      x: ((e.clientX - rect.left) / rect.width) * dimensions.width,
      y: ((e.clientY - rect.top) / rect.height) * dimensions.height,
    };
  };

  const handleMouseLeave = () => {
    mousePos.current = { x: -1000, y: -1000 };
  };

  return (
    <div ref={containerRef} className={className}>
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full h-auto cursor-pointer"
        style={{ display: isLoaded ? 'block' : 'none' }}
      />
      {!isLoaded && (
        <div className="flex items-center justify-center w-full h-96 bg-transparent">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      )}
    </div>
  );
}

// Made with Bob
