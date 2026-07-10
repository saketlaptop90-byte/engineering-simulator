import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom high-tech glowing materials
    const neonBlue = new THREE.MeshPhysicalMaterial({
        color: 0x00f0ff,
        emissive: 0x0088ff,
        emissiveIntensity: 1.5,
        metalness: 0.8,
        roughness: 0.1,
        clearcoat: 1.0,
        transparent: true,
        opacity: 0.9
    });

    const neonOrange = new THREE.MeshPhysicalMaterial({
        color: 0xff8800,
        emissive: 0xff4400,
        emissiveIntensity: 1.2,
        metalness: 0.6,
        roughness: 0.2
    });

    const holoGlass = new THREE.MeshPhysicalMaterial({
        color: 0xe0f7fa,
        transmission: 0.9,
        opacity: 1,
        metalness: 0.1,
        roughness: 0,
        ior: 1.5,
        thickness: 0.1,
        emissive: 0x00f0ff,
        emissiveIntensity: 0.2
    });

    const meshesObj = {};

    const addPart = (name, mesh, data) => {
        mesh.name = name;
        mesh.position.set(data.originalPosition.x, data.originalPosition.y, data.originalPosition.z);
        
        parts.push({
            name,
            mesh,
            ...data
        });
        
        group.add(mesh);
        meshesObj[name] = mesh;
    };

    // 1. Housing
    const casingMesh = new THREE.Group();
    const outerWall = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 1.2, 64, 1, true), darkSteel);
    const backWall = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 0.1, 64), darkSteel);
    backWall.position.y = -0.55;
    backWall.rotation.x = Math.PI / 2;
    outerWall.rotation.x = Math.PI / 2;
    casingMesh.add(outerWall);
    casingMesh.add(backWall);

    addPart('Housing', casingMesh, {
        description: "Heavy-duty protective casing housing the sensitive barometric components.",
        material: "Dark Steel / Chrome",
        function: "Protects internal components from dust, moisture, and mechanical damage.",
        assemblyOrder: 1,
        connections: ["Dial Face", "Linkage Assembly"],
        failureEffect: "Exposure of sensitive internals to environmental hazards.",
        cascadeFailures: ["Calibration drift due to dust", "Corrosion of linkage components"],
        originalPosition: { x: 0, y: 0, z: -0.6 },
        explodedPosition: { x: 0, y: 0, z: -3.0 }
    });

    // 2. Aneroid Cell
    const cellGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        let yOffset = -0.15 + i * 0.1;
        let ring = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.05, 16, 32), copper);
        ring.rotation.x = Math.PI / 2;
        ring.position.z = yOffset;
        cellGroup.add(ring);
        if(i < 3) {
            let core = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.1, 32), copper);
            core.rotation.x = Math.PI / 2;
            core.position.z = yOffset + 0.05;
            cellGroup.add(core);
        }
    }
    const cellTop = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.78, 0.05, 32), copper);
    cellTop.rotation.x = Math.PI / 2;
    cellTop.position.z = 0.2;
    cellGroup.add(cellTop);
    
    const cellBottom = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.78, 0.05, 32), copper);
    cellBottom.rotation.x = Math.PI / 2;
    cellBottom.position.z = -0.2;
    cellGroup.add(cellBottom);

    addPart('Aneroid Cell', cellGroup, {
        description: "A partially evacuated, corrugated metal capsule that expands and contracts with changes in atmospheric pressure.",
        material: "Beryllium Copper",
        function: "Acts as the primary pressure sensor. Expands when atmospheric pressure drops, contracts when it rises.",
        assemblyOrder: 2,
        connections: ["Housing", "Leaf Spring"],
        failureEffect: "Complete failure of pressure measurement.",
        cascadeFailures: ["Inaccurate readings across all connected linkages", "Pointer stuck in fixed position"],
        originalPosition: { x: 0, y: -0.5, z: -0.2 },
        explodedPosition: { x: 0, y: -1.5, z: -1.5 }
    });

    // 3. Leaf Spring
    const springGeo = new THREE.BoxGeometry(0.2, 1.8, 0.05);
    const springMesh = new THREE.Mesh(springGeo, steel);
    springMesh.rotation.z = Math.PI / 2;
    addPart('Leaf Spring', springMesh, {
        description: "A strong steel spring preventing the aneroid cell from collapsing under atmospheric pressure.",
        material: "High-Carbon Steel",
        function: "Counterbalances the atmospheric pressure pushing on the evacuated cell.",
        assemblyOrder: 3,
        connections: ["Aneroid Cell", "Linkage Mechanism"],
        failureEffect: "Cell collapses entirely under external pressure.",
        cascadeFailures: ["Rupture of aneroid cell", "Irreversible linkage damage"],
        originalPosition: { x: 0, y: -0.5, z: 0.05 },
        explodedPosition: { x: 0, y: -0.5, z: -0.5 }
    });

    // 4. Linkage Mechanism
    const linkageGroup = new THREE.Group();
    const leverGeo = new THREE.BoxGeometry(0.1, 1.2, 0.05);
    const lever = new THREE.Mesh(leverGeo, aluminum);
    lever.position.y = 0.6;
    linkageGroup.add(lever);

    const pivot = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), neonBlue);
    pivot.position.y = 0;
    linkageGroup.add(pivot);

    addPart('Linkage Mechanism', linkageGroup, {
        description: "Mechanical levers and pivots that amplify the tiny movements of the aneroid cell.",
        material: "Aluminum / Neon Accents",
        function: "Amplifies linear expansion/contraction and transmits it to the gear mechanism.",
        assemblyOrder: 4,
        connections: ["Leaf Spring", "Sector Gear"],
        failureEffect: "Loss of signal amplification.",
        cascadeFailures: ["Unresponsive pointer", "Non-linear pressure readings"],
        originalPosition: { x: 0, y: -0.5, z: 0.15 },
        explodedPosition: { x: 0, y: 0.5, z: 0.5 }
    });

    // 5. Sector Gear
    const sectorGroup = new THREE.Group();
    const sectorGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.05, 32, 1, false, 0, Math.PI / 3);
    const sectorMesh = new THREE.Mesh(sectorGeo, chrome);
    sectorMesh.position.x = -0.25;
    sectorGroup.add(sectorMesh);

    const hairspringGeo = new THREE.TorusGeometry(0.2, 0.01, 16, 64);
    const hairspring = new THREE.Mesh(hairspringGeo, neonOrange);
    hairspring.rotation.x = Math.PI/2;
    hairspring.scale.set(1, 1, 0.2); 
    sectorGroup.add(hairspring);

    addPart('Sector Gear', sectorGroup, {
        description: "A specialized gear segment coupled with a hairspring to eliminate backlash.",
        material: "Chrome Plated Brass",
        function: "Translates the amplified linear motion into rotational motion to turn the pinion.",
        assemblyOrder: 5,
        connections: ["Linkage Mechanism", "Indicator Pointer"],
        failureEffect: "Sluggish or jumping pointer movement.",
        cascadeFailures: ["Gear tooth wear", "Hysteresis in measurements"],
        originalPosition: { x: 0, y: 0.5, z: 0.25 },
        explodedPosition: { x: -1.0, y: 1.0, z: 1.5 }
    });

    // 6. Indicator Pointer
    const pointerGroup = new THREE.Group();
    const pinionGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 16);
    const pinion = new THREE.Mesh(pinionGeo, darkSteel);
    pinion.rotation.x = Math.PI / 2;
    pointerGroup.add(pinion);

    const needleGeo = new THREE.ConeGeometry(0.05, 1.8, 16);
    needleGeo.translate(0, 0.9, 0);
    const needle = new THREE.Mesh(needleGeo, neonOrange);
    pointerGroup.add(needle);

    const capGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const cap = new THREE.Mesh(capGeo, chrome);
    pointerGroup.add(cap);

    addPart('Indicator Pointer', pointerGroup, {
        description: "A balanced, ultra-lightweight needle that sweeps across the dial face.",
        material: "Carbon Fiber / Neon Emitter",
        function: "Provides the visual readout of the atmospheric pressure.",
        assemblyOrder: 6,
        connections: ["Sector Gear"],
        failureEffect: "Inability to read pressure.",
        cascadeFailures: ["Friction on dial face if bent", "Imbalanced reading due to vibration"],
        originalPosition: { x: 0, y: 0, z: 0.4 },
        explodedPosition: { x: 0, y: 0, z: 2.5 }
    });

    // 7. Dial Face
    const dialFaceGeo = new THREE.CylinderGeometry(2.0, 2.0, 0.05, 64);
    const dialFace = new THREE.Mesh(dialFaceGeo, darkSteel);
    dialFace.rotation.x = Math.PI / 2;
    
    const ticksGroup = new THREE.Group();
    for(let i=0; i<30; i++) {
        let angle = (i / 30) * Math.PI * 1.5 - Math.PI * 0.75;
        let tickGeo = new THREE.BoxGeometry(0.02, 0.1, 0.02);
        let tick = new THREE.Mesh(tickGeo, i % 5 === 0 ? neonBlue : holoGlass);
        tick.position.x = Math.sin(angle) * 1.8;
        tick.position.y = Math.cos(angle) * 1.8;
        tick.rotation.z = -angle;
        tick.position.z = 0.03;
        ticksGroup.add(tick);
    }
    dialFace.add(ticksGroup);

    addPart('Dial Face', dialFace, {
        description: "The calibrated scale indicating pressure values.",
        material: "Anodized Aluminum",
        function: "Provides the reference scale for the pointer.",
        assemblyOrder: 7,
        connections: ["Housing"],
        failureEffect: "Readings become impossible to interpret.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0.3 },
        explodedPosition: { x: 0, y: 0, z: 1.5 }
    });

    // 8. Protective Crystal
    const glassFaceGeo = new THREE.CylinderGeometry(2.1, 2.1, 0.1, 64);
    const glassFace = new THREE.Mesh(glassFaceGeo, holoGlass);
    glassFace.rotation.x = Math.PI / 2;

    addPart('Protective Crystal', glassFace, {
        description: "A thick, high-transmission holographic glass cover.",
        material: "Holographic Glass",
        function: "Seals the instrument and protects the delicate pointer.",
        assemblyOrder: 8,
        connections: ["Housing"],
        failureEffect: "Exposure to environmental factors.",
        cascadeFailures: ["Pointer damage", "Internal condensation"],
        originalPosition: { x: 0, y: 0, z: 0.6 },
        explodedPosition: { x: 0, y: 0, z: 3.5 }
    });


    const description = "The Aneroid Barometric Pressure System is a highly sensitive mechanical instrument that measures atmospheric pressure without the use of liquid. A partially evacuated metallic cell expands or contracts with changes in air pressure. This microscopic movement is amplified through a series of precision levers, springs, and gears, culminating in the sweeping motion of an indicator needle across a calibrated dial. Its purely mechanical nature ensures reliability in environments where electronic sensors may fail.";

    const quizQuestions = [
        {
            question: "What is the primary sensing element in an aneroid barometer?",
            options: [
                "A column of liquid mercury",
                "A partially evacuated, corrugated metal cell",
                "A piezoelectric crystal",
                "A heated wire element"
            ],
            correct: 1,
            explanation: "The aneroid cell is a flexible metal box with a partial vacuum inside. It acts as the primary sensor, expanding as external pressure drops and contracting as it rises.",
            difficulty: "easy"
        },
        {
            question: "Why is a strong leaf spring necessary in the design of the aneroid barometer?",
            options: [
                "To power the rotational movement of the pointer",
                "To reset the pointer to zero after a reading",
                "To prevent the evacuated aneroid cell from collapsing under atmospheric pressure",
                "To absorb shock and vibration during transport"
            ],
            correct: 2,
            explanation: "Because the aneroid cell has a partial vacuum, atmospheric pressure would crush it completely without a strong opposing force, which is provided by the leaf spring.",
            difficulty: "medium"
        },
        {
            question: "What is the function of the bimetallic strip often integrated into the linkage mechanism?",
            options: [
                "To amplify the physical movement of the cell",
                "To compensate for temperature variations that affect the metal's expansion",
                "To provide an electrical connection for backlighting",
                "To reduce mechanical friction between gears"
            ],
            correct: 1,
            explanation: "Metals expand and contract with temperature changes. A bimetallic strip compensates for these thermal effects, ensuring the pressure reading is accurate regardless of the ambient temperature.",
            difficulty: "hard"
        },
        {
            question: "What specific mechanical component eliminates 'backlash' or slop in the gear train?",
            options: [
                "The primary leaf spring",
                "The corrugated aneroid cell",
                "The protective crystal face",
                "The hairspring attached to the sector gear"
            ],
            correct: 3,
            explanation: "A fine hairspring maintains constant tension on the gear teeth, ensuring there is no loose movement (backlash) between the sector gear and the pinion gear.",
            difficulty: "medium"
        }
    ];

    function animate(time, speed, meshes) {
        const activeMeshes = meshes || meshesObj;
        const slowTime = time * 0.001 * speed;
        const pressureFluctuation = Math.sin(slowTime) * 0.5 + Math.sin(slowTime * 2.3) * 0.2;
        
        if (activeMeshes['Aneroid Cell']) {
            const cellScale = 1.0 + (pressureFluctuation * 0.1);
            activeMeshes['Aneroid Cell'].scale.z = cellScale;
        }

        if (activeMeshes['Leaf Spring']) {
            activeMeshes['Leaf Spring'].rotation.x = pressureFluctuation * 0.05;
        }

        if (activeMeshes['Linkage Mechanism']) {
            activeMeshes['Linkage Mechanism'].rotation.z = pressureFluctuation * 0.1;
        }

        if (activeMeshes['Sector Gear']) {
            activeMeshes['Sector Gear'].rotation.z = -pressureFluctuation * 0.2;
        }

        if (activeMeshes['Indicator Pointer']) {
            activeMeshes['Indicator Pointer'].rotation.z = -pressureFluctuation * 1.5;
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
export function createBarometricPressureSystem() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
