<script setup lang="ts">
import { RacerInfo } from '@/types';
import { getOrdinalSuffix } from '@/utils';

defineProps<{
  round: number,
  data: RacerInfo[],
}>();
</script>

<template>
  <div class="race-grid-container">
    <h4>{{ `${getOrdinalSuffix(round)} LAP - ${1200 + (round - 1) * 200}M` }}</h4>
    <table class="race-grid">
      <thead>
        <tr>
          <th>Position</th>
          <th>Horse Name</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.horse.name">
          <td>{{ item.position + 1 }}</td>
          <td>{{ item.horse.name }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
@import '../assets/styles/design-system.scss';

.race-grid-container {
  background: $white;
  border-radius: $border-radius-md;
  padding: $spacing-md;
  box-shadow: $shadow-sm;

  h3 {
    color: $primary;
    font-size: $font-size-lg;
    margin-bottom: $spacing-md;
    text-align: center;
  }
}

.race-grid {
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: $spacing-sm;
    text-align: left;
    border-bottom: 1px solid $gray-200;
  }

  th {
    background: $primary;
    color: $white;
    font-weight: 600;
  }

  tr:hover {
    background: $gray-100;
  }
}
</style>
