<script setup lang="ts">
import {userStore} from '@/stores/user';
import {authStore} from '@/stores/auth';
import { useRouter, useRoute } from 'vue-router';
import {ref, onMounted} from 'vue';
import { QSeparator, QSpinnerDots } from 'quasar';
import type { UsuarioResponse } from '@/types';
import MyCard from '@/components/MyCard.vue';

// State
const router = useRouter();
const route = useRoute();
const user = userStore();
const auth = authStore();
//variables
let use = ref<UsuarioResponse>();
let isDeleted = ref<boolean>(false);
let loading = ref<boolean>(false);
const id= route.params.id as string;

defineEmits(['event']);

//function
onMounted(async () => {
  loading.value = true;
  use.value = await user.getUsuario(id, auth.getToken);
  loading.value = false;
});

async function deletedUserConfirm(){
  const response = await user.deleteUser(use.value?.id ?? '', auth.getToken);
  if(response === true){
    router.push('/pageAcess');
  } else {
    isDeleted.value = false;
    alert(response);
  }
}
</script>
<template>
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
    class="lab-container"
  >
    <section class="profile-lab">
      <div class="box-profile">
        <img
          class="img-avatar"
          v-if="use && use.image"
          :src="`${use?.image}`"
          alt="Imagem do Laboratorio"
        >
        <div>
          <h1>{{ use?.primeiro_nome + ' ' + use?.segundo_nome }}</h1>
          <p>{{ use?.permissao?.title }}</p>
        </div>
        <button @click="()=>{}">
          Editar o usuário
        </button>
      </div>
    </section>
    <section class="body-lab">
      <div v-show="user.getUser.id === use?.id">
        <h2>Convites</h2>
        <article
          class="info-empty"
          v-if="use?.pedidos?.length === 0"
        >
          <h3>Não a nenhum pedido de laboratório!</h3>
        </article>
        <ul v-else>
          <MyCard
            v-for="pedido in use?.pedidos"
            :key="pedido.id ?? ''"
            :type="4"
            :id-pend="pedido.id ?? ''"
            :id-user="pedido.id_user ?? ''"
            :id-lab="pedido.id_lab ?? ''"
            :title="pedido.laboratorio?.nome"
            :sub-title="pedido.laboratorio?.descricao"
            :summary="pedido.data_create ?? ''"
          />
        </ul>
      </div>
      <div>
        <h2>Laboratórios</h2>
        <article
          class="info-empty"
          v-if="use?.laboratorios?.length === 0"
        >
          <h3>Não a nenhum laboratório!</h3>
        </article>
        <ul v-else>
          <MyCard
            v-for="item in use?.laboratorios"
            :key="item.id"
            :type="3"
            :id-user="use?.id"
            :id-lab="item.id"
            :title="item.nome"
            :date-create="item.coordenador.primeiro_nome"
            :summary="item.sobre"
          />
        </ul>
      </div>
      <q-separator
        class="divider"
        dark
      />
      <div>
        <h2>Data de nascimento</h2>
        <p>{{ use?.data_nascimento }}</p>
      </div>
      <q-separator
        class="divider"
        dark
      />
      <div>
        <h2>Email</h2>
        <p>{{ use?.email }}</p>
      </div>
      <q-separator
        class="divider"
        dark
      />
      <div>
        <h2>Genêro</h2>
        <p>{{ use?.genero.title }}</p>
      </div>
      <q-separator
        class="divider"
        dark
      />
      <div>
        <h2>Matricula</h2>
        <p>{{ use?.matricula }}</p>
      </div>
      <q-separator
        class="divider"
        dark
      />
      <div>
        <h2>Celular</h2>
        <p>{{ use?.tel }}</p>
      </div>
      <q-separator
        class="divider"
        dark
      />
      <div>
        <h2>Data de criação</h2>
        <p>{{ use?.data_inicial }}</p>
      </div>
      <q-separator
        class="divider"
        dark
      />
      <div>
        <h2>Ultima atualização</h2>
        <p>{{ use?.data_atualizacao }}</p>
      </div>
      <footer v-show="user.getUser.id === use?.id || user.getUser.permissao?.title === 'Admin'">
        <button @click="deletedUserConfirm()">
          Deletar usuário
        </button>
      </footer>
    </section>
    <!-- <q-dialog v-model="isDeleted">
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
            @click.prevent="deletedUserConfirm()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog> -->
  </div>
</template>
<style scoped lang="scss">
 .info{
    width: 100%;
    height: 38rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
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
    line-height: 3rem;
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