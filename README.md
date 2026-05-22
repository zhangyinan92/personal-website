# 张依楠 · 个人作品集网站

> 数据 × 产品 复合型 · 港大信息系统 + 翻译 双主修
> 求职定位：数据分析师 / Business Analyst / 产品经理 / 产品助理 / IT

## 📂 项目结构

```
personal-website/
├── index.html              # 主页面 (中英双语内嵌)
├── style.css               # 样式 (白底 + 轻手绘)
├── script.js               # 交互 (开屏动画 / 语言切换 / 模拟AI / 灯箱 / 手机号展开)
├── assets/
│   ├── photos/             # 11 张照片
│   └── resumes/
│       ├── ZhangYinan-CN.pdf
│       └── ZhangYinan-EN.pdf
└── README.md
```

## 🚀 本地查看

**最简单方式：** 双击 `index.html` 即可在浏览器里看到。

如果浏览器对本地文件的字体加载有限制，推荐用一个本地 server：

```bash
cd personal-website
python3 -m http.server 8000
# 然后访问 http://localhost:8000
```

## 🌐 部署到 GitHub Pages

1. 在 GitHub 新建 repo（公开），repo 名建议 `yinan-portfolio` 或 `<你的用户名>.github.io`
2. 把 `personal-website/` 里的所有文件推上去
3. Settings → Pages → Source 选 `main` 分支根目录 → Save
4. 等 1 分钟，访问 `https://<用户名>.github.io/<repo名>/`

## ✨ 功能清单

- ✅ 开屏动画：手写体 "hi 你好 ✦ Hello, I'm Nicola." 逐字浮现 + 下划线
- ✅ 中英双语切换（右上角 中/EN，本地记忆上次选择）
- ✅ Hero 区 4 张照片叠放，悬停散开成扇形
- ✅ "问问我 🤖" 模拟 AI：4 个预设问题 + 自定义输入兜底，假流式打字
- ✅ 教育 / 实习 / 项目 / 技能 / 课外 / 联系 全部 section
- ✅ 简历 PDF 一键下载（中文 / 英文）
- ✅ 手机号点击展开 + 再点复制（防爬）
- ✅ 项目图片可点击放大（灯箱）
- ✅ 滚动渐入动画
- ✅ 移动端响应式

## 🎨 设计令牌

| 元素 | 值 |
|---|---|
| 背景 | `#FDFCFA` (米白) |
| 主色 | `#1A1A1A` (墨黑) |
| 点缀橙 | `#F97316` |
| 点缀绿 | `#10B981` |
| 手写体 | Caveat / Kalam |
| 正文体 | Inter + 思源黑体 |
| 卡片阴影 | `box-shadow: 4px 4px 0 #1A1A1A` |

## 📝 自定义内容

- **改文案：** 直接在 `index.html` 找到对应 `<span data-lang="zh">…` / `<span data-lang="en">…` 改即可
- **改 AI 回答：** 改 `script.js` 顶部的 `ANSWERS` 对象
- **换照片：** 替换 `assets/photos/` 里同名文件即可，无需改代码
- **改主色：** 改 `style.css` 顶部 `:root` 里的 CSS 变量

---
© 2026 Yinan Zhang
