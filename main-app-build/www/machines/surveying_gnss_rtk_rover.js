import {
  steel, aluminum, blackPlastic, redAccent, whitePlastic, yellowAccent, glass
} from '../utils/materials.js';

export function createGNSSRover(THREE) {
  const group = new THREE.Group();
  group.name = 'GNSSRover';
  const animationClips = [];

  // 1. Pole
  const poleGeo = new THREE.CylinderGeometry(0.015, 0.015, 2.0, 16);
  const pole = new THREE.Mesh(poleGeo, redAccent);
  pole.position.y = 1.0;
  group.add(pole);

  const tipGeo = new THREE.ConeGeometry(0.015, 0.1, 16);
  const tip = new THREE.Mesh(tipGeo, steel);
  tip.position.y = -0.05;
  tip.rotation.x = Math.PI;
  pole.add(tip);

  // 2. Data Collector (Tablet on bracket)
  const bracketGroup = new THREE.Group();
  bracketGroup.position.set(0.025, 1.2, 0);

  const bracketGeo = new THREE.BoxGeometry(0.06, 0.02, 0.05);
  const bracket = new THREE.Mesh(bracketGeo, blackPlastic);
  bracketGroup.add(bracket);

  const tabletGeo = new THREE.BoxGeometry(0.15, 0.25, 0.02);
  const tablet = new THREE.Mesh(tabletGeo, yellowAccent);
  tablet.position.set(0.05, 0, 0);
  tablet.rotation.y = -Math.PI / 6;
  tablet.rotation.x = -Math.PI / 6;
  
  const screenGeo = new THREE.PlaneGeometry(0.13, 0.22);
  const screen = new THREE.Mesh(screenGeo, glass);
  screen.position.set(0, 0, 0.011);
  tablet.add(screen);

  bracketGroup.add(tablet);
  group.add(bracketGroup);

  // 3. GNSS Antenna (Mushroom top)
  const antennaGroup = new THREE.Group();
  antennaGroup.position.y = 2.05;

  const baseGeo = new THREE.CylinderGeometry(0.08, 0.02, 0.05, 32);
  const base = new THREE.Mesh(baseGeo, aluminum);
  antennaGroup.add(base);

  const domeGeo = new THREE.SphereGeometry(0.08, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const dome = new THREE.Mesh(domeGeo, whitePlastic);
  dome.position.y = 0.025;
  antennaGroup.add(dome);

  const indicatorGeo = new THREE.SphereGeometry(0.01, 8, 8);
  const indicator = new THREE.Mesh(indicatorGeo, redAccent); // Used as LED
  indicator.name = 'IndicatorLED';
  indicator.position.set(0, 0.1, 0);
  antennaGroup.add(indicator);

  group.add(antennaGroup);

  // Animation: swaying the pole slightly and indicator blinking
  const duration = 4;
  const times = [0, 1, 2, 3, 4];
  
  const swayTrackZ = new THREE.NumberKeyframeTrack(
    `${group.name}.rotation[z]`,
    times,
    [0, 0.05, 0, -0.05, 0]
  );
  
  const swayTrackX = new THREE.NumberKeyframeTrack(
    `${group.name}.rotation[x]`,
    times,
    [0, -0.02, 0.05, 0.02, 0]
  );

  const blinkTimes = [];
  const blinkValues = [];
  for (let i = 0; i <= 4; i += 0.5) {
    blinkTimes.push(i, i + 0.25);
    blinkValues.push(1, 1, 1, 1.5, 1.5, 1.5, 1, 1, 1);
  }

  const blinkTrack = new THREE.NumberKeyframeTrack(
    `${indicator.name}.scale`,
    [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4],
    [1,1,1, 1.5,1.5,1.5, 1,1,1, 1.5,1.5,1.5, 1,1,1, 1.5,1.5,1.5, 1,1,1, 1.5,1.5,1.5, 1,1,1]
  );

  const clip = new THREE.AnimationClip('RTKSwayAndBlink', duration, [swayTrackZ, swayTrackX, blinkTrack]);
  animationClips.push(clip);

  return { group, animationClips };
}
