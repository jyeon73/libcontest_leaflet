const map = L.map('map').setView([37.5665, 126.9780], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors',
  maxZoom: 19
}).addTo(map);

const places = [
  { name: '경복궁', lat: 37.5796, lng: 126.9770, archives: [
    {
      title: '경복궁도(고지도)',
      image: 'https://picsum.photos/400/300',
      description: '조선시대 경복궁 배치를 그린 고지도. 전각 배치와 궁역 경계를 확인할 수 있다.',
      url: 'https://www.nl.go.kr/...'
    },
    {
      title: '조선왕조실록 관련 기록',
      image: 'https://example.com/sillok.jpg',
      description: '경복궁 창건 및 중건 관련 실록 기사 발췌.',
      url: 'https://www.nl.go.kr/...'
    }
  ]},
  {
    name: '서대문 독립문·서대문형무소',
    lat: 37.5729, lng: 126.9564,
    archives: [
      { title: '독립신문 원문', url: '' }
    ]
  },
  { name: '마포 양화진·절두산', lat: 37.5487, lng: 126.9107, archives: [] },
  { name: '노량진·한강철교', lat: 37.5133, lng: 126.9424, archives: [] },
  { name: '숙명여대·효창공원', lat: 37.5405, lng: 126.9614, archives: [] }
];

let currentIndex = 0;

places.forEach(p => {
  const marker = L.marker([p.lat, p.lng]).addTo(map);

  marker.on('click', () => {
    renderPanel(p);
  });
});

function renderPanel(place) {
  currentIndex = 0;
  currentPlaceName = place.name;

  const panel = document.getElementById('panel');

  function drawCard() {
    const archive = place.archives[currentIndex];

    if (!archive) {
      panel.innerHTML = `<h3>${place.name}</h3><p>등록된 자료가 없습니다.</p>`;
      return;
    }

    panel.innerHTML = `
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

let currentPlaceName = ''; // 현재 선택된 장소 이름 저장

document.getElementById('chatSendBtn').addEventListener('click', async () => {
  const input = document.getElementById('chatInput');
  const question = input.value.trim();
  if (!question) return;

  const chatLog = document.getElementById('chatLog');
  chatLog.innerHTML += `<p><b>나:</b> ${question}</p>`;
  input.value = '';

  chatLog.innerHTML += `<p id="loading"><i>답변 생성 중...</i></p>`;

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, placeName: currentPlaceName })
  });

  const data = await response.json();

  document.getElementById('loading').remove();
  chatLog.innerHTML += `<p><b>AI 사서:</b> ${data.answer}</p>`;
});