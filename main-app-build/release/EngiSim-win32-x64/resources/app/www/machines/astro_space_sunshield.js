import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Materials
    const kaptonMat1 = new THREE.MeshPhysicalMaterial({ color: 0xffa500, metalness: 0.5, roughness: 0.2, clearcoat: 1.0, side: THREE.DoubleSide, transparent: true, opacity: 0.9 });
    const kaptonMat2 = new THREE.MeshPhysicalMaterial({ color: 0xff8c00, metalness: 0.5, roughness: 0.2, clearcoat: 1.0, side: THREE.DoubleSide, transparent: true, opacity: 0.85 });
    const kaptonMat3 = new THREE.MeshPhysicalMaterial({ color: 0xff7300, metalness: 0.5, roughness: 0.2, clearcoat: 1.0, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
    const kaptonMat4 = new THREE.MeshPhysicalMaterial({ color: 0xe65c00, metalness: 0.5, roughness: 0.2, clearcoat: 1.0, side: THREE.DoubleSide, transparent: true, opacity: 0.75 });
    const kaptonMat5 = new THREE.MeshPhysicalMaterial({ color: 0xcc4400, metalness: 0.5, roughness: 0.2, clearcoat: 1.0, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
    
    const mirrorGoldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 1.0, roughness: 0.05 });
    const busMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.6, roughness: 0.4 });
    const solarPanelMat = new THREE.MeshStandardMaterial({ color: 0x000044, metalness: 0.8, roughness: 0.2 });
    const structureMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.3, roughness: 0.7 });
    
    const glowingBlue = new THREE.MeshBasicMaterial({ color: 0x00ffff });

    // 1. Spacecraft Bus
    const busGeometry = new THREE.BoxGeometry(2, 1, 3);
    const bus = new THREE.Mesh(busGeometry, busMat);
    bus.position.set(0, -2, 0);
    group.add(bus);
    meshes.bus = bus;
    parts.push({
        name: "Spacecraft Bus",
        description: "Houses the primary support systems including power, propulsion, and communications.",
        material: "busMat",
        function: "Maintains orbit, provides power, and transmits data.",
        assemblyOrder: 1,
        connections: ["Sunshield", "Solar Array", "Antenna"],
        failureEffect: "Complete loss of mission control and telemetry.",
        cascadeFailures: ["Thermal Control", "Data Transmission"],
        originalPosition: {x: 0, y: -2, z: 0},
        explodedPosition: {x: 0, y: -5, z: 0}
    });

    // 2. Solar Array
    const solarGeometry = new THREE.BoxGeometry(4, 0.1, 1);
    const solarArray = new THREE.Mesh(solarGeometry, solarPanelMat);
    solarArray.position.set(0, -2.5, -2);
    // tilt
    solarArray.rotation.x = Math.PI / 4;
    group.add(solarArray);
    meshes.solarArray = solarArray;
    parts.push({
        name: "Solar Array",
        description: "Photovoltaic panels capturing solar energy.",
        material: "solarPanelMat",
        function: "Generates electrical power for the observatory.",
        assemblyOrder: 2,
        connections: ["Spacecraft Bus"],
        failureEffect: "Loss of power.",
        cascadeFailures: ["All systems offline"],
        originalPosition: {x: 0, y: -2.5, z: -2},
        explodedPosition: {x: 0, y: -6, z: -4}
    });

    // 3. Sunshield Layers (5 layers)
    const shape = new THREE.Shape();
    shape.moveTo(0, 5);
    shape.lineTo(3, 0);
    shape.lineTo(0, -5);
    shape.lineTo(-3, 0);
    shape.lineTo(0, 5);
    const extrudeSettings = { depth: 0.05, bevelEnabled: false };
    const sunshieldGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    const shieldMaterials = [kaptonMat1, kaptonMat2, kaptonMat3, kaptonMat4, kaptonMat5];
    meshes.shields = [];
    
    for(let i=0; i<5; i++) {
        const shield = new THREE.Mesh(sunshieldGeo, shieldMaterials[i]);
        shield.rotation.x = Math.PI / 2;
        shield.position.set(0, -1 + i * 0.2, 0);
        // scale them slightly differently
        shield.scale.set(1 - i*0.02, 1 - i*0.02, 1);
        group.add(shield);
        meshes.shields.push(shield);
        
        parts.push({
            name: `Sunshield Layer ${i+1}`,
            description: `Kapton film layer ${i+1} for thermal insulation.`,
            material: `kaptonMat${i+1}`,
            function: "Blocks solar heat to keep the telescope near absolute zero.",
            assemblyOrder: 3 + i,
            connections: ["Central Tower"],
            failureEffect: "Temperature increase on optics.",
            cascadeFailures: ["Infrared Sensor Noise", "Mirror Deformation"],
            originalPosition: {x: 0, y: -1 + i * 0.2, z: 0},
            explodedPosition: {x: 0, y: -4 + i * 1.5, z: 0}
        });
    }

    // 4. Central Tower / Backplane
    const towerGeo = new THREE.CylinderGeometry(0.5, 0.5, 2, 16);
    const tower = new THREE.Mesh(towerGeo, structureMat);
    tower.position.set(0, 1, 0);
    group.add(tower);
    meshes.tower = tower;
    parts.push({
        name: "Optical Telescope Element Support",
        description: "Backplane structure supporting the mirrors.",
        material: "structureMat",
        function: "Holds mirrors in exact alignment.",
        assemblyOrder: 8,
        connections: ["Primary Mirrors", "Secondary Mirror Booms"],
        failureEffect: "Mirror misalignment.",
        cascadeFailures: ["Blurry Images", "Science Data Loss"],
        originalPosition: {x: 0, y: 1, z: 0},
        explodedPosition: {x: 0, y: 2, z: -5}
    });

    // 5. Primary Mirror (Hexagons)
    meshes.mirrors = [];
    const hexRadius = 0.4;
    const hexGeo = new THREE.CylinderGeometry(hexRadius, hexRadius, 0.1, 6);
    
    // Create a honeycomb pattern
    const hexPositions = [
        [0,0],
        [0, 1], [0, -1],
        [0.866, 0.5], [0.866, -0.5],
        [-0.866, 0.5], [-0.866, -0.5],
        [0, 2], [0, -2],
        [0.866, 1.5], [0.866, -1.5],
        [-0.866, 1.5], [-0.866, -1.5],
        [1.732, 1], [1.732, 0], [1.732, -1],
        [-1.732, 1], [-1.732, 0], [-1.732, -1]
    ];

    const mirrorGroup = new THREE.Group();
    mirrorGroup.position.set(0, 2, 0);
    mirrorGroup.rotation.x = Math.PI / 2; // face forward/upish
    
    hexPositions.forEach((pos, idx) => {
        const mirror = new THREE.Mesh(hexGeo, mirrorGoldMat);
        mirror.rotation.x = Math.PI / 2; // face out
        mirror.position.set(pos[0], pos[1], 0);
        mirrorGroup.add(mirror);
        meshes.mirrors.push(mirror);
        
        parts.push({
            name: `Primary Mirror Segment ${idx+1}`,
            description: "Gold-coated beryllium hexagonal mirror segment.",
            material: "mirrorGoldMat",
            function: "Collects and focuses infrared light.",
            assemblyOrder: 9 + idx,
            connections: ["Backplane"],
            failureEffect: "Reduced light gathering capability.",
            cascadeFailures: ["Degraded Image Resolution"],
            originalPosition: {x: pos[0], y: 2 + pos[1], z: 0},
            explodedPosition: {x: pos[0]*2, y: 3 + pos[1]*2, z: 2}
        });
    });
    group.add(mirrorGroup);

    // 6. Secondary Mirror & Booms
    const boomGeo1 = new THREE.CylinderGeometry(0.05, 0.05, 3);
    const boom1 = new THREE.Mesh(boomGeo1, structureMat);
    boom1.position.set(0, 3, 1.5);
    boom1.rotation.x = -Math.PI / 4;
    group.add(boom1);

    const boom2 = new THREE.Mesh(boomGeo1, structureMat);
    boom2.position.set(1, 3, -1);
    boom2.rotation.x = Math.PI / 4;
    boom2.rotation.z = Math.PI / 8;
    group.add(boom2);

    const boom3 = new THREE.Mesh(boomGeo1, structureMat);
    boom3.position.set(-1, 3, -1);
    boom3.rotation.x = Math.PI / 4;
    boom3.rotation.z = -Math.PI / 8;
    group.add(boom3);
    
    const secondaryMirrorGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 6);
    const secondaryMirror = new THREE.Mesh(secondaryMirrorGeo, mirrorGoldMat);
    secondaryMirror.position.set(0, 4, 0);
    secondaryMirror.rotation.x = Math.PI / 2;
    group.add(secondaryMirror);
    meshes.secondaryMirror = secondaryMirror;

    parts.push({
        name: "Secondary Mirror",
        description: "Convex mirror directing light into the instruments.",
        material: "mirrorGoldMat",
        function: "Reflects light from the primary mirror to the ISIM.",
        assemblyOrder: 30,
        connections: ["Support Booms"],
        failureEffect: "Total loss of focus.",
        cascadeFailures: ["Instrument Failure"],
        originalPosition: {x: 0, y: 4, z: 0},
        explodedPosition: {x: 0, y: 6, z: 3}
    });

    // 7. ISIM (Integrated Science Instrument Module)
    const isimGeo = new THREE.BoxGeometry(1.5, 1, 1.5);
    const isim = new THREE.Mesh(isimGeo, structureMat);
    isim.position.set(0, 1.5, -0.5);
    group.add(isim);
    meshes.isim = isim;

    // Instruments glowing
    const miriGeo = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    const miri = new THREE.Mesh(miriGeo, glowingBlue);
    miri.position.set(0, 1.5, -0.5);
    group.add(miri);
    meshes.miri = miri;

    parts.push({
        name: "ISIM & Instruments",
        description: "Houses cameras and spectrographs (e.g., MIRI, NIRCam).",
        material: "structureMat & glowingBlue",
        function: "Analyzes the collected light.",
        assemblyOrder: 31,
        connections: ["Backplane", "Cooler"],
        failureEffect: "No scientific data generated.",
        cascadeFailures: ["Mission Failure"],
        originalPosition: {x: 0, y: 1.5, z: -0.5},
        explodedPosition: {x: 0, y: 2, z: -3}
    });

    const description = "The Space Sunshield Observatory is a premier space science observatory designed to solve mysteries in our solar system, look beyond to distant worlds around other stars, and probe the mysterious structures and origins of our universe and our place in it. Its massive sunshield protects its sensitive infrared instruments from the heat of the Sun, Earth, and Moon.";

    const quizQuestions = [
        {
            question: "Why does the space telescope require a massive sunshield?",
            options: [
                "To protect against micrometeoroids",
                "To keep the infrared instruments extremely cold",
                "To act as a solar sail for propulsion",
                "To reflect light onto the solar panels"
            ],
            correct: 1,
            explanation: "Infrared instruments detect heat. If the telescope is not kept extremely cold, its own heat emission would blind the instruments.",
            difficulty: "Medium"
        },
        {
            question: "What material are the primary mirror segments coated with to optimally reflect infrared light?",
            options: ["Silver", "Aluminum", "Gold", "Platinum"],
            correct: 2,
            explanation: "Gold is highly reflective to infrared light and chemically relatively inert, making it an ideal coating for infrared space telescopes.",
            difficulty: "Easy"
        },
        {
            question: "How many layers does the Kapton sunshield typically consist of to provide adequate thermal insulation?",
            options: ["1", "3", "5", "7"],
            correct: 2,
            explanation: "The sunshield uses 5 layers. Each successive layer is cooler than the one below it, creating a vast temperature differential between the hot side and the cold side.",
            difficulty: "Hard"
        }
    ];

    // Animation function
    function animate(time, speed, meshesObj) {
        if (!meshesObj) return;
        
        // Slow rotation of the entire observatory to simulate orbiting/tracking
        group.rotation.y = time * speed * 0.1;
        
        // Pulsate glowing instruments
        if (meshesObj.miri) {
            meshesObj.miri.material.opacity = 0.5 + Math.sin(time * 2) * 0.5;
            meshesObj.miri.material.transparent = true;
        }

        // Small wobble of the solar array to simulate tracking
        if (meshesObj.solarArray) {
            meshesObj.solarArray.rotation.z = Math.sin(time * speed * 0.5) * 0.05;
        }

        // Slight breathing effect on sunshield layers (thermal expansion/contraction simulation)
        if (meshesObj.shields) {
            meshesObj.shields.forEach((shield, idx) => {
                shield.position.y = -1 + idx * 0.2 + Math.sin(time * speed + idx) * 0.02;
            });
        }
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createSpaceSunshield() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
