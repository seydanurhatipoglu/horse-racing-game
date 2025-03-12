<script setup lang="ts">
import { store } from "@/store";
import { computed } from "vue";
import RaceGrid from "./RaceGrid.vue";

const roundResults = computed(() => {
  const results = store.state.RESULTS;
  return results || {};
});
</script>

<template>
  <div class="race-results">
    <h3>Results</h3>
    <div v-if="Object.keys(roundResults).length > 0">
      <RaceGrid v-for="(round, index) in roundResults" :key="index" :round="parseInt(index) + 1" :data="round" />
    </div>
    <div v-else class="no-results">
      <p>No results available for this round yet.</p>
      <p>Results will appear here as horses finish the race.</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../assets/styles/design-system.scss";

.race-results {
  background: $white;
  border-radius: $border-radius-md;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: scroll;
}

.no-results {
  padding: $spacing-xl;
  text-align: center;
  background: $gray-100;
  border-radius: $border-radius-md;
  color: $gray-500;

  p {
    margin-bottom: $spacing-sm;

    &:last-child {
      margin-bottom: 0;
      font-size: $font-size-sm;
    }
  }
}

.result-item {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-sm;
  border-radius: $border-radius-md;
  background: $gray-100;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateX(4px);
  }
}

.position {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $primary;
  color: $white;
  border-radius: $border-radius-full;
  font-weight: bold;
  flex-shrink: 0;
}

.horse-info {
  flex: 1;
  min-width: 0;

  .horse-name {
    font-weight: 600;
    margin-bottom: $spacing-xs;
    color: $primary;
  }
}

.progress-bar {
  height: 20px;
  background: $gray-200;
  border-radius: $border-radius-full;
  position: relative;
  overflow: hidden;

  .progress {
    height: 100%;
    background: $secondary;
    transition: width 0.3s ease;
  }

  .progress-text {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: $white;
    font-size: $font-size-sm;
    font-weight: 600;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
}

.horse-color {
  width: 24px;
  height: 24px;
  border-radius: $border-radius-full;
  border: 2px solid $white;
  box-shadow: $shadow-sm;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .race-results {
    padding: $spacing-md;
  }

  .result-item {
    padding: $spacing-xs;
  }

  .position {
    width: 24px;
    height: 24px;
    font-size: $font-size-sm;
  }
}
</style>
