import { differentiate } from './src/mathUtils.js';

console.log("Empty Test:", differentiate("7", 7, {Ans:0, A:0, B:0, C:0, X:0, Y:0, M:0}, "Deg"));
console.log("X**2 Test:", differentiate("X**2", 3, {Ans:0, A:0, B:0, C:0, X:0, Y:0, M:0}, "Deg"));
console.log("Sin Test:", differentiate("sin(X)", 0, {Ans:0, A:0, B:0, C:0, X:0, Y:0, M:0}, "Rad"));

