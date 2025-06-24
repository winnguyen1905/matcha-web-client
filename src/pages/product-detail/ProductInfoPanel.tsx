import React, { useEffect, useRef } from 'react';
import { X, Award, Leaf, Package, Globe, Users } from 'lucide-react';
import { gsap } from 'gsap';
import { Product } from '../../hooks/Product';

interface ProductInfoPanelProps {
  show: boolean;
  onClose: () => void;
  getProductData: () => Product;
  flavorNotes: string[];
}

const ProductInfoPanel: React.FC<ProductInfoPanelProps> = ({
  show,
  onClose,
  getProductData,
  flavorNotes,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement[]>([]);

  // Animation effects
  useEffect(() => {
    if (show && overlayRef.current && panelRef.current) {
      // Reset initial states
      gsap.set(overlayRef.current, { opacity: 0 });
      gsap.set(panelRef.current, { scale: 0.8, opacity: 0, y: 50 });
      gsap.set(headerRef.current, { opacity: 0, y: -20 });
      gsap.set(contentRef.current, { opacity: 0, y: 20 });

      // Entrance animation
      const tl = gsap.timeline();

      tl.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
      })
        .to(panelRef.current, {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "back.out(1.7)"
        }, "-=0.1")
        .to(headerRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out"
        }, "-=0.3")
        .to(contentRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out"
        }, "-=0.2");

      // Animate sections with stagger
      sectionsRef.current.forEach((section: HTMLDivElement, index: number) => {
        if (section) {
          gsap.set(section, { opacity: 0, y: 30 });
          gsap.to(section, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: 0.1 * index,
            ease: "power2.out"
          });
        }
      });

      // Animate flavor notes and certifications
      const tags = panelRef.current.querySelectorAll('.tag-item');
      tags.forEach((tag: Element, index: number) => {
        gsap.set(tag, { scale: 0, opacity: 0 });
        gsap.to(tag, {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          delay: 0.05 * index,
          ease: "back.out(1.7)"
        });
      });

      // Animate icons
      const icons = panelRef.current.querySelectorAll('.animate-icon');
      icons.forEach((icon: Element, index: number) => {
        gsap.set(icon, { scale: 0, rotation: -180 });
        gsap.to(icon, {
          scale: 1,
          rotation: 0,
          duration: 0.6,
          delay: 0.1 * index,
          ease: "back.out(1.7)"
        });
      });

      // Add hover effects to interactive elements
      const hoverElements = panelRef.current.querySelectorAll('.hover-element');
      hoverElements.forEach((element: Element) => {
        const handleMouseEnter = (): void => {
          gsap.to(element, {
            scale: 1.05,
            duration: 0.2,
            ease: "power2.out"
          });
        };

        const handleMouseLeave = (): void => {
          gsap.to(element, {
            scale: 1,
            duration: 0.2,
            ease: "power2.out"
          });
        };

        element.addEventListener('mouseenter', handleMouseEnter);
        element.addEventListener('mouseleave', handleMouseLeave);

        // Cleanup function stored in element for later removal
        (element as any)._hoverCleanup = () => {
          element.removeEventListener('mouseenter', handleMouseEnter);
          element.removeEventListener('mouseleave', handleMouseLeave);
        };
      });
    }

    // Cleanup function
    return () => {
      if (panelRef.current) {
        const hoverElements = panelRef.current.querySelectorAll('.hover-element');
        hoverElements.forEach((element: Element) => {
          if ((element as any)._hoverCleanup) {
            (element as any)._hoverCleanup();
          }
        });
      }
    };
  }, [show]);

  const handleClose = (): void => {
    if (!overlayRef.current || !panelRef.current) {
      onClose();
      return;
    }

    const tl = gsap.timeline();

    tl.to(panelRef.current, {
      scale: 0.8,
      opacity: 0,
      y: 50,
      duration: 0.3,
      ease: "power2.in"
    })
      .to(overlayRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
        onComplete: onClose
      }, "-=0.1");
  };

  if (!show) return null;

  const addToRefs = (el: HTMLDivElement | null): void => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  // Type-safe product data access
  const productData = getProductData();

  // Fake certifications and description for demo/professional look
  const fakeCertifications = [
    'JAS Organic',  
    'USDA Organic',
    'Non-GMO',
    'Rainforest Alliance',
    'ISO 22000'
  ];
  const fakeDescription =
    'Experience the finest ceremonial matcha, stone-ground from first flush spring leaves. Our matcha is certified organic, non-GMO, and produced using traditional methods to preserve its vibrant color, rich umami, and health benefits. Perfect for both traditional tea ceremonies and modern recipes.';

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <div
        ref={panelRef}
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div
          ref={headerRef}
          className="p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-blue-50"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Product Information
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200 hover-element rounded-full p-2 hover:bg-gray-100"
              type="button"
              aria-label="Close panel"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div ref={contentRef} className="p-6 space-y-8">
          {/* Basic Information */}
          <div ref={addToRefs} className="hover-element p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="animate-icon text-emerald-600" size={20} />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="hover-element p-3 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200">
                <p className="text-sm text-gray-500">Name</p>
                <p className="text-gray-900 font-medium">{productData.name || 'N/A'}</p>
              </div>
              <div className="hover-element p-3 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200">
                <p className="text-sm text-gray-500">Brand</p>
                <p className="text-gray-900 font-medium">{productData.attributes?.['brand'] || 'N/A'}</p>
              </div>
              <div className="hover-element p-3 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200">
                <p className="text-sm text-gray-500">Category</p>
                <p className="text-gray-900 font-medium">{productData.category || 'N/A'}</p>
              </div>
              <div className="hover-element p-3 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200">
                <p className="text-sm text-gray-500">Origin</p>
                <p className="text-gray-900 font-medium">{productData.attributes?.['origin'] || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div ref={addToRefs} className="hover-element p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
            <p className="text-gray-700 leading-relaxed">{productData.description || fakeDescription}</p>
          </div>

          {/* Add certifications section below description */}
          {fakeCertifications.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {fakeCertifications.map(cert => (
                <span key={cert} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 shadow-sm">
                  <Award className="h-4 w-4 mr-1 text-amber-500" />
                  {cert}
                </span>
              ))}
            </div>
          )}

          {/* Product Details */}
          <div ref={addToRefs} className="hover-element p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Globe className="animate-icon text-blue-600" size={20} />
              Product Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="hover-element p-3 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200">
                <p className="text-sm text-gray-500">Grade</p>
                <p className="text-gray-900 font-medium">{productData.attributes?.['grade'] || 'N/A'}</p>
              </div>
              <div className="hover-element p-3 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200">
                <p className="text-sm text-gray-500">Harvest Date</p>
                <p className="text-gray-900 font-medium">{productData.attributes?.['harvestDate'] || 'N/A'}</p>
              </div>
              <div className="hover-element p-3 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200">
                <p className="text-sm text-gray-500">Processing Method</p>
                <p className="text-gray-900 font-medium">{productData.attributes?.['processingMethod'] || 'N/A'}</p>
              </div>
              <div className="hover-element p-3 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200">
                <p className="text-sm text-gray-500">Shelf Life</p>
                <p className="text-gray-900 font-medium">{productData.attributes?.['shelfLife'] || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Flavor Profile */}
          {flavorNotes.length > 0 && (
            <div ref={addToRefs} className="hover-element p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Leaf className="animate-icon text-green-600" size={20} />
                Flavor Profile
              </h3>
              <div className="flex flex-wrap gap-2">
                {flavorNotes.map((note: string, index: number) => (
                  <span
                    key={index}
                    className="tag-item inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors duration-200 cursor-default"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductInfoPanel;
