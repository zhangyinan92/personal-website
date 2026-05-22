/* ============================================================
   Zhang Yinan · Portfolio · main.js
   1. 中英双语切换
   2. 导航 scrolled / active 状态
   3. 滚动 reveal 动画
   4. 数字 counter 动画
   5. 技能条填充
   6. 粒子背景
   ============================================================ */

/* ---------------- I18N ---------------- */
const I18N = {
  zh: {
    'nav.about': '关于', 'nav.education': '教育', 'nav.experience': '实习',
    'nav.projects': '项目', 'nav.skills': '技能', 'nav.activities': '活动', 'nav.contact': '联系',

    'hero.status': '求职中 · Open to Internship & Full-time',
    'hero.greeting': '你好，我是',
    'hero.name': '张依楠',
    'hero.tagline': '数据分析 × 产品思维 · 用数据讲故事，用模型驱动决策',
    'hero.stat1': 'QS 全球第 11',
    'hero.stat2': '分析交通数据量',
    'hero.stat3': 'CART 模型误差降低',
    'hero.stat4': 'IELTS 雅思',
    'hero.cta1': '查看项目 →',
    'hero.cta2': '联系我',
    'hero.cta3': '下载简历',
    'hero.scroll': '向下滚动探索',

    'about.title': '关于我 · About',
    'about.base': '浙江宁波 · 香港',
    'about.p1': '我是来自<strong>香港大学</strong>的大三学生，主修<strong>信息系统与分析</strong>与<strong>翻译</strong>双学位。我的兴趣处于<em>数据、产品与商业</em>的交叉点——既能用 R/Tableau 把百万级数据炼成洞察，也能用 UML/Figma 把模糊的需求拆成清晰的产品逻辑。',
    'about.p2': '在<strong>和记港口（HPH）</strong>实习期间，我深入参与了 nGen / OMS 等核心港口信息系统的迭代；在<strong>上海安运人通</strong>，我协助完成了码头智能安防系统的需求建模。我相信好的产品来自对数据的尊重，也来自对真实业务的理解。',
    'about.p3': '当前正在寻找<strong>数据分析 / 商业分析 / 产品</strong>方向的实习与全职机会，欢迎随时联系。',

    'edu.title': '教育背景 · Education',
    'edu.school': '香港大学 The University of Hong Kong',
    'edu.degree': '文学学士 · 双主修 BA (Double Major)',
    'edu.major1': '信息系统与分析<br/><em>Information Systems & Analytics</em>',
    'edu.major2': '翻译<br/><em>Translation</em>',
    'edu.courses': '相关课程：',
    'edu.course1': '商业分析', 'edu.course2': '信息系统分析与设计',
    'edu.course3': '信息系统管理', 'edu.course4': '统计分析',
    'edu.course5': '经济数据分析', 'edu.course6': '中英笔译及口译',

    'exp.title': '实习经历 · Experience',
    'exp.hph.loc': '香港 Hong Kong SAR',
    'exp.hph.role': '产品开发与实施实习生 · IT 部门',
    'exp.hph.company': '和记港口集团 · Hutchison Port Holdings',
    'exp.hph.b1t': '产品迭代与业务理解：',
    'exp.hph.b1d': '参与第 91-93 次系统迭代，深度掌握 nGen、OMS 等港口核心信息系统；熟悉船舶创建至装卸货的全流程运作机制。',
    'exp.hph.b2t': '流程自动化：',
    'exp.hph.b2d': '使用 Verification Tool 编写 API 请求并设计堆场区块工作流，实现堆场数据的自动更新。',
    'exp.hph.b3t': '协作可视化：',
    'exp.hph.b3d': '运用 Draw.io 绘制 Gate Grounding 工作流图，协助团队直观拆解操作细节，提升跨部门沟通效率。',

    'exp.anyun.loc': '上海 Shanghai',
    'exp.anyun.role': '项目经理助理实习生',
    'exp.anyun.company': '上海安运人通科技有限公司',
    'exp.anyun.b1t': '需求分析与建模：',
    'exp.anyun.b1d': '参与梅北码头智能安防系统开发，使用 UML 与 Draw.io 绘制用例图、类图及序列图，完成系统底层逻辑设计。',
    'exp.anyun.b2t': 'UX 优化与项目管理：',
    'exp.anyun.b2d': '针对用户界面提出个性化优化建议，并制作 Excel 甘特图监控项目进度，确保初期计划按时交付。',

    'proj.title': '项目作品 · Projects',
    'proj.nyc.title': '纽约市交通安全大数据分析',
    'proj.nyc.sub': 'NYC Traffic Safety · 200 万+ 事故数据 · 时空建模 + 商业叙事',
    'proj.nyc.cap1': 'Kepler.gl · 200 万+ 事故点位 3D 聚类',
    'proj.nyc.cap2': '路口 vs 非路口事故的时空对比',
    'proj.nyc.cap3': 'Top 20 危险街道 + 高峰时段',
    'proj.nyc.cap4': '24 小时事故分布 · 工作日 vs 周末',
    'proj.nyc.b1t': '多维空间分析：',
    'proj.nyc.b1d': '利用 Kepler.gl 对 200 万+ 事故数据进行地理建模，3D 聚类识别高发路口与"周五晚高峰"等关键时空特征。',
    'proj.nyc.b2t': '业务洞察：',
    'proj.nyc.b2d': '用 Tableau 量化驾驶行为与伤害的相关性——摩托车伤害率高达 84.2%，大型卡车在工作日呈独特节律。',
    'proj.nyc.b3t': '数据叙事：',
    'proj.nyc.b3d': '用 PR + 剪映 把 Kepler.gl 与 Tableau 图表剪成具有商业叙事逻辑的 5 分钟数据视频。',
    'proj.nyc.b4t': '策略输出：',
    'proj.nyc.b4d': '提出"弹性通勤制度""分时段精准执法"等 4 项数据驱动的改进建议。',
    'proj.nyc.link': '▶ 观看视频报告',

    'proj.aigc.title': 'AIGC 视觉化 · ECO-DATA GRID',
    'proj.aigc.sub': '环境监测主题 · Gemini-2.5 提示词工程',
    'proj.aigc.b1t': '3 轮迭代：',
    'proj.aigc.b1d': '从基础主题 → 加入交互界面与传感器逻辑 → 去冗余指令实现画面精简化。',
    'proj.aigc.b2t': '最终产出：',
    'proj.aigc.b2d': '高逻辑性的 "ECO-DATA GRID" 视觉方案，环境数据可视化原型。',

    'proj.air.title': '航空票价预测模型',
    'proj.air.sub': 'R 语言 · 三模型横向比对 · CART 决策树最优',
    'proj.air.b1t': '建模与算法选型：',
    'proj.air.b1d': '对大规模航旅数据进行特征工程，比对线性回归 / 逻辑回归 / CART 三种模型。',
    'proj.air.b2t': '关键结果：',
    'proj.air.b2d': '剪枝后的 CART 模型解释力翻倍，绝对误差降低 25%+。',
    'proj.air.b3t': '价格动因：',
    'proj.air.b3d': '深入量化航司、舱位与航线对价格的贡献度。',

    'skill.title': '技能矩阵 · Skills',
    'skill.data': '数据分析 / 可视化',
    'skill.design': '产品 / 设计 / 视频',
    'skill.lang': '语言 · 认证',
    'skill.zh': '普通话', 'skill.en': '英语', 'skill.yue': '粤语',
    'skill.native': '母语', 'skill.basic': '基础',
    'skill.mos': '微软 MOS 认证专家',

    'act.title': '课外活动 · Activities',
    'act.tag1': '志愿者 Volunteer',
    'act.tag2': '学生顾问 Advisor',
    'act.mpf.title': '第九届海丝港口合作论坛',
    'act.mpf.desc': '负责活动标牌及港口参观稿件的英文笔译；为外宾提供口译支持，并在宁波北仑第三集装箱码头参观环节提供英文讲解与实时答疑。',
    'act.advisor.title': '香港大学文学院 · 学生学术顾问',
    'act.advisor.desc': '协助大一新生适应大学生活，指导课程选择、师生沟通、学术工具运用与职业探索，帮助他们最大化利用学校资源。',

    'ct.title': '联系我 · Contact',
    'ct.head': '期待与你的下一次合作。',
    'ct.desc': '如果你正在寻找具备<strong>数据分析能力</strong>与<strong>产品思维</strong>的年轻人，欢迎随时联系我，期待加入你的团队！',
    'ct.base': '浙江宁波 · 香港 · 远程可',
    'ct.resume': '下载完整简历 PDF →',

    'footer.note': '本站使用 vibe coding 手工打造 · Built with HTML / CSS / JS',
  },

  en: {
    'nav.about': 'About', 'nav.education': 'Education', 'nav.experience': 'Experience',
    'nav.projects': 'Projects', 'nav.skills': 'Skills', 'nav.activities': 'Activities', 'nav.contact': 'Contact',

    'hero.status': 'Open to Internship & Full-time Opportunities',
    'hero.greeting': "Hi, I'm",
    'hero.name': 'Zhang Yinan',
    'hero.tagline': 'Data Analytics × Product Thinking · Telling stories with data, driving decisions with models.',
    'hero.stat1': 'HKU · QS World #11',
    'hero.stat2': 'Traffic Records Analyzed',
    'hero.stat3': 'CART Model Error Reduction',
    'hero.stat4': 'IELTS Score',
    'hero.cta1': 'View Projects →',
    'hero.cta2': 'Get in Touch',
    'hero.cta3': 'Download CV',
    'hero.scroll': 'Scroll to explore',

    'about.title': 'About Me',
    'about.base': 'Ningbo · Hong Kong',
    'about.p1': "I'm a Year-3 student at <strong>The University of Hong Kong</strong>, double-majoring in <strong>Information Systems & Analytics</strong> and <strong>Translation</strong>. I work at the intersection of <em>data, product and business</em>—turning millions of data points into insights with R/Tableau, and translating fuzzy requirements into clear product logic with UML/Figma.",
    'about.p2': "At <strong>Hutchison Port Holdings (HPH)</strong> I joined Sprint 91-93 of core port systems (nGen, OMS); at <strong>Shanghai Anyun Rentong</strong> I helped model the requirements of an intelligent terminal-security system. Good products come from respecting both the data and the real business.",
    'about.p3': "I'm currently looking for internship and full-time roles in <strong>Data Analytics / Business Analytics / Product</strong>. Feel free to reach out.",

    'edu.title': 'Education',
    'edu.school': 'The University of Hong Kong',
    'edu.degree': 'Bachelor of Arts · Double Major',
    'edu.major1': 'Information Systems<br/><em>& Analytics</em>',
    'edu.major2': 'Translation<br/><em>(English ↔ Chinese)</em>',
    'edu.courses': 'Coursework:',
    'edu.course1': 'Business Analytics', 'edu.course2': 'IS Analysis & Design',
    'edu.course3': 'IS Management', 'edu.course4': 'Statistical Analysis',
    'edu.course5': 'Economic Data Analysis', 'edu.course6': 'EN-CN Translation & Interpretation',

    'exp.title': 'Experience',
    'exp.hph.loc': 'Hong Kong SAR',
    'exp.hph.role': 'Product Development & Implementation Intern · IT Dept.',
    'exp.hph.company': 'Hutchison Port Holdings (HPH)',
    'exp.hph.b1t': 'Product Iteration & Business Logic: ',
    'exp.hph.b1d': 'Joined Sprint 91-93 and gained deep proficiency in core port systems (nGen, OMS) and the end-to-end vessel-to-discharge workflow.',
    'exp.hph.b2t': 'Process Automation: ',
    'exp.hph.b2d': 'Used Verification Tool to write API requests and designed yard-block workflows enabling automated yard-data updates.',
    'exp.hph.b3t': 'Visualization & Collaboration: ',
    'exp.hph.b3d': 'Mapped Gate-Grounding workflows in Draw.io, accelerating cross-functional alignment.',

    'exp.anyun.loc': 'Shanghai',
    'exp.anyun.role': 'Project Manager Assistant Intern',
    'exp.anyun.company': 'Shanghai Anyun Rentong Technology Co., Ltd.',
    'exp.anyun.b1t': 'Requirements Analysis & Modeling: ',
    'exp.anyun.b1d': 'Contributed to the Meibei Terminal Intelligent Security System; produced use-case, class, and sequence diagrams via Draw.io / UML.',
    'exp.anyun.b2t': 'UX & Project Management: ',
    'exp.anyun.b2d': 'Proposed personalized UX improvements and built Excel Gantt charts to monitor milestones, ensuring on-time delivery of initial phases.',

    'proj.title': 'Projects',
    'proj.nyc.title': 'NYC Traffic Safety · Big Data Analysis',
    'proj.nyc.sub': '2M+ crash records · spatial-temporal modeling + business storytelling',
    'proj.nyc.cap1': 'Kepler.gl · 3D clustering of 2M+ crash points',
    'proj.nyc.cap2': 'Intersection vs non-intersection patterns',
    'proj.nyc.cap3': 'Top-20 dangerous streets · hourly pattern',
    'proj.nyc.cap4': '24-hour distribution · weekday vs weekend',
    'proj.nyc.b1t': 'Spatial Modeling: ',
    'proj.nyc.b1d': 'Geo-modeled 2M+ crash records in Kepler.gl; 3D clustering identified high-risk intersections and the "Friday evening rush hour" pattern.',
    'proj.nyc.b2t': 'Business Insight: ',
    'proj.nyc.b2d': 'Quantified driving-behavior vs injury severity in Tableau—motorcycle injury rate 84.2%, with a unique weekday rhythm for heavy trucks.',
    'proj.nyc.b3t': 'Data Storytelling: ',
    'proj.nyc.b3d': 'Edited Kepler.gl + Tableau visuals into a 5-min business-narrative video using Premiere Pro and CapCut.',
    'proj.nyc.b4t': 'Strategic Output: ',
    'proj.nyc.b4d': 'Proposed 4 data-driven recommendations including "Flexible Commuting Systems" and "Time-segmented enforcement".',
    'proj.nyc.link': '▶ Watch the video report',

    'proj.aigc.title': 'AIGC Visualization · ECO-DATA GRID',
    'proj.aigc.sub': 'Environmental monitoring · Gemini-2.5 prompt engineering',
    'proj.aigc.b1t': '3 iterations: ',
    'proj.aigc.b1d': 'From basic theme → interactive interface + sensor logic → streamlined prompts for visual minimalism.',
    'proj.aigc.b2t': 'Final output: ',
    'proj.aigc.b2d': 'A high-logic "ECO-DATA GRID" prototype for environmental data visualization.',

    'proj.air.title': 'Airfare Prediction Model',
    'proj.air.sub': 'R · 3-model comparison · pruned CART wins',
    'proj.air.b1t': 'Modeling & Algorithm Selection: ',
    'proj.air.b1d': 'Performed feature engineering on large-scale travel data; benchmarked Linear Regression, Logistic Regression and CART.',
    'proj.air.b2t': 'Key Result: ',
    'proj.air.b2d': 'The pruned CART model doubled explanatory power and reduced absolute error by 25%+.',
    'proj.air.b3t': 'Price Drivers: ',
    'proj.air.b3d': 'Quantified the impact of airline, cabin class, and route on pricing.',

    'skill.title': 'Skills Matrix',
    'skill.data': 'Data Analytics / Visualization',
    'skill.design': 'Product / Design / Video',
    'skill.lang': 'Languages · Certifications',
    'skill.zh': 'Mandarin', 'skill.en': 'English', 'skill.yue': 'Cantonese',
    'skill.native': 'Native', 'skill.basic': 'Elementary',
    'skill.mos': 'Microsoft MOS Expert (Master)',

    'act.title': 'Activities',
    'act.tag1': 'Volunteer',
    'act.tag2': 'Student Advisor',
    'act.mpf.title': '9th Maritime Silk Road Port Cooperation Forum',
    'act.mpf.desc': 'Translated event signage and port-tour scripts; provided live interpretation for foreign guests and English commentary at Ningbo Beilun Container Terminal No.3.',
    'act.advisor.title': 'HKU Faculty of Arts · Student Academic Advisor',
    'act.advisor.desc': 'Helped freshmen settle in—course selection, student-faculty communication, academic tools, and career exploration—maximizing their use of HKU resources.',

    'ct.title': 'Contact',
    'ct.head': "Let's build something together.",
    'ct.desc': "If you're looking for someone who combines <strong>analytical rigor</strong> with <strong>product thinking</strong>, I'd love to hear from you.",
    'ct.base': 'Ningbo · Hong Kong · Remote OK',
    'ct.resume': 'Download Full CV →',

    'footer.note': 'Hand-crafted with vibe coding · Built with HTML / CSS / JS',
  },
};

/* ---------------- Language switcher ---------------- */
const html = document.documentElement;
const langToggle = document.getElementById('lang-toggle');
const resumeLink = document.getElementById('resume-link');
const resumeLink2 = document.getElementById('resume-link2');

function setLang(lang) {
  html.setAttribute('data-lang', lang);
  html.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (I18N[lang][key] !== undefined) el.innerHTML = I18N[lang][key];
  });
  // 切换简历下载链接
  const path = lang === 'zh' ? 'assets/resume/resume_cn.pdf' : 'assets/resume/resume_en.pdf';
  if (resumeLink) resumeLink.href = path;
  if (resumeLink2) resumeLink2.href = path;
  try { localStorage.setItem('zy_lang', lang); } catch (e) {}
}

langToggle.addEventListener('click', () => {
  const cur = html.getAttribute('data-lang') || 'zh';
  setLang(cur === 'zh' ? 'en' : 'zh');
});

// 初始化语言：用 localStorage 或默认中文
let initLang = 'zh';
try { const s = localStorage.getItem('zy_lang'); if (s === 'zh' || s === 'en') initLang = s; } catch (e) {}
setLang(initLang);

/* ---------------- Nav scroll state ---------------- */
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = ['about', 'education', 'experience', 'projects', 'skills', 'activities', 'contact']
  .map(id => document.getElementById(id)).filter(Boolean);

function onScroll() {
  if (window.scrollY > 30) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');

  // active section
  const y = window.scrollY + 120;
  let activeId = '';
  sections.forEach(sec => { if (sec.offsetTop <= y) activeId = sec.id; });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + activeId);
  });
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------------- Reveal on scroll ---------------- */
const revealEls = document.querySelectorAll(
  '.section-head, .about-photo, .about-text, .edu-card, .exp-card, .proj, .skill-cat, .act-card, .contact-card, .stat'
);
revealEls.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // 触发数字动画
      e.target.querySelectorAll('[data-count]').forEach(animateCount);
      // 触发技能条
      e.target.querySelectorAll('.bar-fill').forEach(bar => bar.classList.add('animate'));
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

revealEls.forEach(el => io.observe(el));

// 单独把技能条父级也观察一下（保险）
document.querySelectorAll('.skill-cat').forEach(c => {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.bar-fill').forEach(b => b.classList.add('animate'));
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  obs.observe(c);
});

/* ---------------- Number counter ---------------- */
function animateCount(el) {
  if (el.dataset.counted) return;
  el.dataset.counted = '1';
  const target = parseFloat(el.getAttribute('data-count'));
  if (!Number.isFinite(target)) return;
  const duration = 1200;
  const start = performance.now();
  const isInt = Number.isInteger(target);
  function tick(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    const v = target * eased;
    el.textContent = isInt ? Math.round(v) : v.toFixed(1);
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = isInt ? target : target;
  }
  requestAnimationFrame(tick);
}

/* ---------------- Particles background ---------------- */
(function () {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles = [], rafId;

  function resize() {
    w = canvas.width = window.innerWidth * window.devicePixelRatio;
    h = canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
  }
  resize();
  window.addEventListener('resize', resize);

  const COUNT = window.innerWidth < 768 ? 35 : 70;
  const COLORS = ['#ff6b35', '#ffb454', '#4ecdc4', '#4d9de0'];
  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4 * window.devicePixelRatio,
      vy: (Math.random() - 0.5) * 0.4 * window.devicePixelRatio,
      r: (Math.random() * 1.6 + 0.4) * window.devicePixelRatio,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
      a: Math.random() * 0.5 + 0.2,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    // links
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        const maxD = 140 * window.devicePixelRatio;
        if (d < maxD) {
          ctx.strokeStyle = `rgba(255,107,53,${(1 - d / maxD) * 0.18})`;
          ctx.lineWidth = 0.6 * window.devicePixelRatio;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
    }
    // dots
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c; ctx.globalAlpha = p.a;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    rafId = requestAnimationFrame(draw);
  }
  draw();

  // 暂停 when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(rafId);
    else draw();
  });
})();
