import * as THREE from 'three';
export function createLithiumSecondIonization() {
  const group = new THREE.Group();
  
  // Second Ionization Energy (Remastered)
  
  const nucleus = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      new THREE.MeshPhysicalMaterial({color: 0xff4444, metalness: 0.2, roughness: 0.1})
  );
  group.add(nucleus);
  
  const r1 = 1.5; // Inner shell
  
  // Inner core electrons (1s orbital)
  const eMat = new THREE.MeshBasicMaterial({color: 0x00ffff});
  const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), eMat); group.add(e1);
  const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), eMat); group.add(e2);
  
  // Notice there is NO outer electron. This is already Li+
  
  // Incoming Photon (MASSIVE energy required to break the core shell, e.g. a Gamma Ray)
  const gammaGeo = new THREE.BufferGeometry();
  const gammaPos = new Float32Array(100 * 3);
  for(let i=0; i<100; i++) {
      gammaPos[i*3] = i * 0.1 - 5;
      gammaPos[i*3+1] = Math.sin(i*0.5) * 0.5;
      gammaPos[i*3+2] = 0;
  }
  gammaGeo.setAttribute('position', new THREE.BufferAttribute(gammaPos, 3));
  const gamma = new THREE.Line(gammaGeo, new THREE.LineBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.8}));
  group.add(gamma);
  
  // Shielding Force field
  const shield = new THREE.Mesh(
      new THREE.SphereGeometry(2.0, 32, 32),
      new THREE.MeshPhysicalMaterial({color: 0x00aaff, transparent: true, opacity: 0.4, transmission: 0.9, clearcoat: 1.0})
  );
  group.add(shield);
  
  // Deflected
  const flash = new THREE.Mesh(new THREE.SphereGeometry(1.5, 16, 16), new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, blending: THREE.AdditiveBlending, opacity: 0}));
  group.add(flash);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.x = 0.3;
      
      e1.position.set(Math.cos(time*speed*5)*r1, 0, Math.sin(time*speed*5)*r1);
      e2.position.set(Math.cos(time*speed*5 + Math.PI)*r1, 0, Math.sin(time*speed*5 + Math.PI)*r1);
      
      const cycle = (time * speed) % 6;
      
      if (cycle < 2) {
          // Gamma ray approaches
          gamma.visible = true;
          gamma.position.x = cycle * 5 - 10; // moves from -10 to 0
          flash.material.opacity = 0;
      } else if (cycle < 2.5) {
          // Hits the core shell but FAILS to ionize it normally, bouncing off!
          gamma.position.x = 0;
          flash.material.opacity = 1.0;
          shield.scale.setScalar(1 + (cycle-2)*2); // shield flexes
      } else {
          // Gamma ray deflects away
          gamma.position.x += delta * speed * 20;
          gamma.position.y += delta * speed * 10;
          flash.material.opacity = Math.max(0, flash.material.opacity - delta*speed*5);
          shield.scale.setScalar(1);
      }
  };

  return {
    group: group,
    description: "Second Ionization Energy (Remastered). You saw how easily Lithium loses its first (outer) electron. But what if you try to steal a SECOND electron? The remaining two electrons form a complete, stable, perfectly balanced 'noble gas' core (the 1s shell), protected by the powerful pull of 3 positive protons. It is mathematically PERFECT. Trying to break this core requires a staggering amount of energy! While the 1st ionization takes only 520 kJ/mol, the 2nd ionization requires an absurd 7,298 kJ/mol! Normal chemical reactions cannot provide this energy, which is why Lithium forms Li+ ions, but NEVER Li+2 ions.",
    parts: [
      { name: "Cyan Core", material: "Stable 1s Orbital", function: "A completed electron shell, rendering it virtually indestructible." },
      { name: "White Wave", material: "High Energy Photon", function: "Attempting (and failing) to blast a core electron away." }
    ],
    quizQuestions: [
      { question: "Why does it take nearly 14 times more energy to remove Lithium's second electron compared to the first?", options: ["Because the second electron is glued in place", "Because the second electron is part of a stable, complete inner shell that is much closer to the nucleus's positive pull.", "Because the photon missed", "Because the atom gets heavier"], correct: 1, explanation: "Electrons 'shield' each other. The outer electron is shielded by the inner ones, but the inner ones feel the full, raw power of the nucleus!" }
    ]
  };
}