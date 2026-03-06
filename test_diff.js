const { differentiate } = require('./mathUtils.js');

// Mock createEvalFunction and other dependencies if needed, 
// but mathUtils.js is self-contained except for exports.
// Wait, mathUtils.js uses commonJS or ESM? 
// It uses 'export function', so it's ESM.

// I'll just check the file content and try to run a similar logic in a script.
try {
    const vars = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, X: 4, Y: 0, M: 0, Ans: 0 };
    const result = differentiate("X**2", 3, vars, 'Deg');
    console.log("Result of d/dX(X**2)|X=3:", result);
} catch (e) {
    console.error("Error:", e);
}
