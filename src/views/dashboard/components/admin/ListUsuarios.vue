<script setup lang="ts">
import type { UsuarioResponse } from '@/types';
import {userStore} from '@/stores/user';
import { QSpinnerDots } from 'quasar';
import {ref, onMounted} from 'vue';
import MyCard from '@/components/MyCard.vue';

// state
const user = userStore();
// variaveis
let listUsers = ref<Array<UsuarioResponse>>();
let textSearch = ref<string>();
let loading = ref<boolean>(false);

// function
onMounted(async() => {
  await getUsuarios();
});

async function getUsuarios(){
  loading.value = true;
  const response = await user.getAllUsuarios();
  if(response.length !== 0){
    loading.value = false;
    listUsers.value = response;
  } else {
    loading.value = false;
    listUsers.value = response.list;
    alert(response.message);
  }
} 

</script>
<template>
  <div class="container-list">
    <div class="list-header">
      <span>Usuarios do sistema</span>
      <input
        type="text"
        placeholder="Buscar usuários..."
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
      <MyCard
        v-show="listUsers?.length !== 0"
        v-for="usuario in listUsers"
        :key="usuario.id"
        :type="3"
        :id-user="usuario.id"
        :title="usuario.primeiro_nome + ' ' + usuario.segundo_nome"
        :date-create="usuario.data_inicial"
        :summary="usuario.permissao?.title"
      />
      <div
        v-show="listUsers?.length === 0"
        class="info"
      >
        <h3>Nenhum laboratório disponivel!</h3>
      </div>
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
  
  .container-list{
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 3rem;
    align-items: flex-start;
  }

  .list{
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
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
  }

  .info{
    width: 100%;
    height: 38rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>