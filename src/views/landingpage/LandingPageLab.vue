<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { labStore } from '@/stores/laboratory';
import { useRoute } from 'vue-router';
import type { LaboratorioResponse } from '@/types';
import { authStore } from '@/stores/auth';

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
  <div v-show="laboratory?.template === 1">
    <h1>Template 1</h1>
  </div>
  <div v-show="laboratory?.template === 2">
    <h1>Template 2</h1>
  </div>
</template>
<style scoped lang="">
  
</style>