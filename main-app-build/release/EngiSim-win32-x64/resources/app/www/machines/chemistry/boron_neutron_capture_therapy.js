import * as THREE from 'three';
export function createBNCT() {
  const group = new THREE.Group();
  
  // Boron Neutron Capture Therapy (BNCT) - Cancer treatment
  
  // Cancer Cell (Sickly purple, irregular shape)
  const cellGeo = new THREE.IcosahedronGeometry(3, 2);
  // distort it
  const posAttr = cellGeo.attributes.position;
  for(let i=0; i<posAttr.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(posAttr, i);
      v.multiplyScalar(1 + (Math.random()-0.5)*0.3);
      posAttr.setXYZ(i, v.x, v.y, v.z);
  }
  cellGeo.computeVertexNormals();
  
  const cellMat = new THREE.MeshPhysicalMaterial({
      color: 0x880088, 
      transmission: 0.8, 
      transparent: true, 
      opacity: 0.6, 
      roughness: 0.8, 
      clearcoat: 0.1
  });
  const cell = new THREE.Mesh(cellGeo, cellMat);
  group.add(cell);
  
  // Boron-10 Atom inside the cancer cell
  const boron = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 32, 32),
      new THREE.MeshBasicMaterial({color: 0x00ffff})
  );
  boron.position.set(0.5, 0.5, 0.5);
  group.add(boron);
  
  // Incoming Thermal Neutron
  const neutron = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 16, 16),
      new THREE.MeshBasicMaterial({color: 0x00ff00})
  );
  group.add(neutron);
  
  // The explosion particles (Lithium-7 and Alpha particle)
  const li7 = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      new THREE.MeshBasicMaterial({color: 0xff0000}) // Red Lithium
  );
  const alpha = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 32, 32),
      new THREE.MeshBasicMaterial({color: 0xffff00}) // Yellow Alpha
  );
  group.add(li7, alpha);
  
  // Explosion flash
  const flash = new THREE.Mesh(
      new THREE.SphereGeometry(4, 32, 32),
      new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending})
  );
  group.add(flash);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 5, 5);
  group.add(light, new THREE.AmbientLight(0xffffff, 0.5));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      
      cell.rotation.x = time * speed * 0.05;
      cell.rotation.y = time * speed * 0.05;
      
      const cycle = (time * speed * 0.8) % 6;
      
      if (cycle < 2) {
          // Reset
          cell.material.opacity = 0.6;
          boron.visible = true;
          li7.visible = false;
          alpha.visible = false;
          flash.material.opacity = 0;
          
          // Neutron approaches from far away
          const t = cycle / 2; // 0 to 1
          neutron.visible = true;
          neutron.position.set(10 - t*9.5, 0.5, 0.5); // flying towards Boron
      } else if (cycle < 2.2) {
          // IMPACT!
          neutron.visible = false;
          boron.visible = false;
          flash.material.opacity = 1.0;
          flash.position.copy(boron.position);
          
          li7.visible = true; li7.position.copy(boron.position);
          alpha.visible = true; alpha.position.copy(boron.position);
          
          // The cancer cell takes massive damage
          cell.material.opacity = 0.2;
          cell.material.color.setHex(0x330033); // Turns black/dead
      } else {
          // High Energy Debris shreds the cell from the inside out
          const t = cycle - 2.2;
          flash.material.opacity = Math.max(0, 1 - t*2);
          
          // Lithium shoots one way, Alpha shoots the exact opposite way (Conservation of momentum)
          li7.position.add(new THREE.Vector3(-0.1, -0.1, -0.1));
          alpha.position.add(new THREE.Vector3(0.2, 0.2, 0.2)); // Alpha is lighter, moves faster
      }
  };

  return {
    group: group,
    description: "Boron Neutron Capture Therapy (BNCT). This is an experimental, cutting-edge cancer treatment! Doctors inject the patient with a special Boron drug that is absorbed exclusively by cancer cells (the purple blob). Then, they shoot a beam of safe, low-energy 'thermal neutrons' (the green dot) at the tumor. Because Boron-10 is the ultimate neutron catcher, it absorbs the neutron and instantly becomes unstable! It violently explodes into a Lithium-7 atom (red) and an Alpha particle (yellow). These two heavy particles shoot in opposite directions, utterly shredding the cancer cell's DNA from the inside out, while leaving the surrounding healthy cells completely untouched!",
    parts: [
      { name: "Purple Blob", material: "Cancer Cell", function: "Absorbs the Boron drug." },
      { name: "Green Dot", material: "Thermal Neutron", function: "A safe, low-energy particle beam that passes harmlessly through human flesh." },
      { name: "Red and Yellow Spheres", material: "Lithium & Alpha Debris", function: "The explosive shrapnel that shreds the cancer cell's DNA." }
    ],
    quizQuestions: [
      { question: "Why is BNCT such a targeted, incredible cancer treatment?", options: ["It freezes the cancer", "Because the Boron acts like a microscopic bomb placed ONLY inside cancer cells. It waits harmlessly until the doctor triggers it with a neutron beam, destroying the cancer without hurting healthy tissue.", "Because Boron is a vitamin", "It makes the cancer cells magnetic"], correct: 1, explanation: "Standard radiation therapy burns a hole right through healthy tissue to reach the tumor. BNCT uses a harmless beam that ONLY becomes lethal exactly where the Boron is!" }
    ]
  };
}