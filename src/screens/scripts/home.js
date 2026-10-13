// Imperative behaviour carried over from the Stitch design, plus a hook for live depth.
const BADGES = {
  safe: {
    cls: 'flex items-center gap-1.5 bg-surface-container-lowest text-primary px-3.5 py-1 rounded-full shadow-[0_4px_12px_rgba(0,227,253,0.25)]',
    html: '<span class="material-symbols-outlined text-secondary text-[18px]">verified</span><span class="font-label-badge text-label-badge text-primary">Kaya pa!</span>',
  },
  caution: {
    cls: 'flex items-center gap-1.5 bg-surface-container-low text-primary px-3.5 py-1 rounded-full shadow-[0_4px_12px_rgba(0,227,253,0.2)]',
    html: '<span class="material-symbols-outlined text-secondary text-[18px]">warning</span><span class="font-label-badge text-label-badge text-primary">Ingat!</span>',
  },
  danger: {
    cls: 'flex items-center gap-1.5 bg-primary text-secondary-container px-3.5 py-1 rounded-full shadow-[0_6px_16px_rgba(15,43,72,0.35)]',
    html: '<span class="material-symbols-outlined text-secondary-container text-[18px]">emergency</span><span class="font-label-badge text-label-badge text-secondary-container font-bold">Hindi na kaya!</span>',
  },
};
const ACTIVE = ['bg-secondary-container', 'text-primary', 'shadow-[0_4px_12px_rgba(0,227,253,0.35)]', 'font-bold'];
const IDLE = ['bg-surface-container', 'text-on-surface-variant'];

function render(depth, badgeType, sub) {
  const depthNumber = document.getElementById('depth-number');
  const depthSubtext = document.getElementById('depth-subtext');
  const statusBadge = document.getElementById('status-badge');
  const gaugeFillBar = document.getElementById('gauge-fill-bar');
  if (depthNumber) depthNumber.textContent = depth.toFixed(1);
  if (depthSubtext) depthSubtext.textContent = sub;
  if (gaugeFillBar) gaugeFillBar.style.height = Math.min(100, Math.round((depth / 2.0) * 100)) + '%';
  if (statusBadge) {
    const b = BADGES[badgeType];
    statusBadge.className = b.cls;
    statusBadge.innerHTML = b.html;
  }
  window.__lastDepth = depth;
  if (window.__setFloodLevel) window.__setFloodLevel(depth);
}

export default function init() {
  const stageButtons = document.querySelectorAll('.stage-btn');
  stageButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      stageButtons.forEach((b) => {
        b.classList.remove(...ACTIVE);
        b.classList.add(...IDLE);
      });
      btn.classList.remove(...IDLE);
      btn.classList.add(...ACTIVE);
      render(parseFloat(btn.getAttribute('data-depth')), btn.getAttribute('data-badge'), btn.getAttribute('data-sub'));
    });
  });

  // Called by React whenever the live forecast changes.
  window.__applyLiveDepth = (depth, badgeType, sub) => {
    stageButtons.forEach((b) => {
      b.classList.remove(...ACTIVE);
      b.classList.add(...IDLE);
    });
    render(depth, badgeType, sub);
  };

  const timeTabs = document.querySelectorAll('.time-tab-btn');
  timeTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      timeTabs.forEach((t) => {
        t.classList.remove('bg-primary', 'text-on-primary', 'shadow-sm');
        t.classList.add('bg-surface-container', 'text-on-surface-variant');
      });
      tab.classList.remove('bg-surface-container', 'text-on-surface-variant');
      tab.classList.add('bg-primary', 'text-on-primary', 'shadow-sm');
    });
  });
}
