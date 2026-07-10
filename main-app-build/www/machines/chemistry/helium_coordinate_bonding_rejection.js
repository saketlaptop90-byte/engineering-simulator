import * as THREE from 'three';
export function createHeliumCoordinateBondingRejection() {
  const group = new THREE.Group();
  
  // Helium atom (completely full 1s shell)
  const he = new THREE.Group();
  he.add(new THREE.Mesh(new THREE.SphereGeometry(1.2, 32,32), new THREE.MeshPhysicalMaterial({color: 0x00ffff, transparent: true, opacity: 0.5})));
  he.add(new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000})));
  // Showing the two electrons inside
  const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff})); e1.position.set(0.5, 0.5, 0);
  const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff})); e2.position.set(-0.5, -0.5, 0);
  he.add(e1, e2);
  he.position.set(-1.5, 0, 0);
  group.add(he);

  // Incoming H+ (Proton, zero electrons, wants a coordinate bond)
  const hPlus = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  group.add(hPlus);
  
  // Forcefield bounce
  const shield = new THREE.Mesh(new THREE.SphereGeometry(1.4, 32,32), new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.0, wireframe: true}));
  he.add(shield);

  group.userData.animate = function(delta, time, speed) {
      he.rotation.y = time * speed;
      
      const cycle = (time * speed * 1.5) % 3;
      if (cycle < 1) {
          // H+ approaches
          hPlus.position.set(3 - cycle*2, 0, 0);
          shield.material.opacity = 0;
      } else if (cycle < 1.5) {
          // Impact and bounce
          hPlus.position.set(1.0, 0, 0);
          shield.material.opacity = (1.5 - cycle) * 2;
      } else {
          // Flying away
          hPlus.position.set(1.0 + (cycle-1.5)*3, 0, 0);
          shield.material.opacity = 0;
      }
  };

  return {
    group: group,
    description: "Coordinate Bonding Rejection. When an acid donates a bare proton (H+), it desperately wants to form a coordinate bond by sharing someone else's lone pair. Water accepts it to form H3O+. Helium HAS a lone pair (1s²), but its ionization energy is so astronomically high that it refuses to share it, violently repelling the proton.",
    parts: [
      { name: "Helium Atom", material: "Cyan Sphere", function: "Has a perfect pair of electrons, but refuses to share." },
      { name: "H+ Proton", material: "Red Sphere", function: "Attempts to form a coordinate bond but is repelled by Helium's unyielding stability." }
    ],
    quizQuestions: [
      { question: "Even though Helium has two paired electrons, why does it refuse to form a coordinate bond with an H+ ion?", options: ["It doesn't have a p-orbital", "Its electrons are held too tightly by the +2 nucleus to be shared (Highest ionization energy)", "It is a liquid", "H+ is negatively charged"], correct: 1, explanation: "Coordinate bonding requires an atom to 'reach out' and share its electron pair. Helium's nucleus is holding its pair so incredibly tightly that it acts like an impenetrable fortress." }
    ]
  };
}