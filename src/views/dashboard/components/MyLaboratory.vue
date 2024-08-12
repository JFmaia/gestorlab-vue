<script setup lang="ts">
import {userStore} from '@/stores/user';
import {ref, onMounted} from 'vue';
import { QCard, QIcon } from 'quasar';
import type { Laboratorio } from '@/types';

// State
const user = userStore();

//variables
let lab = ref<Laboratorio | null>();

//function
onMounted(() => {
  lab.value = user.getlaboratory;
  console.log(lab.value);
});
</script>
<template>
  <div
    class="info-container"
    v-if="lab === null"
  >
    <p>Você não faz parte de nenhum laboratório!</p>
  </div>
  <div
    class="lab-container"
    v-else
  >
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
        <button @click="()=>{}">
          Editar o laboratório
        </button>
      </div>
    </section>
    <section class="list-acess">
      <ul>
        <QCard />
      </ul>
    </section>
  </div>
</template>
<style scoped lang="scss">
  .lab-container{
    padding: 4rem;
    display: flex;
    gap: 2rem;
    align-items: flex-start;
  }

  .img-avatar {
    width: 16rem;
    height: 16rem;
    border-radius: 50%;
  }

  .info-container{
    min-height: 90vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    font-weight: 700;
    color: $textColor;
  }
  .q-input {
    width: 100%;
    color: yellow;
    background-color: $dark;
    border-color: $contour;
  }

  section{
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .profile-lab{
    flex:1;
  }

  .list-acess{
    flex:3;
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

  .box-profile button:hover {
    background-color: $dark
  }

  ul {
    background-color: $dark;
    width: 100%;
    height: 40rem;
    border-radius: 1rem;
    border: 1px solid $contour;
  }
</style>