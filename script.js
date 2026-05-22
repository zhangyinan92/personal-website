/* =========================================================
   张依楠 个人网站 · script.js
   功能：开屏动画 / 语言切换 / AI 模拟 (chip→input→send) / 轮播 / 灯箱 / 手机号 / 滚动出现
   ========================================================= */

(() => {
  'use strict';

  /* ---------- 1. 开屏动画 (Hi → 你好 → 完整句) ---------- */
  const splash = document.getElementById('splash');
  if (splash) {
    // 锁页面避免动画期间滚到别处
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    const phases = splash.querySelectorAll('.splash-text');
    const HOLD = 2000;   // 显示停留 2s
    const HOLD_LAST = 3800; // 第三帧（完整句）停留更久
    const GAP = 600;     // 切换间隙（覆盖 .85s 淡出）
    let i = 0;

    function showPhase(n) {
      phases.forEach(p => {
        const m = p.getAttribute('data-phase');
        const langOk = !p.hasAttribute('data-lang') ||
          p.getAttribute('data-lang') === (document.documentElement.getAttribute('data-lang') === 'en' ? 'en' : 'zh');
        p.classList.toggle('show', m === String(n) && langOk);
      });
    }
    function step() {
      i++;
      if (i > 3) {
        splash.classList.add('fade');
        setTimeout(() => {
          splash.classList.add('done');
          window.scrollTo(0, 0);   // 显式跳到首页顶部
          document.documentElement.style.overflow = '';
          document.body.style.overflow = '';
        }, 650);
        return;
      }
      showPhase(i);
      const hold = (i === 3) ? HOLD_LAST : HOLD;
      setTimeout(() => {
        phases.forEach(p => p.classList.remove('show'));
        setTimeout(step, GAP);
      }, hold);
    }
    step();
  }

  /* ---------- 2. 语言切换 ---------- */
  const langToggle = document.getElementById('langToggle');
  const html = document.documentElement;

  const savedLang = localStorage.getItem('yinan-lang');
  if (savedLang === 'en' || savedLang === 'zh') {
    html.setAttribute('data-lang', savedLang);
    html.setAttribute('lang', savedLang === 'en' ? 'en' : 'zh-CN');
  }

  function getLang() { return html.getAttribute('data-lang') === 'en' ? 'en' : 'zh'; }

  if (langToggle) {
    langToggle.addEventListener('click', () => {
      const cur = getLang() === 'en' ? 'zh' : 'en';
      html.setAttribute('data-lang', cur);
      html.setAttribute('lang', cur === 'en' ? 'en' : 'zh-CN');
      localStorage.setItem('yinan-lang', cur);
      updateAIPlaceholder();
      // 切换语言时同步当前选中 chip 的输入框文本
      syncChipInput();
    });
  }

  /* ---------- 3. 预设答复 (Search 详细版 / Think 简短版 · 中英) ---------- */
  const ANSWERS = {
    edu: {
      qLabel: { zh: '你的教育背景是什么？', en: "What's your education background?" },
      a: {
        think: {
          zh: '我现在在香港大学读大三，双主修了信息系统与分析和中英翻译翻译，平时也很喜欢折腾 AI 工具，像 Cursor、Claude、Codex、Gemini 我都玩过一轮。',
          en: "I'm a junior at the University of Hong Kong, double-majoring in Information Systems & Analytics and CN-EN Translation. I also love tinkering with AI tools — I've played around with Cursor, Claude, Codex, and Gemini."
        },
        search: {
          zh: '我目前是香港大学的大三在读生，读的是信息系统与分析，同时双主修翻译，预计 2027 年毕业。\n\n课程上接触比较多的是商业分析、信息系统、统计与经济数据分析这类内容。\n\n我个人对 AI 也特别感兴趣，Cursor、Claude、Codex、Gemini 这些主流的工具我基本都上手试过，平时也会用它们来辅助学习和做项目。',
          en: "I'm currently a junior at the University of Hong Kong, majoring in Information Systems & Analytics with a double major in Translation, graduating in 2027.\n\nMy coursework centers on Business Analytics, Information Systems, and Statistical & Economic Data Analysis.\n\nI'm also really into AI — I've hands-on tried most mainstream tools like Cursor, Claude, Codex, and Gemini, and I use them daily to support my studies and projects."
        }
      }
    },
    intern: {
      qLabel: { zh: '介绍一下你的实习经历', en: 'Tell me about your internships' },
      a: {
        think: {
          zh: '我做过两段实习，一段是在香港的和记港口集团做产品开发与实施实习生，另一段是在上海安运人通科技做项目经理助理，整体方向都是偏 IT 产品 + 业务流程 这一块。',
          en: "I've done two internships — one as a Product Development & Implementation Intern at Hutchison Port Holdings in Hong Kong, and another as a Project Manager Assistant at Shanghai Anyun Rentong Technology. Both lean toward IT products + business workflows."
        },
        search: {
          zh: '我目前有过两段实习经历，方向都是围绕信息系统、产品开发以及项目管理展开的。\n\n最近的一段是 2025 年暑假在香港的和记港口集团，在信息技术部做产品开发与实施实习生，主要参与了港口核心系统的迭代，写过 API 请求做堆场数据自动更新，也用 Draw.io 画过工作流图帮团队梳理业务。\n\n再往前是 2024 年底到 2025 年初，在上海安运人通科技做项目经理助理，参与了梅北码头智能安防系统的开发，主要负责用 UML 画用例图、类图、序列图做需求分析，也会跟进项目进度和 UX 优化。\n\n两段实习下来，我对港口/智慧物流场景下的产品落地还挺熟悉的。',
          en: "I've had two internships so far, both centered on information systems, product development, and project management.\n\nThe most recent one was Summer 2025 at Hutchison Port Holdings in Hong Kong, where I served as a Product Development & Implementation Intern in the IT department. I joined the iteration of core port systems, wrote API requests to automate yard-data updates, and used Draw.io to map out workflow diagrams that helped the team align on business logic.\n\nBefore that, from late 2024 to early 2025, I was a Project Manager Assistant at Shanghai Anyun Rentong Technology, contributing to the Meibei Terminal Intelligent Security System. My main work was requirements analysis with UML — drawing use case, class, and sequence diagrams — along with progress tracking and UX optimization.\n\nAcross both internships, I've gotten pretty familiar with how products land in port and smart-logistics scenarios."
        }
      }
    },
    activity: {
      qLabel: { zh: '你有什么课外活动吗？', en: 'Any extracurricular activities?' },
      a: {
        think: {
          zh: '我课外主要做过两件事：一个是在海丝港口合作论坛做志愿者，负责中英笔译和口译；另一个是在港大文学院做学生学术顾问，帮大一新生适应大学生活。',
          en: "Two main extracurriculars: one was volunteering at the Maritime Silk Road Port Cooperation Forum doing CN-EN translation and interpretation; the other was being a Student Academic Advisor at HKU's Faculty of Arts, helping freshmen adapt to university life."
        },
        search: {
          zh: '我的课外活动主要有两段比较有代表性的经历。\n\n一段是 2025 年 5 月在宁波参加第九届海丝港口合作论坛做志愿者，负责活动标牌和港口参观稿件的英文笔译，也为外宾提供口译支持，还在集装箱码头的参观环节做了英文讲解。\n\n另一段是我在港大的文学院担任学生学术顾问长达一年，主要是帮大一新生适应大学生活，包括选课、师生沟通、学术工具使用和职业探索这些方面。\n\n整体来说，这两段经历让我在跨文化沟通和沟通能力上都得到了比较好的锻炼。',
          en: "My extracurricular life has two pretty representative experiences.\n\nThe first was May 2025 in Ningbo, volunteering at the 9th Maritime Silk Road Port Cooperation Forum. I handled CN-EN translation for event signage and tour scripts, provided interpretation support for international guests, and gave English on-site briefings during the container-terminal tour.\n\nThe second is a year-long stint as a Student Academic Advisor at HKU's Faculty of Arts, helping freshmen adapt to university life — covering course selection, faculty communication, academic tools, and career exploration.\n\nOverall, these two experiences gave me solid practice in cross-cultural communication and general communication skills."
        }
      }
    },
    project: {
      qLabel: { zh: '你做过什么项目？', en: 'What projects have you done?' },
      a: {
        think: {
          zh: '我做过三个项目，方向都偏数据分析 + AI：一个是用 Gemini 做 AIGC 视觉化创作，一个是用 Kepler.gl 和 Tableau 做纽约交通安全大数据分析，还有一个是用 R 语言做航空票价预测建模。',
          en: "I've done three projects, all leaning toward data analytics + AI: one was AIGC visual creation with Gemini, one was an NYC traffic safety big-data analysis using Kepler.gl and Tableau, and another was an airfare prediction model in R."
        },
        search: {
          zh: '我的项目经历主要围绕数据建模、可视化分析与 AI 应用三个方向展开。\n\n最近的一个项目是 AIGC 视觉化项目。在这个项目中，我基于 Gemini-2.5-flash-image 模型完成了"环境监测与可持续性"主题的视觉创意任务，通过三轮提示词迭代，最终产出了高逻辑性的"ECO-DATA GRID"方案。\n\n另一个项目是纽约市交通安全大数据分析。我和我的组员（一共 5 人）用 Kepler.gl 对 200 多万条事故数据做了 3D 空间聚类，再用 Tableau 分析驾驶行为和事故伤害的关系，最后还用 PR 和剪映剪了一个数据汇报视频，并基于洞察提出了 4 项改进建议。\n\n还有一个是航空票价预测项目，我和我的队友（一共 5 人）用 R 语言做特征工程，搭建了线性回归、逻辑回归和 CART 决策树三种模型横向对比，最后剪枝后的 CART 模型把绝对误差降低了 25% 以上。\n\n整体来看，这三个项目让我在数据建模 → 可视化 → 商业洞察输出这条链路上有了比较完整的实战经验。',
          en: "My project experience spans three directions: data modeling, visualization analysis, and AI applications.\n\nThe most recent one is the AIGC Visualization project. I used the Gemini-2.5-flash-image model on the theme of 'Environmental Monitoring & Sustainability,' iterating prompts across three rounds and ultimately producing the highly logical 'ECO-DATA GRID' solution.\n\nAnother is the NYC Traffic Safety Big Data Analysis. My teammates (5 of us in total) and I used Kepler.gl to 3D-cluster over 2 million accident records, then drilled into the relationship between driving behavior and crash injuries in Tableau, and finally cut a data-narrative video in Premiere Pro and CapCut, delivering 4 data-driven recommendations.\n\nThere's also the Airfare Prediction project — my teammates (5 of us in total) and I did feature engineering in R and benchmarked Linear Regression, Logistic Regression, and CART decision trees side-by-side; the pruned CART model brought absolute error down by 25%+.\n\nOverall, these three projects gave me end-to-end hands-on experience across the data-modeling → visualization → business-insight pipeline."
        }
      }
    },
    strength: {
      qLabel: { zh: '你的核心优势是什么？', en: "What's your core strength?" },
      a: {
        think: {
          zh: '我最大的优势是 "翻译 + 数据科学"双主修背景下的复合能力——既能用 Python、R、SQL、Tableau 做数据建模与可视化，也能用中英双语在跨文化、跨部门场景里做高质量沟通。',
          en: "My biggest strength is the composite capability that comes from a Translation + Data Science double major — I can do data modeling and visualization with Python, R, SQL, and Tableau, and I can also handle high-quality cross-cultural, cross-functional communication in both Chinese and English."
        },
        search: {
          zh: '我的核心优势在于"语言 + 数据 + 产品"三位一体的复合背景。\n\n语言层面，我具备中英双语的专业沟通与翻译能力（雅思 7.0），可以胜任跨文化场景下的笔译、口译和商务沟通；\n\n数据层面，我熟练掌握 Python、R、SQL、Tableau、Kepler.gl 等工具，能完成从数据清洗、建模到可视化叙事的完整链路，并在 AIGC 提示词工程上有实战经验；\n\n产品层面，我在和记港口、安运人通的两段实习中，积累了 B 端信息系统的需求分析、UML 建模、API 调用和工作流梳理的经验。\n\n整体来说，我能在技术、业务和语言之间灵活切换，是团队里那种"能听懂技术、也能讲清业务"的桥梁型选手。',
          en: "My core strength is a 'language + data + product' three-in-one composite background.\n\nOn the language side, I have professional CN-EN bilingual communication and translation skills (IELTS 7.0), and can handle translation, interpretation, and business communication in cross-cultural settings.\n\nOn the data side, I'm proficient with Python, R, SQL, Tableau, Kepler.gl and other tools, capable of running the full pipeline from data cleaning and modeling to visual storytelling, with hands-on experience in AIGC prompt engineering.\n\nOn the product side, my two internships at Hutchison Ports and Anyun Rentong gave me experience with B2B information-system requirements analysis, UML modeling, API integration, and workflow mapping.\n\nOverall, I can switch fluidly across tech, business, and language — the 'understands the engineers, can explain to the business' bridge-type teammate."
        }
      }
    }
  };

  /* ---------- 4. AI 流程：chip→input→send ---------- */
  const aiOutput = document.getElementById('aiOutput');
  const aiInput = document.getElementById('aiInput');
  const aiSend = document.getElementById('aiSend');
  const chips = document.querySelectorAll('.chip');
  const modeSearchBtn = document.getElementById('aiModeSearch');
  const modeThinkBtn = document.getElementById('aiModeThink');
  let isStreaming = false;
  let abortStream = false;
  let selectedKey = null;
  let selectedMode = null; // 'search' | 'think' | null

  function updateAIPlaceholder() {
    if (!aiInput) return;
    aiInput.placeholder = getLang() === 'en'
      ? 'Click a chip above to fill →'
      : '点上方任一关键词填入 →';
  }
  updateAIPlaceholder();

  function refreshSendState() {
    if (!aiSend) return;
    const ready = !!selectedKey && !!selectedMode && !isStreaming;
    aiSend.disabled = !ready;
    aiSend.style.opacity = ready ? '' : '0.4';
    aiSend.style.cursor = ready ? '' : 'not-allowed';
  }

  function syncChipInput() {
    if (!selectedKey || !aiInput) return;
    const data = ANSWERS[selectedKey];
    if (data) aiInput.value = data.qLabel[getLang()];
  }

  // 点击 chip：填到 input，标记 active，不触发回答
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      if (isStreaming) return;
      const key = chip.dataset.q;
      selectedKey = key;
      const data = ANSWERS[key];
      if (data && aiInput) {
        aiInput.value = data.qLabel[getLang()];
      }
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      refreshSendState();
    });
  });

  // 模式切换：Search / Think 互斥
  function setMode(mode) {
    if (isStreaming) return;
    selectedMode = (selectedMode === mode) ? null : mode;
    if (modeSearchBtn) modeSearchBtn.classList.toggle('active', selectedMode === 'search');
    if (modeThinkBtn) modeThinkBtn.classList.toggle('active', selectedMode === 'think');
    refreshSendState();
  }
  if (modeSearchBtn) modeSearchBtn.addEventListener('click', () => setMode('search'));
  if (modeThinkBtn) modeThinkBtn.addEventListener('click', () => setMode('think'));

  refreshSendState();

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  async function streamAnswer(key, mode) {
    if (isStreaming) { abortStream = true; await sleep(50); }
    isStreaming = true; abortStream = false;
    chips.forEach(c => c.disabled = true);
    refreshSendState();

    const lang = getLang();
    const data = ANSWERS[key];
    if (!data || !data.a[mode]) return finishStream();
    const qText = data.qLabel[lang];
    const aText = data.a[mode][lang];

    // 清屏并显示问题
    aiOutput.innerHTML = '';
    const qEl = document.createElement('div');
    qEl.className = 'ai-q';
    qEl.textContent = (lang === 'en' ? 'You asked: ' : '你问:') + ' ' + qText;
    aiOutput.appendChild(qEl);

    // 模式状态条（仅作为视觉提示，不带任何虚构内容）
    const modeBar = document.createElement('div');
    modeBar.className = mode === 'search' ? 'ai-search-block' : 'ai-think-block';
    modeBar.innerHTML = '<div class="' + (mode === 'search' ? 'asb-head' : 'atb-head') + '">'
      + (mode === 'search'
          ? '🔍 ' + (lang === 'en' ? 'Search mode · concise + detailed reply' : 'Search 模式 · 完整详细回答')
          : '💭 ' + (lang === 'en' ? 'Think mode · brief reply' : 'Think 模式 · 简洁回答'))
      + '</div>';
    aiOutput.appendChild(modeBar);
    aiOutput.scrollTop = aiOutput.scrollHeight;
    await sleep(700);
    if (abortStream) return finishStream();

    const aEl = document.createElement('div');
    aEl.className = 'ai-a ai-cursor';
    aiOutput.appendChild(aEl);
    aiOutput.scrollTop = aiOutput.scrollHeight;

    const speed = lang === 'en' ? 12 : 26;
    for (let i = 0; i < aText.length; i++) {
      if (abortStream) break;
      aEl.textContent += aText[i];
      if (i % 6 === 0) aiOutput.scrollTop = aiOutput.scrollHeight;
      const ch = aText[i];
      let delay = speed;
      if (',，.。!！?？:：'.includes(ch)) delay = speed * 5;
      else if (ch === '\n') delay = speed * 3;
      await sleep(delay);
    }
    aiOutput.scrollTop = aiOutput.scrollHeight;
    finishStream();

    function finishStream() {
      const cur = aiOutput.querySelector('.ai-cursor');
      cur?.classList.remove('ai-cursor');
      isStreaming = false;
      chips.forEach(c => c.disabled = false);
      refreshSendState();
    }
  }

  function handleSend() {
    if (!selectedKey || !selectedMode) {
      if (aiInput) {
        const lang = getLang();
        let msg;
        if (!selectedKey && !selectedMode) {
          msg = lang === 'en' ? '⚠ Pick a chip + Search/Think first!' : '⚠ 先选关键词，再点 Search 或 Think！';
        } else if (!selectedKey) {
          msg = lang === 'en' ? '⚠ Pick a chip first!' : '⚠ 先点一个关键词哦！';
        } else {
          msg = lang === 'en' ? '⚠ Choose Search or Think first!' : '⚠ 请先选 Search 或 Think！';
        }
        aiInput.placeholder = msg;
        setTimeout(updateAIPlaceholder, 1800);
      }
      return;
    }
    streamAnswer(selectedKey, selectedMode);
  }
  if (aiSend) aiSend.addEventListener('click', handleSend);
  if (aiInput) aiInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); handleSend(); }
  });

  /* ---------- 5. 轮播 ---------- */
  document.querySelectorAll('[data-carousel]').forEach(carousel => {
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prev = carousel.querySelector('.carousel-prev');
    const next = carousel.querySelector('.carousel-next');
    const cur = carousel.querySelector('.carousel-counter .cur');
    const total = carousel.querySelector('.carousel-counter .total');
    if (!slides.length) return;
    if (total) total.textContent = slides.length;
    let idx = 0;

    function show(i) {
      idx = (i + slides.length) % slides.length;
      slides.forEach((s, n) => s.classList.toggle('active', n === idx));
      if (cur) cur.textContent = idx + 1;
    }
    if (prev) prev.addEventListener('click', e => { e.stopPropagation(); show(idx - 1); });
    if (next) next.addEventListener('click', e => { e.stopPropagation(); show(idx + 1); });
  });

  /* ---------- 6. 手机号点击展开 ---------- */
  const phoneBtn = document.getElementById('phoneReveal');
  const phoneVal = document.getElementById('phoneValue');
  let phoneShown = false;
  const PHONE = ['138', '5826', '8939'].join('');
  if (phoneBtn) {
    phoneBtn.addEventListener('click', () => {
      if (phoneShown) {
        navigator.clipboard?.writeText(PHONE);
        phoneVal.textContent = (getLang() === 'en' ? 'Copied! ✓ ' : '已复制 ✓ ') + PHONE;
        setTimeout(() => { phoneVal.textContent = PHONE; }, 1400);
      } else {
        phoneVal.textContent = PHONE;
        phoneShown = true;
        phoneBtn.title = getLang() === 'en' ? 'Click again to copy' : '再点一下复制';
      }
    });
  }

  /* ---------- 7. 灯箱 ---------- */
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbClose = document.getElementById('lbClose');

  function openLB(src) {
    if (!lb || !lbImg || !src) return;
    lbImg.src = src;
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
  }
  function closeLB() {
    if (!lb) return;
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    setTimeout(() => { if (lbImg) lbImg.src = ''; }, 250);
  }

  // hero 单图
  document.querySelectorAll('.hero-photo img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => openLB(img.src));
  });
  // 卡片单图
  document.querySelectorAll('.card-photo > img, .edu-img, .cert-img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => openLB(img.src));
  });
  // 轮播图：点当前 slide 才放大
  document.querySelectorAll('.carousel-slide').forEach(img => {
    img.addEventListener('click', () => {
      if (img.classList.contains('active')) openLB(img.src);
    });
  });
  if (lbClose) lbClose.addEventListener('click', closeLB);
  if (lb) lb.addEventListener('click', e => { if (e.target === lb) closeLB(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLB(); });

  /* ---------- 8. 滚动渐入 ---------- */
  const revealEls = document.querySelectorAll('.section, .ask-section, .contact-section');
  revealEls.forEach(el => el.classList.add('reveal'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- 9. 平滑锚点 ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const tgt = document.querySelector(id);
      if (!tgt) return;
      e.preventDefault();
      const top = tgt.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---------- 10. Scrollspy：当前 section 高亮 ---------- */
  const navLinks = Array.from(document.querySelectorAll('.nav a[data-nav]'));
  const sections = navLinks
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  function setActive(id) {
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + id);
    });
  }

  if (sections.length && 'IntersectionObserver' in window) {
    const visibility = new Map();
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        visibility.set(en.target.id, en.intersectionRatio);
      });
      // 选可见比例最高的 section
      let best = null, bestRatio = 0;
      sections.forEach(s => {
        const r = visibility.get(s.id) || 0;
        if (r > bestRatio) { bestRatio = r; best = s.id; }
      });
      if (best && bestRatio > 0) setActive(best);
    }, { rootMargin: '-80px 0px -55% 0px', threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] });
    sections.forEach(s => spy.observe(s));
    setActive('hero');
  }

})();
