// src/Calculator.jsx
import React, { useState } from "react";
import "./index.css";
import { integrate as numericalIntegrate, differentiate as numericalDifferentiate, summation as numericalSummation, logBase as calculateLogBase, factorial as mathFactorial, getFraction, getMixedFraction, getExactValue, nPr, nCr, evaluateBaseN, evaluateComplex } from "./mathUtils";

// Row-wise Button Definitions to match the physical layout
const SCI_ROW_1_LEFT = [
    { main: "CALC", gold: "SOLVE", pink: "=" },
    {
        main: '<div class="integral-wrap"><span class="integral-sign" style="line-height:1">∫</span><div class="limit-boxes" style="left:8px"><div class="math-box" style="width:3.5px;height:3.5px;border-width:0.5px"></div><div class="math-box" style="width:3.5px;height:3.5px;border-width:0.5px"></div></div><div class="math-box" style="width:6px;height:4.5px;border-width:0.6px;margin-left:14px;display:inline-block;vertical-align:middle"></div></div>',
        gold: '<div class="math-icon-wrapper" style="font-size:0.9em"><div style="display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;margin-right:2px;line-height:1"><div style="border-bottom:1px solid;padding:0 1px"><i>d</i></div><div><i>dX</i></div></div>(<div class="math-box" style="width:5px;height:5px;display:inline-block;vertical-align:middle"></div>)|<sub>x=</sub><div class="math-box" style="width:5px;height:5px;display:inline-block;vertical-align:middle"></div></div>',
        pink: ":"
    },
];
const SCI_ROW_1_RIGHT = [
    { main: "<i>x</i>⁻¹", gold: "<i>x</i>!", pink: "" },
    {
        main: '<div class="math-icon-wrapper" style="gap:1px">log<sub><div class="math-box" style="width:3px;height:3px;border-width:0.5px;display:inline-block;vertical-align:bottom;margin-bottom:0px"></div></sub><div class="math-box" style="width:5.5px;height:5.5px;border-width:0.6px;display:inline-block;vertical-align:middle;margin-left:1px"></div></div>',
        gold: '<div class="math-icon-wrapper" style="gap:2px"><span class="sum-icon-stack" style="gap:0px"><div class="math-box" style="width:3px;height:3px;border-width:0.5px;margin-bottom:1px"></div><span class="sum-sign" style="font-size:1.3em;line-height:0.9">Σ</span><div class="math-box" style="width:3px;height:3px;border-width:0.5px;margin-top:1px"></div></span><div class="math-box" style="width:7px;height:4.5px;border-width:0.6px;display:inline-block;vertical-align:middle;border-radius:0.5px"></div></div>',
        pink: ""
    },
];

const SCI_ROW_2 = [
    {
        main: '<div class="frac-icon"><div class="frac-box"></div><div class="frac-line"></div><div class="frac-box"></div></div>',
        gold: '<div class="mixed-frac-icon"><div class="label-mixed-box"></div><div class="label-frac-icon"><div class="label-frac-box"></div><div class="label-frac-line"></div><div class="label-frac-box"></div></div></div>',
        pink: ""
    },
    {
        main: '<div class="math-icon-wrapper" style="gap:1px">√<div class="math-box" style="width:6px;height:6px;display:inline-block;vertical-align:middle"></div></div>',
        gold: '<div class="math-icon-wrapper" style="gap:1px;font-size:0.9em"><sup style="font-size:0.6em;margin-right:-2px">3</sup>√<div class="math-box" style="width:4.5px;height:4.5px;border-width:0.6px;display:inline-block;vertical-align:middle"></div></div>',
        pink: ""
    },
    { main: "<i>x</i>²", gold: "<i>x</i>³", pink: "DEC" },
    {
        main: '<i>x</i><sup><div class="math-box" style="width:5px;height:5px;display:inline-block;margin-bottom:1px"></div></sup>',
        gold: '<div class="math-icon-wrapper" style="gap:0px"><sup><div class="math-box" style="width:4px;height:4px;border-width:0.6px;display:inline-block;vertical-align:top;margin-top:2px"></div></sup>√<div class="math-box" style="width:5px;height:5px;display:inline-block;vertical-align:middle"></div></div>',
        pink: "HEX"
    },
    { main: "log", gold: '10<sup><div class="math-box" style="width:5px;height:5px;display:inline-block;margin-bottom:1px"></div></sup>', pink: "BIN" },
    { main: "ln", gold: '<i>e</i><sup><div class="math-box" style="width:5px;height:5px;display:inline-block;margin-bottom:1px"></div></sup>', pink: "OCT" }
];


const SCI_ROW_3 = [
    { main: "(-)", gold: "[∠]", pink: "[A]" },
    { main: "°'\"", gold: "←", pink: "[B]" }, // Degree/Minutes
    { main: "hyp", gold: "Abs", pink: "[C]" },
    { main: "sin", gold: "sin⁻¹", pink: "[D]" },
    { main: "cos", gold: "cos⁻¹", pink: "[E]" },
    { main: "tan", gold: "tan⁻¹", pink: "[F]" }
];

const SCI_ROW_4 = [
    { main: "RCL", gold: "STO", pink: "" },
    { main: "ENG", gold: "←", pink: "<i>i</i>" },
    { main: "(", gold: "<i>%</i>", pink: "" },
    { main: ")", gold: ",", pink: "[X]" },
    {
        main: "S⇔D",
        gold: '<i>a</i><span class="math-icon-wrapper" style="font-size:0.65em;gap:0px;margin-bottom:2px"><div style="display:inline-flex;flex-direction:column;align-items:center;line-height:1;margin:0 1px"><div style="border-bottom:0.8px solid"><i>b</i></div><div><i>c</i></div></div></span>⇔<span class="math-icon-wrapper" style="font-size:0.65em;gap:0px;margin-bottom:2px"><div style="display:inline-flex;flex-direction:column;align-items:center;line-height:1;margin:0 1px"><div style="border-bottom:0.8px solid"><i>d</i></div><div><i>c</i></div></div></span>',
        pink: "[Y]"
    },
    { main: "M+", gold: "M-", pink: "[M]" }
];






const NUM_BUTTONS = [
    { main: "7", gold: "CONST", pink: "" },
    { main: "8", gold: "CONV", pink: "" },
    { main: "9", gold: "CLR", pink: "" },
    { main: "DEL", gold: "INS", pink: "", type: "orange" },
    { main: "AC", gold: "OFF", pink: "", type: "orange" },
    { main: "4", gold: "[MATRIX]", pink: "" },
    { main: "5", gold: "[VECTOR]", pink: "" },
    { main: "6", gold: "", pink: "" },
    { main: "×", gold: "nPr", pink: "" },
    { main: "÷", gold: "nCr", pink: "" },
    { main: "1", gold: "[STAT]", pink: "" },
    { main: "2", gold: "[CMPLX]", pink: "" },
    { main: "3", gold: "[BASE]", pink: "" },
    { main: "+", gold: "Pol", pink: "" },
    { main: "-", gold: "Rec", pink: "" },
    { main: "0", gold: "Rnd", pink: "" },
    { main: "•", gold: "Ran#", pink: "RanInt" },
    { main: "<i>x</i>10<sup><i>x</i></sup>", gold: "π", pink: "<i>e</i>" },
    { main: "Ans", gold: "DRG▶", pink: "" },
    { main: "=", gold: "", pink: "" }
];

// ─── ZAKAT CALCULATOR SUB-COMPONENTS ──────────────────────────────────────────
const ZakatInputRow = ({ label, icon, value, onChange, unit, placeholder, lang }) => (
    <div className={`zakat-input-row ${lang === 'ur' ? 'ur-rtl' : ''}`}>
        <div className="zakat-input-label">
            <span className="zakat-input-icon">{icon}</span>
            <span>{label}</span>
        </div>
        <div className="zakat-input-field-wrap">
            <input
                className="zakat-input"
                type="number"
                min="0"
                placeholder={placeholder || "0"}
                value={value}
                onChange={e => onChange(e.target.value)}
            />
            {unit && <span className="zakat-input-unit">{unit}</span>}
        </div>
    </div>
);

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const zakatTranslations = {
    en: {
        title: "Zakat Calculator",
        subtitle: "Calculate your annual Zakat obligation",
        marketPrices: "💱 Market Prices",
        currency: "Currency",
        updateLive: "🔄 Update Live Prices",
        updating: "⌛ Updating...",
        goldPrice: "Gold Price/g",
        silverPrice: "Silver Price/g",
        assets: "📦 Your Assets",
        goldOwned: "Gold Owned",
        silverOwned: "Silver Owned",
        cash: "Cash & Savings",
        bizAssets: "Business Assets",
        investments: "Investments",
        debts: "📉 Debts & Liabilities",
        totalDebts: "Total Debts",
        calcBtn: "⚖️ Calculate Zakat",
        resetBtn: "↺ Reset",
        fard: "Zakat is Obligatory (Fard)",
        notFard: "Below Nisab — Zakat is Not Obligatory",
        goldVal: "Gold Value",
        silverVal: "Silver Value",
        cashVal: "Cash & Savings",
        bizVal: "Business Assets",
        invVal: "Investments",
        totalWealth: "Total Wealth",
        lessDebts: "Less: Debts",
        netWealth: "Net Zakatable Wealth",
        goldNisab: "Gold Nisab (87.48g)",
        silverNisab: "Silver Nisab (612.36g)",
        appNisab: "Applicable Nisab",
        zakatDue: "Zakat Due (2.5%)",
        note: "Zakat is calculated at 2.5% on wealth held for one lunar year (hawl) above the nisab threshold.",
        grams: "grams",
        apiWarning: "Could not fetch live prices. Please enter them manually."
    },
    ur: {
        title: "زکوٰۃ کیلکولیٹر",
        subtitle: "اپنی سالانہ زکوٰۃ کا حساب لگائیں",
        marketPrices: "💱 مارکیٹ کی قیمتیں",
        currency: "کرنسی",
        updateLive: "🔄 تازہ ترین قیمتیں",
        updating: "⌛ اپ ڈیٹ ہو رہا ہے...",
        goldPrice: "سونے کی قیمت / گرام",
        silverPrice: "چاندی کی قیمت / گرام",
        assets: "📦 آپ کے اثاثے",
        goldOwned: "سونا (گرام)",
        silverOwned: "چاندی (گرام)",
        cash: "نقدی اور بچت",
        bizAssets: "کاروبار کے اثاثے",
        investments: "سرمایہ کاری",
        debts: "📉 قرض اور واجبات",
        totalDebts: "کل قرض",
        calcBtn: "⚖️ زکوٰۃ نکالیں",
        resetBtn: "↺ دوبارہ شروع کریں",
        fard: "زکوٰۃ فرض ہے",
        notFard: "نصاب سے کم - زکوٰۃ فرض نہیں",
        goldVal: "سونے کی مالیت",
        silverVal: "چاندی کی مالیت",
        cashVal: "نقدی اور بچت",
        bizVal: "کاروبار کے اثاثے",
        invVal: "سرمایہ کاری",
        totalWealth: "کل دولت",
        lessDebts: "منہا: قرض",
        netWealth: "کل قابلِ زکوٰۃ مال",
        goldNisab: "سونے کا نصاب (87.48 گرام)",
        silverNisab: "چاندی کا نصاب (612.36 گرام)",
        appNisab: "لاگو نصاب",
        zakatDue: "واجب الادا زکوٰۃ (2.5%)",
        note: "زکوٰۃ کل دولت کا 2.5٪ ہے جو نصاب سے زیادہ ہو اور اس پر ایک قمری سال گزر چکا ہو۔",
        grams: "گرام",
        apiWarning: "قیمتیں حاصل نہیں ہو سکیں۔ براہ کرم خود درج کریں۔"
    }
};

// ─── ZAKAT CALCULATOR COMPONENT ───────────────────────────────────────────────
function ZakatCalculator({ isSidebarOpen, setIsSidebarOpen }) {
    const [goldGrams, setGoldGrams] = React.useState("");
    const [silverGrams, setSilverGrams] = React.useState("");
    const [cashSavings, setCashSavings] = React.useState("");
    const [businessAssets, setBusinessAssets] = React.useState("");
    const [investments, setInvestments] = React.useState("");
    const [debts, setDebts] = React.useState("");
    const [goldPrice, setGoldPrice] = React.useState("21000");   // PKR per gram default
    const [silverPrice, setSilverPrice] = React.useState("260"); // PKR per gram default
    const [currency, setCurrency] = React.useState("PKR");
    const [lang, setLang] = React.useState("en");
    const [isLoading, setIsLoading] = React.useState(false);
    const [apiError, setApiError] = React.useState(null);
    const [calculated, setCalculated] = React.useState(null);

    const t = zakatTranslations[lang];

    const NISAB_GOLD_GRAMS = 87.48;
    const NISAB_SILVER_GRAMS = 612.36;
    const ZAKAT_RATE = 0.025;

    const fetchLivePrices = async () => {
        setIsLoading(true);
        setApiError(null);
        try {
            // 1. Fetch Gold Price & Ratio (USD/oz)
            const goldRes = await fetch("https://freegoldapi.com/data/generation_metadata.json");
            const goldData = await goldRes.json();

            // 2. Fetch Exchange Rates
            const rateRes = await fetch(`https://open.er-api.com/v6/latest/USD`);
            const rateData = await rateRes.json();

            if (goldData.most_recent_data && rateData.rates) {
                const usdPerOz = goldData.most_recent_data.yahoo_finance_gold.latest_price;
                const ratio = goldData.most_recent_data.gold_silver_ratio.latest_ratio;
                const exchangeRate = rateData.rates[currency] || 1;

                // 1 Troy Ounce = 31.1034768 grams
                const OZ_TO_G = 31.1034768;
                const usdPerG = usdPerOz / OZ_TO_G;

                const localPriceGold = (usdPerG * exchangeRate).toFixed(2);
                const localPriceSilver = ((usdPerG / ratio) * exchangeRate).toFixed(2);

                setGoldPrice(localPriceGold);
                setSilverPrice(localPriceSilver);
            } else {
                throw new Error("Invalid API response structure");
            }
        } catch (err) {
            console.error("Price fetch failed:", err);
            setApiError(t.apiWarning);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        // Initial fetch on mount
        fetchLivePrices();
    }, [currency]); // Re-fetch if currency changes to get new local rates

    const fmt = (n) => {
        if (isNaN(n) || n === null || n === undefined) return "0.00";
        return Number(n).toLocaleString("en-PK", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const calculate = () => {
        const gp = parseFloat(goldPrice) || 0;
        const sp = parseFloat(silverPrice) || 0;
        const goldVal = (parseFloat(goldGrams) || 0) * gp;
        const silverVal = (parseFloat(silverGrams) || 0) * sp;
        const cash = parseFloat(cashSavings) || 0;
        const biz = parseFloat(businessAssets) || 0;
        const inv = parseFloat(investments) || 0;
        const debt = parseFloat(debts) || 0;

        const nisabGold = NISAB_GOLD_GRAMS * gp;
        const nisabSilver = NISAB_SILVER_GRAMS * sp;
        const nisabThreshold = Math.min(nisabGold > 0 ? nisabGold : Infinity, nisabSilver > 0 ? nisabSilver : Infinity);

        const totalWealth = goldVal + silverVal + cash + biz + inv;
        const zakatable = Math.max(0, totalWealth - debt);
        const aboveNisab = zakatable >= (nisabThreshold || 0);
        const zakatDue = aboveNisab ? zakatable * ZAKAT_RATE : 0;

        setCalculated({
            goldVal, silverVal, cash, biz, inv, debt,
            totalWealth, zakatable, nisabThreshold, aboveNisab, zakatDue,
            nisabGold: gp > 0 ? nisabGold : null,
            nisabSilver: sp > 0 ? nisabSilver : null,
        });
    };

    const reset = () => {
        setGoldGrams(""); setSilverGrams(""); setCashSavings("");
        setBusinessAssets(""); setInvestments(""); setDebts("");
        setCalculated(null);
    };


    return (
        <div className="zakat-container">
            <div className={`zakat-card ${lang === 'ur' ? 'ur-rtl' : ''}`}>

                {/* Header & Language Toggle */}
                <div className="zakat-top-actions" style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px 0' }}>
                    <div className="settings-icon-inline" title="Settings" onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ position: 'static', cursor: 'pointer', opacity: 0.7 }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '22px', height: '22px' }}>
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33 1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82 1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                        </svg>
                    </div>
                    <div className="lang-toggle" style={{ position: 'absolute', right: '0' }}>
                        <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
                        <button className={lang === 'ur' ? 'active' : ''} onClick={() => setLang('ur')}>اردو</button>
                    </div>
                </div>

                <div className="zakat-header">
                    <div className="zakat-header-icon">☪️</div>
                    <div>
                        <h1 className="zakat-title">{t.title}</h1>
                        <p className="zakat-subtitle">{t.subtitle}</p>
                    </div>
                </div>

                {/* Currency & Prices */}
                <div className="zakat-section">
                    <div className="zakat-section-title">
                        <span>{t.marketPrices}</span>
                        <button
                            className={`zakat-btn-refresh ${isLoading ? 'loading' : ''}`}
                            onClick={fetchLivePrices}
                            disabled={isLoading}
                            title="Fetch Latest Market Prices"
                        >
                            {isLoading ? t.updating : t.updateLive}
                        </button>
                    </div>

                    {apiError && <div className="zakat-api-warning">⚠️ {apiError}</div>}

                    <div className="zakat-price-grid">
                        <div className="zakat-input-row">
                            <div className="zakat-input-label">
                                <span className="zakat-input-icon">💰</span>
                                <span>{t.currency}</span>
                            </div>
                            <select className="zakat-select" value={currency} onChange={e => setCurrency(e.target.value)}>
                                <option value="PKR">PKR</option>
                                <option value="USD">USD</option>
                                <option value="GBP">GBP</option>
                                <option value="SAR">SAR</option>
                                <option value="AED">AED</option>
                            </select>
                        </div>
                        <ZakatInputRow label={t.goldPrice} icon="🥇" value={goldPrice} onChange={setGoldPrice} unit={currency} placeholder="21000" lang={lang} />
                        <ZakatInputRow label={t.silverPrice} icon="🥈" value={silverPrice} onChange={setSilverPrice} unit={currency} placeholder="260" lang={lang} />
                    </div>
                </div>

                {/* Assets */}
                <div className="zakat-section">
                    <div className="zakat-section-title">{t.assets}</div>
                    <ZakatInputRow label={t.goldOwned} icon="🥇" value={goldGrams} onChange={setGoldGrams} unit={t.grams} placeholder="0" lang={lang} />
                    <ZakatInputRow label={t.silverOwned} icon="🥈" value={silverGrams} onChange={setSilverGrams} unit={t.grams} placeholder="0" lang={lang} />
                    <ZakatInputRow label={t.cash} icon="💵" value={cashSavings} onChange={setCashSavings} unit={currency} placeholder="0" lang={lang} />
                    <ZakatInputRow label={t.bizAssets} icon="🏪" value={businessAssets} onChange={setBusinessAssets} unit={currency} placeholder="0" lang={lang} />
                    <ZakatInputRow label={t.investments} icon="📈" value={investments} onChange={setInvestments} unit={currency} placeholder="0" lang={lang} />
                </div>

                {/* Liabilities */}
                <div className="zakat-section">
                    <div className="zakat-section-title">{t.debts}</div>
                    <ZakatInputRow label={t.totalDebts} icon="💳" value={debts} onChange={setDebts} unit={currency} placeholder="0" lang={lang} />
                </div>

                {/* Action Buttons */}
                <div className="zakat-actions">
                    <button className="zakat-btn-calc" onClick={calculate}>{t.calcBtn}</button>
                    <button className="zakat-btn-reset" onClick={reset}>{t.resetBtn}</button>
                </div>

                {/* Result */}
                {calculated && (
                    <div className={`zakat-result ${calculated.aboveNisab ? 'above' : 'below'}`}>
                        <div className="zakat-result-header">
                            {calculated.aboveNisab
                                ? <><span className="zakat-status-icon">✅</span> {t.fard}</>
                                : <><span className="zakat-status-icon">ℹ️</span> {t.notFard}</>
                            }
                        </div>

                        <div className="zakat-breakdown">
                            <div className="zakat-breakdown-row">
                                <span>{t.goldVal}</span>
                                <span className="ltr-val">{currency} {fmt(calculated.goldVal)}</span>
                            </div>
                            <div className="zakat-breakdown-row">
                                <span>{t.silverVal}</span>
                                <span className="ltr-val">{currency} {fmt(calculated.silverVal)}</span>
                            </div>
                            <div className="zakat-breakdown-row">
                                <span>{t.cashVal}</span>
                                <span className="ltr-val">{currency} {fmt(calculated.cash)}</span>
                            </div>
                            <div className="zakat-breakdown-row">
                                <span>{t.bizVal}</span>
                                <span className="ltr-val">{currency} {fmt(calculated.biz)}</span>
                            </div>
                            <div className="zakat-breakdown-row">
                                <span>{t.invVal}</span>
                                <span className="ltr-val">{currency} {fmt(calculated.inv)}</span>
                            </div>
                            <div className="zakat-breakdown-row total-row">
                                <span>{t.totalWealth}</span>
                                <span className="ltr-val">{currency} {fmt(calculated.totalWealth)}</span>
                            </div>
                            <div className="zakat-breakdown-row debt-row">
                                <span>{t.lessDebts}</span>
                                <span className="ltr-val">− {currency} {fmt(calculated.debt)}</span>
                            </div>
                            <div className="zakat-breakdown-row net-row">
                                <span>{t.netWealth}</span>
                                <span className="ltr-val">{currency} {fmt(calculated.zakatable)}</span>
                            </div>
                        </div>

                        <div className="zakat-nisab-info">
                            {calculated.nisabGold && (
                                <div className="zakat-nisab-line">
                                    🥇 {t.goldNisab}: <strong className="ltr-val">{currency} {fmt(calculated.nisabGold)}</strong>
                                </div>
                            )}
                            {calculated.nisabSilver && (
                                <div className="zakat-nisab-line">
                                    🥈 {t.silverNisab}: <strong className="ltr-val">{currency} {fmt(calculated.nisabSilver)}</strong>
                                </div>
                            )}
                            <div className="zakat-nisab-line">
                                ⚖️ {t.appNisab}: <strong className="ltr-val">{currency} {fmt(calculated.nisabThreshold)}</strong>
                            </div>
                        </div>

                        {calculated.aboveNisab && (
                            <div className="zakat-due-box">
                                <div className="zakat-due-label">{t.zakatDue}</div>
                                <div className="zakat-due-amount ltr-val">{currency} {fmt(calculated.zakatDue)}</div>
                            </div>
                        )}

                        <div className="zakat-note">
                            📖 {t.note}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function Calculator() {

    const [expression, setExpression] = useState("");
    const [result, setResult] = useState("");
    const [lastAnswer, setLastAnswer] = useState("0");
    const [isComplete, setIsComplete] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeApp, setActiveApp] = useState("casio"); // "casio", "simple", or "zakat"
    const [simpleExpr, setSimpleExpr] = useState("");
    const [simpleRes, setSimpleRes] = useState("");
    const [simpleGT, setSimpleGT] = useState(0);
    const [simpleMemory, setSimpleMemory] = useState(0);
    const [simpleHistory, setSimpleHistory] = useState([]); // Array of {e, r}
    const [historyStep, setHistoryStep] = useState(-1);
    const [isMrcPressed, setIsMrcPressed] = useState(false);
    const [isCorrectMode, setIsCorrectMode] = useState(false);
    const [isShiftActive, setIsShiftActive] = useState(false);
    const [isAlphaActive, setIsAlphaActive] = useState(false);
    const [isHypMenuOpen, setIsHypMenuOpen] = useState(false);
    const [isStoActive, setIsStoActive] = useState(false);
    const [isRclActive, setIsRclActive] = useState(false);
    const [isFractionDisplay, setIsFractionDisplay] = useState(true);
    const [isInsertMode, setIsInsertMode] = useState(false);
    const [isClrMenuOpen, setIsClrMenuOpen] = useState(false);
    const [isConvMenuOpen, setIsConvMenuOpen] = useState(false);
    const [convCode, setConvCode] = useState("");
    const [isConstMenuOpen, setIsConstMenuOpen] = useState(false);
    const [constCode, setConstCode] = useState("");
    const [isMatrixMenuOpen, setIsMatrixMenuOpen] = useState(false);
    // ── MATRIX STATES ────────────────────────────────────────────────────────
    // Matrix sub-state: null | 'dim_select' | 'dim_rows' | 'dim_cols' | 'data_entry' | 'data_select'
    const [matrixSubState, setMatrixSubState] = useState(null);
    // Which matrix slot is being edited: 'A' | 'B' | 'C'
    const [activeMatrixSlot, setActiveMatrixSlot] = useState(null);
    // Data entry: { rows, cols, data: [[]], editRow, editCol, inputBuf, dimRows, dimCols }
    const [matrixEntry, setMatrixEntry] = useState(null);
    // Stored matrices: { A: null | [[...]], B: null, C: null, Ans: null }
    const [matrices, setMatrices] = useState({ A: null, B: null, C: null, Ans: null });
    // Expression in matrix calc mode e.g. 'MatA+MatB'
    const [matrixExpr, setMatrixExpr] = useState("");
    // Whether in matrix calc expression building mode
    const [isMatrixCalcMode, setIsMatrixCalcMode] = useState(false);
    // Pending unary operation: null | 'Det' | 'Trn' | 'Inv' | 'Rank' | 'Trace'
    const [matrixPendingOp, setMatrixPendingOp] = useState(null);
    // ── END MATRIX STATES ────────────────────────────────────────────────────

    const [isVectorMenuOpen, setIsVectorMenuOpen] = useState(false);
    // Vector Sub-States: null | 'dim_select' | 'data_entry' | 'result_view'
    const [vectorSubState, setVectorSubState] = useState(null);
    // Which vector slot is being edited: 'A' | 'B' | 'C'
    const [activeVectorSlot, setActiveVectorSlot] = useState(null);
    // Dimension selection step: null | '2' | '3'
    const [vectorDimPending, setVectorDimPending] = useState(null);
    // Data entry: { dim: 2|3, elements: [str, str, ...], editIdx: 0, inputBuf: '' }
    const [vectorEntry, setVectorEntry] = useState(null);
    // Stored vectors: { A: null|[num,num,num], B: null|..., C: null|..., Ans: null|... }
    const [vectors, setVectors] = useState({ A: null, B: null, C: null, Ans: null });
    // Expression built using vector tokens e.g. 'VctA+VctB'
    const [vectorExpr, setVectorExpr] = useState("");
    // Whether we are in vector expression building mode
    const [isVectorCalcMode, setIsVectorCalcMode] = useState(false);
    const [isBaseMenuOpen, setIsBaseMenuOpen] = useState(false);
    const [isCmplxMenuOpen, setIsCmplxMenuOpen] = useState(false);
    const [isStatMenuOpen, setIsStatMenuOpen] = useState(false);
    const [isDrgMenuOpen, setIsDrgMenuOpen] = useState(false);
    const [statType, setStatType] = useState(null); // '1-VAR', 'A+BX'
    const [statSubState, setStatSubState] = useState(null); // 'data_entry', 'calc'
    const [statData, setStatData] = useState([]); // Array of {x, y} or just {x}
    const [statEntry, setStatEntry] = useState({ editRow: 0, editCol: 0, inputBuf: "" });
    const [variables, setVariables] = useState({
        A: null, B: null, C: null, D: null, E: null, F: null, X: null, Y: null, M: null
    });
    // ── MATRIX MATH LIBRARY ──
    const matrixMath = {
        add: (A, B) => {
            if (!A || !B || A.length !== B.length || A[0].length !== B[0].length) throw new Error("Dim");
            return A.map((r, i) => r.map((c, j) => c + B[i][j]));
        },
        sub: (A, B) => {
            if (!A || !B || A.length !== B.length || A[0].length !== B[0].length) throw new Error("Dim");
            return A.map((r, i) => r.map((c, j) => c - B[i][j]));
        },
        mul: (A, B) => {
            if (!A || !B || A[0].length !== B.length) throw new Error("Dim");
            const res = Array(A.length).fill(0).map(() => Array(B[0].length).fill(0));
            for (let i = 0; i < A.length; i++)
                for (let j = 0; j < B[0].length; j++)
                    for (let k = 0; k < A[0].length; k++) res[i][j] += A[i][k] * B[k][j];
            return res;
        },
        scalarMul: (A, k) => A.map(r => r.map(c => c * k)),
        transpose: (A) => A[0].map((_, c) => A.map(r => r[c])),
        det: (A) => {
            if (A.length !== A[0].length) throw new Error("Dim");
            const n = A.length;
            if (n === 1) return A[0][0];
            if (n === 2) return A[0][0] * A[1][1] - A[0][1] * A[1][0];
            if (n === 3) return A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) - A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) + A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]);
            return NaN;
        },
        inverse: (A) => {
            if (A.length !== A[0].length) throw new Error("Dim");
            const d = matrixMath.det(A);
            if (Math.abs(d) < 1e-12) throw new Error("Math");
            if (A.length === 2) return [[A[1][1] / d, -A[0][1] / d], [-A[1][0] / d, A[0][0] / d]];
            if (A.length === 3) {
                const adj = [];
                for (let i = 0; i < 3; i++) {
                    adj[i] = [];
                    for (let j = 0; j < 3; j++) {
                        const sub = A.filter((_, r) => r !== i).map(row => row.filter((_, c) => c !== j));
                        adj[i][j] = ((i + j) % 2 === 0 ? 1 : -1) * matrixMath.det(sub);
                    }
                }
                return matrixMath.transpose(adj).map(r => r.map(v => v / d));
            }
            return null;
        },
        trace: (A) => {
            if (A.length !== A[0].length) throw new Error("Dim");
            return A.reduce((s, r, i) => s + (r[i] || 0), 0)
        },
        rank: (A) => {
            const rows = A.length;
            const cols = A[0].length;
            let mat = A.map(r => [...r]);
            let rank = 0;
            const pivotRows = Array(rows).fill(false);
            for (let j = 0; j < cols && rank < rows; j++) {
                let pivot = -1;
                for (let i = 0; i < rows; i++) {
                    if (!pivotRows[i] && Math.abs(mat[i][j]) > 1e-12) {
                        pivot = i;
                        break;
                    }
                }
                if (pivot !== -1) {
                    rank++;
                    pivotRows[pivot] = true;
                    for (let i = 0; i < rows; i++) {
                        if (i !== pivot) {
                            const factor = mat[i][j] / mat[pivot][j];
                            for (let k = j; k < cols; k++) {
                                mat[i][k] -= factor * mat[pivot][k];
                            }
                        }
                    }
                }
            }
            return rank;
        },
        lu: (A) => {
            if (A.length !== A[0].length) throw new Error("Dim");
            const n = A.length;
            const L = Array(n).fill(0).map(() => Array(n).fill(0));
            const U = Array(n).fill(0).map(() => Array(n).fill(0));
            for (let i = 0; i < n; i++) {
                for (let k = i; k < n; k++) {
                    let sum = 0;
                    for (let j = 0; j < i; j++) sum += (L[i][j] * U[j][k]);
                    U[i][k] = A[i][k] - sum;
                }
                for (let k = i; k < n; k++) {
                    if (i === k) L[i][i] = 1;
                    else {
                        let sum = 0;
                        for (let j = 0; j < i; j++) sum += (L[k][j] * U[j][i]);
                        if (Math.abs(U[i][i]) < 1e-14) throw new Error("Math");
                        L[k][i] = (A[k][i] - sum) / U[i][i];
                    }
                }
            }
            return { L, U };
        }
    };

    const evaluateMatrixExpr = (expr) => {
        try {
            const getM = (s) => matrices[s.trim().replace('Mat', '')];

            const parsePart = (p) => {
                p = p.trim();
                if (!p) return null;

                // Function calls check
                const funcMatch = p.match(/^(Det|Trn|Rank|Trace|LU_L|LU_U|Inv)\((.*)\)$/i);
                if (funcMatch) {
                    const func = funcMatch[1].toLowerCase();
                    const inner = parsePart(funcMatch[2]);
                    if (!inner || inner.error) return inner || { error: "Unset" };
                    if (func === 'det') return { scalar: matrixMath.det(inner) };
                    if (func === 'trn') return matrixMath.transpose(inner);
                    if (func === 'rank') return { scalar: matrixMath.rank(inner) };
                    if (func === 'trace') return { scalar: matrixMath.trace(inner) };
                    if (func === 'inv') return matrixMath.inverse(inner);
                    if (func === 'lu_l') { const res = matrixMath.lu(inner); return res.L; }
                    if (func === 'lu_u') { const res = matrixMath.lu(inner); return res.U; }
                }

                // Inverse or Square
                if (p.endsWith('⁻¹')) {
                    const inner = parsePart(p.replace('⁻¹', ''));
                    if (!inner || inner.error) return inner || { error: "Unset" };
                    return matrixMath.inverse(inner);
                }
                if (p.endsWith('²')) {
                    const inner = parsePart(p.replace('²', ''));
                    if (!inner || inner.error) return inner || { error: "Unset" };
                    return matrixMath.mul(inner, inner);
                }

                // Scalar * Matrix
                const scalarMatMatch = p.match(/^([-+]?[0-9.]+)[×*x]? ?(Mat[ABC]|MatAns)$/i);
                if (scalarMatMatch) {
                    const k = parseFloat(scalarMatMatch[1]), m = getM(scalarMatMatch[2]);
                    return m ? matrixMath.scalarMul(m, k) : { error: "Unset" };
                }

                if (p === 'π') return { scalar: Math.PI };
                if (p === 'e') return { scalar: Math.E };

                if (p.startsWith('Mat')) {
                    return getM(p) || { error: "Unset" };
                }

                return { error: "Syntax" };
            };

            const parts = expr.split(/([+\-×])/);
            let res = parsePart(parts[0]);
            if (!res || res.error) return res || { error: "Unset" };

            // We might have a scalar result from parsePart (like Det(MatA))
            // but the loop below expects matrices or continues scalar math.
            for (let i = 1; i < parts.length; i += 2) {
                const op = parts[i], nextPart = parts[i + 1];
                let nextM = parsePart(nextPart);
                if (!nextM || nextM.error) return nextM || { error: "Unset" };

                if (op === '+') {
                    if (res.scalar !== undefined || nextM.scalar !== undefined) return { error: "Math" };
                    res = matrixMath.add(res, nextM);
                } else if (op === '-') {
                    if (res.scalar !== undefined || nextM.scalar !== undefined) return { error: "Math" };
                    res = matrixMath.sub(res, nextM);
                } else if (op === '×') {
                    if (res.scalar !== undefined && nextM.scalar !== undefined) res = { scalar: res.scalar * nextM.scalar };
                    else if (res.scalar !== undefined) res = matrixMath.scalarMul(nextM, res.scalar);
                    else if (nextM.scalar !== undefined) res = matrixMath.scalarMul(res, nextM.scalar);
                    else res = matrixMath.mul(res, nextM);
                }
            }

            return res.scalar !== undefined ? res : { mat: res };
        } catch (e) {
            return { error: e.message === "Dim" ? "Dim" : "Math" };
        }
    };

    const calculateStats = () => {
        // Use a copy of statData and apply the current input buffer if any
        let effectiveData = statData.map(d => ({ ...d }));
        if (statEntry && statEntry.inputBuf !== "") {
            const val = parseFloat(statEntry.inputBuf);
            if (!isNaN(val)) {
                if (statType === '1-VAR') effectiveData[statEntry.editRow].x = val;
                else if (statEntry.editCol === 0) effectiveData[statEntry.editRow].x = val;
                else effectiveData[statEntry.editRow].y = val;
            }
        }

        // Casio-like heuristic: n is the number of rows where the user has entered data.
        // We consider all rows up to the "last significant" row.
        // A row is significant if it's not the last row in the list OR if it has a non-zero value OR if the user is currently editing it.
        let n_effective = effectiveData.length;
        if (n_effective > 1) {
            const lastIdx = n_effective - 1;
            const lastRow = effectiveData[lastIdx];
            const isLastEmpty = statType === '1-VAR' ? lastRow.x === 0 : (lastRow.x === 0 && lastRow.y === 0);
            // If the last row is zero AND the user is not currently on it with an input buffer, ignore it.
            if (isLastEmpty && statEntry.editRow !== lastIdx && statEntry.inputBuf === "") {
                n_effective--;
            }
        }

        const validData = effectiveData.slice(0, n_effective);
        const n = validData.length;
        if (n === 0) return null;

        const sumX = validData.reduce((a, b) => a + b.x, 0);
        const sumX2 = validData.reduce((a, b) => a + b.x * b.x, 0);
        const meanX = sumX / n;

        // Use population variance for stdX
        const sumSqDiffX = validData.reduce((a, b) => a + Math.pow(b.x - meanX, 2), 0);
        const stdX = Math.sqrt(sumSqDiffX / n);
        const sX = n > 1 ? Math.sqrt(sumSqDiffX / (n - 1)) : 0;

        if (statType === '1-VAR') {
            return { n, sumX, sumX2, meanX, stdX, sX };
        } else if (statType === 'A+BX') {
            const sumY = validData.reduce((a, b) => a + b.y, 0);
            const sumY2 = validData.reduce((a, b) => a + b.y * b.y, 0);
            const sumXY = validData.reduce((a, b) => a + b.x * b.y, 0);
            const meanY = sumY / n;

            const sumSqDiffY = validData.reduce((a, b) => a + Math.pow(b.y - meanY, 2), 0);
            const stdY = Math.sqrt(sumSqDiffY / n);
            const sY = n > 1 ? Math.sqrt(sumSqDiffY / (n - 1)) : 0;

            const sumProdDiff = validData.reduce((a, b) => a + (b.x - meanX) * (b.y - meanY), 0);

            // denomX and denomY for b and r
            const denomX = n * sumX2 - sumX * sumX;
            const denomY = n * sumY2 - sumY * sumY;

            // b = Sxy / Sxx
            const b = sumSqDiffX !== 0 ? sumProdDiff / sumSqDiffX : 0;
            const a = meanY - b * meanX;

            // r = Sxy / sqrt(Sxx * Syy)
            const rDenom = Math.sqrt(sumSqDiffX * sumSqDiffY);
            const r = rDenom !== 0 ? sumProdDiff / rDenom : 0;

            return { n, sumX, sumX2, meanX, stdX, sX, sumY, sumY2, meanY, stdY, sY, sumXY, a, b, r };
        }
        return null;
    };

    const [cursorPosition, setCursorPosition] = useState(0);
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(null);
    const [currentMode, setCurrentMode] = useState("COMP");
    const [isModeMenuOpen, setIsModeMenuOpen] = useState(false);
    const [isSetupMenuOpen, setIsSetupMenuOpen] = useState(false);
    const [config, setConfig] = useState({
        display: 'MthIO',
        angle: 'Deg',
        format: 'Norm',
        normType: 1, // Norm 1 (0.01 threshold) or Norm 2 (0.000000001 threshold)
        precision: 9
    });
    const [setupSubState, setSetupSubState] = useState(null); // 'fix_prompt' | 'sci_prompt' | 'norm_prompt'
    const [isPoweredOff, setIsPoweredOff] = useState(false);
    const [showStartup, setShowStartup] = useState(false);
    const [fractionMode, setFractionMode] = useState("improper"); // "improper" or "mixed"

    // Mode Settings
    const [currentBase, setCurrentBase] = useState("DEC"); // For BASE-N mode

    // CALC / SOLVE States
    const [isPrompting, setIsPrompting] = useState(false);
    const [promptVar, setPromptVar] = useState(null);
    const [promptInput, setPromptInput] = useState("");
    const [promptList, setPromptList] = useState([]);
    const [promptIndex, setPromptIndex] = useState(0);
    const [isSolving, setIsSolving] = useState(false);
    const [promptResult, setPromptResult] = useState("");

    const handlePercentage = () => {
        try {
            const valToCheck = isComplete ? lastAnswer : expression;
            if (valToCheck === "") return;

            let value = parseFloat(valToCheck.toString().replace(/×/g, "*").replace(/÷/g, "/"));
            if (isNaN(value)) return;

            let res = Number((value / 100).toPrecision(10));
            setResult(res.toString());
            setLastAnswer(res.toString());
            setIsComplete(true);
        } catch (error) {
            setResult("Math ERROR");
        }
    };

    const handleOpenBracket = () => {
        try {
            if (isComplete) {
                setExpression("(");
                setCursorPosition(1);
                setResult("");
                setIsComplete(false);
            } else {
                setExpression(prev => prev.slice(0, cursorPosition) + "(" + prev.slice(cursorPosition));
                setCursorPosition(prev => prev + 1);
            }
        } catch (error) {
            setResult("Error");
        }
    };

    const handleCloseBracket = () => {
        try {
            if (isComplete) {
                setExpression(")");
                setCursorPosition(1);
                setResult("");
                setIsComplete(false);
            } else {
                setExpression(prev => prev.slice(0, cursorPosition) + ")" + prev.slice(cursorPosition));
                setCursorPosition(prev => prev + 1);
            }
        } catch (error) {
            setResult("Error");
        }
    };

    const handleComma = () => {
        try {
            if (isComplete) {
                setExpression(",");
                setCursorPosition(1);
                setResult("");
                setIsComplete(false);
            } else {
                setExpression(prev => prev.slice(0, cursorPosition) + "," + prev.slice(cursorPosition));
                setCursorPosition(prev => prev + 1);
            }
        } catch (error) {
            setResult("Error");
        }
    };

    const handleVariableX = () => {
        try {
            if (isComplete) {
                setExpression("X");
                setCursorPosition(1);
                setResult("");
                setIsComplete(false);
            } else {
                setExpression(prev => prev.slice(0, cursorPosition) + "X" + prev.slice(cursorPosition));
                setCursorPosition(prev => prev + 1);
            }
        } catch (error) {
            setResult("Error");
        }
    };

    const handleMemoryUpdate = (sign) => {
        try {
            let valueToAdd = 0;
            if (isComplete) {
                valueToAdd = parseFloat(lastAnswer) || 0;
            } else if (expression.trim() === "") {
                valueToAdd = parseFloat(lastAnswer) || 0;
            } else {
                // Perform evaluation same as '=' button
                try {
                    const processed = processForEval(expression, variables, config.angle);
                    if (processed === "Syntax ERROR") {
                        setResult("Syntax ERROR");
                        setIsComplete(true);
                        return;
                    }
                    const mathNames = Object.getOwnPropertyNames(Math).filter(name => typeof Math[name] === 'function');
                    const mathFuncs = mathNames.reduce((acc, name) => { acc[name] = Math[name]; return acc; }, {});
                    const safeTan = (x) => { const res = Math.tan(x); return Math.abs(res) > 1e14 ? Infinity : res; };

                    const scope = {
                        ...mathFuncs, Math: Math, log: Math.log10, log10: Math.log10, ln: Math.log, tan: safeTan,
                        ...variables, Ans: lastAnswer || 0
                    };
                    const keys = Object.keys(scope);
                    const evalFn = new Function(...keys, `return (${processed});`);
                    const res = evalFn(...keys.map(k => scope[k]));
                    valueToAdd = (typeof res === 'number' && !isNaN(res) && isFinite(res)) ? res : 0;

                    setLastAnswer(valueToAdd);
                    setHistory(prev => [...prev, expression]);
                    setResult(formatValue(valueToAdd, config));
                    setIsComplete(true);
                } catch (e) {
                    setResult("Math ERROR");
                    setIsComplete(true);
                    return;
                }
            }

            const currentM = variables.M || 0;
            const newM = sign === 'plus' ? currentM + valueToAdd : currentM - valueToAdd;
            setVariables(prev => ({ ...prev, M: newM }));
        } catch (error) {
            setResult("Error");
        }
    };

    const handleAC = () => {
        try {
            setExpression("");
            setResult("");
            setIsComplete(false);
            setIsStoActive(false);
            setIsModeMenuOpen(false);
            setIsSetupMenuOpen(false);
            setIsPrompting(false);
            setIsSolving(false);
            setCursorPosition(0);
            setHistoryIndex(null);
            setIsAlphaActive(false);
            setIsShiftActive(false);
            setPromptResult("");
            setPromptInput("");

            // Matrix State Resets
            setIsMatrixCalcMode(false);
            setMatrixExpr("");
            setMatrixSubState(null);
            setMatrixEntry(null);
            setActiveMatrixSlot(null);

            // STAT State Resets
            setStatType(null);
            setStatSubState(null);
            setStatData([]);
            setStatEntry({ editRow: 0, editCol: 0, inputBuf: "" });
            // Setup
            setSetupSubState(null);
        } catch (error) {
            setResult("Error");
        }
    };

    const handleOFF = () => {
        try {
            setIsPoweredOff(true);
            setIsShiftActive(false);
            setExpression("");
            setResult("");
        } catch (error) {
            setResult("Error");
        }
    };

    const handleDEL = () => {
        try {
            if (isComplete) {
                setExpression("");
                setResult("");
                setIsComplete(false);
                return;
            }
            if (cursorPosition > 0) {
                const charToDelete = expression[cursorPosition - 1];
                if (charToDelete === "," && (expression.includes("∫") || expression.includes("Σ") || expression.includes("f("))) {
                    setCursorPosition(prev => prev - 1);
                    return;
                }
                setExpression(prev => prev.slice(0, cursorPosition - 1) + prev.slice(cursorPosition));
                setCursorPosition(prev => prev - 1);
            }
        } catch (error) {
            setResult("Error");
        }
    };

    const handleINS = () => {
        try {
            setIsInsertMode(!isInsertMode);
        } catch (error) {
            setResult("Error");
        }
    };

    const handleCLR = (option) => {
        try {
            if (option === "1") { // Setup
                setConfig({ display: 'MthIO', angle: 'Deg', format: 'Norm', precision: 2 });
                setResult("Reset Setup");
                setIsComplete(true);
            } else if (option === "2") { // Memory
                setVariables({ A: null, B: null, C: null, D: null, E: null, F: null, X: null, Y: null, M: null });
                setLastAnswer(0);
                setResult("Reset Memory");
                setIsComplete(true);
            } else if (option === "3") { // All
                setConfig({ display: 'MthIO', angle: 'Deg', format: 'Norm', precision: 2 });
                setVariables({ A: null, B: null, C: null, D: null, E: null, F: null, X: null, Y: null, M: null });
                setCurrentMode("COMP");
                setCurrentBase("DEC");
                setExpression("");
                setResult("");
                setLastAnswer(0);
                setHistory([]);
                setHistoryIndex(null);
                setIsComplete(false);
                setMatrices({ A: null, B: null, C: null, Ans: null });
                setVectors({ A: null, B: null, C: null, Ans: null });
                // Reset specialized calc modes
                setIsMatrixCalcMode(false);
                setIsVectorCalcMode(false);
                setMatrixExpr("");
                setVectorExpr("");
            }
            setIsClrMenuOpen(false);
        } catch (error) {
            setResult("Error");
        }
    };

    const formatValue = (val, cfg) => {
        if (typeof val !== 'number' || isNaN(val) || !isFinite(val)) return val.toString();

        const { format, precision, normType } = cfg;

        // 1. Floating Point Noise Cleaning: Use a much smaller threshold (scientific constants go to 10^-34)
        const nInt = Math.round(val);
        // Only round to integer if it's extremely close relative to float precision, or if it's a "human" small integer
        let v = val;
        if (Math.abs(val) > 1e-10) {
            if (Math.abs(val - nInt) < 1e-13) v = nInt;
        } else {
            // For tiny values, only round if it's basically zero
            if (Math.abs(val) < 1e-45) v = 0;
        }

        // 2. Mode-specific handling
        if (format === 'Fix') return v.toFixed(precision);
        if (format === 'Sci') {
            let s = v.toExponential(precision === 0 ? 0 : precision - 1);
            return s.replace(/e\+?/, 'x10^').replace(/x10\^0+$/, ''); // Clean up x10^0
        }

        // 3. Default "Norm" Mode
        const absVal = Math.abs(v);
        // Casio standard: Norm 1 uses scientific for < 0.01, Norm 2 for < 1e-9
        const sciThreshold = (normType === 2) ? 1e-9 : 0.01;

        // Scientific notation for very small/large values
        if (v !== 0 && (absVal < sciThreshold || absVal >= 1e10)) {
            // Casio shows up to 10 significant digits
            let res = v.toExponential(9)
                .replace(/e\+?/, 'x10^')
                .replace(/\.?0+x10\^/, 'x10^');
            return res;
        }

        // Standard view: Maximum 10 significant digits
        // Use precision to avoid float artifacts like 0.30000000000000004
        let finalStr = Number(v.toPrecision(10)).toString();
        // If it still results in scientific notation from JS (e.g. 1e-7), convert it to Casio style
        return finalStr.replace(/e\+?/, 'x10^');
    };

    const handleButton = (btnOrLabel) => {
        const isObject = typeof btnOrLabel === 'object' && btnOrLabel !== null;
        let label = isObject ? btnOrLabel.main : btnOrLabel;

        // Determine active label early for prompt handling
        let activeLabel = label;
        if (isObject) {
            if (isShiftActive && btnOrLabel.gold) {
                activeLabel = btnOrLabel.gold;
            } else if ((isAlphaActive || isStoActive || currentMode === "BASE-N") && btnOrLabel.pink) {
                // In ALPHA, STO, or BASE-N mode, pink labels (DEC, HEX, BIN, OCT, A-F, Variables) are primary
                activeLabel = btnOrLabel.pink.replace(/[\[\]]/g, "");
            }
        }

        // 1. Global Modifier Keys (Work even in Prompts)
        if (label === "SHIFT") {
            setIsShiftActive(!isShiftActive);
            setIsAlphaActive(false);
            return;
        }
        if (label === "ALPHA") {
            setIsAlphaActive(!isAlphaActive);
            setIsShiftActive(false);
            return;
        }

        // 2. Power Logic (ON Button)
        if (label === "ON") {
            if (isPoweredOff) {
                setIsPoweredOff(false);
                setShowStartup(true);
                setTimeout(() => setShowStartup(false), 800);
                setCurrentMode("COMP");
            }
            setExpression("");
            setResult("");
            setIsComplete(false);
            setIsShiftActive(false);
            setIsAlphaActive(false);
            setIsStoActive(false);
            setCursorPosition(0);
            setIsModeMenuOpen(false);
            setIsSetupMenuOpen(false);
            setIsPrompting(false);
            setIsSolving(false);
            return;
        }

        // If calculator is OFF, ignore all other buttons
        if (isPoweredOff) return;

        // Base-N Digit Restrictions
        if (currentMode === "BASE-N") {
            const isDigit = /^[0-9]$/.test(label);
            const isAlphaAF = /^[A-F]$/.test(activeLabel);
            const isBaseSwitch = ["BIN", "OCT", "HEX", "DEC"].includes(activeLabel);

            // SPECIAL: Map the log_template button to BIN in BASE-N for convenience 
            // even if it doesn't have a pink label, since it contains the word "log"
            const isLogTemplate = !isObject ? false : (btnOrLabel.main?.includes("log<sub>") || btnOrLabel.main === "log");

            if (isBaseSwitch || isAlphaAF || (isLogTemplate && !isAlphaActive && !isShiftActive)) {
                // Allow base switching and HEX letters to proceed immediately
                if (isAlphaAF && currentBase !== "HEX") return; // But only A-F in HEX mode
            } else {
                if (isDigit) {
                    const digit = parseInt(label);
                    if (currentBase === "BIN" && digit > 1) return;
                    if (currentBase === "OCT" && digit > 7) return;
                }

                // Block scientific templates that aren't allowed in BASE-N
                const blockedFuncs = ["sin", "cos", "tan", "hyp", "log", "ln", "√", "frac", "integral", "Σ", "Pol", "Rec", "°", "•"];
                if (blockedFuncs.some(b => label.toLowerCase().includes(b.toLowerCase()))) {
                    return;
                }
            }
        }

        // Handle SHIFT + AC (OFF function)
        if (isShiftActive && label === "AC") {
            handleOFF();
            return;
        }

        // 3. Handle Prompts (CALC / SOLVE Variable Input)
        if (isPrompting) {
            // In CALC/SOLVE prompt, `=` or right arrow `▶` calculates the result / goes to the next variable
            if (label === "=" || activeLabel === "SOLVE" || activeLabel === "CALC" || label === "▶") {
                const val = promptInput === "" ? variables[promptVar] : parseFloat(promptInput);
                const updatedVars = { ...variables, [promptVar]: val };
                setVariables(updatedVars);

                if (isSolving) {
                    if (promptIndex < promptList.length - 1) {
                        const nextIdx = promptIndex + 1;
                        setPromptIndex(nextIdx);
                        setPromptVar(promptList[nextIdx]);
                        setPromptInput("");
                        setPromptResult("");
                    } else {
                        setIsPrompting(false);
                        executeSolve(updatedVars);
                    }
                } else {
                    if (promptIndex < promptList.length - 1) {
                        const nextIdx = promptIndex + 1;
                        setPromptIndex(nextIdx);
                        setPromptVar(promptList[nextIdx]);
                        setPromptInput("");
                        setPromptResult("");
                    } else {
                        // CALC Mode: Instant Result
                        try {
                            if (expression.includes("‡")) {
                                setPromptResult("Syntax ERROR");
                            } else {
                                try {
                                    const processed = processForEval(expression, updatedVars, config.angle);
                                    const mathNames = Object.getOwnPropertyNames(Math).filter(name => typeof Math[name] === 'function');
                                    const mathFuncs = mathNames.reduce((acc, name) => {
                                        acc[name] = Math[name];
                                        return acc;
                                    }, {});
                                    const angleFactor = config.angle === 'Rad' ? 1 : (config.angle === 'Deg' ? Math.PI / 180 : Math.PI / 200);
                                    const nearZero = (v) => Math.abs(v) < 1e-15 ? 0 : v;
                                    const scope = {
                                        ...mathFuncs,
                                        Math: Math,
                                        PI: Math.PI,
                                        E: Math.E,
                                        log: Math.log10,
                                        log10: Math.log10,
                                        ln: Math.log,
                                        sin: (x) => nearZero(Math.sin(x * angleFactor)),
                                        cos: (x) => nearZero(Math.cos(x * angleFactor)),
                                        tan: (x) => {
                                            let r = Math.tan(x * angleFactor);
                                            return Math.abs(r) > 1e14 ? Infinity : r;
                                        },
                                        asin: (x) => {
                                            if (x < -1 || x > 1) throw new Error("Math ERROR");
                                            const res = Math.asin(x);
                                            return config.angle === 'Deg' ? res * (180 / Math.PI) : (config.angle === 'Gra' ? res * (200 / Math.PI) : res);
                                        },
                                        acos: (x) => {
                                            if (x < -1 || x > 1) throw new Error("Math ERROR");
                                            const res = Math.acos(x);
                                            return config.angle === 'Deg' ? res * (180 / Math.PI) : (config.angle === 'Gra' ? res * (200 / Math.PI) : res);
                                        },
                                        atan: (x) => {
                                            const res = Math.atan(x);
                                            return config.angle === 'Deg' ? res * (180 / Math.PI) : (config.angle === 'Gra' ? res * (200 / Math.PI) : res);
                                        },
                                        sinh: (x) => Math.sinh(x),
                                        cosh: (x) => Math.cosh(x),
                                        tanh: (x) => Math.tanh(x),
                                        asinh: (x) => Math.asinh(x),
                                        acosh: (x) => Math.acosh(x),
                                        atanh: (x) => Math.atanh(x),
                                        abs: (x) => Math.abs(x),
                                        Abs: (x) => Math.abs(x),
                                        ...updatedVars,
                                        Ans: lastAnswer || 0,
                                        RanSharp: () => Math.floor(Math.random() * 1000) / 1000,
                                        RanInt: (a, b) => Math.floor(Math.random() * (b - a + 1)) + a
                                    };
                                    const scopeKeys = Object.keys(scope);
                                    const scopeVals = scopeKeys.map(k => scope[k]);
                                    const evalFn = new Function(...scopeKeys, `return (${processed});`);
                                    const res = evalFn(...scopeVals);
                                    if (typeof res !== 'number' || isNaN(res) || !isFinite(res)) {
                                        setPromptResult(res === undefined ? "0" : res.toString());
                                    } else {
                                        setPromptResult(formatValue(res, config));
                                    }
                                } catch (e) {
                                    setPromptResult("NaN");
                                }
                            }
                        } catch (e) {
                            setPromptResult("ERROR");
                        }
                    }
                }
            } else if (/^[0-9•\-\.]$/.test(label) || activeLabel === "(-)") {
                const char = activeLabel === "(-)" ? "-" : (label === "•" ? "." : label);
                setPromptInput(prev => prev + char);
            } else if (label === "DEL") {
                setPromptInput(prev => prev.slice(0, -1));
            } else if (label === "AC") {
                setIsPrompting(false);
                setIsSolving(false);
                setPromptResult("");
            }
            return;
        }

        if (isHypMenuOpen) {
            const hypMap = {
                "1": "sinh(", "2": "cosh(", "3": "tanh(",
                "4": "asinh(", "5": "acosh(", "6": "atanh("
            };
            if (hypMap[label]) {
                const char = hypMap[label];
                setExpression(prev => prev.slice(0, cursorPosition) + char + prev.slice(cursorPosition));
                setCursorPosition(prev => prev + char.length);
                setIsHypMenuOpen(false);
            } else if (label === "AC") {
                setIsHypMenuOpen(false);
            } else {
                setIsHypMenuOpen(false);
            }
            return;
        }

        // Handle Setup Menu selection
        if (isSetupMenuOpen) {
            if (setupSubState === 'fix_prompt') {
                if (/^[0-9]$/.test(label)) {
                    setConfig(prev => ({ ...prev, format: 'Fix', precision: parseInt(label) }));
                    setIsSetupMenuOpen(false);
                    setSetupSubState(null);
                } else if (label === "AC") {
                    setIsSetupMenuOpen(false);
                    setSetupSubState(null);
                }
                return;
            }
            if (setupSubState === 'sci_prompt') {
                if (/^[0-9]$/.test(label)) {
                    setConfig(prev => ({ ...prev, format: 'Sci', precision: parseInt(label) || 1 }));
                    setIsSetupMenuOpen(false);
                    setSetupSubState(null);
                } else if (label === "AC") {
                    setIsSetupMenuOpen(false);
                    setSetupSubState(null);
                }
                return;
            }
            if (setupSubState === 'norm_prompt') {
                if (label === "1" || label === "2") {
                    setConfig(prev => ({ ...prev, format: 'Norm', normType: parseInt(label) }));
                    setIsSetupMenuOpen(false);
                    setSetupSubState(null);
                } else if (label === "AC") {
                    setIsSetupMenuOpen(false);
                    setSetupSubState(null);
                }
                return;
            }

            const setupMap = {
                "1": { display: 'MthIO' },
                "2": { display: 'LineIO' },
                "3": { angle: 'Deg' },
                "4": { angle: 'Rad' },
                "5": { angle: 'Gra' }
            };

            if (label === "6") { setSetupSubState('fix_prompt'); return; }
            if (label === "7") { setSetupSubState('sci_prompt'); return; }
            if (label === "8") { setSetupSubState('norm_prompt'); return; }

            if (setupMap[label]) {
                setConfig(prev => ({ ...prev, ...setupMap[label] }));
                setIsSetupMenuOpen(false);
            } else if (label === "AC") {
                setIsSetupMenuOpen(false);
            }
            return;
        }

        // Handle Mode Menu selection
        if (isModeMenuOpen) {
            const modeMap = {
                "1": "COMP", "2": "CMPLX", "3": "STAT", "4": "BASE-N",
                "5": "EQN", "6": "MATRIX", "7": "VECTOR"
            };
            if (modeMap[label]) {
                const mode = modeMap[label];
                setCurrentMode(mode);
                setIsModeMenuOpen(false);
                if (mode === "STAT") {
                    setIsStatMenuOpen(true);
                    setStatType(null);
                    setStatSubState(null);
                }
                setExpression("");
                setResult("");
                setCursorPosition(0);
                setIsShiftActive(false);
                setIsAlphaActive(false);
            }
            if (label === "AC") setIsModeMenuOpen(false);
            return;
        }

        // Handle CLR Menu selection
        if (isClrMenuOpen) {
            if (["1", "2", "3"].includes(label)) {
                handleCLR(label);
            } else if (label === "AC") {
                setIsClrMenuOpen(false);
            }
            return;
        }

        // 1. Modifier Key & Navigation Logic
        if (label === "MODE") {
            if (isShiftActive) {
                setIsSetupMenuOpen(true);
                setIsShiftActive(false);
            } else {
                setIsModeMenuOpen(true);
            }
            setIsAlphaActive(false);
            return;
        }

        // Navigation (Arrows)
        if (["▲", "▼", "◀", "▶"].includes(label)) {
            // If we are in a data entry mode (Matrix, STAT, Vector), skip the general expression navigation
            // so that the specific mode-handling blocks further down can process the arrow keys.
            const isDataEntry = (isMatrixMenuOpen && (matrixSubState === 'data_entry' || matrixSubState === 'data_select')) ||
                (isStatMenuOpen && (statSubState === 'data_entry' || statSubState === 'data_select')) ||
                (isVectorMenuOpen && (vectorSubState === 'data_entry' || vectorSubState === 'data_select'));

            if (!isDataEntry) {
                setIsAlphaActive(false); // Arrow cancels ALPHA
                if (isShiftActive) { /* Handle Shift + Arrow if needed */ }

                if (["◀", "▶"].includes(label)) {
                    if (isComplete) {
                        setIsComplete(false);
                        setResult("");
                        // In Casio: ◀ goes to end, ▶ goes to start
                        setCursorPosition(label === "◀" ? expression.length : 0);
                        return;
                    }
                }

                if (["◀", "▶", "▲", "▼"].includes(label)) {
                    let inTemplate = false;
                    if (label === "▲" || label === "▼") {
                        for (let i = 0; i < expression.length; i++) {
                            if (expression.substring(i, i + 2) === "∫(") {
                                const end = expression.indexOf(")", i);
                                if (end !== -1) {
                                    const inner = expression.substring(i + 2, end);
                                    const parts = inner.split("‡");
                                    if (parts.length >= 3) {
                                        const intStart = i + 2;
                                        const intEnd = intStart + parts[0].length;
                                        const lowStart = intEnd + 1;
                                        const lowEnd = lowStart + parts[1].length;
                                        const upStart = lowEnd + 1;
                                        const upEnd = upStart + parts[2].length;

                                        if (label === "▲") {
                                            // Integrand -> Upper Limit
                                            if (cursorPosition >= intStart && cursorPosition <= intEnd) {
                                                setCursorPosition(upEnd);
                                                inTemplate = true; break;
                                            }
                                            // Lower Limit -> Integrand
                                            else if (cursorPosition >= lowStart && cursorPosition <= lowEnd) {
                                                setCursorPosition(intEnd);
                                                inTemplate = true; break;
                                            }
                                        } else if (label === "▼") {
                                            // Integrand -> Lower Limit
                                            if (cursorPosition >= intStart && cursorPosition <= intEnd) {
                                                setCursorPosition(lowEnd);
                                                inTemplate = true; break;
                                            }
                                            // Upper Limit -> Integrand
                                            else if (cursorPosition >= upStart && cursorPosition <= upEnd) {
                                                setCursorPosition(intEnd);
                                                inTemplate = true; break;
                                            }
                                        }
                                    }
                                }
                            }
                            if (expression.substring(i, i + 2) === "Σ(") {
                                const end = expression.indexOf(")", i + 1);
                                if (end !== -1) {
                                    const inner = expression.substring(i + 2, end);
                                    const parts = inner.split("‡");
                                    if (parts.length >= 3) {
                                        const intStart = i + 2;
                                        const intEnd = intStart + parts[0].length;
                                        const lowStart = intEnd + 1;
                                        const lowEnd = lowStart + parts[1].length;
                                        const upStart = lowEnd + 1;
                                        const upEnd = upStart + parts[2].length;

                                        if (label === "▲") {
                                            if (cursorPosition >= intStart && cursorPosition <= intEnd) { setCursorPosition(upEnd); inTemplate = true; break; }
                                            else if (cursorPosition >= lowStart && cursorPosition <= lowEnd) { setCursorPosition(intEnd); inTemplate = true; break; }
                                        } else if (label === "▼") {
                                            if (cursorPosition >= intStart && cursorPosition <= intEnd) { setCursorPosition(lowEnd); inTemplate = true; break; }
                                            else if (cursorPosition >= upStart && cursorPosition <= upEnd) { setCursorPosition(intEnd); inTemplate = true; break; }
                                        }
                                    }
                                }
                            }
                            if (expression.substring(i, i + 5) === "d/dX(") {
                                const end = expression.indexOf(")", i + 4);
                                if (end !== -1) {
                                    const inner = expression.substring(i + 5, end);
                                    const parts = inner.split("‡");
                                    if (parts.length >= 2) {
                                        const intStart = i + 5;
                                        const intEnd = intStart + parts[0].length;
                                        const valStart = intEnd + 1;
                                        const valEnd = valStart + parts[1].length;

                                        if (label === "▲" || label === "▶") {
                                            if (cursorPosition >= intStart && cursorPosition <= intEnd) { setCursorPosition(valEnd); inTemplate = true; break; }
                                        } else if (label === "▼" || label === "◀") {
                                            if (cursorPosition >= valStart && cursorPosition <= valEnd) { setCursorPosition(intEnd); inTemplate = true; break; }
                                        }
                                    }
                                }
                            }
                            if (expression.substring(i, i + 4) === "log(") {
                                const end = expression.indexOf(")", i + 3);
                                if (end !== -1 && expression.substring(i, end).includes("‡")) {
                                    const inner = expression.substring(i + 4, end);
                                    const parts = inner.split("‡");
                                    if (parts.length >= 2) {
                                        const baseStart = i + 4;
                                        const baseEnd = baseStart + parts[0].length;
                                        const valStart = baseEnd + 1;
                                        const valEnd = valStart + parts[1].length;

                                        if (label === "▶" || label === "▼") {
                                            if (cursorPosition >= baseStart && cursorPosition <= baseEnd) { setCursorPosition(valEnd); inTemplate = true; break; }
                                        } else if (label === "◀" || label === "▲") {
                                            if (cursorPosition >= valStart && cursorPosition <= valEnd) { setCursorPosition(baseEnd); inTemplate = true; break; }
                                        }
                                    }
                                }
                            }
                            if (expression.substring(i, i + 2) === "q(") {
                                const end = expression.indexOf(")", i + 1);
                                if (end !== -1 && expression.substring(i, end).includes("‡")) {
                                    const inner = expression.substring(i + 2, end);
                                    const parts = inner.split("‡");
                                    if (parts.length >= 2) {
                                        const numStart = i + 2;
                                        const numEnd = numStart + parts[0].length;
                                        const denStart = numEnd + 1;
                                        const denEnd = denStart + parts[1].length;

                                        if (label === "▲") {
                                            if (cursorPosition >= denStart && cursorPosition <= denEnd) { setCursorPosition(numEnd); inTemplate = true; break; }
                                        } else if (label === "▼") {
                                            if (cursorPosition >= numStart && cursorPosition <= numEnd) { setCursorPosition(denEnd); inTemplate = true; break; }
                                        }
                                    }
                                }
                            }
                            if (expression.substring(i, i + 3) === "mf(") {
                                const end = expression.indexOf(")", i + 2);
                                if (end !== -1 && expression.substring(i, end).includes("‡")) {
                                    const inner = expression.substring(i + 3, end);
                                    const parts = inner.split("‡");
                                    if (parts.length >= 3) {
                                        const wStart = i + 3;
                                        const wEnd = wStart + parts[0].length;
                                        const numStart = wEnd + 1;
                                        const numEnd = numStart + parts[1].length;
                                        const denStart = numEnd + 1;
                                        const denEnd = denStart + parts[2].length;

                                        if (label === "▲") {
                                            if (cursorPosition >= denStart && cursorPosition <= denEnd) { setCursorPosition(numEnd); inTemplate = true; break; }
                                        } else if (label === "▼") {
                                            if (cursorPosition >= numStart && cursorPosition <= numEnd) { setCursorPosition(denEnd); inTemplate = true; break; }
                                            else if (cursorPosition >= wStart && cursorPosition <= wEnd) { setCursorPosition(numEnd); inTemplate = true; break; }
                                        } else if (label === "▶") {
                                            if (cursorPosition >= wStart && cursorPosition <= wEnd) { setCursorPosition(numEnd); inTemplate = true; break; }
                                        } else if (label === "◀") {
                                            if (cursorPosition >= numStart && cursorPosition <= numEnd) { setCursorPosition(wEnd); inTemplate = true; break; }
                                            else if (cursorPosition >= denStart && cursorPosition <= denEnd) { setCursorPosition(wEnd); inTemplate = true; break; }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    if (inTemplate) {
                        setIsShiftActive(false);
                        return;
                    }

                    if (label === "◀") {
                        setCursorPosition(prev => Math.max(0, prev - 1));
                    } else if (label === "▶") {
                        setCursorPosition(prev => Math.min(expression.length, prev + 1));
                    } else if (label === "▲") {
                        if (history.length > 0) {
                            const newIndex = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
                            setHistoryIndex(newIndex);
                            setExpression(history[newIndex]);
                            setCursorPosition(history[newIndex].length);
                            setIsComplete(false);
                        }
                    } else if (label === "▼") {
                        if (historyIndex !== null) {
                            if (historyIndex < history.length - 1) {
                                const newIndex = historyIndex + 1;
                                setHistoryIndex(newIndex);
                                setExpression(history[newIndex]);
                                setCursorPosition(history[newIndex].length);
                            } else {
                                setHistoryIndex(null);
                                setExpression("");
                                setCursorPosition(0);
                            }
                        }
                    }
                    setIsShiftActive(false);
                    return;
                }
            }
        }

        // Determine effective action already calculated above
        const consumeModifiers = () => {
            setIsShiftActive(false);
            setIsAlphaActive(false);
        };

        // CALC Mode
        if (activeLabel === "CALC") {
            const varsInExpr = Object.keys(variables).filter(v => expression.match(new RegExp("(?<![a-zA-Z])" + v + "(?![a-zA-Z])", "g")));
            if (varsInExpr.length > 0) {
                setIsPrompting(true);
                setPromptList(varsInExpr);
                setPromptIndex(0);
                setPromptVar(varsInExpr[0]);
                setPromptInput("");
                setIsSolving(false);
                setPromptResult("");
            } else {
                handleButton("=");
            }
            consumeModifiers();
            return;
        }

        // SOLVE Mode (SHIFT + CALC)
        if (activeLabel === "SOLVE") {
            if (!expression.includes("=")) {
                setResult("Syntax ERROR");
                setIsComplete(true);
                consumeModifiers();
                return;
            }
            // Transition to SOLVE prompt
            const varsInExpr = Object.keys(variables).filter(v => expression.match(new RegExp("(?<![a-zA-Z])" + v + "(?![a-zA-Z])", "g")));
            const list = varsInExpr.includes("X")
                ? [...varsInExpr.filter(v => v !== "X"), "X"]
                : [...varsInExpr, "X"];

            setIsPrompting(true);
            setPromptList(list);
            setPromptIndex(0);
            setPromptVar(list[0]);
            setPromptInput("");
            setIsSolving(true);
            setPromptResult("");
            consumeModifiers();
            return;
        }

        // 2. STO (Storage) Mode
        if (activeLabel === "STO") {
            setIsStoActive(true);
            setIsRclActive(false);
            consumeModifiers();
            return;
        }

        // 2b. RCL (Recall) Mode
        if (activeLabel === "RCL") {
            setIsRclActive(true);
            setIsStoActive(false);
            consumeModifiers();
            return;
        }

        if (isStoActive || isRclActive) {
            let varName = activeLabel;
            const labelToVar = {
                "(-)": "A", "°'\"": "B", "hyp": "C", "sin": "D", "cos": "E", "tan": "F",
                "[A]": "A", "[B]": "B", "[C]": "C", "[D]": "D", "[E]": "E", "[F]": "F",
                "[X]": "X", "[Y]": "Y", "[M]": "M", "X": "X", "Y": "Y", "M": "M"
            };
            if (labelToVar[varName]) varName = labelToVar[varName];

            if (variables.hasOwnProperty(varName)) {
                if (isStoActive) {
                    let valToStore = 0;
                    if (isComplete) {
                        valToStore = parseFloat(result);
                    } else if (expression.trim() !== "") {
                        // Capture current input if not empty
                        const parsed = parseFloat(expression.replace(/×/g, "*").replace(/÷/g, "/"));
                        valToStore = isNaN(parsed) ? 0 : parsed;
                    } else {
                        valToStore = parseFloat(lastAnswer) || 0;
                    }

                    const numVal = isNaN(valToStore) ? 0 : valToStore;
                    setVariables(prev => ({ ...prev, [varName]: numVal }));
                    setResult(`${varName} = ${numVal}`);
                    setExpression(""); // Clear top line
                    setIsComplete(true); // Show confirmation in result line
                    setIsStoActive(false);
                } else if (isRclActive) {
                    const valToRecall = variables[varName] !== null ? variables[varName].toString() : "0";
                    setExpression(prev => prev.slice(0, cursorPosition) + valToRecall + prev.slice(cursorPosition));
                    setCursorPosition(prev => prev + valToRecall.length);
                    setIsRclActive(false);
                }
                consumeModifiers();
                return;
            }
            // If they press a non-variable button, cancel the mode
            if (!["SHIFT", "ALPHA"].includes(label)) {
                setIsStoActive(false);
                setIsRclActive(false);
            }
        }

        // ── MODE MENU TRIGGERS ────────────────────────────────────────────────
        if (activeLabel === "[MATRIX]" && currentMode === "MATRIX") {
            setIsMatrixMenuOpen(true); setMatrixSubState(null);
            consumeModifiers(); return;
        }
        if (activeLabel === "[VECTOR]" && currentMode === "VECTOR") {
            setIsVectorMenuOpen(true); setVectorSubState(null);
            consumeModifiers(); return;
        }

        // ── MATRIX MENU HANDLING ──────────────────────────────────────────────
        if (isMatrixMenuOpen && !matrixSubState) {
            const matFuncMap = { "1": "dim_select", "2": "data_select" };
            if (matFuncMap[label]) setMatrixSubState(matFuncMap[label]);
            else if (["3", "4", "5", "6"].includes(label)) {
                const slot = { "3": "A", "4": "B", "5": "C", "6": "Ans" }[label];
                setMatrixExpr(p => p + `Mat${slot}`);
                setIsMatrixCalcMode(true); setIsMatrixMenuOpen(false);
            } else if (label === "7") { setMatrixExpr(p => p + "Det("); setIsMatrixCalcMode(true); setIsMatrixMenuOpen(false); }
            else if (label === "8") { setMatrixExpr(p => p + "Trn("); setIsMatrixCalcMode(true); setIsMatrixMenuOpen(false); }
            else if (label === "9") setMatrixSubState("more_select");
            else if (label === "AC") setIsMatrixMenuOpen(false);
            return;
        }
        if (isMatrixMenuOpen && matrixSubState === 'more_select') {
            const moreMap = { "1": "Rank(", "2": "Trace(", "3": "LU_L(", "4": "LU_U(", "5": "Inv(" };
            if (moreMap[label]) {
                setMatrixExpr(p => p + moreMap[label]);
                setIsMatrixCalcMode(true); setIsMatrixMenuOpen(false); setMatrixSubState(null);
            } else if (label === "AC") setMatrixSubState(null);
            return;
        }
        if (isMatrixMenuOpen && matrixSubState === 'dim_select') {
            if (["1", "2", "3"].includes(label)) { setActiveMatrixSlot({ "1": "A", "2": "B", "3": "C" }[label]); setMatrixSubState('dim_size_select'); }
            else if (label === "AC") { setIsMatrixMenuOpen(false); setMatrixSubState(null); }
            return;
        }
        if (isMatrixMenuOpen && matrixSubState === 'dim_size_select') {
            const sizeMap = {
                "1": [3, 3], "2": [3, 2], "3": [3, 1],
                "4": [2, 3], "5": [2, 2], "6": [2, 1]
            };
            if (sizeMap[label]) {
                const [rows, cols] = sizeMap[label];
                setMatrixEntry({ rows, cols, data: Array(rows).fill(0).map(() => Array(cols).fill(0)), editRow: 0, editCol: 0, inputBuf: "" });
                setMatrixSubState('data_entry');
            } else if (label === "▲") setMatrixSubState('dim_select'); // Up Arrow to go back
            else if (label === "AC") { setIsMatrixMenuOpen(false); setMatrixSubState(null); }
            return;
        }
        if (isMatrixMenuOpen && (matrixSubState === 'data_entry' || matrixSubState === 'data_select')) {
            if (matrixSubState === 'data_select') {
                const slotMap = { "1": "A", "2": "B", "3": "C" };
                if (slotMap[label]) {
                    const s = slotMap[label]; setActiveMatrixSlot(s);
                    if (!matrices[s]) setMatrixSubState('dim_size_select');
                    else { setMatrixEntry({ rows: matrices[s].length, cols: matrices[s][0].length, data: matrices[s].map(r => [...r]), editRow: 0, editCol: 0, inputBuf: "" }); setMatrixSubState('data_entry'); }
                } else if (label === "AC") { setIsMatrixMenuOpen(false); setMatrixSubState(null); }
            } else if (matrixEntry) {
                if (/^[0-9.]$/.test(label) || label === "(-)") {
                    setMatrixEntry(p => ({ ...p, inputBuf: p.inputBuf + (label === "(-)" ? "-" : label) }));
                } else if (label === "DEL") {
                    if (matrixEntry.inputBuf !== "") {
                        setMatrixEntry(p => ({ ...p, inputBuf: p.inputBuf.slice(0, -1) }));
                    } else {
                        // Clear the whole cell if buffer is empty
                        const newData = matrixEntry.data.map((r, i) => i === matrixEntry.editRow ? r.map((c, j) => j === matrixEntry.editCol ? 0 : c) : r);
                        setMatrixEntry(p => ({ ...p, data: newData }));
                    }
                } else if (label === "=" || label === "▶" || label === "▼") {
                    const val = parseFloat(matrixEntry.inputBuf || (matrixEntry.data[matrixEntry.editRow][matrixEntry.editCol]));
                    const newData = matrixEntry.data.map((r, i) => i === matrixEntry.editRow ? r.map((c, j) => j === matrixEntry.editCol ? val : c) : r);

                    let nR = matrixEntry.editRow, nC = matrixEntry.editCol;
                    if (label === "=" || label === "▶") {
                        nC++;
                        if (nC >= matrixEntry.cols) { nC = 0; nR++; }
                    } else if (label === "▼") {
                        nR = Math.min(matrixEntry.rows - 1, nR + 1);
                    }

                    if (nR >= matrixEntry.rows && (label === "=" || label === "▶")) {
                        setMatrices(p => ({ ...p, [activeMatrixSlot]: newData })); setIsMatrixMenuOpen(false); setMatrixSubState(null); setMatrixEntry(null); setExpression(""); setResult(""); setIsComplete(true);
                    }
                    else setMatrixEntry(p => ({ ...p, data: newData, editRow: nR, editCol: nC, inputBuf: "" }));
                } else if (label === "◀" || label === "▲") {
                    let nR = matrixEntry.editRow, nC = matrixEntry.editCol;
                    if (label === "◀") {
                        nC--;
                        if (nC < 0) { nC = matrixEntry.cols - 1; nR = Math.max(0, nR - 1); }
                    } else if (label === "▲") {
                        if (nR === 0) { setMatrixSubState('dim_size_select'); setMatrixEntry(null); return; }
                        nR = Math.max(0, nR - 1);
                    }
                    setMatrixEntry(p => ({ ...p, editRow: nR, editCol: nC, inputBuf: "" }));
                } else if (label === "AC") {
                    setIsMatrixMenuOpen(false); setMatrixSubState(null); setMatrixEntry(null);
                } // Close menu
            }
            return;
        }



        // ── STAT DATA ENTRY HANDLING ──────────────────────────────────────────
        if (currentMode === "STAT" && statSubState === 'data_entry' && statEntry) {
            if (/^[0-9.]$/.test(label) || label === "(-)") {
                setStatEntry(p => ({ ...p, inputBuf: p.inputBuf + (label === "(-)" ? "-" : label) }));
            } else if (label === "DEL") {
                if (isShiftActive) {
                    // SHIFT + DEL: Delete the current row
                    if (statData.length > 1) {
                        const newData = statData.filter((_, i) => i !== statEntry.editRow);
                        const nextRow = Math.min(statEntry.editRow, newData.length - 1);
                        setStatData(newData);
                        setStatEntry(p => ({ ...p, editRow: nextRow, inputBuf: "" }));
                    } else {
                        // Only one row left, just clear it
                        setStatData(statType === '1-VAR' ? [{ x: 0 }] : [{ x: 0, y: 0 }]);
                        setStatEntry(p => ({ ...p, inputBuf: "" }));
                    }
                    setIsShiftActive(false);
                } else if (statEntry.inputBuf !== "") {
                    setStatEntry(p => ({ ...p, inputBuf: p.inputBuf.slice(0, -1) }));
                } else {
                    // If buffer is empty, DEL should clear the actual cell value to 0
                    const newData = statData.map((d, i) => {
                        if (i === statEntry.editRow) {
                            return statType === '1-VAR' ? { x: 0 } : (statEntry.editCol === 0 ? { ...d, x: 0 } : { ...d, y: 0 });
                        }
                        return d;
                    });
                    setStatData(newData);
                }
            } else if (label === "=" || label === "▶" || label === "▼" || label === "▲" || label === "◀") {
                const val = parseFloat(statEntry.inputBuf || (statType === '1-VAR' ? statData[statEntry.editRow].x : (statEntry.editCol === 0 ? statData[statEntry.editRow].x : statData[statEntry.editRow].y)));

                const newData = statData.map((d, i) => {
                    if (i === statEntry.editRow) {
                        return statType === '1-VAR'
                            ? { x: val }
                            : (statEntry.editCol === 0 ? { ...d, x: val } : { ...d, y: val });
                    }
                    return d;
                });

                let nR = statEntry.editRow, nC = statEntry.editCol;
                if (label === "=" || label === "▶") {
                    if (statType === '1-VAR') nR++;
                    else {
                        nC++;
                        if (nC > 1) { nC = 0; nR++; }
                    }
                } else if (label === "◀") {
                    if (statType === '1-VAR') nR = Math.max(0, nR - 1);
                    else {
                        nC--;
                        if (nC < 0) {
                            if (nR > 0) { nC = 1; nR--; }
                            else nC = 0;
                        }
                    }
                } else if (label === "▼") nR++;
                else if (label === "▲") nR = Math.max(0, nR - 1);

                // Auto-expand if needed for going forward/down
                if (nR >= newData.length) {
                    newData.push(statType === '1-VAR' ? { x: 0 } : { x: 0, y: 0 });
                }

                setStatData(newData);
                setStatEntry(p => ({ ...p, editRow: nR, editCol: nC, inputBuf: "" }));
            } else if (label === "AC") {
                setStatSubState(null); // Return to calculation mode
                setIsStatMenuOpen(false); // Make sure the menu itself also visually closes
                setResult("STAT Calculated (Press SHIFT+1 for results)");
                setIsComplete(true);
            }
            return;
        }

        // ── STAT CALC MENU (SHIFT + 1) ────────────────────────────────────────
        if (activeLabel === "[STAT]") {
            setIsStatMenuOpen(true);
            consumeModifiers();
            return;
        }

        if (isStatMenuOpen && statSubState === null) {
            if (!statType) {
                const statMap = { "1": "1-VAR", "2": "A+BX" };
                if (statMap[label]) {
                    const type = statMap[label];
                    setStatType(type);
                    setStatData(Array(1).fill(0).map(() => (type === '1-VAR' ? { x: 0 } : { x: 0, y: 0 })));
                    setStatEntry({ editRow: 0, editCol: 0, inputBuf: "" });
                    setStatSubState('data_entry');
                } else if (label === "AC") setIsStatMenuOpen(false);
                return;
            }
            // Options: 1:Type 2:Data 3:Sum 4:Var 5:Reg
            if (label === "1") { setStatSubState(null); setStatType(null); } // Back to type selection
            else if (label === "2") { setStatSubState('data_entry'); }
            else if (label === "3") { setStatSubState('sum_menu'); }
            else if (label === "4") { setStatSubState('var_menu'); }
            else if (label === "5" && statType === 'A+BX') { setStatSubState('reg_menu'); }
            else if (label === "AC") setIsStatMenuOpen(false);
            return;
        }

        if (isStatMenuOpen && statSubState === 'sum_menu') {
            const stats = calculateStats();
            if (stats) {
                const maps = { "1": { v: stats.sumX2, l: "Σx²" }, "2": { v: stats.sumX, l: "Σx" }, "3": { v: stats.sumY, l: "Σy" }, "4": { v: stats.sumY2, l: "Σy²" }, "5": { v: stats.sumXY, l: "Σxy" } };
                const selection = maps[label];
                if (selection !== undefined) {
                    setResult(`${selection.l}=${selection.v.toString()}`);
                    setIsComplete(true);
                    setIsStatMenuOpen(false);
                    setStatSubState(null);
                }
            }
            if (label === "AC") setStatSubState(null);
            return;
        }

        if (isStatMenuOpen && (statSubState === 'var_menu' || statSubState === 'reg_menu')) {
            const stats = calculateStats();
            if (stats) {
                let val = null;
                let labelText = "";
                if (statSubState === 'var_menu') {
                    const maps = {
                        "1": { v: stats.n, l: "n" }, "2": { v: stats.meanX, l: "x̄" }, "3": { v: stats.stdX, l: "σx" }, "4": { v: stats.sX, l: "sx" },
                        "5": { v: stats.meanY, l: "ȳ" }, "6": { v: stats.stdY, l: "σy" }, "7": { v: stats.sY, l: "sy" }
                    };
                    if (maps[label]) { val = maps[label].v; labelText = maps[label].l; }
                } else {
                    const maps = { "1": { v: stats.a, l: "a" }, "2": { v: stats.b, l: "b" }, "3": { v: stats.r, l: "r" } };
                    if (maps[label]) { val = maps[label].v; labelText = maps[label].l; }
                }

                if (val !== null && val !== undefined) {
                    const formattedVal = val.toFixed(9).replace(/\.?0+$/, "");
                    setResult(`${labelText}=${formattedVal}`);
                    setIsComplete(true);
                    setIsStatMenuOpen(false);
                    setStatSubState(null);
                }
            }
            if (label === "AC") setStatSubState(null);
            return;
        }

        // ── DRG MENU (SHIFT + Ans) ────────────────────────────────────────────
        if (activeLabel === "DRG▶") {
            setIsDrgMenuOpen(true);
            consumeModifiers();
            return;
        }

        if (isDrgMenuOpen) {
            const drgMap = { "1": "°", "2": "ʳ", "3": "ᵍ" };
            if (drgMap[label]) {
                const char = drgMap[label];
                setExpression(prev => prev.slice(0, cursorPosition) + char + prev.slice(cursorPosition));
                setCursorPosition(prev => prev + char.length);
                setIsDrgMenuOpen(false);
            }
            if (label === "AC") setIsDrgMenuOpen(false);
            return;
        }

        // Handle CMPLX Menu selection
        if (isCmplxMenuOpen) {
            const cmplxMap = { "1": "arg(", "2": "Conjg(", "3": "Real(", "4": "Imag(", "5": "▶r∠θ", "6": "▶a+bi" };
            if (cmplxMap[label]) {
                const char = cmplxMap[label];
                setExpression(prev => prev.slice(0, cursorPosition) + char + prev.slice(cursorPosition));
                setCursorPosition(prev => prev + char.length);
                setIsCmplxMenuOpen(false);
            }
            if (label === "AC") setIsCmplxMenuOpen(false);
            return;
        }

        // Handle BASE Menu selection
        if (isBaseMenuOpen) {
            const baseMap = { "1": "and", "2": "or", "3": "xor", "4": "xnor", "5": "not", "6": "neg" };
            if (baseMap[label]) {
                const char = baseMap[label];
                setExpression(prev => prev.slice(0, cursorPosition) + char + prev.slice(cursorPosition));
                setCursorPosition(prev => prev + char.length);
                setIsBaseMenuOpen(false);
            }
            if (label === "AC") setIsBaseMenuOpen(false);
            return;
        }

        // ── VECTOR MENU HANDLING ──────────────────────────────────────────────
        if (isVectorMenuOpen && !vectorSubState) {
            // Main vector menu: 1:Dim 2:Data 3:VctA 4:VctB 5:VctC 6:VctAns 7:Dot
            if (label === "1") { // Dim
                setVectorSubState('dim_select');
            } else if (label === "2") { // Data — enter data for a previously dimensioned vector
                // Show sub-menu to pick which vector
                setVectorSubState('data_select');
            } else if (["3", "4", "5", "6"].includes(label)) {
                const slotMap = { "3": "A", "4": "B", "5": "C", "6": "Ans" };
                const slot = slotMap[label];
                // Insert VctX token into vector expression
                const tok = `Vct${slot}`;
                setVectorExpr(prev => prev + tok);
                setIsVectorCalcMode(true);
                setIsVectorMenuOpen(false);
                setVectorSubState(null);
            } else if (label === "7") { // Dot product
                setVectorExpr(prev => prev + "·");
                // Auto-reopen menu so user can immediately select next vector (VctB/C etc.)
                setIsVectorMenuOpen(true);
                setVectorSubState(null);
            } else if (label === "AC") {
                setIsVectorMenuOpen(false);
                setVectorSubState(null);
            }
            return;
        }

        // Sub-state: choose which vector to set dimension for
        if (isVectorMenuOpen && vectorSubState === 'dim_select') {
            const slotMap = { "1": "A", "2": "B", "3": "C" };
            if (slotMap[label]) {
                setActiveVectorSlot(slotMap[label]);
                setVectorSubState('dim_choose');
            } else if (label === "AC") {
                setIsVectorMenuOpen(false); setVectorSubState(null);
            }
            return;
        }

        // Sub-state: choose dimension 2 or 3
        if (isVectorMenuOpen && vectorSubState === 'dim_choose') {
            if (["2", "3"].includes(label)) {
                const dim = parseInt(label);
                setVectorDimPending(dim);
                setVectorEntry({ dim, elements: Array(dim).fill(""), editIdx: 0, inputBuf: "" });
                setVectorSubState('data_entry');
            } else if (label === "AC") {
                setIsVectorMenuOpen(false); setVectorSubState(null);
            }
            return;
        }

        // Sub-state: data select (pick which vector to enter data for)
        if (isVectorMenuOpen && vectorSubState === 'data_select') {
            const slotMap = { "1": "A", "2": "B", "3": "C" };
            if (slotMap[label]) {
                const slot = slotMap[label];
                const existing = vectors[slot];
                if (!existing) {
                    // No dimension set yet — ask for dimension
                    setActiveVectorSlot(slot);
                    setVectorSubState('dim_choose');
                } else {
                    // Re-enter data for existing vector
                    setActiveVectorSlot(slot);
                    setVectorEntry({ dim: existing.length, elements: existing.map(String), editIdx: 0, inputBuf: "" });
                    setVectorSubState('data_entry');
                }
            } else if (label === "AC") {
                setIsVectorMenuOpen(false); setVectorSubState(null);
            }
            return;
        }

        // Sub-state: data entry (user types each element then presses =)
        if (isVectorMenuOpen && vectorSubState === 'data_entry' && vectorEntry) {
            if (/^[0-9.]$/.test(label) || (label === "(-)" && vectorEntry.inputBuf === "")) {
                const ch = label === "(-)" ? "-" : label;
                setVectorEntry(prev => ({ ...prev, inputBuf: prev.inputBuf + ch }));
            } else if (label === "DEL") {
                if (vectorEntry.inputBuf !== "") {
                    setVectorEntry(prev => ({ ...prev, inputBuf: prev.inputBuf.slice(0, -1) }));
                } else {
                    // Clear the whole element if buffer is empty
                    const newElems = [...vectorEntry.elements];
                    newElems[vectorEntry.editIdx] = "0";
                    setVectorEntry(prev => ({ ...prev, elements: newElems }));
                }
            } else if (label === "=" || label === "▶") {
                // Confirm current element
                const val = parseFloat(vectorEntry.inputBuf) || 0;
                const newElems = [...vectorEntry.elements];
                newElems[vectorEntry.editIdx] = val;
                const nextIdx = vectorEntry.editIdx + 1;
                if (nextIdx >= vectorEntry.dim) {
                    // All elements entered — save vector
                    setVectors(prev => ({ ...prev, [activeVectorSlot]: newElems.map(Number) }));
                    setIsVectorMenuOpen(false);
                    setVectorSubState(null);
                    setVectorEntry(null);
                    setActiveVectorSlot(null);
                    setExpression("");
                    setResult("");
                    setIsComplete(true);
                } else {
                    setVectorEntry({ ...vectorEntry, elements: newElems, editIdx: nextIdx, inputBuf: String(newElems[nextIdx] || "") });
                }
            } else if (label === "AC") {
                setIsVectorMenuOpen(false); setVectorSubState(null); setVectorEntry(null);
            }
            return;
        }

        // ── VECTOR CALC MODE: operator & = handling ───────────────────────────
        if (isVectorCalcMode) {
            // SHIFT+5 = "[VECTOR]" → open vector menu to insert next token (VctA/B/C or dot)
            if (activeLabel === "[VECTOR]") {
                setIsVectorMenuOpen(true);
                setVectorSubState(null);
                consumeModifiers();
                return;
            }
            if (["+", "-", "×", "÷"].includes(label)) {
                setVectorExpr(prev => prev + label);
                // Re-open vector menu to pick next operand
                setIsVectorMenuOpen(true);
                setVectorSubState(null);
                return;
            } else if (/^[0-9.]$/.test(label)) {
                setVectorExpr(prev => prev + label);
                return;
            } else if (label === "DEL") {
                setVectorExpr(prev => prev.slice(0, -1));
                return;
            } else if (label === "=") {
                // Evaluate the vector expression
                const evalVec = (expr) => {
                    // Tokenize: VctA, VctB, VctC, VctAns, +, -, ×, numbers, ·
                    const tokens = expr.match(/Vct[ABC]|VctAns|[+\-×·]|π|e|\d+(\.\d+)?/g) || [];
                    const getVec = (name) => {
                        const slot = name.replace('Vct', '');
                        return vectors[slot];
                    };
                    const addVec = (a, b) => a.map((v, i) => v + b[i]);
                    const subVec = (a, b) => a.map((v, i) => v - b[i]);
                    const scalarMul = (v, s) => v.map(x => x * s);
                    const dotProd = (a, b) => a.reduce((sum, v, i) => sum + v * b[i], 0);
                    const crossProd = (a, b) => {
                        if (a.length === 3 && b.length === 3) {
                            return [
                                a[1] * b[2] - a[2] * b[1],
                                a[2] * b[0] - a[0] * b[2],
                                a[0] * b[1] - a[1] * b[0]
                            ];
                        }
                        if (a.length === 2 && b.length === 2) {
                            // 2D Cross product results in a scalar (z-component)
                            return a[0] * b[1] - a[1] * b[0];
                        }
                        return null;
                    };

                    let currentResult = null;
                    let currentOp = null;

                    for (let tok of tokens) {
                        let item = null;
                        if (tok.startsWith('Vct')) {
                            item = getVec(tok);
                            if (!item) return { error: `${tok} not defined` };
                        } else if (tok === 'π') {
                            item = Math.PI;
                        } else if (tok === 'e') {
                            item = Math.E;
                        } else if (!isNaN(parseFloat(tok))) {
                            item = parseFloat(tok);
                        } else {
                            currentOp = tok;
                            continue;
                        }

                        if (currentResult === null) {
                            currentResult = item;
                        } else {
                            // Implicit multiplication (e.g. VctA VctB) -> Cross product
                            if (!currentOp) currentOp = '×';

                            if (currentOp === '+') {
                                if (Array.isArray(currentResult) && Array.isArray(item)) {
                                    if (currentResult.length !== item.length) return { error: "Dim" };
                                    currentResult = addVec(currentResult, item);
                                } else return { error: "Math" };
                            } else if (currentOp === '-') {
                                if (Array.isArray(currentResult) && Array.isArray(item)) {
                                    if (currentResult.length !== item.length) return { error: "Dim" };
                                    currentResult = subVec(currentResult, item);
                                } else return { error: "Math" };
                            } else if (currentOp === '×') {
                                if (Array.isArray(currentResult) && Array.isArray(item)) {
                                    const res = crossProd(currentResult, item);
                                    if (res === null) return { error: "Dim" };
                                    currentResult = res;
                                } else if (Array.isArray(currentResult)) {
                                    currentResult = scalarMul(currentResult, item);
                                } else if (Array.isArray(item)) {
                                    currentResult = scalarMul(item, currentResult);
                                } else {
                                    currentResult *= item;
                                }
                            } else if (currentOp === '·') {
                                if (Array.isArray(currentResult) && Array.isArray(item)) {
                                    if (currentResult.length !== item.length) return { error: "Dim" };
                                    currentResult = dotProd(currentResult, item);
                                } else return { error: "Math" };
                            }
                            currentOp = null;
                        }
                    }
                    return Array.isArray(currentResult) ? { vec: currentResult } : { scalar: currentResult };
                };

                try {
                    const res = evalVec(vectorExpr);
                    if (res.error) {
                        setResult(res.error.includes("Dim") ? "Dimension ERROR" : "Math ERROR");
                        setIsComplete(true);
                        setExpression(vectorExpr || expression);
                    } else if (res.vec) {
                        setResult(`[${res.vec.join(', ')}]`);
                        setVectors(prev => ({ ...prev, Ans: res.vec }));
                        setIsComplete(true);
                        setExpression(vectorExpr);
                    } else if (res.scalar !== undefined) {
                        setResult(res.scalar.toString());
                        setLastAnswer(res.scalar);
                        setIsComplete(true);
                        setExpression(vectorExpr);
                    }
                    setVectorExpr("");
                    setIsVectorCalcMode(false);
                } catch (e) {
                    setResult("Math ERROR"); setIsComplete(true);
                }
                return;
            } else if (label === "AC") {
                setVectorExpr("");
                setIsVectorCalcMode(false);
                setResult(""); setExpression(""); setIsComplete(false);
                return;
            }
            return;
        }
        if (isMatrixCalcMode) {
            if (activeLabel === "[MATRIX]") { setIsMatrixMenuOpen(true); setMatrixSubState(null); consumeModifiers(); return; }
            if (activeLabel === "<i>x</i>⁻¹") { setMatrixExpr(p => p + "⁻¹"); return; }
            if (activeLabel === "<i>x</i>²") { setMatrixExpr(p => p + "²"); return; }

            // ALPHA Shortcuts for Matrices (e.g. ALPHA + A inserts MatA)
            if (isAlphaActive && ["A", "B", "C", "M"].includes(activeLabel)) {
                const slot = activeLabel === "M" ? "Ans" : activeLabel;
                setMatrixExpr(p => p + `Mat${slot}`);
                consumeModifiers(); return;
            }

            if (["+", "-", "×"].includes(label)) {
                setMatrixExpr(p => p + label);
                // Re-open matrix menu to pick next matrix
                setIsMatrixMenuOpen(true);
                setMatrixSubState(null);
                return;
            }
            if (label === "(") { setMatrixExpr(p => p + "("); return; }
            if (label === ")") { setMatrixExpr(p => p + ")"); return; }
            if (/^[0-9.]$/.test(label)) { setMatrixExpr(p => p + label); return; }

            if (label === "=") {
                const res = evaluateMatrixExpr(matrixExpr);
                if (res.error) {
                    setResult((res.error === "Unset" || res.error === "Dim") ? "Dimension ERROR" : "Math ERROR");
                    setIsComplete(true);
                    setExpression(matrixExpr || expression);
                } else if (res.scalar !== undefined) {
                    setResult(res.scalar.toString());
                    setLastAnswer(res.scalar);
                    setMatrices(p => ({ ...p, Ans: [[res.scalar]] }));
                    setIsComplete(true);
                    setExpression(matrixExpr);
                } else if (res.mat) {
                    setMatrices(p => ({ ...p, Ans: res.mat }));
                    const flatMat = res.mat.map(r => `[${r.join(',')}]`).join(',');
                    setResult(`[${flatMat}]`);
                    setIsComplete(true);
                    setExpression(matrixExpr);
                }
                setIsMatrixCalcMode(false);
                setMatrixExpr("");
                return;
            }
            if (label === "AC") { setIsMatrixCalcMode(false); setMatrixExpr(""); setResult(""); return; }
            if (label === "DEL") { setMatrixExpr(p => p.slice(0, -1)); return; }
            return;
        }
        // ── END MATRIX HANDLING ──────────────────────────────────────────────

        // 3. Reset & Deletion
        if (isConstMenuOpen) {
            if (/^[0-9]$/.test(label)) {
                const nextCode = constCode + label;
                if (nextCode.length === 2) {
                    const constants = {
                        "01": "mp", "02": "mn", "03": "me", "04": "mμ", "05": "a0",
                        "06": "h", "07": "μN", "08": "μB", "09": "ħ", "10": "α",
                        "11": "re", "12": "λc", "13": "γp", "14": "λcp", "15": "λcn",
                        "16": "R∞", "17": "u", "18": "μp", "19": "μe", "20": "μn",
                        "21": "μμ", "22": "F", "23": "e_c", "24": "NA", "25": "k",
                        "26": "Vm", "27": "R", "28": "c0", "29": "c1", "30": "c2",
                        "31": "σ", "32": "ε0", "33": "μ0", "34": "Φ0", "35": "g",
                        "36": "Z0", "37": "t", "38": "G", "39": "G", "40": "atm"
                    };
                    const char = constants[nextCode] || "??";
                    setExpression(prev => prev.slice(0, cursorPosition) + char + prev.slice(cursorPosition));
                    setCursorPosition(prev => prev + char.length);
                    setIsConstMenuOpen(false);
                    setConstCode("");
                } else {
                    setConstCode(nextCode);
                }
            } else if (label === "AC") {
                setIsConstMenuOpen(false);
                setConstCode("");
            }
            return;
        }

        if (isConvMenuOpen) {
            if (/^[0-9]$/.test(label)) {
                const nextCode = convCode + label;
                if (nextCode.length === 2) {
                    const codes = {
                        "01": "in▶cm", "02": "cm▶in", "03": "ft▶m", "04": "m▶ft",
                        "05": "yd▶m", "06": "m▶yd", "07": "mile▶km", "08": "km▶mile",
                        "09": "n mile▶m", "10": "m▶n mile", "11": "pc▶km", "12": "km▶pc",
                        "13": "acre▶m²", "14": "m²▶acre", "15": "gal(US)▶ℓ", "16": "ℓ▶gal(US)",
                        "17": "gal(UK)▶ℓ", "18": "ℓ▶gal(UK)", "19": "ℓ▶m³", "20": "m³▶ℓ",
                        "21": "hp▶kW", "22": "kW▶hp", "23": "kgf/cm²▶Pa", "24": "Pa▶kgf/cm²",
                        "25": "atm▶Pa", "26": "Pa▶atm", "27": "mmHg▶Pa", "28": "Pa▶mmHg",
                        "29": "kgf·m▶J", "30": "J▶kgf·m", "31": "lbf/in²▶kPa", "32": "kPa▶lbf/in²",
                        "33": "kgf▶N", "34": "N▶kgf", "35": "lbf▶N", "36": "N▶lbf",
                        "37": "°F▶°C", "38": "°C▶°F", "39": "J▶cal", "40": "cal▶J"
                    };
                    const unit = codes[nextCode] || "??▶??";
                    setExpression(prev => prev.slice(0, cursorPosition) + unit + prev.slice(cursorPosition));
                    setCursorPosition(prev => prev + unit.length);
                    setIsConvMenuOpen(false);
                    setConvCode("");
                } else {
                    setConvCode(nextCode);
                }
            } else if (label === "AC") {
                setIsConvMenuOpen(false);
                setConvCode("");
            }
            return;
        }

        if (label === "AC") {
            handleAC();
            return;
        }

        if (label === "DEL" || activeLabel === "INS") {
            if (activeLabel === "INS") {
                handleINS();
                consumeModifiers();
                return;
            }
            handleDEL();
            consumeModifiers();
            return;
        }

        // 4. Equals Logic (Save to History)
        if (label === "=") {
            if (!expression || isComplete) return;

            // PRE-CHECK: Syntax check for incomplete templates or unbalanced parentheses
            const autoCloseParens = (str) => {
                let depth = 0;
                for (let char of str) {
                    if (char === '(') depth++;
                    if (char === ')') depth--;
                }
                if (depth > 0) return str + ')'.repeat(depth);
                return str;
            };

            const balancedParens = (str) => {
                let depth = 0;
                for (let char of str) {
                    if (char === '(') depth++;
                    if (char === ')') depth--;
                    if (depth < 0) return false;
                }
                return depth >= 0; // Support unclosed opening brackets
            };

            if (!balancedParens(expression)) {
                setResult("Syntax ERROR");
                setIsComplete(true);
                return;
            }

            const exprToEval = autoCloseParens(expression);

            // Check for empty template boxes (e.g., ‡‡ or (‡)
            if (/\‡\‡/.test(expression) || /\(\‡/.test(expression) || /\‡\)/.test(expression)) {
                setResult("Syntax ERROR");
                setIsComplete(true);
                return;
            }

            // VIP Feature: If expression has '=' and user presses main '=', trigger SOLVE automatically
            if (expression.includes("=") && !isSolving) {
                handleButton({ main: "CALC", gold: "SOLVE" });
                return;
            }

            if (currentMode === "BASE-N") {
                const resStr = evaluateBaseN(expression, currentBase);
                if (resStr.includes("ERROR")) {
                    setResult(resStr);
                } else {
                    setLastAnswer(parseInt(resStr, currentBase === "HEX" ? 16 : (currentBase === "BIN" ? 2 : (currentBase === "OCT" ? 8 : 10))));
                    setResult(resStr);
                }
                setIsComplete(true);
                consumeModifiers();
                return;
            }

            const currentVariables = btnOrLabel._forcedVars || variables;
            try {
                // Special handling for specialized modes that do their own eval
                if (currentMode === "CMPLX") {
                    const res = evaluateComplex(exprToEval, currentVariables, config.angle);
                    setLastAnswer(res);
                    setResult(res);
                    setHistory(prev => [...prev, exprToEval]);
                    setIsComplete(true);
                    consumeModifiers();
                    return;
                }

                // Unified Preprocessing for standard mode
                const processedExpr = processForEval(exprToEval, currentVariables, config.angle);
                if (processedExpr === "Syntax ERROR") {
                    setResult("Syntax ERROR");
                    setIsComplete(true);
                    consumeModifiers();
                    return;
                }

                // Multi-statement handling
                const statements = processedExpr.split(":");
                let currentResult = null;

                const mathNames = Object.getOwnPropertyNames(Math).filter(name => typeof Math[name] === 'function');
                const mathFuncs = mathNames.reduce((acc, name) => {
                    acc[name] = Math[name];
                    return acc;
                }, {});

                for (let stmt of statements) {
                    if (!stmt.trim()) continue;
                    try {
                        // Create scope with math functions, ensuring log is log10 and ln is log
                        const nearZero = (v) => Math.abs(v) < 1e-15 ? 0 : v;

                        const angleFactor = config.angle === 'Rad' ? 1 : (config.angle === 'Deg' ? Math.PI / 180 : Math.PI / 200);
                        const scope = {
                            ...mathFuncs,
                            Math: Math,
                            PI: Math.PI,
                            E: Math.E,
                            log: Math.log10,
                            RanSharp: () => Math.floor(Math.random() * 1000) / 1000,
                            RanInt: (a, b) => Math.floor(Math.random() * (b - a + 1)) + a,
                            Rnd: (x) => Number(Number(x).toPrecision(10)),
                            sin: (x) => nearZero(Math.sin(x * angleFactor)),
                            cos: (x) => nearZero(Math.cos(x * angleFactor)),
                            tan: (x) => {
                                let r = Math.tan(x * angleFactor);
                                return Math.abs(r) > 1e14 ? Infinity : r;
                            },
                            asin: (x) => {
                                if (x < -1 || x > 1) throw new Error("Math ERROR");
                                const res = Math.asin(x);
                                return config.angle === 'Deg' ? res * (180 / Math.PI) : (config.angle === 'Gra' ? res * (200 / Math.PI) : res);
                            },
                            acos: (x) => {
                                if (x < -1 || x > 1) throw new Error("Math ERROR");
                                const res = Math.acos(x);
                                return config.angle === 'Deg' ? res * (180 / Math.PI) : (config.angle === 'Gra' ? res * (200 / Math.PI) : res);
                            },
                            atan: (x) => {
                                const res = Math.atan(x);
                                return config.angle === 'Deg' ? res * (180 / Math.PI) : (config.angle === 'Gra' ? res * (200 / Math.PI) : res);
                            },
                            sinh: (x) => Math.sinh(x),
                            cosh: (x) => Math.cosh(x),
                            tanh: (x) => Math.tanh(x),
                            asinh: (x) => Math.asinh(x),
                            acosh: (x) => Math.acosh(x),
                            atanh: (x) => Math.atanh(x),
                            abs: (x) => Math.abs(x),
                            Abs: (x) => Math.abs(x),
                            ...currentVariables,
                            Ans: lastAnswer || 0
                        };

                        const scopeKeys = Object.keys(scope);
                        const scopeVals = scopeKeys.map(k => scope[k]);

                        const evalFn = new Function(...scopeKeys, `return (${stmt});`);
                        const res = evalFn(...scopeVals);

                        currentResult = (typeof res === 'number' && !isNaN(res) && isFinite(res)) ? res : (res === undefined ? 0 : NaN);
                    } catch (err) {
                        currentResult = NaN;
                    }
                }

                // No global flattening here to allow scientific precision
                setLastAnswer(isNaN(currentResult) ? 0 : currentResult);
                setHistory(prev => [...prev, expression]);
                setHistoryIndex(null);


                // Format result (Professional Display)
                if (currentResult === 0) {
                    if (expression.includes("°")) {
                        setResult("0° 0' 0\"");
                    } else {
                        setResult("0");
                    }
                } else if (isNaN(currentResult) || !isFinite(currentResult)) {
                    setResult("Math ERROR");
                } else {
                    if (expression.includes("°")) {
                        // Auto-format as DMS if expression contains degree symbol
                        let val = currentResult;
                        let isNeg = val < 0;
                        val = Math.abs(val);
                        let d = Math.floor(val);
                        let mFloat = (val - d) * 60;
                        let m = Math.floor(mFloat);
                        let sFloat = (mFloat - m) * 60;
                        if (Math.abs(sFloat - 60) < 0.0001) {
                            sFloat = 0; m += 1;
                            if (m === 60) { m = 0; d += 1; }
                        }
                        let sText = sFloat % 1 === 0 ? sFloat.toString() : sFloat.toFixed(2).replace(/\.?0+$/, "");
                        setResult(`${isNeg ? "-" : ""}${d}° ${m}' ${sText}"`);
                    } else {
                        setResult(formatValue(currentResult, config));
                    }
                }
                // Special display for Pol and Rec
                if (expression.trim().startsWith("Pol(") || expression.trim().startsWith("Rec(")) {
                    const isPol = expression.trim().startsWith("Pol(");
                    const vX = currentVariables.X; const vY = currentVariables.Y;
                    // Precision cleaning: Round to 10 significant digits to avoid float noise
                    const fX = typeof vX === 'number' ? Number(Number(vX).toPrecision(10)).toString() : "0";
                    const fY = typeof vY === 'number' ? Number(Number(vY).toPrecision(10)).toString() : "0";
                    if (isPol) setResult(`r=${fX}, θ=${fY}`);
                    else setResult(`x=${fX}, y=${fY}`);
                    // Persist X and Y to state
                    setVariables(prev => ({ ...prev, X: vX, Y: vY }));
                }

                setIsComplete(true);
            } catch (err) {
                setResult(err.message === "Syntax ERROR" ? "Syntax ERROR" : "Math ERROR");
                setIsComplete(true);
            }
            consumeModifiers();
            return;
        }

        // 5. Insertion
        let charToAdd = activeLabel;

        // Integration / Differentiation templates
        if (activeLabel?.includes("integral-sign")) {
            charToAdd = "∫(‡‡)"; // Integrand, Lower, Upper
            setExpression(prev => prev.slice(0, cursorPosition) + charToAdd + prev.slice(cursorPosition));
            setCursorPosition(prev => prev + 2); // Put cursor in integrand
            consumeModifiers();
            return;
        }

        if (activeLabel?.includes("dX")) {
            charToAdd = "d/dX(‡)"; // Integrand, value
            setExpression(prev => prev.slice(0, cursorPosition) + charToAdd + prev.slice(cursorPosition));
            setCursorPosition(prev => prev + 5); // Put cursor in integrand
            consumeModifiers();
            return;
        }


        const isMixedFracTemplate = activeLabel?.includes('mixed-frac-icon');
        const isFracTemplate = !isMixedFracTemplate && activeLabel?.includes('frac-icon');

        if (isFracTemplate) {
            charToAdd = "q(‡)";
            setExpression(prev => prev.slice(0, cursorPosition) + charToAdd + prev.slice(cursorPosition));
            setCursorPosition(prev => prev + 2); // To numerator
            consumeModifiers();
            return;
        }

        if (isMixedFracTemplate) {
            charToAdd = "mf(‡‡)";
            setExpression(prev => prev.slice(0, cursorPosition) + charToAdd + prev.slice(cursorPosition));
            setCursorPosition(prev => prev + 3); // To whole part
            consumeModifiers();
            return;
        }

        // Log Base Template
        if (activeLabel?.includes("log<sub>")) {
            charToAdd = "log(‡)"; // base, value
            setExpression(prev => prev.slice(0, cursorPosition) + charToAdd + prev.slice(cursorPosition));
            setCursorPosition(prev => prev + 4); // Put cursor in base box
            consumeModifiers();
            return;
        }

        // Summation Template
        if (activeLabel?.includes("sum-icon-stack")) {
            charToAdd = "Σ(‡‡)"; // expr, start, end
            setExpression(prev => prev.slice(0, cursorPosition) + charToAdd + prev.slice(cursorPosition));
            setCursorPosition(prev => prev + 3); // Put cursor in start (lower) box
            consumeModifiers();
            return;
        }



        if (activeLabel?.includes("°") || activeLabel?.includes("′")) {
            if (isComplete && result !== "Syntax ERROR" && result !== "Math ERROR") {
                if (result.toString().includes("°")) {
                    let currentResult = parseFloat(lastAnswer);
                    if (!isNaN(currentResult)) {
                        const strVal = currentResult.toString();
                        setResult(strVal.length > 12 ? currentResult.toFixed(10).replace(/\\.?0+$/, "") : strVal);
                    }
                } else {
                    let val = parseFloat(result);
                    if (!isNaN(val)) {
                        let isNeg = val < 0;
                        val = Math.abs(val);
                        let d = Math.floor(val);
                        let mFloat = (val - d) * 60;
                        let m = Math.floor(mFloat);
                        let sFloat = (mFloat - m) * 60;
                        if (Math.abs(sFloat - 60) < 0.0001) {
                            sFloat = 0;
                            m += 1;
                            if (m === 60) { m = 0; d += 1; }
                        }
                        let sText = sFloat % 1 === 0 ? sFloat.toString() : sFloat.toFixed(2);
                        setResult(`${isNeg ? "-" : ""}${d}°${m}'${sText}"`);
                    }
                }
                consumeModifiers();
                return;
            }

            charToAdd = "°";
            const beforeCursor = expression.slice(0, cursorPosition);
            let lastDMS = "";
            // Look back through the current number to see what DMS symbols we already have
            for (let j = beforeCursor.length - 1; j >= 0; j--) {
                const c = beforeCursor[j];
                if (c === "°" || c === "'" || c === '"') {
                    lastDMS = c;
                    break;
                }
                if (!/[\d\.]/.test(c)) break;
            }
            if (lastDMS === "°") charToAdd = "'";
            else if (lastDMS === "'") charToAdd = '"';

            setExpression(prev => prev.slice(0, cursorPosition) + charToAdd + prev.slice(cursorPosition));
            setCursorPosition(prev => prev + 1);
            consumeModifiers();
            return;
        }

        if (activeLabel === "←") {
            // Engineering Shift Logic will be handled with ENG below
        }

        if (activeLabel === "CONV") {
            setIsConvMenuOpen(true);
            setConvCode("");
            consumeModifiers();
            return;
        }

        if (activeLabel === "CONST") {
            setIsConstMenuOpen(true);
            setConstCode("");
            consumeModifiers();
            return;
        }

        if (activeLabel === "MATRIX") {
            setIsMatrixMenuOpen(true);
            consumeModifiers();
            return;
        }
        if (activeLabel === "VECTOR" || activeLabel === "[VECTOR]") {
            setIsVectorMenuOpen(true);
            consumeModifiers();
            return;
        }

        if (activeLabel === "<i>x</i>10<sup><i>x</i></sup>") charToAdd = "x10^";
        if (activeLabel === "π") charToAdd = "π";
        if (activeLabel === "e" || activeLabel === "<i>e</i>") charToAdd = "e";
        if (activeLabel === "Ran#") charToAdd = "Ran#";
        if (activeLabel === "RanInt") {
            charToAdd = "RanInt(";
            setExpression(prev => prev.slice(0, cursorPosition) + charToAdd + prev.slice(cursorPosition));
            setCursorPosition(prev => prev + 7);
            consumeModifiers();
            return;
        }

        if (activeLabel === "CMPLX") {
            setIsCmplxMenuOpen(true);
            consumeModifiers();
            return;
        }

        if (activeLabel === "BASE" || activeLabel === "[BASE]") {
            setIsBaseMenuOpen(true);
            consumeModifiers();
            return;
        }

        if (activeLabel === "STAT" || activeLabel === "[STAT]") {
            setIsStatMenuOpen(true);
            consumeModifiers();
            return;
        }

        if (activeLabel === "CLR") {
            setIsClrMenuOpen(true);
            consumeModifiers();
            return;
        }

        if (activeLabel === "Rnd") {
            charToAdd = "Rnd(";
            setExpression(prev => prev.slice(0, cursorPosition) + charToAdd + prev.slice(cursorPosition));
            setCursorPosition(prev => prev + 4);
            consumeModifiers();
            return;
        }

        if (activeLabel === "(-)") charToAdd = "-";
        if (activeLabel === "∠" || activeLabel === "[∠]") charToAdd = "∠";
        if (activeLabel === "nPr") charToAdd = "P";
        if (activeLabel === "nCr") charToAdd = "C";

        // Power / N-th Root Templates
        const isXPowBtn = activeLabel?.includes('<i>x</i><sup><div');
        const isNthRootTemplate = activeLabel?.includes('<sup><div class="math-box"') && activeLabel.includes('√');

        if (isXPowBtn && !isAlphaActive) {
            if (currentMode === "BASE-N") {
                handleBaseSwitch("HEX");
                return;
            }
            if (expression === "" || isComplete) {
                // Dual box template for base and exponent
                charToAdd = isComplete ? "pw(Ans‡)" : "pw(‡)";
                setExpression(prev => prev.slice(0, cursorPosition) + charToAdd + prev.slice(cursorPosition));
                setCursorPosition(prev => prev + (isComplete ? 7 : 3)); // Position 3 is base, 7 is after Ans
                consumeModifiers();
                return;
            } else {
                charToAdd = "^()";
                setExpression(prev => prev.slice(0, cursorPosition) + charToAdd + prev.slice(cursorPosition));
                setCursorPosition(prev => prev + 2); // Put cursor in exponent
                consumeModifiers();
                return;
            }
        }

        if (isNthRootTemplate) {
            charToAdd = "rt(‡)"; // index, value
            setExpression(prev => prev.slice(0, cursorPosition) + charToAdd + prev.slice(cursorPosition));
            setCursorPosition(prev => prev + 3); // Put cursor in index box
            consumeModifiers();
            return;
        }

        // Power / Exp Templates (10^x, e^x)
        if (activeLabel?.includes("10<sup>")) {
            charToAdd = "tx()"; // 10^box
            setExpression(prev => prev.slice(0, cursorPosition) + charToAdd + prev.slice(cursorPosition));
            setCursorPosition(prev => prev + 3);
            consumeModifiers();
            return;
        }
        if (activeLabel?.includes("<i>e</i><sup>")) {
            charToAdd = "ex()"; // e^box
            setExpression(prev => prev.slice(0, cursorPosition) + charToAdd + prev.slice(cursorPosition));
            setCursorPosition(prev => prev + 3);
            consumeModifiers();
            return;
        }

        const handleBaseSwitch = (newBase) => {
            let valToConvert = isComplete ? result : expression;
            if (valToConvert && currentBase !== newBase) {
                let baseNum = 10;
                if (currentBase === "HEX") baseNum = 16;
                if (currentBase === "BIN") baseNum = 2;
                if (currentBase === "OCT") baseNum = 8;

                // Evaluate expression if needed, but for simplicity we convert the raw string/number
                let strVal = valToConvert.toString().trim();
                // Treat the input as a 32-bit signed integer in the source base
                let num = parseInt(strVal, baseNum);
                if (baseNum !== 10 && num > 0x7FFFFFFF) {
                    num = num | 0; // Coerce to 32-bit signed
                }

                if (!isNaN(num)) {
                    let targetBaseNum = 10;
                    if (newBase === "HEX") targetBaseNum = 16;
                    if (newBase === "BIN") targetBaseNum = 2;
                    if (newBase === "OCT") targetBaseNum = 8;

                    let convertedVal = "";
                    if (num < 0 && targetBaseNum !== 10) {
                        // Show two's complement for non-decimal bases
                        convertedVal = (num >>> 0).toString(targetBaseNum).toUpperCase();
                    } else {
                        convertedVal = num.toString(targetBaseNum).toUpperCase();
                    }

                    if (isComplete) {
                        setResult(convertedVal);
                        setLastAnswer(num);
                    } else {
                        setExpression(convertedVal);
                        setCursorPosition(convertedVal.length);
                    }
                }
            }
            setCurrentBase(newBase);
            consumeModifiers();
        };

        if (activeLabel === "DEC") { handleBaseSwitch("DEC"); return; }
        if (activeLabel === "HEX") { handleBaseSwitch("HEX"); return; }
        if (activeLabel === "BIN") { handleBaseSwitch("BIN"); return; }
        if (activeLabel === "OCT") { handleBaseSwitch("OCT"); return; }

        if (activeLabel === "ln") {
            if (currentMode === "BASE-N") {
                handleBaseSwitch("OCT");
                return;
            }
            charToAdd = "ln()"; // natural log
            setExpression(prev => prev.slice(0, cursorPosition) + charToAdd + prev.slice(cursorPosition));
            setCursorPosition(prev => prev + 3);
            consumeModifiers();
            return;
        }
        if (activeLabel === "log") {
            if (currentMode === "BASE-N") {
                handleBaseSwitch("BIN");
                return;
            }
            charToAdd = "l10()"; // log base 10
            setExpression(prev => prev.slice(0, cursorPosition) + charToAdd + prev.slice(cursorPosition));
            setCursorPosition(prev => prev + 4);
            consumeModifiers();
            return;
        }

        if (activeLabel === "Rnd") {
            charToAdd = "Rnd(";
            setExpression(prev => prev.slice(0, cursorPosition) + charToAdd + prev.slice(cursorPosition));
            setCursorPosition(prev => prev + 4);
            consumeModifiers();
            return;
        }


        if (activeLabel === "Abs") {
            charToAdd = "Abs(";
        }

        if (activeLabel === "hyp") {
            setIsHypMenuOpen(true);
            setIsShiftActive(false);
            setIsAlphaActive(false);
            return;
        }

        if (activeLabel === "sin") charToAdd = "sin(";
        if (activeLabel === "cos") charToAdd = "cos(";
        if (activeLabel === "tan") charToAdd = "tan(";
        if (activeLabel === "sin⁻¹") charToAdd = "sin⁻¹(";
        if (activeLabel === "cos⁻¹") charToAdd = "cos⁻¹(";
        if (activeLabel === "tan⁻¹") charToAdd = "tan⁻¹(";

        if (activeLabel === "A" || activeLabel === "[A]") charToAdd = "A";
        if (activeLabel === "B" || activeLabel === "[B]") charToAdd = "B";
        if (activeLabel === "C" || activeLabel === "[C]") charToAdd = "C";
        if (activeLabel === "D" || activeLabel === "[D]") charToAdd = "D";
        if (activeLabel === "E" || activeLabel === "[E]") charToAdd = "E";
        if (activeLabel === "F" || activeLabel === "[F]") charToAdd = "F";
        if (activeLabel === "X" || activeLabel === "[X]") charToAdd = "X";
        if (activeLabel === "Y" || activeLabel === "[Y]") charToAdd = "Y";
        if (activeLabel === "M" || activeLabel === "[M]") charToAdd = "M";

        if (activeLabel === "M+") {
            handleMemoryUpdate('plus');
            consumeModifiers();
            return;
        }
        if (activeLabel === "M-") {
            handleMemoryUpdate('minus');
            consumeModifiers();
            return;
        }
        if (activeLabel === "S⇔D") {
            setIsFractionDisplay(!isFractionDisplay);
            consumeModifiers();
            return;
        }

        if (label === "S⇔D" && isShiftActive) {
            setFractionMode(prev => prev === "improper" ? "mixed" : "improper");
            setIsFractionDisplay(true); // Usually shift-fraction forces fraction view
            consumeModifiers();
            return;
        }

        if (activeLabel === "ENG" || activeLabel === "←" || activeLabel === "<i>i</i>") {
            const isEngButton = label === "ENG";

            if (currentMode === "CMPLX" && !isComplete && (activeLabel === "ENG" || activeLabel === "<i>i</i>")) {
                charToAdd = "i";
                setExpression(prev => prev.slice(0, cursorPosition) + charToAdd + prev.slice(cursorPosition));
                setCursorPosition(prev => prev + 1);
                consumeModifiers();
                return;
            }

            if (isComplete && isEngButton && !isNaN(parseFloat(lastAnswer))) {
                let val = parseFloat(lastAnswer);
                if (val === 0) {
                    setResult("0x10^0");
                    consumeModifiers();
                    return;
                }

                // Get current exponent from result if it's already in engineering form
                let currentExp = 0;
                let alreadySci = false;
                const match = result.toString().match(/x10\^([\-\d]+)$/);
                if (match) {
                    currentExp = parseInt(match[1]);
                    alreadySci = true;
                }

                let targetExp;
                if (!alreadySci) {
                    // Normalize on first press (e.g., 5000 -> 5x10^3)
                    targetExp = Math.floor(Math.log10(Math.abs(val)) / 3) * 3;
                } else {
                    // Shift: SHIFT+ENG (←) increases exp, ENG decreases exp
                    const isShifted = isShiftActive || activeLabel === "←";
                    targetExp = isShifted ? currentExp + 3 : currentExp - 3;
                }

                let coeff = val / Math.pow(10, targetExp);
                // Clean up float artifacts
                coeff = Number(coeff.toPrecision(12));

                setResult(`${coeff}x10^${targetExp}`);
            }
            consumeModifiers();
            return;
        }

        if (activeLabel === "←" && label === "°'\"") {
            let valToStore = parseFloat(lastAnswer) || 0;
            const numVal = isNaN(valToStore) ? 0 : valToStore;
            setVariables(prev => ({ ...prev, B: numVal }));
            setResult(`${numVal}→B`);
            setExpression(""); // Top line gets cleared and result is showed at bottom
            setIsComplete(true);
            setIsStoActive(false); // Just in case
            consumeModifiers();
            return;
        }

        if (activeLabel === "<i>i</i>" || activeLabel === "i") charToAdd = "i";

        if (activeLabel === "(") {
            handleOpenBracket();
            consumeModifiers();
            return;
        }

        if (activeLabel === "%" || activeLabel === "<i>%</i>") {
            handlePercentage();
            consumeModifiers();
            return;
        }

        if (activeLabel === ")") {
            handleCloseBracket();
            consumeModifiers();
            return;
        }

        if (activeLabel === ",") {
            handleComma();
            consumeModifiers();
            return;
        }

        if (activeLabel === "X") {
            handleVariableX();
            consumeModifiers();
            return;
        }

        // Root logic (Square and Cube)
        if (activeLabel?.includes("√")) {
            if (activeLabel.includes(">3</sup>")) {
                charToAdd = "croot()";
            } else {
                charToAdd = "sroot()";
            }
            setExpression(prev => prev.slice(0, cursorPosition) + charToAdd + prev.slice(cursorPosition));
            setCursorPosition(prev => prev + 6); // Inside parens
            consumeModifiers();
            return;
        }

        if (activeLabel === "<i>x</i>²") {
            if (currentMode === "BASE-N") {
                handleBaseSwitch("DEC");
                return;
            }
            if (expression === "" || isComplete) {
                // Natural Template mode if empty or start of new expression
                charToAdd = isComplete ? "sq(Ans)" : "sq()";
                setExpression(prev => prev.slice(0, cursorPosition) + charToAdd + prev.slice(cursorPosition));
                setCursorPosition(prev => prev + (isComplete ? 7 : 3)); // After Ans or inside sq()
                consumeModifiers();
                return;
            } else {
                charToAdd = "²";
            }
        }

        if (activeLabel === "<i>x</i>³") {
            if (expression === "" || isComplete) {
                charToAdd = isComplete ? "cb(Ans)" : "cb()";
                setExpression(prev => prev.slice(0, cursorPosition) + charToAdd + prev.slice(cursorPosition));
                setCursorPosition(prev => prev + (isComplete ? 7 : 3)); // After Ans or inside cb()
                consumeModifiers();
                return;
            } else {
                charToAdd = "³";
            }
        }

        if (activeLabel === "<i>x</i>⁻¹") {
            if (expression === "" && !isComplete) {
                charToAdd = "Ans⁻¹";
            } else {
                charToAdd = "⁻¹";
            }
        }
        if (activeLabel === "<i>x</i>!") {
            if (expression === "" && !isComplete) {
                charToAdd = "Ans!";
            } else {
                charToAdd = "!";
            }
        }
        if (activeLabel === "nPr") charToAdd = "P";
        if (activeLabel === "nCr") charToAdd = "C";
        if (activeLabel === "Pol") {
            charToAdd = "Pol(";
            setExpression(prev => prev.slice(0, cursorPosition) + charToAdd + prev.slice(cursorPosition));
            setCursorPosition(prev => prev + charToAdd.length);
            consumeModifiers();
            return;
        }
        if (activeLabel === "Rec") {
            charToAdd = "Rec(";
            setExpression(prev => prev.slice(0, cursorPosition) + charToAdd + prev.slice(cursorPosition));
            setCursorPosition(prev => prev + charToAdd.length);
            consumeModifiers();
            return;
        }
        if (activeLabel === "•") charToAdd = ".";
        if (activeLabel === "Ans") charToAdd = "Ans";

        const isOperator = ["+", "-", "×", "÷"].includes(charToAdd);
        const isPostFunction = ["²", "³", "⁻¹", "!"].includes(charToAdd) || charToAdd.startsWith("Ans");

        if (isComplete) {
            setIsComplete(false);
            setResult("");
            // High-class chaining logic: if operator/post-function is pressed right after result
            if (isOperator || isPostFunction) {
                const startExpr = (charToAdd === "Ans⁻¹" || charToAdd === "Ans!") ? charToAdd : "Ans" + charToAdd;
                setExpression(startExpr);
                setCursorPosition(startExpr.length);
            } else {
                const startExpr = charToAdd === "." ? "0." : charToAdd;
                setExpression(startExpr);
                setCursorPosition(startExpr.length);
            }
        } else {
            if (charToAdd === ".") {
                const parts = expression.slice(0, cursorPosition).split(/[\+\-×÷\(\)]/);
                const lastPart = parts[parts.length - 1];
                if (lastPart.includes(".")) return;
            }

            setExpression(prev => prev.slice(0, cursorPosition) + charToAdd + prev.slice(cursorPosition));
            setCursorPosition(prev => prev + charToAdd.length);
        }

        consumeModifiers();
    };

    const processForEval = (expr, vars, angleMode) => {
        const angleFactor = angleMode === 'Rad' ? 1 : (angleMode === 'Deg' ? Math.PI / 180 : Math.PI / 200);

        const preprocess = (s) => {
            if (!s || s.trim() === "") return "";
            const processedS = s
                .replace(/\\/g, "")
                .replace(/_\{(.*?)\}/g, "_$1")
                .replace(/(?<![a-zA-Z])x(?![a-zA-Z])/g, "X")
                .replace(/(sin|cos|tan)⁻¹\(/g, (m) => {
                    if (m.startsWith("sin")) return "asin(";
                    if (m.startsWith("cos")) return "acos(";
                    if (m.startsWith("tan")) return "atan(";
                    return m;
                })
                .replace(/Abs\(/g, "abs(")
                .replace(/l10\(/g, "log(")
                .replace(/log_?10\(/g, "log(")
                .replace(/(?<![a-zA-Z])mp(?![a-zA-Z])/g, "(1.6726219*10**-27)")
                .replace(/(?<![a-zA-Z])mn(?![a-zA-Z])/g, "(1.6749275*10**-27)")
                .replace(/(?<![a-zA-Z])me(?![a-zA-Z])/g, "(9.10938356*10**-31)")
                .replace(/(?<![a-zA-Z])mμ(?![a-zA-Z])/g, "(1.8835316*10**-28)")
                .replace(/(?<![a-zA-Z])a0(?![a-zA-Z])/g, "(5.291772109*10**-11)")
                .replace(/(?<![a-zA-Z])h(?![a-zA-Z])/g, "(6.62607015*10**-34)")
                .replace(/(?<![a-zA-Z])μN(?![a-zA-Z])/g, "(5.050783699*10**-27)")
                .replace(/(?<![a-zA-Z])μB(?![a-zA-Z])/g, "(9.274009994*10**-24)")
                .replace(/(?<![a-zA-Z])ħ(?![a-zA-Z])/g, "(1.054571817*10**-34)")
                .replace(/(?<![a-zA-Z])α(?![a-zA-Z])/g, "(7.2973525693*10**-3)")
                .replace(/(?<![a-zA-Z])re(?![a-zA-Z])/g, "(2.8179403227*10**-15)")
                .replace(/(?<![a-zA-Z])λcp(?![a-zA-Z])/g, "(1.3214098539*10**-15)")
                .replace(/(?<![a-zA-Z])λcn(?![a-zA-Z])/g, "(1.3195909048*10**-15)")
                .replace(/(?<![a-zA-Z])λc(?![a-zA-Z])/g, "(2.4263102367*10**-12)")
                .replace(/(?<![a-zA-Z])γp(?![a-zA-Z])/g, "(2.675221900*10**8)")
                .replace(/(?<![a-zA-Z])R∞(?![a-zA-Z])/g, "(10973731.56816)")
                .replace(/(?<![a-zA-Z])u(?![a-zA-Z])/g, "(1.66053906660*10**-27)")
                .replace(/(?<![a-zA-Z])μp(?![a-zA-Z])/g, "(1.4106067873*10**-26)")
                .replace(/(?<![a-zA-Z])μe(?![a-zA-Z])/g, "(-9.284764620*10**-24)")
                .replace(/(?<![a-zA-Z])μn(?![a-zA-Z])/g, "(-9.6623650*10**-27)")
                .replace(/(?<![a-zA-Z])μμ(?![a-zA-Z])/g, "(-4.49044826*10**-26)")
                .replace(/(?<![a-zA-Z])F(?![a-zA-Z])/g, "(96485.33212)")
                .replace(/(?<![a-zA-Z])e_c(?![a-zA-Z])/g, "(1.602176634*10**-19)")
                .replace(/(?<![a-zA-Z])NA(?![a-zA-Z])/g, "(6.02214076*10**23)")
                .replace(/(?<![a-zA-Z])k(?![a-zA-Z])/g, "(1.380649*10**-23)")
                .replace(/(?<![a-zA-Z])Vm(?![a-zA-Z])/g, "(22.710954641*10**-3)")
                .replace(/(?<![a-zA-Z])R(?![a-zA-Z])/g, "(8.314462618)")
                .replace(/(?<![a-zA-Z])c0(?![a-zA-Z])/g, "(299792458)")
                .replace(/(?<![a-zA-Z])c1(?![a-zA-Z])/g, "(3.741771852*10**-16)")
                .replace(/(?<![a-zA-Z])c2(?![a-zA-Z])/g, "(1.438776877*10**-2)")
                .replace(/(?<![a-zA-Z])σ(?![a-zA-Z])/g, "(5.670374419*10**-8)")
                .replace(/(?<![a-zA-Z])ε0(?![a-zA-Z])/g, "(8.8541878128*10**-12)")
                .replace(/(?<![a-zA-Z])μ0(?![a-zA-Z])/g, "(1.25663706212*10**-6)")
                .replace(/(?<![a-zA-Z])Φ0(?![a-zA-Z])/g, "(2.067833848*10**-15)")
                .replace(/(?<![a-zA-Z])g(?![a-zA-Z])/g, "(9.80665)")
                .replace(/(?<![a-zA-Z])Z0(?![a-zA-Z])/g, "(376.730313668)")
                .replace(/(?<![a-zA-Z])t(?![a-zA-Z])/g, "(273.15)")
                .replace(/(?<![a-zA-Z])G(?![a-zA-Z])/g, "(6.67430*10**-11)")
                .replace(/atm(?![a-zA-Z])/g, "(101325)")
                .replace(/ex\((.*?)\)/g, "exp($1)")
                .replace(/tx\((.*?)\)/g, "pow10($1)")
                .replace(/x10\^/g, "*10**")

                .replace(/²/g, "**2")
                .replace(/³/g, "**3")
                .replace(/⁻¹/g, "**(-1)")
                .replace(/×/g, "*")
                .replace(/÷/g, "/")
                .replace(/Ran#/g, "RanSharp()")
                .replace(/RanInt\(/g, "RanInt(")
                .replace(/Rnd\(/g, "Rnd(")
                .replace(/\^/g, "**");

            // Handle implicit multiplication (e.g., 2X -> 2*X, 2( -> 2*(, )X -> )*X )
            // Added support for scientific constants (mp, mn, me, etc.)
            const scientificConstants = "mp|mn|me|mμ|a0|h|μN|μB|ħ|α|re|λc|γp|λcp|λcn|R∞|u|μp|μe|μn|μμ|F|e_c|NA|k|Vm|R|c0|c1|c2|σ|ε0|μ0|Φ0|g|Z0|t|G|atm";
            const termStart = `(\\(|[A-FXYMπei]|${scientificConstants}|asinh|acosh|atanh|sinh|cosh|tanh|asin|acos|atan|sin|cos|tan|log|ln|Abs|Ran#|RanInt|Rnd|Ans|∫|Σ|q\\(|mf\\(|pw\\(|rt\\(|ex\\(|tx\\()`;
            const varList = `[A-FXYMπei]|${scientificConstants}`;

            let finalS = processedS
                // 1. Digit followed by (Variable or Open-bracket or Function)
                .replace(new RegExp(`(\\d)(${termStart})`, 'g'), "$1*$2")
                // 2. Variable or Close-bracket followed by (Variable or Open-bracket or Function)
                // Use lookbehind to ensure we only multiply standalone variables, not parts of function names
                .replace(new RegExp(`(?<![a-zA-Z])(${varList}|Ans)(${termStart})`, 'g'), "$1*$2")
                .replace(new RegExp(`(\\))(${termStart})`, 'g'), "$1*$2")
                // 3. Variable or Close-bracket or Factorial followed by Digit
                .replace(new RegExp(`(?<![a-zA-Z])(${varList}|Ans)(\\d)`, 'g'), "$1*$2")
                .replace(new RegExp(`(\\)|!)(\\d)`, 'g'), "$1*$2")
                // 3. Final Constants Replacement (Do this LAST to not break implicit multiplication)
                .replace(/π/g, "(Math.PI)")
                .replace(/(?<![a-zA-Z])e(?![a-zA-Z])/g, "(Math.E)");

            // Auto-close missing parentheses
            let openParenCount = (finalS.match(/\(/g) || []).length;
            let closeParenCount = (finalS.match(/\)/g) || []).length;
            while (openParenCount > closeParenCount) {
                finalS += ")";
                closeParenCount++;
            }
            return finalS;
        };

        const getCtx = () => {
            const contextVars = { ...vars, Ans: lastAnswer || 0 };
            const keys = Object.keys(contextVars);
            const vals = keys.map(k => contextVars[k] !== null ? contextVars[k] : 0);
            return { keys, vals };
        };

        const pL = (s) => {
            const cleaned = preprocess(s);
            if (cleaned === "") return NaN;
            try {
                const { keys, vals } = getCtx();
                const angleFactor = angleMode === 'Rad' ? 1 : (angleMode === 'Deg' ? Math.PI / 180 : Math.PI / 200);
                const scope = {
                    ...Object.getOwnPropertyNames(Math).reduce((a, n) => { if (typeof Math[n] === 'function') a[n] = Math[n]; return a; }, {}),
                    Math: Math,
                    log: Math.log10, log10: Math.log10, ln: Math.log,
                    PI: Math.PI, E: Math.E,
                    RanSharp: () => Math.floor(Math.random() * 1000) / 1000,
                    RanInt: (a, b) => Math.floor(Math.random() * (b - a + 1)) + a,
                    Rnd: (x) => Number(Number(x).toPrecision(10)),
                    sin: (x) => { let r = Math.sin(x * angleFactor); return Math.abs(r) < 1e-15 ? 0 : r; },
                    cos: (x) => { let r = Math.cos(x * angleFactor); return Math.abs(r) < 1e-15 ? 0 : r; },
                    tan: (x) => {
                        const res = Math.tan(x * angleFactor);
                        if (Math.abs(res) < 1e-15) return 0;
                        return Math.abs(res) > 1e14 ? Infinity : res;
                    },
                    asin: (x) => {
                        if (x < -1 || x > 1) throw new Error();
                        const result = Math.asin(x);
                        return angleMode === 'Deg' ? result * (180 / Math.PI) : (angleMode === 'Gra' ? result * (200 / Math.PI) : result);
                    },
                    acos: (x) => {
                        if (x < -1 || x > 1) throw new Error();
                        const result = Math.acos(x);
                        return angleMode === 'Deg' ? result * (180 / Math.PI) : (angleMode === 'Gra' ? result * (200 / Math.PI) : result);
                    },
                    atan: (x) => {
                        const result = Math.atan(x);
                        return angleMode === 'Deg' ? result * (180 / Math.PI) : (angleMode === 'Gra' ? result * (200 / Math.PI) : result);
                    },
                    sinh: (x) => Math.sinh(x),
                    cosh: (x) => Math.cosh(x),
                    tanh: (x) => Math.tanh(x),
                    asinh: (x) => Math.asinh(x),
                    acosh: (x) => Math.acosh(x),
                    atanh: (x) => Math.atanh(x),
                    e: Math.E,
                    exp: Math.exp,
                    pow10: (x) => Math.pow(10, x),
                    abs: (x) => Math.abs(x),
                    Abs: (x) => Math.abs(x),
                    diff: (expr, xVal) => {
                        const contextVars = { ...vars, Ans: lastAnswer || 0 };
                        return numericalDifferentiate(expr, xVal, contextVars, config.angle);
                    }
                };
                const sKeys = [...keys, ...Object.keys(scope)];
                const sVals = [...vals, ...Object.values(scope)];
                const evalFn = new Function(...sKeys, `const RanHash = RanSharp; return (${cleaned})`);
                return evalFn(...sVals);
            } catch (e) { return NaN; }
        };

        let evalExpr = expr;
        // Scientific Conversions (CONV)
        // We run this before preprocess to avoid implicit multiplication (e.g., 10in -> 10*in) breaking the unit name
        const conversionFactors = {
            "in▶cm": 2.54, "cm▶in": 1 / 2.54,
            "ft▶m": 0.3048, "m▶ft": 1 / 0.3048,
            "yd▶m": 0.9144, "m▶yd": 1 / 0.9144,
            "mile▶km": 1.609344, "km▶mile": 1 / 1.609344,
            "n mile▶m": 1852, "m▶n mile": 1 / 1852,
            "pc▶km": 3.08567758e13, "km▶pc": 1 / 3.08567758e13,
            "acre▶m²": 4046.856422, "m²▶acre": 1 / 4046.856422,
            "gal(US)▶ℓ": 3.78541178, "ℓ▶gal(US)": 1 / 3.78541178,
            "gal(UK)▶ℓ": 4.54609, "ℓ▶gal(UK)": 1 / 4.54609,
            "ℓ▶m³": 0.001, "m³▶ℓ": 1000,
            "hp▶kW": 0.745699872, "kW▶hp": 1 / 0.745699872,
            "kgf/cm²▶Pa": 98066.5, "Pa▶kgf/cm²": 1 / 98066.5,
            "atm▶Pa": 101325, "Pa▶atm": 1 / 101325,
            "mmHg▶Pa": 133.322, "Pa▶mmHg": 1 / 133.322,
            "kgf·m▶J": 9.80665, "J▶kgf·m": 1 / 9.80665,
            "lbf/in²▶kPa": 6.89475729, "kPa▶lbf/in²": 1 / 6.89475729,
            "kgf▶N": 9.80665, "N▶kgf": 1 / 9.80665,
            "lbf▶N": 4.44822162, "N▶lbf": 1 / 4.44822162,
            "J▶cal": 1 / 4.184, "cal▶J": 4.184
        };

        const convSymbols = Object.keys(conversionFactors).concat(["°F▶°C", "°C▶°F"]);

        let convChanged = true;
        while (convChanged) {
            convChanged = false;
            for (let symbol of convSymbols) {
                if (evalExpr.includes(symbol)) {
                    let symbolIdx = evalExpr.indexOf(symbol);
                    let operandMatch = null;
                    let fullMatch = null;
                    let operandValue = NaN;

                    if (evalExpr[symbolIdx - 1] === ")") {
                        let depth = 1;
                        let j = symbolIdx - 2;
                        while (j >= 0 && depth > 0) {
                            if (evalExpr[j] === ")") depth++;
                            else if (evalExpr[j] === "(") depth--;
                            j--;
                        }
                        if (depth === 0) {
                            let start = j + 1;
                            fullMatch = evalExpr.substring(start, symbolIdx + symbol.length);
                            operandMatch = evalExpr.substring(start, symbolIdx);
                            operandValue = pL(operandMatch);
                        }
                    } else {
                        const before = evalExpr.substring(0, symbolIdx);
                        const match = before.match(/(\d+(\.\d+)?|Ans|[A-FXYMπe])$/i);
                        if (match) {
                            fullMatch = match[0] + symbol;
                            operandMatch = match[0];
                            operandValue = pL(operandMatch);
                        }
                    }

                    if (fullMatch && !isNaN(operandValue)) {
                        let result;
                        if (symbol === "°F▶°C") result = (operandValue - 32) * 5 / 9;
                        else if (symbol === "°C▶°F") result = operandValue * 9 / 5 + 32;
                        else result = operandValue * conversionFactors[symbol];

                        evalExpr = evalExpr.replace(fullMatch, `(${result})`);
                        convChanged = true;
                        break;
                    }
                }
            }
        }

        // -- Moved Blocks Start --
        // 1. DMS logic
        while (evalExpr.match(/(\d+(?:\.\d+)?)°(\d+(?:\.\d+)?)[°'](\d+(?:\.\d+)?)[°'"]/)) {
            const match = evalExpr.match(/(\d+(?:\.\d+)?)°(\d+(?:\.\d+)?)[°'](\d+(?:\.\d+)?)[°'"]/);
            const [full, d, m, s] = match;
            evalExpr = evalExpr.replace(full, `(${parseFloat(d) + parseFloat(m) / 60 + parseFloat(s) / 3600})`);
        }
        while (evalExpr.match(/(\d+(?:\.\d+)?)°(\d+(?:\.\d+)?)[°']/)) {
            const match = evalExpr.match(/(\d+(?:\.\d+)?)°(\d+(?:\.\d+)?)[°']/);
            const [full, d, m] = match;
            evalExpr = evalExpr.replace(full, `(${parseFloat(d) + parseFloat(m) / 60})`);
        }
        while (evalExpr.match(/(\d+(?:\.\d+)?)°/)) {
            const match = evalExpr.match(/(\d+(?:\.\d+)?)°/);
            const [full, d] = match;
            evalExpr = evalExpr.replace(full, `(${d})`);
        }

        // 2. Factorial logic (Cleaned to use pL)
        const factorial = mathFactorial;
        while (evalExpr.includes("!")) {
            let exclamationIdx = evalExpr.indexOf("!");
            let operandMatch = null;
            let fullMatch = null;
            let operandValue = NaN;

            if (evalExpr[exclamationIdx - 1] === ")") {
                let depth = 1;
                let j = exclamationIdx - 2;
                while (j >= 0 && depth > 0) {
                    if (evalExpr[j] === ")") depth++;
                    else if (evalExpr[j] === "(") depth--;
                    j--;
                }
                if (depth === 0) {
                    let start = j + 1;
                    fullMatch = evalExpr.substring(start, exclamationIdx + 1);
                    operandMatch = evalExpr.substring(start, exclamationIdx);
                    operandValue = pL(operandMatch);
                }
            } else {
                const simpleMatch = evalExpr.substring(0, exclamationIdx + 1).match(/([A-FXYMπe0-9.]+|Ans)!$/);
                if (simpleMatch) {
                    fullMatch = simpleMatch[0];
                    operandValue = pL(simpleMatch[1]);
                }
            }

            if (fullMatch) {
                if (isNaN(operandValue) || !isFinite(operandValue)) {
                    evalExpr = evalExpr.replace(fullMatch, "NaN");
                } else {
                    evalExpr = evalExpr.replace(fullMatch, `(${factorial(operandValue)})`);
                }
            } else break;
        }

        // 3. nPr and nCr Logic (Professional Balanced Extraction)
        while (true) {
            const match = evalExpr.match(/(?<![a-zA-Z])[PC](?![a-zA-Z])/);
            if (!match) break;
            const opIdx = match.index;
            const op = evalExpr[opIdx];

            let leftFull = "", leftValStr = "";
            let rightFull = "", rightValStr = "";

            // Identify Left Operand
            if (evalExpr[opIdx - 1] === ")") {
                let depth = 1;
                let j = opIdx - 2;
                while (j >= 0 && depth > 0) {
                    if (evalExpr[j] === ")") depth++;
                    else if (evalExpr[j] === "(") depth--;
                    j--;
                }
                if (depth === 0) {
                    leftFull = evalExpr.substring(j + 1, opIdx);
                    leftValStr = leftFull;
                }
            } else {
                const beforeMatch = evalExpr.substring(0, opIdx).match(/([A-FXYMπe0-9.]+|Ans)$/);
                if (beforeMatch) {
                    leftFull = beforeMatch[1];
                    leftValStr = leftFull;
                }
            }

            // Identify Right Operand
            if (evalExpr[opIdx + 1] === "(") {
                let depth = 1;
                let j = opIdx + 2;
                while (j < evalExpr.length && depth > 0) {
                    if (evalExpr[j] === "(") depth++;
                    else if (evalExpr[j] === ")") depth--;
                    j++;
                }
                if (depth === 0) {
                    rightFull = evalExpr.substring(opIdx + 1, j);
                    rightValStr = rightFull;
                }
            } else {
                const afterMatch = evalExpr.substring(opIdx + 1).match(/^([A-FXYMπe0-9.]+|Ans)/);
                if (afterMatch) {
                    rightFull = afterMatch[1];
                    rightValStr = rightFull;
                }
            }

            if (leftFull && rightFull) {
                const n = pL(leftValStr);
                const r = pL(rightValStr);
                if (isNaN(n) || isNaN(r)) return "Syntax ERROR";

                let result = 0;
                if (op === "P") {
                    if (n < 0 || r < 0 || r > n) result = 0;
                    else {
                        result = 1;
                        for (let i = n; i > n - r; i--) result *= i;
                    }
                } else {
                    if (n < 0 || r < 0 || r > n) result = 0;
                    else {
                        let k = r;
                        if (k > n / 2) k = n - k;
                        result = 1;
                        for (let i = 1; i <= k; i++) result = (result * (n - i + 1)) / i;
                        result = Math.round(result);
                    }
                }
                evalExpr = evalExpr.substring(0, opIdx - leftFull.length) + `(${result})` + evalExpr.substring(opIdx + 1 + rightFull.length);
            } else {
                return "Syntax ERROR";
            }
        }
        // -- Moved Blocks End --

        evalExpr = preprocess(evalExpr);

        const findEndOfTemplate = (str, start) => {
            let d = 1;
            for (let j = start + 1; j < str.length; j++) {
                if (str[j] === '(') d++;
                else if (str[j] === ')') d--;
                if (d === 0) return j;
            }
            return -1;
        };

        let changed = true;
        while (changed) {
            changed = false;
            // Integral
            if (evalExpr.includes("∫(")) {
                let startIdx = evalExpr.indexOf("∫(");
                let endIdx = findEndOfTemplate(evalExpr, startIdx + 1);
                if (endIdx !== -1) {
                    const full = evalExpr.substring(startIdx, endIdx + 1);
                    const inner = evalExpr.substring(startIdx + 2, endIdx);
                    const [integrand, lowStr, upStr] = inner.split("‡");
                    const lower = pL(lowStr); const upper = pL(upStr);
                    const contextVars = { ...vars, Ans: lastAnswer || 0 };
                    const result = numericalIntegrate(integrand, lower, upper, contextVars, config.angle);
                    if (result === "Syntax ERROR") return "Syntax ERROR";
                    evalExpr = evalExpr.replace(full, `(${result === "Math ERROR" ? "NaN" : result})`);
                    changed = true;
                    continue;
                }
            }

            // Summation
            if (evalExpr.includes("Σ(")) {
                let startIdx = evalExpr.indexOf("Σ(");
                let endIdx = findEndOfTemplate(evalExpr, startIdx + 1);
                if (endIdx !== -1) {
                    const full = evalExpr.substring(startIdx, endIdx + 1);
                    const inner = evalExpr.substring(startIdx + 2, endIdx);
                    const [exprTerm, lowStr, upStr] = inner.split("‡");
                    const lower = pL(lowStr); const upper = pL(upStr);
                    const contextVars = { ...vars, Ans: lastAnswer || 0 };
                    const result = numericalSummation(exprTerm, lower, upper, contextVars, config.angle);
                    if (result === "Syntax ERROR") return "Syntax ERROR";
                    evalExpr = evalExpr.replace(full, `(${result === "Math ERROR" ? "NaN" : result})`);
                    changed = true;
                    continue;
                }
            }

            // Derivative
            if (evalExpr.includes("d/dX(")) {
                let startIdx = evalExpr.indexOf("d/dX(");
                let endIdx = findEndOfTemplate(evalExpr, startIdx + 4);
                if (endIdx !== -1) {
                    const full = evalExpr.substring(startIdx, endIdx + 1);
                    const inner = evalExpr.substring(startIdx + 5, endIdx);
                    if (inner.includes("‡")) {
                        const [exprTerm, xValStr] = inner.split("‡");
                        const xVal = pL(xValStr);
                        const contextVars = { ...vars, Ans: lastAnswer || 0 };
                        const result = numericalDifferentiate(exprTerm, xVal, contextVars, config.angle);
                        if (result === "Syntax ERROR") return "Syntax ERROR";
                        evalExpr = evalExpr.replace(full, `(${result === "Math ERROR" ? "NaN" : result})`);
                        changed = true;
                        continue;
                    }
                }
            }

            // Log with Base
            if (evalExpr.includes("log(") && evalExpr.includes("‡")) {
                let startIdx = evalExpr.indexOf("log(");
                let findIdx = startIdx;
                while (findIdx !== -1) {
                    let endIdx = findEndOfTemplate(evalExpr, findIdx + 3);
                    if (endIdx !== -1) {
                        const full = evalExpr.substring(findIdx, endIdx + 1);
                        const inner = evalExpr.substring(findIdx + 4, endIdx);
                        if (inner.includes("‡")) {
                            const [baseStr, valStr] = inner.split("‡");
                            const base = pL(baseStr); const val = pL(valStr);
                            const result = calculateLogBase(base, val);
                            if (result === "Syntax ERROR") return "Syntax ERROR";
                            evalExpr = evalExpr.replace(full, `(${result === "Math ERROR" ? "NaN" : result})`);
                            changed = true;
                            break;
                        }
                    }
                    findIdx = evalExpr.indexOf("log(", findIdx + 1);
                }
                if (changed) continue;
            }
            // Fraction q(num‡denom)
            if (evalExpr.includes("q(")) {
                let startIdx = evalExpr.indexOf("q(");
                let endIdx = findEndOfTemplate(evalExpr, startIdx + 1);
                if (endIdx !== -1) {
                    const full = evalExpr.substring(startIdx, endIdx + 1);
                    const inner = evalExpr.substring(startIdx + 2, endIdx);
                    if (inner.includes("‡")) {
                        const parts = inner.split("‡");
                        if (parts.length === 2) {
                            const [numStr, denomStr] = parts;
                            const num = pL(numStr); const denom = pL(denomStr);
                            if (isNaN(num) || isNaN(denom)) return "Syntax ERROR";
                            if (denom === 0) return "Math ERROR";
                            const result = num / denom;
                            evalExpr = evalExpr.replace(full, `(${result === "Math ERROR" ? "NaN" : result})`);
                            changed = true;
                            continue;
                        }
                    }
                }
            }
            // Mixed Fraction mf(whole‡num‡denom)
            if (evalExpr.includes("mf(")) {
                let startIdx = evalExpr.indexOf("mf(");
                let endIdx = findEndOfTemplate(evalExpr, startIdx + 2);
                if (endIdx !== -1) {
                    const full = evalExpr.substring(startIdx, endIdx + 1);
                    const inner = evalExpr.substring(startIdx + 3, endIdx);
                    if (inner.includes("‡")) {
                        const parts = inner.split("‡");
                        if (parts.length === 3) {
                            const [wholeStr, numStr, denomStr] = parts;
                            const whole = pL(wholeStr); const num = pL(numStr); const denom = pL(denomStr);
                            if (isNaN(whole) || isNaN(num) || isNaN(denom)) return "Syntax ERROR";
                            if (denom === 0) return "Math ERROR";
                            // Mixed fraction logic: whole + numerator / denominator
                            const result = whole + (num / denom);
                            evalExpr = evalExpr.replace(full, `(${result === "Math ERROR" ? "NaN" : result})`);
                            changed = true;
                            continue;
                        }
                    }
                }
            }
            // Square Root sroot()
            if (evalExpr.includes("sroot(")) {
                let startIdx = evalExpr.indexOf("sroot(");
                let endIdx = findEndOfTemplate(evalExpr, startIdx + 5);
                if (endIdx !== -1) {
                    const full = evalExpr.substring(startIdx, endIdx + 1);
                    const inner = evalExpr.substring(startIdx + 6, endIdx);
                    const val = pL(inner);
                    if (isNaN(val)) return "Syntax ERROR";
                    if (val < 0) return "Math ERROR"; // Casio throws Math ERROR on negative sqrt
                    const result = Math.sqrt(val);
                    evalExpr = evalExpr.replace(full, `(${result})`);
                    changed = true;
                    continue;
                }
            }
            // General Power pw(base‡exp)
            if (evalExpr.includes("pw(")) {
                let startIdx = evalExpr.indexOf("pw(");
                let endIdx = findEndOfTemplate(evalExpr, startIdx + 2);
                if (endIdx !== -1) {
                    const full = evalExpr.substring(startIdx, endIdx + 1);
                    const inner = evalExpr.substring(startIdx + 3, endIdx);
                    if (inner.includes("‡")) {
                        const parts = inner.split("‡");
                        if (parts.length === 2) {
                            const [baseStr, expStr] = parts;
                            const base = pL(baseStr); const exponent = pL(expStr);
                            if (isNaN(base) || isNaN(exponent)) return "Syntax ERROR";
                            const result = Math.pow(base, exponent);
                            evalExpr = evalExpr.replace(full, `(${result})`);
                            changed = true;
                            continue;
                        }
                    }
                }
            }
            // Square Template sq(base)
            if (evalExpr.includes("sq(")) {
                let startIdx = evalExpr.indexOf("sq(");
                let endIdx = findEndOfTemplate(evalExpr, startIdx + 2);
                if (endIdx !== -1) {
                    const full = evalExpr.substring(startIdx, endIdx + 1);
                    const inner = evalExpr.substring(startIdx + 3, endIdx);
                    const val = pL(inner);
                    if (isNaN(val)) return "Syntax ERROR";
                    const result = Math.pow(val, 2);
                    evalExpr = evalExpr.replace(full, `(${result})`);
                    changed = true;
                    continue;
                }
            }
            // Cube Template cb(base)
            if (evalExpr.includes("cb(")) {
                let startIdx = evalExpr.indexOf("cb(");
                let endIdx = findEndOfTemplate(evalExpr, startIdx + 2);
                if (endIdx !== -1) {
                    const full = evalExpr.substring(startIdx, endIdx + 1);
                    const inner = evalExpr.substring(startIdx + 3, endIdx);
                    const val = pL(inner);
                    if (isNaN(val)) return "Syntax ERROR";
                    const result = Math.pow(val, 3);
                    evalExpr = evalExpr.replace(full, `(${result})`);
                    changed = true;
                    continue;
                }
            }
            // Cube Root croot()
            if (evalExpr.includes("croot(")) {
                let startIdx = evalExpr.indexOf("croot(");
                let endIdx = findEndOfTemplate(evalExpr, startIdx + 5);
                if (endIdx !== -1) {
                    const full = evalExpr.substring(startIdx, endIdx + 1);
                    const inner = evalExpr.substring(startIdx + 6, endIdx);
                    const val = pL(inner);
                    if (isNaN(val)) return "Syntax ERROR";
                    const result = Math.cbrt(val);
                    evalExpr = evalExpr.replace(full, `(${result})`);
                    changed = true;
                    continue;
                }
            }
            // N-th Root rt(index‡val)
            if (evalExpr.includes("rt(")) {
                let startIdx = evalExpr.indexOf("rt(");
                let endIdx = findEndOfTemplate(evalExpr, startIdx + 2);
                if (endIdx !== -1) {
                    const full = evalExpr.substring(startIdx, endIdx + 1);
                    const inner = evalExpr.substring(startIdx + 3, endIdx);
                    if (inner.includes("‡")) {
                        const parts = inner.split("‡");
                        if (parts.length === 2) {
                            const [rootStr, valStr] = parts;
                            const rootVal = pL(rootStr); const val = pL(valStr);
                            if (isNaN(rootVal) || isNaN(val)) return "Syntax ERROR";
                            if (rootVal === 0) return "Math ERROR";

                            let result;
                            if (val < 0) {
                                if (Math.abs(rootVal % 2) !== 1) return "Math ERROR";
                                result = -Math.pow(Math.abs(val), 1 / rootVal);
                            } else {
                                result = Math.pow(val, 1 / rootVal);
                            }
                            evalExpr = evalExpr.replace(full, `(${result === "Math ERROR" ? "NaN" : result})`);
                            changed = true;
                            continue;
                        }
                    }
                }
            }


            // Log Base 10 Template l10(val)
            if (evalExpr.includes("l10(")) {
                let startIdx = evalExpr.indexOf("l10(");
                let endIdx = findEndOfTemplate(evalExpr, startIdx + 3);
                if (endIdx !== -1) {
                    const full = evalExpr.substring(startIdx, endIdx + 1);
                    const inner = evalExpr.substring(startIdx + 4, endIdx);
                    const val = pL(inner);
                    if (isNaN(val)) return "Syntax ERROR";
                    if (val <= 0) return "Math ERROR";
                    const result = Math.log10(val);
                    evalExpr = evalExpr.replace(full, `(${result})`);
                    changed = true;
                    continue;
                }
            }
            // 10^x Template tx(val)
            if (evalExpr.includes("tx(")) {
                let startIdx = evalExpr.indexOf("tx(");
                let endIdx = findEndOfTemplate(evalExpr, startIdx + 2);
                if (endIdx !== -1) {
                    const full = evalExpr.substring(startIdx, endIdx + 1);
                    const inner = evalExpr.substring(startIdx + 3, endIdx);
                    const val = pL(inner);
                    if (isNaN(val)) return "Syntax ERROR";
                    const result = Math.pow(10, val);
                    evalExpr = evalExpr.replace(full, `(${result})`);
                    changed = true;
                    continue;
                }
            }
            // Natural Log Template ln(val)
            if (evalExpr.includes("ln(")) {
                let startIdx = evalExpr.indexOf("ln(");
                let endIdx = findEndOfTemplate(evalExpr, startIdx + 2);
                if (endIdx !== -1) {
                    const full = evalExpr.substring(startIdx, endIdx + 1);
                    const inner = evalExpr.substring(startIdx + 3, endIdx);
                    const val = pL(inner);
                    if (isNaN(val)) return "Syntax ERROR";
                    if (val <= 0) return "Math ERROR";
                    const result = Math.log(val);
                    evalExpr = evalExpr.replace(full, `(${result})`);
                    changed = true;
                    continue;
                }
            }
            // e^x Template ex(val)
            if (evalExpr.includes("ex(")) {
                let startIdx = evalExpr.indexOf("ex(");
                let endIdx = findEndOfTemplate(evalExpr, startIdx + 2);
                if (endIdx !== -1) {
                    const full = evalExpr.substring(startIdx, endIdx + 1);
                    const inner = evalExpr.substring(startIdx + 3, endIdx);
                    const val = pL(inner);
                    if (isNaN(val)) return "Syntax ERROR";
                    const result = Math.pow(Math.E, val);
                    evalExpr = evalExpr.replace(full, `(${result})`);
                    changed = true;
                    continue;
                }
            }
            // Pol(x,y)
            if (evalExpr.includes("Pol(")) {
                let startIdx = evalExpr.indexOf("Pol(");
                let endIdx = findEndOfTemplate(evalExpr, startIdx + 3);
                if (endIdx !== -1) {
                    const full = evalExpr.substring(startIdx, endIdx + 1);
                    const inner = evalExpr.substring(startIdx + 4, endIdx);
                    if (inner.includes(",")) {
                        const [xStr, yStr] = inner.split(",");
                        const x = pL(xStr); const y = pL(yStr);
                        if (!isNaN(x) && !isNaN(y)) {
                            const r = Math.sqrt(x * x + y * y);
                            let theta = Math.atan2(y, x) * (180 / Math.PI);
                            if (angleMode === 'Rad') theta = Math.atan2(y, x);
                            else if (angleMode === 'Gra') theta = Math.atan2(y, x) * (200 / Math.PI);
                            // Side effect: store results in vars (requires caution in pure func, but vars is passed ref)
                            vars.X = r; vars.Y = theta;
                            evalExpr = evalExpr.replace(full, `(${r})`);
                            changed = true; continue;
                        }
                    }
                }
            }
            // Rec(r,theta)
            if (evalExpr.includes("Rec(")) {
                let startIdx = evalExpr.indexOf("Rec(");
                let endIdx = findEndOfTemplate(evalExpr, startIdx + 3);
                if (endIdx !== -1) {
                    const full = evalExpr.substring(startIdx, endIdx + 1);
                    const inner = evalExpr.substring(startIdx + 4, endIdx);
                    if (inner.includes(",")) {
                        const [rStr, tStr] = inner.split(",");
                        const r = pL(rStr); const theta = pL(tStr);
                        if (!isNaN(r) && !isNaN(theta)) {
                            const factor = angleMode === 'Rad' ? 1 : (angleMode === 'Deg' ? Math.PI / 180 : Math.PI / 200);
                            const x = r * Math.cos(theta * factor);
                            const y = r * Math.sin(theta * factor);
                            vars.X = x; vars.Y = y;
                            evalExpr = evalExpr.replace(full, `(${x})`);
                            changed = true; continue;
                        }
                    }
                }
            }
        }

        // Basic Replacements (Moved after templates to avoid interference)
        evalExpr = evalExpr
            .replace(/×/g, "*").replace(/÷/g, "/")
            .replace(/²/g, "**2").replace(/³/g, "**3")
            .replace(/⁻¹/g, "**(-1)")
            // Implicit multiplication (Improved - avoiding breaking function names like sinh)
            .replace(/(\d+)([a-zA-Z_πe]|\()/g, "$1*$2")
            .replace(/(\))(\d+|[a-zA-Z_πe]|\()/g, "$1*$2")
            .replace(/\b(π|e)\b(?=[0-9\(])/g, "$1*")
            .replace(/log\(/g, "log(")
            .replace(/π/g, "PI")
            .replace(/(?<![a-zA-Z0-9.])e(?![a-zA-Z0-9.])/g, "E");

        // Variable replacement
        Object.keys(vars).forEach(v => {
            const regex = new RegExp("(?<![a-zA-Z\.])" + v + "(?![a-zA-Z])", "g");
            evalExpr = evalExpr.replace(regex, `(${vars[v] !== null && vars[v] !== undefined ? vars[v] : 0})`);
        });

        if (evalExpr.includes("‡")) {
            return "NaN";
        }

        // Handle DRG Unit Conversions
        const curAngle = config.angle;
        // Replacement scale factors to convert unit mark -> current mode unit
        const drgReplacements = {
            'Deg': { '°': '*1', 'ʳ': '*(180/Math.PI)', 'ᵍ': '*(180/200)' },
            'Rad': { '°': '*(Math.PI/180)', 'ʳ': '*1', 'ᵍ': '*(Math.PI/200)' },
            'Gra': { '°': '*(200/180)', 'ʳ': '*(200/Math.PI)', 'ᵍ': '*1' }
        };
        const activeGroup = drgReplacements[curAngle];
        evalExpr = evalExpr
            .replace(/°/g, activeGroup['°'])
            .replace(/ʳ/g, activeGroup['ʳ'])
            .replace(/ᵍ/g, activeGroup['ᵍ']);

        // Final Trig Replacements (respecting global angle mode for non-calculus parts)
        evalExpr = evalExpr
            .replace(/asin\(/g, `(1/${angleFactor})*Math.asin(`)
            .replace(/acos\(/g, `(1/${angleFactor})*Math.acos(`)
            .replace(/atan\(/g, `(1/${angleFactor})*Math.atan(`)
            .replace(/(?<![a-zA-Z])sin\(/g, `Math.sin(${angleFactor}*`)
            .replace(/(?<![a-zA-Z])cos\(/g, `Math.cos(${angleFactor}*`)
            .replace(/(?<![a-zA-Z])tan\(/g, `tan(${angleFactor}*`);

        return evalExpr;
    };

    const executeSolve = (overrides = null) => {
        try {
            const currentVariables = overrides || variables;
            let [left, right] = expression.split("=");
            if (!right) right = "0";

            let x0 = (currentVariables.X !== undefined && currentVariables.X !== null) ? currentVariables.X : 0;
            const f = (xVal) => {
                const solveVars = { ...currentVariables, X: xVal };
                const processed = processForEval("(" + left + ")-(" + right + ")", solveVars, config.angle);
                const mathNames = Object.getOwnPropertyNames(Math).filter(name => typeof Math[name] === 'function');
                const mathFuncs = mathNames.reduce((acc, name) => {
                    acc[name] = Math[name];
                    return acc;
                }, {});
                const angleFactor = config.angle === 'Rad' ? 1 : (config.angle === 'Deg' ? Math.PI / 180 : Math.PI / 200);
                const scope = {
                    ...mathFuncs,
                    PI: Math.PI, E: Math.E,
                    log: Math.log10,
                    log10: Math.log10,
                    ln: Math.log,
                    Rnd: (x) => Number(Number(x).toPrecision(10)),
                    sin: (x) => { let r = Math.sin(x * angleFactor); return Math.abs(r) < 1e-15 ? 0 : r; },
                    cos: (x) => { let r = Math.cos(x * angleFactor); return Math.abs(r) < 1e-15 ? 0 : r; },
                    tan: (x) => {
                        const res = Math.tan(x * angleFactor);
                        if (Math.abs(res) < 1e-15) return 0;
                        return Math.abs(res) > 1e14 ? Infinity : res;
                    },
                    asin: (x) => {
                        if (x < -1 || x > 1) throw new Error("Math ERROR");
                        const res = Math.asin(x);
                        return config.angle === 'Deg' ? res * (180 / Math.PI) : (config.angle === 'Gra' ? res * (200 / Math.PI) : res);
                    },
                    acos: (x) => {
                        if (x < -1 || x > 1) throw new Error("Math ERROR");
                        const res = Math.acos(x);
                        return config.angle === 'Deg' ? res * (180 / Math.PI) : (config.angle === 'Gra' ? res * (200 / Math.PI) : res);
                    },
                    atan: (x) => {
                        const res = Math.atan(x);
                        return config.angle === 'Deg' ? res * (180 / Math.PI) : (config.angle === 'Gra' ? res * (200 / Math.PI) : res);
                    },
                    sinh: (x) => Math.sinh(x),
                    cosh: (x) => Math.cosh(x),
                    tanh: (x) => Math.tanh(x),
                    asinh: (x) => Math.asinh(x),
                    acosh: (x) => Math.acosh(x),
                    atanh: (x) => Math.atanh(x),
                    e: Math.E,
                    exp: Math.exp,
                    pow10: (x) => Math.pow(10, x),
                    abs: (x) => Math.abs(x),
                    Abs: (x) => Math.abs(x),
                    ...solveVars,
                    Ans: lastAnswer || 0
                };
                const scopeKeys = Object.keys(scope);
                const scopeVals = scopeKeys.map(k => scope[k]);

                const evalFn = new Function(...scopeKeys, `return (${processed});`);
                return evalFn(...scopeVals);
            };

            // Newton's Method
            for (let i = 0; i < 40; i++) {
                const fx = f(x0);
                if (Math.abs(fx) < 1e-12) break;
                const h = 1e-6;
                const dfx = (f(x0 + h) - fx) / h;
                if (dfx === 0) break;
                x0 = x0 - fx / dfx;
            }

            setVariables(prev => ({ ...prev, X: x0 }));
            const diff = f(x0);
            if (isNaN(x0) || !isFinite(x0)) throw new Error("Math ERROR");

            setResult(
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: '100%' }}>
                    <div style={{ fontSize: '14px' }}>X = {formatValue(x0, config)}</div>
                    <div style={{ fontSize: '10px' }}>L - R = {Math.abs(diff) < 1e-15 ? "0" : diff.toExponential(2)}</div>
                </div>
            );
            setIsComplete(true);
            setIsSolving(false);
        } catch (e) {
            setResult("NaN");
            setIsComplete(true);
            setIsSolving(false);
        }
    };

    const renderFormattedExpression = () => {
        if (config.display === 'LineIO') {
            return (
                <div className="math-line expression">
                    {expression.slice(0, cursorPosition)}
                    <span className="lcd-cursor"></span>
                    {expression.slice(cursorPosition)}
                </div>
            );
        }

        // MthIO Rendering
        let currentPos = 0;
        const resultJSX = [];

        // Helper to format basic symbols inside boxes (superscripts, etc.)
        const formatInternal = (text) => {
            if (!text) return "";
            const parts = [];
            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                if (char === "²" || char === "³" || char === "!" || char === "⁻" || (char === "-" && text[i + 1] === "¹")) {
                    if (char === "⁻" || (char === "-" && text[i + 1] === "¹")) {
                        parts.push(<sup key={i}>-1</sup>);
                        if (char === "-") i++;
                    } else {
                        parts.push(<sup key={i}>{char}</sup>);
                    }
                } else {
                    parts.push(char);
                }
            }
            return parts;
        };

        const renderBoxed = (val, startPos, type = "normal") => {
            val = val || "";
            const isActive = currentPos >= startPos && currentPos <= startPos + val.length;
            const isEmpty = val.length === 0;

            let baseClass = "";
            if (type === "tiny") {
                baseClass = isEmpty ? "mth-empty-box-tiny" : "mth-filled-box-tiny";
            } else {
                baseClass = isEmpty ? "mth-empty-box" : "mth-filled-box";
            }

            const className = isActive ? `${baseClass} active-box` : baseClass;

            const handleClick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                setCursorPosition(startPos + val.length);
            };

            if (isActive) {
                if (isEmpty) {
                    return <span className={className} onPointerDown={handleClick}><span className="lcd-cursor"></span></span>;
                }
                const before = val.slice(0, cursorPosition - startPos);
                const after = val.slice(cursorPosition - startPos);
                return (
                    <span className={className} onPointerDown={handleClick}>
                        {formatInternal(before)}
                        <span className="lcd-cursor"></span>
                        {formatInternal(after)}
                    </span>
                );
            }
            return (
                <span className={className} onPointerDown={handleClick}>
                    {isEmpty ? "" : formatInternal(val)}
                </span>
            );
        };

        const findMatchingParen = (str, openIdx) => {
            let depth = 1;
            for (let j = openIdx + 1; j < str.length; j++) {
                if (str[j] === '(') depth++;
                else if (str[j] === ')') depth--;
                if (depth === 0) return j;
            }
            return -1;
        };

        // Simple tokenizer for templates
        const process = (expr) => {
            let i = 0;
            while (i < expr.length) {
                const char = expr[i];

                // Cursor here?
                if (currentPos === cursorPosition) resultJSX.push(<span key={`c-${i}`} className="lcd-cursor"></span>);

                if (expr.substring(i, i + 2) === "∫(") {
                    const end = findMatchingParen(expr, i + 1);
                    const innerStr = end !== -1 ? expr.substring(i + 2, end) : expr.substring(i + 2);
                    const parts = innerStr.split("‡");

                    const integrand = parts[0] || "";
                    const lower = parts[1] || "";
                    const upper = parts[2] || "";

                    const intStart = i + 2;
                    const lowStart = intStart + integrand.length + 1;
                    const upStart = lowStart + lower.length + 1;

                    resultJSX.push(
                        <span key={`int-${i}`} className="mth-integral">
                            <span className="mth-integral-sign">∫</span>
                            <span className="mth-limits">
                                <span className="mth-upper">
                                    {renderBoxed(upper, upStart, "tiny")}
                                </span>
                                <span className="mth-lower">
                                    {renderBoxed(lower, lowStart, "tiny")}
                                </span>
                            </span>
                            <span className="mth-integrand">
                                {renderBoxed(integrand, intStart, "normal")}
                            </span>
                            <span className="mth-dx">d<i>x</i></span>
                        </span>
                    );

                    i = end !== -1 ? end + 1 : expr.length;
                    currentPos = i;
                    continue;
                }

                if (expr.substring(i, i + 5) === "d/dX(") {
                    const end = findMatchingParen(expr, i + 4);
                    const innerStr = end !== -1 ? expr.substring(i + 5, end) : expr.substring(i + 5);
                    const parts = innerStr.split("‡");
                    const integrand = parts[0] || "";
                    const val = parts[1] || "";

                    const intStart = i + 5;
                    const valStart = intStart + integrand.length + 1;

                    resultJSX.push(
                        <span key={`deriv-${i}`} className="mth-deriv">
                            <span className="mth-deriv-frac">
                                <span className="mth-deriv-d">d</span>
                                <span className="mth-deriv-line"></span>
                                <span className="mth-deriv-dx">d<i>X</i></span>
                            </span>
                            <span className="mth-deriv-main-group">
                                <span className="mth-deriv-paren">(</span>
                                <span className="mth-integrand">
                                    {renderBoxed(integrand, intStart, "normal")}
                                </span>
                                <span className="mth-deriv-paren">)</span>
                            </span>
                            <span className="mth-deriv-eval-group">
                                <span className="mth-deriv-vbar"></span>
                                <span className="mth-deriv-sub">
                                    <i className="mth-x-label">X</i>=
                                    {renderBoxed(val, valStart, "tiny")}
                                </span>
                            </span>
                        </span>
                    );
                    i = end !== -1 ? end + 1 : expr.length;
                    currentPos = i;
                    continue;
                }

                if (expr.substring(i, i + 4) === "Abs(") {
                    const end = findMatchingParen(expr, i + 3);
                    const innerStr = end !== -1 ? expr.substring(i + 4, end) : expr.substring(i + 4);
                    const innerStart = i + 4;
                    resultJSX.push(
                        <span key={`abs-${i}`} className="mth-abs-template" style={{ borderLeft: '1.2px solid #000', borderRight: '1.2px solid #000', padding: '0 3px', margin: '0 2px', display: 'inline-flex', alignItems: 'center' }}>
                            {renderBoxed(innerStr, innerStart, "normal")}
                        </span>
                    );
                    i = end !== -1 ? end + 1 : expr.length;
                    currentPos = i;
                    continue;
                }

                if (expr.substring(i, i + 2) === "q(") {
                    const end = findMatchingParen(expr, i + 1);
                    const innerStr = end !== -1 ? expr.substring(i + 2, end) : expr.substring(i + 2);
                    const parts = innerStr.split("‡");
                    const num = parts[0] || ""; const den = parts[1] || "";
                    const numStart = i + 2; const denStart = numStart + num.length + 1;
                    resultJSX.push(
                        <span key={`q-${i}`} className="mth-frac" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', verticalAlign: 'middle', margin: '0 2px' }}>
                            <span className="mth-num" style={{ padding: '0 2px', borderBottom: '1.5px solid #000' }}>
                                {renderBoxed(num, numStart, "normal")}
                            </span>
                            <span className="mth-den" style={{ padding: '0 2px' }}>
                                {renderBoxed(den, denStart, "normal")}
                            </span>
                        </span>
                    );
                    i = end !== -1 ? end + 1 : expr.length;
                    currentPos = i;
                    continue;
                }

                if (expr.substring(i, i + 3) === "mf(") {
                    const end = findMatchingParen(expr, i + 2);
                    const innerStr = end !== -1 ? expr.substring(i + 3, end) : expr.substring(i + 3);
                    const parts = innerStr.split("‡");
                    const whole = parts[0] || ""; const num = parts[1] || ""; const den = parts[2] || "";
                    const wStart = i + 3; const nStart = wStart + whole.length + 1; const dStart = nStart + num.length + 1;
                    resultJSX.push(
                        <span key={`mf-${i}`} className="mth-mixed-frac" style={{ display: 'inline-flex', alignItems: 'center', margin: '0 2px' }}>
                            <span className="mth-whole" style={{ marginRight: '1px' }}>
                                {renderBoxed(whole, wStart, "normal")}
                            </span>
                            <span className="mth-frac" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', verticalAlign: 'middle' }}>
                                <span className="mth-num" style={{ padding: '0 2px', borderBottom: '1.5px solid #000' }}>
                                    {renderBoxed(num, nStart, "normal")}
                                </span>
                                <span className="mth-den" style={{ padding: '0 2px' }}>
                                    {renderBoxed(den, dStart, "normal")}
                                </span>
                            </span>
                        </span>
                    );
                    i = end !== -1 ? end + 1 : expr.length;
                    currentPos = i;
                    continue;
                }

                if (expr.substring(i, i + 4) === "log(") {
                    const end = findMatchingParen(expr, i + 3);
                    const innerStr = end !== -1 ? expr.substring(i + 4, end) : expr.substring(i + 4);
                    // Standard log(100) will be split by ‡ (returns ["100"]), template log(2‡100) returns ["2", "100"].
                    // Actually wait, if the user typed log(100), parts[1] is undefined.
                    // If parts[1] is undefined, it's a regular log. If parts[1] is defined, it's a template log.
                    // But in our previous implementation, we had a template log `log(base‡val)` vs `log(val)`?
                    // Previous implementation: `expr.substring(i + 4, end).split(",")`. Same logic applied.
                    const parts = innerStr.split("‡");
                    if (parts.length > 1) {
                        const base = parts[0] || "";
                        const val = parts[1] || "";
                        const baseStart = i + 4;
                        const valStart = baseStart + base.length + 1;

                        resultJSX.push(
                            <span key={`log-${i}`} className="mth-log">
                                <span>log</span>
                                <span className="mth-log-base">
                                    {renderBoxed(base, baseStart, "tiny")}
                                </span>
                                <span className="mth-log-val-group">
                                    <span className="mth-log-paren">(</span>
                                    {renderBoxed(val, valStart, "normal")}
                                    <span className="mth-log-paren">)</span>
                                </span>
                            </span>
                        );
                        i = end !== -1 ? end + 1 : expr.length;
                        currentPos = i;
                        continue;
                    }
                    // if it doesn't have ‡, let it fall through to regular character parsing
                }

                if (expr.substring(i, i + 2) === "Σ(") {
                    const end = findMatchingParen(expr, i + 1);
                    const innerStr = end !== -1 ? expr.substring(i + 2, end) : expr.substring(i + 2);
                    const parts = innerStr.split("‡");
                    const integrand = parts[0] || "";
                    const lower = parts[1] || "";
                    const upper = parts[2] || "";
                    const intStart = i + 2;
                    const lowStart = intStart + integrand.length + 1;
                    const upStart = lowStart + lower.length + 1;

                    resultJSX.push(
                        <span key={`sum-${i}`} className="mth-sum">
                            <span className="mth-sum-main">
                                <span className="mth-sum-sign">Σ</span>
                                <span className="mth-sum-limits-stack">
                                    <span className="mth-upper-compact">
                                        {renderBoxed(upper, upStart, "tiny")}
                                    </span>
                                    <span className="mth-lower-compact">
                                        <span className="mth-x-label-compact">X=</span>
                                        {renderBoxed(lower, lowStart, "tiny")}
                                    </span>
                                </span>
                            </span>
                            <span className="mth-sum-expr-group">
                                <span className="mth-sum-paren">(</span>
                                {renderBoxed(integrand, intStart, "normal")}
                                <span className="mth-sum-paren">)</span>
                            </span>
                        </span>
                    );
                    i = end !== -1 ? end + 1 : expr.length;
                    currentPos = i;
                    continue;
                }

                if (expr.substring(i, i + 3) === "pw(") {
                    const end = findMatchingParen(expr, i + 2);
                    const innerStr = end !== -1 ? expr.substring(i + 3, end) : expr.substring(i + 3);
                    const parts = innerStr.split("‡");
                    const base = parts[0] || ""; const exponent = parts[1] || "";
                    const baseStart = i + 3; const expStart = baseStart + base.length + 1;
                    resultJSX.push(
                        <span key={`pw-${i}`} className="mth-pw-template" style={{ display: 'inline-flex', alignItems: 'baseline' }}>
                            <span className="mth-base">
                                {renderBoxed(base, baseStart, "normal")}
                            </span>
                            <span className="mth-pow" style={{ fontSize: '0.65em', verticalAlign: 'super', marginLeft: '1px', position: 'relative', top: '-0.4em' }}>
                                {renderBoxed(exponent, expStart, "tiny")}
                            </span>
                        </span>
                    );
                    i = end !== -1 ? end + 1 : expr.length;
                    currentPos = i;
                    continue;
                }

                if (expr.substring(i, i + 2) === "^(") {
                    const end = findMatchingParen(expr, i + 1);
                    const powExpr = end !== -1 ? expr.substring(i + 2, end) : expr.substring(i + 2);
                    const start = i + 2;
                    resultJSX.push(
                        <span key={`pow-${i}`} className="mth-pow" style={{ fontSize: '0.65em', verticalAlign: 'super', marginLeft: '1px' }}>
                            {renderBoxed(powExpr, start, "tiny")}
                        </span>
                    );
                    i = end !== -1 ? end + 1 : expr.length;
                    currentPos = i;
                    continue;
                }

                if (expr.substring(i, i + 6) === "sroot(") {
                    const end = findMatchingParen(expr, i + 5);
                    const innerStr = end !== -1 ? expr.substring(i + 6, end) : expr.substring(i + 6);
                    const innerStart = i + 6;
                    resultJSX.push(
                        <span key={`sroot-${i}`} className="mth-sqrt" style={{ display: 'inline-flex', alignItems: 'stretch', margin: '0 2px' }}>
                            <span className="mth-root-sign-large" style={{ fontSize: '1.4em', fontFamily: '"Times New Roman", serif', display: 'flex', alignItems: 'flex-end', transform: 'scale(0.9, 1.25)', marginRight: '-1px', zIndex: 1, paddingBottom: '1px' }}>√</span>
                            <span className="mth-root-inner" style={{ borderTop: '1.2px solid #000', padding: '1px 3px 0 1px', marginTop: '2.5px', minHeight: '16px', display: 'flex', alignItems: 'center' }}>
                                {renderBoxed(innerStr, innerStart, "normal")}
                            </span>
                        </span>
                    );
                    i = end !== -1 ? end + 1 : expr.length;
                    currentPos = i;
                    continue;
                }

                if (expr.substring(i, i + 6) === "croot(") {
                    const end = findMatchingParen(expr, i + 5);
                    const innerStr = end !== -1 ? expr.substring(i + 6, end) : expr.substring(i + 6);
                    const innerStart = i + 6;
                    resultJSX.push(
                        <span key={`croot-${i}`} className="mth-croot mth-root-n-container" style={{ display: 'inline-flex', alignItems: 'flex-start', margin: '0 2px' }}>
                            <span className="mth-root-n-index" style={{ fontSize: '0.6em', marginRight: '-3px', marginTop: '2px', position: 'relative', zIndex: 2 }}>3</span>
                            <span className="mth-sqrt" style={{ display: 'inline-flex', alignItems: 'stretch' }}>
                                <span className="mth-root-sign-large" style={{ fontSize: '1.4em', fontFamily: '"Times New Roman", serif', display: 'flex', alignItems: 'flex-end', transform: 'scale(0.9, 1.25)', marginRight: '-1px', zIndex: 1, paddingBottom: '1px' }}>√</span>
                                <span className="mth-root-inner" style={{ borderTop: '1.2px solid #000', padding: '1px 3px 0 1px', marginTop: '2.5px', minHeight: '16px', display: 'flex', alignItems: 'center' }}>
                                    {renderBoxed(innerStr, innerStart, "normal")}
                                </span>
                            </span>
                        </span>
                    );
                    i = end !== -1 ? end + 1 : expr.length;
                    currentPos = i;
                    continue;
                }

                if (expr.substring(i, i + 4) === "l10(") {
                    const end = findMatchingParen(expr, i + 3);
                    const innerStr = end !== -1 ? expr.substring(i + 4, end) : expr.substring(i + 4);
                    const innerStart = i + 4;
                    resultJSX.push(
                        <span key={`l10-${i}`} className="mth-l10-template">
                            <span>log</span>
                            <span className="mth-log-val-group">
                                <span className="mth-log-paren">(</span>
                                {renderBoxed(innerStr, innerStart, "normal")}
                                <span className="mth-log-paren">)</span>
                            </span>
                        </span>
                    );
                    i = end !== -1 ? end + 1 : expr.length;
                    currentPos = i;
                    continue;
                }

                if (expr.substring(i, i + 3) === "tx(") {
                    const end = findMatchingParen(expr, i + 2);
                    const innerStr = end !== -1 ? expr.substring(i + 3, end) : expr.substring(i + 3);
                    const innerStart = i + 3;
                    resultJSX.push(
                        <span key={`tx-${i}`} className="mth-tx-template" style={{ display: 'inline-flex', alignItems: 'baseline' }}>
                            <span>10</span>
                            <span className="mth-pow" style={{ fontSize: '0.65em', verticalAlign: 'super', marginLeft: '1px', position: 'relative', top: '-0.4em' }}>
                                {renderBoxed(innerStr, innerStart, "tiny")}
                            </span>
                        </span>
                    );
                    i = end !== -1 ? end + 1 : expr.length;
                    currentPos = i;
                    continue;
                }

                if (expr.substring(i, i + 3) === "ln(") {
                    const end = findMatchingParen(expr, i + 2);
                    const innerStr = end !== -1 ? expr.substring(i + 3, end) : expr.substring(i + 3);
                    const innerStart = i + 3;
                    resultJSX.push(
                        <span key={`ln-${i}`} className="mth-ln-template">
                            <span>ln</span>
                            <span className="mth-log-val-group">
                                <span className="mth-log-paren">(</span>
                                {renderBoxed(innerStr, innerStart, "normal")}
                                <span className="mth-log-paren">)</span>
                            </span>
                        </span>
                    );
                    i = end !== -1 ? end + 1 : expr.length;
                    currentPos = i;
                    continue;
                }

                if (expr.substring(i, i + 3) === "ex(") {
                    const end = findMatchingParen(expr, i + 2);
                    const innerStr = end !== -1 ? expr.substring(i + 3, end) : expr.substring(i + 3);
                    const innerStart = i + 3;
                    resultJSX.push(
                        <span key={`ex-${i}`} className="mth-ex-template" style={{ display: 'inline-flex', alignItems: 'baseline' }}>
                            <span style={{ fontStyle: 'italic' }}>e</span>
                            <span className="mth-pow" style={{ fontSize: '0.65em', verticalAlign: 'super', marginLeft: '1px', position: 'relative', top: '-0.4em' }}>
                                {renderBoxed(innerStr, innerStart, "tiny")}
                            </span>
                        </span>
                    );
                    i = end !== -1 ? end + 1 : expr.length;
                    currentPos = i;
                    continue;
                }

                if (expr.substring(i, i + 3) === "rt(") {
                    const end = findMatchingParen(expr, i + 2);
                    const innerStr = end !== -1 ? expr.substring(i + 3, end) : expr.substring(i + 3);
                    const parts = innerStr.split("‡");
                    const idx = parts[0] || ""; const val = parts[1] || "";
                    const idxStart = i + 3; const valStart = idxStart + idx.length + 1;
                    resultJSX.push(
                        <span key={`rt-${i}`} className="mth-croot mth-root-n-container" style={{ display: 'inline-flex', alignItems: 'flex-start', margin: '0 2px' }}>
                            <span className="mth-root-n-index" style={{ fontSize: '0.6em', marginRight: '-3px', marginTop: '3px', position: 'relative', zIndex: 2 }}>
                                {renderBoxed(idx, idxStart, "tiny")}
                            </span>
                            <span className="mth-sqrt" style={{ display: 'inline-flex', alignItems: 'stretch' }}>
                                <span className="mth-root-sign-large" style={{ fontSize: '1.4em', fontFamily: '"Times New Roman", serif', display: 'flex', alignItems: 'flex-end', transform: 'scale(0.9, 1.25)', marginRight: '-1px', zIndex: 1, paddingBottom: '1px' }}>√</span>
                                <span className="mth-root-inner" style={{ borderTop: '1.2px solid #000', padding: '1px 3px 0 1px', marginTop: '2.5px', minHeight: '16px', display: 'flex', alignItems: 'center' }}>
                                    {renderBoxed(val, valStart, "normal")}
                                </span>
                            </span>
                        </span>
                    );
                    i = end !== -1 ? end + 1 : expr.length;
                    currentPos = i;
                    continue;
                }

                if (expr.substring(i, i + 2) === "∛(") {
                    resultJSX.push(<span key={i}><sup style={{ fontSize: '0.6em', marginRight: '-2px' }}>3</sup>√</span>);
                    i++; currentPos++; continue;
                }

                if (expr[i] === "√") {
                    resultJSX.push(<span key={i}>√</span>);
                    i++; currentPos++; continue;
                }

                if (char === "°" || char === "'" || char === '"') {
                    resultJSX.push(<span key={i} style={{ fontSize: '0.9em', verticalAlign: 'top', marginLeft: '1px' }}>{char}</span>);
                    i++; currentPos++; continue;
                }

                if (char === "∠") {
                    resultJSX.push(<span key={i} style={{ fontFamily: 'serif', fontSize: '1.2em' }}>∠</span>);
                    i++; currentPos++; continue;
                }

                if (expr.substring(i, i + 4) === "Pol(") {
                    const end = findMatchingParen(expr, i + 3);
                    const innerStr = end !== -1 ? expr.substring(i + 4, end) : expr.substring(i + 4);
                    const innerStart = i + 4;
                    resultJSX.push(
                        <span key={`pol-${i}`} className="mth-pol-template">
                            <span>Pol</span>
                            <span className="mth-log-val-group">
                                <span className="mth-log-paren">(</span>
                                {renderBoxed(innerStr, innerStart, "normal")}
                                <span className="mth-log-paren">)</span>
                            </span>
                        </span>
                    );
                    i = end !== -1 ? end + 1 : expr.length;
                    currentPos = i;
                    continue;
                }

                if (expr.substring(i, i + 4) === "Rec(") {
                    const end = findMatchingParen(expr, i + 3);
                    const innerStr = end !== -1 ? expr.substring(i + 4, end) : expr.substring(i + 4);
                    const innerStart = i + 4;
                    resultJSX.push(
                        <span key={`rec-${i}`} className="mth-rec-template">
                            <span>Rec</span>
                            <span className="mth-log-val-group">
                                <span className="mth-log-paren">(</span>
                                {renderBoxed(innerStr, innerStart, "normal")}
                                <span className="mth-log-paren">)</span>
                            </span>
                        </span>
                    );
                    i = end !== -1 ? end + 1 : expr.length;
                    currentPos = i;
                    continue;
                }

                if (char === "⁻") {
                    resultJSX.push(<sup key={i}>-</sup>);
                    i++; currentPos++; continue;
                }
                if (char === "¹") {
                    resultJSX.push(<sup key={i}>1</sup>);
                    i++; currentPos++; continue;
                }

                if (expr.substring(i, i + 3) === "sq(") {
                    const end = findMatchingParen(expr, i + 2);
                    const innerStr = end !== -1 ? expr.substring(i + 3, end) : expr.substring(i + 3);
                    const innerStart = i + 3;
                    resultJSX.push(
                        <span key={`sq-${i}`} className="mth-sq-template" style={{ display: 'inline-flex', alignItems: 'center' }}>
                            {renderBoxed(innerStr, innerStart, "normal")}
                            <sup className="mth-post-unit">2</sup>
                        </span>
                    );
                    i = end !== -1 ? end + 1 : expr.length;
                    currentPos = i;
                    continue;
                }

                if (expr.substring(i, i + 3) === "cb(") {
                    const end = findMatchingParen(expr, i + 2);
                    const innerStr = end !== -1 ? expr.substring(i + 3, end) : expr.substring(i + 3);
                    const innerStart = i + 3;
                    resultJSX.push(
                        <span key={`cb-${i}`} className="mth-cb-template" style={{ display: 'inline-flex', alignItems: 'center' }}>
                            {renderBoxed(innerStr, innerStart, "normal")}
                            <sup className="mth-post-unit">3</sup>
                        </span>
                    );
                    i = end !== -1 ? end + 1 : expr.length;
                    currentPos = i;
                    continue;
                }

                if (char === "!") {
                    resultJSX.push(<sup key={i} className="mth-post-unit">!</sup>);
                } else if (char === "²" || char === "³" || char === "⁻¹" || char === "°" || char === "ʳ" || char === "ᵍ") {
                    resultJSX.push(<sup key={i} className="mth-post-unit">{char}</sup>);
                } else {
                    resultJSX.push(char);
                }
                i++;
                currentPos++;
            }
            // Final cursor if at the end
            if (currentPos === cursorPosition) resultJSX.push(<span key="final-c" className="lcd-cursor"></span>);
        };

        process(expression);
        return <div className="math-line expression">{resultJSX}</div>;
    };

    const renderFinalResult = () => {
        if (!result) return "";
        if (typeof result !== 'string' && React.isValidElement(result)) return result;

        const resStr = result.toString();
        if (resStr.includes("ERROR")) return resStr;
        if (resStr.includes("→") || resStr.includes("=")) return resStr;
        if (resStr.startsWith("[")) return resStr; // Vector result as-is

        // Custom renderer for exact objects (rational/surd)
        const renderExact = (exact, key, forcePositive = false) => {
            if (!exact) return null;
            if (exact.type === 'rational') {
                const n = forcePositive ? Math.abs(exact.n) : exact.n;
                if (exact.d === 1) return <span key={key}>{n}</span>;
                return (
                    <div key={key} className="mth-frac result-frac" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.85em', verticalAlign: 'middle' }}>
                        <span className="mth-num" style={{ borderBottom: '1.2px solid #000', padding: '0 2px' }}>{n}</span>
                        <span className="mth-den" style={{ padding: '0 2px' }}>{exact.d}</span>
                    </div>
                );
            }
            if (exact.type === 'surd') {
                const coeffNum = forcePositive ? Math.abs(exact.coeffNum) : exact.coeffNum;
                const numPart = (
                    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                        {Math.abs(coeffNum) !== 1 && <span>{coeffNum}</span>}
                        {coeffNum === -1 && <span>-</span>}
                        <span style={{ fontSize: '1.2em', fontFamily: 'serif', marginRight: '-1px' }}>√</span>
                        <span style={{ borderTop: '1.2px solid #000', padding: '0 2px 0 1px', marginTop: '1.5px', lineHeight: '1.1' }}>{exact.surd}</span>
                    </span>
                );
                if (exact.denom === 1) return <span key={key}>{numPart}</span>;
                return (
                    <div key={key} className="mth-frac result-frac" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.85em', verticalAlign: 'middle' }}>
                        <span className="mth-num" style={{ borderBottom: '1.2px solid #000', padding: '0 2px' }}>{numPart}</span>
                        <span className="mth-den" style={{ padding: '0 2px' }}>{exact.denom}</span>
                    </div>
                );
            }
            // Missing closing brace for surd type check was here
            if (exact.type === 'pi' || exact.type === 'e') {
                const n = forcePositive ? Math.abs(exact.n) : exact.n;
                const symbol = exact.type === 'pi' ? "π" : <i style={{ fontFamily: 'serif' }}>e</i>;
                const numPart = (
                    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                        {n === 1 && <span>{symbol}</span>}
                        {n === -1 && <span>-{symbol}</span>}
                        {Math.abs(n) !== 1 && <span>{n}{symbol}</span>}
                    </span>
                );
                if (exact.d === 1) return <span key={key}>{numPart}</span>;
                return (
                    <div key={key} className="mth-frac result-frac" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.85em', verticalAlign: 'middle' }}>
                        <span className="mth-num" style={{ borderBottom: '1.2px solid #000', padding: '0 2px' }}>{numPart}</span>
                        <span className="mth-den" style={{ padding: '0 2px' }}>{exact.d}</span>
                    </div>
                );
            }
            return null;
        };

        // 1. Handle Complex Results in Fractions
        if (currentMode === "CMPLX" && isFractionDisplay && config.display === 'MthIO') {
            // Updated regex to handle optional real part, mandatory imaginary part, and scientific notation
            // Groups: 1=RealPart, 2=ImaginaryPart
            const complexMatch = resStr.match(/^([-+]?\d*\.?\d*(?:[eE][-+]?\d+)?)?([-+]\d*\.?\d*(?:[eE][-+]?\d+)?)i$/)
                || resStr.match(/^([-+]?\d*\.?\d*(?:[eE][-+]?\d+)?)i$/);

            let reVal = 0;
            let imVal = 0;
            let matched = false;

            if (complexMatch) {
                matched = true;
                if (complexMatch.length === 3) {
                    // Two parts or one part with sign
                    if (resStr.endsWith('i') && !resStr.includes('+', 1) && !resStr.includes('-', 1)) {
                        // Only Im part was matched by the second regex
                        const imStr = complexMatch[1];
                        imVal = (imStr === "" || imStr === "+") ? 1 : (imStr === "-" ? -1 : parseFloat(imStr));
                    } else {
                        reVal = (complexMatch[1] === "" || complexMatch[1] === undefined) ? 0 : parseFloat(complexMatch[1]);
                        const imStr = complexMatch[2];
                        imVal = (imStr === "+" || imStr === "") ? 1 : (imStr === "-" ? -1 : parseFloat(imStr));
                    }
                } else {
                    const imStr = complexMatch[1];
                    imVal = (imStr === "" || imStr === "+") ? 1 : (imStr === "-" ? -1 : parseFloat(imStr));
                }
            } else if (!isNaN(parseFloat(resStr)) && !resStr.includes("i")) {
                // Pure real result in complex mode
                reVal = parseFloat(resStr);
                matched = true;
            }

            if (matched) {
                const reExact = reVal !== 0 ? getExactValue(reVal) : null;
                const imExact = imVal !== 0 ? getExactValue(imVal) : null;

                if (reExact || imExact) {
                    const elements = [];
                    if (reExact) elements.push(renderExact(reExact, "re"));

                    if (imExact) {
                        const sign = (imVal > 0 && reExact) ? "+" : (imVal < 0 ? "-" : "");
                        if (sign) elements.push(<span key="sign" style={{ margin: '0 2px' }}>{sign}</span>);

                        // Handle "i" specifically - avoid "1i"
                        const isOneValue = (imExact.type === 'rational' && Math.abs(imExact.n) === Math.abs(imExact.d) && Math.abs(imExact.n) === 1) ||
                            (imExact.type === 'surd' && Math.abs(imExact.coeffNum) === 1 && imExact.surd === 1 && imExact.denom === 1);

                        if (!isOneValue) {
                            elements.push(renderExact(imExact, "im", true));
                        }
                        elements.push(<span key="i" style={{ fontStyle: 'italic', marginLeft: '1px' }}>i</span>);
                    }
                    if (elements.length > 0) return <div className="complex-result-wrap" style={{ display: 'inline-flex', alignItems: 'center' }}>{elements}</div>;
                }
            }
        }

        const val = parseFloat(lastAnswer);
        if (isNaN(val)) return resStr;

        if (isFractionDisplay && config.display === 'MthIO') {
            const exact = getExactValue(val);
            if (exact) {
                if (fractionMode === "mixed" && exact.type === 'rational') {
                    const mixed = getMixedFraction(val);
                    if (mixed && mixed.d !== 1 && mixed.n !== 0) {
                        return (
                            <div className="mth-mixed-frac result-frac" style={{ display: 'inline-flex', alignItems: 'center' }}>
                                {mixed.w !== 0 && <span className="mth-whole" style={{ marginRight: '1px' }}>{mixed.w}</span>}
                                <div className="mth-frac" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.85em' }}>
                                    <span className="mth-num" style={{ borderBottom: '1.2px solid #000', padding: '0 2px' }}>{mixed.n}</span>
                                    <span className="mth-den" style={{ padding: '0 2px' }}>{mixed.d}</span>
                                </div>
                            </div>
                        );
                    }
                }
                const exactUI = renderExact(exact, "single");
                if (exactUI) return exactUI;
            }
        }

        return resStr;
    };

    const handleSimpleButton = (label) => {
        // Clear MRC double-press state if any other button is pressed
        if (label !== "MRC") setIsMrcPressed(false);

        if (label === "AC") {
            setSimpleExpr("");
            setSimpleRes("");
            setHistoryStep(-1);
            setIsCorrectMode(false);
            return;
        }
        if (label === "CE") {
            setSimpleExpr("");
            setSimpleRes("");
            setIsCorrectMode(false);
            return;
        }
        if (label === "π") {
            setSimpleExpr(prev => prev + "π");
            return;
        }
        if (label === "e") {
            setSimpleExpr(prev => prev + "e");
            return;
        }
        if (label === "DEL") {
            setSimpleExpr(prev => prev.slice(0, -1));
            return;
        }

        const evaluateRes = (expr) => {
            try {
                const s = expr
                    .replace(/×/g, "*")
                    .replace(/÷/g, "/")
                    // Handle implicit multiplication (e.g., 2π -> 2*π)
                    .replace(/(\d+)([πe])/g, "$1*$2")
                    .replace(/([πe])(\d+)/g, "$1*$2")
                    .replace(/([πe])([πe])/g, "$1*$2")
                    .replace(/π/g, "(Math.PI)")
                    .replace(/(?<![a-zA-Z])e+/g, (m) => "(Math.E)".repeat(m.length));
                let res = eval(s);
                // Precision Fix
                if (Math.abs(res - Math.round(res)) < 0.000001) res = Math.round(res);
                return Number(parseFloat(res.toFixed(10)));
            } catch (e) { return null; }
        };

        if (label === "=") {
            if (!simpleExpr || isCorrectMode) {
                if (isCorrectMode && historyStep !== -1) {
                    const res = evaluateRes(simpleExpr);
                    if (res !== null) {
                        const newHist = [...simpleHistory];
                        newHist[historyStep] = { e: simpleExpr, r: res.toString() };
                        setSimpleHistory(newHist);
                        setSimpleRes(res.toString());
                        setIsCorrectMode(false);
                    }
                }
                return;
            }
            const res = evaluateRes(simpleExpr);
            if (res !== null) {
                const stepRes = res.toString();
                setSimpleRes(stepRes);
                setSimpleGT(prev => prev + res);
                // Save to history
                const newStep = { e: simpleExpr, r: stepRes };
                setSimpleHistory(prev => [newStep, ...prev].slice(0, 100)); // Keep last 100
                setHistoryStep(-1);
            } else {
                setSimpleRes("Error");
            }
            return;
        }

        if (label === "M+") {
            const val = parseFloat(simpleRes) || evaluateRes(simpleExpr) || 0;
            setSimpleMemory(prev => prev + val);
            return;
        }
        if (label === "M-") {
            const val = parseFloat(simpleRes) || evaluateRes(simpleExpr) || 0;
            setSimpleMemory(prev => prev - val);
            return;
        }
        if (label === "MRC") {
            if (isMrcPressed) {
                setSimpleMemory(0);
                setIsMrcPressed(false);
                setSimpleExpr("");
                setSimpleRes("0");
            } else {
                setSimpleRes(simpleMemory.toString());
                setSimpleExpr("M");
                setIsMrcPressed(true);
            }
            return;
        }

        if (label === "MU") {
            if (!simpleExpr) return;
            const match = simpleExpr.match(/(\d+\.?\d*)\s*([+\-×÷])\s*(\d+\.?\d*)$/);
            if (match) {
                const a = parseFloat(match[1]);
                const op = match[2];
                const b = parseFloat(match[3]);
                let res = 0;
                if (op === "+") res = a * (1 + b / 100);
                else if (op === "-") res = a * (1 - b / 100);
                else if (op === "×") res = a * (b / 100);
                else if (op === "÷") res = a / (1 - b / 100);

                if (isNaN(res) || !isFinite(res)) {
                    setSimpleRes("Error");
                } else {
                    const formatted = Number(parseFloat(res.toFixed(6)));
                    setSimpleRes(formatted.toString());
                    setSimpleExpr(formatted.toString());
                }
            }
            return;
        }

        if (label === "REPLAY") {
            if (simpleHistory.length === 0) return;
            const nextStep = (historyStep + 1) % simpleHistory.length;
            setHistoryStep(nextStep);
            setSimpleExpr(simpleHistory[nextStep].e);
            setSimpleRes(simpleHistory[nextStep].r);
            return;
        }

        if (label === "S⇔D") {
            setIsFractionDisplay(!isFractionDisplay);
            return;
        }

        if (label === "CORRECT") {
            if (historyStep === -1) return;
            setIsCorrectMode(true);
            return;
        }

        if (label === ".") {
            const parts = simpleExpr.split(/[\+\-×÷]/);
            const lastPart = parts[parts.length - 1];
            if (lastPart.includes(".")) return;
        }

        if (label === "CORRECT") {
            if (historyStep === -1 && simpleHistory.length > 0) {
                setHistoryStep(0);
                setSimpleExpr(simpleHistory[0].e);
                setSimpleRes(simpleHistory[0].r);
                setIsCorrectMode(true);
            } else if (historyStep !== -1) {
                setIsCorrectMode(true);
            }
            return;
        }

        if (label === "%") {
            if (!simpleExpr) return;
            const match = simpleExpr.match(/(\d+\.?\d*)\s*([+\-×÷])\s*(\d+\.?\d*)$/);
            if (match) {
                const a = parseFloat(match[1]);
                const op = match[2];
                const b = parseFloat(match[3]);
                let res = 0;
                if (op === "+") res = a + (a * b / 100);
                else if (op === "-") res = a - (a * b / 100);
                else if (op === "×") res = a * (b / 100);
                else if (op === "÷") res = (a / b) * 100;

                const formatted = Number(parseFloat(res.toFixed(6)));
                setSimpleRes(formatted.toString());
                setSimpleExpr(formatted.toString());
            } else {
                // If it's just a number, convert to decimal
                try {
                    const val = parseFloat(simpleExpr);
                    if (!isNaN(val)) {
                        const res = val / 100;
                        setSimpleRes(res.toString());
                        setSimpleExpr(res.toString());
                    }
                } catch (e) { }
            }
            return;
        }

        if (label === "GT") {
            setSimpleRes(simpleGT.toString());
            setSimpleExpr("GT");
            return;
        }
        if (label === "00") {
            setSimpleExpr(prev => prev + "00");
            return;
        }
        if (label === "000") {
            setSimpleExpr(prev => prev + "000");
            return;
        }

        // Prevent multiple operators
        const lastChar = simpleExpr[simpleExpr.length - 1];
        const ops = ["+", "-", "×", "÷"];
        if (ops.includes(label) && ops.includes(lastChar)) {
            setSimpleExpr(prev => prev.slice(0, -1) + label);
            return;
        }

        // Reset if showing special markers
        if (simpleExpr === "GT" || simpleExpr === "M") {
            setSimpleExpr(label);
            setSimpleRes("");
            return;
        }

        setSimpleExpr(prev => prev + label);
    };

    const renderSciButton = (btn, i) => (
        <div key={i} className="sci-btn-wrapper">
            <div className="secondary-labels">
                {btn.gold && <span className="lab-gold" dangerouslySetInnerHTML={{ __html: btn.gold }} />}
                {btn.pink && <span className="lab-pink" dangerouslySetInnerHTML={{ __html: btn.pink }} />}
            </div>
            <button
                className={`btn-sci ${isShiftActive && btn.gold && !/^[0-9]$/.test(btn.main) ? 'shifted' : ''}`}
                onClick={() => handleButton(btn)}
            >
                <span dangerouslySetInnerHTML={{
                    __html: btn.main.includes('<div')
                        ? btn.main
                        : btn.main.replace(/\bx\b|(?<=[\d])x|^x$/g, '<i>x</i>')
                }} />
            </button>
        </div>
    );

    return (
        <div className="main-app-container">
            <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-content" style={{ marginTop: '40px' }}>
                    <div
                        className={`sidebar-item ${activeApp === "casio" ? 'active' : ''}`}
                        onClick={() => { setActiveApp("casio"); setIsSidebarOpen(false); }}
                    >
                        <span className="icon">📟</span>
                        <div className="item-text">Casio Scientific</div>
                    </div>
                    <div
                        className={`sidebar-item ${activeApp === "simple" ? 'active' : ''}`}
                        onClick={() => { setActiveApp("simple"); setIsSidebarOpen(false); }}
                    >
                        <span className="icon">✨</span>
                        <div className="item-text">Citizens Calculator</div>
                    </div>
                    <div
                        className={`sidebar-item ${activeApp === "zakat" ? 'active' : ''}`}
                        onClick={() => { setActiveApp("zakat"); setIsSidebarOpen(false); }}
                    >
                        <span className="icon">☪️</span>
                        <div className="item-text">Zakat Calculator</div>
                    </div>
                </div>
            </div>
            {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}

            {activeApp === "casio" ? (
                <div className="casio-body">
                    <div className="casio-inner">
                        {/* Branding & Top LCD Details */}
                        <div className="top-branding" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                            <span className="brand" style={{ position: 'absolute', left: '0' }}>CASIO</span>
                            <div className="settings-icon-inline" title="Settings" onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ cursor: 'pointer', opacity: 0.8, display: 'flex' }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', color: '#fff' }}>
                                    <circle cx="12" cy="12" r="3"></circle>
                                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33 1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82 1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                                </svg>
                            </div>
                            <div className="header-right" style={{ position: 'absolute', right: '0' }}>
                                <div className="model-info">
                                    <span className="model">fx-991ES PLUS</span>
                                </div>
                            </div>
                        </div>


                        {/* LCD Display */}
                        <div className={`display-container ${isPoweredOff ? 'off' : ''}`}>
                            {showStartup && <div className="startup-text">CASIO</div>}
                            {!isPoweredOff && !showStartup && (
                                <>
                                    <div className="display-top-bar">
                                        <span style={{ visibility: isShiftActive ? 'visible' : 'hidden', color: '#000', fontWeight: 'bold' }}>S</span>
                                        <span style={{ visibility: isAlphaActive ? 'visible' : 'hidden', color: 'var(--text-pink)', fontWeight: 'bold', marginLeft: '5px' }}>A</span>
                                        <span style={{ visibility: (variables.M !== 0 && variables.M !== null) ? 'visible' : 'hidden', fontWeight: 'bold', marginLeft: '5px' }}>M</span>
                                        <span style={{ visibility: isStoActive ? 'visible' : 'hidden', fontSize: '8px', marginLeft: '5px' }}>STO</span>
                                        <span style={{ visibility: isRclActive ? 'visible' : 'hidden', fontSize: '8px', marginLeft: '5px' }}>RCL</span>
                                        <span style={{ visibility: currentMode === "BASE-N" ? 'visible' : 'hidden', fontSize: '8px', marginLeft: '5px' }}>{currentBase}</span>
                                        <span style={{ marginLeft: 'auto', fontSize: '8px', opacity: currentMode !== "COMP" ? 1 : 0 }}>{currentMode}</span>
                                        <span style={{ fontSize: '9px', marginLeft: '8px' }}>{config.angle.substring(0, 1)}</span>
                                        <span>Math ▲</span>
                                    </div>
                                    <div className={`display-content ${isComplete ? 'is-complete' : ''}`}>
                                        {isSetupMenuOpen ? (
                                            setupSubState ? (
                                                <div className="math-line prompt-mode" style={{ flexDirection: 'column', alignItems: 'flex-start', color: '#000', padding: '10px' }}>
                                                    <div style={{ fontSize: '14px', marginBottom: '10px' }}>
                                                        {setupSubState === 'fix_prompt' ? 'Fix 0~9?' : (setupSubState === 'sci_prompt' ? 'Sci 0~9?' : 'Norm 1~2?')}
                                                    </div>
                                                    <div style={{ fontSize: '10px', opacity: 0.6 }}>Press number to select or AC to cancel</div>
                                                </div>
                                            ) : (
                                                <div className="mode-menu">
                                                    <div className="mode-col">
                                                        <div>1:MthIO</div>
                                                        <div>3:Deg</div>
                                                        <div>5:Gra</div>
                                                        <div>7:Sci</div>
                                                    </div>
                                                    <div className="mode-col">
                                                        <div>2:LineIO</div>
                                                        <div>4:Rad</div>
                                                        <div>6:Fix</div>
                                                        <div>8:Norm</div>
                                                    </div>
                                                </div>
                                            )
                                        ) : isConvMenuOpen ? (
                                            <div className="math-line prompt-mode" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                                                <div>CONV Number? (01-40)</div>
                                                <div style={{ fontSize: '18px', alignSelf: 'flex-end' }}>{convCode || "__"}</div>
                                            </div>
                                        ) : isConstMenuOpen ? (
                                            <div className="math-line prompt-mode" style={{ flexDirection: 'column', alignItems: 'flex-start', color: '#000' }}>
                                                <div>CONST Number? (01-40)</div>
                                                <div style={{ fontSize: '18px', alignSelf: 'flex-end' }}>{constCode || "__"}</div>
                                            </div>
                                        ) : isMatrixMenuOpen ? (
                                            matrixSubState === 'dim_select' ? (
                                                <div className="mode-menu mat-menu" style={{ flexDirection: 'column', alignItems: 'flex-start', paddingLeft: '10px' }}>
                                                    <div style={{ marginBottom: '4px', fontWeight: 'bold' }}>Dim: Select Matrix</div>
                                                    <div>1:MatA</div>
                                                    <div>2:MatB</div>
                                                    <div>3:MatC</div>
                                                </div>
                                            ) : matrixSubState === 'dim_size_select' ? (
                                                <div className="mode-menu mat-menu" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '5px', paddingLeft: '10px' }}>
                                                    <div style={{ gridColumn: 'span 2', fontWeight: 'bold' }}>Mat{activeMatrixSlot}: Size?</div>
                                                    <div>1: 3x3</div><div>2: 3x2</div>
                                                    <div>3: 3x1</div><div>4: 2x3</div>
                                                    <div>5: 2x2</div><div>6: 2x1</div>
                                                </div>
                                            ) : matrixSubState === 'data_select' ? (
                                                <div className="mode-menu mat-menu" style={{ flexDirection: 'column', alignItems: 'flex-start', paddingLeft: '10px' }}>
                                                    <div style={{ marginBottom: '4px', fontWeight: 'bold' }}>Data: Select Matrix</div>
                                                    <div>1:MatA {matrices.A ? `[${matrices.A.length}x${matrices.A[0].length}]` : '(unset)'}</div>
                                                    <div>2:MatB {matrices.B ? `[${matrices.B.length}x${matrices.B[0].length}]` : '(unset)'}</div>
                                                    <div>3:MatC {matrices.C ? `[${matrices.C.length}x${matrices.C[0].length}]` : '(unset)'}</div>
                                                </div>
                                            ) : matrixSubState === 'data_entry' && matrixEntry ? (
                                                <div className="matrix-entry-container" style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '1px 5px', color: '#000' }}>
                                                    <div style={{ fontSize: '10px', fontWeight: 'bold', borderBottom: '1px solid #000', marginBottom: '1px', paddingBottom: '1px' }}>
                                                        Mat{activeMatrixSlot} ({matrixEntry.rows}x{matrixEntry.cols})
                                                    </div>
                                                    <div className="matrix-grid-scroll" style={{ overflow: 'hidden', flex: 1, display: 'flex', alignItems: 'center' }}>
                                                        <div className="matrix-grid" style={{
                                                            display: 'grid', gridTemplateColumns: `repeat(${matrixEntry.cols}, 1fr)`, gap: '2px',
                                                            padding: '2px', background: 'rgba(0,0,0,0.03)', borderRadius: '2px', width: '100%'
                                                        }}>
                                                            {matrixEntry.data.map((row, r) => row.map((val, c) => (
                                                                <div key={`${r}-${c}`} className={`matrix-cell ${r === matrixEntry.editRow && c === matrixEntry.editCol ? 'active' : ''}`} style={{
                                                                    background: r === matrixEntry.editRow && c === matrixEntry.editCol ? '#2a5' : '#fff',
                                                                    color: r === matrixEntry.editRow && c === matrixEntry.editCol ? '#fff' : '#000',
                                                                    border: '1px solid #777', minHeight: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px',
                                                                    borderRadius: '1px'
                                                                }}>
                                                                    {r === matrixEntry.editRow && c === matrixEntry.editCol ? (matrixEntry.inputBuf || (val !== 0 ? val : "0")) : val}
                                                                </div>
                                                            )))}
                                                        </div>
                                                    </div>
                                                    <div style={{ fontSize: '8px', opacity: 0.6, textAlign: 'center' }}>Keys: Replay Pad | =: Save</div>
                                                </div>
                                            ) : matrixSubState === 'more_select' ? (
                                                <div className="mode-menu mat-menu" style={{ flexDirection: 'column', alignItems: 'flex-start', paddingLeft: '10px' }}>
                                                    <div style={{ marginBottom: '4px', fontWeight: 'bold' }}>Matrix Functions</div>
                                                    <div>1:Rank</div>
                                                    <div>2:Trace</div>
                                                    <div>3:LU_L</div>
                                                    <div>4:LU_U</div>
                                                    <div>5:Inverse</div>
                                                </div>
                                            ) : (
                                                <div className="mode-menu mat-menu">
                                                    <div className="mode-col">
                                                        <div>1:Dim</div>
                                                        <div>3:MatA {matrices.A ? `[${matrices.A.length}x${matrices.A[0].length}]` : ''}</div>
                                                        <div>5:MatC {matrices.C ? `[${matrices.C.length}x${matrices.C[0].length}]` : ''}</div>
                                                        <div>7:Det</div>
                                                        <div>9:More</div>
                                                    </div>
                                                    <div className="mode-col">
                                                        <div>2:Data</div>
                                                        <div>4:MatB {matrices.B ? `[${matrices.B.length}x${matrices.B[0].length}]` : ''}</div>
                                                        <div>6:MatAns {matrices.Ans ? `[${matrices.Ans.length}x${matrices.Ans[0].length}]` : ''}</div>
                                                        <div>8:Trn</div>
                                                    </div>
                                                </div>
                                            )
                                        ) : isVectorMenuOpen ? (
                                            vectorSubState === 'dim_select' ? (
                                                <div className="mode-menu vct-menu" style={{ flexDirection: 'column', alignItems: 'flex-start', paddingLeft: '10px' }}>
                                                    <div style={{ marginBottom: '4px', fontWeight: 'bold' }}>Dim: Select Vector</div>
                                                    <div>1:VctA</div>
                                                    <div>2:VctB</div>
                                                    <div>3:VctC</div>
                                                </div>
                                            ) : vectorSubState === 'dim_choose' ? (
                                                <div className="mode-menu vct-menu" style={{ flexDirection: 'column', alignItems: 'flex-start', paddingLeft: '10px' }}>
                                                    <div style={{ marginBottom: '4px', fontWeight: 'bold' }}>Vct{activeVectorSlot}: Dimension?</div>
                                                    <div>2: 2-D vector</div>
                                                    <div>3: 3-D vector</div>
                                                </div>
                                            ) : vectorSubState === 'data_select' ? (
                                                <div className="mode-menu vct-menu" style={{ flexDirection: 'column', alignItems: 'flex-start', paddingLeft: '10px' }}>
                                                    <div style={{ marginBottom: '4px', fontWeight: 'bold' }}>Data: Select Vector</div>
                                                    <div>1:VctA{vectors.A ? ` [${vectors.A.join(',')}]` : ' (unset)'}</div>
                                                    <div>2:VctB{vectors.B ? ` [${vectors.B.join(',')}]` : ' (unset)'}</div>
                                                    <div>3:VctC{vectors.C ? ` [${vectors.C.join(',')}]` : ' (unset)'}</div>
                                                </div>
                                            ) : vectorSubState === 'data_entry' && vectorEntry ? (
                                                <div className="mode-menu vct-menu" style={{ flexDirection: 'column', alignItems: 'flex-start', paddingLeft: '8px', width: '100%' }}>
                                                    <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>Vct{activeVectorSlot} ({vectorEntry.dim}D)</div>
                                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                                        {vectorEntry.elements.map((el, idx) => (
                                                            <span key={idx} style={{
                                                                background: idx === vectorEntry.editIdx ? '#2a5' : '#ccc',
                                                                color: idx === vectorEntry.editIdx ? '#fff' : '#000',
                                                                padding: '1px 5px', borderRadius: '3px', minWidth: '18px',
                                                                textAlign: 'center', fontSize: '13px'
                                                            }}>
                                                                {idx === vectorEntry.editIdx
                                                                    ? (vectorEntry.inputBuf || '█')
                                                                    : (el !== "" ? el : '?')}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <div style={{ fontSize: '10px', marginTop: '3px', opacity: 0.7 }}>Press = or ▶ to confirm each element</div>
                                                </div>
                                            ) : (
                                                <div className="mode-menu vct-menu">
                                                    <div className="mode-col">
                                                        <div>1:Dim</div>
                                                        <div>3:VctA{vectors.A ? ` [${vectors.A.join(',')}]` : ''}</div>
                                                        <div>5:VctC{vectors.C ? ` [${vectors.C.join(',')}]` : ''}</div>
                                                        <div>7:Dot·</div>
                                                    </div>
                                                    <div className="mode-col">
                                                        <div>2:Data</div>
                                                        <div>4:VctB{vectors.B ? ` [${vectors.B.join(',')}]` : ''}</div>
                                                        <div>6:VctAns{vectors.Ans ? ` [${vectors.Ans.join(',')}]` : ''}</div>
                                                    </div>
                                                </div>
                                            )
                                        ) : isBaseMenuOpen ? (
                                            <div className="mode-menu base-menu">
                                                <div className="mode-col">
                                                    <div>1:and</div>
                                                    <div>3:xor</div>
                                                    <div>5:not</div>
                                                </div>
                                                <div className="mode-col">
                                                    <div>2:or</div>
                                                    <div>4:xnor</div>
                                                    <div>6:neg</div>
                                                </div>
                                            </div>
                                        ) : isHypMenuOpen ? (
                                            <div className="mode-menu hyp-menu" style={{ fontSize: '13px' }}>
                                                <div className="mode-col">
                                                    <div>1:sinh</div>
                                                    <div>2:cosh</div>
                                                    <div>3:tanh</div>
                                                </div>
                                                <div className="mode-col">
                                                    <div>4:sinh⁻¹</div>
                                                    <div>5:cosh⁻¹</div>
                                                    <div>6:tanh⁻¹</div>
                                                </div>
                                            </div>
                                        ) : isCmplxMenuOpen ? (

                                            <div className="mode-menu cmplx-menu">
                                                <div className="mode-col">
                                                    <div>1:arg</div>
                                                    <div>3:Real</div>
                                                    <div>5:▶r∠θ</div>
                                                </div>
                                                <div className="mode-col">
                                                    <div>2:Conjg</div>
                                                    <div>4:Imag</div>
                                                    <div>6:▶a+bi</div>
                                                </div>
                                            </div>
                                        ) : isStatMenuOpen ? (
                                            statSubState === 'data_entry' && statEntry ? (
                                                <div className="matrix-entry-container" style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '1px 5px', color: '#000' }}>
                                                    <div style={{ fontSize: '10px', fontWeight: 'bold', borderBottom: '1px solid #000', marginBottom: '1px', paddingBottom: '1px' }}>
                                                        STAT: {statType} Data
                                                    </div>
                                                    <div className="matrix-grid-scroll" style={{ overflowY: 'auto', flex: 1, maxHeight: '70px', width: '100%', paddingBottom: '5px' }}>
                                                        <div className="matrix-grid" style={{
                                                            display: 'grid', gridTemplateColumns: statType === '1-VAR' ? '1fr' : 'repeat(2, 1fr)', gap: '1px',
                                                            padding: '1px', background: 'rgba(0,0,0,0.03)', borderRadius: '2px', width: '100%'
                                                        }}>
                                                            {statData.map((d, r) => (
                                                                <React.Fragment key={r}>
                                                                    <div className={`matrix-cell ${r === statEntry.editRow && statEntry.editCol === 0 ? 'active' : ''}`} style={{
                                                                        background: r === statEntry.editRow && statEntry.editCol === 0 ? '#2a5' : '#fff',
                                                                        color: r === statEntry.editRow && statEntry.editCol === 0 ? '#fff' : '#000',
                                                                        border: '1px solid #777', minHeight: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px'
                                                                    }}>
                                                                        {r === statEntry.editRow && statEntry.editCol === 0 ? (statEntry.inputBuf || d.x) : d.x}
                                                                    </div>
                                                                    {statType === 'A+BX' && (
                                                                        <div className={`matrix-cell ${r === statEntry.editRow && statEntry.editCol === 1 ? 'active' : ''}`} style={{
                                                                            background: r === statEntry.editRow && statEntry.editCol === 1 ? '#2a5' : '#fff',
                                                                            color: r === statEntry.editRow && statEntry.editCol === 1 ? '#fff' : '#000',
                                                                            border: '1px solid #777', minHeight: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px'
                                                                        }}>
                                                                            {r === statEntry.editRow && statEntry.editCol === 1 ? (statEntry.inputBuf || d.y) : d.y}
                                                                        </div>
                                                                    )}
                                                                </React.Fragment>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div style={{ fontSize: '8px', opacity: 0.6, textAlign: 'center' }}>AC: Exit Data Entry</div>
                                                </div>
                                            ) : statSubState === 'sum_menu' ? (
                                                <div className="mode-menu stat-menu" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '5px', paddingLeft: '10px' }}>
                                                    <div style={{ gridColumn: 'span 2', fontWeight: 'bold' }}>Sum</div>
                                                    <div>1:Σx²</div><div>2:Σx</div>
                                                    {statType === 'A+BX' && (
                                                        <>
                                                            <div>3:Σy</div><div>4:Σy²</div>
                                                            <div>5:Σxy</div>
                                                        </>
                                                    )}
                                                </div>
                                            ) : statSubState === 'var_menu' ? (
                                                <div className="mode-menu stat-menu" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '5px', paddingLeft: '10px' }}>
                                                    <div style={{ gridColumn: 'span 2', fontWeight: 'bold' }}>Var</div>
                                                    <div>1:n</div><div>2:x̄</div>
                                                    <div>3:σx</div><div>4:sx</div>
                                                    {statType === 'A+BX' && (
                                                        <>
                                                            <div>5:ȳ</div><div>6:σy</div>
                                                            <div>7:sy</div>
                                                        </>
                                                    )}
                                                </div>
                                            ) : statSubState === 'reg_menu' ? (
                                                <div className="mode-menu stat-menu" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '5px', paddingLeft: '10px' }}>
                                                    <div style={{ gridColumn: 'span 2', fontWeight: 'bold' }}>Reg</div>
                                                    <div>1:a</div><div>2:b</div>
                                                    <div>3:r</div>
                                                </div>
                                            ) : !statType ? (
                                                <div className="mode-menu stat-menu" style={{ flexDirection: 'column', alignItems: 'flex-start', paddingLeft: '10px' }}>
                                                    <div style={{ marginBottom: '4px', fontWeight: 'bold' }}>Select Stat Type</div>
                                                    <div>1:1-VAR</div>
                                                    <div>2:A+BX</div>
                                                </div>
                                            ) : (
                                                <div className="mode-menu stat-menu">
                                                    <div className="mode-col">
                                                        <div>1:Type</div>
                                                        <div>3:Sum</div>
                                                        {statType === 'A+BX' && <div>5:Reg</div>}
                                                    </div>
                                                    <div className="mode-col">
                                                        <div>2:Data</div>
                                                        <div>4:Var</div>
                                                    </div>
                                                </div>
                                            )
                                        ) : isDrgMenuOpen ? (
                                            <div className="mode-menu drg-menu" style={{ flexDirection: 'column', alignItems: 'flex-start', paddingLeft: '10px' }}>
                                                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>DRG▶</div>
                                                <div>1: °</div>
                                                <div>2: r</div>
                                                <div>3: g</div>
                                            </div>
                                        ) : isClrMenuOpen ? (
                                            <div className="mode-menu clr-menu" style={{ flexDirection: 'column', alignItems: 'flex-start', paddingLeft: '10px' }}>
                                                <div>Clear?</div>
                                                <div>1:Setup</div>
                                                <div>2:Memory</div>
                                                <div>3:All</div>
                                            </div>
                                        ) : isModeMenuOpen ? (
                                            <div className="mode-menu">
                                                <div className="mode-col">
                                                    <div>1:COMP</div>
                                                    <div>3:STAT</div>
                                                    <div>5:EQN</div>
                                                    <div>7:VECTOR</div>
                                                </div>
                                                <div className="mode-col">
                                                    <div>2:CMPLX</div>
                                                    <div>4:BASE-N</div>
                                                    <div>6:MATRIX</div>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                {isPrompting ? (
                                                    <div className="prompt-container">
                                                        <div className="prompt-equation-preview">
                                                            {expression.split("").map((char, idx) => {
                                                                if (Object.keys(variables).includes(char)) {
                                                                    const isActive = char === promptVar;
                                                                    return (
                                                                        <span key={idx} className={isActive ? "active-var-prompt" : "inactive-var-val"}>
                                                                            {isActive ? "(" : `(${variables[char] !== null ? variables[char] : " "})`}
                                                                            {isActive && (promptInput || <span className="lcd-cursor mini"></span>)}
                                                                            {isActive ? ")" : ""}
                                                                        </span>
                                                                    );
                                                                }
                                                                return <span key={idx}>{char}</span>;
                                                            })}
                                                        </div>
                                                        <div className="prompt-footer-unified">
                                                            <div className="prompt-input-line">
                                                                <span className="prompt-label">{promptVar} =</span>
                                                                <span className="prompt-input-val">{promptInput || (variables[promptVar] !== null ? variables[promptVar] : "")}</span>
                                                            </div>
                                                            {promptResult && (
                                                                <div className="prompt-result-view">
                                                                    <span>=</span>
                                                                    <span className="final-val">{promptResult}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        {isMatrixCalcMode ? (
                                                            <>
                                                                <div className="math-line expression" style={{ fontSize: '14px' }}>
                                                                    {matrixExpr || <span className="lcd-cursor"></span>}
                                                                </div>
                                                                <div className="math-line result" style={{ fontSize: '11px', opacity: 0.7, justifyContent: 'flex-start' }}>
                                                                    Press +/-, MatX, or = to evaluate
                                                                </div>
                                                            </>
                                                        ) : isVectorCalcMode ? (
                                                            <>
                                                                <div className="math-line expression" style={{ fontSize: '14px' }}>
                                                                    {vectorExpr || <span className="lcd-cursor"></span>}
                                                                </div>
                                                                <div className="math-line result" style={{ fontSize: '11px', opacity: 0.7, justifyContent: 'flex-start' }}>
                                                                    Press +/- then SHIFT+5 to add vector, or = to evaluate
                                                                </div>
                                                            </>
                                                        ) : renderFormattedExpression()}
                                                        <div className={`math-line result ${isComplete && (result?.toString().includes("ERROR")) ? "error-display" : ""}`}
                                                            style={{ justifyContent: isComplete && (result?.toString().includes("ERROR")) ? 'center' : 'flex-end', fontSize: (result?.toString().includes('Matrix') || result?.toString().startsWith('[')) ? '11px' : 'inherit' }}>
                                                            {isComplete ? (result?.toString().includes('Matrix') || result?.toString().startsWith('[') ? result : renderFinalResult()) : ""}
                                                        </div>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Top Controls: Shift/Alpha, Pad, Mode/On */}
                        <div className="top-buttons-row">
                            <div className="circ-group">
                                <div className="circ-btn-wrapper">
                                    <span className="circ-label gold">SHIFT</span>
                                    <button className="btn-pill" onClick={() => handleButton("SHIFT")}></button>
                                </div>
                                <div className="circ-btn-wrapper">
                                    <span className="circ-label pink">ALPHA</span>
                                    <button className="btn-pill" onClick={() => handleButton("ALPHA")}></button>
                                </div>
                            </div>

                            <div className="replay-section">
                                <span className="replay-text">REPLAY</span>
                                <div className="pad-arrows">
                                    <div className="up" onClick={() => handleButton("▲")}>▲</div>
                                    <div className="down" onClick={() => handleButton("▼")}>▼</div>
                                    <div className="left" onClick={() => handleButton("◀")}>◀</div>
                                    <div className="right" onClick={() => handleButton("▶")}>▶</div>
                                </div>
                            </div>

                            <div className="circ-group">
                                <div className="circ-btn-wrapper">
                                    <span className="circ-label white" style={{ flexDirection: 'row', gap: '5px', width: '70px', justifyContent: 'center', alignItems: 'baseline' }}>
                                        MODE <span style={{ color: 'var(--text-gold)', fontSize: '8.5px' }}>SETUP</span>
                                    </span>

                                    <button className="btn-pill" onClick={() => handleButton("MODE")}></button>
                                </div>
                                <div className="circ-btn-wrapper">
                                    <span className="circ-label white">ON</span>
                                    <button className="btn-pill" onClick={() => handleButton("ON")}></button>
                                </div>
                            </div>
                        </div>

                        {/* Scientific Buttons Grid - Precisely Structured */}
                        <div className="scientific-section">
                            <div className="sci-row-complex">
                                <div className="row-partition">{SCI_ROW_1_LEFT.map(renderSciButton)}</div>
                                <div className="row-spacer"></div> {/* Space for Replay Pad overlap */}
                                <div className="row-partition">{SCI_ROW_1_RIGHT.map(renderSciButton)}</div>
                            </div>
                            <div className="sci-row-standard">
                                {SCI_ROW_2.map(renderSciButton)}
                            </div>
                            <div className="sci-row-standard">
                                {SCI_ROW_3.map(renderSciButton)}
                            </div>
                            <div className="sci-row-standard">
                                {SCI_ROW_4.map(renderSciButton)}
                            </div>
                        </div>

                        {/* Number Pad Grid */}
                        <div className="numpad-grid">
                            {NUM_BUTTONS.map((btn, i) => (
                                <div key={i} className="num-btn-wrapper">
                                    <div className="secondary-labels">
                                        {btn.gold && <span className="lab-gold" dangerouslySetInnerHTML={{ __html: btn.gold }} />}
                                        {btn.pink && <span className="lab-pink" dangerouslySetInnerHTML={{ __html: btn.pink }} />}
                                    </div>
                                    <button
                                        className={`btn-num ${btn.type === 'orange' ? 'btn-lime' : ''} ${btn.main.length > 2 ? 'small' : ''}`}
                                        onClick={() => handleButton(btn)}
                                    >
                                        <span dangerouslySetInnerHTML={{ __html: btn.main }} />
                                    </button>
                                </div>
                            ))}

                        </div>
                    </div>
                </div>
            ) : activeApp === "simple" ? (
                <div className="simple-calc-container">
                    <div className="citizens-calc-card">
                        <div className="citizens-header-gear" onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{
                            position: 'absolute', top: '15px', left: '50%', transform: 'translateX(-50%)', cursor: 'pointer', zIndex: 10, opacity: 0.6
                        }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', color: '#fff' }}>
                                <circle cx="12" cy="12" r="3"></circle>
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33 1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82 1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                            </svg>
                        </div>
                        <div className="citizens-display-container">
                            <div className="citizens-display">
                                <span className={`gt-indicator ${simpleGT !== 0 ? 'visible' : ''}`}>GT</span>
                                <span className={`m-indicator ${simpleMemory !== 0 ? 'visible' : ''}`}>M</span>
                                <div className="citizens-expr" style={
                                    (simpleExpr && simpleExpr.length > 8)
                                        ? { fontSize: (simpleExpr.length > 14 ? '2.2rem' : '3.2rem') }
                                        : {}
                                }>
                                    {isCorrectMode && <span className="correct-tag">CORRECT</span>}
                                    {simpleExpr || "0"}
                                </div>
                                <div className="citizens-res" style={
                                    (simpleRes && simpleRes.length > 9)
                                        ? { fontSize: (simpleRes.length > 12 ? '2.8rem' : '4.2rem') }
                                        : {}
                                }>
                                    {simpleRes || "0"}
                                </div>
                            </div>
                        </div>

                        <div className="citizens-faceplate">
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                                <div className=""></div>
                            </div>

                            <div className="citizens-grid">
                                {/* Row 1 */}
                                <button className="citizens-btn op-side" onClick={() => handleSimpleButton("GT")}>GT</button>
                                <button className="citizens-btn op-side" onClick={() => handleSimpleButton("MRC")}>MRC</button>
                                <button className="citizens-btn op-side" onClick={() => handleSimpleButton("M-")}>M-</button>
                                <button className="citizens-btn op-side" onClick={() => handleSimpleButton("M+")}>M+</button>
                                <button className="citizens-btn op-side" onClick={() => handleSimpleButton("REPLAY")}>REPLAY</button>
                                <button className="citizens-btn op-side" onClick={() => handleSimpleButton("CORRECT")}>✓</button>

                                {/* Row 2 */}
                                <button className="citizens-btn op-side" onClick={() => handleSimpleButton("DEL")}>✖</button>
                                <button className="citizens-btn num" onClick={() => handleSimpleButton("7")}>7</button>
                                <button className="citizens-btn num" onClick={() => handleSimpleButton("8")}>8</button>
                                <button className="citizens-btn num" onClick={() => handleSimpleButton("9")}>9</button>
                                <button className="citizens-btn op-side" onClick={() => handleSimpleButton("÷")}>÷</button>
                                <button className="citizens-btn num" onClick={() => handleSimpleButton("e")}>e</button>

                                {/* Row 3 */}
                                <button className="citizens-btn teal" onClick={() => handleSimpleButton("CE")}>CE</button>
                                <button className="citizens-btn num" onClick={() => handleSimpleButton("4")}>4</button>
                                <button className="citizens-btn num" onClick={() => handleSimpleButton("5")}>5</button>
                                <button className="citizens-btn num" onClick={() => handleSimpleButton("6")}>6</button>
                                <button className="citizens-btn op-side" onClick={() => handleSimpleButton("×")}>×</button>
                                <button className="citizens-btn op-side" onClick={() => handleSimpleButton("%")}>%</button>

                                {/* Row 4 & 5 Mixed for vertical + */}
                                <button className="citizens-btn teal" onClick={() => handleSimpleButton("AC")}>AC</button>
                                <button className="citizens-btn num" onClick={() => handleSimpleButton("1")}>1</button>
                                <button className="citizens-btn num" onClick={() => handleSimpleButton("2")}>2</button>
                                <button className="citizens-btn num" onClick={() => handleSimpleButton("3")}>3</button>
                                <button className="citizens-btn op-side vertical" onClick={() => handleSimpleButton("+")}>+</button>
                                <button className="citizens-btn op-side" onClick={() => handleSimpleButton("-")}>-</button>

                                {/* Row 5 */}
                                <button className="citizens-btn num" onClick={() => handleSimpleButton("0")}>0</button>
                                <button className="citizens-btn num" onClick={() => handleSimpleButton("00")}>00</button>
                                <button className="citizens-btn num btn-000" onClick={() => handleSimpleButton("000")}>000</button>
                                <button className="citizens-btn num" onClick={() => handleSimpleButton(".")}>•</button>
                                <button className="citizens-btn op-side" onClick={() => handleSimpleButton("=")}>=</button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <ZakatCalculator isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            )}
        </div>
    );
}

export default Calculator;

