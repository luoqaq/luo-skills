(() => {
  'use strict';
  const products = window.DEMO.products;
  const labels = {active:'启用',draft:'草稿',inactive:'已下架',archived:'已归档'};
  const directions = {
    a:'宋体与横线组织连续目录，纸色和朱红形成印刷感；减少容器，保留清楚的商品属性。',
    b:'无衬线字阶、圆润控件与白色功能组，形成轻松的工作面；用留白和色面分层。',
    c:'低亮深色、等宽数字与方角网格；让编码、金额和状态按固定基准对齐，无辉光装饰。'
  };
  let direction = ['a','b','c'].includes(location.hash.slice(1)) ? location.hash.slice(1) : 'a';
  let filters = {query:'',status:'',category:'',tag:''};
  let previousFocus;
  let toastTimer;
  const app = document.getElementById('app');
  const sheet = document.getElementById('sheet');
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const money = p => '¥' + Math.min(...p.skus.map(s=>s.price));
  const clothColors = ['#e2dfd5','#7c91a1','#c5b49b','#838e79','#747781','#acbfd0','#c6b38e','#aa8c72'];
  const backgrounds = ['#eeece5','#e7ecf0','#eee7de','#e7eae3','#ece9e6','#e9eef1','#eee9de','#ede5dc'];
  function garment(p) {
    const i = products.indexOf(p);
    const shape = p.category === '下装' ? (p.name.includes('裙') ? '<path d="M43 28h34l18 94H25Z"/><path d="M43 35h34M51 35l-9 85M68 35l9 85" fill="none"/>' : '<path d="M38 24h44l3 34-9 66H60l-2-58-7 58H34l1-66Z"/><path d="M38 31h43M60 31v23M39 31l-3 13M80 31l3 13M37 117h15M61 117h15" fill="none"/>') : p.category==='配饰' ? '<path d="m37 18 21 2 24 99-22 5Z"/><path d="m58 20 25 5-11 95-22-4Z"/><path d="m59 112 16 4M62 120v8M67 121v8M72 122v8" fill="none"/>' : p.name.includes('短袖') ? '<path d="m43 27-19 9-13 25 18 10 10-16-2 65h46l-2-65 10 16 18-10-13-25-19-9q-17 13-34 0Z"/><path d="M43 27q17 25 34 0M38 112h44M14 57l17 10M89 67l17-10" fill="none"/>' : '<path d="m44 27-18 10-13 72 17 4 11-49-3 56h44l-3-56 11 49 17-4-13-72-18-10q-16 10-32 0Z"/><path d="M44 27q16 22 32 0M39 112h42M17 100l16 4M88 104l16-4" fill="none"/>';
    const detail = p.name.includes('衬衫') || p.name.includes('开衫') || p.name.includes('外套') ? '<path d="M60 39v80M46 29l5 17 9-7 9 7 5-17M68 60h10v12H68Z" fill="none"/><circle cx="60" cy="60" r="1"/><circle cx="60" cy="74" r="1"/><circle cx="60" cy="88" r="1"/>' : '';
    return `<div class="product-visual" style="--cloth-bg:${backgrounds[i]}"><svg viewBox="0 0 120 144" role="img" aria-label="${escape(p.name)}款式示意，非实拍"><g fill="${clothColors[i]}" stroke="#5a5a5145" stroke-width="1.3" stroke-linejoin="round">${shape}${detail}</g></svg></div>`;
  }
  function matched() {
    const q = filters.query.trim().toLowerCase();
    return products.filter(p=>(!q || [p.name,p.code,...p.skus.map(s=>s.barcode)].some(v=>v.toLowerCase().includes(q))) && (!filters.status||filters.status===p.status) && (!filters.category||filters.category===p.category) && (!filters.tag||p.tags.includes(filters.tag)));
  }
  function render() {
    const items = matched();
    const changed = Object.values(filters).some(Boolean);
    document.getElementById('status-tabs').innerHTML = [['','全部'],['active','启用'],['draft','草稿'],['inactive','已下架'],['archived','归档']].map(([value,label])=>`<button data-status="${value}" class="${filters.status===value?'selected':''}" aria-pressed="${filters.status===value}">${label}${!value?' '+products.length:''}</button>`).join('');
    document.getElementById('result-summary').textContent = [filters.category,filters.tag].filter(Boolean).join(' / ') + `${filters.category||filters.tag?' · ':''}${items.length} 款商品`;
    document.getElementById('clear-filters').hidden = !changed;
    const count = [filters.category,filters.tag].filter(Boolean).length;
    document.getElementById('filter-text').textContent = '筛选'+(count?' '+count:'');
    document.getElementById('products').innerHTML = items.length ? items.map(p=>`<button class="product" data-product="${p.id}" aria-label="查看${escape(p.name)}">${garment(p)}<div class="product-copy"><h2 class="product-name">${escape(p.name)}</h2><p class="product-code">${p.code}</p><p class="product-spec">${p.colors.length} 色 / ${p.sizes.length} 尺码</p></div><div class="product-meta"><span class="price">${money(p)}<small> / ${p.unit}</small></span><span class="state ${p.status}">${labels[p.status]}</span></div></button>`).join('') : '<div class="empty"><h2>没有找到匹配商品</h2><p>试试其他名称或编码，<br>也可以清除筛选条件。</p><button class="secondary" data-action="clear">清除全部条件</button></div>';
    document.querySelector('.list-end').hidden=!items.length;
  }
  function setDirection(value) {
    direction=value;
    app.className='app direction-'+value;document.body.dataset.direction=value;
    document.getElementById('thesis').textContent=directions[value];
    document.querySelectorAll('[data-direction]').forEach(button=>button.setAttribute('aria-pressed',button.dataset.direction===value));
    const themes={a:['#a53c2f','#eee5d6','#c8bcaa','#f4efe5','#292820'],b:['#355bd8','#e6edff','#d7e0f1','#ffffff','#26334b'],c:['#99cbb5','#304b40','#516367','#20292d','#e1e8e6']};
    ['--accent','--soft','--line','--canvas','color'].forEach((name,i)=>sheet.style.setProperty(name,themes[value][i]));sheet.dataset.direction=value;
  }
  function openSheet(title,content) {
    previousFocus=document.activeElement;
    document.getElementById('sheet-title').textContent=title;
    document.getElementById('sheet-content').innerHTML=content;
    sheet.showModal();
    document.body.style.overflow='hidden';
  }
  sheet.addEventListener('close',()=>{document.body.style.overflow='';if(previousFocus?.isConnected)previousFocus.focus({preventScroll:true});});
  function choices(name,values,selected) {
    return `<fieldset class="filter-field"><legend>${name==='category'?'商品分类':'商品标签'}</legend><div class="choices">${['',...values].map(v=>`<label><input type="radio" name="${name}" value="${v}" ${selected===v?'checked':''}><span>${v||'全部'}</span></label>`).join('')}</div></fieldset>`;
  }
  function filterSheet() {
    openSheet('筛选商品',`<form id="filters-form">${choices('category',[...new Set(products.map(p=>p.category))],filters.category)}${choices('tag',[...new Set(products.flatMap(p=>p.tags))],filters.tag)}<div class="sheet-actions"><button type="button" class="secondary" data-action="reset-draft">重置</button><button type="submit" class="primary">应用筛选</button></div></form>`);
  }
  function preview(id) {
    const p=products.find(p=>p.id===id);
    openSheet('商品信息预览',`<div class="preview-identity">${garment(p)}<div><h3>${p.name}</h3><strong class="price">${money(p)}<small> / ${p.unit}</small></strong></div></div><dl class="preview-data"><dt>商品编码</dt><dd>${p.code}</dd><dt>商品状态</dt><dd>${labels[p.status]}</dd><dt>分类</dt><dd>${p.category}</dd><dt>颜色</dt><dd>${p.colors.join('、')}</dd><dt>尺码</dt><dd>${p.sizes.join(' / ')}</dd><dt>标签</dt><dd>${p.tags.join('、')}</dd></dl><div class="sheet-actions"><button class="secondary" data-action="close">返回列表</button></div>`);
  }
  function toast(message) {
    const el=document.getElementById('toast');el.textContent=message;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),3200);
  }
  document.getElementById('text-scale').addEventListener('change',event=>{[app,sheet].forEach(el=>el.style.setProperty('--text-scale',event.target.checked?'2':'1'));});
  document.getElementById('search').addEventListener('input',event=>{filters.query=event.target.value;render();});
  document.getElementById('search-form').addEventListener('submit',event=>event.preventDefault());
  document.addEventListener('submit',event=>{
    if(event.target.id!=='filters-form')return;
    event.preventDefault();const values=new FormData(event.target);filters.category=values.get('category')||'';filters.tag=values.get('tag')||'';render();sheet.close();
  });
  document.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button)return;
    if(button.dataset.direction){history.replaceState(null,'','#'+button.dataset.direction);setDirection(button.dataset.direction);return;}
    if(button.hasAttribute('data-status')){filters.status=button.dataset.status;render();document.querySelector('#status-tabs .selected').focus({preventScroll:true});return;}
    if(button.dataset.product){preview(button.dataset.product);return;}
    const action=button.dataset.action;
    if(action==='filter')filterSheet();
    if(action==='close')sheet.close();
    if(action==='clear'){filters={query:'',status:'',category:'',tag:''};document.getElementById('search').value='';render();}
    if(action==='reset-draft'){document.querySelectorAll('#filters-form input[value=""]').forEach(input=>input.checked=true);}
    if(action==='scope')toast('演示门店：见山服饰 · 文一路店');
    if(['new','orders','profile'].includes(action))toast('该入口不在本次三页原型范围内');
    if(action==='home')toast('当前为视觉方向稿，选定后继续设计首页与详情');
  });
  window.addEventListener('hashchange',()=>{if(directions[location.hash.slice(1)])setDirection(location.hash.slice(1));});
  if(new URLSearchParams(location.search).has('canvas'))document.body.classList.add('canvas-only');
  setDirection(direction);render();
})();
