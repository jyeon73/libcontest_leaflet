const map = L.map('map').setView([37.5665, 126.9780], 12);

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
  maxZoom: 19
}).addTo(map);

const places = [
  {
    name: '경복궁',
    lat: 37.5796, lng: 126.9770,
    emoji: '🏯',
    archives: [
      { title: '경복궁도(고지도)', image: 'https://picsum.photos/400/300', description: '조선시대 경복궁 배치를 그린 고지도. 전각 배치와 궁역 경계를 확인할 수 있다.', url: 'https://www.nl.go.kr/...' },
      { title: '조선왕조실록 관련 기록', image: 'https://example.com/sillok.jpg', description: '경복궁 창건 및 중건 관련 실록 기사 발췌.', url: 'https://www.nl.go.kr/...' }
    ]
  },
  {
    name: '서대문 독립문·서대문형무소',
    lat: 37.5729, lng: 126.9564,
    emoji: '⛓️',
    archives: [
      { title: '독립신문 원문', url: '' }
    ]
  },
  { name: '마포 양화진·절두산', lat: 37.5487, lng: 126.9107, emoji: '⛪', archives: [] },
  { name: '노량진·한강철교', lat: 37.5133, lng: 126.9424, emoji: '🌉', archives: [] },
  { name: '숙명여대·효창공원', lat: 37.5405, lng: 126.9614, emoji: '🎓', archives: [] }
];

// 마커 색 — places.forEach보다 반드시 위에 있어야 함
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

let currentIndex = 0;
let currentPlaceName = '';

places.forEach(p => {
  const marker = L.marker([p.lat, p.lng], { icon: redIcon }).addTo(map);

  marker.bindTooltip(p.emoji, {
    permanent: true,
    direction: 'top',
    offset: [0, -10],
    className: 'emblem-tooltip'
  });

  marker.on('click', () => {
    renderPanel(p);
  });
});

function renderPanel(place) {
  currentIndex = 0;
  currentPlaceName = place.name;

  const cardArea = document.getElementById('cardArea');

  function drawCard() {
    const archive = place.archives[currentIndex];

    if (!archive) {
      cardArea.innerHTML = `<h3>${place.name}</h3><p>등록된 자료가 없습니다.</p>`;
      return;
    }

    cardArea.innerHTML = `
      <h3>${place.name}</h3>
      <div class="card">
        <img src="${archive.image}" alt="${archive.title}" />
        <p><b>${archive.title}</b></p>
        <p>${archive.description}</p>
        <a href="${archive.url}" target="_blank">원문 보기</a>
      </div>
      <div class="nav">
        <button id="prevBtn">이전</button>
        <span>${currentIndex + 1} / ${place.archives.length}</span>
        <button id="nextBtn">다음</button>
      </div>
    `;

    document.getElementById('prevBtn').onclick = () => {
      if (currentIndex > 0) {
        currentIndex--;
        drawCard();
      }
    };

    document.getElementById('nextBtn').onclick = () => {
      if (currentIndex < place.archives.length - 1) {
        currentIndex++;
        drawCard();
      }
    };
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