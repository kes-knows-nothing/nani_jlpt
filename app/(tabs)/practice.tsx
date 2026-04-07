import { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import QuestionCard from '../../components/QuestionCard';
import OptionButton, { OptionState } from '../../components/OptionButton';
import { questions, shuffleQuestions } from '../../lib/questions';
import { saveWrongAnswer } from '../../lib/storage';
import { Question, WrongAnswer } from '../../types/question';

type Phase = 'quiz' | 'answered' | 'finished';

type AnswerRecord = { questionId: string; correct: boolean };

export default function PracticeScreen() {
  const [deck, setDeck] = useState<Question[]>(() => shuffleQuestions(questions));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>('quiz');
  const [records, setRecords] = useState<AnswerRecord[]>([]);

  const current = deck[index];
  const isLast = index === deck.length - 1;

  // ── 정답 선택 ──────────────────────────────
  const handleSelect = useCallback(
    async (optionIndex: number) => {
      if (phase !== 'quiz') return;

      const isCorrect = optionIndex === current.correctIndex;
      setSelected(optionIndex);
      setPhase('answered');
      setRecords((prev) => [...prev, { questionId: current.id, correct: isCorrect }]);

      if (!isCorrect) {
        const wrongAnswer: WrongAnswer = {
          questionId: current.id,
          question: current,
          selectedIndex: optionIndex,
          answeredAt: new Date().toISOString(),
        };
        await saveWrongAnswer(wrongAnswer);
      }
    },
    [phase, current],
  );

  // ── 다음 문제 / 완료 ───────────────────────
  const handleNext = useCallback(() => {
    if (isLast) {
      setPhase('finished');
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
      setPhase('quiz');
    }
  }, [isLast]);

  // ── 다시 풀기 ──────────────────────────────
  const handleReset = useCallback(() => {
    setDeck(shuffleQuestions(questions));
    setIndex(0);
    setSelected(null);
    setPhase('quiz');
    setRecords([]);
  }, []);

  // ── 선택지 상태 계산 ───────────────────────
  const getOptionState = (i: number): OptionState => {
    if (phase === 'quiz') return 'default';
    if (i === current.correctIndex) return 'correct';
    if (i === selected) return 'wrong';
    return 'default';
  };

  // ────────────────────────────────────────────
  // 완료 화면
  // ────────────────────────────────────────────
  if (phase === 'finished') {
    const correctCount = records.filter((r) => r.correct).length;
    const total = records.length;
    const pct = Math.round((correctCount / total) * 100);

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Text style={{ fontSize: 56, marginBottom: 8 }}>
            {pct === 100 ? '🎉' : pct >= 70 ? '👍' : '📖'}
          </Text>
          <Text style={{ fontSize: 28, fontWeight: '800', color: '#1e293b', marginBottom: 4 }}>
            {pct}점
          </Text>
          <Text style={{ color: '#64748b', fontSize: 15, marginBottom: 32 }}>
            {total}문제 중 {correctCount}문제 정답
          </Text>

          {/* 결과 바 */}
          <View
            style={{
              width: '100%',
              backgroundColor: '#f1f5f9',
              borderRadius: 12,
              height: 12,
              marginBottom: 32,
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                width: `${pct}%`,
                height: '100%',
                backgroundColor: pct >= 70 ? '#4338ca' : '#f87171',
                borderRadius: 12,
              }}
            />
          </View>

          <TouchableOpacity
            onPress={handleReset}
            style={{
              backgroundColor: '#4338ca',
              borderRadius: 16,
              paddingVertical: 16,
              paddingHorizontal: 40,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Ionicons name="refresh" size={18} color="#fff" />
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>다시 풀기</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ────────────────────────────────────────────
  // 퀴즈 화면
  // ────────────────────────────────────────────
  const correctSoFar = records.filter((r) => r.correct).length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      {/* 상단 바 */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingVertical: 12,
        }}
      >
        <Text style={{ color: '#64748b', fontSize: 13 }}>
          정답{' '}
          <Text style={{ color: '#4338ca', fontWeight: '700' }}>{correctSoFar}</Text>
          <Text>/{records.length}</Text>
        </Text>
        <TouchableOpacity onPress={handleReset} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Ionicons name="refresh-outline" size={14} color="#94a3b8" />
          <Text style={{ color: '#94a3b8', fontSize: 13 }}>처음부터</Text>
        </TouchableOpacity>
      </View>

      {/* 진행 바 */}
      <View style={{ height: 3, backgroundColor: '#e2e8f0', marginHorizontal: 20, borderRadius: 2, marginBottom: 16 }}>
        <View
          style={{
            height: '100%',
            width: `${((index + 1) / deck.length) * 100}%`,
            backgroundColor: '#4338ca',
            borderRadius: 2,
          }}
        />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 문제 카드 */}
        <QuestionCard question={current} questionNumber={index + 1} total={deck.length} />

        {/* 선택지 */}
        <View style={{ marginTop: 20 }}>
          {current.options.map((option, i) => (
            <OptionButton
              key={i}
              label={option}
              index={i}
              state={getOptionState(i)}
              onPress={() => handleSelect(i)}
              disabled={phase === 'answered'}
            />
          ))}
        </View>

        {/* 해설 + 다음 버튼 */}
        {phase === 'answered' && (
          <>
            {current.explanation && (
              <View
                style={{
                  backgroundColor: '#fffbeb',
                  borderWidth: 1,
                  borderColor: '#fde68a',
                  borderRadius: 14,
                  padding: 14,
                  marginBottom: 12,
                }}
              >
                <Text style={{ color: '#78350f', fontSize: 13, lineHeight: 20 }}>
                  💡 {current.explanation}
                </Text>
              </View>
            )}

            <TouchableOpacity
              onPress={handleNext}
              activeOpacity={0.85}
              style={{
                backgroundColor: '#4338ca',
                borderRadius: 16,
                paddingVertical: 17,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '700' }}>
                {isLast ? '결과 보기' : '다음 문제'}
              </Text>
              <Ionicons name={isLast ? 'checkmark-circle' : 'arrow-forward'} size={18} color="#fff" />
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
