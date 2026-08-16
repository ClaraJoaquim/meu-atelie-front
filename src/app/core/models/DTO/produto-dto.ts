export interface ProdutoDTO {
  id?: number;
  nomeCategoria?: string;
  materiais?: string[];

  nome: string;
  descricao: string;
  preco: number;
  categoriaId: number;
  usuarioId: number;
  materiaisIds: number[];

  precoCusto?: number;
  quantidadeEstoque?: number;
  status?: string;
  largura?: number;
  altura?: number;
  observacoes?: string;
  imagem?: string;
}