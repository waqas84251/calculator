const processForEval = (expr, vars, angleMode) => {
        const angleFactor = angleMode === 'Rad' ? 1 : (angleMode === 'Deg' ? Math.PI / 180 : Math.PI / 200);

        const preprocess = (s) => {
            if (!s || s.trim() === "") return "";
            const processedS = s
                .replace(/\\/g, "")
                .replace(/_\{(.*?)\}/g, "_$1")
                .replace(/(?<![a-zA-Z])x(?![a-zA-Z])/g, "X")
                .replace(/(sin|cos|tan)h?⁻¹\(/g, (m) => {
                    if (m.startsWith("sin")) return "asin(";
                    if (m.startsWith("cos")) return "acos(";
                    if (m.startsWith("tan")) return "atan(";
                    if (m.startsWith("sinh")) return "asinh(";
                    if (m.startsWith("cosh")) return "acosh(";
                    if (m.startsWith("tanh")) return "atanh(";
                    return m;
                })
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
                .replace(/π/g, "(Math.PI)")
                .replace(/²/g, "**2")
                .replace(/³/g, "**3")
                .replace(/⁻¹/g, "**(-1)")
                .replace(/×/g, "*")
                .replace(/÷/g, "/")
                .replace(/(?<![a-zA-Z0-9.])e(?![a-zA-Z0-9.])/g, "(Math.E)")
                .replace(/Ran#/g, "RanSharp()")
                .replace(/RanInt\(/g, "RanInt(")
                .replace(/Rnd\(/g, "Rnd(")
                .replace(/Abs\(/g, "Math.abs(")
                .replace(/\^/g, "**");

            // Handle implicit multiplication (e.g., 2X -> 2*X, 2( -> 2*(, )X -> )*X )
            // Added support for scientific constants (mp, mn, me, etc.)
            const scientificConstants = "mp|mn|me|mμ|a0|h|μN|μB|ħ|α|re|λc|γp|λcp|λcn|R∞|u|μp|μe|μn|μμ|F|e_c|NA|k|Vm|R|c0|c1|c2|σ|ε0|μ0|Φ0|g|Z0|t|G|atm";
            const termStart = `(\\(|[A-FXYMπei]|${scientificConstants}|sin|cos|tan|log|ln|asin|acos|atan|sinh|cosh|tanh|asinh|acosh|atanh|Abs|Ran#|RanInt|Rnd|Ans|∫|Σ|q\\(|mf\\(|pw\\(|rt\\()`;
            const varList = `[A-FXYMπei]|${scientificConstants}`;

            let finalS = processedS
                // 1. Digit or Variable or Close-bracket followed by (Variable or Open-bracket or Function)
                .replace(new RegExp(`(\\d|${varList}|Ans|\\))(${termStart})`, 'g'), "$1*$2")
                // 2. Variable or Close-bracket or Factorial followed by Digit
                .replace(new RegExp(`(${varList}|Ans|\\)|!)(\\d)`, 'g'), "$1*$2");

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
                    atanh: (x) => Math.atanh(x)
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

            // Derivative d/dX
            if (evalExpr.includes("d/dX*(")) { // Asterisk added by implicit multiplication
                let startIdx = evalExpr.indexOf("d/dX*(");
                let endIdx = findEndOfTemplate(evalExpr, startIdx + 5);
                if (endIdx !== -1) {
                    const full = evalExpr.substring(startIdx, endIdx + 1);
                    const inner = evalExpr.substring(startIdx + 6, endIdx);
                    if (inner.includes("‡")) {
                        const [integrand, xValStr] = inner.split("‡");
                        const xValue = pL(xValStr);
                        const contextVars = { ...vars, Ans: lastAnswer || 0 };
                        const result = numericalDifferentiate(integrand, xValue, contextVars, config.angle);
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
            .replace(/(\d)([A-FXYMπe\(])/g, "$1*$2")
            .replace(/(\))(\d|[A-FXYMπe\(])/g, "$1*$2")
            .replace(/([A-FXYMπe])([A-FXYMπe\(])/g, "$1*$2")
            .replace(/ln\(/g, "ln(")
            .replace(/log\(/g, "log(")
            .replace(/Abs\(/g, "abs(")
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

    
module.exports = processForEval;