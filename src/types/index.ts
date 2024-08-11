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