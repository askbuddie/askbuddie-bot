import Axios from 'axios';
import config from 'src/config';

class Repository {
    private static endpoint = 'https://api.github.com/graphql';
    private publicRepoId: string;
    private privateRepoId: string;

    constructor(privateRepoId: string, publicRepoId: string) {
        this.privateRepoId = privateRepoId;
        this.publicRepoId = publicRepoId;
    }

    public static async request(
        query: string,
        variables: Record<string, unknown>
    ) {
        return await Axios({
            url: this.endpoint,
            method: 'POST',
            data: {
                query: query,
                variables: variables
            },
            headers: {
                Authorization: `Bearer ${config.TOKEN}`
            }
        });
    }

    public static async getRepositoryId(
        origanization: string,
        privateRepo: string,
        publicRepo: string
    ): Promise<OrganizationRepo> {
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

        const res = await Repository.request(query, {
            org: origanization,
            private: privateRepo,
            public: publicRepo
        });

        if (res.data.errors || !res.data.data)
            throw new Error(res.data.errors.message ?? 'Something went wrong!');

        return res.data.data.organization as OrganizationRepo;
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

        const res = await Repository.request(query, {
            repositoryId: repo,
            title,
            body
        });

        if (res.data.errors || !res.data.data)
            throw new Error('Something went wrong!');

        return true;
    }
}

export default Repository;
