import React from 'react';
import Hero from '../../components/features/Hero';
import About from '../../components/features/About';
import Services from '../../components/features/Services';
import Contact from '../../components/features/Contact';
import FeaturedProducts from '../../components/features/FeaturedProducts';

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <About />
      <Services />
      <Contact />
    </>
  );
};

export default HomePage; 