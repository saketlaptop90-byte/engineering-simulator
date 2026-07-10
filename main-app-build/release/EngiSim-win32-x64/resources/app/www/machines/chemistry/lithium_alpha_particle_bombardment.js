import * as THREE from 'three';
export function createLithiumAlphaBombardment() {
  const group = new THREE.Group();
  
  // Historical experiment (Cockcroft-Walton 1932: Splitting the atom)
  
  // Target: Lithium-7 Nucleus (3p, 4n)
  const li7 = new THREE.Group();
  for(let i=0; i<3; i++) {
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshPhysicalMaterial({color: 0xff0000})); p.position.set(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5); li7.add(p);
  }
  for(let i=0; i<4; i++) {
      const n = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshPhysicalMaterial({color: 0xaaaaaa})); n.position.set(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5); li7.add(n);
  }
  group.add(li7);

  // Incoming: Proton (Hydrogen nucleus)
  const proton = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshPhysicalMaterial({color: 0xff0000}));
  group.add(proton);

  // Products: Two Alpha particles (Helium-4 nuclei: 2p, 2n each)
  const alpha1 = new THREE.Group();
  alpha1.add(new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000})).position.set(0.2,0,0));
  alpha1.add(new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000})).position.set(-0.2,0,0));
  alpha1.add(new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0xaaaaaa})).position.set(0,0.2,0));
  alpha1.add(new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0xaaaaaa})).position.set(0,-0.2,0));
  
  const alpha2 = alpha1.clone();
  group.add(alpha1, alpha2);

  // Flash
  const flash = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0}));
  group.add(flash);

  group.userData.animate = function(delta, time, speed) {
      const cycle = (time * speed) % 5;
      
      if (cycle < 1.5) {
          // Approach
          proton.position.set(-5 + cycle*3.33, 0, 0); // reaches 0 at 1.5
          proton.visible = true;
          li7.visible = true;
          alpha1.visible = false; alpha2.visible = false;
          flash.material.opacity = 0;
          alpha1.position.set(0,0,0); alpha2.position.set(0,0,0);
      } else if (cycle < 1.7) {
          // Strike & Explode!
          proton.visible = false;
          li7.visible = false;
          flash.material.opacity = 1 - (cycle-1.5)*5;
          alpha1.visible = true; alpha2.visible = true;
      } else {
          // Fly apart
          const t = cycle - 1.7;
          alpha1.position.set(t*3, t*3, 0);
          alpha2.position.set(-t*3, -t*3, 0);
          alpha1.rotation.z += 0.1;
          alpha2.rotation.z += 0.1;
      }
  };

  return {
    group: group,
    description: "Splitting the Atom (1932). In 1932, Cockcroft and Walton fired a high-speed proton at a Lithium-7 target. The proton (1p) merged with the Lithium (3p, 4n) to briefly form Beryllium-8 (4p, 4n). This was incredibly unstable and immediately split perfectly in half, creating two Helium-4 nuclei (Alpha particles) that flew apart with massive energy. This was the first artificial splitting of an atom in human history!",
    parts: [
      { name: "Single Red Sphere", material: "Incoming Proton", function: "Fired from a particle accelerator." },
      { name: "Clustered Nucleus", material: "Lithium-7 Target", function: "Absorbs the proton." },
      { name: "Two Flying Clusters", material: "Helium Nuclei (Alpha Particles)", function: "The resulting shrapnel from the split." }
    ],
    quizQuestions: [
      { question: "When a proton (1p) hits Lithium-7 (3p, 4n) and splits it perfectly in half, what are the two identical resulting pieces?", options: ["Two Hydrogen atoms", "Two Helium-4 nuclei (2 protons, 2 neutrons each)", "Two Lithium-3 atoms", "Carbon"], correct: 1, explanation: "Math is beautiful. (1p, 0n) + (3p, 4n) = (4p, 4n). If you split (4p, 4n) exactly in half, you get two pieces that are (2p, 2n). A nucleus with 2 protons is Helium!" }
    ]
  };
}