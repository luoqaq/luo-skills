/* Local interactions only. No requests, persistence, or account mutations. */
(() => {
  const data = window.StudyData;
  const style = document.createElement('style');
  style.textContent = `
    .study-dialog{padding:0;border:1px solid var(--dialog-border,#d7d9d2);border-radius:16px;width:min(570px,calc(100vw - 40px));max-height:85vh;overflow:auto;background:var(--dialog-bg,#fffefb);color:var(--dialog-ink,#202923);box-shadow:0 32px 100px #0003;font:14px/1.6 -apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif}
    .study-dialog::backdrop{background:#08151077;backdrop-filter:blur(4px)}
    .study-dialog header{padding:24px 28px 18px;display:flex;justify-content:space-between;gap:20px;border-bottom:1px solid var(--dialog-border,#e2e4dc)}
    .study-dialog h2{font:600 21px/1.5 -apple-system,"PingFang SC",sans-serif;margin:3px 0}.study-dialog h3{font:600 13px/1.6 -apple-system,"PingFang SC",sans-serif;margin:22px 0 7px}.study-dialog p{margin:0}
    .study-dialog .dialog-kicker,.study-dialog small{font-size:11px;color:var(--dialog-muted,#69726b)}
    .study-dialog button{font:inherit;cursor:pointer}.study-dialog .dialog-close{background:transparent;border:0;color:inherit;font-size:25px;padding:0 4px;align-self:flex-start}
    .study-dialog .dialog-body{padding:22px 28px 28px}.study-dialog .dialog-comparison{display:grid;grid-template-columns:1fr 30px 1fr;gap:10px;align-items:center;padding:16px 0;border-bottom:1px solid var(--dialog-border,#e2e4dc)}
    .study-dialog .dialog-comparison strong{display:block;font-size:24px;font-variant-numeric:tabular-nums;font-weight:500;margin-top:5px}.study-dialog .dialog-comparison .after{color:var(--dialog-accent,#315d48)}
    .study-dialog .dialog-action{display:block;margin-top:26px;width:100%;border:0;border-radius:6px;padding:12px 16px;background:var(--dialog-accent,#315d48);color:var(--dialog-bg,#fffefb);font-weight:600}
    .study-dialog .dialog-note{font-size:11px;margin-top:14px;color:var(--dialog-muted,#69726b)}
    .study-dialog progress{width:100%;accent-color:var(--dialog-accent,#315d48);margin-top:14px}.study-toast{position:fixed;bottom:106px;left:50%;transform:translateX(-50%);padding:11px 18px;background:var(--dialog-ink,#203d2e);color:var(--dialog-bg,#fffefb);border-radius:8px;font:13px -apple-system,"PingFang SC",sans-serif;z-index:200;box-shadow:0 8px 40px #0002}
    @media(prefers-reduced-motion:no-preference){.study-dialog[open]{animation:study-in .18s ease-out}@keyframes study-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}}
  `;
  document.head.append(style);
  const dialog = document.createElement('dialog');
  dialog.className = 'study-dialog';
  dialog.setAttribute('aria-labelledby','study-dialog-title');
  document.body.append(dialog);
  const reviewed = new Set();
  function show(title, kicker, body) {
    dialog.innerHTML = `<header><div><p class="dialog-kicker">${kicker}</p><h2 id="study-dialog-title">${title}</h2></div><button class="dialog-close" aria-label="关闭详情">×</button></header><div class="dialog-body">${body}<p class="dialog-note">演示数据 · 仅用于界面体验，不连接真实账户。</p></div>`;
    dialog.querySelector('.dialog-close').onclick = () => dialog.close();
    dialog.showModal();
  }
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  function toast(message) {
    document.querySelector('.study-toast')?.remove();
    const el=document.createElement('div');el.className='study-toast';el.role='status';el.textContent=message;document.body.append(el);setTimeout(()=>el.remove(),2500);
  }
  function chart(range) {
    const points = data.series[range].map((value,index,series) => `${(index/(series.length-1)*600).toFixed(1)},${(160-(value-1.1)/.2*140).toFixed(1)}`);
    const path = points.map((point,index)=>(index?'L':'M')+point).join(' ');
    document.querySelectorAll('[data-chart-line]').forEach(el=>el.setAttribute('d',path));
    document.querySelectorAll('[data-chart-fill]').forEach(el=>el.setAttribute('d',`${path} L600,180 L0,180 Z`));
    document.querySelectorAll('[data-range]').forEach(el=>{const active=el.dataset.range===range;el.classList.toggle('active',active);el.setAttribute('aria-pressed',String(active));});
    document.querySelectorAll('[data-range-label]').forEach(el=>el.textContent={'1W':'近一周','1M':'近一月','3M':'近三月'}[range]);
    const endpoints={'1W':['09.17','09.24'],'1M':['08.24','09.24'],'3M':['06.24','09.24']}[range];
    document.querySelectorAll('[data-chart-start]').forEach(el=>el.textContent=endpoints[0]);
    document.querySelectorAll('[data-chart-end]').forEach(el=>el.textContent=endpoints[1]);
  }
  document.addEventListener('click', event => {
    const el=event.target.closest('button, a');if(!el)return;
    if(el.hasAttribute('data-range')){chart(el.dataset.range);return;}
    if(el.hasAttribute('data-review')){
      const index=Number(el.dataset.review),r=data.reviews[index];
      show(r.title,`研究更新 / ${r.tag}`,`<p>${r.description}</p><div class="dialog-comparison"><div><small>当前</small><strong>${r.before}</strong></div><span aria-hidden="true">→</span><div class="after"><small>待审阅建议</small><strong>${r.after}</strong></div></div><h3>依据摘要</h3><p>${r.evidence}</p><h3>需要留意</h3><p>${r.caution}</p><button class="dialog-action" data-mark-reviewed="${index}">${reviewed.has(index)?'已读，返回总览':'标记已读'}</button>`);
      return;
    }
    if(el.hasAttribute('data-mark-reviewed')){
      reviewed.add(Number(el.dataset.markReviewed));dialog.close();
      document.querySelectorAll('[data-pending-count]').forEach(node=>node.textContent=String(3-reviewed.size));
      toast('已标记为已读 · 仅本次演示会话');return;
    }
    if(el.hasAttribute('data-stock')){
      const s=data.stocks[Number(el.dataset.stock)];
      show(s.name,`${s.code} / ${s.sector}`,`<div class="dialog-comparison"><div><small>现价 / 元</small><strong>${s.price}</strong></div><span></span><div><small>今日涨跌</small><strong>${s.change}</strong></div></div><div class="dialog-comparison"><div><small>组合占比</small><strong>${s.weight}</strong></div><span></span><div><small>浮动盈亏</small><strong>${s.profit}</strong></div></div><h3>研究状态</h3><p>${s.status==='待审阅'?'有新的研究变化，等待人工审阅。':'最近更新：'+s.status+'。'}</p><button class="dialog-action" data-close-dialog>返回持仓</button>`);return;
    }
    if(el.hasAttribute('data-task')){
      const t=data.tasks[Number(el.dataset.task)];
      show(t.name,`任务队列 / ${t.status}`,`<p>${t.target} · ${t.detail}</p>${t.progress?`<progress max="100" value="${t.progress}" aria-label="任务进度"></progress><p>${t.progress}% · 演示进度</p>`:''}<h3>任务说明</h3><p>${t.status==='需处理'?'历史数据源尚未配置。本原型只展示此状态，不会发起实际回测。':t.status==='排队中'?'等待资料整理完成后开始处理。此处展示的是模拟队列。':'正在汇总材料并整理研究变化。此处展示的是模拟执行状态。'}</p><button class="dialog-action" data-close-dialog>返回总览</button>`);return;
    }
    if(el.hasAttribute('data-close-dialog'))dialog.close();
  });
  document.addEventListener('keydown', event=>{
    if(dialog.open||event.altKey||event.metaKey||event.ctrlKey||event.shiftKey||event.target.closest('input,textarea,select,[contenteditable="true"]'))return;
    if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
      if(window.parent!==window){event.preventDefault();window.parent.postMessage({type:'prototype-cycle',delta:event.key==='ArrowRight'?1:-1},location.origin);}
    }
  });
  chart('1M');
})();
