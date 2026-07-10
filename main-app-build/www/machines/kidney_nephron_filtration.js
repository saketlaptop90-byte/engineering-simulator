export function createKidneyNephron(THREE) {
  const group = new THREE.Group();

  // Kidney outer view (Macro)
  const kidneyGroup = new THREE.Group();
  kidneyGroup.position.set(-4, 0, 0);
  group.add(kidneyGroup);

  const kidneyGeo = new THREE.SphereGeometry(2, 32, 32);
  // Deform into a bean shape
  const positions = kidneyGeo.attributes.position;
  for(let i=0; i<positions.count; i++) {
    let x = positions.getX(i);
    let y = positions.getY(i);
    let z = positions.getZ(i);
    if (x > 0) {
      x -= Math.sin(y*0.8) * 0.8; // Dent the hilum
    }
    positions.setXYZ(i, x, y, z);
  }
  kidneyGeo.computeVertexNormals();
  
  const kidneyMat = new THREE.MeshStandardMaterial({ color: 0x8b3a3a, roughness: 0.7 });
  const kidney = new THREE.Mesh(kidneyGeo, kidneyMat);
  kidney.scale.z = 0.5;
  kidneyGroup.add(kidney);
  kidney.userData = { id: 'kidney', name: 'Human Kidney', description: 'Filters 200 liters of blood per day to produce about 1-2 liters of urine.' };

  // Renal Artery (Red) & Vein (Blue) & Ureter (Yellow)
  const tubeGeo = new THREE.CylinderGeometry(0.2, 0.2, 2);
  
  const rArtery = new THREE.Mesh(tubeGeo, new THREE.MeshStandardMaterial({ color: 0xcc1111 }));
  rArtery.position.set(1.5, 0.5, 0);
  rArtery.rotation.z = Math.PI/2;
  kidneyGroup.add(rArtery);
  
  const rVein = new THREE.Mesh(tubeGeo, new THREE.MeshStandardMaterial({ color: 0x1111cc }));
  rVein.position.set(1.5, 0, 0);
  rVein.rotation.z = Math.PI/2;
  kidneyGroup.add(rVein);

  const ureter = new THREE.Mesh(tubeGeo, new THREE.MeshStandardMaterial({ color: 0xdddd22 }));
  ureter.position.set(1.5, -1.5, 0);
  kidneyGroup.add(ureter);
  ureter.userData = { id: 'ureter', name: 'Ureter', description: 'Carries waste (urine) from the kidney down to the bladder.' };

  // Link line
  const link = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-3.5, 1, 0.5), new THREE.Vector3(0, 3, 0)]),
    new THREE.LineBasicMaterial({ color: 0xffffff })
  );
  group.add(link);

  // Microscopic Nephron view
  const nephronGroup = new THREE.Group();
  nephronGroup.position.set(3, 0, 0);
  group.add(nephronGroup);

  const nephronMat = new THREE.MeshStandardMaterial({ color: 0xeeddcc, transparent: true, opacity: 0.8 });
  const bloodMat = new THREE.MeshStandardMaterial({ color: 0xcc1111 });

  // 1. Bowman's Capsule & Glomerulus
  const capsule = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 1.5), nephronMat);
  capsule.position.set(-2, 3, 0);
  capsule.rotation.z = -Math.PI / 2;
  nephronGroup.add(capsule);
  
  // Glomerulus (knot of capillaries)
  const glomGroup = new THREE.Group();
  capsule.add(glomGroup);
  for(let i=0; i<10; i++) {
    const knot = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.1, 8, 16), bloodMat);
    knot.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
    glomGroup.add(knot);
  }
  capsule.userData = { id: 'glomerulus', name: 'Glomerulus & Bowman\'s Capsule', description: 'High blood pressure forces water, salts, glucose, and urea out of the blood and into the capsule (Filtration).' };

  // 2. Proximal Convoluted Tubule
  const pctCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1, 3, 0),
    new THREE.Vector3(0, 3.5, 1),
    new THREE.Vector3(0.5, 2.5, -1),
    new THREE.Vector3(1, 2, 0)
  ]);
  const pct = new THREE.Mesh(new THREE.TubeGeometry(pctCurve, 32, 0.3, 16, false), nephronMat);
  nephronGroup.add(pct);
  pct.userData = { id: 'pct', name: 'Proximal Convoluted Tubule', description: 'Reabsorbs 100% of glucose and 65% of water/salts back into the blood.' };

  // 3. Loop of Henle (Dips down)
  const loopCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(1, 2, 0),
    new THREE.Vector3(1.5, -2, 0), // dip down
    new THREE.Vector3(2.5, -2, 0),
    new THREE.Vector3(3, 2, 0)   // come back up
  ]);
  const loop = new THREE.Mesh(new THREE.TubeGeometry(loopCurve, 64, 0.15, 16, false), nephronMat);
  nephronGroup.add(loop);
  loop.userData = { id: 'loop_of_henle', name: 'Loop of Henle', description: 'Creates a concentration gradient in the medulla to reabsorb even more water, concentrating the urine.' };

  // 4. Distal Convoluted Tubule & Collecting Duct
  const dctCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(3, 2, 0),
    new THREE.Vector3(3.5, 3, 1),
    new THREE.Vector3(4, 2, 0)
  ]);
  const dct = new THREE.Mesh(new THREE.TubeGeometry(dctCurve, 32, 0.3, 16, false), nephronMat);
  nephronGroup.add(dct);
  
  const duct = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 6), nephronMat);
  duct.position.set(4.5, -1, 0);
  nephronGroup.add(duct);
  duct.userData = { id: 'collecting_duct', name: 'Collecting Duct', description: 'Gathers urine from many nephrons. ADH hormone controls how much final water is reabsorbed here.' };

  // Particles: Toxins (Yellow) and Nutrients (Green)
  const particles = new THREE.Group();
  nephronGroup.add(particles);
  
  const pList = [];
  const pGeo = new THREE.SphereGeometry(0.08);
  const wasteMat = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // Urea
  const goodMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Glucose/Water

  for(let i=0; i<30; i++) {
    const isWaste = Math.random() > 0.5;
    const mesh = new THREE.Mesh(pGeo, isWaste ? wasteMat : goodMat);
    particles.add(mesh);
    pList.push({ mesh: mesh, isWaste: isWaste, progress: Math.random() });
  }

  // Combine curves for animation
  const fullPath = new THREE.CurvePath();
  fullPath.add(pctCurve);
  fullPath.add(loopCurve);
  fullPath.add(dctCurve);
  // Add duct straight line
  fullPath.add(new THREE.LineCurve3(new THREE.Vector3(4, 2, 0), new THREE.Vector3(4.5, -4, 0)));

  group.userData.animate = function(delta) {
    pList.forEach(p => {
      p.progress += 0.002;
      
      // If it's good (nutrient), it gets reabsorbed into blood during PCT (progress 0 to 0.25)
      if (!p.isWaste && p.progress > 0.25) {
        // Shoot off to the side (reabsorption)
        p.mesh.position.y += 0.1;
        p.mesh.position.z += 0.1;
        p.mesh.material.opacity -= 0.05;
        if(p.mesh.position.y > 5) {
          p.progress = 0;
          p.mesh.material.opacity = 1;
        }
      } else {
        // Waste continues all the way down
        if (p.progress > 1) {
          p.progress = 0;
        }
        
        // Move along curve
        if(p.progress <= 1.0) {
          fullPath.getPointAt(p.progress, p.mesh.position);
          // Add jitter inside tube
          p.mesh.position.x += (Math.random()-0.5)*0.1;
          p.mesh.position.y += (Math.random()-0.5)*0.1;
          p.mesh.position.z += (Math.random()-0.5)*0.1;
        }
      }
    });

    glomGroup.rotation.y += 0.05;
    kidney.rotation.y = Math.sin(Date.now()*0.001)*0.2;
  };

  group.userData.quiz = [
    { question: "What is the primary filtering unit of the kidney called?", options: ["Alveolus", "Nephron", "Villus"], answer: 1 },
    { question: "Why is there sugar (glucose) in the blood, but normally NO sugar in the urine?", options: ["Because the kidneys burn it for energy", "Because 100% of the glucose filtered is reabsorbed back into the blood by the Proximal Convoluted Tubule", "Because sugar molecules are too large to pass through the filter"], answer: 1 }
  ];

  return group;
}
