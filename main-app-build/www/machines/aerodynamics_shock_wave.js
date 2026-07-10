import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // 1. Wind Tunnel Chamber
    const chamberGeo = new THREE.CylinderGeometry(6, 6, 30, 32, 1, true);
    const chamberMat = glass.clone();
    chamberMat.transparent = true;
    chamberMat.opacity = 0.25;
    chamberMat.side = THREE.DoubleSide;
    chamberMat.transmission = 0.9;
    chamberMat.roughness = 0.0;
    const chamber = new THREE.Mesh(chamberGeo, chamberMat);
    chamber.rotation.z = Math.PI / 2;
    group.add(chamber);
    meshes.chamber = chamber;
    
    parts.push({
        name: "Wind Tunnel Chamber",
        description: "A high-strength glass and steel chamber capable of withstanding supersonic flow pressures. Offers 360-degree visibility for Schlieren photography.",
        material: "Reinforced Glass / High-Tensile Steel",
        function: "Contains the high-speed airflow and maintains the pressure differentials required for supersonic testing.",
        assemblyOrder: 1,
        connections: ["Supersonic Nozzle", "Diffuser"],
        failureEffect: "Catastrophic depressurization and explosive structural failure.",
        cascadeFailures: ["Supersonic Nozzle", "Test Model Mount"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 15, z: 0}
    });

    // 2. Supersonic Nozzle
    const nozzleGeo = new THREE.CylinderGeometry(3, 6, 6, 32, 1, true);
    const nozzleMat = aluminum.clone();
    nozzleMat.side = THREE.DoubleSide;
    const nozzle = new THREE.Mesh(nozzleGeo, nozzleMat);
    nozzle.rotation.z = Math.PI / 2;
    nozzle.position.x = -18;
    group.add(nozzle);
    meshes.nozzle = nozzle;
    
    parts.push({
        name: "Converging-Diverging Nozzle",
        description: "Accelerates the airflow from subsonic to supersonic speeds via a De Laval geometry.",
        material: "Aerospace Aluminum",
        function: "Chokes the flow at the throat to Mach 1, then expands it to higher Mach numbers.",
        assemblyOrder: 2,
        connections: ["Wind Tunnel Chamber", "Settling Chamber"],
        failureEffect: "Flow unstarts, forming a strong normal shock inside the nozzle, preventing supersonic conditions.",
        cascadeFailures: ["Test Model Mount"],
        originalPosition: {x: -18, y: 0, z: 0},
        explodedPosition: {x: -25, y: 0, z: 0}
    });

    // 3. Test Model (Supersonic Wedge)
    // A 2D-like wedge extruded or just a sharp cone. Let's use a sharp cone but flatten it.
    const wedgeGeo = new THREE.ConeGeometry(1.5, 6, 4);
    const wedge = new THREE.Mesh(wedgeGeo, darkSteel);
    wedge.rotation.z = -Math.PI / 2;
    wedge.rotation.x = Math.PI / 4; 
    wedge.scale.set(1, 1, 0.2); // Flatten to make it a 2D-like wedge
    wedge.position.x = 0;
    group.add(wedge);
    meshes.wedge = wedge;
    
    parts.push({
        name: "Test Article: 15° Wedge",
        description: "A precision-machined aerodynamic wedge designed to generate clean attached oblique shock waves.",
        material: "Dark Forged Steel",
        function: "Acts as the obstacle that forces the supersonic flow to turn, compressing the gas instantaneously.",
        assemblyOrder: 3,
        connections: ["Test Model Mount"],
        failureEffect: "Model fractures under immense dynamic pressure.",
        cascadeFailures: ["Wind Tunnel Chamber"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -10, z: 0}
    });

    // 4. Oblique Shock Wave (Neon Glowing Material)
    const shockMat = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.35,
        transmission: 0.5,
        roughness: 0.2,
        side: THREE.DoubleSide
    });
    
    // Create V-shaped planes for 2D wedge shock
    const shockGeo = new THREE.PlaneGeometry(6, 8);
    const topShock = new THREE.Mesh(shockGeo, shockMat);
    topShock.rotation.x = -Math.PI / 2;
    topShock.rotation.y = -Math.PI / 6; // Shock angle
    topShock.position.set(2.5, 1.5, 0);
    group.add(topShock);
    
    const bottomShock = new THREE.Mesh(shockGeo, shockMat);
    bottomShock.rotation.x = Math.PI / 2;
    bottomShock.rotation.y = Math.PI / 6; // Shock angle
    bottomShock.position.set(2.5, -1.5, 0);
    group.add(bottomShock);
    
    meshes.topShock = topShock;
    meshes.bottomShock = bottomShock;
    
    parts.push({
        name: "Oblique Shock Wave",
        description: "A nearly discontinuous compression boundary. Across this wave, pressure, temperature, and density skyrocket.",
        material: "Excited Air Plasma (Visualized)",
        function: "Slows the supersonic flow and turns it parallel to the wedge surface.",
        assemblyOrder: 4,
        connections: ["Test Article: 15° Wedge"],
        failureEffect: "Shock detachment leads to a detached bow shock, increasing drag exponentially.",
        cascadeFailures: [],
        originalPosition: {x: 2.5, y: 0, z: 0},
        explodedPosition: {x: 2.5, y: 8, z: 8}
    });

    // 5. Prandtl-Meyer Expansion Fan
    const expansionMat = new THREE.MeshPhysicalMaterial({
        color: 0xff4400,
        emissive: 0xff2200,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
    });
    
    const expTopGeo = new THREE.PlaneGeometry(8, 8);
    const expTop = new THREE.Mesh(expTopGeo, expansionMat);
    expTop.rotation.x = -Math.PI / 2;
    expTop.rotation.y = Math.PI / 8; // Expansion turning
    expTop.position.set(6, 1.5, 0);
    group.add(expTop);

    const expBottom = new THREE.Mesh(expTopGeo, expansionMat);
    expBottom.rotation.x = Math.PI / 2;
    expBottom.rotation.y = -Math.PI / 8; // Expansion turning
    expBottom.position.set(6, -1.5, 0);
    group.add(expBottom);

    meshes.expTop = expTop;
    meshes.expBottom = expBottom;

    parts.push({
        name: "Prandtl-Meyer Expansion Fan",
        description: "A continuous region where the flow negotiates a convex corner, expanding and accelerating.",
        material: "Rarefied Air (Visualized)",
        function: "Accelerates flow, drops static pressure, and decreases temperature.",
        assemblyOrder: 5,
        connections: ["Test Article: 15° Wedge"],
        failureEffect: "Extreme pressure gradients can cause boundary layer separation.",
        cascadeFailures: [],
        originalPosition: {x: 6, y: 0, z: 0},
        explodedPosition: {x: 6, y: -8, z: -8}
    });

    // 6. Particle Flow Emitters (Instanced Mesh)
    const particleCount = 600;
    const particleGeo = new THREE.CapsuleGeometry(0.02, 0.4, 4, 8);
    particleGeo.rotateZ(Math.PI / 2);
    const particleMat = new THREE.MeshBasicMaterial({ 
        color: 0xffffff, 
        transparent: true,
        opacity: 0.6
    });
    const particleInstancedMesh = new THREE.InstancedMesh(particleGeo, particleMat, particleCount);
    const dummy = new THREE.Object3D();
    const particlesData = [];
    
    for (let i = 0; i < particleCount; i++) {
        const x = -15 + Math.random() * 30;
        const y = -5 + Math.random() * 10;
        const z = -2 + Math.random() * 4;
        dummy.position.set(x, y, z);
        dummy.updateMatrix();
        particleInstancedMesh.setMatrixAt(i, dummy.matrix);
        particlesData.push({ 
            x, y, z, 
            speed: 40 + Math.random() * 20, 
            originalY: y 
        });
    }
    particleInstancedMesh.instanceMatrix.needsUpdate = true;
    group.add(particleInstancedMesh);
    meshes.particleInstancedMesh = particleInstancedMesh;
    meshes.particlesData = particlesData;
    meshes.dummy = dummy;

    parts.push({
        name: "PIV Seeding Particles",
        description: "Microscopic tracers injected into the flow to visualize velocity vectors and streamlines.",
        material: "Titanium Dioxide Aerosol",
        function: "Follows the gas streamlines instantly, scattering laser light for optical diagnostics.",
        assemblyOrder: 6,
        connections: ["Wind Tunnel Chamber"],
        failureEffect: "Agglomeration of particles damages test article.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 12}
    });

    const description = "The Aerodynamics Shock Wave Simulator visualizes the extreme physics of supersonic flight. It showcases flow choking, oblique shock wave compression, and Prandtl-Meyer expansion over a 15-degree wedge at Mach 2.5.";

    const quizQuestions = [
        {
            question: "What happens to the static pressure of a supersonic flow as it passes through an oblique shock wave?",
            options: ["It plummets", "It skyrockets", "It remains completely unchanged", "It fluctuates chaotically"],
            correct: 1,
            explanation: "An oblique shock wave is a compression wave. Across the shock, the flow is abruptly slowed down and compressed, causing pressure, density, and temperature to skyrocket.",
            difficulty: "Medium"
        },
        {
            question: "In the converging-diverging nozzle, where does the flow transition from subsonic to supersonic (Mach 1)?",
            options: ["At the wide inlet", "At the very exit", "At the narrowest point (throat)", "Anywhere in the diverging section"],
            correct: 2,
            explanation: "To accelerate gas to supersonic speeds, it must reach sonic velocity (Mach 1) exactly at the minimum cross-sectional area, known as the throat. It then accelerates further in the diverging section.",
            difficulty: "Hard"
        },
        {
            question: "How does a Prandtl-Meyer expansion fan differ from an oblique shock wave?",
            options: ["It compresses the flow discontinuously.", "It expands and accelerates the flow continuously.", "It only occurs in subsonic flow.", "It decreases the Mach number."],
            correct: 1,
            explanation: "While an oblique shock compresses and slows the flow suddenly, a Prandtl-Meyer expansion fan expands and accelerates the flow smoothly around a convex corner.",
            difficulty: "Medium"
        },
        {
            question: "Why does an oblique shock form on the wedge instead of a normal (bow) shock?",
            options: ["The Mach number is too low.", "The wedge angle is less than the maximum deflection angle for the given Mach number.", "The wedge is made of dark steel.", "The flow is actually subsonic."],
            correct: 1,
            explanation: "As long as the wedge angle is below the maximum detachment angle for a specific supersonic Mach number, the shock remains attached and oblique. If the angle is too blunt, a detached normal bow shock forms.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Particle animation
        const pd = meshes.particlesData;
        const pm = meshes.particleInstancedMesh;
        const d = meshes.dummy;
        
        for (let i = 0; i < pd.length; i++) {
            let p = pd[i];
            p.x += p.speed * speed * 0.05;
            
            // Flow deflection logic (approximate streamlines)
            if (p.x > -2.5 && p.x < 3) {
                // Interacting with the wedge
                if (Math.abs(p.y) < 1.5) {
                    if (p.y > 0) p.y += 0.05 * speed;
                    else p.y -= 0.05 * speed;
                }
            } else if (p.x >= 3 && p.x < 10) {
                // Expanding back down
                if (p.y > p.originalY && p.originalY > 0) p.y -= 0.03 * speed;
                if (p.y < p.originalY && p.originalY < 0) p.y += 0.03 * speed;
            }

            // Reset particle position
            if (p.x > 15) {
                p.x = -15;
                p.y = -5 + Math.random() * 10;
                p.z = -2 + Math.random() * 4;
                p.originalY = p.y;
            }
            
            d.position.set(p.x, p.y, p.z);
            d.updateMatrix();
            pm.setMatrixAt(i, d.matrix);
        }
        pm.instanceMatrix.needsUpdate = true;

        // High-frequency pulsating glow on shock waves to simulate plasma/density fluctuations
        const shockPulse = 1 + Math.sin(time * 30 * speed) * 0.05;
        meshes.topShock.scale.set(1, shockPulse, 1);
        meshes.bottomShock.scale.set(1, shockPulse, 1);
        
        const expPulse = 1 + Math.cos(time * 20 * speed) * 0.03;
        meshes.expTop.scale.set(1, expPulse, 1);
        meshes.expBottom.scale.set(1, expPulse, 1);
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createShockWave() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
