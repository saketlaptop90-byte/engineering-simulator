import * as THREE from 'three';
export function createHeliumCrystalStructure() {
  const group = new THREE.Group();
  
  // Solid Helium (Requires extreme pressure)
  // Usually Hexagonal Close Packed (HCP) or Body Centered Cubic (BCC)
  
  const lattice = new THREE.Group();
  
  const createAtom = (x,y,z) => {
      const mat = new THREE.MeshPhysicalMaterial({color: 0x00ffff, transparent: true, opacity: 0.8, transmission: 0.9, roughness: 0.1});
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16,16), mat);
      mesh.position.set(x,y,z);
      return mesh;
  }

  // Hexagonal layer
  const r = 1.3;
  lattice.add(createAtom(0, 0, 0));
  for(let i=0; i<6; i++) {
      lattice.add(createAtom(r*Math.cos(i*Math.PI/3), 0, r*Math.sin(i*Math.PI/3)));
  }
  // Offset layers
  for(let i=0; i<3; i++) {
      lattice.add(createAtom(r*Math.cos(i*Math.PI/1.5 + Math.PI/3), 1.1, r*Math.sin(i*Math.PI/1.5 + Math.PI/3)));
      lattice.add(createAtom(r*Math.cos(i*Math.PI/1.5 + Math.PI/3), -1.1, r*Math.sin(i*Math.PI/1.5 + Math.PI/3)));
  }

  group.add(lattice);

  // Pressing pistons
  const pTop = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 0.5, 32), new THREE.MeshStandardMaterial({color: 0x555555}));
  const pBot = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 0.5, 32), new THREE.MeshStandardMaterial({color: 0x555555}));
  group.add(pTop, pBot);

  group.userData.animate = function(delta, time, speed) {
      lattice.rotation.y = time * speed * 0.2;
      
      // Pistons compressing heavily
      const press = 2.0 + Math.sin(time*speed*2)*0.2;
      pTop.position.y = press;
      pBot.position.y = -press;
      
      // Atoms vibrating under pressure
      lattice.children.forEach((a, i) => {
          a.scale.setScalar(1 + Math.sin(time*speed*10 + i)*0.05);
      });
  };

  return {
    group: group,
    description: "Solid Helium (Crystal Structure). Helium is the ONLY element that will NOT freeze into a solid at absolute zero (-273 °C) under normal pressure. Because its quantum zero-point energy is so high, it remains a liquid. To force Helium to crystallize into a solid (HCP lattice), you must apply at least 25 atmospheres of extreme pressure while it is near absolute zero.",
    parts: [
      { name: "Helium Atoms", material: "Cyan Spheres", function: "Packed tightly into a Hexagonal Close-Packed structure." },
      { name: "Pistons", material: "Grey Metal", function: "Representing the massive 25+ atm of pressure required to prevent the atoms from liquefying." }
    ],
    quizQuestions: [
      { question: "What is unique about freezing Helium compared to every other element?", options: ["It freezes at room temperature", "It expands when it freezes", "It cannot be frozen by cooling alone; it requires extreme pressure even at absolute zero", "It turns into a plasma when frozen"], correct: 2, explanation: "Helium is so light and interacts so weakly that its quantum 'zero-point motion' (the lowest possible vibration allowed by quantum mechanics) is enough to keep it in a liquid state at 0 Kelvin. You must apply pressure to physically force it into a solid crystal." }
    ]
  };
}