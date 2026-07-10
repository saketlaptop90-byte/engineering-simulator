import * as THREE from 'three';
export function createBoronIonizationEnergy() {
  const group = new THREE.Group();
  
  // Ripping an electron off Boron requires 800.6 kJ/mol
  
  const atom = new THREE.Group();
  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000})); atom.add(nuc);
  const shell = new THREE.Mesh(new THREE.RingGeometry(2, 2.05, 32), new THREE.MeshBasicMaterial({color: 0x444444, side: THREE.DoubleSide})); atom.add(shell);
  group.add(atom);

  // The doomed electron
  const e = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0x00ffff}));
  group.add(e);

  // Laser beam hitting it
  const laser = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 10, 8), new THREE.MeshBasicMaterial({color: 0x00ff00, transparent: true, opacity: 0}));
  laser.rotation.z = Math.PI/2;
  laser.position.set(-5, 2, 0);
  group.add(laser);

  // Energy readout
  const text = new THREE.Mesh(new THREE.BoxGeometry(2, 0.5, 0.1), new THREE.MeshBasicMaterial({color: 0x00ff00}));
  text.position.set(0, -3, 0);
  group.add(text); // "800 kJ/mol"

  group.userData.animate = function(delta, time, speed) {
      atom.rotation.x = 0.5; // Tilt
      
      const cycle = (time * speed * 0.8) % 3;
      
      if (cycle < 1) {
          // Orbiting peacefully
          const t = cycle * Math.PI * 2;
          e.position.set(Math.cos(t)*2, Math.sin(t)*2, 0);
          e.position.applyAxisAngle(new THREE.Vector3(1,0,0), 0.5); // Apply tilt
          laser.material.opacity = 0;
          text.material.color.setHex(0x555555);
      } else if (cycle < 1.5) {
          // ZAP!
          e.position.set(2, 0, 0);
          e.position.applyAxisAngle(new THREE.Vector3(1,0,0), 0.5);
          laser.material.opacity = 1;
          laser.position.set(-3, e.position.y, e.position.z);
          text.material.color.setHex(0x00ff00);
      } else {
          // Ripped away!
          const t = cycle - 1.5;
          e.position.x = 2 + t * 10;
          laser.material.opacity = 0;
      }
  };

  return {
    group: group,
    description: "Ionization Energy. How hard is it to steal an electron from Boron? If you want to rip its outermost electron completely off (turning it into a B+ ion), you have to blast it with 800.6 kJ/mol of energy. This is a moderate amount of energy. It's much easier to rip an electron off Boron than it is for Beryllium (899 kJ/mol). Why? Because Boron's 5th electron sits alone in the '2p' orbital, which is slightly further from the nucleus and heavily shielded by the '2s' electrons!",
    parts: [
      { name: "Cyan Sphere", material: "Outer 2p Electron", function: "The most loosely held electron in Boron." },
      { name: "Green Laser", material: "Ionization Energy", function: "The 800.6 kJ/mol required to overcome the Effective Nuclear Charge." },
      { name: "Flying Away", material: "Ionization", function: "The atom is now a B+ cation." }
    ],
    quizQuestions: [
      { question: "Why is it EASIER to steal an electron from Boron than it is from Beryllium, even though Boron has more protons?", options: ["Because Boron is a gas", "Because Boron's outermost electron is in a '2p' orbital, which is slightly further away and better shielded than Beryllium's tightly packed '2s' electrons", "Because Boron is radioactive", "It is actually harder"], correct: 1, explanation: "This is a classic chemistry exception! Usually, adding protons makes it harder to steal electrons. But because Boron opens up a brand new, further-out 'p' orbital, that single electron is unusually easy to pick off." }
    ]
  };
}