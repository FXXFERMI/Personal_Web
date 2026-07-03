'use client';

import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { useTheme } from './theme-provider';

interface Fragment {
  originX: number;
  originY: number;
  windX: number;
  windY: number;
  delay: number;
  turbulenceOffset: number;
  color: string;
  width: number;
  height: number;
  rotation: number;
  rotationSpeed: number;
  vertices: { x: number; y: number }[];
  directionalDelay: number;
  frontPosition: number;
}

interface DissolveDirection {
  originX: number;
  originY: number;
  travelX: number;
  travelY: number;
}

interface InteractiveParticlePortraitProps {
  imageSrc: string;
  logoSrcLight: string;
  logoSrcDark: string;
  alt: string;
  fragmentGap?: number;
  fragmentSizeVariation?: number;
  windDistance?: number;
  turbulenceStrength?: number;
  logoRevealDelay?: number;
  interactionTravelDistance?: number;
  pixelateFrontWidth?: number;
  dissolveTrailWidth?: number;
  frontSoftness?: number;
  className?: string;
}

export interface InteractiveParticlePortraitRef {
  handlePointerAtPosition: (clientX: number, clientY: number) => void;
}

const InteractiveParticlePortrait = forwardRef<InteractiveParticlePortraitRef, InteractiveParticlePortraitProps>((
  {
    imageSrc,
    logoSrcLight,
    logoSrcDark,
    alt,
    fragmentGap = 5,
    fragmentSizeVariation = 0.6,
    windDistance = 340,
    turbulenceStrength = 16,
    logoRevealDelay = 0.35,
    interactionTravelDistance = 0.4,
    pixelateFrontWidth = 0.08,
    dissolveTrailWidth = 0.28,
    frontSoftness = 0.03,
    className = '',
  },
  ref
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Animation state
  const fragmentsRef = useRef<Fragment[]>([]);
  const dissolveProgress = useRef(0);
  const targetProgress = useRef(0);
  const animationFrameId = useRef<number | undefined>(undefined);
  const animationTime = useRef(0);
  const resizeObserver = useRef<ResizeObserver | null>(null);
  
  // Opacity refs for animation loop (source of truth)
  const imageOpacityRef = useRef(1);
  const canvasOpacityRef = useRef(0);
  const logoOpacityRef = useRef(0);
  
  // Circle interaction state
  const isInsideCircle = useRef(false);
  const entryPointRef = useRef<{ x: number; y: number } | null>(null);
  const dissolveDirectionRef = useRef<DissolveDirection | null>(null);
  
  // React state for UI rendering
  const [imageOpacity, setImageOpacity] = useState(1);
  const [canvasOpacity, setCanvasOpacity] = useState(0);
  const [logoOpacity, setLogoOpacity] = useState(0);
  const [isFragmentsReady, setIsFragmentsReady] = useState(false);
  
  // Device and accessibility detection
  const prefersReducedMotion = useRef(false);
  const isTouchDevice = useRef(false);
  
  // Theme detection
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');
  
  // Determine current theme
  useEffect(() => {
    if (!mounted) return;
    
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setCurrentTheme(isDark ? 'dark' : 'light');
      
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        setCurrentTheme(e.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      setCurrentTheme(theme as 'light' | 'dark');
    }
  }, [theme, mounted]);
  
  // Determine which logo to use based on theme
  const logoSrc = currentTheme === 'dark' ? logoSrcDark : logoSrcLight;

  // Set mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.current = mediaQuery.matches;
    
    const handleChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches;
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Check if device is touch-only
  useEffect(() => {
    isTouchDevice.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);

  // Smoothstep function for smooth transitions
  const smoothstep = (edge0: number, edge1: number, x: number): number => {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
  };

  // Get dissolve direction based on entry quadrant
  const getDissolveDirection = (localX: number, localY: number, size: number): DissolveDirection => {
    const centerX = size / 2;
    const centerY = size / 2;
    
    const isRight = localX >= centerX;
    const isBottom = localY >= centerY;
    
    if (!isBottom && isRight) {
      // Upper-right: origin top-right, travel down-left
      return {
        originX: size,
        originY: 0,
        travelX: -1,
        travelY: 1,
      };
    } else if (!isBottom && !isRight) {
      // Upper-left: origin top-left, travel down-right
      return {
        originX: 0,
        originY: 0,
        travelX: 1,
        travelY: 1,
      };
    } else if (isBottom && isRight) {
      // Lower-right: origin bottom-right, travel up-left
      return {
        originX: size,
        originY: size,
        travelX: -1,
        travelY: -1,
      };
    } else {
      // Lower-left: origin bottom-left, travel up-right
      return {
        originX: 0,
        originY: size,
        travelX: 1,
        travelY: -1,
      };
    }
  };

  // Generate irregular fragment shape
  const generateFragmentShape = (baseSize: number): { x: number; y: number }[] => {
    const shapeType = Math.random();
    
    if (shapeType < 0.4) {
      // Irregular quad/rectangle
      const w = baseSize * (0.7 + Math.random() * 0.6);
      const h = baseSize * (0.7 + Math.random() * 0.6);
      const jitter = baseSize * 0.15;
      
      return [
        { x: -w/2 + (Math.random() - 0.5) * jitter, y: -h/2 + (Math.random() - 0.5) * jitter },
        { x: w/2 + (Math.random() - 0.5) * jitter, y: -h/2 + (Math.random() - 0.5) * jitter },
        { x: w/2 + (Math.random() - 0.5) * jitter, y: h/2 + (Math.random() - 0.5) * jitter },
        { x: -w/2 + (Math.random() - 0.5) * jitter, y: h/2 + (Math.random() - 0.5) * jitter },
      ];
    } else if (shapeType < 0.7) {
      // Irregular triangle
      const size = baseSize * (0.8 + Math.random() * 0.4);
      const jitter = baseSize * 0.2;
      
      return [
        { x: 0 + (Math.random() - 0.5) * jitter, y: -size/2 + (Math.random() - 0.5) * jitter },
        { x: size/2 + (Math.random() - 0.5) * jitter, y: size/2 + (Math.random() - 0.5) * jitter },
        { x: -size/2 + (Math.random() - 0.5) * jitter, y: size/2 + (Math.random() - 0.5) * jitter },
      ];
    } else {
      // Irregular pentagon
      const size = baseSize * (0.75 + Math.random() * 0.5);
      const jitter = baseSize * 0.15;
      const angleOffset = Math.random() * Math.PI * 2;
      
      return Array.from({ length: 5 }, (_, i) => {
        const angle = (i / 5) * Math.PI * 2 + angleOffset;
        const radius = size/2 * (0.85 + Math.random() * 0.3);
        return {
          x: Math.cos(angle) * radius + (Math.random() - 0.5) * jitter,
          y: Math.sin(angle) * radius + (Math.random() - 0.5) * jitter,
        };
      });
    }
  };

  // Check if point is inside circle
  const checkInsideCircle = (x: number, y: number): boolean => {
    const container = containerRef.current;
    if (!container) return false;

    const rect = container.getBoundingClientRect();
    const radius = rect.width / 2;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const distance = Math.hypot(x - centerX, y - centerY);
    return distance <= radius;
  };

  // Initialize fragments from image
  const initializeFragments = () => {
    const image = imageRef.current;
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!image || !canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const size = rect.width;

    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Draw image with object-cover behavior
    const imgAspect = image.naturalWidth / image.naturalHeight;
    const canvasAspect = 1; // square canvas

    let drawWidth, drawHeight, offsetX, offsetY;

    if (imgAspect > canvasAspect) {
      drawHeight = size;
      drawWidth = size * imgAspect;
      offsetX = -(drawWidth - size) / 2;
      offsetY = 0;
    } else {
      drawWidth = size;
      drawHeight = size / imgAspect;
      offsetX = 0;
      offsetY = -(drawHeight - size) / 2;
    }

    ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);

    // Sample fragments
    const fragments: Fragment[] = [];
    const baseFragmentSize = fragmentGap * 2;

    for (let y = 0; y < size; y += fragmentGap) {
      for (let x = 0; x < size; x += fragmentGap) {
        // Check if inside circle
        if (!checkInsideCircle(x, y)) continue;

        // Add jitter to avoid grid appearance
        const jitterX = (Math.random() - 0.5) * fragmentGap * 0.6;
        const jitterY = (Math.random() - 0.5) * fragmentGap * 0.6;
        const sampleX = Math.floor(x + jitterX);
        const sampleY = Math.floor(y + jitterY);

        if (sampleX < 0 || sampleX >= size || sampleY < 0 || sampleY >= size) continue;

        const pixelData = ctx.getImageData(sampleX, sampleY, 1, 1).data;
        const alpha = pixelData[3];

        if (alpha < 10) continue;

        const color = `rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, ${alpha / 255})`;

        // Variable fragment size
        const sizeVariation = 1 - fragmentSizeVariation + Math.random() * fragmentSizeVariation;
        const fragmentSize = baseFragmentSize * sizeVariation;

        fragments.push({
          originX: x + jitterX,
          originY: y + jitterY,
          windX: 0, // Will be set dynamically based on entry direction
          windY: 0,
          delay: Math.random() * 0.3,
          turbulenceOffset: Math.random() * Math.PI * 2,
          color,
          width: fragmentSize,
          height: fragmentSize,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.08,
          vertices: generateFragmentShape(fragmentSize),
          directionalDelay: 0,
          frontPosition: 0, // Will be calculated based on dissolve direction
        });
      }
    }

    fragmentsRef.current = fragments;
    setIsFragmentsReady(true);
  };

  // Update fragment wind directions and front positions based on dissolve direction
  const updateFragmentDirections = (direction: DissolveDirection, size: number) => {
    const fragments = fragmentsRef.current;
    
    // Calculate diagonal distance for normalization
    const diagonalDistance = Math.sqrt(size * size + size * size);
    
    fragments.forEach((fragment) => {
      // Calculate normalized position
      const normalizedX = fragment.originX / size;
      const normalizedY = fragment.originY / size;
      
      // Calculate distance from entry origin along the diagonal direction
      const dx = fragment.originX - direction.originX;
      const dy = fragment.originY - direction.originY;
      
      // Project onto travel direction
      const projectedDistance = dx * direction.travelX + dy * direction.travelY;
      
      // Normalize to 0-1 range
      fragment.frontPosition = Math.max(0, Math.min(1, projectedDistance / diagonalDistance));
      
      // Calculate directional delay for staggered animation
      fragment.directionalDelay = fragment.frontPosition * 0.3;
      
      // Set wind direction to match dissolve travel direction with variation
      const windVariationX = (Math.random() - 0.5) * 0.55;
      const windVariationY = (Math.random() - 0.5) * 0.55;
      
      fragment.windX = windDistance * direction.travelX * (1 + windVariationX);
      fragment.windY = windDistance * direction.travelY * (1 + windVariationY);
    });
  };

  // Initialize fragments when image loads
  useEffect(() => {
    const image = imageRef.current;
    if (!image) return;

    const handleLoad = () => {
      initializeFragments();
    };

    if (image.complete) {
      initializeFragments();
    } else {
      image.addEventListener('load', handleLoad);
      return () => image.removeEventListener('load', handleLoad);
    }
  }, [imageSrc, fragmentGap, fragmentSizeVariation]);

  // Setup ResizeObserver to rebuild fragments on size change
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    resizeObserver.current = new ResizeObserver(() => {
      const image = imageRef.current;
      if (image && image.complete) {
        initializeFragments();
      }
    });

    resizeObserver.current.observe(container);

    return () => {
      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
      }
    };
  }, [imageSrc, fragmentGap, fragmentSizeVariation]);

  // Immediate reset to idle state
  const resetToIdle = () => {
    // Cancel any ongoing animation
    if (animationFrameId.current !== undefined) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = undefined;
    }

    // Reset all progress values
    dissolveProgress.current = 0;
    targetProgress.current = 0;
    animationTime.current = 0;
    
    // Reset entry tracking
    entryPointRef.current = null;
    dissolveDirectionRef.current = null;

    // Immediately set idle visual state
    if (imageOpacityRef.current !== 1) {
      imageOpacityRef.current = 1;
      setImageOpacity(1);
    }

    if (canvasOpacityRef.current !== 0) {
      canvasOpacityRef.current = 0;
      setCanvasOpacity(0);
    }

    if (logoOpacityRef.current !== 0) {
      logoOpacityRef.current = 0;
      setLogoOpacity(0);
    }

    // Clear canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  // Animation loop with progressive directional dissolve
  const animate = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;

    // Smoothly interpolate dissolve progress with responsive speed
    const followSpeed = 0.18;
    if (Math.abs(targetProgress.current - dissolveProgress.current) > 0.001) {
      dissolveProgress.current += (targetProgress.current - dissolveProgress.current) * followSpeed;
    } else {
      dissolveProgress.current = targetProgress.current;
    }

    // Check if fully idle
    const isFullyIdle = targetProgress.current === 0 && dissolveProgress.current <= 0.002;

    if (isFullyIdle) {
      // Force final idle state
      dissolveProgress.current = 0;

      if (canvasOpacityRef.current !== 0) {
        canvasOpacityRef.current = 0;
        setCanvasOpacity(0);
      }

      if (imageOpacityRef.current !== 1) {
        imageOpacityRef.current = 1;
        setImageOpacity(1);
      }

      if (logoOpacityRef.current !== 0) {
        logoOpacityRef.current = 0;
        setLogoOpacity(0);
      }

      // Stop animation loop
      animationFrameId.current = undefined;
      return;
    }

    // Update visual states based on dissolve progress
    const normalizedProgress = dissolveProgress.current;
    
    // Extended progress for dissolve front to allow complete dissolution
    const frontProgress = normalizedProgress * (1 + pixelateFrontWidth + dissolveTrailWidth);
    
    // Canvas becomes visible, image becomes hidden
    const newCanvasOpacity = normalizedProgress > 0.005 ? 1 : 0;
    if (newCanvasOpacity !== canvasOpacityRef.current) {
      canvasOpacityRef.current = newCanvasOpacity;
      setCanvasOpacity(newCanvasOpacity);
    }

    const newImageOpacity = normalizedProgress > 0.005 ? 0 : 1;
    if (newImageOpacity !== imageOpacityRef.current) {
      imageOpacityRef.current = newImageOpacity;
      setImageOpacity(newImageOpacity);
    }

    // Logo opacity: progressive reveal as dissolve progresses (use normalizedProgress, not frontProgress)
    const logoProgress = Math.max(0, (normalizedProgress - logoRevealDelay) / (1 - logoRevealDelay));
    const newLogoOpacity = Math.min(1, logoProgress);
    if (Math.abs(newLogoOpacity - logoOpacityRef.current) > 0.01) {
      logoOpacityRef.current = newLogoOpacity;
      setLogoOpacity(newLogoOpacity);
    }

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Draw the original image as base
    const imgAspect = image.naturalWidth / image.naturalHeight;
    const canvasAspect = 1;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (imgAspect > canvasAspect) {
      drawHeight = size;
      drawWidth = size * imgAspect;
      offsetX = -(drawWidth - size) / 2;
      offsetY = 0;
    } else {
      drawWidth = size;
      drawHeight = size / imgAspect;
      offsetX = 0;
      offsetY = -(drawHeight - size) / 2;
    }

    ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);

    // Update animation time
    animationTime.current += 0.016;

    // Process fragments and erase/draw based on dissolve front
    const fragments = fragmentsRef.current;
    
    fragments.forEach((fragment) => {
      // Calculate distance from dissolve front (use frontProgress for complete dissolution)
      const distanceFromFront = frontProgress - fragment.frontPosition;
      
      // Skip if not reached yet
      if (distanceFromFront < 0) return;
      
      // Calculate pixelate progress (0-1 in pixelate zone)
      const pixelateProgress = smoothstep(
        0,
        pixelateFrontWidth,
        distanceFromFront
      );
      
      // Calculate drift progress (0-1 in dissolve zone)
      const driftProgress = smoothstep(
        pixelateFrontWidth,
        pixelateFrontWidth + dissolveTrailWidth,
        distanceFromFront
      );
      
      // Skip if fully dissolved
      if (driftProgress >= 1) {
        // Erase this region from base image
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0,0,0,1)';
        ctx.beginPath();
        ctx.arc(fragment.originX, fragment.originY, fragment.width, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return;
      }
      
      // Erase the original image area for this fragment
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = `rgba(0,0,0,${pixelateProgress})`;
      ctx.beginPath();
      ctx.arc(fragment.originX, fragment.originY, fragment.width, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      
      // Calculate fragment movement
      const easedDrift = 1 - Math.pow(1 - driftProgress, 3);
      
      // Calculate turbulence
      const turbulenceX = Math.sin(animationTime.current * 2 + fragment.turbulenceOffset) * turbulenceStrength * easedDrift;
      const turbulenceY = Math.cos(animationTime.current * 1.5 + fragment.turbulenceOffset) * turbulenceStrength * easedDrift;
      
      // Calculate position
      const x = fragment.originX + fragment.windX * easedDrift + turbulenceX;
      const y = fragment.originY + fragment.windY * easedDrift + turbulenceY;
      
      // Calculate rotation
      const rotation = fragment.rotation + fragment.rotationSpeed * easedDrift * 100;
      
      // Calculate opacity
      const fragmentOpacity = Math.max(0, 1 - driftProgress * 0.75) * pixelateProgress;
      
      // Draw fragment
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = fragmentOpacity;
      
      ctx.fillStyle = fragment.color;
      ctx.beginPath();
      fragment.vertices.forEach((vertex, i) => {
        if (i === 0) {
          ctx.moveTo(vertex.x, vertex.y);
        } else {
          ctx.lineTo(vertex.x, vertex.y);
        }
      });
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
    });

    // Continue animation
    animationFrameId.current = requestAnimationFrame(animate);
  };

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  // Reusable method that accepts viewport coordinates
  const handlePointerAtPosition = (clientX: number, clientY: number) => {
    if (prefersReducedMotion.current || isTouchDevice.current || !isFragmentsReady) return;
    
    // DEBUG: Log which element is receiving the event
    console.log('Portrait handling pointer at:', clientX, clientY, 'from element:', document.elementFromPoint(clientX, clientY));
    
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const localX = clientX - rect.left;
    const localY = clientY - rect.top;
    const size = rect.width;

    const wasInsideCircle = isInsideCircle.current;
    const nowInsideCircle = checkInsideCircle(localX, localY);
    isInsideCircle.current = nowInsideCircle;

    // Handle leaving the circle - immediate reset
    if (!nowInsideCircle && wasInsideCircle) {
      resetToIdle();
      return;
    }

    // Handle entering the circle - set entry point and direction
    if (nowInsideCircle && !wasInsideCircle) {
      entryPointRef.current = { x: localX, y: localY };
      const direction = getDissolveDirection(localX, localY, size);
      dissolveDirectionRef.current = direction;
      updateFragmentDirections(direction, size);
    }

    // Update dissolve progress based on cursor movement
    if (nowInsideCircle && entryPointRef.current && dissolveDirectionRef.current) {
      const direction = dissolveDirectionRef.current;
      
      // Calculate cursor travel from entry point
      const deltaX = localX - entryPointRef.current.x;
      const deltaY = localY - entryPointRef.current.y;
      
      // Project movement onto dissolve travel direction
      const projectedMovement = deltaX * direction.travelX + deltaY * direction.travelY;
      
      // Normalize against interaction travel distance
      const requiredDistance = size * interactionTravelDistance;
      const rawProgress = Math.max(0, Math.min(1, projectedMovement / requiredDistance));
      
      // Apply easing for more responsive feel
      const easedProgress = 1 - Math.pow(1 - rawProgress, 2);
      targetProgress.current = easedProgress;

      // Start animation loop if not already running
      if (animationFrameId.current === undefined) {
        animate();
      }
    }
  };

  // Mouse move handler using the reusable method
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    handlePointerAtPosition(e.clientX, e.clientY);
  };

  // Expose the method via ref
  useImperativeHandle(ref, () => ({
    handlePointerAtPosition,
  }));

  const handleMouseLeave = () => {
    if (prefersReducedMotion.current || isTouchDevice.current) return;
    
    // Immediate reset when leaving container
    isInsideCircle.current = false;
    resetToIdle();
  };

  return (
    <div 
      ref={containerRef}
      className={`relative aspect-square overflow-hidden rounded-full ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Bottom layer: Logo */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          opacity: prefersReducedMotion.current || isTouchDevice.current ? 0 : logoOpacity,
          transition: 'opacity 120ms ease-out',
        }}
      >
        <img
          src={logoSrc}
          alt={`${alt} logo`}
          className="w-full h-full object-contain p-4"
        />
      </div>

      {/* Middle layer: Profile photo (visible only when idle) */}
      <img
        ref={imageRef}
        src={imageSrc}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          opacity: imageOpacity,
          transition: 'opacity 80ms ease-out',
        }}
      />

      {/* Top layer: Canvas with progressive dissolve */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          opacity: isFragmentsReady && !prefersReducedMotion.current && !isTouchDevice.current ? canvasOpacity : 0,
          transition: 'opacity 80ms ease-out',
        }}
      />
    </div>
  );
});

InteractiveParticlePortrait.displayName = 'InteractiveParticlePortrait';

export default InteractiveParticlePortrait;

// Made with Bob
