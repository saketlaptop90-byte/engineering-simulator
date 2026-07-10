import * as THREE from 'three';
export function createHydrogenCovalentRadius() {
  const group = new THREE.Group();
  
  // H2 Molecule
  const atom1 = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), new THREE.MeshPhysicalMaterial({color: 0x00ffff, transparent: true, opacity: 0.3}));
  const atom2 = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), new THREE.MeshPhysicalMaterial({color: 0x00ffff, transparent: true, opacity: 0.3}));
  
  const nuc1 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  const nuc2 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  
  // Internuclear distance is ~74 pm. So covalent radius is 37 pm.
  atom1.position.set(-0.74, 0, 0); nuc1.position.set(-0.74, 0, 0);
  atom2.position.set(0.74, 0, 0); nuc2.position.set(0.74, 0, 0);
  
  group.add(atom1, atom2, nuc1, nuc2);

  // Measurement line
  const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-0.74, -1.5, 0), new THREE.Vector3(0.74, -1.5, 0)]), new THREE.LineBasicMaterial({color: 0xffff00, linewidth: 3}));
  group.add(line);
  
  // Midpoint marker
  const mid = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.5, 0.05), new THREE.MeshBasicMaterial({color: 0xffffff}));
  mid.position.set(0, -1.5, 0);
  group.add(mid);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = Math.sin(time*speed)*0.5;
  };

  return {
    group: group,
    description: "Covalent Radius. Because atomic boundaries are fuzzy, chemists define the covalent radius as exactly half the distance between two identical nuclei bonded together. For an H2 molecule, the internuclear distance is 74 pm, making Hydrogen's covalent radius 37 pm.",
    parts: [
      { name: "H2 Molecule", material: "Overlapping Clouds", function: "Two hydrogen atoms sharing their electrons." },
      { name: "Yellow Line (74 pm)", material: "Bond Length", function: "The distance from nucleus to nucleus." },
      { name: "Half-Distance (37 pm)", material: "Covalent Radius", function: "The effective radius of a bonded atom." }
    ],
    quizQuestions: [
      { question: "How is the 'Covalent Radius' of an element determined?", options: ["By measuring a single isolated atom with lasers", "By measuring the distance between two bonded nuclei of the same element and dividing by two", "By calculating the size of the proton", "By freezing it to absolute zero"], correct: 1, explanation: "Since electron clouds are fuzzy, the most practical way to measure atomic size in chemistry is to measure the rigid distance between two bonded nuclei in a molecule (like H-H) and cut it in half." }
    ]
  };
}