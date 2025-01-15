window.addEventListener('load', function() {
    const canvas = document.getElementById('gameCanvas');
    const scorePanel = document.getElementById('scorePanel');
    const gameOverMessage = document.getElementById('gameOverMessage');
    const restartButton = document.getElementById('restartButton');
    const characterGif = document.getElementById('characterGif');
    const context = canvas.getContext('2d');

    let x = 100;
    let y = window.innerHeight - characterGif.offsetHeight - 50; // Position character on the ground
    let fireballsDodged = 0;
    let gameRunning = true;

    function initGame() {
        x = 100;
        y = window.innerHeight - characterGif.offsetHeight - 50;
        fireballsDodged = 0;
        gameRunning = true;
        scorePanel.textContent = 'Fireballs Dodged: 0';
        gameOverMessage.style.display = 'none';
        restartButton.style.display = 'none';
        fireballs.forEach(fireball => fireball.reset());
        draw();
    }

    // Set canvas dimensions to fill the screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Create fireballs
    class Fireball {
        constructor() {
            this.element = document.createElement('img');
            this.element.src = 'fireball.gif'; // Ensure you have a fireball GIF
            this.element.classList.add('fireball');
            document.body.appendChild(this.element);
            this.reset();
        }

        reset() {
            this.x = getRandomInt(0, canvas.width - 100); // Adjust to match fireball width
            this.y = -100; // Start above the canvas and adjust to match fireball height
            this.speed = getRandomInt(5, 10);
            this.updateElement();
        }

        update() {
            if (!gameRunning) {
                return;
            }

            // Move fireball down
            this.y += this.speed;

            // Check if fireball is dodged
            if (this.y > canvas.height) {
                this.reset();
                fireballsDodged++;
                scorePanel.textContent = 'Fireballs Dodged: ' + fireballsDodged;
            }

            // Check collision with Goku's yellow part
            const fireballRect = this.element.getBoundingClientRect();
            const gokuRect = characterGif.getBoundingClientRect();
            const collisionDetected = (
                fireballRect.left < gokuRect.right &&
                fireballRect.right > gokuRect.left &&
                fireballRect.bottom > gokuRect.top &&
                fireballRect.top < gokuRect.bottom - gokuRect.height / 2 // Adjust for yellow part collision
            );
            if (collisionDetected) {
                gameRunning = false;
                gameOverMessage.style.display = 'block';
                restartButton.style.display = 'block';
            }

            this.updateElement();
        }

        updateElement() {
            this.element.style.left = this.x + 'px';
            this.element.style.top = this.y + 'px';
        }
    }

    const fireballs = [new Fireball(), new Fireball(), new Fireball()];

    function draw() {
        if (!gameRunning) {
            return;
        }

        context.clearRect(0, 0, canvas.width, canvas.height);

        // Draw and update fireballs
        fireballs.forEach(fireball => {
            fireball.update();
        });

        requestAnimationFrame(draw);
    }

    function moveCharacter(e) {
        if (!gameRunning) {
            return;
        }

        switch (e.keyCode) {
            case 37: // left arrow
                x -= 10;
                break;
            case 38: // up arrow
                y -= 10;
                break;
            case 39: // right arrow
                x += 10;
                break;
            case 40: // down arrow
                y += 10;
                break;
        }
        // Ensure character stays within the screen bounds
        x = Math.max(0, Math.min(x, window.innerWidth - characterGif.offsetWidth));
        y = Math.max(0, Math.min(y, window.innerHeight - characterGif.offsetHeight));
        // Update GIF position
        characterGif.style.left = x + 'px';
        characterGif.style.top = y + 'px';
    }

    window.addEventListener('keydown', moveCharacter);

    restartButton.addEventListener('click', initGame);

    // Handle window resize
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        y = window.innerHeight - characterGif.offsetHeight - 50; // Adjust character position on resize
    });

    // Initial positioning
    characterGif.style.left = x + 'px';
    characterGif.style.top = y + 'px';

    // Start the game loop
    draw();
});
