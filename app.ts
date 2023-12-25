const GRAVITY = 9.8;
const BIRD_FRAME = 30;
const SPEED = 5;

class AngryBird {
  size: number;
  bird: HTMLElement | null;
  flyInterval: number | null = null;
  loc = {
    x: 0,
    y: 0,
  };
  constructor(size: number, bird: HTMLElement | null) {
    this.size = size;
    this.bird = bird;
    bird && (bird.style.width = `${size}px`);
    bird && (bird.style.height = `${size}px`);
  }

  clearLoc = () => {
    if (!this.bird) {
      throw new Error('now bird!');
    }
    this.bird.style.transform = 'translate(0)';
    this.loc = {
      x: 0,
      y: 0,
    };
  };

  stop = () => {
    if (!this.flyInterval) throw new Error('no interval!');
    clearInterval(this.flyInterval);
    this.flyInterval = null;
  };

  fly = (velocity: number, degree: number) => {
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
      this.bird.style.transform = `translate(${this.loc.x}px,${
        (this.loc.y * -1) / 2
      }px)`;
      if (this.loc.y < 0) {
        this.flyInterval && clearInterval(this.flyInterval);
        this.clearLoc();
      }
      y_velocity -= GRAVITY / BIRD_FRAME;
    }, Math.floor(1000 / BIRD_FRAME / SPEED));
  };
}

const birdTag = document.getElementById('bird');

const bird = new AngryBird(40, birdTag);

const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');

if (startBtn) {
  startBtn.addEventListener('click', () => {
    bird.fly(100, 30);
  });
}
if (stopBtn) {
  stopBtn.addEventListener('click', () => {
    bird.stop();
  });
}

birdTag?.addEventListener('mousedown', () => {
  document.addEventListener('mouseup', function upEventCallback(e) {
    const xDiff =
      e.clientX - birdTag?.getBoundingClientRect().x - bird.size / 2;
    const yDiff =
      e.clientY - birdTag?.getBoundingClientRect().y - bird.size / 2;

    const velocity = (xDiff ** 2 + yDiff ** 2) ** (1 / 2);
    let degree = (Math.atan(yDiff / (xDiff * -1)) * 180) / Math.PI;
    if (xDiff > 0) degree += 180;
    bird.fly(velocity, degree);
    document.removeEventListener('mouseup', upEventCallback);
  });
});
