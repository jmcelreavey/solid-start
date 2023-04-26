import { type Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        container: {
            center: true,
            padding: "1.5rem",
            screens: {
                "2xl": "1360px",
            },
        },
    },
    plugins: [require("daisyui"), require("@tailwindcss/typography")],
    daisyui: {
        styled: true,
        themes: true,
        base: true,
        utils: true,
        logs: true,
        rtl: false,
        prefix: "",
        darkTheme: "dark",
    },
} satisfies Config;
