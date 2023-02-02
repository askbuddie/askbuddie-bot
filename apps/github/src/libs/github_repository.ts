import config from 'src/config';
import RequestHandler from './request_handler';

type OrganizationRepo = {
    private: {
        id: string;
    };
    public: {
        id: string;
    };
};

class GithubRepository {
    private publicRepoId = '';
    private privateRepoId = '';
    private requestHandler: RequestHandler;

    constructor(requestHanlder: RequestHandler = new RequestHandler()) {
        this.requestHandler = requestHanlder;
    }

    public async init() {
        await this.getRepositoryId();
    }

    public async getRepositoryId(): Promise<void> {
        const origanization: string = config.ORGANIZATION_NAME ?? '';
        const privateRepo: string = config.PRIVATE_REPO_NAME ?? '';
        const publicRepo: string = config.PUBLIC_REPO_NAME ?? '';

        const query = `
            query GetRepo($org:String!, $private:String!, $public:String!) {
                organization(login: $org) {
                    private: repository(name: $private) {
                        id
                    }
                    public: repository(name: $public) {
                        id
                    }
                }
            }
        `;

        const res = await this.requestHandler.post(query, {
            org: origanization,
            private: privateRepo,
            public: publicRepo
        });

        if (res.data.errors || !res.data.data)
            throw new Error(res.data.errors.message ?? 'Something went wrong!');

        const repo = res.data.data.organization as OrganizationRepo;

        this.privateRepoId = repo.private.id;
        this.publicRepoId = repo.public.id;
    }

    public async createIssue(title: string, body: string): Promise<boolean> {
        const repo = this.publicRepoId;

        const query = `
                    mutation CreateIssue($repositoryId: ID!, $title:String!, $body:String!) {
                        createIssue(input:{repositoryId: $repositoryId, title: $title, body: $body}) {
                            issue { 
                                id
                            }
                        }
                    }
                
                `;

        const res = await this.requestHandler.post(query, {
            repositoryId: repo,
            title,
            body
        });

        if (res.data.errors || !res.data.data)
            throw new Error('Something went wrong!');

        return true;
    }
}

export default GithubRepository;
