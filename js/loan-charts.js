/**
 * Loan Charts — 4 Chart.js visualizations for the loan calculator
 * Follows patterns from js/charts.js
 */

// Chart instances
var loanSplitChart = null;
var loanBalanceChart = null;
var loanBreakdownChart = null;
var loanComparisonChart = null;

function destroyLoanChart(chart) {
    if (chart) {
        try { chart.destroy(); } catch (e) {}
    }
    return null;
}

// ─── Create All Loan Charts ───────────────────────────────────────────────────

function createLoanCharts(results) {
    createLoanSplitChart(results);
    createLoanBalanceChart(results);
    createLoanBreakdownChart(results);
    createLoanComparisonChart(results);
}

// ─── Chart 1: Payment Split Doughnut ─────────────────────────────────────────

function createLoanSplitChart(results) {
    var ctx = document.getElementById('loan-split-chart');
    if (!ctx) return;

    var base = results.baseSummary;
    var principal = results.inputs.principal;
    var totalInterest = base.totalInterest;

    // Use existing getChartColors if available
    var colors = typeof getChartColors === 'function' ? getChartColors() : {
        blue: '#3b82f6', red: '#ef4444', green: '#10b981',
        text: '#1f2937', grid: '#e5e7eb', bgCard: '#ffffff'
    };

    loanSplitChart = destroyLoanChart(loanSplitChart);
    loanSplitChart = new Chart(ctx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['Principal', 'Total Interest'],
            datasets: [{
                data: [Math.round(principal), Math.round(totalInterest)],
                backgroundColor: [colors.blue, colors.red],
                borderWidth: 2,
                borderColor: colors.bgCard,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            cutout: '60%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 12,
                        color: colors.text,
                        font: { size: 11 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            var total = context.dataset.data.reduce(function(a, b) { return a + b; }, 0);
                            var pct = ((context.parsed / total) * 100).toFixed(1);
                            return context.label + ': ' + formatLoanAmount(context.parsed) + ' (' + pct + '%)';
                        }
                    }
                }
            }
        }
    });
}

// ─── Chart 2: Balance Over Time Line ─────────────────────────────────────────

function createLoanBalanceChart(results) {
    var ctx = document.getElementById('loan-balance-chart');
    if (!ctx) return;

    var colors = typeof getChartColors === 'function' ? getChartColors() : {
        blue: '#3b82f6', green: '#10b981', text: '#1f2937', grid: '#e5e7eb'
    };

    var baseSchedule = results.baseSchedule;
    var extraSchedule = results.extraSchedule;

    // For long loans, sample every N months for readability
    var step = baseSchedule.length > 120 ? Math.ceil(baseSchedule.length / 60) : 1;

    function sampleSchedule(schedule) {
        var labels = [];
        var balances = [];
        for (var i = 0; i < schedule.length; i += step) {
            labels.push('M' + schedule[i].month);
            balances.push(Math.round(schedule[i].balance));
        }
        // Always include last point
        var last = schedule[schedule.length - 1];
        if (labels[labels.length - 1] !== 'M' + last.month) {
            labels.push('M' + last.month);
            balances.push(Math.round(last.balance));
        }
        return { labels: labels, balances: balances };
    }

    var baseSampled = sampleSchedule(baseSchedule);
    var datasets = [{
        label: 'Balance (Original)',
        data: baseSampled.balances,
        borderColor: colors.blue,
        backgroundColor: colors.blue + '22',
        fill: true,
        tension: 0.3,
        pointRadius: baseSchedule.length > 60 ? 0 : 3
    }];

    if (extraSchedule) {
        // Extra schedule may be shorter, pad with zeros
        var extraSampled = sampleSchedule(extraSchedule);
        var paddedBalances = [];
        for (var i = 0; i < baseSampled.labels.length; i++) {
            paddedBalances.push(extraSampled.balances[i] !== undefined ? extraSampled.balances[i] : 0);
        }
        datasets.push({
            label: 'Balance (With Extra Payments)',
            data: paddedBalances,
            borderColor: colors.green,
            backgroundColor: colors.green + '22',
            fill: true,
            tension: 0.3,
            borderDash: [5, 3],
            pointRadius: 0
        });
    }

    loanBalanceChart = destroyLoanChart(loanBalanceChart);
    loanBalanceChart = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: baseSampled.labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: colors.text, font: { size: 11 }, usePointStyle: true }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + formatLoanAmount(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: colors.text,
                        maxTicksLimit: 12,
                        font: { size: 10 }
                    },
                    grid: { color: colors.grid }
                },
                y: {
                    ticks: {
                        color: colors.text,
                        font: { size: 10 },
                        callback: function(value) {
                            return formatLoanAmount(value);
                        }
                    },
                    grid: { color: colors.grid }
                }
            }
        }
    });
}

// ─── Chart 3: Monthly Breakdown Stacked Bar ───────────────────────────────────

function createLoanBreakdownChart(results) {
    var ctx = document.getElementById('loan-breakdown-chart');
    if (!ctx) return;

    var colors = typeof getChartColors === 'function' ? getChartColors() : {
        blue: '#3b82f6', red: '#ef4444', text: '#1f2937', grid: '#e5e7eb'
    };

    var schedule = results.extraSchedule || results.baseSchedule;

    // For long loans, use yearly aggregation
    var useYearly = schedule.length > 36;
    var rows = useYearly ? buildLoanYearlyRows(schedule) : schedule;
    var labelPrefix = useYearly ? 'Y' : 'M';

    var labels = rows.map(function(r) { return labelPrefix + r.month; });
    var principals = rows.map(function(r) { return Math.round(r.principal); });
    var interests = rows.map(function(r) { return Math.round(r.interest); });

    loanBreakdownChart = destroyLoanChart(loanBreakdownChart);
    loanBreakdownChart = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Principal',
                    data: principals,
                    backgroundColor: colors.blue + 'cc',
                    stack: 'stack'
                },
                {
                    label: 'Interest',
                    data: interests,
                    backgroundColor: colors.red + 'cc',
                    stack: 'stack'
                }
            ]
        },
        options: {
            responsive: true,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: colors.text, font: { size: 11 }, usePointStyle: true }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + formatLoanAmount(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        color: colors.text,
                        font: { size: 10 },
                        maxTicksLimit: useYearly ? 30 : 24
                    },
                    grid: { color: colors.grid }
                },
                y: {
                    stacked: true,
                    ticks: {
                        color: colors.text,
                        font: { size: 10 },
                        callback: function(value) {
                            return formatLoanAmount(value);
                        }
                    },
                    grid: { color: colors.grid }
                }
            }
        }
    });
}

function buildLoanYearlyRows(schedule) {
    var years = {};
    schedule.forEach(function(row) {
        var year = Math.ceil(row.month / 12);
        if (!years[year]) {
            years[year] = { month: year, payment: 0, principal: 0, interest: 0, balance: 0 };
        }
        years[year].payment += row.payment;
        years[year].principal += row.principal;
        years[year].interest += row.interest;
        years[year].balance = row.balance;
    });
    return Object.values(years);
}

// ─── Chart 4: Bank Comparison Horizontal Bar ─────────────────────────────────

function createLoanComparisonChart(results) {
    var ctx = document.getElementById('loan-comparison-chart');
    if (!ctx) return;

    var colors = typeof getChartColors === 'function' ? getChartColors() : {
        blue: '#3b82f6', green: '#10b981', orange: '#f97316', red: '#ef4444',
        text: '#1f2937', grid: '#e5e7eb'
    };

    var principal = results.inputs.principal;
    var termMonths = results.inputs.term;
    var compData = typeof generateComparisonData === 'function'
        ? generateComparisonData(principal, termMonths, LOAN_COMPARISON_BANKS)
        : [];

    if (!compData.length) return;
    compData.sort(function(a, b) { return a.totalInterest - b.totalInterest; });

    var barColors = [colors.green, colors.blue, colors.orange, colors.red];

    loanComparisonChart = destroyLoanChart(loanComparisonChart);
    loanComparisonChart = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: compData.map(function(d) { return d.name; }),
            datasets: [{
                label: 'Total Interest Paid',
                data: compData.map(function(d) { return Math.round(d.totalInterest); }),
                backgroundColor: barColors.slice(0, compData.length),
                borderRadius: 4
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Interest: ' + formatLoanAmount(context.parsed.x) +
                                   ' | Rate: ' + compData[context.dataIndex].rate.toFixed(2) + '%';
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: colors.text,
                        font: { size: 10 },
                        callback: function(value) {
                            return formatLoanAmount(value);
                        }
                    },
                    grid: { color: colors.grid }
                },
                y: {
                    ticks: { color: colors.text, font: { size: 11 } },
                    grid: { color: colors.grid }
                }
            }
        }
    });
}

// ─── Theme Change Hook ────────────────────────────────────────────────────────

// Re-render charts when theme changes (called by existing theme toggle)
function refreshLoanCharts() {
    if (typeof _loanLastResults !== 'undefined' && _loanLastResults) {
        createLoanCharts(_loanLastResults);
    }
}
