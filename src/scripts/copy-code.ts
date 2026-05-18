let resetTimer: number | null = null;

function hasClipboardSupport(): boolean {
  return !!(
    (navigator.clipboard && navigator.clipboard.writeText) ||
    document.queryCommandSupported?.('copy')
  );
}

function extractCodeText(preElement: HTMLPreElement): string {
  return preElement.textContent || '';
}

async function copyToClipboard(text: string): Promise<{
  success: boolean;
  method: 'clipboard-api' | 'execCommand' | 'none';
  error?: Error;
}> {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return { success: true, method: 'clipboard-api' };
    } catch (error) {
      console.warn('Clipboard API failed, trying fallback', error);
    }
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    const success = document.execCommand('copy');
    document.body.removeChild(textarea);

    return {
      success,
      method: success ? 'execCommand' : 'none',
    };
  } catch (error) {
    return { success: false, method: 'none', error: error as Error };
  }
}

function announceToScreenReader(message: string): void {
  const announcement = document.querySelector('.copy-announcement');
  if (!announcement) return;

  announcement.textContent = '';

  setTimeout(() => {
    announcement.textContent = message;
  }, 100);
}

function handleCopy(button: HTMLButtonElement, pre: HTMLPreElement): void {
  const text = extractCodeText(pre);

  copyToClipboard(text).then((result) => {
    if (result.success) {
      button.classList.add('success');
      button.setAttribute('aria-label', 'Code copied');
      announceToScreenReader('Code copied to clipboard');

      if (resetTimer !== null) {
        clearTimeout(resetTimer);
      }

      resetTimer = window.setTimeout(() => {
        if (document.contains(button)) {
          button.classList.remove('success');
          button.setAttribute('aria-label', 'Copy code to clipboard');
        }
        resetTimer = null;
      }, 1000);
    } else {
      announceToScreenReader('Failed to copy code');
    }
  });
}

function handleKeydown(
  event: KeyboardEvent,
  button: HTMLButtonElement,
  pre: HTMLPreElement
): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handleCopy(button, pre);
  }
}

function initCopyButtons(): void {
  if (!hasClipboardSupport()) {
    console.warn('Clipboard API not supported, copy buttons will not be initialized');
    return;
  }

  const codeBlocks = document.querySelectorAll('.code-block-container');

  codeBlocks.forEach((container) => {
    const button = container.querySelector('.copy-button') as HTMLButtonElement | null;
    const pre = container.querySelector('pre') as HTMLPreElement | null;

    if (!button || !pre) {
      console.warn('Code block missing required elements');
      return;
    }

    button.addEventListener('click', () => handleCopy(button, pre));
    button.addEventListener('keydown', (e) => handleKeydown(e, button, pre));
  });
}

window.addEventListener('beforeunload', () => {
  if (resetTimer !== null) {
    clearTimeout(resetTimer);
  }
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCopyButtons);
} else {
  initCopyButtons();
}
