import * as THREE from 'three';
export function createHydrogenOxidationReduction() {
  const group = new THREE.Group();
  
  // Left: Oxidation (H -> H+ + e-)
  const oxGroup = new THREE.Group();
  oxGroup.position.set(-3, 0, 0);
  const hNuc = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  oxGroup.add(hNuc);
  const hElec = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0x0000ff}));
  oxGroup.add(hElec);
  group.add(oxGroup);

  // Right: Reduction (H + e- -> H-)
  const redGroup = new THREE.Group();
  redGroup.position.set(3, 0, 0);
  const rNuc = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16,16), new THREE.MeshBasicMaterial({color: 0xff0000}));
  redGroup.add(rNuc);
  const rElec1 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0x0000ff}));
  const rElec2 = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16,16), new THREE.MeshBasicMaterial({color: 0x0000ff}));
  redGroup.add(rElec1, rElec2);
  
  const cloud = new THREE.Mesh(new THREE.SphereGeometry(2, 32,32), new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity: 0.2}));
  redGroup.add(cloud);
  group.add(redGroup);

  group.userData.animate = function(delta, time, speed) {
      const cycle = (time * speed) % 4;
      
      // Oxidation: Electron leaves
      if(cycle < 2) {
          hElec.position.set(1.5 + cycle*2, 0, 0);
          hElec.material.transparent = true;
          hElec.material.opacity = 1 - (cycle/2);
      } else {
          hElec.position.set(1.5, 0, 0);
          hElec.material.opacity = 1;
      }

      // Reduction: Electron arrives
      if(cycle < 2) {
          rElec1.position.set(-2 + cycle, 0, 0);
          rElec2.position.set(1, 0, 0);
          cloud.scale.setScalar(0.5 + cycle*0.25);
      } else {
          rElec1.position.set(0,0,0); // reset
      }
  };

  return {
    group: group,
    description: "Oxidation and Reduction. Hydrogen is incredibly versatile. It can undergo Oxidation (losing its electron to become H+, a proton, common in acids) OR it can undergo Reduction (gaining an electron to become H-, a hydride, common when bonding with metals like LiH).",
    parts: [
      { name: "Oxidation (Left)", material: "Losing e-", function: "Hydrogen becomes a positive H+ ion (proton)." },
      { name: "Reduction (Right)", material: "Gaining e-", function: "Hydrogen becomes a negative H- ion (hydride) with a full 1s shell." }
    ],
    quizQuestions: [
      { question: "What is the mnemonic 'OIL RIG' used to remember in chemistry?", options: ["Oxidation Is Losing (electrons), Reduction Is Gaining (electrons)", "Oxygen Is Light, Radium Is Glowing", "Only Ions Lose, Radicals Include Gases", "Oxidation Is Lithium, Reduction Is Gold"], correct: 0, explanation: "When Hydrogen undergoes Oxidation, it loses an electron (becoming H+). When it undergoes Reduction, it gains an electron (becoming H-)." }
    ]
  };
}