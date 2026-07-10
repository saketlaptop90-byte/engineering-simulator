import {
  gold, copper, chrome, darkSteel, glass, blueAccent, tinted
} from '../utils/materials.js';

export function createQuantumComputerCore(THREE) {
  const group = new THREE.Group();
  const animationClips = [];

  // Refrigerator structure
  const fridgeGroup = new THREE.Group();
  
  // Stages
  const stageRadii = [2, 1.8, 1.5, 1.2, 0.8];
  const stageHeights = [0.2, 0.2, 0.2, 0.2, 0.3];
  const stageY = [5, 3.5, 2, 0.5, -1];
  
  for (let i = 0; i < stageRadii.length; i++) {
    const stageGeo = new THREE.CylinderGeometry(stageRadii[i], stageRadii[i], stageHeights[i], 32);
    const stageMat = i % 2 === 0 ? chrome : gold;
    const stage = new THREE.Mesh(stageGeo, stageMat);
    stage.position.y = stageY[i];
    fridgeGroup.add(stage);
  }

  // Connecting rods
  for (let i = 0; i < stageRadii.length - 1; i++) {
    const rodsGeo = new THREE.CylinderGeometry(0.1, 0.1, stageY[i] - stageY[i+1], 16);
    for (let j = 0; j < 4; j++) {
      const rod = new THREE.Mesh(rodsGeo, copper);
      const angle = (j * Math.PI) / 2;
      const radius = stageRadii[i+1] * 0.8;
      rod.position.set(Math.cos(angle) * radius, (stageY[i] + stageY[i+1]) / 2, Math.sin(angle) * radius);
      fridgeGroup.add(rod);
    }
  }

  // Quantum processor chip at bottom
  const chipGeo = new THREE.BoxGeometry(1, 0.1, 1);
  const chipMat = darkSteel;
  const chip = new THREE.Mesh(chipGeo, chipMat);
  chip.position.y = -1.5;
  fridgeGroup.add(chip);

  const qbGeo = new THREE.BoxGeometry(0.1, 0.15, 0.1);
  const qbMat = tinted(blueAccent, 0x00ffff);
  
  const qubits = new THREE.Group();
  for (let x = -0.3; x <= 0.3; x+=0.3) {
    for (let z = -0.3; z <= 0.3; z+=0.3) {
      const qb = new THREE.Mesh(qbGeo, qbMat);
      qb.position.set(x, -1.4, z);
      qubits.add(qb);
    }
  }
  fridgeGroup.add(qubits);

  // Outer casing
  const casingGeo = new THREE.CylinderGeometry(2.5, 2.5, 8, 32, 1, true);
  const casing = new THREE.Mesh(casingGeo, glass);
  casing.position.y = 2;
  fridgeGroup.add(casing);

  group.add(fridgeGroup);

  // Animation: Qubits pulsating and outer casing rotating slowly
  const times = [0, 1, 2];
  const scaleValues = [];
  for (let i = 0; i <= 2; i++) {
    const s = i % 2 === 0 ? 1 : 1.5;
    scaleValues.push(s, s, s);
  }
  
  const qubitTracks = qubits.children.map((qb, i) => {
    return new THREE.VectorKeyframeTrack(`${qb.uuid}.scale`, times, scaleValues);
  });
  
  const casingRotation = new THREE.NumberKeyframeTrack(`${casing.uuid}.rotation[y]`, [0, 4], [0, Math.PI * 2]);
  
  const clip = new THREE.AnimationClip('QuantumCoreOperation', 4, [...qubitTracks, casingRotation]);
  animationClips.push(clip);

  return { group, animationClips };
}
