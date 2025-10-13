'use client';

import { useEffect, useRef, useState } from 'react';
import { NeynarChannel } from '@/types/neynar';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

interface ChannelSelectorProps {
  channels: NeynarChannel[];
  selectedChannel: NeynarChannel | null;
  onChannelSelect: (channel: NeynarChannel | null) => void;
}

export default function ChannelSelector({ 
  channels, 
  selectedChannel, 
  onChannelSelect 
}: ChannelSelectorProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChannelClick = (channel: NeynarChannel | null) => {
    onChannelSelect(channel);
    setIsDropdownOpen(false);
  };

  return (
    <div className="absolute top-5 left-1/2 -translate-x-1/2 z-[60]" ref={dropdownRef}>
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white font-semibold hover:bg-white/20 transition-colors"
          data-dropdown
        >
          <span className="text-sm">
            {selectedChannel ? selectedChannel.name : 'All Videos'}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isDropdownOpen && (
          <div 
            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-64 bg-white rounded-lg shadow-2xl overflow-hidden z-[70]"
            data-dropdown
          >
            <div className="max-h-96 overflow-y-auto">
              <button
                onClick={() => handleChannelClick(null)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors ${!selectedChannel ? 'bg-gray-50' : ''}`}
              >
                <div className="font-semibold text-gray-900">All Videos</div>
                <div className="text-xs text-gray-500">Trending & from all your channels</div>
              </button>
              {channels.length === 0 ? (
                <div className="px-4 py-3 text-gray-500 text-sm">Loading channels...</div>
              ) : (
                channels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => handleChannelClick(channel)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors ${selectedChannel?.id === channel.id ? 'bg-gray-50' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      {channel.image_url && (
                        <div className="relative w-8 h-8 rounded overflow-hidden flex-shrink-0">
                          <Image 
                            src={channel.image_url} 
                            alt={channel.name}
                            fill
                            sizes="32px"
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 truncate">{channel.name}</div>
                        <div className="text-xs text-gray-500">{channel.follower_count?.toLocaleString() || 0} followers</div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

