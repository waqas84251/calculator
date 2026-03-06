const regex = /(?<![a-zA-Z_])(i|PI|EE)(?![a-zA-Z_])([0-9\(]|[a-zA-Z_])/g;
const tests = [
    "sinh(5)",
    "2i(5)",
    "i(5)",
    "i+5",
    "PIX",
    "iX"
];

tests.forEach(t => {
    const res = t.replace(regex, "$1*$2");
    console.log(t, "->", res);
});
