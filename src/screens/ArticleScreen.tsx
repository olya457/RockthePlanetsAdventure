import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Pressable,
  ScrollView,
  Share,
  useWindowDimensions,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Article'>;

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

const TITLES: Record<keyof typeof IMG, string> = {
  mercury: 'Mercury',
  venus: 'Venus',
  earth: 'Earth',
  mars: 'Mars',
  jupiter: 'Jupiter',
  saturn: 'Saturn',
  uranus: 'Uranus',
  neptune: 'Neptune',
};

export default function ArticleScreen({ navigation, route }: Props) {
  const { height: H } = useWindowDimensions();
  const isSmall = H < 740;
  const isVerySmall = H < 680;

  const planetId = route.params.planetId as keyof typeof IMG;
  const title = TITLES[planetId];
  const articleText = useMemo(() => {
    const map: Record<string, string> = {
      mercury: `Mercury is the closest planet to the Sun and the smallest in the Solar System, with a diameter of just 4,879 km. Its surface is heavily cratered, resembling Earth’s Moon, and preserves the record of billions of years of meteorite impacts. Because of its proximity to the Sun, Mercury experiences extreme environmental conditions that make it challenging to observe and study.

Temperatures on Mercury swing dramatically. During the day, the surface can reach scorching highs of about 430°C (800°F), while at night it drops to –180°C (–290°F). These extreme fluctuations occur because Mercury lacks a substantial atmosphere capable of retaining heat.

The planet’s thin exosphere is composed mainly of atoms knocked off its surface by solar radiation. Sodium, potassium, calcium, and small traces of other elements drift in this fragile, constantly replenished cloud. Due to the weakness of this exosphere, no weather patterns, clouds, or winds form.

Mercury orbits the Sun in just 88 Earth days, but its rotation period is 59 Earth days. This leads to a unique phenomenon: one solar day on Mercury—from one sunrise to the next—lasts 176 Earth days, longer than its year.

Despite its small size, Mercury has a surprisingly strong but patchy magnetic field. Scientists believe this is due to a partially molten core that occupies a large portion of the planet’s interior. This structure also explains its unusually high density.

Mercury’s surface contains vast scarps and cliffs formed as the planet cooled and contracted, shrinking its radius. These features stretch for hundreds of kilometers and make its landscape one of the most dramatic among rocky planets.

Past missions like Mariner 10 and MESSENGER have provided crucial insights into Mercury’s geology and composition. The ongoing BepiColombo mission is expected to reveal even more about this mysterious world.`,
      venus: `Venus, the second planet from the Sun, is often called Earth’s “sister planet” due to their similar size and mass. Despite these similarities, Venus has developed into one of the most extreme environments in the Solar System. Thick clouds of sulfuric acid and a dense carbon-dioxide atmosphere create conditions hostile to life as we know it.

Surface temperatures on Venus reach an average of 470°C (880°F), hot enough to melt lead. This intense heat results from a runaway greenhouse effect, where heat from the Sun becomes trapped beneath the thick atmosphere, unable to escape back into space.

The planet’s surface is dominated by volcanic plains, highland regions, and massive lava flows. Radar mapping has revealed thousands of volcanoes, suggesting that Venus may still be geologically active today. Many surface features appear relatively young compared to other rocky worlds.

A remarkable characteristic of Venus is its slow and retrograde rotation. Venus spins backward compared to most planets, completing one rotation in 243 Earth days. Interestingly, its day is longer than its year, which lasts 225 Earth days.

Atmospheric pressure on Venus is about 92 times greater than Earth’s—equivalent to being nearly a kilometer underwater. This immense pressure makes surface exploration incredibly difficult, with probes surviving only a few hours before being crushed.

Although Venus lacks a global magnetic field, its dense atmosphere provides limited protection against solar radiation. However, the upper layers of the atmosphere gradually escape into space due to solar winds stripping away lighter elements.

Past missions such as Magellan, Venera, and Akatsuki have helped uncover Venus’s mysteries. Future missions like VERITAS and EnVision aim to determine whether the planet ever had oceans or conditions suitable for life in the distant past.`,
      earth: `Earth is the third planet from the Sun and the only known world to support life. Its unique combination of liquid water, protective atmosphere, moderate temperature, and magnetic shield creates an environment capable of sustaining a vast diversity of organisms.

Approximately 71% of Earth’s surface is covered in oceans, which regulate climate and support countless ecosystems. The continents contain mountains, plains, forests, and deserts, contributing to Earth’s geological and biological diversity.

Earth’s atmosphere is composed primarily of nitrogen and oxygen, with trace amounts of carbon dioxide and water vapor. This mixture not only enables life but also protects the planet from meteors, solar radiation, and extreme temperature swings.

A defining feature of Earth is its active plate tectonics. Movements of the lithospheric plates shape the surface through earthquakes, volcanic eruptions, and mountain building. This continual reshaping also plays a crucial role in long-term climate regulation.

Earth’s magnetic field, generated by its molten iron core, shields the surface from harmful solar particles. Without this protective field, the atmosphere could gradually erode, similar to what happened on Mars.

The Moon, Earth’s natural satellite, helps stabilize the planet’s axial tilt, contributing to the consistency of seasons. It also influences ocean tides and has played a key role in the evolution of life.

Earth remains the most studied planet in the Solar System, yet its complex systems continue to reveal new scientific insights. Understanding Earth helps scientists search for habitable environments elsewhere in the universe.`,
      mars: `Mars, often called the Red Planet, is the fourth planet from the Sun and one of the most studied worlds beyond Earth. Its reddish appearance comes from iron oxide—rust—covering its surface. Mars has fascinated scientists for decades due to its potential to once have supported life.

The planet’s surface includes massive volcanoes, deep valleys, and ancient riverbeds. Olympus Mons, the tallest volcano in the Solar System, rises nearly three times higher than Mount Everest. Valles Marineris is a canyon system so vast that it stretches across one-fifth of the planet’s circumference.

Mars has a thin atmosphere composed mostly of carbon dioxide. Because it is so tenuous, the atmosphere cannot retain heat efficiently, leading to cold temperatures that average around –63°C (–81°F). Dust storms sometimes engulf the entire planet and can last for weeks.

Evidence from rovers and orbiters suggests that Mars once had flowing water. Features such as dried river channels, minerals that form in water, and possible ancient lakebeds indicate that Mars may have been warmer and wetter billions of years ago.

Although Mars lacks a global magnetic field, localized magnetic regions remain in its crust. These remnants suggest that the planet once had a molten core capable of generating a magnetic field similar to Earth’s.

Modern missions—including Perseverance, Curiosity, and Mars Reconnaissance Orbiter—continue to study the planet’s climate, geology, and signs of past habitability. Future human missions are under consideration, potentially making Mars the next frontier for exploration.

Mars also has two small moons, Phobos and Deimos, which may be captured asteroids. Their origin and eventual fate remain subjects of ongoing research.`,
      jupiter: `Jupiter is the largest planet in the Solar System, so massive that it contains more material than all other planets combined. It is a gas giant composed mainly of hydrogen and helium, with no solid surface like the terrestrial planets.

The atmosphere of Jupiter is dominated by swirling storms, colorful cloud bands, and complex jet streams. The Great Red Spot—a gigantic storm larger than Earth—has been raging for at least 300 years. These atmospheric patterns result from rapid rotation combined with internal heat.

Jupiter’s interior is believed to consist of a dense core surrounded by layers of metallic hydrogen and molecular hydrogen. The extreme pressure inside the planet compresses hydrogen into exotic states not found naturally on Earth.

The planet has a powerful magnetic field, the strongest of any planet in the Solar System. This field creates harsh radiation belts around Jupiter, posing significant challenges for spacecraft.

Jupiter has at least 95 moons, including the four large Galilean moons: Io, Europa, Ganymede, and Callisto. Each of these moons is a world of scientific interest. Europa, with its subsurface ocean, is one of the most promising places to search for extraterrestrial life.

A faint ring system surrounds Jupiter, composed mainly of dust particles. Though far less prominent than Saturn’s rings, they add to the planet’s dynamic environment.

Spacecraft such as Voyager, Galileo, and Juno have revealed remarkable insights into Jupiter’s atmosphere and interior. Future missions will continue studying its moons and their potential for life.`,
      saturn: `Saturn is best known for its stunning ring system, the most extensive and bright of any planet in the Solar System. Like Jupiter, it is a gas giant primarily composed of hydrogen and helium, with a low average density—so low that Saturn would float in water if a large enough ocean existed.

The rings of Saturn are made of countless particles of ice and rock, ranging in size from microscopic grains to objects several meters across. These rings are divided into multiple bands separated by gaps created by gravitational interactions with Saturn’s moons.

Saturn’s atmosphere displays pale bands and subtle storms. Although less vivid than Jupiter’s cloud patterns, Saturn features long-lasting atmospheric structures and occasional massive storms known as Great White Spots.

The planet also has a strong magnetic field, though weaker than Jupiter’s. Its magnetic environment interacts with the rings and moons, creating a complex and dynamic plasma system.

Saturn is home to more than 140 moons, including Titan—the second-largest moon in the Solar System and the only moon with a thick atmosphere. Titan’s methane lakes and organic chemistry make it a key target in the search for life.

Beneath its cloud tops, Saturn likely has a rocky or icy core surrounded by metallic and molecular hydrogen layers. Tremendous pressure within the planet creates exotic forms of matter.

The Cassini mission revolutionized our understanding of Saturn, its rings, and its moons. Its 13-year exploration provided details that scientists continue to study today.`,
      uranus: `Uranus is an ice giant with a pale blue color caused by methane in its atmosphere. It is unique among planets because it rotates on its side, with its axis tilted by 98 degrees. This extreme tilt causes unusual seasons that last over 20 years each.

The atmosphere of Uranus contains hydrogen, helium, and methane. Although it appears calm compared to Neptune, observations have revealed occasional storms and dynamic cloud structures, especially during seasonal changes.

Uranus has a cold and mysterious interior. It may contain a mixture of water, ammonia, and methane ices layered around a small rocky core. Scientists classify Uranus and Neptune as ice giants due to these compositions.

A faint ring system surrounds Uranus, consisting of narrow, dark rings made of icy and rocky material. These rings are less reflective and more compact than those of Saturn.

The planet has 27 known moons, many of which are named after characters from Shakespeare’s and Alexander Pope’s works. Moons such as Miranda display unusual geological features, including cliffs and canyons that suggest past tectonic activity.

Uranus orbits the Sun once every 84 Earth years, and its sideways rotation leads to unpredictable atmospheric cycles. The planet’s magnetic field is also highly tilted relative to its axis, adding complexity to its magnetosphere.

Only one spacecraft—Voyager 2—has flown past Uranus, providing the key data we still rely on today. Future missions are being proposed to further study this enigmatic world.`,
      neptune: `Neptune is the eighth and farthest known planet from the Sun. As an ice giant, it is similar in composition to Uranus but exhibits more dramatic weather and atmospheric activity. Its striking deep blue color results from methane absorption and possibly unknown atmospheric components.

The atmosphere of Neptune contains supersonic winds that are the fastest in the Solar System, reaching speeds over 2,000 km/h. Massive storms appear and disappear rapidly, including the famous Great Dark Spot observed by Voyager 2.

Beneath its atmosphere, Neptune likely contains layers of water, ammonia, and methane ices surrounding a rocky core. High pressure and temperature in the interior may produce exotic forms of ice with unusual properties.

Neptune has a faint but complex ring system composed of clumpy and bright arcs. These arcs are maintained by the gravitational influence of nearby moons, preventing the ring material from spreading evenly.

Triton, Neptune’s largest moon, is one of the most fascinating objects in the Solar System. It orbits in a retrograde direction and has active geysers that erupt nitrogen, indicating ongoing geological activity.

Neptune takes 165 Earth years to complete one orbit around the Sun. Its distance and long orbital period make observations challenging, but modern telescopes and space observatories continue to reveal new features.

Voyager 2 remains the only spacecraft to visit Neptune, providing crucial data on its rings, moons, and atmosphere. Proposed future missions aim to uncover the mysteries of this distant world.`,
    };

    return map[planetId] ?? '';
  }, [planetId]);

  const onShare = async () => {
    try {
      await Share.share({
        message: `${title}\n\n${articleText.slice(0, 450)}...`,
      });
    } catch {

    }
  };

  return (
    <ImageBackground source={BG} resizeMode="cover" style={styles.bg}>
      <View style={[styles.topBar, { paddingTop: isSmall ? 8 : 10 }]}>
        <Pressable onPress={() => navigation.goBack()} style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}>
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>

        <View style={styles.titlePill}>
          <Text style={styles.titlePillText}>{title}</Text>
        </View>

        <Pressable onPress={onShare} style={({ pressed }) => [styles.shareTop, pressed && styles.pressed]}>
          <Text style={styles.shareTopIcon}>⤴︎</Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 18,
          paddingTop: 18,
          paddingBottom: 26,
        }}
      >
        <Image
          source={IMG[planetId]}
          style={[
            styles.hero,
            { width: isVerySmall ? 140 : 160, height: isVerySmall ? 140 : 160 },
          ]}
        />

        <View style={styles.textBox}>
          <Text style={styles.articleText}>{articleText}</Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const YELLOW = '#FFC83D';

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#000' },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    justifyContent: 'space-between',
  },

  backBtn: {
    width: 44,
    height: 34,
    borderRadius: 10,
    backgroundColor: YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { color: '#2B135F', fontSize: 22, fontWeight: '900', marginTop: -2 },

  titlePill: {
    height: 34,
    minWidth: 170,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titlePillText: { color: '#fff', fontWeight: '900', fontSize: 14.5 },

  shareTop: {
    width: 44,
    height: 34,
    borderRadius: 10,
    backgroundColor: YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareTopIcon: { color: '#2B135F', fontSize: 18, fontWeight: '900', marginTop: -1 },

  hero: {
    alignSelf: 'center',
    resizeMode: 'contain',
    marginTop: 10,
    marginBottom: 14,
  },

  textBox: {
    alignSelf: 'center',
    width: '92%',
  },

  articleText: {
    color: '#fff',
    fontSize: 12.5,
    lineHeight: 18,
    textAlign: 'center',
    opacity: 0.95,
  },

  pressed: { opacity: 0.88, transform: [{ scale: 0.98 }] },
});
