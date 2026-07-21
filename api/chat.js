export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST만 허용됩니다' });
  }

  const { question, placeName } = req.body;

  // 1. 국중도 검색 (장소명 키워드로)
  const searchUrl = `https://www.nl.go.kr/NL/search/openApi/searchKolisNet.do?key=${process.env.NL_API_KEY}&kwd=${encodeURIComponent(placeName)}&apiType=xml&pageSize=15`;
  const xmlResponse = await fetch(searchUrl);
  const xmlText = await xmlResponse.text();
  const items = parseItems(xmlText);

  if (items.length === 0) {
    return res.status(200).json({ selected: [] });
  }

  // 2. GPT에 넘길 후보 목록 (메타데이터만, 짧게)
  const candidateList = items.map((it, i) =>
    `${i}: [${it.type}] ${it.title} / ${it.author} / ${it.year}`
  ).join('\n');

  // 3. GPT 호출 — 선택만, 생성 없음
  const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: '너는 도서관 자료 목록에서 질문과 가장 관련있는 항목을 고르는 역할만 한다. 목록에 없는 내용을 만들어내지 마라. 반드시 JSON 배열로만 답하라. 형식: [{"index":0,"reason":"짧은 이유 한 문장"}]. 최대 4개까지만 고른다.'
        },
        {
          role: 'user',
          content: `장소: ${placeName}\n질문: ${question}\n\n[목록]\n${candidateList}`
        }
      ],
      max_tokens: 300
    })
  });

  const gptData = await gptResponse.json();
  let selection = [];
  try {
    selection = JSON.parse(gptData.choices[0].message.content);
  } catch (e) {
    selection = []; // GPT가 JSON 형식 안 지켰을 경우 대비
  }

  // 4. 선택된 인덱스에 해당하는 실제 데이터(메타데이터는 GPT가 아니라 items에서 그대로 가져옴)
  const result = selection.map(s => ({
    ...items[s.index],
    reason: s.reason
  })).filter(x => x.title); // 잘못된 인덱스 걸러내기

  res.status(200).json({ selected: result });
}

// --- 파싱 함수는 파일 하단에 그대로 유지 ---
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