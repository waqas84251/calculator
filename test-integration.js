import { integrate } from './src/mathUtils.js';

console.log("--- Testing Numerical Integration ---");

// Test 1: Constant "8"
const test1 = integrate("8", 4, 7);
console.log(`integrate("8", 4, 7) -> Expected: 24.0000000000, Got: ${test1}`);

// Test 2: Constant "sin(8)"
const test2 = integrate("sin(8)", 4, 7);
const expected2 = (Math.sin(8) * 3).toFixed(10);
console.log(`integrate("sin(8)", 4, 7) -> Expected: ${expected2}, Got: ${test2}`);

// Test 3: Variable "sin(x)"
const test3 = integrate("sin(x)", 0, Math.PI, "RAD");
console.log(`integrate("sin(x)", 0, PI, "RAD") -> Expected: 2.0000000000, Got: ${test3}`);

// Test 4: Degree mode constant
const test4 = integrate("sin(90)", 0, 1, "DEG");
console.log(`integrate("sin(90)", 0, 1, "DEG") -> Expected: 1.0000000000, Got: ${test4}`);

// Test 5: Reversal
const test5 = integrate("x", 2, 0);
console.log(`integrate("x", 2, 0) -> Expected: -2.0000000000, Got: ${test5}`);
