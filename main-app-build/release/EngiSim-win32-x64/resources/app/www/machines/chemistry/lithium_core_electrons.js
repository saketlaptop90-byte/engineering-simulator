import * as THREE from 'three';
export function createLithiumCoreElectrons() {
  const group = new THREE.Group();
  
  // Core Electrons (Remastered)
  
  // The Nucleus
  group.add(new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshPhysicalMaterial({color: 0xff0000})));
  
  // The Core Shell (1s) - Bright, solid, locked down!
  const coreShell = new THREE.Mesh(
      new THREE.SphereGeometry(1.5, 32, 32),
      new THREE.MeshPhysicalMaterial({color: 0x00ffff, transparent: true, opacity: 0.5, transmission: 0.9})
  );
  group.add(coreShell);
  
  // The Core Electrons (cyan, glowing)
  const ceMat = new THREE.MeshPhysicalMaterial({color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 1.0});
  const c1 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), ceMat);
  const c2 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), ceMat);
  group.add(c1, c2);
  
  // The Valence Shell (ghostly, ignored)
  const valShell = new THREE.Mesh(
      new THREE.SphereGeometry(4, 32, 32),
      new THREE.MeshPhysicalMaterial({color: 0x444444, transparent: true, opacity: 0.1, wireframe: true})
  );
  group.add(valShell);
  
  const ve = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshPhysicalMaterial({color: 0x222222, emissive: 0x111111}));
  ve.position.set(4, 0, 0);
  group.add(ve);
  
  // Chains locking the core shell to the nucleus (Visualizing strong binding energy)
  const chainGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.5);
  chainGeo.rotateX(Math.PI/2);
  chainGeo.translate(0, 0, 0.75);
  const chainMat = new THREE.MeshBasicMaterial({color: 0xffaa00});
  
  for(let i=0; i<6; i++) {
      const chain = new THREE.Mesh(chainGeo, chainMat);
      chain.rotation.y = (i/6) * Math.PI * 2;
      group.add(chain);
  }

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 5, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.x = Math.sin(time*speed*0.1)*0.2;
      group.rotation.y = time * speed * 0.1;
      
      // Core electrons tightly orbit
      c1.position.set(Math.cos(time*speed*2)*1.2, Math.sin(time*speed*2)*1.2, 0);
      c2.position.set(-Math.cos(time*speed*2)*1.2, -Math.sin(time*speed*2)*1.2, 0);
  };

  return {
    group: group,
    description: "Core Electrons (Remastered). If valence electrons do all the reacting, what do the core electrons do? Nothing! In this model, we've reversed the highlight. The outer valence electron is dark and ignored, while the inner 1s core electrons (cyan) take center stage. Because they are so close to the positive nucleus, they experience the full, unshielded +3 nuclear charge. This creates a massive binding energy (visualized as gold chains) that permanently locks them in place. They are completely chemically inert, and their only physical job is to provide 'Electron Shielding' for the valence shell!",
    parts: [
      { name: "Cyan Spheres", material: "Core Electrons", function: "Locked in the lowest energy state. Chemically inert." },
      { name: "Gold Chains", material: "Binding Energy", function: "The massive electrostatic force keeping them trapped near the nucleus." }
    ],
    quizQuestions: [
      { question: "Why do core electrons almost never participate in chemical bonds?", options: ["They are too lazy", "They are too close to the nucleus and are held by massive binding energy, making them chemically inert.", "They don't like other atoms", "They are positively charged"], correct: 1, explanation: "It would require a massive, catastrophic amount of energy (like an X-ray laser) to rip a core electron away from the nucleus!" }
    ]
  };
}