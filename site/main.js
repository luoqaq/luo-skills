for (const preview of document.querySelectorAll('[data-pc-preview]')) {
  const pcDirections = {
    A: { name: '研究刊物', file: 'demos/stock-analysis/a-editorial.html' },
    B: { name: '精密终端', file: 'demos/stock-analysis/b-terminal.html' },
    C: { name: '现代账本', file: 'demos/stock-analysis/c-ledger.html' },
  };
  const pcFrame = preview.querySelector('[data-pc-frame]');
  const pcCanvas = preview.querySelector('.pc-canvas');
  const pcButtons = [...preview.querySelectorAll('[data-pc-direction]')];
  let currentDirection = 'A';
  function selectPCDirection(key) {
    currentDirection = key;
    const direction = pcDirections[key];
    pcFrame.title = `PC 样板：${direction.name}`;
    pcFrame.src = direction.file;
    for (const button of pcButtons) button.setAttribute('aria-pressed', String(button.dataset.pcDirection === key));
    preview.querySelector('[data-pc-status]').textContent = `${direction.name} · 演示数据 · 可直接操作`;
    preview.querySelector('[data-pc-fullscreen]').href = `demos/stock-analysis/index.html?variant=${key}`;
  }
  for (const button of pcButtons) {
    button.addEventListener('click', () => selectPCDirection(button.dataset.pcDirection));
    button.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const index = pcButtons.indexOf(button);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (index + (event.key === 'ArrowRight' ? 1 : -1) + 3) % 3;
      pcButtons[next].focus();
      selectPCDirection(pcButtons[next].dataset.pcDirection);
    });
  }
  preview.querySelector('.pc-live').hidden = false;
  const sizePCPreview = () => pcCanvas.style.setProperty('--preview-scale', pcCanvas.clientWidth / 1440);
  new ResizeObserver(sizePCPreview).observe(pcCanvas);
  sizePCPreview();
  selectPCDirection(currentDirection);

  window.addEventListener('message', event => {
    if (event.origin !== location.origin || event.source !== pcFrame.contentWindow || event.data?.type !== 'prototype-cycle' || ![-1, 1].includes(event.data.delta)) return;
    const keys = Object.keys(pcDirections);
    selectPCDirection(keys[(keys.indexOf(currentDirection) + event.data.delta + keys.length) % keys.length]);
  });
}

for (const button of document.querySelectorAll('[data-copy]')) {
  button.hidden = false;
  button.addEventListener('click', async () => {
    const status = button.closest('[data-copy-group]').querySelector('[data-copy-status]');
    const content = document.getElementById(button.dataset.copy).textContent;
    try {
      await navigator.clipboard.writeText(content);
      status.textContent = button.dataset.copy.startsWith('agent-install-') ? '安装请求已复制，请粘贴给你的 Agent。' : button.dataset.copy.startsWith('command-') ? '安装命令已复制。' : '任务示例已复制。';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(document.getElementById(button.dataset.copy));
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = '未能自动复制，已选中文字，请手动复制。';
    }
  });
}
