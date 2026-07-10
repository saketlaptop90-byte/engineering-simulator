import * as THREE from 'three';
export function createBoronSchrodinger() {
  const group = new THREE.Group();
  
  // Schrodinger 1926: Real Quantum Orbitals
  // Boron: 1s2, 2s2, 2p1
  
  // 1s (Inner sphere, 2 core electrons)
  const orb1s = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshBasicMaterial({color: 0x0044ff, transparent: true, opacity: 0.3, wireframe: true}));
  group.add(orb1s);
  
  // 2s (Outer sphere, 2 valence electrons)
  const orb2s = new THREE.Mesh(new THREE.SphereGeometry(2.5, 32, 32), new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity: 0.1, wireframe: true}));
  group.add(orb2s);

  // 2p (Dumbbell shape, 1 valence electron)
  const orb2p = new THREE.Group();
  const lobe1 = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), new THREE.MeshBasicMaterial({color: 0xff00ff, transparent: true, opacity: 0.2, wireframe: true}));
  lobe1.scale.set(0.5, 1.5, 0.5);
  lobe1.position.y = 1.5;
  
  const lobe2 = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), new THREE.MeshBasicMaterial({color: 0xff00ff, transparent: true, opacity: 0.2, wireframe: true}));
  lobe2.scale.set(0.5, 1.5, 0.5);
  lobe2.position.y = -1.5;
  
  orb2p.add(lobe1, lobe2);
  group.add(orb2p);

  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), new THREE.MeshBasicMaterial({color: 0xffffff}));
  group.add(nuc);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.2;
      group.rotation.x = time * speed * 0.1;
      
      // Pulse orbitals
      orb1s.scale.setScalar(1 + Math.sin(time*speed*3)*0.05);
      orb2s.scale.setScalar(1 + Math.cos(time*speed*4)*0.05);
      orb2p.scale.setScalar(1 + Math.sin(time*speed*5)*0.05);
  };

  return {
    group: group,
    description: "The Schrödinger Model (1926). This is the modern, highly accurate Quantum Mechanical model! Erwin Schrödinger mathematically proved that electrons do not orbit in flat rings. They exist in 3D shapes called 'Orbitals'. Boron is the very first element to utilize a 'P' orbital! Its electron configuration is 1s², 2s², 2p¹. The inner 2 electrons live in the small blue 1s sphere. The next 2 live in the large cyan 2s sphere. Boron's 5th and final electron lives in the magenta dumbbell-shaped '2p' orbital!",
    parts: [
      { name: "Blue Wire Sphere", material: "1s Orbital", function: "Holds 2 core electrons." },
      { name: "Cyan Wire Sphere", material: "2s Orbital", function: "Holds 2 valence electrons." },
      { name: "Magenta Dumbbell", material: "2p Orbital", function: "Holds Boron's 5th electron. It looks like an hourglass because of complex 3D quantum wave math!" }
    ],
    quizQuestions: [
      { question: "Boron is the very first element on the periodic table to put an electron into which type of orbital?", options: ["An 's' orbital", "A 'd' orbital", "A 'p' orbital (the dumbbell shape)", "An 'f' orbital"], correct: 2, explanation: "Hydrogen to Beryllium only use the spherical 's' orbitals. Boron (Atomic Number 5) is the first to bridge the gap and start filling the dumbbell-shaped 'p' orbitals!" }
    ]
  };
}