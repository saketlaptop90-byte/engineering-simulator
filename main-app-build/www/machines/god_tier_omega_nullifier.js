import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Lore and Description
    const description = "The Omega Nullifier (God Tier). A theoretical doomsday construct of hyper-advanced origin, designed not just for destruction, but for the complete cessation of multiversal existence. It operates by inducing localized false vacuum decay, accelerating the collapse of the Higgs field, and tearing the fabric of spacetime into disconnected Planck-scale fragments. Built with extremely complex zero-point energy manifolds and dimensional tethers. Use with extreme caution. This machine will annihilate everything.";

    // --- MATERIALS ---
    // Custom emissive materials for intense high-tech realism
    const voidMat = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 1.0, metalness: 0.0, emissive: 0x000000 });
    const eventHorizonMat = new THREE.MeshStandardMaterial({ color: 0x110022, roughness: 0.1, metalness: 0.8, emissive: 0x220055, emissiveIntensity: 2.0, transparent: true, opacity: 0.8 });
    const singularityGlowMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.0, metalness: 1.0, emissive: 0xffffff, emissiveIntensity: 5.0 });
    const darkMatterMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.9, metalness: 0.1, emissive: 0x100010, emissiveIntensity: 0.5 });
    const chronitonGlow = new THREE.MeshStandardMaterial({ color: 0x00ffff, roughness: 0.2, metalness: 0.8, emissive: 0x00ffff, emissiveIntensity: 3.0 });
    const tachyonGlow = new THREE.MeshStandardMaterial({ color: 0xff00ff, roughness: 0.2, metalness: 0.8, emissive: 0xff00ff, emissiveIntensity: 3.5 });
    const antimatterGlow = new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0.2, metalness: 0.8, emissive: 0xff0000, emissiveIntensity: 4.0 });
    const pulseBlue = new THREE.MeshStandardMaterial({ color: 0x0055ff, roughness: 0.1, metalness: 0.9, emissive: 0x0022aa, emissiveIntensity: 2.0 });
    const neonGreen = new THREE.MeshStandardMaterial({ color: 0x00ff00, roughness: 0.3, metalness: 0.5, emissive: 0x00ff00, emissiveIntensity: 4.0 });
    
    const containmentMetal = darkSteel.clone();
    containmentMetal.metalness = 0.9;
    containmentMetal.roughness = 0.4;
    
    const superconductor = copper.clone();
    superconductor.emissive = new THREE.Color(0x001100);
    superconductor.emissiveIntensity = 0.5;
    
    const advancedAlloy = chrome.clone();
    advancedAlloy.color = new THREE.Color(0x8899aa);
    advancedAlloy.roughness = 0.2;

    // --- GEOMETRY HELPER FUNCTIONS ---
    // Extrude geometry for complex structural ribs
    const createRib = (radiusOuter, radiusInner, thickness, segments) => {
        const shape = new THREE.Shape();
        shape.absarc(0, 0, radiusOuter, 0, Math.PI * 2, false);
        const hole = new THREE.Path();
        hole.absarc(0, 0, radiusInner, 0, Math.PI * 2, true);
        shape.holes.push(hole);
        
        const extrudeSettings = {
            depth: thickness,
            bevelEnabled: true,
            bevelSegments: 4,
            steps: 2,
            bevelSize: 0.5,
            bevelThickness: 0.5,
            curveSegments: segments
        };
        return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    };

    // 1. The Void Core (NullCore_Singularity)
    // Deeply complex multi-layered sphere representing the black hole
    const coreGroup = new THREE.Group();
    const coreGeo = new THREE.IcosahedronGeometry(5, 5); // very smooth sphere
    const coreMesh = new THREE.Mesh(coreGeo, voidMat);
    coreGroup.add(coreMesh);
    
    // Accretion disk
    const accretionGeo = new THREE.TorusGeometry(8, 0.5, 32, 128);
    const accretionMesh = new THREE.Mesh(accretionGeo, singularityGlowMat);
    accretionMesh.rotation.x = Math.PI / 2;
    accretionMesh.scale.z = 0.1;
    coreGroup.add(accretionMesh);

    // Event Horizon Manifold
    const horizonGeo = new THREE.IcosahedronGeometry(6.5, 4);
    const horizonMesh = new THREE.Mesh(horizonGeo, eventHorizonMat);
    coreGroup.add(horizonMesh);

    // Inner binding rings around the core
    for(let i=0; i<3; i++) {
        const binding = new THREE.Mesh(new THREE.TorusGeometry(7 + i, 0.2, 16, 64), pulseBlue);
        binding.rotation.x = Math.random() * Math.PI;
        binding.rotation.y = Math.random() * Math.PI;
        coreGroup.add(binding);
    }

    coreGroup.position.set(0, 80, 0);
    group.add(coreGroup);
    
    parts.push({
        name: "NullCore_Singularity",
        description: "A tethered micro-singularity acting as the primary entropy engine.",
        material: "Void Material / Pulse Blue Binding",
        function: "Absorbs ambient reality to fuel the nullification process.",
        assemblyOrder: 1,
        connections: ["EventHorizon_Manifold", "Tachyon_Accelerator_Ring_1"],
        failureEffect: "Spontaneous spaghettification of the local star system.",
        cascadeFailures: ["Complete machine implosion", "Timeline erasure"],
        originalPosition: { x: 0, y: 80, z: 0 },
        explodedPosition: { x: 0, y: 200, z: 0 }
    });

    parts.push({
        name: "EventHorizon_Manifold",
        description: "A stabilizing shell of exotic matter keeping the singularity in a metastable state.",
        material: "Exotic Dark Matter",
        function: "Prevents immediate evaporation via Hawking Radiation.",
        assemblyOrder: 2,
        connections: ["NullCore_Singularity"],
        failureEffect: "Uncontrolled Hawking evaporation leading to a gamma-ray burst.",
        cascadeFailures: ["NullCore_Singularity collapse"],
        originalPosition: { x: 0, y: 80, z: 0 },
        explodedPosition: { x: 0, y: 230, z: 0 }
    });

    // 2. The Tachyon Accelerator Rings
    // 3 complex massive rings rotating on different axes
    const ringGroup1 = new THREE.Group();
    const ringGroup2 = new THREE.Group();
    const ringGroup3 = new THREE.Group();

    const createAdvancedRing = (radius, tube, mat, glowMat, numNodes) => {
        const rGrp = new THREE.Group();
        // Main structural ring
        const baseRing = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 64, 256), mat);
        rGrp.add(baseRing);
        
        // Inner gear track
        const track = new THREE.Mesh(new THREE.TorusGeometry(radius - tube, tube*0.5, 16, 256), darkSteel);
        rGrp.add(track);

        // Nodes around the ring
        const nodeGeo = new THREE.BoxGeometry(tube*3, tube*3, tube*3);
        const nodeMat = advancedAlloy;
        for(let i = 0; i < numNodes; i++) {
            const angle = (i / numNodes) * Math.PI * 2;
            const nodeGrp = new THREE.Group();
            
            const node = new THREE.Mesh(nodeGeo, nodeMat);
            nodeGrp.add(node);
            
            // Glowing core in node
            const glow = new THREE.Mesh(new THREE.CylinderGeometry(tube, tube, tube*3.2, 32), glowMat);
            glow.rotation.x = Math.PI / 2;
            nodeGrp.add(glow);
            
            // Hydraulic micro-pistons on the node
            for(let j=0; j<4; j++) {
                const piston = new THREE.Mesh(new THREE.CylinderGeometry(tube*0.2, tube*0.2, tube*4, 16), chrome);
                piston.position.x = (j%2===0 ? 1 : -1) * tube * 1.5;
                piston.position.y = (j>1 ? 1 : -1) * tube * 1.5;
                nodeGrp.add(piston);
            }
            
            nodeGrp.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
            nodeGrp.rotation.z = angle;
            rGrp.add(nodeGrp);
        }
        return rGrp;
    };

    const ring1 = createAdvancedRing(30, 1.5, containmentMetal, chronitonGlow, 16);
    ringGroup1.add(ring1);
    
    const ring2 = createAdvancedRing(50, 2.0, darkSteel, tachyonGlow, 24);
    ringGroup2.add(ring2);
    
    const ring3 = createAdvancedRing(75, 3.0, superconductor, antimatterGlow, 36);
    ringGroup3.add(ring3);

    ringGroup1.position.set(0, 80, 0);
    ringGroup2.position.set(0, 80, 0);
    ringGroup3.position.set(0, 80, 0);
    
    group.add(ringGroup1);
    group.add(ringGroup2);
    group.add(ringGroup3);

    parts.push({
        name: "Tachyon_Accelerator_Ring_1",
        description: "Inner primary ring. Accelerates tachyonic particles beyond infinite velocity, breaking causality.",
        material: "Containment Metal / Chroniton Emitters",
        function: "Causality disruption.",
        assemblyOrder: 3,
        connections: ["NullCore_Singularity", "Dimensional_Tether_Nodes"],
        failureEffect: "Temporal loops and localized grandfather paradoxes.",
        cascadeFailures: ["Causality violation cascade"],
        originalPosition: { x: 0, y: 80, z: 0 },
        explodedPosition: { x: 0, y: 80, z: -80 }
    });

    parts.push({
        name: "Tachyon_Accelerator_Ring_2",
        description: "Secondary modulation ring. Modulates the dark energy frequency to match the local universe's resonant frequency.",
        material: "Dark Steel / Tachyon Emitters",
        function: "Frequency alignment.",
        assemblyOrder: 4,
        connections: ["Tachyon_Accelerator_Ring_1"],
        failureEffect: "Space-time shear forces shredding the local galaxy.",
        cascadeFailures: ["Gravitational tearing"],
        originalPosition: { x: 0, y: 80, z: 0 },
        explodedPosition: { x: 0, y: 80, z: -160 }
    });

    parts.push({
        name: "Tachyon_Accelerator_Ring_3",
        description: "Outer perimeter ring. Generates the macro-scale spatial distortions required for a false vacuum collapse.",
        material: "Superconductor / Antimatter Relays",
        function: "Spatial folding and macro-compression.",
        assemblyOrder: 5,
        connections: ["Tachyon_Accelerator_Ring_2"],
        failureEffect: "Immediate collapse into a naked singularity.",
        cascadeFailures: ["Universal topological failure"],
        originalPosition: { x: 0, y: 80, z: 0 },
        explodedPosition: { x: 0, y: 80, z: -240 }
    });

    // 3. Dimensional Tether Nodes & Support Pillars
    const tethers = new THREE.Group();
    const numTethers = 8;
    for(let i=0; i<numTethers; i++) {
        const angle = (i / numTethers) * Math.PI * 2;
        const x = Math.cos(angle) * 75;
        const z = Math.sin(angle) * 75;
        
        const pillarGrp = new THREE.Group();

        // Massive Lathe pillar for complex curvature
        const points = [];
        for ( let j = 0; j <= 40; j ++ ) {
            const py = (j / 40) * 80;
            // complex radius profile
            const pr = 6 + Math.sin(j * 0.4) * 2 + Math.cos(j * 0.8) * 1.5;
            points.push( new THREE.Vector2( pr, py ) );
        }
        const pillarGeo = new THREE.LatheGeometry( points, 64 );
        const pillar = new THREE.Mesh( pillarGeo, steel );
        pillarGrp.add(pillar);
        
        // Hydraulic outer piping wrapping the pillar
        class HelixCurve extends THREE.Curve {
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const py = t * 80;
                const radius = 9 + Math.sin(t * 40 * 0.4) * 2;
                const px = Math.cos(t * Math.PI * 10) * radius;
                const pz = Math.sin(t * Math.PI * 10) * radius;
                return optionalTarget.set(px, py, pz);
            }
        }
        const pipeGeo = new THREE.TubeGeometry(new HelixCurve(), 200, 0.8, 16, false);
        const pipe = new THREE.Mesh(pipeGeo, copper);
        pillarGrp.add(pipe);
        
        // Glowing straight conduit inside the pillar
        const conduitGeo = new THREE.CylinderGeometry(3, 3, 80, 32);
        const conduit = new THREE.Mesh(conduitGeo, chronitonGlow);
        conduit.position.y = 40;
        pillarGrp.add(conduit);

        // Heavy base mount for the pillar
        const mountGeo = new THREE.CylinderGeometry(12, 15, 10, 32);
        const mount = new THREE.Mesh(mountGeo, darkSteel);
        mount.position.y = 5;
        pillarGrp.add(mount);

        pillarGrp.position.set(x, 0, z);
        // rotate pillar to face center
        pillarGrp.rotation.y = -angle;
        tethers.add(pillarGrp);
    }
    group.add(tethers);

    parts.push({
        name: "Dimensional_Tether_Nodes",
        description: "Lattice pillars anchoring the nullification rings to the baryonic base.",
        material: "Steel / Copper / Chroniton",
        function: "Prevents the accelerator rings from ascending into higher dimensions during spin-up.",
        assemblyOrder: 6,
        connections: ["Tachyon_Accelerator_Ring_3", "Baryonic_Matter_Annihilator"],
        failureEffect: "Rings detaching and erasing random coordinates in the multiverse.",
        cascadeFailures: ["Complete targeting failure", "Spontaneous dimensional drifting"],
        originalPosition: { x: 0, y: 40, z: 0 },
        explodedPosition: { x: 0, y: -50, z: 0 }
    });

    // 4. Baryonic Matter Annihilator (Colossal Base Platform)
    const baseGroup = new THREE.Group();
    
    // Primary Foundation Disk
    const baseGeo1 = new THREE.CylinderGeometry(120, 130, 10, 128);
    const baseMesh1 = new THREE.Mesh(baseGeo1, darkSteel);
    baseMesh1.position.y = -5;
    baseGroup.add(baseMesh1);

    // Secondary Deck with ribbed extrusions
    const baseMesh2 = new THREE.Mesh(createRib(110, 0, 10, 128), containmentMetal);
    baseMesh2.rotation.x = Math.PI / 2;
    baseMesh2.position.y = 5;
    baseGroup.add(baseMesh2);

    // Tertiary Reactor Deck
    const baseGeo3 = new THREE.CylinderGeometry(90, 100, 15, 128);
    const baseMesh3 = new THREE.Mesh(baseGeo3, advancedAlloy);
    baseMesh3.position.y = 15;
    baseGroup.add(baseMesh3);

    // Thousands of greebled 'circuit' lines and heat sinks
    const heatSinkGeo = new THREE.BoxGeometry(4, 15, 2);
    for(let i=0; i<180; i++) {
        const hsMesh = new THREE.Mesh(heatSinkGeo, copper);
        const r = 95;
        const theta = (i / 180) * Math.PI * 2;
        hsMesh.position.set(Math.cos(theta)*r, 15, Math.sin(theta)*r);
        hsMesh.rotation.y = -theta;
        baseGroup.add(hsMesh);
    }
    
    // Power core conduits radially on the base
    for(let i=0; i<36; i++) {
        const cGeo = new THREE.BoxGeometry(30, 4, 4);
        const cMesh = new THREE.Mesh(cGeo, pulseBlue);
        const r = 60;
        const theta = (i / 36) * Math.PI * 2;
        cMesh.position.set(Math.cos(theta)*r, 22.5, Math.sin(theta)*r);
        cMesh.rotation.y = -theta;
        baseGroup.add(cMesh);
    }

    group.add(baseGroup);

    parts.push({
        name: "Baryonic_Matter_Annihilator",
        description: "Primary foundation platform. Converts local baryonic matter into pure anti-matter via localized quark unbinding.",
        material: "Dark Steel / Containment Metal / Advanced Alloy",
        function: "Power generation and primary structural foundation.",
        assemblyOrder: 7,
        connections: ["Dimensional_Tether_Nodes", "QuantumFlux_Capacitor_Array"],
        failureEffect: "Uncontrolled matter-antimatter explosion yielding ~500 Yottatons of TNT equivalent.",
        cascadeFailures: ["Complete annihilation of the facility", "Crustal destruction of the host planet"],
        originalPosition: { x: 0, y: 10, z: 0 },
        explodedPosition: { x: 0, y: -150, z: 0 }
    });

    // 5. QuantumFlux Capacitors (Energy Banks)
    const capacitors = new THREE.Group();
    for(let i=0; i<12; i++) {
        const theta = (i / 12) * Math.PI * 2;
        const capGroup = new THREE.Group();
        
        // Outer containment shell (Glass)
        const capGeo = new THREE.CylinderGeometry(8, 8, 40, 32, 1, true);
        const capMesh = new THREE.Mesh(capGeo, glass);
        capMesh.material = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.9, roughness: 0.1, transparent: true, opacity: 0.4, side: THREE.DoubleSide });
        
        // Inner glowing core
        const coreCGeo = new THREE.CylinderGeometry(3, 3, 38, 16);
        const coreCMesh = new THREE.Mesh(coreCGeo, antimatterGlow);
        
        // Stabilizer rings around capacitor
        for(let j=0; j<6; j++) {
            const rGeo = new THREE.TorusGeometry(8.5, 1, 16, 64);
            const rMesh = new THREE.Mesh(rGeo, chrome);
            rMesh.position.y = -15 + (j * 6);
            rMesh.rotation.x = Math.PI/2;
            capGroup.add(rMesh);
        }

        capGroup.add(capMesh);
        capGroup.add(coreCMesh);
        
        capGroup.position.set(Math.cos(theta)*105, 42.5, Math.sin(theta)*105);
        capacitors.add(capGroup);
    }
    group.add(capacitors);

    parts.push({
        name: "QuantumFlux_Capacitor_Array",
        description: "Colossal banks of high-energy storage holding raw extracted zero-point energy prior to nullification injection.",
        material: "Reinforced Glass / Chrome / Contained Antimatter",
        function: "Energy buffering and peak-load discharge.",
        assemblyOrder: 8,
        connections: ["Baryonic_Matter_Annihilator", "Dimensional_Tether_Nodes"],
        failureEffect: "Zero-point energy cascade, boiling the local vacuum state.",
        cascadeFailures: ["Phase transition of local vacuum", "Total structural vaporization"],
        originalPosition: { x: 0, y: 42.5, z: 0 },
        explodedPosition: { x: 0, y: 40, z: 200 }
    });

    // 6. Entropy Reversal Field Generator (The Top Spire)
    const spireGroup = new THREE.Group();
    
    // Extremely complex central knot
    const knotGeo = new THREE.TorusKnotGeometry( 15, 3, 300, 64, 4, 9 );
    const knotMesh = new THREE.Mesh(knotGeo, chronitonGlow);
    knotMesh.position.y = 220;
    spireGroup.add(knotMesh);

    // Main central spire shaft
    const spirePillarGeo = new THREE.CylinderGeometry(2, 10, 120, 64);
    const spirePillar = new THREE.Mesh(spirePillarGeo, darkSteel);
    spirePillar.position.y = 160;
    spireGroup.add(spirePillar);
    
    // Levitating spire rings
    for(let i=0; i<15; i++) {
        const ringGeo = new THREE.TorusGeometry( 12 - (i*0.6), 1, 32, 128 );
        const rMesh = new THREE.Mesh(ringGeo, superconductor);
        rMesh.position.y = 120 + (i * 6);
        rMesh.rotation.x = Math.PI/2;
        spireGroup.add(rMesh);
    }

    // Energy tendrils extending from the spire to the core
    const tendrils = new THREE.Group();
    for(let i=0; i<6; i++) {
        const curve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3( 0, 160, 0 ),
            new THREE.Vector3( Math.cos(i*Math.PI/3)*30, 120, Math.sin(i*Math.PI/3)*30 ),
            new THREE.Vector3( 0, 80, 0 )
        );
        const tGeo = new THREE.TubeGeometry(curve, 64, 0.5, 8, false);
        const tMesh = new THREE.Mesh(tGeo, tachyonGlow);
        tendrils.add(tMesh);
    }
    spireGroup.add(tendrils);

    group.add(spireGroup);

    parts.push({
        name: "Entropy_Reversal_Field_Generator",
        description: "Forces a localized reversal of entropy, effectively rewinding time in the nullification zone to weaken reality's constraints before erasure.",
        material: "Dark Steel / Superconductor / Chroniton Plating",
        function: "Pre-processes the target vector for easier erasure.",
        assemblyOrder: 9,
        connections: ["NullCore_Singularity", "Graviton_Lens_Array"],
        failureEffect: "Time runs backward locally at 1,000,000x speed.",
        cascadeFailures: ["Chronological paradoxes", "Machine un-builds itself into raw materials"],
        originalPosition: { x: 0, y: 160, z: 0 },
        explodedPosition: { x: 0, y: 350, z: 0 }
    });

    // 7. Mathematical Constants Manifold (Floating debris)
    const runesGroup = new THREE.Group();
    const runeGeo = new THREE.OctahedronGeometry(1.5, 1);
    for(let i=0; i<150; i++) {
        const rMesh = new THREE.Mesh(runeGeo, singularityGlowMat);
        const dist = 18 + Math.random() * 8;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        rMesh.position.x = dist * Math.sin(phi) * Math.cos(theta);
        rMesh.position.y = dist * Math.sin(phi) * Math.sin(theta);
        rMesh.position.z = dist * Math.cos(phi);
        runesGroup.add(rMesh);
    }
    runesGroup.position.set(0, 80, 0);
    group.add(runesGroup);

    parts.push({
        name: "Mathematical_Constants_Manifold",
        description: "Physical manifestations of fundamental constants (Pi, e, Planck's constant, etc.), shattered and orbiting the core as reality breaks down.",
        material: "Pure Hard-light Mathematics",
        function: "Destabilizes physical laws.",
        assemblyOrder: 10,
        connections: ["NullCore_Singularity"],
        failureEffect: "Pi equals exactly 3.",
        cascadeFailures: ["All circular logic collapses", "Euclidean geometry fails catastrophically"],
        originalPosition: { x: 0, y: 80, z: 0 },
        explodedPosition: { x: 150, y: 150, z: 150 }
    });

    // 8. Subspace Fracture Containment Vessel (Lower housing)
    const lowerHousingGroup = new THREE.Group();
    const lHousingGeo = new THREE.SphereGeometry(60, 128, 128, 0, Math.PI * 2, Math.PI/2, Math.PI/2);
    const lHousingMesh = new THREE.Mesh(lHousingGeo, voidMat);
    lHousingMesh.position.y = -10;
    lowerHousingGroup.add(lHousingMesh);
    
    // Internal glowing geodesic grid
    const gridGeo = new THREE.IcosahedronGeometry(59, 4);
    const gridMesh = new THREE.Mesh(gridGeo, neonGreen);
    gridMesh.material.wireframe = true;
    gridMesh.position.y = -10;
    
    // Cut off the top half of the grid
    const gridClipPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 10);
    gridMesh.material.clippingPlanes = [gridClipPlane];
    gridMesh.material.clipShadows = true; // Requires renderer.localClippingEnabled = true in main app
    
    lowerHousingGroup.add(gridMesh);
    group.add(lowerHousingGroup);

    parts.push({
        name: "Subspace_Fracture_Containment_Vessel",
        description: "Houses the initial fracture in subspace which powers the massive matter annihilator above.",
        material: "Void Material / Tachyon Wireframe",
        function: "Subspace siphoning.",
        assemblyOrder: 11,
        connections: ["Baryonic_Matter_Annihilator"],
        failureEffect: "Reality falls through a subspace sinkhole.",
        cascadeFailures: ["Subspace rupture", "Local region drops out of normal spacetime"],
        originalPosition: { x: 0, y: -30, z: 0 },
        explodedPosition: { x: 0, y: -250, z: 0 }
    });

    // 9. Dark Energy Conduits (Intricate chaotic piping)
    const conduitGroup = new THREE.Group();
    class CustomKnotCurve extends THREE.Curve {
        constructor(scale = 1, offset = 0) {
            super();
            this.scale = scale;
            this.offset = offset;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            t += this.offset;
            const tx = Math.sin(t * Math.PI * 4) * 2;
            const ty = Math.cos(t * Math.PI * 6) * 3 + 2;
            const tz = Math.sin(t * Math.PI * 8) * 2;
            return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
        }
    }
    
    for(let i=0; i<16; i++) {
        const path = new CustomKnotCurve(25, i*0.1);
        const geometry = new THREE.TubeGeometry(path, 150, 0.8, 12, true);
        const mesh = new THREE.Mesh(geometry, darkMatterMat);
        mesh.rotation.y = (i / 16) * Math.PI * 2;
        mesh.position.y = 80;
        conduitGroup.add(mesh);
    }
    group.add(conduitGroup);

    parts.push({
        name: "DarkEnergy_Conduits",
        description: "Channels chaotic extracted dark energy from the vacuum into the accelerator rings and the core.",
        material: "Dark Matter Matrix",
        function: "Hyper-fluid fuel delivery system.",
        assemblyOrder: 12,
        connections: ["Subspace_Fracture_Containment_Vessel", "Tachyon_Accelerator_Ring_1"],
        failureEffect: "Dark energy spill, accelerating universal expansion locally to lethal speeds.",
        cascadeFailures: ["The Big Rip (Localized)"],
        originalPosition: { x: 0, y: 80, z: 0 },
        explodedPosition: { x: -150, y: 80, z: 150 }
    });

    // 10. Graviton Lens Array (Focusing rings around the spire)
    const lensGroup = new THREE.Group();
    for(let i=0; i<5; i++) {
        const lGeo = new THREE.TorusGeometry(20 + i*8, 3, 64, 128);
        const lMesh = new THREE.Mesh(lGeo, glass);
        lMesh.material = new THREE.MeshStandardMaterial({ color: 0x88bbff, transmission: 1.0, opacity: 1, transparent: true, roughness: 0.05, ior: 2.5 });
        lMesh.rotation.x = Math.PI / 2;
        lMesh.position.y = 170 + i*15;
        lensGroup.add(lMesh);
        
        // Mechanical frame locking the lens
        const fGeo = new THREE.TorusGeometry(20 + i*8, 3.2, 12, 128);
        const fMesh = new THREE.Mesh(fGeo, darkSteel);
        fMesh.material.wireframe = true;
        fMesh.rotation.x = Math.PI / 2;
        fMesh.position.y = 170 + i*15;
        lensGroup.add(fMesh);
    }
    group.add(lensGroup);

    parts.push({
        name: "Graviton_Lens_Array",
        description: "Bends the geometry of space-time to focus the nullification beam into a concentrated theoretical vector.",
        material: "Hyper-Dense Glass / Dark Steel Frames",
        function: "Beam focusing and vector alignment.",
        assemblyOrder: 13,
        connections: ["Entropy_Reversal_Field_Generator"],
        failureEffect: "Gravitational lensing goes wild, creating localized black holes.",
        cascadeFailures: ["Multiple spontaneous singularities", "Tidal destruction"],
        originalPosition: { x: 0, y: 200, z: 0 },
        explodedPosition: { x: 0, y: 450, z: 0 }
    });

    // 11. Omniversal Harmonic Resonator (Outer shell framework)
    const shellGroup = new THREE.Group();
    const shellGeo = new THREE.IcosahedronGeometry(150, 3);
    const shellMesh = new THREE.Mesh(shellGeo, chrome);
    shellMesh.material.wireframe = true;
    shellMesh.material.transparent = true;
    shellMesh.material.opacity = 0.15;
    shellMesh.position.y = 80;
    shellGroup.add(shellMesh);
    group.add(shellGroup);

    parts.push({
        name: "Omniversal_Harmonic_Resonator",
        description: "Vibrates at the exact counter-frequency of reality, loosening the ontological bonds of the target universe.",
        material: "Chrome Poly-Alloy Wireframe",
        function: "Ontological destabilization and frequency jamming.",
        assemblyOrder: 14,
        connections: ["Baryonic_Matter_Annihilator"],
        failureEffect: "Accidentally tunes into an alternate reality, swapping dimensions.",
        cascadeFailures: ["Dimensional overlap", "Existence of evil twins"],
        originalPosition: { x: 0, y: 80, z: 0 },
        explodedPosition: { x: 300, y: 80, z: 300 }
    });

    // 12. Vacuum Decay Trigger (The Red Button)
    const triggerGroup = new THREE.Group();
    
    // Command pedestal
    const pedGeo = new THREE.CylinderGeometry(5, 7, 20, 32);
    const pedMesh = new THREE.Mesh(pedGeo, darkSteel);
    triggerGroup.add(pedMesh);

    // Glass dome over button
    const domeGeo = new THREE.SphereGeometry(4, 32, 32, 0, Math.PI*2, 0, Math.PI/2);
    const domeMesh = new THREE.Mesh(domeGeo, glass);
    domeMesh.position.y = 10;
    domeMesh.material = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.3, roughness: 0.1 });
    triggerGroup.add(domeMesh);

    const tBox = new THREE.BoxGeometry(4, 2, 4);
    const tBoxMesh = new THREE.Mesh(tBox, chrome);
    tBoxMesh.position.y = 10.5;
    triggerGroup.add(tBoxMesh);
    
    const tBtn = new THREE.CylinderGeometry(1.5, 1.5, 1, 32);
    const tBtnMesh = new THREE.Mesh(tBtn, new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0.1, metalness: 0.5, emissive: 0xaa0000, emissiveIntensity: 2.0 }));
    tBtnMesh.position.y = 11.5;
    triggerGroup.add(tBtnMesh);
    
    triggerGroup.position.set(110, 25, 0); 
    group.add(triggerGroup);

    parts.push({
        name: "Vacuum_Decay_Trigger_Console",
        description: "The switch. Initiates the cascading collapse of the false vacuum. Protected by a basic glass dome because humanity is arrogant.",
        material: "Dark Steel / Chrome / Red Plastic",
        function: "End it all.",
        assemblyOrder: 15,
        connections: ["Baryonic_Matter_Annihilator"],
        failureEffect: "Button gets stuck.",
        cascadeFailures: ["Awkward silence", "Operator embarrassment", "Universe survives another day"],
        originalPosition: { x: 110, y: 25, z: 0 },
        explodedPosition: { x: 250, y: 50, z: 0 }
    });


    // --- EXTREME ANIMATION LOGIC ---
    let timeAcc = 0;
    const animate = (delta, speed, meshes) => {
        timeAcc += delta * speed;

        // Core Rotation & Pulsation
        coreGroup.rotation.y += 0.05 * speed;
        coreGroup.rotation.x += 0.02 * speed;
        
        accretionMesh.scale.x = 1 + Math.sin(timeAcc * 5) * 0.15;
        accretionMesh.scale.y = 1 + Math.sin(timeAcc * 5) * 0.15;
        
        // Inner bindings chaotic spin
        for(let i=2; i<5; i++) {
            if(coreGroup.children[i]) {
                coreGroup.children[i].rotation.x += (0.05 + i*0.01) * speed;
                coreGroup.children[i].rotation.y += (0.04 - i*0.01) * speed;
            }
        }

        // Accelerator Rings - Complex multi-axis gyroscopic rotation
        ringGroup1.rotation.x = Math.sin(timeAcc * 0.5) * Math.PI * 0.2;
        ringGroup1.rotation.y += 0.03 * speed;
        ringGroup1.rotation.z = Math.cos(timeAcc * 0.3) * Math.PI * 0.1;
        
        ringGroup2.rotation.y = Math.cos(timeAcc * 0.4) * Math.PI * 0.3;
        ringGroup2.rotation.z += 0.04 * speed;
        ringGroup2.rotation.x = Math.sin(timeAcc * 0.2) * Math.PI * 0.15;
        
        ringGroup3.rotation.x += 0.02 * speed;
        ringGroup3.rotation.y = Math.sin(timeAcc * 0.6) * Math.PI * 0.4;
        ringGroup3.rotation.z = Math.cos(timeAcc * 0.5) * Math.PI * 0.2;

        // Animate gears/tracks inside rings
        ringGroup1.children[1].rotation.z -= 0.1 * speed;
        ringGroup2.children[1].rotation.z += 0.15 * speed;
        ringGroup3.children[1].rotation.z -= 0.08 * speed;

        // Capacitor Banks pulsing and charging
        capacitors.children.forEach((cap, i) => {
            const core = cap.children[1];
            // Sine wave pulse based on position and time
            core.scale.y = 1 + Math.sin(timeAcc * 10 + i) * 0.25;
            core.material.emissiveIntensity = 4.0 + Math.sin(timeAcc * 20 + i) * 3.0;
            
            // Spin the stabilizer rings on the capacitors
            for(let j=2; j<8; j++) {
                if(cap.children[j]) cap.children[j].rotation.z += 0.15 * speed * (j%2===0?1:-1);
            }
        });

        // Top Spire (Entropy Reversal Generator)
        knotMesh.rotation.y -= 0.08 * speed;
        knotMesh.rotation.z += 0.03 * speed;
        knotMesh.scale.setScalar(1 + Math.sin(timeAcc * 8) * 0.2);

        // Energy tendrils undulating
        tendrils.children.forEach((t, i) => {
            t.material.emissiveIntensity = 2 + Math.sin(timeAcc * 15 + i*2) * 2;
            t.scale.x = 1 + Math.sin(timeAcc * 5 + i) * 0.5;
            t.scale.z = 1 + Math.cos(timeAcc * 5 + i) * 0.5;
        });

        // Mathematical Runes chaotic orbit
        runesGroup.rotation.y -= 0.15 * speed;
        runesGroup.children.forEach((rune, i) => {
            rune.rotation.x += 0.05 * speed;
            rune.rotation.y += 0.05 * speed;
            const offset = i * 0.1;
            const dist = 18 + Math.sin(timeAcc * 3 + offset) * 5;
            
            // Math to keep them orbiting while shifting radius
            const currentR = Math.sqrt(rune.position.x**2 + rune.position.y**2 + rune.position.z**2);
            rune.position.multiplyScalar(dist / currentR);
            
            // Randomly blink out of existence (simulating reality failure)
            rune.visible = Math.sin(timeAcc * 10 + i) > -0.8; 
        });

        // Dark Energy Conduits pulsing
        conduitGroup.children.forEach((c, i) => {
            c.material.emissiveIntensity = 0.5 + Math.sin(timeAcc * 8 + i) * 2.0;
            // wriggle effect
            c.rotation.x = Math.sin(timeAcc * 2 + i) * 0.05;
        });

        // Subspace Grid rotation
        gridMesh.rotation.y += 0.015 * speed;
        gridMesh.rotation.z = Math.sin(timeAcc * 0.8) * 0.3;

        // Omniversal Shell breathing
        shellMesh.rotation.y += 0.003 * speed;
        shellMesh.scale.setScalar(1 + Math.sin(timeAcc * 1.5) * 0.03);

        // Graviton Lenses focusing and aligning
        lensGroup.children.forEach((l, i) => {
            // Complex wobbling
            l.rotation.x = Math.PI / 2 + Math.sin(timeAcc * 2 + i) * 0.15;
            l.rotation.y = Math.cos(timeAcc * 1.5 + i) * 0.15;
            
            // Pulsing scale
            if(i%2===0) {
                l.scale.setScalar(1 + Math.sin(timeAcc * 5) * 0.05);
            }
        });
    };

    // --- PHD LEVEL THEORETICAL PHYSICS QUIZ QUESTIONS ---
    const quizQuestions = [
        {
            question: "In the context of the black hole information paradox, which mechanism proposes that information is preserved and reflected back into the universe as the black hole evaporates without violating the no-cloning theorem?",
            options: ["The Fuzzball paradigm in String Theory", "Black Hole Complementarity", "Hawking's original formulation of purely thermal radiation", "Quantum chromodynamic confinement"],
            correctAnswer: 1,
            explanation: "Black Hole Complementarity, proposed by Susskind, argues that information is both reflected at the horizon and passes through it, but no single observer can witness both, thus preserving quantum mechanics and avoiding the no-cloning theorem."
        },
        {
            question: "The machine induces false vacuum decay. According to current quantum field theory, what would happen to the universe if the Higgs field transitioned to a true vacuum state?",
            options: ["The universe would expand exponentially in a secondary inflationary epoch.", "A bubble of lower-energy vacuum would expand at the speed of light, altering fundamental constants and destroying all bound baryonic matter.", "Gravity would become repulsive, tearing galaxies apart.", "The strong nuclear force would weaken, dissolving atomic nuclei but leaving leptons entirely unaffected."],
            correctAnswer: 1,
            explanation: "False vacuum decay would nucleate a bubble of true vacuum expanding outward at the speed of light. Inside, the masses of elementary particles would radically change, obliterating all known structures of matter."
        },
        {
            question: "Which of the following best describes the AdS/CFT correspondence principle applied to the machine's localized reality destruction?",
            options: ["It equates a theory of quantum gravity in a bulk Anti-de Sitter space to a conformal field theory on its boundary.", "It proves that tachyons can travel backwards in time without causality violation.", "It describes the spontaneous symmetry breaking of the electroweak force at the grand unification epoch.", "It defines the mass-energy equivalence in non-Euclidean Calabi-Yau spaces."],
            correctAnswer: 0,
            explanation: "The AdS/CFT correspondence (Holographic Principle) posits a mathematical equivalence between a string theory (gravity) in a bulk space and a quantum field theory without gravity on its boundary."
        },
        {
            question: "To stabilize the NullCore, the machine theoretically utilizes Calabi-Yau manifolds. In String Theory, what is the primary structural role of a Calabi-Yau manifold?",
            options: ["To compactify the extra 6 spatial dimensions required by superstring theory so they are unobservable at macroscopic scales.", "To generate infinite Hawking radiation at the event horizon of a microscopic black hole.", "To resolve the ultraviolet catastrophe in black body radiation calculations.", "To mathematically explain the non-zero mass of the Higgs boson."],
            correctAnswer: 0,
            explanation: "Calabi-Yau manifolds are complex, 6-dimensional shapes used in String Theory to compactify the extra spatial dimensions down to the Planck length, hiding them from macroscopic observation."
        },
        {
            question: "If the Tachyon Accelerator Rings induce a closed timelike curve (CTC), which principle theoretically prevents the occurrence of a grandfather paradox while allowing the CTC to exist?",
            options: ["The Novikov self-consistency principle", "The Heisenberg uncertainty principle", "The Pauli exclusion principle", "The Copernican principle"],
            correctAnswer: 0,
            explanation: "The Novikov self-consistency principle argues that if an event exists that would cause a paradox or any change to the past whatsoever, then the probability of that event is zero, forcing any actions taken in the past to be self-consistent with the timeline."
        }
    ];

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}
