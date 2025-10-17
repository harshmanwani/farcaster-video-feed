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
      className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors pointer-events-auto"
    >
      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
    </button>
  );
}

