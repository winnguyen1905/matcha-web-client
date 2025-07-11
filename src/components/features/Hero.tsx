import React, { useState, useEffect } from "react";
import {
  HERO_PROFILES,
  BACKGROUND_IMAGE1,
  BACKGROUND_IMAGE2,
} from "../../constants";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Tea Leaf SVG Component - More realistic and thinner design
const TeaLeaf = ({ delay = 0, startX = 0, startY = 0, endX = 0, endY = 0, size = 20 }) => (
  <motion.svg
    width={size}
    height={size * 1.4} // Taller aspect ratio for realistic proportions
    viewBox="0 0 24 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute text-green-500 drop-shadow-lg"
    initial={{ 
      x: startX, 
      y: startY, 
      opacity: 0, 
      scale: 0,
      rotate: 0 
    }}
    animate={{ 
      x: endX, 
      y: endY, 
      opacity: [0, 1, 1, 0.8, 0], 
      scale: [0, 1.2, 1, 0.8, 0],
      rotate: [0, 180, 360, 540, 720],
      transition: {
        duration: 2.5,
        delay,
        ease: "easeOut"
      }
    }}
  >
    {/* Main leaf body - elongated and thinner */}
    <path
      d="M12 2C10 2 8 3 7 5c-1.5 3-1.5 7-1 11c0.5 4 1.5 8 3 11c0.8 1.5 1.5 2.5 2.5 3c0.3 0.2 0.5 0.3 0.5 0.3s0.2-0.1 0.5-0.3c1-0.5 1.7-1.5 2.5-3c1.5-3 2.5-7 3-11c0.5-4 0.5-8-1-11c-1-2-3-3-5-3z"
      fill="currentColor"
      opacity="0.85"
    />
    
    {/* Central vein */}
    <path
      d="M12 4L12 30"
      stroke="rgba(34, 197, 94, 0.7)"
      strokeWidth="0.8"
      fill="none"
    />
    
    {/* Side veins - left */}
    <path
      d="M12 8C10 9 9 11 8.5 13"
      stroke="rgba(34, 197, 94, 0.5)"
      strokeWidth="0.6"
      fill="none"
    />
    <path
      d="M12 12C10.5 13 9.5 15 9 17"
      stroke="rgba(34, 197, 94, 0.5)"
      strokeWidth="0.6"
      fill="none"
    />
    <path
      d="M12 16C10.5 17 9.5 19 9 21"
      stroke="rgba(34, 197, 94, 0.5)"
      strokeWidth="0.6"
      fill="none"
    />
    <path
      d="M12 20C10.5 21 9.5 23 9.5 25"
      stroke="rgba(34, 197, 94, 0.5)"
      strokeWidth="0.6"
      fill="none"
    />
    
    {/* Side veins - right */}
    <path
      d="M12 8C14 9 15 11 15.5 13"
      stroke="rgba(34, 197, 94, 0.5)"
      strokeWidth="0.6"
      fill="none"
    />
    <path
      d="M12 12C13.5 13 14.5 15 15 17"
      stroke="rgba(34, 197, 94, 0.5)"
      strokeWidth="0.6"
      fill="none"
    />
    <path
      d="M12 16C13.5 17 14.5 19 15 21"
      stroke="rgba(34, 197, 94, 0.5)"
      strokeWidth="0.6"
      fill="none"
    />
    <path
      d="M12 20C13.5 21 14.5 23 14.5 25"
      stroke="rgba(34, 197, 94, 0.5)"
      strokeWidth="0.6"
      fill="none"
    />
    
    {/* Subtle edge highlight */}
    <path
      d="M12 2C10.2 2 8.5 2.8 7.8 4.5c-1.3 2.7-1.4 6.5-1 10.5"
      stroke="rgba(34, 197, 94, 0.3)"
      strokeWidth="0.5"
      fill="none"
    />
    <path
      d="M12 2C13.8 2 15.5 2.8 16.2 4.5c1.3 2.7 1.4 6.5 1 10.5"
      stroke="rgba(34, 197, 94, 0.3)"
      strokeWidth="0.5"
      fill="none"
    />
  </motion.svg>
);

const Hero = () => {
  const [currentProfile, setCurrentProfile] = useState<"profile1" | "profile2">(
    "profile1"
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isShrunk, setIsShrunk] = useState(false);
  const [previousBackground, setPreviousBackground] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentProfile((prev) =>
          prev === "profile1" ? "profile2" : "profile1"
        );
        setIsTransitioning(false);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsShrunk(scrollPosition > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track background image changes
  useEffect(() => {
    const currentBackground = HERO_PROFILES[currentProfile].backgroundImage;
    if (previousBackground && previousBackground !== currentBackground) {
      // Background image has changed, trigger tea leaves effect
      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 2500);
    }
    setPreviousBackground(currentBackground);
  }, [currentProfile, previousBackground]);

  const handleAction = (action: string) => {
    if (action === "products") {
      navigate("/products");
    } else {
      document.getElementById(action)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleProfileSwitch = (profileKey: "profile1" | "profile2") => {
    if (currentProfile !== profileKey) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentProfile(profileKey);
        // Keep transitioning state for tea leaves animation
        setTimeout(() => setIsTransitioning(false), 2000);
      }, 300);
    }
  };

  const profile = HERO_PROFILES[currentProfile];

  // Generate enhanced leaf positions for background transitions
  const generateLeafPositions = () => {
    const leaves = [];
    const leafCount = 12; // Increased for better effect

    for (let i = 0; i < leafCount; i++) {
      leaves.push({
        id: i,
        delay: Math.random() * 0.8,
        startX: Math.random() * (window.innerWidth + 200) - 100,
        startY: Math.random() * 300 - 150,
        endX: Math.random() * (window.innerWidth + 200) - 100,
        endY: window.innerHeight + Math.random() * 300,
        size: 15 + Math.random() * 15, // Varying sizes
      });
    }
    return leaves;
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Enhanced Tea Leaves Flying Effect for Background Transitions */}
      <AnimatePresence>
        {isTransitioning && (
          <div className="absolute inset-0 z-20 pointer-events-none">
            {generateLeafPositions().map((leaf) => (
              <TeaLeaf
                key={`${currentProfile}-${leaf.id}`}
                delay={leaf.delay}
                startX={leaf.startX}
                startY={leaf.startY}
                endX={leaf.endX}
                endY={leaf.endY}
                size={leaf.size}
              />
            ))}
            {/* Additional tea leaves from sides */}
            {Array.from({ length: 6 }).map((_, i) => (
              <TeaLeaf
                key={`side-${currentProfile}-${i}`}
                delay={i * 0.1}
                startX={i % 2 === 0 ? -50 : window.innerWidth + 50}
                startY={200 + i * 100}
                endX={i % 2 === 0 ? window.innerWidth + 100 : -100}
                endY={300 + i * 80}
                size={18 + Math.random() * 8}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Background Image with transition effects */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentProfile}-${profile.backgroundImage}`}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${profile.backgroundImage})`,
          }}
          initial={{
            opacity: 0,
            scale: 1,
            filter: "blur(5px)",
          }}
          animate={{
            opacity: 1,
            scale: 1.15,
            filter: "blur(0px)",
            transition: {
              duration: 1.2,
              ease: "easeInOut",
            },
          }}
          exit={{
            opacity: 0,
            scale: 1.3,
            filter: "blur(3px)",
            transition: {
              duration: 1.2,
              ease: "easeInOut",
            },
          }}
        >
          <motion.div
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentProfile}
          className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white"
          initial={{ opacity: 0, x: 100 }}
          animate={{
            opacity: 1,
            x: 0,
            scale: isShrunk ? 0.8 : 1,
            y: isShrunk ? -100 : 0,
          }}
          exit={{ opacity: 0, x: -100 }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
        >
          <motion.h1
            className="text-4xl md:text-6xl font-light mb-6 leading-tight"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            {profile.title}
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed font-extralight"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {profile.description}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(20, 184, 166, 0.4)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAction(profile.button1.action)}
              className="relative overflow-hidden bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-8 py-3.5 font-medium rounded-full transition-all duration-300 hover:shadow-lg hover:from-teal-600 hover:to-emerald-600"
            >
              <span className="relative z-10">{profile.button1.text}</span>
              <span className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-emerald-400/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
            </motion.button>
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(20, 184, 166, 0.4)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAction(profile.button2.action)}
              className="relative overflow-hidden bg-transparent text-white px-8 py-3.5 font-medium rounded-full border-2 border-teal-400/50 hover:border-teal-300 transition-all duration-300 hover:bg-teal-500/10"
            >
              <span className="relative z-10">{profile.button2.text}</span>
              <span className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
            </motion.button>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Profile Indicator - Bottom Left */}
      <motion.div
        className="absolute bottom-8 left-8 flex space-x-3"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <button
          onClick={() => handleProfileSwitch("profile1")}
          className={`relative px-4 py-2 rounded-lg transition-all duration-300 ${
            currentProfile === "profile1"
              ? "bg-teal-500 text-white shadow-[0_0_15px_rgba(20,184,166,0.7)]"
              : "bg-teal-500/50 text-white/70 hover:bg-teal-500/70"
          }`}
        >
          <span className="relative z-10 font-medium">1</span>
          {currentProfile === "profile1" && (
            <>
              <span className="absolute inset-0 rounded-lg border-2 border-white/30" />
              <span className="absolute inset-0 rounded-lg border-2 border-teal-200 animate-pulse" />
            </>
          )}
        </button>
        <button
          onClick={() => handleProfileSwitch("profile2")}
          className={`relative px-4 py-2 rounded-lg transition-all duration-300 ${
            currentProfile === "profile2"
              ? "bg-teal-500 text-white shadow-[0_0_15px_rgba(20,184,166,0.7)]"
              : "bg-teal-500/50 text-white/70 hover:bg-teal-500/70"
          }`}
        >
          <span className="relative z-10 font-medium">2</span>
          {currentProfile === "profile2" && (
            <>
              <span className="absolute inset-0 rounded-lg border-2 border-white/30" />
              <span className="absolute inset-0 rounded-lg border-2 border-teal-200 animate-pulse" />
            </>
          )}
        </button>
      </motion.div>
    </section>
  );
};

export default Hero;
