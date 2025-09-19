const sample = [
  {name:'Sakshi Pandey', score:10, category:'senior'},
  {name:'Anshumaan Patnaik', score:8, category:'senior'},
  {name:'Aryan Sahu', score:10, category:'junior'},
  {name:'Amisha Parida', score:8, category:'junior'},
  {name:'Aryan Sahu', score:10, category:'optimal'},
  {name:'Mrinalee', score:6, category:'senior'},
  {name:'Sai Suman Hota', score:8, category:'junior'},
  {name:'Amisha Parida', score:8, category:'fastest'},
  {name:'Archit Samal', score:4, category:'senior'},
  {name:'Abhijeet Karua', score:8, category:'junior'},
  {name:'Akriti Anmol Raj', score:4, category:'junior'},
  {name:'Sana Dutta', score:6, category:'junior'},
  {name:'Satwik Roy', score:4, category:'junior'}
];

const leaderboardEl = document.getElementById('leaderboard');
const tabs = document.querySelectorAll('.tab');
const cats = document.querySelectorAll('.cat');

let activeCat = 'all';
let data = sample.slice();

function render(list){
  leaderboardEl.innerHTML = '';
  list.forEach((it,i)=>{
    const row = document.createElement('div'); 
    row.className='row';
    row.innerHTML = `
      <div class="rank">#${i+1}</div>
      <div class="meta">
        <div class="name">${it.name}</div>
        <div class="details">${it.categories?.join(' / ') || it.category.toUpperCase()}</div>
      </div>
      <div class="stat">${it.score} points</div>
    `;
    leaderboardEl.appendChild(row);
  });

  // animate rows in
  gsap.from('.row',{y:18,opacity:0,stagger:0.06,duration:0.6,ease:'power3.out'});
}

// initial render
data.sort((a,b)=>b.score-a.score);
applyFilter();

// tab clicks
tabs.forEach(t=>t.addEventListener('click',()=>{
  tabs.forEach(x=>x.classList.remove('active'));
  t.classList.add('active');
  activeCat = t.dataset.cat;
  applyFilter();
}));

cats.forEach(c=>c.addEventListener('click',()=>{
  const cat = c.dataset.cat; 
  activeCat = cat;
  tabs.forEach(x=>x.classList.remove('active'));
  const matching = Array.from(tabs).find(x=>x.dataset.cat===cat);
  if(matching) matching.classList.add('active');
  applyFilter();
}));

// sorting and sidebar actions
document.querySelector('[data-action="sort-score"]').addEventListener('click',()=>{
  data.sort((a,b)=>b.score-a.score); 
  applyFilter();
});

document.querySelector('[data-action="export"]').addEventListener('click',()=>exportCSV(data));

document.getElementById('shuffleBtn').addEventListener('click',()=>{
  data = shuffle(data); 
  applyFilter();
});

document.getElementById('refreshBtn').addEventListener('click',()=>{
  gsap.fromTo('.panel',{scale:0.995},{scale:1,duration:0.4,ease:'elastic.out(1,0.6)'});
});

// apply filter + always sort by score
function applyFilter(){
  let list = data.slice();

  if(activeCat !== 'all'){
    // filter by specific category
    list = list.filter(x=>x.category===activeCat);
  } else {
    // merge duplicates for "all" tab
    const map = new Map();
    list.forEach(p=>{
      if(map.has(p.name)){
        const existing = map.get(p.name);
        // keep highest score
        if(p.score > existing.score){
          map.set(p.name, {...p, categories: mergeCategories(existing, p)});
        } else {
          existing.categories = mergeCategories(existing, p);
          map.set(p.name, existing);
        }
      } else {
        map.set(p.name, {...p, categories:[p.category.toUpperCase()]});
      }
    });
    list = Array.from(map.values());
  }

  // always sort by score descending
  list.sort((a,b)=>b.score-a.score);
  render(list);
}

function mergeCategories(a,b){
  const set = new Set([...(a.categories||[a.category.toUpperCase()]), b.category.toUpperCase()]);
  return Array.from(set);
}

function shuffle(a){
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]]
  }
  return a;
}

function exportCSV(arr){
  const rows = [['Name','Score','Category'], ...arr.map(r=>[r.name,`${r.score} points`,r.categories?.join(' / ') || r.category])];
  const csv = rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv],{type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); 
  a.href=url;
  a.download='codeupfriday_leaderboard.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
