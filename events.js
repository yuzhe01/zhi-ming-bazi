(function(root){
  'use strict';
  // These are conditional modern scenarios, not additional rules from a classic.
  // Source priority selects what to discuss; it is never an event probability.
  const WORK={unknown:'未指定职业状态',employed:'在职',seeking:'求职 / 待业',independent:'接单 / 经营',student:'在读'};
  const LOVE={unknown:'未指定关系状态',single:'单身',partner:'恋爱中',married:'已婚'};
  const PROFILES={
    正官:{kind:'岗位与职级',titles:['获得正式任命，职级或职责上一个台阶','求职推进到录用、定岗或转正','拿到有明确标准的正式合作资格','评优、录取或担任正式职务'],
      scenes:['从执行者变成某项业务的负责人，开始带人、定计划，或进入职级评定名单。','面试通过后落实书面 offer；或者实习、试用期转为正式岗位。','通过供应商准入、招标或资格审核，进入对方的长期合作名单。','进入录取、评优或项目遴选名单，获得有明确职责的学生职务。'],
      good:'好在身份和决定权被正式确认：有任命、名额或书面认可，后续才有谈待遇的基础。',condition:'现实中正在招聘、晋级、评优或审核，并且你满足公开要求。',risk:'若只是多了工作、没有相应授权或定级，应理解为责任增加，暂不能称为升职。',check:'核对任命 / offer / 评审结果，以及职责、级别和待遇是否一起写清。'},
    七杀:{kind:'重任与竞争',titles:['被交付难项目，靠解决问题争取位置','进入竞争更强、要求更高的岗位筛选','接到急单、难单或高要求客户','参加竞争性选拔，承担关键任务'],
      scenes:['旧项目卡住后由你接手，处理紧急交付、客户问题，或临时代理负责人。','遇到限期交付的面试任务、强竞争复试，或者对到岗与经验要求较高的机会。','客户期限紧、验收严，需要你协调外部人手或解决别人没解决的问题。','参加竞赛、研究项目选拔，或者被安排负责团队最难的一部分。'],
      good:'好在关键成果容易被看见，后续可成为争取职务、合作或名额的材料。',condition:'你已有相应能力，且对方能给期限、预算、权限或辅导支持。',risk:'认可可能晚于工作量；资源不给却要求兜底，会变成额外消耗。',check:'看任务结果是否进入评价记录，并确认完成后对应什么认可。'},
    食神:{kind:'成果落地',titles:['作品或项目通过验收，形成代表成果','用作品、样例交付推动录用','交付顺利后获得复购或转介绍','完成作品、课题或实践成果'],
      scenes:['完成一个能展示的版本，方案被采用，产品上线或交付验收通过。','作品集、试做任务或案例展示得到认可，让招聘方继续推进流程。','把已有服务做成可重复交付的方案，客户验收后愿意继续合作。','完成论文阶段、作品集、实验或课程项目，获得明确反馈。'],
      good:'好在做出来的成果能被验收、展示或再次使用，有了具体成绩可谈下一步。',condition:'任务有真实需求、明确完成标准，并有人接收和评价成果。',risk:'只反复打磨、没有发布或验收，收获会停在准备阶段。',check:'确认上线记录、验收反馈、作品采用或续单意向。'},
    伤官:{kind:'改方案与突破',titles:['新方案被采用，原有流程或分工改变','靠作品与解决问题能力争取转岗','以差异化方案争取客户订单','创新方案、答辩或竞赛表现被看见'],
      scenes:['你提出的方法替代旧流程，负责一次试点，或从重复执行转向设计、研发、产品工作。','通过案例分析、技术演示或作品争取更看重能力展示的岗位。','针对客户原方案的缺点提出替代做法，以试点效果争取合作。','用新方法完成课题、作品答辩或竞赛展示，得到继续试验的机会。'],
      good:'好在改进被实际采用，能证明你除了执行，还能提出有效办法。',condition:'先取得试点许可，并用结果说明收益，评价人认可这种改动。',risk:'表达直接却没有证据或授权，容易变成与上级、客户对方案的争执。',check:'看是否获准试用、进入正式流程，而不只看讨论时有没有人称赞。'},
    正财:{kind:'固定报酬与续约',titles:['谈固定薪资、绩效兑现或稳定续约','拿到薪资与入职条件明确的 offer','老客户续单，形成更稳定的服务收入','落实奖助、带报酬的实习或固定兼职'],
      scenes:['进入薪资复核，已有绩效被确认，或者续约时重新明确薪酬与岗位。','双方对基本工资、绩效口径、试用条件和到岗时间达成书面约定。','已有客户按既定周期续签，服务内容和付款节点比临时接单更清楚。','符合条件后落实奖助评定、实习报酬或工时固定的兼职安排。'],
      good:'好在报酬更清楚、可重复：重点是工资、续约与已约定的回报。',condition:'已有可核对的工作成果、合同或资格要求，付款方愿意兑现。',risk:'谈妥总额却没说清验收、扣减与支付日期，到账仍可能拖延。',check:'看书面金额、支付条件与实际到账；不能仅凭这一符号预测涨幅。'},
    偏财:{kind:'项目与外部机会',titles:['接触新客户、新项目或一次性奖金机会','经外部联系获得项目制或商务岗位机会','经客户、渠道介绍拿到新订单','参与有报酬的短期项目或实践'],
      scenes:['熟人、客户或跨部门合作带来一个新项目，报酬可能按项目或成果结算。','通过同行、客户网络认识招聘方，机会偏项目合作、商务或弹性安排。','新客户或渠道提出合作需求，先试单，再讨论扩大合作。','通过老师、同学或项目团队接触短期实践，报酬按实际任务约定。'],
      good:'好在打开新的合作入口，可能增加工资以外或现有客户以外的回报来源。',condition:'确有外部需求，并能谈清谁付款、交付什么、何时验收。',risk:'询盘、口头兴趣和合同还不是收入；前期成本也可能随项目增加。',check:'核对签约、预付款、验收和净到账，不能推成横财或投资收益。'},
    正印:{kind:'资质与内部支持',titles:['培训、资格评定或内部推荐帮助转岗','凭证书、学历或推荐进入招聘流程','取得认证或标准资质后争取合作','升学、考试或导师支持成为重点'],
      scenes:['得到培训名额、资质评定或导师型同事支持，再争取内部转岗、专业岗位。','以已有学历、证书或可靠推荐补足招聘条件，进入更匹配的筛选。','完成行业资质或标准认证，补齐客户审核要求。','准备考试、申请升学，或获得导师对课题和项目的具体指导。'],
      good:'好在先拿到支持、资质或入场条件，之后才可能转换为岗位或收入。',condition:'目标岗位、学校或客户确实认可该资质，且你完成规定要求。',risk:'容易表现为学习和准备增加，待遇不会因此自动同步提高。',check:'确认资质通过、推荐进入正式流程或支持已落实，而不只停留在承诺。'},
    偏印:{kind:'专业转向',titles:['转入研究、分析或较专门的新任务','用专业样例争取细分岗位','靠专门技术解决客户的少见问题','调整研究方向，完成专门课题'],
      scenes:['开始负责研究、工具、策略或资料分析，与原来的日常执行工作不同。','以专题研究、技术样例证明能胜任要求较专门的岗位。','用独有经验、工具或研究结果完成客户不易自己解决的任务。','选择更细的研究题目、工具方法，或在导师指导下修改课题方向。'],
      good:'好在建立别人不易替代的专业成果，为后续转向提供材料。',condition:'研究问题有实际使用者，并约定演示或交付日期。',risk:'资料越查越多但成果迟迟不交，容易出现方向反复。',check:'看样例是否被使用、专题成果是否通过评审。'},
    比肩:{kind:'同级合作与竞岗',titles:['与同级共同带项目，或竞争负责人名额','通过同行协作或同专业竞争争取岗位','与同行分工接项目','与同学组队，同时竞争项目名额'],
      scenes:['与同资历的人共同负责项目，也可能遇到同级竞争同一个职级或负责人名额。','通过同行互推、共同作品进入招聘视野；录用仍取决于岗位筛选。','与同行分别负责不同环节，共同服务一个原本难以独自完成的客户。','组队完成比赛或课题，同时按个人贡献评定名额。'],
      good:'好在通过同伴补足能力与人手，或用独立负责的成果争取位置。',condition:'分工、负责人和成果归属清楚，同一名额的评价标准公开。',risk:'贡献难区分时会互相争功；合作增加不等于个人待遇必然提高。',check:'确认本人负责的交付、署名、评价或分成是否落实。'},
    劫财:{kind:'合作分工与资源分配',titles:['跨团队合作增多，同时重新划分资源','通过人脉进入机会，也要面对同岗竞争','联合接单，重新约定成本与分成','组队争取资源，明确个人贡献'],
      scenes:['需要借其他团队的人手、渠道或预算，共同推进一个任务。','有人推荐或共同准备面试，但最终仍按各自条件竞争岗位。','伙伴带来项目，需要共同垫付时间或费用，并讨论谁拿多少。','与队友共享项目名额、器材或经费，同时确定个人分工。'],
      good:'好在能接触个人原本没有的人手和渠道，扩大可承接任务的范围。',condition:'角色、费用、分成、成果归属与退出方式事先约定。',risk:'任务扩大但自己的净回报未增加，或因口头分成出现争议。',check:'以个人实际所得、投入和署名为准，不能把热闹或忙碌直接看作好运。'}
  };
  function build(c,api,forecast,facts){
    const {shiShen}=api;
    const requestedWork=Object.hasOwn(WORK,c.input.workStatus)?c.input.workStatus:'unknown';
    const relationship=Object.hasOwn(LOVE,c.input.relationship)?c.input.relationship:'unknown';
    const relations=(a,b)=>Object.entries(api.RELS).filter(([,pairs])=>pairs.some(v=>v===a+b||v===b+a)).map(([kind])=>kind);
    function forYear(y){
      const prior=y.end<=c.original;
      const rangeStart=prior||y.start>c.original?y.start:c.original;
      const rangeEnd=y.end;
      const ageDate=`${y.year}-07-01`>=rangeStart.slice(0,10)?`${y.year}-07-01`:rangeStart.slice(0,10);
      const age=Number(ageDate.slice(0,4))-Number(c.original.slice(0,4))-(c.original.slice(5,10)>ageDate.slice(5,10)?1:0);
      const work=age<18?'student':requestedWork;
      const index=work==='seeking'?1:work==='independent'?2:work==='student'?3:0;
      const when=`${rangeStart.slice(0,10)} 至 ${rangeEnd.slice(0,10)} 立春前${rangeStart===c.original?'（出生当年从出生日期起）':''}`;
      const natal=[...facts.visible.map(v=>({...v,where:v.where+v.gan,origin:'本命天干',priority:4})),...facts.hidden.map(v=>({...v,where:v.where+v.gan,origin:'本命藏干',priority:1}))];
      const tokens=[{god:y.god,where:`${y.year}年干${y.gz[0]}`,origin:'流年天干',priority:10},...natal];
      const branchMain=api.HIDDEN[y.gz[1]][0];
      tokens.push({god:shiShen(c.dayGan,branchMain),where:`${y.year}年支${y.gz[1]}本气${branchMain}`,origin:'流年地支本气',priority:7});
      if(y.period)tokens.push({god:shiShen(c.dayGan,y.period.gz[0]),where:`7月1日所处${y.period.gz}大运运干${y.period.gz[0]}`,origin:'大运运干',priority:6});
      const hits=names=>tokens.filter(t=>names.includes(t.god)).sort((a,b)=>b.priority-a.priority);
      const evidence=names=>hits(names).slice(0,4).map(t=>`${t.where}为${t.god}`).join('；');
      const groupedEvidence=groups=>{
        const selected=groups.map(names=>hits(names)[0]).filter(Boolean);
        for(const token of hits(groups.flat()))if(selected.length<4&&!selected.includes(token))selected.push(token);
        return [...new Set(selected)].map(t=>`${t.where}为${t.god}`).join('；');
      };
      const caveat=y.transitions.length?`本年${y.transitions.map(t=>`${t.startDate}转入${t.gz}运`).join('、')}；所列大运背景按7月1日取值，交运前后不能一概而论。`:'';
      const make=(id,domain,title,result,good,condition,risk,check,basis)=>({id,domain,year:y.year,gz:y.gz,when,title,result,good,condition,risk,check,evidence:basis,scope:caveat,basisScope:'位置关系取象'});
      const tag=(event,names)=>{const top=hits(names)[0];event.basisScope=top?.priority>=7?'本年主题':top?.priority===6?'大运背景':'本命背景';if(event.basisScope==='本命背景')event.result=`这项只来自原局长期取象，没有本表流年或运干的对应新增信号。具体可理解为：${event.result}`;return event;};
      if(prior){
        const unavailable=domain=>[make('before-birth',domain,'该年份早于出生，不能作人生事件解读','请选择出生之后的年份。','—','—','未出生年份不能推演你的工作、收入或关系。','切换分析年份。',`${y.year}年早于出生年份${c.original.slice(0,4)}。`)];
        return {year:y.year,gz:y.gz,career:unavailable('career'),wealth:unavailable('wealth'),love:unavailable('love'),work,age};
      }
      const order=[...new Set(tokens.slice().sort((a,b)=>b.priority-a.priority).map(t=>t.god))];
      const career=order.slice(0,2).map(g=>{const p=PROFILES[g];return tag(make(g,'career',p.titles[index],p.scenes[index],p.good,p.condition,p.risk,p.check,evidence([g])),[g]);});
      const month=c.pillars[1],monthContacts=relations(y.gz[1],month.zhi);
      if(monthContacts.includes('六冲'))career.push(make('month-clash','career',work==='student'?'学习环境、课题或团队安排调整':'团队、岗位或项目安排有调整议题',work==='student'?'可能需要换项目分工、课题方向或学习安排；是否转学、升学不能据此确定。':'可能对应换负责人、调整团队、重排项目或协商转岗；如果已经在找机会，也可对应面试新团队。','若新的职责、资源和评价标准更清楚，调整可以成为向前一步。','现实中确有组织调整或转向计划，且新条件比原来更适合。','冲只能提示传统上的变动议题，不能据此认定失业或断言必须跳槽。','比较调整前后的职务、待遇、权限与工作内容。',`流年${y.gz[1]}与本命月支${month.zhi}六冲；月柱位置：${month.gz}。`));
      const output=hits(['食神','伤官']),money=hits(['正财','偏财']);
      if(output.some(t=>t.priority>=4)&&money.some(t=>t.priority>=4)&&[...output,...money].some(t=>t.priority>=7)){
        const p=make('output-to-income','career',work==='student'?'作品或实习成果带来报酬、名额或后续机会':'项目成果兑现为奖金、续单或报价依据',work==='independent'?'把已做出的样品或服务交给真实客户试用，验收后讨论续单或新的报价。':work==='seeking'?'用作品、试做或案例争取录用，再把待遇写进正式 offer。':work==='student'?'课题、作品或实习获得采用后，再争取相应报酬、展示名额或推荐。':'完成可量化交付，成果被采用后进入奖金核算、客户续约或待遇沟通。','好在成果和回报有具体承接，能指出“做成了什么，换来了什么”。','成果有需求方，事前约定验收与回报；这只是食伤、财星并见的现代情景，不等于已成格。','有作品却没有付费需求，或者没有兑现约定，就可能只有忙碌、没有收入增加。','同时核对成果采用记录与实际回报。',evidence(['食神','伤官','正财','偏财']));
        p.evidence=groupedEvidence([['食神','伤官'],['正财','偏财']]);
        tag(p,['食神','伤官','正财','偏财']);
        if(['食神','伤官','正财','偏财'].includes(y.god))career.unshift(p);else if(career.length<3)career.push(p);
      }
      const wealth=[];
      for(const g of ['正财','偏财'].filter(g=>money.some(t=>t.god===g))){
        const p=PROFILES[g];wealth.push(tag(make(g,'wealth',p.titles[index],p.scenes[index],p.good,p.condition,p.risk,p.check,evidence([g])),[g]));
      }
      wealth.sort((a,b)=>(hits([b.id])[0]?.priority||0)-(hits([a.id])[0]?.priority||0));
      if(!money.some(t=>t.priority>=6)){
        const unclear=make('income-unclear','wealth','本年暂不能直接判断收入增加','本年主要信号先落在岗位、成果或合作议题。即使原局有财星，也只是长期取象，不能单独推出这一年涨工资或多拿奖金。','先确认职责、成果与合作是否改善，收入要等现实约定和到账来确认。','需要真实薪酬、合同、验收和付款情况。','机会增加与实际多赚多少钱，要分别核对。','核对实际约定与收入记录。',`流年年干${y.gz[0]}为${y.god}；流年支本气${branchMain}为${shiShen(c.dayGan,branchMain)}；本表年度主信号及7月1日运干未列财星。`);
        unclear.basisScope='年度收入信号不足';wealth.unshift(unclear);
      }
      const peers=hits(['比肩','劫财']);
      if(peers.length&&money.length&&[...peers,...money].some(t=>t.priority>=6))wealth.push(tag(make('split-cost','wealth','有收入议题，也要看分成、成本和回款','合作项目可能同时涉及伙伴分成、外包费用或前期投入；总项目金额与个人实际所得应分开看。','在费用和分工清楚时，协作可以扩大接单与交付范围。','合同列明各自投入、付款与退出条件。','不能把比劫财星同现直接断成破财；这里只列需要核对的资源议题。','看扣除约定成本后的实际所得和到账日期。',groupedEvidence([['比肩','劫财'],['正财','偏财']])),['比肩','劫财','正财','偏财']));
      const day=c.pillars[2],dayContacts=relations(y.gz[1],day.zhi),dayGod=day.hidden[0].god;
      const baseEvidence=`流年${y.gz[1]}与日支${day.zhi}：${dayContacts.join('、')||'本表未见六合、冲、害、破'}；日支本气${day.hidden[0].gan}为${dayGod}。`;
      const love=[];
      if(age<18)love.push(make('minor','love','以同伴相处、学习安排和沟通为主','这份报告不会为未成年人推演婚期、婚姻结果或生育。','相处中彼此尊重，遇到分歧能说清楚。','依据实际年龄与生活阶段理解关系。','不能把合冲作为必须开始或结束一段关系的理由。','看对方是否尊重你的意愿和边界。',baseEvidence));
      else {
        const single=relationship==='single',coupled=['partner','married'].includes(relationship);
        if(dayContacts.includes('六合'))love.push(make('day-combine','love',single?'认识之后增加接触，讨论是否确定关系':coupled?'讨论共同安排，让关系多一步具体落实':'单身可看接触推进；有伴可看共同安排',single?'若已有彼此愿意了解的人，可从偶尔聊天进入固定见面，再谈是否以伴侣身份相处。':coupled?'把见面、共同生活、家庭往来或一项共同计划排上日程；选择哪一项要看你们现有阶段。':'如果单身且已有接触对象，可讨论是否继续发展；如果已有伴侣，可把一个共同计划落实。','好在双方有来有往，而且愿意落实到时间和行动。','现实中已有双方自愿的互动；六合本身不能产生伴侣。','迁就或绑定增多也可能让人有压力；不能由此确定结婚。','看双方是否共同决定、按约见面和兑现承诺。',baseEvidence));
        if(dayContacts.includes('六冲'))love.push(make('day-clash','love',single?'认识机会与生活安排需要协调':'工作、住处或见面频率需要重新商量',single?'若现实中开始认识新朋友，可能需要先解决距离、日程或未来安排的不同。':'已有关系时，具体可讨论在哪里生活、多久见一次、工作调动后如何相处。','好在把长期没说清的安排谈透，形成双方接受的做法。','你们现实中确有日程、距离或生活规划差异。','分歧可能更明显；六冲不能直接推出分手、离婚或对方不忠。','看是否形成可执行的共同安排，而不是只看争论次数。',baseEvidence));
        if(!love.length){const topic={同伴:'各自空间、社交边界与分工',表达:'见面、交流与共同活动',经营:'共同费用、生活安排与实际付出',秩序:'承诺、双方期待与家庭边界',学习:'支持、沟通与共同成长'}[api.GODS[dayGod].group];love.push(make('relationship-topic','love',single?'暂不能确定脱单时间；先看实际接触是否持续':coupled?`把${topic}谈成具体安排`:'暂不能从本年关系符号确定婚恋事件',single?'若想推进关系，先看一个具体对象是否持续主动联系、愿意见面，再讨论是否互为伴侣。':coupled?`本页按日支本气展开的具体议题是${topic}；例如约定频率、责任和可接受的边界。`:'填写单身、恋爱中或已婚后，可按你的阶段展开具体相处议题。','以双方愿意持续投入、承诺能兑现作为顺利的表现。','需要有真实对象、双方意愿和相处记录。','没有命中六合或六冲不表示没有姻缘，也不足以给出结婚或分手年份。','观察具体互动，不按符号替别人作决定。',baseEvidence));}
      }
      if(age<16){
        wealth.splice(0,wealth.length,make('school-resources','wealth','看学习资源与活动安排，不推演工资、接单或投资','这一阶段可以具体核对课程材料、比赛或活动名额，以及家庭已经约定的费用安排。','好在需要的学习和活动支持落实到位。','按实际年龄、家庭和学校安排理解。','不能从财星推断孩子赚钱、家庭资产或家长收入。','看真实的名额、物品或费用安排。',`按${ageDate}估算周岁${age}；${evidence(['正财','偏财'])||'不以财星推演未成年人收入'}。`));
        const junior={正财:['评优、活动名额或学习支持落实','符合学校要求后，确认评优、活动名额或学习材料安排。'],偏财:['接触新的学校活动或课外实践','在家长和学校安排下，接触一项新的活动或实践。'],食神:['完成课堂作品或课程项目','完成一份作品、练习或课程项目，获得老师的具体反馈。'],偏印:['尝试一项专门兴趣或学习方法','围绕具体兴趣完成一个小成果，看看哪种学习方法适合。']};
        for(const e of career){if(junior[e.id]){[e.title,e.result]=junior[e.id];}e.good='好在学习成果、参与资格或所需支持得到确认。';e.condition='学校或活动有真实名额与要求，且适合当前年龄。';e.risk='作品或努力不保证获奖；以真实反馈为准。';e.check='看成果反馈、活动名额或支持是否落实。';if(e.id==='output-to-income'){e.title='作品获得展示、采用或参加活动的机会';e.result='完成作品后，争取课堂展示、学校活动或比赛的参与机会。';}}
      }
      if(age<6)career.splice(0,career.length,make('childhood','career','尚未进入职业阶段，不推演升职、录用或经营','这一年份主要按实际年龄理解日常活动与照顾安排，不能套用成年人的事业事件。','在照顾和活动安排上获得适合年龄的支持。','根据孩子的真实情况安排。','不能用职业取象给幼儿贴能力或前途标签。','以日常观察和真实需求为准。',`按${ageDate}估算周岁${age}。`));
      return {year:y.year,gz:y.gz,career:career.slice(0,3),wealth:wealth.slice(0,3),love,work,age};
    }
    const years=forecast.items.map(forYear),current=years[0];
    const pending=forecast.referenceDate+' 12:00:00'<forecast.items[0].start;
    const context=`分析的是${current.year}流年从立春起的完整区间。${pending?`参考日${forecast.referenceDate}仍属${forecast.activeYearGz}流年，所选年度尚未开始。`:''}职业：${WORK[current.work]}；关系：${LOVE[relationship]}。${current.work==='unknown'?'职业场景暂按在职示例展开，选择实际状态后可改为求职、在读或经营场景。':''}未来年份沿用所选状态；状态变化后请重新选择。`;
    return {version:'2.1.0',context,work:requestedWork,relationship,current,years,note:'以下是传统取象对应的条件情景，不是已经确定会发生的事。仅按年度讨论，不能可靠细分到某月某日；职业状态只改变场景措辞，不改变排盘。'};
  }
  const api={build,WORK,LOVE};if(typeof module==='object'&&module.exports)module.exports=api;else root.ZhiMingEvents=api;
})(typeof globalThis!=='undefined'?globalThis:this);
