import AsyncStorage from '@react-native-async-storage/async-storage';
import { WrongAnswer } from '../types/question';

const KEYS = {
  WRONG_ANSWERS: '@jlpt_wrong_answers',
} as const;

export async function getWrongAnswers(): Promise<WrongAnswer[]> {
  try {
    const json = await AsyncStorage.getItem(KEYS.WRONG_ANSWERS);
    return json ? (JSON.parse(json) as WrongAnswer[]) : [];
  } catch {
    return [];
  }
}

export async function saveWrongAnswer(answer: WrongAnswer): Promise<void> {
  const existing = await getWrongAnswers();
  // 같은 문제는 최신 오답으로 덮어쓰기
  const filtered = existing.filter((a) => a.questionId !== answer.questionId);
  await AsyncStorage.setItem(KEYS.WRONG_ANSWERS, JSON.stringify([...filtered, answer]));
}

export async function removeWrongAnswer(questionId: string): Promise<void> {
  const existing = await getWrongAnswers();
  await AsyncStorage.setItem(
    KEYS.WRONG_ANSWERS,
    JSON.stringify(existing.filter((a) => a.questionId !== questionId)),
  );
}

export async function clearWrongAnswers(): Promise<void> {
  await AsyncStorage.removeItem(KEYS.WRONG_ANSWERS);
}
