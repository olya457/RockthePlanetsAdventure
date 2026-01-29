import React, { useEffect, useMemo } from 'react';
import { Image, ImageBackground, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { WebView } from 'react-native-webview';

type Props = NativeStackScreenProps<RootStackParamList, 'Loader'>;

const BG = require('../assets/background.png');
const LOGO = require('../assets/logo.png');

export default function LoaderScreen({ navigation }: Props) {
  useEffect(() => {
    const t = setTimeout(() => {
      navigation.replace('Onboard');
    }, 3000);

    return () => clearTimeout(t);
  }, [navigation]);

  const html = useMemo(
    () => `
<!doctype html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <style>
    html, body {
      margin: 0;
      padding: 0;
      background: transparent;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    .wrap {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
    }

    .ball {
      --size: 18px;
      --timing: 0.7s;
      --displace: 64px;
      width: var(--size);
      height: var(--size);
      border-radius: 999px;
      background: #4284f3;
      animation: animation321 var(--timing) infinite alternate
        cubic-bezier(0.68, -0.55, 0.265, 1.55);
      will-change: transform, background;
    }

    @keyframes animation321 {
      0% {
        background: #4284f3;
        transform: translateX(calc(var(--displace) * -1));
      }
      100% {
        background: #ea4335;
        transform: translateX(var(--displace));
      }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="ball"></div>
  </div>
</body>
</html>
`,
    []
  );

  return (
    <ImageBackground source={BG} resizeMode="cover" style={styles.bg}>
      <View style={styles.center}>
        <Image source={LOGO} style={styles.logo} />
      </View>

      <View style={styles.webWrap}>
        <WebView
          originWhitelist={['*']}
          source={{ html }}
          style={styles.web}
          containerStyle={styles.web}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          bounces={false}
          javaScriptEnabled
          domStorageEnabled
          automaticallyAdjustContentInsets={false}
          setBuiltInZoomControls={false}
          backgroundColor="transparent"
    
          androidLayerType="hardware"
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#000',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  logo: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
  },

  webWrap: {
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 18,
  },

  web: {
    width: 220,
    height: 60,
    backgroundColor: 'transparent',
  },
});
