import { useState, useEffect } from 'react';
import { Check, Copy, Link as LinkIcon, Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { useToast } from './ui/use-toast';
import { generateShareLink } from '@/lib/share';

interface GalleryShareOptionsProps {
  galleryId: string;
  isShared: boolean;
  shareCode: string;
  onShareToggle: (isShared: boolean) => void;
}

export function GalleryShareOptions({
  galleryId,
  isShared: initialIsShared,
  shareCode,
  onShareToggle,
}: GalleryShareOptionsProps) {
  const [isShared, setIsShared] = useState(initialIsShared);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const shareLink = generateShareLink(shareCode);

  useEffect(() => {
    setIsShared(initialIsShared);
  }, [initialIsShared]);

  const handleToggleShare = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/galleries/${galleryId}/toggle-share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update sharing settings');
      }

      const data = await response.json();
      const newIsShared = data.isShared;
      setIsShared(newIsShared);
      onShareToggle(newIsShared);
      
      if (newIsShared) {
        toast({
          title: 'Sharing enabled',
          description: 'Your gallery is now shareable with the link below.',
        });
      } else {
        toast({
          title: 'Sharing disabled',
          description: 'Your gallery is no longer shareable.',
        });
      }
    } catch (error) {
      console.error('Error toggling share status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update sharing settings. Please try again.',
        variant: 'destructive',
      });
      // Revert the UI state on error
      setIsShared(!isShared);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setIsCopied(true);
      toast({
        title: 'Link copied!',
        description: 'The share link has been copied to your clipboard.',
      });
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast({
        title: 'Error',
        description: 'Failed to copy link to clipboard. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Gallery</DialogTitle>
          <DialogDescription>
            {isShared
              ? 'Share this link with others to give them access to your gallery.'
              : 'Enable sharing to generate a shareable link for your gallery.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <Label htmlFor="share-toggle" className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="share-toggle"
                    className="sr-only"
                    checked={isShared}
                    onChange={handleToggleShare}
                    disabled={isLoading}
                  />
                  <div
                    className={`block w-14 h-8 rounded-full ${
                      isShared ? 'bg-primary' : 'bg-muted-foreground/20'
                    }`}
                  ></div>
                  <div
                    className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                      isShared ? 'translate-x-6' : ''
                    }`}
                  ></div>
                </div>
                <span className="ml-3 text-sm font-medium">
                  {isShared ? 'Sharing enabled' : 'Sharing disabled'}
                </span>
              </Label>
            </div>
          </div>

          {isShared && (
            <div className="space-y-2">
              <Label htmlFor="share-link">Shareable link</Label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Input
                    id="share-link"
                    value={shareLink}
                    readOnly
                    className="pr-10"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {isCopied ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <Copy
                        className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer"
                        onClick={handleCopyLink}
                      />
                    )}
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Anyone with this link can view your gallery.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
