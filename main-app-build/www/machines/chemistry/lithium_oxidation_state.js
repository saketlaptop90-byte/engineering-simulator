import * as THREE from 'three';
export function createLithiumOxidationState() {
  const group = new THREE.Group();
  
  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  group.add(nuc);

  // Core 1s
  const shell1s = new THREE.Mesh(new THREE.SphereGeometry(1.5, 32, 16), new THREE.MeshBasicMaterial({color: 0x00ffff, wireframe: true, transparent: true, opacity: 0.5}));
  group.add(shell1s);

  // Big floating text "+1"
  const textBg = new THREE.Mesh(new THREE.BoxGeometry(2, 1.5, 0.1), new THREE.MeshBasicMaterial({color: 0xffffff}));
  textBg.position.set(0, 3, 0);
  
  // Plus sign
  const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 0.1), new THREE.MeshBasicMaterial({color: 0xff0000}));
  const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.8, 0.1), new THREE.MeshBasicMaterial({color: 0xff0000}));
  p1.position.set(-0.3, 0, 0.1); p2.position.set(-0.3, 0, 0.1);
  textBg.add(p1, p2);
  
  // 1
  const one = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.8, 0.1), new THREE.MeshBasicMaterial({color: 0xff0000}));
  one.position.set(0.4, 0, 0.1);
  textBg.add(one);
  
  group.add(textBg);

  // The discarded electron
  const e = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16,16), new THREE.MeshBasicMaterial({color: 0xffff00}));
  e.position.set(3, -2, 0);
  group.add(e);
  
  const xMark = new THREE.Group();
  const x1 = new THREE.Mesh(new THREE.BoxGeometry(1, 0.1, 0.1), new THREE.MeshBasicMaterial({color: 0xff0000})); x1.rotation.z = Math.PI/4;
  const x2 = new THREE.Mesh(new THREE.BoxGeometry(1, 0.1, 0.1), new THREE.MeshBasicMaterial({color: 0xff0000})); x2.rotation.z = -Math.PI/4;
  xMark.add(x1, x2);
  xMark.position.set(3, -2, 0);
  group.add(xMark);

  group.userData.animate = function(delta, time, speed) {
      shell1s.rotation.y = time * speed * 0.2;
      
      textBg.scale.set(1 + Math.sin(time*speed*5)*0.1, 1 + Math.sin(time*speed*5)*0.1, 1);
      
      e.position.y = -2 + Math.sin(time*speed*2)*0.2;
      xMark.position.copy(e.position);
  };

  return {
    group: group,
    description: "Oxidation State (+1). Lithium ONLY has one oxidation state: +1. It has exactly one valence electron to give away, and once it does, it reaches a perfect noble gas configuration (like Helium). It refuses to give away a second electron (because breaking a full shell requires too much energy) and it refuses to gain 7 electrons to fill its outer shell. It is +1, or nothing.",
    parts: [
      { name: "Cyan Sphere", material: "Li+ Core", function: "Stable and happy." },
      { name: "Giant +1", material: "Oxidation State", function: "The only stable charge Lithium can hold in compounds." },
      { name: "Rejected Electron", material: "The 2s Electron", function: "Permanently lost in chemical reactions." }
    ],
    quizQuestions: [
      { question: "Why doesn't Lithium form a +2 oxidation state?", options: ["Because +2 is an unlucky number", "Because removing the second electron would mean breaking open the perfectly stable, full 1s core shell, which requires a massive amount of energy", "Because it only has 1 proton", "Because it is a gas"], correct: 1, explanation: "Once Lithium loses its first electron, it looks exactly like Helium (a noble gas). Noble gases are practically invincible. Ripping an electron out of a noble gas configuration takes too much energy to happen in normal chemistry." }
    ]
  };
}