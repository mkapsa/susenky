import type { ConsentChoices } from '../types';
import { getConfig } from '../config';
import { el, gearIcon, trapFocus } from './dom-helpers';

let overlayEl: HTMLElement | null = null;
let releaseFocus: (() => void) | null = null;
let previouslyFocused: HTMLElement | null = null;

export function showModal(onSave: (choices: ConsentChoices) => void): void {
  if (overlayEl) return;

  previouslyFocused = document.activeElement as HTMLElement | null;

  const config = getConfig();

  // Overlay — clicking backdrop must not move focus outside the modal
  overlayEl = el('div', { class: 'cc-overlay cc-fade-in', role: 'presentation' });
  overlayEl.addEventListener('mousedown', (e) => {
    if (e.target === overlayEl) {
      e.preventDefault();
    }
  });

  // Modal card
  const modal = el('div', {
    class: 'cc-modal cc-slide-up',
    role: 'dialog',
    'aria-modal': 'true',
    'aria-label': 'Cookie consent',
  });

  // Logo
  if (config.logoUrl) {
    modal.appendChild(el('img', { class: 'cc-logo', src: config.logoUrl, alt: `${config.siteName} logo` }));
    modal.appendChild(el('hr', { class: 'cc-divider' }));
  }

  // Main view container
  const mainView = el('div', { class: 'cc-main-view' });
  const prefView = el('div', { class: 'cc-pref-view', style: 'display:none' });

  // --- Main view ---
  mainView.appendChild(el('h2', { class: 'cc-title' }, 'We value your privacy'));
  const body = el('p', { class: 'cc-body' });
  body.innerHTML = `${config.siteName} uses cookies to enhance your browsing experience, serve personalised content, and analyse traffic. Read our <a href="${encodeURI(config.cookiePolicyUrl)}" target="_blank" rel="noopener">Cookie Policy</a>.`;
  mainView.appendChild(body);

  const btnRow = el('div', { class: 'cc-btn-row' });

  const customizeBtn = el('button', { class: 'cc-btn-link', type: 'button' });
  customizeBtn.appendChild(gearIcon());
  customizeBtn.appendChild(document.createTextNode(' Customize'));
  customizeBtn.addEventListener('click', () => {
    mainView.style.display = 'none';
    prefView.style.display = '';
  });

  const rightBtns = el('div', { class: 'cc-btn-row-right' });

  const rejectBtn = el('button', { class: 'cc-btn cc-btn-outline', type: 'button' }, 'Reject');
  rejectBtn.addEventListener('click', () => {
    hideModal();
    onSave({ functional: true, analytics: false, marketing: false });
  });

  const acceptBtn = el('button', { class: 'cc-btn cc-btn-primary', type: 'button' }, 'Accept all');
  acceptBtn.addEventListener('click', () => {
    hideModal();
    onSave({ functional: true, analytics: true, marketing: true });
  });

  rightBtns.appendChild(rejectBtn);
  rightBtns.appendChild(acceptBtn);
  btnRow.appendChild(customizeBtn);
  btnRow.appendChild(rightBtns);
  mainView.appendChild(btnRow);

  // --- Preference view ---
  const backBtn = el('button', { class: 'cc-back-btn', type: 'button' });
  backBtn.innerHTML = '&#8592; Back';
  backBtn.addEventListener('click', () => {
    prefView.style.display = 'none';
    mainView.style.display = '';
  });
  prefView.appendChild(backBtn);

  prefView.appendChild(el('h2', { class: 'cc-pref-title' }, 'Manage preferences'));

  // Functional (always on)
  prefView.appendChild(buildCategory('Functional', 'Essential cookies required for the website to function.', true, true));

  // Analytics toggle
  const analyticsToggle = buildCategory(config.categories.analytics.label, config.categories.analytics.description, false, false);
  const analyticsInput = analyticsToggle.querySelector('input')!;
  prefView.appendChild(analyticsToggle);

  // Marketing toggle
  const marketingToggle = buildCategory(config.categories.marketing.label, config.categories.marketing.description, false, false);
  const marketingInput = marketingToggle.querySelector('input')!;
  prefView.appendChild(marketingToggle);

  // Save button
  const saveRow = el('div', { class: 'cc-pref-save' });
  const saveBtn = el('button', { class: 'cc-btn cc-btn-primary', type: 'button' }, 'Save preferences');
  saveBtn.addEventListener('click', () => {
    hideModal();
    onSave({
      functional: true,
      analytics: analyticsInput.checked,
      marketing: marketingInput.checked,
    });
  });
  saveRow.appendChild(saveBtn);
  prefView.appendChild(saveRow);

  modal.appendChild(mainView);
  modal.appendChild(prefView);
  overlayEl.appendChild(modal);
  document.body.appendChild(overlayEl);

  releaseFocus = trapFocus(modal);
}

export function hideModal(): void {
  if (releaseFocus) {
    releaseFocus();
    releaseFocus = null;
  }
  if (overlayEl) {
    overlayEl.remove();
    overlayEl = null;
  }
  if (previouslyFocused) {
    previouslyFocused.focus();
    previouslyFocused = null;
  }
}

export function isModalOpen(): boolean {
  return overlayEl !== null;
}

function buildCategory(label: string, desc: string, checked: boolean, disabled: boolean): HTMLElement {
  const row = el('div', { class: 'cc-category' });
  const info = el('div', { class: 'cc-category-info' });
  info.appendChild(el('p', { class: 'cc-category-label' }, label));
  info.appendChild(el('p', { class: 'cc-category-desc' }, desc));

  const toggle = el('label', { class: 'cc-toggle' });
  const input = el('input', { type: 'checkbox', role: 'switch', 'aria-label': label });
  if (checked) input.setAttribute('checked', '');
  if (disabled) input.setAttribute('disabled', '');
  const slider = el('span', { class: 'cc-toggle-slider' });
  toggle.appendChild(input);
  toggle.appendChild(slider);

  row.appendChild(info);
  row.appendChild(toggle);
  return row;
}
