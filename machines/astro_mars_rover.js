import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Materials
    const goldFoil = new THREE.MeshStandardMaterial({ color: 0xffaa00, metalness: 0.8, roughness: 0.3, wireframe: false });
    const solarPanelMat = new THREE.MeshStandardMaterial({ color: 0x001133, metalness: 0.9, roughness: 0.2 });
    const laserBeamMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.8 });
    const vaporMat = new THREE.MeshBasicMaterial({ color: 0xff5500, transparent: true, opacity: 0.5 });
    const glowingBlue = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x0088ff, emissiveIntensity: 2 });
    const whitePaint = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.5 });
    
    // 1. Chassis
    const chassisGeom = new THREE.BoxGeometry(2, 0.8, 3);
    const chassisMesh = new THREE.Mesh(chassisGeom, whitePaint);
    chassisMesh.position.set(0, 0.8, 0);
    group.add(chassisMesh);
    meshes.chassis = chassisMesh;

    parts.push({
        name: 'Main Chassis',
        description: 'The core body of the rover containing computers and electronics, insulated from extreme Mars temperatures.',
        material: 'whitePaint',
        function: 'Houses and protects vital rover systems.',
        assemblyOrder: 1,
        connections: ['Rocker-Bogie', 'Mast', 'RTG'],
        failureEffect: 'Total system failure if electronics freeze or fry.',
        cascadeFailures: ['Communication', 'Mobility', 'Instruments'],
        originalPosition: { x: 0, y: 0.8, z: 0 },
        explodedPosition: { x: 0, y: 3, z: 0 }
    });

    // 2. Rocker-Bogie Suspension & Wheels
    const wheelGeom = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 32);
    wheelGeom.rotateZ(Math.PI / 2);
    const positions = [
        [-1.2, 0.4, 1.2], [1.2, 0.4, 1.2],
        [-1.4, 0.4, 0],   [1.4, 0.4, 0],
        [-1.2, 0.4, -1.2],[1.2, 0.4, -1.2]
    ];
    
    positions.forEach((pos, i) => {
        const wheel = new THREE.Mesh(wheelGeom, rubber);
        wheel.position.set(...pos);
        group.add(wheel);
        meshes[`wheel_${i}`] = wheel;

        parts.push({
            name: `Wheel ${i+1}`,
            description: 'Cleated aluminum wheel designed for Martian terrain.',
            material: 'rubber',
            function: 'Provides mobility over rocky and sandy terrain.',
            assemblyOrder: 2 + i,
            connections: ['Suspension'],
            failureEffect: 'Reduced mobility or rover gets stuck.',
            cascadeFailures: [],
            originalPosition: { x: pos[0], y: pos[1], z: pos[2] },
            explodedPosition: { x: pos[0] * 2, y: pos[1], z: pos[2] * 2 }
        });
    });

    const suspensionGeom = new THREE.CylinderGeometry(0.05, 0.05, 3);
    const suspL = new THREE.Mesh(suspensionGeom, darkSteel);
    suspL.rotation.x = Math.PI / 2;
    suspL.position.set(-1.3, 0.6, 0);
    group.add(suspL);
    meshes.suspL = suspL;

    const suspR = new THREE.Mesh(suspensionGeom, darkSteel);
    suspR.rotation.x = Math.PI / 2;
    suspR.position.set(1.3, 0.6, 0);
    group.add(suspR);
    meshes.suspR = suspR;

    // 3. RTG (Power Source)
    const rtgGeom = new THREE.CylinderGeometry(0.4, 0.4, 0.8, 16);
    const rtgMesh = new THREE.Mesh(rtgGeom, darkSteel);
    rtgMesh.position.set(0, 1, -1.2);
    rtgMesh.rotation.x = Math.PI / 2;
    group.add(rtgMesh);
    meshes.rtg = rtgMesh;
    
    // Add RTG fins
    for(let i=0; i<8; i++) {
        const finGeom = new THREE.BoxGeometry(0.1, 0.9, 0.2);
        const fin = new THREE.Mesh(finGeom, darkSteel);
        fin.position.set(Math.cos(i*Math.PI/4)*0.45, 0, Math.sin(i*Math.PI/4)*0.45);
        fin.rotation.y = -i*Math.PI/4;
        rtgMesh.add(fin);
    }

    parts.push({
        name: 'RTG (Radioisotope Thermoelectric Generator)',
        description: 'Converts heat from the natural radioactive decay of plutonium-238 into electricity.',
        material: 'darkSteel',
        function: 'Provides continuous power to the rover.',
        assemblyOrder: 8,
        connections: ['Chassis'],
        failureEffect: 'Loss of power; rover enters safe mode or dies.',
        cascadeFailures: ['All Systems'],
        originalPosition: { x: 0, y: 1, z: -1.2 },
        explodedPosition: { x: 0, y: 1, z: -3 }
    });

    // 4. Remote Sensing Mast (RSM)
    const mastGeom = new THREE.CylinderGeometry(0.08, 0.08, 1.5);
    const mastMesh = new THREE.Mesh(mastGeom, aluminum);
    mastMesh.position.set(0.6, 1.9, 1);
    group.add(mastMesh);
    meshes.mast = mastMesh;

    // 5. ChemCam / SuperCam Head
    const camHeadGroup = new THREE.Group();
    camHeadGroup.position.set(0, 0.75, 0);
    mastMesh.add(camHeadGroup);
    meshes.camHead = camHeadGroup;

    const camBox = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const camMesh = new THREE.Mesh(camBox, whitePaint);
    camHeadGroup.add(camMesh);
    
    const lensGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.05);
    lensGeom.rotateX(Math.PI/2);
    const lensMesh = new THREE.Mesh(lensGeom, glass);
    lensMesh.position.set(0, 0, 0.22);
    camHeadGroup.add(lensMesh);

    // Laser beam (hidden initially)
    const laserGeom = new THREE.CylinderGeometry(0.02, 0.02, 4);
    laserGeom.rotateX(Math.PI/2);
    const laserMesh = new THREE.Mesh(laserGeom, laserBeamMat);
    laserMesh.position.set(0, 0, 2.22);
    laserMesh.visible = false;
    camHeadGroup.add(laserMesh);
    meshes.laserBeam = laserMesh;

    parts.push({
        name: 'ChemCam/SuperCam',
        description: 'Fires a laser to vaporize rock surfaces and analyzes the plasma to determine chemical composition.',
        material: 'glass, aluminum',
        function: 'Laser-Induced Breakdown Spectroscopy (LIBS).',
        assemblyOrder: 9,
        connections: ['Mast'],
        failureEffect: 'Inability to remotely determine rock composition.',
        cascadeFailures: [],
        originalPosition: { x: 0.6, y: 2.65, z: 1 },
        explodedPosition: { x: 2, y: 4, z: 1 }
    });

    // Target Rock for laser demonstration
    const rockGeom = new THREE.DodecahedronGeometry(0.3, 1);
    const rockMesh = new THREE.Mesh(rockGeom, new THREE.MeshStandardMaterial({color: 0x884422, roughness: 0.9}));
    rockMesh.position.set(0.6, 0.2, 4);
    group.add(rockMesh);
    meshes.rock = rockMesh;

    // Vapor cloud (hidden initially)
    const vaporCloud = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), vaporMat);
    vaporCloud.position.set(0.6, 0.2, 3.8);
    vaporCloud.visible = false;
    group.add(vaporCloud);
    meshes.vaporCloud = vaporCloud;

    // 6. Robotic Arm
    const armBase = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.3), aluminum);
    armBase.position.set(0, 0.8, 1.5);
    armBase.rotation.x = Math.PI/2;
    group.add(armBase);

    const arm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.2), aluminum);
    arm1.position.set(0, 0.6, 0.2);
    arm1.rotation.x = Math.PI/4;
    armBase.add(arm1);
    meshes.arm1 = arm1;
    
    const arm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.2), aluminum);
    arm2.position.set(0, 1.0, 0);
    arm2.rotation.x = -Math.PI/2;
    arm1.add(arm2);
    meshes.arm2 = arm2;
    
    const turret = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.3), darkSteel);
    turret.position.set(0, 0.6, 0);
    arm2.add(turret);

    parts.push({
        name: 'Robotic Arm & Turret',
        description: 'Contains contact instruments like PIXL and SHERLOC for close-up scanning and drilling.',
        material: 'aluminum',
        function: 'Close-up analysis and sample collection.',
        assemblyOrder: 10,
        connections: ['Chassis'],
        failureEffect: 'Loss of ability to gather samples or do microscopic analysis.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0.8, z: 1.5 },
        explodedPosition: { x: 0, y: 1, z: 4 }
    });

    const description = "The Mars Rover is a highly advanced robotic scientist designed to explore the Martian surface, seeking signs of past microbial life, characterizing the planet's climate and geology, and collecting samples for future return to Earth. Its primary remote sensing tool utilizes Laser-Induced Breakdown Spectroscopy (LIBS) to vaporize rock and analyze its elemental composition.";

    const quizQuestions = [
        {
            question: "What powers modern Mars Rovers like Curiosity and Perseverance?",
            options: [
                "Solar Panels",
                "Lithium-ion Batteries alone",
                "Radioisotope Thermoelectric Generator (RTG)",
                "Hydrogen Fuel Cells"
            ],
            correct: 2,
            explanation: "An RTG provides reliable continuous power by converting the heat from the radioactive decay of plutonium into electricity, unaffected by Martian dust storms or night.",
            difficulty: "Medium"
        },
        {
            question: "How does the ChemCam/SuperCam determine the chemical composition of a rock?",
            options: [
                "By measuring its magnetic field",
                "By firing a laser to vaporize a small spot and analyzing the resulting plasma spectrum",
                "By picking up the rock and weighing it",
                "By pouring acid on it and observing the reaction"
            ],
            correct: 1,
            explanation: "It uses Laser-Induced Breakdown Spectroscopy (LIBS). The laser creates a plasma from the rock surface, and spectrometers read the light emitted to determine elemental composition.",
            difficulty: "Hard"
        },
        {
            question: "Why do Mars rovers typically use a Rocker-Bogie suspension system?",
            options: [
                "It allows the rover to go faster",
                "It requires fewer moving parts and motors",
                "It maintains weight distribution on all six wheels while driving over uneven terrain",
                "It is lighter than traditional spring suspensions"
            ],
            correct: 2,
            explanation: "The Rocker-Bogie system keeps all six wheels on the ground and distributing weight evenly, allowing the rover to climb over rocks twice the diameter of its wheels without tipping.",
            difficulty: "Medium"
        }
    ];

    let laserTimer = 0;
    function animate(time, speed, activeMeshes) {
        // Move wheels
        const wheelSpeed = speed * 2;
        for(let i=0; i<6; i++) {
            if(activeMeshes[`wheel_${i}`]) {
                activeMeshes[`wheel_${i}`].rotation.x += wheelSpeed;
            }
        }

        // Move Arm
        if(activeMeshes.arm1) {
            activeMeshes.arm1.rotation.x = Math.PI/4 + Math.sin(time * 0.5) * 0.2;
        }

        // ChemCam tracking rock
        if(activeMeshes.camHead) {
            // Sweep back and forth slightly, then point at rock
            const targetX = Math.sin(time) * 0.1;
            activeMeshes.camHead.rotation.y = targetX;
            activeMeshes.camHead.rotation.x = -0.15; // pointed down slightly
        }

        // Laser Firing Sequence (fires periodically)
        laserTimer += speed;
        if(laserTimer > 4) laserTimer = 0;

        if(activeMeshes.laserBeam && activeMeshes.vaporCloud) {
            if(laserTimer > 3 && laserTimer < 3.2) {
                activeMeshes.laserBeam.visible = true;
                // Pulsing effect
                activeMeshes.laserBeam.material.opacity = 0.5 + Math.random() * 0.5;
                
                activeMeshes.vaporCloud.visible = true;
                const scale = 1 + Math.random();
                activeMeshes.vaporCloud.scale.set(scale, scale, scale);
                activeMeshes.vaporCloud.material.opacity = 0.8 - (laserTimer - 3)*2;
            } else {
                activeMeshes.laserBeam.visible = false;
                activeMeshes.vaporCloud.visible = false;
            }
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createMarsRover() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
