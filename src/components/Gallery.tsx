import React from 'react';

const Gallery = () => {
  const images = [
    {
      src: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg',
      alt: 'Interior view of our welcoming space'
    },
    {
      src: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
      alt: 'Product display showcase'
    },
    {
      src: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
      alt: 'Community gathering area'
    },
    {
      src: 'https://images.pexels.com/photos/1181343/pexels-photo-1181343.jpeg',
      alt: 'Professional service area'
    },
    {
      src: 'https://images.pexels.com/photos/1181715/pexels-photo-1181715.jpeg',
      alt: 'Customer consultation space'
    },
    {
      src: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg',
      alt: 'Featured products corner'
    }
  ];

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Gallery
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Take a visual journey through Emery's Corner and see what makes our space 
            so special and welcoming to our community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <div 
              key={index}
              className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white text-sm font-medium">{image.alt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;