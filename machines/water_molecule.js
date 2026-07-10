import {
  steel, castIron, aluminum, copper, brass, chrome, darkSteel, titanium, lead,
  rubber, plastic, whitePlastic, ceramic, glass, greenPCB, insulation, carbonFiber,
  redAccent, blueAccent, orangeAccent, yellowAccent, greenAccent, purpleAccent,
  electrolyte, fire, wireCoil, tinted
} from '../utils/materials.js';

export function createWaterMolecule(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Materials for clouds and charges
    const oxygenCloudMat = tinted(glass, 0xff5555);
    const hydrogenCloudMat = tinted(glass, 0xdddddd);
    const deltaMinusMat = tinted(electrolyte, 0xff2222);
    const deltaPlusMat = tinted(electrolyte, 0x2222ff);
    
    // Shared geometries
    const bondGeo = new THREE.CylinderGeometry(0.12, 0.12, 2, 16);
    bondGeo.rotateX(Math.PI / 2); // Align to Z-axis for lookAt
    
    // --- Part 1: Oxygen Atom Core ---
    const oCoreGroup = new THREE.Group();
    const oCoreMesh = new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 32), redAccent);
    oCoreGroup.add(oCoreMesh);
    
    const orbit1 = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.02, 16, 64), chrome);
    orbit1.rotation.x = Math.PI / 3;
    oCoreGroup.add(orbit1);
    
    const orbit2 = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.02, 16, 64), chrome);
    orbit2.rotation.y = Math.PI / 3;
    oCoreGroup.add(orbit2);
    
    group.add(oCoreGroup);
    parts.push({
        name: "Oxygen Atom Core",
        description: "The nucleus and inner electron shells of the oxygen atom. Shown with abstract orbital paths.",
        material: "Red Accent with Chrome Orbits",
        function: "Provides the strong positive nuclear charge that attracts shared electrons.",
        assemblyOrder: 1,
        connections: ["Covalent Bond 1", "Covalent Bond 2", "Oxygen Electron Cloud"],
        failureEffect: "Loss of core destroys the atomic structure completely.",
        cascadeFailures: ["Complete molecular dissociation"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(0, 2, 0),
        group: oCoreGroup
    });

    // --- Part 2: Hydrogen Atom 1 Core ---
    const h1CoreGroup = new THREE.Group();
    const h1CoreMesh = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), whitePlastic);
    h1CoreGroup.add(h1CoreMesh);
    
    const h1Orbit = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.015, 16, 64), chrome);
    h1Orbit.rotation.x = Math.PI / 4;
    h1CoreGroup.add(h1Orbit);
    
    h1CoreGroup.position.set(1.58, -1.22, 0);
    group.add(h1CoreGroup);
    parts.push({
        name: "Hydrogen Atom 1 Core",
        description: "The single proton acting as the nucleus of the first hydrogen atom, with its orbital path.",
        material: "White Plastic and Chrome",
        function: "Shares an electron with oxygen to complete a stable electron configuration.",
        assemblyOrder: 2,
        connections: ["Covalent Bond 1", "Hydrogen 1 Electron Cloud"],
        failureEffect: "Molecule becomes a highly reactive hydroxyl radical (OH).",
        cascadeFailures: ["High reactivity", "Loss of stable structure"],
        originalPosition: new THREE.Vector3(1.58, -1.22, 0),
        explodedPosition: new THREE.Vector3(3.16, -2.44, 0),
        group: h1CoreGroup
    });

    // --- Part 3: Hydrogen Atom 2 Core ---
    const h2CoreGroup = new THREE.Group();
    const h2CoreMesh = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), whitePlastic);
    h2CoreGroup.add(h2CoreMesh);
    
    const h2Orbit = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.015, 16, 64), chrome);
    h2Orbit.rotation.y = Math.PI / 4;
    h2CoreGroup.add(h2Orbit);
    
    h2CoreGroup.position.set(-1.58, -1.22, 0);
    group.add(h2CoreGroup);
    parts.push({
        name: "Hydrogen Atom 2 Core",
        description: "The single proton acting as the nucleus of the second hydrogen atom.",
        material: "White Plastic and Chrome",
        function: "Provides the second hydrogen necessary for the molecule's unique V-shape.",
        assemblyOrder: 3,
        connections: ["Covalent Bond 2", "Hydrogen 2 Electron Cloud"],
        failureEffect: "Molecule becomes a hydroxyl radical.",
        cascadeFailures: ["Loss of symmetry", "Chemical instability"],
        originalPosition: new THREE.Vector3(-1.58, -1.22, 0),
        explodedPosition: new THREE.Vector3(-3.16, -2.44, 0),
        group: h2CoreGroup
    });

    // --- Part 4: Covalent Bond 1 ---
    const buildBond = (x, y, lookX, lookY) => {
        const bondGroup = new THREE.Group();
        const bondMesh = new THREE.Mesh(bondGeo, plastic);
        bondGroup.add(bondMesh);
        
        const electron1 = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), yellowAccent);
        electron1.position.set(0, 0, 0.2); 
        const electron2 = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), yellowAccent);
        electron2.position.set(0, 0, -0.2);
        
        bondGroup.add(electron1);
        bondGroup.add(electron2);
        
        bondGroup.position.set(x, y, 0);
        bondGroup.lookAt(lookX, lookY, 0);
        return bondGroup;
    };

    const bond1Group = buildBond(0.79, -0.61, 1.58, -1.22);
    group.add(bond1Group);
    parts.push({
        name: "Covalent Bond 1",
        description: "A pair of shared electrons connecting the oxygen atom to the first hydrogen atom.",
        material: "Plastic with Yellow Accent Electrons",
        function: "Holds the atoms together to maintain the structural integrity of the molecule.",
        assemblyOrder: 4,
        connections: ["Oxygen Atom Core", "Hydrogen Atom 1 Core"],
        failureEffect: "Bond cleavage releases a hydrogen atom.",
        cascadeFailures: ["Formation of ions", "Radical chain reactions"],
        originalPosition: new THREE.Vector3(0.79, -0.61, 0),
        explodedPosition: new THREE.Vector3(2, -0.5, 0),
        group: bond1Group
    });

    // --- Part 5: Covalent Bond 2 ---
    const bond2Group = buildBond(-0.79, -0.61, -1.58, -1.22);
    group.add(bond2Group);
    parts.push({
        name: "Covalent Bond 2",
        description: "A pair of shared electrons connecting the oxygen atom to the second hydrogen atom.",
        material: "Plastic with Yellow Accent Electrons",
        function: "Completes the stable octet configuration for oxygen in combination with Bond 1.",
        assemblyOrder: 5,
        connections: ["Oxygen Atom Core", "Hydrogen Atom 2 Core"],
        failureEffect: "Bond cleavage breaks the molecule.",
        cascadeFailures: ["Molecular degradation"],
        originalPosition: new THREE.Vector3(-0.79, -0.61, 0),
        explodedPosition: new THREE.Vector3(-2, -0.5, 0),
        group: bond2Group
    });

    // --- Part 6: Oxygen Electron Cloud ---
    const oCloudGroup = new THREE.Group();
    const oCloudMesh = new THREE.Mesh(new THREE.SphereGeometry(1.3, 32, 32), oxygenCloudMat);
    oCloudGroup.add(oCloudMesh);
    group.add(oCloudGroup);
    parts.push({
        name: "Oxygen Electron Cloud",
        description: "The probability distribution of oxygen's valence electrons, forming a large envelope.",
        material: "Transparent Red (Glass)",
        function: "Determines atomic radius and repels bonded pairs to create the ~104.5 degree bond angle.",
        assemblyOrder: 6,
        connections: ["Oxygen Atom Core"],
        failureEffect: "Loss of electrons causes extreme ionization.",
        cascadeFailures: ["Loss of chemical identity", "Destruction of bonds"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(0, 2, -2),
        group: oCloudGroup
    });

    // --- Part 7: Hydrogen 1 Electron Cloud ---
    const h1CloudGroup = new THREE.Group();
    const h1CloudMesh = new THREE.Mesh(new THREE.SphereGeometry(0.85, 32, 32), hydrogenCloudMat);
    h1CloudGroup.add(h1CloudMesh);
    h1CloudGroup.position.set(1.58, -1.22, 0);
    group.add(h1CloudGroup);
    parts.push({
        name: "Hydrogen 1 Electron Cloud",
        description: "The probability envelope of the shared electron near the first hydrogen atom.",
        material: "Transparent White (Glass)",
        function: "Defines the effective size of the bonded hydrogen atom.",
        assemblyOrder: 7,
        connections: ["Hydrogen Atom 1 Core"],
        failureEffect: "Loss of density exposes the proton entirely.",
        cascadeFailures: ["Proton transfer (acidity)"],
        originalPosition: new THREE.Vector3(1.58, -1.22, 0),
        explodedPosition: new THREE.Vector3(3.16, -2.44, 2),
        group: h1CloudGroup
    });

    // --- Part 8: Hydrogen 2 Electron Cloud ---
    const h2CloudGroup = new THREE.Group();
    const h2CloudMesh = new THREE.Mesh(new THREE.SphereGeometry(0.85, 32, 32), hydrogenCloudMat);
    h2CloudGroup.add(h2CloudMesh);
    h2CloudGroup.position.set(-1.58, -1.22, 0);
    group.add(h2CloudGroup);
    parts.push({
        name: "Hydrogen 2 Electron Cloud",
        description: "The probability envelope of the shared electron near the second hydrogen atom.",
        material: "Transparent White (Glass)",
        function: "Maintains the covalent bond stability on the second axis.",
        assemblyOrder: 8,
        connections: ["Hydrogen Atom 2 Core"],
        failureEffect: "Exposed proton leads to unintended reactions.",
        cascadeFailures: ["Cross-reactions", "Molecular instability"],
        originalPosition: new THREE.Vector3(-1.58, -1.22, 0),
        explodedPosition: new THREE.Vector3(-3.16, -2.44, 2),
        group: h2CloudGroup
    });

    // --- Part 9: Partial Negative Charge Region ---
    const negChargeGroup = new THREE.Group();
    const negGlow = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), deltaMinusMat);
    const minusSign = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 0.1), whitePlastic);
    minusSign.position.z = 0.4;
    negChargeGroup.add(negGlow);
    negChargeGroup.add(minusSign);
    negChargeGroup.position.set(0, 1.4, 0);
    group.add(negChargeGroup);
    parts.push({
        name: "Partial Negative Charge Region",
        description: "A visual marker indicating high electron density (delta minus) driven by oxygen's electronegativity.",
        material: "Glowing Red (Electrolyte) and White Plastic",
        function: "Acts as an electrical dipole pole, attracting positive ends of other molecules.",
        assemblyOrder: 9,
        connections: ["Oxygen Electron Cloud"],
        failureEffect: "Loss of polarity prevents hydrogen bond formation.",
        cascadeFailures: ["Water loses its unique solvent properties"],
        originalPosition: new THREE.Vector3(0, 1.4, 0),
        explodedPosition: new THREE.Vector3(0, 4.0, 0),
        group: negChargeGroup
    });

    // --- Part 10: Partial Positive Charge Region ---
    const posChargeGroup = new THREE.Group();
    const buildPlus = (x, y) => {
        const g = new THREE.Group();
        const glow = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), deltaPlusMat);
        const bar1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.08), whitePlastic);
        const bar2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.3, 0.08), whitePlastic);
        bar1.position.z = 0.3;
        bar2.position.z = 0.3;
        g.add(glow);
        g.add(bar1);
        g.add(bar2);
        g.position.set(x, y, 0);
        return g;
    };
    posChargeGroup.add(buildPlus(1.9, -1.6));
    posChargeGroup.add(buildPlus(-1.9, -1.6));
    group.add(posChargeGroup);
    parts.push({
        name: "Partial Positive Charge Region",
        description: "Markers indicating reduced electron density (delta plus) near the hydrogen nuclei.",
        material: "Glowing Blue (Electrolyte) and White Plastic",
        function: "Forms the positive poles of the molecule, essential for hydrogen bonding.",
        assemblyOrder: 10,
        connections: ["Hydrogen 1 Electron Cloud", "Hydrogen 2 Electron Cloud"],
        failureEffect: "Inability to form hydrogen bonds with electronegative atoms.",
        cascadeFailures: ["Lower boiling point", "Loss of surface tension"],
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(0, -2, 0),
        group: posChargeGroup
    });

    const description = "A detailed interactive 3D model of a Water Molecule (H2O). The model highlights the oxygen and hydrogen atoms, their covalent bonds, the electron cloud distribution, and the resulting dipole regions (partial charges) that give water its unique properties such as a 104.5-degree bond angle, hydrogen bonding capability, and its status as the universal solvent.";

    const quizQuestions = [
        {
            question: "What is the approximate bond angle between the two hydrogen atoms in a water molecule?",
            options: ["90 degrees", "104.5 degrees", "109.5 degrees", "180 degrees"],
            correctAnswer: 1,
            explanation: "Due to the repulsion from oxygen's two lone pairs of electrons, the ideal tetrahedral angle of 109.5 is compressed to approximately 104.5 degrees.",
            difficulty: "Medium"
        },
        {
            question: "Why does the water molecule have a permanent dipole moment?",
            options: ["It has a linear shape", "Hydrogen is more electronegative than oxygen", "Oxygen is more electronegative and the molecule is bent", "It contains ionic bonds"],
            correctAnswer: 2,
            explanation: "Oxygen pulls electron density towards itself, and the bent shape means the partial charges do not cancel out, creating a permanent dipole.",
            difficulty: "Medium"
        },
        {
            question: "Which physical property of water is primarily responsible for its ability to form hydrogen bonds with other water molecules?",
            options: ["Its low molar mass", "Its partial electrical charges", "Its transparency", "Its covalent bonds"],
            correctAnswer: 1,
            explanation: "The partial positive charge on hydrogen and partial negative charge on oxygen attract each other, forming hydrogen bonds.",
            difficulty: "Easy"
        },
        {
            question: "Water has a very high specific heat capacity. What does this mean in practical terms?",
            options: ["It boils at a low temperature", "It takes a lot of energy to change its temperature", "It freezes extremely quickly", "It is an excellent conductor of electricity"],
            correctAnswer: 1,
            explanation: "A high specific heat capacity means water can absorb a lot of heat without a significant rise in temperature, stabilizing Earth's climate.",
            difficulty: "Easy"
        },
        {
            question: "Why is water often called the 'universal solvent'?",
            options: ["It dissolves all known chemicals", "Its polarity allows it to dissolve many ionic and polar substances", "It is highly acidic", "It is abundant on Earth"],
            correctAnswer: 1,
            explanation: "Water's strong dipole allows it to surround and dissolve many other polar molecules and ionic compounds.",
            difficulty: "Easy"
        },
        {
            question: "Unlike most substances, water is less dense as a solid (ice) than as a liquid. What causes this?",
            options: ["Covalent bonds break when freezing", "Hydrogen bonds form a rigid, open crystalline structure", "Ice molecules shrink", "Air gets trapped in the ice"],
            correctAnswer: 1,
            explanation: "When water freezes, hydrogen bonds force the molecules into a spacious hexagonal lattice, making ice less dense than liquid water.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // High frequency jiggling to simulate thermal energy
        const freq = time * 20 * speed;
        const amp = 0.05;
        
        meshes.forEach((mesh, index) => {
            const group = mesh.group;
            if (!group.userData) group.userData = {};
            if (!group.userData.originalPos) {
                group.userData.originalPos = group.position.clone();
            }
            if (!group.userData.originalRot) {
                group.userData.originalRot = group.rotation.clone();
            }
            
            // Apply slight random-looking vibration based on time and index
            group.position.x = group.userData.originalPos.x + Math.sin(freq + index * 1.1) * amp;
            group.position.y = group.userData.originalPos.y + Math.cos(freq * 1.3 + index * 0.8) * amp;
            group.position.z = group.userData.originalPos.z + Math.sin(freq * 1.7 + index * 1.5) * amp;
            
            // Add a very subtle rotational vibration
            group.rotation.x = group.userData.originalRot.x + Math.sin(freq * 0.8 + index) * 0.02;
            group.rotation.y = group.userData.originalRot.y + Math.cos(freq * 0.9 + index) * 0.02;
            group.rotation.z = group.userData.originalRot.z + Math.sin(freq * 0.7 + index) * 0.02;
        });
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

export { createWaterMolecule as create };
