import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
  const group = new THREE.Group();
  
  // Custom materials
  const glowingProteinMat = new THREE.MeshPhysicalMaterial({
    color: 0xff3366,
    emissive: 0xff3366,
    emissiveIntensity: 0.5,
    roughness: 0.2,
    metalness: 0.1,
    clearcoat: 1.0,
    transparent: true,
    opacity: 0.9,
  });

  const glowingLipidMat = new THREE.MeshPhysicalMaterial({
    color: 0x33ccff,
    emissive: 0x33ccff,
    emissiveIntensity: 0.6,
    roughness: 0.1,
    metalness: 0.8,
  });

  const glowingCarbMat = new THREE.MeshPhysicalMaterial({
    color: 0x66ff66,
    emissive: 0x66ff66,
    emissiveIntensity: 0.4,
    wireframe: true,
  });

  const bondMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 0.8,
    roughness: 0.4,
  });

  const parts = [];

  // Protein Structure (Primary, Secondary, Tertiary representation)
  class CustomCurve extends THREE.Curve {
    constructor(scale = 1) {
      super();
      this.scale = scale;
    }
    getPoint(t, optionalTarget = new THREE.Vector3()) {
      const tx = Math.cos(t * Math.PI * 10) * 2;
      const ty = t * 10 - 5;
      const tz = Math.sin(t * Math.PI * 10) * 2;
      return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
    }
  }

  const helixPath = new CustomCurve(0.5);
  const helixGeo = new THREE.TubeGeometry(helixPath, 200, 0.2, 8, false);
  const proteinMesh = new THREE.Mesh(helixGeo, glowingProteinMat);
  proteinMesh.position.set(-5, 0, 0);
  group.add(proteinMesh);
  
  parts.push({
    name: "Protein Alpha Helix",
    description: "A secondary protein structure formed by hydrogen bonds.",
    material: glowingProteinMat,
    function: "Structural support and enzymatic activity.",
    assemblyOrder: 1,
    connections: ["Lipid Bilayer"],
    failureEffect: "Denaturation causing loss of biological function.",
    cascadeFailures: ["Cellular metabolism halts"],
    originalPosition: { x: -5, y: 0, z: 0 },
    explodedPosition: { x: -10, y: 5, z: 0 },
    mesh: proteinMesh
  });

  // Lipid Bilayer representation
  const lipidGroup = new THREE.Group();
  lipidGroup.position.set(0, 0, 0);
  
  for(let i=0; i<5; i++) {
    for(let j=0; j<5; j++) {
      const headGeo = new THREE.SphereGeometry(0.3, 16, 16);
      const head = new THREE.Mesh(headGeo, glowingLipidMat);
      head.position.set(i*1 - 2, 2, j*1 - 2);
      lipidGroup.add(head);

      const tailGeo = new THREE.CylinderGeometry(0.05, 0.05, 1);
      const tail1 = new THREE.Mesh(tailGeo, bondMat);
      tail1.position.set(i*1 - 2.1, 1.2, j*1 - 2);
      const tail2 = new THREE.Mesh(tailGeo, bondMat);
      tail2.position.set(i*1 - 1.9, 1.2, j*1 - 2);
      
      lipidGroup.add(tail1);
      lipidGroup.add(tail2);

      // bottom layer
      const headBottom = new THREE.Mesh(headGeo, glowingLipidMat);
      headBottom.position.set(i*1 - 2, -2, j*1 - 2);
      lipidGroup.add(headBottom);

      const tailB1 = new THREE.Mesh(tailGeo, bondMat);
      tailB1.position.set(i*1 - 2.1, -1.2, j*1 - 2);
      const tailB2 = new THREE.Mesh(tailGeo, bondMat);
      tailB2.position.set(i*1 - 1.9, -1.2, j*1 - 2);

      lipidGroup.add(tailB1);
      lipidGroup.add(tailB2);
    }
  }
  group.add(lipidGroup);

  parts.push({
    name: "Lipid Bilayer Membrane",
    description: "Amphipathic molecules forming a semi-permeable barrier.",
    material: glowingLipidMat,
    function: "Regulates transport of substances in and out of the cell.",
    assemblyOrder: 2,
    connections: ["Protein Alpha Helix", "Carbohydrate Chain"],
    failureEffect: "Membrane rupture leading to cell lysis.",
    cascadeFailures: ["Loss of homeostasis"],
    originalPosition: { x: 0, y: 0, z: 0 },
    explodedPosition: { x: 0, y: 0, z: 10 },
    mesh: lipidGroup
  });

  // Carbohydrate ring
  const carbGeo = new THREE.TorusGeometry(1.5, 0.4, 16, 6); // Hexagonal shape
  const carbMesh = new THREE.Mesh(carbGeo, glowingCarbMat);
  carbMesh.position.set(5, 0, 0);
  carbMesh.rotation.x = Math.PI / 2;
  group.add(carbMesh);

  parts.push({
    name: "Carbohydrate Hexose Ring",
    description: "A monosaccharide sugar unit.",
    material: glowingCarbMat,
    function: "Energy storage and cell-cell recognition.",
    assemblyOrder: 3,
    connections: ["Lipid Bilayer"],
    failureEffect: "Energy depletion.",
    cascadeFailures: ["Cellular respiration failure"],
    originalPosition: { x: 5, y: 0, z: 0 },
    explodedPosition: { x: 10, y: -5, z: 0 },
    mesh: carbMesh
  });

  const description = "A highly detailed, neon-lit interactive model of the fundamental biomolecules of life: proteins, lipids, and carbohydrates. Featuring glowing bonds and accurate representations of molecular structures.";

  const quizQuestions = [
    {
      question: "Which type of bond primarily holds the secondary structure of a protein like an alpha helix together?",
      options: ["Covalent bond", "Ionic bond", "Hydrogen bond", "Van der Waals forces"],
      correct: 2,
      explanation: "Hydrogen bonds between the backbone amide and carbonyl groups stabilize secondary structures like the alpha helix.",
      difficulty: "Medium"
    },
    {
      question: "The lipid bilayer is composed of molecules that have which characteristic?",
      options: ["Entirely hydrophobic", "Entirely hydrophilic", "Amphipathic (both hydrophilic and hydrophobic)", "Non-polar only"],
      correct: 2,
      explanation: "Phospholipids are amphipathic, meaning they have a hydrophilic head and two hydrophobic tails, allowing them to form a bilayer in an aqueous environment.",
      difficulty: "Easy"
    },
    {
      question: "Carbohydrates are generally composed of carbon, hydrogen, and oxygen in roughly what ratio?",
      options: ["1:1:1", "1:2:1", "2:1:2", "1:3:1"],
      correct: 1,
      explanation: "The basic formula for many carbohydrates is (CH2O)n, representing a 1:2:1 ratio of carbon, hydrogen, and oxygen.",
      difficulty: "Easy"
    }
  ];

  function animate(time, speed, meshes) {
    if (parts[0].mesh) {
      parts[0].mesh.rotation.y = time * speed * 0.5;
      parts[0].mesh.material.emissiveIntensity = 0.5 + Math.sin(time * 3) * 0.3;
    }

    if (parts[1].mesh) {
      const children = parts[1].mesh.children;
      for (let i = 0; i < children.length; i++) {
         const mesh = children[i];
         mesh.position.y += Math.sin(time * speed * 2 + mesh.position.x) * 0.01;
      }
    }

    if (parts[2].mesh) {
      parts[2].mesh.rotation.z = time * speed;
      const scale = 1 + Math.sin(time * speed * 1.5) * 0.1;
      parts[2].mesh.scale.set(scale, scale, scale);
    }
  }

  return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createBiomolecules() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
