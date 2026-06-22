// AI Hustle — Main JS

// Google Analytics
(function(){
  var s=document.createElement('script');
  s.async=true;
  s.src='https://www.googletagmanager.com/gtag/js?id=G-HNVS8KTTEE';
  document.head.appendChild(s);
  window.dataLayer=window.dataLayer||[];
  function g(){dataLayer.push(arguments);}
  window.gtag=g;
  g('js',new Date());
  g('config','G-HNVS8KTTEE');
})();

var data=null;
var searchTimeout=null;
var currentFilter='all';

function loadData(){
  if(window.__DATA__){data=window.__DATA__;return data;}
  data={categories:[],methods:[]};
  return data;
}

function updateStats(){
  var tools=new Set();
  var platforms=new Set();
  data.methods.forEach(function(m){
    m.tools.forEach(function(t){tools.add(t);});
    m.platforms.forEach(function(p){platforms.add(p);});
  });
  setEl('statMethods',data.methods.length);
  setEl('statCategories',data.categories.length);
  setEl('statTools',tools.size+'+');
  setEl('statPlatforms',platforms.size+'+');
}
function setEl(id,v){var e=document.getElementById(id);if(e)e.textContent=v;}

document.addEventListener('DOMContentLoaded',function(){
  initMobileMenu();
  loadData();
  updateStats();
  renderCategories();
  renderMethods();
  initSearch();
  initFilters();
});

function initMobileMenu(){
  var t=document.querySelector('.mobile-toggle');
  var n=document.querySelector('.nav-links');
  if(!t||!n)return;
  t.addEventListener('click',function(){n.classList.toggle('open');});
}

function renderCategories(){
  var g=document.getElementById('catGrid');
  if(!g)return;
  g.innerHTML=data.categories.map(function(c){
    return '<a href="#category-'+c.id+'" class="cat-card" onclick="filterCategory(\''+c.id+'\')">'+
      '<span class="cat-icon">'+c.icon+'</span>'+
      '<div class="cat-info"><h3>'+c.name+'</h3><span>'+
        data.methods.filter(function(m){return m.category===c.id;}).length+' methods</span></div></a>';
  }).join('');
}

function methodCardHTML(m){
  var stars='★★★★☆';
  if(m.difficulty==='Easy')stars='★★☆☆☆';
  else if(m.difficulty==='Medium')stars='★★★☆☆';
  else stars='★★★★☆';
  return '<a href="method.html?id='+m.id+'" class="method-card" data-category="'+m.category+'">'+
    '<div class="method-card-inner">'+
    '<div class="method-header">'+
      '<span class="method-icon">'+m.icon+'</span>'+
      '<div class="method-meta">'+
        '<h3 class="method-title">'+m.title+'</h3>'+
        '<span class="method-difficulty">'+stars+' '+m.difficulty+'</span>'+
      '</div>'+
    '</div>'+
    '<p class="method-summary">'+m.summary.substring(0,180)+'...</p>'+
    '<div class="method-details">'+
      '<div class="detail-row"><span class="detail-label">Tools</span><span class="detail-value">'+m.tools.join(', ')+'</span></div>'+
      '<div class="detail-row"><span class="detail-label">Platforms</span><span class="detail-value">'+m.platforms.join(', ')+'</span></div>'+
    '</div>'+
    '</div></a>';
}

function renderMethods(filter){
  filter=filter||currentFilter;
  var g=document.getElementById('methodsGrid');
  if(!g)return;
  var methods=filter==='all'?data.methods:data.methods.filter(function(m){return m.category===filter;});
  g.innerHTML=methods.map(methodCardHTML).join('');
}

function initSearch(){
  var input=document.getElementById('searchInput');
  if(!input)return;
  input.addEventListener('input',function(){
    clearTimeout(searchTimeout);
    searchTimeout=setTimeout(function(){
      var q=input.value.toLowerCase().trim();
      if(!q){renderMethods();return;}
      var results=data.methods.filter(function(m){
        return m.title.toLowerCase().indexOf(q)>-1||
          m.summary.toLowerCase().indexOf(q)>-1||
          m.tools.some(function(t){return t.toLowerCase().indexOf(q)>-1;})||
          m.platforms.some(function(p){return p.toLowerCase().indexOf(q)>-1;});
      });
      document.getElementById('methodsGrid').innerHTML=results.map(methodCardHTML).join('');
    },200);
  });
}

function initFilters(){
  var btns=document.querySelectorAll('.filter-btn');
  btns.forEach(function(b){
    b.addEventListener('click',function(){
      btns.forEach(function(x){x.classList.remove('active');});
      b.classList.add('active');
      var cat=b.dataset.category;
      currentFilter=cat;
      renderMethods(cat);
    });
  });
}

function filterCategory(cat){
  currentFilter=cat;
  renderMethods(cat);
  document.querySelectorAll('.filter-btn').forEach(function(b){
    b.classList.remove('active');
    if(b.dataset.category===cat)b.classList.add('active');
  });
  document.getElementById('allMethods').scrollIntoView({behavior:'smooth'});
}
