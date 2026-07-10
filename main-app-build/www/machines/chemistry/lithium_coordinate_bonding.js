import * as THREE from 'three';
export function createLithiumCoordinateBonding() {
  const group = new THREE.Group();
  
  // A Lithium ion (Li+) being solvated by an Ether molecule (Dimethyl Ether simplified)
  // The Oxygen donates both electrons to the empty orbitals of Li+
  
  // Li+ Ion (Center)
  const li = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), new THREE.MeshPhysicalMaterial({color: 0x00ffff, transparent: true, opacity: 0.8}));
  const nucLi = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000})); li.add(nucLi);
  group.add(li);
  const liLabel = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.05), new THREE.MeshBasicMaterial({color: 0xffffff})); liLabel.position.set(0, -1, 0); group.add(liLabel);

  // Oxygen from an ether molecule (Right)
  const ox = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), new THREE.MeshPhysicalMaterial({color: 0xff0000, transparent: true, opacity: 0.6}));
  ox.position.set(3, 0, 0);
  const nucOx = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000})); ox.add(nucOx);
  group.add(ox);

  // The Lone Pair (2 electrons from Oxygen moving into Li's empty orbital)
  const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16,16), new THREE.MeshBasicMaterial({color: 0xffff00}));
  const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16,16), new THREE.MeshBasicMaterial({color: 0xffff00}));
  group.add(e1, e2);

  // Coordinate arrow
  const arrow = new THREE.ArrowHelper(new THREE.Vector3(-1,0,0), new THREE.Vector3(2.5,0,0), 1.5, 0xffaa00, 0.5, 0.5);
  group.add(arrow);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.2;
      group.rotation.x = Math.sin(time*speed*0.3)*0.2;
      
      // Electrons flow from Oxygen into the gap between them, but heavily skewed toward Li
      e1.position.set(1.5 + Math.sin(time*speed*4)*0.5, Math.cos(time*speed*5)*0.3, Math.sin(time*speed*3)*0.3);
      e2.position.set(1.5 + Math.sin(time*speed*4 + Math.PI)*0.5, Math.cos(time*speed*5 + Math.PI)*0.3, Math.sin(time*speed*3 + Math.PI)*0.3);
      
      arrow.position.x = 2.5 + Math.sin(time*speed*2)*0.2;
  };

  return {
    group: group,
    description: "Coordinate Covalent Bonding. A normal covalent bond involves each atom sharing 1 electron. In a 'coordinate' bond, one atom donates BOTH electrons. Because a Li+ ion has completely empty 2s and 2p orbitals, molecules with extra electron pairs (like the Oxygen in ether) can shove their electrons into Lithium's empty spaces. This is highly important in Lithium battery electrolytes!",
    parts: [
      { name: "Cyan Sphere", material: "Li+ Ion", function: "Has empty orbitals, acting as an electron 'acceptor'." },
      { name: "Red Sphere", material: "Oxygen Atom", function: "Has unshared 'lone pairs' of electrons, acting as the 'donor'." },
      { name: "Yellow Dots", material: "Donated Electron Pair", function: "Both electrons come from Oxygen, but are shared with Lithium." }
    ],
    quizQuestions: [
      { question: "How does a coordinate covalent bond differ from a regular covalent bond?", options: ["It is magnetic instead of electrical", "In a coordinate bond, both shared electrons come from the same atom", "It only happens in outer space", "It doesn't use electrons, it uses protons"], correct: 1, explanation: "In a standard bond, Atom A gives 1 electron, and Atom B gives 1. In a coordinate bond, Atom A gives 0, and Atom B gives 2. The end result is a shared pair, but the origin of the electrons is one-sided." }
    ]
  };
}