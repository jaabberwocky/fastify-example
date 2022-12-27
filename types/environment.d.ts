declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'DEV' | 'PROD'
            PORT: string;
        }
    }
}

export {}