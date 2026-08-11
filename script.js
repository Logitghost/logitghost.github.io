const particles = [];

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  for (let i = 0; i < window.innerWidth / 25; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(3, 8, 16);
  particles.forEach((p, index) => {
    p.update();
    p.connect(particles.slice(index));
    p.show();
  });
}

class Particle {
  constructor() {
    this.pos = createVector(
      random(window.innerWidth),
      random(window.innerHeight)
    );
    this.vel = createVector(random(-0.69, 0.69), random(-0.69, 0.69));
    this.size = 6;
  }

  update() {
    while (
      (this.vel.x > -0.05 && this.vel.x < 0.05) ||
      (this.vel.y > -0.05 && this.vel.y < 0.05)
    ) {
      this.vel = createVector(random(-0.69, 0.69), random(-0.69, 0.69));
    }
    this.pos.add(this.vel);
    this.edges();
  }

  show() {
    noStroke();
    fill(210, 235, 255, 200);
    circle(this.pos.x, this.pos.y, this.size);
  }

  edges() {
    if (this.pos.x - this.size / 2 < 0 || this.pos.x + this.size / 2 > width) {
      this.vel.x *= -1;
    }
    if (this.pos.y - this.size / 2 < 0 || this.pos.y + this.size / 2 > height) {
      this.vel.y *= -1;
    }
  }

  connect(particles) {
    particles.forEach(particle => {
      const d = dist(this.pos.x, this.pos.y, particle.pos.x, particle.pos.y);
      if (d < 150) {
        let distStroke = map(d, 0, 150, 160, 30);
        let distWeight = map(d, 0, 150, 2.5, 0.6);
        stroke(200, 230, 255, distStroke);
        strokeWeight(distWeight);
        line(this.pos.x, this.pos.y, particle.pos.x, particle.pos.y);
      }
    });
  }
}

// Scroll indicator click handler
document.querySelector('.scroll-indi')?.addEventListener('click', () => {
  document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
});

// ─── Typing animation ─────────────────────────────────
const phrases = [
  'Machine Learning Engineer in Training',
  'Building things with real data.',
  'Kaggle competitor.',
];

let phraseIndex = 0;
let charIndex = 0;
let deleting = false;
let started = false;
const typedEl = document.querySelector('.typed-text');
const subtitleEl = document.querySelector('.hero-subtitle');

// Immediately wipe stale text
if (typedEl) typedEl.textContent = '';

function type() {
  if (!typedEl) return;

  const current = phrases[phraseIndex];

  // Only reveal AFTER the first character is actually painted
  if (!started && charIndex > 0 && subtitleEl) {
    // Remove the inline <style> that was force-hiding the subtitle
    const inlineHide = document.querySelector('style');
    if (inlineHide) inlineHide.remove();
    subtitleEl.classList.add('typing-started');
    started = true;
  }
  if (deleting) {
    typedEl.textContent = current.slice(0, charIndex--);
    if (charIndex < 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(type, 500);
      return;
    }
    setTimeout(type, 40);
  } else {
    typedEl.textContent = current.slice(0, charIndex++);
    if (charIndex > current.length) {
      deleting = true;
      setTimeout(type, 2200);
      return;
    }
    setTimeout(type, 60);
  }
}
setTimeout(type, 900);

// Scroll reveal animation
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(
  '.project-card, .skill-group, .contact-card, .about-text, .about-image'
).forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

// Stagger skill tags on reveal
document.querySelectorAll('.skill-group').forEach(group => {
  group.querySelectorAll('.tag').forEach((tag, i) => {
    tag.style.transitionDelay = `${i * 40}ms`;
  });
});
