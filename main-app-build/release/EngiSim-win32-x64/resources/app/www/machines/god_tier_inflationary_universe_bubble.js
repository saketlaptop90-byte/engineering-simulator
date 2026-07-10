import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const description = "Ultra God Tier Inflationary Universe Bubble. A contained local false vacuum decay event undergoing exponential cosmic inflation. This hyper-advanced apparatus attempts to stabilize a newly born pocket universe using macro-scale multidimensional containment rings, slow-roll scalar field dampeners, and quantum fluctuation suppressors. Watch as the universe expands, transitions through reheating, baryogenesis, and structure formation, while the containment facility groans under the impossible stress of a growing cosmos.";

    const quizQuestions = [
        {
            question: "In single-field slow-roll inflation, the Lyth bound imposes a significant constraint on model building. What physical insight does the Lyth bound provide regarding observable primordial gravitational waves?",
            options: [
                "It proves that primordial non-Gaussianities (f_NL) must vanish if the universe is closed.",
                "It establishes that an observably large tensor-to-scalar ratio (r > 0.01) requires the inflaton field to undergo a super-Planckian excursion (Δφ > M_pl).",
                "It dictates that the reheating temperature must be strictly below the Grand Unified Theory (GUT) scale.",
                "It requires the spectral index (n_s) to be exactly 1.0, leading to a perfectly scale-invariant Harrison-Zel'dovich spectrum."
            ],
            correctAnswer: 1,
            explanation: "The Lyth bound connects the tensor-to-scalar ratio (which measures primordial gravitational waves) to the evolution of the inflaton field. A measurable tensor-to-scalar ratio implies that the inflaton field must have varied by an amount larger than the reduced Planck mass during the observable e-folds of inflation, strongly constraining low-energy string theory models of inflation."
        },
        {
            question: "During the 'preheating' phase immediately following inflation, energy is transferred from the inflaton field to Standard Model particles. What non-perturbative mechanism is primarily responsible for the rapid explosive particle production during preheating?",
            options: [
                "Hawking radiation from primordial black holes.",
                "Perturbative decay of the inflaton mediated by tree-level Feynman diagrams.",
                "Parametric resonance, where quantum fields coupled to the oscillating inflaton experience Bose enhancement.",
                "Sphaleron transitions leading to the violation of baryon number."
            ],
            correctAnswer: 2,
            explanation: "Preheating is driven by parametric resonance. As the inflaton field oscillates at the bottom of its potential, fields coupled to it experience a periodically varying effective mass. This leads to an exponential, non-perturbative amplification of quantum fluctuations (Bose enhancement for bosons), rapidly draining energy from the inflaton before standard perturbative decay takes over."
        },
        {
            question: "According to the Maldacena consistency relation for single-field inflation, the squeezed limit of the primordial bispectrum (measuring local-type non-Gaussianity) is determined by which fundamental observable?",
            options: [
                "The tensor-to-scalar ratio (r).",
                "The running of the spectral index (alpha_s).",
                "The scalar spectral index tilt (n_s - 1).",
                "The amplitude of the primordial power spectrum (A_s)."
            ],
            correctAnswer: 2,
            explanation: "The Maldacena consistency relation states that in single-field slow-roll inflation, the local non-Gaussianity parameter f_NL in the squeezed limit is proportional to the deviation of the spectral index from scale invariance: f_NL = (5/12)(1 - n_s). This acts as a powerful 'no-go' theorem: any detection of significant local non-Gaussianity would immediately falsify all standard single-field models."
        },
        {
            question: "In the context of eternal inflation, how is the transition from a higher energy false vacuum to a lower energy true vacuum typically mediated?",
            options: [
                "Through the nucleation of bubbles via Coleman-De Luccia instantons.",
                "By continuous deterministic rolling down a highly steep tachyonic potential.",
                "Via the catastrophic collapse of the metric into a localized singularity.",
                "Through inverse Compton scattering of the cosmic microwave background."
            ],
            correctAnswer: 0,
            explanation: "False vacuum decay is a quantum tunneling process described semiclassically by Coleman-De Luccia instantons. It proceeds via the random nucleation of true vacuum bubbles within the false vacuum. If the background expansion of the false vacuum is faster than the bubble growth rate, the inflation becomes 'eternal', constantly generating new universe bubbles (the multiverse)."
        },
        {
            question: "What is the primary significance of 'isocurvature perturbations' in distinguishing between different models of the early universe?",
            options: [
                "They only arise in purely matter-dominated universes.",
                "They represent fluctuations in the relative particle ratios (entropy) rather than total energy density, and their presence would indicate multi-field inflation or topological defects.",
                "They are the direct cause of the late-time accelerated expansion (dark energy).",
                "They are required to explain the observed baryon asymmetry of the universe (baryogenesis)."
            ],
            correctAnswer: 1,
            explanation: "Adiabatic perturbations represent fluctuations in the total energy density (with relative particle ratios fixed), which single-field inflation naturally produces. Isocurvature perturbations are fluctuations in the composition (e.g., photon to dark matter ratio) with constant total energy density. Their detection would strongly rule out standard single-field inflation and point towards multi-field models, axions, or cosmic strings."
        }
    ];

    // --- Custom Materials ---
    const bubbleMat = new THREE.MeshPhysicalMaterial({
        color: 0x112244,
        emissive: 0x4466aa,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.6,
        transmission: 0.95,
        roughness: 0.05,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        ior: 1.2,
        side: THREE.DoubleSide
    });

    const cmbMat = new THREE.MeshStandardMaterial({
        color: 0xff6600,
        emissive: 0xff3300,
        emissiveIntensity: 0.0,
        wireframe: true,
        transparent: true,
        opacity: 0.0
    });

    const singularityMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 10.0,
        roughness: 0.0
    });

    const containmentGlowMat = new THREE.MeshStandardMaterial({
        color: 0xff2222,
        emissive: 0xff0000,
        emissiveIntensity: 1.0,
        metalness: 0.8,
        roughness: 0.2
    });

    const heatSinkMat = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        metalness: 0.9,
        roughness: 0.6,
        emissive: 0x000000
    });

    const plasmaMat = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
    });

    const ringMat = new THREE.MeshStandardMaterial({
        color: 0x333333,
        metalness: 1.0,
        roughness: 0.4,
        emissive: 0x000000,
        envMapIntensity: 2.0
    });

    // --- Extrude Shapes ---
    function createHeatSinkShape() {
        const shape = new THREE.Shape();
        const numFins = 36;
        const innerRad = 10;
        const outerRad = 14;
        const finWidth = 0.2;
        
        for (let i = 0; i < numFins; i++) {
            const angle1 = (i / numFins) * Math.PI * 2;
            const angle2 = ((i + finWidth) / numFins) * Math.PI * 2;
            const angle3 = ((i + 0.5 - finWidth) / numFins) * Math.PI * 2;
            const angle4 = ((i + 0.5) / numFins) * Math.PI * 2;

            if (i === 0) {
                shape.moveTo(Math.cos(angle1) * innerRad, Math.sin(angle1) * innerRad);
            } else {
                shape.lineTo(Math.cos(angle1) * innerRad, Math.sin(angle1) * innerRad);
            }
            shape.lineTo(Math.cos(angle2) * outerRad, Math.sin(angle2) * outerRad);
            shape.lineTo(Math.cos(angle3) * outerRad, Math.sin(angle3) * outerRad);
            shape.lineTo(Math.cos(angle4) * innerRad, Math.sin(angle4) * innerRad);
        }
        shape.closePath();
        return shape;
    }

    function createContainmentClawShape() {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(2, 5);
        shape.quadraticCurveTo(4, 10, 8, 12);
        shape.lineTo(10, 12);
        shape.quadraticCurveTo(5, 9, 3, 4);
        shape.lineTo(2, 0);
        shape.closePath();
        return shape;
    }

    // --- Complex Lathe Profiles ---
    function generateBaseProfile() {
        const pts = [];
        for (let i = 0; i <= 100; i++) {
            let t = i / 100;
            let y = -50 + t * 40;
            let r = 80 - t * 40 + Math.sin(t * Math.PI * 20) * 2;
            // Add technological terracing
            if (i % 10 < 5) r -= 1.5;
            pts.push(new THREE.Vector2(r, y));
        }
        return pts;
    }

    // --- Mesh Generation ---
    
    // 1. The Grand Base
    const baseGeo = new THREE.LatheGeometry(generateBaseProfile(), 256);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    group.add(baseMesh);
    parts.push({
        name: "Grand Unified Base Platform",
        description: "The primary anchor securing the localized false vacuum decay experiment to Earth's spacetime manifold.",
        material: "darkSteel",
        function: "Absorbs excess gravitational waves and prevents the experiment from instantly collapsing into a black hole.",
        assemblyOrder: 1,
        connections: ["Containment Rings", "Hydraulic Dampeners"],
        failureEffect: "Earth is spaghettified.",
        cascadeFailures: ["Entire Facility"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -100, z: 0}
    });

    // 2. Extruded Base Heat Sinks
    const extrudeSettings = { depth: 10, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.5, bevelThickness: 0.5 };
    const heatSinkGeo = new THREE.ExtrudeGeometry(createHeatSinkShape(), extrudeSettings);
    
    for (let i = 0; i < 4; i++) {
        const hsMesh = new THREE.Mesh(heatSinkGeo, heatSinkMat);
        hsMesh.rotation.x = Math.PI / 2;
        hsMesh.position.set(Math.cos(i * Math.PI/2) * 50, -20, Math.sin(i * Math.PI/2) * 50);
        hsMesh.lookAt(0, -20, 0);
        group.add(hsMesh);
        
        parts.push({
            name: `Entropy Radiator Sector ${i+1}`,
            description: "Massive extruded heat sinks designed to bleed off the excess entropy generated during the early universe's reheating phase.",
            material: "heatSinkMat",
            function: "Prevents the containment vessel from melting due to Hawking radiation and thermal plasma leakage.",
            assemblyOrder: 2,
            connections: ["Grand Unified Base Platform"],
            failureEffect: "Thermal runaway melting the lab.",
            cascadeFailures: ["Containment Rings"],
            originalPosition: {x: hsMesh.position.x, y: hsMesh.position.y, z: hsMesh.position.z},
            explodedPosition: {x: hsMesh.position.x * 2, y: hsMesh.position.y - 20, z: hsMesh.position.z * 2}
        });
    }

    // 3. Containment Rings (Gimbal System)
    const ringMeshes = [];
    const ringRadii = [35, 42, 50];
    const ringNames = ["Inner Inflaton Barrier", "Middle Baryogenesis Shroud", "Outer Dark Energy Restrictor"];
    
    for (let i = 0; i < 3; i++) {
        const torusGeo = new THREE.TorusGeometry(ringRadii[i], 3, 64, 256);
        const torusMesh = new THREE.Mesh(torusGeo, ringMat);
        const ringGroup = new THREE.Group();
        ringGroup.add(torusMesh);
        
        // Add intricate technological details to rings
        for (let j = 0; j < 12; j++) {
            const detailGeo = new THREE.BoxGeometry(4, 4, 8);
            const detailMesh = new THREE.Mesh(detailGeo, chrome);
            const angle = (j / 12) * Math.PI * 2;
            detailMesh.position.set(Math.cos(angle) * ringRadii[i], Math.sin(angle) * ringRadii[i], 0);
            detailMesh.rotation.z = angle;
            ringGroup.add(detailMesh);
            
            // Add Glowing emitters
            const emitGeo = new THREE.SphereGeometry(1.5, 16, 16);
            const emitMesh = new THREE.Mesh(emitGeo, containmentGlowMat);
            emitMesh.position.set(Math.cos(angle) * ringRadii[i], Math.sin(angle) * ringRadii[i], 3.5);
            ringGroup.add(emitMesh);
        }

        ringGroup.position.y = 20;
        group.add(ringGroup);
        ringMeshes.push(ringGroup);

        parts.push({
            name: ringNames[i],
            description: `Ring ${i+1} of the multidimensional containment gimbal. Operates using high-frequency tensor fields.`,
            material: "ringMat, chrome, containmentGlowMat",
            function: "Fights the exponential expansion of the metric tensor within the bubble.",
            assemblyOrder: 3 + i,
            connections: ["Base", "Other Rings"],
            failureEffect: "Bubble metric expands into host metric.",
            cascadeFailures: ["Reality"],
            originalPosition: {x: 0, y: 20, z: 0},
            explodedPosition: {x: 0, y: 20 + i * 30, z: 0}
        });
    }

    // 4. The Inflationary Bubble & Singularity
    const bubbleCoreGroup = new THREE.Group();
    bubbleCoreGroup.position.y = 20;
    
    const singularityMesh = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 32), singularityMat);
    bubbleCoreGroup.add(singularityMesh);
    
    const universeBubbleMesh = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), bubbleMat);
    bubbleCoreGroup.add(universeBubbleMesh);

    const cmbMesh = new THREE.Mesh(new THREE.SphereGeometry(0.95, 64, 64), cmbMat);
    bubbleCoreGroup.add(cmbMesh);

    group.add(bubbleCoreGroup);

    parts.push({
        name: "Primordial Singularity Seed",
        description: "An artificially induced point of infinite density and zero volume, perturbed to initiate false vacuum decay.",
        material: "singularityMat",
        function: "Acts as the inception point for the new cosmic spacetime manifold.",
        assemblyOrder: 6,
        connections: ["Universe Bubble"],
        failureEffect: "Evaporates immediately via Hawking radiation.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 20, z: 0},
        explodedPosition: {x: 0, y: 20, z: -100}
    });

    parts.push({
        name: "Expanding Pocket Universe",
        description: "The rapidly expanding bubble of new spacetime. Contains its own physical laws determined by the stabilization of the scalar field.",
        material: "bubbleMat",
        function: "Houses the newly forming galaxies and acts as a barrier between the new vacuum and the lab.",
        assemblyOrder: 7,
        connections: ["Containment Rings"],
        failureEffect: "Total existential erasure.",
        cascadeFailures: ["Everything"],
        originalPosition: {x: 0, y: 20, z: 0},
        explodedPosition: {x: 0, y: 20, z: 100}
    });

    // 5. Galaxy Instanced Mesh (10,000 tiny galaxies)
    const galaxyCount = 10000;
    const galGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.05, 12);
    const galMat = new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.0 });
    const galaxyInstanced = new THREE.InstancedMesh(galGeo, galMat, galaxyCount);
    
    const dummy = new THREE.Object3D();
    const galaxyData = [];

    for (let i = 0; i < galaxyCount; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const r = Math.cbrt(Math.random()) * 0.9;

        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        dummy.position.set(x, y, z);
        dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        const s = Math.random() * 0.5 + 0.1;
        dummy.scale.set(s, 1, s);

        dummy.updateMatrix();
        galaxyInstanced.setMatrixAt(i, dummy.matrix);
        
        galaxyData.push({ x, y, z, r, theta, phi, s });
    }
    
    bubbleCoreGroup.add(galaxyInstanced);
    
    parts.push({
        name: "Laniakea Supercluster Analogue",
        description: "A simulated instantiation of dark matter halos and baryonic gas forming into 10,000 distinct galaxies.",
        material: "galMat",
        function: "Fills the universe with matter following the inflationary epoch.",
        assemblyOrder: 8,
        connections: ["Expanding Pocket Universe"],
        failureEffect: "Universe remains an empty void.",
        cascadeFailures: ["Life"],
        originalPosition: {x: 0, y: 20, z: 0},
        explodedPosition: {x: 0, y: 150, z: 0}
    });

    // 6. Complex Hydraulic Dampeners
    const dampeners = [];
    const numDampeners = 8;
    const dampGroup = new THREE.Group();
    
    for (let i = 0; i < numDampeners; i++) {
        const angle = (i / numDampeners) * Math.PI * 2;
        const radius = 60;
        
        const cylGeo = new THREE.CylinderGeometry(2, 2, 30, 32);
        const cylMesh = new THREE.Mesh(cylGeo, steel);
        
        const pistonGeo = new THREE.CylinderGeometry(1, 1, 40, 32);
        const pistonMesh = new THREE.Mesh(pistonGeo, chrome);
        pistonMesh.position.y = 15;
        
        const singleDampGroup = new THREE.Group();
        singleDampGroup.add(cylMesh);
        singleDampGroup.add(pistonMesh);
        
        singleDampGroup.position.set(Math.cos(angle) * radius, -5, Math.sin(angle) * radius);
        singleDampGroup.lookAt(0, 20, 0);
        singleDampGroup.rotateX(Math.PI / 2);
        
        dampGroup.add(singleDampGroup);
        dampeners.push(pistonMesh);

        parts.push({
            name: `Quantum Fluctuation Dampener ${i+1}`,
            description: "Heavy-duty hydraulic pistons driven by dark energy to counteract the physical expansion force of the bubble.",
            material: "steel, chrome",
            function: "Maintains mechanical pressure on the containment rings.",
            assemblyOrder: 9 + i,
            connections: ["Base", "Containment Rings"],
            failureEffect: "Containment rings shatter.",
            cascadeFailures: ["Containment Rings", "Base"],
            originalPosition: {x: singleDampGroup.position.x, y: singleDampGroup.position.y, z: singleDampGroup.position.z},
            explodedPosition: {x: singleDampGroup.position.x * 1.5, y: -40, z: singleDampGroup.position.z * 1.5}
        });
    }
    group.add(dampGroup);

    // 7. Intricate Cooling Pipes (TubeGeometry)
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0x884400, metalness: 0.9, roughness: 0.3 }); 
    for (let i = 0; i < 20; i++) {
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(Math.cos(i) * 20, -10, Math.sin(i) * 20),
            new THREE.Vector3(Math.cos(i+1) * 30, 0, Math.sin(i+1) * 30),
            new THREE.Vector3(Math.cos(i+2) * 25, 10, Math.sin(i+2) * 25),
            new THREE.Vector3(Math.cos(i+3) * 35, 15, Math.sin(i+3) * 35)
        ]);
        const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.5, 16, false);
        const tubeMesh = new THREE.Mesh(tubeGeo, pipeMat);
        group.add(tubeMesh);
    }
    
    parts.push({
        name: "Liquid Helium Cryogenic Network",
        description: "Intricate array of copper tubing wrapping the base, pumping near-absolute-zero liquid helium.",
        material: "copper",
        function: "Cools the superconducting electromagnets in the base to prevent quenching.",
        assemblyOrder: 20,
        connections: ["Base", "Magnetic Coils"],
        failureEffect: "Magnet quench, explosion.",
        cascadeFailures: ["Magnetic Coils"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -60, z: 0}
    });

    // 8. Containment Claws
    const clawExtrudeSettings = { depth: 2, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.2, bevelThickness: 0.2 };
    const clawGeo = new THREE.ExtrudeGeometry(createContainmentClawShape(), clawExtrudeSettings);
    const clawMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.5 });
    
    for (let i = 0; i < 6; i++) {
        const clawMesh = new THREE.Mesh(clawGeo, clawMat);
        const angle = (i / 6) * Math.PI * 2;
        clawMesh.position.set(Math.cos(angle) * 45, 20, Math.sin(angle) * 45);
        clawMesh.lookAt(0, 20, 0);
        group.add(clawMesh);
    }

    parts.push({
        name: "Spacetime Anchor Claws",
        description: "Six massive extruded claws that physically grip the outer manifold of the pocket universe.",
        material: "darkSteel",
        function: "Applies negative pressure to the expanding vacuum.",
        assemblyOrder: 21,
        connections: ["Outer Dark Energy Restrictor", "Expanding Pocket Universe"],
        failureEffect: "Universe slips out of containment.",
        cascadeFailures: ["Containment Rings"],
        originalPosition: {x: 0, y: 20, z: 0},
        explodedPosition: {x: 0, y: 80, z: 0}
    });

    // --- State Machine & Animation Logic ---
    
    let simTime = 0;
    let universePhase = 'SINGULARITY';
    let baseScale = 0.01;
    let currentScale = baseScale;
    let phaseTimer = 0;

    const animate = function(time, speed, meshes) {
        simTime += speed * 0.01;
        phaseTimer += speed * 0.01;
        
        ringMeshes[0].rotation.x += 0.02 * speed;
        ringMeshes[0].rotation.y += 0.01 * speed;
        ringMeshes[1].rotation.y -= 0.015 * speed;
        ringMeshes[1].rotation.z += 0.01 * speed;
        ringMeshes[2].rotation.x -= 0.01 * speed;
        ringMeshes[2].rotation.z -= 0.02 * speed;

        const pistonExtend = Math.sin(simTime * 5) * 5 + 5;
        dampeners.forEach(piston => {
            piston.position.y = 15 + pistonExtend;
        });
        
        if (universePhase === 'SINGULARITY') {
            singularityMesh.scale.set(1, 1, 1);
            singularityMesh.material.emissiveIntensity = 10 + Math.sin(simTime * 20) * 5;
            universeBubbleMesh.scale.set(0.01, 0.01, 0.01);
            cmbMesh.scale.set(0.01, 0.01, 0.01);
            galMat.opacity = 0;
            ringMat.emissive.setHex(0x000000);
            
            if (phaseTimer > 50) {
                universePhase = 'INFLATION';
                phaseTimer = 0;
            }
        } 
        else if (universePhase === 'INFLATION') {
            currentScale *= (1 + 0.05 * speed);
            if (currentScale > 20) currentScale = 20;
            
            universeBubbleMesh.scale.set(currentScale, currentScale, currentScale);
            universeBubbleMesh.material.color.setHex(0xffffff);
            universeBubbleMesh.material.opacity = 1.0;
            singularityMesh.scale.set(0.001, 0.001, 0.001);

            ringMeshes.forEach(r => {
                r.position.x = (Math.random() - 0.5) * 0.5;
                r.position.y = 20 + (Math.random() - 0.5) * 0.5;
                r.position.z = (Math.random() - 0.5) * 0.5;
            });
            containmentGlowMat.emissiveIntensity = 5;

            if (phaseTimer > 30) {
                universePhase = 'REHEATING';
                phaseTimer = 0;
            }
        }
        else if (universePhase === 'REHEATING') {
            universeBubbleMesh.material.color.setHex(0xffaa00);
            universeBubbleMesh.material.opacity = Math.max(0.6, 1.0 - phaseTimer * 0.01);
            cmbMesh.scale.set(currentScale * 0.95, currentScale * 0.95, currentScale * 0.95);
            cmbMat.opacity = Math.min(0.5, phaseTimer * 0.02);
            cmbMat.emissiveIntensity = 2.0;

            if (phaseTimer > 40) {
                universePhase = 'CMB';
                phaseTimer = 0;
            }
        }
        else if (universePhase === 'CMB') {
            currentScale += 0.05 * speed;
            if (currentScale > 25) currentScale = 25;
            universeBubbleMesh.scale.set(currentScale, currentScale, currentScale);
            universeBubbleMesh.material.color.setHex(0x112244);
            universeBubbleMesh.material.opacity = Math.max(0.2, 0.6 - phaseTimer * 0.01);
            cmbMat.opacity = Math.max(0.0, 0.5 - phaseTimer * 0.01);

            if (phaseTimer > 40) {
                universePhase = 'GALAXIES';
                phaseTimer = 0;
            }
        }
        else if (universePhase === 'GALAXIES') {
            currentScale += 0.02 * speed;
            if (currentScale > 28) currentScale = 28;
            universeBubbleMesh.scale.set(currentScale, currentScale, currentScale);
            galMat.opacity = Math.min(1.0, phaseTimer * 0.05);
            
            const galScale = currentScale;
            for (let i = 0; i < galaxyCount; i++) {
                const data = galaxyData[i];
                const rExp = data.r * galScale;
                const x = rExp * Math.sin(data.phi) * Math.cos(data.theta);
                const y = rExp * Math.sin(data.phi) * Math.sin(data.theta);
                const z = rExp * Math.cos(data.phi);
                
                dummy.position.set(x, y, z);
                dummy.rotation.x += 0.01 * speed * (i%3===0?1:-1);
                dummy.rotation.y += 0.01 * speed * (i%2===0?1:-1);
                dummy.scale.set(data.s, 1, data.s);
                dummy.updateMatrix();
                galaxyInstanced.setMatrixAt(i, dummy.matrix);
            }
            galaxyInstanced.instanceMatrix.needsUpdate = true;

            ringMeshes.forEach(r => {
                r.position.set(0, 20, 0);
            });
            containmentGlowMat.emissive.setHex(0x00ff00);

            if (phaseTimer > 60) {
                universePhase = 'CRISIS';
                phaseTimer = 0;
            }
        }
        else if (universePhase === 'CRISIS') {
            currentScale += (0.05 + phaseTimer * 0.01) * speed;
            universeBubbleMesh.scale.set(currentScale, currentScale, currentScale);
            
            const galScale = currentScale;
            for (let i = 0; i < galaxyCount; i++) {
                const data = galaxyData[i];
                const rExp = data.r * galScale;
                dummy.position.set(
                    rExp * Math.sin(data.phi) * Math.cos(data.theta),
                    rExp * Math.sin(data.phi) * Math.sin(data.theta),
                    rExp * Math.cos(data.phi)
                );
                dummy.updateMatrix();
                galaxyInstanced.setMatrixAt(i, dummy.matrix);
            }
            galaxyInstanced.instanceMatrix.needsUpdate = true;

            const shake = phaseTimer * 0.1;
            ringMeshes.forEach(r => {
                r.position.x = (Math.random() - 0.5) * shake;
                r.position.y = 20 + (Math.random() - 0.5) * shake;
                r.position.z = (Math.random() - 0.5) * shake;
            });
            baseMesh.position.x = (Math.random() - 0.5) * shake * 0.2;
            baseMesh.position.z = (Math.random() - 0.5) * shake * 0.2;

            ringMat.emissive.setHex(0xffaa00);
            ringMat.emissiveIntensity = phaseTimer * 0.5;
            containmentGlowMat.emissive.setHex(0xff0000);
            
            dampeners.forEach(piston => {
                piston.position.y = 15 + Math.sin(simTime * 20) * 10;
            });

            if (phaseTimer > 30 || currentScale > 45) {
                universePhase = 'RESET';
                phaseTimer = 0;
            }
        }
        else if (universePhase === 'RESET') {
            currentScale -= 2.0 * speed;
            if (currentScale < baseScale) {
                currentScale = baseScale;
                universePhase = 'SINGULARITY';
                phaseTimer = 0;
                baseMesh.position.set(0,0,0);
                ringMeshes.forEach(r => r.position.set(0,20,0));
                ringMat.emissive.setHex(0x000000);
            }
            universeBubbleMesh.scale.set(currentScale, currentScale, currentScale);
            
            for (let i = 0; i < galaxyCount; i++) {
                dummy.scale.set(0,0,0);
                dummy.updateMatrix();
                galaxyInstanced.setMatrixAt(i, dummy.matrix);
            }
            galaxyInstanced.instanceMatrix.needsUpdate = true;
        }
    };

    return { group, parts, description, quizQuestions, animate };
}
