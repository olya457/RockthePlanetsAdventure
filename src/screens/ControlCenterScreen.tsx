import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Pressable,
  Switch,
  Share,
  Platform,
  useWindowDimensions,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ControlCenter'>;

const BG = require('../assets/background.png');
const LOGO = require('../assets/logo.png'); 

function IconShare() {
  return <Text style={styles.rowIcon}>⤴︎</Text>;
}

export default function ControlCenterScreen({ navigation }: Props) {
  const { height: H } = useWindowDimensions();
  const isSmall = H < 740;
  const isVerySmall = H < 680;

  const [vibration, setVibration] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const cardPadV = useMemo(() => (isVerySmall ? 16 : isSmall ? 18 : 20), [isSmall, isVerySmall]);
  const rowH = useMemo(() => (isVerySmall ? 40 : isSmall ? 42 : 44), [isSmall, isVerySmall]);

  const onShare = async () => {
    try {
      await Share.share({
        message: 'Try this space quiz app ✨🚀',
      });
    } catch {
    }
  };

  const logoW = isVerySmall ? 260 : isSmall ? 280 : 300;
  const logoH = isVerySmall ? 180 : isSmall ? 195 : 210;
  const cardTop = isVerySmall ? 150 : isSmall ? 165 : 175;

  return (
    <ImageBackground source={BG} resizeMode="cover" style={styles.bg}>
      <View style={styles.dim} />

      <View style={{ flex: 1 }}>
        <View
          style={[
            styles.card,
            {
              paddingVertical: cardPadV,
              paddingHorizontal: isVerySmall ? 16 : 18,
              marginTop: cardTop,
              width: isVerySmall ? 310 : 320,
            },
          ]}
        >
          <View style={styles.headerRow}>
            <View style={{ width: 26 }} />
            <Text style={[styles.title, { fontSize: isVerySmall ? 18 : 19 }]}>Control Center</Text>

            <Pressable onPress={() => navigation.goBack()} style={({ pressed }) => [styles.close, pressed && styles.pressed]}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>
          <View style={{ marginTop: 10 }}>
            <View style={[styles.row, { height: rowH }]}>
              <Text style={styles.rowLabel}>Vibration</Text>
              <Switch
                value={vibration}
                onValueChange={setVibration}
                trackColor={{ false: '#5b5b5b', true: '#FFD64D' }}
                thumbColor={Platform.OS === 'android' ? '#5A18E6' : undefined}
                ios_backgroundColor="#5b5b5b"
              />
            </View>

            <View style={[styles.row, { height: rowH }]}>
              <Text style={styles.rowLabel}>Notifications</Text>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#5b5b5b', true: '#FFD64D' }}
                thumbColor={Platform.OS === 'android' ? '#5A18E6' : undefined}
                ios_backgroundColor="#5b5b5b"
              />
            </View>

            <Pressable onPress={onShare} style={({ pressed }) => [styles.row, { height: rowH }, pressed && styles.rowPressed]}>
              <Text style={styles.rowLabel}>Share App</Text>
              <IconShare />
            </Pressable>
          </View>
        </View>

        <Image
          source={LOGO}
          style={[
            styles.logo,
            {
              width: logoW,
              height: logoH,
              marginTop: isVerySmall ? 16 : 18,
            },
          ]}
        />
      </View>
    </ImageBackground>
  );
}

const PURPLE_2 = '#5A18E6';
const YELLOW = '#FFD64D';

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#000' },

  dim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },

  card: {
    alignSelf: 'center',
    borderRadius: 16,
    backgroundColor: PURPLE_2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    color: '#fff',
    fontWeight: '900',
  },

  close: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: YELLOW,
    fontSize: 22,
    fontWeight: '900',
    marginTop: -2,
  },

  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  rowPressed: { opacity: 0.92, transform: [{ scale: 0.995 }] },

  rowLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },

  rowIcon: {
    color: YELLOW,
    fontSize: 18,
    fontWeight: '900',
    paddingRight: 6,
  },

  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },

  logo: {
    alignSelf: 'center',
    resizeMode: 'contain',
  },
});
