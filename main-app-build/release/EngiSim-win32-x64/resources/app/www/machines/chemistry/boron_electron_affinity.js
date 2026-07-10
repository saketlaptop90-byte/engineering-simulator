import * as THREE from 'three';
export function createBoronElectronAffinity() {
  const group = new THREE.Group();
  
  // Boron accepts an electron: Releases 26.7 kJ/mol
  
  const atom = new THREE.Group();
  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000})); atom.add(nuc);
  const shell = new THREE.Mesh(new THREE.RingGeometry(2, 2.05, 32), new THREE.MeshBasicMaterial({color: 0x444444, side: THREE.DoubleSide})); atom.add(shell);
  // 3 Valence electrons already there
  for(let i=0; i<3; i++) {
      const e = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0x00ffff}));
      e.userData = {off: i * Math.PI*2/3};
      atom.add(e);
  }
  group.add(atom);

  // Incoming 4th electron
  const eNew = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0x00ff00}));
  group.add(eNew);

  // Energy release flash
  const flash = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), new THREE.MeshBasicMaterial({color: 0x00ff00, transparent: true, opacity: 0}));
  group.add(flash);

  group.userData.animate = function(delta, time, speed) {
      atom.rotation.x = 0.5;
      
      const cycle = (time * speed * 0.8) % 3;
      
      // Existing electrons orbit
      atom.children.forEach((c, index) => {
          if (c.userData.off !== undefined) {
              const t = time * speed * 2 + c.userData.off;
              c.position.set(Math.cos(t)*2, Math.sin(t)*2, 0);
          }
      });
      
      if (cycle < 1.5) {
          // Incoming
          const t = cycle / 1.5; // 0 to 1
          eNew.position.set(-5 + t*3, 0, 0); // Moving towards atom
          flash.material.opacity = 0;
      } else if (cycle < 1.8) {
          // Captured! Release energy
          eNew.position.set(-2, 0, 0);
          eNew.position.applyAxisAngle(new THREE.Vector3(1,0,0), 0.5);
          flash.material.opacity = 1 - ((cycle-1.5)*3.3);
      } else {
          // Orbiting as a B- anion
          const t = time * speed * 2 + Math.PI; // Opposite side
          eNew.position.set(Math.cos(t)*2, Math.sin(t)*2, 0);
          eNew.position.applyAxisAngle(new THREE.Vector3(1,0,0), 0.5);
      }
  };

  return {
    group: group,
    description: "Electron Affinity. How much does Boron 'want' an extra electron? If you force an extra electron onto a neutral Boron atom (making it a B⁻ anion), the atom will release 26.7 kJ/mol of energy. This is a positive Electron Affinity, meaning Boron actually *likes* getting an extra electron (unlike Beryllium, which rejects them entirely). This happens because Boron's '2p' orbital has plenty of empty space, and the +5 nucleus is strong enough to hold onto a 6th electron.",
    parts: [
      { name: "Cyan Spheres", material: "Existing Valence Electrons", function: "3 electrons already in the shell." },
      { name: "Green Sphere", material: "New Electron", function: "Falling into the empty space in the 2p orbital." },
      { name: "Green Flash", material: "Energy Released", function: "The atom relaxing into a slightly lower energy state as it catches the electron." }
    ],
    quizQuestions: [
      { question: "Why does Boron release energy when it gains an electron, but Beryllium requires you to force the electron in?", options: ["Boron is magic", "Beryllium's 2s orbital is completely full, so a new electron must go to a higher shell. Boron's 2p orbital has lots of empty room.", "Boron is hotter", "Electrons like the letter B"], correct: 1, explanation: "It's all about orbital space! If there is an empty seat on the bus (the 2p orbital), the electron happily sits down and releases energy. If the bus is full (like in Beryllium), you have to force it onto the roof." }
    ]
  };
}