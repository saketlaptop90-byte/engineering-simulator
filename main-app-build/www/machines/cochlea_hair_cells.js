export function createCochleaHairCells(THREE) {
  const group = new THREE.Group();

  // 1. The Basilar Membrane
  const memGroup = new THREE.Group();
  group.add(memGroup);

  const memGeo = new THREE.PlaneGeometry(8, 2, 32, 1);
  const memMat = new THREE.MeshStandardMaterial({ color: 0xaa5555, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
  const membrane = new THREE.Mesh(memGeo, memMat);
  membrane.rotation.x = -Math.PI / 2;
  memGroup.add(membrane);
  membrane.userData = { id: 'basilar_membrane', name: 'Basilar Membrane', description: 'A vibrating membrane inside the cochlea. Different frequencies of sound cause different parts of the membrane to vibrate.' };

  // 2. Hair Cells (Stereocilia)
  const cellGroup = new THREE.Group();
  memGroup.add(cellGroup);

  const cellGeo = new THREE.CapsuleGeometry(0.1, 0.3, 8, 8);
  const cellMat = new THREE.MeshStandardMaterial({ color: 0x55aa55 });
  const hairGeo = new THREE.CylinderGeometry(0.01, 0.02, 0.4);
  const hairMat = new THREE.MeshStandardMaterial({ color: 0xffffff });

  const cells = [];

  // Create rows of hair cells along the membrane
  for(let x=-3.5; x<=3.5; x+=0.5) {
    for(let z=-0.5; z<=0.5; z+=0.5) {
      const c = new THREE.Group();
      c.position.set(x, 0.25, z);
      
      const body = new THREE.Mesh(cellGeo, cellMat);
      c.add(body);

      // Stereocilia bundle on top
      const bundle = new THREE.Group();
      bundle.position.y = 0.3;
      for(let h=0; h<5; h++) {
        const hair = new THREE.Mesh(hairGeo, hairMat);
        hair.position.set((Math.random()-0.5)*0.1, 0.2, (Math.random()-0.5)*0.1);
        bundle.add(hair);
      }
      c.add(bundle);

      // Nerve fiber attaching to bottom
      const nerveGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, -0.2, 0), new THREE.Vector3(0, -1, 0)]);
      const nerve = new THREE.Line(nerveGeo, new THREE.LineBasicMaterial({ color: 0xffff00 }));
      c.add(nerve);

      cellGroup.add(c);
      cells.push({ group: c, bundle: bundle, x: x });
    }
  }

  cells[0].group.children[0].userData = { id: 'hair_cells', name: 'Hair Cells (Stereocilia)', description: 'Mechanoreceptors. When the membrane vibrates, these microscopic hairs bend, physically ripping open ion channels to fire an electrical signal.' };

  // 3. Tectorial Membrane (The roof they brush against)
  const tecGeo = new THREE.BoxGeometry(8, 0.1, 2);
  const tecMat = new THREE.MeshStandardMaterial({ color: 0x5555aa, transparent: true, opacity: 0.5 });
  const tectorial = new THREE.Mesh(tecGeo, tecMat);
  tectorial.position.y = 0.9;
  memGroup.add(tectorial);
  tectorial.userData = { id: 'tectorial', name: 'Tectorial Membrane', description: 'A rigid roof structure. As the basilar membrane bounces up and down, the hair cells crash into this roof, causing the hairs to bend.' };

  // 4. Sound Wave visualization (Incoming)
  const waveCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-6, 2, 0),
    new THREE.Vector3(-4, 0, 0)
  ]);
  const waveGeo = new THREE.TubeGeometry(waveCurve, 16, 0.1, 8, false);
  const wave = new THREE.Mesh(waveGeo, new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true }));
  group.add(wave);

  // Control UI / Logic
  let soundFreq = 2.0; // low to high
  let soundAmp = 0.5;

  group.userData.animate = function(delta) {
    const t = Date.now() * 0.005;

    // Slowly vary the incoming sound frequency for demo purposes
    soundFreq = 3 + Math.sin(t*0.2) * 2; // 1 to 5

    // The Basilar Membrane is stiff at the base (high freq) and floppy at the apex (low freq).
    // So different frequencies cause a traveling wave that peaks at a specific X coordinate.
    // Let's say X=-4 is High freq, X=4 is Low freq
    const peakX = 4 - ((soundFreq - 1) / 4) * 8; // maps freq 1->5 to X 4->-4

    // Deform membrane
    const positions = membrane.geometry.attributes.position;
    for(let i=0; i<positions.count; i++) {
      let vx = positions.getX(i);
      
      // Calculate amplitude at this X based on distance to peakX
      const distToPeak = Math.abs(vx - peakX);
      const envelope = Math.max(0, 1 - distToPeak*0.5); // Only vibrate near the peak
      
      const vy = Math.sin(t * soundFreq - vx*2) * envelope * soundAmp;
      positions.setZ(i, vy); // Z is UP because plane is rotated X -Pi/2
    }
    membrane.geometry.attributes.position.needsUpdate = true;
    membrane.geometry.computeVertexNormals();

    // Animate cells sitting on the membrane
    cells.forEach(c => {
      const dist = Math.abs(c.x - peakX);
      const env = Math.max(0, 1 - dist*0.5);
      const yOffset = Math.sin(t * soundFreq - c.x*2) * env * soundAmp;
      
      c.group.position.y = 0.25 + yOffset;
      
      // Bend hairs if they hit the tectorial membrane
      if (c.group.position.y > 0.4) {
        c.bundle.rotation.z = (c.group.position.y - 0.4) * 2; // Bend them
        c.bundle.children.forEach(h => h.material.color.setHex(0xffff00)); // Flash yellow (firing!)
      } else {
        c.bundle.rotation.z = 0;
        c.bundle.children.forEach(h => h.material.color.setHex(0xffffff));
      }
    });

  };

  group.userData.quiz = [
    { question: "How does the ear distinguish between high pitch and low pitch sounds?", options: ["High pitches vibrate faster", "High pitches bend hair cells at the stiff BASE of the cochlea, while low pitches bend cells at the floppy APEX", "The eardrum changes color"], answer: 1 },
    { question: "What happens when the stereocilia (hairs) bend against the tectorial membrane?", options: ["They break off and die", "They physically pull open ion channels, generating an electrical nerve impulse", "They secrete earwax"], answer: 1 }
  ];

  return group;
}
