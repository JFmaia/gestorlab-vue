/* eslint-disable indent */
export function removerCaracter(texto: any) {
  // eslint-disable-next-line no-useless-escape
  const regex = /[.\-\/()\s]/g;
  const textoSemCaracteres = texto.replace(regex, '');
  return Number(textoSemCaracteres);
}

export function chooseListMenu(option: Number) {
  const menuAdmin = [
    {
      label: 'Linha do tempo',
      icon: 'view_timeline',
      value: 0,
      separator: true,
      link: 'time-line'
    },
    {
      label: 'Laboratorios',
      value: 1,
      icon: 'group_work',
      separator: true,
      link: 'laboratorios'
    },
    {
      label: 'Pedidos de acesso',
      icon: 'person_add',
      value: 0,
      separator: true,
      link: 'pedidos-acess'
    },
    {
      value: 0,
      label: 'Usuários',
      icon: 'group',
      separator: true,
      link: 'usuarios'
    },
    {
      value: 1,
      label: 'Projetos',
      icon: 'dashboard',
      separator: true,
      link: ''
    },
  ];

  const menuCoordenador = [
    {
      value: 0,
      label: 'Linha do tempo',
      icon: 'view_timeline',
      separator: true,
      link: 'time-line'
    },
    {
      label: 'Laboratório',
      value: 1,
      icon: 'group_work',
      separator: true,
      link: 'laboratory'
    },
    {
      value: 0,
      label: 'Membros',
      icon: 'group',
      separator: true,
      link: ''
    },
    {
      label: 'Projetos',
      icon: 'dashboard',
      separator: true,
      link: 'projetos'
    }
  ];

  const menuMember = [
    {
      value: 0,
      label: 'Linha do tempo',
      icon: 'view_timeline',
      separator: true,
      link: 'time-line'
    },
    {
      value: 1,
      label: 'Laboratório',
      icon: 'group_work',
      separator: true,
      link: 'laboratory'
    },
    {
      value: 1,
      label: 'Projetos',
      icon: 'dashboard',
      separator: true,
      link: ''
    }
  ];

  const menuColaboradores = [
    {
      label: 'Linha do tempo',
      icon: 'view_timeline',
      separator: true,
      link: 'time-line'
    },
    {
      value: 1,
      label: 'Laboratório',
      icon: 'group_work',
      separator: true,
      link: 'laboratory'
    },
    {
      value: 1,
      label: 'Projetos',
      icon: 'dashboard',
      separator: true,
      link: ''
    },
  ];

  let decisionOption = null;
  switch (option) {
    case 0:
      decisionOption = menuMember;
      break;
    case 1:
      decisionOption = menuCoordenador;
      break;
    case 2:
      decisionOption = menuAdmin;
      break;
    case 3:
      decisionOption = menuColaboradores;
      break;
    default:
      decisionOption = menuMember;
  }

  return decisionOption;
}