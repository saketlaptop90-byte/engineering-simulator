import * as THREE from 'three';
export function createLithiumAirBattery() {
  const group = new THREE.Group();
  
  // Lithium-Air Battery (Remastered)
  
  // Solid Lithium Metal Anode
  const anode = new THREE.Mesh(
      new THREE.BoxGeometry(2, 6, 4),
      new THREE.MeshPhysicalMaterial({color: 0xcccccc, metalness: 0.9, roughness: 0.2})
  );
  anode.position.x = -4;
  group.add(anode);
  
  // Porous Carbon Cathode (Air breathing)
  const cathode = new THREE.Mesh(
      new THREE.BoxGeometry(2, 6, 4),
      new THREE.MeshPhysicalMaterial({color: 0x222222, metalness: 0.5, roughness: 0.9, wireframe: true})
  );
  cathode.position.x = 4;
  group.add(cathode);
  
  // Atmospheric Oxygen (O2) flowing into the cathode
  const oxygens = new THREE.Group();
  const oMat = new THREE.MeshPhysicalMaterial({color: 0x0088ff, metalness: 0.1, roughness: 0.5, transparent: true, opacity: 0.6});
  for(let i=0; i<20; i++) {
      const o = new THREE.Group();
      o.add(new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), oMat).position.set(0, 0.3, 0));
      o.add(new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), oMat).position.set(0, -0.3, 0));
      o.userData = {
          yOffset: (Math.random()-0.5)*5,
          zOffset: (Math.random()-0.5)*3,
          phase: Math.random() * Math.PI * 2
      };
      oxygens.add(o);
  }
  group.add(oxygens);
  
  // Lithium Ions crossing to react with oxygen
  const ions = new THREE.Group();
  const liMat = new THREE.MeshPhysicalMaterial({color: 0x00ffff, metalness: 0.3, emissive: 0x004444});
  for(let i=0; i<20; i++) {
      const li = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), liMat);
      li.userData = {
          yOffset: (Math.random()-0.5)*5,
          zOffset: (Math.random()-0.5)*3,
          phase: Math.random() * Math.PI * 2
      };
      ions.add(li);
  }
  group.add(ions);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(0, 5, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.x = 0.2;
      group.rotation.y = Math.sin(time*speed*0.1)*0.2;
      
      // Oxygen flows in from the right
      oxygens.children.forEach(o => {
          const t = ((time * speed * 0.5) + o.userData.phase) % (Math.PI);
          const xPos = 8 - t*4; // from x=8 to x=4 (inside cathode)
          o.position.set(xPos, o.userData.yOffset, o.userData.zOffset);
          o.rotation.x += delta * speed;
      });
      
      // Lithium flows out from the anode to meet the oxygen
      ions.children.forEach(li => {
          const t = ((time * speed * 0.5) + li.userData.phase) % (Math.PI);
          const xPos = -4 + t*8; // from x=-4 to x=4 (inside cathode)
          li.position.set(xPos, li.userData.yOffset, li.userData.zOffset);
      });
  };

  return {
    group: group,
    description: "Lithium-Air Battery (Remastered). Normal batteries are heavy because you have to carry the cathode chemicals (like Cobalt) with you everywhere. What if you didn't? The experimental Lithium-Air battery replaces the heavy metal cathode with a porous carbon sponge. It literally 'breathes' Oxygen directly out of the atmosphere! When you discharge the battery, Lithium ions flow from the anode, meet the atmospheric oxygen inside the sponge, and react to form Lithium Peroxide. Because you don't have to carry the Oxygen with you, these batteries have the highest theoretical energy density of any battery—approaching the energy density of gasoline!",
    parts: [
      { name: "Silver Block", material: "Solid Lithium Anode", function: "The source of the Lithium ions." },
      { name: "Wireframe Block", material: "Porous Carbon", function: "Allows outside air to flow directly into the battery." },
      { name: "Blue Dumbbells", material: "Oxygen (O2)", function: "Pulled from the air to react with the Lithium." }
    ],
    quizQuestions: [
      { question: "Why is the energy density of a Lithium-Air battery so much higher than a normal Lithium-Ion battery?", options: ["Because air is magic", "Because it uses oxygen from the atmosphere as the cathode, meaning it doesn't have to physically carry the weight of heavy cathode materials inside the car.", "Because it uses gasoline", "Because the battery is larger"], correct: 1, explanation: "Weight is everything in electric vehicles. If your battery can 'breathe' its chemicals from the air as you drive, it saves massive amounts of weight!" }
    ]
  };
}