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

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const raw       = document.getElementById('nombre').value.trim();
  if (!raw) { document.getElementById('nombre').focus(); return; }

  // Tomar solo el primer token (nombre de pila) y normalizar
  const firstName = raw.split(/\s+/)[0]
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // quitar tildes para comparar
    ;

  // Buscar también con tilde original por si acaso (iván)
  const firstNameRaw = raw.split(/\s+/)[0].toLowerCase();

  const code = GUEST_CODES[firstName] || GUEST_CODES[firstNameRaw];

  if (code) {
    successMsg.textContent = `Bienvenido/a, ${raw.split(/\s+/)[0]}.`;
    document.getElementById('btnVerInvitacion').href = `invitacion.html?code=${code}`;
    form.style.display = 'none';
    success.classList.add('visible');
  } else {
    errorMsg.style.display = 'block';
    form.style.display     = 'none';
  }
});
