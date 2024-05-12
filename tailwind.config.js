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
                averia_b: ["AveriaSerifLibre_Bold"],
                averia_bi: ["AveriaSerifLibre_BoldItalic"],
                averia_i: ["AveriaSerifLibre_Italic"],
                averia_l: ["AveriaSerifLibre_Light"],
                averia_li: ["AveriaSerifLibre_LightItalic"],
                averia_r: ["AveriaSerifLibre_Regular"],
            },


        },
    },
    plugins: [],
};
