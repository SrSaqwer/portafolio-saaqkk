const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Intersection Observer for smooth reveal
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2,
  },
);

document
  .querySelectorAll(
    ".hero, .section, .gallery__item, .timeline__item, .status-card, .floating-card",
  )
  .forEach((el) => {
    revealObserver.observe(el);
  });

// FAQ accordions
document.querySelectorAll(".faq__item").forEach((item) => {
  const button = item.querySelector(".faq__question");
  if (!button) return;
  button.addEventListener("click", () => {
    const isOpen = item.classList.toggle("open");
    button.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
});

// Metrics counters
const metricValues = document.querySelectorAll(".metric__value[data-target]");
if (metricValues.length) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          if (el.dataset.animated) return;
          el.dataset.animated = "true";
          const target = parseInt(el.dataset.target, 10) || 0;
          const duration = 1500;
          const start = performance.now();
          const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            el.textContent = Math.round(progress * target);
            if (progress < 1) {
              requestAnimationFrame(step);
            }
          };
          requestAnimationFrame(step);
          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.6 },
  );

  metricValues.forEach((el) => counterObserver.observe(el));
}

// Progress bars
const progressCards = document.querySelectorAll(".progress-card");
if (progressCards.length) {
  const progressObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const card = entry.target;
          const fill = card.querySelector(".progress__fill");
          const target = Number(card.dataset.progress) || 0;
          if (fill) {
            fill.style.width = `${target}%`;
          }
          progressObserver.unobserve(card);
        }
      });
    },
    { threshold: 0.4 },
  );

  progressCards.forEach((card) => progressObserver.observe(card));
}

// Animated background canvas
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  particles = Array.from({ length: 80 }, () => createParticle());
}

function createParticle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2 + 0.5,
    speedX: (Math.random() - 0.5) * 0.3,
    speedY: (Math.random() - 0.5) * 0.3,
  };
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => {
    p.x += p.speedX;
    p.y += p.speedY;

    if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
    if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 118, 199, 0.5)";
    ctx.fill();
  });
  requestAnimationFrame(draw);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
draw();

// Discord status via Lanyard (replace with real user ID)
const DISCORD_USER_ID = "323475574007734273";
const statusIndicator = document.querySelector(".status__indicator");
const heroStatusValue = document.querySelector(".status__value");
const presenceText = document.getElementById("presence-text");
const activityText = document.getElementById("activity-text");
const badgesList = document.getElementById("badges-list");
const lastUpdated = document.getElementById("last-updated");

function updatePresence(data) {
  const { discord_status, activities, badges = [] } = data;
  const colors = {
    online: "#22c55e",
    idle: "#fbbf24",
    dnd: "#f87171",
    offline: "#6b7280",
  };

  const statusText = discord_status?.toUpperCase() ?? "OFFLINE";
  const activity = activities?.find((act) => act.type === 0) || activities?.[0];

  if (statusIndicator) {
    statusIndicator.style.background = colors[discord_status] || colors.offline;
  }
  if (heroStatusValue) {
    heroStatusValue.textContent = `@saaqkk está ${discord_status}`;
  }
  if (presenceText) {
    presenceText.textContent = statusText;
  }
  if (activityText) {
    activityText.textContent = activity
      ? `${activity.name}${activity.state ? ` — ${activity.state}` : ""}`
      : "Sin actividad visible";
  }
  if (badgesList) {
    badgesList.innerHTML = "";
    if (badges.length) {
      badges.forEach((badge) => {
        const li = document.createElement("li");
        li.textContent = badge.name || badge;
        badgesList.appendChild(li);
      });
    } else {
      const li = document.createElement("li");
      li.textContent = "Sin insignias públicas";
      badgesList.appendChild(li);
    }
  }
  if (lastUpdated) {
    const date = new Date();
    lastUpdated.textContent = `Actualizado ${date.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }
}

function connectLanyard() {
  const ws = new WebSocket("wss://api.lanyard.rest/socket");
  let heartbeat;

  ws.addEventListener("message", (event) => {
    const { op, d } = JSON.parse(event.data);

    switch (op) {
      case 1:
        heartbeat = setInterval(() => {
          ws.send(JSON.stringify({ op: 3 }));
        }, d.heartbeat_interval);
        ws.send(
          JSON.stringify({
            op: 2,
            d: {
              subscribe_to_id: DISCORD_USER_ID,
            },
          }),
        );
        break;
      case 0:
        updatePresence(d.data || d);
        break;
      default:
        break;
    }
  });

  ws.addEventListener("close", () => {
    clearInterval(heartbeat);
    setTimeout(connectLanyard, 5000);
  });
}

connectLanyard();
