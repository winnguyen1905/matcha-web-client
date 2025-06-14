import React, { useState, useEffect } from 'react';
import { HERO_PROFILES } from '../../constants';
import { motion, AnimatePresence } from 'framer-motion';

const Hero = () => {
  const [currentProfile, setCurrentProfile] = useState<'profile1' | 'profile2'>('profile1');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isShrunk, setIsShrunk] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentProfile(prev => prev === 'profile1' ? 'profile2' : 'profile1');
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

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScroll = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const profile = HERO_PROFILES[currentProfile];

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentProfile}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${profile.backgroundImage})`
          }}
          initial={{ opacity: 0, scale: 1 }}
          animate={{ 
            opacity: 1, 
            scale: 1.15,
            transition: {
              duration: 1.2,
              ease: "easeInOut"
            }
          }}
          exit={{ 
            opacity: 0, 
            scale: 1.3,
            transition: {
              duration: 1.2,
              ease: "easeInOut"
            }
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
            y: isShrunk ? -100 : 0
          }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ 
            duration: 0.5,
            ease: "easeOut"
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
              whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(20, 184, 166, 0.4)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleScroll(profile.button1.action)}
              className="relative overflow-hidden bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-8 py-3.5 font-medium rounded-full transition-all duration-300 hover:shadow-lg hover:from-teal-600 hover:to-emerald-600"
            >
              <span className="relative z-10">{profile.button1.text}</span>
              <span className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-emerald-400/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(20, 184, 166, 0.4)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleScroll(profile.button2.action)}
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
          onClick={() => {
            setIsTransitioning(true);
            setTimeout(() => {
              setCurrentProfile('profile1');
              setIsTransitioning(false);
            }, 300);
          }}
          className={`relative px-4 py-2 rounded-lg transition-all duration-300 ${
            currentProfile === 'profile1' 
              ? 'bg-teal-500 text-white shadow-[0_0_15px_rgba(20,184,166,0.7)]' 
              : 'bg-teal-500/50 text-white/70 hover:bg-teal-500/70'
          }`}
        >
          <span className="relative z-10 font-medium">1</span>
          {currentProfile === 'profile1' && (
            <>
              <span className="absolute inset-0 rounded-lg border-2 border-white/30" />
              <span className="absolute inset-0 rounded-lg border-2 border-teal-200 animate-pulse" />
            </>
          )}
        </button>
        <button
          onClick={() => {
            setIsTransitioning(true);
            setTimeout(() => {
              setCurrentProfile('profile2');
              setIsTransitioning(false);
            }, 300);
          }}
          className={`relative px-4 py-2 rounded-lg transition-all duration-300 ${
            currentProfile === 'profile2' 
              ? 'bg-teal-500 text-white shadow-[0_0_15px_rgba(20,184,166,0.7)]' 
              : 'bg-teal-500/50 text-white/70 hover:bg-teal-500/70'
          }`}
        >
          <span className="relative z-10 font-medium">2</span>
          {currentProfile === 'profile2' && (
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