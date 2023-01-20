interface Event {
    name: string;
    handleEvent(payload: Payload): Promise<boolean>;
}

export default Event;
