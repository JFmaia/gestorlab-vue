import { defineStore } from 'pinia';
import API from '@/services/index';
import type { CreateLaboratory } from '@/types';

export const labStore = defineStore('lab', {
  actions: {
    async getLaboratorys(id: string) {
      try {
        const response = await API.get('/laboratorios');
        const list = response.data;
        if (list.length !== 0) {
          const listAux: Array<any> = [];
          list.forEach((element: any) => {
            const isContent = element.membros.some((membro: any) => membro.id === id);
            if (!isContent) {
              listAux.push(element);
            }
          });
          return listAux;
        } else {
          return [];
        }
      } catch (error) {
        return error;
      }
    },
    async createLaboratorio(lab: CreateLaboratory, token: string) {
      try {
        await API.post('/laboratorios', {
          nome: lab.nome,
          sobre: lab.sobre,
          template: lab.template,
          descricao: lab.descricao,
          email: lab.email,
          image: lab.image,
          endereco: {
            ...lab.endereco
          }
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return true;
      } catch (error: any) {
        return error.response.data.detail;
      }
    }
  }
});