import * as THREE from 'three';
export function createBoronConfiguration() {
  const group = new THREE.Group();
  
  // Visualizing 1s2, 2s2, 2p1 in a quantum box diagram
  
  const createBox = (x, y, label, hasUp, hasDown) => {
      const boxGrp = new THREE.Group();
      const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 0.1), new THREE.MeshBasicMaterial({color: 0x555555, wireframe: true}));
      boxGrp.add(box);
      
      const text = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.3, 0.1), new THREE.MeshBasicMaterial({color: 0xffffff}));
      text.position.y = -0.8; boxGrp.add(text); // Label
      
      if (hasUp) {
          const up = new THREE.ArrowHelper(new THREE.Vector3(0,1,0), new THREE.Vector3(-0.2, -0.3, 0), 0.6, 0x00ffff, 0.2, 0.2);
          boxGrp.add(up);
      }
      if (hasDown) {
          const down = new THREE.ArrowHelper(new THREE.Vector3(0,-1,0), new THREE.Vector3(0.2, 0.3, 0), 0.6, 0xff00ff, 0.2, 0.2);
          boxGrp.add(down);
      }
      
      boxGrp.position.set(x, y, 0);
      group.add(boxGrp);
      return boxGrp;
  };

  // 1s box (Full)
  createBox(-3, 0, "1s", true, true);
  
  // 2s box (Full)
  createBox(-1, 1, "2s", true, true);
  
  // 2p boxes (3 boxes, only 1 has an electron)
  createBox(1, 2, "2px", true, false);
  createBox(2.2, 2, "2py", false, false);
  createBox(3.4, 2, "2pz", false, false);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = Math.sin(time*speed*0.5)*0.2; // Slight pan
      group.rotation.x = Math.sin(time*speed*0.3)*0.1;
  };

  return {
    group: group,
    description: "Electron Configuration (1s² 2s² 2p¹). This is the 'address book' of Boron's 5 electrons. The first floor (1s) is full with 2 electrons. The second floor spherical room (2s) is also full with 2 electrons. Boron's 5th and final electron is forced to move into the '2p' room. The 2p orbital actually consists of 3 separate boxes (x, y, and z axes), but Boron only has 1 electron to put in them, leaving two boxes completely empty!",
    parts: [
      { name: "Cyan Arrow", material: "Spin Up Electron", function: "Occupying a quantum state." },
      { name: "Magenta Arrow", material: "Spin Down Electron", function: "Occupying the paired quantum state." },
      { name: "Empty Boxes", material: "Unoccupied p-orbitals", function: "Empty seats waiting for chemical reactions." }
    ],
    quizQuestions: [
      { question: "How many EMPTY seats are there in Boron's 2p orbital?", options: ["None", "One", "Two", "Three"], correct: 2, explanation: "The p-orbital has 3 sub-boxes (which can hold 6 electrons total). Boron only has 1 electron to put there, leaving exactly 2 empty boxes." }
    ]
  };
}