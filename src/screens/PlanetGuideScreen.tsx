import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Pressable,
  FlatList,
  Share,
  ScrollView,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'PlanetGuide'>;

const BG = require('../assets/background.png');

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

type PlanetItem = {
  id: PlanetId;
  title: string;
  unlocked: boolean;
};

type PlanetArticle = {
  title: string;
  text: string;
};

const ARTICLES: Record<PlanetId, PlanetArticle> = {
  mercury: {
    title: 'Mercury',
    text:
      `Mercury is the closest planet to the Sun and the smallest in the Solar System, with a diameter of just 4,879 km. Its surface is heavily cratered, resembling Earth’s Moon, and preserves the record of billions of years of meteorite impacts. Because of its proximity to the Sun, Mercury experiences extreme environmental conditions that make it challenging to observe and study.\n\n` +
      `Temperatures on Mercury swing dramatically. During the day, the surface can reach scorching highs of about 430°C (800°F), while at night it drops to –180°C (–290°F). These extreme fluctuations occur because Mercury lacks a substantial atmosphere capable of retaining heat.\n\n` +
      `The planet’s thin exosphere is composed mainly of atoms knocked off its surface by solar radiation. Sodium, potassium, calcium, and small traces of other elements drift in this fragile, constantly replenished cloud. Due to the weakness of this exosphere, no weather patterns, clouds, or winds form.\n\n` +
      `Mercury orbits the Sun in just 88 Earth days, but its rotation period is 59 Earth days. This leads to a unique phenomenon: one solar day on Mercury—from one sunrise to the next—lasts 176 Earth days, longer than its year.\n\n` +
      `Despite its small size, Mercury has a surprisingly strong but patchy magnetic field. Scientists believe this is due to a partially molten core that occupies a large portion of the planet’s interior. This structure also explains its unusually high density.\n\n` +
      `Mercury’s surface contains vast scarps and cliffs formed as the planet cooled and contracted, shrinking its radius. These features stretch for hundreds of kilometers and make its landscape one of the most dramatic among rocky planets.\n\n` +
      `Past missions like Mariner 10 and MESSENGER have provided crucial insights into Mercury’s geology and composition. The ongoing BepiColombo mission is expected to reveal even more about this mysterious world.`,
  },
  venus: {
    title: 'Venus',
    text:
      `Venus, the second planet from the Sun, is often called Earth’s “sister planet” due to their similar size and mass. Despite these similarities, Venus has developed into one of the most extreme environments in the Solar System. Thick clouds of sulfuric acid and a dense carbon-dioxide atmosphere create conditions hostile to life as we know it.\n\n` +
      `Surface temperatures on Venus reach an average of 470°C (880°F), hot enough to melt lead. This intense heat results from a runaway greenhouse effect, where heat from the Sun becomes trapped beneath the thick atmosphere, unable to escape back into space.\n\n` +
      `The planet’s surface is dominated by volcanic plains, highland regions, and massive lava flows. Radar mapping has revealed thousands of volcanoes, suggesting that Venus may still be geologically active today. Many surface features appear relatively young compared to other rocky worlds.\n\n` +
      `A remarkable characteristic of Venus is its slow and retrograde rotation. Venus spins backward compared to most planets, completing one rotation in 243 Earth days. Interestingly, its day is longer than its year, which lasts 225 Earth days.\n\n` +
      `Atmospheric pressure on Venus is about 92 times greater than Earth’s—equivalent to being nearly a kilometer underwater. This immense pressure makes surface exploration incredibly difficult, with probes surviving only a few hours before being crushed.\n\n` +
      `Although Venus lacks a global magnetic field, its dense atmosphere provides limited protection against solar radiation. However, the upper layers of the atmosphere gradually escape into space due to solar winds stripping away lighter elements.\n\n` +
      `Past missions such as Magellan, Venera, and Akatsuki have helped uncover Venus’s mysteries. Future missions like VERITAS and EnVision aim to determine whether the planet ever had oceans or conditions suitable for life in the distant past.`,
  },
  earth: {
    title: 'Earth',
    text:
      `Earth is the third planet from the Sun and the only known world to support life. Its unique combination of liquid water, protective atmosphere, moderate temperature, and magnetic shield creates an environment capable of sustaining a vast diversity of organisms.\n\n` +
      `Approximately 71% of Earth’s surface is covered in oceans, which regulate climate and support countless ecosystems. The continents contain mountains, plains, forests, and deserts, contributing to Earth’s geological and biological diversity.\n\n` +
      `Earth’s atmosphere is composed primarily of nitrogen and oxygen, with trace amounts of carbon dioxide and water vapor. This mixture not only enables life but also protects the planet from meteors, solar radiation, and extreme temperature swings.\n\n` +
      `A defining feature of Earth is its active plate tectonics. Movements of the lithospheric plates shape the surface through earthquakes, volcanic eruptions, and mountain building. This continual reshaping also plays a crucial role in long-term climate regulation.\n\n` +
      `Earth’s magnetic field, generated by its molten iron core, shields the surface from harmful solar particles. Without this protective field, the atmosphere could gradually erode, similar to what happened on Mars.\n\n` +
      `The Moon, Earth’s natural satellite, helps stabilize the planet’s axial tilt, contributing to the consistency of seasons. It also influences ocean tides and has played a key role in the evolution of life.\n\n` +
      `Earth remains the most studied planet in the Solar System, yet its complex systems continue to reveal new scientific insights. Understanding Earth helps scientists search for habitable environments elsewhere in the universe.`,
  },
  mars: {
    title: 'Mars',
    text:
      `Mars, often called the Red Planet, is the fourth planet from the Sun and one of the most studied worlds beyond Earth. Its reddish appearance comes from iron oxide—rust—covering its surface. Mars has fascinated scientists for decades due to its potential to once have supported life.\n\n` +
      `The planet’s surface includes massive volcanoes, deep valleys, and ancient riverbeds. Olympus Mons, the tallest volcano in the Solar System, rises nearly three times higher than Mount Everest. Valles Marineris is a canyon system so vast that it stretches across one-fifth of the planet’s circumference.\n\n` +
      `Mars has a thin atmosphere composed mostly of carbon dioxide. Because it is so tenuous, the atmosphere cannot retain heat efficiently, leading to cold temperatures that average around –63°C (–81°F). Dust storms sometimes engulf the entire planet and can last for weeks.\n\n` +
      `Evidence from rovers and orbiters suggests that Mars once had flowing water. Features such as dried river channels, minerals that form in water, and possible ancient lakebeds indicate that Mars may have been warmer and wetter billions of years ago.\n\n` +
      `Although Mars lacks a global magnetic field, localized magnetic regions remain in its crust. These remnants suggest that the planet once had a molten core capable of generating a magnetic field similar to Earth’s.\n\n` +
      `Modern missions—including Perseverance, Curiosity, and Mars Reconnaissance Orbiter—continue to study the planet’s climate, geology, and signs of past habitability. Future human missions are under consideration, potentially making Mars the next frontier for exploration.\n\n` +
      `Mars also has two small moons, Phobos and Deimos, which may be captured asteroids. Their origin and eventual fate remain subjects of ongoing research.`,
  },
  jupiter: {
    title: 'Jupiter',
    text:
      `Jupiter is the largest planet in the Solar System, so massive that it contains more material than all other planets combined. It is a gas giant composed mainly of hydrogen and helium, with no solid surface like the terrestrial planets.\n\n` +
      `The atmosphere of Jupiter is dominated by swirling storms, colorful cloud bands, and complex jet streams. The Great Red Spot—a gigantic storm larger than Earth—has been raging for at least 300 years. These atmospheric patterns result from rapid rotation combined with internal heat.\n\n` +
      `Jupiter’s interior is believed to consist of a dense core surrounded by layers of metallic hydrogen and molecular hydrogen. The extreme pressure inside the planet compresses hydrogen into exotic states not found naturally on Earth.\n\n` +
      `The planet has a powerful magnetic field, the strongest of any planet in the Solar System. This field creates harsh radiation belts around Jupiter, posing significant challenges for spacecraft.\n\n` +
      `Jupiter has at least 95 moons, including the four large Galilean moons: Io, Europa, Ganymede, and Callisto. Each of these moons is a world of scientific interest. Europa, with its subsurface ocean, is one of the most promising places to search for extraterrestrial life.\n\n` +
      `A faint ring system surrounds Jupiter, composed mainly of dust particles. Though far less prominent than Saturn’s rings, they add to the planet’s dynamic environment.\n\n` +
      `Spacecraft such as Voyager, Galileo, and Juno have revealed remarkable insights into Jupiter’s atmosphere and interior. Future missions will continue studying its moons and their potential for life.`,
  },
  saturn: {
    title: 'Saturn',
    text:
      `Saturn is best known for its stunning ring system, the most extensive and bright of any planet in the Solar System. Like Jupiter, it is a gas giant primarily composed of hydrogen and helium, with a low average density—so low that Saturn would float in water if a large enough ocean existed.\n\n` +
      `The rings of Saturn are made of countless particles of ice and rock, ranging in size from microscopic grains to objects several meters across. These rings are divided into multiple bands separated by gaps created by gravitational interactions with Saturn’s moons.\n\n` +
      `Saturn’s atmosphere displays pale bands and subtle storms. Although less vivid than Jupiter’s cloud patterns, Saturn features long-lasting atmospheric structures and occasional massive storms known as Great White Spots.\n\n` +
      `The planet also has a strong magnetic field, though weaker than Jupiter’s. Its magnetic environment interacts with the rings and moons, creating a complex and dynamic plasma system.\n\n` +
      `Saturn is home to more than 140 moons, including Titan—the second-largest moon in the Solar System and the only moon with a thick atmosphere. Titan’s methane lakes and organic chemistry make it a key target in the search for life.\n\n` +
      `Beneath its cloud tops, Saturn likely has a rocky or icy core surrounded by metallic and molecular hydrogen layers. Tremendous pressure within the planet creates exotic forms of matter.\n\n` +
      `The Cassini mission revolutionized our understanding of Saturn, its rings, and its moons. Its 13-year exploration provided details that scientists continue to study today.`,
  },
  uranus: {
    title: 'Uranus',
    text:
      `Uranus is an ice giant with a pale blue color caused by methane in its atmosphere. It is unique among planets because it rotates on its side, with its axis tilted by 98 degrees. This extreme tilt causes unusual seasons that last over 20 years each.\n\n` +
      `The atmosphere of Uranus contains hydrogen, helium, and methane. Although it appears calm compared to Neptune, observations have revealed occasional storms and dynamic cloud structures, especially during seasonal changes.\n\n` +
      `Uranus has a cold and mysterious interior. It may contain a mixture of water, ammonia, and methane ices layered around a small rocky core. Scientists classify Uranus and Neptune as ice giants due to these compositions.\n\n` +
      `A faint ring system surrounds Uranus, consisting of narrow, dark rings made of icy and rocky material. These rings are less reflective and more compact than those of Saturn.\n\n` +
      `The planet has 27 known moons, many of which are named after characters from Shakespeare’s and Alexander Pope’s works. Moons such as Miranda display unusual geological features, including cliffs and canyons that suggest past tectonic activity.\n\n` +
      `Uranus orbits the Sun once every 84 Earth years, and its sideways rotation leads to unpredictable atmospheric cycles. The planet’s magnetic field is also highly tilted relative to its axis, adding complexity to its magnetosphere.\n\n` +
      `Only one spacecraft—Voyager 2—has flown past Uranus, providing the key data we still rely on today. Future missions are being proposed to further study this enigmatic world.`,
  },
  neptune: {
    title: 'Neptune',
    text:
      `Neptune is the eighth and farthest known planet from the Sun. As an ice giant, it is similar in composition to Uranus but exhibits more dramatic weather and atmospheric activity. Its striking deep blue color results from methane absorption and possibly unknown atmospheric components.\n\n` +
      `The atmosphere of Neptune contains supersonic winds that are the fastest in the Solar System, reaching speeds over 2,000 km/h. Massive storms appear and disappear rapidly, including the famous Great Dark Spot observed by Voyager 2.\n\n` +
      `Beneath its atmosphere, Neptune likely contains layers of water, ammonia, and methane ices surrounding a rocky core. High pressure and temperature in the interior may produce exotic forms of ice with unusual properties.\n\n` +
      `Neptune has a faint but complex ring system composed of clumpy and bright arcs. These arcs are maintained by the gravitational influence of nearby moons, preventing the ring material from spreading evenly.\n\n` +
      `Triton, Neptune’s largest moon, is one of the most fascinating objects in the Solar System. It orbits in a retrograde direction and has active geysers that erupt nitrogen, indicating ongoing geological activity.\n\n` +
      `Neptune takes 165 Earth years to complete one orbit around the Sun. Its distance and long orbital period make observations challenging, but modern telescopes and space observatories continue to reveal new features.\n\n` +
      `Voyager 2 remains the only spacecraft to visit Neptune, providing crucial data on its rings, moons, and atmosphere. Proposed future missions aim to uncover the mysteries of this distant world.`,
  },
};

const PURPLE = '#5A18E6';
const YELLOW = '#FFC83D';

export default function PlanetGuideScreen({ navigation }: Props) {
  const { width: W, height: H } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const isSmall = H < 740;
  const isVerySmall = H < 680;

  const sidePad = isVerySmall ? 14 : 18;
  const topGap = isVerySmall ? 10 : 12;

  const cardH = isVerySmall ? 112 : isSmall ? 122 : 132;
  const planetSize = isVerySmall ? 58 : isSmall ? 64 : 70;

  const titleFont = isVerySmall ? 20 : 22;

  const [opened, setOpened] = useState<PlanetId | null>(null);

  const planets: PlanetItem[] = useMemo(
    () => [
      { id: 'mercury', title: 'Mercury', unlocked: true },
      { id: 'venus', title: 'Venus', unlocked: true },
      { id: 'earth', title: 'Earth', unlocked: true },
      { id: 'mars', title: 'Mars', unlocked: true },
      { id: 'jupiter', title: 'Jupiter', unlocked: true },
      { id: 'saturn', title: 'Saturn', unlocked: true },
      { id: 'uranus', title: 'Uranus', unlocked: true },
      { id: 'neptune', title: 'Neptune', unlocked: true },
    ],
    []
  );

  const sharePlanet = async (planetId: PlanetId) => {
    try {
      const a = ARTICLES[planetId];
      await Share.share({ message: `${a.title}\n\n${a.text}` });
    } catch {}
  };

  const androidTopExtra = Platform.OS === 'android' ? 10 : 0;
  const androidScrollExtra = Platform.OS === 'android' ? 40 : 0;
  const androidBottomExtra = Platform.OS === 'android' ? 20 : 0;

  if (opened) {
    const a = ARTICLES[opened];

    return (
      <ImageBackground source={BG} resizeMode="cover" style={styles.bg}>
        <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
          <View style={[styles.topBar, { paddingHorizontal: sidePad, marginTop: (Platform.OS === 'android' ? 6 : 2) + androidTopExtra }]}>
            <Pressable onPress={() => setOpened(null)} style={({ pressed }) => [styles.topSquare, pressed && styles.pressed]}>
              <Text style={styles.topSquareIcon}>‹</Text>
            </Pressable>

            <View style={[styles.pill, { minWidth: Math.min(240, W - sidePad * 2 - 110) }]}>
              <Text style={[styles.pillText, { fontSize: isVerySmall ? 13.5 : 14 }]} numberOfLines={1}>
                {a.title}
              </Text>
            </View>

            <Pressable onPress={() => sharePlanet(opened)} style={({ pressed }) => [styles.topSquare, pressed && styles.pressed]}>
              <Text style={styles.topSquareIcon}>⤴︎</Text>
            </Pressable>
          </View>
        </SafeAreaView>

        <View style={{ flex: 1, paddingHorizontal: sidePad, paddingTop: topGap }}>
          <View style={{ alignItems: 'center', marginTop: isVerySmall ? 10 : 16 }}>
            <Image
              source={IMG[opened]}
              style={{
                width: isVerySmall ? 140 : 160,
                height: isVerySmall ? 140 : 160,
                resizeMode: 'contain',
              }}
            />
          </View>

          <View
            style={[
              styles.articlePanel,
              {
                marginTop: isVerySmall ? 10 : 14,
                padding: isVerySmall ? 12 : 14,
              },
            ]}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: Platform.OS === 'android' ? 20 : 18 }}
            >
              <Text
                style={[
                  styles.articleText,
                  { fontSize: isVerySmall ? 11.5 : 12.2, lineHeight: isVerySmall ? 16 : 17.5 },
                ]}
              >
                {a.text}
              </Text>
            </ScrollView>
          </View>
        </View>

        <View style={{ height: Math.max(8, insets.bottom) + androidBottomExtra }} />
      </ImageBackground>
    );
  }

  const renderItem = ({ item }: { item: PlanetItem }) => {
    return (
      <View style={[styles.card, { height: cardH, paddingHorizontal: isVerySmall ? 14 : 16 }]}>
        <View style={[styles.planetCircle, { width: planetSize + 10, height: planetSize + 10, borderRadius: 999 }]}>
          <Image source={IMG[item.id]} style={{ width: planetSize, height: planetSize, resizeMode: 'contain' }} />
        </View>

        <View style={styles.right}>
          <Text style={[styles.name, { fontSize: titleFont }]} numberOfLines={1}>
            {item.title}
          </Text>

          <View style={styles.actionsRow}>
            <Pressable onPress={() => setOpened(item.id)} style={({ pressed }) => [styles.readBtn, pressed && styles.pressed]}>
              <Text style={styles.readText}>Read</Text>
            </Pressable>

            <Pressable onPress={() => sharePlanet(item.id)} hitSlop={10} style={({ pressed }) => [styles.shareBtn, pressed && styles.pressed]}>
              <Text style={styles.shareIcon}>⤴︎</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ImageBackground source={BG} resizeMode="cover" style={styles.bg}>
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <View style={[styles.topBar, { paddingHorizontal: sidePad, marginTop: (Platform.OS === 'android' ? 6 : 2) + androidTopExtra }]}>
          <Pressable onPress={() => navigation.goBack()} style={({ pressed }) => [styles.topSquare, pressed && styles.pressed]}>
            <Text style={styles.topSquareIcon}>‹</Text>
          </Pressable>

          <View style={[styles.pill, { minWidth: Math.min(260, W - sidePad * 2 - 110) }]}>
            <Text style={[styles.pillText, { fontSize: isVerySmall ? 13.5 : 14 }]}>Planet Guide</Text>
            <Text style={[styles.pillMiniIcon, { fontSize: isVerySmall ? 14 : 15 }]}>🪐</Text>
          </View>

          <View style={{ width: 44 }} />
        </View>
      </SafeAreaView>

      <FlatList
        data={planets}
        keyExtractor={(p) => p.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: sidePad,
          paddingTop: topGap,
          paddingBottom: Math.max(18, insets.bottom + 20) + androidScrollExtra + androidBottomExtra,
          gap: isVerySmall ? 12 : 14,
        }}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#000' },
  safe: { backgroundColor: 'transparent' },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  topSquare: {
    width: 44,
    height: 34,
    borderRadius: 12,
    backgroundColor: YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  topSquareIcon: {
    color: '#2B135F',
    fontSize: 22,
    fontWeight: '900',
    marginTop: -2,
  },

  pill: {
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: YELLOW,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  pillText: { color: '#fff', fontWeight: '900' },
  pillMiniIcon: { marginTop: 1 },

  card: {
    borderRadius: 22,
    backgroundColor: PURPLE,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOpacity: 0.28,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },

  planetCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  right: { flex: 1, paddingLeft: 14, alignItems: 'flex-end' },

  name: {
    color: '#fff',
    fontWeight: '900',
    textAlign: 'right',
  },

  actionsRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  readBtn: {
    height: 34,
    minWidth: 92,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  readText: { color: '#fff', fontWeight: '900', fontSize: 13 },

  shareBtn: {
    width: 40,
    height: 34,
    borderRadius: 12,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareIcon: { color: YELLOW, fontSize: 20, fontWeight: '900' },

  pressed: { opacity: 0.88, transform: [{ scale: 0.98 }] },

  articlePanel: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderWidth: 1,
    borderColor: '#34B7FF',
  },
  articleText: {
    color: '#fff',
    opacity: 0.95,
    textAlign: 'center',
  },
});
