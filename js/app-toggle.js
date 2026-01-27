/**
 * App Toggle - Switches between Salary Calculator and Vehicle Import Calculator
 */

let currentMode = 'salary';

function initAppToggle() {
    const salaryPill = document.getElementById('pill-salary');
    const vehiclePill = document.getElementById('pill-vehicle');

    if (salaryPill) {
        salaryPill.addEventListener('click', function() {
            switchMode('salary');
        });
    }

    if (vehiclePill) {
        vehiclePill.addEventListener('click', function() {
            switchMode('vehicle');
        });
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
    const salaryPill = document.getElementById('pill-salary');
    const vehiclePill = document.getElementById('pill-vehicle');

    // Salary sticky elements
    const salarySticky = document.getElementById('sticky-results');
    const mobileBar = document.getElementById('mobile-sticky-bar');
    // Vehicle sticky
    const vehicleSticky = document.getElementById('vehicle-sticky-results');

    if (mode === 'salary') {
        // Show salary, hide vehicle
        if (salaryCalc) salaryCalc.style.display = '';
        if (vehicleCalc) vehicleCalc.style.display = 'none';
        if (salaryPill) salaryPill.classList.add('active');
        if (vehiclePill) vehiclePill.classList.remove('active');

        // Restore salary stickies (remove our override, let .visible class control)
        if (salarySticky) salarySticky.style.removeProperty('display');
        if (mobileBar) mobileBar.style.removeProperty('display');
        // Hide vehicle sticky
        if (vehicleSticky) vehicleSticky.style.display = 'none';

    } else {
        // Show vehicle, hide salary
        if (salaryCalc) salaryCalc.style.display = 'none';
        if (vehicleCalc) vehicleCalc.style.display = '';
        if (salaryPill) salaryPill.classList.remove('active');
        if (vehiclePill) vehiclePill.classList.add('active');

        // Hide salary stickies
        if (salarySticky) salarySticky.style.display = 'none';
        if (mobileBar) mobileBar.style.display = 'none';
        // Restore vehicle sticky (let .visible class control)
        if (vehicleSticky) vehicleSticky.style.removeProperty('display');
    }

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    initAppToggle();
});
