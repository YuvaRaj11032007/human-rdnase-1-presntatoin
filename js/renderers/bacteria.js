/**
 * Stage 3 Renderer: Microbial Colonization & Bacterial Breeding Ground
 * Visualizes opportunistic bacteria (Pseudomonas aeruginosa) proliferating 
 * inside the stagnant, hypoxic, nutrient-rich mucus gel matrix.
 */
class BacteriaRenderer {
  constructor(engine) {
    this.engine = engine;
    this.targetPoint = { x: 0, y: 0 };
    this.bacteria = [];
    this.signalMolecules = [];

    // Initialize bacterial population
    for (let i = 0; i < 28; i++) {
      this.bacteria.push(this.createBacterium(
        (Math.random() - 0.5) * 360,
        (Math.random() - 0.5) * 240
      ));
    }

    // Signaling / quorum sensing molecules
    for (let i = 0; i < 35; i++) {
      this.signalMolecules.push({
        x: (Math.random() - 0.5) * 400,
        y: (Math.random() - 0.5) * 300,
        radius: 1.5 + Math.random() * 1.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4
      });
    }
  }

  createBacterium(x, y) {
    const isDividing = Math.random() < 0.25;
    return {
      x,
      y,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      length: 22 + Math.random() * 8,
      width: 10,
      angle: Math.random() * Math.PI * 2,
      angularVel: (Math.random() - 0.5) * 0.02,
      flagellaPhase: Math.random() * Math.PI * 2,
      isDividing,
      constriction: isDividing ? 0.4 + Math.random() * 0.4 : 0,
      colonyId: Math.floor(Math.random() * 3)
    };
  }

  update(dt, time) {
    // Update bacteria movement and flagella waves
    this.bacteria.forEach(b => {
      b.x += b.vx;
      b.y += b.vy;
      b.angle += b.angularVel;
      b.flagellaPhase += 0.2;

      // Soft boundary bounce
      if (b.x > 220) { b.vx = -Math.abs(b.vx); }
      if (b.x < -220) { b.vx = Math.abs(b.vx); }
      if (b.y > 160) { b.vy = -Math.abs(b.vy); }
      if (b.y < -160) { b.vy = Math.abs(b.vy); }

      // Division cycle
      if (b.isDividing) {
        b.constriction = Math.min(0.85, b.constriction + 0.001);
      }
    });

    // Update quorum sensing particles
    this.signalMolecules.forEach(m => {
      m.x += m.vx;
      m.y += m.vy;
      if (m.x > 250) m.x = -250;
      if (m.x < -250) m.x = 250;
      if (m.y > 180) m.y = -180;
      if (m.y < -180) m.y = 180;
    });
  }

  render(ctx, time) {
    ctx.save();

    // 1. Viscous Mucus Background Matrix
    this.drawMucusGelMatrix(ctx, time);

    // 2. Quorum Sensing & Toxin Molecules (Diffusing signal particles)
    this.drawSignalingMolecules(ctx);

    // 3. Bacteria (Pseudomonas aeruginosa rods with flagella & biofilms)
    this.drawBacteriaColony(ctx, time);

    // 4. Biofilm Exopolysaccharide (Alginate matrix) Clusters
    this.drawBiofilmSlime(ctx, time);

    // 5. Scientific Info Badge
    this.drawPathogenBadge(ctx);

    // 6. Interactive Hotspot Indicator
    this.drawHotspot(ctx, time);

    ctx.restore();
  }

  drawMucusGelMatrix(ctx, time) {
    ctx.save();
    // Warm translucent amber-yellow mucus substrate
    const bgGrad = ctx.createRadialGradient(0, 0, 50, 0, 0, 320);
    bgGrad.addColorStop(0, '#FEF9C3');
    bgGrad.addColorStop(0.6, '#FEF08A');
    bgGrad.addColorStop(1, '#FDE047');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(-350, -260, 700, 520);

    // Cross-linked mucin glycoproteins fibers (faint organic web)
    ctx.strokeStyle = 'rgba(202, 138, 4, 0.2)';
    ctx.lineWidth = 1.2;
    for (let i = -240; i <= 240; i += 45) {
      ctx.beginPath();
      ctx.moveTo(-300, i + Math.sin(time + i) * 10);
      ctx.bezierCurveTo(-100, i + 30, 100, i - 30, 300, i + Math.cos(time + i) * 10);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawBiofilmSlime(ctx, time) {
    ctx.save();
    // Exopolysaccharide (alginate) slime clusters secreted by Pseudomonas
    const slimeCenters = [
      { x: -90, y: -40, r: 75 },
      { x: 100, y: 50, r: 85 },
      { x: -40, y: 80, r: 60 }
    ];

    slimeCenters.forEach((s, idx) => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r + Math.sin(time * 1.5 + idx) * 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(101, 163, 13, 0.14)'; // soft chartreuse biofilm
      ctx.fill();

      ctx.strokeStyle = 'rgba(101, 163, 13, 0.3)';
      ctx.setLineDash([3, 5]);
      ctx.lineWidth = 1;
      ctx.stroke();
    });
    ctx.restore();
  }

  drawSignalingMolecules(ctx) {
    ctx.save();
    // Quorum sensing autoinducers & virulence factors (pyocyanin / elastase)
    ctx.fillStyle = '#059669';
    this.signalMolecules.forEach(m => {
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  drawBacteriaColony(ctx, time) {
    ctx.save();

    this.bacteria.forEach(b => {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.angle);

      // Flagella (wavy polar tail)
      ctx.strokeStyle = '#15803D';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(-b.length / 2, 0);
      for (let s = 1; s <= 5; s++) {
        const fx = -b.length / 2 - s * 5;
        const fy = Math.sin(b.flagellaPhase + s * 1.2) * 5;
        ctx.lineTo(fx, fy);
      }
      ctx.stroke();

      // Capsule shadow
      ctx.shadowColor = 'rgba(21, 128, 61, 0.2)';
      ctx.shadowBlur = 8;

      if (b.isDividing) {
        // Binary fission: constricted hourglass shape
        this.drawDividingBacterium(ctx, b);
      } else {
        // Single rod-shaped bacterium (bacillus)
        this.drawSingleBacterium(ctx, b);
      }

      ctx.restore();
    });

    ctx.restore();
  }

  drawSingleBacterium(ctx, b) {
    // Outer capsule / cell envelope
    const grad = ctx.createLinearGradient(0, -b.width / 2, 0, b.width / 2);
    grad.addColorStop(0, '#22C55E'); // bright green
    grad.addColorStop(0.5, '#16A34A');
    grad.addColorStop(1, '#15803D');

    ctx.fillStyle = grad;
    ctx.strokeStyle = '#14532D';
    ctx.lineWidth = 1.6;

    ctx.beginPath();
    ctx.roundRect(-b.length / 2, -b.width / 2, b.length, b.width, b.width / 2);
    ctx.fill();
    ctx.stroke();

    // Internal nucleoid / plasmid shimmer
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-b.length / 4, -1);
    ctx.lineTo(b.length / 4, -1);
    ctx.stroke();
  }

  drawDividingBacterium(ctx, b) {
    const halfLen = b.length / 2;
    const r = b.width / 2;
    const waist = r * (1 - b.constriction * 0.6);

    ctx.fillStyle = '#16A34A';
    ctx.strokeStyle = '#14532D';
    ctx.lineWidth = 1.6;

    ctx.beginPath();
    // Left lobe
    ctx.arc(-halfLen / 2, 0, r, Math.PI * 0.5, Math.PI * 1.5, false);
    // Upper waist pinch
    ctx.quadraticCurveTo(0, -waist, halfLen / 2, -r);
    // Right lobe
    ctx.arc(halfLen / 2, 0, r, Math.PI * 1.5, Math.PI * 0.5, false);
    // Lower waist pinch
    ctx.quadraticCurveTo(0, waist, -halfLen / 2, r);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // FtsZ division septum line
    ctx.strokeStyle = '#86EFAC';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, -waist);
    ctx.lineTo(0, waist);
    ctx.stroke();
  }

  drawPathogenBadge(ctx) {
    ctx.save();
    ctx.translate(-190, -170);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.strokeStyle = '#BBF7D0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-10, -12, 230, 68, 8);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'italic 700 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#15803D';
    ctx.fillText('Pseudomonas aeruginosa', 0, 8);

    ctx.font = '500 11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#475569';
    ctx.fillText('• Biofilm formation (Alginate EPS)', 0, 26);
    ctx.fillText('• High resistance to clearance', 0, 42);

    ctx.restore();
  }

  drawHotspot(ctx, time) {
    ctx.save();
    const hx = this.targetPoint.x;
    const hy = this.targetPoint.y;

    const pulse = 22 + Math.sin(time * 4) * 6;
    ctx.beginPath();
    ctx.arc(hx, hy, pulse, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(22, 163, 74, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(hx, hy, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#16A34A';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Callout text banner
    ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
    const label = 'Infection Alert: Summon WBC Rescue (Click)';
    const width = ctx.measureText(label).width;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
    ctx.strokeStyle = '#16A34A';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(hx - width / 2 - 12, hy + 22, width + 24, 28, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#15803D';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, hx, hy + 36);

    ctx.restore();
  }

  checkHit(worldX, worldY) {
    // Clicking anywhere in the bacterial zone advances to Stage 4
    return true;
  }
}
