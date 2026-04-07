# JLPT N5 앱 — 개발 컨텍스트 (항상 먼저 읽을 것)

## 개발자
- 이름: 이상혁 / GitHub: kes-knows-nothing / 이메일: allinpositive@gmail.com
- 웹 개발 경험 있음 (React 알고 있음), **앱 개발은 처음**
- 혼자 Claude Code로 바이브코딩
- 모르는 앱 개념은 웹 개념과 비교해서 설명해줄 것

## 프로젝트
- GitHub: https://github.com/kes-knows-nothing/nani_jlpt
- 로컬: `C:/Users/Kes/Desktop/jlpt-n5`
- 목표: JLPT N5 시험 대비 앱, App Store / Play Store 정식 제출

---

## 기술 스택 & 선택 이유

| 기술 | 이유 |
|------|------|
| Expo SDK 54 + TypeScript | 앱 초보자도 빠르게 시작 가능, iOS/Android 동시 대응 |
| Expo Router v6 | Next.js랑 비슷한 파일 기반 라우팅 — 웹 경험자에게 친숙 |
| NativeWind v4 + Tailwind v3 | Tailwind CSS 문법 그대로 사용 — 웹 경험 활용 |
| AsyncStorage | 로그인 없는 MVP에서 오답 로컬 저장 |
| Supabase | 지금은 미사용. MVP 이후 로그인/학습이력 추가 시 활성화 |
| EAS Build | 추후 앱스토어 배포 시 사용 |

### 중요: NativeWind 관련 설정
- **Tailwind v4 아님, v3 사용** — NativeWind v4가 Tailwind v4 미지원
- NativeWind className이 일부 환경에서 불안정 → 현재 **인라인 style 객체** 위주로 작성
- `metro.config.js`에서 `path.join`으로 nativewind 경로 직접 지정 (Windows 경로 이슈)
- `babel.config.js`: `jsxImportSource: 'nativewind'` + `nativewind/babel` 프리셋

### 중요: Windows 개발 환경 이슈
- Metro 번들러가 `C:\` 경로를 ESM 로더가 못 읽는 버그 존재
- 해결: `metro.config.js`에서 `require(path.join(__dirname, 'node_modules', ...))`로 절대경로 직접 지정
- `babel-preset-expo`, `react-native-worklets` 별도 설치 필요했음 (자동 설치 안 됨)

---

## 폴더 구조 & 각 파일 역할

```
app/
  _layout.tsx          # Root Stack. global.css 여기서 import (NativeWind 필수)
  (tabs)/
    _layout.tsx        # 하단 탭바. 홈/문제풀기/오답노트 3탭
    index.tsx          # 홈 화면 — 문제 구성 카드 + 시작 버튼
    practice.tsx       # 퀴즈 화면 — 핵심 기능
    results.tsx        # 오답 노트 — AsyncStorage에서 읽어서 표시

components/
  QuestionCard.tsx     # 문제 유형별 다른 렌더링
                       #   もんだい1/2: target 단어 밑줄 표시
                       #   もんだい3: （　） 빈칸 박스 표시
                       #   もんだい4: 전체 문장 underline
  OptionButton.tsx     # 선택지 버튼. state: 'default'|'correct'|'wrong'

lib/
  questions.ts         # 문제 데이터 배열 + 헬퍼 함수
                       # getQuestionsByMondai(), getQuestionsByLevel(), shuffleQuestions()
                       # MONDAI_LABELS, MONDAI_SUBTITLES, MONDAI_INSTRUCTIONS 상수
  storage.ts           # AsyncStorage 래퍼
                       # getWrongAnswers(), saveWrongAnswer(), removeWrongAnswer(), clearWrongAnswers()
  supabase.ts          # Supabase 클라이언트 (현재 미사용, .env.local에 키 없음)

types/
  question.ts          # Question, WrongAnswer 타입
                       # Level: 'N5'|'N4'|'N3'|'N2'|'N1'  ← 확장성 위해 미리 정의
                       # Section: 'vocabulary'|'grammar'|'reading'|'listening'
                       # MondaiType: 'mondai1'|'mondai2'|'mondai3'|'mondai4'
```

---

## 문제 데이터 구조

```typescript
type Question = {
  id: string;           // 예: 'm1_001'
  level: Level;         // 'N5' (나중에 N4~N1 추가)
  section: Section;     // 'vocabulary' (나중에 grammar 등 추가)
  mondai: MondaiType;   // 'mondai1'~'mondai4'
  sentence: string;     // 전체 문장
  target: string;       // もんだい1/2: 밑줄 단어, もんだい3: '', もんだい4: sentence와 동일
  options: string[];    // 4지선다 보기
  correctIndex: number; // 정답 인덱스 (0부터)
  explanation?: string; // 한국어 해설
}
```

**현재 문제 수**: N5 문자·어휘 31개 (もんだい1: 8, もんだい2: 8, もんだい3: 8, もんだい4: 7)
**문제 출처**: JLPT 공식 예제 형식 참고, 내용은 오리지널 창작 (저작권 이슈 없음)

---

## 퀴즈 화면 (practice.tsx) 동작 흐름

1. `shuffleQuestions(questions)`로 랜덤 순서 시작
2. 선택지 누르면 즉시 정오답 색상 피드백 (correct=초록, wrong=빨강)
3. 오답 시 AsyncStorage에 자동 저장 (`saveWrongAnswer`)
4. 해설 표시 + "다음 문제" 버튼
5. 마지막 문제 후 점수 화면 (퍼센트 + 진행바)
6. "다시 풀기" 누르면 새로 셔플해서 처음부터

**Phase 상태**: `'quiz'` → `'answered'` → (다음) → `'finished'`

---

## MVP 범위 (지금 집중)
- [x] N5 문자·어휘 もんだい1~4
- [x] 로그인 없이 로컬 진행
- [x] 오답 AsyncStorage 저장
- [ ] UI 퀄리티 다듬기
- [ ] 문제 수 늘리기
- [ ] EAS Build + 앱스토어 제출

## MVP 이후 확장 (나중에)
- N4~N1 레벨 추가
- 문법·독해 파트
- 유저 로그인 (Supabase auth)
- 학습 이력 + 통계
- Freemium 구독 (RevenueCat)

---

## 개발 로그

### 2026-04-07 (세션 1)
- Expo 프로젝트 생성 (`blank-typescript` 템플릿)
- Expo Router, NativeWind v4, Supabase, AsyncStorage 설치
- 폴더 구조 세팅 (app/components/lib/types)
- N5 오리지널 문제 31개 작성
- 홈/퀴즈/오답노트 화면 구현
- Metro 번들러 Windows 이슈 해결
  - `babel-preset-expo` 수동 설치
  - `react-native-worklets` 수동 설치
  - `metro.config.js` path.join 방식으로 수정
- GitHub 초기 푸시 완료

---

## 다음 대화 시작할 때 Claude에게
이 CLAUDE.md를 읽고 현재 상태를 파악한 뒤, 개발 로그에 새 세션 내용을 추가하면서 진행할 것.
작업이 끝날 때마다 CLAUDE.md의 개발 로그와 현재 상태를 업데이트하고 GitHub에 push할 것.
