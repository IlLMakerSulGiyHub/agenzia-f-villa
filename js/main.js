/**
 * AGENZIA F. VILLA - Configurazione Principale e Script Interattivi
 * Modifica i valori nell'oggetto APP_CONFIG per aggiornare istantaneamente
 * i recapiti, WhatsApp, email e indirizzo su tutto il sito.
 */

const APP_CONFIG = {
  agencyName: "Agenzia Villa",
  ownerName: "Francesca Villa",
  phoneDisplay: "371 115 1204",
  phoneCall: "+393711151204",
  phoneSecondaryDisplay: "327 622 9504",
  phoneSecondaryCall: "+393276229504",
  whatsappDisplay: "327 622 9504",
  whatsappNumber: "393276229504",
  email: "studiofrancescavilla@gmail.com",
  address: "Via XXV Luglio, 86 • 84013 Cava de' Tirreni (SA)",
  hours: "Lun - Ven: 09:00 - 13:00 / 16:00 - 20:00 | Sabato su appuntamento",
  pIva: "01234567890"
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sincronizzazione dinamica dei recapiti
  syncConfigSettings();

  // 2. Menu Mobile Responsive
  initMobileMenu();

  // 3. Accordion FAQ (senza glitch visivi o salti di padding)
  initFaqAccordion();

  // 4. Filtro a Schede per i Servizi
  initServiceTabs();

  // 5. Gestione Modale "Richiedi Consulenza"
  initConsultationModal();

  // 6. Gestione Form e Notifiche Toast
  initFormsAndWhatsApp();

  // 7. Calcolatore / Preventivatore Interattivo
  initInteractiveEstimator();
});

/**
 * Applica la configurazione a tutti gli elementi che supportano attributi data-*
 */
function syncConfigSettings() {
  // Aggiorna link WhatsApp
  document.querySelectorAll('a[data-wa-dynamic]').forEach(link => {
    const defaultText = link.getAttribute('data-wa-text') || `Buongiorno ${APP_CONFIG.agencyName}, desidero richiedere informazioni sui vostri servizi.`;
    link.href = `https://wa.me/${APP_CONFIG.whatsappNumber}?text=${encodeURIComponent(defaultText)}`;
  });

  // Aggiorna pulsante telefonico principale
  document.querySelectorAll('a[data-phone-dynamic]').forEach(link => {
    link.href = `tel:${APP_CONFIG.phoneCall}`;
    if (link.hasAttribute('data-replace-text')) {
      link.textContent = APP_CONFIG.phoneDisplay;
    }
  });

  // Aggiorna email
  document.querySelectorAll('a[data-email-dynamic]').forEach(link => {
    link.href = `mailto:${APP_CONFIG.email}`;
    link.textContent = APP_CONFIG.email;
  });
}

/**
 * Menu Mobile
 */
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }
}

/**
 * Accordion FAQ basato su CSS Grid
 */
function initFaqAccordion() {
  const faqButtons = document.querySelectorAll('.faq-toggle');
  faqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const targetContent = document.getElementById(targetId);
      const icon = btn.querySelector('.faq-icon');
      const isCurrentlyHidden = targetContent.classList.contains('hidden');

      // Chiudi tutti i pannelli
      document.querySelectorAll('.faq-content').forEach(el => el.classList.add('hidden'));
      document.querySelectorAll('.faq-icon').forEach(el => el.classList.remove('rotate-180'));

      // Se era chiuso, aprilo
      if (isCurrentlyHidden) {
        targetContent.classList.remove('hidden');
        if (icon) icon.classList.add('rotate-180');
      }
    });
  });
}

/**
 * Filtro Servizi
 */
function initServiceTabs() {
  const serviceTabs = document.querySelectorAll('.service-tab');
  const serviceCards = document.querySelectorAll('.service-card-item');

  serviceTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.getAttribute('data-category');

      serviceTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      serviceCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 0.25s ease';
            card.style.opacity = '1';
          }, 30);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/**
 * Modale Richiesta Consulenza
 */
function initConsultationModal() {
  const modal = document.getElementById('consultationModal');
  const openModalBtns = document.querySelectorAll('.open-consultation-modal');
  const closeModalBtns = document.querySelectorAll('.close-modal');
  const modalServiceSelect = document.getElementById('modalService');

  if (!modal) return;

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const preselectedService = btn.getAttribute('data-service');
      if (modalServiceSelect && preselectedService) {
        // Cerca se esiste l'opzione
        for (let i = 0; i < modalServiceSelect.options.length; i++) {
          if (modalServiceSelect.options[i].value.toLowerCase().includes(preselectedService.toLowerCase())) {
            modalServiceSelect.selectedIndex = i;
            break;
          }
        }
      }
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto';
  };

  closeModalBtns.forEach(btn => btn.addEventListener('click', closeModal));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}

/**
 * Helper per mostrare messaggi Toast
 */
function showToast(message) {
  const toast = document.getElementById('toastNotice');
  const toastMessage = document.getElementById('toastMessage');
  if (toast && toastMessage) {
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 5000);
  }
}

/**
 * Gestione Form & Generazione WhatsApp
 */
function initFormsAndWhatsApp() {
  // 1. Modale Form
  const modalForm = document.getElementById('modalForm');
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = document.getElementById('modalName').value.trim();
      const tel = document.getElementById('modalPhone').value.trim();
      const servizio = document.getElementById('modalService').value;
      const note = document.getElementById('modalNotes').value.trim();
      const sendViaWa = document.getElementById('modalSendWhatsApp').checked;

      if (sendViaWa) {
        const text = `Buongiorno ${APP_CONFIG.agencyName},%0A%0ASono *${encodeURIComponent(nome)}* (Tel: ${encodeURIComponent(tel)}).%0AVorrei informazioni per: *${encodeURIComponent(servizio)}*.%0A%0ANote:%0A${encodeURIComponent(note || 'Nessuna nota specifica.')}`;
        window.open(`https://wa.me/${APP_CONFIG.whatsappNumber}?text=${text}`, '_blank');
      }

      showToast(`Grazie ${nome}! La tua richiesta per ${servizio} è stata inviata con successo.`);
      modalForm.reset();

      const modal = document.getElementById('consultationModal');
      if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = 'auto';
      }
    });
  }

  // 2. Hero Quick Form
  const heroForm = document.getElementById('heroQuickForm');
  if (heroForm) {
    heroForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const srv = document.getElementById('heroServiceSelect').value;
      const name = document.getElementById('heroNameInput').value.trim();
      const phone = document.getElementById('heroPhoneInput').value.trim();
      const notes = document.getElementById('heroNotesInput').value.trim();

      const text = `Buongiorno ${APP_CONFIG.agencyName},%0A%0ASono *${encodeURIComponent(name)}* (Tel: ${encodeURIComponent(phone)}).%0ARichiedo verifica rapida per: *${encodeURIComponent(srv)}*.%0ADettagli:%0A${encodeURIComponent(notes || 'Nessun dettaglio aggiuntivo.')}`;
      window.open(`https://wa.me/${APP_CONFIG.whatsappNumber}?text=${text}`, '_blank');

      showToast(`Grazie ${name}! Ti ricontatteremo a breve per il servizio ${srv}.`);
      heroForm.reset();
    });
  }

  // 3. Main Contact Form
  const contactForm = document.getElementById('mainContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const tel = document.getElementById('contactPhone').value.trim();
      const servizio = document.getElementById('contactService').value;

      showToast(`Grazie ${nome}! La tua richiesta per ${servizio} è stata inoltrata ai nostri uffici.`);
      contactForm.reset();
    });
  }

  // 4. Quick WhatsApp Buttons (in cards)
  document.querySelectorAll('.wa-direct-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const subject = btn.getAttribute('data-subject') || 'informazioni generali';
      const text = `Buongiorno ${APP_CONFIG.agencyName},%0A%0AVorrei ricevere maggiori informazioni riguardo al servizio: *${encodeURIComponent(subject)}*.%0AGrazie.`;
      window.open(`https://wa.me/${APP_CONFIG.whatsappNumber}?text=${text}`, '_blank');
    });
  });
}

/**
 * Calcolatore Preventivi Rapido Guidato
 */
function initInteractiveEstimator() {
  const categorySelector = document.getElementById('calcCategory');
  const detailsContainer = document.getElementById('calcDetailsContainer');
  const resultBox = document.getElementById('calcResultBox');
  const sendWaBtn = document.getElementById('calcSendWhatsApp');

  if (!categorySelector || !detailsContainer) return;

  const updateCalculator = () => {
    const category = categorySelector.value;
    let html = '';

    if (category === 'auto') {
      html = `
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Tipo Pratica Auto</label>
            <select id="calcSubAuto" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white">
              <option value="Passaggio di Proprietà STA">Passaggio di Proprietà (STA Immediato)</option>
              <option value="Immatricolazione / Estero">Immatricolazione / Nazionalizzazione</option>
              <option value="Revisione o Collaudo Speciale">Revisione o Collaudo (GPL/Metano/Gancio)</option>
              <option value="Rinnovo Patente con Medico">Rinnovo Patente con Medico in Sede</option>
              <option value="Visura PRA / Perdita Possesso">Visura PRA o Duplicato Documento</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Potenza / Dettagli Veicolo</label>
            <input type="text" id="calcPowerAuto" placeholder="Es. Targa o KW / CV" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white">
          </div>
        </div>
      `;
    } else if (category === 'infortunistica') {
      html = `
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Tipo Incidente / Sinistro</label>
            <select id="calcSubSinistro" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white">
              <option value="Incidente con Danni Fisici e Mezzo">Incidente con Danni Fisici e Mezzo (Zero Anticipi)</option>
              <option value="Tamponamento o Collisione Veicoli">Tamponamento / Solo Danni al Veicolo</option>
              <option value="Sinistro Nautico / Barca">Sinistro Marittimo / Danni a Imbarcazione</option>
              <option value="Investimento Pedone / Ciclista">Investimento Pedone o Ciclista</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Data indicativa del Sinistro</label>
            <input type="text" id="calcDateSinistro" placeholder="Es. Ieri o gg/mm/aaaa" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white">
          </div>
        </div>
      `;
    } else if (category === 'nautica') {
      html = `
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Pratica Nautica Richiesta</label>
            <select id="calcSubNautica" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white">
              <option value="Passaggio Proprietà Natante / Imbarcazione">Passaggio di Proprietà Barca o Natante</option>
              <option value="Convalida o Rinnovo Patente Nautica">Convalida o Rinnovo Patente Nautica con Medico</option>
              <option value="Rilascio Nuova Patente Nautica">Rilascio Patente Nautica (Entro/Oltre 12M)</option>
              <option value="Iscrizione STED / Licenza Navigazione">Iscrizione STED o Licenza Navigazione</option>
              <option value="Visita RINA / Certificato Sicurezza">Visita RINA / Varie Certificazioni</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Lunghezza / Modello Barca</label>
            <input type="text" id="calcBoatInfo" placeholder="Es. Entro 10 metri, Motore FB..." class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white">
          </div>
        </div>
      `;
    } else if (category === 'assicurazioni') {
      html = `
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Ramo Assicurativo</label>
            <select id="calcSubAssicura" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white">
              <option value="RCA Auto / Moto / Autocarro">Preventivo RC Auto, Moto o Autocarro</option>
              <option value="Veicoli d'Epoca & Storici">Veicoli d'Epoca & Storici (Convenzioni ASI/FMI)</option>
              <option value="Polizza Corpi Nautica & RC Natanti">Polizza Corpi & Macchine Nautica</option>
              <option value="Polizza Casa & Famiglia">Polizza Casa & Tutela Famiglia</option>
              <option value="Tutela Legale & Fideiussioni">Tutela Legale e Fideiussioni</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Dettagli Veicolo o Bene da Assicurare</label>
            <input type="text" id="calcAssicuraInfo" placeholder="Es. Targa, anno immatricolazione o valore..." class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white">
          </div>
        </div>
      `;
    }

    detailsContainer.innerHTML = html;
  };

  categorySelector.addEventListener('change', updateCalculator);
  updateCalculator();

  if (sendWaBtn) {
    sendWaBtn.addEventListener('click', () => {
      const cat = categorySelector.options[categorySelector.selectedIndex].text;
      let details = '';

      const subAuto = document.getElementById('calcSubAuto');
      const powerAuto = document.getElementById('calcPowerAuto');
      const subSinistro = document.getElementById('calcSubSinistro');
      const dateSinistro = document.getElementById('calcDateSinistro');
      const subNautica = document.getElementById('calcSubNautica');
      const boatInfo = document.getElementById('calcBoatInfo');
      const subAssicura = document.getElementById('calcSubAssicura');
      const assicuraInfo = document.getElementById('calcAssicuraInfo');

      if (subAuto) details += `\n- Operazione: ${subAuto.value} (Info: ${powerAuto.value || 'N.D.'})`;
      if (subSinistro) details += `\n- Sinistro: ${subSinistro.value} (Data: ${dateSinistro.value || 'N.D.'})`;
      if (subNautica) details += `\n- Pratica Nautica: ${subNautica.value} (Barca: ${boatInfo.value || 'N.D.'})`;
      if (subAssicura) details += `\n- Polizza: ${subAssicura.value} (Dettagli: ${assicuraInfo.value || 'N.D.'})`;

      const text = `Buongiorno ${APP_CONFIG.agencyName},%0A%0Achiedo preventivo/consulenza per:%0A*${encodeURIComponent(cat)}*${encodeURIComponent(details)}%0A%0APotete fornirmi tempistiche e costi? Grazie.`;
      window.open(`https://wa.me/${APP_CONFIG.whatsappNumber}?text=${text}`, '_blank');
    });
  }
}
