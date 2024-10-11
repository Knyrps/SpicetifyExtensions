class ColorPalette {
    constructor() {
        this.colors = this.GetColorPalette();
    }

    colors: { [key: string]: string };

    private GetColorPalette = (): { [key: string]: string } => {
        const prefix = "spice";
        const vars = this.GetAllVars();
        const bodyStyles = window.getComputedStyle(document.body);

        const colorPalette: { [key: string]: string } = {};

        function extractColorName(name: string, prefix: string): string {
            const regex = new RegExp(`^--${prefix}-(.+)$`);
            const match = name.match(regex);
            return match ? match[1] : name;
        }

        for (let i = 0; i < vars.length; i++) {
            const name = vars[i];
            if (name.startsWith(`--${prefix}`)) {
                const colorName = extractColorName(name, prefix);
                if (!colorName.startsWith("rgb-")) {
                    colorPalette[colorName] = bodyStyles.getPropertyValue(name);
                }
            }
        }

        window.SpiceColors = colorPalette;
        if (!window.SpiceColors) {
            console.error("Error setting window.SpiceColors");
        }
        return colorPalette;
    };

    private GetAllVars = () => {
        const customProperties: string[] = Array.from(document.styleSheets)
            .filter(
                (sheet): sheet is CSSStyleSheet =>
                    sheet.href === null ||
                    sheet.href.startsWith(window.location.origin)
            )
            .reduce<string[]>((acc, sheet) => {
                const cssRules = Array.from(sheet.cssRules);
                const rootVariables = cssRules.reduce<string[]>((def, rule) => {
                    if (
                        (rule as CSSStyleRule).selectorText === ":root" &&
                        rule instanceof CSSStyleRule
                    ) {
                        const styleProperties = Array.from(rule.style).filter(
                            (name) => name.startsWith("--")
                        );
                        return [...def, ...styleProperties];
                    }
                    return def;
                }, []);
                return [...acc, ...rootVariables];
            }, []);

        return customProperties;
    };

    GetColor = (key: string): string => {
        return this.colors[key] || "";
    };

    GetColors(...keys: string[]): string[] {
        const colorsArray: string[] = [];
        for (const key of keys) {
            colorsArray.push(this.colors[key] || "");
        }
        return colorsArray;
    }
}

// Helper function to convert hex color to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const bigint = parseInt(hex.slice(1), 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
    };
}

// Helper function to convert RGB to hex color
function rgbToHex(r: number, g: number, b: number): string {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Function to interpolate between two colors
function interpolateColor(
    color1: string,
    color2: string,
    factor: number
): string {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    const r = Math.round(rgb1.r + factor * (rgb2.r - rgb1.r));
    const g = Math.round(rgb1.g + factor * (rgb2.g - rgb1.g));
    const b = Math.round(rgb1.b + factor * (rgb2.b - rgb1.b));
    return rgbToHex(r, g, b);
}

// Function to generate an array of n colors fading from color a to color b
function generateColorFade(
    color1: string,
    color2: string,
    n: number
): string[] {
    const colors: string[] = [];
    for (let i = 0; i < n; i++) {
        const factor = i / (n - 1);
        colors.push(interpolateColor(color1, color2, factor));
    }
    return colors;
}

const colorPalette = new ColorPalette();
export default colorPalette;
export { generateColorFade };
