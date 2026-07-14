// slide data used for the sidebar thumbnails and nav counter
const SLIDES = [
  { id:'intro',    title:'Intro',                 grad:['#1A73E8','#bee2c7'] },
  { id:'project-1',title:'Project 1 · 3D Viewer',  grad:['#14181d','#2b3542'] },
  { id:'project-2',title:'Project 2',              grad:['#EA4335','#F9AB00'] },
  { id:'project-3',title:'Project 3',              grad:['#673AB7','#1A73E8'] },
  { id:'project-4',title:'Project 4',              grad:['#0B8043','#34A853'] },
  { id:'project-5',title:'Project 5',              grad:['#F4511E','#F9AB00'] },
];

let current = 0;

const sidebar = document.getElementById('sidebar');
SLIDES.forEach((s, i) => {
  const wrap = document.createElement('div');
  wrap.className = 'thumb-wrap';
  wrap.innerHTML = `
    <div class="thumb-num">${i+1}</div>
    <div class="thumb" data-index="${i}">
      <div class="thumb-fill" style="background:linear-gradient(135deg,${s.grad[0]},${s.grad[1]})">
        ${i===0
          ? `<div class="thumb-circle" style="left:10%;top:32%;"></div>
             <div class="thumb-bar" style="top:70%;left:44%;width:44%;background:rgba(255,255,255,.95);"></div>`
          : `<div class="thumb-bar" style="top:16%;width:50%;"></div>
             <div class="thumb-bar" style="top:34%;width:30%;height:6%;background:rgba(255,255,255,.5);"></div>
             <div class="thumb-fill" style="position:absolute;left:6%;top:48%;width:36%;height:42%;background:rgba(255,255,255,.85);border-radius:2px;"></div>`
        }
      </div>
    </div>`;
  wrap.querySelector('.thumb').addEventListener('click', () => goTo(i));
  sidebar.appendChild(wrap);
});

function editableTools(defaults){
  return defaults.map(t => `<span class="tool-chip" contenteditable="true" spellcheck="false">${t}</span>`).join('');
}

// 3D viewer panel - wrapId/emptyId must match what viewer.js looks for
function viewerBlock(wrapId, emptyId, hint){
  return `
    <div class="proj-media" style="width:44%;padding:0;cursor:default;">
      <div class="viewer-wrap" id="${wrapId}">
        <div class="viewer-empty" id="${emptyId}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><path d="M3.27 6.96L12 12l8.73-5.04M12 22.08V12"/></svg>
          <b>No model loaded</b>
          <span>${hint}</span>
        </div>
        <div class="viewer-hint">drag to orbit · scroll to zoom</div>
      </div>
    </div>`;
}

// split panel: 3D viewer fills the top half, an image slot fills the bottom half.
// wrapId/emptyId must match what viewer.js looks for. Set the <img> src in the
// bottom half to add your own picture, then remove its inline display:none.
function splitViewerImageBlock(wrapId, emptyId, hint){
  return `
    <div class="proj-media split-media">
      <div class="split-top">
        <div class="viewer-wrap" id="${wrapId}">
          <div class="viewer-empty" id="${emptyId}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><path d="M3.27 6.96L12 12l8.73-5.04M12 22.08V12"/></svg>
            <b>No model loaded</b>
            <span>${hint}</span>
          </div>
          <div class="viewer-hint">drag to orbit · scroll to zoom</div>
        </div>
      </div>
      <div class="split-bottom">
        <img alt="" src="public/CustomDisplay.png">
      </div>
    </div>`;
}

// project image - set the src on the <img> tag below to swap in your own picture,
// and remove the inline style="display:none" once you do
function mediaBlock(tag){
  return `
    <div class="proj-media">
      <span class="media-tag">${tag}</span>
      <img alt="" style="display:none">
      <div class="media-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="10" r="1.5"/><path d="M21 16l-5-5-6 6"/></svg>
        <span>No image set</span>
      </div>
    </div>`;
}

const stage = document.getElementById('stage');

stage.innerHTML = `
  <div class="slide active" data-index="0">
    <div class="intro-slide">
      <div class="intro-left">
        <div class="photo-circle">
          <!-- set src below to add a profile photo, then drop the display:none -->
          <img alt="" src="public/henryface.jpg">
          <svg class="ph-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>
        </div>
        <div class="name-pill" contenteditable="true" spellcheck="false">Henry Zhang</div>
        <div class="intro-tagline" contenteditable="true" spellcheck="false">I like food, <br> but also more professional interests in this site.</div>
      </div>
      <div class="intro-right">
        <span class="eyebrow">Portfolio</span>
        <div class="intro-title" contenteditable="true" spellcheck="false">Hi, I'm <br>Henry Zhang</div>
        <div class="intro-subtitle" contenteditable="true" spellcheck="false">University of Texas @ Austin <br> BS in Electrical + Computer Engineering</div>
        <div class="intro-desc" contenteditable="true" spellcheck="false">Outside of the professional world, I like to cook, play sports, go hiking, <br>and I'm also not short, which is pretty cool.</div>
        <div class="intro-links">
          <span class="link-chip" contenteditable="true" spellcheck="false">henry.zhang@utexas.edu</span>
          <span class="link-chip" contenteditable="true" spellcheck="false">linkedin.com/in/hzhang-y</span>
        </div>
      </div>
    </div>
  </div>

  <div class="slide" data-index="1">
    <div class="project-slide">
      ${splitViewerImageBlock('viewerWrap', 'viewerEmpty', 'Set MODEL_PATH_PROJECT_1 in viewer.js to point at your .glb file.')}
      <div class="proj-body">
        <span class="eyebrow">01 — Longhorns Racing</span>
        <div class="proj-title" contenteditable="true" spellcheck="false">Custom Display-PCB</div>
        <div class="proj-role" contenteditable="true" spellcheck="false">Created to replace former factory-made racing equipment</div>
        <div class="proj-desc" contenteditable="true" spellcheck="false">- Reverse-engineered an STM32U5-based Riverdi display to enable development of a custom vehicle display system,
decreased bill of materials cost by $850 and improved power consumption efficiency by 40%
        <br> - Designed the schematic for a custom display PCB, utilizing OCTOSPI/SPI for external flash/DRAM
communication, FDCAN for data acquisition, and LTDC for real-time graphics output
        <br> - Developed a 12V buck-boost converter to drive the display backlight, ensuring stable operation under fluctuating
automotive power conditions</div>
        <span class="proj-desc-label">Tools used</span>
        <div class="tools-row" id="tools-1">${editableTools(['PCB/Hardware Design + Validation','STM32 MCU Interfacing','C/C++'])}</div>
      </div>
    </div>
    <div class="slide-num-mark">01 / 06</div>
  </div>

  <div class="slide" data-index="2">
    <div class="project-slide">
      ${mediaBlock('Image')}
      <div class="proj-body">
        <span class="eyebrow">02</span>
        <div class="proj-title" contenteditable="true" spellcheck="false">Project Two</div>
        <div class="proj-role" contenteditable="true" spellcheck="false">Role or project type</div>
        <div class="proj-desc" contenteditable="true" spellcheck="false">This is a sample text. Insert your desired description here — what you built, why it mattered, and the impact it had.</div>
        <span class="proj-desc-label">Tools used</span>
        <div class="tools-row" id="tools-2">${editableTools(['Figma','React','Node.js'])}</div>
      </div>
    </div>
    <div class="slide-num-mark">02 / 06</div>
  </div>

  <div class="slide" data-index="3">
    <div class="project-slide">
      ${viewerBlock('viewerWrap2', 'viewerEmpty2', 'Set MODEL_PATH_PROJECT_3 in viewer.js to point at your .glb file.')}
      <div class="proj-body">
        <span class="eyebrow">03</span>
        <div class="proj-title" contenteditable="true" spellcheck="false">Project Three</div>
        <div class="proj-role" contenteditable="true" spellcheck="false">Interactive 3D Model Viewer</div>
        <div class="proj-desc" contenteditable="true" spellcheck="false">Describe this project here — the problem, your approach, and the outcome. The panel on the left renders your 3D model directly in the browser.</div>
        <span class="proj-desc-label">Tools used</span>
        <div class="tools-row" id="tools-3">${editableTools(['Sketch','Swift','Firebase'])}</div>
      </div>
    </div>
    <div class="slide-num-mark">03 / 06</div>
  </div>

  <div class="slide" data-index="4">
    <div class="project-slide">
      ${mediaBlock('Image')}
      <div class="proj-body">
        <span class="eyebrow">04</span>
        <div class="proj-title" contenteditable="true" spellcheck="false">Project Four</div>
        <div class="proj-role" contenteditable="true" spellcheck="false">Role or project type</div>
        <div class="proj-desc" contenteditable="true" spellcheck="false">This is a sample text. Insert your desired description here — what you built, why it mattered, and the impact it had.</div>
        <span class="proj-desc-label">Tools used</span>
        <div class="tools-row" id="tools-4">${editableTools(['Python','Pandas','Plotly'])}</div>
      </div>
    </div>
    <div class="slide-num-mark">04 / 06</div>
  </div>

  <div class="slide" data-index="5">
    <div class="project-slide">
      ${mediaBlock('Image')}
      <div class="proj-body">
        <span class="eyebrow">05</span>
        <div class="proj-title" contenteditable="true" spellcheck="false">Project Five</div>
        <div class="proj-role" contenteditable="true" spellcheck="false">Role or project type</div>
        <div class="proj-desc" contenteditable="true" spellcheck="false">This is a sample text. Insert your desired description here — what you built, why it mattered, and the impact it had.</div>
        <span class="proj-desc-label">Tools used</span>
        <div class="tools-row" id="tools-5">${editableTools(['After Effects','Cinema 4D'])}</div>
      </div>
    </div>
    <div class="slide-num-mark">05 / 06</div>
  </div>
`;

const slideEls = [...document.querySelectorAll('.slide')];
const thumbEls = [...document.querySelectorAll('.thumb')];
const navCount = document.getElementById('navCount');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

function goTo(i){
  current = Math.max(0, Math.min(SLIDES.length - 1, i));
  slideEls.forEach(el => el.classList.toggle('active', +el.dataset.index === current));
  thumbEls.forEach(el => el.classList.toggle('active', +el.dataset.index === current));
  navCount.textContent = `${current+1} / ${SLIDES.length}`;
  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === SLIDES.length - 1;
  thumbEls[current]?.scrollIntoView({ block:'nearest' });
}
thumbEls[0].classList.add('active');
prevBtn.addEventListener('click', () => goTo(current - 1));
nextBtn.addEventListener('click', () => goTo(current + 1));

document.addEventListener('keydown', (e) => {
  if (document.activeElement && document.activeElement.isContentEditable) return;
  if (e.key === 'ArrowRight' || e.key === 'PageDown') goTo(current + 1);
  if (e.key === 'ArrowLeft' || e.key === 'PageUp') goTo(current - 1);
  if (e.key === 'Escape') exitPresentMode();
});

const appEl = document.getElementById('app');
document.getElementById('slideshowBtn').addEventListener('click', enterPresentMode);
document.getElementById('exitPresent').addEventListener('click', exitPresentMode);

function enterPresentMode(){
  appEl.classList.add('presenting');
  document.documentElement.requestFullscreen?.().catch(()=>{});
}
function exitPresentMode(){
  if (!appEl.classList.contains('presenting')) return;
  appEl.classList.remove('presenting');
  if (document.fullscreenElement) document.exitFullscreen?.();
}
document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement) appEl.classList.remove('presenting');
});

function addTool(btn){
  const chip = document.createElement('span');
  chip.className = 'tool-chip';
  chip.contentEditable = 'true';
  chip.spellcheck = false;
  chip.textContent = 'New tool';
  btn.parentElement.insertBefore(chip, btn);
  chip.focus();
  document.execCommand('selectAll', false, null);
}
window.addTool = addTool;