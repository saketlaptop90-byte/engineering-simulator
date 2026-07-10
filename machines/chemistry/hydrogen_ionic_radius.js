import * as THREE from 'three';
export function createHydrogenIonicRadius() {
  const group = new THREE.Group();
  
  // H+ (Bare proton)
  const hPlus = new THREE.Group();
  hPlus.position.set(-2, 0, 0);
  hPlus.add(new THREE.Mesh(new THREE.SphereGeometry(0.1, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000})));
  // Text label abstract
  const pLabel = new THREE.Mesh(new THREE.RingGeometry(0.15, 0.2, 16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  pLabel.position.y = 1; hPlus.add(pLabel);
  group.add(hPlus);

  // H- (Hydride)
  const hMinus = new THREE.Group();
  hMinus.position.set(2, 0, 0);
  hMinus.add(new THREE.Mesh(new THREE.SphereGeometry(0.1, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000})));
  const cloud = new THREE.Mesh(new THREE.SphereGeometry(2.0, 32, 32), new THREE.MeshPhysicalMaterial({color: 0x00aaff, transparent: true, opacity: 0.4}));
  hMinus.add(cloud);
  group.add(hMinus);

  group.userData.animate = function(delta, time, speed) {
      hMinus.rotation.y = time * speed * 0.5;
  };

  return {
    group: group,
    description: "Ionic Radius: H+ vs H-. When Hydrogen loses its electron (H+), it becomes a bare proton with an effective radius of nearly 0 pm. When it gains an electron (Hydride, H-), electron-electron repulsion swells the cloud to a massive 140 pm, larger than a neutral Fluorine atom!",
    parts: [
      { name: "H+ (Left)", material: "Bare Proton", function: "Radius: ~0.000001 pm. Literally just a nucleus." },
      { name: "H- (Right)", material: "Hydride Anion", function: "Radius: 140 pm. Swelled by electron repulsion." }
    ],
    quizQuestions: [
      { question: "Why is the Hydride ion (H-) so exceptionally large compared to the neutral atom?", options: ["It gains an extra shell", "The added electron doubles the nuclear charge", "The two electrons in the 1s orbital repel each other strongly, swelling the cloud outward", "It absorbs water"], correct: 2, explanation: "With two electrons and only one proton to hold them in, the electrostatic repulsion between the two electrons dominates, causing the electron cloud to expand massively." }
    ]
  };
}