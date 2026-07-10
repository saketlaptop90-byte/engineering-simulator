import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing/neon materials for visual flair
    const glowBlue = new THREE.MeshStandardMaterial({ color: 0x0044ff, emissive: 0x0022ff, emissiveIntensity: 2, metalness: 0.8, roughness: 0.2 });
    const glowRed = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2, metalness: 0.8, roughness: 0.2 });
    const hazardYellow = new THREE.MeshStandardMaterial({ color: 0xffaa00, metalness: 0.3, roughness: 0.7 });
    const controlBlue = new THREE.MeshStandardMaterial({ color: 0x0055ff, metalness: 0.4, roughness: 0.6 });
    const glowingBlade = new THREE.MeshStandardMaterial({ color: 0x00ffaa, emissive: 0x00ffaa, emissiveIntensity: 5, metalness: 1, roughness: 0 });

    const meshes = {};

    // 1. Wellhead Connector
    const connectorGeo = new THREE.CylinderGeometry(1.5, 1.8, 1.5, 32);
    const connector = new THREE.Mesh(connectorGeo, darkSteel);
    connector.position.set(0, 0.75, 0);
    group.add(connector);
    meshes.connector = connector;
    
    parts.push({
        name: "Wellhead Connector",
        description: "The base component that locks the blowout preventer stack securely to the subsea wellhead.",
        material: "Dark Steel",
        function: "Provides a high-pressure, secure structural and hydraulic seal between the BOP and the well.",
        assemblyOrder: 1,
        connections: ["Wellhead", "Pipe Ram"],
        failureEffect: "Complete loss of well containment at the base, leading to catastrophic blowout.",
        cascadeFailures: ["Loss of stack stability", "Total structural failure"],
        originalPosition: { x: 0, y: 0.75, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 }
    });

    // 2. Pipe Ram Preventer
    const pipeRamBaseGeo = new THREE.BoxGeometry(3, 1.5, 3);
    const pipeRamBase = new THREE.Mesh(pipeRamBaseGeo, steel);
    pipeRamBase.position.set(0, 2.25, 0);
    group.add(pipeRamBase);
    meshes.pipeRamBase = pipeRamBase;
    
    // Pipe Ram Actuators
    const ramActuatorGeo = new THREE.CylinderGeometry(0.6, 0.6, 2, 32);
    ramActuatorGeo.rotateZ(Math.PI / 2);
    
    const ramLGeo = new THREE.Mesh(ramActuatorGeo, chrome);
    ramLGeo.position.set(-2.5, 2.25, 0);
    group.add(ramLGeo);
    meshes.pipeRamL = ramLGeo;
    
    const ramRGeo = new THREE.Mesh(ramActuatorGeo, chrome);
    ramRGeo.position.set(2.5, 2.25, 0);
    group.add(ramRGeo);
    meshes.pipeRamR = ramRGeo;

    parts.push({
        name: "Pipe Ram Preventer",
        description: "Hydraulic rams designed to close around the drill pipe, sealing the annular space.",
        material: "Steel / Chrome",
        function: "Seals the wellbore when drill pipe is in the hole, preventing fluid escape.",
        assemblyOrder: 2,
        connections: ["Wellhead Connector", "Blind Shear Ram"],
        failureEffect: "Inability to seal around the pipe during a kick.",
        cascadeFailures: ["Fluid migration up the annulus", "Overpressurization of upper stack"],
        originalPosition: { x: 0, y: 2.25, z: 0 },
        explodedPosition: { x: 0, y: 2.25, z: 5 }
    });

    // 3. Blind Shear Ram Preventer
    const shearRamGeo = new THREE.BoxGeometry(3.2, 1.8, 3.2);
    const shearRamBase = new THREE.Mesh(shearRamGeo, darkSteel);
    shearRamBase.position.set(0, 4.0, 0);
    group.add(shearRamBase);
    meshes.shearRamBase = shearRamBase;

    // Shear Blades
    const bladeGeo = new THREE.BoxGeometry(2.8, 0.2, 0.5);
    const shearBladeL = new THREE.Mesh(bladeGeo, glowingBlade);
    shearBladeL.position.set(-0.5, 4.0, 0);
    group.add(shearBladeL);
    meshes.shearBladeL = shearBladeL;

    const shearBladeR = new THREE.Mesh(bladeGeo, glowingBlade);
    shearBladeR.position.set(0.5, 4.0, 0);
    group.add(shearBladeR);
    meshes.shearBladeR = shearBladeR;

    const shearActL = new THREE.Mesh(ramActuatorGeo, glowRed);
    shearActL.position.set(-2.6, 4.0, 0);
    group.add(shearActL);
    meshes.shearActL = shearActL;

    const shearActR = new THREE.Mesh(ramActuatorGeo, glowRed);
    shearActR.position.set(2.6, 4.0, 0);
    group.add(shearActR);
    meshes.shearActR = shearActR;

    parts.push({
        name: "Blind Shear Ram",
        description: "The ultimate safety mechanism. High-power rams equipped with hardened steel blades.",
        material: "Dark Steel / Glowing Neon",
        function: "Cuts through the drill pipe and completely seals the wellbore in a critical emergency.",
        assemblyOrder: 3,
        connections: ["Pipe Ram", "Annular Preventer"],
        failureEffect: "Failure to cut pipe and seal well during ultimate blowout scenario.",
        cascadeFailures: ["Uncontrolled hydrocarbon release to environment", "Total well loss"],
        originalPosition: { x: 0, y: 4.0, z: 0 },
        explodedPosition: { x: -6, y: 4.0, z: 0 }
    });

    // 4. Annular Preventer
    const annularGeo = new THREE.TorusGeometry(1.4, 0.8, 16, 64);
    annularGeo.rotateX(Math.PI / 2);
    const annular = new THREE.Mesh(annularGeo, rubber);
    annular.position.set(0, 5.8, 0);
    group.add(annular);
    meshes.annular = annular;
    
    const annularCapGeo = new THREE.CylinderGeometry(1.8, 2.2, 1.2, 32);
    const annularCap = new THREE.Mesh(annularCapGeo, darkSteel);
    annularCap.position.set(0, 5.8, 0);
    group.add(annularCap);
    meshes.annularCap = annularCap;

    parts.push({
        name: "Annular Preventer",
        description: "A massive synthetic rubber packing element reinforced with steel ribs.",
        material: "Rubber / Steel",
        function: "Closes around any size pipe or completely seals an open hole to prevent fluid flow.",
        assemblyOrder: 4,
        connections: ["Blind Shear Ram", "LMRP"],
        failureEffect: "Slow leaks of wellbore fluids, inability to strip pipe.",
        cascadeFailures: ["Loss of primary well control", "Excessive wear on secondary rams"],
        originalPosition: { x: 0, y: 5.8, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 }
    });

    // 5. Control Pods (Yellow and Blue)
    const podGeo = new THREE.BoxGeometry(1.2, 2.5, 1.2);
    const podYellow = new THREE.Mesh(podGeo, hazardYellow);
    podYellow.position.set(-2.5, 5.0, 2);
    group.add(podYellow);
    meshes.podYellow = podYellow;

    const podBlue = new THREE.Mesh(podGeo, controlBlue);
    podBlue.position.set(2.5, 5.0, 2);
    group.add(podBlue);
    meshes.podBlue = podBlue;

    parts.push({
        name: "MUX Control Pods (Yellow & Blue)",
        description: "Redundant multiplex (MUX) control pods containing hydraulic valves and subsea electronics.",
        material: "Hazard Yellow / Control Blue",
        function: "Translates electronic commands from the surface into hydraulic actions to operate the BOP functions.",
        assemblyOrder: 5,
        connections: ["Stack Frame", "Umbilicals"],
        failureEffect: "Loss of remote control over BOP functions.",
        cascadeFailures: ["Inability to activate rams", "Reliance on ROV intervention or deadman switches"],
        originalPosition: { x: -2.5, y: 5.0, z: 2 },
        explodedPosition: { x: -5, y: 5.0, z: 5 }
    });

    // 6. Choke and Kill Lines
    const lineGeo = new THREE.CylinderGeometry(0.2, 0.2, 6, 16);
    const chokeLine = new THREE.Mesh(lineGeo, steel);
    chokeLine.position.set(-1.8, 3.5, -1.8);
    group.add(chokeLine);
    meshes.chokeLine = chokeLine;

    const killLine = new THREE.Mesh(lineGeo, steel);
    killLine.position.set(1.8, 3.5, -1.8);
    group.add(killLine);
    meshes.killLine = killLine;

    parts.push({
        name: "Choke and Kill Lines",
        description: "High-pressure external piping running the length of the BOP stack.",
        material: "Steel",
        function: "Circulates heavy drilling mud into the well (kill) or bleeds off high-pressure well fluids (choke).",
        assemblyOrder: 6,
        connections: ["Wellhead", "Surface Manifold"],
        failureEffect: "Inability to circulate out a kick or regain hydrostatic control.",
        cascadeFailures: ["Overpressurization", "Rupture of BOP body"],
        originalPosition: { x: -1.8, y: 3.5, z: -1.8 },
        explodedPosition: { x: -4, y: 3.5, z: -4 }
    });

    const description = "The Blowout Preventer (BOP) is a massive, specialized valve or similar mechanical device, used to seal, control and monitor oil and gas wells to prevent blowout, the uncontrolled release of crude oil and/or natural gas from a well. It is the ultimate fail-safe mechanism in subsea drilling operations.";

    const quizQuestions = [
        {
            question: "Which component of the BOP is designed as the ultimate fail-safe to cut through the drill pipe and seal the well?",
            options: ["Annular Preventer", "Pipe Ram", "Blind Shear Ram", "Choke Line"],
            correct: 2,
            explanation: "The Blind Shear Ram is equipped with hardened steel blades that can cleanly shear the drill pipe and completely seal the wellbore in a critical emergency.",
            difficulty: "Medium"
        },
        {
            question: "Why are there two control pods (typically colored Yellow and Blue) on a subsea BOP stack?",
            options: ["To control two different wells", "For complete redundancy in case one fails", "One is for electrical, one is for hydraulic", "One controls rams, the other controls the annular"],
            correct: 1,
            explanation: "Subsea BOPs employ redundant control pods (Yellow and Blue) to ensure that if one pod's electronics or hydraulics fail, the surface operators can switch to the other to maintain control.",
            difficulty: "Hard"
        },
        {
            question: "What is the primary function of the Annular Preventer?",
            options: ["To cut the drill pipe", "To circulate heavy mud into the well", "To seal around any size or shape of pipe in the wellbore", "To lock the BOP to the wellhead"],
            correct: 2,
            explanation: "The Annular Preventer uses a massive rubber packing element that can conform to and seal around virtually any size or shape of drill string component, or even an open hole.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, activeMeshes) {
        if (!activeMeshes) activeMeshes = meshes;
        
        // Pulsating glow on the control pods to indicate active MUX telemetry
        const glowIntensity = 1 + Math.sin(time * 2 * speed) * 0.5;
        if (hazardYellow) {
            hazardYellow.emissive = new THREE.Color(0xffaa00);
            hazardYellow.emissiveIntensity = glowIntensity * 0.5;
        }

        // Simulate hydraulic testing: Shear rams pulsing slightly
        if (activeMeshes.shearActL) activeMeshes.shearActL.scale.x = 1 + Math.sin(time * speed * 0.5) * 0.05;
        if (activeMeshes.shearActR) activeMeshes.shearActR.scale.x = 1 + Math.sin(time * speed * 0.5) * 0.05;

        // Glowing shear blades sliding in and out (simulated testing)
        const bladeMovement = Math.abs(Math.sin(time * speed * 0.3)) * 0.5;
        if (activeMeshes.shearBladeL) activeMeshes.shearBladeL.position.x = -0.5 + bladeMovement;
        if (activeMeshes.shearBladeR) activeMeshes.shearBladeR.position.x = 0.5 - bladeMovement;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createBlowoutPreventer() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
