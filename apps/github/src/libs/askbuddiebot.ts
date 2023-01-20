import * as Events from '../events';
import Event from './event';
import config from 'src/config';
import Repository from './repository';

type EventList = {
    [key: string]: Event;
};

class AskBuddieBot {
    private events: EventList = {};
    private static instance: AskBuddieBot;
    private repository: Repository | undefined;

    private constructor() {
        console.info('Loading config...');
        Object.entries(config).forEach(([, value]) => {
            if (value == undefined) throw new Error('Invalid env file.');
        });

        console.info('Config loaded.');

        console.info('Loading events...');
        this.loadEvents();
        console.info('Events loaded.');

        console.info('Loading repositories');
        this.loadRepository().then(() => {
            console.info('Repository loaded');
        });
    }

    public static getInstance(): AskBuddieBot {
        if (!this.instance) this.instance = new AskBuddieBot();
        return this.instance;
    }

    // load all the events from events directory with the key ${event}.{action}
    private loadEvents(): void {
        Object.entries(Events).forEach(([, Event]) => {
            const e = new Event();
            this.events[e.name] = e;
        });
    }

    // get id of the github repos and create a graphql repository for all the requests
    private async loadRepository(): Promise<void> {
        const ids = await Repository.getRepositoryId(
            config.ORGANIZATION_NAME ?? '',
            config.PRIVATE_REPO_NAME ?? '',
            config.PUBLIC_REPO_NAME ?? ''
        );

        this.repository = new Repository(ids.private.id, ids.public.id);
    }

    public getRepository(): Repository {
        if (!this.repository) throw new Error('Repository is loading!');

        return this.repository;
    }

    // find the event from the key
    public getEvent(e: string): Event {
        if (!(e in this.events)) {
            throw new Error(e + ' is not registered in events!');
        }

        return this.events[e];
    }

    public isValidRepository(name: string): boolean {
        return name === config.PRIVATE_REPO_NAME;
    }
}

export default AskBuddieBot;
