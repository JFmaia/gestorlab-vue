<script setup lang="ts">
import type { UsuarioResponse,  LaboratorioResponse, ProjetoResponse, Usuario } from '@/types';
import { projetoStore } from '@/stores/project';
import {labStore} from '@/stores/laboratory';
import {authStore } from '@/stores/auth';
import {userStore } from '@/stores/user';
import {useRouter} from 'vue-router';
import MyCard from '@/components/MyCard.vue';
import { QSpinnerDots, QCard, QCardSection, QSeparator, QDialog, QIcon, QMenu, QList, QItem, QItemSection } from 'quasar';
import ModalCreateProject from '@/views/dashboard/components/projeto/ModalCreateProject.vue';
import {ref, onMounted} from 'vue';

// state
const router = useRouter();
const proj = projetoStore();
const user = userStore();
const auth = authStore();
const lab = labStore();
// variaveis
let dialogCreateProject = ref<boolean>(false);
let selectedProject= ref<ProjetoResponse>();
let memberLab = ref<Usuario | null>(null);
let laboratory = ref<LaboratorioResponse | null>();
let usuario = ref<UsuarioResponse>();
let listProject = ref<Array<ProjetoResponse>>();
let textSearch = ref<string>();
let isDeleted = ref<boolean>(false);
let loading = ref<boolean>(false);
let listMembrosLab = ref<Array<Usuario>>();


// function
onMounted(async() => {
  loading.value = true;
  laboratory.value = user.getlaboratory;
  usuario.value = user.getUser;
  await getProject();
  loading.value = false;
});

function openDialogCreateProject(){
  dialogCreateProject.value = true;
}

async function getProject(){
  const response = await proj.getListAllProjetos(auth.getToken);
  if(response.listProject.length !== 0){
    listProject.value = response.listProject;
  } else {
    listProject.value = [];
  }
}

async function receiveEvent(data: boolean){
  dialogCreateProject.value = data;
}

async function deletedProject(){
  const response = await proj.deleteProjeto(selectedProject.value?.id, auth.getToken);
  if(response){
    router.push('/projetos');
  } else {
    isDeleted.value = false;
    alert(response);
  }
}

async function changeProjectConfig(project: ProjetoResponse){
  selectedProject.value = project;
  const labe: LaboratorioResponse = await lab.getLaboratory(selectedProject.value.laboratorio_id, auth.getToken);
  const listMembrosLaboratorio = labe?.membros;
  const listMembrosProject = selectedProject.value?.membros;
  
  listMembrosLab.value = listMembrosLaboratorio?.filter(membroLaboratorio => 
    !listMembrosProject?.some(membroProjeto => membroProjeto.id === membroLaboratorio.id)
  );

}

</script>
<template>
  <q-dialog v-model="dialogCreateProject">
    <ModalCreateProject
      :id-lab="laboratory?.id ?? ''"
      @event="receiveEvent"
    />
  </q-dialog>
  <div class="container-list">
    <div class="list-header">
      <span>Projetos</span>
      <input
        type="text"
        placeholder="Buscar projeto"
        v-model="textSearch"
      >
    </div>
    <div
      v-if="loading"
      class="info"
    >
      <QSpinnerDots
        size="20px"
        color="primary"
      />
    </div>
    <div
      v-else
      class="list"
    >
      <div
        v-show="listProject?.length !== 0"
      >
        <q-card
          v-for="projeto in listProject"
          :key="projeto.id"
          @click.prevent="changeProjectConfig(projeto)"
          dark
          bordered
          class="card-project"
        >
          <q-card-section>
            <article>
              <h1>{{ projeto.titulo }}</h1>
              <p>{{ projeto.data_inicial }}</p>
            </article>
          </q-card-section>
          <q-separator
            dark
          />
          <q-card-section>
            <span class="span-article">{{ projeto.descricao }}</span>
          </q-card-section>
        </q-card>
      </div>
      <div
        v-show="listProject?.length === 0"
        class="info"
      >
        <h3>Nenhum laboratório encontrado!</h3>
      </div>
    </div>
    <button
      @click.prevent="openDialogCreateProject()"
    >
      Criar Projeto
    </button>
    <div class="divider" />
    <div
      v-show="selectedProject"
      class="project-container"
    >
      <section class="profile-project">
        <div class="box-profile">
          <img
            class="img-avatar"
            v-if="selectedProject && selectedProject.image"
            :src="`${selectedProject?.image}`"
            alt="Imagem do Laboratorio"
          >
          <div>
            <h1>{{ selectedProject?.titulo }}</h1>
            <p>{{ selectedProject?.descricao }}</p>
            <span @click="()=>{}">
              <QIcon
                name="groups"
                size="1.2rem"
              />
              {{ selectedProject?.membros?.length }}
            </span>
          </div>
          <button @click="()=>{}">
            Editar o laboratório
          </button>
        </div>
      </section>
      <section class="body-lab">
        <div
          style="display: flex; flex-direction: row; align-items: center;gap: 1rem;justify-content: space-between"
        >
          <button
            class="button-bar"
          > 
            <span v-if="memberLab !== null">
              {{ memberLab?.primeiro_nome + ' ' + memberLab?.segundo_nome }}
            </span>
            <span
              style="padding: 0.6rem;"
              v-else
            />
            <q-menu style="width: 33%;">
              <q-list style="width: 100%; background-color: #1F2026; border: 1px solid #333335">
                <q-item
                  class="q-item"
                  v-for="member in listMembrosLab"
                  :key="member.id"
                  clickable
                  @click="memberLab = member"
                >
                  <div class="menu-lab-projeto">
                    <QItemSection avatar>
                      <img
                        class="img-menu"
                        v-if="member.image"
                        :src="`${member?.image}`"
                        alt="Imagem de usuario"
                      >
                    </QItemSection>
                    <QItemSection>
                      <p class="nameUser">
                        {{ member?.primeiro_nome + ' ' + member?.segundo_nome }}
                      </p>
                    </QItemSection>
                  </div>
                </q-item>
              </q-list>
            </q-menu>
          </button>
          <button style="padding: 0.6rem;">
            Adicionar membro
          </button>
        </div>
        <q-separator
          class="divider"
        />
        <div>
          <h2>Membros</h2>
          <article
            class="info-empty"
            v-if="selectedProject?.membros?.length === 0"
          >
            <h3>Não a nenhum membro no laboratório!</h3>
          </article>
          <ul v-else>
            <MyCard
              v-for="member in selectedProject?.membros"
              :key="member.id ?? ''"
              :type="3"
              :summary="member.email"
              :id-user="member.id ?? ''"
              :title="`${member.primeiro_nome}` + ' ' + `${member.segundo_nome}`" 
              :date-create="member.data_inicial ?? ''"
            />
          </ul>
        </div>
        <q-separator
          class="divider"
        />
        <div>
          <h2>Laboratório</h2>
          <p>{{ selectedProject?.laboratorio.nome }}</p>
        </div>
        <q-separator
          class="divider"
        />
        <div>
          <h2>Descrição</h2>
          <p>{{ selectedProject?.descricao }}</p>
        </div>
        <q-separator
          class="divider"
          dark
        />
        <div>
          <h2>Data de criação</h2>
          <p>{{ selectedProject?.data_inicial }}</p>
        </div>
        <q-separator
          class="divider"
          dark
        />
        <div>
          <h2>Ultima atualização</h2>
          <p>{{ selectedProject?.data_up }}</p>
        </div>
        <footer>
          <button @click="deletedProject()">
            Deletar projeto
          </button>
        </footer>
      </section>
    </div>
  </div>
</template>
<style scoped lang="scss">
  input, select {
    color: $textColor;
    padding: 12px 16px;
    background-color: $dark;
    border-radius: 10px;
    border: $contour solid 1px;
  }
  .project-container{
    width: 100%;
    padding: 4rem;
    display: flex;
    gap: 2rem;
    align-items: flex-start;
  }

  .card-project{
    border: 1px solid $contour;
    cursor: pointer;
    box-shadow: 0px 4px 4px 0px $dark;
    width: 20rem;
    background-color: $dark;
  }
  
  .container-list{
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 3rem;
    align-items: flex-start;
  }

  .profile-project{
    flex:1;
  }

  .divider{
    background-color: $contour;
    height: 1px;
    width: 100%;
  }

  .list{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    overflow-x: auto
  }
  .list div {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .list-header{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
  
  .list-header span{
    font-size: 2rem;
    font-weight: 700;
  }

  .info{
    width: 100%;
    height: 38rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .info h3 {
    font-size: 1.2rem;
    font-weight: 700;
  }
  .span-article {
    max-width: 18rem;
    height: 6rem; 
    font-size: 0.9rem;
    font-weight: 500;
    font-style: italic;
    color: $textColor; 
    overflow: hidden; 
    text-overflow: ellipsis; 
    white-space: normal; 
  }
  .img-avatar {
    width: 16rem;
    height: 16rem;
    border-radius: 50%;
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
    font-size: 1.4rem;
    font-weight: 700;
    line-height: 1.4
  }

  .box-profile p {
    font-size: 0.9rem;
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
  .menu-lab-projeto {
    display: flex;
    align-items: center;
  }

  .button-bar{
    display: flex;
    align-items: flex-start;
    width: 70%;
    border: 1px solid $contour;
    padding: 0.6rem;
    color: $textColor;
  }

  .q-item {
    width: 100%;
    justify-content: space-between;
    display: flex; 
    align-items: center; 
    padding: 20px;
  }

  .img-menu{
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  article {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.2rem;
  }

  section{
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  article h1 {
    line-height: 2rem;
    max-width: 20rem;
    max-height: 4rem;
    font-size: 1.3rem;
    font-weight: 700;
    color: $textColor;
  }

  article p {
    font-size: 1rem;
    max-height: 4rem;
    max-width: 20rem;
    font-weight: 500;
    font-style: normal;
    color: $textDisabled;
  }
  button{
    cursor: pointer;
    padding: 0.8rem;
    background-color: $primary;
    border: 1px solid $contour;
    border-radius: 0.8rem;
    color: $secondary;
    font-size: 1rem;
    font-weight: 700;
  }
  footer {
    display: flex;
    align-items: center;
    justify-content: flex-end
  }

  button:hover {
    background-color: $dark
  }
</style>