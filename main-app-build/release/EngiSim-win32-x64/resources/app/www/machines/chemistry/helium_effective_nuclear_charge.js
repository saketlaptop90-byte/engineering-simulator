import * as THREE from 'three';
export function createHeliumEffectiveNuclearCharge() {
  const group = new THREE.Group();
  
  const nuc = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), new THREE.MeshBasicMaterial({color: 0xff0000}));
  group.add(nuc);
  
  // Z = 2 text abstract
  const zLabel = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), new THREE.MeshBasicMaterial({color: 0xffffff}));
  zLabel.position.set(0, 0.7, 0);
  group.add(zLabel);

  // Electron 1 (The target)
  const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16,16), new THREE.MeshBasicMaterial({color: 0x00ff00}));
  e1.position.set(2.5, 0, 0);
  group.add(e1);

  // Electron 2 (The shielder)
  const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16,16), new THREE.MeshBasicMaterial({color: 0x0000ff}));
  e2.position.set(1.0, 0, 0);
  group.add(e2);

  // Force lines
  const pull = new THREE.ArrowHelper(new THREE.Vector3(-1,0,0), new THREE.Vector3(2.5,0,0), 2.5, 0xffffff, 0.3, 0.3);
  group.add(pull);
  
  const push = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(1.0,0,0), 1.5, 0xff0000, 0.3, 0.3);
  group.add(push);

  group.userData.animate = function(delta, time, speed) {
      // Shielder orbiting in between
      e2.position.set(Math.cos(time*speed)*1.2, 0, Math.sin(time*speed)*1.2);
      
      push.position.copy(e2.position);
      push.setDirection(new THREE.Vector3().subVectors(e1.position, e2.position).normalize());
  };

  return {
    group: group,
    description: "Effective Nuclear Charge (Z_eff) in Helium. The actual nuclear charge (Z) is +2. However, the two electrons in the 1s orbital repel each other slightly. This means one electron slightly 'shields' the other from the full +2 charge. The calculated effective nuclear charge (Z_eff) for Helium is roughly +1.7.",
    parts: [
      { name: "Target Electron (Green)", material: "Valence Electron", function: "Experiencing the net pull." },
      { name: "Shielding Electron (Blue)", material: "Peer Electron", function: "Slightly repels the target, reducing the perceived nuclear charge." },
      { name: "White Arrow", material: "Nuclear Pull (+2)", function: "The raw attraction from the nucleus." },
      { name: "Red Arrow", material: "Electron Repulsion (-0.3)", function: "Reduces the net pull to +1.7." }
    ],
    quizQuestions: [
      { question: "Why is the Effective Nuclear Charge (Z_eff) experienced by a Helium electron approximately +1.7 instead of the full +2.0?", options: ["Because neutrons block the charge", "Because the two electrons slightly shield each other, reducing the net pull", "Because the nucleus is spinning", "Because it loses an electron"], correct: 1, explanation: "Electrons in the same orbital do not shield each other perfectly (like core electrons do), but they still repel each other. This lateral repulsion slightly cancels out some of the nucleus's +2 pull." }
    ]
  };
}