/**
 * Loan Calculator — Amortization engine, extra payment logic, comparison, UI handlers
 */

// ─── State ────────────────────────────────────────────────────────────────────
let _loanLastResults = null;
let _loanAutoCalcDebounce = null;
let _loanExtraEnabled = false;
let _loanCurrency = 'GYD'; // 'GYD' or 'USD'
let _loanAmortView = 'monthly'; // 'monthly' or 'yearly'
let _loanIsBiweekly = false;

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
 * periodicAmount: lump sum applied at regular intervals (gratuity/bonus)
 * periodicFreq: interval in months between periodic payments
 * periodicStart: month number of first periodic payment
 */
function calculateWithExtraPayments(principal, annualRate, termMonths, extraMonthly, lumpSum, lumpSumMonth, periodicAmount, periodicFreq, periodicStart) {
    periodicAmount = periodicAmount || 0;
    periodicFreq = periodicFreq || 6;
    periodicStart = periodicStart || periodicFreq;

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

        // Apply periodic lump sum (gratuity/bonus)
        if (periodicAmount > 0 && periodicStart > 0 && periodicFreq > 0) {
            var monthsSinceStart = i - periodicStart;
            if (i === periodicStart || (monthsSinceStart > 0 && monthsSinceStart % periodicFreq === 0)) {
                extra += periodicAmount;
            }
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
 * Note: monthlyPayment is overridden in calculateLoan() to avoid lump-sum inflation.
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
        periods: schedule.length,
        totalPaid: totalPaid,
        totalInterest: totalInterest,
        monthlyPayment: schedule.length > 0 ? schedule[0].payment : 0
    };
}

/**
 * Generate bi-weekly amortization schedule.
 * 26 bi-weekly periods per year; payment = P * [r(1+r)^n] / [(1+r)^n - 1]
 */
function calculateBiweeklyAmortization(principal, annualRate, termMonths) {
    var r = annualRate / 100 / 26;
    var n = Math.round(termMonths * 26 / 12);
    var payment;
    if (r === 0) {
        payment = principal / n;
    } else {
        payment = principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }
    var balance = principal;
    var schedule = [];
    for (var i = 1; i <= n; i++) {
        var interest = balance * r;
        var principalPart = payment - interest;
        if (i === n) {
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
 * Generate comparison data for multiple lender scenarios.
 * Includes rateMin/rateMax/hasRange for banks with rate ranges.
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
            name: bank.shortName,
            rate: rate,
            monthlyPayment: payment,
            totalPaid: totalPaid,
            totalInterest: totalInterest,
            hasRange: bank.rateMin !== bank.rateMax && bank.rateMin != null && bank.rateMax != null,
            rateMin: bank.rateMin || rate,
            rateMax: bank.rateMax || rate
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

        _loanIsBiweekly = inputs.frequency === 'biweekly';

        var baseSchedule, baseSummary;
        var monthlySchedule = null; // standard monthly schedule for biweekly comparison

        if (_loanIsBiweekly) {
            baseSchedule = calculateBiweeklyAmortization(inputs.principal, inputs.rate, inputs.term);
            baseSummary = summarizeSchedule(baseSchedule, inputs.principal);
            // Approximate months from periods
            baseSummary.months = Math.round(baseSchedule.length * 12 / 26);
            monthlySchedule = calculateAmortization(inputs.principal, inputs.rate, inputs.term);
        } else {
            baseSchedule = calculateAmortization(inputs.principal, inputs.rate, inputs.term);
            baseSummary = summarizeSchedule(baseSchedule, inputs.principal);
        }

        // Fix #3: override monthlyPayment so lump sums at month 1 don't inflate the display
        baseSummary.monthlyPayment = calculateMonthlyPayment(inputs.principal, inputs.rate, inputs.term);

        var extraSchedule = null;
        var extraSummary = null;
        var monthsSaved = 0;
        var interestSaved = 0;

        if (_loanExtraEnabled && (inputs.extraMonthly > 0 || inputs.lumpSum > 0 || inputs.periodicAmount > 0)) {
            extraSchedule = calculateWithExtraPayments(
                inputs.principal, inputs.rate, inputs.term,
                inputs.extraMonthly, inputs.lumpSum, inputs.lumpSumMonth,
                inputs.periodicAmount, inputs.periodicFreq, inputs.periodicStart
            );
            extraSummary = summarizeSchedule(extraSchedule, inputs.principal);
            // Extra payment keeps same contractual monthly payment
            extraSummary.monthlyPayment = baseSummary.monthlyPayment;
            monthsSaved = (monthlySchedule ? summarizeSchedule(monthlySchedule, inputs.principal).months : baseSummary.months) - extraSummary.months;
            interestSaved = baseSummary.totalInterest - extraSummary.totalInterest;
        }

        // Processing fee
        var procFeeAmount = inputs.principal * inputs.procFeePct / 100;

        // Biweekly savings vs monthly
        var biweeklySavings = null;
        if (_loanIsBiweekly && monthlySchedule) {
            var monthlySummary = summarizeSchedule(monthlySchedule, inputs.principal);
            var bwPayoffMonths = baseSummary.months;
            var moPayoffMonths = monthlySummary.months;
            var bwPayment = baseSchedule.length > 0 ? baseSchedule[0].payment : 0;
            biweeklySavings = {
                monthsSaved: moPayoffMonths - bwPayoffMonths,
                interestSaved: monthlySummary.totalInterest - baseSummary.totalInterest,
                bwPayment: bwPayment,
                bwPayoffMonths: bwPayoffMonths
            };
        }

        _loanLastResults = {
            inputs: inputs,
            baseSchedule: baseSchedule,
            baseSummary: baseSummary,
            extraSchedule: extraSchedule,
            extraSummary: extraSummary,
            monthsSaved: monthsSaved,
            interestSaved: interestSaved,
            procFeeAmount: procFeeAmount,
            biweeklySavings: biweeklySavings,
            isBiweekly: _loanIsBiweekly
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
    var procFeePct = parseFloat(document.getElementById('loan-proc-fee-pct')?.value) || 0;
    var frequency = document.getElementById('loan-frequency')?.value || 'monthly';

    if (principal <= 0 || rate < 0 || term <= 0) return null;

    var periodicAmount = parseFloat(document.getElementById('loan-periodic-amount')?.value) || 0;
    var periodicFreqVal = document.getElementById('loan-periodic-frequency')?.value || '6';
    var periodicFreq = periodicFreqVal === 'custom'
        ? (parseInt(document.getElementById('loan-periodic-custom')?.value) || 6)
        : parseInt(periodicFreqVal);
    var periodicStart = parseInt(document.getElementById('loan-periodic-start')?.value) || periodicFreq;

    // Convert USD input to GYD if toggle is active
    if (_loanCurrency === 'USD') {
        var rate_ex = getLoanExchangeRate();
        principal = principal * rate_ex;
        extraMonthly = extraMonthly * rate_ex;
        lumpSum = lumpSum * rate_ex;
        periodicAmount = periodicAmount * rate_ex;
    }

    var startDate = startDateVal ? new Date(startDateVal) : new Date();

    return {
        principal: principal,
        rate: rate,
        term: term,
        startDate: startDate,
        extraMonthly: extraMonthly,
        lumpSum: lumpSum,
        lumpSumMonth: lumpSumMonth,
        procFeePct: procFeePct,
        frequency: frequency,
        periodicAmount: periodicAmount,
        periodicFreq: periodicFreq,
        periodicStart: periodicStart
    };
}

// ─── Display Update ───────────────────────────────────────────────────────────

function updateLoanDisplay(results) {
    var inputs = results.inputs;
    var base = results.baseSummary;
    var extra = results.extraSummary;
    var procFeeAmount = results.procFeeAmount || 0;

    // Show results area
    var resultsArea = document.getElementById('loan-results-area');
    if (resultsArea) resultsArea.style.display = '';

    // ── Summary cards ──
    // Biweekly: show biweekly payment amount; monthly: show monthly payment
    if (results.isBiweekly && results.baseSchedule && results.baseSchedule.length > 0) {
        var bwPayment = results.baseSchedule[0].payment;
        setLoanEl('loan-result-monthly', formatLoanAmount(bwPayment));
        var monthlyCardLabel = document.querySelector('#loan-result-monthly')?.closest('.result-card')?.querySelector('.result-card-label');
        if (monthlyCardLabel) monthlyCardLabel.textContent = 'Bi-weekly Payment';
    } else {
        setLoanEl('loan-result-monthly', formatLoanAmount(base.monthlyPayment));
        var monthlyCardLabel2 = document.querySelector('#loan-result-monthly')?.closest('.result-card')?.querySelector('.result-card-label');
        if (monthlyCardLabel2) monthlyCardLabel2.textContent = 'Monthly Payment';
    }

    // Total Paid = schedule total + processing fee; label as "Total Cost" if fee > 0
    var totalCost = base.totalPaid + procFeeAmount;
    setLoanEl('loan-result-total', formatLoanAmount(totalCost));
    var totalCardLabel = document.querySelector('#loan-result-total')?.closest('.result-card')?.querySelector('.result-card-label');
    if (totalCardLabel) totalCardLabel.textContent = procFeeAmount > 0 ? 'Total Cost' : 'Total Paid';

    setLoanEl('loan-result-interest', formatLoanAmount(base.totalInterest));
    setLoanEl('loan-result-rate', inputs.rate.toFixed(2) + '%');
    setLoanEl('loan-result-payoff', calculatePayoffDate(inputs.startDate, base.months));
    setLoanEl('loan-result-months', base.months + ' months (' + Math.floor(base.months / 12) + 'y ' + (base.months % 12) + 'm)');

    // ── Processing fee stat ──
    var feeStatEl = document.getElementById('loan-fee-stat');
    if (procFeeAmount > 0) {
        if (feeStatEl) feeStatEl.style.display = '';
        setLoanEl('loan-result-fee', formatLoanAmount(procFeeAmount));
    } else {
        if (feeStatEl) feeStatEl.style.display = 'none';
    }

    // ── Extra payment savings ──
    var savingsEl = document.getElementById('loan-savings-area');
    if (extra && results.monthsSaved > 0) {
        if (savingsEl) savingsEl.style.display = '';
        setLoanEl('loan-savings-months', results.monthsSaved + ' months');
        setLoanEl('loan-savings-interest', formatLoanAmount(results.interestSaved));
        setLoanEl('loan-savings-payoff', calculatePayoffDate(inputs.startDate, extra.months));
        setLoanEl('loan-savings-new-monthly', formatLoanAmount(extra.monthlyPayment));

        // Breakdown summary of what's included
        var parts = [];
        if (inputs.extraMonthly > 0) parts.push(formatLoanAmount(inputs.extraMonthly) + '/mo extra');
        if (inputs.lumpSum > 0 && inputs.lumpSumMonth > 0) parts.push('one-time ' + formatLoanAmount(inputs.lumpSum) + ' at month ' + inputs.lumpSumMonth);
        if (inputs.periodicAmount > 0) parts.push(formatLoanAmount(inputs.periodicAmount) + ' every ' + inputs.periodicFreq + ' months');
        var breakdownEl = document.getElementById('loan-savings-breakdown');
        if (breakdownEl) {
            breakdownEl.textContent = parts.length ? 'Includes: ' + parts.join(' + ') : '';
        }
    } else {
        if (savingsEl) savingsEl.style.display = 'none';
    }

    // ── Biweekly savings ──
    var bwAreaEl = document.getElementById('loan-biweekly-area');
    if (results.isBiweekly && results.biweeklySavings) {
        var bws = results.biweeklySavings;
        if (bwAreaEl) bwAreaEl.style.display = '';
        setLoanEl('loan-bw-months-saved', bws.monthsSaved > 0 ? bws.monthsSaved + ' months' : '0');
        setLoanEl('loan-bw-interest-saved', formatLoanAmount(bws.interestSaved));
        setLoanEl('loan-bw-payoff', calculatePayoffDate(inputs.startDate, bws.bwPayoffMonths));
        setLoanEl('loan-bw-payment', formatLoanAmount(bws.bwPayment));
    } else {
        if (bwAreaEl) bwAreaEl.style.display = 'none';
    }

    // ── Sticky bar ──
    var loanSticky = document.getElementById('loan-sticky-results');
    if (loanSticky) loanSticky.classList.add('visible');
    setLoanEl('loan-sticky-monthly', formatLoanAmount(results.isBiweekly && results.baseSchedule.length > 0 ? results.baseSchedule[0].payment : base.monthlyPayment));
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

    var isBiweekly = results.isBiweekly;
    var schedule = results.extraSchedule || results.baseSchedule;
    var rows = _loanAmortView === 'yearly' ? buildYearlyRows(schedule, isBiweekly) : schedule;

    var totalPayment = 0, totalPrincipal = 0, totalInterest = 0;
    var html = '';

    rows.forEach(function(row) {
        totalPayment += row.payment;
        totalPrincipal += row.principal;
        totalInterest += row.interest;

        var label;
        if (_loanAmortView === 'yearly') {
            label = 'Year ' + row.month;
        } else if (isBiweekly) {
            label = 'Period ' + row.month;
        } else {
            label = 'Month ' + row.month;
        }
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

function buildYearlyRows(schedule, isBiweekly) {
    var periodsPerYear = isBiweekly ? 26 : 12;
    var years = {};
    schedule.forEach(function(row) {
        var year = Math.ceil(row.month / periodsPerYear);
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

        var rateDisplay = item.hasRange
            ? item.rateMin.toFixed(2) + '%\u2013' + item.rateMax.toFixed(2) + '% p.a.'
            : item.rate.toFixed(2) + '% p.a.';

        var worstRow = '';
        if (item.hasRange) {
            var worstPayment = calculateMonthlyPayment(principal, item.rateMax, termMonths);
            var worstTotal = worstPayment * termMonths;
            var worstInterest = worstTotal - principal;
            worstRow = '<div class="comparison-row"><small class="text-muted">At ' + item.rateMax.toFixed(2) + '%: ' +
                formatLoanAmount(worstPayment) + '/mo, ' + formatLoanAmount(worstInterest) + ' interest</small></div>';
        }

        html += '<div class="comparison-card">' +
            '<div class="comparison-card-header">' +
            '<strong>' + item.name + bestBadge + '</strong>' +
            '<span class="text-muted">' + rateDisplay + '</span>' +
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
            worstRow +
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
    var purchaseRow = document.getElementById('loan-purchase-row');

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

    // Show purchase/down-payment row only for auto and mortgage
    if (purchaseRow) {
        if (loanType === 'auto' || loanType === 'mortgage') {
            purchaseRow.style.display = '';
        } else {
            purchaseRow.style.display = 'none';
            var ppEl = document.getElementById('loan-purchase-price');
            var caEl = document.getElementById('loan-computed-amount');
            if (ppEl) ppEl.value = '';
            if (caEl) caEl.value = '';
        }
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

// ─── Down Payment Calculator ──────────────────────────────────────────────────

function setupDownPaymentCalc() {
    var priceEl = document.getElementById('loan-purchase-price');
    var pctEl = document.getElementById('loan-down-payment-pct');
    var computedEl = document.getElementById('loan-computed-amount');
    var principalEl = document.getElementById('loan-principal');

    if (!priceEl || !pctEl) return;

    function recalcDownPayment() {
        var price = parseFloat(priceEl.value) || 0;
        var pct = parseFloat(pctEl.value) || 0;
        if (price <= 0) {
            if (computedEl) computedEl.value = '';
            return;
        }
        var loanAmount = price * (1 - pct / 100);
        var rounded = Math.round(loanAmount / 1000) * 1000;
        if (computedEl) computedEl.value = rounded.toLocaleString('en-US');
        if (principalEl) principalEl.value = rounded;
        clearTimeout(_loanAutoCalcDebounce);
        _loanAutoCalcDebounce = setTimeout(calculateLoan, 300);
    }

    priceEl.addEventListener('input', recalcDownPayment);
    pctEl.addEventListener('input', recalcDownPayment);
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

    // Periodic lump sum frequency custom-col toggle
    var periodicFreqSel = document.getElementById('loan-periodic-frequency');
    var periodicCustomCol = document.getElementById('loan-periodic-custom-col');
    if (periodicFreqSel && periodicCustomCol) {
        periodicFreqSel.addEventListener('change', function() {
            periodicCustomCol.style.display = this.value === 'custom' ? '' : 'none';
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

    setupDownPaymentCalc();
    setupLoanAutoCalc();

    // Trigger initial calculation so results show immediately on first open
    calculateLoan();

    if (typeof console !== 'undefined') {
        console.log('[LoanCalc] Initialized');
    }
}
