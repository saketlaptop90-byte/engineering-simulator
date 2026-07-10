export function createEcologicalSuccession(THREE) {
  const group = new THREE.Group();

  // We show 4 stages in wedges of a circle
  const radius = 6;

  // 1. Base terrain (circle split into 4)
  const createWedge = (color, angleStart) => {
    const geo = new THREE.CylinderGeometry(radius, radius, 1, 32, 1, false, angleStart, Math.PI/2);
    const mat = new THREE.MeshStandardMaterial({ color: color });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = -0.5;
    return mesh;
  };

  // Stage 1: Bare Rock (Primary Succession start or severe secondary)
  const s1Wedge = createWedge(0x888888, 0);
  group.add(s1Wedge);
  
  // Pioneer species (Lichens and Moss)
  const lichenMat = new THREE.MeshBasicMaterial({ color: 0x9acd32 });
  for(let i=0; i<15; i++) {
    const lichen = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), lichenMat);
    const a = (Math.random() * Math.PI/2);
    const r = Math.random() * radius;
    lichen.position.set(Math.cos(a)*r, 0.01, Math.sin(a)*r);
    lichen.rotation.x = -Math.PI/2;
    group.add(lichen);
  }
  s1Wedge.userData = { id: 'stage1', name: 'Stage 1: Bare Rock & Pioneer Species', description: 'Lichens and mosses secrete acids to break down rock into soil.' };

  // Stage 2: Grasses & Weeds (Thin soil)
  const s2Wedge = createWedge(0x6b8e23, Math.PI/2);
  group.add(s2Wedge);
  
  const grassMat = new THREE.MeshStandardMaterial({ color: 0x32cd32 });
  for(let i=0; i<30; i++) {
    const grass = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.5), grassMat);
    const a = Math.PI/2 + (Math.random() * Math.PI/2);
    const r = Math.random() * radius;
    grass.position.set(Math.cos(a)*r, 0.25, Math.sin(a)*r);
    group.add(grass);
  }
  s2Wedge.userData = { id: 'stage2', name: 'Stage 2: Grasses and Annuals', description: 'As soil deepens from dead pioneer species, grasses and weeds take root rapidly.' };

  // Stage 3: Shrubs & Young Pines (Intermediate species)
  const s3Wedge = createWedge(0x556b2f, Math.PI);
  group.add(s3Wedge);
  
  const shrubMat = new THREE.MeshStandardMaterial({ color: 0x228b22 });
  for(let i=0; i<10; i++) {
    const shrub = new THREE.Mesh(new THREE.DodecahedronGeometry(0.5), shrubMat);
    const a = Math.PI + (Math.random() * Math.PI/2);
    const r = 1 + Math.random() * (radius-1);
    shrub.position.set(Math.cos(a)*r, 0.5, Math.sin(a)*r);
    group.add(shrub);
  }
  // Small pines
  for(let i=0; i<5; i++) {
    const pine = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.5), new THREE.MeshStandardMaterial({ color: 0x006400 }));
    const a = Math.PI + (Math.random() * Math.PI/2);
    const r = 1 + Math.random() * (radius-1);
    pine.position.set(Math.cos(a)*r, 0.75, Math.sin(a)*r);
    group.add(pine);
  }
  s3Wedge.userData = { id: 'stage3', name: 'Stage 3: Shrubs & Softwoods', description: 'Shrubs and fast-growing trees (like pines) shade out the grasses.' };

  // Stage 4: Climax Community (Mature hardwoods)
  const s4Wedge = createWedge(0x3b5323, 3*Math.PI/2);
  group.add(s4Wedge);
  
  const createTree = (x, z) => {
    const t = new THREE.Group();
    t.position.set(x, 0, z);
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 2), new THREE.MeshStandardMaterial({ color: 0x4a2e15 }));
    trunk.position.y = 1;
    t.add(trunk);
    const leaves = new THREE.Mesh(new THREE.SphereGeometry(1.2), new THREE.MeshStandardMaterial({ color: 0x006400 }));
    leaves.position.y = 2.5;
    t.add(leaves);
    return t;
  };

  for(let i=0; i<8; i++) {
    const a = 3*Math.PI/2 + (Math.random() * Math.PI/2);
    const r = 1.5 + Math.random() * (radius-2);
    group.add(createTree(Math.cos(a)*r, Math.sin(a)*r));
  }
  s4Wedge.userData = { id: 'stage4', name: 'Stage 4: Climax Community', description: 'A stable, mature forest of shade-tolerant hardwood trees (Oak, Hickory). Will remain until the next major disturbance.' };

  // Center indicator (Time dial)
  const dialGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.2, 16);
  const dialMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
  const dial = new THREE.Mesh(dialGeo, dialMat);
  group.add(dial);

  const pointerGeo = new THREE.BoxGeometry(2, 0.1, 0.1);
  const pointerMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const pointer = new THREE.Mesh(pointerGeo, pointerMat);
  pointer.position.set(1, 0.6, 0); // Offset so origin is at center
  dial.add(pointer);
  dial.userData = { id: 'time', name: 'Time (Hundreds of Years)', description: 'Succession is the predictable process of change in species composition over time.' };

  group.userData.animate = function(delta) {
    // Slowly rotate pointer to show progression of time
    const t = Date.now() * 0.0005;
    dial.rotation.y = -t; // Negative to rotate clockwise (0 to Pi/2 to Pi etc)
  };

  group.userData.quiz = [
    { question: "What is a 'Pioneer Species'?", options: ["The first species to populate an area during succession", "The largest tree in the forest", "An invasive alien species"], answer: 0 },
    { question: "What is the difference between Primary and Secondary succession?", options: ["Primary is faster", "Primary starts from bare rock (no soil); Secondary starts where soil already exists (e.g., after a fire)", "Secondary only happens in the ocean"], answer: 1 }
  ];

  return group;
}
