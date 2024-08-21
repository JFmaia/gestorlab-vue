<script setup lang="ts">
import {ref, onMounted} from 'vue';
import { QCard, QSeparator, QCardSection, QSpinnerDots} from 'quasar';
import type {Permission} from '@/types';
import {userStore} from '@/stores/user';
import {authStore} from '@/stores/auth';
import {permStore} from '@/stores/perm';
import {labStore} from '@/stores/laboratory';
import { useRouter } from 'vue-router';

//state
const user = userStore();
const lab = labStore();
const auth = authStore();
const permi = permStore();
const router = useRouter();
// props
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  idPend:{
    type: String,
    required: false,
    default: ''
  },
  type:{
    type: Number,
    required: true,
  },
  idUser:{
    type: String,
    required: false,
    default: ''
  },
  idLab:{
    type: String,
    required: false,
    default: ''
  },
  idProjeto:{
    type: String,
    required: false,
    default: ''
  },
  title: {
    type: String,
    required: false,
    default: ''
  },
  subTitle: {
    type: String,
    required: false,
    default: ''
  },
  summary: {
    type: String,
    required: false,
    default: ''
  },
  nomeUser:{
    type: String,
    required: false,
    default: ''
  },
  nomeLab:{
    type: String,
    required: false,
    default: ''
  },
  nomeProject:{
    type: String,
    required: false,
    default: ''
  },
  dateCreate:{
    type: String,
    required: false,
    default: ''
  }
});

// variables 
let loading = ref<Boolean>(false);
let listPermissao = ref<Array<Permission>>();
let perm = ref<Permission>();

// function
onMounted(async()=> {
  await handleListPermissions();
});

async function handleListPermissions(){
  if(props.type === 1) {
    listPermissao.value = await permi.getPermissionsLab();
  } else {
    listPermissao.value = await permi.getPermissions();
  }
}

async function changeRegistration(){
  loading.value = true;
  const object = {
    id_user: props.idUser,
    id_lab: props.idLab,
    token: auth.getToken
  };
  const response = await user.setInviteForLab(object);
  if(response === true){
    loading.value = false;
    alert('Pedido enviado!');
  } else {
    loading.value = false;
    alert(response);
  }
}

async function addMember() {
  const object = {
    idUser: props.idUser,
    idLab: props.idLab,
    perm_id: perm.value?.id
  };
  const response = await lab.addMemberInLaboratorio(object, auth.getToken);
  if (response){
    const response2 = await lab.deleteAcessLab(props.idPend, auth.getToken);
    if(response2){
      await user.updateLaboratorio(props.idLab, auth.getToken);
      alert('Usuário adicionado com sucesso!');
    }else {
      alert(response2);
    }
  } else {
    alert(response);
  }
}

function handleProfile(id:string) {
  router.push({
    name: 'profile',
    params: {
      id: id
    }
  });
}

function handleLaboratory(id:string) {
  router.push({
    name: 'laboratory',
    params: {
      id: id
    }
  });
}

</script>
<template>
  <q-card
    v-show="type === 0"
    dark
    bordered
    class="my-card"
  >
    <q-card-section>
      <article>
        <h1>{{ title }}</h1>
        <p>{{ subTitle }}</p>
      </article>
    </q-card-section>
    <q-separator
      dark
    />
    <q-card-section>
      <article>
        <span class="span-article">{{ summary }}</span>
        <button @click.prevent="changeRegistration()">
          <QSpinnerDots
            size="20px"
            color="dark"
            v-if="loading"
          />
          <template v-else>
            Se candidatar
          </template>
        </button>
      </article>
    </q-card-section>
  </q-card>
  <div />
  <q-card
    v-show="type === 1"
    dark
    bordered
    class="my-card-lab"
  >
    <q-card-section>
      <article>
        {{ nomeUser }}
      </article>
    </q-card-section>

    <q-separator
      dark
    />

    <q-card-section class="card-section">
      <form @submit.prevent="addMember()">
        <div class="content-card">
          {{ dateCreate }}
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
        </div>
        <button type="submit">
          <QSpinnerDots
            size="20px"
            color="dark"
            v-if="loading"
          />
          <template v-else>
            Aceitar membro
          </template>
        </button>
      </form>
    </q-card-section>
  </q-card>
  <q-card
    v-show="type === 2"
    dark
    bordered
    class="my-card-lab"
  >
    <q-card-section>
      <article>
        <h1>{{ title }}</h1>
        <p>{{ dateCreate }}</p>
      </article>
    </q-card-section>
    <q-separator
      dark
    />
    <q-card-section>
      <article>
        <span class="span-article">{{ summary }}</span>
      </article>
    </q-card-section>
  </q-card>
  <q-card
    @click.prevent="handleProfile(idUser)"
    v-show="type ===3"
    dark
    bordered
    class="my-card-member"
  >
    <q-card-section>
      <article>
        <h1>{{ title }}</h1>
        <p>{{ dateCreate }}</p>
      </article>
    </q-card-section>
    <q-separator
      dark
    />
    <q-card-section>
      <span class="span-article">{{ summary }}</span>
    </q-card-section>
  </q-card>
  <q-card
    v-show="type === 4"
    dark
    bordered
    class="my-card-member"
  >
    <q-card-section>
      <article>
        <h1>{{ title }}</h1>
        <p>{{ subTitle }}</p>
      </article>
    </q-card-section>
    <q-separator
      dark
    />
    <q-card-section>
      <span class="span-article">{{ summary }}</span>
    </q-card-section>
    <button @click="()=>{}">
      <QSpinnerDots
        size="20px"
        color="dark"
        v-if="loading"
      />
      <template v-else>
        Aceitar o pedido
      </template>
    </button>
  </q-card>
  <q-card
    @click.prevent="handleLaboratory(idLab)"
    v-show="type ===5"
    dark
    bordered
    class="my-card-member"
  >
    <q-card-section>
      <article>
        <h1>{{ title }}</h1>
        <p>{{ dateCreate }}</p>
      </article>
    </q-card-section>
    <q-separator
      dark
    />
    <q-card-section>
      <span class="span-article">{{ summary }}</span>
    </q-card-section>
  </q-card>
</template>
<style scoped lang="scss">
  .my-card {
    border: 1px solid $contour;
    cursor: pointer;
    box-shadow: 0px 4px 4px 0px $dark;
    width: 20rem;
    height: 22rem;
    background-color: $dark;
  }

  .my-card-lab {
    border: 1px solid $contour;
    cursor: pointer;
    box-shadow: 0px 4px 4px 0px $dark;
    width: 20rem;
    height: 14rem;
    background-color: $dark;
  }

  .my-card-member {
    border: 1px solid $contour;
    cursor: pointer;
    box-shadow: 0px 4px 4px 0px $dark;
    width: 20rem;
    background-color: $dark;
  }

  .content-card {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .card-section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
  
  form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }

  article {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.2rem;
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

  button {
    width: 100%;
    border: none;
    cursor: pointer;
    border-radius: 10px;
    padding: 0.7rem;
    font-size: 0.9rem;
    font-weight: 600;
    background-color: $secondary;
    color: $textColor;
  }

  select{
    flex: 1;
    color: $textColor;
    padding: 12px 16px;
    padding-left: 8px;
    background-color: $dark;
    border-radius: 10px;
    border: $contour solid 1px;
  }
</style>