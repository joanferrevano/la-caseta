(() => {
  const form = document.getElementById('form-sugerencias');
  const status = form.querySelector('.sug-status');
  const submit = form.querySelector('.sug-submit');

  const show = (text, kind) => {
    status.textContent = text;
    status.dataset.kind = kind;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const apiUrl = window.CASETA_API_URL;
    if (!apiUrl) return show('Las sugerencias aún no están activadas. ¡Vuelve pronto!', 'error');

    const data = Object.fromEntries(new FormData(form));
    if (data.message.trim().length < 3) return show('Escribe tu sugerencia antes de enviarla.', 'error');

    submit.disabled = true;
    show('Enviando…', 'info');

    try {
      const res = await fetch(`${apiUrl}/api/suggestions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || 'No se pudo enviar la sugerencia.');

      form.reset();
      show('¡Gracias! Hemos guardado tu sugerencia.', 'ok');
    } catch (err) {
      show(err instanceof TypeError ? 'No hemos podido conectar. Inténtalo más tarde.' : err.message, 'error');
    } finally {
      submit.disabled = false;
    }
  });
})();
