import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();

    // ==========================================
    // CUSTOM ADVANCED MATERIALS
    // ==========================================
    const quantumGlow = new THREE.MeshStandardMaterial({
        color: 0x00f0ff,
        emissive: 0x0088ff,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.8,
        wireframe: false
    });

    const spinUpMaterial = new THREE.MeshStandardMaterial({
        color: 0xff3300,
        emissive: 0x881100,
        emissiveIntensity: 1.0,
        metalness: 0.8,
        roughness: 0.2
    });

    const spinDownMaterial = new THREE.MeshStandardMaterial({
        color: 0x0033ff,
        emissive: 0x001188,
        emissiveIntensity: 1.0,
        metalness: 0.8,
        roughness: 0.2
    });

    const barrierMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.9,
        opacity: 1,
        metalness: 0.1,
        roughness: 0.05,
        ior: 1.5,
        thickness: 0.5,
        specularIntensity: 2.0,
        emissive: 0x222233,
        emissiveIntensity: 0.2
    });

    const superconductorMaterial = new THREE.MeshStandardMaterial({
        color: 0xaaaaaa,
        emissive: 0x002244,
        emissiveIntensity: 0.8,
        metalness: 1.0,
        roughness: 0.3,
        wireframe: true
    });

    const screenMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0x00ff00,
        emissiveIntensity: 1.2,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
    });

    // ==========================================
    // UTILITY FUNCTIONS
    // ==========================================
    function addRivets(parent, radius, y, count, mat) {
        const rivetGeom = new THREE.SphereGeometry(0.08, 8, 8);
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const rivet = new THREE.Mesh(rivetGeom, mat);
            rivet.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
            parent.add(rivet);
        }
    }

    class HelicalCurve extends THREE.Curve {
        constructor(radius, height, turns) {
            super();
            this.radius = radius;
            this.height = height;
            this.turns = turns;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const angle = t * Math.PI * 2 * this.turns;
            const x = this.radius * Math.cos(angle);
            const z = this.radius * Math.sin(angle);
            const y = (t - 0.5) * this.height;
            return optionalTarget.set(x, y, z);
        }
    }

    function createSpinArrow(mat, scale = 1.0) {
        const arrowGroup = new THREE.Group();
        const cylGeom = new THREE.CylinderGeometry(0.05 * scale, 0.05 * scale, 0.6 * scale, 12);
        const cyl = new THREE.Mesh(cylGeom, mat);
        cyl.position.y = 0.3 * scale;
        cyl.castShadow = true;
        
        const coneGeom = new THREE.ConeGeometry(0.15 * scale, 0.3 * scale, 12);
        const cone = new THREE.Mesh(coneGeom, mat);
        cone.position.y = 0.6 * scale + 0.15 * scale;
        cone.castShadow = true;

        arrowGroup.add(cyl, cone);
        // Center the pivot
        arrowGroup.position.y = -0.45 * scale;
        
        const wrapper = new THREE.Group();
        wrapper.add(arrowGroup);
        return wrapper;
    }

    // ==========================================
    // PART GENERATION & ASSEMBLY
    // ==========================================
    
    // 1. Chamber Base (LatheGeometry)
    const chamberBaseGroup = new THREE.Group();
    const basePoints = [];
    for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        basePoints.push(new THREE.Vector2(
            6 + Math.sin(t * Math.PI) * 1.5 + (i % 2 === 0 ? 0.2 : 0), 
            t * 4 - 2
        ));
    }
    const baseGeom = new THREE.LatheGeometry(basePoints, 64);
    const chamberBase = new THREE.Mesh(baseGeom, darkSteel);
    chamberBase.position.y = -6;
    chamberBase.receiveShadow = true;
    chamberBase.castShadow = true;
    addRivets(chamberBase, 6.2, 1.8, 36, chrome);
    addRivets(chamberBase, 6.8, -1.8, 48, chrome);
    chamberBaseGroup.add(chamberBase);
    group.add(chamberBaseGroup);

    // 2. Hydraulic Dampers
    const damperGroup = new THREE.Group();
    const pistonRods = [];
    for(let i=0; i<6; i++) {
        const angle = (i/6) * Math.PI * 2;
        const radius = 5.5;
        
        const housing = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 4, 16), steel);
        housing.position.set(Math.cos(angle) * radius, -9, Math.sin(angle) * radius);
        housing.castShadow = true;
        
        const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 5, 16), chrome);
        rod.position.set(Math.cos(angle) * radius, -6.5, Math.sin(angle) * radius);
        pistonRods.push(rod);

        const jointGeom = new THREE.SphereGeometry(0.6, 16, 16);
        const joint = new THREE.Mesh(jointGeom, darkSteel);
        joint.position.set(0, 2.5, 0);
        rod.add(joint);
        
        damperGroup.add(housing, rod);
    }
    group.add(damperGroup);

    // 3. Bottom Electrode (Thick Extruded Star/Gear Shape)
    const electrodeGroup = new THREE.Group();
    const electrodeShape = new THREE.Shape();
    const outerRadius = 4;
    const innerRadius = 3.5;
    for (let i = 0; i < 24; i++) {
        const angle = (i / 24) * Math.PI * 2;
        const r = (i % 2 === 0) ? outerRadius : innerRadius;
        if (i === 0) electrodeShape.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
        else electrodeShape.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
    }
    electrodeShape.closePath();
    const electrodeExtrudeSettings = { depth: 1, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };
    const bottomElectrode = new THREE.Mesh(new THREE.ExtrudeGeometry(electrodeShape, electrodeExtrudeSettings), copper);
    bottomElectrode.rotation.x = Math.PI / 2;
    bottomElectrode.position.y = -3;
    bottomElectrode.castShadow = true;
    electrodeGroup.add(bottomElectrode);
    group.add(electrodeGroup);

    // 4. Polarization Filter (Micro-grid)
    const filterGroup = new THREE.Group();
    const filterGeom = new THREE.BoxGeometry(7, 0.2, 7, 14, 1, 14);
    const filterMesh = new THREE.Mesh(filterGeom, superconductorMaterial);
    filterMesh.position.y = -2.8;
    filterGroup.add(filterMesh);
    group.add(filterGroup);

    // 5. Pinned Magnetic Layer (Ferromagnet 1)
    const pinnedGroup = new THREE.Group();
    const layerGeom = new THREE.CylinderGeometry(3.5, 3.5, 0.8, 32);
    const pinnedLayerBase = new THREE.Mesh(layerGeom, steel);
    pinnedLayerBase.position.y = -2.2;
    pinnedGroup.add(pinnedLayerBase);

    // Grid of fixed spins
    for (let x = -2; x <= 2; x++) {
        for (let z = -2; z <= 2; z++) {
            if (x*x + z*z > 6) continue;
            const spin = createSpinArrow(spinUpMaterial, 0.8);
            spin.position.set(x * 0.8, -1.8, z * 0.8);
            // Pinned spins point right (X-axis)
            spin.rotation.z = -Math.PI / 2;
            pinnedGroup.add(spin);
        }
    }
    group.add(pinnedGroup);

    // 6. Ultra-thin Tunnel Barrier (MgO Lattice)
    const barrierGroup = new THREE.Group();
    const barrierBase = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.6, 0.6, 32), barrierMaterial);
    barrierBase.position.y = -1.5;
    barrierGroup.add(barrierBase);

    // Molecular lattice representing the MgO structure
    const atomGeom = new THREE.SphereGeometry(0.08, 12, 12);
    const bondGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8);
    bondGeom.rotateX(Math.PI / 2);
    const mgoLattice = new THREE.Group();
    for (let x = -3; x <= 3; x++) {
        for (let y = 0; y <= 1; y++) {
            for (let z = -3; z <= 3; z++) {
                if (x*x + z*z > 8) continue;
                const isMg = (Math.abs(x) + Math.abs(y) + Math.abs(z)) % 2 === 0;
                const mat = isMg ? new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x004400 }) 
                                 : new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0x440000 });
                const atom = new THREE.Mesh(atomGeom, mat);
                atom.position.set(x * 0.5, y * 0.4 - 1.7, z * 0.5);
                mgoLattice.add(atom);
            }
        }
    }
    barrierGroup.add(mgoLattice);
    group.add(barrierGroup);

    // 7. Free Magnetic Layer (Ferromagnet 2)
    const freeGroup = new THREE.Group();
    const freeLayerBase = new THREE.Mesh(layerGeom, steel);
    freeLayerBase.position.y = -0.8;
    freeGroup.add(freeLayerBase);

    // Grid of dynamic spins (these will rotate during animation)
    const dynamicSpins = [];
    for (let x = -2; x <= 2; x++) {
        for (let z = -2; z <= 2; z++) {
            if (x*x + z*z > 6) continue;
            const spin = createSpinArrow(spinDownMaterial, 0.8);
            spin.position.set(x * 0.8, -0.4, z * 0.8);
            // Initially point left (anti-parallel)
            spin.rotation.z = Math.PI / 2;
            freeGroup.add(spin);
            dynamicSpins.push({
                mesh: spin,
                baseX: spin.rotation.x,
                baseY: spin.rotation.y,
                baseZ: spin.rotation.z,
                offsetX: Math.random(),
                offsetZ: Math.random()
            });
        }
    }
    group.add(freeGroup);

    // 8. Top Electrode
    const topElectrodeGroup = new THREE.Group();
    const topElectrode = new THREE.Mesh(new THREE.ExtrudeGeometry(electrodeShape, electrodeExtrudeSettings), copper);
    topElectrode.rotation.x = Math.PI / 2;
    topElectrode.position.y = 1; // It extrudes downwards technically because of rotation
    topElectrode.castShadow = true;
    topElectrodeGroup.add(topElectrode);
    group.add(topElectrodeGroup);

    // 9. STT (Spin-Transfer Torque) Emitter Ring
    const sttGroup = new THREE.Group();
    const sttTorus = new THREE.Mesh(new THREE.TorusGeometry(4.2, 0.4, 16, 64), darkSteel);
    sttTorus.rotation.x = Math.PI / 2;
    sttTorus.position.y = -0.8; // Align with free layer
    sttGroup.add(sttTorus);

    const sttEmitters = [];
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const emitter = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.2, 1.2, 16), chrome);
        emitter.position.set(Math.cos(angle) * 3.8, -0.8, Math.sin(angle) * 3.8);
        emitter.rotation.z = Math.PI / 2;
        emitter.rotation.y = -angle; 
        sttGroup.add(emitter);
        
        const glowTip = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), quantumGlow);
        glowTip.position.set(0, -0.6, 0);
        emitter.add(glowTip);
        sttEmitters.push(emitter);
    }
    group.add(sttGroup);

    // 10. Electromagnetic Coils (Outer Field Control)
    const coilsGroup = new THREE.Group();
    const coilIntensityMaterials = [];
    for (let c = 0; c < 4; c++) {
        const angle = (c / 4) * Math.PI * 2;
        const coilMat = quantumGlow.clone();
        coilIntensityMaterials.push(coilMat);
        
        const helicalCurve = new HelicalCurve(1.5, 8, 20);
        const coilGeom = new THREE.TubeGeometry(helicalCurve, 200, 0.15, 8, false);
        const coilMesh = new THREE.Mesh(coilGeom, coilMat);
        
        const coilCore = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 8.5, 32), darkSteel);
        coilCore.add(coilMesh);
        
        coilCore.position.set(Math.cos(angle) * 7.5, -1.5, Math.sin(angle) * 7.5);
        coilsGroup.add(coilCore);
    }
    group.add(coilsGroup);

    // 11. Flux Return Yoke (Heavy Brackets)
    const yokeGroup = new THREE.Group();
    const yokeShape = new THREE.Shape();
    yokeShape.moveTo(0, 0);
    yokeShape.lineTo(2, 0);
    yokeShape.lineTo(2, 10);
    yokeShape.lineTo(4, 10);
    yokeShape.lineTo(4, 12);
    yokeShape.lineTo(-1, 12);
    yokeShape.lineTo(-1, 0);
    const yokeExtrude = { depth: 1.5, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.1, bevelThickness: 0.1 };
    for (let c = 0; c < 4; c++) {
        const angle = (c / 4) * Math.PI * 2 + Math.PI/4;
        const yoke = new THREE.Mesh(new THREE.ExtrudeGeometry(yokeShape, yokeExtrude), steel);
        yoke.position.set(Math.cos(angle) * 6, -6, Math.sin(angle) * 6);
        yoke.rotation.y = -angle;
        addRivets(yoke, 0, 0, 0, darkSteel); // just dummy usage, manually add
        for(let ry = 1; ry < 11; ry+=2) {
            const rivet = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8,8), chrome);
            rivet.position.set(1, ry, 1.5);
            yoke.add(rivet);
        }
        yokeGroup.add(yoke);
    }
    group.add(yokeGroup);

    // 12. Cryogenic Cooling Pipes
    const cryoGroup = new THREE.Group();
    class PipeCurve extends THREE.Curve {
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const angle = t * Math.PI * 4;
            const radius = 4.5 + Math.sin(t * Math.PI * 8) * 0.5;
            const y = (t * 8) - 5;
            return optionalTarget.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
        }
    }
    const pipeGeom = new THREE.TubeGeometry(new PipeCurve(), 100, 0.25, 12, false);
    const cryoMat = new THREE.MeshStandardMaterial({ color: 0xccffff, metalness: 0.5, roughness: 0.1, envMapIntensity: 1.5 });
    const cryoPipe1 = new THREE.Mesh(pipeGeom, cryoMat);
    const cryoPipe2 = new THREE.Mesh(pipeGeom, cryoMat);
    cryoPipe2.rotation.y = Math.PI;
    cryoGroup.add(cryoPipe1, cryoPipe2);
    group.add(cryoGroup);

    // 13. Superconducting Interconnects (Arching wires)
    const wiresGroup = new THREE.Group();
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const curve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(Math.cos(angle) * 4, 1.2, Math.sin(angle) * 4),
            new THREE.Vector3(Math.cos(angle) * 6, 4, Math.sin(angle) * 6),
            new THREE.Vector3(Math.cos(angle) * 8, 2, Math.sin(angle) * 8)
        );
        const wireGeom = new THREE.TubeGeometry(curve, 20, 0.1, 8, false);
        const wire = new THREE.Mesh(wireGeom, copper);
        wiresGroup.add(wire);
    }
    group.add(wiresGroup);

    // 14. Quantum State Detectors (Robotic Arms)
    const detectorGroup = new THREE.Group();
    const detectorArms = [];
    for (let i = 0; i < 3; i++) {
        const angle = (i / 3) * Math.PI * 2;
        const arm = new THREE.Group();
        
        const base = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), steel);
        base.position.set(Math.cos(angle) * 6.5, -0.8, Math.sin(angle) * 6.5);
        arm.add(base);
        
        const link1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3, 16), darkSteel);
        link1.rotation.x = Math.PI / 2;
        link1.position.set(Math.cos(angle) * 5, -0.8, Math.sin(angle) * 5);
        link1.lookAt(0, -0.8, 0);
        arm.add(link1);
        
        const sensorHead = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), glass);
        sensorHead.position.set(Math.cos(angle) * 3.5, -0.8, Math.sin(angle) * 3.5);
        arm.add(sensorHead);
        
        detectorArms.push({ arm, startAngle: angle });
        detectorGroup.add(arm);
    }
    group.add(detectorGroup);

    // 15. Tunneling Electron Cloud (Particle System)
    const electronsGroup = new THREE.Group();
    const electronGeom = new THREE.SphereGeometry(0.04, 8, 8);
    const electrons = [];
    for (let i = 0; i < 150; i++) {
        const el = new THREE.Mesh(electronGeom, quantumGlow);
        el.position.set(
            (Math.random() - 0.5) * 6,
            -2.5 + Math.random() * 3,
            (Math.random() - 0.5) * 6
        );
        electronsGroup.add(el);
        electrons.push({
            mesh: el,
            speedY: 0.02 + Math.random() * 0.05,
            freqX: Math.random() * 0.1,
            freqZ: Math.random() * 0.1,
            phaseX: Math.random() * Math.PI * 2,
            phaseZ: Math.random() * Math.PI * 2,
            baseX: el.position.x,
            baseZ: el.position.z
        });
    }
    group.add(electronsGroup);

    // 16. Vacuum Shielding
    const shieldGroup = new THREE.Group();
    const shieldGeom = new THREE.CylinderGeometry(5.2, 5.2, 7, 12, 1, true);
    const shield = new THREE.Mesh(shieldGeom, tinted);
    shield.position.y = -1.5;
    
    // Shield frame
    const frameGeom = new THREE.CylinderGeometry(5.3, 5.3, 7.2, 12, 1, true);
    const frame = new THREE.Mesh(frameGeom, new THREE.MeshStandardMaterial({ color: 0x222222, wireframe: true, wireframeLinewidth: 3 }));
    frame.position.y = -1.5;
    
    shieldGroup.add(shield, frame);
    group.add(shieldGroup);

    // 17. Diagnostic Console
    const consoleGroup = new THREE.Group();
    const screenGeom = new THREE.PlaneGeometry(3, 2);
    for (let i = 0; i < 3; i++) {
        const angle = (i / 3) * Math.PI * 2 + Math.PI/6;
        const screen = new THREE.Mesh(screenGeom, screenMaterial);
        screen.position.set(Math.cos(angle) * 7.5, 2, Math.sin(angle) * 7.5);
        screen.lookAt(Math.cos(angle) * 10, 2, Math.sin(angle) * 10); // Face outward
        
        // Add some "data" to screen
        const dataGraph = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 1.5), new THREE.MeshBasicMaterial({ color: 0x005500, wireframe: true }));
        dataGraph.position.z = 0.05;
        screen.add(dataGraph);
        
        consoleGroup.add(screen);
    }
    group.add(consoleGroup);

    // 18. Power Distribution Ring
    const powerRingGroup = new THREE.Group();
    const powerRing = new THREE.Mesh(new THREE.TorusGeometry(8.5, 0.3, 16, 64), copper);
    powerRing.rotation.x = Math.PI / 2;
    powerRing.position.y = -6;
    powerRingGroup.add(powerRing);
    
    for(let i=0; i<8; i++) {
        const angle = (i/8)*Math.PI*2;
        const node = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), quantumGlow);
        node.position.set(Math.cos(angle)*8.5, -6, Math.sin(angle)*8.5);
        powerRingGroup.add(node);
    }
    group.add(powerRingGroup);


    // ==========================================
    // PARTS METADATA
    // ==========================================
    const parts = [
        {
            name: "Chamber Base",
            description: "Massive lathed foundational structure housing the vibration-isolated vacuum environment necessary for nanoscale spintronic operations. Contains heavy riveted plating for high pressure containment.",
            material: "darkSteel, chrome rivets",
            function: "Structural support and vacuum sealing.",
            assemblyOrder: 1,
            connections: ["Hydraulic Dampers", "Power Distribution Ring", "Flux Return Yoke"],
            failureEffect: "Vacuum leak, resulting in decoherence of electron spins and immediate thermal oxidation of the delicate MgO barrier.",
            cascadeFailures: ["Tunnel Barrier", "Quantum State Detectors"],
            originalPosition: { x: 0, y: -6, z: 0 },
            explodedPosition: { x: 0, y: -12, z: 0 }
        },
        {
            name: "Hydraulic Dampers",
            description: "Six heavy-duty multi-stage pneumatic pistons that isolate the MTJ stack from external seismic and acoustic vibrations, critical for maintaining the sub-nanometer stability required for quantum tunneling.",
            material: "steel, chrome",
            function: "Vibration isolation and structural leveling.",
            assemblyOrder: 2,
            connections: ["Chamber Base"],
            failureEffect: "Nanoscale vibrations disrupt the tunnel probability amplitude, causing massive noise in the TMR (Tunneling Magnetoresistance) readouts.",
            cascadeFailures: ["Quantum State Detectors"],
            originalPosition: { x: 0, y: -9, z: 0 },
            explodedPosition: { x: 0, y: -18, z: 0 }
        },
        {
            name: "Bottom Electrode",
            description: "Extruded copper star-shaped macro-contact that interfaces with the nanoscale pinned layer. It distributes the injected current uniformly across the junction to prevent localized thermal runaway.",
            material: "copper",
            function: "Uniform electron injection and thermal dissipation.",
            assemblyOrder: 3,
            connections: ["Polarization Filter", "Superconducting Interconnects"],
            failureEffect: "Uneven current distribution causing localized heating and electromigration, eventually destroying the MTJ stack.",
            cascadeFailures: ["Pinned Magnetic Layer", "Tunnel Barrier"],
            originalPosition: { x: 0, y: -3, z: 0 },
            explodedPosition: { x: 0, y: -8, z: 0 }
        },
        {
            name: "Polarization Filter",
            description: "A superconducting micro-grid that pre-filters the injected electrons, ensuring that only electrons with spins aligned to the pinned layer enter the tunneling regime. Reduces spin-scattering noise.",
            material: "superconductor",
            function: "Enhances initial spin polarization efficiency.",
            assemblyOrder: 4,
            connections: ["Bottom Electrode", "Pinned Magnetic Layer"],
            failureEffect: "Decreased spin-injection efficiency, reducing the overall Magnetoresistance ratio (MR).",
            cascadeFailures: [],
            originalPosition: { x: 0, y: -2.8, z: 0 },
            explodedPosition: { x: 0, y: -6, z: 0 }
        },
        {
            name: "Pinned Magnetic Layer",
            description: "The reference ferromagnet in the MTJ. Its magnetization vector is rigidly fixed (pinned) by exchange bias from an adjacent antiferromagnetic layer. Act as the spin polarizer for tunneling electrons.",
            material: "steel, spinUpMaterial",
            function: "Provides a fixed reference spin orientation for the tunneling electrons.",
            assemblyOrder: 5,
            connections: ["Polarization Filter", "Tunnel Barrier"],
            failureEffect: "Loss of exchange bias causes the pinned layer to fluctuate, entirely destroying the binary resistance states of the device.",
            cascadeFailures: ["Free Magnetic Layer", "Quantum State Detectors"],
            originalPosition: { x: 0, y: -2.2, z: 0 },
            explodedPosition: { x: 0, y: -4, z: 0 }
        },
        {
            name: "Ultra-thin Tunnel Barrier (MgO)",
            description: "A highly crystalline Magnesium Oxide (MgO) lattice measuring only a few atomic layers thick. It acts as an insulating barrier that electrons can only cross via quantum mechanical tunneling.",
            material: "barrierMaterial, quantumGlow",
            function: "Facilitates spin-dependent quantum tunneling (coherent tunneling), generating the massive Tunneling Magnetoresistance (TMR) effect.",
            assemblyOrder: 6,
            connections: ["Pinned Magnetic Layer", "Free Magnetic Layer"],
            failureEffect: "Dielectric breakdown (pinhole formation) causes a short circuit, completely destroying the tunneling effect and rendering the device into a simple ohmic resistor.",
            cascadeFailures: ["Free Magnetic Layer"],
            originalPosition: { x: 0, y: -1.5, z: 0 },
            explodedPosition: { x: 0, y: 0, z: 0 }
        },
        {
            name: "Free Magnetic Layer",
            description: "The active ferromagnetic layer whose magnetization vector can be freely flipped (parallel or anti-parallel to the pinned layer) via external magnetic fields or Spin-Transfer Torque (STT).",
            material: "steel, spinDownMaterial",
            function: "Stores the binary state (0 or 1) based on its spin orientation relative to the pinned layer.",
            assemblyOrder: 7,
            connections: ["Tunnel Barrier", "Top Electrode", "STT Emitter Ring"],
            failureEffect: "Superparamagnetic limit reached; the layer loses thermal stability and spontaneously flips states, corrupting stored data.",
            cascadeFailures: ["Quantum State Detectors"],
            originalPosition: { x: 0, y: -0.8, z: 0 },
            explodedPosition: { x: 0, y: 3, z: 0 }
        },
        {
            name: "STT Emitter Ring",
            description: "Spin-Transfer Torque emitter ring. Focuses highly polarized angular momentum directly into the free layer to forcibly flip its magnetization without needing an external magnetic field.",
            material: "darkSteel, chrome, quantumGlow",
            function: "Writes data by switching the free layer magnetization via momentum transfer.",
            assemblyOrder: 8,
            connections: ["Free Magnetic Layer"],
            failureEffect: "Inability to flip the free layer, resulting in a read-only state or stalled write operations.",
            cascadeFailures: [],
            originalPosition: { x: 0, y: -0.8, z: 0 },
            explodedPosition: { x: 8, y: -0.8, z: 0 }
        },
        {
            name: "Electromagnetic Coils",
            description: "Four immense superconducting helical coils that generate precisely sculpted external magnetic fields. Used for macroscopic field-driven switching and stabilizing the free layer against thermal fluctuations.",
            material: "darkSteel, quantumGlow",
            function: "Generates external Oersted fields for magnetic resonance and state switching.",
            assemblyOrder: 9,
            connections: ["Flux Return Yoke", "Chamber Base"],
            failureEffect: "Quench event in the superconductors causes a massive release of energy, melting the MTJ stack instantly.",
            cascadeFailures: ["Vacuum Shielding", "Cryogenic Cooling Pipes", "Tunnel Barrier"],
            originalPosition: { x: 0, y: -1.5, z: 0 },
            explodedPosition: { x: 15, y: -1.5, z: 15 }
        },
        {
            name: "Cryogenic Cooling Pipes",
            description: "Complex network of tubes pumping liquid helium to keep the electromagnetic coils superconducting and to reduce Johnson-Nyquist thermal noise in the MTJ.",
            material: "cryoMat",
            function: "Maintains millikelvin operating temperatures.",
            assemblyOrder: 10,
            connections: ["Electromagnetic Coils"],
            failureEffect: "Loss of cryogen causes the coils to quench and thermal noise to overwhelm the tunneling signal.",
            cascadeFailures: ["Electromagnetic Coils"],
            originalPosition: { x: 0, y: -5, z: 0 },
            explodedPosition: { x: -12, y: -5, z: -12 }
        },
        {
            name: "Top Electrode",
            description: "Completes the electrical circuit. Highly conductive extruded copper cap that interfaces with the free layer and routes the tunneling current out to the readout sensors.",
            material: "copper",
            function: "Collects the tunneling current for readout.",
            assemblyOrder: 11,
            connections: ["Free Magnetic Layer", "Superconducting Interconnects"],
            failureEffect: "High contact resistance obscures the TMR ratio, causing read errors.",
            cascadeFailures: [],
            originalPosition: { x: 0, y: 1, z: 0 },
            explodedPosition: { x: 0, y: 7, z: 0 }
        },
        {
            name: "Quantum State Detectors",
            description: "Robotic, multi-jointed precision measurement arms. They utilize interferometric techniques to monitor the exact quantum state, precession, and spin coherence of the free layer in real-time.",
            material: "steel, darkSteel, glass",
            function: "Real-time non-destructive readout of the magnetization state.",
            assemblyOrder: 12,
            connections: ["Diagnostic Console"],
            failureEffect: "Blindness to the MTJ state; data cannot be verified after a write operation.",
            cascadeFailures: [],
            originalPosition: { x: 0, y: -0.8, z: 0 },
            explodedPosition: { x: 10, y: 5, z: 0 }
        },
        {
            name: "Tunneling Electron Cloud",
            description: "Visual representation of the quantum probability currents. Electrons pass through the classically forbidden insulating barrier via quantum tunneling. The spin-dependent transmission probability dictates the overall resistance.",
            material: "quantumGlow",
            function: "The fundamental charge and spin carriers traversing the junction.",
            assemblyOrder: 13,
            connections: ["Bottom Electrode", "Tunnel Barrier", "Top Electrode"],
            failureEffect: "Current ceases to flow if the barrier breaks down or bias voltage is lost.",
            cascadeFailures: [],
            originalPosition: { x: 0, y: -1.5, z: 0 },
            explodedPosition: { x: 0, y: -1.5, z: 0 }
        },
        {
            name: "Vacuum Shielding",
            description: "A heavy tinted borosilicate glass decagon that encloses the MTJ stack, maintaining ultra-high vacuum (UHV) conditions to prevent oxidation of the ferromagnetic materials and the MgO barrier.",
            material: "tinted, metal frame",
            function: "Environmental isolation.",
            assemblyOrder: 14,
            connections: ["Chamber Base"],
            failureEffect: "Implosion or leak leading to catastrophic oxidation of the sub-nanometer MTJ layers.",
            cascadeFailures: ["Pinned Magnetic Layer", "Free Magnetic Layer", "Tunnel Barrier"],
            originalPosition: { x: 0, y: -1.5, z: 0 },
            explodedPosition: { x: 0, y: 12, z: 0 }
        },
        {
            name: "Diagnostic Console",
            description: "Holographic display units outputting resistance curves, spin precession frequencies, TMR ratios, and localized thermal mapping.",
            material: "screenMaterial",
            function: "Operator interface and live telemetry.",
            assemblyOrder: 15,
            connections: ["Quantum State Detectors", "Power Distribution Ring"],
            failureEffect: "Loss of telemetry, making tuning the STT pulses impossible.",
            cascadeFailures: [],
            originalPosition: { x: 0, y: 2, z: 0 },
            explodedPosition: { x: 14, y: 8, z: -14 }
        }
    ];

    // ==========================================
    // QUIZ QUESTIONS
    // ==========================================
    const quizQuestions = [
        {
            question: "In this Spintronic MTJ, what is the primary function of the Magnesium Oxide (MgO) Tunnel Barrier?",
            options: [
                "To conduct electricity as efficiently as possible.",
                "To act as a classically forbidden insulator that electrons cross via spin-dependent quantum tunneling.",
                "To generate a massive magnetic field that flips the free layer.",
                "To cool the ferromagnetic layers to cryogenic temperatures."
            ],
            correctAnswer: 1,
            explanation: "The MgO barrier is an insulator. Classically, electrons cannot pass through it. However, due to quantum mechanics, electrons can tunnel through it. In a highly crystalline MgO barrier, this tunneling is highly spin-dependent, leading to a massive Tunneling Magnetoresistance (TMR) effect."
        },
        {
            question: "What physical mechanism does the 'STT Emitter Ring' utilize to write data to the Free Magnetic Layer?",
            options: [
                "Oersted magnetic fields generated by massive electrical currents.",
                "Spin-Transfer Torque (STT), where the angular momentum of spin-polarized electrons is transferred directly to the free layer's magnetization.",
                "Thermal heating to the Curie temperature, allowing it to reset.",
                "Mechanical manipulation via the Quantum State Detectors."
            ],
            correctAnswer: 1,
            explanation: "Spin-Transfer Torque (STT) uses a spin-polarized current. As these electrons enter the free layer, their spin angular momentum is transferred to the local magnetic moments, exerting a torque that can flip the macroscopic magnetization without needing an external magnetic field."
        },
        {
            question: "Why must the Pinned Magnetic Layer have its magnetization vector rigidly fixed?",
            options: [
                "To act as a consistent reference orientation against which the Free Layer's spin state (parallel or anti-parallel) is compared.",
                "To prevent the entire machine from vibrating.",
                "To generate the liquid helium required for the Cryogenic Cooling Pipes.",
                "To absorb excess tunneling electrons and prevent a short circuit."
            ],
            correctAnswer: 0,
            explanation: "The MTJ works by comparing the relative orientations of two ferromagnetic layers. The Pinned Layer is fixed via exchange bias so it always points in one direction. The Free Layer's direction dictates the resistance state (Parallel = Low Resistance, Anti-Parallel = High Resistance)."
        },
        {
            question: "What would be the catastrophic result of a dielectric breakdown (pinhole) in the ultra-thin Tunnel Barrier?",
            options: [
                "The MTJ would become superconducting and operate 100x faster.",
                "Electrons would flow via ohmic conduction (a short circuit) rather than quantum tunneling, destroying the TMR effect and the device's functionality.",
                "The Free Layer would become permanently pinned.",
                "The Electromagnetic Coils would quench and explode."
            ],
            correctAnswer: 1,
            explanation: "The device relies on the quantum tunneling of electrons for its spin-filtering properties. A physical hole (pinhole) allows direct metallic contact (ohmic conduction) between the layers, destroying the high/low resistance states."
        },
        {
            question: "Why are Cryogenic Cooling Pipes heavily integrated into this high-tech MTJ assembly?",
            options: [
                "Because the hydraulic dampers overheat.",
                "To maintain the super-conduction of the massive Electromagnetic Coils and to suppress thermal (Johnson-Nyquist) noise that could spontaneously flip the free layer.",
                "To freeze the electrons so they can be counted individually by the Top Electrode.",
                "To shrink the copper electrodes for a tighter fit."
            ],
            correctAnswer: 1,
            explanation: "Superconducting coils require liquid helium temperatures to operate. Additionally, at the nanoscale, thermal energy (kT) can be sufficient to spontaneously flip a free layer's magnetization (superparamagnetic limit), so cooling stabilizes the quantum states."
        }
    ];

    // ==========================================
    // ANIMATION LOOP
    // ==========================================
    let cyclePhase = 0;
    
    function animate(time, speed, meshes) {
        cyclePhase += speed * 0.02;
        
        // 1. Quantum Tunneling Electrons
        electrons.forEach(el => {
            // Move up from bottom electrode (-2.8) to top electrode (0.8)
            el.mesh.position.y += el.speedY * speed;
            if (el.mesh.position.y > 0.8) {
                el.mesh.position.y = -2.8;
                el.mesh.position.x = el.baseX;
                el.mesh.position.z = el.baseZ;
            }
            // Quantum jitter (Uncertainty simulation)
            el.mesh.position.x = el.baseX + Math.sin(time * el.freqX * 10 + el.phaseX) * 0.2;
            el.mesh.position.z = el.baseZ + Math.cos(time * el.freqZ * 10 + el.phaseZ) * 0.2;
            
            // Pulse glow based on height (brightest in the barrier at y = -1.5)
            const distToBarrier = Math.abs(el.mesh.position.y - (-1.5));
            const scale = Math.max(0.2, 1.5 - distToBarrier);
            el.mesh.scale.setScalar(scale);
        });

        // 2. Free Layer Spin Dynamics (Precession and STT Flipping)
        // Simulate a slow flip from Anti-Parallel to Parallel and back
        const flipState = Math.sin(cyclePhase * 0.5); // Ranges from -1 to 1
        const targetRotZ = (flipState > 0) ? -Math.PI/2 : Math.PI/2; 
        
        dynamicSpins.forEach(spinData => {
            // Precession around the Y axis
            spinData.mesh.rotation.y = time * 2 + spinData.offsetX * Math.PI;
            
            // Lerp towards target Z rotation to simulate switching
            spinData.mesh.rotation.z += (targetRotZ - spinData.mesh.rotation.z) * 0.05 * speed;
            
            // Color shift based on state
            if (spinData.mesh.rotation.z > 0) {
                spinData.mesh.children[0].children[0].material = spinDownMaterial; // Anti-parallel
                spinData.mesh.children[0].children[1].material = spinDownMaterial;
            } else {
                spinData.mesh.children[0].children[0].material = spinUpMaterial; // Parallel
                spinData.mesh.children[0].children[1].material = spinUpMaterial;
            }
        });

        // 3. STT Emitter Ring Rotation
        sttGroup.rotation.y = time * 0.5 * speed;

        // 4. Electromagnetic Coil Pulsing
        const pulse = (Math.sin(time * 3) * 0.5 + 0.5) * 2.0;
        coilIntensityMaterials.forEach(mat => {
            mat.emissiveIntensity = 1.0 + pulse;
        });

        // 5. Cryo-pipes flowing effect
        cryoMat.emissiveIntensity = Math.abs(Math.sin(time * 5)) * 0.5;

        // 6. Quantum Detectors Scanning
        detectorArms.forEach(armData => {
            // Small sinusoidal sweeps
            armData.arm.rotation.y = Math.sin(time * 2 + armData.startAngle) * 0.2;
            const sensorHead = armData.arm.children[2];
            sensorHead.material.emissiveIntensity = (Math.random() > 0.8) ? 2.0 : 0.5; // Blinking
        });

        // 7. Hydraulic Pistons Micro-adjustments
        pistonRods.forEach((rod, index) => {
            rod.position.y = -6.5 + Math.sin(time * 10 + index) * 0.05;
        });
    }

    return {
        group,
        parts,
        description: "An ultra-complex, macroscopic representation of a nanoscale Spintronic Magnetic Tunnel Junction (MTJ). It features heavy containment structures, cryogenic superconducting electromagnetic coils, and a precise quantum state readout interface. The core demonstrates electron tunneling through a sub-nanometer crystalline Magnesium Oxide (MgO) barrier, visualizing the fundamental physics behind Spin-Transfer Torque (STT) and Tunneling Magnetoresistance (TMR) which drive modern MRAM (Magnetoresistive Random Access Memory) technologies.",
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createMagneticTunnelJunction() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
