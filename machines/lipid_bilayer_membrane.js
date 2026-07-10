export function createLipidBilayer(THREE) {
  const group = new THREE.Group();

  // 1. The Lipid Bilayer
  const membraneGroup = new THREE.Group();
  group.add(membraneGroup);

  const headGeo = new THREE.SphereGeometry(0.25, 16, 16);
  const headMat = new THREE.MeshStandardMaterial({ color: 0x88ccff, roughness: 0.3 }); // Hydrophilic heads
  
  const tailGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.6);
  const tailMat = new THREE.MeshStandardMaterial({ color: 0xffffaa, roughness: 0.8 }); // Hydrophobic tails

  const lipids = [];

  const width = 10;
  const depth = 6;
  const spacing = 0.55;

  for(let x = -width/2; x <= width/2; x += spacing) {
    for(let z = -depth/2; z <= depth/2; z += spacing) {
      // Skip some spots for integral proteins
      if (Math.abs(x) < 1.5 && Math.abs(z) < 1.5) continue;
      if (Math.abs(x - 3) < 1 && Math.abs(z - 1) < 1) continue;

      // Top Layer
      const tLipid = new THREE.Group();
      tLipid.position.set(x + (Math.random()-0.5)*0.1, 0.8, z + (Math.random()-0.5)*0.1);
      
      const tHead = new THREE.Mesh(headGeo, headMat);
      tLipid.add(tHead);
      
      const tTail1 = new THREE.Mesh(tailGeo, tailMat);
      tTail1.position.set(-0.1, -0.4, 0);
      tTail1.rotation.z = 0.1; // Kinked tail (unsaturated fat)
      const tTail2 = new THREE.Mesh(tailGeo, tailMat);
      tTail2.position.set(0.1, -0.4, 0);
      
      tLipid.add(tTail1, tTail2);
      membraneGroup.add(tLipid);
      lipids.push({ mesh: tLipid, baseY: 0.8, phase: Math.random()*Math.PI*2 });

      // Bottom Layer
      const bLipid = new THREE.Group();
      bLipid.position.set(x + (Math.random()-0.5)*0.1, -0.8, z + (Math.random()-0.5)*0.1);
      
      const bHead = new THREE.Mesh(headGeo, headMat);
      bLipid.add(bHead);
      
      const bTail1 = new THREE.Mesh(tailGeo, tailMat);
      bTail1.position.set(-0.1, 0.4, 0);
      const bTail2 = new THREE.Mesh(tailGeo, tailMat);
      bTail2.position.set(0.1, 0.4, 0);
      
      bLipid.add(bTail1, bTail2);
      membraneGroup.add(bLipid);
      lipids.push({ mesh: bLipid, baseY: -0.8, phase: Math.random()*Math.PI*2 });
    }
  }

  // Target one lipid for tooltip
  lipids[0].mesh.children[0].userData = { id: 'phospholipid', name: 'Phospholipid Molecule', description: 'Has a water-loving (hydrophilic) phosphate head, and two water-fearing (hydrophobic) fatty acid tails.' };

  // 2. Integral Membrane Protein (e.g., Ion Channel)
  const channelGroup = new THREE.Group();
  group.add(channelGroup);
  
  const chMat = new THREE.MeshStandardMaterial({ color: 0xff66aa, roughness: 0.5 });
  // Make it out of multiple cylinders to leave a hole in the middle
  for(let i=0; i<6; i++) {
    const sub = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 2.5), chMat);
    const angle = (i/6)*Math.PI*2;
    sub.position.set(Math.cos(angle)*0.5, 0, Math.sin(angle)*0.5);
    channelGroup.add(sub);
  }
  channelGroup.userData = { id: 'ion_channel', name: 'Integral Membrane Protein (Channel)', description: 'Acts as a tunnel to allow specific large or charged molecules (like ions) to cross the hydrophobic core of the membrane.' };

  // 3. Peripheral Membrane Protein
  const periph = new THREE.Mesh(new THREE.TorusKnotGeometry(0.5, 0.2, 64, 8), new THREE.MeshStandardMaterial({ color: 0x66ffaa }));
  periph.position.set(3, 1.2, 1);
  periph.rotation.x = Math.PI/2;
  group.add(periph);
  periph.userData = { id: 'peripheral_protein', name: 'Peripheral Protein', description: 'Sits on the surface of the membrane. Often used for cell signaling or anchoring the cytoskeleton.' };

  // 4. Cholesterol molecules (stuck in the tails)
  const cholGeo = new THREE.CapsuleGeometry(0.1, 0.3);
  const cholMat = new THREE.MeshStandardMaterial({ color: 0xffff00 });
  for(let i=0; i<20; i++) {
    const c = new THREE.Mesh(cholGeo, cholMat);
    c.position.set((Math.random()-0.5)*8, (Math.random()>0.5 ? 0.3 : -0.3), (Math.random()-0.5)*4);
    c.rotation.x = Math.PI/2;
    c.rotation.z = Math.random()*Math.PI;
    group.add(c);
  }
  // No hit test needed, too small, but conceptually there.

  // 5. Molecules crossing
  // Small uncharged molecule (O2) crosses freely
  const o2Geo = new THREE.SphereGeometry(0.15);
  const o2Mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const o2 = new THREE.Mesh(o2Geo, o2Mat);
  o2.position.set(-3, 3, 0);
  group.add(o2);
  
  // Large/charged ion crosses through channel
  const ionGeo = new THREE.SphereGeometry(0.2);
  const ionMat = new THREE.MeshBasicMaterial({ color: 0xff00ff });
  const ion = new THREE.Mesh(ionGeo, ionMat);
  ion.position.set(0, 3, 0);
  group.add(ion);

  group.userData.animate = function(delta) {
    const t = Date.now() * 0.002;

    // Fluid Mosaic Model: Lipids bob and drift slightly
    lipids.forEach(l => {
      // Vertical bobbing
      l.mesh.position.y = l.baseY + Math.sin(t*2 + l.phase) * 0.05;
      // Slight wobbling
      l.mesh.rotation.x = Math.sin(t + l.phase) * 0.05;
      l.mesh.rotation.z = Math.cos(t + l.phase) * 0.05;
    });

    // O2 crosses directly through the bilayer (Simple Diffusion)
    o2.position.y -= 0.02;
    if (o2.position.y < -3) {
      o2.position.y = 3;
      o2.position.x = -2 - Math.random()*2; // random spot
    }

    // Ion goes through channel (Facilitated Diffusion)
    ion.position.y -= 0.03;
    // Funnel it into the channel
    if (ion.position.y > 1.2) {
      ion.position.x = Math.sin(t*5)*0.1; // hovering above
      ion.position.z = Math.cos(t*5)*0.1;
    } else if (ion.position.y > -1.2) {
      // inside channel
      ion.position.x = 0;
      ion.position.z = 0;
      channelGroup.scale.set(1.05, 1, 1.05); // channel expands slightly
    } else {
      channelGroup.scale.set(1, 1, 1);
    }
    
    if (ion.position.y < -3) {
      ion.position.y = 3;
    }
  };

  group.userData.quiz = [
    { question: "Why do the phospholipids form a bilayer (two layers) in water?", options: ["Because they are magnetic", "Because their tails are hydrophobic (water-fearing) and hide in the middle, while their heads are hydrophilic (water-loving) and face the outside", "Because proteins glue them together"], answer: 1 },
    { question: "Which type of molecule can pass directly through the lipid bilayer without needing a protein channel?", options: ["Large sugars like Glucose", "Charged ions like Sodium (Na+)", "Small, uncharged molecules like Oxygen (O2) and Carbon Dioxide (CO2)"], answer: 2 }
  ];

  return group;
}
