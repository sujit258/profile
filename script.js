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
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', updateProjectTrack);
desktopProjects.addEventListener('change', updateProjectTrack);
updateProjectTrack();
