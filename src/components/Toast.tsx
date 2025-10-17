'use client';

interface ToastProps {
  message: string;
  show: boolean;
}

export default function Toast({ message, show }: ToastProps) {
  if (!show) return null;

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[100000] bg-black/80 text-white px-4 py-2 rounded-full text-sm animate-fade-in">
      {message}
    </div>
  );
}

