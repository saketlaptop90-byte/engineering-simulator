import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const glowingNeonWater = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.6,
        roughness: 0.1,
        metalness: 0.1,
    });
    
    const glowingSlurry = new THREE.MeshPhysicalMaterial({
        color: 0x8b4513,
        emissive: 0xff6600,
        emissiveIntensity: 0.4,
        roughness: 0.8,
    });

    // 1. Massive Hydraulic Cylinder
    const cylinderGeo = new THREE.CylinderGeometry(0.8, 0.8, 4, 32);
    cylinderGeo.rotateZ(Math.PI / 2);
    const cylinder = new THREE.Mesh(cylinderGeo, darkSteel);
    cylinder.position.set(-6, 0, 0);
    group.add(cylinder);
    parts.push({
        name: 'Hydraulic Cylinder',
        description: 'Generates massive compressive force to squeeze water out of the clay slurry.',
        material: 'darkSteel',
        function: 'Compression',
        assemblyOrder: 1,
        connections: ['Hydraulic Ram', 'Main Frame'],
        failureEffect: 'Loss of pressure, resulting in wet, unusable clay cakes.',
        cascadeFailures: ['Filter plates may leak slurry'],
        originalPosition: {x: -6, y: 0, z: 0},
        explodedPosition: {x: -9, y: 0, z: 0}
    });

    // 2. Hydraulic Ram
    const ramGeo = new THREE.CylinderGeometry(0.4, 0.4, 4, 32);
    ramGeo.rotateZ(Math.PI / 2);
    const ram = new THREE.Mesh(ramGeo, chrome);
    ram.position.set(-4, 0, 0);
    group.add(ram);
    parts.push({
        name: 'Hydraulic Ram',
        description: 'Transfers pressure from the cylinder to the moving head.',
        material: 'chrome',
        function: 'Force Transmission',
        assemblyOrder: 2,
        connections: ['Hydraulic Cylinder', 'Moving Head'],
        failureEffect: 'Inability to close the filter press.',
        cascadeFailures: [],
        originalPosition: {x: -4, y: 0, z: 0},
        explodedPosition: {x: -6, y: 2, z: 0}
    });

    // 3. Moving Head (Follower)
    const headGeo = new THREE.BoxGeometry(0.5, 3, 3);
    const movingHead = new THREE.Mesh(headGeo, steel);
    movingHead.position.set(-2.5, 0, 0);
    group.add(movingHead);
    parts.push({
        name: 'Moving Head',
        description: 'Pushes the filter plates together under hydraulic pressure.',
        material: 'steel',
        function: 'Plate Compression',
        assemblyOrder: 3,
        connections: ['Hydraulic Ram', 'Filter Plates'],
        failureEffect: 'Uneven pressure on plates, causing slurry leaks.',
        cascadeFailures: ['Filter Plate Rupture'],
        originalPosition: {x: -2.5, y: 0, z: 0},
        explodedPosition: {x: -4, y: 4, z: 0}
    });

    // 4. Fixed Head
    const fixedHeadGeo = new THREE.BoxGeometry(0.5, 3, 3);
    const fixedHead = new THREE.Mesh(fixedHeadGeo, steel);
    fixedHead.position.set(4, 0, 0);
    group.add(fixedHead);
    parts.push({
        name: 'Fixed Head',
        description: 'Stationary block that provides the opposing force for the hydraulic ram.',
        material: 'steel',
        function: 'Anchor',
        assemblyOrder: 4,
        connections: ['Main Frame', 'Filter Plates', 'Slurry Feed Pipe'],
        failureEffect: 'Catastrophic structural failure.',
        cascadeFailures: ['Hydraulic blowout'],
        originalPosition: {x: 4, y: 0, z: 0},
        explodedPosition: {x: 6, y: 0, z: 0}
    });

    // 5. Side Rails
    const railGeo = new THREE.BoxGeometry(7, 0.2, 0.2);
    
    const rail1 = new THREE.Mesh(railGeo, steel);
    rail1.position.set(0.75, 1.5, 1.6);
    group.add(rail1);
    
    const rail2 = new THREE.Mesh(railGeo, steel);
    rail2.position.set(0.75, 1.5, -1.6);
    group.add(rail2);

    parts.push({
        name: 'Side Rails',
        description: 'Supports the filter plates and moving head, keeping them aligned.',
        material: 'steel',
        function: 'Alignment & Support',
        assemblyOrder: 5,
        connections: ['Fixed Head', 'Hydraulic Cylinder Assembly'],
        failureEffect: 'Plates misalign, causing severe leaking and plate damage.',
        cascadeFailures: ['Plate cracking'],
        originalPosition: {x: 0.75, y: 1.5, z: 1.6}, // represents both
        explodedPosition: {x: 0.75, y: 4, z: 3}
    });

    // 6. Filter Plates
    const plateGeo = new THREE.BoxGeometry(0.2, 2.5, 2.5);
    const plateCount = 12;
    const plates = [];
    const cakeGeo = new THREE.BoxGeometry(0.15, 2.3, 2.3);
    const cakes = [];
    const waterDrops = [];

    for (let i = 0; i < plateCount; i++) {
        const plate = new THREE.Mesh(plateGeo, plastic); // Filter plates are often polymer/plastic
        const xPos = -1.5 + (i * 0.4);
        plate.position.set(xPos, 0, 0);
        group.add(plate);
        plates.push(plate);

        // Clay Cake
        const cake = new THREE.Mesh(cakeGeo, glowingSlurry);
        cake.position.set(xPos + 0.1, 0, 0);
        cake.scale.set(0.1, 1, 1); // Starts thin
        group.add(cake);
        cakes.push(cake);
        
        // Water drops
        const dropGeo = new THREE.SphereGeometry(0.05, 8, 8);
        const drop = new THREE.Mesh(dropGeo, glowingNeonWater);
        drop.position.set(xPos + 0.1, -1.3, 0);
        group.add(drop);
        waterDrops.push({ mesh: drop, baseY: -1.3, phase: Math.random() * Math.PI * 2 });
    }

    parts.push({
        name: 'Filter Plates (Pack)',
        description: 'Recessed plates with filter cloths that trap solids while allowing water to pass.',
        material: 'plastic',
        function: 'Filtration',
        assemblyOrder: 6,
        connections: ['Side Rails', 'Moving Head', 'Fixed Head'],
        failureEffect: 'Poor filtration, cloudy filtrate, or blowout of slurry.',
        cascadeFailures: ['Filter cloth tearing'],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -4, z: 0}
    });

    // 7. Slurry Feed Pipe
    const pipeGeo = new THREE.CylinderGeometry(0.2, 0.2, 2, 16);
    pipeGeo.rotateZ(Math.PI / 2);
    const pipe = new THREE.Mesh(pipeGeo, steel);
    pipe.position.set(5, 0, 0);
    group.add(pipe);
    parts.push({
        name: 'Slurry Feed Pipe',
        description: 'Pumps liquid clay slurry into the center of the filter plate pack under high pressure.',
        material: 'steel',
        function: 'Feed',
        assemblyOrder: 7,
        connections: ['Fixed Head', 'Slurry Pump'],
        failureEffect: 'Loss of feed pressure.',
        cascadeFailures: [],
        originalPosition: {x: 5, y: 0, z: 0},
        explodedPosition: {x: 8, y: 0, z: 0}
    });

    const description = "The Ceramics Filter Press is a heavy-duty industrial machine used to dewater clay slurry. High-pressure slurry is pumped into a series of recessed filter plates. The plates are clamped together tightly by a massive hydraulic cylinder. Water passes through filter cloths and exits, while solid clay particles are trapped, forming dense clay cakes. Once filtration is complete, the hydraulic ram retracts, plates are separated, and the solid clay cakes drop out for further processing.";

    const quizQuestions = [
        {
            question: "What is the primary function of the hydraulic cylinder in the filter press?",
            options: [
                "To pump slurry into the plates",
                "To compress the filter plates together and resist internal feed pressure",
                "To wash the filter cloths",
                "To heat the clay cakes"
            ],
            correct: 1,
            explanation: "The hydraulic cylinder clamps the moving head against the plates, keeping them tightly sealed against the high pressure of the incoming slurry.",
            difficulty: "Medium"
        },
        {
            question: "What happens during the filtration cycle?",
            options: [
                "Water is trapped inside while solids are expelled",
                "Slurry passes through unchanged",
                "Water passes through the filter cloths while solid clay is retained in the plate chambers",
                "The plates spin rapidly to separate water by centrifugal force"
            ],
            correct: 2,
            explanation: "In a filter press, the filter cloth acts as a barrier that lets liquid (filtrate) pass through but catches the solid particles, building up a solid cake.",
            difficulty: "Easy"
        },
        {
            question: "Why might a filter press experience 'blowout' (slurry leaking from between plates)?",
            options: [
                "Insufficient hydraulic clamping pressure",
                "Slurry feed pressure too low",
                "Excessive water in the slurry",
                "Filter plates are too thick"
            ],
            correct: 0,
            explanation: "If the hydraulic pressure holding the plates together is less than the internal pressure of the slurry being pumped in, the plates will separate slightly, causing high-pressure slurry to spray out.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        const cycleLength = 10000 / speed;
        const phase = (time % cycleLength) / cycleLength;

        let ramExtension = 0;
        let plateCompression = 0;
        let cakeThickness = 0.1;
        let waterActive = false;
        let dropCakes = false;

        if (phase < 0.15) {
            const progress = phase / 0.15;
            ramExtension = progress * 1.5;
            plateCompression = progress * 0.1;
        } else if (phase < 0.6) {
            ramExtension = 1.5;
            plateCompression = 0.1;
            const progress = (phase - 0.15) / 0.45;
            cakeThickness = 0.1 + (progress * 0.9);
            waterActive = true;
        } else if (phase < 0.7) {
            const progress = (phase - 0.6) / 0.1;
            ramExtension = 1.5 - (progress * 1.5);
            plateCompression = 0.1 - (progress * 0.1);
            cakeThickness = 1.0;
        } else if (phase < 0.9) {
            ramExtension = 0;
            plateCompression = 0;
            cakeThickness = 1.0;
            dropCakes = true;
        } else {
            ramExtension = 0;
            plateCompression = 0;
            cakeThickness = 0.1;
        }

        ram.position.x = -4 + ramExtension;
        movingHead.position.x = -2.5 + ramExtension;

        for (let i = 0; i < plates.length; i++) {
            const range = (4 - (-2.5 + ramExtension)) - 1.0; 
            const startX = (-2.5 + ramExtension) + 0.5;
            const spacing = range / plates.length;
            
            const targetX = startX + (i * spacing);
            plates[i].position.x = targetX;
            
            cakes[i].position.x = targetX + 0.1;
            cakes[i].scale.x = cakeThickness;
            
            if (dropCakes) {
                const fallProgress = (phase - 0.7) / 0.2;
                cakes[i].position.y = - (fallProgress * 5);
                cakes[i].material.opacity = 1 - Math.min(fallProgress * 1.5, 1);
                cakes[i].material.transparent = true;
            } else {
                cakes[i].position.y = 0;
                cakes[i].material.opacity = 1;
                cakes[i].material.transparent = false;
            }

            const dropData = waterDrops[i];
            if (waterActive) {
                dropData.mesh.visible = true;
                const dropFall = ((time / 1000 * speed * 2) + dropData.phase) % 1;
                dropData.mesh.position.x = targetX;
                dropData.mesh.position.y = dropData.baseY - (dropFall * 2);
                dropData.mesh.scale.setScalar(0.5 + Math.sin(dropFall * Math.PI) * 0.5);
            } else {
                dropData.mesh.visible = false;
            }
        }
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
export function createFilterPress() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
