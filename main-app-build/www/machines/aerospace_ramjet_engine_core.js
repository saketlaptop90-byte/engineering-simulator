import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Helper custom glowing materials
    const plasmaGlow = new THREE.MeshStandardMaterial({ 
        color: 0x00ffff, 
        emissive: 0x00aaff, 
        emissiveIntensity: 2, 
        transparent: true, 
        opacity: 0.8 
    });
    const combustionGlow = new THREE.MeshStandardMaterial({
        color: 0xff5500,
        emissive: 0xff2200,
        emissiveIntensity: 3,
        transparent: true,
        opacity: 0.9,
        wireframe: true
    });
    const hyperEnergyLine = new THREE.MeshBasicMaterial({
        color: 0xaa00ff,
        transparent: true,
        opacity: 0.6,
        wireframe: false,
        blending: THREE.AdditiveBlending
    });

    // 1. Shock Cone
    const p1Group = new THREE.Group();
    const coneGeo = new THREE.ConeGeometry(1.4, 4, 64);
    const shockConeMesh = new THREE.Mesh(coneGeo, chrome);
    shockConeMesh.rotation.z = -Math.PI / 2;
    p1Group.add(shockConeMesh);
    p1Group.position.set(2, 0, 0);
    group.add(p1Group);
    meshes.shockCone = shockConeMesh;
    parts.push({
        name: 'Supersonic Shock Cone',
        description: 'Generates oblique shockwaves to cleanly compress and decelerate incoming supersonic airflow.',
        material: 'chrome',
        function: 'Airflow Deceleration & Compression',
        assemblyOrder: 1,
        connections: ['Intake Cowl'],
        failureEffect: 'Unstarted intake, massive drag spike, flameout.',
        cascadeFailures: ['Combustion Chamber', 'Plasma Igniter Ring'],
        originalPosition: { x: 2, y: 0, z: 0 },
        explodedPosition: { x: 8, y: 0, z: 0 }
    });

    // 2. Intake Cowl
    const p2Group = new THREE.Group();
    const cowlGeo = new THREE.CylinderGeometry(2.2, 2.5, 4, 64, 1, true);
    const cowlMesh = new THREE.Mesh(cowlGeo, darkSteel);
    cowlMesh.rotation.z = -Math.PI / 2;
    p2Group.add(cowlMesh);
    p2Group.position.set(2, 0, 0);
    group.add(p2Group);
    parts.push({
        name: 'Intake Cowl',
        description: 'Captures high-velocity air and diffuses it, exponentially increasing static pressure for optimal combustion.',
        material: 'darkSteel',
        function: 'Air Diffuser',
        assemblyOrder: 2,
        connections: ['Shock Cone', 'Combustion Chamber'],
        failureEffect: 'Pressure loss, choked airflow.',
        cascadeFailures: ['Fuel Injection Grid'],
        originalPosition: { x: 2, y: 0, z: 0 },
        explodedPosition: { x: 2, y: 5, z: 0 }
    });

    // 3. Sensor & Avionics Array
    const p3Group = new THREE.Group();
    const box1 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.6, 1.2), chrome);
    box1.position.set(0, 2.8, 0);
    p3Group.add(box1);
    const box2 = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.5, 1.0), darkSteel);
    box2.position.set(-2, -2.8, 0);
    p3Group.add(box2);
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 2.8, 0),
        new THREE.Vector3(-0.5, 2.7, 1.5),
        new THREE.Vector3(-1.5, 0, 2.6),
        new THREE.Vector3(-2, -2.8, 0)
    ]);
    const cable = new THREE.Mesh(new THREE.TubeGeometry(curve, 32, 0.06, 8, false), rubber);
    p3Group.add(cable);
    const light = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial({color: 0x00ff00}));
    light.position.set(0, 3.2, 0);
    p3Group.add(light);
    meshes.statusLight = light;
    p3Group.position.set(0, 0, 0);
    group.add(p3Group);
    parts.push({
        name: 'Avionics & Sensor Array',
        description: 'High-speed telemetry modules that monitor shockwave position, temperatures, and dynamic pressures.',
        material: 'chrome',
        function: 'Engine Management',
        assemblyOrder: 3,
        connections: ['Intake Cowl', 'Combustion Chamber Shell'],
        failureEffect: 'Suboptimal fuel mixing, engine surge.',
        cascadeFailures: ['Combustion Chamber Shell'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 6, z: 0 }
    });

    // 4. Fuel Injection Grid
    const p4Group = new THREE.Group();
    for(let i=0; i<4; i++) {
        const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 4.8), copper);
        bar.rotation.x = (i * Math.PI) / 4;
        p4Group.add(bar);
    }
    const hub = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), chrome);
    p4Group.add(hub);
    p4Group.position.set(-0.5, 0, 0);
    group.add(p4Group);
    parts.push({
        name: 'Fuel Injection Grid',
        description: 'Distributes atomized fuel evenly into the supersonic airstream using a hyper-pressurized spider-web grid.',
        material: 'copper',
        function: 'Fuel Atomization',
        assemblyOrder: 4,
        connections: ['Flame Holders', 'Intake Cowl'],
        failureEffect: 'Fuel starvation or unequal thermal expansion.',
        cascadeFailures: ['Reaction Core (Plasma)'],
        originalPosition: { x: -0.5, y: 0, z: 0 },
        explodedPosition: { x: -0.5, y: 0, z: 6 }
    });

    // 5. Flame Holders
    const p5Group = new THREE.Group();
    const holder1 = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.2, 3, 64), darkSteel);
    holder1.rotation.y = Math.PI / 2;
    p5Group.add(holder1);
    const holder2 = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.15, 3, 64), darkSteel);
    holder2.rotation.y = Math.PI / 2;
    p5Group.add(holder2);
    for(let i=0; i<4; i++) {
        const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.4), darkSteel);
        strut.position.y = 1.15;
        const pivot = new THREE.Group();
        pivot.add(strut);
        pivot.rotation.x = (i * Math.PI) / 2;
        p5Group.add(pivot);
    }
    p5Group.position.set(-1.5, 0, 0);
    group.add(p5Group);
    parts.push({
        name: 'Flame Holders (V-Gutters)',
        description: 'Creates low-velocity recirculation zones to anchor the supersonic flame and prevent blowout.',
        material: 'darkSteel',
        function: 'Flame Stabilization',
        assemblyOrder: 5,
        connections: ['Fuel Injection Grid', 'Combustion Chamber Shell'],
        failureEffect: 'Engine blowout and total loss of thrust.',
        cascadeFailures: ['Exhaust Nozzle'],
        originalPosition: { x: -1.5, y: 0, z: 0 },
        explodedPosition: { x: -1.5, y: 0, z: -6 }
    });

    // 6. Combustion Chamber Shell
    const p6Group = new THREE.Group();
    const chamberGeo = new THREE.CylinderGeometry(2.5, 2.5, 6, 64, 1, true);
    const chamberMesh = new THREE.Mesh(chamberGeo, steel);
    chamberMesh.rotation.z = -Math.PI / 2;
    p6Group.add(chamberMesh);
    p6Group.position.set(-3, 0, 0);
    group.add(p6Group);
    parts.push({
        name: 'Combustion Chamber Shell',
        description: 'Houses the intense thermal and pressure loads of supersonic combustion.',
        material: 'steel',
        function: 'Combustion Containment',
        assemblyOrder: 6,
        connections: ['Regenerative Cooling Tubes', 'Exhaust Nozzle'],
        failureEffect: 'Structural breach and catastrophic explosive decompression.',
        cascadeFailures: ['All Systems'],
        originalPosition: { x: -3, y: 0, z: 0 },
        explodedPosition: { x: -3, y: 6, z: 0 }
    });

    // 7. Regenerative Cooling Tubes
    const p7Group = new THREE.Group();
    for (let i = 0; i < 32; i++) {
        const angle = (i / 32) * Math.PI * 2;
        const tubeGeo = new THREE.CylinderGeometry(0.06, 0.06, 6, 8);
        const tube = new THREE.Mesh(tubeGeo, copper);
        tube.rotation.z = Math.PI / 2;
        tube.position.set(0, Math.cos(angle) * 2.55, Math.sin(angle) * 2.55);
        p7Group.add(tube);
    }
    p7Group.position.set(-3, 0, 0);
    group.add(p7Group);
    parts.push({
        name: 'Regenerative Cooling Tubes',
        description: 'Circulates cryogenic fuel around the chamber before injection, simultaneously cooling the engine and pre-heating the fuel.',
        material: 'copper',
        function: 'Thermal Management',
        assemblyOrder: 7,
        connections: ['Combustion Chamber Shell', 'Fuel Injection Grid'],
        failureEffect: 'Engine meltdown, structural vaporization.',
        cascadeFailures: ['Combustion Chamber Shell'],
        originalPosition: { x: -3, y: 0, z: 0 },
        explodedPosition: { x: -3, y: -6, z: 0 }
    });

    // 8. Magnetic Containment Ribs
    const p8Group = new THREE.Group();
    for(let i=0; i<5; i++) {
        const rib = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.15, 16, 64), steel);
        rib.rotation.y = Math.PI / 2;
        rib.position.x = 2 - i;
        p8Group.add(rib);
        
        const glow = new THREE.Mesh(new THREE.TorusGeometry(2.55, 0.05, 8, 64), plasmaGlow);
        glow.rotation.y = Math.PI / 2;
        glow.position.x = 2 - i;
        p8Group.add(glow);
        meshes[`ribGlow${i}`] = glow;
    }
    p8Group.position.set(-3, 0, 0);
    group.add(p8Group);
    parts.push({
        name: 'Magnetic Containment Ribs',
        description: 'Sci-fi structural ribs that generate a localized magnetic field to keep plasma off the chamber walls.',
        material: 'steel',
        function: 'Plasma Containment',
        assemblyOrder: 8,
        connections: ['Combustion Chamber Shell'],
        failureEffect: 'Thermal runaway on chamber walls.',
        cascadeFailures: ['Regenerative Cooling Tubes'],
        originalPosition: { x: -3, y: 0, z: 0 },
        explodedPosition: { x: -3, y: 0, z: 6 }
    });

    // 9. Plasma Igniter Ring
    const p9Group = new THREE.Group();
    const igniterRing = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.1, 16, 64), hyperEnergyLine);
    igniterRing.rotation.y = Math.PI / 2;
    p9Group.add(igniterRing);
    for(let i=0; i<8; i++) {
        const node = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), plasmaGlow);
        const pivot = new THREE.Group();
        node.position.y = 2.0;
        pivot.add(node);
        pivot.rotation.x = (i * Math.PI) / 4;
        p9Group.add(pivot);
        meshes[`igniterNode${i}`] = node;
    }
    p9Group.position.set(-2.5, 0, 0);
    group.add(p9Group);
    parts.push({
        name: 'Plasma Igniter Ring',
        description: 'Fires high-voltage plasma arcs to instantly ignite the supersonic fuel-air mixture.',
        material: 'glass',
        function: 'Ignition',
        assemblyOrder: 9,
        connections: ['Flame Holders'],
        failureEffect: 'Failure to ignite, fuel flooding.',
        cascadeFailures: ['Reaction Core (Plasma)'],
        originalPosition: { x: -2.5, y: 0, z: 0 },
        explodedPosition: { x: -2.5, y: -5, z: 0 }
    });

    // 10. Reaction Core (Plasma)
    const p10Group = new THREE.Group();
    const coreMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 2.0, 4, 32, 1, true), combustionGlow);
    coreMesh.rotation.z = -Math.PI / 2;
    p10Group.add(coreMesh);
    meshes.coreMesh = coreMesh;
    const innerEnergy = new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.3, 128, 32), hyperEnergyLine);
    innerEnergy.scale.set(1.5, 0.8, 0.8);
    p10Group.add(innerEnergy);
    meshes.innerEnergy = innerEnergy;
    p10Group.position.set(-4.0, 0, 0);
    group.add(p10Group);
    parts.push({
        name: 'Reaction Core (Plasma)',
        description: 'The visual manifestation of the continuous, superheated supersonic combustion process.',
        material: 'glass',
        function: 'Thrust Generation',
        assemblyOrder: 10,
        connections: ['Combustion Chamber Shell', 'Exhaust Nozzle'],
        failureEffect: 'Loss of thrust.',
        cascadeFailures: [],
        originalPosition: { x: -4.0, y: 0, z: 0 },
        explodedPosition: { x: -4.0, y: 0, z: -8 }
    });

    // 11. Exhaust Nozzle
    const p11Group = new THREE.Group();
    const conv = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 1.2, 2, 64, 1, true), darkSteel);
    conv.rotation.z = -Math.PI / 2;
    conv.position.x = 1.5;
    p11Group.add(conv);
    const div = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 2.8, 4, 64, 1, true), chrome);
    div.rotation.z = -Math.PI / 2;
    div.position.x = -1.5;
    p11Group.add(div);
    p11Group.position.set(-8.5, 0, 0);
    group.add(p11Group);
    parts.push({
        name: 'Converging-Diverging Nozzle',
        description: 'Chokes the subsonic flow at the throat, then massively accelerates it to supersonic velocities in the diverging section.',
        material: 'chrome',
        function: 'Exhaust Acceleration',
        assemblyOrder: 11,
        connections: ['Combustion Chamber Shell'],
        failureEffect: 'Thrust blockage, internal overpressure.',
        cascadeFailures: ['Combustion Chamber Shell'],
        originalPosition: { x: -8.5, y: 0, z: 0 },
        explodedPosition: { x: -12, y: 5, z: 0 }
    });

    // 12. Exhaust Plume
    const p12Group = new THREE.Group();
    const plumeCyl = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 4.0, 14, 64, 1, true), new THREE.MeshBasicMaterial({ color: 0xff3300, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
    plumeCyl.rotation.z = -Math.PI / 2;
    p12Group.add(plumeCyl);
    meshes.plumeOuter = plumeCyl;
    const innerCyl = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 0.2, 12, 32, 1, true), new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending }));
    innerCyl.rotation.z = -Math.PI / 2;
    innerCyl.position.x = 1;
    p12Group.add(innerCyl);
    meshes.plumeInner = innerCyl;
    for(let i=0; i<5; i++) {
        const diamond = new THREE.Mesh(new THREE.OctahedronGeometry(1.2 - i*0.2, 0), hyperEnergyLine);
        diamond.position.x = 6 - i*2.2;
        p12Group.add(diamond);
        meshes[`diamond${i}`] = diamond;
    }
    p12Group.position.set(-19.0, 0, 0);
    group.add(p12Group);
    parts.push({
        name: 'Exhaust Plume',
        description: 'Supersonic exhaust gases forming intricate shock diamonds as the pressure equalizes with the atmosphere.',
        material: 'glass',
        function: 'Propulsion Visualization',
        assemblyOrder: 12,
        connections: ['Converging-Diverging Nozzle'],
        failureEffect: 'N/A',
        cascadeFailures: [],
        originalPosition: { x: -19.0, y: 0, z: 0 },
        explodedPosition: { x: -26.0, y: 0, z: 0 }
    });

    // 13. Incoming Air Particles
    const airParticlesGeo = new THREE.BufferGeometry();
    const particleCount = 300;
    const posArray = new Float32Array(particleCount * 3);
    for(let i=0; i<particleCount*3; i+=3) {
        posArray[i] = (Math.random() - 0.5) * 8; // X
        posArray[i+1] = (Math.random() - 0.5) * 4; // Y
        posArray[i+2] = (Math.random() - 0.5) * 4; // Z
    }
    airParticlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const airMat = new THREE.PointsMaterial({ size: 0.08, color: 0x88ccff, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
    const airSystem = new THREE.Points(airParticlesGeo, airMat);
    airSystem.position.set(4, 0, 0);
    group.add(airSystem);
    meshes.airSystem = airSystem;
    parts.push({
        name: 'Supersonic Airflow',
        description: 'Visual representation of high-speed air entering the engine.',
        material: 'glass',
        function: 'Environment Interaction',
        assemblyOrder: 13,
        connections: ['Shock Cone'],
        failureEffect: 'N/A',
        cascadeFailures: [],
        originalPosition: { x: 4, y: 0, z: 0 },
        explodedPosition: { x: 8, y: 5, z: 0 }
    });

    const description = "The Ramjet Engine Core represents the pinnacle of supersonic airbreathing propulsion. Lacking moving parts like compressors or turbines found in conventional jet engines, the ramjet relies entirely on the vehicle's forward motion to forcefully 'ram' and compress incoming supersonic air. This model features a hyper-advanced supersonic combustion cycle (Scramjet-ready), complete with magnetic containment ribs, regenerative cooling tubes, and an ultra-hot plasma reaction core. It is highly optimized for Mach 3+ operations, creating massive thrust through a converging-diverging exhaust nozzle and forming iconic shock diamonds in its wake.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Shock Cone in a ramjet?",
            options: [
                "To inject fuel into the engine",
                "To house the avionics system",
                "To generate oblique shockwaves that decelerate and compress incoming supersonic air",
                "To increase the speed of the exhaust gases"
            ],
            correct: 2,
            explanation: "The shock cone forces incoming supersonic airflow to form oblique shockwaves, safely decelerating it and immensely increasing static pressure before it enters the combustion chamber.",
            difficulty: "Medium"
        },
        {
            question: "Why does a ramjet engine not require a rotating compressor or turbine?",
            options: [
                "It uses liquid oxygen instead of air",
                "It relies on the extreme forward speed of the aircraft to 'ram' and compress the air",
                "It is driven by electric motors",
                "The fuel inherently contains its own oxidizer"
            ],
            correct: 1,
            explanation: "Ramjets operate entirely on 'ram pressure'. The forward speed of the vehicle naturally compresses the incoming air, eliminating the need for complex, heavy rotating machinery.",
            difficulty: "Easy"
        },
        {
            question: "What is the purpose of the Flame Holders (V-gutters) in the combustion chamber?",
            options: [
                "To cool the engine walls",
                "To prevent the flame from being blown out by creating low-velocity recirculation zones",
                "To compress the air further",
                "To steer the exhaust plume"
            ],
            correct: 1,
            explanation: "Because air flows through a ramjet at extremely high speeds, the flame can easily be blown out. Flame holders create sheltered recirculation zones where the fuel-air mixture can anchor and burn stably.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed) {
        if(meshes.shockCone) meshes.shockCone.rotation.y = time * speed;
        
        for(let i=0; i<8; i++) {
            if(meshes[`igniterNode${i}`]) {
                meshes[`igniterNode${i}`].scale.setScalar(1.0 + Math.sin(time * speed * 10 + i) * 0.3);
            }
        }
        
        if(meshes.innerEnergy) {
            meshes.innerEnergy.rotation.x = time * speed * 2;
            meshes.innerEnergy.rotation.y = time * speed * 3;
        }
        
        if(meshes.coreMesh) {
            meshes.coreMesh.material.emissiveIntensity = 2.0 + Math.sin(time * speed * 15) * 1.5;
            meshes.coreMesh.scale.set(1.0, 1.0 + Math.sin(time * speed * 20) * 0.02, 1.0 + Math.sin(time * speed * 20) * 0.02);
        }
        
        if(meshes.plumeOuter) {
            meshes.plumeOuter.scale.set(1.0 + Math.random()*0.05, 1.0 + Math.random()*0.05, 1.0);
        }
        if(meshes.plumeInner) {
            meshes.plumeInner.scale.set(1.0 + Math.sin(time * speed * 30)*0.1, 1.0, 1.0);
        }
        
        for(let i=0; i<5; i++) {
            if(meshes[`diamond${i}`]) {
                meshes[`diamond${i}`].scale.setScalar(1.0 + Math.sin(time * speed * 25 - i) * 0.15);
            }
        }
        
        if(meshes.airSystem) {
            const positions = meshes.airSystem.geometry.attributes.position.array;
            for(let i=0; i<300; i++) {
                positions[i*3] -= speed * 15;
                if(positions[i*3] < -8) { 
                    positions[i*3] = 2 + Math.random() * 2;
                    positions[i*3+1] = (Math.random() - 0.5) * 4;
                    positions[i*3+2] = (Math.random() - 0.5) * 4;
                }
            }
            meshes.airSystem.geometry.attributes.position.needsUpdate = true;
        }
        
        if(meshes.statusLight) {
            meshes.statusLight.material.color.setHex(Math.sin(time * speed * 5) > 0 ? 0x00ff00 : 0xff0000);
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createRamjetEngineCore() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
