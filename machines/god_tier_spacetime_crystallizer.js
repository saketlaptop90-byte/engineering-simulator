import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};
    const updatables = [];

    // --- CUSTOM GOD TIER MATERIALS ---
    const plasmaMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.9,
        wireframe: false
    });

    const voidMaterial = new THREE.MeshStandardMaterial({
        color: 0x050505,
        roughness: 1.0,
        metalness: 0.1
    });

    const latticeMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xccffff,
        emissive: 0x0055ff,
        emissiveIntensity: 0.8,
        transmission: 0.95,
        opacity: 1,
        metalness: 0.2,
        roughness: 0.05,
        ior: 2.5,
        thickness: 5.0,
        clearcoat: 1.0
    });

    const shatterMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff5500,
        emissive: 0xff0000,
        emissiveIntensity: 1.5,
        transmission: 0.5,
        roughness: 0.2
    });

    const goldPlating = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        metalness: 1.0,
        roughness: 0.3
    });

    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 2.0
    });

    // --- UTILITY FUNCTIONS ---
    function addPart(name, description, materialName, functionDesc, assemblyOrder, connections, failEffect, cascade, origPos, explPos) {
        parts.push({
            name,
            description,
            material: materialName,
            function: functionDesc,
            assemblyOrder,
            connections,
            failureEffect: failEffect,
            cascadeFailures: cascade,
            originalPosition: origPos,
            explodedPosition: explPos
        });
    }

    // --- 1. BASE CONTAINMENT STRUCTURE ---
    const baseGroup = new THREE.Group();
    group.add(baseGroup);

    // Main octagonal foundation
    const octoShape = new THREE.Shape();
    const octoRadius = 40;
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        if (i === 0) octoShape.moveTo(Math.cos(angle) * octoRadius, Math.sin(angle) * octoRadius);
        else octoShape.lineTo(Math.cos(angle) * octoRadius, Math.sin(angle) * octoRadius);
    }
    octoShape.lineTo(octoRadius, 0);

    const octoExtrudeSettings = { depth: 5, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 1, bevelThickness: 1 };
    const baseGeo = new THREE.ExtrudeGeometry(octoShape, octoExtrudeSettings);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.rotation.x = Math.PI / 2;
    baseMesh.position.y = -20;
    baseGroup.add(baseMesh);

    // Tread/Lug system for the foundation (Heavy grips)
    for(let i=0; i<32; i++) {
        const angle = (i / 32) * Math.PI * 2;
        const lugGeo = new THREE.BoxGeometry(4, 6, 8);
        const lugMesh = new THREE.Mesh(lugGeo, steel);
        lugMesh.position.set(Math.cos(angle) * 41, -17.5, Math.sin(angle) * 41);
        lugMesh.rotation.y = -angle;
        baseGroup.add(lugMesh);
    }

    addPart('Titanium Octo-Foundation', 'Massive base plate designed to anchor the machine against spacetime recoil.', 'darkSteel', 'Provides absolute structural zero-point anchoring.', 1, ['Spacetime Ground', 'Primary Hydraulics'], 'Machine tears itself from baseline reality.', ['Containment Ring Fracture', 'Core Destabilization'], {x:0, y:-20, z:0}, {x:0, y:-40, z:0});

    // --- 2. MASSIVE CENTRAL EMITTER COLUMN ---
    const emitterGroup = new THREE.Group();
    group.add(emitterGroup);
    meshes.emitterGroup = emitterGroup;

    // Lathe profile for the core pillar
    const pillarPoints = [];
    for (let i = 0; i <= 50; i++) {
        const y = (i - 25) * 1.5; // -37.5 to 37.5
        const r = 10 + Math.sin(i * 0.5) * 3 + (Math.abs(y) > 20 ? 5 : 0);
        pillarPoints.push(new THREE.Vector2(r, y));
    }
    const pillarGeo = new THREE.LatheGeometry(pillarPoints, 64);
    const pillarMesh = new THREE.Mesh(pillarGeo, steel);
    emitterGroup.add(pillarMesh);

    // Giant Magnetic Coils wrapped around the pillar
    const coilCount = 7;
    for (let i = 0; i < coilCount; i++) {
        const coilY = -30 + (i * 10);
        const coilGeo = new THREE.TorusGeometry(16, 2, 32, 100);
        const coilMesh = new THREE.Mesh(coilGeo, copper);
        coilMesh.position.y = coilY;
        coilMesh.rotation.x = Math.PI / 2;
        emitterGroup.add(coilMesh);
        
        // Add tiny cooling fins to each coil
        for(let j=0; j<36; j++) {
            const finAngle = (j/36) * Math.PI * 2;
            const finGeo = new THREE.BoxGeometry(4, 3, 0.5);
            const finMesh = new THREE.Mesh(finGeo, aluminum);
            finMesh.position.set(Math.cos(finAngle) * 18, coilY, Math.sin(finAngle) * 18);
            finMesh.rotation.y = -finAngle;
            emitterGroup.add(finMesh);
        }
    }

    addPart('Quantum Singularity Pillar', 'The central lathe-forged housing for the naked singularity.', 'steel', 'Channels exotic matter through the z-axis.', 2, ['Titanium Octo-Foundation', 'Magnetic Coils'], 'Singularity expands uncontrollably.', ['Total Spacetime Collapse'], {x:0, y:0, z:0}, {x:0, y:50, z:0});
    addPart('Superconducting Magnetic Coils', 'Seven highly dense copper torus coils.', 'copper', 'Generates a 10^15 Tesla field to squeeze spacetime.', 3, ['Quantum Singularity Pillar'], 'Loss of magnetic squeeze.', ['Quantum Singularity Pillar Breach'], {x:0, y:0, z:0}, {x:30, y:0, z:30});

    // --- 3. HEAVY INDUSTRIAL CONTAINMENT RINGS (GIMBALS) ---
    const gimbalGroup = new THREE.Group();
    emitterGroup.add(gimbalGroup);
    
    const rings = [];
    const ringRadii = [25, 32, 39];
    const ringMaterials = [goldPlating, chrome, darkSteel];
    
    for(let r=0; r<3; r++) {
        const ringPivot = new THREE.Group();
        gimbalGroup.add(ringPivot);
        rings.push(ringPivot);

        const ringGeo = new THREE.TorusGeometry(ringRadii[r], 1.5, 32, 128);
        const ringMesh = new THREE.Mesh(ringGeo, ringMaterials[r]);
        
        // Add extreme details to the rings (nodes/rivets/emitters)
        for(let n=0; n<16; n++) {
            const nodeAngle = (n/16) * Math.PI * 2;
            const nodeGeo = new THREE.CylinderGeometry(2, 2.5, 4, 16);
            const nodeMesh = new THREE.Mesh(nodeGeo, steel);
            nodeMesh.position.set(Math.cos(nodeAngle) * ringRadii[r], 0, Math.sin(nodeAngle) * ringRadii[r]);
            nodeMesh.rotation.x = Math.PI / 2;
            nodeMesh.rotation.z = -nodeAngle;
            ringMesh.add(nodeMesh);

            // Glowing sub-node
            const glowGeo = new THREE.SphereGeometry(1.2, 16, 16);
            const glowMesh = new THREE.Mesh(glowGeo, plasmaMaterial);
            glowMesh.position.y = 2.2;
            nodeMesh.add(glowMesh);
        }
        
        ringPivot.add(ringMesh);
        
        addPart(`Containment Gimbal Ring ${r+1}`, `Massive rotational dampener ring at radius ${ringRadii[r]}.`, 'chrome', 'Counteracts angular momentum of freezing spacetime.', 4+r, ['Emitter Base', `Ring ${r}`], 'Gyroscopic destabilization.', ['Core Wobble', 'Spacetime Fracture'], {x:0, y:0, z:0}, {x: 0, y: 0, z: (r+1)*20});
    }
    meshes.rings = rings;

    // --- 4. HYDRAULIC VIBRATION SHATTER SYSTEM ---
    // The machine uses giant pistons to violently shake the core and shatter the crystallization when it gets too dense.
    const hydraulicsGroup = new THREE.Group();
    baseGroup.add(hydraulicsGroup);
    meshes.pistons = [];

    for(let i=0; i<8; i++) {
        const angle = (i/8) * Math.PI * 2;
        const radiusBase = 28;
        const radiusCore = 14;
        
        const pistonAssembly = new THREE.Group();
        
        // Base mount
        const mountGeo = new THREE.BoxGeometry(4, 4, 4);
        const mountMesh = new THREE.Mesh(mountGeo, steel);
        mountMesh.position.set(Math.cos(angle)*radiusBase, -15, Math.sin(angle)*radiusBase);
        mountMesh.lookAt(0, 0, 0);
        pistonAssembly.add(mountMesh);

        // Cylinder (outer part)
        const cylGeo = new THREE.CylinderGeometry(1.5, 1.5, 20, 16);
        const cylMesh = new THREE.Mesh(cylGeo, darkSteel);
        cylMesh.position.set(Math.cos(angle)*radiusBase, -5, Math.sin(angle)*radiusBase);
        
        // Pivot cylinder towards core
        const dir = new THREE.Vector3(Math.cos(angle)*radiusCore - Math.cos(angle)*radiusBase, 20 - (-5), Math.sin(angle)*radiusCore - Math.sin(angle)*radiusBase);
        const axis = new THREE.Vector3(0, 1, 0).cross(dir).normalize();
        const angleRot = Math.acos(new THREE.Vector3(0, 1, 0).dot(dir.normalize()));
        cylMesh.quaternion.setFromAxisAngle(axis, angleRot);
        pistonAssembly.add(cylMesh);

        // Shaft (inner part) - will be animated
        const shaftGeo = new THREE.CylinderGeometry(0.8, 0.8, 25, 16);
        const shaftMesh = new THREE.Mesh(shaftGeo, chrome);
        // Positioned relative to cylinder
        cylMesh.add(shaftMesh);
        shaftMesh.position.y = 5; 
        
        meshes.pistons.push(shaftMesh);
        hydraulicsGroup.add(pistonAssembly);
    }
    addPart('Hydraulic Shatter Pistons', 'Array of 8 massive pneumatic rams.', 'steel', 'Delivers billion-ton impacts to the core to shatter encroaching spacetime ice.', 7, ['Octo-Foundation', 'Singularity Pillar'], 'Piston jams.', ['Lattice Overgrowth', 'Total Freeze'], {x:0, y:0, z:0}, {x:0, y:-30, z:50});


    // --- 5. SPACETIME CRYSTALLIZATION LATTICE (PROCEDURAL) ---
    const latticeGroup = new THREE.Group();
    group.add(latticeGroup);
    meshes.latticeNodes = [];
    meshes.latticeEdges = [];

    const gridSize = 3;
    const spacing = 15;
    
    // We create a dense 3D grid of "spacetime nodes" representing the discretized vacuum
    for(let x = -gridSize; x <= gridSize; x++) {
        for(let y = -gridSize; y <= gridSize; y++) {
            for(let z = -gridSize; z <= gridSize; z++) {
                const dist = Math.sqrt(x*x + y*y + z*z);
                if(dist > gridSize + 0.5) continue; // Roughly spherical

                const px = x * spacing;
                const py = y * spacing + 30; // Centered higher up
                const pz = z * spacing;

                // Node
                const nodeGeo = new THREE.IcosahedronGeometry(2.5, 1);
                const nodeMesh = new THREE.Mesh(nodeGeo, latticeMaterial);
                nodeMesh.position.set(px, py, pz);
                
                // Save original data for animation
                nodeMesh.userData = {
                    origScale: 0.001,
                    targetScale: 1.0,
                    phaseOffset: dist * 0.5 + Math.random(),
                    dist: dist
                };
                nodeMesh.scale.setScalar(0.001);
                
                latticeGroup.add(nodeMesh);
                meshes.latticeNodes.push(nodeMesh);

                // Edges to adjacent positive nodes to avoid double lines
                if (x < gridSize) {
                    createLatticeEdge(px, py, pz, (x+1)*spacing, py, pz);
                }
                if (y < gridSize) {
                    createLatticeEdge(px, py, pz, px, (y+1)*spacing + 30, pz);
                }
                if (z < gridSize) {
                    createLatticeEdge(px, py, pz, px, py, (z+1)*spacing);
                }
            }
        }
    }

    function createLatticeEdge(x1, y1, z1, x2, y2, z2) {
        const v1 = new THREE.Vector3(x1, y1, z1);
        const v2 = new THREE.Vector3(x2, y2, z2);
        const dist = v1.distanceTo(v2);
        
        const edgeGeo = new THREE.CylinderGeometry(0.5, 0.5, dist, 8);
        const edgeMesh = new THREE.Mesh(edgeGeo, latticeMaterial);
        
        const center = v1.clone().lerp(v2, 0.5);
        edgeMesh.position.copy(center);
        edgeMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), v2.clone().sub(v1).normalize());
        
        edgeMesh.userData = {
            origScale: 0.001,
            targetScale: 1.0,
            phaseOffset: Math.random() * 2
        };
        edgeMesh.scale.setScalar(0.001);
        
        latticeGroup.add(edgeMesh);
        meshes.latticeEdges.push(edgeMesh);
    }
    
    addPart('Spacetime Crystal Lattice', 'The frozen state of the vacuum metric tensor.', 'crystal', 'Manifestation of reduced-entropy dimensional space.', 8, ['Quantum Vacuum'], 'Uncontrolled propagation.', ['Universe Freezes Solid'], {x:0, y:30, z:0}, {x:0, y:100, z:0});


    // --- 6. OPERATOR CABIN AND CATWALKS ---
    const facilityGroup = new THREE.Group();
    baseGroup.add(facilityGroup);

    // Catwalk ring
    const catGeo = new THREE.RingGeometry(42, 48, 32);
    const catMesh = new THREE.Mesh(catGeo, steel);
    catMesh.rotation.x = -Math.PI / 2;
    catMesh.position.y = -10;
    facilityGroup.add(catMesh);

    // Railings
    for(let i=0; i<32; i++) {
        const angle = (i/32) * Math.PI * 2;
        const postGeo = new THREE.CylinderGeometry(0.2, 0.2, 4, 8);
        const postMesh = new THREE.Mesh(postGeo, aluminum);
        postMesh.position.set(Math.cos(angle)*47, -8, Math.sin(angle)*47);
        facilityGroup.add(postMesh);
    }
    const railGeo = new THREE.TorusGeometry(47, 0.2, 8, 64);
    const railMesh = new THREE.Mesh(railGeo, aluminum);
    railMesh.rotation.x = Math.PI / 2;
    railMesh.position.y = -6;
    facilityGroup.add(railMesh);

    // Suspended Operator Cabin
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, 10, 55);
    facilityGroup.add(cabinGroup);

    const cabinGeo = new THREE.BoxGeometry(10, 8, 8);
    const cabinMesh = new THREE.Mesh(cabinGeo, darkSteel);
    cabinGroup.add(cabinMesh);

    const windowGeo = new THREE.PlaneGeometry(9, 5);
    const windowMesh = new THREE.Mesh(windowGeo, tinted);
    windowMesh.position.set(0, 0.5, -4.1);
    windowMesh.rotation.y = Math.PI;
    cabinGroup.add(windowMesh);
    
    // Screens inside cabin
    const screenGeo = new THREE.PlaneGeometry(2, 1.5);
    const screen1 = new THREE.Mesh(screenGeo, neonRed);
    screen1.position.set(-2, 1, -3.5);
    screen1.rotation.y = Math.PI;
    cabinGroup.add(screen1);

    const screen2 = new THREE.Mesh(screenGeo, plasmaMaterial);
    screen2.position.set(2, 1, -3.5);
    screen2.rotation.y = Math.PI;
    cabinGroup.add(screen2);

    addPart('Observation Cabin', 'Heavily shielded operator room with tinted lead-glass.', 'darkSteel', 'Keeps operators alive during extreme temporal gradients.', 9, ['Catwalk'], 'Radiation exposure.', ['Operator Spaghettification'], {x:0, y:10, z:55}, {x:0, y:10, z:100});
    addPart('Control Catwalk', 'Maintenance access ring surrounding the primary containment.', 'steel', 'Allows manual tightening of spacetime flux bolts.', 10, ['Octo-Foundation'], 'Structural failure.', ['Fall into singularity'], {x:0, y:-10, z:0}, {x:0, y:-60, z:0});

    // --- 7. CRYOGENIC PIPING SYSTEM ---
    const pipeGroup = new THREE.Group();
    emitterGroup.add(pipeGroup);

    function createPipe(radius, offsetAngles, yStart, yEnd) {
        class PipeCurve extends THREE.Curve {
            constructor(r, ang, ys, ye) {
                super();
                this.r = r; this.ang = ang; this.ys = ys; this.ye = ye;
            }
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const y = this.ys + (this.ye - this.ys) * t;
                // Add some sinusoidal snake effect
                const currentAngle = this.ang + Math.sin(t * Math.PI * 4) * 0.5;
                const tx = Math.cos(currentAngle) * (this.r + Math.sin(t*Math.PI)*5);
                const tz = Math.sin(currentAngle) * (this.r + Math.sin(t*Math.PI)*5);
                return optionalTarget.set(tx, y, tz);
            }
        }
        
        const path = new PipeCurve(radius, offsetAngles, yStart, yEnd);
        const tubeGeo = new THREE.TubeGeometry(path, 64, 1.2, 16, false);
        return new THREE.Mesh(tubeGeo, chrome);
    }

    for(let i=0; i<6; i++) {
        const pipe = createPipe(13, (i/6)*Math.PI*2, -35, 35);
        pipeGroup.add(pipe);
    }
    
    addPart('Cryogenic He3 Pipes', 'Meandering chrome tubes injecting liquid Helium-3 into the core.', 'chrome', 'Cools the quantum singularity below absolute zero via negative enthalpy.', 11, ['Singularity Pillar'], 'Core overheat.', ['Thermal Spacetime Runaway'], {x:0, y:0, z:0}, {x:-30, y:0, z:0});

    // --- 8. GRAVITON EXHAUST STACKS ---
    for(let i=0; i<4; i++) {
        const angle = (i/4)*Math.PI*2 + Math.PI/4;
        const stackGroup = new THREE.Group();
        stackGroup.position.set(Math.cos(angle)*30, -10, Math.sin(angle)*30);
        baseGroup.add(stackGroup);

        const stackGeo = new THREE.CylinderGeometry(3, 4, 15, 16);
        const stackMesh = new THREE.Mesh(stackGeo, darkSteel);
        stackGroup.add(stackMesh);
        
        // Exhaust glow
        const exGeo = new THREE.CylinderGeometry(2.5, 2.5, 16, 16);
        const exMesh = new THREE.Mesh(exGeo, shatterMaterial);
        stackGroup.add(exMesh);
    }
    addPart('Graviton Exhaust Stacks', 'Four dark steel vents purging excess localized gravity.', 'darkSteel', 'Prevents the machine from collapsing into a black hole.', 12, ['Octo-Foundation'], 'Gravitational buildup.', ['Black Hole Formation'], {x:0, y:-10, z:0}, {x:50, y:-10, z:-50});


    // --- QUIZ QUESTIONS ---
    const quizQuestions = [
        {
            question: "In the context of Loop Quantum Gravity, what does the procedurally growing crystal lattice in this machine physically represent?",
            options: [
                "A superposition of graviton orbitals.",
                "The macroscopic emergence of a spin network.",
                "A localized false vacuum decay.",
                "The crystalline structure of solidified dark matter."
            ],
            answer: "The macroscopic emergence of a spin network.",
            explanation: "In Loop Quantum Gravity, spacetime itself is quantized into discrete loops or networks of spin. The 'crystal' lattice visualizes these discrete quantum chunks of space freezing into a fixed, rigid state rather than a dynamic fluid."
        },
        {
            question: "Why must the containment gimbals counter-rotate precisely against the crystallization field?",
            options: [
                "To generate a centrifugal force to push the crystals outward.",
                "To counteract the immense angular momentum transfer from the Lense-Thirring effect (frame-dragging) of the naked singularity.",
                "To distribute the liquid Helium-3 evenly across the core.",
                "To create a Faraday cage against hawking radiation."
            ],
            answer: "To counteract the immense angular momentum transfer from the Lense-Thirring effect (frame-dragging) of the naked singularity.",
            explanation: "A naked singularity or rapidly spinning massive core drags spacetime with it (frame-dragging). If the space around it freezes, the torque on the containment structure would be infinite unless counter-acted."
        },
        {
            question: "When the hydraulic pistons shatter the encroaching spacetime crystals, what physical consequence prevents the universe from unraveling?",
            options: [
                "The latent heat of fusion of spacetime is released as harmless gravitons via the exhaust stacks.",
                "The shattered spacetime simply turns into dark energy.",
                "The broken lattice nodes reform into standard model particles.",
                "The vibration shifts the local metric signature from Euclidean back to Lorentzian."
            ],
            answer: "The latent heat of fusion of spacetime is released as harmless gravitons via the exhaust stacks.",
            explanation: "Phase transitions in spacetime (from fluid/continuous to rigid/discrete) involve massive energy exchange. Shattering the 'ice' releases this latent energy, which must be vented as gravitons to avoid collapse."
        },
        {
            question: "The Observation Cabin uses tinted lead-glass. What specific hazard of spacetime crystallization does this mitigate?",
            options: [
                "Blinding light from sonoluminescence.",
                "Cherenkov radiation from tachyons exceeding the local speed of light in the frozen dense vacuum.",
                "Microwave background radiation amplification.",
                "Micro-meteorites trapped in the lattice."
            ],
            answer: "Cherenkov radiation from tachyons exceeding the local speed of light in the frozen dense vacuum.",
            explanation: "As the vacuum becomes a rigid, dense crystal, its refractive index for gravitational and electromagnetic waves changes, causing particles to easily exceed the local speed of light, emitting intense Cherenkov radiation."
        },
        {
            question: "If a cascade failure results in 'Operator Spaghettification', which fundamental force has overcome the machine's structural integrity?",
            options: [
                "The Strong Nuclear Force.",
                "The Weak Nuclear Force.",
                "Electromagnetism.",
                "Gravity (via extreme tidal forces)."
            ],
            answer: "Gravity (via extreme tidal forces).",
            explanation: "Spaghettification (or the noodle effect) occurs in extreme gravitational fields (like near a singularity) where the tidal forces are so immense they stretch objects into long, thin shapes."
        }
    ];

    // --- ANIMATION LOGIC ---
    let latticeGrowthPhase = 0;

    function animate(time, speed, meshesObj) {
        const dt = speed * 0.01;
        
        // 1. Rotate Emitter Core
        if (meshesObj.emitterGroup) {
            meshesObj.emitterGroup.rotation.y += 0.05 * speed;
        }

        // 2. Complex Gimbal Ring Rotation
        if (meshesObj.rings) {
            meshesObj.rings[0].rotation.x = Math.sin(time * 0.5) * Math.PI;
            meshesObj.rings[0].rotation.y = time * 0.8;
            
            meshesObj.rings[1].rotation.z = Math.cos(time * 0.3) * Math.PI;
            meshesObj.rings[1].rotation.x = -time * 0.6;
            
            meshesObj.rings[2].rotation.y = Math.sin(time * 0.7) * Math.PI;
            meshesObj.rings[2].rotation.z = time * 1.2;
        }

        // 3. Hydraulic Piston Pumping
        if (meshesObj.pistons) {
            const pumpCycle = Math.sin(time * 4) * 0.5 + 0.5; // 0 to 1
            meshesObj.pistons.forEach((piston, idx) => {
                // Stagger the pistons
                const offsetCycle = Math.sin(time * 4 + idx) * 0.5 + 0.5;
                piston.position.y = 5 + offsetCycle * 8; // move up and down
            });
        }

        // 4. Spacetime Lattice Freezing and Shattering Logic
        // The machine builds the crystal, then hits a threshold and violently shatters it
        latticeGrowthPhase = (time * 0.5) % 10; // 0 to 10 cycle
        const isShattering = latticeGrowthPhase > 9.5; // Last 0.5 seconds of cycle is shatter

        // Machine shake effect during shatter
        if (isShattering && meshesObj.emitterGroup) {
            const shakeX = (Math.random() - 0.5) * 2.0;
            const shakeZ = (Math.random() - 0.5) * 2.0;
            meshesObj.emitterGroup.position.set(shakeX, 0, shakeZ);
        } else if (meshesObj.emitterGroup) {
            meshesObj.emitterGroup.position.set(0, 0, 0); // Reset
        }

        // Update Nodes
        if (meshesObj.latticeNodes) {
            meshesObj.latticeNodes.forEach(node => {
                if (isShattering) {
                    node.scale.setScalar(0.001); // Instant collapse
                    node.material = shatterMaterial;
                } else {
                    node.material = latticeMaterial;
                    // Grow outward based on phase and distance
                    const growthRadius = latticeGrowthPhase * 5; // Expands outward
                    if (node.userData.dist < growthRadius) {
                        const target = Math.min(1.0, (growthRadius - node.userData.dist));
                        node.scale.setScalar(target);
                        // Pulse emissive
                        node.material.emissiveIntensity = 0.8 + Math.sin(time * 2 + node.userData.phaseOffset) * 0.5;
                    } else {
                        node.scale.setScalar(0.001);
                    }
                }
            });
        }

        // Update Edges
        if (meshesObj.latticeEdges) {
            meshesObj.latticeEdges.forEach(edge => {
                if (isShattering) {
                    edge.scale.setScalar(0.001);
                    edge.material = shatterMaterial;
                } else {
                    edge.material = latticeMaterial;
                    // Sync with a rough global growth radius
                    const growthRadius = latticeGrowthPhase * 5;
                    // We just use the edge's phase offset as a proxy for distance
                    if ((edge.userData.phaseOffset * 3) < growthRadius) {
                        edge.scale.setScalar(1.0);
                        edge.material.emissiveIntensity = 0.8 + Math.cos(time * 3 + edge.userData.phaseOffset) * 0.5;
                    } else {
                        edge.scale.setScalar(0.001);
                    }
                }
            });
        }
    }

    return {
        group,
        parts,
        description: "God Tier Spacetime Crystallizer. Uses a contained naked singularity and immense magnetic compression to force the vacuum fluid of spacetime into a rigid, navigable crystalline lattice. Features extreme shatter-hydraulics to prevent cascading multiversal freezing.",
        quizQuestions,
        animate
    };
}
