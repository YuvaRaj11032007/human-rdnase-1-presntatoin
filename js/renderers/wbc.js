/**
 * Stage 4 Renderer: Immune Recruitment & Neutrophil (WBC) Extravasation
 * Visualizes blood capillaries, endothelial diapedesis, chemotactic migration (IL-8),
 * and swarms of multi-lobed polymorphonuclear neutrophils arriving to fight bacteria.
 */
class WbcRenderer {
  constructor(engine) {
    this.engine = engine;
    this.targetPoint = { x: 40, y: 0 };
    this.neutrophils = [];
    this.redBloodCells = [];
    this.chemokines = [];

    // Red blood cells circulating in capillary
    for (let i = 0; i < 18; i++) {
      this.redBloodCells.push({
        x: -240 + i * 28 + Math.random() * 10,
        y: -170 + (Math.random() - 0.5) * 20,
        radius: 9,
        speed: 1.2 + Math.random() * 0.8
      });
    }

    // Neutrophils migrating from capillary into mucus
    for (let i = 0; i < 9; i++) {
      this.neutrophils.push({
        x: -160 + i * 45 + (Math.random() - 0.5) * 20,
        y: -90 + i * 25 + (Math.random() - 0.5) * 20,
        targetX: 60 + (Math.random() - 0.5) * 120,
        targetY: 10 + (Math.random() - 0.5) * 100,
        radius: 17,
        lobes: 3 + Math.floor(Math.random() * 2), // 3 to 4 nuclear lobes
        angle: Math.random() * Math.PI * 2,
        morphPhase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.3
      });
    }

    // Chemokine gradient particles (IL-8, LTB4)
    for (let i = 0; i < 40; i++) {
      this.chemokines.push({
        x: (Math.random() - 0.5) * 400,
        y: (Math.random() - 0.5) * 300,
        radius: 1.5,
        alpha: 0.2 + Math.random() * 0.5
      });
    }
  }

  update(dt, time) {
    // Red blood cells flow smoothly through the capillary
    this.redBloodCells.forEach(rbc => {
      rbc.x += rbc.speed;
      if (rbc.x > 260) rbc.x = -260;
    });

    // Neutrophils crawl toward target infection site via pseudopodia chemotaxis
    this.neutrophils.forEach(wbc => {
      const dx = wbc.targetX - wbc.x;
      const dy = wbc.targetY - wbc.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 5) {
        wbc.x += (dx / dist) * wbc.speed;
        wbc.y += (dy / dist) * wbc.speed;
      }
      wbc.morphPhase += 0.04;
    });
  }

  render(ctx, time) {
    ctx.save();

    // 1. Capillary Wall & Lumen (Top region)
    this.drawCapillaryVessel(ctx, time);

    // 2. Tissue Stroma & Interstitial Space (Middle region)
    this.drawInterstitialMatrix(ctx);

    // 3. Chemotactic Gradient (IL-8 Waves)
    this.drawChemokineGradient(ctx, time);

    // 4. Resident Bacteria in Mucus (Right target zone)
    this.drawTargetBacteria(ctx);

    // 5. Neutrophils (WBCs) actively crawling with pseudopodia
    this.drawNeutrophils(ctx, time);

    // 6. Extravasation / Diapedesis Callout
    this.drawDiapedesisCallout(ctx);

    // 7. Interactive Hotspot Indicator
    this.drawHotspot(ctx, time);

    ctx.restore();
  }

  drawCapillaryVessel(ctx, time) {
    ctx.save();
    // Capillary lumen (blood vessel)
    ctx.fillStyle = '#FFF1F2'; // light vascular pink
    ctx.fillRect(-280, -210, 560, 80);

    // Endothelial cells lining vessel
    ctx.strokeStyle = '#E11D48';
    ctx.lineWidth = 2.5;

    // Top wall
    ctx.beginPath();
    ctx.moveTo(-280, -210);
    ctx.lineTo(280, -210);
    ctx.stroke();

    // Bottom endothelial border with intercellular gaps (diapedesis portals)
    for (let x = -280; x < 280; x += 60) {
      // Endothelial cell body
      ctx.fillStyle = '#FFE4E6';
      ctx.beginPath();
      ctx.roundRect(x + 2, -134, 54, 8, 3);
      ctx.fill();
      ctx.stroke();

      // Endothelial nucleus
      ctx.fillStyle = '#BE123C';
      ctx.beginPath();
      ctx.ellipse(x + 29, -130, 8, 3, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Flowing Red Blood Cells (biconcave discs)
    this.redBloodCells.forEach(rbc => {
      ctx.fillStyle = '#EF4444';
      ctx.strokeStyle = '#B91C1C';
      ctx.lineWidth = 1.2;

      ctx.beginPath();
      ctx.ellipse(rbc.x, rbc.y, rbc.radius, rbc.radius * 0.65, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Inner dimple
      ctx.fillStyle = '#DC2626';
      ctx.beginPath();
      ctx.ellipse(rbc.x, rbc.y, rbc.radius * 0.45, rbc.radius * 0.25, 0.2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Vessel Label
    ctx.font = '600 11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#E11D48';
    ctx.fillText('PULMONARY CAPILLARY / POST-CAPILLARY VENULE', -260, -185);

    ctx.restore();
  }

  drawInterstitialMatrix(ctx) {
    ctx.save();
    // Mucus & interstitial background
    const tissueGrad = ctx.createLinearGradient(0, -120, 0, 200);
    tissueGrad.addColorStop(0, '#F8FAFC');
    tissueGrad.addColorStop(0.4, '#FEF9C3'); // entering mucus
    tissueGrad.addColorStop(1, '#FEF08A');

    ctx.fillStyle = tissueGrad;
    ctx.fillRect(-280, -125, 560, 325);
    ctx.restore();
  }

  drawChemokineGradient(ctx, time) {
    ctx.save();
    // Chemokine diffusion concentric waves (IL-8 gradient radiating from bacteria)
    const sourceX = 140;
    const sourceY = 20;

    for (let r = 50; r <= 280; r += 50) {
      const pulseR = r + (time * 15) % 50;
      ctx.beginPath();
      ctx.arc(sourceX, sourceY, pulseR, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(2, 132, 199, 0.12)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawTargetBacteria(ctx) {
    ctx.save();
    // Clustered bacteria under attack
    const bactCoords = [
      { x: 120, y: 10, a: 0.3 },
      { x: 150, y: 35, a: -0.5 },
      { x: 135, y: -25, a: 1.1 },
      { x: 175, y: 0, a: -0.2 },
      { x: 160, y: -40, a: 0.8 }
    ];

    bactCoords.forEach(b => {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.a);

      ctx.fillStyle = '#16A34A';
      ctx.strokeStyle = '#14532D';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.roundRect(-10, -5, 20, 10, 5);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });

    // Label
    ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#15803D';
    ctx.fillText('Bacterial Infection Colony', 105, 60);

    ctx.restore();
  }

  drawNeutrophils(ctx, time) {
    ctx.save();

    this.neutrophils.forEach((wbc, idx) => {
      ctx.save();
      ctx.translate(wbc.x, wbc.y);

      // Amoeboid deformed cell membrane (pseudopodia extensions)
      ctx.fillStyle = '#F8FAFC';
      ctx.strokeStyle = '#0284C7';
      ctx.lineWidth = 2;

      ctx.beginPath();
      const numPoints = 12;
      for (let p = 0; p < numPoints; p++) {
        const theta = (p / numPoints) * Math.PI * 2;
        // Pseudopod wobble in heading direction
        const ripple = Math.sin(theta * 3 + wbc.morphPhase) * 2.5;
        const stretch = (Math.cos(theta) > 0.5) ? 3.5 : 0;
        const rad = wbc.radius + ripple + stretch;
        const px = Math.cos(theta) * rad;
        const py = Math.sin(theta) * rad;

        if (p === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Multi-lobed polymorphonuclear nucleus (Characteristic 3-4 connected lobes)
      ctx.fillStyle = '#4338CA'; // deep indigo/purple nucleus
      const lobeRadius = 3.8;

      ctx.beginPath();
      // Lobe 1
      ctx.arc(-5, -4, lobeRadius, 0, Math.PI * 2);
      // Lobe 2
      ctx.arc(4, -3, lobeRadius, 0, Math.PI * 2);
      // Lobe 3
      ctx.arc(0, 5, lobeRadius, 0, Math.PI * 2);
      ctx.fill();

      // Thin chromatin bridges between lobes
      ctx.strokeStyle = '#4338CA';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(-5, -4);
      ctx.lineTo(4, -3);
      ctx.lineTo(0, 5);
      ctx.stroke();

      // Cytoplasmic granules (azurophilic & specific granules: myeloperoxidase, elastase)
      ctx.fillStyle = '#818CF8';
      for (let g = 0; g < 6; g++) {
        const gx = Math.cos(g * 1.0) * 8;
        const gy = Math.sin(g * 1.0) * 8;
        ctx.beginPath();
        ctx.arc(gx, gy, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });

    ctx.restore();
  }

  drawDiapedesisCallout(ctx) {
    ctx.save();
    ctx.translate(-140, -70);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(-10, -10, 180, 50, 6);
    ctx.fill();
    ctx.stroke();

    ctx.font = '700 11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#0284C7';
    ctx.fillText('DIAPEDESIS / EXTRAVASATION', 0, 8);

    ctx.font = '500 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText('Neutrophils exit blood to rescue tissue', 0, 24);

    ctx.restore();
  }

  drawHotspot(ctx, time) {
    ctx.save();
    const hx = this.targetPoint.x;
    const hy = this.targetPoint.y;

    const pulse = 22 + Math.sin(time * 4) * 6;
    ctx.beginPath();
    ctx.arc(hx, hy, pulse, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(2, 132, 199, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(hx, hy, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#0284C7';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Callout text banner
    ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
    const label = 'Zoom In: The Microscopic Battle & NETosis (Click)';
    const width = ctx.measureText(label).width;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(hx - width / 2 - 12, hy + 24, width + 24, 28, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#0369A1';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, hx, hy + 38);

    ctx.restore();
  }

  checkHit(worldX, worldY) {
    // Advancing to battle stage
    return true;
  }
}
