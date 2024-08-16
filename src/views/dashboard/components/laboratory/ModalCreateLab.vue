<script setup lang="ts">
import {ref} from 'vue';
import type { Imagefile, CreateLaboratory } from '@/types';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { QCard, QCardActions, QCardSection, QBtn, QIcon, QSpinnerDots } from 'quasar';
import { labStore } from '@/stores/laboratory';
import { authStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const emit = defineEmits(['event']);

const router = useRouter(); 
const lab = labStore();
const auth = authStore();

let loading = ref<Boolean>(false);
let selectedImage = ref<Imagefile | null>(null);
let imageBase64 = ref<string | null>(null);
let fileInput = ref<HTMLInputElement | null>(null); 
let optionTemplate = ref<Boolean>(false);

//Validator
const { errors, validate, defineField} = useForm({
  validationSchema: yup.object({
    nome: yup.string().required('O nome é obrigatória!'),
    descricao: yup.string().required('Por favor descreva um pouco o seu laboratório!'),
    sobre: yup.string().required('Por favor fale um pouco sobre o seu laboratório!'),
    template: yup.number().required('Por favor escolha uma das opções de template!'),
    email: yup.string().email('Este e-mail não é valido!').required('Por favor digite seu e-mail!'),
    logradouro: yup.string().required('Digite o nome da sua rua!'),
    numero: yup.number().required('Digite o numero da sua casa!'),
    bairro: yup.string().required('Digite o nome do seu bairro!'),
    cep: yup.number().required('Digite seu CEP'),
    complemento: yup.string().required('Por favor forneça um complemento, será de grande ajuda!'),
    cidade: yup.string().required('Selecione a cidade que você reside!'),
    estado: yup.string().required('Selecione o estado que você reside!'),
    pais: yup.string().required('Selecione o pais que você reside!')
  }),
});

const [nome, nomeAttrs] = defineField('nome');
const [sobre, sobreAttrs] = defineField('sobre');
const [template, templateAttrs] = defineField('template');
const [descricao, descricaoAttrs] = defineField('descricao');
const [email, emailAttrs] = defineField('email');
const [logradouro, logradouroAttrs] = defineField('logradouro');
const [numero, numeroAttrs] = defineField('numero');
const [bairro, bairroAttrs] = defineField('bairro');
const [complemento, complementoAttrs] = defineField('complemento');
const [cidade, cidadeAttrs] = defineField('cidade');
const [estado, estadoAttrs] = defineField('estado');
const [cep, cepAttrs] = defineField('cep');
const [pais, paisAttrs] = defineField('pais');

function handleTemplate(value: boolean){
  optionTemplate.value = value;
  if(value){
    template.value = 1;
  }else {
    template.value = 2;
  }
}

async function createLab(){
  const isValid = await validate();
  if(isValid.valid){
    loading.value=true;
    const object: CreateLaboratory = {
      nome:nome.value,
      sobre:sobre.value,
      template: template.value,
      descricao:descricao.value,
      email:email.value,
      image:imageBase64.value, 
      endereco: {
        logradouro: logradouro.value,
        numero:numero.value,
        complemento:complemento.value,
        bairro:bairro.value,
        cidade:cidade.value,
        estado:estado.value,
        cep:cep.value,
        pais:pais.value
      }
    };
    const response = await lab.createLaboratorio(object, auth.getToken);
    if(response === true){
      router.push('/pageAcess');
      emit('event', false);
      loading.value=false;
    }else {
      loading.value=false;
      alert(response);
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
    <q-card-section>
      <h3>
        Crie seu laboratório
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
        <label>Laboratório:</label>
        <input
          v-model="nome"
          v-bind="nomeAttrs"
          type="text"
          placeholder="digite aqui a sígla do seu laboratório"
        >
        <pre>{{ errors.nome }}</pre>
      </div>
     
      <div class="content">
        <label>E-mail:</label>
        <input
          v-model="email"
          v-bind="emailAttrs"
          type="text"
          placeholder="Digite aqui o email do seu laboratório"
        >
        <pre>{{ errors.email }}</pre>
      </div>
      <div class="content">
        <label>Descrição:</label>
        <textarea
          v-model="descricao"
          v-bind="descricaoAttrs"
          type="text"
          placeholder="Descreva seu laboratório!"
        />
        <pre>{{ errors.descricao }}</pre>
      </div>
      <div class="content">
        <label>Sobre:</label>
        <textarea
          v-model="sobre"
          v-bind="sobreAttrs"
          type="text"
          placeholder="Fale sobre seu laboratório!"
        />
        <pre>{{ errors.sobre }}</pre>
      </div>
      <div class="row-inputs">
        <div
          class="content"
          style="flex: 2;"
        >
          <label>Logradouro/Rua:</label>
          <input
            v-model="logradouro"
            v-bind="logradouroAttrs"
            type="text"
            placeholder="Digite sua rua"
          >
          <pre>{{ errors.logradouro }}</pre>
        </div>
        <div
          class="content"
          style="flex: 1;"
        >
          <label>Numero:</label>
          <input
            v-model="numero"
            v-bind="numeroAttrs"
            type="number"
            placeholder="Digite o numero da sua casa"
          >
          <pre>{{ errors.numero }}</pre>
        </div>
      </div>
      <div class="row-inputs">
        <div
          class="content"
        >
          <label>Bairro:</label>
          <input
            v-model="bairro"
            v-bind="bairroAttrs"
            type="text"
            placeholder="Digite seu bairro"
          >
          <pre>{{ errors.bairro }}</pre>
        </div>
        <div
          class="content"
        >
          <label>Cidade:</label>
          <input
            v-model="cidade"
            v-bind="cidadeAttrs"
            type="text"
            placeholder="Digite sua cidade"
          >
          <pre>{{ errors.cidade }}</pre>
        </div>
      </div>
      <div class="content">
        <label>Complemento:</label>
        <textarea
          v-model="complemento"
          v-bind="complementoAttrs"
          type="text"
          placeholder="Digite um complemento..."
        />
        <pre>{{ errors.complemento }}</pre>
      </div>
      <div class="row-inputs">
        <div
          class="content"
        >
          <label>Estado:</label>
          <input
            v-model="estado"
            v-bind="estadoAttrs"
            type="text"
            placeholder="Digite seu estado"
          >
          <pre>{{ errors.estado }}</pre>
        </div>
        <div
          class="content"
        >
          <label>CEP:</label>
          <input
            v-model="cep"
            v-bind="cepAttrs"
            type="number"
            placeholder="Digite seu cep"
          >
          <pre>{{ errors.cep }}</pre>
        </div>
        <div
          class="content"
        >
          <label>País:</label>
          <input
            v-model="pais"
            v-bind="paisAttrs"
            type="text"
            placeholder="Digite seu país"
          >
          <pre>{{ errors.pais }}</pre>
        </div>
      </div>
    
      <div class="box-template">
        <button
          v-bind="templateAttrs"
          :class="optionTemplate === false ? 'button-template' : 'button-template-active'"
          @click="handleTemplate(!optionTemplate)"
        >
          <span>Template 1</span>
        </button>
        <button
          v-bind="templateAttrs"
          :class="optionTemplate === true ? 'button-template' : 'button-template-active'"
          @click="handleTemplate(!optionTemplate)"
        >
          <span>Template 2</span>
        </button>
      </div>
      <pre>{{ errors.template }}</pre>
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
        @click.prevent="createLab()"
      >
        <QSpinnerDots
          v-if="loading"
          color="dark"
          size="1rem"
        />
        <template v-else>
          Criar Laboratório
        </template>
      </q-btn>
    </q-card-actions>
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