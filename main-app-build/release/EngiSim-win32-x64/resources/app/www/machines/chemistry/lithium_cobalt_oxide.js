import * as THREE from 'three';
export function createLithiumCobaltOxide() {
  const group = new THREE.Group();
  
  // LiCoO2 Cathode Molecular Structure (Remastered)
  
  // Cobalt atoms (Blue) and Oxygen atoms (Red) form tightly bound layers
  const coMat = new THREE.MeshPhysicalMaterial({color: 0x0000ff, metalness: 0.6, roughness: 0.4});
  const oMat = new THREE.MeshPhysicalMaterial({color: 0xff0000, metalness: 0.2, roughness: 0.2});
  const liMat = new THREE.MeshPhysicalMaterial({color: 0x00ffff, metalness: 0.8, emissive: 0x004444}); // Lithium ions
  const bondMat = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.3});
  
  const meshGroup = new THREE.Group();
  
  // Build a 2D sheet of Cobalt Oxide edge-sharing octahedra (simplified)
  const buildLayer = (yPos) => {
      const g = new THREE.Group();
      for(let x=-2; x<=2; x+=2) {
          for(let z=-2; z<=2; z+=2) {
              const co = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), coMat);
              co.position.set(x, yPos, z);
              g.add(co);
              
              // Oxygens surrounding it
              const o1 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), oMat); o1.position.set(x+1, yPos+0.5, z);
              const o2 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), oMat); o2.position.set(x-1, yPos-0.5, z);
              g.add(o1, o2);
              
              // Bonds
              const b1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.2), bondMat);
              b1.position.copy(co.position).add(o1.position).multiplyScalar(0.5);
              b1.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), o1.position.clone().sub(co.position).normalize());
              
              const b2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.2), bondMat);
              b2.position.copy(co.position).add(o2.position).multiplyScalar(0.5);
              b2.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), o2.position.clone().sub(co.position).normalize());
              g.add(b1, b2);
          }
      }
      return g;
  };
  
  // Two layers of Cobalt Oxide
  meshGroup.add(buildLayer(-2));
  meshGroup.add(buildLayer(2));
  
  // The 'Van der Waals Gap' between the layers where the Lithium ions slide in!
  const liGroup = new THREE.Group();
  for(let x=-2; x<=2; x+=2) {
      for(let z=-2; z<=2; z+=2) {
          const li = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), liMat);
          li.userData = { baseX: x, baseZ: z, phase: Math.random()*Math.PI*2 };
          liGroup.add(li);
      }
  }
  meshGroup.add(liGroup);
  group.add(meshGroup);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 5, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      group.rotation.x = Math.sin(time*speed*0.1)*0.2 + 0.2;
      
      // Lithium ions sliding into the gap (Intercalation)
      liGroup.children.forEach(li => {
          // Slide in and out of the lattice
          const slide = Math.sin(time * speed * 0.5 + li.userData.phase);
          if (slide > 0) {
              li.position.set(li.userData.baseX, 0, li.userData.baseZ); // Inside gap
              li.material.opacity = 1;
          } else {
              li.position.set(li.userData.baseX - slide*5, 0, li.userData.baseZ); // Slid out
              li.material.opacity = 0.5;
          }
      });
  };

  return {
    group: group,
    description: "LiCoO2 Cathode Molecular Structure (Remastered). Have you ever wondered why batteries degrade and eventually die? Look at the crystal structure of Lithium Cobalt Oxide (the cathode in your phone battery). The strong Cobalt (blue) and Oxygen (red) atoms form rigid sheets. The empty space between these sheets is called the 'Van der Waals Gap'. When you charge your phone, the tiny Lithium ions (cyan) forcefully slide out of this gap. When you discharge it, they slide back in. Over thousands of cycles, the physical swelling and shrinking causes the rigid Cobalt sheets to fracture and crack! This micro-fracturing permanently ruins the battery's capacity.",
    parts: [
      { name: "Blue & Red Sheets", material: "Cobalt Oxide Layers", function: "The rigid host crystal." },
      { name: "Cyan Spheres", material: "Lithium Cations (Li+)", function: "Sliding in and out of the empty gap between the sheets." }
    ],
    quizQuestions: [
      { question: "Why do cell phone batteries slowly lose their maximum capacity over several years?", options: ["The Lithium evaporates", "The repeated physical sliding of Lithium ions in and out of the crystal lattice causes microscopic fracturing and structural degradation of the Cobalt sheets.", "The phone gets too cold", "The electrons run out"], correct: 1, explanation: "Battery degradation is a physical, mechanical problem! The crystal lattice literally shatters under the repeated stress of expansion and contraction." }
    ]
  };
}