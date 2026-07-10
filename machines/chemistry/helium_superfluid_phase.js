import * as THREE from 'three';
export function createHeliumSuperfluidPhase() {
  const group = new THREE.Group();
  
  // A cup
  const cupGeo = new THREE.CylinderGeometry(2, 1.5, 3, 32, 1, true);
  const cupMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.3, transmission: 0.9, side: THREE.DoubleSide });
  const cup = new THREE.Mesh(cupGeo, cupMat);
  group.add(cup);

  // Liquid He II climbing the walls (Rollin film)
  const filmGeo = new THREE.CylinderGeometry(2.05, 1.55, 3.1, 32, 1, true);
  const filmMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.4, side: THREE.DoubleSide });
  const film = new THREE.Mesh(filmGeo, filmMat);
  group.add(film);

  // Drops falling off the bottom
  const dropGeo = new THREE.SphereGeometry(0.1, 8, 8);
  const dropMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
  const drop1 = new THREE.Mesh(dropGeo, dropMat);
  const drop2 = new THREE.Mesh(dropGeo, dropMat);
  group.add(drop1); group.add(drop2);

  group.userData.animate = function(delta, time, speed) {
      drop1.position.set(0, -1.5 - ((time * speed * 2) % 3), 0);
      drop2.position.set(0.5, -1.5 - (((time+0.5) * speed * 2) % 3), 0);
  };

  return {
    group: group,
    description: "Superfluid Helium (He II). Below 2.17 K (the lambda point), liquid Helium-4 becomes a superfluid with zero viscosity. It can creep up and over the walls of a container (the Rollin film effect).",
    parts: [
      { name: "Container", material: "Glass", function: "Holds the liquid." },
      { name: "Rollin Film", material: "Superfluid He", function: "Flows against gravity with zero friction to escape the container." },
      { name: "Dripping Superfluid", material: "Liquid", function: "Escapes the bottom of the vessel." }
    ],
    quizQuestions: [
      { question: "What defines a 'superfluid' like Liquid Helium II?", options: ["It is perfectly transparent", "It has zero viscosity and flows without friction", "It is hotter than a standard fluid", "It conducts electricity perfectly"], correct: 1, explanation: "A superfluid has precisely zero viscosity, meaning it can flow endlessly without losing kinetic energy to friction, allowing it to creep up the walls of containers." }
    ]
  };
}
