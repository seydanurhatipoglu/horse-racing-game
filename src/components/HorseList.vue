<script setup lang="ts">
import { computed } from 'vue';
import { store } from '@/store'

const horseList = computed(() => store.state.HORSE_LIST)
</script>

<template>
  <section class="horse-list">
    <h2>Available Horses</h2>
    <div class="table-container">
      <table class="horse-grid">
        <thead>
          <tr>
            <th>Name</th>
            <th>Condition</th>
            <th>Color</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="horse in horseList" :key="horse.name">
            <td>{{ horse.name }}</td>
            <td>
              {{ horse.condition }}
            </td>
            <td>
              <div class="color-preview" :style="{ backgroundColor: horse.color }"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import '../assets/styles/design-system.scss';

.horse-list {
  padding: $spacing-md;

  h2 {
    font-size: $font-size-lg;
    color: $primary;
    margin-bottom: $spacing-md;
    text-align: center;
  }
}

.table-container {
  overflow-x: auto;
  border-radius: $border-radius-sm;
  box-shadow: $shadow-sm;
}

.horse-grid {
  width: 100%;
  border-collapse: collapse;
  background: $white;

  th,
  td {
    padding: $spacing-sm;
    text-align: left;
    border-bottom: 1px solid $gray-200;
    font-size: $font-size-sm;
  }

  th {
    background: $primary;
    color: $white;
    font-weight: 600;
    white-space: nowrap;
  }

  tr:hover {
    background: $gray-100;
  }

  td {
    vertical-align: middle;
  }
}

.color-preview {
  width: 24px;
  height: 24px;
  border-radius: $border-radius-full;
  border: 2px solid $white;
  box-shadow: $shadow-sm;
}

@media (max-width: 768px) {
  .horse-list {
    padding: $spacing-sm;
  }
}
</style>
