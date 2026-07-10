import * as THREE from 'three';
import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine() {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    const dataCrystalMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x0055ff,
        emissiveIntensity: 2,
        transparent: true,
        opacity: 0.9,
        roughness: 0.0,
        transmission: 0.8
    });

    const obsidianRackMat = new THREE.MeshStandardMaterial({
        color: 0x0a0a0a,
        metalness: 0.9,
        roughness: 0.1
    });

    // 1. The Central Mind (Quantum Core)
    const mindGeo = new THREE.SphereGeometry(25, 64, 64);
    const mindMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 5,
        wireframe: true
    });
    const mind = new THREE.Mesh(mindGeo, mindMat);
    group.add(mind);
    meshes.mind = mind;

    parts.push({
        name: 'Quantum_Consciousness_Core',
        description: 'A matrioshka brain operating across multiple dimensions to process universal data.',
        material: 'Pure Photonic Logic',
        function: 'Indexes every event, thought, and particle interaction in existence.',
        assemblyOrder: 1,
        connections: ['Information_Buses'],
        failureEffect: 'Loss of cosmic history; events unhappen retroactively.',
        cascadeFailures: ['Causality Loop', 'Amnesia of the Universe'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 150, z: 0 }
    });

    // 2. Data Racks (Instanced)
    const rackCount = 1200;
    const rackGeo = new THREE.BoxGeometry(4, 40, 10);
    const rackMesh = new THREE.InstancedMesh(rackGeo, obsidianRackMat, rackCount);
    
    for(let i=0; i<rackCount; i++) {
        const mat = new THREE.Matrix4();
        // Arrange in a massive sphere around the core
        const r = 80 + Math.random() * 200;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        
        const pos = new THREE.Vector3().setFromSphericalCoords(r, phi, theta);
        mat.setPosition(pos);
        
        // Point rack towards center
        const dummy = new THREE.Object3D();
        dummy.position.copy(pos);
        dummy.lookAt(0,0,0);
        dummy.updateMatrix();
        
        rackMesh.setMatrixAt(i, dummy.matrix);
    }
    rackMesh.instanceMatrix.needsUpdate = true;
    group.add(rackMesh);
    meshes.racks = { mesh: rackMesh, count: rackCount };

    parts.push({
        name: 'Obsidian_Memory_Banks',
        description: 'Trillions of yottabytes of storage encoded into the spin states of exotic particles.',
        material: 'Neutronium-Doped Obsidian',
        function: 'Stores the Akashic Records.',
        assemblyOrder: 2,
        connections: [],
        failureEffect: 'Data corruption causing historical anomalies.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 300, y: 0, z: 0 }
    });

    // 3. Information Stream Buses
    const busGroup = new THREE.Group();
    for(let i=0; i<30; i++) {
        const busPath = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0,0,0),
            new THREE.Vector3((Math.random()-0.5)*200, (Math.random()-0.5)*200, (Math.random()-0.5)*200),
            new THREE.Vector3((Math.random()-0.5)*400, (Math.random()-0.5)*400, (Math.random()-0.5)*400)
        ]);
        const busGeo = new THREE.TubeGeometry(busPath, 20, 0.5, 8, false);
        const bus = new THREE.Mesh(busGeo, dataCrystalMat);
        busGroup.add(bus);
        meshes[`bus_${i}`] = bus;
    }
    group.add(busGroup);
    meshes.busGroup = busGroup;

    parts.push({
        name: 'Information_Stream_Buses',
        description: 'High-bandwidth optical conduits channeling raw reality data.',
        material: 'Tachyonic Crystal',
        function: 'Connects the memory banks to the processing core.',
        assemblyOrder: 3,
        connections: ['Quantum_Consciousness_Core'],
        failureEffect: 'Data bottleneck causing localized time dilation.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -200, z: 0 }
    });

    // 4. Energy Halo
    const haloGeo = new THREE.TorusGeometry(350, 2, 64, 128);
    const halo = new THREE.Mesh(haloGeo, new THREE.MeshStandardMaterial({color: 0xffaa00, emissive: 0xff5500, emissiveIntensity: 2}));
    halo.rotation.x = Math.PI/2;
    group.add(halo);
    meshes.halo = halo;

    const description = "The Akashic Record Server. A construct theorized to store the entirety of universal history, every thought, action, and event, encoded at the quantum level.";

    const quizQuestions = [
        {
            question: "In physics, what states that information cannot be destroyed, presenting a paradox when considering black hole evaporation?",
            options: [
                "The First Law of Thermodynamics",
                "The Holographic Principle",
                "No-cloning Theorem",
                "Conservation of Quantum Information"
            ],
            correctAnswer: 3,
            explanation: "The principle of Conservation of Quantum Information implies that information about a system's physical state must be preserved, leading to the Black Hole Information Paradox."
        },
        {
            question: "What concept suggests that the entire universe can be seen as a two-dimensional information structure 'painted' on the cosmological horizon?",
            options: [
                "String Theory",
                "Loop Quantum Gravity",
                "The Holographic Principle",
                "The Simulation Hypothesis"
            ],
            correctAnswer: 2,
            explanation: "The Holographic Principle (proposed by 't Hooft and Susskind) suggests that the description of a volume of space can be thought of as encoded on a lower-dimensional boundary to that region."
        },
        {
            question: "What is a 'Matrioshka brain'?",
            options: [
                "A computer made entirely of biological neurons.",
                "A megastructure composed of multiple nested Dyson spheres, using the waste heat of the inner sphere to power the outer one.",
                "A quantum computer that uses multiple parallel universes to compute.",
                "An AI that recursively improves its own code."
            ],
            correctAnswer: 1,
            explanation: "A Matrioshka brain is a theoretical megastructure consisting of nested Dyson spheres, designed to extract maximum possible computing power from a star."
        },
        {
            question: "What is Bekenstein bound?",
            options: [
                "The maximum speed of a spacecraft.",
                "The limit on the entropy (or information) that can be contained within a given finite region of space.",
                "The maximum size of a stable wormhole.",
                "The point where gravity overcomes the strong nuclear force."
            ],
            correctAnswer: 1,
            explanation: "The Bekenstein bound is an upper limit on the entropy (or information) that can be contained within a given finite region of space which has a finite amount of energy."
        },
        {
            question: "According to Landauer's principle, what physical action invariably generates a tiny amount of heat?",
            options: [
                "Copying information.",
                "Erasing information.",
                "Transmitting information.",
                "Encrypting information."
            ],
            correctAnswer: 1,
            explanation: "Landauer's principle states that any logically irreversible manipulation of information, such as the erasure of a bit, must be accompanied by a corresponding entropy increase (heat dissipation)."
        }
    ];

    function animate(time, speed, meshesObj, exploded) {
        if(meshesObj.mind) {
            // Pulse the core
            const pulse = 1 + Math.sin(time * speed * 4) * 0.1;
            meshesObj.mind.scale.set(pulse, pulse, pulse);
            meshesObj.mind.rotation.y = time * speed;
        }

        if(meshesObj.halo) {
            meshesObj.halo.rotation.z = time * speed * 0.1;
            // Wobble
            meshesObj.halo.rotation.x = Math.PI/2 + Math.sin(time*speed)*0.1;
        }

        if(meshesObj.racks && !exploded) {
            const mesh = meshesObj.racks.mesh;
            const count = meshesObj.racks.count;
            const dummy = new THREE.Object3D();
            
            for(let i=0; i<count; i++) {
                mesh.getMatrixAt(i, dummy.matrix);
                const pos = new THREE.Vector3().setFromMatrixPosition(dummy.matrix);
                
                // Very slow collective rotation
                const angle = Math.atan2(pos.z, pos.x) + (speed * 0.02);
                const radius = Math.sqrt(pos.x*pos.x + pos.z*pos.z);
                pos.x = Math.cos(angle) * radius;
                pos.z = Math.sin(angle) * radius;
                
                dummy.position.copy(pos);
                dummy.lookAt(0,0,0);
                
                // Random blinking logic via scale for "data access"
                if (Math.random() > 0.99) {
                    dummy.scale.set(1.2, 1.2, 1.2);
                } else {
                    dummy.scale.set(1, 1, 1);
                }
                
                dummy.updateMatrix();
                mesh.setMatrixAt(i, dummy.matrix);
            }
            mesh.instanceMatrix.needsUpdate = true;
        }

        if(meshesObj.busGroup) {
            meshesObj.busGroup.children.forEach((bus, i) => {
                bus.material.emissiveIntensity = Math.sin(time * speed * 10 + i) > 0 ? 3 : 0.5;
            });
        }
    }

    return { group, parts, description, quizQuestions, animate };
}
