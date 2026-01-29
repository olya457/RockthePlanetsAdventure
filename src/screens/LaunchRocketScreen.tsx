import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Pressable,
  Platform,
  Animated,
  Easing,
  Modal,
  useWindowDimensions,
  LayoutRectangle,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'LaunchRocket'>;

const BG = require('../assets/background2.png');

const ROCKETS = {
  nova: require('../assets/rocket_1.png'),
  stellar: require('../assets/rocket_2.png'),
  cosmic: require('../assets/rocket_3.png'),
  galaxy: require('../assets/rocket_4.png'),
} as const;
type RocketId = keyof typeof ROCKETS;

const PLANETS = [
  require('../assets/planet_mercury.png'),
  require('../assets/planet_venus.png'),
  require('../assets/planet_earth.png'),
  require('../assets/planet_mars.png'),
  require('../assets/planet_jupiter.png'),
  require('../assets/planet_saturn.png'),
  require('../assets/planet_uranus.png'),
  require('../assets/planet_neptune.png'),
] as const;
type PlanetSprite = (typeof PLANETS)[number];

type GameMode = 'pick' | 'play' | 'roundWin' | 'roundLose' | 'gameWin';

type FallingPlanet = {
  id: string;
  sprite: PlanetSprite;
  col: number;
  y: number;
  size: number;
  speed: number;
};

const PURPLE = '#5A18E6';
const YELLOW = '#FFC83D';

const COLS = 5;
const ROUND_SECONDS = 30;
const TOTAL_ROUNDS = 10;

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const randInt = (min: number, max: number) => Math.floor(min + Math.random() * (max - min + 1));
const pickOne = <T,>(arr: readonly T[]) => arr[randInt(0, arr.length - 1)];

export default function LaunchRocketScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { width: W, height: H } = useWindowDimensions();

  const isSmall = H < 740;
  const isVerySmall = H < 680;

  const sidePad = isVerySmall ? 14 : 18;

  const statusH = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0;
  const androidTopExtra = Platform.OS === 'android' ? 10 : 0;

  const topBarH = 34;
  const topBarPadV = 10;
  const headerH = statusH + androidTopExtra + topBarH + topBarPadV;

  const hudH = isVerySmall ? 44 : 48;
  const hudTopGap = isVerySmall ? 8 : 10;

  const controlsH = isVerySmall ? 84 : 96;
  const controlsBottomPad =
    Platform.OS === 'android' ? 20 : Math.max(14, insets.bottom + 10);

  const boardTopGap = isVerySmall ? 8 : 10;

  const availableForBoard =
    H - (insets.top + headerH) - (hudTopGap + hudH) - boardTopGap - (controlsH + controlsBottomPad) - 8;

  const boardH = Math.max(230, Math.floor(availableForBoard));
  const boardW = W - sidePad * 2;
  const cellW = Math.floor(boardW / COLS);

  const rocketW = Math.min(isVerySmall ? 54 : 60, cellW - 10);
  const rocketH = rocketW * 1.25;

  const planetBase = isVerySmall ? 34 : isSmall ? 38 : 42;

  const colCenterX = (col: number) => col * cellW + cellW / 2;

  const rocketY = Math.max(10, boardH - rocketH - (isVerySmall ? 12 : 16));

  const [mode, setMode] = useState<GameMode>('pick');
  const [selectedRocket, setSelectedRocket] = useState<RocketId>('nova');
  const [rocketCol, setRocketCol] = useState<number>(Math.floor(COLS / 2));

  const [round, setRound] = useState<number>(1);
  const [timeLeft, setTimeLeft] = useState<number>(ROUND_SECONDS);
  const [lives, setLives] = useState<number>(3);
  const [planets, setPlanets] = useState<FallingPlanet[]>([]);

  const planetsRef = useRef<FallingPlanet[]>([]);
  const rocketColRef = useRef<number>(rocketCol);
  const livesRef = useRef<number>(3);
  const timeLeftRef = useRef<number>(ROUND_SECONDS);
  const roundRef = useRef<number>(1);

  useEffect(() => {
    rocketColRef.current = rocketCol;
  }, [rocketCol]);

  useEffect(() => {
    planetsRef.current = planets;
  }, [planets]);

  useEffect(() => {
    livesRef.current = lives;
  }, [lives]);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  useEffect(() => {
    roundRef.current = round;
  }, [round]);

  const [pickCardLayout, setPickCardLayout] = useState<LayoutRectangle | null>(null);

  const twinkle = useRef(new Animated.Value(0)).current;
  const twinkleOpacity = twinkle.interpolate({ inputRange: [0, 1], outputRange: [0, 0.5] });

  const runTwinkle = () => {
    twinkle.setValue(0);
    Animated.sequence([
      Animated.timing(twinkle, { toValue: 1, duration: 220, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(twinkle, { toValue: 0, duration: 260, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      Animated.timing(twinkle, { toValue: 1, duration: 220, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(twinkle, { toValue: 0, duration: 300, easing: Easing.in(Easing.quad), useNativeDriver: true }),
    ]).start();
  };

  const rocketAnim = useRef(new Animated.Value(0)).current;
  const [rocketOverlayVisible, setRocketOverlayVisible] = useState(false);
  const overlayFlyDistance = Math.min(420, H * 0.55);

  const rocketOverlayTranslateY = rocketAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -overlayFlyDistance],
  });

  const rocketOverlayScale = rocketAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.92],
  });

  const rocketOverlayOpacity = rocketAnim.interpolate({
    inputRange: [0, 0.12, 0.9, 1],
    outputRange: [0, 1, 1, 0],
  });

  const runRocketLaunch = (onDone: () => void) => {
    setRocketOverlayVisible(true);
    rocketAnim.setValue(0);

    Animated.timing(rocketAnim, {
      toValue: 1,
      duration: 1050,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setRocketOverlayVisible(false);
      rocketAnim.setValue(0);
      onDone();
    });
  };

  const getRoundParams = (r: number) => {
    const speed = 130 + (r - 1) * 20;
    const spawnEvery = Math.max(0.42, 0.95 - (r - 1) * 0.05);
    return { speed, spawnEvery };
  };

  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number>(0);
  const spawnAccRef = useRef<number>(0);
  const secondAccRef = useRef<number>(0);
  const runningRef = useRef<boolean>(false);

  const stopLoop = () => {
    runningRef.current = false;
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopLoop();
  }, []);

  const endRoundLose = () => {
    stopLoop();
    setMode('roundLose');
  };

  const endRoundWin = () => {
    stopLoop();
    if (roundRef.current >= TOTAL_ROUNDS) setMode('gameWin');
    else setMode('roundWin');
  };

  const resetRoundState = (newRound: number) => {
    setRound(newRound);
    roundRef.current = newRound;

    setTimeLeft(ROUND_SECONDS);
    timeLeftRef.current = ROUND_SECONDS;

    setLives(3);
    livesRef.current = 3;

    setPlanets([]);
    planetsRef.current = [];

    const mid = Math.floor(COLS / 2);
    setRocketCol(mid);
    rocketColRef.current = mid;

    spawnAccRef.current = 0;
    secondAccRef.current = 0;
    lastTsRef.current = 0;
  };

  const startLoop = () => {
    stopLoop();
    runningRef.current = true;
    lastTsRef.current = 0;
    spawnAccRef.current = 0;
    secondAccRef.current = 0;

    const tick = (ts: number) => {
      if (!runningRef.current) return;

      if (!lastTsRef.current) lastTsRef.current = ts;
      const dtMs = ts - lastTsRef.current;
      lastTsRef.current = ts;
      const dt = Math.min(0.05, dtMs / 1000);

      const { speed, spawnEvery } = getRoundParams(roundRef.current);

      secondAccRef.current += dt;
      if (secondAccRef.current >= 1) {
        secondAccRef.current -= 1;
        const next = timeLeftRef.current - 1;
        timeLeftRef.current = next;
        setTimeLeft(next);
        if (next <= 0) {
          endRoundWin();
          return;
        }
      }

      spawnAccRef.current += dt;
      if (spawnAccRef.current >= spawnEvery) {
        spawnAccRef.current -= spawnEvery;

        const col = randInt(0, COLS - 1);
        const size = planetBase + randInt(-4, 6);

        const p: FallingPlanet = {
          id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
          sprite: pickOne(PLANETS),
          col,
          y: -size - randInt(10, 50),
          size,
          speed: speed + randInt(-10, 16),
        };

        const nextArr = [...planetsRef.current, p];
        planetsRef.current = nextArr;
        setPlanets(nextArr);
      }

      const rocketC = rocketColRef.current;
      const rocketX = colCenterX(rocketC) - rocketW / 2;
      const rocketRect = { x: rocketX, y: rocketY, w: rocketW, h: rocketH };

      let didHit = 0;
      const nextPlanets: FallingPlanet[] = [];

      for (const p of planetsRef.current) {
        const ny = p.y + p.speed * dt;

        if (ny > boardH + 180) continue;

        const planetX = colCenterX(p.col) - p.size / 2;
        const planetY = ny;

        const overlap =
          planetX < rocketRect.x + rocketRect.w &&
          planetX + p.size > rocketRect.x &&
          planetY < rocketRect.y + rocketRect.h &&
          planetY + p.size > rocketRect.y;

        if (overlap) {
          didHit += 1;
          continue;
        }

        nextPlanets.push({ ...p, y: ny });
      }

      if (didHit > 0) {
        const nextLives = Math.max(0, livesRef.current - didHit);
        livesRef.current = nextLives;
        setLives(nextLives);

        planetsRef.current = nextPlanets;
        setPlanets(nextPlanets);

        if (nextLives <= 0) {
          endRoundLose();
          return;
        }
      } else {
        planetsRef.current = nextPlanets;
        setPlanets(nextPlanets);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  const startGame = () => {
    resetRoundState(1);
    runRocketLaunch(() => {
      setMode('play');
      runTwinkle();
      startLoop();
    });
  };

  const goToNextRound = () => {
    const next = roundRef.current + 1;
    if (next > TOTAL_ROUNDS) {
      setMode('gameWin');
      return;
    }
    resetRoundState(next);
    setMode('play');
    runTwinkle();
    startLoop();
  };

  const retryRound = () => {
    resetRoundState(roundRef.current);
    setMode('play');
    runTwinkle();
    startLoop();
  };

  const goLeft = () => setRocketCol((c) => clamp(c - 1, 0, COLS - 1));
  const goRight = () => setRocketCol((c) => clamp(c + 1, 0, COLS - 1));

  const rocketX = colCenterX(rocketCol) - rocketW / 2;

  const lifeStar = (on: boolean) => <Text style={[styles.lifeStar, !on && styles.lifeStarOff]}>★</Text>;

  const overlayLeft = pickCardLayout ? pickCardLayout.x + pickCardLayout.width / 2 - 80 : W / 2 - 80;
  const overlayTop = pickCardLayout ? pickCardLayout.y - (isVerySmall ? 72 : 84) : Math.max(insets.top + 90, 140);

  return (
    <ImageBackground source={BG} resizeMode="cover" style={styles.bg}>
      <SafeAreaView style={styles.safe} edges={['left', 'right']}>
        <View style={[styles.topBar, { paddingHorizontal: sidePad, paddingTop: statusH + androidTopExtra }]}>
          <Pressable
            onPress={() => {
              stopLoop();
              navigation.goBack();
            }}
            style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
          >
            <Text style={styles.backIcon}>‹</Text>
          </Pressable>

          <View style={styles.titlePill}>
            <Text style={styles.titlePillText}>Launch Rocket</Text>
          </View>

          <View style={styles.rightHud}>
            {lifeStar(lives >= 1)}
            {lifeStar(lives >= 2)}
            {lifeStar(lives >= 3)}
          </View>
        </View>
      </SafeAreaView>

      {rocketOverlayVisible && (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <Animated.Image
            source={ROCKETS[selectedRocket]}
            style={[
              styles.rocketOverlayImg,
              {
                position: 'absolute',
                left: overlayLeft,
                top: overlayTop,
                opacity: rocketOverlayOpacity,
                transform: [{ translateY: rocketOverlayTranslateY }, { scale: rocketOverlayScale }],
              },
            ]}
          />
        </View>
      )}

      <Animated.View pointerEvents="none" style={[styles.twinkle, { opacity: twinkleOpacity }]} />

      {mode === 'pick' && (
        <View style={{ flex: 1 }}>
          <View style={{ height: isVerySmall ? 18 : 30 }} />

          <View onLayout={(e) => setPickCardLayout(e.nativeEvent.layout)} style={[styles.pickCard, { marginHorizontal: sidePad }]}>
            <Text style={[styles.h1, { fontSize: isVerySmall ? 20 : 22 }]}>Choose your rocket</Text>

            <View style={{ height: isVerySmall ? 12 : 14 }} />

            <View style={styles.rocketGrid}>
              {(['nova', 'stellar', 'cosmic', 'galaxy'] as const).map((id) => {
                const selected = id === selectedRocket;
                return (
                  <Pressable
                    key={id}
                    onPress={() => setSelectedRocket(id)}
                    style={({ pressed }) => [
                      styles.rocketTile,
                      isVerySmall && styles.rocketTileSmall,
                      selected && styles.rocketTileSelected,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Image source={ROCKETS[id]} style={[styles.rocketTileImg, isVerySmall && styles.rocketTileImgSmall]} />
                    <Text style={[styles.rocketTileText, isVerySmall && styles.rocketTileTextSmall]}>
                      {id === 'nova' ? 'Nova One' : id === 'stellar' ? 'Stellar X' : id === 'cosmic' ? 'Cosmic V' : 'Galaxy Prime'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={{ height: isVerySmall ? 12 : 14 }} />

            <Text style={[styles.helpText, isVerySmall && styles.helpTextSmall]}>
              Avoid planets.{"\n"}If a planet hits your rocket — you lose a life.{"\n"}Survive 30 seconds to win the round.
            </Text>
          </View>

          <View style={{ flex: 1 }} />

          <View style={{ paddingHorizontal: sidePad, paddingBottom: Math.max(16, insets.bottom + 14) + (isVerySmall ? 26 : 40) }}>
            <Pressable onPress={startGame} style={({ pressed }) => [styles.bigBtn, pressed && styles.pressed]}>
              <Text style={styles.bigBtnText}>Start</Text>
            </Pressable>
          </View>
        </View>
      )}

      {mode === 'play' && (
        <View style={{ flex: 1 }}>
          <View style={{ height: hudTopGap }} />

          <View style={[styles.hud, { marginHorizontal: sidePad, height: hudH }]}>
            <View style={styles.hudPill}>
              <Text style={styles.hudLabel}>Round</Text>
              <Text style={styles.hudValue}>
                {round}/{TOTAL_ROUNDS}
              </Text>
            </View>

            <View style={styles.hudPill}>
              <Text style={styles.hudLabel}>Time</Text>
              <Text style={styles.hudValue}>{timeLeft}s</Text>
            </View>

            <View style={styles.hudPill}>
              <Text style={styles.hudLabel}>Lives</Text>
              <Text style={styles.hudValue}>{lives}/3</Text>
            </View>
          </View>

          <View style={{ height: boardTopGap }} />

          <View style={[styles.board, { marginHorizontal: sidePad, width: boardW, height: boardH }]}>
            {planets.map((p) => {
              const x = colCenterX(p.col) - p.size / 2;
              return (
                <Image
                  key={p.id}
                  source={p.sprite}
                  style={{ position: 'absolute', left: x, top: p.y, width: p.size, height: p.size, resizeMode: 'contain' }}
                />
              );
            })}

            <Image
              source={ROCKETS[selectedRocket]}
              style={{
                position: 'absolute',
                left: rocketX,
                top: rocketY,
                width: rocketW,
                height: rocketH,
                resizeMode: 'contain',
              }}
            />

            <View style={styles.guides}>
              {Array.from({ length: COLS }).map((_, i) => (
                <View
                  key={i}
                  style={{
                    width: 1,
                    height: '100%',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    marginLeft: i === 0 ? 0 : cellW - 1,
                  }}
                />
              ))}
            </View>
          </View>

          <View style={{ flex: 1 }} />

          <View style={[styles.controls, { paddingHorizontal: sidePad, paddingBottom: controlsBottomPad, height: controlsH + controlsBottomPad }]}>
            <Pressable onPress={goLeft} style={({ pressed }) => [styles.ctrlBtn, pressed && styles.pressed]}>
              <Text style={styles.ctrlIcon}>‹</Text>
            </Pressable>

            <View style={styles.centerInfo}>
              <Text style={styles.centerInfoText}>Avoid planets</Text>
              <Text style={styles.centerInfoSub}>Survive the timer</Text>
            </View>

            <Pressable onPress={goRight} style={({ pressed }) => [styles.ctrlBtn, pressed && styles.pressed]}>
              <Text style={styles.ctrlIcon}>›</Text>
            </Pressable>
          </View>
        </View>
      )}

      <Modal visible={mode === 'roundWin'} transparent animationType="fade" onRequestClose={() => {}}>
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Round {round} complete</Text>
            <Text style={styles.modalLine}>You survived the mission.</Text>

            <View style={{ height: 14 }} />

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Pressable
                onPress={() => {
                  stopLoop();
                  setMode('pick');
                }}
                style={({ pressed }) => [styles.smallBtn, styles.smallBtnDark, pressed && styles.pressed]}
              >
                <Text style={styles.smallBtnText}>Menu</Text>
              </Pressable>

              <Pressable onPress={goToNextRound} style={({ pressed }) => [styles.smallBtn, pressed && styles.pressed]}>
                <Text style={styles.smallBtnText}>Next round</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={mode === 'roundLose'} transparent animationType="fade" onRequestClose={() => {}}>
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Mission failed</Text>
            <Text style={styles.modalLine}>You ran out of lives.</Text>

            <View style={{ height: 14 }} />

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Pressable
                onPress={() => {
                  stopLoop();
                  setMode('pick');
                }}
                style={({ pressed }) => [styles.smallBtn, styles.smallBtnDark, pressed && styles.pressed]}
              >
                <Text style={styles.smallBtnText}>Menu</Text>
              </Pressable>

              <Pressable onPress={retryRound} style={({ pressed }) => [styles.smallBtn, pressed && styles.pressed]}>
                <Text style={styles.smallBtnText}>Retry</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={mode === 'gameWin'} transparent animationType="fade" onRequestClose={() => {}}>
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>You win!</Text>
            <Text style={styles.modalLine}>All rounds completed.</Text>

            <View style={{ height: 14 }} />

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Pressable
                onPress={() => {
                  stopLoop();
                  setMode('pick');
                }}
                style={({ pressed }) => [styles.smallBtn, styles.smallBtnDark, pressed && styles.pressed]}
              >
                <Text style={styles.smallBtnText}>Menu</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  stopLoop();
                  resetRoundState(1);
                  startGame();
                }}
                style={({ pressed }) => [styles.smallBtn, pressed && styles.pressed]}
              >
                <Text style={styles.smallBtnText}>Restart</Text>
              </Pressable>
            </View>
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

  rightHud: { width: 88, flexDirection: 'row', justifyContent: 'flex-end', gap: 6, alignItems: 'center' },
  lifeStar: { color: '#fff', fontWeight: '900', fontSize: 14 },
  lifeStarOff: { opacity: 0.25 },

  pickCard: {
    borderRadius: 22,
    backgroundColor: PURPLE,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.28,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  h1: { color: '#fff', fontWeight: '900', textAlign: 'center' },

  helpText: { color: '#fff', opacity: 0.85, fontWeight: '800', textAlign: 'center', lineHeight: 18, fontSize: 13 },
  helpTextSmall: { fontSize: 12, lineHeight: 16 },

  rocketGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },

  rocketTile: {
    width: '48%',
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rocketTileSmall: { borderRadius: 16, paddingVertical: 14 },
  rocketTileSelected: { borderColor: 'rgba(255,200,61,0.95)', backgroundColor: 'rgba(255,200,61,0.12)' },

  rocketTileImg: { width: 70, height: 70, resizeMode: 'contain' },
  rocketTileImgSmall: { width: 64, height: 64 },

  rocketTileText: { marginTop: 10, color: '#fff', fontWeight: '900', fontSize: 14 },
  rocketTileTextSmall: { fontSize: 13, marginTop: 8 },

  bigBtn: { height: 52, borderRadius: 999, backgroundColor: YELLOW, alignItems: 'center', justifyContent: 'center' },
  bigBtnText: { color: '#fff', fontWeight: '900', fontSize: 16 },

  rocketOverlayImg: { width: 160, height: 160, resizeMode: 'contain' },
  twinkle: { ...StyleSheet.absoluteFillObject, backgroundColor: '#FFFFFF' },

  hud: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  hudPill: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: PURPLE,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hudLabel: { color: '#fff', opacity: 0.85, fontWeight: '800', fontSize: 11 },
  hudValue: { marginTop: 2, color: '#fff', fontWeight: '900', fontSize: 14 },

  board: {
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    overflow: 'hidden',
  },
  guides: { ...StyleSheet.absoluteFillObject, flexDirection: 'row', opacity: 0.8 },

  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  ctrlBtn: {
    width: 64,
    height: 54,
    borderRadius: 18,
    backgroundColor: YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  ctrlIcon: { color: '#2B135F', fontSize: 28, fontWeight: '900', marginTop: -2 },

  centerInfo: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: PURPLE,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerInfoText: { color: '#fff', fontWeight: '900', fontSize: 13 },
  centerInfoSub: { marginTop: 3, color: '#fff', opacity: 0.85, fontWeight: '800', fontSize: 12 },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 18,
    backgroundColor: PURPLE,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
  },
  modalTitle: { color: '#fff', fontWeight: '900', fontSize: 18, textAlign: 'center' },
  modalLine: { color: '#fff', opacity: 0.9, fontWeight: '800', marginTop: 8, textAlign: 'center' },

  smallBtn: { flex: 1, height: 34, borderRadius: 999, backgroundColor: YELLOW, alignItems: 'center', justifyContent: 'center' },
  smallBtnDark: { backgroundColor: 'rgba(0,0,0,0.22)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)' },
  smallBtnText: { color: '#fff', fontWeight: '900' },
});
