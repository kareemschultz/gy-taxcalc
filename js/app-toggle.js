/**
 * App Toggle - Switches between Salary Calculator and Vehicle Import Calculator
 */

let currentMode = 'salary';

function initAppToggle() {
    const salaryPill = document.getElementById('pill-salary');
    const vehiclePill = document.getElementById('pill-vehicle');
    const loanPill = document.getElementById('pill-loan');

    if (salaryPill) {
        salaryPill.addEventListener('click', function() { switchMode('salary'); });
    }
    if (vehiclePill) {
        vehiclePill.addEventListener('click', function() { switchMode('vehicle'); });
    }
    if (loanPill) {
        loanPill.addEventListener('click', function() { switchMode('loan'); });
    }

    // Initialize vehicle calculator
    if (typeof initVehicleCalculator === 'function') {
        initVehicleCalculator();
    }
}

function switchMode(mode) {
    if (currentMode === mode) return;
    currentMode = mode;

    const salaryCalc = document.getElementById('salary-calculator');
    const vehicleCalc = document.getElementById('vehicle-calculator');
    const loanCalc = document.getElementById('loan-calculator');
    const salaryPill = document.getElementById('pill-salary');
    const vehiclePill = document.getElementById('pill-vehicle');
    const loanPill = document.getElementById('pill-loan');

    // Sticky elements
    const salarySticky = document.getElementById('sticky-results');
    const mobileBar = document.getElementById('mobile-sticky-bar');
    const vehicleSticky = document.getElementById('vehicle-sticky-results');
    const loanSticky = document.getElementById('loan-sticky-results');

    // Hide all calculators and stickies first
    if (salaryCalc) salaryCalc.style.display = 'none';
    if (vehicleCalc) vehicleCalc.style.display = 'none';
    if (loanCalc) loanCalc.style.display = 'none';
    if (salarySticky) salarySticky.style.display = 'none';
    if (mobileBar) mobileBar.style.display = 'none';
    if (vehicleSticky) vehicleSticky.style.display = 'none';
    if (loanSticky) loanSticky.style.display = 'none';

    // Remove active from all pills
    [salaryPill, vehiclePill, loanPill].forEach(function(p) {
        if (p) p.classList.remove('active');
    });

    if (mode === 'salary') {
        if (salaryCalc) salaryCalc.style.display = '';
        if (salaryPill) salaryPill.classList.add('active');
        // Restore salary stickies — let .visible class control visibility
        if (salarySticky) salarySticky.style.removeProperty('display');
        if (mobileBar) mobileBar.style.removeProperty('display');

    } else if (mode === 'vehicle') {
        if (vehicleCalc) vehicleCalc.style.display = '';
        if (vehiclePill) vehiclePill.classList.add('active');
        // Restore vehicle sticky
        if (vehicleSticky) vehicleSticky.style.removeProperty('display');

    } else if (mode === 'loan') {
        if (loanCalc) loanCalc.style.display = '';
        if (loanPill) loanPill.classList.add('active');
        // Restore loan sticky
        if (loanSticky) loanSticky.style.removeProperty('display');
    }

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    initAppToggle();
});
