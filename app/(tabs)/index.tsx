import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { questions, MONDAI_LABELS, MONDAI_SUBTITLES } from '../../lib/questions';
import { Question } from '../../types/question';

const MONDAI_TYPES: Question['mondai'][] = ['mondai1', 'mondai2', 'mondai3', 'mondai4'];

const MONDAI_ICONS: Record<Question['mondai'], React.ComponentProps<typeof Ionicons>['name']> = {
  mondai1: 'book-outline',
  mondai2: 'create-outline',
  mondai3: 'chatbubble-outline',
  mondai4: 'swap-horizontal-outline',
};

export default function HomeScreen() {
  const total = questions.length;
  const countByMondai = (mondai: Question['mondai']) =>
    questions.filter((q) => q.mondai === mondai).length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {/* 헤더 */}
        <View
          style={{
            backgroundColor: '#4338ca',
            paddingHorizontal: 24,
            paddingTop: 24,
            paddingBottom: 48,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <View
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                paddingHorizontal: 10,
                paddingVertical: 3,
                borderRadius: 20,
              }}
            >
              <Text style={{ color: '#c7d2fe', fontSize: 11, fontWeight: '700' }}>N5</Text>
            </View>
          </View>
          <Text style={{ color: '#ffffff', fontSize: 32, fontWeight: '800', letterSpacing: -0.5 }}>
            JLPT N5
          </Text>
          <Text style={{ color: '#a5b4fc', fontSize: 15, marginTop: 4 }}>
            문자 · 어휘 연습
          </Text>
        </View>

        {/* 시작 카드 */}
        <View style={{ marginHorizontal: 16, marginTop: -28 }}>
          <View
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 20,
              padding: 20,
              shadowColor: '#4338ca',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.12,
              shadowRadius: 16,
              elevation: 6,
            }}
          >
            <Text style={{ color: '#475569', fontSize: 13, marginBottom: 16 }}>
              총 <Text style={{ color: '#4338ca', fontWeight: '700' }}>{total}문제</Text>가 준비되어 있습니다
            </Text>

            {/* 문제 유형 목록 */}
            <View style={{ gap: 10 }}>
              {MONDAI_TYPES.map((mondai) => (
                <View
                  key={mondai}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#f8fafc',
                    borderRadius: 12,
                    padding: 12,
                  }}
                >
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: '#e0e7ff',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 12,
                    }}
                  >
                    <Ionicons name={MONDAI_ICONS[mondai]} size={18} color="#4338ca" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#1e293b', fontSize: 13, fontWeight: '600' }}>
                      {MONDAI_LABELS[mondai]}
                    </Text>
                    <Text style={{ color: '#94a3b8', fontSize: 11, marginTop: 1 }}>
                      {MONDAI_SUBTITLES[mondai]}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: '#e0e7ff',
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 20,
                    }}
                  >
                    <Text style={{ color: '#4338ca', fontSize: 12, fontWeight: '700' }}>
                      {countByMondai(mondai)}문제
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* 시작 버튼 */}
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/practice')}
              activeOpacity={0.85}
              style={{
                backgroundColor: '#4338ca',
                borderRadius: 16,
                paddingVertical: 18,
                alignItems: 'center',
                marginTop: 20,
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Text style={{ color: '#ffffff', fontSize: 17, fontWeight: '700' }}>
                문제 풀기 시작
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 학습 팁 */}
        <View
          style={{
            marginHorizontal: 16,
            marginTop: 16,
            backgroundColor: '#fffbeb',
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: '#fde68a',
          }}
        >
          <Text style={{ color: '#92400e', fontSize: 13, fontWeight: '700', marginBottom: 6 }}>
            💡 학습 팁
          </Text>
          <Text style={{ color: '#78350f', fontSize: 12, lineHeight: 20 }}>
            틀린 문제는 자동으로 오답 노트에 저장됩니다.{'\n'}
            오답 노트를 반복 학습하면 실력이 빠르게 늘어요!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
