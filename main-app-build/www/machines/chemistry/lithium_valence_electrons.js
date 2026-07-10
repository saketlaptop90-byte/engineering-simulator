import * as THREE from 'three';
export function createLithiumValenceElectrons() {
  const group = new THREE.Group();
  
  // Valence Electrons (Remastered)
  
  // Nucleus
  group.add(new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshPhysicalMaterial({color: 0xff0000})));
  
  // Ghostly core (1s)
  const core = new THREE.Mesh(
      new THREE.SphereGeometry(1.5, 32, 32),
      new THREE.MeshPhysicalMaterial({color: 0x444444, transparent: true, opacity: 0.2, wireframe: true})
  );
  group.add(core);
  
  // Core electrons (dark, boring, inert)
  const eMat = new THREE.MeshPhysicalMaterial({color: 0x222222, emissive: 0x111111});
  const c1 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), eMat);
  const c2 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), eMat);
  group.add(c1, c2);
  
  // The Valence Shell (2s) - Bright, pulsating, active!
  const valShell = new THREE.Mesh(
      new THREE.SphereGeometry(4, 32, 32),
      new THREE.MeshPhysicalMaterial({color: 0xff00ff, transparent: true, opacity: 0.2, transmission: 0.9})
  );
  group.add(valShell);
  
  // The Star of the Show: The Valence Electron
  const ve = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 32, 32),
      new THREE.MeshPhysicalMaterial({color: 0xff00ff, emissive: 0xff00ff, emissiveIntensity: 1.0})
  );
  
  // Add a glowing halo around the valence electron
  const halo = new THREE.Mesh(
      new THREE.SphereGeometry(0.8, 32, 32),
      new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending})
  );
  ve.add(halo);
  group.add(ve);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 5, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      
      // Core electrons move slowly and boringly
      c1.position.set(Math.cos(time*speed)*1.2, Math.sin(time*speed)*1.2, 0);
      c2.position.set(-Math.cos(time*speed)*1.2, -Math.sin(time*speed)*1.2, 0);
      
      // Valence electron moves dynamically around the outer shell
      const t = time * speed * 0.8;
      ve.position.set(Math.cos(t)*4, Math.sin(t*1.5)*2, Math.sin(t)*4);
      
      // Pulse the valence shell
      valShell.scale.setScalar(1 + Math.sin(time*speed*3)*0.03);
      halo.scale.setScalar(1 + Math.sin(time*speed*10)*0.2); // rapidly flicker
  };

  return {
    group: group,
    description: "Valence Electrons (Remastered). When atoms bump into each other, their nuclei and inner core electrons never touch. Only the absolute outermost electrons ever interact with the outside world. These are called 'Valence Electrons'. They are the absolute most important part of any atom, because they exclusively dictate how the atom will chemically react! In this model, the inner core is rendered dark and inert. The single 2s valence electron (magenta) is rendered bright and glowing. Because Lithium only has ONE valence electron, it is highly unstable and will violently react to give it away, making it an incredible energy source for batteries!",
    parts: [
      { name: "Magenta Glowing Sphere", material: "Valence Electron", function: "The outermost electron. The only one that participates in chemical reactions." },
      { name: "Dark Inner Spheres", material: "Core Electrons", function: "Chemically inert. They do nothing but shield the nucleus." }
    ],
    quizQuestions: [
      { question: "Why are valence electrons considered the most important part of an atom?", options: ["They are the heaviest", "Because they are on the outside edge of the atom, they are the only ones that interact and form chemical bonds.", "Because they are radioactive", "Because they live in the nucleus"], correct: 1, explanation: "Chemistry is entirely the study of how atoms trade and share their outermost valence electrons!" }
    ]
  };
}