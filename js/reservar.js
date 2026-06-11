const form       = document.getElementById('reservaForm');
const success    = document.getElementById('resSuccess');
const successMsg = document.getElementById('successMsg');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value.trim();
  if (!nombre) { document.getElementById('nombre').focus(); return; }
  generateInvitation(nombre);
  try {
    /*
    fetch("https://formspree.io/f/mbdeaqry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: nombre,
        fecha_reserva: new Date().toLocaleDateString('es-ES'),
        evento: "La Caseta V · 10 Julio 2026"
      })
    });
    */
  } catch (err) {
    // silent fail
  }
  successMsg.textContent = `Bienvenido/a, ${nombre}.`;
  form.style.display = 'none';
  success.classList.add('visible');
});

function generateInvitation(nombre) {
  const W = 1200, H = 800;
  const canvas = document.createElement('canvas');
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Background
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#111827');
  bg.addColorStop(1, '#1F2937');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const gold    = '#D4B483';
  const goldDim = 'rgba(212,180,131,0.2)';

  // Corner ornaments
  ctx.strokeStyle = goldDim;
  ctx.lineWidth   = 1;
  [
    [[60,60],[160,60]], [[60,60],[60,160]],
    [[W-60,60],[W-160,60]], [[W-60,60],[W-60,160]],
    [[60,H-60],[160,H-60]], [[60,H-60],[60,H-160]],
    [[W-60,H-60],[W-160,H-60]], [[W-60,H-60],[W-60,H-160]],
  ].forEach(([[x1,y1],[x2,y2]]) => {
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
  });

  // Top rule
  ctx.beginPath(); ctx.moveTo(120, 110); ctx.lineTo(W-120, 110); ctx.stroke();

  // Logotype
  ctx.fillStyle  = gold;
  ctx.font       = '500 14px Inter, sans-serif';
  ctx.textAlign  = 'center';
  ctx.fillText('LA CASETA', W/2, 90);

  ctx.fillStyle = 'rgba(212,180,131,0.55)';
  ctx.font      = '400 11px Inter, sans-serif';
  ctx.fillText('ANNUAL SUMMER EDITION', W/2, 145);

  // Centre divider
  ctx.strokeStyle = goldDim;
  ctx.beginPath(); ctx.moveTo(W/2-30, 165); ctx.lineTo(W/2+30, 165); ctx.stroke();

  ctx.fillStyle = 'rgba(212,180,131,0.45)';
  ctx.font      = '400 10px Inter, sans-serif';
  ctx.fillText('INVITACIÓN', W/2, 210);

  // Guest name
  ctx.fillStyle = '#F8F6F1';
  ctx.font      = 'italic 600 72px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(nombre, W/2, 320);

  // Line under name
  ctx.strokeStyle = 'rgba(212,180,131,0.35)';
  const nameW = Math.min(ctx.measureText(nombre).width + 80, W - 240);
  ctx.beginPath();
  ctx.moveTo(W/2 - nameW/2, 345);
  ctx.lineTo(W/2 + nameW/2, 345);
  ctx.stroke();

  // Edition title
  ctx.fillStyle = gold;
  ctx.font      = '600 36px "Cormorant Garamond", Georgia, serif';
  ctx.fillText('Edición V · 2026', W/2, 420);

  // Date & location
  ctx.fillStyle = 'rgba(248,246,241,0.7)';
  ctx.font      = '300 15px Inter, sans-serif';
  ctx.fillText('10 DE JULIO DE 2026', W/2, 475);

  ctx.fillStyle = 'rgba(212,180,131,0.6)';
  ctx.font      = '300 13px Inter, sans-serif';
  ctx.fillText("MASÍA L'ALBORET", W/2, 510);

  // Bottom rule
  ctx.strokeStyle = goldDim;
  ctx.beginPath(); ctx.moveTo(120, H-110); ctx.lineTo(W-120, H-110); ctx.stroke();

  ctx.fillStyle = 'rgba(212,180,131,0.3)';
  ctx.font      = '300 10px Inter, sans-serif';
  ctx.fillText('© 2026 · LA CASETA · ANNUAL SUMMER EDITION', W/2, H-80);

  // Download
  const link      = document.createElement('a');
  link.download   = `invitacion-la-caseta-2026-${nombre.replace(/\s+/g, '-').toLowerCase()}.png`;
  link.href       = canvas.toDataURL('image/png');
  link.click();
}
