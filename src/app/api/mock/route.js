const BRIEFINGS = [
  {
    markets: [
      {
        name: "KOSPI",
        value: "5251.87",
        change: "-333.00 (-5.96%)",
        up: false,
      },
      {
        name: "KOSDAQ",
        value: "1102.28",
        change: "-52.39 (-4.54%)",
        up: false,
      },
    ],
    headline:
      "중동 지역의 지정학적 긴장 고조와 국제 유가 급등으로 인해 큰 폭의 하락세를 기록했습니다. 유가 급등은 인플레이션 우려를 자극하며 투자 심리를 위축시켰고, 삼성전자와 SK하이닉스가 각각 9.1%, 9.5% 하락하며 지수 하락을 주도했습니다. 금융감독원은 자본시장 불안 요인에 대응하기 위해 긴급 점검 회의를 개최했습니다.",
    hotStocks: [
      "액스비스",
      "DS단석",
      "극동유화",
      "한국ANKOR유전",
      "한국석유",
      "흥구석유",
      "에쓰오일",
      "한미반도체",
    ],
  },
  {
    markets: [
      { name: "KOSPI", value: "5620.31", change: "+87.44 (+1.58%)", up: true },
      { name: "KOSDAQ", value: "1189.56", change: "+23.12 (+1.98%)", up: true },
    ],
    headline:
      "미국 연준의 금리 인하 시사에 글로벌 증시가 동반 상승하며 코스피가 1.58% 올랐습니다. 외국인이 1조 2천억 원 순매수하며 반도체·2차전지 섹터가 강세를 보였고, 기관도 매수 우위를 기록했습니다. 원/달러 환율 하락도 투자 심리에 긍정적으로 작용했습니다.",
    hotStocks: [
      "삼성전자",
      "SK하이닉스",
      "LG에너지솔루션",
      "포스코퓨처엠",
      "에코프로비엠",
      "NAVER",
      "카카오",
    ],
  },
  {
    markets: [
      { name: "KOSPI", value: "5498.72", change: "+12.05 (+0.22%)", up: true },
      { name: "KOSDAQ", value: "1145.33", change: "-8.91 (-0.77%)", up: false },
    ],
    headline:
      "코스피는 삼성전자의 자사주 매입 발표 호재로 소폭 상승했으나, 코스닥은 바이오주 차익 실현 매물로 하락했습니다. 외국인은 코스피에서 순매수, 코스닥에서 순매도를 기록하며 차별화 장세가 이어졌습니다. 미중 무역 협상 재개 소식이 시장에 긍정적 영향을 주었습니다.",
    hotStocks: [
      "삼성전자",
      "현대자동차",
      "기아",
      "셀트리온",
      "삼성바이오로직스",
      "HD현대중공업",
      "한화에어로스페이스",
    ],
  },
  {
    markets: [
      {
        name: "KOSPI",
        value: "5345.10",
        change: "-145.62 (-2.65%)",
        up: false,
      },
      {
        name: "KOSDAQ",
        value: "1098.44",
        change: "-38.20 (-3.36%)",
        up: false,
      },
    ],
    headline:
      "미국 고용 지표 서프라이즈로 금리 인하 기대가 후퇴하며 글로벌 증시가 일제히 하락했습니다. 외국인이 8천억 원 순매도하며 대형주 중심으로 매도 압력이 거셌고, 원/달러 환율은 1,280원대로 상승했습니다. IT·자동차 섹터 약세 속에 방산주만 상대적 강세를 유지했습니다.",
    hotStocks: [
      "한화에어로스페이스",
      "LIG넥스원",
      "한화시스템",
      "현대로템",
      "풍산",
      "한국항공우주",
      "대한항공",
    ],
  },
  {
    markets: [
      { name: "KOSPI", value: "5710.88", change: "+203.15 (+3.69%)", up: true },
      { name: "KOSDAQ", value: "1210.77", change: "+65.42 (+5.71%)", up: true },
    ],
    headline:
      "정부의 AI 산업 육성 패키지 발표에 코스피·코스닥 모두 급등하며 역대 최고치를 경신했습니다. AI·로봇·반도체 관련주가 상한가 행진을 이어갔고, 개인·외국인·기관 모두 순매수하는 트리플 매수가 나타났습니다. 시가총액은 사상 처음으로 3,000조 원을 돌파했습니다.",
    hotStocks: [
      "삼성전자",
      "SK하이닉스",
      "네이버",
      "카카오",
      "두산로보틱스",
      "레인보우로보틱스",
      "코난테크놀로지",
      "솔트룩스",
    ],
  },
];

const ANALYSIS = {
  삼성전자: {
    sentiment: 72,
    summary:
      "삼성전자는 메모리 반도체 업황 회복과 AI 서버용 HBM 수요 증가로 긍정적 흐름을 보이고 있다. 최근 분기 실적이 시장 기대치를 상회하며 외국인 매수세가 이어지고 있다. 다만 중국 경기 둔화와 환율 변동성은 리스크 요인이다.",
    insights: [
      {
        type: "positive",
        text: "HBM3E 양산 본격화로 AI 반도체 매출 증가 기대",
      },
      { type: "trend", text: "외국인 순매수 5거래일 연속 지속" },
      { type: "news", text: "갤럭시 S26 시리즈 사전 예약 역대 최고 기록" },
      { type: "warning", text: "중국 스마트폰 시장 점유율 하락 추세 지속" },
    ],
  },
  SK하이닉스: {
    sentiment: 78,
    summary:
      "SK하이닉스는 AI 메모리 반도체 시장에서 선두를 유지하고 있다. HBM 매출 비중이 크게 확대되며 수익성이 개선되고 있으며, 엔비디아와의 협력이 강화되고 있다. 다만 고점 부담에 따른 차익 실현 가능성이 존재한다.",
    insights: [
      { type: "positive", text: "HBM 시장 점유율 50% 이상 확보" },
      { type: "trend", text: "AI 서버 수요 증가로 DRAM 가격 상승 전환" },
      { type: "news", text: "차세대 HBM4 개발 완료, 하반기 양산 예정" },
      { type: "warning", text: "주가 고점 부담으로 단기 조정 가능성" },
    ],
  },
};

function makeDefault(stock) {
  return {
    sentiment: 55,
    summary: `${stock}은(는) 현재 시장 평균 수준의 흐름을 보이고 있다. 업종 내 경쟁 상황과 글로벌 경기 동향에 따라 향후 방향성이 결정될 전망이다. 실적 발표 시즌을 앞두고 관망세가 이어지고 있다.`,
    insights: [
      { type: "trend", text: `${stock} 업종 평균 수준의 거래량 유지 중` },
      { type: "news", text: `${stock} 다음 분기 실적 발표 예정` },
      {
        type: "positive",
        text: `${stock} 최근 신규 사업 진출 발표로 관심 증가`,
      },
      { type: "warning", text: "글로벌 경기 불확실성에 따른 변동성 주의" },
    ],
  };
}

export async function GET(req) {
  // 응답 지연 시뮬레이션 (1~2초)
  await new Promise((r) => setTimeout(r, 1000 + Math.random() * 1000));

  const stock = new URL(req.url).searchParams.get("stock");

  if (stock) {
    // 현재 브리핑의 hotStocks에 포함된 종목만 허용
    const allStocks = BRIEFINGS.flatMap((b) => b.hotStocks);
    if (!allStocks.includes(stock)) {
      return Response.json(
        { error: `"${stock}" 종목은 지원하지 않습니다` },
        { status: 400 },
      );
    }
    return Response.json(ANALYSIS[stock] || makeDefault(stock));
  }

  // 랜덤으로 브리핑 선택
  const random = BRIEFINGS[Math.floor(Math.random() * BRIEFINGS.length)];
  return Response.json(random);
}
