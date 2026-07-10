import * as THREE from 'three';
export function createHeliumCoreElectrons() {
  const group = new THREE.Group();
  
  // Big red X over the core region to symbolize absence
  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  group.add(nuc);

  const cross = new THREE.Group();
  const c1 = new THREE.Mesh(new THREE.BoxGeometry(2, 0.1, 0.1), new THREE.MeshBasicMaterial({color: 0xff0000}));
  c1.rotation.z = Math.PI/4;
  const c2 = new THREE.Mesh(new THREE.BoxGeometry(2, 0.1, 0.1), new THREE.MeshBasicMaterial({color: 0xff0000}));
  c2.rotation.z = -Math.PI/4;
  cross.add(c1, c2);
  cross.position.set(-2, 1, 0);
  group.add(cross);

  // Valence shell
  const shell = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 16), new THREE.MeshBasicMaterial({color: 0x00ffff, wireframe: true, transparent: true, opacity: 0.3}));
  group.add(shell);
  
  const label = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshBasicMaterial({color: 0x555555}));
  label.position.set(-2, 0, 0);
  group.add(label);

  group.userData.animate = function(delta, time, speed) {
      shell.rotation.y = time * speed * 0.2;
      cross.scale.setScalar(1 + Math.sin(time*speed*5)*0.1);
  };

  return {
    group: group,
    description: "Core Electrons. Core electrons are the inner electrons that are not involved in chemical bonding. Because Helium's electrons are ALL in the outermost n=1 shell, Helium has ZERO core electrons. It is the only noble gas without any core electrons.",
    parts: [
      { name: "Red 'X'", material: "Symbolic", function: "Visualizes the complete absence of inner electron shells." },
      { name: "Cyan Shell", material: "Valence Shell", function: "Since n=1 is the only shell, all electrons are valence, none are core." }
    ],
    quizQuestions: [
      { question: "How many core electrons does a neutral Helium atom possess?", options: ["2", "8", "0", "1"], correct: 2, explanation: "Core electrons are defined as electrons in inner, completely filled shells. Since Helium only has one shell total (n=1), there are no inner shells beneath it, meaning it has zero core electrons." }
    ]
  };
}