import {
  steel,
  aluminum,
  darkSteel,
  copper,
  rubber,
  plastic,
  blackPlastic,
  glass,
  blueAccent,
  tinted
} from '../utils/materials.js';

export function createSubseaFiberCable(THREE) {
  const group = new THREE.Group();
  const animationClips = [];

  // Cutaway lengths
  const layers = [
    { radius: 4.0, length: 4, mat: blackPlastic, z: 0 },         // Polyurethane outer jacket
    { radius: 3.5, length: 6, mat: darkSteel, z: -1 },         // Armor wire
    { radius: 2.8, length: 8, mat: steel, z: -2 },             // Inner armor
    { radius: 2.2, length: 10, mat: aluminum, z: -3 },         // Aluminum water barrier
    { radius: 1.8, length: 12, mat: plastic, z: -4 },          // Polycarbonate core
    { radius: 1.0, length: 14, mat: copper, z: -5 },           // Copper tube for power
  ];

  layers.forEach(layer => {
    const geo = new THREE.CylinderGeometry(layer.radius, layer.radius, layer.length, 32);
    const mesh = new THREE.Mesh(geo, layer.mat);
    mesh.rotation.x = Math.PI / 2;
    mesh.position.z = layer.z + layer.length / 2 - 2;
    group.add(mesh);
  });

  // Central kingwire
  const kingGeo = new THREE.CylinderGeometry(0.2, 0.2, 16, 16);
  const kingwire = new THREE.Mesh(kingGeo, steel);
  kingwire.rotation.x = Math.PI / 2;
  kingwire.position.z = 1;
  group.add(kingwire);

  // Fiber cores
  const fiberGroup = new THREE.Group();
  const fiberRadius = 0.08;
  const numFibers = 12;
  const fiberMats = [];
  const tracks = [];

  for(let i=0; i<numFibers; i++) {
     const angle = (i * Math.PI * 2) / numFibers;
     const x = Math.cos(angle) * 0.6;
     const y = Math.sin(angle) * 0.6;
     
     const fiberGeo = new THREE.CylinderGeometry(fiberRadius, fiberRadius, 18, 16);
     
     const fMat = glass.clone();
     fMat.transparent = true;
     fMat.opacity = 0.9;
     fMat.emissive = new THREE.Color(0x00aaff);
     fMat.emissiveIntensity = 0;
     fiberMats.push(fMat);
     
     const fiber = new THREE.Mesh(fiberGeo, fMat);
     fiber.rotation.x = Math.PI / 2;
     fiber.position.set(x, y, 2);
     fiber.name = `fiberCore${i}`;
     fiberGroup.add(fiber);
     
     const offset = (i * 0.15) % 1.0;
     const times = [0, offset, offset + 0.1, offset + 0.2, 2.0];
     const values = [0, 0, 2.0, 0, 0];
     const track = new THREE.NumberKeyframeTrack(`fiberCore${i}.material.emissiveIntensity`, times, values);
     tracks.push(track);
  }
  group.add(fiberGroup);

  const clip = new THREE.AnimationClip('FiberDataPulse', 2.0, tracks);
  animationClips.push(clip);

  return { group, animationClips };
}
