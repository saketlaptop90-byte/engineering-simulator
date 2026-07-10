import * as THREE from 'three';
export function createHeliumMriCooling() {
  const group = new THREE.Group();
  
  // MRI Tube
  const mriGeo = new THREE.CylinderGeometry(3, 3, 6, 32, 1, true);
  const mriMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.5, side: THREE.DoubleSide });
  const mri = new THREE.Mesh(mriGeo, mriMat);
  mri.rotation.z = Math.PI / 2;
  group.add(mri);

  // Superconducting Coils
  const coilGroup = new THREE.Group();
  for(let i=-2; i<=2; i+=1) {
      const coil = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.2, 16, 64), new THREE.MeshStandardMaterial({ color: 0xcc8833, metalness: 0.8 }));
      coil.rotation.y = Math.PI / 2;
      coil.position.x = i;
      coilGroup.add(coil);
  }
  group.add(coilGroup);

  // Liquid Helium Bath
  const bathGeo = new THREE.CylinderGeometry(3.5, 3.5, 5, 32, 1, true);
  const bathMat = new THREE.MeshPhysicalMaterial({ color: 0x00ffff, transparent: true, opacity: 0.3, transmission: 0.8, side: THREE.DoubleSide });
  const bath = new THREE.Mesh(bathGeo, bathMat);
  bath.rotation.z = Math.PI / 2;
  group.add(bath);

  return {
    group: group,
    description: "MRI Cooling System. Liquid Helium (at 4.2 K) is used to cool the niobium-titanium coils of MRI machines until they become superconducting, allowing massive magnetic fields with zero electrical resistance.",
    parts: [
      { name: "Superconducting Coils", material: "Niobium-Titanium", function: "Generate strong magnetic fields for imaging." },
      { name: "Liquid Helium Bath", material: "Cryogen", function: "Cools the coils below their critical temperature (9.3 K) to achieve superconductivity." }
    ],
    quizQuestions: [
      { question: "What is the primary industrial use of Liquid Helium?", options: ["Filling party balloons", "Cooling superconducting magnets in MRI scanners", "Fuel for space rockets", "Deep sea welding"], correct: 1, explanation: "The largest single use of liquid helium globally is as a cryogenic coolant for the superconducting magnetic coils in MRI machines." }
    ]
  };
}
