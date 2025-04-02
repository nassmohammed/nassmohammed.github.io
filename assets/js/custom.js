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
  
  // Parallax effect for header
  window.addEventListener('scroll', function() {
    const scrollPosition = window.pageYOffset;
    const header = document.querySelector('#header');
    
    if (header) {
      header.style.backgroundPositionY = -scrollPosition * 0.15 + 'px';
    }
  });
  
  // Add floating animation to avatar
  const avatar = document.querySelector('.image.avatar');
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
