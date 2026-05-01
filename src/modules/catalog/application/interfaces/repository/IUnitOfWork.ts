// @modules/catalog/application/interfaces/repository/IUnitOfWork
export interface IUnitOfWork {
  // T é o retorno do que for executado dentro da transação
  run<T>(work: () => Promise<T>): Promise<T>;
}
