export function createTreeXylemPhloem(THREE) {
  const group = new THREE.Group();

  // Cross section of a tree trunk/stem
  const radius = 3;
  const height = 6;

  // 1. Heartwood (Dead center)
  const heartGeo = new THREE.CylinderGeometry(radius * 0.4, radius * 0.4, height, 32);
  const heartMat = new THREE.MeshStandardMaterial({ color: 0x4a2e15, roughness: 1 });
  const heartwood = new THREE.Mesh(heartGeo, heartMat);
  group.add(heartwood);
  heartwood.userData = { id: 'heartwood', name: 'Heartwood', description: 'Dead, inactive xylem cells. Provides structural strength to hold up the massive tree.' };

  // 2. Sapwood (Active Xylem)
  const xylemGeo = new THREE.CylinderGeometry(radius * 0.7, radius * 0.7, height, 32, 1, true);
  const xylemMat = new THREE.MeshStandardMaterial({ color: 0xdeb887, side: THREE.DoubleSide });
  const sapwood = new THREE.Mesh(xylemGeo, xylemMat);
  group.add(sapwood);
  sapwood.userData = { id: 'xylem', name: 'Sapwood (Xylem)', description: 'Tissue of dead hollow cells that transport Water and dissolved Minerals UP from the roots to the leaves. Driven by transpiration (evaporation).' };

  // Visualize Xylem Vessels
  const vesselGeo = new THREE.CylinderGeometry(0.05, 0.05, height, 8);
  const vesselMat = new THREE.MeshBasicMaterial({ color: 0x0000ff, transparent: true, opacity: 0.5 });
  const vesselsGroup = new THREE.Group();
  group.add(vesselsGroup);
  
  for(let i=0; i<16; i++) {
    const angle = (i / 16) * Math.PI * 2;
    const v = new THREE.Mesh(vesselGeo, vesselMat);
    v.position.set(Math.cos(angle)*(radius*0.55), 0, Math.sin(angle)*(radius*0.55));
    vesselsGroup.add(v);
  }

  // Water particles moving UP
  const waterDrops = new THREE.Group();
  group.add(waterDrops);
  const waterGeo = new THREE.SphereGeometry(0.08, 4, 4);
  const waterMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
  const drops = [];
  
  for(let i=0; i<30; i++) {
    const drop = new THREE.Mesh(waterGeo, waterMat);
    const angle = (Math.random() * Math.PI * 2);
    const r = radius * 0.55;
    const y = -height/2 + Math.random()*height;
    drop.position.set(Math.cos(angle)*r, y, Math.sin(angle)*r);
    waterDrops.add(drop);
    drops.push(drop);
  }

  // 3. Vascular Cambium (Cell division layer)
  const cambiumGeo = new THREE.CylinderGeometry(radius * 0.72, radius * 0.72, height, 32, 1, true);
  const cambiumMat = new THREE.MeshStandardMaterial({ color: 0x98fb98, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
  const cambium = new THREE.Mesh(cambiumGeo, cambiumMat);
  group.add(cambium);
  cambium.userData = { id: 'cambium', name: 'Vascular Cambium', description: 'A microscopic layer of living meristem cells. It divides to create new Xylem on the inside and new Phloem on the outside.' };

  // 4. Phloem (Inner Bark)
  const phloemGeo = new THREE.CylinderGeometry(radius * 0.85, radius * 0.85, height, 32, 1, true);
  const phloemMat = new THREE.MeshStandardMaterial({ color: 0xcd853f, side: THREE.DoubleSide });
  const phloem = new THREE.Mesh(phloemGeo, phloemMat);
  group.add(phloem);
  phloem.userData = { id: 'phloem', name: 'Inner Bark (Phloem)', description: 'Living tissue that transports Sugars (sap) DOWN from the leaves to the roots and rest of the plant. Driven by pressure gradients.' };

  // Visualize Phloem tubes (Sieve tubes)
  const sieveGeo = new THREE.CylinderGeometry(0.04, 0.04, height, 8);
  const sieveMat = new THREE.MeshBasicMaterial({ color: 0xffa500, transparent: true, opacity: 0.5 });
  const sievesGroup = new THREE.Group();
  group.add(sievesGroup);
  
  for(let i=0; i<16; i++) {
    const angle = (i / 16) * Math.PI * 2;
    const s = new THREE.Mesh(sieveGeo, sieveMat);
    s.position.set(Math.cos(angle)*(radius*0.78), 0, Math.sin(angle)*(radius*0.78));
    sievesGroup.add(s);
  }

  // Sugar particles moving DOWN
  const sugarGroup = new THREE.Group();
  group.add(sugarGroup);
  const sugarGeoBox = new THREE.BoxGeometry(0.1, 0.1, 0.1);
  const sugarMatBox = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const sugars = [];
  
  for(let i=0; i<30; i++) {
    const sug = new THREE.Mesh(sugarGeoBox, sugarMatBox);
    const angle = (Math.random() * Math.PI * 2);
    const r = radius * 0.78;
    const y = -height/2 + Math.random()*height;
    sug.position.set(Math.cos(angle)*r, y, Math.sin(angle)*r);
    sugarGroup.add(sug);
    sugars.push(sug);
  }

  // 5. Cork Cambium & Bark (Outer dead layer)
  const barkGeo = new THREE.CylinderGeometry(radius, radius, height, 32, 1, true);
  const barkMat = new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 1, side: THREE.DoubleSide });
  const bark = new THREE.Mesh(barkGeo, barkMat);
  group.add(bark);
  bark.userData = { id: 'bark', name: 'Outer Bark (Cork)', description: 'Dead tissue filled with suberin. Protects the tree from insects, disease, fire, and moisture loss.' };

  // Tree rings (Top cut surface)
  const ringGeo = new THREE.CylinderGeometry(radius, radius, 0.1, 32);
  // Custom texture mapping isn't feasible here without external assets, 
  // so we create physical rings using toruses
  const topSurface = new THREE.Group();
  topSurface.position.y = height / 2;
  group.add(topSurface);
  
  const capMesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 0.05, 32), new THREE.MeshStandardMaterial({ color: 0xdeb887 }));
  topSurface.add(capMesh);

  for(let r=0.5; r<radius-0.2; r+=0.3) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.02, 8, 32), new THREE.MeshBasicMaterial({ color: 0x8b4513 }));
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.03;
    topSurface.add(ring);
  }
  capMesh.userData = { id: 'tree_rings', name: 'Annual Growth Rings', description: 'Visible in the Xylem. Wide rings indicate wet, good growth years. Narrow rings indicate drought.' };

  group.userData.animate = function(delta) {
    // Water flows UP
    drops.forEach(d => {
      d.position.y += 0.05;
      if(d.position.y > height/2) {
        d.position.y = -height/2;
      }
    });

    // Sugar flows DOWN
    sugars.forEach(s => {
      s.position.y -= 0.03;
      s.rotation.x += 0.1;
      s.rotation.y += 0.1;
      if(s.position.y < -height/2) {
        s.position.y = height/2;
      }
    });
  };

  group.userData.quiz = [
    { question: "Which vascular tissue transports water upwards from the roots?", options: ["Phloem", "Cambium", "Xylem"], answer: 2 },
    { question: "If you carve your initials into the bark of a young tree, will the initials move higher as the tree grows?", options: ["Yes, trees grow from the bottom up", "No, trees grow vertically only from the tips (apical meristems); the trunk only grows wider in girth.", "It depends on the type of tree"], answer: 1 }
  ];

  return group;
}
