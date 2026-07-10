import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();

    // Custom Materials
    const starMaterialPrimary = new THREE.MeshBasicMaterial({ color: 0x44aaff }); // Hot blue-white star
    const starMaterialSecondary = new THREE.MeshBasicMaterial({ color: 0xffaa44 }); // Cooler orange star
    const plasmaStreamMaterial = new THREE.MeshBasicMaterial({ color: 0xffaa44, transparent: true, opacity: 0.8 });
    const accretionDiskMaterial = new THREE.MeshBasicMaterial({ color: 0xffddaa, transparent: true, opacity: 0.9, side: THREE.DoubleSide });

    const parts = [];

    // Primary Star (Blue Giant or Main Sequence)
    const primaryStarGeo = new THREE.SphereGeometry(2, 64, 64);
    const primaryStar = new THREE.Mesh(primaryStarGeo, starMaterialPrimary);
    primaryStar.position.set(-4, 0, 0);
    group.add(primaryStar);

    // Primary Star Corona/Glow
    const primaryGlowGeo = new THREE.SphereGeometry(2.2, 32, 32);
    const primaryGlowMat = new THREE.MeshBasicMaterial({ color: 0x44aaff, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending });
    const primaryGlow = new THREE.Mesh(primaryGlowGeo, primaryGlowMat);
    primaryGlow.position.set(-4, 0, 0);
    group.add(primaryGlow);

    parts.push({
        name: "Primary Star",
        mesh: primaryStar,
        description: "A massive, hot blue-white star.",
        material: "starMaterialPrimary",
        function: "Provides the main gravitational anchor of the system and emits intense radiation.",
        assemblyOrder: 1,
        connections: ["Secondary Star", "Accretion Disk"],
        failureEffect: "Supernova explosion obliterating the system.",
        cascadeFailures: ["Secondary Star Vaporization", "Accretion Disk Destruction"],
        originalPosition: { x: -4, y: 0, z: 0 },
        explodedPosition: { x: -10, y: 0, z: 0 }
    });

    // Secondary Star (Orange Dwarf or Red Giant transferring mass)
    const secondaryStarGeo = new THREE.SphereGeometry(1.5, 64, 64);
    // Let's distort the secondary star slightly towards the primary star (Roche lobe overflow)
    const positions = secondaryStarGeo.attributes.position;
    for (let i = 0; i < positions.count; i++) {
        let x = positions.getX(i);
        let y = positions.getY(i);
        let z = positions.getZ(i);
        if (x > 0.5) {
            x += (x - 0.5) * 0.8; // stretch towards primary
            positions.setX(i, x);
        }
    }
    secondaryStarGeo.computeVertexNormals();
    const secondaryStar = new THREE.Mesh(secondaryStarGeo, starMaterialSecondary);
    secondaryStar.position.set(4, 0, 0);
    group.add(secondaryStar);

    // Secondary Star Glow
    const secondaryGlowGeo = new THREE.SphereGeometry(1.6, 32, 32);
    const secondaryGlowMat = new THREE.MeshBasicMaterial({ color: 0xffaa44, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending });
    const secondaryGlow = new THREE.Mesh(secondaryGlowGeo, secondaryGlowMat);
    secondaryGlow.position.set(4, 0, 0);
    group.add(secondaryGlow);

    parts.push({
        name: "Secondary Star (Donor)",
        mesh: secondaryStar,
        description: "A cooler, less massive star expanding past its Roche lobe.",
        material: "starMaterialSecondary",
        function: "Donates stellar material to the primary star via Roche lobe overflow.",
        assemblyOrder: 2,
        connections: ["Primary Star", "Plasma Stream"],
        failureEffect: "Core collapse or white dwarf transformation.",
        cascadeFailures: ["Cessation of Mass Transfer"],
        originalPosition: { x: 4, y: 0, z: 0 },
        explodedPosition: { x: 10, y: 0, z: 0 }
    });

    // Accretion Disk around Primary Star
    const diskGeo = new THREE.TorusGeometry(3.5, 0.4, 16, 100);
    const disk = new THREE.Mesh(diskGeo, accretionDiskMaterial);
    disk.rotation.x = Math.PI / 2 - 0.2;
    disk.position.set(-4, 0, 0);
    group.add(disk);

    parts.push({
        name: "Accretion Disk",
        mesh: disk,
        description: "A disk of superheated plasma swirling around the primary star.",
        material: "accretionDiskMaterial",
        function: "Transfers angular momentum and funnels matter onto the primary star.",
        assemblyOrder: 3,
        connections: ["Primary Star", "Plasma Stream"],
        failureEffect: "Dispersal of gas, stopping mass accretion.",
        cascadeFailures: ["X-ray emission cessation"],
        originalPosition: { x: -4, y: 0, z: 0 },
        explodedPosition: { x: -4, y: -5, z: 0 }
    });

    // Plasma Stream
    class CustomSinCurve extends THREE.Curve {
        constructor(scale = 1) {
            super();
            this.scale = scale;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const tx = 2.5 - t * 4;
            const ty = Math.sin(t * Math.PI) * 1.5;
            const tz = 0;
            return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
        }
    }
    const path = new CustomSinCurve(1.5);
    const streamGeo = new THREE.TubeGeometry(path, 20, 0.2, 8, false);
    const plasmaStream = new THREE.Mesh(streamGeo, plasmaStreamMaterial);
    plasmaStream.position.set(0.5, 0, 0);
    group.add(plasmaStream);

    parts.push({
        name: "Plasma Stream",
        mesh: plasmaStream,
        description: "A stream of stellar material flowing from the donor star to the accretion disk.",
        material: "plasmaStreamMaterial",
        function: "Transports mass between the binary components.",
        assemblyOrder: 4,
        connections: ["Secondary Star", "Accretion Disk"],
        failureEffect: "Interruption of mass transfer.",
        cascadeFailures: ["Accretion Disk Depletion"],
        originalPosition: { x: 0.5, y: 0, z: 0 },
        explodedPosition: { x: 0.5, y: 5, z: 0 }
    });

    // Jets (Optional, from poles of Primary Star)
    const jetGeo = new THREE.CylinderGeometry(0.1, 0.5, 8, 16);
    jetGeo.translate(0, 4, 0);
    const jetMat = new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
    
    const topJet = new THREE.Mesh(jetGeo, jetMat);
    topJet.position.set(-4, 0, 0);
    topJet.rotation.z = -0.2; 
    group.add(topJet);

    const bottomJet = new THREE.Mesh(jetGeo, jetMat);
    bottomJet.position.set(-4, 0, 0);
    bottomJet.rotation.z = Math.PI - 0.2;
    group.add(bottomJet);

    parts.push({
        name: "Polar Jets",
        mesh: topJet, // representing both
        description: "High-velocity jets of relativistic particles ejected from the primary star's poles.",
        material: "jetMaterial",
        function: "Carries away excess angular momentum from the accretion disk.",
        assemblyOrder: 5,
        connections: ["Primary Star", "Accretion Disk"],
        failureEffect: "Angular momentum build-up in disk.",
        cascadeFailures: ["Accretion disk instability"],
        originalPosition: { x: -4, y: 0, z: 0 },
        explodedPosition: { x: -4, y: 10, z: 0 }
    });

    const description = "A detailed interactive simulation of a semi-detached binary star system. It features a primary massive star and a secondary donor star that has expanded beyond its Roche lobe. Mass is actively being transferred via a superheated plasma stream into an accretion disk surrounding the primary star, accompanied by relativistic polar jets.";

    const quizQuestions = [
        {
            question: "What happens when a star in a binary system expands past its Roche lobe?",
            options: ["It explodes as a supernova instantly", "It begins transferring mass to its companion star", "It collapses into a black hole", "It stops fusing hydrogen"],
            correct: 1,
            explanation: "When a star expands beyond its Roche lobe, its outer layers are no longer gravitationally bound exclusively to it, allowing material to flow to the companion star.",
            difficulty: "Medium"
        },
        {
            question: "What structure forms around the primary star as it receives mass?",
            options: ["A planetary nebula", "An asteroid belt", "An accretion disk", "A Dyson sphere"],
            correct: 2,
            explanation: "Conservation of angular momentum prevents the transferred material from falling straight in, so it forms a swirling accretion disk.",
            difficulty: "Easy"
        },
        {
            question: "What is the primary function of the polar jets in this system?",
            options: ["To cool down the primary star", "To carry away excess angular momentum", "To form new planets", "To pull the secondary star closer"],
            correct: 1,
            explanation: "Astrophysical jets are a mechanism for removing excess angular momentum from the accretion disk, allowing material to fall onto the central body.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        const orbitSpeed = speed * 0.5;
        const orbitAngle = time * orbitSpeed;

        group.rotation.y = orbitAngle;

        primaryStar.rotation.y = time * speed * 2;
        primaryGlow.rotation.y = time * speed * 2;

        disk.rotation.z = time * speed * 5;

        secondaryGlow.scale.setScalar(1 + 0.05 * Math.sin(time * speed * 4));

        plasmaStream.scale.x = 1 + 0.05 * Math.sin(time * speed * 10);
        
        topJet.scale.y = 1 + 0.1 * Math.sin(time * speed * 15);
        bottomJet.scale.y = 1 + 0.1 * Math.sin(time * speed * 15 + Math.PI);
        topJet.material.opacity = 0.6 + 0.2 * Math.sin(time * speed * 20);
        bottomJet.material.opacity = 0.6 + 0.2 * Math.sin(time * speed * 20);
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createBinaryStar() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
