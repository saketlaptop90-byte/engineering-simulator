import * as THREE from 'three';
export function createLithiumFirstIonization() {
  const group = new THREE.Group();
  
  // First Ionization Energy (Remastered)
  
  const nucleus = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      new THREE.MeshPhysicalMaterial({color: 0xff4444, metalness: 0.2, roughness: 0.1})
  );
  group.add(nucleus);
  
  const r1 = 1.5;
  const r2 = 3.5;
  
  // Inner core electrons (never ionized in daily chemistry)
  const eMat = new THREE.MeshBasicMaterial({color: 0x00ffff});
  const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), eMat); group.add(e1);
  const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), eMat); group.add(e2);
  
  // The Valence Electron (The target)
  const e3 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0xff00ff})); group.add(e3);
  
  // Incoming Photon (Energy)
  const photon = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 16, 16),
      new THREE.MeshBasicMaterial({color: 0xffff00, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending})
  );
  group.add(photon);
  
  // Force field (showing it is now an ION)
  const field = new THREE.Mesh(
      new THREE.SphereGeometry(2.5, 32, 32),
      new THREE.MeshBasicMaterial({color: 0xff4444, transparent: true, opacity: 0, wireframe: true})
  );
  group.add(field);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.x = 0.3;
      
      e1.position.set(Math.cos(time*speed*2)*r1, 0, Math.sin(time*speed*2)*r1);
      e2.position.set(Math.cos(time*speed*2 + Math.PI)*r1, 0, Math.sin(time*speed*2 + Math.PI)*r1);
      
      const cycle = (time * speed * 0.5) % 5;
      
      if (cycle < 1) {
          // Normal state
          e3.visible = true;
          e3.position.set(Math.cos(time*speed)*r2, 0, Math.sin(time*speed)*r2);
          photon.visible = true;
          
          // Photon zooming in
          const t = cycle; // 0 to 1
          photon.position.copy(e3.position).add(new THREE.Vector3(10 - t*10, 0, 0));
          
          field.material.opacity = 0;
      } else if (cycle < 2) {
          // IMPACT! Electron absorbs the photon and flies away!
          photon.visible = false;
          const t = cycle - 1;
          e3.position.add(new THREE.Vector3(0, t*15, 0)); // Shoots up and away
          
          // Atom becomes a positive ion!
          field.material.opacity = t * 0.5;
          field.rotation.y += delta;
      } else {
          // Gone forever. It is now Li+
          e3.visible = false;
          field.material.opacity = 0.5 + Math.sin(time*speed*5)*0.2;
          field.rotation.y += delta;
      }
  };

  return {
    group: group,
    description: "First Ionization Energy (Remastered). What happens when Lithium gets hit by a high-energy photon? The outer magenta electron absorbs the energy, breaks free from the nucleus's gravity, and is violently ejected from the atom! Because Lithium just lost an electron (which has a negative charge), the remaining atom now has 3 positive protons but only 2 negative electrons. It has become a positively charged Cation (Li+), visualized by the glowing red forcefield! This is the exact process that happens inside a Lithium-Ion battery.",
    parts: [
      { name: "Magenta Electron", material: "Valence Electron", function: "Ejected from the atom." },
      { name: "Yellow Sphere", material: "Incoming Energy", function: "The photon that knocks the electron loose." },
      { name: "Red Wireframe", material: "Positive Charge (Cation)", function: "The resulting Li+ ion after the electron is lost." }
    ],
    quizQuestions: [
      { question: "When a neutral Lithium atom loses its outer electron, what does it become?", options: ["A new element", "A positively charged ion (Li+) because it now has more protons than electrons.", "A negatively charged ion", "It explodes"], correct: 1, explanation: "Losing negative charge makes you positive! This is the fundamental mechanism of electricity in batteries." }
    ]
  };
}