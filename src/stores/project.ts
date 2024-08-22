import { defineStore } from 'pinia';
import API from '@/services/index';
import type { ProjetoResponse } from '@/types';

export const projetoStore = defineStore('projeto', {
  actions: {
    async createProjeto(proj: any, token: string) {
      try {
        await API.post('/projetos', {
          titulo: proj.titulo,
          image: proj.image,
          descricao: proj.descricao,
          laboratorio_id: proj.id
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return true;
      } catch (error: any) {
        return error.response.data.detail;
      }
    },
    async deleteProjeto(id: any, token: string) {
      try {
        await API.delete(`/projetos/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return true;
      } catch (error: any) {
        return error.response.data.detail;
      }
    },
    async getProject(id: any, token: string) {
      try {
        const response = await API.get(`/projetos/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const object = {
          project: response.data,
          message: ''
        };
        return object;
      } catch (e: any) {
        const object = {
          project: null,
          message: e.response.data.detail
        };
        return object;
      }
    },
    async getAllProjetos(id: any, token: string) {
      try {
        const response = await API.get('/projetos', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data: Array<ProjetoResponse> = response.data;
        const listFilter = data.filter((projeto: ProjetoResponse) => projeto.laboratorio_id === id);
        if (listFilter.length === 0) {
          const object = {
            listProject: [],
            message: ''
          };
          return object;
        } else {
          const object = {
            listProject: listFilter,
            message: ''
          };
          return object;
        }

      } catch (e: any) {
        const object = {
          listProject: [],
          message: e.response.data.detail
        };
        return object;
      }
    }
  }
});