(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const form = $('birth-form');
  const cityLongitudes = {杭州:120.1551,北京:116.4074,上海:121.4737,广州:113.2644,成都:104.0665,西安:108.9398,武汉:114.3055,深圳:114.0579,南京:118.7969,重庆:106.5516,香港:114.1694,台北:121.5654,乌鲁木齐:87.6168};
  const color = {木:'#789476',火:'#bf7b62',土:'#b49b68',金:'#9a9f99',水:'#7b9ca1'};
  const sources = {
    ziping:{title:'《子平真诠·论用神》',url:'https://www.chenshupaipan.com/books/5/3877.html'},
    ditian:{title:'《滴天髓》相关章节',url:'https://zh.wikisource.org/wiki/滴天髓'},
    method:{title:'本站方法与适用边界',url:'#method'}
  };
  let calendar='solar', current=null, currentTab='overview', isDemo=true, toastTimer;
  const sample = {nickname:'',year:1995,month:6,day:18,time:'09:30',calendar:'solar',leap:false,unknown:false,city:'杭州',longitude:120.1551,gender:'female',sect:'2',trueSolar:false,dst:false,workStatus:'employed',relationship:'unknown'};
  function toast(message) { $('toast').textContent=message; $('toast').hidden=false; clearTimeout(toastTimer); toastTimer=setTimeout(()=>$('toast').hidden=true,3500); }
  function setCalendar(type) {
    calendar=type;
    document.querySelectorAll('[data-calendar]').forEach(b=>{const chosen=b.dataset.calendar===type;b.classList.toggle('selected',chosen);b.setAttribute('aria-pressed',String(chosen));});
    $('leap-row').hidden=type!=='lunar';updateDays();
  }
  function updateDays() {
    const old=+$('day').value||18, y=+$('year').value, m=+$('month').value||6;
    const max=calendar==='lunar'?30:(Number.isInteger(y)&&y>=1901&&y<=2099?new Date(Date.UTC(y,m,0)).getUTCDate():31);
    $('day').replaceChildren(...Array.from({length:max},(_,i)=>new Option(String(i+1).padStart(2,'0'),i+1)));
    $('day').value=String(Math.min(old,max));
  }
  $('month').replaceChildren(...Array.from({length:12},(_,i)=>new Option(String(i+1).padStart(2,'0'),i+1)));
  $('month').value='6';updateDays();$('day').value='18';
  function readInput() {
    return {nickname:$('nickname').value.trim(),year:+$('year').value,month:+$('month').value,day:+$('day').value,time:$('time').value,calendar,leap:$('leap').checked,unknown:$('unknown').checked,city:$('city').value,longitude:$('longitude').value,gender:$('gender').value,sect:$('sect').value,trueSolar:$('trueSolar').checked,dst:$('dst').checked,workStatus:$('workStatus').value,relationship:$('relationship').value,analysisYear:+$('analysis-year').value||undefined};
  }
  function loadInput(x) {
    $('year').value=x.year;$('month').value=x.month;setCalendar(x.calendar);$('day').value=x.day;
    ['nickname','time','city','longitude','gender','sect'].forEach(k=>$(k).value=x[k]??'');
    $('workStatus').value=Object.hasOwn(ZhiMingEvents.WORK,x.workStatus)?x.workStatus:'unknown';
    $('relationship').value=Object.hasOwn(ZhiMingEvents.LOVE,x.relationship)?x.relationship:'unknown';
    ['leap','unknown','trueSolar','dst'].forEach(k=>$(k).checked=!!x[k]);
    $('time').disabled=!!x.unknown;$('time').required=!x.unknown;
    if(x.city==='custom'||x.trueSolar||x.dst||String(x.sect)==='1')document.querySelector('.advanced').open=true;
  }
  function renderPillars() {
    const parts=[];
    const row=(label,fn,cls)=>{parts.push(`<div class="pillar-label">${label}</div>`);current.pillars.forEach((p,i)=>parts.push(`<div class="${cls} ${i===2?'day-cell':''}">${fn(p,i)}</div>`));};
    parts.push('<div class="pillar-label">四柱</div>');
    current.pillars.forEach((p,i)=>parts.push(`<div class="pillar-head ${i===2?'day-head':''}">${p.label}</div>`));
    row('十神',p=>esc(p.gz?p.god:'未知'),'pillar-god');
    row('天干',p=>p.gz?`<span class="el-${p.elements[0]}">${p.gan}<small>${p.elements[0]}</small></span>`:'<span class="unknown-glyph">—</span>','pillar-glyph');
    row('地支',p=>p.gz?`<span class="el-${p.elements[1]}">${p.zhi}<small>${p.elements[1]}</small></span>`:'<span class="unknown-glyph">—</span>','pillar-glyph');
    row('藏干',p=>p.gz?p.hidden.map(h=>`<span><span class="el-${h.element}">${h.gan}${h.element}</span><small>${h.god}</small></span>`).join(''):'<span>时辰不详</span>','pillar-hidden');
    row('纳音',p=>esc(p.gz?p.nayin:'—'),'pillar-nayin');
    $('pillars').innerHTML=parts.join('');
  }
  function renderReading(tab) {
    currentTab=tab;
    document.querySelectorAll('[data-tab]').forEach(b=>{const on=b.dataset.tab===tab;b.classList.toggle('selected',on);b.setAttribute('aria-selected',String(on));b.tabIndex=on?0:-1;});
    $('reading-panel').setAttribute('aria-labelledby',`tab-${tab}`);
    const r=current.readings[tab],s=sources[r.source];
    const scenarios=r.events?.length?`<p class="event-note">${esc(current.detail.events.note)}</p><p class="event-context">${esc(current.detail.events.context)}</p><div class="event-list">${r.events.map(eventHtml).join('')}</div>`:'';
    const theory=`<div class="chapter-index">${r.blocks.length} 个依据解析点</div>${r.blocks.map(blockHtml).join('')}${tab==='overview'?godTable():''}<p class="reading-source">参考线索：<a href="${s.url}" ${s.url.startsWith('https:')?'target="_blank" rel="noopener noreferrer"':''}>${s.title} ↗</a> · 具体场景为现代转述</p>`;
    $('reading-panel').innerHTML=`<h3>${esc(r.title)}</h3><p>${esc(r.lead)}</p>${scenarios}${scenarios?`<details class="theory-details"><summary>展开命盘依据与完整解析</summary>${theory}</details>`:theory}`;
  }
  function eventHtml(e){return `<section class="event-card" data-event="${esc(e.id)}"><div class="event-top"><span>${esc({career:'事业',wealth:'收入',love:'关系'}[e.domain])}</span><small>${e.year}年 · ${esc(e.gz)} · ${esc(e.basisScope)}</small></div><h4>${esc(e.title)}</h4><p class="event-result">${esc(e.result)}</p><dl class="event-facts"><div><dt>好在这里</dt><dd>${esc(e.good)}</dd></div><div><dt>成立条件</dt><dd>${esc(e.condition)}</dd></div><div><dt>可能的阻力</dt><dd>${esc(e.risk)}</dd></div></dl><details class="event-proof"><summary>看时间、依据和兑现标志</summary><p><strong>年度范围：</strong>${esc(e.when)}。${esc(e.scope)}</p><p><strong>盘中依据：</strong>${esc(e.evidence)}</p><p><strong>如何确认：</strong>${esc(e.check)}</p><p>只在本命出现的符号是长期取象背景，不能单独作为这一年会应事的证据。所列场景不是古籍原句。</p></details></section>`;}
  function blockHtml(b){return `<section class="analysis-block"><h4>${esc(b.title)}</h4><div class="analysis-evidence"><strong>盘中依据 / 适用条件</strong><p>${esc(b.evidence)}</p></div><p>${esc(b.text)}</p>${b.action?`<div class="specific-action"><strong>具体做法</strong><p>${esc(b.action)}</p></div>`:''}</section>`;}
  function godTable(){return `<details class="god-table" open><summary>十神位置表：哪些在天干，哪些藏在地支</summary><p>同一个符号可能多次出现；出现次数不代表力量。</p>${current.detail.gods.map(g=>`<div class="god-entry"><strong>${g.god}<small>${g.group}</small></strong><div><span>天干：${esc(g.visible.map(v=>v.where+v.gan).join('、')||'未见')}</span><span>藏干：${esc(g.hidden.map(v=>v.where+v.gan).join('、')||'未见')}</span></div></div>`).join('')}</details>`;}
  function render() {
    const x=current.input;
    $('chart-title').textContent=x.nickname?`${x.nickname}的四柱命盘`:'一份生辰，一幅命图';
    $('demo-badge').textContent=isDemo?'示例命盘':'已完成排盘';
    $('birth-summary').textContent=`公历 ${current.original.slice(0,10)}${x.unknown?' · 时辰不详':` ${current.original.slice(11,16)}`} · ${x.city==='custom'?'自定义经度':x.city} · UTC+8`;
    $('day-master').textContent=current.profile[0];$('day-master').className=`el-${current.dayElement}`;
    $('master-nature').textContent=current.profile[1];$('lunar-summary').textContent='农历 '+current.lunar;
    $('clock-summary').textContent=x.unknown?'六字参考 · 时柱待定':x.trueSolar?'近似真太阳时 '+current.corrected.slice(11,16):`钟表时间 · ${current.pillars[3].zhi}时`;
    renderPillars();
    $('elements').innerHTML=ZhiMing.ELEMENTS.map(e=>`<div class="element-row"><span class="el-${e}">${e}</span><div class="element-track" role="meter" aria-label="${e}的字数" aria-valuemin="0" aria-valuemax="${current.total}" aria-valuenow="${current.counts[e]}" aria-valuetext="${current.counts[e]}字，共${current.total}字"><div class="element-fill" style="width:${current.counts[e]/current.total*100}%;background:${color[e]}"></div></div><b>${current.counts[e]}</b></div>`).join('');
    const absent=ZhiMing.ELEMENTS.filter(e=>!current.counts[e]);
    $('element-summary').textContent=`明面${current.total}字，各字计一次。${absent.length?`${absent.join('、')}未见于明面，不等于藏干没有，也不代表需要“补”该五行。`:'五行在明面均有出现，仍需结合月令与整体结构理解。'}`;
    renderReading(currentTab);
    $('report-meta').textContent=`2.1 具体事情版 · ${current.detail.confidence}`;
    $('report-highlights').innerHTML=current.detail.summary.map((t,i)=>`<div><span>0${i+1}</span><p>${esc(t)}</p></div>`).join('');
    $('analysis-year').value=+current.detail.forecast.referenceDate.slice(0,4);
    $('active-forecast').textContent=`${current.detail.forecast.referenceDate} · 当时流年 ${current.detail.forecast.activeYearGz}`;
    const luck=current.luck;
    $('luck-direction').textContent=luck?(luck.forward?'顺排':'逆排')+' · 传统排法':'';
    $('luck-summary').textContent=luck?`出生后 ${luck.age} 起运，参考交运日期 ${luck.start}。按分钟折算：三天一岁。`:x.unknown?'时辰不详，暂不计算起运日期和大运。':'未指定传统男女排法，仅展示四柱；选择排法后可查看大运。';
    $('luck-timeline').innerHTML=luck?luck.periods.map((d,i)=>`<button type="button" class="luck-period" data-period="${i}" aria-label="查看${d.gz}大运，${d.startDate}起"><strong>${d.gz}</strong><span>${d.startYear}–${d.endYear}</span><em>${d.age}岁起</em></button>`).join(''):'';
    if(luck){const index=luck.periods.findIndex(d=>d.gz===current.detail.forecast.activePeriod?.gz&&d.startDate===current.detail.forecast.activePeriod?.startDate);renderPeriod(index>=0?index:0);}else $('period-detail').replaceChildren();
    $('warnings').innerHTML=current.warnings.map(w=>`<p>※ ${esc(w)}</p>`).join('');
  }
  function renderPeriod(index){
    const d=current.luck.periods[index],god=ZhiMing.shiShen(current.dayGan,d.gz[0]),info=ZhiMingAnalysis.GODS[god];
    const contacts=[];for(const p of current.pillars.filter(p=>p.gz))for(const [kind,pairs]of Object.entries(ZhiMingAnalysis.RELS))if(pairs.some(v=>v===d.gz[1]+p.zhi||v===p.zhi+d.gz[1]))contacts.push(`${d.gz[1]}与本命${p.label}${p.zhi}${kind}`);
    document.querySelectorAll('[data-period]').forEach(b=>{const on=+b.dataset.period===index;b.classList.toggle('selected',on);b.setAttribute('aria-pressed',String(on));});
    $('period-detail').innerHTML=`<h3>${d.gz}大运：${info.group}主题</h3><p class="period-date">${d.startDate} 至 ${d.endDate} 前 · 按交运日期分段</p><div class="analysis-evidence"><strong>运干依据</strong><p>${d.gz[0]}相对日主${current.dayGan}为${god}。${info.meaning}</p></div><p>这一阶段的传统取象：${info.strength} 需要同时检查的阻力：${info.risk}</p><p><strong>运支与原局：</strong>${esc(contacts.join('；')||'未命中本表六合、冲、害、破。')}。存在关系不表示必然发生某种事件，还要结合具体流年与现实条件。</p><div class="specific-action"><strong>阶段行动</strong><p>${info.task}</p></div>`;
  }
  $('luck-timeline').addEventListener('click',e=>{const b=e.target.closest('[data-period]');if(b)renderPeriod(+b.dataset.period);});
  $('change-year').addEventListener('click',()=>{const year=+$('analysis-year').value;if(!Number.isInteger(year)||year<1901||year>2099){toast('分析年份请填写1901–2099');return;}if(run({...current.input,analysisYear:year},isDemo)){renderReading('years');toast('流年解析已更新');}});
  function run(input,demo=false,scroll=false) {
    try {
      const next=ZhiMing.calculate(input);current=next;isDemo=demo;$('form-error').hidden=true;render();
      if(scroll){toast('命盘已更新，四柱与各项解读已生成');if(matchMedia('(max-width:600px)').matches)$('result').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'start'});}
      return true;
    } catch(e) {$('form-error').textContent=e.message||'排盘未完成，请检查输入。';$('form-error').hidden=false;return false;}
  }
  form.addEventListener('submit',e=>{e.preventDefault();run(readInput(),false,true);});
  document.querySelectorAll('[data-calendar]').forEach(b=>b.addEventListener('click',()=>{setCalendar(b.dataset.calendar);markDirty();}));
  $('month').addEventListener('change',updateDays);$('year').addEventListener('change',updateDays);
  $('unknown').addEventListener('change',()=>{$('time').disabled=$('unknown').checked;$('time').required=!$('unknown').checked;});
  $('city').addEventListener('change',()=>{if($('city').value==='custom'){document.querySelector('.advanced').open=true;$('longitude').focus();}else $('longitude').value=cityLongitudes[$('city').value];});
  function markDirty(){if(current)$('demo-badge').textContent='信息已修改 · 请重新排盘';}
  form.addEventListener('input',markDirty);form.addEventListener('change',markDirty);
  $('example').addEventListener('click',()=>{loadInput(sample);run(sample,true,true);});
  document.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>renderReading(b.dataset.tab)));
  document.querySelector('.tabs').addEventListener('keydown',e=>{
    const tabs=[...document.querySelectorAll('[data-tab]')],i=tabs.indexOf(document.activeElement);if(i<0)return;
    let n;if(e.key==='ArrowRight')n=(i+1)%tabs.length;else if(e.key==='ArrowLeft')n=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=tabs.length-1;else return;
    e.preventDefault();tabs[n].focus();renderReading(tabs[n].dataset.tab);
  });
  function showDialog(title,html){$('dialog-title').textContent=title;$('dialog-content').innerHTML=html;$('info-dialog').showModal();}
  document.querySelector('.close-dialog').addEventListener('click',()=>$('info-dialog').close());
  $('info-dialog').addEventListener('click',e=>{if(e.target===$('info-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
  $('method-trigger').addEventListener('click',()=>showDialog('排盘规则，一目了然','<h3>节气定年、定月</h3><p>年柱以立春交节瞬间为界，月柱以十二“节”的交节瞬间为界，月份不直接按农历月号计算。</p><h3>两种子时换日法</h3><p>默认 00:00 换日（早晚子时法，sect=2）。也可在进阶设置中选择 23:00 换日（子初法，sect=1）。不同流派的日柱与十神可能不同。</p><h3>时间与适用范围</h3><p>首版支持 1901–2099 年、UTC+8 地区。输入当地钟表时间，历史夏令时请手动勾选。近似真太阳时采用经度差与近似均时差，限日、时柱修正；临界情况应另行复核。</p><h3>解读如何产生</h3><p>依次分析月令、根气、透干、十神位置与组合线索，再逐项解释事业、资源、关系与流年。每项列明实际位置、解释与可验证的行动。五行图为数量图，格局线索不等于成格。</p><p><a href="#method" id="to-method">查看全部规则与来源 →</a></p>'));
  $('glossary-trigger').addEventListener('click',()=>showDialog('看懂你的四柱命盘','<h3>四柱与日主</h3><p>出生年、月、日、时各用一个天干与一个地支表示，合称四柱八字。日柱的天干为“日主”，是十神关系的参照点。</p><h3>十神</h3><p>十神由其他天干相对于日干的五行生克及阴阳关系计算。它们是传统关系符号，不是现实身份或好坏标签。</p><h3>藏干与纳音</h3><p>藏干是传统上配于地支内部的天干，本页依本气、中余气次序列出。纳音是六十甲子的传统分类名称，不替代日主五行。</p><h3>五行图</h3><p>每个可见的天干、地支各计一次，时辰完整时共 8 字；未知时辰则共 6 字。藏干不重复计入。数量高低不表示五行强弱。</p>'));
  $('dialog-content').addEventListener('click',e=>{if(e.target.id==='to-method')$('info-dialog').close();});
  const storageKey='zhiming.charts.v1';
  function savedCharts(){try{const data=JSON.parse(localStorage.getItem(storageKey)||'[]');return Array.isArray(data)?data.filter(s=>s&&typeof s.id==='string'&&s.input&&typeof s.input==='object').slice(0,20):[];}catch{return [];}}
  function updateCount() {document.querySelectorAll('.archive-count').forEach(n=>n.textContent=savedCharts().length);}
  $('save-chart').addEventListener('click',()=>{
    try {
      const saved=savedCharts(),input={...current.input};
      if(saved.some(s=>JSON.stringify(s.input)===JSON.stringify(input))){toast('这份命盘已保存在本机');return;}
      saved.unshift({id:crypto.randomUUID(),input,savedAt:new Date().toISOString()});localStorage.setItem(storageKey,JSON.stringify(saved.slice(0,20)));updateCount();toast('已保存到当前浏览器，可在“我的命盘”查看');
    }catch{toast('浏览器未允许本地保存，可用“导出完整解读”下载');}
  });
  function showArchive(){
    const saved=savedCharts();
    showDialog('我的命盘',`<p>仅保存在当前浏览器，最多 20 份。清除浏览器数据后不会保留，可导出文字报告另存。</p>${saved.length?saved.map(s=>`<div class="saved-item"><div><strong>${esc(s.input.nickname||'未命名命盘')}</strong><small>${s.input.calendar==='lunar'?'农历':'公历'} ${esc(s.input.year)}-${esc(s.input.month)}-${esc(s.input.day)} · ${s.input.unknown?'时辰不详':esc(s.input.time)} · ${esc(s.input.city)}</small></div><div class="saved-actions"><button type="button" data-load="${esc(s.id)}">查看</button><button type="button" data-delete="${esc(s.id)}">删除</button></div></div>`).join(''):'<p>尚未保存命盘。完成排盘后，点击命盘右上角的书签图标即可保存。</p>'}`);
  }
  document.querySelectorAll('.archive-trigger').forEach(b=>b.addEventListener('click',showArchive));
  $('dialog-content').addEventListener('click',e=>{
    const btn=e.target.closest('button');if(!btn)return;
    if(btn.dataset.load){const s=savedCharts().find(s=>s.id===btn.dataset.load);if(s){loadInput(s.input);if(run(s.input,false,true))$('info-dialog').close();else toast('此命盘数据无法载入，请检查输入。');}}
    if(btn.dataset.delete){try{localStorage.setItem(storageKey,JSON.stringify(savedCharts().filter(s=>s.id!==btn.dataset.delete)));updateCount();$('info-dialog').close();showArchive();toast('已删除这份本机命盘');}catch{toast('删除失败，请检查浏览器存储权限');}}
  });
  function eventText(e){return [`### ${e.year}年 · ${e.title}`,`具体表现：${e.result}`,`好在这里：${e.good}`,`成立条件：${e.condition}`,`可能的阻力：${e.risk}`,`年度范围：${e.when}。${e.scope}`,`线索层级：${e.basisScope}`,`依据：${e.evidence}`,`兑现标志：${e.check}`];}
  function reportText(){
    const c=current,x=c.input;
    return [`# 知命 2.1 · ${x.nickname||'四柱八字'}完整报告`,isDemo?'（示例命盘）':'',c.detail.events.note,c.detail.events.context,`公历：${c.original} UTC+8；${x.unknown?'时辰不详':`出生地：${x.city==='custom'?'自定义经度':x.city}`}`,`农历：${c.lunar}；日主：${c.profile[0]}`,`分析时点：${c.detail.forecast.referenceDate}；当时流年：${c.detail.forecast.activeYearGz}`,`换日法：${String(x.sect)==='1'?'23:00':'00:00'}；近似真太阳时：${x.trueSolar&&!x.unknown?'是':'否'}；夏令时减一小时：${x.dst&&!x.unknown?'是':'否'}`,`排盘标准时：${c.civil}；日时柱参考时间：${x.unknown?'未知':c.corrected}`,'## 四柱',...c.pillars.map(p=>`${p.label}：${p.gz?`${p.gz}；十神：${p.god}；藏干：${p.hidden.map(h=>h.gan+h.element+' '+h.god).join('、')}；纳音：${p.nayin}`:'未知'}`),'## 五行构成',ZhiMing.ELEMENTS.map(e=>`${e} ${c.counts[e]}`).join(' / '),'明面天干地支各计一次，藏干不重复计入；数量不等于旺衰。',...Object.values(c.readings).flatMap(r=>[`## ${r.title}`,r.lead,...(r.events||[]).flatMap(eventText),...r.blocks.flatMap(b=>[`### ${b.title}`,`依据：${b.evidence}`,b.text,...(b.action?[`具体做法：${b.action}`]:[])]),`参考：${sources[r.source].title} ${sources[r.source].url}`]),'## 十神位置表',...c.detail.gods.map(g=>`${g.god}：天干 ${g.visible.map(v=>v.where+v.gan).join('、')||'未见'}；藏干 ${g.hidden.map(v=>v.where+v.gan).join('、')||'未见'}`),'## 大运完整列表',...(c.luck?[`${c.luck.forward?'顺排':'逆排'}；出生后${c.luck.age}起运，交运参考 ${c.luck.start}。`,...c.luck.periods.map(d=>`${d.gz}：${d.startDate} 至 ${d.endDate} 前，${d.age}虚岁起；运干为${ZhiMing.shiShen(c.dayGan,d.gz[0])}`)]:['未计算大运。']),...c.warnings,'## 规则与出处','本版列月支本气、根气、透干、十神和干支关系，格局组合为条件线索；未按分日司令、全局合化和全部调候条目作最终格局定论。','排盘：6tail/lunar-javascript（MIT） https://github.com/6tail/lunar-javascript','典籍：《子平真诠·论十干得时不旺失时不弱》 https://www.chenshupaipan.com/books/5/3875.html','《滴天髓·寒暖论》 https://zh.wikisource.org/wiki/滴天髓/16','《穷通宝鉴》 https://zh.wikisource.org/wiki/穷通宝鉴','传统术数解读不是科学预测，健康内容不构成诊断。本报告含出生信息，请自行保管。'].join('\n\n');
  }
  $('print-report').addEventListener('click',()=>{const c=current;$('print-content').innerHTML=`<h1>知命 · ${esc(c.input.nickname||'四柱八字')}完整报告</h1><p>出生 ${esc(c.original)} UTC+8 · 分析时点 ${c.detail.forecast.referenceDate} · 四柱 ${c.pillars.map(p=>p.gz||'未知').join(' / ')}</p>${Object.values(c.readings).map(r=>`<article><h2>${esc(r.title)}</h2><p>${esc(r.lead)}</p>${(r.events||[]).map(e=>eventHtml(e).replace('<details class="event-proof">','<details class="event-proof" open>')).join('')}${r.blocks.map(blockHtml).join('')}</article>`).join('')}<p>传统术数文化解读，不构成科学预测或医疗诊断。</p>`;$('print-content').hidden=false;document.body.classList.add('printing');window.print();});
  window.addEventListener('afterprint',()=>{document.body.classList.remove('printing');$('print-content').hidden=true;});
  $('download').addEventListener('click',()=>{const blob=new Blob([reportText()],{type:'text/markdown;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`知命-${(current.input.nickname||'四柱八字').replace(/[<>:"/\\|?*\u0000-\u001f]/g,'')}-${current.original.slice(0,10)}.md`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('完整解读已导出，文件包含出生信息，请妥善保管');});
  function drawCompass(){
    const toPoint=(r,a)=>[200+r*Math.sin(a*Math.PI/180),200-r*Math.cos(a*Math.PI/180)];
    const textAt=(label,r,a,size,fill='#8f9b80')=>{const [x,y]=toPoint(r,a);return `<text x="${x}" y="${y}" transform="rotate(${a} ${x} ${y})" text-anchor="middle" dominant-baseline="central" font-size="${size}" fill="${fill}" font-family="SimSun,serif">${label}</text>`;};
    let svg='<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="compass-glow"><stop stop-color="#e2e5d4" stop-opacity=".65"/><stop offset="1" stop-color="#f6f3ec" stop-opacity="0"/></radialGradient></defs><circle cx="200" cy="200" r="198" fill="url(#compass-glow)"/>';
    [185,180,164,149,125,105,79,74].forEach((r,i)=>svg+=`<circle cx="200" cy="200" r="${r}" fill="none" stroke="${i===4?'#a5b198':'#c6cbb7'}" stroke-width="${i===4?'.8':'.65'}"/>`);
    for(let i=0;i<72;i++){const a=i*5,[x,y]=toPoint(180,a),[xx,yy]=toPoint(i%3===0?173:176,a);svg+=`<path d="M${x} ${y}L${xx} ${yy}" stroke="#aeb99e" stroke-width=".7"/>`;}
    const seasons=['立春','雨水','惊蛰','春分','清明','谷雨','立夏','小满','芒种','夏至','小暑','大暑','立秋','处暑','白露','秋分','寒露','霜降','立冬','小雪','大雪','冬至','小寒','大寒'];
    seasons.forEach((s,i)=>svg+=textAt(s,156,i*15,7,'#9da68d'));
    const branches='子丑寅卯辰巳午未申酉戌亥';
    [...branches].forEach((s,i)=>{svg+=textAt(s,137,i*30,11,'#859573');const [x,y]=toPoint(149,i*30+15),[xx,yy]=toPoint(125,i*30+15);svg+=`<path d="M${x} ${y}L${xx} ${yy}" stroke="#c7ccb7" stroke-width=".5"/>`;});
    ['坎','艮','震','巽','离','坤','兑','乾'].forEach((s,i)=>{
      const a=i*45;svg+=textAt(s,113,a,11,'#7c8b6b');
      const bits=['010','001','100','011','101','000','110','111'][i];
      svg+=`<g transform="rotate(${a} 200 200)" stroke="#8c9a78" stroke-width="2.4">`;
      [...bits].forEach((b,j)=>{const y=200-96+j*5;svg+=b==='1'?`<path d="M191 ${y}h18"/>`:`<path d="M191 ${y}h7m4 0h7"/>`;});svg+='</g>';
    });
    svg+='<circle cx="200" cy="200" r="61" fill="#e5e8d9" stroke="#bac5a9" stroke-width=".8"/><circle cx="200" cy="200" r="46" fill="#f1f1e6" stroke="#acb99b" stroke-width=".8"/><path d="M200 154a23 23 0 0 0 0 46 23 23 0 0 1 0 46 46 46 0 0 0 0-92" fill="#697e5b"/><circle cx="200" cy="177" r="5" fill="#f1f1e6"/><circle cx="200" cy="223" r="5" fill="#697e5b"/><path d="M200 3v12m0 370v12M3 200h12m370 0h12" stroke="#a0ad8d" stroke-width=".8"/>';
    ['水','木','火','金'].forEach((s,i)=>svg+=textAt(s,193,i*90,9,'#9ca78a'));
    $('compass').innerHTML=svg+'</svg>';
  }
  let installPrompt=null;
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;$('install-app').textContent='安装知命到此设备 ↗';});
  window.addEventListener('appinstalled',()=>{installPrompt=null;$('install-app').textContent='已安装到此设备';toast('知命已安装，可从主屏幕打开');});
  $('install-app').addEventListener('click',async()=>{if(installPrompt){const prompt=installPrompt;installPrompt=null;await prompt.prompt();await prompt.userChoice;}else showDialog('手机安装方式','<h3>Android / 电脑</h3><p>在 Chrome 或 Edge 中打开本站公开网址，从浏览器菜单选择“安装应用”或“添加到主屏幕”。</p><h3>iPhone / iPad</h3><p>用 Safari 打开本站网址，点分享，再选择“添加到主屏幕”。这是网页安装版（PWA），无需下载 APK。</p><h3>离线使用</h3><p>首次联网打开并完成缓存后，可以离线排盘。各设备独立保存命盘；没有云端同步个人记录。</p>');});
  $('update-app').addEventListener('click',()=>location.reload());
  const hadController=!!navigator.serviceWorker?.controller;
  navigator.serviceWorker?.addEventListener('controllerchange',()=>{if(hadController)$('update-banner').hidden=false;});
  const network=()=>{$('connection-state').textContent=navigator.onLine?'当前在线 · 网站与安装版共用解析引擎':'当前离线 · 使用已缓存版本';};
  window.addEventListener('online',network);window.addEventListener('offline',network);network();
  if('serviceWorker'in navigator&&location.protocol!=='file:')navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'}).catch(()=>{ $('connection-state').textContent='网站可用，离线缓存尚未就绪'; });
  drawCompass();updateCount();loadInput(sample);run(sample,true);
})();
