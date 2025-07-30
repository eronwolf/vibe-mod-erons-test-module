# Tetris Game Browser Testing Checklist

Use this checklist to verify that the Tetris game works correctly across different browsers and devices.

## Setup

1. Start the development server:
   ```
   npm run dev
   ```
2. Open the game in each browser you want to test.

## Functionality Tests

For each browser, verify the following functionality:

### Game Initialization

- [ ] Game loads without errors
- [ ] Start screen displays correctly
- [ ] Game starts when Space key is pressed
- [ ] Next piece preview displays correctly

### Game Controls

- [ ] Left arrow key moves piece left
- [ ] Right arrow key moves piece right
- [ ] Down arrow key moves piece down (soft drop)
- [ ] Up arrow key rotates piece
- [ ] Space bar performs hard drop
- [ ] P key pauses and resumes the game

### Game Mechanics

- [ ] Pieces spawn correctly at the top of the board
- [ ] Pieces lock in place when they can't move down further
- [ ] Line clearing works correctly
- [ ] Score increases appropriately
- [ ] Level increases after clearing enough lines
- [ ] Game speed increases with level
- [ ] Game over detection works correctly

### Visual Elements

- [ ] Game board renders correctly
- [ ] Grid lines are visible
- [ ] Tetromino colors are distinct
- [ ] Ghost piece (landing preview) displays correctly
- [ ] UI elements (score, level, lines) update correctly

### Sound Effects

- [ ] Movement sounds play when moving pieces
- [ ] Rotation sound plays when rotating pieces
- [ ] Drop sound plays when hard dropping
- [ ] Line clear sound plays when clearing lines
- [ ] Level up sound plays when increasing level
- [ ] Game over sound plays when the game ends
- [ ] Sound toggle button works correctly

### Responsive Design

- [ ] Game layout adjusts appropriately for different screen sizes
- [ ] Game is playable on smaller screens

## Browser-Specific Issues

Document any issues specific to each browser:

### Chrome/Edge
- Issues:
- Workarounds:

### Firefox
- Issues:
- Workarounds:

### Safari
- Issues:
- Workarounds:

### Mobile Browsers
- Issues:
- Workarounds:

## Performance Testing

- [ ] Game maintains consistent frame rate
- [ ] No noticeable lag during gameplay
- [ ] Animations are smooth
- [ ] Game responds quickly to user input

## Notes

Add any additional observations or issues here: