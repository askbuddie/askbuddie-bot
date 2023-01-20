type Payload = {
    action: string;
    sender: Record<string, unknown>;
    repository: Record<string, unknown>;
    organization: Record<string, unknown>;
    installation: Record<string, unknown>;
    [key: string]: unknown;
};

type Issue = {
    body: string | null;
    title: string;
    [key: string]: unknown;
};

type Config = {
    PRIVATE_REPO_NAME?: string;
    PUBLIC_REPO_NAME?: string;
    ORGANIZATION_NAME?: string;
    TOKEN?: string;
};

type OrganizationRepo = {
    private: {
        id: string;
    };
    public: {
        id: string;
    };
};
