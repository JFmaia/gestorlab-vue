<script setup lang="ts">
import type { LaboratorioResponse } from '@/types';
import {labStore} from '@/stores/laboratory';
import { QSpinnerDots } from 'quasar';
import {ref, onMounted} from 'vue';
import MyCard from '@/components/MyCard.vue';

// state
const lab = labStore();
// variaveis
let listLaboratory = ref<Array<LaboratorioResponse>>();
let textSearch = ref<string>();
let loading = ref<boolean>(false);

// function
onMounted(async() => {
  await getLaboratory();
});

async function getLaboratory(){
  loading.value = true;
  const response = await lab.getAllLaboratorys();
  if(response.length !== 0){
    loading.value = false;
    listLaboratory.value = response;
  } else {
    loading.value = false;
    listLaboratory.value = response.list;
    alert(response.message);
  }
} 

</script>
<template>
  <div class="container-list">
    <div class="list-header">
      <span>Laboratórios do sistema</span>
      <input
        type="text"
        placeholder="Buscar laboratório"
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
        v-show="listLaboratory?.length !== 0"
      >
        <MyCard
          v-for="labe in listLaboratory"
          :key="labe.id"
          :type="5"
          :id-lab="labe.id"
          :title="labe.nome"
          :date-create="labe.data_inicial"
          :summary="labe.coordenador.primeiro_nome + ' ' + labe.coordenador.segundo_nome"
        />
      </div>
      <div
        v-show="listLaboratory?.length === 0"
        class="info"
      >
        <h3>Nenhum laboratório encontrado!</h3>
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
    flex-direction: column;
    align-items: flex-start;
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
</style>