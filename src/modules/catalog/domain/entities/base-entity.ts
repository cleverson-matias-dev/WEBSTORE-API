
export abstract class Entity<T> {
  private _domainEvents: T[] = [];

  get domainEvents(): T[] { return this._domainEvents; }

  protected addDomainEvent(event: T): void {
    this._domainEvents.push(event);
  }

  public clearEvents(): void {
    this._domainEvents = [];
  }
}
