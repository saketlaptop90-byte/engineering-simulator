import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
  const group = new THREE.Group();
  const parts = [];
  const meshes = {};

  // Custom materials for biological high-tech look
  const rootCapMat = new THREE.MeshPhysicalMaterial({ color: 0x8B4513, roughness: 0.8, clearcoat: 0.2 });
  const quiescentMat = new THREE.MeshLambertMaterial({ color: 0x00ffff, emissive: 0x004444, transparent: true, opacity: 0.8 });
  const meristemMat = new THREE.MeshPhongMaterial({ color: 0x32CD32, emissive: 0x002200, shininess: 100 });
  const elongationMat = new THREE.MeshStandardMaterial({ color: 0x2E8B57, roughness: 0.4 });
  const rootHairMat = new THREE.MeshStandardMaterial({ color: 0x98FB98, roughness: 0.6, wireframe: true });

  // 1. Root Cap
  const rootCapGeo = new THREE.ConeGeometry( 2, 4, 32 );
  const rootCap = new THREE.Mesh(rootCapGeo, rootCapMat);
  rootCap.rotation.x = Math.PI; // point downwards
  const rootCapPos = { x: 0, y: -6, z: 0 };
  rootCap.position.set(rootCapPos.x, rootCapPos.y, rootCapPos.z);
  group.add(rootCap);
  meshes.rootCap = rootCap;

  parts.push({
    name: "Root Cap",
    description: "A section of tissue at the tip of a plant root that protects the growing tip in plants.",
    material: "Tough Protective Tissue",
    function: "Protects the delicate apical meristem as the root pushes through soil.",
    assemblyOrder: 1,
    connections: ["Quiescent Center", "Soil"],
    failureEffect: "Damage to the meristem, halting root growth.",
    cascadeFailures: ["Loss of water uptake", "Plant wilting"],
    originalPosition: { ...rootCapPos },
    explodedPosition: { x: 0, y: -10, z: 0 }
  });

  // 2. Quiescent Center
  const qcGeo = new THREE.SphereGeometry( 1.5, 32, 32 );
  const qc = new THREE.Mesh(qcGeo, quiescentMat);
  const qcPos = { x: 0, y: -3.5, z: 0 };
  qc.position.set(qcPos.x, qcPos.y, qcPos.z);
  group.add(qc);
  meshes.qc = qc;

  parts.push({
    name: "Quiescent Center",
    description: "A region in the apical meristem of a root where cell division proceeds very slowly or not at all.",
    material: "Slow-dividing Cells",
    function: "Serves as a reservoir of stem cells and regulates the surrounding meristematic cells.",
    assemblyOrder: 2,
    connections: ["Root Cap", "Apical Meristem"],
    failureEffect: "Loss of stem cell maintenance.",
    cascadeFailures: ["Depletion of meristematic cells", "Root growth arrest"],
    originalPosition: { ...qcPos },
    explodedPosition: { x: -5, y: -3.5, z: 5 }
  });

  // 3. Apical Meristem (Zone of Cell Division)
  const meristemGroup = new THREE.Group();
  for(let i=0; i<20; i++) {
    const cellGeo = new THREE.SphereGeometry(0.3 + Math.random()*0.2, 16, 16);
    const cell = new THREE.Mesh(cellGeo, meristemMat);
    cell.position.set(
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 3,
      (Math.random() - 0.5) * 2
    );
    // save base scale for animation
    cell.userData.baseScale = cell.scale.x;
    cell.userData.phase = Math.random() * Math.PI * 2;
    meristemGroup.add(cell);
  }
  const meristemPos = { x: 0, y: -1, z: 0 };
  meristemGroup.position.set(meristemPos.x, meristemPos.y, meristemPos.z);
  group.add(meristemGroup);
  meshes.meristemGroup = meristemGroup;

  parts.push({
    name: "Apical Meristem",
    description: "The region of rapidly dividing cells just above the quiescent center.",
    material: "Actively Dividing Stem Cells",
    function: "Generates new cells for root growth.",
    assemblyOrder: 3,
    connections: ["Quiescent Center", "Zone of Elongation"],
    failureEffect: "Cessation of new cell production.",
    cascadeFailures: ["No elongation", "Stunted root system"],
    originalPosition: { ...meristemPos },
    explodedPosition: { x: 5, y: -1, z: -5 }
  });

  // 4. Zone of Elongation
  const elongationGeo = new THREE.CylinderGeometry( 1.8, 1.8, 6, 32 );
  const elongation = new THREE.Mesh(elongationGeo, elongationMat);
  const elongationPos = { x: 0, y: 3.5, z: 0 };
  elongation.position.set(elongationPos.x, elongationPos.y, elongationPos.z);
  group.add(elongation);
  meshes.elongation = elongation;

  parts.push({
    name: "Zone of Elongation",
    description: "The region where newly formed cells increase in length.",
    material: "Elongating Cells",
    function: "Drives the root tip further into the soil by cellular expansion.",
    assemblyOrder: 4,
    connections: ["Apical Meristem", "Zone of Maturation"],
    failureEffect: "Root fails to penetrate deeper into the soil.",
    cascadeFailures: ["Inadequate water absorption", "Nutrient deficiency"],
    originalPosition: { ...elongationPos },
    explodedPosition: { x: 0, y: 3.5, z: 8 }
  });

  // 5. Zone of Maturation & Root Hairs
  const maturationGroup = new THREE.Group();
  const maturationGeo = new THREE.CylinderGeometry( 1.8, 1.8, 6, 32 );
  const maturation = new THREE.Mesh(maturationGeo, plastic);
  maturationGroup.add(maturation);

  // Root Hairs
  const hairGeo = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
  hairGeo.translate(0, 1, 0); // shift origin to base
  for(let i=0; i<40; i++) {
    const hair = new THREE.Mesh(hairGeo, rootHairMat);
    const theta = Math.random() * Math.PI * 2;
    const yPos = (Math.random() - 0.5) * 5.5;
    hair.position.set(Math.cos(theta) * 1.8, yPos, Math.sin(theta) * 1.8);
    // Point outwards
    hair.rotation.x = Math.PI / 2;
    hair.rotation.y = theta;
    // user data for animation
    hair.userData.baseScale = hair.scale.y;
    hair.userData.phase = Math.random() * Math.PI * 2;
    maturationGroup.add(hair);
  }

  const maturationPos = { x: 0, y: 9.5, z: 0 };
  maturationGroup.position.set(maturationPos.x, maturationPos.y, maturationPos.z);
  group.add(maturationGroup);
  meshes.maturationGroup = maturationGroup;

  parts.push({
    name: "Zone of Maturation",
    description: "The region where cells differentiate into specific tissues, characterized by the presence of root hairs.",
    material: "Differentiated Tissue",
    function: "Absorbs water and minerals from the soil and provides structural support.",
    assemblyOrder: 5,
    connections: ["Zone of Elongation", "Vascular Cylinder"],
    failureEffect: "Inability to absorb essential water and nutrients.",
    cascadeFailures: ["Plant death"],
    originalPosition: { ...maturationPos },
    explodedPosition: { x: 0, y: 15, z: 0 }
  });

  const description = "The Root Apical Meristem (RAM) is the region at the tip of a plant root where cell division, elongation, and differentiation occur. It is the powerhouse of root growth, driving the root through the soil while continually replenishing its protective cap and generating new tissues for absorption.";

  const quizQuestions = [
    {
      question: "Which part of the root protects the delicate apical meristem as it pushes through soil?",
      options: ["Quiescent Center", "Root Cap", "Zone of Elongation", "Root Hairs"],
      correct: 1,
      explanation: "The Root Cap acts as a protective shield for the delicate meristematic cells behind it as the root forces its way through abrasive soil particles.",
      difficulty: "Easy"
    },
    {
      question: "What is the primary function of the Quiescent Center?",
      options: ["Rapidly dividing to create new cells", "Absorbing water and nutrients", "Acting as a reservoir of stem cells", "Protecting the root tip"],
      correct: 2,
      explanation: "The Quiescent Center contains cells that divide very slowly. It acts as a backup reservoir of stem cells and helps organize the surrounding meristem.",
      difficulty: "Medium"
    },
    {
      question: "In which zone do cells significantly increase in size to drive the root tip deeper?",
      options: ["Zone of Cell Division", "Zone of Elongation", "Zone of Maturation", "Quiescent Center"],
      correct: 1,
      explanation: "The Zone of Elongation is where newly formed cells expand, primarily by taking up water, which provides the physical force to push the root tip through the soil.",
      difficulty: "Easy"
    },
    {
      question: "What structures greatly increase the surface area for water absorption in the Zone of Maturation?",
      options: ["Root Caps", "Stem Cells", "Root Hairs", "Vascular Cylinders"],
      correct: 2,
      explanation: "Root hairs are microscopic extensions of epidermal cells in the Zone of Maturation that massively increase the surface area available for water and nutrient absorption.",
      difficulty: "Easy"
    }
  ];

  function animate(time, speed) {
    // 1. Root Cap subtle drilling motion
    if (meshes.rootCap) {
      meshes.rootCap.rotation.y = time * speed * 0.5;
    }

    // 2. Quiescent Center pulsating (slow)
    if (meshes.qc) {
      const qcScale = 1 + Math.sin(time * speed * 0.5) * 0.05;
      meshes.qc.scale.set(qcScale, qcScale, qcScale);
      meshes.qc.material.emissiveIntensity = 0.5 + Math.sin(time * speed) * 0.5;
    }

    // 3. Meristem Cells dividing/pulsating (fast)
    if (meshes.meristemGroup) {
      meshes.meristemGroup.children.forEach(cell => {
        const s = cell.userData.baseScale * (1 + Math.sin(time * speed * 5 + cell.userData.phase) * 0.2);
        cell.scale.set(s, s, s);
      });
      // Meristem rotating slowly
      meshes.meristemGroup.rotation.y = time * speed * 0.2;
    }

    // 4. Elongation Zone stretching subtly
    if (meshes.elongation) {
      const stretch = 1 + Math.sin(time * speed * 2) * 0.05;
      meshes.elongation.scale.y = stretch;
    }

    // 5. Root Hairs waving
    if (meshes.maturationGroup) {
      meshes.maturationGroup.children.forEach((child, index) => {
        if (index > 0) { // skip the main cylinder
          child.rotation.z = Math.sin(time * speed * 3 + child.userData.phase) * 0.2;
        }
      });
    }
  }

  return {
    group,
    parts,
    description,
    quizQuestions,
    animate
  };
}

// Auto-generated missing stub
export function createRootApicalMeristem() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
