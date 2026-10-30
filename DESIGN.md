# M3 主题包 · 6 套（动态取色）

Material Design 3 主题，全部**动态取色**：只改一个 `--seed`，整套色调板与
30 个语义色角色自动重算。配色算法用 CSS `oklch(from …)` 相对色 + MD3 的
tone → OKLab L 映射，不依赖任何 JS。

| id | 名称 | 明暗 | 默认种子 | 性格 |
|---|---|---|---|---|
| `m3-tonal-spot` | M3 动态 · 浅色 | light | `#6750a4` | 标准 Material You：色调表面、单一主色、16px 圆角、无装饰 |
| `m3-tonal-dark` | M3 动态 · 深色 | dark | `#6750a4` | 近黑表面 + surface tint 光晕，暗场录制友好 |
| `m3-vibrant` | M3 活力 | light | `#00696e` | 高饱和容器、24px 圆角、双色柔光斑、干脆弹簧 |
| `m3-expressive` | M3 表现力 · 浅色 | light | `#e8542f` | Expressive：36px 圆角、800 字重、回弹动效 |
| `m3-expressive-dark` | M3 表现力 · 深色 | dark | `#e8542f` | 黑底高饱和容器、44px 圆角、戏剧性光池 |
| `m3-quiet` | M3 素净 | light | `#3f5d53` | 低饱和、140×100 留白、300 字重、极静节奏 |

选择建议见各主题 `theme.json` 的 `bestFor`。

---

## 一、动态取色

### 改一个值

```css
:root {
  --seed: #00639b;      /* ← 只改这里 */
}
```

刷新页面，primary / secondary / tertiary / neutral / neutral-variant 五条
色调板（tone 4→100）与全部 `--md-*` 角色重新生成。

### 三个旋钮

| 变量 | 默认 | 作用 |
|---|---|---|
| `--seed` | 每套主题不同 | 种子色。色相决定整套配色，明度/彩度只影响起点 |
| `--chroma` | 1（vibrant 1.6 / quiet 0.85） | 饱和度倍率。`0` = 纯灰 M3，`1` = 种子原样，`>1` = 更鲜艳 |
| `--chroma-scale` | 1 | 运行时全局倍率（预览页的滑杆用它），与 `--chroma` 相乘 |

### 推导规则

- **primary**：与种子同色相，tone 10→100
- **secondary**：同色相，彩度 ×0.35（M3 的降饱和次级色）
- **tertiary**：色相 +60°，彩度 ×0.55
- **neutral / neutral-variant**：同色相，彩度压到 ≤0.016 / ≤0.022（表面的微色调）

tone → OKLab L 用 MD3 baseline 调色板反解出来的固定表（tone 40 → L 0.492，
tone 90 → 0.916…），所以任意种子都能落回 M3 的明度骨架。

### 回退

```css
@supports (color: oklch(from red l c h)) { … }
```

不支持相对色的浏览器（Chrome < 111）保留 `:root` 里的静态兜底色调板 ——
仍是一套合法 M3 配色，只是不再跟随 `--seed`。**录屏用 Chrome 即可。**

---

## 二、Token

### M3 语义色（30 个，全部随种子变）

```
primary / on-primary / primary-container / on-primary-container
secondary / on-secondary / secondary-container / on-secondary-container
tertiary / on-tertiary / tertiary-container / on-tertiary-container
error / on-error / error-container / on-error-container      ← 固定，不随种子
surface / on-surface / surface-variant / on-surface-variant
surface-container-lowest / -low / (default) / -high / -highest
outline / outline-variant
inverse-surface / inverse-on-surface / inverse-primary
```

命名 `--md-<role>`。章节里可以直接用，比 `--accent` 更细。

### 视频主题契约（章节必须消费的部分）

| token | 映射 |
|---|---|
| `--shell` | light `n-92` / dark `n-4` |
| `--surface` | `surface` |
| `--surface-2` / `--surface-3` | `surface-container` / `-high` |
| `--text` / `--text-2` | `on-surface` / `on-surface-variant` |
| `--text-mute` / `--text-faint` | 混合出来的两级弱化（faint ≥3.4:1，只做提示） |
| `--rule` | `outline-variant` |
| `--accent` | `primary` |
| `--accent-soft` / `--accent-glow` | `color-mix` 的同色相透明度叠层 |

### 形状

`--md-shape-xs/s/m/l/xl/xxl/full` + `--r-card`（主题性格：quiet 10px →
expressive-dark 44px）。圆角是 M3 的性格签名，**别在章节里写死 px**。

### 动效

```css
--md-ease-emphasized            cubic-bezier(0.2, 0, 0, 1)
--md-ease-emphasized-decelerate cubic-bezier(0.05, 0.7, 0.1, 1)
--md-ease-emphasized-accelerate cubic-bezier(0.3, 0, 0.8, 0.15)
--md-ease-standard / -decelerate / -accelerate
--md-spring-fast / -default / -slow / -bouncy   /* damped spring 采样成 linear() */
--md-dur-short-1…3 / medium-1…2 / long-1…2
```

通用变量已映射到 M3，`base.css` / `animations.css` 里的 primitive 自动带
M3 手感：`--ease-quart` = emphasized、`--ease-expo` = emphasized-decelerate、
`--ease-overshoot` = spring-bouncy。

---

## 三、动效规范（写章节时照这个用）

| 场景 | 用什么 | 时长 |
|---|---|---|
| 元素入场（标题、卡片） | `--md-ease-emphasized-decelerate` | 300–500ms |
| 元素退场 | `--md-ease-emphasized-accelerate` | 200–300ms |
| 有生命感的位移 / 缩放 / 形状变形 | `--md-spring-bouncy` 或 `--md-spring-default` | 400–700ms |
| 状态切换（高亮、选中） | `--md-ease-emphasized` | 200–300ms |
| 大面积转场 | `--md-ease-emphasized` | 500–700ms |

```css
/* 弹簧入场 */
.card-in {
  animation: card-in 620ms var(--md-spring-bouncy) both;
}
@keyframes card-in {
  from { opacity: 0; transform: translateY(48px) scale(0.94); }
  to   { opacity: 1; transform: none; }
}

/* 形状变形（Expressive 签名动作） */
.fab {
  border-radius: var(--md-shape-l);
  transition: border-radius 420ms var(--md-spring-default),
              width 420ms var(--md-spring-default);
}
.fab:hover { border-radius: var(--md-shape-full); }
```

**别做**：匀速 / `ease-in-out` 兜底、`linear` 长动画、超过 1 个 overshoot
弹跳、给所有元素加持续微动。M3 的动效是**有理由的物理运动**，不是装饰。

---

## 四、章节写作配方（怎么看起来像 M3，且不像 PPT）

1. **用色调表面做层级，不要阴影**。一块内容 = 一个 `surface-container`
   色块，再嵌一层用 `-high`。`--card-shadow` 最多到 level 1。
2. **圆角分层且同级一致**：大容器 `--r-card`，小标签 `999px`，图标容器
   `--md-shape-m`。同一屏里同级元素圆角必须一样。
3. **一个主色**。强调 = `--md-primary`；`tertiary` 只做点缀，占比 <10%。
4. **一屏一件事**。大标题 + 一句说明 + 一个视觉主体（色块 / 视频 / 数字），
   不要塞三列卡片。留白是 M3 的一部分，`--stage-pad-*` 别压缩。
5. **大标题 700–800 字重、`letter-spacing: -0.03em`**；正文 400、行高 1.5；
   数字用 `.hero-num`（主题已配好 weight / tracking）。
6. **列表逐条揭示**，行与行用 1px `outline-variant` 分隔，不要堆卡片。
7. **小标签克制**：`chip` 只用于章节标记 / 时间 / 来源，一屏不超过 3 个。
8. **动效按上表**，入场 decelerate，形变 spring，不要给所有元素加微动。

---

## 五、进度条（已内置）

`src/components/ChapterProgress.tsx`，脚手架已接进 `Stage` 内部，
**跟着录屏一起进画面**（不是悬浮 UI）。

- **每章一段**：段宽 = 该章 `narrations.length`（内容长度），章名标在段落上方。
- **当前章高亮**：章名变主色 + 加粗 + **字号放大**（19px → 27px）；段落轨道变主色浅底，填充按「步内进度」推进。
- **已过的章填满、未到的章留空**，所以整片结构一眼可见。
- **不显示页码 / 百分比** —— 进度表达的是「讲到哪一章的哪一步」，不是翻页。
- **M3 规范**：8px 高（4dp 的视频放大版）、4px 圆角、末端 8px stop indicator；
  轨道 `outline-variant`（比 spec 的 surface-variant 深一档，视频里才看得见），
  填充 `--md-primary`。数值变化走 `width` 过渡，进入即开始，不会每次从头生长。
- **位置**：贴在舞台最底边（`bottom: 12px`），上面依次是章名行、字幕行。
  底部层次固定为：`字幕 → 章名 → 进度条`。
- **字幕**：46px、居中、`bottom: 86px`（一行约 62px 高）。字号够大，
  所以正文区必须让位 —— 章节根节点 padding-bottom 用
  `calc(var(--stage-pad-y) + 104px)`（有视频/大图的页面 `+112px`）。
- **版式**：文字内容统一压在底部（`margin-top: auto`），上方留白。

不要自己再画一个进度条，也不要把它做成可点击的分页器。

---

## 六、已验证

- 6 套 × 5 个种子（含高饱和红 / 绿 / 黄 / 深蓝）：所有 `on-*` / `*-container`
  配对对比度 ≥ 4.5:1；`--text-faint` ≥ 3.4:1（提示级）。
- 相对色在 Chrome 111+ 正常；旧浏览器回退静态板。
- 预览页：`preview.html`（单文件，8 个页面类型 × 6 套，可改种子 / 饱和度）。

---

## 七、边界

- **M3 Expressive 在 Web 没有官方实现**（`@material/web` 维护模式）。本包用
  CSS 复刻其设计语言：加大圆角、强调字重、`linear()` 弹簧、形状变形。
  组件级的 expressive API（如 shape morph 组件）不存在，别去找。
- 弹簧是**采样近似**（26 点 `linear()`），不是真物理求解；观感一致，
  但无法做「拖拽跟手」这类交互物理。
- 每个 tone 有 **sRGB 色域上限**（tone 40 ≈ 0.19、tone 80 ≈ 0.11、tone 90 ≈ 0.055）。
  `--chroma` 超过上限后该 tone 不再变艳 —— 这是为了保住对比度（否则浅容器
  和深文字会一起被裁切、对比度掉到 3:1 以下）。想要更艳就换更饱和的种子。
- 深色主题的 `--md-on-primary` 用 tone 10（spec 是 20），为了在极端种子下
  仍保住 4.5:1。
