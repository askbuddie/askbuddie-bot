type Payload = {
    action: string;
    sender: Record<string, unknown>;
    repository: Record<string, unknown>;
    organization: Record<string, unknown>;
    installation: Record<string, unknown>;
    [key: string]: unknown;
};
