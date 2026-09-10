/* =========================================================
   설정
   ========================================================= */
// 구글 시트 연동용 Apps Script 웹앱 URL을 배포 후 여기에 넣으세요.
const SHEET_WEBAPP_URL = "";

/* =========================================================
   1부 장면 데이터
   ========================================================= */
const SCENES = [
  {
    id: "scene1",
    name: "등교 — 냉난방·짝꿍 휴지",
    type: "choice",
    image: "assets/scene1_classroom.png",
    narration: "교실 문을 여니 냉난방기가 며칠째 켜진 채 돌아가고 있어 공기가 답답하다. 짝꿍은 콧구멍에 휴지를 꽂은 채 책상에 앉아있고, 책상 위엔 콧물 범벅이 된 휴지가 수북이 쌓여있다.",
    caption: "그림 속 에어컨·창문·휴지를 눌러보면 상황을 더 자세히 알 수 있어요.",
    infoHotspots: [
      { left: "83%", top: "14%", title: "냉난방기 작동 중", desc: "냉난방기가 20도로 가동 중이에요. 냉난방기는 실내 공기를 순환시킬 뿐, 외부의 신선한 공기를 들여오지는 못해요." },
      { left: "54%", top: "67%", title: "쌓여있는 휴지", desc: "콧물이 많이 나서 코를 푼 휴지들이 책상 위에 수북이 쌓여있는 상황이에요. 사용한 휴지는 그 자체로 오염된 물건이 될 수 있어요." },
      { left: "30%", top: "28%", title: "닫혀있는 창문", desc: "창문이 굳게 닫혀있는 상황이에요. 냉난방기를 켜둔 채로 창문까지 닫혀있으면, 실내 공기가 전혀 바뀌지 않고 계속 순환만 하게 돼요." }
    ],
    choices: [
      { label: "창문과 앞뒷문을 열어 맞통풍 환기하기", points: 3, feedback: "적절한 환기였어요. 인플루엔자 비말은 공기 중 습도와 온도에 따라 부유 시간이 달라지는데, 환기는 실내 바이러스 입자의 농도 자체를 희석시키는 원리예요. 냉난방기는 공기를 순환시킬 뿐 외부 공기를 유입시키지 않기 때문에, 가동 중에도 하루 3회 이상 10분 이상의 자연환기가 반드시 필요해요." },
      { label: "짝꿍에게 휴지 정리와 손 씻기를 권하기", points: 3, feedback: "정확한 조치였어요. 인플루엔자 바이러스는 코를 푼 휴지 표면에서도 일정 시간 감염력을 유지할 수 있어서, 오염된 휴지는 그 자체로 간접 접촉 감염원(fomite)이 돼요. 즉시 폐기하고 손을 씻도록 안내한 건 접촉 전파 경로를 차단하는 올바른 대응이에요." },
      { label: "환기도 안 하고 휴지도 그대로 둔다", points: -3, feedback: "두 가지 방어선을 모두 놓친 선택이었어요. 인플루엔자는 비말 전파뿐 아니라, 오염된 물체 표면을 만진 손으로 눈·코·입 점막을 만졌을 때도 전파되는 접촉 감염 경로를 함께 가지고 있어요. 두 경로가 동시에 열려 있었던 셈이에요." },
      { label: "환기만 하고 짝꿍의 휴지는 못 본 척한다", points: 0, feedback: "절반의 조치였어요. 환기로 비말 전파 경로는 일부 차단했지만, 눈앞의 오염된 휴지(접촉 감염원)를 방치하면서 또 다른 감염 경로는 그대로 열어둔 상태가 됐어요." }
    ]
  },
  {
    id: "scene2",
    name: "조회 시간 — 마스크 고르기",
    type: "mask",
    image: "assets/scene2_mask_shop.png",
    narration: "\"요즘 독감이 유행이니 마스크를 착용할 수 있도록 하세요\"라는 선생님 말씀에 매점에 들러 마스크를 고른다.",
    caption: "마스크를 누르면 자세한 정보를 볼 수 있어요. (마스크 없이 그냥 가고 싶다면 오른쪽 문 쪽을 눌러보세요)",
    hotspots: [
      { key: "kf94", left: "46.5%", top: "69%", size: "8%", title: "KF94 마스크", desc: "평균 0.4㎛ 크기 입자를 94% 이상 차단해요. 차단력이 가장 높지만 필터 밀도가 높아 장시간 착용하면 숨쉬기가 답답할 수 있어요.", points: 3, feedback: "가장 높은 차단력을 선택했어요. KF94는 평균 0.4㎛ 크기의 입자를 94% 이상 걸러내도록 설계돼 있어서, 비말핵(수분이 증발하고 남은 바이러스 입자)까지도 상당 부분 차단할 수 있어요. 다만 호흡 저항이 큰 만큼, 활동량이 많은 날엔 답답함을 느낄 수 있어요." },
      { key: "kf80", left: "53.4%", top: "69%", size: "8%", title: "KF80 마스크", desc: "평균 0.6㎛ 크기 입자를 80% 이상 차단해요. 일상적인 예방에는 충분하고 호흡이 더 편해요.", points: 2, feedback: "일상적인 예방 목적에 적합한 균형 잡힌 선택이었어요. KF80은 평균 0.6㎛ 입자를 80% 이상 차단하면서 호흡 저항은 KF94보다 낮아, 장시간 착용이 필요한 학교생활에는 실용적인 선택지예요." },
      { key: "dental", left: "60.3%", top: "68.4%", size: "8%", title: "일반(덴탈) 마스크", desc: "보건용 마스크보다 차단력은 낮지만, 비말이 직접 닿는 걸 막아주는 효과는 있어요.", points: 1, feedback: "보건용 마스크보다 입자 차단 성능은 떨어지지만, 비말이 호흡기 점막에 직접 닿는 것을 막아주는 물리적 장벽 역할은 여전히 해요. 완전한 필터링보다는 '1차 차단'의 의미로 이해하면 돼요." }
    ],
    noPickHotspot: { left: "83%", top: "38%" },
    noPickChoice: { label: "마스크 없이 그냥 되돌아가기", points: -3, feedback: "가장 위험한 선택이었어요. 인플루엔자의 주요 전파 경로인 비말 감염에 대한 1차 방어선이 아예 없는 상태로 하루를 보내는 셈이에요." }
  },
  {
    id: "scene3",
    name: "쉬는 시간 — 독감 걸린 짝꿍의 기침",
    type: "choice",
    image: "assets/scene3_cough.png",
    narration: "옆자리 짝꿍이 아까부터 콜록거리더니 갑자기 손으로 입을 막고 기침한다. 그 손으로 다시 필기구를 만지려 한다.",
    caption: "짝꿍을 눌러보면 지금 상황을 더 자세히 알 수 있어요.",
    infoHotspots: [
      { left: "38%", top: "46%", title: "기침하는 짝꿍", desc: "짝꿍이 손으로 입을 막고 기침을 하는 상황이에요. 손으로 막은 뒤 그 손으로 다시 물건을 만지면, 손에 남은 비말이 물건 표면을 거쳐 다른 사람에게 옮겨갈 수 있어요." }
    ],
    choices: [
      { label: "\"옷소매로 가리고 기침하는 게 나아, 손 씻고 오자\"라고 알려주기", points: 3, feedback: "정확한 조언이었어요. 기침 예절의 핵심은 비말이 퍼지는 반경과 방향을 최소화하는 거예요. 손으로 입을 막으면 비말이 손에 남아 물건이나 다른 사람에게 옮겨갈 수 있지만, 옷소매 위쪽으로 가리면 비말이 옷감에 흡수되고 손은 오염되지 않아 접촉 전파 위험이 줄어들어요." },
      { label: "그냥 자리를 옮겨서 나만 피한다", points: 0, feedback: "본인의 노출은 줄였지만 근본적인 전파 경로 자체를 차단하지는 못한 선택이었어요. 짝꿍이 계속 같은 방식으로 기침한다면 주변의 다른 학생들에게 전파될 가능성은 그대로 남아있어요." },
      { label: "아무 말 안 하고 계속 옆에 앉아있는다", points: -2, feedback: "가장 아쉬운 선택이었어요. 인플루엔자는 증상이 나타나기 하루 전부터 발병 후 5~7일(소아·청소년은 그 이상)까지 감염력을 유지할 수 있어서, 이 시기의 기침 관리를 방치하면 학급 내 2차 감염 위험이 커져요." },
      { label: "짝꿍에게 마스크를 씌워주며 보건실에 가자고 권한다", points: 3, feedback: "가장 적극적인 선택이었어요. 발열 등 인플루엔자 초기 증상을 조기에 발견해서 보건실로 안내하면, 격리·진료가 앞당겨져 학급 내 추가 전파를 차단하는 데 실질적인 도움이 돼요." }
    ]
  },
  {
    id: "scene4",
    name: "급식 시간 — 손씻기",
    type: "handwash",
    image: "assets/scene4_handwash.png",
    narration: "손씻기 시간, 줄이 길어서 마음이 급하다. 세면대 옆 벽엔 \"올바른 손씻기 6단계\" 포스터가 붙어있다.",
    caption: "포스터와 손 씻는 모습을 각각 눌러 확인해야 다음으로 넘어갈 수 있어요.",
    posterHotspot: { left: "6%", top: "5%", width: "24%", height: "50%" },
    posterImage: "assets/handwash_poster.png",
    handwashHotspot: { left: "36%", top: "78%" },
    choices: [
      { label: "포스터 방법대로 제대로 씻기", points: 3, feedback: "6단계를 의식하며 손을 씻은 선택이었어요. 손 씻기의 예방 효과는 물리적으로 병원체를 씻어내는 마찰력과, 비누의 계면활성제가 지질막을 가진 바이러스의 외피를 파괴하는 두 가지 원리가 함께 작용한 결과예요." },
      { label: "손바닥·손등만 씻고 끝내기", points: 1, feedback: "손바닥과 손등만 씻는 건 흔히 하는 실수예요. 손가락 사이, 손톱 밑, 엄지처럼 접촉면이 좁고 굴곡진 부위일수록 오히려 세정이 잘 안 되고 병원체가 남아있기 쉬워요." },
      { label: "물로만 대충 헹구기", points: 0, feedback: "물로만 헹구는 것도 어느 정도 효과는 있지만, 비누의 계면활성제 작용 없이는 지질막으로 둘러싸인 바이러스의 외피를 효과적으로 파괴하기 어려워요." },
      { label: "안 씻고 바로 식사", points: -3, feedback: "가장 위험한 선택이었어요. 오염된 손으로 음식을 만지면, 손에 남아있던 병원체가 그대로 입으로 들어가는 직접적인 감염 경로가 만들어져요." }
    ]
  },
  {
    id: "scene5",
    name: "청소 시간 — 책상/문고리 소독",
    type: "info-choice",
    image: "assets/scene5_cleaning.png",
    narration: "청소 당번인데, 오늘 유독 기침하는 친구가 많았다. 표면에 남은 바이러스까지 없애려면 소독까지 해줘야 한다.",
    caption: "책상과 문고리를 각각 눌러보면 왜 소독이 필요한지 알 수 있어요.",
    infoHotspots: [
      { left: "40%", top: "83%", title: "책상 표면", desc: "기침이나 재채기를 할 때 튄 비말이 책상 표면에 내려앉으면, 그 안의 바이러스가 표면에서 최대 24~48시간까지 감염력을 유지할 수 있다고 알려져 있어요." },
      { left: "14%", top: "48%", title: "문고리", desc: "문고리는 학급 전체가 반복해서 만지는 접점이에요. 손에 묻은 비말이 문고리 표면에 옮겨지면, 다른 사람이 만졌을 때 손을 통해 다시 옮겨갈 수 있고 이 역시 최대 24~48시간 정도 감염력이 남아있을 수 있어요." }
    ],
    choices: [
      { label: "책상과 문고리 모두 소독하기", points: 3, feedback: "손이 자주 닿는 두 접점을 모두 소독한 가장 철저한 선택이었어요. 표면 소독은 단순히 먼지를 없애는 청소와 달리, 소독 성분이 병원체의 단백질 구조나 지질막을 파괴해서 감염력 자체를 없애는 과정이에요." },
      { label: "책상만 소독하고 문고리는 넘어가기", points: 1, feedback: "책상은 소독했지만 학급 전체의 공용 접점인 문고리를 놓쳤어요. 한 사람만 만지는 개인 물품보다, 여러 사람이 반복해서 만지는 표면일수록 소독의 우선순위가 높아요." },
      { label: "빗자루질만 하고 소독은 생략", points: -1, feedback: "청소(먼지 제거)와 소독(병원체 사멸)은 서로 다른 개념이에요. 눈에 보이는 것을 치웠다고 해서 표면에 남은 바이러스가 사라지는 건 아니에요." },
      { label: "청소를 대충 끝내고 바로 하교", points: -3, feedback: "소독을 전혀 하지 않은 선택이었어요. 다음 날 등교하는 학급 친구들이 오염된 표면에 그대로 노출되는 결과로 이어져요." }
    ]
  },
  {
    id: "scene6",
    name: "하교 후 — 떡볶이",
    type: "choice",
    image: "assets/scene6_tteokbokki.png",
    narration: "하교 후 친구가 떡볶이를 함께 먹자고 제안했다. 콧물을 훌쩍이는 친구였지만 차마 거절하지 못하고, 결국 한 그릇에 담긴 떡볶이를 서로 포크로 찍어 먹고 있다.",
    caption: "떡볶이를 눌러보면 왜 위험한지 알 수 있어요.",
    infoHotspots: [
      { left: "49%", top: "66%", title: "함께 먹는 떡볶이", desc: "한 그릇의 음식을 여러 사람이 함께 떠먹으면, 포크나 젓가락에 묻은 침을 통해 바이러스가 음식과 그릇 표면으로 옮겨갈 수 있어요. 또한 식사 중에는 마스크를 벗고 가까운 거리에서 대화를 나누게 되므로 비말 노출 시간도 함께 늘어나요. 음식이 뜨거웠더라도 조리 이후 식는 동안에는 살균 효과가 없어요." }
    ],
    choices: [
      { label: "지금부터라도 각자 접시에 덜어서 먹자고 제안한다", points: 2, feedback: "이미 공유된 그릇을 통한 노출은 되돌릴 수 없지만, 지금부터라도 개인 접시로 나누면 추가적인 직접 접촉(포크를 통한 타액 교환)은 막을 수 있어요." },
      { label: "그만 먹고 마무리하자고 자연스럽게 제안한다", points: 3, feedback: "가장 안전한 선택이었어요. 밀접 접촉 시간을 최소화하는 것이 비말·접촉 노출을 줄이는 가장 확실한 방법이에요." },
      { label: "신경 쓰지 않고 계속 같은 그릇, 같은 포크로 먹는다", points: -3, feedback: "가장 위험한 선택이었어요. 타액이 섞인 도구를 함께 사용하는 건 침을 매개로 한 직접적인 접촉 전파 경로예요." },
      { label: "마스크가 없으니 대화를 줄이고 최대한 빨리 먹고 헤어진다", points: 1, feedback: "완전히 피하지는 못했지만, 대화(비말 생성)를 줄이고 노출 시간을 단축한 절충안이었어요." }
    ]
  }
];

/* =========================================================
   손씻기 미니퀴즈 데이터
   ========================================================= */
const QUIZ = {
  time: { options: ["10초 이상", "30초 이상", "5초 이상"], answer: "30초 이상" },
  water: { options: ["흐르는 물", "받아둔 물"], answer: "흐르는 물" },
  soap: { options: ["비누로", "물로만"], answer: "비누로" },
  parts: { options: ["손바닥", "손등", "손깍지", "손가락 사이", "엄지손가락", "손톱 밑"] }
};

/* =========================================================
   2부 채팅 데이터
   ========================================================= */
const CHAT_SCENES = [
  {
    id: "chat7",
    name: "짝꿍의 고민 — 처방약",
    theirMessages: [{ text: "이거 처방받았는데 그냥 안 먹고 버텨볼까?" }],
    photo: {
      src: "assets/chat_tamiflu.png",
      title: "타미플루 (성분명: 오셀타미비르)",
      desc: "• 인플루엔자 바이러스가 몸속에서 늘어나는 것을 돕는 뉴라미니다제 효소를 억제하는 항바이러스제예요.<br>• 증상이 나타난 지 48시간 이내에 복용을 시작해야 효과가 가장 좋아요.<br>• 콧물약·기침약 같은 일반 감기약은 증상만 완화할 뿐 바이러스 증식엔 영향을 주지 않지만, 타미플루는 바이러스 증식 자체를 억제한다는 점이 달라요.<br>• 처방받은 기간을 다 채우지 않고 중간에 끊으면 남은 바이러스가 다시 증식하거나 약에 내성을 가진 바이러스가 생길 위험이 있어서, 증상이 나아져도 끝까지 복용해야 해요."
    },
    replies: [
      { label: "증상이 나타난 지 48시간 이내에는 먹어야 해, 꼭 끝까지 복용해", points: 3, feedback: "정확한 조언이었어요. 오셀타미비르는 인플루엔자 바이러스의 뉴라미니다제 효소를 억제해서 바이러스가 새로운 세포로 퍼져나가는 것을 막아줘요. 일반 감기약은 증상만 완화할 뿐 바이러스 증식을 막지 못하지만, 타미플루는 원인 자체에 작용해요. 처방 기간을 다 채우지 않으면 내성을 가진 바이러스가 남을 위험도 있어요." },
      { label: "열 내리면 그만 먹어도 돼", points: -2, feedback: "잘못된 조언이었어요. 항바이러스제를 처방 기간보다 일찍 중단하면 남아있는 바이러스가 다시 증식하면서 증상이 재발하거나, 약제 내성을 가진 바이러스가 나타날 위험이 있어요." },
      { label: "약보다 그냥 푹 쉬는 게 낫지 않아?", points: -1, feedback: "휴식이 회복에 중요한 건 맞지만, 감기약과 달리 타미플루는 바이러스 증식 자체를 억제하는 항바이러스제라는 차이가 있어요. 증상 완화와 원인 치료는 함께 가는 게 맞아요." },
      { label: "(답장하지 않고 넘어가기)", points: 0, feedback: "짝꿍이 정확한 정보 없이 스스로 판단하게 뒀어요." }
    ]
  },
  {
    id: "chat8",
    name: "짝꿍의 고민 — 컨디션 관리",
    theirMessages: [{ text: "열은 좀 내렸는데 학원 가도 되겠지?" }],
    replies: [
      { label: "해열제 없이 24시간 동안 열이 나지 않아야 몸이 회복되는 거래, 무리하지마", points: 3, feedback: "정확한 조언이었어요. 해열제는 체온을 일시적으로 낮출 뿐 바이러스 증식을 억제하지 못해요. 해열제 없이도 정상 체온이 24시간 이상 유지돼야 실제로 감염력이 충분히 낮아졌다고 볼 수 있어요. 해열제 효과가 떨어지는 시점에 다시 열이 오른다면, 아직 몸속에서 바이러스와 싸우고 있는 중이라는 신호예요." },
      { label: "괜찮아 보이면 가도 되지 뭐", points: -2, feedback: "위험한 조언이었어요. 겉보기엔 나아 보여도 감염력이 남아있을 수 있어요." },
      { label: "약 먹었으니까 바로 가도 될 걸", points: -1, feedback: "잘못된 조언이었어요. 해열제를 복용한 경우엔 마지막 투약 시점부터 48시간이 지나야 등교나 외출이 가능해요." },
      { label: "(답장하지 않고 넘어가기)", points: 0, feedback: "짝꿍이 무리해서 활동했을 가능성이 남았어요." }
    ]
  },
  {
    id: "chat9",
    name: "짝꿍의 고민 — 결석 처리",
    theirMessages: [{ text: "학교 며칠 못 나갔는데 결석 처리되면 어떡하지..." }],
    replies: [
      { label: "격리기간과 진단명이 적힌 진단소견서를 학교에 내면, 그 기간은 출석 인정돼", points: 3, feedback: "정확한 정보였어요. 학교는 감염병 확산 방지를 위해 등교중지 기간을 인정하는 제도를 운영하고 있어요. 진단명과 격리(등교중지) 권고 기간이 명시된 진단서나 소견서를 제출하면, 그 기간의 결석은 질병 결석이 아니라 출석으로 인정돼요." },
      { label: "그냥 결석 처리될 걸", points: -2, feedback: "잘못된 정보였어요. 짝꿍이 불필요하게 걱정했을 수 있어요." },
      { label: "선생님한테 말만 하면 알아서 해주실 거야", points: -1, feedback: "틀린 말은 아니지만 구체적인 방법(진단서 제출)을 알려줬으면 짝꿍이 더 안심했을 거예요." },
      { label: "(답장하지 않고 넘어가기)", points: 0, feedback: "도움을 줄 기회를 놓쳤어요." }
    ]
  }
];

const ALL_STEPS = SCENES.concat(CHAT_SCENES);

const REFLECT_QUESTIONS = [
  "환기가 감염 예방에 중요하다는 걸 대부분 알고 있는데도, 실제 교실에서는 왜 잘 지켜지지 않을까? 지식이 행동으로 이어지지 않는 이유를 개인적 요인과 환경적 요인으로 나누어 설명해보자.",
  "마스크가 번거롭다는 이유로 착용률이 떨어지는 경우가 많다. '알지만 실천하지 않는' 상황을 줄이려면 개인의 의지에 맡기는 것과, 규칙이나 환경 설계로 보완하는 것 중 어느 쪽이 더 효과적일지 근거를 들어 논해보자.",
  "친구의 잘못된 위생 습관을 지적하는 게 어색하게 느껴질 때, 관계를 해치지 않으면서도 조언할 수 있는 구체적인 대화 방식은 무엇일까?",
  "손씻기는 예방 효과가 가장 크면서도 비용이 거의 들지 않는 방법인데도 실천율은 낮은 편이다. 나의 경우 '알고 있음'과 '실제로 함' 사이에 어떤 차이가 있는지 스스로 점검해보자.",
  "청소와 소독의 차이를 알고 있어도 시간이 부족하면 소독을 생략하게 되는 경우가 많다. 이런 상황에서 우선순위를 정하는 나만의 기준을 세워보자.",
  "거절이 어색해서 위험을 감수하게 되는 상황은 이 장면 말고도 흔하다. 건강을 지키면서도 관계를 해치지 않게 거절하는 나만의 표현을 만들어보자.",
  "약을 처방받은 대로 끝까지 먹어야 한다는 걸 알면서도 증상이 나아지면 중단하는 사람이 많다. 이런 '증상만 보고 판단하기'의 함정은 무엇일까?",
  "몸이 괜찮아 보여도 활동을 자제해야 한다는 원칙과, 당장 해야 할 일(학원, 약속) 사이에서 갈등이 생길 때 나는 어떤 기준으로 판단해야 할까?",
  "제도(출석 인정)를 몰라서 무리하게 등교하는 경우가 있다. 오늘 내가 알고 있었지만 평소에는 잘 실천하지 못했던 예방 수칙을 하나 골라, 그 이유와 앞으로의 개선 방법을 적어보자."
];

/* =========================================================
   상태
   ========================================================= */
const state = {
  student: { grade: null, cls: null, number: null, name: "" },
  phase: "entry",
  sceneIndex: 0,
  chatIndex: 0,
  totalSteps: SCENES.length + CHAT_SCENES.length,
  records: [],
  part1PointsSum: 0,
  part2PointsSum: 0,
  history: [],
  viewingQuiz: false,
  hw: { posterViewed: false, handwashChecked: false, quizBonus: 0, quizFeedback: "", quizDetail: null }
};

/* =========================================================
   유틸
   ========================================================= */
function $(sel) { return document.querySelector(sel); }
function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
}
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  $("#" + id).classList.add("active");
  window.scrollTo(0, 0);
  if (id === "screen-entry") {
    $("#top-nav").classList.add("hidden");
  } else {
    $("#top-nav").classList.remove("hidden");
  }
}
function updateNavTitle(text) { $("#nav-title").textContent = text || ""; }

function openModal(html) {
  $("#modal-content").innerHTML = html;
  $("#modal-overlay").classList.remove("hidden");
}
function closeModal(onCloseCb) {
  $("#modal-overlay").classList.add("hidden");
  if (onCloseCb) onCloseCb();
}
$("#modal-close").addEventListener("click", () => closeModal());
$("#modal-overlay").addEventListener("click", (e) => {
  if (e.target.id === "modal-overlay") closeModal();
});

function typeText(elem, text, speed) {
  speed = speed || 16;
  elem.textContent = "";
  let i = 0;
  if (elem._typeTimer) clearInterval(elem._typeTimer);
  elem._typeTimer = setInterval(() => {
    elem.textContent += text.charAt(i);
    i++;
    if (i >= text.length) clearInterval(elem._typeTimer);
  }, speed);
}

function fillSelect(id, from, to) {
  const sel = $(id);
  sel.innerHTML = "";
  const empty = el("option", "", "선택");
  empty.value = "";
  sel.appendChild(empty);
  for (let i = from; i <= to; i++) {
    const o = el("option", "", i);
    o.value = i;
    sel.appendChild(o);
  }
}

/* =========================================================
   히스토리(뒤로가기) 관리
   ========================================================= */
function snapshotState() {
  return {
    phase: state.phase,
    sceneIndex: state.sceneIndex,
    chatIndex: state.chatIndex,
    records: state.records.map(r => Object.assign({}, r)),
    part1PointsSum: state.part1PointsSum,
    part2PointsSum: state.part2PointsSum
  };
}
function restoreState(snap) {
  state.phase = snap.phase;
  state.sceneIndex = snap.sceneIndex;
  state.chatIndex = snap.chatIndex;
  state.records = snap.records.map(r => Object.assign({}, r));
  state.part1PointsSum = snap.part1PointsSum;
  state.part2PointsSum = snap.part2PointsSum;
}
function enterStep(phase, extra, renderFn) {
  state.phase = phase;
  Object.assign(state, extra || {});
  state.history.push(snapshotState());
  renderFn();
}
function goBack() {
  if ($("#screen-lookup").classList.contains("active")) {
    showScreen("screen-entry");
    return;
  }
  if (state.viewingQuiz) {
    state.viewingQuiz = false;
    renderScene(true);
    showScreen("screen-scene");
    return;
  }
  if (state.history.length === 0) return;
  state.history.pop();
  if (state.history.length === 0) {
    showScreen("screen-entry");
    return;
  }
  const target = state.history[state.history.length - 1];
  restoreState(target);
  if (target.phase === "scene") { renderScene(); showScreen("screen-scene"); }
  else if (target.phase === "part2intro") { renderPart2Intro(); showScreen("screen-part2-intro"); }
  else if (target.phase === "chat") { renderChat(); showScreen("screen-chat"); }
  else { showScreen("screen-entry"); }
}
$("#btn-back").addEventListener("click", goBack);
$("#btn-home").addEventListener("click", () => {
  if (!confirm("처음으로 돌아가면 지금까지의 진행 내용이 사라져요. 이동할까요?")) return;
  Object.assign(state, {
    phase: "entry", sceneIndex: 0, chatIndex: 0, records: [],
    part1PointsSum: 0, part2PointsSum: 0, history: [], viewingQuiz: false,
    hw: { posterViewed: false, handwashChecked: false, quizBonus: 0, quizFeedback: "", quizDetail: null }
  });
  showScreen("screen-entry");
});

/* =========================================================
   입장 화면
   ========================================================= */
fillSelect("#sel-grade", 1, 3);
fillSelect("#sel-class", 1, 12);
fillSelect("#sel-number", 1, 30);
fillSelect("#lk-grade", 1, 3);
fillSelect("#lk-class", 1, 12);
fillSelect("#lk-number", 1, 30);

$("#btn-start").addEventListener("click", () => {
  const grade = $("#sel-grade").value;
  const cls = $("#sel-class").value;
  const number = $("#sel-number").value;
  const name = $("#input-name").value.trim();

  if (!grade || !cls || !number || !name) {
    $("#entry-error").textContent = "학년, 반, 번호, 이름을 모두 입력해주세요.";
    return;
  }
  state.student = { grade, cls, number, name };
  enterStep("scene", { sceneIndex: 0 }, () => { renderScene(); showScreen("screen-scene"); });
});

$("#btn-goto-lookup").addEventListener("click", () => {
  showScreen("screen-lookup");
});

/* =========================================================
   1부 진행
   ========================================================= */
function updateProgress() {
  let stepNow;
  if (state.phase === "scene") stepNow = state.sceneIndex + 1;
  else if (state.phase === "chat") stepNow = SCENES.length + state.chatIndex + 1;
  else stepNow = state.totalSteps;
  const pct = Math.round((stepNow / state.totalSteps) * 100);
  $("#progress-fill").style.width = pct + "%";
  $("#progress-label").textContent = `${stepNow} / ${state.totalSteps}`;
}

function renderScene(preserveHw) {
  const scene = SCENES[state.sceneIndex];
  updateNavTitle(scene.name);
  updateProgress();

  $("#scene-image").src = scene.image;
  $("#scene-caption").textContent = scene.caption || "";
  typeText($("#scene-narration"), scene.narration);

  $("#scene-guidance").classList.add("hidden");
  $("#scene-info-note").classList.add("hidden");
  $("#scene-info-note").innerHTML = "";

  const hotspotLayer = $("#hotspot-layer");
  hotspotLayer.innerHTML = "";
  const choicesWrap = $("#scene-choices");
  choicesWrap.innerHTML = "";
  choicesWrap.classList.remove("locked");

  (scene.infoHotspots || []).forEach(hs => {
    const dot = document.createElement("div");
    dot.className = "hotspot";
    dot.style.left = hs.left;
    dot.style.top = hs.top;
    dot.addEventListener("click", () => openModal(`<div class="modal-title">${hs.title}</div><p class="modal-desc">${hs.desc}</p>`));
    hotspotLayer.appendChild(dot);
  });

  if (scene.type === "choice") {
    renderChoiceButtons(scene.choices, scene, choicesWrap);
  } else if (scene.type === "mask") {
    renderMaskScene(scene, hotspotLayer, choicesWrap);
  } else if (scene.type === "info-choice") {
    renderChoiceButtons(scene.choices, scene, choicesWrap);
  } else if (scene.type === "handwash") {
    if (!preserveHw) {
      state.hw = { posterViewed: false, handwashChecked: false, quizBonus: 0, quizFeedback: "", quizDetail: null };
    }
    renderHandwashScene(scene, hotspotLayer, choicesWrap);
  }
}

function renderChoiceButtons(choices, scene, wrap) {
  const letters = ["A", "B", "C", "D"];
  choices.forEach((choice, idx) => {
    const btn = el("button", "choice-btn");
    btn.innerHTML = `<span class="choice-badge">${letters[idx]}</span><span>${choice.label}</span>`;
    btn.addEventListener("click", () => commitSceneChoice(scene, choice));
    wrap.appendChild(btn);
  });
}

function renderMaskScene(scene, hotspotLayer, choicesWrap) {
  scene.hotspots.forEach(hs => {
    const dot = document.createElement("div");
    dot.className = "hotspot";
    dot.style.left = hs.left;
    dot.style.top = hs.top;
    if (hs.size) dot.style.width = hs.size;
    dot.addEventListener("click", () => {
      openModal(`
        <div class="modal-title">${hs.title}</div>
        <p class="modal-desc">${hs.desc}</p>
        <button class="btn-primary btn-block" id="confirm-mask-btn">이 마스크 선택하기</button>
      `);
      $("#confirm-mask-btn").addEventListener("click", () => {
        closeModal();
        commitSceneChoice(scene, { label: hs.title + " 선택", points: hs.points, feedback: hs.feedback });
      });
    });
    hotspotLayer.appendChild(dot);
  });

  if (scene.noPickHotspot) {
    const dot = document.createElement("div");
    dot.className = "hotspot";
    dot.style.left = scene.noPickHotspot.left;
    dot.style.top = scene.noPickHotspot.top;
    dot.addEventListener("click", () => {
      openModal(`
        <div class="modal-title">${scene.noPickChoice.label}</div>
        <p class="modal-desc">마스크를 사지 않고 그냥 교실로 돌아가려고 해요.</p>
        <button class="btn-primary btn-block" id="confirm-nopick-btn">그냥 돌아가기</button>
      `);
      $("#confirm-nopick-btn").addEventListener("click", () => {
        closeModal();
        commitSceneChoice(scene, scene.noPickChoice);
      });
    });
    hotspotLayer.appendChild(dot);
  }
  choicesWrap.innerHTML = "";
}

function renderHandwashScene(scene, hotspotLayer, choicesWrap) {
  const posterDot = document.createElement("div");
  posterDot.className = "hotspot rect" + (state.hw.posterViewed ? " hotspot-done" : "");
  posterDot.style.left = scene.posterHotspot.left;
  posterDot.style.top = scene.posterHotspot.top;
  posterDot.style.width = scene.posterHotspot.width;
  posterDot.style.height = scene.posterHotspot.height;
  posterDot.style.transform = "none";
  posterDot.addEventListener("click", () => {
    openModal(`<div class="modal-title">올바른 손씻기 6단계</div><img src="${scene.posterImage}" alt="손씻기 포스터"><p class="modal-desc">포스터를 참고해서 손을 씻어보세요.</p>`);
    closeModalHookOnce(() => {
      state.hw.posterViewed = true;
      refreshHandwashGuidance();
    });
  });
  hotspotLayer.appendChild(posterDot);

  const washDot = document.createElement("div");
  washDot.className = "hotspot" + (state.hw.handwashChecked ? " hotspot-done" : "");
  washDot.style.left = scene.handwashHotspot.left;
  washDot.style.top = scene.handwashHotspot.top;
  washDot.addEventListener("click", () => {
    state.viewingQuiz = true;
    renderQuiz(scene);
    showScreen("screen-quiz");
  });
  hotspotLayer.appendChild(washDot);

  renderChoiceButtons(scene.choices, scene, choicesWrap);
  refreshHandwashGuidance();
}

let modalCloseHook = null;
function closeModalHookOnce(fn) { modalCloseHook = fn; }
$("#modal-close").addEventListener("click", () => { if (modalCloseHook) { const f = modalCloseHook; modalCloseHook = null; f(); } });
$("#modal-overlay").addEventListener("click", (e) => { if (e.target.id === "modal-overlay" && modalCloseHook) { const f = modalCloseHook; modalCloseHook = null; f(); } });

function refreshHandwashGuidance() {
  const note = $("#scene-guidance");
  note.classList.remove("hidden");
  note.classList.add("guidance");
  if (state.hw.posterViewed && state.hw.handwashChecked) {
    note.textContent = "✅ 확인 완료! 이제 실제로 어떻게 씻었는지 골라주세요.";
    note.classList.add("ready");
    $("#scene-choices").classList.remove("locked");
  } else {
    note.textContent = "포스터와 손 씻는 모습을 모두 눌러서 확인해주세요.";
    note.classList.remove("ready");
    $("#scene-choices").classList.add("locked");
  }
}

function commitSceneChoice(scene, choice) {
  state.records.push({
    name: scene.name,
    choiceLabel: choice.label,
    points: choice.points,
    feedback: choice.feedback,
    isHandwash: !!choice.quizDetail,
    quizDetail: choice.quizDetail || null
  });
  state.part1PointsSum += choice.points;

  const nextIndex = state.sceneIndex + 1;
  if (nextIndex < SCENES.length) {
    enterStep("scene", { sceneIndex: nextIndex }, () => { renderScene(); showScreen("screen-scene"); });
  } else {
    enterStep("part2intro", {}, () => { renderPart2Intro(); showScreen("screen-part2-intro"); });
  }
}

/* =========================================================
   손씻기 미니퀴즈
   ========================================================= */
let quizState = { time: null, water: null, soap: null, parts: [] };

function renderQuiz(scene) {
  quizState = { time: null, water: null, soap: null, parts: [] };
  buildQuizOptions("#quiz-time", QUIZ.time.options, (val) => { quizState.time = val; }, false);
  buildQuizOptions("#quiz-water", QUIZ.water.options, (val) => { quizState.water = val; }, false);
  buildQuizOptions("#quiz-soap", QUIZ.soap.options, (val) => { quizState.soap = val; }, false);
  buildQuizOptions("#quiz-parts", QUIZ.parts.options, (val) => {
    const i = quizState.parts.indexOf(val);
    if (i >= 0) quizState.parts.splice(i, 1); else quizState.parts.push(val);
  }, true);

  $("#btn-quiz-submit").onclick = () => submitQuiz(scene);
}

function buildQuizOptions(containerSel, options, onPick, multi) {
  const container = $(containerSel);
  container.innerHTML = "";
  options.forEach(opt => {
    const b = el("button", "quiz-opt");
    b.innerHTML = multi ? `<span class="chk"></span><span>${opt}</span>` : opt;
    b.addEventListener("click", () => {
      if (multi) {
        b.classList.toggle("selected");
      } else {
        container.querySelectorAll(".quiz-opt").forEach(o => o.classList.remove("selected"));
        b.classList.add("selected");
      }
      onPick(opt);
    });
    container.appendChild(b);
  });
}

function submitQuiz(scene) {
  if (!quizState.time || !quizState.water || !quizState.soap || quizState.parts.length === 0) {
    alert("모든 문항에 답해주세요.");
    return;
  }
  const timeOk = quizState.time === QUIZ.time.answer;
  const waterOk = quizState.water === QUIZ.water.answer;
  const soapOk = quizState.soap === QUIZ.soap.answer;
  const partsOk = QUIZ.parts.options.every(p => quizState.parts.includes(p)) && quizState.parts.length === QUIZ.parts.options.length;
  const allCorrect = timeOk && waterOk && soapOk && partsOk;

  const detailLines = [
    `시간: ${quizState.time} ${timeOk ? "✅" : "❌ (정답: " + QUIZ.time.answer + ")"}`,
    `물: ${quizState.water} ${waterOk ? "✅" : "❌ (정답: " + QUIZ.water.answer + ")"}`,
    `세정제: ${quizState.soap} ${soapOk ? "✅" : "❌ (정답: " + QUIZ.soap.answer + ")"}`,
    `부위: ${quizState.parts.join(", ")} ${partsOk ? "✅" : "❌ (6개 모두 골라야 정답)"}`
  ];

  state.hw.handwashChecked = true;
  state.hw.quizBonus = allCorrect ? 2 : -2;
  state.hw.quizDetail = detailLines;
  state.hw.quizFeedback = allCorrect
    ? "완벽해요! 흐르는 물에 비누로 30초 이상, 6단계 모두 챙긴 올바른 손씻기였어요."
    : "손씻기는 흐르는 물에 비누로 30초 이상 씻어야 효과가 있어요. 특히 엄지손가락과 손톱 밑은 자주 빠뜨리지만 세균이 많이 남는 부위라서, 6단계 모두 빠짐없이 문질러야 완전한 손씻기가 돼요.";

  state.viewingQuiz = false;
  renderScene(true);
  showScreen("screen-scene");
}

/* commitSceneChoice에서 손씻기 점수·피드백에 퀴즈 결과를 합산하도록 choice 객체를 감싼다 */
const _origCommit = commitSceneChoice;
commitSceneChoice = function (scene, choice) {
  if (scene.type === "handwash") {
    const combined = {
      label: choice.label,
      points: choice.points + state.hw.quizBonus,
      feedback: state.hw.quizFeedback + " " + choice.feedback,
      quizDetail: state.hw.quizDetail
    };
    _origCommit(scene, combined);
  } else {
    _origCommit(scene, choice);
  }
};

/* =========================================================
   2부 도입
   ========================================================= */
function renderPart2Intro() {
  updateNavTitle("알고보니 독감을 확진 받은 짝꿍");
  typeText($("#intro-desc"), "짝꿍이 결국 독감 확진을 받고 학교에 나오지 못하고 있다. 짝꿍과 메시지를 주고받으며 회복을 돕는 조언자가 되어보자.");
}
$("#btn-part2-start").addEventListener("click", () => {
  enterStep("chat", { chatIndex: 0 }, () => { renderChat(); showScreen("screen-chat"); });
});

/* =========================================================
   2부 채팅
   ========================================================= */
function renderChat() {
  const chatScene = CHAT_SCENES[state.chatIndex];
  updateNavTitle(chatScene.name);
  updateProgress();
  const log = $("#chat-log");
  log.innerHTML = "";
  $("#chat-reply-area").innerHTML = "";

  let delay = 0;
  chatScene.theirMessages.forEach(msg => {
    delay += 300;
    setTimeout(() => {
      const b = el("div", "chat-bubble them", msg.text);
      log.appendChild(b);
      log.scrollTop = log.scrollHeight;
    }, delay);
  });

  if (chatScene.photo) {
    delay += 400;
    setTimeout(() => {
      const p = el("div", "chat-photo");
      p.innerHTML = `<img src="${chatScene.photo.src}" alt="사진"><span class="tap-hint">눌러서 확인</span>`;
      p.addEventListener("click", () => {
        openModal(`<div class="modal-title">${chatScene.photo.title}</div><img src="${chatScene.photo.src}"><p class="modal-desc">${chatScene.photo.desc}</p>`);
      });
      log.appendChild(p);
      log.scrollTop = log.scrollHeight;
    }, delay);
  }

  delay += 400;
  setTimeout(() => renderChatReplies(chatScene), delay);
}

function renderChatReplies(chatScene) {
  const area = $("#chat-reply-area");
  area.innerHTML = "";
  chatScene.replies.forEach(reply => {
    const btn = el("button", "reply-btn", reply.label);
    btn.addEventListener("click", () => {
      area.innerHTML = "";
      const log = $("#chat-log");
      const mine = el("div", "chat-bubble me", reply.label);
      log.appendChild(mine);
      log.scrollTop = log.scrollHeight;

      state.records.push({ name: chatScene.name, choiceLabel: reply.label, points: reply.points, feedback: reply.feedback, isHandwash: false });
      state.part2PointsSum += reply.points;

      setTimeout(() => {
        const nextIndex = state.chatIndex + 1;
        if (nextIndex < CHAT_SCENES.length) {
          enterStep("chat", { chatIndex: nextIndex }, () => { renderChat(); showScreen("screen-chat"); });
        } else {
          enterStep("results", {}, () => { renderResults(); showScreen("screen-results"); });
        }
      }, 900);
    });
    area.appendChild(btn);
  });
}

/* =========================================================
   결과 화면
   ========================================================= */
function studentTag(student) {
  return `${student.grade}학년 ${student.cls}반 ${student.number}번 ${student.name}`;
}

function computeMetrics(part1Sum, part2Sum) {
  const shieldScore = clamp(50 + part1Sum * 2, 0, 100);
  const spreadScore = clamp(20 - part1Sum * 2, 0, 100);
  let shieldTier = shieldScore >= 70 ? "튼튼함" : shieldScore >= 40 ? "보통" : "위태로움";
  let spreadTier = spreadScore <= 15 ? "안전" : spreadScore <= 35 ? "주의" : "위험";
  let badgeEmoji, badgeLabel;
  if (part2Sum >= 7) { badgeEmoji = "🏅"; badgeLabel = "훌륭한 친구"; }
  else if (part2Sum >= 2) { badgeEmoji = "🙂"; badgeLabel = "그럭저럭"; }
  else { badgeEmoji = "😐"; badgeLabel = "무심한 편"; }
  return { shieldScore, shieldTier, spreadScore, spreadTier, badgeEmoji, badgeLabel };
}

function estimateInfectedCount(spreadScore, classSize) {
  classSize = classSize || 30;
  return Math.round((spreadScore / 100) * classSize);
}

function buildMetricCardsHTML(m) {
  const infected = estimateInfectedCount(m.spreadScore);
  return `
    <div class="metric-card">
      <p class="metric-label">내 방어 게이지</p>
      <div class="gauge-track"><div class="gauge-fill" style="width:${m.shieldScore}%"></div></div>
      <p class="metric-value">${m.shieldScore}%</p>
      <p class="metric-tier">${m.shieldTier}</p>
    </div>
    <div class="metric-card">
      <p class="metric-label">학급 감염병 전파율</p>
      <div class="gauge-track"><div class="gauge-fill spread" style="width:${m.spreadScore}%"></div></div>
      <p class="metric-value">${m.spreadScore}%</p>
      <p class="metric-tier">${m.spreadTier} · 약 ${infected}명 전파</p>
    </div>
    <div class="metric-card">
      <p class="metric-label">짝꿍 도움 배지</p>
      <p class="badge-emoji">${m.badgeEmoji}</p>
      <p class="metric-tier">${m.badgeLabel}</p>
    </div>
  `;
}

function renderResults() {
  updateNavTitle("결과");
  $("#results-student-tag").textContent = studentTag(state.student);

  const m = computeMetrics(state.part1PointsSum, state.part2PointsSum);
  state.finalMetrics = m;
  $("#metric-grid").innerHTML = buildMetricCardsHTML(m);

  renderReviewList();

  $("#hint-panel").classList.add("hidden");
  $("#btn-toggle-hint").textContent = "힌트 보기";
  $("#input-summary").value = "";
  $("#input-feeling").value = "";
  $("#input-pledge").value = "";
  $("#submit-status").textContent = "";
  $("#postgame-actions").classList.add("hidden");
  $("#btn-submit").disabled = false;
}

function renderReviewList() {
  const list = $("#review-list");
  list.innerHTML = "";
  state.records.forEach((rec, idx) => {
    const card = el("div", "review-card");
    const isBad = rec.points < 0;
    let quizHtml = "";
    if (rec.isHandwash && rec.quizDetail) {
      quizHtml = `<div class="review-impact">${rec.quizDetail.join("<br>")}</div>`;
    }
    card.innerHTML = `
      <div class="review-scene-name">${rec.name}</div>
      <div class="review-choice">내 선택: ${rec.choiceLabel}</div>
      ${quizHtml}
      <div class="review-feedback ${isBad ? "bad" : ""}">${rec.feedback}</div>
      <div class="review-reflect"><strong>생각해볼 질문</strong>${REFLECT_QUESTIONS[idx] || ""}</div>
    `;
    list.appendChild(card);
  });
}

$("#btn-toggle-hint").addEventListener("click", () => {
  const panel = $("#hint-panel");
  const nowHidden = panel.classList.toggle("hidden");
  $("#btn-toggle-hint").textContent = nowHidden ? "힌트 보기" : "힌트 숨기기";
});

function downloadNodeAsImage(node, filename, bg) {
  html2canvas(node, { backgroundColor: bg || "#FFFFFF", scale: 2 }).then(canvas => {
    const link = document.createElement("a");
    link.download = filename;
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}

$("#btn-download-metrics").addEventListener("click", () => {
  const m = state.finalMetrics || computeMetrics(state.part1PointsSum, state.part2PointsSum);
  const render = $("#metrics-render");
  render.innerHTML = `
    <div class="metrics-sheet">
      <h4>오늘의 감염병 예방 기록</h4>
      <p class="m-tag">${studentTag(state.student)}</p>
      <div class="m-row"><p class="m-label">내 방어 게이지</p><p class="m-value">${m.shieldScore}% · ${m.shieldTier}</p><div class="m-bar-track"><div class="m-bar-fill" style="width:${m.shieldScore}%"></div></div></div>
      <div class="m-row"><p class="m-label">학급 감염병 전파율</p><p class="m-value">${m.spreadScore}% · ${m.spreadTier} · 약 ${estimateInfectedCount(m.spreadScore)}명 전파</p><div class="m-bar-track"><div class="m-bar-fill" style="width:${m.spreadScore}%;background:#D85B44"></div></div></div>
      <div class="m-row"><p class="m-label">짝꿍 도움 배지</p><p class="m-value">${m.badgeEmoji} ${m.badgeLabel}</p></div>
    </div>
  `;
  downloadNodeAsImage(render.firstElementChild, `${state.student.name}_감염병예방결과.png`, "#FFFFFF");
});

$("#btn-submit").addEventListener("click", async () => {
  const btn = $("#btn-submit");
  btn.disabled = true;
  $("#submit-status").textContent = "제출 중...";

  state.summaryFull = $("#input-summary").value.trim();
  state.feeling = $("#input-feeling").value.trim();
  state.pledge = $("#input-pledge").value.trim();

  const payload = buildSheetPayload();

  try {
    if (SHEET_WEBAPP_URL) {
      await fetch(SHEET_WEBAPP_URL, {
        method: "POST", mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(payload)
      });
    }
    $("#submit-status").textContent = "제출 완료! 아래에서 포스트잇 이미지를 저장할 수 있어요.";
  } catch (err) {
    $("#submit-status").textContent = "저장 중 문제가 발생했어요. 그래도 아래에서 이미지는 저장할 수 있어요.";
  }

  $("#postgame-actions").classList.remove("hidden");
});

function buildSheetPayload() {
  const sceneAnswers = {};
  state.records.forEach((rec, idx) => { sceneAnswers["scene" + (idx + 1)] = rec.choiceLabel; });
  const m = state.finalMetrics || computeMetrics(state.part1PointsSum, state.part2PointsSum);
  return {
    timestamp: new Date().toISOString(),
    grade: state.student.grade, cls: state.student.cls, number: state.student.number, name: state.student.name,
    ...sceneAnswers,
    shieldScore: m.shieldScore, spreadScore: m.spreadScore, buddyBadge: m.badgeLabel,
    summaryFull: state.summaryFull, feeling: state.feeling, pledge: state.pledge
  };
}

$("#btn-download-postit").addEventListener("click", () => {
  const render = $("#postit-render");
  const lines = (state.summaryFull || "").split("\n").filter(l => l.trim().length > 0);
  let html = `<div class="postit-sheet"><h4>나만의 감염병 예방 수칙</h4>`;
  html += `<div class="p-line"><span class="p-tag">${studentTag(state.student)}</span></div>`;
  lines.forEach(line => { html += `<div class="p-line">${line}</div>`; });
  html += `<div class="p-line"><span class="p-tag">오늘의 소감</span>${state.feeling || "(작성하지 않음)"}</div>`;
  html += `<div class="p-line"><span class="p-tag">앞으로의 다짐</span>${state.pledge || "(작성하지 않음)"}</div>`;
  html += `</div>`;
  render.innerHTML = html;
  downloadNodeAsImage(render.firstElementChild, `${state.student.name}_감염병예방수칙.png`, "#DCEEF5");
});

/* =========================================================
   조회 화면
   ========================================================= */
function jsonpRequest(url, params) {
  return new Promise((resolve, reject) => {
    const cbName = "cb_" + Math.random().toString(36).slice(2);
    const p = Object.assign({}, params, { callback: cbName });
    const qs = Object.keys(p).map(k => encodeURIComponent(k) + "=" + encodeURIComponent(p[k])).join("&");
    const script = document.createElement("script");
    window[cbName] = (data) => {
      resolve(data);
      delete window[cbName];
      script.remove();
    };
    script.onerror = () => { reject(new Error("요청 실패")); delete window[cbName]; script.remove(); };
    script.src = url + "?" + qs;
    document.body.appendChild(script);
  });
}

function getChoiceMeta(stepIndex, label) {
  const step = ALL_STEPS[stepIndex];
  if (!step) return null;
  if (step.type === "mask") {
    for (const hs of step.hotspots) {
      if (hs.title + " 선택" === label) return { feedback: hs.feedback };
    }
    if (step.noPickChoice && step.noPickChoice.label === label) return { feedback: step.noPickChoice.feedback };
    return null;
  }
  const list = step.choices || step.replies;
  if (!list) return null;
  const found = list.find(c => c.label === label);
  return found ? { feedback: found.feedback } : null;
}

$("#btn-lookup-self").addEventListener("click", async () => {
  const grade = $("#lk-grade").value, cls = $("#lk-class").value, number = $("#lk-number").value, name = $("#lk-name").value.trim();
  if (!grade || !cls || !number || !name) {
    $("#lookup-status").textContent = "학년, 반, 번호, 이름을 모두 입력해주세요.";
    return;
  }
  if (!SHEET_WEBAPP_URL) {
    $("#lookup-status").textContent = "아직 구글시트 연동 주소가 설정되지 않았어요.";
    return;
  }
  $("#lookup-status").textContent = "조회 중...";
  try {
    const res = await jsonpRequest(SHEET_WEBAPP_URL, { mode: "lookup", grade, cls, number, name });
    if (!res.ok || !res.rows || res.rows.length === 0) {
      $("#lookup-status").textContent = "제출된 기록을 찾을 수 없어요.";
      $("#lookup-result").classList.add("hidden");
      $("#btn-download-lookup").classList.add("hidden");
      return;
    }
    const row = res.rows[res.rows.length - 1];
    renderLookupResult(row);
    $("#lookup-status").textContent = "조회 완료!";
  } catch (e) {
    $("#lookup-status").textContent = "조회 중 문제가 발생했어요.";
  }
});

function renderLookupResult(row) {
  const container = $("#lookup-result");
  container.classList.remove("hidden");
  $("#btn-download-lookup").classList.remove("hidden");

  const sceneKeys = ["장면1_등교", "장면2_마스크고르기", "장면3_기침예절", "장면4_손씻기", "장면5_소독", "장면6_떡볶이", "장면7_처방약", "장면8_컨디션관리", "장면9_결석처리"];
  let reviewHtml = "";
  sceneKeys.forEach((key, idx) => {
    const label = row[key];
    if (!label) return;
    const meta = getChoiceMeta(idx, label) || { feedback: "" };
    reviewHtml += `<div class="review-card"><div class="review-scene-name">${ALL_STEPS[idx].name}</div><div class="review-choice">선택: ${label}</div><div class="review-feedback">${meta.feedback}</div></div>`;
  });

  container.innerHTML = `
    <p><strong>${row["학년"]}학년 ${row["반"]}반 ${row["번호"]}번 ${row["이름"]}</strong></p>
    <div class="metric-grid">${buildMetricCardsHTML({
      shieldScore: row["방어게이지(%)"], shieldTier: "", spreadScore: row["학급감염병전파율(%)"], spreadTier: "",
      badgeEmoji: "🏅", badgeLabel: row["짝꿍도움배지"]
    })}</div>
    <div class="review-list">${reviewHtml}</div>
  `;

  state._lookupRow = row;
  state._lookupReviewHtml = reviewHtml;
}

$("#btn-download-lookup").addEventListener("click", () => {
  const row = state._lookupRow;
  if (!row) return;
  const render = $("#lookup-render");
  render.innerHTML = `
    <div class="lookup-sheet">
      <h4>오늘 하루, 독감 사이에서 — 결과 발표자료</h4>
      <p class="l-tag">${row["학년"]}학년 ${row["반"]}반 ${row["번호"]}번 ${row["이름"]}</p>
      <div class="l-metric-row"><span>내 방어 게이지</span><span>${row["방어게이지(%)"]}%</span></div>
      <div class="l-metric-row"><span>학급 감염병 전파율</span><span>${row["학급감염병전파율(%)"]}% · 약 ${estimateInfectedCount(Number(row["학급감염병전파율(%)"]) || 0)}명/30명</span></div>
      <div class="l-metric-row"><span>짝꿍 도움 배지</span><span>${row["짝꿍도움배지"]}</span></div>
      <p class="l-section-title">나만의 감염병 예방 수칙</p>
      <p class="l-line">${row["예방수칙_전체"] || ""}</p>
      <p class="l-section-title">오늘의 소감</p>
      <p class="l-line">${row["오늘의소감"] || ""}</p>
      <p class="l-section-title">앞으로의 다짐</p>
      <p class="l-line">${row["앞으로의다짐"] || ""}</p>
    </div>
  `;
  downloadNodeAsImage(render.firstElementChild, `${row["이름"]}_결과발표자료.png`, "#FFFFFF");
});

$("#btn-browse").addEventListener("click", async () => {
  if (!SHEET_WEBAPP_URL) {
    $("#browse-list").innerHTML = `<p class="entry-error">아직 구글시트 연동 주소가 설정되지 않았어요.</p>`;
    return;
  }
  $("#browse-list").innerHTML = `<p class="submit-status">불러오는 중...</p>`;
  try {
    const res = await jsonpRequest(SHEET_WEBAPP_URL, { mode: "browse" });
    if (!res.ok || !res.rows) { $("#browse-list").innerHTML = ""; return; }
    $("#browse-list").innerHTML = res.rows.map(r => `
      <div class="browse-card">
        <span class="b-tag">${r["학년"] ? r["학년"] + "학년" : ""} · 방어 ${r["방어게이지(%)"] || "-"}% · 전파율 ${r["학급감염병전파율(%)"] || "-"}% (약 ${estimateInfectedCount(Number(r["학급감염병전파율(%)"]) || 0)}명/30명)</span>
        <p><strong>예방 수칙</strong><br>${(r["예방수칙_전체"] || "").replace(/\n/g, "<br>")}</p>
        <p><strong>소감</strong> ${r["오늘의소감"] || ""}</p>
        <p><strong>다짐</strong> ${r["앞으로의다짐"] || ""}</p>
      </div>
    `).join("");
  } catch (e) {
    $("#browse-list").innerHTML = `<p class="entry-error">불러오지 못했어요.</p>`;
  }
});
