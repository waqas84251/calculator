
const { differentiate } = require('./src/mathUtils.js');

try {
    const result = differentiate("8", 1, {}, "Deg");
    console.log("Result for d/dx(8)|x=1:", result);
} catch (e) {
    console.error("Error:", e);
}
