<script setup lang="ts">
import {userStore} from '@/stores/user';
import {ref} from 'vue';
import { QSpinnerDots, QIcon } from 'quasar';
import { useRouter, useRoute } from 'vue-router';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
//router
const route = useRoute();
const router = useRouter();

//state
const user = userStore();

//Validator
const { errors, validate, defineField } = useForm({
  validationSchema: yup.object({
    password: yup.string().min(4, 'A senha deve ter no mínimo 4 caracteres').required('A senha é obrigatória'),
    confPassword: yup.string()
      .required('A confirmação da senha é obrigatória')
      .min(4, 'A confirmação da senha deve ter no mínimo 4 caracteres')
      .oneOf([yup.ref('password')], 'As senhas devem ser iguais')
  }),
});

const [password, paswordAttrs] = defineField('password');
const [confPassword, confPasswordAttrs] = defineField('confPassword');

//Variables
const id = route.params.id;
let confirmVisible = ref<boolean>(true);
let visible = ref<boolean>(true);
let loading = ref<boolean>(false);

// function
async function setRecoveryPassword(){
  const isValid = await validate();
  if(isValid.valid){
    loading.value = true;
    const object = {
      id_user: id,
      senha: password.value
    };
    const response = await user.recoveryPassword(object);
    if (response === true){
      loading.value = false;
      router.push('/pageAcess');
      alert('Senha alterada com sucesso!');
    } else {
      loading.value = false;
      alert('Erro ao alterar senha, tem novamente em alguns minutos!');
    }
  }
}
</script>
<template>
  <div class="container-recovery">
    <form @submit.prevent="setRecoveryPassword()">
      <p>Digite uma nova senha para sua conta.</p>

      <div class="box-password">
        <section class="content">
          <label>Senha:</label>
          <div class="password-input">
            <input
              v-model="password"
              v-bind="paswordAttrs"
              class="password"
              :type="visible ? 'password' : 'text'"
              placeholder="senha"
              id="senha"
              name="senha"
            >
            <span
              class="eye"
              @click="visible=!visible"
            >
              <QIcon
                name="visibility_off"
                v-if="visible"
                size="1rem"
              />
              <QIcon
                v-else
                name="visibility"
                size="1rem"
              />
            </span>
          </div>
          <pre class="error">{{ errors.password }}</pre>
        </section>
        <section class="content">
          <label>Confirme a senha:</label>
          <div class="password-input">
            <input
              v-model="confPassword"
              v-bind="confPasswordAttrs"
              class="password"
              :type="confirmVisible? 'password' : 'text'"
              placeholder="confirme sua senha"
              id="confirm-senha"
              name="confirm-senha"
            >
            <span
              class="eye"
              @click="confirmVisible=!confirmVisible"
            >
              <QIcon
                name="visibility_off"
                v-if="confirmVisible"
                size="1rem"
              />
              <QIcon
                v-else
                name="visibility"
                size="1rem"
              />
            </span>
          </div>
          <pre>{{ errors.confPassword }}</pre>
        </section>
      </div>
     
      <button type="submit">
        <QSpinnerDots
          size="20px"
          color="dark"
          v-if="loading"
        />
        <template v-else>
          Alterar
        </template>
      </button>
    </form>
  </div>
</template>
<style scoped lang="scss">
  .container-recovery{
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
    cursor: pointer;
    width: 100%;
    border-radius: 0.8rem;
    border: none;
    color: $textColor;
    background-color: $secondary;
    padding: 12px 16px;
  }

  .box-password{
    padding: 0px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
    align-items: center;
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
    .container-recovery{
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