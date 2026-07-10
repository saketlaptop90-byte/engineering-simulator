import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Custom High-Tech Materials for Immense Visual Flair
    const stellarPlasmaMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: 0xffaa00,
        emissiveIntensity: 6.0,
        roughness: 0.1,
        metalness: 0.1,
        clearcoat: 1.0,
        transparent: true,
        opacity: 0.95
    });

    const energyBeamMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.8,
        wireframe: true
    });

    const magneticRingMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x050505,
        emissive: 0x0055ff,
        emissiveIntensity: 2.5,
        roughness: 0.3,
        metalness: 0.9,
        clearcoat: 0.8
    });
    
    const solarMirrorMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 1.0,
        roughness: 0.02,
        clearcoat: 1.0,
        envMapIntensity: 2.5
    });

    const heatRadiatorMaterial = new THREE.MeshStandardMaterial({
        color: 0x220500,
        emissive: 0xff2200,
        emissiveIntensity: 0.8,
        roughness: 0.9,
        metalness: 0.6
    });

    // 1. Central Hub Spine (darkSteel)
    const spineGeo = new THREE.CylinderGeometry(0.6, 0.6, 14, 24);
    const spine = new THREE.Mesh(spineGeo, darkSteel);
    group.add(spine);
    parts.push({
        name: "Central Hub Spine",
        description: "The primary structural pillar housing heavy energy bus conduits.",
        material: "Dark Steel",
        function: "Structural integrity and massive energy transfer.",
        assemblyOrder: 1,
        connections: ["Stellar Plasma Core", "Energy Transmitter", "Solar Mirror Arrays"],
        failureEffect: "Structural collapse of the node.",
        cascadeFailures: ["Complete Node Destruction"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -10 }
    });
    spine.userData.name = "Central Hub Spine";

    // 2. Stellar Plasma Core
    const coreGeo = new THREE.IcosahedronGeometry(2.5, 4);
    const core = new THREE.Mesh(coreGeo, stellarPlasmaMaterial);
    core.position.set(0, 4, 0);
    group.add(core);
    parts.push({
        name: "Stellar Plasma Core",
        description: "Superheated collection chamber holding concentrated stellar energy.",
        material: "Plasma Containment Field",
        function: "Stores and normalizes raw photonic output into stable plasma.",
        assemblyOrder: 2,
        connections: ["Magnetic Confinement Rings", "Central Hub Spine"],
        failureEffect: "Containment breach and localized plasma detonation.",
        cascadeFailures: ["Magnetic Confinement Rings", "Central Hub Spine"],
        originalPosition: { x: 0, y: 4, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 }
    });
    core.userData.name = "Stellar Plasma Core";

    // 3. Magnetic Confinement Rings
    const ringsGroup = new THREE.Group();
    const ringGeo1 = new THREE.TorusGeometry(4.0, 0.25, 16, 100);
    const ring1 = new THREE.Mesh(ringGeo1, magneticRingMaterial);
    ringsGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(5.0, 0.25, 16, 100);
    const ring2 = new THREE.Mesh(ringGeo2, magneticRingMaterial);
    ring2.rotation.x = Math.PI / 2;
    ringsGroup.add(ring2);

    const ringGeo3 = new THREE.TorusGeometry(6.0, 0.25, 16, 100);
    const ring3 = new THREE.Mesh(ringGeo3, magneticRingMaterial);
    ring3.rotation.y = Math.PI / 2;
    ringsGroup.add(ring3);

    ringsGroup.position.set(0, 4, 0);
    group.add(ringsGroup);

    parts.push({
        name: "Magnetic Confinement Rings",
        description: "Tri-axial superconducting rings generating immense magnetic fields.",
        material: "Superconducting Alloy / Neon Plasma",
        function: "Maintains plasma stability, keeping it floating in a vacuum away from physical bulkheads.",
        assemblyOrder: 3,
        connections: ["Stellar Plasma Core"],
        failureEffect: "Magnetic field flux anomalies.",
        cascadeFailures: ["Stellar Plasma Core"],
        originalPosition: { x: 0, y: 4, z: 0 },
        explodedPosition: { x: -12, y: 4, z: 0 }
    });
    ringsGroup.userData.name = "Magnetic Confinement Rings";

    // 4. Hexagonal Solar Mirror Arrays (Petals)
    const arrayGroup = new THREE.Group();
    const numPetals = 12;
    for(let i = 0; i < numPetals; i++) {
        const petalGeo = new THREE.CylinderGeometry(1.8, 3.5, 0.15, 6);
        const petal = new THREE.Mesh(petalGeo, solarMirrorMaterial);
        
        const angle = (i / numPetals) * Math.PI * 2;
        const radius = 9;
        petal.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
        
        // Tilt petals slightly inward towards the core
        petal.lookAt(0, 8, 0);
        petal.rotateX(Math.PI / 2);
        
        arrayGroup.add(petal);
    }
    arrayGroup.position.set(0, 2, 0);
    group.add(arrayGroup);

    parts.push({
        name: "Hexagonal Solar Mirrors",
        description: "Massive ultra-reflective panels capturing starlight and focusing it into the core.",
        material: "Chrome / Solar Glass",
        function: "Photonic concentration and raw energy harvesting.",
        assemblyOrder: 4,
        connections: ["Central Hub Spine"],
        failureEffect: "Sharp drop in energy collection efficiency.",
        cascadeFailures: ["Energy Transmitter"],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: 0, y: 2, z: 20 }
    });
    arrayGroup.userData.name = "Hexagonal Solar Mirrors";

    // 5. Heat Radiator Fins
    const radiatorGroup = new THREE.Group();
    const finGeo = new THREE.BoxGeometry(0.3, 6, 4);
    for(let i = 0; i < 4; i++) {
        const fin = new THREE.Mesh(finGeo, heatRadiatorMaterial);
        const angle = (i / 4) * Math.PI * 2;
        fin.position.set(Math.cos(angle) * 2.0, -2, Math.sin(angle) * 2.0);
        fin.rotation.y = -angle;
        radiatorGroup.add(fin);
    }
    group.add(radiatorGroup);

    parts.push({
        name: "Radiator Fins",
        description: "Graphene-based thermal dissipation fins to eject waste heat into the void.",
        material: "Thermal Graphene",
        function: "Cooling system for the central hub and transmitter.",
        assemblyOrder: 5,
        connections: ["Central Hub Spine"],
        failureEffect: "Node overheating and automated shutdown.",
        cascadeFailures: ["Energy Transmitter", "Magnetic Confinement Rings"],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 15, y: -2, z: 0 }
    });
    radiatorGroup.userData.name = "Radiator Fins";

    // 6. Energy Transmitter (Phased Array)
    const transmitterGeo = new THREE.ConeGeometry(2.5, 5, 24);
    const transmitter = new THREE.Mesh(transmitterGeo, chrome);
    transmitter.position.set(0, -6.5, 0);
    transmitter.rotation.x = Math.PI;
    group.add(transmitter);
    
    // Glowing beam exiting transmitter
    const beamGeo = new THREE.CylinderGeometry(0.8, 0.8, 10, 16);
    const beamGeoInner = new THREE.CylinderGeometry(0.4, 0.4, 10, 16);
    
    const beam = new THREE.Mesh(beamGeo, energyBeamMaterial);
    const beamInner = new THREE.Mesh(beamGeoInner, new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.9}));
    
    beam.add(beamInner);
    beam.position.set(0, -12, 0);
    group.add(beam);

    parts.push({
        name: "Phased Array Transmitter",
        description: "High-frequency microwave/laser emitter array beaming energy back to the collection grid.",
        material: "Chrome / Crystal Glass",
        function: "Wireless interstellar energy transmission.",
        assemblyOrder: 6,
        connections: ["Central Hub Spine"],
        failureEffect: "Unable to offload harvested energy, risking core overload.",
        cascadeFailures: ["Stellar Plasma Core"],
        originalPosition: { x: 0, y: -6.5, z: 0 },
        explodedPosition: { x: 0, y: -18, z: 0 }
    });
    transmitter.userData.name = "Phased Array Transmitter";
    beam.userData.name = "Energy Beam";

    // 7. Maintenance Drone Dock
    const dockGeo = new THREE.TorusGeometry(3.0, 0.4, 16, 64);
    const dock = new THREE.Mesh(dockGeo, steel);
    dock.position.set(0, -0.5, 0);
    group.add(dock);

    parts.push({
        name: "Drone Maintenance Dock",
        description: "Docking ring and charging port for automated repair and cleaning drones.",
        material: "Steel",
        function: "Automated structural maintenance and mirror cleaning.",
        assemblyOrder: 7,
        connections: ["Central Hub Spine"],
        failureEffect: "No immediate failure, but long-term structural degradation.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: -0.5, z: 0 },
        explodedPosition: { x: -10, y: -5, z: 10 }
    });
    dock.userData.name = "Drone Maintenance Dock";

    const description = "The Stellar Dyson Swarm Node is an autonomous satellite designed to orbit a star in a massive swarm. It captures immense amounts of solar radiation using its giant hexagonal mirror arrays, concentrates it into a magnetic plasma core, and transmits the resulting energy as a tight microwave/laser beam to a centralized collection hub.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Magnetic Confinement Rings in the Dyson Swarm Node?",
            options: [
                "To accelerate the node through space",
                "To stabilize the superheated plasma core",
                "To transmit data back to Earth",
                "To reflect incoming starlight"
            ],
            correct: 1,
            explanation: "The magnetic confinement rings generate strong electromagnetic fields to hold and stabilize the superheated plasma core without physical contact, preventing structural melting.",
            difficulty: "Medium"
        },
        {
            question: "Why does the node require large Radiator Fins in the cold vacuum of space?",
            options: [
                "To capture stellar wind energy",
                "To look aesthetically pleasing to engineers",
                "To dissipate immense waste heat generated by energy conversion",
                "To act as solar sails for navigation"
            ],
            correct: 2,
            explanation: "Even in space, immense heat is generated by concentrating stellar energy. Without convection or conduction in a vacuum, heat must be radiated away as infrared light to prevent critical overheating.",
            difficulty: "Hard"
        },
        {
            question: "How does the node send its harvested energy to the collection hub?",
            options: [
                "Through giant physical nano-carbon cables connecting the swarm",
                "By physically returning to the hub like a battery drone",
                "Using acoustic sound waves",
                "Via a phased array transmitter as a tight microwave or laser beam"
            ],
            correct: 3,
            explanation: "Due to the vast distances and orbital mechanics of a Dyson Swarm, energy is transmitted wirelessly using tight microwave or laser beams directed at a collection hub.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Pulsate Core
        const coreMesh = meshes.find(m => m.userData.name === "Stellar Plasma Core");
        if (coreMesh) {
            const scale = 1 + Math.sin(time * 3 * speed) * 0.08;
            coreMesh.scale.set(scale, scale, scale);
            coreMesh.rotation.y += 0.05 * speed;
            coreMesh.rotation.z += 0.02 * speed;
            stellarPlasmaMaterial.emissiveIntensity = 4.0 + Math.sin(time * 6 * speed) * 3.0;
        }

        // Complex Gyroscopic Rotation of Magnetic Rings
        const ringsGroup = meshes.find(m => m.userData.name === "Magnetic Confinement Rings");
        if (ringsGroup && ringsGroup.children.length === 3) {
            ringsGroup.children[0].rotation.x += 0.03 * speed;
            ringsGroup.children[0].rotation.y += 0.01 * speed;
            
            ringsGroup.children[1].rotation.y += 0.04 * speed;
            ringsGroup.children[1].rotation.z -= 0.02 * speed;
            
            ringsGroup.children[2].rotation.x -= 0.02 * speed;
            ringsGroup.children[2].rotation.z += 0.03 * speed;

            magneticRingMaterial.emissiveIntensity = 2.0 + Math.sin(time * 8 * speed) * 1.5;
        }

        // Slowly Rotate and Breathe the Hexagonal Mirrors
        const arrays = meshes.find(m => m.userData.name === "Hexagonal Solar Mirrors");
        if (arrays) {
            arrays.rotation.y = time * 0.15 * speed;
            arrays.children.forEach((petal, i) => {
                // Wave effect across petals
                petal.rotation.x = (Math.PI / 2.1) + Math.sin(time * 2 * speed + i) * 0.05;
            });
        }

        // Radiator heat pulsing (simulating thermal load cycles)
        heatRadiatorMaterial.emissiveIntensity = 0.5 + Math.sin(time * 1.5 * speed) * 0.4;

        // Energy Beam transmission pulse
        const beam = meshes.find(m => m.userData.name === "Energy Beam");
        if (beam) {
            energyBeamMaterial.opacity = 0.6 + Math.sin(time * 25 * speed) * 0.4;
            beam.scale.x = 1 + Math.sin(time * 20 * speed) * 0.15;
            beam.scale.z = 1 + Math.sin(time * 20 * speed) * 0.15;
            
            // Flow effect
            beam.position.y = -11.5 - (time * 10 * speed) % 1.0; 
        }
    }

    const meshes = [];
    group.traverse(child => {
        if (child.isMesh || child.isGroup) {
            meshes.push(child);
        }
    });

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate: (time, speed) => animate(time, speed, meshes)
    };
}
