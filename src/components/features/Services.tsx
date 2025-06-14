import React from 'react';
import { ShoppingBag, Wrench, Truck, Users } from 'lucide-react';
import { SERVICES } from '../../constants';

const Services = () => {
  const { title, description, services } = SERVICES;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShoppingBag':
        return <ShoppingBag className="w-8 h-8 text-blue-600" />;
      case 'Wrench':
        return <Wrench className="w-8 h-8 text-blue-600" />;
      case 'Truck':
        return <Truck className="w-8 h-8 text-blue-600" />;
      case 'Users':
        return <Users className="w-8 h-8 text-blue-600" />;
      default:
        return null;
    }
  };

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex justify-center mb-4">
                {getIcon(service.icon)}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;