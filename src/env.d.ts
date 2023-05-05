/// <reference types="vite/client" />

interface ImportMetaEnv {
    NODE_ENV: "development" | "production";
    DATABASE_URL: string;
    SESSION_SECRET: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
