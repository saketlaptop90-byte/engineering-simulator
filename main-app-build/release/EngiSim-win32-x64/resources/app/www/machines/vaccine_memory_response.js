export function createVaccineMemory(THREE) {
  const group = new THREE.Group();

  // A timeline/graph visualization of Primary vs Secondary Immune Response

  // 1. Graph Axes
  const axisMat = new THREE.LineBasicMaterial({ color: 0xffffff });
  const axesGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-5, 4, 0),
    new THREE.Vector3(-5, -3, 0),
    new THREE.Vector3(5, -3, 0)
  ]);
  const axes = new THREE.Line(axesGeo, axisMat);
  group.add(axes);

  // Labels (pseudo text)
  const yLabel = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3, 0.01), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  yLabel.position.set(-5.5, 0.5, 0);
  group.add(yLabel);
  yLabel.userData = { id: 'y_axis', name: 'Antibody Concentration', description: 'The amount of specific antibodies present in the blood.' };

  const xLabel = new THREE.Mesh(new THREE.BoxGeometry(4, 0.2, 0.01), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  xLabel.position.set(0, -3.5, 0);
  group.add(xLabel);
  xLabel.userData = { id: 'x_axis', name: 'Time (Days)', description: 'Timeline of exposure and response.' };

  // 2. Events on timeline
  const vaxEvent = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.5), new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
  vaxEvent.position.set(-4, -3, 0);
  group.add(vaxEvent);
  vaxEvent.userData = { id: 'vax', name: 'Day 0: Vaccination (Primary Exposure)', description: 'A harmless piece of the virus (e.g. mRNA or dead virus) is introduced. The immune system slowly learns to fight it over 1-2 weeks.' };

  const infEvent = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.5), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
  infEvent.position.set(0, -3, 0);
  group.add(infEvent);
  infEvent.userData = { id: 'infection', name: 'Day 30: Real Infection (Secondary Exposure)', description: 'The actual, dangerous virus enters the body.' };

  // 3. The Antibody Curve (Animated line)
  const curveMat = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 3 });
  const curveGeo = new THREE.BufferGeometry();
  const maxPoints = 100;
  const positions = new Float32Array(maxPoints * 3);
  curveGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  curveGeo.setDrawRange(0, 0);
  const curve = new THREE.Line(curveGeo, curveMat);
  group.add(curve);

  // Math for the curve:
  // Primary response: slow rise, low peak, slow fall to a baseline > 0
  // Secondary response: IMMEDIATE rise, MASSIVE peak, sustained level
  
  const getAntibodyLevel = (day) => {
    let level = 0;
    
    // Primary response (Vaccine)
    if (day > 0) {
      // Peaks around day 14
      if (day < 14) {
        level += Math.pow((day / 14), 2) * 2; // slow exponential rise
      } else {
        level += 2 - ((day - 14) / 16) * 1.5; // slow decay
        if (level < 0.5) level = 0.5; // Memory baseline
      }
    }
    
    // Secondary response (Real Infection)
    if (day > 30) {
      // Peaks around day 35, massive
      if (day < 35) {
        level += Math.pow((day - 30) / 5, 2) * 6; // fast explosive rise
      } else {
        level += 6 - ((day - 35) / 10) * 2; // slow decay
        if (level < 4.0) level = 4.0; // Higher sustained baseline
      }
    }
    
    return level;
  };

  // 4. Visual representation of Memory B-Cells vs Plasma Cells
  const cellGroup = new THREE.Group();
  group.add(cellGroup);

  const bCellGeo = new THREE.SphereGeometry(0.3);
  const memMat = new THREE.MeshStandardMaterial({ color: 0x8888ff }); // Memory Cell
  const plasmaMat = new THREE.MeshStandardMaterial({ color: 0xff88ff }); // Plasma Cell (Antibody factory)
  
  const cells = [];

  let currentDay = -5; // -5 to 50
  
  group.userData.animate = function(delta) {
    const speed = 5.0; // days per second
    currentDay += delta * speed;
    
    if (currentDay > 50) {
      currentDay = -5;
      curveGeo.setDrawRange(0, 0);
      while(cellGroup.children.length > 0) cellGroup.remove(cellGroup.children[0]);
      cells.length = 0;
    }

    // Draw graph
    const pointIdx = Math.floor((currentDay + 5) / 55 * maxPoints);
    if (pointIdx >= 0 && pointIdx < maxPoints) {
      const x = -5 + ((currentDay + 5) / 55) * 10;
      const y = -3 + getAntibodyLevel(currentDay);
      
      positions[pointIdx * 3] = x;
      positions[pointIdx * 3 + 1] = y;
      positions[pointIdx * 3 + 2] = 0;
      
      curveGeo.attributes.position.needsUpdate = true;
      curveGeo.setDrawRange(0, pointIdx + 1);
    }

    // Spawn cells based on antibody derivative
    const abLevel = getAntibodyLevel(currentDay);
    const targetPlasma = Math.floor(abLevel * 2);
    
    // Memory cells stay forever after day 14
    const targetMemory = currentDay > 14 ? 3 : 0;

    // Adjust plasma cells
    const currentPlasma = cells.filter(c => c.type === 'plasma').length;
    if (currentPlasma < targetPlasma) {
      const c = new THREE.Mesh(bCellGeo, plasmaMat);
      c.position.set(2 + (Math.random()-0.5)*3, 1 + (Math.random()-0.5)*3, (Math.random()-0.5)*2);
      cellGroup.add(c);
      cells.push({ mesh: c, type: 'plasma' });
    } else if (currentPlasma > targetPlasma && currentPlasma > 0) {
      // Apoptosis (cell death) as infection clears
      const idx = cells.findIndex(c => c.type === 'plasma');
      if (idx !== -1) {
        cellGroup.remove(cells[idx].mesh);
        cells.splice(idx, 1);
      }
    }

    // Adjust memory cells
    const currentMemory = cells.filter(c => c.type === 'memory').length;
    if (currentMemory < targetMemory) {
      const c = new THREE.Mesh(bCellGeo, memMat);
      c.position.set(-2 + (Math.random()-0.5)*2, 2 + (Math.random()-0.5)*2, (Math.random()-0.5)*2);
      cellGroup.add(c);
      cells.push({ mesh: c, type: 'memory' });
      c.userData = { id: 'memory_b', name: 'Memory B-Cell', description: 'Created during the first exposure. They live for decades, remembering the exact shape of the antigen so they can react instantly next time.' };
    }

    // Wiggle cells
    cells.forEach(c => {
      c.mesh.position.y += Math.sin(Date.now()*0.005 + c.mesh.position.x)*0.01;
    });
  };

  group.userData.quiz = [
    { question: "Why is the Secondary Immune Response (after infection) so much faster and stronger than the Primary Response (vaccine)?", options: ["Because the virus is stronger", "Because Memory B-Cells and T-Cells were created during the vaccine, and they react instantly upon seeing the antigen again", "Because vaccines contain antibiotics"], answer: 1 },
    { question: "What is the purpose of a vaccine?", options: ["To kill viruses currently in your body", "To safely trigger the Primary Immune response so your body builds Memory Cells without you actually getting sick", "To coat your cells in armor"], answer: 1 }
  ];

  return group;
}
