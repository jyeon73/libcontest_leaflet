export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST만 허용됩니다' });
  }

  const { question, placeName } = req.body;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: `당신은 도서관 사서입니다. ${placeName}에 관한 자료를 안내해주세요.` },
        { role: 'user', content: question }
      ]
    })
  });

  const data = await response.json();
  const answer = data.choices?.[0]?.message?.content || '답변을 가져오지 못했습니다.';

  res.status(200).json({ answer });
}