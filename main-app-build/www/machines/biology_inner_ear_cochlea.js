import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    
    // Custom Materials
    const fluidMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        transmission: 0.9,
        opacity: 0.8,
        transparent: true,
        roughness: 0.1,
        ior: 1.33,
        thickness: 0.5,
        emissive: 0x0044ff,
        emissiveIntensity: 0.2
    });
    
    const nerveMaterial = new THREE.MeshStandardMaterial({
        color: 0xffff00,
        emissive: 0xaa8800,
        emissiveIntensity: 0.8,
        roughness: 0.4
    });
    
    const membraneMaterial = new THREE.MeshStandardMaterial({
        color: 0xff44aa,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
    });
    
    const boneMaterial = new THREE.MeshStandardMaterial({
        color: 0xeeeeee,
        roughness: 0.8,
        transparent: true,
        opacity: 0.4 // See-through to visualize internal workings
    });
    
    const parts = [];
    const meshes = {};

    // Custom Path for Spiral Geometry
    class SpiralCurve extends THREE.Curve {
        constructor(scale = 1) {
            super();
            this.scale = scale;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const turns = 2.75; // Human cochlea has ~2.75 turns
            const angle = t * Math.PI * 2 * turns;
            const radius = (1 - t * 0.8) * 4; // Decreasing radius towards apex
            const height = t * 3;
            
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = height;
            
            return optionalTarget.set(x, y, z).multiplyScalar(this.scale);
        }
    }
    const path = new SpiralCurve(1);

    // 1. Cochlea Bony Shell (Spiral Labyrinth)
    const tubeGeometry = new THREE.TubeGeometry(path, 200, 1, 16, false);
    const spiralTube = new THREE.Mesh(tubeGeometry, boneMaterial);
    group.add(spiralTube);
    meshes.bonyShell = spiralTube;
    
    parts.push({
        name: "Bony Labyrinth (Cochlea Shell)",
        description: "The snail-shaped, fluid-filled outer shell of the inner ear.",
        material: "Bone / Translucent",
        function: "Contains the membranous labyrinth and hearing fluids (perilymph and endolymph), protecting the delicate sensory structures.",
        assemblyOrder: 1,
        connections: ["Oval Window", "Basilar Membrane", "Auditory Nerve"],
        failureEffect: "Structural damage can leak fluid, causing immediate hearing loss and balance issues.",
        cascadeFailures: ["Loss of fluid pressure", "Hair cell death"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });

    // 2. Basilar Membrane (Inside the tube)
    const ribbonGeometry = new THREE.TubeGeometry(path, 200, 0.4, 4, false); // Flattened via scaling
    const ribbonMesh = new THREE.Mesh(ribbonGeometry, membraneMaterial);
    ribbonMesh.scale.set(1, 0.05, 1); // Make it a flat ribbon
    group.add(ribbonMesh);
    meshes.basilarMembrane = ribbonMesh;
    
    parts.push({
        name: "Basilar Membrane",
        description: "A flexible membrane running the length of the cochlea, varying in stiffness.",
        material: "Tissue Membrane",
        function: "Vibrates in response to sound waves traveling through the cochlear fluid. High frequencies vibrate the stiff base; low frequencies vibrate the floppy apex.",
        assemblyOrder: 2,
        connections: ["Bony Labyrinth", "Hair Cells"],
        failureEffect: "Stiffening or tearing prevents mechanical frequency separation, causing sensorineural hearing loss.",
        cascadeFailures: ["Lack of hair cell stimulation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 2, z: 0 }
    });

    // 3. Organ of Corti (Hair Cells)
    const hairCellsGroup = new THREE.Group();
    const hairCount = 150;
    const hairCellMeshes = [];
    
    const hairGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.4, 8);
    const cellBaseMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffaa,
        emissive: 0x00ffaa,
        emissiveIntensity: 0.0
    });
    
    for (let i = 0; i < hairCount; i++) {
        const t = i / hairCount;
        const pt = path.getPoint(t);
        const tangent = path.getTangent(t);
        
        const cell = new THREE.Mesh(hairGeo, cellBaseMaterial.clone());
        
        // Position on the basilar membrane
        cell.position.copy(pt);
        cell.position.y += 0.2;
        
        // Align roughly
        const up = new THREE.Vector3(0, 1, 0);
        const axis = new THREE.Vector3().crossVectors(up, tangent).normalize();
        const radians = Math.acos(up.dot(tangent));
        cell.quaternion.setFromAxisAngle(axis, radians);
        
        hairCellsGroup.add(cell);
        hairCellMeshes.push({ mesh: cell, t: t });
    }
    
    group.add(hairCellsGroup);
    meshes.hairCells = hairCellMeshes;
    
    parts.push({
        name: "Hair Cells (Organ of Corti)",
        description: "Sensory receptors of the auditory system with stereocilia.",
        material: "Glowing Neon Neural Tissue",
        function: "Transduce mechanical vibrations of the basilar membrane into electrical nerve impulses. Bending stereocilia opens ion channels.",
        assemblyOrder: 3,
        connections: ["Basilar Membrane", "Tectorial Membrane", "Auditory Nerve"],
        failureEffect: "Damage from loud noise leads to permanent hearing loss in specific frequency ranges.",
        cascadeFailures: ["No signal sent to brain"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 }
    });

    // 4. Auditory Nerve Bundle
    const nervePath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, -2, 0),
        new THREE.Vector3(1, -4, 0),
        new THREE.Vector3(3, -5, -2),
        new THREE.Vector3(5, -6, -4)
    ]);
    const nerveBundleGeo = new THREE.TubeGeometry(nervePath, 40, 0.6, 12, false);
    const nerveBundleMesh = new THREE.Mesh(nerveBundleGeo, nerveMaterial);
    group.add(nerveBundleMesh);
    meshes.auditoryNerve = nerveBundleMesh;

    parts.push({
        name: "Auditory Nerve (Cranial Nerve VIII)",
        description: "Bundle of nerve fibers connecting the cochlea to the brainstem.",
        material: "High-Tech Neural Conduit",
        function: "Transmits the electrical action potentials generated by hair cells directly to the brain for processing as sound.",
        assemblyOrder: 4,
        connections: ["Hair Cells", "Brainstem"],
        failureEffect: "Nerve damage (e.g., acoustic neuroma) blocks signal transmission, causing profound deafness.",
        cascadeFailures: ["Loss of auditory processing"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 2, y: -4, z: 0 }
    });

    // 5. Oval Window & Stapes (Input Mechanism)
    const stapesGeo = new THREE.CylinderGeometry(0.4, 0.15, 1.2, 16);
    const stapesMesh = new THREE.Mesh(stapesGeo, chrome);
    stapesMesh.position.set(4, 0, 0);
    stapesMesh.rotation.z = Math.PI / 2;
    group.add(stapesMesh);
    meshes.stapes = stapesMesh;
    
    const windowGeo = new THREE.CircleGeometry(0.6, 32);
    const windowMesh = new THREE.Mesh(windowGeo, rubber);
    windowMesh.position.set(3.4, 0, 0);
    windowMesh.rotation.y = Math.PI / 2;
    group.add(windowMesh);
    meshes.ovalWindow = windowMesh;

    parts.push({
        name: "Oval Window & Stapes",
        description: "The mechanical input interface between the middle ear (stapes bone) and inner ear.",
        material: "Chrome / Rubber Membrane",
        function: "Pistons against the cochlear fluid, creating the traveling fluid pressure waves that stimulate the basilar membrane.",
        assemblyOrder: 5,
        connections: ["Middle Ear Ossicles", "Cochlear Fluid"],
        failureEffect: "Otosclerosis (bone fixing) prevents vibration transfer, causing conductive hearing loss.",
        cascadeFailures: ["No fluid waves generated"],
        originalPosition: { x: 4, y: 0, z: 0 },
        explodedPosition: { x: 6, y: 0, z: 0 }
    });

    // Fluid particles representing acoustic wave propagation
    const fluidParticlesGeo = new THREE.BufferGeometry();
    const particleCount = 400;
    const posArray = new Float32Array(particleCount * 3);
    const particleT = new Float32Array(particleCount);
    for(let i = 0; i < particleCount; i++) {
        particleT[i] = Math.random();
        const pt = path.getPoint(particleT[i]);
        posArray[i*3] = pt.x + (Math.random()-0.5) * 0.8;
        posArray[i*3+1] = pt.y + (Math.random()-0.5) * 0.8;
        posArray[i*3+2] = pt.z + (Math.random()-0.5) * 0.8;
    }
    fluidParticlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    fluidParticlesGeo.setAttribute('tVal', new THREE.BufferAttribute(particleT, 1));

    const particleMat = new THREE.PointsMaterial({
        color: 0x00ffff,
        size: 0.15,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
    });
    const fluidParticles = new THREE.Points(fluidParticlesGeo, particleMat);
    group.add(fluidParticles);
    meshes.fluidParticles = fluidParticles;


    const description = "The Cochlea is a highly complex, fluid-filled biological structure that acts as an acoustic transducer. Mechanical vibrations from the middle ear strike the oval window, creating pressure waves in the perilymph. These waves travel up the spiral, causing a traveling wave along the basilar membrane. Because the membrane changes stiffness from base to apex, different frequencies peak at different locations (tonotopic organization). At these peaks, stereocilia on hair cells bend, opening ion channels and firing electrical action potentials down the auditory nerve to the brain.";

    const quizQuestions = [
        {
            question: "Which physical property of the basilar membrane allows it to distinguish between high and low-frequency sounds?",
            options: [
                "It contains different types of electrolytic fluids.",
                "Its varying stiffness and width from the base to the apex.",
                "It uses variable neural firing speeds directly.",
                "It changes thickness actively in response to volume."
            ],
            correct: 1,
            explanation: "The basilar membrane acts as a mechanical frequency analyzer. It is narrow and stiff at the base (responding to high frequencies) and wider and floppier at the apex (responding to low frequencies).",
            difficulty: "Medium"
        },
        {
            question: "What physical action directly triggers the sensory hair cells to depolarize and fire?",
            options: [
                "Sound waves hitting the tympanic membrane.",
                "High-pressure fluid bursting against the round window.",
                "The mechanical bending of stereocilia shearing against the tectorial membrane.",
                "Increased blood flow from the stria vascularis."
            ],
            correct: 2,
            explanation: "As the basilar membrane vibrates, the hair cells shear against the tectorial membrane. This physically bends their stereocilia, popping open K+ ion channels to trigger an electrical depolarization.",
            difficulty: "Hard"
        },
        {
            question: "Damage specifically to the inner ear's hair cells (e.g., from prolonged 120dB noise) results in what condition?",
            options: [
                "Conductive hearing loss",
                "Sensorineural hearing loss",
                "Central auditory processing disorder",
                "Otosclerosis"
            ],
            correct: 1,
            explanation: "Damage to the inner ear's sensory hair cells or the auditory nerve leads to sensorineural hearing loss. Unlike birds and reptiles, mammalian hair cells generally do not regenerate, making this permanent.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, activeMeshes) {
        if (!activeMeshes) return;
        
        // 1. Stapes pumping in and out (Mechanical Input)
        const waveFreq = time * speed * 3;
        if(activeMeshes.stapes) {
            activeMeshes.stapes.position.x = 4 + Math.sin(waveFreq) * 0.15;
            activeMeshes.ovalWindow.position.x = 3.4 + Math.sin(waveFreq) * 0.05;
        }
        
        // 2. Fluid waves propagating (Acoustic Pressure)
        if(activeMeshes.fluidParticles) {
            const positions = activeMeshes.fluidParticles.geometry.attributes.position.array;
            const tVals = activeMeshes.fluidParticles.geometry.attributes.tVal.array;
            
            for(let i = 0; i < tVals.length; i++) {
                // Move particle along the curve
                tVals[i] += 0.005 * speed;
                if(tVals[i] > 1) tVals[i] -= 1;
                
                const pt = path.getPoint(tVals[i]);
                
                // Add oscillating displacement to visualize pressure waves
                const wavePhase = (tVals[i] * 15) - waveFreq;
                const amplitude = Math.sin(wavePhase) * 0.25;
                
                // Use a seeded offset for each particle to maintain volume
                const seedX = (i % 3) - 1;
                const seedY = (i % 5) - 2;
                const seedZ = (i % 7) - 3;
                
                positions[i*3] = pt.x + amplitude + (seedX * 0.2);
                positions[i*3+1] = pt.y + (seedY * 0.15);
                positions[i*3+2] = pt.z + amplitude + (seedZ * 0.2);
            }
            activeMeshes.fluidParticles.geometry.attributes.position.needsUpdate = true;
        }

        // 3. Basilar Membrane vibration
        if(activeMeshes.basilarMembrane) {
            // Visualize the traveling envelope wave
            const scaleY = 0.05 + Math.abs(Math.sin(waveFreq * 1.5)) * 0.08;
            activeMeshes.basilarMembrane.scale.set(1, scaleY, 1);
        }

        // 4. Hair cells firing (Mechano-electrical Transduction)
        let maxActivation = 0;
        if(activeMeshes.hairCells) {
            activeMeshes.hairCells.forEach(cellObj => {
                // Wave travels from base (t=0) to apex (t=1)
                const wavePos = (time * speed * 0.3) % 1;
                const dist = Math.abs(cellObj.t - wavePos);
                
                // Wrap distance for cyclic effect
                const wrappedDist = Math.min(dist, 1 - dist);
                
                // Activation envelope
                if (wrappedDist < 0.08) {
                    const intensity = (1 - (wrappedDist / 0.08)) * 3.0; // Glowing brightness
                    cellObj.mesh.material.emissiveIntensity = intensity;
                    
                    // Physical bending of stereocilia
                    cellObj.mesh.rotation.z = Math.sin(time * speed * 20) * 0.3 * (intensity / 3.0);
                    
                    if(intensity > maxActivation) maxActivation = intensity;
                } else {
                    cellObj.mesh.material.emissiveIntensity = 0;
                    cellObj.mesh.rotation.z = 0;
                }
            });
        }
        
        // 5. Auditory Nerve transmission
        if(activeMeshes.auditoryNerve) {
            // Pulse the nerve based on the strongest hair cell signal
            const baselinePulse = 0.5 + Math.sin(time * speed * 10) * 0.2;
            activeMeshes.auditoryNerve.material.emissiveIntensity = baselinePulse + (maxActivation * 0.5);
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createInnerEarCochlea() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
