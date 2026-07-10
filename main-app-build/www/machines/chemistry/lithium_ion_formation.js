import * as THREE from 'three';
export function createLithiumIonFormation() {
  const group = new THREE.Group();
  
  // Left: Neutral Li
  const li = new THREE.Group();
  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  const core = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 16), new THREE.MeshBasicMaterial({color: 0x00ffff, wireframe: true, transparent: true, opacity: 0.5}));
  const val = new THREE.Mesh(new THREE.SphereGeometry(3.5, 32, 16), new THREE.MeshBasicMaterial({color: 0xff00ff, wireframe: true, transparent: true, opacity: 0.3}));
  li.add(nuc, core, val);
  
  const vElec = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16,16), new THREE.MeshBasicMaterial({color: 0xffff00}));
  val.add(vElec);
  group.add(li);

  // Energy photon striking
  const photon = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  group.add(photon);
  
  // Explosion flash
  const flash = new THREE.Mesh(new THREE.SphereGeometry(4, 32, 32), new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0}));
  group.add(flash);

  group.userData.animate = function(delta, time, speed) {
      core.rotation.y = time * speed * 0.5;
      val.rotation.x = time * speed * 0.2;
      
      const cycle = (time * speed) % 5;
      
      if (cycle < 1) {
          // Photon approaches
          photon.position.set(-5 + cycle*5, 0, 0);
          vElec.position.set(3.5, 0, 0);
          val.visible = true;
          flash.material.opacity = 0;
      } else if (cycle < 1.2) {
          // Strike!
          photon.position.set(0,0,0); photon.visible = false;
          flash.material.opacity = 1 - (cycle-1)*5;
      } else {
          // Ionization: Electron flies away, shell disappears
          const t = cycle - 1.2;
          vElec.position.set(3.5 + t*5, t*2, 0);
          val.visible = false; // Shell collapses!
      }
      
      if (cycle > 4.8) { photon.visible = true; } // reset
  };

  return {
    group: group,
    description: "Ion Formation (Ionization Energy). Removing an electron from an atom requires energy (called Ionization Energy). For Lithium's valence electron, this energy is quite low. When sufficient energy (like a photon or heat) strikes the atom, the valence electron is blasted out of orbit. The entire n=2 shell instantly ceases to exist, leaving behind a tiny, stable Li+ cation.",
    parts: [
      { name: "White Ball", material: "Incoming Energy", function: "Striking the atom to knock the electron loose." },
      { name: "Yellow Dot", material: "Ejected Electron", function: "Leaving the atom permanently." },
      { name: "Disappearing Shell", material: "n=2 Collapse", function: "With no electron to occupy it, the shell vanishes." }
    ],
    quizQuestions: [
      { question: "When Lithium's single valence electron is ejected, what happens to the n=2 shell?", options: ["It turns into a solid wall", "It remains empty but stays the same size", "It effectively ceases to exist, causing the atomic radius to shrink down to the n=1 core shell", "It explodes and destroys the atom"], correct: 2, explanation: "An orbital is just a region where an electron is likely to be. If there are no electrons in that shell, the 'size' of the atom shrinks down to the highest occupied shell (the n=1 core)." }
    ]
  };
}