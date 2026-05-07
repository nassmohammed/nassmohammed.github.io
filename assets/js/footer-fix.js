
// Add this script to debug the footer background issue
document.addEventListener('DOMContentLoaded', function() {
  function fixFooterBackground() {
    // Directly target and remove any background on all footer elements
    const footer = document.getElementById('footer');
    if (footer) {
      const allFooterElements = footer.querySelectorAll('*');
      allFooterElements.forEach(elem => {
        elem.style.backgroundColor = 'transparent';
        elem.style.backgroundImage = 'none';
        elem.style.boxShadow = 'none';
        elem.style.border = 'none';
      });
      footer.style.backgroundColor = 'transparent';
      footer.style.backgroundImage = 'none';
      footer.style.boxShadow = 'none';
      footer.style.border = 'none';
      
      // Log the computed styles for debugging
      console.log('Footer computed background:', 
        window.getComputedStyle(footer).backgroundColor,
        window.getComputedStyle(footer).backgroundImage);
    }
  }
  
  // Run initially and also whenever dark mode changes
  fixFooterBackground();
  
  // Watch for dark mode toggle
  document.getElementById('color-mode-toggle')?.addEventListener('click', function() {
    setTimeout(fixFooterBackground, 50); // Run after mode change
  });
});
