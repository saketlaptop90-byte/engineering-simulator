import * as THREE from 'three';
export function createLithiumBatteryAnode() {
  const group = new THREE.Group();
  
  // Anode side (Lithium)
  const anode = new THREE.Mesh(new THREE.BoxGeometry(2, 4, 0.5), new THREE.MeshStandardMaterial({color: 0x888888, metalness: 0.9}));
  anode.position.set(-3, 0, 0);
  group.add(anode);

  // Cathode side
  const cathode = new THREE.Mesh(new THREE.BoxGeometry(2, 4, 0.5), new THREE.MeshStandardMaterial({color: 0x333333}));
  cathode.position.set(3, 0, 0);
  group.add(cathode);

  // Wire
  const wireGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-3, 2, 0), new THREE.Vector3(-3, 3, 0), new THREE.Vector3(3, 3, 0), new THREE.Vector3(3, 2, 0)]);
  const wire = new THREE.Line(wireGeo, new THREE.LineBasicMaterial({color: 0xffaaaa, linewidth: 2}));
  group.add(wire);

  // Electron flowing through wire
  const eFlow = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xffff00}));
  group.add(eFlow);

  // Li+ ion flowing through middle (electrolyte)
  const ion = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0x00ffff}));
  group.add(ion);
  
  // Divider
  const div = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 4), new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.2}));
  div.position.set(0, 0, 0);
  group.add(div);

  group.userData.animate = function(delta, time, speed) {
      const cycle = (time * speed) % 4;
      
      if (cycle < 1) {
          // E in wire up
          eFlow.position.set(-3, 2 + cycle, 0);
          ion.position.set(-2, 0, 0);
      } else if (cycle < 3) {
          // E across wire, Ion across middle
          const t = (cycle-1)/2;
          eFlow.position.set(-3 + t*6, 3, 0);
          ion.position.set(-2 + t*4, 0, 0);
      } else {
          // E down
          const t = cycle - 3;
          eFlow.position.set(3, 3 - t, 0);
          ion.position.set(2, 0, 0);
      }
  };

  return {
    group: group,
    description: "The Battery Anode. Why is Lithium the king of batteries? Two reasons: 1) It has a very low atomic mass (so the battery is extremely light). 2) It is highly eager to give away its electron. In a battery, the Lithium anode releases an electron that travels through your phone (the wire) to do work, while the resulting Li+ ion travels directly through the electrolyte to meet it on the other side.",
    parts: [
      { name: "Silver Block", material: "Lithium Anode", function: "The source of the electrons." },
      { name: "Yellow Dot", material: "Electron", function: "Travels through the external wire to power your device." },
      { name: "Cyan Dot", material: "Li+ Ion", function: "Travels through the internal battery fluid to balance the charge." }
    ],
    quizQuestions: [
      { question: "Why is Lithium preferred over Sodium or Potassium for cell phone batteries, even though they all have 1 valence electron?", options: ["Because Lithium is a liquid", "Because Lithium is the lightest solid element, making the battery weigh much less while holding the same charge", "Because it is cheaper", "Because the others are radioactive"], correct: 1, explanation: "Weight matters! If you used a heavier alkali metal like Potassium, your phone battery would weigh significantly more while providing the exact same amount of electrical current." }
    ]
  };
}