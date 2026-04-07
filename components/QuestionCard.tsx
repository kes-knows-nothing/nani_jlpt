import { View, Text } from 'react-native';
import { Question } from '../types/question';
import { MONDAI_INSTRUCTIONS, MONDAI_LABELS, MONDAI_SUBTITLES } from '../lib/questions';

type Props = {
  question: Question;
  questionNumber: number;
  total: number;
};

/** もんだい1/2: 밑줄 단어 강조 렌더링 */
function UnderlinedSentence({ sentence, target }: { sentence: string; target: string }) {
  if (!target || !sentence.includes(target)) {
    return (
      <Text style={{ fontSize: 20, lineHeight: 34, textAlign: 'center', color: '#1e293b' }}>
        {sentence}
      </Text>
    );
  }

  const idx = sentence.indexOf(target);
  const before = sentence.slice(0, idx);
  const after = sentence.slice(idx + target.length);

  return (
    <Text style={{ fontSize: 20, lineHeight: 34, textAlign: 'center', color: '#1e293b' }}>
      {before}
      <Text
        style={{
          textDecorationLine: 'underline',
          textDecorationColor: '#4338ca',
          fontWeight: '700',
          color: '#4338ca',
        }}
      >
        {target}
      </Text>
      {after}
    </Text>
  );
}

/** もんだい3: 빈칸（　）을 박스로 강조 렌더링 */
function BlankSentence({ sentence }: { sentence: string }) {
  const BLANK = '（　）';
  if (!sentence.includes(BLANK)) {
    return (
      <Text style={{ fontSize: 20, lineHeight: 34, textAlign: 'center', color: '#1e293b' }}>
        {sentence}
      </Text>
    );
  }

  const [before, after] = sentence.split(BLANK);
  return (
    <Text style={{ fontSize: 20, lineHeight: 34, textAlign: 'center', color: '#1e293b' }}>
      {before}
      <Text
        style={{
          backgroundColor: '#e0e7ff',
          color: '#4338ca',
          fontWeight: '700',
          borderRadius: 4,
          paddingHorizontal: 4,
        }}
      >
        {'　　'}
      </Text>
      {after}
    </Text>
  );
}

export default function QuestionCard({ question, questionNumber, total }: Props) {
  const isMondai4 = question.mondai === 'mondai4';

  return (
    <View
      style={{
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f1f5f9',
      }}
    >
      {/* 상단: 뱃지 + 진행 */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ backgroundColor: '#e0e7ff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
            <Text style={{ color: '#4338ca', fontSize: 11, fontWeight: '700' }}>
              {MONDAI_LABELS[question.mondai]}
            </Text>
          </View>
          <Text style={{ color: '#94a3b8', fontSize: 11 }}>
            {MONDAI_SUBTITLES[question.mondai]}
          </Text>
        </View>
        <Text style={{ color: '#94a3b8', fontSize: 13 }}>
          {questionNumber}
          <Text style={{ color: '#cbd5e1' }}> / {total}</Text>
        </Text>
      </View>

      {/* 지시문 */}
      <Text style={{ color: '#64748b', fontSize: 12, marginBottom: 14, textAlign: 'center', lineHeight: 18 }}>
        {MONDAI_INSTRUCTIONS[question.mondai]}
      </Text>

      {/* 문장 영역 */}
      <View
        style={{
          backgroundColor: '#f8fafc',
          borderRadius: 14,
          paddingHorizontal: 16,
          paddingVertical: 20,
          minHeight: isMondai4 ? 80 : 72,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {question.mondai === 'mondai1' || question.mondai === 'mondai2' ? (
          <UnderlinedSentence sentence={question.sentence} target={question.target} />
        ) : question.mondai === 'mondai3' ? (
          <BlankSentence sentence={question.sentence} />
        ) : (
          // mondai4: 밑줄 문장을 그대로 표시
          <Text
            style={{
              fontSize: 18,
              lineHeight: 30,
              textAlign: 'center',
              color: '#1e293b',
              textDecorationLine: 'underline',
              textDecorationColor: '#94a3b8',
            }}
          >
            {question.sentence}
          </Text>
        )}
      </View>
    </View>
  );
}
