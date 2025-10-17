'use client';

import { NeynarAuthButton, useNeynarContext } from "@neynar/react";
import FarcasterIcon from "@/components/icons/farcaster";
import { cn } from "@/lib/utils";

export default function MobileSignInButton({ className }: { className?: string }) {
  const { user } = useNeynarContext();

  return (
    <div className={cn("md:hidden fixed top-6 right-6 z-50", className)}>
      <div className="flex items-center gap-2 bg-black/80 dark:bg-gray-800/90 backdrop-blur-md rounded-full px-2 py-1 shadow-lg border border-white/10">
        {user ? (
          <div className="[&>button]:!flex [&>button]:!items-center [&>button]:!gap-2 [&>button]:!bg-transparent [&>button]:!px-3 [&>button]:!py-1.5 [&>button]:!border-0 hover:[&>button]:!bg-white/20 [&>button]:!transition-all [&>button]:!rounded-full [&>button>img]:!w-5 [&>button>img]:!h-5 [&>button>img]:!rounded-full [&>button>span]:!text-white [&>button>span]:!text-sm [&>button>span]:!font-medium">
            <NeynarAuthButton />
          </div>
        ) : (
          <div className="[&>button]:!flex [&>button]:!items-center [&>button]:!gap-2 [&>button]:!bg-transparent [&>button]:!text-white hover:[&>button]:!bg-white/20 [&>button]:!transition-all [&>button]:!text-sm [&>button]:!font-medium [&>button]:!px-3 [&>button]:!py-1.5 [&>button]:!rounded-full [&>button]:!border-0 [&>button>svg]:!w-4 [&>button>svg]:!h-4 [&>button>span]:!text-sm">
            <NeynarAuthButton label="Sign in" icon={<FarcasterIcon key="icon-farcaster-mobile" />} />
          </div>
        )}
      </div>
    </div>
  );
}

