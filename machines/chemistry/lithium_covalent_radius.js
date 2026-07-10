import * as THREE from 'three';
export function createLithiumCovalentRadius() {
  const group = new THREE.Group();
  
  // Covalent Radius (Remastered)
  // Two Li atoms covalently bonded. Total distance is 267pm. Half is 133.5pm (covalent radius).
  
  const atom1 = new THREE.Group();
  atom1.add(new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000})));
  atom1.add(new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), new THREE.MeshPhysicalMaterial({color: 0x00ffff, transparent: true, opacity: 0.3})));
  atom1.position.x = -2.5;
  
  const atom2 = new THREE.Group();
  atom2.add(new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000})));
  atom2.add(new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), new THREE.MeshPhysicalMaterial({color: 0xff00ff, transparent: true, opacity: 0.3})));
  atom2.position.x = 2.5;
  
  group.add(atom1, atom2);
  
  // Ruler across both nuclei (Total distance)
  const fullLine = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 5), new THREE.MeshBasicMaterial({color: 0xffffff}));
  fullLine.rotation.z = Math.PI/2;
  group.add(fullLine);
  
  // Ruler for just half (Covalent Radius)
  const halfRuler = new THREE.Group();
  const hLine = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.5), new THREE.MeshBasicMaterial({color: 0x00ff00}));
  hLine.rotation.z = Math.PI/2;
  hLine.position.x = 1.25;
  halfRuler.add(hLine);
  
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#00ff00';
  ctx.font = 'bold 30px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Covalent Radius: 134 pm', 256, 64);
  const tex = new THREE.CanvasTexture(canvas);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({map: tex, transparent: true}));
  sprite.position.set(1.25, 0.8, 0);
  sprite.scale.set(4, 1, 1);
  halfRuler.add(sprite);
  group.add(halfRuler);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(0, 5, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.x = Math.sin(time*speed*0.2)*0.2;
      group.rotation.y = Math.sin(time*speed*0.1)*0.2;
  };

  return {
    group: group,
    description: "Covalent Radius (Remastered). When two atoms share electrons, their probability clouds physically merge and overlap. Because they are squished together, the effective size of the atom changes! To find the 'Covalent Radius', chemists measure the exact distance between the two red nuclei (the internuclear distance) and divide it by two. Because the electron clouds are overlapping and pulling the nuclei closer together, the Covalent Radius (134 pm) is noticeably smaller than the standard non-bonded Atomic Radius (152 pm)!",
    parts: [
      { name: "Overlapping Spheres", material: "Covalently Bonded Atoms", function: "Two Lithium atoms sharing their valence electrons." },
      { name: "White Line", material: "Internuclear Distance", function: "The total distance between both nuclei." },
      { name: "Green Ruler", material: "Covalent Radius", function: "Exactly half the internuclear distance (134 pm)." }
    ],
    quizQuestions: [
      { question: "Why is the covalent radius of Lithium smaller than its neutral atomic radius?", options: ["Because it loses an electron", "Because the sharing of electrons physically pulls the two nuclei closer together via overlapping probability clouds.", "Because it gains weight", "Because the nucleus shrinks"], correct: 1, explanation: "Bonding is an attractive force. The shared electrons in the middle pull both positive nuclei inward, squishing the atoms slightly!" }
    ]
  };
}