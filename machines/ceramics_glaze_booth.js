import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Custom materials
    const neonPink = new THREE.MeshStandardMaterial({ 
        color: 0xff1493, 
        emissive: 0xff1493, 
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9
    });
    
    const neonCyan = new THREE.MeshStandardMaterial({ 
        color: 0x00ffff, 
        emissive: 0x00ffff, 
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9
    });

    const boothGlass = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.9,
        transparent: true,
        opacity: 0.3,
        ior: 1.5,
        clearcoat: 1.0,
    });

    // 1. Base Platform
    const baseGeo = new THREE.CylinderGeometry(5, 5, 0.5, 32);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, -0.25, 0);
    group.add(baseMesh);
    parts.push({
        name: "Base Platform",
        description: "Heavy steel platform supporting the entire glaze booth and rotating mechanism.",
        material: "darkSteel",
        function: "Provides structural stability and houses the main drive motor.",
        assemblyOrder: 1,
        connections: ["Rotating Turntable", "Booth Frame"],
        failureEffect: "Vibrations causing uneven glaze application.",
        cascadeFailures: ["Motor wear", "Alignment issues"],
        originalPosition: { x: 0, y: -0.25, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 },
        mesh: baseMesh
    });

    // 2. Rotating Turntable
    const turntableGeo = new THREE.CylinderGeometry(2, 2, 0.2, 32);
    const turntableMesh = new THREE.Mesh(turntableGeo, chrome);
    turntableMesh.position.set(0, 0.1, 0);
    group.add(turntableMesh);
    parts.push({
        name: "Rotating Turntable",
        description: "Precision-machined chrome table that rotates the ceramic piece for even coating.",
        material: "chrome",
        function: "Spins the pottery during the glaze spraying process.",
        assemblyOrder: 2,
        connections: ["Base Platform", "Pottery Piece"],
        failureEffect: "Stuttering rotation resulting in dripping glaze.",
        cascadeFailures: ["Spoiled batch", "Excessive glaze waste"],
        originalPosition: { x: 0, y: 0.1, z: 0 },
        explodedPosition: { x: 0, y: 2, z: 0 },
        mesh: turntableMesh
    });

    // 3. Pottery Piece (The target)
    const potGeo = new THREE.LatheGeometry([
        new THREE.Vector2(0, 0),
        new THREE.Vector2(1.2, 0.5),
        new THREE.Vector2(1.5, 1.5),
        new THREE.Vector2(1.0, 2.5),
        new THREE.Vector2(0.8, 3.0),
        new THREE.Vector2(1.0, 3.5),
    ], 32);
    const potMesh = new THREE.Mesh(potGeo, steel); // Unfired clay material placeholder
    potMesh.position.set(0, 0.2, 0);
    group.add(potMesh);
    parts.push({
        name: "Ceramic Vessel",
        description: "The unfired bisque ware receiving the glaze treatment.",
        material: "steel", // Placeholder for bisque
        function: "The product being manufactured.",
        assemblyOrder: 3,
        connections: ["Rotating Turntable"],
        failureEffect: "Product falls off.",
        cascadeFailures: ["Shattering", "Equipment collision"],
        originalPosition: { x: 0, y: 0.2, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 },
        mesh: potMesh
    });

    // 4. Glaze Booth Enclosure
    const boothGeo = new THREE.BoxGeometry(7, 8, 7);
    const boothMesh = new THREE.Mesh(boothGeo, boothGlass);
    boothMesh.position.set(0, 4, 0);
    group.add(boothMesh);
    parts.push({
        name: "Containment Booth",
        description: "Transparent enclosure to contain hazardous atomized glaze particles.",
        material: "tintedGlass",
        function: "Prevents environmental contamination and reclaims overspray.",
        assemblyOrder: 4,
        connections: ["Base Platform", "Exhaust System"],
        failureEffect: "Toxic particulate leak into the workspace.",
        cascadeFailures: ["HVAC contamination", "Health hazards"],
        originalPosition: { x: 0, y: 4, z: 0 },
        explodedPosition: { x: 0, y: 12, z: 0 },
        mesh: boothMesh
    });

    // 5. Robotic Arm (Base)
    const armBaseGeo = new THREE.CylinderGeometry(0.5, 0.6, 1.5, 16);
    const armBaseMesh = new THREE.Mesh(armBaseGeo, aluminum);
    armBaseMesh.position.set(2.5, 1, 2.5);
    group.add(armBaseMesh);
    parts.push({
        name: "Robotic Arm Base",
        description: "Actuator housing for the 6-axis spray robot.",
        material: "aluminum",
        function: "Pivots the main arm assembly.",
        assemblyOrder: 5,
        connections: ["Base Platform", "Lower Arm"],
        failureEffect: "Loss of calibration.",
        cascadeFailures: ["Collision with pottery"],
        originalPosition: { x: 2.5, y: 1, z: 2.5 },
        explodedPosition: { x: 6, y: 1, z: 6 },
        mesh: armBaseMesh
    });

    // 6. Robotic Arm (Lower)
    const lowerArmGeo = new THREE.BoxGeometry(0.4, 3, 0.4);
    const lowerArmMesh = new THREE.Mesh(lowerArmGeo, copper);
    lowerArmMesh.position.set(2.5, 2.5, 2.5);
    lowerArmMesh.rotation.z = Math.PI / 6;
    group.add(lowerArmMesh);
    parts.push({
        name: "Lower Articulation Arm",
        description: "Primary reach extension for the spray nozzle.",
        material: "copper",
        function: "Positions the spray head vertically and horizontally.",
        assemblyOrder: 6,
        connections: ["Robotic Arm Base", "Upper Arm"],
        failureEffect: "Drift in positioning.",
        cascadeFailures: ["Uneven glaze thickness"],
        originalPosition: { x: 2.5, y: 2.5, z: 2.5 },
        explodedPosition: { x: 8, y: 3, z: 8 },
        mesh: lowerArmMesh
    });

    // 7. Spray Nozzle
    const nozzleGeo = new THREE.CylinderGeometry(0.1, 0.2, 0.8, 16);
    const nozzleMesh = new THREE.Mesh(nozzleGeo, chrome);
    nozzleMesh.position.set(1.5, 3.5, 1.5);
    nozzleMesh.rotation.set(-Math.PI/4, Math.PI/4, 0);
    group.add(nozzleMesh);
    parts.push({
        name: "Atomizer Nozzle",
        description: "High-pressure nozzle that atomizes the liquid glaze.",
        material: "chrome",
        function: "Delivers a fine, controlled mist of glaze to the ceramic surface.",
        assemblyOrder: 7,
        connections: ["Lower Articulation Arm", "Glaze Supply Line"],
        failureEffect: "Clogging or sputtering.",
        cascadeFailures: ["Ruined surface finish", "Pressure buildup in lines"],
        originalPosition: { x: 1.5, y: 3.5, z: 1.5 },
        explodedPosition: { x: 10, y: 6, z: 10 },
        mesh: nozzleMesh
    });

    // 8. Glaze Particle Stream (Neon effect)
    const particleCount = 1000;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for(let i=0; i<particleCount * 3; i++) {
        particlePositions[i] = (Math.random() - 0.5) * 2;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
        color: 0x00ffff,
        size: 0.1,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    particleSystem.position.set(0.8, 2.5, 0.8);
    group.add(particleSystem);
    parts.push({
        name: "Atomized Glaze Stream",
        description: "Suspended particles of high-tech neon reactive glaze.",
        material: "neonCyan",
        function: "Coats the ceramic piece uniformly.",
        assemblyOrder: 8,
        connections: ["Atomizer Nozzle", "Ceramic Vessel"],
        failureEffect: "Overspray or dry patches.",
        cascadeFailures: ["Wasted material"],
        originalPosition: { x: 0.8, y: 2.5, z: 0.8 },
        explodedPosition: { x: 12, y: 8, z: 12 },
        mesh: particleSystem
    });

    const description = "The Automated Ceramics Glaze Booth represents the pinnacle of robotic surface finishing. Using a 6-axis copper and aluminum manipulator arm, it applies high-precision atomized reactive glazes (such as neon cyan variants) to bisque-fired ceramics. The entire process takes place within a negative-pressure containment booth to capture overspray and protect operators from hazardous silica and heavy metal particulates.";

    const quizQuestions = [
        {
            question: "What is the primary function of the negative-pressure containment booth?",
            options: ["To cure the glaze instantly", "To capture hazardous overspray and protect operators", "To keep the pottery warm", "To improve visibility"],
            correct: 1,
            explanation: "Glazes contain fine silica and heavy metals. The containment booth ensures these toxic particulates do not enter the operator's workspace, maintaining a safe environment and allowing for material reclamation.",
            difficulty: "easy"
        },
        {
            question: "Why does the Atomizer Nozzle require regular maintenance and cleaning?",
            options: ["To prevent the chrome from rusting", "To keep the robotic arm calibrated", "To prevent clogging and sputtering of the glaze", "To change the color of the spray"],
            correct: 2,
            explanation: "Glazes are suspensions of solid particles in liquid. If left to dry or accumulate, they will quickly clog the fine aperture of the atomizer, causing sputtering and uneven application.",
            difficulty: "medium"
        },
        {
            question: "What cascade failure is likely to result if the Rotating Turntable's motor begins to stutter?",
            options: ["The containment booth will shatter", "The atomized glaze stream will turn a different color", "The robot arm will collide with the pottery", "The glaze application will be uneven, potentially ruining the batch"],
            correct: 3,
            explanation: "The turntable provides continuous, even rotation to ensure all sides of the pottery receive a uniform coat of glaze. Stuttering will cause pooling in some areas and dry patches in others.",
            difficulty: "hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Rotate turntable and pot
        const turntable = meshes.find(m => m.name === "Rotating Turntable")?.mesh;
        const pot = meshes.find(m => m.name === "Ceramic Vessel")?.mesh;
        
        if (turntable) turntable.rotation.y = time * speed * 2;
        if (pot) pot.rotation.y = time * speed * 2;

        // Animate robotic arm swinging slightly
        const armBase = meshes.find(m => m.name === "Robotic Arm Base")?.mesh;
        const lowerArm = meshes.find(m => m.name === "Lower Articulation Arm")?.mesh;
        const nozzle = meshes.find(m => m.name === "Atomizer Nozzle")?.mesh;
        
        if (armBase) armBase.rotation.y = Math.sin(time * speed) * 0.2;
        if (lowerArm) lowerArm.position.y = 2.5 + Math.sin(time * speed * 1.5) * 0.2;
        if (nozzle) nozzle.position.y = 3.5 + Math.sin(time * speed * 1.5) * 0.2;

        // Animate particle stream
        const particles = meshes.find(m => m.name === "Atomized Glaze Stream")?.mesh;
        if (particles) {
            const positions = particles.geometry.attributes.position.array;
            for(let i=0; i<positions.length; i+=3) {
                // move particles towards the pot (0,0,0 approximately relative to stream)
                positions[i] -= 0.05 * speed; // x
                positions[i+1] -= 0.02 * speed; // y
                positions[i+2] -= 0.05 * speed; // z

                // Reset particles if they go too far
                if(positions[i] < -1 || positions[i+2] < -1) {
                    positions[i] = (Math.random() - 0.5) * 2;
                    positions[i+1] = (Math.random() - 0.5) * 2;
                    positions[i+2] = (Math.random() - 0.5) * 2;
                }
            }
            particles.geometry.attributes.position.needsUpdate = true;
            
            // Pulsing color effect
            particles.material.color.setHSL((time * speed * 0.1) % 1, 1, 0.5);
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createGlazeBooth() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
