(function(){
  document.querySelectorAll('.peek').forEach(function(peek){
    var shots = peek.closest('.proj, .feature').querySelector('.shots');
    if(!shots) return;
    var srcs = Array.from(shots.querySelectorAll('img'));
    var stage = peek.querySelector('.stage'), dots = peek.querySelector('.dots'), label = peek.querySelector('.label');
    srcs.forEach(function(img, i){
      var c = img.cloneNode(); c.className = i===0 ? 'on' : ''; stage.appendChild(c);
      var d = document.createElement('i'); if(i===0) d.className='on'; dots.appendChild(d);
    });
    var imgs = Array.from(stage.children), ds = Array.from(dots.children), idx = 0, timer = null, pinned = false;
    function show(i){
      idx = (i + imgs.length) % imgs.length;
      imgs.forEach(function(el,k){ el.classList.toggle('on', k===idx); });
      ds.forEach(function(el,k){ el.classList.toggle('on', k===idx); });
      label.textContent = imgs[idx].alt + ' — ' + (idx+1) + '/' + imgs.length;
    }
    function open(){ peek.classList.add('open'); show(idx); clearInterval(timer); timer = setInterval(function(){ show(idx+1); }, 1800); }
    function close(){ if(pinned) return; peek.classList.remove('open'); clearInterval(timer); }
    peek.addEventListener('mouseenter', open);
    peek.addEventListener('mouseleave', close);
    stage.addEventListener('mousemove', function(e){
      var r = stage.getBoundingClientRect(), i = Math.floor((e.clientX - r.left) / r.width * imgs.length);
      if(i !== idx){ show(i); clearInterval(timer); timer = setInterval(function(){ show(idx+1); }, 1800); }
    });
    peek.querySelector('a').addEventListener('click', function(e){
      e.preventDefault(); pinned = !pinned;
      if(pinned) open(); else { peek.classList.remove('open'); clearInterval(timer); }
    });
    document.addEventListener('keydown', function(e){ if(e.key==='Escape'){ pinned=false; close(); } });
    document.addEventListener('click', function(e){ if(pinned && !peek.contains(e.target)){ pinned=false; close(); } });
    show(0);
  });
})();

(function(){
  var root = document.documentElement, header = document.querySelector('header.top');

  // thème clair / sombre, mémorisé
  document.querySelector('.theme').addEventListener('click', function(){
    var dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
    try{ localStorage.setItem('theme', root.dataset.theme); }catch(e){}
  });

  // bordure de l'en-tête au défilement
  function onScroll(){ header.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  if(!('IntersectionObserver' in window)) return;

  // lien de navigation actif
  var links = {};
  document.querySelectorAll('header.top nav a[href^="#"]').forEach(function(a){ links[a.getAttribute('href').slice(1)] = a; });
  var spy = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting && links[e.target.id]){
        Object.keys(links).forEach(function(k){ links[k].classList.toggle('active', k === e.target.id); });
      }
    });
  }, {rootMargin:'-45% 0px -50% 0px'});
  document.querySelectorAll('section[id]').forEach(function(s){ spy.observe(s); });

  // apparition douce des blocs
  var items = document.querySelectorAll('.feature, .proj, .row, .skills > div');
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {rootMargin:'0px 0px -8% 0px'});
  items.forEach(function(el){ el.classList.add('reveal'); io.observe(el); });
})();
