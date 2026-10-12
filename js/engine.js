/**
 * Presentation Canvas Engine - Natural Cinematic Optical Zoom Engine
 * Features:
 * - Macro Lungs with breathing motion (Stage 1)
 * - Airway lining with matted cilia, goblet cells, thick mucus (Stage 2)
 * - Bacterial proliferation: Pseudomonas (Stage 3)
 * - Blood vessel diapedesis: neutrophils exiting capillary into mucus (Stage 4)
 * - The Fight: WBCs phagocytosis -> multiple WBC deaths -> DNA mesh (Stage 5)
 * - The Dilemma: Biophysical Occlusion & Need for an Enzyme (Stage 6)
 * - Stage 7: Animated High-Fidelity Historical Lab Scene of Dr. Steven Shak & Dr. Art Levinson
 *   in their exact archival poses with authentic 1980s lab equipment, live pipetting liquefaction,
 *   spinning CHO cell bioreactor, and CRT chromatography monitor.
 */

class PresentationEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');

    this.width = 1600;
    this.height = 900;
    this.dpr = window.devicePixelRatio || 1;

    this.time = 0;
    this.lastTimestamp = 0;
    this.isPaused = false;
    this.showLabels = true;

    this.currentStage = 1;
    this.targetStage = 1;

    // Transition state
    this.transition = {
      active: false,
      fromStage: 1,
      toStage: 1,
      progress: 0,
      duration: 1.15,
      direction: 1
    };

    // Continuous Multi-Step Zoom Out sequence
    this.zoomOutSequence = {
      active: false,
      currentStep: 10
    };

    // Stage 1 Hi Nanna Genetics Case Study State & Images
    this.geneticsStep = 0; // 0 = initial (parents shown), 1 = triggered (arrows, chromosomes, child)
    this.geneticsAnimProgress = 0; // 0.0 to 1.0
    this.replayBtnHovered = false;
    this.fatherImg = new Image();
    this.fatherImg.src = 'images/father_square.jpg';
    this.motherImg = new Image();
    this.motherImg.src = 'images/mother_square.jpg';
    this.childImg = new Image();
    this.childImg.src = 'images/child_square.jpg';

    // Stage 6 Battle & Multi-WBC Lysis Simulation
    this.battleTimer = 0;

    // Stage 7 Timeline Navigation & Interactive Nodes
    this.hoveredTimelineNode = null;
    this.backButtonHovered = false;
    this.mouse = { x: 0, y: 0 };
    this.timelineNodes = [
      {
        id: '1950s',
        year: '1950s',
        eraLabel: 'EARLY PRECURSOR',
        title: 'Bovine Pancreatic DNase',
        desc: 'Doctors observed cow enzymes thinned CF mucus, but severe animal-protein allergies and lung irritation forced abandonment.',
        x: -330,
        y: 10,
        radius: 46,
        slideIndex: 7, // Stage 8 (0-indexed 7)
        color: '#D97706',
        accentBg: '#FEF3C7',
        badgeColor: '#B45309',
        statusTag: '❌ Abandoned (Allergic Bronchospasm)'
      },
      {
        id: '1988',
        year: '1988–1989',
        eraLabel: 'THE BREAKTHROUGH',
        title: 'Genentech Recombinant Human DNase',
        desc: 'Dr. Shak & Dr. Levinson cloned human DNase 1 in high-yield CHO cells to dissolve mucus DNA clots safely.',
        x: 0,
        y: 10,
        radius: 46,
        slideIndex: 8, // Stage 9 (0-indexed 8)
        color: '#0284C7',
        accentBg: '#E0F2FE',
        badgeColor: '#0369A1',
        statusTag: '⚡ Cloned in CHO-K1 Cell Line'
      },
      {
        id: '1990',
        year: '1990–1993',
        eraLabel: 'TRIALS TO APPROVAL',
        title: 'Clinical Trials & FDA Approval',
        desc: 'Phase I (1990) proved safety; Phase III showed +15.8% FEV₁; FDA approved Pulmozyme® on Dec 30, 1993.',
        x: 330,
        y: 10,
        radius: 46,
        slideIndex: 9, // Stage 10 (0-indexed 9)
        color: '#059669',
        accentBg: '#D1FAE5',
        badgeColor: '#047857',
        statusTag: '⭐ FDA Approved: Pulmozyme®'
      }
    ];

    // Stage 9 Lab Simulation & Archival Photographs
    this.labDropProgress = 0;
    this.liquefactionProgress = 0;
    this.shakFaceImg = new Image();
    this.shakFaceImg.src = 'images/shak_face.jpg';
    this.levinsonFaceImg = new Image();
    this.levinsonFaceImg.src = 'images/levinson_face.jpg';

    this.initSimulationData();
    this.initEvents();
    this.handleResize();
    requestAnimationFrame((t) => this.loop(t));
  }

  initSimulationData() {
    // 1. Stage 3 Bacteria in Mucus
    this.bacteria = [];
    for (let i = 0; i < 26; i++) {
      this.bacteria.push({
        x: (Math.random() - 0.5) * 550,
        y: (Math.random() - 0.5) * 240,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.3,
        angle: Math.random() * Math.PI * 2,
        length: 22 + Math.random() * 8,
        width: 9,
        phase: Math.random() * Math.PI * 2,
        isDividing: Math.random() < 0.28,
        constriction: 0.3 + Math.random() * 0.5
      });
    }

    // 2. Stage 4 Red Blood Cells in Capillary
    this.redBloodCells = [];
    for (let i = 0; i < 24; i++) {
      this.redBloodCells.push({
        x: -400 + i * 36,
        y: 155 + (Math.random() - 0.5) * 14,
        speed: 1.6 + Math.random() * 0.6,
        radius: 8.5
      });
    }

    // 3. Stage 4 Neutrophils migrating from blood into mucus (Diapedesis)
    this.migratingWbcs = [];
    for (let i = 0; i < 8; i++) {
      this.migratingWbcs.push({
        id: i,
        progress: (i / 8),
        speed: 0.05 + Math.random() * 0.02,
        wobble: Math.random() * Math.PI * 2,
        size: 14
      });
    }

    // 4. Stage 5 Combatants
    this.initBattleData();

    // 5. Stage 7 Bioreactor CHO Cell Suspension Particles
    this.choCells = [];
    for (let i = 0; i < 22; i++) {
      this.choCells.push({
        x: 180 + (Math.random() - 0.5) * 32,
        y: 68 + (Math.random() - 0.5) * 28,
        radius: 2.2 + Math.random() * 1.4,
        phase: Math.random() * Math.PI * 2,
        vy: -0.15 - Math.random() * 0.25
      });
    }

    // 6. Stage 11 Clinical Nebulizer, Stage 12 Molecular Lysis & Stage 13 Airway Clearance
    this.initStage11NebulizerData();
    this.initStage12LysisData();
    this.initStage13ClearanceData();

    // 7. Commercial Synthesis & Bioprocessing (Stages 14-17)
    this.initStage14PastVsPresent();
    this.initStage15HostOrganismCho();
    this.initStage16BioreactorProcess();
    this.initStage17DownstreamPurification();
  }

  initBattleData() {
    this.battleTimer = 0;

    this.battleWbcs = [
      {
        id: 1,
        x: -140,
        y: -40,
        targetX: -110,
        targetY: -30,
        size: 36,
        state: 'fighting',
        engulfedCount: 0,
        deathTime: 3.2,
        dnaStrands: this.generateDnaStrandsForCell(16),
        engulfingArmAngle: 0.2
      },
      {
        id: 2,
        x: 130,
        y: -30,
        targetX: 100,
        targetY: -20,
        size: 38,
        state: 'fighting',
        engulfedCount: 0,
        deathTime: 4.0,
        dnaStrands: this.generateDnaStrandsForCell(16),
        engulfingArmAngle: -0.4
      },
      {
        id: 3,
        x: -30,
        y: 70,
        targetX: -10,
        targetY: 60,
        size: 35,
        state: 'fighting',
        engulfedCount: 0,
        deathTime: 4.8,
        dnaStrands: this.generateDnaStrandsForCell(16),
        engulfingArmAngle: 1.1
      },
      {
        id: 4,
        x: 50,
        y: -100,
        targetX: 40,
        targetY: -90,
        size: 34,
        state: 'fighting',
        engulfedCount: 0,
        deathTime: 5.4,
        dnaStrands: this.generateDnaStrandsForCell(16),
        engulfingArmAngle: -1.2
      }
    ];

    this.battleBacteria = [
      { id: 1, x: -180, y: -45, targetWbc: 1, status: 'alive', engulfProgress: 0, angle: 0.3 },
      { id: 2, x: -110, y: -80, targetWbc: 1, status: 'alive', engulfProgress: 0, angle: -0.5 },
      { id: 3, x: 180, y: -35, targetWbc: 2, status: 'alive', engulfProgress: 0, angle: 0.8 },
      { id: 4, x: 110, y: 20, targetWbc: 2, status: 'alive', engulfProgress: 0, angle: -0.2 },
      { id: 5, x: -80, y: 85, targetWbc: 3, status: 'alive', engulfProgress: 0, angle: 1.4 },
      { id: 6, x: 20, y: 110, targetWbc: 3, status: 'alive', engulfProgress: 0, angle: -0.9 },
      { id: 7, x: -240, y: 30, targetWbc: null, status: 'alive', engulfProgress: 0, angle: 0.1 },
      { id: 8, x: 230, y: 70, targetWbc: null, status: 'alive', engulfProgress: 0, angle: -0.4 },
      { id: 9, x: -30, y: -145, targetWbc: null, status: 'alive', engulfProgress: 0, angle: 0.6 },
      { id: 10, x: 200, y: -110, targetWbc: null, status: 'alive', engulfProgress: 0, angle: -1.1 }
    ];

    this.sparks = [];
    for (let i = 0; i < 35; i++) {
      this.sparks.push({
        x: (Math.random() - 0.5) * 350,
        y: (Math.random() - 0.5) * 220,
        vx: (Math.random() - 0.5) * 2.0,
        vy: (Math.random() - 0.5) * 2.0,
        alpha: Math.random(),
        color: Math.random() > 0.5 ? '#F59E0B' : '#EC4899'
      });
    }
  }

  generateDnaStrandsForCell(numStrands) {
    const strands = [];
    for (let i = 0; i < numStrands; i++) {
      const baseAngle = (i / numStrands) * Math.PI * 2;
      const points = [];
      let cx = 0;
      let cy = 0;
      const numPts = 12;
      for (let p = 0; p < numPts; p++) {
        const step = 14 + Math.random() * 8;
        const angle = baseAngle + Math.sin(p * 1.3) * 0.4 + (Math.random() - 0.5) * 0.2;
        cx += Math.cos(angle) * step;
        cy += Math.sin(angle) * step;
        points.push({ x: cx, y: cy });
      }
      strands.push({
        angle: baseAngle,
        points: points,
        expansion: 0
      });
    }
    return strands;
  }

  triggerGeneticsAnimation() {
    this.geneticsStep = 1;
    this.geneticsAnimProgress = 0;
    if (window.soundEngine) window.soundEngine.playZoom(true);
  }

  initEvents() {
    window.addEventListener('resize', () => this.handleResize());

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left - (this.width / 2);
      const my = e.clientY - rect.top - (this.height / 2);
      this.mouse = { x: mx, y: my };

      if (this.currentStage === 7 && !this.transition.active) {
        let hoveredIdx = null;
        for (let i = 0; i < this.timelineNodes.length; i++) {
          const node = this.timelineNodes[i];
          const dist = Math.hypot(mx - node.x, my - node.y);
          const inCard = (mx >= node.x - 145 && mx <= node.x + 145 && my >= node.y + 65 && my <= node.y + 225);
          if (dist <= node.radius + 12 || inCard) {
            hoveredIdx = i;
            break;
          }
        }
        this.hoveredTimelineNode = hoveredIdx;
        this.canvas.style.cursor = 'pointer';
      } else if ((this.currentStage === 8 || this.currentStage === 9 || this.currentStage === 10) && !this.transition.active) {
        const inBtn = (mx >= -455 && mx <= -290 && my >= -242 && my <= -204);
        this.backButtonHovered = inBtn;
        this.canvas.style.cursor = 'pointer';
      } else {
        this.hoveredTimelineNode = null;
        this.backButtonHovered = false;
        this.replayBtnHovered = false;
        this.canvas.style.cursor = 'pointer';
      }
    });

    const handleSlideAdvanceClick = (e) => {
      if (this.zoomOutSequence.active) return;

      // If a transition is currently animating, complete it immediately so user clicks are snappy
      if (this.transition.active) {
        this.transition.progress = 1.0;
        this.transition.active = false;
        this.currentStage = this.transition.toStage;
      }

      const rect = this.canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left - (this.width / 2);
      const my = e.clientY - rect.top - (this.height / 2);

      // 1. Stage 1 Hi Nanna Genetics Interactivity:
      // First click reveals inheritance trace; subsequent click advances to Slide 2
      if (this.currentStage === 1) {
        if (this.geneticsStep === 0) {
          this.triggerGeneticsAnimation();
          return;
        }
        if (this.geneticsAnimProgress < 0.95) {
          // If clicked while animating, fast-forward to full reveal immediately
          this.geneticsAnimProgress = 1.0;
          return;
        }
        if (window.soundEngine) window.soundEngine.playClick();
        if (window.slideManager) {
          window.slideManager.goToSlide(1); // Advance to Stage 2
        }
        return;
      }

      // 2. Stage 7 Timeline Node Clicking (Optical Zoom to specific era)
      if (this.currentStage === 7) {
        for (let i = 0; i < this.timelineNodes.length; i++) {
          const node = this.timelineNodes[i];
          const dist = Math.hypot(mx - node.x, my - node.y);
          const inCard = (mx >= node.x - 145 && mx <= node.x + 145 && my >= node.y + 65 && my <= node.y + 225);
          if (dist <= node.radius + 12 || inCard) {
            if (window.soundEngine) window.soundEngine.playClick();
            if (window.slideManager) {
              window.slideManager.goToSlide(node.slideIndex);
            }
            return;
          }
        }
      }

      // 3. Stages 8, 9, 10 Back to Timeline Button
      if (this.currentStage === 8 || this.currentStage === 9 || this.currentStage === 10) {
        const inBtn = (mx >= -455 && mx <= -290 && my >= -242 && my <= -204);
        if (inBtn) {
          if (window.soundEngine) window.soundEngine.playClick();
          if (window.slideManager) {
            window.slideManager.goToSlide(6); // Stage 7 Timeline Hub is slide index 6
          }
          return;
        }
      }

      // 4. Stage 11 Inhale Aerosolized rhDNase 1 Button
      if (this.currentStage === 11) {
        const inNebBtn = (mx >= 190 && mx <= 460 && my >= -242 && my <= -204);
        if (inNebBtn) {
          this.triggerNebulizerPulse();
          return;
        }
      }

      // 5. Regular slide advancement: Clicking anywhere on the slide goes to next slide
      if (window.soundEngine) window.soundEngine.playClick();
      if (window.slideManager) {
        window.slideManager.nextSlide();
      }
    };

    this.canvas.addEventListener('click', handleSlideAdvanceClick);
    const viewport = document.querySelector('.stage-viewport');
    if (viewport) {
      viewport.addEventListener('click', (e) => {
        if (e.target !== this.canvas) {
          handleSlideAdvanceClick(e);
        }
      });
    }
  }

  handleResize() {
    const container = this.canvas.parentElement;
    if (!container) return;

    this.width = container.clientWidth;
    this.height = container.clientHeight;
    this.dpr = window.devicePixelRatio || 1;

    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.scale(this.dpr, this.dpr);
  }

  setStage(stageNum) {
    if (this.currentStage === stageNum) return;

    const direction = (stageNum > this.currentStage) ? 1 : -1;
    this.transition = {
      active: true,
      fromStage: this.currentStage,
      toStage: stageNum,
      progress: 0,
      duration: 1.15,
      direction: direction
    };

    this.targetStage = stageNum;

    if (stageNum === 1) {
      this.geneticsStep = 0;
      this.geneticsAnimProgress = 0;
    }

    if (stageNum === 6) {
      this.initBattleData();
    }

    if (stageNum === 9) {
      this.labDropProgress = 0;
      this.liquefactionProgress = 0;
    }

    if (stageNum === 11) {
      this.initStage11NebulizerData();
    }

    if (stageNum === 12) {
      this.initStage12LysisData();
    }

    if (stageNum === 13) {
      this.initStage13ClearanceData();
    }

    if (stageNum === 14) {
      this.initStage14PastVsPresent();
    }

    if (stageNum === 15) {
      this.initStage15HostOrganismCho();
    }

    if (stageNum === 16) {
      this.initStage16BioreactorProcess();
    }

    if (stageNum === 17) {
      this.initStage17DownstreamPurification();
    }

    if (window.soundEngine) {
      window.soundEngine.playZoom(direction === 1);
    }
  }

  triggerNaturalZoomOut() {
    this.zoomOutSequence = {
      active: true,
      currentStep: this.currentStage
    };
    this.runNextZoomOutStep();
  }

  runNextZoomOutStep() {
    if (!this.zoomOutSequence.active) return;

    if (this.zoomOutSequence.currentStep > 1) {
      const nextStep = this.zoomOutSequence.currentStep - 1;
      this.zoomOutSequence.currentStep = nextStep;

      this.transition = {
        active: true,
        fromStage: this.currentStage,
        toStage: nextStep,
        progress: 0,
        duration: 0.85,
        direction: -1
      };
      this.targetStage = nextStep;

      if (window.soundEngine) window.soundEngine.playZoom(false);
      if (window.slideManager) window.slideManager.syncSlideIndex(nextStep - 1);
    } else {
      this.zoomOutSequence.active = false;
    }
  }

  update(dt) {
    this.time += dt;

    if (this.transition.active) {
      this.transition.progress += dt / this.transition.duration;
      if (this.transition.progress >= 1.0) {
        this.transition.progress = 1.0;
        this.transition.active = false;
        this.currentStage = this.transition.toStage;

        if (this.zoomOutSequence.active) {
          setTimeout(() => this.runNextZoomOutStep(), 120);
        }
      }
    }

    // Stage 1 Genetics animation progress (smooth cinematic progression)
    if ((this.currentStage === 1 || this.targetStage === 1) && this.geneticsStep === 1) {
      this.geneticsAnimProgress = Math.min(1.0, this.geneticsAnimProgress + dt * 0.45);
    }

    // Bacteria movement
    this.bacteria.forEach(b => {
      b.x += b.vx;
      b.y += b.vy;
      b.phase += 0.2;
      if (b.x > 270) b.vx = -Math.abs(b.vx);
      if (b.x < -270) b.vx = Math.abs(b.vx);
      if (b.y > 115) b.vy = -Math.abs(b.vy);
      if (b.y < -115) b.vy = Math.abs(b.vy);
    });

    // RBC flow
    this.redBloodCells.forEach(rbc => {
      rbc.x += rbc.speed;
      if (rbc.x > 450) rbc.x = -450;
    });

    // WBC diapedesis
    this.migratingWbcs.forEach(wbc => {
      wbc.progress += dt * wbc.speed;
      if (wbc.progress > 1.08) wbc.progress = 0;
    });

    // Stage 6 Battle simulation
    if (this.currentStage === 6 || this.targetStage === 6) {
      this.updateBattleStage(dt);
    }

    // Stage 9 Lab Sputum Liquefaction & CHO Secreting Animation
    if (this.currentStage === 9 || this.targetStage === 9) {
      this.updateLabStage(dt);
    }

    // Stage 11 Clinical Nebulizer Inhalation & Pulmonary Aerosol Deposition
    if (this.currentStage === 11 || this.targetStage === 11) {
      this.updateStage11Nebulizer(dt);
    }

    // Stage 12 Molecular rhDNase 1 DNA Lysis Simulation
    if (this.currentStage === 12 || this.targetStage === 12) {
      this.updateStage12Lysis(dt);
    }

    // Stage 13 Airway Physiological Recovery & Mucociliary Clearance
    if (this.currentStage === 13 || this.targetStage === 13) {
      this.updateStage13Clearance(dt);
    }

    // Stages 14-17 Commercial Bioprocessing Simulations
    if (this.currentStage === 14 || this.targetStage === 14) {
      this.updateStage14(dt);
    }
    if (this.currentStage === 15 || this.targetStage === 15) {
      this.updateStage15(dt);
    }
    if (this.currentStage === 16 || this.targetStage === 16) {
      this.updateStage16(dt);
    }
    if (this.currentStage === 17 || this.targetStage === 17) {
      this.updateStage17(dt);
    }
  }

  updateBattleStage(dt) {
    this.battleTimer += dt;

    this.battleBacteria.forEach(bact => {
      if (bact.targetWbc && bact.status === 'alive') {
        const parentWbc = this.battleWbcs.find(w => w.id === bact.targetWbc);
        if (parentWbc) {
          const dx = parentWbc.x - bact.x;
          const dy = parentWbc.y - bact.y;
          const dist = Math.hypot(dx, dy);

          if (this.battleTimer > 0.8 && dist > 12) {
            bact.x += (dx / dist) * 28 * dt;
            bact.y += (dy / dist) * 28 * dt;
          }

          if (dist <= 25 && this.battleTimer > 1.5) {
            bact.engulfProgress = Math.min(1.0, bact.engulfProgress + dt * 0.9);
            if (bact.engulfProgress >= 0.95) {
              bact.status = 'engulfed';
              parentWbc.engulfedCount++;
            }
          }
        }
      }
    });

    this.battleWbcs.forEach(wbc => {
      if (this.battleTimer > wbc.deathTime - 1.2 && wbc.state === 'fighting') {
        wbc.state = 'blebbing';
      }

      if (this.battleTimer > wbc.deathTime && wbc.state === 'blebbing') {
        wbc.state = 'ruptured';
        if (window.soundEngine) window.soundEngine.playCellRupture();
      }

      if (wbc.state === 'ruptured') {
        wbc.dnaStrands.forEach(strand => {
          strand.expansion = Math.min(1.0, strand.expansion + dt * 0.45);
        });
      }
    });

    this.sparks.forEach(sp => {
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.alpha -= dt * 0.8;
      if (sp.alpha <= 0) {
        sp.x = (Math.random() - 0.5) * 350;
        sp.y = (Math.random() - 0.5) * 200;
        sp.alpha = 0.8 + Math.random() * 0.2;
      }
    });
  }

  updateLabStage(dt) {
    this.labDropProgress = (this.labDropProgress + dt * 0.85) % 1.0;
    this.liquefactionProgress = Math.min(1.0, this.liquefactionProgress + dt * 0.22);

    this.choCells.forEach(cell => {
      cell.y += cell.vy;
      cell.phase += 0.05;
      cell.x += Math.sin(cell.phase) * 0.15;
      // Glass culture vessel interior: X in [164, 196], Y in [50, 86]
      if (cell.y < 50) {
        cell.y = 86;
        cell.x = 180 + (Math.random() - 0.5) * 30;
      }
    });
  }

  loop(timestamp) {
    if (!this.lastTimestamp) this.lastTimestamp = timestamp;
    const dt = Math.min((timestamp - this.lastTimestamp) / 1000, 0.1);
    this.lastTimestamp = timestamp;

    if (!this.isPaused) {
      this.update(dt);
    }

    this.render();
    requestAnimationFrame((t) => this.loop(t));
  }

  easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }

  render() {
    const ctx = this.ctx;
    ctx.save();

    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.width, this.height);

    const centerX = this.width / 2;
    const centerY = this.height / 2;

    if (!this.transition.active) {
      ctx.save();
      ctx.translate(centerX, centerY);
      this.renderStage(ctx, this.currentStage);
      ctx.restore();
    } else {
      const p = this.easeInOutCubic(this.transition.progress);
      const isZoomIn = (this.transition.direction === 1);

      if (isZoomIn) {
        const fromScale = 1.0 + p * 1.4;
        const fromAlpha = Math.max(0, 1.0 - p * 1.2);
        const toScale = 0.42 + p * 0.58;
        const toAlpha = Math.min(1.0, p * 1.3);

        if (fromAlpha > 0.01) {
          ctx.save();
          ctx.translate(centerX, centerY);
          ctx.scale(fromScale, fromScale);
          ctx.globalAlpha = fromAlpha;
          this.renderStage(ctx, this.transition.fromStage);
          ctx.restore();
        }

        if (toAlpha > 0.01) {
          ctx.save();
          ctx.translate(centerX, centerY);
          ctx.scale(toScale, toScale);
          ctx.globalAlpha = toAlpha;
          this.renderStage(ctx, this.transition.toStage);
          ctx.restore();
        }
      } else {
        const fromScale = 1.0 - p * 0.58;
        const fromAlpha = Math.max(0, 1.0 - p * 1.2);
        const toScale = 2.4 - p * 1.4;
        const toAlpha = Math.min(1.0, p * 1.3);

        if (toAlpha > 0.01) {
          ctx.save();
          ctx.translate(centerX, centerY);
          ctx.scale(toScale, toScale);
          ctx.globalAlpha = toAlpha;
          this.renderStage(ctx, this.transition.toStage);
          ctx.restore();
        }

        if (fromAlpha > 0.01) {
          ctx.save();
          ctx.translate(centerX, centerY);
          ctx.scale(fromScale, fromScale);
          ctx.globalAlpha = fromAlpha;
          this.renderStage(ctx, this.transition.fromStage);
          ctx.restore();
        }
      }
    }

    ctx.restore();
  }

  // Draw clean, professional scientific callout badge with pointer line
  drawCallout(ctx, targetX, targetY, textX, textY, label, color = '#0284C7') {
    if (!this.showLabels) return;

    ctx.save();
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(targetX, targetY);
    ctx.lineTo(textX, textY);
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(targetX, targetY, 2.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
    const textWidth = ctx.measureText(label).width;
    const isLeft = (textX < targetX);
    const boxX = isLeft ? textX - textWidth - 10 : textX - 4;
    const boxY = textY - 11;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.94)';
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, textWidth + 14, 22, 5);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, boxX + 7, textY);

    ctx.restore();
  }

  // Draw circular archival real photo portrait badge with crisp borders and label pill
  drawRealPhotoPortrait(ctx, x, y, img, nameLabel, accentColor = '#0284C7') {
    if (!img || !img.complete || img.naturalWidth === 0) return;

    ctx.save();
    const radius = 38;

    // 1. Soft ambient drop shadow
    ctx.save();
    ctx.shadowColor = 'rgba(15, 23, 42, 0.22)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(x, y, radius + 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. Outer White Border Ring
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(x, y, radius + 3, 0, Math.PI * 2);
    ctx.fill();

    // 3. Accent Ring
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(x, y, radius + 1, 0, Math.PI * 2);
    ctx.stroke();

    // 4. Circular Clipped Real Photo
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(img, x - radius, y - radius, radius * 2, radius * 2);
    ctx.restore();

    // 5. "1989 PHOTO" top indicator
    ctx.font = '700 8px "JetBrains Mono", monospace';
    ctx.fillStyle = accentColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('● 1989 ARCHIVAL', x, y - radius - 10);

    // 6. Name Pill Underneath
    const pillY = y + radius + 14;
    ctx.font = '700 9.5px "Plus Jakarta Sans", sans-serif';
    const textW = ctx.measureText(nameLabel).width;
    const pillW = Math.max(textW + 18, 92);
    const pillH = 20;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x - pillW / 2, pillY - pillH / 2, pillW, pillH, 5);
    ctx.fill();
    ctx.stroke();

    // Left indicator bar
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.roundRect(x - pillW / 2 + 1, pillY - pillH / 2 + 2, 3, pillH - 4, 1.5);
    ctx.fill();

    // Text inside pill
    ctx.fillStyle = '#0F172A';
    ctx.fillText(nameLabel, x + 2, pillY);

    ctx.restore();
  }

  // Draw floating interactive Back to Timeline Hub button on Stages 7, 8, 9
  drawBackToTimelineButton(ctx) {
    ctx.save();
    const btnX = -450;
    const btnY = -236;
    const btnW = 160;
    const btnH = 30;
    const isHovered = this.backButtonHovered;

    // Drop shadow
    ctx.save();
    ctx.shadowColor = isHovered ? 'rgba(2, 132, 199, 0.32)' : 'rgba(15, 23, 42, 0.08)';
    ctx.shadowBlur = isHovered ? 12 : 6;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = isHovered ? '#0284C7' : '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(btnX, btnY, btnW, btnH, 15);
    ctx.fill();
    ctx.restore();

    // Border
    ctx.strokeStyle = isHovered ? '#0284C7' : '#CBD5E1';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.roundRect(btnX, btnY, btnW, btnH, 15);
    ctx.stroke();

    // Arrow icon & Label
    ctx.font = '700 11.5px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = isHovered ? '#FFFFFF' : '#334155';
    ctx.fillText('⟵ Back to Timeline', btnX + btnW / 2, btnY + btnH / 2);

    ctx.restore();
  }

  renderStage(ctx, stage) {
    switch (stage) {
      case 1: this.drawStage1HiNannaGenetics(ctx); break;
      case 2: this.drawStage2Lungs(ctx); break;
      case 3: this.drawStage3Airway(ctx); break;
      case 4: this.drawStage4Bacteria(ctx); break;
      case 5: this.drawStage5Diapedesis(ctx); break;
      case 6: this.drawStage6TheBattleAndNetosis(ctx); break;
      case 7: this.drawStage7TimelineHub(ctx); break;
      case 8: this.drawStage8BovineCow1950s(ctx); break;
      case 9: this.drawStage9GenentechLabAnimated(ctx); break;
      case 10: this.drawStage10TrialsAndFdaApproval(ctx); break;
      case 11: this.drawStage11NebulizerAdministration(ctx); break;
      case 12: this.drawStage12DnaLysis(ctx); break;
      case 13: this.drawStage13AirwayClearance(ctx); break;
      case 14: this.drawStage14PastVsPresent(ctx); break;
      case 15: this.drawStage15HostOrganismCho(ctx); break;
      case 16: this.drawStage16BioreactorProcess(ctx); break;
      case 17: this.drawStage17DownstreamPurification(ctx); break;
      default: this.drawStage1HiNannaGenetics(ctx);
    }
  }

  /* ========================================================
     STAGE 1: Hi Nanna Case Study & Chromosome 7 Genetics
     Autosomal Recessive Inheritance, Carrier Parents & Chromosome 7q
     ======================================================== */
  drawStage1HiNannaGenetics(ctx) {
    ctx.save();

    // 1. Pristine Medical Background & Minimal Grid across full widescreen
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(-800, -450, 1600, 900);

    ctx.fillStyle = '#E2E8F0';
    for (let gx = -720; gx <= 720; gx += 40) {
      for (let gy = -380; gy <= 380; gy += 40) {
        ctx.beginPath();
        ctx.arc(gx, gy, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 2. Header Section
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Top Pill Badge
    ctx.fillStyle = '#F8FAFC';
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(-220, -252, 440, 26, 13);
    ctx.fill();
    ctx.stroke();

    ctx.font = '700 9.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#4F46E5';
    ctx.fillText('● CLINICAL GENETICS • HI NANNA CASE STUDY', 0, -239);

    // Main Heading
    ctx.font = '800 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#0F172A';
    ctx.fillText('Autosomal Recessive Inheritance & Chromosome 7', 0, -210);

    // Subtitle
    ctx.font = '500 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText('Both parents are asymptomatic carriers; the mutated CFTR gene resides on the long (q) arm.', 0, -184);

    // 3. Parents Row (Widescreen Spacing at X = ±480)
    const fatherX = -480;
    const motherX = 480;
    const parentY = -95;
    const portraitR = 48;

    // Helper to draw circular photo portrait
    const drawPortrait = (x, y, r, img, borderColor = '#D97706', glow = false) => {
      ctx.save();
      if (glow) {
        ctx.shadowColor = borderColor;
        ctx.shadowBlur = 22;
      } else {
        ctx.shadowColor = 'rgba(15, 23, 42, 0.12)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 3;
      }
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(x, y, r + 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(x, y, r + 2, 0, Math.PI * 2);
      ctx.stroke();

      if (img && img.complete && img.naturalWidth > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, x - r, y - r, r * 2, r * 2);
        ctx.restore();
      }
    };

    // --- FATHER (Viraj / Nani) ---
    drawPortrait(fatherX, parentY, portraitR, this.fatherImg, '#D97706');

    // Father Name Pill
    ctx.font = '700 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#0F172A';
    ctx.textAlign = 'center';
    ctx.fillText('FATHER: Viraj (Nani)', fatherX, parentY + portraitR + 18);

    // Father Prominent CARRIER Badge
    ctx.fillStyle = '#FEF3C7';
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.roundRect(fatherX - 70, parentY + portraitR + 30, 140, 24, 12);
    ctx.fill();
    ctx.stroke();

    ctx.font = '800 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#B45309';
    ctx.fillText('🧬 CARRIER (C c)', fatherX, parentY + portraitR + 42);

    ctx.font = '500 10px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText('1 Normal Allele + 1 Mutated CFTR', fatherX, parentY + portraitR + 66);
    ctx.fillText('Clinically Asymptomatic', fatherX, parentY + portraitR + 80);

    // --- MOTHER (Yashna / Mrunal) ---
    drawPortrait(motherX, parentY, portraitR, this.motherImg, '#D97706');

    // Mother Name Pill
    ctx.font = '700 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#0F172A';
    ctx.textAlign = 'center';
    ctx.fillText('MOTHER: Yashna (Mrunal)', motherX, parentY + portraitR + 18);

    // Mother Prominent CARRIER Badge
    ctx.fillStyle = '#FEF3C7';
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.roundRect(motherX - 70, parentY + portraitR + 30, 140, 24, 12);
    ctx.fill();
    ctx.stroke();

    ctx.font = '800 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#B45309';
    ctx.fillText('🧬 CARRIER (C c)', motherX, parentY + portraitR + 42);

    ctx.font = '500 10px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText('1 Normal Allele + 1 Mutated CFTR', motherX, parentY + portraitR + 66);
    ctx.fillText('Clinically Asymptomatic', motherX, parentY + portraitR + 80);

    // --- HIGH-PRECISION MATHEMATICAL BEZIER ARROW POINTER ANIMATOR ---
    const drawAnimatedBezierArrow = (p0, cp, p1, progress, color, glowColor, width = 3.2, arrowSize = 12) => {
      if (progress <= 0.02) return;

      const p = Math.min(1.0, Math.max(0.0, progress));
      const steps = Math.max(10, Math.floor(p * 35));

      // 1. Ambient Glow Trail
      ctx.save();
      ctx.strokeStyle = glowColor;
      ctx.lineWidth = width + 3.5;
      ctx.lineCap = 'round';
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 12;
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      for (let s = 1; s <= steps; s++) {
        const t = (s / steps) * p;
        const inv = 1 - t;
        const bx = inv * inv * p0.x + 2 * inv * t * cp.x + t * t * p1.x;
        const by = inv * inv * p0.y + 2 * inv * t * cp.y + t * t * p1.y;
        ctx.lineTo(bx, by);
      }
      ctx.stroke();
      ctx.restore();

      // 2. Crisp Core Vector Line
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      for (let s = 1; s <= steps; s++) {
        const t = (s / steps) * p;
        const inv = 1 - t;
        const bx = inv * inv * p0.x + 2 * inv * t * cp.x + t * t * p1.x;
        const by = inv * inv * p0.y + 2 * inv * t * cp.y + t * t * p1.y;
        ctx.lineTo(bx, by);
      }
      ctx.stroke();

      // 3. Leading Tip & Tangent Angle Calculation: B'(t) = 2(1-t)(cp - p0) + 2t(p1 - cp)
      const t = p;
      const inv = 1 - t;
      const tipX = inv * inv * p0.x + 2 * inv * t * cp.x + t * t * p1.x;
      const tipY = inv * inv * p0.y + 2 * inv * t * cp.y + t * t * p1.y;

      const dx = 2 * inv * (cp.x - p0.x) + 2 * t * (p1.x - cp.x);
      const dy = 2 * inv * (cp.y - p0.y) + 2 * t * (p1.y - cp.y);
      const angle = Math.atan2(dy, dx);

      // 4. Sleek Aerodynamic Arrowhead Pointer Leading the Charge
      ctx.save();
      ctx.translate(tipX, tipY);
      ctx.rotate(angle);

      ctx.fillStyle = color;
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 12;

      ctx.beginPath();
      ctx.moveTo(arrowSize * 0.4, 0); // Extended sharp front tip
      ctx.lineTo(-arrowSize * 1.25, -arrowSize * 0.65);
      ctx.lineTo(-arrowSize * 0.82, 0); // Notched sleek back
      ctx.lineTo(-arrowSize * 1.25, arrowSize * 0.65);
      ctx.closePath();
      ctx.fill();

      // Sharp white highlight contour
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.3;
      ctx.lineJoin = 'round';
      ctx.stroke();
      ctx.restore();

      // 5. Pulsing Energy Photons along the curve
      const pulseT = ((this.time * 2.2) % 1.0) * p;
      const pinv = 1 - pulseT;
      const px = pinv * pinv * p0.x + 2 * pinv * pulseT * cp.x + pulseT * pulseT * p1.x;
      const py = pinv * pinv * p0.y + 2 * pinv * pulseT * cp.y + pulseT * pulseT * p1.y;

      ctx.save();
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#FFFFFF';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(px, py, width * 0.85, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 6. Expanding Target Arrival Shockwave Ring
      if (p >= 0.96) {
        const ringProg = (this.time * 2.8) % 1.0;
        const ringR = 4 + ringProg * 18;
        const ringAlpha = (1.0 - ringProg) * 0.85;

        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.8;
        ctx.globalAlpha = ringAlpha;
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, ringR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();
    };

    // --- ANIMATION CHOREOGRAPHY ---
    const isRevealed = (this.geneticsStep >= 1);
    const animP = this.easeInOutCubic(this.geneticsAnimProgress);

    // Phase 1: Parent Arrows (T in 0.0 to 0.42)
    const pParent = isRevealed ? Math.min(1.0, animP / 0.42) : 0;

    // Phase 2: Chromosomes Appearance (T in 0.16 to 0.48) - ONLY after click!
    const chromEntrance = isRevealed ? Math.min(1.0, Math.max(0.0, (animP - 0.16) / 0.28)) : 0;

    // Phase 3: Two Arrows down to Child (T in 0.50 to 0.88)
    const pChild = isRevealed ? Math.min(1.0, Math.max(0.0, (animP - 0.50) / 0.36)) : 0;

    // Phase 4: Child Affected Diagnosis Reveal
    const isChildRevealed = isRevealed && (animP > 0.82);

    // 4. Draw Descending Arrows from Parents to Chromosomes
    if (isRevealed && pParent > 0.01) {
      // Paternal Arrow (Father Viraj -> Paternal Chr 7)
      drawAnimatedBezierArrow(
        { x: fatherX + 50, y: parentY + portraitR + 25 },
        { x: -330, y: -115 },
        { x: -190, y: -115 },
        pParent,
        '#D97706',
        'rgba(217, 119, 6, 0.7)',
        3.2,
        12
      );

      // Maternal Arrow (Mother Yashna -> Maternal Chr 7)
      drawAnimatedBezierArrow(
        { x: motherX - 50, y: parentY + portraitR + 25 },
        { x: 330, y: -115 },
        { x: 190, y: -115 },
        pParent,
        '#D97706',
        'rgba(217, 119, 6, 0.7)',
        3.2,
        12
      );
    }

    // 5. Chromosome 7 Cytogenetic Structure (ONLY VISIBLE AFTER CLICK)
    if (isRevealed && chromEntrance > 0.01) {
      const drawChromosome7 = (cx, cy, label) => {
        ctx.save();
        ctx.translate(cx, cy);

        // Dynamic Entrance Scaling & Fade
        const cardScale = 0.84 + chromEntrance * 0.16;
        ctx.scale(cardScale, cardScale);
        ctx.globalAlpha = chromEntrance;

        // Container Card (W: 150, H: 180)
        ctx.fillStyle = 'rgba(248, 250, 252, 0.95)';
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.roundRect(-75, -85, 150, 180, 10);
        ctx.fill();
        ctx.stroke();

        // Card Header Label
        ctx.font = '800 10.5px "JetBrains Mono", monospace';
        ctx.fillStyle = '#0F172A';
        ctx.textAlign = 'center';
        ctx.fillText(label, 0, -68);

        // --- CHROMOSOME 7 ANATOMY ---
        // Centromere at Y = -15
        // Short arm (7p): Y = -52 to -15 (length: 37px)
        // Long arm (7q): Y = -15 to +62 (length: 77px -> distinctly longer!)
        const pArmTop = -52;
        const centY = -15;
        const qArmBottom = 62;

        // Draw Chromatid Pair (Sister chromatids)
        [-5.5, 5.5].forEach(side => {
          // 7p-Arm (Short)
          ctx.fillStyle = '#CBD5E1';
          ctx.strokeStyle = '#64748B';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.roundRect(side - 4.5, pArmTop, 9, centY - pArmTop, 4);
          ctx.fill();
          ctx.stroke();

          // 7q-Arm (Distinctly longer!)
          ctx.fillStyle = '#CBD5E1';
          ctx.beginPath();
          ctx.roundRect(side - 4.5, centY, 9, qArmBottom - centY, 4);
          ctx.fill();
          ctx.stroke();

          // Cytogenetic G-Bands on Q-Arm
          ctx.fillStyle = '#94A3B8';
          ctx.fillRect(side - 4.5, centY + 8, 9, 4);
          ctx.fillRect(side - 4.5, centY + 20, 9, 4);
          ctx.fillRect(side - 4.5, centY + 44, 9, 5);
        });

        // Centromere Constriction Waist
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.arc(0, centY, 5, 0, Math.PI * 2);
        ctx.fill();

        // Anatomical labels on arms:
        ctx.font = '600 8px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#64748B';
        ctx.textAlign = 'right';
        ctx.fillText('7p (short)', -18, -34);

        ctx.font = '700 8.5px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#0F172A';
        ctx.fillText('7q (longer)', -18, 22);

        // --- HIGHLIGHTING THE LONGER Q-ARM & CFTR CARRIER LOCUS (7q31.2) ---
        const locusY = 28;
        const qGlow = Math.sin(this.time * 6) * 4;

        // Glowing bracket/box around band 7q31.2
        ctx.save();
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 2.2;
        ctx.shadowColor = '#EF4444';
        ctx.shadowBlur = 10 + qGlow;
        ctx.beginPath();
        ctx.roundRect(-12, locusY - 7, 24, 14, 3);
        ctx.stroke();

        // Mutated Carrier Gene Band Fill
        ctx.fillStyle = '#EF4444';
        ctx.fillRect(-9, locusY - 5, 18, 10);
        ctx.restore();

        // Callout Line & Text for 7q31.2
        ctx.font = '800 8.5px "JetBrains Mono", monospace';
        ctx.fillStyle = '#DC2626';
        ctx.textAlign = 'left';
        ctx.fillText('● 7q31.2', 18, locusY - 2);
        ctx.font = '700 8px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#991B1B';
        ctx.fillText('CFTR carrier gene', 18, locusY + 8);

        ctx.restore();
      };

      // Draw Paternal Chromosome 7 (at X = -190, Y = -25)
      drawChromosome7(-190, -25, 'Chr 7 (Paternal)');

      // Draw Maternal Chromosome 7 (at X = +190, Y = -25)
      drawChromosome7(190, -25, 'Chr 7 (Maternal)');

      // Center Pedigree Annotation Card (at X = 0, Y = -25)
      ctx.save();
      ctx.globalAlpha = chromEntrance;
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(-60, -70, 120, 90, 8);
      ctx.fill();
      ctx.stroke();

      ctx.font = '800 9px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#4F46E5';
      ctx.textAlign = 'center';
      ctx.fillText('CARRIER LOCUS', 0, -52);

      ctx.font = '600 8.5px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText('Longer (q) arm', 0, -36);
      ctx.fillText('Band 7q31.2', 0, -20);

      ctx.font = '700 9px "JetBrains Mono", monospace';
      ctx.fillStyle = '#DC2626';
      ctx.fillText('ΔF508 allele', 0, -4);
      ctx.restore();
    }

    // 6. Two Descending Arrows extending from Chromosome 7q31.2 to Child
    const childX = 0;
    const childY = 175;
    const childR = 52;

    if (isRevealed && pChild > 0.01) {
      // Paternal Chr 7q31.2 -> Child Mahi
      drawAnimatedBezierArrow(
        { x: -170, y: 3 },
        { x: -105, y: 70 },
        { x: -38, y: childY - childR - 2 },
        pChild,
        '#EF4444',
        'rgba(239, 68, 68, 0.8)',
        3.4,
        13
      );

      // Maternal Chr 7q31.2 -> Child Mahi
      drawAnimatedBezierArrow(
        { x: 170, y: 3 },
        { x: 105, y: 70 },
        { x: 38, y: childY - childR - 2 },
        pChild,
        '#EF4444',
        'rgba(239, 68, 68, 0.8)',
        3.4,
        13
      );
    }

    // 7. Child Section (Bottom Center)
    drawPortrait(childX, childY, childR, this.childImg, isChildRevealed ? '#DC2626' : '#94A3B8', isChildRevealed);

    // Child Name Label above portrait
    ctx.font = '700 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#0F172A';
    ctx.textAlign = 'center';
    ctx.fillText('DAUGHTER: Mahi (Baby Kiara)', childX, childY - childR - 12);

    // Prominent Diagnosis & Affected Status Label
    if (isChildRevealed) {
      // Primary Alert Pill
      ctx.save();
      ctx.shadowColor = 'rgba(220, 38, 38, 0.35)';
      ctx.shadowBlur = 14;
      ctx.fillStyle = '#FEE2E2';
      ctx.strokeStyle = '#DC2626';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.roundRect(childX - 190, childY + childR + 10, 380, 28, 14);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      ctx.font = '800 12.5px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#991B1B';
      ctx.textAlign = 'center';
      ctx.fillText('🚨 CHILD IS AFFECTED BY CYSTIC FIBROSIS', childX, childY + childR + 25);

      // Genotype & Explanation
      ctx.font = '700 10px "JetBrains Mono", monospace';
      ctx.fillStyle = '#7F1D1D';
      ctx.fillText('Genotype: (c c) — Homozygous Recessive (25% Probability)', childX, childY + childR + 49);

      ctx.font = '500 10.5px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText('Inherited mutated CFTR gene on 7q from BOTH carrier parents ➔ Zero functional chloride channels', childX, childY + childR + 65);
    } else {
      // Clean subtle risk badge when not yet clicked/animated (NO instructions or prompts)
      ctx.fillStyle = '#F8FAFC';
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(childX - 150, childY + childR + 10, 300, 24, 12);
      ctx.fill();
      ctx.stroke();

      ctx.font = '600 10px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#64748B';
      ctx.textAlign = 'center';
      ctx.fillText('Autosomal Recessive Inheritance • 25% Risk', childX, childY + childR + 22);
    }

    ctx.restore();
  }

  /* ========================================================
     STAGE 2: Macro Lungs
     ======================================================== */
  drawStage2Lungs(ctx) {
    ctx.save();
    const breath = 1.0 + Math.sin(this.time * 1.8) * 0.02;
    ctx.scale(breath, breath);

    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 6]);
    for (let y = -140; y <= 140; y += 40) {
      ctx.beginPath();
      ctx.moveTo(-180, y);
      ctx.quadraticCurveTo(-100, y - 20, -40, y - 10);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(180, y);
      ctx.quadraticCurveTo(100, y - 20, 40, y - 10);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    ctx.fillStyle = '#F1F5F9';
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(-16, -170, 32, 125, 4);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 2;
    for (let y = -160; y <= -55; y += 13) {
      ctx.beginPath();
      ctx.arc(0, y, 15, -0.2, Math.PI + 0.2, false);
      ctx.stroke();
    }

    const gradRight = ctx.createLinearGradient(-150, -100, -20, 160);
    gradRight.addColorStop(0, '#FFE4E6');
    gradRight.addColorStop(1, '#FDA4AF');
    ctx.fillStyle = gradRight;
    ctx.strokeStyle = '#F43F5E';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-60, -110);
    ctx.bezierCurveTo(-150, -80, -175, 50, -165, 120);
    ctx.bezierCurveTo(-150, 150, -70, 145, -50, 130);
    ctx.bezierCurveTo(-35, 110, -35, -20, -45, -70);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    const gradLeft = ctx.createLinearGradient(20, -100, 150, 160);
    gradLeft.addColorStop(0, '#FFE4E6');
    gradLeft.addColorStop(1, '#FDA4AF');
    ctx.fillStyle = gradLeft;
    ctx.beginPath();
    ctx.moveTo(60, -110);
    ctx.bezierCurveTo(150, -80, 175, 50, 165, 120);
    ctx.bezierCurveTo(150, 150, 70, 145, 50, 130);
    ctx.bezierCurveTo(25, 90, 25, 20, 45, -20);
    ctx.bezierCurveTo(35, -70, 48, -95, 60, -110);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#475569';
    ctx.lineCap = 'round';
    ctx.lineWidth = 11;
    ctx.beginPath();
    ctx.moveTo(0, -45);
    ctx.quadraticCurveTo(30, -30, 65, -10);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -45);
    ctx.quadraticCurveTo(-25, -28, -60, -10);
    ctx.stroke();

    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(65, -10);
    ctx.quadraticCurveTo(95, 10, 120, 40);
    ctx.moveTo(65, -10);
    ctx.quadraticCurveTo(90, -35, 125, -50);
    ctx.moveTo(-60, -10);
    ctx.quadraticCurveTo(-90, 10, -120, 40);
    ctx.moveTo(-60, -10);
    ctx.quadraticCurveTo(-90, -35, -125, -50);
    ctx.stroke();

    const pulse = 16 + Math.sin(this.time * 4) * 4;
    ctx.strokeStyle = 'rgba(2, 132, 199, 0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(65, -10, pulse, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#0284C7';
    ctx.beginPath();
    ctx.arc(65, -10, 5, 0, Math.PI * 2);
    ctx.fill();

    this.drawCallout(ctx, 0, -145, -110, -155, 'Trachea (Cartilage Rings)', '#475569');
    this.drawCallout(ctx, -120, 0, -220, 0, 'Right Lung (3 Lobes)', '#E11D48');
    this.drawCallout(ctx, 120, 0, 145, 0, 'Left Lung (2 Lobes)', '#E11D48');
    this.drawCallout(ctx, -45, -20, -160, 45, 'Bronchial Arborization', '#475569');
    this.drawCallout(ctx, 65, -10, 95, -10, 'Bronchial Airway Branch', '#0284C7');

    ctx.restore();
  }

  /* ========================================================
     STAGE 3: Airway Lining & Dehydrated Mucus
     ======================================================== */
  drawStage3Airway(ctx) {
    ctx.save();
    const lumenGrad = ctx.createLinearGradient(0, -220, 0, -60);
    lumenGrad.addColorStop(0, '#FFFFFF');
    lumenGrad.addColorStop(1, '#F8FAFC');
    ctx.fillStyle = lumenGrad;
    ctx.fillRect(-450, -240, 900, 170);

    const mucusGrad = ctx.createLinearGradient(0, -70, 0, 15);
    mucusGrad.addColorStop(0, 'rgba(234, 179, 8, 0.45)');
    mucusGrad.addColorStop(0.6, 'rgba(202, 138, 4, 0.75)');
    mucusGrad.addColorStop(1, 'rgba(180, 83, 9, 0.9)');
    ctx.fillStyle = mucusGrad;
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-450, 15);
    ctx.lineTo(-450, -70);
    for (let x = -450; x <= 450; x += 40) {
      const wave = Math.sin(x * 0.035 + this.time * 1.5) * 5;
      ctx.lineTo(x, -70 + wave);
    }
    ctx.lineTo(450, 15);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    for (let x = -420; x <= 420; x += 9) {
      const bend = Math.sin(this.time * 2 + x * 0.3) * 3;
      ctx.beginPath();
      ctx.moveTo(x, 15);
      ctx.quadraticCurveTo(x + 5 + bend, 3, x + 10 + bend * 1.2, -6);
      ctx.stroke();
    }

    const cellW = 44;
    for (let i = 0; i < 20; i++) {
      const cx = -440 + i * cellW;
      const isGoblet = (i === 3 || i === 9 || i === 14);
      if (isGoblet) {
        ctx.fillStyle = '#FEF3C7';
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(cx + 2, 15, cellW - 4, 85, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#F59E0B';
        for (let g = 0; g < 6; g++) {
          ctx.beginPath();
          ctx.arc(cx + 12 + (g % 3) * 10, 32 + Math.floor(g / 3) * 12, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = '#B45309';
        ctx.beginPath();
        ctx.ellipse(cx + cellW / 2, 78, 8, 12, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = '#F8FAFC';
        ctx.strokeStyle = '#94A3B8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(cx + 2, 15, cellW - 4, 85, 4);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#64748B';
        ctx.beginPath();
        ctx.ellipse(cx + cellW / 2, 65, 8, 14, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.strokeStyle = '#F43F5E';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-450, 100);
    ctx.lineTo(450, 100);
    ctx.stroke();

    ctx.fillStyle = '#FFE4E6';
    ctx.fillRect(-450, 102, 900, 48);

    ctx.fillStyle = '#FFF1F2';
    ctx.fillRect(-450, 150, 900, 70);
    ctx.strokeStyle = '#E11D48';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-450, 150);
    ctx.lineTo(450, 150);
    ctx.moveTo(-450, 220);
    ctx.lineTo(450, 220);
    ctx.stroke();

    this.redBloodCells.forEach(rbc => {
      ctx.fillStyle = '#EF4444';
      ctx.strokeStyle = '#B91C1C';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(rbc.x, 185, rbc.radius, rbc.radius * 0.65, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    this.drawCallout(ctx, 0, -130, 80, -150, 'Airway Lumen (Open Passage)', '#475569');
    this.drawCallout(ctx, -140, -35, -280, -45, 'Thick Viscous Mucus Blanket', '#D97706');
    this.drawCallout(ctx, 80, 5, 140, -10, 'Matted / Paralyzed Cilia', '#0284C7');
    this.drawCallout(ctx, -70, 50, -260, 50, 'Columnar Epithelial Cell', '#475569');
    this.drawCallout(ctx, 75, 45, 150, 60, 'Goblet Cell (Mucin Granules)', '#D97706');
    this.drawCallout(ctx, -180, 120, -310, 120, 'Lamina Propria (Tissue)', '#E11D48');
    this.drawCallout(ctx, 40, 185, 120, 185, 'Pulmonary Capillary (Blood Stream)', '#DC2626');

    ctx.restore();
  }

  /* ========================================================
     STAGE 4: Bacterial Breeding Ground
     ======================================================== */
  drawStage4Bacteria(ctx) {
    ctx.save();
    const bgGrad = ctx.createRadialGradient(0, 0, 40, 0, 0, 450);
    bgGrad.addColorStop(0, '#FEF9C3');
    bgGrad.addColorStop(0.6, '#FEF08A');
    bgGrad.addColorStop(1, '#FDE047');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(-500, -260, 1000, 520);

    const biofilmClusters = [
      { x: -160, y: -40, r: 95 },
      { x: 180, y: 30, r: 105 },
      { x: -30, y: 80, r: 85 }
    ];
    biofilmClusters.forEach((c, idx) => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r + Math.sin(this.time * 1.5 + idx) * 5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(101, 163, 13, 0.16)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(101, 163, 13, 0.35)';
      ctx.setLineDash([4, 6]);
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.setLineDash([]);
    });

    this.bacteria.forEach(b => {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.angle);

      ctx.strokeStyle = '#15803D';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(-b.length / 2, 0);
      for (let s = 1; s <= 4; s++) {
        ctx.lineTo(-b.length / 2 - s * 5, Math.sin(b.phase + s * 1.3) * 5);
      }
      ctx.stroke();

      ctx.fillStyle = '#22C55E';
      ctx.strokeStyle = '#14532D';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.roundRect(-b.length / 2, -b.width / 2, b.length, b.width, b.width / 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });

    this.drawCallout(ctx, -60, -30, -260, -40, 'Pseudomonas aeruginosa (Rods)', '#15803D');
    this.drawCallout(ctx, -75, -28, -260, -75, 'Polar Flagellum (Motility)', '#15803D');
    this.drawCallout(ctx, 40, -10, 110, -20, 'Binary Fission (Cell Division)', '#16A34A');
    this.drawCallout(ctx, 160, 45, 180, 65, 'Alginate Biofilm Matrix', '#65A30D');
    this.drawCallout(ctx, 0, 95, -160, 130, 'Hypoxic Dehydrated Mucus Gel', '#B45309');

    ctx.restore();
  }

  /* ========================================================
     STAGE 5: Blood Vessel to Mucus Diapedesis
     ======================================================== */
  drawStage5Diapedesis(ctx) {
    ctx.save();
    const mucusGrad = ctx.createLinearGradient(0, -190, 0, -50);
    mucusGrad.addColorStop(0, '#FEF08A');
    mucusGrad.addColorStop(1, '#FDE047');
    ctx.fillStyle = mucusGrad;
    ctx.fillRect(-500, -190, 1000, 140);

    const bactCoords = [
      { x: -160, y: -130, a: 0.3 },
      { x: 30, y: -140, a: -0.6 },
      { x: 180, y: -110, a: 0.8 },
      { x: -60, y: -90, a: 1.1 }
    ];
    bactCoords.forEach(bc => {
      ctx.save();
      ctx.translate(bc.x, bc.y);
      ctx.rotate(bc.a);
      ctx.fillStyle = '#16A34A';
      ctx.strokeStyle = '#14532D';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.roundRect(-10, -5, 20, 10, 5);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });

    for (let x = -480; x < 480; x += 40) {
      ctx.fillStyle = '#F8FAFC';
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(x + 2, -50, 36, 75, 4);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#64748B';
      ctx.beginPath();
      ctx.ellipse(x + 20, -15, 6, 10, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#FFE4E6';
    ctx.fillRect(-500, 30, 1000, 80);

    ctx.fillStyle = '#FFF1F2';
    ctx.fillRect(-500, 110, 1000, 85);
    ctx.strokeStyle = '#E11D48';
    ctx.lineWidth = 2.5;

    for (let x = -480; x < 480; x += 60) {
      ctx.fillStyle = '#FFE4E6';
      ctx.fillRect(x + 2, 106, 52, 8);
      ctx.strokeRect(x + 2, 106, 52, 8);
      ctx.fillStyle = '#BE123C';
      ctx.beginPath();
      ctx.ellipse(x + 28, 110, 8, 3, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    this.redBloodCells.forEach(rbc => {
      ctx.fillStyle = '#EF4444';
      ctx.strokeStyle = '#B91C1C';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(rbc.x, 185, rbc.radius, rbc.radius * 0.65, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    let sampleMidWbcX = 0;
    let sampleMidWbcY = 0;

    this.migratingWbcs.forEach(wbc => {
      const p = wbc.progress;
      const startX = -260 + wbc.id * 65;
      const startY = 155;
      const endX = startX + Math.sin(wbc.id) * 30;
      const endY = -120;

      const currX = startX + (endX - startX) * p + Math.sin(wbc.wobble) * 4;
      const currY = startY + (endY - startY) * p;

      if (wbc.id === 2) {
        sampleMidWbcX = currX;
        sampleMidWbcY = currY;
      }

      ctx.save();
      ctx.translate(currX, currY);

      const isSqueezing = (currY > 95 && currY < 125) || (currY > -45 && currY < 15);
      const stretchY = isSqueezing ? 1.45 : 1.0;
      const stretchX = isSqueezing ? 0.7 : 1.0;
      ctx.scale(stretchX, stretchY);

      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#0284C7';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(0, 0, wbc.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#4338CA';
      ctx.beginPath();
      ctx.arc(-4, -3, 3.5, 0, Math.PI * 2);
      ctx.arc(4, -2, 3.2, 0, Math.PI * 2);
      ctx.arc(0, 4, 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#4338CA';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(-4, -3);
      ctx.lineTo(4, -2);
      ctx.lineTo(0, 4);
      ctx.stroke();
      ctx.restore();
    });

    this.drawCallout(ctx, -80, -140, -280, -150, 'Viscous Mucus Membrane', '#D97706');
    this.drawCallout(ctx, 160, -115, 185, -125, 'Bacteria Colonization Colony', '#15803D');
    this.drawCallout(ctx, -50, -15, -280, -15, 'Airway Epithelial Barrier', '#475569');
    this.drawCallout(ctx, 150, 65, 165, 65, 'Lamina Propria (Tissue)', '#E11D48');
    this.drawCallout(ctx, -110, 110, -280, 105, 'Endothelial Wall (Junction Pores)', '#BE123C');
    this.drawCallout(ctx, 0, 155, 130, 155, 'Pulmonary Blood Capillary', '#DC2626');
    this.drawCallout(ctx, -220, 155, -340, 155, 'Red Blood Cells (Erythrocytes)', '#EF4444');
    this.drawCallout(ctx, sampleMidWbcX, sampleMidWbcY, sampleMidWbcX + 35, sampleMidWbcY - 15, 'Neutrophil Diapedesis (WBC)', '#0284C7');

    ctx.restore();
  }

  /* ========================================================
     STAGE 6: Battle, Phagocytosis, Multiple WBC Death & DNA Mesh
     ======================================================== */
  drawStage6TheBattleAndNetosis(ctx) {
    ctx.save();
    const bgGrad = ctx.createRadialGradient(0, 0, 40, 0, 0, 450);
    bgGrad.addColorStop(0, '#FEF9C3');
    bgGrad.addColorStop(0.6, '#FEF08A');
    bgGrad.addColorStop(1, '#FDE047');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(-500, -260, 1000, 520);

    this.battleBacteria.forEach(bact => {
      if (bact.status === 'engulfed') return;
      ctx.save();
      ctx.translate(bact.x, bact.y);
      ctx.rotate(bact.angle);

      const alpha = Math.max(0, 1.0 - bact.engulfProgress);
      const scale = Math.max(0.2, 1.0 - bact.engulfProgress * 0.7);

      ctx.scale(scale, scale);
      ctx.globalAlpha = alpha;

      ctx.fillStyle = '#16A34A';
      ctx.strokeStyle = '#14532D';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-12, -6, 24, 12, 6);
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = '#15803D';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-12, 0);
      for (let s = 1; s <= 3; s++) {
        ctx.lineTo(-12 - s * 4, Math.sin(this.time * 4 + s) * 3);
      }
      ctx.stroke();
      ctx.restore();
    });

    this.battleWbcs.forEach(wbc => {
      ctx.save();
      ctx.translate(wbc.x, wbc.y);

      const isFighting = (wbc.state === 'fighting');
      const isBlebbing = (wbc.state === 'blebbing');
      const isRuptured = (wbc.state === 'ruptured');

      const membraneAlpha = isRuptured
        ? Math.max(0, 1.0 - wbc.dnaStrands[0].expansion * 1.5)
        : 1.0;

      if (membraneAlpha > 0.02) {
        ctx.save();
        ctx.globalAlpha = membraneAlpha;
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = isBlebbing ? '#EF4444' : '#0284C7';
        ctx.lineWidth = 2.4;

        ctx.beginPath();
        const numPts = 16;
        for (let i = 0; i < numPts; i++) {
          const th = (i / numPts) * Math.PI * 2;
          let r = wbc.size;

          if (isFighting && Math.abs(th - wbc.engulfingArmAngle) < 0.6) {
            r += 12 + Math.sin(this.time * 5) * 4;
          }
          if (isBlebbing) {
            r += Math.sin(th * 4 + this.time * 8) * 7;
          }

          const px = Math.cos(th) * r;
          const py = Math.sin(th) * r;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        const nucAlpha = isRuptured
          ? Math.max(0, 1.0 - wbc.dnaStrands[0].expansion * 2.0)
          : 1.0;

        if (nucAlpha > 0.02) {
          ctx.fillStyle = `rgba(67, 56, 202, ${nucAlpha})`;
          ctx.beginPath();
          ctx.arc(-8, -6, 7, 0, Math.PI * 2);
          ctx.arc(8, -6, 6.5, 0, Math.PI * 2);
          ctx.arc(0, 8, 7.5, 0, Math.PI * 2);
          ctx.fill();

          if (wbc.engulfedCount > 0) {
            ctx.fillStyle = 'rgba(22, 163, 74, 0.4)';
            ctx.strokeStyle = '#16A34A';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(-14, 4, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          }
        }
        ctx.restore();
      }

      if (isRuptured) {
        const exp = wbc.dnaStrands[0].expansion;
        ctx.shadowColor = 'rgba(99, 102, 241, 0.4)';
        ctx.shadowBlur = 5;

        wbc.dnaStrands.forEach((strand, sIdx) => {
          const activeCount = Math.floor(strand.points.length * exp);
          if (activeCount < 2) return;

          ctx.strokeStyle = '#6366F1';
          ctx.lineWidth = 2.0;
          ctx.beginPath();
          ctx.moveTo(0, 0);

          for (let p = 0; p < activeCount; p++) {
            const pt = strand.points[p];
            const wave = Math.sin(this.time * 3 + p * 0.9 + sIdx) * 3;
            ctx.lineTo(pt.x + wave, pt.y - wave);
          }
          ctx.stroke();

          ctx.strokeStyle = '#A855F7';
          ctx.lineWidth = 1.3;
          for (let p = 1; p < activeCount; p += 2) {
            const pt = strand.points[p];
            ctx.beginPath();
            ctx.moveTo(pt.x - 3, pt.y - 3);
            ctx.lineTo(pt.x + 3, pt.y + 3);
            ctx.stroke();
          }

          for (let p = 2; p < activeCount; p += 3) {
            const pt = strand.points[p];
            ctx.fillStyle = '#F59E0B';
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 2.6, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }
      ctx.restore();
    });

    const allRuptured = this.battleWbcs.filter(w => w.state === 'ruptured');
    if (allRuptured.length >= 2) {
      ctx.save();
      ctx.strokeStyle = 'rgba(124, 58, 237, 0.65)';
      ctx.lineWidth = 1.6;
      ctx.setLineDash([4, 4]);

      for (let i = 0; i < allRuptured.length; i++) {
        for (let j = i + 1; j < allRuptured.length; j++) {
          const w1 = allRuptured[i];
          const w2 = allRuptured[j];
          const p = Math.min(w1.dnaStrands[0].expansion, w2.dnaStrands[0].expansion);

          if (p > 0.3) {
            ctx.beginPath();
            ctx.moveTo(w1.x, w1.y);
            const midX = (w1.x + w2.x) / 2 + Math.sin(this.time * 2 + i) * 15;
            const midY = (w1.y + w2.y) / 2 + Math.cos(this.time * 2 + j) * 15;
            ctx.quadraticCurveTo(midX, midY, w2.x, w2.y);
            ctx.stroke();
          }
        }
      }
      ctx.setLineDash([]);
      ctx.restore();
    }

    this.sparks.forEach(sp => {
      ctx.fillStyle = sp.color;
      ctx.globalAlpha = sp.alpha;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
    });

    if (this.battleTimer < 3.0) {
      this.drawCallout(ctx, -140, -40, -320, -40, 'Neutrophil (White Blood Cell)', '#0284C7');
      this.drawCallout(ctx, -115, -35, -320, -85, 'Pseudopodia (Phagocytosis Arm)', '#0284C7');
      this.drawCallout(ctx, -175, -45, -320, 15, 'Pseudomonas Bacteria (Target)', '#15803D');
      this.drawCallout(ctx, 130, -30, 160, -30, 'Recruited Neutrophil #2', '#0284C7');
      this.drawCallout(ctx, -30, 70, 40, 95, 'Neutrophil #3 Engulfing Colony', '#0284C7');
    } else {
      this.drawCallout(ctx, -140, -40, -320, -60, 'Cell Membrane Rupture / Lysis', '#DC2626');
      this.drawCallout(ctx, -110, -15, -320, 0, 'Leaked Chromosomal DNA Filaments', '#6366F1');
      this.drawCallout(ctx, 130, -30, 160, -40, 'Dying Neutrophil #2 (NETosis)', '#DC2626');
      this.drawCallout(ctx, 0, 0, -80, -140, 'Cross-Linked DNA Polymer Mesh (NETs)', '#7C3AED');
      this.drawCallout(ctx, 210, 70, 210, 110, 'Trapped Bacteria in DNA Web', '#15803D');
    }

    ctx.restore();
  }

  /* ========================================================
     STAGE 7: Interactive Historical Timeline Hub (1950–1993)
     Three clickable circular nodes with optical zoom into milestones!
     ======================================================== */
  drawStage7TimelineHub(ctx) {
    ctx.save();

    // 1. Pristine Medical Stage Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(-500, -260, 1000, 520);

    // Subtle ambient background pattern (soft grid dots)
    ctx.fillStyle = '#E2E8F0';
    for (let gx = -460; gx <= 460; gx += 40) {
      for (let gy = -220; gy <= 220; gy += 40) {
        ctx.beginPath();
        ctx.arc(gx, gy, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 2. Header Area
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Top pill badge
    ctx.fillStyle = '#F8FAFC';
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(-170, -232, 340, 26, 13);
    ctx.fill();
    ctx.stroke();

    ctx.font = '700 9.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#0284C7';
    ctx.fillText('● HISTORICAL MILESTONE ROADMAP (1950 — 1993)', 0, -219);

    // Main Heading
    ctx.font = '800 23px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#0F172A';
    ctx.fillText('The 40-Year Evolution of CF DNase Therapy', 0, -190);

    // Subtitle & Interactive prompt
    ctx.font = '500 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText('Click any of the 3 milestone eras below to zoom directly into that historical breakthrough:', 0, -164);

    // 3. Connecting Timeline Track (Horizontal gradient beam)
    const trackY = -25;
    const startX = -330;
    const endX = 330;

    // Outer subtle track shadow
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(startX, trackY);
    ctx.lineTo(endX, trackY);
    ctx.stroke();

    // Colored gradient connection track
    const trackGrad = ctx.createLinearGradient(startX, trackY, endX, trackY);
    trackGrad.addColorStop(0, '#D97706');    // 1950s amber
    trackGrad.addColorStop(0.5, '#0284C7');  // 1988 blue
    trackGrad.addColorStop(1, '#059669');    // 1993 emerald
    ctx.strokeStyle = trackGrad;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(startX, trackY);
    ctx.lineTo(endX, trackY);
    ctx.stroke();

    // Flowing energy pulse dot
    const pulseT = (this.time * 0.45) % 1.0;
    const pulseX = startX + (endX - startX) * pulseT;
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = '#0284C7';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(pulseX, trackY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // 4. Render the 3 Milestone Nodes & Information Cards
    this.timelineNodes.forEach((node, idx) => {
      const isHovered = (this.hoveredTimelineNode === idx);
      const nx = node.x;
      const ny = trackY;
      const r = isHovered ? node.radius + 4 : node.radius;

      // --- Node Circle ---
      ctx.save();

      // Outer glowing halo
      if (isHovered) {
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 24;
      } else {
        const breath = Math.sin(this.time * 2.5 + idx * 2) * 2;
        ctx.shadowColor = 'rgba(15, 23, 42, 0.12)';
        ctx.shadowBlur = 8 + breath;
      }

      // Outer white ring
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(nx, ny, r + 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Concentric accent ring
      ctx.strokeStyle = node.color;
      ctx.lineWidth = isHovered ? 3.5 : 2.5;
      ctx.beginPath();
      ctx.arc(nx, ny, r + 4, 0, Math.PI * 2);
      ctx.stroke();

      // Disc Background
      const discGrad = ctx.createRadialGradient(nx - 12, ny - 14, 4, nx, ny, r);
      discGrad.addColorStop(0, '#FFFFFF');
      discGrad.addColorStop(1, node.accentBg);
      ctx.fillStyle = discGrad;
      ctx.beginPath();
      ctx.arc(nx, ny, r, 0, Math.PI * 2);
      ctx.fill();

      // Icon inside Circle
      ctx.save();
      ctx.translate(nx, ny - 9);
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if (idx === 0) {
        ctx.fillText('🐄', 0, 0);
      } else if (idx === 1) {
        ctx.fillText('🧬', 0, 0);
      } else {
        ctx.fillText('⭐', 0, 0);
      }
      ctx.restore();

      // Year displayed prominently inside the circle
      ctx.font = '800 12px "JetBrains Mono", monospace';
      ctx.fillStyle = node.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.year, nx, ny + 17);

      // Top Era Pill (above circle)
      const eraPillY = ny - r - 22;
      ctx.font = '800 9.5px "Plus Jakarta Sans", sans-serif';
      const eraW = ctx.measureText(node.eraLabel).width + 18;
      ctx.fillStyle = isHovered ? node.color : '#FFFFFF';
      ctx.strokeStyle = node.color;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(nx - eraW / 2, eraPillY - 10, eraW, 20, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isHovered ? '#FFFFFF' : node.color;
      ctx.fillText(node.eraLabel, nx, eraPillY);

      // --- Information Card Below Circle ---
      const cardX = nx - 130;
      const cardY = ny + r + 24;
      const cardW = 260;
      const cardH = 175;

      ctx.save();
      if (isHovered) {
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 18;
        ctx.shadowOffsetY = 4;
      } else {
        ctx.shadowColor = 'rgba(15, 23, 42, 0.06)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 2;
      }

      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = isHovered ? node.color : '#E2E8F0';
      ctx.lineWidth = isHovered ? 2 : 1;
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, 10);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Top colored accent bar on card
      ctx.fillStyle = node.color;
      ctx.beginPath();
      ctx.roundRect(cardX + 1, cardY + 1, cardW - 2, 4, [9, 9, 0, 0]);
      ctx.fill();

      // Status Tag Pill inside Card
      const tagY = cardY + 22;
      ctx.font = '700 8.5px "Plus Jakarta Sans", sans-serif';
      const tagW = ctx.measureText(node.statusTag).width + 14;
      ctx.fillStyle = node.accentBg;
      ctx.strokeStyle = node.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(cardX + 14, tagY - 9, tagW, 18, 9);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = node.badgeColor;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.statusTag, cardX + 21, tagY);

      // Card Title
      ctx.font = '700 13px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#0F172A';
      ctx.fillText(node.title, cardX + 14, cardY + 50);

      // Card Summary Bullets
      ctx.font = '400 10.5px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#475569';
      if (idx === 0) {
        ctx.fillText('• Doctors noticed cow enzyme thinned sputum', cardX + 14, cardY + 75);
        ctx.fillText('• Fatal Flaw: Inhaling animal proteins caused', cardX + 14, cardY + 93);
        ctx.fillText('  severe bronchospasm & lung irritation!', cardX + 14, cardY + 109);
        ctx.fillText('• ABANDONED for over 30 years', cardX + 14, cardY + 127);
      } else if (idx === 1) {
        ctx.fillText('• Dr. Shak envisioned cleaving "DNA clots"', cardX + 14, cardY + 75);
        ctx.fillText('• Dr. Levinson engineered CHO cell lines', cardX + 14, cardY + 93);
        ctx.fillText('  for massive recombinant expression', cardX + 14, cardY + 109);
        ctx.fillText('• Zero animal-protein allergic risk!', cardX + 14, cardY + 127);
      } else {
        ctx.fillText('• Summer 1990: Phase I human safety proven', cardX + 14, cardY + 75);
        ctx.fillText('• Phase III: +15.8% FEV₁ lung function', cardX + 14, cardY + 93);
        ctx.fillText('  and 28% reduced infectious exacerbations', cardX + 14, cardY + 109);
        ctx.fillText('• FDA approved Pulmozyme® Dec 30, 1993', cardX + 14, cardY + 127);
      }

      // Interactive Action Pill at bottom of card
      const ctaY = cardY + 152;
      ctx.fillStyle = isHovered ? node.color : '#F8FAFC';
      ctx.strokeStyle = isHovered ? node.color : '#CBD5E1';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(cardX + 14, ctaY - 11, cardW - 28, 22, 6);
      ctx.fill();
      ctx.stroke();

      ctx.font = '700 10px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = isHovered ? '#FFFFFF' : '#475569';
      ctx.fillText(isHovered ? '🔍 Click to Zoom In →' : '🔍 Explore Milestone →', cardX + cardW / 2, ctaY);
    });

    ctx.restore();
  }

  /* ========================================================
     STAGE 8: The 1950s Precursor (Cow Chewing Grass & Shrugging Scientist)
     A humorous yet clinically accurate slide explaining bovine pancreatic DNase
     ======================================================== */
  drawStage8BovineCow1950s(ctx) {
    ctx.save();

    // 1. Back to Timeline Button
    this.drawBackToTimelineButton(ctx);

    // 2. Outdoor Sunny Pasture Environment
    // Sky
    const skyGrad = ctx.createLinearGradient(0, -250, 0, 40);
    skyGrad.addColorStop(0, '#BAE6FD');
    skyGrad.addColorStop(0.7, '#E0F2FE');
    skyGrad.addColorStop(1, '#F0FDF4');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(-500, -260, 1000, 300);

    // Sunny Golden Sun in upper-left
    const sunGrad = ctx.createRadialGradient(-380, -180, 5, -380, -180, 50);
    sunGrad.addColorStop(0, '#FEF08A');
    sunGrad.addColorStop(0.4, '#FDE047');
    sunGrad.addColorStop(1, 'rgba(253, 224, 71, 0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(-380, -180, 50, 0, Math.PI * 2);
    ctx.fill();

    // Fluffy Drifting Clouds
    const cloud1X = -320 + ((this.time * 6) % 900) - 200;
    const cloud2X = 50 + ((this.time * 4.5) % 900) - 200;
    const drawCloud = (cx, cy, scale) => {
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.beginPath();
      ctx.arc(cx, cy, 22 * scale, 0, Math.PI * 2);
      ctx.arc(cx + 20 * scale, cy - 8 * scale, 28 * scale, 0, Math.PI * 2);
      ctx.arc(cx + 45 * scale, cy, 22 * scale, 0, Math.PI * 2);
      ctx.arc(cx + 25 * scale, cy + 10 * scale, 18 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };
    drawCloud(cloud1X, -170, 0.9);
    drawCloud(cloud2X, -190, 0.7);

    // Distant Rolling Green Hill
    ctx.fillStyle = '#86EFAC';
    ctx.beginPath();
    ctx.moveTo(-500, 30);
    ctx.quadraticCurveTo(-200, -30, 100, 20);
    ctx.quadraticCurveTo(350, 60, 500, 25);
    ctx.lineTo(500, 260);
    ctx.lineTo(-500, 260);
    ctx.fill();

    // Midground Split-Rail Farm Fence
    ctx.strokeStyle = '#92400E';
    ctx.lineWidth = 2.5;
    for (let fx = -420; fx <= -40; fx += 70) {
      // Posts
      ctx.beginPath();
      ctx.moveTo(fx, 4);
      ctx.lineTo(fx, 50);
      ctx.stroke();
    }
    // Rails
    ctx.beginPath();
    ctx.moveTo(-440, 14);
    ctx.lineTo(-30, 20);
    ctx.moveTo(-440, 32);
    ctx.lineTo(-30, 38);
    ctx.stroke();

    // Foreground Pasture Green Hills
    const pastureGrad = ctx.createLinearGradient(0, 30, 0, 260);
    pastureGrad.addColorStop(0, '#22C55E');
    pastureGrad.addColorStop(0.4, '#16A34A');
    pastureGrad.addColorStop(1, '#15803D');
    ctx.fillStyle = pastureGrad;
    ctx.beginPath();
    ctx.moveTo(-500, 60);
    ctx.quadraticCurveTo(-150, 15, 200, 65);
    ctx.quadraticCurveTo(380, 95, 500, 75);
    ctx.lineTo(500, 260);
    ctx.lineTo(-500, 260);
    ctx.fill();

    // Wildflowers scattered on pasture
    const drawFlower = (fx, fy, col) => {
      ctx.save();
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(fx, fy, 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(fx, fy, 1.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };
    drawFlower(-360, 110, '#FFFFFF');
    drawFlower(-320, 145, '#FEF08A');
    drawFlower(-240, 125, '#FFFFFF');
    drawFlower(-100, 150, '#FEF08A');
    drawFlower(40, 165, '#FFFFFF');

    // 3. The Holstein Dairy Cow Chewing Grass (Left / Midground)
    const cowX = -200;
    const cowY = 65;

    ctx.save();
    ctx.translate(cowX, cowY);

    // Cow Tail (swishing lazily)
    const tailAngle = Math.sin(this.time * 2.3) * 0.35;
    ctx.save();
    ctx.translate(-76, -14);
    ctx.rotate(tailAngle);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-15, 20, -12, 38);
    ctx.stroke();
    // Black bushy tail tip
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.ellipse(-12, 42, 6, 10, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Back Legs
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1.2;
    // Hind left leg
    ctx.beginPath();
    ctx.roundRect(-66, 10, 15, 52, 4);
    ctx.fill();
    ctx.stroke();
    // Hind right leg
    ctx.beginPath();
    ctx.roundRect(-44, 12, 14, 50, 4);
    ctx.fill();
    ctx.stroke();

    // Pink Udder with teats
    ctx.fillStyle = '#FBCFE8';
    ctx.beginPath();
    ctx.ellipse(-26, 26, 14, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(-32, 30, 4, 7);
    ctx.fillRect(-22, 30, 4, 7);

    // Front Legs
    // Front left leg
    ctx.beginPath();
    ctx.roundRect(32, 12, 14, 50, 4);
    ctx.fill();
    ctx.stroke();
    // Front right leg
    ctx.beginPath();
    ctx.roundRect(52, 10, 15, 52, 4);
    ctx.fill();
    ctx.stroke();

    // Black Hooves
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.roundRect(-66, 56, 15, 7, 2);
    ctx.roundRect(-44, 56, 14, 7, 2);
    ctx.roundRect(32, 56, 14, 7, 2);
    ctx.roundRect(52, 56, 15, 7, 2);
    ctx.fill();

    // Cow Torso (Main White Body)
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, 82, 38, -0.04, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Big Black Holstein Patches on Torso
    ctx.fillStyle = '#0F172A';
    // Patch 1: Rump
    ctx.beginPath();
    ctx.ellipse(-46, -10, 26, 22, 0.3, 0, Math.PI * 2);
    ctx.fill();
    // Patch 2: Mid-back
    ctx.beginPath();
    ctx.ellipse(2, -18, 22, 16, -0.2, 0, Math.PI * 2);
    ctx.fill();
    // Patch 3: Lower flank
    ctx.beginPath();
    ctx.ellipse(28, 6, 20, 16, 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Cow Neck reaching down to grass
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(60, -15);
    ctx.lineTo(95, -5);
    ctx.lineTo(82, 28);
    ctx.lineTo(52, 18);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Neck black patch
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.ellipse(72, 4, 12, 15, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Cow Head Base
    const headX = 98;
    const headY = 12;

    // Cow Horns
    ctx.fillStyle = '#E2E8F0';
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(headX - 8, headY - 26);
    ctx.quadraticCurveTo(headX - 16, headY - 38, headX - 24, headY - 32);
    ctx.quadraticCurveTo(headX - 14, headY - 28, headX - 6, headY - 22);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(headX + 4, headY - 26);
    ctx.quadraticCurveTo(headX + 12, headY - 38, headX + 20, headY - 32);
    ctx.quadraticCurveTo(headX + 10, headY - 28, headX + 2, headY - 22);
    ctx.fill();
    ctx.stroke();

    // Floppy Cow Ears (with gentle twitch)
    const earTwitch = Math.sin(this.time * 4.2) * 0.12;
    // Left ear
    ctx.save();
    ctx.translate(headX - 14, headY - 14);
    ctx.rotate(earTwitch - 0.3);
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.ellipse(0, 0, 16, 8, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Right ear
    ctx.save();
    ctx.translate(headX + 14, headY - 14);
    ctx.rotate(-earTwitch + 0.3);
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(0, 0, 16, 8, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FBCFE8';
    ctx.beginPath();
    ctx.ellipse(0, 0, 10, 4, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Head Skull
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(headX, headY - 6, 20, 24, 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Black Head Patch around Eye
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.ellipse(headX - 6, headY - 10, 12, 14, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Friendly Cow Eye with Lashes
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.ellipse(headX - 5, headY - 10, 4.5, 5.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(headX - 6, headY - 12, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Animated Rotary Chewing Jaw (Moving in circle as cow chews cud!)
    const chewX = Math.cos(this.time * 6.5) * 4.5;
    const chewY = Math.abs(Math.sin(this.time * 6.5)) * 3.2;

    // Pink Snout & Muzzle
    const snoutX = headX + 2 + chewX;
    const snoutY = headY + 12 + chewY;

    ctx.fillStyle = '#FCE7F3';
    ctx.strokeStyle = '#F472B6';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(snoutX - 16, snoutY - 10, 32, 20, 9);
    ctx.fill();
    ctx.stroke();

    // Nostrils
    ctx.fillStyle = '#BE185D';
    ctx.beginPath();
    ctx.ellipse(snoutX - 7, snoutY - 1, 3, 2, 0, 0, Math.PI * 2);
    ctx.ellipse(snoutX + 7, snoutY - 1, 3, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cheerful mouth line
    ctx.strokeStyle = '#BE185D';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(snoutX, snoutY + 3, 5, 0.1, Math.PI - 0.1);
    ctx.stroke();

    // Long Blade of Grass hanging out of cow's mouth bobbing up and down!
    const grassBaseX = snoutX + 8;
    const grassBaseY = snoutY + 4;
    const grassSway = Math.sin(this.time * 6.5 + 0.4) * 6;

    ctx.strokeStyle = '#15803D';
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.moveTo(grassBaseX, grassBaseY);
    ctx.quadraticCurveTo(grassBaseX + 16, grassBaseY + 6, grassBaseX + 24 + grassSway, grassBaseY + 18);
    ctx.stroke();

    // Grass leaf blades at tip
    ctx.fillStyle = '#22C55E';
    ctx.beginPath();
    ctx.ellipse(grassBaseX + 25 + grassSway, grassBaseY + 19, 7, 3, 0.6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore(); // Restore cow

    // Funny Thought Bubble above Cow
    const tbX = cowX + 60;
    const tbY = cowY - 120;
    // Rising bubble dots
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(tbX - 25, tbY + 45, 4, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(tbX - 18, tbY + 30, 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(tbX - 8, tbY + 14, 8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    // Main Thought Balloon
    ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(tbX - 110, tbY - 26, 220, 36, 18);
    ctx.fill();
    ctx.stroke();

    ctx.font = '700 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#0F172A';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('“Moo? Why are they taking DNase from my pancreas? 🐮💭”', tbX, tbY - 8);

    // 4. The 1950s Scientist (Foreground, Closer to Camera, Classic Shrug Expression 🤷‍♂️)
    const sciX = 220;
    const sciY = 60;

    ctx.save();
    ctx.translate(sciX, sciY);
    ctx.scale(1.32, 1.32); // Closer to camera perspective

    // Gentle breathing / shrug idle motion
    const shrugLift = -6 + Math.sin(this.time * 2.2) * 1.5;

    // Scientist Lab Table & Amber Cow DNase Medicine Bottle
    const tblX = -105;
    const tblY = 40;
    // Wooden pedestal table
    ctx.fillStyle = '#78350F';
    ctx.beginPath();
    ctx.roundRect(tblX - 26, tblY, 52, 60, 3);
    ctx.fill();
    ctx.fillStyle = '#92400E';
    ctx.fillRect(tblX - 32, tblY - 5, 64, 6);

    // Vintage 1950s Amber Medicine Bottle
    ctx.fillStyle = '#B45309'; // Amber glass
    ctx.strokeStyle = '#78350F';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(tblX - 14, tblY - 36, 28, 32, 4);
    ctx.fill();
    ctx.stroke();
    // Bottle neck & cork
    ctx.fillRect(tblX - 6, tblY - 44, 12, 8);
    ctx.fillStyle = '#D97706';
    ctx.fillRect(tblX - 5, tblY - 50, 10, 6);

    // White label on bottle
    ctx.fillStyle = '#FEF3C7';
    ctx.beginPath();
    ctx.roundRect(tblX - 12, tblY - 30, 24, 18, 2);
    ctx.fill();
    ctx.font = '700 4.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#78350F';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('BOVINE', tblX, tblY - 24);
    ctx.fillText('DNase (1955)', tblX, tblY - 18);

    // Red Warning Badge over Bottle
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.roundRect(tblX - 32, tblY - 64, 64, 14, 7);
    ctx.fill();
    ctx.font = '800 6.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('❌ ALLERGIC DISTRESS', tblX, tblY - 57);

    // --- SCIENTIST BODY ---
    // Legs & Gray Slacks
    ctx.fillStyle = '#475569';
    ctx.fillRect(-22, 65, 18, 45);
    ctx.fillRect(4, 65, 18, 45);
    // Dark Shoes
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.roundRect(-24, 106, 22, 10, 4);
    ctx.roundRect(4, 106, 22, 10, 4);
    ctx.fill();

    // White Lab Coat (Torso)
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-36, shrugLift + 10);
    ctx.lineTo(36, shrugLift + 10);
    ctx.lineTo(30, 75);
    ctx.lineTo(-30, 75);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Lab Coat Center Crease & Buttons
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, shrugLift + 20);
    ctx.lineTo(0, 75);
    ctx.stroke();
    ctx.fillStyle = '#64748B';
    for (let by = shrugLift + 26; by <= 65; by += 14) {
      ctx.beginPath(); ctx.arc(0, by, 1.8, 0, Math.PI * 2); ctx.fill();
    }

    // Shirt Collar & Skinny 1950s Necktie
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(-10, shrugLift + 8);
    ctx.lineTo(0, shrugLift + 18);
    ctx.lineTo(10, shrugLift + 8);
    ctx.fill();
    // Narrow Burgundy Tie
    ctx.fillStyle = '#881337';
    ctx.beginPath();
    ctx.moveTo(-3, shrugLift + 18);
    ctx.lineTo(3, shrugLift + 18);
    ctx.lineTo(5, shrugLift + 45);
    ctx.lineTo(0, shrugLift + 52);
    ctx.lineTo(-5, shrugLift + 45);
    ctx.closePath();
    ctx.fill();

    // Breast Pocket with Pens
    ctx.strokeStyle = '#CBD5E1';
    ctx.strokeRect(-24, shrugLift + 26, 14, 14);
    ctx.fillStyle = '#0284C7';
    ctx.fillRect(-22, shrugLift + 20, 2.5, 8); // Blue pen
    ctx.fillStyle = '#D97706';
    ctx.fillRect(-17, shrugLift + 18, 3, 10);  // Wooden ruler

    // --- THE ICONIC SHOULDER SHRUG (🤷‍♂️) ARMS & HANDS ---
    // Left Arm & Raised Open Palm (Shoulders hunched up high!)
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 13;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-28, shrugLift + 10); // Shoulder
    ctx.lineTo(-58, shrugLift + 20); // Elbow down-out
    ctx.lineTo(-68, shrugLift - 4);  // Forearm raised up!
    ctx.stroke();
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Left Open Palm Facing Up (🤷‍♂️)
    ctx.fillStyle = '#FBCFE8'; // Natural skin tone
    ctx.save();
    ctx.translate(-70, shrugLift - 7);
    ctx.beginPath();
    ctx.ellipse(0, 0, 7, 5, 0.2, 0, Math.PI * 2);
    ctx.fill();
    // 5 spread fingers facing upward/outward
    ctx.fillStyle = '#FBCFE8';
    for (let f = -3; f <= 3; f++) {
      ctx.beginPath();
      ctx.roundRect(-8 + (f + 3) * 2.3, -8, 2.4, 7, 1);
      ctx.fill();
    }
    ctx.restore();

    // Right Arm & Raised Open Palm (Shoulder hunched up high!)
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 13;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(28, shrugLift + 10);  // Shoulder
    ctx.lineTo(58, shrugLift + 20);  // Elbow down-out
    ctx.lineTo(68, shrugLift - 4);   // Forearm raised up!
    ctx.stroke();
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Right Open Palm Facing Up (🤷‍♂️)
    ctx.save();
    ctx.translate(70, shrugLift - 7);
    ctx.fillStyle = '#FBCFE8';
    ctx.beginPath();
    ctx.ellipse(0, 0, 7, 5, -0.2, 0, Math.PI * 2);
    ctx.fill();
    for (let f = -3; f <= 3; f++) {
      ctx.beginPath();
      ctx.roundRect(-8 + (f + 3) * 2.3, -8, 2.4, 7, 1);
      ctx.fill();
    }
    ctx.restore();

    // --- SCIENTIST HEAD & CLASSIC SHRUG EXPRESSION ---
    const headTilt = 0.08; // Quirky head tilt
    ctx.save();
    ctx.translate(0, shrugLift);
    ctx.rotate(headTilt);

    // Neck
    ctx.fillStyle = '#FBCFE8';
    ctx.fillRect(-7, -4, 14, 12);

    // Head Base
    ctx.beginPath();
    ctx.ellipse(0, -22, 18, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // 1950s Combed Hair (Brown, classic side parting)
    ctx.fillStyle = '#78350F';
    ctx.beginPath();
    ctx.ellipse(0, -34, 19, 12, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-19, -32);
    ctx.quadraticCurveTo(-14, -42, 6, -42);
    ctx.quadraticCurveTo(18, -40, 19, -30);
    ctx.lineTo(16, -24);
    ctx.lineTo(-18, -24);
    ctx.closePath();
    ctx.fill();

    // Big Retro 1950s Horn-Rimmed Eyeglasses
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 2.4;
    // Thick black browline frame
    ctx.beginPath();
    ctx.roundRect(-16, -29, 13, 11, 3);
    ctx.roundRect(3, -29, 13, 11, 3);
    ctx.stroke();
    // Glass bridge
    ctx.beginPath();
    ctx.moveTo(-3, -24);
    ctx.lineTo(3, -24);
    ctx.stroke();

    // Expressive Eyes Looking at Viewer (Bewildered sheepish gaze)
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(-9.5, -23.5, 2.2, 0, Math.PI * 2);
    ctx.arc(9.5, -23.5, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-10.2, -24.5, 0.9, 0, Math.PI * 2);
    ctx.arc(8.8, -24.5, 0.9, 0, Math.PI * 2);
    ctx.fill();

    // Asymmetric Raised Eyebrows (Right eyebrow arched quizzically high!)
    ctx.strokeStyle = '#78350F';
    ctx.lineWidth = 1.8;
    ctx.lineCap = 'round';
    // Left eyebrow (slightly raised)
    ctx.beginPath();
    ctx.moveTo(-16, -33);
    ctx.quadraticCurveTo(-10, -36, -4, -33);
    ctx.stroke();
    // Right eyebrow (arched way high in bewilderment!)
    ctx.beginPath();
    ctx.moveTo(4, -33);
    ctx.quadraticCurveTo(11, -39, 17, -35);
    ctx.stroke();

    // Crooked Sheepish Smirk / Shrug Mouth (¯\_(ツ)_/¯)
    ctx.strokeStyle = '#BE185D';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(-9, -10);
    ctx.quadraticCurveTo(-2, -9, 4, -12);
    ctx.quadraticCurveTo(10, -15, 11, -11);
    ctx.stroke();

    // Comic Blue Sweat Drop floating near temple for comedic relief!
    const sweatSway = Math.sin(this.time * 3.5) * 1.5;
    ctx.fillStyle = '#38BDF8';
    ctx.beginPath();
    ctx.moveTo(19, -32 + sweatSway);
    ctx.quadraticCurveTo(24, -28 + sweatSway, 23, -24 + sweatSway);
    ctx.arc(20.5, -24 + sweatSway, 2.5, 0, Math.PI);
    ctx.closePath();
    ctx.fill();

    ctx.restore(); // Restore head
    ctx.restore(); // Restore scientist

    // 5. Header Area & Educational Cards
    // Top Title Badge
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(-210, -232, 420, 26, 13);
    ctx.fill();
    ctx.stroke();

    ctx.font = '700 9.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#D97706';
    ctx.fillText('● THE 1950s PRECURSOR: BOVINE PANCREATIC DNase', 0, -219);

    // Main Heading
    ctx.font = '800 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#0F172A';
    ctx.fillText('The Bovine Dead-End: Right Target, Wrong Source!', 0, -190);

    // Subtitle
    ctx.font = '500 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText('Cow enzymes proved DNA was the culprit, but inhaling foreign animal proteins was toxic.', 0, -165);

    // Bottom Educational Reality Card (Bottom Left)
    const infoX = -450;
    const infoY = 135;
    const infoW = 430;
    const infoH = 95;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(infoX, infoY, infoW, infoH, 8);
    ctx.fill();
    ctx.stroke();

    // Red warning accent stripe on card
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.roundRect(infoX + 1, infoY + 1, infoW - 2, 4, [7, 7, 0, 0]);
    ctx.fill();

    ctx.font = '700 11.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#DC2626';
    ctx.textAlign = 'left';
    ctx.fillText('⚠️ SEVERE LUNG IRRITATION & ANAPHYLAXIS:', infoX + 16, infoY + 22);

    ctx.font = '400 10.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#334155';
    ctx.fillText('• 1950s Discovery: Bovine pancreatic DNase thinned CF mucus by cleaving DNA.', infoX + 16, infoY + 42);
    ctx.fillText('• The Animal Flaw: Inhaling foreign cow proteins caused acute allergic bronchospasm.', infoX + 16, infoY + 60);
    ctx.fillText('• Abandoned: Discarded for >30 years until human recombinant DNA cloning!', infoX + 16, infoY + 78);

    ctx.restore();
  }

  /* ========================================================
     STAGE 9: High-Fidelity Animated Historical Laboratory Scene (1988–1989)
     Featuring Dr. Steven Shak and Dr. Art Levinson in exact archival poses
     ======================================================== */
  drawStage9GenentechLabAnimated(ctx) {
    ctx.save();

    // Floating Back to Timeline Button
    this.drawBackToTimelineButton(ctx);

    const benchY = 95;

    // 1. Room Background Wall (Soft cool neutral lab wall)
    ctx.fillStyle = '#F1F5F9';
    ctx.fillRect(-650, -320, 1300, 415);

    // Subtle wall baseboard molding above bench
    ctx.fillStyle = '#E2E8F0';
    ctx.fillRect(-650, benchY - 6, 1300, 6);

    // 2. Left Daylight Window (South San Francisco Biotech Bay View)
    const winX = -490;
    const winY = -260;
    const winW = 140;
    const winH = benchY - winY - 6;

    // Sky gradient through glass
    const skyGrad = ctx.createLinearGradient(0, winY, 0, benchY);
    skyGrad.addColorStop(0, '#BAE6FD');
    skyGrad.addColorStop(0.65, '#E0F2FE');
    skyGrad.addColorStop(1, '#F8FAFC');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(winX, winY, winW, winH);

    // Distant San Francisco Bay hills silhouette
    ctx.fillStyle = '#CBD5E1';
    ctx.beginPath();
    ctx.moveTo(winX, benchY - 40);
    ctx.quadraticCurveTo(winX + 40, benchY - 65, winX + 80, benchY - 45);
    ctx.quadraticCurveTo(winX + 115, benchY - 60, winX + winW, benchY - 35);
    ctx.lineTo(winX + winW, benchY);
    ctx.lineTo(winX, benchY);
    ctx.closePath();
    ctx.fill();

    // Aluminum Window Mullions & Frame
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 3.5;
    ctx.strokeRect(winX, winY, winW, winH);
    ctx.beginPath();
    ctx.moveTo(winX + winW * 0.5, winY);
    ctx.lineTo(winX + winW * 0.5, winY + winH);
    ctx.moveTo(winX, winY + winH * 0.45);
    ctx.lineTo(winX + winW, winY + winH * 0.45);
    ctx.stroke();

    // Soft daylight beam spilling across left wall
    const sunbeam = ctx.createLinearGradient(winX + winW, winY, winX + winW + 220, benchY);
    sunbeam.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    sunbeam.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = sunbeam;
    ctx.beginPath();
    ctx.moveTo(winX + winW, winY);
    ctx.lineTo(winX + winW + 200, benchY);
    ctx.lineTo(winX + winW, benchY);
    ctx.closePath();
    ctx.fill();

    // 3. Wooden Chemical Reagent Shelves (Upper Center Wall)
    const shelfX = -135;
    const shelfW = 280;

    // Metal L-brackets
    ctx.fillStyle = '#64748B';
    [-90, 0, 90].forEach(bx => {
      ctx.fillRect(bx - 3, -170, 6, 25);
      ctx.fillRect(bx - 3, -95, 6, 25);
    });

    // Solid honey oak shelves
    const drawShelf = (sy) => {
      ctx.fillStyle = '#B45309';
      ctx.fillRect(shelfX, sy, shelfW, 9);
      ctx.fillStyle = '#78350F';
      ctx.fillRect(shelfX, sy + 7, shelfW, 2);
      ctx.fillStyle = '#D97706';
      ctx.fillRect(shelfX, sy, shelfW, 2);
    };
    drawShelf(-170);
    drawShelf(-95);

    // Reagent Bottles on Shelves (Amber Winchester, Pyrex Clear Media, Erlenmeyer)
    const shelfBottles = [
      // Top Shelf (-170)
      { x: -120, y: -170, w: 18, h: 32, type: 'amber', label: 'NaCl 5M' },
      { x: -95, y: -170, w: 22, h: 36, type: 'amber', label: 'CaCl2' },
      { x: -65, y: -170, w: 16, h: 28, type: 'blue-media', label: 'RPMI' },
      { x: -42, y: -170, w: 20, h: 34, type: 'amber', label: 'Tris-HCl' },
      { x: -15, y: -170, w: 24, h: 38, type: 'amber', label: 'EDTA' },
      { x: 18, y: -170, w: 18, h: 30, type: 'clear', label: 'CHO Feed' },
      { x: 45, y: -170, w: 22, h: 35, type: 'amber', label: 'DTT' },
      { x: 75, y: -170, w: 20, h: 32, type: 'blue-media', label: 'MEM' },
      { x: 105, y: -170, w: 16, h: 26, type: 'amber', label: 'Ethanol' },

      // Bottom Shelf (-95)
      { x: -110, y: -95, w: 22, h: 34, type: 'amber', label: 'rhDNase' },
      { x: -80, y: -95, w: 18, h: 28, type: 'clear', label: 'Buffer A' },
      { x: -55, y: -95, w: 20, h: 30, type: 'amber', label: 'Buffer B' },
      { x: -28, y: -95, w: 24, h: 38, type: 'flask', label: '100mL' },
      { x: 5, y: -95, w: 20, h: 32, type: 'blue-media', label: 'FBS 10%' },
      { x: 35, y: -95, w: 22, h: 35, type: 'amber', label: 'Protease' },
      { x: 68, y: -95, w: 18, h: 28, type: 'amber', label: 'L-Gln' },
      { x: 95, y: -95, w: 22, h: 33, type: 'clear', label: 'dH2O' }
    ];

    shelfBottles.forEach(b => {
      if (b.type === 'amber') {
        ctx.fillStyle = '#78350F';
        ctx.beginPath();
        ctx.roundRect(b.x, b.y - b.h, b.w, b.h, [3, 3, 1, 1]);
        ctx.fill();
        // White label
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(b.x + 2, b.y - b.h + 8, b.w - 4, b.h - 14);
        ctx.fillStyle = '#1E293B';
        ctx.fillRect(b.x + 3, b.y - b.h + 11, b.w - 6, 1.5);
        // Black cap
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(b.x + b.w * 0.2, b.y - b.h - 5, b.w * 0.6, 5);
      } else if (b.type === 'blue-media') {
        ctx.fillStyle = 'rgba(224, 242, 254, 0.8)';
        ctx.strokeStyle = '#64748B';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(b.x, b.y - b.h, b.w, b.h, [2, 2, 1, 1]);
        ctx.fill();
        ctx.stroke();
        // Pink fluid
        ctx.fillStyle = 'rgba(244, 114, 182, 0.65)';
        ctx.fillRect(b.x + 1, b.y - b.h * 0.7, b.w - 2, b.h * 0.7 - 1);
        // Blue Pyrex screw cap
        ctx.fillStyle = '#0284C7';
        ctx.fillRect(b.x + b.w * 0.15, b.y - b.h - 6, b.w * 0.7, 6);
      } else if (b.type === 'flask') {
        ctx.strokeStyle = '#64748B';
        ctx.lineWidth = 1.2;
        ctx.fillStyle = 'rgba(254, 240, 138, 0.35)';
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(b.x + b.w * 0.35, b.y - b.h);
        ctx.lineTo(b.x + b.w * 0.65, b.y - b.h);
        ctx.lineTo(b.x + b.w, b.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillStyle = 'rgba(241, 245, 249, 0.85)';
        ctx.strokeStyle = '#94A3B8';
        ctx.lineWidth = 1;
        ctx.strokeRect(b.x, b.y - b.h, b.w, b.h);
        ctx.fillRect(b.x, b.y - b.h, b.w, b.h);
        ctx.fillStyle = '#0284C7';
        ctx.fillRect(b.x + 2, b.y - b.h * 0.5, b.w - 4, b.h * 0.5 - 1);
      }
    });

    // 4. Cork Bulletin Board (Far Right Wall)
    const corkX = 250;
    const corkY = -245;
    const corkW = 210;
    const corkH = 125;

    // Wooden Frame & Cork Surface
    ctx.fillStyle = '#B45309';
    ctx.fillRect(corkX - 5, corkY - 5, corkW + 10, corkH + 10);
    ctx.fillStyle = '#D97706';
    ctx.fillRect(corkX, corkY, corkW, corkH);
    ctx.strokeStyle = '#92400E';
    ctx.lineWidth = 1;
    ctx.strokeRect(corkX, corkY, corkW, corkH);

    // Pinned Protocol Sheets matching archival photo
    // Memo 1: CHO-K1 Cell Culture Schedule
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(corkX + 12, corkY + 12, 85, 95);
    ctx.fillStyle = '#EF4444'; // Red pushpin
    ctx.beginPath();
    ctx.arc(corkX + 54, corkY + 16, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = '700 7px "JetBrains Mono", monospace';
    ctx.fillStyle = '#0F172A';
    ctx.fillText('CHO-K1 RUN #4', corkX + 18, corkY + 30);
    ctx.font = '500 6px "JetBrains Mono", monospace';
    ctx.fillStyle = '#475569';
    ctx.fillText('Feb 14: Culture 4A', corkX + 18, corkY + 44);
    ctx.fillText('Feb 16: Confluence', corkX + 18, corkY + 56);
    ctx.fillText('Feb 19: Purif rhDNase', corkX + 18, corkY + 68);
    ctx.fillText('Harvest: 10L Spin', corkX + 18, corkY + 80);
    ctx.fillText('Lot #8804 Validated', corkX + 18, corkY + 92);

    // Memo 2: DNase 1 Sputum Assay Log
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(corkX + 108, corkY + 18, 90, 85);
    ctx.fillStyle = '#F59E0B'; // Yellow pushpin
    ctx.beginPath();
    ctx.arc(corkX + 153, corkY + 22, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = '700 7px "JetBrains Mono", monospace';
    ctx.fillStyle = '#0F172A';
    ctx.fillText('DNase-1 Assay', corkX + 114, corkY + 34);
    ctx.font = '500 6px "JetBrains Mono", monospace';
    ctx.fillStyle = '#475569';
    ctx.fillText('CF Sputum Liquefac', corkX + 114, corkY + 48);
    ctx.fillText('Initial: 12,000 cP', corkX + 114, corkY + 60);
    ctx.fillText('Post-rhDNase: 15 cP', corkX + 114, corkY + 72);
    ctx.fillStyle = '#059669';
    ctx.fillText('RESULT: CLEAVED ✓', corkX + 114, corkY + 86);

    // 5. Black Epoxy Laboratory Countertop (benchY = 95)
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(-650, benchY, 1300, 20);
    // Beveled highlight edge
    ctx.fillStyle = '#334155';
    ctx.fillRect(-650, benchY, 1300, 2.5);

    // 6. Under-Bench Cabinetry (Wood panel doors, compact bottom section)
    ctx.fillStyle = '#9A3412';
    ctx.fillRect(-650, benchY + 20, 1300, 180);
    ctx.fillStyle = '#78350F';
    ctx.fillRect(-650, benchY + 20, 1300, 3);

    // Cabinet Doors with recessed panels
    for (let cx = -580; cx <= 520; cx += 150) {
      ctx.fillStyle = '#B45309';
      ctx.fillRect(cx, benchY + 28, 135, 150);
      ctx.strokeStyle = '#78350F';
      ctx.lineWidth = 2;
      ctx.strokeRect(cx, benchY + 28, 135, 150);

      // Inset wood panel
      ctx.fillStyle = '#9A3412';
      ctx.fillRect(cx + 10, benchY + 38, 115, 130);
      ctx.strokeStyle = '#78350F';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(cx + 10, benchY + 38, 115, 130);

      // Antique bronze round door knob
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(cx + 120, benchY + 95, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#78350F';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // 7. Equipment on Left Bench (next to Dr. Shak)
    // Red Microcentrifuge Tube Rack
    ctx.fillStyle = '#DC2626';
    ctx.fillRect(-345, benchY - 14, 42, 14);
    for (let r = 0; r < 4; r++) {
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(-339 + r * 10, benchY - 15, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Erlenmeyer Flask with clear buffer
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 1.2;
    ctx.fillStyle = 'rgba(224, 242, 254, 0.4)';
    ctx.beginPath();
    ctx.moveTo(-368, benchY);
    ctx.lineTo(-358, benchY - 32);
    ctx.lineTo(-354, benchY - 32);
    ctx.lineTo(-344, benchY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 8. FIGURE 1: DR. STEVEN SHAK (In exact archival 1989 pose)
    this.drawAnimatedDrShak(ctx, benchY);

    // 9. EQUIPMENT CENTER-RIGHT: BIO-FLO II BIOREACTOR & CRT MONITOR
    this.drawAnimatedBioreactorAndCrt(ctx, benchY);

    // 10. FIGURE 2: DR. ART LEVINSON (In exact archival 1989 pose)
    this.drawAnimatedDrLevinson(ctx, benchY);

    // 11. REAL ARCHIVAL 1989 FACE PORTRAITS BESIDE EACH SCIENTIST
    this.drawRealPhotoPortrait(ctx, -350, -115, this.shakFaceImg, 'Dr. Steven Shak', '#0284C7');
    this.drawRealPhotoPortrait(ctx, -70, -115, this.levinsonFaceImg, 'Dr. Art Levinson', '#7C3AED');

    // 12. SCIENTIFIC CALLOUT BADGES (Positioned cleanly, ZERO overlap with faces/hands)
    this.drawCallout(ctx, -240, -145, -360, -215, 'Dr. Steven Shak (Pulmonary Physician-Scientist)', '#0284C7');
    this.drawCallout(ctx, -185, 75, -135, 135, 'CF Sputum Liquefaction Test Tube (12,000 cP → 15 cP)', '#D97706');
    this.drawCallout(ctx, 40, -145, 70, -215, 'Dr. Art Levinson (Molecular Biologist & Genentech CEO)', '#7C3AED');
    this.drawCallout(ctx, 180, 25, 180, -65, 'CHO Cell Bioreactor (BIO-FLO II)', '#059669');
    this.drawCallout(ctx, 365, -10, 310, -95, 'HPLC Recombinant 37 kDa DNase Peak', '#0284C7');

    ctx.restore();
  }

  /* ========================================================
     High-Detail Animated Figure: Dr. Steven Shak
     Pose: Leaning over bench, brown parted hair, spectacles,
     mustache, white coat with "CHO-K1 8804", blue gloves holding
     pipette with orange bulb and CF sputum test tube!
     ======================================================== */
  drawAnimatedDrShak(ctx, benchY) {
    ctx.save();
    const bx = -240;
    const breath = Math.sin(this.time * 2.0) * 1.5;

    // Body shadow on floor/bench area
    ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
    ctx.beginPath();
    ctx.ellipse(bx - 10, benchY + 45, 75, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // ==========================================
    // 1. LAB COAT TORSO & LOWER BODY (Waist-Up)
    // ==========================================
    // Coat Silhouette
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bx - 70, -45 + breath); // Left shoulder
    ctx.quadraticCurveTo(bx - 85, 30, bx - 80, benchY + 65); // Left flank down past bench
    ctx.lineTo(bx + 65, benchY + 65); // Hem
    ctx.quadraticCurveTo(bx + 60, 30, bx + 55, -45 + breath); // Right shoulder
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Lab coat fabric fold shadows
    ctx.fillStyle = 'rgba(226, 232, 240, 0.6)';
    ctx.beginPath();
    ctx.moveTo(bx - 65, 10 + breath);
    ctx.quadraticCurveTo(bx - 45, 45, bx - 60, benchY + 60);
    ctx.lineTo(bx - 75, benchY + 60);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(bx + 35, 10 + breath);
    ctx.quadraticCurveTo(bx + 45, 45, bx + 50, benchY + 60);
    ctx.lineTo(bx + 60, benchY + 60);
    ctx.closePath();
    ctx.fill();

    // Open Collar Lapels & Pinstriped Dress Shirt
    // Dress Shirt Background (Pale blue with thin vertical stripes)
    ctx.fillStyle = '#BAE6FD';
    ctx.beginPath();
    ctx.moveTo(bx - 26, -58 + breath);
    ctx.lineTo(bx + 8, -58 + breath);
    ctx.lineTo(bx - 6, -18 + breath);
    ctx.closePath();
    ctx.fill();

    // Shirt Pinstripes
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 1;
    [-20, -14, -8, -2, 4].forEach(px => {
      ctx.beginPath();
      ctx.moveTo(bx + px, -58 + breath);
      ctx.lineTo(bx + px * 0.7 - 5, -18 + breath);
      ctx.stroke();
    });

    // White Shirt Collar Points
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(bx - 28, -62 + breath);
    ctx.lineTo(bx - 14, -46 + breath);
    ctx.lineTo(bx - 18, -62 + breath);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(bx + 10, -62 + breath);
    ctx.lineTo(bx - 2, -46 + breath);
    ctx.lineTo(bx + 2, -62 + breath);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // White Lab Coat Notch Lapels
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1.8;
    // Left Lapel
    ctx.beginPath();
    ctx.moveTo(bx - 28, -60 + breath);
    ctx.lineTo(bx - 36, -38 + breath);
    ctx.lineTo(bx - 28, -35 + breath);
    ctx.lineTo(bx - 8, -15 + breath);
    ctx.lineTo(bx - 15, -60 + breath);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Right Lapel
    ctx.beginPath();
    ctx.moveTo(bx + 10, -60 + breath);
    ctx.lineTo(bx + 18, -38 + breath);
    ctx.lineTo(bx + 10, -35 + breath);
    ctx.lineTo(bx - 8, -15 + breath);
    ctx.lineTo(bx, -60 + breath);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Center Placket & Buttons
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(bx - 8, -15 + breath);
    ctx.lineTo(bx - 8, benchY + 60);
    ctx.stroke();

    // Round White Buttons with Thread Cross
    for (let b = 0; b < 3; b++) {
      const by = 8 + b * 26 + breath;
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(bx - 8, by, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#64748B';
      ctx.fillRect(bx - 9.5, by - 0.7, 3, 1.4);
    }

    // Breast Pocket on Left Chest (Viewer's right)
    const pockX = bx + 16;
    const pockY = -12 + breath;
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(pockX, pockY, 34, 30);

    // Authentic Archival Cloth Tag: "CHO-K1 / 8804"
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(pockX + 3, pockY + 4, 28, 22);
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 0.8;
    ctx.strokeRect(pockX + 3, pockY + 4, 28, 22);

    ctx.font = '700 6.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#0F172A';
    ctx.textAlign = 'center';
    ctx.fillText('CHO-K1', pockX + 17, pockY + 13);
    ctx.font = '700 7px "JetBrains Mono", monospace';
    ctx.fillText('8804', pockX + 17, pockY + 22);
    ctx.textAlign = 'left';

    // ==========================================
    // 2. NECK, HEAD & REALISTIC FACIAL FEATURES
    // ==========================================
    // Neck
    const neckY = -68 + breath;
    const neckGrad = ctx.createLinearGradient(bx - 26, 0, bx + 10, 0);
    neckGrad.addColorStop(0, '#F8D2BA');
    neckGrad.addColorStop(0.5, '#E5A88B');
    neckGrad.addColorStop(1, '#D48B6C');
    ctx.fillStyle = neckGrad;
    ctx.beginPath();
    ctx.moveTo(bx - 22, neckY - 20);
    ctx.lineTo(bx - 22, neckY + 8);
    ctx.lineTo(bx + 4, neckY + 8);
    ctx.lineTo(bx + 4, neckY - 20);
    ctx.closePath();
    ctx.fill();

    // Adam's Apple shadow
    ctx.fillStyle = 'rgba(180, 83, 9, 0.2)';
    ctx.beginPath();
    ctx.moveTo(bx - 12, neckY - 6);
    ctx.lineTo(bx - 6, neckY);
    ctx.lineTo(bx - 12, neckY + 4);
    ctx.closePath();
    ctx.fill();

    // Cranium & Face Contour
    const hy = -120 + breath;
    const faceGrad = ctx.createLinearGradient(bx - 40, hy - 40, bx + 20, hy + 30);
    faceGrad.addColorStop(0, '#FFF2E8'); // Highlight from left window
    faceGrad.addColorStop(0.4, '#F8D2BA'); // Caucasian base
    faceGrad.addColorStop(1, '#E5A88B'); // Warm jaw shadow
    ctx.fillStyle = faceGrad;

    ctx.beginPath();
    ctx.moveTo(bx - 32, hy - 18); // Left temple
    ctx.quadraticCurveTo(bx - 35, hy + 10, bx - 26, hy + 26); // Jaw curve
    ctx.quadraticCurveTo(bx - 15, hy + 38, bx - 6, hy + 36); // Chin
    ctx.quadraticCurveTo(bx + 14, hy + 34, bx + 16, hy + 18); // Right jaw
    ctx.quadraticCurveTo(bx + 20, hy - 10, bx + 14, hy - 25); // Right forehead
    ctx.quadraticCurveTo(bx - 6, hy - 42, bx - 32, hy - 18); // Crown
    ctx.closePath();
    ctx.fill();

    // Ear (Left side)
    const earX = bx - 34;
    const earY = hy + 2;
    ctx.fillStyle = '#E5A88B';
    ctx.beginPath();
    ctx.ellipse(earX, earY, 6, 11, 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#D48B6C';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(earX, earY - 2, 4, Math.PI * 0.5, Math.PI * 1.8);
    ctx.stroke();

    // Authentic Hair: Neatly parted on left, combed across, receded temples
    ctx.fillStyle = '#361608'; // Dark umber base
    ctx.beginPath();
    ctx.moveTo(earX + 1, earY - 10);
    ctx.quadraticCurveTo(bx - 38, hy - 32, bx - 26, hy - 40);
    ctx.quadraticCurveTo(bx - 6, hy - 46, bx + 12, hy - 32);
    ctx.quadraticCurveTo(bx + 18, hy - 15, bx + 16, hy - 8);
    // Forehead hairline (Natural 1989 receding hairline)
    ctx.quadraticCurveTo(bx + 8, hy - 20, bx - 4, hy - 18);
    ctx.quadraticCurveTo(bx - 16, hy - 24, bx - 28, hy - 16);
    ctx.lineTo(earX + 2, earY - 2);
    ctx.closePath();
    ctx.fill();

    // Hair Strands & Highlights
    ctx.strokeStyle = '#783B1D';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(bx - 26, hy - 38);
    ctx.quadraticCurveTo(bx - 6, hy - 42, bx + 10, hy - 30);
    ctx.moveTo(bx - 28, hy - 32);
    ctx.quadraticCurveTo(bx - 10, hy - 36, bx + 8, hy - 24);
    ctx.stroke();

    // Forehead Creases of Concentration
    ctx.strokeStyle = 'rgba(180, 83, 9, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(bx - 20, hy - 10);
    ctx.lineTo(bx + 2, hy - 10);
    ctx.moveTo(bx - 18, hy - 6);
    ctx.lineTo(bx, hy - 6);
    ctx.stroke();

    // Eyebrows (Arched brown brows furrowed downward in focus)
    ctx.fillStyle = '#361608';
    ctx.beginPath();
    ctx.moveTo(bx - 24, hy + 2);
    ctx.quadraticCurveTo(bx - 15, hy - 2, bx - 6, hy + 3);
    ctx.lineTo(bx - 7, hy + 6);
    ctx.quadraticCurveTo(bx - 16, hy + 1, bx - 23, hy + 5);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(bx - 1, hy + 3);
    ctx.quadraticCurveTo(bx + 8, hy - 1, bx + 16, hy + 3);
    ctx.lineTo(bx + 15, hy + 6);
    ctx.quadraticCurveTo(bx + 7, hy + 2, bx, hy + 6);
    ctx.closePath();
    ctx.fill();

    // Eyes (Concentrated gaze looking down toward test tube!)
    const drawEye = (ex, ey) => {
      // Sclera
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(ex, ey, 5.5, 3.2, 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#D48B6C';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Dark brown iris looking down
      ctx.fillStyle = '#451A03';
      ctx.beginPath();
      ctx.arc(ex + 0.8, ey + 0.8, 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Pupil
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.arc(ex + 0.8, ey + 0.8, 1.2, 0, Math.PI * 2);
      ctx.fill();

      // Specular catchlight
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(ex + 0.2, ey + 0.3, 0.7, 0, Math.PI * 2);
      ctx.fill();

      // Eyelid line
      ctx.strokeStyle = '#52220E';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(ex - 6, ey - 1);
      ctx.quadraticCurveTo(ex, ey - 3.5, ex + 6, ey - 0.5);
      ctx.stroke();
    };
    drawEye(bx - 15, hy + 7);
    drawEye(bx + 7, hy + 7);

    // Nose (Caucasian straight bridge with shaded tip & nostril)
    ctx.fillStyle = 'rgba(212, 139, 108, 0.45)';
    ctx.beginPath();
    ctx.moveTo(bx - 5, hy + 5);
    ctx.lineTo(bx - 7, hy + 20);
    ctx.lineTo(bx - 2, hy + 21);
    ctx.lineTo(bx - 3, hy + 5);
    ctx.closePath();
    ctx.fill();

    // Nose tip highlight
    ctx.fillStyle = '#FFF2E8';
    ctx.beginPath();
    ctx.arc(bx - 5, hy + 19, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Nostril aperture
    ctx.fillStyle = '#451A03';
    ctx.beginPath();
    ctx.ellipse(bx - 2, hy + 20, 1.5, 1, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Authentic 1989 Chevron Brown Mustache!
    ctx.fillStyle = '#361608';
    ctx.beginPath();
    ctx.moveTo(bx - 17, hy + 25);
    ctx.quadraticCurveTo(bx - 5, hy + 20, bx + 6, hy + 25);
    ctx.quadraticCurveTo(bx + 9, hy + 30, bx + 4, hy + 31);
    ctx.quadraticCurveTo(bx - 5, hy + 28, bx - 14, hy + 31);
    ctx.closePath();
    ctx.fill();

    // Mustache hair texture strokes
    ctx.strokeStyle = '#783B1D';
    ctx.lineWidth = 1;
    for (let m = -14; m <= 4; m += 3) {
      ctx.beginPath();
      ctx.moveTo(bx + m, hy + 23);
      ctx.lineTo(bx + m + 1, hy + 29);
      ctx.stroke();
    }

    // Lower Lip & Chin
    ctx.fillStyle = '#E29578';
    ctx.beginPath();
    ctx.ellipse(bx - 5, hy + 33, 4, 1.8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Chin indentation
    ctx.strokeStyle = 'rgba(180, 83, 9, 0.3)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(bx - 5, hy + 37, 4, Math.PI * 0.2, Math.PI * 0.8);
    ctx.stroke();

    // Double-Bridge Wire Aviator Spectacles
    ctx.strokeStyle = '#B45309'; // Gold/bronze wire frame
    ctx.lineWidth = 1.4;

    // Left Lens Frame
    ctx.strokeRect(bx - 23, hy + 1, 16, 13);
    // Right Lens Frame
    ctx.strokeRect(bx - 1, hy + 1, 16, 13);

    // Top straight brow bar
    ctx.beginPath();
    ctx.moveTo(bx - 23, hy + 1);
    ctx.lineTo(bx + 15, hy + 1);
    ctx.stroke();

    // Lower curved nose bridge
    ctx.beginPath();
    ctx.moveTo(bx - 7, hy + 6);
    ctx.lineTo(bx - 1, hy + 6);
    ctx.stroke();

    // Wire Temple to ear
    ctx.beginPath();
    ctx.moveTo(bx - 23, hy + 3);
    ctx.lineTo(earX + 2, earY - 4);
    ctx.stroke();

    // Specular diagonal glare streak on glass lenses
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(bx - 21, hy + 11);
    ctx.lineTo(bx - 11, hy + 3);
    ctx.moveTo(bx + 1, hy + 11);
    ctx.lineTo(bx + 11, hy + 3);
    ctx.stroke();

    // ==========================================
    // 3. ARMS, GLOVED HANDS & ARCHIVAL EXPERIMENT
    // ==========================================
    const tubeX = bx + 55;
    const tubeY = 15;

    // LEFT ARM & HAND HOLDING TEST TUBE
    // White sleeve reaching forward-right
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(bx - 60, -25 + breath);
    ctx.lineTo(bx - 15, 25 + breath);
    ctx.lineTo(tubeX - 10, 48);
    ctx.stroke();

    // Sleeve outline & crease
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bx - 60, -15 + breath);
    ctx.lineTo(bx - 15, 35 + breath);
    ctx.lineTo(tubeX - 12, 58);
    ctx.stroke();

    // Royal Blue Nitrile Glove on Left Hand
    ctx.fillStyle = '#2563EB';
    ctx.beginPath();
    ctx.roundRect(tubeX - 22, 38, 18, 22, 6);
    ctx.fill();

    // Fingers gripping cylindrical tube
    ctx.fillStyle = '#1D4ED8';
    for (let f = 0; f < 3; f++) {
      ctx.beginPath();
      ctx.roundRect(tubeX - 6, 40 + f * 7, 12, 6, 2.5);
      ctx.fill();
    }
    // Thumb resting on tube
    ctx.fillStyle = '#3B82F6';
    ctx.beginPath();
    ctx.ellipse(tubeX - 12, 44, 4, 7, -0.4, 0, Math.PI * 2);
    ctx.fill();

    // Glass Test Tube in Left Hand
    const tubeW = 12;
    const tubeH = 68;

    // Clear Pyrex Tube Glass
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(tubeX - tubeW * 0.5, tubeY);
    ctx.lineTo(tubeX - tubeW * 0.5, tubeY + tubeH - 6);
    ctx.arc(tubeX, tubeY + tubeH - 6, tubeW * 0.5, Math.PI, 0, true);
    ctx.lineTo(tubeX + tubeW * 0.5, tubeY);
    ctx.stroke();

    // Glass rim collar
    ctx.strokeRect(tubeX - tubeW * 0.5 - 2, tubeY - 2, tubeW + 4, 3);

    // Liquid in Test Tube (Dynamic enzymatic liquefaction from rhDNase!)
    const liqH = tubeH - 24;
    const liqTop = tubeY + 24;
    const liqGrad = ctx.createLinearGradient(0, liqTop, 0, tubeY + tubeH);
    if (this.liquefactionProgress < 0.6) {
      liqGrad.addColorStop(0, '#FACC15'); // Thick yellow purulent sputum
      liqGrad.addColorStop(1, '#CA8A04');
    } else {
      liqGrad.addColorStop(0, '#E0F2FE'); // Crystal clear liquefied fluid
      liqGrad.addColorStop(1, '#38BDF8');
    }
    ctx.fillStyle = liqGrad;
    ctx.beginPath();
    ctx.moveTo(tubeX - tubeW * 0.5 + 1.5, liqTop);
    ctx.lineTo(tubeX - tubeW * 0.5 + 1.5, tubeY + tubeH - 6);
    ctx.arc(tubeX, tubeY + tubeH - 6, tubeW * 0.5 - 1.5, Math.PI, 0, true);
    ctx.lineTo(tubeX + tubeW * 0.5 - 1.5, liqTop);
    ctx.closePath();
    ctx.fill();

    // Glass highlight streak
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(tubeX - 3, tubeY + 4);
    ctx.lineTo(tubeX - 3, tubeY + tubeH - 8);
    ctx.stroke();

    // RIGHT ARM & HAND HOLDING BULB PIPETTE
    // White lab coat sleeve rising up
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(bx + 45, -35 + breath);
    ctx.lineTo(bx + 15, -60 + breath);
    ctx.lineTo(bx - 12, -30 + breath);
    ctx.stroke();

    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bx + 45, -25 + breath);
    ctx.lineTo(bx + 15, -50 + breath);
    ctx.lineTo(bx - 12, -20 + breath);
    ctx.stroke();

    // Royal Blue Nitrile Glove on Right Hand
    const handX = bx - 14;
    const handY = -28 + breath;
    ctx.fillStyle = '#2563EB';
    ctx.beginPath();
    ctx.arc(handX, handY, 9, 0, Math.PI * 2);
    ctx.fill();

    // Grip fingers
    ctx.fillStyle = '#1D4ED8';
    ctx.beginPath();
    ctx.roundRect(handX - 5, handY - 8, 10, 16, 3);
    ctx.fill();

    // Pipette Assembly: Orange Bulb + Borosilicate Stem
    const bulbPulse = Math.sin(this.time * 6) * 1.5;
    const bulbX = handX - 8;
    const bulbY = handY - 26;

    // Orange Rubber Bulb
    ctx.fillStyle = '#EA580C';
    ctx.beginPath();
    ctx.ellipse(bulbX, bulbY, 8 + bulbPulse, 12, -0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#C2410C';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Bulb highlight
    ctx.fillStyle = '#FB923C';
    ctx.beginPath();
    ctx.ellipse(bulbX - 2, bulbY - 3, 3, 6, -0.25, 0, Math.PI * 2);
    ctx.fill();

    // Glass Pipette Stem (Angled precisely into the test tube mouth!)
    const tipX = tubeX - 1;
    const tipY = tubeY + 4;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(bulbX + 4, bulbY + 12);
    ctx.lineTo(tipX, tipY);
    ctx.stroke();

    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(bulbX + 4, bulbY + 12);
    ctx.lineTo(tipX, tipY);
    ctx.stroke();

    // Fluid column inside pipette
    ctx.strokeStyle = '#06B6D4';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(bulbX + 4, bulbY + 18);
    ctx.lineTo(tipX, tipY);
    ctx.stroke();

    // Animated Falling Micro-droplet of rhDNase into Tube
    const dropY = tipY + this.labDropProgress * (liqTop - tipY);
    ctx.fillStyle = '#06B6D4';
    ctx.beginPath();
    ctx.arc(tipX, dropY, 2.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /* ========================================================
     High-Detail Equipment: BIO-FLO II Bioreactor & CRT Monitor
     ======================================================== */
  drawAnimatedBioreactorAndCrt(ctx, benchY) {
    ctx.save();
    const bioX = 180;

    // ==========================================
    // 1. BIO-FLO II BIOREACTOR (FERMENTOR) VESSEL
    // ==========================================
    // Stainless steel base resting on bench
    ctx.fillStyle = '#94A3B8';
    ctx.fillRect(bioX - 25, benchY - 8, 50, 8);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(bioX - 25, benchY - 8, 50, 8);

    // Borosilicate Glass Jacketed Culture Vessel
    const vesTop = benchY - 60;
    const vesH = 52;
    const vesW = 44;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.fillRect(bioX - vesW * 0.5, vesTop, vesW, vesH);
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 2;
    ctx.strokeRect(bioX - vesW * 0.5, vesTop, vesW, vesH);

    // Mammalian CHO Cell Culture Media (Pink RPMI / DMEM)
    const mediaGrad = ctx.createLinearGradient(0, vesTop + 10, 0, benchY - 8);
    mediaGrad.addColorStop(0, 'rgba(244, 114, 182, 0.5)');
    mediaGrad.addColorStop(1, 'rgba(236, 72, 153, 0.8)');
    ctx.fillStyle = mediaGrad;
    ctx.fillRect(bioX - vesW * 0.5 + 2, vesTop + 10, vesW - 4, vesH - 12);

    // Gentle fluid meniscus wave
    const wave = Math.sin(this.time * 4) * 0.8;
    ctx.strokeStyle = '#F472B6';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(bioX - vesW * 0.5 + 2, vesTop + 10 + wave);
    ctx.lineTo(bioX + vesW * 0.5 - 2, vesTop + 10 - wave);
    ctx.stroke();

    // Stainless Steel Impeller Shaft & Rushton Turbine Blades
    const spin = this.time * 8;
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(bioX, vesTop);
    ctx.lineTo(bioX, benchY - 14);
    // Turbine blades
    ctx.lineTo(bioX + Math.cos(spin) * 12, benchY - 14);
    ctx.stroke();

    // CHO (Chinese Hamster Ovary) Cells strictly circulating inside pink culture fluid
    this.choCells.forEach(cell => {
      ctx.fillStyle = '#6EE7B7';
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cell.x, cell.y, cell.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Nucleus
      ctx.fillStyle = '#047857';
      ctx.beginPath();
      ctx.arc(cell.x, cell.y, 1, 0, Math.PI * 2);
      ctx.fill();
    });

    // Stainless Steel Headplate with Clamp Screws
    ctx.fillStyle = '#CBD5E1';
    ctx.fillRect(bioX - 26, vesTop - 8, 52, 8);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(bioX - 26, vesTop - 8, 52, 8);

    // Top-Drive Black Motor Assembly
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(bioX - 9, vesTop - 36, 18, 28);
    // Motor cooling fins
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    for (let fin = -30; fin <= -14; fin += 4) {
      ctx.strokeRect(bioX - 11, vesTop + fin, 22, 2);
    }

    // Silicone Tubing Routing to Console
    const conX = bioX + 48;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(bioX + 12, vesTop - 8);
    ctx.quadraticCurveTo(bioX + 30, vesTop - 25, conX + 4, vesTop - 10);
    ctx.stroke();

    // ==========================================
    // 2. BIO-FLO II CONSOLE TOWER ("BIO-FLO II - N4")
    // ==========================================
    const conY = benchY - 120;
    const conW = 52;
    const conH = 120;

    // Beige Enamelled Chassis
    ctx.fillStyle = '#CBD5E1';
    ctx.fillRect(conX, conY, conW, conH);
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 2;
    ctx.strokeRect(conX, conY, conW, conH);

    // Dark Inset Instrument Panel
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(conX + 4, conY + 4, conW - 8, conH - 8);

    // Top Label: "BIO-FLO II - N4"
    ctx.font = '700 6.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#F8FAFC';
    ctx.fillText('BIO-FLO II-N4', conX + 6, conY + 16);

    // Red 7-Segment Digital Temperature Display
    ctx.fillStyle = '#7F1D1D';
    ctx.fillRect(conX + 8, conY + 22, conW - 16, 14);
    ctx.font = '700 9px "JetBrains Mono", monospace';
    ctx.fillStyle = '#EF4444';
    ctx.fillText('37.0°C', conX + 11, conY + 33);

    // Status Indicator LEDs
    ctx.fillStyle = '#22C55E'; // Green Run
    ctx.beginPath();
    ctx.arc(conX + 14, conY + 46, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#EAB308'; // Yellow Heat
    ctx.beginPath();
    ctx.arc(conX + 26, conY + 46, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#38BDF8'; // Blue Stir
    ctx.beginPath();
    ctx.arc(conX + 38, conY + 46, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Flowmeter Rotameters
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(conX + 16, conY + 54, 8, 22);
    ctx.fillRect(conX + 28, conY + 54, 8, 22);

    // Rotary Control Knobs (Dr. Levinson's gloved hand adjusts the lower knob!)
    ctx.fillStyle = '#94A3B8';
    ctx.beginPath();
    ctx.arc(conX + 26, conY + 86, 6.5, 0, Math.PI * 2);
    ctx.fill();

    // Lower Knob (Controlled by Dr. Levinson)
    ctx.fillStyle = '#64748B';
    ctx.beginPath();
    ctx.arc(conX + 26, conY + 104, 7, 0, Math.PI * 2);
    ctx.fill();

    // ==========================================
    // 3. VINTAGE CRT COMPUTER MONITOR & KEYBOARD
    // ==========================================
    const crtX = conX + 82;
    const crtY = benchY - 95;
    const crtW = 86;
    const crtH = 80;

    // Beige CRT Housing
    ctx.fillStyle = '#E2E8F0';
    ctx.fillRect(crtX, crtY, crtW, crtH);
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 2;
    ctx.strokeRect(crtX, crtY, crtW, crtH);

    // Curved Dark CRT Display
    ctx.fillStyle = '#052E16';
    ctx.beginPath();
    ctx.roundRect(crtX + 6, crtY + 6, crtW - 12, crtH - 20, 6);
    ctx.fill();
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Screen Header Text
    ctx.font = '700 5.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#86EFAC';
    ctx.fillText('BIO-RUN 4 / FEB 15 89', crtX + 10, crtY + 16);
    ctx.fillText('TEMP: 37°C  O2: 38K', crtX + 10, crtY + 24);

    // Glowing Phosphor Green Chromatography Peak (37 kDa rhDNase!)
    ctx.strokeStyle = '#22C55E';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(crtX + 10, crtY + 52);
    ctx.lineTo(crtX + 24, crtY + 52);
    // Sharp Gaussian peak!
    ctx.quadraticCurveTo(crtX + 34, crtY + 18, crtX + 44, crtY + 52);
    ctx.lineTo(crtX + crtW - 18, crtY + 52);
    ctx.stroke();

    ctx.font = '700 6px "JetBrains Mono", monospace';
    ctx.fillStyle = '#4ADE80';
    ctx.fillText('rhDNase 37kDa', crtX + 20, crtY + 34);

    // Real-Time Scanning Sweep Line
    const scanProgress = (this.time * 28) % (crtW - 24);
    ctx.strokeStyle = 'rgba(74, 222, 128, 0.4)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(crtX + 10 + scanProgress, crtY + 8);
    ctx.lineTo(crtX + 10 + scanProgress, crtY + 62);
    ctx.stroke();

    // Compaq / Genentech Logo on Bezel
    ctx.font = '700 5px sans-serif';
    ctx.fillStyle = '#DC2626';
    ctx.fillText('COMPAQ', crtX + 8, crtY + crtH - 6);

    // Vintage Beige Mechanical Keyboard
    ctx.fillStyle = '#CBD5E1';
    ctx.fillRect(crtX + 2, benchY - 14, crtW - 4, 14);
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(crtX + 2, benchY - 14, crtW - 4, 14);

    // Keys Rows
    ctx.fillStyle = '#94A3B8';
    for (let k = 0; k < 6; k++) {
      ctx.fillRect(crtX + 6 + k * 12, benchY - 12, 9, 8);
    }

    ctx.restore();
  }

  /* ========================================================
     High-Detail Animated Figure: Dr. Art Levinson (CEO)
     Pose: Facing viewer / three-quarters, handsome face,
     voluminous 1980s curly hair, wireframe glasses, white coat
     with navy necktie, beige latex gloves turning BIO-FLO II dial!
     ======================================================== */
  drawAnimatedDrLevinson(ctx, benchY) {
    ctx.save();
    const ax = 40;
    const breath = Math.sin(this.time * 2.2 + 0.8) * 1.5;

    // Body shadow on floor/bench area
    ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
    ctx.beginPath();
    ctx.ellipse(ax - 5, benchY + 45, 75, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // ==========================================
    // 1. LAB COAT TORSO & SUIT (Facing Viewer)
    // ==========================================
    // Coat Silhouette
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ax - 62, -45 + breath); // Left shoulder
    ctx.quadraticCurveTo(ax - 75, 30, ax - 70, benchY + 65); // Left flank down past bench
    ctx.lineTo(ax + 65, benchY + 65); // Hem
    ctx.quadraticCurveTo(ax + 60, 30, ax + 55, -45 + breath); // Right shoulder
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Lab coat fabric fold shadows
    ctx.fillStyle = 'rgba(226, 232, 240, 0.55)';
    ctx.beginPath();
    ctx.moveTo(ax - 58, 10 + breath);
    ctx.quadraticCurveTo(ax - 40, 45, ax - 52, benchY + 60);
    ctx.lineTo(ax - 66, benchY + 60);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(ax + 32, 10 + breath);
    ctx.quadraticCurveTo(ax + 42, 45, ax + 46, benchY + 60);
    ctx.lineTo(ax + 56, benchY + 60);
    ctx.closePath();
    ctx.fill();

    // White Shirt V-Neck & Classic Dark Navy Necktie
    // Shirt collar background
    ctx.fillStyle = '#F8FAFC';
    ctx.beginPath();
    ctx.moveTo(ax - 18, -58 + breath);
    ctx.lineTo(ax + 18, -58 + breath);
    ctx.lineTo(ax, -16 + breath);
    ctx.closePath();
    ctx.fill();

    // White Shirt Collar Points
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(ax - 18, -60 + breath);
    ctx.lineTo(ax - 8, -45 + breath);
    ctx.lineTo(ax - 12, -60 + breath);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(ax + 18, -60 + breath);
    ctx.lineTo(ax + 8, -45 + breath);
    ctx.lineTo(ax + 12, -60 + breath);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Dark Navy Necktie Knot & Blade
    ctx.fillStyle = '#0F172A';
    // Knot
    ctx.beginPath();
    ctx.moveTo(ax - 6, -52 + breath);
    ctx.lineTo(ax + 6, -52 + breath);
    ctx.lineTo(ax + 4, -42 + breath);
    ctx.lineTo(ax - 4, -42 + breath);
    ctx.closePath();
    ctx.fill();

    // Tie blade running down chest
    ctx.beginPath();
    ctx.moveTo(ax - 4, -42 + breath);
    ctx.lineTo(ax + 4, -42 + breath);
    ctx.lineTo(ax + 6, 20 + breath);
    ctx.lineTo(ax, 30 + breath);
    ctx.lineTo(ax - 6, 20 + breath);
    ctx.closePath();
    ctx.fill();

    // White Lab Coat Notch Lapels
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1.8;
    // Left Lapel
    ctx.beginPath();
    ctx.moveTo(ax - 20, -58 + breath);
    ctx.lineTo(ax - 28, -36 + breath);
    ctx.lineTo(ax - 20, -33 + breath);
    ctx.lineTo(ax - 5, -14 + breath);
    ctx.lineTo(ax - 12, -58 + breath);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Right Lapel
    ctx.beginPath();
    ctx.moveTo(ax + 20, -58 + breath);
    ctx.lineTo(ax + 28, -36 + breath);
    ctx.lineTo(ax + 20, -33 + breath);
    ctx.lineTo(ax + 5, -14 + breath);
    ctx.lineTo(ax + 12, -58 + breath);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Center Placket & Buttons
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(ax, 32 + breath);
    ctx.lineTo(ax, benchY + 60);
    ctx.stroke();

    // Round White Buttons
    for (let b = 0; b < 3; b++) {
      const by = 42 + b * 26 + breath;
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(ax, by, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#64748B';
      ctx.fillRect(ax - 1.5, by - 0.7, 3, 1.4);
    }

    // Breast pocket with pen clip
    const pockX = ax - 45;
    const pockY = -14 + breath;
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(pockX, pockY, 28, 26);
    // Silver pen clip
    ctx.fillStyle = '#94A3B8';
    ctx.fillRect(pockX + 8, pockY - 5, 2.5, 14);

    // ==========================================
    // 2. NECK, FORWARD-FACING HEAD & FEATURES
    // ==========================================
    // Neck
    const neckY = -68 + breath;
    const neckGrad = ctx.createLinearGradient(ax - 16, 0, ax + 16, 0);
    neckGrad.addColorStop(0, '#F8D2BA');
    neckGrad.addColorStop(0.5, '#E5A88B');
    neckGrad.addColorStop(1, '#F8D2BA');
    ctx.fillStyle = neckGrad;
    ctx.beginPath();
    ctx.moveTo(ax - 14, neckY - 18);
    ctx.lineTo(ax - 14, neckY + 10);
    ctx.lineTo(ax + 14, neckY + 10);
    ctx.lineTo(ax + 14, neckY - 18);
    ctx.closePath();
    ctx.fill();

    // Head Contour (Facing Viewer / Three-Quarter)
    const hy = -120 + breath;
    const faceGrad = ctx.createLinearGradient(ax - 30, hy - 40, ax + 25, hy + 30);
    faceGrad.addColorStop(0, '#FFF2E8'); // Highlight from window
    faceGrad.addColorStop(0.4, '#F8D2BA'); // Caucasian base
    faceGrad.addColorStop(1, '#E5A88B'); // Soft jaw shadow
    ctx.fillStyle = faceGrad;

    ctx.beginPath();
    ctx.moveTo(ax - 26, hy - 20); // Left temple
    ctx.quadraticCurveTo(ax - 30, hy + 12, ax - 20, hy + 26); // Left jaw
    ctx.quadraticCurveTo(ax - 10, hy + 36, ax, hy + 37); // Chin
    ctx.quadraticCurveTo(ax + 10, hy + 36, ax + 20, hy + 26); // Right jaw
    ctx.quadraticCurveTo(ax + 30, hy + 12, ax + 26, hy - 20); // Right temple
    ctx.quadraticCurveTo(ax, hy - 42, ax - 26, hy - 20); // Crown
    ctx.closePath();
    ctx.fill();

    // Ears (Both visible!)
    const drawLevEar = (ex, isLeft) => {
      ctx.fillStyle = '#E5A88B';
      ctx.beginPath();
      ctx.ellipse(ex, hy + 2, 5.5, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#D48B6C';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(ex + (isLeft ? 1 : -1), hy, 3.5, Math.PI * 0.3, Math.PI * 1.7, !isLeft);
      ctx.stroke();
    };
    drawLevEar(ax - 29, true);
    drawLevEar(ax + 29, false);

    // ==========================================
    // 3. AUTHENTIC 1989 VOLUMINOUS CURLY HAIR
    // ==========================================
    // Rich, glorious curly hair mass framing the head
    ctx.fillStyle = '#3A1708'; // Deep chestnut undertone
    ctx.beginPath();
    ctx.arc(ax, hy - 20, 29, Math.PI * 0.8, Math.PI * 2.2);
    ctx.fill();

    // Clusters of dense curly lobes with soft highlights
    const curlyCurls = [
      // Top crown curls
      { x: ax - 22, y: hy - 32, r: 10 },
      { x: ax - 12, y: hy - 40, r: 11 },
      { x: ax, y: hy - 42, r: 12 },
      { x: ax + 12, y: hy - 40, r: 11 },
      { x: ax + 22, y: hy - 32, r: 10 },
      // Side curls framing forehead and temples
      { x: ax - 28, y: hy - 20, r: 9 },
      { x: ax - 26, y: hy - 8, r: 8 },
      { x: ax + 28, y: hy - 20, r: 9 },
      { x: ax + 26, y: hy - 8, r: 8 },
      // Forehead curls
      { x: ax - 16, y: hy - 22, r: 8 },
      { x: ax - 6, y: hy - 26, r: 9 },
      { x: ax + 6, y: hy - 26, r: 9 },
      { x: ax + 16, y: hy - 22, r: 8 }
    ];

    curlyCurls.forEach(c => {
      ctx.fillStyle = '#5C2812'; // Warm midtone curl
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();

      // Highlight curl arc
      ctx.strokeStyle = '#823E1D';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.arc(c.x - 1, c.y - 1, c.r * 0.65, Math.PI * 0.2, Math.PI * 1.6);
      ctx.stroke();
    });

    // ==========================================
    // 4. FACIAL FEATURES: EYES, GLASSES & SMILE
    // ==========================================
    // Eyebrows (Neat, intelligent arched brown eyebrows)
    ctx.fillStyle = '#3A1708';
    ctx.beginPath();
    ctx.moveTo(ax - 20, hy - 1);
    ctx.quadraticCurveTo(ax - 12, hy - 5, ax - 4, hy - 1);
    ctx.lineTo(ax - 5, hy + 2);
    ctx.quadraticCurveTo(ax - 12, hy - 2, ax - 19, hy + 2);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(ax + 4, hy - 1);
    ctx.quadraticCurveTo(ax + 12, hy - 5, ax + 20, hy - 1);
    ctx.lineTo(ax + 19, hy + 2);
    ctx.quadraticCurveTo(ax + 12, hy - 2, ax + 5, hy + 2);
    ctx.closePath();
    ctx.fill();

    // Eyes (Friendly, intelligent eyes looking towards viewer/equipment)
    const drawLevEye = (ex) => {
      // Sclera
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(ex, hy + 5, 5.2, 3.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#D48B6C';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Hazel-brown iris
      ctx.fillStyle = '#451A03';
      ctx.beginPath();
      ctx.arc(ex + 0.5, hy + 5, 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Pupil
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.arc(ex + 0.5, hy + 5, 1.2, 0, Math.PI * 2);
      ctx.fill();

      // Specular catchlight
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(ex + 0.1, hy + 4.2, 0.7, 0, Math.PI * 2);
      ctx.fill();

      // Upper eyelid crease
      ctx.strokeStyle = '#52220E';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(ex - 6, hy + 3);
      ctx.quadraticCurveTo(ex, hy + 0.5, ex + 6, hy + 3);
      ctx.stroke();
    };
    drawLevEye(ax - 12);
    drawLevEye(ax + 12);

    // Nose (Clean Caucasian bridge, tip highlight, soft nostrils)
    ctx.fillStyle = 'rgba(212, 139, 108, 0.45)';
    ctx.beginPath();
    ctx.moveTo(ax - 2, hy + 3);
    ctx.lineTo(ax - 3, hy + 17);
    ctx.lineTo(ax + 3, hy + 17);
    ctx.lineTo(ax + 2, hy + 3);
    ctx.closePath();
    ctx.fill();

    // Nose tip highlight
    ctx.fillStyle = '#FFF2E8';
    ctx.beginPath();
    ctx.arc(ax, hy + 16, 2.4, 0, Math.PI * 2);
    ctx.fill();

    // Soft nostrils
    ctx.fillStyle = '#451A03';
    ctx.beginPath();
    ctx.arc(ax - 3, hy + 18, 1, 0, Math.PI * 2);
    ctx.arc(ax + 3, hy + 18, 1, 0, Math.PI * 2);
    ctx.fill();

    // Subtle Confident Smile (Clean-shaven!)
    ctx.strokeStyle = '#7C2D12';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(ax - 9, hy + 24);
    ctx.quadraticCurveTo(ax, hy + 28, ax + 9, hy + 24);
    ctx.stroke();

    // Soft lower lip
    ctx.fillStyle = '#E29578';
    ctx.beginPath();
    ctx.ellipse(ax, hy + 28, 4.5, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Chin indentation & highlight
    ctx.fillStyle = '#FFF2E8';
    ctx.beginPath();
    ctx.arc(ax, hy + 33, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // 1980s Metal Wire-Rim Spectacles
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 1.4;
    // Left Lens
    ctx.strokeRect(ax - 20, hy, 16, 12);
    // Right Lens
    ctx.strokeRect(ax + 4, hy, 16, 12);

    // Center bridge
    ctx.beginPath();
    ctx.moveTo(ax - 4, hy + 5);
    ctx.lineTo(ax + 4, hy + 5);
    // Wire temples to ears
    ctx.moveTo(ax - 20, hy + 3);
    ctx.lineTo(ax - 28, hy + 2);
    ctx.moveTo(ax + 20, hy + 3);
    ctx.lineTo(ax + 28, hy + 2);
    ctx.stroke();

    // Diagonal glare streak on lenses
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(ax - 18, hy + 9);
    ctx.lineTo(ax - 9, hy + 2);
    ctx.moveTo(ax + 6, hy + 9);
    ctx.lineTo(ax + 15, hy + 2);
    ctx.stroke();

    // ==========================================
    // 5. ARMS & GLOVED HAND ADJUSTING CONSOLE DIAL
    // ==========================================
    // LEFT ARM: Draping naturally by his side
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 18;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(ax - 55, -35 + breath);
    ctx.lineTo(ax - 70, 15 + breath);
    ctx.lineTo(ax - 62, 55 + breath);
    ctx.stroke();

    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ax - 55, -25 + breath);
    ctx.lineTo(ax - 70, 25 + breath);
    ctx.lineTo(ax - 62, 65 + breath);
    ctx.stroke();

    // Left hand resting at side
    ctx.fillStyle = '#F8D2BA';
    ctx.beginPath();
    ctx.roundRect(ax - 68, 55 + breath, 12, 16, 4);
    ctx.fill();

    // RIGHT ARM: Reaching forward-right to turn the BIO-FLO II console dial!
    const conDialX = 254;
    const conDialY = benchY - 16;
    const handTwist = Math.sin(this.time * 2.8) * 1.2;

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 19;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(ax + 50, -35 + breath);
    ctx.lineTo(ax + 95, 0 + breath);
    ctx.lineTo(conDialX - 16, conDialY + handTwist);
    ctx.stroke();

    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ax + 50, -25 + breath);
    ctx.lineTo(ax + 95, 10 + breath);
    ctx.lineTo(conDialX - 16, conDialY + 10 + handTwist);
    ctx.stroke();

    // Off-White / Beige Latex Examination Glove (Matching real 1989 photo!)
    ctx.fillStyle = '#FDE68A'; // Warm beige/cream latex
    ctx.beginPath();
    ctx.roundRect(conDialX - 22, conDialY - 8 + handTwist, 18, 16, 5);
    ctx.fill();

    // Thumb & Curled fingers actively turning the rotary dial
    ctx.fillStyle = '#D97706';
    ctx.beginPath();
    ctx.roundRect(conDialX - 10, conDialY - 6 + handTwist, 12, 7, 2.5);
    ctx.fill();

    ctx.fillStyle = '#B45309';
    ctx.beginPath();
    ctx.roundRect(conDialX - 8, conDialY + 2 + handTwist, 10, 6, 2);
    ctx.fill();

    ctx.restore();
  }

  /* ========================================================
     STAGE 10: 1990–1993 Clinical Trials to FDA Approval (Pulmozyme®)
     The rapid translation of recombinant DNase 1 into life-saving therapy
     ======================================================== */
  drawStage10TrialsAndFdaApproval(ctx) {
    ctx.save();

    // 1. Back to Timeline Button
    this.drawBackToTimelineButton(ctx);

    // 2. Clean Pristine Medical Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(-500, -260, 1000, 520);

    // Subtle background grid
    ctx.fillStyle = '#E2E8F0';
    for (let gx = -460; gx <= 460; gx += 40) {
      for (let gy = -220; gy <= 220; gy += 40) {
        ctx.beginPath();
        ctx.arc(gx, gy, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 3. Header Section
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Top Pill Badge
    ctx.fillStyle = '#F8FAFC';
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(-210, -232, 420, 26, 13);
    ctx.fill();
    ctx.stroke();

    ctx.font = '700 9.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#059669';
    ctx.fillText('● 1990 — 1993 CLINICAL TRANSLATION & APPROVAL', 0, -219);

    // Main Heading
    ctx.font = '800 23px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#0F172A';
    ctx.fillText('From Clinical Trials to FDA Approval: Pulmozyme®', 0, -190);

    // Subtitle
    ctx.font = '500 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText('How recombinant human DNase 1 became the first new Cystic Fibrosis therapy in 30 years.', 0, -164);

    // 4. Three Milestone Columns
    const colY = -135;
    const colW = 280;
    const colH = 345;

    const columns = [
      {
        x: -320,
        badge: 'PHASE I (SUMMER 1990)',
        badgeColor: '#0284C7',
        badgeBg: '#E0F2FE',
        title: 'Safety & Tolerability',
        subtitle: 'First Human Clinical Trials',
        accentColor: '#0284C7',
        tag: '✅ 100% Well-Tolerated • No Allergies'
      },
      {
        x: 0,
        badge: 'PHASE III (1992–1993)',
        badgeColor: '#6366F1',
        badgeBg: '#EEF2FF',
        title: 'Landmark Efficacy',
        subtitle: '968 CF Patients (Multicenter Trial)',
        accentColor: '#6366F1',
        tag: '📈 +15.8% FEV₁ • 28% Reduced Infections'
      },
      {
        x: 320,
        badge: 'FDA APPROVAL (DEC 30, 1993)',
        badgeColor: '#059669',
        badgeBg: '#D1FAE5',
        title: 'Pulmozyme® Approved',
        subtitle: 'Official Commercialization',
        accentColor: '#059669',
        tag: '⭐ Pulmozyme® (dornase alfa)'
      }
    ];

    columns.forEach((col, i) => {
      ctx.save();
      const cx = col.x - colW / 2;

      // Card Container & Shadow
      ctx.shadowColor = 'rgba(15, 23, 42, 0.08)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 4;
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(cx, colY, colW, colH, 10);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Top colored accent bar
      ctx.fillStyle = col.accentColor;
      ctx.beginPath();
      ctx.roundRect(cx + 1, colY + 1, colW - 2, 4, [9, 9, 0, 0]);
      ctx.fill();

      // Top Stage Badge Pill
      const bY = colY + 24;
      ctx.font = '800 9px "Plus Jakarta Sans", sans-serif';
      const bW = ctx.measureText(col.badge).width + 16;
      ctx.fillStyle = col.badgeBg;
      ctx.strokeStyle = col.accentColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(cx + 14, bY - 10, bW, 20, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = col.badgeColor;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(col.badge, cx + 22, bY);

      // Title & Subtitle
      ctx.font = '800 15px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#0F172A';
      ctx.fillText(col.title, cx + 14, colY + 54);

      ctx.font = '600 10.5px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#64748B';
      ctx.fillText(col.subtitle, cx + 14, colY + 72);

      // Divider
      ctx.strokeStyle = '#F1F5F9';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx + 14, colY + 84);
      ctx.lineTo(cx + colW - 14, colY + 84);
      ctx.stroke();

      // Column Specific Content
      if (i === 0) {
        // --- COLUMN 1: PHASE I ---
        ctx.font = '400 10.5px/1.4 "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#334155';
        ctx.fillText('• Began in summer 1990 in healthy subjects', cx + 14, colY + 104);
        ctx.fillText('  and adult Cystic Fibrosis patients.', cx + 14, colY + 120);
        ctx.fillText('• Tested aerosolized rhDNase at escalating', cx + 14, colY + 140);
        ctx.fillText('  single and multiple daily doses.', cx + 14, colY + 156);

        // Key clinical finding box
        ctx.fillStyle = '#F0F9FF';
        ctx.strokeStyle = '#BAE6FD';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(cx + 14, colY + 172, colW - 28, 95, 6);
        ctx.fill();
        ctx.stroke();

        ctx.font = '700 10px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#0369A1';
        ctx.fillText('CRUCIAL TOLERABILITY FINDINGS:', cx + 22, colY + 190);

        ctx.font = '500 9.5px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#0C4A6E';
        ctx.fillText('✓ ZERO allergic bronchospasm (unlike cow DNase!)', cx + 22, colY + 210);
        ctx.fillText('✓ NO neutralizing antibodies formed', cx + 22, colY + 228);
        ctx.fillText('✓ Negligible systemic absorption (local airway action)', cx + 22, colY + 246);

      } else if (i === 1) {
        // --- COLUMN 2: PHASE III ---
        ctx.font = '400 10.5px/1.4 "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#334155';
        ctx.fillText('• Double-blind, placebo-controlled trial', cx + 14, colY + 104);
        ctx.fillText('  conducted across US and European centers.', cx + 14, colY + 120);
        ctx.fillText('• 968 patients randomized to daily rhDNase', cx + 14, colY + 140);
        ctx.fillText('  (2.5 mg) vs. placebo aerosol for 24 weeks.', cx + 14, colY + 156);

        // Animated Mini Bar Chart
        ctx.fillStyle = '#F8FAFC';
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(cx + 14, colY + 172, colW - 28, 95, 6);
        ctx.fill();
        ctx.stroke();

        ctx.font = '700 9.5px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#475569';
        ctx.fillText('FEV₁ LUNG FUNCTION IMPROVEMENT:', cx + 22, colY + 188);

        // rhDNase Bar (+15.8%)
        const barMaxW = 125;
        const fevPulse = 1.0 + Math.sin(this.time * 2.5) * 0.03;
        const rhBarW = barMaxW * fevPulse;
        ctx.fillStyle = '#10B981';
        ctx.beginPath();
        ctx.roundRect(cx + 60, colY + 200, rhBarW, 14, 3);
        ctx.fill();
        ctx.font = '700 9px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#047857';
        ctx.fillText('rhDNase: +15.8%', cx + 64 + rhBarW, colY + 208);

        // Placebo Bar (+1.2%)
        ctx.fillStyle = '#94A3B8';
        ctx.beginPath();
        ctx.roundRect(cx + 60, colY + 220, barMaxW * 0.1, 14, 3);
        ctx.fill();
        ctx.fillStyle = '#64748B';
        ctx.fillText('Placebo: +1.2%', cx + 78, colY + 228);

        // Infection reduction pill
        ctx.fillStyle = '#EEF2FF';
        ctx.beginPath();
        ctx.roundRect(cx + 22, colY + 244, colW - 44, 18, 4);
        ctx.fill();
        ctx.font = '700 8.5px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#4F46E5';
        ctx.textAlign = 'center';
        ctx.fillText('⚡ 28% to 37% REDUCTION IN IV ANTIBIOTIC USE', cx + colW / 2, colY + 253);
        ctx.textAlign = 'left';

      } else {
        // --- COLUMN 3: FDA APPROVAL ---
        // Gold FDA Ribbon / Seal Badge
        const sealX = cx + colW / 2;
        const sealY = colY + 140;

        ctx.save();
        // Golden Laurel Wreath / Seal
        ctx.fillStyle = '#FEF3C7';
        ctx.strokeStyle = '#D97706';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(sealX, sealY, 32, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(sealX, sealY, 28, 0, Math.PI * 2);
        ctx.stroke();

        ctx.font = '800 8px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#B45309';
        ctx.textAlign = 'center';
        ctx.fillText('★ U.S. FDA ★', sealX, sealY - 12);
        ctx.font = '800 9px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('APPROVED', sealX, sealY);
        ctx.font = '700 7.5px "JetBrains Mono", monospace';
        ctx.fillText('DEC 30, 1993', sealX, sealY + 12);
        ctx.restore();

        // Product Details
        ctx.font = '400 10.5px/1.4 "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#334155';
        ctx.fillText('• Brand Name: Pulmozyme® (dornase alfa)', cx + 14, colY + 195);
        ctx.fillText('• First new drug class for CF in 30+ years!', cx + 14, colY + 215);
        ctx.fillText('• Administered once daily via jet nebulizer.', cx + 14, colY + 235);
        ctx.fillText('• Proven to double patient life expectancy.', cx + 14, colY + 255);
      }

      // Bottom Status Pill on Card
      const btmPillY = colY + colH - 26;
      ctx.fillStyle = col.badgeBg;
      ctx.strokeStyle = col.accentColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(cx + 14, btmPillY - 11, colW - 28, 22, 6);
      ctx.fill();
      ctx.stroke();

      ctx.font = '700 10px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = col.badgeColor;
      ctx.fillText(col.tag, cx + colW / 2, btmPillY);
    });

    ctx.restore();
  }

  /* ========================================================
     STAGE 11: Clinical Administration: Jet Nebulizer Inhalation & Pulmonary Delivery
     Animated patient profile inhaling 2.5 mL dornase alfa solution
     through a high-efficiency jet nebulizer, generating 2.4 um respirable
     aerosol mist that penetrates past the larynx and trachea into distal bronchioles.
     ======================================================== */
  initStage11NebulizerData() {
    this.nebTimer = 0;
    this.nebBreathRate = 2.2;
    this.nebLiquidLevel = 2.5;
    this.nebParticles = [];

    // Aerosol droplets inside nebulizer cup & mouthpiece
    for (let i = 0; i < 90; i++) {
      this.nebParticles.push({
        x: -220 + (Math.random() - 0.5) * 45,
        y: 40 + Math.random() * 70,
        vx: (Math.random() - 0.5) * 20,
        vy: -30 - Math.random() * 45,
        radius: 1.2 + Math.random() * 2.2,
        alpha: 0.3 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2
      });
    }

    // Bronchial tree deposition particles
    this.airwayDepositionParticles = [];
    for (let i = 0; i < 110; i++) {
      const typeRand = Math.random();
      let category = 'respirable'; // 1-5 um
      let color = '#38BDF8';
      let r = 2.2;
      if (typeRand < 0.12) {
        category = 'large'; // > 10 um
        color = '#F59E0B';
        r = 4.2;
      } else if (typeRand < 0.18) {
        category = 'ultrafine'; // < 1 um
        color = '#94A3B8';
        r = 1.0;
      }

      this.airwayDepositionParticles.push({
        t: Math.random(),
        branch: Math.random() < 0.5 ? 'left' : 'right',
        subBranch: Math.random() < 0.5 ? 0 : 1,
        category: category,
        color: color,
        radius: r,
        speed: 0.18 + Math.random() * 0.22,
        deposited: false
      });
    }

    this.mucusImpactRipples = [];
  }

  updateStage11Nebulizer(dt) {
    this.nebTimer += dt;
    const breath = Math.sin(this.nebTimer * this.nebBreathRate);
    const isInhaling = breath > 0;

    // Update cup & mouthpiece mist particles
    this.nebParticles.forEach(p => {
      p.phase += dt * 4;
      p.y += p.vy * dt;
      p.x += (p.vx + Math.sin(p.phase) * 15) * dt;

      if (p.y < -15) {
        p.x += (80 + Math.random() * 40) * dt * (isInhaling ? 1.8 : 0.6);
        p.vy = (Math.random() - 0.5) * 10;
      }

      if (p.x > -105 || p.y < -40 || p.y > 120) {
        p.x = -220 + (Math.random() - 0.5) * 40;
        p.y = 80 + Math.random() * 30;
        p.vx = (Math.random() - 0.5) * 20;
        p.vy = -35 - Math.random() * 45;
      }
    });

    // Update airway penetration particles
    this.airwayDepositionParticles.forEach(p => {
      const flowMult = isInhaling ? 1.6 : 0.4;
      p.t += p.speed * dt * flowMult;

      if (p.category === 'large' && p.t > 0.25) {
        p.t = 0.25;
        p.deposited = true;
      }

      if (p.category === 'respirable' && p.t >= 1.0) {
        p.t = 0;
        this.mucusImpactRipples.push({
          branch: p.branch,
          subBranch: p.subBranch,
          radius: 3,
          maxRadius: 18,
          alpha: 1.0
        });
      }

      if (p.category === 'ultrafine' && p.t >= 1.2) {
        p.t = 0;
      }

      if (p.t > 1.2) {
        p.t = 0;
      }
    });

    // Update impact ripples
    for (let i = this.mucusImpactRipples.length - 1; i >= 0; i--) {
      const rip = this.mucusImpactRipples[i];
      rip.radius += dt * 25;
      rip.alpha -= dt * 1.8;
      if (rip.alpha <= 0) {
        this.mucusImpactRipples.splice(i, 1);
      }
    }
  }

  drawStage11NebulizerAdministration(ctx) {
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(-500, -260, 1000, 520);

    // Subtle background grid dots
    ctx.fillStyle = '#E2E8F0';
    for (let gx = -460; gx <= 460; gx += 40) {
      for (let gy = -220; gy <= 220; gy += 40) {
        ctx.beginPath();
        ctx.arc(gx, gy, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Top Header Section
    ctx.fillStyle = '#F8FAFC';
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(-240, -252, 480, 26, 13);
    ctx.fill();
    ctx.stroke();

    ctx.font = '700 9.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#0284C7';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('● CLINICAL ADMINISTRATION • AEROSOL INHALATION DELIVERY', 0, -239);

    ctx.font = '800 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#0F172A';
    ctx.fillText('Pulmonary Delivery: Jet Nebulizer Inhalation of Pulmozyme® (rhDNase 1)', 0, -210);

    ctx.font = '500 11.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText('Aerosolizing 2.5 mL dornase alfa into 2.4 µm respirable droplets that penetrate directly to purulent mucus plugs.', 0, -188);

    const vpW = 450;
    const vpH = 390;
    const vpY = -170;

    // ==========================================
    // LEFT PANEL: PATIENT INHALATION & NEBULIZER CUTAWAY
    // ==========================================
    const leftX = -465;
    ctx.save();
    const lGrad = ctx.createLinearGradient(0, vpY, 0, vpY + vpH);
    lGrad.addColorStop(0, '#0F172A');
    lGrad.addColorStop(0.6, '#1E293B');
    lGrad.addColorStop(1, '#0F172A');
    ctx.fillStyle = lGrad;
    ctx.beginPath();
    ctx.roundRect(leftX, vpY, vpW, vpH, 12);
    ctx.fill();

    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Banner Top
    ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(leftX + 14, vpY + 12, vpW - 28, 26, 6);
    ctx.fill();
    ctx.stroke();

    ctx.font = '800 10px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#6EE7B7';
    ctx.textAlign = 'center';
    ctx.fillText('PATIENT INHALATION & NEBULIZER CHAMBER CUTAWAY', leftX + vpW / 2, vpY + 25);

    // Patient Profile & Breathing Action
    const breath = Math.sin(this.nebTimer * this.nebBreathRate);
    const chestExpand = Math.max(0, breath) * 5;

    // --- NATURAL HUMAN ANATOMICAL HEAD & PROFILE SILHOUETTE ---
    ctx.save();
    const skinGrad = ctx.createLinearGradient(leftX + 220, vpY + 20, leftX + 400, vpY + 300);
    skinGrad.addColorStop(0, '#E2E8F0');
    skinGrad.addColorStop(0.5, '#CBD5E1');
    skinGrad.addColorStop(1, '#94A3B8');
    ctx.fillStyle = skinGrad;
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;

    // Torso / Neck / Chin / Face / Cranium Path
    ctx.beginPath();
    ctx.moveTo(leftX + 265 - chestExpand, vpY + 325);
    ctx.quadraticCurveTo(leftX + 258 - chestExpand, vpY + 250, leftX + 265, vpY + 195);
    ctx.quadraticCurveTo(leftX + 268, vpY + 160, leftX + 255, vpY + 138);
    ctx.lineTo(leftX + 242, vpY + 125);
    ctx.quadraticCurveTo(leftX + 234, vpY + 118, leftX + 236, vpY + 110);
    ctx.quadraticCurveTo(leftX + 238, vpY + 104, leftX + 232, vpY + 98);
    ctx.lineTo(leftX + 215, vpY + 95);
    ctx.lineTo(leftX + 232, vpY + 92);
    ctx.quadraticCurveTo(leftX + 237, vpY + 86, leftX + 235, vpY + 80);
    ctx.lineTo(leftX + 230, vpY + 74);
    ctx.quadraticCurveTo(leftX + 216, vpY + 70, leftX + 218, vpY + 64);
    ctx.quadraticCurveTo(leftX + 230, vpY + 54, leftX + 235, vpY + 44);
    ctx.quadraticCurveTo(leftX + 240, vpY + 24, leftX + 275, vpY + 15);
    ctx.quadraticCurveTo(leftX + 335, vpY + 8, leftX + 370, vpY + 48);
    ctx.quadraticCurveTo(leftX + 385, vpY + 110, leftX + 355, vpY + 160);
    ctx.quadraticCurveTo(leftX + 360, vpY + 210, leftX + 410, vpY + 325);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Natural styled hair contour
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(leftX + 252, vpY + 30);
    ctx.quadraticCurveTo(leftX + 285, vpY + 10, leftX + 340, vpY + 6);
    ctx.quadraticCurveTo(leftX + 388, vpY + 25, leftX + 382, vpY + 85);
    ctx.quadraticCurveTo(leftX + 365, vpY + 120, leftX + 340, vpY + 105);
    ctx.quadraticCurveTo(leftX + 348, vpY + 65, leftX + 310, vpY + 38);
    ctx.quadraticCurveTo(leftX + 275, vpY + 32, leftX + 252, vpY + 30);
    ctx.closePath();
    ctx.fill();

    // Eyebrow & relaxed eye
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(leftX + 242, vpY + 38);
    ctx.quadraticCurveTo(leftX + 255, vpY + 34, leftX + 268, vpY + 38);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(leftX + 252, vpY + 48, 5, 0.25, Math.PI - 0.25);
    ctx.stroke();

    // Ear contour
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(leftX + 318, vpY + 88, 11, -Math.PI * 0.7, Math.PI * 0.6);
    ctx.stroke();

    // Breathing lung expansion wave in chest
    if (breath > 0) {
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.45)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(leftX + 295, vpY + 235, 30 + chestExpand * 2, -Math.PI * 0.7, Math.PI * 0.4);
      ctx.stroke();
    }
    ctx.restore();

    // --- JET NEBULIZER DEVICE (CUTAWAY) ---
    const nebX = leftX + 115;
    const nebY = vpY + 160;

    // Compressor Air Hose at bottom (Medical green flexible tube)
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(nebX, nebY + 125);
    ctx.bezierCurveTo(nebX - 25, nebY + 145, nebX - 55, nebY + 165, nebX - 85, vpY + 315);
    ctx.stroke();

    // Tubing Air Flow Pulsing Dots
    ctx.fillStyle = '#6EE7B7';
    const hoseFlowOffset = (this.nebTimer * 50) % 30;
    ctx.beginPath();
    ctx.arc(nebX - 45 - hoseFlowOffset * 0.8, nebY + 155 + hoseFlowOffset * 1.5, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Outer Translucent Medical Nebulizer Cup
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(nebX - 35, nebY, 70, 125, [8, 8, 14, 14]);
    ctx.fill();
    ctx.stroke();

    // Volume Graduation Ticks on chamber
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 1;
    for (let mark = 0; mark < 4; mark++) {
      const my = nebY + 95 - mark * 22;
      ctx.beginPath();
      ctx.moveTo(nebX - 33, my);
      ctx.lineTo(nebX - 22, my);
      ctx.stroke();

      ctx.font = '600 7.5px "JetBrains Mono", monospace';
      ctx.fillStyle = '#64748B';
      ctx.textAlign = 'left';
      ctx.fillText(`${(mark + 1) * 0.5 + 0.5} mL`, nebX - 18, my + 3);
    }

    // Liquid Solution (2.5 mL Pulmozyme - clear emerald tint)
    const liqH = 55;
    const liqY = nebY + 110 - liqH;
    const liqGrad = ctx.createLinearGradient(0, liqY, 0, nebY + 110);
    liqGrad.addColorStop(0, 'rgba(52, 211, 153, 0.45)');
    liqGrad.addColorStop(1, 'rgba(5, 150, 105, 0.75)');
    ctx.fillStyle = liqGrad;
    ctx.beginPath();
    ctx.roundRect(nebX - 33, liqY, 66, liqH, [0, 0, 12, 12]);
    ctx.fill();

    // Liquid Bubbling Surface Meniscus
    ctx.fillStyle = '#ECFDF5';
    for (let bx = -25; bx <= 25; bx += 10) {
      const bubbleY = liqY + Math.sin(this.nebTimer * 10 + bx) * 2;
      ctx.beginPath();
      ctx.arc(nebX + bx, bubbleY, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Venturi High-Speed Nozzle & Conical Shear Baffle
    ctx.fillStyle = '#047857';
    ctx.fillRect(nebX - 5, nebY + 75, 10, 45); // Central air tube
    ctx.fillStyle = '#10B981';
    ctx.beginPath();
    ctx.moveTo(nebX - 14, nebY + 60); // Conical baffle
    ctx.lineTo(nebX + 14, nebY + 60);
    ctx.lineTo(nebX, nebY + 42);
    ctx.closePath();
    ctx.fill();

    // Angled connection collar
    ctx.fillStyle = '#E2E8F0';
    ctx.fillRect(nebX - 12, nebY - 30, 24, 30);
    ctx.strokeRect(nebX - 12, nebY - 30, 24, 30);

    // Horizontal Mouthpiece Tube (Extending from chamber to patient lips)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.roundRect(nebX + 12, nebY - 75, 90, 22, 4);
    ctx.fill();
    ctx.stroke();

    // Mouthpiece Lip Flange comfortably between patient lips
    ctx.fillStyle = '#059669';
    ctx.beginPath();
    ctx.roundRect(nebX + 96, nebY - 80, 8, 32, 3);
    ctx.fill();

    // Swirling Aerosol Droplets inside Cup & Mouthpiece
    this.nebParticles.forEach(p => {
      ctx.fillStyle = `rgba(16, 185, 129, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x + nebX + 220, p.y + nebY - 60, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Aerosol Vapor Stream entering oral cavity smoothly
    if (breath > 0) {
      const vaporGrad = ctx.createLinearGradient(nebX + 105, nebY - 65, leftX + 235, nebY - 65);
      vaporGrad.addColorStop(0, 'rgba(52, 211, 153, 0.85)');
      vaporGrad.addColorStop(1, 'rgba(52, 211, 153, 0.15)');
      ctx.fillStyle = vaporGrad;
      ctx.beginPath();
      ctx.moveTo(nebX + 105, nebY - 74);
      ctx.lineTo(leftX + 235, nebY - 76);
      ctx.lineTo(leftX + 235, nebY - 56);
      ctx.lineTo(nebX + 105, nebY - 56);
      ctx.closePath();
      ctx.fill();
    }

    // Status Indicator Pill at bottom of left panel
    ctx.fillStyle = '#064E3B';
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(leftX + 16, vpY + vpH - 36, vpW - 32, 24, 6);
    ctx.fill();
    ctx.stroke();

    ctx.font = '800 9px "JetBrains Mono", monospace';
    ctx.fillStyle = '#6EE7B7';
    ctx.textAlign = 'center';
    const phaseLabel = breath > 0 ? '▶ ACTIVE INHALATION CYCLE' : '❚ TIDAL PAUSE';
    ctx.fillText(`⚡ AIR COMPRESSOR: 1.6 BAR • 7.2 L/MIN • ${phaseLabel}`, leftX + vpW / 2, vpY + vpH - 22);

    ctx.restore();

    // ==========================================
    // RIGHT PANEL: TRACHEOBRONCHIAL TREE PENETRATION & SIZE SORTING
    // ==========================================
    const rightX = 15;
    ctx.save();
    const rGrad = ctx.createLinearGradient(0, vpY, 0, vpY + vpH);
    rGrad.addColorStop(0, '#064E3B');
    rGrad.addColorStop(0.5, '#0F172A');
    rGrad.addColorStop(1, '#064E3B');
    ctx.fillStyle = rGrad;
    ctx.beginPath();
    ctx.roundRect(rightX, vpY, vpW, vpH, 12);
    ctx.fill();

    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Banner Top
    ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(rightX + 14, vpY + 12, vpW - 28, 26, 6);
    ctx.fill();
    ctx.stroke();

    ctx.font = '800 10px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#A7F3D0';
    ctx.textAlign = 'center';
    ctx.fillText('DEEP BRONCHIAL TREE PENETRATION & SIZE SORTING', rightX + vpW / 2, vpY + 25);

    // Anatomical Airway Tree Center Coordinates
    const treeX = rightX + vpW / 2;
    const treeY = vpY + 50;

    // Pharynx / Larynx upper funnel
    ctx.fillStyle = '#065F46';
    ctx.strokeStyle = '#34D399';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(treeX - 25, treeY);
    ctx.lineTo(treeX + 25, treeY);
    ctx.lineTo(treeX + 16, treeY + 35);
    ctx.lineTo(treeX - 16, treeY + 35);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.font = '700 8px "JetBrains Mono", monospace';
    ctx.fillStyle = '#A7F3D0';
    ctx.textAlign = 'left';
    ctx.fillText('PHARYNX / LARYNX', treeX + 32, treeY + 18);

    // Trachea Main Stem (with C-shaped cartilage rings)
    ctx.fillStyle = '#044E39';
    ctx.fillRect(treeX - 16, treeY + 35, 32, 65);
    ctx.strokeRect(treeX - 16, treeY + 35, 32, 65);

    for (let c = 0; c < 5; c++) {
      const cy = treeY + 45 + c * 11;
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(treeX, cy, 14, -Math.PI * 0.7, Math.PI * 0.7);
      ctx.stroke();
    }
    ctx.fillText('TRACHEA (CARTILAGE RINGS)', treeX + 32, treeY + 70);

    // Carina Bifurcation & Main Bronchi
    const carinaY = treeY + 100;

    // Left Main Bronchus (anatomical right)
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 18;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(treeX, carinaY);
    ctx.quadraticCurveTo(treeX - 55, carinaY + 25, treeX - 95, carinaY + 60);
    ctx.stroke();

    // Right Main Bronchus
    ctx.beginPath();
    ctx.moveTo(treeX, carinaY);
    ctx.quadraticCurveTo(treeX + 55, carinaY + 25, treeX + 95, carinaY + 60);
    ctx.stroke();

    // Secondary & Distal Branching Bronchioles
    ctx.lineWidth = 10;
    // Left sub-branches
    ctx.beginPath();
    ctx.moveTo(treeX - 95, carinaY + 60);
    ctx.quadraticCurveTo(treeX - 130, carinaY + 80, treeX - 145, carinaY + 125);
    ctx.moveTo(treeX - 95, carinaY + 60);
    ctx.quadraticCurveTo(treeX - 90, carinaY + 95, treeX - 80, carinaY + 130);
    ctx.stroke();

    // Right sub-branches
    ctx.beginPath();
    ctx.moveTo(treeX + 95, carinaY + 60);
    ctx.quadraticCurveTo(treeX + 130, carinaY + 80, treeX + 145, carinaY + 125);
    ctx.moveTo(treeX + 95, carinaY + 60);
    ctx.quadraticCurveTo(treeX + 90, carinaY + 95, treeX + 80, carinaY + 130);
    ctx.stroke();

    // Inner Airway Lumen Fill (Darker Hollow Center)
    ctx.strokeStyle = '#022C22';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(treeX, carinaY);
    ctx.quadraticCurveTo(treeX - 55, carinaY + 25, treeX - 95, carinaY + 60);
    ctx.moveTo(treeX, carinaY);
    ctx.quadraticCurveTo(treeX + 55, carinaY + 25, treeX + 95, carinaY + 60);
    ctx.stroke();

    // PURULENT CF MUCUS PLUGS (Target Obstruction in Distal Bronchioles)
    const plugTargets = [
      { x: treeX - 145, y: carinaY + 125 },
      { x: treeX - 80, y: carinaY + 130 },
      { x: treeX + 80, y: carinaY + 130 },
      { x: treeX + 145, y: carinaY + 125 }
    ];

    plugTargets.forEach((pl, idx) => {
      // Thick amber / dark yellow gelatinous plug
      ctx.fillStyle = '#D97706';
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(pl.x, pl.y, 16, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // eDNA network fibers inside plug
      ctx.strokeStyle = '#78350F';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pl.x - 10, pl.y - 3);
      ctx.lineTo(pl.x + 8, pl.y + 4);
      ctx.moveTo(pl.x - 7, pl.y + 3);
      ctx.lineTo(pl.x + 9, pl.y - 4);
      ctx.stroke();
    });

    // Plug Label Callout
    ctx.font = '700 8.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#FBBF24';
    ctx.textAlign = 'center';
    ctx.fillText('TARGET CF MUCUS PLUGS (HIGH eDNA DENSITY)', treeX, carinaY + 155);

    // Moving Aerosol Particles Sorted by Aerodynamic Size
    this.airwayDepositionParticles.forEach(p => {
      let curX = treeX;
      let curY = treeY + p.t * 190;

      if (p.t > 0.25) {
        const branchProgress = (p.t - 0.25) / 0.75;
        const sign = p.branch === 'left' ? -1 : 1;
        const subOffset = p.subBranch === 0 ? -25 : 25;
        curX = treeX + sign * (branchProgress * 85 + (branchProgress > 0.6 ? subOffset : 0));
      }

      ctx.fillStyle = p.category === 'respirable' ? '#34D399' : p.color;
      ctx.beginPath();
      ctx.arc(curX, curY, p.radius, 0, Math.PI * 2);
      ctx.fill();

      // Glow on respirable particles
      if (p.category === 'respirable') {
        ctx.fillStyle = 'rgba(52, 211, 153, 0.4)';
        ctx.beginPath();
        ctx.arc(curX, curY, p.radius * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Glowing impact ripples on mucus plugs
    this.mucusImpactRipples.forEach(rip => {
      const target = rip.branch === 'left'
        ? (rip.subBranch === 0 ? plugTargets[0] : plugTargets[1])
        : (rip.subBranch === 0 ? plugTargets[2] : plugTargets[3]);

      ctx.strokeStyle = `rgba(52, 211, 153, ${rip.alpha})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(target.x, target.y, rip.radius, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Droplet Size Legend & Clinical Metrics Box
    const legY = vpY + vpH - 85;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(rightX + 16, legY, vpW - 32, 72, 8);
    ctx.fill();
    ctx.stroke();

    // Legend items
    ctx.textAlign = 'left';
    ctx.font = '700 8.5px "Plus Jakarta Sans", sans-serif';

    // Item 1: Respirable (Emerald green)
    ctx.fillStyle = '#34D399';
    ctx.beginPath();
    ctx.arc(rightX + 30, legY + 16, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#E2E8F0';
    ctx.fillText('1–5 µm (MMAD 2.4 µm): 82% Deep Penetration & Target Plug Deposition', rightX + 42, legY + 19);

    // Item 2: Large (Amber)
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(rightX + 30, legY + 34, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#CBD5E1';
    ctx.fillText('>10 µm: Upper Airway Loss (Inertial Impaction in Pharynx ~12%)', rightX + 42, legY + 37);

    // Item 3: Ultrafine (Slate)
    ctx.fillStyle = '#94A3B8';
    ctx.beginPath();
    ctx.arc(rightX + 30, legY + 52, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('<1 µm: Suspended & Exhaled Fraction (~6% No Tissue Contact)', rightX + 42, legY + 55);

    ctx.restore();

    ctx.restore();
  }

  /* ========================================================
     STAGE 12: Molecular Action: rhDNase 1 Cleaving & Lysing the DNA Mesh
     High-magnification visualization of aerosolized rhDNase 1 endonucleases
     hydrolyzing phosphodiester bonds, cleaving high-MW DNA, dissolving the mesh,
     and liberating entrapped Pseudomonas bacteria!
     ======================================================== */
  initStage12LysisData() {
    this.lysisTimer = 0;
    this.lysisLevel = 0; // 0.0 (dense mesh) to 1.0 (completely lysed)
    this.nebulizerPulse = 0;
    this.lysisCutsCount = 0;
    this.cleavageSparks = [];
    this.dissolvedOligomers = [];

    // DNA polymer mesh filaments spanning the field
    this.lysisFilaments = [];
    const numFilaments = 16;
    for (let f = 0; f < numFilaments; f++) {
      const angle = (f / numFilaments) * Math.PI * 2 + (Math.random() - 0.5) * 0.25;
      const nodes = [];
      const numNodes = 14;
      let curX = (Math.random() - 0.5) * 40;
      let curY = (Math.random() - 0.5) * 30;
      for (let n = 0; n < numNodes; n++) {
        const step = 24 + Math.random() * 12;
        const segAngle = angle + Math.sin(n * 0.8) * 0.35 + (Math.random() - 0.5) * 0.2;
        curX += Math.cos(segAngle) * step;
        curY += Math.sin(segAngle) * step;
        nodes.push({
          x: curX,
          y: curY,
          baseX: curX,
          baseY: curY,
          cleaved: false,
          cleaveProgress: 0,
          driftVx: (Math.random() - 0.5) * 0.6,
          driftVy: (Math.random() - 0.5) * 0.6,
          hasHistone: (n % 3 === 1)
        });
      }
      this.lysisFilaments.push({
        angle: angle,
        nodes: nodes
      });
    }

    // Crosslinking tension bridges
    this.lysisCrosslinks = [];
    for (let i = 0; i < 22; i++) {
      const f1 = Math.floor(Math.random() * numFilaments);
      const f2 = (f1 + 1 + Math.floor(Math.random() * (numFilaments - 2))) % numFilaments;
      const n1 = Math.floor(Math.random() * 12);
      const n2 = Math.floor(Math.random() * 12);
      this.lysisCrosslinks.push({ f1, n1, f2, n2, severed: false });
    }

    // Entrapped Pseudomonas bacteria
    this.lysisBacteria = [
      { x: -140, y: -60, angle: 0.3, trapped: true, speed: 0.2, flagellaPhase: 0 },
      { x: 120, y: 50, angle: -0.5, trapped: true, speed: 0.25, flagellaPhase: 1 },
      { x: -80, y: 70, angle: 1.1, trapped: true, speed: 0.18, flagellaPhase: 2 },
      { x: 90, y: -70, angle: -1.2, trapped: true, speed: 0.22, flagellaPhase: 3 },
      { x: 0, y: -20, angle: 0.6, trapped: true, speed: 0.3, flagellaPhase: 4 }
    ];

    // rhDNase 1 Endonuclease Enzyme molecules
    this.lysisEnzymes = [];
    for (let e = 0; e < 7; e++) {
      this.lysisEnzymes.push({
        x: (Math.random() - 0.5) * 440,
        y: (Math.random() - 0.5) * 260,
        vx: (Math.random() - 0.5) * 40,
        vy: (Math.random() - 0.5) * 40,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 1.5,
        dockedNode: null,
        cutCooldown: 0.5 + Math.random() * 1.2,
        auraPulse: Math.random() * Math.PI * 2
      });
    }
  }

  triggerNebulizerPulse() {
    this.nebulizerPulse = 1.0;
    if (window.soundEngine && window.soundEngine.playEnzymeCut) {
      window.soundEngine.playEnzymeCut();
    }
    // Spawn nebulizer aerosol mist droplets
    for (let i = 0; i < 40; i++) {
      this.cleavageSparks.push({
        x: (Math.random() - 0.5) * 700,
        y: -180 + Math.random() * 40,
        vx: (Math.random() - 0.5) * 20,
        vy: 40 + Math.random() * 60,
        alpha: 0.9,
        color: '#38BDF8',
        size: 3 + Math.random() * 3,
        life: 0.8 + Math.random() * 0.6
      });
    }
  }

  updateStage12Lysis(dt) {
    this.lysisTimer += dt;
    if (this.nebulizerPulse > 0) {
      this.nebulizerPulse = Math.max(0, this.nebulizerPulse - dt * 0.8);
    }

    // Auto progress lysis smoothly (or accelerated when nebulizer active)
    const speedMult = 1.0 + (this.nebulizerPulse * 3.5);
    this.lysisLevel = Math.min(1.0, this.lysisLevel + (dt * 0.08) * speedMult);

    // Update enzymes
    this.lysisEnzymes.forEach((enz, eIdx) => {
      enz.auraPulse += dt * 5;
      enz.angle += enz.angularSpeed * dt;

      if (!enz.dockedNode) {
        // Move freely seeking substrate
        enz.x += enz.vx * dt;
        enz.y += enz.vy * dt;
        if (enz.x > 380) { enz.vx = -Math.abs(enz.vx); }
        if (enz.x < -380) { enz.vx = Math.abs(enz.vx); }
        if (enz.y > 180) { enz.vy = -Math.abs(enz.vy); }
        if (enz.y < -150) { enz.vy = Math.abs(enz.vy); }

        enz.cutCooldown -= dt;
        if (enz.cutCooldown <= 0) {
          // Find closest uncleaved node
          let bestDist = 140;
          let candidate = null;
          this.lysisFilaments.forEach((fil, fIdx) => {
            fil.nodes.forEach((node, nIdx) => {
              if (!node.cleaved) {
                const d = Math.hypot(node.x - enz.x, node.y - enz.y);
                if (d < bestDist) {
                  bestDist = d;
                  candidate = { fil: fIdx, node: nIdx };
                }
              }
            });
          });

          if (candidate) {
            enz.dockedNode = candidate;
            enz.dockTimer = 0.45;
          } else {
            enz.cutCooldown = 0.8;
          }
        }
      } else {
        // Docked: homing into node and cutting!
        const fil = this.lysisFilaments[enz.dockedNode.fil];
        const targetNode = fil ? fil.nodes[enz.dockedNode.node] : null;
        if (targetNode) {
          enz.x += (targetNode.x - enz.x) * dt * 8;
          enz.y += (targetNode.y - enz.y) * dt * 8;
          enz.dockTimer -= dt;

          if (enz.dockTimer <= 0) {
            // EXECUTE CLEAVAGE!
            targetNode.cleaved = true;
            this.lysisCutsCount += 1420;
            if (eIdx === 0 && window.soundEngine && window.soundEngine.playEnzymeCut && Math.random() < 0.35) {
              window.soundEngine.playEnzymeCut();
            }

            // Sever connected crosslinks
            this.lysisCrosslinks.forEach(cl => {
              if ((cl.f1 === enz.dockedNode.fil && cl.n1 === enz.dockedNode.node) ||
                  (cl.f2 === enz.dockedNode.fil && cl.n2 === enz.dockedNode.node)) {
                cl.severed = true;
              }
            });

            // Burst enzymatic sparks
            for (let s = 0; s < 6; s++) {
              this.cleavageSparks.push({
                x: targetNode.x,
                y: targetNode.y,
                vx: (Math.random() - 0.5) * 80,
                vy: (Math.random() - 0.5) * 80,
                alpha: 1.0,
                color: Math.random() > 0.5 ? '#F59E0B' : '#38BDF8',
                size: 2.5 + Math.random() * 2,
                life: 0.4 + Math.random() * 0.3
              });
            }

            // Create free floating oligonucleotide fragment
            this.dissolvedOligomers.push({
              x: targetNode.x,
              y: targetNode.y,
              len: 8 + Math.random() * 10,
              angle: Math.random() * Math.PI * 2,
              vx: (Math.random() - 0.5) * 15,
              vy: (Math.random() - 0.5) * 15,
              alpha: 0.95
            });

            enz.dockedNode = null;
            enz.cutCooldown = 0.4 + Math.random() * 0.8;
            enz.vx = (Math.random() - 0.5) * 50;
            enz.vy = (Math.random() - 0.5) * 50;
          }
        } else {
          enz.dockedNode = null;
        }
      }
    });

    // Update nodes drift when cleaved
    this.lysisFilaments.forEach(fil => {
      fil.nodes.forEach(node => {
        if (node.cleaved) {
          node.x += node.driftVx * dt * 12;
          node.y += node.driftVy * dt * 12;
        }
      });
    });

    // Update sparks
    for (let i = this.cleavageSparks.length - 1; i >= 0; i--) {
      const sp = this.cleavageSparks[i];
      sp.x += sp.vx * dt;
      sp.y += sp.vy * dt;
      sp.life -= dt;
      sp.alpha = Math.max(0, sp.life / 0.7);
      if (sp.life <= 0) {
        this.cleavageSparks.splice(i, 1);
      }
    }

    // Update free oligomers
    this.dissolvedOligomers.forEach(ol => {
      ol.x += ol.vx * dt;
      ol.y += ol.vy * dt;
      ol.angle += 0.2 * dt;
    });
    if (this.dissolvedOligomers.length > 60) {
      this.dissolvedOligomers.splice(0, 10);
    }

    // Bacteria escape from dissolving web
    this.lysisBacteria.forEach(bact => {
      bact.flagellaPhase += dt * 12;
      if (this.lysisLevel > 0.35) {
        bact.trapped = false;
        bact.x += Math.cos(bact.angle) * bact.speed * 40 * dt;
        bact.y += Math.sin(bact.angle) * bact.speed * 40 * dt;
        if (bact.x > 380) bact.angle = Math.PI - bact.angle;
        if (bact.x < -380) bact.angle = Math.PI - bact.angle;
        if (bact.y > 170) bact.angle = -bact.angle;
        if (bact.y < -140) bact.angle = -bact.angle;
      } else {
        bact.x += Math.sin(this.time * 8 + bact.flagellaPhase) * 0.4;
      }
    });
  }

  drawStage12DnaLysis(ctx) {
    ctx.save();

    // 1. Pristine Medical Stage Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(-500, -260, 1000, 520);

    // Subtle background grid dots
    ctx.fillStyle = '#E2E8F0';
    for (let gx = -460; gx <= 460; gx += 40) {
      for (let gy = -220; gy <= 220; gy += 40) {
        ctx.beginPath();
        ctx.arc(gx, gy, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 2. Top Header Section
    ctx.fillStyle = '#F8FAFC';
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(-240, -252, 480, 26, 13);
    ctx.fill();
    ctx.stroke();

    ctx.font = '700 9.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#0284C7';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('● MOLECULAR ACTION • RECOMBINANT HUMAN DNASE 1 (DORNASE ALFA)', 0, -239);

    ctx.font = '800 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#0F172A';
    ctx.fillText('Enzymatic Cleavage & Lysis of Extracellular DNA (eDNA) Mesh', 0, -210);

    ctx.font = '500 11.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText('rhDNase 1 selectively hydrolyzes phosphodiester backbones, dissolving the rigid viscoelastic polymer mesh.', 0, -188);

    // 3. Interactive Nebulizer Spray Button (Top Right)
    const btnX = 200;
    const btnY = -252;
    const btnW = 260;
    const btnH = 28;
    const nebActive = (this.nebulizerPulse > 0.05);

    ctx.save();
    if (nebActive) {
      ctx.shadowColor = 'rgba(14, 165, 233, 0.6)';
      ctx.shadowBlur = 12;
    }
    const btnGrad = ctx.createLinearGradient(btnX, 0, btnX + btnW, 0);
    btnGrad.addColorStop(0, nebActive ? '#0284C7' : '#0369A1');
    btnGrad.addColorStop(1, nebActive ? '#38BDF8' : '#0284C7');
    ctx.fillStyle = btnGrad;
    ctx.beginPath();
    ctx.roundRect(btnX, btnY, btnW, btnH, 14);
    ctx.fill();

    ctx.strokeStyle = '#BAE6FD';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.font = '700 10.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ Click to Inhale rhDNase 1 Mist', btnX + btnW / 2, btnY + btnH / 2);
    ctx.restore();

    // 4. Microscopic Inspection Viewport Card
    const vpX = -460;
    const vpY = -170;
    const vpW = 920;
    const vpH = 415;

    ctx.save();
    ctx.fillStyle = '#090D16';
    ctx.beginPath();
    ctx.roundRect(vpX, vpY, vpW, vpH, 12);
    ctx.fill();

    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Soft cellular fluid vignette inside viewport
    const vGrad = ctx.createRadialGradient(0, vpY + vpH / 2, 80, 0, vpY + vpH / 2, 450);
    vGrad.addColorStop(0, 'rgba(15, 23, 42, 0.1)');
    vGrad.addColorStop(1, 'rgba(3, 7, 18, 0.85)');
    ctx.fillStyle = vGrad;
    ctx.roundRect(vpX, vpY, vpW, vpH, 12);
    ctx.fill();

    // Clip rendering to viewport
    ctx.beginPath();
    ctx.roundRect(vpX, vpY, vpW, vpH, 12);
    ctx.clip();

    // Draw Crosslink tension lines between filaments
    ctx.strokeStyle = 'rgba(147, 51, 234, 0.35)';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([3, 4]);
    this.lysisCrosslinks.forEach(cl => {
      if (cl.severed) return;
      const f1 = this.lysisFilaments[cl.f1];
      const f2 = this.lysisFilaments[cl.f2];
      if (f1 && f2 && f1.nodes[cl.n1] && f2.nodes[cl.n2]) {
        const pt1 = f1.nodes[cl.n1];
        const pt2 = f2.nodes[cl.n2];
        ctx.beginPath();
        ctx.moveTo(pt1.x, pt1.y);
        ctx.lineTo(pt2.x, pt2.y);
        ctx.stroke();
      }
    });
    ctx.setLineDash([]);

    // Draw DNA Filaments (Double stranded helical effect)
    this.lysisFilaments.forEach((fil, fIdx) => {
      for (let n = 0; n < fil.nodes.length - 1; n++) {
        const p1 = fil.nodes[n];
        const p2 = fil.nodes[n + 1];

        if (p1.cleaved && p2.cleaved) {
          // Both cleaved: segment has disintegrated into solution
          continue;
        }

        const isCleaved = p1.cleaved || p2.cleaved;
        const strandAlpha = isCleaved ? 0.35 : 0.85;

        // Double strand 1 (Indigo backbone)
        ctx.strokeStyle = `rgba(99, 102, 241, ${strandAlpha})`;
        ctx.lineWidth = isCleaved ? 1.4 : 2.4;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        const wave = Math.sin(this.time * 2 + n + fIdx) * 2;
        ctx.quadraticCurveTo((p1.x + p2.x) / 2 + wave, (p1.y + p2.y) / 2 - wave, p2.x, p2.y);
        ctx.stroke();

        // Double strand 2 (Cyan complementary backbone)
        ctx.strokeStyle = `rgba(56, 189, 248, ${strandAlpha * 0.75})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(p1.x + 2, p1.y + 2);
        ctx.quadraticCurveTo((p1.x + p2.x) / 2 - wave, (p1.y + p2.y) / 2 + wave, p2.x + 2, p2.y + 2);
        ctx.stroke();

        // Base-pair rungs
        if (!isCleaved) {
          ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.moveTo((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
          ctx.lineTo((p1.x + p2.x) / 2 + 3, (p1.y + p2.y) / 2 + 3);
          ctx.stroke();
        }

        // Histone octamer core particles bound to DNA
        if (p1.hasHistone && !p1.cleaved) {
          ctx.fillStyle = '#F59E0B';
          ctx.beginPath();
          ctx.arc(p1.x, p1.y, 3.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });

    // Draw free-floating cleaved oligonucleotides (<100 bp)
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 1.5;
    this.dissolvedOligomers.forEach(ol => {
      ctx.save();
      ctx.translate(ol.x, ol.y);
      ctx.rotate(ol.angle);
      ctx.globalAlpha = ol.alpha;
      ctx.beginPath();
      ctx.moveTo(-ol.len / 2, 0);
      ctx.lineTo(ol.len / 2, 0);
      ctx.stroke();

      // Terminal 3'-OH and 5'-P marker dots
      ctx.fillStyle = '#EC4899';
      ctx.beginPath();
      ctx.arc(-ol.len / 2, 0, 1.4, 0, Math.PI * 2);
      ctx.arc(ol.len / 2, 0, 1.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Draw Pseudomonas bacteria (trapped or liberated)
    this.lysisBacteria.forEach(bact => {
      ctx.save();
      ctx.translate(bact.x, bact.y);
      ctx.rotate(bact.angle);

      // Capsule body
      ctx.fillStyle = '#22C55E';
      ctx.strokeStyle = '#15803D';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-14, -6, 28, 12, 6);
      ctx.fill();
      ctx.stroke();

      // Flagella tail
      ctx.strokeStyle = '#16A34A';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-14, 0);
      for (let s = 1; s <= 4; s++) {
        ctx.lineTo(-14 - s * 4, Math.sin(bact.flagellaPhase + s * 1.2) * 4);
      }
      ctx.stroke();

      // Entrapment indicator rings if trapped
      if (bact.trapped) {
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(0, 0, 18, 10, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    });

    // Draw Catalytic Sparks
    this.cleavageSparks.forEach(sp => {
      ctx.fillStyle = sp.color;
      ctx.globalAlpha = sp.alpha;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw rhDNase 1 Endonuclease Enzyme Molecules
    this.lysisEnzymes.forEach((enz, eIdx) => {
      ctx.save();
      ctx.translate(enz.x, enz.y);
      ctx.rotate(enz.angle);

      // Outer catalytic enzyme aura
      const auraPulse = Math.sin(enz.auraPulse) * 2;
      ctx.fillStyle = 'rgba(14, 165, 233, 0.15)';
      ctx.beginPath();
      ctx.arc(0, 0, 22 + auraPulse, 0, Math.PI * 2);
      ctx.fill();

      // Enzyme bi-lobed globular fold (Kidney shaped endonuclease 37 kDa)
      const enzGrad = ctx.createLinearGradient(-15, -12, 15, 12);
      enzGrad.addColorStop(0, '#0284C7');
      enzGrad.addColorStop(0.5, '#0369A1');
      enzGrad.addColorStop(1, '#075985');

      ctx.fillStyle = enzGrad;
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 1.6;

      ctx.beginPath();
      ctx.arc(-6, 0, 11, Math.PI * 0.4, Math.PI * 1.6);
      ctx.arc(6, 0, 11, Math.PI * 1.4, Math.PI * 0.6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Catalytic Cleft (Active Site Pocket)
      ctx.fillStyle = '#0C4A6E';
      ctx.beginPath();
      ctx.arc(0, -2, 5.5, 0, Math.PI * 2);
      ctx.fill();

      // Coordinated Ca²⁺ ion (Cyan sphere: structural stabilization)
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(-4, -2, 2.8, 0, Math.PI * 2);
      ctx.fill();

      // Coordinated Mg²⁺ ion (Amber gold sphere: catalytic nucleophile activation)
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(4, -2, 2.8, 0, Math.PI * 2);
      ctx.fill();

      // Cleaving Scissors indicator if docked
      if (enz.dockedNode) {
        ctx.strokeStyle = '#FEF08A';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(-5, 8);
        ctx.lineTo(5, 14);
        ctx.moveTo(5, 8);
        ctx.lineTo(-5, 14);
        ctx.stroke();
      }

      ctx.restore();
    });

    // 5. Live Biophysical Telemetry Glassmorphic Dashboard (Bottom Left)
    const cardX = vpX + 16;
    const cardY = vpY + vpH - 142;
    const cardW = 345;
    const cardH = 126;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 8);
    ctx.fill();
    ctx.stroke();

    ctx.font = '700 9px "JetBrains Mono", monospace';
    ctx.fillStyle = '#38BDF8';
    ctx.textAlign = 'left';
    ctx.fillText('● REAL-TIME BIOPHYSICAL TELEMETRY', cardX + 12, cardY + 18);

    // Metric 1: DNA Polymer Length (100,000 bp -> <85 bp)
    const curBp = Math.max(78, Math.round(100000 * (1.0 - this.lysisLevel * 0.999)));
    ctx.font = '500 9.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('DNA Chain Length:', cardX + 12, cardY + 38);
    ctx.font = '700 10.5px "JetBrains Mono", monospace';
    ctx.fillStyle = this.lysisLevel > 0.6 ? '#10B981' : '#F59E0B';
    ctx.fillText(`${curBp.toLocaleString()} bp`, cardX + 120, cardY + 38);

    // Bar 1
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.roundRect(cardX + 215, cardY + 28, 115, 10, 3);
    ctx.fill();
    ctx.fillStyle = this.lysisLevel > 0.6 ? '#10B981' : '#F59E0B';
    ctx.beginPath();
    ctx.roundRect(cardX + 215, cardY + 28, Math.max(6, 115 * (1.0 - this.lysisLevel)), 10, 3);
    ctx.fill();

    // Metric 2: Sputum Viscoelasticity (98% -> 4%)
    const viscPct = Math.max(4, Math.round(98 * (1.0 - this.lysisLevel * 0.96)));
    ctx.font = '500 9.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('Mesh Viscoelasticity:', cardX + 12, cardY + 58);
    ctx.font = '700 10.5px "JetBrains Mono", monospace';
    ctx.fillStyle = viscPct < 20 ? '#10B981' : '#EF4444';
    ctx.fillText(`${viscPct}% (Gel → Sol)`, cardX + 120, cardY + 58);

    // Bar 2
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.roundRect(cardX + 215, cardY + 48, 115, 10, 3);
    ctx.fill();
    ctx.fillStyle = viscPct < 20 ? '#10B981' : '#EF4444';
    ctx.beginPath();
    ctx.roundRect(cardX + 215, cardY + 48, Math.max(6, 115 * (viscPct / 100)), 10, 3);
    ctx.fill();

    // Metric 3: Phosphodiester Bonds Cleaved
    const totalCuts = Math.round(this.lysisCutsCount + this.lysisLevel * 45000);
    ctx.font = '500 9.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('Hydrolytic Cleavages:', cardX + 12, cardY + 78);
    ctx.font = '700 10.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#38BDF8';
    ctx.fillText(`${totalCuts.toLocaleString()} bonds`, cardX + 120, cardY + 78);

    // Reaction Formula at bottom of card
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cardX + 10, cardY + 92);
    ctx.lineTo(cardX + cardW - 10, cardY + 92);
    ctx.stroke();

    ctx.font = '600 8.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#CBD5E1';
    ctx.fillText('DNA-(P-O-C)ₙ + H₂O ──[rhDNase 1 (Ca²⁺/Mg²⁺)]──> 5\'-P Oligonucleotides', cardX + 12, cardY + 108);

    // Restore clip
    ctx.restore();

    // 6. Scientific Callout Badges
    this.drawCallout(ctx, 40, -40, 160, -110, 'rhDNase 1 Endonuclease (Ca²⁺/Mg²⁺ Pocket)', '#0284C7');
    this.drawCallout(ctx, -140, -20, -320, -90, 'Phosphodiester Cleavage Sites (Lysis)', '#6366F1');
    if (this.lysisLevel > 0.4) {
      this.drawCallout(ctx, -120, 30, -320, 20, 'Soluble Short Oligomers (<100 bp)', '#38BDF8');
      this.drawCallout(ctx, 120, 50, 240, 30, 'Pseudomonas Escaping Dissolved Web', '#16A34A');
    }

    ctx.restore();
  }

  /* ========================================================
     STAGE 12: Physiological Rescue: Sputum Liquefaction & Mucociliary Clearance
     Anatomical dual comparative presentation of the bronchial airway before & after rhDNase:
     Reversing hyper-viscosity, reactivating metachronal cilia wave (14 Hz),
     opening the airway lumen, and restoring lung ventilation!
     ======================================================== */
  initStage13ClearanceData() {
    this.clearanceTimer = 0;
    this.ciliaPhase = 0;
    this.mucusEscalatorOffset = 0;

    // Airway airflow particles
    this.airflowParticles = [];
    for (let i = 0; i < 40; i++) {
      this.airflowParticles.push({
        x: (Math.random() - 0.5) * 360 + 240,
        y: -140 + Math.random() * 240,
        speed: 90 + Math.random() * 70,
        radius: 2 + Math.random() * 2,
        alpha: 0.35 + Math.random() * 0.5
      });
    }

    // Moving liquefied mucus rafts along escalator
    this.escalatorRafts = [];
    for (let i = 0; i < 16; i++) {
      this.escalatorRafts.push({
        x: 30 + (i * 26),
        y: 64 + (Math.random() - 0.5) * 6,
        size: 5 + Math.random() * 6,
        speed: 26 + Math.random() * 12
      });
    }
  }

  updateStage13Clearance(dt) {
    this.clearanceTimer += dt;
    this.ciliaPhase += dt * 14.2; // 14.2 Hz physiological ciliary beat frequency
    this.mucusEscalatorOffset += dt * 45; // Mucociliary escalator upward velocity

    this.airflowParticles.forEach(p => {
      p.y -= p.speed * dt;
      if (p.y < -160) {
        p.y = 100;
        p.x = 240 + (Math.random() - 0.5) * 360;
      }
    });

    this.escalatorRafts.forEach(r => {
      r.x += r.speed * dt;
      if (r.x > 440) {
        r.x = 35;
        r.y = 64 + (Math.random() - 0.5) * 6;
      }
    });
  }

  drawStage13AirwayClearance(ctx) {
    ctx.save();

    // 1. Pristine Medical Stage Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(-500, -260, 1000, 520);

    // Subtle background grid dots
    ctx.fillStyle = '#E2E8F0';
    for (let gx = -460; gx <= 460; gx += 40) {
      for (let gy = -220; gy <= 220; gy += 40) {
        ctx.beginPath();
        ctx.arc(gx, gy, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 2. Header Section
    ctx.fillStyle = '#F8FAFC';
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(-240, -252, 480, 26, 13);
    ctx.fill();
    ctx.stroke();

    ctx.font = '700 9.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#059669';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('● PHYSIOLOGICAL RESCUE • MUCOUS MEMBRANE CLEARANCE', 0, -239);

    ctx.font = '800 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#0F172A';
    ctx.fillText('Sputum Liquefaction, Ciliary Wave Reactivation & Lumen Patency', 0, -210);

    ctx.font = '500 11.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText('Dissolving the DNA mesh converts suffocating gel into flowing sol, restoring natural mucociliary escalator defense.', 0, -188);

    // 3. Side-by-Side Comparative Cards
    const cardW = 445;
    const cardH = 295;
    const cardY = -172;

    // --- LEFT CARD: UNTREATED CF AIRWAY ---
    const leftX = -460;
    ctx.save();
    ctx.fillStyle = '#FFF7ED';
    ctx.strokeStyle = '#FDBA74';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(leftX, cardY, cardW, cardH, 10);
    ctx.fill();
    ctx.stroke();

    // Header badge
    ctx.fillStyle = '#FFEDD5';
    ctx.strokeStyle = '#EA580C';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(leftX + 14, cardY + 12, cardW - 28, 24, 6);
    ctx.fill();
    ctx.stroke();

    ctx.font = '800 10px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#C2410C';
    ctx.textAlign = 'center';
    ctx.fillText('❌ PRE-TREATMENT: DESICCATED DNA MESH & CILIARY PARALYSIS', leftX + cardW / 2, cardY + 24);

    // Airway Illustration Left
    const artLeftY = cardY + 50;
    const artH = 145;

    // Epithelial basement membrane & columnar cells
    ctx.fillStyle = '#FED7AA';
    ctx.fillRect(leftX + 16, artLeftY + 95, cardW - 32, 45);

    // Columnar epithelial cell dividers
    ctx.strokeStyle = '#FB923C';
    ctx.lineWidth = 1;
    for (let cx = leftX + 16; cx < leftX + cardW - 16; cx += 32) {
      ctx.beginPath();
      ctx.moveTo(cx, artLeftY + 95);
      ctx.lineTo(cx, artLeftY + 140);
      ctx.stroke();

      // Nuclei
      ctx.fillStyle = '#EA580C';
      ctx.beginPath();
      ctx.arc(cx + 16, artLeftY + 118, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // CRUSHED / MATTED CILIA (0 Hz: flattened against cell surface)
    ctx.strokeStyle = '#9A3412';
    ctx.lineWidth = 1.8;
    for (let cx = leftX + 20; cx < leftX + cardW - 24; cx += 8) {
      ctx.beginPath();
      ctx.moveTo(cx, artLeftY + 95);
      // Bent flat horizontally
      ctx.lineTo(cx + 10, artLeftY + 98);
      ctx.stroke();
    }

    // Thick suffocating gel mucus layer (Ochre / dark amber sludge)
    const gelGrad = ctx.createLinearGradient(0, artLeftY + 25, 0, artLeftY + 95);
    gelGrad.addColorStop(0, 'rgba(217, 119, 6, 0.85)');
    gelGrad.addColorStop(1, 'rgba(180, 83, 9, 0.95)');
    ctx.fillStyle = gelGrad;
    ctx.fillRect(leftX + 16, artLeftY + 25, cardW - 32, 70);

    // Entrapped bacteria dots in sludge
    ctx.fillStyle = '#16A34A';
    for (let b = 0; b < 14; b++) {
      const bx = leftX + 35 + (b * 28) % (cardW - 60);
      const by = artLeftY + 38 + (b * 12) % 45;
      ctx.beginPath();
      ctx.roundRect(bx, by, 10, 5, 2.5);
      ctx.fill();
    }

    // Airway lumen (occluded, narrow with turbulent red resistance arrows)
    ctx.fillStyle = '#FEF2F2';
    ctx.fillRect(leftX + 16, artLeftY, cardW - 32, 25);

    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(leftX + 35, artLeftY + 12);
    ctx.lineTo(leftX + cardW - 35, artLeftY + 12);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.font = '700 8.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#DC2626';
    ctx.textAlign = 'center';
    ctx.fillText('⚠ SEVERE AIRWAY RESISTANCE (Raw +320%) • CHOKED VENTILATION', leftX + cardW / 2, artLeftY + 13);

    // Left Metric Summary Box
    const metY = artLeftY + artH + 10;
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#FED7AA';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(leftX + 16, metY, cardW - 32, 72, 6);
    ctx.fill();
    ctx.stroke();

    ctx.font = '700 9.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#9A3412';
    ctx.textAlign = 'left';
    ctx.fillText('• Sputum Viscosity: >12,000 cP (Rigid DNA Gel)', leftX + 26, metY + 18);
    ctx.fillText('• Ciliary Beat Freq: 0 Hz (Crushed / Paralyzed)', leftX + 26, metY + 36);
    ctx.fillText('• Mucus Transport:  0.0 mm/min (Stagnant Plugs)', leftX + 26, metY + 54);
    ctx.restore();


    // --- RIGHT CARD: POST-rhDNASE 1 RESCUED AIRWAY ---
    const rightX = 15;
    ctx.save();
    ctx.fillStyle = '#F0FDF4';
    ctx.strokeStyle = '#86EFAC';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(rightX, cardY, cardW, cardH, 10);
    ctx.fill();
    ctx.stroke();

    // Header badge
    ctx.fillStyle = '#DCFCE7';
    ctx.strokeStyle = '#16A34A';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(rightX + 14, cardY + 12, cardW - 28, 24, 6);
    ctx.fill();
    ctx.stroke();

    ctx.font = '800 10px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#15803D';
    ctx.textAlign = 'center';
    ctx.fillText('✓ POST-rhDNASE 1: FLUID SOL LAYER & ACTIVE CILIARY ESCALATOR', rightX + cardW / 2, cardY + 24);

    // Airway Illustration Right
    const artRightY = cardY + 50;

    // Epithelial basement membrane & columnar cells
    ctx.fillStyle = '#E0F2FE';
    ctx.fillRect(rightX + 16, artRightY + 95, cardW - 32, 45);

    // Columnar epithelial cell dividers
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 1;
    for (let cx = rightX + 16; cx < rightX + cardW - 16; cx += 32) {
      ctx.beginPath();
      ctx.moveTo(cx, artRightY + 95);
      ctx.lineTo(cx, artRightY + 140);
      ctx.stroke();

      // Nuclei
      ctx.fillStyle = '#0284C7';
      ctx.beginPath();
      ctx.arc(cx + 16, artRightY + 118, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // ACTIVE METACHRONAL WAVE CILIA (14 Hz synchronized beating)
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 1.8;
    for (let cx = rightX + 20, idx = 0; cx < rightX + cardW - 24; cx += 8, idx++) {
      ctx.beginPath();
      ctx.moveTo(cx, artRightY + 95);
      // Synchronous metachronal wave stroke
      const cilWave = Math.sin(this.ciliaPhase + idx * 0.38) * 8;
      ctx.quadraticCurveTo(cx + cilWave * 0.5, artRightY + 80, cx + cilWave, artRightY + 68);
      ctx.stroke();
    }

    // Thin, watery lubricated sol-mucus layer (Pale fluid cyan/sky blue)
    const solGrad = ctx.createLinearGradient(0, artRightY + 58, 0, artRightY + 74);
    solGrad.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
    solGrad.addColorStop(1, 'rgba(14, 165, 233, 0.45)');
    ctx.fillStyle = solGrad;
    ctx.fillRect(rightX + 16, artRightY + 58, cardW - 32, 16);

    // Open Patent Airway Lumen with smooth laminar blue airflow streams
    ctx.fillStyle = '#F0F9FF';
    ctx.fillRect(rightX + 16, artRightY, cardW - 32, 58);

    // Animated Laminar Airflow Streams
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 1.6;
    for (let line = 0; line < 3; line++) {
      const ly = artRightY + 14 + line * 16;
      ctx.beginPath();
      ctx.moveTo(rightX + 35, ly);
      ctx.lineTo(rightX + cardW - 35, ly);
      ctx.stroke();

      // Arrowheads
      ctx.fillStyle = '#0284C7';
      ctx.beginPath();
      ctx.moveTo(rightX + cardW - 35, ly);
      ctx.lineTo(rightX + cardW - 43, ly - 4);
      ctx.lineTo(rightX + cardW - 43, ly + 4);
      ctx.fill();
    }

    ctx.font = '700 8.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#0369A1';
    ctx.textAlign = 'center';
    ctx.fillText('RESTORED BRONCHIAL PATENCY • SMOOTH LAMINAR AIRFLOW (FEV₁ +15.8%)', rightX + cardW / 2, artRightY + 10);

    // Right Metric Summary Box
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#86EFAC';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(rightX + 16, metY, cardW - 32, 72, 6);
    ctx.fill();
    ctx.stroke();

    ctx.font = '700 9.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#15803D';
    ctx.textAlign = 'left';
    ctx.fillText('• Sputum Viscosity: 15 cP (800× Liquefaction Drop!)', rightX + 26, metY + 18);
    ctx.fillText('• Ciliary Beat Freq: 14 Hz (Synchronous Metachronal Wave)', rightX + 26, metY + 36);
    ctx.fillText('• Mucus Transport:  8.5 mm/min (Normal Escalator Speed)', rightX + 26, metY + 54);
    ctx.restore();


    // 4. Bottom Clinical Resolution Banner (Hi Nanna Case Study & CF Patients)
    const bnrX = -460;
    const bnrY = 132;
    const bnrW = 920;
    const bnrH = 108;

    ctx.save();
    ctx.fillStyle = '#F8FAFC';
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(bnrX, bnrY, bnrW, bnrH, 8);
    ctx.fill();
    ctx.stroke();

    // Banner Top Header
    ctx.font = '800 10.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#1E293B';
    ctx.textAlign = 'left';
    ctx.fillText('★ CLINICAL OUTCOMES & THERAPEUTIC RESOLUTION (HI NANNA CASE STUDY):', bnrX + 16, bnrY + 20);

    // 3 Column Pillars
    const colW = (bnrW - 48) / 3;
    const pillars = [
      {
        title: '1. Sputum Clearance',
        desc: 'Sputum viscosity plunges from 12,000 cP to 15 cP. Secretions are cleared easily with gentle coughing without airway trauma.'
      },
      {
        title: '2. Infection Defense',
        desc: 'Pseudomonas bio-colonization is halted. Patients experience a 28% to 37% reduction in life-threatening lung exacerbations.'
      },
      {
        title: '3. Long-Term Survival',
        desc: 'Mahi and CF patients maintain sustained +15.8% FEV₁ lung function, enabling normal play, exercise, and extended life expectancy.'
      }
    ];

    pillars.forEach((pil, pIdx) => {
      const px = bnrX + 16 + pIdx * (colW + 8);
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(px, bnrY + 32, colW, 66, 6);
      ctx.fill();
      ctx.stroke();

      ctx.font = '700 10px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#0284C7';
      ctx.fillText(pil.title, px + 10, bnrY + 48);

      ctx.font = '400 9px/1.35 "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#475569';
      // Word wrap text into 2 lines
      const words = pil.desc.split(' ');
      let line1 = '';
      let line2 = '';
      words.forEach(w => {
        if ((line1 + w).length < 38) line1 += w + ' ';
        else line2 += w + ' ';
      });
      ctx.fillText(line1, px + 10, bnrY + 66);
      ctx.fillText(line2, px + 10, bnrY + 80);
    });

    ctx.restore();

    ctx.restore();
  }

  /* ========================================================
     STAGE 14: Industrial Evolution: Past Slaughterhouse vs. Modern Biosynthesis
     Fully animated split-screen comparative visual scene with 4 structured stations per route:
     Left (Past):
       1. Cattle Pancreas Harvesting & Maceration
       2. Crude 0.25N H2SO4 Acid Digestion & (NH4)2SO4 Salting Out
       3. Contaminated Extract with Chymotrypsin & Bovine Trypsin Proteases
       4. Severe Clinical Crisis (Fatal Airway Destruction & Anaphylaxis)
     Right (Modern):
       1. Recombinant human DNA (rhDNase cDNA) Vector Design
       2. Validated CHO-K1 Master Cell Bank (MCB)
       3. 10,000L Fed-Batch cGMP Bioreactor Fermentation
       4. Multi-Column Downstream Purification & Sterile BFS Ampule
     ======================================================== */
  initStage14PastVsPresent() {
    this.stage14Timer = 0;

    // 1. Left (Past 1950s): Contaminant bovine digestive proteases (Trypsin, Chymotrypsin)
    this.s14ProteaseMolecules = [
      { x: -380, y: 35, vx: 18, vy: 8, label: 'Bovine Trypsin', sub: '23.3 kDa', cleftAngle: 0 },
      { x: -280, y: 15, vx: -16, vy: -12, label: 'Chymotrypsin A', sub: '25.0 kDa', cleftAngle: 1.2 },
      { x: -180, y: 40, vx: 20, vy: -10, label: 'Carboxypeptidase', sub: '34.6 kDa', cleftAngle: 2.4 }
    ];

    // Airway mucosal tight junction segments being proteolytically disrupted on the left
    this.s14MucosaSegments = [];
    for (let i = 0; i < 14; i++) {
      this.s14MucosaSegments.push({
        x: -430 + i * 30,
        height: 38 + Math.sin(i * 1.5) * 8,
        damageProgress: (i % 3 === 0) ? 0.8 : (i % 2 === 0 ? 0.4 : 0.1),
        ciliaOffset: Math.random() * Math.PI * 2
      });
    }

    // Immune antibody complex clusters (anti-bovine IgG/IgE)
    this.s14ImmuneComplexes = [];
    for (let i = 0; i < 5; i++) {
      this.s14ImmuneComplexes.push({
        x: -360 + i * 65,
        y: -15 + (i % 2) * 25,
        rot: i * 1.1,
        pulsePhase: i * 0.8
      });
    }

    // 2. Right (Modern Present): 3D Monomeric rhDNase 1 recombinant enzymes with native N-glycans
    this.s14RecombinantMolecules = [];
    for (let i = 0; i < 7; i++) {
      this.s14RecombinantMolecules.push({
        x: 60 + (i % 3) * 110,
        y: -30 + Math.floor(i / 3) * 65,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.5) * 14,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: 0.6 + Math.random() * 0.8,
        scale: 0.95 + Math.random() * 0.2
      });
    }

    // DNA substrate fragments being cleaved cleanly by rhDNase 1 on the right
    this.s14DnaSubstrates = [];
    for (let i = 0; i < 12; i++) {
      this.s14DnaSubstrates.push({
        x: 80 + Math.random() * 320,
        y: 45 + Math.random() * 40,
        len: 18 + Math.random() * 16,
        cleaved: Math.random() > 0.4
      });
    }

    // Healthy intact ciliated bronchial epithelium on the right
    this.s14HealthyEpithelium = [];
    for (let i = 0; i < 14; i++) {
      this.s14HealthyEpithelium.push({
        x: 60 + i * 30,
        ciliaPhase: i * 0.45
      });
    }
  }

  updateStage14(dt) {
    this.stage14Timer += dt;

    // Update bovine proteases moving and attacking
    this.s14ProteaseMolecules.forEach(p => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.cleftAngle += dt * 3.0;
      if (p.x < -440) p.vx = Math.abs(p.vx);
      if (p.x > -60) p.vx = -Math.abs(p.vx);
      if (p.y < -30) p.vy = Math.abs(p.vy);
      if (p.y > 60) p.vy = -Math.abs(p.vy);
    });

    // Mucosa damage progression on past side
    this.s14MucosaSegments.forEach(m => {
      m.damageProgress = 0.5 + Math.sin(this.stage14Timer * 2 + m.x * 0.05) * 0.4;
    });

    // Update modern recombinant molecules floating smoothly in sterile environment
    this.s14RecombinantMolecules.forEach(rm => {
      rm.x += rm.vx * dt;
      rm.y += rm.vy * dt;
      rm.rot += rm.rotSpeed * dt;
      if (rm.x < 50) rm.vx = Math.abs(rm.vx);
      if (rm.x > 420) rm.vx = -Math.abs(rm.vx);
      if (rm.y < -55) rm.vy = Math.abs(rm.vy);
      if (rm.y > 75) rm.vy = -Math.abs(rm.vy);
    });
  }

  drawStage14PastVsPresent(ctx) {
    ctx.save();
    // Neutral deep slate background (clean scientific canvas)
    ctx.fillStyle = '#090D16';
    ctx.fillRect(-500, -260, 1000, 520);

    // Subtle technical grid
    ctx.fillStyle = '#1E293B';
    for (let gx = -460; gx <= 460; gx += 40) {
      for (let gy = -220; gy <= 220; gy += 40) {
        ctx.beginPath();
        ctx.arc(gx, gy, 1.0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Top Header Section
    ctx.fillStyle = '#0F172A';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(-275, -252, 550, 26, 13);
    ctx.fill();
    ctx.stroke();

    ctx.font = '700 9px "JetBrains Mono", monospace';
    ctx.fillStyle = '#F59E0B';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('● INDUSTRIAL BIOPROCESS EVOLUTION • HISTORICAL PARADIGM SHIFT', 0, -239);

    ctx.font = '800 21px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#F8FAFC';
    ctx.fillText('Industrial Synthesis: Past Slaughterhouse vs. Modern Biosynthesis', 0, -210);

    ctx.font = '500 11.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('From 1950s hazardous bovine pancreas acid extraction to modern cGMP recombinant mammalian cell cultivation', 0, -188);

    const vpW = 458;
    const vpH = 398;
    const vpY = -172;

    // ==========================================
    // LEFT PANEL: 1950s SLAUGHTERHOUSE EXTRACTION (ANIMAL HAZARD)
    // ==========================================
    const leftX = -470;
    ctx.save();

    // Deep slate chassis with neutral slate border (NO generic red box)
    ctx.fillStyle = '#0F172A';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.roundRect(leftX, vpY, vpW, vpH, 10);
    ctx.fill();
    ctx.stroke();

    // Header Pill
    ctx.fillStyle = '#1E293B';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(leftX + 14, vpY + 12, vpW - 28, 28, 6);
    ctx.fill();
    ctx.stroke();

    ctx.font = '800 10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#E2E8F0';
    ctx.textAlign = 'left';
    ctx.fillText('1950s BOVINE EXTRACTION (DORNAVAC)', leftX + 24, vpY + 26);
    ctx.font = '700 8.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#D97706';
    ctx.textAlign = 'right';
    ctx.fillText('[ABATTOIR TISSUE ISOLATION]', leftX + vpW - 24, vpY + 26);

    // 4 Sequential Extraction Stations Flowchart
    const stW = 96;
    const stH = 46;
    const stY = vpY + 48;
    const stGap = 12;

    const pastStages = [
      { num: '1', title: 'CATTLE PANCREAS', sub: 'Abattoir tissue harvest', tag: 'Bos taurus' },
      { num: '2', title: '0.25N H₂SO₄ ACID', sub: '(NH₄)₂SO₄ salting out', tag: 'Acid leach' },
      { num: '3', title: 'PROTEASE CO-PRECIP', sub: 'Active digestive enzymes', tag: 'Trypsin/Chymo' },
      { num: '4', title: 'AIRWAY CRISIS', sub: 'Mucosal ulceration & shock', tag: 'Epithelial lysis' }
    ];

    pastStages.forEach((st, idx) => {
      const sx = leftX + 16 + idx * (stW + stGap);
      ctx.fillStyle = '#111827';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(sx, stY, stW, stH, 5);
      ctx.fill();
      ctx.stroke();

      ctx.font = '800 7.5px "JetBrains Mono", monospace';
      ctx.fillStyle = '#CBD5E1';
      ctx.textAlign = 'left';
      ctx.fillText(`${st.num}. ${st.title}`, sx + 6, stY + 14);

      ctx.font = '400 6.8px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#94A3B8';
      ctx.fillText(st.sub, sx + 6, stY + 26);

      ctx.font = '600 6.5px "JetBrains Mono", monospace';
      ctx.fillStyle = '#D97706';
      ctx.fillText(st.tag, sx + 6, stY + 38);

      // Arrow to next station
      if (idx < 3) {
        ctx.fillStyle = '#64748B';
        ctx.font = '700 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('➔', sx + stW + stGap / 2, stY + 26);
      }
    });

    // Molecular Pathology Simulation Center
    const simY = vpY + 104;
    const simH = 155;
    ctx.fillStyle = '#0B0F19';
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(leftX + 14, simY, vpW - 28, simH, 6);
    ctx.fill();
    ctx.stroke();

    ctx.font = '700 8px "JetBrains Mono", monospace';
    ctx.fillStyle = '#94A3B8';
    ctx.textAlign = 'left';
    ctx.fillText('PATHOLOGY: BOVINE PROTEASE DEGRADATION OF AIRWAY MUCOSA', leftX + 22, simY + 15);

    // Bronchial Columnar Epithelium (Disrupted by bovine proteases)
    const epY = simY + 115;
    this.s14MucosaSegments.forEach(m => {
      const cellW = 28;
      const cellH = m.height * (1.0 - m.damageProgress * 0.45);
      const cx = leftX + 28 + (m.x + 430);

      // Epithelial cell body
      ctx.fillStyle = m.damageProgress > 0.6 ? '#1F1D2B' : '#1A2333';
      ctx.strokeStyle = m.damageProgress > 0.6 ? '#D97706' : '#475569';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(cx, epY - cellH, cellW, cellH, 3);
      ctx.fill();
      ctx.stroke();

      // Nucleus
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(cx + cellW / 2, epY - cellH * 0.4, 4, 0, Math.PI * 2);
      ctx.fill();

      // Bronchial Cilia on apical surface (slumped/broken if damaged)
      ctx.strokeStyle = m.damageProgress > 0.5 ? 'rgba(217, 119, 6, 0.4)' : '#64748B';
      ctx.lineWidth = 1.2;
      for (let ci = 3; ci < cellW; ci += 4) {
        const cLen = m.damageProgress > 0.5 ? 4 : 9;
        const wave = Math.sin(this.stage14Timer * 4 + m.ciliaOffset + ci) * 2;
        ctx.beginPath();
        ctx.moveTo(cx + ci, epY - cellH);
        ctx.lineTo(cx + ci + wave, epY - cellH - cLen);
        ctx.stroke();
      }
    });

    // Basement Membrane Line
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(leftX + 20, epY + 2);
    ctx.lineTo(leftX + vpW - 20, epY + 2);
    ctx.stroke();

    ctx.font = '500 7px "JetBrains Mono", monospace';
    ctx.fillStyle = '#64748B';
    ctx.textAlign = 'left';
    ctx.fillText('Basement Membrane Barrier', leftX + 24, epY + 12);

    // Contaminant Bovine Proteases (Trypsin & Chymotrypsin) Docking & Digesting Tight Junctions
    this.s14ProteaseMolecules.forEach(p => {
      ctx.save();
      const px = leftX + vpW / 2 + p.x + 230;
      const py = simY + 50 + p.y;
      ctx.translate(px, py);

      // Realistic globular serine protease structure
      ctx.fillStyle = '#1E293B';
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(0, 0, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Catalytic triad cleft (Asp102-His57-Ser195)
      ctx.fillStyle = '#D97706';
      ctx.beginPath();
      ctx.arc(4 * Math.cos(p.cleftAngle), 4 * Math.sin(p.cleftAngle), 3, 0, Math.PI * 2);
      ctx.fill();

      // Hydrolysis attack spark
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(8 * Math.cos(p.cleftAngle), 8 * Math.sin(p.cleftAngle));
      ctx.stroke();

      ctx.font = '700 7px "JetBrains Mono", monospace';
      ctx.fillStyle = '#E2E8F0';
      ctx.textAlign = 'center';
      ctx.fillText(p.label, 0, -16);
      ctx.font = '500 6.2px "JetBrains Mono", monospace';
      ctx.fillStyle = '#94A3B8';
      ctx.fillText(p.sub, 0, -8);

      ctx.restore();
    });

    // Foreign Bovine Epitope Antibody Cascades (Y-Shaped IgG/IgE Complexes)
    this.s14ImmuneComplexes.forEach(ic => {
      ctx.save();
      const ix = leftX + vpW / 2 + ic.x + 230;
      const iy = simY + 45 + ic.y;
      ctx.translate(ix, iy);
      ctx.rotate(ic.rot + Math.sin(this.stage14Timer + ic.pulsePhase) * 0.2);

      // Y-shaped antibody
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(0, 8); ctx.lineTo(0, 0); // stem (Fc)
      ctx.lineTo(-6, -7); // Fab arm 1
      ctx.moveTo(0, 0); ctx.lineTo(6, -7); // Fab arm 2
      ctx.stroke();

      // Antigenic bovine peptide epitope trapped in Fab
      ctx.fillStyle = '#D97706';
      ctx.beginPath();
      ctx.arc(-6, -7, 1.8, 0, Math.PI * 2);
      ctx.arc(6, -7, 1.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });

    ctx.font = '600 7.2px "JetBrains Mono", monospace';
    ctx.fillStyle = '#D97706';
    ctx.textAlign = 'right';
    ctx.fillText('▲ Anti-Bovine IgG/IgE Antibodies (Anaphylaxis Risk)', leftX + vpW - 24, simY + 28);

    // Historical Technical Summary Evaluation Card
    ctx.fillStyle = '#111827';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(leftX + 14, vpY + 268, vpW - 28, 92, 6);
    ctx.fill();
    ctx.stroke();

    const pastFacts = [
      {
        k: '1. Primary Source Material:',
        v: 'Slaughterhouse cattle pancreas glands (Bos taurus); massive pathogen/prion risk & batch variability.'
      },
      {
        k: '2. Severe Protease Impurities:',
        v: 'Co-purified active trypsin and chymotrypsin digest bronchial mucosal barrier, causing ulceration & bleeding.'
      },
      {
        k: '3. Intense Immunogenicity:',
        v: 'Foreign non-human epitopes trigger violent anti-bovine antibody cascades, acute bronchospasm & anaphylaxis.'
      }
    ];

    let pfY = vpY + 283;
    pastFacts.forEach(pf => {
      ctx.font = '700 8.5px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#E2E8F0';
      ctx.textAlign = 'left';
      ctx.fillText(pf.k, leftX + 22, pfY);

      ctx.font = '400 7.8px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#94A3B8';
      ctx.fillText(pf.v, leftX + 22, pfY + 11);
      pfY += 27;
    });

    // Bottom Historical Status Pill
    ctx.fillStyle = '#1E293B';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(leftX + 14, vpY + 368, vpW - 28, 20, 4);
    ctx.fill();
    ctx.stroke();

    ctx.font = '700 8px "JetBrains Mono", monospace';
    ctx.fillStyle = '#CBD5E1';
    ctx.textAlign = 'center';
    ctx.fillText('HISTORICAL VERDICT: DISCONTINUED IN 1960s DUE TO FATAL AIRWAY TOXICITY', leftX + vpW / 2, vpY + 381);

    ctx.restore();


    // ==========================================
    // RIGHT PANEL: MODERN RECOMBINANT BIOSYNTHESIS (PULMOZYME®)
    // ==========================================
    const rightX = 12;
    ctx.save();

    // Deep slate chassis with neutral slate border (NO generic green box)
    ctx.fillStyle = '#0F172A';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.roundRect(rightX, vpY, vpW, vpH, 10);
    ctx.fill();
    ctx.stroke();

    // Header Pill
    ctx.fillStyle = '#1E293B';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(rightX + 14, vpY + 12, vpW - 28, 28, 6);
    ctx.fill();
    ctx.stroke();

    ctx.font = '800 10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#38BDF8';
    ctx.textAlign = 'left';
    ctx.fillText('MODERN RECOMBINANT BIOSYNTHESIS (PULMOZYME®)', rightX + 24, vpY + 26);
    ctx.font = '700 8.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#94A3B8';
    ctx.textAlign = 'right';
    ctx.fillText('[CHO-K1 CELL BIO-FACTORY]', rightX + vpW - 24, vpY + 26);

    // 4 Sequential cGMP Bioprocess Stages Flowchart
    const modernStages = [
      { num: '1', title: 'HUMAN cDNA VECTOR', sub: '260-aa native sequence', tag: 'Synthetic gene' },
      { num: '2', title: 'CHO-K1 CELL BANK', sub: 'Validated cGMP master bank', tag: 'Animal-origin free' },
      { num: '3', title: '10,000L FERMENTER', sub: 'Automated fed-batch cold shift', tag: 'Extracellular' },
      { num: '4', title: 'STERILE BFS DOSING', sub: 'Triple chromatography + 20nm', tag: '2.5 mg/2.5 mL' }
    ];

    modernStages.forEach((st, idx) => {
      const sx = rightX + 16 + idx * (stW + stGap);
      ctx.fillStyle = '#111827';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(sx, stY, stW, stH, 5);
      ctx.fill();
      ctx.stroke();

      ctx.font = '800 7.5px "JetBrains Mono", monospace';
      ctx.fillStyle = '#38BDF8';
      ctx.textAlign = 'left';
      ctx.fillText(`${st.num}. ${st.title}`, sx + 6, stY + 14);

      ctx.font = '400 6.8px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#CBD5E1';
      ctx.fillText(st.sub, sx + 6, stY + 26);

      ctx.font = '600 6.5px "JetBrains Mono", monospace';
      ctx.fillStyle = '#2DD4BF';
      ctx.fillText(st.tag, sx + 6, stY + 38);

      // Arrow to next station
      if (idx < 3) {
        ctx.fillStyle = '#38BDF8';
        ctx.font = '700 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('➔', sx + stW + stGap / 2, stY + 26);
      }
    });

    // Molecular Biology & Intact Tissue Simulation Center
    ctx.fillStyle = '#0B0F19';
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(rightX + 14, simY, vpW - 28, simH, 6);
    ctx.fill();
    ctx.stroke();

    ctx.font = '700 8px "JetBrains Mono", monospace';
    ctx.fillStyle = '#38BDF8';
    ctx.textAlign = 'left';
    ctx.fillText('PHYSIOLOGY: STERILE MONOMERIC RHDNASE 1 SAFELY DIGESTS DNA MESH', rightX + 22, simY + 15);

    // Intact Bronchial Columnar Epithelium (Pristine, Healthy Tissue)
    this.s14HealthyEpithelium.forEach(h => {
      const cellW = 28;
      const cellH = 38;
      const hx = rightX + 28 + (h.x - 60);

      // Healthy columnar cell
      ctx.fillStyle = '#111E2E';
      ctx.strokeStyle = '#0284C7';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(hx, epY - cellH, cellW, cellH, 3);
      ctx.fill();
      ctx.stroke();

      // Intact tight junction line at apical boundary
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(hx, epY - cellH);
      ctx.lineTo(hx + cellW, epY - cellH);
      ctx.stroke();

      // Nucleus
      ctx.fillStyle = '#312E81';
      ctx.beginPath();
      ctx.arc(hx + cellW / 2, epY - cellH * 0.4, 4, 0, Math.PI * 2);
      ctx.fill();

      // Healthy upright beating cilia (metachronal wave)
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 1.3;
      for (let ci = 3; ci < cellW; ci += 4) {
        const wave = Math.sin(this.stage14Timer * 5 + h.ciliaPhase + ci) * 3;
        ctx.beginPath();
        ctx.moveTo(hx + ci, epY - cellH);
        ctx.lineTo(hx + ci + wave, epY - cellH - 10);
        ctx.stroke();
      }
    });

    // Healthy Basement Membrane
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(rightX + 20, epY + 2);
    ctx.lineTo(rightX + vpW - 20, epY + 2);
    ctx.stroke();

    ctx.font = '500 7px "JetBrains Mono", monospace';
    ctx.fillStyle = '#38BDF8';
    ctx.textAlign = 'left';
    ctx.fillText('Intact Tight Junctions (Zero Protease Cleavage)', rightX + 24, epY + 12);

    // Authentic 37 kDa Dornase Alfa Molecules Rotating in Extracellular Broth
    this.s14RecombinantMolecules.forEach(rm => {
      ctx.save();
      const rx = rightX + 20 + rm.x;
      const ry = simY + 45 + rm.y;
      ctx.translate(rx, ry);
      ctx.rotate(rm.rot);
      ctx.scale(rm.scale, rm.scale);

      // Globular 37 kDa enzyme core
      ctx.fillStyle = '#0F172A';
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Active Catalytic Pocket with Calcium (Ca²⁺) / Magnesium (Mg²⁺) Ions
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(3, -2, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Dual Complex N-Glycan Antennae (Asn18 & Asn106)
      ctx.strokeStyle = '#2DD4BF';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-8, 3); ctx.lineTo(-14, 8);
      ctx.moveTo(-11, 5); ctx.lineTo(-12, 12);
      ctx.stroke();

      ctx.fillStyle = '#2DD4BF';
      ctx.beginPath();
      ctx.arc(-14, 8, 1.5, 0, Math.PI * 2);
      ctx.arc(-12, 12, 1.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });

    // DNA Substrate Strands being hydrolyzed cleanly by rhDNase 1
    this.s14DnaSubstrates.forEach(dna => {
      ctx.strokeStyle = dna.cleaved ? '#10B981' : 'rgba(148, 163, 184, 0.4)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash(dna.cleaved ? [3, 2] : []);
      ctx.beginPath();
      ctx.moveTo(rightX + dna.x - dna.len / 2, simY + dna.y);
      ctx.lineTo(rightX + dna.x + dna.len / 2, simY + dna.y);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    ctx.font = '600 7.2px "JetBrains Mono", monospace';
    ctx.fillStyle = '#2DD4BF';
    ctx.textAlign = 'right';
    ctx.fillText('Pure Dornase Alfa (Hydrolyzes DNA Mesh with Zero Mucosal Damage)', rightX + vpW - 24, simY + 28);

    // Modern Technical Summary Evaluation Card
    ctx.fillStyle = '#111827';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(rightX + 14, vpY + 268, vpW - 28, 92, 6);
    ctx.fill();
    ctx.stroke();

    const modernFacts = [
      {
        k: '1. 100% Native Human Sequence:',
        v: 'Cloned human DNase 1 cDNA expressed in CHO-K1 cells; zero non-human epitopes & zero immunogenicity.'
      },
      {
        k: '2. Undetectable Protease Contamination (<0.001 ppm):',
        v: 'Triple-column chromatography eliminates all host enzymes; preserves intact bronchial tight junctions.'
      },
      {
        k: '3. Proven Clinical Efficacy & Safety:',
        v: 'Reduces sputum viscosity 800-fold, elevates FEV₁ by 15.8%, and cuts exacerbations by 37% with >30 years safe use.'
      }
    ];

    let mfY = vpY + 283;
    modernFacts.forEach(mf => {
      ctx.font = '700 8.5px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#E2E8F0';
      ctx.textAlign = 'left';
      ctx.fillText(mf.k, rightX + 22, mfY);

      ctx.font = '400 7.8px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#94A3B8';
      ctx.fillText(mf.v, rightX + 22, mfY + 11);
      mfY += 27;
    });

    // Bottom Modern Status Pill
    ctx.fillStyle = '#1E293B';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(rightX + 14, vpY + 368, vpW - 28, 20, 4);
    ctx.fill();
    ctx.stroke();

    ctx.font = '700 8px "JetBrains Mono", monospace';
    ctx.fillStyle = '#38BDF8';
    ctx.textAlign = 'center';
    ctx.fillText('CURRENT GOLD STANDARD: PULMOZYME® (FDA/EMA APPROVED LIFE-SAVING BIOTHERAPEUTIC)', rightX + vpW / 2, vpY + 381);

    ctx.restore();

    ctx.restore();
  }

  /* ========================================================
     STAGE 15: The Host Organism: Why CHO Cells (and Why Bacteria Fail)
     Fully animated cellular biology showdown:
     Left: Giant E. coli bacterium cutaway showing reducing cytosol, unglycosylated linear chains
           clumping into a pulsating dense dark-red INCLUSION BODY, and toxic spiky LPS shed.
     Right: Giant CHO mammalian cell cutaway showing Nucleus plasmid, Rough ER forming disulfide
           bridges with yellow flash sparks, Golgi stacking branched N-glycans onto Asn18/Asn106,
           and secretory vesicles exocytosing active, shimmering rhDNase 1!
     ======================================================== */
  initStage15HostOrganismCho() {
    this.stage15Timer = 0;

    // E. coli Ribosomes (dense 70S macromolecular crowding in bacterial cytosol)
    this.s15EcoliRibosomes = [];
    for (let i = 0; i < 95; i++) {
      this.s15EcoliRibosomes.push({
        x: -242 + (Math.random() - 0.5) * 230,
        y: -10 + (Math.random() - 0.5) * 95,
        r: 1.1 + Math.random() * 0.9
      });
    }

    // E. coli Flagella (4 peritrichous sinusoidal helical filaments with basal motors)
    this.s15Flagella = [
      { startX: -375, startY: -35, baseAngle: Math.PI * 0.92, len: 120, freq: 3.5, amp: 12 },
      { startX: -380, startY: 25, baseAngle: Math.PI * 1.05, len: 130, freq: 3.2, amp: 14 },
      { startX: -260, startY: 65, baseAngle: Math.PI * 0.55, len: 110, freq: 3.8, amp: 11 },
      { startX: -125, startY: 20, baseAngle: -Math.PI * 0.12, len: 115, freq: 3.4, amp: 13 }
    ];

    // Shedding LPS Outer Membrane Vesicles (OMVs) & endotoxins
    this.s15Omvs = [];
    for (let i = 0; i < 9; i++) {
      this.s15Omvs.push({
        angle: Math.random() * Math.PI * 2,
        dist: 72 + Math.random() * 40,
        speed: 10 + Math.random() * 14,
        r: 2.5 + Math.random() * 2.5
      });
    }

    // CHO Cell COPII Transport Vesicles (Rough ER -> cis-Golgi)
    this.s15ChoCopVesicles = [];
    for (let i = 0; i < 5; i++) {
      this.s15ChoCopVesicles.push({
        prog: i / 5,
        speed: 0.22 + Math.random() * 0.08
      });
    }

    // CHO Cell Secretory Vesicles (trans-Golgi -> Plasma Membrane Exocytosis)
    this.s15ChoSecVesicles = [];
    for (let i = 0; i < 6; i++) {
      this.s15ChoSecVesicles.push({
        prog: i / 6,
        speed: 0.16 + Math.random() * 0.05
      });
    }

    // Active extracellular rhDNase 1 molecules secreted into medium
    this.s15SecretedMolecules = [];
    for (let i = 0; i < 18; i++) {
      this.s15SecretedMolecules.push({
        x: 385 + Math.random() * 70,
        y: -65 + Math.random() * 130,
        vx: 14 + Math.random() * 16,
        vy: (Math.random() - 0.5) * 16,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  updateStage15(dt) {
    this.stage15Timer += dt;

    // COPII vesicles ER -> Golgi
    this.s15ChoCopVesicles.forEach(v => {
      v.prog += v.speed * dt;
      if (v.prog > 1.0) v.prog -= 1.0;
    });

    // Secretory vesicles Golgi -> Membrane
    this.s15ChoSecVesicles.forEach(v => {
      v.prog += v.speed * dt;
      if (v.prog > 1.0) v.prog -= 1.0;
    });

    // OMVs shedding from E. coli
    this.s15Omvs.forEach(o => {
      o.dist += o.speed * dt;
      if (o.dist > 130) o.dist = 72;
    });

    // Secreted rhDNase 1 molecules drifting in media
    this.s15SecretedMolecules.forEach(m => {
      m.x += m.vx * dt;
      m.y += m.vy * dt;
      if (m.x > 465) {
        m.x = 385;
        m.y = -60 + Math.random() * 120;
      }
    });
  }

  drawStage15HostOrganismCho(ctx) {
    ctx.save();
    // Neutral deep slate background (clean scientific canvas)
    ctx.fillStyle = '#090D16';
    ctx.fillRect(-500, -260, 1000, 520);

    // Subtle technical grid
    ctx.fillStyle = '#1E293B';
    for (let gx = -460; gx <= 460; gx += 40) {
      for (let gy = -220; gy <= 220; gy += 40) {
        ctx.beginPath();
        ctx.arc(gx, gy, 1.0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Top Header Badge
    ctx.fillStyle = '#0F172A';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(-275, -252, 550, 26, 13);
    ctx.fill();
    ctx.stroke();

    ctx.font = '700 9px "JetBrains Mono", monospace';
    ctx.fillStyle = '#818CF8';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('● CELLULAR BIOLOGY & HOST SELECTION • PROKARYOTIC vs. MAMMALIAN EXPRESSION', 0, -239);

    ctx.font = '800 21px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#F8FAFC';
    ctx.fillText('The Host Organism: Why CHO Cells (and Why Bacteria Fail)', 0, -210);

    ctx.font = '500 11.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('Comparative cytology: Escherichia coli (Gram-negative prokaryote) vs. Chinese Hamster Ovary CHO-K1 (mammalian cell)', 0, -188);

    const vpW = 458;
    const vpH = 398;
    const vpY = -172;

    // ==========================================
    // LEFT PANEL: ESCHERICHIA COLI (BACTERIAL PROKARYOTE)
    // ==========================================
    const leftX = -470;
    ctx.save();
    
    // Panel card in deep slate with sleek slate border (no generic red box)
    ctx.fillStyle = '#0F172A';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.roundRect(leftX, vpY, vpW, vpH, 10);
    ctx.fill();
    ctx.stroke();

    // Top Header Pill
    ctx.fillStyle = '#1E293B';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(leftX + 14, vpY + 12, vpW - 28, 28, 6);
    ctx.fill();
    ctx.stroke();

    ctx.font = '800 10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#CBD5E1';
    ctx.textAlign = 'left';
    ctx.fillText('ESCHERICHIA COLI • BACTERIAL SYSTEM', leftX + 24, vpY + 26);
    ctx.font = '700 8.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#94A3B8';
    ctx.textAlign = 'right';
    ctx.fillText('[GRAM-NEGATIVE PROKARYOTE]', leftX + vpW - 24, vpY + 26);

    // E. coli Bacterium Anatomy Center
    const bX = leftX + vpW / 2;
    const bY = vpY + 148;
    const bW = 280;
    const bH = 126;
    const bR = 48; // Hemispherical rod poles

    // 1. Peritrichous Flagella (Helical waves with basal motors)
    this.s15Flagella.forEach(f => {
      ctx.save();
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.75)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (let s = 0; s <= f.len; s += 4) {
        const wave = Math.sin(s * 0.075 - this.stage15Timer * f.freq) * f.amp * (s / f.len);
        const px = f.startX + Math.cos(f.baseAngle) * s - Math.sin(f.baseAngle) * wave;
        const py = f.startY + Math.sin(f.baseAngle) * s + Math.cos(f.baseAngle) * wave;
        if (s === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();

      // Basal body motor ring in cell envelope
      ctx.fillStyle = '#64748B';
      ctx.beginPath();
      ctx.arc(f.startX, f.startY, 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // 2. Shedding LPS Outer Membrane Vesicles (OMVs)
    this.s15Omvs.forEach(omv => {
      const ox = bX + Math.cos(omv.angle) * (bW / 2 + omv.dist - 50);
      const oy = bY + Math.sin(omv.angle) * (bH / 2 + omv.dist - 50);
      ctx.fillStyle = 'rgba(217, 119, 6, 0.35)';
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(ox, oy, omv.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    // 3. Multi-Layered Gram-Negative Envelope
    // A) Outer Membrane (Bilayer with LPS O-antigen surface bristles)
    ctx.fillStyle = '#111827';
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.roundRect(bX - bW / 2, bY - bH / 2, bW, bH, bR);
    ctx.fill();
    ctx.stroke();

    // LPS Surface Bristles (O-Antigen chains radiating from outer leaflet)
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 1.1;
    for (let th = 0; th < Math.PI * 2; th += 0.16) {
      const cosT = Math.cos(th);
      const sinT = Math.sin(th);
      const sx = bX + cosT * (bW / 2 - 8);
      const sy = bY + sinT * (bH / 2 - 8);
      const bristLen = 5 + Math.sin(th * 6 + this.stage15Timer * 2) * 1.5;
      const ex = sx + cosT * bristLen;
      const ey = sy + sinT * bristLen;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
      ctx.stroke();
    }

    // B) Periplasmic Space with Peptidoglycan mesh
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.roundRect(bX - bW / 2 + 5, bY - bH / 2 + 5, bW - 10, bH - 10, bR - 4);
    ctx.stroke();
    ctx.setLineDash([]);

    // C) Inner Cytoplasmic Membrane
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.roundRect(bX - bW / 2 + 9, bY - bH / 2 + 9, bW - 18, bH - 18, bR - 8);
    ctx.stroke();

    // 4. Cytosol Interior
    // 70S Ribosomes (macromolecular crowding)
    ctx.fillStyle = 'rgba(100, 116, 139, 0.55)';
    this.s15EcoliRibosomes.forEach(rib => {
      ctx.beginPath();
      ctx.arc(rib.x, rib.y, rib.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // 5. Fibrous Bacterial Nucleoid (Non-membrane bound genomic DNA loops)
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const nucPts = [
      { x: bX - 50, y: bY - 20 }, { x: bX - 20, y: bY - 35 },
      { x: bX + 25, y: bY - 25 }, { x: bX + 60, y: bY - 10 },
      { x: bX + 45, y: bY + 20 }, { x: bX + 5, y: bY + 30 },
      { x: bX - 35, y: bY + 25 }, { x: bX - 60, y: bY + 5 }
    ];
    ctx.moveTo(nucPts[0].x, nucPts[0].y);
    for (let p = 1; p < nucPts.length; p++) {
      ctx.quadraticCurveTo(
        nucPts[p - 1].x + Math.sin(this.stage15Timer * 2 + p) * 4,
        nucPts[p - 1].y + Math.cos(this.stage15Timer * 2 + p) * 4,
        nucPts[p].x,
        nucPts[p].y
      );
    }
    ctx.closePath();
    ctx.stroke();

    ctx.font = '600 7.5px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(245, 158, 11, 0.8)';
    ctx.textAlign = 'center';
    ctx.fillText('Nucleoid (No Nuclear Envelope)', bX + 15, bY - 12);

    // 6. Insoluble Inclusion Body (Misfolded rhDNase 1 aggregate)
    const incX = bX - 70;
    const incY = bY + 5;
    // Dense electron-opaque shading
    ctx.fillStyle = '#1E293B';
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    for (let i = 0; i < 12; i++) {
      const ang = (i / 12) * Math.PI * 2;
      const rad = 28 + (i % 2 === 0 ? 6 : -4) + Math.sin(ang * 3 + this.stage15Timer) * 1.5;
      const ix = incX + Math.cos(ang) * rad;
      const iy = incY + Math.sin(ang) * rad;
      if (i === 0) ctx.moveTo(ix, iy);
      else ctx.lineTo(ix, iy);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Cross-hatched tangled amyloid-like fibrils
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
    ctx.lineWidth = 1;
    for (let l = -20; l <= 20; l += 8) {
      ctx.beginPath();
      ctx.moveTo(incX - 22, incY + l);
      ctx.lineTo(incX + 22, incY + l - 6);
      ctx.moveTo(incX + l, incY - 22);
      ctx.lineTo(incX + l - 6, incY + 22);
      ctx.stroke();
    }

    ctx.font = '700 8px "JetBrains Mono", monospace';
    ctx.fillStyle = '#F1F5F9';
    ctx.textAlign = 'center';
    ctx.fillText('INCLUSION BODY', incX, incY - 5);
    ctx.font = '500 7px "JetBrains Mono", monospace';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('Misfolded Aggregates', incX, incY + 6);
    ctx.fillText('(0% Enzymatic Titer)', incX, incY + 15);

    // 7. Linear Unfolded Polypeptide Chains with Reduced Thiols (-SH)
    const pepX = bX + 65;
    const pepY = bY + 5;
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(pepX - 35, pepY - 15);
    ctx.bezierCurveTo(pepX - 15, pepY - 30, pepX + 15, pepY, pepX + 35, pepY - 15);
    ctx.stroke();

    // Reduced Free -SH Cysteines tags
    [-18, 18].forEach(ox => {
      ctx.fillStyle = '#334155';
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(pepX + ox - 14, pepY - 4, 28, 14, 3);
      ctx.fill();
      ctx.stroke();

      ctx.font = '700 7px "JetBrains Mono", monospace';
      ctx.fillStyle = '#F8FAFC';
      ctx.textAlign = 'center';
      ctx.fillText('-SH Cys', pepX + ox, pepY + 6);
    });

    ctx.font = '700 7.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#CBD5E1';
    ctx.textAlign = 'center';
    ctx.fillText('Nascent Polypeptide (Reduced -SH)', pepX, pepY - 22);
    ctx.font = '500 7px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('No ER: Cannot form S-S bonds', pepX, pepY + 22);

    // Callout badge for LPS on top of cell
    ctx.font = '600 8px "JetBrains Mono", monospace';
    ctx.fillStyle = '#D97706';
    ctx.textAlign = 'center';
    ctx.fillText('▲ Outer Membrane LPS (Endotoxin Inhalation Hazard)', bX, bY - bH / 2 - 12);

    // Technical Bullet Points Card at bottom
    ctx.fillStyle = '#111827';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(leftX + 14, vpY + 268, vpW - 28, 92, 6);
    ctx.fill();
    ctx.stroke();

    const eColiPoints = [
      {
        title: '1. No Endomembrane Glycosylation Machinery:',
        desc: 'Bacteria completely lack endoplasmic reticulum & Golgi. rhDNase 1 requires dual N-glycans (Asn18, Asn106) to resist airway protease cleavage.'
      },
      {
        title: '2. Highly Reducing Cytosolic Redox State:',
        desc: 'Thioredoxin/glutaredoxin pathways prevent disulfide formation; Cys101-Cys104 & Cys173-Cys209 collapse into insoluble, inactive inclusion bodies.'
      },
      {
        title: '3. Pyrogenic Endotoxin (LPS) Contamination:',
        desc: 'Gram-negative outer membrane sheds toxic lipid A lipopolysaccharide; trace aerosol inhalation triggers lethal pulmonary inflammatory storm.'
      }
    ];

    let ptY = vpY + 283;
    eColiPoints.forEach(pt => {
      ctx.font = '700 8.5px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#E2E8F0';
      ctx.textAlign = 'left';
      ctx.fillText(pt.title, leftX + 22, ptY);

      ctx.font = '400 7.8px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#94A3B8';
      ctx.fillText(pt.desc, leftX + 22, ptY + 11);
      ptY += 27;
    });

    // Bottom Conclusion Pill
    ctx.fillStyle = '#1E293B';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(leftX + 14, vpY + 368, vpW - 28, 20, 4);
    ctx.fill();
    ctx.stroke();

    ctx.font = '700 8px "JetBrains Mono", monospace';
    ctx.fillStyle = '#CBD5E1';
    ctx.textAlign = 'center';
    ctx.fillText('CONCLUSION: PROKARYOTIC SYSTEMS CANNOT YIELD FUNCTIONAL ACTIVE RH-DNASE 1', leftX + vpW / 2, vpY + 381);

    ctx.restore();


    // ==========================================
    // RIGHT PANEL: CHINESE HAMSTER OVARY (CHO-K1 CELL)
    // ==========================================
    const rightX = 12;
    ctx.save();

    // Panel card in deep slate with subtle cyan/slate accent border
    ctx.fillStyle = '#0F172A';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.roundRect(rightX, vpY, vpW, vpH, 10);
    ctx.fill();
    ctx.stroke();

    // Top Header Pill
    ctx.fillStyle = '#1E293B';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(rightX + 14, vpY + 12, vpW - 28, 28, 6);
    ctx.fill();
    ctx.stroke();

    ctx.font = '800 10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#38BDF8';
    ctx.textAlign = 'left';
    ctx.fillText('CHO-K1 MAMMALIAN CELL • EUKARYOTIC FACTORY', rightX + 24, vpY + 26);
    ctx.font = '700 8.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#94A3B8';
    ctx.textAlign = 'right';
    ctx.fillText('[COMMERCIAL GOLD STANDARD]', rightX + vpW - 24, vpY + 26);

    // CHO Cell Anatomy Center
    const cX = rightX + vpW / 2;
    const cY = vpY + 148;
    const cW = 320;
    const cH = 150;

    // 1. Fluid Undulating Plasma Membrane with Microvilli
    ctx.fillStyle = '#131D33';
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    const memSteps = 64;
    for (let i = 0; i <= memSteps; i++) {
      const th = (i / memSteps) * Math.PI * 2;
      const rx = (cW / 2) + Math.sin(th * 9 + this.stage15Timer * 1.8) * 3.5;
      const ry = (cH / 2) + Math.cos(th * 7 + this.stage15Timer * 1.5) * 3.0;
      const px = cX + Math.cos(th) * rx;
      const py = cY + Math.sin(th) * ry;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 2. Double-Membrane Eukaryotic Nucleus with Nuclear Pore Complexes (NPCs)
    const nX = cX - 95;
    const nY = cY;
    const nR = 38;

    // Outer & Inner Nuclear Envelope
    ctx.fillStyle = '#1E1B4B';
    ctx.strokeStyle = '#6366F1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(nX, nY, nR, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Nuclear Pores (NPCs)
    ctx.fillStyle = '#818CF8';
    for (let th = 0; th < Math.PI * 2; th += Math.PI / 4) {
      const nx = nX + Math.cos(th) * nR;
      const ny = nY + Math.sin(th) * nR;
      ctx.beginPath();
      ctx.arc(nx, ny, 2.0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Nucleolus and Chromatin
    ctx.fillStyle = '#312E81';
    ctx.beginPath();
    ctx.arc(nX - 8, nY - 6, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = '700 7.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#C7D2FE';
    ctx.textAlign = 'center';
    ctx.fillText('NUCLEUS', nX, nY - 8);
    ctx.font = '500 6.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('DNase cDNA', nX, nY + 4);
    ctx.fillText('Transcription', nX, nY + 13);

    // Exporting mRNA Beaded Strand
    ctx.strokeStyle = '#FDE047';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(nX + nR, nY);
    ctx.quadraticCurveTo(nX + nR + 12, nY - 8, nX + nR + 24, nY);
    ctx.stroke();

    // 3. Rough Endoplasmic Reticulum (RER) Stacks with Ribosomes & PDI Chaperones
    const erX = cX - 25;
    const erY = cY - 25;
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2.4;
    for (let s = 0; s < 3; s++) {
      ctx.beginPath();
      ctx.arc(erX, erY + s * 16, 22, -Math.PI * 0.45, Math.PI * 0.45);
      ctx.stroke();

      // Bound 80S Ribosomes on RER membrane
      ctx.fillStyle = '#F59E0B';
      for (let r = 0; r < 4; r++) {
        ctx.beginPath();
        ctx.arc(erX + 16, erY + s * 16 - 12 + r * 8, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // PDI Chaperone Disulfide Bridge Catalyst (Golden oxidative spark)
    const pdiX = erX + 26;
    const pdiY = erY + 16;
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(pdiX, pdiY, 3.2 + Math.sin(this.stage15Timer * 6) * 1.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = '700 7.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#38BDF8';
    ctx.textAlign = 'left';
    ctx.fillText('ROUGH ER (PDI)', erX - 10, erY - 26);
    ctx.font = '500 6.8px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#BAE6FD';
    ctx.fillText('Catalyzes Cys101-104 & Cys173-209 S-S', erX - 10, erY - 16);

    // 4. COPII Transport Vesicles (ER -> Golgi)
    this.s15ChoCopVesicles.forEach(cv => {
      const vx = erX + 32 + cv.prog * 36;
      const vy = erY + 16 + Math.sin(cv.prog * Math.PI) * 8;
      ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(vx, vy, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    // 5. Polarized Golgi Apparatus Cisternae (N-Glycan Branching)
    const golX = cX + 50;
    const golY = cY + 10;
    ctx.strokeStyle = '#14B8A6';
    ctx.lineWidth = 3;
    for (let g = 0; g < 4; g++) {
      ctx.beginPath();
      ctx.arc(golX + g * 9, golY, 26, Math.PI * 0.6, Math.PI * 1.4);
      ctx.stroke();
    }

    // Branched N-Glycan Antennae Illustration on Golgi
    ctx.strokeStyle = '#2DD4BF';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(golX + 18, golY - 14);
    ctx.lineTo(golX + 28, golY - 20);
    ctx.lineTo(golX + 36, golY - 25);
    ctx.moveTo(golX + 28, golY - 20);
    ctx.lineTo(golX + 36, golY - 16);
    ctx.stroke();

    ctx.font = '700 7.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#2DD4BF';
    ctx.textAlign = 'left';
    ctx.fillText('GOLGI APPARATUS', golX + 10, golY - 32);
    ctx.font = '500 6.8px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#99F6E4';
    ctx.fillText('Adds N-Glycans (Asn18 & Asn106)', golX + 10, golY - 22);

    // 6. Secretory Vesicles & Omega-Pore Exocytosis at Plasma Membrane
    this.s15ChoSecVesicles.forEach(sv => {
      const sx = golX + 36 + sv.prog * 55;
      const sy = golY - 5 + Math.sin(sv.prog * Math.PI) * 16;
      ctx.fillStyle = 'rgba(14, 165, 233, 0.4)';
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(sx, sy, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Internal folded rhDNase cargo dot
      ctx.fillStyle = '#F8FAFC';
      ctx.beginPath();
      ctx.arc(sx, sy, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Omega Exocytic Pore on Right Membrane
    const exoX = cX + cW / 2 - 2;
    const exoY = cY + 12;
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(exoX, exoY, 8, -Math.PI * 0.5, Math.PI * 0.5);
    ctx.stroke();

    // 7. Active Extracellular rhDNase 1 in Broth
    this.s15SecretedMolecules.forEach(sm => {
      ctx.save();
      ctx.translate(sm.x, sm.y);
      ctx.fillStyle = '#38BDF8';
      ctx.shadowColor = '#38BDF8';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(0, 0, 3.2, 0, Math.PI * 2);
      ctx.fill();

      // Glycan branch marker
      ctx.strokeStyle = '#2DD4BF';
      ctx.lineWidth = 1;
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.moveTo(2, -2); ctx.lineTo(6, -6);
      ctx.moveTo(4, -4); ctx.lineTo(7, -3);
      ctx.stroke();
      ctx.restore();
    });

    ctx.font = '700 8px "JetBrains Mono", monospace';
    ctx.fillStyle = '#38BDF8';
    ctx.textAlign = 'right';
    ctx.fillText('Secreted Active rhDNase 1 ⟶', rightX + vpW - 14, vpY + 70);
    ctx.font = '500 7px "JetBrains Mono", monospace';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('(37 kDa Glycoprotein in Media)', rightX + vpW - 14, vpY + 82);

    // Technical Bullet Points Card at bottom
    ctx.fillStyle = '#111827';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(rightX + 14, vpY + 268, vpW - 28, 92, 6);
    ctx.fill();
    ctx.stroke();

    const choPoints = [
      {
        title: '1. Complex Human-Compatible N-Glycosylation:',
        desc: 'Golgi attaches complex bi-antennary oligosaccharides to Asn18 and Asn106, shielding the enzyme from degradation by neutrophil elastase.'
      },
      {
        title: '2. Oxidative ER Chaperone Machinery (PDI & BiP):',
        desc: 'Endoplasmic reticulum environment catalyzes native disulfide pairs (Cys101-Cys104 & Cys173-Cys209), achieving 100% active stereospecific fold.'
      },
      {
        title: '3. High-Titer Extracellular Secretion (>1.8 g/L):',
        desc: 'Native signal peptide directs continuous vesicle exocytosis into culture medium, avoiding cell lysis and eliminating toxic endotoxins.'
      }
    ];

    let cPtY = vpY + 283;
    choPoints.forEach(pt => {
      ctx.font = '700 8.5px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#E2E8F0';
      ctx.textAlign = 'left';
      ctx.fillText(pt.title, rightX + 22, cPtY);

      ctx.font = '400 7.8px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#94A3B8';
      ctx.fillText(pt.desc, rightX + 22, cPtY + 11);
      cPtY += 27;
    });

    // Bottom Conclusion Pill
    ctx.fillStyle = '#1E293B';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(rightX + 14, vpY + 368, vpW - 28, 20, 4);
    ctx.fill();
    ctx.stroke();

    ctx.font = '700 8px "JetBrains Mono", monospace';
    ctx.fillStyle = '#38BDF8';
    ctx.textAlign = 'center';
    ctx.fillText('OUTCOME: CHO-K1 IS THE EXCLUSIVE REGULATORY-APPROVED FACTORY FOR PULMOZYME®', rightX + vpW / 2, vpY + 381);

    ctx.restore();

    ctx.restore();
  }

  /* ========================================================
     STAGE 16: Upstream Bioprocess: Fed-Batch Bioreactor Engineering
     Full-scale 10,000-liter Industrial Bioreactor Simulation:
     - Prominent cutaway of giant double-jacketed stainless steel vessel
     - 3D rotating dual-tier pitched-blade marine impellers (low shear, 60 RPM)
     - Sintered micro-sparger emitting streams of thousands of swirling micro-bubbles
     - 40+ mammalian CHO cells freely tumbling in suspension and hyper-secreting rhDNase 1
     - Real-time automated feeds: Glucose/Gln, base pump for pH 7.00, Ca²⁺ stabilization
     - Interactive Biphasic Temperature Shift HUD: 37°C growth ⟶ 32.5°C production cold-shift!
     ======================================================== */
  initStage16BioreactorProcess() {
    this.stage16Timer = 0;

    // Submerged sintered micro-sparger rising micro-bubble plume (DO 45%)
    this.s16Bubbles = [];
    for (let i = 0; i < 75; i++) {
      this.s16Bubbles.push({
        x: -180 + (Math.random() - 0.5) * 120,
        y: 80 + Math.random() * 50,
        vy: 38 + Math.random() * 45,
        r: 1.2 + Math.random() * 1.8,
        wobble: Math.random() * Math.PI * 2,
        phase: Math.random() * Math.PI * 2
      });
    }

    // Suspended mammalian CHO-K1 cells tumbling in low-shear streamlines
    this.s16ChoCells = [];
    for (let i = 0; i < 34; i++) {
      this.s16ChoCells.push({
        x: -180 + (Math.random() - 0.5) * 170,
        y: -45 + (Math.random() - 0.5) * 175,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.5) * 14,
        r: 4.8 + Math.random() * 2.2,
        angle: Math.random() * Math.PI * 2,
        rotSpeed: 0.5 + (Math.random() - 0.5) * 1.2,
        secreteTimer: Math.random() * 2
      });
    }

    // Secreted rhDNase 1 micro-droplets in culture broth
    this.s16ProductDroplets = [];
    for (let i = 0; i < 35; i++) {
      this.s16ProductDroplets.push({
        x: -180 + (Math.random() - 0.5) * 180,
        y: -40 + (Math.random() - 0.5) * 180,
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.5) * 18,
        phase: Math.random() * Math.PI * 2
      });
    }

    // Coolant flow circulation particles in thermal jacket
    this.s16JacketFlow = [];
    for (let i = 0; i < 14; i++) {
      this.s16JacketFlow.push({
        side: i % 2 === 0 ? -1 : 1, // left or right jacket
        y: -100 + (i / 14) * 230,
        speed: 32 + Math.random() * 18
      });
    }

    // Nutrient feed drops entering from top sterile manifold
    this.s16FeedDrops = [];
    for (let i = 0; i < 6; i++) {
      this.s16FeedDrops.push({
        x: -225 + (i % 2) * 90,
        y: -135 + Math.random() * 45,
        speed: 65 + Math.random() * 25
      });
    }
  }

  updateStage16(dt) {
    this.stage16Timer += dt;

    // Bubbles rising from sintered sparger ring
    this.s16Bubbles.forEach(b => {
      b.y -= b.vy * dt;
      b.x += Math.sin(this.stage16Timer * 4 + b.wobble) * 0.45;
      if (b.y < -95) {
        b.y = 118;
        b.x = -180 + (Math.random() - 0.5) * 110;
      }
    });

    // CHO cells tumbling in low-shear toroidal streamlines
    this.s16ChoCells.forEach(c => {
      c.x += c.vx * dt;
      c.y += c.vy * dt;
      c.angle += c.rotSpeed * dt;
      c.secreteTimer += dt;

      // Gentle boundary restitution inside reactor broth
      if (c.x < -275) c.vx = Math.abs(c.vx);
      if (c.x > -85) c.vx = -Math.abs(c.vx);
      if (c.y < -92) c.vy = Math.abs(c.vy);
      if (c.y > 115) c.vy = -Math.abs(c.vy);
    });

    // Secreted rhDNase 1 droplets drifting
    this.s16ProductDroplets.forEach(p => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.x < -280) p.vx = Math.abs(p.vx);
      if (p.x > -80) p.vx = -Math.abs(p.vx);
      if (p.y < -95) p.vy = Math.abs(p.vy);
      if (p.y > 120) p.vy = -Math.abs(p.vy);
    });

    // Jacket coolant flow
    this.s16JacketFlow.forEach(j => {
      j.y += j.speed * dt;
      if (j.y > 130) j.y = -105;
    });

    // Top sterile feed drops dripping
    this.s16FeedDrops.forEach(d => {
      d.y += d.speed * dt;
      if (d.y > -80) d.y = -135;
    });
  }

  drawStage16BioreactorProcess(ctx) {
    ctx.save();
    // Neutral deep slate background
    ctx.fillStyle = '#090D16';
    ctx.fillRect(-500, -260, 1000, 520);

    // Subtle technical grid
    ctx.fillStyle = '#1E293B';
    for (let gx = -460; gx <= 460; gx += 40) {
      for (let gy = -220; gy <= 220; gy += 40) {
        ctx.beginPath();
        ctx.arc(gx, gy, 1.0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Top Header Badge
    ctx.fillStyle = '#0F172A';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(-275, -252, 550, 26, 13);
    ctx.fill();
    ctx.stroke();

    ctx.font = '700 9px "JetBrains Mono", monospace';
    ctx.fillStyle = '#38BDF8';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('● UPSTREAM BIOPROCESSING & CHEMICAL ENGINEERING • 10,000L STIRRED TANK BIOREACTOR', 0, -239);

    ctx.font = '800 21px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#F8FAFC';
    ctx.fillText('Fed-Batch Bioreactor Engineering & Closed-Loop Control', 0, -210);

    ctx.font = '500 11.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('Low-shear hydrodynamics, micro-bubble oxygen transfer, and automated biphasic temperature shift in industrial synthesis', 0, -188);

    // ==========================================
    // LEFT PANEL: 10,000L STAINLESS STEEL BIOREACTOR CUTAWAY
    // ==========================================
    const rX = -472;
    const rY = -172;
    const rW = 492;
    const rH = 398;

    ctx.save();
    // Panel Chassis
    ctx.fillStyle = '#0F172A';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.roundRect(rX, rY, rW, rH, 10);
    ctx.fill();
    ctx.stroke();

    // Panel Header Pill
    ctx.fillStyle = '#1E293B';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(rX + 14, rY + 12, rW - 28, 28, 6);
    ctx.fill();
    ctx.stroke();

    ctx.font = '800 10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#E2E8F0';
    ctx.textAlign = 'left';
    ctx.fillText('316L ELECTROPOLISHED STAINLESS VESSEL • 10,000 LITERS', rX + 24, rY + 26);
    ctx.font = '700 8.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#38BDF8';
    ctx.textAlign = 'right';
    ctx.fillText('[SHEAR-SENSITIVE MAMMALIAN VESSEL]', rX + rW - 24, rY + 26);

    // Vessel Dimensions & Coordinates
    const vCenter = rX + rW / 2 + 10;
    const vMiddle = rY + 205;
    const vWidth = 230;
    const vHeight = 250;

    // 1. External Thermal Dimple Jacket (Steel Jacket with Circulating Coolant)
    ctx.fillStyle = '#1E293B';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.roundRect(vCenter - vWidth / 2 - 14, vMiddle - vHeight / 2 - 10, vWidth + 28, vHeight + 20, 28);
    ctx.fill();
    ctx.stroke();

    // Circulating Coolant in Jacket (Blue Chevron Glycol Streamlines)
    this.s16JacketFlow.forEach(jf => {
      const jx = jf.side === -1 ? vCenter - vWidth / 2 - 7 : vCenter + vWidth / 2 + 7;
      ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
      ctx.beginPath();
      ctx.arc(jx, vMiddle + (jf.y - 12), 2.2, 0, Math.PI * 2);
      ctx.fill();
    });

    // 2. 316L Stainless Steel Internal Vessel Wall
    const steelGrad = ctx.createLinearGradient(vCenter - vWidth / 2, 0, vCenter + vWidth / 2, 0);
    steelGrad.addColorStop(0, '#334155');
    steelGrad.addColorStop(0.15, '#64748B');
    steelGrad.addColorStop(0.5, '#1E293B');
    steelGrad.addColorStop(0.85, '#64748B');
    steelGrad.addColorStop(1, '#334155');
    ctx.fillStyle = steelGrad;
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.roundRect(vCenter - vWidth / 2 - 4, vMiddle - vHeight / 2 - 4, vWidth + 8, vHeight + 8, 22);
    ctx.fill();
    ctx.stroke();

    // 3. Culture Broth Liquid (Translucent Golden-Amber Nutrient Suspension)
    const brothGrad = ctx.createLinearGradient(0, vMiddle - vHeight / 2, 0, vMiddle + vHeight / 2);
    brothGrad.addColorStop(0, 'rgba(217, 119, 6, 0.22)');
    brothGrad.addColorStop(0.5, 'rgba(180, 83, 9, 0.32)');
    brothGrad.addColorStop(1, 'rgba(120, 53, 15, 0.45)');
    ctx.fillStyle = brothGrad;
    ctx.beginPath();
    ctx.roundRect(vCenter - vWidth / 2, vMiddle - vHeight / 2 + 18, vWidth, vHeight - 20, 18);
    ctx.fill();

    // Liquid Surface Meniscus & Anti-Foam Layer
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(vCenter - vWidth / 2 + 4, vMiddle - vHeight / 2 + 18);
    ctx.lineTo(vCenter + vWidth / 2 - 4, vMiddle - vHeight / 2 + 18);
    ctx.stroke();

    ctx.font = '600 7px "JetBrains Mono", monospace';
    ctx.fillStyle = '#D97706';
    ctx.textAlign = 'right';
    ctx.fillText('Liquid Meniscus & Anti-Foam Line', vCenter + vWidth / 2 - 8, vMiddle - vHeight / 2 + 14);

    // 4. Four Internal 316L Vertical Anti-Vortex Baffles
    [-vWidth / 2 + 6, vWidth / 2 - 12].forEach(bx => {
      ctx.fillStyle = '#475569';
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 1;
      ctx.fillRect(vCenter + bx, vMiddle - vHeight / 2 + 25, 6, vHeight - 45);
      ctx.strokeRect(vCenter + bx, vMiddle - vHeight / 2 + 25, 6, vHeight - 45);
    });

    // 5. Agitator Top Drive Motor & Double Mechanical Seal
    ctx.fillStyle = '#1E293B';
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 1.8;
    ctx.fillRect(vCenter - 28, vMiddle - vHeight / 2 - 42, 56, 32);
    ctx.strokeRect(vCenter - 28, vMiddle - vHeight / 2 - 42, 56, 32);

    ctx.fillStyle = '#38BDF8';
    ctx.font = '700 7px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('A310 DRIVE', vCenter, vMiddle - vHeight / 2 - 28);
    ctx.fillText('55 RPM (LOW SHEAR)', vCenter, vMiddle - vHeight / 2 - 18);

    // Central Polished Stainless Shaft
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 5.0;
    ctx.beginPath();
    ctx.moveTo(vCenter, vMiddle - vHeight / 2 - 10);
    ctx.lineTo(vCenter, vMiddle + vHeight / 2 - 18);
    ctx.stroke();

    // Shaft Steady Bearing at Vessel Dish Base
    ctx.fillStyle = '#64748B';
    ctx.fillRect(vCenter - 8, vMiddle + vHeight / 2 - 20, 16, 8);

    // 6. Dual-Tier Low-Shear Axial Hydrofoil Impellers (Lightnin A310 / Elephant Ear)
    for (let tier = 0; tier < 2; tier++) {
      const iy = vMiddle - 35 + tier * 90;
      ctx.save();
      ctx.translate(vCenter, iy);

      // Smooth impeller rotation driven by stage16Timer
      const rot = this.stage16Timer * 3.5;
      const bladeW1 = Math.cos(rot + tier * 1.4) * 62;
      const bladeW2 = Math.cos(rot + tier * 1.4 + (Math.PI * 2) / 3) * 62;
      const bladeW3 = Math.cos(rot + tier * 1.4 + (Math.PI * 4) / 3) * 62;

      ctx.fillStyle = '#CBD5E1';
      ctx.strokeStyle = '#0284C7';
      ctx.lineWidth = 1.8;

      // 3-blade hydrofoil profile
      [bladeW1, bladeW2, bladeW3].forEach(bw => {
        ctx.beginPath();
        ctx.ellipse(bw * 0.45, 0, Math.abs(bw) * 0.55, 6.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      // Toroidal Circulation Streamlines (Curved velocity loops)
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      // Flow drawn down along shaft and up at walls
      ctx.ellipse(0, 0, 78, 22, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.restore();
    }

    // 7. Submerged Porous Sintered Micro-Sparger Ring
    const spargeY = vMiddle + vHeight / 2 - 24;
    ctx.fillStyle = '#475569';
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(vCenter - 48, spargeY, 96, 7, 3);
    ctx.fill();
    ctx.stroke();

    // Sintered Micro-Pore Dots on Sparger
    ctx.fillStyle = '#38BDF8';
    for (let px = -40; px <= 40; px += 8) {
      ctx.beginPath();
      ctx.arc(vCenter + px, spargeY + 3.5, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Rising Micro-Bubbles Plume (DO 45% Saturation)
    this.s16Bubbles.forEach(b => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // 8. Suspended Mammalian CHO-K1 Cells Tumbling in Broth
    this.s16ChoCells.forEach(c => {
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.angle);

      // Cell Membrane
      ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(0, 0, c.r * 1.15, c.r * 0.95, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Nucleus
      ctx.fillStyle = 'rgba(99, 102, 241, 0.7)';
      ctx.beginPath();
      ctx.arc(0, 0, c.r * 0.42, 0, Math.PI * 2);
      ctx.fill();

      // rhDNase 1 droplet actively budding off
      if (Math.sin(c.secreteTimer * 3) > 0.4) {
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(c.r + 2.5, 0, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });

    // Secreted rhDNase 1 Molecules Diffusing in Broth
    this.s16ProductDroplets.forEach(p => {
      ctx.fillStyle = 'rgba(56, 189, 248, 0.85)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
      ctx.fill();
    });

    // 9. Process Analytical Technology (PAT) Probes
    // A) Dissolved Oxygen Optical Sensor (Left port)
    const doY = vMiddle - 10;
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(vCenter - vWidth / 2 - 38, doY - 8);
    ctx.lineTo(vCenter - vWidth / 2 + 18, doY);
    ctx.stroke();

    ctx.fillStyle = '#38BDF8';
    ctx.beginPath();
    ctx.arc(vCenter - vWidth / 2 + 18, doY, 2.8, 0, Math.PI * 2);
    ctx.fill();

    // B) Pressurized Gel pH Probe (Left lower port)
    const phY = vMiddle + 45;
    ctx.strokeStyle = '#2DD4BF';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(vCenter - vWidth / 2 - 38, phY - 6);
    ctx.lineTo(vCenter - vWidth / 2 + 18, phY);
    ctx.stroke();

    ctx.fillStyle = '#2DD4BF';
    ctx.beginPath();
    ctx.arc(vCenter - vWidth / 2 + 18, phY, 2.8, 0, Math.PI * 2);
    ctx.fill();

    // C) Pt100 RTD Temperature Probe (Right port)
    const tY = vMiddle - 20;
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(vCenter + vWidth / 2 + 38, tY - 8);
    ctx.lineTo(vCenter + vWidth / 2 - 18, tY);
    ctx.stroke();

    // D) Capacitance Biomass Probe (Right lower port)
    const bioY = vMiddle + 40;
    ctx.strokeStyle = '#A855F7';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(vCenter + vWidth / 2 + 38, bioY - 6);
    ctx.lineTo(vCenter + vWidth / 2 - 18, bioY);
    ctx.stroke();

    // 10. Top Sterile Feed Lines & Drops
    this.s16FeedDrops.forEach(fd => {
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(fd.x, fd.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Top Inflow Pipes
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(-280, vMiddle - vHeight / 2 - 40); ctx.lineTo(-280, vMiddle - vHeight / 2 + 5);
    ctx.moveTo(-170, vMiddle - vHeight / 2 - 40); ctx.lineTo(-170, vMiddle - vHeight / 2 + 5);
    ctx.stroke();

    // Bottom Sanitary Diaphragm Drain Valve
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(vCenter, vMiddle + vHeight / 2 + 8);
    ctx.lineTo(vCenter, vMiddle + vHeight / 2 + 28);
    ctx.stroke();

    // Visual Feature Annotations
    ctx.font = '600 7.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#38BDF8';
    ctx.textAlign = 'left';
    ctx.fillText('⟵ Optical DO Probe (45%)', rX + 16, doY - 10);
    ctx.fillText('⟵ Gel pH Sensor (7.00)', rX + 16, phY - 8);
    ctx.fillText('⟵ Sintered Sparger Ring', rX + 16, spargeY - 6);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#CBD5E1';
    ctx.fillText('Pt100 Temp Probe ⟶', rX + rW - 16, tY - 10);
    ctx.fillText('Biomass Probe ⟶', rX + rW - 16, bioY - 8);
    ctx.fillText('Thermal Water Jacket ⟶', rX + rW - 16, vMiddle + 85);

    ctx.restore();


    // ==========================================
    // RIGHT PANEL: SCADA DCS AUTOMATION & TELEMETRY
    // ==========================================
    const scX = 30;
    const scY = -172;
    const scW = 442;
    const scH = 398;

    ctx.save();
    // Panel Chassis
    ctx.fillStyle = '#0F172A';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.roundRect(scX, scY, scW, scH, 10);
    ctx.fill();
    ctx.stroke();

    // Panel Header Pill
    ctx.fillStyle = '#1E293B';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(scX + 14, scY + 12, scW - 28, 28, 6);
    ctx.fill();
    ctx.stroke();

    ctx.font = '800 10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#38BDF8';
    ctx.textAlign = 'left';
    ctx.fillText('SCADA AUTOMATION & DCS CONTROL CONSOLE', scX + 24, scY + 26);
    ctx.font = '700 8.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#94A3B8';
    ctx.textAlign = 'right';
    ctx.fillText('BATCH: DAY 12.4 / 18.0', scX + scW - 24, scY + 26);

    // 1. BIPHASIC TEMPERATURE SHIFT GRAPH
    const gX = scX + 22;
    const gY = scY + 52;
    const gW = scW - 44;
    const gH = 92;

    // Graph Frame
    ctx.fillStyle = '#111827';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(gX, gY, gW, gH, 6);
    ctx.fill();
    ctx.stroke();

    // Graph Gridlines
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
    ctx.lineWidth = 0.8;
    for (let gy = gY + 18; gy < gY + gH; gy += 18) {
      ctx.beginPath();
      ctx.moveTo(gX, gy); ctx.lineTo(gX + gW, gy);
      ctx.stroke();
    }
    for (let gx = gX + 50; gx < gX + gW; gx += 50) {
      ctx.beginPath();
      ctx.moveTo(gx, gY); ctx.lineTo(gx, gY + gH);
      ctx.stroke();
    }

    // Graph Title
    ctx.font = '700 8px "JetBrains Mono", monospace';
    ctx.fillStyle = '#38BDF8';
    ctx.textAlign = 'left';
    ctx.fillText('★ BIPHASIC TEMPERATURE SHIFT: 37.0°C (GROWTH) ⟶ 32.5°C (PRODUCTION)', gX + 10, gY + 14);

    // Shift Day 6.5 dividing line
    const shiftX = gX + gW * 0.38;
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(shiftX, gY + 18);
    ctx.lineTo(shiftX, gY + gH - 6);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.font = '700 7px "JetBrains Mono", monospace';
    ctx.fillStyle = '#F59E0B';
    ctx.textAlign = 'center';
    ctx.fillText('Day 6.5 Cold Shift', shiftX, gY + gH - 10);

    // Temperature Curve (Amber to Cyan)
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(gX + 12, gY + 30);
    ctx.lineTo(shiftX - 6, gY + 30);
    ctx.stroke();

    // Transition slope
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(shiftX - 6, gY + 30);
    ctx.lineTo(shiftX + 10, gY + 62);
    ctx.lineTo(gX + gW - 12, gY + 62);
    ctx.stroke();

    // Viable Cell Density (VCD) Curve (Green dash)
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(gX + 12, gY + 78);
    ctx.quadraticCurveTo(shiftX - 20, gY + 34, shiftX + 20, gY + 34);
    ctx.lineTo(gX + gW - 12, gY + 38);
    ctx.stroke();

    // Titer Accumulation Curve (Magenta dash)
    ctx.strokeStyle = '#C084FC';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(gX + 12, gY + 84);
    ctx.lineTo(shiftX, gY + 76);
    ctx.quadraticCurveTo(gX + gW * 0.7, gY + 48, gX + gW - 12, gY + 22);
    ctx.stroke();

    // Curve Legend
    ctx.font = '600 7px "JetBrains Mono", monospace';
    ctx.fillStyle = '#F59E0B'; ctx.fillText('● Temp (°C)', gX + gW - 165, gY + 14);
    ctx.fillStyle = '#10B981'; ctx.fillText('● VCD (10⁶/mL)', gX + gW - 105, gY + 14);
    ctx.fillStyle = '#C084FC'; ctx.fillText('● Titer (g/L)', gX + gW - 40, gY + 14);

    // Dynamic Time Scrubber Cursor
    const scrubX = shiftX + 18 + Math.sin(this.stage16Timer * 0.8) * 20;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(scrubX, gY + 18);
    ctx.lineTo(scrubX, gY + gH);
    ctx.stroke();

    // 2. TWO STRATEGY PHASE SUMMARY CARDS
    const phaseY = gY + gH + 10;
    const pW = (gW - 10) / 2;

    // Phase 1 Card (Days 0-6: Growth)
    ctx.fillStyle = '#1E293B';
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(gX, phaseY, pW, 46, 5);
    ctx.fill();
    ctx.stroke();

    ctx.font = '700 8px "JetBrains Mono", monospace';
    ctx.fillStyle = '#F59E0B';
    ctx.textAlign = 'left';
    ctx.fillText('PHASE 1: DAYS 0–6 (37.0°C)', gX + 10, phaseY + 14);
    ctx.font = '400 7.2px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#CBD5E1';
    ctx.fillText('Rapid logarithmic cell proliferation.', gX + 10, phaseY + 26);
    ctx.fillText('Builds biomass to >18 × 10⁶ cells/mL.', gX + 10, phaseY + 37);

    // Phase 2 Card (Days 7-18: Production)
    ctx.fillStyle = '#1E293B';
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(gX + pW + 10, phaseY, pW, 46, 5);
    ctx.fill();
    ctx.stroke();

    ctx.font = '700 8px "JetBrains Mono", monospace';
    ctx.fillStyle = '#38BDF8';
    ctx.fillText('PHASE 2: DAYS 7–18 (32.5°C)', gX + pW + 20, phaseY + 14);
    ctx.font = '400 7.2px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#CBD5E1';
    ctx.fillText('Cell cycle arrest in G1; stops division.', gX + pW + 20, phaseY + 26);
    ctx.fillText('Channel all ATP to rhDNase secretion.', gX + pW + 20, phaseY + 37);

    // 3. FIVE REAL-TIME CRITICAL PROCESS PARAMETERS (CPPs)
    const cppY = phaseY + 54;
    const cppItems = [
      {
        param: 'Dissolved Oxygen (DO):',
        val: '45.0% ± 1.2%',
        unit: 'Air Sat.',
        desc: 'Sintered micro-sparge cascade; zero bubble shear rupture',
        color: '#38BDF8'
      },
      {
        param: 'Vessel pH Regulation:',
        val: '7.00 ± 0.03',
        unit: 'pH units',
        desc: 'Automated CO₂ sparge (acidification) & 0.5M NaHCO₃ base feed',
        color: '#2DD4BF'
      },
      {
        param: 'Hydrofoil Impeller Agitation:',
        val: '55 RPM (Low-Shear)',
        unit: 'Tip 1.2 m/s',
        desc: 'A310 hydrofoil axial pump keeps shear stress < 1.0 Pa',
        color: '#F59E0B'
      },
      {
        param: 'Calcium (Ca²⁺) Enrichment:',
        val: '1.2 mM CaCl₂',
        unit: 'Cofactor',
        desc: 'Chelates into catalytic cleft, stabilizing active 3D conformation',
        color: '#A855F7'
      },
      {
        param: 'Harvest rhDNase 1 Titer:',
        val: '1.85 g/L',
        unit: '>99% Monomer',
        desc: 'Commercial pharmaceutical yield (>70,000 doses per 10kL batch)',
        color: '#10B981'
      }
    ];

    let curCY = cppY;
    cppItems.forEach(item => {
      ctx.fillStyle = '#111827';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(gX, curCY, gW, 33, 5);
      ctx.fill();
      ctx.stroke();

      // Parameter Name
      ctx.font = '700 8.5px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#F8FAFC';
      ctx.textAlign = 'left';
      ctx.fillText(item.param, gX + 10, curCY + 13);

      // Parameter Value Tag
      ctx.font = '800 9.5px "JetBrains Mono", monospace';
      ctx.fillStyle = item.color;
      ctx.textAlign = 'right';
      ctx.fillText(`${item.val} [${item.unit}]`, gX + gW - 10, curCY + 13);

      // Engineering Context Subtitle
      ctx.font = '400 7.5px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#94A3B8';
      ctx.textAlign = 'left';
      ctx.fillText(item.desc, gX + 10, curCY + 25);

      curCY += 37;
    });

    ctx.restore();

    ctx.restore();
  }

  /* ========================================================
     STAGE 17: Downstream Bioprocessing: Multi-Stage Purification & Sterile Formulation
     Animated continuous 4-station pharmaceutical factory pipeline:
     Station 1: High-speed spinning disk-stack centrifuge separating CHO cells from broth
     Station 2: Vertical glass chromatography column with migrating, concentrated turquoise rhDNase band
     Station 3: 20-nm virus-retentive nanofiltration barrier blocking viruses while DNase passes
     Station 4: Blow-Fill-Seal (BFS) robotic dosing line filling sterile 2.5 mL Pulmozyme® ampules!
     ======================================================== */
  initStage17DownstreamPurification() {
    this.stage17Timer = 0;
  }

  updateStage17(dt) {
    this.stage17Timer += dt;
  }

  drawStage17DownstreamPurification(ctx) {
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(-500, -260, 1000, 520);

    ctx.fillStyle = '#E2E8F0';
    for (let gx = -460; gx <= 460; gx += 40) {
      for (let gy = -220; gy <= 220; gy += 40) {
        ctx.beginPath();
        ctx.arc(gx, gy, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Header
    ctx.fillStyle = '#F8FAFC';
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(-240, -252, 480, 26, 13);
    ctx.fill();
    ctx.stroke();

    ctx.font = '700 9.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#059669';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('● DOWNSTREAM PURIFICATION & STERILE PACKAGING', 0, -239);

    ctx.font = '800 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#0F172A';
    ctx.fillText('Downstream Chromatography, Viral Safety & Medicine Delivery', 0, -210);

    ctx.font = '500 11.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText('Harvesting secreted rhDNase 1, removing impurities to >99.9% purity, and packaging sterile Pulmozyme® ampules.', 0, -188);

    // 4 Animated Industrial Pipeline Modules
    const colW = 215;
    const colH = 390;
    const gap = 18;
    const startX = -460;
    const flowY = -170;

    // ==========================================
    // MODULE 1: DISK-STACK CENTRIFUGATION & CLARIFICATION
    // ==========================================
    const s1X = startX;
    ctx.save();
    ctx.fillStyle = '#F8FAFC';
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.roundRect(s1X, flowY, colW, colH, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#E0F2FE';
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(s1X + 10, flowY + 10, colW - 20, 24, 6);
    ctx.fill();
    ctx.stroke();
    ctx.font = '800 9px "JetBrains Mono", monospace';
    ctx.fillStyle = '#0369A1';
    ctx.textAlign = 'center';
    ctx.fillText('STEP 1 • CLARIFICATION', s1X + colW / 2, flowY + 22);

    // Centrifuge Animation
    const cenX = s1X + colW / 2;
    const cenY = flowY + 115;

    // Outer Centrifuge Housing
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.arc(cenX, cenY, 48, 0, Math.PI * 2);
    ctx.fill();

    // High-Speed Spinning Centrifuge Rotor
    const cRot = this.stage17Timer * 8;
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 3;
    for (let r = 0; r < 4; r++) {
      ctx.beginPath();
      ctx.arc(cenX, cenY, 36, cRot + r * Math.PI / 2, cRot + r * Math.PI / 2 + 0.6);
      ctx.stroke();
    }

    // Centrifugal Flung CHO Cells (Dense waste pellet)
    ctx.fillStyle = '#10B981';
    for (let d = 0; d < 8; d++) {
      const dang = cRot * 0.5 + d * Math.PI / 4;
      ctx.beginPath();
      ctx.arc(cenX + Math.cos(dang) * 38, cenY + Math.sin(dang) * 38, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Clarified Broth Outlet Tube (Golden clear fluid)
    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cenX, cenY + 48);
    ctx.lineTo(cenX, cenY + 85);
    ctx.stroke();

    ctx.font = '700 8.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#0F172A';
    ctx.textAlign = 'center';
    ctx.fillText('Disk-Stack Centrifuge', cenX, flowY + 54);
    ctx.font = '500 8px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText('Separates whole CHO cells', cenX, flowY + 180);
    ctx.fillText('without cellular lysis (>95% recovery)', cenX, flowY + 192);

    // 0.2 um Depth Filter Capsule at bottom
    ctx.fillStyle = '#E2E8F0';
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(s1X + 24, flowY + 215, colW - 48, 48, 6);
    ctx.fill();
    ctx.stroke();

    ctx.font = '800 8.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#0F172A';
    ctx.fillText('0.2 µm DEPTH FILTER', cenX, flowY + 234);
    ctx.font = '500 7.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText('Removes fine colloidal debris', cenX, flowY + 248);

    // Metric Pill
    ctx.fillStyle = '#E0F2FE';
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(s1X + 10, flowY + colH - 34, colW - 20, 24, 6);
    ctx.fill();
    ctx.stroke();
    ctx.font = '800 9px "JetBrains Mono", monospace';
    ctx.fillStyle = '#0284C7';
    ctx.fillText('YIELD: >95% BROTH RECOVERY', s1X + colW / 2, flowY + colH - 22);

    ctx.restore();


    // ==========================================
    // MODULE 2: HIGH-PERFORMANCE CHROMATOGRAPHY CASCADE
    // ==========================================
    const s2X = startX + colW + gap;
    ctx.save();
    ctx.fillStyle = '#F8FAFC';
    ctx.strokeStyle = '#4338CA';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.roundRect(s2X, flowY, colW, colH, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#EEF2FF';
    ctx.strokeStyle = '#4338CA';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(s2X + 10, flowY + 10, colW - 20, 24, 6);
    ctx.fill();
    ctx.stroke();
    ctx.font = '800 9px "JetBrains Mono", monospace';
    ctx.fillStyle = '#4338CA';
    ctx.textAlign = 'center';
    ctx.fillText('STEP 2 • CHROMATOGRAPHY', s2X + colW / 2, flowY + 22);

    // Vertical Glass Chromatography Column Model
    const colX = s2X + colW / 2;
    const colTop = flowY + 55;
    const colHeight = 150;
    const colWidth = 44;

    // Outer Glass Column
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.strokeStyle = '#4338CA';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(colX - colWidth / 2, colTop, colWidth, colHeight, 8);
    ctx.fill();
    ctx.stroke();

    // Packed Resin Bed (Beads pattern)
    ctx.fillStyle = '#E0E7FF';
    ctx.fillRect(colX - colWidth / 2 + 2, colTop + 10, colWidth - 4, colHeight - 20);

    // Concentrating Glowing Turquoise rhDNase 1 Band migrating down column
    const bandPos = (this.stage17Timer * 25) % (colHeight - 40);
    const bandGrad = ctx.createLinearGradient(0, colTop + 15 + bandPos, 0, colTop + 35 + bandPos);
    bandGrad.addColorStop(0, 'rgba(56, 189, 248, 0.2)');
    bandGrad.addColorStop(0.5, '#38BDF8');
    bandGrad.addColorStop(1, 'rgba(56, 189, 248, 0.2)');
    ctx.fillStyle = bandGrad;
    ctx.fillRect(colX - colWidth / 2 + 2, colTop + 15 + bandPos, colWidth - 4, 20);

    // Impurity Wash (Yellow band flowing out bottom)
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(colX - colWidth / 2 + 6, colTop + colHeight - 8, colWidth - 12, 6);

    ctx.font = '800 8px "JetBrains Mono", monospace';
    ctx.fillStyle = '#38BDF8';
    ctx.fillText('⟵ rhDNase Band', colX + colWidth / 2 + 40, colTop + 25 + bandPos);
    ctx.fillStyle = '#B45309';
    ctx.fillText('⟵ Impurity Waste', colX + colWidth / 2 + 40, colTop + colHeight - 4);

    // UV Spectrophotometer Peak Graph Box at bottom
    ctx.fillStyle = '#1E1B4B';
    ctx.strokeStyle = '#6366F1';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(s2X + 16, flowY + 218, colW - 32, 65, 6);
    ctx.fill();
    ctx.stroke();

    // Sharp Single UV 280 nm Peak Trace
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(s2X + 24, flowY + 270);
    ctx.lineTo(s2X + 50, flowY + 270);
    ctx.quadraticCurveTo(s2X + 80, flowY + 225, s2X + 105, flowY + 270);
    ctx.lineTo(s2X + colW - 24, flowY + 270);
    ctx.stroke();

    ctx.font = '800 7.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#38BDF8';
    ctx.fillText('UV 280nm PURE PEAK', s2X + colW / 2, flowY + 235);
    ctx.font = '500 7px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#A5B4FC';
    ctx.fillText('AEX ⟶ HIC ⟶ SEC Polishing', s2X + colW / 2, flowY + 247);

    // Metric Pill
    ctx.fillStyle = '#EEF2FF';
    ctx.strokeStyle = '#4338CA';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(s2X + 10, flowY + colH - 34, colW - 20, 24, 6);
    ctx.fill();
    ctx.stroke();
    ctx.font = '800 9px "JetBrains Mono", monospace';
    ctx.fillStyle = '#4338CA';
    ctx.fillText('PURITY: >99.9% MONOMER', s2X + colW / 2, flowY + colH - 22);

    ctx.restore();


    // ==========================================
    // MODULE 3: 20-nm NANOFILTRATION VIRAL CLEARANCE
    // ==========================================
    const s3X = startX + (colW + gap) * 2;
    ctx.save();
    ctx.fillStyle = '#F8FAFC';
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.roundRect(s3X, flowY, colW, colH, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FEF3C7';
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(s3X + 10, flowY + 10, colW - 20, 24, 6);
    ctx.fill();
    ctx.stroke();
    ctx.font = '800 9px "JetBrains Mono", monospace';
    ctx.fillStyle = '#B45309';
    ctx.textAlign = 'center';
    ctx.fillText('STEP 3 • VIRAL SAFETY', s3X + colW / 2, flowY + 22);

    // Nanofiltration Membrane Cross Section
    const memX = s3X + colW / 2;
    const memY = flowY + 130;

    // Membrane Filter Plate (20 nm pores)
    ctx.fillStyle = '#475569';
    ctx.fillRect(memX - 85, memY - 6, 170, 12);

    // 20 nm pores
    ctx.fillStyle = '#38BDF8';
    for (let p = -75; p <= 75; p += 15) {
      ctx.clearRect(memX + p - 2, memY - 6, 4, 12);
    }

    // GIANT VIRUS PARTICLES (Blocked on Top of Membrane)
    const virusY = memY - 32;
    ctx.fillStyle = '#EF4444';
    ctx.strokeStyle = '#991B1B';
    ctx.lineWidth = 1.5;
    [-45, 10, 55].forEach(vx => {
      ctx.beginPath();
      ctx.arc(memX + vx, virusY, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Spikes on virus
      for (let s = 0; s < Math.PI * 2; s += 0.8) {
        ctx.beginPath();
        ctx.moveTo(memX + vx + Math.cos(s) * 14, virusY + Math.sin(s) * 14);
        ctx.lineTo(memX + vx + Math.cos(s) * 19, virusY + Math.sin(s) * 19);
        ctx.stroke();
      }
    });

    ctx.font = '800 8.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#DC2626';
    ctx.fillText('✕ 100 nm Viruses Blocked', memX, memY - 55);

    // PURE 37 kDa DNASE MOLECULES (4.5 nm) GLIDING THROUGH 20 nm PORES!
    ctx.fillStyle = '#38BDF8';
    for (let d = -60; d <= 60; d += 25) {
      ctx.beginPath();
      ctx.arc(memX + d, memY + 30 + Math.sin(this.stage17Timer * 4 + d) * 4, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.font = '800 8.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#0284C7';
    ctx.fillText('✓ 4.5 nm rhDNase Passes', memX, memY + 52);

    // Dual Clearance Explanation Box at bottom
    ctx.fillStyle = '#FFFBEB';
    ctx.strokeStyle = '#FDE68A';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(s3X + 16, flowY + 215, colW - 32, 68, 6);
    ctx.fill();
    ctx.stroke();

    ctx.font = '800 8px "JetBrains Mono", monospace';
    ctx.fillStyle = '#B45309';
    ctx.fillText('DUAL VIRAL CLEARANCE:', memX, flowY + 232);
    ctx.font = '500 7.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#78350F';
    ctx.fillText('1. Solvent/Detergent lipid enveloped inactivation', memX, flowY + 246);
    ctx.fillText('2. 20 nm Planova size-exclusion barrier', memX, flowY + 258);
    ctx.fillText('Log Reduction Value: >12 LRV (Zero Risk)', memX, flowY + 270);

    // Metric Pill
    ctx.fillStyle = '#FEF3C7';
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(s3X + 10, flowY + colH - 34, colW - 20, 24, 6);
    ctx.fill();
    ctx.stroke();
    ctx.font = '800 9px "JetBrains Mono", monospace';
    ctx.fillStyle = '#B45309';
    ctx.fillText('VIRAL LOG REDUCTION: >12 LRV', s3X + colW / 2, flowY + colH - 22);

    ctx.restore();


    // ==========================================
    // MODULE 4: BLOW-FILL-SEAL (BFS) STERILE AMPULE PACKAGING
    // ==========================================
    const s4X = startX + (colW + gap) * 3;
    ctx.save();
    ctx.fillStyle = '#F8FAFC';
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.roundRect(s4X, flowY, colW, colH, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#DCFCE7';
    ctx.strokeStyle = '#16A34A';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(s4X + 10, flowY + 10, colW - 20, 24, 6);
    ctx.fill();
    ctx.stroke();
    ctx.font = '800 9px "JetBrains Mono", monospace';
    ctx.fillStyle = '#15803D';
    ctx.textAlign = 'center';
    ctx.fillText('STEP 4 • STERILE FORMULATION', s4X + colW / 2, flowY + 22);

    // Blow-Fill-Seal Ampule Visualization
    const ampX = s4X + colW / 2;
    const ampY = flowY + 125;

    // Robotic Stainless Steel Dosing Nozzle descending
    ctx.fillStyle = '#64748B';
    ctx.fillRect(ampX - 4, ampY - 80, 8, 35);

    // Clear medicine jet stream dispensing into ampule
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(ampX, ampY - 45);
    ctx.lineTo(ampX, ampY - 5);
    ctx.stroke();

    // Droplets
    ctx.fillStyle = '#38BDF8';
    ctx.beginPath();
    ctx.arc(ampX, ampY - 15, 3, 0, Math.PI * 2);
    ctx.fill();

    // 2.5 mL Single-Use Blow-Fill-Seal (BFS) LDPE Ampule
    // Ampule Body
    ctx.fillStyle = 'rgba(224, 242, 254, 0.7)';
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(ampX - 24, ampY - 10, 48, 65, 8);
    ctx.fill();
    ctx.stroke();

    // Liquid Fill Level inside Ampule
    const fillGrad = ctx.createLinearGradient(0, ampY + 15, 0, ampY + 55);
    fillGrad.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
    fillGrad.addColorStop(1, '#0284C7');
    ctx.fillStyle = fillGrad;
    ctx.fillRect(ampX - 22, ampY + 15, 44, 38);

    // Ampule Neck & Twist-Off Cap Wings
    ctx.fillStyle = 'rgba(224, 242, 254, 0.9)';
    ctx.fillRect(ampX - 6, ampY - 26, 12, 16);
    ctx.strokeRect(ampX - 6, ampY - 26, 12, 16);

    // Twist-off wings
    ctx.beginPath();
    ctx.roundRect(ampX - 18, ampY - 34, 36, 10, 3);
    ctx.fill();
    ctx.stroke();

    // Label on Ampule
    ctx.font = '800 7px "JetBrains Mono", monospace';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('PULMOZYME®', ampX, ampY + 30);
    ctx.fillText('2.5 mg/2.5 mL', ampX, ampY + 40);

    // Jet Nebulizer Delivery Icon Box at bottom
    ctx.fillStyle = '#F0FDF4';
    ctx.strokeStyle = '#BBF7D0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(s4X + 16, flowY + 205, colW - 32, 78, 6);
    ctx.fill();
    ctx.stroke();

    ctx.font = '800 8.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#15803D';
    ctx.fillText('JET NEBULIZER READY:', ampX, flowY + 222);

    ctx.font = '500 7.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#14532D';
    ctx.fillText('• 1.0 mg/mL dornase alfa', ampX, flowY + 236);
    ctx.fillText('• 8.77 mg/mL NaCl (Isotonic)', ampX, flowY + 248);
    ctx.fillText('• 0.15 mg/mL CaCl₂ (pH 6.3)', ampX, flowY + 260);
    ctx.fillText('• Single-use, preservative-free ampule', ampX, flowY + 272);

    // Metric Pill
    ctx.fillStyle = '#DCFCE7';
    ctx.strokeStyle = '#16A34A';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(s4X + 10, flowY + colH - 34, colW - 20, 24, 6);
    ctx.fill();
    ctx.stroke();
    ctx.font = '800 9px "JetBrains Mono", monospace';
    ctx.fillStyle = '#15803D';
    ctx.fillText('PACKAGING: 2.5 mL BFS AMPULE', s4X + colW / 2, flowY + colH - 22);

    ctx.restore();
  }
}

