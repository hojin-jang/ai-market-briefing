import { generateText } from "ai";
import { google } from "@ai-sdk/google";

const MODEL = "gemini-3.1-flash-lite-preview";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));

    // 종목 분석
    if (body.mode === "analyze" && body.stock) {
      const { text } = await generateText({
        model: google(MODEL),
        tools: {
          google_search: google.tools.googleSearch({}),
        },
        prompt: `너는 한국 주식시장 전문 애널리스트야.
"${body.stock}" 종목의 최신 정보를 검색해서 분석한 뒤, 아래 JSON 형식으로만 응답해.
다른 텍스트 없이 JSON만 출력해.

{
  "sentiment": 0~100 사이 숫자 (시장 긍정도),
  "summary": "현재 상황과 전망을 3~4문장으로 상세히 분석",
  "insights": [
    { "type": "positive 또는 trend 또는 news 또는 warning", "text": "구체적인 인사이트 내용" }
  ]
}

insights는 3~4개, 최신 뉴스와 실적 데이터를 반영해줘. 모든 텍스트는 한국어로.`,
      });

      const match = text.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("분석 파싱 실패");
      return Response.json(JSON.parse(match[0]));
    }

    // 시장 브리핑 (Google Search로 실시간 데이터 + JSON 한 번에)
    const { text } = await generateText({
      model: google(MODEL),
      tools: {
        google_search: google.tools.googleSearch({}),
      },
      prompt: `오늘 한국 주식시장 현황을 검색해서 아래 JSON 형식으로만 응답해.
다른 텍스트 없이 JSON만 출력해.
검색해서 나온 실제 수치를 그대로 사용하고, 임의로 만들지 마.

{
  "markets": [
    { "name": "KOSPI", "value": "실제 지수", "change": "+00.00 (+0.00%)", "up": true또는false },
    { "name": "KOSDAQ", "value": "실제 지수", "change": "+00.00 (+0.00%)", "up": true또는false }
  ],
  "headline": "오늘 시장의 핵심 흐름과 배경을 3~4문장으로 상세히 설명. 어떤 섹터가 강세/약세였는지, 외국인/기관 매매 동향, 글로벌 요인 등을 포함해서 한국어로 작성",
  "hotStocks": ["오늘 주목할 종목 6~8개를 종목명만 배열로"]
}`,
    });

    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("브리핑 파싱 실패");
    return Response.json(JSON.parse(match[0]));
  } catch (error) {
    console.error("Report error:", error);
    return Response.json(
      { error: error.message || "요청 실패" },
      { status: 500 }
    );
  }
}
