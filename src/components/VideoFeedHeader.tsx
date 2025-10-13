'use client';

import { memo } from 'react';
import { NeynarAuthButton, useNeynarContext } from "@neynar/react";

const FarcasterIcon = memo(() => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 1000 1000"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="1000" height="1000" rx="200" fill="#8A63D2"/>
    <path
      d="M257.778 155.556H742.222V844.445H671.111V528.889H670.414C662.554 441.677 589.258 373.333 500 373.333C410.742 373.333 337.446 441.677 329.586 528.889H328.889V844.445H257.778V155.556Z"
      fill="white"
    />
    <path
      d="M128.889 253.333L157.778 351.111H182.222V746.667C169.949 746.667 160 756.616 160 768.889V795.556H155.556C143.283 795.556 133.333 805.505 133.333 817.778V844.445H382.222V817.778C382.222 805.505 372.273 795.556 360 795.556H355.556V768.889C355.556 756.616 345.606 746.667 333.333 746.667H306.667V253.333H128.889Z"
      fill="white"
    />
    <path
      d="M675.556 746.667C663.283 746.667 653.333 756.616 653.333 768.889V795.556H648.889C636.616 795.556 626.667 805.505 626.667 817.778V844.445H875.556V817.778C875.556 805.505 865.606 795.556 853.333 795.556H848.889V768.889C848.889 756.616 838.94 746.667 826.667 746.667V351.111H851.111L880 253.333H702.222V746.667H675.556Z"
      fill="white"
    />
  </svg>
));

FarcasterIcon.displayName = 'FarcasterIcon';

export default function VideoFeedHeader() {
  const { user } = useNeynarContext();

  return (
    <>
      {/* Desktop: Title on left, auth button on right */}
      <div className="hidden lg:block absolute top-8 left-8 z-50">
        <h1 className="text-black text-2xl font-bold">Farcaster</h1>
      </div>

      <div className="hidden lg:block absolute top-8 right-8 z-50">
        <NeynarAuthButton icon={<FarcasterIcon key="icon-farcaster-desktop" />} />
      </div>

      {/* Mobile: Auth button or user info in top left */}
      <div className="lg:hidden absolute top-4 left-4 z-50">
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

