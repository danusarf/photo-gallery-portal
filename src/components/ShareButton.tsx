import { useState, useEffect } from 'react';
import { useGallerySharing } from '@/hooks/useGallerySharing';
import { Button } from './ui/button';
import { Share2, Link as LinkIcon, Check } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ShareButtonProps {
  galleryId: string;
  isShared: boolean;
  shareCode: string;
  className?: string;
}

export function ShareButton({
  galleryId,
  isShared: initialIsShared,
  shareCode,
  className,
}: ShareButtonProps) {
  const {
    isShared,
    shareLink,
    isCopying,
    isToggling,
    toggleSharing,
    copyShareLinkToClipboard,
  } = useGallerySharing({
    galleryId,
    initialIsShared,
    shareCode,
  });

  const [showCopied, setShowCopied] = useState(false);

  useEffect(() => {
    if (showCopied) {
      const timer = setTimeout(() => setShowCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showCopied]);

  const handleCopyLink = async () => {
    const success = await copyShareLinkToClipboard();
    if (success) {
      setShowCopied(true);
    }
  };

  return (
    <DropdownMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant={isShared ? 'default' : 'outline'}
                size="sm"
                className={className}
                disabled={isToggling}
              >
                <Share2 className="mr-2 h-4 w-4" />
                {isShared ? 'Shared' : 'Share'}
                {isToggling && '...'}
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isShared ? 'Manage sharing options' : 'Share this gallery'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={handleCopyLink}
          disabled={!isShared || isCopying}
          className="cursor-pointer"
        >
          <LinkIcon className="mr-2 h-4 w-4" />
          {showCopied ? (
            <span className="flex items-center">
              <Check className="mr-1 h-4 w-4 text-green-500" />
              Copied!
            </span>
          ) : isCopying ? (
            'Copying...'
          ) : (
            'Copy share link'
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={toggleSharing}
          className="cursor-pointer"
          disabled={isToggling}
        >
          {isShared ? 'Disable sharing' : 'Enable sharing'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
