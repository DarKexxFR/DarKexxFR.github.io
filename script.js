(function(){
  document.querySelectorAll('.peek').forEach(function(peek){
    var shots = peek.closest('.proj').querySelector('.shots');
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
