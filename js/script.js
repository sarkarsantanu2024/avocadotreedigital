// sticky nav
  const nav=document.getElementById('nav');
  addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>30));

  // (A) <-> (H) toggle - the signature
  const ah=document.getElementById('ah');
  const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  if(!reduce){
    let showH=true;
    setInterval(()=>{showH=!showH;ah.textContent=showH?'H':'A';},2600);
  }
  document.getElementById('toggle').addEventListener('mouseenter',()=>{
    ah.textContent = ah.textContent==='A'?'H':'A';
  });

  // scroll reveal
  const io=new IntersectionObserver((es)=>{
    es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
  },{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  // ---- gated pricing ----
  const grid=document.getElementById('priceGrid');
  grid.classList.add('locked');           // JS on => enforce the gate
  const gForm=document.getElementById('gateForm');
  const gErr=document.getElementById('gateErr');
  const uRow=document.getElementById('unlockedRow');
  const dBtn=document.getElementById('downloadBtn');

  function buildGuide(name,company){
    const lines=[
      '(A)Intelligent Growth System - Pricing Guide',
      'Avocado Tree Digital',
      'Prepared for: '+name+' ('+company+')',
      '',
      'Every tier includes an AI digital strategy, a 12-month roadmap,',
      'and live AI agents in production. Human-in-the-loop on critical actions.',
      '',
      'FOUNDATION GROWTH  |  $6,500 to $8,500 / month',
      '  Target: +15% website conversion',
      '  - AI digital strategy & 12-month roadmap',
      '  - 2 core AI agents deployed & managed',
      '  - Website management & automation',
      '  - Monthly strategic check-ins',
      '',
      'PERFORMANCE GROWTH  |  $10,000 to $14,000 / month',
      '  Target: +25% qualified pipeline',
      '  - Multi-channel growth & AI strategy execution',
      '  - 6 AI agents across marketing & sales',
      '  - Conversion rate optimisation programme',
      '  - Weekly execution sprints & reviews',
      '',
      'GROWTH ELITE  |  $15,000 to $20,000 / month',
      '  Target: +30% YoY revenue growth',
      '  - Custom AI agent fleet & orchestration layer',
      '  - Enterprise AI strategy, governance & enablement',
      '  - Dedicated growth lead & proprietary models',
      '  - Cross-functional team alignment',
      '',
      'Book a strategy call: hello@avocadotreedigital.com',
      'avocadotreedigital.com'
    ];
    return new Blob([lines.join('\n')],{type:'text/plain'});
  }

  gForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const f=new FormData(gForm);
    const name=(f.get('name')||'').toString().trim();
    const email=(f.get('email')||'').toString().trim();
    const company=(f.get('company')||'').toString().trim();
    const emailOk=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if(!name||!company||!emailOk){
      gErr.textContent = !name?'Please enter your name.'
        : !emailOk?'Please enter a valid work email.'
        : 'Please enter your company.';
      return;
    }
    gErr.textContent='';
    // TODO: POST {name,email,company} to your CRM / form endpoint here.
    dBtn.href=URL.createObjectURL(buildGuide(name,company));
    grid.classList.remove('locked');
    uRow.hidden=false;
    uRow.scrollIntoView({behavior:'smooth',block:'center'});
  });

  // count-up stats
  const cio=new IntersectionObserver((es)=>{
    es.forEach(e=>{
      if(!e.isIntersecting)return;
      const el=e.target,to=+el.dataset.to,suf=el.dataset.suffix||'',pre=el.textContent.trim().startsWith('+')?'+':'';
      let n=0,step=Math.max(1,Math.round(to/28));
      const t=setInterval(()=>{n+=step;if(n>=to){n=to;clearInterval(t);}el.textContent=pre+n+suf;},26);
      cio.unobserve(el);
    });
  },{threshold:.5});
  document.querySelectorAll('.num').forEach(el=>cio.observe(el));
