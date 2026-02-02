const countryMapping = {
    USA: "United States",
    UK: "United Kingdom",
    UAE: "United Arab Emirates"
    // Add more mappings here if needed
};

function buildCountryRegex(countryInput) {
    if (!countryInput) return null;

    const lowerInput = countryInput.trim().toLowerCase();

    let matches = [];

    for (const [abbr, fullName] of Object.entries(countryMapping)) {
        if (
            abbr.toLowerCase() === lowerInput ||
            fullName.toLowerCase() === lowerInput
        ) {
            matches.push(abbr, fullName);
            break;
        }
    }

    if(matches.length === 0){
        matches.push(countryInput);
    }

    const regexPattern = matches.map(name => `^${name}$`).join("|");

    return new RegExp(regexPattern, "i");
}

function buildCountryQuery(fieldName = "country", countryInput) {
    const regex = buildCountryRegex(countryInput);
    if(!regex) return {};

    return { [fieldName]: {$regex: regex}};
}


module.exports = { buildCountryRegex, buildCountryQuery }