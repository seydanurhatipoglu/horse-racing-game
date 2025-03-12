import { HORSE_COUNT, NUMBER_OF_ROUNDS, RACER_COUNT } from '@/constants'
import { Horse, HorseList, RacerInfo, RaceState } from '@/types'
import { generateHorses } from '@/utils'
import type { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'

export interface State {
  HORSE_LIST: HorseList
  CURRENT_ROUND: number
  SCHEDULE: Record<number, RacerInfo[]> | null
  IS_RACING: boolean
  RESULTS: Record<number, RacerInfo[]>
  RACE_STATE: RaceState
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    HORSE_LIST: [],
    CURRENT_ROUND: 0,
    SCHEDULE: null,
    IS_RACING: false,
    RESULTS: {},
    RACE_STATE: {
      positions: Array(RACER_COUNT).fill(0),
      startTime: null,
      pausedAt: null,
      elapsedTime: 0,
      isFinished: false,
    },
  },
  mutations: {
    SET_HORSE_LIST(state: State, horseList: HorseList) {
      state.HORSE_LIST = horseList
    },
    SET_CURRENT_ROUND(state: State, currentRound: number) {
      state.CURRENT_ROUND = currentRound
    },
    SET_SCHEDULE(state: State, schedule: Record<number, RacerInfo[]>) {
      state.SCHEDULE = schedule
    },
    SET_IS_RACING(state: State, isRacing: boolean) {
      state.IS_RACING = isRacing
    },
    SET_RESULTS(state: State, results: Record<number, RacerInfo[]>) {
      state.RESULTS = results
    },
    SET_RACE_STATE(state: State, raceState: Partial<RaceState>) {
      state.RACE_STATE = { ...state.RACE_STATE, ...raceState }
    },
  },
  actions: {
    generateHorses({ commit }) {
      commit('SET_HORSE_LIST', generateHorses(HORSE_COUNT))
    },
    generateProgram({ state, commit }) {
      for (let round = 0; round < NUMBER_OF_ROUNDS; round++) {
        const horseListAll = JSON.parse(JSON.stringify(state.HORSE_LIST))
        const horseListForRound: RacerInfo[] = []
        for (let position = 0; position < RACER_COUNT; position++) {
          const horse = horseListAll.splice(Math.floor(Math.random() * horseListAll.length), 1)[0]
          horseListForRound.push({
            position,
            // spread to prevent access issues due to proxy pattern
            horse: { ...horse },
          })
        }
        commit('SET_SCHEDULE', { ...state.SCHEDULE, [round]: horseListForRound })
        commit('SET_CURRENT_ROUND', 0)
        commit('SET_RACE_STATE', {
          positions: Array(RACER_COUNT).fill(0),
          startTime: Date.now(),
          pausedAt: null,
          elapsedTime: 0,
          isFinished: false,
        })
        commit('SET_IS_RACING', false)
        commit('SET_RESULTS', {})
      }
    },
    addToResults({ state, commit }, horse: Horse) {
      const lastPosition = state.RESULTS[state.CURRENT_ROUND]?.length || 0
      commit('SET_RESULTS', {
        ...state.RESULTS,
        [state.CURRENT_ROUND]: [
          ...(state.RESULTS[state.CURRENT_ROUND] || []),
          { position: lastPosition, horse },
        ],
      })
    },
    startRace({ commit }) {
      commit('SET_IS_RACING', true)
      commit('SET_RACE_STATE', {
        startTime: Date.now(),
        pausedAt: null,
        elapsedTime: 0,
        isFinished: false,
      })
    },
    pauseRace({ state, commit }) {
      commit('SET_RACE_STATE', {
        ...state.RACE_STATE,
        pausedAt: Date.now(),
      })
    },
    continueRace({ state, commit }) {
      if (state.RACE_STATE.pausedAt) {
        commit('SET_RACE_STATE', {
          ...state.RACE_STATE,
          elapsedTime: state.RACE_STATE.elapsedTime + Date.now() - state.RACE_STATE.pausedAt,
          pausedAt: null,
        })
      }
    },
    updatePositions({ commit }, positions: number[]) {
      commit('SET_RACE_STATE', {
        positions,
      })
    },
    finishRace({ state, commit }) {
      if (state.CURRENT_ROUND < NUMBER_OF_ROUNDS - 1) {
        commit('SET_CURRENT_ROUND', state.CURRENT_ROUND + 1)
        commit('SET_RACE_STATE', {
          positions: Array(RACER_COUNT).fill(0),
          startTime: Date.now(),
          pausedAt: null,
          elapsedTime: 0,
          isFinished: false,
        })
      } else {
        commit('SET_RACE_STATE', {
          isFinished: true,
        })
      }
      commit('SET_IS_RACING', false)
    },
  },
  getters: {
    isRacing(state) {
      return state.IS_RACING
    },
  },
})

export function useStore() {
  return baseUseStore(key)
}
