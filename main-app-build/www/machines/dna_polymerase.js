import { 
  steel, castIron, aluminum, copper, brass, chrome, darkSteel, titanium, lead,
  rubber, plastic, whitePlastic, ceramic, glass, greenPCB, insulation, carbonFiber,
  redAccent, blueAccent, orangeAccent, yellowAccent, greenAccent, purpleAccent,
  electrolyte, fire, wireCoil, tinted
} from '../utils/materials.js';

export function createDNAPolymerase(THREE) {
  const group = new THREE.Group();
  const parts = [];

  // Helper function to create DNA backbone + bases
  function createDNAStrand(length, startZ, isDouble, color1, color2) {
    const strand = new THREE.Group();
    const radius = 1.2;
    for(let i=0; i<length; i++) {
      const z = startZ + i * 1.5;
      const angle = i * 0.5;
      
      // Backbone 1
      const bb1 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), tinted(whitePlastic, color1));
      bb1.position.set(Math.cos(angle)*radius, Math.sin(angle)*radius, z);
      strand.add(bb1);
      
      // Base 1
      const base1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, radius, 8), tinted(whitePlastic, color1));
      base1.rotation.z = angle;
      base1.position.set(Math.cos(angle)*radius*0.5, Math.sin(angle)*radius*0.5, z);
      strand.add(base1);

      if (isDouble) {
        // Backbone 2
        const bb2 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), tinted(whitePlastic, color2));
        bb2.position.set(Math.cos(angle + Math.PI)*radius, Math.sin(angle + Math.PI)*radius, z);
        strand.add(bb2);
        
        // Base 2
        const base2 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, radius, 8), tinted(whitePlastic, color2));
        base2.rotation.z = angle + Math.PI;
        base2.position.set(Math.cos(angle + Math.PI)*radius*0.5, Math.sin(angle + Math.PI)*radius*0.5, z);
        strand.add(base2);
      }
    }
    return strand;
  }

  // Helper for nucleotide
  function createNucleotide(color) {
    const nuc = new THREE.Group();
    // Base
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.2), tinted(plastic, color));
    base.position.set(0, 0, 0);
    nuc.add(base);
    // Sugar
    const sugar = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.2, 5), whitePlastic);
    sugar.rotation.x = Math.PI / 2;
    sugar.position.set(-0.6, -0.4, 0);
    nuc.add(sugar);
    // Phosphates (3)
    for(let i=0; i<3; i++) {
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), yellowAccent);
      p.position.set(-1.2 - i*0.5, -0.6, 0);
      nuc.add(p);
    }
    return nuc;
  }

  // 1. DNA Polymerase Enzyme (Thumb, Fingers, Palm)
  const polymeraseGroup = new THREE.Group();
  const polyMaterial = tinted(plastic, 0x8a2be2); // Purple protein
  
  // Palm
  const palm = new THREE.Mesh(new THREE.BoxGeometry(6, 5, 5), polyMaterial);
  palm.position.set(0, -2.5, 0);
  polymeraseGroup.add(palm);
  
  // Fingers
  const fingers = new THREE.Mesh(new THREE.CapsuleGeometry(1.5, 4, 16, 16), polyMaterial);
  fingers.position.set(-2, 2, 0);
  fingers.rotation.z = -Math.PI / 8;
  polymeraseGroup.add(fingers);
  
  // Thumb
  const thumb = new THREE.Mesh(new THREE.CapsuleGeometry(1.5, 3, 16, 16), polyMaterial);
  thumb.position.set(2, 1, 0);
  thumb.rotation.z = Math.PI / 8;
  polymeraseGroup.add(thumb);

  polymeraseGroup.position.set(0, 0, 0);
  group.add(polymeraseGroup);
  parts.push({
    name: 'DNA Polymerase Enzyme',
    description: 'The main protein complex responsible for synthesizing DNA. It resembles a right hand with palm, fingers, and thumb domains.',
    material: 'Protein Complex',
    function: 'Catalyzes the addition of nucleotides to the growing DNA strand in the 5\' to 3\' direction.',
    assemblyOrder: 1,
    connections: ['Template DNA Strand', 'Primer Strand', 'Active Site'],
    failureEffect: 'Halts DNA replication entirely.',
    cascadeFailures: ['Cell division failure', 'Apoptosis'],
    originalPosition: polymeraseGroup.position.clone(),
    explodedPosition: new THREE.Vector3(0, 10, 0)
  });

  // 2. Template DNA Strand
  const templateStrand = createDNAStrand(20, -10, false, 0x1E90FF, 0x000000);
  templateStrand.position.set(0, 0, 0);
  group.add(templateStrand);
  parts.push({
    name: 'Template DNA Strand',
    description: 'The original single strand of DNA feeding into the enzyme to be copied.',
    material: 'Nucleic Acid',
    function: 'Provides the sequence template for the newly synthesized DNA strand.',
    assemblyOrder: 2,
    connections: ['DNA Polymerase Enzyme', 'Active Site'],
    failureEffect: 'Mutation or incorrect replication sequence.',
    cascadeFailures: ['Protein misfolding due to wrong genetic code'],
    originalPosition: templateStrand.position.clone(),
    explodedPosition: new THREE.Vector3(0, 0, -15)
  });

  // 3. Primer Strand
  const primerStrand = createDNAStrand(5, -1, true, 0x1E90FF, 0xFF4500); // Only part of double
  // Hide the template part in primer helper, just keep the red part
  const primerOnly = new THREE.Group();
  for(let i=0; i<5; i++) {
    const z = -1 + i * 1.5;
    const angle = i * 0.5 + Math.PI;
    const bb = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), tinted(whitePlastic, 0xFF4500));
    bb.position.set(Math.cos(angle)*1.2, Math.sin(angle)*1.2, z);
    primerOnly.add(bb);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.2, 8), tinted(whitePlastic, 0xFF4500));
    base.rotation.z = angle;
    base.position.set(Math.cos(angle)*0.6, Math.sin(angle)*0.6, z);
    primerOnly.add(base);
  }
  primerOnly.position.set(0, 0, 0);
  group.add(primerOnly);
  parts.push({
    name: 'Primer Strand',
    description: 'A short sequence of RNA or DNA that initiates DNA synthesis.',
    material: 'Nucleic Acid',
    function: 'Provides the necessary 3\'-OH group for DNA polymerase to begin adding nucleotides.',
    assemblyOrder: 3,
    connections: ['Template DNA Strand', 'DNA Polymerase Enzyme'],
    failureEffect: 'Polymerase cannot initiate synthesis.',
    cascadeFailures: ['Replication stall'],
    originalPosition: primerOnly.position.clone(),
    explodedPosition: new THREE.Vector3(5, 5, -5)
  });

  // 4. Newly Synthesized DNA Strand
  const newStrandGroup = new THREE.Group();
  for(let i=5; i<15; i++) {
    const z = -1 + i * 1.5;
    const angle = i * 0.5 + Math.PI;
    const bb = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), tinted(whitePlastic, 0x32CD32));
    bb.position.set(Math.cos(angle)*1.2, Math.sin(angle)*1.2, z);
    newStrandGroup.add(bb);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.2, 8), tinted(whitePlastic, 0x32CD32));
    base.rotation.z = angle;
    base.position.set(Math.cos(angle)*0.6, Math.sin(angle)*0.6, z);
    newStrandGroup.add(base);
  }
  newStrandGroup.position.set(0, 0, 0);
  group.add(newStrandGroup);
  parts.push({
    name: 'Newly Synthesized DNA Strand',
    description: 'The double helix exiting the enzyme, containing one original and one new strand.',
    material: 'Nucleic Acid',
    function: 'Forms the completed genetic copy for cell division.',
    assemblyOrder: 4,
    connections: ['Primer Strand', 'Template DNA Strand'],
    failureEffect: 'Incomplete genetic copy.',
    cascadeFailures: ['Cell cycle arrest'],
    originalPosition: newStrandGroup.position.clone(),
    explodedPosition: new THREE.Vector3(0, -5, 15)
  });

  // 5. Free Nucleotide (dATP)
  const dATP = createNucleotide(0x32CD32); // Green
  dATP.position.set(-6, 4, 3);
  group.add(dATP);
  parts.push({
    name: 'Free Nucleotide (dATP)',
    description: 'A free-floating deoxyadenosine triphosphate waiting to be incorporated.',
    material: 'Organic Molecule',
    function: 'Serves as a building block for the new DNA strand, pairs with Thymine.',
    assemblyOrder: 5,
    connections: ['Active Site'],
    failureEffect: 'Synthesis stalls due to missing building block.',
    cascadeFailures: ['Replication fork collapse'],
    originalPosition: dATP.position.clone(),
    explodedPosition: new THREE.Vector3(-12, 8, 8)
  });

  // 6. Free Nucleotide (dTTP)
  const dTTP = createNucleotide(0xFF4500); // Red
  dTTP.position.set(-8, 2, 6);
  group.add(dTTP);
  parts.push({
    name: 'Free Nucleotide (dTTP)',
    description: 'A free-floating deoxythymidine triphosphate.',
    material: 'Organic Molecule',
    function: 'Building block that pairs with Adenine on the template strand.',
    assemblyOrder: 6,
    connections: ['Active Site'],
    failureEffect: 'Synthesis stalls.',
    cascadeFailures: ['Replication fork collapse'],
    originalPosition: dTTP.position.clone(),
    explodedPosition: new THREE.Vector3(-14, 4, 12)
  });

  // 7. Active Site
  const activeSite = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.4, 16, 32), yellowAccent);
  activeSite.position.set(0, -0.5, 2);
  activeSite.rotation.x = Math.PI / 2;
  group.add(activeSite);
  parts.push({
    name: 'Active Site',
    description: 'The glowing catalytic pocket in the Palm region where the chemical reaction occurs.',
    material: 'Protein Pocket',
    function: 'Catalyzes the phosphodiester bond formation between nucleotides.',
    assemblyOrder: 7,
    connections: ['DNA Polymerase Enzyme', 'Magnesium Ions', 'Free Nucleotide (dATP)'],
    failureEffect: 'Loss of catalytic activity.',
    cascadeFailures: ['No DNA replication'],
    originalPosition: activeSite.position.clone(),
    explodedPosition: new THREE.Vector3(0, -0.5, -5)
  });

  // 8. Magnesium Ions
  const mgGroup = new THREE.Group();
  const mg1 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), tinted(chrome, 0x00FF00));
  mg1.position.set(-0.5, 0, 0);
  const mg2 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), tinted(chrome, 0x00FF00));
  mg2.position.set(0.5, 0, 0);
  mgGroup.add(mg1, mg2);
  mgGroup.position.set(0, -0.5, 2);
  group.add(mgGroup);
  parts.push({
    name: 'Magnesium Ions',
    description: 'Two crucial divalent metal ions located in the active site.',
    material: 'Metal Ions',
    function: 'Stabilize the negative charges on incoming dNTPs and assist in catalysis.',
    assemblyOrder: 8,
    connections: ['Active Site'],
    failureEffect: 'Catalysis cannot occur due to excessive negative charge repulsion.',
    cascadeFailures: ['Enzyme inhibition'],
    originalPosition: mgGroup.position.clone(),
    explodedPosition: new THREE.Vector3(0, 0, 10)
  });

  // 9. Pyrophosphate
  const ppiGroup = new THREE.Group();
  const pp1 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), whitePlastic);
  pp1.position.set(-0.3, 0, 0);
  const pp2 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), whitePlastic);
  pp2.position.set(0.3, 0, 0);
  ppiGroup.add(pp1, pp2);
  ppiGroup.position.set(4, -2, 2);
  group.add(ppiGroup);
  parts.push({
    name: 'Pyrophosphate',
    description: 'The leaving group exiting the enzyme after a nucleotide is incorporated.',
    material: 'Phosphate Compound',
    function: 'Released energy from its cleavage drives the polymerization reaction.',
    assemblyOrder: 9,
    connections: ['Active Site'],
    failureEffect: 'Product inhibition if not cleared from the active site.',
    cascadeFailures: ['Slowing of replication'],
    originalPosition: ppiGroup.position.clone(),
    explodedPosition: new THREE.Vector3(12, -6, 6)
  });

  // 10. Exonuclease Domain
  const exoDomain = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), tinted(plastic, 0xFF1493)); // Deep pink
  exoDomain.position.set(0, -4.5, -2);
  group.add(exoDomain);
  parts.push({
    name: 'Exonuclease Domain',
    description: 'The proofreading pocket located at the bottom of the enzyme.',
    material: 'Protein Domain',
    function: 'Removes incorrectly paired nucleotides in the 3\' to 5\' direction (proofreading).',
    assemblyOrder: 10,
    connections: ['DNA Polymerase Enzyme'],
    failureEffect: 'High mutation rate in the newly synthesized DNA.',
    cascadeFailures: ['Genetic diseases', 'Cancer'],
    originalPosition: exoDomain.position.clone(),
    explodedPosition: new THREE.Vector3(0, -12, -2)
  });

  const description = "DNA Polymerase is an essential molecular machine responsible for replicating DNA. It features a right-hand-like structure containing a palm, fingers, and thumb domain. During replication, it slides along a template strand, correctly matching incoming free nucleotides and adding them to a growing primer strand. Its active site relies on crucial Magnesium ions, and any mismatches are swiftly corrected by its built-in exonuclease (proofreading) domain.";

  const quizQuestions = [
    {
      question: "In what direction does DNA Polymerase synthesize the new DNA strand?",
      options: ["3' to 5'", "5' to 3'", "N-terminus to C-terminus", "Both directions simultaneously"],
      correctIndex: 1,
      explanation: "DNA Polymerase can only add nucleotides to the free 3'-OH end of the growing strand, thus synthesis always proceeds in the 5' to 3' direction.",
      difficulty: "Easy"
    },
    {
      question: "What is the primary role of the Magnesium (Mg2+) ions in the active site?",
      options: ["To provide structural support to the Thumb domain", "To bind the template strand", "To stabilize the negative charges of the nucleotide phosphates", "To cleave the DNA backbone during proofreading"],
      correctIndex: 2,
      explanation: "Mg2+ ions neutralize the highly negative charge of the incoming dNTP's phosphate groups, facilitating the nucleophilic attack required to form the phosphodiester bond.",
      difficulty: "Medium"
    },
    {
      question: "Which domain of the DNA Polymerase is responsible for its 'proofreading' ability?",
      options: ["Fingers Domain", "Palm Domain", "Thumb Domain", "Exonuclease Domain"],
      correctIndex: 3,
      explanation: "The 3' to 5' exonuclease domain can excise incorrectly inserted nucleotides, drastically reducing the error rate of replication.",
      difficulty: "Medium"
    },
    {
      question: "What happens to the two outermost phosphates of an incoming dNTP after it is added to the chain?",
      options: ["They are incorporated into the DNA backbone", "They are released as a Pyrophosphate molecule", "They are bound by the Exonuclease domain", "They attach to the template strand"],
      correctIndex: 1,
      explanation: "The cleavage of these two phosphates as a Pyrophosphate (PPi) provides the energy necessary to drive the DNA synthesis reaction.",
      difficulty: "Easy"
    },
    {
      question: "DNA replication is considered 'semi-conservative' because:",
      options: ["Only half of the DNA is copied at a time", "It frequently conserves energy", "Each new double helix contains one original strand and one newly synthesized strand", "It skips introns during replication"],
      correctIndex: 2,
      explanation: "Semi-conservative means that after replication, every double-stranded DNA molecule consists of one parental (template) strand and one newly synthesized strand.",
      difficulty: "Medium"
    },
    {
      question: "Which widespread laboratory technique fundamentally relies on a heat-stable version of DNA Polymerase (like Taq polymerase)?",
      options: ["Western Blotting", "Polymerase Chain Reaction (PCR)", "Mass Spectrometry", "CRISPR-Cas9 Editing"],
      correctIndex: 1,
      explanation: "PCR uses cyclic temperature changes to amplify DNA, which requires a DNA polymerase that will not denature at the high temperatures used to melt the DNA strands.",
      difficulty: "Easy"
    }
  ];

  let animationTime = 0;

  function animate(time, speed, meshes) {
    animationTime += speed * 0.05;

    // The enzyme "ratchets" slightly
    const polyMesh = meshes.find(m => m.group.name === 'DNA Polymerase Enzyme');
    if (polyMesh) {
      polyMesh.group.rotation.x = Math.sin(animationTime * 2) * 0.05;
    }

    // Template DNA moves slowly
    const templateMesh = meshes.find(m => m.group.name === 'Template DNA Strand');
    if (templateMesh) {
      templateMesh.group.position.z = -10 + (animationTime * 1.5) % 3; // Moves forward and loops a bit to simulate ratcheting
    }
    const primerMesh = meshes.find(m => m.group.name === 'Primer Strand');
    if (primerMesh) {
      primerMesh.group.position.z = (animationTime * 1.5) % 3;
    }
    const newStrandMesh = meshes.find(m => m.group.name === 'Newly Synthesized DNA Strand');
    if (newStrandMesh) {
      newStrandMesh.group.position.z = (animationTime * 1.5) % 3;
    }

    // dATP flies into the active site
    const datpMesh = meshes.find(m => m.group.name === 'Free Nucleotide (dATP)');
    if (datpMesh) {
      const start = new THREE.Vector3(-6, 4, 3);
      const end = new THREE.Vector3(0, -0.5, 2); // Active site
      const t = (animationTime % 4) / 4; // Loop 0 to 1
      if (t < 0.5) {
        // Fly in
        const ease = t * 2;
        datpMesh.group.position.lerpVectors(start, end, ease);
        datpMesh.group.rotation.x = ease * Math.PI * 2;
      } else {
        // Reset and wait
        datpMesh.group.position.copy(start);
      }
    }

    // dTTP floats nearby
    const dttpMesh = meshes.find(m => m.group.name === 'Free Nucleotide (dTTP)');
    if (dttpMesh) {
      dttpMesh.group.position.y = 2 + Math.sin(animationTime * 3) * 0.5;
      dttpMesh.group.rotation.y += 0.02 * speed;
    }

    // Pyrophosphate flies out
    const ppiMesh = meshes.find(m => m.group.name === 'Pyrophosphate');
    if (ppiMesh) {
      const ppiStart = new THREE.Vector3(0, -0.5, 2); // Active site
      const ppiEnd = new THREE.Vector3(6, -4, 4);
      const t = (animationTime % 4) / 4;
      if (t > 0.5) {
        // Fly out
        const ease = (t - 0.5) * 2;
        ppiMesh.group.position.lerpVectors(ppiStart, ppiEnd, ease);
        ppiMesh.group.rotation.z += 0.1 * speed;
      } else {
        ppiMesh.group.position.copy(ppiStart);
        ppiMesh.group.visible = false;
      }
      if (t > 0.5 && t < 0.9) ppiMesh.group.visible = true;
      else ppiMesh.group.visible = false;
    }
    
    // Active site pulsates
    const activeSiteMesh = meshes.find(m => m.group.name === 'Active Site');
    if (activeSiteMesh) {
      const scale = 1 + Math.sin(animationTime * 5) * 0.1;
      activeSiteMesh.group.scale.set(scale, scale, scale);
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
