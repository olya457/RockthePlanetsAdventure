import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ImageBackground,
  Image,
  ScrollView,
  Platform,
  Modal,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Constellations'>;

const BG = require('../assets/background.png');
const CONSTELLATION_IMG = {
  orion: require('../assets/constellation_orion.png'),
  ursa_major: require('../assets/constellation_ursa_major.png'),
  cassiopeia: require('../assets/constellation_cassiopeia.png'),
  scorpius: require('../assets/constellation_scorpius.png'),
  leo: require('../assets/constellation_leo.png'),
  cygnus: require('../assets/constellation_cygnus.png'),
  taurus: require('../assets/constellation_taurus.png'),
  gemini: require('../assets/constellation_gemini.png'),
  sagittarius: require('../assets/constellation_sagittarius.png'),
  andromeda: require('../assets/constellation_andromeda.png'),
} as const;

type ConstellationId = keyof typeof CONSTELLATION_IMG;

type ConstellationItem = {
  id: ConstellationId;
  title: string;
  subtitle: string;
  shortText: string;
  fullText: string;
  bestSeen: string;
  keyStars: string;
};

const YELLOW = '#FFC83D';
const PURPLE = '#4B1FB8';

export default function ConstellationsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { width: W, height: H } = useWindowDimensions();

  const isSmall = H < 740;
  const isVerySmall = H < 680;

  const sidePad = isVerySmall ? 14 : 18;

  const cardW = Math.min(380, W - sidePad * 2);
  const imgSize = isVerySmall ? 110 : isSmall ? 120 : 128;

  const btnH = isVerySmall ? 30 : 32;
  const titleSize = isVerySmall ? 15 : 16;
  const subtitleSize = isVerySmall ? 11 : 12;
  const textSize = isVerySmall ? 12 : 13;

  const data: ConstellationItem[] = useMemo(
    () => [
      {
        id: 'orion',
        title: 'Orion',
        subtitle: 'The Hunter',
        shortText: 'Easy to spot by the three stars of Orion’s Belt.',
        bestSeen: 'Winter (Northern Hemisphere)',
        keyStars: 'Betelgeuse, Rigel, Belt (Alnitak–Alnilam–Mintaka)',
        fullText:
          'Orion is one of the most recognizable constellations in the night sky. The three aligned stars of Orion’s Belt are a great starting point. Look for Betelgeuse (a reddish supergiant) and Rigel (a bright blue-white star) marking the shoulders and foot of the hunter. Orion is visible worldwide and appears especially prominent on clear winter nights in the Northern Hemisphere.',
      },
      {
        id: 'ursa_major',
        title: 'Ursa Major',
        subtitle: 'The Great Bear',
        shortText: 'Home of the Big Dipper — a classic navigation guide.',
        bestSeen: 'Spring (Northern Hemisphere)',
        keyStars: 'Dubhe, Merak (pointer stars), Alioth',
        fullText:
          'Ursa Major contains the famous Big Dipper asterism. Two stars at the end of the dipper’s bowl (Dubhe and Merak) point toward Polaris, the North Star. The Big Dipper circles the sky across the year and is often used as a beginner-friendly tool for finding other constellations.',
      },
      {
        id: 'cassiopeia',
        title: 'Cassiopeia',
        subtitle: 'The Queen',
        shortText: 'A bright “W” shape opposite the Big Dipper around Polaris.',
        bestSeen: 'Autumn (Northern Hemisphere)',
        keyStars: 'Schedar, Caph',
        fullText:
          'Cassiopeia is well known for its distinct “W” or “M” pattern, depending on its orientation. It sits opposite the Big Dipper around Polaris, making it useful for navigation and sky orientation. Cassiopeia is visible year-round for many northern observers and is packed with star clusters.',
      },
      {
        id: 'scorpius',
        title: 'Scorpius',
        subtitle: 'The Scorpion',
        shortText: 'A curved body with Antares glowing as the heart.',
        bestSeen: 'Summer',
        keyStars: 'Antares',
        fullText:
          'Scorpius is a striking constellation with a long, curved shape resembling a scorpion. Antares, a red supergiant, marks the heart and is one of the brightest stars in the night sky. Scorpius dominates summer skies and sits near the Milky Way, so you’ll often see rich star fields nearby.',
      },
      {
        id: 'leo',
        title: 'Leo',
        subtitle: 'The Lion',
        shortText: 'Find the “sickle” shape — like a backwards question mark.',
        bestSeen: 'Spring',
        keyStars: 'Regulus',
        fullText:
          'Leo is a zodiac constellation recognizable by the “sickle” asterism, which looks like a backwards question mark. Regulus, Leo’s brightest star, marks the heart of the lion. Leo is a favorite for beginners thanks to its bold pattern and strong seasonal visibility.',
      },
      {
        id: 'cygnus',
        title: 'Cygnus',
        subtitle: 'The Swan',
        shortText: 'The Northern Cross shape sits right on the Milky Way.',
        bestSeen: 'Summer / Early Autumn',
        keyStars: 'Deneb',
        fullText:
          'Cygnus is often identified as the Northern Cross. It lies directly along the Milky Way, making it perfect for stargazing on clear nights. Deneb is a bright star forming part of the Summer Triangle (with Vega and Altair). Cygnus is rich in deep-sky objects and star clouds.',
      },
      {
        id: 'taurus',
        title: 'Taurus',
        subtitle: 'The Bull',
        shortText: 'A V-shape face with the bright star Aldebaran nearby.',
        bestSeen: 'Winter',
        keyStars: 'Aldebaran, Pleiades (nearby)',
        fullText:
          'Taurus is a prominent winter constellation. Its face is marked by the Hyades cluster forming a V shape, with Aldebaran (orange giant) shining near the eye. Nearby you can also find the Pleiades cluster, one of the most famous star clusters visible to the naked eye.',
      },
      {
        id: 'gemini',
        title: 'Gemini',
        subtitle: 'The Twins',
        shortText: 'Look for two bright stars: Castor and Pollux.',
        bestSeen: 'Winter / Spring',
        keyStars: 'Castor, Pollux',
        fullText:
          'Gemini is represented by the twins Castor and Pollux, two bright stars close together. The constellation is part of the zodiac and becomes very visible during winter and early spring. Gemini is also home to meteor shower activity (Geminids) peaking in December.',
      },
      {
        id: 'sagittarius',
        title: 'Sagittarius',
        subtitle: 'The Archer',
        shortText: 'The “Teapot” shape points toward the center of the Milky Way.',
        bestSeen: 'Summer',
        keyStars: 'Kaus Australis',
        fullText:
          'Sagittarius contains the famous “Teapot” asterism. From dark locations, this area reveals dense Milky Way star fields — it’s near the direction of our galaxy’s center. Sagittarius is a top target for stargazers because of the number of nebulae and clusters in this region.',
      },
      {
        id: 'andromeda',
        title: 'Andromeda',
        subtitle: 'The Princess',
        shortText: 'Best known for the Andromeda Galaxy — a faint smudge in dark skies.',
        bestSeen: 'Autumn',
        keyStars: 'Alpheratz (shared region with Pegasus)',
        fullText:
          'Andromeda is famous because it contains the Andromeda Galaxy (M31), the nearest major galaxy to the Milky Way. Under dark skies, M31 can be visible as a faint, elongated patch. The constellation itself is easier to locate using nearby Pegasus and Cassiopeia as references.',
      },
    ],
    []
  );

  const [selected, setSelected] = useState<ConstellationItem | null>(null);

  return (
    <ImageBackground source={BG} resizeMode="cover" style={styles.bg}>
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <View style={[styles.topBar, { paddingHorizontal: sidePad, marginTop: Platform.OS === 'android' ? 6 : 2 }]}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
          >
            <Text style={styles.backIcon}>‹</Text>
          </Pressable>

          <View style={styles.titlePill}>
            <Text style={styles.titlePillText}>Constellations</Text>
          </View>

          <View style={{ width: 44 }} />
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: sidePad,
          paddingTop: isVerySmall ? 12 : 16,
          paddingBottom: Math.max(16, insets.bottom + 18),
          alignItems: 'center',
        }}
      >
        {data.map((item, index) => {
          const imageLeft = index % 2 === 0;

          return (
            <View key={item.id} style={[styles.card, { width: cardW }]}>
              <View style={[styles.row, { flexDirection: imageLeft ? 'row' : 'row-reverse' }]}>
          
                <View style={[styles.imgWrap, { width: imgSize, height: imgSize }]}>
                  <Image source={CONSTELLATION_IMG[item.id]} style={styles.img} />
                </View>

                <View style={styles.textCol}>
                  <Text style={[styles.title, { fontSize: titleSize }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={[styles.subtitle, { fontSize: subtitleSize }]} numberOfLines={1}>
                    {item.subtitle}
                  </Text>

                  <Text style={[styles.short, { fontSize: textSize }]} numberOfLines={3}>
                    {item.shortText}
                  </Text>

                  <Pressable
                    onPress={() => setSelected(item)}
                    style={({ pressed }) => [styles.openBtn, { height: btnH }, pressed && styles.pressed]}
                  >
                    <Text style={styles.openBtnText}>Open</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <Modal visible={!!selected} transparent animationType="fade" onRequestClose={() => setSelected(null)}>
        <View style={styles.overlay}>
          <View style={[styles.modalCard, { marginHorizontal: sidePad }]}>
            {selected && (
              <>
                <View style={styles.modalTopRow}>
                  <Text style={styles.modalTitle}>{selected.title}</Text>
                  <Pressable onPress={() => setSelected(null)} style={({ pressed }) => [styles.xBtn, pressed && styles.pressed]}>
                    <Text style={styles.xTxt}>×</Text>
                  </Pressable>
                </View>

                <Text style={styles.modalSub}>{selected.subtitle}</Text>

                <View style={{ height: 10 }} />

                <View style={styles.modalImgWrap}>
                  <Image source={CONSTELLATION_IMG[selected.id]} style={styles.modalImg} />
                </View>

                <View style={{ height: 10 }} />

                <Text style={styles.modalLine}>
                  Best seen: <Text style={styles.modalStrong}>{selected.bestSeen}</Text>
                </Text>
                <Text style={styles.modalLine}>
                  Key stars: <Text style={styles.modalStrong}>{selected.keyStars}</Text>
                </Text>

                <View style={{ height: 10 }} />

                <ScrollView style={{ maxHeight: 220 }} showsVerticalScrollIndicator={false}>
                  <Text style={styles.modalBody}>{selected.fullText}</Text>
                </ScrollView>

                <View style={{ height: 12 }} />

                <Pressable onPress={() => setSelected(null)} style={({ pressed }) => [styles.closeBtn, pressed && styles.pressed]}>
                  <Text style={styles.closeBtnText}>Close</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#000' },
  safe: { backgroundColor: 'transparent' },
  pressed: { opacity: 0.88, transform: [{ scale: 0.98 }] },

  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: {
    width: 44,
    height: 34,
    borderRadius: 12,
    backgroundColor: YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { color: '#2B135F', fontSize: 22, fontWeight: '900', marginTop: -2 },

  titlePill: {
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titlePillText: { color: '#fff', fontWeight: '900', fontSize: 14 },

  card: {
    borderRadius: 22,
    backgroundColor: PURPLE,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.26,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },

  row: { alignItems: 'center', gap: 12 },

  imgWrap: {
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  img: { width: '88%', height: '88%', resizeMode: 'contain' },

  textCol: { flex: 1, minHeight: 110, justifyContent: 'center' },

  title: { color: '#fff', fontWeight: '900' },
  subtitle: { marginTop: 2, color: '#fff', opacity: 0.85, fontWeight: '800' },
  short: { marginTop: 8, color: '#fff', opacity: 0.92, fontWeight: '700', lineHeight: 18 },

  openBtn: {
    marginTop: 10,
    borderRadius: 999,
    backgroundColor: YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
  },
  openBtnText: { color: '#fff', fontWeight: '900', fontSize: 13 },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 22,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 20,
    backgroundColor: PURPLE,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  modalTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  modalTitle: { color: '#fff', fontWeight: '900', fontSize: 18 },
  xBtn: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  xTxt: { color: '#fff', fontWeight: '900', fontSize: 20, marginTop: -2 },

  modalSub: { marginTop: 2, color: '#fff', opacity: 0.85, fontWeight: '800' },

  modalImgWrap: {
    height: 160,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalImg: { width: '90%', height: '90%', resizeMode: 'contain' },

  modalLine: { marginTop: 6, color: '#fff', opacity: 0.9, fontWeight: '800' },
  modalStrong: { color: '#fff', fontWeight: '900', opacity: 1 },

  modalBody: { color: '#fff', opacity: 0.92, fontWeight: '700', lineHeight: 18 },

  closeBtn: {
    height: 36,
    borderRadius: 999,
    backgroundColor: YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: { color: '#fff', fontWeight: '900' },
});
