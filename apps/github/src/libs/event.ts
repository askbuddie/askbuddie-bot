interface Event {
    name: string;
    handleEvent(payload: Payload): boolean;
}

export default Event;
