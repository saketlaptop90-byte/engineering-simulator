import * as THREE from 'three';
export function createLithiumElectronProtonInteraction() {
  const group = new THREE.Group();
  
  // Coulomb's Law - Electron-Proton Attraction (Remastered)
  
  // The positive Nucleus (Lithium = +3 Charge)
  const nucleus = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      new THREE.MeshPhysicalMaterial({color: 0xff0000, emissive: 0x440000})
  );
  group.add(nucleus);
  
  // Glowing positive aura
  const nAura = new THREE.Mesh(
      new THREE.SphereGeometry(1.2, 32, 32),
      new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending})
  );
  nucleus.add(nAura);
  
  // The negative Electron (-1 Charge)
  const electron = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 32, 32),
      new THREE.MeshPhysicalMaterial({color: 0x00ffff, emissive: 0x004444})
  );
  group.add(electron);
  
  // Electric Field Lines (Force Vectors)
  const fieldLines = new THREE.Group();
  for(let i=0; i<8; i++) {
      const curve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(0,0,0),
          new THREE.Vector3(0,0,0),
          new THREE.Vector3(0,0,0)
      );
      const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.05, 8, false);
      const line = new THREE.Mesh(tubeGeo, new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.5}));
      fieldLines.add(line);
  }
  group.add(fieldLines);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 5, 5);
  group.add(light, new THREE.AmbientLight(0x404040, 2));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.1;
      
      // Electron orbits elliptically
      const t = time * speed * 0.5;
      const x = Math.cos(t) * 5;
      const y = Math.sin(t*2) * 2;
      const z = Math.sin(t) * 5;
      electron.position.set(x, y, z);
      
      // Update field lines to stretch from nucleus to electron
      // We'll bend them slightly to show the 'pulling' tension
      const dist = electron.position.distanceTo(nucleus.position);
      
      fieldLines.children.forEach((line, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const spreadX = Math.cos(angle) * (dist * 0.3);
          const spreadY = Math.sin(angle) * (dist * 0.3);
          
          // Bezier control point curves outward to make a bundle of lines
          const ctrl = new THREE.Vector3(
              x/2 + spreadX,
              y/2 + spreadY,
              z/2
          );
          
          const curve = new THREE.QuadraticBezierCurve3(
              nucleus.position,
              ctrl,
              electron.position
          );
          line.geometry.dispose();
          line.geometry = new THREE.TubeGeometry(curve, 20, 0.03, 8, false);
          
          // Color based on distance (Coulomb's Law: Force is inversely proportional to distance squared)
          const force = 1.0 / (dist * dist);
          line.material.opacity = Math.min(1.0, force * 50);
          
          if (dist < 3) {
             line.material.color.setHex(0xffaaaa); // strong pull
          } else {
             line.material.color.setHex(0xffffff); // weak pull
          }
      });
  };

  return {
    group: group,
    description: "Electron-Proton Attraction (Remastered). What physically holds an atom together? The Electromagnetic Force! Described mathematically by Coulomb's Law, opposite charges attract. A Lithium nucleus has 3 positive protons, giving it a charge of +3. The electron has a charge of -1. In this model, the white bands represent the electric field lines connecting the two particles. Notice how the bands fade out and turn white when the electron is far away? According to Coulomb's Law, the force of attraction drops off exponentially as distance increases. But when the electron swoops in close, the bands turn bright red and become thick, indicating a massive spike in attractive force!",
    parts: [
      { name: "Red Sphere", material: "Nucleus (+3 Charge)", function: "Generates a massive positive electric field." },
      { name: "Cyan Sphere", material: "Electron (-1 Charge)", function: "Pulled inward by the nucleus." },
      { name: "White/Red Bands", material: "Electric Field Lines", function: "Visualizes the strength of Coulombic attraction." }
    ],
    quizQuestions: [
      { question: "According to Coulomb's Law, what happens to the attractive force as the electron gets closer to the nucleus?", options: ["It decreases", "It increases exponentially.", "It stays the same", "It reverses"], correct: 1, explanation: "Force is inversely proportional to the SQUARE of the distance. Cutting the distance in half makes the force 4 times stronger!" }
    ]
  };
}