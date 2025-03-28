AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: false,
});


const boxes = document.querySelectorAll('.rotate');

boxes.forEach(box => {
    let timeout;
    box.addEventListener('mouseenter', function () {
        const min = box.classList.contains('polaroid') ? -20 : -10;
        const max = box.classList.contains('polaroid') ? 20 : 10;

        const randomDegree = Math.random() * (max - min) + min;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            box.style.transform = `rotate(${randomDegree}deg)`;
        }, 50);
    });

    box.addEventListener('mouseleave', function () {
        box.style.transform = 'rotate(0deg)';
    });
});

window.onload = function () {
    if (window.innerWidth > 768) {
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
    }
    else {
        const container = document.querySelector('#activities .elmt');
        container.style.display = 'grid';
        container.style.gridTemplateColumns = 'repeat(2, 1fr)';
        container.style.gap = '10px';

        const polaroids = document.querySelectorAll('.activities .polaroid');
        polaroids.forEach((polaroid) => {
            polaroid.style.position = 'static';
            polaroid.style.transform = 'none';
            polaroid.style.width = '100%';
        });
    }
    const elements = document.querySelectorAll(".presentation h1, .title h1");
    elements.forEach((h1) => {
        if (h1) {
            h1.style.display = "none";
            setTimeout(() => {
                h1.style.display = "inline-block";
            }, 10);
        }
    });

    AOS.refresh();
}

document.querySelector('.open-modal-btn').addEventListener('click', function () {
    document.getElementById('polaroidModal').classList.add('show');
});
document.querySelector('.close-modal').addEventListener('click', function () {
    document.getElementById('polaroidModal').classList.remove('show');
});
document.querySelector('.open-modal-btn2').addEventListener('click', function () {
    document.getElementById('polaroidModal').classList.add('show');
});


document.addEventListener("DOMContentLoaded", function () {
    let modalShown = false;
    function isElementInViewport(el) {
        var rect = el.getBoundingClientRect();
        return (
            rect.top < window.innerHeight &&
            rect.bottom >= 0
        );
    }

    function checkAboutSection() {
        var aboutSection = document.getElementById("experiences");
        var modal = document.getElementById("polaroidModal");
        if (isElementInViewport(aboutSection) && !modalShown) {
            modal.classList.add("show");
            modalShown = true;
        }
    }

    window.addEventListener("scroll", checkAboutSection);
    window.addEventListener("resize", checkAboutSection);

    document.querySelector('.close-modal').addEventListener('click', function () {
        document.getElementById('polaroidModal').classList.remove('show');
    });
});
