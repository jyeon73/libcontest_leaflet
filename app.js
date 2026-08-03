const map = L.map('map').setView([37.5665, 126.9780], 12);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
  maxZoom: 19
}).addTo(map);

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function getRepresentativeImage(p) {
  if (!p.eras) return null;
  for (const era of p.eras) {
    const item = era.items.find(it => it.representative && it.image);
    if (item) return item.image;
  }
  return null;
}

function createIcon(p) {
  if (!p.emblem) return redIcon;
  const star = isFavorite(p.name) ? '<span class="fav-star">⭐</span>' : '';
  const repImage = getRepresentativeImage(p);
  const preview = repImage ? `<img class="marker-hover-preview" src="${repImage}" alt="${p.name} 대표이미지" />` : '';
  return L.divIcon({
    className: 'emblem-marker',
    html: `<div class="emblem-wrap"><div class="emblem-bg"></div><img src="${p.emblem}" class="emblem-img" alt="${p.name}" />${star}<span class="emblem-label">${p.name}</span>${preview}</div>`,
    iconSize: [58, 58],
    iconAnchor: [29, 29],
    popupAnchor: [0, -29]
  });
}

let currentIndex = 0;
let currentPlaceName = '';

// 즐겨찾기 관리
function getFavorites() {
  const saved = localStorage.getItem('favoritePlaces');
  return saved ? JSON.parse(saved) : [];
}
function isFavorite(name) {
  return getFavorites().includes(name);
}
function toggleFavorite(name) {
  let favorites = getFavorites();
  if (favorites.includes(name)) {
    favorites = favorites.filter(f => f !== name);
  } else {
    favorites.push(name);
  }
  localStorage.setItem('favoritePlaces', JSON.stringify(favorites));
}

// 메모 관리
function getNotes() {
  const saved = localStorage.getItem('placeNotes');
  return saved ? JSON.parse(saved) : {};
}
function getNote(name) {
  return getNotes()[name] || '';
}
function saveNote(name, text) {
  const notes = getNotes();
  notes[name] = text;
  localStorage.setItem('placeNotes', JSON.stringify(notes));
}

function updateTooltip(marker, p) {
  const star = isFavorite(p.name) ? '⭐' : '';
  marker.unbindTooltip();
  marker.bindTooltip(`${star}${p.emoji}`, {
    permanent: true,
    direction: 'top',
    offset: [0, -10],
    className: 'emblem-tooltip'
  });
}

function updateMarkerAppearance(marker, p) {
  if (p.emblem) {
    marker.setIcon(createIcon(p));
  } else {
    updateTooltip(marker, p);
  }
}

places.forEach(p => {
  const marker = L.marker([p.lat, p.lng], { icon: createIcon(p) }).addTo(map);
  if (!p.emblem) updateTooltip(marker, p);
  marker.on('click', () => {
    renderPanel(p, marker);
  });
});

function formatEraDescription(text) {
  return text.split('\n').map(line => {
    const m = line.match(/^([^:：]{1,20}):\s*(.*)$/);
    if (m && /\d/.test(m[1])) {
      return `<p class="era-line"><b>${m[1]}</b>${m[2]}</p>`;
    }
    return `<p class="era-line">${line}</p>`;
  }).join('');
}

let currentEraIndex = 0;

function renderPanel(place, marker) {
  currentEraIndex = 0;
  currentIndex = 0;
  currentPlaceName = place.name;

  const cardArea = document.getElementById('cardArea');

  function drawCard() {
    const hasEras = place.eras && place.eras.length > 0;
    const era = hasEras ? place.eras[currentEraIndex] : null;
    const archive = era ? era.items[currentIndex] : null;
    const favLabel = isFavorite(place.name) ? '⭐ 즐겨찾기 해제' : '☆ 즐겨찾기 추가';
    const savedNote = getNote(place.name);

    const eraTabsHtml = hasEras
      ? `<div class="era-tabs">${place.eras.map((e, i) => `<button class="era-tab${i === currentEraIndex ? ' active' : ''}" data-era="${i}">${e.era}</button>`).join('')}</div>`
      : '';

    const eraDescHtml = era && era.description ? `<div class="era-desc">${formatEraDescription(era.description)}</div>` : '';

    const itemMetaHtml = archive ? `
          <p><b>${archive.title}</b> ${archive.type ? `<span class="item-type">[${archive.type}]</span>` : ''}</p>
          <p class="item-sub">${[archive.author, archive.publisher, archive.date].filter(Boolean).join(' · ')}</p>
          ${archive.note ? `<p class="item-note">${archive.note}</p>` : ''}
          ${archive.url ? `<a href="${archive.url}" target="_blank">원문 보기</a>` : '<span class="item-nolink">원문 링크 없음</span>'}
    ` : '';

    const bodyHtml = era
      ? `
        ${eraDescHtml}
        ${archive
          ? `
            <div class="thumb-strip">
              ${era.items.map((a, i) => `<img src="${a.image || 'https://placehold.co/160x160?text=No+Image'}" alt="${a.title}" class="thumb${i === currentIndex ? ' active' : ''}" data-index="${i}" />`).join('')}
            </div>
            <div class="card">
              ${archive.image ? `<img src="${archive.image}" alt="${archive.title}" />` : ''}
              ${itemMetaHtml}
            </div>
          `
          : `<p>등록된 자료가 없습니다.</p>`
        }
      `
      : `<p>등록된 자료가 없습니다.</p>`;

    cardArea.innerHTML = `
      <h3>${place.name}</h3>
      <p class="place-meta">${place.meta || '설명 및 메타데이터 입력'}</p>
      <button id="favBtn" class="fav-btn">${favLabel}</button>
      ${eraTabsHtml}
      ${bodyHtml}
      <div class="note-area">
        <div class="section-header">
          <span class="section-icon">📝</span>
          <span class="section-text">나만의 메모<small>이 장소에 대해 자유롭게 기록해보세요</small></span>
        </div>
        <textarea id="noteInput" rows="8" placeholder="이 장소에 대해 기록해두고 싶은 내용을 적어보세요">${savedNote}</textarea>
        <button id="noteSaveBtn" class="btn-primary">메모 저장</button>
        <span id="noteStatus"></span>
      </div>
    `;

    document.getElementById('favBtn').onclick = () => {
      toggleFavorite(place.name);
      updateMarkerAppearance(marker, place);
      drawCard();
    };

    document.getElementById('noteSaveBtn').onclick = () => {
      const text = document.getElementById('noteInput').value;
      saveNote(place.name, text);
      const status = document.getElementById('noteStatus');
      status.textContent = '저장됨 ✓';
      setTimeout(() => { status.textContent = ''; }, 1500);
    };

    cardArea.querySelectorAll('.era-tab').forEach(btn => {
      btn.onclick = () => {
        currentEraIndex = parseInt(btn.dataset.era, 10);
        currentIndex = 0;
        drawCard();
      };
    });

    if (archive) {
      cardArea.querySelectorAll('.thumb').forEach(img => {
        img.onclick = () => {
          currentIndex = parseInt(img.dataset.index, 10);
          if (isMobileLayout()) {
            openPhotoModal(era, currentIndex);
          } else {
            drawCard();
          }
        };
      });
    }
  }

  drawCard();
}

// ── 핸드폰 ver: 썸네일 탭 시 전체화면 사진 모달 ──
function isMobileLayout() {
  return window.matchMedia('(max-width: 768px)').matches;
}

let modalEra = null;
let modalIndex = 0;

function openPhotoModal(era, index) {
  modalEra = era;
  modalIndex = index;
  renderPhotoModal();
  document.getElementById('photoModal').classList.add('open');
}

function closePhotoModal() {
  document.getElementById('photoModal').classList.remove('open');
  modalEra = null;
}

function renderPhotoModal() {
  if (!modalEra) return;
  const item = modalEra.items[modalIndex];
  document.getElementById('photoModalImg').src = item.image || 'https://placehold.co/600x400?text=No+Image';
  document.getElementById('photoModalImg').alt = item.title;
  document.getElementById('photoModalCounter').textContent = `${modalIndex + 1} / ${modalEra.items.length}`;
  document.getElementById('photoModalInfo').innerHTML = `
    <p><b>${item.title}</b> ${item.type ? `<span class="item-type">[${item.type}]</span>` : ''}</p>
    <p class="item-sub">${[item.author, item.publisher, item.date].filter(Boolean).join(' · ')}</p>
    ${item.note ? `<p class="item-note">${item.note}</p>` : ''}
    ${item.url ? `<a href="${item.url}" target="_blank">원문 보기</a>` : '<span class="item-nolink">원문 링크 없음</span>'}
  `;
}

function modalPrev() {
  if (!modalEra) return;
  modalIndex = (modalIndex - 1 + modalEra.items.length) % modalEra.items.length;
  renderPhotoModal();
}

function modalNext() {
  if (!modalEra) return;
  modalIndex = (modalIndex + 1) % modalEra.items.length;
  renderPhotoModal();
}

document.getElementById('photoModalClose').onclick = closePhotoModal;
document.getElementById('photoModalPrev').onclick = modalPrev;
document.getElementById('photoModalNext').onclick = modalNext;

let touchStartX = 0;
const photoModalImageWrap = document.getElementById('photoModalImageWrap');
photoModalImageWrap.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
});
photoModalImageWrap.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 40) {
    if (dx > 0) modalPrev(); else modalNext();
  }
});

document.getElementById('chatSendBtn').addEventListener('click', async () => {
  const input = document.getElementById('chatInput');
  const question = input.value.trim();
  if (!question) return;

  const chatLog = document.getElementById('chatLog');
  chatLog.innerHTML += `<div class="chat-msg me">${question}</div><div class="chat-msg bot" id="loading">검색 중...</div>`;
  chatLog.scrollTop = chatLog.scrollHeight;
  input.value = '';

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, placeName: currentPlaceName })
  });

  const data = await response.json();
  document.getElementById('loading').remove();

  chatLog.innerHTML += `<div class="chat-msg meta">🔍 검색어: ${data.searchedKeyword}</div>`;

  if (data.selected.length === 0) {
    chatLog.innerHTML += `<div class="chat-msg bot">관련 자료를 찾지 못했습니다.</div>`;
    chatLog.scrollTop = chatLog.scrollHeight;
    return;
  }

  const cardsHtml = data.selected.map(item => `
    <div class="chat-msg bot">
      <p><b>${item.title}</b> (${item.type})</p>
      <p>${item.author} · ${item.year}</p>
      <p><i>${item.reason}</i></p>
      <a href="${item.url}" target="_blank">원문 보기</a>
    </div>
  `).join('');

  chatLog.innerHTML += cardsHtml;
  chatLog.scrollTop = chatLog.scrollHeight;
});
