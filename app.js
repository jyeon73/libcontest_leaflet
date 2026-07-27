const map = L.map('map').setView([37.5665, 126.9780], 12);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
  maxZoom: 19
}).addTo(map);

const places = [
  {
    name: '경복궁',
    lat: 37.5796, lng: 126.9770,
    emoji: '🏯',
    emblem: 'emblems/gyeongbokgung.png',
    archives: [
      { title: '경복궁도(고지도)', image: 'https://picsum.photos/seed/gbg1/400/300', description: '조선시대 경복궁 배치를 그린 고지도. 전각 배치와 궁역 경계를 확인할 수 있다.', url: 'https://www.nl.go.kr/...' },
      { title: '조선왕조실록 관련 기록', image: 'https://picsum.photos/seed/gbg2/400/300', description: '경복궁 창건 및 중건 관련 실록 기사 발췌.', url: 'https://www.nl.go.kr/...' },
      { title: '(임시) 자료 예시 3', image: 'https://picsum.photos/seed/gbg3/400/300', description: '슬라이드 UI 확인용 임시 자료. 추후 실제 자료로 교체 예정.', url: 'https://www.nl.go.kr/...' },
      { title: '(임시) 자료 예시 4', image: 'https://picsum.photos/seed/gbg4/400/300', description: '슬라이드 UI 확인용 임시 자료. 추후 실제 자료로 교체 예정.', url: 'https://www.nl.go.kr/...' }
    ]
  },
  { name: '서대문 독립문·서대문형무소', lat: 37.5729, lng: 126.9564, emoji: '⛓️', emblem: 'emblems/seodaemun.png', archives: [ { title: '독립신문 원문', url: '' } ] },
  { name: '마포 양화진·절두산', lat: 37.5487, lng: 126.9107, emoji: '⛪', archives: [] },
  { name: '노량진·한강철교', lat: 37.5133, lng: 126.9424, emoji: '🌉', archives: [] },
  { name: '숙명여대·효창공원', lat: 37.5405, lng: 126.9614, emoji: '🎓', emblem: 'emblems/hyochang.png', archives: [] }
];

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function createIcon(p) {
  if (!p.emblem) return redIcon;
  const star = isFavorite(p.name) ? '<span class="fav-star">⭐</span>' : '';
  return L.divIcon({
    className: 'emblem-marker',
    html: `<div class="emblem-wrap"><img src="${p.emblem}" class="emblem-img" alt="${p.name}" />${star}</div>`,
    iconSize: [54, 54],
    iconAnchor: [27, 27],
    popupAnchor: [0, -27]
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

function renderPanel(place, marker) {
  currentIndex = 0;
  currentPlaceName = place.name;

  const cardArea = document.getElementById('cardArea');

  function drawCard() {
    const archive = place.archives[currentIndex];
    const favLabel = isFavorite(place.name) ? '⭐ 즐겨찾기 해제' : '☆ 즐겨찾기 추가';
    const savedNote = getNote(place.name);

    const bodyHtml = archive
      ? `
        <div class="thumb-strip">
          ${place.archives.map((a, i) => `<img src="${a.image}" alt="${a.title}" class="thumb${i === currentIndex ? ' active' : ''}" data-index="${i}" />`).join('')}
        </div>
        <div class="card">
          <img src="${archive.image}" alt="${archive.title}" />
          <p><b>${archive.title}</b></p>
          <p>${archive.description}</p>
          <a href="${archive.url}" target="_blank">원문 보기</a>
        </div>
      `
      : `<p>등록된 자료가 없습니다.</p>`;

    cardArea.innerHTML = `
      <h3>${place.name}</h3>
      <button id="favBtn">${favLabel}</button>
      ${bodyHtml}
      <div class="note-area">
        <label for="noteInput">나만의 메모</label>
        <textarea id="noteInput" rows="3" placeholder="이 장소에 대해 기록해두고 싶은 내용을 적어보세요">${savedNote}</textarea>
        <button id="noteSaveBtn">메모 저장</button>
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

    if (archive) {
      cardArea.querySelectorAll('.thumb').forEach(img => {
        img.onclick = () => {
          currentIndex = parseInt(img.dataset.index, 10);
          drawCard();
        };
      });
    }
  }

  drawCard();
}

document.getElementById('chatSendBtn').addEventListener('click', async () => {
  const input = document.getElementById('chatInput');
  const question = input.value.trim();
  if (!question) return;

  const chatLog = document.getElementById('chatLog');
  chatLog.innerHTML += `<p><b>나:</b> ${question}</p><p id="loading"><i>검색 중...</i></p>`;
  input.value = '';

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, placeName: currentPlaceName })
  });

  const data = await response.json();
  document.getElementById('loading').remove();

  chatLog.innerHTML += `<p style="color:gray;font-size:12px;">🔍 검색어: ${data.searchedKeyword}</p>`;

  if (data.selected.length === 0) {
    chatLog.innerHTML += `<p>관련 자료를 찾지 못했습니다.</p>`;
    return;
  }

  const cardsHtml = data.selected.map(item => `
    <div class="card">
      <p><b>${item.title}</b> (${item.type})</p>
      <p>${item.author} · ${item.year}</p>
      <p><i>${item.reason}</i></p>
      <a href="${item.url}" target="_blank">원문 보기</a>
    </div>
  `).join('');

  chatLog.innerHTML += cardsHtml;
});
