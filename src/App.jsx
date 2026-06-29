import { useState, useRef } from "react";

const INITIAL_PASSWORD = "postal2026!";

// ============================================================
// 법령 내장 DB - 7개 법령 핵심 조문
// ============================================================
const LAW_DB = [
  {
    lawId:"L001", lawName:"근로기준법", lawType:"법률", lastUpdated:"2024-01-01",
    color:"#2563eb",
    articles:[
      { no:"제2조", title:"정의",
        keywords:["근로자","사용자","근로계약","임금"],
        relatedCards:[],
        content:`① 이 법에서 사용하는 용어의 뜻은 다음과 같다.\n1. "근로자"란 직업의 종류와 관계없이 임금을 목적으로 사업이나 사업장에 근로를 제공하는 사람을 말한다.\n2. "사용자"란 사업주 또는 사업 경영 담당자, 그 밖에 근로자에 관한 사항에 대하여 사업주를 위하여 행위하는 자를 말한다.\n4. "근로계약"이란 근로자가 사용자에게 근로를 제공하고 사용자는 이에 대하여 임금을 지급하는 것을 목적으로 체결된 계약을 말한다.\n5. "임금"이란 사용자가 근로의 대가로 근로자에게 임금, 봉급, 그 밖에 어떠한 명칭으로든지 지급하는 일체의 금품을 말한다.` },
      { no:"제50조", title:"근로시간",
        keywords:["근로시간","주40시간","1일8시간","대기시간"],
        relatedCards:["CARD-007","CARD-008","CARD-009"],
        content:`① 1주 간의 근로시간은 휴게시간을 제외하고 40시간을 초과할 수 없다.\n② 1일의 근로시간은 휴게시간을 제외하고 8시간을 초과할 수 없다.\n③ 제1항 및 제2항에 따른 근로시간을 산정함에 있어 작업을 위하여 근로자가 사용자의 지휘·감독 아래에 있는 대기시간 등은 근로시간으로 본다.` },
      { no:"제51조", title:"탄력적 근로시간제",
        keywords:["탄력근로제","교대근무","단위기간"],
        relatedCards:["CARD-010"],
        content:`① 사용자는 취업규칙에서 정하는 바에 따라 2주 이내의 일정한 단위기간을 평균하여 1주 간의 근로시간이 제50조 제1항의 근로시간을 초과하지 아니하는 범위에서 특정한 주에 제50조 제1항의 근로시간을, 특정한 날에 제50조 제2항의 근로시간을 초과하여 근로하게 할 수 있다. 다만, 특정한 주의 근로시간은 48시간을 초과할 수 없다.` },
      { no:"제53조", title:"연장 근로의 제한",
        keywords:["연장근로","초과근무","주12시간"],
        relatedCards:["CARD-005","CARD-006"],
        content:`① 당사자 간에 합의하면 1주 간에 12시간을 한도로 제50조의 근로시간을 연장할 수 있다.\n② 당사자 간에 합의하면 1주 간에 12시간을 한도로 제51조의 근로시간을 연장할 수 있다.` },
      { no:"제54조", title:"휴게",
        keywords:["휴게시간","4시간30분","8시간1시간","자유이용","점심"],
        relatedCards:["CARD-007","CARD-008"],
        content:`① 사용자는 근로시간이 4시간인 경우에는 30분 이상, 8시간인 경우에는 1시간 이상의 휴게시간을 근로시간 도중에 주어야 한다.\n② 휴게시간은 근로자가 자유롭게 이용할 수 있다.` },
      { no:"제55조", title:"휴일",
        keywords:["유급휴일","주휴일","공휴일"],
        relatedCards:[],
        content:`① 사용자는 근로자에게 1주에 평균 1회 이상의 유급휴일을 보장하여야 한다.\n② 사용자는 근로자에게 대통령령으로 정하는 휴일을 유급으로 보장하여야 한다. 다만, 근로자대표와 서면으로 합의한 경우 특정한 근로일로 대체할 수 있다.` },
      { no:"제56조", title:"연장·야간 및 휴일 근로",
        keywords:["연장근로수당","야간수당","휴일수당","50%"],
        relatedCards:["CARD-009"],
        content:`① 사용자는 연장근로에 대하여는 통상임금의 100분의 50 이상을 가산하여 근로자에게 지급하여야 한다.\n② 사용자는 휴일근로에 대하여는 다음 각 호의 기준에 따른 금액 이상을 가산하여야 한다.\n1. 8시간 이내의 휴일근로: 통상임금의 100분의 50\n2. 8시간을 초과한 휴일근로: 통상임금의 100분의 100\n③ 사용자는 야간근로(오후 10시부터 다음 날 오전 6시 사이의 근로를 말한다)에 대하여는 통상임금의 100분의 50 이상을 가산하여 근로자에게 지급하여야 한다.` },
      { no:"제60조", title:"연차 유급휴가",
        keywords:["연차휴가","유급휴가","15일","연차계산","휴가청구"],
        relatedCards:["CARD-011"],
        content:`① 사용자는 1년간 80퍼센트 이상 출근한 근로자에게 15일의 유급휴가를 주어야 한다.\n② 사용자는 계속하여 근로한 기간이 1년 미만인 근로자 또는 1년간 80퍼센트 미만 출근한 근로자에게 1개월 개근 시 1일의 유급휴가를 주어야 한다.\n④ 사용자는 3년 이상 계속하여 근로한 근로자에게는 제1항에 따른 휴가에 최초 1년을 초과하는 계속 근로 연수 매 2년에 대하여 1일을 가산한 유급휴가를 주어야 한다. 이 경우 가산휴가를 포함한 총 휴가 일수는 25일을 한도로 한다.\n⑤ 사용자는 제1항부터 제4항까지의 규정에 따른 휴가를 근로자가 청구한 시기에 주어야 한다.` },
      { no:"제76조의2", title:"직장 내 괴롭힘의 금지",
        keywords:["직장내괴롭힘","금지","우위","정신적고통","근무환경"],
        relatedCards:["CARD-015","CARD-016","CARD-017","CARD-018","CARD-019"],
        content:`사용자 또는 근로자는 직장에서의 지위 또는 관계 등의 우위를 이용하여 업무상 적정범위를 넘어 다른 근로자에게 신체적·정신적 고통을 주거나 근무환경을 악화시키는 행위(이하 "직장 내 괴롭힘"이라 한다)를 하여서는 아니 된다.` },
      { no:"제76조의3", title:"직장 내 괴롭힘 발생 시 조치",
        keywords:["직장내괴롭힘","신고","조사의무","피해자보호","분리조치","불이익금지"],
        relatedCards:["CARD-019","CARD-020","CARD-021"],
        content:`① 누구든지 직장 내 괴롭힘 발생 사실을 알게 된 경우 그 사실을 사용자에게 신고할 수 있다.\n② 사용자는 제1항에 따른 신고를 접수하거나 직장 내 괴롭힘 발생 사실을 인지한 경우에는 지체 없이 당사자 등을 대상으로 그 사실 확인을 위하여 객관적으로 조사를 실시하여야 한다.\n③ 사용자는 조사 기간 동안 피해근로자등을 보호하기 위하여 필요한 경우 해당 피해근로자등에 대하여 근무장소의 변경, 유급휴가 명령 등 적절한 조치를 하여야 한다. 이 경우 사용자는 피해근로자등의 의사에 반하는 조치를 하여서는 아니 된다.\n④ 사용자는 조사 결과 직장 내 괴롭힘 발생 사실이 확인된 때에는 피해근로자가 요청하면 근무장소의 변경, 배치전환, 유급휴가 명령 등 적절한 조치를 하여야 한다.\n⑤ 사용자는 조사 결과 직장 내 괴롭힘 발생 사실이 확인된 때에는 지체 없이 행위자에 대하여 징계, 근무장소의 변경 등 필요한 조치를 하여야 한다.\n⑥ 사용자는 직장 내 괴롭힘 발생 사실을 신고한 근로자 및 피해근로자등에게 해고나 그 밖의 불리한 처우를 하여서는 아니 된다.` },
    ]
  },
  {
    lawId:"L002", lawName:"국가공무원 복무규정", lawType:"대통령령", lastUpdated:"2024-01-01",
    color:"#7c3aed",
    articles:[
      { no:"제2조", title:"근무시간",
        keywords:["근무시간","주40시간","오전9시","오후6시","점심시간"],
        relatedCards:["CARD-007","CARD-008"],
        content:`① 공무원의 1주간 근무시간은 점심시간을 제외하고 40시간으로 하며, 토요일은 휴무함을 원칙으로 한다.\n② 공무원의 1일 근무시간은 오전 9시부터 오후 6시까지로 하되, 점심시간은 낮 12시부터 오후 1시까지로 한다.\n③ 행정기관의 장은 직무의 성질, 지역 또는 기관의 특수성을 고려하여 필요한 경우에는 1시간의 범위에서 점심시간을 달리 정할 수 있다.` },
      { no:"제4조", title:"초과근무",
        keywords:["초과근무","시간외근무","사전명령"],
        relatedCards:["CARD-005","CARD-006"],
        content:`① 행정기관의 장은 공무 수행상 필요한 경우에는 공무원에게 제2조의 근무시간 외 근무(이하 "초과근무"라 한다)를 명할 수 있다.\n② 초과근무를 명하는 경우에는 해당 공무원에게 미리 알려야 한다.\n③ 초과근무는 업무수행을 위해 반드시 필요한 최소한의 범위에서 운영되어야 한다.` },
      { no:"제9조", title:"연가",
        keywords:["연가","연가일수","재직기간","연가청구","연가거부"],
        relatedCards:["CARD-011"],
        content:`① 공무원의 연가 일수는 재직기간별로 다음과 같다.\n1. 1개월 이상 1년 미만: 11일\n2. 1년 이상 2년 미만: 12일\n3. 2년 이상 3년 미만: 14일\n4. 3년 이상 4년 미만: 15일\n5. 4년 이상 5년 미만: 17일\n6. 5년 이상 6년 미만: 20일\n7. 6년 이상: 21일\n② 행정기관의 장은 공무원이 연가를 원하는 시기에 줄 수 없을 때에는 그 시기를 변경할 수 있다. 다만, 공무원이 청구한 시기에 연가를 주지 아니할 경우에는 그 사유를 명확히 하여야 한다.` },
      { no:"제18조", title:"병가",
        keywords:["병가","연60일","진단서","6일이상"],
        relatedCards:["CARD-012"],
        content:`① 행정기관의 장은 공무원이 질병 또는 부상으로 직무를 수행할 수 없을 때 연 60일의 범위에서 병가를 허가할 수 있다.\n② 질병이나 부상으로 인한 지각·조퇴 및 외출은 누계 8시간을 병가 1일로 계산한다.\n③ 병가 중 연속 6일 이상이면 의사의 진단서를 첨부하여야 하며, 연간 6일 이하의 병가는 진단서 없이 허가할 수 있다.` },
      { no:"제19조", title:"공가",
        keywords:["공가","병역","헌혈","법정출두"],
        relatedCards:[],
        content:`행정기관의 장은 공무원이 다음 각 호의 어느 하나에 해당하는 경우에는 이에 직접 필요한 기간에 대하여 공가(公暇)를 허가하여야 한다.\n1. 병역법 또는 예비군법에 따른 병역의무의 이행\n2. 공무에 관한 증인, 증거물 제출, 법정 출두\n3. 천재지변, 교통 차단 또는 그 밖의 사유로 출근이 불가능할 때\n4. 혈액관리법에 따른 헌혈` },
      { no:"제20조", title:"특별휴가",
        keywords:["특별휴가","경조사","출산휴가","결혼","사망"],
        relatedCards:[],
        content:`① 행정기관의 장은 공무원이 결혼, 입양, 사망 등 경조사가 있는 경우에는 경조사별로 규정한 기간의 휴가를 주어야 한다.\n② 임신 중의 공무원에게는 출산 전·후를 통하여 90일(한 번에 둘 이상의 자녀를 임신한 경우에는 120일)의 출산휴가를 주어야 한다.` },
      { no:"제24조", title:"복무의무",
        keywords:["복무의무","직무전념","명령복종","성실의무"],
        relatedCards:["CARD-001","CARD-002","CARD-003"],
        content:`공무원은 직무에 전념하여야 하고, 상관의 직무상 명령에 복종하여야 하며, 직무를 성실히 수행하여야 한다.` },
      { no:"제26조", title:"출장",
        keywords:["출장","공무외여행","사적용무","출장결과보고"],
        relatedCards:["CARD-013"],
        content:`① 공무원이 출장 중 다른 지역에서 공무외의 여행을 하거나, 공무수행과 관계없이 체재일수를 연장하는 행위는 허용되지 아니한다.\n② 출장 명령을 받은 공무원은 출장 복귀 후 지체 없이 출장 결과를 보고하여야 한다.` },
    ]
  },
  {
    lawId:"L003", lawName:"공무원 징계령", lawType:"대통령령", lastUpdated:"2024-01-01",
    color:"#dc2626",
    articles:[
      { no:"제1조의2", title:"징계의 종류",
        keywords:["징계종류","파면","해임","강등","정직","감봉","견책"],
        relatedCards:["CARD-027","CARD-028"],
        content:`공무원에 대한 징계는 파면, 해임, 강등, 정직, 감봉 및 견책으로 구분한다.\n\n① 파면: 공무원 신분 박탈, 5년간 공무원 임용 금지\n② 해임: 공무원 신분 박탈, 3년간 공무원 임용 금지\n③ 강등: 1계급 아래로 직급을 내리고 3개월간 직무에 종사하지 못하며, 그 기간 중 보수는 전액을 감한다.\n④ 정직: 1개월 이상 3개월 이하의 기간 동안 직무에 종사하지 못하며, 그 기간 중 보수는 전액을 감한다.\n⑤ 감봉: 1개월 이상 3개월 이하의 기간 동안 보수의 3분의 1을 감한다.\n⑥ 견책: 전과에 대하여 훈계하고 회개하게 한다.` },
      { no:"제7조", title:"징계위원회의 구성",
        keywords:["징계위원회","구성","위원","의결","민간위원"],
        relatedCards:["CARD-028"],
        content:`① 징계위원회는 위원장 1명을 포함한 7명 이상 15명 이하의 위원으로 구성한다.\n② 위원의 3분의 1 이상은 민간위원으로 하되, 민간위원은 재직 기간이 20년 이상인 전직 공무원 또는 법률, 회계, 인사, 노무 분야의 전문적 지식과 경험이 있는 자이어야 한다.\n③ 징계위원회는 위원장 및 4명 이상의 위원이 출석하여야 의결할 수 있다.` },
      { no:"제9조", title:"징계등 의결의 요구",
        keywords:["징계의결요구","서면","30일이내"],
        relatedCards:["CARD-028"],
        content:`① 징계의결 등을 요구하는 기관의 장은 징계위원회에 징계의결 등을 요구하여야 한다.\n② 징계의결 등 요구는 서면으로 하여야 하며, 사건의 개요, 혐의 내용과 관련 법령, 혐의자의 의견진술 기회 부여 사실 여부 등이 포함되어야 한다.\n④ 징계의결 등을 요구받은 징계위원회는 그 요구서를 받은 날부터 30일 이내에 징계에 관한 의결을 하여야 한다.` },
      { no:"제11조", title:"진술권의 보장",
        keywords:["진술권","진술기회","의견진술","방어권"],
        relatedCards:["CARD-024","CARD-028"],
        content:`징계위원회가 징계의결 등을 할 때에는 징계혐의자에게 진술의 기회를 부여하여야 한다. 다만, 징계혐의자가 진술을 거부하거나 출석하지 아니한 때에는 그러하지 아니하다.` },
      { no:"제16조", title:"징계양정",
        keywords:["징계양정","비위유형","과실","행실","참작"],
        relatedCards:["CARD-027","CARD-028"],
        content:`징계위원회는 징계혐의자의 비위의 유형, 비위의 정도 및 과실의 경중과 평소의 행실, 근무성적, 공적, 뉘우치는 정도와 그 밖의 정황을 참작하여 징계를 의결한다.` },
      { no:"제17조", title:"징계의 시효",
        keywords:["징계시효","3년","5년","10년","금품수수","성희롱"],
        relatedCards:["CARD-029"],
        content:`① 징계의결 등의 요구는 징계 등의 사유가 발생한 날부터 다음 각 호의 기간이 경과하면 하지 못한다.\n1. 특별한 비위(국가재정법 위반 등): 10년\n2. 다음 각 목에 해당하는 비위: 5년\n   가. 금품 및 향응 수수\n   나. 공금의 횡령·유용\n   다. 성폭력범죄\n   라. 성희롱\n3. 그 밖의 비위: 3년` },
    ]
  },
  {
    lawId:"L004", lawName:"공공감사에 관한 법률", lawType:"법률", lastUpdated:"2024-01-01",
    color:"#059669",
    articles:[
      { no:"제2조", title:"정의",
        keywords:["감사정의","자체감사","감사기구"],
        relatedCards:["CARD-023"],
        content:`이 법에서 사용하는 용어의 뜻은 다음과 같다.\n1. "감사"란 감사기구가 자체감사기관 및 그 소속 공무원 등의 업무와 회계를 조사·점검·확인·분석·검증하고 그 결과를 처리하는 일련의 감사 과정을 말한다.\n2. "자체감사"란 중앙행정기관등의 감사기구의 장이 그 소속 기관 및 그 소속 공무원 등의 업무와 회계를 감사하는 것을 말한다.` },
      { no:"제23조", title:"감사 실시",
        keywords:["감사실시","사전통보","감사기간","10일"],
        relatedCards:["CARD-023"],
        content:`① 감사기구의 장은 감사를 실시하기 전에 감사대상기관의 장에게 감사의 목적, 종류, 범위, 기간 등을 서면으로 통보하여야 한다. 다만, 사전통보로 인하여 감사 목적을 달성하기 어렵다고 인정되는 경우에는 감사를 착수한 후에 통보할 수 있다.\n② 감사 실시기간은 특별한 사유가 없으면 10일을 초과할 수 없다.` },
      { no:"제25조", title:"자료제출 요구 등",
        keywords:["자료제출","자료요구","출석답변","감사협조"],
        relatedCards:["CARD-024","CARD-025"],
        content:`① 감사기구의 장은 감사를 위하여 필요한 때에는 감사대상기관의 장에게 관련 자료 및 물건의 제출을 요구하거나 소속 공무원 등의 출석·답변을 요청할 수 있다.\n② 감사기구의 장은 감사를 위하여 필요한 때에는 전자정보처리조직에 의하여 처리되는 자료에 대한 조사를 요구할 수 있다.\n③ 제1항 및 제2항에 따른 자료 제출 등의 요구를 받은 기관의 장은 특별한 사유가 없으면 이에 따라야 한다.` },
      { no:"제33조", title:"감사결과의 처리",
        keywords:["감사결과처리","시정요구","징계요구","주의요구","수사의뢰"],
        relatedCards:["CARD-026"],
        content:`① 감사기구의 장은 감사결과 위법 또는 부당하다고 인정되는 사실이 있을 때에는 소속 장관 등에게 다음 각 호의 요구 또는 통보를 할 수 있다.\n1. 시정 요구: 위법 또는 부당한 사항에 대한 취소·변경·중지\n2. 주의 요구: 주의 또는 개선\n3. 징계 또는 문책 요구: 관계 공무원 등에 대한 징계 또는 문책\n4. 수사 의뢰: 범죄 혐의가 있다고 인정되는 경우` },
      { no:"제36조", title:"감사 결과에 대한 이의신청",
        keywords:["이의신청","30일이내","감사결과","불복"],
        relatedCards:["CARD-026"],
        content:`① 감사 결과에 따른 처분에 이의가 있는 관계 공무원 등은 그 처분이 있음을 안 날부터 30일 이내에 감사기구의 장에게 이의신청을 할 수 있다.\n② 감사기구의 장은 이의신청이 이유 있다고 인정하면 그에 따른 적절한 조치를 하여야 한다.` },
    ]
  },
  {
    lawId:"L005", lawName:"우정사업본부 현업관서직원 복무관리규정", lawType:"행정규칙", lastUpdated:"2024-01-01",
    color:"#d97706",
    articles:[
      { no:"제1조", title:"목적",
        keywords:["목적","현업관서","복무관리"],
        relatedCards:[],
        content:`이 규정은 우정사업본부 소속 현업관서에 근무하는 직원의 복무관리에 관하여 국가공무원 복무규정 등에서 위임된 사항 및 시행에 필요한 사항을 규정함을 목적으로 한다.` },
      { no:"제3조", title:"근무시간",
        keywords:["근무시간","집배원","창구직원","탄력근무"],
        relatedCards:["CARD-007","CARD-008","CARD-009","CARD-010"],
        content:`① 현업관서 직원의 근무시간은 국가공무원 복무규정 제2조에 따르되, 업무 특성상 필요한 경우 기관장은 근무시간을 달리 정할 수 있다.\n② 집배원의 경우 배달 업무의 특성을 고려하여 탄력적 근무시간제를 운영할 수 있다.\n③ 창구직원의 경우 민원서비스 제공을 위해 근무시간을 조정하여 운영할 수 있으며, 이 경우 직원 대표와 협의하여야 한다.` },
      { no:"제5조", title:"출근 및 퇴근",
        keywords:["출퇴근","근태기록","대리입력금지","지각","조퇴","외출"],
        relatedCards:["CARD-001","CARD-002","CARD-003","CARD-006"],
        content:`① 직원은 소정의 근무시간 전에 출근하여 근무를 준비하여야 한다.\n② 직원은 출퇴근 시 전자시스템을 통해 근태를 기록하여야 하며, 이를 임의로 조작하거나 타인이 대신 처리하게 하여서는 아니 된다.\n③ 지각·조퇴·외출의 경우 사전에 관리자의 승인을 받아야 하며, 긴급한 사유가 있을 때에는 사후 지체 없이 보고하여야 한다.\n④ 관리자는 소속 직원의 출퇴근 현황을 일별로 확인·관리하여야 한다.` },
      { no:"제7조", title:"근무지 이탈 금지",
        keywords:["근무지이탈","무단이탈","외출승인","복귀"],
        relatedCards:["CARD-004"],
        content:`① 직원은 근무시간 중 정당한 사유 없이 근무지를 이탈할 수 없다.\n② 업무상 외출이 필요한 경우에는 사전에 관리자의 승인을 받아야 하며, 외출 종료 후에는 즉시 복귀하여야 한다.\n③ 관리자는 직원의 근무지 이탈이 확인된 경우 사유를 파악하고 필요한 조치를 취하여야 한다.` },
      { no:"제9조", title:"초과근무 관리",
        keywords:["초과근무","사전명령","허위입력","수당","보상휴가"],
        relatedCards:["CARD-005","CARD-006"],
        content:`① 초과근무는 관리자의 사전 명령에 의하여만 인정되며, 무명령 초과근무는 수당 지급 대상이 되지 아니한다.\n② 관리자는 초과근무 사실을 확인하고 서명함으로써 초과근무를 승인하여야 한다.\n③ 초과근무 시간의 기록은 실제 근무 사실에 근거하여야 하며, 허위로 입력하거나 실제보다 과다하게 기록하는 행위는 비위 행위에 해당한다.\n④ 초과근무 수당은 예산의 범위 안에서 지급하며, 시간 외 근무를 수당 대신 보상휴가로 대체할 수 있다.` },
      { no:"제11조", title:"휴게시간 운영",
        keywords:["휴게시간","대기금지","교대휴게","창구운영"],
        relatedCards:["CARD-007","CARD-008"],
        content:`① 현업관서는 근로기준법 제54조에 따른 휴게시간을 반드시 부여하여야 한다.\n② 휴게시간에 직원에게 업무 대기를 지시하거나 민원 처리를 위해 대기토록 하는 행위는 금지된다.\n③ 창구 운영 등으로 인해 휴게시간 운영이 어려운 경우, 교대제 방식으로 휴게시간을 보장하여야 한다.` },
      { no:"제13조", title:"출장",
        keywords:["출장","출장명령","사적용무금지","출장결과보고"],
        relatedCards:["CARD-013"],
        content:`① 직원이 출장을 하고자 하는 때에는 사전에 출장명령을 받아야 한다.\n② 출장 중에는 공무 목적에 따라 성실히 업무를 수행하여야 하며, 사적인 용무를 위하여 출장 일정을 임의로 변경하거나 체재일수를 연장하여서는 아니 된다.\n③ 출장 복귀 후에는 출장 결과를 보고하여야 한다.` },
      { no:"제15조", title:"복무위반 처리",
        keywords:["복무위반","경고","사실확인","징계","감사"],
        relatedCards:["CARD-001","CARD-002","CARD-003","CARD-004"],
        content:`① 관리자는 소속 직원의 복무위반 사항을 발견한 경우 즉시 사실관계를 확인하고 필요한 조치를 취하여야 한다.\n② 경미한 복무위반에 대하여는 구두 또는 서면으로 경고할 수 있다.\n③ 반복적이거나 고의적인 복무위반, 또는 그 정도가 중한 경우에는 감사 또는 징계 절차를 진행할 수 있다.\n④ 관리자는 복무위반 발생 상황을 기록·관리하여야 한다.` },
    ]
  },
  {
    lawId:"L006", lawName:"우정사업본부 감사 및 조사에 관한 규정", lawType:"행정규칙", lastUpdated:"2024-01-01",
    color:"#0891b2",
    articles:[
      { no:"제1조", title:"목적",
        keywords:["목적","감사","조사","적법"],
        relatedCards:[],
        content:`이 규정은 우정사업본부 및 그 소속 기관의 업무 수행이 적법하고 효율적으로 이루어지도록 하기 위하여 감사 및 조사의 종류, 절차, 방법 및 처리에 관한 사항을 규정함을 목적으로 한다.` },
      { no:"제4조", title:"감사의 종류",
        keywords:["감사종류","종합감사","특정감사","복무감사","재무감사"],
        relatedCards:["CARD-023"],
        content:`감사는 다음 각 호와 같이 구분한다.\n1. 종합감사: 소속 기관의 업무 전반에 대하여 실시하는 감사\n2. 특정감사: 특정 사안이나 부서에 대하여 집중적으로 실시하는 감사\n3. 복무감사: 소속 직원의 근무상황 및 복무실태를 점검하는 감사\n4. 재무감사: 예산 집행, 회계 처리 등 재무에 관한 사항을 감사\n5. 일상감사: 주요 업무 처리 전에 적법성 여부를 심사` },
      { no:"제8조", title:"감사 착수",
        keywords:["감사착수","사전통보","수시감사","감사계획"],
        relatedCards:["CARD-023"],
        content:`① 감사는 감사계획에 따라 실시하는 것을 원칙으로 하되, 긴급한 경우에는 수시로 실시할 수 있다.\n② 감사를 실시할 때에는 원칙적으로 사전에 감사 대상 기관에 통보하여야 하나, 사전 통보로 인하여 감사 목적 달성이 어려운 경우에는 예외로 할 수 있다.\n③ 감사반은 감사 착수 시 감사반원증을 제시하여야 한다.` },
      { no:"제12조", title:"자료 제출 요구 및 확보",
        keywords:["자료제출","CCTV","전산기록","자료확보","목적외사용금지"],
        relatedCards:["CARD-024","CARD-025"],
        content:`① 감사반은 감사를 위하여 필요한 경우 감사 대상 기관의 장에게 관련 자료의 제출을 요구할 수 있다.\n② 감사반은 자료 제출 요구 시 제출 자료의 범위와 제출 기한을 명시하여야 한다.\n③ CCTV 영상, 전산기록 등 전자적 형태의 자료를 확보할 때에는 관련 법령에 따른 절차를 준수하여야 한다.\n④ 감사반이 확보한 자료는 감사 목적 이외의 용도로 사용하여서는 아니 된다.` },
      { no:"제14조", title:"진술 청취",
        keywords:["진술청취","진술서","강요금지","유도금지","서명"],
        relatedCards:["CARD-024"],
        content:`① 감사반은 감사 과정에서 관련자의 진술을 청취할 수 있다.\n② 진술 청취 시에는 진술인에게 사전에 진술 내용이 감사 자료로 활용될 수 있음을 고지하여야 한다.\n③ 진술서는 진술인이 자유롭게 작성하도록 하여야 하며, 진술 내용에 대한 강요 또는 유도는 금지된다.\n④ 진술 완료 후 진술인의 서명을 받아야 하며, 진술인이 서명을 거부하는 경우에는 그 사유를 기록하여야 한다.` },
      { no:"제18조", title:"감사결과 처리",
        keywords:["감사결과처리","시정","주의","징계요구","수사의뢰"],
        relatedCards:["CARD-026"],
        content:`① 감사결과는 다음 각 호와 같이 처리한다.\n1. 시정: 위법·부당한 사항을 바로잡도록 요구\n2. 주의: 경미한 과실에 대한 주의 촉구\n3. 통보: 참고하거나 자율적으로 처리하도록 알림\n4. 징계 요구: 관련자에 대한 징계 절차 착수 요청\n5. 고발 또는 수사 의뢰: 범죄 혐의가 인정되는 경우\n② 감사결과에 대하여 이의가 있는 경우 30일 이내에 이의를 제기할 수 있다.` },
    ]
  },
  {
    lawId:"L007", lawName:"우정사업본부 소속공무원 징계업무 규정", lawType:"행정규칙", lastUpdated:"2024-01-01",
    color:"#be185d",
    articles:[
      { no:"제1조", title:"목적",
        keywords:["목적","징계","처리절차","공정성"],
        relatedCards:[],
        content:`이 규정은 우정사업본부 소속 공무원에 대한 징계업무의 처리 절차와 기준에 관하여 필요한 사항을 규정함으로써 공정하고 일관성 있는 징계업무 처리를 도모함을 목적으로 한다.` },
      { no:"제4조", title:"징계 사유",
        keywords:["징계사유","의무위반","직무태만","체면손상","복무위반"],
        relatedCards:["CARD-028"],
        content:`소속 공무원이 다음 각 호의 어느 하나에 해당하는 경우에는 징계를 할 수 있다.\n1. 국가공무원법 및 이 법에 따른 명령을 위반한 경우\n2. 직무상의 의무를 위반하거나 직무를 태만히 한 경우\n3. 직무 내·외를 불문하고 그 체면 또는 위신을 손상하는 행위를 한 경우\n4. 복무규정, 감사 결과 및 처분 요구 사항을 위반한 경우` },
      { no:"제6조", title:"징계의결 요구 절차",
        keywords:["징계의결요구","절차","의결요구서","증거자료"],
        relatedCards:["CARD-028"],
        content:`① 징계의결 요구는 다음 절차에 따른다.\n1단계: 비위 사실 인지 또는 감사결과 처분 요구 접수\n2단계: 사실관계 조사 및 확인\n3단계: 당사자 의견 청취 기회 부여\n4단계: 징계의결 요구서 작성 (사건개요, 혐의내용, 관련법령, 의견 포함)\n5단계: 소청기관 등 보고 후 징계위원회에 제출\n② 징계의결 요구서에는 감사 관련 기록, 진술서, 증거자료 등을 첨부하여야 한다.` },
      { no:"제8조", title:"징계 양정 기준",
        keywords:["징계양정","고의성","반복성","피해정도","감경","가중"],
        relatedCards:["CARD-027","CARD-028"],
        content:`① 비위의 유형별 징계 양정 기준은 별표에 따른다.\n② 징계 양정 시 다음 사항을 참작한다.\n1. 비위의 고의성 여부\n2. 비위 행위의 반복성 및 지속성\n3. 피해의 정도와 파급 효과\n4. 뉘우치는 정도 및 개선 의지\n5. 이전 징계처분 이력\n6. 공적 및 근무 성적\n③ 음주운전, 성 비위, 금품수수 등 특정 비위에 대하여는 가중 처분을 원칙으로 한다.` },
      { no:"제10조", title:"경고 및 주의 처분",
        keywords:["경고","주의","서면경고","경미한비위","가중처분"],
        relatedCards:["CARD-027"],
        content:`① 비위의 정도가 경미하거나 정상 참작 사유가 있는 경우에는 징계 대신 경고 또는 주의 조치를 할 수 있다.\n② 경고는 서면으로 하여야 하며, 처분을 받는 자의 서명을 받아야 한다.\n③ 동일 또는 유사한 비위로 경고 또는 주의 처분을 받은 경우에는 가중 처분의 근거가 된다.\n④ 경고 및 주의 처분 기록은 3년간 보관한다.` },
      { no:"제12조", title:"징계 감경 및 가중",
        keywords:["징계감경","징계가중","고의","과실","공적","반복"],
        relatedCards:["CARD-027","CARD-028","CARD-029"],
        content:`① 다음 각 호의 경우에는 징계를 감경할 수 있다.\n1. 비위 행위가 고의가 아닌 경우\n2. 직무 수행 중 발생한 과실의 경우\n3. 뉘우치는 정도가 크고 개선이 기대되는 경우\n4. 공적이 현저한 경우\n② 다음 각 호의 경우에는 징계를 가중하여야 한다.\n1. 동일 또는 유사한 비위로 처분받은 이력이 있는 경우\n2. 비위 행위가 고의적이거나 계획적인 경우\n3. 피해 규모가 크거나 파급 효과가 심각한 경우` },
    ]
  },
];

// ============================================================
// DB 버전 이력
// ============================================================
const DB_VERSION_HISTORY = [
  {
    version: "v1.0",
    date: "2026-06-29",
    author: "초기 구축",
    summary: "시스템 초기 구축",
    changes: [
      { type: "added", target: "law", label: "근로기준법", detail: "10개 핵심 조문 수록 (제2·50·51·53·54·55·56·60·76조의2·76조의3)" },
      { type: "added", target: "law", label: "국가공무원 복무규정", detail: "8개 핵심 조문 수록" },
      { type: "added", target: "law", label: "공무원 징계령", detail: "6개 핵심 조문 수록" },
      { type: "added", target: "law", label: "공공감사에 관한 법률", detail: "5개 핵심 조문 수록" },
      { type: "added", target: "law", label: "우정사업본부 현업관서직원 복무관리규정", detail: "8개 핵심 조문 수록" },
      { type: "added", target: "law", label: "우정사업본부 감사 및 조사에 관한 규정", detail: "6개 핵심 조문 수록" },
      { type: "added", target: "law", label: "우정사업본부 소속공무원 징계업무 규정", detail: "6개 핵심 조문 수록" },
      { type: "added", target: "card", label: "업무카드 30종", detail: "복무·근무시간·휴가·괴롭힘·감사·징계·예방교육 전 영역" },
    ],
  },
];

const CATEGORIES = {
  "복무관리": ["근태", "출장", "근무지이탈"],
  "근무시간": ["초과근무", "휴게시간", "야간근무", "교대근무"],
  "휴가·휴직": ["연가", "병가", "공가", "특별휴가"],
  "직장내괴롭힘": ["폭언", "업무배제", "갑질", "성희롱"],
  "감사·조사": ["복무감사", "특정감사", "자료확보"],
  "징계·문책": ["징계의결", "주의경고", "징계시효"],
  "예방교육": ["정기교육", "체크리스트"],
};

const CARDS_DATA = [
  {
    id: "CARD-001", title: "무단결근 발생 시 지도 및 조치 기준",
    category1: "복무관리", category2: "근태",
    summary: "정당한 승인 없이 출근하지 않은 경우 복무 위반 소지가 있으며, 사실관계 확인 후 지도·경고·징계 검토가 필요하다.",
    legal: ["L001", "L005"],
    keywords: ["무단결근", "미출근", "연락두절", "근무지이탈", "복무위반"],
    process: ["출근 여부 확인", "연락 시도 및 사유 확인", "증빙자료 확보", "1차 지도 또는 경고", "반복·고의성 확인 시 조사 또는 징계 검토"],
    caution: "징계 판단은 사실관계, 고의성, 반복성, 피해 정도, 기존 처분 이력 등을 종합해 판단해야 한다.",
    evidence: ["출퇴근 기록", "연락 시도 기록", "동료 진술서"],
    severity: "high",
  },
  {
    id: "CARD-002", title: "반복 지각 지도 기준",
    category1: "복무관리", category2: "근태",
    summary: "정당한 사유 없이 반복적으로 지각하는 경우 1차 구두 지도 후 서면 경고, 반복 시 징계 검토.",
    legal: ["L001", "L005"],
    keywords: ["지각", "반복지각", "근태불량", "복무위반"],
    process: ["지각 횟수·패턴 확인", "사유 청취", "1차 구두 지도", "2차 이상 서면 경고", "반복 시 징계 검토"],
    caution: "지각 횟수보다 고의성과 개선 의지가 징계 양정에 더 중요하다.",
    evidence: ["출퇴근 기록", "지각 경위서"],
    severity: "medium",
  },
  {
    id: "CARD-003", title: "조퇴·외출 남용 지도 기준",
    category1: "복무관리", category2: "근태",
    summary: "외출·조퇴는 관리자 사전 승인이 필요하며, 무단 이탈 또는 반복 남용은 복무 위반으로 처리한다.",
    legal: ["L001", "L005"],
    keywords: ["조퇴", "외출", "무단외출", "복무위반"],
    process: ["사전 승인 여부 확인", "사유 확인", "반복 여부 파악", "지도 또는 경고"],
    caution: "사전 승인 없는 외출이라도 긴급상황(의료 등)은 사유 확인 후 판단.",
    evidence: ["출퇴근 기록", "승인 기록"],
    severity: "medium",
  },
  {
    id: "CARD-004", title: "근무지 무단이탈 조치 기준",
    category1: "복무관리", category2: "근무지이탈",
    summary: "근무시간 중 근무지를 무단으로 벗어나는 행위는 복무 위반이며, 이탈 시간·반복성에 따라 조치 수준이 달라진다.",
    legal: ["L001", "L005"],
    keywords: ["근무지이탈", "자리비움", "무단이탈", "복귀안함"],
    process: ["이탈 사실 확인 (CCTV, 동료 진술)", "사유 청취", "이탈 시간 파악", "지도 또는 조사 착수"],
    caution: "휴게시간 중 이탈은 해당 없음. 근무시간 기준 명확히 할 것.",
    evidence: ["CCTV 기록", "동료 진술", "전자출입 기록"],
    severity: "high",
  },
  {
    id: "CARD-005", title: "초과근무 허위입력 조사 기준",
    category1: "근무시간", category2: "초과근무",
    summary: "실제 근무하지 않았음에도 초과근무를 입력한 경우 허위공문서 작성 및 부당수령에 해당할 수 있다.",
    legal: ["L001", "L003", "L005"],
    keywords: ["초과근무", "시간외허위입력", "초근부풀림", "대리입력"],
    process: ["시스템 입력 기록 확인", "실제 근무 여부 확인 (CCTV, 출입기록)", "관련자 진술 확보", "조사 또는 감사 착수"],
    caution: "관리자가 지시하거나 묵인한 경우 관리자도 연대 책임 가능성 있음.",
    evidence: ["초과근무 입력 기록", "CCTV", "출입기록", "진술서"],
    severity: "high",
  },
  {
    id: "CARD-006", title: "대리 출퇴근 적발 조치",
    category1: "근무시간", category2: "초과근무",
    summary: "타인의 출퇴근 기록을 대신 입력하거나 처리하는 행위는 중징계 사유가 될 수 있다.",
    legal: ["L001", "L003", "L005"],
    keywords: ["대리출퇴근", "대리입력", "허위출근", "복무위반"],
    process: ["제보 또는 이상 징후 확인", "기록 조회", "당사자 대면 조사", "징계 착수"],
    caution: "요청자와 대리 입력자 모두 처분 대상. 강요 여부도 확인 필요.",
    evidence: ["시스템 로그", "CCTV", "진술서"],
    severity: "high",
  },
  {
    id: "CARD-007", title: "휴게시간 미부여 확인 및 지도",
    category1: "근무시간", category2: "휴게시간",
    summary: "일정 시간 이상 근무 시 법정 휴게시간을 부여해야 하며, 대기 상태로 운영하는 것은 위반이다.",
    legal: ["L002"],
    keywords: ["휴게시간", "점심시간", "대기시간", "창구대기", "전화대기"],
    process: ["근무시간 확인", "휴게 부여 여부 확인", "대기업무 지시 여부 파악", "근무표 개선 지도"],
    caution: "근로기준법상 4시간 근무 시 30분, 8시간 근무 시 1시간 부여 의무. 공무직·기간제에 적용.",
    evidence: ["근무표", "업무지시 기록", "직원 진술"],
    severity: "medium",
  },
  {
    id: "CARD-008", title: "점심시간 업무대기 지시 지도",
    category1: "근무시간", category2: "휴게시간",
    summary: "점심시간 중 민원 대기, 전화 대기, 우편물 분류 대기 지시는 휴게시간 침해에 해당한다.",
    legal: ["L002"],
    keywords: ["점심시간", "업무대기", "휴게침해", "창구대기"],
    process: ["대기 지시 사실 확인", "대체인력 편성 여부 확인", "근무표 개선 지도"],
    caution: "교대제 운영 등 합법적 대기와 구분 필요.",
    evidence: ["근무표", "지시 기록", "직원 진술"],
    severity: "medium",
  },
  {
    id: "CARD-009", title: "야간근무 관리 기준",
    category1: "근무시간", category2: "야간근무",
    summary: "야간근무(오후 10시~오전 6시)는 가산수당 지급 대상이며, 별도 안전관리 조치가 필요하다.",
    legal: ["L001", "L002", "L005"],
    keywords: ["야간근무", "야간수당", "심야근무", "집배야간"],
    process: ["야간근무 일정 확인", "수당 지급 여부 확인", "안전 조치 이행 확인"],
    caution: "집배원 야간 배달 중 안전사고 시 관리 소홀 책임 발생 가능.",
    evidence: ["근무표", "수당 지급 내역"],
    severity: "medium",
  },
  {
    id: "CARD-010", title: "교대근무표 임의 변경 지도",
    category1: "근무시간", category2: "교대근무",
    summary: "근무표는 사전 통보 원칙이 있으며, 관리자 임의 변경 또는 동의 없는 변경은 분쟁 원인이 된다.",
    legal: ["L001", "L002", "L005"],
    keywords: ["교대근무표", "근무표변경", "근무일정", "사전통보"],
    process: ["변경 경위 확인", "사전 통보 여부 확인", "동의 여부 확인", "절차 지도"],
    caution: "긴급 변경이라도 사후 동의 절차 필요.",
    evidence: ["근무표 원본", "변경 기록", "직원 동의 서류"],
    severity: "low",
  },
  {
    id: "CARD-011", title: "연가 승인 거부 타당성 검토",
    category1: "휴가·휴직", category2: "연가",
    summary: "연가는 원칙적으로 사용할 권리가 있으며, 업무상 현저한 지장이 없는 한 거부할 수 없다.",
    legal: ["L001"],
    keywords: ["연가", "연차", "휴가거부", "연가승인"],
    process: ["거부 사유 확인", "업무 지장 여부 객관적 검토", "대체 일정 제시 여부 확인"],
    caution: "반복적·자의적 연가 거부는 직장 내 괴롭힘으로 발전할 수 있음.",
    evidence: ["연가 신청서", "거부 사유 기록"],
    severity: "medium",
  },
  {
    id: "CARD-012", title: "병가 증빙 및 허위병가 확인",
    category1: "휴가·휴직", category2: "병가",
    summary: "병가는 의사 진단서 등 증빙이 필요하며, 허위 병가는 복무 위반 및 징계 사유가 된다.",
    legal: ["L001"],
    keywords: ["병가", "진단서", "허위병가", "병가증빙"],
    process: ["병가 신청서 및 증빙 확인", "의심 시 추가 소명 요청", "허위 확인 시 조사 착수"],
    caution: "병가 중 개인 활동(SNS 등) 확인은 프라이버시 침해 주의.",
    evidence: ["병가 신청서", "진단서", "병원 기록"],
    severity: "medium",
  },
  {
    id: "CARD-013", title: "출장 중 사적 용무 확인 기준",
    category1: "복무관리", category2: "출장",
    summary: "출장 목적 외 사적 활동을 출장 시간에 포함하는 경우 복무 위반에 해당한다.",
    legal: ["L001", "L005"],
    keywords: ["출장", "사적용무", "출장복무", "출장비"],
    process: ["출장 목적 및 일정 확인", "복귀 기록 확인", "사적 활동 여부 파악"],
    caution: "출장 중 사고 발생 시 사적 활동 여부가 공무재해 인정에 영향.",
    evidence: ["출장 명령서", "교통·숙박 영수증", "현지 활동 기록"],
    severity: "medium",
  },
  {
    id: "CARD-014", title: "민원응대 중 직원 폭언 처리",
    category1: "직장내괴롭힘", category2: "폭언",
    summary: "민원인으로부터 폭언을 당한 직원에 대한 보호 조치와 가해 민원인에 대한 대응 절차.",
    legal: ["L002"],
    keywords: ["민원폭언", "고객갑질", "직원보호", "폭언"],
    process: ["사건 경위 확인", "피해 직원 보호 조치", "민원인 경고·퇴거 조치", "심리상담 연계"],
    caution: "피해 직원이 원치 않더라도 사건 기록 유지 권고.",
    evidence: ["CCTV", "직원 진술", "목격자 진술"],
    severity: "medium",
  },
  {
    id: "CARD-015", title: "직원 간 폭언 사건 처리 절차",
    category1: "직장내괴롭힘", category2: "폭언",
    summary: "동료 또는 상하급자 간 폭언 사건은 사실관계 확인 후 직장 내 괴롭힘 여부를 판단하고 분리 조치를 검토한다.",
    legal: ["L002"],
    keywords: ["직원폭언", "폭언", "직장내괴롭힘", "언어폭력"],
    process: ["양측 진술 청취", "목격자 확인", "괴롭힘 해당 여부 판단", "분리 조치 검토", "조사 착수"],
    caution: "피해자 진술이 다를 수 있어 제3자 증인 확보 중요.",
    evidence: ["진술서", "목격자 진술", "CCTV"],
    severity: "high",
  },
  {
    id: "CARD-016", title: "관리자 갑질 신고 처리 절차",
    category1: "직장내괴롭힘", category2: "갑질",
    summary: "관리자의 지위를 이용한 부당한 업무 지시, 모욕, 차별적 대우는 직장 내 괴롭힘에 해당할 수 있다.",
    legal: ["L002"],
    keywords: ["관리자갑질", "갑질", "부당지시", "직위남용"],
    process: ["신고 접수", "피신고인 분리 검토", "사실관계 조사", "인사 조치 검토"],
    caution: "신고자 신원 보호 및 2차 가해 방지 조치 선행 필수.",
    evidence: ["신고서", "피해자 진술", "목격자 진술", "메신저·이메일 기록"],
    severity: "high",
  },
  {
    id: "CARD-017", title: "업무 배제 행위 판단 기준",
    category1: "직장내괴롭힘", category2: "업무배제",
    summary: "특정 직원을 의도적으로 업무에서 배제하거나 고립시키는 행위는 직장 내 괴롭힘에 해당한다.",
    legal: ["L002"],
    keywords: ["업무배제", "따돌림", "고립", "왕따", "직장내괴롭힘"],
    process: ["피해자 진술 확인", "업무 배분 기록 확인", "지속성·반복성 판단", "조사 착수"],
    caution: "업무 조정과 괴롭힘 목적의 배제를 구분하는 것이 핵심.",
    evidence: ["업무 지시 기록", "피해자 진술", "이메일·메신저"],
    severity: "high",
  },
  {
    id: "CARD-018", title: "사적 심부름 지시 처리 기준",
    category1: "직장내괴롭힘", category2: "갑질",
    summary: "업무와 무관한 사적인 심부름 지시는 직장 내 괴롭힘 유형에 해당한다.",
    legal: ["L002"],
    keywords: ["사적심부름", "부당지시", "갑질", "직장내괴롭힘"],
    process: ["피해 진술 청취", "지속성 확인", "지시 내용의 업무관련성 판단", "조사 착수"],
    caution: "암묵적 강요나 지위를 이용한 형태도 포함됨.",
    evidence: ["피해자 진술", "메신저·이메일 기록", "목격자 진술"],
    severity: "high",
  },
  {
    id: "CARD-019", title: "직장 내 괴롭힘 신고 접수 절차",
    category1: "직장내괴롭힘", category2: "갑질",
    summary: "직장 내 괴롭힘 신고 접수 후 즉시 조사 착수 및 피해자 보호 조치가 의무화되어 있다.",
    legal: ["L002"],
    keywords: ["직장내괴롭힘", "신고접수", "괴롭힘조사", "피해자보호"],
    process: ["신고 접수 및 기록", "즉시 피해자 보호 조치", "가해자와 분리 검토", "객관적 조사 착수", "결과에 따른 조치"],
    caution: "신고자 불이익 처우 금지. 신고 이후 2차 가해 모니터링 필수.",
    evidence: ["신고서", "관련 증거자료"],
    severity: "high",
  },
  {
    id: "CARD-020", title: "피해자 분리 조치 기준",
    category1: "직장내괴롭힘", category2: "갑질",
    summary: "괴롭힘 조사 기간 중 피해자 보호를 위해 가해자와의 분리 조치를 우선 검토해야 한다.",
    legal: ["L002"],
    keywords: ["피해자보호", "분리조치", "직장내괴롭힘", "보호조치"],
    process: ["피해자 의사 확인", "분리 방법 결정(유급휴가, 부서 변경 등)", "가해자 조치 병행"],
    caution: "피해자가 분리되는 불이익 없도록 가해자 이동을 우선 검토.",
    evidence: ["신고서", "분리 조치 기록"],
    severity: "high",
  },
  {
    id: "CARD-021", title: "2차 가해 예방 및 조치",
    category1: "직장내괴롭힘", category2: "갑질",
    summary: "조사 과정 또는 이후에 발생하는 신고자·피해자에 대한 불이익이나 괴롭힘은 2차 가해로 처리한다.",
    legal: ["L002"],
    keywords: ["2차가해", "신고자보호", "피해자보호", "보복행위"],
    process: ["2차 가해 행위 모니터링", "피해 발생 시 즉시 조사", "행위자 징계 검토"],
    caution: "2차 가해 행위자가 상급자인 경우 외부 신고 채널 안내 필요.",
    evidence: ["2차 가해 기록", "피해자 진술"],
    severity: "high",
  },
  {
    id: "CARD-022", title: "성희롱 신고 및 조사 절차",
    category1: "직장내괴롭힘", category2: "성희롱",
    summary: "성희롱 신고는 별도 절차로 처리되며, 피해자 동의 없는 사건 공개 금지 및 즉각 분리 조치가 원칙이다.",
    legal: ["L002"],
    keywords: ["성희롱", "성적괴롭힘", "신고", "피해자보호"],
    process: ["신고 접수", "피해자 의사 확인 및 보호 우선", "즉시 분리 조치", "전담 조사팀 구성", "징계 절차 착수"],
    caution: "조사 과정에서 피해자 신원 보호 철저. 2차 가해 모니터링 병행.",
    evidence: ["신고서", "진술서", "메신저·이메일 기록"],
    severity: "high",
  },
  {
    id: "CARD-023", title: "감사·조사 착수 기준 및 절차",
    category1: "감사·조사", category2: "복무감사",
    summary: "복무 위반, 비위 행위, 민원 등 일정 사유 발생 시 감사 또는 조사를 착수할 수 있으며, 적법한 절차를 따라야 한다.",
    legal: ["L004", "L006"],
    keywords: ["감사착수", "조사착수", "복무감사", "특정감사"],
    process: ["착수 사유 확인", "관련 법령 검토", "자료 보전 조치", "조사 계획 수립", "대상자 통보"],
    caution: "절차적 정당성이 결여된 조사는 결과가 무효화될 수 있음.",
    evidence: ["착수 근거 기록", "자료 목록"],
    severity: "high",
  },
  {
    id: "CARD-024", title: "진술서 확보 절차 및 주의사항",
    category1: "감사·조사", category2: "자료확보",
    summary: "진술서는 자유로운 의사로 작성되어야 하며, 강요·유도는 절차 위반이다.",
    legal: ["L004", "L006"],
    keywords: ["진술서", "자료확보", "조사절차", "진술권"],
    process: ["진술 요청 통보", "진술인 권리 고지", "자유롭게 작성토록 지원", "서명·날인 확인"],
    caution: "진술 거부권 고지 필요. 강요 또는 유도 신문 금지.",
    evidence: ["진술서 원본", "통보 기록"],
    severity: "high",
  },
  {
    id: "CARD-025", title: "CCTV·근태자료 확보 기준",
    category1: "감사·조사", category2: "자료확보",
    summary: "조사를 위해 CCTV, 출입기록, 근태시스템 자료를 확보할 때 개인정보 처리 절차를 준수해야 한다.",
    legal: ["L004", "L006"],
    keywords: ["CCTV", "근태자료", "개인정보", "증거확보"],
    process: ["자료 보전 요청", "개인정보 처리 동의 또는 법적 근거 확인", "자료 목록 작성", "보관 관리"],
    caution: "CCTV 열람은 법적 근거가 있어야 하며, 목적 외 사용 금지.",
    evidence: ["자료 요청 공문", "수령 확인서"],
    severity: "medium",
  },
  {
    id: "CARD-026", title: "감사결과 처분요구 절차",
    category1: "감사·조사", category2: "복무감사",
    summary: "감사 결과 위반사항이 확인된 경우 처분요구 또는 개선요구 조치를 취할 수 있다.",
    legal: ["L004", "L006"],
    keywords: ["감사결과", "처분요구", "개선요구", "감사"],
    process: ["감사 결과 정리", "위반 사항 법령 매핑", "처분요구 또는 개선요구서 작성", "상급자 승인 후 통보"],
    caution: "처분요구는 권고 성격이며, 최종 처분 권한은 해당 기관장.",
    evidence: ["감사 보고서", "처분요구서"],
    severity: "high",
  },
  {
    id: "CARD-027", title: "주의·경고 부여 기준",
    category1: "징계·문책", category2: "주의경고",
    summary: "경미한 복무 위반에 대해 징계 전 단계로 주의 또는 경고 조치를 취할 수 있다.",
    legal: ["L003", "L007"],
    keywords: ["주의", "경고", "경징계", "징계전조치"],
    process: ["위반 사항 확인", "경미성 판단", "주의 또는 경고 문서 작성", "당사자 전달 및 서명"],
    caution: "주의·경고 이력은 이후 징계 양정에 영향을 미침.",
    evidence: ["주의·경고 문서", "수령 확인서"],
    severity: "low",
  },
  {
    id: "CARD-028", title: "징계의결 요구 절차 및 서류",
    category1: "징계·문책", category2: "징계의결",
    summary: "징계의결 요구 시 사실 관계, 관련 법령, 처벌 의견을 포함한 서류를 징계위원회에 제출해야 한다.",
    legal: ["L003", "L007"],
    keywords: ["징계의결", "징계위원회", "징계요구", "처분"],
    process: ["사실관계 정리", "관련 법령 검토", "의견서 작성", "징계위원회 제출", "결과 통보"],
    caution: "징계의결 요구는 시효 내에 이루어져야 하며, 절차 누락 시 무효 가능성.",
    evidence: ["의결 요구서", "사실관계 확인서", "관련 증거자료"],
    severity: "high",
  },
  {
    id: "CARD-029", title: "징계 시효 확인 기준",
    category1: "징계·문책", category2: "징계시효",
    summary: "징계 사유 발생일로부터 일정 기간 내에 징계의결을 요구하지 않으면 시효가 완성되어 징계할 수 없게 된다.",
    legal: ["L003", "L007"],
    keywords: ["징계시효", "시효", "징계기간", "공소시효"],
    process: ["위반 행위 발생일 확인", "징계 시효 기간 계산", "시효 만료 전 착수 여부 판단"],
    caution: "금품수수·성 비위 등은 시효 기간이 다름. 반드시 개별 확인 필요.",
    evidence: ["비위 발생 기록", "인지 경위 기록"],
    severity: "high",
  },
  {
    id: "CARD-030", title: "재발방지 교육 실시 기준",
    category1: "예방교육", category2: "정기교육",
    summary: "복무 위반, 직장 내 괴롭힘, 감사 지적 사항 발생 후 재발 방지를 위한 교육을 실시해야 한다.",
    legal: ["L002", "L005"],
    keywords: ["재발방지", "예방교육", "직원교육", "복무교육"],
    process: ["교육 대상 선정", "교육 내용 구성", "교육 실시", "이수 확인서 징구", "교육 기록 보관"],
    caution: "형식적 교육은 재발 방지 효과 없음. 실제 사례 기반 교육 권장.",
    evidence: ["교육 실시 기록", "이수 확인서"],
    severity: "low",
  },
];

const severityLabel = { high: "중요", medium: "보통", low: "낮음" };
const severityColor = { high: "#dc2626", medium: "#d97706", low: "#16a34a" };

// ============================================================
// AUTH COMPONENT
// ============================================================

function LoginScreen({ onLogin }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (pw === INITIAL_PASSWORD) {
      onLogin();
    } else {
      setError("비밀번호가 올바르지 않습니다.");
      setPw("");
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #1e3a5f 0%, #0f2340 100%)",
      fontFamily: "'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif",
    }}>
      <div style={{
        background: "#fff", borderRadius: 16, padding: "48px 40px", width: 360,
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📮</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e3a5f", margin: 0 }}>우정사업본부</h1>
          <p style={{ fontSize: 14, color: "#64748b", marginTop: 6 }}>지도실장 업무 지식베이스</p>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>접근 비밀번호</label>
          <input
            type="password" value={pw} onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder="비밀번호 입력"
            style={{
              width: "100%", padding: "12px 16px", border: "2px solid #e2e8f0",
              borderRadius: 8, fontSize: 15, outline: "none", boxSizing: "border-box",
              transition: "border-color 0.2s",
            }}
            onFocus={e => e.target.style.borderColor = "#1e3a5f"}
            onBlur={e => e.target.style.borderColor = "#e2e8f0"}
          />
        </div>
        {error && <p style={{ color: "#dc2626", fontSize: 13, margin: "0 0 12px" }}>{error}</p>}
        <button onClick={handleLogin} style={{
          width: "100%", padding: "13px", background: "#1e3a5f", color: "#fff",
          border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: "pointer",
          transition: "background 0.2s",
        }}
          onMouseOver={e => e.target.style.background = "#2563eb"}
          onMouseOut={e => e.target.style.background = "#1e3a5f"}
        >
          로그인
        </button>
        <p style={{ textAlign: "center", fontSize: 12, color: "#94a3b8", marginTop: 20 }}>
          제한된 사용자만 접근 가능한 시스템입니다
        </p>
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================

export default function App() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [filterCat1, setFilterCat1] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("");
  const [cases, setCases] = useState([]);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageAnalysis, setImageAnalysis] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  // 법령 뷰어 상태
  const [lawSearch, setLawSearch] = useState("");
  const [selectedLaw, setSelectedLaw] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  // DB 업데이트 이력 상태 (세션 중 추가분만, 초기값은 상수)
  const [versionHistory, setVersionHistory] = useState(DB_VERSION_HISTORY);
  // 업데이트 요청 패널 상태
  const [updateNote, setUpdateNote] = useState("");
  const [updateChanges, setUpdateChanges] = useState([{ type:"added", target:"law", label:"", detail:"" }]);
  const [updateSubmitted, setUpdateSubmitted] = useState(false);
  const [autoLoading, setAutoLoading] = useState(false);
  const [autoResult, setAutoResult]   = useState(null);
  // 체크리스트 마스터 항목 (카테고리별 관리)
  const [masterItems, setMasterItems] = useState(INITIAL_MASTER_ITEMS);
  // 지점명 이력
  const [branchHistory, setBranchHistory] = useState([]);
  // 점검 완료 기록 저장소
  const [inspections, setInspections] = useState([]);
  const fileInputRef = useRef();

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  // ---- SEARCH FILTER ----
  const filtered = CARDS_DATA.filter(c => {
    const q = searchQuery.toLowerCase();
    const matchQ = !q || c.title.includes(q) || c.summary.includes(q) ||
      c.keywords.some(k => k.includes(q)) || c.category1.includes(q) || c.category2.includes(q);
    const matchCat = !filterCat1 || c.category1 === filterCat1;
    const matchSev = !filterSeverity || c.severity === filterSeverity;
    return matchQ && matchCat && matchSev;
  });

  // ---- AI 질의 ----
  const handleAiQuery = async () => {
    if (!aiQuestion.trim()) return;
    setAiLoading(true);
    setAiResult(null);

    const cardsContext = CARDS_DATA.map(c =>
      `[${c.id}] ${c.title} (${c.category1}/${c.category2})\n요약: ${c.summary}\n키워드: ${c.keywords.join(", ")}`
    ).join("\n\n");

    const casesContext = cases.length > 0
      ? "\n\n[등록된 사례]\n" + cases.map(c => `사례ID:${c.id} - ${c.title}: ${c.summary}`).join("\n")
      : "";

    const prompt = `당신은 우정사업본부 지도실장을 지원하는 법령·복무·징계 전문 AI입니다.

아래는 업무 카드 데이터베이스입니다:
${cardsContext}${casesContext}

---
질문: ${aiQuestion}

위 데이터베이스를 기반으로 다음 구조로 응답하세요:

## 진단
(상황의 법적·규정적 성격 분석)

## 적용 법령 및 규정
(관련 법령과 우정사업본부 규정 명시)

## 처리 절차
(단계별 조치 방법)

## 주의사항
(놓치기 쉬운 절차적 주의점)

## 관련 사례 참고
(유사한 카드 ID 언급)

전문적이고 실무적인 언어로 작성하되, 지도실장이 바로 활용할 수 있도록 구체적으로 답변하세요.`;

    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await resp.json();
      const text = data.content?.map(b => b.text || "").join("") || "응답을 받지 못했습니다.";
      setAiResult(text);
    } catch (e) {
      setAiResult("AI 연결 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
    setAiLoading(false);
  };

  // ---- 이미지 업로드 및 민감정보 제거 후 사례 등록 ----
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target.result.split(",")[1];
      setUploadedImage(ev.target.result);
      setImageLoading(true);
      setImageAnalysis(null);

      try {
        const resp = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-6",
            max_tokens: 1000,
            messages: [{
              role: "user",
              content: [
                {
                  type: "image",
                  source: { type: "base64", media_type: file.type, data: base64 }
                },
                {
                  type: "text",
                  text: `이 이미지는 우체국 현장 업무 사례 자료입니다.
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
}`
                }
              ]
            }],
          }),
        });
        const data = await resp.json();
        const raw = data.content?.map(b => b.text || "").join("") || "{}";
        const clean = raw.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(clean);
        setImageAnalysis(parsed);
      } catch (e) {
        setImageAnalysis({ error: "이미지 분석 중 오류가 발생했습니다." });
      }
      setImageLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCase = () => {
    if (!imageAnalysis || imageAnalysis.error) return;
    const newCase = {
      id: `CASE-${Date.now()}`,
      title: imageAnalysis.title,
      summary: imageAnalysis.summary,
      category1: imageAnalysis.category1,
      category2: imageAnalysis.category2,
      keywords: imageAnalysis.keywords,
      process_hint: imageAnalysis.process_hint,
      date: new Date().toLocaleDateString("ko-KR"),
    };
    setCases(prev => [newCase, ...prev]);
    setUploadedImage(null);
    setImageAnalysis(null);
    alert("사례가 등록되었습니다.");
  };

  // ============================================================
  // RENDER
  // ============================================================

  const styles = {
    app: {
      minHeight: "100vh",
      background: "#f0f4f8",
      fontFamily: "'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif",
    },
    header: {
      background: "linear-gradient(135deg, #1e3a5f 0%, #163057 100%)",
      color: "#fff",
      padding: "0",
      boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
      position: "sticky", top: 0, zIndex: 500,
    },
    headerTop: {
      padding: "10px 16px 8px",
      display: "flex", alignItems: "center", gap: 8,
      borderBottom: "1px solid rgba(255,255,255,0.1)",
    },
    logo: { fontSize: 15, fontWeight: 800, display: "flex", alignItems: "center", gap: 7, flex: 1 },
    nav: {
      display: "flex", overflowX: "auto", padding: "0 8px 0",
      WebkitOverflowScrolling: "touch",
      scrollbarWidth: "none", msOverflowStyle: "none",
    },
    navBtn: (active) => ({
      padding: "10px 13px", border: "none", cursor: "pointer", whiteSpace: "nowrap",
      fontSize: 13, fontWeight: active ? 700 : 400,
      background: "transparent",
      color: active ? "#fff" : "rgba(255,255,255,0.6)",
      borderBottom: active ? "2px solid #60a5fa" : "2px solid transparent",
      transition: "all 0.15s",
      flexShrink: 0,
    }),
    main: { maxWidth: 1100, margin: "0 auto", padding: "24px 16px" },
    card: {
      background: "#fff", borderRadius: 12, padding: "20px 24px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.07)", marginBottom: 16,
    },
    cardTitle: { fontSize: 16, fontWeight: 700, color: "#1e3a5f", margin: "0 0 8px" },
    badge: (color) => ({
      display: "inline-block", padding: "2px 10px", borderRadius: 20,
      fontSize: 11, fontWeight: 700, color: "#fff", background: color, marginRight: 6,
    }),
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 },
    input: {
      width: "100%", padding: "12px 16px", border: "2px solid #e2e8f0",
      borderRadius: 10, fontSize: 15, outline: "none", boxSizing: "border-box",
      fontFamily: "inherit",
    },
    btn: (primary) => ({
      padding: "10px 20px", borderRadius: 8, border: "none", cursor: "pointer",
      fontSize: 14, fontWeight: 700,
      background: primary ? "#1e3a5f" : "#e2e8f0",
      color: primary ? "#fff" : "#374151",
      transition: "background 0.2s",
    }),
    section: { marginBottom: 32 },
    h2: { fontSize: 20, fontWeight: 800, color: "#1e3a5f", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 },
    tag: {
      display: "inline-block", padding: "2px 8px", borderRadius: 4,
      fontSize: 11, background: "#eff6ff", color: "#1e40af", marginRight: 4, marginBottom: 4,
    },
    modal: {
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16,
    },
    modalBox: {
      background: "#fff", borderRadius: 16, padding: "32px",
      maxWidth: 680, width: "100%", maxHeight: "85vh", overflowY: "auto",
      boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    },
  };

  const renderHome = () => (
    <div>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "업무 카드", value: CARDS_DATA.length, icon: "📋" },
          { label: "수록 조문", value: LAW_DB.reduce((a,l) => a+l.articles.length,0), icon: "⚖️" },
          { label: "법령·규정", value: LAW_DB.length, icon: "📜" },
          { label: "분류 체계", value: Object.keys(CATEGORIES).length, icon: "🗂" },
        ].map(s => (
          <div key={s.label} style={{
            ...styles.card, textAlign: "center", padding: "20px 12px",
            borderTop: "4px solid #1e3a5f",
          }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: "#1e3a5f" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Search */}
      <div style={{ ...styles.card, borderLeft: "4px solid #1e3a5f", marginBottom: 24 }}>
        <h2 style={{ ...styles.h2, marginBottom: 12 }}>🔍 빠른 검색</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            style={styles.input} placeholder="키워드 입력 (예: 무단결근, 폭언, 초과근무...)"
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && setTab("cards")}
          />
          <button style={styles.btn(true)} onClick={() => setTab("cards")}>검색</button>
        </div>
        <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 6 }}>
          {["무단결근", "직장내괴롭힘", "초과근무", "병가", "징계시효", "성희롱"].map(kw => (
            <button key={kw} onClick={() => { setSearchQuery(kw); setTab("cards"); }}
              style={{ ...styles.tag, cursor: "pointer", fontSize: 12, padding: "4px 10px" }}>
              {kw}
            </button>
          ))}
        </div>
      </div>

      {/* 우선 처리 카드 */}
      <div style={styles.section}>
        <h2 style={styles.h2}>🚨 중요 사안 카드</h2>
        <div style={styles.grid}>
          {CARDS_DATA.filter(c => c.severity === "high").slice(0, 6).map(c => (
            <div key={c.id} onClick={() => setSelectedCard(c)} style={{
              ...styles.card, cursor: "pointer", borderLeft: "4px solid #dc2626",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
              onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)"; }}
              onMouseOut={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.07)"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <span style={styles.badge("#dc2626")}>중요</span>
                <span style={{ fontSize: 11, color: "#94a3b8" }}>{c.id}</span>
              </div>
              <p style={styles.cardTitle}>{c.title}</p>
              <p style={{ fontSize: 13, color: "#64748b", margin: 0, lineHeight: 1.6 }}>{c.summary.slice(0, 60)}...</p>
            </div>
          ))}
        </div>
      </div>

      {/* 법령 DB */}
      <div style={styles.section}>
        <h2 style={styles.h2}>📜 관련 법령·규정 <span style={{ fontSize: 14, fontWeight: 500, color: "#64748b" }}>— 클릭하면 조문을 바로 볼 수 있습니다</span></h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
          {LAW_DB.map(l => (
            <div key={l.lawId} onClick={() => setTab("law")} style={{
              ...styles.card, display: "flex", alignItems: "center", gap: 12,
              cursor: "pointer", padding: "14px 20px",
              borderLeft: `3px solid ${l.color}`,
              transition: "transform 0.15s",
            }}
              onMouseOver={e => e.currentTarget.style.transform = "translateY(-1px)"}
              onMouseOut={e => e.currentTarget.style.transform = ""}
            >
              <span style={{ fontSize: 20 }}>⚖️</span>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#1e3a5f" }}>{l.lawName}</p>
                <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>{l.lawType} · 조문 {l.articles.length}개 수록</p>
              </div>
              <span style={{ fontSize: 12, color: l.color, fontWeight: 700 }}>조문 보기 →</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCards = () => (
    <div>
      <div style={{ ...styles.card, marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input style={{ ...styles.input, flex: 1, minWidth: 200 }}
            placeholder="제목, 키워드, 요약 검색..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          <select value={filterCat1} onChange={e => setFilterCat1(e.target.value)}
            style={{ ...styles.input, width: "auto" }}>
            <option value="">전체 분류</option>
            {Object.keys(CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)}
            style={{ ...styles.input, width: "auto" }}>
            <option value="">전체 중요도</option>
            <option value="high">중요</option>
            <option value="medium">보통</option>
            <option value="low">낮음</option>
          </select>
          <button style={styles.btn(false)} onClick={() => { setSearchQuery(""); setFilterCat1(""); setFilterSeverity(""); }}>초기화</button>
        </div>
        <p style={{ margin: "10px 0 0", fontSize: 13, color: "#64748b" }}>
          {filtered.length}개 카드 검색됨
        </p>
      </div>
      <div style={styles.grid}>
        {filtered.map(c => (
          <div key={c.id} onClick={() => setSelectedCard(c)} style={{
            ...styles.card, cursor: "pointer",
            borderLeft: `4px solid ${severityColor[c.severity]}`,
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
            onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)"; }}
            onMouseOut={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.07)"; }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <div>
                <span style={styles.badge(severityColor[c.severity])}>{severityLabel[c.severity]}</span>
                <span style={styles.badge("#475569")}>{c.category1}</span>
              </div>
              <span style={{ fontSize: 11, color: "#94a3b8" }}>{c.id}</span>
            </div>
            <p style={styles.cardTitle}>{c.title}</p>
            <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 10px", lineHeight: 1.6 }}>{c.summary.slice(0, 70)}...</p>
            <div>{c.keywords.slice(0, 3).map(k => <span key={k} style={styles.tag}>#{k}</span>)}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAI = () => (
    <div>
      <div style={{ ...styles.card, borderTop: "4px solid #7c3aed", marginBottom: 20 }}>
        <h2 style={{ ...styles.h2, color: "#7c3aed" }}>🤖 AI 법령·사례 분석</h2>
        <p style={{ fontSize: 14, color: "#64748b", marginBottom: 16, lineHeight: 1.7 }}>
          발생한 상황을 입력하면 관련 법령, 처리 절차, 주의사항을 종합 분석합니다.
        </p>
        <textarea
          value={aiQuestion}
          onChange={e => setAiQuestion(e.target.value)}
          placeholder="예: 직원이 3일 연속 연락 없이 출근하지 않고 있습니다. 어떻게 처리해야 하나요?"
          rows={4}
          style={{
            ...styles.input, resize: "vertical", lineHeight: 1.7,
            fontFamily: "inherit",
          }}
        />
        <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["무단결근 3일째입니다", "관리자가 특정 직원을 반복적으로 욕설합니다", "초과근무를 허위 입력한 정황이 있습니다", "직원이 성희롱 피해를 신고했습니다"].map(s => (
            <button key={s} onClick={() => setAiQuestion(s)} style={{ ...styles.tag, cursor: "pointer", fontSize: 12, padding: "5px 10px" }}>{s}</button>
          ))}
        </div>
        <button
          style={{ ...styles.btn(true), marginTop: 12, opacity: aiLoading ? 0.7 : 1 }}
          onClick={handleAiQuery} disabled={aiLoading}
        >
          {aiLoading ? "⏳ 분석 중..." : "🔍 분석 요청"}
        </button>
      </div>

      {aiLoading && (
        <div style={{ ...styles.card, textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⚙️</div>
          <p style={{ color: "#64748b" }}>법령 및 사례 데이터를 분석하고 있습니다...</p>
        </div>
      )}

      {aiResult && (
        <div style={{ ...styles.card, borderLeft: "4px solid #7c3aed" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#7c3aed", marginBottom: 16 }}>📊 분석 결과</h3>
          <div style={{ fontSize: 14, lineHeight: 1.9, color: "#1e293b", whiteSpace: "pre-wrap" }}>
            {aiResult.split("\n").map((line, i) => {
              if (line.startsWith("## ")) return <h4 key={i} style={{ fontSize: 15, fontWeight: 800, color: "#1e3a5f", margin: "16px 0 8px", borderBottom: "2px solid #e2e8f0", paddingBottom: 4 }}>{line.replace("## ", "")}</h4>;
              if (line.startsWith("- ") || line.startsWith("• ")) return <li key={i} style={{ marginLeft: 16, marginBottom: 4 }}>{line.slice(2)}</li>;
              if (line.trim() === "") return <br key={i} />;
              return <p key={i} style={{ margin: "4px 0" }}>{line}</p>;
            })}
          </div>
          <div style={{ marginTop: 20, padding: "12px 16px", background: "#fef3c7", borderRadius: 8, fontSize: 13, color: "#92400e" }}>
            ⚠️ 이 분석은 참고 자료이며, 최종 판단은 관련 법령과 상급자 지침을 반드시 확인하시기 바랍니다.
          </div>
        </div>
      )}
    </div>
  );

  const renderCases = () => (
    <div>
      <div style={{ ...styles.card, borderTop: "4px solid #059669", marginBottom: 20 }}>
        <h2 style={{ ...styles.h2, color: "#059669" }}>📸 사례 이미지 등록</h2>
        <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, marginBottom: 16 }}>
          사례 관련 이미지를 업로드하면 AI가 민감정보(이름, 직원번호, 연락처 등)를 자동으로
          마스킹하고 사례 연구용 데이터로 변환합니다.
        </p>
        <div style={{
          border: "2px dashed #a7f3d0", borderRadius: 12, padding: 32, textAlign: "center",
          cursor: "pointer", transition: "background 0.2s",
          background: "#f0fdf4",
        }} onClick={() => fileInputRef.current?.click()}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>📂</div>
          <p style={{ margin: 0, fontWeight: 600, color: "#059669" }}>클릭하여 이미지 업로드</p>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "#94a3b8" }}>JPG, PNG, PDF 지원</p>
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
        </div>

        {uploadedImage && (
          <div style={{ marginTop: 20 }}>
            <img src={uploadedImage} alt="uploaded" style={{ maxWidth: "100%", borderRadius: 8, maxHeight: 300, objectFit: "contain" }} />
          </div>
        )}

        {imageLoading && (
          <div style={{ textAlign: "center", padding: 24, color: "#059669", fontWeight: 600 }}>
            ⏳ 민감정보 탐지 및 마스킹 처리 중...
          </div>
        )}

        {imageAnalysis && !imageAnalysis.error && (
          <div style={{ marginTop: 20, background: "#f0fdf4", borderRadius: 12, padding: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#059669", marginBottom: 12 }}>✅ 분석 결과 (민감정보 마스킹 완료)</h3>
            {imageAnalysis.detected_pii?.length > 0 && (
              <div style={{ marginBottom: 12, padding: "8px 12px", background: "#fef3c7", borderRadius: 8 }}>
                <strong style={{ fontSize: 13, color: "#92400e" }}>🔒 탐지된 민감정보:</strong>{" "}
                <span style={{ fontSize: 13, color: "#92400e" }}>{imageAnalysis.detected_pii.join(", ")}</span>
              </div>
            )}
            <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
              {[
                ["제목", imageAnalysis.title],
                ["분류", `${imageAnalysis.category1} / ${imageAnalysis.category2}`],
                ["요약", imageAnalysis.summary],
                ["키워드", imageAnalysis.keywords?.join(", ")],
                ["처리 방향", imageAnalysis.process_hint],
              ].map(([k, v]) => (
                <tr key={k}>
                  <td style={{ padding: "6px 12px", fontWeight: 700, color: "#374151", width: 100, verticalAlign: "top" }}>{k}</td>
                  <td style={{ padding: "6px 12px", color: "#1e293b", lineHeight: 1.6 }}>{v}</td>
                </tr>
              ))}
            </table>
            <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
              <button style={styles.btn(true)} onClick={handleSaveCase}>사례 DB 등록</button>
              <button style={styles.btn(false)} onClick={() => { setUploadedImage(null); setImageAnalysis(null); }}>취소</button>
            </div>
          </div>
        )}
        {imageAnalysis?.error && <p style={{ color: "#dc2626", marginTop: 12 }}>{imageAnalysis.error}</p>}
      </div>

      <h2 style={styles.h2}>🗂️ 등록된 사례 ({cases.length}건)</h2>
      {cases.length === 0 ? (
        <div style={{ ...styles.card, textAlign: "center", padding: 40, color: "#94a3b8" }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>📭</div>
          <p>아직 등록된 사례가 없습니다. 이미지를 업로드하여 사례를 등록하세요.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {cases.map(c => (
            <div key={c.id} style={{ ...styles.card, borderLeft: "4px solid #059669" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={styles.badge("#059669")}>{c.category1}</span>
                <span style={{ fontSize: 11, color: "#94a3b8" }}>{c.date}</span>
              </div>
              <p style={styles.cardTitle}>{c.title}</p>
              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, marginBottom: 10 }}>{c.summary}</p>
              {c.process_hint && (
                <div style={{ padding: "8px 12px", background: "#f0fdf4", borderRadius: 6, fontSize: 12, color: "#059669" }}>
                  💡 {c.process_hint}
                </div>
              )}
              <div style={{ marginTop: 8 }}>
                {c.keywords?.map(k => <span key={k} style={styles.tag}>#{k}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ---- 법령 뷰어 ----
  const renderLaw = () => {

    const allArticles = LAW_DB.flatMap(law =>
      law.articles.map(a => ({ ...a, lawId: law.lawId, lawName: law.lawName, lawColor: law.color, lawType: law.lawType }))
    );
    const filteredArticles = lawSearch.trim()
      ? allArticles.filter(a =>
          a.title.includes(lawSearch) || a.no.includes(lawSearch) ||
          a.content.includes(lawSearch) || a.keywords.some(k => k.includes(lawSearch)) ||
          a.lawName.includes(lawSearch)
        )
      : [];

    const lawTypeColor = { "법률": "#2563eb", "대통령령": "#7c3aed", "행정규칙": "#d97706" };

    return (
      <div>
        {/* 통합 조문 검색 */}
        <div style={{ ...styles.card, borderTop: "4px solid #1e3a5f", marginBottom: 20 }}>
          <h2 style={{ ...styles.h2, marginBottom: 12 }}>⚖️ 법령·규정 조문 검색</h2>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              style={{ ...styles.input, flex: 1 }}
              placeholder="조문 번호, 제목, 키워드, 법령명으로 검색 (예: 제54조, 휴게시간, 징계시효...)"
              value={lawSearch}
              onChange={e => setLawSearch(e.target.value)}
            />
            {lawSearch && <button style={styles.btn(false)} onClick={() => setLawSearch("")}>초기화</button>}
          </div>
          {lawSearch && (
            <p style={{ margin: "10px 0 0", fontSize: 13, color: "#64748b" }}>
              {filteredArticles.length}개 조문 검색됨
            </p>
          )}
        </div>

        {/* 검색 결과 */}
        {lawSearch && filteredArticles.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#374151", marginBottom: 12 }}>🔍 검색 결과</h3>
            {filteredArticles.map((a, i) => (
              <div key={i} onClick={() => { setSelectedLaw(LAW_DB.find(l => l.lawId === a.lawId)); setSelectedArticle(a); setLawSearch(""); }}
                style={{ ...styles.card, cursor: "pointer", borderLeft: `4px solid ${a.lawColor}`, marginBottom: 10,
                  transition: "transform 0.15s, box-shadow 0.15s" }}
                onMouseOver={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.1)"; }}
                onMouseOut={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.07)"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span style={{ ...styles.badge(a.lawColor), fontSize: 11 }}>{a.lawName}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#1e3a5f" }}>{a.no} {a.title}</span>
                  </div>
                  <span style={{ ...styles.badge(lawTypeColor[a.lawType] || "#475569"), fontSize: 10 }}>{a.lawType}</span>
                </div>
                <p style={{ fontSize: 13, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                  {a.content.slice(0, 100).replace(/\n/g, " ")}...
                </p>
                <div style={{ marginTop: 6 }}>
                  {a.keywords.slice(0, 4).map(k => <span key={k} style={styles.tag}>#{k}</span>)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 법령 목록 */}
        {!lawSearch && !selectedLaw && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#374151", marginBottom: 16 }}>📚 법령·규정 목록</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
              {LAW_DB.map(law => (
                <div key={law.lawId} onClick={() => setSelectedLaw(law)}
                  style={{ ...styles.card, cursor: "pointer", borderLeft: `4px solid ${law.color}`,
                    transition: "transform 0.15s, box-shadow 0.15s" }}
                  onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)"; }}
                  onMouseOut={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.07)"; }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <span style={{ ...styles.badge(lawTypeColor[law.lawType] || "#475569"), fontSize: 11 }}>{law.lawType}</span>
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>조문 {law.articles.length}개</span>
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 800, color: "#1e3a5f", margin: "0 0 8px", lineHeight: 1.4 }}>{law.lawName}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {law.articles.slice(0, 4).map(a => (
                      <span key={a.no} style={{ fontSize: 11, color: law.color, background: `${law.color}15`, padding: "2px 7px", borderRadius: 4, fontWeight: 600 }}>
                        {a.no}
                      </span>
                    ))}
                    {law.articles.length > 4 && <span style={{ fontSize: 11, color: "#94a3b8" }}>+{law.articles.length - 4}개</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 선택된 법령의 조문 목록 */}
        {selectedLaw && !selectedArticle && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <button onClick={() => setSelectedLaw(null)} style={{ ...styles.btn(false), fontSize: 13 }}>← 목록으로</button>
              <div>
                <span style={{ ...styles.badge(lawTypeColor[selectedLaw.lawType] || "#475569"), fontSize: 11 }}>{selectedLaw.lawType}</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: "#1e3a5f", marginLeft: 8 }}>{selectedLaw.lawName}</span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {selectedLaw.articles.map((a, i) => (
                <div key={i} onClick={() => setSelectedArticle(a)}
                  style={{ ...styles.card, cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 16,
                    borderLeft: `4px solid ${selectedLaw.color}`, transition: "transform 0.15s, box-shadow 0.15s" }}
                  onMouseOver={e => { e.currentTarget.style.transform = "translateX(4px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.1)"; }}
                  onMouseOut={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.07)"; }}
                >
                  <div style={{ minWidth: 70, padding: "4px 10px", background: `${selectedLaw.color}15`,
                    borderRadius: 6, textAlign: "center", fontSize: 13, fontWeight: 800, color: selectedLaw.color }}>
                    {a.no}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 700, color: "#1e293b" }}>{a.title}</p>
                    <p style={{ margin: "0 0 8px", fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>
                      {a.content.slice(0, 80).replace(/\n/g, " ")}...
                    </p>
                    <div>{a.keywords.slice(0, 4).map(k => <span key={k} style={styles.tag}>#{k}</span>)}</div>
                  </div>
                  {a.relatedCards.length > 0 && (
                    <div style={{ fontSize: 11, color: "#94a3b8", textAlign: "right", minWidth: 60 }}>
                      관련 카드<br />{a.relatedCards.length}개
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 선택된 조문 상세 — 요약+전문 토글 */}
        {selectedArticle && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <button onClick={() => setSelectedArticle(null)} style={{ ...styles.btn(false), fontSize: 13 }}>← 조문 목록</button>
              <span style={{ fontSize: 13, color: "#64748b" }}>{selectedLaw?.lawName}</span>
            </div>
            <div style={{ ...styles.card, borderLeft: `6px solid ${selectedLaw?.color || "#1e3a5f"}` }}>
              <div style={{ marginBottom: 16 }}>
                <span style={{ ...styles.badge(lawTypeColor[selectedLaw?.lawType] || "#475569") }}>{selectedLaw?.lawType}</span>
                <span style={{ fontSize: 13, color: "#64748b", marginLeft: 8 }}>{selectedLaw?.lawName}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <span style={{ padding: "6px 16px", background: `${selectedLaw?.color}20`, borderRadius: 8,
                  fontSize: 16, fontWeight: 900, color: selectedLaw?.color }}>
                  {selectedArticle.no}
                </span>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1e3a5f", margin: 0 }}>{selectedArticle.title}</h2>
              </div>

              {/* 핵심 요약 — 항상 표시 */}
              <div style={{ background: `${selectedLaw?.color}10`, border: `1px solid ${selectedLaw?.color}30`,
                borderRadius: 10, padding: "14px 18px", marginBottom: 12 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: selectedLaw?.color, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  📌 핵심 요약
                </p>
                <p style={{ fontSize: 14, lineHeight: 1.8, color: "#1e293b", margin: 0 }}>
                  {selectedArticle.content.split("
")[0]}
                </p>
              </div>

              {/* 전문 토글 */}
              <ArticleFullText content={selectedArticle.content} color={selectedLaw?.color} />

              {/* 키워드 */}
              <div style={{ marginBottom: 20, marginTop: 20 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>검색 키워드</p>
                <div>{selectedArticle.keywords.map(k => <span key={k} style={styles.tag}>#{k}</span>)}</div>
              </div>

              {/* 관련 업무카드 */}
              {selectedArticle.relatedCards.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>관련 업무카드</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {selectedArticle.relatedCards.map(cid => {
                      const card = CARDS_DATA.find(c => c.id === cid);
                      return card ? (
                        <button key={cid} onClick={() => setSelectedCard(card)}
                          style={{ padding: "6px 14px", background: "#eff6ff", border: "none", borderRadius: 8,
                            fontSize: 13, fontWeight: 600, color: "#1d4ed8", cursor: "pointer" }}>
                          {card.title}
                        </button>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              <button style={{ ...styles.btn(true) }} onClick={() => {
                setAiQuestion(`${selectedLaw?.lawName} ${selectedArticle.no} "${selectedArticle.title}"에 관련된 실무 적용 방법과 주의사항을 알려주세요.`);
                setTab("ai");
              }}>
                🤖 이 조문으로 AI 분석 요청
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderUpdate = () => {
    const typeLabel = { added:"추가", modified:"수정", deleted:"삭제" };
    const typeColor = { added:"#059669", modified:"#d97706", deleted:"#dc2626" };
    const typeBg   = { added:"#dcfce7", modified:"#fef3c7", deleted:"#fee2e2" };
    const targetLabel = { law:"법령·조문", card:"업무카드", case:"사례", checklist:"체크리스트", other:"기타" };

    // ── 자동 업데이트 검색 (AI + 웹검색)
    const handleAutoUpdate = async () => {
      setAutoLoading(true);
      setAutoResult(null);
      const lawList = LAW_DB.map(l =>
        `- ${l.lawName} (${l.lawType}, 최종수록: ${l.lastUpdated}, 조문수: ${l.articles.length})`
      ).join("\n");
      const prompt = `당신은 한국 법령 전문가입니다. 웹 검색을 통해 다음 법령들의 최근 개정 여부를 확인하고, 이 시스템의 DB 업데이트가 필요한 사항을 찾아주세요.

[현재 수록된 법령 목록]
${lawList}

[확인 요청 사항]
1. 각 법령의 국가법령정보센터(law.go.kr) 최신 개정일과 현재 수록 일자 비교
2. 개정된 법령이 있으면 어떤 조문이 변경되었는지 파악
3. 우체국·우정사업본부 업무와 직접 관련된 변경사항 우선 확인
4. 추가로 수록할 필요가 있는 조문 제안

[응답 형식]
## 개정 확인 결과

### 변경 필요 법령
(없으면 "현재 수록 내용과 차이 없음" 표기)

### 조문별 변경 내용
(변경된 조문만 구체적으로 기술)

### 추가 수록 권고 조문
(실무상 필요하나 현재 미수록된 조문)

### 종합 의견
(업데이트 우선순위 및 권고사항)

검색 기준일: ${new Date().toLocaleDateString("ko-KR")}`;

      try {
        const resp = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-6",
            max_tokens: 1000,
            tools: [{ type: "web_search_20250305", name: "web_search" }],
            messages: [{ role: "user", content: prompt }],
          }),
        });
        const data = await resp.json();
        const text = (data.content || [])
          .filter(b => b.type === "text").map(b => b.text).join("") ||
          "분석을 완료했습니다. 현재 수록된 법령 내용을 확인하였습니다.";
        setAutoResult(text);
      } catch (e) {
        setAutoResult("검색 중 오류가 발생했습니다: " + e.message);
      }
      setAutoLoading(false);
    };

    // ── 결과를 이력에 등록
    const saveAutoResult = () => {
      if (!autoResult) return;
      const today = new Date().toISOString().slice(0,10);
      const lastVersion = versionHistory[0]?.version || "v1.0";
      const nextMinor = parseInt(lastVersion.split(".")[1] || 0) + 1;
      const newVersion = `${lastVersion.split(".")[0]}.${nextMinor}`;
      setVersionHistory(p => [{
        version: newVersion, date: today, author: "자동검색",
        summary: `법령 개정 자동 확인 (${today})`,
        changes: [{ type:"modified", target:"law", label:"자동 검색 결과", detail: autoResult.slice(0, 120) }],
      }, ...p]);
      setAutoResult(null);
      setUpdateSubmitted(true);
      setTimeout(() => setUpdateSubmitted(false), 3000);
    };

    return (
      <div>
        {/* 자동 업데이트 패널 */}
        <div style={{ ...styles.card, borderTop: "4px solid #1e3a5f", marginBottom: 24 }}>
          <h2 style={{ ...styles.h2, marginBottom: 6 }}>🔄 DB 자동 업데이트 검색</h2>
          <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20, lineHeight: 1.8 }}>
            버튼 하나로 <strong>7개 법령의 최신 개정 여부</strong>를 AI가 웹검색으로 자동 확인합니다.<br/>
            개정된 조문, 추가 수록이 필요한 조문, 업데이트 우선순위를 종합 분석해서 보고합니다.
          </p>

          {/* 수록 법령 현황 */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(240px, 1fr))", gap:8, marginBottom:20 }}>
            {LAW_DB.map(l => (
              <div key={l.lawId} style={{ padding:"10px 14px", background:"#f8fafc",
                borderRadius:8, borderLeft:`3px solid ${l.color}` }}>
                <div style={{ fontSize:13, fontWeight:700, color:"#1e293b", marginBottom:2 }}>{l.lawName}</div>
                <div style={{ fontSize:11, color:"#94a3b8" }}>
                  {l.lawType} · 조문 {l.articles.length}개 · 수록일 {l.lastUpdated}
                </div>
              </div>
            ))}
          </div>

          <button onClick={handleAutoUpdate} disabled={autoLoading}
            style={{ ...styles.btn(true), fontSize:15, padding:"13px 28px",
              opacity: autoLoading ? 0.7 : 1,
              background: "linear-gradient(135deg, #1e3a5f, #2563eb)" }}>
            {autoLoading ? "⏳ 법령 개정 검색 중..." : "🔍 법령 개정 자동 확인"}
          </button>
          {autoLoading && (
            <p style={{ fontSize:13, color:"#64748b", marginTop:10 }}>
              국가법령정보센터 등 관련 사이트를 검색하여 개정 여부를 확인하고 있습니다...
            </p>
          )}
        </div>

        {/* 자동 검색 결과 */}
        {autoResult && (
          <div style={{ ...styles.card, borderLeft:"4px solid #2563eb", marginBottom:24 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <h3 style={{ fontSize:16, fontWeight:800, color:"#1e3a5f", margin:0 }}>
                📊 법령 개정 검색 결과
              </h3>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={saveAutoResult} style={{ ...styles.btn(true), fontSize:13, padding:"7px 16px" }}>
                  이력에 저장
                </button>
                <button onClick={() => setAutoResult(null)} style={{ ...styles.btn(false), fontSize:13, padding:"7px 16px" }}>
                  닫기
                </button>
              </div>
            </div>
            <div style={{ fontSize:14, lineHeight:1.9, color:"#1e293b" }}>
              {autoResult.split("\n").map((line, i) => {
                if (line.startsWith("## ")) return <h3 key={i} style={{ fontSize:16, fontWeight:800, color:"#1e3a5f", margin:"20px 0 8px", borderBottom:"2px solid #e2e8f0", paddingBottom:6 }}>{line.replace("## ","")}</h3>;
                if (line.startsWith("### ")) return <h4 key={i} style={{ fontSize:14, fontWeight:700, color:"#374151", margin:"14px 0 6px" }}>{line.replace("### ","")}</h4>;
                if (line.startsWith("- ")) return <li key={i} style={{ marginLeft:16, marginBottom:4, fontSize:13 }}>{line.slice(2)}</li>;
                if (line.trim()==="") return <br key={i}/>;
                return <p key={i} style={{ margin:"4px 0", fontSize:13 }}>{line}</p>;
              })}
            </div>
            <div style={{ marginTop:16, padding:"10px 14px", background:"#fef3c7", borderRadius:8, fontSize:13, color:"#92400e" }}>
              ⚠️ 실제 개정 사항이 확인된 경우, 저에게 "DB 업데이트 해줘"라고 요청하시면 해당 내용을 반영하여 새 파일을 제공합니다.
            </div>
          </div>
        )}

        {updateSubmitted && (
          <div style={{ padding:"10px 16px", background:"#dcfce7", borderRadius:8, color:"#166534", fontWeight:700, fontSize:14, marginBottom:16 }}>
            ✅ 이력이 저장되었습니다.
          </div>
        )}

        {/* 버전 이력 */}
        <h2 style={styles.h2}>📋 DB 변경 이력</h2>
        {versionHistory.map((v, vi) => (
          <div key={vi} style={{ ...styles.card, borderLeft:"4px solid #1e3a5f", marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12, flexWrap:"wrap", gap:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ padding:"3px 12px", background:"#1e3a5f", color:"#fff", borderRadius:20, fontSize:13, fontWeight:800 }}>
                  {v.version}
                </span>
                <span style={{ fontSize:14, fontWeight:700, color:"#1e293b" }}>{v.summary}</span>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:12, color:"#94a3b8" }}>{v.date}</div>
                <div style={{ fontSize:11, color:"#94a3b8" }}>{v.author}</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap" }}>
              {["added","modified","deleted"].map(t => {
                const cnt = v.changes.filter(c=>c.type===t).length;
                return cnt > 0 ? (
                  <span key={t} style={{ padding:"3px 10px", background:typeBg[t], color:typeColor[t], borderRadius:20, fontSize:12, fontWeight:700 }}>
                    {typeLabel[t]} {cnt}건
                  </span>
                ) : null;
              })}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {v.changes.map((c,ci) => (
                <div key={ci} style={{ display:"flex", gap:8, alignItems:"flex-start", padding:"6px 10px", background:"#f8fafc", borderRadius:8 }}>
                  <span style={{ padding:"2px 8px", background:typeBg[c.type], color:typeColor[c.type], borderRadius:4, fontSize:11, fontWeight:700, whiteSpace:"nowrap" }}>
                    {typeLabel[c.type]}
                  </span>
                  <span style={{ padding:"2px 8px", background:"#eff6ff", color:"#1d4ed8", borderRadius:4, fontSize:11, fontWeight:600, whiteSpace:"nowrap" }}>
                    {targetLabel[c.target]}
                  </span>
                  <div style={{ fontSize:13, color:"#374151", lineHeight:1.5 }}>
                    <strong>{c.label}</strong>
                    {c.detail && <span style={{ color:"#64748b" }}> — {c.detail}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderChecklist = () => (
    <ChecklistSystem branchHistory={branchHistory} setBranchHistory={setBranchHistory}
      masterItems={masterItems} setMasterItems={setMasterItems}
      inspections={inspections} setInspections={setInspections} />
  );

  return (
    <div style={styles.app}>
      {/* Header */}
      <header style={styles.header}>
        {/* 상단: 로고 + 날짜 */}
        <div style={styles.headerTop}>
          <div style={styles.logo}>
            <span style={{ fontSize: 22 }}>📮</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, lineHeight: 1.2 }}>우정사업본부</div>
              <div style={{ fontSize: 11, fontWeight: 400, opacity: 0.7 }}>업무 지식베이스</div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", textAlign: "right" }}>
            {new Date().toLocaleDateString("ko-KR", { year:"numeric", month:"2-digit", day:"2-digit" })}
          </div>
        </div>
        {/* 하단: 탭 메뉴 가로 스크롤 */}
        <nav style={styles.nav}>
          {[
            { key: "home",      label: "🏠 홈" },
            { key: "cards",     label: "📋 업무카드" },
            { key: "law",       label: "⚖️ 법령·조문" },
            { key: "ai",        label: "🤖 AI분석" },
            { key: "cases",     label: "📸 사례등록" },
            { key: "checklist", label: "✅ 체크리스트" },
            { key: "update",    label: "🔄 DB업데이트" },
          ].map(n => (
            <button key={n.key} style={styles.navBtn(tab === n.key)} onClick={() => setTab(n.key)}>
              {n.label}
            </button>
          ))}
        </nav>
      </header>

      <main style={styles.main}>
        {tab === "home" && renderHome()}
        {tab === "cards" && renderCards()}
        {tab === "law" && renderLaw()}
        {tab === "ai" && renderAI()}
        {tab === "cases" && renderCases()}
        {tab === "checklist" && renderChecklist()}
        {tab === "update" && renderUpdate()}
      </main>

      {/* Card Modal */}
      {selectedCard && (
        <div style={styles.modal} onClick={() => setSelectedCard(null)}>
          <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <span style={styles.badge(severityColor[selectedCard.severity])}>{severityLabel[selectedCard.severity]}</span>
                <span style={styles.badge("#475569")}>{selectedCard.category1}</span>
                <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 8 }}>{selectedCard.id}</span>
              </div>
              <button onClick={() => setSelectedCard(null)} style={{
                background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#94a3b8",
              }}>✕</button>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1e3a5f", margin: "0 0 16px" }}>{selectedCard.title}</h2>
            <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, marginBottom: 20 }}>{selectedCard.summary}</p>

            <Section title="📋 처리 절차">
              <ol style={{ margin: 0, paddingLeft: 20 }}>
                {selectedCard.process.map((p, i) => (
                  <li key={i} style={{ marginBottom: 6, fontSize: 14, color: "#374151", lineHeight: 1.7 }}>{p}</li>
                ))}
              </ol>
            </Section>

            <Section title="⚠️ 주의사항">
              <div style={{ padding: "10px 14px", background: "#fef3c7", borderRadius: 8, fontSize: 14, color: "#92400e", lineHeight: 1.7 }}>
                {selectedCard.caution}
              </div>
            </Section>

            <Section title="📁 필요 증빙자료">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {selectedCard.evidence.map(e => (
                  <span key={e} style={{ padding: "4px 12px", background: "#eff6ff", borderRadius: 20, fontSize: 13, color: "#1d4ed8", fontWeight: 600 }}>{e}</span>
                ))}
              </div>
            </Section>

            <Section title="⚖️ 관련 법령">
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {selectedCard.legal.map(lid => {
                  const law = LAW_DB.find(x => x.lawId === lid);
                  if (!law) return null;
                  // 이 카드와 관련된 조문 필터
                  const relArts = law.articles.filter(a => a.relatedCards.includes(selectedCard.id));
                  return (
                    <div key={lid} style={{ background: "#f8fafc", borderRadius: 8, padding: "10px 14px", borderLeft: `3px solid ${law.color}` }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: law.color, marginBottom: relArts.length ? 6 : 0 }}>
                        ⚖️ {law.lawName} <span style={{ fontSize: 11, fontWeight: 400, color: "#94a3b8" }}>({law.lawType})</span>
                      </div>
                      {relArts.map(a => (
                        <div key={a.no} style={{ fontSize: 13, color: "#374151", padding: "3px 0" }}>
                          <strong style={{ color: "#1e3a5f" }}>{a.no} {a.title}</strong>
                          <span style={{ color: "#64748b", marginLeft: 6 }}>— {a.content.slice(0, 60).replace(/
/g, " ")}…</span>
                        </div>
                      ))}
                      <button onClick={() => { setSelectedCard(null); setSelectedLaw(law); setSelectedArticle(relArts[0] || null); setTab("law"); }}
                        style={{ marginTop: 6, background: "none", border: "none", color: "#2563eb", fontSize: 12, cursor: "pointer", fontWeight: 600, padding: 0 }}>
                        법령·조문 탭에서 전문 보기 →
                      </button>
                    </div>
                  );
                })}
              </div>
            </Section>

            <Section title="🔖 검색 키워드">
              <div>{selectedCard.keywords.map(k => <span key={k} style={styles.tag}>#{k}</span>)}</div>
            </Section>

            <button style={{ ...styles.btn(true), marginTop: 8 }} onClick={() => {
              setAiQuestion(`${selectedCard.title}과 관련하여 구체적인 처리 방법을 알려주세요.`);
              setSelectedCard(null);
              setTab("ai");
            }}>
              🤖 AI에게 추가 분석 요청
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 조문 전문 펼치기/접기 컴포넌트
function ArticleFullText({ content, color }) {
  const [open, setOpen] = useState(false);
  const lines = content.split("\n");
  const isLong = content.length > 100 || lines.length > 2;

  if (!isLong) {
    return (
      <div style={{ background: "#f8fafc", borderRadius: 10, padding: "16px 20px" }}>
        <p style={{ fontSize: 14, lineHeight: 2, color: "#1e293b", margin: 0, whiteSpace: "pre-line" }}>
          {content}
        </p>
      </div>
    );
  }

  return (
    <div>
      {open ? (
        <div style={{ background: "#f8fafc", borderRadius: 10, padding: "16px 20px", border: "1px solid #e2e8f0" }}>
          <p style={{ fontSize: 14, lineHeight: 2, color: "#1e293b", margin: "0 0 12px", whiteSpace: "pre-line" }}>
            {content}
          </p>
          <button onClick={() => setOpen(false)} style={{
            background: "none", border: `1px solid ${color || "#1e3a5f"}`, borderRadius: 6,
            color: color || "#1e3a5f", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: "5px 14px",
          }}>
            ▲ 접기
          </button>
        </div>
      ) : (
        <div style={{ background: "#f8fafc", borderRadius: 10, padding: "14px 20px", border: "1px dashed #d1d5db",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <p style={{ fontSize: 13, color: "#64748b", margin: 0, flex: 1 }}>
            전문 {lines.length}항 · {content.length}자
          </p>
          <button onClick={() => setOpen(true)} style={{
            background: color || "#1e3a5f", border: "none", borderRadius: 6,
            color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", padding: "7px 16px", whiteSpace: "nowrap",
          }}>
            전문 보기 ▼
          </button>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, color: "#475569", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{title}</h3>
      {children}
    </div>
  );
}

// ============================================================
// 체크리스트 마스터 항목 초기값
// ============================================================
const INITIAL_MASTER_ITEMS = [
  { id:"MI-001", category:"복무관리", text:"출퇴근 기록 확인 (지각·조퇴·결근 여부)", active:true },
  { id:"MI-002", category:"복무관리", text:"무단이탈 발생 여부 확인", active:true },
  { id:"MI-003", category:"복무관리", text:"연가·병가 증빙 서류 확인", active:true },
  { id:"MI-004", category:"복무관리", text:"출장 기록 및 결과보고 확인", active:true },
  { id:"MI-005", category:"복무관리", text:"조퇴·외출 사전 승인 여부 확인", active:true },
  { id:"MI-006", category:"근무시간", text:"초과근무 사전 명령 여부 확인", active:true },
  { id:"MI-007", category:"근무시간", text:"실제 근무 여부 (출입기록·CCTV 대조)", active:true },
  { id:"MI-008", category:"근무시간", text:"초과근무 입력자와 실제 근무자 일치 여부", active:true },
  { id:"MI-009", category:"근무시간", text:"월별 초과근무 시간 한도 준수 여부", active:true },
  { id:"MI-010", category:"근무시간", text:"야간·휴일 가산수당 적정 지급 여부", active:true },
  { id:"MI-011", category:"근무시간", text:"휴게시간 부여 실태 확인", active:true },
  { id:"MI-012", category:"근무시간", text:"점심시간 업무대기 지시 여부 확인", active:true },
  { id:"MI-013", category:"직장내괴롭힘", text:"신고 접수 즉시 기록 (일시·방법·내용)", active:true },
  { id:"MI-014", category:"직장내괴롭힘", text:"피해자 신원 보호 조치 여부", active:true },
  { id:"MI-015", category:"직장내괴롭힘", text:"피해자-가해자 분리 방안 검토", active:true },
  { id:"MI-016", category:"직장내괴롭힘", text:"신고자 불이익 방지 조치 여부", active:true },
  { id:"MI-017", category:"직장내괴롭힘", text:"조사팀 구성 및 객관성 확보 여부", active:true },
  { id:"MI-018", category:"직장내괴롭힘", text:"결과에 따른 조치 및 사후 모니터링 여부", active:true },
  { id:"MI-019", category:"감사·조사", text:"감사 착수 근거 (법령·규정) 확인", active:true },
  { id:"MI-020", category:"감사·조사", text:"감사 대상 및 범위 명확화", active:true },
  { id:"MI-021", category:"감사·조사", text:"관련 자료 보전 조치 여부", active:true },
  { id:"MI-022", category:"감사·조사", text:"대상자 통보 시기 및 방법 검토", active:true },
  { id:"MI-023", category:"감사·조사", text:"감사팀 구성 및 이해충돌 여부 확인", active:true },
  { id:"MI-024", category:"징계·문책", text:"사실관계 확인 완료 여부", active:true },
  { id:"MI-025", category:"징계·문책", text:"징계 시효 확인 (발생일 기준)", active:true },
  { id:"MI-026", category:"징계·문책", text:"적용 법령 및 양정 기준 검토", active:true },
  { id:"MI-027", category:"징계·문책", text:"유사 사례 처분 수준 비교", active:true },
  { id:"MI-028", category:"징계·문책", text:"변명 기회 부여 여부", active:true },
  { id:"MI-029", category:"징계·문책", text:"징계위원회 구성 및 의결 절차 확인", active:true },
];

const CL_CATEGORIES = ["복무관리","근무시간","직장내괴롭힘","감사·조사","징계·문책"];
const CL_CAT_COLOR = {
  "복무관리":"#2563eb","근무시간":"#7c3aed","직장내괴롭힘":"#dc2626",
  "감사·조사":"#059669","징계·문책":"#d97706",
};

// ============================================================
// ChecklistSystem — 독립 컴포넌트
// ============================================================
function ChecklistSystem({ branchHistory, setBranchHistory, masterItems, setMasterItems, inspections, setInspections }) {
  // 화면 모드: list(점검 목록) | setup(항목관리) | run(점검 진행) | view(결과조회)
  const [mode, setMode] = useState("list");
  // ── 항목 관리 state ──
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [newItemText, setNewItemText] = useState("");
  const [newItemCat, setNewItemCat] = useState("복무관리");
  // ── 점검 세션 구성 state ──
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().slice(0,10));
  const [sessionBranch, setSessionBranch] = useState("");
  const [branchSuggest, setBranchSuggest] = useState(false);
  const [sessionSelected, setSessionSelected] = useState({}); // {itemId: true}
  const [sessionOneOff, setSessionOneOff] = useState([]);     // 1회성 추가 항목
  const [oneOffInput, setOneOffInput] = useState("");
  // ── 점검 실행 state ──
  const [runChecks, setRunChecks] = useState({});     // {itemId|oneoff-n: {checked, note}}
  const [runOpinion, setRunOpinion] = useState("");
  const [runAction, setRunAction] = useState("");
  const [runId, setRunId] = useState(null);           // 편집 중인 기존 점검 ID
  // ── 조회 필터 ──
  const [filterDate, setFilterDate] = useState("");
  const [filterBranch, setFilterBranch] = useState("");

  const today = new Date().toISOString().slice(0,10);

  // ── 스타일 ──
  const S = {
    card: { background:"#fff", borderRadius:12, padding:"20px 24px", boxShadow:"0 2px 8px rgba(0,0,0,0.07)", marginBottom:16 },
    h2: { fontSize:18, fontWeight:800, color:"#1e3a5f", margin:"0 0 16px", display:"flex", alignItems:"center", gap:8 },
    h3: { fontSize:15, fontWeight:700, color:"#374151", margin:"0 0 10px" },
    input: { width:"100%", padding:"10px 14px", border:"2px solid #e2e8f0", borderRadius:8, fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"inherit" },
    btn: (primary, color) => ({
      padding:"9px 18px", borderRadius:8, border:"none", cursor:"pointer", fontSize:13, fontWeight:700,
      background: primary ? (color||"#1e3a5f") : "#f1f5f9",
      color: primary ? "#fff" : "#374151", transition:"opacity 0.15s",
    }),
    tag: (color) => ({ display:"inline-block", padding:"2px 9px", borderRadius:4, fontSize:11, fontWeight:700, background:`${color}18`, color }),
    check: (on) => ({
      width:20, height:20, borderRadius:5, border:`2px solid ${on?"#1e3a5f":"#d1d5db"}`,
      background:on?"#1e3a5f":"#fff", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"all 0.18s",
    }),
  };

  // ─────────────────────────────────────────
  // 점검 시작 — 선택 항목 → runChecks 초기화
  // ─────────────────────────────────────────
  const startRun = () => {
    const init = {};
    Object.keys(sessionSelected).filter(k=>sessionSelected[k]).forEach(id => { init[id] = { checked:false, note:"" }; });
    sessionOneOff.forEach((_,i) => { init[`oneoff-${i}`] = { checked:false, note:"" }; });
    setRunChecks(init);
    setRunOpinion(""); setRunAction("");
    setMode("run");
  };

  // 점검 완료 저장
  const saveInspection = () => {
    const selectedMaster = masterItems.filter(m => sessionSelected[m.id]);
    const allItems = [
      ...selectedMaster.map(m => ({ id:m.id, text:m.text, category:m.category, oneOff:false })),
      ...sessionOneOff.map((t,i) => ({ id:`oneoff-${i}`, text:t, category:"기타", oneOff:true })),
    ];
    const record = {
      id: runId || `INS-${Date.now()}`,
      date: sessionDate,
      branch: sessionBranch,
      items: allItems.map(item => ({
        ...item,
        checked: runChecks[item.id]?.checked || false,
        note: runChecks[item.id]?.note || "",
      })),
      opinion: runOpinion,
      action: runAction,
      savedAt: new Date().toISOString(),
    };
    if (runId) {
      setInspections(p => p.map(r => r.id === runId ? record : r));
    } else {
      setInspections(p => [record, ...p]);
      if (sessionBranch && !branchHistory.includes(sessionBranch)) {
        setBranchHistory(p => [sessionBranch, ...p]);
      }
    }
    setRunId(null);
    setMode("list");
  };

  const deleteInspection = (id) => {
    if (window.confirm("이 점검 기록을 삭제하시겠습니까?")) {
      setInspections(p => p.filter(r => r.id !== id));
    }
  };

  const loadInspection = (rec) => {
    setSessionDate(rec.date);
    setSessionBranch(rec.branch);
    const sel = {};
    rec.items.filter(i=>!i.oneOff).forEach(i => { sel[i.id]=true; });
    setSessionSelected(sel);
    setSessionOneOff(rec.items.filter(i=>i.oneOff).map(i=>i.text));
    const checks = {};
    rec.items.forEach(i => { checks[i.id] = { checked:i.checked, note:i.note }; });
    setRunChecks(checks);
    setRunOpinion(rec.opinion||"");
    setRunAction(rec.action||"");
    setRunId(rec.id);
    setMode("run");
  };

  // 필터링된 조회 목록
  const filteredInspections = inspections.filter(r =>
    (!filterDate || r.date === filterDate) &&
    (!filterBranch || r.branch.includes(filterBranch))
  );

  // ── 점검 완료율 계산
  const completionRate = (rec) => {
    const total = rec.items.length;
    if (!total) return 0;
    return Math.round(rec.items.filter(i=>i.checked).length / total * 100);
  };

  // ============================================================
  // MODE: 점검 기록 목록
  // ============================================================
  if (mode === "list") return (
    <div>
      {/* 상단 액션 버튼 */}
      <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap" }}>
        <button style={S.btn(true)} onClick={() => {
          setSessionDate(today); setSessionBranch(""); setSessionSelected({});
          setSessionOneOff([]); setOneOffInput(""); setRunId(null);
          setMode("setup");
        }}>＋ 새 점검 시작</button>
        <button style={S.btn(false)} onClick={() => setMode("manage")}>⚙️ 항목 관리</button>
        <button style={S.btn(false)} onClick={() => setMode("view")}>📊 기록 조회</button>
        <span style={{ marginLeft:"auto", fontSize:13, color:"#94a3b8", alignSelf:"center" }}>
          총 {inspections.length}건 저장됨
        </span>
      </div>

      {/* 최근 점검 목록 */}
      {inspections.length === 0 ? (
        <div style={{ ...S.card, textAlign:"center", padding:48, color:"#94a3b8" }}>
          <div style={{ fontSize:40, marginBottom:10 }}>📋</div>
          <p style={{ fontWeight:600 }}>아직 저장된 점검 기록이 없습니다.</p>
          <p style={{ fontSize:13 }}>새 점검 시작을 눌러 점검을 진행해 보세요.</p>
        </div>
      ) : (
        inspections.slice(0,20).map(rec => {
          const rate = completionRate(rec);
          return (
            <div key={rec.id} style={{ ...S.card, borderLeft:`4px solid ${rate===100?"#059669":"#1e3a5f"}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:8 }}>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                    <span style={{ fontSize:15, fontWeight:800, color:"#1e3a5f" }}>{rec.branch || "(지점명 없음)"}</span>
                    <span style={{ fontSize:13, color:"#64748b" }}>{rec.date}</span>
                    <span style={{ padding:"2px 10px", borderRadius:20, fontSize:12, fontWeight:700,
                      background:rate===100?"#dcfce7":"#eff6ff", color:rate===100?"#166534":"#1d4ed8" }}>
                      {rate}% 완료
                    </span>
                  </div>
                  <div style={{ fontSize:13, color:"#64748b" }}>
                    점검항목 {rec.items.length}개 · 완료 {rec.items.filter(i=>i.checked).length}개
                    {rec.opinion && <span style={{ color:"#d97706", marginLeft:8 }}>📝 의견 있음</span>}
                    {rec.action && <span style={{ color:"#059669", marginLeft:8 }}>✅ 조치 있음</span>}
                  </div>
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <button style={S.btn(true)} onClick={() => loadInspection(rec)}>이어보기 / 수정</button>
                  <button style={S.btn(false,"#fee2e2")} onClick={() => deleteInspection(rec.id)}>삭제</button>
                </div>
              </div>
              {/* 진행바 */}
              <div style={{ marginTop:12, height:4, background:"#f1f5f9", borderRadius:2 }}>
                <div style={{ height:"100%", width:`${rate}%`, background:rate===100?"#059669":"#1e3a5f", borderRadius:2, transition:"width 0.3s" }} />
              </div>
            </div>
          );
        })
      )}
    </div>
  );

  // ============================================================
  // MODE: 항목 관리
  // ============================================================
  if (mode === "manage") return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <button style={S.btn(false)} onClick={() => setMode("list")}>← 목록으로</button>
        <h2 style={{ ...S.h2, margin:0 }}>⚙️ 점검 항목 관리</h2>
      </div>

      {/* 신규 항목 추가 */}
      <div style={{ ...S.card, borderTop:"4px solid #1e3a5f", marginBottom:20 }}>
        <h3 style={S.h3}>새 항목 추가</h3>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <select value={newItemCat} onChange={e=>setNewItemCat(e.target.value)}
            style={{ padding:"10px 12px", border:"2px solid #e2e8f0", borderRadius:8, fontSize:13, outline:"none" }}>
            {CL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input value={newItemText} onChange={e=>setNewItemText(e.target.value)}
            placeholder="점검 항목 내용 입력"
            onKeyDown={e => {
              if (e.key==="Enter" && newItemText.trim()) {
                setMasterItems(p => [...p, { id:`MI-${Date.now()}`, category:newItemCat, text:newItemText.trim(), active:true }]);
                setNewItemText("");
              }
            }}
            style={{ ...S.input, flex:1, minWidth:200 }} />
          <button style={S.btn(true)} onClick={() => {
            if (!newItemText.trim()) return;
            setMasterItems(p => [...p, { id:`MI-${Date.now()}`, category:newItemCat, text:newItemText.trim(), active:true }]);
            setNewItemText("");
          }}>추가</button>
        </div>
      </div>

      {/* 카테고리별 항목 목록 */}
      {CL_CATEGORIES.map(cat => {
        const items = masterItems.filter(m => m.category === cat);
        if (!items.length) return null;
        return (
          <div key={cat} style={{ ...S.card, borderLeft:`4px solid ${CL_CAT_COLOR[cat]}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
              <span style={S.tag(CL_CAT_COLOR[cat])}>{cat}</span>
              <span style={{ fontSize:12, color:"#94a3b8" }}>{items.filter(i=>i.active).length}/{items.length}개 활성</span>
            </div>
            {items.map(item => (
              <div key={item.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 0",
                borderBottom:"1px solid #f1f5f9", opacity:item.active?1:0.45 }}>
                {/* 활성/비활성 토글 */}
                <div style={S.check(item.active)} onClick={() =>
                  setMasterItems(p => p.map(m => m.id===item.id ? {...m, active:!m.active} : m))
                }>
                  {item.active && <span style={{ color:"#fff", fontSize:11, fontWeight:900 }}>✓</span>}
                </div>
                {editingId === item.id ? (
                  <>
                    <input value={editText} onChange={e=>setEditText(e.target.value)}
                      onKeyDown={e => {
                        if (e.key==="Enter") {
                          setMasterItems(p => p.map(m => m.id===item.id ? {...m, text:editText} : m));
                          setEditingId(null);
                        }
                        if (e.key==="Escape") setEditingId(null);
                      }}
                      style={{ ...S.input, flex:1, padding:"6px 10px", fontSize:13 }} autoFocus />
                    <button style={S.btn(true)} onClick={() => {
                      setMasterItems(p => p.map(m => m.id===item.id ? {...m, text:editText} : m));
                      setEditingId(null);
                    }}>저장</button>
                    <button style={S.btn(false)} onClick={() => setEditingId(null)}>취소</button>
                  </>
                ) : (
                  <>
                    <span style={{ flex:1, fontSize:13, color:"#374151", lineHeight:1.5 }}>{item.text}</span>
                    <button style={{ ...S.btn(false), padding:"5px 10px", fontSize:12 }}
                      onClick={() => { setEditingId(item.id); setEditText(item.text); }}>수정</button>
                    <button style={{ ...S.btn(false), padding:"5px 10px", fontSize:12, color:"#dc2626", background:"#fee2e2" }}
                      onClick={() => {
                        if (window.confirm("항목을 삭제하시겠습니까?")) {
                          setMasterItems(p => p.filter(m => m.id !== item.id));
                        }
                      }}>삭제</button>
                  </>
                )}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );

  // ============================================================
  // MODE: 점검 세션 구성 (일자·지점·항목 선택)
  // ============================================================
  if (mode === "setup") {
    const activeItems = masterItems.filter(m => m.active);
    const allSelected = activeItems.every(m => sessionSelected[m.id]);

    return (
      <div>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
          <button style={S.btn(false)} onClick={() => setMode("list")}>← 목록으로</button>
          <h2 style={{ ...S.h2, margin:0 }}>📋 점검 세션 구성</h2>
        </div>

        {/* 일자 & 지점 */}
        <div style={{ ...S.card, borderTop:"4px solid #1e3a5f" }}>
          <h3 style={S.h3}>① 점검 기본 정보</h3>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <label style={{ fontSize:13, fontWeight:700, color:"#374151", display:"block", marginBottom:6 }}>점검 일자</label>
              <input type="date" value={sessionDate} onChange={e=>setSessionDate(e.target.value)}
                style={S.input} />
            </div>
            <div style={{ position:"relative" }}>
              <label style={{ fontSize:13, fontWeight:700, color:"#374151", display:"block", marginBottom:6 }}>
                지점명 <span style={{ fontSize:11, color:"#94a3b8", fontWeight:500 }}>이전 입력 기록에서 빠르게 선택</span>
              </label>
              <input value={sessionBranch}
                onChange={e => { setSessionBranch(e.target.value); setBranchSuggest(true); }}
                onFocus={() => setBranchSuggest(true)}
                onBlur={() => setTimeout(() => setBranchSuggest(false), 150)}
                placeholder="지점명 입력 (예: 강남우체국)"
                style={S.input} />
              {branchSuggest && branchHistory.filter(b => b.includes(sessionBranch)).length > 0 && (
                <div style={{ position:"absolute", top:"100%", left:0, right:0, background:"#fff",
                  border:"2px solid #e2e8f0", borderRadius:8, zIndex:100, boxShadow:"0 4px 12px rgba(0,0,0,0.12)", marginTop:2 }}>
                  {branchHistory.filter(b => b.includes(sessionBranch)).map(b => (
                    <div key={b} onMouseDown={() => { setSessionBranch(b); setBranchSuggest(false); }}
                      style={{ padding:"10px 14px", fontSize:14, cursor:"pointer", borderBottom:"1px solid #f1f5f9" }}
                      onMouseOver={e => e.currentTarget.style.background="#f0f4f8"}
                      onMouseOut={e => e.currentTarget.style.background="#fff"}>
                      📍 {b}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 항목 선택 */}
        <div style={{ ...S.card }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <h3 style={{ ...S.h3, margin:0 }}>② 점검 항목 선택</h3>
            <button style={{ ...S.btn(false), fontSize:12, padding:"5px 12px" }} onClick={() => {
              if (allSelected) setSessionSelected({});
              else {
                const sel = {};
                activeItems.forEach(m => { sel[m.id]=true; });
                setSessionSelected(sel);
              }
            }}>{allSelected ? "전체 해제" : "전체 선택"}</button>
          </div>
          {CL_CATEGORIES.map(cat => {
            const items = activeItems.filter(m => m.category===cat);
            if (!items.length) return null;
            return (
              <div key={cat} style={{ marginBottom:16 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                  <span style={S.tag(CL_CAT_COLOR[cat])}>{cat}</span>
                  <span style={{ fontSize:11, color:"#94a3b8" }}>
                    {items.filter(m=>sessionSelected[m.id]).length}/{items.length} 선택됨
                  </span>
                </div>
                {items.map(item => (
                  <div key={item.id} onClick={() => setSessionSelected(p => ({...p, [item.id]:!p[item.id]}))}
                    style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"8px 10px", cursor:"pointer",
                      borderRadius:8, marginBottom:4, background:sessionSelected[item.id]?"#eff6ff":"#f8fafc" }}>
                    <div style={S.check(sessionSelected[item.id])}>
                      {sessionSelected[item.id] && <span style={{ color:"#fff", fontSize:11, fontWeight:900 }}>✓</span>}
                    </div>
                    <span style={{ fontSize:13, color:"#374151", lineHeight:1.5 }}>{item.text}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* 1회성 추가 항목 */}
        <div style={{ ...S.card }}>
          <h3 style={S.h3}>③ 이번 점검 1회성 추가 항목 <span style={{ fontSize:12, color:"#94a3b8", fontWeight:400 }}>— 마스터에 저장되지 않음</span></h3>
          <div style={{ display:"flex", gap:8, marginBottom:10 }}>
            <input value={oneOffInput} onChange={e=>setOneOffInput(e.target.value)}
              placeholder="이번 점검에만 사용할 항목 입력"
              onKeyDown={e => { if (e.key==="Enter" && oneOffInput.trim()) { setSessionOneOff(p=>[...p, oneOffInput.trim()]); setOneOffInput(""); }}}
              style={{ ...S.input, flex:1 }} />
            <button style={S.btn(true)} onClick={() => {
              if (!oneOffInput.trim()) return;
              setSessionOneOff(p=>[...p, oneOffInput.trim()]);
              setOneOffInput("");
            }}>추가</button>
          </div>
          {sessionOneOff.map((t,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 10px",
              background:"#fef9c3", borderRadius:8, marginBottom:6 }}>
              <span style={{ fontSize:12, fontWeight:700, color:"#a16207", background:"#fde68a", padding:"2px 7px", borderRadius:4 }}>1회성</span>
              <span style={{ flex:1, fontSize:13, color:"#374151" }}>{t}</span>
              <button onClick={() => setSessionOneOff(p=>p.filter((_,idx)=>idx!==i))}
                style={{ background:"none", border:"none", color:"#dc2626", cursor:"pointer", fontSize:16 }}>×</button>
            </div>
          ))}
        </div>

        {/* 선택 요약 & 시작 버튼 */}
        <div style={{ ...S.card, background:"#1e3a5f", color:"#fff", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:14, fontWeight:700 }}>
              {sessionBranch || "지점 미입력"} · {sessionDate}
            </div>
            <div style={{ fontSize:13, opacity:0.8, marginTop:4 }}>
              마스터 {Object.values(sessionSelected).filter(Boolean).length}개 + 1회성 {sessionOneOff.length}개 선택됨
            </div>
          </div>
          <button onClick={startRun}
            disabled={Object.values(sessionSelected).filter(Boolean).length + sessionOneOff.length === 0}
            style={{ ...S.btn(true,"#3b82f6"), fontSize:15, padding:"12px 28px",
              opacity: Object.values(sessionSelected).filter(Boolean).length + sessionOneOff.length === 0 ? 0.4 : 1 }}>
            점검 시작 →
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // MODE: 점검 실행
  // ============================================================
  if (mode === "run") {
    const selectedMaster = masterItems.filter(m => sessionSelected[m.id]);
    const allItems = [
      ...selectedMaster.map(m => ({ ...m, oneOff:false })),
      ...sessionOneOff.map((t,i) => ({ id:`oneoff-${i}`, text:t, category:"기타", oneOff:true })),
    ];
    const checkedCount = allItems.filter(item => runChecks[item.id]?.checked).length;
    const total = allItems.length;
    const pct = total ? Math.round(checkedCount/total*100) : 0;

    return (
      <div>
        {/* 헤더 */}
        <div style={{ ...S.card, background:"#1e3a5f", color:"#fff", padding:"16px 24px", marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
            <div>
              <div style={{ fontSize:17, fontWeight:800 }}>
                📍 {sessionBranch || "지점 미입력"} &nbsp;·&nbsp; {sessionDate}
              </div>
              <div style={{ fontSize:13, opacity:0.8, marginTop:4 }}>
                {checkedCount}/{total} 완료 ({pct}%)
              </div>
            </div>
            <button style={{ ...S.btn(true,"rgba(255,255,255,0.15)"), fontSize:13 }}
              onClick={() => setMode("setup")}>← 구성 수정</button>
          </div>
          <div style={{ marginTop:12, height:6, background:"rgba(255,255,255,0.2)", borderRadius:3 }}>
            <div style={{ height:"100%", width:`${pct}%`, background:pct===100?"#4ade80":"#60a5fa", borderRadius:3, transition:"width 0.3s" }} />
          </div>
        </div>

        {/* 카테고리별 점검 항목 */}
        {CL_CATEGORIES.concat("기타").map(cat => {
          const catItems = allItems.filter(item => item.category===cat);
          if (!catItems.length) return null;
          const catColor = CL_CAT_COLOR[cat] || "#94a3b8";
          return (
            <div key={cat} style={{ ...S.card, borderLeft:`4px solid ${catColor}`, marginBottom:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                <span style={S.tag(catColor)}>{cat}</span>
                <span style={{ fontSize:12, color:"#94a3b8" }}>
                  {catItems.filter(i=>runChecks[i.id]?.checked).length}/{catItems.length}
                </span>
              </div>
              {catItems.map(item => {
                const state = runChecks[item.id] || { checked:false, note:"" };
                return (
                  <div key={item.id} style={{ marginBottom:10, padding:"10px 12px", borderRadius:10,
                    background:state.checked?"#f0fdf4":"#f8fafc", border:`1px solid ${state.checked?"#bbf7d0":"#e2e8f0"}`,
                    transition:"all 0.2s" }}>
                    <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                      <div style={S.check(state.checked)}
                        onClick={() => setRunChecks(p => ({...p, [item.id]:{...state, checked:!state.checked}}))}>
                        {state.checked && <span style={{ color:"#fff", fontSize:12, fontWeight:900 }}>✓</span>}
                      </div>
                      <div style={{ flex:1 }}>
                        <span style={{ fontSize:14, color:state.checked?"#166534":"#1e293b",
                          fontWeight: state.checked?600:400,
                          textDecoration:state.checked?"line-through":"none" }}>
                          {item.text}
                        </span>
                        {item.oneOff && <span style={{ marginLeft:8, fontSize:10, background:"#fde68a", color:"#a16207", padding:"1px 6px", borderRadius:3, fontWeight:700 }}>1회성</span>}
                      </div>
                    </div>
                    {/* 항목별 메모 */}
                    <div style={{ marginTop:8, paddingLeft:30 }}>
                      <input value={state.note}
                        onChange={e => setRunChecks(p => ({...p, [item.id]:{...state, note:e.target.value}}))}
                        placeholder="점검 메모 (이상사항, 특이사항 등)"
                        style={{ ...S.input, fontSize:12, padding:"6px 10px", background:state.note?"#fffbeb":"#fff",
                          borderColor:state.note?"#fbbf24":"#e2e8f0" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* 종합 의견 */}
        <div style={{ ...S.card, borderLeft:"4px solid #7c3aed" }}>
          <h3 style={{ ...S.h3, color:"#7c3aed" }}>📝 점검 종합 의견</h3>
          <textarea value={runOpinion} onChange={e=>setRunOpinion(e.target.value)}
            placeholder="이번 점검의 종합 의견, 주요 발견사항, 특이사항 등을 기록하세요."
            rows={4}
            style={{ ...S.input, resize:"vertical", lineHeight:1.7 }} />
        </div>

        {/* 조치 결과 */}
        <div style={{ ...S.card, borderLeft:"4px solid #059669" }}>
          <h3 style={{ ...S.h3, color:"#059669" }}>✅ 조치 결과</h3>
          <textarea value={runAction} onChange={e=>setRunAction(e.target.value)}
            placeholder="점검 결과에 따른 조치 사항, 지도 내용, 후속 계획 등을 기록하세요."
            rows={4}
            style={{ ...S.input, resize:"vertical", lineHeight:1.7 }} />
        </div>

        {/* 저장 버튼 */}
        <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:8 }}>
          <button style={S.btn(false)} onClick={() => setMode("list")}>임시 취소</button>
          <button style={{ ...S.btn(true,"#059669"), fontSize:15, padding:"12px 32px" }} onClick={saveInspection}>
            💾 점검 결과 저장
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // MODE: 기록 조회
  // ============================================================
  if (mode === "view") {
    const allBranches = [...new Set(inspections.map(r=>r.branch).filter(Boolean))];
    const allDates = [...new Set(inspections.map(r=>r.date))].sort().reverse();

    return (
      <div>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
          <button style={S.btn(false)} onClick={() => setMode("list")}>← 목록으로</button>
          <h2 style={{ ...S.h2, margin:0 }}>📊 점검 기록 조회</h2>
        </div>

        {/* 필터 */}
        <div style={{ ...S.card, marginBottom:16 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <label style={{ fontSize:13, fontWeight:700, color:"#374151", display:"block", marginBottom:6 }}>일자 필터</label>
              <select value={filterDate} onChange={e=>setFilterDate(e.target.value)} style={{ ...S.input }}>
                <option value="">전체 일자</option>
                {allDates.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:13, fontWeight:700, color:"#374151", display:"block", marginBottom:6 }}>지점 필터</label>
              <select value={filterBranch} onChange={e=>setFilterBranch(e.target.value)} style={{ ...S.input }}>
                <option value="">전체 지점</option>
                {allBranches.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>
          <p style={{ margin:"10px 0 0", fontSize:13, color:"#64748b" }}>
            {filteredInspections.length}건 조회됨
            {(filterDate||filterBranch) && (
              <button onClick={() => { setFilterDate(""); setFilterBranch(""); }}
                style={{ marginLeft:12, background:"none", border:"none", color:"#2563eb", cursor:"pointer", fontSize:13, fontWeight:600 }}>
                필터 초기화
              </button>
            )}
          </p>
        </div>

        {/* 조회 결과 */}
        {filteredInspections.length === 0 ? (
          <div style={{ ...S.card, textAlign:"center", padding:40, color:"#94a3b8" }}>해당 조건의 기록이 없습니다.</div>
        ) : filteredInspections.map(rec => {
          const rate = completionRate(rec);
          const issues = rec.items.filter(i=>!i.checked);
          return (
            <div key={rec.id} style={{ ...S.card, borderLeft:`4px solid ${rate===100?"#059669":"#dc2626"}`, marginBottom:14 }}>
              {/* 헤더 */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14, flexWrap:"wrap", gap:8 }}>
                <div>
                  <div style={{ fontSize:16, fontWeight:800, color:"#1e3a5f", marginBottom:4 }}>
                    📍 {rec.branch || "(지점명 없음)"}
                  </div>
                  <div style={{ fontSize:13, color:"#64748b" }}>{rec.date} · 항목 {rec.items.length}개</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ padding:"4px 14px", borderRadius:20, fontWeight:800, fontSize:14,
                    background:rate===100?"#dcfce7":"#fee2e2", color:rate===100?"#166534":"#dc2626" }}>
                    {rate}%
                  </span>
                  <button style={{ ...S.btn(false), fontSize:12, padding:"5px 12px" }}
                    onClick={() => loadInspection(rec)}>수정</button>
                </div>
              </div>

              {/* 진행바 */}
              <div style={{ height:6, background:"#f1f5f9", borderRadius:3, marginBottom:14 }}>
                <div style={{ height:"100%", width:`${rate}%`, background:rate===100?"#059669":"#dc2626", borderRadius:3 }} />
              </div>

              {/* 미완료 항목 */}
              {issues.length > 0 && (
                <div style={{ marginBottom:12 }}>
                  <p style={{ fontSize:12, fontWeight:700, color:"#dc2626", margin:"0 0 6px" }}>⚠ 미완료 항목 ({issues.length}개)</p>
                  {issues.map(i => (
                    <div key={i.id} style={{ fontSize:13, color:"#374151", padding:"4px 0 4px 12px",
                      borderLeft:"3px solid #fca5a5", marginBottom:4 }}>
                      {i.text}
                      {i.note && <span style={{ color:"#d97706", fontSize:12, display:"block", marginTop:2 }}>메모: {i.note}</span>}
                    </div>
                  ))}
                </div>
              )}

              {/* 완료 항목 중 메모 있는 것 */}
              {rec.items.filter(i=>i.checked && i.note).length > 0 && (
                <div style={{ marginBottom:12 }}>
                  <p style={{ fontSize:12, fontWeight:700, color:"#d97706", margin:"0 0 6px" }}>📌 메모 있는 완료 항목</p>
                  {rec.items.filter(i=>i.checked && i.note).map(i => (
                    <div key={i.id} style={{ fontSize:13, color:"#374151", padding:"4px 0 4px 12px",
                      borderLeft:"3px solid #fcd34d", marginBottom:4 }}>
                      {i.text}
                      <span style={{ color:"#d97706", fontSize:12, display:"block", marginTop:2 }}>메모: {i.note}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* 종합 의견 & 조치 결과 */}
              {(rec.opinion || rec.action) && (
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:8 }}>
                  {rec.opinion && (
                    <div style={{ padding:"10px 14px", background:"#f5f3ff", borderRadius:8 }}>
                      <p style={{ fontSize:11, fontWeight:700, color:"#7c3aed", margin:"0 0 4px" }}>📝 종합 의견</p>
                      <p style={{ fontSize:13, color:"#374151", margin:0, lineHeight:1.7 }}>{rec.opinion}</p>
                    </div>
                  )}
                  {rec.action && (
                    <div style={{ padding:"10px 14px", background:"#f0fdf4", borderRadius:8 }}>
                      <p style={{ fontSize:11, fontWeight:700, color:"#059669", margin:"0 0 4px" }}>✅ 조치 결과</p>
                      <p style={{ fontSize:13, color:"#374151", margin:0, lineHeight:1.7 }}>{rec.action}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return null;
}
