import { useState, useRef, useEffect } from 'react';
import { Pause, Play } from 'lucide-react';

const BackgroundMusic = () => {
  const [isPlaying, setIsPlaying] = useState(true); // Start with true for autoplay
  const audioRef = useRef<HTMLAudioElement>(null);
  const hasInteracted = useRef(false);

  // Handle play/pause
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.log("Audio play failed:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Set initial volume and handle audio loading
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleFirstInteraction = () => {
      if (!hasInteracted.current) {
        hasInteracted.current = true;
        audio.volume = 0.5; // Set default volume to 50%
        audio.loop = true; // Make the audio loop
        
        // Try to play audio after user interaction
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("Autoplay prevented:", error);
            // Autoplay was prevented, we'll wait for user interaction
            setIsPlaying(false);
          });
        }
      }
    };

    // Try to play on first interaction
    window.addEventListener('click', handleFirstInteraction, { once: true });
    
    // Cleanup
    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);
  
  // Add a one-time click handler to the document to enable audio
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (audioRef.current && isPlaying) {
        audioRef.current.play().catch(console.error);
      }
      document.removeEventListener('click', handleFirstInteraction);
    };
    
    document.addEventListener('click', handleFirstInteraction);
    return () => {
      document.removeEventListener('click', handleFirstInteraction);
    };
  }, [isPlaying]);
  
  // Log component mount and state changes
  useEffect(() => {
    console.log('BackgroundMusic mounted, isPlaying:', isPlaying);
  }, [isPlaying]);

  return (
    <div className="relative z-50">
      <button
        onClick={togglePlay}
        className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-emerald-700 to-teal-800 rounded-full shadow-md text-white hover:shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-opacity-50 transform active:scale-95"
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
      >
        {isPlaying ? (
          <Pause size={20} className="text-white" />
        ) : (
          <Play size={20} className="ml-0.5 text-white" />
        )}
      </button>
      
      <audio
        ref={audioRef}
        loop
        src={`/sounds/3 Hours of Amazing Nature Scenery & Relaxing Music for Stress Relief..mp3`}
        preload="metadata"
        onError={(e) => console.error('Audio loading error:', e)}
        onCanPlay={() => console.log('Audio can play')}
        onPlay={() => console.log('Audio started playing')}
      />
    </div>
  );
};

export default BackgroundMusic;
