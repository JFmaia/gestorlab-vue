import { defineStore } from 'pinia';
import API from '@/services/index';
import { pendingStore } from '@/stores/pending';
import { toRaw } from 'vue';
import type { UsuarioResponse, LaboratorioResponse } from '@/types';

export const userStore = defineStore('user', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || '{}') as UsuarioResponse,
    laboratorys: JSON.parse(localStorage.getItem('laboratorys') || '[]') as Array<LaboratorioResponse>,
    laboratory: JSON.parse(localStorage.getItem('laboratory') || '{}') as LaboratorioResponse,
  }),

  getters: {
    getUser(state) {
      return toRaw(state.user);
    },
    getlaboratorys(state) {
      return toRaw(state.laboratorys);
    },
    getlaboratory(state) {
      if (Object.keys(state.laboratory).length === 0) {
        return null;
      } else {
        return toRaw(state.laboratory);
      }

    }
  },

  actions: {
    async deleteUser(id: string, token: string) {
      try {
        await API.delete(`/usuarios/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return true;
      } catch (error: any) {
        return error.response.data.detail;
      }
    },
    async getAllUsuarios() {
      try {
        const response = await API.get('/usuarios');
        return response.data;
      } catch (error: any) {
        const object = {
          message: error.response.data.detail,
          list: []
        };
        return object;
      }
    },
    async getUsuario(id: string, token: string) {
      try {
        const response = await API.get(`/usuarios/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error: any) {
        return error.response.data.detail;
      }
    },
    async updateLaboratorio(id: string, token: string) {
      const response = await API.get(`/laboratorios/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const lab: LaboratorioResponse = {
        ...response.data,
        check: true
      };

      this.laboratory = lab;
      localStorage.setItem('laboratory', JSON.stringify(this.laboratory));
    },
    getPedidosAtivos() {
      const list = this.laboratory.pedidos?.filter((item) => item.ativo === true);
      return list;
    },
    async setNewValueAndPrimaryAcess(value: boolean) {
      this.user.primeiro_acesso = value;
    },
    async setInviteForLab(object: any) {
      try {
        const response = await API.post('/usuarios/requestAcessLab', {
          id_user: object.id_user,
          id_lab: object.id_lab,
        }, {
          headers: {
            Authorization: `Bearer ${object.token}`,
          },
        });
        if (response.data.status === 201) {
          return true;
        }
      } catch (error: any) {
        return error.response.data.detail;
      }
    },
    changeLabInState(lab: any, index: number) {
      this.laboratorys.forEach((item: any) => {
        if (item.id !== lab.id) {
          item.check = false;
        }
      });
      this.laboratorys[index].check = true;
      localStorage.setItem('laboratory', JSON.stringify(lab));
      this.laboratory = lab;
    },
    async setUser(token: string) {
      try {
        if (this.laboratory && Object.keys(this.laboratory).length === 0) {
          const response = await API.get('/usuarios/logado', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const userData = response.data;

          const usuario = await API.get(`/usuarios/${userData.id}`);
          const data = { ...usuario.data };
          localStorage.setItem('user', JSON.stringify(data));
          this.user = data;

          if (data.laboratorios.length === 0) {
            localStorage.setItem('laboratorys', JSON.stringify([]));
            this.laboratorys = [];
            this.laboratory = {} as LaboratorioResponse;
          } else {
            const listAux = data.laboratorios.map((item: LaboratorioResponse) => ({
              ...item,
              check: false
            }));
            localStorage.setItem('laboratorys', JSON.stringify(listAux));
            this.laboratorys = listAux;
            listAux[0].check = true;
            localStorage.setItem('laboratory', JSON.stringify(listAux[0]));
            this.laboratory = listAux[0];
          }
        } else {
          const response = await API.get('/usuarios/logado', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const userData = response.data;
          const usuario = await API.get(`/usuarios/${userData.id}`);
          const data = { ...usuario.data };

          localStorage.setItem('user', JSON.stringify(data));
          this.user = data;

          if (data.laboratorios.length === 0) {
            localStorage.setItem('laboratorys', JSON.stringify([]));
            this.laboratorys = [];
            this.laboratory = {} as LaboratorioResponse; // Garantir que `this.laboratory` seja um objeto vazio
          } else {
            const listAux = data.laboratorios.map((item: LaboratorioResponse) => ({
              ...item,
              check: false
            }));
            listAux.forEach((item: LaboratorioResponse) => {
              if (item.id === this.laboratory.id) {
                item.check = true;
              }
            });

            localStorage.setItem('laboratorys', JSON.stringify(listAux));
            this.laboratorys = listAux;
            const labWithCheck = listAux.find((item: LaboratorioResponse) => item.check) || {} as LaboratorioResponse;
            this.laboratory = labWithCheck;

            localStorage.setItem('laboratory', JSON.stringify(this.laboratory));
          }
        }
      } catch (err) {
        console.error('Erro ao definir o usuário:', err);
        return err;
      }
    },
    async createUser(usuario: any) {
      const pending = pendingStore();
      try {
        const response = await API.post('/usuarios/signup', {
          primeiro_nome: usuario.primeiro_nome,
          segundo_nome: usuario.segundo_nome,
          data_nascimento: usuario.data_nascimento,
          id_genero: usuario.id_genero,
          email: usuario.email,
          image: usuario.image,
          matricula: usuario.matricula,
          tel: usuario.tel,
          senha: usuario.senha,
        });
        const data = {
          ...response.data
        };
        await pending.setPending(data);
        return true;
      } catch (error) {
        return error;
      }
    },
    clearUser() {
      // Remover os itens do localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('laboratorys');
      localStorage.removeItem('laboratory');

      // Limpar o estado do store
      this.user = {} as UsuarioResponse;
      this.laboratorys = [];
      this.laboratory = {} as LaboratorioResponse;
    },
    async recoveryPassword(object: any) {
      try {
        await API.post('/usuarios/passwordRecovery', {
          id_user: object.id_user,
          senha: object.senha
        });
        return true;
      } catch (error: any) {
        return false;
      }
    },
    async sendEmailPasswordRecovery(email: string) {
      try {
        await API.post('/usuarios/sendEmail', {
          email: email
        });
        return true;
      } catch (error: any) {
        return false;
      }
    },
  },
}); 