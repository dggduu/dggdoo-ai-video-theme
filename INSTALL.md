# M3 视频主题包 · 安装说明

6 套 Material Design 3 视频主题 + 章节进度条组件，配合
[`web-video-presentation`](https://github.com/ConardLi/garden-skills) skill 使用。

**核心特性：动态取色** —— 每套主题只暴露一个 `--seed`，改这一个值，
整套 MD3 色调板（tone 10→99）与 30 个语义色角色自动重算，纯 CSS 实现。

---

## 目录

```
video-theme/
├── INSTALL.md              本文件
├── DESIGN.md               设计说明：token 契约 / 动效规范 / 章节写作配方
├── preview.html            预览页（单文件，双击打开）
├── fonts-append.css        需要追加到 skill 的 fonts.css
├── components/             章节进度条组件（可选安装）
│   ├── ChapterProgress.tsx
│   └── ChapterProgress.css
└── themes/                 6 套主题
    ├── m3-tonal-spot/{tokens.css, theme.json}
    ├── m3-tonal-dark/
    ├── m3-vibrant/
    ├── m3-expressive/
    ├── m3-expressive-dark/
    └── m3-quiet/
```

---

## 1. 先看预览

双击 `preview.html`（用 Chrome / Edge 打开）。

- 顶部切换 **8 个页面类型**：封面 / 媒体页 / 图文页 / 卡片页 / 递进页 / 图表页 / 数据页 / 尾页
- 左上角 **SEED** 改种子色，6 套主题同时变色
- **CHROMA** 滑杆调饱和度（0 = 纯灰，1 = 种子原样，>1 更艳）
- 点任意卡片放大，`←` `→` 切页

---

## 2. 安装主题

主题就是两个文件（`tokens.css` + `theme.json`），复制到 skill 的 `themes/` 即可。

**bash / Git Bash**

```bash
SKILL=~/.workbuddy-ai/skills/web-video-presentation
cp -r themes/m3-* "$SKILL/themes/"
bash "$SKILL/scripts/scaffold.sh" --list-themes    # 应该能看到 6 个 m3-*
```

**PowerShell**

```powershell
$skill = "$env:USERPROFILE\.workbuddy-ai\skills\web-video-presentation"
Copy-Item -Recurse -Force .\themes\m3-* "$skill\themes\"
bash "$skill/scripts/scaffold.sh" --list-themes
```

> 如果你的 skill 装在别处，把 `SKILL` 改成实际路径。

---

## 3. 安装字体

主题的西文用 Roboto Flex / Roboto，中文用 Noto Sans SC，走 Google Fonts。
把 `fonts-append.css` 的 3 行追加到 skill 的 `templates/src/styles/fonts.css` 末尾：

```bash
cat fonts-append.css >> "$SKILL/templates/src/styles/fonts.css"
```

```powershell
Get-Content .\fonts-append.css | Add-Content "$skill\templates\src\styles\fonts.css"
```

不装也能跑，只是西文回退到系统 sans-serif，字重和字距会不准。

---

## 4. 安装进度条组件（可选）

底部那条「章节时间轴」进度条。如果 skill 里已经有
`templates/src/components/ChapterProgress.tsx`，跳过这一步。

```bash
cp components/ChapterProgress.* "$SKILL/templates/src/components/"
```

然后把它挂到 `templates/src/App.tsx` 的 `<Stage>` 内部（**必须在 Stage 里**，
才会跟着录屏进画面）：

```tsx
import { ChapterProgress } from "./components/ChapterProgress";

// ...

<Stage onAdvance={stepper.next}>
  <div key={ch.id} className="scene">
    <Cmp step={stepper.cursor.step} />
  </div>
  <ChapterProgress chapters={CHAPTERS} cursor={stepper.cursor} />
</Stage>
```

---

## 5. 用起来

```bash
bash "$SKILL/scripts/scaffold.sh" ./presentation --theme=m3-expressive
cd presentation && npm run dev
```

**换主题** = 覆盖一个文件：

```bash
cp "$SKILL/themes/m3-vibrant/tokens.css" presentation/src/styles/tokens.css
```

**换主色** = 改一个值：

```css
/* presentation/src/styles/tokens.css 顶部 */
:root {
  --seed: #00639b;   /* ← 只改这里 */
}
```

---

## 6. 六套主题

| id | 明暗 | 默认种子 | 性格 / 适用 |
|---|---|---|---|
| `m3-tonal-spot` | 浅 | `#6750a4` | Material You 标准：色调表面分层、16px 圆角、无装饰。产品讲解、方法论、企业培训 |
| `m3-tonal-dark` | 深 | `#6750a4` | 近黑表面 + 主色 surface tint 光晕。技术分享、开发者大会、暗场录制 |
| `m3-vibrant` | 浅 | `#00696e` | 高饱和容器、24px 圆角、双色柔光斑。产品发布、增长复盘、社媒短视频 |
| `m3-expressive` | 浅 | `#e8542f` | M3 Expressive：36px 圆角、800 字重、弹簧回弹。品牌 keynote、面向大众的科普 |
| `m3-expressive-dark` | 深 | `#e8542f` | 黑底高饱和容器、44px 圆角、光池。发布会、预告、沉浸叙事 |
| `m3-quiet` | 浅 | `#3f5d53` | 低饱和、140×100 留白、300 字重。深度长文、研究汇报、访谈 |

每套都支持任意种子色（含品牌色），改 `--seed` 即可。

---

## 7. 底部版式约定（写章节时照这个留位）

底部从下往上是三层，**不要被内容压到**：

| 层 | 位置 | 尺寸 |
|---|---|---|
| 进度条 | `bottom: 12px` | 8px 高，末端 8px stop indicator |
| 章名行 | 进度条上方 14px | 19px（当前章 27px + 主色 + 600） |
| 字幕 | `bottom: 86px` | 46px 居中 |

所以章节根节点：

```css
padding-bottom: calc(var(--stage-pad-y) + 104px);  /* 有视频/大图的页面用 +112px */
```

文字内容统一压在底部（`margin-top: auto`），上方留白。

---

## 8. 依赖与兼容

- **浏览器**：Chrome / Edge 111+（需要 `oklch(from …)` 相对色语法）。
  更旧的浏览器会自动回退到 `tokens.css` 里的静态色调板——仍是一套合法的
  M3 配色，只是不再跟随 `--seed`。
- **字体**：Google Fonts（Roboto Flex / Roboto / Roboto Mono / Noto Sans SC）。
  离线环境会回退到系统字体。
- **构建**：主题是纯 CSS + JSON，没有构建步骤，没有运行时依赖。
- **组件层**：`tokens.css` 末尾带一组视频原语（`.m3-card` / `.m3-chip` /
  `.m3-tab` / `.m3-kicker` / `.m3-rule` / `.m3-shape` / `.m3-progress`），
  章节可直接用 class，不用自己写组件 CSS。

---

## 9. 已验证

- 6 套 × 5 个种子（默认 / 高饱和红 / 绿 / 黄 / 深蓝）：所有 `on-*` 与
  `*-container` 配对对比度 **≥ 4.5:1**；`--text-faint` ≥ 3.4:1（提示级）。
- 每个 tone 设了 sRGB 色度上限，避免高饱和种子把浅容器和深文字一起裁切。
- 8 个页面类型 × 6 套主题在 1920×1080 下渲染验证通过。
