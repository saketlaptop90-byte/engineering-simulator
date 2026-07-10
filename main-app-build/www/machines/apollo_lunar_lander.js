import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const goldFoil = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 0.8,
        roughness: 0.4,
        bumpScale: 0.02
    });

    const descentEngineGlow = new THREE.MeshBasicMaterial({
        color: 0xffaa00,
        transparent: true,
        opacity: 0.8
    });

    // --- DESCENT STAGE ---
    const descentStageGeo = new THREE.BoxGeometry(4, 2, 4);
    const descentStage = new THREE.Mesh(descentStageGeo, goldFoil);
    descentStage.position.set(0, 1, 0);
    group.add(descentStage);
    parts.push({
        name: "Descent Stage",
        description: "The unmanned lower part of the LM that provides the propulsion and consumables for the descent to the lunar surface.",
        material: "goldFoil",
        function: "Houses the descent engine, fuel tanks, and scientific equipment.",
        assemblyOrder: 1,
        connections: ["Ascent Stage", "Landing Gear", "Descent Engine"],
        failureEffect: "Inability to land or abort the landing mission safely.",
        cascadeFailures: ["Loss of life support consumables stored in the descent stage."],
        originalPosition: { x: 0, y: 1, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 },
        mesh: descentStage
    });

    // Descent Engine
    const descentEngineGeo = new THREE.CylinderGeometry(0.8, 1.2, 1, 32);
    const descentEngine = new THREE.Mesh(descentEngineGeo, darkSteel);
    descentEngine.position.set(0, -0.5, 0);
    descentStage.add(descentEngine);
    parts.push({
        name: "Descent Engine",
        description: "A throttleable rocket engine used to slow the LM for landing.",
        material: "darkSteel",
        function: "Provides thrust for the lunar descent.",
        assemblyOrder: 2,
        connections: ["Descent Stage"],
        failureEffect: "Crash landing on the moon.",
        cascadeFailures: ["Loss of crew and vehicle."],
        originalPosition: { x: 0, y: 0.5, z: 0 },
        explodedPosition: { x: 0, y: -4, z: 0 },
        mesh: descentEngine
    });

    // Plume
    const plumeGeo = new THREE.ConeGeometry(1, 3, 32);
    const plume = new THREE.Mesh(plumeGeo, descentEngineGlow);
    plume.position.set(0, -2, 0);
    plume.rotation.x = Math.PI;
    plume.visible = false;
    descentEngine.add(plume);
    
    // Landing Gear (4 legs)
    for (let i = 0; i < 4; i++) {
        const legGeo = new THREE.CylinderGeometry(0.1, 0.1, 4);
        const leg = new THREE.Mesh(legGeo, aluminum);
        const angle = (i * Math.PI) / 2 + Math.PI / 4;
        leg.position.set(Math.cos(angle) * 3, 0, Math.sin(angle) * 3);
        leg.rotation.z = Math.cos(angle) * -Math.PI / 6;
        leg.rotation.x = Math.sin(angle) * Math.PI / 6;
        group.add(leg);
        
        const padGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.1, 32);
        const pad = new THREE.Mesh(padGeo, goldFoil);
        pad.position.set(0, -2, 0);
        pad.rotation.x = Math.PI/2;
        leg.add(pad);
        
        parts.push({
            name: `Landing Gear ${i+1}`,
            description: "Deployable legs to absorb the shock of landing.",
            material: "aluminum",
            function: "Stabilize the LM on the lunar surface.",
            assemblyOrder: 3 + i,
            connections: ["Descent Stage"],
            failureEffect: "LM tips over upon landing.",
            cascadeFailures: ["Inability to launch ascent stage."],
            originalPosition: { x: Math.cos(angle) * 3, y: 0, z: Math.sin(angle) * 3 },
            explodedPosition: { x: Math.cos(angle) * 6, y: -2, z: Math.sin(angle) * 6 },
            mesh: leg
        });
    }

    // --- ASCENT STAGE ---
    const ascentStageGeo = new THREE.DodecahedronGeometry(2);
    const ascentStage = new THREE.Mesh(ascentStageGeo, aluminum);
    ascentStage.position.set(0, 3.5, 0);
    group.add(ascentStage);
    parts.push({
        name: "Ascent Stage",
        description: "The crew cabin and the return vehicle to lunar orbit.",
        material: "aluminum",
        function: "Houses the crew, life support, and ascent engine.",
        assemblyOrder: 7,
        connections: ["Descent Stage", "Ascent Engine", "RCS Thrusters", "Docking Hatch"],
        failureEffect: "Crew is stranded on the moon.",
        cascadeFailures: ["Loss of life support."],
        originalPosition: { x: 0, y: 3.5, z: 0 },
        explodedPosition: { x: 0, y: 6, z: 0 },
        mesh: ascentStage
    });
    
    // Windows
    const windowGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 16);
    const win1 = new THREE.Mesh(windowGeo, glass);
    win1.position.set(1, 0.5, 1.5);
    win1.rotation.x = Math.PI / 2;
    win1.rotation.y = Math.PI / 6;
    ascentStage.add(win1);
    
    const win2 = new THREE.Mesh(windowGeo, glass);
    win2.position.set(-1, 0.5, 1.5);
    win2.rotation.x = Math.PI / 2;
    win2.rotation.y = -Math.PI / 6;
    ascentStage.add(win2);

    // Ascent Engine
    const ascentEngineGeo = new THREE.CylinderGeometry(0.4, 0.6, 0.8, 32);
    const ascentEngine = new THREE.Mesh(ascentEngineGeo, darkSteel);
    ascentEngine.position.set(0, -1.5, 0);
    ascentStage.add(ascentEngine);
    parts.push({
        name: "Ascent Engine",
        description: "Fixed-thrust engine used to launch the ascent stage from the moon.",
        material: "darkSteel",
        function: "Propels the ascent stage into lunar orbit.",
        assemblyOrder: 8,
        connections: ["Ascent Stage"],
        failureEffect: "Inability to leave lunar surface.",
        cascadeFailures: ["Crew loss."],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: 0, y: 4, z: 0 },
        mesh: ascentEngine
    });
    
    // Docking Hatch
    const hatchGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.2, 32);
    const hatch = new THREE.Mesh(hatchGeo, steel);
    hatch.position.set(0, 1.9, 0);
    ascentStage.add(hatch);

    // RCS Thrusters (Quads)
    const rcsMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const rcsPositions = [
        { x: 2, y: 0, z: 2 },
        { x: -2, y: 0, z: 2 },
        { x: 2, y: 0, z: -2 },
        { x: -2, y: 0, z: -2 }
    ];
    
    const rcsPlumes = [];
    
    rcsPositions.forEach((pos, idx) => {
        const quadGroup = new THREE.Group();
        quadGroup.position.set(pos.x, pos.y, pos.z);
        
        // Block
        const blockGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
        const block = new THREE.Mesh(blockGeo, aluminum);
        quadGroup.add(block);
        
        // Bells
        const directions = [
            { x: 1, y: 0, z: 0, rotZ: -Math.PI/2, rotX: 0 },
            { x: -1, y: 0, z: 0, rotZ: Math.PI/2, rotX: 0 },
            { x: 0, y: 1, z: 0, rotZ: 0, rotX: 0 },
            { x: 0, y: -1, z: 0, rotZ: Math.PI, rotX: 0 },
            { x: 0, y: 0, z: 1, rotZ: 0, rotX: Math.PI/2 },
            { x: 0, y: 0, z: -1, rotZ: 0, rotX: -Math.PI/2 }
        ];
        
        directions.slice(0, 4).forEach(dir => {
            const bellGeo = new THREE.ConeGeometry(0.15, 0.3, 16);
            const bell = new THREE.Mesh(bellGeo, rcsMaterial);
            bell.position.set(dir.x * 0.3, dir.y * 0.3, dir.z * 0.3);
            bell.rotation.z = dir.rotZ;
            bell.rotation.x = dir.rotX;
            quadGroup.add(bell);
            
            const rcsPlumeGeo = new THREE.ConeGeometry(0.1, 0.5, 16);
            const rcsPlume = new THREE.Mesh(rcsPlumeGeo, descentEngineGlow);
            rcsPlume.position.set(0, -0.4, 0);
            rcsPlume.visible = false;
            bell.add(rcsPlume);
            rcsPlumes.push(rcsPlume);
        });
        
        ascentStage.add(quadGroup);
        
        parts.push({
            name: `RCS Quad ${idx+1}`,
            description: "Reaction Control System thruster quad.",
            material: "aluminum",
            function: "Provides attitude control and minor translation in space.",
            assemblyOrder: 9 + idx,
            connections: ["Ascent Stage"],
            failureEffect: "Loss of attitude control.",
            cascadeFailures: ["Inability to dock with CSM.", "Incorrect landing orientation."],
            originalPosition: { x: pos.x, y: pos.y + 3.5, z: pos.z },
            explodedPosition: { x: pos.x * 2, y: pos.y + 6, z: pos.z * 2 },
            mesh: quadGroup
        });
    });

    const description = "The Apollo Lunar Module was the lander spacecraft that was flown between lunar orbit and the Moon's surface during the US Apollo program. It consisted of a descent stage and an ascent stage.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Descent Stage?",
            options: [
                "To house the crew during the entire mission",
                "To provide propulsion and consumables for the lunar landing",
                "To return the crew to Earth",
                "To deploy the lunar rover exclusively"
            ],
            correct: 1,
            explanation: "The descent stage contains the descent engine and fuel necessary to slow the lander down for a safe touchdown on the moon.",
            difficulty: "easy"
        },
        {
            question: "Why does the Ascent Stage lack a backup engine?",
            options: [
                "It was too heavy",
                "The engine is incredibly simple and pressure-fed, making it highly reliable",
                "They forgot to include one",
                "The RCS thrusters can substitute for the main engine"
            ],
            correct: 1,
            explanation: "The ascent engine was a pressure-fed hypergolic engine, meaning it had very few moving parts and the propellants ignited on contact, making it exceedingly reliable.",
            difficulty: "medium"
        },
        {
            question: "What color was the protective foil prominently wrapping the Descent Stage?",
            options: ["Silver", "Gold", "White", "Black"],
            correct: 1,
            explanation: "The descent stage was covered in Kapton foil, which gave it a distinctive gold appearance, providing thermal insulation.",
            difficulty: "easy"
        }
    ];

    let timeOffset = 0;
    
    function animate(time, speed, meshes) {
        timeOffset += 0.01 * speed;
        
        // Hovering effect
        group.position.y = Math.sin(timeOffset) * 0.2;
        
        // Engine plume flickering
        plume.visible = speed > 0;
        if (plume.visible) {
            plume.scale.set(
                1 + Math.random() * 0.2,
                1 + Math.random() * 0.5,
                1 + Math.random() * 0.2
            );
            plume.material.opacity = 0.6 + Math.random() * 0.4;
        }
        
        // Random RCS firing
        rcsPlumes.forEach(p => p.visible = false);
        if (speed > 0 && Math.random() > 0.95) {
            const randomRCS = rcsPlumes[Math.floor(Math.random() * rcsPlumes.length)];
            randomRCS.visible = true;
            randomRCS.scale.set(
                1 + Math.random() * 0.2,
                1 + Math.random() * 0.5,
                1 + Math.random() * 0.2
            );
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createApolloLunarLander() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
