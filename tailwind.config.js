/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {

            colors: {
                background: "#fdf8d8",
                header: {
                    text: '#00e1ff',
                    menu: '#0040ff',
                    bg: "#3cff00",
                    border: "#e600ff",
                },
                tabbar: {
                    bg: "#fff700",
                    active_tab: "#ff4400",
                    inactive_tab: "#11ff00",
                    border: "#d400ff",
                }
            },
            fontFamily: {
                averia_b: ["AveriaSerifLibre_Bold"],
                averia_bi: ["AveriaSerifLibre_BoldItalic"],
                averia_i: ["AveriaSerifLibre_Italic"],
                averia_l: ["AveriaSerifLibre_Light"],
                averia_li: ["AveriaSerifLibre_LightItalic"],
                averia_r: ["AveriaSerifLibre_Regular"],
            }

        },
    },
    plugins: [],
};
