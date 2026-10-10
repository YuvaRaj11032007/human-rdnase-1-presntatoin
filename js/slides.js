/**
 * Presentation Slide State & Presenter Notes Controller
 * Updated with 7 Stages including the Genentech Discovery (Dr. Steven Shak & Dr. Art Levinson)
 */

const SLIDES = [
  {
    stage: 1,
    badge: "STAGE 01 / 12",
    title: "Hi Nanna Case Study: Autosomal Recessive Inheritance & Chromosome 7",
    speakerNotes: `
      <h4>Slide 1: Clinical Genetics & Hi Nanna Pedigree</h4>
      <p><strong>Clinical Case:</strong> In the film <em>Hi Nanna</em>, the child Mahi has Cystic Fibrosis (CF). Cystic Fibrosis is an autosomal recessive monogenic disease caused by mutations in the <em>CFTR</em> gene.</p>
      <ul>
        <li><strong>Carrier Parents:</strong> Both the father (Viraj / Nani) and the mother (Yashna / Mrunal) are carriers (heterozygotes, genotype <em>Cc</em>). Carriers produce enough functional CFTR channels from their normal allele to remain completely asymptomatic.</li>
        <li><strong>Chromosome 7q31.2:</strong> The CFTR gene resides on the long (q) arm of chromosome 7. Notice the submetacentric shape: short p-arm on top, and distinctly longer q-arm below.</li>
        <li><strong>25% Inheritance Risk:</strong> When both carrier parents transmit their mutated chromosome 7q allele (1 in 4 chance), the child inherits two mutated copies (genotype <em>cc</em>) and is clinically affected by Cystic Fibrosis.</li>
      </ul>
    `
  },
  {
    stage: 2,
    badge: "STAGE 02 / 12",
    title: "Macro Pulmonary Anatomy & CFTR Defect",
    speakerNotes: `
      <h4>Slide 2: Whole Lung Overview</h4>
      <p><strong>Clinical Focus:</strong> We begin at the macroscopic organ level. Cystic Fibrosis is an autosomal recessive genetic disease caused by mutations in the CFTR gene on chromosome 7.</p>
      <ul>
        <li>Although CF impacts multiple organs, over 85% of mortality stems from chronic lung disease.</li>
        <li>Notice the bronchial arborization. We will now physically zoom into the bronchial airway to observe how defective ion channels alter the airway surface liquid.</li>
      </ul>
    `
  },
  {
    stage: 3,
    badge: "STAGE 03 / 12",
    title: "Airway Lining: Ciliary Collapse & Thick Mucus",
    speakerNotes: `
      <h4>Slide 3: Airway Tissue & Mucociliary Dysfunction</h4>
      <p><strong>Cellular Level:</strong> Defective CFTR fails to secrete chloride and bicarbonate. Consequently, ENaC hyper-absorbs sodium, drawing water out of the airway surface liquid.</p>
      <ul>
        <li>The periciliary liquid layer collapses, physically matting and immobilizing the cilia.</li>
        <li>Goblet cells secrete concentrated mucins into an arid lumen, forming a thick, stagnant mucus blanket.</li>
      </ul>
    `
  },
  {
    stage: 4,
    badge: "STAGE 04 / 12",
    title: "Microbial Colonization: Pseudomonas Breeding Ground",
    speakerNotes: `
      <h4>Slide 4: Microbial Pathogens & Biofilms</h4>
      <p><strong>Microbiology:</strong> Because ciliated clearance has halted, the stagnant, warm, hypoxic mucus becomes an ideal incubator for opportunistic pathogens—most notably <em>Pseudomonas aeruginosa</em>.</p>
      <ul>
        <li>Bacteria proliferate rapidly and secrete protective alginate biofilms.</li>
        <li>This triggers intense chemotactic distress signals (IL-8), alerting the immune system.</li>
      </ul>
    `
  },
  {
    stage: 5,
    badge: "STAGE 05 / 12",
    title: "Immune Response: Blood Vessel to Mucus Diapedesis",
    speakerNotes: `
      <h4>Slide 5: Neutrophil Recruitment (Diapedesis)</h4>
      <p><strong>Vascular & Immune Interface:</strong> Watch how white blood cells (neutrophils) actively extravasate from the blood into the mucus membrane!</p>
      <ul>
        <li>Neutrophils flowing in the pulmonary capillary adhere to endothelial walls and squeeze through tight junctions (diapedesis).</li>
        <li>They crawl across the connective tissue and epithelial barrier, swarming directly into the thick mucus to attack the bacteria.</li>
      </ul>
    `
  },
  {
    stage: 6,
    badge: "STAGE 06 / 12",
    title: "Phagocytosis, Multiple WBC Death & DNA Mesh Formation",
    speakerNotes: `
      <h4>Slide 6: The Microscopic Battle, Phagocytosis & NETosis</h4>
      <p><strong>Cellular Combat:</strong> Once inside the mucus membrane, neutrophils extend pseudopodia to engulf (phagocytose) the bacteria.</p>
      <ul>
        <li><strong>Bacterial Toxicity:</strong> Confronted by high bacterial load, alginate biofilms, and toxins (pyocyanin, elastase), the neutrophils exhaust their metabolic reserves.</li>
        <li><strong>Multiple WBC Lysis:</strong> Multiple neutrophils undergo necrotic blebbing and membrane rupture in sequence.</li>
        <li><strong>DNA Mesh Eruption:</strong> The decondensed chromosomal DNA leaks out of each lysed neutrophil, stretching and cross-linking to form an expansive, sticky polymer mesh that entangles the remaining bacteria and turns the mucus hyper-viscous!</li>
      </ul>
    `
  },
  {
    stage: 7,
    badge: "STAGE 07 / 12",
    title: "Interactive Timeline: The Evolution of DNase Therapy (1950–1993)",
    speakerNotes: `
      <h4>Slide 7: Historical Timeline Hub</h4>
      <p><strong>Three Key Eras:</strong> Click on any of the 3 era circles to zoom directly into that milestone:</p>
      <ul>
        <li><strong>1950s (Early Precursor):</strong> Doctors first noticed an enzyme from cows (bovine pancreatic DNase) could thin CF sputum, but it was abandoned due to severe allergic reactions and lung irritation from inhaling animal proteins.</li>
        <li><strong>1988–1989 (The Breakthrough):</strong> Inspired by heart-attack clot-dissolvers, Dr. Steven Shak hypothesized that human DNase could dissolve mucus "DNA clots" without allergies. Working with Dr. Art Levinson, Genentech engineered high-expressing CHO cell lines.</li>
        <li><strong>1990–1993 (Trials to Approval):</strong> Phase I trials began in summer 1990. Following successful Phase III trials, the FDA officially approved Pulmozyme® on December 30, 1993.</li>
      </ul>
    `
  },
  {
    stage: 8,
    badge: "STAGE 08 / 12",
    title: "The 1950s Precursor: The Bovine Dead-End (Cow DNase Hazard)",
    speakerNotes: `
      <h4>Slide 8: 1950s Bovine Pancreatic DNase Hazard</h4>
      <p><strong>The Cow Experiment:</strong> In the 1950s, physicians first discovered that bovine pancreatic DNase could enzymatically degrade DNA polymers and thin out thick CF sputum.</p>
      <ul>
        <li><strong>The Fatal Flaw:</strong> Because the enzyme was harvested from slaughtered cow pancreases, it contained foreign bovine proteins and proteolytic impurities.</li>
        <li><strong>Severe Allergic Reactions:</strong> Patients inhaling the animal enzyme developed acute bronchospasm, severe lung irritation, and life-threatening anaphylactoid reactions.</li>
        <li><strong>Abandoned for Decades:</strong> The approach was discarded for over 30 years—proving that humans cannot safely inhale foreign animal proteins!</li>
      </ul>
    `
  },
  {
    stage: 9,
    badge: "STAGE 09 / 12",
    title: "1988–1989: The Genentech Breakthrough (Dr. Shak & Dr. Levinson)",
    speakerNotes: `
      <h4>Slide 9: The Recombinant Revolution at Genentech</h4>
      <p><strong>Cloning Human DNase:</strong> In 1988–1989, Dr. Steven Shak revitalized the concept using modern biotechnology.</p>
      <ul>
        <li><strong>The Vision:</strong> Inspired by Genentech's tissue plasminogen activator (tPA) for dissolving blood clots, Dr. Shak realized CF sputum was held together by "clots" of DNA polymers that pure human DNase could cleave without animal allergies.</li>
        <li><strong>Dr. Art Levinson's Cell Line:</strong> Dr. Levinson engineered the high-expressing mammalian CHO-K1 cell line needed to express and glycosylate human DNase 1 at massive commercial purity.</li>
        <li><strong>Test Tube Liquefaction:</strong> Adding drops of recombinant human DNase instantly thinned purulent CF sputum from 12,000 cP down to 15 cP!</li>
      </ul>
    `
  },
  {
    stage: 10,
    badge: "STAGE 10 / 12",
    title: "1990–1993: Clinical Trials to FDA Approval (Pulmozyme®)",
    speakerNotes: `
      <h4>Slide 10: Clinical Trials & FDA Commercial Approval</h4>
      <p><strong>From Laboratory Bench to Patients:</strong> Rigorous clinical testing rapidly proved the power of dornase alfa:</p>
      <ul>
        <li><strong>Summer 1990 (Phase I Trials):</strong> Proved that inhaled human recombinant DNase 1 was completely non-immunogenic, safe, and highly effective at thinning secretions in CF patients.</li>
        <li><strong>1992–1993 (Phase III Trials):</strong> Multi-center trials with 968 CF patients showed a 28% reduction in respiratory tract infections and sustained improvement in lung function (FEV1).</li>
        <li><strong>December 30, 1993 (FDA Approval):</strong> The FDA officially approved Pulmozyme® (dornase alfa), making it the first recombinant therapeutic specifically approved for Cystic Fibrosis in history!</li>
      </ul>
    `
  },
  {
    stage: 11,
    badge: "STAGE 11 / 12",
    title: "Molecular Action: rhDNase 1 Cleaving & Lysing the DNA Mesh",
    speakerNotes: `
      <h4>Slide 11: Molecular Enzymatic Cleavage of Extracellular DNA</h4>
      <p><strong>Mechanism of Action:</strong> In purulent CF sputum, high-molecular-weight extracellular DNA (eDNA) released from dying neutrophils forms a rigid, viscoelastic gel matrix that traps mucus and bacteria.</p>
      <ul>
        <li><strong>Endonuclease Precision:</strong> Recombinant human DNase 1 (dornase alfa, 37 kDa) diffuses into the thick sputum. Its catalytic active site coordinates essential <strong>Ca²⁺</strong> (structural stability) and <strong>Mg²⁺</strong> ions (activating water molecules for nucleophilic hydrolytic attack).</li>
        <li><strong>Phosphodiester Hydrolysis:</strong> rhDNase 1 cleaves phosphodiester backbones internally within double-stranded DNA, producing 3'-hydroxyl and 5'-phosphoryl oligonucleotides.</li>
        <li><strong>Mesh Dissolution:</strong> Enormous genomic strands exceeding <strong>100,000 base pairs</strong> are rapidly snipped into tiny soluble fragments under <strong>100 base pairs</strong>. The cross-linked lattice disintegrates, relieving gel tension and freeing entrapped <em>Pseudomonas aeruginosa</em>!</li>
      </ul>
    `
  },
  {
    stage: 12,
    badge: "STAGE 12 / 12",
    title: "Physiological Rescue: Sputum Liquefaction & Mucociliary Clearance",
    speakerNotes: `
      <h4>Slide 12: Airway Healing & Mucociliary Transport Recovery</h4>
      <p><strong>Clinical & Physiological Reversal:</strong> Once the rigid DNA skeleton is dissolved, the mechanical properties of the airway surface liquid are dramatically restored.</p>
      <ul>
        <li><strong>800-Fold Viscosity Plunge:</strong> Sputum viscoelasticity drops precipitously from over <strong>12,000 cP</strong> (thick gelatinous sludge) down to <strong>15 cP</strong> (flowing watery sol layer).</li>
        <li><strong>Cilia Reactivation:</strong> Released from the crushing weight of the stagnant gel blanket, bronchial cilia stand upright and resume high-frequency metachronal beating (12–15 Hz), driving the mucociliary escalator.</li>
        <li><strong>Airway Clearance & FEV₁ Gains:</strong> Mucus plugs are easily cleared upward toward the pharynx by gentle coughing or normal airflow. Bronchial lumens reopen, restoring dynamic airflow and elevating FEV₁ by ~15.8% while cutting pulmonary exacerbations by 37%!</li>
      </ul>
    `
  }
];

class SlideManager {
  constructor(engine) {
    this.engine = engine;
    this.currentIndex = 0;
    this.autoplayInterval = null;

    this.cacheDom();
    this.bindEvents();
    this.renderDots();
    this.updateUI();
  }

  cacheDom() {
    this.deckStageBadge = document.getElementById('deck-stage-badge');
    this.deckTitle = document.getElementById('deck-title');
    this.dotsContainer = document.getElementById('slide-dots');
    this.speakerNotesContent = document.getElementById('speaker-notes-content');
    this.speakerNotesDrawer = document.getElementById('speaker-notes-drawer');
    this.btnPrev = document.getElementById('btn-prev');
    this.btnNext = document.getElementById('btn-next');
    this.btnZoomOut = document.getElementById('btn-zoomout');
    this.btnAutoplay = document.getElementById('btn-autoplay');
    this.btnReset = document.getElementById('btn-reset');
    this.labelsToggleBtn = document.getElementById('labels-toggle-btn');
    this.notesToggleBtn = document.getElementById('notes-toggle-btn');
    this.closeNotesBtn = document.getElementById('close-notes-btn');
    this.soundToggleBtn = document.getElementById('sound-toggle-btn');
    this.fullscreenBtn = document.getElementById('fullscreen-btn');
  }

  bindEvents() {
    if (this.btnPrev) this.btnPrev.addEventListener('click', () => this.prevSlide());
    if (this.btnNext) this.btnNext.addEventListener('click', () => this.nextSlide());
    if (this.btnReset) this.btnReset.addEventListener('click', () => this.goToSlide(0));

    if (this.labelsToggleBtn) {
      this.labelsToggleBtn.addEventListener('click', () => {
        this.engine.showLabels = !this.engine.showLabels;
        this.labelsToggleBtn.classList.toggle('active', this.engine.showLabels);
      });
    }

    if (this.btnZoomOut) {
      this.btnZoomOut.addEventListener('click', () => {
        this.engine.triggerNaturalZoomOut();
      });
    }

    if (this.btnAutoplay) this.btnAutoplay.addEventListener('click', () => this.toggleAutoplay());
    if (this.notesToggleBtn) this.notesToggleBtn.addEventListener('click', () => this.toggleNotes());
    if (this.closeNotesBtn) this.closeNotesBtn.addEventListener('click', () => this.toggleNotes(false));

    if (this.soundToggleBtn) {
      this.soundToggleBtn.addEventListener('click', () => {
        const enabled = window.soundEngine.toggle();
        const onIcon = document.getElementById('sound-on-icon');
        const offIcon = document.getElementById('sound-off-icon');
        if (onIcon) onIcon.style.display = enabled ? 'inline' : 'none';
        if (offIcon) offIcon.style.display = enabled ? 'none' : 'inline';
      });
    }

    this.fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        this.nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        this.prevSlide();
      } else if (e.key.toLowerCase() === 'z') {
        this.engine.triggerNaturalZoomOut();
      } else if (e.key.toLowerCase() === 'l') {
        if (this.labelsToggleBtn) this.labelsToggleBtn.click();
      } else if (e.key.toLowerCase() === 'n') {
        this.toggleNotes();
      } else if (e.key.toLowerCase() === 'm') {
        this.soundToggleBtn.click();
      } else if (e.key.toLowerCase() === 'f') {
        this.fullscreenBtn.click();
      } else if (e.key.toLowerCase() === 'r') {
        this.goToSlide(0);
      }
    });
  }

  renderDots() {
    this.dotsContainer.innerHTML = '';
    SLIDES.forEach((s, idx) => {
      const dot = document.createElement('div');
      dot.className = `slide-dot ${idx === this.currentIndex ? 'active' : ''}`;
      dot.title = `Stage ${s.stage}: ${s.title}`;
      dot.addEventListener('click', () => this.goToSlide(idx));
      this.dotsContainer.appendChild(dot);
    });
  }

  syncSlideIndex(newIndex) {
    if (newIndex >= 0 && newIndex < SLIDES.length) {
      this.currentIndex = newIndex;
      const s = SLIDES[this.currentIndex];
      if (this.deckStageBadge) this.deckStageBadge.textContent = s.badge;
      if (this.deckTitle) this.deckTitle.textContent = s.title;
      if (this.speakerNotesContent) this.speakerNotesContent.innerHTML = s.speakerNotes;
      if (this.btnPrev) this.btnPrev.disabled = (this.currentIndex === 0);
      if (this.btnNext) this.btnNext.disabled = (this.currentIndex === SLIDES.length - 1);
      if (this.dotsContainer) {
        const dots = this.dotsContainer.querySelectorAll('.slide-dot');
        dots.forEach((d, idx) => {
          d.classList.toggle('active', idx === this.currentIndex);
        });
      }
    }
  }

  updateUI() {
    const s = SLIDES[this.currentIndex];
    if (this.deckStageBadge) this.deckStageBadge.textContent = s.badge;
    if (this.deckTitle) this.deckTitle.textContent = s.title;
    if (this.speakerNotesContent) this.speakerNotesContent.innerHTML = s.speakerNotes;

    if (this.btnPrev) this.btnPrev.disabled = (this.currentIndex === 0);
    if (this.btnNext) this.btnNext.disabled = (this.currentIndex === SLIDES.length - 1);

    if (this.dotsContainer) {
      const dots = this.dotsContainer.querySelectorAll('.slide-dot');
      dots.forEach((d, idx) => {
        d.classList.toggle('active', idx === this.currentIndex);
      });
    }

    this.engine.setStage(s.stage);
  }

  goToSlide(index) {
    if (index >= 0 && index < SLIDES.length) {
      this.currentIndex = index;
      if (window.soundEngine) window.soundEngine.playClick();
      this.updateUI();
    }
  }

  nextSlide() {
    if (this.currentIndex === 0 && this.engine && this.engine.currentStage === 1) {
      if (this.engine.geneticsStep === 0) {
        this.engine.triggerGeneticsAnimation();
        return;
      }
      if (this.engine.geneticsAnimProgress < 0.95) {
        this.engine.geneticsAnimProgress = 1.0;
        return;
      }
    }
    if (this.currentIndex < SLIDES.length - 1) {
      this.goToSlide(this.currentIndex + 1);
    }
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.goToSlide(this.currentIndex - 1);
    }
  }

  toggleNotes(forceState = null) {
    if (forceState !== null) {
      this.speakerNotesDrawer.classList.toggle('open', forceState);
    } else {
      this.speakerNotesDrawer.classList.toggle('open');
    }
  }

  toggleAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
      this.btnAutoplay.classList.remove('active');
      document.getElementById('autoplay-text').textContent = 'Auto Play';
    } else {
      this.btnAutoplay.classList.add('active');
      document.getElementById('autoplay-text').textContent = 'Pause Auto';
      this.autoplayInterval = setInterval(() => {
        if (this.currentIndex < SLIDES.length - 1) {
          this.nextSlide();
        } else {
          this.goToSlide(0);
        }
      }, 7500);
    }
  }
}
