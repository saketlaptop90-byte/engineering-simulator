import * as THREE from 'three';
export function createLithiumRutherfordModel() {
  const group = new THREE.Group();
  
  // Rutherford Model of Lithium (Remastered)
  // Shows the famous gold foil experiment concept applied to a Lithium atom
  
  // The dense, tiny nucleus (3 protons, 4 neutrons)
  const nucleus = new THREE.Group();
  const pMat = new THREE.MeshPhysicalMaterial({color: 0xff0000, metalness: 0.3, roughness: 0.2});
  const nMat = new THREE.MeshPhysicalMaterial({color: 0x0000ff, metalness: 0.3, roughness: 0.2});
  
  // Add some protons and neutrons tightly packed
  for(let i=0; i<7; i++) {
      const isProton = i < 3;
      const particle = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), isProton ? pMat : nMat);
      particle.position.set((Math.random()-0.5)*0.3, (Math.random()-0.5)*0.3, (Math.random()-0.5)*0.3);
      nucleus.add(particle);
  }
  group.add(nucleus);
  
  // The electrons orbiting very far away
  const eMat = new THREE.MeshBasicMaterial({color: 0x00ffff});
  const electrons = new THREE.Group();
  for(let i=0; i<3; i++) {
      const e = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), eMat);
      // Position them on arbitrary elliptical orbits
      e.userData = { 
          radiusX: 4 + Math.random()*2, 
          radiusZ: 4 + Math.random()*2, 
          speed: 2 + Math.random()*2,
          offset: Math.random() * Math.PI * 2,
          tilt: (Math.random()-0.5) * Math.PI
      };
      const orbit = new THREE.Group();
      orbit.rotation.x = e.userData.tilt;
      orbit.rotation.z = e.userData.tilt;
      orbit.add(e);
      electrons.add(orbit);
  }
  group.add(electrons);
  
  // Incoming Alpha Particles (2 protons, 2 neutrons)
  const alphaGroup = new THREE.Group();
  const alphas = [];
  const alphaMat = new THREE.MeshPhysicalMaterial({color: 0xffa500, metalness: 0.1, emissive: 0x442200});
  
  for(let i=0; i<15; i++) {
      const alpha = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), alphaMat);
      // Give them random Y, Z offsets
      alpha.userData = {
          yOffset: (Math.random()-0.5)*8,
          zOffset: (Math.random()-0.5)*8,
          phase: Math.random() * Math.PI * 2,
          deflected: false
      };
      alphaGroup.add(alpha);
      alphas.push(alpha);
  }
  group.add(alphaGroup);
  
  // Glowing aura to show the positive field of the nucleus
  const field = new THREE.Mesh(
      new THREE.SphereGeometry(1.5, 32, 32),
      new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.1, wireframe: true})
  );
  group.add(field);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 5, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      
      // Orbit electrons
      electrons.children.forEach(orbit => {
          const e = orbit.children[0];
          const t = time * speed * e.userData.speed + e.userData.offset;
          e.position.set(Math.cos(t) * e.userData.radiusX, 0, Math.sin(t) * e.userData.radiusZ);
      });
      
      // Fire Alpha particles
      alphas.forEach(alpha => {
          const t = ((time * speed * 1.5) + alpha.userData.phase) % (Math.PI * 2);
          // from x=-10 to x=10
          let xPos = -10 + (t / (Math.PI*2)) * 20;
          let yPos = alpha.userData.yOffset;
          let zPos = alpha.userData.zOffset;
          
          // Rutherford Scattering (deflection by the dense positive nucleus)
          // If the alpha particle gets very close to the center (0,0,0), it gets violently deflected
          const distToCenter = Math.sqrt(yPos*yPos + zPos*zPos);
          if (xPos > -1.0 && xPos < 3.0 && distToCenter < 1.0) {
              // Deflect!
              const deflectionAngle = (1.0 - distToCenter) * Math.PI / 2; // sharper angle if closer
              // Modify Y and Z to shoot outward
              yPos += Math.sin(deflectionAngle) * (xPos+1) * Math.sign(yPos);
              zPos += Math.sin(deflectionAngle) * (xPos+1) * Math.sign(zPos);
              xPos = -1.0 + (xPos+1) * Math.cos(deflectionAngle); // slows down forward progress
          }
          
          alpha.position.set(xPos, yPos, zPos);
      });
  };

  return {
    group: group,
    description: "Lithium Rutherford Model (Remastered). In 1911, Ernest Rutherford revolutionized our understanding of the atom! He fired heavy, positively-charged Alpha Particles (the orange dots) at a thin sheet of metal. Most of the particles passed straight through the atoms without hitting anything, proving that atoms are 99.99% empty space! However, a tiny fraction of the alpha particles hit something solid and violently bounced back! This proved that the positive charge and mass of an atom is not spread out, but concentrated in an unimaginably tiny, dense core in the center—the Nucleus! In this model, watch the alpha particles deflect as they get too close to the Lithium nucleus.",
    parts: [
      { name: "Center Cluster", material: "The Nucleus", function: "Tiny, incredibly dense, and positively charged." },
      { name: "Cyan Spheres", material: "Electrons", function: "Orbiting at massive distances, making the atom mostly empty space." },
      { name: "Orange Dots", material: "Alpha Particles", function: "Deflected by the strong positive charge of the nucleus." }
    ],
    quizQuestions: [
      { question: "What did Rutherford's experiment prove about the structure of the atom?", options: ["That atoms are solid blocks", "That almost all of an atom's mass and positive charge is concentrated in a tiny nucleus, while the rest is empty space.", "That electrons are inside the nucleus", "That atoms are flat"], correct: 1, explanation: "Because most alpha particles flew straight through without hitting anything, it proved that the 'solid' matter around us is actually almost entirely empty space!" }
    ]
  };
}