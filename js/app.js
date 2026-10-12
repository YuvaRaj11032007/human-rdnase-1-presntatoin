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

  // Direct URL navigation (e.g. ?stage=0 or ?stage=7)
  const params = new URLSearchParams(window.location.search);
  const stageParam = params.get('stage');
  if (stageParam !== null) {
    const targetStage = parseInt(stageParam, 10);
    if (!isNaN(targetStage) && targetStage >= 0 && targetStage < SLIDES.length) {
      slideManager.goToSlide(targetStage);
    }
  }

  // 3. User interaction listener to resume audio context
  document.body.addEventListener('click', () => {
    if (window.soundEngine) {
      window.soundEngine.init();
    }
  }, { once: true });

  console.log('Cystic Fibrosis Interactive Presentation Engine Initialized.');
});
