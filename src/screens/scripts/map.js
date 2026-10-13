// Imperative behaviour carried over from the Stitch design.
export default function init() {

    // Layer Chip Active State Toggle
    document.querySelectorAll('.layer-chip').forEach(button => {
      button.addEventListener('click', () => {
        document.querySelectorAll('.layer-chip').forEach(b => {
          b.classList.remove('bg-secondary-container', 'text-primary', 'shadow-[0_4px_12px_rgba(0,227,253,0.35)]');
          b.classList.add('bg-surface-container-lowest', 'text-on-surface-variant', 'shadow-sm');
        });
        button.classList.remove('bg-surface-container-lowest', 'text-on-surface-variant', 'shadow-sm');
        button.classList.add('bg-secondary-container', 'text-primary', 'shadow-[0_4px_12px_rgba(0,227,253,0.35)]');
      });
    });

    // Time Projection Step Interaction
    document.querySelectorAll('.timeline-step').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.timeline-step').forEach(b => {
          b.classList.remove('bg-primary-container', 'text-secondary-container');
          b.classList.add('bg-surface-container', 'text-primary');
        });
        btn.classList.remove('bg-surface-container', 'text-primary');
        btn.classList.add('bg-primary-container', 'text-secondary-container');
      });
    });

    // Recenter GPS Button micro bounce
    const recenterBtn = document.getElementById('recenter-btn');
    if (recenterBtn) {
      recenterBtn.addEventListener('click', () => {
        recenterBtn.classList.add('scale-75');
        setTimeout(() => recenterBtn.classList.remove('scale-75'), 200);
      });
    }
  

}
