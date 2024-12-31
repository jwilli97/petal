import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface ScrollFrameProps {
  totalFrames: number;
  startFrame?: number;
}

const ScrollFrameAnimation = ({ totalFrames }: { totalFrames: number }) => {
  const [currentFrame, setCurrentFrame] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadedFrames, setLoadedFrames] = useState<number>(0);
  const rafIdRef = useRef<number | undefined>(undefined);
  const targetFrameRef = useRef(1);
  const imagesCache = useRef<{ [key: number]: HTMLImageElement }>({});

  // Lerp function for smooth transitions
  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  };

  const smoothAnimateToFrame = (targetFrame: number) => {
    const currentFrameValue = currentFrame;
    const difference = targetFrame - currentFrameValue;
    
    if (Math.abs(difference) < 0.01) {
      setCurrentFrame(targetFrame);
      return;
    }

    const newFrame = lerp(currentFrameValue, targetFrame, 0.15);
    setCurrentFrame(Math.max(1, Math.min(newFrame, totalFrames)));
    rafIdRef.current = requestAnimationFrame(() => smoothAnimateToFrame(targetFrame));
  };

  useEffect(() => {
    const preloadImages = async () => {
      if (typeof window === 'undefined') return;

      const imagePromises = Array.from({ length: totalFrames }, (_, i) => {
        return new Promise((resolve, reject) => {
          const frameNumber = i + 1;
          const img = new window.Image();
          const src = `/frames/frame_${String(frameNumber).padStart(4, '0')}.jpg`;
          
          img.onload = () => {
            imagesCache.current[frameNumber] = img;
            setLoadedFrames(prev => prev + 1);
            resolve(img);
          };
          
          img.onerror = (e) => {
            console.error(`Failed to load frame ${frameNumber}:`, src, e);
            reject(new Error(`Failed to load frame ${frameNumber}`));
          };
          
          img.src = src;
        });
      });

      try {
        await Promise.all(imagePromises);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading frames:', error);
        setIsLoading(false);
      }
    };

    preloadImages();
  }, [totalFrames]);

  useEffect(() => {
    const handleScroll = () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }

      const scrollPosition = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollFraction = Math.min(Math.max(scrollPosition / maxScroll, 0), 1);
      const frameIndex = Math.max(1, Math.min(
        Math.round(scrollFraction * totalFrames),
        totalFrames
      ));

      if (frameIndex !== targetFrameRef.current) {
        targetFrameRef.current = frameIndex;
        smoothAnimateToFrame(frameIndex);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [totalFrames, currentFrame]);

  if (isLoading) {
    return (
      <div className="w-full h-[80vh] flex items-center justify-center">
        <p className="text-white">Loading frames: {loadedFrames}/{totalFrames}</p>
      </div>
    );
  }

  const currentFrameNumber = Math.max(1, Math.min(Math.round(currentFrame), totalFrames));
  const frameSrc = `/frames/frame_${String(currentFrameNumber).padStart(4, '0')}.jpg`;

  return (
    <div className="relative w-full">
      <div className="h-[150vh] relative">
        <div className="sticky top-0 w-screen h-[80vh] flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={frameSrc}
              alt={`Frame ${currentFrameNumber}`}
              fill
              className="object-cover"
              priority={currentFrameNumber === 1}
              loading="eager"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollFrameAnimation;