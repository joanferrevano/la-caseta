(function () {
  var GUESTS = {
    JOAN2026:   'Joan',
    ALAN2026:   'Alan',
    ALLAN2026:  'Allan',
    AURORA2026: 'Aurora',
    FRAN2026:   'Fran',
    KEVIN2026:  'Kevin',
    MANEL2026:  'Manel',
    CHRIS2026:  'Chris',
    IVAN2026:   'Iván',
    JORGE2026:  'Jorge',
    AINHOA2026: 'Ainhoa',
    HODEI2026:  'Hodei',
  };

  var BASE_URL = 'https://joanferrevano.github.io/la-caseta/';

  var params = new URLSearchParams(window.location.search);
  var code   = (params.get('code') || '').toUpperCase();
  var nombre = GUESTS[code];
  var wrap   = document.getElementById('invWrap');

  if (!nombre) {
    wrap.innerHTML =
      '<div class="inv-invalid">' +
        '<div class="inv-invalid-icon">\u2709\uFE0E</div>' +
        '<p class="inv-invalid-title">Invitaci\u00f3n no v\u00e1lida</p>' +
        '<p class="inv-invalid-sub">El c\u00f3digo no existe o ha caducado.</p>' +
        '<a class="inv-back" href="index.html">\u2190 Volver al inicio</a>' +
      '</div>';
    return;
  }

  var verifyURL = BASE_URL + 'verificar.html?code=' + code;

  wrap.innerHTML =
    '<div class="inv-frame">' +
      '<span class="corner-br"></span>' +
      '<span class="corner-bl"></span>' +

      '<p class="inv-logotype">La Caseta</p>' +
      '<p class="inv-subtitle">Annual Summer Edition</p>' +

      '<div class="inv-rule"></div>' +

      '<p class="inv-tag">Invitaci\u00f3n</p>' +

      '<h1 class="inv-name">' + nombre + '</h1>' +
      '<div class="inv-name-rule"></div>' +

      '<p class="inv-edition">Edici\u00f3n V \u00b7 2026</p>' +
      '<p class="inv-date">10 de Julio de 2026 \u00b7 12:30h</p>' +
      '<p class="inv-location">Mas\u00eda L\'Alboret</p>' +

      '<div class="inv-rule"></div>' +

      '<div class="inv-section">' +
        '<p class="inv-section-title">Dress Code</p>' +
        '<p class="inv-note">Elegante de verano</p>' +
      '</div>' +

      '<div class="inv-section">' +
        '<p class="inv-section-title">Qu\u00e9 incluye</p>' +

        '<div class="inv-menu-block">' +
          '<p class="inv-menu-cat">Entrantes</p>' +
          '<ul class="inv-menu-items">' +
            '<li>Pan con tomate y ajoaceite + surtido de jam\u00f3n y queso</li>' +
            '<li>Patatas bravas / alioli</li>' +
            '<li>Secreto ib\u00e9rico</li>' +
          '</ul>' +
        '</div>' +

        '<div class="inv-menu-block">' +
          '<p class="inv-menu-cat">Platos principales</p>' +
          '<ul class="inv-menu-items">' +
            '<li>Brochetas de pollo con pimiento</li>' +
            '<li>Longanizas (2 por persona)</li>' +
          '</ul>' +
        '</div>' +

        '<div class="inv-menu-block">' +
          '<p class="inv-menu-cat">Bebidas</p>' +
          '<ul class="inv-menu-items">' +
            '<li>Sangr\u00eda casera \u00b7 Vino tinto \u00b7 Cerveza \u00b7 Agua \u00b7 Refrescos</li>' +
          '</ul>' +
        '</div>' +

        '<div class="inv-menu-block">' +
          '<p class="inv-menu-cat">Postre</p>' +
          '<ul class="inv-menu-items">' +
            '<li>Sand\u00eda en trozos + helado</li>' +
          '</ul>' +
        '</div>' +

        '<div class="inv-menu-block">' +
          '<p class="inv-menu-cat">Barra libre</p>' +
          '<ul class="inv-menu-items">' +
            '<li>Gin-lemon \u00b7 Ron con cola \u00b7 Vodka con naranja \u00b7 Ron Energ\u00e9tica \u00b7 Mentireta</li>' +
          '</ul>' +
        '</div>' +
      '</div>' +

      '<p class="inv-price">Todo incluido \u00b7 15\u20ac por persona</p>' +

      '<div class="inv-section">' +
        '<p class="inv-section-title">Recuerda</p>' +
        '<p class="inv-note">Trae ba\u00f1ador para disfrutar de la piscina</p>' +
      '</div>' +

      '<div class="inv-rule" style="margin-bottom:1.6rem;"></div>' +

      '<div class="inv-qr-wrap">' +
        '<p class="inv-qr-label">C\u00f3digo de acceso</p>' +
        '<div id="qr-container"></div>' +
        '<p class="inv-qr-label">' + code + '</p>' +
      '</div>' +

      '<button class="btn-pdf" id="btnPdf">\u2193 Descargar invitaci\u00f3n</button>' +

      '<p class="inv-footer">\u00a9 2026 \u00b7 La Caseta \u00b7 Annual Summer Edition</p>' +
    '</div>';

  document.getElementById('btnPdf').addEventListener('click', function () {
    var frame = document.querySelector('.inv-frame');
    document.body.classList.add('exporting');

    html2canvas(frame, {
      scale:           2,
      useCORS:         true,
      backgroundColor: '#0d1b2e',
      logging:         false,
    }).then(function (canvas) {
      var link    = document.createElement('a');
      link.download = 'invitacion-' + nombre.toLowerCase().replace(/\s+/g, '-') + '-lacaseta2026.png';
      link.href     = canvas.toDataURL('image/png');
      link.click();
      document.body.classList.remove('exporting');
    });
  });

  new QRCode(document.getElementById('qr-container'), {
    text:         verifyURL,
    width:        140,
    height:       140,
    colorDark:    '#0d1b2e',
    colorLight:   'rgba(192,154,48,0.08)',
    correctLevel: QRCode.CorrectLevel.M,
  });
})();