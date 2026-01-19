/**
 * exercises.ts
 * 운동 데이터 및 타입 정의
 * TODO: API 연동 시 DUMMY_EXERCISES 제거
 */

/**
 * 운동 부위 타입
 */
export type BodyPart = '전체' | '상체' | '하체' | '전신' | '코어';

/**
 * 난이도 타입
 */
export type Difficulty = '전체' | '초급' | '중급' | '고급';

/**
 * 운동 데이터 타입
 */
export interface Exercise {
  id: number;
  name: string;
  bodyPart: Exclude<BodyPart, '전체'>;
  difficulty: Exclude<Difficulty, '전체'>;
  thumbnail: string;
}

/**
 * 운동 상세 데이터 타입
 */
export interface ExerciseDetail {
  id: number;
  name: string;
  bodyPart: BodyPart;
  difficulty: Difficulty;
  thumbnail: string;
  description: string;
  instructions: string[];
  cautions: string[];
  youtubeThumb: string;
  youtubeUrl: string;
}

/**
 * 부위 필터 옵션
 */
export const BODY_PARTS: BodyPart[] = ['전체', '상체', '하체', '전신', '코어'];

/**
 * 난이도 필터 옵션
 */
export const DIFFICULTIES: Difficulty[] = ['전체', '초급', '중급', '고급'];

/**
 * 더미 운동 데이터
 * TODO: API 연동 시 삭제
 */
export const DUMMY_EXERCISES: Exercise[] = [
  { id: 1, name: '푸쉬업', bodyPart: '상체', difficulty: '초급', thumbnail: '💪' },
  { id: 2, name: '벤치프레스', bodyPart: '상체', difficulty: '중급', thumbnail: '🏋️' },
  { id: 3, name: '풀업', bodyPart: '상체', difficulty: '고급', thumbnail: '🔝' },
  { id: 4, name: '덤벨 숄더프레스', bodyPart: '상체', difficulty: '중급', thumbnail: '💪' },
  { id: 5, name: '스쿼트', bodyPart: '하체', difficulty: '초급', thumbnail: '🦵' },
  { id: 6, name: '런지', bodyPart: '하체', difficulty: '초급', thumbnail: '🚶' },
  { id: 7, name: '레그프레스', bodyPart: '하체', difficulty: '중급', thumbnail: '🦿' },
  { id: 8, name: '데드리프트', bodyPart: '하체', difficulty: '고급', thumbnail: '🏋️' },
  { id: 9, name: '버피', bodyPart: '전신', difficulty: '고급', thumbnail: '🔥' },
  { id: 10, name: '마운틴클라이머', bodyPart: '전신', difficulty: '중급', thumbnail: '⛰️' },
  { id: 11, name: '점핑잭', bodyPart: '전신', difficulty: '초급', thumbnail: '⭐' },
  { id: 12, name: '케틀벨 스윙', bodyPart: '전신', difficulty: '중급', thumbnail: '🔔' },
  { id: 13, name: '플랭크', bodyPart: '코어', difficulty: '초급', thumbnail: '🧘' },
  { id: 14, name: '크런치', bodyPart: '코어', difficulty: '초급', thumbnail: '💫' },
  { id: 15, name: '레그레이즈', bodyPart: '코어', difficulty: '중급', thumbnail: '🦵' },
  { id: 16, name: '러시안 트위스트', bodyPart: '코어', difficulty: '중급', thumbnail: '🔄' },
  { id: 17, name: '행잉 레그레이즈', bodyPart: '코어', difficulty: '고급', thumbnail: '🎯' },
  { id: 18, name: '바벨 로우', bodyPart: '상체', difficulty: '중급', thumbnail: '💪' },
  { id: 19, name: '힙 쓰러스트', bodyPart: '하체', difficulty: '중급', thumbnail: '🍑' },
  { id: 20, name: '박스점프', bodyPart: '전신', difficulty: '고급', thumbnail: '📦' },
];


/**
 * 더미 운동 상세 데이터
 * TODO: 실제 구현 시 API에서 가져오기
 */
export const DUMMY_EXERCISE_DETAILS: ExerciseDetail[] = [
  {
    id: 1,
    name: '푸쉬업',
    bodyPart: '상체',
    difficulty: '초급',
    thumbnail: '💪',
    description: '푸쉬업은 가슴, 어깨, 삼두근을 강화하는 대표적인 맨몸 운동입니다. 별도의 장비 없이 어디서든 할 수 있어 홈트레이닝에 적합합니다.',
    instructions: [
      '바닥에 엎드려 양손을 어깨 너비보다 약간 넓게 짚습니다.',
      '발끝을 세우고 몸을 일직선으로 유지합니다.',
      '팔꿈치를 굽혀 가슴이 바닥에 거의 닿을 때까지 내려갑니다.',
      '팔을 펴며 시작 자세로 돌아옵니다.',
      '호흡은 내려갈 때 들이쉬고, 올라올 때 내쉽니다.'
    ],
    cautions: [
      '허리가 아래로 꺾이지 않도록 코어에 힘을 유지하세요.',
      '목이 앞으로 빠지지 않도록 시선은 바닥을 향합니다.',
      '손목에 무리가 가면 푸쉬업 바를 사용하세요.',
      '어깨 부상이 있다면 무리하지 마세요.'
    ],
    youtubeThumb: 'https://img.youtube.com/vi/IODxDxX7oi4/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4'
  },
  {
    id: 2,
    name: '벤치프레스',
    bodyPart: '상체',
    difficulty: '중급',
    thumbnail: '🏋️',
    description: '벤치프레스는 가슴 근육을 발달시키는 가장 효과적인 웨이트 운동입니다. 바벨이나 덤벨을 사용하여 수행합니다.',
    instructions: [
      '벤치에 누워 발을 바닥에 단단히 고정합니다.',
      '바벨을 어깨 너비보다 약간 넓게 잡습니다.',
      '바벨을 들어 올려 가슴 위에 위치시킵니다.',
      '천천히 바벨을 가슴 중앙으로 내립니다.',
      '가슴에 닿기 직전 멈추고 다시 밀어 올립니다.'
    ],
    cautions: [
      '반드시 스팟터와 함께 운동하세요.',
      '손목이 꺾이지 않도록 주의하세요.',
      '등이 과도하게 아치형이 되지 않도록 합니다.',
      '무게보다 정확한 자세가 우선입니다.'
    ],
    youtubeThumb: 'https://img.youtube.com/vi/rT7DgCr-3pg/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg'
  },
  {
    id: 3,
    name: '풀업',
    bodyPart: '상체',
    difficulty: '고급',
    thumbnail: '🔝',
    description: '풀업은 등 근육과 이두근을 강화하는 고난도 맨몸 운동입니다. 상체 전체 근력을 키우는 데 효과적입니다.',
    instructions: [
      '철봉을 어깨 너비보다 넓게 잡습니다.',
      '팔을 완전히 펴고 매달립니다.',
      '등 근육을 사용해 턱이 철봉 위로 올라오도록 당깁니다.',
      '천천히 시작 자세로 돌아옵니다.',
      '반동을 사용하지 않고 근육의 힘으로만 수행합니다.'
    ],
    cautions: [
      '어깨에 무리가 가지 않도록 천천히 수행하세요.',
      '반동을 사용하면 부상 위험이 있습니다.',
      '초보자는 어시스트 밴드를 사용하세요.',
      '손목과 팔꿈치 관절을 보호하세요.'
    ],
    youtubeThumb: 'https://img.youtube.com/vi/eGo4IYlbE5g/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g'
  },
  {
    id: 4,
    name: '덤벨 숄더프레스',
    bodyPart: '상체',
    difficulty: '중급',
    thumbnail: '💪',
    description: '덤벨 숄더프레스는 어깨 삼각근을 집중적으로 발달시키는 운동입니다. 양손에 덤벨을 들고 수행합니다.',
    instructions: [
      '벤치에 앉아 등을 기대고 덤벨을 양손에 듭니다.',
      '덤벨을 어깨 높이에서 손바닥이 앞을 향하게 잡습니다.',
      '팔을 펴며 덤벨을 머리 위로 밀어 올립니다.',
      '팔꿈치가 완전히 펴지기 직전에 멈춥니다.',
      '천천히 시작 자세로 돌아옵니다.'
    ],
    cautions: [
      '목에 힘이 들어가지 않도록 주의하세요.',
      '허리가 과도하게 젖혀지지 않도록 합니다.',
      '어깨 부상이 있다면 가벼운 무게로 시작하세요.',
      '팔꿈치가 너무 뒤로 가지 않도록 합니다.'
    ],
    youtubeThumb: 'https://img.youtube.com/vi/qEwKCR5JCog/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=qEwKCR5JCog'
  },
  {
    id: 5,
    name: '스쿼트',
    bodyPart: '하체',
    difficulty: '초급',
    thumbnail: '🦵',
    description: '스쿼트는 하체 전체를 강화하는 기본 운동입니다. 대퇴사두근, 햄스트링, 둔근을 동시에 발달시킵니다.',
    instructions: [
      '발을 어깨 너비로 벌리고 발끝은 약간 바깥을 향합니다.',
      '가슴을 펴고 시선은 정면을 봅니다.',
      '엉덩이를 뒤로 빼며 무릎을 굽혀 앉습니다.',
      '허벅지가 바닥과 평행이 될 때까지 내려갑니다.',
      '발뒤꿈치로 바닥을 밀며 일어납니다.'
    ],
    cautions: [
      '무릎이 발끝보다 앞으로 나가지 않도록 합니다.',
      '허리가 둥글게 말리지 않도록 주의하세요.',
      '무릎이 안쪽으로 모이지 않도록 합니다.',
      '무릎 통증이 있으면 깊이를 조절하세요.'
    ],
    youtubeThumb: 'https://img.youtube.com/vi/aclHkVaku9U/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=aclHkVaku9U'
  },
  {
    id: 6,
    name: '런지',
    bodyPart: '하체',
    difficulty: '초급',
    thumbnail: '🚶',
    description: '런지는 하체 근력과 균형 감각을 키우는 운동입니다. 한 발씩 번갈아 수행하여 좌우 균형을 맞출 수 있습니다.',
    instructions: [
      '똑바로 서서 한 발을 앞으로 크게 내딛습니다.',
      '앞 무릎을 90도로 굽히며 뒷무릎은 바닥에 거의 닿게 합니다.',
      '앞발의 뒤꿈치로 바닥을 밀며 일어납니다.',
      '시작 자세로 돌아온 후 반대쪽도 수행합니다.',
      '상체는 항상 곧게 유지합니다.'
    ],
    cautions: [
      '앞 무릎이 발끝을 넘지 않도록 합니다.',
      '상체가 앞으로 기울지 않도록 주의하세요.',
      '뒷무릎이 바닥에 세게 부딪히지 않도록 합니다.',
      '균형이 어려우면 벽을 잡고 수행하세요.'
    ],
    youtubeThumb: 'https://img.youtube.com/vi/QOVaHwm-Q6U/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=QOVaHwm-Q6U'
  },
  {
    id: 7,
    name: '레그프레스',
    bodyPart: '하체',
    difficulty: '중급',
    thumbnail: '🦿',
    description: '레그프레스는 기구를 사용하여 하체를 안전하게 강화하는 운동입니다. 스쿼트보다 허리 부담이 적습니다.',
    instructions: [
      '레그프레스 기구에 앉아 등을 패드에 밀착시킵니다.',
      '발을 플랫폼에 어깨 너비로 올립니다.',
      '안전 장치를 풀고 무릎을 굽혀 플랫폼을 내립니다.',
      '무릎이 90도가 될 때까지 내린 후 밀어 올립니다.',
      '무릎을 완전히 펴지 않고 약간 굽힌 상태를 유지합니다.'
    ],
    cautions: [
      '엉덩이가 패드에서 떨어지지 않도록 합니다.',
      '무릎을 완전히 펴면 관절에 무리가 갑니다.',
      '너무 무거운 무게는 허리 부상을 유발합니다.',
      '호흡을 참지 말고 자연스럽게 합니다.'
    ],
    youtubeThumb: 'https://img.youtube.com/vi/IZxyjW7MPJQ/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ'
  },
  {
    id: 8,
    name: '데드리프트',
    bodyPart: '하체',
    difficulty: '고급',
    thumbnail: '🏋️',
    description: '데드리프트는 전신 근력을 키우는 대표적인 복합 운동입니다. 특히 후면 사슬(등, 둔근, 햄스트링)을 강화합니다.',
    instructions: [
      '바벨 앞에 발을 어깨 너비로 벌리고 섭니다.',
      '엉덩이를 뒤로 빼며 바벨을 잡습니다.',
      '가슴을 펴고 등을 곧게 유지합니다.',
      '다리와 엉덩이 힘으로 바벨을 들어 올립니다.',
      '완전히 선 후 천천히 바벨을 내립니다.'
    ],
    cautions: [
      '등이 둥글게 말리면 심각한 부상을 유발합니다.',
      '바벨은 항상 몸에 가깝게 유지합니다.',
      '목을 과도하게 젖히지 마세요.',
      '초보자는 반드시 전문가에게 자세를 배우세요.'
    ],
    youtubeThumb: 'https://img.youtube.com/vi/op9kVnSso6Q/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=op9kVnSso6Q'
  },
  {
    id: 9,
    name: '버피',
    bodyPart: '전신',
    difficulty: '고급',
    thumbnail: '🔥',
    description: '버피는 전신을 사용하는 고강도 유산소 운동입니다. 근력, 지구력, 심폐 기능을 동시에 향상시킵니다.',
    instructions: [
      '똑바로 선 자세에서 시작합니다.',
      '스쿼트 자세로 앉으며 양손을 바닥에 짚습니다.',
      '발을 뒤로 점프하여 플랭크 자세를 만듭니다.',
      '푸쉬업을 1회 수행합니다.',
      '발을 앞으로 당기고 점프하며 양팔을 위로 뻗습니다.'
    ],
    cautions: [
      '무릎과 허리에 무리가 가지 않도록 주의하세요.',
      '착지 시 충격을 흡수하도록 무릎을 굽힙니다.',
      '심장 질환이 있으면 의사와 상담 후 수행하세요.',
      '처음에는 천천히 동작을 익히세요.'
    ],
    youtubeThumb: 'https://img.youtube.com/vi/TU8QYVW0gDU/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=TU8QYVW0gDU'
  },
  {
    id: 10,
    name: '마운틴클라이머',
    bodyPart: '전신',
    difficulty: '중급',
    thumbnail: '⛰️',
    description: '마운틴클라이머는 코어와 심폐 기능을 동시에 강화하는 전신 운동입니다. 플랭크 자세에서 달리기 동작을 수행합니다.',
    instructions: [
      '플랭크 자세로 시작합니다.',
      '한쪽 무릎을 가슴 쪽으로 당깁니다.',
      '빠르게 다리를 바꿔가며 달리듯이 수행합니다.',
      '상체는 흔들리지 않도록 고정합니다.',
      '호흡을 일정하게 유지합니다.'
    ],
    cautions: [
      '허리가 아래로 꺾이지 않도록 합니다.',
      '엉덩이가 위로 올라가지 않도록 합니다.',
      '손목에 무리가 가면 쉬어가며 수행합니다.',
      '속도보다 자세가 우선입니다.'
    ],
    youtubeThumb: 'https://img.youtube.com/vi/nmwgirgXLYM/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=nmwgirgXLYM'
  },
  {
    id: 11,
    name: '점핑잭',
    bodyPart: '전신',
    difficulty: '초급',
    thumbnail: '⭐',
    description: '점핑잭은 전신 유산소 운동으로 심폐 기능을 향상시킵니다. 워밍업이나 유산소 루틴에 적합합니다.',
    instructions: [
      '발을 모으고 팔은 옆에 붙인 채 서서 시작합니다.',
      '점프하며 다리를 어깨 너비보다 넓게 벌립니다.',
      '동시에 양팔을 머리 위로 올려 손뼉을 칩니다.',
      '다시 점프하며 시작 자세로 돌아옵니다.',
      '일정한 리듬으로 반복합니다.'
    ],
    cautions: [
      '착지 시 무릎을 살짝 굽혀 충격을 흡수합니다.',
      '발목이나 무릎에 통증이 있으면 중단하세요.',
      '미끄러운 바닥에서는 주의합니다.',
      '심장 질환이 있으면 강도를 조절하세요.'
    ],
    youtubeThumb: 'https://img.youtube.com/vi/c4DAnQ6DtF8/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=c4DAnQ6DtF8'
  },
  {
    id: 12,
    name: '케틀벨 스윙',
    bodyPart: '전신',
    difficulty: '중급',
    thumbnail: '🔔',
    description: '케틀벨 스윙은 후면 사슬과 심폐 기능을 동시에 강화하는 전신 운동입니다. 폭발적인 힘을 기릅니다.',
    instructions: [
      '발을 어깨 너비보다 넓게 벌리고 케틀벨을 양손으로 잡습니다.',
      '엉덩이를 뒤로 빼며 케틀벨을 다리 사이로 보냅니다.',
      '둔근에 힘을 주며 골반을 앞으로 밀어 케틀벨을 들어 올립니다.',
      '팔이 아닌 엉덩이의 힘으로 스윙합니다.',
      '케틀벨이 가슴 높이까지 올라가면 다시 내립니다.'
    ],
    cautions: [
      '등이 둥글게 말리지 않도록 합니다.',
      '팔로 당기지 말고 엉덩이 힘으로 스윙합니다.',
      '무게는 가벼운 것부터 시작합니다.',
      '손에서 케틀벨이 빠지지 않도록 그립을 확인하세요.'
    ],
    youtubeThumb: 'https://img.youtube.com/vi/YSxHifyI6s8/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=YSxHifyI6s8'
  },
  {
    id: 13,
    name: '플랭크',
    bodyPart: '코어',
    difficulty: '초급',
    thumbnail: '🧘',
    description: '플랭크는 코어 전체를 강화하는 기본 운동입니다. 자세 유지만으로 복부, 등, 엉덩이 근육을 발달시킵니다.',
    instructions: [
      '팔꿈치를 어깨 아래에 두고 엎드립니다.',
      '발끝을 세우고 몸을 일직선으로 들어 올립니다.',
      '복부에 힘을 주고 엉덩이가 처지지 않게 합니다.',
      '시선은 바닥을 향하고 목은 중립을 유지합니다.',
      '설정한 시간 동안 자세를 유지합니다.'
    ],
    cautions: [
      '허리가 아래로 꺾이면 허리에 무리가 갑니다.',
      '엉덩이가 너무 올라가면 효과가 떨어집니다.',
      '호흡을 참지 말고 자연스럽게 합니다.',
      '무리하지 말고 시간을 점진적으로 늘리세요.'
    ],
    youtubeThumb: 'https://img.youtube.com/vi/pSHjTRCQxIw/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=pSHjTRCQxIw'
  },
  {
    id: 14,
    name: '크런치',
    bodyPart: '코어',
    difficulty: '초급',
    thumbnail: '💫',
    description: '크런치는 복직근(식스팩)을 집중적으로 강화하는 운동입니다. 윗몸일으키기보다 허리에 부담이 적습니다.',
    instructions: [
      '바닥에 누워 무릎을 90도로 굽히고 발을 바닥에 둡니다.',
      '양손은 귀 옆에 가볍게 대거나 가슴 앞에서 교차합니다.',
      '복부에 힘을 주며 어깨를 바닥에서 들어 올립니다.',
      '허리는 바닥에 붙인 채 유지합니다.',
      '천천히 시작 자세로 돌아옵니다.'
    ],
    cautions: [
      '목을 손으로 잡아당기지 않습니다.',
      '반동을 사용하지 않습니다.',
      '허리를 바닥에서 들지 않습니다.',
      '목이나 허리에 통증이 있으면 중단하세요.'
    ],
    youtubeThumb: 'https://img.youtube.com/vi/Xyd_fa5zoEU/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=Xyd_fa5zoEU'
  },
  {
    id: 15,
    name: '레그레이즈',
    bodyPart: '코어',
    difficulty: '중급',
    thumbnail: '🦵',
    description: '레그레이즈는 하복부를 집중적으로 강화하는 운동입니다. 다리를 들어 올려 하복부에 자극을 줍니다.',
    instructions: [
      '바닥에 누워 다리를 곧게 펴고 양팔은 옆에 둡니다.',
      '허리를 바닥에 밀착시킵니다.',
      '복부에 힘을 주며 다리를 천천히 들어 올립니다.',
      '다리가 바닥과 수직이 될 때까지 올립니다.',
      '천천히 다리를 내리되 바닥에 닿기 직전에 멈춥니다.'
    ],
    cautions: [
      '허리가 바닥에서 떨어지면 허리 부상 위험이 있습니다.',
      '다리를 내릴 때 반동을 사용하지 않습니다.',
      '허리 통증이 있으면 무릎을 굽혀서 수행하세요.',
      '목에 힘이 들어가지 않도록 합니다.'
    ],
    youtubeThumb: 'https://img.youtube.com/vi/JB2oyawG9KI/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=JB2oyawG9KI'
  },
  {
    id: 16,
    name: '러시안 트위스트',
    bodyPart: '코어',
    difficulty: '중급',
    thumbnail: '🔄',
    description: '러시안 트위스트는 옆구리(복사근)를 강화하는 운동입니다. 회전 동작으로 코어 전체를 자극합니다.',
    instructions: [
      '바닥에 앉아 무릎을 굽히고 발을 약간 들어 올립니다.',
      '상체를 45도 정도 뒤로 기울입니다.',
      '양손을 모으거나 웨이트를 잡습니다.',
      '상체를 좌우로 회전하며 손을 옆으로 가져갑니다.',
      '복부에 힘을 유지하며 일정한 리듬으로 반복합니다.'
    ],
    cautions: [
      '허리가 둥글게 말리지 않도록 합니다.',
      '너무 빠르게 수행하면 효과가 떨어집니다.',
      '어지러우면 발을 바닥에 붙이고 수행합니다.',
      '디스크가 있는 경우 주의가 필요합니다.'
    ],
    youtubeThumb: 'https://img.youtube.com/vi/wkD8rjkodUI/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=wkD8rjkodUI'
  },
  {
    id: 17,
    name: '행잉 레그레이즈',
    bodyPart: '코어',
    difficulty: '고급',
    thumbnail: '🎯',
    description: '행잉 레그레이즈는 철봉에 매달려 수행하는 고급 코어 운동입니다. 하복부와 악력을 동시에 강화합니다.',
    instructions: [
      '철봉에 어깨 너비로 매달립니다.',
      '몸의 흔들림을 최소화합니다.',
      '복부에 힘을 주며 다리를 들어 올립니다.',
      '다리가 바닥과 평행이 되거나 그 이상 올립니다.',
      '천천히 다리를 내립니다.'
    ],
    cautions: [
      '반동을 사용하면 효과가 떨어지고 부상 위험이 있습니다.',
      '그립이 약하면 스트랩을 사용하세요.',
      '어깨에 무리가 가지 않도록 주의합니다.',
      '처음에는 무릎을 굽혀서 수행하세요.'
    ],
    youtubeThumb: 'https://img.youtube.com/vi/hdng3Nm1x_E/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=hdng3Nm1x_E'
  },
  {
    id: 18,
    name: '바벨 로우',
    bodyPart: '상체',
    difficulty: '중급',
    thumbnail: '💪',
    description: '바벨 로우는 등 근육 전체를 발달시키는 복합 운동입니다. 특히 광배근과 승모근을 강화합니다.',
    instructions: [
      '바벨을 어깨 너비로 잡고 무릎을 살짝 굽힙니다.',
      '상체를 앞으로 숙여 45도 정도 기울입니다.',
      '등을 곧게 유지하며 바벨을 배꼽 쪽으로 당깁니다.',
      '견갑골을 모으며 최대한 수축합니다.',
      '천천히 바벨을 내립니다.'
    ],
    cautions: [
      '등이 둥글게 말리지 않도록 합니다.',
      '팔이 아닌 등 근육으로 당깁니다.',
      '무게보다 정확한 자세가 우선입니다.',
      '허리에 문제가 있으면 주의하세요.'
    ],
    youtubeThumb: 'https://img.youtube.com/vi/FWJR5Ve8bnQ/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=FWJR5Ve8bnQ'
  },
  {
    id: 19,
    name: '힙 쓰러스트',
    bodyPart: '하체',
    difficulty: '중급',
    thumbnail: '🍑',
    description: '힙 쓰러스트는 둔근(엉덩이)을 집중적으로 발달시키는 운동입니다. 힙업 효과가 뛰어납니다.',
    instructions: [
      '벤치에 등 상부를 기대고 앉습니다.',
      '바벨을 골반 위에 올리고 발을 어깨 너비로 벌립니다.',
      '둔근에 힘을 주며 골반을 위로 밀어 올립니다.',
      '상체와 허벅지가 일직선이 되면 정점에서 2초 유지합니다.',
      '천천히 골반을 내립니다.'
    ],
    cautions: [
      '허리가 과도하게 젖혀지지 않도록 합니다.',
      '무릎이 안쪽으로 모이지 않도록 합니다.',
      '바벨이 굴러가지 않도록 패드를 사용하세요.',
      '목에 힘이 들어가지 않도록 합니다.'
    ],
    youtubeThumb: 'https://img.youtube.com/vi/SEdqd1n0cvg/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=SEdqd1n0cvg'
  },
  {
    id: 20,
    name: '박스점프',
    bodyPart: '전신',
    difficulty: '고급',
    thumbnail: '📦',
    description: '박스점프는 하체 폭발력과 순발력을 키우는 플라이오메트릭 운동입니다. 전신 협응력을 발달시킵니다.',
    instructions: [
      '박스 앞에 어깨 너비로 서서 준비합니다.',
      '무릎을 굽히고 팔을 뒤로 빼며 준비 동작을 취합니다.',
      '팔을 앞으로 휘두르며 폭발적으로 점프합니다.',
      '박스 위에 부드럽게 착지하며 무릎을 굽힙니다.',
      '일어선 후 내려와서 반복합니다.'
    ],
    cautions: [
      '착지 시 무릎이 안쪽으로 꺾이지 않도록 합니다.',
      '박스 높이는 안전하게 착지할 수 있는 높이로 선택합니다.',
      '피로한 상태에서는 부상 위험이 높아집니다.',
      '박스가 미끄럽지 않은지 확인하세요.'
    ],
    youtubeThumb: 'https://img.youtube.com/vi/NBY9-kTuHEk/maxresdefault.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=NBY9-kTuHEk'
  }
];