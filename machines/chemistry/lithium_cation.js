import * as THREE from 'three';
export function createLithiumCation() {
  const group = new THREE.Group();
  
  // Lithium Cation (Li+) vs Neutral Atom (Remastered)
  
  const createAtom = (isCation) => {
      const g = new THREE.Group();
      
      // Nucleus
      const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), new THREE.MeshPhysicalMaterial({color: 0xff0000, metalness: 0.2, roughness: 0.1}));
      g.add(nuc);
      
      // 1s Orbital (Inner core, always present)
      const inner = new THREE.Mesh(
          new THREE.SphereGeometry(1.5, 32, 32),
          new THREE.MeshPhysicalMaterial({color: 0x00ffff, transparent: true, opacity: 0.6, roughness: 0.1, transmission: 0.5})
      );
      g.add(inner);
      
      // 2s Orbital (Valence, only present in neutral atom)
      if (!isCation) {
          const outer = new THREE.Mesh(
              new THREE.SphereGeometry(4.0, 32, 32),
              new THREE.MeshPhysicalMaterial({color: 0xff00ff, transparent: true, opacity: 0.2, roughness: 0.5, transmission: 0.5})
          );
          g.add(outer);
      } else {
          // If cation, add a strong positive electric field aura
          const aura = new THREE.Mesh(
              new THREE.SphereGeometry(2.0, 32, 32),
              new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.3, wireframe: true, blending: THREE.AdditiveBlending})
          );
          g.add(aura);
          g.userData.aura = aura;
      }
      
      return g;
  };
  
  // Left: Neutral Lithium
  const neutral = createAtom(false);
  neutral.position.x = -5;
  group.add(neutral);
  
  // Right: Lithium Cation (Li+)
  const cation = createAtom(true);
  cation.position.x = 5;
  group.add(cation);
  
  // Labels
  const makeLabel = (textHex, x) => {
      const g = new THREE.Group();
      const plate = new THREE.Mesh(new THREE.BoxGeometry(3, 0.5, 0.1), new THREE.MeshBasicMaterial({color: textHex}));
      plate.position.set(x, -5, 0);
      g.add(plate);
      return g;
  };
  group.add(makeLabel(0xff00ff, -5)); // Neutral
  group.add(makeLabel(0xff0000, 5)); // Cation

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 5, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.x = 0.2;
      group.rotation.y = Math.sin(time*speed*0.1)*0.2;
      
      if(cation.userData.aura) {
          cation.userData.aura.rotation.y -= delta * speed;
          cation.userData.aura.rotation.x -= delta * speed;
          cation.userData.aura.scale.setScalar(1 + Math.sin(time*speed*5)*0.05);
      }
  };

  return {
    group: group,
    description: "Lithium Cation (Li+) Ionic Radius (Remastered). On the left is a neutral Lithium atom. On the right is a Lithium Cation (Li+). Notice how unbelievably tiny the Cation is? When Lithium loses its 1 outer electron, the entire massive 2s orbital completely disappears! The only electrons left are the 2 tightly bound inner electrons in the 1s orbital. Furthermore, because there are still 3 positive protons pulling on only 2 negative electrons, the remaining cloud is sucked in even tighter! This tiny size allows Li+ ions to effortlessly slide through materials, which is why Lithium-ion batteries charge so fast!",
    parts: [
      { name: "Giant Magenta Sphere", material: "Neutral Lithium", function: "Atomic radius is 152 picometers." },
      { name: "Tiny Cyan/Red Sphere", material: "Lithium Cation (Li+)", function: "Ionic radius is only 76 picometers—half the size!" }
    ],
    quizQuestions: [
      { question: "Why does the Lithium atom shrink so dramatically when it becomes an ion?", options: ["It loses its entire outer electron shell (the 2s orbital), and the 3 protons pull the remaining 2 electrons even tighter.", "Because it loses a proton", "Because it cools down", "Because the electrons get heavier"], correct: 1, explanation: "This drastic reduction in size is called 'Ionic Radius'. The tiny Li+ ion is highly mobile, making it the perfect charge carrier for batteries." }
    ]
  };
}