<script setup lang="ts">
import type { UsuarioResponse,  LaboratorioResponse, PermissionOfLab, Usuario} from '@/types';
import {authStore } from '@/stores/auth';
import {userStore } from '@/stores/user';
import {permStore } from '@/stores/perm';
import { labStore } from '@/stores/laboratory';
import {useRouter} from 'vue-router';
import { QSpinnerDots, QCard, QCardSection, QSeparator} from 'quasar';
import {ref, onMounted} from 'vue';

// state
const router = useRouter();
const user = userStore();
const auth = authStore();
const perm = permStore();
const lab = labStore();
// variaveis
let selectMember= ref<Usuario>();
let permUser = ref<any>('');
let laboratory = ref<LaboratorioResponse | null>();
let usuario = ref<UsuarioResponse>();
let textSearch = ref<string>();
let isDeleted = ref<boolean>(false);
let loading = ref<boolean>(false);
let loadingButton = ref<boolean>(false);
let listMembrosLab = ref<Array<Usuario>>();
let listPermissao = ref<Array<PermissionOfLab>>();


// function
onMounted(async() => {
  loading.value = true;
  laboratory.value = user.getlaboratory;
  usuario.value = user.getUser;
  const listAux: LaboratorioResponse = await lab.getLaboratory(laboratory.value?.id, auth.getToken);
  listMembrosLab.value = listAux.membros ?? [];
  await isTag();
  loading.value = false;
});

async function isTag(){
  if(laboratory.value?.permissoes?.length !== 0){
    const response = laboratory.value?.permissoes?.find((perm: any)=> perm.id_user === usuario.value?.id);
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

async function changeMember(member: Usuario){
  selectMember.value = member;
  const listAux: Array<PermissionOfLab> = await perm.getPermissionsLab();
  console.log(listAux);
}

async function deletedMember(){
  loadingButton.value = true;
  const response = await lab.deleteMember(laboratory.value?.id ?? '', selectMember.value?.id ?? '', auth.getToken);
  if(response === true){
    router.push('/dashboard/membros');
    loading.value = false;
  }else{
    isDeleted.value = false;
    loading.value = false;
    alert('Error ao deletar membro!');
  }
}


</script>
<template>
  <div class="container-list">
    <div class="list-header">
      <span>Membros do Laboratório</span>
      <input
        type="text"
        placeholder="Buscar membro"
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
        v-show="listMembrosLab?.length !== 0"
      >
        <q-card
          v-for="member in listMembrosLab"
          :key="member.id"
          @click.prevent="changeMember(member)"
          dark
          bordered
          class="card-project"
        >
          <q-card-section>
            <article>
              <h1>{{ member.primeiro_nome + ' ' + member.segundo_nome }}</h1>
              <p>{{ member.matricula }}</p>
            </article>
          </q-card-section>
          <q-separator
            dark
          />
          <q-card-section>
            <span class="span-article">{{ member.email }}</span>
          </q-card-section>
        </q-card>
      </div>
      <div
        v-show="listMembrosLab?.length === 0"
        class="info"
      >
        <h3>Nenhum membro encontrado!</h3>
      </div>
    </div>
    <div class="divider" />
    <div
      v-show="selectMember"
      class="project-container"
    >
      <section class="profile-project">
        <div class="box-profile">
          <img
            class="img-avatar"
            v-if="selectMember && selectMember.image"
            :src="`${selectMember?.image}`"
            alt="Imagem do Laboratorio"
          >
          <div>
            <h1>{{ selectMember?.primeiro_nome + ' ' + selectMember?.segundo_nome }}</h1>
            <p>{{ selectMember?.email }}</p>
          </div>
        </div>
      </section>
      <section class="body-lab">
        <div
          style="display: flex; flex-direction: row; align-items: center;gap: 1rem;justify-content: space-between"
        >
          <select
            id="permitions"
            name="permitions"
            required
            v-model="perm"
          >
            <option
              v-for="permission in listPermissao"
              :key="permission.id"
              :value="permission"
            >
              {{ permission.title }}
            </option>
          </select>
          <button style="padding: 0.6rem;">
            Alterar permissão
          </button>
        </div>
        
        <q-separator
          class="divider"
          dark
        />
        <div>
          <h2>Data de nascimento</h2>
          <p>{{ selectMember?.data_nascimento }}</p>
        </div>
        <q-separator
          class="divider"
          dark
        />
        <div>
          <h2>Data de criação</h2>
          <p>{{ selectMember?.data_inicial }}</p>
        </div>
        <q-separator
          class="divider"
          dark
        />
        <div>
          <h2>Ultima atualização</h2>
          <p>{{ selectMember?.data_atualizacao }}</p>
        </div>
        <footer v-show="permUser === 'Coordenador'">
          <button @click="deletedMember()">
            <template v-if="!loadingButton">
              Deletar membro
            </template>
            <QSpinnerDots
              v-else
              size="20px"
              color="primary"
            />
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