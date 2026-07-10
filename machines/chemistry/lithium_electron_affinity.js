import * as THREE from 'three';
export function createLithiumElectronAffinity() {
  const group = new THREE.Group();
  
  const li = new THREE.Group();
  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  const val = new THREE.Mesh(new THREE.SphereGeometry(3.0, 32, 16), new THREE.MeshBasicMaterial({color: 0xff00ff, wireframe: true, transparent: true, opacity: 0.3}));
  li.add(nuc, val);
  const v1 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff}));
  v1.position.set(0, 3, 0); val.add(v1);
  group.add(li);

  // Incoming electron
  const eIn = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16,16), new THREE.MeshBasicMaterial({color: 0xffff00}));
  group.add(eIn);
  
  // Rejection forces
  const reject = new THREE.Group();
  const r1 = new THREE.ArrowHelper(new THREE.Vector3(1,1,0).normalize(), new THREE.Vector3(0,0,0), 2, 0xff0000, 0.5, 0.5);
  const r2 = new THREE.ArrowHelper(new THREE.Vector3(1,-1,0).normalize(), new THREE.Vector3(0,0,0), 2, 0xff0000, 0.5, 0.5);
  reject.add(r1, r2);
  reject.position.set(3, 0, 0);
  group.add(reject);

  group.userData.animate = function(delta, time, speed) {
      val.rotation.z = time * speed * 0.2;
      
      const cycle = (time * speed) % 4;
      
      if (cycle < 1) {
          // Approaching
          eIn.position.set(7 - cycle*4, 0, 0);
          reject.visible = false;
      } else if (cycle < 2) {
          // Hits the shell, but is weakly held/repelled
          eIn.position.set(3, 0, 0);
          reject.visible = true;
          // Shaking
          eIn.position.x += Math.sin(time*speed*20)*0.1;
      } else {
          // Ultimately bounces away or struggles
          eIn.position.set(3 + (cycle-2)*2, Math.sin(cycle*5)*0.5, 0);
          reject.visible = false;
      }
  };

  return {
    group: group,
    description: "Electron Affinity. This is the opposite of Ionization Energy: it's how much an atom WANTS to gain an extra electron. Lithium's electron affinity is very low (-60 kJ/mol). While it CAN technically hold an extra electron to form a Li- anion, it hates doing so. The nucleus is already shielded, and forcing another negative electron into the 2s orbital just creates massive electron-electron repulsion.",
    parts: [
      { name: "Magenta Shell", material: "Lithium Atom", function: "Wants to lose its electron, not gain another." },
      { name: "Yellow Dot", material: "Incoming Electron", function: "Attempting to force its way into the 2s orbital." },
      { name: "Red Arrows", material: "Repulsion", function: "The existing electron cloud pushing back." }
    ],
    quizQuestions: [
      { question: "Why doesn't Lithium want to gain a second valence electron?", options: ["Because 2 is an unlucky number", "Because adding an electron to the already shielded 2s orbital causes too much negative-negative repulsion", "Because it would turn into Beryllium", "Because it would freeze"], correct: 1, explanation: "Metals are electron donors, not acceptors. While it's mathematically possible to force an electron onto Lithium (creating Li-), it is highly unstable because the nucleus doesn't have a strong enough grip to handle the extra negative repulsion." }
    ]
  };
}