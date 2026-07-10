import * as THREE from 'three';
export function createHeliumNeonLaser() {
  const group = new THREE.Group();
  
  // Tube
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 8, 32, 1, true), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.2, side: THREE.DoubleSide }));
  tube.rotation.z = Math.PI / 2;
  group.add(tube);

  // Atoms
  const heMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
  const neMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const he = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), heMat); he.position.x = -2;
  const ne = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16,16), neMat); ne.position.x = 2;
  group.add(he); group.add(ne);

  // Laser beam
  const beamGeo = new THREE.CylinderGeometry(0.1, 0.1, 8, 16);
  const beamMat = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.8 });
  const beam = new THREE.Mesh(beamGeo, beamMat);
  beam.rotation.z = Math.PI / 2;
  beam.visible = false;
  group.add(beam);

  group.userData.animate = function(delta, time, speed) {
      const cycle = (time * speed) % 6;
      if(cycle < 2) {
          beam.visible = false;
          he.position.x = -3 + cycle * 1.5; // moving right
          ne.position.x = 3 - cycle * 1.5;  // moving left
      } else if (cycle < 4) {
          // Collision and transfer
          he.position.x = 0;
          ne.position.x = 0;
          he.material.color.setHex(0xaaaaaa); // lost energy
          ne.material.color.setHex(0xff5555); // excited
      } else {
          // Lasing
          beam.visible = true;
          he.position.x = -1 - (cycle-4);
          ne.position.x = 1 + (cycle-4);
          he.material.color.setHex(0x00ffff);
          ne.material.color.setHex(0xff0000);
      }
  };

  return {
    group: group,
    description: "Helium-Neon (HeNe) Laser. Helium atoms are excited by an electrical discharge, then collide with Neon atoms, transferring energy and creating a population inversion in Neon, which emits the red laser beam (632.8 nm).",
    parts: [
      { name: "Helium (Pump)", material: "Gas", function: "Absorbs electrical energy efficiently." },
      { name: "Neon (Lasing Medium)", material: "Gas", function: "Emits the coherent red photons after collision." },
      { name: "Red Laser Beam", material: "Photons", function: "632.8 nm wavelength light." }
    ],
    quizQuestions: [
      { question: "In a He-Ne laser, what is the primary role of the Helium?", options: ["It emits the red laser light", "It acts as a coolant", "It efficiently absorbs electrical energy and transfers it to Neon via collisions", "It provides pressure to the glass tube"], correct: 2, explanation: "Helium's excited energy states closely match those of Neon. Helium is easily excited by an electrical discharge, and it transfers this energy to Neon upon collision, achieving the population inversion required for lasing." }
    ]
  };
}
