import * as THREE from 'three';
export function createLithiumHundsRule() {
  const group = new THREE.Group();
  
  // Hund's Rule of Maximum Multiplicity (Remastered)
  
  // Three empty p-orbital boxes
  const boxes = new THREE.Group();
  const boxGeo = new THREE.BoxGeometry(2, 2, 2);
  const boxMat = new THREE.MeshPhysicalMaterial({color: 0x444444, transparent: true, opacity: 0.3, wireframe: true});
  
  const b1 = new THREE.Mesh(boxGeo, boxMat); b1.position.x = -3;
  const b2 = new THREE.Mesh(boxGeo, boxMat); b2.position.x = 0;
  const b3 = new THREE.Mesh(boxGeo, boxMat); b3.position.x = 3;
  boxes.add(b1, b2, b3);
  group.add(boxes);
  
  // Three electrons
  const createE = () => {
      const e = new THREE.Group();
      const s = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), new THREE.MeshPhysicalMaterial({color: 0x00ffff, emissive: 0x004444}));
      const a = new THREE.Mesh(new THREE.ConeGeometry(0.3, 1, 16), new THREE.MeshBasicMaterial({color: 0xff0000}));
      a.position.y = 0.8;
      e.add(s, a);
      return e;
  };
  
  const e1 = createE();
  const e2 = createE();
  const e3 = createE();
  group.add(e1, e2, e3);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(0, 5, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      // Gentle floating
      group.rotation.x = Math.sin(time*speed*0.1)*0.1;
      
      const cycle = (time * speed * 0.5) % 6;
      
      // All electrons start Spin Up
      e1.rotation.x = 0; e1.children[1].material.color.setHex(0xff0000);
      e2.rotation.x = 0; e2.children[1].material.color.setHex(0xff0000);
      e3.rotation.x = 0; e3.children[1].material.color.setHex(0xff0000);
      
      if (cycle < 2) {
          // e1 drops into box 1
          e1.position.set(-3, THREE.MathUtils.lerp(4, 0, cycle), 0);
          e2.position.set(0, 4, 0);
          e3.position.set(3, 4, 0);
      } else if (cycle < 4) {
          // e2 drops into box 2 (NOT box 1!)
          e1.position.set(-3, 0, 0);
          e2.position.set(0, THREE.MathUtils.lerp(4, 0, cycle-2), 0);
          e3.position.set(3, 4, 0);
      } else {
          // e3 drops into box 3
          e1.position.set(-3, 0, 0);
          e2.position.set(0, 0, 0);
          e3.position.set(3, THREE.MathUtils.lerp(4, 0, cycle-4), 0);
      }
      
      e1.rotation.y += delta * speed * 3;
      e2.rotation.y += delta * speed * 3;
      e3.rotation.y += delta * speed * 3;
  };

  return {
    group: group,
    description: "Hund's Rule of Maximum Multiplicity (Remastered). Imagine you get on an empty bus. Do you sit right next to a stranger, or do you pick an empty row? Electrons do the exact same thing! When filling orbitals of identical energy (like the three p-orbitals), electrons will always occupy empty orbitals first before pairing up. Furthermore, these solo electrons will all spin in the EXACT SAME direction (parallel spins) to minimize magnetic repulsion! In this animation, notice how the three electrons choose their own separate boxes and all keep their red 'Spin Up' arrows pointing the same way.",
    parts: [
      { name: "Wireframe Boxes", material: "Degenerate Orbitals", function: "The three p-orbitals (px, py, pz) which all have the exact same energy." },
      { name: "Cyan Spheres", material: "Electrons", function: "Filling the empty boxes first with parallel spins." }
    ],
    quizQuestions: [
      { question: "According to Hund's Rule, how do electrons behave when multiple empty orbitals of the same energy are available?", options: ["They immediately pair up in the first orbital", "They place one electron in each empty orbital first, all with the same spin, before pairing up.", "They leave the atom", "They stop spinning"], correct: 1, explanation: "Electrons 'hate' each other due to electrostatic repulsion. They will always spread out into empty rooms (orbitals) if they can!" }
    ]
  };
}