import * as THREE from 'three';
export function createBerylliumEntanglement() {
  const group = new THREE.Group();
  
  // Two Beryllium 1s electrons entangled
  
  const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), new THREE.MeshBasicMaterial({color: 0x00ffff}));
  e1.position.set(-3, 0, 0);
  const a1 = new THREE.ArrowHelper(new THREE.Vector3(0,1,0), new THREE.Vector3(0,0,0), 1.5, 0x00ffff, 0.4, 0.4); e1.add(a1);
  group.add(e1);
  
  const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), new THREE.MeshBasicMaterial({color: 0xff00ff}));
  e2.position.set(3, 0, 0);
  const a2 = new THREE.ArrowHelper(new THREE.Vector3(0,-1,0), new THREE.Vector3(0,0,0), 1.5, 0xff00ff, 0.4, 0.4); e2.add(a2);
  group.add(e2);

  // Spooky connection string
  const linkCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-3, 0, 0),
      new THREE.Vector3(0, Math.sin(0)*2, 0),
      new THREE.Vector3(3, 0, 0)
  ]);
  const linkTube = new THREE.Mesh(new THREE.TubeGeometry(linkCurve, 64, 0.05, 8, false), new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.5}));
  group.add(linkTube);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = Math.sin(time*speed*0.1)*0.2;
      
      // Update link geometry
      const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-3, 0, 0),
          new THREE.Vector3(0, Math.sin(time*speed*5)*2, Math.cos(time*speed*5)*2),
          new THREE.Vector3(3, 0, 0)
      ]);
      linkTube.geometry.dispose();
      linkTube.geometry = new THREE.TubeGeometry(curve, 64, 0.05, 8, false);
      
      // Flip spins
      if (Math.sin(time*speed*2) > 0) {
          a1.setDirection(new THREE.Vector3(0,1,0));
          a2.setDirection(new THREE.Vector3(0,-1,0));
      } else {
          a1.setDirection(new THREE.Vector3(0,-1,0));
          a2.setDirection(new THREE.Vector3(0,1,0));
      }
  };

  return {
    group: group,
    description: "Quantum Entanglement. The two electrons in Beryllium's 1s orbital are 'entangled'. This means their quantum states are mathematically linked. According to the Pauli Exclusion Principle, if one is Spin Up, the other MUST be Spin Down. If you took these two electrons and separated them by 10 billion lightyears, and forced one to flip its spin, the other one would instantly flip its spin to compensate, completely ignoring the speed of light. Einstein called this 'Spooky action at a distance.'",
    parts: [
      { name: "Cyan Electron", material: "Particle A", function: "Instantly reacts to Particle B." },
      { name: "Magenta Electron", material: "Particle B", function: "Instantly reacts to Particle A." },
      { name: "Wavy White Line", material: "Entanglement", function: "The non-physical, instantaneous quantum link between them." }
    ],
    quizQuestions: [
      { question: "If you take two entangled Beryllium electrons to opposite ends of the universe, and you force one to spin 'Up', what happens to the other one?", options: ["It takes billions of years to receive the signal", "It explodes", "It instantly spins 'Down', completely ignoring the speed of light limit", "It spins 'Up' as well"], correct: 2, explanation: "This has been experimentally proven. Entangled particles share a single quantum state. Changing one instantly defines the state of the other, no matter the distance." }
    ]
  };
}