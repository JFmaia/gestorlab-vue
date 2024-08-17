<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { labStore } from '@/stores/laboratory';
import { useRoute } from 'vue-router';
import type { LaboratorioResponse } from '@/types';
import { QSpinnerDots} from 'quasar';
import { authStore } from '@/stores/auth';
import TemplateOne from './components/TemplateOne.vue';
import TemplateTwo from './components/TemplateTwo.vue';

// Router
const route = useRoute();
const auth = authStore();
// State
const lab = labStore();

// Variables
const id = route.params.id;
let laboratory = ref<LaboratorioResponse>();

// Functions
onMounted(async()=>{
  laboratory.value = await lab.getLaboratory(id, auth.getToken);
});
</script>
<template>
  <div v-if="laboratory">
    <div v-show="laboratory?.template === 1">
      <TemplateOne :lab="laboratory" />
    </div>
    <div v-show="laboratory?.template === 2">
      <TemplateTwo :lab="laboratory" />
    </div>
  </div>
  <div
    class="loading"
    v-else
  >
    <QSpinnerDots
      size="2rem"
      color="primary"
    />
  </div>
</template>
<style scoped lang="scss">
  .loading{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 110%;
  }
</style>