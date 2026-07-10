import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const stasisPodMat = new THREE.MeshPhysicalMaterial({ color: 0xeeeeff, metalness: 0.1, roughness: 0.0, transmission: 0.95, ior: 1.5, thickness: 0.2 }); // Medical glass
    const chassisMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.2, roughness: 0.1, clearcoat: 1.0 }); // Sterile hospital white
    const nanobotSwarmMat = new THREE.MeshPhysicalMaterial({ color: 0x888888, metalness: 1.0, roughness: 0.3 }); // Silver nano-assemblers
    const fluidPumpMat = new THREE.MeshPhysicalMaterial({ color: 0x445566, metalness: 0.7, roughness: 0.5 }); // Stainless steel pumps
    
    // VFX Materials
    const amnioticFluidVFX = new THREE.MeshPhysicalMaterial({ color: 0x00ffcc, metalness: 0.0, roughness: 0.1, transmission: 0.8, thickness: 1.0 }); // Oxygenated perfluorocarbon
    const cellularLaserVFX = new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // UV targeting lasers
    const bioFeedbackVFX = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Holographic vital signs

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.nanobots = [];
    group.userData.animatedMeshes.lasers = [];
    group.userData.animatedMeshes.fluid = null;
    group.userData.animatedMeshes.holograms = [];
    group.userData.animatedMeshes.scannerRing = null;

    // ==========================================
    // 1. PROCEDURAL CAD: The Stasis Pod & Chassis
    // ==========================================
    const chamberGroup = new THREE.Group();
    
    // The main sterile bed/base
    const bed = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.4, 2.8), chassisMat);
    bed.position.y = -0.2;
    chamberGroup.add(bed);
    
    // The transparent stasis pod cover (capsule shape half)
    const podCoverGeo = new THREE.CylinderGeometry(0.6, 0.6, 2.4, 32, 1, false, 0, Math.PI);
    const podCover = new THREE.Mesh(podCoverGeo, stasisPodMat);
    podCover.rotation.z = Math.PI/2;
    podCover.rotation.x = Math.PI/2;
    podCover.position.y = 0.0;
    chamberGroup.add(podCover);
    
    // Internal Amniotic Fluid (fills the pod)
    const fluidGeo = new THREE.CylinderGeometry(0.58, 0.58, 2.38, 32, 1, false, 0, Math.PI);
    const fluid = new THREE.Mesh(fluidGeo, amnioticFluidVFX);
    fluid.rotation.z = Math.PI/2;
    fluid.rotation.x = Math.PI/2;
    fluid.position.y = -0.01;
    chamberGroup.add(fluid);
    group.userData.animatedMeshes.fluid = fluid;
    
    group.add(chamberGroup);
    parts.push({ mesh: podCover, name: "Class-I Stasis Pod", description: "Hyper-baric, acoustically isolated glass enclosure.", function: "Submerges the patient in oxygenated perfluorocarbon fluid, allowing for total liquid ventilation and maintaining cellular stasis during the procedure."});

    // ==========================================
    // 2. PROCEDURAL CAD: Fluidics & Laser Scanner
    // ==========================================
    const mechanicalGroup = new THREE.Group();
    
    // Massive fluid pumps and filtration at the head and foot
    for(let pos of [-1.5, 1.5]) {
        const pump = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.4), fluidPumpMat);
        pump.position.set(0, -0.2, pos);
        mechanicalGroup.add(pump);
        
        // Tubing connecting pump to bed
        const tube1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5).rotateX(Math.PI/2), rubber);
        tube1.position.set(0.2, -0.2, pos > 0 ? 1.3 : -1.3);
        const tube2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5).rotateX(Math.PI/2), rubber);
        tube2.position.set(-0.2, -0.2, pos > 0 ? 1.3 : -1.3);
        mechanicalGroup.add(tube1, tube2);
    }
    
    // Translating Laser Scanner Ring (moves up and down the body)
    const scannerRing = new THREE.Group();
    
    // The physical ring
    const ringGeo = new THREE.TorusGeometry(0.7, 0.05, 16, 64, Math.PI);
    const ringMesh = new THREE.Mesh(ringGeo, chrome);
    ringMesh.rotation.x = -Math.PI/2;
    scannerRing.add(ringMesh);
    
    // UV Targeting Lasers shooting inwards
    const numLasers = 8;
    for(let i=0; i<numLasers; i++) {
        const angle = (i * Math.PI) / numLasers;
        const laser = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.6).rotateX(Math.PI/2), cellularLaserVFX);
        laser.position.set(0.4 * Math.cos(angle), 0.4 * Math.sin(angle), 0);
        laser.lookAt(0,0,0);
        scannerRing.add(laser);
        group.userData.animatedMeshes.lasers.push(laser);
    }
    
    scannerRing.position.y = 0.0;
    mechanicalGroup.add(scannerRing);
    group.userData.animatedMeshes.scannerRing = scannerRing;
    
    group.add(mechanicalGroup);
    parts.push({ mesh: mechanicalGroup.children[4], name: "UV Cellular Targeting Array", description: "Translating multi-axis laser scanner.", function: "Maps the patient's cellular structure in real-time, guiding the nanobots to specific senescent cells for targeted telomere extension."});

    // ==========================================
    // 3. PROCEDURAL CAD: Nanobot Swarm & Holograms
    // ==========================================
    const vfxGroup = new THREE.Group();
    
    // Telomerase Nanobots (Represented as a cloud of tiny silver specks swimming in the fluid)
    for(let i=0; i<60; i++) {
        const nano = new THREE.Mesh(new THREE.TetrahedronGeometry(0.02), nanobotSwarmMat);
        // Random position inside the fluid half-cylinder
        const r = Math.random() * 0.5;
        const theta = Math.random() * Math.PI;
        const z = (Math.random() - 0.5) * 2.2;
        
        nano.userData = {
            baseR: r, baseTheta: theta, baseZ: z,
            speed: 1.0 + Math.random(), phase: Math.random() * Math.PI * 2
        };
        
        vfxGroup.add(nano);
        group.userData.animatedMeshes.nanobots.push(nano);
    }
    
    // Holographic Bio-feedback Monitors (Floating above the patient)
    for(let i=0; i<3; i++) {
        // Floating screens showing sine waves (simulated by textured/wireframe planes)
        const holo = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.3), bioFeedbackVFX);
        holo.position.set(0.6, 0.8, -0.8 + (i * 0.8));
        holo.rotation.y = -Math.PI/6; // Angled towards user
        holo.userData = { phase: i * Math.PI/2 };
        vfxGroup.add(holo);
        group.userData.animatedMeshes.holograms.push(holo);
    }
    
    group.add(vfxGroup);
    parts.push({ mesh: vfxGroup.children[0], name: "Telomerase Nanobot Swarm", description: "Billions of synthetic enzymes.", function: "Physically repairs damaged DNA and extends cellular telomeres, effectively reversing biological aging at the molecular level."});

    // Scale adjustment
    group.scale.set(0.7, 0.7, 0.7);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // 1. Fluid gently circulates/pulses
            group.userData.animatedMeshes.fluid.material.opacity = 0.6 + (Math.sin(timeAcc * 2 * speed) * 0.2);
            
            // 2. Scanner Ring translates up and down the body
            const scanZ = Math.sin(timeAcc * 1.5 * speed) * 1.0;
            group.userData.animatedMeshes.scannerRing.position.z = scanZ;
            
            // Lasers fire while scanning
            group.userData.animatedMeshes.lasers.forEach(laser => {
                laser.material.opacity = 0.5 + (Math.random() * 0.5);
            });
            
            // 3. Nanobot Swarm swims actively
            group.userData.animatedMeshes.nanobots.forEach(nano => {
                // Swirl around the z-axis
                const t = timeAcc * nano.userData.speed * speed + nano.userData.phase;
                const r = nano.userData.baseR;
                const theta = nano.userData.baseTheta + (Math.sin(t) * 0.2); // Wiggle
                
                // Keep them inside the semi-circle (y > 0)
                let y = r * Math.sin(theta);
                if(y < 0) y = Math.abs(y); // Bounce off bottom
                
                nano.position.set(
                    r * Math.cos(theta),
                    y,
                    nano.userData.baseZ + (Math.cos(t * 0.5) * 0.2) // Drift along Z
                );
                
                nano.rotation.x += 0.1 * speed;
                nano.rotation.y += 0.2 * speed;
            });
            
            // 4. Holographic monitors flash vital signs
            group.userData.animatedMeshes.holograms.forEach(holo => {
                // Flash rapidly like EKG lines updating
                holo.material.opacity = 0.5 + (Math.sin(timeAcc * 10 * speed + holo.userData.phase) > 0.8 ? 0.5 : 0.0);
            });
            
        } else {
            // Idle
            group.userData.animatedMeshes.fluid.material.opacity = 0.5;
            group.userData.animatedMeshes.lasers.forEach(laser => laser.material.opacity = 0);
            group.userData.animatedMeshes.holograms.forEach(holo => holo.material.opacity = 0.1); // Standby glow
            // Nanobots drift very slowly
            group.userData.animatedMeshes.nanobots.forEach(nano => {
                nano.position.set(
                    nano.userData.baseR * Math.cos(nano.userData.baseTheta),
                    Math.abs(nano.userData.baseR * Math.sin(nano.userData.baseTheta)),
                    nano.userData.baseZ
                );
            });
        }
    };

    group.userData.parts = parts;
    return group;
}
