type Payload = {
    action: string;
    sender: { [key: string]: unknown };
    repository: { [key: string]: unknown };
    organization: { [key: string]: unknown };
    installation: { [key: string]: unknown };
    [key: string]: unknown;
};

type Issue = {
    body: string | null;
    title: string;
    [key: string]: unknown;
};

type Config = {
    PRIVATE_REPO_NAME: string | undefined;
    PUBLIC_REPO_NAME: string | undefined;
    ORGANIZATION_NAME: string | undefined;
    TOKEN: string | undefined;
};

type OrganizationRepo = {
    private: {
        id: string;
    };
    public: {
        id: string;
    };
};
