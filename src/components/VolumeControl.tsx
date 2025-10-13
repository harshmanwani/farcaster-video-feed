'use client';

import { Volume2, VolumeX } from 'lucide-react';

interface VolumeControlProps {
  isMuted: boolean;
  onToggle: () => void;
}

export default function VolumeControl({ isMuted, onToggle }: VolumeControlProps) {
  return (
    <button
      onClick={onToggle}
      className="fixed top-4 right-4 lg:right-[calc(50%-300px+1rem)] z-[99999] w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
    >
      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
    </button>
  );
}

