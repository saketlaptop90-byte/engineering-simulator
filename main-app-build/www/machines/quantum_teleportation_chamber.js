import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Glowing/Neon Materials
    const neonCyan = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 3.0,
        transparent: true,
        opacity: 0.8,
        wireframe: true,
    });
    const plasmaMagenta = new THREE.MeshPhysicalMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.9,
    });
    const energyCore = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: 0xaaccff,
        emissiveIntensity: 5.0,
        transmission: 0.9,
        ior: 1.5,
        transparent: true,
        opacity: 0.9,
    });
    const darkAlloy = new THREE.MeshStandardMaterial({
        color: 0x0a0a0a,
        metalness: 0.9,
        roughness: 0.2,
    });
    const quantumGold = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0x442200,
        metalness: 1.0,
        roughness: 0.1,
    });
    const neonGreen = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 2.0,
        wireframe: true,
    });

    const addPart = (mesh, name, desc, matName, func, order, conns, fail, cascade, orig, expl) => {
        mesh.position.set(orig.x, orig.y, orig.z);
        mesh.userData.originalPosition = orig;
        group.add(mesh);
        meshes[name] = mesh;
        parts.push({
            name, description: desc, material: matName, function: func, assemblyOrder: order,
            connections: conns, failureEffect: fail, cascadeFailures: cascade,
            originalPosition: orig, explodedPosition: expl
        });
    };

    // 1. Base Platform
    const baseGeo = new THREE.CylinderGeometry(6, 6.5, 1, 64);
    const baseMesh = new THREE.Mesh(baseGeo, darkAlloy);
    addPart(baseMesh, 'ContainmentBase', 'Heavy containment base platform', 'darkSteel', 'Anchors the teleporter', 1, ['CorePedestal', 'DataConduit'], 'Loss of alignment', ['QuantumDecoherence'], {x:0, y:-4.5, z:0}, {x:0, y:-10, z:0});

    // 2. Data Conduits (Outer Ring Base)
    const conduitGeo = new THREE.TorusGeometry(5, 0.2, 16, 64);
    const conduitMesh = new THREE.Mesh(conduitGeo, neonGreen);
    conduitMesh.rotation.x = Math.PI / 2;
    addPart(conduitMesh, 'DataConduit', 'High-speed data ring', 'glass', 'Transmits state vector data', 2, ['ContainmentBase'], 'Data corruption', ['MolecularScrambling'], {x:0, y:-4, z:0}, {x:0, y:-8, z:0});

    // 3. Pedestal
    const pedestalGeo = new THREE.CylinderGeometry(2, 3, 2.5, 32);
    const pedestalMesh = new THREE.Mesh(pedestalGeo, chrome);
    addPart(pedestalMesh, 'CorePedestal', 'Chrome pedestal', 'chrome', 'Elevates matter core', 3, ['ContainmentBase', 'QuantumCore'], 'Core drops', ['CoreExplosion'], {x:0, y:-2.75, z:0}, {x:0, y:-6, z:0});

    // 4. Quantum Core (Target object)
    const coreGeo = new THREE.IcosahedronGeometry(1.2, 2); 
    const coreMesh = new THREE.Mesh(coreGeo, energyCore);
    addPart(coreMesh, 'QuantumCore', 'Pulsing energy core', 'glass', 'Contains the subject matter', 4, ['CorePedestal', 'EntanglementRings'], 'Radiation leak', ['TotalAnnihilation'], {x:0, y:-0.5, z:0}, {x:0, y:0, z:0});

    // 5. Entanglement Rings (Gimbal setup)
    const ring1Geo = new THREE.TorusGeometry(3.5, 0.15, 16, 100);
    const ring1Mesh = new THREE.Mesh(ring1Geo, neonCyan);
    addPart(ring1Mesh, 'EntanglementRingX', 'X-Axis Ring', 'plastic', 'X-axis entanglement field', 5, ['QuantumCore'], 'Field collapse', ['Decoherence'], {x:0, y:-0.5, z:0}, {x:-5, y:0, z:0});

    const ring2Geo = new THREE.TorusGeometry(4.0, 0.15, 16, 100);
    const ring2Mesh = new THREE.Mesh(ring2Geo, plasmaMagenta);
    addPart(ring2Mesh, 'EntanglementRingY', 'Y-Axis Ring', 'glass', 'Y-axis entanglement field', 6, ['QuantumCore'], 'Focus drift', ['TargetScattering'], {x:0, y:-0.5, z:0}, {x:5, y:0, z:0});

    const ring3Geo = new THREE.TorusGeometry(4.5, 0.15, 16, 100);
    const ring3Mesh = new THREE.Mesh(ring3Geo, neonGreen);
    addPart(ring3Mesh, 'EntanglementRingZ', 'Z-Axis Ring', 'glass', 'Z-axis entanglement field', 7, ['QuantumCore'], 'Phase shift', ['TemporalDisplacement'], {x:0, y:-0.5, z:0}, {x:0, y:0, z:5});

    // 6. Magnetic Stabilizers (Pillars) with moving pistons
    for(let i = 0; i < 4; i++) {
        const angle = (Math.PI / 2) * i;
        const x = Math.cos(angle) * 5.5;
        const z = Math.sin(angle) * 5.5;
        
        // Outer housing
        const pGeo = new THREE.CylinderGeometry(0.4, 0.5, 9, 16);
        const pMesh = new THREE.Mesh(pGeo, quantumGold);
        addPart(pMesh, `Stabilizer_${i}`, `Magnetic stabilizer ${i+1}`, 'copper', 'Maintains field integrity', 8+i*2, ['ContainmentBase', 'TopDome'], 'Magnetic fluctuation', ['RingMisalignment'], {x, y:0, z}, {x: x*2, y:2, z: z*2});

        // Inner Piston
        const pistonGeo = new THREE.CylinderGeometry(0.2, 0.2, 4, 16);
        const pistonMesh = new THREE.Mesh(pistonGeo, steel);
        addPart(pistonMesh, `Piston_${i}`, `Active Piston ${i+1}`, 'steel', 'Dynamically adjusts magnetic field', 9+i*2, [`Stabilizer_${i}`], 'Field rigidity loss', ['MicroFractures'], {x, y:0, z}, {x: x*2.5, y:2, z: z*2.5});
    }

    // 7. Top Dome (Contains everything)
    const domeGeo = new THREE.SphereGeometry(6, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMesh = new THREE.Mesh(domeGeo, tinted);
    addPart(domeMesh, 'TopDome', 'Protective energy dome', 'tinted', 'Contains quantum radiation', 20, ['Stabilizer_0'], 'Radiation escape', ['ObserverEffect'], {x:0, y:4.5, z:0}, {x:0, y:12, z:0});

    // 8. Scanner Emitter (Pulsing inner beam)
    const beamGeo = new THREE.CylinderGeometry(0.8, 3, 5, 64);
    const beamMesh = new THREE.Mesh(beamGeo, plasmaMagenta);
    beamMesh.material.transparent = true;
    beamMesh.material.opacity = 0.5;
    beamMesh.material.side = THREE.DoubleSide;
    addPart(beamMesh, 'ScannerBeam', 'Downward plasma beam', 'glass', 'Scans atomic structure', 21, ['TopDome', 'QuantumCore'], 'Incomplete scan', ['CloningError'], {x:0, y:2.5, z:0}, {x:0, y:8, z:0});

    // 9. Floating Energy Orbs (Micro-satellites)
    for(let i=0; i<3; i++) {
        const orbGeo = new THREE.SphereGeometry(0.3, 16, 16);
        const orbMesh = new THREE.Mesh(orbGeo, neonCyan);
        addPart(orbMesh, `MicroSat_${i}`, `Micro-Satellite ${i+1}`, 'glass', 'Maps quantum fluctuations', 22+i, ['ScannerBeam'], 'Mapping blind spot', ['PartialTeleport'], {x:0, y:0, z:0}, {x:0, y:10, z:0}); 
    }

    // 10. Cooling Fans
    for (let i = 0; i < 2; i++) {
        const fanGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.2, 16);
        const fanMesh = new THREE.Mesh(fanGeo, aluminum);
        const fanZ = i === 0 ? 6.1 : -6.1;
        addPart(fanMesh, `CoolingFan_${i}`, `Plasma Cooling Fan ${i+1}`, 'aluminum', 'Dissipates excess thermal energy', 25+i, ['ContainmentBase'], 'Overheating', ['CoreExplosion'], {x:0, y:-3.5, z:fanZ}, {x:0, y:-3.5, z:fanZ*2});
        
        // Fan blades
        const bladesGeo = new THREE.BoxGeometry(2.8, 0.1, 0.5);
        const bladesMesh = new THREE.Mesh(bladesGeo, darkSteel);
        bladesMesh.position.set(0, 0, 0);
        fanMesh.add(bladesMesh);
        
        const bladesMesh2 = new THREE.Mesh(bladesGeo, darkSteel);
        bladesMesh2.rotation.y = Math.PI / 2;
        fanMesh.add(bladesMesh2);
    }

    const description = "The Quantum Teleportation Chamber (Matter Entanglement Scanner) is an ultra high-tech apparatus that scans atomic structures and entangles them with a distant location. It uses a three-axis gimbal of entanglement rings, high-speed data conduits, dynamically adjusting magnetic pistons, and micro-satellites mapping quantum fluctuations.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Entanglement Rings?",
            options: ["Generating gravity", "Generating multi-axis entanglement fields", "Providing oxygen", "Absorbing light"],
            correct: 1,
            explanation: "The three entanglement rings spin on the X, Y, and Z axes to generate and maintain a complete 3D quantum entanglement field.",
            difficulty: "Medium"
        },
        {
            question: "Why are the Magnetic Stabilizers plated in Quantum Gold?",
            options: ["For aesthetic value", "To increase weight", "To maintain rigid magnetic field integrity", "To reflect lasers"],
            correct: 2,
            explanation: "Quantum Gold is a highly conductive metamaterial that ensures zero magnetic fluctuation, maintaining field integrity.",
            difficulty: "Hard"
        },
        {
            question: "What happens if the Data Conduit fails?",
            options: ["Molecular Scrambling", "The machine speeds up", "The rings stop spinning", "The core turns invisible"],
            correct: 0,
            explanation: "Data corruption in the high-speed data conduit leads to Molecular Scrambling as the state vector data is lost.",
            difficulty: "Easy"
        },
        {
            question: "What role do the active Pistons play?",
            options: ["Pumping fluids", "Dynamically adjusting magnetic fields", "Cooling the core", "Generating power"],
            correct: 1,
            explanation: "The active pistons inside the stabilizers dynamically adjust the magnetic field to prevent rigidity loss and micro-fractures in the transport tunnel.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, activeMeshes) {
        const t = time * speed;
        
        if (activeMeshes['QuantumCore']) {
            activeMeshes['QuantumCore'].rotation.x = t * 0.5;
            activeMeshes['QuantumCore'].rotation.y = t * 0.7;
            activeMeshes['QuantumCore'].material.emissiveIntensity = 2.0 + Math.sin(t * 5) * 1.5;
            activeMeshes['QuantumCore'].scale.setScalar(1.0 + Math.sin(t*10)*0.05);
        }

        if (activeMeshes['DataConduit']) {
            activeMeshes['DataConduit'].rotation.z = t * 4.0;
            activeMeshes['DataConduit'].material.emissiveIntensity = 2.0 + Math.sin(t * 20) * 1.0;
        }

        if (activeMeshes['EntanglementRingX']) {
            activeMeshes['EntanglementRingX'].rotation.x = t * 2.0;
            activeMeshes['EntanglementRingX'].rotation.y = t * 1.5;
        }
        if (activeMeshes['EntanglementRingY']) {
            activeMeshes['EntanglementRingY'].rotation.y = -t * 2.5;
            activeMeshes['EntanglementRingY'].rotation.z = t * 1.2;
        }
        if (activeMeshes['EntanglementRingZ']) {
            activeMeshes['EntanglementRingZ'].rotation.z = t * 3.0;
            activeMeshes['EntanglementRingZ'].rotation.x = -t * 1.8;
        }

        if (activeMeshes['ScannerBeam']) {
            activeMeshes['ScannerBeam'].material.opacity = 0.3 + Math.abs(Math.sin(t * 8)) * 0.4;
            activeMeshes['ScannerBeam'].position.y = 2.5 + Math.sin(t * 3) * 0.3;
            activeMeshes['ScannerBeam'].rotation.y = t * 5.0;
        }
        
        if (activeMeshes['TopDome']) {
            activeMeshes['TopDome'].rotation.y = t * 0.2;
        }

        for(let i=0; i<4; i++) {
            const piston = activeMeshes[`Piston_${i}`];
            if (piston) {
                const offset = i * (Math.PI/2);
                piston.position.y = piston.userData.originalPosition.y + Math.sin(t * 8 + offset) * 1.5;
            }
        }

        for(let i=0; i<3; i++) {
            const sat = activeMeshes[`MicroSat_${i}`];
            if (sat) {
                const angle = t * 4 + (i * Math.PI * 2 / 3);
                const radius = 2.0 + Math.sin(t * 2 + i)*0.5;
                sat.position.x = Math.cos(angle) * radius;
                sat.position.z = Math.sin(angle) * radius;
                sat.position.y = -0.5 + Math.sin(t * 5 + i) * 1.5;
            }
        }

        for(let i=0; i<2; i++) {
            const fan = activeMeshes[`CoolingFan_${i}`];
            if (fan) {
                fan.rotation.y = t * 15.0; // High speed rotation
            }
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createQuantumTeleportationChamber() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
