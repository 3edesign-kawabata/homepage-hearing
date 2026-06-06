(function () {
  // === Helpers ===
  function getChecked(name) {
    var el = document.querySelector('input[name="' + name + '"]:checked');
    return el ? el.value : null;
  }

  // === 制作の目的 ===
  var purposeOtherField = document.getElementById('purpose-other-field');
  var renewalFields     = document.getElementById('renewal-fields');

  function updatePurpose() {
    var purpose = getChecked('purpose');
    purposeOtherField.classList.toggle('hidden', purpose !== 'other');
    renewalFields.classList.toggle('hidden', purpose !== 'renewal');
  }

  // === サイトの種類 ===
  var siteTypeOtherField = document.getElementById('site-type-other-field');
  var ecFields           = document.getElementById('ec-fields');

  function updateSiteType() {
    var siteType = getChecked('site_type');
    var isLp = siteType === 'lp';
    siteTypeOtherField.classList.toggle('hidden', siteType !== 'other');
    ecFields.classList.toggle('hidden', siteType !== 'ec');
    document.getElementById('section-page-structure').classList.toggle('hidden', isLp);
    document.getElementById('section-features').classList.toggle('hidden', isLp);
    document.getElementById('section-cms').classList.toggle('hidden', isLp);
  }

  // === ECプラットフォーム ===
  var ecPlatformOtherField = document.getElementById('ec-platform-other-field');

  function updateEcPlatform() {
    var platform = getChecked('ec_platform');
    ecPlatformOtherField.classList.toggle('hidden', platform !== 'other');
  }

  // === ドメイン ===
  var domainExistFields = document.getElementById('domain-exist-fields');

  function updateDomain() {
    domainExistFields.classList.toggle('hidden', getChecked('domain') !== 'has_domain');
  }

  // === サーバー ===
  var serverExistFields = document.getElementById('server-exist-fields');

  function updateServer() {
    serverExistFields.classList.toggle('hidden', getChecked('server') !== 'has_server');
  }

  // === ブランドカラー ===
  var colorPickerFields = document.getElementById('color-picker-fields');
  var colorPrefFields   = document.getElementById('color-preference-fields');

  function updateBrandColor() {
    var value = getChecked('brand_color');
    colorPickerFields.classList.toggle('hidden', value !== 'has_color');
    colorPrefFields.classList.toggle('hidden', value !== 'no_color');
  }

  // === カラーピッカー ↔ カラーコード入力欄の双方向同期 ===
  document.querySelectorAll('input[type="color"]').forEach(function (colorInput) {
    var codeId    = colorInput.id.replace('color_', 'code_');
    var codeInput = document.getElementById(codeId);
    if (!codeInput) return;

    colorInput.addEventListener('input', function () {
      codeInput.value = this.value.toUpperCase();
    });

    codeInput.addEventListener('input', function () {
      var val = this.value.trim();
      if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
        colorInput.value = val.toLowerCase();
      }
    });

    codeInput.addEventListener('blur', function () {
      this.value = colorInput.value.toUpperCase();
    });
  });

  // === 対面日デフォルト今日 ===
  var meetingDate = document.getElementById('meeting_date');
  if (meetingDate && !meetingDate.value) {
    meetingDate.value = new Date().toISOString().split('T')[0];
  }

  // === textarea 自動高さ調整 ===
  function autoResize(el) {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }

  document.querySelectorAll('textarea').forEach(function (el) {
    el.addEventListener('input', function () { autoResize(this); });
    autoResize(el);
  });

  // === 支払い「要相談」トグル ===
  var paymentConsultField = document.getElementById('payment-consult-field');

  document.querySelectorAll('input[name="payment"]').forEach(function (r) {
    r.addEventListener('change', function () {
      paymentConsultField.classList.toggle('hidden', this.value !== 'consult');
    });
  });

  // === チェックボックス「その他」トグル ===
  function toggleOnCheck(checkboxId, fieldId) {
    var cb    = document.getElementById(checkboxId);
    var field = document.getElementById(fieldId);
    if (!cb || !field) return;
    cb.addEventListener('change', function () {
      field.classList.toggle('hidden', !this.checked);
    });
  }

  toggleOnCheck('page-other',     'page-other-field');
  toggleOnCheck('feature-other',  'feature-other-field');
  toggleOnCheck('delivery-other', 'delivery-other-field');

  // === Event listeners ===
  document.querySelectorAll('input[name="purpose"]').forEach(function (r) {
    r.addEventListener('change', updatePurpose);
  });
  document.querySelectorAll('input[name="site_type"]').forEach(function (r) {
    r.addEventListener('change', updateSiteType);
  });
  document.querySelectorAll('input[name="ec_platform"]').forEach(function (r) {
    r.addEventListener('change', updateEcPlatform);
  });
  document.querySelectorAll('input[name="domain"]').forEach(function (r) {
    r.addEventListener('change', updateDomain);
  });
  document.querySelectorAll('input[name="server"]').forEach(function (r) {
    r.addEventListener('change', updateServer);
  });
  document.querySelectorAll('input[name="brand_color"]').forEach(function (r) {
    r.addEventListener('change', updateBrandColor);
  });

  // === Initial state ===
  updatePurpose();
  updateSiteType();
  updateEcPlatform();
  updateDomain();
  updateServer();
  updateBrandColor();
})();

// === 印刷時: textarea を div に差し替えて全表示 ===
window.addEventListener('beforeprint', function () {
  document.querySelectorAll('textarea').forEach(function (el) {
    var div = document.createElement('div');
    div.className = 'print-proxy';
    div.textContent = el.value;
    el.parentNode.insertBefore(div, el.nextSibling);
    el.classList.add('print-hidden');
  });
});

window.addEventListener('afterprint', function () {
  document.querySelectorAll('.print-proxy').forEach(function (div) {
    div.remove();
  });
  document.querySelectorAll('.print-hidden').forEach(function (el) {
    el.classList.remove('print-hidden');
  });
});
