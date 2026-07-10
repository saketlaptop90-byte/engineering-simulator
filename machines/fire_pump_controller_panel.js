import { steelMaterial, glassMaterial, rubberMaterial } from '../utils/materials.js';

export function createFirePumpControllerPanel(THREE) {
  const group = new THREE.Group();
  const animationClips = [];

  const cabGeo = new THREE.BoxGeometry(2, 3, 0.8);
  const cabMat = new THREE.MeshStandardMaterial({ color: 0xaa0000 });
  const cabinet = new THREE.Mesh(cabGeo, cabMat);
  cabinet.position.y = 1.5;
  group.add(cabinet);

  const screenGeo = new THREE.PlaneGeometry(1.2, 0.8);
  const screen = new THREE.Mesh(screenGeo, glassMaterial);
  screen.position.set(0, 2.2, 0.41);
  group.add(screen);

  const lightsGroup = new THREE.Group();
  lightsGroup.name = "Indicators";
  
  const lightColors = [0x00ff00, 0xff0000, 0xffff00];
  const lightPositions = [-0.5, 0, 0.5];

  for (let i = 0; i < 3; i++) {
    const lightGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const lightMat = new THREE.MeshStandardMaterial({ color: lightColors[i], emissive: lightColors[i], emissiveIntensity: 0 });
    const light = new THREE.Mesh(lightGeo, lightMat);
    light.position.set(lightPositions[i], 1.2, 0.41);
    light.scale.set(1, 1, 0.2);
    light.name = `Indicator_${i}`;
    lightsGroup.add(light);
  }
  group.add(lightsGroup);

  for (let i = -0.5; i <= 0.5; i+=0.5) {
      const btnGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.1);
      const btn = new THREE.Mesh(btnGeo, rubberMaterial);
      btn.rotation.x = Math.PI / 2;
      btn.position.set(i, 0.8, 0.45);
      group.add(btn);
  }

  const times = [0, 0.5, 1, 1.5, 2];
  const blinkValues = [0, 1, 0, 1, 0];
  const tracks = [];

  lightsGroup.children.forEach((light) => {
      tracks.push(new THREE.NumberKeyframeTrack(`${light.name}.material.emissiveIntensity`, times, blinkValues));
  });

  const clip = new THREE.AnimationClip('AlarmSequence', 2, tracks);
  animationClips.push(clip);

  return { group, animationClips };
}
