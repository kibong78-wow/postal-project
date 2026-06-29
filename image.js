export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { imageBase64, mediaType } = req.body;
    if (!imageBase64) return res.status(400).json({ error: "이미지 데이터 필요" });

    const prompt = `이 이미지는 우체국 현장 업무 사례 자료입니다.
다음 작업을 수행하세요:

1. 이미지에서 민감정보(이름, 주민번호, 주소, 전화번호, 직원번호 등 개인식별정보)를 모두 찾아내세요.
2. 그 정보들을 [이름], [직원번호], [전화번호] 등으로 마스킹 처리한 사례 요약을 작성하세요.
3. 아래 JSON 형식으로만 응답하세요 (설명 없이 JSON만):

{
  "detected_pii": ["발견된 민감정보 유형 목록"],
  "title": "사례 제목 (마스킹 처리됨)",
  "summary": "사례 요약 (마스킹 처리됨, 2-3문장)",
  "category1": "복무관리|근무시간|휴가·휴직|직장내괴롭힘|감사·조사|징계·문책|예방교육 중 하나",
  "category2": "세부 분류",
  "keywords": ["관련 키워드 3-5개"],
  "process_hint": "이 사례의 처리 방향 제안 (1-2문장)"
}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mediaType || "image/jpeg", data: imageBase64 } },
            { type: "text", text: prompt },
          ],
        }],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || "API 오류" });
    }

    const raw = (data.content || []).map((b) => b.text || "").join("");
    const clean = raw.replace(/```json|```/g, "").trim();
    try {
      const parsed = JSON.parse(clean);
      return res.status(200).json({ result: parsed });
    } catch {
      return res.status(200).json({ result: { error: "JSON 파싱 실패", raw } });
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
