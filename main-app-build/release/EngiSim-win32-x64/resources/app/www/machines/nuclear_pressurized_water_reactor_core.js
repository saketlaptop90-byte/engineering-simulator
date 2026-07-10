import materials from '../utils/materials.js';

export function createPressurizedWaterReactorCore(THREE) {
  const group = new THREE.Group();
  
  const vesselMat = materials?.vessel || new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.7, roughness: 0.2, transparent: true, opacity: 0.3 });
  const fuelMat = materials?.fuel || new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x004400 });
  const supportMat = materials?.support || new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.9, roughness: 0.5 });

  // Vessel
  const vessel = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 20, 32), vesselMat);
  group.add(vessel);

  // Core plate
  const plate = new THREE.Mesh(new THREE.CylinderGeometry(4.8, 4.8, 0.5, 32), supportMat);
  plate.position.y = -8;
  group.add(plate);

  // Fuel assemblies
  const fuelGroup = new THREE.Group();
  fuelGroup.name = "FuelAssemblies";
  for (let i = -3; i <= 3; i++) {
    for (let j = -3; j <= 3; j++) {
      if (i*i + j*j <= 10) {
        const assembly = new THREE.Mesh(new THREE.BoxGeometry(0.8, 16, 0.8), fuelMat);
        assembly.position.set(i * 1.0, 0, j * 1.0);
        fuelGroup.add(assembly);
      }
    }
  }
  group.add(fuelGroup);

  const animationClips = [];
  // Pulsing emissive animation for fuel represented by slight scaling
  const scaleTimes = [0, 2, 4];
  const scaleValues = [1,1,1, 1,1.02,1, 1,1,1];
  const track = new THREE.VectorKeyframeTrack('FuelAssemblies.scale', scaleTimes, scaleValues);
  const clip = new THREE.AnimationClip('ReactorActive', 4, [track]);
  animationClips.push(clip);

  return { group, animationClips };
}
