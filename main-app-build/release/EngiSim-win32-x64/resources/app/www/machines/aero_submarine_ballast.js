import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();

    // Custom Materials
    const waterMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x0066ff,
        transmission: 0.9,
        opacity: 0.8,
        transparent: true,
        roughness: 0.1,
        ior: 1.33,
        emissive: 0x001133,
        emissiveIntensity: 0.5
    });

    const airMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xccffff,
        transmission: 0.95,
        opacity: 0.4,
        transparent: true,
        roughness: 0.0,
        emissive: 0x99ccff,
        emissiveIntensity: 0.2
    });

    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2,
        roughness: 0.2,
        metalness: 0.8
    });

    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0033,
        emissive: 0xff0033,
        emissiveIntensity: 2,
        roughness: 0.2,
        metalness: 0.8
    });

    const parts = [];

    // 1. Main Pressure Hull (Outer shell)
    const hullGeometry = new THREE.CylinderGeometry(5, 5, 20, 32);
    const hullMesh = new THREE.Mesh(hullGeometry, darkSteel);
    hullMesh.rotation.z = Math.PI / 2;
    group.add(hullMesh);

    parts.push({
        name: 'Pressure Hull',
        description: 'The main structural shell that withstands deep ocean pressure while housing the internal systems.',
        material: 'darkSteel',
        function: 'Structural integrity and pressure resistance',
        assemblyOrder: 1,
        connections: ['Ballast Tanks', 'Inner Framework'],
        failureEffect: 'Catastrophic implosion',
        cascadeFailures: ['All internal systems'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -10 }
    });

    // 2. Main Ballast Tank (Port)
    const tankGeometry = new THREE.CylinderGeometry(1.5, 1.5, 16, 32);
    const portTankMesh = new THREE.Mesh(tankGeometry, chrome);
    portTankMesh.position.set(0, -3.5, 3.5);
    portTankMesh.rotation.z = Math.PI / 2;
    group.add(portTankMesh);

    parts.push({
        name: 'Port Ballast Tank',
        description: 'Holds water to increase submarine density for diving.',
        material: 'chrome',
        function: 'Buoyancy control',
        assemblyOrder: 2,
        connections: ['Pressure Hull', 'Flood Valves', 'Vent Valves'],
        failureEffect: 'Uncontrolled list or unable to dive',
        cascadeFailures: ['Stability control'],
        originalPosition: { x: 0, y: -3.5, z: 3.5 },
        explodedPosition: { x: 0, y: -8, z: 8 }
    });

    // 3. Main Ballast Tank (Starboard)
    const stbdTankMesh = new THREE.Mesh(tankGeometry, chrome);
    stbdTankMesh.position.set(0, -3.5, -3.5);
    stbdTankMesh.rotation.z = Math.PI / 2;
    group.add(stbdTankMesh);

    parts.push({
        name: 'Starboard Ballast Tank',
        description: 'Holds water to increase submarine density for diving.',
        material: 'chrome',
        function: 'Buoyancy control',
        assemblyOrder: 3,
        connections: ['Pressure Hull', 'Flood Valves', 'Vent Valves'],
        failureEffect: 'Uncontrolled list or unable to dive',
        cascadeFailures: ['Stability control'],
        originalPosition: { x: 0, y: -3.5, z: -3.5 },
        explodedPosition: { x: 0, y: -8, z: -8 }
    });

    // Water level visualizers
    const waterLevelGeometry = new THREE.CylinderGeometry(1.48, 1.48, 16, 32);
    const portWaterLevel = new THREE.Mesh(waterLevelGeometry, waterMaterial);
    portWaterLevel.position.set(0, -3.5, 3.5);
    portWaterLevel.rotation.z = Math.PI / 2;
    group.add(portWaterLevel);
    
    const stbdWaterLevel = new THREE.Mesh(waterLevelGeometry, waterMaterial);
    stbdWaterLevel.position.set(0, -3.5, -3.5);
    stbdWaterLevel.rotation.z = Math.PI / 2;
    group.add(stbdWaterLevel);

    // 4. High-Pressure Air Flasks
    const flaskGeometry = new THREE.CapsuleGeometry(0.8, 4, 16, 16);
    const flask1 = new THREE.Mesh(flaskGeometry, neonBlue);
    flask1.position.set(-6, 2, 0);
    flask1.rotation.z = Math.PI / 2;
    group.add(flask1);
    
    const flask2 = new THREE.Mesh(flaskGeometry, neonBlue);
    flask2.position.set(6, 2, 0);
    flask2.rotation.z = Math.PI / 2;
    group.add(flask2);

    parts.push({
        name: 'High-Pressure Air Flasks',
        description: 'Stores highly compressed air used to blow water out of the ballast tanks.',
        material: 'neonBlue',
        function: 'Emergency surface and buoyancy control',
        assemblyOrder: 4,
        connections: ['Air Manifold', 'Vent Valves'],
        failureEffect: 'Inability to blow ballast tanks (cannot surface)',
        cascadeFailures: ['Depth control'],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 }
    });

    // 5. Flood Valves (Bottom)
    const floodValveGeo = new THREE.BoxGeometry(2, 1, 1);
    const floodValve1 = new THREE.Mesh(floodValveGeo, steel);
    floodValve1.position.set(-5, -5, 3.5);
    group.add(floodValve1);

    const floodValve2 = new THREE.Mesh(floodValveGeo, steel);
    floodValve2.position.set(5, -5, -3.5);
    group.add(floodValve2);

    parts.push({
        name: 'Main Flood Valves',
        description: 'Large valves at the bottom of the ballast tanks that let sea water in.',
        material: 'steel',
        function: 'Water intake/exhaust',
        assemblyOrder: 5,
        connections: ['Ballast Tanks', 'Ocean'],
        failureEffect: 'Tank cannot flood or drain',
        cascadeFailures: ['Buoyancy control'],
        originalPosition: { x: 0, y: -5, z: 0 },
        explodedPosition: { x: 0, y: -12, z: 0 }
    });

    // 6. Vent Valves (Top)
    const ventValveGeo = new THREE.CylinderGeometry(0.5, 0.5, 2);
    const ventValve1 = new THREE.Mesh(ventValveGeo, neonRed);
    ventValve1.position.set(-5, -2, 3.5);
    group.add(ventValve1);
    
    const ventValve2 = new THREE.Mesh(ventValveGeo, neonRed);
    ventValve2.position.set(5, -2, -3.5);
    group.add(ventValve2);

    parts.push({
        name: 'Vent Valves',
        description: 'Valves at the top of the ballast tanks that release trapped air, allowing water to flood in.',
        material: 'neonRed',
        function: 'Air release',
        assemblyOrder: 6,
        connections: ['Ballast Tanks', 'Air Flasks'],
        failureEffect: 'Cannot flood tank (air trapped)',
        cascadeFailures: ['Diving ability'],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -1, z: 10 }
    });

    const description = "The Submarine Ballast System controls buoyancy, enabling the vessel to dive and surface. By opening the vent valves at the top and the flood valves at the bottom, air escapes and water rushes in, increasing the sub's density (negative buoyancy). To surface, high-pressure air is blown into the tanks, forcing the water out and restoring positive buoyancy.";

    const quizQuestions = [
        {
            question: "What is the primary function of the vent valves?",
            options: [
                "To let water out of the tank",
                "To release trapped air so water can flood in",
                "To pump high-pressure air into the tank",
                "To cool the internal systems"
            ],
            correct: 1,
            explanation: "Vent valves are located at the top of the ballast tank. When opened, they let the air escape, which allows water to enter through the flood valves at the bottom.",
            difficulty: "Medium"
        },
        {
            question: "How does a submarine achieve positive buoyancy to surface?",
            options: [
                "By flooding the ballast tanks with water",
                "By opening the vent valves",
                "By using high-pressure air to force water out of the tanks",
                "By increasing its mass"
            ],
            correct: 2,
            explanation: "Blowing high-pressure air into the ballast tanks displaces the water, replacing it with lighter air, thus reducing the overall density of the submarine.",
            difficulty: "Easy"
        },
        {
            question: "What happens if the high-pressure air flasks fail while submerged?",
            options: [
                "The submarine will surface too quickly",
                "The submarine cannot blow its ballast tanks to surface",
                "The submarine's structural integrity will fail",
                "Water will stop entering the ballast tanks"
            ],
            correct: 1,
            explanation: "Without high-pressure air to displace the water in the ballast tanks, the submarine cannot regain positive buoyancy to surface normally.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        const cycle = Math.sin(time * speed); 
        const normalizedFill = (cycle + 1) / 2; // 0 to 1

        flask1.material.emissiveIntensity = 1 + Math.sin(time * speed * 2);
        flask2.material.emissiveIntensity = 1 + Math.sin(time * speed * 2);
        
        ventValve1.material.emissiveIntensity = 1 + Math.cos(time * speed * 2);
        ventValve2.material.emissiveIntensity = 1 + Math.cos(time * speed * 2);

        portWaterLevel.material.opacity = 0.2 + (0.6 * normalizedFill);
        stbdWaterLevel.material.opacity = 0.2 + (0.6 * normalizedFill);
        
        group.rotation.x = Math.sin(time * speed * 0.5) * 0.05;
        group.rotation.z = Math.cos(time * speed * 0.5) * 0.05;
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createBallastTank() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
