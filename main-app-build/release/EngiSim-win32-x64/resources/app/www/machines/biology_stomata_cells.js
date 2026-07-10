import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const glowingWaterMat = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        side: THREE.DoubleSide
    });

    const guardCellMat = new THREE.MeshPhysicalMaterial({
        color: 0x22cc44,
        emissive: 0x004411,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.9,
        roughness: 0.3,
        metalness: 0.1,
        clearcoat: 0.5
    });
    
    const co2GasMat = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.6
    });

    const o2GasMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.6
    });

    // Guard Cells (Left and Right)
    const guardCellGeometry = new THREE.CapsuleGeometry(1, 3, 16, 32);

    const leftGuardCell = new THREE.Mesh(guardCellGeometry, guardCellMat);
    leftGuardCell.position.set(-1.2, 0, 0);
    leftGuardCell.rotation.z = -Math.PI / 8;
    group.add(leftGuardCell);

    const rightGuardCell = new THREE.Mesh(guardCellGeometry, guardCellMat);
    rightGuardCell.position.set(1.2, 0, 0);
    rightGuardCell.rotation.z = Math.PI / 8;
    group.add(rightGuardCell);

    // Glowing vacuole inside the guard cells (Water filling up)
    const vacuoleGeometry = new THREE.CapsuleGeometry(0.7, 2.5, 16, 32);
    const leftVacuole = new THREE.Mesh(vacuoleGeometry, glowingWaterMat);
    leftGuardCell.add(leftVacuole); 

    const rightVacuole = new THREE.Mesh(vacuoleGeometry, glowingWaterMat);
    rightGuardCell.add(rightVacuole);

    parts.push({
        name: "Left Guard Cell",
        description: "Specialized epidermal cell that controls the opening and closing of the stomatal pore.",
        material: "Biomechanical Membrane",
        function: "Swells with water (turgor pressure) to bow outward and open the stomatal pore for gas exchange.",
        assemblyOrder: 1,
        connections: ["Right Guard Cell", "Epidermis", "Stomatal Pore"],
        failureEffect: "Loss of turgor pressure regulation, leading to permanent closure or uncontrolled water loss.",
        cascadeFailures: ["Photosynthesis halted", "Plant wilting"],
        originalPosition: { x: -1.2, y: 0, z: 0 },
        explodedPosition: { x: -4, y: 2, z: 0 },
        mesh: leftGuardCell
    });

    parts.push({
        name: "Right Guard Cell",
        description: "Specialized epidermal cell that controls the opening and closing of the stomatal pore.",
        material: "Biomechanical Membrane",
        function: "Works in tandem with the left guard cell to regulate the pore aperture.",
        assemblyOrder: 2,
        connections: ["Left Guard Cell", "Epidermis", "Stomatal Pore"],
        failureEffect: "Asymmetrical opening, reduced gas exchange efficiency.",
        cascadeFailures: ["Impaired CO2 uptake", "Reduced growth"],
        originalPosition: { x: 1.2, y: 0, z: 0 },
        explodedPosition: { x: 4, y: 2, z: 0 },
        mesh: rightGuardCell
    });

    // Sub-cellular structures (Chloroplasts, to make it high tech)
    const chloroplastGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const chloroplastMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 1.0 });
    
    const chloroplastsLeft = new THREE.Group();
    for(let i=0; i<5; i++) {
        const c = new THREE.Mesh(chloroplastGeometry, chloroplastMat);
        c.position.set(Math.sin(i)*0.6, Math.cos(i)*1.5, Math.sin(i*2)*0.6);
        chloroplastsLeft.add(c);
    }
    leftGuardCell.add(chloroplastsLeft);

    const chloroplastsRight = new THREE.Group();
    for(let i=0; i<5; i++) {
        const c = new THREE.Mesh(chloroplastGeometry, chloroplastMat);
        c.position.set(Math.sin(i)*0.6, Math.cos(i)*1.5, Math.sin(i*2)*0.6);
        chloroplastsRight.add(c);
    }
    rightGuardCell.add(chloroplastsRight);

    parts.push({
        name: "Chloroplast Matrix",
        description: "Photosynthetic organelles within the guard cells.",
        material: "Energy-Converting Nanostructures",
        function: "Generates ATP and drives the ion pumps needed to draw water into the vacuoles.",
        assemblyOrder: 3,
        connections: ["Guard Cells"],
        failureEffect: "Inability to produce energy for ion transport, preventing stomatal opening.",
        cascadeFailures: ["Stomatal closure in light", "Starvation"],
        originalPosition: { x: 0, y: 0, z: 0 }, 
        explodedPosition: { x: -6, y: -2, z: 2 },
        mesh: chloroplastsLeft 
    });

    // The Pore itself (visualized as a glowing ring or field)
    const poreGeometry = new THREE.TorusGeometry(0.8, 0.1, 16, 64);
    const poreMat = new THREE.MeshPhysicalMaterial({
        color: 0xffd700,
        emissive: 0xffaa00,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.5
    });
    const stomatalPore = new THREE.Mesh(poreGeometry, poreMat);
    stomatalPore.rotation.x = Math.PI / 2;
    stomatalPore.scale.set(0.1, 1, 0.1);
    group.add(stomatalPore);

    parts.push({
        name: "Stomatal Pore",
        description: "The adjustable opening between the two guard cells.",
        material: "Gaseous Interface",
        function: "Serves as the primary pathway for CO2 intake and O2/H2O vapor expulsion.",
        assemblyOrder: 4,
        connections: ["Left Guard Cell", "Right Guard Cell", "Atmosphere", "Mesophyll Space"],
        failureEffect: "If blocked or permanently closed, gas exchange ceases.",
        cascadeFailures: ["Photosynthesis ceases", "Thermal regulation fails"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -4 },
        mesh: stomatalPore
    });

    // Gas Particles (CO2 going in, O2/H2O going out)
    const co2Group = new THREE.Group();
    const o2Group = new THREE.Group();
    group.add(co2Group);
    group.add(o2Group);
    
    const particleGeo = new THREE.SphereGeometry(0.15, 8, 8);
    for(let i=0; i<10; i++) {
        const co2 = new THREE.Mesh(particleGeo, co2GasMat);
        co2.position.set((Math.random()-0.5)*2, 4 + Math.random()*2, (Math.random()-0.5)*2);
        co2.userData = { offset: Math.random() * Math.PI * 2, speed: 0.02 + Math.random()*0.02, phase: 'in' };
        co2Group.add(co2);

        const o2 = new THREE.Mesh(particleGeo, o2GasMat);
        o2.position.set((Math.random()-0.5)*2, -4 - Math.random()*2, (Math.random()-0.5)*2);
        o2.userData = { offset: Math.random() * Math.PI * 2, speed: 0.02 + Math.random()*0.02, phase: 'out' };
        o2Group.add(o2);
    }

    const description = "The Plant Stomata is a high-tech biomechanical gas exchange valve. Guard cells actively regulate turgor pressure using ion pumps and glowing water vacuoles to bow outward, opening the neon stomatal pore. This allows crucial CO2 to enter the leaf matrix while O2 and water vapor are expelled.";

    const quizQuestions = [
        {
            question: "What primary mechanism causes the guard cells to bow outward and open the stomatal pore?",
            options: [
                "Mechanical motors pulling them apart",
                "Increase in turgor pressure from water entering the vacuoles",
                "Thermal expansion of the cell walls",
                "Pneumatic pressure from CO2 buildup"
            ],
            correct: 1,
            explanation: "Guard cells actively pump ions (like potassium) inside, causing water to follow via osmosis. The resulting high turgor pressure causes the cells to swell and bow outward due to their thickened inner walls.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary function of the stomatal pore in this biomechanical system?",
            options: [
                "To absorb light for photosynthesis",
                "To structural support the leaf epidermis",
                "To serve as a pathway for gas exchange (CO2 intake, O2/H2O expulsion)",
                "To secrete defensive toxins"
            ],
            correct: 2,
            explanation: "The stomatal pore is the crucial gateway that allows carbon dioxide to enter for photosynthesis, while letting out oxygen and water vapor (transpiration).",
            difficulty: "Easy"
        },
        {
            question: "Why do guard cells contain chloroplasts while most other epidermal cells do not?",
            options: [
                "To make the leaf surface entirely green",
                "To synthesize structural proteins for the cell wall",
                "To generate ATP (energy) needed to drive the ion pumps for stomatal regulation",
                "To store excess water"
            ],
            correct: 2,
            explanation: "Chloroplasts in guard cells provide the ATP necessary for the active transport of ions (like K+ and Cl-) across the cell membrane, which drives the osmotic flow of water to regulate pore size.",
            difficulty: "Hard"
        }
    ];

    let animationPhase = 0; 

    function animate(time, speed, meshes) {
        animationPhase += speed * 0.02;
        
        // Swelling and un-swelling of the guard cells (Turgor pressure cycle)
        const swellFactor = (Math.sin(animationPhase) + 1) / 2; // 0 to 1
        
        // Adjust the guard cell bowing
        leftGuardCell.rotation.z = -Math.PI / 8 - swellFactor * (Math.PI / 8);
        leftGuardCell.position.x = -1.2 - swellFactor * 0.5;
        
        rightGuardCell.rotation.z = Math.PI / 8 + swellFactor * (Math.PI / 8);
        rightGuardCell.position.x = 1.2 + swellFactor * 0.5;

        // Swell vacuoles
        leftVacuole.scale.set(1 + swellFactor*0.5, 1 + swellFactor*0.2, 1 + swellFactor*0.5);
        rightVacuole.scale.set(1 + swellFactor*0.5, 1 + swellFactor*0.2, 1 + swellFactor*0.5);
        leftVacuole.material.emissiveIntensity = 1.0 + swellFactor * 2.0;
        rightVacuole.material.emissiveIntensity = 1.0 + swellFactor * 2.0;

        // Open the pore
        const poreOpenness = 0.1 + swellFactor * 0.9; // 0.1 to 1.0
        stomatalPore.scale.set(poreOpenness, 1, Math.max(0.1, poreOpenness * 2.0));
        stomatalPore.material.emissiveIntensity = 1.0 + swellFactor * 2.0;

        // Animate particles only when pore is mostly open
        const isPoreOpen = swellFactor > 0.5;
        
        co2Group.children.forEach((co2) => {
            if(isPoreOpen) {
                co2.position.y -= co2.userData.speed * speed * 20;
                if(co2.position.y < -4) co2.position.y = 4 + Math.random() * 2;
                co2.visible = true;
            } else {
                co2.visible = false;
            }
        });

        o2Group.children.forEach((o2) => {
            if(isPoreOpen) {
                o2.position.y += o2.userData.speed * speed * 20;
                if(o2.position.y > 4) o2.position.y = -4 - Math.random() * 2;
                o2.visible = true;
            } else {
                o2.visible = false;
            }
        });

        // Spin chloroplasts gently
        chloroplastsLeft.rotation.y = time * 0.001 * speed;
        chloroplastsRight.rotation.y = -time * 0.001 * speed;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createStomataCells() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
