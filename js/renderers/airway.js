/**
 * Stage 2 Renderer: Bronchial Airway Interior & Mucus Secretion
 * Illustrates epithelial cells, ciliated apical border, goblet cells,
 * defective CFTR ion transport leading to dehydrated, thick, sticky mucus.
 */
class AirwayRenderer {
  constructor(engine) {
    this.engine = engine;
    this.targetPoint = { x: 0, y: -25 }; // Focus on the thick mucus layer
    this.ciliaCount = 38;
    this.particles = [];

    // Ambient floating trapped debris/microbes in mucus
    for (let i = 0; i < 24; i++) {
      this.particles.push({
        x: (Math.random() - 0.5) * 450,
        y: -50 + Math.random() * 45,
        radius: 1.5 + Math.random() * 2,
        speed: 0.1 + Math.random() * 0.2,
        angle: Math.random() * Math.PI * 2
      });
    }
  }

  update(dt, time) {
    // Drifting particles trapped in stagnant mucus
    this.particles.forEach(p => {
      p.x += Math.cos(p.angle) * p.speed * 0.3;
      p.y += Math.sin(p.angle) * p.speed * 0.2;
      p.angle += (Math.random() - 0.5) * 0.05;
      if (p.x > 240) p.x = -240;
      if (p.x < -240) p.x = 240;
    });
  }

  render(ctx, time) {
    ctx.save();

    // 1. Airway Lumen Background (Clean sterile airway air space)
    this.drawLumenBackground(ctx);

    // 2. Basal Lamina & Submucosa / Smooth Muscle base
    this.drawBasalLamina(ctx);

    // 3. Columnar Epithelial & Goblet Cells
    this.drawEpithelialCells(ctx, time);

    // 4. Paralyzed / Matted Cilia (Crushed by thick mucus)
    this.drawCilia(ctx, time);

    // 5. Thick, Viscous Dehydrated Mucus Layer
    this.drawMucusLayer(ctx, time);

    // 6. CFTR Defect Callout Box
    this.drawCftrCallout(ctx);

    // 7. Interactive Hotspot Indicator
    this.drawHotspot(ctx, time);

    // 8. Scientific Labels
    this.drawLabels(ctx);

    ctx.restore();
  }

  drawLumenBackground(ctx) {
    ctx.save();
    // Gentle gradient representing the open air passage
    const lumenGrad = ctx.createLinearGradient(0, -180, 0, -60);
    lumenGrad.addColorStop(0, '#FFFFFF');
    lumenGrad.addColorStop(1, '#F1F5F9');
    ctx.fillStyle = lumenGrad;
    ctx.fillRect(-300, -220, 600, 160);
    ctx.restore();
  }

  drawBasalLamina(ctx) {
    ctx.save();
    // Smooth muscle & connective tissue underneath
    ctx.fillStyle = '#FFE4E6';
    ctx.fillRect(-280, 110, 560, 80);

    // Basement membrane stripe
    ctx.strokeStyle = '#F43F5E';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-280, 110);
    ctx.lineTo(280, 110);
    ctx.stroke();

    ctx.restore();
  }

  drawEpithelialCells(ctx, time) {
    ctx.save();
    const cellWidth = 36;
    const startX = -260;
    const cellHeight = 90;
    const cellTopY = 20;

    for (let i = 0; i < 14; i++) {
      const cx = startX + i * cellWidth;
      const isGoblet = (i === 3 || i === 8 || i === 12);

      if (isGoblet) {
        // Goblet cell (mucus-producing cell)
        ctx.fillStyle = '#FEF3C7'; // pale gold
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        ctx.moveTo(cx, 110);
        ctx.quadraticCurveTo(cx - 6, 60, cx - 2, cellTopY + 5);
        ctx.lineTo(cx + cellWidth + 2, cellTopY + 5);
        ctx.quadraticCurveTo(cx + cellWidth + 6, 60, cx + cellWidth, 110);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Goblet cell mucin secretory granules
        ctx.fillStyle = '#FBBF24';
        for (let g = 0; g < 6; g++) {
          const gx = cx + 8 + (g % 3) * 8;
          const gy = cellTopY + 16 + Math.floor(g / 3) * 12;
          ctx.beginPath();
          ctx.arc(gx, gy, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Basal nucleus
        ctx.fillStyle = '#B45309';
        ctx.beginPath();
        ctx.ellipse(cx + cellWidth / 2, 92, 7, 10, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Ciliated columnar epithelial cell
        ctx.fillStyle = '#F8FAFC';
        ctx.strokeStyle = '#94A3B8';
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        ctx.roundRect(cx + 1, cellTopY, cellWidth - 2, cellHeight, 4);
        ctx.fill();
        ctx.stroke();

        // Cell nucleus
        ctx.fillStyle = '#64748B';
        ctx.beginPath();
        ctx.ellipse(cx + cellWidth / 2, 72, 7, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        // Apical border highlight
        ctx.strokeStyle = '#0284C7';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx + 2, cellTopY);
        ctx.lineTo(cx + cellWidth - 2, cellTopY);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  drawCilia(ctx, time) {
    ctx.save();
    // In CF, cilia are compressed and immobilized by dense dehydrated mucus
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 1.8;
    ctx.lineCap = 'round';

    const cellTopY = 20;
    const startX = -260;

    for (let i = 0; i < 90; i++) {
      const cx = startX + i * 5.8;
      // Skip goblet cell apical mouths
      const colIdx = Math.floor(i / 6.2);
      if (colIdx === 3 || colIdx === 8 || colIdx === 12) continue;

      // Flattened, bent, distressed cilia motion (struggling to beat)
      const bend = Math.sin(time * 2 + i * 0.4) * 3;
      const height = 14 + Math.sin(i) * 2;

      ctx.beginPath();
      ctx.moveTo(cx, cellTopY);
      ctx.quadraticCurveTo(cx + 4 + bend, cellTopY - height * 0.5, cx + 8 + bend * 1.5, cellTopY - height + 3);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawMucusLayer(ctx, time) {
    ctx.save();
    // Thick, viscous, dehydrated mucus blanket (Amber/chartreuse jelly-like layer)
    const mucusGrad = ctx.createLinearGradient(0, -65, 0, 15);
    mucusGrad.addColorStop(0, 'rgba(217, 119, 6, 0.2)');
    mucusGrad.addColorStop(0.3, 'rgba(234, 179, 8, 0.45)');
    mucusGrad.addColorStop(0.7, 'rgba(202, 138, 4, 0.65)');
    mucusGrad.addColorStop(1, 'rgba(180, 83, 9, 0.7)');

    ctx.fillStyle = mucusGrad;
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.moveTo(-280, 18);

    // Upper wavy boundary of the thick viscous layer
    ctx.lineTo(-280, -55);
    for (let x = -280; x <= 280; x += 35) {
      const wave = Math.sin(x * 0.03 + time * 1.2) * 4;
      ctx.lineTo(x, -55 + wave);
    }
    ctx.lineTo(280, 18);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Subtle internal viscous strands in mucus
    ctx.strokeStyle = 'rgba(180, 83, 9, 0.35)';
    ctx.lineWidth = 1.5;
    for (let row = -45; row <= -5; row += 16) {
      ctx.beginPath();
      for (let x = -270; x <= 270; x += 25) {
        const offset = Math.sin(x * 0.05 + time * 0.8 + row) * 3;
        if (x === -270) ctx.moveTo(x, row + offset);
        else ctx.lineTo(x, row + offset);
      }
      ctx.stroke();
    }

    // Draw trapped bacteria / particles inside mucus
    this.particles.forEach(p => {
      // Bacteria rod shape (greenish-amber)
      ctx.fillStyle = '#15803D';
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.radius * 2, p.radius, p.angle, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  drawCftrCallout(ctx) {
    ctx.save();
    // Modern informative badge on CFTR ion channel defect
    ctx.translate(140, -140);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-100, -35, 200, 70, 8);
    ctx.fill();
    ctx.stroke();

    // Mini status dot
    ctx.fillStyle = '#DC2626';
    ctx.beginPath();
    ctx.arc(-82, -18, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = '700 11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#DC2626';
    ctx.textAlign = 'left';
    ctx.fillText('CFTR CHANNEL DEFECT', -72, -15);

    ctx.font = '500 11.5px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText('✕ Impaired Cl⁻ & HCO₃⁻ secretion', -82, 4);
    ctx.fillText('↑ Hyper-absorption of Na⁺ & H₂O', -82, 20);

    ctx.restore();
  }

  drawHotspot(ctx, time) {
    ctx.save();
    const hx = this.targetPoint.x;
    const hy = this.targetPoint.y;

    const pulse = 20 + Math.sin(time * 4) * 6;
    ctx.beginPath();
    ctx.arc(hx, hy, pulse, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(217, 119, 6, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(hx, hy, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#D97706';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Callout badge
    ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
    const label = 'Mucus Layer: Bacterial Breeding Ground (Click)';
    const width = ctx.measureText(label).width;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(hx - width / 2 - 10, hy - 40, width + 20, 26, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#B45309';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, hx, hy - 27);

    ctx.restore();
  }

  drawLabels(ctx) {
    ctx.save();
    ctx.font = '600 11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#64748B';

    // Airway Lumen
    ctx.fillText('AIRWAY LUMEN (Open Airway)', -260, -180);

    // Mucus Blanket
    ctx.fillStyle = '#B45309';
    ctx.fillText('VISCOUS MUCUS BLANKET', -260, -70);

    // Cilia
    ctx.fillStyle = '#0284C7';
    ctx.fillText('CRUSHED CILIA LAYER', -260, 5);

    // Epithelial layer
    ctx.fillStyle = '#475569';
    ctx.fillText('EPITHELIAL TISSUE', -260, 130);

    ctx.restore();
  }

  checkHit(worldX, worldY) {
    // Click on mucus layer triggers next zoom
    if (worldY >= -90 && worldY <= 40 && Math.abs(worldX) < 280) {
      return true;
    }
    return false;
  }
}
