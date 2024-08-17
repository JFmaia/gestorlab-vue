<script setup lang="ts">
import {QIcon, QSpinnerDots} from 'quasar';
import {ref} from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import type {Imagefile, CreateLaboratory} from '@/types';
import {labStore} from '@/stores/laboratory';
import {authStore} from '@/stores/auth';
import {userStore} from '@/stores/user';
import {useRouter} from 'vue-router';

// state
const lab = labStore();
const auth = authStore();
//Router
const router = useRouter();
const user = userStore();
//Variables
let stepI = ref<Boolean>(true);
let stepII = ref<Boolean>(false);
let stepIII = ref<Boolean>(false);
let optionTemplate = ref<Boolean>(false);
let loading = ref<Boolean>(false);
let selectedImage = ref<Imagefile | null>(null);
let imageBase64 = ref<string | null>(null);
let fileInput = ref<HTMLInputElement | null>(null); // Adicionando o tipo aqui


//Validator
const { errors, defineField, validateField } = useForm({
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

//Functions

async function nextStep(option: number){
  switch (option) {
  case 1:
    stepI.value = true;
    stepII.value = false;
    stepIII.value = false;
    break;
  case 2:
    if((await validateField('nome')).valid){  
      stepI.value = false;
      stepII.value = true;
      stepIII.value = false;
    }
    break;
  case 3:
    if((await validateField('email')).valid && (await validateField('descricao')).valid && (await validateField('sobre')).valid){
      stepI.value = false;
      stepII.value = false;
      stepIII.value = true;
    }
    break;
  default:
    stepI.value = true;
    stepII.value = false;
    stepIII.value = false;
    break;
  }
}

function handleTemplate(value: boolean){
  optionTemplate.value = value;
  if(value){
    template.value = 1;
  }else {
    template.value = 2;
  }
}

async function createLab(){
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
    await user.setNewValueAndPrimaryAcess(false);
    loading.value=false;
    router.push('/dashboard');
  }else {
    loading.value=false;
    alert(response);
  }
}

function logoutLab(){
  auth.logout();
  user.clearUser;
  router.push('/pageAcess');
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
  <div class="createLab-container">
    <section> 
      <header>
        <QIcon
          class="icon"
          @click="logoutLab()"
          name="undo"
          size="2rem"
          color="primary"
        />
        <div class="box-steps">
          <div
            :class="stepI ? 'button-step-active':'button-step-deactive'"
          />
          <div
            :class="stepII ? 'button-step-active':'button-step-deactive'"
          />
          <div
            :class="stepIII ? 'button-step-active':'button-step-deactive'"
          />
        </div>
      </header>
      <div
        v-show="stepI"
        class="step"
      >
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
        <div class="footer">
          <div />
          <button @click="nextStep(2)">
            <span>Proximo</span>
            <QIcon
              name="chevron_right"
              size="1.2rem"
            />
          </button>
        </div>
      </div>
      <div
        v-show="stepII"
        class="step"
      >
        <div class="box-inputs">
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
        </div>
        
        <div class="footer">
          <button @click="nextStep(1)">
            <QIcon
              name="chevron_left"
              size="1.2rem"
            />
            <span>Voltar</span>
          </button>
          <button @click="nextStep(3)">
            <span>Proximo</span>
            <QIcon
              name="chevron_right"
              size="1.2rem"
            />
          </button>
        </div>
      </div>
      <div
        v-show="stepIII"
        class="step"
      >
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
        <div class="footer">
          <button @click="nextStep(2)">
            <QIcon
              name="chevron_left"
              size="1.2rem"
            />
            <span>Voltar</span>
          </button>
          <button
            :disabled="loading === true ? true : false"
            @click="createLab()"
          >
            <QSpinnerDots
              v-if="loading"
              color="dark"
              size="1.2rem"
            />
            <span v-else>Criar Laboratório</span>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
  section{
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 5rem;
    height: 100%;
    background-color: $dark;
    width: 100%;
    border: 1px solid $contour;
    border-radius: 1rem;
    padding: 2rem;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
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

  .row-inputs{
    width: 50%;
    justify-content: space-between;
    display: flex;
    gap: 0.6rem;
    align-items: center
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

  .createLab-container {
    padding: 5rem 10rem;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .icon {
    cursor: pointer;
  }

  .box-steps{
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.8rem;
  }

  .button-step-active{
    border: 1px solid $secondary;
    background-color: $secondary;
    height: 1.6rem;
    width: 1.6rem;
    border-radius: 50%;
  }
  .button-step-deactive{
    border: 1px solid $secondary;
    background-color: transparent;
    height: 1.6rem;
    width: 1.6rem;
    border-radius: 50%;
  }

  .step {
    justify-content: space-between;
    height: 100%; 
    display: flex;
    flex-direction: column;
    gap:4rem;
    align-items: center;
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

  .footer {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap:0.2rem;
  }
  .footer button {
    margin-bottom: 40px; 
    background-color: $secondary;
    border-radius: 1rem;
    padding: 0.8rem 1rem;
    cursor: pointer;
    border: none;
    color: $textColor;
    display: flex;
    justify-content: center;
    align-items: center;
    gap:0.2rem;
  }

  .box-template{
    width: 100%;
    gap: 2rem;
    height: 100%;
    justify-content: center;
    display: flex;
    align-items: center
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
</style>