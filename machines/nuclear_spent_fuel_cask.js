import materials from '../utils/materials.js';

export function createSpentFuelCask(THREE) {
  const group = new THREE.Group();
  
  const caskMat = materials?.cask || new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.5, roughness: 0.6 });
  const fuelMat = materials?.spentFuel || new THREE.MeshStandardMaterial({ color: 0x00aaff, emissive: 0x002255, transparent: true, opacity: 0.8 });

  // Main Cask Body
  const body = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 12, 32), caskMat);
  group.add(body);

  // Cooling fins
  for (let i = 0; i < 16; i++) {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(7.5, 10, 0.1), caskMat);
    fin.rotation.y = (Math.PI / 8) * i;
    group.add(fin);
  }

  // Cap
  const capGroup = new THREE.Group();
  capGroup.name = "CaskCap";
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.6, 1, 32), caskMat);
  capGroup.position.y = 6.5;
  capGroup.add(cap);
  group.add(capGroup);

  // Internal Fuel Representation
  const innerFuel = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 10, 16), fuelMat);
  group.add(innerFuel);

  const animationClips = [];
  // Loading/Unloading animation
  const times = [0, 2, 4, 6];
  const values = [6.5, 6.5, 6.5,  8.5, 8.5, 8.5,  8.5, 8.5, 8.5,  6.5, 6.5, 6.5];
  const track = new THREE.VectorKeyframeTrack('CaskCap.position', times, values);
  const clip = new THREE.AnimationClip('LoadFuel', 6, [track]);
  animationClips.push(clip);

  return { group, animationClips };
}
