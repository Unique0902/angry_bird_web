const GRAVITY = 9.8;

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
      this.loc.x += x_velocity / 10;
      this.loc.y += y_velocity / 10;
      console.log(
        `translate(${Math.floor(this.loc.x)}px,${Math.floor(this.loc.y)}px)`
      );

      this.bird.style.transform = `translate(${this.loc.x}px,${
        (this.loc.y * -1) / 2
      }px)`;
      if (this.loc.y < 0) this.flyInterval && clearInterval(this.flyInterval);
      y_velocity -= GRAVITY / 10;
    }, 100);
  };
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
