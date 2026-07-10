export function createPaleoDigSite(THREE) {
  const group = new THREE.Group();

  // 1. Terrain Grid (Excavation square)
  const groundGeo = new THREE.BoxGeometry(10, 2, 10);
  const groundMat = new THREE.MeshStandardMaterial({ color: 0xaa8855, roughness: 1 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.position.y = -1;
  group.add(ground);

  // String Grid (Mapping the site)
  const gridGroup = new THREE.Group();
  group.add(gridGroup);
  const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  
  for(let i=-5; i<=5; i+=2) {
    const vGeo = new THREE.CylinderGeometry(0.02, 0.02, 10);
    const vLine = new THREE.Mesh(vGeo, lineMat);
    vLine.rotation.x = Math.PI / 2;
    vLine.position.set(i, 0.1, 0);
    gridGroup.add(vLine);
    
    const hGeo = new THREE.CylinderGeometry(0.02, 0.02, 10);
    const hLine = new THREE.Mesh(hGeo, lineMat);
    hLine.rotation.z = Math.PI / 2;
    hLine.position.set(0, 0.1, i);
    gridGroup.add(hLine);
  }
  gridGroup.children[0].userData = { id: 'grid', name: 'Reference Grid', description: 'Dig sites are meticulously mapped on a grid so the exact context and orientation of every bone is recorded before removal.' };

  // 2. Exposed Fossils (Triceratops skull/frill roughly)
  const boneMat = new THREE.MeshStandardMaterial({ color: 0xddccaa, roughness: 0.9 });
  
  const frill = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.2, 16, 1, false, 0, Math.PI), boneMat);
  frill.position.set(0, 0.1, -1);
  frill.rotation.x = -Math.PI / 6;
  group.add(frill);

  const hornL = new THREE.Mesh(new THREE.ConeGeometry(0.2, 1.5, 8), boneMat);
  hornL.position.set(-0.8, 0.5, 0.5);
  hornL.rotation.x = Math.PI / 4;
  hornL.rotation.z = Math.PI / 8;
  group.add(hornL);

  const hornR = new THREE.Mesh(new THREE.ConeGeometry(0.2, 1.5, 8), boneMat);
  hornR.position.set(0.8, 0.5, 0.5);
  hornR.rotation.x = Math.PI / 4;
  hornR.rotation.z = -Math.PI / 8;
  group.add(hornR);

  frill.userData = { id: 'fossil', name: 'Exposed Fossil (Triceratops)', description: 'Paleontologists do not dig aimlessly; they look for bone weathering out of the surface first.' };

  // 3. Field Tools

  // Rock Hammer
  const hammer = new THREE.Group();
  const hHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1), new THREE.MeshStandardMaterial({ color: 0x552200 }));
  const hHead = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.1, 0.1), new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8 }));
  hHead.position.y = 0.4;
  hammer.add(hHandle, hHead);
  hammer.position.set(3, 0.05, 2);
  hammer.rotation.x = Math.PI / 2;
  group.add(hammer);
  hammer.userData = { id: 'hammer', name: 'Rock Hammer & Chisel', description: 'Used to break away hard matrix rock far away from the delicate bone.' };

  // Dental Pick & Brush
  const brush = new THREE.Group();
  const bHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.8), new THREE.MeshStandardMaterial({ color: 0xaa0000 }));
  const bBristles = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 0.05), new THREE.MeshStandardMaterial({ color: 0xddddaa }));
  bBristles.position.y = 0.45;
  brush.add(bHandle, bBristles);
  brush.position.set(-2, 0.05, 3);
  brush.rotation.x = Math.PI / 2;
  brush.rotation.z = Math.PI / 4;
  group.add(brush);
  brush.userData = { id: 'brush', name: 'Dental Picks & Brushes', description: 'Once close to the bone, tools become very small. Brushes sweep away loose sediment to prevent scratching the fossil.' };

  // Field Notes / Camera
  const journal = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 1.2), new THREE.MeshStandardMaterial({ color: 0xeeeeee }));
  journal.position.set(-4, 0.05, -3);
  group.add(journal);
  journal.userData = { id: 'notes', name: 'Field Journal', description: 'Data is just as important as the bone. Context reveals how the animal died and its environment.' };

  // 4. Plaster Jacket (Half built)
  const jacketGeo = new THREE.SphereGeometry(1.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const jacketMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1 });
  const jacket = new THREE.Mesh(jacketGeo, jacketMat);
  jacket.position.set(2, 0.1, -2);
  jacket.scale.set(1, 0.5, 1.5);
  group.add(jacket);
  
  // A bone poking out of the plaster
  const femur = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.1, 1), boneMat);
  femur.rotation.x = Math.PI / 2;
  femur.position.set(0, 0, 1);
  jacket.add(femur);

  jacket.userData = { id: 'plaster_jacket', name: 'Plaster Jacket', description: 'Fossils are too fragile to move. They are wrapped in burlap and Plaster of Paris to form a hard shell for transport back to the lab.' };

  // 5. Dust animation
  const dustGroup = new THREE.Group();
  group.add(dustGroup);
  const dustGeo = new THREE.PlaneGeometry(0.2, 0.2);
  const dustMat = new THREE.MeshBasicMaterial({ color: 0xaa8855, transparent: true, opacity: 0.5 });
  const dustMotes = [];
  
  for(let i=0; i<20; i++) {
    const d = new THREE.Mesh(dustGeo, dustMat);
    d.position.set(-2, 0.2, 3); // Start near brush
    dustGroup.add(d);
    dustMotes.push({ mesh: d, vx: (Math.random()-0.5)*0.05, vy: Math.random()*0.05, vz: Math.random()*0.05 });
  }

  group.userData.animate = function(delta) {
    const t = Date.now() * 0.005;
    
    // Simulate someone brushing
    brush.rotation.y = Math.sin(t) * 0.2;
    brush.position.x = -2 + Math.sin(t)*0.1;
    
    // Dust kicking up
    dustMotes.forEach(d => {
      d.mesh.position.x += d.vx;
      d.mesh.position.y += d.vy;
      d.mesh.position.z += d.vz;
      d.mesh.material.opacity -= 0.01;
      
      if(d.mesh.material.opacity <= 0) {
        d.mesh.position.set(brush.position.x, 0.2, brush.position.z);
        d.mesh.material.opacity = 0.5;
      }
    });
  };

  group.userData.quiz = [
    { question: "Why do paleontologists wrap large fossils in plaster and burlap before moving them?", options: ["To hide them from thieves", "Fossils are extremely fragile rock and would shatter under their own weight during transport", "To make them look like mummies"], answer: 1 },
    { question: "Why is a grid placed over the excavation site?", options: ["To play chess on break", "To map exactly where each bone was found (its context and orientation)", "To keep the dirt organized"], answer: 1 }
  ];

  return group;
}
