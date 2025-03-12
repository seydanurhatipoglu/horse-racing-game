<script setup lang="ts">
import { store } from './store';
import RaceField from "./components/RaceField.vue";
import HorseList from "./components/HorseList.vue";
import RaceResults from "./components/RaceResults.vue";
import ProgramList from "./components/ProgramList.vue";
import { NUMBER_OF_ROUNDS } from './constants';

function generateHorses() {
  store.dispatch('generateHorses')
}

function generateProgram() {
  store.dispatch('generateProgram')
}

function startRace() {
  store.dispatch('startRace')
}

</script>

<template>
  <div class="app">
    <header class="header">
      <h1>🏇 Horse Racing Championship</h1>
    </header>

    <main class="main-content">
      <div class="game-container">
        <div class="controls-section">
          <button class="primary-button" @click="generateHorses" :disabled="store.state.HORSE_LIST.length > 0">
            Generate Horses
          </button>
          <button class="secondary-button" @click="generateProgram"
            :disabled="Boolean((!store.state.HORSE_LIST.length || store.state.SCHEDULE) && store.state.CURRENT_ROUND < NUMBER_OF_ROUNDS && !store.state.RACE_STATE.isFinished)">
            Generate Race Schedule
          </button>
          <button class="accent-button" @click="startRace" :disabled="!store.state.SCHEDULE || store.getters.isRacing">
            Start Race
          </button>
        </div>

        <div class="game-layout">
          <aside class="sidebar" v-if="store.state.HORSE_LIST.length">
            <HorseList />
          </aside>

          <RaceField v-if="store.state.SCHEDULE" class="race-field" />

          <div class="info-section">
            <ProgramList v-if="store.state.SCHEDULE" />
            <RaceResults v-if="store.state.SCHEDULE" />
          </div>
        </div>
      </div>
    </main>

    <footer class="footer">
      <p>Horse Racing Simulation &copy; {{ new Date().getFullYear() }}</p>
    </footer>
  </div>
</template>

<style lang="scss">
@import './assets/styles/design-system.scss';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: $font-family;
  background-color: $background;
  color: $primary;
  line-height: 1.5;
}

.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  background: $primary;
  color: $white;
  padding: $spacing-lg $spacing-xl;
  text-align: center;
  box-shadow: $shadow-md;

  h1 {
    font-size: $font-size-xl;
    font-weight: 700;
  }
}

.main-content {
  flex: 1;
  padding: $spacing-md;
  width: 100%;
  overflow: hidden;
}

.game-container {
  @include card;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.controls-section {
  display: flex;
  gap: $spacing-md;
  margin-bottom: $spacing-md;
  flex-wrap: wrap;
  justify-content: center;
  padding: $spacing-md;
  background: $gray-100;
  border-radius: $border-radius-md;
  flex-shrink: 0;
}

.primary-button {
  @include button-base;
  background: $secondary;
  color: $white;
}

.secondary-button {
  @include button-base;
  background: $primary;
  color: $white;
}

.accent-button {
  @include button-base;
  background: $accent;
  color: $white;
}

.results-section {
  margin-top: $spacing-xl;
  padding-top: $spacing-xl;
  border-top: 1px solid $gray-300;

  h2 {
    font-size: $font-size-lg;
    margin-bottom: $spacing-lg;
    text-align: center;
  }
}

.footer {
  background: $primary;
  color: $white;
  padding: $spacing-md;
  text-align: center;
  margin-top: auto;
}

.game-layout {
  display: flex;
  gap: $spacing-sm;
  flex: 1;
  overflow: hidden;
  min-height: 0;
  flex-wrap: wrap;
}

.sidebar {
  height: 100%;
  overflow-y: scroll;
  min-width: 240px;
  flex-shrink: 0;
  border-right: 1px solid $gray-200;
  flex: 1 0 20%;
}

.race-field {
  height: 100%;
  overflow-y: scroll;
  min-width: 0;
}

.info-section {
  height: 100%;
  overflow-y: scroll;
  width: 300px;
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  gap: $spacing-lg;
  border-left: 1px solid $gray-200;
  padding-left: $spacing-md;
  flex: 1 0 20%;

  >* {
    flex: 1;
    overflow-y: auto;
  }
}

@media (max-width: 1400px) {
  .game-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    border-right: none;
    border-bottom: 1px solid $gray-200;
    padding: 0 0 $spacing-lg 0;
  }

  .info-section {
    width: 100%;
    border-left: none;
    padding-left: 0;
  }
}

@media (max-width: 768px) {
  .info-section {
    flex-direction: column;
  }
}
</style>
