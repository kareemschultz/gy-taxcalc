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

    // Hide sticky results bars
    var stickyResults = document.getElementById('sticky-results');
    if (stickyResults) stickyResults.style.display = 'none';
    var mobileBar = document.getElementById('mobile-sticky-bar');
    if (mobileBar) mobileBar.classList.remove('visible');

    // Reset all result values to $0
    document.querySelectorAll('#salary-calculator .result-value').forEach(function(el) {
        el.textContent = '$0.00';
    });
    document.querySelectorAll('#salary-calculator .sticky-result-value').forEach(function(el) {
        el.textContent = '$0';
    });
    document.querySelectorAll('#salary-calculator .mobile-sticky-value').forEach(function(el) {
        el.textContent = '$0';
    });

    // Reset sticky values by ID
    ['sticky-net', 'sticky-gross', 'sticky-tax', 'sticky-nis'].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.textContent = '$0';
    });
    ['mobile-net', 'mobile-gross', 'mobile-tax'].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.textContent = '$0';
    });

    // Destroy charts if they exist
    if (typeof breakdownChart !== 'undefined' && breakdownChart) {
        breakdownChart.destroy();
        breakdownChart = null;
    }
    if (typeof annualChart !== 'undefined' && annualChart) {
        annualChart.destroy();
        annualChart = null;
    }

    // Hide salary increase results
    var increaseResults = document.getElementById('salary-increase-results');
    if (increaseResults) increaseResults.style.display = 'none';
    var retroResults = document.getElementById('retroactive-results-display');
    if (retroResults) retroResults.classList.add('d-none');
    var gratuityResults = document.getElementById('gratuity-month-results-display');
    if (gratuityResults) gratuityResults.classList.add('d-none');

    // Reset salary increase inputs
    document.querySelectorAll('#section-salary-increase input[type="number"]').forEach(function(input) {
        input.value = '';
    });

    // Update frequency labels
    if (typeof updateFrequencyLabels === 'function') updateFrequencyLabels();
}
