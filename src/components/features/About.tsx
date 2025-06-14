import React, { useState, useEffect } from 'react';
import { Award, Clock, Star, Users } from 'lucide-react';
import { 
  TypewriterTextProps, 
  FadeInTextProps, 
  AnimatedCounterProps, 
  WaveTextProps,
  FeatureItem as FeatureItemType,
  StatNumberItem
} from '../../types/about-types';

const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  text, 
  delay = 0, 
  speed = 50, 
  className = "", 
  infinite = false, 
  pauseDuration = 2000 
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!infinite) {
      // Original single-run logic
      const timer = setTimeout(() => {
        if (currentIndex < text.length) {
          setDisplayText(prev => prev + text[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        }
      }, delay + (currentIndex * speed));
      return () => clearTimeout(timer);
    } else {
      // Infinite loop logic with initial delay
      if (!hasStarted) {
        const initialTimer = setTimeout(() => {
          setHasStarted(true);
        }, delay);
        return () => clearTimeout(initialTimer);
      }

      const timer = setTimeout(() => {
        if (isPaused) {
          setIsPaused(false);
          setIsDeleting(true);
          return;
        }

        if (isDeleting) {
          if (displayText.length > 0) {
            setDisplayText(prev => prev.slice(0, -1));
          } else {
            setIsDeleting(false);
            setCurrentIndex(0);
          }
        } else {
          if (currentIndex < text.length) {
            setDisplayText(prev => prev + text[currentIndex]);
            setCurrentIndex(prev => prev + 1);
          } else {
            setIsPaused(true);
          }
        }
      }, isPaused ? pauseDuration : isDeleting ? speed / 3 : speed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, delay, speed, infinite, isDeleting, isPaused, displayText, pauseDuration, hasStarted]);

  return (
    <span className={className}>
      {displayText}
      <span className={`inline-block w-0.5 h-6 bg-teal-500 ml-1 ${infinite ? 'animate-pulse' : 'animate-pulse'}`}>
        |
      </span>
    </span>
  );
};

const FadeInText: React.FC<FadeInTextProps> = ({ 
  children, 
  delay = 0, 
  direction = 'up', 
  className = "" 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const directionClasses = {
    up: 'translate-y-8',
    down: '-translate-y-8',
    left: 'translate-x-8',
    right: '-translate-x-8'
  };

  return (
    <div 
      className={`transition-all duration-1000 ease-out ${
        isVisible 
          ? 'opacity-100 translate-x-0 translate-y-0' 
          : `opacity-0 ${directionClasses[direction]}`
      } ${className}`}
    >
      {children}
    </div>
  );
};

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ 
  target, 
  duration = 2000, 
  delay = 0 
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const increment = target / (duration / 16);
      let current = 0;
      
      const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCount(target);
          clearInterval(counter);
        } else {
          setCount(Math.floor(current));
        }
      }, 16);

      return () => clearInterval(counter);
    }, delay);

    return () => clearTimeout(timer);
  }, [target, duration, delay]);

  return <span>{count.toLocaleString()}</span>;
};

const WaveText: React.FC<WaveTextProps> = ({ 
  text, 
  delay = 0, 
  className = "" 
}) => {
  return (
    <span className={className}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          className="inline-block animate-bounce"
          style={{
            animationDelay: `${delay + (index * 0.1)}s`,
            animationDuration: '1s',
            animationIterationCount: '1'
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
};

const About = () => {
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStats(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const features: FeatureItemType[] = [
    {
      id: 1,
      title: 'AWARD-WINNING MATCHA',
      description:
        'Sencha is recognized for delivering top-tier Japanese matcha, sourced from Uji and Nishio and celebrated for its purity and taste.',
      icon: React.createElement(Award, { className: "w-8 h-8 text-green-600" })
    },
    {
      id: 2,
      title: 'PREMIUM QUALITY',
      description:
        'We offer 100% authentic, stone-ground matcha from Japan—vibrant, smooth, and rich in antioxidants.',
      icon: React.createElement(Star, { className: "w-8 h-8 text-green-600" })
    },
    {
      id: 3,
      title: 'LOVED BY OUR COMMUNITY',
      description:
        'From tea lovers to wellness enthusiasts, our U.S. community trusts Sencha for both tradition and taste.',
      icon: React.createElement(Users, { className: "w-8 h-8 text-green-600" })
    },
    {
      id: 4,
      title: 'FAST U.S. SHIPPING',
      description:
        'Based in the USA, we deliver your matcha quickly and reliably—fresh from Japan to your door.',
      icon: React.createElement(Clock, { className: "w-8 h-8 text-green-600" })
    }
  ];

  const statsData: StatNumberItem[] = [
    { number: 10000, label: 'Happy Customers', suffix: '+' },
    { number: 15, label: 'Premium Varieties', suffix: '' },
    { number: 99, label: 'Satisfaction Rate', suffix: '%' },
    { number: 5, label: 'Years of Excellence', suffix: '+' }
  ];

  return (
    <section id="about" className="relative py-24 bg-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/clean-textile.png')] opacity-5"></div>
      <div className="absolute -right-32 -top-32 w-96 h-96 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      <div className="absolute -left-32 -bottom-32 w-96 h-96 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center mb-16 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
          {/* Text Content */}
          <div>
            <FadeInText delay={200} className="mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                <span className="inline-block">
                  <WaveText text="About" delay={0.2} />
                  <span className="mx-3 text-teal-600 animate-bounce">✨</span>
                  <WaveText text="Sencha" delay={0.8} className="text-teal-700" />
                </span>
              </h2>
            </FadeInText>

            <div className="space-y-6 text-gray-700 leading-relaxed">
              <FadeInText delay={800} direction="right">
                <div className="text-lg mb-4">
                  <TypewriterText 
                    text="🍵 Sencha - Pure Japanese Matcha, Delivered in the USA 🌿"
                    delay={500}
                    speed={60}
                    className="font-semibold text-teal-800 text-xl"
                    infinite={true}
                    pauseDuration={2000}
                  />
                </div>
              </FadeInText>

              <FadeInText delay={1500} direction="left">
                <p className="text-lg">
                  At Sencha, we bring the essence of Japan's matcha culture straight to your cup—wherever you are in the U.S.
                </p>
              </FadeInText>

              <FadeInText delay={2000} direction="up">
                <p>
                  Sourced directly from the rolling tea fields of Uji and Nishio, Japan, our matcha is hand-picked, stone-ground, and shipped fresh to preserve its vibrant color, smooth taste, and natural health benefits.
                </p>
              </FadeInText>

              <FadeInText delay={2500} direction="right">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-4 relative inline-block">
                    <TypewriterText 
                      text="Why Sencha?"
                      delay={1000}
                      speed={100}
                      infinite={true}
                      pauseDuration={1500}
                      className="text-teal-800"
                    />
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-teal-300 to-emerald-300 rounded-full animate-pulse"></span>
                  </h3>
                </div>
              </FadeInText>

              <ul className="space-y-2">
                {[
                  { emoji: '🍃', text: 'Authentic Japanese Matcha – Grown and crafted in Japan, not blended or diluted' },
                  { emoji: '🥄', text: 'Ceremonial & Culinary Grades – Perfect for traditional tea or modern matcha lattes' },
                  { emoji: '🌎', text: 'Based in the USA – Fast, reliable shipping across the country' },
                  { emoji: '🌱', text: 'Sustainable & Direct Trade – Supporting small Japanese farms and eco-friendly practices' },
                  { emoji: '✨', text: 'No Additives, Just Matcha – 100% pure, premium green tea powder' }
                ].map((item, index) => (
                  <FadeInText key={index} delay={3000 + (index * 200)} direction="left">
                    <li className="flex items-start group">
                      <span className="mr-3 text-teal-600 group-hover:scale-110 transition-transform duration-300 text-xl">
                        {item.emoji}
                      </span>
                      <span className="group-hover:text-teal-800 transition-colors duration-300">
                        {item.text}
                      </span>
                    </li>
                  </FadeInText>
                ))}
              </ul>
            </div>

            <FadeInText delay={4500} direction="up">
              <div className="mt-10">
                <button
                  onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                  className="relative bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-8 py-4 rounded-full font-semibold 
                           shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1 
                           hover:from-teal-600 hover:to-emerald-600 overflow-hidden group"
                >
                  <span className="relative z-10">VIEW OUR SERVICES</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 transform translate-x-full 
                                group-hover:translate-x-0 transition-transform duration-300"></div>
                </button>
              </div>
            </FadeInText>
          </div>

          {/* Images */}
          <FadeInText delay={1000} direction="right" className="flex flex-col gap-4 w-full">
            <div className="relative group w-full">
              <div className="overflow-hidden rounded-xl shadow-lg transform group-hover:-translate-y-2 transition-all duration-500">
                <img
                  src="https://info.ehl.edu/hubfs/Blog-EHL-Insights/Images-EHL-Insights/EHL-Passugg_Blog_Matcha_Header.jpg"
                  alt="Premium Matcha Tea"
                  className="w-full h-auto max-w-full object-contain transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
            <div className="relative group w-full">
              <div className="overflow-hidden rounded-xl shadow-lg transform group-hover:-translate-y-2 transition-all duration-500">
                <img
                  src="https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/https://cms-prod.s3-sgn09.fptcloud.com/7_cong_dung_tuyet_voi_cua_matcha_doi_voi_suc_khoe_2_df395cab3c.jpg"
                  alt="Matcha Preparation"
                  className="w-full h-auto max-w-full object-contain transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </FadeInText>
        </div>

        {/* Stats Section */}
        {showStats && (
          <FadeInText delay={0} direction="up" className="mb-16">
            <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-8 shadow-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {statsData.map((stat, index) => (
                  <div key={index} className="space-y-2">
                    <div className="text-3xl md:text-4xl font-bold text-teal-600">
                      <AnimatedCounter 
                        target={stat.number} 
                        duration={2000} 
                        delay={index * 200}
                      />
                      {stat.suffix}
                    </div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeInText>
        )}

        {/* Why Choose Us Section */}
        <div className="relative py-20 overflow-hidden">
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInText delay={5000} direction="up" className="text-center mb-20">
              <h3 className="text-4xl font-bold text-gray-900 mb-5 relative inline-block">
                <TypewriterText 
                  text="Why Choose Sencha"
                  delay={5200}
                  speed={100}
                />
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-pulse"></span>
              </h3>
              <p className="text-gray-600 mt-6 max-w-2xl mx-auto text-lg font-light">
                <TypewriterText 
                  text="Experience the finest Japanese matcha, crafted with tradition and delivered with care"
                  delay={6000}
                  speed={40}
                />
              </p>
            </FadeInText>

            <div className="relative">
              <div className="relative overflow-x-auto pb-12">
                <div className="flex space-x-8 min-w-max px-2">
                  {features.map((feature, index) => (
                    <FadeInText
                      key={index}
                      delay={6500 + (index * 300)}
                      direction="up"
                      className="flex-shrink-0 w-80 bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl 
                               transition-all duration-500 ease-out border border-gray-100 
                               hover:-translate-y-2 group cursor-pointer"
                    >
                      <div className="flex justify-center mb-6">
                        <div className="p-4 bg-emerald-50 rounded-full text-emerald-600 group-hover:scale-110 transition-transform duration-300">
                          {React.cloneElement(feature.icon, { className: 'w-6 h-6' })}
                        </div>
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mb-4 text-center font-serif group-hover:text-teal-700 transition-colors duration-300">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 leading-relaxed text-center text-sm group-hover:text-gray-700 transition-colors duration-300">
                        {feature.description}
                      </p>
                      <div className="mt-6 flex justify-center">
                        <div className="w-12 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full 
                                      transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                      </div>
                    </FadeInText>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;