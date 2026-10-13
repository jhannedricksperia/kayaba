// Imperative behaviour carried over from the Stitch design.
export default function init() {

  // Tactile bounce micro-interaction for forecast pills
  document.querySelectorAll('section').forEach(card => {
    card.addEventListener('pointerdown', () => {
      card.style.transform = 'scale(0.99)';
      card.style.transition = 'transform 100ms ease';
    });
    card.addEventListener('pointerup', () => {
      card.style.transform = 'scale(1)';
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = 'scale(1)';
    });
  });


}
