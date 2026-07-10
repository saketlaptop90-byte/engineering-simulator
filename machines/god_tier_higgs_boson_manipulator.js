import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

/**
 * GOD-TIER HIGGS BOSON MANIPULATOR
 * --------------------------------
 * WARNING: CLASSIFIED LEVEL 9 OMEGA DIRECTIVE
 * 
 * This module defines the geometric, structural, and animated physical properties of the
 * Ultra God-Tier Higgs Boson Manipulator.
 * 
 * Theoretical Background:
 * The Higgs mechanism breaks the electroweak symmetry SU(2)_L x U(1)_Y down to U(1)_em. 
 * By introducing highly coherent, extreme-amplitude scalar waves via our Tachyonic Emitters,
 * this apparatus forces the local vacuum expectation value (VEV) of the Higgs field to zero 
 * within the central containment chamber. 
 * 
 * Consequence: 
 * Macroscopic objects placed at the focal point lose their inertial and gravitational mass 
 * derived from the Higgs mechanism. Note that hadronic mass (from QCD binding energy) is 
 * partially suppressed via our secondary Quantum Chromodynamic Stabilizers.
 * 
 * Complexity:
 * This file contains extreme levels of detail, avoiding simple primitives in favor of 
 * LatheGeometries, ExtrudeGeometries, TorusKnots, and highly detailed grouped parts.
 */

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // ==========================================
    // MASSIVE PHYSICS CONFIGURATION & STATE
    // ==========================================
    const physicsConfig = {
        vacuumExpectationValue_SM: 246.22, // GeV
        localVEV: 246.22,
        couplingConstantTorsion: 1.054e-34,
        maxFieldIntensity: 10e15, // PeV scale
        containmentRadius: 15.0,
        baseGravity: 9.81,
        ambientTemperature: 2.73, // Kelvin
        reactorCoreOutput: 1.21e18, // Exawatts
        coolantFlowRate: 50000, // Liters per second
        timeDilationFactor: 1.0,
        // Emitter phase offsets
        emitterPhases: [0, Math.PI/4, Math.PI/2, 3*Math.PI/4, Math.PI, 5*Math.PI/4, 3*Math.PI/2, 7*Math.PI/4]
    };

    const animationContext = {
        time: 0,
        intensity: 0,
        state: 'IDLE', // IDLE, SPOOL_UP, DECOUPLED, SPOOL_DOWN
        emitters: [],
        rings: [],
        pistons: [],
        fluids: [],
        holograms: [],
        fieldMeshes: [],
        subject: null,
        subjectCore: null,
        subjectVelocity: new THREE.Vector3(0, 0, 0),
        subjectPosition: new THREE.Vector3(0, 25, 0),
        subjectMassState: 1.0 // 1.0 = normal, 0.001 = zero inertial mass
    };

    // ==========================================
    // ADVANCED HIGH-TECH CUSTOM MATERIALS
    // ==========================================
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff, emissive: 0x0055ff, emissiveIntensity: 2.0, metalness: 0.8, roughness: 0.2, transparent: true, opacity: 0.9
    });
    const neonPurple = new THREE.MeshStandardMaterial({
        color: 0x8800ff, emissive: 0x5500ff, emissiveIntensity: 2.5, metalness: 0.9, roughness: 0.1
    });
    const neonCyan = new THREE.MeshStandardMaterial({
        color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 3.0, metalness: 0.7, roughness: 0.1
    });
    const plasmaCoreMat = new THREE.MeshStandardMaterial({
        color: 0xffffff, emissive: 0xffaadd, emissiveIntensity: 5.0, transparent: true, opacity: 0.95
    });
    const fieldEffectMat = new THREE.MeshStandardMaterial({
        color: 0x00ffcc, emissive: 0x00ffaa, emissiveIntensity: 1.5, transparent: true, opacity: 0.15, wireframe: true, side: THREE.DoubleSide
    });
    const fieldSolidMat = new THREE.MeshStandardMaterial({
        color: 0x00ffee, emissive: 0x00ffee, emissiveIntensity: 2.0, transparent: true, opacity: 0.05, side: THREE.DoubleSide, depthWrite: false
    });
    const hyperChrome = new THREE.MeshStandardMaterial({
        color: 0xffffff, metalness: 1.0, roughness: 0.0, envMapIntensity: 2.5
    });
    const carbonFiber = new THREE.MeshStandardMaterial({
        color: 0x111111, metalness: 0.6, roughness: 0.8, wireframe: false
    });
    const cautionStripes = new THREE.MeshStandardMaterial({
        color: 0xdddd00, metalness: 0.1, roughness: 0.9
    });
    const pureOsmium = new THREE.MeshStandardMaterial({
        color: 0x8899aa, metalness: 0.9, roughness: 0.4, density: 22.59 // Visual representation only
    });

    // ==========================================
    // PART REGISTRATION HELPER
    // ==========================================
    function addPart(name, mesh, materialName, description, functionDesc, assemblyOrder, connections, originalPos, explodedPos, failureEffect, cascadeFailures) {
        mesh.name = name;
        mesh.position.copy(originalPos);
        parts.push({
            name,
            description,
            material: materialName,
            function: functionDesc,
            assemblyOrder,
            connections,
            failureEffect,
            cascadeFailures,
            originalPosition: { x: originalPos.x, y: originalPos.y, z: originalPos.z },
            explodedPosition: explodedPos || { x: originalPos.x * 1.5, y: originalPos.y * 1.5 + 20, z: originalPos.z * 1.5 }
        });
        group.add(mesh);
        return mesh;
    }

    // ==========================================
    // COMPLEX GEOMETRY GENERATION
    // ==========================================

    // --- 1. Primary Containment Base ---
    const baseGroup = new THREE.Group();
    const octRadius = 80;
    const baseShape = new THREE.Shape();
    for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        if (i === 0) baseShape.moveTo(Math.cos(a) * octRadius, Math.sin(a) * octRadius);
        else baseShape.lineTo(Math.cos(a) * octRadius, Math.sin(a) * octRadius);
    }
    baseShape.lineTo(octRadius, 0);
    
    // Core cut-out
    const coreHole = new THREE.Path();
    for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2;
        if (i === 0) coreHole.moveTo(Math.cos(a) * 20, Math.sin(a) * 20);
        else coreHole.lineTo(Math.cos(a) * 20, Math.sin(a) * 20);
    }
    coreHole.lineTo(20, 0);
    baseShape.holes.push(coreHole);

    const baseExtrudeOpts = { depth: 10, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 2, bevelThickness: 2 };
    const baseGeo = new THREE.ExtrudeGeometry(baseShape, baseExtrudeOpts);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.rotation.x = -Math.PI / 2;
    baseMesh.position.y = -10;
    baseGroup.add(baseMesh);

    // Floor Grating & Warning Trim (Torus)
    const trimGeo = new THREE.TorusGeometry(82, 1.5, 16, 8);
    const trimMesh = new THREE.Mesh(trimGeo, cautionStripes);
    trimMesh.rotation.x = Math.PI / 2;
    trimMesh.position.y = 0;
    baseGroup.add(trimMesh);

    // Deep Anchor Struts (16 massive hydraulic columns)
    for(let i = 0; i < 16; i++) {
        const a = (i/16) * Math.PI * 2;
        const strutGeo = new THREE.CylinderGeometry(2, 4, 25, 16);
        const strut = new THREE.Mesh(strutGeo, steel);
        strut.position.set(Math.cos(a) * 75, -12.5, Math.sin(a) * 75);
        strut.rotation.x = (Math.PI/16) * Math.cos(a);
        strut.rotation.z = (Math.PI/16) * Math.sin(a);
        baseGroup.add(strut);
        
        // Strut hydraulic lines
        const lineGeo = new THREE.CylinderGeometry(0.5, 0.5, 25, 8);
        const line = new THREE.Mesh(lineGeo, copper);
        line.position.set(Math.cos(a) * 78, -12.5, Math.sin(a) * 78);
        line.rotation.x = strut.rotation.x;
        line.rotation.z = strut.rotation.z;
        baseGroup.add(line);
    }
    
    addPart('Primary_Containment_Base', baseGroup, 'Dark Steel & Titanium Composites', 
        'Massive octagonal structural foundation anchored deep into the planetary crust to absorb extreme spatial-gravitational shockwaves.', 
        'Provides absolute stability during local Higgs field decimation events. Prevents the facility from imploding.', 
        1, ['Vacuum_Energy_Casimir_Core', 'Main_Containment_Vessel'], new THREE.Vector3(0,0,0), new THREE.Vector3(0, -30, 0),
        'Catastrophic structural collapse; facility annihilation resulting in a localized black hole.', ['Everything']);


    // --- 2. Vacuum Energy Casimir Core ---
    const powerCoreGroup = new THREE.Group();
    
    // Complex Lathe Geometry for the Reactor Core
    const reactorLathePoints = [];
    for(let i = 0; i <= 40; i++) {
        const t = i / 40;
        // Complex oscillating radius
        const r = 18 + Math.sin(t * Math.PI * 6) * 4 - (t * 8);
        reactorLathePoints.push(new THREE.Vector2(r, -t * 60));
    }
    const reactorGeo = new THREE.LatheGeometry(reactorLathePoints, 128);
    const reactorMesh = new THREE.Mesh(reactorGeo, chrome);
    powerCoreGroup.add(reactorMesh);

    // Reactor glowing plasma containment rings
    for(let i = 0; i < 6; i++) {
        const ringGeo = new THREE.TorusGeometry(19 - (i * 1.5), 1.2, 32, 64);
        const ring = new THREE.Mesh(ringGeo, neonBlue);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = -10 - (i * 10);
        animationContext.rings.push({mesh: ring, speed: (i+1)*0.025, axis: 'y'});
        powerCoreGroup.add(ring);
    }

    addPart('Vacuum_Energy_Casimir_Core', powerCoreGroup, 'HyperChrome & Plasma', 
        'An incredibly dense power generator extracting zero-point vacuum energy via dynamic Casimir-effect manipulation.', 
        'Supplies the exawatts of energy required to locally overcome the Higgs vacuum expectation value (VEV).', 
        2, ['Primary_Containment_Base', 'Superfluid_Helium_Pump_Array'], new THREE.Vector3(0, -5, 0), new THREE.Vector3(0, -100, 0),
        'Loss of containment; runaway vacuum collapse destroying the continent.', ['All Systems']);


    // --- 3, 4, 5, 6. Dark Matter Heatsinks ---
    for(let k = 0; k < 4; k++) {
        const heatsinkGroup = new THREE.Group();
        // Base plate
        const hsBase = new THREE.Mesh(new THREE.BoxGeometry(25, 4, 35), darkSteel);
        heatsinkGroup.add(hsBase);
        
        // Micro-finned radiator arrays
        for(let f = 0; f < 30; f++) {
            const fin = new THREE.Mesh(new THREE.BoxGeometry(22, 20, 0.2), aluminum);
            fin.position.set(0, 12, -16.5 + f*1.1);
            heatsinkGroup.add(fin);
        }
        
        // Massive Coolant feed pipes
        for(let p = 0; p < 2; p++) {
            const pipeGeo = new THREE.CylinderGeometry(1.5, 1.5, 38, 16);
            const pipe = new THREE.Mesh(pipeGeo, copper);
            pipe.rotation.x = Math.PI / 2;
            pipe.position.set(p === 0 ? 14 : -14, 5, 0);
            heatsinkGroup.add(pipe);
        }
        
        const angle = (k/4) * Math.PI * 2 + Math.PI/4;
        const dist = 100;
        heatsinkGroup.position.set(Math.cos(angle)*dist, -5, Math.sin(angle)*dist);
        heatsinkGroup.rotation.y = -angle;
        
        const names = ['Alpha', 'Beta', 'Gamma', 'Delta'];
        addPart('Dark_Matter_Heatsink_' + names[k], heatsinkGroup, 'Aluminum & Copper', 
            'Array of graphene-coated nanite fins interfacing directly with a contained dark matter loop.', 
            'Radiates petawatts of waste heat into extradimensional spatial manifolds. Warning: Extreme thermal hazard.', 
            3 + k, ['Primary_Containment_Base', 'Superfluid_Helium_Pump_Array'], 
            new THREE.Vector3(heatsinkGroup.position.x, heatsinkGroup.position.y, heatsinkGroup.position.z), 
            new THREE.Vector3(Math.cos(angle)*180, 0, Math.sin(angle)*180),
            'Core meltdown; plasma backflow.', ['Vacuum_Energy_Casimir_Core']);
    }

    // --- 7, 8. Higgs Field Resonator Rings (Upper & Lower) ---
    const createResonatorRing = (isUpper) => {
        const ringGroup = new THREE.Group();
        const mainGeo = new THREE.TorusGeometry(35, 4, 64, 128);
        const mainMesh = new THREE.Mesh(mainGeo, hyperChrome);
        mainMesh.rotation.x = Math.PI / 2;
        ringGroup.add(mainMesh);

        // Magnetic confinement nodes
        for(let i = 0; i < 32; i++) {
            const nodeGeo = new THREE.SphereGeometry(2, 32, 32);
            const node = new THREE.Mesh(nodeGeo, neonPurple);
            const angle = (i/32) * Math.PI * 2;
            node.position.set(Math.cos(angle)*35, 0, Math.sin(angle)*35);
            ringGroup.add(node);
            animationContext.emitters.push({mesh: node, index: i, type: 'node'});
        }
        return ringGroup;
    };

    const upperRing = createResonatorRing(true);
    animationContext.rings.push({mesh: upperRing, speed: 0.03, axis: 'y'});
    addPart('Higgs_Field_Resonator_Ring_Upper', upperRing, 'HyperChrome & Purple Neon', 
        'A massive, rapidly spinning ring injecting streams of negative-mass tachyonic fluid.', 
        'Catalyzes the symmetry restoration process at the upper boundary of the containment field.', 
        7, ['Primary_Containment_Base'], new THREE.Vector3(0, 75, 0), new THREE.Vector3(0, 130, 0),
        'Runaway symmetry breaking; local false vacuum decay.', []);

    const lowerRing = createResonatorRing(false);
    animationContext.rings.push({mesh: lowerRing, speed: -0.03, axis: 'y'});
    addPart('Higgs_Field_Resonator_Ring_Lower', lowerRing, 'HyperChrome & Purple Neon', 
        'Counter-rotating injection ring for tachyonic fluid.', 
        'Balances the torsion tensor of the localized spacetime metric to prevent coordinate singularity.', 
        8, ['Primary_Containment_Base'], new THREE.Vector3(0, -5, 0), new THREE.Vector3(0, -40, 0),
        'Spacetime torsion tear.', []);


    // --- 9. Quantum Chromodynamic Stabilizer ---
    const qcdGroup = new THREE.Group();
    const qcdGeo = new THREE.TorusKnotGeometry(25, 2, 256, 64, 5, 8);
    const qcdMesh = new THREE.Mesh(qcdGeo, copper);
    qcdGroup.add(qcdMesh);
    qcdMesh.position.y = 35;
    animationContext.rings.push({mesh: qcdGroup, speed: 0.01, axis: 'z'});

    addPart('Quantum_Chromodynamic_Stabilizer', qcdGroup, 'Superconducting Copper', 
        'A complex woven torus knot of superconducting wire carrying gluon-field suppression currents.', 
        'Partially dampens the strong nuclear force binding energy so that hadronic mass is also reduced along with Higgs mass.', 
        9, ['Primary_Containment_Base'], new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 80, 0),
        'Target remains 99% massive due to QCD binding energy remaining intact.', []);


    // --- 10. Superfluid Helium Pump Array ---
    const pumpGroup = new THREE.Group();
    class ComplexPipeCurve extends THREE.Curve {
        constructor(scale, phase, verticalOffset) {
            super();
            this.scale = scale;
            this.phase = phase;
            this.verticalOffset = verticalOffset;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const tx = Math.cos(t * Math.PI * 4 + this.phase) * this.scale * (1 + t*0.5);
            const ty = this.verticalOffset + t * 80;
            const tz = Math.sin(t * Math.PI * 4 + this.phase) * this.scale * (1 - t*0.5);
            return optionalTarget.set(tx, ty, tz);
        }
    }
    for(let i = 0; i < 16; i++) {
        const path = new ComplexPipeCurve(25, (i/16) * Math.PI * 2, -10);
        const tubeGeo = new THREE.TubeGeometry(path, 150, 1.2, 12, false);
        const tube = new THREE.Mesh(tubeGeo, steel);
        pumpGroup.add(tube);

        // Add pulsing inner plasma line representing superfluid helium
        const fluidGeo = new THREE.TubeGeometry(path, 150, 0.4, 8, false);
        const fluid = new THREE.Mesh(fluidGeo, neonCyan);
        animationContext.fluids.push({mesh: fluid, phase: i});
        pumpGroup.add(fluid);
    }
    addPart('Superfluid_Helium_Pump_Array', pumpGroup, 'Steel & Superfluid Cyan', 
        'A complex interwoven network of cryo-pipes circulating ultra-cold Helium-3.', 
        'Maintains superconductivity in the coils and drains immense thermal energy from the emitters.', 
        10, ['Vacuum_Energy_Casimir_Core', 'Higgs_Field_Resonator_Ring_Upper'], new THREE.Vector3(0, 0, 0), new THREE.Vector3(60, 40, 60),
        'Thermal runaway; magnets quench and violently explode.', ['Higgs_Field_Resonator_Ring_Upper']);


    // --- 11 to 18. Tachyonic Field Emitters (The Core Mechanism) ---
    for(let i = 0; i < 8; i++) {
        const emitterGroup = new THREE.Group();
        const angle = (i / 8) * Math.PI * 2;
        
        // Massive Emitter Arm Structure
        const armShape = new THREE.Shape();
        armShape.moveTo(0, -4);
        armShape.lineTo(45, -2);
        armShape.lineTo(45, 2);
        armShape.lineTo(0, 4);
        armShape.lineTo(0, -4);
        const armGeo = new THREE.ExtrudeGeometry(armShape, {depth: 6, bevelEnabled: true, bevelThickness: 1});
        const arm = new THREE.Mesh(armGeo, darkSteel);
        arm.position.set(15, -3, -3);
        emitterGroup.add(arm);

        // Focusing Nozzle (Complex Lathe)
        const nozzlePoints = [];
        for(let j = 0; j <= 30; j++) {
            const t = j / 30;
            const r = 5 - Math.pow(t, 2) * 4 + Math.sin(t*Math.PI*10)*0.5; // highly textured
            nozzlePoints.push(new THREE.Vector2(r, -t * 20));
        }
        const nozzleGeo = new THREE.LatheGeometry(nozzlePoints, 64);
        const nozzle = new THREE.Mesh(nozzleGeo, hyperChrome);
        nozzle.rotation.z = Math.PI / 2;
        nozzle.position.set(15, 0, 0); 
        emitterGroup.add(nozzle);

        // Emitter Crystal (Glowing, complex geometry)
        const crystalGeo = new THREE.IcosahedronGeometry(3, 1);
        const crystal = new THREE.Mesh(crystalGeo, neonCyan);
        crystal.position.set(-5, 0, 0);
        crystal.scale.set(1.5, 0.5, 0.5);
        animationContext.emitters.push({mesh: crystal, index: i, type: 'crystal'});
        emitterGroup.add(crystal);

        // Dual Hydraulic positioning pistons for each arm
        for(let p = 0; p < 2; p++) {
            const pistonOuterGeo = new THREE.CylinderGeometry(1.5, 1.5, 18, 16);
            const pistonOuter = new THREE.Mesh(pistonOuterGeo, darkSteel);
            pistonOuter.rotation.z = Math.PI / 2;
            pistonOuter.position.set(30, p===0 ? 4 : -4, 0);
            
            const pistonInnerGeo = new THREE.CylinderGeometry(0.8, 0.8, 20, 16);
            const pistonInner = new THREE.Mesh(pistonInnerGeo, chrome);
            pistonInner.rotation.z = Math.PI / 2;
            pistonInner.position.set(20, p===0 ? 4 : -4, 0);
            
            animationContext.pistons.push({outer: pistonOuter, inner: pistonInner, basePos: 20, phase: i});
            emitterGroup.add(pistonOuter);
            emitterGroup.add(pistonInner);
        }

        // Mechanical wiring on the arm
        const wireCurve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(45, 2, 3),
            new THREE.Vector3(25, 8, 3),
            new THREE.Vector3(5, 2, 3)
        );
        const wireGeo = new THREE.TubeGeometry(wireCurve, 20, 0.3, 8, false);
        const wireMesh = new THREE.Mesh(wireGeo, copper);
        emitterGroup.add(wireMesh);

        // Position the entire emitter assembly around the center
        const distance = 45; 
        emitterGroup.position.set(Math.cos(angle) * distance, 35, Math.sin(angle) * distance);
        emitterGroup.rotation.y = -angle; // Point precisely inwards

        addPart('Tachyonic_Field_Emitter_' + (i+1), emitterGroup, 'HyperChrome & Dark Steel', 
            'A precision-engineered scalar wave emitter tipped with a synthetic exotic-matter crystal.', 
            'Broadcasts localized destructive interference patterns into the Higgs field, neutralizing the VEV at the exact focal point.', 
            11 + i, ['Primary_Containment_Base', 'Boson_Target_AntiGravity_Pedestal'], 
            new THREE.Vector3(emitterGroup.position.x, emitterGroup.position.y, emitterGroup.position.z), 
            new THREE.Vector3(Math.cos(angle) * 120, 50, Math.sin(angle) * 120),
            'Asymmetric field decoupling; test object is ripped apart by tidal inertial forces.', ['Target_Subject_Osmium_Core']);
    }


    // --- 19. Chief Engineer Control Cabin ---
    const cabinGroup = new THREE.Group();
    
    // Main Cabin Hull
    const cabinGeo = new THREE.BoxGeometry(45, 30, 35);
    const cabinMesh = new THREE.Mesh(cabinGeo, darkSteel);
    cabinGroup.add(cabinMesh);
    
    // Angled Tinted Window
    const windowGeo = new THREE.PlaneGeometry(40, 22);
    const windowMesh = new THREE.Mesh(windowGeo, tinted);
    windowMesh.position.set(0, 2, 17.6);
    windowMesh.rotation.x = Math.PI / 16;
    cabinGroup.add(windowMesh);
    
    // Operator Seats inside
    for(let i=0; i<3; i++) {
        const seatGeo = new THREE.BoxGeometry(6, 8, 6);
        const seat = new THREE.Mesh(seatGeo, rubber);
        seat.position.set(-12 + i*12, -10, 5);
        cabinGroup.add(seat);
    }
    
    // Cabin Support Pillars
    const supportGeo = new THREE.CylinderGeometry(2.5, 2.5, 100, 16);
    const supp1 = new THREE.Mesh(supportGeo, steel);
    supp1.position.set(-18, -50, -12);
    const supp2 = new THREE.Mesh(supportGeo, steel);
    supp2.position.set(18, -50, -12);
    cabinGroup.add(supp1, supp2);

    cabinGroup.position.set(0, 90, 110);
    cabinGroup.rotation.y = Math.PI; // Face the chamber
    
    addPart('Chief_Engineer_Control_Cabin', cabinGroup, 'Steel, Lead & Tinted Glass', 
        'A heavily shielded, lead-lined control room suspended above the main experimental floor.', 
        'Protects the quantum engineers from stray exotic particles, micro-black holes, and intense Cherenkov radiation.', 
        19, ['Primary_Containment_Base'], new THREE.Vector3(0, 90, 110), new THREE.Vector3(0, 180, 180),
        'Lethal radiation exposure to operators; total mission failure.', []);


    // --- 20. Control Cabin Holographic Displays ---
    const holoGroup = new THREE.Group();
    for(let i = 0; i < 5; i++) {
        const screenGeo = new THREE.PlaneGeometry(10, 7);
        const screen = new THREE.Mesh(screenGeo, fieldEffectMat);
        // Position them inside the cabin window, angled towards operators
        screen.position.set(-18 + i*9, 85, 100 - Math.abs(i-2)*2);
        screen.rotation.y = Math.PI + (i-2)*0.2;
        screen.rotation.x = -Math.PI / 8;
        animationContext.holograms.push(screen);
        holoGroup.add(screen);
    }
    addPart('Control_Cabin_Holographic_Displays', holoGroup, 'Photonic Plasma', 
        'Volumetric light field displays showing real-time tensor calculus and VEV mapping.', 
        'Provides operators with critical feedback on the stability of the vacuum state.', 
        20, ['Chief_Engineer_Control_Cabin'], new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 120, 120),
        'Loss of telemetry; blind operation.', []);


    // --- 21. Boson Target Anti-Gravity Pedestal ---
    const pedestalGroup = new THREE.Group();
    // Complex pedestal base
    const pedPoints = [];
    for(let i=0; i<=20; i++) {
        const t = i/20;
        pedPoints.push(new THREE.Vector2(10 - t*6, t*15));
    }
    const pedGeo = new THREE.LatheGeometry(pedPoints, 64);
    const pedMesh = new THREE.Mesh(pedGeo, darkSteel);
    pedestalGroup.add(pedMesh);
    
    // Spinning magnetic lock rings on the pedestal
    for(let i = 0; i < 4; i++) {
        const lockGeo = new THREE.TorusGeometry(11 - i*1.2, 0.6, 16, 64);
        const lock = new THREE.Mesh(lockGeo, steel);
        lock.rotation.x = Math.PI / 2;
        lock.position.y = 3 + i*3;
        animationContext.rings.push({mesh: lock, speed: -0.05 * (i+1), axis: 'y'});
        pedestalGroup.add(lock);
    }
    
    addPart('Boson_Target_AntiGravity_Pedestal', pedestalGroup, 'Dark Steel & Superconductors', 
        'A robust conical pedestal equipped with baseline repulsor lifts.', 
        'Holds the test subject exactly at the focal point of the 8 scalar emitters prior to manipulation.', 
        21, ['Primary_Containment_Base'], new THREE.Vector3(0, -5, 0), new THREE.Vector3(0, -20, 0),
        'Subject drifts out of focal point; field decoupling fails.', []);


    // --- 22. Target Subject Osmium Core ---
    // The object that will be manipulated
    const subjectGeo = new THREE.IcosahedronGeometry(4.5, 4); // High poly sphere
    const subjectMesh = new THREE.Mesh(subjectGeo, pureOsmium);
    subjectMesh.position.set(0, 25, 0); // Hovering above pedestal
    
    // Add glowing core to subject to visualize internal energy
    const subjectCoreGeo = new THREE.IcosahedronGeometry(4.6, 2);
    const subjectCore = new THREE.Mesh(subjectCoreGeo, neonPurple);
    subjectCore.material.wireframe = true;
    subjectMesh.add(subjectCore);

    animationContext.subject = subjectMesh;
    animationContext.subjectCore = subjectCore;
    
    addPart('Target_Subject_Osmium_Core', subjectMesh, 'Pure Osmium & Plasma', 
        'A perfectly spherical, ultra-dense block of pure Osmium, initially possessing an inertial mass of 8,500 kg.', 
        'Serves as the macroscopic target for Higgs field manipulation to demonstrate violent mass alteration.', 
        22, ['Boson_Target_AntiGravity_Pedestal'], new THREE.Vector3(0, 25, 0), new THREE.Vector3(0, 150, 0),
        'Subject shattered due to extreme tidal stress.', []);


    // --- 23. Field Distortion Manifestation ---
    const fieldGroup = new THREE.Group();
    
    // Inner viscous sphere
    const fieldInnerGeo = new THREE.SphereGeometry(16, 64, 64);
    const fieldInner = new THREE.Mesh(fieldInnerGeo, fieldSolidMat);
    fieldGroup.add(fieldInner);
    
    // Outer distorted torus knots representing spatial torsion
    const fieldOuterGeo1 = new THREE.TorusKnotGeometry(14, 3, 256, 32, 4, 7);
    const fieldOuter1 = new THREE.Mesh(fieldOuterGeo1, fieldEffectMat);
    fieldGroup.add(fieldOuter1);

    const fieldOuterGeo2 = new THREE.TorusKnotGeometry(13, 2, 256, 32, 7, 4);
    const fieldOuter2 = new THREE.Mesh(fieldOuterGeo2, fieldEffectMat);
    fieldOuter2.rotation.x = Math.PI/2;
    fieldGroup.add(fieldOuter2);
    
    fieldGroup.position.set(0, 25, 0);
    animationContext.fieldMeshes.push(fieldInner, fieldOuter1, fieldOuter2);
    
    addPart('Field_Distortion_Manifestation', fieldGroup, 'Exotic Energy / Spacetime Curvature', 
        'A physical optical distortion in spacetime and local gauge fields, appearing as a thick, glowing, viscous aura.', 
        'The visible consequence of the SU(2)_L x U(1)_Y symmetry being artificially restored in a localized region.', 
        23, [], new THREE.Vector3(0, 25, 0), new THREE.Vector3(0, 25, 0),
        'False vacuum decay cascade.', []);


    // ==========================================
    // EXTREME ANIMATION AND PHYSICS ENGINE
    // ==========================================
    function animate(time, speed, meshes) {
        // time is scaled based on speed
        animationContext.time += speed * 0.05;
        const t = animationContext.time;
        
        // --- MACHINE STATE MACHINE ---
        // Cycle Length: 600 units
        // 0-150: IDLE, normal mass.
        // 150-250: SPOOL_UP, field starts glowing, rings spin faster.
        // 250-450: DECOUPLED (ZERO MASS), extreme chaos.
        // 450-600: SPOOL_DOWN, returning to normal.
        
        const cycle = t % 600;
        let massState = 1.0; 
        let fieldIntensity = 0.0;
        
        if (cycle <= 150) {
            animationContext.state = 'IDLE';
            fieldIntensity = 0.0;
            massState = 1.0;
        } else if (cycle > 150 && cycle <= 250) {
            animationContext.state = 'SPOOL_UP';
            fieldIntensity = (cycle - 150) / 100;
            // Mass decays exponentially as field intensity rises
            massState = Math.exp(-fieldIntensity * 8); 
        } else if (cycle > 250 && cycle <= 450) {
            animationContext.state = 'DECOUPLED';
            // Slight fluctuations in max intensity
            fieldIntensity = 1.0 + Math.sin(t * 0.5) * 0.05;
            massState = 0.0001; // Essentially massless (only residual hadronic mass remains)
        } else if (cycle > 450) {
            animationContext.state = 'SPOOL_DOWN';
            fieldIntensity = 1.0 - ((cycle - 450) / 150);
            massState = Math.exp(-fieldIntensity * 8);
        }

        animationContext.intensity = fieldIntensity;
        animationContext.subjectMassState = massState;
        
        // --- UPDATE VISUALS ---

        // 1. Emitters pulse and vibrate violently when active
        animationContext.emitters.forEach(e => {
            if (e.mesh.material.emissiveIntensity !== undefined) {
                // Base intensity + spike when active
                e.mesh.material.emissiveIntensity = (e.type === 'crystal' ? 2.0 : 1.0) + fieldIntensity * 8.0 + Math.sin(t * 2 + e.index) * 2.0;
            }
            // Physical vibration based on intensity
            const vib = fieldIntensity * 0.8;
            if (e.type === 'crystal') {
                e.mesh.position.y = (Math.random() - 0.5) * vib;
                e.mesh.position.z = (Math.random() - 0.5) * vib;
            }
        });

        // 2. Rings spin up exponentially
        animationContext.rings.forEach(r => {
            const rotSpeed = r.speed * (1.0 + Math.pow(fieldIntensity, 2) * 20.0);
            if (r.axis === 'y') r.mesh.rotation.y += rotSpeed;
            if (r.axis === 'z') r.mesh.rotation.z += rotSpeed;
            if (r.axis === 'x') r.mesh.rotation.x += rotSpeed;
        });

        // 3. Hydraulic Pistons extend forcefully during spool up
        animationContext.pistons.forEach(p => {
            // Pistons push in (extend inwards towards the center)
            const targetPos = p.basePos - fieldIntensity * 6;
            // Smooth interpolation
            p.inner.position.x += (targetPos - p.inner.position.x) * 0.1;
        });

        // 4. Superfluid Conduits pulse faster
        animationContext.fluids.forEach(f => {
            f.mesh.material.opacity = 0.3 + Math.sin(t * (1 + fieldIntensity*5) + f.phase) * 0.6;
        });

        // 5. Holograms glitch and flicker under high torsion
        animationContext.holograms.forEach((h, i) => {
            h.material.opacity = 0.4 + Math.random() * 0.5;
            // Intense glitching when field is maxed
            if (fieldIntensity > 0.9 && Math.random() > 0.8) {
                h.scale.x = 1.0 + (Math.random() - 0.5) * 0.5;
                h.scale.y = 1.0 + (Math.random() - 0.5) * 0.5;
            } else {
                h.scale.x = 1.0;
                h.scale.y = 1.0 + Math.sin(t * 0.5 + i) * 0.05;
            }
        });

        // 6. Field Visualizer (The viscous fluid effect)
        animationContext.fieldMeshes.forEach((f, i) => {
            f.visible = fieldIntensity > 0.01;
            if (f.visible) {
                // Swelling and rotating complex knots
                f.scale.setScalar(fieldIntensity * (1.0 + Math.sin(t * 1.5 + i)*0.08));
                f.rotation.x += 0.01 * (i+1) * (1 + fieldIntensity * 5);
                f.rotation.y += 0.02 * (i+1) * (1 + fieldIntensity * 5);
                f.rotation.z -= 0.015 * (i+1) * (1 + fieldIntensity * 5);
                
                f.material.opacity = fieldIntensity * (i === 0 ? 0.4 : 0.8);
                // Shift color slightly towards violet under extreme stress
                if (f.material.emissive) {
                    f.material.emissive.setHex(0x00ffaa).lerp(new THREE.Color(0x8800ff), fieldIntensity * 0.5);
                }
            }
        });

        // --- 7. SUBJECT PHYSICS SIMULATION (Core Mechanic) ---
        // As the subject loses its mass via the Higgs mechanism decoupling, 
        // ordinary quantum vacuum fluctuations and residual electromagnetic forces 
        // cause massive, violent accelerations (a = F/m).
        if (animationContext.subject) {
            const sub = animationContext.subject;
            
            // Forces defined in Newtons (scaled down for visualization)
            // 1. Gravity: Weight is proportional to mass!
            const gravityForce = new THREE.Vector3(0, -0.1 * massState, 0); 
            
            // 2. Pedestal Repulsor: Spring force attempting to hold it at y=25
            const displacementY = 25 - animationContext.subjectPosition.y;
            const repulsorForce = new THREE.Vector3(0, displacementY * 0.005, 0); 
            
            // 3. Quantum Vacuum Fluctuations: Random forces that are normally negligible,
            // but become DOMINANT when mass -> 0.
            const fluctuationForce = new THREE.Vector3(
                (Math.random() - 0.5) * 0.05,
                (Math.random() - 0.5) * 0.05,
                (Math.random() - 0.5) * 0.05
            );
            
            // Total Force
            const totalForce = new THREE.Vector3().add(gravityForce).add(repulsorForce).add(fluctuationForce);
            
            // Newton's Second Law: a = F / m
            const acceleration = totalForce.divideScalar(massState);
            
            // Update velocity (Euler integration)
            animationContext.subjectVelocity.add(acceleration);
            
            // Apply drag (magnetic confinement damping to prevent it flying away infinitely fast)
            // Drag increases dramatically when moving fast to keep it in the chamber
            const speedSq = animationContext.subjectVelocity.lengthSq();
            let dragCoefficient = 0.98;
            if (speedSq > 100) dragCoefficient = 0.8; 
            if (speedSq > 500) dragCoefficient = 0.5;
            
            animationContext.subjectVelocity.multiplyScalar(dragCoefficient);
            
            // Update position
            animationContext.subjectPosition.add(animationContext.subjectVelocity);
            
            // Hard Boundaries (Containment Field Walls)
            const containmentRadius = 13.0;
            if (animationContext.subjectPosition.y < 15) {
                animationContext.subjectPosition.y = 15;
                animationContext.subjectVelocity.y *= -0.9;
            }
            if (animationContext.subjectPosition.y > 35) {
                animationContext.subjectPosition.y = 35;
                animationContext.subjectVelocity.y *= -0.9;
            }
            
            const distFromCenter = Math.sqrt(
                Math.pow(animationContext.subjectPosition.x, 2) + 
                Math.pow(animationContext.subjectPosition.z, 2)
            );
            
            if (distFromCenter > containmentRadius) {
                // Bounce off cylindrical walls
                const angle = Math.atan2(animationContext.subjectPosition.z, animationContext.subjectPosition.x);
                animationContext.subjectPosition.x = Math.cos(angle) * containmentRadius;
                animationContext.subjectPosition.z = Math.sin(angle) * containmentRadius;
                
                // Reflect velocity vector
                const normal = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle));
                const dot = animationContext.subjectVelocity.dot(normal);
                animationContext.subjectVelocity.sub(normal.multiplyScalar(2 * dot));
                animationContext.subjectVelocity.multiplyScalar(0.9); // Loss of energy on bounce
            }

            // Apply position
            sub.position.copy(animationContext.subjectPosition);
            
            // Violent Rotation: Inverse proportional to mass
            sub.rotation.x += animationContext.subjectVelocity.z * (0.1 / massState);
            sub.rotation.z -= animationContext.subjectVelocity.x * (0.1 / massState);
            sub.rotation.y += (1.0 / massState) * 0.02;
            
            // Visual Overload: Core glows intensely based on kinetic energy
            if (animationContext.subjectCore) {
                animationContext.subjectCore.material.emissiveIntensity = 2.0 + speedSq * 2.0;
                animationContext.subjectCore.scale.setScalar(1.0 + Math.min(speedSq * 0.05, 0.5));
                // Core flickers violently when massless
                if (massState < 0.01) {
                    animationContext.subjectCore.material.wireframe = Math.random() > 0.5;
                } else {
                    animationContext.subjectCore.material.wireframe = true;
                }
            }
        }
    }


    // ==========================================
    // METADATA & ACADEMIC CONTENT
    // ==========================================
    const description = "The Ultra God-Tier Higgs Boson Manipulator. A hyper-complex, multi-exawatt facility designed to locally alter the vacuum expectation value of the Higgs field, thereby manipulating the fundamental inertial mass of macroscopic objects within its central containment vessel. Features extensive magnetic confinement, massive scalar wave interference arrays, and real-time spacetime torsion balancing. The sheer volume of code, geometry, and physics calculations required to render this machine reflects its Omega-level classification.";

    const quizQuestions = [
        {
            question: "In the Standard Model, the Higgs mechanism breaks the electroweak symmetry $SU(2)_L \\times U(1)_Y$ down to the electromagnetic symmetry $U(1)_{em}$. Which of the following accurately describes the Goldstone bosons produced during this spontaneous symmetry breaking before choosing the unitary gauge?",
            options: [
                "A) Four massive scalar bosons are produced, three of which become the longitudinal polarizations of the W+, W-, and Z bosons.",
                "B) Three massless Goldstone bosons are 'eaten' by the W+, W-, and Z gauge bosons, granting them mass, while the remaining scalar degree of freedom becomes the physical Higgs boson.",
                "C) Two massless Goldstone bosons are absorbed by the W bosons, while the Z boson acquires mass via the Stueckelberg mechanism.",
                "D) The symmetry breaking produces a triplet of physical massive Higgs bosons and one massless dilaton."
            ],
            correctAnswer: 1,
            explanation: "In spontaneous symmetry breaking of the electroweak sector, the three generators of the broken symmetries give rise to three massless Nambu-Goldstone bosons. In the unitary gauge, these are absorbed as the longitudinal degrees of freedom for the W+, W-, and Z bosons, giving them mass. The fourth degree of freedom becomes the observable massive scalar Higgs boson."
        },
        {
            question: "The Yukawa coupling between the Higgs field $\\phi$ and a fermion field $\\psi$ takes the form $-y_f \\bar{\\psi}_L \\phi \\psi_R + h.c.$. How is the physical mass of the fermion $m_f$ related to the Yukawa coupling constant $y_f$ and the vacuum expectation value (VEV) $v$ of the Higgs field (where $v \\approx 246$ GeV)?",
            options: [
                "A) $m_f = y_f v^2$",
                "B) $m_f = y_f v / \\sqrt{2}$",
                "C) $m_f = y_f^2 v$",
                "D) $m_f = 2 y_f / v$"
            ],
            correctAnswer: 1,
            explanation: "After spontaneous symmetry breaking, we substitute the Higgs doublet as $\\phi = (0, (v + h)/\\sqrt{2})^T$. The interaction term yields a mass term of the form $- (y_f v / \\sqrt{2}) (\\bar{\\psi}_L \\psi_R + \\bar{\\psi}_R \\psi_L)$. Thus, the fermion mass is strictly defined as $m_f = y_f v / \\sqrt{2}$."
        },
        {
            question: "Consider the one-loop corrections to the Higgs boson mass squared, $\\Delta m_H^2$, from a heavy Dirac fermion (like the top quark) coupled to the Higgs field. This correction is notoriously quadratically divergent with respect to the UV cutoff scale $\\Lambda$. Which of the following best represents the leading behavior of this correction?",
            options: [
                "A) $\\Delta m_H^2 \\sim -\\frac{y_f^2}{8\\pi^2} \\Lambda^2$",
                "B) $\\Delta m_H^2 \\sim +\\frac{y_f^2}{16\\pi^2} \\Lambda^2 \\ln(\\Lambda/m_f)$",
                "C) $\\Delta m_H^2 \\sim -\\frac{y_f^4}{16\\pi^2} \\Lambda^4$",
                "D) $\\Delta m_H^2 \\sim +\\frac{y_f^2}{4\\pi} m_f^2 \\ln(\\Lambda^2/m_H^2)$"
            ],
            correctAnswer: 0,
            explanation: "The top quark loop provides the largest radiative correction to the Higgs mass, which scales quadratically with the cutoff scale $\\Lambda$. The minus sign indicates that fermion loops contribute negatively to the squared mass. This massive quadratic divergence leads to the famous 'hierarchy problem', requiring extreme fine-tuning of the bare mass parameter unless new physics (like Supersymmetry) intervenes."
        },
        {
            question: "In the context of this God-Tier Higgs Manipulator, if the local Higgs field VEV, $v(x)$, is artificially reduced to $v_{SM}/100$ within the containment chamber, how would the effective Compton wavelength $\\lambda_e$ of an electron change within the manipulated region?",
            options: [
                "A) The Compton wavelength would decrease by a factor of 100, localizing the electron wavefunction more tightly.",
                "B) The Compton wavelength would remain constant because it depends solely on the fine-structure constant and Planck's constant.",
                "C) The Compton wavelength would increase by a factor of 100, macroscopicly extending the quantum fluctuations of the electron.",
                "D) The Compton wavelength would increase by a factor of 10000 due to the quadratic dependence of mass on the VEV."
            ],
            correctAnswer: 2,
            explanation: "The Compton wavelength is defined as $\\lambda = h / (m c)$. Since the electron mass $m_e$ is directly proportional to the Higgs VEV ($m_e \\propto v$), reducing the VEV by a factor of 100 decreases the mass by a factor of 100. Because mass is inversely proportional to the Compton wavelength, the wavelength increases by a factor of 100, causing the electron to become 'fuzzier' and highly delocalized."
        },
        {
            question: "If the Manipulator completely neutralizes the Higgs field ($\\langle \\phi \\rangle = 0$), restoring the full $SU(2)_L \\times U(1)_Y$ symmetry in a macroscopic volume, what would be the immediate kinematic consequence for a composite object like a proton entering this region?",
            options: [
                "A) The proton would instantly decay into massless quarks and gluons, propagating at the speed of light.",
                "B) The proton would remain largely intact and massive, because 99% of its mass arises from QCD chiral symmetry breaking and gluon binding energy, not the Higgs mechanism.",
                "C) The proton would entirely lose its inertial mass and accelerate to infinite velocity upon any infinitesimal momentum transfer.",
                "D) The proton's constituent quarks would become tachyonic, resulting in spontaneous vacuum decay radiating Cherenkov radiation."
            ],
            correctAnswer: 1,
            explanation: "This is a common misconception! While the Higgs mechanism gives mass to elementary particles (like quarks, electrons, W/Z bosons), nearly all (about 99%) of the mass of a proton or neutron comes from the strong force dynamics (quantum chromodynamics binding energy) and chiral symmetry breaking. Therefore, the proton would remain massive and intact, even if the current 'bare' masses of its valence quarks drop to zero."
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
