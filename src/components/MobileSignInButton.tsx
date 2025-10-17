'use client';

import { NeynarAuthButton, useNeynarContext } from "@neynar/react";
import FarcasterIcon from "@/components/icons/farcaster";
import { cn } from "@/lib/utils";

export default function MobileSignInButton({ className }: { className?: string }) {
  const { user } = useNeynarContext();

  return (
    <>
      {/* Mobile: Auth button or user info in top right */}
      <div className={cn("lg:hidden absolute top-4 right-4 z-50", className)}>
        {user ? (
          <div className="[&>button]:!flex [&>button]:!items-center [&>button]:!gap-2 [&>button]:!bg-black/50 [&>button]:!backdrop-blur-sm [&>button]:!rounded-full [&>button]:!px-3 [&>button]:!py-2 [&>button]:!border-0 [&>button]:!shadow-lg hover:[&>button]:!bg-black/60 [&>button]:!transition-colors [&>button>img]:!w-6 [&>button>img]:!h-6 [&>button>img]:!rounded-full [&>button>span]:!text-white [&>button>span]:!text-sm [&>button>span]:!font-medium">
            <NeynarAuthButton />
          </div>
        ) : (
          <div className="[&>button]:!flex [&>button]:!items-center [&>button]:!gap-2 [&>button]:!bg-white/90 [&>button]:!backdrop-blur-sm [&>button]:!rounded-full [&>button]:!px-4 [&>button]:!py-2 [&>button]:!shadow-lg hover:[&>button]:!bg-white [&>button]:!transition-colors [&>button]:!border-0 [&>button]:!text-sm [&>button]:!font-medium [&>button]:!text-gray-900 [&>button>svg]:!w-5 [&>button>svg]:!h-5 [&>button>span]:!text-sm">
            <NeynarAuthButton label="Sign in" icon={<FarcasterIcon key="icon-farcaster-mobile" />} />
          </div>
        )}
      </div>
    </>
  );
}

