export function createTCellActivation(THREE) {
  const group = new THREE.Group();

  // 1. Dendritic Cell / Antigen Presenting Cell (APC)
  const apcGroup = new THREE.Group();
  apcGroup.position.set(-3, 0, 0);
  group.add(apcGroup);

  const apcMat = new THREE.MeshStandardMaterial({ color: 0xddaa88, roughness: 0.9 });
  const apc = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), apcMat);
  apcGroup.add(apc);
  apc.userData = { id: 'apc', name: 'Dendritic Cell (APC)', description: 'An Antigen-Presenting Cell. It has already eaten a virus somewhere else, chopped it up, and is now showing the pieces to T-Cells.' };

  // MHC Class II Molecule (Holding the antigen)
  const mhcGroup = new THREE.Group();
  mhcGroup.position.set(3, 0, 0);
  apcGroup.add(mhcGroup);

  const mhcMat = new THREE.MeshStandardMaterial({ color: 0x4444ff });
  const mhc = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1, 0.5), mhcMat);
  mhcGroup.add(mhc);
  
  // The Antigen (The chopped up virus piece)
  const agMat = new THREE.MeshStandardMaterial({ color: 0xff2222 });
  const antigen = new THREE.Mesh(new THREE.SphereGeometry(0.3), agMat);
  antigen.position.set(0.4, 0, 0);
  mhcGroup.add(antigen);
  mhc.userData = { id: 'mhc', name: 'MHC-II + Antigen', description: 'Major Histocompatibility Complex. It holds out the tiny red viral antigen like a platter.' };

  // 2. Helper T-Cell (CD4+)
  const tcellGroup = new THREE.Group();
  tcellGroup.position.set(4, 0, 0); // Starts away
  group.add(tcellGroup);

  const tMat = new THREE.MeshStandardMaterial({ color: 0xaaffaa, roughness: 0.8 });
  const tcell = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), tMat);
  tcellGroup.add(tcell);
  tcell.userData = { id: 'tcell', name: 'Helper T-Cell (Naive)', description: 'Wanders the lymph nodes checking every APC. If its unique receptor matches the antigen, it activates.' };

  // T-Cell Receptor (TCR)
  const tcrGroup = new THREE.Group();
  tcrGroup.position.set(-2, 0, 0);
  tcellGroup.add(tcrGroup);

  const tcrMat = new THREE.MeshStandardMaterial({ color: 0x44aa44 });
  const tcr = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1, 0.5), tcrMat);
  tcrGroup.add(tcr);
  tcr.userData = { id: 'tcr', name: 'T-Cell Receptor (TCR)', description: 'Highly specific. Out of billions of T-Cells, only a few will have the exact shape to bind this specific red antigen.' };

  // CD4 Coreceptor
  const cd4 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1), new THREE.MeshStandardMaterial({ color: 0xffff00 }));
  cd4.position.set(0, -0.6, 0);
  cd4.rotation.z = Math.PI/4;
  tcrGroup.add(cd4);

  // 3. Cytokines (Chemical Signals)
  const cytoGroup = new THREE.Group();
  group.add(cytoGroup);
  const cytoGeo = new THREE.SphereGeometry(0.1);
  const cytoMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });

  let phase = 0; // 0: wandering, 1: docking, 2: scanning, 3: activating (cytokines), 4: proliferating
  let timer = 0;

  // Clones for proliferation
  const clones = new THREE.Group();
  group.add(clones);

  group.userData.animate = function(delta) {
    const t = Date.now() * 0.001;

    // Gentle cell floating
    apc.rotation.y = t * 0.1;
    tcell.position.y = Math.sin(t*2)*0.2;

    if (phase === 0) {
      // T-Cell approaching APC
      tcellGroup.position.x -= 0.05;
      
      if (tcellGroup.position.x < 1.5) {
        phase = 1;
        timer = 0;
      }
    } else if (phase === 1) {
      // Docking and Scanning
      timer += delta;
      
      // Wiggle to find fit
      tcellGroup.rotation.z = Math.sin(timer*10)*0.1;
      
      if (timer > 2) {
        phase = 2;
        timer = 0;
        tcellGroup.rotation.z = 0;
      }
    } else if (phase === 2) {
      // The handshake (Signal 1 & 2)
      timer += delta;
      
      // APC secretes cytokines to wake up T-cell
      if (Math.random() < 0.2) {
        const c = new THREE.Mesh(cytoGeo, cytoMat);
        c.position.set(-1.5 + Math.random(), (Math.random()-0.5)*1, (Math.random()-0.5)*1);
        c.userData = { vx: 0.05 + Math.random()*0.05, vy: (Math.random()-0.5)*0.05 };
        cytoGroup.add(c);
      }
      
      if (timer > 3) {
        phase = 3;
        timer = 0;
        tMat.color.setHex(0x00ff00); // T-Cell activates (bright green)
      }
    } else if (phase === 3) {
      // Activated: Proliferation (Clonal Expansion)
      timer += delta;
      
      tcellGroup.position.x += 0.02; // back away
      
      if (timer > 1 && clones.children.length === 0) {
        // Clone 1
        const c1 = tcellGroup.clone();
        c1.position.y += 3;
        clones.add(c1);
      }
      if (timer > 2 && clones.children.length === 1) {
        // Clone 2
        const c2 = tcellGroup.clone();
        c2.position.y -= 3;
        clones.add(c2);
      }

      if (timer > 4) {
        phase = 4;
      }
    } else if (phase === 4) {
      // Armies of T-cells fly away to fight
      tcellGroup.position.x += 0.05;
      clones.children.forEach(c => c.position.x += 0.05);

      if (tcellGroup.position.x > 10) {
        // Reset
        phase = 0;
        tcellGroup.position.set(4, 0, 0);
        tMat.color.setHex(0xaaffaa);
        while(clones.children.length > 0) clones.remove(clones.children[0]);
      }
    }

    // Move cytokines
    for(let i=cytoGroup.children.length-1; i>=0; i--) {
      const c = cytoGroup.children[i];
      c.position.x += c.userData.vx;
      c.position.y += c.userData.vy;
      if (c.position.x > 1) {
        cytoGroup.remove(c);
      }
    }
  };

  group.userData.quiz = [
    { question: "What does the Antigen-Presenting Cell (APC) do?", options: ["It kills T-Cells", "It shows pieces of destroyed viruses (antigens) to T-Cells to find the one with the matching receptor", "It produces antibodies"], answer: 1 },
    { question: "Once a Helper T-Cell finds its matching antigen and activates, what does it do next?", options: ["It dies", "It turns into a red blood cell", "It rapidly clones itself (Clonal Expansion) to build an army of specific fighters"], answer: 2 }
  ];

  return group;
}
