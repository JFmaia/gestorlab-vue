// Genero
export interface Genero {
  id: string;
  title: string;
}

// Permissions
export interface Permission {
  id: string;
  title: string;
}

export interface PermissionOfLab {
  id: string;
  title: string;
  perm: PermissionLab
}

export interface PermissionLab {
  id: string;
  id_lab: string | null;
  id_user: string | null;
  id_perm: string;
  permissao: PermissionOfLab
}

// Image
export interface Imagefile {
  name: string;
  type: string;
  size: number;
}

//Laboratorio
export interface CreateLaboratory {
  nome: string;
  sobre: string;
  template: number;
  descricao: string;
  email: string;
  image: string | null;
  endereco: CreateEndereco
}

export interface LaboratorioResponse {
  id: string;
  coordenador_id: string;
  nome: string;
  sobre: string;
  template: number;
  descricao: string;
  email: string;
  data_inicial: string;
  data_up: string;
  membros: Array<Usuario> | null;
  projetos: Array<Projeto> | null;
  permissoes: Array<PermissionLab> | null;
  pedidos: Array<Pending> | null;
  endereco_id: string;
  endereco: Endereco;
  check: boolean;
  image: string | null;
}

export interface Laboratorio {
  id: string;
  coordenador_id: string;
  nome: string;
  sobre: string;
  template: number;
  descricao: string;
  email: string;
  data_inicial: string;
  data_up: string;
  endereco_id: string;
  coordenador: Usuario;
  endereco: Endereco | null;
  image: string | null;
}

//Projeto
export interface ProjetoResponse {
  id: string;
  titulo: string;
  descricao: string;
  laboratorio_id: string;
  image: string | null;
  autor_id: string;
  data_inicial: string;
  data_up: string;
  membros: Array<Usuario> | null;
  laboratorio: Laboratorio;
}

export interface Projeto {
  id: string;
  titulo: string;
  descricao: string;
  laboratorio_id: string;
  autor_id: string;
  data_inicial: string;
  data_up: string;
  membros: Array<Usuario> | null;
  image: string | null
}

//Pedidos
export interface Pending {
  id: string | null;
  id_user: string | null;
  usuario: Usuario | null;
  id_lab: string | null;
  laboratorio: Laboratorio | null;
  ativo: boolean | null;
  data_create: string | null;
  data_atualizacao: string | null;
  matricula_user: string | null;
}

//Endereço
export interface Endereco {
  id: string;
  logradouro: string;
  numero: number;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: number;
  pais: string;
  data_inicial: string;
  data_up: string;
}

export interface CreateEndereco {
  logradouro: string;
  numero: number;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: number;
  pais: string;
}

// Usuario
export interface UsuarioResponse {
  id: string;
  data_inicial: string;
  data_atualizacao: string;
  primeiro_acesso: boolean;
  ativo: boolean;
  primeiro_nome: string;
  image: string | null;
  segundo_nome: string;
  data_nascimento: string;
  id_genero: string;
  genero: Genero;
  email: string;
  matricula: number;
  tel: number;
  id_perm: string | null;
  permissao: Permission | null;
  pedidos: Array<Pending> | null;
  laboratorios: Array<Laboratorio> | null;
}

export interface Usuario {
  id: string;
  data_inicial: string;
  data_atualizacao: string;
  primeiro_acesso: boolean;
  ativo: boolean;
  primeiro_nome: string;
  segundo_nome: string;
  data_nascimento: string;
  email: string;
  matricula: number;
  tel: number;
  id_genero: string
  image: string | null;
}
