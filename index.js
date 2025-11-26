const sample = [
  { name: "Mrinalee Mishra", score: 44, category: "senior" },
  { name: "Archita Samal", score: 20, category: "senior" },
  { name: "Priyanshu Pati", score: 10, category: "senior" },
  { name: "Dua Rajat", score: 10, category: "senior" },
  { name: "Sakshi Pandey", score: 10, category: "senior" },
  { name: "Ansumaan Patnaik", score: 8, category: "senior" },
  
  { name: "Aryan Sahu", score: 32, category: "junior" },
  { name: "Sai Suman Hota", score: 32, category: "junior" },
  { name: "Vidushi Agarwal", score: 30, category: "junior" },
  { name: "Sana Dutta", score: 14, category: "junior" },
  { name: "Satwik Roy", score: 14, category: "junior" },
  { name: "Amisha Parida", score: 12, category: "junior" },
  { name: "Akriti Anmol Raj", score: 12, category: "junior" },
  { name: "Mehul Bhojak", score: 8, category: "junior" },
  { name: "Abhijeet Karua", score: 8, category: "junior" },
  { name: "Archisman Ghatak", score: 6, category: "junior" },
  { name: "Devansh Mishra", score: 6, category: "junior" },
  { name: "Ankita Patra", score: 4, category: "junior" },

  { name: "Mrinalee Mishra", score: 44, category: "optimal" },
  { name: "Vidushi Agarwal", score: 30, category: "optimal" },

  { name: "Mrinalee Mishra", score: 44, category: "fastest" },
  { name: "Sai Suman Hota", score: 32, category: "fastest" }
];

const leaderboardEl = document.getElementById('leaderboard');
const tabs = document.querySelectorAll('.tab');
const cats = document.querySelectorAll('.cat');

let activeCat = 'all';
let data = sample.slice();

function render(list){
  leaderboardEl.innerHTML = '';

  // assign ranks with ties (dense ranking: 1,2,2,3,4,4)
  let lastScore = null;
  let lastRank = 0;

  list.forEach((it, i) => {
    if (it.score !== lastScore) {
      lastRank++; // increase only when score changes
      lastScore = it.score;
    }

    const row = document.createElement('div'); 
    row.className='row';
    row.innerHTML = `
      <div class="rank">#${lastRank}</div>
      <div class="meta">
        <div class="name">${it.name}</div>
        <div class="details">${it.categories?.join(' / ') || it.category.toUpperCase()}</div>
      </div>
      <div class="stat">${it.score} points</div>
    `;
    leaderboardEl.appendChild(row);
  });

  // animate rows in
  // animate rows in with a premium feel
  gsap.fromTo('.row', 
    { y: 30, opacity: 0, scale: 0.95, rotationX: -10 },
    { y: 0, opacity: 1, scale: 1, rotationX: 0, stagger: 0.08, duration: 0.8, ease: 'power3.out', clearProps: 'all' }
  );
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

// Update category counts
function updateCategoryCounts() {
  const counts = {
    senior: 0,
    junior: 0,
    optimal: 0,
    fastest: 0
  };

  sample.forEach(p => {
    if (counts[p.category] !== undefined) {
      counts[p.category]++;
    }
  });

  document.querySelectorAll('.cat').forEach(catEl => {
    const catKey = catEl.dataset.cat;
    const countEl = catEl.querySelector('.ccount');
    if (countEl && counts[catKey] !== undefined) {
      countEl.textContent = counts[catKey];
    }
  });
}

updateCategoryCounts();
