import * as THREE from 'three';
export function createLithiumBatteryCell() {
  const group = new THREE.Group();
  
  // Lithium-Ion Battery Intercalation (Remastered)
  
  // Anode: Graphite Layers (Carbon)
  const graphite = new THREE.Group();
  const cMat = new THREE.MeshPhysicalMaterial({color: 0x222222, metalness: 0.8, roughness: 0.2});
  
  for(let i=0; i<3; i++) {
      const sheet = new THREE.Mesh(new THREE.BoxGeometry(4, 0.2, 4), cMat);
      sheet.position.y = i * 1.5 - 1.5;
      graphite.add(sheet);
  }
  graphite.position.x = -4;
  group.add(graphite);
  
  // Cathode: Lithium Cobalt Oxide (LiCoO2) lattice representation
  const cathode = new THREE.Group();
  const coMat = new THREE.MeshPhysicalMaterial({color: 0x000088, metalness: 0.5, roughness: 0.5}); // Cobalt Oxide
  for(let i=0; i<3; i++) {
      const sheet = new THREE.Mesh(new THREE.BoxGeometry(4, 0.5, 4), coMat);
      sheet.position.y = i * 1.5 - 1.5;
      cathode.add(sheet);
  }
  cathode.position.x = 4;
  group.add(cathode);
  
  // Lithium Ions (Li+) flowing between them
  const ions = [];
  const liMat = new THREE.MeshPhysicalMaterial({color: 0x00ffff, metalness: 0.3, roughness: 0.1, emissive: 0x004444});
  
  for(let i=0; i<15; i++) {
      const ion = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), liMat);
      // Give each ion a random Y and Z offset so they slot into different parts of the layers
      ion.userData = {
          yOffset: (Math.random()-0.5)*3,
          zOffset: (Math.random()-0.5)*3,
          phase: Math.random() * Math.PI * 2 // spread them out in time
      };
      group.add(ion);
      ions.push(ion);
  }
  
  // Separator membrane
  const membrane = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 6),
      new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.2, wireframe: true})
  );
  membrane.rotation.y = Math.PI/2;
  group.add(membrane);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(0, 5, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.x = 0.2;
      group.rotation.y = Math.sin(time*speed*0.1)*0.2;
      
      // Animate the flow of ions (Discharging and Charging)
      // They flow from Anode (left) to Cathode (right), then back again
      const flowDir = Math.sin(time * speed * 0.5); // positive = discharging to right, negative = charging to left
      
      ions.forEach(ion => {
          // Calculate a local phase based on time
          const t = ((time * speed * 0.5) + ion.userData.phase) % (Math.PI * 2);
          const xPos = Math.sin(t) * 4; // oscillates between -4 (Anode) and +4 (Cathode)
          
          ion.position.set(xPos, ion.userData.yOffset, ion.userData.zOffset);
      });
      
      // Color change to show energy state
      if (flowDir > 0) {
          membrane.material.color.setHex(0xff0000); // Discharging (Powering device)
      } else {
          membrane.material.color.setHex(0x00ff00); // Charging (Plugged in)
      }
  };

  return {
    group: group,
    description: "Lithium-Ion Battery Cell (Remastered). This is how your phone battery works! On the left is the Anode (made of layered Graphite). On the right is the Cathode (made of Cobalt Oxide). Because Lithium Cations (Li+) are so incredibly tiny, they can physically squeeze into the microscopic gaps between the graphite layers—a process called 'Intercalation'. When you use your phone, the Lithium ions flow through the separator membrane from the Anode to the Cathode, releasing electrons through your phone's circuits. When you plug it into the wall, the electricity forces the ions back into the Graphite to store energy again!",
    parts: [
      { name: "Black Layers", material: "Graphite Anode", function: "Stores Lithium ions when the battery is fully charged." },
      { name: "Blue Layers", material: "Cobalt Oxide Cathode", function: "Absorbs Lithium ions when the battery is dead." },
      { name: "Cyan Spheres", material: "Lithium Cations (Li+)", function: "The tiny charge carriers that flow back and forth between the electrodes." }
    ],
    quizQuestions: [
      { question: "What is the process called where Lithium ions squeeze into the empty gaps between the Graphite layers?", options: ["Melting", "Intercalation", "Sublimation", "Fission"], correct: 1, explanation: "Intercalation literally means 'inserting into layers'. Because Li+ ions are so small, they fit perfectly without destroying the graphite structure, allowing batteries to be recharged thousands of times!" }
    ]
  };
}