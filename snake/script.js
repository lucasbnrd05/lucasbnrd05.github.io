document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const scoreDisplay = document.getElementById('score');
    const gameOverMessage = document.getElementById('game-over-message');
    const finalScoreDisplay = document.getElementById('final-score');
    const instructions = document.getElementById('instructions');

    // --- Configuration du jeu ---
    const GRID_SIZE = 20; // Nombre de cellules par ligne/colonne
    const INITIAL_SPEED_MS = 200; // Millisecondes entre chaque déplacement (plus bas = plus rapide)
    const SPEED_INCREMENT = 0.98; // Facteur de réduction du délai (accélération) - 1 = pas d'accélération

    // --- État du jeu ---
    let snake = [{ x: 10, y: 10 }]; // Position initiale (au centre approx.)
    let food = getRandomFoodPosition();
    let direction = { x: 0, y: 0 }; // Commence immobile
    let nextDirection = { x: 0, y: 0 };
    let score = 0;
    let gameIntervalId = null;
    let currentSpeedMs = INITIAL_SPEED_MS;
    let isGameOver = false;
    let gameStarted = false; // Pour gérer le premier démarrage

    // --- Fonctions principales ---

    function startGame() {
        console.log("Starting game...");
        snake = [{ x: 10, y: 10 }];
        food = getRandomFoodPosition();
        direction = { x: 0, y: 0 }; // Réinitialiser la direction
        nextDirection = { x: 0, y: 0 };
        score = 0;
        scoreDisplay.textContent = score;
        currentSpeedMs = INITIAL_SPEED_MS;
        isGameOver = false;
        gameStarted = true; // Le jeu a maintenant démarré au moins une fois

        gameOverMessage.style.display = 'none'; // Cacher le message Game Over
        instructions.style.display = 'none'; // Cacher les instructions initiales

        // Nettoyer l'ancien intervalle s'il existe
        if (gameIntervalId) {
            clearInterval(gameIntervalId);
        }
        // Démarrer la boucle de jeu
        gameIntervalId = setInterval(gameLoop, currentSpeedMs);
        console.log("Game loop started with interval ID:", gameIntervalId);
        drawGame(); // Dessiner l'état initial
    }

    function gameLoop() {
        if (isGameOver) {
            console.log("Game Over - Stopping loop");
            clearInterval(gameIntervalId);
            return;
        }

        // Mettre à jour la direction seulement si elle a changé
        if (nextDirection.x !== 0 || nextDirection.y !== 0) {
             // Empêcher le demi-tour instantané
            if (Math.abs(nextDirection.x) !== Math.abs(direction.x) || Math.abs(nextDirection.y) !== Math.abs(direction.y)) {
                 direction = { ...nextDirection };
            }
        }


        // Si le serpent ne bouge pas encore (début), ne pas exécuter move/check
        if (direction.x === 0 && direction.y === 0) {
            drawGame(); // juste redessiner l'état initial
            return;
        }

        moveSnake();
        if (checkCollisions()) {
            handleGameOver();
            return; // Sortir de la boucle après Game Over
        }
        if (checkEatFood()) {
            growSnake();
            food = getRandomFoodPosition();
            increaseScore();
            // Accélérer le jeu
            accelerateGame();
        }
        drawGame(); // Redessiner après chaque étape
    }

    function drawGame() {
        // 1. Vider le plateau
        gameBoard.innerHTML = '';

        // 2. Dessiner le serpent
        snake.forEach(segment => {
            const snakeElement = document.createElement('div');
            snakeElement.style.gridColumnStart = segment.x;
            snakeElement.style.gridRowStart = segment.y;
            snakeElement.classList.add('snake-segment');
            gameBoard.appendChild(snakeElement);
        });

        // 3. Dessiner la nourriture
        const foodElement = document.createElement('div');
        foodElement.style.gridColumnStart = food.x;
        foodElement.style.gridRowStart = food.y;
        foodElement.classList.add('food');
        gameBoard.appendChild(foodElement);
    }

    function moveSnake() {
        const head = { ...snake[0] }; // Copie de la tête actuelle

        // Calculer la nouvelle position de la tête
        head.x += direction.x;
        head.y += direction.y;

        // Ajouter la nouvelle tête au début du serpent
        snake.unshift(head);

        // Si la nourriture n'a pas été mangée, retirer le dernier segment
        // (La gestion de la nourriture se fait dans checkEatFood/growSnake)
        // Ici, on retire toujours la queue SAUF si on vient de manger
        // La vérification de nourriture est faite APRES moveSnake dans gameLoop
        // Donc, on retire la queue ici, et si on mange, on la rajoutera dans growSnake (ou on ne la retire pas dans checkEatFood)
        // --> Décision: On retire la queue ici. Si on mange, on ne fera *rien* de plus, le serpent aura grandi naturellement.
         if (!isFoodEatenThisTick()) {
            snake.pop();
         }
    }

    // Fonction helper pour savoir si on vient de manger (pour moveSnake)
    function isFoodEatenThisTick() {
        const head = snake[0];
        return head.x === food.x && head.y === food.y;
    }


    function checkEatFood() {
         if (isFoodEatenThisTick()) {
             console.log("Food eaten!");
             return true; // La nourriture a été mangée
        }
        return false;
    }

    function growSnake() {
        // La croissance est gérée implicitement par le fait de ne pas faire snake.pop() dans moveSnake
        // quand isFoodEatenThisTick() est vrai.
        // On pourrait aussi explicitement ajouter la queue ici si on avait pop() dans tous les cas dans moveSnake.
        // L'approche actuelle est plus simple.
    }


    function increaseScore() {
        score++;
        scoreDisplay.textContent = score;
    }

    function accelerateGame() {
         console.log("Accelerating game. Old speed:", currentSpeedMs);
         clearInterval(gameIntervalId); // Arrêter l'ancien intervalle
         currentSpeedMs *= SPEED_INCREMENT; // Réduire le délai
         currentSpeedMs = Math.max(currentSpeedMs, 50); // Vitesse minimale (limite)
         gameIntervalId = setInterval(gameLoop, currentSpeedMs); // Redémarrer avec la nouvelle vitesse
         console.log("New speed:", currentSpeedMs, "New interval ID:", gameIntervalId);
    }


    function checkCollisions() {
        const head = snake[0];

        // 1. Collision avec les murs
        if (head.x < 1 || head.x > GRID_SIZE || head.y < 1 || head.y > GRID_SIZE) {
            console.log("Collision with wall!");
            return true;
        }

        // 2. Collision avec soi-même
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
        clearInterval(gameIntervalId); // Arrêter la boucle de jeu
        finalScoreDisplay.textContent = score; // Mettre à jour le score final
        gameOverMessage.style.display = 'flex'; // Afficher le message
        gameStarted = false; // Prêt pour un nouveau démarrage au prochain input
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

    // Vérifie si une position donnée est sur le serpent
    function onSnake(position) {
        return snake.some(segment => segment.x === position.x && segment.y === position.y);
    }

    // --- Gestion des entrées (Clavier et Boutons) ---

    function handleInput(event) {
        let requestedDirection = null;

        // Déterminer la direction demandée
        if (event.type === 'keydown') {
            switch (event.key) {
                case 'ArrowUp': requestedDirection = { x: 0, y: -1 }; break;
                case 'ArrowDown': requestedDirection = { x: 0, y: 1 }; break;
                case 'ArrowLeft': requestedDirection = { x: -1, y: 0 }; break;
                case 'ArrowRight': requestedDirection = { x: 1, y: 0 }; break;
                default: return; // Ignorer les autres touches
            }
            event.preventDefault(); // Empêcher le défilement de la page avec les flèches
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


        // Si le jeu est terminé ou n'a pas commencé, démarrer/redémarrer le jeu
        if (!gameStarted || isGameOver) {
             startGame();
             // Appliquer immédiatement la première direction demandée
             nextDirection = requestedDirection;
             direction = requestedDirection; // Forcer la direction initiale pour le premier mouvement
             return;
        }


         // Mettre à jour nextDirection pour le prochain tick de la boucle de jeu
         // Vérifier si la direction demandée n'est pas l'opposée de la direction *actuelle*
         const isOppositeDirection =
            (requestedDirection.x !== 0 && requestedDirection.x === -direction.x) ||
            (requestedDirection.y !== 0 && requestedDirection.y === -direction.y);

        if (!isOppositeDirection) {
              nextDirection = requestedDirection;
              // console.log("Next direction set to:", nextDirection);
        } else {
            // console.log("Ignoring opposite direction request");
        }

    }

    // Écouteurs d'événements
    document.addEventListener('keydown', handleInput);
    document.getElementById('controls').addEventListener('click', handleInput);

    // Afficher l'état initial (serpent immobile, nourriture) au chargement
    drawGame();

}); // Fin de DOMContentLoaded