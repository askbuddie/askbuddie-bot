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
    PRIVATE_REPO_URL: string | undefined;
    PUBLIC_REPO_URL: string | undefined;
};
