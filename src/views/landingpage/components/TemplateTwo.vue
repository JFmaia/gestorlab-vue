<script setup lang="ts">
import type {LaboratorioResponse, Usuario, PermissionLab} from '@/types';
import { QCard, QCardSection, QSeparator, QIcon } from 'quasar';
import { ref } from 'vue';

//Variables
const isBoxVisible = ref(false);

// props
const props = defineProps({
  lab:{
    type: Object as () => LaboratorioResponse,
    require: true,
    default: null
  }
});

// Functions
function getPermissaoMember(member:Usuario){
  const perm = props.lab.permissoes?.find((item:PermissionLab) => item.id_user === member.id);
  return perm?.permissao.title;
}

function toggleBox() {
  isBoxVisible.value = !isBoxVisible.value;
}
</script>
<template>
  <header>
    <div class="container header">
      <h2>
        {{ lab?.nome }}
      </h2>
      <ul class="menu-header">
        <li>
          <a href="#sectionTwo4">
            Contatos
          </a>
        </li>
        <li>
          <a href="#sectionTwo1">
            Sobre
          </a>
        </li>
        <li v-show="lab?.membros !== null && lab?.membros?.length !== 0">
          <a href="#sectionTwo2">
            Membros
          </a>
        </li>
        <li v-show="lab?.projetos?.length !== 0 && lab?.projetos !== null">
          <a href="#sectionTwo3">
            Projetos
          </a>
        </li>
      </ul>
    </div>
  </header>
  <div class="container-box">
    <!-- Ícone redondo fixo -->
    <transition name="icon-slide">
      <div
        v-if="!isBoxVisible"
        class="icon"
        @click="toggleBox"
      >
        <!-- Ícone (pode ser um ícone do Quasar ou outro de sua escolha) -->
        <q-icon
          name="newspaper"
          size="2.4rem"
        />
      </div>
    </transition>

    <!-- Caixa deslizante -->
    <transition name="box-slide">
      <div
        v-if="isBoxVisible"
        class="box"
      >
        <div
          class="close-icon"
          @click="toggleBox"
        >
          <q-icon
            name="cancel"
            size="1.8rem"
          />
        </div>
        <div class="slid-info">
          <p>Nenhuma notícia encontrada!</p>
        </div>
      </div>
    </transition>
  </div>
  <main>
    <section
      id="heroTwo"
      class="container-template"
    >
      <div class="container template">
        <p>
          Conheça o laboratório <strong>{{ lab?.nome }}</strong> e todas suas pesquisas no meio acadêmico e suas realizações na sociedade!
        </p>
        <img
          class="img-lab"
          :src="lab?.image ?? '@/assets/imgs/studing.svg'"
          alt="Imagem do Laboratório"
        >
      </div>
    </section>
    <section
      id="sectionTwo1"
      class="container-about"
    >
      <div class="container about">
        <img
          src="@/assets/imgs/studing.svg"
          alt="Menina utilizando um notebook"
        >
        <article>
          <p>
            {{ lab?.descricao }}
          </p>
        </article>
      </div>
    </section>
    <section
      class="container-about"
    >
      <div class="container about">
        <article>
          <p>
            {{ lab?.sobre }}
          </p>
        </article>
        <img
          src="@/assets/imgs/functions.svg"
          alt="Imagem de computador com varias funções abertas"
        >
      </div>
    </section>
    <section
      id="sectionTwo2"
      v-show="lab?.membros?.length !== 0 && lab?.membros !== null"
      class="container-normal"
    >
      <div class="normal container">
        <label>Membros</label>
        <div class="list-normal">
          <QCard
            class="card"
            v-for="membro in lab?.membros ?? []"
            :key="membro.id"
          >
            <QCardSection class="profile-card">
              <img
                class="img-card"
                :src="membro.image ?? ''"
                alt="Imagem de membro"
              >
      
              <p>{{ membro.primeiro_nome + ' ' + membro.segundo_nome }}</p>
            </QCardSection>
            <QSeparator dark />
            <QCardSection>
              <p>{{ getPermissaoMember(membro) }}</p> 
            </QCardSection>
          </QCard>
        </div>
      </div>
    </section>
    <section
      id="sectionTwo3"
      v-show="lab?.projetos?.length !== 0 && lab?.projetos !== null"
      class="container-normal"
    >
      <div class="normal container">
        <label>Projetos</label>
        <div class="list-normal">
          <QCard
            class="card"
            v-for="projetos in lab?.projetos ?? []"
            :key="projetos.id"
          >
            <QCardSection class="profile-card">
              <img
                class="img-card"
                :src="projetos.image ?? ''"
                alt="Imagem do projeto"
              >
      
              <p>{{ projetos.titulo }}</p>
            </QCardSection>
            <QSeparator dark />
            <QCardSection>
              <p>{{ projetos.descricao }}</p> 
            </QCardSection>
          </QCard>
        </div>
      </div>
    </section>
  </main>
  <footer
    id="sectionTwo4"
    class="contaner-footer"
  >
    <div class="container footer-one">
      <img
        src="@/assets/imgs/logotipo_ufrn.svg"
        alt="Logo tipo da UFRN"
      >
      <div class="box-social">
        <div class="contacts">
          <QIcon
            name="my_location"
            size="1rem"
          />
          <span>{{ lab?.endereco?.bairro + ' - ' + lab?.endereco?.logradouro + ' - ' + lab?.endereco?.numero }}</span>
        </div>
        <div class="contacts">
          <QIcon
            name="location_on"
            size="1rem"
          />
          <span>{{ lab?.endereco?.estado + ' - ' + lab?.endereco?.cidade }}</span>
        </div>
        <div class="contacts">
          <QIcon
            name="pin_drop"
            size="1rem"
          />
          <span>{{ lab?.endereco?.cep }}</span>
        </div>
        <div class="contacts">
          <QIcon
            name="contact_mail"
            size="1rem"
          />
          <span>{{ lab?.email }}</span>
        </div>
      </div>
    </div>
    <hr
      class="container"
      style="width:100%;height: 1px;border: none; background-color: #333335;"
    >
    <div class="container rules">
      <p>{{ lab?.nome }}. Todos os direitos reservados.</p>
      <a
        class="button-topo"
        href="#heroTwo"
      >
        voltar ao topo
      </a>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.container-template {
  font-family: 'Roboto Slab', sans-serif;
  padding: 220px 120px;
  border-bottom: 1px solid #333335;
}

header {
  width: 100%;
  position: fixed;
  background-color: $dark;
  border-bottom: 1px solid #333335;
}

.header {
  padding: 10px 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

h2{
  font-size: 2.4rem;
  font-family: 'Roboto Slab' sans-serif;
  font-weight: 700;
  color: $secondary;
}

.img-lab{
  background-size: cover;
  border-radius: 50%;
  border: 1px solid $contour;
  width: 30rem;
  height: 30rem;
}

.menu-header{
  display: flex;
  align-items: center;
  gap: 2rem;
}

.menu-header a {
  cursor: pointer;
  color: $textColor;
  font-size: 1rem;
  font-weight: normal;
}

.menu-header a:hover{
  color: $secondary;
}

.template {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}

.template p {
  font-size: 3rem;
  font-weight: 600;
  line-height: 60px;
}

.template p strong {
  color: $secondary;
}

/* Section normal*/
.container-normal{
  padding: 40px;
  gap: 1rem;
  border-bottom: 1px solid #333335;
}

.normal{
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.container-normal label {
  font-size: 2.4rem;
  font-weight: bold;
}

.list-normal{
  
  padding: 10px 0px;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  overflow-x: auto;
}

.list-normal p {
  margin: 0px;
  font-size: 1.2rem;
}

/* Section about */
.container-about {
  font-family: 'Inter', sans-serif;
  padding: 160px 120px;
  border-bottom: 1px solid #333335;
}

.about {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}

.about article {
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  font-size: 1.8rem;
  line-height: 2rem;
  font-weight: 500;
}

/* Footer */
.contaner-footer {
  background-color: $dark;
  padding: 100px 120px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.footer-one {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.box-social {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}

.contacts{
  font: 1rem;
  display: flex;
  align-items: center;
  gap: 0.2rem;
}

a {
  cursor: pointer;
}

.rules {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.rules p {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 300;
}

.rules button {
  padding: 10px;
  border-radius: 10px;
  border: 0.5px solid #fff;
  text-transform: uppercase;
  background-color: transparent;
  color: #fff;
}

/* Info card */
.container-card {
  font-family: 'Inter', sans-serif;
  padding: 160px 120px;
  border-bottom: 1px solid #333335;
}

.info-card {
  display: flex;
  align-items: center;
  gap: 32px;
  justify-content: space-between;
}

.card {
  padding: 1.4rem;
  border-radius: 18px;
  background-color: $dark;
  font-family: 'Inter', sans-serif;
  width: 576px;
  display: flex;
  flex-direction: column;
  color: white;
  font-size: 1.75rem;
  line-height: 32px;
  font-weight: bold;
  gap: 1rem;
}

.img-card{
  background-size: cover;
  border-radius: 50%;
  border: 1px solid $contour;
  width: 8rem;
  height: 8rem;
}

.profile-card{
  display: flex;
  align-items: center;
  gap: 1rem;
}

.button-topo{
  padding: 10px;
  border-radius: 10px;
  border: 0.5px solid #fff;
  text-transform: uppercase;
  background-color: transparent;
  color: #fff;
}

.container-box {
  position: relative;
  width: 100%;
  height: 100%;
}

.icon {
  border: 1px solid $contour;
  position: fixed;
  top: 100px;
  right: 20px;
  cursor: pointer;
  background-color: $dark;
  border-radius: 50%;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.5s;
}

.box {
  position: fixed;
  top: 100px;
  right: 20px;
  width: 500px;
  height: 90%;
  background-color: $dark;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  padding: 20px;
  transition: transform 0.5s;
}

.slid-info{
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center
}

.close-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  background-color: $dark;
  border-radius: 50%;
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Animações */
.icon-slide-enter-active, .icon-slide-leave-active {
  transition: transform 0.5s;
}

.icon-slide-enter, .icon-slide-leave-to {
  transform: translateX(-50px);
}

.box-slide-enter-active, .box-slide-leave-active {
  transition: transform 0.5s;
}

.box-slide-enter, .box-slide-leave-to {
  transform: translateX(100%);
}
</style>