<script setup lang="ts">
import MyCard from '@/components/MyCard.vue';
import {labStore} from '@/stores/laboratory';
import {userStore} from '@/stores/user';
import type { LaboratorioResponse, UsuarioResponse } from '@/types';
import { QIcon } from 'quasar';
import {onMounted, ref} from 'vue';
import {useRouter} from 'vue-router';

// rotas
const router = useRouter();
// State
const lab = labStore();
const user = userStore();
// Variables
let listLaboratorys = ref<any>([]);
let userData = ref<UsuarioResponse>();
let laboratory = ref<LaboratorioResponse | null>();

// Functions 
onMounted(async ()=>{
  initComponent();
});

async function initComponent(){
  userData.value = user.getUser;
  listLaboratorys.value = await lab.getLaboratorys(userData.value?.id);
  laboratory.value = user.getlaboratory;
}

function changePageSiteLab(){
  router.push({
    name: 'landingpage',
    params: {
      id: laboratory.value?.id
    }
  });
}
</script>

<template>
  <div class="timeline">
    <section v-show="userData?.permissao?.title !== 'Admin'">
      <button
        @click.prevent="changePageSiteLab()"
        :disabled="laboratory === null? true : false"
        class="button-acess-site-lab"
      >
        Site do laboratório
        <QIcon
          name="start"
          size="1.4rem"
        />
      </button>
    </section>
    <section>
      <div>
        <h2>Faça parte de um laboratório!!</h2>
      </div>
      <ul v-show="listLaboratorys.length !== 0">
        <MyCard
          v-for="item in listLaboratorys"
          :key="item"
          :type="0"
          :id-user="userData?.id"
          :id-lab="item.id"
          :title="item.nome"
          :sub-title="item.coordenador.primeiro_nome"
          :summary="item.sobre"
        />
      </ul>
      <div
        v-show="listLaboratorys.length === 0"
        class="info"
      >
        <h3>Nenhum laboratório disponivel!</h3>
      </div>
    </section>
    <div
      v-show="listLaboratorys.length !== 0"
      class="divider"
    />
  </div>
</template>

<style scoped lang="scss">
  .timeline {
    font-family: 'Inter';
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2rem;
    padding: 1.2rem 2.5rem;
  }

  .info{
    width: 100%;
    height: 38rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .divider{
    width: 100%;
    background-color: $contour;
    height: 1px;
  }
  
  .button-acess-site-lab{
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    width: 100%;
    padding: 0.8rem;
    background-color: $primary;
    border: 1px solid $contour;
    border-radius: 0.8rem;
    color: $secondary;
    font-size: 1rem;
    font-weight: 700;
  }
  .button-acess-site-lab:hover{
    background-color: $dark;
  }
  ul {
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    height: 38rem;
    gap: 1rem;
  }

  h2{
    font-size: 1.6rem;
    color:$textColor;
    font-weight: bolder;
  }
  
  h3{
    font-size: 1.2rem;
    color:$textColor;
  }

  section{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.4rem;
  }
</style>