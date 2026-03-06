import { replaceConstants, CONSTANTS_SYMBOLS } from "./constants";

/**
 * mathUtils.js
 * Core mathematical functions for the calculator.
 */

/**
 * Robust Factorial function
 */
export function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0) return 1;
    if (!Number.isInteger(n)) return Gamma(n + 1); // For future gamma support if needed
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
}

/**
 * nPr: Permutations
 */
export function nPr(n, r) {
    if (n < 0 || r < 0 || r > n) return 0;
    // P(n, r) = n! / (n-r)!
    let res = 1;
    for (let i = n; i > n - r; i--) {
        res *= i;
    }
    return res;
}

/**
 * nCr: Combinations
 */
export function nCr(n, r) {
    if (n < 0 || r < 0 || r > n) return 0;
    // C(n, r) = n! / (r! * (n-r)!)
    // Efficiently: C(n, r) = P(n, r) / r!
    if (r > n / 2) r = n - r; // Take advantage of symmetry
    let res = 1;
    for (let i = 1; i <= r; i++) {
        res = (res * (n - i + 1)) / i;
    }
    return Math.round(res);
}

// Simple Gamma approximation for non-integers (optional)
function Gamma(n) {
    if (n === 1) return 1;
    if (n === 0.5) return Math.sqrt(Math.PI);
    return NaN; // Casio usually only does integer factorial
}

/**
 * Creates a scoped evaluation function.
 * This avoids 'eval' and provides a clean scope for templates.
 */
function createEvalFunction(expression, varName = 'x', vars = {}, angleMode = 'Deg') {
    const angleFactor = angleMode === 'Rad' ? 1 : (angleMode === 'Deg' ? Math.PI / 180 : Math.PI / 200);
    
    let jsExpr = replaceConstants(expression.trim())
        .replace(/X/gi, varName)
        .replace(/\^/g, "**")
        .replace(/²/g, "**2")
        .replace(/³/g, "**3")
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/⁻¹/g, "**(-1)")
        .replace(/π/g, "PI")
        .replace(/(?<![a-zA-Z])e(?![a-zA-Z])/g, "E");

    // Handle implicit multiplication (e.g., 2X -> 2*X, 2( -> 2*(, )X -> )*X )
    // Use a restricted list to avoid splitting multi-char tokens like 'Ans' or 'sin'
    const scientificConstantsPattern = CONSTANTS_SYMBOLS.join("|").replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const varList = `[A-FXYMπe${varName}]|${scientificConstantsPattern}`;
    const varRegex = new RegExp(`(${varList})(${varList}|\\()`, 'gi');
    jsExpr = jsExpr
        .replace(new RegExp(`(\\d)(${varList}|\\()`, 'g'), "$1*$2")
        .replace(new RegExp(`(\\))(\\d|${varList}|\\()`, 'g'), "$1*$2")
        .replace(varRegex, "$1*$2");

    // Filter out varName from global vars to prevent parameter shadowing
    const filteredKeys = [];
    const filteredVals = [];
    for (const [key, val] of Object.entries(vars)) {
        if (key !== varName) {
            filteredKeys.push(key);
            filteredVals.push(val);
        }
    }

    try {
        const { sin, cos, tan, sinh, cosh, tanh, asinh, acosh, atanh, log, log10, sqrt, abs, exp, pow, PI, E } = Math;
        
        // Rounding helper since Math.sin(Math.PI) is not exactly 0
        const nearZero = (v) => Math.abs(v) < 1e-15 ? 0 : v;

        // Wrapped trig functions that respect angle mode
        const s = (x) => nearZero(sin(x * angleFactor));
        const c = (x) => nearZero(cos(x * angleFactor));
        const t = (x) => {
            const res = tan(x * angleFactor);
            if (Math.abs(res) < 1e-15) return 0;
            return Math.abs(res) > 1e14 ? Infinity : res;
        };
        const ranHash = () => Math.floor(Math.random() * 1000) / 1000;
        const ranInt = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

        const f = new Function(varName, 'sin', 'cos', 'tan', 'sinh', 'cosh', 'tanh', 'asinh', 'acosh', 'atanh', 'log', 'log10', 'ln', 'sqrt', 'abs', 'exp', 'pow', 'pow10', 'PI', 'E', 'e', 'RanSharp', 'RanInt', ...filteredKeys, `
            try {
                const RanHash = RanSharp; // Alias
                return (${jsExpr.replace(/Ran#/g, "RanSharp()").replace(/RanInt\(/g, "RanInt(")});
            } catch (e) {
                return NaN;
            }
        `);
        return { f, evalVals: filteredVals, scopeParams: [s, c, t, sinh, cosh, tanh, asinh, acosh, atanh, log10, log10, log, sqrt, abs, exp, pow, (x) => Math.pow(10, x), PI, E, E, ranHash, ranInt] };
    } catch (e) {
        return null;
    }
}

/**
 * Numerical Integration (Simpson's Rule)
 */
export function integrate(expression, lower, upper, vars = {}, angleMode = 'Deg') {
    try {
        if (isNaN(lower) || isNaN(upper)) return "Syntax ERROR";
        if (expression.trim() === "") return "Syntax ERROR";
        
        const evalObj = createEvalFunction(expression, 'X', vars, angleMode);
        if (!evalObj) return "Syntax ERROR";

        const { f, evalVals, scopeParams } = evalObj;

        const evalAt = (x) => f(x, ...scopeParams, ...evalVals);

        if (lower === upper) return "0";
        let isReversed = false;
        if (lower > upper) {
            [lower, upper] = [upper, lower];
            isReversed = true;
        }

        const n = 1000;
        const h = (upper - lower) / n;
        let sum = evalAt(lower) + evalAt(upper);

        for (let i = 1; i < n; i++) {
            const x = lower + i * h;
            const weight = (i % 2 !== 0) ? 4 : 2;
            const val = evalAt(x);
            if (isNaN(val) || !isFinite(val)) return "Math ERROR";
            sum += weight * val;
        }

        let result = (sum * h) / 3;
        if (isReversed) result = -result;
        
        // Precision cleaning for numerical integration (Internal high-precision)
        const cleaned = Number(result.toPrecision(15));
        return cleaned.toString();
    } catch (e) {
        return "Math ERROR";
    }
}

/**
 * Numerical Differentiation (Symmetric Difference)
 */
export function differentiate(expression, x, vars = {}, angleMode = 'Deg') {
    try {
        if (isNaN(x)) return "Syntax ERROR";
        if (expression.trim() === "") return "Syntax ERROR";
        
        const evalObj = createEvalFunction(expression, 'X', vars, angleMode);
        if (!evalObj) return "Syntax ERROR";

        const { f, evalVals, scopeParams } = evalObj;
        const evalAt = (val) => f(val, ...scopeParams, ...evalVals);

        const h = Math.abs(x) > 1 ? Math.abs(x) * 1e-8 : 1e-8;
        const f1 = evalAt(x + h);
        const f2 = evalAt(x - h);

        if (isNaN(f1) || isNaN(f2) || !isFinite(f1) || !isFinite(f2)) {
            return "Math ERROR";
        }

        const result = (f1 - f2) / (2 * h);
        return Number(result.toPrecision(12)).toString();
    } catch (e) {
        return "Math ERROR";
    }
}

/**
 * Summation Logic
 */
export function summation(expression, lower, upper, vars = {}, angleMode = 'Deg') {
    try {
        if (isNaN(lower) || isNaN(upper)) return "Syntax ERROR";
        
        // Casio Rule: If end < start, result is 0
        if (Math.round(lower) > Math.round(upper)) return "0";
        
        // Summation explicitly uses 'X' as the loop variable
        const evalObj = createEvalFunction(expression, 'X', vars, angleMode);
        if (!evalObj) return "Syntax ERROR";

        const { f, evalVals, scopeParams } = evalObj;

        let total = 0;
        for (let x = Math.round(lower); x <= Math.round(upper); x++) {
            // Note: f's first argument takes the value of 'X'
            const val = f(x, ...scopeParams, ...evalVals);
            if (isNaN(val) || !isFinite(val)) return "Math ERROR";
            total += val;
        }
        // Precision cleaning for summation (Internal high-precision)
        const cleaned = Number(total.toPrecision(15));
        return cleaned.toString();
    } catch (e) {
        return "Math ERROR";
    }
}

/**
 * Logarithm with specified base
 */
export function logBase(base, val) {
    try {
        if (isNaN(base) || isNaN(val)) return "Syntax ERROR";
        // Casio Validation: base > 0, base != 1, arg > 0
        if (base <= 0 || base === 1 || val <= 0) return "Math ERROR";
        
        let result = Math.log(val) / Math.log(base);
        // Rounding to 10 places as requested/typical for Casio
        if (Math.abs(result - Math.round(result)) < 1e-12) result = Math.round(result);
        
        return Number.isInteger(result) ? result.toString() : result.toPrecision(15).replace(/\.?0+$/, "");
    } catch (e) {
        return "Math ERROR";
    }
}
/**
 * Utility: Greatest Common Divisor
 */
function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
        a %= b;
        [a, b] = [b, a];
    }
    return a;
}

/**
 * Returns an improper fraction {n, d} approximation for a decimal.
 */
export function getFraction(val) {
    if (val === 0 || Math.abs(val) < 1e-12) return { n: 0, d: 1 };
    const sign = val < 0 ? -1 : 1;
    let x = Math.abs(val);
    let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
    let b = x;
    for (let i = 0; i < 15; i++) {
        let a = Math.floor(b);
        let auxH = h1; h1 = a * h1 + h2; h2 = auxH;
        let auxK = k1; k1 = a * k1 + k2; k2 = auxK;
        if (Math.abs(x - h1 / k1) < 1e-10) break;
        if (b === a) break;
        b = 1 / (b - a);
    }
    return { n: sign * h1, d: k1 };
}

/**
 * Returns a mixed fraction {w, n, d} for a decimal.
 */
export function getMixedFraction(val) {
    const frac = getFraction(val);
    if (!frac) return null;
    const w = Math.trunc(frac.n / frac.d);
    const n = Math.abs(frac.n % frac.d);
    return { w, n, d: frac.d };
}

/**
 * Advanced: Returns a symbolic representation of a number if it matches a surd or fraction.
 * Example: 4.330127... -> { type: 'surd', n: 5, s: 3, d: 2 } (5*sqrt(3)/2)
 */
export function getExactValue(val) {
    if (val === 0 || Math.abs(val) < 1e-12) return { type: 'rational', n: 0, d: 1 };
    
    // 1. Check if it's already a simple rational
    const frac = getFraction(val);
    if (frac.d < 1000) {
        return { type: 'rational', n: frac.n, d: frac.d };
    }

    // -- Pi & e Detection --
    const piRatio = val / Math.PI;
    const piFrac = getFraction(piRatio);
    if (piFrac.d < 500 && Math.abs(val - (piFrac.n / piFrac.d * Math.PI)) < 1e-9) {
        return { type: 'pi', n: piFrac.n, d: piFrac.d };
    }

    const eRatio = val / Math.E;
    const eFrac = getFraction(eRatio);
    if (eFrac.d < 500 && Math.abs(val - (eFrac.n / eFrac.d * Math.E)) < 1e-9) {
        return { type: 'e', n: eFrac.n, d: eFrac.d };
    }

    // 2. Check if square is rational (Surd detection k*sqrt(n)/m)
    // We check val^2. If val^2 = a/b, then val = sqrt(a/b) = sqrt(a*b)/b
    const sq = Number((val * val).toPrecision(10));
    const sqFrac = getFraction(sq);
    if (sqFrac.d < 5000) {
        let n = sqFrac.n;
        let d = sqFrac.d;
        
        // Simplify sqrt(n/d) = sqrt(n*d)/d
        let prod = n * d;
        let outside = 1;
        let inside = prod;
        
        // Extract squares from under the root
        for (let i = Math.floor(Math.sqrt(inside)); i >= 2; i--) {
            if (inside % (i * i) === 0) {
                outside *= i;
                inside /= (i * i);
            }
        }
        
        // result = (outside * sqrt(inside)) / d
        // Simplify (outside/d)
        function getGcd(a, b) { return b ? getGcd(b, a % b) : a; }
        const common = Math.abs(getGcd(outside, d));
        
        if (inside === 1) {
            return {
                type: 'rational',
                n: (val < 0 ? -1 : 1) * (outside / common),
                d: d / common
            };
        }

        return {
            type: 'surd',
            coeffNum: (val < 0 ? -1 : 1) * (outside / common),
            surd: inside,
            denom: d / common
        };
    }

    return null; // No nice exact form found
}
/**
 * Arithmetic and bitwise logic for Base-N mode.
 * Standard Casio fx-991ES behaviour: 32-bit signed integers.
 */
export function evaluateBaseN(expression, baseName) {
    try {
        let base = 10;
        if (baseName === "HEX") base = 16;
        if (baseName === "BIN") base = 2;
        if (baseName === "OCT") base = 8;

        // Pre-process expression:
        // 1. Convert Base-N literals to decimal integers for evaluation
        // 2. Replace logical operators with JS bitwise ones
        let processed = expression
            .replace(/×/g, "*").replace(/÷/g, "/")
            .replace(/and/g, " & ")
            .replace(/or/g, " | ")
            .replace(/xor/g, " ^ ")
            .replace(/not/g, " ~ ")
            .replace(/xnor/g, " ^~ ") // Placeholder for XNOR
            .replace(/neg\(/g, " NEG_FUNC("); // Placeholder for NEG

        // Custom evaluator for Base-N parsing
        // We need to find numbers and parse them in the specific base
        const numberRegex = /[0-9A-Fa-f]+/g;
        let evalStr = processed.replace(numberRegex, (match) => {
            // Only parse as current base if it looks like a valid number for that base
            // (Standard Casio logic: inputting 'A' in HEX counts as HEX A even if currently in DEC? 
            // Actually usually A-F are blocked in DEC)
            try {
                const val = parseInt(match, base);
                return isNaN(val) ? match : val.toString();
            } catch (e) { return match; }
        });

        // Handle XNOR and NEG correctly
        // XNOR: ~(a ^ b)
        // For simplicity, we just use a helper scope
        const bitwiseScope = {
            NEG_FUNC: (x) => (~x + 1) | 0, // Two's complement
            xnor: (a, b) => ~(a ^ b) | 0
        };

        // Note: JS bitwise operators work on 32-bit signed ints by default
        const keys = Object.keys(bitwiseScope);
        const vals = Object.values(bitwiseScope);
        // We also need to handle X ^~ Y -> ~(X ^ Y)
        evalStr = evalStr.replace(/(\d+)\s*\^\~\s*(\d+)/g, "~($1 ^ $2)");

        const evalFn = new Function(...keys, `return (${evalStr}) | 0;`);
        const result = evalFn(...vals);
        
        if (isNaN(result)) return "Math ERROR";
        
        // Return result in requested base, as 32-bit signed
        // JS toString(base) on negative numbers adds a minus sign.
        // Casio usually shows two's complement for negative.
        if (result < 0) {
            // Convert to unsigned 32-bit for proper binary/hex two's complement display
            const unsigned = (result >>> 0);
            return unsigned.toString(base).toUpperCase();
        }
        return result.toString(base).toUpperCase();
    } catch (e) {
        return "Syntax ERROR";
    }
}

/**
 * Complex Number Implementation
 */
export class Complex {
    constructor(re = 0, im = 0) {
        this.re = re;
        this.im = im;
    }

    static add(a, b) { 
        a = Complex.from(a); b = Complex.from(b);
        return new Complex(a.re + b.re, a.im + b.im); 
    }
    static sub(a, b) { 
        a = Complex.from(a); b = Complex.from(b);
        return new Complex(a.re - b.re, a.im - b.im); 
    }
    static mul(a, b) {
        a = Complex.from(a); b = Complex.from(b);
        return new Complex(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
    }
    static div(a, b) {
        a = Complex.from(a); b = Complex.from(b);
        const den = b.re * b.re + b.im * b.im;
        if (den === 0) throw new Error("Math ERROR");
        return new Complex((a.re * b.re + a.im * b.im) / den, (a.im * b.re - a.re * b.im) / den);
    }
    static pow(a, b) {
        a = Complex.from(a); b = Complex.from(b);
        if (a.re === 0 && a.im === 0) return b.re === 0 && b.im === 0 ? new Complex(1, 0) : new Complex(0, 0);
        const r = Math.sqrt(a.re * a.re + a.im * a.im);
        const theta = Math.atan2(a.im, a.re);
        const ln_r = Math.log(r);
        const re_exp = b.re * ln_r - b.im * theta;
        const im_exp = b.re * theta + b.im * ln_r;
        const common = Math.exp(re_exp);
        return new Complex(common * Math.cos(im_exp), common * Math.sin(im_exp));
    }
    static abs(a) { a = Complex.from(a); return Math.sqrt(a.re * a.re + a.im * a.im); }
    static arg(a) { a = Complex.from(a); return Math.atan2(a.im, a.re); }
    static polar(r, theta, factor = 1) {
        const mag = Complex.abs(r);
        const t = Complex.from(theta).re * factor;
        return new Complex(mag * Math.cos(t), mag * Math.sin(t));
    }
    static conj(a) { a = Complex.from(a); return new Complex(a.re, -a.im); }
    
    static exp(a) {
        a = Complex.from(a);
        const r = Math.exp(a.re);
        return new Complex(r * Math.cos(a.im), r * Math.sin(a.im));
    }
    static ln(a) {
        a = Complex.from(a);
        return new Complex(Math.log(Complex.abs(a)), Complex.arg(a));
    }
    static log10(a) {
        const res = Complex.ln(a);
        const ln10 = Math.log(10);
        return new Complex(res.re / ln10, res.im / ln10);
    }
    static sqrt(a) {
        a = Complex.from(a);
        const r = Complex.abs(a);
        const theta = Complex.arg(a);
        return new Complex(Math.sqrt(r) * Math.cos(theta / 2), Math.sqrt(r) * Math.sin(theta / 2));
    }
    static sin(a, factor = 1) {
        a = Complex.from(a);
        const x = a.re * factor;
        const y = a.im;
        // Float precision fix for sin(pi) etc
        let s = Math.sin(x);
        let c = Math.cos(x);
        if (Math.abs(s) < 1e-15) s = 0;
        if (Math.abs(c) < 1e-15) c = 0;
        return new Complex(s * Math.cosh(y), c * Math.sinh(y));
    }
    static cos(a, factor = 1) {
        a = Complex.from(a);
        const x = a.re * factor;
        const y = a.im;
        let s = Math.sin(x);
        let c = Math.cos(x);
        if (Math.abs(s) < 1e-15) s = 0;
        if (Math.abs(c) < 1e-15) c = 0;
        return new Complex(c * Math.cosh(y), -s * Math.sinh(y));
    }
    static tan(a, factor = 1) {
        const s = Complex.sin(a, factor);
        const c = Complex.cos(a, factor);
        return Complex.div(s, c);
    }
    static sinh(a) {
        a = Complex.from(a);
        const e = Complex.exp(a);
        const en = Complex.exp(new Complex(-a.re, -a.im));
        return Complex.mul(Complex.sub(e, en), new Complex(0.5, 0));
    }
    static cosh(a) {
        a = Complex.from(a);
        const e = Complex.exp(a);
        const en = Complex.exp(new Complex(-a.re, -a.im));
        return Complex.mul(Complex.add(e, en), new Complex(0.5, 0));
    }
    static tanh(a) {
        const s = Complex.sinh(a);
        const c = Complex.cosh(a);
        return Complex.div(s, c);
    }
    static asinh(a) {
        a = Complex.from(a);
        // asinh(z) = ln(z + sqrt(z^2 + 1))
        const z2 = Complex.mul(a, a);
        return Complex.ln(Complex.add(a, Complex.sqrt(Complex.add(z2, new Complex(1, 0)))));
    }
    static acosh(a) {
        a = Complex.from(a);
        // acosh(z) = ln(z + sqrt(z^2 - 1))
        const z2 = Complex.mul(a, a);
        return Complex.ln(Complex.add(a, Complex.sqrt(Complex.sub(z2, new Complex(1, 0)))));
    }
    static atanh(a) {
        a = Complex.from(a);
        // atanh(z) = 0.5 * ln((1 + z) / (1 - z))
        const num = Complex.add(new Complex(1, 0), a);
        const den = Complex.sub(new Complex(1, 0), a);
        return Complex.mul(new Complex(0.5, 0), Complex.ln(Complex.div(num, den)));
    }
    static asin(a, factor = 1) {
        const i_val = new Complex(0, 1);
        const z = Complex.from(a);
        const iz = Complex.mul(i_val, z);
        const z2 = Complex.mul(z, z);
        const inner = Complex.add(iz, Complex.sqrt(Complex.sub(new Complex(1, 0), z2)));
        const res = Complex.mul(new Complex(0, -1), Complex.ln(inner));
        return new Complex(res.re / factor, res.im);
    }
    static acos(a, factor = 1) {
        const i_val = new Complex(0, 1);
        const z = Complex.from(a);
        const inner = Complex.add(z, Complex.mul(i_val, Complex.sqrt(Complex.sub(new Complex(1, 0), Complex.mul(z, z)))));
        const res = Complex.mul(new Complex(0, -1), Complex.ln(inner));
        return new Complex(res.re / factor, res.im);
    }
    static atan(a, factor = 1) {
        const i_val = new Complex(0, 1);
        const z = Complex.from(a);
        const inner = Complex.div(Complex.add(i_val, z), Complex.sub(i_val, z));
        const res = Complex.mul(new Complex(0, 0.5), Complex.ln(inner));
        return new Complex(res.re / factor, res.im);
    }
    
    static rnd(a) {
        a = Complex.from(a);
        return new Complex(Number(a.re.toPrecision(10)), Number(a.im.toPrecision(10)));
    }
    
    static from(val) {
        if (val instanceof Complex) return val;
        if (typeof val === 'number') return new Complex(val, 0);
        if (typeof val === 'string') {
            const s = val.trim().replace(/\s+/g, "");
            if (s === "i") return new Complex(0, 1);
            if (s === "-i") return new Complex(0, -1);
            const match = s.match(/^([-+]?\d*\.?\d*)([-+])(\d*\.?\d*)i$/);
            if (match) {
                const reVal = (match[1] === "" || match[1] === "+" || match[1] === "-") ? 0 : parseFloat(match[1]);
                let imVal = match[3] === "" ? 1 : parseFloat(match[3]);
                if (match[2] === "-") imVal = -imVal;
                return new Complex(reVal, imVal);
            }
            const onlyIm = s.match(/^([-+]?\d*\.?\d*)i$/);
            if (onlyIm) {
                let imVal = (onlyIm[1] === "" || onlyIm[1] === "+") ? 1 : (onlyIm[1] === "-" ? -1 : parseFloat(onlyIm[1]));
                return new Complex(0, imVal);
            }
            const onlyRe = parseFloat(s);
            if (!isNaN(onlyRe)) return new Complex(onlyRe, 0);
        }
        return new Complex(0, 0);
    }

    toString(format = 'rect', angleMode = 'Deg') {
        if (format === 'polar') {
            const r = Complex.abs(this);
            let theta = Complex.arg(this);
            if (angleMode === 'Deg') theta = theta * (180 / Math.PI);
            else if (angleMode === 'Gra') theta = theta * (200 / Math.PI);
            return `${r.toFixed(10).replace(/\.?0+$/, "")}∠${theta.toFixed(10).replace(/\.?0+$/, "")}`;
        }
        if (Math.abs(this.im) < 1e-12) return this.re.toFixed(10).replace(/\.?0+$/, "");
        
        let re = this.re;
        let im = this.im;
        if (Math.abs(re) < 1e-12) re = 0;
        if (Math.abs(im) < 1e-12) im = 0;

        const rePart = (re === 0 && im !== 0) ? "" : re.toFixed(10).replace(/\.?0+$/, "");
        const imAbs = Math.abs(im);
        const imPart = imAbs === 1 ? "" : imAbs.toFixed(10).replace(/\.?0+$/, "");
        const sign = im < 0 ? "-" : (rePart !== "" ? "+" : "");
        return `${rePart}${sign}${imPart}i`;
    }
}

/**
 * Parses and evaluates complex expressions using a robust evaluator.
 */
export function evaluateComplex(expression, vars = {}, angleMode = 'Deg') {
    try {
        const i = new Complex(0, 1);
        
        let displayFormat = 'rect'; // Default
        let cleanExpr = replaceConstants(expression)
            .replace(/\s+/g, "") // Remove all spaces
            .replace(/▶r∠θ/g, () => { displayFormat = 'polar'; return ""; })
            .replace(/▶a\+bi/g, () => { displayFormat = 'rect'; return ""; });

        // Pre-process templates that require string evaluation (Derivative)
        const findEndOfTemplate = (str, start) => {
            let d = 1;
            for (let j = start + 1; j < str.length; j++) {
                if (str[j] === '(') d++;
                else if (str[j] === ')') d--;
                if (d === 0) return j;
            }
            return -1;
        };

        let derivChanged = true;
        while (derivChanged) {
            derivChanged = false;
            if (cleanExpr.includes("d/dX(")) {
                let startIdx = cleanExpr.indexOf("d/dX(");
                let endIdx = findEndOfTemplate(cleanExpr, startIdx + 4);
                if (endIdx !== -1) {
                    const full = cleanExpr.substring(startIdx, endIdx + 1);
                    const inner = cleanExpr.substring(startIdx + 5, endIdx);
                    if (inner.includes("‡")) {
                        const [exprTerm, xValStr] = inner.split("‡");
                        // For complex mode, we still differentiate with respect to a real X for simple functions
                        // We use the variables passed in to evaluate the x-value
                        // This might be tricky if xVal is a complex expression, so we evaluate it first
                        const xValComplex = evaluateComplex(xValStr, vars, angleMode);
                        const xVal = typeof xValComplex === 'string' ? parseFloat(xValComplex) : xValComplex.re;
                        
                        const result = differentiate(exprTerm, xVal, vars, angleMode);
                        cleanExpr = cleanExpr.replace(full, `(${result === "Math ERROR" ? "NaN" : result})`);
                        derivChanged = true;
                        continue;
                    }
                }
            }
        }

        cleanExpr = cleanExpr
            .replace(/×/g, "*").replace(/÷/g, "/")
            .replace(/\*\*/g, "^") // Normalize exponent
            .replace(/²/g, "^2").replace(/³/g, "^3").replace(/⁻¹/g, "^-1")
            .replace(/i/g, "i")
            .replace(/π/g, "PI")
            .replace(/(?<![a-zA-Z])e+/g, (m) => "EE".repeat(m.length))
            .replace(/Conjg/g, "conj").replace(/Real/g, "real").replace(/Imag/g, "imag").replace(/arg/g, "arg")
            // Handle Templates
            .replace(/sq\((.*?)\)/g, "($1)^2")
            .replace(/cb\((.*?)\)/g, "($1)^3")
            .replace(/pw\((.*?)‡(.*?)\)/g, "($1)^($2)")
            .replace(/tx\((.*?)\)/g, "(10)^($1)")
            .replace(/ex\((.*?)\)/g, "exp($1)")
            .replace(/sroot\((.*?)\)/g, "sqrt($1)")
            .replace(/croot\((.*?)\)/g, "($1)^(1/3)")
            .replace(/rt\((.*?)‡(.*?)\)/g, "($2)^(1/($1))")
            .replace(/sin⁻¹/g, "asin").replace(/cos⁻¹/g, "acos").replace(/tan⁻¹/g, "atan")
            .replace(/exp/g, "exp").replace(/sqrt/g, "sqrt")
            .replace(/Rnd/g, "rnd")
            .replace(/l10/g, "log").replace(/log10/g, "log").replace(/ln/g, "ln")
            .replace(/Abs/g, "abs");

        // Implicit multiplication (Improved - avoiding breaking function names like sinh)
        cleanExpr = cleanExpr
            .replace(/(\d+)([a-zA-Z_πPI|EE]|\()/g, "$1*$2")
            .replace(/(\))(\d+|[a-zA-Z_πPI|EE]|\()/g, "$1*$2")
            .replace(/\b(i|PI|EE)\b(?=[0-9\(]|[A-FXYM])/g, "$1*");

        const tokens = cleanExpr.match(/(\d+\.?\d*|arg|conj|real|imag|[+\-*/()i,^∠PC]|PI|EE|[a-zA-Z_]\w*)/g);
        if (!tokens) return "0";

        const values = [];
        const ops = [];
        const precedence = { '+': 1, '-': 1, '*': 2, '/': 2, 'P': 3, 'C': 3, 'neg': 4, '^': 5, '∠': 6 };
        const isFunction = (t) => [
            'arg', 'conj', 'real', 'imag', 'abs',
            'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 
            'sinh', 'cosh', 'tanh', 'asinh', 'acosh', 'atanh',
            'log', 'ln', 'sqrt', 'exp', 'rnd'
        ].includes(t);
        const angleFactor = angleMode === 'Rad' ? 1 : (angleMode === 'Deg' ? Math.PI / 180 : Math.PI / 200);

        const performOp = () => {
        const op = ops.pop();
        if (isFunction(op)) {
            const arg = values.pop() || new Complex(0, 0);
            if (op === 'arg') {
                    let res = Complex.arg(arg);
                    const deg = res * (180 / Math.PI);
                    values.push(new Complex(angleMode === 'Deg' ? deg : (angleMode === 'Gra' ? res * (200 / Math.PI) : res), 0));
                } else if (op === 'conj') values.push(Complex.conj(arg));
                else if (op === 'real') values.push(new Complex(Complex.from(arg).re, 0));
                else if (op === 'imag') values.push(new Complex(Complex.from(arg).im, 0));
                else if (op === 'sin') values.push(Complex.sin(arg, angleFactor));
                else if (op === 'cos') values.push(Complex.cos(arg, angleFactor));
                else if (op === 'tan') values.push(Complex.tan(arg, angleFactor));
                else if (op === 'asin') values.push(Complex.asin(arg, angleFactor));
                else if (op === 'acos') values.push(Complex.acos(arg, angleFactor));
                else if (op === 'atan') values.push(Complex.atan(arg, angleFactor));
                else if (op === 'sinh') values.push(Complex.sinh(arg));
                else if (op === 'cosh') values.push(Complex.cosh(arg));
                else if (op === 'tanh') values.push(Complex.tanh(arg));
                else if (op === 'asinh') values.push(Complex.asinh(arg));
                else if (op === 'acosh') values.push(Complex.acosh(arg));
                else if (op === 'atanh') values.push(Complex.atanh(arg));
                else if (op === 'abs') values.push(new Complex(Complex.abs(arg), 0));
                else if (op === 'log') values.push(Complex.log10(arg));
                else if (op === 'ln') values.push(Complex.ln(arg));
                else if (op === 'sqrt') values.push(Complex.sqrt(arg));
                else if (op === 'exp') values.push(Complex.exp(arg));
                else if (op === 'rnd') values.push(Complex.rnd(arg));
            } else if (op === 'neg') {
                const val = values.pop();
                if (val) values.push(new Complex(-val.re, -val.im));
            } else if (op && op !== '(') {
                const right = values.pop();
                const left = values.pop();
                if (left && right) {
                    if (op === '+') values.push(Complex.add(left, right));
                    else if (op === '-') values.push(Complex.sub(left, right));
                    else if (op === '*') values.push(Complex.mul(left, right));
                    else if (op === '/') values.push(Complex.div(left, right));
                    else if (op === '^') values.push(Complex.pow(left, right));
                    else if (op === '∠') values.push(Complex.polar(left, right, angleFactor));
                    else if (op === 'P') values.push(new Complex(nPr(Math.round(left.re), Math.round(right.re)), 0));
                    else if (op === 'C') values.push(new Complex(nCr(Math.round(left.re), Math.round(right.re)), 0));
                } else if (right) {
                    values.push(right); // Put it back if we can't perform binary op
                }
            }
        };

        for (let j = 0; j < tokens.length; j++) {
            const t = tokens[j];
            if (!isNaN(t)) {
                values.push(new Complex(parseFloat(t), 0));
            } else if (t === 'i') {
                values.push(i);
            } else if (t === 'PI') {
                values.push(new Complex(Math.PI, 0));
            } else if (t === 'EE') {
                values.push(new Complex(Math.E, 0));
            } else if (isFunction(t)) {
                ops.push(t);
            } else if (t === '(') {
                ops.push(t);
            } else if (t === ')') {
                while (ops.length && ops[ops.length - 1] !== '(') performOp();
                ops.pop(); 
                if (ops.length && isFunction(ops[ops.length - 1])) performOp();
            } else if (t === '-' && (j === 0 || tokens[j - 1] === '(' || ['+', '-', '*', '/'].includes(tokens[j - 1]))) {
                ops.push('neg');
            } else if (precedence[t]) {
                while (ops.length && ops[ops.length - 1] !== '(' && precedence[ops[ops.length - 1]] >= precedence[t]) {
                    performOp();
                }
                ops.push(t);
            } else if (vars[t] !== undefined) {
                values.push(Complex.from(vars[t]));
            }
        }

        while (ops.length) performOp();
        const finalResult = values[0] || new Complex(0, 0);
        return finalResult.toString(displayFormat, angleMode);
    } catch (e) {
        return "Math ERROR";
    }
}
