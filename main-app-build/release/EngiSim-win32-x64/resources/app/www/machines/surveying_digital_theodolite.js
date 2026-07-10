import {
  aluminum, steel, blackPlastic, greenPCB, glass, orangeAccent
} from '../utils/materials.js';

export function createDigitalTheodolite(THREE) {
  const group = new THREE.Group();
  const animationClips = [];

  // Tripod
  const tripodGroup = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const legGeo = new THREE.CylinderGeometry(0.04, 0.02, 1.4, 8);
    const leg = new THREE.Mesh(legGeo, orangeAccent);
    leg.position.y = 0.7;
    
    const pivot = new THREE.Group();
    pivot.add(leg);
    pivot.rotation.x = Math.PI / 10;
    
    const wrapper = new THREE.Group();
    wrapper.add(pivot);
    wrapper.rotation.y = (i * Math.PI * 2) / 3;
    wrapper.position.y = 1.35;
    tripodGroup.add(wrapper);
  }
  
  const baseGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 16);
  const base = new THREE.Mesh(baseGeo, aluminum);
  base.position.y = 1.4;
  tripodGroup.add(base);
  group.add(tripodGroup);

  // Alidade
  const alidade = new THREE.Group();
  alidade.name = 'TheodoliteAlidade';
  alidade.position.y = 1.5;
  
  const bodyGeo = new THREE.BoxGeometry(0.2, 0.35, 0.2);
  const body = new THREE.Mesh(bodyGeo, blackPlastic);
  body.position.y = 0.175;
  alidade.add(body);

  // Display Panel
  const panelGeo = new THREE.PlaneGeometry(0.12, 0.18);
  const panel = new THREE.Mesh(panelGeo, greenPCB); 
  panel.position.set(0, 0.175, 0.101);
  alidade.add(panel);

  // Telescope
  const scopeGroup = new THREE.Group();
  scopeGroup.name = 'TheodoliteScope';
  scopeGroup.position.set(0, 0.25, 0);

  const scopeGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.35, 16);
  const scope = new THREE.Mesh(scopeGeo, steel);
  scope.rotation.x = Math.PI / 2;
  scopeGroup.add(scope);

  const lensGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.02, 16);
  const lens = new THREE.Mesh(lensGeo, glass);
  lens.rotation.x = Math.PI / 2;
  lens.position.z = 0.18;
  scopeGroup.add(lens);

  alidade.add(scopeGroup);
  group.add(alidade);

  // Knobs
  const knobGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.05, 16);
  const knob1 = new THREE.Mesh(knobGeo, aluminum);
  knob1.rotation.z = Math.PI / 2;
  knob1.position.set(0.12, 0.1, 0);
  alidade.add(knob1);

  // Animation: manual turning and tilting
  const duration = 8;
  const times = [0, 2, 4, 6, 8];
  
  const turnTrack = new THREE.NumberKeyframeTrack(
    `${alidade.name}.rotation[y]`,
    times,
    [0, Math.PI / 4, Math.PI / 4, Math.PI / 2, Math.PI / 2]
  );

  const tiltTrack = new THREE.NumberKeyframeTrack(
    `${scopeGroup.name}.rotation[x]`,
    times,
    [0, 0, 0.2, 0.2, -0.1]
  );

  const clip = new THREE.AnimationClip('TheodoliteMeasure', duration, [turnTrack, tiltTrack]);
  animationClips.push(clip);

  return { group, animationClips };
}
