/**
 * Stage 6 Renderer: DNA-Induced Hyperviscosity & Macroscopic Airway Occlusion
 * Illustrates the biophysical impact: High-molecular-weight DNA polymers 
 * dramatically increase mucus viscoelasticity, forming dense airway plugs.
 * Provides interactive zoom-out back to the whole lung.
 */
class ViscosityRenderer {
  constructor(engine) {
    this.engine = engine;
    this.targetPoint = { x: 0, y: 0 };
    this.zoomOutProgress = 0; // 0: zoomed in, 1: fully zoomed out to whole lung
    this.isZoomingOut = false;
    this.dnaDensity = 0.85;

    // Entangled polymer network grid
    this.polymers = [];
    for (let i = 0; i < 40; i++) {
      this.polymers.push({
        x1: (Math.random() - 0.5) * 500,
        y1: (Math.random() - 0.5) * 350,
        x2: (Math.random() - 0.5) * 500,
        y2: (Math.random() - 0.5) * 350,
        cpX: (Math.random() - 0.5) * 200,
        cpY: (Math.random() - 0.5) * 200,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  setDnaDensity(val) {
    this.dnaDensity = val; // 0 to 1
  }

  startZoomOut() {
    this.isZoomingOut = true;
    if (window.soundEngine) window.soundEngine.playZoom(false);
  }

  update(dt, time) {
    if (this.isZoomingOut) {
      this.zoomOutProgress = Math.min(1.0, this.zoomOutProgress + dt * 0.35);
    }
  }

  render(ctx, time) {
    ctx.save();

    if (this.zoomOutProgress < 0.6) {
      // 1. Viscous Sludge Matrix (Micro to Mesoscopic View)
      this.drawViscousSludge(ctx, time);

      // 2. Dense Crosslinked DNA-Mucin Polymers
      this.drawEntangledPolymerNetwork(ctx, time);

      // 3. Occluded Airway Cross-Section representation
      this.drawOccludedLumen(ctx);

      // 4. Biophysical Rheology Diagram (Viscosity vs DNA concentration)
      this.drawRheologyPanel(ctx);

      // 5. Zoom Out Action Hotspot / Button
      this.drawZoomOutCue(ctx, time);
    } else {
      // Transitioning smoothly to Macro Organ View showing Mucus Plugs in Bronchi
      this.drawMacroOcclusionView(ctx, time);
    }

    ctx.restore();
  }

  drawViscousSludge(ctx, time) {
    ctx.save();
    // Heavy, desiccated, purulent sputum background
    const bgGrad = ctx.createRadialGradient(0, 0, 50, 0, 0, 320);
    bgGrad.addColorStop(0, '#FEF08A');
    bgGrad.addColorStop(0.5, '#FDE047');
    bgGrad.addColorStop(1, '#CA8A04');

    ctx.fillStyle = bgGrad;
    ctx.fillRect(-350, -250, 700, 500);

    // Thick sluggish laminar flow waves
    ctx.strokeStyle = 'rgba(161, 98, 7, 0.4)';
    ctx.lineWidth = 3;
    for (let y = -200; y <= 200; y += 40) {
      ctx.beginPath();
      for (let x = -300; x <= 300; x += 30) {
        // Very slow, sluggish wave motion due to high viscosity
        const wave = Math.sin(x * 0.02 + time * 0.4 + y) * (3 * (1 - this.dnaDensity * 0.7));
        if (x === -300) ctx.moveTo(x, y + wave);
        else ctx.lineTo(x, y + wave);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  drawEntangledPolymerNetwork(ctx, time) {
    ctx.save();
    const count = Math.floor(this.polymers.length * this.dnaDensity);

    // DNA polymer strands (Indigo/violet double chains)
    ctx.strokeStyle = '#6366F1';
    ctx.lineWidth = 2.2;
    ctx.shadowColor = 'rgba(99, 102, 241, 0.35)';
    ctx.shadowBlur = 4;

    for (let i = 0; i < count; i++) {
      const p = this.polymers[i];
      const wobble = Math.sin(time * 0.5 + p.phase) * 2;

      ctx.beginPath();
      ctx.moveTo(p.x1, p.y1);
      ctx.quadraticCurveTo(p.cpX + wobble, p.cpY + wobble, p.x2, p.y2);
      ctx.stroke();
    }

    // High density crosslinking nodes
    ctx.fillStyle = '#DC2626'; // mechanical friction nodes
    for (let i = 0; i < count; i += 2) {
      const p = this.polymers[i];
      ctx.beginPath();
      ctx.arc(p.cpX, p.cpY, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  drawOccludedLumen(ctx) {
    ctx.save();
    ctx.translate(140, -110);

    // Airway Lumen Plug mini-diagram
    ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-100, -50, 200, 100, 8);
    ctx.fill();
    ctx.stroke();

    ctx.font = '700 11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#DC2626';
    ctx.fillText('AIRWAY OCCLUSION', -85, -30);

    // Mini cross-section: Airway wall vs huge mucus plug
    ctx.strokeStyle = '#F43F5E';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(-40, 10, 24, 0, Math.PI * 2);
    ctx.stroke();

    // Plug blocking 90%
    ctx.fillStyle = '#EAB308';
    ctx.beginPath();
    ctx.arc(-40, 10, 21, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = '500 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText('• 90% Lumen Blockage', 0, -5);
    ctx.fillText('• Zero Mucociliary Clearance', 0, 12);
    ctx.fillText('• Severe Hypoxia & Infection', 0, 29);

    ctx.restore();
  }

  drawRheologyPanel(ctx) {
    ctx.save();
    ctx.translate(-220, -110);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-10, -50, 230, 105, 8);
    ctx.fill();
    ctx.stroke();

    ctx.font = '700 11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#7C3AED';
    ctx.fillText('BIOPHYSICAL RHEOLOGY', 5, -30);

    // Viscosity comparison bars
    const healthyVisc = 15;
    const cfVisc = 15 + Math.floor(this.dnaDensity * 125);

    // Normal bar
    ctx.font = '500 10.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText('Normal Sputum: ~20 cP', 5, -10);
    ctx.fillStyle = '#0284C7';
    ctx.fillRect(5, -4, 25, 8);

    // CF bar
    ctx.fillStyle = '#DC2626';
    ctx.fillText(`CF DNA Sputum: >12,000 cP`, 5, 20);
    ctx.fillRect(5, 26, cfVisc, 8);

    ctx.restore();
  }

  drawZoomOutCue(ctx, time) {
    ctx.save();
    const hx = 0;
    const hy = 110;

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
    ctx.font = '700 13px "Plus Jakarta Sans", sans-serif';
    const label = '🔍 Click to Zoom Out to Whole Lung Overview';
    const width = ctx.measureText(label).width;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(hx - width / 2 - 16, hy + 20, width + 32, 32, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#0369A1';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, hx, hy + 36);

    ctx.restore();
  }

  drawMacroOcclusionView(ctx, time) {
    ctx.save();
    // Whole lung view with bronchial tree showing visible plugs in bronchioles
    if (this.engine.lungRenderer) {
      this.engine.lungRenderer.render(ctx, time);
    }

    // Highlight mucus plugs across both lungs with warning badges
    const plugPoints = [
      { x: -110, y: -40 },
      { x: -120, y: 25 },
      { x: -90, y: 80 },
      { x: 110, y: 35 },
      { x: 85, y: 85 }
    ];

    plugPoints.forEach(pt => {
      ctx.fillStyle = '#F59E0B';
      ctx.strokeStyle = '#B45309';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 6 + Math.sin(time * 3) * 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    // Overview banner
    ctx.save();
    ctx.translate(0, 155);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-220, -22, 440, 44, 8);
    ctx.fill();
    ctx.stroke();

    ctx.font = '700 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#0F172A';
    ctx.textAlign = 'center';
    ctx.fillText('Vicious Cycle Complete: Airways Occluded with DNA-Rich Mucus', 0, -3);

    ctx.font = '600 11.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#0284C7';
    ctx.fillText('Next Milestone: Enter Recombinant Human DNase 1 (Dornase Alfa) ➔', 0, 13);

    ctx.restore();

    ctx.restore();
  }

  checkHit(worldX, worldY) {
    if (!this.isZoomingOut) {
      this.startZoomOut();
      return false; // handling zoom out within stage
    }
    return true;
  }
}
