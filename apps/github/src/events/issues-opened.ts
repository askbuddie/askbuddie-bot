import Event from '../libs/event';
import AskBuddieBot from 'src/libs/askbuddiebot';

class IssuesOpened implements Event {
    name = 'issues.opened';

    async handleEvent(payload: Payload): Promise<boolean> {
        const issue = payload.issue as Issue;

        console.info(`Issue opened: ${issue.title}`);

        const body = issue.body + `<br/><br/>Ref: ${issue.id}`;

        return await AskBuddieBot.getInstance()
            .getRepository()
            .createIssue(issue.title, body);
    }
}

export default IssuesOpened;
