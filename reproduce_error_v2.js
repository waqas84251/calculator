import { integrate } from './src/mathUtils.js';

const angleFactor = Math.PI / 180;
const integrand = `math.sin(${angleFactor}*2)+math.cos(${angleFactor}*5)`;

console.log("--- Testing with Pre-processed String ---");
console.log("Integrand:", integrand);

try {
    const res = integrate(integrand, 7, 5, "DEG");
    console.log("Result:", res);
} catch (e) {
    console.error("Error:", e);
}
