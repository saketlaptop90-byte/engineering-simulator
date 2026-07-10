import * as THREE from 'three';
export function createLithiumPauliExclusionPrinciple() {
  const group = new THREE.Group();
  
  // Pauli Exclusion Principle (Remastered)
  
  // The 1s Orbital Box
  const box = new THREE.Mesh(
      new THREE.BoxGeometry(4, 4, 4),
      new THREE.MeshPhysicalMaterial({color: 0x444444, transparent: true, opacity: 0.2, wireframe: true})
  );
  group.add(box);
  
  // Create an electron with a spin arrow
  const createE = (color, yPos, spin) => {
      const g = new THREE.Group();
      const e = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), new THREE.MeshPhysicalMaterial({color: color, emissive: 0x222222}));
      const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1.5, 16), new THREE.MeshBasicMaterial({color: color}));
      arrow.position.y = spin > 0 ? 1 : -1;
      arrow.rotation.x = spin > 0 ? 0 : Math.PI;
      g.add(e, arrow);
      g.position.y = yPos;
      g.userData = { baseRot: spin > 0 ? 1 : -1 };
      return g;
  };
  
  const e1 = createE(0xff0000, 1.5, 1); // Spin Up
  const e2 = createE(0x0000ff, -1.5, -1); // Spin Down
  box.add(e1, e2);
  
  // A third electron trying to enter!
  const e3 = createE(0x00ff00, 5, 1); // Spin Up (Conflict!)
  group.add(e3);
  
  // X mark to show rejection
  const xMark = new THREE.Group();
  const m1 = new THREE.Mesh(new THREE.PlaneGeometry(2, 0.4), new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide})); m1.rotation.z = Math.PI/4;
  const m2 = new THREE.Mesh(new THREE.PlaneGeometry(2, 0.4), new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide})); m2.rotation.z = -Math.PI/4;
  xMark.add(m1, m2);
  xMark.position.y = 3;
  xMark.visible = false;
  group.add(xMark);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 5, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.2;
      
      e1.rotation.y += delta * speed * e1.userData.baseRot * 2;
      e2.rotation.y += delta * speed * e2.userData.baseRot * 2;
      e3.rotation.y += delta * speed * e3.userData.baseRot * 2;
      
      const cycle = (time * speed * 0.5) % 4;
      
      if (cycle < 2) {
          // e3 tries to enter the box
          e3.position.y = 5 - (cycle * 1.5);
          xMark.visible = false;
          box.material.color.setHex(0x444444);
      } else {
          // BONK! Rejected by Pauli Exclusion!
          e3.position.y = 2 + ((cycle-2)*3); // bounces away
          xMark.visible = true;
          box.material.color.setHex(0xff0000); // flash red
      }
      
      xMark.lookAt(light.position); // Always face camera generally
  };

  return {
    group: group,
    description: "The Pauli Exclusion Principle (Remastered). Formulated by Wolfgang Pauli in 1925, this fundamental law of physics states: 'No two electrons in an atom can have the exact same four quantum numbers.' Since any given orbital only has one n, l, and m value, the only variable left is Spin (up or down). Because there are only two possible spins, an orbital can NEVER hold more than 2 electrons! Watch as the green electron (Spin Up) tries to enter the 1s orbital. Because the red electron is already Spin Up, the green one is violently rejected by the laws of quantum mechanics!",
    parts: [
      { name: "Red/Blue Spheres", material: "Occupied Electrons", function: "One is Spin Up, one is Spin Down. The orbital is perfectly full." },
      { name: "Green Sphere", material: "Rejected Electron", function: "Cannot enter because its quantum numbers would perfectly match the red electron." }
    ],
    quizQuestions: [
      { question: "According to the Pauli Exclusion Principle, what is the absolute maximum number of electrons that can fit in a single orbital?", options: ["One", "Two (one spin up, one spin down).", "Four", "Infinity"], correct: 1, explanation: "Because there are only two spin states available, the 3rd electron would be forced to duplicate a quantum state, which is physically impossible!" }
    ]
  };
}