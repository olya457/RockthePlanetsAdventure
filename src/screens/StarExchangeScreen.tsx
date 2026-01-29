import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Pressable,
  Modal,
  Platform,
  Animated,
  Easing,
  useWindowDimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'StarExchange'>;

const BG = require('../assets/background.png');
const ROCKET_IMG = require('../assets/rocket_1.png');

const IMG = {
  mercury: require('../assets/planet_mercury.png'),
  venus: require('../assets/planet_venus.png'),
  earth: require('../assets/planet_earth.png'),
  mars: require('../assets/planet_mars.png'),
  jupiter: require('../assets/planet_jupiter.png'),
  saturn: require('../assets/planet_saturn.png'),
  uranus: require('../assets/planet_uranus.png'),
  neptune: require('../assets/planet_neptune.png'),
} as const;

type PlanetId = keyof typeof IMG;
type Q = { q: string; a: [string, string, string]; correct: 0 | 1 | 2 };

const BANK: Record<PlanetId, Q[]> = {
  mercury: [
    { q: "Which feature is most common on Mercury’s surface?", a: ['Frozen lakes', 'Deep craters', 'Active volcanoes'], correct: 1 },
    { q: 'Why does Mercury have extreme temperature changes?', a: ['It rotates very fast', 'It has almost no atmosphere', 'It reflects too much sunlight'], correct: 1 },
    { q: 'How long is one year on Mercury?', a: ['88 Earth days', '365 Earth days', '12 Earth days'], correct: 0 },
    { q: 'What is Mercury’s surface mainly made of?', a: ['Gas clouds', 'Ice sheets', 'Rocky terrain'], correct: 2 },
    { q: 'What created most of Mercury’s cliffs and ridges?', a: ['Shrinking as the planet cooled', 'Ocean erosion', 'Moon tides'], correct: 0 },
    { q: 'What is Mercury’s position from the Sun?', a: ['1st', '3rd', '5th'], correct: 0 },
    { q: 'Does Mercury have large moons?', a: ['Yes, many', 'No, none', 'Only one'], correct: 1 },
    { q: 'Mercury’s day length is...', a: ['Shorter than its year', 'Longer than its year', 'Equal to Earth day'], correct: 1 },
    { q: 'What spacecraft mapped Mercury in detail?', a: ['MESSENGER', 'Cassini', 'Juno'], correct: 0 },
    { q: 'Mercury is best described as...', a: ['Gas giant', 'Ice giant', 'Rocky planet'], correct: 2 },
  ],
  venus: [
    { q: 'What causes Venus’s extreme heat?', a: ['A runaway greenhouse effect', 'Lava oceans', 'Its distance from the Sun'], correct: 0 },
    { q: 'What are Venus’s clouds made of?', a: ['Water vapor', 'Sulfuric acid', 'Crystal dust'], correct: 1 },
    { q: 'How does Venus rotate?', a: ['Backward and very slowly', 'Faster than Earth', 'Without spinning at all'], correct: 0 },
    { q: 'What is the surface pressure on Venus like?', a: ['Similar to Earth', 'Like deep underwater', 'Almost zero'], correct: 1 },
    { q: 'What hides Venus’s surface from view?', a: ['Thick acid clouds', 'Floating mountains', 'Magnetic storms'], correct: 0 },
    { q: 'Venus is often called Earth’s...', a: ['Twin', 'Moon', 'Ring'], correct: 0 },
    { q: 'Venus is the...', a: ['Hottest planet', 'Coldest planet', 'Smallest planet'], correct: 0 },
    { q: 'Venus atmosphere is mostly...', a: ['Carbon dioxide', 'Oxygen', 'Hydrogen'], correct: 0 },
    { q: 'Typical Venus surface is...', a: ['Extremely dry and rocky', 'Covered by oceans', 'Made of ice'], correct: 0 },
    { q: 'Venus has...', a: ['Many rings', 'No rings', 'A big ring'], correct: 1 },
  ],
  earth: [
    { q: 'What makes Earth unique in the Solar System?', a: ['It has active volcanoes', 'It supports life', 'It has a moon'], correct: 1 },
    { q: 'How much of Earth is covered by water?', a: ['71%', '20%', '51%'], correct: 0 },
    { q: 'What protects Earth from solar radiation?', a: ['Its thick clouds', 'Its strong magnetic field', 'Its mountains'], correct: 1 },
    { q: 'What is Earth’s atmosphere mostly made of?', a: ['Nitrogen and oxygen', 'Hydrogen and helium', 'Carbon dioxide'], correct: 0 },
    { q: 'What stabilizes Earth’s seasons?', a: ['Jupiter’s gravity', 'Earth’s magnetic field', 'The Moon'], correct: 2 },
    { q: 'Earth is the ___ planet from the Sun.', a: ['2nd', '3rd', '4th'], correct: 1 },
    { q: 'Earth’s largest ocean is...', a: ['Atlantic', 'Indian', 'Pacific'], correct: 2 },
    { q: 'The layer that contains most weather is...', a: ['Stratosphere', 'Troposphere', 'Mesosphere'], correct: 1 },
    { q: 'Earth’s natural satellite is...', a: ['Europa', 'The Moon', 'Titan'], correct: 1 },
    { q: 'Earth’s core is mainly...', a: ['Iron and nickel', 'Ice and rock', 'Hydrogen gas'], correct: 0 },
  ],
  mars: [
    { q: 'Why is Mars called the Red Planet?', a: ['It glows red at night', 'Iron oxide covers the surface', 'It has red oceans'], correct: 1 },
    { q: 'What is the tallest volcano in the Solar System?', a: ['Mauna Kea', 'Olympus Mons', 'Red Ridge'], correct: 1 },
    { q: 'What suggests Mars once had water?', a: ['Dried riverbeds', 'Green valleys', 'Ocean fossils'], correct: 0 },
    { q: 'What is Mars’s atmosphere mostly made of?', a: ['Oxygen', 'Nitrogen', 'Carbon dioxide'], correct: 2 },
    { q: 'Which moon orbits Mars?', a: ['Titan', 'Phobos', 'Europa'], correct: 1 },
    { q: 'Mars is a...', a: ['Rocky planet', 'Gas giant', 'Ice giant'], correct: 0 },
    { q: 'Mars has polar caps made of...', a: ['CO₂ ice and water ice', 'Liquid water', 'Metal'], correct: 0 },
    { q: 'A common Mars surface feature is...', a: ['Sand dunes', 'Huge oceans', 'Rings'], correct: 0 },
    { q: 'Mars gravity compared to Earth is...', a: ['Stronger', 'Weaker', 'Same'], correct: 1 },
    { q: 'A famous Mars rover is...', a: ['Perseverance', 'Voyager', 'Hubble'], correct: 0 },
  ],
  jupiter: [
    { q: 'What kind of planet is Jupiter?', a: ['Terrestrial planet', 'Gas giant', 'Ice world'], correct: 1 },
    { q: 'What is the Great Red Spot?', a: ['A giant volcano', 'A massive storm', 'A giant crater'], correct: 1 },
    { q: 'What is Jupiter mostly made of?', a: ['Rock', 'Water', 'Hydrogen and helium'], correct: 2 },
    { q: 'How many moons does Jupiter have?', a: ['More than 90', 'Only 4', 'Exactly 20'], correct: 0 },
    { q: 'What makes Jupiter dangerous for spacecraft?', a: ['Lava clouds', 'Extreme heat', 'Strong radiation belts'], correct: 2 },
    { q: 'Jupiter is the ___ planet from the Sun.', a: ['4th', '5th', '6th'], correct: 1 },
    { q: 'Jupiter has...', a: ['Rings (faint)', 'No atmosphere', 'Solid surface'], correct: 0 },
    { q: 'Jupiter’s core is thought to be...', a: ['Icy only', 'Rock/ice under pressure', 'Empty'], correct: 1 },
    { q: 'A famous Jupiter moon is...', a: ['Europa', 'Triton', 'Phobos'], correct: 0 },
    { q: 'Jupiter’s day is...', a: ['~10 hours', '~24 hours', '~88 days'], correct: 0 },
  ],
  saturn: [
    { q: 'What is Saturn best known for?', a: ['Its oceans', 'Its rings', 'Its hot surface'], correct: 1 },
    { q: 'What are Saturn’s rings made of?', a: ['Ice and rock', 'Gas only', 'Liquid metal'], correct: 0 },
    { q: 'What type of planet is Saturn?', a: ['Ice giant', 'Terrestrial planet', 'Gas giant'], correct: 2 },
    { q: 'Which moon of Saturn has lakes of methane?', a: ['Ganymede', 'Titan', 'Triton'], correct: 1 },
    { q: 'Why does Saturn float in theory?', a: ['It has a hollow core', 'Its density is very low', 'It is made of frozen gas'], correct: 1 },
    { q: 'Saturn is the ___ planet from the Sun.', a: ['5th', '6th', '7th'], correct: 1 },
    { q: 'Saturn’s rings are mostly...', a: ['Bright ice particles', 'Lava', 'Dust only'], correct: 0 },
    { q: 'Saturn’s largest moon is...', a: ['Titan', 'Io', 'Europa'], correct: 0 },
    { q: 'Saturn is mainly made of...', a: ['Hydrogen/helium', 'Rock', 'Water'], correct: 0 },
    { q: 'Saturn’s day is...', a: ['~10–11 hours', '~30 hours', '~7 days'], correct: 0 },
  ],
  uranus: [
    { q: 'What makes Uranus’s rotation unusual?', a: ['It doesn’t rotate', 'It rotates sideways', 'It spins extremely fast'], correct: 1 },
    { q: 'What gives Uranus its blue color?', a: ['Water oceans', 'Methane in the atmosphere', 'Frozen clouds'], correct: 1 },
    { q: 'What type of planet is Uranus?', a: ['Gas giant', 'Ice giant', 'Rocky world'], correct: 1 },
    { q: 'How many moons does Uranus have?', a: ['27', '3', '70'], correct: 0 },
    { q: 'Who visited Uranus?', a: ['Voyager 2', 'Curiosity rover', 'Magellan'], correct: 0 },
    { q: 'Uranus is the ___ planet from the Sun.', a: ['6th', '7th', '8th'], correct: 1 },
    { q: 'Uranus has...', a: ['Faint rings', 'Huge oceans', 'No atmosphere'], correct: 0 },
    { q: 'Uranus is very...', a: ['Hot', 'Cold', 'Molten'], correct: 1 },
    { q: 'Uranus atmosphere is mainly...', a: ['Hydrogen/helium', 'Oxygen', 'Nitrogen only'], correct: 0 },
    { q: 'Uranus’s tilt is about...', a: ['98°', '10°', '0°'], correct: 0 },
  ],
  neptune: [
    { q: 'What makes Neptune so windy?', a: ['Its hot core', 'Fast atmospheric jets', 'Volcano eruptions'], correct: 1 },
    { q: 'What gives Neptune its deep blue color?', a: ['Iron dust', 'Thick clouds', 'Methane and unknown gases'], correct: 2 },
    { q: 'What is Neptune classified as?', a: ['Ice giant', 'Gas giant', 'Dwarf planet'], correct: 0 },
    { q: 'Which moon of Neptune has active geysers?', a: ['Titan', 'Triton', 'Io'], correct: 1 },
    { q: 'Which spacecraft visited Neptune?', a: ['Voyager 2', 'New Horizons', 'Juno'], correct: 0 },
    { q: 'Neptune is the ___ planet from the Sun.', a: ['7th', '8th', '9th'], correct: 1 },
    { q: 'Neptune’s largest moon is...', a: ['Triton', 'Titan', 'Europa'], correct: 0 },
    { q: 'Neptune has...', a: ['Rings (faint)', 'No moons', 'A solid surface'], correct: 0 },
    { q: 'Neptune is mostly...', a: ['Ice/rock with gases', 'Pure rock', 'Pure metal'], correct: 0 },
    { q: 'Neptune’s storms can be...', a: ['Very strong', 'Impossible', 'Always calm'], correct: 0 },
  ],
};

type Mode = 'select' | 'quiz';

export default function StarExchangeScreen({ navigation }: Props) {
  const { height: H, width: W } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const isVerySmall = H < 680;
  const isSmall = H < 740;

  const sidePad = isVerySmall ? 14 : 18;

  const androidTopDown = Platform.OS === 'android' ? 10 : 0;
  const androidBottomUp = Platform.OS === 'android' ? 10 : 0;
  const statusH = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0;

  const planetSizeSelect = Math.min(isVerySmall ? 210 : isSmall ? 240 : 270, W * 0.70);
  const planetSizeQuiz = Math.min(isVerySmall ? 185 : isSmall ? 205 : 235, W * 0.62);

  const answerH = isVerySmall ? 40 : isSmall ? 44 : 48;
  const qFont = isVerySmall ? 12.5 : isSmall ? 13.5 : 14.5;
  const ansFont = isVerySmall ? 12.5 : isSmall ? 13 : 13.5;

  const [mode, setMode] = useState<Mode>('select');
  const [selected, setSelected] = useState<PlanetId>('mercury');

  const questions = useMemo(() => BANK[selected].slice(0, 10), [selected]);
  const totalQ = questions.length;

  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<0 | 1 | 2 | null>(null);
  const [locked, setLocked] = useState(false);

  const [stars, setStars] = useState(0);
  const [lives, setLives] = useState(3);

  const [done, setDone] = useState(false);
  const [win, setWin] = useState(false);
  const [exitAsk, setExitAsk] = useState(false);

  const [isAnimating, setIsAnimating] = useState(false);

  const rocketY = useRef(new Animated.Value(H + 220)).current;
  const overlayA = useRef(new Animated.Value(0)).current;

  const order: PlanetId[] = useMemo(
    () => ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'],
    []
  );

  const current = questions[idx];

  const safeSetLives = (next: number) => setLives(Math.max(0, Math.min(3, next)));

  const resetQuiz = () => {
    setIdx(0);
    setPicked(null);
    setLocked(false);
    setStars(0);
    setLives(3);
    setDone(false);
    setWin(false);
    setExitAsk(false);
  };

  const startQuizWithRocket = () => {
    if (isAnimating) return;

    resetQuiz();
    setIsAnimating(true);

    rocketY.setValue(H + 260);
    overlayA.setValue(0);

    Animated.parallel([
      Animated.timing(overlayA, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.timing(rocketY, {
        toValue: -Math.round(H * 1.35),
        duration: 3000,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.cubic),
      }),
    ]).start(() => {
      overlayA.setValue(0);
      setIsAnimating(false);
      setMode('quiz');
    });
  };

  const goPrev = () => {
    const i = order.indexOf(selected);
    setSelected(i <= 0 ? order[order.length - 1] : order[i - 1]);
  };

  const goNext = () => {
    const i = order.indexOf(selected);
    setSelected(i >= order.length - 1 ? order[0] : order[i + 1]);
  };

  const answerStyle = (i: 0 | 1 | 2) => {
    if (!locked) return [styles.answer, picked === i && styles.answerSelected];
    if (i === current.correct) return [styles.answer, styles.answerCorrect];
    if (picked === i && i !== current.correct) return [styles.answer, styles.answerWrong];
    return [styles.answer, styles.answerDim];
  };

  const finish = (didWin: boolean) => {
    setWin(didWin);
    setDone(true);
  };

  const onPick = (ii: 0 | 1 | 2) => {
    if (locked || isAnimating) return;

    setPicked(ii);
    setLocked(true);

    const ok = ii === current.correct;

    if (ok) setStars((s) => s + 1);
    else safeSetLives(lives - 1);

    setTimeout(() => {
      const nextLives = ok ? lives : Math.max(0, lives - 1);
      const isLast = idx >= totalQ - 1;

      if (nextLives <= 0) {
        finish(false);
        return;
      }

      if (isLast) {
        finish(true);
        return;
      }

      setIdx((v) => v + 1);
      setPicked(null);
      setLocked(false);
    }, 520);
  };

  const rocketSize = Math.min(isVerySmall ? 150 : 180, Math.round(W * 0.48));
  const rocketLeft = Math.round(W * 0.5 - rocketSize * 0.5);

  const topInsetAndroid = Platform.OS === 'android' ? statusH + androidTopDown : 0;
  const bottomInsetAndroid = Platform.OS === 'android' ? (insets.bottom + androidBottomUp) : insets.bottom;

  return (
    <ImageBackground source={BG} resizeMode="cover" style={styles.bg}>
      <SafeAreaView style={styles.safe} edges={['left', 'right']}>
        <View style={[styles.topRow, { paddingHorizontal: sidePad, paddingTop: topInsetAndroid }]}>
          <Pressable
            disabled={isAnimating}
            onPress={() => {
              if (mode === 'quiz') setExitAsk(true);
              else navigation.goBack();
            }}
            style={({ pressed }) => [styles.backBtn, pressed && !isAnimating && styles.pressed]}
          >
            <Text style={styles.backIcon}>‹</Text>
          </Pressable>

          {mode === 'quiz' ? (
            <View style={styles.pill}>
              <Text style={styles.pillStar}>★</Text>
              <Text style={styles.pillText}>x {stars}</Text>
            </View>
          ) : (
            <View style={styles.pill}>
              <Text style={styles.pillStar}>★</Text>
              <Text style={styles.pillText}>Planet Quiz</Text>
            </View>
          )}

          <View style={{ width: 44 }} />
        </View>
      </SafeAreaView>

      {mode === 'select' && (
        <View style={{ flex: 1, paddingHorizontal: sidePad, paddingBottom: Math.max(16, bottomInsetAndroid) }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Pressable disabled={isAnimating} onPress={goPrev} style={({ pressed }) => [styles.arrowBtnLeft, pressed && !isAnimating && styles.pressed]}>
              <Text style={styles.arrowText}>‹</Text>
            </Pressable>

            <Image source={IMG[selected]} style={{ width: planetSizeSelect, height: planetSizeSelect, resizeMode: 'contain' }} />

            <Pressable disabled={isAnimating} onPress={goNext} style={({ pressed }) => [styles.arrowBtnRight, pressed && !isAnimating && styles.pressed]}>
              <Text style={styles.arrowText}>›</Text>
            </Pressable>
          </View>

          <View style={{ alignItems: 'center', transform: [{ translateY: isVerySmall ? -8 : -10 }] }}>
            <Pressable
              disabled={isAnimating}
              onPress={startQuizWithRocket}
              style={({ pressed }) => [styles.startBtn, pressed && !isAnimating && styles.pressed, isAnimating && styles.disabled]}
            >
              <Text style={[styles.startText, { fontSize: isVerySmall ? 13.5 : 14 }]}>Start</Text>
            </Pressable>

            <Text style={[styles.subHint, { fontSize: isVerySmall ? 11 : 12 }]}>{selected.toUpperCase()} • 10 Questions</Text>
          </View>
        </View>
      )}

      {mode === 'quiz' && (
        <View
          style={{
            flex: 1,
            marginTop: (isVerySmall ? 52 : 60) + androidTopDown,
            paddingBottom: Math.max(14, bottomInsetAndroid),
          }}
        >
          <View style={{ paddingTop: isVerySmall ? 14 : 22, alignItems: 'center' }}>
            <Image source={IMG[selected]} style={{ width: planetSizeQuiz, height: planetSizeQuiz, resizeMode: 'contain' }} />
          </View>

          <View
            style={[
              styles.panel,
              {
                marginHorizontal: sidePad,
                marginTop: isVerySmall ? 12 : 18,
                padding: isVerySmall ? 13 : 16,
              },
            ]}
          >
            <Text style={[styles.qText, { fontSize: qFont }]}>{current.q}</Text>

            <View style={{ height: isVerySmall ? 10 : 12 }} />

            {current.a.map((text, i) => {
              const ii = i as 0 | 1 | 2;
              return (
                <Pressable
                  key={i}
                  disabled={isAnimating}
                  onPress={() => onPick(ii)}
                  style={({ pressed }) => [
                    answerStyle(ii),
                    { height: answerH },
                    pressed && !locked && !isAnimating && styles.answerPressed,
                  ]}
                >
                  <Text style={[styles.answerText, { fontSize: ansFont }]}>{text}</Text>
                </Pressable>
              );
            })}

            <Text style={[styles.livesHint, { fontSize: isVerySmall ? 10.5 : 11 }]}>
              Question {idx + 1}/{totalQ} • Lives: {lives}/3
            </Text>
          </View>

          <Modal visible={done} transparent animationType="fade">
            <View style={styles.overlay}>
              <View style={[styles.doneCard, { padding: isVerySmall ? 14 : 16 }]}>
                <Text style={[styles.doneTitle, { fontSize: isVerySmall ? 17 : 18 }]}>{win ? 'Well done!' : 'Mission failed'}</Text>
                <Text style={[styles.doneSub, { fontSize: isVerySmall ? 12.5 : 13 }]}>Stars collected:</Text>
                <Text style={[styles.doneStars, { fontSize: isVerySmall ? 17 : 18 }]}>x {stars}</Text>

                <View style={{ height: 12 }} />

                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <Pressable onPress={() => setMode('select')} style={({ pressed }) => [styles.smallBtn, pressed && styles.pressed]}>
                    <Text style={styles.smallBtnText}>Menu</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      resetQuiz();
                      setMode('quiz');
                    }}
                    style={({ pressed }) => [styles.smallBtn, pressed && styles.pressed]}
                  >
                    <Text style={styles.smallBtnText}>Restart</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>

          <Modal visible={exitAsk} transparent animationType="fade" onRequestClose={() => setExitAsk(false)}>
            <View style={styles.overlay}>
              <View style={[styles.exitCard, { padding: isVerySmall ? 12 : 14 }]}>
                <Text style={[styles.exitTitle, { fontSize: isVerySmall ? 12 : 13 }]}>
                  Are you sure you want to{'\n'}end your mission?
                </Text>

                <View style={{ height: 12 }} />

                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <Pressable
                    onPress={() => {
                      setExitAsk(false);
                      setMode('select');
                    }}
                    style={({ pressed }) => [styles.exitBtn, styles.exitRed, pressed && styles.pressed]}
                  >
                    <Text style={styles.exitBtnText}>Yes</Text>
                  </Pressable>

                  <Pressable onPress={() => setExitAsk(false)} style={({ pressed }) => [styles.exitBtn, styles.exitGreen, pressed && styles.pressed]}>
                    <Text style={styles.exitBtnText}>No</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      )}

      {isAnimating && (
        <Animated.View style={[styles.overlayAnim, { opacity: overlayA }]} pointerEvents="none">
          <Animated.Image
            source={ROCKET_IMG}
            style={[
              styles.rocket,
              {
                width: rocketSize,
                height: rocketSize,
                left: rocketLeft,
                transform: [{ translateY: rocketY }],
              },
            ]}
          />
        </Animated.View>
      )}
    </ImageBackground>
  );
}

const PURPLE = '#5A18E6';
const YELLOW = '#FFC83D';

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#000' },
  safe: { backgroundColor: 'transparent' },

  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  backBtn: {
    width: 44,
    height: 34,
    borderRadius: 12,
    backgroundColor: YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { color: '#2B135F', fontSize: 22, fontWeight: '900', marginTop: -2 },

  pill: {
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: YELLOW,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  pillStar: { color: '#fff', fontWeight: '900', fontSize: 14 },
  pillText: { color: '#fff', fontWeight: '900', fontSize: 14 },

  arrowBtnLeft: {
    position: 'absolute',
    left: 0,
    top: '45%',
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,200,61,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  arrowBtnRight: {
    position: 'absolute',
    right: 0,
    top: '45%',
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,200,61,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  arrowText: { color: '#2B135F', fontSize: 26, fontWeight: '900', marginTop: -2 },

  startBtn: {
    width: 220,
    height: 46,
    borderRadius: 999,
    backgroundColor: YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startText: { color: '#fff', fontWeight: '900' },
  subHint: { marginTop: 10, color: '#fff', opacity: 0.8, fontWeight: '800', textAlign: 'center' },

  panel: {
    borderRadius: 16,
    backgroundColor: PURPLE,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  qText: { color: '#fff', fontWeight: '900', textAlign: 'center', lineHeight: 18 },

  answer: {
    borderRadius: 999,
    backgroundColor: YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingHorizontal: 14,
  },
  answerSelected: { opacity: 0.95, transform: [{ scale: 0.99 }] },
  answerPressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
  answerText: { color: '#fff', fontWeight: '900' },
  answerCorrect: { backgroundColor: '#32D74B' },
  answerWrong: { backgroundColor: '#FF3B30' },
  answerDim: { opacity: 0.35 },

  livesHint: { marginTop: 12, color: '#fff', opacity: 0.75, fontWeight: '800', textAlign: 'center' },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  doneCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 16,
    backgroundColor: PURPLE,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
  },
  doneTitle: { color: '#fff', fontWeight: '900' },
  doneSub: { marginTop: 8, color: '#fff', opacity: 0.85, fontWeight: '800' },
  doneStars: { marginTop: 6, color: '#fff', fontWeight: '900' },

  smallBtn: {
    flex: 1,
    height: 32,
    borderRadius: 999,
    backgroundColor: YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallBtnText: { color: '#fff', fontWeight: '900' },

  exitCard: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 16,
    backgroundColor: '#0B0B0B',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
  },
  exitTitle: { color: '#fff', fontWeight: '900', textAlign: 'center', lineHeight: 18 },
  exitBtn: { flex: 1, height: 30, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  exitRed: { backgroundColor: '#FF3B30' },
  exitGreen: { backgroundColor: '#32D74B' },
  exitBtnText: { color: '#fff', fontWeight: '900' },

  overlayAnim: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.18)',
    zIndex: 9999,
    elevation: 50,
  },
  rocket: { position: 'absolute', bottom: 0, resizeMode: 'contain' },

  pressed: { opacity: 0.88, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.65 },
});
