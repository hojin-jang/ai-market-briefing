import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

const schema = z.object({
  markets: z
    .array(
      z.object({
        name: z.string().describe("Index name, e.g. KOSPI or KOSDAQ"),
        value: z.string().describe("Current index value, e.g. 2,580.42"),
        change: z.string().describe("Change percentage with sign, e.g. +1.24%"),
        up: z.boolean().describe("True if positive change"),
        summary: z.string().describe("One-line AI summary in Korean"),
      })
    )
    .describe("KOSPI and KOSDAQ"),
  headline: z
    .string()
    .describe("Main market headline in Korean, 1-2 sentences"),
  hotStocks: z
    .array(
      z.object({
        name: z.string().describe("Stock name in Korean"),
        reason: z.string().describe("Brief reason in Korean, under 15 chars"),
      })
    )
    .describe("6-8 trending stocks"),
});

export async function POST() {
  try {
    const { object } = await generateObject({
      model: google("gemini-2.5-flash-lite"),
      schema,
      system: `You are a Korean stock market briefing AI. Generate a realistic daily market briefing based on your knowledge of the Korean stock market, current trends, and major companies. All text must be in Korean. Today's date is ${new Date().toISOString().split("T")[0]}. Generate plausible market data and analysis.`,
      prompt: `오늘의 한국 주식시장 브리핑을 생성해주세요. KOSPI와 KOSDAQ 지수 현황, 주요 시장 헤드라인, 그리고 오늘의 주목할 만한 종목 6~8개를 추천해주세요.`,
    });

    return Response.json(object);
  } catch (error: unknown) {
    console.error("Briefing error:", error);
    const message =
      error instanceof Error ? error.message : "브리핑 생성 중 오류가 발생했습니다";
    return Response.json({ error: message }, { status: 500 });
  }
}
