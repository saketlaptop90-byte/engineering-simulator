import * as THREE from 'three';
export function createHydrogenEnergyLevels() {
  const group = new THREE.Group();
  
  // Draw an energy level diagram in 3D
  const levels = [-13.6, -3.4, -1.51, -0.85, -0.54]; // eV
  
  levels.forEach((energy, i) => {
    const n = i + 1;
    // Map energy to Y position (shift up for visibility)
    const yPos = (energy + 14) * 0.5; 
    
    const planeGeo = new THREE.PlaneGeometry(4, 4);
    const planeMat = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.2, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = Math.PI / 2;
    plane.position.y = yPos;
    
    // Add rings to represent the orbit size roughly
    const ringGeo = new THREE.RingGeometry(n*0.5, n*0.5+0.05, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = yPos;
    
    group.add(plane);
    group.add(ring);
  });

  return {
    group: group,
    description: "Hydrogen Energy Levels (n=1 to n=5) showing the convergence of levels as energy approaches 0 eV.",
    parts: [
      { name: "Ground State (n=1)", material: "Level", function: "Energy = -13.6 eV" },
      { name: "n=2 Level", material: "Level", function: "Energy = -3.4 eV" },
      { name: "n=3 Level", material: "Level", function: "Energy = -1.51 eV" },
      { name: "Higher Levels", material: "Level", function: "Converging towards 0 eV (ionization limit)." }
    ]
  };
}
