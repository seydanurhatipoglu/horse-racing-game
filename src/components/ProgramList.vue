<script setup lang="ts">
import { NUMBER_OF_ROUNDS } from '@/constants';
import { store } from '@/store';
import { computed } from 'vue';
import RaceGrid from './RaceGrid.vue';

const program = computed(() => store.state.SCHEDULE);
</script>

<template>
  <div class="program-list">
    <h3>Program</h3>
    <RaceGrid v-for="round in NUMBER_OF_ROUNDS" :key="round" :round="round" :data="program?.[round - 1] || []" />
  </div>
</template>

<style lang="scss" scoped>
@import '../assets/styles/design-system.scss';

.program-list {
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
}
</style>
