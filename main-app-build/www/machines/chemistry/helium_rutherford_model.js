import * as THREE from 'three';
export function createHeliumRutherfordModel() {
  const group = new THREE.Group();
  
  // Tiny, dense nucleus (+2 charge)
  const nucleus = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshStandardMaterial({color: 0xff0000, emissive: 0xaa0000}));
  group.add(nucleus);

  // Large empty space
  const voidSpace = new THREE.Mesh(new THREE.SphereGeometry(4, 32, 32), new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.05, wireframe: true}));
  group.add(voidSpace);

  // Two orbiting electrons
  const orbitGroup1 = new THREE.Group();
  const orbitGroup2 = new THREE.Group();
  
  const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshBasicMaterial({color: 0x0000ff}));
  e1.position.set(3, 0, 0);
  const t1 = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(new THREE.Path().absarc(0,0, 3, 0, Math.PI*2).getPoints(64)), new THREE.LineBasicMaterial({color: 0x4444ff, transparent: true, opacity: 0.4}));
  t1.rotation.x = Math.PI/2;
  orbitGroup1.add(e1, t1);

  const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), new THREE.MeshBasicMaterial({color: 0x0000ff}));
  e2.position.set(2.5, 0, 0);
  const t2 = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(new THREE.Path().absarc(0,0, 2.5, 0, Math.PI*2).getPoints(64)), new THREE.LineBasicMaterial({color: 0x4444ff, transparent: true, opacity: 0.4}));
  t2.rotation.x = Math.PI/2;
  orbitGroup2.add(e2, t2);

  orbitGroup1.rotation.set(Math.PI/4, Math.PI/6, 0);
  orbitGroup2.rotation.set(-Math.PI/3, Math.PI/4, 0);
  group.add(orbitGroup1, orbitGroup2);

  group.userData.animate = function(delta, time, speed) {
      orbitGroup1.rotation.z = time * speed * 3.5;
      orbitGroup2.rotation.z = -time * speed * 4.5;
  };

  return {
    group: group,
    description: "Rutherford Planetary Model for Helium (Historical). Rutherford discovered the nucleus using Alpha particles (which are actually bare Helium nuclei!). His model for Helium featured a dense +2 nucleus with two electrons orbiting it at high speeds in random planetary paths.",
    parts: [
      { name: "Dense Nucleus (+2)", material: "Alpha Particle", function: "Contains virtually all the atom's mass in a tiny volume." },
      { name: "Two Orbiting Electrons", material: "Electrons", function: "Orbit the nucleus due to electrostatic attraction." }
    ],
    quizQuestions: [
      { question: "Rutherford discovered the nucleus by shooting 'Alpha particles' at gold foil. What is an Alpha particle?", options: ["A fast-moving electron", "A photon of light", "A bare Helium nucleus (2 protons, 2 neutrons, no electrons)", "A hydrogen atom"], correct: 2, explanation: "An alpha particle is simply a Helium nucleus that has been stripped of its two electrons. It has a +2 charge and is extremely dense." }
    ]
  };
}