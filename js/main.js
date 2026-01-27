/**
 * Main initialization script - REDESIGNED
 */

document.addEventListener('DOMContentLoaded', function() {
    debug('DOM loaded - initializing redesigned calculator');

    // Initialize theme
    initializeTheme();

    // Set default dates
    setDefaultDates();

    // Setup event listeners (includes accordion, auto-calculate, etc.)
    setupEventListeners();

    // Initialize frequency labels
    updateFrequencyLabels();

    // Initialize tooltips
    initializeTooltips();

    debug('Calculator initialization complete');
});
