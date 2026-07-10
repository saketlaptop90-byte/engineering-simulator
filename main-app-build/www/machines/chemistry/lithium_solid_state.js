import * as THREE from 'three';
export function createLithiumSolidState() {
  const group = new THREE.Group();
  
  // Solid-State Battery (Remastered)
  
  // Left side: Traditional Liquid Electrolyte
  const liquidCell = new THREE.Group();
  const lAnode = new THREE.Mesh(new THREE.BoxGeometry(1, 4, 4), new THREE.MeshPhysicalMaterial({color: 0x222222})); lAnode.position.x = -2; liquidCell.add(lAnode);
  const lCath = new THREE.Mesh(new THREE.BoxGeometry(1, 4, 4), new THREE.MeshPhysicalMaterial({color: 0x000088})); lCath.position.x = 2; liquidCell.add(lCath);
  // Liquid between them
  const liquid = new THREE.Mesh(new THREE.BoxGeometry(3, 4, 4), new THREE.MeshPhysicalMaterial({color: 0x00ff00, transparent: true, opacity: 0.3, transmission: 0.9}));
  liquidCell.add(liquid);
  // Dendrite forming! (The danger)
  const dendrite = new THREE.Mesh(new THREE.ConeGeometry(0.3, 2, 8), new THREE.MeshPhysicalMaterial({color: 0xcccccc}));
  dendrite.rotation.z = -Math.PI/2;
  liquidCell.add(dendrite);
  
  liquidCell.position.x = -4;
  group.add(liquidCell);
  
  // Right side: Solid-State Electrolyte
  const solidCell = new THREE.Group();
  const sAnode = new THREE.Mesh(new THREE.BoxGeometry(1, 4, 4), new THREE.MeshPhysicalMaterial({color: 0x222222})); sAnode.position.x = -2; solidCell.add(sAnode);
  const sCath = new THREE.Mesh(new THREE.BoxGeometry(1, 4, 4), new THREE.MeshPhysicalMaterial({color: 0x000088})); sCath.position.x = 2; solidCell.add(sCath);
  // Solid Ceramic between them
  const solid = new THREE.Mesh(new THREE.BoxGeometry(3, 4, 4), new THREE.MeshPhysicalMaterial({color: 0xffffff, transparent: true, opacity: 0.8, roughness: 0.1}));
  solidCell.add(solid);
  // Dendrite trying to form but blocked!
  const blockedDendrite = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.5, 8), new THREE.MeshPhysicalMaterial({color: 0xcccccc}));
  blockedDendrite.rotation.z = -Math.PI/2;
  blockedDendrite.position.set(-1.25, 0, 0);
  solidCell.add(blockedDendrite);
  
  solidCell.position.x = 4;
  group.add(solidCell);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(0, 5, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.x = 0.2;
      group.rotation.y = Math.sin(time*speed*0.1)*0.2;
      
      const cycle = (time * speed) % 4;
      
      // Liquid cell dendrite grows across and shorts the battery!
      if (cycle < 3) {
          const t = cycle / 3; // 0 to 1
          dendrite.scale.y = t;
          dendrite.position.x = -1.5 + (t*2)/2;
          liquid.material.color.setHex(0x00ff00); // safe
      } else {
          // BOOM! Short circuit
          liquid.material.color.setHex(0xff0000); // FIRE!
      }
      
      // Solid cell blocks it completely
      solid.material.color.setHex(0xffffff); // always safe
  };

  return {
    group: group,
    description: "Solid-State Battery (Remastered). Why do old hoverboards and vapes sometimes catch fire? Normal batteries use a highly flammable liquid (green) to transport ions between the anode and cathode. If charged improperly, Lithium atoms can stack on top of each other, growing a sharp metal spike called a 'Dendrite'. In a liquid battery, the dendrite easily pierces across the liquid, touches the other side, and causes a massive short-circuit fire! A Solid-State Battery (right) replaces the flammable liquid with a rock-hard ceramic shield. The ceramic is solid enough to physically block dendrites from growing, completely eliminating the risk of fire while allowing the battery to charge 5x faster!",
    parts: [
      { name: "Left Battery", material: "Liquid Electrolyte", function: "Flammable, and easily pierced by metal dendrite spikes." },
      { name: "Right Battery", material: "Solid Ceramic Electrolyte", function: "Physically blocks dendrites, making the battery fireproof." }
    ],
    quizQuestions: [
      { question: "What is the main advantage of a Solid-State battery over a traditional liquid Lithium-ion battery?", options: ["It uses less electricity", "It replaces the flammable liquid with a solid ceramic that physically blocks dendrite spikes, preventing short-circuits and fires.", "It doesn't use Lithium", "It is made of wood"], correct: 1, explanation: "By eliminating the fire risk, engineers can pack more energy into the battery and charge it much faster without worrying about explosions!" }
    ]
  };
}