// Dark/Light mode toggle for CV page
(function() {
    const body = document.body;
    const modeKey = 'cv-color-mode';
    const toggleBtnId = 'color-mode-toggle';

    // Set dark mode by default unless user has a preference
    function getPreferredMode() {
        const stored = localStorage.getItem(modeKey);
        if (stored === 'light' || stored === 'dark') return stored;
        return 'dark'; // default
    }

    function setMode(mode) {
        if (mode === 'dark') {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }
        localStorage.setItem(modeKey, mode);
        // Update button text
        const btn = document.getElementById(toggleBtnId);
        if (btn) btn.textContent = mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    }

    function toggleMode() {
        const isDark = body.classList.contains('dark-mode');
        setMode(isDark ? 'light' : 'dark');
    }

    // On DOM ready
    document.addEventListener('DOMContentLoaded', function() {
        setMode(getPreferredMode());
        const btn = document.getElementById(toggleBtnId);
        if (btn) btn.addEventListener('click', toggleMode);
    });
})();
