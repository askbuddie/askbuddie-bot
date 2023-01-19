import Event from '../libs/event';
import AskBuddieBot from 'src/libs/askbuddiebot';

class IssuesOpened implements Event {
    name = 'issues.opened';

    handleEvent(payload: Payload): boolean {
        const issue = payload.issue as Issue;
        const config = AskBuddieBot.getInstance().getConfig();

        // get the repo to create the issue
        let postRepo = config.PRIVATE_REPO_URL;

        if (payload.repository.html_url === postRepo)
            postRepo = config.PUBLIC_REPO_URL;

        return true;
    }
}

export default IssuesOpened;
