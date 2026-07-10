import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const glowingBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8
    });

    const glowingGold = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        emissive: 0xffaa00,
        emissiveIntensity: 2.0,
        metalness: 1.0,
        roughness: 0.1
    });
    
    const glowingNeonGreen = new THREE.MeshStandardMaterial({
        color: 0x39ff14,
        emissive: 0x39ff14,
        emissiveIntensity: 1.2,
    });

    // 1. High-Pressure Helium Chamber
    const heliumChamberGeo = new THREE.CylinderGeometry(0.8, 0.8, 3, 32);
    const heliumChamber = new THREE.Mesh(heliumChamberGeo, steel);
    heliumChamber.position.set(0, 3, 0);
    group.add(heliumChamber);
    
    parts.push({
        name: "Helium Gas Chamber",
        description: "Stores high-pressure helium gas used to accelerate the micro-particles.",
        material: "steel",
        function: "Provides the explosive propulsive force.",
        assemblyOrder: 1,
        connections: ["Rupture Disk"],
        failureEffect: "Inability to fire, or catastrophic explosive decompression.",
        cascadeFailures: ["Rupture Disk", "Target Chamber"],
        originalPosition: { x: 0, y: 3, z: 0 },
        explodedPosition: { x: 0, y: 6, z: 0 }
    });

    // 2. Rupture Disk
    const ruptureDiskGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.2, 32);
    const ruptureDisk = new THREE.Mesh(ruptureDiskGeo, copper);
    ruptureDisk.position.set(0, 1.4, 0);
    group.add(ruptureDisk);
    
    parts.push({
        name: "Rupture Disk",
        description: "A thin metal disk that ruptures at a specific pressure to release the helium shockwave.",
        material: "copper",
        function: "Releases gas instantaneously when burst pressure is reached.",
        assemblyOrder: 2,
        connections: ["Helium Gas Chamber", "Macroprojectile"],
        failureEffect: "Premature firing or failure to fire at correct pressure, leading to poor DNA delivery.",
        cascadeFailures: ["Macroprojectile", "Stopping Screen"],
        originalPosition: { x: 0, y: 1.4, z: 0 },
        explodedPosition: { x: 0, y: 1.4, z: -3 }
    });

    // 3. Macroprojectile and DNA-coated microparticles
    const macroGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.6, 16);
    const macroprojectile = new THREE.Mesh(macroGeo, plastic);
    macroprojectile.position.set(0, 0.8, 0);
    group.add(macroprojectile);

    parts.push({
        name: "Macroprojectile",
        description: "Plastic carrier that holds the DNA-coated gold/tungsten particles. It is accelerated by the helium shockwave.",
        material: "plastic",
        function: "Carries the microparticles towards the stopping screen.",
        assemblyOrder: 3,
        connections: ["Rupture Disk", "Stopping Screen"],
        failureEffect: "Misalignment or failure to accelerate, resulting in failed transfection.",
        cascadeFailures: ["Stopping Screen"],
        originalPosition: { x: 0, y: 0.8, z: 0 },
        explodedPosition: { x: 3, y: 0.8, z: 0 }
    });
    
    // Glowing microparticles
    const particleGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const particleGroup = new THREE.Group();
    for(let i=0; i<15; i++) {
        const particle = new THREE.Mesh(particleGeo, glowingGold);
        particle.position.set(
            (Math.random() - 0.5) * 0.4,
            0.3,
            (Math.random() - 0.5) * 0.4
        );
        particleGroup.add(particle);
    }
    macroprojectile.add(particleGroup);
    
    // 4. Stopping Screen
    const stoppingScreenGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.1, 32);
    const stoppingScreen = new THREE.Mesh(stoppingScreenGeo, aluminum);
    stoppingScreen.position.set(0, 0, 0);
    group.add(stoppingScreen);

    parts.push({
        name: "Stopping Screen",
        description: "A metal mesh that halts the macroprojectile but allows microparticles to pass through.",
        material: "aluminum",
        function: "Stops the macroprojectile carrier, allowing inertia to carry the microparticles forward.",
        assemblyOrder: 4,
        connections: ["Macroprojectile", "Target Tissue"],
        failureEffect: "Allows macroprojectile to hit the tissue, destroying the sample.",
        cascadeFailures: ["Target Tissue"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -3, y: 0, z: 0 }
    });
    
    // 5. Target Chamber & Tissue
    const targetChamberGeo = new THREE.CylinderGeometry(1.5, 1.5, 2, 32);
    const targetChamber = new THREE.Mesh(targetChamberGeo, glass);
    targetChamber.position.set(0, -1.5, 0);
    targetChamber.material.transparent = true;
    targetChamber.material.opacity = 0.3;
    group.add(targetChamber);

    const tissueGeo = new THREE.CylinderGeometry(1, 1, 0.2, 32);
    const tissue = new THREE.Mesh(tissueGeo, glowingNeonGreen);
    tissue.position.set(0, -2, 0);
    group.add(tissue);

    parts.push({
        name: "Target Chamber and Tissue",
        description: "Evacuated chamber containing the biological sample to be bombarded.",
        material: "glass/neon",
        function: "Holds the tissue and operates under a vacuum to reduce particle deceleration.",
        assemblyOrder: 5,
        connections: ["Stopping Screen"],
        failureEffect: "Loss of vacuum leads to deceleration of particles and poor penetration.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: -1.5, z: 0 },
        explodedPosition: { x: 0, y: -4, z: 0 }
    });

    const description = "The Gene Gun (Biolistic Particle Delivery System) is used to inject cells with genetic information. It fires heavy metal microparticles (gold or tungsten) coated with plasmid DNA into living plant or animal cells using a high-pressure helium pulse.";

    const quizQuestions = [
        {
            question: "What is the primary function of the stopping screen in a gene gun?",
            options: [
                "To stop the helium gas from entering the target chamber",
                "To block large DNA fragments",
                "To stop the macroprojectile while letting microparticles pass through",
                "To regulate the vacuum pressure"
            ],
            correct: 2,
            explanation: "The stopping screen halts the larger plastic macroprojectile, allowing the smaller DNA-coated microparticles to continue forward under their own momentum.",
            difficulty: "Medium"
        },
        {
            question: "Why is helium commonly used as the propellant instead of normal air?",
            options: [
                "It is a noble gas and will not react with the DNA",
                "It is lighter, allowing a faster shockwave and higher particle velocity",
                "It creates a vacuum in the chamber",
                "It cools down the macroprojectile"
            ],
            correct: 1,
            explanation: "Helium is a very light gas, meaning the shockwave it creates when the rupture disk bursts travels faster, resulting in higher acceleration for the macroprojectile.",
            difficulty: "Hard"
        },
        {
            question: "What materials are typically used for the microparticles coated with DNA?",
            options: [
                "Iron or Copper",
                "Gold or Tungsten",
                "Plastic or Resin",
                "Aluminum or Steel"
            ],
            correct: 1,
            explanation: "Gold and tungsten are dense, chemically inert metals, meaning they easily penetrate cell walls and membranes without reacting chemically with the biological tissues.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        // Subtle pulsing of the tissue
        if (tissue) {
            tissue.material.emissiveIntensity = 1.2 + Math.sin(time * 2 * speed) * 0.3;
        }
        
        // Firing sequence animation based on time modulo
        const cycle = (time * speed * 0.5) % 4;
        
        if (cycle < 1) {
            // Loading/Pressure build-up
            macroprojectile.position.y = 0.8;
            particleGroup.position.y = 0;
        } else if (cycle >= 1 && cycle < 1.2) {
            // Firing
            const progress = (cycle - 1) / 0.2;
            macroprojectile.position.y = 0.8 - (0.8 * progress); // moves down to stopping screen
        } else if (cycle >= 1.2 && cycle < 2) {
            // Microparticles continue to target
            macroprojectile.position.y = 0; // stopped
            const progress = (cycle - 1.2) / 0.8;
            particleGroup.position.y = -2 * progress; // moves down to tissue
        } else {
            // Reset
            macroprojectile.position.y = 0.8;
            particleGroup.position.y = 0;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createGeneGun() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
