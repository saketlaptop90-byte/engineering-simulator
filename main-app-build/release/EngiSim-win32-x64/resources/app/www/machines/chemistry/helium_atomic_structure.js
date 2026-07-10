import * as THREE from 'three';
export function createHeliumAtomicStructure() {
  const group = new THREE.Group();
  
  // Nucleus: 2 protons, 2 neutrons
  const nucGroup = new THREE.Group();
  const pMat = new THREE.MeshStandardMaterial({ color: 0xff3333, roughness: 0.4 });
  const nMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.4 });
  
  const p1 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), pMat); p1.position.set(0.3, 0.3, 0);
  const p2 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), pMat); p2.position.set(-0.3, -0.3, 0);
  const n1 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), nMat); n1.position.set(-0.3, 0.3, 0.3);
  const n2 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), nMat); n2.position.set(0.3, -0.3, -0.3);
  nucGroup.add(p1, p2, n1, n2);
  group.add(nucGroup);

  // Electrons
  const eMat = new THREE.MeshStandardMaterial({ color: 0x3333ff, emissive: 0x1111aa });
  const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), eMat);
  const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), eMat);
  
  const orbitCurve = new THREE.EllipseCurve(0, 0, 3, 3, 0, 2 * Math.PI, false, 0);
  const orbitLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(orbitCurve.getPoints(50)), new THREE.LineBasicMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.3 }));
  orbitLine.rotation.x = Math.PI / 2;
  
  const orbitGroup = new THREE.Group();
  orbitGroup.add(orbitLine);
  orbitGroup.add(e1);
  orbitGroup.add(e2);
  group.add(orbitGroup);

  group.userData.animate = function(delta, time, speed) {
      orbitGroup.rotation.y += delta * speed * 2;
      orbitGroup.rotation.z = Math.sin(time * speed * 0.5) * 0.2;
      e1.position.set(Math.cos(time*speed*3)*3, 0, Math.sin(time*speed*3)*3);
      e2.position.set(Math.cos(time*speed*3 + Math.PI)*3, 0, Math.sin(time*speed*3 + Math.PI)*3);
  };

  return {
    group: group,
    description: "The atomic structure of Helium (2He), containing 2 protons, 2 neutrons, and 2 electrons in the 1s shell.",
    parts: [
      { name: "Protons", material: "Positively charged", function: "Determine the element (Z=2)." },
      { name: "Neutrons", material: "Neutral", function: "Provide nuclear stability via strong force." },
      { name: "Electrons", material: "Negatively charged", function: "Fill the 1s orbital completely, making Helium a noble gas." }
    ],
    quizQuestions: [
      { question: "How many valence electrons does Helium have?", options: ["1", "2", "4", "8"], correct: 1, explanation: "Helium has 2 valence electrons, which completely fill its 1s shell, making it highly stable." },
      { question: "Which subatomic particles make up the nucleus of a standard Helium-4 atom?", options: ["2 protons only", "2 protons and 1 neutron", "2 protons and 2 neutrons", "2 protons and 2 electrons"], correct: 2, explanation: "A standard Helium-4 nucleus (alpha particle) consists of 2 protons and 2 neutrons." }
    ]
  };
}
