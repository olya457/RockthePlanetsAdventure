import React, { useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ImageBackground,
  Image,
  useWindowDimensions,
  Animated,
  Easing,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Menu'>;

const BG = require('../assets/background2.png');
const BOTTOM_LOGO = require('../assets/logo.png');

const ICON_ROCKET = require('../assets/icon_rocket.png');
const ICON_STAR = require('../assets/icon_star.png');
const ICON_PLANET = require('../assets/icon_planet.png');
const ICON_GEAR = require('../assets/icon_gear.png');
const ICON_CONSTELLATION = require('../assets/icon_constellation.png');

const ROCKET_ANIM = require('../assets/rocket_1.png');

function MenuButton({
  title,
  icon,
  onPress,
  width,
  height,
  fontSize,
  iconSize,
  disabled,
}: {
  title: string;
  icon: any;
  onPress: () => void;
  width: number;
  height: number;
  fontSize: number;
  iconSize: number;
  disabled?: boolean;
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        { width, height },
        pressed && !disabled && styles.btnPressed,
        disabled && styles.btnDisabled,
      ]}
    >
      <Text style={[styles.btnText, { fontSize, lineHeight: Math.round(fontSize * 1.1) }]}>
        {title}
      </Text>
      <Image source={icon} style={[styles.btnIcon, { width: iconSize, height: iconSize }]} />
    </Pressable>
  );
}

export default function MenuScreen({ navigation }: Props) {
  const { height: H, width: W } = useWindowDimensions();

  const isVerySmall = H < 680;
  const isSmall = H < 740;

  const btnW = isVerySmall ? 220 : isSmall ? 235 : 250;
  const btnH = isVerySmall ? 66 : isSmall ? 72 : 78;
  const btnFont = isVerySmall ? 15 : isSmall ? 16 : 18;
  const iconSize = isVerySmall ? 22 : isSmall ? 24 : 26;

  const gap = isVerySmall ? 10 : isSmall ? 12 : 14;

  const BUTTONS_DOWN = isVerySmall ? 44 : isSmall ? 54 : 60;
  const LOGO_UP = isVerySmall ? 44 : isSmall ? 54 : 60;

  const topPadding = (isVerySmall ? 46 : isSmall ? 56 : 72) + BUTTONS_DOWN;

  const logoW = useMemo(() => {
    const base = isVerySmall ? 230 : isSmall ? 270 : 320;
    return Math.min(base, Math.round(W * 0.78));
  }, [W, isSmall, isVerySmall]);

  const logoH = useMemo(() => {
    const base = isVerySmall ? 160 : isSmall ? 195 : 260;
    return Math.min(base, Math.round(H * 0.26));
  }, [H, isSmall, isVerySmall]);

  const [isAnimating, setIsAnimating] = useState(false);
  const pendingRoute = useRef<keyof RootStackParamList | null>(null);

  const rocketY = useRef(new Animated.Value(H + 220)).current;
  const overlayA = useRef(new Animated.Value(0)).current;

  const runTransition = (route: keyof RootStackParamList) => {
    if (isAnimating) return;

    pendingRoute.current = route;
    setIsAnimating(true);

    rocketY.setValue(H + 220);
    overlayA.setValue(0);

    Animated.parallel([
      Animated.timing(overlayA, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.timing(rocketY, {
        toValue: -Math.round(H * 0.55),
        duration: 3000,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.cubic),
      }),
    ]).start(() => {
      const r = pendingRoute.current;
      pendingRoute.current = null;
      setIsAnimating(false);
      overlayA.setValue(0);
      if (r) navigation.navigate(r as any);
    });
  };

  return (
    <ImageBackground source={BG} resizeMode="cover" style={styles.bg}>
      <View style={[styles.content, { paddingTop: topPadding }]}>
        <View style={[styles.list, { gap }]}>
          <MenuButton
            title={'Rocket\nMission'}
            icon={ICON_ROCKET}
            onPress={() => runTransition('LaunchRocket')}
            width={btnW}
            height={btnH}
            fontSize={btnFont}
            iconSize={iconSize}
            disabled={isAnimating}
          />

          <MenuButton
            title={'Planet\nQuiz'}
            icon={ICON_STAR}
            onPress={() => runTransition('StarExchange')}
            width={btnW}
            height={btnH}
            fontSize={btnFont}
            iconSize={iconSize}
            disabled={isAnimating}
          />

          <MenuButton
            title={'Planet\nGuide'}
            icon={ICON_PLANET}
            onPress={() => runTransition('PlanetGuide')}
            width={btnW}
            height={btnH}
            fontSize={btnFont}
            iconSize={iconSize}
            disabled={isAnimating}
          />

          <MenuButton
            title={'Star\nMap'}
            icon={ICON_CONSTELLATION}
            onPress={() => runTransition('Constellations')}
            width={btnW}
            height={btnH}
            fontSize={btnFont}
            iconSize={iconSize}
            disabled={isAnimating}
          />

          <MenuButton
            title={'Mission\nControl'}
            icon={ICON_GEAR}
            onPress={() => runTransition('ControlCenter')}
            width={btnW}
            height={btnH}
            fontSize={btnFont}
            iconSize={iconSize}
            disabled={isAnimating}
          />
        </View>

        <Image
          source={BOTTOM_LOGO}
          style={[
            styles.bottomLogo,
            {
              width: logoW,
              height: logoH,
              marginBottom: LOGO_UP,
            },
          ]}
        />
      </View>

      {isAnimating && (
        <Animated.View style={[styles.overlay, { opacity: overlayA }]}>
          <Animated.Image
            source={ROCKET_ANIM}
            style={[
              styles.rocket,
              {
                transform: [{ translateY: rocketY }],
              },
            ]}
          />
        </Animated.View>
      )}
    </ImageBackground>
  );
}

const YELLOW = '#FFC83D';
const PURPLE = '#4B1FB8';

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#000' },

  content: {
    flex: 1,
    paddingHorizontal: 22,
    paddingBottom: 14,
    alignItems: 'center',
  },

  list: {
    width: '100%',
    alignItems: 'center',
  },

  btn: {
    borderRadius: 14,
    backgroundColor: YELLOW,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },

  btnPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.92,
  },

  btnDisabled: {
    opacity: 0.6,
  },

  btnText: {
    color: '#fff',
    fontWeight: '900',
    textAlign: 'center',
  },

  btnIcon: {
    position: 'absolute',
    right: 18,
    resizeMode: 'contain',
    tintColor: PURPLE,
  },

  bottomLogo: {
    marginTop: 'auto',
    resizeMode: 'contain',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.18)',
  },

  rocket: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
    marginTop: 0,
  },
});
