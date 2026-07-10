import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials for Quantum Effects
    const quantumThreadMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8,
        wireframe: false,
        roughness: 0.1,
        metalness: 0.8
    });

    const quantumFoilMat = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0x880088,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        roughness: 0.0,
        metalness: 1.0,
        side: THREE.DoubleSide
    });

    const plasmaCoreMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x00aaff,
        emissiveIntensity: 5.0,
        wireframe: true
    });

    const spookyActionMat = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });

    const superConductorMat = new THREE.MeshStandardMaterial({
        color: 0x050505,
        emissive: 0x000000,
        roughness: 0.4,
        metalness: 0.9
    });

    // Helper to add parts to registry
    function registerPart(name, mesh, description, materialName, func, assemblyOrder, connections, failureEffect, originalPos) {
        mesh.userData.partName = name;
        mesh.userData.originalPosition = new THREE.Vector3(originalPos.x, originalPos.y, originalPos.z);
        
        // Compute an exploded position based on vector away from center
        const explodeDir = new THREE.Vector3(originalPos.x, originalPos.y, originalPos.z).normalize();
        if(explodeDir.length() === 0) explodeDir.set(0, 1, 0);
        const explodedPos = new THREE.Vector3().copy(mesh.userData.originalPosition).add(explodeDir.multiplyScalar(25));

        parts.push({
            name,
            description,
            material: materialName,
            function: func,
            assemblyOrder,
            connections,
            failureEffect,
            cascadeFailures: [connections[0] || 'System Core'],
            originalPosition: { x: originalPos.x, y: originalPos.y, z: originalPos.z },
            explodedPosition: { x: explodedPos.x, y: explodedPos.y, z: explodedPos.z },
            mesh: mesh
        });
        
        mesh.position.set(originalPos.x, originalPos.y, originalPos.z);
        group.add(mesh);
    }

    // 1. Central Quantum Core (The Heart of the Entanglement)
    const createCentralCore = () => {
        const coreGroup = new THREE.Group();
        const coreGeo = new THREE.IcosahedronGeometry(3, 2);
        const coreMesh = new THREE.Mesh(coreGeo, plasmaCoreMat);
        coreGroup.add(coreMesh);

        // Inner lattice
        const latticeGeo = new THREE.IcosahedronGeometry(2.8, 1);
        const latticeMesh = new THREE.Mesh(latticeGeo, chrome);
        coreGroup.add(latticeMesh);

        return coreGroup;
    };
    const centralCore = createCentralCore();
    registerPart('Quantum Entanglement Core', centralCore, 
        'The primary reaction chamber where particles are fused into a singular wave function.',
        'Plasma/Chrome', 'Forces incoming particles into a superposition state.', 
        1, ['Accelerator Rings', 'Weaving Arms'], 'Total wave function collapse; reality localized instability.', 
        {x: 0, y: 15, z: 0}
    );

    // 2. Accelerator Rings (Twin particle streams)
    const createAcceleratorRing = (radius, tube, segments, colorHex) => {
        const ringGroup = new THREE.Group();
        const ringGeo = new THREE.TorusGeometry(radius, tube, 32, segments);
        const ringMesh = new THREE.Mesh(ringGeo, superConductorMat);
        ringGroup.add(ringMesh);

        // Add magnetic constrictors
        for (let i = 0; i < segments; i += 4) {
            const angle = (i / segments) * Math.PI * 2;
            const constGeo = new THREE.CylinderGeometry(tube * 1.5, tube * 1.5, tube * 0.5, 16);
            const constMesh = new THREE.Mesh(constGeo, copper);
            constMesh.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
            
            // Align cylinder with the tangent of the torus
            constMesh.rotation.x = Math.PI / 2;
            constMesh.rotation.z = angle;
            
            ringGroup.add(constMesh);
        }
        
        // Inner plasma stream
        const plasmaGeo = new THREE.TorusGeometry(radius, tube * 0.4, 16, segments);
        const streamMat = new THREE.MeshStandardMaterial({
            color: colorHex, emissive: colorHex, emissiveIntensity: 2.0, wireframe: true
        });
        const plasmaMesh = new THREE.Mesh(plasmaGeo, streamMat);
        plasmaMesh.userData.isStream = true;
        ringGroup.add(plasmaMesh);

        return ringGroup;
    };

    const accelRingAlpha = createAcceleratorRing(12, 0.8, 120, 0x00ffff);
    accelRingAlpha.rotation.x = Math.PI / 2;
    registerPart('Particle Accelerator Ring Alpha', accelRingAlpha,
        'Accelerates fermion stream A to near-light speed.',
        'Superconductor/Copper', 'Generates the first half of the entangled pair stream.',
        2, ['Quantum Entanglement Core', 'Cooling System'], 'Loss of particle containment; catastrophic antimatter annihilation.',
        {x: 0, y: 5, z: 0}
    );

    const accelRingBeta = createAcceleratorRing(12, 0.8, 120, 0xff00ff);
    accelRingBeta.rotation.x = Math.PI / 2;
    accelRingBeta.rotation.y = Math.PI / 2;
    registerPart('Particle Accelerator Ring Beta', accelRingBeta,
        'Accelerates fermion stream B to near-light speed in a perpendicular manifold.',
        'Superconductor/Copper', 'Generates the second half of the entangled pair stream.',
        3, ['Quantum Entanglement Core', 'Cooling System'], 'Phase misalignment; destruction of local causality.',
        {x: 0, y: 25, z: 0}
    );

    // 3. Spooky Action Synchronizer
    const createSynchronizer = () => {
        const syncGroup = new THREE.Group();
        const numRings = 5;
        for(let i=0; i<numRings; i++) {
            const ringGeo = new THREE.TorusGeometry(5 + i*1.2, 0.1, 8, 64);
            const ringMesh = new THREE.Mesh(ringGeo, spookyActionMat);
            ringMesh.userData.syncRingIndex = i;
            syncGroup.add(ringMesh);
        }
        return syncGroup;
    };
    const synchronizer = createSynchronizer();
    registerPart('Spooky Action Synchronizer Manifold', synchronizer,
        'Maintains non-local correlation between separated entangled meshes.',
        'Metamaterial', 'Utilizes non-Euclidean geometry to bypass the speed of light.',
        4, ['Quantum Entanglement Core'], 'Decoherence; entangled armor reverts to mundane dust.',
        {x: 0, y: 15, z: 0}
    );

    // 4. Weaving Arms (Multi-jointed robotic arms that weave the threads)
    const createWeavingArm = (scale = 1) => {
        const armGroup = new THREE.Group();
        
        // Base mount
        const mountGeo = new THREE.CylinderGeometry(1*scale, 1.5*scale, 2*scale, 32);
        const mountMesh = new THREE.Mesh(mountGeo, darkSteel);
        armGroup.add(mountMesh);

        // Lower arm
        const lowerArmGeo = new THREE.BoxGeometry(0.8*scale, 6*scale, 0.8*scale);
        const lowerArmMesh = new THREE.Mesh(lowerArmGeo, steel);
        lowerArmMesh.position.set(0, 4*scale, 0);
        armGroup.add(lowerArmMesh);

        // Elbow joint
        const elbowGeo = new THREE.SphereGeometry(1*scale, 32, 32);
        const elbowMesh = new THREE.Mesh(elbowGeo, chrome);
        elbowMesh.position.set(0, 7.5*scale, 0);
        armGroup.add(elbowMesh);

        // Upper arm
        const upperArmGeo = new THREE.BoxGeometry(0.6*scale, 5*scale, 0.6*scale);
        const upperArmMesh = new THREE.Mesh(upperArmGeo, aluminum);
        upperArmMesh.position.set(0, 10.5*scale, 0);
        armGroup.add(upperArmMesh);

        // Wrist & Weaver Head
        const wristGeo = new THREE.CylinderGeometry(0.5*scale, 0.5*scale, 1*scale, 16);
        const wristMesh = new THREE.Mesh(wristGeo, copper);
        wristMesh.position.set(0, 13.5*scale, 0);
        wristMesh.rotation.z = Math.PI / 2;
        armGroup.add(wristMesh);

        // Weaving Needles
        const needleGeo = new THREE.ConeGeometry(0.1*scale, 3*scale, 8);
        const needle1 = new THREE.Mesh(needleGeo, chrome);
        needle1.position.set(0.5*scale, 15*scale, 0);
        const needle2 = new THREE.Mesh(needleGeo, chrome);
        needle2.position.set(-0.5*scale, 15*scale, 0);
        armGroup.add(needle1);
        armGroup.add(needle2);

        // Add some hydraulic pistons to the lower arm
        const pistonOutGeo = new THREE.CylinderGeometry(0.2*scale, 0.2*scale, 4*scale, 16);
        const pistonInGeo = new THREE.CylinderGeometry(0.1*scale, 0.1*scale, 4*scale, 16);
        
        const hydr1Out = new THREE.Mesh(pistonOutGeo, darkSteel);
        hydr1Out.position.set(0.6*scale, 4*scale, 0.6*scale);
        armGroup.add(hydr1Out);
        
        const hydr1In = new THREE.Mesh(pistonInGeo, chrome);
        hydr1In.position.set(0.6*scale, 6*scale, 0.6*scale);
        armGroup.add(hydr1In);

        return armGroup;
    };

    const weavingArmA = createWeavingArm(0.8);
    weavingArmA.rotation.x = Math.PI / 4;
    registerPart('Quantum Weaver Arm Alpha', weavingArmA,
        'High-speed precision robotic arm that physically braids probability waves.',
        'Steel/Chrome/Aluminum', 'Manipulates spatial geometry to knot particle strings.',
        5, ['Central Quantum Core', 'Thread Spool Array'], 'Arm collision; localized micro-black hole creation.',
        {x: 10, y: 5, z: 0}
    );

    const weavingArmB = createWeavingArm(0.8);
    weavingArmB.rotation.x = -Math.PI / 4;
    weavingArmB.rotation.y = Math.PI;
    registerPart('Quantum Weaver Arm Beta', weavingArmB,
        'Counter-rotating weaver arm that locks the entangled states.',
        'Steel/Chrome/Aluminum', 'Secures the non-local bonds of the fabric.',
        6, ['Central Quantum Core', 'Thread Spool Array'], 'Arm collision; localized micro-black hole creation.',
        {x: -10, y: 5, z: 0}
    );

    const weavingArmC = createWeavingArm(0.8);
    weavingArmC.rotation.z = Math.PI / 4;
    weavingArmC.rotation.y = Math.PI / 2;
    registerPart('Quantum Weaver Arm Gamma', weavingArmC,
        'Third-axis weaver for 3D topological entanglement.',
        'Steel/Chrome/Aluminum', 'Adds a third dimension of quantum locks to the armor.',
        7, ['Central Quantum Core', 'Thread Spool Array'], 'Topological unraveling; armor falls apart instantly.',
        {x: 0, y: 5, z: 10}
    );

    const weavingArmD = createWeavingArm(0.8);
    weavingArmD.rotation.z = -Math.PI / 4;
    weavingArmD.rotation.y = -Math.PI / 2;
    registerPart('Quantum Weaver Arm Delta', weavingArmD,
        'Fourth-axis weaver for temporal binding.',
        'Steel/Chrome/Aluminum', 'Ensures the armor state remains consistent across time.',
        8, ['Central Quantum Core', 'Thread Spool Array'], 'Chronological paradox; armor exists in the past but not present.',
        {x: 0, y: 5, z: -10}
    );

    // 5. Thread Spool Array
    const createSpoolArray = () => {
        const arrayGroup = new THREE.Group();
        const numSpools = 16;
        const radius = 18;

        for(let i=0; i<numSpools; i++) {
            const angle = (i / numSpools) * Math.PI * 2;
            const spoolGroup = new THREE.Group();
            
            // Spool core
            const coreGeo = new THREE.CylinderGeometry(0.5, 0.5, 4, 16);
            const coreMesh = new THREE.Mesh(coreGeo, darkSteel);
            spoolGroup.add(coreMesh);

            // Spool caps
            const capGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.2, 32);
            const capTop = new THREE.Mesh(capGeo, chrome);
            capTop.position.set(0, 2, 0);
            spoolGroup.add(capTop);
            
            const capBottom = new THREE.Mesh(capGeo, chrome);
            capBottom.position.set(0, -2, 0);
            spoolGroup.add(capBottom);

            // Thread wound on spool
            const threadGeo = new THREE.CylinderGeometry(1.2, 1.2, 3.6, 32);
            const threadMesh = new THREE.Mesh(threadGeo, i % 2 === 0 ? quantumThreadMat : spookyActionMat);
            spoolGroup.add(threadMesh);

            spoolGroup.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
            
            // Orient spools to face center
            spoolGroup.lookAt(0, 0, 0);
            spoolGroup.rotation.x = Math.PI / 2; // Lay flat pointing to center

            arrayGroup.add(spoolGroup);
        }

        return arrayGroup;
    };
    const spoolArray = createSpoolArray();
    registerPart('Quantum Thread Spool Array', spoolArray,
        'Banks of raw, uncollapsed probability threads waiting to be woven.',
        'Chrome/DarkSteel/QuantumThread', 'Supplies raw material to the weaver arms.',
        9, ['Weaving Arms', 'Base Structure'], 'Thread snap; extreme energy release.',
        {x: 0, y: 15, z: 0}
    );

    // 6. Base Structure & Containment Unit
    const createContainmentBase = () => {
        const baseGroup = new THREE.Group();
        
        // Main hexagonal platform
        const shape = new THREE.Shape();
        const hexRadius = 25;
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            if (i === 0) shape.moveTo(Math.cos(angle) * hexRadius, Math.sin(angle) * hexRadius);
            else shape.lineTo(Math.cos(angle) * hexRadius, Math.sin(angle) * hexRadius);
        }
        shape.closePath();

        const extrudeSettings = { depth: 4, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.5, bevelThickness: 0.5 };
        const baseGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
        baseMesh.rotation.x = Math.PI / 2;
        baseMesh.position.y = -2;
        baseGroup.add(baseMesh);

        // Support Pillars
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const pX = Math.cos(angle) * 22;
            const pZ = Math.sin(angle) * 22;

            const pillarGeo = new THREE.CylinderGeometry(1.5, 2, 20, 6);
            const pillarMesh = new THREE.Mesh(pillarGeo, steel);
            pillarMesh.position.set(pX, 10, pZ);
            baseGroup.add(pillarMesh);

            // Pillar cooling fins
            for (let j = 0; j < 5; j++) {
                const finGeo = new THREE.TorusGeometry(2.5, 0.2, 8, 16);
                const finMesh = new THREE.Mesh(finGeo, copper);
                finMesh.position.set(pX, 5 + j*2.5, pZ);
                finMesh.rotation.x = Math.PI / 2;
                baseGroup.add(finMesh);
            }
        }

        return baseGroup;
    };
    const containmentBase = createContainmentBase();
    registerPart('Containment Base Structure', containmentBase,
        'Massive reinforced platform stabilizing the intense gravitational waves produced by entanglement.',
        'DarkSteel/Steel/Copper', 'Provides structural integrity and heat dissipation.',
        10, ['Ground', 'Support Pillars'], 'Structural collapse; loom implodes into itself.',
        {x: 0, y: 0, z: 0}
    );

    // 7. Entangled Mesh Extractor (Lathe geometry representing the output armor)
    const createExtractor = () => {
        const extractorGroup = new THREE.Group();

        // The armor mesh forming (Lathe)
        const points = [];
        for (let i = 0; i <= 20; i++) {
            points.push(new THREE.Vector2(Math.sin(i * 0.2) * 4 + 2, (i - 10) * 1.5));
        }
        const latheGeo = new THREE.LatheGeometry(points, 64);
        const meshOutput = new THREE.Mesh(latheGeo, quantumFoilMat);
        meshOutput.position.y = 15;
        extractorGroup.add(meshOutput);

        // Extractor rings
        const ringGeo = new THREE.TorusGeometry(8, 0.5, 16, 64);
        const ring1 = new THREE.Mesh(ringGeo, chrome);
        ring1.position.y = 5;
        ring1.rotation.x = Math.PI / 2;
        extractorGroup.add(ring1);

        const ring2 = new THREE.Mesh(ringGeo, chrome);
        ring2.position.y = 25;
        ring2.rotation.x = Math.PI / 2;
        extractorGroup.add(ring2);

        // Vertical rails
        for(let i=0; i<4; i++) {
            const angle = (i/4)*Math.PI*2;
            const railGeo = new THREE.CylinderGeometry(0.3, 0.3, 20, 16);
            const railMesh = new THREE.Mesh(railGeo, steel);
            railMesh.position.set(Math.cos(angle)*8, 15, Math.sin(angle)*8);
            extractorGroup.add(railMesh);
        }

        return extractorGroup;
    };
    const meshExtractor = createExtractor();
    registerPart('Entangled Armor Extractor Tube', meshExtractor,
        'Pulls the completed quantum-entangled mesh out of the reaction core without disturbing the wave function.',
        'Chrome/QuantumFoil/Steel', 'Safely harvests the produced god-tier armor.',
        11, ['Central Quantum Core', 'Base Structure'], 'Armor decoheres upon extraction; wasted output.',
        {x: 0, y: 35, z: 0}
    );

    // 8. Superconducting Coolant Lines
    const createCoolantLines = () => {
        const lineGroup = new THREE.Group();
        
        class CustomCurve extends THREE.Curve {
            constructor(scale, offsetPhase) {
                super();
                this.scale = scale;
                this.offsetPhase = offsetPhase;
            }
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const tx = Math.cos(t * Math.PI * 4 + this.offsetPhase) * 12;
                const ty = t * 30;
                const tz = Math.sin(t * Math.PI * 4 + this.offsetPhase) * 12;
                return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
            }
        }

        for(let i=0; i<8; i++) {
            const path = new CustomCurve(1, (i/8)*Math.PI*2);
            const tubeGeo = new THREE.TubeGeometry(path, 100, 0.4, 16, false);
            const tubeMesh = new THREE.Mesh(tubeGeo, glass);
            
            // Inner liquid coolant
            const liquidGeo = new THREE.TubeGeometry(path, 100, 0.25, 8, false);
            const liquidMat = new THREE.MeshStandardMaterial({color: 0x00ffff, emissive: 0x0055ff, transparent: true, opacity: 0.8});
            const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
            liquidMesh.userData.isCoolant = true;
            liquidMesh.userData.phaseOffset = (i/8)*Math.PI*2;

            lineGroup.add(tubeMesh);
            lineGroup.add(liquidMesh);
        }

        return lineGroup;
    };
    const coolantLines = createCoolantLines();
    registerPart('Helium-3 Superfluid Coolant Lines', coolantLines,
        'Circulates absolute-zero superfluid to prevent the weavers from melting under quantum friction.',
        'Glass/LiquidHelium', 'Maintains operating temperatures.',
        12, ['Accelerator Rings', 'Base Structure'], 'Thermal runaway; loom vaporizes.',
        {x: 0, y: 0, z: 0}
    );

    // 9. Control Core Interface & Diagnostics
    const createControlPanels = () => {
        const controlGroup = new THREE.Group();
        const radius = 28;

        for(let i=0; i<3; i++) {
            const angle = (i/3) * Math.PI * 2 + Math.PI/6;
            const panelGroup = new THREE.Group();
            
            // Stand
            const standGeo = new THREE.CylinderGeometry(0.5, 1.5, 6, 16);
            const standMesh = new THREE.Mesh(standGeo, darkSteel);
            standMesh.position.y = 3;
            panelGroup.add(standMesh);

            // Screen
            const screenGeo = new THREE.BoxGeometry(6, 4, 0.2);
            const screenMat = new THREE.MeshStandardMaterial({color: 0x000000, emissive: 0x002200, roughness: 0.1});
            const screenMesh = new THREE.Mesh(screenGeo, screenMat);
            screenMesh.position.set(0, 6, 1);
            screenMesh.rotation.x = -Math.PI / 8;
            panelGroup.add(screenMesh);

            // Holographic Projection above screen
            const holoGeo = new THREE.PlaneGeometry(5, 3);
            const holoMat = new THREE.MeshStandardMaterial({
                color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 1.0, 
                transparent: true, opacity: 0.6, side: THREE.DoubleSide, wireframe: true
            });
            const holoMesh = new THREE.Mesh(holoGeo, holoMat);
            holoMesh.position.set(0, 9, 1);
            holoMesh.userData.isHolo = true;
            panelGroup.add(holoMesh);
            
            // Keyboard / controls
            const keysGeo = new THREE.BoxGeometry(6, 0.2, 2);
            const keysMesh = new THREE.Mesh(keysGeo, aluminum);
            keysMesh.position.set(0, 5, 2.5);
            keysMesh.rotation.x = Math.PI / 8;
            panelGroup.add(keysMesh);

            panelGroup.position.set(Math.cos(angle)*radius, 0, Math.sin(angle)*radius);
            panelGroup.lookAt(0, 0, 0);

            controlGroup.add(panelGroup);
        }

        return controlGroup;
    };
    const controlPanels = createControlPanels();
    registerPart('Quantum Diagnostics Interfaces', controlPanels,
        'Terminal nodes for monitoring the entanglement integrity and wave function collapse probabilities.',
        'DarkSteel/Aluminum/Glass', 'Provides operator feedback.',
        13, ['Base Structure'], 'Operator blindness; blind weaving leads to corrupted armor.',
        {x: 0, y: 0, z: 0}
    );

    // 10. Gravimetric Stabilizer Rings
    const createGravRings = () => {
        const ringGroup = new THREE.Group();
        const rGeo = new THREE.TorusGeometry(26, 1.5, 32, 128);
        
        const ringOuter = new THREE.Mesh(rGeo, darkSteel);
        ringOuter.position.y = 2;
        ringOuter.rotation.x = Math.PI / 2;
        ringGroup.add(ringOuter);

        const rGeoInner = new THREE.TorusGeometry(26, 0.5, 16, 128);
        const ringInner = new THREE.Mesh(rGeoInner, emissiveBlueMat());
        ringInner.position.y = 2;
        ringInner.rotation.x = Math.PI / 2;
        ringInner.userData.isGravRing = true;
        ringGroup.add(ringInner);

        return ringGroup;
    };
    function emissiveBlueMat() {
        return new THREE.MeshStandardMaterial({color: 0x0000ff, emissive: 0x0055ff, emissiveIntensity: 2.0});
    }
    const gravRings = createGravRings();
    registerPart('Gravimetric Stabilizer Outer Ring', gravRings,
        'Contains the extreme mass fluctuations during entanglement.',
        'DarkSteel/Energy', 'Maintains local gravity constant at 1G.',
        14, ['Base Structure'], 'Gravity inversion; machine rips itself off the planet.',
        {x: 0, y: 0, z: 0}
    );

    // 11. Energy Supply Cables
    const createEnergyCables = () => {
        const cables = new THREE.Group();
        for(let i=0; i<4; i++) {
            const path = new THREE.CatmullRomCurve3([
                new THREE.Vector3(Math.cos(i*Math.PI/2)*30, 0, Math.sin(i*Math.PI/2)*30),
                new THREE.Vector3(Math.cos(i*Math.PI/2)*20, 2, Math.sin(i*Math.PI/2)*20),
                new THREE.Vector3(Math.cos(i*Math.PI/2)*10, -1, Math.sin(i*Math.PI/2)*10),
                new THREE.Vector3(0, -2, 0)
            ]);
            const cableGeo = new THREE.TubeGeometry(path, 64, 0.8, 16, false);
            const cableMesh = new THREE.Mesh(cableGeo, rubber);
            cables.add(cableMesh);
        }
        return cables;
    };
    const energyCables = createEnergyCables();
    registerPart('Zero-Point Energy Supply Cables', energyCables,
        'Channels unlimited zero-point energy from the vacuum into the core.',
        'Rubber/Superconductor', 'Powers the loom.',
        15, ['Containment Base Structure'], 'Power failure; instantaneous wave function collapse.',
        {x: 0, y: 0, z: 0}
    );

    // 12. Laser Calibration Array
    const createLaserArray = () => {
        const laserGroup = new THREE.Group();
        for(let i=0; i<8; i++) {
            const angle = (i/8)*Math.PI*2;
            const emitterGeo = new THREE.BoxGeometry(1, 2, 1);
            const emitterMesh = new THREE.Mesh(emitterGeo, steel);
            emitterMesh.position.set(Math.cos(angle)*15, 30, Math.sin(angle)*15);
            emitterMesh.lookAt(0, 15, 0); // Point at core
            laserGroup.add(emitterMesh);

            const beamGeo = new THREE.CylinderGeometry(0.05, 0.05, 25, 8);
            const beamMat = new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending});
            const beamMesh = new THREE.Mesh(beamGeo, beamMat);
            beamMesh.position.set(Math.cos(angle)*7.5, 22.5, Math.sin(angle)*7.5);
            beamMesh.lookAt(0, 15, 0);
            beamMesh.rotation.x -= Math.PI/2;
            laserGroup.add(beamMesh);
        }
        return laserGroup;
    };
    const laserArray = createLaserArray();
    registerPart('Interferometry Laser Array', laserArray,
        'Precisely measures the spatial coordinates of weaving operations at sub-Planck lengths.',
        'Steel/Laser', 'Calibrates weaver arm positioning.',
        16, ['Base Structure', 'Central Quantum Core'], 'Misalignment; threads woven into incorrect dimensions.',
        {x: 0, y: 0, z: 0}
    );

    // 13. Entanglement Resonance Chamber (Outer shell around core)
    const createResonanceChamber = () => {
        const chamber = new THREE.Group();
        const geo = new THREE.IcosahedronGeometry(8, 3);
        const mat = new THREE.MeshStandardMaterial({
            color: 0x222222, metalness: 0.9, roughness: 0.1, 
            wireframe: true, transparent: true, opacity: 0.2
        });
        const mesh = new THREE.Mesh(geo, mat);
        chamber.add(mesh);
        
        // Struts
        const strutsGeo = new THREE.IcosahedronGeometry(8.2, 1);
        const strutsMat = new THREE.MeshStandardMaterial({
            color: 0x555555, metalness: 1.0, roughness: 0.3, wireframe: true
        });
        const strutsMesh = new THREE.Mesh(strutsGeo, strutsMat);
        chamber.add(strutsMesh);

        return chamber;
    };
    const resonanceChamber = createResonanceChamber();
    registerPart('Resonance Chamber Shell', resonanceChamber,
        'Echoes the quantum state to amplify the entanglement probability amplitude.',
        'Titanium/Metamaterial', 'Increases armor yield strength.',
        17, ['Central Quantum Core'], 'Weak entanglement; armor behaves like normal fabric.',
        {x: 0, y: 15, z: 0}
    );

    // 14. Particle Injectors
    const createInjector = () => {
        const injGroup = new THREE.Group();
        
        const barrelGeo = new THREE.CylinderGeometry(2, 1, 10, 32);
        const barrelMesh = new THREE.Mesh(barrelGeo, chrome);
        injGroup.add(barrelMesh);

        const nozzleGeo = new THREE.ConeGeometry(1, 3, 32);
        const nozzleMesh = new THREE.Mesh(nozzleGeo, darkSteel);
        nozzleMesh.position.y = -6.5;
        injGroup.add(nozzleMesh);

        // Magnetic accelerator coils
        for(let i=0; i<4; i++) {
            const coilGeo = new THREE.TorusGeometry(2.5, 0.4, 16, 32);
            const coilMesh = new THREE.Mesh(coilGeo, copper);
            coilMesh.position.y = 3 - i*2;
            coilMesh.rotation.x = Math.PI/2;
            injGroup.add(coilMesh);
        }

        return injGroup;
    };
    const injectorAlpha = createInjector();
    injectorAlpha.rotation.z = Math.PI / 4;
    registerPart('Fermion Injector Alpha', injectorAlpha,
        'Injects the spin-up particle stream into the accelerator ring.',
        'Chrome/Copper/DarkSteel', 'Particle source A.',
        18, ['Particle Accelerator Ring Alpha'], 'Jamming; failure to supply particles.',
        {x: 18, y: 25, z: 0}
    );

    const injectorBeta = createInjector();
    injectorBeta.rotation.z = -Math.PI / 4;
    injectorBeta.rotation.x = Math.PI / 4;
    registerPart('Fermion Injector Beta', injectorBeta,
        'Injects the spin-down particle stream into the accelerator ring.',
        'Chrome/Copper/DarkSteel', 'Particle source B.',
        19, ['Particle Accelerator Ring Beta'], 'Jamming; failure to supply particles.',
        {x: -18, y: 25, z: 18}
    );

    // 15. The Output Anomaly (The glowing mesh result)
    const createAnomaly = () => {
        const anomaly = new THREE.Group();
        const geo = new THREE.TorusKnotGeometry(3, 1, 128, 64);
        const mesh = new THREE.Mesh(geo, quantumFoilMat);
        mesh.userData.isAnomaly = true;
        anomaly.add(mesh);
        return anomaly;
    };
    const outputAnomaly = createAnomaly();
    registerPart('God-Tier Armor Singularity', outputAnomaly,
        'The final woven product, possessing infinite tensile strength and zero mass.',
        'QuantumFoil', 'Protects the wearer from all physical and non-physical damage.',
        20, ['Entangled Armor Extractor Tube'], 'Premature extraction; explodes with the force of a supernova.',
        {x: 0, y: 50, z: 0}
    );

    const description = "The Quantum Entanglement Loom (God Tier) is an unfathomably complex megastructure designed to weave fundamental particles into macroscopic armor. By synchronizing multiple particle accelerators, robotic probability-weavers, and spooky action manifolds, it forces distinct quantum states to permanently knot together. The resulting fabric is computationally indestructible and fundamentally ignores classical thermodynamics.";

    const quizQuestions = [
        {
            question: "In the context of the loom's Spooky Action Synchronizer, what violation of classical mechanics allows the weaver arms to manipulate particles faster than the speed of light?",
            options: [
                "Bell's Theorem invalidates local hidden variables, allowing non-local correlations.",
                "The loom uses a tachyon tachyon-field generator.",
                "The particles are actually just moving slowly.",
                "General Relativity allows for infinite velocity in a vacuum."
            ],
            correctAnswer: 0,
            explanation: "Quantum entanglement demonstrates non-locality, consistent with Bell's Theorem, where the state of one entangled particle instantly correlates with another, regardless of distance, violating local realism."
        },
        {
            question: "Why must the Helium-3 Superfluid Coolant Lines maintain absolute zero during the weaving of the God-Tier Armor?",
            options: [
                "To make the machine look cool with frost effects.",
                "To prevent quantum decoherence caused by thermal agitation of the environment.",
                "To slow down the fermions so they don't escape.",
                "Because the copper magnetic coils will melt."
            ],
            correctAnswer: 1,
            explanation: "Thermal noise interacts with quantum states, causing them to collapse (decoherence). Extreme cooling minimizes environmental interactions, preserving the delicate entangled wave function."
        },
        {
            question: "When Weaver Arm Alpha manipulates a fermion with spin +1/2, what must Weaver Arm Beta instantaneously read on its entangled partner?",
            options: [
                "Spin +1/2",
                "Spin 0",
                "Spin -1/2",
                "A superposition of all spins"
            ],
            correctAnswer: 2,
            explanation: "Entangled particles often exist in singlet states where their total spin is zero. If one is measured as +1/2, the other must definitively be -1/2 to conserve angular momentum."
        },
        {
            question: "The Resonance Chamber Shell amplifies the probability amplitude. In quantum mechanics, what is the relationship between probability amplitude and the actual probability of finding the armor in a specific state?",
            options: [
                "Probability is the square root of the amplitude.",
                "Probability is the absolute square of the amplitude (Born rule).",
                "They are inversely proportional.",
                "They are exactly the same thing."
            ],
            correctAnswer: 1,
            explanation: "According to the Born rule, the probability density of finding a system in a given state is proportional to the square of the magnitude (absolute square) of the wave function's amplitude at that state."
        },
        {
            question: "If an operator extracts the armor prematurely, causing a 'localized micro-black hole', what fundamental limit was likely breached by packing too much entangled energy into a small space?",
            options: [
                "The Chandrasekhar limit",
                "The Bekenstein bound / Schwarzschild radius",
                "The Planck length",
                "The Heisenberg Uncertainty limit"
            ],
            correctAnswer: 1,
            explanation: "If the mass-energy density of the entangled mesh exceeds the threshold where its escape velocity surpasses the speed of light, it collapses into a black hole, crossing its Schwarzschild radius."
        }
    ];

    // Extreme Animation Logic
    function animate(time, speed, meshes) {
        // Core pulsating
        centralCore.rotation.x = time * speed * 2;
        centralCore.rotation.y = time * speed * 2.5;
        centralCore.scale.setScalar(1 + Math.sin(time * speed * 10) * 0.05);

        // Accelerator Rings spinning
        accelRingAlpha.rotation.z = time * speed * 5;
        accelRingBeta.rotation.z = -time * speed * 5.5;

        // Plasma streams inside rings pulsing
        meshes.forEach(m => {
            if(m.userData.isStream) {
                m.material.emissiveIntensity = 2.0 + Math.sin(time * speed * 20) * 1.5;
                m.rotation.y = time * speed * 10;
            }
        });

        // Spooky Action Synchronizer rings complex rotation
        synchronizer.children.forEach(ring => {
            if(ring.userData.syncRingIndex !== undefined) {
                const i = ring.userData.syncRingIndex;
                ring.rotation.x = Math.sin(time * speed * (i+1)) * Math.PI;
                ring.rotation.y = Math.cos(time * speed * (i+1.5)) * Math.PI;
                ring.rotation.z = time * speed * (i+0.5);
                ring.material.emissiveIntensity = 1.0 + Math.sin(time * speed * 15 + i) * 0.8;
            }
        });

        // Weaver Arms - complex inverse kinematics simulation via sine waves
        const armSpeed = speed * 8;
        
        weavingArmA.children[1].rotation.x = Math.sin(time * armSpeed) * 0.5; // lower arm
        weavingArmA.children[3].rotation.x = Math.sin(time * armSpeed + 1) * 0.5; // upper arm
        weavingArmA.children[4].rotation.x = Math.sin(time * armSpeed * 2) * Math.PI; // wrist spin

        weavingArmB.children[1].rotation.x = Math.sin(time * armSpeed + Math.PI) * 0.5; 
        weavingArmB.children[3].rotation.x = Math.sin(time * armSpeed + 1 + Math.PI) * 0.5; 
        weavingArmB.children[4].rotation.x = Math.sin(time * armSpeed * 2 + Math.PI) * Math.PI; 

        weavingArmC.children[1].rotation.z = Math.cos(time * armSpeed) * 0.5; 
        weavingArmC.children[3].rotation.z = Math.cos(time * armSpeed + 1) * 0.5; 
        weavingArmC.children[4].rotation.y = time * armSpeed * 3;

        weavingArmD.children[1].rotation.z = Math.cos(time * armSpeed + Math.PI) * 0.5; 
        weavingArmD.children[3].rotation.z = Math.cos(time * armSpeed + 1 + Math.PI) * 0.5; 
        weavingArmD.children[4].rotation.y = -time * armSpeed * 3;

        // Spool Array Spin
        spoolArray.rotation.y = time * speed * 2;
        spoolArray.children.forEach((spool, index) => {
            spool.children[3].rotation.y = time * speed * 15 * (index % 2 === 0 ? 1 : -1); // threads unspooling
        });

        // Extractor Lathe rotation
        meshExtractor.children[0].rotation.y = time * speed * 4;
        meshExtractor.children[1].position.y = 5 + Math.sin(time * speed * 3) * 5;
        meshExtractor.children[2].position.y = 25 - Math.sin(time * speed * 3) * 5;

        // Coolant flowing
        meshes.forEach(m => {
            if(m.userData.isCoolant) {
                // To simulate flow, we scale the material map offset, but here we just pulsate transparency/emissive
                m.material.opacity = 0.5 + Math.sin(time * speed * 10 + m.userData.phaseOffset) * 0.4;
                m.material.emissiveIntensity = 1.0 + Math.sin(time * speed * 20 + m.userData.phaseOffset);
            }
        });

        // Control Holograms glitching/updating
        meshes.forEach(m => {
            if(m.userData.isHolo) {
                m.scale.y = 1 + Math.random() * 0.1;
                m.material.opacity = 0.5 + Math.random() * 0.3;
            }
        });

        // Grav rings spinning
        meshes.forEach(m => {
            if(m.userData.isGravRing) {
                m.rotation.z = time * speed * 10;
                m.material.emissiveIntensity = 2.0 + Math.sin(time * speed * 50) * 1.0; // intense strobing
            }
        });
        gravRings.rotation.y = -time * speed;

        // Resonance Chamber
        resonanceChamber.rotation.y = time * speed * 0.5;
        resonanceChamber.children[1].rotation.x = time * speed * -0.5;

        // Output Anomaly (Torus Knot)
        outputAnomaly.rotation.x = time * speed * 3;
        outputAnomaly.rotation.y = time * speed * 4;
        outputAnomaly.children[0].material.emissiveIntensity = 1.0 + Math.sin(time * speed * 8) * 0.8;
        
        // Bobbing anomaly
        outputAnomaly.position.y = 50 + Math.sin(time * speed * 2) * 2;
    }

    return { group, parts, description, quizQuestions, animate };
}
