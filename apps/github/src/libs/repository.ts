class Repository {
    private endpoint = 'https://api.github.com/graphql';
    private publicRepoId: string;
    private privateRepoId: string;

    constructor(privateRepoId: string, publicRepoId: string) {
        this.privateRepoId = privateRepoId;
        this.publicRepoId = publicRepoId;
    }

    public createIssue(title: string, body: string, privateRepo: boolean) {
        let repo = this.publicRepoId;

        if (privateRepo) repo = this.privateRepoId;
    }
}

export default Repository;
