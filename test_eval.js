const fs = require('fs');
const path = require('path');

const mathUtilsContent = fs.readFileSync('./src/mathUtils.js', 'utf8');

let code = mathUtilsContent
    .replace(/export /g, '')
    .replace(/import .* from .*/g, '')
    .replace(/const tokens = cleanExpr.match\(.*\);/, 
    `const tokens = cleanExpr.match(/(\\d+\\.?\\d*|arg|conj|real|imag|[+\\-*/()i,^∠PC]|PI|EE|[a-zA-Z_]\\w*)/g);
    console.log("Tokens:", tokens);`)
    .replace(/const performOp = \(\) => {/, 
    `const performOp = () => {
        console.log("performOp called, op:", ops[ops.length-1]);`);

// Mock constants.js
global.CONSTANTS_SYMBOLS = [];
global.replaceConstants = (s) => s;

eval(code);

console.log("Result:", evaluateComplex("sinh(5)"));
