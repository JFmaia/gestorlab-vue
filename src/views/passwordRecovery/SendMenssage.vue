<script setup lang="ts">
import {userStore} from '@/stores/user';
import {ref} from 'vue';
import { QSpinnerDots } from 'quasar';
import * as yup from 'yup';
import { useForm } from 'vee-validate';

//state
const user = userStore();

//Validator
const { errors, validate, defineField } = useForm({
  validationSchema: yup.object({
    email: yup.string().email('Este e-mail não é valido!').required('O e-mail é obrigatório!'),
  }),
});

const [email, emailAttrs] = defineField('email');

//Variables
let loading = ref<boolean>(false);

// function
async function sendEmail(){
  const isValid = await validate();
  if(isValid.valid){
    loading.value = true;
    const response = await user.sendEmailPasswordRecovery(email.value);
    if (response === true){
      loading.value = false;
      alert('E-mail enviado com sucesso, por favor verifique sua caixa de entrada!');
    } else {
      loading.value = false;
      alert('Erro o enviar e-mail, tem novamente em alguns minutos!');
    }
  }
}
</script>
<template>
  <div class="container-send">
    <form @submit.prevent="sendEmail()">
      <p>Escolha um e-mail para enviamos o link de refinição de senha.</p>
      <div class="content">
        <input
          placeholder="Digite seu email de usuário!"
          v-model="email"
          v-bind="emailAttrs"
          type="text"
        >
        <pre>{{ errors.email }}</pre>
      </div>
     
      <button type="submit">
        <QSpinnerDots
          size="20px"
          color="dark"
          v-if="loading"
        />
        <template v-else>
          Enviar
        </template>
      </button>
    </form>
  </div>
</template>
<style scoped lang="scss">
  .container-send{
    padding: 20rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  form{
    padding: 4rem;
    background-color: $dark;
    border: 1px solid $contour;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 4rem;
  }

  p{
    font-size: 1.4rem;
    font-weight: 600;
    color: $textColor;
  }

  input{
    width: 100%;
    color: $textColor;
    padding: 12px 16px;
    padding-left: 8px;
    background-color: $dark;
    border-radius: 10px;
    border: $contour solid 1px;
  }

  button{
    width: 100%;
    cursor: pointer;
    border-radius: 0.8rem;
    border: none;
    color: $textColor;
    background-color: $secondary;
    padding: 0.6rem 1rem;
  }
  .content{
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    align-items: flex-start;
  }

  pre {
    color: $error;
    font-size: 0.8rem;
  }

  @media (max-width: 660px){
    .container-send{
      padding: 2rem;
    }
    form {
      font-size: 0.7rem;
      padding: 1rem;
      gap: 1rem;
    }

    p{
      font-size: 1rem;
    }

    pre{
      font-size: 0.6rem;
    }
  }
</style>