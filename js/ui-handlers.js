/**
 * UI event handlers and DOM manipulation - REDESIGNED
 * Progressive disclosure, auto-calculate, sticky results
 */

// Debounce timer for auto-calculate
let autoCalcTimer = null;
const AUTO_CALC_DELAY = 300; // ms

/**
 * Helper function to safely update element text content
 */
function safeUpdateElement(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
        return true;
    }
    const optionalElements = [
        'result-qualification-allowance', 'result-annual-nis',
        'result-month-six-net', 'result-month-six-gratuity',
        'result-month-twelve-net', 'result-month-twelve-gratuity',
        'result-month-twelve-vacation'
    ];
    if (!optionalElements.includes(elementId)) {
        console.warn(`Element '${elementId}' not found`);
    }
    return false;
}

/**
 * Trigger auto-calculate with debounce
 */
function triggerAutoCalculate() {
    const basicSalary = parseFloat(document.getElementById('basic-salary')?.value) || 0;
    if (basicSalary <= 0) return; // Don't calculate without salary

    clearTimeout(autoCalcTimer);
    autoCalcTimer = setTimeout(function() {
        try {
            calculateSalary();
        } catch (e) {
            console.error('Auto-calculate error:', e);
        }
    }, AUTO_CALC_DELAY);
}

/**
 * Initialize accordion (collapsible sections)
 */
function setupAccordion() {
    document.querySelectorAll('[data-toggle-section]').forEach(function(header) {
        header.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-toggle-section');
            const section = document.getElementById(sectionId);
            if (section) {
                section.classList.toggle('collapsed');
            }
        });
    });
}

/**
 * Initialize all event listeners
 */
function setupEventListeners() {
    debug('Setting up event listeners');

    // Setup accordion
    setupAccordion();

    // Setup position dropdown
    setupPositionDropdown();

    // Setup qualification allowance listeners
    setupQualificationListeners();

    // Calculate button (fallback)
    const calculateBtn = document.getElementById('calculate-btn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            debug('Calculate button clicked');
            calculateSalary();
            showSalaryIncreaseSection();
        });
    }

    // Calculate with increase button
    const calculateIncreaseBtn = document.getElementById('calculate-increase-btn');
    if (calculateIncreaseBtn) {
        calculateIncreaseBtn.addEventListener('click', function() {
            debug('Calculate with increase button clicked');
            calculateWithIncrease();
        });
    }

    // Toggle taxable allowances
    const toggleTaxableAllowances = document.getElementById('toggle-taxable-allowances');
    if (toggleTaxableAllowances) {
        toggleTaxableAllowances.addEventListener('click', function(e) {
            e.preventDefault();
            const singleSection = document.getElementById('single-taxable-allowance');
            const multipleSection = document.getElementById('multiple-taxable-allowances');

            singleSection.classList.toggle('d-none');
            multipleSection.classList.toggle('d-none');

            const icon = this.querySelector('i');
            const text = this.querySelector('span');

            if (multipleSection.classList.contains('d-none')) {
                icon.classList.remove('fa-minus-circle');
                icon.classList.add('fa-plus-circle');
                text.textContent = 'Show Details';
            } else {
                icon.classList.remove('fa-plus-circle');
                icon.classList.add('fa-minus-circle');
                text.textContent = 'Show Total';
                calculateTaxableAllowancesTotal();
            }
        });
    }

    // Toggle non-taxable allowances
    const toggleNonTaxableAllowances = document.getElementById('toggle-non-taxable-allowances');
    if (toggleNonTaxableAllowances) {
        toggleNonTaxableAllowances.addEventListener('click', function(e) {
            e.preventDefault();
            const singleSection = document.getElementById('single-non-taxable-allowance');
            const multipleSection = document.getElementById('multiple-non-taxable-allowances');

            singleSection.classList.toggle('d-none');
            multipleSection.classList.toggle('d-none');

            const icon = this.querySelector('i');
            const text = this.querySelector('span');

            if (multipleSection.classList.contains('d-none')) {
                icon.classList.remove('fa-minus-circle');
                icon.classList.add('fa-plus-circle');
                text.textContent = 'Show Details';
            } else {
                icon.classList.remove('fa-plus-circle');
                icon.classList.add('fa-minus-circle');
                text.textContent = 'Show Total';
                calculateNonTaxableAllowancesTotal();
            }
        });
    }

    // Toggle retroactive section
    const toggleRetroactive = document.getElementById('toggle-retroactive');
    if (toggleRetroactive) {
        toggleRetroactive.addEventListener('change', function() {
            const retroactiveSection = document.getElementById('retroactive-section');
            const retroactiveResultsDisplay = document.getElementById('retroactive-results-display');
            if (this.checked) {
                retroactiveSection.classList.remove('d-none');
            } else {
                retroactiveSection.classList.add('d-none');
                if (retroactiveResultsDisplay) retroactiveResultsDisplay.classList.add('d-none');
            }
        });
    }

    // Insurance dropdown
    const insuranceDropdown = document.getElementById('insurance');
    if (insuranceDropdown) {
        insuranceDropdown.addEventListener('change', function() {
            const customPremiumSection = document.getElementById('custom-premium-section');
            if (this.value === 'custom') {
                customPremiumSection.classList.remove('d-none');
            } else {
                customPremiumSection.classList.add('d-none');
                document.getElementById('custom-premium').value = '';
            }
            triggerAutoCalculate();
        });
    }

    // Taxable allowances calculation
    document.querySelectorAll('.taxable-allowance').forEach(function(input) {
        input.addEventListener('input', calculateTaxableAllowancesTotal);
    });

    // Non-taxable allowances calculation
    document.querySelectorAll('.non-taxable-allowance').forEach(function(input) {
        input.addEventListener('input', calculateNonTaxableAllowancesTotal);
    });

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
            toggleDarkMode(this.checked);
        });
    }

    // Auto-calculate on ANY input change
    setupAutoCalculate();

    // Setup payment frequency listeners
    setupPaymentFrequencyListeners();

    // Initialize tooltips
    initializeTooltips();
}

/**
 * Setup auto-calculate on all input changes
 */
function setupAutoCalculate() {
    // Listen to all calc-input elements
    document.querySelectorAll('.calc-input').forEach(function(input) {
        const eventType = (input.tagName === 'SELECT' || input.type === 'radio' || input.type === 'checkbox') ? 'change' : 'input';
        input.addEventListener(eventType, function() {
            triggerAutoCalculate();
        });
    });

    // Also listen to qualification radio buttons
    document.querySelectorAll('.qualification-check').forEach(function(radio) {
        radio.addEventListener('change', function() {
            updateQualificationAllowance();
            triggerAutoCalculate();
        });
    });

    // Mark body as auto-calc active (hides manual calc button when results showing)
    document.body.classList.add('auto-calc-active');
}

/**
 * Update all frequency-dependent labels and previews
 */
function updateFrequencyLabels() {
    const frequencyConfig = getFrequencyConfig();

    const basicSalaryLabel = document.getElementById('basic-salary-label');
    if (basicSalaryLabel) {
        basicSalaryLabel.textContent = `Basic ${frequencyConfig.label} Salary`;
    }

    const salaryFrequencyLabel = document.getElementById('salary-frequency-label');
    if (salaryFrequencyLabel) {
        salaryFrequencyLabel.textContent = frequencyConfig.periodLabel;
    }

    updateTaxCalculationPreview();
    updateAllowanceLabels();
    updateQualificationAllowance();
}

/**
 * Update the tax calculation preview
 */
function updateTaxCalculationPreview() {
    const frequencyConfig = getFrequencyConfig();

    const previewPA = document.getElementById('preview-personal-allowance');
    if (previewPA) previewPA.textContent = formatCurrency(frequencyConfig.personalAllowance);

    const previewTax = document.getElementById('preview-tax-threshold');
    if (previewTax) previewTax.textContent = formatCurrency(frequencyConfig.taxThreshold);

    const previewNIS = document.getElementById('preview-nis-ceiling');
    if (previewNIS) previewNIS.textContent = formatCurrency(frequencyConfig.nisCeiling);
}

/**
 * Update allowance field labels
 */
function updateAllowanceLabels() {
    // Labels update handled by frequency config - kept for backward compatibility
}

/**
 * Update qualification allowance display
 */
function updateQualificationAllowance() {
    const selectedQualification = document.querySelector('input[name="qualification-type"]:checked')?.value || 'none';
    const allowanceAmount = getQualificationAllowanceForFrequency(selectedQualification);
    const frequencyConfig = getFrequencyConfig();

    const qualificationAlert = document.querySelector('.qualification-alert');
    const allowanceAmountElement = document.getElementById('qualification-allowance-amount');

    if (selectedQualification === 'none') {
        if (qualificationAlert) qualificationAlert.classList.add('d-none');
    } else {
        if (qualificationAlert) qualificationAlert.classList.remove('d-none');
        if (allowanceAmountElement) {
            allowanceAmountElement.textContent = `${formatCurrency(allowanceAmount)} ${frequencyConfig.periodLabel}`;
        }
    }
}

/**
 * Setup qualification listeners
 */
function setupQualificationListeners() {
    document.querySelectorAll('.qualification-check').forEach(function(check) {
        check.addEventListener('change', updateQualificationAllowance);
    });
}

/**
 * Setup payment frequency event listeners
 */
function setupPaymentFrequencyListeners() {
    const paymentFrequencySelect = document.getElementById('payment-frequency');
    if (paymentFrequencySelect) {
        paymentFrequencySelect.addEventListener('change', function() {
            debug('Payment frequency changed to: ' + this.value);
            updateFrequencyLabels();
            triggerAutoCalculate();
        });
    }
}

/**
 * Initialize Bootstrap tooltips
 */
function initializeTooltips() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl, { html: true });
    });
}

/**
 * Calculate taxable allowances total
 */
function calculateTaxableAllowancesTotal() {
    let total = 0;
    document.querySelectorAll('.taxable-allowance').forEach(function(input) {
        total += parseFloat(input.value) || 0;
    });

    const totalElement = document.getElementById('taxable-allowances-total');
    if (totalElement) totalElement.textContent = 'GYD $' + total.toFixed(2);

    if (document.getElementById('single-taxable-allowance') &&
        !document.getElementById('single-taxable-allowance').classList.contains('d-none')) {
        document.getElementById('taxable-allowances').value = total;
    }
}

/**
 * Calculate non-taxable allowances total
 */
function calculateNonTaxableAllowancesTotal() {
    let total = 0;
    document.querySelectorAll('.non-taxable-allowance').forEach(function(input) {
        if (input.id !== 'vacation-allowance') {
            total += parseFloat(input.value) || 0;
        }
    });

    const totalElement = document.getElementById('non-taxable-allowances-total');
    if (totalElement) totalElement.textContent = 'GYD $' + total.toFixed(2);

    if (document.getElementById('single-non-taxable-allowance') &&
        !document.getElementById('single-non-taxable-allowance').classList.contains('d-none')) {
        document.getElementById('non-taxable-allowances').value = total;
    }
}

/**
 * Show results sections - REDESIGNED for new layout
 */
function showResultsSections() {
    const resultsArea = document.getElementById('results-area');
    if (resultsArea) resultsArea.style.display = 'block';

    // Show sticky results
    const stickyResults = document.getElementById('sticky-results');
    if (stickyResults) stickyResults.classList.add('visible');

    // Show mobile sticky bar
    const mobileBar = document.getElementById('mobile-sticky-bar');
    if (mobileBar && window.innerWidth < 768) mobileBar.classList.add('visible');

    // Show simulator section inside its accordion
    const simulatorSection = document.getElementById('section-simulator');
    if (simulatorSection) simulatorSection.style.display = '';
}

/**
 * Hide results sections
 */
function hideResultsSections() {
    const resultsArea = document.getElementById('results-area');
    if (resultsArea) resultsArea.style.display = 'none';

    const stickyResults = document.getElementById('sticky-results');
    if (stickyResults) stickyResults.classList.remove('visible');

    const mobileBar = document.getElementById('mobile-sticky-bar');
    if (mobileBar) mobileBar.classList.remove('visible');
}

/**
 * Show frequency change message - simplified for auto-calc
 */
function showFrequencyChangeMessage() {
    // No longer needed with auto-calculate - results update automatically
}

/**
 * Update summary display
 */
function updateSummaryDisplay(results) {
    if (!results) return;

    try {
        const frequencyConfig = results.frequencyConfig;

        // Main summary
        safeUpdateElement('summary-net-monthly', formatCurrency(results.netSalaryForFrequency || results.monthlyNetSalary));
        safeUpdateElement('summary-annual-net', formatCurrency(results.annualTotal));
        safeUpdateElement('summary-month-six', formatCurrency(results.monthSixTotal));
        safeUpdateElement('summary-month-twelve', formatCurrency(results.monthTwelveTotal));

        // Quick stats
        const effectiveTaxRate = ((results.incomeTax / (results.regularMonthlyGrossIncome || results.monthlyGrossIncome)) * 100) || 0;
        const retentionRate = (((results.netSalaryForFrequency || results.monthlyNetSalary) / (results.regularMonthlyGrossIncome || results.monthlyGrossIncome)) * 100) || 0;

        safeUpdateElement('stat-tax-rate', effectiveTaxRate.toFixed(1) + '%');
        safeUpdateElement('stat-retention', retentionRate.toFixed(1) + '%');
        safeUpdateElement('stat-gratuity', formatCurrency(results.monthlyGratuityAccrual));
        safeUpdateElement('stat-nis', formatCurrency(results.nisContribution));

        // Sticky results (desktop)
        safeUpdateElement('sticky-net', formatCurrency(results.netSalaryForFrequency || results.monthlyNetSalary));
        safeUpdateElement('sticky-gross', formatCurrency(results.regularMonthlyGrossIncome || results.monthlyGrossIncome));
        safeUpdateElement('sticky-tax', formatCurrency(results.incomeTax));
        safeUpdateElement('sticky-nis', formatCurrency(results.nisContribution));

        // Mobile sticky bar
        safeUpdateElement('mobile-net', formatCurrency(results.netSalaryForFrequency || results.monthlyNetSalary));
        safeUpdateElement('mobile-gross', formatCurrency(results.regularMonthlyGrossIncome || results.monthlyGrossIncome));
        safeUpdateElement('mobile-tax', formatCurrency(results.incomeTax));

        // Update labels for frequency
        if (frequencyConfig) {
            updateSummaryLabelsForFrequency(frequencyConfig);
        }

        showResultsSections();
    } catch (error) {
        console.error('Error in updateSummaryDisplay:', error);
    }
}

/**
 * Update summary labels for frequency
 */
function updateSummaryLabelsForFrequency(frequencyConfig) {
    // Summary title
    const summaryTitle = document.querySelector('.results-summary h3');
    if (summaryTitle) {
        summaryTitle.innerHTML = `<i class="fas fa-chart-line me-2"></i>Your ${frequencyConfig.label} Salary Summary`;
    }

    // Sticky labels
    const stickyNetLabel = document.getElementById('sticky-net-label');
    if (stickyNetLabel) stickyNetLabel.textContent = `${frequencyConfig.label} Take-Home`;

    const mobileNetLabel = document.getElementById('mobile-net-label');
    if (mobileNetLabel) mobileNetLabel.textContent = `${frequencyConfig.label} Take-Home`;

    // Summary item labels
    const summaryLabels = {
        'summary-net-monthly': `${frequencyConfig.label} Take-Home`,
        'summary-annual-net': 'Annual Package',
        'summary-month-six': 'Month 6 Total',
        'summary-month-twelve': 'Month 12 Total'
    };

    Object.entries(summaryLabels).forEach(function([elementId, label]) {
        var element = document.getElementById(elementId);
        if (element) {
            var summaryItem = element.closest('.summary-item');
            if (summaryItem) {
                var labelElement = summaryItem.querySelector('.summary-label');
                if (labelElement) labelElement.textContent = label;
            }
        }
    });

    // Quick stat labels
    const quickStatLabels = {
        'stat-tax-rate': 'Effective Tax Rate',
        'stat-retention': 'Income Retention',
        'stat-gratuity': 'Monthly Gratuity',
        'stat-nis': `${frequencyConfig.label} NIS`
    };

    Object.entries(quickStatLabels).forEach(function([elementId, label]) {
        var element = document.getElementById(elementId);
        if (element) {
            var quickStat = element.closest('.quick-stat');
            if (quickStat) {
                var labelElement = quickStat.querySelector('.quick-stat-label');
                if (labelElement) labelElement.textContent = label;
            }
        }
    });
}

/**
 * Update all result fields
 */
function updateResultsDisplay(results) {
    try {
        var hasFrequencyConfig = results.frequencyConfig;

        safeUpdateElement('result-basic', formatCurrency(results.basicSalary));
        safeUpdateElement('result-taxable-allowances', formatCurrency(results.taxableAllowances));
        safeUpdateElement('result-non-taxable-allowances', formatCurrency(results.nonTaxableAllowances));
        safeUpdateElement('result-qualification-allowance', formatCurrency(results.qualificationAllowance || 0));
        safeUpdateElement('result-gross', formatCurrency(results.regularMonthlyGrossIncome || results.monthlyGrossIncome));
        safeUpdateElement('result-personal-allowance', formatCurrency(results.personalAllowance));
        safeUpdateElement('result-nis', formatCurrency(results.nisContribution));
        safeUpdateElement('result-child', formatCurrency(results.childAllowance));
        safeUpdateElement('result-overtime', formatCurrency(results.overtimeAllowance));
        safeUpdateElement('result-second-job', formatCurrency(results.secondJobAllowance));
        safeUpdateElement('result-insurance', formatCurrency(results.actualInsuranceDeduction));
        safeUpdateElement('result-loan-deductions', formatCurrency(results.loanPayment));
        safeUpdateElement('result-credit-union-deduction', formatCurrency(results.creditUnionDeduction));
        safeUpdateElement('result-taxable-income', formatCurrency(results.taxableIncome));
        safeUpdateElement('result-tax', formatCurrency(results.incomeTax));
        safeUpdateElement('result-monthly-gratuity', formatCurrency(results.monthlyGratuityAccrual));
        safeUpdateElement('result-net', formatCurrency(results.netSalaryForFrequency || results.monthlyNetSalary));

        if (hasFrequencyConfig) {
            updateResultLabelsForFrequency(results.frequencyConfig);
        }

        // Annual projections
        safeUpdateElement('result-annual-gross', formatCurrency(results.annualGrossIncome));
        safeUpdateElement('result-annual-nis', formatCurrency(results.annualNisContribution || results.nisContribution * 12));
        safeUpdateElement('result-annual-tax', formatCurrency(results.annualTaxPayable));
        safeUpdateElement('result-annual-gratuity', formatCurrency(results.annualGratuityTotal));
        safeUpdateElement('result-annual-net', formatCurrency(results.annualTotal));

        // Special month totals
        safeUpdateElement('result-month-six-net', formatCurrency(results.monthlyNetSalary));
        safeUpdateElement('result-month-six-gratuity', formatCurrency(results.sixMonthGratuity));
        safeUpdateElement('result-month-six-total', formatCurrency(results.monthSixTotal));

        safeUpdateElement('result-month-twelve-net', formatCurrency(results.monthlyNetSalary));
        safeUpdateElement('result-month-twelve-gratuity', formatCurrency(results.sixMonthGratuity));
        safeUpdateElement('result-month-twelve-vacation', formatCurrency(results.vacationAllowance || 0));
        safeUpdateElement('result-month-twelve-total', formatCurrency(results.monthTwelveTotal));

        // Second job visibility
        var secondJobRow = document.getElementById('second-job-result-row');
        if (secondJobRow) {
            var secondJobVal = parseFloat(document.getElementById('second-job')?.value) || 0;
            if (secondJobVal > 0) {
                secondJobRow.classList.remove('d-none');
            } else {
                secondJobRow.classList.add('d-none');
            }
        }

        updateSummaryDisplay(results);

        // Charts
        createIncomeChart(results.basicSalary, results.taxableAllowances, results.nonTaxableAllowances, results.monthlyGratuityAccrual);
        createTaxChart(results.taxableIncome, results.incomeTax);
        createCashFlowChart(results.monthlyNetSalary, results.sixMonthGratuity, results.vacationAllowance);
        createTaxSavingsChart(results);
        createNetVsGrossChart(results);

        // Scroll to results on first calculation on mobile
        if (window.innerWidth < 768 && !window._hasScrolledToResults) {
            var resultsArea = document.getElementById('results-area');
            if (resultsArea) {
                setTimeout(function() {
                    resultsArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
                window._hasScrolledToResults = true;
            }
        }
    } catch (error) {
        console.error('Error in updateResultsDisplay:', error);
        try { updateSummaryDisplay(results); } catch (e) { console.error(e); }
    }
}

/**
 * Update result labels for frequency
 */
function updateResultLabelsForFrequency(frequencyConfig) {
    var frequencyLabels = {
        'result-basic': `<i class="fas fa-dollar-sign me-1"></i> Basic Salary (${frequencyConfig.periodLabel}):`,
        'result-taxable-allowances': `<i class="fas fa-coins me-1"></i> Taxable Allowances (${frequencyConfig.periodLabel}):`,
        'result-non-taxable-allowances': `<i class="fas fa-hand-holding-usd me-1"></i> Non-Taxable (${frequencyConfig.periodLabel}):`,
        'result-qualification-allowance': `<i class="fas fa-graduation-cap me-1"></i> Qualification (${frequencyConfig.periodLabel}):`,
        'result-gross': `<i class="fas fa-money-bill-wave me-1"></i> Total Gross (${frequencyConfig.periodLabel}):`,
        'result-personal-allowance': `<i class="fas fa-shield-alt me-1"></i> Tax Threshold (${frequencyConfig.periodLabel}):`,
        'result-nis': `<i class="fas fa-university me-1"></i> NIS (${frequencyConfig.periodLabel}):`,
        'result-child': `<i class="fas fa-child me-1"></i> Child Allowance (${frequencyConfig.periodLabel}):`,
        'result-overtime': `<i class="fas fa-clock me-1"></i> Overtime Allowance (${frequencyConfig.periodLabel}):`,
        'result-second-job': `<i class="fas fa-briefcase me-1"></i> Second Job Allowance (${frequencyConfig.periodLabel}):`,
        'result-insurance': `<i class="fas fa-shield-alt me-1"></i> Insurance (${frequencyConfig.periodLabel}):`,
        'result-loan-deductions': `<i class="fas fa-credit-card me-1"></i> Loans (${frequencyConfig.periodLabel}):`,
        'result-credit-union-deduction': `<i class="fas fa-university me-1"></i> Credit Union (${frequencyConfig.periodLabel}):`,
        'result-taxable-income': `<i class="fas fa-calculator me-1"></i> Taxable Income (${frequencyConfig.periodLabel}):`,
        'result-tax': `<i class="fas fa-percentage me-1"></i> Income Tax (${frequencyConfig.periodLabel}):`,
        'result-net': `<i class="fas fa-wallet me-1"></i> NET TAKE-HOME (${frequencyConfig.periodLabel}):`
    };

    Object.entries(frequencyLabels).forEach(function([elementId, labelHtml]) {
        var element = document.getElementById(elementId);
        if (element) {
            var resultRow = element.closest('.result-row');
            if (resultRow) {
                var labelElement = resultRow.querySelector('.result-label');
                if (labelElement) labelElement.innerHTML = labelHtml;
            }
        }
    });
}

/**
 * Setup position dropdown
 */
function setupPositionDropdown() {
    var positionSelect = document.getElementById('position-select');
    var positionCustom = document.getElementById('position-custom');

    if (positionSelect && positionCustom) {
        // Initial state
        positionCustom.style.display = positionSelect.value === 'other' ? 'block' : 'none';

        positionSelect.addEventListener('change', function() {
            if (this.value === 'other') {
                positionCustom.style.display = 'block';
                positionCustom.focus();
            } else {
                positionCustom.style.display = 'none';
                applyPositionPreset(this.value);
                // Auto-calculate immediately after applying preset
                setTimeout(function() {
                    calculateSalary();
                    showSalaryIncreaseSection();
                    // Scroll to results
                    var resultsArea = document.getElementById('results-area');
                    if (resultsArea) {
                        setTimeout(function() {
                            resultsArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 100);
                    }
                }, 50);
            }
        });
    }
}

/**
 * Get selected position text
 */
function getSelectedPosition() {
    var positionSelect = document.getElementById('position-select');
    var positionCustom = document.getElementById('position-custom');

    if (!positionSelect || !positionCustom) {
        var oldField = document.getElementById('position');
        return oldField ? oldField.value : '';
    }

    if (positionSelect.value === 'other') {
        return positionCustom.value;
    }
    return positionSelect.options[positionSelect.selectedIndex].text;
}
