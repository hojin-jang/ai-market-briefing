import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

const schema = z.object({
  sentiment: z
    .number()
    .min(0)
    .max(100)
    .describe("Market sentiment score, 0 = very bearish, 100 = very bullish"),
  summary: z.string().describe("One-line market summary in Korean"),
  insights: z
    .array(
      z.object({
        type: z.enum(["positive", "trend", "news", "warning"]),
        text: z.string().describe("Insight text in Korean"),
      })
    )
    .describe("3-5 key insights about the stock"),
});

export async function POST(req: Request) {
  try {
    const { stock } = await req.json();

    if (!stock) {
      return Response.json({ error: "종목명이 필요합니다" }, { status: 400 });
    }

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-lite"),
      schema,
      system: `You are a Korean stock market analyst AI. Analyze stocks based on your general knowledge of the company, industry trends, and market dynamics. Provide realistic and balanced analysis in Korean. Today's date is ${new Date().toISOString().split("T")[0]}.`,
      prompt: `한국 주식시장에서 "${stock}" 종목에 대한 시장 분석을 제공해주세요. 현재 시장 상황, 업종 동향, 기업 펀더멘탈 등을 고려하여 분석해주세요.`,
    });

    return Response.json(object);
  } catch (error: unknown) {
    console.error("Analysis error:", error);
    const message =
      error instanceof Error ? error.message : "분석 중 오류가 발생했습니다";
    return Response.json({ error: message }, { status: 500 });
  }
}
