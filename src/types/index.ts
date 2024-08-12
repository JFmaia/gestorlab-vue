export interface Genero {
  id: string;
  title: string;
}

export interface Permission {
  id: string;
  title: string;
}

export interface Imagefile {
  name: string;
  type: string;
  size: number;
}

export interface CreateLaboratory {
  nome: string;
  sobre: string;
  template: number;
  descricao: string;
  email: string;
  image: string | null;
  endereco: CreateEndereco
}

export interface Projeto {
  id: string
  titulo: string
  descricao: string
  lab_creator: string
  image: string | null
  autor_id: string
  data_inicial: string
  data_up: string
  membros: Array<UsuarioResponse> | null
}

export interface Pending {
  id: string | null;
  id_user: string | null;
  id_lab: string | null;
  id_project: string | null;
  ativo: boolean | null;
  data_create: string | null;
  data_atualizacao: string | null;
  matricula_user: string | null;
}

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

export interface Laboratorio {
  id: string;
  coordenador_id: string;
  nome: string;
  sobre: string;
  template: number;
  descricao: string;
  image: string | null;
  email: string;
  data_inicial: string;
  data_up: string;
  membros: Array<UsuarioResponse> | null;
  projetos: Array<Projeto> | null;
  lista_perm: Array<Permission> | null;
  lista_acess: Array<Pending> | null;
  endereco_id: string
  endereco: Endereco,
  check: boolean
}

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
  genero: string;
  email: string;
  matricula: number;
  tel: number;
  permissoes: Array<Permission>;
  lista_pending: Array<Pending>;
}