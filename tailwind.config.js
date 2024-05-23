/** @type {import('tailwindcss').Config} */
import {colors} from "./src/consts/colors";

module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {

            colors: {
                ...colors
            },
            fontFamily: {
                averia_b: ["AveriaSansLibre_Bold"],
                averia_bi: ["AveriaSansLibre_BoldItalic"],
                averia_i: ["AveriaSansLibre_Italic"],
                averia_l: ["AveriaSansLibre_Light"],
                averia_li: ["AveriaSansLibre_LightItalic"],
                averia_r: ["AveriaSansLibre_Regular"],
            },


        },
    },
    plugins: [],
};
