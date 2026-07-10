import * as THREE from 'three';
export function createLithiumCovalentBonding() {
  const group = new THREE.Group();
  
  // Covalent Bonding (Remastered)
  
  // Two Li atoms that decide to share their 1 valence electron each
  const atom1 = new THREE.Group();
  atom1.add(new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), new THREE.MeshPhysicalMaterial({color: 0xff0000})));
  const orb1 = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), new THREE.MeshPhysicalMaterial({color: 0x00ffff, transparent: true, opacity: 0.2}));
  atom1.add(orb1);
  atom1.position.x = -2.5;
  group.add(atom1);
  
  const atom2 = new THREE.Group();
  atom2.add(new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), new THREE.MeshPhysicalMaterial({color: 0xff0000})));
  const orb2 = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), new THREE.MeshPhysicalMaterial({color: 0xff00ff, transparent: true, opacity: 0.2}));
  atom2.add(orb2);
  atom2.position.x = 2.5;
  group.add(atom2);
  
  // The two shared electrons!
  const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  group.add(e1, e2);
  
  // Glowing overlap region (The Covalent Bond)
  const overlap = new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 1.5, 5, 32),
      new THREE.MeshPhysicalMaterial({color: 0xffffff, transparent: true, opacity: 0.1, emissive: 0xffffff, emissiveIntensity: 0.5})
  );
  overlap.rotation.z = Math.PI/2;
  group.add(overlap);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(0, 5, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.x = Math.sin(time*speed*0.1)*0.2;
      group.rotation.y = Math.sin(time*speed*0.1)*0.2;
      
      // Electrons orbit the entire system, spending most of their time in the middle!
      // Path: Figure-8 or large ellipse
      
      const t = time * speed * 2;
      
      // Electron 1 figure-8
      e1.position.x = Math.cos(t) * 4;
      e1.position.y = Math.sin(t*2) * 1.5;
      
      // Electron 2 figure-8 (opposite phase)
      e2.position.x = Math.cos(t + Math.PI) * 4;
      e2.position.y = Math.sin((t + Math.PI)*2) * 1.5;
      
      // Pulse the overlap region
      overlap.material.opacity = 0.1 + (Math.abs(Math.sin(t*2))*0.2);
  };

  return {
    group: group,
    description: "Covalent Bonding (Remastered). What happens when two atoms of similar strength meet? Neither is strong enough to steal the other's electron! Instead, they reach a compromise: they physically merge their probability clouds and 'share' their valence electrons. This is a 'Covalent Bond'! In this model, watch the two white valence electrons fly in a massive figure-8 pattern around both Lithium nuclei. Notice how they spend the majority of their time in the glowing center overlap region? Because electrons are negative, this dense center cloud of negative charge acts like a powerful glue, pulling both positive nuclei toward the center and locking the atoms together to form a molecule (Li2)!",
    parts: [
      { name: "Cyan/Magenta Spheres", material: "Electron Clouds", function: "Physically overlapping to share space." },
      { name: "White Spheres", material: "Shared Electrons", function: "Orbiting both nuclei in a continuous loop." },
      { name: "Glowing Center", material: "Electron Glue", function: "The region of highest probability, holding the nuclei together." }
    ],
    quizQuestions: [
      { question: "How does a Covalent Bond differ from an Ionic Bond?", options: ["It involves protons instead of electrons", "Electrons are shared between the atoms rather than being completely transferred.", "It only happens in metals", "It involves stealing neutrons"], correct: 1, explanation: "Co-valent literally means 'sharing valence'. The electrons orbit both atoms!" }
    ]
  };
}