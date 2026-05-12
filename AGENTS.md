## Build Game 
Design a classic Pong game 2 player, where each player can control (their own up/down key) for their own platform to bound a single ball to each other side.

## General work rule
### Edited directory/environment scope
- Don't modified system folder (eg.C:/Program\ Files), or folders/file outside working workspace folder. 

### Develop front-end by Angular
- angular 15 setup
- can use tailwind css (not necessary to fill every html components with tailwind, can pass scss styles for more details design in `.scss` file)
 Keep HTML template and component logic together in the same `.ts` file using inline templates when reasonable.
- Prefer reducing component structure from 3 files (`html + ts + scss`) to 2 files for each component created (`.ts and scss`)

### Game Design
- score board for each player
- 2 platform and 1 ball
- platforms view is verticle 
- if one side platform fail to bound the ball (ball pass/touch border line), other player will gain score