export type Level = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
export type Section = 'vocabulary' | 'grammar' | 'reading' | 'listening';
export type MondaiType = 'mondai1' | 'mondai2' | 'mondai3' | 'mondai4';

/**
 * sentence: 문장 전체
 * target:  もんだい1/2 → 밑줄 단어, もんだい3 → '' (빈칸은 sentence에 （　） 포함), もんだい4 → sentence와 동일
 * options: もんだい1~3 → 4택 단어/표현, もんだい4 → 4택 완성 문장
 */
export type Question = {
  id: string;
  level: Level;
  section: Section;
  mondai: MondaiType;
  sentence: string;
  target: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
};

export type WrongAnswer = {
  questionId: string;
  question: Question;
  selectedIndex: number;
  answeredAt: string;
};
