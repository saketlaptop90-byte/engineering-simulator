import * as THREE from 'three';
export function createLithiumHydrogenBonding() {
  const group = new THREE.Group();
  
  // Explaining why Lithium DOES NOT hydrogen bond, by showing a real H-bond vs Li
  
  // Top: Water molecule H-bonding
  const o1 = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshBasicMaterial({color: 0xff0000})); o1.position.set(-2, 2, 0);
  const h1 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshBasicMaterial({color: 0xffffff})); h1.position.set(-1, 2, 0);
  
  const o2 = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshBasicMaterial({color: 0xff0000})); o2.position.set(2, 2, 0);
  
  // The H-bond
  const hbond = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(2, 0.1, 0.1)), new THREE.LineDashedMaterial({color: 0x00ff00, dashSize: 0.2, gapSize: 0.2}));
  hbond.computeLineDistances(); hbond.position.set(0.5, 2, 0);
  group.add(o1, h1, o2, hbond);

  // Bottom: Lithium trying to do the same and failing
  const xMark = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 0.1), new THREE.MeshBasicMaterial({color: 0xff0000}));
  const p1 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.2, 0.2), new THREE.MeshBasicMaterial({color: 0xff0000})); p1.rotation.z = Math.PI/4;
  const p2 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.2, 0.2), new THREE.MeshBasicMaterial({color: 0xff0000})); p2.rotation.z = -Math.PI/4;
  xMark.add(p1, p2); xMark.position.set(0.5, -2, 0);
  
  const o3 = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshBasicMaterial({color: 0xff0000})); o3.position.set(-2, -2, 0);
  const li = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), new THREE.MeshBasicMaterial({color: 0xff00ff})); li.position.set(-1, -2, 0); // Li bonded to O
  const o4 = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshBasicMaterial({color: 0xff0000})); o4.position.set(2, -2, 0);
  
  group.add(xMark, o3, li, o4);

  group.userData.animate = function(delta, time, speed) {
      // Gentle floating
      group.position.y = Math.sin(time*speed)*0.2;
      xMark.scale.setScalar(1 + Math.sin(time*speed*5)*0.2); // Pulse the red X
  };

  return {
    group: group,
    description: "Hydrogen Bonding (Why Lithium CAN'T do it). Hydrogen bonding is a special, ultra-strong dipole interaction that only happens when Hydrogen is attached to a highly electronegative atom (N, O, F). Because Hydrogen has no core electrons, its positive nucleus becomes completely exposed, acting like a naked magnet. Lithium has a core shell of 2 electrons, so its nucleus is NEVER exposed. Thus, Lithium cannot form 'Hydrogen-style' bonds.",
    parts: [
      { name: "Top (Water)", material: "White H, Red O", function: "Hydrogen's nucleus is exposed, forming a strong dashed green H-bond." },
      { name: "Bottom (Lithium)", material: "Magenta Li, Red O", function: "Lithium's core electrons shield its nucleus, preventing this special bond." },
      { name: "Red X", material: "Failure", function: "Lithium cannot H-bond." }
    ],
    quizQuestions: [
      { question: "Why can Hydrogen form special 'Hydrogen Bonds' but Lithium cannot, even though they both have 1 valence electron?", options: ["Lithium is too heavy", "Hydrogen has no core electrons. When it loses its valence electron, its positive nucleus is completely naked and acts as a super-magnet. Lithium's nucleus is blocked by its core electrons.", "Lithium doesn't like Oxygen", "Hydrogen is a gas"], correct: 1, explanation: "The magic of Hydrogen is that it has no underlying electron shells. Strip its valence electron away in a polar bond, and you are left with a bare proton. Lithium always has two core electrons acting as a bumper pad." }
    ]
  };
}