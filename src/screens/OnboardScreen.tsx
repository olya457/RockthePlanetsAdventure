import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Pressable,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboard'>;

const BG = require('../assets/background.png');
const OB1 = require('../assets/onboard1.png');
const OB2 = require('../assets/onboard2.png');
const OB3 = require('../assets/onboard3.png');
const OB4 = require('../assets/onboard4.png');

type Slide = {
  key: string;
  image: any;
  title: string;
  desc: string;
  button: string;
};

export default function OnboardScreen({ navigation }: Props) {
  const { width: W, height: H } = useWindowDimensions();
  const listRef = useRef<FlatList<Slide>>(null);
  const [index, setIndex] = useState(0);

  const isSmall = H < 740;
  const isVerySmall = H < 680;

  const TOP_DOWN = 80; 
  const BOTTOM_UP = 70; 

  const slides: Slide[] = useMemo(
    () => [
      {
        key: '1',
        image: OB1,
        title: 'Explore the Planets',
        desc:
          'Start your journey across\nmysterious worlds. Each\nplanet hides new questions\nand discoveries.',
        button: 'Next',
      },
      {
        key: '2',
        image: OB2,
        title: 'Answer & Advance',
        desc:
          'Every planet has its own\nquiz. Pick the right answer,\nearn stars, and move to the\nnext challenge.',
        button: 'Next',
      },
      {
        key: '3',
        image: OB3,
        title: 'Focus Your Flight',
        desc:
          'Your attention and focus\nhelp guide the rocket\nthrough obstacles.\nStay sharp to fly further.',
        button: 'Next',
      },
      {
        key: '4',
        image: OB4,
        title: 'Learn and Explore',
        desc:
          'Discover facts about each\nplanet, read short articles,\nand enjoy a full cosmic\njourney from the start.',
        button: 'Launch',
      },
    ],
    []
  );

  const goNext = () => {
    if (index < slides.length - 1) {
      const next = index + 1;
      setIndex(next);
      listRef.current?.scrollToIndex({ index: next, animated: true });
    } else {
      navigation.replace('Menu');
    }
  };

  const renderItem = ({ item }: { item: Slide }) => {
    return (
      <View style={[styles.page, { width: W }]}>
    
        <View style={styles.topArea}>
          <Image
            source={item.image}
            style={[
              styles.hero,
              {
                height: isVerySmall ? 230 : isSmall ? 260 : 320,
                width: '88%',
                transform: [{ translateY: TOP_DOWN }], 
              },
            ]}
          />
        </View>

        <View style={[styles.bottomArea, { transform: [{ translateY: -BOTTOM_UP }] }]}>
          <View
            style={[
              styles.card,
              {
                paddingVertical: isVerySmall ? 12 : 16,
                paddingHorizontal: isVerySmall ? 12 : 14,
              },
            ]}
          >
            <Text style={[styles.cardTitle, { fontSize: isVerySmall ? 20 : 22 }]}>
              {item.title}
            </Text>
            <Text
              style={[
                styles.cardDesc,
                {
                  fontSize: isVerySmall ? 14 : 15.5,
                  lineHeight: isVerySmall ? 19 : 21,
                },
              ]}
            >
              {item.desc}
            </Text>
          </View>

          <Pressable
            onPress={goNext}
            style={({ pressed }) => [styles.primaryBtn, pressed && styles.primaryPressed]}
          >
            <Text style={[styles.primaryText, { fontSize: isVerySmall ? 15 : 16 }]}>
              {item.button}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <ImageBackground source={BG} resizeMode="cover" style={styles.bg}>
      <FlatList
        ref={listRef}
        data={slides}
        keyExtractor={(it) => it.key}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        scrollEnabled={false} 
        showsHorizontalScrollIndicator={false}
        bounces={false}
        getItemLayout={(_, i) => ({ length: W, offset: W * i, index: i })}
        extraData={index}
      />
    </ImageBackground>
  );
}

const PURPLE = '#5A18E6';
const YELLOW = '#FFC83D';

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#000' },

  page: {
    flex: 1,
    paddingHorizontal: 18,
  },

  topArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 46,
  },

  hero: {
    resizeMode: 'contain',
  },

  bottomArea: {
    paddingBottom: 22,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  card: {
    width: '100%',
    borderRadius: 14,
    backgroundColor: PURPLE,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  cardTitle: {
    color: '#fff',
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
  },

  cardDesc: {
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  primaryBtn: {
    marginTop: 14,
    height: 42,
    minWidth: 140,
    paddingHorizontal: 26,
    borderRadius: 999,
    backgroundColor: YELLOW,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryPressed: { transform: [{ scale: 0.985 }], opacity: 0.92 },

  primaryText: {
    color: '#fff',
    fontWeight: '900',
  },
});
