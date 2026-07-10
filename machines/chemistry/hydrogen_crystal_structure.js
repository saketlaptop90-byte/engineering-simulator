import * as THREE from 'three';
export function createHydrogenCrystalStructure() {
  const group = new THREE.Group();
  
  // Solid Hydrogen (Molecular HCP lattice)
  const createH2 = (x, y, z) => {
      const m = new THREE.Group();
      const a1 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16,16), new THREE.MeshPhysicalMaterial({color: 0x00ffff, transparent: true, opacity: 0.6}));
      const a2 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16,16), new THREE.MeshPhysicalMaterial({color: 0x00ffff, transparent: true, opacity: 0.6}));
      a1.position.y = 0.2; a2.position.y = -0.2;
      m.add(a1, a2);
      m.position.set(x, y, z);
      
      // Random orientation
      m.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
      return m;
  };

  const lattice = new THREE.Group();
  for(let x=-1; x<=1; x++) {
      for(let y=-1; y<=1; y++) {
          for(let z=-1; z<=1; z++) {
              if (Math.abs(x)+Math.abs(y)+Math.abs(z) < 3) { // rough sphere shape
                  lattice.add(createH2(x*1.5, y*1.5, z*1.5));
              }
          }
      }
  }
  group.add(lattice);

  // Cold effect
  const snow = new THREE.Group();
  for(let i=0; i<30; i++) {
      const flake = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.05), new THREE.MeshBasicMaterial({color: 0xffffff}));
      flake.position.set((Math.random()-0.5)*6, (Math.random()-0.5)*6, (Math.random()-0.5)*6);
      snow.add(flake);
  }
  group.add(snow);

  group.userData.animate = function(delta, time, speed) {
      lattice.rotation.y = time * speed * 0.1;
      snow.rotation.y = -time * speed * 0.2;
      // Rotational zero-point motion of molecules
      lattice.children.forEach(m => {
          m.rotation.x += delta * speed * 0.5;
          m.rotation.y += delta * speed * 0.3;
      });
  };

  return {
    group: group,
    description: "Solid Hydrogen Crystal. Below 14 Kelvin (-259 °C), Hydrogen freezes into a solid. Unlike metals, it forms a molecular crystal lattice where intact H2 molecules are held together by extremely weak Van der Waals forces, allowing the molecules to freely rotate even when frozen.",
    parts: [
      { name: "H2 Molecules", material: "Diatomic", function: "The building blocks of the crystal." },
      { name: "Rotational Freedom", material: "Quantum Effect", function: "Even near absolute zero, the molecules spin freely in the lattice." }
    ],
    quizQuestions: [
      { question: "What is the physical structure of Solid Hydrogen at standard pressures (like 14 Kelvin)?", options: ["A solid block of individual protons", "A metallic lattice where electrons flow freely", "A molecular crystal composed of intact H2 molecules held by weak forces", "A perfect liquid"], correct: 2, explanation: "At low temperatures and standard pressure, Hydrogen freezes into a molecular solid, not an atomic one. The H2 molecules remain intact and stack together like vibrating spheres." }
    ]
  };
}