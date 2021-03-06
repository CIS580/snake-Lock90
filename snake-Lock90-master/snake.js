/* Global variables */
var frontBuffer = document.getElementById('snake');
var frontCtx = frontBuffer.getContext('2d');
var backBuffer = document.createElement('canvas');
backBuffer.width = frontBuffer.width;
backBuffer.height = frontBuffer.height;
var backCtx = backBuffer.getContext('2d');
var oldTime = performance.now();
var gameOver = false;
var i;
var appleEaten = false;
var applePlaced = false;
var appleX;
var appleY;
var score = 0;
var snake = [];
snake[0] = {x: 15, y:30};
var speed = 3;

var input = {
  up: false,
  down: false,
  left: false,
  right: true
}

window.onkeydown = function(event) {
  event.preventDefault();
  console.log(event);
  switch(event.keyCode) {
    // UP
    case 38:
    case 87:
      if(input.down == false) {
        input.up = true;
        input.left = false;
        input.right = false;
        input.down = false;
      }
      break;
    // LEFT
    case 37:
    case 615:
      if(input.right == false) {
        input.up = false;
        input.left = true;
        input.right = false;
        input.down = false;
      }
      break;
    // RIGHT
    case 39:
    case 68:
      if(input.left == false) {
        input.up = false;
        input.left = false;
        input.right = true;
        input.down = false;
      }
      break;
    // DOWN
    case 40:
    case 83:
      if(input.up == false) {
        input.up = false;
        input.left = false;
        input.right = false;
        input.down = true;
      }
      break;
  }
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
function loop(newTime) {
  if(gameOver == false) {
    var elapsedTime = newTime - oldTime;
    oldTime = newTime;

    update(elapsedTime);
    render(elapsedTime);

    // Flip the back buffer
    frontCtx.drawImage(backBuffer, 0, 0);

    // Run the next loop
    window.requestAnimationFrame(loop);
  }
}

/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {elapsedTime} A DOMHighResTimeStamp indicting
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
  // TODO: Spawn an apple periodically
  if(applePlaced == false) {
    appleX = Math.floor(Math.random() * (backBuffer.width-15));
    appleY = Math.floor(Math.random() * (backBuffer.height-15));
    applePlaced = true;
    appleEaten = false;
  }
  // TODO: Grow the snake periodically
  if(appleEaten) {
    applePlaced = false;
    score += 5;
	speed += 0.5;
    snake[snake.length] = {x: snake[snake.length-1].x, y: snake[snake.length-1].y}
  }
  // TODO: Move the snake
  if(input.up || input.down || input.right || input.left) {
    for(i = snake.length-1; i>0 ; i--) {
      snake[i].x = snake[i-1].x;
      snake[i].y = snake[i-1].y;
    }
    if(input.up) {
      snake[0].y -= speed;
    } else if(input.down) {
      snake[0].y += speed;
    } else if(input.right) {
      snake[0].x += speed;
    } else if(input.left) {
      snake[0].x -= speed;
    }
  }
  // TODO: Determine if the snake has moved out-of-bounds (offscreen)
  if(snake[0].x < 0 || (snake[0].x + 15) > backBuffer.width || snake[0].y < 0 || (snake[0].y + 15) > backBuffer.height) {
    gameOver = true;
  }
  // TODO: Determine if the snake has eaten an apple
  if (snake[0].x < appleX + 15 && snake[0].x + 15 > appleX && snake[0].y < appleY + 15 && 15 + snake[0].y > appleY) {
      appleEaten = true;
  }
  // TODO: Determine if the snake has eaten its tail
 
  // TODO: [Extra Credit] Determine if the snake has run into an obstacle

}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {elapsedTime} A DOMHighResTimeStamp indicting
  * the number of milliseconds passed since the last frame.
  */
function render(elapsedTime) {
  backCtx.fillStyle = "White";
  backCtx.fillRect(0, 0, backBuffer.width, backBuffer.height);

  backCtx.fillStyle = "Black";
  backCtx.font = "bold 16px Arial";
  backCtx.fillText("Score: " + score, backBuffer.width/2 - 90, 15);

  // TODO: Draw the game objects into the backBuffer
  backCtx.fillStyle = "green";
  for(i = 0; i < snake.length; i++) {
    backCtx.fillRect(snake[i].x, snake[i].y, 15, 15);
  }

  if(applePlaced == true && appleEaten == false) {
    backCtx.fillStyle = "darkred";
    backCtx.fillRect(appleX, appleY, 15, 15);
  }

  if(gameOver) {
    backCtx.font = "30px Arial";
    backCtx.fillText("Game Over Refresh To Try Again", backBuffer.width/2 - 220, backBuffer.height/2);
  }
}

/* Launch the game */
window.requestAnimationFrame(loop);