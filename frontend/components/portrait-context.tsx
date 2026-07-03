"use client";

import { createContext, useContext, RefObject } from 'react';
import { InteractiveParticlePortraitRef } from './interactive-particle-portrait';

interface PortraitContextType {
  portraitRef: RefObject<InteractiveParticlePortraitRef | null> | null;
}

const PortraitContext = createContext<PortraitContextType>({
  portraitRef: null,
});

export function usePortraitRef() {
  return useContext(PortraitContext);
}

export function PortraitProvider({
  children,
  portraitRef,
}: {
  children: React.ReactNode;
  portraitRef: RefObject<InteractiveParticlePortraitRef | null> | null;
}) {
  return (
    <PortraitContext.Provider value={{ portraitRef }}>
      {children}
    </PortraitContext.Provider>
  );
}

// Made with Bob