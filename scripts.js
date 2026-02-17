const colors = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
  "#a855f7",
];

const exploreBtn = document.getElementById("explore-btn");
const createBtn = document.getElementById("createBtn");
const spinBtn = document.getElementById("spinBtn");

const featuresSection = document.getElementById("features");
const wheelSection = document.getElementById("wheelSection");
const resultElement = document.getElementById("result");

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

// initial
let options = [];
let currentAngle = 0;
let spinning = false;

exploreBtn.addEventListener("click", () => {
  featuresSection.scrollIntoView({ behavior: "smooth" });
});

createBtn.addEventListener("click", createWheel);
spinBtn.addEventListener("click", spinWheel);

function createWheel() {
  const input = document.getElementById("optionsInput").value.trim();

  if (!input) return;

  options = input
    .split(/[\n,]+/)
    .map((opt) => opt.trim())
    .filter((opt) => opt !== "");

  if (!wheelSection.classList.contains("active")) {
    wheelSection.classList.add("active");
    wheelSection.scrollIntoView({ behavior: "smooth" });
  }

  currentAngle = 0;
  resultElement.textContent = "";
  drawWheel();
}

function drawWheel() {
  const radius = canvas.width / 2;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (options.length === 0) return;

  const sliceAngle = (2 * Math.PI) / options.length;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(currentAngle);

  options.forEach((option, index) => {
    const startAngle = index * sliceAngle;
    const endAngle = startAngle + sliceAngle;

    ctx.fillStyle = colors[index % colors.length];

    // Draw slice
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fill();

    // Text
    ctx.save();
    ctx.rotate(startAngle + sliceAngle / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px 'Plus Jakarta Sans'";
    ctx.fillText(option, radius - 20, 5);
    ctx.restore();
  });

  ctx.restore();

  // Center circle
}

function spinWheel() {
  if (spinning || options.length === 0) return;

  spinning = true;

  const spinTime = 4000; // 4 seconds
  const start = performance.now();

  const extraSpins = Math.floor(Math.random() * 3) + 5;
  const randomAngle = Math.random() * 2 * Math.PI;

  const totalRotation = extraSpins * 2 * Math.PI + randomAngle;

  const startAngle = currentAngle;

  function animate(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / spinTime, 1);

    // ease-out cubic
    const easeOut = 1 - Math.pow(1 - progress, 3);

    currentAngle = startAngle + totalRotation * easeOut;

    drawWheel();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      finalizeResult();
      spinning = false;
    }
  }

  requestAnimationFrame(animate);
}

function finalizeResult() {
  const sliceAngle = (2 * Math.PI) / options.length;

  // Normalize angle between 0 → 2π
  let normalized = currentAngle % (2 * Math.PI);

  if (normalized < 0) normalized += 2 * Math.PI;

  // Because pointer is at top (−90deg shift)
  const pointerAngle = (3 * Math.PI) / 2;

  const adjustedAngle =
    (pointerAngle - normalized + 2 * Math.PI) % (2 * Math.PI);

  const index = Math.floor(adjustedAngle / sliceAngle);

  const winner = options[index];

  resultElement.textContent = `Winner: ${winner}`;
}
