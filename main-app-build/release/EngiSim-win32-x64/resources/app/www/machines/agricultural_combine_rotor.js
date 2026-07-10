import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom glowing/neon materials for high-tech visual flair
    const glowGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.8,
        metalness: 0.1,
        roughness: 0.2
    });

    const glowBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.8,
        metalness: 0.1,
        roughness: 0.2
    });

    const glowOrange = new THREE.MeshStandardMaterial({
        color: 0xff6600,
        emissive: 0xff4400,
        emissiveIntensity: 0.9,
        metalness: 0.3,
        roughness: 0.4
    });

    // 1. Main Rotor Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.5, 0.5, 12, 32);
    const shaftMesh = new THREE.Mesh(shaftGeo, chrome);
    shaftMesh.rotation.z = Math.PI / 2;
    group.add(shaftMesh);
    meshes.shaft = shaftMesh;

    parts.push({
        name: "Main Rotor Shaft",
        description: "The central axis of the threshing rotor that transmits power and supports the threshing elements.",
        material: "Chrome / Steel",
        function: "Provides structural integrity and rotational drive to the entire threshing mechanism.",
        assemblyOrder: 1,
        connections: ["Drive Pulley", "Rotor Tube"],
        failureEffect: "Complete failure of the threshing system; violent vibrations.",
        cascadeFailures: ["Bearings", "Drive Belts", "Concaves"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // 2. Rotor Tube
    const tubeGeo = new THREE.CylinderGeometry(1.5, 1.5, 11, 32);
    const tubeMesh = new THREE.Mesh(tubeGeo, steel);
    tubeMesh.rotation.z = Math.PI / 2;
    group.add(tubeMesh);
    meshes.tube = tubeMesh;

    parts.push({
        name: "Rotor Tube",
        description: "Large diameter cylindrical shell mounted on the main shaft.",
        material: "Steel",
        function: "Mounting surface for rasp bars and separation tines. Creates the centrifugal force necessary for threshing.",
        assemblyOrder: 2,
        connections: ["Main Rotor Shaft", "Rasp Bars", "Separation Tines"],
        failureEffect: "Material buildup, inefficient threshing, imbalance.",
        cascadeFailures: ["Main Rotor Shaft"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    // 3. Rasp Bars (Threshing Elements)
    const raspGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        // Front section for threshing
        const raspGeo = new THREE.BoxGeometry(4, 0.2, 0.4);
        const rasp = new THREE.Mesh(raspGeo, darkSteel);
        const angle = (Math.PI / 2) * i;
        rasp.position.x = -3.5;
        rasp.position.y = Math.cos(angle) * 1.6;
        rasp.position.z = Math.sin(angle) * 1.6;
        rasp.rotation.x = angle;
        
        // Add glowing wear indicators
        const wearGeo = new THREE.BoxGeometry(4.01, 0.05, 0.05);
        const wear = new THREE.Mesh(wearGeo, glowOrange);
        wear.position.set(0, 0.1, 0);
        rasp.add(wear);

        raspGroup.add(rasp);
    }
    group.add(raspGroup);
    meshes.raspGroup = raspGroup;

    parts.push({
        name: "Rasp Bars",
        description: "Serrated steel bars mounted on the front section of the rotor.",
        material: "Dark Steel / Hardened Alloy",
        function: "Rub against the crop mat to separate grain from the ear or pod.",
        assemblyOrder: 3,
        connections: ["Rotor Tube", "Concaves (Clearance)"],
        failureEffect: "Unthreshed grain (white caps), excessive grain damage.",
        cascadeFailures: ["Concaves", "Cleaning Shoe Load"],
        originalPosition: { x: -3.5, y: 0, z: 0 },
        explodedPosition: { x: -3.5, y: 4, z: 4 }
    });

    // 4. Separation Tines
    const tineGroup = new THREE.Group();
    for(let i=0; i<6; i++) {
        const rowAngle = (Math.PI / 3) * i;
        for(let j=0; j<8; j++) {
            const tineGeo = new THREE.CylinderGeometry(0.05, 0.1, 0.8, 8);
            const tine = new THREE.Mesh(tineGeo, aluminum);
            
            // Tines are mostly in the rear section (separation area)
            tine.position.x = -1 + (j * 0.8);
            tine.position.y = Math.cos(rowAngle + (j * 0.2)) * 1.8;
            tine.position.z = Math.sin(rowAngle + (j * 0.2)) * 1.8;
            
            // Point outward
            tine.rotation.x = rowAngle + (j * 0.2) + Math.PI/2;
            
            // Add blue glow tips for high-tech look
            const tipGeo = new THREE.SphereGeometry(0.08, 8, 8);
            const tip = new THREE.Mesh(tipGeo, glowBlue);
            tip.position.y = 0.4;
            tine.add(tip);

            tineGroup.add(tine);
        }
    }
    group.add(tineGroup);
    meshes.tineGroup = tineGroup;

    parts.push({
        name: "Separation Tines",
        description: "Fingers extending from the rear section of the rotor tube.",
        material: "Aluminum / Steel with Blue Plasma Tips",
        function: "Agitate the crop mat to release trapped grain through the separation grates.",
        assemblyOrder: 4,
        connections: ["Rotor Tube", "Separation Grates"],
        failureEffect: "High grain loss over the rotor (rotor loss).",
        cascadeFailures: ["Chopper/Spreader overload"],
        originalPosition: { x: 2, y: 0, z: 0 },
        explodedPosition: { x: 2, y: 0, z: -6 }
    });

    // 5. Concaves (Cage)
    const concaveGeo = new THREE.CylinderGeometry(2.0, 2.0, 10, 32, 1, true, Math.PI, Math.PI);
    const concaveMat = new THREE.MeshStandardMaterial({
        color: 0x444444,
        wireframe: true,
        transparent: true,
        opacity: 0.5
    });
    const concaveMesh = new THREE.Mesh(concaveGeo, concaveMat);
    concaveMesh.rotation.z = Math.PI / 2;
    concaveMesh.position.y = -0.2; // Offset slightly down
    group.add(concaveMesh);
    meshes.concaves = concaveMesh;

    parts.push({
        name: "Threshing Concaves",
        description: "Curved, grated grates located under the rotor.",
        material: "Wireframe Steel Grid",
        function: "Provides the friction surface against which the rasp bars rub the crop. Allows threshed grain to fall through.",
        assemblyOrder: 5,
        connections: ["Combine Frame", "Rotor Clearance Actuators"],
        failureEffect: "Plugging, grain damage, unthreshed grain.",
        cascadeFailures: ["Rotor Drive Belt"],
        originalPosition: { x: 0, y: -0.2, z: 0 },
        explodedPosition: { x: 0, y: -8, z: 0 }
    });

    // 6. Material Flow Visualization (Neon Green Particles)
    const flowGeo = new THREE.BufferGeometry();
    const particleCount = 200;
    const posArray = new Float32Array(particleCount * 3);
    for(let i=0; i<particleCount*3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }
    flowGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const flowMat = new THREE.PointsMaterial({
        size: 0.15,
        color: 0x00ff00,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    const flowParticles = new THREE.Points(flowGeo, flowMat);
    group.add(flowParticles);
    meshes.flowParticles = flowParticles;

    parts.push({
        name: "Grain Flow Projection",
        description: "Holographic visualization of grain separating from Material Other than Grain (MOG).",
        material: "Neon Green Light",
        function: "Visualizes the helical path of crop material through the threshing and separation zones.",
        assemblyOrder: 6,
        connections: [],
        failureEffect: "N/A (Visual only)",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -8, y: 0, z: 0 }
    });

    const description = "The Agricultural Combine Threshing Rotor is the heart of a modern rotary combine harvester. It uses a single (or twin) longitudinal rotor to perform both threshing and separation. As the crop enters, the rasp bars rub it against the concaves to separate the grain. The material then moves in a helical path towards the rear, where separation tines agitate it to release remaining trapped grain through centrifugal force. This high-tech visualization features glowing wear indicators and a holographic particle system to track grain flow.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Rasp Bars?",
            options: [
                "To cool the rotor tube",
                "To rub the crop against concaves and separate grain",
                "To chop the straw into small pieces",
                "To transport grain to the grain tank"
            ],
            correct: 1,
            explanation: "Rasp bars are aggressive serrated elements on the front of the rotor that provide the rubbing action against the concaves needed to thresh (release) the grain from the ear or pod.",
            difficulty: "Medium"
        },
        {
            question: "In a rotary combine, how does crop material move through the rotor housing?",
            options: [
                "In a straight linear path",
                "In a figure-eight motion",
                "In a helical (spiral) path from front to rear",
                "It drops straight down immediately"
            ],
            correct: 2,
            explanation: "Guide vanes inside the rotor housing cause the crop mat to travel in a helical, spiraling path as the rotor spins, maximizing the time and area for separation.",
            difficulty: "Medium"
        },
        {
            question: "What would likely happen if the clearance between the rotor and concaves is too tight?",
            options: [
                "Grain loss over the rotor will increase",
                "The crop will not be threshed at all",
                "Excessive grain damage (cracking) will occur",
                "The rotor will spin faster"
            ],
            correct: 2,
            explanation: "If the concave clearance is too tight for the crop volume, the grain will be subjected to excessive pressure and grinding, leading to cracked and damaged kernels.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Base rotation speed
        const rotSpeed = 2 * speed;
        
        // Rotate the main spinning elements
        if(meshes.shaft) meshes.shaft.rotation.x = time * rotSpeed;
        if(meshes.tube) meshes.tube.rotation.x = time * rotSpeed;
        
        // Rasp bars and tines are attached to the tube, but in this structure we rotate their groups
        if(meshes.raspGroup) meshes.raspGroup.rotation.x = time * rotSpeed;
        if(meshes.tineGroup) meshes.tineGroup.rotation.x = time * rotSpeed;

        // Animate the grain flow particles in a helical pattern
        if(meshes.flowParticles) {
            const positions = meshes.flowParticles.geometry.attributes.position.array;
            for(let i = 0; i < positions.length; i += 3) {
                // Move x backwards (towards rear of combine)
                positions[i] += 0.05 * speed;
                
                // Helical motion around X axis
                const y = positions[i+1];
                const z = positions[i+2];
                const radius = Math.sqrt(y*y + z*z);
                let angle = Math.atan2(z, y);
                
                // Particles swirl with the rotor
                angle += 0.1 * speed;
                
                // Keep particles bounded
                if (positions[i] > 6) {
                    positions[i] = -6; // Reset to front
                    // Randomize entry angle and radius
                    const newAngle = Math.random() * Math.PI * 2;
                    const newRad = 1.0 + Math.random() * 1.0;
                    positions[i+1] = Math.cos(newAngle) * newRad;
                    positions[i+2] = Math.sin(newAngle) * newRad;
                } else {
                    // Slight centrifugal expansion
                    let currentRad = radius;
                    if(currentRad < 2.0 && positions[i] > -2) currentRad += 0.01 * speed;
                    
                    positions[i+1] = Math.cos(angle) * currentRad;
                    positions[i+2] = Math.sin(angle) * currentRad;
                }
            }
            meshes.flowParticles.geometry.attributes.position.needsUpdate = true;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createCombineHarvesterRotor() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
