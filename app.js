"use strict";
const GRAVITY = 9.8;
const BIRD_FRAME = 60;
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
            const radian = (degree * Math.PI) / 180;
            const x_velocity = velocity * Math.cos(radian);
            let y_velocity = velocity * Math.sin(radian);
            this.clearLoc();
            this.flyInterval = setInterval(() => {
                if (!this.bird) {
                    this.flyInterval && clearInterval(this.flyInterval);
                    return;
                }
                this.loc.x += x_velocity / BIRD_FRAME;
                this.loc.y += y_velocity / BIRD_FRAME;
                this.bird.style.transform = `translate(${this.loc.x}px,${(this.loc.y * -1) / 2}px)`;
                if (this.loc.y < 0)
                    this.flyInterval && clearInterval(this.flyInterval);
                y_velocity -= GRAVITY / BIRD_FRAME;
            }, Math.floor(1000 / BIRD_FRAME));
        };
        this.size = size;
        this.bird = bird;
    }
}
const birdTag = document.getElementById('bird');
const bird = new AngryBird(10, birdTag);
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
if (startBtn) {
    startBtn.addEventListener('click', () => {
        bird.fly(100, 60);
    });
}
if (stopBtn) {
    stopBtn.addEventListener('click', () => {
        bird.stop();
    });
}
