const agreements = [
  {
    id: 'merchant-service',
    name: '商家服务协议',
    latestVersion: {
      id: 'ms-v210',
      version: 'V2.1.0',
      content: agreementContent('商家服务协议', 'V2.1.0', '优化商家服务范围、费用结算及平台责任说明。')
    },
    signedRecords: [
      { id: 'ms-r150', versionId: 'ms-v150', version: 'V1.5.0', signedAt: '2026-02-18 09:30', content: agreementContent('商家服务协议', 'V1.5.0', '补充商家履约与违约处理规则。') },
      { id: 'ms-r200', versionId: 'ms-v200', version: 'V2.0.0', signedAt: '2026-05-11 13:20', content: agreementContent('商家服务协议', 'V2.0.0', '更新商家入驻与结算相关条款。') },
      { id: 'ms-r210', versionId: 'ms-v210', version: 'V2.1.0', signedAt: '2026-08-20 10:30', content: agreementContent('商家服务协议', 'V2.1.0', '优化商家服务范围、费用结算及平台责任说明。') }
    ]
  },
  {
    id: 'merchant-privacy',
    name: '商家隐私保护协议',
    latestVersion: {
      id: 'mp-v130',
      version: 'V1.3.0',
      content: agreementContent('商家隐私保护协议', 'V1.3.0', '新增数据安全、最小必要授权及信息保护责任说明。')
    },
    signedRecords: [
      { id: 'mp-r100', versionId: 'mp-v100', version: 'V1.0.0', signedAt: '2026-01-12 11:10', content: agreementContent('商家隐私保护协议', 'V1.0.0', '明确商家处理用户信息的基本边界。') },
      { id: 'mp-r120', versionId: 'mp-v120', version: 'V1.2.0', signedAt: '2026-05-18 14:20', content: agreementContent('商家隐私保护协议', 'V1.2.0', '补充用户敏感信息保护与访问控制条款。') }
    ]
  },
  {
    id: 'logistics-fee',
    name: '物流费代收代付协议',
    latestVersion: {
      id: 'lf-v100',
      version: 'V1.0.0',
      content: agreementContent('物流费代收代付协议', 'V1.0.0', '约定平台代收代付物流费用、对账和异常处理规则。')
    },
    signedRecords: []
  },
  {
    id: 'payment-service',
    name: '平台支付服务协议',
    latestVersion: {
      id: 'ps-v200',
      version: 'V2.0.0',
      content: agreementContent('平台支付服务协议', 'V2.0.0', '更新支付服务、结算周期与退款处理规则。')
    },
    signedRecords: [
      { id: 'ps-r160', versionId: 'ps-v160', version: 'V1.6.0', signedAt: '2026-03-28 16:15', content: agreementContent('平台支付服务协议', 'V1.6.0', '补充支付通道服务限制。') },
      { id: 'ps-r200', versionId: 'ps-v200', version: 'V2.0.0', signedAt: '2026-07-02 09:10', content: agreementContent('平台支付服务协议', 'V2.0.0', '更新支付服务、结算周期与退款处理规则。') }
    ]
  }
];

const statusLabel = {
  signed: '已签署',
  pending: '待签署',
  updated: '待签新版本'
};

const app = document.querySelector('#app-content');
const toast = document.querySelector('#toast');
let toastTimer;
let successPayload = null;

function agreementContent(name, version, summary) {
  return `
${name}
版本：${version}

第一条 协议目的
本协议用于明确商家与平台在入驻、经营、服务履约、费用结算及信息保护等事项中的权利义务。${summary}

第二条 适用范围
本协议适用于商家通过平台开展商品发布、订单履约、售后服务、营销活动及其他经营行为的全过程。商家继续使用平台服务，即表示理解并接受本协议对应版本的约束。

第三条 商家账户与资料
商家应确保提交的主体资质、联系人、收款账户及经营资料真实、准确、完整、有效。如资料发生变化，商家应及时在后台更新，因资料错误或失效导致的损失由商家自行承担。

第四条 商品与服务管理
商家应按照法律法规及平台规则发布商品或服务信息，不得发布虚假、误导、侵权、违法或违反公序良俗的内容。商家应对商品质量、服务承诺、库存信息及履约结果承担责任。

第五条 订单履约
商家应在承诺时效内完成发货、服务交付或其他履约动作。因商家原因导致延迟、错发、漏发、服务不达标或用户投诉的，平台有权依据规则进行处理。

第六条 费用与结算
平台可按照已公示或双方确认的收费规则收取服务费、技术服务费、物流相关费用或其他合理费用。结算金额、结算周期及扣款项目以平台后台展示或双方另行确认的信息为准。

第七条 用户信息保护
商家仅可在履行订单、提供售后或处理用户请求所必需的范围内使用用户信息。未经授权，商家不得复制、出售、泄露、公开披露或用于与订单履约无关的目的。

第八条 平台通知
平台可通过商家后台、站内信、短信、邮件或其他合理方式发送协议更新、规则调整、服务通知及风险提示。相关通知发出后即视为已向商家送达。

第九条 协议更新与签署
平台发布新版本协议后，如商家尚未签署最新版本，商家应在后台阅读并完成签署。商家签署后，系统将记录协议名称、版本号及签署时间，用于后续查询和追溯。

第十条 违约处理
若商家违反本协议或平台规则，平台可视情况采取提醒整改、限制功能、暂停结算、下架商品、终止服务等措施。相关措施不影响平台依法追究商家责任的权利。

第十一条 争议解决
因本协议产生的争议，双方应先友好协商解决；协商不成的，可提交平台所在地有管辖权的人民法院处理。

第十二条 其他
本协议自商家完成线上签署之日起生效。未尽事宜，按照平台已公示规则、双方另行签署文件及相关法律法规执行。
`.trim();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

function getAgreement(id) {
  return agreements.find(item => item.id === id);
}

function sortedRecords(agreement) {
  return [...agreement.signedRecords].sort((a, b) => b.signedAt.localeCompare(a.signedAt));
}

function latestSignedRecord(agreement) {
  return sortedRecords(agreement)[0] || null;
}

function getAgreementStatus(agreement) {
  const signed = latestSignedRecord(agreement);
  if (!signed) return 'pending';
  if (signed.version === agreement.latestVersion.version) return 'signed';
  return 'updated';
}

function getSignedVersion(agreement) {
  return latestSignedRecord(agreement)?.version || '*';
}

function getPendingVersion(agreement) {
  return getAgreementStatus(agreement) === 'signed' ? '*' : agreement.latestVersion.version;
}

function getLatestSignedAt(agreement) {
  return latestSignedRecord(agreement)?.signedAt || '*';
}

function statusTag(status) {
  const newHint = status === 'updated' ? '<span class="new-pill">NEW</span>' : '';
  return `<span class="tag ${status}"><i></i>${statusLabel[status]}${newHint}</span>`;
}

function routeTo(path, replace = false) {
  const next = `#${path.startsWith('/') ? path : `/${path}`}`;
  if (location.hash === next) return render();
  if (replace) location.replace(next);
  else location.hash = next;
}

function agreementCenterPage() {
  const pendingCount = agreements.filter(item => getAgreementStatus(item) !== 'signed').length;
  app.innerHTML = `
    <div class="page-heading">
      <div>
        <div class="eyebrow">商家协议签署</div>
        <h1>协议中心</h1>
        <p>查看和管理您与平台签署的相关协议</p>
      </div>
    </div>
    ${pendingCount ? `<section class="banner"><div class="banner-main"><span class="banner-icon">!</span><strong>您有 ${pendingCount} 份协议待签署，请及时查看并完成签署。</strong></div><button class="primary-button" id="view-pending">查看待签协议</button></section>` : ''}
    <section class="filter-card">
      <div class="filter-title"><span class="filter-icon">⌘</span><strong>筛选条件</strong><span>按协议名称和签署状态快速查找</span></div>
      <form class="filters" id="filter-form">
        <label>协议名称<input id="name-filter" placeholder="请输入协议名称" /></label>
        <label>签署状态<select id="status-filter"><option value="">全部</option><option value="needs-sign" hidden>待签协议</option><option value="signed">已签署</option><option value="pending">待签署</option><option value="updated">待签新版本</option></select></label>
        <div class="filter-actions"><button class="primary-button" type="submit">查询</button><button class="reset-button" type="button" id="reset-filter">重置</button></div>
      </form>
    </section>
    <section class="table-card">
      <div class="table-toolbar"><div><h2>协议列表</h2><span id="result-count">共 ${agreements.length} 条记录</span></div><button class="refresh-button" id="refresh-button">↻ 刷新</button></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>协议名称</th><th>签署状态</th><th>当前已签版本</th><th>当前待签版本</th><th>最近签署时间</th><th>操作</th></tr></thead>
          <tbody id="agreement-table"></tbody>
        </table>
      </div>
      <div class="table-footer"><span>每页 10 条</span><div class="pagination"><button disabled>‹</button><button class="current">1</button><button>›</button></div></div>
    </section>`;
  bindCenterActions();
  renderAgreementTable(agreements);
}

function bindCenterActions() {
  const form = document.querySelector('#filter-form');
  form.addEventListener('submit', event => {
    event.preventDefault();
    applyFilters();
  });
  document.querySelector('#reset-filter').addEventListener('click', () => {
    form.reset();
    renderAgreementTable(agreements);
  });
  document.querySelector('#view-pending')?.addEventListener('click', () => {
    document.querySelector('#status-filter').value = 'needs-sign';
    renderAgreementTable(agreements.filter(item => getAgreementStatus(item) !== 'signed'));
  });
  document.querySelector('#refresh-button').addEventListener('click', () => {
    renderAgreementTable(agreements);
    showToast('协议列表已刷新');
  });
}

function applyFilters() {
  const keyword = document.querySelector('#name-filter').value.trim();
  const status = document.querySelector('#status-filter').value;
  const rows = agreements.filter(item => {
    const currentStatus = getAgreementStatus(item);
    const statusMatched = status === 'needs-sign' ? currentStatus !== 'signed' : (!status || currentStatus === status);
    return (!keyword || item.name.includes(keyword)) && statusMatched;
  });
  renderAgreementTable(rows);
}

function renderAgreementTable(rows) {
  const body = document.querySelector('#agreement-table');
  document.querySelector('#result-count').textContent = `共 ${rows.length} 条记录`;
  body.innerHTML = rows.length ? rows.map(item => {
    const status = getAgreementStatus(item);
    const canSign = status !== 'signed';
    return `<tr>
      <td><div class="agreement-name">${item.name}<span class="subline">ID: ${item.id}</span></div></td>
      <td>${statusTag(status)}</td>
      <td><span class="${getSignedVersion(item) === '*' ? 'muted' : 'version'}">${getSignedVersion(item)}</span></td>
      <td><span class="${getPendingVersion(item) === '*' ? 'muted' : 'version'}">${getPendingVersion(item)}</span></td>
      <td>${getLatestSignedAt(item) === '*' ? '<span class="muted">*</span>' : getLatestSignedAt(item)}</td>
      <td>
        ${canSign ? `<button class="text-button primary-text sign-link" data-id="${item.id}">查看并签署</button>` : `<button class="text-button detail-link" data-id="${item.id}">查看</button>`}
        ${item.signedRecords.length ? `<button class="text-button detail-link" data-id="${item.id}">查看历史</button>` : ''}
      </td>
    </tr>`;
  }).join('') : `<tr><td colspan="6"><div class="empty"><span>⌕</span><strong>暂无匹配的协议</strong><p>请调整筛选条件后重试</p></div></td></tr>`;
  body.querySelectorAll('.detail-link').forEach(button => button.addEventListener('click', () => routeTo(`/merchant/agreements/${button.dataset.id}`)));
  body.querySelectorAll('.sign-link').forEach(button => button.addEventListener('click', () => routeTo(`/merchant/agreements/${button.dataset.id}/sign`)));
}

function detailPage(id) {
  const agreement = getAgreement(id);
  if (!agreement) return routeTo('/merchant/agreements', true);
  const status = getAgreementStatus(agreement);
  const records = sortedRecords(agreement);
  const latest = latestSignedRecord(agreement);
  document.querySelector('#crumb-current').textContent = '协议详情';
  app.innerHTML = `
    <div class="detail-heading">
      <div>
        <button class="text-button" id="back-center">‹ 返回协议中心</button>
        <div class="title-line"><h1>${agreement.name}</h1>${statusTag(status)}</div>
        <p>${status === 'signed' ? '您当前已签署平台最新版本。' : status === 'updated' ? '平台已发布新版本，请阅读后完成签署。' : '您尚未签署该协议，请阅读协议内容后完成签署。'}</p>
      </div>
      <div class="detail-actions">
        ${status === 'signed' ? `<button class="primary-button" id="view-current">查看当前协议</button>` : ''}
        ${status !== 'signed' ? `<button class="primary-button" id="go-sign">${status === 'updated' ? `查看并签署 ${agreement.latestVersion.version}` : '查看并签署'}</button>` : ''}
      </div>
    </div>
    ${status === 'updated' ? updatedNotice(agreement, latest) : ''}
    ${status === 'pending' ? firstSignNotice(agreement) : signedSummary(agreement, latest)}
    ${records.length ? historyTable(agreement, records) : ''}`;
  document.querySelector('#back-center').addEventListener('click', () => routeTo('/merchant/agreements'));
  document.querySelector('#go-sign')?.addEventListener('click', () => routeTo(`/merchant/agreements/${agreement.id}/sign`));
  document.querySelector('#view-current')?.addEventListener('click', () => routeTo(`/merchant/agreements/${agreement.id}/signed/${latest.id}`));
  bindHistoryLinks();
}

function signedSummary(agreement, latest) {
  return `<section class="summary-card">
    <div class="summary-grid">
      <div class="metric"><small>当前已签版本</small><strong class="version">${latest.version}</strong></div>
      <div class="metric"><small>最近签署时间</small><strong>${latest.signedAt}</strong></div>
      <div class="metric"><small>当前待签版本</small><strong class="${getAgreementStatus(agreement) === 'signed' ? 'muted' : 'version'}">${getPendingVersion(agreement)}</strong></div>
    </div>
  </section>`;
}

function updatedNotice(agreement, latest) {
  return `<section class="notice-card">
    <div>
      <h2>协议已更新，请签署最新版本</h2>
      <p>签署后系统将记录本次协议版本及签署时间，历史记录仅保留您真实签署过的版本。</p>
      <div class="notice-meta">
        <span>当前已签版本<b class="version">${latest.version}</b></span>
        <span>最新待签版本<b class="version">${agreement.latestVersion.version}</b></span>
        <span>最近签署时间<b>${latest.signedAt}</b></span>
      </div>
    </div>
    <button class="primary-button" id="notice-sign">查看并签署 ${agreement.latestVersion.version}</button>
  </section>`;
}

function firstSignNotice(agreement) {
  return `<section class="notice-card">
    <div>
      <h2>您尚未签署该协议，请阅读协议内容后完成签署。</h2>
      <p>当前待签版本为 <b class="version">${agreement.latestVersion.version}</b>。完成签署后，该版本会进入您的历史签署记录。</p>
    </div>
    <button class="primary-button" id="notice-sign">查看并签署</button>
  </section>`;
}

function historyTable(agreement, records) {
  return `<section class="history-card">
    <div class="section-title"><h2>历史签署版本</h2><span>仅展示该商家真实签署过的版本</span></div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>版本号</th><th>签署时间</th><th>操作</th></tr></thead>
        <tbody>
          ${records.map(record => `<tr><td><span class="version">${record.version}</span></td><td>${record.signedAt}</td><td><button class="text-button view-record" data-agreement="${agreement.id}" data-record="${record.id}">查看协议</button></td></tr>`).join('')}
        </tbody>
      </table>
    </div>
  </section>`;
}

function bindHistoryLinks() {
  document.querySelector('#notice-sign')?.addEventListener('click', () => {
    const [, , id] = currentParts();
    routeTo(`/merchant/agreements/${id}/sign`);
  });
  document.querySelectorAll('.view-record').forEach(button => button.addEventListener('click', () => {
    routeTo(`/merchant/agreements/${button.dataset.agreement}/signed/${button.dataset.record}`);
  }));
}

function signedRecordPage(agreementId, recordId) {
  const agreement = getAgreement(agreementId);
  const record = agreement?.signedRecords.find(item => item.id === recordId);
  if (!agreement || !record) return routeTo('/merchant/agreements', true);
  document.querySelector('#crumb-current').textContent = '已签协议';
  app.innerHTML = `
    <div class="readonly-head">
      <div>
        <button class="text-button" id="back-detail">‹ 返回协议详情</button>
        <h1>${agreement.name}</h1>
        <div class="readonly-meta"><span>版本：<b class="version">${record.version}</b></span><i></i>${statusTag('signed')}<i></i><span>签署时间：${record.signedAt}</span></div>
      </div>
    </div>
    ${renderAgreementPaper(record.content)}`;
  document.querySelector('#back-detail').addEventListener('click', () => routeTo(`/merchant/agreements/${agreement.id}`));
}

function signPage(agreementId) {
  const agreement = getAgreement(agreementId);
  if (!agreement) return routeTo('/merchant/agreements', true);
  if (getAgreementStatus(agreement) === 'signed') return routeTo(`/merchant/agreements/${agreement.id}`, true);
  document.querySelector('#crumb-current').textContent = '查看并签署';
  app.innerHTML = `
    <div class="sign-intro">
      <button class="text-button" id="cancel-top">‹ 返回协议详情</button>
      <h1>${agreement.name}</h1>
      <p>请阅读以下协议内容</p>
      <div class="readonly-meta"><span>版本：<b class="version">${agreement.latestVersion.version}</b></span><i></i>${statusTag(getAgreementStatus(agreement))}</div>
    </div>
    ${renderAgreementPaper(agreement.latestVersion.content)}
    <div class="sticky-actions">
      <div class="sticky-inner">
        <label class="agree-check"><input type="checkbox" id="agree-checkbox" />我已阅读并同意《${agreement.name}》</label>
        <div class="action-group"><button class="reset-button" id="cancel-sign">取消</button><button class="primary-button" id="confirm-sign" disabled>确认签署</button></div>
      </div>
    </div>`;
  const checkbox = document.querySelector('#agree-checkbox');
  const confirm = document.querySelector('#confirm-sign');
  checkbox.addEventListener('change', () => { confirm.disabled = !checkbox.checked; });
  document.querySelector('#cancel-top').addEventListener('click', () => routeTo(`/merchant/agreements/${agreement.id}`));
  document.querySelector('#cancel-sign').addEventListener('click', () => routeTo(`/merchant/agreements/${agreement.id}`));
  confirm.addEventListener('click', () => openSignConfirm(agreement));
}

function openSignConfirm(agreement) {
  openModal('确认签署协议', `
    <dl class="confirm-info">
      <dt>协议名称</dt><dd>${agreement.name}</dd>
      <dt>协议版本</dt><dd><span class="version">${agreement.latestVersion.version}</span></dd>
    </dl>
    <p class="confirm-copy">签署后，系统将记录本次协议版本及签署时间。</p>
  `, '确认签署', () => {
    const signedAt = formatNow();
    const newRecord = {
      id: `${agreement.id}-r-${Date.now()}`,
      versionId: agreement.latestVersion.id,
      version: agreement.latestVersion.version,
      signedAt,
      content: agreement.latestVersion.content
    };
    agreement.signedRecords.push(newRecord);
    successPayload = { agreementId: agreement.id, recordId: newRecord.id, name: agreement.name, version: newRecord.version, signedAt };
    closeModal();
    routeTo(`/merchant/agreements/${agreement.id}/sign/success`);
  });
}

function successPage(agreementId) {
  const agreement = getAgreement(agreementId);
  if (!agreement) return routeTo('/merchant/agreements', true);
  const latest = latestSignedRecord(agreement);
  const payload = successPayload?.agreementId === agreementId ? successPayload : {
    agreementId,
    recordId: latest?.id,
    name: agreement.name,
    version: latest?.version || agreement.latestVersion.version,
    signedAt: latest?.signedAt || formatNow()
  };
  document.querySelector('#crumb-current').textContent = '签署成功';
  app.innerHTML = `
    <section class="success-panel">
      <div class="success-content">
        <span class="success-icon">✓</span>
        <h1>协议签署成功</h1>
        <p>签署结果已在本次前端 Mock 状态中更新。</p>
        <dl class="success-meta">
          <dt>协议</dt><dd>${payload.name}</dd>
          <dt>版本</dt><dd><span class="version">${payload.version}</span></dd>
          <dt>签署时间</dt><dd>${payload.signedAt}</dd>
        </dl>
        <div class="action-group"><button class="reset-button" id="back-center">返回协议中心</button><button class="primary-button" id="view-signed">查看已签协议</button></div>
      </div>
    </section>`;
  document.querySelector('#back-center').addEventListener('click', () => routeTo('/merchant/agreements'));
  document.querySelector('#view-signed').addEventListener('click', () => routeTo(`/merchant/agreements/${agreement.id}/signed/${payload.recordId}`));
}

function renderAgreementPaper(content) {
  const lines = content.split('\n').map(item => item.trim()).filter(Boolean);
  const [title, version, ...body] = lines;
  return `<article class="agreement-paper">
    <h2>${title}</h2>
    <p style="text-align:center;color:#7d8a9d;margin-top:-12px;margin-bottom:24px;">${version}</p>
    ${body.map(line => /^第.+条/.test(line) ? `<h3>${line}</h3>` : `<p>${line}</p>`).join('')}
  </article>`;
}

function formatNow() {
  const date = new Date();
  const pad = value => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function currentParts() {
  return location.hash.replace(/^#\/?/, '').split('/');
}

function openModal(title, content, actionLabel, onConfirm) {
  document.querySelector('#dialog-layer')?.remove();
  document.body.insertAdjacentHTML('beforeend', `<div class="dialog-layer" id="dialog-layer">
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal-head"><h2 id="modal-title">${title}</h2><button class="close-modal" aria-label="关闭">×</button></div>
      <div class="modal-content">${content}</div>
      <div class="modal-foot"><button class="reset-button cancel-modal">取消</button><button class="primary-button" id="modal-confirm">${actionLabel}</button></div>
    </div>
  </div>`);
  document.querySelector('.close-modal').addEventListener('click', closeModal);
  document.querySelector('.cancel-modal').addEventListener('click', closeModal);
  document.querySelector('#modal-confirm').addEventListener('click', onConfirm);
  document.querySelector('#dialog-layer').addEventListener('click', event => {
    if (event.target.id === 'dialog-layer') closeModal();
  });
}

function closeModal() {
  document.querySelector('#dialog-layer')?.remove();
}

function render() {
  const route = location.hash.replace(/^#\/?/, '') || 'merchant/agreements';
  const parts = route.split('/');
  if (route === 'merchant/agreements') {
    document.querySelector('#crumb-current').textContent = '协议中心';
    agreementCenterPage();
  } else if (/^merchant\/agreements\/[^/]+$/.test(route)) {
    detailPage(parts[2]);
  } else if (/^merchant\/agreements\/[^/]+\/signed\/[^/]+$/.test(route)) {
    signedRecordPage(parts[2], parts[4]);
  } else if (/^merchant\/agreements\/[^/]+\/sign$/.test(route)) {
    signPage(parts[2]);
  } else if (/^merchant\/agreements\/[^/]+\/sign\/success$/.test(route)) {
    successPage(parts[2]);
  } else {
    routeTo('/merchant/agreements', true);
  }
}

document.querySelector('#notice-button').addEventListener('click', () => showToast('您有待签协议需要处理'));
document.querySelector('#profile-button').addEventListener('click', () => showToast('当前登录：示例商家'));
window.addEventListener('hashchange', render);
render();
