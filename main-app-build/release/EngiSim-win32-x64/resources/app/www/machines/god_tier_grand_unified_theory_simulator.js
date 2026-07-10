import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const description = "God Tier Grand Unified Theory (GUT) Simulator. A colossal macroscopic containment construct designed to recreate the extreme high-energy densities of the early universe, artificially bridging the spontaneous symmetry breaking to unify the strong, weak, and electromagnetic fundamental forces into a single Electronuclear force. Features ultra-high-temperature plasma converging fields, macroscopic gluon flux tubes, oscillating W/Z boson decay manifolds, and synchronized U(1) hypercharge sine wave emitters.";

    const quizQuestions = [
        {
            question: "In the minimal SU(5) Grand Unified Theory, proton decay is primarily mediated by which hypothetical gauge bosons?",
            options: ["W and Z bosons", "X and Y bosons", "Gluons", "Leptoquarks of SO(10)"],
            answer: "X and Y bosons",
            explanation: "SU(5) GUT introduces supermassive X and Y gauge bosons (carrying both color and electroweak charges) that couple quarks to leptons, facilitating proton decay."
        },
        {
            question: "What is the primary reason the non-supersymmetric minimal SU(5) GUT is considered ruled out by precision experimental data?",
            options: ["It predicts magnetic monopoles which have not been observed", "The three gauge coupling constants do not perfectly intersect at a single energy scale", "It cannot explain neutrino mass oscillations", "It fundamentally violates Lorentz invariance"],
            answer: "The three gauge coupling constants do not perfectly intersect at a single energy scale",
            explanation: "Precision measurements of the strong, weak, and electromagnetic couplings at the LEP collider showed they do not converge at a single unified point without adding new physics like supersymmetry."
        },
        {
            question: "In an SO(10) Grand Unified Theory, a single generation of standard model fermions (including a right-handed neutrino) perfectly fits into which representation?",
            options: ["10-dimensional fundamental representation", "16-dimensional spinor representation", "24-dimensional adjoint representation", "126-dimensional tensor representation"],
            answer: "16-dimensional spinor representation",
            explanation: "SO(10) elegantly unifies all 15 known standard model fermions of a single generation, plus a right-handed neutrino (for seesaw mass mechanisms), into a single unified 16-dimensional spinor representation."
        },
        {
            question: "Which of the following theoretical challenges severely plagues Grand Unified Theories where the Higgs mechanism must operate at two vastly different mass scales (GUT and electroweak)?",
            options: ["The Strong CP Problem", "The Hierarchy Problem", "The Flavor Problem", "The Horizon Problem"],
            answer: "The Hierarchy Problem",
            explanation: "The hierarchy problem is the immense difficulty (requiring extreme fine-tuning) in keeping the electroweak scale (~10^2 GeV) distinct and stable against massive quantum corrections from the GUT scale (~10^16 GeV)."
        },
        {
            question: "The hypothetical convergence of the strong (SU(3)), weak (SU(2)), and hypercharge (U(1)) running coupling constants occurs at approximately what extreme energy scale?",
            options: ["10^3 GeV", "10^11 GeV", "10^16 GeV", "10^19 GeV"],
            answer: "10^16 GeV",
            explanation: "The GUT scale, where the extrapolated gauge couplings appear to converge (especially in the MSSM), is typically around 10^16 GeV, significantly below the Planck scale (10^19 GeV) where quantum gravity dominates."
        }
    ];

    // Cloned & Custom Emissive Materials
    const strongGlow = new THREE.MeshStandardMaterial({ color: 0xff0044, emissive: 0xff0022, emissiveIntensity: 2.5, transparent: true, opacity: 0.85, wireframe: false });
    const strongWire = new THREE.MeshStandardMaterial({ color: 0xff1111, emissive: 0xff0000, emissiveIntensity: 4.0, wireframe: true });
    
    const weakGlow = new THREE.MeshStandardMaterial({ color: 0x88ff00, emissive: 0x55ff00, emissiveIntensity: 1.8, transparent: true, opacity: 0.75 });
    const weakParticle = new THREE.MeshStandardMaterial({ color: 0xbbff55, emissive: 0xaaff00, emissiveIntensity: 3.0 });
    const weakDecayGlow = new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0xffcc00, emissiveIntensity: 2.0, transparent: true, opacity: 0.5 });

    const emGlow = new THREE.MeshStandardMaterial({ color: 0x00aaff, emissive: 0x0055ff, emissiveIntensity: 3.5, transparent: true, opacity: 0.8 });
    const emWave = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 5.0, wireframe: true });
    const emPhoton = new THREE.MeshStandardMaterial({ color: 0x88ffff, emissive: 0x88ffff, emissiveIntensity: 6.0 });

    const unifiedGlow = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 8.0, transparent: true, opacity: 0.95 });
    const unifiedCore = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffeeff, emissiveIntensity: 12.0 });
    const pureEnergy = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 15.0, wireframe: true });

    // Animation Registries
    const strongNodes = [];
    const strongGluonTubes = [];
    const weakBosons = [];
    const weakDecayRings = [];
    const emOscillators = [];
    const emWaves = [];
    const unifiedBeams = [];
    const chamberRotors = [];
    const hydraulicPistons = [];
    const floatingPanels = [];
    const corePulsars = [];

    // Helper Functions
    function createLathe(pointsArray, segments, material) {
        const points = pointsArray.map(p => new THREE.Vector2(p[0], p[1]));
        const geom = new THREE.LatheGeometry(points, segments);
        return new THREE.Mesh(geom, material);
    }

    function addPartToSystem(mesh, name, desc, materialName, func, order, connections, failEffect, cascadeFailures, explodeMultiplier = 2.0) {
        const orig = mesh.position.clone();
        mesh.userData = {
            name, description: desc, material: materialName, function: func,
            assemblyOrder: order, connections, failureEffect: failEffect,
            cascadeFailures: cascadeFailures, originalPosition: orig,
            explodedPosition: { x: orig.x * explodeMultiplier, y: orig.y * explodeMultiplier, z: orig.z * explodeMultiplier }
        };
        group.add(mesh);
        parts.push(mesh.userData);
    }

    function createGear(teeth, outerRadius, innerRadius, holeRadius, depth, material) {
        const shape = new THREE.Shape();
        shape.moveTo(holeRadius, 0);
        shape.absarc(0, 0, holeRadius, 0, Math.PI * 2, false);
        
        const gearShape = new THREE.Shape();
        const step = (Math.PI * 2) / teeth;
        for (let i = 0; i < teeth; i++) {
            const angle = i * step;
            const nextAngle = (i + 1) * step;
            const midAngle1 = angle + step * 0.25;
            const midAngle2 = angle + step * 0.75;
            if (i === 0) gearShape.moveTo(Math.cos(angle) * innerRadius, Math.sin(angle) * innerRadius);
            else gearShape.lineTo(Math.cos(angle) * innerRadius, Math.sin(angle) * innerRadius);
            gearShape.lineTo(Math.cos(midAngle1) * outerRadius, Math.sin(midAngle1) * outerRadius);
            gearShape.lineTo(Math.cos(midAngle2) * outerRadius, Math.sin(midAngle2) * outerRadius);
            gearShape.lineTo(Math.cos(nextAngle) * innerRadius, Math.sin(nextAngle) * innerRadius);
        }
        gearShape.holes.push(shape);
        const extrudeSettings = { depth: depth, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.5, bevelThickness: 0.5 };
        const geom = new THREE.ExtrudeGeometry(gearShape, extrudeSettings);
        const mesh = new THREE.Mesh(geom, material);
        mesh.geometry.center();
        return mesh;
    }

    // ---------------------------------------------------------
    // 1. CENTRAL CONVERGENCE CHAMBER & UNIFIED CORE
    // ---------------------------------------------------------
    
    // Core Plasma Containment Sphere
    const coreGeom = new THREE.SphereGeometry(15, 64, 64);
    const coreSphere = new THREE.Mesh(coreGeom, tinted);
    coreSphere.position.set(0, 0, 0);
    addPartToSystem(coreSphere, "Symmetry Breaking Convergence Core", "The ultra-high-temperature central vacuum chamber where spontaneous symmetry breaking is reversed.", "Tinted Glass", "Contains the extreme energy densities required for GUT scale unification.", 1, ["Unified Beam Extractors", "Injector Manifolds"], "Massive catastrophic vacuum decay.", ["Total System Annihilation", "Spacetime Rupture"], 1.5);
    
    // Inner Unified Singularity
    const singGeom = new THREE.SphereGeometry(6, 32, 32);
    const singularity = new THREE.Mesh(singGeom, unifiedCore);
    coreSphere.add(singularity);
    corePulsars.push(singularity);

    // Containment Chamber Exoskeleton (Lathe)
    const exoPoints = [
        [16, -20], [22, -15], [25, -10], [26, 0], [25, 10], [22, 15], [16, 20]
    ];
    const exoskeleton = createLathe(exoPoints, 64, darkSteel);
    addPartToSystem(exoskeleton, "Chamber Exoskeleton Armor", "Reinforced dark steel confinement lattice.", "Dark Steel", "Prevents macroscopic fracture of the containment sphere.", 2, ["Convergence Core"], "Structural breach.", ["Core Rupture"], 1.3);

    // Giant Toroidal Superconducting Magnets
    for (let i = 0; i < 3; i++) {
        const torusG = new THREE.TorusGeometry(28 + i*4, 1.5, 32, 100);
        const magnet = new THREE.Mesh(torusG, copper);
        magnet.rotation.x = Math.PI / 2;
        magnet.position.y = (i - 1) * 12;
        addPartToSystem(magnet, `Poloidal Superconducting Magnet Coil ${i+1}`, "Generates extreme magnetic fields for plasma shaping.", "Copper", "Confines the unified plasma.", 3, ["Exoskeleton"], "Plasma leak.", ["Thermal Meltdown"], 1.4);
        chamberRotors.push({ mesh: magnet, speed: (i%2===0 ? 1 : -1) * 0.05 });
    }

    // Unified Beam Extractors (Top and Bottom)
    for (let sign of [1, -1]) {
        const extractorGeom = new THREE.CylinderGeometry(8, 20, 30, 32, 1, true);
        const extractor = new THREE.Mesh(extractorGeom, steel);
        extractor.position.y = sign * 35;
        addPartToSystem(extractor, `Unified Electronuclear Beam Extractor (${sign > 0 ? 'Top' : 'Bottom'})`, "Channels the unified force out of the core.", "Steel", "Directs unified force for analysis.", 4, ["Convergence Core"], "Beam misalignment.", ["Facility Destruction"], 1.8);
        
        const beamG = new THREE.CylinderGeometry(5, 5, 200, 32, 1, false);
        const beam = new THREE.Mesh(beamG, pureEnergy);
        beam.position.y = sign * 135;
        group.add(beam);
        unifiedBeams.push(beam);
        
        // Massive stabilization rings on extractors
        for (let r = 0; r < 5; r++) {
            const ring = new THREE.Mesh(new THREE.TorusGeometry(12, 1, 16, 64), chrome);
            ring.position.y = sign * 35 + (r - 2) * 5;
            ring.rotation.x = Math.PI / 2;
            group.add(ring);
            chamberRotors.push({ mesh: ring, speed: sign * 0.1 + (r * 0.02) });
        }
    }

    // ---------------------------------------------------------
    // 2. THE STRONG FORCE INJECTOR (SU(3) Color Dynamics)
    // ---------------------------------------------------------
    const strongGroup = new THREE.Group();
    strongGroup.position.set(-80, 0, 0);

    const strongHousingG = new THREE.CylinderGeometry(15, 25, 80, 32);
    const strongHousing = new THREE.Mesh(strongHousingG, darkSteel);
    strongHousing.rotation.z = Math.PI / 2;
    addPartToSystem(strongHousing, "SU(3) Color Confinement Housing", "Heavy duty chamber handling extreme strong force gluon coupling.", "Dark Steel", "Channels color-charged quarks and gluons.", 5, ["Convergence Core"], "Gluon flux tube snapping.", ["Hadronic Jet Explosion"], 2.0);
    strongGroup.add(strongHousing);
    
    // Gluon Flux Tubes
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const tubePath = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-40, Math.cos(angle)*10, Math.sin(angle)*10),
            new THREE.Vector3(-20, Math.cos(angle)*18, Math.sin(angle)*18),
            new THREE.Vector3(0, Math.cos(angle)*10, Math.sin(angle)*10),
            new THREE.Vector3(40, 0, 0)
        ]);
        const tubeG = new THREE.TubeGeometry(tubePath, 64, 1.5, 8, false);
        const tube = new THREE.Mesh(tubeG, strongWire);
        strongGroup.add(tube);
        strongGluonTubes.push({ mesh: tube, phase: i });
    }

    // Quark/Gluon Nodes
    for(let i=0; i<30; i++) {
        const node = new THREE.Mesh(new THREE.DodecahedronGeometry(2), strongGlow);
        node.position.set((Math.random() - 0.5) * 60, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20);
        strongGroup.add(node);
        strongNodes.push({ mesh: node, seed: Math.random() * 100 });
    }
    
    // Massive gears for strong force tuning
    const sg1 = createGear(24, 25, 20, 10, 4, steel);
    sg1.position.set(-30, 0, 0);
    sg1.rotation.y = Math.PI / 2;
    strongGroup.add(sg1);
    chamberRotors.push({ mesh: sg1, speed: 0.02 });
    
    group.add(strongGroup);

    // ---------------------------------------------------------
    // 3. THE WEAK FORCE INJECTOR (SU(2) Isospin Decay Manifold)
    // ---------------------------------------------------------
    const weakGroup = new THREE.Group();
    weakGroup.position.set(40, 0, 69.28);
    weakGroup.rotation.y = Math.PI / 3 + Math.PI/2; 
    
    const weakHousingG = new THREE.BoxGeometry(30, 30, 80);
    const weakHousing = new THREE.Mesh(weakHousingG, aluminum);
    weakHousing.rotation.x = Math.PI; 
    addPartToSystem(weakHousing, "SU(2) Left-Handed Isospin Manifold", "Manages the parity-violating chiral weak interactions.", "Aluminum", "Injects W and Z bosons.", 6, ["Convergence Core"], "Uncontrolled beta decay.", ["Radiation Leak", "Isotope Contamination"], 2.0);
    weakGroup.add(weakHousing);
    
    // Weak Decay Rings
    for (let i = 0; i < 12; i++) {
        const ringG = new THREE.TorusGeometry(18 + Math.sin(i)*3, 2, 16, 64);
        const ring = new THREE.Mesh(ringG, weakDecayGlow);
        ring.position.z = -30 + i * 6;
        weakGroup.add(ring);
        weakDecayRings.push({ mesh: ring, offset: i * 0.5 });
    }

    // W/Z Boson Particles
    for(let i = 0; i < 40; i++) {
        const boson = new THREE.Mesh(new THREE.IcosahedronGeometry(1.5), weakParticle);
        boson.position.set((Math.random() - 0.5)*20, (Math.random() - 0.5)*20, (Math.random() - 0.5)*70);
        weakGroup.add(boson);
        weakBosons.push({ mesh: boson, life: Math.random(), posBase: boson.position.clone() });
    }
    
    group.add(weakGroup);

    // ---------------------------------------------------------
    // 4. THE ELECTROMAGNETIC INJECTOR (U(1) Hypercharge Emitter)
    // ---------------------------------------------------------
    const emGroup = new THREE.Group();
    emGroup.position.set(40, 0, -69.28);
    emGroup.rotation.y = -Math.PI / 3 - Math.PI/2;
    
    const emHousingG = new THREE.CylinderGeometry(15, 15, 80, 16);
    const emHousing = new THREE.Mesh(emHousingG, plastic); 
    emHousing.rotation.x = Math.PI / 2;
    addPartToSystem(emHousing, "U(1) Hypercharge Oscillator", "Generates coherent high-frequency hypercharge waves.", "Synthetic Polymer", "Provides unbroken U(1) symmetry injection.", 7, ["Convergence Core"], "Photonic overload.", ["Electromagnetic Pulse"], 2.0);
    emGroup.add(emHousing);

    // Orthogonal EM Sine Waves
    const waveCount = 100;
    const waveLength = 80;
    for (let w = 0; w < 2; w++) {
        const waveGeom = new THREE.BufferGeometry();
        const positions = new Float32Array(waveCount * 3);
        waveGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const waveLine = new THREE.Line(waveGeom, w === 0 ? emWave : emPhoton);
        emGroup.add(waveLine);
        emWaves.push({ line: waveLine, plane: w, length: waveLength, count: waveCount });
    }

    // EM Resonator Disks
    for(let i=0; i<8; i++) {
        const disk = new THREE.Mesh(new THREE.CylinderGeometry(18, 18, 1, 32), chrome);
        disk.rotation.x = Math.PI/2;
        disk.position.z = -35 + i * 10;
        emGroup.add(disk);
        emOscillators.push({ mesh: disk, phase: i });
    }

    group.add(emGroup);

    // ---------------------------------------------------------
    // 5. DIAGNOSTICS, HYDRAULICS, AND COOLING INFRASTRUCTURE
    // ---------------------------------------------------------
    // Hydraulic Pistons connecting Exoskeleton to Injectors
    function createPiston(startPoint, endPoint) {
        const pGroup = new THREE.Group();
        const distance = startPoint.distanceTo(endPoint);
        const midPoint = new THREE.Vector3().addVectors(startPoint, endPoint).multiplyScalar(0.5);
        pGroup.position.copy(midPoint);
        pGroup.lookAt(endPoint);
        
        const outer = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, distance * 0.6, 16), steel);
        outer.rotation.x = Math.PI / 2;
        outer.position.z = -distance * 0.2;
        
        const inner = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, distance * 0.6, 16), chrome);
        inner.rotation.x = Math.PI / 2;
        inner.position.z = distance * 0.2;
        
        pGroup.add(outer);
        pGroup.add(inner);
        
        hydraulicPistons.push({ group: pGroup, inner: inner, baseZ: distance * 0.2, amp: distance * 0.1 });
        return pGroup;
    }

    const strutPositions = [
        [new THREE.Vector3(-20, 20, 0), new THREE.Vector3(-60, 40, 0)],
        [new THREE.Vector3(10, 20, 17.32), new THREE.Vector3(30, 40, 51.96)],
        [new THREE.Vector3(10, 20, -17.32), new THREE.Vector3(30, 40, -51.96)]
    ];

    strutPositions.forEach((pts, i) => {
        const p = createPiston(pts[0], pts[1]);
        addPartToSystem(p, `Vibration Dampening Hydraulic Strut ${i+1}`, "Maintains geometric stability of injectors during unification tremors.", "Steel & Chrome", "Absorbs macroscopic quantum fluctuations.", 8, ["Exoskeleton", "Injectors"], "Strut failure.", ["Alignment Drift"], 1.5);
    });

    // Control Panels and Holographic Displays
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const panel = new THREE.Mesh(new THREE.BoxGeometry(10, 15, 0.5), darkSteel);
        panel.position.set(Math.cos(angle) * 50, -25, Math.sin(angle) * 50);
        panel.lookAt(0, -25, 0);
        
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(8, 12), emGlow);
        screen.position.z = 0.3;
        panel.add(screen);
        
        floatingPanels.push({ mesh: panel, origY: -25, seed: i });
        addPartToSystem(panel, `GUT Scale Diagnostic Terminal ${i+1}`, "Interfaces with localized field sensors to monitor gauge symmetries.", "Dark Steel & Glass", "Provides telemetry data.", 9, ["Facility Network"], "Data loss.", ["Monitoring Blindspot"], 1.1);
    }

    // Cooling Towers (Bottom)
    for(let i=0; i<4; i++) {
        const tower = new THREE.Mesh(new THREE.CylinderGeometry(8, 12, 40, 16), steel);
        tower.position.set((i%2===0?1:-1)*30, -50, (i<2?1:-1)*30);
        
        for(let f=0; f<10; f++) {
            const fin = new THREE.Mesh(new THREE.CylinderGeometry(13, 13, 0.5, 16), aluminum);
            fin.position.y = -15 + f * 3;
            tower.add(fin);
        }
        
        addPartToSystem(tower, `Cryogenic Heat Sink Tower ${i+1}`, "Dissipates massive thermal energy from the confinement process.", "Steel & Aluminum", "Maintains superconductor temperatures.", 10, ["Poloidal Magnets"], "Thermal overload.", ["Quench", "Magnet Explosion"], 1.2);
    }

    // Extreme Detailing: Hundreds of rivets/bolts around the exoskeleton
    const rivetGeom = new THREE.SphereGeometry(0.5, 8, 8);
    const rivetMaterial = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.8, roughness: 0.2 });
    for (let r = 0; r < 200; r++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI - Math.PI/2;
        const radius = 26.5; 
        const x = radius * Math.cos(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi);
        const z = radius * Math.cos(phi) * Math.sin(theta);
        if (Math.abs(y) < 15) { 
            const rivet = new THREE.Mesh(rivetGeom, rivetMaterial);
            rivet.position.set(x, y, z);
            group.add(rivet);
        }
    }

    // ---------------------------------------------------------
    // ANIMATION LOGIC
    // ---------------------------------------------------------
    function animate(time, speed, meshes) {
        const t = time * speed;

        // 1. Core Pulsars
        corePulsars.forEach(core => {
            const scale = 1.0 + Math.sin(t * 10) * 0.1;
            core.scale.set(scale, scale, scale);
            core.material.emissiveIntensity = 8.0 + Math.sin(t * 15) * 4.0;
        });

        // 2. Chamber Rotors (Magnets, stabilization rings, gears)
        chamberRotors.forEach(r => {
            if (r.mesh.geometry.type === 'TorusGeometry') {
                r.mesh.rotation.z += r.speed * speed;
            } else if (r.mesh.geometry.type === 'ExtrudeGeometry') {
                r.mesh.rotation.z += r.speed * speed; 
            }
        });

        // 3. Unified Beams
        unifiedBeams.forEach(beam => {
            beam.rotation.y += 0.1 * speed;
            beam.scale.x = 1.0 + Math.sin(t * 20) * 0.2;
            beam.scale.z = 1.0 + Math.cos(t * 20) * 0.2;
        });

        // 4. Strong Force Injector
        strongNodes.forEach(node => {
            const phase = t * 5 + node.seed;
            const r = 10 + Math.sin(phase * 0.3) * 5;
            node.mesh.position.y = Math.sin(phase) * r;
            node.mesh.position.z = Math.cos(phase * 1.3) * r;
            node.mesh.position.x = (Math.sin(phase * 0.7) * 30); 
        });
        strongGluonTubes.forEach(tube => {
            tube.mesh.material.emissiveIntensity = 2.0 + Math.sin(t * 8 + tube.phase) * 2.0;
        });

        // 5. Weak Force Injector
        weakBosons.forEach(boson => {
            boson.life -= 0.02 * speed;
            if (boson.life <= 0) {
                boson.life = 1.0;
                boson.mesh.position.copy(boson.posBase);
            }
            boson.mesh.position.x += (Math.random() - 0.5) * 2;
            boson.mesh.position.y += (Math.random() - 0.5) * 2;
            boson.mesh.position.z -= 1.5 * speed; 
            
            const scale = boson.life * 2;
            boson.mesh.scale.set(scale, scale, scale);
        });
        weakDecayRings.forEach(ring => {
            const s = 1.0 + Math.sin(t * 3 + ring.offset) * 0.15;
            ring.mesh.scale.set(s, s, s);
            ring.mesh.material.opacity = 0.3 + Math.sin(t * 5 + ring.offset) * 0.3;
        });

        // 6. EM Force Injector
        emOscillators.forEach(osc => {
            osc.mesh.scale.x = 1.0 + Math.sin(t * 10 + osc.phase) * 0.1;
            osc.mesh.scale.z = 1.0 + Math.sin(t * 10 + osc.phase) * 0.1;
        });
        emWaves.forEach(wave => {
            const positions = wave.line.geometry.attributes.position.array;
            for (let i = 0; i < wave.count; i++) {
                const px = (i / wave.count) * wave.length - wave.length/2;
                const phase = px * 0.2 - t * 15;
                let py = 0, pz = 0;
                if (wave.plane === 0) {
                    py = Math.sin(phase) * 8;
                } else {
                    pz = Math.sin(phase) * 8;
                }
                positions[i*3] = px; 
                positions[i*3+1] = py;
                positions[i*3+2] = pz;
            }
            wave.line.geometry.attributes.position.needsUpdate = true;
        });

        // 7. Mechanicals
        hydraulicPistons.forEach(p => {
            p.inner.position.z = p.baseZ + Math.sin(t * 4) * p.amp;
        });

        floatingPanels.forEach(panel => {
            panel.mesh.position.y = panel.origY + Math.sin(t * 2 + panel.seed) * 2;
            panel.mesh.lookAt(0, -25 + Math.sin(t * 2 + panel.seed)*2, 0);
        });
    }

    return { group, parts, description, quizQuestions, animate };
}
