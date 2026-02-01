// js/talleres.js
// Renderiza la seccion de talleres desde una Google Sheet publicada (CSV)
// o usa un fallback local.

(function () {
  const container = document.querySelector('[data-talleres-list]');
  if (!container) return;

  const cfg = window.SITE_CONFIG || {};
  const csvUrl = (cfg.talleresSheetCsv || '').trim();

  const fallback = [
    { fecha: "Semanal", tema: "Fondos Comunes de Inversion", tipo: "Taller por Teams" },
    { fecha: "Semanal", tema: "Renta variable: CEDEARs y Acciones", tipo: "Taller por Teams" },
    { fecha: "Semanal", tema: "Obligaciones Negociables y renta fija", tipo: "Taller por Teams" },
    { fecha: "Semanal", tema: "Como armar tu cartera de inversion", tipo: "Taller por Teams" },
    { fecha: "Semanal", tema: "Tutoriales cortos: alertas, reportes, depositos, cupones", tipo: "Mini tutorial" }
  ];

  function escapeHtml(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function render(items, note) {
    const html = items
      .slice(0, 6)
      .map((t) => {
        return (
          `<div class="workshop-card">` +
          `<p class="workshop-kicker">${escapeHtml(t.tipo || 'Taller')}</p>` +
          `<h3 class="workshop-title">${escapeHtml(t.tema || '')}</h3>` +
          `<p class="workshop-date">${escapeHtml(t.fecha || '')}</p>` +
          `</div>`
        );
      })
      .join('');

    container.innerHTML = html;

    const noteEl = document.querySelector('[data-talleres-note]');
    if (noteEl) noteEl.textContent = note || '';
  }

  function parseCsv(text) {
    // CSV simple: fecha, tema, tipo (sin comillas complejas)
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length <= 1) return [];

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const idxFecha = headers.indexOf('fecha');
    const idxTema = headers.indexOf('tema');
    const idxTipo = headers.indexOf('tipo');

    return lines.slice(1).map((line) => {
      const cols = line.split(',');
      return {
        fecha: cols[idxFecha] ? cols[idxFecha].trim() : '',
        tema: cols[idxTema] ? cols[idxTema].trim() : '',
        tipo: cols[idxTipo] ? cols[idxTipo].trim() : ''
      };
    });
  }

  async function init() {
    if (!csvUrl) {
      render(fallback, '');
      return;
    }

    try {
      const res = await fetch(csvUrl, { cache: 'no-store' });
      if (!res.ok) throw new Error('No se pudo cargar el CSV');
      const text = await res.text();
      const items = parseCsv(text).filter((t) => t.tema);
      if (!items.length) throw new Error('CSV vacio');
      render(items, 'Actualizado automaticamente desde Google Sheets.');
    } catch (e) {
      console.error(e);
      render(fallback, 'No se pudo cargar la planilla. Mostrando ejemplos.');
    }
  }

  init();
})();
