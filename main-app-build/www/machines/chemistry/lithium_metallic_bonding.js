import * as THREE from 'three';
export function createLithiumMetallicBonding() {
  const group = new THREE.Group();
  
  // Metallic Bonding (Sea of Electrons) (Remastered)
  
  // Create a 3x3x3 grid of Li+ cations
  const cations = new THREE.Group();
  const ionMat = new THREE.MeshPhysicalMaterial({color: 0xff0000, metalness: 0.8, roughness: 0.2});
  const ionGeo = new THREE.SphereGeometry(0.8, 16, 16);
  
  for(let x=-1; x<=1; x++) {
      for(let y=-1; y<=1; y++) {
          for(let z=-1; z<=1; z++) {
              const ion = new THREE.Mesh(ionGeo, ionMat);
              ion.position.set(x*2.5, y*2.5, z*2.5);
              
              // Draw a tiny plus sign on them
              const plus = new THREE.Group();
              plus.add(new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 0.2), new THREE.MeshBasicMaterial({color: 0xffffff})));
              plus.add(new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.8, 0.2), new THREE.MeshBasicMaterial({color: 0xffffff})));
              plus.position.z = 0.85;
              ion.add(plus);
              
              cations.add(ion);
          }
      }
  }
  group.add(cations);
  
  // The Sea of Electrons (Swarm of tiny blue spheres)
  const electronSea = new THREE.Group();
  const eGeo = new THREE.SphereGeometry(0.15, 8, 8);
  const eMat = new THREE.MeshBasicMaterial({color: 0x00ffff});
  
  const electronData = [];
  for(let i=0; i<150; i++) {
      const e = new THREE.Mesh(eGeo, eMat);
      // Random starting positions within the bounding box
      e.position.set((Math.random()-0.5)*8, (Math.random()-0.5)*8, (Math.random()-0.5)*8);
      electronSea.add(e);
      electronData.push({
          mesh: e,
          vx: (Math.random()-0.5)*5,
          vy: (Math.random()-0.5)*5,
          vz: (Math.random()-0.5)*5
      });
  }
  group.add(electronSea);
  
  // Outer bounding box (visual only)
  const box = new THREE.Mesh(new THREE.BoxGeometry(9, 9, 9), new THREE.MeshBasicMaterial({color: 0x444444, wireframe: true, transparent: true, opacity: 0.2}));
  group.add(box);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 5, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      group.rotation.x = Math.sin(time*speed*0.1)*0.2;
      
      // Make the cations gently vibrate (thermal energy)
      cations.children.forEach(ion => {
          const baseX = Math.round(ion.position.x / 2.5) * 2.5;
          const baseY = Math.round(ion.position.y / 2.5) * 2.5;
          const baseZ = Math.round(ion.position.z / 2.5) * 2.5;
          ion.position.x = baseX + Math.sin(time*speed*10 + baseY)*0.05;
          ion.position.y = baseY + Math.cos(time*speed*11 + baseZ)*0.05;
          ion.position.z = baseZ + Math.sin(time*speed*12 + baseX)*0.05;
      });
      
      // Animate the sea of electrons flowing freely
      electronData.forEach(data => {
          data.mesh.position.x += data.vx * delta * speed;
          data.mesh.position.y += data.vy * delta * speed;
          data.mesh.position.z += data.vz * delta * speed;
          
          // Bounce off walls
          if(data.mesh.position.x > 4.5 || data.mesh.position.x < -4.5) data.vx *= -1;
          if(data.mesh.position.y > 4.5 || data.mesh.position.y < -4.5) data.vy *= -1;
          if(data.mesh.position.z > 4.5 || data.mesh.position.z < -4.5) data.vz *= -1;
      });
  };

  return {
    group: group,
    description: "Metallic Bonding (Remastered). Have you ever wondered why metals conduct electricity? When billions of Lithium atoms group together to form a solid chunk of metal, they all collectively agree to give up their valence electrons! The atoms become positively charged cations (red) locked in a rigid crystal lattice. Meanwhile, their discarded valence electrons merge into a massive, fluid 'Sea of Electrons' (cyan dots). These electrons are 'delocalized', meaning they don't belong to any specific atom. They flow completely freely throughout the entire metal structure. If you apply a voltage, this sea of electrons instantly flows like water, creating an electric current!",
    parts: [
      { name: "Red Spheres (+)", material: "Lithium Cations (Li+)", function: "The stationary atoms locked in a crystal lattice structure." },
      { name: "Cyan Swarm", material: "Delocalized Sea of Electrons", function: "Free-flowing valence electrons that conduct electricity." }
    ],
    quizQuestions: [
      { question: "In a metallic bond, what does it mean for the electrons to be 'delocalized'?", options: ["They are trapped in the nucleus", "They no longer belong to a single atom, but flow freely throughout the entire metal lattice.", "They disappear completely", "They turn into protons"], correct: 1, explanation: "This free-flowing fluid nature is exactly what makes metals so conductive, malleable, and ductile!" }
    ]
  };
}