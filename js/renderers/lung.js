/**
 * Stage 1 Renderer: Macro Pulmonary Anatomy (The Lungs)
 * Renders stylized medical vector lungs, trachea with cartilage rings, 
 * bronchial arborization, breathing rhythm, and zoom hotspot.
 */
class LungRenderer {
  constructor(engine) {
    this.engine = engine;
    this.targetPoint = { x: 80, y: 30 }; // bronchial branch focal target
    this.hovered = false;
  }

  update(dt, time) {
    // Breathing scale oscillation
    this.breathScale = 1.0 + Math.sin(time * 1.8) * 0.024;
    this.breathTranslateY = Math.sin(time * 1.8) * 3;
  }

  render(ctx, time) {
    ctx.save();
    ctx.translate(0, this.breathTranslateY);

    // 1. Draw subtle thoracic rib silhouette cage in background (minimalist gray)
    this.drawThoracicOutline(ctx);

    // 2. Draw Lung Lobes (Soft organic shapes, stylized medical pink/rose)
    this.drawLungs(ctx, time);

    // 3. Draw Trachea and Cartilage Rings
    this.drawTrachea(ctx);

    // 4. Draw Bronchial Tree arborization
    this.drawBronchialTree(ctx);

    // 5. Draw Interactive Airway Focus Indicator (Pulsing Hotspot)
    this.drawHotspot(ctx, time);

    // 6. Draw Clean Anatomical Labels
    this.drawLabels(ctx);

    ctx.restore();
  }

  drawThoracicOutline(ctx) {
    ctx.save();
    ctx.strokeStyle = 'rgba(226, 232, 240, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 6]);

    // Faint ribs
    for (let i = -140; i <= 140; i += 40) {
      const curve = Math.abs(i) * 0.2;
      ctx.beginPath();
      ctx.moveTo(-180, i);
      ctx.quadraticCurveTo(-100, i - 15 - curve, -40, i - 10);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(180, i);
      ctx.quadraticCurveTo(100, i - 15 - curve, 40, i - 10);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawLungs(ctx, time) {
    ctx.save();
    ctx.scale(this.breathScale, this.breathScale);

    // Drop shadow
    ctx.shadowColor = 'rgba(15, 23, 42, 0.06)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 12;

    // Gradient fills for soft 3D biological feel
    const gradRight = ctx.createLinearGradient(-150, -100, -20, 160);
    gradRight.addColorStop(0, '#FFE4E6');   // soft rose
    gradRight.addColorStop(0.5, '#FECDD3');
    gradRight.addColorStop(1, '#FDA4AF');

    const gradLeft = ctx.createLinearGradient(20, -100, 150, 160);
    gradLeft.addColorStop(0, '#FFE4E6');
    gradLeft.addColorStop(0.5, '#FECDD3');
    gradLeft.addColorStop(1, '#FDA4AF');

    // Right Lung (3 lobes: superior, middle, inferior)
    ctx.fillStyle = gradRight;
    ctx.strokeStyle = '#F43F5E';
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    // Apex
    ctx.moveTo(-60, -110);
    // Costal surface (lateral curve)
    ctx.bezierCurveTo(-150, -80, -175, 50, -165, 120);
    // Base (diaphragmatic surface)
    ctx.bezierCurveTo(-150, 150, -70, 145, -50, 130);
    // Medial surface & hilum
    ctx.bezierCurveTo(-35, 110, -35, -20, -45, -70);
    ctx.bezierCurveTo(-48, -95, -52, -108, -60, -110);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Subtle fissure lines for lobes
    ctx.save();
    ctx.strokeStyle = 'rgba(225, 29, 72, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-165, 30);
    ctx.quadraticCurveTo(-100, 45, -42, 20); // oblique fissure
    ctx.moveTo(-160, -15);
    ctx.quadraticCurveTo(-100, -5, -44, -10); // horizontal fissure
    ctx.stroke();
    ctx.restore();

    // Left Lung (2 lobes + cardiac notch for heart)
    ctx.fillStyle = gradLeft;
    ctx.strokeStyle = '#F43F5E';
    ctx.beginPath();
    // Apex
    ctx.moveTo(60, -110);
    // Costal surface
    ctx.bezierCurveTo(150, -80, 175, 50, 165, 120);
    // Base
    ctx.bezierCurveTo(150, 150, 70, 145, 50, 130);
    // Cardiac notch indentation
    ctx.bezierCurveTo(25, 90, 25, 20, 45, -20);
    ctx.bezierCurveTo(35, -70, 48, -95, 60, -110);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Left oblique fissure
    ctx.save();
    ctx.strokeStyle = 'rgba(225, 29, 72, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(165, 30);
    ctx.quadraticCurveTo(100, 45, 35, 35);
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }

  drawTrachea(ctx) {
    ctx.save();
    // Trachea tube
    const tracheaGrad = ctx.createLinearGradient(-18, 0, 18, 0);
    tracheaGrad.addColorStop(0, '#E2E8F0');
    tracheaGrad.addColorStop(0.5, '#F8FAFC');
    tracheaGrad.addColorStop(1, '#CBD5E1');

    ctx.fillStyle = tracheaGrad;
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 2;

    // Main trachea stem
    ctx.beginPath();
    ctx.moveTo(-16, -170);
    ctx.lineTo(16, -170);
    ctx.lineTo(16, -45);
    ctx.lineTo(-16, -45);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Tracheal cartilage C-rings
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 2;
    for (let y = -160; y <= -50; y += 12) {
      ctx.beginPath();
      ctx.arc(0, y, 15, -0.2, Math.PI + 0.2, false);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawBronchialTree(ctx) {
    ctx.save();
    ctx.strokeStyle = '#475569';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Carina bifurcation (-16, -45) & (16, -45)
    // Left Main Bronchus
    ctx.lineWidth = 11;
    ctx.beginPath();
    ctx.moveTo(0, -45);
    ctx.quadraticCurveTo(30, -30, 65, -10);
    ctx.stroke();

    // Right Main Bronchus (shorter, wider, steeper)
    ctx.beginPath();
    ctx.moveTo(0, -45);
    ctx.quadraticCurveTo(-25, -28, -60, -10);
    ctx.stroke();

    // Secondary & Tertiary branching (Right lung)
    this.drawBranch(ctx, -60, -10, -110, -40, 6);
    this.drawBranch(ctx, -60, -10, -120, 25, 7);
    this.drawBranch(ctx, -60, -10, -90, 80, 6);

    this.drawBranch(ctx, -110, -40, -135, -60, 3.5);
    this.drawBranch(ctx, -120, 25, -145, 10, 3.5);
    this.drawBranch(ctx, -120, 25, -140, 50, 3.5);
    this.drawBranch(ctx, -90, 80, -110, 115, 3.5);

    // Left lung branching
    this.drawBranch(ctx, 65, -10, 115, -35, 6);
    this.drawBranch(ctx, 65, -10, 110, 35, 6.5);
    this.drawBranch(ctx, 65, -10, 85, 85, 6);

    this.drawBranch(ctx, 115, -35, 140, -55, 3.5);
    this.drawBranch(ctx, 110, 35, 145, 20, 3.5);
    this.drawBranch(ctx, 110, 35, 135, 60, 3.5);
    this.drawBranch(ctx, 85, 85, 105, 115, 3.5);

    ctx.restore();
  }

  drawBranch(ctx, x1, y1, x2, y2, width) {
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    const midX = (x1 + x2) / 2 + (Math.sin(x1) * 6);
    const midY = (y1 + y2) / 2;
    ctx.quadraticCurveTo(midX, midY, x2, y2);
    ctx.stroke();
  }

  drawHotspot(ctx, time) {
    ctx.save();
    const hx = this.targetPoint.x;
    const hy = this.targetPoint.y;

    // Expanding beacon rings
    const pulseRadius = 24 + Math.sin(time * 4) * 8;
    const alpha = 0.4 + Math.sin(time * 4) * 0.25;

    ctx.beginPath();
    ctx.arc(hx, hy, pulseRadius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(2, 132, 199, ${alpha})`;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(hx, hy, pulseRadius * 1.5, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(2, 132, 199, ${alpha * 0.4})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Target crosshair center
    ctx.beginPath();
    ctx.arc(hx, hy, 9, 0, Math.PI * 2);
    ctx.fillStyle = '#0284C7';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Callout text banner floating beside hotspot
    ctx.save();
    ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#0F172A';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    const textX = hx + 28;
    const textY = hy;
    const label = 'Bronchial Airway (Click to zoom)';
    const textWidth = ctx.measureText(label).width;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(textX - 8, textY - 14, textWidth + 16, 28, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#0284C7';
    ctx.fillText(label, textX, textY);
    ctx.restore();

    ctx.restore();
  }

  drawLabels(ctx) {
    ctx.save();
    ctx.font = '600 12px "JetBrains Mono", monospace';
    ctx.fillStyle = '#64748B';

    // Trachea
    ctx.fillText('TRACHEA', -110, -150);
    this.drawPointerLine(ctx, -50, -150, -18, -140);

    // Right Lung
    ctx.fillText('RIGHT LUNG (3 Lobes)', -190, -70);
    this.drawPointerLine(ctx, -80, -70, -120, -50);

    // Left Lung
    ctx.fillText('LEFT LUNG (2 Lobes)', 130, -70);
    this.drawPointerLine(ctx, 125, -70, 80, -50);

    ctx.restore();
  }

  drawPointerLine(ctx, x1, y1, x2, y2) {
    ctx.save();
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x2, y2, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = '#94A3B8';
    ctx.fill();
    ctx.restore();
  }

  checkHit(worldX, worldY) {
    // Check if clicked near target or lung
    const dx = worldX - this.targetPoint.x;
    const dy = worldY - this.targetPoint.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 60) return true;

    // Also clicking broadly on lung lobes
    if (Math.abs(worldX) < 160 && Math.abs(worldY) < 140) {
      return true;
    }
    return false;
  }
}
