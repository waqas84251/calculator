import { integrate } from './src/mathUtils.js';

try {
    const res = integrate("sin(8)", 4, 8, "RAD");
    console.log("Result for sin(8):", res);
} catch (e) {
    console.error("Error:", e);
}

try {
    const res = integrate("math.sin(8)", 4, 8, "RAD");
    console.log("Result for math.sin(8):", res);
} catch (e) {
    console.error("Error:", e);
}
