# 🏇 Horse Racing Championship

A dynamic web-based horse racing simulation game built with Vue 3, Vuex and TypeScript. Watch horses compete in multiple laps with realistic physics-based movement and beautiful animations.

## Features

- **Dynamic Horse Generation**: Generate unique horses with random attributes
- **Multi-Lap Racing**: Races consist of multiple laps with increasing distances
- **Real-time Animation**: Smooth CSS animations for horse movement
- **Race Management**:
  - Start/Pause race controls
  - Live race progress tracking
  - Lap transition animations
  - Real-time results updates

## Technical Stack

- Vue 3 with Composition API
- TypeScript for type safety
- Vuex for state management
- SCSS for styling
- CSS animations for horse movement

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/horse-racing-game.git
cd horse-racing-game
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

## How to Play

1. **Generate Horses**: Click the "Generate Horses" button to create a pool of unique horses with random attributes.

2. **Create Race Schedule**: Click "Generate Race Schedule" to set up the race program.

3. **Start Race**: Click "Start Race" to begin the competition.

4. **During the Race**:
   - Watch horses compete in real-time
   - Use the pause button to pause/resume the race
   - Monitor progress in the race field
   - View live results as horses finish each lap

## Game Mechanics

- Each horse has a unique:

  - Name (randomly selected from a pool of creative names)
  - Color (randomly generated)
  - Condition (determines speed, ranging from 1-100)

- Race Features:
  - Multiple laps (6 laps total)
  - Increasing distance per lap
  - Real-time position tracking
  - Automatic lap transitions

## Project Structure

```
src/
├── components/         # Vue components
│   ├── HorseList.vue  # Displays available horses
│   ├── RaceField.vue  # Main race visualization
│   ├── RaceGrid.vue   # Race results grid
│   ├── RaceResults.vue # Race results display
│   └── ProgramList.vue # Race program display
├── store/             # Vuex store
├── types/             # TypeScript types
├── utils/             # Utility functions
├── constants/         # Game constants
└── assets/           # Styles and assets
```
