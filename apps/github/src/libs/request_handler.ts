import Axios from 'axios';
import config from 'src/config';

class RequestHandler {
    private endpoint = 'https://api.github.com/graphql';

    public async post(query: string, variables: Record<string, unknown>) {
        return await Axios.post(
            this.endpoint,
            { query, variables },
            {
                headers: { Authorization: `Bearer ${config.TOKEN}` }
            }
        );
    }
}

export default RequestHandler;
