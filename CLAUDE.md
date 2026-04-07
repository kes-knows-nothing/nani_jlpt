# JLPT N5 앱 — 프로젝트 컨텍스트

## 프로젝트 개요
JLPT N5 시험 대비 학습 앱. App Store / Play Store 정식 제출 목표.
GitHub: https://github.com/kes-knows-nothing/nani_jlpt

## 개발자 정보
- 이름: 이상혁
- 이메일: allinpositive@gmail.com
- GitHub: kes-knows-nothing
- 배경: 웹 개발 경험 있음, 앱 개발은 처음
- 개발 방식: Claude Code로 바이브코딩 (혼자 개발)

## 기술 스택
- React Native (Expo SDK 54) + TypeScript
- Expo Router v6 (파일 기반 라우팅)
- NativeWind v4 + Tailwind CSS v3 (스타일링)
- Supabase (MVP 이후 — 지금은 미사용)
- AsyncStorage (오답 로컬 저장)
- EAS Build (앱스토어 배포 — 추후)

## MVP 범위
- N5 문자·어휘 섹션만 (もんだい1~4)
- 로그인 없이 로컬 진행
- 오답 AsyncStorage에 저장
- 총 31개 오리지널 문제

## 문제 유형
- もんだい1: 밑줄 한자를 히라가나 4택
- もんだい2: 밑줄 히라가나를 한자/가타카나 4택
- もんだい3: 빈칸（　）에 알맞은 단어 4택
- もんだい4: 밑줄 문장과 같은 의미 4택

## 폴더 구조
```
app/
  _layout.tsx          # Root Stack 레이아웃, global.css 임포트
  (tabs)/
    _layout.tsx        # 탭바 (홈/문제풀기/오답노트)
    index.tsx          # 홈 화면
    practice.tsx       # 퀴즈 화면
    results.tsx        # 오답 노트
components/
  QuestionCard.tsx     # 문제 카드 (밑줄/빈칸 렌더링)
  OptionButton.tsx     # 선택지 버튼 (default/correct/wrong)
lib/
  questions.ts         # 문제 데이터 + 헬퍼 함수
  storage.ts           # AsyncStorage CRUD
  supabase.ts          # Supabase 클라이언트 (MVP 이후 활성화)
types/
  question.ts          # Question, WrongAnswer 타입
```

## 확장 계획 (MVP 이후)
- N4~N1 레벨 추가 → `level` 필드로 대응
- 문법·독해 파트 추가 → `section` 필드로 대응
- 유저 로그인 + 학습 이력 → Supabase auth
- 구독 수익화 Freemium → RevenueCat

## 현재 상태 (2026-04-07)
- 앱 초기 세팅 완료
- 퀴즈 화면 동작 확인
- GitHub push 완료
- Metro 번들러 이슈 해결 (babel-preset-expo, react-native-worklets 추가 설치)
- Supabase는 아직 미사용 상태

## 주의사항
- 문제는 JLPT 공식 예제 형식만 따름, 내용은 오리지널 (저작권)
- NativeWind v4 + Tailwind v3 조합 (Tailwind v4 아님)
- Windows 개발 환경 → Metro config에서 path.join 사용
- 스타일은 NativeWind 대신 인라인 style 객체 사용 중 (NativeWind 클래스 호환성 이슈)
