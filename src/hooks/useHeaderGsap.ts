import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';

export function useDesktopNavGsap() {
  useLayoutEffect(() => {
    const items = document.querySelectorAll<HTMLElement>('.nav-item');

    const enter = (el: HTMLElement): void => {
      const tl = gsap.timeline();
      tl.to(el, { 
        y: -4, 
        scale: 1.08, 
        duration: 0.3, 
        ease: 'power3.out' 
      })
      .to(el.querySelector('.nav-glow'), {
        opacity: 0.6,
        scale: 1.2,
        duration: 0.3,
        ease: 'power2.out'
      }, 0)
      .to(el.querySelector('.nav-text'), {
        textShadow: '0 0 8px rgba(16, 185, 129, 0.4)',
        color: '#065F46',
        duration: 0.3,
        ease: 'power2.out'
      }, 0);

      if (getComputedStyle(el).position === 'static') {
        (el as HTMLElement).style.position = 'relative';
      }
      const leaf = document.createElement('span');
      leaf.className = 'leaf-drop';
      el.appendChild(leaf);
      gsap.set(leaf, { position: 'absolute', top: '-8px', left: '50%', xPercent: -50, width: 6, height: 3, borderRadius: '9999px', background: 'linear-gradient(to right, #059669, #065f46)', rotate: -30, opacity: 1 });
      gsap.to(leaf, { y: 20, rotation: 30, opacity: 0, duration: 0.9, ease: 'power1.in', onComplete: () => leaf.remove() });
    };

    const leave = (el: HTMLElement): void => {
      const tl = gsap.timeline();
      tl.to(el, { 
        y: 0, 
        scale: 1, 
        duration: 0.4, 
        ease: 'power3.inOut' 
      })
      .to(el.querySelector('.nav-glow'), {
        opacity: 0,
        scale: 1,
        duration: 0.4,
        ease: 'power2.inOut'
      }, 0)
      .to(el.querySelector('.nav-text'), {
        textShadow: '0 0 0px rgba(16, 185, 129, 0)',
        color: '#059669',
        duration: 0.4,
        ease: 'power2.inOut'
      }, 0);

      if (getComputedStyle(el).position === 'static') {
        (el as HTMLElement).style.position = 'relative';
      }
      const leaf = document.createElement('span');
      leaf.className = 'leaf-drop';
      el.appendChild(leaf);
      gsap.set(leaf, { position: 'absolute', top: '-8px', left: '50%', xPercent: -50, width: 6, height: 3, borderRadius: '9999px', background: 'linear-gradient(to right, #059669, #065f46)', rotate: -30, opacity: 1 });
      gsap.to(leaf, { y: 20, rotation: 30, opacity: 0, duration: 0.9, ease: 'power1.in', onComplete: () => leaf.remove() });
    };

    items.forEach((el: HTMLElement) => {
      const onEnter = () => enter(el);
      const onLeave = () => leave(el);
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
      const onClick = () => enter(el);
      el.addEventListener('click', onClick);
      (el as any)._enter = onEnter;
      (el as any)._leave = onLeave;
      (el as any)._click = onClick;
    });

    return () => {
      items.forEach((el: HTMLElement) => {
        if ((el as any)._enter) el.removeEventListener('mouseenter', (el as any)._enter);
        if ((el as any)._leave) el.removeEventListener('mouseleave', (el as any)._leave);
        if ((el as any)._click) el.removeEventListener('click', (el as any)._click);
      });
    };
  }, []);
}

export function useMobileNavGsap(isMobileMenuOpen: boolean) {
  useLayoutEffect(() => {
    if (isMobileMenuOpen) {
      const mobileItems = document.querySelectorAll<HTMLElement>('.mobile-nav-item');
      gsap.fromTo(mobileItems, 
        {
          x: -50,
          opacity: 0,
          rotationY: -15
        },
        {
          x: 0,
          opacity: 1,
          rotationY: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out'
        }
      );
      mobileItems.forEach((el: HTMLElement) => {
        const enterMobile = () => {
          const tl = gsap.timeline();
          tl.to(el, {
            x: 8,
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out'
          })
          .to(el.querySelector('.mobile-icon'), {
            scale: 1.2,
            rotation: 5,
            duration: 0.3,
            ease: 'back.out(1.2)'
          }, 0)
          .to(el.querySelector('.mobile-text'), {
            x: 4,
            color: '#065F46',
            duration: 0.3,
            ease: 'power2.out'
          }, 0);
          if (getComputedStyle(el).position === 'static') {
            (el as HTMLElement).style.position = 'relative';
          }
          const leaf = document.createElement('span');
          leaf.className = 'leaf-drop';
          el.appendChild(leaf);
          gsap.set(leaf, { position: 'absolute', top: '-8px', left: '50%', xPercent: -50, width: 6, height: 3, borderRadius: '9999px', background: 'linear-gradient(to right, #059669, #065f46)', rotate: -30, opacity: 1 });
          gsap.to(leaf, { y: 20, rotation: 30, opacity: 0, duration: 0.9, ease: 'power1.in', onComplete: () => leaf.remove() });
        };
        const leaveMobile = () => {
          const tl = gsap.timeline();
          tl.to(el, {
            x: 0,
            scale: 1,
            duration: 0.4,
            ease: 'power2.inOut'
          })
          .to(el.querySelector('.mobile-icon'), {
            scale: 1,
            rotation: 0,
            duration: 0.4,
            ease: 'power2.inOut'
          }, 0)
          .to(el.querySelector('.mobile-text'), {
            x: 0,
            duration: 0.4,
            ease: 'power2.inOut'
          }, 0);
          if (getComputedStyle(el).position === 'static') {
            (el as HTMLElement).style.position = 'relative';
          }
          const leaf = document.createElement('span');
          leaf.className = 'leaf-drop';
          el.appendChild(leaf);
          gsap.set(leaf, { position: 'absolute', top: '-8px', left: '50%', xPercent: -50, width: 6, height: 3, borderRadius: '9999px', background: 'linear-gradient(to right, #059669, #065f46)', rotate: -30, opacity: 1 });
          gsap.to(leaf, { y: 20, rotation: 30, opacity: 0, duration: 0.9, ease: 'power1.in', onComplete: () => leaf.remove() });
        };
        el.addEventListener('mouseenter', enterMobile);
        el.addEventListener('mouseleave', leaveMobile);
        (el as any)._enterMobile = enterMobile;
        (el as any)._leaveMobile = leaveMobile;
      });
    }
    return () => {
      const mobileItems = document.querySelectorAll<HTMLElement>('.mobile-nav-item');
      mobileItems.forEach((el: HTMLElement) => {
        if ((el as any)._enterMobile && (el as any)._leaveMobile) {
          el.removeEventListener('mouseenter', (el as any)._enterMobile);
          el.removeEventListener('mouseleave', (el as any)._leaveMobile);
        }
      });
    };
  }, [isMobileMenuOpen]);
} 
