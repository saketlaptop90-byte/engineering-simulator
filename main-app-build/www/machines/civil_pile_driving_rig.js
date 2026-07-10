import { steel, darkSteel, yellowAccent, blackPlastic, orangeAccent, tinted, ceramic } from '../utils/materials.js';

export function createPileDrivingRig(THREE) {
  const group = new THREE.Group();
  
  // Base
  const baseGeom = new THREE.BoxGeometry(4, 1, 6);
  const base = new THREE.Mesh(baseGeom, yellowAccent);
  base.position.set(0, 0.5, 0);
  group.add(base);
  
  // Tracks
  const trackGeom = new THREE.BoxGeometry(1, 1.2, 7);
  const leftTrack = new THREE.Mesh(trackGeom, blackPlastic);
  leftTrack.position.set(-2.5, 0.6, 0);
  group.add(leftTrack);
  const rightTrack = new THREE.Mesh(trackGeom, blackPlastic);
  rightTrack.position.set(2.5, 0.6, 0);
  group.add(rightTrack);
  
  // Cab
  const cabGeom = new THREE.BoxGeometry(2, 2.5, 2);
  const cab = new THREE.Mesh(cabGeom, darkSteel);
  cab.position.set(-1, 2.25, 1);
  group.add(cab);
  
  // Mast Pivot
  const mastPivot = new THREE.Group();
  mastPivot.position.set(0, 1, -2.5);
  group.add(mastPivot);
  
  // Mast
  const mastGeom = new THREE.BoxGeometry(1, 15, 1);
  mastGeom.translate(0, 7.5, 0);
  const mast = new THREE.Mesh(mastGeom, yellowAccent);
  mastPivot.add(mast);
  
  // Braces
  const braceGeom = new THREE.CylinderGeometry(0.1, 0.1, 6);
  const brace = new THREE.Mesh(braceGeom, steel);
  brace.position.set(0, 3, 2);
  brace.rotation.x = -Math.PI / 4;
  mastPivot.add(brace);
  
  // Hammer Guide
  const guideGeom = new THREE.BoxGeometry(1.2, 15, 0.2);
  guideGeom.translate(0, 7.5, -0.6);
  const guide = new THREE.Mesh(guideGeom, steel);
  mastPivot.add(guide);
  
  // Pile
  const concreteMat = tinted(ceramic, 0xaaaaaa);
  const pileGeom = new THREE.CylinderGeometry(0.3, 0.3, 8);
  const pile = new THREE.Mesh(pileGeom, concreteMat);
  pile.name = "Pile";
  pile.position.set(0, 4, -0.8);
  mastPivot.add(pile);
  
  // Hammer
  const hammerGeom = new THREE.BoxGeometry(1.5, 2, 1);
  const hammer = new THREE.Mesh(hammerGeom, orangeAccent);
  hammer.name = "Hammer";
  hammer.position.set(0, 9, -0.8);
  mastPivot.add(hammer);
  
  // Animation: Hammer lifts and drops, Pile slowly goes down
  const times = [];
  const hammerValues = [];
  const pileValues = [];
  
  const numBlows = 4;
  const duration = 4;
  const blowTime = duration / numBlows;
  
  let pileY = 4;
  
  for (let i = 0; i <= numBlows; i++) {
    const tStart = i * blowTime;
    const tLift = tStart + blowTime * 0.7;
    const tDrop = tStart + blowTime * 0.95;
    
    // Lift
    if (i < numBlows) {
      times.push(tStart, tLift, tDrop);
      hammerValues.push(
        0, pileY + 1, -0.8,
        0, pileY + 5, -0.8,
        0, pileY + 1 - 0.5, -0.8
      );
      
      pileValues.push(
        0, pileY, -0.8,
        0, pileY, -0.8,
        0, pileY - 0.5, -0.8
      );
      pileY -= 0.5;
    } else {
      times.push(tStart);
      hammerValues.push(0, pileY + 1, -0.8);
      pileValues.push(0, pileY, -0.8);
    }
  }
  
  const hammerTrack = new THREE.VectorKeyframeTrack('Hammer.position', times, hammerValues);
  const pileTrack = new THREE.VectorKeyframeTrack('Pile.position', times, pileValues);
  
  const clip = new THREE.AnimationClip('Drive', duration, [hammerTrack, pileTrack]);

  return { group, animationClips: [clip] };
}
