const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
document.getElementById('year').textContent = new Date().getFullYear();

document.querySelectorAll('[data-words]').forEach((element) => {
  const words = element.textContent.trim().split(/\s+/);
  element.textContent = '';

  words.forEach((word, index) => {
    const span = document.createElement('span');
    span.textContent = `${word}${index === words.length - 1 ? '' : ' '}`;
    element.appendChild(span);
  });
});

const projects = document.getElementById('projects');
const track = document.getElementById('project-track');
const progress = document.getElementById('project-progress');
const desktopProjects = window.matchMedia('(min-width: 721px) and (prefers-reduced-motion: no-preference)');
let projectTarget = 0;
let projectCurrent = 0;
let projectFrame;

function updateProjectTrack() {
  if (!desktopProjects.matches || !projects || !track || !progress) return;

  const bounds = projects.getBoundingClientRect();
  const scrollDistance = projects.offsetHeight - window.innerHeight;
  const amount = Math.min(1, Math.max(0, -bounds.top / scrollDistance));
  const travel = track.scrollWidth - window.innerWidth + 32;

  projectTarget = amount * Math.max(0, travel);
  progress.style.width = `${amount * 100}%`;

  if (!projectFrame) animateProjectTrack();
}

function animateProjectTrack() {
  projectCurrent += (projectTarget - projectCurrent) * 0.11;
  track.style.transform = `translate3d(${-projectCurrent}px, 0, 0)`;

  if (Math.abs(projectTarget - projectCurrent) > 0.2) {
    projectFrame = requestAnimationFrame(animateProjectTrack);
  } else {
    projectCurrent = projectTarget;
    track.style.transform = `translate3d(${-projectCurrent}px, 0, 0)`;
    projectFrame = undefined;
  }
}

let scrollFrame;
function onScroll() {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    scrollFrame = undefined;
    updateProjectTrack();
    updateWordReveal();
  });
}

function updateWordReveal() {
  document.querySelectorAll('[data-words]').forEach((element) => {
    const bounds = element.getBoundingClientRect();
    const amount = Math.min(1, Math.max(0, (window.innerHeight * 0.82 - bounds.top) / (bounds.height + window.innerHeight * 0.28)));

    [...element.children].forEach((word, index) => {
      word.style.color = index / element.children.length < amount ? 'var(--paper)' : 'rgba(236, 232, 223, .16)';
    });
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', updateProjectTrack);
desktopProjects.addEventListener('change', updateProjectTrack);
updateProjectTrack();
updateWordReveal();
