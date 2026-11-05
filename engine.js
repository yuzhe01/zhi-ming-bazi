(function (root) {
  'use strict';
  const lib = typeof module === 'object' && module.exports ? require('./vendor/lunar.js') : root;
  const { Solar, Lunar, LunarUtil } = lib;
  const GAN = '甲乙丙丁戊己庚辛壬癸';
  const ELEMENTS = ['木', '火', '土', '金', '水'];
  const ELEM = { 甲:'木',乙:'木',丙:'火',丁:'火',戊:'土',己:'土',庚:'金',辛:'金',壬:'水',癸:'水',子:'水',丑:'土',寅:'木',卯:'木',辰:'土',巳:'火',午:'火',未:'土',申:'金',酉:'金',戌:'土',亥:'水' };
  const HIDDEN = {子:['癸'],丑:['己','癸','辛'],寅:['甲','丙','戊'],卯:['乙'],辰:['戊','乙','癸'],巳:['丙','庚','戊'],午:['丁','己'],未:['己','丁','乙'],申:['庚','壬','戊'],酉:['辛'],戌:['戊','辛','丁'],亥:['壬','甲']};
  const FAMILY = {比肩:'同伴',劫财:'同伴',食神:'表达',伤官:'表达',正财:'经营',偏财:'经营',正官:'秩序',七杀:'秩序',正印:'学习',偏印:'学习'};
  const PROFILES = {
    甲:['甲木','如乔木，向上生长','把长期目标拆成可以扎根的日常行动。'],乙:['乙木','如藤萝，柔韧生长','保留灵活，也为自己的需求设定清楚边界。'],丙:['丙火','如日光，明朗开阔','让热情有稳定的节奏，把想法变为持续的行动。'],丁:['丁火','如灯烛，细致有光','给专注留出空间，也让身边的人理解你的期待。'],戊:['戊土','如山岳，厚实沉稳','用可靠积累信任，也给新方法留一点试验空间。'],己:['己土','如田园，涵养万物','照顾事务的同时，也为自己的时间留出余地。'],庚:['庚金','如金石，果断有度','在明确标准之外，为沟通保留温度与弹性。'],辛:['辛金','如珠玉，精细有章','把对细节的敏感用于打磨作品，避免过度苛求。'],壬:['壬水','如江海，流动开阔','为丰富的想法找到航道，一次推进一件要事。'],癸:['癸水','如雨露，细腻通达','把观察转化为表达，让他人知道你的真实需求。']
  };
  const CAREER = {
    同伴:['协作与自主','比肩、劫财在传统十神中用来描述同类关系，可借此反思协作与自主的平衡。','可尝试团队项目、独立负责的小任务，观察自己在合作与自主工作中的真实表现。','合作前约定职责、成果归属和沟通方式。'],
    表达:['创作与输出','食神、伤官对应“我生”的关系，传统上借喻表达、产出和技艺。','可从写作、设计、产品表达或技术作品中选一项，用具体成果检验兴趣。','在表达观点时同时给出证据与可执行方案。'],
    经营:['资源与落实','正财、偏财对应“我克”的关系，传统上借喻资源安排与事务经营。','可尝试项目执行、运营或资源协调类任务，以实际技能与反馈判断方向。','先规划时间与预算，再安排阶段目标；重大财务选择依据现实信息。'],
    秩序:['责任与组织','正官、七杀对应“克我”的关系，传统上借喻规则、责任与约束。','可尝试流程建设、项目管理或质量把关类任务，观察自己对规则与压力的适应。','把责任边界说清楚，定期复盘负担是否合理。'],
    学习:['理解与积累','正印、偏印对应“生我”的关系，传统上借喻学习、支持与知识积累。','可尝试研究、分析、教学或文档整理类任务，用小型实践验证所学。','为学习设置输出期限，避免只准备、迟迟不行动。']
  };
  function shiShen(day, target) {
    const d = GAN.indexOf(day), t = GAN.indexOf(target);
    const rel = (ELEMENTS.indexOf(ELEM[target]) - ELEMENTS.indexOf(ELEM[day]) + 5) % 5;
    return [['比肩','劫财'],['食神','伤官'],['偏财','正财'],['七杀','正官'],['偏印','正印']][rel][d % 2 === t % 2 ? 0 : 1];
  }
  function clock(s) { return Date.UTC(s.getYear(),s.getMonth()-1,s.getDay(),s.getHour(),s.getMinute(),s.getSecond()); }
  function fromClock(t) { const d = new Date(t); return Solar.fromYmdHms(d.getUTCFullYear(),d.getUTCMonth()+1,d.getUTCDate(),d.getUTCHours(),d.getUTCMinutes(),d.getUTCSeconds()); }
  function calculate(input, options={}) {
    const x = {...input};
    const year = Number(x.year), month = Number(x.month), day = Number(x.day);
    if (![year,month,day].every(Number.isInteger) || year < 1901 || year > 2099 || month < 1 || month > 12 || day < 1 || day > 31) throw Error('请输入 1901–2099 年内的有效出生日期。');
    const unknown = !!x.unknown;
    const time = /^(\d{2}):(\d{2})$/.exec(x.time || '');
    if (!unknown && (!time || +time[1] > 23 || +time[2] > 59)) throw Error('请输入有效的出生时间。');
    const h = unknown ? 12 : +time[1], m = unknown ? 0 : +time[2];
    let solar;
    if (x.calendar === 'lunar') {
      try {
        const l = Lunar.fromYmdHms(year, x.leap ? -month : month, day, h, m, 0);
        solar = l.getSolar();
        const check = solar.getLunar();
        if (check.getYear() !== year || check.getMonth() !== (x.leap ? -month : month) || check.getDay() !== day) throw Error();
      } catch { throw Error('该农历日期不存在，请核对月份、日期及闰月选项。'); }
    } else {
      const check = new Date(Date.UTC(year,month-1,day));
      if (check.getUTCMonth()+1 !== month || check.getUTCDate() !== day) throw Error('该公历日期不存在，请检查天数。');
      solar = Solar.fromYmdHms(year,month,day,h,m,0);
    }
    const original = solar.toYmdHms();
    if (x.dst && !unknown) solar = fromClock(clock(solar)-3600000);
    const lunar = solar.getLunar();
    const base = lunar.getEightChar();
    let corrected = solar, correction = 0;
    if (x.trueSolar && !unknown) {
      const longitude = Number(x.longitude);
      if (x.longitude === '' || !Number.isFinite(longitude) || longitude < 73 || longitude > 135) throw Error('请输入 73°–135°E 的出生地经度。首版支持中国及周边 UTC+8 地区。');
      const n = Math.floor((Date.UTC(solar.getYear(),solar.getMonth()-1,solar.getDay())-Date.UTC(solar.getYear(),0,0))/86400000);
      const b = 2*Math.PI*(n-81)/364;
      correction = 4*(longitude-120) + 9.87*Math.sin(2*b)-7.53*Math.cos(b)-1.5*Math.sin(b);
      corrected = fromClock(clock(solar) + Math.round(correction*60)*1000);
    }
    const ec = corrected.getLunar().getEightChar();
    ec.setSect(Number(x.sect) === 1 ? 1 : 2);
    const dayGan = ec.getDayGan();
    const gzs = [base.getYear(), base.getMonth(), ec.getDay(), unknown ? null : ec.getTime()];
    const pillars = gzs.map((gz,i)=>gz ? ({label:['年柱','月柱','日柱','时柱'][i],gz,gan:gz[0],zhi:gz[1],elements:[ELEM[gz[0]],ELEM[gz[1]]],god:i===2?'日主':shiShen(dayGan,gz[0]),hidden:HIDDEN[gz[1]].map(g=>({gan:g,element:ELEM[g],god:shiShen(dayGan,g)})),nayin:LunarUtil.NAYIN[gz]}) : {label:'时柱',gz:null});
    const counts = Object.fromEntries(ELEMENTS.map(e=>[e,0]));
    pillars.forEach(p=>p.elements?.forEach(e=>counts[e]++));
    const ranked = ELEMENTS.slice().sort((a,b)=>counts[b]-counts[a]);
    const visibleGods = pillars.flatMap((p,i)=>p.gz ? [...(i===2?[]:[shiShen(dayGan,p.gan)]),shiShen(dayGan,HIDDEN[p.zhi][0])] : []);
    const familyCounts = Object.fromEntries(Object.keys(CAREER).map(f=>[f,visibleGods.filter(g=>FAMILY[g]===f).length]));
    const monthGod = shiShen(dayGan,HIDDEN[pillars[1].zhi][0]);
    const family = Object.keys(CAREER).sort((a,b)=>familyCounts[b]-familyCounts[a] || (a===FAMILY[monthGod]?-1:b===FAMILY[monthGod]?1:0))[0];
    const relations = [];
    const clashes=['子午','丑未','寅申','卯酉','辰戌','巳亥'];
    const harmonies=['子丑','寅亥','卯戌','辰酉','巳申','午未'];
    for(let i=0;i<4;i++) for(let j=i+1;j<4;j++) {
      if (!pillars[i].gz || !pillars[j].gz) continue;
      const a = pillars[i].zhi,b = pillars[j].zhi;
      const match = list=>list.some(p=>p===a+b||p===b+a);
      if(match(clashes)||match(harmonies)) relations.push({pair:a+b,kind:match(clashes)?'相冲':'六合',positions:`${pillars[i].label}与${pillars[j].label}`});
    }
    const warnings = [];
    const near = [lunar.getPrevJie(),lunar.getNextJie()].filter(j=>Math.abs(clock(j.getSolar())-clock(solar))<86400000);
    if(near.length) warnings.push('出生日期接近节气交接：'+near.map(j=>`${j.getName()} ${j.getSolar().toYmdHms()}（UTC+8）`).join('；')+'。年、月柱按交节瞬间计算；若出生时间不准确，结果可能变化。');
    if(unknown) warnings.push('时辰未知：不排时柱、不计算大运。年、月柱暂以当日 12:00 排定，交节日可能不确定；日柱亦不能涵盖夜子时的所有可能。');
    if(x.trueSolar&&!unknown) warnings.push(`近似真太阳时修正 ${correction>=0?'+':''}${correction.toFixed(1)} 分钟（经度差＋近似均时差）。年、月柱仍按原 UTC+8 交节时刻；修正仅用于日、时柱。临界时辰请用专业星历复核。`);
    if(x.dst&&!unknown) warnings.push('已将输入的夏令钟表时间减去 1 小时；本网站不自动判定历史夏令时。');
    let luck = null;
    if(!unknown && (x.gender==='male'||x.gender==='female')) {
      const yun = base.getYun(x.gender==='male'?1:0,2);
      luck={forward:yun.isForward(),start:yun.getStartSolar().toYmd(),age:`${yun.getStartYear()}年${yun.getStartMonth()}个月${yun.getStartDay()}天`,periods:yun.getDaYun(9).slice(1).map((d,i)=>({gz:d.getGanZhi(),startYear:d.getStartYear(),endYear:d.getEndYear(),age:d.getStartAge(),startDate:yun.getStartSolar().nextYear(i*10).toYmd(),endDate:yun.getStartSolar().nextYear((i+1)*10).toYmd()}))};
    }
    const total = unknown?6:8;
    const profile = PROFILES[dayGan];
    const career = CAREER[family];
    const dayRelation=relations.filter(r=>r.positions.includes('日柱'));
    const chart = {input:x,original,civil:solar.toYmdHms(),corrected:corrected.toYmdHms(),lunar:`${lunar.getYearInChinese()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,pillars,dayGan,dayElement:ELEM[dayGan],profile,counts,total,ranked,family,familyCounts,monthGod,relations,warnings,luck,
      readings:{
        overview:{title:profile[1],lead:`以日干「${dayGan}」为日主，属${ELEM[dayGan]}。${profile[2]}`,basis:`月支为${pillars[1].zhi}，本气藏干${HIDDEN[pillars[1].zhi][0]}，相对日主为${monthGod}；明面${total}字中${ranked.filter(e=>counts[e]===counts[ranked[0]]).join('、')}出现较多。`,paragraphs:[`图表统计天干与地支的五行归属，各字计 1 次，共 ${total} 次；藏干另列。它呈现构成，不代表五行的实际力量，也不能据此直接判定身强身弱、格局或喜用神。`,`《子平真诠》强调月令，《滴天髓》强调配合与气势。本版采用可解释的基础规则，未建立完整的旺衰、制化与调候模型，因此不作富贵层级、人生事件或确定吉凶的推断。`],action:'把解读当作一面文化的镜子，用真实经历判断哪些描述对自己有帮助。',source:'ziping'},
        career:{title:career[0],lead:career[1],basis:`可见天干（除日主）与各支本气合计 ${visibleGods.length} 项中，「${family}」类出现 ${familyCounts[family]} 次；月令本气为${monthGod}。这是简化的题材选择规则，不是职业适配测评。`,paragraphs:[career[2],'传统十神是干支生克关系的名称，不等同于能力、学历或职业成就。专业选择与就业决策仍要结合兴趣、经验、市场和实际条件。'],action:career[3],source:'ditian'},
        love:{title:dayRelation.some(r=>r.kind==='相冲')?'在差异中练习沟通':dayRelation.some(r=>r.kind==='六合')?'亲近，也保留彼此空间':'关系在理解中慢慢生长',lead:`日支为「${pillars[2].zhi}」，传统上常被称作配偶宫。本页只借用这一关系视角，讨论相处方式。`,basis:dayRelation.length?dayRelation.map(r=>`${r.positions}${r.pair}${r.kind}`).join('；')+'。仅列地支六合与六冲，不判定合化或吉凶。':'日支与已知其他地支之间，未见本规则表内的六合或六冲；这不代表婚姻顺逆。',paragraphs:[dayRelation.some(r=>r.kind==='相冲')?'把“冲”的意象理解为差异提醒：可以讨论双方在金钱、家庭分工与生活节奏上的不同，而不是把冲解释成分离的预言。':'把关系的稳定建立在具体沟通上：表达自己的需要，也听见对方的边界，不用命盘替代了解。','不据命盘判断伴侣性格、忠诚度或生育情况，不预测结婚、分手年份，也不使用“克夫”“克妻”等标签。'],action:'找一个轻松的时段，各说出一件希望对方理解的事，再一起约定一个小行动。',source:'ditian'},
        health:{title:'知节律，养日常',lead:'八字不能判断身体状况。这里把传统五行作为生活意象，提供温和的自我照顾提示。',basis:`日主属${ELEM[dayGan]}，仅用于文化意象展示；五行数量与疾病、器官功能或寿命没有可用于本网站诊断的对应关系。`,paragraphs:['给自己留出稳定的睡眠、用餐和休息时间，在身体允许的范围内保持日常活动。观察真实的疲劳与不适，而不是对照命盘寻找症状。','本页不提供疾病预测、诊断、用药、治疗或寿命推断。如果有持续或明显不适，请依据症状寻求正规医疗帮助。'],action:'选一件可以持续的小事：规律休息、适度活动，或给紧张的日程留出空隙。',source:'method'}
      }
    };
    const detail=typeof module==='object'&&module.exports?require('./analysis.js'):root.ZhiMingAnalysis;
    return detail.enrich(chart,{shiShen,ELEM,ELEMENTS,Solar,HIDDEN},options);
  }
  const api={calculate,shiShen,ELEM,ELEMENTS};
  if(typeof module==='object'&&module.exports) module.exports=api; else root.ZhiMing=api;
})(typeof globalThis!=='undefined'?globalThis:this);
