/**
 * Exemplo de referência do fluxo ports & adapters da camada de dados.
 *
 * NÃO é domínio de negócio (o template não tem um). Serve para demonstrar e
 * testar o padrão: porta de saída no núcleo, adapter HTTP na infraestrutura,
 * DTO mapeado para o modelo na borda. As features reais (spec 012) seguem este
 * mesmo padrão nas suas próprias pastas.
 */

/** Modelo usado pela aplicação (não é o DTO da API). */
export type ServiceInfo = {
  readonly name: string;
  readonly version: string;
  readonly healthy: boolean;
};

/** Porta de saída (pertence ao núcleo). A implementação vive na infraestrutura. */
export interface ServiceInfoGateway {
  fetchInfo(): Promise<ServiceInfo>;
}
