/**
 * Stage 5 Renderer: Microscopic Battle, Neutrophil Lysis & DNA Mesh (NETosis)
 * The definitive pathophysiological event in CF:
 * White Blood Cells fight bacteria -> undergo cellular lysis & NETosis ->
 * Host nuclear chromosomal DNA unravels and forms an impenetrable macromolecular mesh!
 */
class NetosisRenderer {
  constructor(engine) {
    this.engine = engine;
    this.targetPoint = { x: 0, y: 0 };
    this.battlePhase = 0; // 0: Battle/Phagocytosis, 1: Membrane Blebbing, 2: Lysis & DNA Eruption, 3: Full DNA Mesh Network
    this.phaseTimer = 0;

    // Bacteria in battle
    this.combatants = [
      { x: -55, y: -25, hp: 1.0, trapped: false, angle: 0.4 },
      { x: 45, y: 35, hp: 0.8, trapped: false, angle: -0.6 },
      { x: -40, y: 50, hp: 0.6, trapped: false, angle: 1.2 },
      { x: 60, y: -45, hp: 0.5, trapped: false, angle: -0.8 },
      { x: 85, y: 10, hp: 0.7, trapped: false, angle: 0.1 }
    ];

    // Reactive oxygen species / granular sparks
    this.sparks = [];
    for (let i = 0; i < 30; i++) {
      this.sparks.push({
        x: (Math.random() - 0.5) * 80,
        y: (Math.random() - 0.5) * 80,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        alpha: Math.random(),
        color: Math.random() > 0.5 ? '#F59E0B' : '#EC4899'
      });
    }

    // Dynamic DNA strands (Polymer chains extending radially and crosslinking)
    this.dnaStrands = this.generateDnaPolymerMesh();
  }

  generateDnaPolymerMesh() {
    const strands = [];
    const numPrimaryFilaments = 16;

    for (let i = 0; i < numPrimaryFilaments; i++) {
      const angle = (i / numPrimaryFilaments) * Math.PI * 2 + (Math.random() - 0.5) * 0.2;
      const points = [];
      const numSegments = 12;
      let currX = (Math.random() - 0.5) * 12;
      let currY = (Math.random() - 0.5) * 12;

      for (let s = 0; s < numSegments; s++) {
        const stepDist = 16 + Math.random() * 8;
        const segmentAngle = angle + (Math.sin(s * 1.5) * 0.4) + (Math.random() - 0.5) * 0.2;
        currX += Math.cos(segmentAngle) * stepDist;
        currY += Math.sin(segmentAngle) * stepDist;
        points.push({
          x: currX,
          y: currY,
          baseLength: Math.hypot(currX, currY),
          crosslinks: []
        });
      }

      strands.push({
        baseAngle: angle,
        points: points,
        expansion: 0 // expands from 0 to 1 during lysis
      });
    }

    return strands;
  }

  reset() {
    this.battlePhase = 0;
    this.phaseTimer = 0;
    this.dnaStrands.forEach(s => s.expansion = 0);
  }

  update(dt, time) {
    this.phaseTimer += dt;

    // Automatic progressive staging of the battle if not interacted
    // 0s-2.5s: Intense combat & ROS bursts
    // 2.5s-4.5s: Neutrophil membrane blebbing / lysis trigger
    // 4.5s+: DNA eruption & expanding lattice mesh
    if (this.phaseTimer > 2.2 && this.battlePhase === 0) {
      this.battlePhase = 1;
      if (window.soundEngine) window.soundEngine.playCellRupture();
    }
    if (this.phaseTimer > 4.2 && this.battlePhase === 1) {
      this.battlePhase = 2;
      if (window.soundEngine) window.soundEngine.playDnaMesh();
    }

    // Expand DNA strands during lysis
    if (this.battlePhase >= 1) {
      this.dnaStrands.forEach(s => {
        s.expansion = Math.min(1.0, s.expansion + dt * 0.45);
      });
    }

    // Update ROS / protease sparks
    this.sparks.forEach(sp => {
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.alpha -= dt * 0.8;
      if (sp.alpha <= 0) {
        sp.x = (Math.random() - 0.5) * 50;
        sp.y = (Math.random() - 0.5) * 50;
        sp.vx = (Math.random() - 0.5) * 1.5;
        sp.vy = (Math.random() - 0.5) * 1.5;
        sp.alpha = 0.8 + Math.random() * 0.2;
      }
    });
  }

  render(ctx, time) {
    ctx.save();

    // 1. Viscous Mucus Background Matrix
    this.drawMucusFluid(ctx);

    // 2. Trapped / Battling Bacteria
    this.drawBattlingBacteria(ctx, time);

    // 3. Central Neutrophil (Intact -> Blebbing -> Rupturing)
    this.drawCentralNeutrophil(ctx, time);

    // 4. Erupting Chromosomal DNA Polymer Mesh (NETs)
    this.drawDnaLatticeMesh(ctx, time);

    // 5. Histones & Granular Proteases attached to DNA
    this.drawAntimicrobialProteases(ctx, time);

    // 6. Reactive Oxygen Species (ROS) & Lysosomal bursts
    this.drawCombatSparks(ctx);

    // 7. Scientific Stage Badge
    this.drawNetosisBadge(ctx);

    // 8. Hotspot Cue
    this.drawHotspot(ctx, time);

    ctx.restore();
  }

  drawMucusFluid(ctx) {
    ctx.save();
    const grad = ctx.createRadialGradient(0, 0, 40, 0, 0, 300);
    grad.addColorStop(0, '#FEF9C3');
    grad.addColorStop(0.7, '#FEF08A');
    grad.addColorStop(1, '#FDE047');
    ctx.fillStyle = grad;
    ctx.fillRect(-350, -250, 700, 500);
    ctx.restore();
  }

  drawBattlingBacteria(ctx, time) {
    ctx.save();
    this.combatants.forEach((b, idx) => {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.angle + Math.sin(time * 3 + idx) * 0.1);

      // Trapped in DNA web when expansion is high
      const isTrapped = (this.dnaStrands[0].expansion > 0.6);

      ctx.fillStyle = isTrapped ? '#15803D' : '#22C55E';
      ctx.strokeStyle = '#14532D';
      ctx.lineWidth = 1.4;

      ctx.beginPath();
      ctx.roundRect(-12, -6, 24, 12, 6);
      ctx.fill();
      ctx.stroke();

      // Stress / damage indicator if under attack
      if (b.hp < 1.0) {
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-4, -4);
        ctx.lineTo(4, 4);
        ctx.moveTo(4, -4);
        ctx.lineTo(-4, 4);
        ctx.stroke();
      }

      ctx.restore();
    });
    ctx.restore();
  }

  drawCentralNeutrophil(ctx, time) {
    ctx.save();
    const exp = this.dnaStrands[0].expansion; // 0 to 1

    if (exp < 0.95) {
      // Cell membrane opacity fades as it lyses
      const membraneAlpha = Math.max(0, 1.0 - exp * 1.1);

      ctx.save();
      ctx.globalAlpha = membraneAlpha;

      // Amoeboid membrane / blebbing
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#0284C7';
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      const numPts = 16;
      const baseR = 42;

      for (let p = 0; p < numPts; p++) {
        const theta = (p / numPts) * Math.PI * 2;
        // Blebbing bulges as apoptosis/NETosis advances
        const bleb = Math.sin(theta * 4 + time * 3) * (4 + exp * 12);
        const r = baseR + bleb;
        const px = Math.cos(theta) * r;
        const py = Math.sin(theta) * r;

        if (p === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Internal lobed nucleus before complete unraveling
      if (exp < 0.7) {
        const nucAlpha = Math.max(0, 1.0 - exp * 1.5);
        ctx.fillStyle = `rgba(67, 56, 202, ${nucAlpha})`; // Indigo nucleus

        const nucPositions = [
          { x: -14, y: -10, r: 12 },
          { x: 12, y: -12, r: 11 },
          { x: 0, y: 14, r: 13 }
        ];

        nucPositions.forEach(np => {
          ctx.beginPath();
          ctx.arc(np.x, np.y, np.r, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      ctx.restore();
    }

    // Residual cell ghost / degranulated center
    ctx.fillStyle = 'rgba(241, 245, 249, 0.5)';
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawDnaLatticeMesh(ctx, time) {
    ctx.save();
    const exp = this.dnaStrands[0].expansion; // 0 to 1
    if (exp <= 0.02) {
      ctx.restore();
      return;
    }

    // Host Chromosomal DNA filaments: Double Helix Polymer Chains
    // Glowing electric indigo & violet filaments
    ctx.shadowColor = 'rgba(99, 102, 241, 0.4)';
    ctx.shadowBlur = 6;

    this.dnaStrands.forEach((strand, sIdx) => {
      const activePts = Math.floor(strand.points.length * exp);
      if (activePts < 2) return;

      // Primary double-stranded DNA backbone (Twin strands with base-pair rungs)
      ctx.strokeStyle = '#6366F1'; // vivid indigo DNA backbone
      ctx.lineWidth = 2.0;

      ctx.beginPath();
      ctx.moveTo(0, 0);

      for (let i = 0; i < activePts; i++) {
        const pt = strand.points[i];
        // Dynamic wave oscillation (flexible polymer chain)
        const wave = Math.sin(time * 2.5 + i * 0.8 + sIdx) * 3.5;
        const perpX = -Math.sin(strand.baseAngle) * wave;
        const perpY = Math.cos(strand.baseAngle) * wave;

        ctx.lineTo(pt.x + perpX, pt.y + perpY);
      }
      ctx.stroke();

      // DNA Base-Pair Rungs (ladder structure highlighting it's double-stranded DNA!)
      ctx.strokeStyle = '#A855F7'; // purple ladder rungs
      ctx.lineWidth = 1.3;

      for (let i = 1; i < activePts; i += 2) {
        const pt = strand.points[i];
        const wave = Math.sin(time * 2.5 + i * 0.8 + sIdx) * 3.5;
        const perpX = -Math.sin(strand.baseAngle) * 5;
        const perpY = Math.cos(strand.baseAngle) * 5;

        ctx.beginPath();
        ctx.moveTo(pt.x - perpX, pt.y - perpY);
        ctx.lineTo(pt.x + perpX, pt.y + perpY);
        ctx.stroke();
      }
    });

    // Cross-linking inter-strand DNA bonds (forming the impenetrable mesh network)
    if (exp > 0.4) {
      const crossAlpha = Math.min(0.85, (exp - 0.4) * 1.5);
      ctx.strokeStyle = `rgba(124, 58, 237, ${crossAlpha})`;
      ctx.lineWidth = 1.4;
      ctx.setLineDash([3, 4]);

      for (let s1 = 0; s1 < this.dnaStrands.length; s1 += 2) {
        const s2 = (s1 + 3) % this.dnaStrands.length;
        const p1 = this.dnaStrands[s1].points[Math.min(5, Math.floor(this.dnaStrands[s1].points.length * exp) - 1)];
        const p2 = this.dnaStrands[s2].points[Math.min(5, Math.floor(this.dnaStrands[s2].points.length * exp) - 1)];

        if (p1 && p2) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.quadraticCurveTo(0, 0, p2.x, p2.y);
          ctx.stroke();
        }
      }
      ctx.setLineDash([]);
    }

    ctx.restore();
  }

  drawAntimicrobialProteases(ctx, time) {
    ctx.save();
    const exp = this.dnaStrands[0].expansion;
    if (exp < 0.25) {
      ctx.restore();
      return;
    }

    // Granular enzymes bound to the DNA scaffold (Histones, Neutrophil Elastase, MPO)
    this.dnaStrands.forEach((strand, sIdx) => {
      const activePts = Math.floor(strand.points.length * exp);
      for (let i = 1; i < activePts; i += 3) {
        const pt = strand.points[i];

        // Histone octamer core bead (Orange-amber)
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 3.2, 0, Math.PI * 2);
        ctx.fill();

        // Neutrophil Elastase active site (Cyan dot)
        ctx.fillStyle = '#06B6D4';
        ctx.beginPath();
        ctx.arc(pt.x + 3, pt.y - 3, 2.0, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    ctx.restore();
  }

  drawCombatSparks(ctx) {
    ctx.save();
    if (this.dnaStrands[0].expansion < 0.8) {
      this.sparks.forEach(sp => {
        ctx.fillStyle = sp.color;
        ctx.globalAlpha = sp.alpha;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    ctx.restore();
  }

  drawNetosisBadge(ctx) {
    ctx.save();
    ctx.translate(-210, -180);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
    ctx.strokeStyle = '#C7D2FE';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-10, -10, 240, 72, 8);
    ctx.fill();
    ctx.stroke();

    ctx.font = '700 12px "JetBrains Mono", monospace';
    ctx.fillStyle = '#4338CA';
    ctx.fillText('NETOSIS & DNA RELEASE', 0, 10);

    ctx.font = '500 11.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#334155';
    ctx.fillText('• Neutrophil lysis frees 2-meter host DNA', 0, 28);
    ctx.fillText('• Viscous DNA mesh forms impenetrable trap', 0, 44);

    ctx.restore();
  }

  drawHotspot(ctx, time) {
    ctx.save();
    const hx = this.targetPoint.x;
    const hy = this.targetPoint.y + 110;

    const pulse = 22 + Math.sin(time * 4) * 6;
    ctx.beginPath();
    ctx.arc(hx, hy, pulse, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(hx, hy, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#6366F1';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Callout text banner
    ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
    const label = 'DNA Turns Mucus Hyperviscous: Zoom Out (Click)';
    const width = ctx.measureText(label).width;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
    ctx.strokeStyle = '#6366F1';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(hx - width / 2 - 12, hy + 20, width + 24, 28, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#4338CA';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, hx, hy + 34);

    ctx.restore();
  }

  checkHit(worldX, worldY) {
    // Advance to next stage (Hyperviscosity & Zoom Out)
    return true;
  }
}
