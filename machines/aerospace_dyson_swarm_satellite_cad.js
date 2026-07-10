import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Hyper-Realistic CAD Materials
    const kaptonSail = new THREE.MeshPhysicalMaterial({ color: 0xffcc00, metalness: 0.1, roughness: 0.2, transmission: 0.5, thickness: 0.01, side: THREE.DoubleSide }); // Ultra-thin solar film
    const carbonStruts = new THREE.MeshPhysicalMaterial({ color: 0x111111, metalness: 0.3, roughness: 0.8 }); // Lightweight structural framing
    const microwaveEmitter = new THREE.MeshPhysicalMaterial({ color: 0x8899aa, metalness: 0.9, roughness: 0.3 }); // Phased array antenna
    const stationCore = new THREE.MeshPhysicalMaterial({ color: 0xdddddd, metalness: 0.8, roughness: 0.4 });
    
    // VFX Materials
    const microwaveBeamVFX = new THREE.MeshBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending }); // Beaming power

    group.userData.state = { throttle: 0.0, rpm: 800 };
    group.userData.animatedMeshes = {};
    group.userData.animatedMeshes.beam = null;
    group.userData.animatedMeshes.sails = [];

    // ==========================================
    // 1. PROCEDURAL CAD: The Central Core & Transmitters
    // ==========================================
    const coreGroup = new THREE.Group();
    
    // The central hub (houses avionics and power converters)
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.5, 16), stationCore);
    coreGroup.add(hub);
    
    // Microwave Phased Array Transmitter (Points down/away from the sun to beam power)
    const transmitter = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.2, 32), microwaveEmitter);
    transmitter.position.set(0, -0.85, 0);
    coreGroup.add(transmitter);
    
    // Add grid details to the transmitter
    const gridTex = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 2.3), new THREE.MeshBasicMaterial({color: 0x223344, wireframe: true}));
    gridTex.rotation.x = Math.PI / 2;
    gridTex.position.set(0, -0.96, 0);
    coreGroup.add(gridTex);

    // Microwave Power Beam VFX
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 20.0, 32), microwaveBeamVFX);
    beam.position.set(0, -11.0, 0);
    coreGroup.add(beam);
    group.userData.animatedMeshes.beam = beam;
    
    group.add(coreGroup);
    group.userData.animatedMeshes['core'] = coreGroup;
    
    parts.push({ mesh: transmitter, name: "Microwave Phased Array", description: "Gigawatt-class wireless power transmitter.", function: "Converts the massive amount of gathered solar energy into a tight microwave beam aimed at rectennas on Earth or other colonies."});

    // ==========================================
    // 2. PROCEDURAL CAD: The Ultra-Thin Solar Sails (Dyson Swarm Mirrors)
    // ==========================================
    const sailGroup = new THREE.Group();
    
    // 6 massive hexagonal/triangular sail petals
    const numPetals = 6;
    for(let i=0; i<numPetals; i++) {
        const petal = new THREE.Group();
        
        // The boom deploying the petal
        const boom = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 4.0).rotateX(Math.PI/2), carbonStruts);
        boom.position.set(0, 0.5, 2.0); // Extending outwards
        petal.add(boom);
        
        // The Sail Film (Kapton)
        // We'll create a large wedge shape for each petal
        const sailShape = new THREE.Shape();
        sailShape.moveTo(0, 0);
        sailShape.lineTo(1.5, 3.8);
        sailShape.lineTo(-1.5, 3.8);
        sailShape.lineTo(0, 0);
        
        const sailGeo = new THREE.ShapeGeometry(sailShape);
        const sail = new THREE.Mesh(sailGeo, kaptonSail);
        sail.rotation.x = -Math.PI / 2; // Lay flat
        sail.position.set(0, 0.5, 0.2); // Start near hub
        
        petal.add(sail);
        
        // Rotate the petal into position around the hub
        const angle = (i * Math.PI * 2) / numPetals;
        petal.rotation.y = angle;
        
        sailGroup.add(petal);
        group.userData.animatedMeshes.sails.push(petal); // For deployment/flexing animations
    }
    
    group.add(sailGroup);
    
    parts.push({ mesh: sailGroup.children[0].children[1], name: "Kapton Solar Sails", description: "Ultra-thin, mile-wide solar concentrators.", function: "Gathers raw stellar energy. Millions of these satellites working together form a Dyson Swarm, capable of harvesting a fraction of a star's total output."});

    // ==========================================
    // 3. Factual Fasteners (10,000 parts)
    // ==========================================
    const boltCount = 10000;
    const boltGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.02, 6);
    const instancedBolts = new THREE.InstancedMesh(boltGeo, darkSteel, boltCount);
    const dummy = new THREE.Object3D();
    
    let boltIndex = 0;
    // Fasten the transmitter array elements
    for(let i=0; i<6000; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * 1.1; // Across the transmitter face
        dummy.position.set(r * Math.cos(angle), -0.75, r * Math.sin(angle));
        dummy.rotation.set(0, angle, 0); 
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(boltIndex++, dummy.matrix);
    }
    
    // Hub and boom mounting bolts
    for (let i = boltIndex; i < boltCount; i++) {
        dummy.position.set((Math.random() - 0.5) * 1.0, (Math.random() * 1.5) - 0.75, (Math.random() - 0.5) * 1.0);
        dummy.rotation.set(Math.random()*Math.PI, 0, Math.random()*Math.PI);
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    
    parts.push({ mesh: instancedBolts, name: "10,000 Micro-Fasteners", description: "Factual quantity of aerospace bolts.", function: "Secures the phased array elements and deployment boom hinges." });
    
    // Scale adjustment (These are massive in reality, but we scale it to fit the simulator)
    group.scale.set(0.4, 0.4, 0.4);
    
    // Dynamic Animation Loop
    let timeAcc = 0;
    group.userData.animate = function(time) {
        const state = group.userData.state;
        timeAcc += 0.016;
        
        if (state.throttle > 0.0) {
            const speed = state.throttle;
            
            // Microwave Power Beam Active
            // The beam flickers rapidly to simulate phased energy transmission
            group.userData.animatedMeshes.beam.material.opacity = (0.3 + Math.random() * 0.4) * speed;
            
            // The Solar Sails flex slightly under solar wind pressure
            group.userData.animatedMeshes.sails.forEach((petal, index) => {
                // Pitch the sails up slightly based on throttle
                const targetPitch = (Math.PI / 16) * speed; 
                petal.children[0].rotation.x = Math.sin(timeAcc * 0.5 + index) * 0.02; // Boom flex
                petal.children[1].rotation.x = -Math.PI/2 - targetPitch + Math.sin(timeAcc * 1.0 + index) * 0.05; // Sail flutter
            });
            
            // The whole satellite rotates very slowly for thermal control / stabilization
            group.rotation.y = timeAcc * 0.1 * speed;
            
        } else {
            // Idle
            group.userData.animatedMeshes.beam.material.opacity = 0;
            
            group.userData.animatedMeshes.sails.forEach((petal) => {
                petal.children[0].rotation.x *= 0.95;
                petal.children[1].rotation.x = -Math.PI/2;
            });
        }
    };

    group.userData.parts = parts;
    return group;
}
