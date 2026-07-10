export function createPedigreeChart(THREE) {
  const group = new THREE.Group();

  // A 3D network/tree graph representing a family tree for an autosomal recessive trait.

  const nodeMatM_norm = new THREE.MeshStandardMaterial({ color: 0xaaaaaa }); // Square, unaffected
  const nodeMatM_aff  = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Square, affected
  const nodeMatF_norm = new THREE.MeshStandardMaterial({ color: 0xaaaaaa }); // Circle, unaffected
  const nodeMatF_aff  = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Circle, affected
  const nodeMatF_carr = new THREE.MeshStandardMaterial({ color: 0xaa5555 }); // Half/Half for carriers (hard to do without textures, we'll use a ring or inner color)

  const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff });

  // Helper to draw a node
  const createNode = (type, status, x, y) => {
    let geo, mat;
    if (type === 'M') {
      geo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
      mat = status === 'aff' ? nodeMatM_aff : nodeMatM_norm;
    } else {
      geo = new THREE.SphereGeometry(0.5, 32, 32);
      mat = status === 'aff' ? nodeMatF_aff : nodeMatF_norm;
    }
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, 0);
    
    // Add a dot if carrier (heterozygous)
    if (status === 'carrier') {
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.2), new THREE.MeshBasicMaterial({ color: 0x000000 }));
      dot.position.z = 0.5;
      mesh.add(dot);
    }
    
    group.add(mesh);
    return mesh;
  };

  // Helper to draw lines
  const drawLine = (x1, y1, x2, y2) => {
    const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x1, y1, 0), new THREE.Vector3(x2, y2, 0)]);
    const line = new THREE.Line(geo, lineMat);
    group.add(line);
  };

  // Generation I (Grandparents)
  // M (carrier) married to F (carrier)
  const g1_m = createNode('M', 'carrier', -2, 4);
  const g1_f = createNode('F', 'carrier', 2, 4);
  drawLine(-1.6, 4, 1.5, 4); // Marriage line
  drawLine(0, 4, 0, 2); // Descent line

  // Generation II (Parents & Aunt/Uncle)
  drawLine(-3, 2, 3, 2); // Sibling line
  
  // Child 1 (Unaffected Male)
  const g2_c1 = createNode('M', 'norm', -3, 1);
  drawLine(-3, 2, -3, 1.4);
  
  // Child 2 (Affected Female)
  const g2_c2 = createNode('F', 'aff', -1, 1);
  drawLine(-1, 2, -1, 1.5);
  g2_c2.userData = { id: 'affected_fem', name: 'Affected Female (rr)', description: 'Has two copies of the recessive allele. This proves her parents must both be carriers (Rr), even though they don\'t show the trait.' };
  
  // Child 3 (Carrier Male) - Married into family
  const g2_c3 = createNode('M', 'carrier', 1, 1);
  drawLine(1, 2, 1, 1.4);
  
  const g2_spouse = createNode('F', 'carrier', 3, 1); // Outsider
  drawLine(1.4, 1, 2.5, 1); // Marriage
  drawLine(2, 1, 2, -1); // Descent

  // Generation III (Grandchildren)
  drawLine(0, -1, 4, -1); // Sibling line
  
  // Child of CarrierxCarrier
  const g3_c1 = createNode('M', 'aff', 0, -2);
  drawLine(0, -1, 0, -1.6);
  
  const g3_c2 = createNode('F', 'norm', 2, -2);
  drawLine(2, -1, 2, -1.5);
  
  const g3_c3 = createNode('M', 'norm', 4, -2);
  drawLine(4, -1, 4, -1.6);

  g1_m.userData = { id: 'carrier_male', name: 'Carrier Male (Rr)', description: 'Square = Male. Dot = Carrier (Heterozygous). Has the hidden gene but is unaffected.' };

  // Animate: Pulsing the affected individuals
  group.userData.animate = function(delta) {
    const t = Date.now() * 0.005;
    g2_c2.scale.set(1 + Math.sin(t)*0.1, 1 + Math.sin(t)*0.1, 1 + Math.sin(t)*0.1);
    g3_c1.scale.set(1 + Math.sin(t)*0.1, 1 + Math.sin(t)*0.1, 1 + Math.sin(t)*0.1);
  };

  group.userData.quiz = [
    { question: "In a pedigree chart, what does a shaded (red) square represent?", options: ["An affected female", "An affected male", "A carrier male"], answer: 1 },
    { question: "If two unaffected parents have an affected child, what does this tell you about the trait?", options: ["The trait must be Recessive, and both parents are Carriers", "The trait must be Dominant", "It is impossible"], answer: 0 }
  ];

  return group;
}
