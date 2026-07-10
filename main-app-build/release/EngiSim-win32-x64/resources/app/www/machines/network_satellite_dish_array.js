import {
  steel,
  aluminum,
  darkSteel,
  whitePlastic,
  redAccent,
  greenAccent,
  blackPlastic
} from '../utils/materials.js';

export function createSatelliteDishArray(THREE) {
  const group = new THREE.Group();
  const animationClips = [];

  // Base platform
  const baseGeo = new THREE.CylinderGeometry(10, 10, 1, 32);
  const base = new THREE.Mesh(baseGeo, darkSteel);
  group.add(base);

  // Array of dishes
  const positions = [
    [-5, 5], [5, 5], [-5, -5], [5, -5]
  ];

  const dishGroups = [];
  const tracks = [];

  positions.forEach((pos, idx) => {
    const dishAssembly = new THREE.Group();
    dishAssembly.position.set(pos[0], 0.5, pos[1]);

    // Pedestal
    const pedGeo = new THREE.CylinderGeometry(1, 1.5, 4, 16);
    const pedestal = new THREE.Mesh(pedGeo, steel);
    pedestal.position.y = 2;
    dishAssembly.add(pedestal);

    // Rotating Mount (Azimuth and Elevation)
    const mountGroup = new THREE.Group();
    mountGroup.position.y = 4;
    mountGroup.name = `dishMountGroup${idx}`;
    dishAssembly.add(mountGroup);

    // Main Reflector Dish
    const dishGeo = new THREE.SphereGeometry(4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 3);
    const dish = new THREE.Mesh(dishGeo, whitePlastic);
    dish.rotation.x = Math.PI; // Face upwards
    dish.position.y = 1;
    mountGroup.add(dish);

    // Sub-reflector and supports
    const subGroup = new THREE.Group();
    subGroup.position.y = 4.5;
    mountGroup.add(subGroup);

    const subGeo = new THREE.CylinderGeometry(0.8, 0.5, 0.3, 16);
    const subReflector = new THREE.Mesh(subGeo, aluminum);
    subGroup.add(subReflector);

    const strutGeo = new THREE.CylinderGeometry(0.05, 0.05, 4.5, 8);
    for(let i=0; i<3; i++) {
       const angle = (i * Math.PI * 2) / 3;
       const strut = new THREE.Mesh(strutGeo, steel);
       // Position and rotation to connect dish edge to sub-reflector
       strut.position.set(Math.cos(angle)*1.5, -1.8, Math.sin(angle)*1.5);
       strut.rotation.x = (Math.PI / 5) * Math.cos(angle);
       strut.rotation.z = (Math.PI / 5) * -Math.sin(angle); 
       subGroup.add(strut);
    }

    // Indicator light
    const ledGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const ledMat = greenAccent.clone();
    ledMat.emissive = new THREE.Color(0x00ff00);
    const led = new THREE.Mesh(ledGeo, ledMat);
    led.position.set(0, 1.5, 1.2);
    led.name = `dishLed${idx}`;
    pedestal.add(led);

    dishGroups.push(mountGroup);
    group.add(dishAssembly);

    // Animate LED
    const ledTrack = new THREE.NumberKeyframeTrack(`dishLed${idx}.material.emissiveIntensity`, [0, 0.5, 1, 1.5, 2], [0, 1, 0, 1, 0]);
    tracks.push(ledTrack);
  });

  animationClips.push(new THREE.AnimationClip(`DishLights`, 2, tracks));

  // Track animation: Rotate the dishes
  const rotTracks = [];
  const times = [0, 5, 10, 15, 20];
  const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI/6, 0, 0));
  const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI/4, Math.PI/4, 0));
  const q3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI/3, -Math.PI/4, 0));
  
  const values = [
    ...q1.toArray(),
    ...q2.toArray(),
    ...q1.toArray(),
    ...q3.toArray(),
    ...q1.toArray()
  ];

  dishGroups.forEach((mGroup, idx) => {
    const rotTrack = new THREE.QuaternionKeyframeTrack(`dishMountGroup${idx}.quaternion`, times, values);
    rotTracks.push(rotTrack);
  });

  animationClips.push(new THREE.AnimationClip(`DishTracking`, 20, rotTracks));

  return { group, animationClips };
}
