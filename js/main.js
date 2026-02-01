// js/main.js
// Año automático, scroll suave, animaciones, envío de formulario vía fetch (Formspree)
// y lógica del test del inversor.

document.addEventListener("DOMContentLoaded", function () {
  const cfg = window.SITE_CONFIG || {};
  const waBase = cfg.whatsappNumberE164 ? ("https://wa.me/" + cfg.whatsappNumberE164) : "";

  // 1) Año automático en el footer
  const yearSpans = document.querySelectorAll("#anio-actual");
  const currentYear = new Date().getFullYear();
  yearSpans.forEach((span) => (span.textContent = currentYear));

  // Boton flotante a WhatsApp
  if (waBase) {
    const waBtn = document.createElement('a');
    waBtn.className = 'whatsapp-float';
    waBtn.href = waBase + '?text=' + encodeURIComponent('Hola ' + (cfg.nombre || 'Dalma') + '! Quisiera hacer una consulta.');
    waBtn.target = '_blank';
    waBtn.rel = 'noopener';
    waBtn.setAttribute('aria-label', 'Escribir por WhatsApp');
    waBtn.innerHTML = `
      <span class="whatsapp-icon" aria-hidden="true">
        <span class="whatsapp-badge" aria-hidden="true">1</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false" aria-hidden="true">
          <path fill="white" d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"></path>
        </svg>
      </span>
      <span class="whatsapp-bubble">Necesitas Ayuda?</span>
    `;
    document.body.appendChild(waBtn);
  }

  // 2) Scroll suave para links internos
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (event) {
      const targetId = this.getAttribute("href").slice(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        event.preventDefault();
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // 3) Animaciones suaves al hacer scroll
  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("reveal-visible"));
  }

  // 4) Envío del formulario de contacto usando fetch (pensado para Formspree)
  const contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) {
    // Configurar endpoint desde config.js (así se puede cambiar sin tocar el HTML)
    if ((!contactForm.getAttribute("action") || contactForm.getAttribute("action").trim()==="") && cfg.formEndpoint) {
      contactForm.setAttribute("action", cfg.formEndpoint);
    }

    const statusEl = contactForm.querySelector(".form-status");

    contactForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      statusEl.textContent = "";

      const formData = new FormData(contactForm);

      try {
        const response = await fetch(contactForm.action, {
          method: contactForm.method || "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          contactForm.reset();
          statusEl.textContent = "¡Gracias! Tu consulta fue enviada correctamente.";
          statusEl.style.color = "#16a34a";
        } else {
          statusEl.textContent =
            "Ocurrió un error al enviar el formulario. Por favor, intentá nuevamente.";
          statusEl.style.color = "#b91c1c";
        }
      } catch (error) {
        console.error(error);
        statusEl.textContent =
          "No se pudo enviar el formulario. Revisá tu conexión o probá más tarde.";
        statusEl.style.color = "#b91c1c";
      }
    });
  }

  // 5) Lógica del test de inversor
  const testContainer = document.getElementById("test-inversor");
  if (testContainer) {
    const preguntas = [
      {
        texto:
          "¿Cómo definís tu conocimiento sobre las distintas alternativas de inversión en el mercado de capitales?",
        opciones: [
          { titulo: "Nulo", descripcion: "No conozco ni realicé inversiones.", valor: 1 },
          {
            titulo: "Mínimo",
            descripcion: "Escuché sobre inversiones pero casi no operé.",
            valor: 2,
          },
          {
            titulo: "Intermedio",
            descripcion: "Realicé algunas inversiones y entiendo los riesgos básicos.",
            valor: 3,
          },
          {
            titulo: "Avanzado",
            descripcion: "Tengo experiencia invertiendo en varios instrumentos.",
            valor: 4,
          },
          {
            titulo: "Experto",
            descripcion: "Trabajo o trabajé en finanzas / inversiones.",
            valor: 5,
          },
        ],
      },
      {
        texto: "¿Cuánta experiencia tenés invirtiendo?",
        opciones: [
          { titulo: "Ninguna", descripcion: "Nunca invertí de forma consciente.", valor: 1 },
          {
            titulo: "Mínima",
            descripcion: "Usé plazos fijos o productos muy conservadores.",
            valor: 2,
          },
          {
            titulo: "Intermedia",
            descripcion: "Invertí en fondos comunes o bonos.",
            valor: 3,
          },
          {
            titulo: "Avanzada",
            descripcion: "Compro y vendo acciones / bonos con cierta frecuencia.",
            valor: 4,
          },
          {
            titulo: "Muy alta",
            descripcion: "Opero productos complejos y derivados.",
            valor: 5,
          },
        ],
      },
      {
        texto: "Si tus inversiones bajaran un 15% en poco tiempo, ¿qué harías?",
        opciones: [
          {
            titulo: "Salgo inmediatamente",
            descripcion: "Prefiero evitar cualquier pérdida adicional.",
            valor: 1,
          },
          {
            titulo: "Reduzco posición",
            descripcion: "Vendo una parte para bajar el riesgo.",
            valor: 2,
          },
          {
            titulo: "Mantengo",
            descripcion: "Espero a ver cómo evoluciona.",
            valor: 3,
          },
          {
            titulo: "Aprovecho",
            descripcion: "Aporto más capital si considero que es una oportunidad.",
            valor: 4,
          },
          {
            titulo: "Aumento fuerte",
            descripcion: "Aprovecho al máximo precios bajos.",
            valor: 5,
          },
        ],
      },
      {
        texto: "¿Por cuánto tiempo estarías dispuesto a mantener una inversión?",
        opciones: [
          { titulo: "Menos de 1 año", descripcion: "Prefiero ver resultados rápido.", valor: 1 },
          {
            titulo: "Entre 1 y 3 años",
            descripcion: "Puedo esperar un poco, pero no demasiado.",
            valor: 2,
          },
          {
            titulo: "Entre 3 y 7 años",
            descripcion: "Estoy dispuesto a esperar varios años.",
            valor: 3,
          },
          {
            titulo: "Más de 7 años",
            descripcion: "Pienso a muy largo plazo.",
            valor: 4,
          },
          {
            titulo: "Horizonte abierto",
            descripcion:
              "No tengo problema en mantener mientras la estrategia tenga sentido.",
            valor: 5,
          },
        ],
      },
      {
        texto: "¿Qué buscás principalmente al invertir?",
        opciones: [
          { titulo: "Preservar capital", descripcion: "Prioridad absoluta: no perder.", valor: 1 },
          {
            titulo: "Superar levemente la inflación",
            descripcion: "Acepto algo de riesgo para ganarle un poco a la inflación.",
            valor: 2,
          },
          {
            titulo: "Equilibrio riesgo/retorno",
            descripcion: "Busco un balance entre seguridad y crecimiento.",
            valor: 3,
          },
          {
            titulo: "Crecimiento agresivo",
            descripcion: "Acepto volatilidad para lograr mayor rendimiento.",
            valor: 4,
          },
          {
            titulo: "Máximo rendimiento posible",
            descripcion: "Estoy dispuesto a asumir riesgos altos.",
            valor: 5,
          },
        ],
      },
    ];

    const totalPasos = preguntas.length;
    let pasoActual = 0;
    let puntajeTotal = 0;

    const pasoActualSpan = document.getElementById("test-paso-actual");
    const totalPasosSpan = document.getElementById("test-total-pasos");
    const preguntaTextoEl = document.getElementById("test-pregunta-texto");
    const opcionesEl = document.getElementById("test-opciones");
    const botonContinuar = document.getElementById("test-boton-continuar");
    const progressSteps = document.querySelectorAll(".test-progress-step");

    const seccionResultado = document.getElementById("test-resultado");
    const resultadoEtiqueta = document.getElementById("test-resultado-etiqueta");
    const resultadoDescripcion = document.getElementById("test-resultado-descripcion");

    totalPasosSpan.textContent = totalPasos.toString();
    let opcionSeleccionadaValor = null;

    function renderPaso() {
      const pregunta = preguntas[pasoActual];
      pasoActualSpan.textContent = (pasoActual + 1).toString();
      preguntaTextoEl.textContent = pregunta.texto;

      progressSteps.forEach((step, index) => {
        step.classList.toggle("test-progress-step--active", index <= pasoActual);
      });

      opcionesEl.innerHTML = "";
      opcionSeleccionadaValor = null;

      pregunta.opciones.forEach((opcion) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "test-option";
        btn.innerHTML =
          "<div class='test-option-title'>" +
          opcion.titulo +
          "</div><p class='test-option-description'>" +
          opcion.descripcion +
          "</p>";

        btn.addEventListener("click", function () {
          opcionesEl.querySelectorAll(".test-option").forEach((el) => {
            el.classList.remove("test-option--selected");
          });
          btn.classList.add("test-option--selected");
          opcionSeleccionadaValor = opcion.valor;
        });

        opcionesEl.appendChild(btn);
      });
    }

    function mostrarResultado() {
      const promedio = puntajeTotal / totalPasos;
      let perfil = "";
      let descripcion = "";

      if (promedio < 2) {
        perfil = "Conservador";
        descripcion =
          "Preferís cuidar tu capital por encima de todo. Las caídas de mercado te generan mucha incomodidad, " +
          "por lo que suelen funcionar mejor estrategias con instrumentos de menor volatilidad.";
      } else if (promedio < 3.5) {
        perfil = "Moderado";
        descripcion =
          "Buscás un equilibrio entre seguridad y crecimiento. Estás dispuesto a tolerar ciertas variaciones en el valor " +
          "de tus inversiones si eso te permite obtener mejores resultados en el mediano plazo.";
      } else {
        perfil = "Agresivo";
        descripcion =
          "Tenés alta tolerancia al riesgo y buscás maximizar el rendimiento en el largo plazo, aceptando una mayor volatilidad " +
          "y posibles caídas temporales en el camino.";
      }

      resultadoEtiqueta.textContent =
        "Según tus respuestas, tu perfil inicial es: " + perfil + ".";
      resultadoDescripcion.textContent = descripcion;

      // CTA a WhatsApp
      const cta = document.getElementById("test-cta-whatsapp");
      if (cta && waBase) {
        const msg = encodeURIComponent("Hola " + (cfg.nombre || "") + "! Hice el test del inversor y mi perfil inicial es: " + perfil + ". Me gustaria agendar una reunion para armar un plan.");
        cta.href = waBase + "?text=" + msg;
      }



      seccionResultado.style.display = "block";
      seccionResultado.scrollIntoView({ behavior: "smooth" });
    }

    botonContinuar.addEventListener("click", function () {
      if (opcionSeleccionadaValor == null) {
        alert("Elegí una de las opciones antes de continuar.");
        return;
      }

      puntajeTotal += opcionSeleccionadaValor;

      if (pasoActual < totalPasos - 1) {
        pasoActual += 1;
        renderPaso();
      } else {
        testContainer.style.display = "none";
        mostrarResultado();
      }
    });

    renderPaso();
  }
});
