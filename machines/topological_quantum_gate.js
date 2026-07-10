import {
  titanium, redAccent, blueAccent, tinted, glass, carbonFiber
} from '../utils/materials.js';

export function createTopologicalQuantumGate(THREE) {
  const group = new THREE.Group();
  const animationClips = [];

  const surfaceGeo = new THREE.PlaneGeometry(6, 6);
  const surfaceMat = tinted(carbonFiber, 0x111122);
  const surface = new THREE.Mesh(surfaceGeo, surfaceMat);
  surface.rotation.x = -Math.PI / 2;
  group.add(surface);

  const anyonGeo = new THREE.TorusGeometry(0.3, 0.1, 16, 32);
  const anyon1 = new THREE.Mesh(anyonGeo, tinted(redAccent, 0xff4444));
  const anyon2 = new THREE.Mesh(anyonGeo, tinted(blueAccent, 0x4444ff));
  const anyon3 = new THREE.Mesh(anyonGeo, tinted(glass, 0x44ff44));

  anyon1.position.set(-2, 0.4, 0);
  anyon2.position.set(0, 0.4, 0);
  anyon3.position.set(2, 0.4, 0);

  anyon1.rotation.x = Math.PI / 2;
  anyon2.rotation.x = Math.PI / 2;
  anyon3.rotation.x = Math.PI / 2;

  group.add(anyon1, anyon2, anyon3);

  // Field generators
  const genGeo = new THREE.ConeGeometry(0.5, 1, 16);
  const genMat = titanium;
  for (let i = 0; i < 4; i++) {
    const gen = new THREE.Mesh(genGeo, genMat);
    gen.position.set(
      (i % 2 === 0 ? 3 : -3),
      0.5,
      (i < 2 ? 3 : -3)
    );
    group.add(gen);
  }

  // Animation: Braiding the anyons
  const times = [0, 1, 2, 3, 4];
  
  // Anyon1 moves to Anyon2's place, Anyon2 moves to Anyon1's place (braiding)
  const pos1 = [-2,0.4,0, -1,0.4,1, 0,0.4,0, -1,0.4,-1, -2,0.4,0];
  const pos2 = [0,0.4,0, -1,0.4,-1, -2,0.4,0, -1,0.4,1, 0,0.4,0];
  const pos3 = [2,0.4,0, 2,0.4,0, 2,0.4,0, 2,0.4,0, 2,0.4,0]; // stays
  
  const rotTimes = [0, 4];
  const rotValues = [Math.PI/2, Math.PI/2 + Math.PI*4];

  const track1 = new THREE.VectorKeyframeTrack(`${anyon1.uuid}.position`, times, pos1);
  const track2 = new THREE.VectorKeyframeTrack(`${anyon2.uuid}.position`, times, pos2);
  const track3 = new THREE.VectorKeyframeTrack(`${anyon3.uuid}.position`, times, pos3);
  
  const rTrack1 = new THREE.NumberKeyframeTrack(`${anyon1.uuid}.rotation[z]`, rotTimes, rotValues);
  const rTrack2 = new THREE.NumberKeyframeTrack(`${anyon2.uuid}.rotation[z]`, rotTimes, rotValues);

  const clip = new THREE.AnimationClip('AnyonBraiding', 4, [track1, track2, track3, rTrack1, rTrack2]);
  animationClips.push(clip);

  return { group, animationClips };
}
