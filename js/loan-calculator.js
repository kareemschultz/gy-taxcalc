/**
 * Loan Calculator — Amortization engine, extra payment logic, comparison, UI handlers
 */

// ─── State ────────────────────────────────────────────────────────────────────
let _loanLastResults = null;
let _loanAutoCalcDebounce = null;
let _loanExtraEnabled = false;
let _loanCurrency = 'GYD'; // 'GYD' or 'USD'
let _loanAmortView = 'monthly'; // 'monthly' or 'yearly'

// ─── Core Math ────────────────────────────────────────────────────────────────

/**
 * Standard amortization: M = P * [r(1+r)^n] / [(1+r)^n - 1]
 */
function calculateMonthlyPayment(principal, annualRate, termMonths) {
    if (annualRate === 0) return principal / termMonths;
    var r = annualRate / 100 / 12;
    var n = termMonths;
    return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

/**
 * Generate full amortization schedule.
 * Returns array of { month, payment, principal, interest, balance }
 */
function calculateAmortization(principal, annualRate, termMonths) {
    var r = annualRate / 100 / 12;
    var payment = calculateMonthlyPayment(principal, annualRate, termMonths);
    var balance = principal;
    var schedule = [];

    for (var i = 1; i <= termMonths; i++) {
        var interest = balance * r;
        var principalPart = payment - interest;

        // Final payment adjustment for rounding
        if (i === termMonths) {
            principalPart = balance;
            payment = principalPart + interest;
        }

        balance -= principalPart;
        if (balance < 0) balance = 0;

        schedule.push({
            month: i,
            payment: payment,
            principal: principalPart,
            interest: interest,
            balance: balance
        });

        if (balance <= 0) break;
    }

    return schedule;
}

/**
 * Generate amortization schedule with extra payments.
 * extraMonthly: additional fixed monthly payment
 * lumpSum: one-time extra payment
 * lumpSumMonth: month number for lump sum (0 = disabled)
 */
function calculateWithExtraPayments(principal, annualRate, termMonths, extraMonthly, lumpSum, lumpSumMonth) {
    var r = annualRate / 100 / 12;
    var basePayment = calculateMonthlyPayment(principal, annualRate, termMonths);
    var balance = principal;
    var schedule = [];

    for (var i = 1; i <= termMonths; i++) {
        var interest = balance * r;
        var principalPart = basePayment - interest;
        var extra = 0;

        // Apply lump sum at specified month
        if (lumpSumMonth > 0 && i === lumpSumMonth && lumpSum > 0) {
            extra += lumpSum;
        }

        // Apply extra monthly
        if (extraMonthly > 0) {
            extra += extraMonthly;
        }

        // Don't overpay
        var totalPrincipal = Math.min(principalPart + extra, balance);
        var actualPayment = totalPrincipal + interest;

        balance -= totalPrincipal;
        if (balance < 0) balance = 0;

        schedule.push({
            month: i,
            payment: actualPayment,
            principal: totalPrincipal,
            interest: interest,
            balance: balance,
            extra: extra
        });

        if (balance <= 0) break;
    }

    return schedule;
}

/**
 * Summarize an amortization schedule.
 */
function summarizeSchedule(schedule, principal) {
    var totalPaid = 0;
    var totalInterest = 0;
    schedule.forEach(function(row) {
        totalPaid += row.payment;
        totalInterest += row.interest;
    });
    return {
        months: schedule.length,
        totalPaid: totalPaid,
        totalInterest: totalInterest,
        monthlyPayment: schedule.length > 0 ? schedule[0].payment : 0
    };
}

/**
 * Generate comparison data for multiple lender scenarios.
 */
function generateComparisonData(principal, termMonths, bankKeys) {
    return bankKeys.map(function(key) {
        var bank = LOAN_BANK_PRESETS[key];
        if (!bank) return null;
        var rate = bank.rate || bank.rateMin || 0;
        var payment = calculateMonthlyPayment(principal, rate, termMonths);
        var totalPaid = payment * termMonths;
        var totalInterest = totalPaid - principal;
        return {
            key: key,
            name: bank.name,
            rate: rate,
            monthlyPayment: payment,
            totalPaid: totalPaid,
            totalInterest: totalInterest
        };
    }).filter(Boolean);
}

// ─── Currency Helpers ─────────────────────────────────────────────────────────

function getLoanExchangeRate() {
    return parseFloat(document.getElementById('loan-exchange-rate')?.value) || LOAN_DEFAULT_EXCHANGE_RATE;
}

function formatLoanCurrency(amount, currency) {
    if (!currency) currency = _loanCurrency;
    var num = Math.round(amount);
    if (currency === 'USD') {
        num = amount / getLoanExchangeRate();
        return 'US$' + num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }
    return 'GY$' + num.toLocaleString('en-US');
}

function formatLoanAmount(amount) {
    return formatLoanCurrency(amount, _loanCurrency);
}

// ─── Date Helper ──────────────────────────────────────────────────────────────

function calculatePayoffDate(startDate, months) {
    var d = new Date(startDate);
    d.setMonth(d.getMonth() + months);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
}

// ─── UI Helpers ───────────────────────────────────────────────────────────────

function setLoanEl(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
}

function showLoanEl(id) {
    var el = document.getElementById(id);
    if (el) el.style.display = '';
}

function hideLoanEl(id) {
    var el = document.getElementById(id);
    if (el) el.style.display = 'none';
}

// ─── Main Calculate ───────────────────────────────────────────────────────────

function calculateLoan() {
    try {
        var inputs = getLoanInputs();
        if (!inputs) return;

        var baseSchedule = calculateAmortization(inputs.principal, inputs.rate, inputs.term);
        var baseSummary = summarizeSchedule(baseSchedule, inputs.principal);

        var extraSchedule = null;
        var extraSummary = null;
        var monthsSaved = 0;
        var interestSaved = 0;

        if (_loanExtraEnabled && (inputs.extraMonthly > 0 || inputs.lumpSum > 0)) {
            extraSchedule = calculateWithExtraPayments(
                inputs.principal, inputs.rate, inputs.term,
                inputs.extraMonthly, inputs.lumpSum, inputs.lumpSumMonth
            );
            extraSummary = summarizeSchedule(extraSchedule, inputs.principal);
            monthsSaved = baseSummary.months - extraSummary.months;
            interestSaved = baseSummary.totalInterest - extraSummary.totalInterest;
        }

        _loanLastResults = {
            inputs: inputs,
            baseSchedule: baseSchedule,
            baseSummary: baseSummary,
            extraSchedule: extraSchedule,
            extraSummary: extraSummary,
            monthsSaved: monthsSaved,
            interestSaved: interestSaved
        };

        updateLoanDisplay(_loanLastResults);

    } catch (e) {
        console.error('Loan calculation error:', e);
    }
}

function getLoanInputs() {
    var principal = parseFloat(document.getElementById('loan-principal')?.value) || 0;
    var rate = parseFloat(document.getElementById('loan-rate')?.value) || 0;
    var term = parseInt(document.getElementById('loan-term')?.value) || 0;
    var startDateVal = document.getElementById('loan-start-date')?.value || '';
    var extraMonthly = parseFloat(document.getElementById('loan-extra-monthly')?.value) || 0;
    var lumpSum = parseFloat(document.getElementById('loan-lump-sum')?.value) || 0;
    var lumpSumMonth = parseInt(document.getElementById('loan-lump-sum-month')?.value) || 0;

    if (principal <= 0 || rate < 0 || term <= 0) return null;

    // Convert USD input to GYD if toggle is active
    if (_loanCurrency === 'USD') {
        var rate_ex = getLoanExchangeRate();
        principal = principal * rate_ex;
        extraMonthly = extraMonthly * rate_ex;
        lumpSum = lumpSum * rate_ex;
    }

    var startDate = startDateVal ? new Date(startDateVal) : new Date();

    return {
        principal: principal,
        rate: rate,
        term: term,
        startDate: startDate,
        extraMonthly: extraMonthly,
        lumpSum: lumpSum,
        lumpSumMonth: lumpSumMonth
    };
}

// ─── Display Update ───────────────────────────────────────────────────────────

function updateLoanDisplay(results) {
    var inputs = results.inputs;
    var base = results.baseSummary;
    var extra = results.extraSummary;

    // Show results area
    var resultsArea = document.getElementById('loan-results-area');
    if (resultsArea) resultsArea.style.display = '';

    // ── Summary cards ──
    setLoanEl('loan-result-monthly', formatLoanAmount(base.monthlyPayment));
    setLoanEl('loan-result-total', formatLoanAmount(base.totalPaid));
    setLoanEl('loan-result-interest', formatLoanAmount(base.totalInterest));
    setLoanEl('loan-result-rate', inputs.rate.toFixed(2) + '%');
    setLoanEl('loan-result-payoff', calculatePayoffDate(inputs.startDate, base.months));
    setLoanEl('loan-result-months', base.months + ' months (' + Math.floor(base.months / 12) + 'y ' + (base.months % 12) + 'm)');

    // ── Extra payment savings ──
    var savingsEl = document.getElementById('loan-savings-area');
    if (extra && results.monthsSaved > 0) {
        if (savingsEl) savingsEl.style.display = '';
        setLoanEl('loan-savings-months', results.monthsSaved + ' months');
        setLoanEl('loan-savings-interest', formatLoanAmount(results.interestSaved));
        setLoanEl('loan-savings-payoff', calculatePayoffDate(inputs.startDate, extra.months));
        setLoanEl('loan-savings-new-monthly', formatLoanAmount(extra.monthlyPayment));
    } else {
        if (savingsEl) savingsEl.style.display = 'none';
    }

    // ── Sticky bar ──
    var loanSticky = document.getElementById('loan-sticky-results');
    if (loanSticky) loanSticky.classList.add('visible');
    setLoanEl('loan-sticky-monthly', formatLoanAmount(base.monthlyPayment));
    setLoanEl('loan-sticky-interest', formatLoanAmount(base.totalInterest));
    setLoanEl('loan-sticky-payoff', calculatePayoffDate(inputs.startDate, (extra ? extra.months : base.months)));

    // ── Amortization table ──
    renderAmortizationTable(results);

    // ── Charts ──
    if (typeof createLoanCharts === 'function') {
        createLoanCharts(results);
    }

    // ── Comparison ──
    renderLoanComparison(inputs.principal, inputs.term, inputs.rate);
}

// ─── Amortization Table ───────────────────────────────────────────────────────

function renderAmortizationTable(results) {
    var tbody = document.getElementById('amortization-tbody');
    var tfoot = document.getElementById('amortization-tfoot');
    if (!tbody) return;

    var schedule = results.extraSchedule || results.baseSchedule;
    var rows = _loanAmortView === 'yearly' ? buildYearlyRows(schedule) : schedule;

    var totalPayment = 0, totalPrincipal = 0, totalInterest = 0;
    var html = '';

    rows.forEach(function(row) {
        totalPayment += row.payment;
        totalPrincipal += row.principal;
        totalInterest += row.interest;

        var label = _loanAmortView === 'yearly' ? 'Year ' + row.month : 'Month ' + row.month;
        var extraBadge = (row.extra && row.extra > 0) ? ' <span class="badge bg-success" style="font-size:0.65rem;">+extra</span>' : '';
        html += '<tr>' +
            '<td>' + label + extraBadge + '</td>' +
            '<td>' + formatLoanAmount(row.payment) + '</td>' +
            '<td>' + formatLoanAmount(row.principal) + '</td>' +
            '<td class="text-danger">' + formatLoanAmount(row.interest) + '</td>' +
            '<td>' + formatLoanAmount(row.balance) + '</td>' +
            '</tr>';
    });

    tbody.innerHTML = html;

    if (tfoot) {
        tfoot.innerHTML = '<tr class="table-dark fw-bold">' +
            '<td>Total</td>' +
            '<td>' + formatLoanAmount(totalPayment) + '</td>' +
            '<td>' + formatLoanAmount(totalPrincipal) + '</td>' +
            '<td class="text-danger">' + formatLoanAmount(totalInterest) + '</td>' +
            '<td>—</td>' +
            '</tr>';
    }
}

function buildYearlyRows(schedule) {
    var years = {};
    schedule.forEach(function(row) {
        var year = Math.ceil(row.month / 12);
        if (!years[year]) {
            years[year] = { month: year, payment: 0, principal: 0, interest: 0, balance: 0, extra: 0 };
        }
        years[year].payment += row.payment;
        years[year].principal += row.principal;
        years[year].interest += row.interest;
        years[year].balance = row.balance;
        years[year].extra += (row.extra || 0);
    });
    return Object.values(years);
}

// ─── Bank Comparison ──────────────────────────────────────────────────────────

function renderLoanComparison(principal, termMonths, userRate) {
    var container = document.getElementById('loan-comparison-cards');
    if (!container) return;

    var compData = generateComparisonData(principal, termMonths, LOAN_COMPARISON_BANKS);
    if (!compData.length) return;

    // Sort by total interest ascending
    compData.sort(function(a, b) { return a.totalInterest - b.totalInterest; });

    var maxInterest = compData[compData.length - 1].totalInterest;
    var html = '';

    compData.forEach(function(item, idx) {
        var savings = maxInterest - item.totalInterest;
        var savingsBadge = savings > 0
            ? '<span class="savings-highlight">Save ' + formatLoanAmount(savings) + '</span>'
            : '<span class="badge bg-secondary">Highest Cost</span>';
        var bestBadge = idx === 0 ? '<span class="badge bg-success ms-1">Best</span>' : '';

        html += '<div class="comparison-card">' +
            '<div class="comparison-card-header">' +
            '<strong>' + item.name + bestBadge + '</strong>' +
            '<span class="text-muted">' + item.rate.toFixed(2) + '% p.a.</span>' +
            '</div>' +
            '<div class="comparison-card-body">' +
            '<div class="comparison-row">' +
            '<span>Monthly Payment</span>' +
            '<strong>' + formatLoanAmount(item.monthlyPayment) + '</strong>' +
            '</div>' +
            '<div class="comparison-row">' +
            '<span>Total Interest</span>' +
            '<strong class="text-danger">' + formatLoanAmount(item.totalInterest) + '</strong>' +
            '</div>' +
            '<div class="comparison-row">' +
            '<span>Total Cost</span>' +
            '<strong>' + formatLoanAmount(item.totalPaid) + '</strong>' +
            '</div>' +
            '<div class="mt-2">' + savingsBadge + '</div>' +
            '</div>' +
            '</div>';
    });

    container.innerHTML = html;
}

// ─── Bank Preset Handler ──────────────────────────────────────────────────────

function applyBankPreset(bankKey) {
    var bank = LOAN_BANK_PRESETS[bankKey];
    if (!bank) return;

    var rateInput = document.getElementById('loan-rate');
    var rateHint = document.getElementById('loan-rate-hint');

    if (bankKey === 'custom') {
        if (rateInput) rateInput.removeAttribute('readonly');
        if (rateHint) rateHint.textContent = '';
        return;
    }

    if (rateInput) {
        rateInput.value = bank.rate || bank.rateMin || '';
        rateInput.setAttribute('readonly', 'readonly');
    }

    if (rateHint) {
        var hint = bank.note;
        if (bank.rateMin !== bank.rateMax && bank.rateMin != null) {
            hint += ' (' + bank.rateMin + '%–' + bank.rateMax + '% range)';
        }
        rateHint.textContent = hint;
    }
}

function applyLoanTypePreset(loanType) {
    var config = LOAN_TYPE_CONFIGS[loanType];
    if (!config) return;

    var principalInput = document.getElementById('loan-principal');
    var termInput = document.getElementById('loan-term');
    var bankSelect = document.getElementById('loan-bank');
    var termYearsHint = document.getElementById('loan-term-years');

    if (principalInput && !principalInput.value) {
        principalInput.value = config.defaultPrincipal;
    }
    if (termInput && !termInput.value) {
        termInput.value = config.defaultTerm;
    }
    if (bankSelect) {
        bankSelect.value = config.defaultBank;
        applyBankPreset(config.defaultBank);
    }
    updateTermYearsHint();
}

function updateTermYearsHint() {
    var termInput = document.getElementById('loan-term');
    var hint = document.getElementById('loan-term-years');
    if (!termInput || !hint) return;
    var months = parseInt(termInput.value) || 0;
    var years = Math.floor(months / 12);
    var rem = months % 12;
    if (years > 0 && rem > 0) {
        hint.textContent = years + ' year' + (years > 1 ? 's' : '') + ', ' + rem + ' month' + (rem > 1 ? 's' : '');
    } else if (years > 0) {
        hint.textContent = years + ' year' + (years > 1 ? 's' : '');
    } else if (rem > 0) {
        hint.textContent = rem + ' month' + (rem > 1 ? 's' : '');
    } else {
        hint.textContent = '';
    }
}

// ─── Auto-Calculate Setup ─────────────────────────────────────────────────────

function setupLoanAutoCalc() {
    var calc = document.getElementById('loan-calculator');
    if (!calc) return;

    calc.querySelectorAll('.loan-calc-input').forEach(function(input) {
        input.addEventListener('input', function() {
            clearTimeout(_loanAutoCalcDebounce);
            _loanAutoCalcDebounce = setTimeout(calculateLoan, 300);
        });
        input.addEventListener('change', function() {
            clearTimeout(_loanAutoCalcDebounce);
            _loanAutoCalcDebounce = setTimeout(calculateLoan, 300);
        });
    });

    // Loan term hint
    var termInput = document.getElementById('loan-term');
    if (termInput) {
        termInput.addEventListener('input', updateTermYearsHint);
    }

    // Bank preset selector
    var bankSelect = document.getElementById('loan-bank');
    if (bankSelect) {
        bankSelect.addEventListener('change', function() {
            applyBankPreset(this.value);
            clearTimeout(_loanAutoCalcDebounce);
            _loanAutoCalcDebounce = setTimeout(calculateLoan, 300);
        });
    }

    // Loan type selector
    var loanTypeSelect = document.getElementById('loan-type');
    if (loanTypeSelect) {
        loanTypeSelect.addEventListener('change', function() {
            applyLoanTypePreset(this.value);
            clearTimeout(_loanAutoCalcDebounce);
            _loanAutoCalcDebounce = setTimeout(calculateLoan, 300);
        });
    }

    // Extra payments toggle
    var extraToggle = document.getElementById('loan-extra-toggle');
    if (extraToggle) {
        extraToggle.addEventListener('change', function() {
            _loanExtraEnabled = this.checked;
            var extraBody = document.getElementById('loan-extra-body');
            if (extraBody) extraBody.style.display = _loanExtraEnabled ? '' : 'none';
            clearTimeout(_loanAutoCalcDebounce);
            _loanAutoCalcDebounce = setTimeout(calculateLoan, 300);
        });
    }

    // Currency toggle
    var currencyToggle = document.getElementById('loan-currency-toggle');
    if (currencyToggle) {
        currencyToggle.addEventListener('change', function() {
            _loanCurrency = this.checked ? 'USD' : 'GYD';
            updateLoanCurrencyLabels();
            if (_loanLastResults) updateLoanDisplay(_loanLastResults);
        });
    }

    // Amortization view toggle
    var amortYearly = document.getElementById('amort-view-yearly');
    var amortMonthly = document.getElementById('amort-view-monthly');
    if (amortYearly) {
        amortYearly.addEventListener('click', function() {
            _loanAmortView = 'yearly';
            amortYearly.classList.add('active');
            if (amortMonthly) amortMonthly.classList.remove('active');
            if (_loanLastResults) renderAmortizationTable(_loanLastResults);
        });
    }
    if (amortMonthly) {
        amortMonthly.addEventListener('click', function() {
            _loanAmortView = 'monthly';
            amortMonthly.classList.add('active');
            if (amortYearly) amortYearly.classList.remove('active');
            if (_loanLastResults) renderAmortizationTable(_loanLastResults);
        });
    }
}

function updateLoanCurrencyLabels() {
    var labels = document.querySelectorAll('.loan-currency-label');
    labels.forEach(function(el) {
        el.textContent = _loanCurrency === 'USD' ? 'US$' : 'GY$';
    });
    var toggleLabel = document.getElementById('loan-currency-label');
    if (toggleLabel) toggleLabel.textContent = _loanCurrency === 'USD' ? 'USD Mode' : 'GYD Mode';
}

// ─── Init ─────────────────────────────────────────────────────────────────────

function initLoanCalculator() {
    // Set default start date to today
    var startDateInput = document.getElementById('loan-start-date');
    if (startDateInput) {
        var today = new Date().toISOString().split('T')[0];
        startDateInput.value = today;
    }

    // Apply default loan type preset
    var loanTypeSelect = document.getElementById('loan-type');
    if (loanTypeSelect) {
        applyLoanTypePreset(loanTypeSelect.value);
    }

    // Apply default bank preset
    var bankSelect = document.getElementById('loan-bank');
    if (bankSelect) {
        applyBankPreset(bankSelect.value);
    }

    // Hide extra payment body initially
    var extraBody = document.getElementById('loan-extra-body');
    if (extraBody) extraBody.style.display = 'none';

    setupLoanAutoCalc();

    if (typeof console !== 'undefined') {
        console.log('[LoanCalc] Initialized');
    }
}
