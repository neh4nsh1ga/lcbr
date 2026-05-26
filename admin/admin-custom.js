// admin-custom.js - Natively Aligned, High-Performance Decap CMS Settings Extension
(function () {
  const API_URL = 'http://localhost:8082/api/config';
  let rawYaml = '';
  let configData = null;
  let activeTab = 'visual'; // 'visual' or 'raw'

  // Inject Styles for a Clean, Professional, Native-looking Interface
  const style = document.createElement('style');
  style.textContent = `
    /* Modal Overlay (Clean Mask matching Decap CMS style) */
    .cms-settings-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(15, 23, 42, 0.6); /* Standard dark transparent backdrop */
      z-index: 999999;
      display: none;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    .cms-settings-overlay.active {
      display: flex;
    }

    /* Modal Container (Clean, structured Slate layout) */
    .cms-settings-modal {
      width: 90%;
      max-width: 800px;
      max-height: 85vh;
      background: #ffffff; /* Native Decap CMS light background */
      border: 1px solid #dfe3e6;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      color: #1e2530;
    }

    /* Modal Header */
    .cms-settings-header {
      padding: 16px 24px;
      border-bottom: 1px solid #dfe3e6;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f5f7f9;
    }
    .cms-settings-title {
      font-size: 16px;
      font-weight: 700;
      color: #1e2530;
      margin: 0;
    }
    .cms-settings-close {
      background: none;
      border: none;
      color: #7a8c9e;
      cursor: pointer;
      font-size: 24px;
      line-height: 1;
      padding: 4px;
    }
    .cms-settings-close:hover {
      color: #1e2530;
    }

    /* Navigation Tabs */
    .cms-settings-tabs {
      display: flex;
      padding: 0 24px;
      background: #f5f7f9;
      border-bottom: 1px solid #dfe3e6;
    }
    .cms-settings-tab {
      padding: 12px 16px;
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      color: #7a8c9e;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }
    .cms-settings-tab:hover {
      color: #1e2530;
    }
    .cms-settings-tab.active {
      color: #3a5bf0;
      border-bottom-color: #3a5bf0;
    }

    /* Content Area */
    .cms-settings-body {
      padding: 24px;
      overflow-y: auto;
      flex: 1;
      min-height: 350px;
      background: #ffffff;
    }

    /* Visual Editor Styles */
    .cms-collection-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .cms-collection-card {
      background: #f5f7f9;
      border: 1px solid #dfe3e6;
      border-radius: 6px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .cms-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #dfe3e6;
      padding-bottom: 8px;
    }
    .cms-card-type-badge {
      display: inline-flex;
      align-items: center;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      background: #eef1f4;
      color: #556375;
      border: 1px solid #dfe3e6;
    }
    .cms-card-path {
      font-family: monospace;
      font-size: 11px;
      color: #7a8c9e;
    }
    .cms-card-inputs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .cms-input-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .cms-input-label {
      font-size: 12px;
      font-weight: 600;
      color: #556375;
    }
    .cms-text-input {
      background: #ffffff;
      border: 1px solid #dfe3e6;
      border-radius: 4px;
      padding: 8px 12px;
      color: #1e2530;
      font-size: 13px;
      font-family: inherit;
    }
    .cms-text-input:focus {
      outline: none;
      border-color: #3a5bf0;
      box-shadow: 0 0 0 2px rgba(58, 91, 240, 0.15);
    }

    /* Advanced Raw Editor */
    .cms-raw-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 400px;
    }
    .cms-raw-textarea {
      width: 100%;
      height: 400px;
      background: #ffffff;
      border: 1px solid #dfe3e6;
      border-radius: 4px;
      padding: 12px;
      color: #1e2530;
      font-family: monospace;
      font-size: 13px;
      line-height: 1.5;
      resize: vertical;
      box-sizing: border-box;
      tab-size: 2;
    }
    .cms-raw-textarea:focus {
      outline: none;
      border-color: #3a5bf0;
      box-shadow: 0 0 0 2px rgba(58, 91, 240, 0.15);
    }

    /* Footer / Actions */
    .cms-settings-footer {
      padding: 16px 24px;
      border-top: 1px solid #dfe3e6;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      background: #f5f7f9;
    }
    .cms-btn {
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
    }
    .cms-btn-secondary {
      background: #ffffff;
      border: 1px solid #dfe3e6;
      color: #556375;
    }
    .cms-btn-secondary:hover {
      background: #f5f7f9;
      color: #1e2530;
    }
    .cms-btn-primary {
      background: #3a5bf0;
      border: 1px solid #2844c7;
      color: #ffffff;
    }
    .cms-btn-primary:hover {
      background: #2844c7;
    }

    /* Toast Notification */
    .cms-toast {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: #1e2530;
      border: 1px solid #10b981;
      padding: 12px 24px;
      border-radius: 4px;
      color: #ffffff;
      font-weight: 600;
      font-size: 13px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000000;
      display: none;
      align-items: center;
      gap: 8px;
      width: max-content;
      max-width: 90vw;
    }
    .cms-toast.show {
      display: flex;
    }
    .cms-toast-error {
      border-color: #ef4444;
    }

    /* === Mobile UI Optimization === */
    @media (max-width: 768px) {
      /* Custom Modal Mobile Layout */
      .cms-settings-modal {
        width: 95%;
        max-height: 95vh;
        margin: 10px;
      }
      .cms-card-inputs {
        grid-template-columns: 1fr; /* Single column on mobile */
        gap: 12px;
      }
      .cms-settings-tabs {
        padding: 0;
        overflow-x: auto;
        white-space: nowrap;
      }
      .cms-settings-tab {
        padding: 12px;
        flex: 1;
        text-align: center;
      }
      .cms-settings-body {
        padding: 16px 12px;
      }
      .cms-settings-footer {
        flex-direction: column-reverse;
        gap: 8px;
        padding: 12px;
      }
      .cms-btn {
        width: 100%;
        padding: 12px;
        font-size: 14px;
      }
      
      /* Decap CMS Native UI Mobile Overrides */
      /* Fix header wrapping issues */
      [class*="AppHeader"] {
        padding: 8px !important;
      }
      [class*="AppHeaderContent"] {
        flex-wrap: wrap !important;
        gap: 8px !important;
      }
      [class*="AppHeaderButton"] {
        padding: 8px 12px !important;
        font-size: 13px !important;
      }
      
      /* Make editor container full width */
      [class*="EditorContainer"] {
        padding: 0 !important;
      }
      [class*="EditorControlPane"] {
        width: 100% !important;
        max-width: 100% !important;
        padding: 12px !important;
      }
      
      /* Collection list mobile optimization */
      [class*="CollectionContainer"] {
        padding: 10px !important;
      }
      [class*="CardContainer"] {
        width: 100% !important;
        margin: 0 0 12px 0 !important;
      }
      
      /* Sidebar adjustments */
      [class*="SidebarContainer"] {
        width: 100% !important;
        max-width: 100% !important;
        padding: 12px !important;
      }
    }
  `;
  document.head.appendChild(style);

  // Initialize and Fetch Configuration
  function loadConfig() {
    fetch(API_URL)
      .then(res => {
        if (!res.ok) throw new Error('API server is not running');
        return res.json();
      })
      .then(data => {
        rawYaml = data.yaml;
        try {
          configData = jsyaml.load(rawYaml);
        } catch (e) {
          console.error("Failed to parse YAML:", e);
        }
        createUI();
        injectNavbarButton();
      })
      .catch(err => {
        console.warn('CMS Helper Server not running or unreachable:', err);
        setTimeout(loadConfig, 3000);
      });
  }

  // Inject modal overlay to body (no floating button)
  function createUI() {
    if (document.querySelector('.cms-settings-overlay')) return;

    // Create Overlay & Modal
    const overlay = document.createElement('div');
    overlay.className = 'cms-settings-overlay';
    overlay.innerHTML = `
      <div class="cms-settings-modal">
        <div class="cms-settings-header">
          <h2 class="cms-settings-title">Decap CMS 컬렉션 관리자</h2>
          <button class="cms-settings-close">&times;</button>
        </div>
        <div class="cms-settings-tabs">
          <button class="cms-settings-tab active" data-tab="visual">시각적 편집 (Visual)</button>
          <button class="cms-settings-tab" data-tab="raw">Raw YAML 편집 (Advanced)</button>
        </div>
        <div class="cms-settings-body"></div>
        <div class="cms-settings-footer">
          <button class="cms-btn cms-btn-secondary close-btn">취소</button>
          <button class="cms-btn cms-btn-primary save-btn">변경사항 저장</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    // Create Toast element
    const toast = document.createElement('div');
    toast.className = 'cms-toast';
    document.body.appendChild(toast);

    // Event Listeners
    overlay.querySelector('.cms-settings-close').addEventListener('click', () => {
      overlay.classList.remove('active');
    });

    overlay.querySelector('.close-btn').addEventListener('click', () => {
      overlay.classList.remove('active');
    });

    // Tab Switching
    overlay.querySelectorAll('.cms-settings-tab').forEach(tabBtn => {
      tabBtn.addEventListener('click', (e) => {
        overlay.querySelectorAll('.cms-settings-tab').forEach(tb => tb.classList.remove('active'));
        e.target.classList.add('active');
        activeTab = e.target.getAttribute('data-tab');
        renderContent();
      });
    });

    // Save Button
    overlay.querySelector('.save-btn').addEventListener('click', saveChanges);
  }

  // Detect and inject a native-looking button next to "Media" or "미디어" with perfect layout alignment
  function injectNavbarButton() {
    const pollInterval = setInterval(() => {
      // Only look for actual interactive elements, not inner spans
      const elements = Array.from(document.querySelectorAll('a, button, [role="button"]'));
      const mediaEl = elements.find(el => {
        const text = el.textContent ? el.textContent.trim() : '';
        return text === 'Media' || text === '미디어';
      });

      if (mediaEl) {
        clearInterval(pollInterval);

        // Prevent duplicate insertion
        if (document.querySelector('.cms-settings-nav-btn')) return;

        // Trace up to see if mediaEl is wrapped in a container (e.g. <li> representing the menu cell)
        let targetToClone = mediaEl;
        let isParentWrapper = false;

        const parent = mediaEl.parentElement;
        if (parent) {
          // If the parent only wraps this element (and doesn't directly hold other sibling buttons like Content)
          const siblingLinks = Array.from(parent.querySelectorAll('a, button, [role="button"]'));
          if (siblingLinks.length === 1) {
            isParentWrapper = true;
            targetToClone = parent;
          }
        }

        // Clone the element / wrapper exactly to copy 100% of native flex, row, margin, and padding layout context
        const clonedNode = targetToClone.cloneNode(true);

        // Find the inner interactive element of the clone
        let interactiveEl = clonedNode;
        if (isParentWrapper) {
          interactiveEl = clonedNode.querySelector('a, button, [role="button"]') || clonedNode;
        }

        // Apply distinct identifier
        interactiveEl.className += ' cms-settings-nav-btn';
        interactiveEl.removeAttribute('aria-current');

        // Clean up exact active state if copied from an active tab
        interactiveEl.classList.remove('active');

        if (interactiveEl.tagName === 'A') {
          interactiveEl.setAttribute('href', '#');
        }
        interactiveEl.style.cursor = 'pointer';

        // Safely replace text without destroying inner wrappers (which breaks alignment)
        const walker = document.createTreeWalker(interactiveEl, NodeFilter.SHOW_TEXT, null, false);
        let textNode;
        while ((textNode = walker.nextNode())) {
          const val = textNode.nodeValue.trim();
          if (val === 'Media' || val === '미디어') {
            textNode.nodeValue = textNode.nodeValue.replace(val, '컬렉션 관리자');
          }
        }

        // Open modal click handler
        interactiveEl.addEventListener('click', (e) => {
          e.preventDefault();
          const overlay = document.querySelector('.cms-settings-overlay');
          if (overlay) {
            overlay.classList.add('active');
            renderContent();
          }
        });

        // Insert at the exact same level in the DOM structure, immediately adjacent
        targetToClone.insertAdjacentElement('afterend', clonedNode);
      }
    }, 200);
  }

  // Toast notifier function
  function showToast(message, isError = false) {
    const toast = document.querySelector('.cms-toast');
    toast.textContent = message;
    if (isError) {
      toast.classList.add('cms-toast-error');
    } else {
      toast.classList.remove('cms-toast-error');
    }
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // Render content based on active tab
  function renderContent() {
    const body = document.querySelector('.cms-settings-body');
    body.innerHTML = '';

    if (activeTab === 'visual') {
      if (!configData || !configData.collections) {
        body.innerHTML = '<div style="text-align:center; color:#7a8c9e; padding-top:40px;">설정을 불러오는 중 오류가 발생했거나 컬렉션이 없습니다.</div>';
        return;
      }

      const listDiv = document.createElement('div');
      listDiv.className = 'cms-collection-list';

      configData.collections.forEach((col, idx) => {
        const isFileCollection = col.files && col.files.length > 0;
        const badgeText = isFileCollection ? '파일 컬렉션' : '폴더 컬렉션';
        const pathText = isFileCollection ? `파일 수: ${col.files.length}개` : `경로: _${col.name || ''}`;

        const card = document.createElement('div');
        card.className = 'cms-collection-card';
        card.innerHTML = `
          <div class="cms-card-header">
            <span class="cms-card-type-badge">${badgeText}</span>
            <span class="cms-card-path">${pathText}</span>
          </div>
          <div class="cms-card-inputs">
            <div class="cms-input-group">
              <label class="cms-input-label">식별 키 (Name)</label>
              <input type="text" class="cms-text-input col-name-input" data-index="${idx}" value="${col.name || ''}" placeholder="예: blog">
            </div>
            <div class="cms-input-group">
              <label class="cms-input-label">표시 이름 (Label)</label>
              <input type="text" class="cms-text-input col-label-input" data-index="${idx}" value="${col.label || ''}" placeholder="예: 블로그 포스트">
            </div>
          </div>
        `;
        listDiv.appendChild(card);
      });

      body.appendChild(listDiv);
    } else if (activeTab === 'raw') {
      const rawContainer = document.createElement('div');
      rawContainer.className = 'cms-raw-container';
      rawContainer.innerHTML = `
        <textarea class="cms-raw-textarea" spellcheck="false">${rawYaml}</textarea>
        <div style="font-size:11px; color:#556375; margin-top:8px;">YAML을 직접 편집하실 때는 들여쓰기 공백을 잘 맞춰주세요.</div>
      `;

      // Enable tab key support inside textarea
      const textarea = rawContainer.querySelector('.cms-raw-textarea');
      textarea.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
          e.preventDefault();
          const start = this.selectionStart;
          const end = this.selectionEnd;
          this.value = this.value.substring(0, start) + "  " + this.value.substring(end);
          this.selectionStart = this.selectionEnd = start + 2;
        }
      });

      body.appendChild(rawContainer);
    }
  }

  // Handle saving of changes
  function saveChanges() {
    const saveBtn = document.querySelector('.save-btn');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = '저장 중...';
    saveBtn.disabled = true;

    let yamlToSave = '';

    if (activeTab === 'visual') {
      const nameInputs = document.querySelectorAll('.col-name-input');
      const labelInputs = document.querySelectorAll('.col-label-input');

      nameInputs.forEach(input => {
        const idx = parseInt(input.getAttribute('data-index'));
        const newName = input.value.trim();
        if (newName && configData.collections[idx]) {
          configData.collections[idx].name = newName;
        }
      });

      labelInputs.forEach(input => {
        const idx = parseInt(input.getAttribute('data-index'));
        const newLabel = input.value.trim();
        if (newLabel && configData.collections[idx]) {
          configData.collections[idx].label = newLabel;
        }
      });

      try {
        yamlToSave = jsyaml.dump(configData, { noRefs: true, quotingType: '"', lineWidth: -1 });
      } catch (e) {
        showToast('YAML 변환 오류: ' + e.message, true);
        saveBtn.textContent = originalText;
        saveBtn.disabled = false;
        return;
      }
    } else {
      yamlToSave = document.querySelector('.cms-raw-textarea').value;
      try {
        jsyaml.load(yamlToSave);
      } catch (e) {
        showToast('YAML 문법 오류: ' + e.message, true);
        saveBtn.textContent = originalText;
        saveBtn.disabled = false;
        return;
      }
    }

    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ yaml: yamlToSave })
    })
      .then(res => {
        if (!res.ok) throw new Error('API server returned error');
        return res.json();
      })
      .then(data => {
        showToast('설정이 성공적으로 저장되었습니다. 페이지를 새로고침합니다.');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch(err => {
        showToast('설정 저장 실패: ' + err.message, true);
        saveBtn.textContent = originalText;
        saveBtn.disabled = false;
      });
  }

  // Run on start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadConfig);
  } else {
    loadConfig();
  }
})();

// Decap CMS Custom Editor Component: Resizable and Alignable Image
if (typeof CMS !== 'undefined') {
  CMS.registerEditorComponent({
    id: "image",
    label: "이미지 (크기/정렬 조절)",
    fields: [
      { name: "image", label: "이미지 업로드", widget: "image" },
      { name: "alt", label: "alt", widget: "string", required: false },
      { name: "align", label: "정렬 (위치)", widget: "select", options: ["왼쪽", "가운데", "오른쪽"], default: "가운데" },
      { name: "width", label: "크기 (%)", widget: "number", value_type: "int", default: 100, min: 10, max: 100 }
    ],
    pattern: /^(!\[(.*?)\]\((.*?)\)|<img src="(.*?)" alt="(.*?)"(?: style="(.*?)")? \/>)$/,
    fromBlock: function (match) {
      // Markdown 형식인 경우 ![alt](url)
      if (match[2] !== undefined) {
        return {
          image: match[3],
          alt: match[2],
          align: "가운데",
          width: 100
        };
      }

      // HTML 형식인 경우 <img ... />
      const style = match[6] || "";
      let align = "가운데";
      if (style.includes("margin-right: auto") && !style.includes("margin-left: auto")) align = "왼쪽";
      if (style.includes("margin-left: auto") && !style.includes("margin-right: auto")) align = "오른쪽";

      let width = 100;
      const widthMatch = style.match(/max-width:\s*(\d+)%/);
      if (widthMatch) {
        width = parseInt(widthMatch[1], 10);
      }

      return {
        image: match[4],
        alt: match[5],
        align: align,
        width: width
      };
    },
    toBlock: function (obj) {
      let marginStyle = "margin: 0 auto; display: block;"; // 가운데
      if (obj.align === "왼쪽") {
        marginStyle = "margin-right: auto; display: block;";
      } else if (obj.align === "오른쪽") {
        marginStyle = "margin-left: auto; display: block;";
      }

      const width = obj.width || 100;
      const style = `${marginStyle} max-width: ${width}%;`;

      return `<img src="${obj.image || ''}" alt="${obj.alt || ''}" style="${style}" />`;
    },
    toPreview: function (obj) {
      let marginStyle = "margin: 0 auto; display: block;"; // 가운데
      if (obj.align === "왼쪽") {
        marginStyle = "margin-right: auto; display: block;";
      } else if (obj.align === "오른쪽") {
        marginStyle = "margin-left: auto; display: block;";
      }

      const width = obj.width || 100;
      const style = `${marginStyle} max-width: ${width}%;`;

      return `<img src="${obj.image || ''}" alt="${obj.alt || ''}" style="${style}" />`;
    }
  });
}

