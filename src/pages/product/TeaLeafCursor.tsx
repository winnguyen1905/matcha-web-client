import React, { useEffect, useRef } from 'react';
import { TeaLeaf } from '../../types/product-type';

const TeaLeafCursor: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leavesRef = useRef<TeaLeaf[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const isMovingRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create tea leaf elements
    const createLeaf = (): TeaLeaf => {
      const leaf = document.createElement('div');
      leaf.className = 'tea-leaf';
      leaf.innerHTML = `
        <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
          <path d="M10 2C6 2 2 6 2 12C2 18 6 22 10 22C14 22 18 18 18 12C18 6 14 2 10 2Z" 
                fill="currentColor" opacity="0.8"/>
          <path d="M10 2L12 8L10 14L8 8Z" fill="currentColor" opacity="0.6"/>
        </svg>
      `;
      
      // Set leaf styles
      Object.assign(leaf.style, {
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: '9999',
        color: '#10b981',
        transform: 'scale(0)',
        opacity: '0',
        transformOrigin: 'center center',
        transition: 'all 0.3s ease'
      });

      container.appendChild(leaf);

      return {
        element: leaf,
        x: 0,
        y: 0,
        rotation: 0,
        scale: 0,
        opacity: 0
      };
    };

    // Initialize leaves
    const NUM_LEAVES = 8;
    for (let i = 0; i < NUM_LEAVES; i++) {
      leavesRef.current.push(createLeaf());
    }

    let animationId: number;
    let lastMouseMove = Date.now();

    const updateLeaves = () => {
      const now = Date.now();
      const timeSinceMove = now - lastMouseMove;
      
      // Fade out leaves if mouse hasn't moved for 2 seconds
      if (timeSinceMove > 2000) {
        isMovingRef.current = false;
      }

      leavesRef.current.forEach((leaf, index) => {
        const targetX = mouseRef.current.x - 10;
        const targetY = mouseRef.current.y - 12;
        
        // Smooth following with different speeds for each leaf
        const speed = 0.1 + (index * 0.02);
        leaf.x += (targetX - leaf.x) * speed;
        leaf.y += (targetY - leaf.y) * speed;

        // Add some organic movement
        const time = now * 0.001;
        const wobbleX = Math.sin(time + index) * 2;
        const wobbleY = Math.cos(time + index * 1.5) * 1.5;

        // Update rotation based on movement
        const dx = targetX - leaf.x;
        const dy = targetY - leaf.y;
        const targetRotation = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        leaf.rotation += (targetRotation - leaf.rotation) * 0.1;

        // Scale and opacity based on movement and index
        const targetScale = isMovingRef.current ? 0.6 + (index * 0.05) : 0;
        const targetOpacity = isMovingRef.current ? 0.8 - (index * 0.08) : 0;
        
        leaf.scale += (targetScale - leaf.scale) * 0.15;
        leaf.opacity += (targetOpacity - leaf.opacity) * 0.15;

        // Apply transforms
        leaf.element.style.transform = `translate(${leaf.x + wobbleX}px, ${leaf.y + wobbleY}px) rotate(${leaf.rotation}deg) scale(${leaf.scale})`;
        leaf.element.style.opacity = leaf.opacity.toString();
      });

      animationId = requestAnimationFrame(updateLeaves);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      lastMouseMove = Date.now();
      isMovingRef.current = true;
    };

    // Create falling leaves on click
    const createFallingLeaf = (x: number, y: number) => {
      const fallingLeaf = createLeaf();
      
      Object.assign(fallingLeaf.element.style, {
        transform: `translate(${x - 10}px, ${y - 12}px) rotate(${Math.random() * 360}deg) scale(0.8)`,
        opacity: '1'
      });

      // Animate falling
      let startTime = Date.now();
      const duration = 2000 + Math.random() * 1000;
      const startY = y - 12;
      const endY = y + 200 + Math.random() * 100;
      const startX = x - 10;
      const endX = x + (Math.random() - 0.5) * 100;
      const startRotation = Math.random() * 360;
      const endRotation = startRotation + Math.random() * 720;

      const animateFall = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 2);

        const currentY = startY + (endY - startY) * easeOut;
        const currentX = startX + (endX - startX) * easeOut;
        const currentRotation = startRotation + (endRotation - startRotation) * progress;
        const currentScale = 0.8 * (1 - progress * 0.5);
        const currentOpacity = 1 - progress;

        fallingLeaf.element.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${currentRotation}deg) scale(${currentScale})`;
        fallingLeaf.element.style.opacity = currentOpacity.toString();

        if (progress < 1) {
          requestAnimationFrame(animateFall);
        } else {
          fallingLeaf.element.remove();
        }
      };

      animateFall();
    };

    const handleClick = (e: MouseEvent) => {
      // Create 3-5 falling leaves on click
      const numLeaves = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < numLeaves; i++) {
        setTimeout(() => {
          createFallingLeaf(e.clientX, e.clientY);
        }, i * 100);
      }
    };

    // Event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);

    // Start animation loop
    updateLeaves();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationId);
      
      // Clean up leaf elements
      leavesRef.current.forEach(leaf => {
        leaf.element.remove();
      });
      leavesRef.current = [];
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-50" />;
};

export default TeaLeafCursor;
