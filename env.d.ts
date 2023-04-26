interface ImportMeta {
    readonly env: {
        NODE_ENV: "development" | "production";
        DATABASE_URL: string;
        SESSION_SECRET: string;
    };
}
