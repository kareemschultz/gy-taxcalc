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

    // Wire clear buttons
    var clearSalaryBtn = document.getElementById('clear-salary-form');
    if (clearSalaryBtn) {
        clearSalaryBtn.addEventListener('click', clearSalaryForm);
    }

    debug('Calculator initialization complete');
});

/**
 * Clear salary calculator form
 */
function clearSalaryForm() {
    // Clear all number inputs in salary calculator
    document.querySelectorAll('#salary-calculator input[type="number"]').forEach(function(input) {
        input.value = '';
    });
    // Clear text inputs
    document.querySelectorAll('#salary-calculator input[type="text"]').forEach(function(input) {
        input.value = '';
    });
    // Reset dropdowns
    var posSelect = document.getElementById('position-select');
    if (posSelect) posSelect.value = 'other';
    var freqSelect = document.getElementById('payment-frequency');
    if (freqSelect) freqSelect.value = 'monthly';
    // Uncheck checkboxes
    document.querySelectorAll('#salary-calculator input[type="checkbox"]').forEach(function(cb) {
        cb.checked = false;
    });
    // Reset results displays
    var stickyResults = document.getElementById('sticky-results');
    if (stickyResults) stickyResults.style.display = 'none';
    var mobileBar = document.getElementById('mobile-sticky-bar');
    if (mobileBar) mobileBar.classList.remove('visible');
    // Trigger recalculation to reset displayed values
    if (typeof calculateAll === 'function') calculateAll();
    // Update frequency labels
    if (typeof updateFrequencyLabels === 'function') updateFrequencyLabels();
}
