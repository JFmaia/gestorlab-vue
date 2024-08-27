<script setup lang="ts">
import {ref} from 'vue';
import type { Imagefile} from '@/types';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { QCard, QCardActions, QCardSection, QBtn, QIcon, QSpinnerDots } from 'quasar';
import { projetoStore } from '@/stores/project';
import { authStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const emit = defineEmits(['event']);

const props = defineProps({
  idLab:{
    type: String,
    required: true,
  }
});

const router = useRouter(); 
const proj = projetoStore();
const auth = authStore();

let loading = ref<Boolean>(false);
let selectedImage = ref<Imagefile | null>(null);
let imageBase64 = ref<string | null>(null);
let fileInput = ref<HTMLInputElement | null>(null); 

//Validator
const { errors, validate, defineField} = useForm({
  validationSchema: yup.object({
    titulo: yup.string().required('O titulo é obrigatorio!'),
    descricao: yup.string().required('Por favor descreva um pouco o seu projeto!'),
  }),
});

const [titulo, tituloAttrs] = defineField('titulo');
const [descricao, descricaoAttrs] = defineField('descricao');


async function createProject(){
  const isValid = await validate();
  if(isValid.valid){
    loading.value=true;
    const object = {
      titulo: titulo.value,
      descricao: descricao.value,
      image: imageBase64.value,
      id: props.idLab
    };
    const response = await proj.createProjeto(object, auth.getToken);
    if(response === true){
      router.push('/dashboard/projetos');
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
  reader.onload = async (e) => {
    const image = new Image();
    image.src = e.target?.result as string;

    // Espera a imagem carregar
    await new Promise<void>((resolve) => {
      image.onload = () => resolve();
    });

    // Configura as dimensões desejadas
    const maxWidth = 800; // Largura máxima
    const maxHeight = 600; // Altura máxima
    const quality = 0.7; // Qualidade de compactação (0 a 1)

    // Cria um canvas para redimensionar e compactar a imagem
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    let width = image.width;
    let height = image.height;

    // Calcula as novas dimensões
    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }
    if (height > maxHeight) {
      width = (width * maxHeight) / height;
      height = maxHeight;
    }

    // Define o tamanho do canvas
    canvas.width = width;
    canvas.height = height;
    ctx?.drawImage(image, 0, 0, width, height);

    // Obtém a imagem compactada como base64
    const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
    imageBase64.value = compressedBase64;
  };

  reader.readAsDataURL(file);
}
</script>
<template>
  <q-card class="card-create-dialog">
    <q-card-section>
      <h3>
        Crie um projeto
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
        <label>Projeto:</label>
        <input
          v-model="titulo"
          v-bind="tituloAttrs"
          type="text"
          placeholder="digite aqui o nome do seu projeto"
        >
        <pre>{{ errors.titulo }}</pre>
      </div>
      <div class="content">
        <label>Descrição:</label>
        <textarea
          v-model="descricao"
          v-bind="descricaoAttrs"
          type="text"
          placeholder="Descreva seu projeto!"
        />
        <pre>{{ errors.descricao }}</pre>
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
        @click.prevent="createProject()"
      >
        <QSpinnerDots
          v-if="loading"
          color="dark"
          size="1rem"
        />
        <template v-else>
          Criar Projeto
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