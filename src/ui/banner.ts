import type { ConsentChoices } from '../types';
import { showModal, hideModal } from './modal';
import { injectStyles } from './styles';
import { getConfig } from '../config';
import { el } from './dom-helpers';

let floatBtn: HTMLElement | null = null;

export function showBanner(onConsent: (choices: ConsentChoices) => void): void {
  const config = getConfig();
  injectStyles(config.primaryColor);

  showModal((choices) => {
    onConsent(choices);
    showFloatingButton(onConsent);
  });
}

export function hideBanner(): void {
  hideModal();
}

export function showFloatingButton(onReopen: (choices: ConsentChoices) => void): void {
  if (floatBtn) return;

  const config = getConfig();
  injectStyles(config.primaryColor);

  floatBtn = el('button', {
    class: 'cc-float-btn',
    type: 'button',
    'aria-label': 'Cookie settings',
    title: 'Cookie settings',
  });
  floatBtn.textContent = '\u{1F36A}';
  floatBtn.addEventListener('click', () => {
    showModal((choices) => {
      onReopen(choices);
    });
  });
  document.body.appendChild(floatBtn);
}
