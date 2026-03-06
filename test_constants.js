
const variables = { A: null, B: null, C: null, D: null, E: null, F: null, X: null, Y: null, M: null };
const lastAnswer = 0;
const config = { angle: 'Deg' };

const processForEval = (expr, vars, angleMode) => {
    const angleFactor = angleMode === 'Rad' ? 1 : (angleMode === 'Deg' ? Math.PI / 180 : Math.PI / 200);

    const preprocess = (s) => {
        if (!s || s.trim() === "") return "";
        let processedS = s
            .replace(/\\/g, "")
            .replace(/_\{(.*?)\}/g, "_$1")
            .replace(/(?<![a-zA-Z])x(?![a-zA-Z])/g, "X")
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
            .replace(/\^/g, "**");

        const scientificConstants = "mp|mn|me|mμ|a0|h|μN|μB|ħ|α|re|λc|γp|λcp|λcn|R∞|u|μp|μe|μn|μμ|F|e_c|NA|k|Vm|R|c0|c1|c2|σ|ε0|μ0|Φ0|g|Z0|t|G|atm";
        const termStart = `(\\(|[A-FXYMπei]|${scientificConstants}|sin|cos|tan|log|ln|Ans|Abs)`;
        const varList = `[A-FXYMπei]|${scientificConstants}`;

        let finalS = processedS
            .replace(new RegExp(`(\\d|${varList}|Ans|\\))(${termStart})`, 'g'), "$1*$2")
            .replace(new RegExp(`(${varList}|Ans|\\)|!)(\\d)`, 'g'), "$1*$2");

        return finalS;
    };

    let evalExpr = preprocess(expr);
    evalExpr = evalExpr
        .replace(/×/g, "*").replace(/÷/g, "/")
        .replace(/²/g, "**2").replace(/³/g, "**3")
        .replace(/⁻¹/g, "**(-1)")
        .replace(/(\d)([A-FXYMπe\(])/g, "$1*$2")
        .replace(/(\))(\d|[A-FXYMπe\(])/g, "$1*$2")
        .replace(/([A-FXYMπe])([A-FXYMπe\(])/g, "$1*$2")
        .replace(/π/g, "PI")
        .replace(/(?<![a-zA-Z0-9.])e(?![a-zA-Z0-9.])/g, "E");

    Object.keys(vars).forEach(v => {
        const regex = new RegExp("(?<![a-zA-Z\.])" + v + "(?![a-zA-Z])", "g");
        evalExpr = evalExpr.replace(regex, `(${vars[v] !== null && vars[v] !== undefined ? vars[v] : 0})`);
    });

    return evalExpr;
};

console.log("mp:", processForEval("mp", variables, 'Deg'));
console.log("7mp:", processForEval("7mp", variables, 'Deg'));
console.log("G:", processForEval("G", variables, 'Deg'));
console.log("7G:", processForEval("7G", variables, 'Deg'));
console.log("R∞:", processForEval("R∞", variables, 'Deg'));
