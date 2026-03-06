const expression = "∫(sin(8)‡1‡7)";

let result = "";
const currentVariables = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, X: 0, Y: 0, M: 0 };
const angleFactor = Math.PI / 180;
const variables = currentVariables;

try {
    let openParens = (expression.match(/\(/g) || []).length;
    let closeParens = (expression.match(/\)/g) || []).length;
    let evalExpr = expression;
    while (openParens > closeParens) {
        evalExpr += ")";
        closeParens++;
    }

    evalExpr = evalExpr
        .replace(/×/g, "*").replace(/÷/g, "/")
        .replace(/²/g, "**2").replace(/³/g, "**3")
        .replace(/⁻¹/g, "**(-1)")
        .replace(/(\d)([A-FXYMπe\(])/g, "$1*$2")
        .replace(/(\))(\d|[A-FXYMπe\(])/g, "$1*$2")
        .replace(/([A-FXYMπe])([A-FXYMπe\(])/g, "$1*$2")
        .replace(/√\(/g, "Math.sqrt(")
        .replace(/∛\(/g, "Math.cbrt(")
        .replace(/sin\(/g, `Math.sin(${angleFactor}*`)
        .replace(/cos\(/g, `Math.cos(${angleFactor}*`)
        .replace(/tan\(/g, `Math.tan(${angleFactor}*`)
        .replace(/sin⁻¹\(/g, `(1/${angleFactor})*Math.asin(`)
        .replace(/cos⁻¹\(/g, `(1/${angleFactor})*Math.acos(`)
        .replace(/tan⁻¹\(/g, `(1/${angleFactor})*Math.atan(`)
        .replace(/10\^\(/g, "Math.pow(10,")
        .replace(/e\^\(/g, "Math.exp(")
        .replace(/ln\(/g, "Math.log(")
        .replace(/log\(/g, "Math.log10(")
        .replace(/Abs\(/g, "Math.abs(")
        .replace(/π/g, "(Math.PI)")
        .replace(/e/g, "(Math.E)");

    const statements = evalExpr.split(":");
    let currentResult = null;

    for (let stmt of statements) {
        if (!stmt.trim()) continue;
        let localEval = stmt;

        while (localEval.includes("∫(")) {
            const match = localEval.match(/∫\(([^‡]*)\‡([^‡]*)\‡([^\)]*)\)/);
            if (match) {
                const [full, integrand, lowerStr, upperStr] = match;
                const lower = Function(`'use strict'; return (${lowerStr || 0})`)();
                const upper = Function(`'use strict'; return (${upperStr || 0})`)();

                if (!isFinite(lower) || !isFinite(upper)) throw new Error("Math ERROR");

                const n = 1000;
                const h = (upper - lower) / n;
                let sum = 0;

                if (h !== 0) {
                    const f = (xVal) => {
                        let fExpr = integrand.replace(/X/g, `(${xVal})`);
                        let hasUninit = false;
                        Object.keys(variables).forEach(v => {
                            const regex = new RegExp(`(?<![a-zA-Z])${v}(?![a-zA-Z])`, "g");
                            if (fExpr.match(regex)) {
                                if (variables[v] === null || variables[v] === undefined) hasUninit = true;
                                fExpr = fExpr.replace(regex, `(${variables[v] !== null ? variables[v] : 0})`);
                            }
                        });
                        if (hasUninit) throw new Error("Syntax ERROR");

                        return Function(`'use strict'; return (${fExpr.replace(/×/g, "*").replace(/÷/g, "/")})`)();
                    };

                    sum += f(lower) + f(upper);
                    for (let i = 1; i < n; i++) sum += (i % 2 === 0 ? 2 : 4) * f(lower + i * h);
                }
                localEval = localEval.replace(full, `(${(h / 3) * sum})`);
            } else break;
        }

        let hasUninit = false;
        Object.keys(currentVariables).forEach(v => {
            const regex = new RegExp(`(?<![a-zA-Z])${v}(?![a-zA-Z])`, "g");
            if (localEval.match(regex)) {
                if (currentVariables[v] === null || currentVariables[v] === undefined) hasUninit = true;
                localEval = localEval.replace(regex, `(${currentVariables[v] !== null ? currentVariables[v] : 0})`);
            }
        });

        if (hasUninit) throw new Error("Syntax ERROR");

        console.log("Evaluating final AST string:", localEval);
        currentResult = Function(`'use strict'; return (${localEval})`)();
    }

    console.log("Success:", currentResult);
} catch (err) {
    console.error("Evaluation Error:", err);
}
