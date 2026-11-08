/**
 * Muse 毛绒皮肤 · 客户端
 *
 * 参照 Muse 宠物：粉蓝色长绒身体 + 灰米色耳朵/肚皮 + 深棕纽扣眼睛。
 *  - 绒毛纹理不是图片，而是启动时用 canvas 画出的无缝绒毛（上万根短纤维 + 绒团明暗），
 *    做成灰度半透明贴图，叠在任意底色上，所以“毛色”可以在皮肤管理里随便换。
 *  - 用户气泡、输入框用一层 ::before 铺绒面，再过 SVG 位移滤镜，让边缘变成毛茸茸的毛边，
 *    文字本身不受滤镜影响。
 *  - 输入框右上角趴着一只 Muse 小团子（可关）。
 *
 * 所有 DOM / 样式 / 定时器都在 ctx.effect 的回收函数里清理干净。
 */
window.__ModuleLoader__.load({
  id: 'dsh-client-ui-skin-muse-plush',
  factory() {
    const SKIN_ID = 'muse-plush';
    const ATTR = 'data-dsh-muse-plush';
    const FUZZ_ATTR = 'data-muse-fuzz';
    const FILTER_ID = 'dsh-muse-fuzz';
    const FILTER_SOFT_ID = 'dsh-muse-fuzz-soft';

    const DEFAULTS = {
      fur: '#B7CBE2',
      belly: '#D2C4B6',
      pile: 'normal',
      fuzzyEdges: true,
      mascot: true,
    };

    // ───────────────────────── 样式 ─────────────────────────
    const S = `body[${ATTR}]`;
    const D = `body[${ATTR}][data-ds-dark-theme]`;
    const CSS = `
${S} {
  --muse-fur: ${DEFAULTS.fur};
  --muse-belly: ${DEFAULTS.belly};
  --muse-ink: #3a2c28;
  --muse-tex-size: 200px;

  /* 派生色：亮色模式 */
  --m-fur: var(--muse-fur);
  --m-belly: var(--muse-belly);
  --m-fur-hi: color-mix(in oklab, var(--m-fur) 52%, #ffffff);
  --m-fur-lo: color-mix(in oklab, var(--m-fur) 70%, #2c3d57);
  --m-paper: color-mix(in oklab, var(--m-fur) 16%, #ffffff);
  --m-paper-2: color-mix(in oklab, var(--m-fur) 26%, #ffffff);
  --m-paper-3: color-mix(in oklab, var(--m-fur) 36%, #ffffff);
  --m-belly-hi: color-mix(in oklab, var(--m-belly) 48%, #fffaf4);
  --m-belly-lo: color-mix(in oklab, var(--m-belly) 78%, #5b4637);
  --m-button: #7c5d50;
  --m-button-hi: #8f6d5f;
  --m-ink-1: color-mix(in oklab, var(--m-fur) 10%, #1d222b);
  --m-ink-2: color-mix(in oklab, var(--m-fur) 22%, #353d4b);
  --m-ink-3: color-mix(in oklab, var(--m-fur) 40%, #566071);
  --m-ink-4: color-mix(in oklab, var(--m-fur) 52%, #6b7586);
  --m-line: color-mix(in srgb, var(--m-fur-lo) 26%, transparent);
  --m-shadow: rgba(44, 58, 84, 0.16);

  /* 表面 */
  --dsw-alias-bg-base: color-mix(in srgb, var(--m-fur-hi) 74%, transparent) !important;
  --dsw-alias-bg-layer-1: color-mix(in srgb, var(--m-paper) 90%, transparent) !important;
  --dsw-alias-bg-layer-2: color-mix(in srgb, var(--m-paper-2) 88%, transparent) !important;
  --dsw-alias-bg-layer-3: color-mix(in srgb, var(--m-paper-3) 90%, transparent) !important;
  --dsw-alias-bg-layer-4: var(--m-paper) !important;
  --dsw-alias-bg-module-platform: color-mix(in srgb, var(--m-paper-2) 90%, transparent) !important;
  --dsw-alias-bg-multi-select: var(--m-paper-2) !important;
  --dsw-alias-bg-overlay: var(--m-paper) !important;
  --dsw-alias-bg-skeleton: color-mix(in srgb, var(--m-fur-lo) 10%, transparent) !important;

  --dsw-alias-border-l1: color-mix(in srgb, var(--m-fur-lo) 16%, transparent) !important;
  --dsw-alias-border-l2: color-mix(in srgb, var(--m-fur-lo) 26%, transparent) !important;
  --dsw-alias-border-l3: color-mix(in srgb, var(--m-fur-lo) 40%, transparent) !important;
  --dsw-alias-border-l4: color-mix(in srgb, var(--m-fur-lo) 55%, transparent) !important;
  --dsw-alias-border-l2-darkmode-thin: color-mix(in srgb, var(--m-fur-lo) 26%, transparent) !important;
  --dsw-alias-separator-primary: color-mix(in srgb, var(--m-fur-lo) 14%, transparent) !important;

  /* 品牌色 = 胸前那几颗棕纽扣 */
  --dsw-alias-brand-primary: var(--m-button) !important;
  --dsw-alias-brand-primary-invert: var(--m-button) !important;
  --dsw-alias-brand-primary-new-colorprimary-new-color: var(--m-button) !important;
  --dsw-alias-brand-text: var(--m-ink-1) !important;
  --dsw-alias-button-primary-fill: var(--m-button) !important;
  --dsw-alias-button-primary-hover: var(--m-button-hi) !important;
  --dsw-alias-button-primary-dimmed: var(--m-belly-hi) !important;
  --dsw-alias-button-info-fill: var(--m-button) !important;
  --dsw-alias-button-info-hover: var(--m-button-hi) !important;
  --dsw-alias-button-contrast-fill: var(--m-ink-1) !important;
  --dsw-alias-button-elevated-fill: var(--m-paper) !important;
  --dsw-alias-button-floating-fill: color-mix(in srgb, var(--m-paper) 92%, transparent) !important;
  --dsw-alias-button-floating-hover: var(--m-paper-3) !important;
  --dsw-alias-button-ghost-active-fill: var(--m-paper-3) !important;
  --dsw-alias-button-ghost-active-hover: var(--m-paper-3) !important;
  --dsw-alias-button-ghost-active-border: color-mix(in srgb, var(--m-fur-lo) 50%, transparent) !important;
  --dsw-alias-state-business-primary: var(--m-button) !important;
  --dsw-alias-state-business-tertiary: var(--m-belly-hi) !important;
  --dsw-alias-link: color-mix(in oklab, var(--m-fur-lo) 70%, #1d3557) !important;
  --dsw-alias-menu-icon: var(--m-ink-2) !important;

  --dsw-alias-interactive-bg-hover: color-mix(in srgb, var(--m-fur-lo) 10%, transparent) !important;
  --dsw-alias-interactive-bg-active: color-mix(in srgb, var(--m-fur-lo) 18%, transparent) !important;
  --dsw-alias-interactive-bg-hover-accent: color-mix(in srgb, var(--m-fur-lo) 24%, transparent) !important;
  --dsw-alias-interactive-bg-hover-solid: var(--m-paper-3) !important;

  /* 文字：带一点蓝灰，不用纯黑 */
  --dsw-alias-label-primary: var(--m-ink-1) !important;
  --dsw-alias-label-primary-dimmed: var(--m-ink-1) !important;
  --dsw-alias-label-secondary: var(--m-ink-2) !important;
  --dsw-alias-label-tertiary: var(--m-ink-3) !important;
  --dsw-alias-label-caption: var(--m-ink-4) !important;
  --dsw-alias-label-primary-bluish: var(--m-fur-lo) !important;

  --dsw-alias-markdown-code-block: color-mix(in srgb, var(--m-paper) 94%, transparent) !important;
  --dsw-alias-markdown-code-block-banner: var(--m-paper-2) !important;
  --dsw-alias-markdown-inline-code: color-mix(in srgb, var(--m-belly) 42%, transparent) !important;
  --dsw-alias-markdown-tag: var(--m-paper-2) !important;
  --dsw-alias-markdown-citation: var(--m-paper-2) !important;

  --dsw-alias-scrollbar-bg-l1: color-mix(in srgb, var(--m-belly-lo) 45%, transparent) !important;
  --dsw-alias-scrollbar-bg-l2: color-mix(in srgb, var(--m-belly-lo) 45%, transparent) !important;
  --dsw-alias-scrollbar-hover-l1: color-mix(in srgb, var(--m-belly-lo) 70%, transparent) !important;
  --dsw-alias-scrollbar-hover-l2: color-mix(in srgb, var(--m-belly-lo) 70%, transparent) !important;

  --dsw-alias-menu-group-header-fill: var(--m-paper) !important;
  --dsw-alias-toast-bg: color-mix(in oklab, var(--m-fur-lo) 70%, #1d222b) !important;
  --dsw-alias-tooltip-bg: color-mix(in oklab, var(--m-fur-lo) 70%, #1d222b) !important;
  --dsw-alias-turn-trigger-bg: var(--m-paper-2) !important;
  --dsw-alias-turn-trigger-bg-hover: var(--m-paper-3) !important;

  /* 肚皮色：气泡与输入框 */
  --dsw-specific-bubble: var(--m-belly) !important;
  --dsw-specific-bubble-highlight: var(--m-belly-lo) !important;
  --dsw-specific-input-major: var(--m-belly-hi) !important;
  --dsw-specific-login-input: var(--m-paper) !important;
  --dsw-specific-menu: var(--m-paper) !important;
  --dsw-specific-selector: var(--m-paper-2) !important;
  --dsw-specific-tip: var(--m-paper-2) !important;
  --dsw-input-solid: var(--m-paper) !important;

  /* 侧栏直接露出蓝色绒毛 */
  --dsw-specific-sidebar-fill: color-mix(in srgb, var(--m-fur) 18%, transparent) !important;
  --dsw-specific-sidebar-nav-item-hover: color-mix(in srgb, #ffffff 26%, transparent) !important;
  --dsw-specific-sidebar-nav-item-active: color-mix(in srgb, var(--m-belly-hi) 82%, transparent) !important;
  --dsw-specific-sidebar-nav-item-active-accent: var(--m-button) !important;

  /* 品牌色阶：全部换成纽扣棕，避免露出原生蓝 */
  --dsw-static-blue-400: #a07f70 !important;
  --dsw-static-blue-450: #8f6d5f !important;
  --dsw-static-blue-500: #7c5d50 !important;
  --dsw-static-deepseek-200: #e3d3c8 !important;
  --dsw-static-deepseek-450: #8f6d5f !important;
  --dsw-static-deepseek-500: #7c5d50 !important;

  /* 毛绒玩具没有直角 */
  --dsw-radius-xs: 8px !important;
  --dsw-radius-sm: 12px !important;
  --dsw-radius-md: 16px !important;
  --dsw-radius-lg: 20px !important;
  --dsw-radius-xl: 24px !important;
  --dsw-radius-panel: 30px !important;

  /* 整个窗口 = Muse 的身体：绒毛贴图 + 顶光 + 底部阴影 */
  background-color: var(--m-fur) !important;
  background-image:
    radial-gradient(120% 80% at 28% -8%, rgba(255, 255, 255, 0.42), transparent 58%),
    radial-gradient(90% 70% at 92% 112%, rgba(40, 58, 88, 0.20), transparent 62%),
    var(--muse-tex, none) !important;
  background-size: auto, auto, var(--muse-tex-size) !important;
  background-repeat: no-repeat, no-repeat, repeat !important;
  background-attachment: fixed !important;
}

/* 夜间：同一只 Muse 关了灯 */
${D} {
  --m-fur: color-mix(in oklab, var(--muse-fur) 30%, #12161f);
  --m-belly: color-mix(in oklab, var(--muse-belly) 30%, #17130f);
  --m-fur-hi: color-mix(in oklab, var(--m-fur) 80%, #ffffff);
  --m-fur-lo: color-mix(in oklab, var(--muse-fur) 22%, #0b0f16);
  --m-paper: color-mix(in oklab, var(--muse-fur) 12%, #14181f);
  --m-paper-2: color-mix(in oklab, var(--muse-fur) 15%, #1b2029);
  --m-paper-3: color-mix(in oklab, var(--muse-fur) 18%, #242a35);
  --m-belly-hi: color-mix(in oklab, var(--muse-belly) 24%, #1f1a16);
  --m-belly-lo: color-mix(in oklab, var(--muse-belly) 34%, #2a231d);
  --m-button: #c7a595;
  --m-button-hi: #d6b6a7;
  --m-ink-1: color-mix(in oklab, var(--muse-fur) 12%, #fbfaf7);
  --m-ink-2: color-mix(in oklab, var(--muse-fur) 16%, #f0eeea);
  --m-ink-3: color-mix(in oklab, var(--muse-fur) 24%, #d3d0cc);
  --m-ink-4: color-mix(in oklab, var(--muse-fur) 30%, #b3b0ac);
  --m-shadow: rgba(0, 0, 0, 0.35);

  --dsw-alias-bg-base: color-mix(in srgb, var(--m-paper) 70%, transparent) !important;
  --dsw-alias-border-l1: color-mix(in srgb, var(--m-ink-1) 9%, transparent) !important;
  --dsw-alias-border-l2: color-mix(in srgb, var(--m-ink-1) 14%, transparent) !important;
  --dsw-alias-border-l3: color-mix(in srgb, var(--m-ink-1) 22%, transparent) !important;
  --dsw-alias-border-l4: color-mix(in srgb, var(--m-ink-1) 32%, transparent) !important;
  --dsw-alias-separator-primary: color-mix(in srgb, var(--m-ink-1) 8%, transparent) !important;
  --dsw-alias-interactive-bg-hover: color-mix(in srgb, var(--m-ink-1) 8%, transparent) !important;
  --dsw-alias-interactive-bg-active: color-mix(in srgb, var(--m-ink-1) 14%, transparent) !important;
  --dsw-alias-interactive-bg-hover-accent: color-mix(in srgb, var(--m-ink-1) 20%, transparent) !important;
  --dsw-alias-link: color-mix(in oklab, var(--muse-fur) 70%, #ffffff) !important;
  --dsw-alias-label-primary-bluish: color-mix(in oklab, var(--muse-fur) 70%, #ffffff) !important;
  --dsw-alias-button-contrast-fill: var(--m-ink-1) !important;
  --dsw-alias-toast-bg: var(--m-paper-3) !important;
  --dsw-alias-tooltip-bg: var(--m-paper-3) !important;
  --dsw-alias-label-primary-foreground: #241b17 !important;
  --dsw-alias-label-primary-inverted: #241b17 !important;
  --dsw-specific-bubble: var(--m-belly-lo) !important;
  --dsw-specific-bubble-highlight: var(--m-belly-hi) !important;
  --dsw-specific-input-major: var(--m-belly-hi) !important;
  --dsw-specific-sidebar-fill: color-mix(in srgb, #0b0e13 28%, transparent) !important;
  --dsw-specific-sidebar-nav-item-hover: color-mix(in srgb, #ffffff 7%, transparent) !important;
  --dsw-specific-sidebar-nav-item-active: color-mix(in srgb, var(--m-belly-lo) 80%, transparent) !important;
  --dsw-static-blue-500: #c7a595 !important;
  --dsw-static-deepseek-500: #c7a595 !important;

  background-image:
    radial-gradient(120% 80% at 28% -8%, rgba(190, 210, 240, 0.12), transparent 58%),
    radial-gradient(90% 70% at 92% 112%, rgba(0, 0, 0, 0.35), transparent 62%),
    var(--muse-tex, none) !important;
  /* 夜间：单层绒（之前叠两层太花，压成淡纹理又没了毛感） */
}

/* 选中文字：肚皮色 */
${S} ::selection { background: color-mix(in srgb, var(--m-belly) 70%, transparent); }

/* 代码块吸顶条原本用 bg-base（现在半透明），改回实色免得透字 */
${S} [class*="_bannerWrap_"] { background-color: var(--m-paper) !important; }

/* 菜单、弹窗、提示：实色纸面 + 很淡的绒，读字优先 */
${S} :is([role="menu"], [role="listbox"], [role="dialog"], [role="alertdialog"], dialog) {
  background-image: var(--muse-tex-faint, none) !important;
  background-size: var(--muse-tex-size) !important;
}

/* ── 输入框：一块圆滚滚的肚皮绒 ── */
${S} [data-composer-card]:not([class*="cardWorkspaceTrigger"]) {
  background: transparent !important;
  isolation: isolate;
  box-shadow:
    0 2px 4px var(--m-shadow),
    0 14px 34px color-mix(in srgb, var(--m-shadow) 80%, transparent) !important;
}
${S} [data-composer-card]:not([class*="cardWorkspaceTrigger"])::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  pointer-events: none;
  background-color: var(--dsw-specific-input-major);
  background-image:
    radial-gradient(100% 140% at 30% 0%, rgba(255, 255, 255, 0.38), transparent 60%),
    var(--muse-tex-belly, none);
  background-size: auto, var(--muse-tex-size);
  box-shadow:
    inset 0 2px 6px rgba(255, 255, 255, 0.45),
    inset 0 -6px 14px color-mix(in srgb, var(--m-belly-lo) 35%, transparent);
}
${D} [data-composer-card]:not([class*="cardWorkspaceTrigger"])::before {
  background-image:
    radial-gradient(100% 140% at 30% 0%, rgba(255, 255, 255, 0.08), transparent 60%),
    var(--muse-tex-faint, none);
  box-shadow: inset 0 -6px 14px rgba(0, 0, 0, 0.25);
}

/* 发送键 = 胸前的棕色纽扣（带两个小扣眼的高光） */
${S} [data-composer-card] button[class*="_primary"] {
  background:
    radial-gradient(circle at 38% 32%, rgba(255, 255, 255, 0.35), transparent 42%),
    var(--m-button) !important;
  color: #fff8f2 !important;
  border-radius: 50% !important;
  box-shadow:
    inset 0 -2px 3px rgba(0, 0, 0, 0.25),
    0 2px 4px rgba(60, 40, 30, 0.25) !important;
}

/* ── 用户气泡：一小块肚皮 ── */
${S} [class*="_bubble_"] {
  position: relative;
  isolation: isolate;
  background: transparent !important;
}
${S} [class*="_bubble_"]::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  pointer-events: none;
  background-color: var(--dsw-specific-bubble);
  background-image:
    radial-gradient(120% 120% at 30% 0%, rgba(255, 255, 255, 0.30), transparent 60%),
    var(--muse-tex-belly, none);
  background-size: auto, var(--muse-tex-size);
  box-shadow: inset 0 -4px 10px color-mix(in srgb, var(--m-belly-lo) 40%, transparent);
}

${D} [class*="_bubble_"]::before {
  background-image: var(--muse-tex-faint, none);
  background-size: var(--muse-tex-size);
}

/* 毛边：只作用在 ::before 底层，文字不动 */
body[${ATTR}][${FUZZ_ATTR}] [data-composer-card]:not([class*="cardWorkspaceTrigger"])::before {
  filter: url(#${FILTER_ID});
}
body[${ATTR}][${FUZZ_ATTR}] [class*="_bubble_"]::before {
  filter: url(#${FILTER_SOFT_ID});
}

/* ── Muse 小团子：趴在输入框上沿 ── */
.dsh-muse-mascot {
  position: fixed;
  left: 0;
  top: 0;
  width: 92px;
  height: 56px;
  z-index: 5;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.25s ease;
  will-change: transform;
}
.dsh-muse-mascot[data-visible] { opacity: 1; }
.dsh-muse-mascot svg { width: 100%; height: 100%; overflow: visible; display: block; }
.dsh-muse-mascot .muse-bob { animation: dsh-muse-bob 5.5s ease-in-out infinite; transform-origin: 50% 100%; }
.dsh-muse-mascot .muse-eye { animation: dsh-muse-blink 4.8s infinite; transform-box: fill-box; transform-origin: center; }
@keyframes dsh-muse-bob { 0%, 100% { transform: translateY(2px); } 50% { transform: translateY(-1px); } }
@keyframes dsh-muse-blink { 0%, 93%, 100% { transform: scaleY(1); } 95.5% { transform: scaleY(0.12); } }
@media (prefers-reduced-motion: reduce) {
  .dsh-muse-mascot .muse-bob, .dsh-muse-mascot .muse-eye { animation: none; }
}
`;

    // ───────────────────────── 绒毛纹理 ─────────────────────────

    /** 可复现的伪随机，保证每次启动毛长得一样。 */
    function rng(seed) {
      let s = seed >>> 0;
      return () => {
        s = (s + 0x6d2b79f5) >>> 0;
        let t = s;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }

    const PILES = {
      soft: { tufts: 0.8, len: 0.75, alpha: 0.75 },
      normal: { tufts: 1, len: 1, alpha: 1 },
      long: { tufts: 1.1, len: 1.35, alpha: 1.1 },
    };

    /**
     * 画一张无缝的灰度绒毛贴图（透明底），返回 canvas。
     *
     * 毛绒玩具的观感来自「一簇一簇」：每簇几十根纤维朝同一方向倒，
     * 根部暗、毛尖亮。所以按簇生成，而不是均匀撒噪点：
     *   1. 低频绒团明暗（大块起伏）
     *   2. 毛簇：暗色根部纤维 → 柔化 → 亮色毛尖
     *   3. 少量散毛填缝
     * 同色同宽的纤维合并进同一条 Path2D 一次描边，上万根也只要几十毫秒。
     */
    function paintFur(size, pileName) {
      const pile = PILES[pileName] || PILES.normal;
      const k = size / 400;
      const R = rng(20261108);
      const TAU = Math.PI * 2;
      const offsets = [-size, 0, size];

      const make = () => {
        const cv = document.createElement('canvas');
        cv.width = cv.height = size;
        return cv;
      };
      const base = make();
      const g = base.getContext('2d');

      // 1. 低频绒团
      for (let i = 0; i < 110; i += 1) {
        const x = R() * size;
        const y = R() * size;
        const r = size * (0.025 + R() * 0.045);
        const light = R() < 0.5;
        const a = (light ? 0.07 : 0.04) * pile.alpha;
        for (const dx of offsets) {
          for (const dy of offsets) {
            const cx = x + dx;
            const cy = y + dy;
            if (cx + r < 0 || cx - r > size || cy + r < 0 || cy - r > size) continue;
            const grad = g.createRadialGradient(cx, cy, 0, cx, cy, r);
            grad.addColorStop(0, light ? `rgba(255,255,255,${a})` : `rgba(26,34,50,${a})`);
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            g.fillStyle = grad;
            g.fillRect(cx - r, cy - r, r * 2, r * 2);
          }
        }
      }

      // 纤维收集器：按 (层, 档位) 分桶
      const BUCKETS = 4;
      const newLayer = () => Array.from({ length: BUCKETS }, () => new Path2D());
      const roots = newLayer();
      const mids = newLayer();
      const tips = newLayer();
      const addStrand = (paths, x, y, ang, len, bendK) => {
        const ex = x + Math.cos(ang) * len;
        const ey = y + Math.sin(ang) * len;
        const bend = (R() - 0.5) * len * bendK;
        const mx = (x + ex) / 2 - Math.sin(ang) * bend;
        const my = (y + ey) / 2 + Math.cos(ang) * bend;
        const path = paths[(R() * BUCKETS) | 0];
        const minX = Math.min(x, ex, mx);
        const maxX = Math.max(x, ex, mx);
        const minY = Math.min(y, ey, my);
        const maxY = Math.max(y, ey, my);
        for (const dx of offsets) {
          if (maxX + dx < 0 || minX + dx > size) continue;
          for (const dy of offsets) {
            if (maxY + dy < 0 || minY + dy > size) continue;
            path.moveTo(x + dx, y + dy);
            path.quadraticCurveTo(mx + dx, my + dy, ex + dx, ey + dy);
          }
        }
      };

      // 2. 毛簇
      const tuftCount = Math.round(((size * size) / 420) * pile.tufts);
      for (let t = 0; t < tuftCount; t += 1) {
        const cx = R() * size;
        const cy = R() * size;
        // 主要往下倒，但每簇方向都不同，避免出现重复的条纹
        const dir = Math.PI / 2 + (R() - 0.5) * 2.6;
        const spread = 0.25 + R() * 0.35;
        const radius = (5 + R() * 7) * k;
        const strands = 34 + ((R() * 30) | 0);
        for (let s = 0; s < strands; s += 1) {
          const rr = Math.sqrt(R()) * radius;
          const ra = R() * TAU;
          const x = cx + Math.cos(ra) * rr;
          const y = cy + Math.sin(ra) * rr;
          const ang = dir + (R() - 0.5) * spread * 2;
          const len = (8 + R() * 10) * k * pile.len;
          addStrand(roots, x, y, ang, len, 0.5);
          if (R() < 0.55) addStrand(mids, x, y, ang, len * 0.85, 0.4);
          // 毛尖：从纤维后段开始的一小截亮线
          if (R() < 0.6) {
            const sx = x + Math.cos(ang) * len * 0.55;
            const sy = y + Math.sin(ang) * len * 0.55;
            addStrand(tips, sx, sy, ang + (R() - 0.5) * 0.3, len * 0.45, 0.3);
          }
        }
      }

      // 3. 散毛填缝
      const loose = Math.round(size * size * 0.06);
      for (let i = 0; i < loose; i += 1) {
        const ang = R() * TAU;
        const len = (3 + R() * 6) * k * pile.len;
        addStrand(R() < 0.5 ? roots : mids, R() * size, R() * size, ang, len, 0.7);
      }

      const strokeLayer = (ctx, paths, rgb, aRange, wRange) => {
        ctx.lineCap = 'round';
        paths.forEach((path, b) => {
          const t = (b + 0.5) / BUCKETS;
          const a = Math.min(1, (aRange[0] + (aRange[1] - aRange[0]) * t) * pile.alpha);
          ctx.strokeStyle = `rgba(${rgb},${a.toFixed(3)})`;
          ctx.lineWidth = (wRange[0] + (wRange[1] - wRange[0]) * (1 - t)) * k;
          ctx.stroke(path);
        });
      };

      // 根部与中层画在单独一张上再柔化，像毛绒那样没有硬边
      const soft = make();
      const sg = soft.getContext('2d');
      strokeLayer(sg, roots, '22,30,46', [0.035, 0.08], [0.9, 1.5]);
      strokeLayer(sg, mids, '255,255,255', [0.04, 0.09], [0.8, 1.3]);
      g.save();
      g.filter = `blur(${(0.7 * k).toFixed(2)}px)`;
      for (const dx of offsets) for (const dy of offsets) g.drawImage(soft, dx, dy);
      g.restore();

      // 毛尖保持清晰，带出“绒光”
      strokeLayer(g, tips, '255,255,255', [0.07, 0.17], [0.6, 0.9]);
      return base;
    }

    function canvasToUrl(canvas) {
      return new Promise((resolve) => {
        if (canvas.toBlob) {
          canvas.toBlob((blob) => resolve(blob ? URL.createObjectURL(blob) : canvas.toDataURL()), 'image/png');
        } else {
          resolve(canvas.toDataURL());
        }
      });
    }

    async function buildTextures(pileName) {
      const size = 400; // 以 200px 显示 → 2x 清晰度
      const strong = paintFur(size, pileName);
      const fade = (alpha) => {
        const cv = document.createElement('canvas');
        cv.width = cv.height = size;
        const cg = cv.getContext('2d');
        cg.globalAlpha = alpha;
        cg.drawImage(strong, 0, 0);
        return cv;
      };
      // 肚皮的绒比身上短、更顺，用淡一些的同款纹理
      const [strongUrl, bellyUrl, faintUrl] = await Promise.all([
        canvasToUrl(strong),
        canvasToUrl(fade(0.45)),
        canvasToUrl(fade(0.3)),
      ]);
      return { strongUrl, bellyUrl, faintUrl };
    }

    // ───────────────────────── SVG：毛边滤镜 + 小团子 ─────────────────────────
    const SVG_NS = 'http://www.w3.org/2000/svg';

    function buildFilterHost() {
      const host = document.createElementNS(SVG_NS, 'svg');
      host.setAttribute('aria-hidden', 'true');
      host.setAttribute('width', '0');
      host.setAttribute('height', '0');
      host.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
      host.dataset.plugin = 'dsh-client-ui-skin-muse-plush';
      host.innerHTML = `
        <defs>
          <filter id="${FILTER_ID}" x="-4%" y="-12%" width="108%" height="124%" color-interpolation-filters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="11" result="n"/>
            <feDisplacementMap in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
          <filter id="${FILTER_SOFT_ID}" x="-6%" y="-18%" width="112%" height="136%" color-interpolation-filters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="1.05" numOctaves="2" seed="5" result="n"/>
            <feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
        </defs>`;
      return host;
    }

    /** 灰蓝圆脑袋 + 灰米耳朵 + 纽扣眼 + 小弧线笑，下半身藏在输入框后面。 */
    function buildMascot() {
      const el = document.createElement('div');
      el.className = 'dsh-muse-mascot';
      el.setAttribute('aria-hidden', 'true');
      el.innerHTML = `
        <svg viewBox="0 0 92 56" xmlns="${SVG_NS}">
          <defs>
            <filter id="dsh-muse-mascot-fuzz" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="3" result="n"/>
              <feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" xChannelSelector="R" yChannelSelector="G"/>
            </filter>
            <pattern id="dsh-muse-mascot-fur" patternUnits="userSpaceOnUse" width="60" height="60">
              <image class="muse-fur-img" href="" width="60" height="60" preserveAspectRatio="none"/>
            </pattern>
            <radialGradient id="dsh-muse-mascot-light" cx="35%" cy="20%" r="80%">
              <stop offset="0" stop-color="#fff" stop-opacity="0.45"/>
              <stop offset="0.6" stop-color="#fff" stop-opacity="0"/>
            </radialGradient>
            <clipPath id="dsh-muse-mascot-clip"><rect x="-10" y="-10" width="112" height="66"/></clipPath>
          </defs>
          <g class="muse-bob" clip-path="url(#dsh-muse-mascot-clip)">
            <g filter="url(#dsh-muse-mascot-fuzz)">
              <circle cx="19" cy="17" r="11" style="fill:var(--m-belly)"/>
              <circle cx="73" cy="17" r="11" style="fill:var(--m-belly)"/>
              <circle cx="19" cy="17" r="11" fill="url(#dsh-muse-mascot-fur)"/>
              <circle cx="73" cy="17" r="11" fill="url(#dsh-muse-mascot-fur)"/>
              <path d="M8 60 C8 30 24 10 46 10 C68 10 84 30 84 60 Z" style="fill:var(--m-fur)"/>
              <path d="M8 60 C8 30 24 10 46 10 C68 10 84 30 84 60 Z" fill="url(#dsh-muse-mascot-fur)"/>
              <path d="M8 60 C8 30 24 10 46 10 C68 10 84 30 84 60 Z" fill="url(#dsh-muse-mascot-light)"/>
            </g>
            <ellipse class="muse-eye" cx="34" cy="33" rx="2.6" ry="3" style="fill:var(--muse-ink)"/>
            <ellipse class="muse-eye" cx="58" cy="33" rx="2.6" ry="3" style="fill:var(--muse-ink)"/>
            <circle cx="35" cy="32" r="0.8" fill="#fff" opacity="0.8"/>
            <circle cx="59" cy="32" r="0.8" fill="#fff" opacity="0.8"/>
            <path d="M40 41 Q46 46 52 41" fill="none" style="stroke:var(--muse-ink)" stroke-width="1.8" stroke-linecap="round"/>
          </g>
        </svg>`;
      return el;
    }

    // ───────────────────────── 皮肤管理器协议（v2，不依赖其运行时） ─────────────────────────
    const EVENTS = {
      register: 'dsh:skin-customization-register-v2',
      unregister: 'dsh:skin-customization-unregister-v2',
      ready: 'dsh:skin-customization-ready-v2',
    };

    function exposeCustomization(definition) {
      const token = {};
      const register = () => {
        window.dispatchEvent(new CustomEvent(EVENTS.register, { detail: { token, definition } }));
      };
      window.addEventListener(EVENTS.ready, register);
      register();
      return () => {
        window.removeEventListener(EVENTS.ready, register);
        window.dispatchEvent(new CustomEvent(EVENTS.unregister, { detail: { token, definition } }));
        definition.apply(null);
      };
    }

    // ───────────────────────── 装配 ─────────────────────────
    function apply(ctx) {
      ctx.effect(() => {
        const body = document.body;
        const style = document.createElement('style');
        style.dataset.plugin = 'dsh-client-ui-skin-muse-plush';
        style.textContent = CSS;
        document.head.appendChild(style);

        const filterHost = buildFilterHost();
        body.appendChild(filterHost);
        body.setAttribute(ATTR, '');

        const mascot = buildMascot();
        body.appendChild(mascot);
        const furImg = mascot.querySelector('.muse-fur-img');

        let disposed = false;
        let urls = [];
        let currentPile = null;
        let mascotOn = DEFAULTS.mascot;

        const setVar = (name, value) => body.style.setProperty(name, value);

        async function ensureTexture(pile) {
          if (pile === currentPile) return;
          currentPile = pile;
          const { strongUrl, bellyUrl, faintUrl } = await buildTextures(pile);
          if (disposed || pile !== currentPile) {
            [strongUrl, bellyUrl, faintUrl].forEach((u) => u.startsWith('blob:') && URL.revokeObjectURL(u));
            return;
          }
          const old = urls;
          urls = [strongUrl, bellyUrl, faintUrl];
          setVar('--muse-tex', `url("${strongUrl}")`);
          setVar('--muse-tex-faint', `url("${faintUrl}")`);
          setVar('--muse-tex-belly', `url("${bellyUrl}")`);
          furImg.setAttribute('href', strongUrl);
          old.forEach((u) => u.startsWith('blob:') && URL.revokeObjectURL(u));
        }

        function applyValues(values) {
          const v = { ...DEFAULTS, ...(values || {}) };
          setVar('--muse-fur', v.fur);
          setVar('--muse-belly', v.belly);
          body.toggleAttribute(FUZZ_ATTR, v.fuzzyEdges !== false);
          mascotOn = v.mascot !== false;
          placeMascot();
          ensureTexture(PILES[v.pile] ? v.pile : 'normal');
        }

        // 小团子跟随输入框：轮询 + ResizeObserver，避免监听整棵对话树
        const CARD_SELECTOR = '[data-composer-card]:not([class*="cardWorkspaceTrigger"])';
        let observedCard = null;
        const resizeObserver = new ResizeObserver(() => placeMascot());
        function placeMascot() {
          const card = mascotOn ? document.querySelector(CARD_SELECTOR) : null;
          if (card !== observedCard) {
            if (observedCard) resizeObserver.unobserve(observedCard);
            observedCard = card;
            if (card) resizeObserver.observe(card);
          }
          if (!card) {
            mascot.removeAttribute('data-visible');
            return;
          }
          const r = card.getBoundingClientRect();
          if (r.width < 280 || r.height === 0 || r.bottom <= 0) {
            mascot.removeAttribute('data-visible');
            return;
          }
          const x = Math.round(r.right - 92 - 34);
          const y = Math.round(r.top - 56 + 3);
          mascot.style.transform = `translate(${x}px, ${y}px)`;
          mascot.setAttribute('data-visible', '');
        }
        const timer = window.setInterval(placeMascot, 500);
        window.addEventListener('resize', placeMascot);

        applyValues(null);

        const disposeCustomization = exposeCustomization({
          protocol: 2,
          skinId: SKIN_ID,
          title: 'Muse 毛绒',
          titleEn: 'Muse Plush',
          settings: [
            { key: 'mascot', type: 'boolean', label: '输入框上的 Muse 小团子', labelEn: 'Muse peeking over the composer', defaultValue: DEFAULTS.mascot },
            { key: 'fuzzyEdges', type: 'boolean', label: '毛边（气泡与输入框边缘毛茸茸）', labelEn: 'Fuzzy edges', defaultValue: DEFAULTS.fuzzyEdges },
            {
              key: 'pile',
              type: 'select',
              label: '绒毛长度',
              labelEn: 'Pile length',
              defaultValue: DEFAULTS.pile,
              options: [
                { value: 'soft', label: '短绒（更干净）', labelEn: 'Short' },
                { value: 'normal', label: '标准（像 Muse）', labelEn: 'Muse' },
                { value: 'long', label: '长绒（更蓬）', labelEn: 'Long' },
              ],
            },
            { key: 'fur', type: 'color', label: '毛色', labelEn: 'Fur colour', defaultValue: DEFAULTS.fur },
            { key: 'belly', type: 'color', label: '耳朵 / 肚皮色', labelEn: 'Ear & belly colour', defaultValue: DEFAULTS.belly },
          ],
          apply(state) {
            if (disposed) return;
            applyValues(state ? state.values : null);
          },
        });

        return () => {
          disposed = true;
          disposeCustomization();
          window.clearInterval(timer);
          window.removeEventListener('resize', placeMascot);
          resizeObserver.disconnect();
          mascot.remove();
          filterHost.remove();
          style.remove();
          body.removeAttribute(ATTR);
          body.removeAttribute(FUZZ_ATTR);
          ['--muse-tex', '--muse-tex-faint', '--muse-tex-belly', '--muse-fur', '--muse-belly'].forEach((n) => body.style.removeProperty(n));
          urls.forEach((u) => u.startsWith('blob:') && URL.revokeObjectURL(u));
          urls = [];
        };
      }, 'muse-plush: skin');
    }

    return { inject: [], apply };
  },
});
