// 국립중앙도서관 자료 조사 정리본(자료, 역사 정리본.pdf) 기반 데이터
// note: 국중도 검색 URL 일부는 PDF 텍스트 추출 과정에서 공백/기호가 깨졌을 수 있어 추후 원문 대조 필요
const places = [
  {
    name: '경복궁',
    lat: 37.5796, lng: 126.9770,
    emoji: '🏯',
    emblem: 'emblems/gyeongbokgung.png',
    meta: '설명 및 메타데이터 입력',
    eras: [
      {
        era: '조선 시대',
        description: '1395년(태조 4): 조선 왕조 경복궁 창건. \'경복(景福)\'은 《시경》의 "이미 술에 취하고 덕에 배부르니 군자 만년 태평한 복을 누리리라"에서 따왔다.\n1592년(선조 25): 임진왜란 발발로 인해 궁궐 전체가 훼손되고 방화로 전소되었다. 이후 약 270여 년간 재건되지 못하고 폐허로 방치되었다.\n1867년(고종 4): 흥선대원군의 주도로 경복궁 중건이 완료되었다. 조선 왕실의 권위를 회복하고자 대규모로 중창하였다.\n1895년(고종 32): 경복궁 내 건청궁에서 명성황후가 일본군과 낭인들에 의해 살해당하는 을미사변이 발생했다.',
        items: [
          { title: '경복궁도(景福宮圖)', type: '고문헌', note: '경복궁 복원 이전 약식 안내도 · 표준번호: UCI G701:B00052464441', image: 'archive-images/gyeongbokgung_joseon_01.jpg', url: 'https://www.nl.go.kr/NL/contents/search.do?pageNum=1&pageSize=30&srchTarget=total&kwd=%E6%99%AF%E7%A6%8F%E5%AE%AE%E5%9C%96#viewKey=CNTS_00052464441&viewType=C&category=%EA%B3%A0%EB%AC%B8%ED%97%8C&pageIdx=2&jourId=' },
          { title: '경복궁수리(景福宮修理)', type: '신문', publisher: '대한매일신보사', date: '1907-10-05', image: 'archive-images/gyeongbokgung_joseon_02.jpg', url: 'https://nl.go.kr/newspaper/detail.do?content_id=CNTS_00093141172' }
        ]
      },
      {
        era: '근대(일제강점기)',
        description: '1915년: 일제가 \'조선물산공진회\'를 개최한다는 구실로 경복궁 내 수많은 전각을 철거했다.\n1926년: 경복궁 근정전 바로 앞에 조선총독부 청사를 건립하여 궁궐의 경관과 정기를 근본적으로 훼손했다.',
        items: [
          { title: '벚꽃이 난만한 경복궁에서 조선박람회 지진제를 거행, 내빈이 1천여명이 참석', type: '신문', publisher: '부산일보사', date: '1929-04-24', image: 'archive-images/gyeongbokgung_ilje_01.png', url: 'https://nl.go.kr/newspaper/detail.do?content_id=CNTS_00114201867' },
          { title: '경복궁도울께라!, 卅七年만에 太極旗翩飜, 눈물과 깁븜에 半島는 雀躍, 靑史에 記錄할 太極旗揭揚式', type: '신문', publisher: '대구시보사', date: '1946-01-16', image: 'archive-images/gyeongbokgung_ilje_02.jpg', url: 'https://nl.go.kr/newspaper/detail.do?content_id=CNTS_00109320888' },
          { title: '경복궁 옛터에 태극기', type: '신문', publisher: '고려문화사', date: '1946-01-26', image: 'archive-images/gyeongbokgung_ilje_03.png', url: 'https://nl.go.kr/newspaper/detail.do?content_id=CNTS_00106326908' }
        ]
      },
      {
        era: '현대',
        description: '1995년: 광복 50주년을 맞아 일제 잔재 청산 및 역사 바로 세우기 사업의 일환으로 조선총독부 청사를 철거했다.\n1990년대~현재: 흥례문, 건청궁, 소주방 등 훼철된 전각들을 단계적으로 복원하는 경복궁 장기 복원 사업이 추진되고 있다.',
        items: [
          { title: '구 조선총독부 건물. 상, 실측 및 철거 보고서', type: '도서', publisher: '국립중앙박물관', date: '1997', image: 'archive-images/gyeongbokgung_hyeondae_01.png', url: 'https://www.nl.go.kr/NL/contents/search.do?pageNum=1&pageSize=30&srchTarget=total&kwd=%EA%B5%AC_%EC%A1%B0%EC%84%A0%EC%B4%9D%EB%8F%85%EB%B6%80#viewKey=CNTS_00047928520&viewType=C&category=%EB%8F%84%EC%84%9C&pageIdx=2&jourId=' },
          { title: '구 조선총독부 건물. 하, 실측 및 철거 도판', type: '도서', publisher: '국립중앙박물관', date: '1997', image: 'archive-images/gyeongbokgung_hyeondae_02.png', url: 'https://www.nl.go.kr/NL/contents/search.do?pageNum=1&pageSize=30&srchTarget=total&kwd=%E8%88%8A_%E6%9C%9D%E9%AE%AE%E7%B8%BD%E7%9D%A3%E5%BA%9C#viewKey=CNTS_00047928521&viewType=C&category=%EB%8F%84%EC%84%9C&pageIdx=1&jourId=' }
        ]
      }
    ]
  },
  {
    name: '서대문 독립문·서대문형무소',
    lat: 37.5744, lng: 126.9564,
    emoji: '⛓️',
    emblem: 'emblems/seodaemun.png',
    meta: '설명 및 메타데이터 입력',
    eras: [
      {
        era: '근대(일제강점기)',
        description: '1908년: 일제가 국권 침탈을 위해 \'경성감옥\'으로 개소했다. 당시 수용 인원 500여 명 규모의 한국 최초 근대식 감옥이었다.\n1912년: 마포 공덕동에 새 감옥이 생기면서 \'서대문감옥\'으로 명칭이 변경되었다.\n1919년: 3·1운동으로 수감자가 급증하자 수용 인원 3,000여 명 이상의 대규모로 증축했다. 유관순 열사 등 수많은 독립운동가가 투옥되어 순국했다.\n1923년: \'서대문형무소\'로 명칭을 변경했다. 윤봉길, 안창호, 한용운 등 대표적인 독립운동가들이 거쳐 간 수난의 장소이다.',
        items: [
          { title: '총독부공문: 부령, 조선총독부령 제11호 경성부 공덕리 경성감옥 설치와 종래 경성감옥 명칭을 서대문감옥으로 개칭', type: '신문', publisher: '매일신보사', date: '1912-09-05', image: 'archive-images/seodaemun_geundae_01.jpg', url: 'https://nl.go.kr/newspaper/detail.do?content_id=CNTS_00093929612' },
          { title: '현재 일천구백인(1) 서대문감옥의 소요범인들', type: '신문', publisher: '매일신보사', date: '1919-06-10', image: 'archive-images/seodaemun_geundae_02.jpg', url: 'https://nl.go.kr/newspaper/detail.do?content_id=CNTS_00094073865' },
          { title: '주도한 감옥의 주의(2), 서대문감옥의 소요범인들', type: '신문', publisher: '매일신보사', date: '1919-06-11', image: 'archive-images/seodaemun_geundae_03.png', url: 'https://nl.go.kr/newspaper/detail.do?content_id=CNTS_00094073921' },
          { title: '경성에 일천오백인, 서대문감옥의 소요사건 관계자', type: '신문', publisher: '매일신보사', date: '1919-05-29', image: 'archive-images/seodaemun_geundae_04.jpg', url: 'https://nl.go.kr/newspaper/detail.do?content_id=CNTS_00094073011' },
          { title: '영국인 쇼씨는 서대문 감옥, 미결감에 있다, 고등법원에서 심리, 공판은 아직 모른다', type: '신문', publisher: '매일신보사', date: '1920-08-25', image: 'archive-images/seodaemun_geundae_05.jpg', url: 'https://nl.go.kr/newspaper/detail.do?content_id=CNTS_00094105276' }
        ]
      },
      {
        era: '현대',
        description: '1945년: 광복 이후 \'서울형무소\', \'서울교도소\'(1961), \'서울구치소\'(1967)로 명칭이 바뀌며 계속 사용되었다.\n1970~1980년대: 군부 독재 시절 민주화 운동가, 진보적 지식인, 학생들이 투옥되는 등 민주화 운동의 수난사 현장이 되었다.\n1987년: 서울구치소가 경기도 의왕시로 이전했다.\n1998년: 옥사와 사형장 등을 보존·복원하여 \'서대문형무소역사관\'으로 개관했다. 독립운동과 민주화 운동의 역사적 현장이자 자주독립·자유의 소중함을 배우는 교육공간으로 활용되었다.',
        items: [
          { title: '데모학생 육명구속: 21일서울 교도소에', type: '신문', publisher: '마산일보사', date: '1964-04-21', image: 'archive-images/seodaemun_hyeondae_01.jpg', url: 'https://nl.go.kr/newspaper/detail.do?content_id=CNTS_00115011561' },
          { title: '서대문형무소 역사관 개관', type: '잡지/학술지', publisher: '문경문화원', date: '1998', note: '원문 확인 불가', image: '', url: '' },
          { title: '장벽을 넘어 해방으로, 여성 독립운동가의 생애', type: '주제별 컬렉션', note: '유관순, 권애라, 김마리아, 강주룡, 박차정 등 여성 독립운동가 9인의 생애를 담은 국립중앙도서관 컬렉션', image: 'archive-images/seodaemun_hyeondae_02.jpg', url: 'https://www.nl.go.kr/NL/contents/N20103000000.do?schM=contList&schOpt1=CA0000000049&schOpt2=CA0000000600&page=1#cont_banner' }
        ]
      }
    ]
  },
  {
    name: '마포 양화진·절두산',
    lat: 37.5457, lng: 126.9126,
    emoji: '⛪',
    emblem: 'emblems/mapo.png',
    meta: '설명 및 메타데이터 입력',
    eras: [
      {
        era: '근대(대한제국)',
        description: '1866년: 흥선대원군이 천주교를 탄압하여 수많은 신자와 프랑스 선교사를 처형한 병인박해 사건이 발생했다. 이는 이후 프랑스 함대가 강화도를 거쳐 한강 수로를 직접 침범한 사건인 병인양요로 이어졌다. 양화진은 한양 도성으로 진입하는 수로의 마지막 관문이자 물류 집결지로서, 조선 수군의 핵심 방어 기지가 위치한 방위의 마지노선이었다.',
        items: [
          { title: '병인양요시 조선인의 양인관(이): 천주교박해후 양이침범을 깨다른대원군 강화와 한강방비', type: '신문', publisher: '매일신보사', date: '1932-03-05', image: 'archive-images/mapo_geundae_01.jpg', url: 'https://nl.go.kr/newspaper/detail.do?content_id=CNTS_00094521597' },
          { title: '절두산 순교성지', type: '웹사이트', note: '국립중앙도서관이 운영하는 웹 아카이브 서비스 OASIS에서 절두산 순교성지의 역사와 병인박해, 순교자 기념 시설 등을 소개하는 웹자료를 확인할 수 있다. (접근 불가능한 페이지 다수)', image: 'archive-images/mapo_geundae_02.jpg', url: 'http://wayback.nl.go.kr/wayback/jsp/oasis/oasisReplay.jsp?collection=20170530132850&contentsId=CNTS_00092426269&url=http://jeoldusan.or.kr&licCd=0' },
          { title: '순무영등록(巡撫營謄錄)', type: '고문헌', author: '순무영', note: '1866년 병인양요 때 설치된 임시 군영인 \'순무영\'에서 작성한 공식 등록으로, 프랑스군에 대응하기 위한 군사 작전과 병력 동원, 무기·군량 조달, 전투 상황 등을 기록한 1차 사료이다.', image: 'archive-images/mapo_geundae_03.png', url: 'https://www.nl.go.kr/NL/contents/search.do?pageNum=1&pageSize=30&srchTarget=total&kwd=%EC%88%9C%EB%AC%B4%EC%98%81%EB%93%B1%EB%A1%9D#viewKey=CNTS_00047974816&viewType=C&category=%EA%B3%A0%EB%AC%B8%ED%97%8C&pageIdx=2&jourId=' },
          { title: '한말역화, 병인양요(일)', type: '신문', publisher: '군산신문사', date: '1949-01-04', image: 'archive-images/mapo_geundae_04.jpg', url: '' },
          { title: '한말역화: 병인양요(이)', type: '신문', publisher: '군산신문사', date: '1949-01-05', image: '', url: 'https://nl.go.kr/newspaper/detail.do?content_id=CNTS_00076768009' },
          { title: '한말역화, 병인양요(사)', type: '신문', publisher: '군산신문사', date: '1949-01-07', image: '', url: 'https://nl.go.kr/newspaper/detail.do?content_id=CNTS_00076827274' },
          { title: '한말사화, 병인양요(오)', type: '신문', publisher: '군산신문사', date: '1949-01-08', image: '', url: 'https://nl.go.kr/newspaper/detail.do?content_id=CNTS_00076827346' },
          { title: '한말사화, 병인양요(육)', type: '신문', publisher: '군산신문사', date: '1949-01-09', image: '', url: 'https://nl.go.kr/newspaper/detail.do?content_id=CNTS_00076827378' }
        ]
      },
      {
        era: '일제강점기',
        description: '1930년: 일제 강점기 당시 식민지 경영과 경성의 전력 공급을 목적으로 우리나라 최초의 대규모 화력발전소인 당인리화력발전소가 건설되었다.\n광복 이후: 대한민국 정부가 운영을 이어받아 서울의 주요 전력 공급 시설로 활용되었다.',
        items: [
          { title: '당인리발전소(唐人里發電所)', type: '신문', publisher: '조선신문사', date: '1930-11-07', image: 'archive-images/mapo_ilje_01.jpg', url: 'https://nl.go.kr/newspaper/detail.do?content_id=CNTS_00099452576' },
          { title: '당인리발전소확장(唐人里發電所擴張)', type: '신문', publisher: '조선중앙일보사(여운형)', date: '1935-10-12', image: 'archive-images/mapo_ilje_02.jpg', url: 'https://nl.go.kr/newspaper/detail.do?content_id=CNTS_00093612587' },
          { title: '당인리발전소복구(唐人里發電所復舊)', type: '신문', publisher: '서울신문사', date: '1950-10-05', image: 'archive-images/mapo_ilje_03.jpg', url: 'https://nl.go.kr/newspaper/detail.do?content_id=CNTS_00133838724' },
          { title: '이승만대통령 당인리화력발전소 시찰', type: '이미지/사진', date: '1959', note: '관내 이용', image: '', url: '' }
        ]
      },
      {
        era: '현대',
        description: '1958년에 착공되고 1962년 준공된 마포아파트는 단독 건물 형태가 아닌, 여러 동이 군집을 이루는 대한민국 최초의 대단위 단지형 아파트였다. 단순히 거주 인구의 밀도를 높인 것을 넘어, 내부 설비의 혁신이 동반되었다. 연탄보일러를 활용한 중앙난방 시스템이 최초로 시공되었으며, 수세식 화장실과 입식 부엌 등 당시로서는 최신식 서구형 주거 설비가 전면 도입되었다.',
        items: [
          { title: '마포아파트 항공사진 촬영', type: '이미지/사진', date: '1963', note: '관내 이용', image: '', url: '' }
        ]
      }
    ]
  },
  {
    name: '노량진·한강철교',
    lat: 37.5134, lng: 126.9426,
    emoji: '🌉',
    emblem: 'emblems/hangang.png',
    meta: '설명 및 메타데이터 입력',
    eras: [
      {
        era: '조선 시대',
        description: '1456년: 사육신의 단종 복위 운동이 실패하면서 사육신이 처형되었다. 현재의 사육신묘는 이들을 기리기 위한 묘역이다.\n1795년: 정조가 어머니 혜경궁 홍씨와 함께 화성(수원) 행차를 할 때 한강을 건너기 위해 주교(舟橋, 배다리)를 설치했다.',
        items: [
          { title: '원행을묘정리의궤(園幸乙卯整理儀軌)', type: '고문헌', note: '1795년(을묘년) 정조가 아버지 사도세자의 능인 현륭원을 참배하기 위해 화성으로 행차한 과정을 기록한 의궤이다. 이 의궤 안에 「주교도(舟橋圖)」, 「주교절목(舟橋節目)」 등 배다리의 구조와 설치 과정을 자세히 기록한 부분이 포함되어 있다.', date: '1796', image: 'archive-images/noryangjin_joseon_01.jpg', url: 'https://www.nl.go.kr/NL/contents/search.do?resultType=&pageNum=1&pageSize=30&order=&sort=&srchTarget=total&kwd=%EC%9B%90%ED%96%89%EC%9D%84%EB%AC%98#viewKey=CNTS_00082399716&viewType=C&category=%EA%B3%A0%EB%AC%B8%ED%97%8C&pageIdx=1&jourId=' },
          { title: '사육신묘를 개수(死六臣墓를 改修)', type: '신문', publisher: '연합신문', date: '1949-06-08', image: 'archive-images/noryangjin_joseon_02.jpg', url: 'https://nl.go.kr/newspaper/detail.do?content_id=CNTS_00069082661' }
        ]
      },
      {
        era: '근대(대한제국)',
        description: '1899년: 대한민국 최초의 철도인 경인선이 개통되었다.\n1900년: 용산과 노량진을 잇는 한강 최초의 다리인 한강철교가 세워졌다.',
        items: [
          { title: '(근대초기 한국문화 과거로 가는 시간여행) 1899년 9월 18일 노량진역에서 열린 경인선 개통식', type: '이미지/사진', date: '2004', image: '', url: 'https://www.nl.go.kr/NL/contents/search.do?pageNum=1&pageSize=30&srchTarget=total&kwd=%EA%B2%BD%EC%9D%B8%EC%84%A0_%EA%B0%9C%ED%86%B5#viewKey=CNTS_00132804351&viewType=C&category=%EB%A9%80%ED%8B%B0%EB%AF%B8%EB%94%94%EC%96%B4&pageIdx=5&jourId=' },
          { title: '경인선은 개통(京仁線은 開通)', type: '신문', publisher: '매일신보사', date: '1940-07-11', image: 'archive-images/noryangjin_geundae_01.jpg', url: 'https://nl.go.kr/newspaper/detail.do?content_id=CNTS_00095032653' },
          { title: '조선철도사(朝鮮鐵道史)', type: '도서', author: '조선총독부 철도국', publisher: '조선총독부철도국', date: '1915', note: '일제 강점기 경인선을 비롯한 조선의 주요 철도의 건설 과정, 노선, 운영 현황 등을 기록한 역사 자료이다.', image: 'archive-images/noryangjin_geundae_02.png', url: 'https://www.nl.go.kr/NL/contents/search.do?pageNum=1&pageSize=30&srchTarget=total&kwd=%EC%A1%B0%EC%84%A0%EC%B2%A0%EB%8F%84%EC%82%AC#viewKey=CNTS_00047999901&viewType=C&category=%EB%8F%84%EC%84%9C&pageIdx=4&jourId=' }
        ]
      },
      {
        era: '현대',
        description: '1950년: 6·25전쟁 발발 직후 한강인도교가 폭파되어 피난길이 막혔다.\n1952~1957년: 한강철교 복구 작업이 국가 차원의 사업으로 진행되었고, 국제 원조의 도움을 받으며 진행되었다.',
        items: [
          { title: '한강철교 복구, 명년 5월엔 준공', type: '신문', publisher: '자유신문사', date: '1951-12-28', image: 'archive-images/noryangjin_hyeondae_01.jpg', url: 'https://nl.go.kr/newspaper/detail.do?content_id=CNTS_00115231836' },
          { title: '한강인도교수리(漢江人道橋修理)', type: '신문', publisher: '평화신문사', date: '1952-04-27', image: 'archive-images/noryangjin_hyeondae_02.jpg', url: 'https://nl.go.kr/newspaper/detail.do?content_id=CNTS_00131743226' }
        ]
      }
    ]
  },
  {
    name: '숙명여대·효창공원',
    lat: 37.5423, lng: 126.9611,
    emoji: '🎓',
    emblem: 'emblems/hyochang.png',
    meta: '설명 및 메타데이터 입력',
    eras: [
      {
        era: '조선 시대',
        description: '1782년(정조 6): 정조와 의빈 성씨 사이에서 문효세자가 출생했다.\n1786년(정조 10): 문효세자가 5세로 요절했고, 고양 율목동(현 용산구 효창동)에 \'효창묘\'를 조성했다. 같은 해 11월 생모 의빈 성씨도 사망하여 효창묘 왼쪽 언덕에 안장되었다. 정조의 뜻에 따라 두 모자의 묘가 100보 거리로 나란히 배치되었다. 이후 순조의 후궁 숙의 박씨와 그 딸 영온옹주의 묘도 이 묘역에 조성되며 왕실 묘역으로 확장되었다.\n1870년(고종 7): \'효창묘\'에서 \'효창원\'으로 격상되었다.',
        items: [
          { title: '정조실록 21권 — 「문효세자의 묘호를 문희로, 묘를 효창이라고 정하다」', type: '웹사이트', date: '1786', image: 'archive-images/hyochang_joseon_01.png', url: 'https://sillok.history.go.kr/id/kva_11006020_00' },
          { title: '정조실록 22권 — 「문효세자를 효창묘에 장사지내다」', type: '웹사이트', date: '1786', image: 'archive-images/hyochang_joseon_02.png', url: 'https://sillok.history.go.kr/id/kva_11007119_001' }
        ]
      },
      {
        era: '근대(개항기~일제강점 초기)',
        description: '1894년: 청일전쟁 당시 일본군이 효창원 인근 만리창 부지에 주둔하며, 숲이 훼손되었다.\n1908년: 일본인 공원 조성을 위해 효창원 산림을 빌려달라는 청원 기사(『황성신문』 1908.2.28)가 등장했다. 이미 이 시기부터 훼손 시도가 진행되었다.\n1919~1921년: 조선총독부 철도국이 조선호텔 부속 골프장으로 \'효창원 골프코스\'(57,000평, 9홀 중 7홀 사용)가 조성되었고, 이는 서울 최초의 골프장이다.\n1924~1925년: 효창원을 공원(아동유원지·경기장 등)으로 조성하는 사업이 본격화되었다. 1938년 『매일신보』에는 \'효창원 대개수\' 계획도(아동유원, 야외극장, 박물관 등)가 실렸다.\n1940년: 의빈 성씨 묘가 서삼릉으로 강제 이장되었다.\n1944년: 문효세자 효창원(묘) 또한 서삼릉으로 강제 이장되었다. 이로써 효창\'원\'은 명목상 폐지되고 \'효창공원\'이라는 이름만 남게 되었다.',
        items: [
          { title: '산림청차(山林請借)', type: '신문', publisher: '황성신문사', date: '1908-02-28', note: '"용산 거류 일본민단장이 효창원 산림을 공원지로 빌려달라 청원"', image: 'archive-images/hyochang_geundae_01.jpg', url: 'https://nl.go.kr/newspaper/detail.do?content_id=CNTS_00093820031' },
          { title: '나도향, 『벙어리 삼룡이』(雜誌《黎明》창간호, 1925.7.1)', type: '잡지/학술지', publisher: '여명사', note: '효창원 일대의 옛 지명(연화봉)을 배경으로 한 소설', image: '', url: '' },
          { title: '경성명물또하나 삽만원공비들여 효창원을 대개수: 오롱조롱 각가지 시설을 완비 아동본위락천지화', type: '신문', publisher: '매일신보사', date: '1938-02-19', note: '효창공원설계약도 수록', image: 'archive-images/hyochang_geundae_02.jpg', url: 'https://nl.go.kr/newspaper/detail.do?content_id=CNTS_00094881004' }
        ]
      },
      {
        era: '현대',
        description: '1945년 8월: 광복 직후 일본군 숙영지가 철거되었다.\n1946년 7월: 김구 주도로 이봉창·윤봉길·백정기 삼의사 유해를 국내로 봉환하여 삼의사묘를 조성했다. 유해를 찾지 못한 안중근 의사를 위한 가묘도 함께 조성했다.(2019년 정식 묘비로 교체, 현재도 유해는 없음)\n1948년 9월: 임시정부 요인 이동녕·조성환·차이석 유해를 안장했다.(임정요인 묘역)\n1949년 7월: 김구, 경교장에서 암살 후 국민장으로 이곳에 안장되었다.\n1956년: 독립운동가 묘 이장 후 이승만 정부가 운동장 건립 계획을 발표했다.(반발로 축소)\n1959년 11월 착공~1960년 10월 완공: 한국 최초의 국제규격 축구 전용구장 \'효창운동장\'을 건립했다. 이는 1960년 제2회 아시아축구선수권대회 개최를 위함이었다.\n1961년 이후: 박정희 정부 시기 반공투사위령탑 건립, 대한노인회관 조성 등으로 공간 정체성이 혼재되기도 했다.\n1989년: 효창공원이 사적 제330호로 지정되었다.\n2002년: 백범김구기념관이 개관했다.\n2019년~현재: 3·1운동/임시정부 수립 100주년을 계기로 \'효창독립100년공원\' 조성 사업을 추진하고 있다.',
        items: [
          { title: '아세아축구선수권대회제2회, 오만관중 뒤덮인 효창구장, 한국팀단연 "리드", 이스라엘『팀』의 개인기술현저', type: '신문', publisher: '평화신문사', date: '1960-10-19', image: '', url: 'https://nl.go.kr/newspaper/detail.do?content_id=CNTS_00132337818' },
          { title: '삼열사국민장의엄숙히 거행 애수에어린삼천리전역 혁혁한 위업을 추억 영령은 영원히 효창원에', type: '신문', publisher: '대동신문사', date: '1946-07-07', image: 'archive-images/hyochang_hyeondae_01.jpg', url: 'https://nl.go.kr/newspaper/detail.do?content_id=CNTS_00067991858' },
          { title: '현대문학 속 청파동/숙명여대 삼거리', type: '참고자료', note: '김호연 『불편한 편의점』(2021) — 청파동/숙명여대 삼거리 배경 · 최승자 「청파동을 기억하는가」(『이 시대의 사랑』, 1981) 외 「두 번의 죽음」·「망제」 (저작권 생존 작품 — 원문 URL 없음, 서지정보만 표기)', image: '', url: '' }
        ]
      }
    ]
  }
];
