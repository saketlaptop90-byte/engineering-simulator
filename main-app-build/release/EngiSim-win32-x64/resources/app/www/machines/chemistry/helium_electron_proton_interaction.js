import * as THREE from 'three';
export function createHeliumElectronProtonInteraction() {
  const group = new THREE.Group();
  
  // Helium Nucleus (+2)
  const nucleus = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshStandardMaterial({color: 0xff0000}));
  group.add(nucleus);
  
  // Two Electrons
  const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshStandardMaterial({color: 0x0000ff}));
  const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshStandardMaterial({color: 0x0000ff}));
  group.add(e1, e2);

  // Attractive Force vectors (Nucleus to Electrons)
  const force1 = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,0), 2, 0x00ff00, 0.4, 0.4);
  const force2 = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,0), 2, 0x00ff00, 0.4, 0.4);
  
  // Repulsive Force vector (Electron to Electron)
  const repForce1 = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,0), 1, 0xff0000, 0.3, 0.3);
  const repForce2 = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,0), 1, 0xff0000, 0.3, 0.3);
  
  group.add(force1, force2, repForce1, repForce2);

  group.userData.animate = function(delta, time, speed) {
      const r = 2.5;
      const angle1 = time * speed;
      const angle2 = time * speed + Math.PI; // Opposite sides
      
      e1.position.set(Math.cos(angle1)*r, Math.sin(angle1)*0.5, Math.sin(angle1)*r);
      e2.position.set(Math.cos(angle2)*r, Math.sin(angle2)*0.5, Math.sin(angle2)*r);
      
      // Update Attraction (Green) - Points to Nucleus
      force1.position.copy(e1.position);
      force1.setDirection(new THREE.Vector3().subVectors(nucleus.position, e1.position).normalize());
      
      force2.position.copy(e2.position);
      force2.setDirection(new THREE.Vector3().subVectors(nucleus.position, e2.position).normalize());

      // Update Repulsion (Red) - Points away from other electron
      repForce1.position.copy(e1.position);
      repForce1.setDirection(new THREE.Vector3().subVectors(e1.position, e2.position).normalize());
      
      repForce2.position.copy(e2.position);
      repForce2.setDirection(new THREE.Vector3().subVectors(e2.position, e1.position).normalize());
  };

  return {
    group: group,
    description: "Electron-Proton & Electron-Electron Interactions. Helium introduces the complexity of electron-electron repulsion (red arrows). The two electrons are strongly attracted to the +2 nucleus (green arrows), but they constantly push each other away, altering the perfect quantum orbits calculated for Hydrogen.",
    parts: [
      { name: "Green Vectors", material: "Attraction", function: "Strong electrostatic pull from the +2 nucleus." },
      { name: "Red Vectors", material: "Repulsion", function: "The two negatively charged electrons pushing each other apart." }
    ],
    quizQuestions: [
      { question: "Why is the total energy of a Helium atom NOT simply exactly double the energy of a Hydrogen atom?", options: ["Because Helium has neutrons", "Because the two electrons repel each other, adding a positive potential energy term that destabilizes the atom slightly", "Because it is a noble gas", "Because the protons repel each other"], correct: 1, explanation: "If electrons didn't repel each other, Helium's energy would be perfectly predictable from Hydrogen's math. The electron-electron repulsion (red vectors) adds positive potential energy to the system, making it incredibly difficult to calculate precisely." }
    ]
  };
}