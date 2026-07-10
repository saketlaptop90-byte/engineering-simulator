import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Custom Glowing/Neon Materials
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00bfff,
        emissive: 0x00bfff,
        emissiveIntensity: 1.2,
        transparent: true,
        opacity: 0.8,
        wireframe: true
    });

    const stellarCoreMat = new THREE.MeshStandardMaterial({
        color: 0xff8c00,
        emissive: 0xff4500,
        emissiveIntensity: 2.0,
        wireframe: false,
        roughness: 0.2,
        metalness: 0.8
    });

    const plasmaFieldMat = new THREE.MeshStandardMaterial({
        color: 0x8a2be2,
        emissive: 0x4b0082,
        emissiveIntensity: 1.0,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });
    
    const energyBeamMat = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    // Base Platform
    const baseGeo = new THREE.CylinderGeometry(6, 7, 1.5, 64);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, 0.75, 0);
    group.add(baseMesh);
    meshes.base = baseMesh;

    parts.push({
        name: "Quantum Gravimetric Base",
        description: "Heavy dark steel base laced with quantum locking mechanisms.",
        material: "darkSteel",
        function: "Isolates the oscillator from the space-time continuum's local vibrations.",
        assemblyOrder: 1,
        connections: ["Seismic Struts", "Energy Projectors"],
        failureEffect: "Dimensional drift",
        cascadeFailures: ["Complete data loss", "Spontaneous singularity"],
        originalPosition: { x: 0, y: 0.75, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    // Base glowing ring
    const baseRingGeo = new THREE.TorusGeometry(6.5, 0.1, 16, 64);
    const baseRing = new THREE.Mesh(baseRingGeo, neonBlue);
    baseRing.position.set(0, 1.5, 0);
    baseRing.rotation.x = Math.PI / 2;
    group.add(baseRing);
    
    parts.push({
        name: "Cooling Halo",
        description: "Neon-infused cooling loop.",
        material: "neonBlue",
        function: "Dissipates excess thermal energy from the base.",
        assemblyOrder: 2,
        connections: ["Quantum Gravimetric Base"],
        failureEffect: "Overheating",
        cascadeFailures: ["Melted base platform"],
        originalPosition: { x: 0, y: 1.5, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 8 }
    });

    // Central Core (Star representation)
    const coreGeo = new THREE.IcosahedronGeometry(2, 4); // high detail sphere
    const coreMesh = new THREE.Mesh(coreGeo, stellarCoreMat);
    coreMesh.position.set(0, 7, 0);
    group.add(coreMesh);
    meshes.core = coreMesh;

    parts.push({
        name: "Stellar Surrogate Core",
        description: "Superheated isomorphic plasma simulating a stellar interior.",
        material: "stellarCoreMat",
        function: "Replicates internal acoustic modes of a target star.",
        assemblyOrder: 3,
        connections: ["Containment Rings"],
        failureEffect: "Plasma containment failure",
        cascadeFailures: ["Vaporization of local facility"],
        originalPosition: { x: 0, y: 7, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 0 }
    });

    // Plasma Field
    const plasmaGeo = new THREE.IcosahedronGeometry(2.4, 2);
    const plasmaMesh = new THREE.Mesh(plasmaGeo, plasmaFieldMat);
    plasmaMesh.position.set(0, 7, 0);
    group.add(plasmaMesh);
    meshes.plasma = plasmaMesh;

    parts.push({
        name: "Magnetic Boundary Layer",
        description: "Intense magnetic confinement matrix.",
        material: "plasmaFieldMat",
        function: "Maintains temperature/pressure gradients of the core.",
        assemblyOrder: 4,
        connections: ["Stellar Surrogate Core"],
        failureEffect: "Core destabilization",
        cascadeFailures: ["Core collapse"],
        originalPosition: { x: 0, y: 7, z: 0 },
        explodedPosition: { x: 5, y: 12, z: 5 }
    });

    // Rings
    meshes.rings = [];
    const ringRadii = [3.5, 4.2, 5.0, 5.8];
    for (let i = 0; i < 4; i++) {
        const isNeon = i % 2 === 0;
        const mat = isNeon ? neonBlue : chrome;
        const ringGeo = new THREE.TorusGeometry(ringRadii[i], 0.1, 16, 100);
        const ringMesh = new THREE.Mesh(ringGeo, mat);
        
        const outerGroup = new THREE.Group();
        outerGroup.position.set(0, 7, 0);
        ringMesh.position.set(0,0,0);
        outerGroup.add(ringMesh);
        
        group.add(outerGroup);
        meshes.rings.push({ ring: ringMesh, pivot: outerGroup, index: i });

        parts.push({
            name: `Acoustic Sensor Ring ${i+1}`,
            description: `High-precision ${isNeon ? 'neon-coupled ' : ''}sensor ring.`,
            material: isNeon ? "neonBlue" : "chrome",
            function: "Measures oscillatory changes in the surrogate.",
            assemblyOrder: 5 + i,
            connections: ["Stellar Surrogate Core", "Data Processor"],
            failureEffect: "Loss of precision",
            cascadeFailures: ["Incomplete oscillation spectrum"],
            originalPosition: { x: 0, y: 7, z: 0 },
            explodedPosition: { x: Math.cos(i) * 10, y: 7 + i*2, z: Math.sin(i) * 10 }
        });
    }

    // Struts and Energy Beams
    meshes.struts = [];
    meshes.beams = [];
    for(let i=0; i<6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * 4.5;
        const z = Math.sin(angle) * 4.5;
        
        const strutGeo = new THREE.CylinderGeometry(0.3, 0.5, 6, 16);
        const strutMesh = new THREE.Mesh(strutGeo, aluminum);
        strutMesh.position.set(x, 3.5, z);
        group.add(strutMesh);
        meshes.struts.push(strutMesh);

        parts.push({
            name: `Seismic Strut ${i+1}`,
            description: "Titanium-aluminum alloy strut.",
            material: "aluminum",
            function: "Supports the containment fields and houses energy projectors.",
            assemblyOrder: 9 + i,
            connections: ["Quantum Gravimetric Base"],
            failureEffect: "Structural tilt",
            cascadeFailures: ["Alignment failure", "Beam scattering"],
            originalPosition: { x: x, y: 3.5, z: z },
            explodedPosition: { x: x*2, y: 3.5, z: z*2 }
        });
        
        // Energy beams pointing to core
        const beamGeo = new THREE.CylinderGeometry(0.05, 0.05, 4);
        const beamMesh = new THREE.Mesh(beamGeo, energyBeamMat);
        
        // Calculate rotation to point to core
        const dx = 0 - x;
        const dy = 7 - 6.5; // Top of strut is at ~6.5
        const dz = 0 - z;
        const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
        
        // Scale to actual distance
        beamMesh.scale.y = distance / 4;
        
        beamMesh.position.set(x + dx/2, 6.5 + dy/2, z + dz/2);
        beamMesh.lookAt(0, 7, 0);
        beamMesh.rotateX(Math.PI/2);
        
        group.add(beamMesh);
        meshes.beams.push(beamMesh);
    }

    const description = "The Astroseismology Stellar Oscillator is an ultra high-tech apparatus that generates and confines a surrogate stellar plasma core. By inducing and measuring acoustic (p-modes) and gravity waves (g-modes), it provides unprecedented insight into the deep interior structure of distant stars, allowing scientists to ascertain stellar age, composition, and rotation dynamics without leaving the laboratory.";

    const quizQuestions = [
        {
            question: "Which type of waves studied in astroseismology are primarily driven by pressure variations?",
            options: ["g-modes", "p-modes", "f-modes", "Radio waves"],
            correct: 1,
            explanation: "p-modes are acoustic waves driven by internal pressure fluctuations, dominant in stars like our Sun.",
            difficulty: "Medium"
        },
        {
            question: "Why are neon-coupled sensor rings used instead of standard chrome in certain arrays?",
            options: ["Aesthetics", "Higher conductivity for high-frequency modes", "To generate plasma", "To cool the system"],
            correct: 1,
            explanation: "The neon-coupled rings act as highly sensitive optical-electrical transducers, essential for detecting high-frequency oscillations.",
            difficulty: "Hard"
        },
        {
            question: "What failure cascade results from a breach in the Magnetic Boundary Layer?",
            options: ["Data processing speed increases", "Core collapse and potential vaporization", "Sensor rings begin to spin faster", "Struts convert to pure energy"],
            correct: 1,
            explanation: "The Magnetic Boundary Layer contains the surrogate core. A breach leads to thermal leakage, core destabilization, and potentially catastrophic vaporization.",
            difficulty: "Easy"
        },
        {
            question: "What is the function of the Quantum Gravimetric Base?",
            options: ["To isolate the oscillator from local space-time vibrations", "To provide artificial gravity for the crew", "To emit p-modes", "To project the energy beams"],
            correct: 0,
            explanation: "The Quantum Gravimetric Base uses quantum locking to isolate the highly sensitive instrument from any local planetary or cosmic vibrations.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, passedMeshes) {
        const m = passedMeshes || meshes;
        const currentSpeed = speed || 1.0;
        const t = time * currentSpeed;

        // Pulse the core
        if(m.core) {
            const pulse = 1 + Math.sin(t * 3) * 0.03 + Math.cos(t * 7) * 0.01;
            m.core.scale.set(pulse, pulse, pulse);
            m.core.material.emissiveIntensity = 1.5 + Math.sin(t * 5) * 0.5;
            m.core.rotation.y = t * 0.5;
        }

        // Rotate and undulate the plasma field
        if(m.plasma) {
            m.plasma.rotation.y = -t * 0.8;
            m.plasma.rotation.x = t * 0.4;
            m.plasma.rotation.z = Math.sin(t) * 0.2;
            const plasmaPulse = 1 + Math.cos(t * 2) * 0.05;
            m.plasma.scale.set(plasmaPulse, plasmaPulse, plasmaPulse);
            m.plasma.material.opacity = 0.3 + Math.sin(t*4)*0.1;
        }

        // Spin the rings in complex gimbal patterns
        if(m.rings) {
            m.rings.forEach((ringObj) => {
                const i = ringObj.index;
                ringObj.pivot.rotation.x = Math.sin(t * 0.5 + i) * Math.PI / 4;
                ringObj.pivot.rotation.z = Math.cos(t * 0.3 + i) * Math.PI / 4;
                ringObj.ring.rotation.y = t * (i % 2 === 0 ? 1 : -1) * 1.5;
            });
        }
        
        // Pulse the energy beams
        if(m.beams) {
            m.beams.forEach((beam, i) => {
                beam.material.opacity = 0.4 + Math.sin(t * 10 + i) * 0.3;
            });
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createStellarOscillator() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
