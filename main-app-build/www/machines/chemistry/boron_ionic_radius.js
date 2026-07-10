import * as THREE from 'three';
export function createBoronIonicRadius() {
  const group = new THREE.Group();
  
  // Neutral Boron (87 pm) vs B3+ Cation (27 pm)
  
  // Neutral
  const bAtom = new THREE.Group();
  bAtom.add(new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000})));
  bAtom.add(new THREE.Mesh(new THREE.SphereGeometry(1.74, 32, 32), new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity: 0.3})));
  bAtom.position.set(-2, 0, 0);
  group.add(bAtom);
  
  // Ion (B3+)
  const ionAtom = new THREE.Group();
  ionAtom.add(new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000})));
  // Radius is dramatically smaller when 3 valence electrons are removed
  ionAtom.add(new THREE.Mesh(new THREE.SphereGeometry(0.54, 32, 32), new THREE.MeshBasicMaterial({color: 0xff00ff, transparent: true, opacity: 0.6})));
  ionAtom.position.set(2, 0, 0);
  group.add(ionAtom);
  
  // Animation: Electrons flying off the neutral atom to become the ion
  const eGrp = new THREE.Group();
  for(let i=0; i<3; i++) {
      const e = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8,8), new THREE.MeshBasicMaterial({color: 0x00ffff}));
      eGrp.add(e);
  }
  group.add(eGrp);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = Math.sin(time*speed*0.5)*0.2;
      
      const cycle = (time * speed * 0.5) % 2;
      
      if (cycle < 1) {
          // Neutral
          bAtom.visible = true;
          ionAtom.visible = false;
          
          eGrp.children.forEach((e, i) => {
              const angle = i * Math.PI*2/3 + time*speed*5;
              e.position.set(-2 + Math.cos(angle)*1.74, Math.sin(angle)*1.74, 0);
          });
      } else {
          // Becomes Ion!
          bAtom.visible = false;
          ionAtom.visible = true;
          
          const t = cycle - 1;
          eGrp.children.forEach((e, i) => {
              const angle = i * Math.PI*2/3;
              e.position.set(2 + Math.cos(angle)*(0.54 + t*5), Math.sin(angle)*(0.54 + t*5), 0);
          });
      }
  };

  return {
    group: group,
    description: "Ionic Radius (B³⁺). What happens to Boron's size if it loses all 3 of its valence electrons? It becomes a B³⁺ cation. The size change is absolutely massive. It shrinks from 87 picometers down to just 27 picometers! Why? Because you completely emptied the entire 2nd electron shell. The only electrons left are the 2 core electrons sitting tightly against the nucleus. Also, those 5 protons are now pulling on only 2 electrons, yanking them incredibly close.",
    parts: [
      { name: "Cyan Sphere", material: "Neutral Boron", function: "Has all 3 valence electrons in the large 2nd shell." },
      { name: "Magenta Sphere", material: "B³⁺ Ion", function: "Valence shell is gone. It is less than a third of its original size." }
    ],
    quizQuestions: [
      { question: "Why does the B³⁺ ion shrink so dramatically compared to the neutral atom?", options: ["Because cold things shrink", "Because it lost its entire outer electron shell, and the 5 protons now have a massive grip on the remaining 2 electrons", "Because gravity crushed it", "Because it turned into Helium"], correct: 1, explanation: "Removing all the valence electrons deletes the outermost 'floor' of the atom. The remaining core electrons are also sucked in tighter because there are fewer electrons repelling each other." }
    ]
  };
}