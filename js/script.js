AOS.init({
    duration: 1000,  // Durée de l'animation (en ms)
    easing: 'ease-in-out',  // Type d’animation
    once: false,  // L'animation ne se joue qu'une seule fois
  });
  

const boxes = document.querySelectorAll('.rotate');

boxes.forEach(box => {
    let timeout;  
    box.addEventListener('mouseenter', function() {
        const min = box.classList.contains('polaroid') ? -20 : -10;
        const max = box.classList.contains('polaroid') ? 20 : 10;

        const randomDegree = Math.random() * (max - min) + min; 
        clearTimeout(timeout); 
        timeout = setTimeout(() => {
            box.style.transform = `rotate(${randomDegree}deg)`;  
        }, 50);      
    });

    box.addEventListener('mouseleave', function() {
        box.style.transform = 'rotate(0deg)';
    });
});

window.onload = function() {
    const polaroids = document.querySelectorAll('.activities .polaroid');
    const container = document.querySelector('#activities .elmt');
    
    const positions = [];

    polaroids.forEach((polaroid) => {
        let randomX, randomY;
        let collisionDetected = true;

        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        const polaroidWidth = polaroid.offsetWidth;
        const polaroidHeight = polaroid.offsetHeight;

        while (collisionDetected) {
            collisionDetected = false;

            randomX = Math.random() * (containerWidth - polaroidWidth);
            randomY = Math.random() * (containerHeight - polaroidHeight);

            for (let i = 0; i < positions.length; i++) {
                const pos = positions[i];

                if (
                    randomX < pos.x + pos.width &&
                    randomX + polaroidWidth > pos.x &&
                    randomY < pos.y + pos.height &&
                    randomY + polaroidHeight > pos.y
                ) {
                    collisionDetected = true;
                    break; 
                }
            }
        }

        positions.push({
            x: randomX,
            y: randomY,
            width: polaroidWidth,
            height: polaroidHeight
        });

        const randomRotation = (Math.random() * 30 - 15); 
        polaroid.style.position = 'absolute';
        polaroid.style.left = `${randomX}px`;
        polaroid.style.top = `${randomY}px`;
        polaroid.style.transform = `rotate(${randomRotation}deg)`; 
    });

    AOS.refresh();
}

document.getElementById('move-btn').addEventListener('click', function() {
    const polaroids = document.querySelectorAll('.activities .polaroid');
    const container = document.querySelector('#activities .elmt');

    const positions = [];

    polaroids.forEach((polaroid) => {
        let randomX, randomY;
        let collisionDetected = true;

        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        const polaroidWidth = polaroid.offsetWidth;
        const polaroidHeight = polaroid.offsetHeight;

        while (collisionDetected) {
            collisionDetected = false;

            randomX = Math.random() * (containerWidth - polaroidWidth);
            randomY = Math.random() * (containerHeight - polaroidHeight);

            for (let i = 0; i < positions.length; i++) {
                const pos = positions[i];

                if (
                    randomX < pos.x + pos.width &&
                    randomX + polaroidWidth > pos.x &&
                    randomY < pos.y + pos.height &&
                    randomY + polaroidHeight > pos.y
                ) {
                    collisionDetected = true;
                    break; 
                }
            }
        }

        positions.push({
            x: randomX,
            y: randomY,
            width: polaroidWidth,
            height: polaroidHeight
        });

        const randomRotation = (Math.random() * 30 - 15); 
        polaroid.style.position = 'absolute';
        polaroid.style.left = `${randomX}px`;
        polaroid.style.top = `${randomY}px`;
        polaroid.style.transform = `rotate(${randomRotation}deg)`; 
    });

    AOS.refresh();
});


