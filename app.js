"use strict";
const GRAVITY = 9.8;
const BIRD_FRAME = 60;
const SPEED = 5;
const POWER_LEVEL = 3;
class AngryBird {
    constructor(size, bird) {
        this.flyInterval = null;
        this.loc = {
            x: 0,
            y: 0,
        };
        this.clearLoc = () => {
            if (!this.bird) {
                throw new Error('now bird!');
            }
            this.bird.style.transform = 'translate(0)';
            this.bird.src = './assets/angry_bird.webp';
            this.loc = {
                x: 0,
                y: 0,
            };
        };
        this.stop = () => {
            if (!this.flyInterval)
                throw new Error('no interval!');
            clearInterval(this.flyInterval);
            this.flyInterval = null;
        };
        this.fly = (velocity, degree) => {
            if (!this.bird) {
                throw new Error('now bird!');
            }
            if (degree > 360 || degree < 0) {
                throw new Error('not valid degree of bird!!');
            }
            if (this.flyInterval) {
                clearInterval(this.flyInterval);
                this.flyInterval = null;
            }
            const controlledVelocity = (velocity / 5) * POWER_LEVEL;
            const radian = (degree * Math.PI) / 180;
            const x_velocity = controlledVelocity * Math.cos(radian);
            let y_velocity = controlledVelocity * Math.sin(radian);
            this.clearLoc();
            this.flyInterval = setInterval(() => {
                if (!this.bird) {
                    this.flyInterval && clearInterval(this.flyInterval);
                    return;
                }
                this.loc.x += x_velocity / BIRD_FRAME;
                this.loc.y += y_velocity / BIRD_FRAME;
                this.bird.style.transform = `translate(${this.loc.x}px,${this.loc.y * -1}px)`;
                if (this.loc.y < 0) {
                    this.flyInterval && clearInterval(this.flyInterval);
                    this.bird.src = './assets/angry_bird_2.png';
                    window.scrollTo({
                        left: this.loc.x,
                        top: 0,
                    });
                    setTimeout(() => {
                        this.clearLoc();
                    }, 1000);
                    // this.clearLoc();
                }
                y_velocity -= GRAVITY / BIRD_FRAME;
            }, Math.floor(1000 / BIRD_FRAME / SPEED));
        };
        this.size = size;
        this.bird = bird;
        bird && (bird.style.width = `${size}px`);
        bird && (bird.style.height = `${size}px`);
    }
}
const birdTag = document.getElementById('bird');
const bird = new AngryBird(40, birdTag);
if (birdTag) {
    birdTag.style.top = `${birdTag.getBoundingClientRect().y - bird.size}px`;
}
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const birdLineTag = document.getElementById('bird_line');
if (birdLineTag && birdTag) {
    birdLineTag.style.left = `${birdTag.getBoundingClientRect().x + bird.size / 2}px`;
    birdLineTag.style.top = `${birdTag.getBoundingClientRect().y + bird.size / 2}px`;
}
function moveEventCallback(moveEvent) {
    if (birdTag) {
        const xDiff = moveEvent.clientX - birdTag.getBoundingClientRect().x - bird.size / 2;
        const yDiff = moveEvent.clientY - birdTag.getBoundingClientRect().y - bird.size / 2;
        if (birdLineTag) {
            birdLineTag.style.width = `${xDiff > 0 ? xDiff * 2 : xDiff * -1 * 2}px`;
            birdLineTag.style.height = `${yDiff > 0 ? yDiff * 2 : yDiff * -1 * 2}px`;
            birdLineTag.style.transform = `translate(${xDiff > 0 ? xDiff * -1 : xDiff}px,${yDiff > 0 ? yDiff * -1 : yDiff}px)`;
            birdLineTag.style.background = `url('${xDiff * yDiff < 0
                ? 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="100%" x2="100%" y2="0" stroke="gray" /></svg>'
                : 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="0" x2="100%" y2="100%" stroke="gray" /></svg>'}')`;
        }
    }
}
birdTag === null || birdTag === void 0 ? void 0 : birdTag.addEventListener('mousedown', () => {
    document.addEventListener('mousemove', moveEventCallback);
    document.addEventListener('mouseup', function upEventCallback(e) {
        const xDiff = e.clientX - (birdTag === null || birdTag === void 0 ? void 0 : birdTag.getBoundingClientRect().x) - bird.size / 2;
        const yDiff = e.clientY - (birdTag === null || birdTag === void 0 ? void 0 : birdTag.getBoundingClientRect().y) - bird.size / 2;
        const velocity = (xDiff ** 2 + yDiff ** 2) ** (1 / 2);
        let degree = (Math.atan(yDiff / (xDiff * -1)) * 180) / Math.PI;
        if (xDiff > 0)
            degree += 180;
        if (degree < 0)
            degree += 360;
        bird.fly(velocity, degree);
        document.removeEventListener('mousemove', moveEventCallback);
        document.removeEventListener('mouseup', upEventCallback);
    });
});
