class Player {
  constructor(x=0, y=0) {
    this.y = y;
    this.x = x;
    this.score = 0;

    // up = 0
    // down = 1
    // stationary = -1
    this.movement = -1;
    this.handlers = {};

    this.keyCodeUp;
    this.keyCodeDown;
    this.side;
  }

  handleKeyMoveRelease(keyCode) {
    if ((keyCode === this.keyCodeUp && this.movement != 1) 
      || (keyCode === this.keyCodeDown && this.movement != 0)) {
      this.movement = -1
    } 
  }

  handleKeyMoveUp(player) {
    player.y -= 10;
    player.movement = 0;
  }

  handleKeyMoveDown(player) {
    player.y += 10;
    player.movement = 1;
  }

  incrementTeamScore(amount=1) {
    if (this.side === "right") {
      rightSideScore += amount;
    } else {
      leftSideScore += amount;
    }
  }

  getTeamScore() {
    if (this.side === "right") return rightSideScore;
    return leftSideScore;
  }

  setDefaultHandlerMap(side) {
    this.side = side;
    if (side === "left") {
      this.handlers[keyW] = [this.handleKeyMoveUp, this.handleKeyMoveRelease];
      this.handlers[keyS] = [this.handleKeyMoveDown, this.handleKeyMoveRelease];

    } else if (side === "right") {
      this.handlers[UP_ARROW] = [this.handleKeyMoveUp, this.handleKeyMoveRelease];
      this.handlers[DOWN_ARROW] = [this.handleKeyMoveDown, this.handleKeyMoveRelease];

    } else {
      this.side = undefined;
      throw "'side' must be either 'left' or 'right' instead got '${side}'"
    }
  }

  handlePressed(keyCode) {
    return this.handlers[keyCode][0](this);
  }

  handleReleased(keyCode) {
    return this.handlers[keyCode][1](this);
  }
}

class Ball{
  constructor(x, y, speedX, speedY) {
    this.speedX = speedX;
    this.speedY = speedY;
    this.x = x;
    this.y = y;
  }

  updateSpeed() {
    this.x += this.speedX;
    this.y += this.speedY;
  }

  reset() {
    this.speedX *= -1;
    this.x = width / 2;
    this.y = height / 2;
  }
}

var leftSideScore = 0;
var rightSideScore = 0;

const width = 600;
const height = 400;

const WINNING_SCORE = 3;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;

const keyW = 87;
const keyS = 83;

const LEFT = width - PADDLE_THICKNESS;
const RIGHT = 0;

var damp = 0.2;
var showingWinScreen = false;

var players = [
  new Player(LEFT),
  new Player(),
];

var paddleBalls = [
  new Ball(width / 3, height / 3, 2, 6),
  new Ball(width / 2, height / 2, 5, 3)
];

function setup() {
  createCanvas(width, height);
  textAlign(CENTER);

  players[0].setDefaultHandlerMap('right');
  players[1].setDefaultHandlerMap('left');
}

function draw() {
  background(72, 86, 87);
  moveEverything();
  drawEverything();
}

function keyPressed() {
  for (let player of players) {
    if (keyCode in player.handlers) player.handlePressed(keyCode);
  }
}

function keyReleased() {
  for (let player of players) {
    if (keyCode in player.handlers) player.handleReleased(keyCode);
  }
}

function moveEverything() {
  for (let player of players) {
    if (player.movement === 0 && !(player.y < 10)) {
      player.y -= 10;
    } else if (player.movement === 1 && !(player.y + PADDLE_HEIGHT > height)) {
      player.y += 10;
    }

    if (player.getTeamScore() >= WINNING_SCORE) {
      return showingWinScreen = true;
    }

    for (let ball of paddleBalls) {
      ball.updateSpeed();

      if (ball.x + 5 < 0) {
        if (ball.y > player.y && ball.y < player.y + PADDLE_HEIGHT) {
          ball.speedX *= -1;
          var deltaY = ball.y - (player.y + PADDLE_HEIGHT / 2);
          ball.speedY = deltaY * damp;
        } else {
          player.incrementTeamScore();
          ball.reset();
        }
      }

      if (ball.x > width) {
        if (ball.y > player.y && ball.y < player.y + PADDLE_HEIGHT) {
          ball.speedX *= -1;
          var deltaY = ball.y - (player.y + PADDLE_HEIGHT / 2);
          ball.speedY = deltaY * damp;
        } else {
          player.incrementTeamScore();
          ball.reset();
        }
      }

      if (ball.y > height) {
        ball.y = height;
        ball.speedY *= -1;
      }

      if (ball.y < 0) {
        ball.y = 0;
        ball.speedY *= -1;
      }
    }
  }
}

function drawEverything() {
  fill(255);
  noStroke();

  if (showingWinScreen) {
    textSize(20);
    if (leftSideScore >= WINNING_SCORE) {
      text("left side won!", 200, 20);
    } else if (rightSideScore >= WINNING_SCORE) {
      text("right side won!", width - 200, 20);
    }

    textSize(14);
    return text("click to start a new game", width / 2, height - 200);
  }

  fill(127, 202, 177);

  for (let i=0; i < height; i += 40) {
    rect(width / 2 - 1, i, 2, 20);
  }

  for (let player of players) {
    rect(player.x, player.y, PADDLE_THICKNESS, PADDLE_HEIGHT);
  }

  fill(250, 251, 223);
  for (let ball of paddleBalls) {
    ellipse(ball.x, ball.y, 15, 15);
  }

  textSize(20);
  text(leftSideScore, 200, 100);
  text(rightSideScore, width - 200, 100);
}

function mouseReleased() {
  if (showingWinScreen) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  }
}
