const protocols = [
  { id: 'merchant-service', name: '商家服务协议', target: '商家', version: 'V2.1.0', status: 'published', force: true, updated: '2026-08-24 10:30', author: '张三' },
  { id: 'merchant-privacy', name: '商家隐私保护协议', target: '商家', version: 'V1.8.0', status: 'published', force: false, updated: '2026-08-22 16:20', author: '李四' },
  { id: 'logistics-fee', name: '物流费代收代付协议', target: '商家', version: 'V1.3.0', status: 'pending', force: true, updated: '2026-08-21 09:45', author: '王五' },
  { id: 'user-registration', name: '用户注册协议', target: '用户', version: 'V3.0.0', status: 'published', force: false, updated: '2026-08-18 14:08', author: '赵六' },
  { id: 'promoter-registration', name: '推广注册协议', target: '推客', version: 'V1.1.0', status: 'draft', force: false, updated: '2026-08-17 18:36', author: '陈晨' },
  { id: 'open-platform', name: '开放平台服务协议', target: '推客', version: 'V2.0.0', status: 'published', force: true, updated: '2026-08-15 11:15', author: '周敏' }
];

const versionRecords = {
  'merchant-service': [
    { id: 'v210', version: 'V2.1.0', status: 'published', force: true, createdAt: '2026-08-20 09:12', publishedAt: '2026-08-24 10:30', creator: '张三', publisher: '张三', description: '优化商家服务范围与平台责任说明。' },
    { id: 'v200', version: 'V2.0.0', status: 'pending', force: false, createdAt: '2026-06-12 14:30', publishedAt: '—', creator: '李四', publisher: '—', description: '更新商家入驻与结算相关条款。' },
    { id: 'v150', version: 'V1.5.0', status: 'published', force: true, createdAt: '2026-03-06 10:05', publishedAt: '2026-03-10 16:40', creator: '王五', publisher: '王五', description: '补充商家履约与违约处理规则。' },
    { id: 'v100', version: 'V1.0.0', status: 'published', force: false, createdAt: '2025-11-18 09:30', publishedAt: '2025-11-22 15:00', creator: '张三', publisher: '张三', description: '商家服务协议首个正式版本。' },
    { id: 'v220', version: 'V2.2.0', status: 'draft', force: true, createdAt: '2026-08-25 09:20', publishedAt: '—', creator: '张三', publisher: '—', description: '更新服务费用说明，待补充协议内容。' }
  ]
};

const languages = ['中文', 'English', 'Français', 'Deutsch', 'Italiano', 'Español'];
const platforms = ['PC端', 'APP端', 'H5端'];
const defaultContentMatrix = [
  { platform: 'PC端', language: '中文', fallback: true, platformDefault: true },
  { platform: 'PC端', language: 'English' },
  { platform: 'PC端', language: 'Français' },
  { platform: 'PC端', language: 'Deutsch' },
  { platform: 'APP端', language: '中文', platformDefault: true },
  { platform: 'APP端', language: 'English' },
  { platform: 'H5端', language: '中文', platformDefault: true }
];
const versionContentMatrix = { v220: defaultContentMatrix.map(item => ({ ...item })) };

const operationLogs = [
  { id: 'log-01', time: '2026-08-24 10:30', operator: '张三', type: '发布', protocol: '商家服务协议', version: 'V2.1.0', content: '发布协议版本', platform: 'PC端', language: '中文' },
  { id: 'log-02', time: '2026-08-24 10:20', operator: '张三', type: '编辑内容', protocol: '商家服务协议', version: 'V2.1.0', content: '修改第 3 条服务费用说明', platform: 'PC端', language: '中文', before: '平台收取 5% 服务费。', after: '平台收取 6% 服务费。' },
  { id: 'log-03', time: '2026-08-24 10:10', operator: '李四', type: '新增端语言', protocol: '商家服务协议', version: 'V2.1.0', content: '新增 APP端 / English 协议内容', platform: 'APP端', language: 'English' },
  { id: 'log-04', time: '2026-08-23 16:40', operator: '张三', type: '创建版本', protocol: '商家服务协议', version: 'V2.2.0', content: '创建协议草稿版本', platform: '—', language: '—' },
  { id: 'log-05', time: '2026-08-23 15:12', operator: '张三', type: '修改基础信息', protocol: '商家服务协议', version: 'V2.2.0', content: '开启强制重签', platform: '—', language: '—' },
  { id: 'log-06', time: '2026-08-22 11:20', operator: '王五', type: '提交审核', protocol: '商家服务协议', version: 'V2.0.0', content: '提交协议版本审核', platform: '—', language: '—' }
];

const statusName = { published: '已发布', pending: '待发布', draft: '草稿' };
const app = document.querySelector('#app-content');
const toast = document.querySelector('#toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

function showTableLoading(selector, columns, onComplete) {
  const body = document.querySelector(selector);
  if (!body) return;
  body.setAttribute('aria-busy', 'true');
  body.innerHTML = Array.from({ length: 4 }, () => `<tr class="loading-row">${Array.from({ length: columns }, () => '<td><span class="skeleton"></span></td>').join('')}</tr>`).join('');
  setTimeout(() => { body.removeAttribute('aria-busy'); onComplete(); }, 360);
}

function tag(status) { return `<span class="tag ${status}"><i></i>${statusName[status]}</span>`; }

function protocolPage() {
  app.innerHTML = `
    <div class="page-heading">
      <div><div class="eyebrow">协议生命周期管理</div><h1>协议管理</h1><p>统一维护平台协议及其发布状态，保障协议内容清晰、可追溯。</p></div>
      <div class="page-actions"><button class="reset-button" id="open-operation-logs">修改记录</button><button class="primary-button" id="create-protocol"><span>＋</span>新建协议</button></div>
    </div>
    <section class="stat-grid" aria-label="协议统计">
      <button class="stat-card selected" data-status="all"><span class="stat-icon total">▤</span><span><small>全部协议</small><strong>24</strong><em>较上月 <b>+3</b></em></span></button>
      <button class="stat-card" data-status="published"><span class="stat-icon published">✓</span><span><small>已发布</small><strong>16</strong><em>占全部协议 <b>66.7%</b></em></span></button>
      <button class="stat-card" data-status="pending"><span class="stat-icon pending">◷</span><span><small>待发布</small><strong>3</strong><em>请及时完成发布</em></span></button>
      <button class="stat-card" data-status="draft"><span class="stat-icon draft">✎</span><span><small>草稿</small><strong>5</strong><em>可继续编辑</em></span></button>
    </section>
    <section class="filter-card">
      <div class="filter-title"><span class="filter-icon">⌘</span><strong>筛选条件</strong><span>支持组合条件快速查找协议</span></div>
      <form class="filters" id="filter-form">
        <label>协议对象<select id="target-filter"><option value="">全部对象</option><option>商家</option><option>用户</option><option>推客</option></select></label>
        <label>协议状态<select id="status-filter"><option value="">全部状态</option><option value="published">已发布</option><option value="pending">待发布</option><option value="draft">草稿</option></select></label>
        <label class="name-filter">协议名称<input id="name-filter" placeholder="请输入协议名称" /></label>
        <div class="filter-actions"><button class="primary-button query" type="submit">查询</button><button class="reset-button" id="reset-button" type="button">重置</button></div>
      </form>
    </section>
    <section class="table-card">
      <div class="table-toolbar"><div><h2>协议列表</h2><span id="result-count">共 6 条记录</span></div><button class="refresh-button" id="refresh-button">↻ 刷新</button></div>
      <div class="table-wrap"><table><thead><tr><th>协议名称</th><th>协议对象</th><th>最新版本</th><th>状态</th><th>强制重签</th><th>最近更新时间</th><th>操作</th></tr></thead><tbody id="protocol-table"></tbody></table></div>
      <div class="table-footer"><span>每页 10 条 <span class="down">⌄</span></span><div class="pagination"><button disabled>‹</button><button class="current">1</button><button>›</button></div></div>
    </section>`;
  renderTable(protocols);
  bindProtocolActions();
}

function renderTable(rows) {
  const body = document.querySelector('#protocol-table');
  document.querySelector('#result-count').textContent = `共 ${rows.length} 条记录`;
  body.innerHTML = rows.length ? rows.map(p => `<tr><td><div class="protocol-name">${p.name}<span class="subline">ID: ${p.id}</span></div></td><td>${p.target}</td><td><span class="version">${p.version}</span></td><td>${tag(p.status)}</td><td>${p.force ? '<span class="force-tag">强制重签</span>' : '<span class="muted">—</span>'}</td><td><div>${p.updated}<span class="subline">${p.author} 更新</span></div></td><td><button class="text-button manage-version" data-id="${p.id}">版本管理 <span>›</span></button></td></tr>`).join('') : `<tr><td colspan="7"><div class="empty"><span>⌕</span><strong>暂无匹配的协议</strong><p>请调整筛选条件后重试</p></div></td></tr>`;
  document.querySelectorAll('.manage-version').forEach(button => button.addEventListener('click', () => {
    navigate(`/protocols/${button.dataset.id}/versions`);
  }));
}

function bindProtocolActions() {
  const form = document.querySelector('#filter-form');
  form.addEventListener('submit', event => { event.preventDefault(); applyFilters(); });
  document.querySelector('#reset-button').addEventListener('click', () => { form.reset(); document.querySelectorAll('.stat-card').forEach(x => x.classList.remove('selected')); document.querySelector('[data-status="all"]').classList.add('selected'); renderTable(protocols); });
  document.querySelectorAll('.stat-card').forEach(card => card.addEventListener('click', () => {
    document.querySelectorAll('.stat-card').forEach(x => x.classList.remove('selected')); card.classList.add('selected');
    document.querySelector('#status-filter').value = card.dataset.status === 'all' ? '' : card.dataset.status; applyFilters();
  }));
  document.querySelector('#refresh-button').addEventListener('click', () => { showTableLoading('#protocol-table', 7, () => { renderTable(protocols); showToast('协议列表已刷新'); }); });
  document.querySelector('#open-operation-logs').addEventListener('click', () => navigate('/operation-logs'));
  document.querySelector('#create-protocol').addEventListener('click', openNewProtocolModal);
}

function applyFilters() {
  const target = document.querySelector('#target-filter').value;
  const status = document.querySelector('#status-filter').value;
  const keyword = document.querySelector('#name-filter').value.trim();
  renderTable(protocols.filter(p => (!target || p.target === target) && (!status || p.status === status) && (!keyword || p.name.includes(keyword))));
}

function openNewProtocolModal() {
  openModal('新建协议', `<div class="modal-form new-protocol-form"><label>协议名称<span class="required-mark">*</span><input id="new-protocol-name" placeholder="请输入协议名称" maxlength="40" /></label><label>协议对象<span class="required-mark">*</span><select id="new-protocol-target"><option value="">请选择协议对象</option><option>商家</option><option>用户</option><option>推客</option></select></label><div class="form-split"><label>初始版本号<input id="new-protocol-version" value="V1.0.0" /></label><label class="switch-field"><span>强制重签</span><input id="new-protocol-force" type="checkbox"/><i></i><em>发布后要求用户重新签署</em></label></div><label>版本说明<textarea id="new-protocol-description" rows="3" placeholder="请填写本次版本说明"></textarea></label></div>`, '创建协议', () => {
    const name = document.querySelector('#new-protocol-name').value.trim();
    const target = document.querySelector('#new-protocol-target').value;
    const version = document.querySelector('#new-protocol-version').value.trim();
    const description = document.querySelector('#new-protocol-description').value.trim();
    const force = document.querySelector('#new-protocol-force').checked;
    if (!name || !target) return showToast('请填写协议名称并选择协议对象');
    if (!/^V\d+(\.\d+){1,2}$/i.test(version)) return showToast('请输入有效的版本号，例如 V1.0.0');
    if (protocols.some(protocol => protocol.name === name)) return showToast('该协议名称已存在，请重新填写');
    const id = `protocol-${Date.now()}`;
    const versionId = `v${Date.now()}`;
    const now = '2026-08-25 11:30';
    protocols.unshift({ id, name, target, version, status: 'draft', force, updated: now, author: '运营管理员' });
    versionRecords[id] = [{ id: versionId, version, status: 'draft', force, createdAt: now, publishedAt: '—', creator: '运营管理员', publisher: '—', description: description || '请补充本次协议版本说明。' }];
    closeModal(); navigate(`/protocols/${id}/versions/${versionId}`); showToast(`${name} 已创建为草稿`);
  });
}

function operationLogPage() {
  app.innerHTML = `
    <div class="page-heading"><div><div class="eyebrow">协议操作审计</div><h1>修改记录</h1><p>查看协议版本从创建、编辑到发布的完整操作轨迹。</p></div><button class="reset-button" id="back-from-logs">返回协议管理</button></div>
    <section class="filter-card log-filter-card"><div class="filter-title"><span class="filter-icon">⌘</span><strong>筛选条件</strong><span>按协议、版本、操作人及操作类型快速检索</span></div><form class="log-filters" id="log-filter-form"><label>协议<select id="log-protocol"><option value="">全部协议</option><option>商家服务协议</option></select></label><label>版本<select id="log-version"><option value="">全部版本</option>${['V2.2.0','V2.1.0','V2.0.0'].map(version => `<option>${version}</option>`).join('')}</select></label><label>操作人<select id="log-operator"><option value="">全部操作人</option>${['张三','李四','王五'].map(operator => `<option>${operator}</option>`).join('')}</select></label><label>操作类型<select id="log-type"><option value="">全部类型</option>${['创建版本','编辑内容','新增端语言','修改基础信息','提交审核','发布'].map(type => `<option>${type}</option>`).join('')}</select></label><label class="date-range">时间范围<div><input id="log-date-start" type="date"/><span>至</span><input id="log-date-end" type="date"/></div></label><div class="filter-actions"><button class="primary-button query" type="submit">查询</button><button class="reset-button" id="reset-log-filter" type="button">重置</button></div></form></section>
    <section class="table-card"><div class="table-toolbar"><div><h2>操作记录</h2><span id="log-result-count">共 ${operationLogs.length} 条记录</span></div><button class="refresh-button" id="refresh-logs">↻ 刷新</button></div><div class="table-wrap"><table class="log-table"><thead><tr><th>时间</th><th>操作人</th><th>操作类型</th><th>协议</th><th>版本</th><th>操作内容</th><th>操作</th></tr></thead><tbody id="operation-log-table"></tbody></table></div><div class="table-footer"><span>每页 10 条 <span class="down">⌄</span></span><div class="pagination"><button disabled>‹</button><button class="current">1</button><button>›</button></div></div></section>`;
  renderOperationLogs(operationLogs);
  document.querySelector('#back-from-logs').addEventListener('click', () => navigate('/protocols'));
  document.querySelector('#refresh-logs').addEventListener('click', () => showTableLoading('#operation-log-table', 7, () => { renderOperationLogs(operationLogs); showToast('修改记录已刷新'); }));
  const form = document.querySelector('#log-filter-form');
  form.addEventListener('submit', event => { event.preventDefault(); applyLogFilters(); });
  document.querySelector('#reset-log-filter').addEventListener('click', () => { form.reset(); renderOperationLogs(operationLogs); });
}

function renderOperationLogs(rows) {
  const body = document.querySelector('#operation-log-table');
  document.querySelector('#log-result-count').textContent = `共 ${rows.length} 条记录`;
  body.innerHTML = rows.length ? rows.map(item => `<tr><td>${item.time}</td><td>${item.operator}</td><td><span class="operation-type ${operationTypeClass(item.type)}">${item.type}</span></td><td>${item.protocol}</td><td><span class="version">${item.version}</span></td><td class="log-content">${item.content}</td><td><button class="text-button view-log" data-id="${item.id}">查看详情 <span>›</span></button></td></tr>`).join('') : `<tr><td colspan="7"><div class="empty"><span>⌕</span><strong>暂无匹配的操作记录</strong><p>请调整筛选条件后重试</p></div></td></tr>`;
  body.querySelectorAll('.view-log').forEach(button => button.addEventListener('click', () => openOperationLogDrawer(operationLogs.find(item => item.id === button.dataset.id))));
}

function operationTypeClass(type) { return ({ '发布': 'publish', '提交审核': 'review', '编辑内容': 'edit', '新增端语言': 'add', '创建版本': 'create', '修改基础信息': 'basic' })[type] || 'basic'; }

function applyLogFilters() {
  const protocol = document.querySelector('#log-protocol').value;
  const version = document.querySelector('#log-version').value;
  const operator = document.querySelector('#log-operator').value;
  const type = document.querySelector('#log-type').value;
  const start = document.querySelector('#log-date-start').value;
  const end = document.querySelector('#log-date-end').value;
  renderOperationLogs(operationLogs.filter(item => (!protocol || item.protocol === protocol) && (!version || item.version === version) && (!operator || item.operator === operator) && (!type || item.type === type) && (!start || item.time.slice(0, 10) >= start) && (!end || item.time.slice(0, 10) <= end)));
}

function openOperationLogDrawer(item) {
  document.querySelector('#log-drawer-layer')?.remove();
  document.body.insertAdjacentHTML('beforeend', `<div class="drawer-layer" id="log-drawer-layer"><aside class="content-drawer log-drawer" role="dialog" aria-modal="true" aria-labelledby="log-drawer-title"><div class="drawer-head"><div><span class="drawer-kicker">操作记录详情</span><h2 id="log-drawer-title">${item.type}</h2></div><button class="close-log-drawer" aria-label="关闭">×</button></div><div class="drawer-body"><dl class="drawer-info log-drawer-info"><div><dt>操作人</dt><dd>${item.operator}</dd></div><div><dt>操作时间</dt><dd>${item.time}</dd></div><div><dt>协议</dt><dd>${item.protocol}</dd></div><div><dt>版本</dt><dd class="version">${item.version}</dd></div><div><dt>终端</dt><dd>${item.platform}</dd></div><div><dt>语言</dt><dd>${item.language}</dd></div><div><dt>操作类型</dt><dd><span class="operation-type ${operationTypeClass(item.type)}">${item.type}</span></dd></div></dl>${item.before ? `<section class="content-diff"><h3>正文修改对比</h3><div><span>修改前</span><p>${item.before}</p></div><div><span>修改后</span><p>${item.after}</p></div></section>` : `<div class="drawer-tip">${item.content}</div>`}</div><div class="drawer-foot"><button class="primary-button close-log-detail">关闭</button></div></aside></div>`);
  const close = () => document.querySelector('#log-drawer-layer')?.remove();
  document.querySelector('.close-log-drawer').addEventListener('click', close);
  document.querySelector('.close-log-detail').addEventListener('click', close);
  document.querySelector('#log-drawer-layer').addEventListener('click', event => { if (event.target.id === 'log-drawer-layer') close(); });
}

function placeholder(title, message) {
  app.innerHTML = `<div class="placeholder-page"><div class="placeholder-icon">◫</div><div class="eyebrow">协议管理中心</div><h1>${title}</h1><p>${message}</p><button class="primary-button" id="back-protocols">返回协议管理</button></div>`;
  document.querySelector('#back-protocols').addEventListener('click', () => navigate('/protocols'));
}

function getProtocol(id) { return protocols.find(protocol => protocol.id === id) || protocols[0]; }
function getVersion(protocolId, versionId) { return (versionRecords[protocolId] || []).find(version => version.id === versionId); }

function versionParts(value) {
  const match = String(value || '').match(/^V(\d+)(?:\.(\d+))?(?:\.(\d+))?$/i);
  return match ? match.slice(1).map(part => Number(part || 0)) : [0, 0, 0];
}

function compareVersions(left, right) {
  const a = versionParts(left);
  const b = versionParts(right);
  for (let index = 0; index < 3; index += 1) {
    if (a[index] !== b[index]) return b[index] - a[index];
  }
  return 0;
}

function latestPublishedVersion(protocolId) {
  const published = (versionRecords[protocolId] || [])
    .filter(version => version.status === 'published')
    .sort((left, right) => compareVersions(left.version, right.version))[0];
  if (published) return published;
  const protocol = protocols.find(item => item.id === protocolId);
  return protocol?.status === 'published' ? { id: `baseline-${protocolId}`, version: protocol.version } : null;
}

function nextVersionNumber(protocolId) {
  const protocol = protocols.find(item => item.id === protocolId);
  const versions = [...(versionRecords[protocolId] || [])];
  if (protocol?.version && !versions.some(item => item.version === protocol.version)) versions.push({ version: protocol.version });
  const highest = [...versions].sort((left, right) => compareVersions(left.version, right.version))[0];
  const [major, minor] = versionParts(highest?.version || 'V1.0.0');
  return `V${Math.max(1, major)}.${minor + 1}.0`;
}

function currentDateTime() {
  const now = new Date();
  const part = value => String(value).padStart(2, '0');
  return `${now.getFullYear()}-${part(now.getMonth() + 1)}-${part(now.getDate())} ${part(now.getHours())}:${part(now.getMinutes())}`;
}

function openOrCreateDraft(protocol) {
  const versions = versionRecords[protocol.id] || (versionRecords[protocol.id] = []);
  const existing = versions.find(version => version.status === 'draft');
  if (existing) {
    return openModal('已有草稿版本', `<div class="confirm-copy"><span class="notice-mark">i</span><div><strong>${existing.version} 正在编辑中</strong><p>同一份协议暂不支持同时创建多个草稿。你可以继续完成当前草稿，或在版本列表中删除后重新创建。</p></div></div>`, '继续编辑', () => {
      closeModal();
      navigate(`/protocols/${protocol.id}/versions/${existing.id}`);
    });
  }
  const online = latestPublishedVersion(protocol.id);
  openModal('新建版本', `<div class="modal-form new-protocol-form">
    <label>版本号<span class="required-mark">*</span><input id="create-version-number" value="${nextVersionNumber(protocol.id)}" placeholder="例如 V2.2.0" /></label>
    <label>版本说明<span class="required-mark">*</span><textarea id="create-version-description" rows="4" maxlength="200" placeholder="请说明本次协议调整内容"></textarea></label>
    <label class="switch-field"><span>强制重签</span><input id="create-version-force" type="checkbox"/><i></i><em>发布后要求相关用户重新签署</em></label>
    <label class="switch-field"><span>继承线上配置</span><input id="create-version-inherit" type="checkbox" ${online ? 'checked' : 'disabled'}/><i></i><em>${online ? `复制 ${online.version} 的端、语言与协议内容配置` : '当前没有可继承的线上版本'}</em></label>
  </div>`, '创建草稿', () => {
    const version = document.querySelector('#create-version-number').value.trim().toUpperCase();
    const description = document.querySelector('#create-version-description').value.trim();
    const force = document.querySelector('#create-version-force').checked;
    const inherit = document.querySelector('#create-version-inherit').checked;
    if (!/^V\d+\.\d+\.\d+$/.test(version)) return showToast('请输入有效的版本号，例如 V2.2.0');
    if (versions.some(item => item.version.toUpperCase() === version)) return showToast(`${version} 已存在，请修改版本号`);
    if (!description) return showToast('请填写本次版本说明');
    const now = currentDateTime();
    const draft = { id: `v${versionParts(version).join('')}-${Date.now()}`, version, status: 'draft', force, createdAt: now, publishedAt: '—', creator: '运营管理员', publisher: '—', description };
    versions.unshift(draft);
    if (inherit && online) versionContentMatrix[draft.id] = getContentMatrix(online.id).map(item => ({ ...item }));
    operationLogs.unshift({ id: `log-${Date.now()}`, time: now, operator: '运营管理员', type: '创建版本', protocol: protocol.name, version, content: inherit && online ? `基于 ${online.version} 创建协议草稿版本` : '创建空白协议草稿版本', platform: '—', language: '—' });
    closeModal();
    navigate(`/protocols/${protocol.id}/versions/${draft.id}`);
    showToast(`${version} 草稿已创建`);
  });
}

function versionListPage(protocol) {
  const versions = versionRecords[protocol.id] || [];
  app.innerHTML = `
    <div class="version-breadcrumb"><button class="back-link" id="back-protocol-list">‹ 返回协议列表</button><span>协议管理</span><b>/</b><strong>${protocol.name}</strong></div>
    <div class="version-heading">
      <div><div class="eyebrow">协议版本管理</div><h1>${protocol.name}</h1><div class="protocol-meta"><span>协议对象：<b>${protocol.target}</b></span><i></i><span>当前线上版本：<b class="online-version">${latestPublishedVersion(protocol.id)?.version || '—'}</b></span></div></div>
      <button class="primary-button" id="new-version"><span>＋</span>新建版本</button>
    </div>
    <section class="version-notice"><span class="notice-mark">i</span><span>协议正式发布后将自动锁定；如需调整内容，请基于当前协议创建新的版本。</span></section>
    <section class="table-card version-table-card">
      <div class="table-toolbar"><div><h2>版本列表</h2><span>共 ${versions.length} 个版本</span></div><button class="refresh-button" id="refresh-versions">↻ 刷新</button></div>
      <div class="table-wrap"><table><thead><tr><th>版本号</th><th>状态</th><th>强制重签</th><th>创建时间</th><th>发布时间</th><th>创建人</th><th>操作</th></tr></thead><tbody id="version-table"></tbody></table></div>
      <div class="table-footer"><span>每页 10 条 <span class="down">⌄</span></span><div class="pagination"><button disabled>‹</button><button class="current">1</button><button>›</button></div></div>
    </section>`;
  renderVersionTable(protocol, versions);
  document.querySelector('#back-protocol-list').addEventListener('click', () => navigate('/protocols'));
  document.querySelector('#new-version').addEventListener('click', () => openOrCreateDraft(protocol));
  document.querySelector('#refresh-versions').addEventListener('click', () => showTableLoading('#version-table', 7, () => { renderVersionTable(protocol, versionRecords[protocol.id] || []); showToast('版本列表已刷新'); }));
}

function renderVersionTable(protocol, versions) {
  const body = document.querySelector('#version-table');
  body.innerHTML = versions.map(record => `<tr>
    <td><span class="version strong-version">${record.version}</span>${record.status === 'draft' ? '<span class="subline">尚未提交发布</span>' : ''}</td>
    <td>${tag(record.status)}</td>
    <td>${record.force ? '<span class="force-tag">是</span>' : '<span class="force-tag force-off">否</span>'}</td>
    <td>${record.createdAt}</td>
    <td>${record.publishedAt}</td>
    <td>${record.creator}</td>
    <td>${record.status === 'draft'
      ? `<button class="text-button continue-edit" data-version="${record.id}">继续编辑</button><button class="text-button ready-draft" data-version="${record.id}">确认已编辑好</button><button class="text-button danger-link delete-draft" data-version="${record.id}">删除草稿</button>`
      : record.status === 'pending'
        ? `<button class="text-button view-version" data-version="${record.id}">查看详情 <span>›</span></button><button class="text-button back-to-draft" data-version="${record.id}">回到草稿</button><button class="text-button publish-version" data-version="${record.id}">确认发布</button>`
        : `<button class="text-button view-version" data-version="${record.id}">查看详情 <span>›</span></button>`}</td>
  </tr>`).join('');
  body.querySelectorAll('.view-version').forEach(button => button.addEventListener('click', () => navigate(`/protocols/${protocol.id}/versions/${button.dataset.version}`)));
  body.querySelectorAll('.continue-edit').forEach(button => button.addEventListener('click', () => navigate(`/protocols/${protocol.id}/versions/${button.dataset.version}`)));
  body.querySelectorAll('.ready-draft').forEach(button => button.addEventListener('click', () => confirmDraftReady(protocol, button.dataset.version)));
  body.querySelectorAll('.back-to-draft').forEach(button => button.addEventListener('click', () => confirmBackToDraft(protocol, button.dataset.version)));
  body.querySelectorAll('.publish-version').forEach(button => button.addEventListener('click', () => confirmPublish(protocol, button.dataset.version)));
  body.querySelectorAll('.delete-draft').forEach(button => button.addEventListener('click', () => confirmDeleteDraft(protocol, button.dataset.version)));
}

function versionDetailPage(protocol, record, isEditing = false, activeTab = 'basic') {
  if (!record) return navigate(`/protocols/${protocol.id}/versions`, true);
  app.innerHTML = `
    <div class="version-breadcrumb"><button class="back-link" id="back-version-list">‹ 返回版本列表</button><span>协议管理</span><b>/</b><span>${protocol.name}</span><b>/</b><strong>${record.version}</strong></div>
    <div class="version-heading detail-heading">
      <div><div class="eyebrow">协议版本详情</div><div class="title-line"><h1>${record.version}</h1>${tag(record.status)}</div><p>${protocol.name} · ${protocol.target}</p></div>
      ${record.status === 'draft' ? `<div class="detail-actions">${!isEditing && activeTab === 'basic' ? '<button class="reset-button" id="edit-draft">继续编辑</button>' : ''}<button class="primary-button" id="submit-review">提交审核</button></div>` : record.status === 'pending' ? '<div class="detail-actions"><button class="primary-button" id="confirm-pending-publish">确认发布</button></div>' : '<div class="detail-actions"><button class="primary-button" id="create-new-version"><span>＋</span>创建新版本</button></div>'}
    </div>
    <section class="detail-card">
      <div class="tabs" role="tablist">
        <button class="tab ${activeTab === 'basic' ? 'active' : ''}" data-tab="basic">基本信息</button><button class="tab ${activeTab === 'languages' ? 'active' : ''}" data-tab="languages">多语言 & 多端协议内容</button><button class="tab" data-tab="logs">修改记录</button>
      </div>
      <div class="detail-body" id="detail-body">${activeTab === 'languages' ? languageConfigPage(record) : basicInfo(record, isEditing)}</div>
    </section>`;
  document.querySelector('#back-version-list').addEventListener('click', () => navigate(`/protocols/${protocol.id}/versions`));
  document.querySelectorAll('.tab').forEach(button => button.addEventListener('click', () => {
    if (button.dataset.tab === 'basic') return versionDetailPage(protocol, record);
    if (button.dataset.tab === 'languages') return versionDetailPage(protocol, record, false, 'languages');
    if (button.dataset.tab === 'logs') return navigate('/operation-logs');
    showToast('该模块将在后续轮次中开放');
  }));
  document.querySelector('#edit-draft')?.addEventListener('click', () => versionDetailPage(protocol, record, true));
  document.querySelector('#submit-review')?.addEventListener('click', () => openPublishPrecheck(protocol, record));
  document.querySelector('#confirm-pending-publish')?.addEventListener('click', () => openPublishConfirmation(protocol, record));
  document.querySelector('#create-new-version')?.addEventListener('click', () => openOrCreateDraft(protocol));
  document.querySelector('#cancel-basic-edit')?.addEventListener('click', () => versionDetailPage(protocol, record));
  document.querySelector('#save-basic-info')?.addEventListener('click', () => {
    const version = document.querySelector('#edit-version').value.trim();
    const description = document.querySelector('#edit-description').value.trim();
    const force = document.querySelector('#edit-force').checked;
    if (!version) return showToast('请填写版本号');
    const save = () => {
      record.version = version;
      record.force = force;
      record.description = description || '暂未填写版本说明';
      versionDetailPage(protocol, record); showToast('版本基本信息已保存');
    };
    if (!record.force && force) return confirmForceResign(save);
    save();
  });
  document.querySelector('#select-global-fallback')?.addEventListener('click', () => openFallbackSelector(protocol, record));
  document.querySelectorAll('.select-platform-fallback').forEach(button => button.addEventListener('click', () => openPlatformFallbackSelector(protocol, record, button.dataset.platform)));
  document.querySelectorAll('.matrix-open').forEach(button => button.addEventListener('click', () => openContentDrawer(protocol, record, button.dataset.platform, button.dataset.language)));
  document.querySelectorAll('.matrix-view').forEach(button => button.addEventListener('click', () => openProtocolPreview(record, button.dataset.platform, button.dataset.language)));
  document.querySelectorAll('.matrix-edit').forEach(button => button.addEventListener('click', () => openProtocolEditor(protocol, record, button.dataset.platform, button.dataset.language)));
  document.querySelectorAll('.matrix-add').forEach(button => button.addEventListener('click', () => openContentDrawer(protocol, record, button.dataset.platform, button.dataset.language)));
  document.querySelectorAll('.matrix-locked').forEach(button => button.addEventListener('click', () => showToast('该协议版本已正式发布，已有内容不可修改；如需调整请创建新版本')));
}

function confirmForceResign(onConfirm) {
  openModal('确认开启强制重签', `<div class="confirm-copy"><span class="warning-icon">!</span><div><strong>开启后将影响协议签署用户</strong><p>协议正式发布后，相关用户需要重新确认并签署该协议版本。请确认此设置符合业务要求。</p></div></div>`, '确认开启', () => { closeModal(); onConfirm(); });
}

function basicInfo(record, isEditing = false) {
  return `<div class="info-section"><div class="section-title"><h2>基本信息</h2><span>版本创建后留存的基础配置</span></div><dl class="info-grid">
    <div><dt>版本号</dt><dd>${isEditing ? `<input class="inline-control version-input" id="edit-version" value="${record.version}" />` : `<span class="version strong-version">${record.version}</span>`}</dd></div><div><dt>版本状态</dt><dd>${tag(record.status)}</dd></div>
    <div><dt>强制重签</dt><dd>${isEditing ? `<label class="inline-switch"><input id="edit-force" type="checkbox" ${record.force ? 'checked' : ''}/><i></i><span>开启后，用户需重新签署</span></label>` : record.force ? '<span class="force-tag">是，用户需重新签署</span>' : '<span class="force-tag force-off">否</span>'}</dd></div><div><dt>版本说明</dt><dd class="description">${isEditing ? `<textarea class="inline-control description-input" id="edit-description" rows="3">${record.description}</textarea>` : record.description}</dd></div>
    <div><dt>创建时间</dt><dd>${record.createdAt}</dd></div><div><dt>创建人</dt><dd>${record.creator}</dd></div>
    <div><dt>发布时间</dt><dd>${record.publishedAt}</dd></div><div><dt>发布人</dt><dd>${record.publisher}</dd></div>
  </dl>${isEditing ? '<div class="basic-edit-actions"><button class="reset-button" id="cancel-basic-edit">取消</button><button class="primary-button" id="save-basic-info">保存修改</button></div>' : ''}</div>`;
}

function getContentMatrix(versionId) {
  if (!versionContentMatrix[versionId]) versionContentMatrix[versionId] = defaultContentMatrix.map(item => ({ ...item }));
  return versionContentMatrix[versionId];
}

function languageConfigPage(record) {
  const matrix = getContentMatrix(record.id);
  const configuredCount = matrix.length;
  const fallback = matrix.find(item => item.fallback) || matrix[0];
  const platformDefaults = platforms.map(platform => ({ platform, item: matrix.find(item => item.platform === platform && item.platformDefault) || matrix.find(item => item.platform === platform) }));
  const locked = record.status === 'published';
  return `<div class="language-page">
    <section class="fallback-card"><div class="fallback-copy"><div class="fallback-title"><span class="fallback-icon">◎</span><strong>默认兜底配置</strong><span class="fallback-tag">默认兜底</span>${locked ? '<span class="locked-badge">🔒 已锁定</span>' : ''}</div><p>为每个终端选择默认语言；当没有匹配内容时，系统再使用全局兜底组合。</p></div><div class="fallback-configs"><div class="global-fallback"><small>全局兜底组合</small><strong>${fallback.platform} <i>+</i> ${fallback.language}</strong>${locked ? '<span class="locked-default">已锁定</span>' : '<button class="reset-button select-fallback" id="select-global-fallback">修改</button>'}</div>${platformDefaults.map(({ platform, item }) => `<div class="platform-fallback"><small>${platform}默认语言</small><strong>${item?.language || '未设置'}</strong>${locked ? '<span class="locked-default">已锁定</span>' : `<button class="text-button select-platform-fallback" data-platform="${platform}">修改</button>`}</div>`).join('')}</div></section>
    <section class="matrix-panel"><div class="section-title"><h2>多端多语言协议内容</h2><span>已配置 ${configuredCount} / ${platforms.length * languages.length} 个内容组合，${record.status === 'published' ? '已发布版本的既有内容已锁定，缺失组合仍可补充' : record.status === 'pending' ? '待发布版本仅可查看协议' : '可直接查看或编辑协议'}</span></div><div class="matrix-legend"><span><i class="legend-dot configured-dot"></i>已配置</span><span><i class="legend-dot empty-dot"></i>未配置</span><span><i class="legend-dot default-dot"></i>默认兜底</span>${locked ? '<span><i class="legend-dot locked-dot"></i>已锁定</span>' : ''}</div><div class="matrix-scroll"><table class="language-matrix"><thead><tr><th>终端 / 语言</th>${languages.map(language => `<th>${language}</th>`).join('')}</tr></thead><tbody>${platforms.map(platform => `<tr><th>${platform}</th>${languages.map(language => matrixCell(matrix, platform, language, record.status)).join('')}</tr>`).join('')}</tbody></table></div></section>
    <section class="rule-card"><div class="rule-title"><span>?</span><div><h3>协议内容匹配规则</h3><p>用户查看协议时，系统按以下顺序匹配对应内容。</p></div></div><ol><li><b>优先使用</b> 当前端 + 当前语言</li><li>若不存在，则使用 <b>当前端 + 默认语言</b></li><li>若仍不存在，则使用 <b>默认端 + 默认语言</b></li></ol></section>
  </div>`;
}

function matrixCell(matrix, platform, language, status) {
  const item = matrix.find(config => config.platform === platform && config.language === language);
  if (!item) return `<td><div class="matrix-cell unconfigured">${status === 'pending' ? '<span class="unconfigured-static">未配置</span>' : status === 'published' ? `<button class="matrix-add supplemental" data-platform="${platform}" data-language="${language}"><span class="cell-plus">＋</span><span>补充配置</span></button>` : `<button class="matrix-add" data-platform="${platform}" data-language="${language}"><span class="cell-plus">＋</span><span>新增协议内容</span></button>`}</div></td>`;
  return `<td><div class="matrix-cell configured ${item.fallback ? 'is-default' : ''} ${status === 'published' ? 'is-locked' : ''}"><button class="matrix-open" data-platform="${platform}" data-language="${language}"><span class="cell-status">● 已配置</span>${item.fallback ? '<span class="cell-default">全局兜底</span>' : item.platformDefault ? '<span class="cell-default">端默认</span>' : ''}</button><div class="matrix-actions"><button class="matrix-view" data-platform="${platform}" data-language="${language}">查看协议</button>${status === 'draft' ? `<button class="matrix-edit" data-platform="${platform}" data-language="${language}">编辑协议</button>` : status === 'published' ? `<button class="matrix-locked" data-platform="${platform}" data-language="${language}">🔒 已锁定</button>` : ''}</div></div></td>`;
}

function openContentDrawer(protocol, record, platform, language) {
  const matrix = getContentMatrix(record.id);
  const item = matrix.find(config => config.platform === platform && config.language === language);
  document.querySelector('#drawer-layer')?.remove();
  document.body.insertAdjacentHTML('beforeend', `<div class="drawer-layer" id="drawer-layer"><aside class="content-drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title"><div class="drawer-head"><div><span class="drawer-kicker">端 + 语言协议内容</span><h2 id="drawer-title">${platform} / ${language}</h2></div><button class="close-drawer" aria-label="关闭">×</button></div><div class="drawer-body">${item ? `<div class="drawer-state"><span class="tag published"><i></i>已配置</span>${item.fallback ? '<span class="fallback-tag">全局兜底</span>' : item.platformDefault ? '<span class="fallback-tag">端默认</span>' : ''}${record.status === 'published' ? '<span class="locked-badge">🔒 已锁定</span>' : ''}</div><dl class="drawer-info"><div><dt>终端</dt><dd>${platform}</dd></div><div><dt>语言</dt><dd>${language}</dd></div></dl><div class="drawer-tip">${record.status === 'published' ? '该版本已正式发布，已有协议内容不可修改。若需调整，请创建新版本。' : record.status === 'pending' ? '待发布版本的协议内容仅支持查看。' : '该端与语言组合已配置协议内容，可直接查看或编辑协议。'}</div>` : `<div class="drawer-empty"><span>＋</span><strong>该组合尚未配置内容</strong><p>${record.status === 'published' ? '可补充该组合的协议内容，保存后将立即锁定。' : '新增后即可编辑和查看该协议。'}</p></div>`}</div><div class="drawer-foot">${item ? `<button class="reset-button" id="drawer-view">查看协议</button>${record.status === 'draft' ? '<button class="primary-button" id="drawer-edit">编辑协议</button>' : ''}` : `<button class="primary-button" id="drawer-add">${record.status === 'published' ? '补充配置' : '新增协议内容'}</button>`}</div></aside></div>`);
  document.querySelector('.close-drawer').addEventListener('click', closeDrawer);
  document.querySelector('#drawer-layer').addEventListener('click', event => { if (event.target.id === 'drawer-layer') closeDrawer(); });
  document.querySelector('#drawer-view')?.addEventListener('click', () => { closeDrawer(); openProtocolPreview(record, platform, language); });
  document.querySelector('#drawer-edit')?.addEventListener('click', () => { closeDrawer(); openProtocolEditor(protocol, record, platform, language); });
  document.querySelector('#drawer-add')?.addEventListener('click', () => {
    matrix.push({ platform, language });
    closeDrawer();
    if (record.status === 'published') return openProtocolEditor(protocol, record, platform, language);
    versionDetailPage(protocol, record, false, 'languages'); showToast(`${platform} / ${language} 已新增配置`);
  });
}
function closeDrawer() { document.querySelector('#drawer-layer')?.remove(); }

function openFallbackSelector(protocol, record) {
  const matrix = getContentMatrix(record.id);
  const current = matrix.find(item => item.fallback) || matrix[0];
  openModal('修改全局兜底组合', `<div class="modal-form"><p class="fallback-modal-copy">请选择一个已配置协议内容的终端与语言组合，作为内容匹配的最终兜底。</p><label>默认端<select id="fallback-platform">${platforms.map(platform => `<option ${platform === current.platform ? 'selected' : ''}>${platform}</option>`).join('')}</select></label><label>默认语言<select id="fallback-language">${languages.map(language => `<option ${language === current.language ? 'selected' : ''}>${language}</option>`).join('')}</select></label></div>`, '确认兜底', () => {
    const platform = document.querySelector('#fallback-platform').value;
    const language = document.querySelector('#fallback-language').value;
    const next = matrix.find(item => item.platform === platform && item.language === language);
    if (!next) return showToast('请选择已配置协议内容的组合');
    matrix.forEach(item => { item.fallback = false; });
    next.fallback = true;
    closeModal(); versionDetailPage(protocol, record, false, 'languages'); showToast(`已设置 ${platform} + ${language} 为默认兜底`);
  });
}

function openPlatformFallbackSelector(protocol, record, platform) {
  const matrix = getContentMatrix(record.id);
  const available = matrix.filter(item => item.platform === platform);
  const current = available.find(item => item.platformDefault) || available[0];
  openModal(`修改 ${platform} 默认语言`, `<div class="modal-form"><p class="fallback-modal-copy">请选择 ${platform} 的默认语言。当该端没有当前语言的协议内容时，系统将优先使用此语言。</p><label>默认语言<select id="platform-fallback-language">${available.map(item => `<option ${item.language === current?.language ? 'selected' : ''}>${item.language}</option>`).join('')}</select></label></div>`, '保存默认语言', () => {
    const language = document.querySelector('#platform-fallback-language').value;
    available.forEach(item => { item.platformDefault = false; });
    available.find(item => item.language === language).platformDefault = true;
    closeModal(); versionDetailPage(protocol, record, false, 'languages'); showToast(`已设置 ${platform} 默认语言为 ${language}`);
  });
}

function openProtocolPreview(record, platform, language) {
  const item = getContentMatrix(record.id).find(config => config.platform === platform && config.language === language);
  const content = item?.content || defaultAgreementContent();
  openModal(`${platform} / ${language} 协议预览`, `<article class="protocol-preview">${formatAgreementPreview(content)}</article>`, '关闭', closeModal);
}

function openProtocolEditor(protocol, record, platform, language) {
  const item = getContentMatrix(record.id).find(config => config.platform === platform && config.language === language);
  if (!item) return;
  document.querySelector('#editor-layer')?.remove();
  document.body.insertAdjacentHTML('beforeend', `<div class="editor-layer" id="editor-layer"><section class="protocol-editor" role="dialog" aria-modal="true" aria-labelledby="editor-title"><header class="editor-head"><div><span class="drawer-kicker">协议内容编辑</span><h2 id="editor-title">${platform} / ${language}</h2></div><button class="close-editor" aria-label="关闭">×</button></header><div class="editor-tabs"><button class="editor-tab active" data-mode="word">Word 上传</button><button class="editor-tab" data-mode="rich">富文本编辑</button></div><div class="editor-body" id="editor-body"></div><footer class="editor-foot"><button class="reset-button" id="cancel-editor">取消</button><button class="reset-button" id="preview-editor">预览协议</button><button class="primary-button" id="save-editor">保存草稿</button></footer></section></div>`);
  let mode = 'word';
  const renderEditor = () => {
    const body = document.querySelector('#editor-body');
    body.innerHTML = mode === 'word' ? wordUploadPanel(item) : richEditorPanel(item);
    bindEditorPanel();
  };
  const bindEditorPanel = () => {
    const saveUploadedFile = file => {
      item.fileName = file?.name || '商家服务协议_EN.docx';
      item.fileSize = file ? `${Math.max(1, Math.round(file.size / 1024))} KB` : '128 KB';
      renderEditor();
      showToast('Word 文件上传成功');
    };
    const uploadZone = document.querySelector('#select-word-file');
    uploadZone?.addEventListener('click', () => document.querySelector('#word-file-input').click());
    document.querySelector('#replace-word-file')?.addEventListener('click', () => document.querySelector('#word-file-input').click());
    document.querySelector('#word-file-input')?.addEventListener('change', event => {
      const file = event.target.files?.[0];
      saveUploadedFile(file);
    });
    uploadZone?.addEventListener('dragover', event => { event.preventDefault(); uploadZone.classList.add('drag-over'); });
    uploadZone?.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
    uploadZone?.addEventListener('drop', event => { event.preventDefault(); uploadZone.classList.remove('drag-over'); saveUploadedFile(event.dataTransfer.files?.[0]); });
    document.querySelectorAll('.editor-tool').forEach(button => button.addEventListener('click', () => {
      const command = button.dataset.command;
      if (command === 'formatBlock') document.execCommand(command, false, '<h3>');
      else if (command === 'blockquote') document.execCommand('formatBlock', false, '<blockquote>');
      else if (command === 'createLink') document.execCommand(command, false, 'https://example.com');
      else document.execCommand(command, false, null);
      document.querySelector('#rich-content')?.focus();
    }));
  };
  document.querySelectorAll('.editor-tab').forEach(button => button.addEventListener('click', () => {
    mode = button.dataset.mode;
    document.querySelectorAll('.editor-tab').forEach(tab => tab.classList.toggle('active', tab === button));
    renderEditor();
  }));
  document.querySelector('.close-editor').addEventListener('click', closeProtocolEditor);
  document.querySelector('#cancel-editor').addEventListener('click', closeProtocolEditor);
  document.querySelector('#preview-editor').addEventListener('click', () => {
    if (mode === 'rich') item.content = document.querySelector('#rich-content').innerText.trim() || defaultAgreementContent();
    openProtocolPreview(record, platform, language);
  });
  document.querySelector('#save-editor').addEventListener('click', () => {
    if (mode === 'rich') item.content = document.querySelector('#rich-content').innerText.trim() || defaultAgreementContent();
    closeProtocolEditor(); versionDetailPage(protocol, record, false, 'languages'); showToast(`${platform} / ${language} 协议草稿已保存`);
  });
  document.querySelector('#editor-layer').addEventListener('click', event => { if (event.target.id === 'editor-layer') closeProtocolEditor(); });
  renderEditor();
}

function wordUploadPanel(item) {
  return `<div class="word-panel"><div class="upload-zone" id="select-word-file"><span class="upload-icon">⇧</span><strong>点击上传或拖拽文件至此处</strong><p>支持 .doc / .docx 格式，系统不会解析或存储真实文件</p><button class="reset-button" type="button">选择 Word 文件</button><input id="word-file-input" type="file" accept=".doc,.docx" hidden /></div>${item.fileName ? `<div class="upload-result"><span class="file-icon">W</span><div><strong>${item.fileName}</strong><small>${item.fileSize || '128 KB'} · <b>上传成功</b></small></div><button class="text-button" id="replace-word-file">重新上传</button></div>` : `<div class="upload-hint">上传后将显示文件名称、大小与成功状态。</div>`}</div>`;
}

function richEditorPanel(item) {
  return `<div class="rich-editor"><div class="editor-toolbar" aria-label="富文本工具栏"><button class="editor-tool" data-command="bold" title="加粗"><b>B</b></button><button class="editor-tool" data-command="italic" title="斜体"><i>I</i></button><button class="editor-tool" data-command="underline" title="下划线"><u>U</u></button><span></span><button class="editor-tool text-tool" data-command="formatBlock" title="标题">H</button><button class="editor-tool" data-command="insertOrderedList" title="有序列表">1.</button><button class="editor-tool" data-command="insertUnorderedList" title="无序列表">•</button><button class="editor-tool text-tool" data-command="blockquote" title="引用">❝</button><button class="editor-tool" data-command="createLink" title="链接">⌁</button><span></span><button class="editor-tool" data-command="undo" title="撤销">↶</button><button class="editor-tool" data-command="redo" title="重做">↷</button></div><div class="rich-content" id="rich-content" contenteditable="true">${formatEditableContent(item.content || defaultAgreementContent())}</div></div>`;
}

function defaultAgreementContent() { return 'Merchant Service Agreement\n\n1. General Terms\n\nWelcome to our platform.\n\n2. Merchant Responsibilities\n\nThe merchant shall comply with all applicable laws and regulations.\n\n3. Service Fees\n\nThe platform may charge service fees according to the applicable rules.'; }
function formatEditableContent(content) { return content.split('\n').map(line => line ? `<div>${line}</div>` : '<div><br></div>').join(''); }
function formatAgreementPreview(content) { return content.split('\n\n').map((block, index) => index === 0 ? `<h3>${block}</h3>` : /^\d+\./.test(block) ? `<h4>${block}</h4>` : `<p>${block}</p>`).join(''); }
function closeProtocolEditor() { document.querySelector('#editor-layer')?.remove(); }

function openDraftEditor(protocol, record) {
  openModal(`编辑 ${record.version} 草稿`, `<div class="modal-form"><label>版本说明<textarea id="draft-description" rows="4">${record.description}</textarea></label><label class="switch-field"><span>强制重签</span><input id="draft-force" type="checkbox" ${record.force ? 'checked' : ''}/><i></i><em>开启后，协议发布时将提示用户重新签署</em></label></div>`, '保存修改', () => {
    record.description = document.querySelector('#draft-description').value.trim() || '暂未填写版本说明';
    record.force = document.querySelector('#draft-force').checked;
    closeModal(); versionDetailPage(protocol, record); showToast('草稿基本信息已保存');
  });
}

function confirmDeleteDraft(protocol, versionId) {
  const record = getVersion(protocol.id, versionId);
  openModal('确认删除草稿', `<div class="confirm-copy"><span class="warning-icon">!</span><div><strong>删除后将无法恢复</strong><p>确定删除 ${record.version} 草稿吗？该版本的已配置内容将一并移除。</p></div></div>`, '确认删除', () => {
    versionRecords[protocol.id] = versionRecords[protocol.id].filter(item => item.id !== versionId);
    delete versionContentMatrix[versionId];
    closeModal(); versionListPage(protocol); showToast(`${record.version} 草稿已删除`);
  }, true);
}

function confirmDraftReady(protocol, versionId) {
  const record = getVersion(protocol.id, versionId);
  openModal('确认已编辑好', `<div class="confirm-copy"><span class="warning-icon">!</span><div><strong>确认 ${record.version} 已完成编辑？</strong><p>确认后版本状态将变为“待发布”，仍可在发布前查看和确认。</p></div></div>`, '确认已编辑好', () => {
    record.status = 'pending';
    closeModal(); versionListPage(protocol); showToast(`${record.version} 已进入待发布状态`);
  });
}

function confirmPublish(protocol, versionId) {
  const record = getVersion(protocol.id, versionId);
  openPublishConfirmation(protocol, record);
}

function confirmBackToDraft(protocol, versionId) {
  const record = getVersion(protocol.id, versionId);
  openModal('回到草稿', `<div class="confirm-copy"><span class="warning-icon">!</span><div><strong>确认将 ${record.version} 回退为草稿？</strong><p>回退后可以继续编辑版本的基础信息，且该版本不会被发布。</p></div></div>`, '确认回到草稿', () => {
    record.status = 'draft';
    record.publishedAt = '—';
    record.publisher = '—';
    closeModal(); versionListPage(protocol); showToast(`${record.version} 已回到草稿`);
  });
}

function openPublishPrecheck(protocol, record) {
  const matrix = getContentMatrix(record.id);
  const fallback = matrix.find(item => item.fallback);
  const complete = matrix.length > 0;
  const checks = [
    ['已配置默认端', Boolean(fallback)],
    ['已配置默认语言', platforms.every(platform => matrix.some(item => item.platform === platform && item.platformDefault))],
    ['已存在默认兜底组合', Boolean(fallback)],
    ['协议内容完整', complete],
    ['版本号有效', /^V\d+(\.\d+){1,2}$/i.test(record.version)]
  ];
  const passed = checks.every(([, value]) => value);
  openModal('提交审核前检查', `<div class="publish-precheck"><p>系统已完成提交审核前的配置检查，请确认所有必填项均符合要求。</p><ul>${checks.map(([label, passed]) => `<li class="${passed ? 'passed' : 'failed'}"><span>${passed ? '✓' : '!'}</span>${label}<b>${passed ? '已通过' : '待完善'}</b></li>`).join('')}</ul></div>`, passed ? '提交审核' : '暂不可提交', () => {
    if (!passed) return showToast('请先完成审核前的必填配置');
    record.status = 'pending';
    closeModal(); navigate(`/protocols/${protocol.id}/versions`, true); openReviewSuccess(record);
  });
}

function openPublishConfirmation(protocol, record) {
  const matrix = getContentMatrix(record.id);
  document.querySelector('#publish-layer')?.remove();
  document.body.insertAdjacentHTML('beforeend', `<div class="dialog-layer" id="publish-layer"><div class="modal publish-modal" role="dialog" aria-modal="true" aria-labelledby="publish-title"><div class="modal-head"><h2 id="publish-title">确认发布协议 ${record.version}</h2><button class="close-publish" aria-label="关闭">×</button></div><div class="modal-content"><div class="publish-warning"><span>!</span><div><strong>正式发布后，已有端 + 语言协议内容不可修改。</strong><p>请在发布前确认版本信息及已配置内容准确无误。</p></div></div><dl class="publish-summary"><div><dt>协议名称</dt><dd>${protocol.name}</dd></div><div><dt>版本</dt><dd class="version strong-version">${record.version}</dd></div><div><dt>强制重签</dt><dd>${record.force ? '<span class="force-tag">是</span>' : '<span class="force-tag force-off">否</span>'}</dd></div><div><dt>本次版本说明</dt><dd>${record.description}</dd></div></dl><div class="configured-content"><strong>已配置内容</strong><div>${matrix.map(item => `<span>${item.platform} / ${item.language}${item.fallback ? ' · 默认兜底' : ''}</span>`).join('')}</div></div><label class="publish-check"><input type="checkbox" id="publish-agreement"/><i></i><span>我已确认以上协议版本及发布信息无误</span></label></div><div class="modal-foot"><button class="reset-button cancel-publish">取消</button><button class="primary-button" id="final-publish" disabled>确认发布</button></div></div></div>`);
  const layer = document.querySelector('#publish-layer');
  const close = () => layer.remove();
  document.querySelector('.close-publish').addEventListener('click', close);
  document.querySelector('.cancel-publish').addEventListener('click', close);
  layer.addEventListener('click', event => { if (event.target.id === 'publish-layer') close(); });
  document.querySelector('#publish-agreement').addEventListener('change', event => { document.querySelector('#final-publish').disabled = !event.target.checked; });
  document.querySelector('#final-publish').addEventListener('click', () => {
    const now = currentDateTime();
    record.status = 'published';
    record.publishedAt = now;
    record.publisher = '运营管理员';
    protocol.version = record.version;
    protocol.status = 'published';
    protocol.force = record.force;
    protocol.updated = now;
    protocol.author = '运营管理员';
    operationLogs.unshift({ id: `log-${Date.now()}`, time: now, operator: '运营管理员', type: '发布', protocol: protocol.name, version: record.version, content: '发布协议版本', platform: '—', language: '—' });
    close(); navigate(`/protocols/${protocol.id}/versions`, true); openPublishSuccess(record);
  });
}

function openPublishSuccess(record) {
  openModal('发布成功', `<div class="publish-success"><span>✓</span><strong>${record.version} 已正式发布</strong><p>版本状态已更新为“已发布”。</p></div>`, '返回版本列表', closeModal);
}

function openReviewSuccess(record) {
  openModal('提交审核成功', `<div class="publish-success"><span>✓</span><strong>${record.version} 已提交审核</strong><p>版本状态已更新为“待发布”，确认后可正式发布。</p></div>`, '返回版本列表', closeModal);
}

function openModal(title, content, actionLabel, onConfirm, danger = false) {
  document.querySelector('#dialog-layer')?.remove();
  document.body.insertAdjacentHTML('beforeend', `<div class="dialog-layer" id="dialog-layer"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-head"><h2 id="modal-title">${title}</h2><button class="close-modal" aria-label="关闭">×</button></div><div class="modal-content">${content}</div><div class="modal-foot"><button class="reset-button cancel-modal">取消</button><button class="primary-button ${danger ? 'danger-button' : ''}" id="modal-confirm">${actionLabel}</button></div></div></div>`);
  document.querySelector('.close-modal').addEventListener('click', closeModal);
  document.querySelector('.cancel-modal').addEventListener('click', closeModal);
  document.querySelector('#modal-confirm').addEventListener('click', onConfirm);
  document.querySelector('#dialog-layer').addEventListener('click', event => { if (event.target.id === 'dialog-layer') closeModal(); });
}
function closeModal() { document.querySelector('#dialog-layer')?.remove(); }

function render() {
  const route = location.hash.replace(/^#\/?/, '') || 'protocols';
  const navRoute = route.startsWith('protocols') ? 'protocols' : route;
  document.querySelectorAll('.nav-item').forEach(item => item.classList.toggle('active', item.dataset.route === navRoute));
  if (route === 'protocols') { document.querySelector('#crumb-current').textContent = '协议管理'; protocolPage(); }
  else if (/^protocols\/[^/]+\/versions\/[^/]+$/.test(route)) {
    const [, protocolId, , versionId] = route.split('/');
    const protocol = getProtocol(protocolId);
    document.querySelector('#crumb-current').textContent = '版本详情';
    versionDetailPage(protocol, getVersion(protocolId, versionId));
  }
  else if (/^protocols\/[^/]+\/versions$/.test(route)) {
    const [, protocolId] = route.split('/');
    const protocol = getProtocol(protocolId);
    document.querySelector('#crumb-current').textContent = '版本管理';
    versionListPage(protocol);
  }
  else if (route === 'versions') { document.querySelector('#crumb-current').textContent = '版本管理'; placeholder('版本管理', '请选择一份协议进入其版本管理。'); }
  else if (route === 'operation-logs') { document.querySelector('#crumb-current').textContent = '修改记录'; operationLogPage(); }
  else { navigate('/protocols', true); }
}

function navigate(path, replace = false) {
  const hash = `#${path.startsWith('/') ? path : `/${path}`}`;
  if (location.hash === hash) return render();
  if (replace) location.replace(hash);
  else location.hash = hash;
}

document.querySelectorAll('.nav-item').forEach(item => item.addEventListener('click', event => {
  event.preventDefault();
  if (item.classList.contains('disabled')) return showToast('该功能即将开放');
  navigate(item.getAttribute('href'));
}));
document.querySelector('#notice-button').addEventListener('click', () => showToast('暂无新的系统通知'));
document.querySelector('#profile-button').addEventListener('click', () => showToast('当前登录：运营管理员'));
window.addEventListener('hashchange', render);
render();
