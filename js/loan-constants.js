/**
 * Loan Calculator Constants — Guyanese bank presets, loan type configs, rate data
 *
 * DISCLAIMER: These rates are approximate reference figures based on publicly
 * available information as of April 2026. Banks change rates frequently and
 * may offer promotional rates not reflected here. This tool is NOT affiliated
 * with any bank or lender. Always contact your bank directly for current rates
 * before making any financial decisions.
 */

// Exchange rate reference (matches vehicle-calculator.js)
const LOAN_DEFAULT_EXCHANGE_RATE = 218;

// Last verified: April 2026
// Sources: bank websites, public rate disclosures, and news reports
const LOAN_RATES_VERIFIED_DATE = 'April 2026';

// Guyanese bank/lender presets
const LOAN_BANK_PRESETS = {
    'gpsccu': {
        name: 'Guyana Public Service Co-operative Credit Union (GPSCCU)',
        shortName: 'GPSCCU',
        rate: 12.0,
        rateMin: 12.0,
        rateMax: 12.0,
        maxTerm: 84,
        type: 'credit_union',
        note: 'Guyana Public Service Co-operative Credit Union (GPSCCU) — 1% per month on reducing balance (12% p.a. nominal). Character, Guarantor, Secured & Vehicle loans up to GY$5M. Mortgages up to GY$15M at variable rates. Source: mygpsccu.com'
    },
    'gbti': {
        name: 'GBTI',
        shortName: 'GBTI',
        rateMin: 6.99,
        rateMax: 10.0,
        rate: 8.5,
        maxTerm: 84,
        type: 'bank',
        note: 'Guyana Bank for Trade and Industry — 6.99%–10% p.a. (vehicle loans; rate depends on vehicle age/type)'
    },
    'republic': {
        name: 'Republic Bank',
        shortName: 'Republic',
        rateMin: 6.0,
        rateMax: 12.0,
        rate: 9.0,
        maxTerm: 72,
        type: 'bank',
        note: 'Republic Bank (Guyana) Ltd — rates from 6% p.a. (promotional) to 12%. Verify current rate; promotions change quarterly.'
    },
    'bank-of-baroda': {
        name: 'Bank of Baroda',
        shortName: 'Baroda',
        rateMin: 10.0,
        rateMax: 14.0,
        rate: 11.0,
        maxTerm: 60,
        type: 'bank',
        note: 'Bank of Baroda (Guyana) — prime lending rate ~10% p.a. Personal loan rates vary; contact bank for current schedule.'
    },
    'citizens': {
        name: 'Citizens Bank',
        shortName: 'Citizens',
        rateMin: 9.5,
        rateMax: 13.0,
        rate: 11.25,
        maxTerm: 72,
        type: 'bank',
        note: 'Citizens Bank Guyana Inc. — 9.5%–13% p.a. on vehicle loans (rate based on year of manufacture, reducing balance)'
    },
    'demerara': {
        name: 'Demerara Bank',
        shortName: 'Demerara',
        rateMin: 11.0,
        rateMax: 14.0,
        rate: 12.5,
        maxTerm: 60,
        type: 'bank',
        note: 'Demerara Bank Limited — 11%–14% p.a. on vehicle loans (rate depends on down payment contribution percentage)'
    },
    'custom': {
        name: 'Custom / Other',
        shortName: 'Custom',
        rate: null,
        rateMin: null,
        rateMax: null,
        maxTerm: 360,
        type: 'custom',
        note: 'Enter your own interest rate and terms'
    }
};

// Loan type configurations
const LOAN_TYPE_CONFIGS = {
    'auto': {
        label: 'Auto Loan',
        icon: 'fa-car',
        defaultPrincipal: 2500000,
        defaultTerm: 60,
        defaultBank: 'republic',
        termMin: 12,
        termMax: 84,
        description: 'Vehicle financing — cars, trucks, SUVs'
    },
    'personal': {
        label: 'Personal Loan',
        icon: 'fa-user',
        defaultPrincipal: 500000,
        defaultTerm: 36,
        defaultBank: 'gbti',
        termMin: 6,
        termMax: 84,
        description: 'General purpose personal financing'
    },
    'mortgage': {
        label: 'Mortgage',
        icon: 'fa-home',
        defaultPrincipal: 15000000,
        defaultTerm: 240,
        defaultBank: 'republic',
        termMin: 60,
        termMax: 360,
        description: 'Home purchase or construction — up to 30 years'
    },
    'custom': {
        label: 'Custom',
        icon: 'fa-sliders-h',
        defaultPrincipal: 1000000,
        defaultTerm: 60,
        defaultBank: 'custom',
        termMin: 1,
        termMax: 360,
        description: 'Fully manual — enter any amount, rate, and term'
    }
};

// Banks to show in the comparison section (top 4 by rate)
const LOAN_COMPARISON_BANKS = ['gpsccu', 'gbti', 'republic', 'citizens'];
