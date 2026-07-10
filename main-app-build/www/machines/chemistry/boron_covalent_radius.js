import * as THREE from 'three';
export function createBoronCovalentRadius() {
  const group = new THREE.Group();
  
  // Covalent Radius (84 pm)
  // Two Boron atoms sharing electrons
  
  const atom1 = new THREE.Group();
  atom1.add(new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000})));
  atom1.add(new THREE.Mesh(new THREE.SphereGeometry(1.68, 32, 32), new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity: 0.4})));
  atom1.position.set(-0.84, 0, 0); // Distance is 1.68 / 2
  group.add(atom1);

  const atom2 = new THREE.Group();
  atom2.add(new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000})));
  atom2.add(new THREE.Mesh(new THREE.SphereGeometry(1.68, 32, 32), new THREE.MeshBasicMaterial({color: 0x0044ff, transparent: true, opacity: 0.4})));
  atom2.position.set(0.84, 0, 0);
  group.add(atom2);

  // Measure line
  const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-0.84, 0, 0), new THREE.Vector3(0.84, 0, 0)]), new THREE.LineBasicMaterial({color: 0xffffff}));
  group.add(line);
  
  const text = new THREE.Mesh(new THREE.BoxGeometry(2, 0.4, 0.1), new THREE.MeshBasicMaterial({color: 0xffffff}));
  text.position.set(0, 0.5, 0);
  group.add(text); // "168 pm (Covalent bond)"

  // Electrons being shared in the middle
  const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8,8), new THREE.MeshBasicMaterial({color: 0xffffff}));
  const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8,8), new THREE.MeshBasicMaterial({color: 0xffffff}));
  group.add(e1, e2);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.2;
      group.rotation.z = time * speed * 0.1;
      
      // Figure-8 sharing
      e1.position.set(Math.sin(time*speed*4)*0.5, Math.cos(time*speed*4)*0.5, Math.sin(time*speed*2)*0.2);
      e2.position.set(Math.sin(time*speed*4 + Math.PI)*0.5, Math.cos(time*speed*4 + Math.PI)*0.5, Math.sin(time*speed*2 + Math.PI)*0.2);
  };

  return {
    group: group,
    description: "Covalent Radius. The 'Covalent Radius' is a measurement used when an atom is bonded to another atom of the same type. Boron's covalent radius is 84 picometers. Because Boron atoms share their outer electrons (a covalent bond) rather than completely stealing them, their electron clouds overlap. The distance between the two red nuclei is exactly 168 picometers. Half of that distance (84 pm) is defined as the covalent radius.",
    parts: [
      { name: "Overlapping Clouds", material: "Covalent Bond", function: "The atoms are physically merging their outer electron shells." },
      { name: "White Line", material: "Internuclear Distance", function: "The distance from nucleus to nucleus." },
      { name: "White Dots", material: "Shared Electrons", function: "Spending time between both nuclei, holding the atoms together." }
    ],
    quizQuestions: [
      { question: "Why is the covalent radius (84 pm) slightly smaller than the standard atomic radius (87 pm)?", options: ["Because the atoms shrink when cold", "Because in a covalent bond, the electron clouds overlap and mash into each other, bringing the nuclei closer together", "Because they lose electrons", "Because gravity pulls them"], correct: 1, explanation: "A covalent bond is an overlap of probability clouds. Because they are sharing space, the total distance between the centers is slightly less than if they were just sitting next to each other." }
    ]
  };
}