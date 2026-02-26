export const CSS = `
:root {
  --cc-primary: #1a73e8;
  --cc-primary-hover: #1565c0;
  --cc-bg: #ffffff;
  --cc-text: #333333;
  --cc-text-secondary: #666666;
  --cc-border: #e0e0e0;
  --cc-overlay: rgba(0, 0, 0, 0.55);
  --cc-radius: 12px;
  --cc-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.cc-overlay {
  position: fixed;
  inset: 0;
  background: var(--cc-overlay);
  z-index: 2147483646;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cc-modal {
  background: var(--cc-bg);
  border-radius: var(--cc-radius);
  max-width: 480px;
  width: calc(100% - 32px);
  max-height: 90vh;
  overflow-y: auto;
  padding: 28px;
  box-sizing: border-box;
  font-family: var(--cc-font);
  color: var(--cc-text);
  position: relative;
  z-index: 2147483647;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
}

.cc-modal * {
  box-sizing: border-box;
}

.cc-logo {
  display: block;
  max-height: 40px;
  max-width: 160px;
  margin: 0 auto 16px;
}

.cc-divider {
  border: none;
  border-top: 1px solid var(--cc-border);
  margin: 16px 0;
}

.cc-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px;
  line-height: 1.3;
}

.cc-body {
  font-size: 14px;
  line-height: 1.5;
  color: var(--cc-text-secondary);
  margin: 0 0 20px;
}

.cc-body a {
  color: var(--cc-primary);
  text-decoration: underline;
}

.cc-btn-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}

.cc-btn-row-right {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

.cc-btn {
  font-family: var(--cc-font);
  font-size: 14px;
  font-weight: 500;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  transition: background 0.15s, color 0.15s, box-shadow 0.15s;
  line-height: 1;
}

.cc-btn:focus-visible {
  outline: 2px solid var(--cc-primary);
  outline-offset: 2px;
}

.cc-btn-primary {
  background: var(--cc-primary);
  color: #fff;
}

.cc-btn-primary:hover {
  background: var(--cc-primary-hover);
}

.cc-btn-outline {
  background: transparent;
  color: var(--cc-text);
  border: 1px solid var(--cc-border);
}

.cc-btn-outline:hover {
  background: #f5f5f5;
}

.cc-btn-link {
  background: none;
  border: none;
  color: var(--cc-text-secondary);
  font-size: 13px;
  cursor: pointer;
  padding: 8px 4px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--cc-font);
}

.cc-btn-link:hover {
  color: var(--cc-text);
}

.cc-btn-link svg {
  width: 16px;
  height: 16px;
}

/* Preference center */

.cc-pref-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 16px;
}

.cc-category {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid var(--cc-border);
  gap: 16px;
}

.cc-category:last-of-type {
  border-bottom: none;
}

.cc-category-info {
  flex: 1;
}

.cc-category-label {
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 4px;
}

.cc-category-desc {
  font-size: 13px;
  color: var(--cc-text-secondary);
  margin: 0;
  line-height: 1.4;
}

/* Toggle switch */

.cc-toggle {
  position: relative;
  width: 44px;
  height: 24px;
  flex-shrink: 0;
  margin-top: 2px;
}

.cc-toggle input {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
}

.cc-toggle-slider {
  position: absolute;
  inset: 0;
  background: #ccc;
  border-radius: 24px;
  cursor: pointer;
  transition: background 0.2s;
}

.cc-toggle-slider::before {
  content: "";
  position: absolute;
  width: 18px;
  height: 18px;
  left: 3px;
  bottom: 3px;
  background: #fff;
  border-radius: 50%;
  transition: transform 0.2s;
}

.cc-toggle input:checked + .cc-toggle-slider {
  background: var(--cc-primary);
}

.cc-toggle input:checked + .cc-toggle-slider::before {
  transform: translateX(20px);
}

.cc-toggle input:disabled + .cc-toggle-slider {
  background: var(--cc-primary);
  opacity: 0.5;
  cursor: not-allowed;
}

.cc-toggle input:focus-visible + .cc-toggle-slider {
  outline: 2px solid var(--cc-primary);
  outline-offset: 2px;
}

.cc-pref-save {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* Back button */

.cc-back-btn {
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
  color: var(--cc-text-secondary);
  padding: 0;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: var(--cc-font);
}

.cc-back-btn:hover {
  color: var(--cc-text);
}

/* Floating cookie button */

.cc-float-btn {
  position: fixed;
  bottom: 20px;
  left: 20px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--cc-bg);
  border: 1px solid var(--cc-border);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
  cursor: pointer;
  z-index: 2147483645;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  transition: box-shadow 0.15s;
  padding: 0;
  line-height: 1;
}

.cc-float-btn:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.cc-float-btn:focus-visible {
  outline: 2px solid var(--cc-primary);
  outline-offset: 2px;
}

/* Animations */

.cc-fade-in {
  animation: ccFadeIn 0.2s ease-out;
}

@keyframes ccFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.cc-slide-up {
  animation: ccSlideUp 0.25s ease-out;
}

@keyframes ccSlideUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 480px) {
  .cc-modal {
    max-width: 100%;
    width: 100%;
    border-radius: 16px 16px 0 0;
    margin-top: auto;
    max-height: 85vh;
  }

  .cc-overlay {
    align-items: flex-end;
  }

  .cc-btn-row {
    flex-direction: column;
  }

  .cc-btn-row-right {
    width: 100%;
    margin-left: 0;
  }

  .cc-btn-row-right .cc-btn {
    flex: 1;
  }
}
`;

let injected = false;

export function injectStyles(primaryColor?: string): void {
  if (injected) return;
  injected = true;

  let css = CSS;
  if (primaryColor) {
    css = css.replace(/#1a73e8/g, primaryColor);
  }

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
}
