import AskBuddieBot from 'src/libs/askbuddiebot';
import express from 'express';

const app = express();
const port = 3000;

const askBuddieBot = AskBuddieBot.getInstance();

app.use(express.json());

app.post('/payload', async (req, res) => {
    const payload = req.body as Payload;

    // get event name and action from the request
    const event = req.headers['x-github-event'] ?? null;

    if (event === 'ping') return res.status(200).send('OK');

    if (event === null) return res.status(400).send('Unknown event.');

    const eventName = `${event}.${payload.action}`;

    // find the registered event in the bot
    let botEvent;
    try {
        botEvent = askBuddieBot.getEvent(eventName);
    } catch (e: unknown) {
        if (e instanceof Error) {
            console.error(e.message);
        } else {
            console.error('Something went wrong!');
        }
        return;
    }

    // check if the event is from registered repository
    if (
        !askBuddieBot.isValidRepository(
            (payload.repository?.name as string) ?? ''
        )
    )
        return res.status(400).send('Not allowed.');

    // execute the event
    const success = await botEvent?.handleEvent(payload);

    if (!success) return res.status(500).send('Something went wrong!');

    res.status(200).send('OK');
});

app.listen(port, () => {
    console.log(`App started on port ${port}.`);
});
