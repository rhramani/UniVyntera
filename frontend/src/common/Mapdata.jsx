import WorldMap from "react-svg-worldmap";

const populationData = [
    { country: "cn", value: 1389618778 }, // China
    { country: "in", value: 1311559204 }, // India
    { country: "us", value: 331883986 }, // United States
    { country: "id", value: 264935824 }, // Indonesia
    { country: "br", value: 210301591 }, // Brazil
    { country: "ng", value: 208679114 }, // Nigeria
    { country: "ru", value: 141944641 }, // Russia
    { country: "mx", value: 127318112 }, // Mexico
];

// Spanish translation of country names
const localizedCountryDictionary = new Map([
    ["br", "Brasil"], // Brazil
    ["cn", "China"], // China
    ["id", "Indonesia"], // Indonesia
    ["in", "India"], // India
    ["mx", "México"], // Mexico
    ["ng", "Nigeria"], // Nigeria
    ["ru", "Rusia"], // Russia
    ["us", "Estados Unidos"], // United States
]);

// Spanish number formatting for thousands, millions, and billions
// E.g. translate the number 1000000 to "1 millónes"
function localizeNumber(num , digits) {
    if (typeof num === "undefined") return "";
    const magnitude = [
        { value: 1e9, text: " mil millónes " },
        { value: 1e6, text: " millónes " },
        { value: 1e3, text: " miles " },
        { value: 1, text: "" },
    ].find((magnitude) => num >= magnitude.value);
    if (magnitude) {
        return (
            (num / magnitude.value)
                .toFixed(digits)
                .replace(/\.0+$|(?<number>\.[0-9]*[1-9])0+$/, "$1") + magnitude.text
        );
    }
    return "";
}

const getLocalizedText = ({
    countryCode,
    countryValue,
    prefix,
    suffix,
}) =>
    `${localizedCountryDictionary.get(countryCode.toLocaleLowerCase()) ?? "Unknown"
    }: ${prefix}${localizeNumber(countryValue, 2)}${suffix}`;

const getStyle = ({
    countryValue,
    countryCode,
    minValue,
    maxValue,
    color,
}) => ({
    fill: countryCode === "US" ? "#5962ca" : color,
    fillOpacity: countryValue
        ? 0.1 + (1.5 * (countryValue - minValue)) / (maxValue - minValue)
        : 0,
    stroke: "#5962ca",
    strokeWidth: 2,
    strokeOpacity: 0.9,
    cursor: "pointer",
});

export default function EcommerceMap() {
    return (
        <WorldMap
            color="#5962ca"
            tooltipBgColor="blue"
            styleFunction={getStyle}
            size="lg"

            data={populationData}
            valueSuffix="personas"
            tooltipTextFunction={getLocalizedText}
        />
    );
}