<script setup lang="ts">
import type { Horse, RacerInfo } from "../types";
import { RACER_COUNT } from "@/constants";
import { store } from "@/store";
import { getOrdinalSuffix } from "@/utils";
import { computed, ref, onUnmounted, watch } from "vue";

const currentRound = computed(() => store.state.CURRENT_ROUND);
const roundSchedule = computed(() => {
  const schedule = store.state.SCHEDULE;
  if (!schedule) return alert("Race schedule not initialized");
  return schedule[currentRound.value];
});
const isRacing = computed(() => store.getters.isRacing);
const isPaused = computed(() => !!store.state.RACE_STATE.pausedAt);

const animationFrameId = ref<number | null>(null);
const transitionTimeoutId = ref<number | null>(null);

const calculateProgress = (horse: Horse, elapsed: number) => {
  const distance = 1200 + currentRound.value * 200;
  const speed = horse.condition / 5;
  const progress = (elapsed * speed) / distance;
  return Math.min(progress, 100) + 5;
};

const animate = () => {
  if (!isRacing.value || isPaused.value) return;

  const currentTime = Date.now();
  const elapsed =
    currentTime -
    (store.state.RACE_STATE.startTime || 0) -
    store.state.RACE_STATE.elapsedTime;

  const newPositions = roundSchedule.value?.map(({ horse }: { horse: Horse }) => {
    const progress = calculateProgress(horse, elapsed);
    if (
      progress >= 100 &&
      !store.state.RESULTS[currentRound.value]?.some(
        (r: RacerInfo) => r.horse.name === horse.name
      )
    ) {
      store.dispatch("addToResults", horse);
    }
    return progress;
  });

  store.dispatch("updatePositions", newPositions);

  if (newPositions?.every((pos: number) => pos >= 100)) {
    store.dispatch("finishRace");
    return;
  }

  animationFrameId.value = requestAnimationFrame(animate);
};

const showingTransition = ref(false);
const transitionMessage = computed(
  () => `Starting ${getOrdinalSuffix(currentRound.value + 1)} LAP`
);

watch(currentRound, (newRound, oldRound) => {
  if (newRound > oldRound) {
    showingTransition.value = true;
    if (transitionTimeoutId.value) {
      clearTimeout(transitionTimeoutId.value);
    }
    transitionTimeoutId.value = window.setTimeout(() => {
      showingTransition.value = false;
    }, 2000);
  }
});

watch(isRacing, (val) => {
  if (val) {
    store.dispatch("startRace");
    animate();
  }
});

const togglePause = () => {
  if (isPaused.value) {
    store.dispatch("continueRace");
    animate();
  } else {
    store.dispatch("pauseRace");
    if (animationFrameId.value) {
      cancelAnimationFrame(animationFrameId.value);
    }
  }
};

onUnmounted(() => {
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value);
  }
  if (transitionTimeoutId.value) {
    clearTimeout(transitionTimeoutId.value);
  }
});
</script>

<template>
  <div class="race-field">
    <div class="race-container">
      <div class="lineup">
        <div v-for="line in RACER_COUNT" :key="line" class="line">
          <div class="line-info">
            <span class="position-number">{{ line }}</span>
            <span class="horse-name">{{
              roundSchedule && roundSchedule[line - 1]?.horse.name
              }}</span>
          </div>
          <div class="race">
            <div class="track-lines"></div>
            <div class="horse" :style="{
              left: `${store.state.RACE_STATE.positions[line - 1]}%`,
              position: 'absolute',
            }">
              <div class="horse-icon" :class="{ running: isRacing && !isPaused }">
                <div class="horse-body">
                  <div class="head" :style="{
                    backgroundColor: roundSchedule
                      ? roundSchedule[line - 1].horse.color
                      : 'transparent',
                  }"></div>
                  <div class="neck" :style="{
                    backgroundColor: roundSchedule
                      ? roundSchedule[line - 1].horse.color
                      : 'transparent',
                  }"></div>
                  <div class="torso" :style="{
                    backgroundColor: roundSchedule
                      ? roundSchedule[line - 1].horse.color
                      : 'transparent',
                  }"></div>
                  <div class="back-leg" :style="{
                    backgroundColor: roundSchedule
                      ? roundSchedule[line - 1].horse.color
                      : 'transparent',
                  }"></div>
                  <div class="front-leg" :style="{
                    backgroundColor: roundSchedule
                      ? roundSchedule[line - 1].horse.color
                      : 'transparent',
                  }"></div>
                  <div class="tail" :style="{
                    backgroundColor: roundSchedule
                      ? roundSchedule[line - 1].horse.color
                      : 'transparent',
                  }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="finish-line">
        <div class="finish-text">FINISH</div>
        <div class="finish-pattern"></div>
      </div>
    </div>

    <div class="race-info">
      <span class="lap-info">
        {{ getOrdinalSuffix(currentRound + 1) }} LAP - {{ 1200 + currentRound * 200 }}M
      </span>
      <button v-if="isRacing" @click="togglePause" :class="{ paused: isPaused }">
        {{ isPaused ? "Continue Race" : "Pause Race" }}
      </button>
    </div>

    <div v-if="showingTransition" class="lap-transition">
      {{ transitionMessage }}
    </div>
  </div>
</template>

<style scoped>
.race-field {
  display: flex;
  flex: 1 0 40%;
  flex-direction: column;
  margin: 10px;
  background: #f5f5f5;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.race-container {
  position: relative;
  display: flex;
  margin: 20px 0;
}

.lineup {
  flex: 1;
  position: relative;
  display: flex;
  min-height: 480px;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.line {
  display: flex;
  flex: 1;
  border-bottom: 1px solid #eee;
}

.line:last-child {
  border-bottom: none;
}

.line-info {
  width: 120px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  background: #2c3e50;
  color: white;
  font-size: 14px;
}

.position-number {
  font-weight: bold;
  margin-right: 10px;
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
}

.horse-name {
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.race {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.track-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: repeating-linear-gradient(90deg,
      transparent,
      transparent 50px,
      rgba(0, 0, 0, 0.03) 50px,
      rgba(0, 0, 0, 0.03) 51px);
}

.horse {
  height: 40px;
  width: 60px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: left 0.1s linear;
  z-index: 1;
}

.horse-icon {
  position: relative;
  width: 100%;
  height: 100%;
}

.horse-body {
  position: relative;
  width: 100%;
  height: 100%;
  transform: scale(0.8);
}

.head {
  position: absolute;
  width: 18px;
  height: 12px;
  left: 42px;
  top: 8px;
  border-radius: 50% 40% 40% 40%;
  transform-origin: 0 50%;
}

.neck {
  position: absolute;
  width: 22px;
  height: 15px;
  left: 25px;
  top: 12px;
  border-radius: 50% 50% 0 0;
  transform: rotate(-30deg);
}

.torso {
  position: absolute;
  width: 40px;
  height: 20px;
  left: 0;
  top: 15px;
  border-radius: 40% 20% 40% 40%;
}

.back-leg {
  position: absolute;
  width: 12px;
  height: 18px;
  left: 0;
  top: 22px;
  border-radius: 40% 40% 0 0;
  transform-origin: 50% 0;
}

.front-leg {
  position: absolute;
  width: 12px;
  height: 18px;
  left: 32px;
  top: 22px;
  border-radius: 40% 40% 0 0;
  transform-origin: 50% 0;
}

.tail {
  position: absolute;
  width: 20px;
  height: 8px;
  left: -15px;
  top: 18px;
  border-radius: 0 50% 50% 0;
  transform-origin: 100% 50%;
}

.horse-icon.running .head {
  animation: nod 0.4s infinite;
}

.horse-icon.running .back-leg {
  animation: gallop-back 0.4s infinite;
}

.horse-icon.running .front-leg {
  animation: gallop-front 0.4s infinite;
}

.horse-icon.running .tail {
  animation: tail-wag 0.4s infinite;
}

@keyframes nod {

  0%,
  100% {
    transform: rotate(0deg);
  }

  50% {
    transform: rotate(-10deg);
  }
}

@keyframes gallop-back {

  0%,
  100% {
    transform: rotate(0deg);
  }

  50% {
    transform: rotate(-30deg);
  }
}

@keyframes gallop-front {

  0%,
  100% {
    transform: rotate(0deg);
  }

  50% {
    transform: rotate(30deg);
  }
}

@keyframes tail-wag {

  0%,
  100% {
    transform: rotate(0deg);
  }

  50% {
    transform: rotate(-15deg);
  }
}

.finish-line {
  width: 40px;
  position: relative;
  margin-left: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.finish-text {
  writing-mode: vertical-lr;
  transform: rotate(180deg);
  text-align: center;
  color: #e74c3c;
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 10px;
}

.finish-pattern {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  background-image: repeating-linear-gradient(45deg,
      #e74c3c,
      #e74c3c 10px,
      white 10px,
      white 20px);
  opacity: 0.7;
}

.race-info {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  gap: 15px;
}

.lap-info {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  background: white;
  padding: 8px 16px;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

button {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  border-radius: 25px;
  background: #27ae60;
  color: white;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

button.paused {
  background: #e67e22;
}

@media (max-width: 768px) {
  .race-field {
    margin: 15px;
    padding: 10px;
  }

  .line-info {
    width: 80px;
    font-size: 12px;
  }

  .horse {
    height: 30px;
    width: 45px;
  }
}

.lap-transition {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(44, 62, 80, 0.9);
  color: white;
  padding: 20px 40px;
  border-radius: 12px;
  font-size: 24px;
  font-weight: bold;
  animation: fadeInOut 2s ease-in-out;
  z-index: 10;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }

  20% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }

  80% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }

  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
}
</style>
