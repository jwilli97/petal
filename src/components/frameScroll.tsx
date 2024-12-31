import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface ScrollFrameProps {
  totalFrames: number;
  startFrame?: number;
}

const ScrollFrameAnimation: React.FC<ScrollFrameProps> = ({ 
  totalFrames,
  startFrame = 1 
}) => {
  const [currentFrame, setCurrentFrame] = useState(startFrame);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedFrames, setLoadedFrames] = useState(0);

  useEffect(() => {
    // Preload all frames
    const preloadImages = async () => {
      const imagePromises = Array.from({ length: totalFrames }, (_, i) => {
        return new Promise((resolve) => {
          const img = new window.Image();
          img.src = `/frames/frame_${String(i + 1).padStart(4, '0')}.jpg`;
          img.onload = () => {
            setLoadedFrames(prev => prev + 1);
            resolve(null);
          };
        });
      });

      await Promise.all(imagePromises);
      setIsLoading(false);
    };

    preloadImages();
  }, [totalFrames]);

  useEffect(() => {
    const handleScroll = () => {
      // Get scroll position relative to document height
      const scrollFraction = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      // Calculate frame based on scroll position
      const frame = Math.min(
        Math.ceil(scrollFraction * totalFrames),
        totalFrames
      );
      setCurrentFrame(Math.max(1, frame));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [totalFrames]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <div className="mb-4">Loading Frames...</div>
          <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-300 rounded-full"
              style={{ width: `${(loadedFrames / totalFrames) * 100}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-gray-400">
            {loadedFrames} / {totalFrames} frames
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="h-[150vh] relative">
        <div className="sticky top-0 w-screen h-[80vh] flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={`/frames/frame_${String(currentFrame).padStart(4, '0')}.jpg`}
              alt={`Frame ${currentFrame}`}
              fill
              className="object-cover"
              priority={currentFrame === 1}
            />
            
            {/* Adjust overlay text positioning */}
            <div 
              className="absolute left-8 text-white transition-opacity duration-300"
              style={{ 
                opacity: currentFrame > totalFrames * 0.3 ? 1 : 0 
              }}
            >
              <h2 className="text-4xl font-bold mb-4">Experience Innovation</h2>
              <p className="text-xl">Designed with Intention</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollFrameAnimation;