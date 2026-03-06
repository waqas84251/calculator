/**
 * constants.js
 * Scientific constants definition for the calculator.
 */

export const CONSTANTS_MAP = {
    "01": { symbol: "mp", name: "Proton mass", value: "1.6726219*10**-27" },
    "02": { symbol: "mn", name: "Neutron mass", value: "1.6749275*10**-27" },
    "03": { symbol: "me", name: "Electron mass", value: "9.10938356*10**-31" },
    "04": { symbol: "mμ", name: "Muon mass", value: "1.8835316*10**-28" },
    "05": { symbol: "a0", name: "Bohr radius", value: "5.291772109*10**-11" },
    "06": { symbol: "h", name: "Planck constant", value: "6.62607015*10**-34" },
    "07": { symbol: "μN", name: "Nuclear magneton", value: "5.050783699*10**-27" },
    "08": { symbol: "μB", name: "Bohr magneton", value: "9.274009994*10**-24" },
    "09": { symbol: "ħ", name: "Reduced Planck const", value: "1.054571817*10**-34" },
    "10": { symbol: "α", name: "Fine-structure const", value: "7.2973525693*10**-3" },
    "11": { symbol: "re", name: "Classical electron radius", value: "2.8179403227*10**-15" },
    "12": { symbol: "λc", name: "Compton wavelength", value: "2.4263102367*10**-12" },
    "13": { symbol: "γp", name: "Proton gyromagnetic ratio", value: "2.675221900*10**8" },
    "14": { symbol: "λcp", name: "Proton Compton wavelength", value: "1.3214098539*10**-15" },
    "15": { symbol: "λcn", name: "Neutron Compton wavelength", value: "1.3195909048*10**-15" },
    "16": { symbol: "R∞", name: "Rydberg constant", value: "10973731.56816" },
    "17": { symbol: "u", name: "Atomic mass unit", value: "1.66053906660*10**-27" },
    "18": { symbol: "μp", name: "Proton magnetic moment", value: "1.4106067873*10**-26" },
    "19": { symbol: "μe", name: "Electron magnetic moment", value: "-9.284764620*10**-24" },
    "20": { symbol: "μn", name: "Neutron magnetic moment", value: "-9.6623650*10**-27" },
    "21": { symbol: "μμ", name: "Muon magnetic moment", value: "-4.49044826*10**-26" },
    "22": { symbol: "F", name: "Faraday constant", value: "96485.33212" },
    "23": { symbol: "e_c", name: "Elementary charge", value: "1.602176634*10**-19" },
    "24": { symbol: "NA", name: "Avogadro constant", value: "6.02214076*10**23" },
    "25": { symbol: "k", name: "Boltzmann constant", value: "1.380649*10**-23" },
    "26": { symbol: "Vm", name: "Molar volume of ideal gas", value: "22.710954641*10**-3" },
    "27": { symbol: "R", name: "Molar gas constant", value: "8.314462618" },
    "28": { symbol: "c0", name: "Speed of light in vacuum", value: "299792458" },
    "29": { symbol: "c1", name: "First radiation constant", value: "3.741771852*10**-16" },
    "30": { symbol: "c2", name: "Second radiation constant", value: "1.438776877*10**-2" },
    "31": { symbol: "σ", name: "Stefan-Boltzmann const", value: "5.670374419*10**-8" },
    "32": { symbol: "ε0", name: "Electric constant", value: "8.8541878128*10**-12" },
    "33": { symbol: "μ0", name: "Magnetic constant", value: "1.25663706212*10**-6" },
    "34": { symbol: "Φ0", name: "Magnetic flux quantum", value: "2.067833848*10**-15" },
    "35": { symbol: "g", name: "Standard gravity", value: "9.80665" },
    "36": { symbol: "Z0", name: "Characteristic impedance", value: "376.730313668" },
    "37": { symbol: "t", name: "Celsius temperature", value: "273.15" },
    "38": { symbol: "G", name: "Gravitational constant", value: "6.67430*10**-11" },
    "39": { symbol: "G p", name: "Proton mass-energy equivalent", value: "1.503277593*10**-10" }, // Example: some models have different 39
    "40": { symbol: "atm", name: "Standard atmosphere", value: "101325" }
};

export const CONSTANTS_SYMBOLS = Object.values(CONSTANTS_MAP).map(c => c.symbol);

export function getConstantByCode(code) {
    return CONSTANTS_MAP[code];
}

export function replaceConstants(expr) {
    let result = expr;
    // Sort symbols by length descending to avoid partial matches (e.g., λcp before λc)
    const sortedSymbols = [...CONSTANTS_SYMBOLS].sort((a, b) => b.length - a.length);
    
    for (const symbol of sortedSymbols) {
        const entry = Object.values(CONSTANTS_MAP).find(c => c.symbol === symbol);
        if (entry) {
            // Regex for exact match not preceded/followed by letters
            const regex = new RegExp(`(?<![a-zA-Z])${symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![a-zA-Z])`, 'g');
            result = result.replace(regex, `(${entry.value})`);
        }
    }
    return result;
}
