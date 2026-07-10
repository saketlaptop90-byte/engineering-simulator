import * as THREE from 'three';
export function createBerylliumGaseousState() {
  const group = new THREE.Group();
  
  // Boiling point is 2469 °C
  
  const gas = new THREE.Group();
  for(let i=0; i<15; i++) {
      const atom = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshBasicMaterial({color: 0xffffff})); // White hot
      atom.userData = {
          vx: (Math.random()-0.5)*5,
          vy: (Math.random()-0.5)*5,
          vz: (Math.random()-0.5)*5
      };
      gas.add(atom);
  }
  group.add(gas);

  const container = new THREE.Mesh(new THREE.BoxGeometry(6, 6, 6), new THREE.MeshBasicMaterial({color: 0x444444, wireframe: true, transparent: true, opacity: 0.2}));
  group.add(container);

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      group.rotation.x = time * speed * 0.05;
      
      gas.children.forEach(atom => {
          atom.position.x += atom.userData.vx * delta * speed;
          atom.position.y += atom.userData.vy * delta * speed;
          atom.position.z += atom.userData.vz * delta * speed;
          
          if (Math.abs(atom.position.x) > 3) atom.userData.vx *= -1;
          if (Math.abs(atom.position.y) > 3) atom.userData.vy *= -1;
          if (Math.abs(atom.position.z) > 3) atom.userData.vz *= -1;
      });
  };

  return {
    group: group,
    description: "Gaseous State. If you continue heating liquid Beryllium to 2469 °C (4476 °F), it boils. The immense thermal energy completely shatters all metallic bonds. The atoms are now flying completely free of one another, bouncing off the walls of their container at supersonic speeds. Beryllium gas is incredibly toxic if inhaled, causing an incurable lung disease called berylliosis.",
    parts: [
      { name: "White Hot Spheres", material: "Beryllium Gas Atoms", function: "Flying independently with extreme kinetic energy." },
      { name: "Wireframe Box", material: "Containment", function: "Necessary to keep the highly energetic gas from dissipating into the atmosphere." }
    ],
    quizQuestions: [
      { question: "What happens to the 'sea of electrons' when Beryllium boils into a gas?", options: ["It turns into water", "The metallic bonds break completely, and the electrons return to orbiting their individual Beryllium atoms", "They freeze", "They shoot out as lasers"], correct: 1, explanation: "Metallic bonds only exist when atoms are packed closely together in a solid or liquid. Once they boil into a gas, they are too far apart to share a 'sea'. Each atom takes back its 2 valence electrons and becomes neutral again." }
    ]
  };
}