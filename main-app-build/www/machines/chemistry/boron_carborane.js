import * as THREE from 'three';
export function createCarboraneSuperacid() {
  const group = new THREE.Group();
  
  // Carborane Superacid H(CHB11Cl11) - One of the strongest acids known
  
  const bMat = new THREE.MeshPhysicalMaterial({color: 0x00aaff, metalness: 0.5, roughness: 0.2}); // Boron
  const cMat = new THREE.MeshPhysicalMaterial({color: 0x222222, metalness: 0.8, roughness: 0.2}); // Carbon
  const clMat = new THREE.MeshPhysicalMaterial({color: 0x00ff00, metalness: 0.2, roughness: 0.5}); // Chlorine (Green)
  const hMat = new THREE.MeshPhysicalMaterial({color: 0xffffff, emissive: 0xffffff}); // The highly acidic Hydrogen
  const bondMat = new THREE.MeshBasicMaterial({color: 0x888888});
  
  // Icosahedron (1 Carbon, 11 Borons)
  const phi = (1 + Math.sqrt(5)) / 2;
  const a = 1.0;
  const b = a / phi;
  const vertices = [
      new THREE.Vector3(0, b, -a), new THREE.Vector3(b, a, 0), new THREE.Vector3(-b, a, 0),
      new THREE.Vector3(0, b, a), new THREE.Vector3(0, -b, a), new THREE.Vector3(-a, 0, b),
      new THREE.Vector3(0, -b, -a), new THREE.Vector3(a, 0, -b), new THREE.Vector3(a, 0, b),
      new THREE.Vector3(-a, 0, -b), new THREE.Vector3(b, -a, 0), new THREE.Vector3(-b, -a, 0)
  ];
  
  // The first vertex is Carbon, the rest are Boron
  const cAtom = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), cMat);
  cAtom.position.copy(vertices[0]);
  group.add(cAtom);
  
  for(let i=1; i<12; i++) {
      const bAtom = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), bMat);
      bAtom.position.copy(vertices[i]);
      group.add(bAtom);
      
      // Every Boron has a Chlorine attached pointing outwards
      const clPos = vertices[i].clone().normalize().multiplyScalar(2.5);
      const clAtom = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), clMat);
      clAtom.position.copy(clPos);
      group.add(clAtom);
      
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, vertices[i].distanceTo(clPos), 8), bondMat);
      b.position.copy(vertices[i]).add(clPos).multiplyScalar(0.5);
      b.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), clPos.clone().sub(vertices[i]).normalize());
      group.add(b);
  }
  
  // Draw the icosahedron bonds
  for(let i=0; i<vertices.length; i++) {
      for(let j=i+1; j<vertices.length; j++) {
          if (Math.abs(vertices[i].distanceTo(vertices[j]) - 2*b) < 0.1) {
              const edge = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2*b, 8), bondMat);
              edge.position.copy(new THREE.Vector3().addVectors(vertices[i], vertices[j]).multiplyScalar(0.5));
              edge.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), new THREE.Vector3().subVectors(vertices[j], vertices[i]).normalize());
              group.add(edge);
          }
      }
  }

  // The Acidic Hydrogen (Attached to the Carbon, but desperately wants to leave)
  const hPos = vertices[0].clone().normalize().multiplyScalar(2.5);
  const hGrp = new THREE.Group();
  const hAtom = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 32), hMat);
  hGrp.position.copy(hPos);
  hGrp.add(hAtom);
  
  // Glow for the acidic proton
  const glow = new THREE.Mesh(
      new THREE.SphereGeometry(0.6, 32, 32),
      new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending})
  );
  hGrp.add(glow);
  group.add(hGrp);
  
  // Weak bond to hydrogen
  const hBond = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, vertices[0].distanceTo(hPos), 8), new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.5}));
  hBond.position.copy(vertices[0]).add(hPos).multiplyScalar(0.5);
  hBond.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), hPos.clone().sub(vertices[0]).normalize());
  group.add(hBond);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5,10,5);
  group.add(light, new THREE.AmbientLight(0xffffff, 0.5));

  group.userData.animate = function(delta, time, speed) {
      group.rotation.y = time * speed * 0.2;
      group.rotation.x = Math.sin(time*speed*0.1)*0.2;
      
      // Animate the Hydrogen trying to detach (Acidic dissociation)
      const cycle = (time * speed) % 2;
      if (cycle > 1) {
          const t = cycle - 1;
          hGrp.position.copy(hPos).add(hPos.clone().normalize().multiplyScalar(t * 3)); // flies away
          glow.scale.setScalar(1 + t*2);
          glow.material.opacity = 0.5 - t*0.5;
          hBond.material.opacity = 0.5 - t*0.5;
      } else {
          hGrp.position.copy(hPos);
          glow.scale.setScalar(1 + Math.sin(time*speed*10)*0.1);
          glow.material.opacity = 0.5;
          hBond.material.opacity = 0.5;
      }
  };

  return {
    group: group,
    description: "Carborane Superacid. This is one of the strongest acids ever created by humanity—over a million times stronger than concentrated sulfuric acid! An acid is defined by how easily it can throw away a Hydrogen atom (a proton). Here, we have an ultra-stable Boron-Chlorine icosahedron with a single Carbon atom at the top. The structure is so flawlessly stable that it doesn't want the Hydrogen atom at all! It violently shoots the glowing Hydrogen atom away to interact with other molecules, making it an incredibly powerful, yet surprisingly safe, 'Superacid'.",
    parts: [
      { name: "Green/Cyan Cage", material: "Chlorinated Boron", function: "An ultra-stable geometric shield." },
      { name: "Black Sphere", material: "Carbon", function: "The anchor point." },
      { name: "Glowing White Sphere", material: "The Acidic Proton (H+)", function: "Constantly trying to detach and react with other things." }
    ],
    quizQuestions: [
      { question: "Why is the Carborane acid considered a 'Superacid'?", options: ["Because it eats through glass and metal instantly", "Because the 3D boron cage is so incredibly stable that it willingly and aggressively throws away its Hydrogen atom, which is the exact definition of a powerful acid.", "Because it tastes very sour", "Because it glows in the dark"], correct: 1, explanation: "Unlike normal acids (like battery acid) which leave behind highly reactive, corrosive fragments, the Carborane acid leaves behind an ultra-stable, perfectly harmless icosahedron cage! It donates its proton cleanly." }
    ]
  };
}