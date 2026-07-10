import * as THREE from 'three';
export function createLithiumBohrModel() {
  const group = new THREE.Group();
  
  // Bohr Model (Remastered) - Electron jumping orbits and emitting photons
  
  // Nucleus
  const nucleus = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      new THREE.MeshPhysicalMaterial({color: 0xff4444, metalness: 0.2, roughness: 0.1})
  );
  group.add(nucleus);
  
  // Orbital Rings (N=1, N=2)
  const r1 = 2.0;
  const r2 = 4.0;
  
  const ringMat = new THREE.LineBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.3});
  const circleGeo1 = new THREE.BufferGeometry().setFromPoints(new THREE.Path().absarc(0,0, r1, 0, Math.PI*2).getPoints(64));
  const circleGeo2 = new THREE.BufferGeometry().setFromPoints(new THREE.Path().absarc(0,0, r2, 0, Math.PI*2).getPoints(64));
  
  const orbit1 = new THREE.LineLoop(circleGeo1, ringMat); orbit1.rotation.x = Math.PI/2; group.add(orbit1);
  const orbit2 = new THREE.LineLoop(circleGeo2, ringMat); orbit2.rotation.x = Math.PI/2; group.add(orbit2);
  
  // Electrons
  const eMat = new THREE.MeshBasicMaterial({color: 0x00ffff});
  const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), eMat); group.add(e1);
  const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), eMat); group.add(e2);
  const e3 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0xff00ff})); group.add(e3); // The active valence one
  
  // Photons (Incoming Energy, Outgoing Light)
  const photonIn = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), new THREE.MeshBasicMaterial({color: 0xffff00})); group.add(photonIn);
  const photonOut = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), new THREE.MeshBasicMaterial({color: 0x00ff00})); group.add(photonOut);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.x = 0.4;
      
      // Inner electrons just spin happily
      e1.position.set(Math.cos(time*speed*2)*r1, 0, Math.sin(time*speed*2)*r1);
      e2.position.set(Math.cos(time*speed*2 + Math.PI)*r1, 0, Math.sin(time*speed*2 + Math.PI)*r1);
      
      // The valence electron jumps!
      const cycle = (time * speed * 0.5) % 8;
      
      if (cycle < 2) {
          // Normal N=2 orbit
          e3.position.set(Math.cos(time*speed)*r2, 0, Math.sin(time*speed)*r2);
          photonIn.visible = true;
          photonOut.visible = false;
          
          // Photon flies in
          const t = cycle / 2;
          photonIn.position.copy(e3.position).add(new THREE.Vector3(5 - t*5, 0, 0));
      } else if (cycle < 4) {
          // Absorbed! Electron jumps to N=3 (which we don't draw, it's just further out)
          photonIn.visible = false;
          const r3 = 6.0;
          e3.position.set(Math.cos(time*speed)*r3, 0, Math.sin(time*speed)*r3);
      } else if (cycle < 4.2) {
          // Falls back down!
          e3.position.set(Math.cos(time*speed)*r2, 0, Math.sin(time*speed)*r2);
          photonOut.visible = true;
          photonOut.position.copy(e3.position);
      } else {
          // Emitting photon!
          e3.position.set(Math.cos(time*speed)*r2, 0, Math.sin(time*speed)*r2);
          const t = cycle - 4.2;
          photonOut.position.copy(e3.position).add(new THREE.Vector3(0, t*5, 0));
      }
  };

  return {
    group: group,
    description: "Lithium Bohr Model (Remastered). The Bohr model is a classic way to visualize atoms like the solar system. Watch the outer electron (magenta)! When a photon of energy (yellow dot) hits it, the electron absorbs the energy and jumps to a higher, unstable orbit (Quantum Leap). But it wants to return to its resting state. When it falls back down to its original orbit, it releases the exact same amount of energy as a photon of light (green dot). This is the fundamental mechanism behind neon lights, lasers, and fireworks!",
    parts: [
      { name: "Inner Cyan Electrons", material: "1s Orbital", function: "Stable and non-reactive." },
      { name: "Outer Magenta Electron", material: "Valence Electron", function: "Jumping energy levels when excited." },
      { name: "Yellow/Green Dots", material: "Photons", function: "Packets of light energy being absorbed and emitted." }
    ],
    quizQuestions: [
      { question: "What happens when the outer electron falls back down from a high orbit to a low orbit?", options: ["It turns into a proton", "It releases a photon of light equal to the energy difference between the orbits.", "It crashes into the nucleus", "It creates a black hole"], correct: 1, explanation: "This is Conservation of Energy! The energy it absorbed to jump up must go somewhere when it falls back down, so it is released as light." }
    ]
  };
}