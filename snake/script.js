document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const scoreDisplay = document.getElementById('score');
    const gameOverMessage = document.getElementById('game-over-message');
    const finalScoreDisplay = document.getElementById('final-score');
    const instructions = document.getElementById('instructions');

     
    const GRID_SIZE = 20;  
    const INITIAL_SPEED_MS = 200;  
    const SPEED_INCREMENT = 0.98;  

     
    let snake = [{ x: 10, y: 10 }];  
    let food = getRandomFoodPosition();
    let direction = { x: 0, y: 0 };  
    let nextDirection = { x: 0, y: 0 };
    let score = 0;
    let gameIntervalId = null;
    let currentSpeedMs = INITIAL_SPEED_MS;
    let isGameOver = false;
    let gameStarted = false;  

     

    function startGame() {
        console.log("Starting game...");
        snake = [{ x: 10, y: 10 }];
        food = getRandomFoodPosition();
        direction = { x: 0, y: 0 };  
        nextDirection = { x: 0, y: 0 };
        score = 0;
        scoreDisplay.textContent = score;
        currentSpeedMs = INITIAL_SPEED_MS;
        isGameOver = false;
        gameStarted = true;  

        gameOverMessage.style.display = 'none';  
        instructions.style.display = 'none';  

         
        if (gameIntervalId) {
            clearInterval(gameIntervalId);
        }
         
        gameIntervalId = setInterval(gameLoop, currentSpeedMs);
        console.log("Game loop started with interval ID:", gameIntervalId);
        drawGame();  
    }

    function gameLoop() {
        if (isGameOver) {
            console.log("Game Over - Stopping loop");
            clearInterval(gameIntervalId);
            return;
        }

         
        if (nextDirection.x !== 0 || nextDirection.y !== 0) {
              
            if (Math.abs(nextDirection.x) !== Math.abs(direction.x) || Math.abs(nextDirection.y) !== Math.abs(direction.y)) {
                 direction = { ...nextDirection };
            }
        }


         
        if (direction.x === 0 && direction.y === 0) {
            drawGame();  
            return;
        }

        moveSnake();
        if (checkCollisions()) {
            handleGameOver();
            return;  
        }
        if (checkEatFood()) {
            growSnake();
            food = getRandomFoodPosition();
            increaseScore();
             
            accelerateGame();
        }
        drawGame();  
    }

    function drawGame() {
         
        gameBoard.innerHTML = '';

         
        snake.forEach(segment => {
            const snakeElement = document.createElement('div');
            snakeElement.style.gridColumnStart = segment.x;
            snakeElement.style.gridRowStart = segment.y;
            snakeElement.classList.add('snake-segment');
            gameBoard.appendChild(snakeElement);
        });

         
        const foodElement = document.createElement('div');
        foodElement.style.gridColumnStart = food.x;
        foodElement.style.gridRowStart = food.y;
        foodElement.classList.add('food');
        gameBoard.appendChild(foodElement);
    }

    function moveSnake() {
        const head = { ...snake[0] };  

         
        head.x += direction.x;
        head.y += direction.y;

         
        snake.unshift(head);

         
         
         
         
         
         
         if (!isFoodEatenThisTick()) {
            snake.pop();
         }
    }

     
    function isFoodEatenThisTick() {
        const head = snake[0];
        return head.x === food.x && head.y === food.y;
    }


    function checkEatFood() {
         if (isFoodEatenThisTick()) {
             console.log("Food eaten!");
             return true;  
        }
        return false;
    }

    function growSnake() {
         
         
         
         
    }


    function increaseScore() {
        score++;
        scoreDisplay.textContent = score;
    }

    function accelerateGame() {
         console.log("Accelerating game. Old speed:", currentSpeedMs);
         clearInterval(gameIntervalId); 
         currentSpeedMs *= SPEED_INCREMENT;  
         currentSpeedMs = Math.max(currentSpeedMs, 50);  
         gameIntervalId = setInterval(gameLoop, currentSpeedMs);  
         console.log("New speed:", currentSpeedMs, "New interval ID:", gameIntervalId);
    }


    function checkCollisions() {
        const head = snake[0];

        if (head.x < 1 || head.x > GRID_SIZE || head.y < 1 || head.y > GRID_SIZE) {
            console.log("Collision with wall!");
            return true;
        }

        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                console.log("Collision with self!");
                return true;
            }
        }

        return false;
    }

    function handleGameOver() {
        console.log("Game Over!");
        isGameOver = true;
        clearInterval(gameIntervalId); 
        finalScoreDisplay.textContent = score; 
        gameOverMessage.style.display = 'flex'; 
        gameStarted = false; 
    }

    function getRandomFoodPosition() {
        let newFoodPosition;
        while (newFoodPosition == null || onSnake(newFoodPosition)) {
            newFoodPosition = {
                x: Math.floor(Math.random() * GRID_SIZE) + 1,
                y: Math.floor(Math.random() * GRID_SIZE) + 1
            };
        }
        return newFoodPosition;
    }

    function onSnake(position) {
        return snake.some(segment => segment.x === position.x && segment.y === position.y);
    }


    function handleInput(event) {
        let requestedDirection = null;

        if (event.type === 'keydown') {
            switch (event.key) {
                case 'ArrowUp': requestedDirection = { x: 0, y: -1 }; break;
                case 'ArrowDown': requestedDirection = { x: 0, y: 1 }; break;
                case 'ArrowLeft': requestedDirection = { x: -1, y: 0 }; break;
                case 'ArrowRight': requestedDirection = { x: 1, y: 0 }; break;
                default: return; 
            }
            event.preventDefault(); 
        } else if (event.type === 'click' && event.target.tagName === 'BUTTON') {
             const dir = event.target.dataset.direction;
             switch (dir) {
                case 'up': requestedDirection = { x: 0, y: -1 }; break;
                case 'down': requestedDirection = { x: 0, y: 1 }; break;
                case 'left': requestedDirection = { x: -1, y: 0 }; break;
                case 'right': requestedDirection = { x: 1, y: 0 }; break;
             }
        }

        if (!requestedDirection) return;


        if (!gameStarted || isGameOver) {
             startGame();
             nextDirection = requestedDirection;
             direction = requestedDirection; 
             return;
        }

         const isOppositeDirection =
            (requestedDirection.x !== 0 && requestedDirection.x === -direction.x) ||
            (requestedDirection.y !== 0 && requestedDirection.y === -direction.y);

        if (!isOppositeDirection) {
              nextDirection = requestedDirection;
        } else {
        }

    }

    document.addEventListener('keydown', handleInput);
    document.getElementById('controls').addEventListener('click', handleInput);

    drawGame();

}); 