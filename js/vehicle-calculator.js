/**
 * Vehicle Import Tax Calculator for Guyana
 * Based on GRA published formulas
 */

// Default exchange rate
const DEFAULT_EXCHANGE_RATE = 218;

// Vehicle tax rate tables
const GASOLINE_UNDER_4 = [
    { min: 0, max: 1000, duty: 0.35, excise: 0, vat: 0.14 },
    { min: 1001, max: 1500, duty: 0.35, excise: 0, vat: 0.14 },
    { min: 1501, max: 1800, duty: 0.45, excise: 0.10, vat: 0.14 },
    { min: 1801, max: 2000, duty: 0.45, excise: 0.10, vat: 0.14 },
    { min: 2001, max: 3000, duty: 0.45, excise: 1.10, vat: 0.14 },
    { min: 3001, max: Infinity, duty: 0.45, excise: 1.40, vat: 0.14 }
];

const DIESEL_UNDER_4 = [
    { min: 0, max: 1500, duty: 0.35, excise: 0, vat: 0.14 },
    { min: 1501, max: 2000, duty: 0.45, excise: 0.10, vat: 0.14 },
    { min: 2001, max: 2500, duty: 0.45, excise: 1.10, vat: 0.14 },
    { min: 2501, max: Infinity, duty: 0.45, excise: 1.10, vat: 0.14 }
];

// 4+ years old formulas (gasoline) - returns excise in USD or flat GYD
const GASOLINE_4PLUS = [
    { min: 0, max: 1000, type: 'flat_gyd', amount: 800000 },
    { min: 1001, max: 1500, type: 'flat_gyd', amount: 800000 },
    { min: 1501, max: 1800, type: 'formula', addon: 6000, rate: 0.30 },
    { min: 1801, max: 2000, type: 'formula', addon: 6500, rate: 0.30 },
    { min: 2001, max: 3000, type: 'formula', addon: 13500, rate: 0.70 },
    { min: 3001, max: Infinity, type: 'formula', addon: 14500, rate: 1.00 }
];

const DIESEL_4PLUS = [
    { min: 0, max: 1500, type: 'flat_gyd', amount: 800000 },
    { min: 1501, max: 2000, type: 'formula', addon: 15400, rate: 0.30 },
    { min: 2001, max: 2500, type: 'formula', addon: 15400, rate: 0.70 },
    { min: 2501, max: 3000, type: 'formula', addon: 15500, rate: 0.70 },
    { min: 3001, max: Infinity, type: 'formula', addon: 17200, rate: 1.00 }
];

// Motorcycle rates (always under 4 years formula style)
const MOTORCYCLE_RATES = [
    { min: 0, max: 175, duty: 0.20, excise: 0, vat: 0.14 },
    { min: 176, max: Infinity, duty: 0.20, excise: 0.10, vat: 0.14 }
];

/**
 * Find the matching bracket from a rate table
 */
function findBracket(cc, table) {
    for (const bracket of table) {
        if (cc >= bracket.min && cc <= bracket.max) {
            return bracket;
        }
    }
    return table[table.length - 1]; // fallback to last bracket
}

/**
 * Main vehicle tax calculation function
 */
function calculateVehicleTax(params) {
    const {
        cifUSD,
        exchangeRate,
        vehicleAge,      // 'under4' or '4plus'
        vehicleType,     // 'car', 'suv', 'van', 'bus', 'single_cab', 'double_cab', 'motorcycle', 'atv', 'electric'
        fuelType,        // 'gasoline', 'diesel', 'electric', 'hybrid'
        engineCC,
        plateType,       // 'private', 'government'
        isDealer,
        use2026Rates
    } = params;

    const rate = exchangeRate || DEFAULT_EXCHANGE_RATE;
    const cifGYD = cifUSD * rate;

    // Result object
    let result = {
        cifUSD,
        cifGYD,
        exchangeRate: rate,
        dutyUSD: 0,
        dutyGYD: 0,
        exciseUSD: 0,
        exciseGYD: 0,
        vatUSD: 0,
        vatGYD: 0,
        totalTaxUSD: 0,
        totalTaxGYD: 0,
        totalCostUSD: 0,
        totalCostGYD: 0,
        dutyRate: 0,
        exciseRate: 0,
        vatRate: 0,
        notes: [],
        formulaUsed: ''
    };

    // === ELECTRIC VEHICLES ===
    if (fuelType === 'electric' || vehicleType === 'electric') {
        result.notes.push('Electric vehicles: 0% duty, 0% excise, 0% VAT');
        result.formulaUsed = 'Electric Vehicle - All taxes exempt';
        result.totalCostUSD = cifUSD;
        result.totalCostGYD = cifGYD;
        return result;
    }

    // === 2026 BUDGET: ATV EXEMPTION ===
    if (use2026Rates && vehicleType === 'atv') {
        result.notes.push('Budget 2026: All taxes removed on ATVs');
        result.formulaUsed = '2026 Budget - ATV exempt from all taxes';
        result.totalCostUSD = cifUSD;
        result.totalCostGYD = cifGYD;
        return result;
    }

    // === GOVERNMENT PLATE ===
    if (plateType === 'government') {
        result.exciseUSD = 2000;
        result.exciseGYD = 2000 * rate;
        result.totalTaxUSD = 2000;
        result.totalTaxGYD = 2000 * rate;
        result.totalCostUSD = cifUSD + 2000;
        result.totalCostGYD = cifGYD + (2000 * rate);
        result.notes.push('Government plate: Flat excise US$2,000, no duty, no VAT');
        result.formulaUsed = 'G-Plate: Flat excise US$2,000';
        return result;
    }

    // === 2026 BUDGET: DOUBLE CAB PICKUPS ===
    if (use2026Rates && vehicleType === 'double_cab') {
        let flatGYD = 0;
        if (engineCC <= 2000) {
            flatGYD = 2000000;
            result.notes.push('Budget 2026: Double-cab under 2000cc → GY$2,000,000 flat');
        } else if (engineCC <= 2500) {
            flatGYD = 3000000;
            result.notes.push('Budget 2026: Double-cab 2000-2500cc → GY$3,000,000 flat');
        } else {
            // Over 2500cc not covered by 2026 budget special rate, use normal calculation
            // Fall through to normal calculation below
            result.notes.push('Double-cab over 2500cc: standard rates apply');
            return calculateStandardVehicleTax(result, params);
        }

        result.exciseGYD = flatGYD;
        result.exciseUSD = flatGYD / rate;
        result.totalTaxGYD = flatGYD;
        result.totalTaxUSD = flatGYD / rate;
        result.totalCostGYD = cifGYD + flatGYD;
        result.totalCostUSD = cifUSD + (flatGYD / rate);
        result.formulaUsed = `2026 Budget: Double-cab flat rate GY$${(flatGYD/1000000).toFixed(0)}M`;
        return result;
    }

    // === MOTORCYCLE / ATV ===
    if (vehicleType === 'motorcycle' || vehicleType === 'atv') {
        return calculateMotorcycleTax(result, params);
    }

    // === STANDARD VEHICLE CALCULATION ===
    return calculateStandardVehicleTax(result, params);
}

/**
 * Calculate motorcycle tax
 */
function calculateMotorcycleTax(result, params) {
    const { cifUSD, exchangeRate, engineCC, isDealer, use2026Rates } = params;
    const rate = exchangeRate || DEFAULT_EXCHANGE_RATE;

    const bracket = findBracket(engineCC, MOTORCYCLE_RATES);

    const dealerMultiplier = isDealer ? 1.5 : 1;
    const effectiveCIF = cifUSD * dealerMultiplier;

    const dutyUSD = bracket.duty * cifUSD;
    const exciseUSD = bracket.excise * (effectiveCIF + dutyUSD);
    const vatUSD = bracket.vat * (cifUSD + dutyUSD + exciseUSD);

    result.dutyRate = bracket.duty;
    result.exciseRate = bracket.excise;
    result.vatRate = bracket.vat;
    result.dutyUSD = dutyUSD;
    result.dutyGYD = dutyUSD * rate;
    result.exciseUSD = exciseUSD;
    result.exciseGYD = exciseUSD * rate;
    result.vatUSD = vatUSD;
    result.vatGYD = vatUSD * rate;
    result.totalTaxUSD = dutyUSD + exciseUSD + vatUSD;
    result.totalTaxGYD = result.totalTaxUSD * rate;
    result.totalCostUSD = cifUSD + result.totalTaxUSD;
    result.totalCostGYD = result.totalCostUSD * rate;

    if (engineCC <= 175) {
        result.notes.push('Motorcycle ≤175cc: 20% duty, 0% excise, 14% VAT');
    } else {
        result.notes.push('Motorcycle >175cc: 20% duty, 10% excise, 14% VAT');
    }
    if (isDealer) {
        result.notes.push('Dealer: Excise calculated on 1.5× CIF + Duty');
    }
    result.formulaUsed = `Motorcycle ${engineCC}cc: Duty=${(bracket.duty*100)}%, Excise=${(bracket.excise*100)}%, VAT=${(bracket.vat*100)}%`;

    return result;
}

/**
 * Calculate standard vehicle tax (cars, SUVs, vans, buses, pickups)
 */
function calculateStandardVehicleTax(result, params) {
    const {
        cifUSD,
        exchangeRate,
        vehicleAge,
        fuelType,
        engineCC,
        isDealer,
        use2026Rates,
        vehicleType
    } = params;

    const rate = exchangeRate || DEFAULT_EXCHANGE_RATE;

    // === UNDER 4 YEARS ===
    if (vehicleAge === 'under4') {
        let table;
        if (fuelType === 'diesel') {
            table = DIESEL_UNDER_4;
        } else {
            table = GASOLINE_UNDER_4; // gasoline and hybrid use gasoline table
        }

        const bracket = findBracket(engineCC, table);

        const dealerMultiplier = isDealer ? 1.5 : 1;
        const effectiveCIF = cifUSD * dealerMultiplier;

        const dutyUSD = bracket.duty * cifUSD;
        const exciseUSD = bracket.excise * (effectiveCIF + dutyUSD);

        // 2026 Budget: VAT removed on vehicles under 1500cc, less than 4 years old
        let applyVAT = true;
        if (use2026Rates && engineCC <= 1500) {
            applyVAT = false;
            result.notes.push('Budget 2026: VAT removed on vehicles under 1500cc (under 4 years)');
        }
        // 2026 Budget: VAT removed on hybrid vehicles under 2000cc
        if (use2026Rates && fuelType === 'hybrid' && engineCC <= 2000) {
            applyVAT = false;
            result.notes.push('Budget 2026: VAT removed on hybrid vehicles under 2000cc');
        }

        const vatUSD = applyVAT ? bracket.vat * (cifUSD + dutyUSD + exciseUSD) : 0;

        result.dutyRate = bracket.duty;
        result.exciseRate = bracket.excise;
        result.vatRate = applyVAT ? bracket.vat : 0;
        result.dutyUSD = dutyUSD;
        result.dutyGYD = dutyUSD * rate;
        result.exciseUSD = exciseUSD;
        result.exciseGYD = exciseUSD * rate;
        result.vatUSD = vatUSD;
        result.vatGYD = vatUSD * rate;
        result.totalTaxUSD = dutyUSD + exciseUSD + vatUSD;
        result.totalTaxGYD = result.totalTaxUSD * rate;
        result.totalCostUSD = cifUSD + result.totalTaxUSD;
        result.totalCostGYD = result.totalCostUSD * rate;

        if (isDealer) {
            result.notes.push('Dealer: Excise calculated on 1.5× CIF + Duty');
        }

        result.formulaUsed = `Under 4 years, ${fuelType}, ${engineCC}cc: Duty=${(bracket.duty*100)}%, Excise=${(bracket.excise*100)}%, VAT=${applyVAT ? (bracket.vat*100) : 0}%`;

        return result;
    }

    // === 4 YEARS AND OLDER ===
    let table;
    if (fuelType === 'diesel') {
        table = DIESEL_4PLUS;
    } else {
        table = GASOLINE_4PLUS; // gasoline and hybrid use gasoline table
    }

    const bracket = findBracket(engineCC, table);

    if (bracket.type === 'flat_gyd') {
        // Flat GYD amount
        result.exciseGYD = bracket.amount;
        result.exciseUSD = bracket.amount / rate;
        result.totalTaxGYD = bracket.amount;
        result.totalTaxUSD = bracket.amount / rate;
        result.totalCostGYD = (cifUSD * rate) + bracket.amount;
        result.totalCostUSD = cifUSD + (bracket.amount / rate);
        result.notes.push(`4+ years, ${engineCC}cc: Flat excise GY$${bracket.amount.toLocaleString()}`);
        result.notes.push('No duty, no VAT for 4+ year vehicles');
        result.formulaUsed = `4+ years: Flat GY$${bracket.amount.toLocaleString()}`;
    } else {
        // Formula-based: (CIF + addon) × rate + addon (all in USD)
        const dealerMultiplier = isDealer ? 1.5 : 1;
        const effectiveCIF = cifUSD * dealerMultiplier;

        const exciseUSD = (effectiveCIF + bracket.addon) * bracket.rate + bracket.addon;

        result.exciseUSD = exciseUSD;
        result.exciseGYD = exciseUSD * rate;
        result.totalTaxUSD = exciseUSD;
        result.totalTaxGYD = exciseUSD * rate;
        result.totalCostUSD = cifUSD + exciseUSD;
        result.totalCostGYD = (cifUSD + exciseUSD) * rate;
        result.notes.push(`4+ years, ${fuelType}, ${engineCC}cc: Formula-based excise`);
        result.notes.push('No duty, no VAT for 4+ year vehicles');
        if (isDealer) {
            result.notes.push('Dealer: Excise calculated on 1.5× CIF');
        }
        result.formulaUsed = `4+ years: (CIF + US$${bracket.addon.toLocaleString()}) × ${(bracket.rate*100)}% + US$${bracket.addon.toLocaleString()}`;
    }

    return result;
}

/**
 * Format currency for vehicle calculator
 */
function formatVehicleCurrency(amount, currency) {
    if (amount === undefined || amount === null || isNaN(amount)) {
        return currency === 'USD' ? 'US$0.00' : 'GY$0';
    }
    if (currency === 'USD') {
        return 'US$' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    } else {
        return 'GY$' + Math.round(amount).toLocaleString();
    }
}

/**
 * Initialize the vehicle calculator UI
 */
function initVehicleCalculator() {
    const form = document.getElementById('vehicle-calc-form');
    if (!form) return;

    // Set default exchange rate
    const exchangeInput = document.getElementById('v-exchange-rate');
    if (exchangeInput && !exchangeInput.value) {
        exchangeInput.value = DEFAULT_EXCHANGE_RATE;
    }

    // Setup event listeners for auto-calculation
    setupVehicleAutoCalc();

    // Setup conditional field visibility
    setupConditionalFields();

    debug('Vehicle calculator initialized');
}

/**
 * Setup auto-calculation for vehicle calculator
 */
let vehicleCalcTimer = null;
const VEHICLE_CALC_DELAY = 300;

function setupVehicleAutoCalc() {
    document.querySelectorAll('#vehicle-calculator .v-calc-input').forEach(function(input) {
        const eventType = (input.tagName === 'SELECT' || input.type === 'checkbox') ? 'change' : 'input';
        input.addEventListener(eventType, function() {
            clearTimeout(vehicleCalcTimer);
            vehicleCalcTimer = setTimeout(runVehicleCalculation, VEHICLE_CALC_DELAY);
            // Also update conditional fields
            setupConditionalFields();
        });
    });
}

/**
 * Setup conditional field visibility
 */
function setupConditionalFields() {
    const vehicleType = document.getElementById('v-vehicle-type')?.value || 'car';
    const fuelType = document.getElementById('v-fuel-type')?.value || 'gasoline';
    const plateType = document.getElementById('v-plate-type')?.value || 'private';

    // CC field: hide for electric
    const ccGroup = document.getElementById('v-cc-group');
    if (ccGroup) {
        if (fuelType === 'electric' || vehicleType === 'electric') {
            ccGroup.style.display = 'none';
        } else {
            ccGroup.style.display = '';
        }
    }

    // Fuel type: hide for electric vehicle type
    const fuelGroup = document.getElementById('v-fuel-group');
    if (fuelGroup) {
        if (vehicleType === 'electric') {
            fuelGroup.style.display = 'none';
        } else {
            fuelGroup.style.display = '';
        }
    }

    // Plate type: show government option only for certain types
    // (Government plate applies to cars/SUVs/vans/buses)
    const plateGroup = document.getElementById('v-plate-group');
    if (plateGroup) {
        if (vehicleType === 'motorcycle' || vehicleType === 'atv' || vehicleType === 'electric') {
            plateGroup.style.display = 'none';
            // Reset to private if hidden
            const plateSelect = document.getElementById('v-plate-type');
            if (plateSelect) plateSelect.value = 'private';
        } else {
            plateGroup.style.display = '';
        }
    }

    // Vehicle age: hide for electric
    const ageGroup = document.getElementById('v-age-group');
    if (ageGroup) {
        if (fuelType === 'electric' || vehicleType === 'electric') {
            ageGroup.style.display = 'none';
        } else {
            ageGroup.style.display = '';
        }
    }
}

/**
 * Run the vehicle tax calculation and update the UI
 */
function runVehicleCalculation() {
    const cifUSD = parseFloat(document.getElementById('v-cif')?.value) || 0;
    if (cifUSD <= 0) {
        hideVehicleResults();
        return;
    }

    const exchangeRate = parseFloat(document.getElementById('v-exchange-rate')?.value) || DEFAULT_EXCHANGE_RATE;
    const vehicleAge = document.getElementById('v-vehicle-age')?.value || 'under4';
    const vehicleType = document.getElementById('v-vehicle-type')?.value || 'car';
    const fuelType = document.getElementById('v-fuel-type')?.value || 'gasoline';
    const engineCC = parseInt(document.getElementById('v-engine-cc')?.value) || 0;
    const plateType = document.getElementById('v-plate-type')?.value || 'private';
    const isDealer = document.getElementById('v-dealer')?.checked || false;
    const ratesEl = document.getElementById('v-2026-rates');
    const use2026Rates = ratesEl ? (ratesEl.type === 'hidden' ? true : ratesEl.checked) : true;

    const params = {
        cifUSD,
        exchangeRate,
        vehicleAge,
        vehicleType,
        fuelType,
        engineCC,
        plateType,
        isDealer,
        use2026Rates
    };

    const result = calculateVehicleTax(params);
    updateVehicleResultsDisplay(result);
}

/**
 * Update the vehicle results display
 */
function updateVehicleResultsDisplay(result) {
    const resultsArea = document.getElementById('vehicle-results-area');
    if (!resultsArea) return;

    resultsArea.style.display = 'block';

    // Update summary cards
    safeUpdateElement('v-result-total-tax', formatVehicleCurrency(result.totalTaxGYD, 'GYD'));
    safeUpdateElement('v-result-total-cost', formatVehicleCurrency(result.totalCostGYD, 'GYD'));
    safeUpdateElement('v-result-total-tax-usd', formatVehicleCurrency(result.totalTaxUSD, 'USD'));
    safeUpdateElement('v-result-total-cost-usd', formatVehicleCurrency(result.totalCostUSD, 'USD'));

    // Update breakdown
    safeUpdateElement('v-result-cif-usd', formatVehicleCurrency(result.cifUSD, 'USD'));
    safeUpdateElement('v-result-cif-gyd', formatVehicleCurrency(result.cifGYD, 'GYD'));
    safeUpdateElement('v-result-duty-usd', formatVehicleCurrency(result.dutyUSD, 'USD'));
    safeUpdateElement('v-result-duty-gyd', formatVehicleCurrency(result.dutyGYD, 'GYD'));
    safeUpdateElement('v-result-excise-usd', formatVehicleCurrency(result.exciseUSD, 'USD'));
    safeUpdateElement('v-result-excise-gyd', formatVehicleCurrency(result.exciseGYD, 'GYD'));
    safeUpdateElement('v-result-vat-usd', formatVehicleCurrency(result.vatUSD, 'USD'));
    safeUpdateElement('v-result-vat-gyd', formatVehicleCurrency(result.vatGYD, 'GYD'));
    safeUpdateElement('v-result-totaltax-usd', formatVehicleCurrency(result.totalTaxUSD, 'USD'));
    safeUpdateElement('v-result-totaltax-gyd', formatVehicleCurrency(result.totalTaxGYD, 'GYD'));
    safeUpdateElement('v-result-totalcost-usd', formatVehicleCurrency(result.totalCostUSD, 'USD'));
    safeUpdateElement('v-result-totalcost-gyd', formatVehicleCurrency(result.totalCostGYD, 'GYD'));

    // Rates display
    safeUpdateElement('v-result-duty-rate', (result.dutyRate * 100).toFixed(0) + '%');
    safeUpdateElement('v-result-excise-rate', (result.exciseRate * 100).toFixed(0) + '%');
    safeUpdateElement('v-result-vat-rate', (result.vatRate * 100).toFixed(0) + '%');

    // Formula used
    safeUpdateElement('v-result-formula', result.formulaUsed);

    // Notes
    const notesContainer = document.getElementById('v-result-notes');
    if (notesContainer) {
        if (result.notes.length > 0) {
            notesContainer.innerHTML = result.notes.map(n => 
                `<div class="vehicle-note"><i class="fas fa-info-circle me-1"></i>${n}</div>`
            ).join('');
            notesContainer.style.display = '';
        } else {
            notesContainer.style.display = 'none';
        }
    }

    // Update vehicle sticky results
    const vehicleSticky = document.getElementById('vehicle-sticky-results');
    if (vehicleSticky) {
        vehicleSticky.classList.add('visible');
        safeUpdateElement('v-sticky-tax', formatVehicleCurrency(result.totalTaxGYD, 'GYD'));
        safeUpdateElement('v-sticky-cost', formatVehicleCurrency(result.totalCostGYD, 'GYD'));
        safeUpdateElement('v-sticky-cif', formatVehicleCurrency(result.cifUSD, 'USD'));
    }
}

/**
 * Hide vehicle results
 */
function hideVehicleResults() {
    const resultsArea = document.getElementById('vehicle-results-area');
    if (resultsArea) resultsArea.style.display = 'none';

    const vehicleSticky = document.getElementById('vehicle-sticky-results');
    if (vehicleSticky) vehicleSticky.classList.remove('visible');
}

/**
 * Clear vehicle calculator form
 */
// Wire clear button on load
document.addEventListener('DOMContentLoaded', function() {
    var clearVehicleBtn = document.getElementById('clear-vehicle-form');
    if (clearVehicleBtn) {
        clearVehicleBtn.addEventListener('click', clearVehicleForm);
    }
});

function clearVehicleForm() {
    // Clear CIF and CC inputs
    const cif = document.getElementById('v-cif');
    if (cif) cif.value = '';
    const cc = document.getElementById('v-engine-cc');
    if (cc) cc.value = '';
    // Reset exchange rate to default
    const rate = document.getElementById('v-exchange-rate');
    if (rate) rate.value = '218';
    // Reset dropdowns
    const age = document.getElementById('v-vehicle-age');
    if (age) age.value = 'under4';
    const type = document.getElementById('v-vehicle-type');
    if (type) type.value = 'car';
    const fuel = document.getElementById('v-fuel-type');
    if (fuel) fuel.value = 'gasoline';
    const plate = document.getElementById('v-plate-type');
    if (plate) plate.value = 'private';
    // Uncheck dealer
    const dealer = document.getElementById('v-dealer');
    if (dealer) dealer.checked = false;
    // Show all conditional fields
    const ccGroup = document.getElementById('v-cc-group');
    if (ccGroup) ccGroup.style.display = '';
    const fuelGroup = document.getElementById('v-fuel-group');
    if (fuelGroup) fuelGroup.style.display = '';
    const ageGroup = document.getElementById('v-age-group');
    if (ageGroup) ageGroup.style.display = '';
    // Hide results
    hideVehicleResults();
}
