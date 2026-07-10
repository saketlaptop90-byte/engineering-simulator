import * as THREE from 'three';
export function createBoronMetalloid() {
  const group = new THREE.Group();
  
  // Demonstrating Semi-conductivity (The hallmark of a metalloid)
  
  // Crystal lattice of Boron
  const lattice = new THREE.Group();
  for(let x=-1.5; x<=1.5; x+=1.5) {
      for(let y=-1.5; y<=1.5; y+=1.5) {
          const atom = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshStandardMaterial({color: 0x444444, roughness: 0.8}));
          atom.position.set(x, y, 0);
          lattice.add(atom);
      }
  }
  group.add(lattice);

  // Electrical current (electrons trying to pass)
  const current = new THREE.Group();
  for(let i=0; i<5; i++) {
      const e = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), new THREE.MeshBasicMaterial({color: 0x00ffff}));
      e.userData = { offset: Math.random() * Math.PI * 2, y: (Math.random()-0.5)*3 };
      current.add(e);
  }
  group.add(current);
  
  // Heat source (Laser/fire)
  const heat = new THREE.Mesh(new THREE.BoxGeometry(4, 0.5, 0.5), new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0}));
  heat.position.set(0, -2, 0);
  group.add(heat);

  group.userData.animate = function(delta, time, speed) {
      const cycle = (time * speed * 0.5) % 2;
      
      if (cycle < 1) {
          // Cold: Insulator
          heat.material.opacity = 0;
          lattice.children.forEach(a => a.material.emissive.setHex(0x000000));
          
          // Electrons struggle to pass, barely move
          current.children.forEach(e => {
              e.position.set(-2, e.userData.y, 0);
              e.material.opacity = 0.2;
              e.material.transparent = true;
          });
      } else {
          // Hot: Conductor
          heat.material.opacity = 0.8;
          lattice.children.forEach(a => a.material.emissive.setHex(0x220000)); // Glowing red
          
          // Electrons zip through!
          current.children.forEach((e, i) => {
              e.material.opacity = 1;
              let x = -2 + ((time * speed * 5 + e.userData.offset) % 4); // Zip left to right
              e.position.set(x, e.userData.y, Math.sin(x*10)*0.1); // Jiggle through lattice
          });
      }
  };

  return {
    group: group,
    description: "The Metalloid (Semiconductor). Boron is not a true metal, nor is it a non-metal. It is a 'Metalloid'. What does that mean? It means it acts like both! At room temperature, Boron is an electrical insulator (like rubber or plastic)—electricity cannot flow through it. However, if you heat it up, it suddenly becomes a conductor (like copper wires)! This ability to switch electricity on and off based on temperature is what makes semiconductors so incredibly valuable in modern electronics.",
    parts: [
      { name: "Dark Spheres", material: "Boron Crystal", function: "The rigid molecular structure." },
      { name: "Cyan Dots", material: "Electricity (Electrons)", function: "Trying to pass through the material." },
      { name: "Red Glow", material: "Heat Energy", function: "Provides the energy needed to free the electrons and allow conduction." }
    ],
    quizQuestions: [
      { question: "What defines a material as a 'Semiconductor'?", options: ["It conducts electricity exactly half the time", "It behaves as an insulator when cold, but becomes an electrical conductor when heated or given energy", "It is made of half metal and half wood", "It is magnetic"], correct: 1, explanation: "Metals ALWAYS conduct electricity. Non-metals NEVER conduct. Semiconductors like Boron and Silicon have a 'band gap'—they need a little kick of energy (heat/light) to let electricity flow." }
    ]
  };
}