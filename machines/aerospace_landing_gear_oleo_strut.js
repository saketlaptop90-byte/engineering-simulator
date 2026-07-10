import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Glowing/High-Tech Materials
    const neonBlue = new THREE.MeshPhysicalMaterial({
        color: 0x00f0ff,
        emissive: 0x00aaff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.5,
        roughness: 0.1,
        metalness: 0.8
    });

    const neonOrange = new THREE.MeshPhysicalMaterial({
        color: 0xff5500,
        emissive: 0xff2200,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.7,
        roughness: 0.2
    });

    const holoMatrix = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        emissive: 0x00ff88,
        emissiveIntensity: 1,
        wireframe: true,
        transparent: true,
        opacity: 0.5
    });

    // 1. Outer Cylinder
    const cylinderGeo = new THREE.CylinderGeometry(1.5, 1.5, 8, 32);
    const cylinderMesh = new THREE.Mesh(cylinderGeo, darkSteel);
    cylinderMesh.position.set(0, 4, 0);
    group.add(cylinderMesh);
    meshes.outerCylinder = cylinderMesh;

    parts.push({
        name: "Outer Cylinder",
        description: "The main structural housing of the oleo strut, holding the high-pressure gas and hydraulic fluid.",
        material: "Dark Steel / Chrome",
        function: "Contains the internal components and withstands immense landing impact forces.",
        assemblyOrder: 1,
        connections: ["Nitrogen Chamber", "Hydraulic Chamber", "Torque Links"],
        failureEffect: "Structural collapse of the landing gear, leading to catastrophic fuselage impact.",
        cascadeFailures: ["Rupture of gas/fluid seals", "Bent strut"],
        originalPosition: { x: 0, y: 4, z: 0 },
        explodedPosition: { x: -5, y: 5, z: 0 }
    });

    // 2. Inner Piston / Strut
    const pistonGeo = new THREE.CylinderGeometry(1.2, 1.2, 6, 32);
    const pistonMesh = new THREE.Mesh(pistonGeo, chrome);
    pistonMesh.position.set(0, -3, 0);
    group.add(pistonMesh);
    meshes.innerPiston = pistonMesh;

    parts.push({
        name: "Inner Piston",
        description: "The lower sliding tube that compresses into the main cylinder upon landing.",
        material: "Hard Chrome",
        function: "Transfers the impact load from the wheels into the shock-absorbing fluids.",
        assemblyOrder: 2,
        connections: ["Outer Cylinder", "Axle", "Metering Pin"],
        failureEffect: "Jamming of the strut, transferring full shock to the airframe.",
        cascadeFailures: ["Tire blowout", "Airframe structural damage"],
        originalPosition: { x: 0, y: -3, z: 0 },
        explodedPosition: { x: 5, y: -4, z: 0 }
    });

    // 3. Metering Pin
    const pinGeo = new THREE.CylinderGeometry(0.2, 0.5, 5, 16);
    const pinMesh = new THREE.Mesh(pinGeo, copper);
    pinMesh.position.set(0, 3.5, 0); // Sticking out top of piston
    pistonMesh.add(pinMesh);
    meshes.meteringPin = pinMesh;

    parts.push({
        name: "Metering Pin",
        description: "A tapered pin that moves through the orifice plate to regulate fluid flow.",
        material: "Copper/Steel Alloy",
        function: "Varies the size of the fluid passage during compression to provide progressive shock absorption.",
        assemblyOrder: 3,
        connections: ["Inner Piston", "Orifice Plate"],
        failureEffect: "Loss of damping control, causing a rapid bottom-out or harsh recoil.",
        cascadeFailures: ["Hydraulic blowout", "Landing gear collapse"],
        originalPosition: { x: 0, y: 0.5, z: 0 },
        explodedPosition: { x: 0, y: 1, z: 5 }
    });

    // 4. Orifice Plate
    const orificeGeo = new THREE.CylinderGeometry(1.4, 1.4, 0.2, 32);
    const orificeMesh = new THREE.Mesh(orificeGeo, steel);
    orificeMesh.position.set(0, -4, 0); // Inside outer cylinder, world y=0
    cylinderMesh.add(orificeMesh);
    meshes.orificePlate = orificeMesh;

    parts.push({
        name: "Orifice Plate",
        description: "A restricted opening between the upper and lower chambers.",
        material: "High-Strength Steel",
        function: "Forces hydraulic fluid through a narrow gap, converting kinetic energy into heat.",
        assemblyOrder: 4,
        connections: ["Outer Cylinder", "Metering Pin"],
        failureEffect: "Instant fluid bypass, nullifying shock absorption.",
        cascadeFailures: ["Seal rupture", "Strut bottom-out"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -3, y: 0, z: -4 }
    });

    // 5. Nitrogen Gas Chamber (Visual)
    const gasGeo = new THREE.CylinderGeometry(1.3, 1.3, 7, 32);
    gasGeo.translate(0, 3.5, 0); // origin at bottom
    const gasMesh = new THREE.Mesh(gasGeo, neonBlue);
    gasMesh.position.set(0, -3.8, 0); // Bottom just above orifice (relative to cylinder y=4)
    cylinderMesh.add(gasMesh);
    meshes.gasChamber = gasMesh;

    parts.push({
        name: "Nitrogen Gas Chamber",
        description: "The upper section of the strut filled with highly compressed nitrogen gas.",
        material: "Plasma/Gas (Neon Blue)",
        function: "Acts as an air spring to bear the static weight of the aircraft and return the strut to extension.",
        assemblyOrder: 5,
        connections: ["Outer Cylinder", "Hydraulic Fluid"],
        failureEffect: "Strut collapses under static weight.",
        cascadeFailures: ["Loss of steering", "Ground clearance loss"],
        originalPosition: { x: 0, y: 4, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 3 }
    });

    // 6. Hydraulic Fluid Chamber (Visual)
    const fluidGeo = new THREE.CylinderGeometry(1.3, 1.3, 2, 32);
    fluidGeo.translate(0, -1, 0); // origin at top
    const fluidMesh = new THREE.Mesh(fluidGeo, neonOrange);
    fluidMesh.position.set(0, -4.2, 0); // Top just below orifice (relative to cylinder y=4)
    cylinderMesh.add(fluidMesh);
    meshes.fluidChamber = fluidMesh;

    // Fluid Particles
    const particlesGeo = new THREE.BufferGeometry();
    const particleCount = 60;
    const posArray = new Float32Array(particleCount * 3);
    for(let i=0; i<particleCount; i++) {
        posArray[i*3] = (Math.random() - 0.5) * 2.4; 
        posArray[i*3 + 1] = -(Math.random() * 2);    
        posArray[i*3 + 2] = (Math.random() - 0.5) * 2.4; 
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
        size: 0.1,
        color: 0xffdd88,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    const particlesMesh = new THREE.Points(particlesGeo, particleMat);
    fluidMesh.add(particlesMesh);
    meshes.particles = particlesMesh;

    parts.push({
        name: "Hydraulic Fluid Chamber",
        description: "The lower section filled with specialized aviation hydraulic fluid (MIL-PRF-5606).",
        material: "Hydraulic Liquid (Neon Orange)",
        function: "Provides viscous damping by resisting flow through the orifice during impact.",
        assemblyOrder: 6,
        connections: ["Outer Cylinder", "Orifice Plate", "Inner Piston"],
        failureEffect: "Violent bouncing upon landing due to lack of damping.",
        cascadeFailures: ["Nitrogen seal breach", "Structural fatigue"],
        originalPosition: { x: 0, y: -1, z: 0 },
        explodedPosition: { x: 0, y: -2, z: -3 }
    });

    // 7. Torque Links (Scissors)
    const linkGeo = new THREE.BoxGeometry(0.5, 2.5, 0.3);
    const upperLink = new THREE.Mesh(linkGeo, aluminum);
    const lowerLink = new THREE.Mesh(linkGeo, aluminum);
    
    // Joint
    const jointGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const jointMesh = new THREE.Mesh(jointGeo, chrome);
    
    group.add(upperLink);
    group.add(lowerLink);
    group.add(jointMesh);

    meshes.upperLink = upperLink;
    meshes.lowerLink = lowerLink;
    meshes.jointMesh = jointMesh;

    parts.push({
        name: "Torque Links",
        description: "Scissor-like articulating arms connecting the cylinder and piston.",
        material: "Forged Aluminum",
        function: "Prevents the inner piston and wheel from rotating freely, keeping the wheel aligned.",
        assemblyOrder: 7,
        connections: ["Outer Cylinder", "Inner Piston"],
        failureEffect: "Wheel castering or turning sideways upon landing.",
        cascadeFailures: ["Tire shredding", "Gear shear-off", "Runway excursion"],
        originalPosition: { x: 0, y: -2, z: 2 },
        explodedPosition: { x: 4, y: -2, z: 4 }
    });

    // 8. Axle and Wheel Hub
    const axleGeo = new THREE.CylinderGeometry(0.8, 0.8, 4, 32);
    const axleMesh = new THREE.Mesh(axleGeo, darkSteel);
    axleMesh.rotation.z = Math.PI / 2;
    axleMesh.position.set(0, -2.5, 0); 
    pistonMesh.add(axleMesh);
    meshes.axle = axleMesh;

    const hubGeo = new THREE.TorusGeometry(1.2, 0.4, 16, 32);
    const hub1 = new THREE.Mesh(hubGeo, steel);
    hub1.rotation.y = Math.PI / 2;
    hub1.position.set(-2, 0, 0);
    axleMesh.add(hub1);

    const hub2 = new THREE.Mesh(hubGeo, steel);
    hub2.rotation.y = Math.PI / 2;
    hub2.position.set(2, 0, 0);
    axleMesh.add(hub2);

    meshes.hub1 = hub1;
    meshes.hub2 = hub2;

    parts.push({
        name: "Axle and Wheel Hubs",
        description: "The mounting points for the aircraft tires and brake assemblies.",
        material: "High-Strength Steel",
        function: "Supports the wheels and transfers ground forces into the strut.",
        assemblyOrder: 8,
        connections: ["Inner Piston"],
        failureEffect: "Loss of wheel attachment, dragging strut on runway.",
        cascadeFailures: ["Fire", "Directional control loss"],
        originalPosition: { x: 0, y: -5.5, z: 0 },
        explodedPosition: { x: -4, y: -6, z: 0 }
    });

    // Holographic data rings (visual flair)
    const ringGeo = new THREE.TorusGeometry(2.2, 0.05, 16, 64);
    const ring1 = new THREE.Mesh(ringGeo, holoMatrix);
    ring1.rotation.x = Math.PI / 2;
    ring1.position.set(0, 4, 0);
    group.add(ring1);
    
    const ring2 = new THREE.Mesh(ringGeo, holoMatrix);
    ring2.rotation.x = Math.PI / 2;
    ring2.position.set(0, -2, 0);
    group.add(ring2);

    meshes.ring1 = ring1;
    meshes.ring2 = ring2;

    const description = "An ultra high-tech simulation of an Aerospace Landing Gear Oleo Strut. This shock absorber uses a combination of compressed nitrogen gas (spring) and hydraulic fluid (damping) to mitigate the extreme kinetic energy of aircraft landings. Visualized with glowing internal fluids and holographic telemetry rings.";

    const quizQuestions = [
        {
            question: "What is the primary function of the compressed nitrogen gas in an oleo strut?",
            options: [
                "To cool the hydraulic fluid",
                "To act as a pneumatic spring to support aircraft weight",
                "To lubricate the inner piston",
                "To drive the wheel brakes"
            ],
            correct: 1,
            explanation: "Nitrogen acts as an air spring, absorbing the static weight of the aircraft and pushing the strut back to full extension after compression.",
            difficulty: "Medium"
        },
        {
            question: "How does the metering pin provide variable shock absorption?",
            options: [
                "It restricts the flow of hydraulic fluid through the orifice as the strut compresses",
                "It compresses the nitrogen gas directly",
                "It locks the torque links in place",
                "It measures the tire pressure"
            ],
            correct: 0,
            explanation: "As the strut compresses, the tapered metering pin moves into the orifice, gradually decreasing the opening size. This restricts fluid flow more at higher compressions, increasing damping resistance.",
            difficulty: "Hard"
        },
        {
            question: "Why are torque links (scissors) necessary on a landing gear strut?",
            options: [
                "To generate electricity",
                "To prevent the inner piston and wheel from rotating out of alignment",
                "To hold extra hydraulic fluid",
                "To absorb vertical shock"
            ],
            correct: 1,
            explanation: "Because the inner piston is perfectly cylindrical, it could spin freely inside the outer cylinder. Torque links prevent this rotation, keeping the wheels aligned with the direction of travel.",
            difficulty: "Medium"
        }
    ];

    let animationTime = 0;
    const tempVec1 = new THREE.Vector3();
    const tempVec2 = new THREE.Vector3();
    const tempVec3 = new THREE.Vector3();

    function animate(time, speed) {
        animationTime += speed * 0.02;

        // Simulate compression and extension (Landing cycle)
        const cycle = (animationTime % 4) / 4; 
        
        let compression = 0;
        if (cycle < 0.1) {
            compression = Math.sin((cycle / 0.1) * (Math.PI / 2)) * 2; // Max compression 2 units
        } else {
            compression = 2 - Math.sin(((cycle - 0.1) / 0.9) * (Math.PI / 2)) * 2;
        }

        // Apply compression to piston
        meshes.innerPiston.position.y = -3 + compression;

        // Gas compresses (scales down in Y)
        const gasScale = Math.max(0.1, (7 - compression) / 7);
        meshes.gasChamber.scale.y = gasScale;
        meshes.gasChamber.material.emissiveIntensity = 1.5 + (compression * 0.5); 

        // Fluid forces up through orifice
        meshes.fluidChamber.material.emissiveIntensity = 2.0 + (compression);

        // Fluid Particles animation
        const positions = meshes.particles.geometry.attributes.position.array;
        for(let i=0; i<60; i++) {
            positions[i*3 + 1] += 0.05 * speed * (1 + compression * 2); 
            if (positions[i*3 + 1] > 0) {
                positions[i*3 + 1] = -2; 
            }
        }
        meshes.particles.geometry.attributes.position.needsUpdate = true;

        // Torque links IK animation
        const upperAttachY = 0; // Bottom of outer cylinder
        const lowerAttachY = meshes.innerPiston.position.y - 1; 
        const h = upperAttachY - lowerAttachY;
        const L = 2.5; 
        const d = h / 2;
        
        const dClamped = Math.max(0.1, Math.min(L * 0.99, d));
        const alpha = Math.acos(dClamped / L); 
        
        const jointZ = 1.4 + Math.sin(alpha) * L;
        const jointY = lowerAttachY + dClamped;

        tempVec1.set(0, upperAttachY, 1.4);
        tempVec2.set(0, lowerAttachY, 1.4);
        tempVec3.set(0, jointY, jointZ);

        meshes.jointMesh.position.copy(tempVec3);

        meshes.upperLink.position.copy(tempVec1).add(tempVec3).multiplyScalar(0.5);
        meshes.upperLink.lookAt(tempVec3);
        meshes.upperLink.rotateX(Math.PI / 2);

        meshes.lowerLink.position.copy(tempVec2).add(tempVec3).multiplyScalar(0.5);
        meshes.lowerLink.lookAt(tempVec3);
        meshes.lowerLink.rotateX(Math.PI / 2);

        // Holographic rings rotation
        meshes.ring1.rotation.z += 0.05 * speed;
        meshes.ring2.rotation.z -= 0.03 * speed;
        meshes.ring1.position.y = 4 + Math.sin(animationTime * 2) * 0.1;
        meshes.ring2.position.y = meshes.innerPiston.position.y + 1 + Math.cos(animationTime * 2) * 0.1;
        
        // Wheel hubs spin
        let wheelSpeed = 0.5 * speed;
        if (cycle < 0.1) {
            wheelSpeed = 1.0 * speed;
        }
        meshes.hub1.rotation.x -= wheelSpeed;
        meshes.hub2.rotation.x -= wheelSpeed;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createLandingGearOleoStrut() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
