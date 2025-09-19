    const sample = [
      {name:'Sakshi Pandey', score:10, time:'00:42:13', category:'senior', remark:'Optimal'},
      {name:'Anshuman Patnaik', score:8, time:'00:38:09', category:'senior', remark:'Fastest'},
      {name:'Aryan Sahu', score:10, time:'00:45:21', category:'junior', remark:'Optimal'},
      {name:'Amisha Parida', score:8, time:'00:37:45', category:'junior', remark:'Fastest'},
      {name:'Aryan Sahu', score:10, time:'00:46:10', category:'optimal', remark:'Best Complexity'},
      {name:'Mrinalee', score:6, time:'00:41:07', category:'senior', remark:'Clean Code'},
      {name:'Sai Suman Hota', score:8, time:'00:50:30', category:'junior', remark:'Good Effort'},
      {name:'Amisha Parida', score:8, time:'00:35:12', category:'fastest', remark:'Lightning'},
      {name:'Archit Samal', score:4, time:'00:55:00', category:'senior', remark:'Edgecases'},
      {name:'Abhijeet Karua', score:8, time:'00:44:22', category:'junior', remark:'Readable'},
      {name:'Akriti Anmol Raj', score:4, time:'00:44:22', category:'junior', remark:'Readable'},
      {name:'Sana Dutta', score:6, time:'00:44:22', category:'junior', remark:'Readable'},
      {name:'Satwik Roy', score:4, time:'00:44:22', category:'junior', remark:'Readable'},
    ];

    const leaderboardEl = document.getElementById('leaderboard');
    const tabs = document.querySelectorAll('.tab');
    const cats = document.querySelectorAll('.cat');

    let activeCat = 'all';
    let data = sample.slice();

    function render(list){
      leaderboardEl.innerHTML = '';
      list.forEach((it,i)=>{
        const row = document.createElement('div'); row.className='row';
        row.innerHTML = `
          <div class="rank">#${i+1}</div>
          <div class="meta">
            <div class="name">${it.name}</div>
            <div class="details">${it.category.toUpperCase()} · ${it.remark}</div>
          </div>
          <div class="stat">${it.score}</div>
        `;
        leaderboardEl.appendChild(row);
      });

      // animate rows in
      gsap.from('.row',{y:18,opacity:0,stagger:0.06,duration:0.6,ease:'power3.out'});
    }

    // initial render
    data.sort((a,b)=>b.score-a.score);
    render(data);

    // tab clicks
    tabs.forEach(t=>t.addEventListener('click',()=>{
      tabs.forEach(x=>x.classList.remove('active'));
      t.classList.add('active');
      activeCat = t.dataset.cat;
      applyFilter();
    }));

    cats.forEach(c=>c.addEventListener('click',()=>{
      const cat = c.dataset.cat; activeCat = cat;
      tabs.forEach(x=>x.classList.remove('active'));
      const matching = Array.from(tabs).find(x=>x.dataset.cat===cat);
      if(matching) matching.classList.add('active');
      applyFilter();
    }));

    // sorting and sidebar actions
    document.querySelector('[data-action="sort-score"]').addEventListener('click',()=>{
      data.sort((a,b)=>b.score-a.score); applyFilter();
    });
    document.querySelector('[data-action="sort-time"]').addEventListener('click',()=>{
      data.sort((a,b)=>parseTime(a.time)-parseTime(b.time)); applyFilter();
    });
    document.querySelector('[data-action="export"]').addEventListener('click',()=>exportCSV(data));

    document.getElementById('shuffleBtn').addEventListener('click',()=>{
      data = shuffle(data); applyFilter();
    });
    document.getElementById('refreshBtn').addEventListener('click',()=>{
      // small pulse to indicate refresh
      gsap.fromTo('.panel',{scale:0.995},{scale:1,duration:0.4,ease:'elastic.out(1,0.6)'});
      // in real usage you'd re-fetch the data here
    });

    function applyFilter(){
      let list = data.slice();
      if(activeCat !== 'all') list = list.filter(x=>x.category===activeCat);
      // stabilize sort: score desc
      list.sort((a,b)=>b.score-a.score);
      render(list);
    }

    function parseTime(t){ // HH:MM:SS
      const p = t.split(':').map(Number); return p[0]*3600 + p[1]*60 + p[2];
    }

    function shuffle(a){
      for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}
      return a;
    }

    function exportCSV(arr){
      const rows = [['Name','Score','Time','Category','Remark'], ...arr.map(r=>[r.name,r.score,r.time,r.category,r.remark])];
      const csv = rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
      const blob = new Blob([csv],{type:'text/csv;charset=utf-8;'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href=url;a.download='codeupfriday_leaderboard.csv';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
    }

    // small entrance animation
    gsap.from('header .logo',{scale:0,rotation:30,duration:0.7,delay:0.08,ease:'back.out(1.7)'});
    gsap.from('header h1',{y:-18,opacity:0,duration:0.7,delay:0.12,ease:'power3.out'});
    gsap.from('.tabs .tab',{y:6,opacity:0,duration:0.5,stagger:0.05,delay:0.2});

    // keyboard quickswitch: 1..5 for tabs
    window.addEventListener('keydown',e=>{
      if(e.key>='1' && e.key<='5'){
        const idx = Number(e.key)-1; if(tabs[idx]) tabs[idx].click();
      }
    });