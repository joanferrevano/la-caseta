const FORMSPREE_URL = 'https://formspree.io/f/mbdeaqry';

const GUEST_CODES = {
  joan:   'JOAN2026',
  alan:   'ALAN2026',
  allan:  'ALLAN2026',
  aurora: 'AURORA2026',
  fran:   'FRAN2026',
  kevin:  'KEVIN2026',
  manel:  'MANEL2026',
  chris:  'CHRIS2026',
  ivan:   'IVAN2026',
  iván:   'IVAN2026',
  jorge:  'JORGE2026',
  ainhoa: 'AINHOA2026',
  hodei:  'HODEI2026',
};

const form       = document.getElementById('reservaForm');
const success    = document.getElementById('resSuccess');
const successMsg = document.getElementById('successMsg');
const errorMsg   = document.getElementById('resError');

// Si ya reservó en este dispositivo, mostrar directamente el éxito
const yaReservo = localStorage.getItem('lacaseta2026_reservado');

if (yaReservo) {
  const nombre = localStorage.getItem('lacaseta2026_nombre');
  const code   = localStorage.getItem('lacaseta2026_code');
  successMsg.textContent = `Bienvenido/a, ${nombre}.`;
  document.getElementById('btnVerInvitacion').href = `invitacion.html?code=${code}`;
  form.style.display = 'none';
  success.classList.add('visible');
}

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const raw = document.getElementById('nombre').value.trim();
  if (!raw) { document.getElementById('nombre').focus(); return; }

  const firstName    = raw.split(/\s+/)[0].toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const firstNameRaw = raw.split(/\s+/)[0].toLowerCase();
  const code         = GUEST_CODES[firstName] || GUEST_CODES[firstNameRaw];
  const displayName  = raw.split(/\s+/)[0];

  if (!code) {
    errorMsg.style.display = 'block';
    form.style.display     = 'none';
    return;
  }

  // Enviar a Formspree en segundo plano
  try {
    await fetch(FORMSPREE_URL, {
      method:  'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body:    JSON.stringify({ nombre: raw, codigo: code }),
    });
  } catch (_) {
    // Si falla el fetch no bloqueamos al usuario
  }

  // Guardar en localStorage
  localStorage.setItem('lacaseta2026_reservado', 'true');
  localStorage.setItem('lacaseta2026_nombre', displayName);
  localStorage.setItem('lacaseta2026_code', code);

  successMsg.textContent = `Bienvenido/a, ${displayName}.`;
  document.getElementById('btnVerInvitacion').href = `invitacion.html?code=${code}`;
  form.style.display = 'none';
  success.classList.add('visible');
});