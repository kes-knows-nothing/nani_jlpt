import { TouchableOpacity, Text, View } from 'react-native';

export type OptionState = 'default' | 'correct' | 'wrong';

type Props = {
  label: string;
  index: number;
  state: OptionState;
  onPress: () => void;
  disabled?: boolean;
};

const INDEX_LABELS = ['１', '２', '３', '４'];

const STYLES: Record<OptionState, {
  container: object;
  badge: object;
  badgeText: object;
  label: object;
}> = {
  default: {
    container: { borderColor: '#e2e8f0', backgroundColor: '#ffffff' },
    badge: { backgroundColor: '#f1f5f9' },
    badgeText: { color: '#64748b' },
    label: { color: '#334155' },
  },
  correct: {
    container: { borderColor: '#86efac', backgroundColor: '#f0fdf4' },
    badge: { backgroundColor: '#bbf7d0' },
    badgeText: { color: '#15803d' },
    label: { color: '#15803d', fontWeight: '600' },
  },
  wrong: {
    container: { borderColor: '#fca5a5', backgroundColor: '#fff1f2' },
    badge: { backgroundColor: '#fecaca' },
    badgeText: { color: '#dc2626' },
    label: { color: '#dc2626', fontWeight: '600' },
  },
};

export default function OptionButton({ label, index, state, onPress, disabled }: Props) {
  const s = STYLES[state];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.72}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1.5,
          borderRadius: 14,
          paddingHorizontal: 14,
          paddingVertical: 14,
          marginBottom: 10,
        },
        s.container,
      ]}
    >
      {/* 번호 뱃지 */}
      <View
        style={[
          {
            width: 28,
            height: 28,
            borderRadius: 14,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          },
          s.badge,
        ]}
      >
        <Text style={[{ fontSize: 12, fontWeight: '700' }, s.badgeText]}>
          {INDEX_LABELS[index]}
        </Text>
      </View>

      {/* 선택지 텍스트 */}
      <Text style={[{ flex: 1, fontSize: 16, lineHeight: 24 }, s.label]}>
        {label}
      </Text>

      {/* 정답/오답 아이콘 */}
      {state === 'correct' && (
        <Text style={{ fontSize: 18 }}>✓</Text>
      )}
      {state === 'wrong' && (
        <Text style={{ fontSize: 18 }}>✗</Text>
      )}
    </TouchableOpacity>
  );
}
