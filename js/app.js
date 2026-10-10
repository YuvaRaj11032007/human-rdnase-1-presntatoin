/**
 * Main Application Bootstrapper
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize presentation engine
  const engine = new PresentationEngine('stage-canvas');

  // 2. Initialize slide manager
  const slideManager = new SlideManager(engine);
  window.slideManager = slideManager;
  window.engine = engine;

  // Direct URL navigation (e.g. ?stage=7)
  const params = new URLSearchParams(window.location.search);
  const initialStage = parseInt(params.get('stage') || '1', 10);
  if (initialStage > 1 && initialStage <= SLIDES.length) {
    slideManager.goToSlide(initialStage - 1);
  }

  // 3. User interaction listener to resume audio context
  document.body.addEventListener('click', () => {
    if (window.soundEngine) {
      window.soundEngine.init();
    }
  }, { once: true });

  console.log('Cystic Fibrosis Interactive Presentation Engine Initialized.');
});
