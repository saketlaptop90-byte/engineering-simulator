import * as THREE from 'three';
export function createHydrogenEnvironmentalImpact() {
  const group = new THREE.Group();
  
  // Exhaust pipe
  const pipe = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 3, 32), new THREE.MeshStandardMaterial({color: 0x555555, metalness: 0.9}));
  pipe.rotation.z = Math.PI/2;
  pipe.position.x = -2;
  group.add(pipe);

  // Water vapor emitting
  const vapor = new THREE.Group();
  for(let i=0; i<30; i++) {
      const v = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16,16), new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.5}));
      v.userData = { offset: Math.random() * 5, yOffset: (Math.random()-0.5)*2, zOffset: (Math.random()-0.5)*2 };
      vapor.add(v);
  }
  group.add(vapor);

  group.userData.animate = function(delta, time, speed) {
      vapor.children.forEach(v => {
          const t = ((time*speed*2 + v.userData.offset) % 5);
          v.position.set(0 + t*1.5, v.userData.yOffset + t*0.5, v.userData.zOffset);
          v.scale.setScalar(1 + t*0.5);
          v.material.opacity = Math.max(0, 0.8 - t*0.15);
      });
  };

  return {
    group: group,
    description: "Environmental Impact (Green Hydrogen). Hydrogen is considered the ultimate clean fuel. When Hydrogen gas (H2) is combusted or used in a fuel cell, it bonds with Oxygen from the air. The only resulting exhaust product is pure, clean water vapor (H2O), with zero carbon emissions.",
    parts: [
      { name: "Hydrogen Fuel", material: "Reactant", function: "Contains immense chemical energy." },
      { name: "Water Vapor Exhaust", material: "Cloud", function: "The sole byproduct of combining H2 with O2." }
    ],
    quizQuestions: [
      { question: "What is the only chemical byproduct produced when pure Hydrogen gas is burned or used in a fuel cell?", options: ["Carbon Dioxide (CO2)", "Methane (CH4)", "Water (H2O)", "Sulfur Dioxide (SO2)"], correct: 2, explanation: "The chemical equation is 2H2 + O2 -> 2H2O. Because there is no Carbon present in the fuel, no Carbon Dioxide or Carbon Monoxide can be produced, making it a perfectly zero-carbon emission fuel." }
    ]
  };
}