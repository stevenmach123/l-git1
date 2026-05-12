import { Component, HostListener, OnInit, OnDestroy } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit, OnDestroy {
  // Game board dimensions
  gameWidth = 500;
  gameHeight = 300;
  
  // Paddle properties
  paddleHeight = 80;
  paddleWidth = 15;
  paddleSpeed = 8;
  
  // Ball properties
  ballSize = 20;
  ballSpeed = 5;
  
  // Game state
  player1Score = 0;
  player2Score = 0;
  leftPaddleY = this.gameHeight / 2 - this.paddleHeight / 2;
  rightPaddleY = this.gameHeight / 2 - this.paddleHeight / 2;
  ballX = this.gameWidth / 2 - this.ballSize / 2;
  ballY = this.gameHeight / 2 - this.ballSize / 2;
  ballVelocityX = this.ballSpeed;
  ballVelocityY = this.ballSpeed / 2;
  
  gameStarted = false;
  gamePaused = false;
  gameOver = false;
  winner = 0;
  
  // Key state tracking
  keysPressed: { [key: string]: boolean } = {};
  
  // Game loop
  private gameLoopInterval: any;
  
  ngOnInit(): void {
    this.setupKeyboardControls();
  }
  
  ngOnDestroy(): void {
    this.stopGameLoop();
  }
  
  @HostListener("window:keydown", ["$event"])
  handleKeyDown(event: KeyboardEvent): void {
    this.keysPressed[event.key] = true;
    
    // Start game on spacebar if not started
    if (event.key === " " && !this.gameStarted) {
      this.startGame();
    }
  }
  
  @HostListener("window:keyup", ["$event"])
  handleKeyUp(event: KeyboardEvent): void {
    this.keysPressed[event.key] = false;
  }
  
  setupKeyboardControls(): void {
    // We handle key events with HostListener above
  }
  
  startGame(): void {
    if (this.gameOver) {
      this.resetGame();
    }
    
    this.gameStarted = true;
    this.gamePaused = false;
    this.gameOver = false;
    this.startGameLoop();
  }
  
  pauseGame(): void {
    this.gamePaused = true;
    this.stopGameLoop();
  }
  
  resumeGame(): void {
    this.gamePaused = false;
    this.startGameLoop();
  }
  
  startGameLoop(): void {
    this.stopGameLoop(); // Clear any existing interval
    this.gameLoopInterval = setInterval(() => {
      if (!this.gamePaused && !this.gameOver) {
        this.updateGame();
      }
    }, 1000 / 60); // ~60 FPS
  }
  
  stopGameLoop(): void {
    if (this.gameLoopInterval) {
      clearInterval(this.gameLoopInterval);
      this.gameLoopInterval = null;
    }
  }
  
  updateGame(): void {
    // Move paddles based on key presses
    this.movePaddles();
    
    // Move ball
    this.moveBall();
    
    // Check collisions
    this.checkCollisions();
    
    // Check scoring
    this.checkScore();
    
    // Check for game over
    this.checkGameOver();
  }
  
  movePaddles(): void {
    // Player 1 controls (W/S)
    if (this.keysPressed["w"] || this.keysPressed["W"]) {
      this.leftPaddleY = Math.max(0, this.leftPaddleY - this.paddleSpeed);
    }
    if (this.keysPressed["s"] || this.keysPressed["S"]) {
      this.leftPaddleY = Math.min(
        this.gameHeight - this.paddleHeight,
        this.leftPaddleY + this.paddleSpeed
      );
    }
    
    // Player 2 controls (ArrowUp/ArrowDown)
    if (this.keysPressed["ArrowUp"]) {
      this.rightPaddleY = Math.max(0, this.rightPaddleY - this.paddleSpeed);
    }
    if (this.keysPressed["ArrowDown"]) {
      this.rightPaddleY = Math.min(
        this.gameHeight - this.paddleHeight,
        this.rightPaddleY + this.paddleSpeed
      );
    }
  }
  
  moveBall(): void {
    this.ballX += this.ballVelocityX;
    this.ballY += this.ballVelocityY;
  }
  
  checkCollisions(): void {
    // Top wall collision
    if (this.ballY <= 0) {
      this.ballY = 0;
      this.ballVelocityY = Math.abs(this.ballVelocityY);
    }
    
    // Bottom wall collision
    if (this.ballY >= this.gameHeight - this.ballSize) {
      this.ballY = this.gameHeight - this.ballSize;
      this.ballVelocityY = -Math.abs(this.ballVelocityY);
    }
    
    // Left paddle collision
    if (
      this.ballX <= this.paddleWidth + 10 &&
      this.ballX >= 10 &&
      this.ballY + this.ballSize >= this.leftPaddleY &&
      this.ballY <= this.leftPaddleY + this.paddleHeight
    ) {
      this.ballX = this.paddleWidth + 10;
      this.ballVelocityX = Math.abs(this.ballVelocityX);
      
      // Add vertical angle based on where the ball hits the paddle
      const paddleCenter = this.leftPaddleY + this.paddleHeight / 2;
      const ballCenter = this.ballY + this.ballSize / 2;
      const relativeIntersectY = (paddleCenter - ballCenter) / (this.paddleHeight / 2);
      this.ballVelocityY = -relativeIntersectY * this.ballSpeed;
    }
    
    // Right paddle collision
    if (
      this.ballX >= this.gameWidth - this.paddleWidth - this.ballSize - 10 &&
      this.ballX <= this.gameWidth - 10 - this.ballSize &&
      this.ballY + this.ballSize >= this.rightPaddleY &&
      this.ballY <= this.rightPaddleY + this.paddleHeight
    ) {
      this.ballX = this.gameWidth - this.paddleWidth - this.ballSize - 10;
      this.ballVelocityX = -Math.abs(this.ballVelocityX);
      
      // Add vertical angle based on where the ball hits the paddle
      const paddleCenter = this.rightPaddleY + this.paddleHeight / 2;
      const ballCenter = this.ballY + this.ballSize / 2;
      const relativeIntersectY = (paddleCenter - ballCenter) / (this.paddleHeight / 2);
      this.ballVelocityY = -relativeIntersectY * this.ballSpeed;
    }
  }
  
  checkScore(): void {
    // Player 2 scores
    if (this.ballX < 0) {
      this.player2Score++;
      this.resetBall();
    }
    
    // Player 1 scores
    if (this.ballX > this.gameWidth) {
      this.player1Score++;
      this.resetBall();
    }
  }
  
  checkGameOver(): void {
    // First player to reach 5 points wins
    if (this.player1Score >= 5) {
      this.gameOver = true;
      this.winner = 1;
      this.stopGameLoop();
    } else if (this.player2Score >= 5) {
      this.gameOver = true;
      this.winner = 2;
      this.stopGameLoop();
    }
  }
  
  resetBall(): void {
    this.ballX = this.gameWidth / 2 - this.ballSize / 2;
    this.ballY = this.gameHeight / 2 - this.ballSize / 2;
    
    // Randomize direction
    this.ballVelocityX = Math.random() > 0.5 ? this.ballSpeed : -this.ballSpeed;
    this.ballVelocityY = (Math.random() * 2 - 1) * this.ballSpeed;
  }
  
  resetGame(): void {
    this.player1Score = 0;
    this.player2Score = 0;
    this.leftPaddleY = this.gameHeight / 2 - this.paddleHeight / 2;
    this.rightPaddleY = this.gameHeight / 2 - this.paddleHeight / 2;
    this.resetBall();
    this.gameStarted = false;
    this.gamePaused = false;
    this.gameOver = false;
    this.winner = 0;
    this.stopGameLoop();
  }
}

