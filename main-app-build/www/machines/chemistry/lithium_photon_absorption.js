import * as THREE from 'three';
export function createLithiumPhotonAbsorption() {
  const group = new THREE.Group();
  
  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  group.add(nuc);

  // Orbitals
  const orb2s = new THREE.Mesh(new THREE.TorusGeometry(2, 0.05, 16, 100), new THREE.MeshBasicMaterial({color: 0xff00ff}));
  orb2s.rotation.x = Math.PI/2;
  const orb3p = new THREE.Mesh(new THREE.TorusGeometry(4, 0.05, 16, 100), new THREE.MeshBasicMaterial({color: 0xffff00}));
  orb3p.rotation.x = Math.PI/2;
  group.add(orb2s, orb3p);

  // Electron
  const e = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  group.add(e);

  // Incoming Photon (Wave)
  const photon = new THREE.Group();
  const waveGeo = new THREE.BufferGeometry();
  const wavePoints = [];
  for(let i=0; i<=20; i++) {
      wavePoints.push(new THREE.Vector3(i*0.2, Math.sin(i*Math.PI*0.5)*0.3, 0));
  }
  waveGeo.setFromPoints(wavePoints);
  const wave = new THREE.Line(waveGeo, new THREE.LineBasicMaterial({color: 0x00ffff, linewidth: 2}));
  photon.add(wave);
  const head = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.5, 8), new THREE.MeshBasicMaterial({color: 0x00ffff}));
  head.rotation.z = -Math.PI/2;
  head.position.set(4, 0, 0);
  photon.add(head);
  group.add(photon);

  // Flash
  const flash = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16), new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0}));
  group.add(flash);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = Math.sin(time*speed*0.2)*0.2;
      
      const cycle = (time * speed) % 4;
      
      if (cycle < 1.5) {
          // Approach
          e.position.set(2, 0, 0);
          photon.position.set(-6 + cycle*4, 0, 0);
          photon.visible = true;
          flash.material.opacity = 0;
      } else if (cycle < 1.7) {
          // Strike
          photon.visible = false;
          flash.position.copy(e.position);
          flash.material.opacity = 1 - (cycle-1.5)*5;
          e.position.set(2 + (cycle-1.5)*10, 0, 0); // Quick jump
      } else {
          // Resting in new state
          photon.visible = false;
          e.position.set(4, 0, 0);
          flash.material.opacity = 0;
      }
  };

  return {
    group: group,
    description: "Photon Absorption. An electron cannot just slowly drift to a higher energy level. It must absorb a 'packet' of energy all at once. This packet is a photon (a particle of light). If the photon has the EXACT right amount of energy to bridge the gap between the 2s and 3p orbitals, the electron will 'eat' the photon and instantly teleport to the higher orbit.",
    parts: [
      { name: "Cyan Wave", material: "Incoming Photon", function: "Carrying a specific, quantized amount of energy." },
      { name: "White Dot", material: "Electron", function: "Absorbs the photon and uses the energy to overcome the pull of the nucleus." },
      { name: "Magenta to Yellow Orbit", material: "Quantum Leap", function: "The electron transitions instantaneously." }
    ],
    quizQuestions: [
      { question: "What happens if a photon hits the electron, but it has slightly TOO MUCH energy to reach the next orbital, but not enough to reach the one after that?", options: ["The electron jumps to the next orbital and stores the extra energy in a battery", "The electron ignores the photon completely, and the photon passes right through", "The electron jumps halfway between the orbits", "The atom explodes"], correct: 1, explanation: "This is the core of Quantum Mechanics! Energy levels are strict stairs. You cannot stand halfway between stairs. If the photon doesn't match a gap perfectly, the electron physically cannot absorb it." }
    ]
  };
}