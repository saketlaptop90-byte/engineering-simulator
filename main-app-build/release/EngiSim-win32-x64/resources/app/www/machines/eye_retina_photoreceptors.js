export function createEyeRetina(THREE) {
  const group = new THREE.Group();

  // 1. Light entering (Photons)
  const lightGroup = new THREE.Group();
  group.add(lightGroup);
  
  const photonGeo = new THREE.SphereGeometry(0.1);
  const pList = [];
  const colors = [0xff0000, 0x00ff00, 0x0000ff]; // RGB light
  
  for(let i=0; i<30; i++) {
    const mat = new THREE.MeshBasicMaterial({ color: colors[i%3] });
    const p = new THREE.Mesh(photonGeo, mat);
    p.position.set(5, (Math.random()-0.5)*4, (Math.random()-0.5)*4);
    lightGroup.add(p);
    pList.push({ mesh: p, speed: 0.1, cIdx: i%3 });
  }

  // 2. The Retina Layers (Cross section, light comes from the RIGHT)
  // Interestingly, light has to pass through the nerve cells FIRST before hitting the photoreceptors at the back.

  // Layer 1: Ganglion Cells (Nerve fibers forming optic nerve)
  const ganglionGroup = new THREE.Group();
  ganglionGroup.position.x = 2;
  group.add(ganglionGroup);
  
  const cellMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.5 });
  const axMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  
  for(let y=-2; y<=2; y+=1) {
    const c = new THREE.Mesh(new THREE.SphereGeometry(0.3), cellMat);
    c.position.y = y;
    // Axon going up/down to form optic nerve
    const ax = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2), axMat);
    ax.position.set(0, y>0?-1:1, 0);
    c.add(ax);
    ganglionGroup.add(c);
  }
  ganglionGroup.children[0].userData = { id: 'ganglion', name: 'Ganglion Cells', description: 'The outermost layer of the retina. Their axons bundle together to form the optic nerve, sending signals to the brain.' };

  // Layer 2: Bipolar Cells (Interneurons)
  const bipolarGroup = new THREE.Group();
  bipolarGroup.position.x = 0;
  group.add(bipolarGroup);
  
  const biMat = new THREE.MeshStandardMaterial({ color: 0xff88ff });
  for(let y=-2; y<=2; y+=0.5) {
    const c = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.6), biMat);
    c.position.y = y;
    c.rotation.z = Math.PI/2;
    bipolarGroup.add(c);
  }
  bipolarGroup.children[0].userData = { id: 'bipolar', name: 'Bipolar Cells', description: 'Act as a bridge, transferring signals from the photoreceptors to the ganglion cells.' };

  // Connectors
  const connectMat = new THREE.LineBasicMaterial({ color: 0x555555 });
  bipolarGroup.children.forEach(b => {
    // connect b to nearest ganglion
    const nearest = ganglionGroup.children.reduce((prev, curr) => {
      return (Math.abs(curr.position.y - b.position.y) < Math.abs(prev.position.y - b.position.y) ? curr : prev);
    });
    const geo = new THREE.BufferGeometry().setFromPoints([
      b.position.clone().add(new THREE.Vector3(0.5, 0, 0)), 
      nearest.position.clone().add(new THREE.Vector3(ganglionGroup.position.x - bipolarGroup.position.x - 0.3, 0, 0))
    ]);
    b.add(new THREE.Line(geo, connectMat));
  });

  // Layer 3: Photoreceptors (Rods and Cones - at the BACK of the retina)
  const receptorGroup = new THREE.Group();
  receptorGroup.position.x = -2;
  group.add(receptorGroup);

  const rodMat = new THREE.MeshStandardMaterial({ color: 0x888888 }); // Rods (B&W/low light)
  const coneR = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Red Cone
  const coneG = new THREE.MeshStandardMaterial({ color: 0x00ff00 }); // Green Cone
  const coneB = new THREE.MeshStandardMaterial({ color: 0x0000ff }); // Blue Cone

  const receptors = [];

  for(let y=-2.5; y<=2.5; y+=0.3) {
    // 20% chance for a cone, 80% for a rod
    const isCone = Math.random() < 0.3;
    let mesh;
    if (isCone) {
      mesh = new THREE.Mesh(new THREE.ConeGeometry(0.2, 1), [coneR, coneG, coneB][Math.floor(Math.random()*3)]);
      mesh.rotation.z = -Math.PI/2;
      mesh.userData = { type: 'cone' };
    } else {
      mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1), rodMat);
      mesh.rotation.z = Math.PI/2;
      mesh.userData = { type: 'rod' };
    }
    mesh.position.y = y;
    receptorGroup.add(mesh);
    receptors.push(mesh);

    // Connect to bipolar
    const nearest = bipolarGroup.children.reduce((prev, curr) => {
      return (Math.abs(curr.position.y - y) < Math.abs(prev.position.y - y) ? curr : prev);
    });
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0.5, 0, 0), 
      nearest.position.clone().add(new THREE.Vector3(bipolarGroup.position.x - receptorGroup.position.x - 0.5, 0, 0)).sub(mesh.position)
    ]);
    mesh.add(new THREE.Line(geo, connectMat));
  }

  receptors.find(r=>r.userData.type==='rod').userData = { id: 'rod', name: 'Rod Cell', description: 'Highly sensitive to light. Used for night vision and peripheral vision, but cannot distinguish colors.' };
  receptors.find(r=>r.userData.type==='cone').userData = { id: 'cone', name: 'Cone Cell', description: 'Less sensitive to light, but detects specific wavelengths (Red, Green, Blue) giving us high-resolution color vision.' };

  // Pigment Epithelium (The very back wall)
  const wall = new THREE.Mesh(new THREE.BoxGeometry(0.5, 6, 6), new THREE.MeshStandardMaterial({ color: 0x111111 }));
  wall.position.x = -3;
  group.add(wall);
  wall.userData = { id: 'epithelium', name: 'Pigment Epithelium', description: 'A black layer that absorbs excess light to prevent it from bouncing around inside the eye and blurring the image.' };

  // Electrical signals (going BACK towards the optic nerve)
  const signalGeo = new THREE.SphereGeometry(0.05);
  const signalMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const signals = new THREE.Group();
  group.add(signals);

  group.userData.animate = function(delta) {
    // Photons flying right to left
    pList.forEach((p, index) => {
      p.mesh.position.x -= p.speed;
      
      // When photon hits the back (receptors)
      if (p.mesh.position.x < -1.5) {
        // Reset photon
        p.mesh.position.x = 5;
        p.mesh.position.y = (Math.random()-0.5)*5;
        
        // Spawn electrical signal going left to right (back to brain)
        const sig = new THREE.Mesh(signalGeo, signalMat);
        sig.position.set(-1.5, p.mesh.position.y, p.mesh.position.z);
        signals.add(sig);
      }
    });

    // Signals traveling back to optic nerve
    for(let i=signals.children.length-1; i>=0; i--) {
      const sig = signals.children[i];
      sig.position.x += 0.1;
      
      // Gather towards optic nerve bundle (Y=0)
      if (sig.position.x > 2) {
        if (sig.position.y > 0) sig.position.y -= 0.1;
        if (sig.position.y < 0) sig.position.y += 0.1;
      }
      
      if (sig.position.x > 5) {
        signals.remove(sig);
      }
    }
  };

  group.userData.quiz = [
    { question: "Which type of photoreceptor allows you to see colors?", options: ["Rods", "Cones", "Ganglion Cells"], answer: 1 },
    { question: "Counter-intuitively, which layer does light hit FIRST when it enters the human retina?", options: ["The Photoreceptors (Rods and Cones) at the back", "The Pigment Epithelium", "The Ganglion Cells and nerve fibers at the front"], answer: 2 }
  ];

  return group;
}
