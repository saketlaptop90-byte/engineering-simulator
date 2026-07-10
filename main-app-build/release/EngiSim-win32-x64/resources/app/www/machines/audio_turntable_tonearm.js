import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Custom neon/glowing materials
    const neonCyan = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        metalness: 0.8,
        roughness: 0.2
    });
    
    const neonMagenta = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 0.8,
        metalness: 0.8,
        roughness: 0.2
    });

    const carbonFiber = new THREE.MeshStandardMaterial({
        color: 0x222222,
        metalness: 0.5,
        roughness: 0.6,
        wireframe: true // Simulating a high-tech mesh look
    });

    // 1. Base / Pivot Post
    const baseGeometry = new THREE.CylinderGeometry(0.8, 1, 2, 32);
    const baseMesh = new THREE.Mesh(baseGeometry, darkSteel);
    baseMesh.position.set(0, 1, 0);
    group.add(baseMesh);
    parts.push({
        name: "Pivot Base",
        description: "The sturdy foundation supporting the entire tonearm assembly.",
        material: "Dark Steel",
        function: "Anchors the tonearm to the turntable plinth.",
        assemblyOrder: 1,
        connections: ["Gimbal Ring"],
        failureEffect: "Tonearm instability",
        cascadeFailures: ["Tracking error", "Skipping"],
        originalPosition: { x: 0, y: 1, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 }
    });

    // 2. Gimbal Ring (Outer)
    const gimbalOuterGeo = new THREE.TorusGeometry(1.2, 0.15, 16, 64);
    const gimbalOuterMesh = new THREE.Mesh(gimbalOuterGeo, neonCyan);
    gimbalOuterMesh.position.set(0, 2.5, 0);
    gimbalOuterMesh.rotation.x = Math.PI / 2;
    group.add(gimbalOuterMesh);
    parts.push({
        name: "Outer Gimbal Ring",
        description: "Provides horizontal pivot axis with zero-friction bearings.",
        material: "Neon Cyan Alloy",
        function: "Allows horizontal tracking of the record groove.",
        assemblyOrder: 2,
        connections: ["Pivot Base", "Inner Gimbal Ring"],
        failureEffect: "Stiff horizontal movement",
        cascadeFailures: ["Inner groove distortion", "Cantilever damage"],
        originalPosition: { x: 0, y: 2.5, z: 0 },
        explodedPosition: { x: 0, y: 4, z: 0 }
    });

    // 3. Gimbal Ring (Inner)
    const gimbalInnerGeo = new THREE.TorusGeometry(0.9, 0.15, 16, 64);
    const gimbalInnerMesh = new THREE.Mesh(gimbalInnerGeo, neonMagenta);
    gimbalInnerMesh.position.set(0, 2.5, 0);
    group.add(gimbalInnerMesh);
    parts.push({
        name: "Inner Gimbal Ring",
        description: "Provides vertical pivot axis.",
        material: "Neon Magenta Alloy",
        function: "Allows vertical tracking to accommodate record warps.",
        assemblyOrder: 3,
        connections: ["Outer Gimbal Ring", "Tonearm Tube"],
        failureEffect: "Vertical tracking error",
        cascadeFailures: ["Needle jumping"],
        originalPosition: { x: 0, y: 2.5, z: 0 },
        explodedPosition: { x: 0, y: 2.5, z: -3 }
    });

    // 4. Tonearm Tube
    const tubeGeo = new THREE.CylinderGeometry(0.15, 0.15, 8, 32);
    const tubeMesh = new THREE.Mesh(tubeGeo, carbonFiber);
    tubeMesh.position.set(2.5, 2.5, 0);
    tubeMesh.rotation.z = Math.PI / 2;
    group.add(tubeMesh);
    parts.push({
        name: "Carbon Fiber Tonearm Tube",
        description: "Lightweight, ultra-rigid tube connecting the pivot to the headshell.",
        material: "Carbon Fiber",
        function: "Transfers mechanical energy with minimal resonance.",
        assemblyOrder: 4,
        connections: ["Inner Gimbal Ring", "Headshell", "Counterweight"],
        failureEffect: "Acoustic resonance",
        cascadeFailures: ["Muddy sound", "Feedback"],
        originalPosition: { x: 2.5, y: 2.5, z: 0 },
        explodedPosition: { x: 5, y: 2.5, z: 0 }
    });

    // 5. Counterweight
    const cwGeo = new THREE.CylinderGeometry(0.6, 0.6, 1, 32);
    const cwMesh = new THREE.Mesh(cwGeo, chrome);
    cwMesh.position.set(-1, 2.5, 0);
    cwMesh.rotation.z = Math.PI / 2;
    group.add(cwMesh);
    parts.push({
        name: "Counterweight",
        description: "Adjustable mass to balance the tonearm.",
        material: "Chrome",
        function: "Sets the precise vertical tracking force (VTF).",
        assemblyOrder: 5,
        connections: ["Tonearm Tube"],
        failureEffect: "Incorrect VTF",
        cascadeFailures: ["Record wear", "Poor tracking"],
        originalPosition: { x: -1, y: 2.5, z: 0 },
        explodedPosition: { x: -3, y: 2.5, z: 0 }
    });

    // 6. Anti-Skate Mechanism
    const skateGeo = new THREE.SphereGeometry(0.3, 32, 32);
    const skateMesh = new THREE.Mesh(skateGeo, neonCyan);
    skateMesh.position.set(-0.5, 3.2, 0.8);
    group.add(skateMesh);
    parts.push({
        name: "Anti-Skate Weight",
        description: "Provides outward force to counteract centripetal skating force.",
        material: "Neon Cyan Alloy",
        function: "Balances groove wall pressure.",
        assemblyOrder: 6,
        connections: ["Gimbal Ring"],
        failureEffect: "Uneven channel balance",
        cascadeFailures: ["Uneven stylus wear", "Distortion in one channel"],
        originalPosition: { x: -0.5, y: 3.2, z: 0.8 },
        explodedPosition: { x: -0.5, y: 5, z: 2 }
    });

    // 7. Headshell
    const headshellGeo = new THREE.BoxGeometry(1.5, 0.2, 0.8);
    const headshellMesh = new THREE.Mesh(headshellGeo, aluminum);
    headshellMesh.position.set(6.5, 2.5, 0);
    group.add(headshellMesh);
    parts.push({
        name: "Headshell",
        description: "Mounting platform for the cartridge.",
        material: "Aluminum",
        function: "Secures the cartridge at the correct offset angle.",
        assemblyOrder: 7,
        connections: ["Tonearm Tube", "Cartridge"],
        failureEffect: "Cartridge misalignment",
        cascadeFailures: ["Phase issues", "Tracking distortion"],
        originalPosition: { x: 6.5, y: 2.5, z: 0 },
        explodedPosition: { x: 8, y: 2.5, z: 0 }
    });

    // 8. Cartridge & Stylus (Abstracted)
    const cartridgeGeo = new THREE.BoxGeometry(0.8, 0.4, 0.4);
    const cartridgeMesh = new THREE.Mesh(cartridgeGeo, steel);
    cartridgeMesh.position.set(6.5, 2.2, 0);
    group.add(cartridgeMesh);
    parts.push({
        name: "Phono Cartridge",
        description: "Electromagnetic transducer with diamond stylus.",
        material: "Steel / Diamond",
        function: "Converts mechanical groove variations into electrical signals.",
        assemblyOrder: 8,
        connections: ["Headshell"],
        failureEffect: "No audio",
        cascadeFailures: ["Record damage if stylus is chipped"],
        originalPosition: { x: 6.5, y: 2.2, z: 0 },
        explodedPosition: { x: 8, y: 1, z: 0 }
    });

    const meshes = {
        base: baseMesh,
        gimbalOuter: gimbalOuterMesh,
        gimbalInner: gimbalInnerMesh,
        tube: tubeMesh,
        counterweight: cwMesh,
        antiSkate: skateMesh,
        headshell: headshellMesh,
        cartridge: cartridgeMesh
    };

    const description = "A high-end, precision-engineered turntable tonearm featuring glowing gimbal bearings, carbon fiber tubular construction, and a meticulously calibrated anti-skate mechanism. Designed for absolute zero friction and perfect record tracking.";

    const quizQuestions = [
        {
            question: "What is the primary function of the anti-skate mechanism?",
            options: [
                "To adjust the vertical tracking force",
                "To counteract the inward centripetal force pulling the tonearm toward the center of the record",
                "To reduce electrical hum",
                "To balance the weight of the headshell"
            ],
            correct: 1,
            explanation: "As a pivoted tonearm tracks a record groove, friction pulls it inward (skating force). Anti-skate applies a gentle outward force to keep the stylus centered in the groove.",
            difficulty: "Medium"
        },
        {
            question: "Why are gimbal bearings crucial in a high-end tonearm?",
            options: [
                "They provide power to the cartridge",
                "They act as a shock absorber",
                "They allow ultra-low friction movement across horizontal and vertical axes",
                "They spin the record platter"
            ],
            correct: 2,
            explanation: "Gimbal bearings provide the pivot points for the tonearm. Minimal friction is essential so the stylus can track delicate groove modulations without resistance.",
            difficulty: "Easy"
        },
        {
            question: "What happens if the counterweight is set incorrectly, resulting in too low of a Vertical Tracking Force (VTF)?",
            options: [
                "The tonearm will be too heavy and damage the record",
                "The stylus will jump out of the groove (skip) and cause high-frequency distortion",
                "The turntable motor will slow down",
                "The anti-skate will stop working"
            ],
            correct: 1,
            explanation: "If the VTF is too light, the stylus won't stay firmly seated in the groove, leading to mistracking, skipping, and potential damage to the record as it bounces.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Slow swaying motion as if tracking a slightly warped record
        const trackSway = Math.sin(time * speed * 2) * 0.05;
        const warpSway = Math.cos(time * speed * 3) * 0.02;

        meshes.gimbalOuter.rotation.y = trackSway;
        meshes.gimbalInner.rotation.x = warpSway;

        // Propagate rotation to the rest of the arm assembly
        meshes.tube.position.y = 2.5 + warpSway;
        meshes.tube.position.z = trackSway;
        meshes.counterweight.position.y = 2.5 + warpSway;
        meshes.counterweight.position.z = trackSway;
        meshes.headshell.position.y = 2.5 + warpSway;
        meshes.headshell.position.z = trackSway;
        meshes.cartridge.position.y = 2.2 + warpSway;
        meshes.cartridge.position.z = trackSway;
        
        // Pulsating neon glow for visual flair
        meshes.gimbalOuter.material.emissiveIntensity = 0.5 + Math.abs(Math.sin(time * 5)) * 0.5;
        meshes.antiSkate.material.emissiveIntensity = 0.5 + Math.abs(Math.cos(time * 5)) * 0.5;
    }

    return { group, parts, description, quizQuestions, animate: (t, s) => animate(t, s, meshes) };
}

// Auto-generated missing stub
export function createTurntableTonearm() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
