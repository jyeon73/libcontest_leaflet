export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST만 허용됩니다' });
  }

  const { question, placeName } = req.body;

  const gptKeyword = await extractSearchKeyword(question, placeName);
  const simplifiedPlace = simplifyPlaceName(placeName);

  // 국중도 검색은 여러 단어를 AND로 매칭해서 0건이 되기 쉬움 -> 순서대로 시도
  // 1) GPT가 뽑은 키워드 2) 장소 전체 표기 3) 장소의 핵심 명칭만(합성 지명의 "·" 이전 부분)
  const candidates = [...new Set([gptKeyword, placeName, simplifiedPlace])];

  let keyword = candidates[0];
  let items = [];
  for (const candidate of candidates) {
    items = await searchNL(candidate);
    keyword = candidate;
    if (items.length > 0) break;
  }

  if (items.length === 0) {
    return res.status(200).json({ selected: [], searchedKeyword: keyword });
  }

  const candidateList = items.map((it, i) =>
    `${i}: [${it.type}] ${it.title} / ${it.author} / ${it.year}`
  ).join('\n');

  const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: '너는 도서관 자료 목록에서 질문과 가장 관련있는 항목을 고르는 역할만 한다. 목록에 없는 내용을 만들어내지 마라. 반드시 JSON 배열로만 답하라. 형식: [{"index":0,"reason":"짧은 이유 한 문장"}]. 최대 4개까지만 고른다.' },
        { role: 'user', content: `장소: ${placeName}\n질문: ${question}\n\n[검색결과 목록]\n${candidateList}` }
      ],
      max_tokens: 300
    })
  });

  const gptData = await gptResponse.json();
  let selection = [];
  try {
    selection = JSON.parse(gptData.choices[0].message.content);
  } catch (e) {
    console.error('[chat.js] GPT 선별 응답 JSON 파싱 실패:', {
      rawContent: gptData?.choices?.[0]?.message?.content,
      gptError: gptData?.error,
      parseError: e.message
    });
    selection = [];
  }

  const result = selection.map(s => ({
    ...items[s.index],
    reason: s.reason
  })).filter(x => x.title);

  res.status(200).json({ selected: result, searchedKeyword: keyword });
}

function simplifyPlaceName(placeName) {
  // "마포 양화진·절두산" -> "마포", "노량진·한강철교" -> "노량진" 처럼 합성 지명의 핵심 명칭만 추출
  return placeName.split(/[·\s]/)[0];
}

async function searchNL(keyword) {
  const searchUrl = `https://www.nl.go.kr/NL/search/openApi/searchKolisNet.do?key=${process.env.NL_API_KEY}&kwd=${encodeURIComponent(keyword)}&apiType=xml&pageSize=15`;
  const xmlResponse = await fetch(searchUrl);
  const xmlText = await xmlResponse.text();
  return parseItems(xmlText);
}

async function extractSearchKeyword(question, placeName) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: '너는 사용자 질문에서 도서관 자료 검색에 쓸 핵심 키워드를 뽑는 역할이다. 설명 없이 검색어만 출력하라. 질문에 구체적인 대상(인물, 건물, 사건 이름 등)이 있으면 그 단어를 우선 사용해라(예: "당인리발전소가 뭐야?" -> "당인리발전소"). 장소명은 "마포 양화진·절두산"처럼 여러 지명이 합쳐진 표기일 수 있는데, 이걸 그대로 통째로 쓰지 말고 핵심 지명 한 단어만 사용해라(예: "마포"). 국중도 검색은 여러 단어를 AND로 매칭해서 단어가 많으면 0건이 되기 쉬우니 최대한 1~2단어로 짧게 뽑아라.' },
        { role: 'user', content: `장소: ${placeName}\n질문: ${question}` }
      ],
      max_tokens: 20
    })
  });

  const data = await response.json();
  const keyword = data.choices?.[0]?.message?.content?.trim();
  if (!keyword) {
    console.error('[chat.js] 검색어 추출 실패, placeName으로 대체:', data?.error || data);
  }
  return keyword || placeName;
}

function extractTag(block, tag) {
  const match = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  if (!match) return '';
  return match[1].replace('<![CDATA[', '').replace(']]>', '').trim();
}

function parseItems(xmlText) {
  const blocks = xmlText.split('<item>').slice(1);
  return blocks.map(raw => {
    const block = raw.split('</item>')[0];
    const detailPath = extractTag(block, 'detail_link');
    return {
      title: extractTag(block, 'title_info'),
      type: extractTag(block, 'type_name'),
      author: extractTag(block, 'author_info'),
      publisher: extractTag(block, 'pub_info'),
      year: extractTag(block, 'pub_year_info'),
      place: extractTag(block, 'place_info'),
      image: extractTag(block, 'image_url'),
      licText: extractTag(block, 'lic_text'),
      url: detailPath ? `https://www.nl.go.kr${detailPath}` : ''
    };
  });
}
