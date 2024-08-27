<script setup lang="ts">
import {userStore} from '@/stores/user';
import {permStore} from '@/stores/perm';
import {labStore} from '@/stores/laboratory';
import {authStore} from '@/stores/auth';
import { useRouter, useRoute } from 'vue-router';
import {ref, onMounted, watch} from 'vue';
import { QIcon, QDialog, QSeparator, QCard, QCardActions, QCardSection, QBtn, QSpinnerDots } from 'quasar';
import type { Pending,  LaboratorioResponse,  PermissionOfLab,  UsuarioResponse } from '@/types';
import MyCard from '@/components/MyCard.vue';
import ModalCreateLab from '@/views/dashboard/components/laboratory/ModalCreateLab.vue';

// State
const router = useRouter();
const route = useRoute();
const user = userStore();
const perm = permStore();
const labe = labStore();
const auth = authStore();
//variables
let lab = ref<LaboratorioResponse | null>();
let userLocal = ref<UsuarioResponse>();
let permUser = ref<any>('');
let isDeleted = ref<boolean>(false);
let confirmLab = ref<string>();
let liberty = ref<boolean>(true);
let listPedidos = ref<Array<Pending>>();
let dialogCreateLab= ref<boolean>(false);
let dialogEditLab= ref<boolean>(false);
let loadingPage = ref<boolean>(false);
const id = route.params.id;
// Uso do watch
watch(confirmLab, (newValue) => {
  if(newValue === lab.value?.nome){
    liberty.value = false;
  } else {
    liberty.value = true;
  }
});

defineEmits(['event']);

//function
onMounted(async () => {
  await initPageLaboratorio();
});

async function initPageLaboratorio(){
  loadingPage.value = true;
  if(id === 'null'){
    lab.value = null;
  }else {
    lab.value = await labe.getLaboratory(id, auth.getToken);
  }
  userLocal.value = user.getUser;
  listPedidos.value = user.getPedidosAtivos();
  await isTag();
  loadingPage.value = false;
}

async function receiveEvent(data: boolean){
  dialogEditLab.value = data;
  dialogCreateLab.value = data;
  await initPageLaboratorio();
}

async function isTag(){
  if(lab.value?.permissoes?.length !== 0){
    const response = lab.value?.permissoes?.find((perm: any)=> perm.id_user === userLocal.value?.id);
    if(response) {
      const permissions: Array<PermissionOfLab> = await perm.getPermissionsLab();
      const pemissionSelect = permissions.find((permi)=> permi.id === response.id_perm );
      permUser.value = pemissionSelect?.title;
      
    }else{
      permUser.value = '';
    }
  } else {
    permUser.value = '';
  }
}

async function deletedLab(){
  isDeleted.value = true;
}

async function deletedLabConfirm(){
  const response = await labe.deleteLaboratorio(lab.value?.id ?? '', auth.getToken);
  if(response){
    router.push('/pageAcess');
  } else {
    isDeleted.value = false;
    alert(response);
  }
}

function openDialogCreateLab(){
  dialogCreateLab.value = true;
}

function openDialogEditLab(){
  dialogEditLab.value = true;
}
</script>
<template>
  <div
    class="loading"
    v-if="loadingPage"
  >
    <QSpinnerDots
      size="20px"
      color="primary"
    />
  </div>
  <div v-else>
    <div
      class="info-container"
      v-if="lab === null"
    >
      <p>Você não faz parte de nenhum laboratório!</p>
      <button
        v-show="userLocal?.permissao?.title === 'Coordenador'"
        @click.prevent="openDialogCreateLab()"
      >
        Crie seu Laboratório
      </button>
      <q-dialog v-model="dialogCreateLab">
        <ModalCreateLab
          :tipo="1"
          @event="receiveEvent"
        />
      </q-dialog>
    </div>
    <div
      class="lab-container"
      v-else
    >
      <q-dialog v-model="dialogEditLab">
        <ModalCreateLab
          :tipo="2"
          :laboratorio="lab"
          @event="receiveEvent"
        />
      </q-dialog>
      <section class="profile-lab">
        <div class="box-profile">
          <img
            class="img-avatar"
            v-if="lab && lab.image"
            :src="`${lab?.image}`"
            alt="Imagem do Laboratorio"
          >
          <div>
            <h1>{{ lab?.nome }}</h1>
            <p>{{ lab?.descricao }}</p>
            <span @click="()=>{}">
              <QIcon
                name="groups"
                size="1.2rem"
              />
              {{ lab?.membros?.length }}
            </span>
          </div>
          <button @click="openDialogEditLab()">
            Editar o laboratório
          </button>
        </div>
      </section>
      <section class="body-lab">
        <div v-show="permUser === 'Coordenador' || permUser === 'Supervisor'">
          <h2>Pedidos de acesso</h2>
          <article
            class="info-empty"
            v-if="listPedidos?.length === 0"
          >
            <h3>Não a nenhum pedido de acesso para esse laboratório!</h3>
          </article>
          <ul v-else>
            <MyCard
              v-for="pedido in listPedidos"
              :key="pedido.id ?? ''"
              :type="1"
              :id-pend="pedido.id ?? ''"
              :id-user="pedido.id_user ?? ''"
              :id-lab="pedido.id_lab ?? ''"
              :nome-user="`${pedido.usuario?.primeiro_nome} ${pedido.usuario?.segundo_nome}`" 
              :date-create="pedido.data_create ?? ''"
            />
          </ul>
        </div>
        <q-separator
          v-show="permUser === 'Coordenador' || permUser === 'Supervisor'"
          class="divider"
        />
        <div>
          <h2>Projetos</h2>
          <article
            class="info-empty"
            v-if="lab?.projetos?.length === 0 || lab?.projetos?.length === null || lab?.projetos?.length === undefined"
          >
            <h3>Não a nenhum projeto no laboratório!</h3>
          </article>
          <ul v-else>
            <MyCard
              v-for="projeto in lab?.projetos"
              :key="projeto.id ?? ''"
              :type="2"
              :id-user="projeto.autor_id ?? ''"
              :title="projeto.titulo"
              :id-lab="projeto.laboratorio_id ?? ''"
              :id-projeto="projeto.id ?? ''"
              :date-create="projeto.data_inicial ?? ''"
            />
          </ul>
        </div>
        <q-separator
          class="divider"
          dark
        />
        <div>
          <h2>Descrição</h2>
          <p>{{ lab?.descricao }}</p>
        </div>
        <q-separator
          class="divider"
          dark
        />
        <div>
          <h2>Sobre</h2>
          <p>{{ lab?.sobre }}</p>
        </div>
        <footer v-show="permUser === 'Coordenador'">
          <button @click="deletedLab()">
            Deletar Laboratorio
          </button>
        </footer>
      </section>
      <q-dialog v-model="isDeleted">
        <q-card class="card-dialog">
          <q-card-section>
            <div class="text-h6">
              Confirme o nome do Laboratório
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <input
              v-model="confirmLab"
              @keyup.enter="()=>{}"
            >
          </q-card-section>

          <q-card-actions
            align="right"
            class="text-primary"
          >
            <q-btn
              flat
              label="Cancelar"
              @click.prevent="isDeleted = false"
            />
            <q-btn
              :disabled="liberty"
              flat
              label="Deletar"
              @click.prevent="deletedLabConfirm()"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>
<style scoped lang="scss">
  .lab-container{
    padding: 4rem;
    display: flex;
    gap: 2rem;
    align-items: flex-start;
  }

  .divider{
    background-color: $contour;
    height: 1px;
    width: 100%;
  }

  .loading{
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }

  .card-dialog{
    font-size: $textColor;
    min-width: 350px;
    background-color: $dark;
  }

  .img-avatar {
    width: 16rem;
    height: 16rem;
    border-radius: 50%;
  }

  .info-container{
    min-height: 90vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    font-weight: 700;
    color: $textColor;
  }

  .info-container button{
    cursor: pointer;
    padding: 0.8rem;
    background-color: $primary;
    border: 1px solid $contour;
    border-radius: 0.8rem;
    color: $secondary;
    font-size: 1rem;
    font-weight: 700;
  }

  .info-container button:hover{
    background-color: $dark
  }
  .q-input {
    width: 100%;
    color: yellow;
    background-color: $dark;
    border-color: $contour;
  }

  section{
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .profile-lab{
    flex:1;
  }

  .body-lab{
    padding: 2rem;
    flex:3;
    background-color: $dark;
    width: 100%;
    border-radius: 1rem;
    border: 1px solid $contour;
  }

  .body-lab div {
    width: 100%;
    display: flex;
    align-items: flex-start;
    gap: 1.4rem;
    flex-direction: column;
  }

  .body-lab div h2 {
    font-size: 1.4rem;
    font-weight: 700;
  }

  .body-lab div h3 {
    font-size: 1rem;
    font-weight: 500;
  }

  .body-lab div ul {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
    overflow-x: auto;
  }

  .box-profile{
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  .box-profile h1{
    font-size: 2rem;
    font-weight: 700;
  }

  .box-profile p {
    font-size: 1.2rem;
    font-weight: 500;
    max-width: 400px;
    line-height: 24px;
  }

  .box-profile div {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.2rem;
  }

  .box-profile div span{
    cursor: pointer;
    display: flex;
    gap: 0.2rem;
    align-items: center;
  }

  .box-profile div span:hover{
    color: $secondary;
  }

  .box-profile button {
    cursor: pointer;
    width: 100%;
    padding: 0.8rem;
    background-color: $primary;
    border: 1px solid $contour;
    border-radius: 0.8rem;
    color: $textColor;
    font-size: 1rem;
    font-weight: 700;
  }

  .info-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 300px;
    width: 100%;
  }

  .box-profile button:hover {
    background-color: $dark
  }

  footer {
    display: flex;
    align-items: center;
    justify-content: flex-end
  }

  input{
    width: 100%;
    color: $textColor;
    padding: 12px 16px;
    padding-left: 8px;
    background-color: $dark;
    border-radius: 10px;
    border: $contour solid 1px;
  }

  footer button{
    cursor: pointer;
    width: 100%;
    padding: 0.8rem;
    background-color: $primary;
    border: 1px solid $contour;
    border-radius: 0.8rem;
    color: $error;
    font-size: 1rem;
    font-weight: 700;
  }
  footer button:hover {
    background-color: $dark
  }
</style>