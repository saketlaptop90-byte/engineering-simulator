import * as THREE from 'three';
export function createHeliumEnergyLevels() {
  const group = new THREE.Group();
  
  // He energy levels are much deeper. Ground state approx -79 eV total, but first ionization is 24.6 eV
  const levels = [-24.6, -3.9, -1.5, -0.8]; 
  
  levels.forEach((energy, i) => {
    const n = i + 1;
    const yPos = (energy + 25) * 0.2; // scale for view
    
    const planeGeo = new THREE.PlaneGeometry(4, 4);
    const planeMat = new THREE.MeshBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.2, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = Math.PI / 2;
    plane.position.y = yPos;
    
    const ringGeo = new THREE.RingGeometry(n*0.4, n*0.4+0.05, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = yPos;
    
    group.add(plane);
    group.add(ring);
  });

  return {
    group: group,
    description: "Helium Energy Levels. The first ionization energy of Helium is 24.6 eV, the highest of all elements, making it extremely stable.",
    parts: [
      { name: "Ground State (n=1)", material: "Level", function: "First ionization energy = 24.6 eV." },
      { name: "Excited States (n>1)", material: "Levels", function: "Much closer to 0 eV (ionization limit)." }
    ],
    quizQuestions: [
      { question: "Why does Helium have the highest first ionization energy of any element?", options: ["It has the most electrons", "Its 1s electrons are very close to a +2 nucleus and experience minimal shielding", "It is a noble gas", "Because it is radioactive"], correct: 1, explanation: "Helium's two electrons are in the n=1 shell, very close to the +2 nucleus, and they do not shield each other very effectively, resulting in a massive electrostatic attraction." }
    ]
  };
}
