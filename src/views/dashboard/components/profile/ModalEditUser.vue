<script setup lang="ts">
import API from '@/services/index';
import {ref, onMounted} from 'vue';
import type { Genero, Imagefile, UsuarioResponse, Permission } from '@/types';
import { useForm } from 'vee-validate';
import {removerCaracter} from '@/utils';
import * as yup from 'yup';
import { QCard, QCardActions, QCardSection, QBtn, QIcon, QSpinnerDots } from 'quasar';
import { authStore } from '@/stores/auth';
import { userStore } from '@/stores/user';
import { permStore } from '@/stores/perm';
import moment from 'moment';

const emit = defineEmits(['event']);

const props = defineProps({
  tipo:{
    type: Number,
    required: true
  },
  usuario:{
    type: Object as () => UsuarioResponse,
    required: false,
    default: null
  }
});
 
const user = userStore();
const auth = authStore();
const perm = permStore();

let loading = ref<Boolean>(false);
let loadingButton = ref<Boolean>(false);
let listGeneros = ref<Array<Genero>>();
let listPerms = ref<Array<Permission>>();
let selectedImage = ref<Imagefile | null>(null);
let imageBase64 = ref<string | null>(null);
let fileInput = ref<HTMLInputElement | null>(null); 

//Validator
const { errors, validate, defineField} = useForm({
  validationSchema: yup.object({
    primeiroNome: yup.string().required('Por favor digite seu primeiro nome!'),
    segundoNome: yup.string().required('Por favor digite seu segundo nome!'),
    matricula: yup.string().required('Por favor digite sua matricula!'),
    email: yup.string().email('Este e-mail não é valido!').required('Por favor digite seu e-mail!'),
    tel: yup.string().required('Por favor digite seu telefone!'),
    dataNascimento: yup.string().required('Por favor digite sua data de nascimento!'),
    idPerm: yup.string().required('Por favor escolha uma permissão!'),
    idGenero: yup.string().required('Por favor escolha um genêro!')
  }),
});

const [primeiroNome, primeiroNomeAttrs] = defineField('primeiroNome');
const [segundoNome, segundoNomeAttrs] = defineField('segundoNome');
const [matricula, matriculaAttrs] = defineField('matricula');
const [email, emailAttrs] = defineField('email');
const [tel, telAttrs] = defineField('tel');
const [dataNascimento, dataNascimentoAttrs] = defineField('dataNascimento');
const [idPerm, idPermAttrs] = defineField('idPerm');
const [idGenero, idGeneroAttrs] = defineField('idGenero');


onMounted(async () => {
  await initDialog();
});

async function initDialog(){
  loading.value = true;
  await getGeneros();
  await getPermissoes();
  if(props.tipo === 2){
    primeiroNome.value = props.usuario.primeiro_nome;
    segundoNome.value = props.usuario.segundo_nome; 
    matricula.value = props.usuario.matricula;
    tel.value = props.usuario.tel;
    dataNascimento.value = moment(props.usuario.data_nascimento).format('YYYY-MM-DD');
    idPerm.value = props.usuario.id_perm;
    idGenero.value = props.usuario.id_genero;
    email.value = props.usuario.email;
  } else{
    return;
  }
  loading.value = false;
}

async function getGeneros(){
  try{
    const response: any = await API.get('/generos');
    listGeneros.value = response.data;
    idGenero.value = response.data[0];
  }catch(e){
    return;
  }
}

async function getPermissoes(){
  listPerms.value = await perm.getPermissions();
}

async function editLaboratory(){
  const isValid = await validate();
  if(isValid.valid){
    loadingButton.value=true;
    if(user.getUser.permissao?.title === 'Admin'){
      const object: any = {
        email:email.value,
        image:imageBase64.value, 
        primeiro_nome: primeiroNome.value,
        segundo_nome: segundoNome.value,
        matricula: removerCaracter(matricula.value),
        tel: removerCaracter(tel.value),
        id_perm: idPerm.value,
        id_genero: idGenero.value,
        data_nascimento: dataNascimento.value,
      };
      const response = await user.editUsuario(object, props.usuario.id, auth.getToken);
      if(response === true){
        emit('event', false);
        loadingButton.value=false;
      }else {
        loadingButton.value=false;
        alert(response);
      }
    }else {
      ('entrei');
      const object: any = {
        email:email.value,
        image:imageBase64.value, 
        primeiro_nome: primeiroNome.value,
        segundo_nome: segundoNome.value,
        matricula: typeof matricula.value === 'number' ? matricula.value : removerCaracter(matricula.value),
        tel: typeof tel.value === 'number' ? tel.value : removerCaracter(tel.value),
        id_genero: idGenero.value,
        data_nascimento: dataNascimento.value,
      };
      const response = await user.editUsuario(object, props.usuario.id, auth.getToken);
      if(response === true){
        emit('event', false);
        loading.value=false;
      }else {
        loading.value=false;
        alert(response);
      }
    }
    
  }
}

function onImageChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  selectedImage.value = file;

  const reader = new FileReader();
  reader.onload = (event) => {
    imageBase64.value = event.target?.result as string;
  };
  reader.readAsDataURL(file);
}
</script>
<template>
  <q-card class="card-create-dialog">
    <div
      v-if="loading"
      class="info"
    >
      <QSpinnerDots
        size="20px"
        color="primary"
      />
    </div>
    <template v-else>
      <q-card-section>
        <h3>
          Edite seu dados
        </h3>
      </q-card-section>
      <q-card-section class="section-body">
        <button
          @click="fileInput?.click()"
          class="button-img"
        >
          <QIcon
            v-if="imageBase64 === null"
            name="add_a_photo"
            size="4rem"
            color="white"
            alt="Imagem para escolher"
          />
          <img
            v-else
            :src="imageBase64"
            alt="Imagem que foi escolhida"
          >
          <input 
            ref="fileInput" 
            type="file" 
            style="display: none;" 
            @change="onImageChange" 
          >
        </button>
        <div class="content">
          <label>Primeiro nome:</label>
          <input
            v-model="primeiroNome"
            v-bind="primeiroNomeAttrs"
            type="text"
            placeholder="Digite seu primeiro nome"
          >
          <pre>{{ errors.primeiroNome }}</pre>
        </div>
        <div class="content">
          <label>Segundo nome:</label>
          <input
            v-model="segundoNome"
            v-bind="segundoNomeAttrs"
            type="text"
            placeholder="Digite aqui o seu segundo nome"
          >
          <pre>{{ errors.segundoNome }}</pre>
        </div>
        <div class="content">
          <label>E-mail:</label>
          <input
            v-model="email"
            v-bind="emailAttrs"
            type="text"
            placeholder="Digite aqui o seu email"
          >
          <pre>{{ errors.email }}</pre>
        </div>
        <div class="content">
          <label>Matrícula:</label>
          <input
            v-model="matricula"
            v-bind="matriculaAttrs"
            v-mask="'###########'"
            type="text"
            placeholder="Digite sua matrícula"
          >
          <pre>{{ errors.matricula }}</pre>
        </div>
        <div class="content">
          <label>Tel:</label>
          <input
            v-model="tel"
            v-bind="telAttrs"
            v-mask="['(##) ####-####', '(##) #####-####']"
            type="text"
            placeholder="Digite seu telefone"
          >
          <pre>{{ errors.tel }}</pre>
        </div>
        <div class="row-inputs">
          <div
            class="content"
            style="flex: 1;"
          >
            <label>Gênero:</label>
            <select
              id="genero"
              name="genero"
              v-bind="idGeneroAttrs"
              v-model="idGenero"
            >
              <option
                v-for="(item, index) in listGeneros"
                :key="index"
                :value="item.id"
              >
                {{ item.title }}
              </option>
            </select>
            <pre>{{ errors.idGenero }}</pre>
          </div>
          <div
            v-show="user.getUser.permissao?.title === 'Admin'"
            class="content"
            style="flex: 1;"
          >
            <label>Permissão:</label>
            <select
              id="perm"
              name="perm"
              v-bind="idPermAttrs"
              v-model="idPerm"
            >
              <option
                v-for="(item, index) in listPerms"
                :key="index"
                :value="item.id"
              >
                {{ item.title }}
              </option>
            </select>
            <pre>{{ errors.idPerm }}</pre>
          </div>
        </div>
  
        <div
          class="content"
        >
          <label>Data de nascimento:</label>
          <input
            v-model="dataNascimento"
            v-bind="dataNascimentoAttrs"
            type="date"
            placeholder="Digite sua data de nascimento"
          >
          <pre>{{ errors.dataNascimento }}</pre>
        </div>
      </q-card-section>
      <q-card-actions
        align="right"
        class="text-primary"
      >
        <q-btn
          flat
          label="Cancelar"
          @click.prevent="emit('event', false)"
        />
        <q-btn
          flat
          @click.prevent="editLaboratory()"
        >
          <QSpinnerDots
            v-if="loadingButton"
            color="primary"
            size="1rem"
          />
          <template v-else>
            Editar Usuário
          </template>
        </q-btn>
      </q-card-actions>
    </template>
  </q-card>
</template>
<style scoped lang="scss">
  h3{
    font-family: 'Inter' sans-serif;
    font-size: 2rem;
  }

  img{
    background-size: cover;
    border-radius: 50%;
    border: 1px solid $contour;
    width: 20rem;
    height: 20rem;
  }

  pre{
    font-size: 0.6rem;
    color: $error;
  }

  input, select, textarea {
    width: 100%;
    color: $textColor;
    padding: 12px 16px;
    background-color: $dark;
    border-radius: 10px;
    border: $contour solid 1px;
  }

  span{
    font-size: 1.2rem;
    font-weight: 700;
  }

  .info{
    width:100%;
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
    height: 1000px;
  }
  
 .card-create-dialog{
    font-size: $textColor;
    min-width: 70%;
    background-color: $dark;
  }
  .section-body{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }
  .button-img{
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: $primary;
    cursor: pointer;
    border-radius: 50%;
    border: 1px solid $contour;
    width: 20rem;
    height: 20rem;
  }

  .row-inputs{
    width: 50%;
    justify-content: space-between;
    display: flex;
    gap: 0.6rem;
    align-items: center
  }
  .box-inputs{
    width: 100%;
    display: flex;
    flex-direction: column;
    gap:0.8rem;
    align-items: center;
  }

  .content{
    justify-content: center;
    align-items: center;
    display: flex;
    width: 50%;
    flex-direction: column;
    gap:0.2rem;
    align-items: flex-start;
    color: $textColor;
  }

  .box-template{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
  }

  .button-template{
    border: 1px solid $secondary;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    cursor: pointer;
    background-color: $primary;
    color: $secondary;
    border-radius: 1rem;
    padding: 2rem;
    height: 180px;
    width: 240px;
  }

  .button-template-active{
    border: 1px solid $secondary;
    display: flex;
    flex-direction: column;
    justify-content: center;
    cursor: pointer;
    background-color: $secondary;
    color: $dark;
    align-items: center;
    border-radius: 1rem;
    padding: 2rem;
    height: 180px;
    width: 240px;
  }
  @media (max-width: 1260px){
    .content {
      width: 100%;
    }
    .row-inputs{
      width: 100%;
    }
    .box-template{
      width: 100%;
    }
  }
</style>