(function(root){
  'use strict';
  const GODS={
    比肩:{group:'同伴',meaning:'与日主同五行、同阴阳，传统上对应自主、同伴和自我标准。',strength:'能独立推进、坚持原则，与同专业的人互相促进。',risk:'容易把共同任务变成各自坚持，边界模糊时出现重复投入。',work:'技术负责人、独立项目、专业服务、团队协作',task:'为一个合作项目写清负责人、交付物和决定权。'},
    劫财:{group:'同伴',meaning:'与日主同五行、异阴阳，传统上对应竞争、合作和资源分配。',strength:'敢于争取机会、组建伙伴关系，在互动中形成动力。',risk:'人情与资源混在一起，口头承诺容易超过实际可承担范围。',work:'商务拓展、团队组织、协作型项目、活动运营',task:'把合作中的出资、分工、分成与退出条件写下来。'},
    食神:{group:'表达',meaning:'日主所生、同阴阳，传统上对应稳定产出、技艺和表达。',strength:'把知识变成容易理解、可以反复交付的作品。',risk:'打磨过程较长，可能满足于舒适节奏而忽略交付时间。',work:'内容创作、课程设计、产品体验、工艺与技术交付',task:'用一周完成一份作品，向三位真实使用者收集反馈。'},
    伤官:{group:'表达',meaning:'日主所生、异阴阳，传统上对应提出新方法、批评和突破。',strength:'发现旧流程的缺口，提出有差异的方案。',risk:'容易把对方案的批评说成对人的评价，与规章或权责产生摩擦。',work:'设计、研发、产品创新、咨询、问题诊断',task:'提出改进时同时附上数据、试验范围与验收标准。'},
    偏财:{group:'经营',meaning:'日主所克、同阴阳，传统上对应流动资源、外部机会和经营。',strength:'看见需求，组织信息、渠道与人力，让机会形成项目。',risk:'项目太多而分散，尚未验证需求就先承诺成本。',work:'项目经营、渠道、商务合作、市场与资源协调',task:'为一个新项目先做低成本需求验证，记录成本与交付周期。'},
    正财:{group:'经营',meaning:'日主所克、异阴阳，传统上对应持续经营、账目和稳定成果。',strength:'把投入产出算清楚，维护稳定流程与交付。',risk:'过度重视短期可见成果，给探索与学习的空间不足。',work:'运营、预算管理、供应链、客户维护、项目执行',task:'为现有工作列出投入、成果与重复性消耗，找一个可优化环节。'},
    七杀:{group:'秩序',meaning:'克日主、同阴阳，传统上对应强约束、挑战和责任压力。',strength:'在任务明确、期限清楚的情境中解决难题。',risk:'把长期高压误认为必须承担，习惯用硬撑代替协商资源。',work:'复杂项目、应急协调、风险控制、竞争性任务',task:'对一个高压任务写明期限、资源缺口和升级求助条件。'},
    正官:{group:'秩序',meaning:'克日主、异阴阳，传统上对应规则、职责和组织认可。',strength:'尊重标准、愿意承担责任，适合持续建立可信的工作记录。',risk:'评价标准不清时过度迎合，难以拒绝职责外的任务。',work:'质量管理、流程建设、合规事务、项目管理、组织协调',task:'向负责人确认三项主要评价标准，并明确不属于本岗位的事项。'},
    偏印:{group:'学习',meaning:'生日主、同阴阳，传统上对应独特知识、观察和非标准学习。',strength:'从不同材料中找到联系，适合研究与跨领域理解。',risk:'准备很多但不对外验证，容易停在自己的解释体系中。',work:'研究、策略分析、工具开发、资料整合、专业咨询',task:'把一个研究结论做成可演示的样品，让实际使用来检验。'},
    正印:{group:'学习',meaning:'生日主、异阴阳，传统上对应系统学习、规范知识和支持。',strength:'重视理解与积累，能整理知识、教会他人、建立方法。',risk:'依赖完整准备与明确支持，面对不确定任务迟迟不开始。',work:'教学培训、知识管理、研究辅助、标准文档、专业服务',task:'把正在学的内容写成一页操作说明，并用一次实际任务验证。'}
  };
  const RELS={六合:['子丑','寅亥','卯戌','辰酉','巳申','午未'],六冲:['子午','丑未','寅申','卯酉','辰戌','巳亥'],六害:['子未','丑午','寅巳','卯辰','申亥','酉戌'],六破:['子酉','丑辰','寅亥','卯午','巳申','未戌']};
  const STEMS=['甲己','乙庚','丙辛','丁壬','戊癸'];
  const TRIPLES={三合:['申子辰','亥卯未','寅午戌','巳酉丑'],三会:['寅卯辰','巳午未','申酉戌','亥子丑']};
  const GLOSSARY=[['日主','日柱的天干，是解释其他干支关系时的参照点。不是生肖，也不是年柱纳音。'],['月令','出生时所在节令的月支，例如午月从芒种交节起算。月支本气是一个起点，不能代替全月司令与整体格局。'],['通根','某个天干的五行，在地支藏干中也能找到。同一天干称同干根，同五行不同干称同类根；这里仅列位置，不人为加权。'],['透干','地支藏着的天干也出现在四柱天干上。先列明确位置，再讨论是否有根、有制化。'],['十神','其他天干相对日主的生克与阴阳名称。“财、官、杀”等是术数符号，不是现实财富或官职。'],['身强身弱','传统上综合月令、根气、生扶、克泄、合化后讨论的承载关系，不指身体好坏。本站列证据与条件趋势，不给伪精确分数。'],['调候','传统上讨论寒暖燥湿的角度，与五行数量平衡不同。冬月谈温暖、夏月谈润燥是文化取象，不能用来诊病。'],['大运与流年','大运约十年一段；流年以立春为界。报告展示新增干支与原局的关系，关系出现不代表某件事一定发生。']];
  function enrich(c,api,options={}){
    const {shiShen,ELEM,ELEMENTS,Solar}=api, p=c.pillars.filter(p=>p.gz), d=c.dayGan, di=ELEMENTS.indexOf(c.dayElement);
    const elementAt=offset=>ELEMENTS[(di+offset)%5];
    const roles={self:elementAt(0),output:elementAt(1),wealth:elementAt(2),officer:elementAt(3),resource:elementAt(4)};
    const visible=p.flatMap((p,i)=>p.label==='日柱'?[]:[{god:shiShen(d,p.gan),gan:p.gan,where:p.label+'天干',visible:true}]);
    const hidden=p.flatMap(p=>p.hidden.map((h,i)=>({god:h.god,gan:h.gan,where:p.label+'藏干'+(i===0?'本气':''),visible:false})));
    const all=[...visible,...hidden];
    const locate=g=>all.filter(a=>a.god===g).map(a=>`${a.where}${a.gan}`).join('、');
    const present=g=>all.some(a=>a.god===g);
    const roots=p.map(p=>({pillar:p.label,zhi:p.zhi,items:p.hidden.filter(h=>h.element===c.dayElement)})).filter(r=>r.items.length);
    const support=visible.filter(a=>['比肩','劫财','正印','偏印'].includes(a.god));
    const drain=visible.filter(a=>!['比肩','劫财','正印','偏印'].includes(a.god));
    const month=c.pillars[1], me=month.hidden[0].element;
    const monthRelation=me===roles.self?'同类得令线索':me===roles.resource?'月令生扶线索':me===roles.output?'月令泄秀线索':me===roles.wealth?'月令经营耗身线索':'月令约束日主线索';
    const monthPlain=me===roles.self?`月支本气属${me}，与日主同类；季节背景支持同类。`:me===roles.resource?`月支本气属${me}，在五行关系中生${c.dayElement}；传统上属于外部支持。`:me===roles.output?`月支本气属${me}，由日主${c.dayElement}所生；传统上视为把自身投入转成产出。`:me===roles.wealth?`月支本气属${me}，由日主${c.dayElement}所克；传统上视为处理资源、付出承载。`:`月支本气属${me}，克日主${c.dayElement}；传统上视为职责、规则与约束。`;
    const supportLabel=roots.length>=2&&support.length>=1&&[roles.self,roles.resource].includes(me)?'生扶与根气线索较集中':roots.length===0&&![roles.self,roles.resource].includes(me)?'根气线索较少，先看承载条件':'生扶与克泄并见，需要结合条件';
    const transmissions=month.hidden.map(h=>({gan:h.gan,god:h.god,places:p.filter(p=>p.gan===h.gan).map(p=>p.label)}));
    const relationList=[];
    for(let i=0;i<p.length;i++)for(let j=i+1;j<p.length;j++){
      for(const [kind,pairs] of Object.entries(RELS))if(pairs.some(v=>v===p[i].zhi+p[j].zhi||v===p[j].zhi+p[i].zhi))relationList.push({kind,pair:p[i].zhi+p[j].zhi,positions:[p[i].label,p[j].label],text:`${p[i].label}${p[i].zhi}与${p[j].label}${p[j].zhi}：${kind}`});
      if(STEMS.some(v=>v===p[i].gan+p[j].gan||v===p[j].gan+p[i].gan))relationList.push({kind:'天干五合',pair:p[i].gan+p[j].gan,positions:[p[i].label,p[j].label],text:`${p[i].label}${p[i].gan}与${p[j].label}${p[j].gan}：天干五合`});
    }
    for(const [kind,sets] of Object.entries(TRIPLES))for(const set of sets)if([...set].every(z=>p.some(p=>p.zhi===z)))relationList.push({kind,pair:set,positions:p.filter(p=>set.includes(p.zhi)).map(p=>p.label),text:`${set}三字齐见：${kind}齐字线索`});
    const monthTitle=['比肩','劫财'].includes(c.monthGod)?'月令为比劫类，先讨论同类承载':`月令本气为${c.monthGod}，作为格局观察的入口`;
    const signals=[];
    const signal=(condition,title,evidence,plain,limit)=>{if(condition)signals.push({title,evidence,plain,limit});};
    signal(present('食神')&&(present('正财')||present('偏财')),'食神与财的生承线索',`食神：${locate('食神')}；财：${[locate('正财'),locate('偏财')].filter(Boolean).join('、')}`,`日主生${roles.output}，${roles.output}再生${roles.wealth}，可以读成“技能输出—可交付成果—资源回报”的链条。`,'同时出现不等于食神生财格成立；还需核对月令、根气、透藏、偏印及官杀的制化。');
    signal((present('正官')||present('七杀'))&&(present('正印')||present('偏印')),'官杀与印的承接线索',`官杀：${[locate('正官'),locate('七杀')].filter(Boolean).join('、')}；印：${[locate('正印'),locate('偏印')].filter(Boolean).join('、')}`,`${roles.officer}生${roles.resource}，${roles.resource}生日主。传统上可讨论“职责推动学习、学习支持履责”的关系。`,'不能仅凭同现就定官印相生格或杀印相生格；须检验双方是否有力、是否受制。');
    signal(present('伤官')&&present('正官'),'表达与规则同时出现',`伤官：${locate('伤官')}；正官：${locate('正官')}`,`伤官属${roles.output}，正官属${roles.officer}；两者存在相克关系。现代可用来反思创新与组织规范的协调。`,'不自动判“伤官见官必凶”；印的约束、财的通关和调候语境均可能改变传统解读。');
    signal(present('偏印')&&present('食神'),'研究与产出的协调',`偏印：${locate('偏印')}；食神：${locate('食神')}`,`印属${roles.resource}、食神属${roles.output}，两者存在相克关系，可反思准备是否压过实际交付。`,'不能直接断偏印夺食；需要位置、旺衰与其他干支共同参与。');
    const season='亥子丑'.includes(month.zhi)?'winter':'巳午未'.includes(month.zhi)?'summer':'寅卯辰'.includes(month.zhi)?'spring':'autumn';
    const seasonal={winter:{title:'冬令：传统分析先关心寒暖',text:`${month.zhi}月属于冬季范围，传统调候常先看火的温暖作用。火在原局的位置：${all.filter(a=>ELEM[a.gan]==='火').map(a=>a.where+a.gan).join('、')||'已知干支的天干、藏干中未见'}。这与“缺火就一定补火”不同，还要核对日干、节令深浅与全局。`,life:'气候寒冷时按实际天气保暖，保持室内舒适；是否需要调整活动量以身体反馈为准。'},summer:{title:'夏令：传统分析会讨论燥热与润泽',text:`${month.zhi}月属于夏季范围，传统调候常讨论水的润泽作用。水在原局的位置：${all.filter(a=>ELEM[a.gan]==='水').map(a=>a.where+a.gan).join('、')||'已知干支的天干、藏干中未见'}。未月兼有季土属性，不能把整个夏月视作同一种结构。`,life:'炎热天气减少暴晒与长时间闷热环境，活动与休息按实际气温和身体感受调整。'},spring:{title:'春令：先看生发与承接',text:`${month.zhi}月属于春季范围。传统取象关注生发是否有承接，辰月还包含季土转折。本站会同时列根气、透干与输出条件，不将春生直接视为旺相。`,life:'将新计划拆成一周能完成的小任务，为逐渐增加的活动留出休息。'},autumn:{title:'秋令：先看收敛与燥湿',text:`${month.zhi}月属于秋季范围。传统取象关注收敛与燥湿，戌月兼有季土属性。是否需要某一五行必须回到具体日干与全局，不按季节一刀切。`,life:'按真实天气与室内干燥程度调整生活环境，规律安排活动和休息。'}}[season];
    const b=(title,evidence,text,action)=>({title,evidence,text,action});
    const section=(title,lead,blocks,source='ziping')=>({title,lead,basis:blocks[0]?.evidence||'',paragraphs:blocks.map(v=>v.text),action:blocks.find(v=>v.action)?.action||'结合真实经历复盘。',blocks,source});
    const overview=[
      b('先读懂这张盘',`四柱：${c.pillars.map(p=>`${p.label}${p.gz||'未知'}`).join(' · ')}；日主${d}${c.dayElement}。`,`八字的分析参照是日干${d}，所以${c.profile[1]}只是日干的传统意象。年、月、日、时分别提供不同位置的信息，不能只看一个字就给整个人定性。下文逐一说明月令、根气、透干与十神的证据。`),
      b('一、季节背景给了什么条件',`月支${month.zhi}，本气${month.hidden[0].gan}${me}，相对日主为${c.monthGod}。`,`${monthPlain} 本页将其称为“${monthRelation}”。得令是判断的一条证据，不等于已经确定身强、身弱；辰戌丑未月尤其还需考虑季节交替。`),
      b('二、日主在地支有没有根',roots.length?roots.map(r=>`${r.pillar}${r.zhi}藏${r.items.map(h=>h.gan+h.element).join('、')}`).join('；'):'已知地支藏干中没有与日主同五行的天干。',`在已知${p.length}个地支中，找到${roots.length}处同五行根气线索。${roots.some(r=>r.items.some(h=>h.gan===d))?'其中存在与日干相同的藏干，可进一步核查同干根。':'没有直接同干根时，应区别同类根与完全同干的情况。'} 根在本气还是中余气、是否受冲合，都影响传统解释；这里不把每个藏干简单算作同等力量。`),
      b('三、外显的支持与消耗',`生扶天干：${support.map(a=>a.where+a.gan+'（'+a.god+'）').join('、')||'未见'}；克泄耗天干：${drain.map(a=>a.where+a.gan+'（'+a.god+'）').join('、')||'未见'}。`,`除日干外的天干中，印比代表生扶或同类，食伤财官代表输出、经营或约束。当前可归纳为“${supportLabel}”。这是条件观察，不是力度评分；位置、月令、根气与制化仍然需要一起看。`),
      b('四、月令藏干有没有透出来',transmissions.map(t=>`${t.gan}（${t.god}）：${t.places.length?'透于'+t.places.join('、'):'未透于天干'}`).join('；'),`${monthTitle}。所谓透干，就是月支藏着的字也出现在天干上；只列确实出现的位置。正格是否成立还涉及用神是否受伤、相神是否配合等条件，因此不直接用一个月令名称断定成格与层次。`),
      b('五、寒暖燥湿要另看',`出生月支${month.zhi}；${seasonal.title}。`,seasonal.text),
      ...signals.map(s=>b(s.title,s.evidence,`${s.plain} ${s.limit}`)),
      b('六、合冲关系落在什么位置',relationList.map(r=>r.text).join('；')||'本规则表未检出六合、六冲、六害、六破、五合或齐字三合三会。',relationList.length?`共列出${relationList.length}条位置关系。同一对地支可能同时具有合与破等名称，应保留并读，不能机械相互抵消。合不自动成化，冲也不自动代表坏事；若涉及月支或日支，后文在事业与关系模块说明其象征含义。`:'未列出这些关系，只表示当前规则表没有命中；不表示人生没有变化。刑的流派分歧较多，本版没有将其纳入自动判断。')
    ];
    const tuning={甲午:{focus:['癸','丁','庚'],text:'《穷通宝鉴》讨论甲木午月时，先看癸水润泽，并结合丁、庚与全局条件。这里先核对原局是否出现这些字、位于天干还是藏干，不能仅凭缺字推出固定补救。'},甲子:{focus:['丁','庚','丙'],text:'《穷通宝鉴》讨论甲木子月时，谈丁、庚及丙的配合。这个条目说明：即使金克木，也不能直接把庚金列为一概不利，需看寒暖与结构需求。'},庚午:{focus:['壬','癸','戊','己'],text:'《穷通宝鉴》讨论庚金午月时，重视壬水的作用，癸次之，还要看土对水的影响。先检视壬癸是否出现、有没有根与承接，不能把“夏生庚金”直接判为必定喜水。'},癸午:{focus:['庚','辛','壬','癸'],text:'《穷通宝鉴》对癸水午月还会看庚辛生扶以及壬癸协助。重点是支持与承载的组合，不能简化成五行个数里水少就去补水。'}}[d+month.zhi];
    overview.splice(5,0,b('本日干与月令的调候查阅',tuning?tuning.focus.map(g=>`${g}：${[...(d===g?['日干'+g]:[]),...all.filter(a=>a.gan===g).map(a=>a.where+g)].join('、')||'未见'}`).join('；'):`${d}${month.zhi}：本版尚未核验到这一日干月令的独立细则。`,tuning?tuning.text:'当前只展示季节层面的寒暖意象，没有为这一组合补造用神结论。完整调候还需查该日干与节气月的原文，并结合其他三柱。'));
    const keyGods=[c.monthGod,...visible.map(a=>a.god),...hidden.map(a=>a.god)].filter((v,i,a)=>a.indexOf(v)===i);
    const workBlocks=keyGods.slice(0,5).map((g,i)=>{const info=GODS[g];return b(`${i+1}. ${g}：${info.strength.split('，')[0]}`,`${locate(g)}；${info.meaning}`,`可观察的优势：${info.strength} 可能的阻力：${info.risk} 适合用来验证的任务场景：${info.work}。这些是十神的现代职业转述，最终用作品、经历和岗位反馈判断。`,info.task);});
    workBlocks.push(...signals.map(s=>b('组合怎么看：'+s.title,s.evidence,s.plain+' '+s.limit)));
    workBlocks.push(b('把方向落实为一次职业试验',`先从月令${c.monthGod}与外显${visible.map(a=>a.god).join('、')||'暂无'}对应的任务中选择。`,'第1周，选一个可以交付的真实问题，写清需求、期限与评价人。第2周，做最小成果，记录自己在哪种任务中效率高、消耗大。第3周，拿成果向三位同行询问具体差距。第4周，对比反馈，决定继续、调整方向或补足技能。','保留一份作品、一份反馈记录与下一阶段能力清单。'));
    const wealthGods=['正财','偏财'].filter(present),peerGods=['比肩','劫财'].filter(present),outputGods=['食神','伤官'].filter(present);
    const wealthBlocks=[b('财星在盘里具体在哪里',wealthGods.length?wealthGods.map(g=>`${g}：${locate(g)}`).join('；'):`在已知天干和藏干中未见财星（${roles.wealth}）。`,wealthGods.length?`${wealthGods.map(g=>`${g}的取象是${g==='正财'?'持续经营与可核算成果':'外部机会与资源流动'}`).join('；')}。财星是日主与某类五行的关系，不是账户余额，出现多也不能直接解释为收入高。`:'未见财星只表示这组符号没有出现。传统分析还可能从食伤、大运等看变化，不能推成“没有财运”或“赚不到钱”。'),b('技能如何转成可持续成果',outputGods.length?outputGods.map(g=>`${g}：${locate(g)}`).join('；'):'已知干支中未见食伤。',outputGods.length?`已知盘面有${outputGods.join('、')}线索，可把“输出”落实为作品、交付、知识产品等现实能力。重点核对：谁需要这个成果，交付多久，服务与返工成本多少。`:'从现实可验证的技能开始建立输出链：选问题、做样品、收反馈、修订流程。不因没有某一十神而否定能力。','为一项服务写明范围、验收标准、修改次数和交付期限。'),b('合作与资源分配要先说清',peerGods.length?peerGods.map(g=>`${g}：${locate(g)}`).join('；'):'已知干支中未见比劫类符号。',peerGods.length?'同伴类符号可以用于观察资源共享与竞争的边界。现实中的合作要落实到工作量、成果归属、费用承担与退出条件，避免把信任完全建立在口头关系上。':'合作仍应约定角色与责任。不能因为盘里缺少竞争符号，就认为任何合作都不会出现分歧。'),b('资源管理检查表','这里是通用的工作与生活管理清单，不是投资建议。','每月记录固定事项、可调整事项、待兑现承诺与已完成成果；为每个新项目列出最小验证范围和停止条件。是否借贷、投资或离职，应根据现实承受能力与专业信息作出选择。')];
    const dayBranch=c.pillars[2].zhi,dayGod=c.pillars[2].hidden[0].god,dayInfo=GODS[dayGod];
    const dayRels=relationList.filter(r=>r.positions.includes('日柱')&&r.kind!=='天干五合');
    const loveBlocks=[b('先看关系取象的中心',`日柱${c.pillars[2].gz}，日支${dayBranch}，本气${c.pillars[2].hidden[0].gan}相对日主为${dayGod}。`,`传统把日支称作配偶宫，用它观察亲近关系的取象。${dayInfo.meaning} 把它放在相处层面，可以观察自己是否重视“${{同伴:'平等与自主',表达:'表达与共同体验',经营:'稳定安排与实际付出',秩序:'承诺、责任与明确规则',学习:'理解、支持与共同成长'}[dayInfo.group]}”。这不是对伴侣真实人格的判定。`),b('关系中可能表现的两面',`以日支本气${dayGod}的现代关系取象展开。`,`较顺畅的一面：${dayInfo.strength} 在关系里的阻力：${dayInfo.risk} 可以先回想一次近期分歧，看它更接近价值观差异、表达方式差异，还是责任分配不清。`,dayInfo.task),...dayRels.map(r=>b(`位置关系：${r.pair}${r.kind}`,r.text,r.kind==='六冲'?'传统把冲视为方向与节奏的相对。落在日支时可提醒自己具体谈清居住安排、双方家庭介入和时间分配；这不是分手或婚变结论。':r.kind==='六合'?'传统把合视为连接与牵引。可以反思两个人是否容易互相迁就，以及迁就有没有压住真实需求；合不自动代表关系幸福，也不等于合化。':'害、破或三合三会是传统关系名称。这里将它作为核对期待、承诺与边界的提醒，不据此判断伴侣忠诚或关系成败。')),b('单身时，怎么把“姻缘”变成具体行动','这是现代相处建议，不能用命盘推出遇见某人的日期。','选两种能稳定参与的线下或线上兴趣活动；认识新朋友时关注三项现实信息：是否尊重拒绝，承诺能否兑现，遇到分歧能否交流。不要只依赖“属相合不合”或某一干支来筛选他人。'),b('已有伴侣时，四件事先对齐',`日支相关关系${dayRels.length}条，具体位置已在上文列出。`,'每月留一次专门沟通：一是时间怎样分配，二是共同费用怎样承担，三是双方家庭的参与边界，四是重大选择如何商量。讨论时用“发生了什么—我的感受—希望怎样调整”的句式，避免把命盘结论当作压服对方的理由。','各自写一项最看重的需要、一项可让步的习惯和一项不可越过的边界。')];
    const healthBlocks=[b('这张命盘能谈什么',`日主${d}${c.dayElement}；出生月支${month.zhi}。`,'这里的“健康生活”分两层：传统部分解释季节与寒暖意象，现实部分提供日常记录和生活安排。八字不能判断器官功能、疾病、体质或寿命；身体情况需要来自症状、检查和医学评估。'),b(seasonal.title,`文化层面参考${month.zhi}月的季节取象。`,seasonal.text+' 现实可做的是：'+seasonal.life),b('工作压力怎么拆解',`外显官杀：${visible.filter(a=>['正官','七杀'].includes(a.god)).map(a=>a.where+a.gan+' '+a.god).join('、')||'未见'}。`,'官杀在术数中是约束与责任的符号，不是压力疾病指标。无论盘中是否出现，现实都可把任务分为必须本人完成、可以协作、可以延期三类；如果长期超负荷，优先协商期限与资源，而不是用“运势不好”解释身体消耗。'),b('一份可以坚持七天的记录表','记录只留在自己手中，不需要提交个人医疗信息。','每天记录起床与休息时间、主观精力、久坐与活动、最消耗自己的任务。七天后找一个重复出现的问题，例如经常晚于计划结束工作。只选一项可改变的因素，下一周再比较。','为工作设置结束提醒，给吃饭、活动和休息预留固定时间。'),b('什么时候应该换一种帮助方式','依据实际感受与现实问题处理。','如果出现持续不适、明显功能下降或令人担心的症状，应寻求正规医疗帮助。不要根据命盘推迟就医、改变药物或治疗。关系与工作问题也可分别寻求合适的咨询与实际支持。')];
    const forecast=buildForecast(c,api,options);
    const yearsBlocks=forecast.items.map(y=>b(`${y.year}年 · ${y.gz} · ${y.theme}`,`立春区间 ${y.start} 至 ${y.end}；年干${y.gz[0]}为${y.god}；${y.period?`大运${y.period.gz}（${y.period.startDate}起）`:'未进入已列大运或未指定排法'}。`,y.text, GODS[y.god].task));
    const practiceBlocks=[b('第1周：把盘面信息换成现实问题',`本命月令线索为${c.monthGod}；${supportLabel}。`,`从事业或关系模块选一项你最近确实遇到的问题。只记录具体场景、参与人、发生频率与已有证据，不先把经历套入“命好命差”。`,'写下一个问题和一个可以观察的改善指标。'),b('第2周：做一项可完成的试验',`优先任务：${GODS[c.monthGod].task}`,`把任务压到一周可完成的范围；约定谁给反馈、什么算完成。如果真实反馈与报告取象不同，以真实反馈为准，记录差异，不事后把任何结果都解释成命盘已说中。`),b('第3周：检视边界与资源',`原局同伴类、经营类、秩序类符号的位置已列在事业与资源章节。`,'检查是否有职责不清、承诺过多、反复返工或需要表达但一直未说的需求。为一个问题提出具体调整，而不是一次重做全部生活。'),b('第4周：保留有效的，舍弃不适用的','复盘表：原问题／采取的行动／真实变化／下一步。','用记录判断这份报告有没有实际帮助。有效的建议留下，不适用的描述可以舍弃。后续切换流年时，核对的是新增的干支关系与自己的计划，不把年份标签当作必须发生的事件。')];
    c.readings={overview:section('命盘结构：从四柱一步步读到结论',`先看日主${d}${c.dayElement}，再看${month.zhi}月、${roots.length}处根气与透干关系。下面的每一步都给出实际干支位置。`,overview),career:section('事业：工作方式、优势阻力与验证路线','按月令与实际出现的十神逐项解释，落实到工作任务与一个月的验证方法。',workBlocks,'ditian'),wealth:section('财与资源：收入方式的传统取象','把财星、输出与合作分开读，重点是理解资源如何组织，而不是预测金额。',wealthBlocks,'ditian'),love:section('姻缘关系：需求、沟通与位置关系','先解释日支，再看涉及日支的合冲关系，分别给出单身与已有伴侣时的具体行动。',loveBlocks,'ditian'),health:section('健康生活：季节意象与日常照顾','传统意象用于文化理解，生活安排依据真实状态。',healthBlocks,'method'),years:section('大运流年：逐年看新增了什么',`分析参考时点 ${forecast.referenceDate}。每个年份说明立春边界、大运及其与原局的关系。`,yearsBlocks,'ditian'),practice:section('行动路线：四周完成一次现实验证','把报告中可用的内容变成能执行、能回顾的行动。',practiceBlocks,'method'),glossary:section('白话词典：术语究竟是什么意思','看到术语时，可以回到这页查看定义、计算口径与适用范围。',GLOSSARY.map(([title,text])=>b(title,'结合本命四柱查看具体位置。',text)),'method')};
    c.detail={version:'2.0.0',roles,roots,monthRelation,supportLabel,transmissions,relations:relationList,signals,gods:Object.entries(GODS).map(([god,info])=>({god,...info,visible:visible.filter(a=>a.god===god),hidden:hidden.filter(a=>a.god===god)})),forecast,confidence:c.input.unknown?'时辰未知，结构信息不完整':c.warnings.some(w=>w.includes('节气交接'))?'临近交节，需确认出生分钟':'按所填出生信息计算',summary:[`日主${d}${c.dayElement}，${monthRelation}。`,`${roots.length}处同类根气；${supportLabel}。`,`${relationList.length}条已列干支关系，${signals.length}项组合线索。`]};
    return c;
  }
  function buildForecast(c,api,options){
    const {Solar,shiShen}=api;
    const now=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
    const today=options.referenceDate||now;
    const requested=Number(c.input.analysisYear||today.slice(0,4));
    if(!Number.isInteger(requested)||requested<1901||requested>2099)throw Error('分析年份请填写1901–2099。');
    const ref=String(requested)===today.slice(0,4)?today:`${requested}-07-01`;
    const periodFor=date=>c.luck?.periods.find(p=>date>=p.startDate&&date<p.endDate)||null;
    const stem=(year)=>Solar.fromYmdHms(year,7,1,12,0,0).getLunar().getEightChar().getYear();
    const items=[];
    for(let year=requested;year<=Math.min(requested+4,2099);year++){
      const gz=stem(year),god=shiShen(c.dayGan,gz[0]),info=GODS[god];
      const jie=Solar.fromYmd(year,6,1).getLunar().getJieQiTable()['立春'];
      const end=Solar.fromYmd(year+1,6,1).getLunar().getJieQiTable()['立春'];
      const period=periodFor(`${year}-07-01`),contacts=[];
      for(const p of c.pillars.filter(p=>p.gz))for(const [kind,pairs]of Object.entries(RELS))if(pairs.some(v=>v===gz[1]+p.zhi||v===p.zhi+gz[1]))contacts.push(`${gz[1]}与本命${p.label}${p.zhi}${kind}`);
      if(period)for(const[kind,pairs]of Object.entries(RELS))if(pairs.some(v=>v===gz[1]+period.gz[1]||v===period.gz[1]+gz[1]))contacts.push(`${gz[1]}与大运${period.gz[1]}${kind}`);
      const transitions=c.luck?.periods.filter(p=>p.startDate.startsWith(year+'-'))||[];
      const text=`年干${gz[0]}相对日主${c.dayGan}为${god}，传统主题落在${info.group}：${info.meaning} 可借这一主题检查${info.strength}需要哪些现实条件，同时留意${info.risk} ${contacts.length?'具体关系：'+contacts.join('；')+'。':'年支与已知原局地支没有命中本表六合、冲、害、破。'} ${period?'7月1日所处大运'+period.gz+'，运干为'+shiShen(c.dayGan,period.gz[0])+'；这提供阶段背景，不与流年机械相加打分。':'此年未匹配到已列大运，按流年与原局单独展示。'} ${transitions.length?'本年有交运点 '+transitions.map(t=>t.startDate+'转入'+t.gz).join('、')+'，交运前后需分段阅读。':''} ${year<Number(c.original.slice(0,4))?'本年早于出生年份，仅作干支关系演示。':''}这些是传统关系变化的解释，不代表升职、失业、结婚或疾病必然发生。`;
      items.push({year,gz,god,theme:info.group,period,start:jie.toYmdHms(),end:end.toYmdHms(),contacts,transitions,text});
    }
    const activeGz=Solar.fromYmdHms(...ref.split('-').map(Number),12,0,0).getLunar().getEightChar().getYear();
    return{referenceDate:ref,activeYearGz:activeGz,activePeriod:periodFor(ref),items};
  }
  const api={enrich,GODS,RELS};if(typeof module==='object'&&module.exports)module.exports=api;else root.ZhiMingAnalysis=api;
})(typeof globalThis!=='undefined'?globalThis:this);
