import * as THREE from 'three';
export function createMgB2() {
  const group = new THREE.Group();
  
  // Magnesium Diboride (MgB2) - High-Temp Superconductor
  
  const bMat = new THREE.MeshPhysicalMaterial({color: 0x00aaff, metalness: 0.5, roughness: 0.2, clearcoat: 1.0}); // Boron
  const mgMat = new THREE.MeshPhysicalMaterial({color: 0xffaa00, metalness: 0.9, roughness: 0.1, clearcoat: 1.0}); // Magnesium (Gold/Orange)
  const bondMat = new THREE.MeshBasicMaterial({color: 0xffffff});
  
  // Create a honeycomb boron layer (like graphene)
  const createBoronLayer = (yOffset) => {
      const layer = new THREE.Group();
      const atoms = [];
      const hexRadius = 1.0;
      
      // Build a small grid of hexagons
      for(let q=-1; q<=1; q++) {
          for(let r=-1; r<=1; r++) {
              if (Math.abs(q+r) > 1) continue;
              
              // Hexagon center
              const cx = 1.5 * hexRadius * q;
              const cz = Math.sqrt(3) * hexRadius * (r + q/2);
              
              // 6 points of the hexagon
              for(let i=0; i<6; i++) {
                  const angle = Math.PI / 3 * i;
                  const x = cx + Math.cos(angle)*hexRadius*0.577; // 0.577 = 1/sqrt(3) roughly, scaling side length
                  const z = cz + Math.sin(angle)*hexRadius*0.577;
                  
                  // Avoid duplicates
                  let duplicate = false;
                  atoms.forEach(a => { if(a.pos.distanceTo(new THREE.Vector3(x,0,z)) < 0.1) duplicate = true; });
                  if(duplicate) continue;
                  
                  const pos = new THREE.Vector3(x, yOffset, z);
                  atoms.push({pos});
                  
                  const b = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), bMat);
                  b.position.copy(pos);
                  layer.add(b);
              }
          }
      }
      
      // Draw bonds within layer
      for(let i=0; i<atoms.length; i++) {
          for(let j=i+1; j<atoms.length; j++) {
              const dist = atoms[i].pos.distanceTo(atoms[j].pos);
              if (dist < 0.7) { // near neighbors
                  const bond = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, dist, 8), bondMat);
                  bond.position.copy(atoms[i].pos).add(atoms[j].pos).multiplyScalar(0.5);
                  bond.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), atoms[j].pos.clone().sub(atoms[i].pos).normalize());
                  layer.add(bond);
              }
          }
      }
      return layer;
  };
  
  group.add(createBoronLayer(1.5));
  group.add(createBoronLayer(-1.5));
  
  // Add Magnesium atoms interspersed between the boron layers
  const mgLayer = new THREE.Group();
  for(let q=-1; q<=1; q++) {
      for(let r=-1; r<=1; r++) {
          if (Math.abs(q+r) > 1) continue;
          const cx = 1.5 * 1.0 * q;
          const cz = Math.sqrt(3) * 1.0 * (r + q/2);
          
          const mg = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), mgMat);
          mg.position.set(cx, 0, cz);
          mgLayer.add(mg);
      }
  }
  group.add(mgLayer);

  // Superconducting electricity effect (Cooper pairs!)
  const lightningMat = new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, blending: THREE.AdditiveBlending});
  const sparks = [];
  for(let i=0; i<10; i++) {
      const s = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3, 8), lightningMat);
      s.rotation.z = Math.PI/2;
      s.position.y = 1.5; // flowing through top boron layer
      group.add(s);
      sparks.push(s);
  }

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5,10,5);
  group.add(light, new THREE.AmbientLight(0xffffff, 0.5));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.2;
      group.rotation.x = Math.sin(time*speed*0.1)*0.2;
      
      // Animate superconducting electricity (0 resistance!)
      sparks.forEach((s, idx) => {
          s.position.x = (Math.sin(time*speed*3 + idx) * 3);
          s.position.z = (Math.cos(time*speed*2 + idx) * 3);
          s.material.opacity = 0.5 + Math.sin(time*speed*10 + idx)*0.5;
          // Sometimes jump to bottom layer
          s.position.y = Math.sin(time*speed*0.5 + idx) > 0 ? 1.5 : -1.5;
      });
  };

  return {
    group: group,
    description: "Magnesium Diboride (MgB2). Discovered to be a superconductor in 2001, this simple, cheap material shocked the physics world! Look at its structure: it consists of perfectly flat honeycomb sheets of Boron (exactly like Graphene!), separated by layers of Magnesium atoms (the gold spheres). At -234°C, this material loses all electrical resistance. Electrons pair up (Cooper Pairs) and surf effortlessly through the flat Boron planes without ever hitting anything. It is widely used in next-generation MRI machines!",
    parts: [
      { name: "Cyan Honeycomb", material: "Boron Planes", function: "A flat, graphene-like highway where electrons surf with zero resistance." },
      { name: "Gold Spheres", material: "Magnesium", function: "Spacers that hold the boron highways apart and donate electrons to them." },
      { name: "Cyan Sparks", material: "Superconductivity", function: "Electricity flowing perfectly with absolutely zero heat or energy loss." }
    ],
    quizQuestions: [
      { question: "Why was Magnesium Diboride (MgB2) such a shocking discovery in 2001?", options: ["Because it is poisonous", "Because it is a conventional superconductor that works at a remarkably 'high' temperature (-234°C), breaking what physicists thought was the absolute limit for this type of material!", "Because it generates gravity", "Because it is invisible"], correct: 1, explanation: "Before 2001, scientists thought 'conventional' superconductors could never work above -243°C. MgB2 broke the theoretical limit and is incredibly cheap to manufacture!" }
    ]
  };
}