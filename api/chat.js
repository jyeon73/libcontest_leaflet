export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST만 허용됩니다' });
  }

  const { question, placeName } = req.body;

  const keyword = await extractSearchKeyword(question, placeName);

  const searchUrl = `https://www.nl.go.kr/NL/search/openApi/searchKolisNet.do?key=${process.env.NL_API_KEY}&kwd=${encodeURIComponent(keyword)}&apiType=xml&pageSize=15`;
  const xmlResponse = await fetch(searchUrl);
  const xmlText = await xmlResponse.text();
  const items = parseItems(xmlText);

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
        { role: 'system', content: '너는 사용자 질문에서 도서관 자료 검색에 쓸 핵심 키워드만 뽑는 역할이다. 설명 없이 검색어만 짧게 출력하라(최대 5단어). 장소명은 반드시 포함시켜라.' },
        { role: 'user', content: `장소: ${placeName}\n질문: ${question}` }
      ],
      max_tokens: 30
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
