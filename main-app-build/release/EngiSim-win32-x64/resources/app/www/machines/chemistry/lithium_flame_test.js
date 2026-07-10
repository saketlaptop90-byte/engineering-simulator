import * as THREE from 'three';
export function createLithiumFlameTest() {
  const group = new THREE.Group();
  
  // A Bunsen burner flame
  const burner = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 2, 16), new THREE.MeshStandardMaterial({color: 0x888888, metalness: 0.8}));
  burner.position.set(0, -2, 0);
  group.add(burner);

  // The Flame (Normally blue, but Lithium makes it Crimson Red)
  const flameGroup = new THREE.Group();
  
  // Create multiple flame layers
  const f1 = new THREE.Mesh(new THREE.ConeGeometry(1.5, 4, 16), new THREE.MeshBasicMaterial({color: 0xff0044, transparent: true, opacity: 0.6}));
  f1.position.set(0, 1, 0);
  const f2 = new THREE.Mesh(new THREE.ConeGeometry(1.0, 3, 16), new THREE.MeshBasicMaterial({color: 0xff3366, transparent: true, opacity: 0.8}));
  f2.position.set(0, 0.5, 0);
  const f3 = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.5, 16), new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.9}));
  f3.position.set(0, -0.2, 0);
  
  flameGroup.add(f1, f2, f3);
  group.add(flameGroup);

  // Floating text "CRIMSON RED"
  const textBg = new THREE.Mesh(new THREE.BoxGeometry(4, 0.8, 0.1), new THREE.MeshBasicMaterial({color: 0xff0044}));
  textBg.position.set(0, 4, 0);
  group.add(textBg);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.2;
      
      // Flickering flame effect
      f1.scale.set(1 + Math.sin(time*speed*10)*0.1, 1 + Math.sin(time*speed*15)*0.1, 1 + Math.sin(time*speed*10)*0.1);
      f2.scale.set(1 + Math.cos(time*speed*12)*0.1, 1 + Math.cos(time*speed*17)*0.1, 1 + Math.cos(time*speed*12)*0.1);
      
      // Text floating
      textBg.position.y = 4 + Math.sin(time*speed*2)*0.2;
  };

  return {
    group: group,
    description: "The Flame Test (Crimson Red). If you throw Lithium salts (like Lithium Chloride) into a fire, the heat excites the Lithium electrons. As they immediately fall back down to the ground state, they emit photons. The specific energy gap in Lithium corresponds to a wavelength of light that our eyes perceive as a brilliant, intense Crimson Red. This is how red fireworks are made!",
    parts: [
      { name: "Crimson Flame", material: "Lithium Emission Spectrum", function: "The visual result of billions of Lithium electrons dropping from excited states back to the 2s orbital." },
      { name: "Metal Tube", material: "Bunsen Burner", function: "Providing the thermal energy to excite the atoms." }
    ],
    quizQuestions: [
      { question: "Why does Lithium produce a red flame, while Copper produces a green flame, and Sodium produces a yellow flame?", options: ["Because they are painted different colors", "Because their nuclei are different colors", "Because every element has a unique set of 'stairs' (orbital energy gaps). The exact distance the electron falls dictates the exact color (wavelength) of the photon emitted.", "Because Lithium burns hotter than Copper"], correct: 2, explanation: "An element's electron configuration is like a fingerprint. Because the distance between Lithium's orbitals is unique to Lithium, the photon it emits when an electron falls has a unique energy, which corresponds to red light." }
    ]
  };
}