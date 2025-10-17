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
      className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/80 transition-all pointer-events-auto shadow-lg"
    >
      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
    </button>
  );
}

