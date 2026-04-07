import { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { WrongAnswer } from '../../types/question';
import { getWrongAnswers, removeWrongAnswer, clearWrongAnswers } from '../../lib/storage';
import { MONDAI_LABELS, MONDAI_SUBTITLES } from '../../lib/questions';

export default function ResultsScreen() {
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);

  // 탭 포커스할 때마다 최신 오답 목록 불러오기
  useFocusEffect(
    useCallback(() => {
      getWrongAnswers().then((data) => setWrongAnswers(data.slice().reverse())); // 최신순
    }, []),
  );

  const handleRemove = async (questionId: string) => {
    await removeWrongAnswer(questionId);
    setWrongAnswers((prev) => prev.filter((a) => a.questionId !== questionId));
  };

  const handleClearAll = () => {
    Alert.alert('오답 노트 초기화', '모든 오답 기록을 삭제할까요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          await clearWrongAnswers();
          setWrongAnswers([]);
        },
      },
    ]);
  };

  // ── 빈 상태 ─────────────────────────────────
  if (wrongAnswers.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <Text style={{ fontSize: 52, marginBottom: 12 }}>🎉</Text>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#1e293b', marginBottom: 6 }}>
            오답이 없어요!
          </Text>
          <Text style={{ color: '#94a3b8', fontSize: 14, textAlign: 'center', lineHeight: 22 }}>
            틀린 문제가 생기면{'\n'}여기에 자동으로 저장됩니다
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── 오답 목록 ────────────────────────────────
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      {/* 헤더 */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingVertical: 14,
          borderBottomWidth: 1,
          borderBottomColor: '#f1f5f9',
          backgroundColor: '#ffffff',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Ionicons name="bookmark" size={18} color="#4338ca" />
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1e293b' }}>오답 노트</Text>
          <View
            style={{
              backgroundColor: '#e0e7ff',
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: '#4338ca', fontSize: 12, fontWeight: '700' }}>
              {wrongAnswers.length}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleClearAll}>
          <Text style={{ color: '#f87171', fontSize: 13 }}>전체 삭제</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
        {wrongAnswers.map((item) => (
          <View
            key={item.questionId}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 18,
              padding: 18,
              marginBottom: 12,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
              borderWidth: 1,
              borderColor: '#f1f5f9',
            }}
          >
            {/* 상단 뱃지 + 삭제 */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View
                  style={{
                    backgroundColor: '#e0e7ff',
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    borderRadius: 12,
                  }}
                >
                  <Text style={{ color: '#4338ca', fontSize: 11, fontWeight: '700' }}>
                    {MONDAI_LABELS[item.question.mondai]}
                  </Text>
                </View>
                <Text style={{ color: '#94a3b8', fontSize: 11 }}>
                  {MONDAI_SUBTITLES[item.question.mondai]}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleRemove(item.questionId)}
                style={{ padding: 4 }}
              >
                <Ionicons name="close-circle-outline" size={18} color="#cbd5e1" />
              </TouchableOpacity>
            </View>

            {/* 문장 */}
            <View
              style={{
                backgroundColor: '#f8fafc',
                borderRadius: 10,
                padding: 12,
                marginBottom: 14,
              }}
            >
              <Text style={{ fontSize: 16, color: '#334155', lineHeight: 26 }}>
                {item.question.sentence}
              </Text>
            </View>

            {/* 내 답 / 정답 */}
            <View style={{ gap: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
                <View
                  style={{
                    backgroundColor: '#fef2f2',
                    borderRadius: 8,
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                  }}
                >
                  <Text style={{ color: '#dc2626', fontSize: 11, fontWeight: '700' }}>내 답</Text>
                </View>
                <Text style={{ color: '#dc2626', fontSize: 14, flex: 1, lineHeight: 22 }}>
                  {item.question.options[item.selectedIndex]}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
                <View
                  style={{
                    backgroundColor: '#f0fdf4',
                    borderRadius: 8,
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                  }}
                >
                  <Text style={{ color: '#15803d', fontSize: 11, fontWeight: '700' }}>정답</Text>
                </View>
                <Text style={{ color: '#15803d', fontSize: 14, fontWeight: '600', flex: 1, lineHeight: 22 }}>
                  {item.question.options[item.question.correctIndex]}
                </Text>
              </View>
            </View>

            {/* 해설 */}
            {item.question.explanation && (
              <View
                style={{
                  marginTop: 12,
                  paddingTop: 12,
                  borderTopWidth: 1,
                  borderTopColor: '#f1f5f9',
                }}
              >
                <Text style={{ color: '#64748b', fontSize: 12, lineHeight: 20 }}>
                  💡 {item.question.explanation}
                </Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
