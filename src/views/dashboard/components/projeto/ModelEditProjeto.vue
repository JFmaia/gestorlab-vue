<script setup lang="ts">
import {ref, onMounted} from 'vue';
import type { Imagefile, ProjetoResponse } from '@/types';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { QCard, QCardActions, QCardSection, QBtn, QIcon, QSpinnerDots } from 'quasar';
import { authStore } from '@/stores/auth';
import { projetoStore } from '@/stores/project';


const emit = defineEmits(['event']);

const props = defineProps({
  tipo:{
    type: Number,
    required: true
  },
  proj:{
    type: Object as () => ProjetoResponse,
    required: false,
    default: null
  }
});
 
const project = projetoStore();
const auth = authStore();

let loading = ref<Boolean>(false);
let loadingButton = ref<Boolean>(false);
let selectedImage = ref<Imagefile | null>(null);
let imageBase64 = ref<string | null>(null);
let fileInput = ref<HTMLInputElement | null>(null); 

//Validator
const { errors, validate, defineField} = useForm({
  validationSchema: yup.object({
    titulo: yup.string().required('Por favor digite seu primeiro nome!'),
    descricao: yup.string().required('Por favor digite seu segundo nome!')
  }),
});

const [titulo, tituloAttrs] = defineField('titulo');
const [descricao, descricaoAttrs] = defineField('descricao');


onMounted(async () => {
  await initDialog();
});

async function initDialog(){
  loading.value = true;
  if(props.tipo === 2){
    titulo.value = props.proj.titulo;
    descricao.value = props.proj.descricao; 
  } else{
    return;
  }
  loading.value = false;
}

async function editProject(){
  const isValid = await validate();
  if(isValid.valid){
    loadingButton.value=true;
    const object: any = {
      titulo:titulo.value,
      image:imageBase64.value, 
      descricao: descricao.value
    };
    const response = await project.editProjeto(object, props.proj.id, auth.getToken);
    if(response === true){
      emit('event', false);
      loadingButton.value=false;
    }else {
      loadingButton.value=false;
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
          Edite os dados
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
          <label>Título:</label>
          <input
            v-model="titulo"
            v-bind="tituloAttrs"
            type="text"
            placeholder="Digite o titulo do seu projeto"
          >
          <pre>{{ errors.titulo }}</pre>
        </div>
        <div class="content">
          <label>Descrição:</label>
          <textarea
            v-model="descricao"
            v-bind="descricaoAttrs"
            minlength="3"
            type="text"
            placeholder="Digite aqui o seu segundo nome"
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
          @click.prevent="editProject()"
        >
          <QSpinnerDots
            v-if="loadingButton"
            color="primary"
            size="1rem"
          />
          <template v-else>
            Editar Projeto
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