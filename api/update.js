export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { lawList } = req.body;

    const prompt = `당신은 한국 법령 전문가입니다. 다음 법령들의 최근 개정 여부를 확인하고 업데이트 필요 사항을 분석해주세요.

[현재 수록된 법령 목록]
${lawList}

[분석 요청]
1. 각 법령의 주요 개정 이력과 현재 유효한 내용 확인
2. 우체국·우정사업본부 업무와 직접 관련된 변경사항 우선 확인
3. 추가로 수록할 필요가 있는 조문 제안

[응답 형식]
## 법령 현황 분석

### 주요 확인 사항
(각 법령별 현황)

### 업데이트 권고 사항
(변경 또는 추가가 필요한 내용)

### 추가 수록 권고 조문
(실무상 필요하나 현재 미수록된 조문)

### 종합 의견
(업데이트 우선순위 및 권고사항)

분석 기준일: ${new Date().toLocaleDateString("ko-KR")}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || "API 오류" });
    }

    const text = (data.content || []).map((b) => b.text || "").join("");
    return res.status(200).json({ result: text });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
