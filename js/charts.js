/**
 * Chart generation functions — Enhanced with 11 visualizations
 * Uses Chart.js 3.9.1 + chartjs-plugin-datalabels
 */

// Register datalabels plugin globally (guard against CDN failure)
if (typeof ChartDataLabels !== 'undefined') {
    Chart.register(ChartDataLabels);
    // Disable datalabels by default — each chart must opt-in explicitly
    Chart.defaults.set('plugins.datalabels', { display: false });
}

// Chart instances
let incomeChart = null;
let taxChart = null;
let cashFlowChart = null;
let taxSavingsChart = null;
let netVsGrossChart = null;
let salaryCompositionChart = null;
let taxGaugeChart = null;
let deductionsChart = null;
let cumulativeChart = null;
let waterfallChart = null;
let annualOverviewChart = null;

// ─── Helpers ───────────────────────────────────────────────

function getChartColors() {
    const isDark = isDarkMode();
    return {
        blue:    isDark ? '#60a5fa' : '#3b82f6',
        red:     isDark ? '#f87171' : '#ef4444',
        green:   isDark ? '#34d399' : '#10b981',
        yellow:  isDark ? '#fbbf24' : '#f59e0b',
        purple:  isDark ? '#a78bfa' : '#8b5cf6',
        pink:    isDark ? '#f472b6' : '#ec4899',
        cyan:    isDark ? '#22d3ee' : '#06b6d4',
        orange:  isDark ? '#fb923c' : '#f97316',
        text:    isDark ? '#f9fafb' : '#1f2937',
        grid:    isDark ? '#374151' : '#e5e7eb',
        bgCard:  isDark ? '#1f2937' : '#ffffff'
    };
}

function getColorArray() {
    const c = getChartColors();
    return [c.blue, c.red, c.green, c.yellow, c.purple, c.pink, c.cyan, c.orange];
}

/** Filter out zero-value entries from parallel arrays */
function filterZeroValues(labels, data, colors) {
    const filteredLabels = [];
    const filteredData = [];
    const filteredColors = [];
    for (let i = 0; i < data.length; i++) {
        if (data[i] > 0) {
            filteredLabels.push(labels[i]);
            filteredData.push(data[i]);
            filteredColors.push(colors[i % colors.length]);
        }
    }
    return { labels: filteredLabels, data: filteredData, colors: filteredColors };
}

/** Compact currency for axis labels: $260K, $1.2M */
function compactCurrency(value) {
    if (value >= 1000000) return '$' + (value / 1000000).toFixed(1) + 'M';
    if (value >= 1000) return '$' + (value / 1000).toFixed(0) + 'K';
    return '$' + value;
}

/** Center text plugin for doughnut charts */
const centerTextPlugin = {
    id: 'centerText',
    afterDraw: function(chart) {
        // Defensive access — chart.options.plugins may not have centerText
        var pluginOpts = chart.options && chart.options.plugins;
        var centerOpts = pluginOpts && pluginOpts.centerText;
        if (!centerOpts || !centerOpts.text) return;

        var text = centerOpts.text;
        var subtext = centerOpts.subtext;
        var chartCtx = chart.ctx;
        var chartArea = chart.chartArea;
        var centerX = (chartArea.left + chartArea.right) / 2;
        var centerY = (chartArea.top + chartArea.bottom) / 2;
        var c = getChartColors();

        chartCtx.save();
        chartCtx.textAlign = 'center';
        chartCtx.textBaseline = 'middle';

        // Main text
        chartCtx.font = 'bold 14px -apple-system, BlinkMacSystemFont, sans-serif';
        chartCtx.fillStyle = c.text;
        chartCtx.fillText(text, centerX, subtext ? centerY - 8 : centerY);

        // Subtext
        if (subtext) {
            chartCtx.font = '11px -apple-system, BlinkMacSystemFont, sans-serif';
            chartCtx.fillStyle = isDarkMode() ? '#9ca3af' : '#6b7280';
            chartCtx.fillText(subtext, centerX, centerY + 10);
        }
        chartCtx.restore();
    }
};
Chart.register(centerTextPlugin);

/** Common datalabels config for doughnuts — show percentages */
function doughnutDatalabels() {
    return {
        display: true,
        color: '#fff',
        font: { weight: 'bold', size: 11 },
        formatter: function(value, ctx) {
            const total = ctx.dataset.data.reduce(function(a, b) { return a + b; }, 0);
            if (total === 0) return '';
            const pct = Math.round((value / total) * 100);
            return pct >= 5 ? pct + '%' : '';
        }
    };
}

/** Common base options */
function baseOptions(extraPlugins) {
    return Object.assign({
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 600, easing: 'easeOutQuart' }
    }, extraPlugins || {});
}

/** Safely destroy and recreate */
function destroyChart(chartRef) {
    if (chartRef) chartRef.destroy();
    return null;
}

// ─── 1. Income Breakdown (Doughnut) ───────────────────────

function createIncomeChart(basicSalary, taxableAllowances, nonTaxableAllowances, gratuity) {
    var ctx = document.getElementById('income-chart');
    if (!ctx) return;
    ctx = ctx.getContext('2d');
    incomeChart = destroyChart(incomeChart);

    var colors = getColorArray();
    var allLabels = ['Basic Salary', 'Taxable Allowances', 'Non-Taxable Allowances', 'Gratuity'];
    var allData = [basicSalary, taxableAllowances, nonTaxableAllowances, gratuity];
    var filtered = filterZeroValues(allLabels, allData, colors);
    var total = filtered.data.reduce(function(a, b) { return a + b; }, 0);

    incomeChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: filtered.labels,
            datasets: [{
                data: filtered.data,
                backgroundColor: filtered.colors,
                borderWidth: 2,
                borderColor: getChartColors().bgCard,
                hoverOffset: 8
            }]
        },
        options: Object.assign(baseOptions(), {
            cutout: '55%',
            plugins: {
                centerText: { text: formatCurrency(total), subtext: 'Total Gross' },
                legend: { position: 'bottom', labels: { usePointStyle: true, padding: 12, font: { size: 11 } } },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            var pct = Math.round((context.raw / total) * 100);
                            return context.label + ': ' + formatCurrency(context.raw) + ' (' + pct + '%)';
                        }
                    }
                },
                datalabels: doughnutDatalabels()
            }
        })
    });
}

// ─── 2. Tax Bracket Analysis (Stacked Bar) ────────────────

function createTaxChart(taxableIncome, incomeTax) {
    var ctx = document.getElementById('tax-chart');
    if (!ctx) return;
    ctx = ctx.getContext('2d');
    taxChart = destroyChart(taxChart);

    var c = getChartColors();
    var taxAt25 = Math.min(taxableIncome, TAX_THRESHOLD) * TAX_RATE_1;
    var taxAt35 = taxableIncome > TAX_THRESHOLD ? (taxableIncome - TAX_THRESHOLD) * TAX_RATE_2 : 0;
    var incomeIn25 = Math.min(taxableIncome, TAX_THRESHOLD);
    var incomeIn35 = taxableIncome > TAX_THRESHOLD ? taxableIncome - TAX_THRESHOLD : 0;

    taxChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Taxable Income', 'Income Tax'],
            datasets: [
                {
                    label: '25% Bracket (up to $260K)',
                    data: [incomeIn25, taxAt25],
                    backgroundColor: c.blue,
                    borderRadius: 4
                },
                {
                    label: '35% Bracket (above $260K)',
                    data: [incomeIn35, taxAt35],
                    backgroundColor: c.red,
                    borderRadius: 4
                }
            ]
        },
        options: Object.assign(baseOptions(), {
            scales: {
                x: { stacked: true, grid: { display: false } },
                y: {
                    stacked: true,
                    ticks: { callback: compactCurrency }
                }
            },
            plugins: {
                legend: { position: 'bottom', labels: { usePointStyle: true, padding: 12, font: { size: 11 } } },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + formatCurrency(context.raw);
                        }
                    }
                },
                datalabels: {
                    display: true,
                    color: '#fff',
                    font: { weight: 'bold', size: 10 },
                    formatter: function(value) {
                        return value > 0 ? compactCurrency(value) : '';
                    }
                }
            }
        })
    });
}

// ─── 3. Annual Cash Flow (Line with gradient fill) ────────

function createCashFlowChart(monthlyNetSalary, sixMonthGratuity, vacationAllowance) {
    var canvas = document.getElementById('cash-flow-chart');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    cashFlowChart = destroyChart(cashFlowChart);

    var c = getChartColors();
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var monthlyData = Array(12).fill(monthlyNetSalary);
    monthlyData[5] += sixMonthGratuity;
    monthlyData[11] += sixMonthGratuity + vacationAllowance;

    // Base salary line for reference
    var baseData = Array(12).fill(monthlyNetSalary);

    // Average line
    var avg = monthlyData.reduce(function(a, b) { return a + b; }, 0) / 12;
    var avgData = Array(12).fill(avg);

    // Gradient fill
    var gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, isDarkMode() ? 'rgba(96,165,250,0.3)' : 'rgba(59,130,246,0.25)');
    gradient.addColorStop(1, isDarkMode() ? 'rgba(96,165,250,0.02)' : 'rgba(59,130,246,0.02)');

    // Point styles: highlight gratuity months
    var pointStyles = months.map(function(_, i) { return (i === 5 || i === 11) ? 'triangle' : 'circle'; });
    var pointRadii = months.map(function(_, i) { return (i === 5 || i === 11) ? 8 : 4; });
    var pointColors = months.map(function(_, i) { return (i === 5 || i === 11) ? c.yellow : c.blue; });

    cashFlowChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Monthly Take-Home',
                    data: monthlyData,
                    borderColor: c.blue,
                    backgroundColor: gradient,
                    pointBackgroundColor: pointColors,
                    pointStyle: pointStyles,
                    pointRadius: pointRadii,
                    pointHoverRadius: 10,
                    fill: true,
                    tension: 0.2,
                    borderWidth: 2.5
                },
                {
                    label: 'Base Salary',
                    data: baseData,
                    borderColor: isDarkMode() ? 'rgba(156,163,175,0.4)' : 'rgba(107,114,128,0.3)',
                    borderDash: [4, 4],
                    pointRadius: 0,
                    fill: false,
                    borderWidth: 1.5
                },
                {
                    label: 'Monthly Average',
                    data: avgData,
                    borderColor: c.green,
                    borderDash: [8, 4],
                    pointRadius: 0,
                    fill: false,
                    borderWidth: 1.5
                }
            ]
        },
        options: Object.assign(baseOptions(), {
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: { callback: compactCurrency },
                    title: { display: true, text: 'Monthly Income (GYD)', font: { size: 11 } }
                },
                x: { grid: { display: false } }
            },
            plugins: {
                legend: { position: 'bottom', labels: { usePointStyle: true, padding: 12, font: { size: 11 } } },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (context.datasetIndex !== 0) return context.dataset.label + ': ' + formatCurrency(context.raw);
                            var label = 'Take-Home: ' + formatCurrency(context.raw);
                            if (context.dataIndex === 5) {
                                label += ' (incl. ' + formatCurrency(sixMonthGratuity) + ' gratuity)';
                            } else if (context.dataIndex === 11) {
                                label += ' (incl. ' + formatCurrency(sixMonthGratuity) + ' gratuity';
                                if (vacationAllowance > 0) label += ' + ' + formatCurrency(vacationAllowance) + ' vacation';
                                label += ')';
                            }
                            return label;
                        }
                    }
                },
                datalabels: { display: false }
            }
        })
    });
}

// ─── 4. Tax Savings Breakdown (Doughnut) ──────────────────

function createTaxSavingsChart(results) {
    var ctx = document.getElementById('tax-savings-chart');
    if (!ctx) return;
    ctx = ctx.getContext('2d');
    taxSavingsChart = destroyChart(taxSavingsChart);

    var c = getChartColors();
    var grossTaxableIncome = results.basicSalary + results.taxableAllowances;
    var rate = grossTaxableIncome > TAX_THRESHOLD ? TAX_RATE_2 : TAX_RATE_1;

    var personalSaving = results.personalAllowance * rate;
    var childSaving = results.childAllowance * rate;
    var insuranceSaving = (results.actualInsuranceDeduction || results.insurancePremium || 0) * rate;
    var nisSaving = results.nisContribution * rate;
    var actualTax = results.incomeTax;

    var allLabels = ['Tax Threshold Savings', 'Child Allowance', 'Insurance Savings', 'NIS Savings', 'Tax Paid'];
    var allData = [personalSaving, childSaving, insuranceSaving, nisSaving, actualTax];
    var allColors = [c.blue, c.green, c.yellow, c.purple, c.red];
    var filtered = filterZeroValues(allLabels, allData, allColors);
    var totalSavings = personalSaving + childSaving + insuranceSaving + nisSaving;

    taxSavingsChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: filtered.labels,
            datasets: [{
                data: filtered.data,
                backgroundColor: filtered.colors,
                borderWidth: 2,
                borderColor: c.bgCard,
                hoverOffset: 8
            }]
        },
        options: Object.assign(baseOptions(), {
            cutout: '55%',
            plugins: {
                centerText: { text: formatCurrency(totalSavings), subtext: 'Total Savings' },
                legend: { position: 'bottom', labels: { usePointStyle: true, padding: 12, font: { size: 11 } } },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            var total = context.dataset.data.reduce(function(a, b) { return a + b; }, 0);
                            var pct = Math.round((context.raw / total) * 100);
                            return context.label + ': ' + formatCurrency(context.raw) + ' (' + pct + '%)';
                        }
                    }
                },
                datalabels: doughnutDatalabels()
            }
        })
    });
}

// ─── 5. Net vs. Gross (Grouped Bar with retention line) ───

function createNetVsGrossChart(results) {
    var ctx = document.getElementById('net-vs-gross-chart');
    if (!ctx) return;
    ctx = ctx.getContext('2d');
    netVsGrossChart = destroyChart(netVsGrossChart);

    var c = getChartColors();
    var regularGross = results.regularMonthlyGrossIncome;
    var regularNet = results.monthlyNetSalary;
    var month6Gross = regularGross + results.sixMonthGratuity;
    var month6Net = results.monthSixTotal;
    var month12Gross = regularGross + results.sixMonthGratuity + results.vacationAllowance;
    var month12Net = results.monthTwelveTotal;
    var annualGross = results.annualGrossIncome + (results.sixMonthGratuity * 2) + results.vacationAllowance;
    var annualNet = results.annualTotal;

    // Retention rates
    var retentions = [
        regularGross > 0 ? Math.round((regularNet / regularGross) * 100) : 0,
        month6Gross > 0 ? Math.round((month6Net / month6Gross) * 100) : 0,
        month12Gross > 0 ? Math.round((month12Net / month12Gross) * 100) : 0,
        annualGross > 0 ? Math.round((annualNet / annualGross) * 100) : 0
    ];

    netVsGrossChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Regular', 'Month 6', 'Month 12', 'Annual'],
            datasets: [
                {
                    label: 'Gross Income',
                    data: [regularGross, month6Gross, month12Gross, annualGross],
                    backgroundColor: c.blue,
                    borderRadius: 4,
                    barPercentage: 0.7
                },
                {
                    label: 'Net Income',
                    data: [regularNet, month6Net, month12Net, annualNet],
                    backgroundColor: c.green,
                    borderRadius: 4,
                    barPercentage: 0.7
                }
            ]
        },
        options: Object.assign(baseOptions(), {
            layout: { padding: { top: 20 } },
            scales: {
                x: { grid: { display: false } },
                y: {
                    beginAtZero: true,
                    ticks: { callback: compactCurrency },
                    title: { display: true, text: 'Amount (GYD)', font: { size: 11 } }
                }
            },
            plugins: {
                legend: { position: 'bottom', labels: { usePointStyle: true, padding: 12, font: { size: 11 } } },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + formatCurrency(context.raw);
                        },
                        afterBody: function(tooltipItems) {
                            var idx = tooltipItems[0].dataIndex;
                            return 'Retention: ' + retentions[idx] + '%';
                        }
                    }
                },
                datalabels: {
                    display: true,
                    anchor: 'end',
                    align: 'top',
                    color: function(context) { return getChartColors().text; },
                    font: { weight: 'bold', size: 9 },
                    formatter: function(value) { return value > 0 ? compactCurrency(value) : ''; }
                }
            }
        })
    });
}

// ─── 6. Salary Composition (Horizontal Stacked Bar) ───────

function createSalaryCompositionChart(results) {
    var ctx = document.getElementById('salary-composition-chart');
    if (!ctx) return;
    ctx = ctx.getContext('2d');
    salaryCompositionChart = destroyChart(salaryCompositionChart);

    var c = getChartColors();
    var items = [
        { label: 'Basic Salary', value: results.basicSalary, color: c.blue },
        { label: 'Taxable Allowances', value: results.taxableAllowances, color: c.red },
        { label: 'Non-Taxable Allowances', value: results.nonTaxableAllowances, color: c.green },
        { label: 'Overtime', value: results.overtimeIncome || 0, color: c.yellow },
        { label: 'Second Job', value: results.secondJobIncome || 0, color: c.purple },
        { label: 'Qualification', value: results.qualificationAllowance || 0, color: c.cyan }
    ].filter(function(item) { return item.value > 0; });

    var datasets = items.map(function(item) {
        return {
            label: item.label,
            data: [item.value],
            backgroundColor: item.color,
            borderRadius: 4
        };
    });

    salaryCompositionChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Gross Income'],
            datasets: datasets
        },
        options: Object.assign(baseOptions(), {
            indexAxis: 'y',
            scales: {
                x: {
                    stacked: true,
                    ticks: { callback: compactCurrency },
                    grid: { display: false }
                },
                y: {
                    stacked: true,
                    display: false
                }
            },
            plugins: {
                legend: { position: 'bottom', labels: { usePointStyle: true, padding: 10, font: { size: 11 } } },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            var total = context.chart.data.datasets.reduce(function(sum, ds) {
                                return sum + (ds.data[0] || 0);
                            }, 0);
                            var pct = total > 0 ? Math.round((context.raw / total) * 100) : 0;
                            return context.dataset.label + ': ' + formatCurrency(context.raw) + ' (' + pct + '%)';
                        }
                    }
                },
                datalabels: {
                    display: true,
                    color: '#fff',
                    font: { weight: 'bold', size: 10 },
                    formatter: function(value, ctx) {
                        var total = ctx.chart.data.datasets.reduce(function(sum, ds) {
                            return sum + (ds.data[0] || 0);
                        }, 0);
                        var pct = total > 0 ? Math.round((value / total) * 100) : 0;
                        return pct >= 8 ? compactCurrency(value) : '';
                    }
                }
            }
        })
    });
}

// ─── 7. Effective Tax Rate Gauge (Half-Doughnut) ──────────

function createTaxGaugeChart(results) {
    var ctx = document.getElementById('tax-gauge-chart');
    if (!ctx) return;
    ctx = ctx.getContext('2d');
    taxGaugeChart = destroyChart(taxGaugeChart);

    var c = getChartColors();
    var grossIncome = results.regularMonthlyGrossIncome || results.monthlyGrossIncome || 1;
    var effectiveRate = Math.min(((results.incomeTax / grossIncome) * 100), 100);
    var remaining = 100 - effectiveRate;

    // Color based on rate
    var rateColor;
    if (effectiveRate <= 10) rateColor = c.green;
    else if (effectiveRate <= 20) rateColor = c.yellow;
    else if (effectiveRate <= 30) rateColor = c.orange;
    else rateColor = c.red;

    var bgColor = isDarkMode() ? '#374151' : '#e5e7eb';

    taxGaugeChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Effective Tax', 'Remaining'],
            datasets: [{
                data: [effectiveRate, remaining],
                backgroundColor: [rateColor, bgColor],
                borderWidth: 0,
                hoverOffset: 0
            }]
        },
        options: Object.assign(baseOptions(), {
            rotation: -90,
            circumference: 180,
            cutout: '70%',
            plugins: {
                centerText: {
                    text: effectiveRate.toFixed(1) + '%',
                    subtext: 'Effective Tax Rate'
                },
                legend: { display: false },
                tooltip: {
                    filter: function(item) { return item.dataIndex === 0; },
                    callbacks: {
                        label: function(context) {
                            return 'Tax Rate: ' + context.raw.toFixed(1) + '%';
                        }
                    }
                },
                datalabels: { display: false }
            }
        })
    });
}

// ─── 8. Monthly Deductions Breakdown (Doughnut) ───────────

function createDeductionsChart(results) {
    var ctx = document.getElementById('deductions-chart');
    if (!ctx) return;
    ctx = ctx.getContext('2d');
    deductionsChart = destroyChart(deductionsChart);

    var c = getChartColors();
    var allLabels = ['NIS Contribution', 'Income Tax', 'Loan Payment', 'Credit Union', 'Insurance'];
    var allData = [
        results.nisContribution,
        results.incomeTax,
        results.loanPayment || 0,
        results.creditUnionDeduction || 0,
        results.actualInsuranceDeduction || results.insurancePremium || 0
    ];
    var allColors = [c.purple, c.red, c.orange, c.cyan, c.yellow];
    var filtered = filterZeroValues(allLabels, allData, allColors);
    var total = filtered.data.reduce(function(a, b) { return a + b; }, 0);

    deductionsChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: filtered.labels,
            datasets: [{
                data: filtered.data,
                backgroundColor: filtered.colors,
                borderWidth: 2,
                borderColor: c.bgCard,
                hoverOffset: 8
            }]
        },
        options: Object.assign(baseOptions(), {
            cutout: '55%',
            plugins: {
                centerText: { text: formatCurrency(total), subtext: 'Total Deductions' },
                legend: { position: 'bottom', labels: { usePointStyle: true, padding: 12, font: { size: 11 } } },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            var pct = total > 0 ? Math.round((context.raw / total) * 100) : 0;
                            return context.label + ': ' + formatCurrency(context.raw) + ' (' + pct + '%)';
                        }
                    }
                },
                datalabels: doughnutDatalabels()
            }
        })
    });
}

// ─── 9. Cumulative Annual Earnings (Stacked Area) ─────────

function createCumulativeChart(results) {
    var ctx = document.getElementById('cumulative-chart');
    if (!ctx) return;
    ctx = ctx.getContext('2d');
    cumulativeChart = destroyChart(cumulativeChart);

    var c = getChartColors();
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Build cumulative data
    var cumulativeSalary = [];
    var cumulativeGratuity = [];
    var cumulativeVacation = [];
    var salarySum = 0, gratuitySum = 0, vacationSum = 0;

    for (var i = 0; i < 12; i++) {
        salarySum += results.monthlyNetSalary;
        if (i === 5 || i === 11) gratuitySum += results.sixMonthGratuity;
        if (i === 11) vacationSum += (results.vacationAllowance || 0);
        cumulativeSalary.push(salarySum);
        cumulativeGratuity.push(gratuitySum);
        cumulativeVacation.push(vacationSum);
    }

    // Stacked totals for tooltip
    var cumulativeTotal = months.map(function(_, i) {
        return cumulativeSalary[i] + cumulativeGratuity[i] + cumulativeVacation[i];
    });

    cumulativeChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Net Salary',
                    data: cumulativeSalary,
                    backgroundColor: isDarkMode() ? 'rgba(96,165,250,0.35)' : 'rgba(59,130,246,0.25)',
                    borderColor: c.blue,
                    fill: true,
                    tension: 0.3,
                    pointRadius: 3,
                    pointHoverRadius: 6,
                    borderWidth: 2
                },
                {
                    label: 'Gratuity',
                    data: cumulativeGratuity,
                    backgroundColor: isDarkMode() ? 'rgba(52,211,153,0.35)' : 'rgba(16,185,129,0.25)',
                    borderColor: c.green,
                    fill: true,
                    tension: 0.3,
                    pointRadius: 3,
                    pointHoverRadius: 6,
                    borderWidth: 2
                },
                {
                    label: 'Vacation',
                    data: cumulativeVacation,
                    backgroundColor: isDarkMode() ? 'rgba(251,191,36,0.35)' : 'rgba(245,158,11,0.25)',
                    borderColor: c.yellow,
                    fill: true,
                    tension: 0.3,
                    pointRadius: 3,
                    pointHoverRadius: 6,
                    borderWidth: 2
                }
            ]
        },
        options: Object.assign(baseOptions(), {
            scales: {
                y: {
                    stacked: true,
                    ticks: { callback: compactCurrency },
                    title: { display: true, text: 'Cumulative Earnings (GYD)', font: { size: 11 } }
                },
                x: { grid: { display: false } }
            },
            plugins: {
                legend: { position: 'bottom', labels: { usePointStyle: true, padding: 12, font: { size: 11 } } },
                tooltip: {
                    callbacks: {
                        afterBody: function(tooltipItems) {
                            var idx = tooltipItems[0].dataIndex;
                            return 'Running Total: ' + formatCurrency(cumulativeTotal[idx]);
                        }
                    }
                },
                datalabels: { display: false }
            }
        })
    });
}

// ─── 10. Gross-to-Net Waterfall (Horizontal Bar) ──────────

function createWaterfallChart(results) {
    var ctx = document.getElementById('waterfall-chart');
    if (!ctx) return;
    ctx = ctx.getContext('2d');
    waterfallChart = destroyChart(waterfallChart);

    var c = getChartColors();
    var grossIncome = results.regularMonthlyGrossIncome || results.monthlyGrossIncome;
    var nis = results.nisContribution;
    var tax = results.incomeTax;
    var loan = results.loanPayment || 0;
    var creditUnion = results.creditUnionDeduction || 0;
    var netIncome = results.netSalaryForFrequency || results.monthlyNetSalary;

    // Build waterfall segments
    // Each bar: [start, end] — we use floating bars
    var items = [
        { label: 'Gross Income', value: grossIncome, type: 'positive' }
    ];

    var running = grossIncome;

    if (nis > 0) {
        items.push({ label: 'NIS (-' + compactCurrency(nis) + ')', value: nis, type: 'negative' });
        running -= nis;
    }
    if (tax > 0) {
        items.push({ label: 'Income Tax (-' + compactCurrency(tax) + ')', value: tax, type: 'negative' });
        running -= tax;
    }
    if (loan > 0) {
        items.push({ label: 'Loans (-' + compactCurrency(loan) + ')', value: loan, type: 'negative' });
        running -= loan;
    }
    if (creditUnion > 0) {
        items.push({ label: 'Credit Union (-' + compactCurrency(creditUnion) + ')', value: creditUnion, type: 'negative' });
        running -= creditUnion;
    }

    items.push({ label: 'Net Take-Home', value: netIncome, type: 'total' });

    // Build floating bar data [start, end]
    var barData = [];
    var bgColors = [];
    var labels = [];
    var runVal = 0;

    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        labels.push(item.label);
        if (item.type === 'positive') {
            barData.push([0, item.value]);
            bgColors.push(c.green);
            runVal = item.value;
        } else if (item.type === 'negative') {
            barData.push([runVal - item.value, runVal]);
            bgColors.push(c.red);
            runVal -= item.value;
        } else {
            // total
            barData.push([0, item.value]);
            bgColors.push(c.blue);
        }
    }

    waterfallChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: barData,
                backgroundColor: bgColors,
                borderRadius: 4,
                barPercentage: 0.6
            }]
        },
        options: Object.assign(baseOptions(), {
            indexAxis: 'y',
            layout: { padding: { right: 80 } },
            scales: {
                x: {
                    ticks: { callback: compactCurrency },
                    grid: { color: c.grid }
                },
                y: {
                    grid: { display: false }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            var range = context.raw;
                            if (Array.isArray(range)) {
                                var val = Math.abs(range[1] - range[0]);
                                return formatCurrency(val);
                            }
                            return formatCurrency(context.raw);
                        }
                    }
                },
                datalabels: {
                    display: true,
                    anchor: 'end',
                    align: 'right',
                    color: function() { return getChartColors().text; },
                    font: { weight: 'bold', size: 11 },
                    formatter: function(value) {
                        if (Array.isArray(value)) {
                            return formatCurrency(Math.abs(value[1] - value[0]));
                        }
                        return formatCurrency(value);
                    }
                }
            }
        })
    });
}

// ─── 11. Annual Summary Overview (Bar) ────────────────────

function createAnnualOverviewChart(results) {
    var ctx = document.getElementById('annual-overview-chart');
    if (!ctx) return;
    ctx = ctx.getContext('2d');
    annualOverviewChart = destroyChart(annualOverviewChart);

    var c = getChartColors();

    var labels = ['Gross', 'Tax', 'NIS', 'Gratuity', 'Net Package'];
    var data = [
        results.annualGrossIncome,
        results.annualTaxPayable,
        results.annualNisContribution || results.nisContribution * 12,
        results.annualGratuityTotal,
        results.annualTotal
    ];
    var bgColors = [c.blue, c.red, c.purple, c.yellow, c.green];

    annualOverviewChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Annual',
                data: data,
                backgroundColor: bgColors,
                borderRadius: 4,
                barPercentage: 0.65
            }]
        },
        options: Object.assign(baseOptions(), {
            layout: { padding: { top: 20 } },
            scales: {
                x: { grid: { display: false } },
                y: {
                    beginAtZero: true,
                    ticks: { callback: compactCurrency }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + formatCurrency(context.raw);
                        }
                    }
                },
                datalabels: {
                    display: true,
                    anchor: 'end',
                    align: 'top',
                    color: function() { return getChartColors().text; },
                    font: { weight: 'bold', size: 10 },
                    formatter: function(value) { return value > 0 ? compactCurrency(value) : ''; }
                }
            }
        })
    });
}

// ─── Master update function for all charts ────────────────

function createAllCharts(results) {
    var chartCalls = [
        function() { createIncomeChart(results.basicSalary, results.taxableAllowances, results.nonTaxableAllowances, results.monthlyGratuityAccrual); },
        function() { createTaxChart(results.taxableIncome, results.incomeTax); },
        function() { createCashFlowChart(results.monthlyNetSalary, results.sixMonthGratuity, results.vacationAllowance); },
        function() { createTaxSavingsChart(results); },
        function() { createNetVsGrossChart(results); },
        function() { createSalaryCompositionChart(results); },
        function() { createTaxGaugeChart(results); },
        function() { createDeductionsChart(results); },
        function() { createCumulativeChart(results); },
        function() { createWaterfallChart(results); },
        function() { createAnnualOverviewChart(results); }
    ];
    chartCalls.forEach(function(fn) {
        try { fn(); } catch (e) { console.error('Chart rendering error:', e); }
    });
}
