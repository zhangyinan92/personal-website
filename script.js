/* =========================================================
   张依楠 个人网站 · script.js
   功能：开屏动画 / 语言切换 / AI 模拟 (chip→input→send) / 轮播 / 灯箱 / 手机号 / 滚动出现
   ========================================================= */

(() => {
  'use strict';

  /* ---------- 1. 开屏动画（单页 · 打字机效果 · 不可跳过） ---------- */
  const splash = document.getElementById('splash');
  if (splash) {
    // 锁页面避免动画期间滚到别处
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    const stLines = splash.querySelectorAll('.st-line');
    // 每行由若干段组成，段可带样式（如名字高亮）
    const TYPE_SCRIPT = [
      { el: stLines[0], speed: 210, segs: [{ t: 'Hello，你好 👋' }] },
      { el: stLines[1], speed: 175, segs: [{ t: '我是 ' }, { t: '张依楠', cls: 'st-name' }, { t: '，欢迎来到我的小宇宙' }] },
      { el: stLines[2], speed: 48, segs: [{ t: "Hi, I'm Zhang Yinan — welcome to my little universe." }] }
    ];
    const caret = document.createElement('span');
    caret.className = 'st-caret';

    function splashDone() {
      if (splash.classList.contains('fade')) return;
      caret.remove();
      splash.classList.add('fade');
      setTimeout(() => {
        splash.classList.add('done');
        window.scrollTo(0, 0);   // 显式跳到首页顶部
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
      }, 650);
    }

    (async () => {
      for (const line of TYPE_SCRIPT) {
        if (!line.el) continue;
        // 先把整行所有字符一次性放进 DOM（opacity:0 占位），布局与居中一次定死；
        // 再逐个字符点亮 —— 全程不重排、不重新居中，彻底消除打字卡顿。
        const chars = [];
        for (const seg of line.segs) {
          for (const ch of Array.from(seg.t)) {   // Array.from 保证 emoji 不被拆开
            const c = document.createElement('span');
            c.className = 'st-char' + (seg.cls ? ' ' + seg.cls : '');
            c.textContent = ch;
            line.el.appendChild(c);
            chars.push(c);
          }
        }
        line.el.insertBefore(caret, line.el.firstChild);   // 光标宽度为 0，移动不影响排版
        for (const c of chars) {
          c.classList.add('on');
          line.el.insertBefore(caret, c.nextSibling);
          await sleep(line.speed);
        }
      }
      await sleep(1500);
      splashDone();
    })();
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
          zh: '我现在在香港大学读大三，双主修了信息系统与分析和翻译，平时也很喜欢折腾 AI 工具，像 Claude Code、Gemini、ChatGPT 我都玩过一轮。',
          en: "I'm a junior at the University of Hong Kong, double-majoring in Information Systems & Analytics and Translation. I also love tinkering with AI tools — I've played around with Claude Code, Gemini, and ChatGPT."
        },
        search: {
          zh: '我目前是香港大学的大三在读生，读的是信息系统与分析，同时双主修翻译，预计 2027 年毕业。\n课程上接触比较多的是商业分析、信息系统、统计与经济数据分析这类内容。\n我个人对 AI 也特别感兴趣，Claude Code、Gemini、ChatGPT 这些主流工具我基本都上手试过，平时也会用它们来辅助学习和做项目。',
          en: "I'm currently a junior at the University of Hong Kong, majoring in Information Systems & Analytics with a double major in Translation, graduating in 2027.\nMy coursework centers on Business Analytics, Information Systems, and Statistical & Economic Data Analysis.\nI'm also really into AI — I've hands-on tried mainstream tools like Claude Code, Gemini, and ChatGPT, and I use them to support my studies and projects."
        }
      }
    },
    intern: {
      qLabel: { zh: '介绍一下你的实习经历', en: 'Tell me about your internships' },
      a: {
        think: {
          zh: '我做过两段实习：现在正在南京网眼做 AI 产品经理，主导一个短剧平台上「AI Studio」模块的从 0 到 1；之前在香港的和记港口集团做产品开发与实施，深入过港口的核心信息系统。一段偏 AI 产品，一段偏 B 端信息系统。',
          en: "I've done two internships. Right now I'm an AI Product Manager at Nanjing Wangyan, leading an 'AI Studio' module from 0 to 1 on a short-drama platform. Before that I was a Product Development & Implementation Intern at Hutchison Port Holdings in Hong Kong, digging into core port systems. One leans AI-product, the other B2B information systems."
        },
        search: {
          zh: '我目前有两段实习，一段偏 AI 产品，一段偏 B 端信息系统。\n最近、也是正在进行的一段，是 2026 年 5 月起在南京网眼做 AI 产品经理实习生。我主导了公司「剧多多」短剧平台上全新 AI Studio 模块的端到端设计，从一张白纸开始，独立交付了 3 份高保真 Demo 和 1 份 PRD，还和技术团队一起把 4 类核心「短剧创作 Skill」封装成了工具。现在方案已经进了导演/编剧的灰度测试，通过后会面向全公司上线。\n再往前是 2025 年暑假在香港的和记港口集团，在信息技术部做产品开发与实施实习生：参与了第 91–93 次系统迭代，摸透了 nGen、OMS 这些港口核心系统，写过 API 请求做堆场数据自动更新，也用 Draw.io 画工作流图帮团队梳理业务。\n两段下来，我既练了「从 0 到 1 定义一个 AI 产品」，也学会了「复杂 B 端系统」这一课。',
          en: "I've had two internships — one AI-product, one B2B systems.\nThe most recent (and ongoing) one started in May 2026 as an AI Product Manager Intern at Nanjing Wangyan. I led the end-to-end design of a brand-new AI Studio module on the company's 'Juduoduo' short-drama platform — starting from a blank page, solo-delivering 3 hi-fi demos and a PRD, and working with engineering to package 4 core 'short-drama creation Skills' into tools. It's now in gated testing with directors and screenwriters, and rolls out company-wide once it passes.\nBefore that, Summer 2025 at Hutchison Port Holdings in Hong Kong, I was a Product Development & Implementation Intern in the IT department: I joined Sprints 91–93, got fluent in core port systems like nGen and OMS, wrote API requests to automate yard-data updates, and used Draw.io to map workflows that aligned the team.\nAcross both, I trained the '0-to-1 defining an AI product' muscle and learned the 'complex B2B systems' lesson."
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
          zh: '我的课外活动有两段比较有代表性的经历。\n一段是 2025 年 5 月在宁波参加第九届海丝港口合作论坛做志愿者，负责活动标牌和港口参观稿件的英文笔译，也为外宾提供口译支持，还在宁波北仑第三集装箱码头的参观环节做了英文现场讲解和实时答疑。\n另一段是我在港大文学院担任学生学术顾问长达一年：一对一带教 5 名文学院大一新生，从选课规划、师生沟通到学习方法和生活适应，做他们大一那年的「第一联系人」；还参与港大对外开放项目，独立带着约 30 名香港本地中学生参观校园、讲解学院设置和申请路径。',
          en: "My extracurriculars have two representative experiences.\nThe first was May 2025 in Ningbo, volunteering at the 9th Maritime Silk Road Port Cooperation Forum — CN-EN translation for event signage and tour scripts, interpretation for international guests, plus live English briefings and Q&A during the Beilun No.3 Container Terminal tour.\nThe second is a year-long role as a Student Academic Advisor at HKU's Faculty of Arts: mentoring 5 first-year Arts students one-on-one — course planning, talking to professors, study habits, settling in — as their 'first contact' through freshman year; and, for HKU's outreach program, solo-guiding about 30 local secondary-school students around campus, walking them through faculties and admissions paths."
        }
      }
    },
    project: {
      qLabel: { zh: '你做过什么项目？', en: 'What projects have you done?' },
      a: {
        think: {
          zh: '我最近做了两个项目：一个是已经上线 App Store 和华为应用市场的「去过」旅行记录 App，从产品到代码都是我一个人完成的；另一个是用 Kepler.gl + Tableau 做的纽约交通安全大数据分析。一个偏产品落地，一个偏数据分析。',
          en: "Two recent projects: the 'Been There' travel-log app — now live on the App Store and Huawei AppGallery, built solo from product to code; and an NYC traffic-safety big-data analysis with Kepler.gl + Tableau. One leans product-shipping, the other data analytics."
        },
        search: {
          zh: '我最近的项目一个偏「独立做产品」，一个偏「数据分析」，能看出我不只会分析，也能真的把东西做出来、推上线。\n第一个是「去过」旅行记录 App（2026.06），已经上线 App Store 和华为应用市场。我一个人扛下了产品、UX、前端和原生壳：用 Vite + Tailwind + Leaflet 搭 PWA 内核，Capacitor 跨端封装，再用 Swift / Kotlin 双端原生桥打通触觉反馈和相册保存。它主打「无需定位、手动标记」，还用 11 枚成就印章把探索世界游戏化；上线后 App Store 两天 40 次下载、单日转化率最高 80%，华为首日详情页转化 66.67%，两端卸载率都是 0%。\n第二个是纽约市交通安全大数据分析（2025.11–12）。我和组员用 Kepler.gl 对 200 多万条事故数据做 3D 空间聚类，再用 Tableau 分析驾驶行为与伤害的关系（比如摩托车 84.2% 的高伤害率），最后用 PR + 剪映剪成一支数据叙事视频，并提出了 4 项数据驱动建议。\n这两个项目让我把「想清楚 → 做出来 → 推上线 → 看数据」这条链路完整跑了一遍。',
          en: "My recent projects split between 'shipping a product solo' and 'data analysis' — proof that I don't just analyze, I actually build and ship.\nFirst is the 'Been There' travel-log app (Jun 2026), now live on the App Store and Huawei AppGallery. I carried the product, UX, front-end, and native shell alone: a PWA core with Vite + Tailwind + Leaflet, Capacitor for cross-platform packaging, and Swift / Kotlin native bridges for haptics and photo-library saving. Its hook is 'no GPS needed, mark places by hand,' with 11 achievement stamps gamifying exploration. After launch: 40 downloads in 2 days on the App Store, peak daily conversion 80%, 66.67% first-day page conversion on Huawei, and a 0% uninstall rate on both stores.\nSecond is the NYC Traffic Safety Big Data Analysis (Nov–Dec 2025). My team and I used Kepler.gl to 3D-cluster 2M+ crash records, analyzed the link between driving behavior and injury in Tableau (e.g. an 84.2% motorcycle injury rate), cut it into a data-narrative video with Premiere Pro + CapCut, and delivered 4 data-driven recommendations.\nTogether they ran me through the full loop: think it through → build it → ship it → read the data."
        }
      }
    },
    strength: {
      qLabel: { zh: '你的核心优势是什么？', en: "What's your core strength?" },
      a: {
        think: {
          zh: '我最大的优势是"语言 + 数据 + 产品 + AI"的复合能力：既是翻译与信息分析双主修（雅思 7.0），能做数据建模和跨文化沟通；又能用 AI 工具从 0 到 1 把产品真的做出来、推上线——我已经独立上线过一个 App 和这个网站。',
          en: "My biggest strength is a 'language + data + product + AI' blend: a Translation × Information-Analytics double major (IELTS 7.0) who can do data modeling and cross-cultural communication, and who can also use AI tools to take a product 0-to-1 and actually ship it — I've already solo-launched an app and this website."
        },
        search: {
          zh: '我的核心优势，是"语言 + 数据 + 产品 + AI 落地"的复合背景——最关键的是，我不只会想和会说，我能真的把东西做出来。\n语言上，我是翻译主修、雅思 7.0，能胜任跨文化场景下的笔译、口译和商务沟通；数据上，我熟练用 R、Tableau、Kepler.gl、Excel、Power BI，能跑通从清洗、建模到可视化叙事的完整链路；产品上，我现在在做 AI 产品经理，主导过一个 AI 模块从 0 到 1（PRD、Demo、Skill 封装），之前在和记港口也"补过"B 端信息系统这一课；最能打的一点，是 AI 落地能力：我用 Claude Code 独立做出并上线了「去过」App（App Store + 华为）和这个网站，是那种"自己就能把想法变成上线产品"的人。\n合起来，我是团队里"能听懂技术、能讲清业务、还能自己动手做出来"的那类人。',
          en: "My core strength is a 'language + data + product + AI-execution' composite background — and crucially, I don't just think and talk, I can actually build.\nOn language, I'm a Translation major with IELTS 7.0, at home with translation, interpretation, and business communication across cultures. On data, I'm fluent in R, Tableau, Kepler.gl, Excel and Power BI, able to run the full pipeline from cleaning to modeling to visual storytelling. On product, I'm now an AI Product Manager who drove an AI module from 0 to 1 (PRD, Demo, Skill packaging), after 'catching up on' B2B information systems at Hutchison Ports. My sharpest edge is AI execution: with Claude Code I solo-built and shipped the 'Been There' app (App Store + Huawei) and this website — the kind of person who can turn an idea into a live product herself.\nPut together, I'm the teammate who understands the engineers, can explain to the business, and can also just go build the thing."
        }
      }
    },
    hobby: {
      qLabel: { zh: '工作之外你喜欢做什么？', en: 'What do you do for fun?' },
      a: {
        think: {
          zh: '我的快乐很具体：拼乐高、玩拼豆、看线下脱口秀。手作让我安静下来，脱口秀让我笑出声——再加上旅行，顺手还做了个记录足迹的「去过」App。',
          en: "My joys are very concrete: building LEGO, making fuse-bead art, and live stand-up comedy. Crafting calms me down, comedy makes me laugh out loud — plus travel, which even turned into my 'Been There' app."
        },
        search: {
          zh: '工作之外的我，有三件小事能立刻回血：\n🧱 乐高：最享受跟着说明书一块块搭起来的过程，书桌上就停着一辆我拼的浅蓝色 Vespa，随时准备出发去罗马。\n🧩 拼豆：一颗颗小珠子拼成像素小物，烫平定型的那一刻特别治愈——我最得意的作品是一只举着蜡烛的小布丁。\n🎤 脱口秀：从小剧场开放麦到大剧院专场都爱看，笑着笑着，一周的疲惫就没了。\n另外我也爱旅行——爱到把「想记住去过的每个地方」这件事做成了一个真的 App（去过）。网站结尾的「工作之外的我」板块有照片～',
          en: "Outside of work, three small things recharge me instantly:\n🧱 LEGO — I love following the manual brick by brick; a pale-blue Vespa I built is parked on my desk, ready to ride to Rome.\n🧩 Fuse beads — melting tiny beads into pixel art is pure therapy; my proudest piece is a little pudding holding a candle.\n🎤 Stand-up comedy — from tiny-club open mics to theater specials, a night of laughing wipes out a week's fatigue.\nAnd I love traveling — so much that 'remembering every place I've been' became a real app (Been There). Check the 'Beyond Work' section at the end of this site for photos!"
        }
      }
    }
  };

  /* ---------- 4. AI 流程：chip→input→send ---------- */
  const aiOutput = document.getElementById('aiOutput');
  const aiInput = document.getElementById('aiInput');
  const aiSend = document.getElementById('aiSend');
  const chips = document.querySelectorAll('.chip');
  const depthBtn = document.getElementById('aiDepthBtn');
  const depthMenu = document.getElementById('aiDepthMenu');
  const depthLabel = document.getElementById('aiDepthLabel');
  const depthOpts = depthMenu ? Array.from(depthMenu.querySelectorAll('.ai-depth-opt')) : [];
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

  // 思维链长度：点按钮弹出菜单，选「默认 / 穷究」
  function closeDepthMenu() {
    if (!depthMenu) return;
    depthMenu.hidden = true;
    depthBtn?.setAttribute('aria-expanded', 'false');
  }
  if (depthBtn && depthMenu) {
    depthBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isStreaming) return;
      depthMenu.hidden = !depthMenu.hidden;
      depthBtn.setAttribute('aria-expanded', String(!depthMenu.hidden));
    });
    depthOpts.forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isStreaming) return;
        selectedMode = opt.dataset.mode;
        depthOpts.forEach(o => o.classList.toggle('selected', o === opt));
        // 只替换文字（默认 / 穷究），不带选项里的 emoji —— 保留按钮最前的橙色灯泡
        const nameSpans = opt.querySelectorAll('.ado-name span[data-lang]');
        if (depthLabel && nameSpans.length) {
          depthLabel.innerHTML = '';
          nameSpans.forEach(s => depthLabel.appendChild(s.cloneNode(true)));
        }
        depthBtn.classList.add('has-choice');
        closeDepthMenu();
        refreshSendState();
      });
    });
    document.addEventListener('click', closeDepthMenu);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDepthMenu(); });
  }

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
          ? '🧠 ' + (lang === 'en' ? 'Ultrathink · deepest reasoning, full reply' : '穷究 · 超高强度推理 · 完整详细回答')
          : '💡 ' + (lang === 'en' ? 'Default · brief reply' : '默认 · 简洁回答'))
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
          msg = lang === 'en' ? '⚠ Pick a chip + a thinking depth first!' : '⚠ 先选关键词，再选思维链长度！';
        } else if (!selectedKey) {
          msg = lang === 'en' ? '⚠ Pick a chip first!' : '⚠ 先点一个关键词哦！';
        } else {
          msg = lang === 'en' ? '⚠ Tap 💡 to choose a thinking depth!' : '⚠ 请先点 💡 选择思维链长度！';
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

  /* ---------- 5. 轮播（支持自动播放 + 圆点导航） ---------- */
  document.querySelectorAll('[data-carousel]').forEach(carousel => {
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prev = carousel.querySelector('.carousel-prev');
    const next = carousel.querySelector('.carousel-next');
    const cur = carousel.querySelector('.carousel-counter .cur');
    const total = carousel.querySelector('.carousel-counter .total');
    const dotsWrap = carousel.querySelector('.carousel-dots');
    if (!slides.length) return;
    if (total) total.textContent = slides.length;
    let idx = 0;

    // 生成圆点
    let dots = [];
    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      slides.forEach((_, n) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'slide ' + (n + 1));
        b.addEventListener('click', e => { e.stopPropagation(); show(n); restart(); });
        dotsWrap.appendChild(b);
        dots.push(b);
      });
    }

    function show(i) {
      idx = (i + slides.length) % slides.length;
      slides.forEach((s, n) => s.classList.toggle('active', n === idx));
      dots.forEach((d, n) => d.classList.toggle('active', n === idx));
      if (cur) cur.textContent = idx + 1;
    }
    show(0);

    // 自动播放（data-autoplay="毫秒"），鼠标悬停时暂停
    const interval = parseInt(carousel.getAttribute('data-autoplay') || '0', 10);
    let timer = null;
    function start() { if (interval > 0) timer = setInterval(() => show(idx + 1), interval); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function restart() { stop(); start(); }
    if (interval > 0) {
      start();
      carousel.addEventListener('mouseenter', stop);
      carousel.addEventListener('mouseleave', start);
    }

    if (prev) prev.addEventListener('click', e => { e.stopPropagation(); show(idx - 1); restart(); });
    if (next) next.addEventListener('click', e => { e.stopPropagation(); show(idx + 1); restart(); });
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

  /* ---------- 7. 灯箱（支持多图切换） ---------- */
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  const lbCounter = document.getElementById('lbCounter');
  let lbGroup = [];   // 当前这组照片的 src 列表
  let lbIndex = 0;

  function renderLb() {
    if (!lbGroup.length) return;
    lbIndex = (lbIndex + lbGroup.length) % lbGroup.length;
    lbImg.src = lbGroup[lbIndex];
    const multi = lbGroup.length > 1;
    if (lbPrev) lbPrev.style.display = multi ? '' : 'none';
    if (lbNext) lbNext.style.display = multi ? '' : 'none';
    if (lbCounter) {
      lbCounter.style.display = multi ? '' : 'none';
      lbCounter.textContent = (lbIndex + 1) + ' / ' + lbGroup.length;
    }
  }
  // group: 该组全部 src；index: 当前是第几张
  function openLB(group, index) {
    if (!lb || !lbImg || !group || !group.length) return;
    lbGroup = group; lbIndex = index || 0;
    renderLb();
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
  }
  function closeLB() {
    if (!lb) return;
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    setTimeout(() => { if (lbImg) lbImg.src = ''; }, 250);
  }
  function lbStep(delta) { if (lbGroup.length > 1) { lbIndex += delta; renderLb(); } }

  // 单图（实习/学术顾问/兴趣拼豆乐高等）：点开就是一张
  document.querySelectorAll('.card-photo > img, .edu-img, .cert-img, .hobby-photo > img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => openLB([img.src], 0));
  });
  // 轮播图：点当前 slide 放大，并把同一轮播的全部照片作为一组，可左右切换
  document.querySelectorAll('.carousel-slide').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      if (!img.classList.contains('active')) return;
      const track = img.closest('.carousel-track');
      const slides = track ? [...track.querySelectorAll('.carousel-slide')] : [img];
      openLB(slides.map(s => s.src), slides.indexOf(img));
    });
  });

  if (lbClose) lbClose.addEventListener('click', closeLB);
  if (lbPrev) lbPrev.addEventListener('click', e => { e.stopPropagation(); lbStep(-1); });
  if (lbNext) lbNext.addEventListener('click', e => { e.stopPropagation(); lbStep(1); });
  if (lb) lb.addEventListener('click', e => { if (e.target === lb) closeLB(); });
  document.addEventListener('keydown', e => {
    if (!lb || !lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLB();
    else if (e.key === 'ArrowLeft') lbStep(-1);
    else if (e.key === 'ArrowRight') lbStep(1);
  });

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

  /* ---------- 11. 光标光晕 / 卡片聚光 + 轻微 3D 倾斜 ---------- */
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (finePointer && !reduceMotion) {
    const root = document.documentElement;
    let gx = window.innerWidth / 2, gy = window.innerHeight / 2;
    let tx = gx, ty = gy, raf = null;

    function glowLoop() {
      gx += (tx - gx) * 0.18;
      gy += (ty - gy) * 0.18;
      root.style.setProperty('--cursor-x', gx + 'px');
      root.style.setProperty('--cursor-y', gy + 'px');
      if (Math.abs(tx - gx) > 0.4 || Math.abs(ty - gy) > 0.4) {
        raf = requestAnimationFrame(glowLoop);
      } else {
        raf = null;
      }
    }
    window.addEventListener('mousemove', e => {
      tx = e.clientX; ty = e.clientY;
      if (!document.body.classList.contains('cursor-active')) {
        document.body.classList.add('cursor-active');
      }
      if (!raf) raf = requestAnimationFrame(glowLoop);
    }, { passive: true });
    document.addEventListener('mouseleave', () => document.body.classList.remove('cursor-active'));

    // 卡片：跟随光标的高光坐标 + 轻微 3D 倾斜
    const tiltCards = document.querySelectorAll('.edu-card, .exp-card, .proj-card, .skill-card, .contact-item, .hobby-card');
    tiltCards.forEach(card => {
      let ticking = false;
      card.addEventListener('mousemove', e => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          card.style.setProperty('--mx', (px * 100) + '%');
          card.style.setProperty('--my', (py * 100) + '%');
          const rx = (0.5 - py) * 5;   // 上下最大 ~2.5deg
          const ry = (px - 0.5) * 5;   // 左右最大 ~2.5deg
          card.style.transform =
            `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-4px)`;
          ticking = false;
        });
      }, { passive: true });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

})();
