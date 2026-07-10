export function createSpiderSpinneret(THREE) {
  const group = new THREE.Group();

  // 1. Spider Abdomen (Cross section)
  const abdomenGeo = new THREE.SphereGeometry(3, 32, 16, 0, Math.PI); // Half sphere
  const abdomenMat = new THREE.MeshStandardMaterial({ color: 0x4a4a4a, roughness: 0.9, side: THREE.DoubleSide });
  const abdomen = new THREE.Mesh(abdomenGeo, abdomenMat);
  abdomen.rotation.x = Math.PI / 2;
  group.add(abdomen);
  abdomen.userData = { id: 'abdomen', name: 'Spider Abdomen', description: 'Houses the massive silk glands which produce liquid silk proteins.' };

  // 2. Silk Glands (Liquid state)
  const glandMat = new THREE.MeshStandardMaterial({ color: 0xffffaa, transparent: true, opacity: 0.8 });
  
  // Ampullate gland (Dragline silk - strongest)
  const ampullate = new THREE.Mesh(new THREE.CapsuleGeometry(0.5, 1.5, 16, 16), glandMat);
  ampullate.position.set(-1, 1, 0);
  ampullate.rotation.z = Math.PI / 4;
  group.add(ampullate);
  ampullate.userData = { id: 'ampullate', name: 'Major Ampullate Gland', description: 'Produces dragline silk. Used for the web frame and safety drops. Stronger than steel by weight.' };

  // Flagelliform gland (Capture silk - stretchy/sticky)
  const flagelliform = new THREE.Mesh(new THREE.SphereGeometry(0.6), new THREE.MeshStandardMaterial({ color: 0xccffcc, transparent: true, opacity: 0.8 }));
  flagelliform.position.set(1, 1.5, 0);
  group.add(flagelliform);
  flagelliform.userData = { id: 'flagelliform', name: 'Flagelliform Gland', description: 'Produces highly elastic capture spiral silk. Can stretch over 200% without breaking.' };

  // 3. Ducts & Valves
  const ductCurve1 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.5, 0.5, 0),
    new THREE.Vector3(0, -1, 0),
    new THREE.Vector3(0.5, -2.5, 0)
  ]);
  const duct1 = new THREE.Mesh(new THREE.TubeGeometry(ductCurve1, 16, 0.1, 8, false), new THREE.MeshStandardMaterial({ color: 0xaa2222 }));
  group.add(duct1);
  duct1.userData = { id: 'duct', name: 'Spinning Duct', description: 'As liquid silk travels down this narrowing tube, water is removed and physical shear forces align the protein molecules into a solid crystal structure.' };

  // 4. Spinnerets (Outside body)
  const spigotGeo = new THREE.ConeGeometry(0.2, 0.6, 16);
  const spigotMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
  
  const spinneretL = new THREE.Mesh(spigotGeo, spigotMat);
  spinneretL.position.set(-0.2, -3.2, 0);
  spinneretL.rotation.z = Math.PI;
  group.add(spinneretL);

  const spinneretR = new THREE.Mesh(spigotGeo, spigotMat);
  spinneretR.position.set(0.6, -3.2, 0);
  spinneretR.rotation.z = Math.PI;
  group.add(spinneretR);
  spinneretR.userData = { id: 'spigot', name: 'Spigots / Spinnerets', description: 'Microscopic nozzles on the outside of the spider. The spider physically pulls the solidifying thread out with its hind legs or body weight.' };

  // 5. Emerging Silk Thread (Microscopic view transitioning to web)
  const threadGeo = new THREE.CylinderGeometry(0.02, 0.05, 4);
  const threadMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const thread = new THREE.Mesh(threadGeo, threadMat);
  thread.position.set(0.6, -5, 0);
  group.add(thread);

  // Sticky droplets on thread
  const dropGeo = new THREE.SphereGeometry(0.08);
  const dropMat = new THREE.MeshBasicMaterial({ color: 0xaaffaa, transparent: true, opacity: 0.6 });
  const drops = new THREE.Group();
  thread.add(drops);
  for(let y=-2; y<=2; y+=0.5) {
    const d = new THREE.Mesh(dropGeo, dropMat);
    d.position.y = y;
    drops.add(d);
  }

  // 6. Protein alignment visualization (Inside the duct)
  const proteinGroup = new THREE.Group();
  group.add(proteinGroup);
  const pGeo = new THREE.BoxGeometry(0.1, 0.1, 0.1);
  const pMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  
  const proteins = [];
  for(let i=0; i<20; i++) {
    const p = new THREE.Mesh(pGeo, pMat);
    proteinGroup.add(p);
    proteins.push({ mesh: p, progress: Math.random() });
  }

  group.userData.animate = function(delta) {
    const t = Date.now() * 0.001;

    // Pulse glands
    ampullate.scale.setScalar(1 + Math.sin(t*2)*0.05);
    flagelliform.scale.setScalar(1 + Math.cos(t*2)*0.05);

    // Thread coming out
    thread.position.y -= 0.02;
    if (thread.position.y < -7) thread.position.y = -5;

    // Protein alignment flowing through duct
    proteins.forEach(p => {
      p.progress += 0.01;
      if (p.progress > 1) p.progress = 0;

      ductCurve1.getPointAt(p.progress, p.mesh.position);
      
      // As they go down, they align
      if (p.progress < 0.5) {
        // Disorganized liquid in gland
        p.mesh.rotation.x = Math.random() * Math.PI;
        p.mesh.rotation.y = Math.random() * Math.PI;
        p.mesh.scale.set(1, 1, 1);
      } else {
        // Aligned crystal structure in duct
        p.mesh.rotation.set(0, 0, 0);
        // stretch into a fibril
        p.mesh.scale.set(0.5, 3, 0.5);
      }
    });

  };

  group.userData.quiz = [
    { question: "How does liquid spider silk turn into a solid thread?", options: ["It freezes on contact with air", "Physical tension (pulling) and an acid bath inside the duct align the protein molecules into a solid crystal lattice", "It dries out like glue"], answer: 1 },
    { question: "How strong is Spider Dragline Silk?", options: ["Stronger than steel by weight, and much more flexible", "About as strong as cotton thread", "Weaker than human hair"], answer: 0 }
  ];

  return group;
}
