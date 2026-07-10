import {
  steel, aluminum, blackPlastic, yellowAccent, glass, fire
} from '../utils/materials.js';

export function createTotalStation(THREE) {
  const group = new THREE.Group();
  const animationClips = [];

  // 1. Tripod
  const tripodGroup = new THREE.Group();
  tripodGroup.name = 'Tripod';
  
  for (let i = 0; i < 3; i++) {
    const legGeo = new THREE.CylinderGeometry(0.04, 0.02, 1.5, 8);
    const leg = new THREE.Mesh(legGeo, yellowAccent);
    leg.position.y = 0.75;
    
    const legWrapper = new THREE.Group();
    legWrapper.add(leg);
    legWrapper.rotation.x = Math.PI / 8; // splayed out
    
    const pivot = new THREE.Group();
    pivot.add(legWrapper);
    pivot.rotation.y = (i * Math.PI * 2) / 3;
    pivot.position.y = 1.4;
    tripodGroup.add(pivot);
  }
  
  const headGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.1, 16);
  const head = new THREE.Mesh(headGeo, aluminum);
  head.position.y = 1.45;
  tripodGroup.add(head);
  group.add(tripodGroup);

  // 2. Tribrach (Base of station)
  const tribrachGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.15, 6);
  const tribrach = new THREE.Mesh(tribrachGeo, blackPlastic);
  tribrach.position.y = 1.55;
  group.add(tribrach);

  // 3. Alidade (Rotating body)
  const alidade = new THREE.Group();
  alidade.name = 'Alidade';
  alidade.position.y = 1.65;
  
  const bodyGeo = new THREE.BoxGeometry(0.25, 0.4, 0.2);
  const body = new THREE.Mesh(bodyGeo, yellowAccent);
  body.position.y = 0.2;
  alidade.add(body);

  // 4. Telescope (Tilting)
  const telescopePivot = new THREE.Group();
  telescopePivot.name = 'Telescope';
  telescopePivot.position.set(0, 0.25, 0);
  
  const scopeGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.4, 16);
  const scope = new THREE.Mesh(scopeGeo, steel);
  scope.rotation.x = Math.PI / 2;
  telescopePivot.add(scope);

  const lensGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.02, 16);
  const lens = new THREE.Mesh(lensGeo, glass);
  lens.rotation.x = Math.PI / 2;
  lens.position.z = 0.21;
  telescopePivot.add(lens);

  // Laser beam
  const laserGeo = new THREE.CylinderGeometry(0.005, 0.005, 5, 8);
  const laser = new THREE.Mesh(laserGeo, fire);
  laser.rotation.x = Math.PI / 2;
  laser.position.z = 2.7;
  laser.visible = false;
  laser.name = 'Laser';
  telescopePivot.add(laser);

  alidade.add(telescopePivot);
  group.add(alidade);

  // Animation: Alidade rotating and telescope tilting, laser firing
  const duration = 6;
  const times = [0, 1.5, 3, 4.5, 6];
  
  const alidadeTrack = new THREE.NumberKeyframeTrack(
    `${alidade.name}.rotation[y]`,
    times,
    [0, Math.PI, Math.PI * 1.5, Math.PI * 0.5, Math.PI * 2]
  );

  const tiltTrack = new THREE.NumberKeyframeTrack(
    `${telescopePivot.name}.rotation[x]`,
    times,
    [0, 0.2, -0.2, 0.1, 0]
  );

  // Laser visibility using scale (0 to 1) for better compatibility
  const laserScaleTrack = new THREE.NumberKeyframeTrack(
    `${laser.name}.scale[y]`,
    [0, 1, 1.01, 1.5, 1.51, 2, 2.01, 4.5, 4.51, 6],
    [0, 0, 1, 1, 0, 0, 1, 1, 0, 0]
  );

  const clip = new THREE.AnimationClip('SurveyScan', duration, [alidadeTrack, tiltTrack, laserScaleTrack]);
  animationClips.push(clip);

  return { group, animationClips };
}
