import { integrate } from './src/mathUtils.js';

console.log("--- Debugging Math ERROR ---");

try {
    const res = integrate("sin(7)+cos(5)", 8, 7, "RAD");
    console.log(`Result for sin(7)+cos(5):`, res);
} catch (e) {
    console.error("Caught error:", e);
}

try {
    const res = integrate("sin(x)+cos(x)", 0, 1, "RAD");
    console.log(`Result for sin(x)+cos(x):`, res);
} catch (e) {
    console.error("Caught error:", e);
}
