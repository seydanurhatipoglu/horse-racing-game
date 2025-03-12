import { Color, HorseList } from '@/types'

const horseNames: string[] = [
  'Thunder Bolt',
  'Silver Storm',
  'Midnight Star',
  'Golden Arrow',
  'Wild Spirit',
  'Royal Flash',
  'Swift Wind',
  'Dark Knight',
  'Lucky Charm',
  'Blazing Sun',
  'Mountain Echo',
  'Desert Rose',
  'Northern Light',
  'Ocean Breeze',
  'Victory Lane',
  'Shadow Runner',
  'Phoenix Fire',
  'Diamond Dust',
  'Storm Chaser',
  'Mystic Dream',
]

export function generateHorses(n: number): HorseList {
  return Array(n)
    .fill(null)
    .map((_, i) => ({
      name: horseNames[i],
      condition: Math.round(Math.random() * 100) + 1,
      color: getRandomColor(),
    }))
}

function getRandomColor(): Color {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color as Color
}

export function getOrdinalSuffix(num: number) {
  if (num >= 11 && num <= 13) return num + 'th'
  const lastDigit = num % 10
  switch (lastDigit) {
    case 1:
      return num + 'ST'
    case 2:
      return num + 'ND'
    case 3:
      return num + 'RD'
    default:
      return num + 'TH'
  }
}
