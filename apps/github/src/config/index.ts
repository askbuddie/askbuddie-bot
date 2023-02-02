type Config = {
    PRIVATE_REPO_NAME?: string;
    PUBLIC_REPO_NAME?: string;
    ORGANIZATION_NAME?: string;
    TOKEN?: string;
};

const config: Config = {
    PRIVATE_REPO_NAME: process.env.PRIVATE_REPO_NAME,
    PUBLIC_REPO_NAME: process.env.PUBLIC_REPO_NAME,
    ORGANIZATION_NAME: process.env.ORGANIZATION_NAME,
    TOKEN: process.env.TOKEN
};

export default config;
