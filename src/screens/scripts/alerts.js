// Imperative behaviour carried over from the Stitch design.
export default function init() {

  // Filter tab interactions
  function filterAlerts(category, targetBtn) {
    const tabs = document.querySelectorAll('.filter-tab');
    tabs.forEach(t => {
      t.classList.remove('bg-primary', 'text-on-primary');
      t.classList.add('bg-surface-container-high', 'text-on-surface-variant');
    });
    targetBtn.classList.remove('bg-surface-container-high', 'text-on-surface-variant');
    targetBtn.classList.add('bg-primary', 'text-on-primary');

    const cards = document.querySelectorAll('.alert-item');
    cards.forEach(card => {
      if (category === 'all' || card.getAttribute('data-category') === category) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // Siren Audio Preview toggle
  let isPlayingSiren = false;
  function toggleSirenPreview() {
    const voiceBar = document.getElementById('voicePlayerBar');
    const sirenBtn = document.getElementById('sirenBtn');
    const sirenIcon = document.getElementById('sirenIcon');

    isPlayingSiren = !isPlayingSiren;
    if (isPlayingSiren) {
      voiceBar.classList.remove('hidden');
      sirenIcon.textContent = 'pause_circle';
      sirenIcon.classList.add('animate-spin');
    } else {
      voiceBar.classList.add('hidden');
      sirenIcon.textContent = 'volume_up';
      sirenIcon.classList.remove('animate-spin');
    }
  }

  // Crowdsource Modal Triggers
  function openReportModal() {
    document.getElementById('reportModal').classList.remove('hidden');
  }

  function closeReportModal() {
    document.getElementById('reportModal').classList.add('hidden');
  }

  function selectDepth(btn) {
    document.querySelectorAll('.depth-btn').forEach(b => {
      b.classList.remove('bg-secondary-fixed');
      b.classList.add('bg-surface-container');
    });
    btn.classList.remove('bg-surface-container');
    btn.classList.add('bg-secondary-fixed');
  }

  function submitReport() {
    closeReportModal();
    alert('Salamat! Your flood report was verified and broadcasted to España, Manila neighbors.');
  }

window.filterAlerts = filterAlerts;
window.toggleSirenPreview = toggleSirenPreview;
window.openReportModal = openReportModal;
window.closeReportModal = closeReportModal;
window.selectDepth = selectDepth;
window.submitReport = submitReport;
}
