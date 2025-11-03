// Custom animation and dynamic effects

// Animate elements when they come into view
document.addEventListener('DOMContentLoaded', function() {
  // Create intersection observer for fade-in elements
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });
  
  // Observe all work items
  document.querySelectorAll('.work-item').forEach(item => {
    item.classList.add('fade-in');
    observer.observe(item);
  });
  
  // Removed typewriter effect for the heading
  
  const headerEl = document.querySelector('#header');

  // Parallax effect for header background
  window.addEventListener('scroll', function() {
    const scrollPosition = window.pageYOffset;
    
    if (headerEl) {
      headerEl.style.backgroundPositionY = -scrollPosition * 0.15 + 'px';
    }
  });
  
  const avatarCarousel = document.querySelector('[data-avatar-carousel]');

  if (headerEl && avatarCarousel) {
    const track = avatarCarousel.querySelector('.avatar-track');
    const slides = track ? Array.from(track.querySelectorAll('.avatar-slide')) : [];
    const dotsContainer = avatarCarousel.querySelector('[data-avatar-dots]');
    let dots = [];

    if (track && slides.length > 1) {
      const desktopQuery = window.matchMedia('(min-width: 981px)');
      const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      let prefersReducedMotion = reduceMotionQuery.matches;
      let activeIndex = slides.findIndex(slide => slide.classList.contains('is-active'));
      let isAnimating = false;
      let deltaBuffer = 0;
      const scrollThreshold = 60;
      const animationClasses = [
        'is-entering-forward',
        'is-entering-backward',
        'is-exiting-forward',
        'is-exiting-backward',
        'is-animating'
      ];

      if (activeIndex < 0) {
        activeIndex = 0;
      }

      const updateDots = (index) => {
        if (!dots.length) return;
        dots.forEach((dot, dotIndex) => {
          dot.classList.toggle('is-active', dotIndex === index);
        });
      };

      const buildDots = () => {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        dots = slides.map((slide, index) => {
          const dot = document.createElement('button');
          dot.type = 'button';
          dot.className = `avatar-dot${index === activeIndex ? ' is-active' : ''}`;
          dot.setAttribute('aria-label', `Show image ${index + 1}`);
          dot.addEventListener('click', () => {
            if (index === activeIndex) {
              return;
            }
            if (isAnimating && !prefersReducedMotion) {
              return;
            }
            const direction = index > activeIndex ? 1 : -1;
            deltaBuffer = 0;
            transitionTo(index, direction === 0 ? 1 : direction);
          });
          dotsContainer.appendChild(dot);
          return dot;
        });
      };

      const normalizeIndex = (index) => {
        const total = slides.length;
        return ((index % total) + total) % total;
      };

      const cancelOngoingAnimations = (slide) => {
        if (typeof slide.getAnimations === 'function') {
          slide.getAnimations().forEach(animation => animation.cancel());
        }
      };

      const applyImmediateState = (index) => {
        const normalizedIndex = normalizeIndex(index);
        slides.forEach((slide, slideIndex) => {
          cancelOngoingAnimations(slide);
          animationClasses.forEach(cls => slide.classList.remove(cls));
          const isActiveSlide = slideIndex === normalizedIndex;
          slide.classList.toggle('is-active', isActiveSlide);
          slide.setAttribute('aria-hidden', (!isActiveSlide).toString());
        });
        avatarCarousel.setAttribute('data-current-index', normalizedIndex.toString());
        activeIndex = normalizedIndex;
        updateDots(normalizedIndex);
      };

      buildDots();
      applyImmediateState(activeIndex);

      const transitionTo = (targetIndex, direction) => {
        const nextIndex = normalizeIndex(targetIndex);
        if (nextIndex === activeIndex) {
          return;
        }

        if (prefersReducedMotion) {
          applyImmediateState(nextIndex);
          return;
        }

        const currentSlide = slides[activeIndex];
        const nextSlide = slides[nextIndex];

        if (!currentSlide || !nextSlide) {
          return;
        }

        const exitClass = direction > 0 ? 'is-exiting-forward' : 'is-exiting-backward';
        const enterClass = direction > 0 ? 'is-entering-forward' : 'is-entering-backward';

        cancelOngoingAnimations(currentSlide);
        cancelOngoingAnimations(nextSlide);

        animationClasses.forEach(cls => {
          currentSlide.classList.remove(cls);
          nextSlide.classList.remove(cls);
        });

        isAnimating = true;
        deltaBuffer = 0;

        let animationsPending = 0;

        const finalizeAll = () => {
          animationsPending -= 1;
          if (animationsPending <= 0) {
            isAnimating = false;
            activeIndex = nextIndex;
            avatarCarousel.setAttribute('data-current-index', nextIndex.toString());
            updateDots(nextIndex);
          }
        };

        const registerAnimation = (slide, classesToRemove, cleanup) => {
          animationsPending += 1;
          const handleAnimationEnd = () => {
            slide.removeEventListener('animationend', handleAnimationEnd);
            slide.classList.remove('is-animating', ...classesToRemove);
            if (typeof cleanup === 'function') {
              cleanup();
            }
            finalizeAll();
          };
          slide.addEventListener('animationend', handleAnimationEnd, { once: true });
        };

        currentSlide.classList.add('is-animating', exitClass);
        registerAnimation(currentSlide, [exitClass], () => {
          currentSlide.classList.remove('is-active');
          currentSlide.setAttribute('aria-hidden', 'true');
        });

        nextSlide.classList.add('is-active', 'is-animating', enterClass);
        nextSlide.setAttribute('aria-hidden', 'false');
        registerAnimation(nextSlide, [enterClass], null);
      };

      const handleWheel = (event) => {
        if (!desktopQuery.matches) {
          return;
        }

        const dominantDelta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : 0;

        if (dominantDelta === 0) {
          return;
        }

        event.preventDefault();

        if (isAnimating && !prefersReducedMotion) {
          return;
        }

        deltaBuffer += dominantDelta;

        if (Math.abs(deltaBuffer) < scrollThreshold) {
          return;
        }

        const direction = deltaBuffer > 0 ? 1 : -1;
        deltaBuffer = 0;

        transitionTo(activeIndex + direction, direction);
      };

      const addWheelListener = () => {
        headerEl.addEventListener('wheel', handleWheel, { passive: false });
      };

      const removeWheelListener = () => {
        headerEl.removeEventListener('wheel', handleWheel);
        deltaBuffer = 0;
        isAnimating = false;
      };

      const updateWheelBinding = () => {
        if (desktopQuery.matches) {
          addWheelListener();
        } else {
          removeWheelListener();
        }
      };

      updateWheelBinding();

      if (typeof desktopQuery.addEventListener === 'function') {
        desktopQuery.addEventListener('change', updateWheelBinding);
      } else if (typeof desktopQuery.addListener === 'function') {
        desktopQuery.addListener(updateWheelBinding);
      }

      const updateMotionPreference = (event) => {
        prefersReducedMotion = event.matches;
        if (prefersReducedMotion) {
          isAnimating = false;
          deltaBuffer = 0;
          slides.forEach(slide => {
            cancelOngoingAnimations(slide);
            animationClasses.forEach(cls => slide.classList.remove(cls));
          });
          applyImmediateState(activeIndex);
        }
      };

      if (typeof reduceMotionQuery.addEventListener === 'function') {
        reduceMotionQuery.addEventListener('change', updateMotionPreference);
      } else if (typeof reduceMotionQuery.addListener === 'function') {
        reduceMotionQuery.addListener(updateMotionPreference);
      }
    }
  }
});

// Add smooth scrolling to all links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    document.querySelector(targetId).scrollIntoView({
      behavior: 'smooth'
    });
  });
});
