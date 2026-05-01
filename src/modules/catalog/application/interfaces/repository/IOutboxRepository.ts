export type TEvent = {
    exchange: string,
    routing_key: string,
    payload: string,
    published: boolean
}

export interface IOutBoxRepository {
    save(events: TEvent[]): Promise<void>
}