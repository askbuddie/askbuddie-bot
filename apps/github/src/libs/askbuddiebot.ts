import * as Events from '../events';
import Event from './event';
import config from 'src/config';

type EventList = {
    [key: string]: Event;
};

class AskBuddieBot {
    private events: EventList = {};
    private config: Config;
    private static instance: AskBuddieBot;

    private constructor() {
        console.info('Loading config...');
        this.config = config;
        console.info('Config loaded.');

        console.info('Loading events...');
        this.loadEvents();
        console.info('Events loaded.');
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

    // find the event from the key
    public getEvent(e: string): Event {
        if (!(e in this.events)) {
            throw new Error(e + ' is not registered in events!');
        }

        return this.events[e];
    }

    public isValidRepository(url: string): boolean {
        return (
            url === this.config.PRIVATE_REPO_URL ||
            url === this.config.PUBLIC_REPO_URL
        );
    }

    public getConfig(): Config {
        return this.config;
    }
}

export default AskBuddieBot;
