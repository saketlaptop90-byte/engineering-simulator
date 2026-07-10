import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const updatables = [];

    // ============================================================================
    // CUSTOM ADVANCED MATERIALS
    // ============================================================================
    const matAntimatterCore = new THREE.MeshPhysicalMaterial({ 
        color: 0xffaaff, 
        emissive: 0xff00ff, 
        emissiveIntensity: 10.0, 
        clearcoat: 1.0, 
        roughness: 0.1, 
        transmission: 0.9, 
        thickness: 2.0 
    });
    const matPlasma = new THREE.MeshStandardMaterial({ 
        color: 0x00ffff, 
        emissive: 0x0088ff, 
        emissiveIntensity: 4.0, 
        transparent: true, 
        opacity: 0.7, 
        wireframe: true 
    });
    const matContainmentShield = new THREE.MeshPhysicalMaterial({ 
        color: 0x0044ff, 
        emissive: 0x001188, 
        emissiveIntensity: 2.0, 
        transparent: true, 
        opacity: 0.15, 
        side: THREE.DoubleSide, 
        transmission: 1.0 
    });
    const matSuperconductor = new THREE.MeshStandardMaterial({ 
        color: 0x111111, 
        metalness: 0.9, 
        roughness: 0.4 
    });
    const matGoldFoil = new THREE.MeshStandardMaterial({ 
        color: 0xffaa00, 
        metalness: 1.0, 
        roughness: 0.2 
    });
    const matCoolantFluid = new THREE.MeshStandardMaterial({ 
        color: 0x00ffaa, 
        emissive: 0x00ffaa, 
        emissiveIntensity: 2.0, 
        transparent: true, 
        opacity: 0.6 
    });
    const matProtonBeam = new THREE.MeshBasicMaterial({ 
        color: 0xffffff, 
        transparent: true, 
        opacity: 0.9 
    });
    const matAntiprotonBeam = new THREE.MeshBasicMaterial({ 
        color: 0xff00ff, 
        transparent: true, 
        opacity: 0.9 
    });
    const matPositronBeam = new THREE.MeshBasicMaterial({ 
        color: 0x00ff00, 
        transparent: true, 
        opacity: 0.9 
    });
    const matTargetTungsten = new THREE.MeshStandardMaterial({
        color: 0x555555,
        metalness: 0.8,
        roughness: 0.6,
        emissive: 0xff3300,
        emissiveIntensity: 0.2
    });

    // ============================================================================
    // UTILITY SHAPES AND PROFILES (NO SIMPLE CUBES)
    // ============================================================================
    
    // I-Beam Profile for structural supports
    const iBeamShape = new THREE.Shape();
    iBeamShape.moveTo(-2, -3);
    iBeamShape.lineTo(2, -3);
    iBeamShape.lineTo(2, -2);
    iBeamShape.lineTo(0.5, -2);
    iBeamShape.lineTo(0.5, 2);
    iBeamShape.lineTo(2, 2);
    iBeamShape.lineTo(2, 3);
    iBeamShape.lineTo(-2, 3);
    iBeamShape.lineTo(-2, 2);
    iBeamShape.lineTo(-0.5, 2);
    iBeamShape.lineTo(-0.5, -2);
    iBeamShape.lineTo(-2, -2);
    iBeamShape.lineTo(-2, -3);
    
    const iBeamExtrudeSettings = { depth: 10, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };

    // Hexagonal shape for bolts and nuts
    const hexShape = new THREE.Shape();
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        if (i === 0) hexShape.moveTo(Math.cos(angle), Math.sin(angle));
        else hexShape.lineTo(Math.cos(angle), Math.sin(angle));
    }
    hexShape.lineTo(Math.cos(0), Math.sin(0));

    // ============================================================================
    // COMPLEX SUB-ASSEMBLY GENERATORS
    // ============================================================================

    function createComplexFlange(radius, thickness, boltCount) {
        const flangeGroup = new THREE.Group();
        const flangeGeo = new THREE.CylinderGeometry(radius, radius, thickness, 32);
        const flange = new THREE.Mesh(flangeGeo, steel);
        flange.rotation.x = Math.PI / 2;
        flangeGroup.add(flange);
        
        const boltGeo = new THREE.ExtrudeGeometry(hexShape, { depth: thickness * 1.5, bevelEnabled: false });
        
        for(let i=0; i<boltCount; i++) {
            const angle = (i / boltCount) * Math.PI * 2;
            const bolt = new THREE.Mesh(boltGeo, darkSteel);
            const scale = radius * 0.05;
            bolt.scale.set(scale, scale, 1);
            bolt.position.set(Math.cos(angle) * radius * 0.8, Math.sin(angle) * radius * 0.8, -thickness * 0.75);
            flangeGroup.add(bolt);
        }
        return flangeGroup;
    }

    function createVacuumChamberSegment(length, radius) {
        const segmentGroup = new THREE.Group();
        const tubeGeo = new THREE.CylinderGeometry(radius, radius, length, 32, 1, true);
        const tube = new THREE.Mesh(tubeGeo, aluminum);
        tube.rotation.x = Math.PI / 2;
        segmentGroup.add(tube);
        
        const flange1 = createComplexFlange(radius * 1.3, length * 0.05, 12);
        flange1.position.z = length / 2;
        segmentGroup.add(flange1);

        const flange2 = createComplexFlange(radius * 1.3, length * 0.05, 12);
        flange2.position.z = -length / 2;
        segmentGroup.add(flange2);
        
        return segmentGroup;
    }

    function createRF_Cavity() {
        const points = [];
        for (let i = 0; i <= 20; i++) {
            const t = i / 20;
            const x = Math.sin(t * Math.PI) * 15 + 5;
            const y = (t - 0.5) * 40;
            points.push(new THREE.Vector2(x, y));
        }
        const cavityGeo = new THREE.LatheGeometry(points, 64);
        const cavity = new THREE.Mesh(cavityGeo, copper);
        cavity.rotation.x = Math.PI / 2;
        
        const cavityGroup = new THREE.Group();
        cavityGroup.add(cavity);
        
        // Add waveguide feed
        const waveGuideGeo = new THREE.BoxGeometry(10, 20, 10); // Wait, no simple cubes. Will use extruded rect with bevels
        const rectShape = new THREE.Shape();
        rectShape.moveTo(-5, -5); rectShape.lineTo(5, -5); rectShape.lineTo(5, 5); rectShape.lineTo(-5, 5); rectShape.lineTo(-5, -5);
        const waveGuideExtrude = new THREE.ExtrudeGeometry(rectShape, { depth: 20, bevelEnabled: true, bevelSegments: 3, bevelSize: 0.5, bevelThickness: 0.5 });
        const waveGuide = new THREE.Mesh(waveGuideExtrude, copper);
        waveGuide.position.set(0, 15, 0);
        waveGuide.rotation.x = Math.PI / 2;
        cavityGroup.add(waveGuide);
        
        return cavityGroup;
    }

    function createQuadrupoleMagnet() {
        const group = new THREE.Group();
        
        // Yoke (Complex Extrude)
        const yokeShape = new THREE.Shape();
        const R_outer = 15;
        const R_inner = 8;
        yokeShape.absarc(0, 0, R_outer, 0, Math.PI * 2, false);
        const holePath = new THREE.Path();
        holePath.absarc(0, 0, R_inner, 0, Math.PI * 2, true);
        yokeShape.holes.push(holePath);
        
        const yokeGeo = new THREE.ExtrudeGeometry(yokeShape, { depth: 20, bevelEnabled: true, bevelSize: 0.5, bevelThickness: 0.5 });
        const yoke = new THREE.Mesh(yokeGeo, darkSteel);
        yoke.position.z = -10;
        group.add(yoke);
        
        // Coils (4 distinct coils)
        for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI) / 2 + Math.PI/4;
            const coilGeo = new THREE.TorusGeometry(3, 1.5, 16, 32);
            const coil = new THREE.Mesh(coilGeo, copper);
            coil.position.set(Math.cos(angle) * 10, Math.sin(angle) * 10, 0);
            coil.rotation.z = angle;
            coil.rotation.y = Math.PI / 2;
            group.add(coil);
        }
        
        // Coolant lines
        const pipeGeo = new THREE.TubeGeometry(new THREE.LineCurve3(new THREE.Vector3(0, 16, -10), new THREE.Vector3(0, 16, 10)), 20, 0.5, 8, false);
        const pipe = new THREE.Mesh(pipeGeo, steel);
        group.add(pipe);
        
        return group;
    }

    function createDipoleMagnet() {
        const group = new THREE.Group();
        
        // Massive C-shaped yoke
        const cShape = new THREE.Shape();
        cShape.moveTo(-15, -10);
        cShape.lineTo(10, -10);
        cShape.lineTo(10, -5);
        cShape.lineTo(-5, -5);
        cShape.lineTo(-5, 5);
        cShape.lineTo(10, 5);
        cShape.lineTo(10, 10);
        cShape.lineTo(-15, 10);
        cShape.lineTo(-15, -10);
        
        const yokeGeo = new THREE.ExtrudeGeometry(cShape, { depth: 40, curveSegments: 12, bevelEnabled: true, bevelSize: 1, bevelThickness: 1 });
        const yoke = new THREE.Mesh(yokeGeo, darkSteel);
        yoke.position.set(5, 0, -20);
        group.add(yoke);
        
        // Superconducting coils (Top and Bottom)
        const coilGeo = new THREE.TorusGeometry(12, 2, 16, 64);
        const coilTop = new THREE.Mesh(coilGeo, matSuperconductor);
        coilTop.rotation.x = Math.PI / 2;
        coilTop.position.set(2, 6, 0);
        coilTop.scale.set(1, 1.5, 1);
        group.add(coilTop);
        
        const coilBottom = new THREE.Mesh(coilGeo, matSuperconductor);
        coilBottom.rotation.x = Math.PI / 2;
        coilBottom.position.set(2, -6, 0);
        coilBottom.scale.set(1, 1.5, 1);
        group.add(coilBottom);
        
        return group;
    }

    // ============================================================================
    // SUBSYSTEM 1: LINEAR ACCELERATOR INJECTOR
    // ============================================================================
    const linacGroup = new THREE.Group();
    linacGroup.position.set(-600, 0, 0);
    
    // Proton Source Dome
    const sourceDomeGeo = new THREE.SphereGeometry(30, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2);
    const sourceDome = new THREE.Mesh(sourceDomeGeo, chrome);
    sourceDome.rotation.z = -Math.PI / 2;
    sourceDome.position.set(-200, 0, 0);
    linacGroup.add(sourceDome);
    
    // 20 RF Cavities in a row
    for(let i=0; i<20; i++) {
        const rf = createRF_Cavity();
        rf.position.set(-150 + i * 40, 0, 0);
        rf.rotation.y = Math.PI / 2;
        linacGroup.add(rf);
        
        // Connecting beam pipes
        if (i < 19) {
            const pipeGeo = new THREE.CylinderGeometry(2, 2, 40, 16);
            const pipe = new THREE.Mesh(pipeGeo, steel);
            pipe.rotation.z = Math.PI / 2;
            pipe.position.set(-130 + i * 40, 0, 0);
            linacGroup.add(pipe);
        }
    }
    group.add(linacGroup);

    // ============================================================================
    // SUBSYSTEM 2: PROTON SYNCHROTRON RING
    // ============================================================================
    const synchrotronGroup = new THREE.Group();
    synchrotronGroup.position.set(0, 0, 0);
    const ringRadius = 400;
    
    // The main vacuum ring
    const ringGeo = new THREE.TorusGeometry(ringRadius, 4, 32, 256);
    const mainRing = new THREE.Mesh(ringGeo, steel);
    mainRing.rotation.x = Math.PI / 2;
    synchrotronGroup.add(mainRing);
    
    // Magnets around the ring
    const numMagnets = 120;
    for (let i = 0; i < numMagnets; i++) {
        const angle = (i / numMagnets) * Math.PI * 2;
        const x = Math.cos(angle) * ringRadius;
        const z = Math.sin(angle) * ringRadius;
        
        if (i % 2 === 0) {
            const dipole = createDipoleMagnet();
            dipole.position.set(x, 0, z);
            dipole.rotation.y = -angle;
            synchrotronGroup.add(dipole);
        } else {
            const quad = createQuadrupoleMagnet();
            quad.position.set(x, 0, z);
            quad.rotation.y = -angle + Math.PI / 2;
            synchrotronGroup.add(quad);
        }
    }

    // Particle Beam Animation Element
    const beamRingGeo = new THREE.TorusGeometry(ringRadius, 1, 16, 256);
    const protonBeam = new THREE.Mesh(beamRingGeo, matProtonBeam);
    protonBeam.rotation.x = Math.PI / 2;
    synchrotronGroup.add(protonBeam);
    
    updatables.push((time) => {
        protonBeam.material.opacity = 0.5 + Math.sin(time * 10) * 0.4;
    });

    group.add(synchrotronGroup);

    // ============================================================================
    // SUBSYSTEM 3: COLLISION TARGET AND MAGNETIC HORN
    // ============================================================================
    const targetGroup = new THREE.Group();
    // Positioned tangential to the synchrotron
    targetGroup.position.set(ringRadius + 50, 0, 100);
    targetGroup.rotation.y = Math.PI / 4;

    // Extractor pipe from synchrotron
    const extractorCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-50, 0, -100),
        new THREE.Vector3(0, 0, -50),
        new THREE.Vector3(0, 0, 0)
    );
    const extractorGeo = new THREE.TubeGeometry(extractorCurve, 64, 4, 16, false);
    const extractor = new THREE.Mesh(extractorGeo, aluminum);
    targetGroup.add(extractor);

    // Target Shielding Monolith
    const shieldingShape = new THREE.Shape();
    shieldingShape.moveTo(-30, -30);
    shieldingShape.lineTo(30, -30);
    shieldingShape.lineTo(40, 0);
    shieldingShape.lineTo(30, 30);
    shieldingShape.lineTo(-30, 30);
    shieldingShape.lineTo(-40, 0);
    shieldingShape.lineTo(-30, -30);
    const shieldingGeo = new THREE.ExtrudeGeometry(shieldingShape, { depth: 100, bevelEnabled: true, bevelSegments: 4, steps: 4, bevelSize: 2, bevelThickness: 2 });
    const shielding = new THREE.Mesh(shieldingGeo, steel);
    shielding.position.z = 20;
    targetGroup.add(shielding);

    // Inside target (Tungsten)
    const tungstenPoints = [];
    for (let i = 0; i <= 10; i++) {
        tungstenPoints.push(new THREE.Vector2(Math.sin(i * Math.PI / 10) * 5, (i - 5) * 4));
    }
    const tungstenGeo = new THREE.LatheGeometry(tungstenPoints, 32);
    const targetCore = new THREE.Mesh(tungstenGeo, matTargetTungsten);
    targetCore.position.z = 50;
    targetCore.rotation.x = Math.PI / 2;
    targetGroup.add(targetCore);

    // Magnetic Horn (Parabolic inner conductor)
    const hornPoints = [];
    for (let i = 0; i <= 20; i++) {
        const z = i * 4;
        const r = Math.sqrt(z + 1) * 2;
        hornPoints.push(new THREE.Vector2(r, z));
    }
    const hornGeo = new THREE.LatheGeometry(hornPoints, 64);
    const horn = new THREE.Mesh(hornGeo, aluminum);
    horn.position.z = 70;
    horn.rotation.x = Math.PI / 2;
    targetGroup.add(horn);
    
    // Horn pulsing effect
    const hornPulseGeo = new THREE.SphereGeometry(15, 32, 32);
    const hornPulse = new THREE.Mesh(hornPulseGeo, matPlasma);
    hornPulse.position.z = 50;
    targetGroup.add(hornPulse);

    updatables.push((time) => {
        hornPulse.scale.setScalar(1.0 + Math.sin(time * 20) * 0.5);
        hornPulse.material.emissiveIntensity = 2.0 + Math.sin(time * 20) * 2.0;
        targetCore.material.emissiveIntensity = 0.5 + Math.random() * 0.5;
    });

    group.add(targetGroup);

    // ============================================================================
    // SUBSYSTEM 4: ANTIPROTON DECELERATOR RING
    // ============================================================================
    const adGroup = new THREE.Group();
    // Offset from the target
    adGroup.position.set(ringRadius + 200, -50, 400);
    const adRadius = 150;

    const adRingGeo = new THREE.TorusGeometry(adRadius, 3, 32, 128);
    const adRing = new THREE.Mesh(adRingGeo, steel);
    adRing.rotation.x = Math.PI / 2;
    adGroup.add(adRing);

    // Stochastic Cooling Kickers
    for (let i = 0; i < 4; i++) {
        const kickerGroup = new THREE.Group();
        const kShape = new THREE.Shape();
        kShape.moveTo(-10, -10); kShape.lineTo(10, -10); kShape.lineTo(15, 0); kShape.lineTo(10, 10); kShape.lineTo(-10, 10); kShape.lineTo(-15, 0); kShape.lineTo(-10, -10);
        const kGeo = new THREE.ExtrudeGeometry(kShape, { depth: 30, bevelEnabled: true });
        const kicker = new THREE.Mesh(kGeo, copper);
        kicker.position.z = -15;
        kickerGroup.add(kicker);
        
        const angle = (i * Math.PI) / 2;
        kickerGroup.position.set(Math.cos(angle) * adRadius, 0, Math.sin(angle) * adRadius);
        kickerGroup.rotation.y = -angle;
        adGroup.add(kickerGroup);
    }
    
    // Antiproton beam
    const pbarBeamGeo = new THREE.TorusGeometry(adRadius, 0.8, 16, 128);
    const pbarBeam = new THREE.Mesh(pbarBeamGeo, matAntiprotonBeam);
    pbarBeam.rotation.x = Math.PI / 2;
    adGroup.add(pbarBeam);

    group.add(adGroup);

    // ============================================================================
    // SUBSYSTEM 5: POSITRON ACCUMULATOR
    // ============================================================================
    const positronGroup = new THREE.Group();
    positronGroup.position.set(ringRadius + 500, -50, 100);

    // Surko Trap setup (nested cylinders and coils)
    const surkoBaseGeo = new THREE.CylinderGeometry(20, 20, 100, 32);
    const surkoBase = new THREE.Mesh(surkoBaseGeo, steel);
    surkoBase.rotation.x = Math.PI / 2;
    positronGroup.add(surkoBase);

    for (let i = 0; i < 10; i++) {
        const coilGeo = new THREE.TorusGeometry(22, 2, 16, 64);
        const coil = new THREE.Mesh(coilGeo, copper);
        coil.position.z = -40 + i * (80 / 9);
        positronGroup.add(coil);
    }

    // Na-22 source housing
    const sourceHousingGeo = new THREE.SphereGeometry(15, 32, 32);
    const sourceHousing = new THREE.Mesh(sourceHousingGeo, tinted);
    sourceHousing.position.z = -60;
    positronGroup.add(sourceHousing);

    group.add(positronGroup);

    // ============================================================================
    // SUBSYSTEM 6: RECOMBINATION & PENNING-MALMBERG TRAPS
    // ============================================================================
    const trapGroup = new THREE.Group();
    trapGroup.position.set(ringRadius + 350, -100, 250);
    
    // Superconducting Solenoid housing
    const solenoidGeo = new THREE.CylinderGeometry(40, 40, 150, 64, 1, false);
    const solenoid = new THREE.Mesh(solenoidGeo, chrome);
    solenoid.rotation.x = Math.PI / 2;
    trapGroup.add(solenoid);

    // Nested cylindrical electrodes inside the trap (visible via cutaways or transparency)
    const electrodeGeo = new THREE.CylinderGeometry(15, 15, 120, 32, 1, true);
    const electrode = new THREE.Mesh(electrodeGeo, matGoldFoil);
    electrode.rotation.x = Math.PI / 2;
    trapGroup.add(electrode);

    // Complex electrode segments
    for(let i = 0; i < 15; i++) {
        const segGeo = new THREE.CylinderGeometry(14, 14, 6, 32, 1, true);
        const seg = new THREE.Mesh(segGeo, copper);
        seg.rotation.x = Math.PI / 2;
        seg.position.z = -60 + i * 8.5;
        trapGroup.add(seg);
    }

    // Cooling lasers
    for(let i = 0; i < 4; i++) {
        const laserGeo = new THREE.CylinderGeometry(0.5, 0.5, 200, 8);
        const laserBeam = new THREE.Mesh(laserGeo, matPositronBeam); // repurpose green for laser
        laserBeam.rotation.x = Math.PI / 2;
        laserBeam.position.set(Math.cos(i*Math.PI/2)*5, Math.sin(i*Math.PI/2)*5, 0);
        trapGroup.add(laserBeam);
    }

    group.add(trapGroup);

    // ============================================================================
    // SUBSYSTEM 7: MAGNETIC BOTTLE VAULT (ANTIMATTER CONTAINMENT)
    // ============================================================================
    const vaultGroup = new THREE.Group();
    vaultGroup.position.set(ringRadius + 350, -250, 250);

    // Massive spherical vacuum vessel
    const vesselGeo = new THREE.SphereGeometry(100, 64, 64);
    const vesselMat = new THREE.MeshPhysicalMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.2, clearcoat: 0.5, transparent: true, opacity: 0.4 });
    const vessel = new THREE.Mesh(vesselGeo, vesselMat);
    vaultGroup.add(vessel);

    // Octupole magnetic coils (Ioffe-Pritchard style trap)
    // 8 twisted racetrack coils
    for(let i=0; i<8; i++) {
        const angle = (i * Math.PI) / 4;
        
        // Create a custom racetrack shape
        const trackCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-10, 60, 0),
            new THREE.Vector3(10, 60, 0),
            new THREE.Vector3(10, -60, 0),
            new THREE.Vector3(-10, -60, 0)
        ], true);
        
        const trackGeo = new THREE.TubeGeometry(trackCurve, 64, 4, 16, true);
        const track = new THREE.Mesh(trackGeo, matSuperconductor);
        
        // Rotate and position
        track.rotation.y = angle;
        track.position.set(Math.cos(angle)*30, 0, Math.sin(angle)*30);
        vaultGroup.add(track);
    }
    
    // Mirror Coils (Pinch at top and bottom)
    const mirrorCoilGeo = new THREE.TorusGeometry(40, 8, 32, 64);
    const mirrorTop = new THREE.Mesh(mirrorCoilGeo, matSuperconductor);
    mirrorTop.rotation.x = Math.PI / 2;
    mirrorTop.position.y = 50;
    vaultGroup.add(mirrorTop);
    
    const mirrorBottom = new THREE.Mesh(mirrorCoilGeo, matSuperconductor);
    mirrorBottom.rotation.x = Math.PI / 2;
    mirrorBottom.position.y = -50;
    vaultGroup.add(mirrorBottom);

    // The Antimatter Core
    const coreGeo = new THREE.SphereGeometry(15, 64, 64);
    const antimatterCore = new THREE.Mesh(coreGeo, matAntimatterCore);
    vaultGroup.add(antimatterCore);

    // Containment shield effects
    const shieldGeo = new THREE.SphereGeometry(25, 32, 32);
    const containmentShield = new THREE.Mesh(shieldGeo, matContainmentShield);
    vaultGroup.add(containmentShield);

    updatables.push((time) => {
        antimatterCore.rotation.y += 0.05;
        antimatterCore.rotation.x += 0.03;
        antimatterCore.scale.setScalar(1.0 + Math.sin(time * 5) * 0.05);
        
        containmentShield.rotation.y -= 0.02;
        containmentShield.scale.setScalar(1.0 + Math.cos(time * 8) * 0.1);
        containmentShield.material.opacity = 0.15 + Math.sin(time * 15) * 0.1;
    });

    group.add(vaultGroup);

    // ============================================================================
    // SUBSYSTEM 8: CRYOGENIC COOLING & INFRASTRUCTURE
    // ============================================================================
    const infraGroup = new THREE.Group();
    
    // Giant cooling towers and heat exchangers
    for (let i = 0; i < 4; i++) {
        const exGroup = new THREE.Group();
        const shellGeo = new THREE.CylinderGeometry(20, 20, 150, 32);
        const shell = new THREE.Mesh(shellGeo, steel);
        exGroup.add(shell);
        
        const finsGeo = new THREE.CylinderGeometry(25, 25, 2, 32);
        for (let j = 0; j < 30; j++) {
            const fin = new THREE.Mesh(finsGeo, aluminum);
            fin.position.y = -70 + j * 5;
            exGroup.add(fin);
        }
        
        exGroup.position.set(ringRadius - 150, 75, -200 + i * 100);
        infraGroup.add(exGroup);
        
        // Connect pipes to synchrotron
        const pipeCurve = new THREE.CubicBezierCurve3(
            new THREE.Vector3(ringRadius - 150, 0, -200 + i * 100),
            new THREE.Vector3(ringRadius - 50, -50, -200 + i * 100),
            new THREE.Vector3(ringRadius - 10, 0, Math.sin(i*Math.PI/2)*ringRadius),
            new THREE.Vector3(Math.cos(i*Math.PI/2)*ringRadius, 0, Math.sin(i*Math.PI/2)*ringRadius)
        );
        const pipeGeo = new THREE.TubeGeometry(pipeCurve, 64, 5, 16, false);
        const pipe = new THREE.Mesh(pipeGeo, matCoolantFluid);
        infraGroup.add(pipe);
    }
    
    group.add(infraGroup);

    // ============================================================================
    // SUBSYSTEM 9: CENTRAL CONTROL NODE
    // ============================================================================
    const controlGroup = new THREE.Group();
    controlGroup.position.set(0, 150, 0);

    // Suspension platform (No simple cubes, extruded octagon)
    const octShape = new THREE.Shape();
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + Math.PI/8;
        if (i===0) octShape.moveTo(Math.cos(angle)*80, Math.sin(angle)*80);
        else octShape.lineTo(Math.cos(angle)*80, Math.sin(angle)*80);
    }
    const platGeo = new THREE.ExtrudeGeometry(octShape, { depth: 5, bevelEnabled: true });
    const platform = new THREE.Mesh(platGeo, darkSteel);
    platform.rotation.x = Math.PI / 2;
    controlGroup.add(platform);
    
    // Holographic display in center
    const holoGeo = new THREE.CylinderGeometry(30, 30, 40, 64, 1, true);
    const holoMat = new THREE.MeshBasicMaterial({ color: 0x00ffaa, transparent: true, opacity: 0.3, wireframe: true, side: THREE.DoubleSide });
    const hologram = new THREE.Mesh(holoGeo, holoMat);
    hologram.position.y = 30;
    controlGroup.add(hologram);
    
    updatables.push((time) => {
        hologram.rotation.y += 0.01;
        hologram.scale.y = 1.0 + Math.sin(time * 2) * 0.05;
    });

    group.add(controlGroup);

    // ============================================================================
    // PARTS METADATA EXPORT
    // ============================================================================
    
    parts.push({
        name: "Linear Accelerator Injector",
        description: "Accelerates source protons to relativistic speeds using RF cavities before injection into the main synchrotron ring.",
        material: aluminum,
        function: "Initial acceleration and bunching of protons.",
        assemblyOrder: 1,
        connections: ["Proton Source Dome", "Synchrotron Injection Kicker"],
        failureEffect: "Loss of beam current, halting antiproton production.",
        cascadeFailures: ["Synchrotron Starvation", "Target Temperature Drop"],
        originalPosition: { x: -600, y: 0, z: 0 },
        explodedPosition: { x: -1000, y: 200, z: 0 }
    });
    
    parts.push({
        name: "Proton Synchrotron Ring",
        description: "Massive torus containing 120 alternating gradient dipole and quadrupole magnets to accelerate protons to 26 GeV.",
        material: steel,
        function: "Boosts protons to the kinetic energy required for antiproton production.",
        assemblyOrder: 2,
        connections: ["Linac Injector", "Extractor Line", "Cryogenic Systems"],
        failureEffect: "Catastrophic beam dump. Massive radiation spike.",
        cascadeFailures: ["Quench in Superconducting Magnets", "Vacuum Breach"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 500, z: 0 }
    });

    parts.push({
        name: "Tungsten Target Monolith",
        description: "Heavily shielded tungsten core where 26 GeV protons collide to produce proton-antiproton pairs.",
        material: matTargetTungsten,
        function: "Provides dense nuclei for inelastic collisions producing antiprotons.",
        assemblyOrder: 3,
        connections: ["Synchrotron Extractor", "Magnetic Horn"],
        failureEffect: "Target melting and vaporization, massive radioactive contamination.",
        cascadeFailures: ["Horn Destruction", "Area Denial"],
        originalPosition: { x: ringRadius + 50, y: 0, z: 150 },
        explodedPosition: { x: ringRadius + 200, y: 100, z: 300 }
    });

    parts.push({
        name: "Magnetic Horn (Lithium Lens)",
        description: "Pulses with 400 kA of current to create a toroidal magnetic field, focusing divergent antiprotons.",
        material: aluminum,
        function: "Captures and focuses the spray of secondary particles emerging from the target.",
        assemblyOrder: 4,
        connections: ["Target Monolith", "Antiproton Decelerator"],
        failureEffect: "Loss of antiproton yield by 99%.",
        cascadeFailures: ["Overheating of downstream collimators"],
        originalPosition: { x: ringRadius + 50, y: 0, z: 170 },
        explodedPosition: { x: ringRadius + 250, y: 100, z: 400 }
    });

    parts.push({
        name: "Antiproton Decelerator (AD)",
        description: "A ring dedicated to slowing down antiprotons from 3.5 GeV to 5.3 MeV using stochastic and electron cooling.",
        material: copper,
        function: "Reduces the momentum spread and energy of antiprotons so they can be trapped.",
        assemblyOrder: 5,
        connections: ["Magnetic Horn", "Penning-Malmberg Trap"],
        failureEffect: "Antiprotons crash into chamber walls, annihilating uselessly.",
        cascadeFailures: ["Vacuum Degradation"],
        originalPosition: { x: ringRadius + 200, y: -50, z: 400 },
        explodedPosition: { x: ringRadius + 400, y: -200, z: 800 }
    });

    parts.push({
        name: "Surko Positron Accumulator",
        description: "Traps positrons emitted from a Na-22 radioactive source using buffer-gas cooling in a Penning trap.",
        material: steel,
        function: "Provides the dense positron plasma required to combine with antiprotons.",
        assemblyOrder: 6,
        connections: ["Recombination Chamber"],
        failureEffect: "No positrons available for antihydrogen synthesis.",
        cascadeFailures: ["Production Halt"],
        originalPosition: { x: ringRadius + 500, y: -50, z: 100 },
        explodedPosition: { x: ringRadius + 800, y: 0, z: 100 }
    });

    parts.push({
        name: "Recombination Penning-Malmberg Trap",
        description: "Nested cylindrical electrodes in a 3 Tesla uniform magnetic field where antiprotons and positrons are mixed.",
        material: matGoldFoil,
        function: "Facilitates the three-body recombination process to form neutral antihydrogen.",
        assemblyOrder: 7,
        connections: ["Antiproton Decelerator", "Positron Accumulator", "Magnetic Bottle"],
        failureEffect: "Plasmas fail to merge; two-stream instability causes particle loss.",
        cascadeFailures: ["Thermal spike in trap electrodes"],
        originalPosition: { x: ringRadius + 350, y: -100, z: 250 },
        explodedPosition: { x: ringRadius + 600, y: -100, z: 500 }
    });

    parts.push({
        name: "Octupole Magnetic Bottle",
        description: "Complex arrangement of superconducting coils creating a Minimum-B field to trap neutral antihydrogen via its magnetic dipole moment.",
        material: matSuperconductor,
        function: "Long-term confinement of antimatter isolated from physical matter.",
        assemblyOrder: 8,
        connections: ["Recombination Trap", "Cryogenic Cooling"],
        failureEffect: "Containment breach. Antihydrogen touches walls and annihilates.",
        cascadeFailures: ["Catastrophic explosion", "Destruction of factory section"],
        originalPosition: { x: ringRadius + 350, y: -250, z: 250 },
        explodedPosition: { x: ringRadius + 350, y: -600, z: 250 }
    });

    parts.push({
        name: "Cryogenic Heat Exchangers",
        description: "Massive towers pumping liquid helium at 1.9 K to cool superconducting magnets.",
        material: aluminum,
        function: "Maintains superconductivity in the synchrotron and containment coils.",
        assemblyOrder: 9,
        connections: ["Synchrotron Ring", "Magnetic Bottle"],
        failureEffect: "Magnet quench.",
        cascadeFailures: ["Explosive boil-off of liquid helium", "Total system failure"],
        originalPosition: { x: ringRadius - 150, y: 75, z: -200 },
        explodedPosition: { x: ringRadius - 300, y: 300, z: -400 }
    });

    parts.push({
        name: "Central Command Node",
        description: "Suspended control room with holographic diagnostics of plasma stability.",
        material: darkSteel,
        function: "Monitors and orchestrates the millions of precise timings required.",
        assemblyOrder: 10,
        connections: ["All Subsystems"],
        failureEffect: "Loss of automated control, immediate SCRAM triggered.",
        cascadeFailures: ["Controlled beam dump"],
        originalPosition: { x: 0, y: 150, z: 0 },
        explodedPosition: { x: 0, y: 800, z: 0 }
    });

    parts.push({
        name: "Quadrupole Magnet Array",
        description: "120 superconducting quadrupoles arranged in FODO lattices.",
        material: copper,
        function: "Focuses the particle beam, preventing it from spreading out and hitting the vacuum tube walls.",
        assemblyOrder: 11,
        connections: ["Synchrotron Vacuum Tube"],
        failureEffect: "Beam defocuses and destroys the vacuum pipe.",
        cascadeFailures: ["Vacuum Breach", "Radiation leak"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 200, z: -200 }
    });

    parts.push({
        name: "Stochastic Cooling Kickers",
        description: "High-frequency microwave electrodes that measure and correct particle momentum deviations.",
        material: copper,
        function: "Reduces the phase-space volume of the antiproton beam without phase-space violating Liouville's theorem.",
        assemblyOrder: 12,
        connections: ["Antiproton Decelerator"],
        failureEffect: "Beam remains too diffuse to trap efficiently.",
        cascadeFailures: ["Yield drops to near zero"],
        originalPosition: { x: ringRadius + 200, y: -50, z: 400 },
        explodedPosition: { x: ringRadius + 200, y: 150, z: 400 }
    });
    
    parts.push({
        name: "Vacuum Vessel (UHV)",
        description: "Bakeable ultra-high vacuum chambers maintaining pressures below 10^-12 Torr.",
        material: steel,
        function: "Prevents antiprotons from annihilating with residual gas molecules.",
        assemblyOrder: 13,
        connections: ["All Beamlines"],
        failureEffect: "Instantaneous annihilation of trapped antimatter.",
        cascadeFailures: ["Radiation alarms", "Containment loss"],
        originalPosition: { x: ringRadius + 350, y: -250, z: 250 },
        explodedPosition: { x: ringRadius + 500, y: -250, z: 500 }
    });

    parts.push({
        name: "Laser Cooling Array",
        description: "Deep UV Lyman-alpha lasers (121 nm) tuned to the antihydrogen transition frequency.",
        material: glass,
        function: "Cools neutral antihydrogen atoms down to millikelvin temperatures for stable magnetic trapping.",
        assemblyOrder: 14,
        connections: ["Recombination Trap"],
        failureEffect: "Atoms remain too hot and escape the magnetic bottle.",
        cascadeFailures: ["Slow continuous annihilation on walls"],
        originalPosition: { x: ringRadius + 350, y: -100, z: 250 },
        explodedPosition: { x: ringRadius + 350, y: -100, z: 100 }
    });

    parts.push({
        name: "Annihilation Safeguard Sensors",
        description: "Silicon vertex detectors and scintillators wrapped around the containment vault.",
        material: plastic,
        function: "Detects pion tracks from stray annihilations to map the location of containment leaks.",
        assemblyOrder: 15,
        connections: ["Magnetic Bottle", "Command Node"],
        failureEffect: "Blindness to containment degradation.",
        cascadeFailures: ["Unnoticed catastrophic breach build-up"],
        originalPosition: { x: ringRadius + 350, y: -250, z: 250 },
        explodedPosition: { x: ringRadius + 350, y: -400, z: 250 }
    });

    // ============================================================================
    // PHD LEVEL QUIZ QUESTIONS
    // ============================================================================
    const quizQuestions = [
        {
            question: "In the context of the CPT theorem, which fundamental symmetry is strictly conserved in the production and decay of antihydrogen compared to hydrogen, and what does a violation imply?",
            options: [
                "C-symmetry; implies antimatter has different mass.",
                "CP-symmetry; implies the universe shouldn't exist.",
                "CPT-symmetry; implies a breakdown of Lorentz invariance or local quantum field theory.",
                "P-symmetry; implies gravity repels antimatter."
            ],
            correctAnswer: 2,
            explanation: "CPT symmetry is a fundamental tenet of quantum field theory. A violation of CPT would imply a breakdown of Lorentz invariance, meaning the laws of physics vary depending on orientation or velocity, breaking the foundational mathematical structure of modern particle physics."
        },
        {
            question: "During the slowing of antiprotons in a Penning-Malmberg trap, electron cooling is often employed. Which underlying principle dictates the minimum temperature the antiprotons can reach via this method?",
            options: [
                "The Debye length of the electron plasma.",
                "The cyclotron radiation limit of the electrons coupled to the thermal bath of the trap electrodes.",
                "The Brillouin limit of the magnetic field.",
                "The space-charge limit of the non-neutral plasma."
            ],
            correctAnswer: 1,
            explanation: "In electron cooling, electrons rapidly lose heat via cyclotron radiation in the strong magnetic field until they are in thermal equilibrium with the cryogenic environment (e.g., 4K). Antiprotons then reach this temperature through Coulomb collisions with the cold electrons."
        },
        {
            question: "Minimum-B magnetic traps (like the Ioffe-Pritchard or octupole traps) are used to confine neutral antihydrogen. Why is a simple quadrupole field insufficient for long-term confinement?",
            options: [
                "Quadrupole fields cannot reach the necessary tesla range.",
                "Majorana transitions (spin-flips) occur at the field zero in the center, causing the anti-atoms to be ejected.",
                "Quadrupoles produce too much synchrotron radiation.",
                "Quadrupole fields only confine charged particles, not neutral atoms."
            ],
            correctAnswer: 1,
            explanation: "A standard quadrupole magnetic trap has a zero magnetic field exactly at its center. When atoms pass near this zero-field region, their magnetic moments can undergo Majorana spin-flips, changing them from a 'low-field-seeking' trapped state to a 'high-field-seeking' un-trapped state, causing them to be lost."
        },
        {
            question: "The production of antiprotons typically involves colliding high-energy protons with a target. What is the minimum kinetic energy (threshold energy) required for a proton striking a stationary proton target to produce a proton-antiproton pair (p + p -> p + p + p + p-bar)?",
            options: [
                "1.88 GeV",
                "5.63 GeV",
                "938 MeV",
                "13.6 eV"
            ],
            correctAnswer: 1,
            explanation: "Due to relativistic kinematics and the need to conserve momentum, much of the incident proton's energy goes into the center-of-mass motion. The threshold kinetic energy for a fixed-target collision to produce 4 nucleon masses is exactly 6 times the proton mass (~6 * 0.938 GeV = 5.63 GeV)."
        },
        {
            question: "When antihydrogen annihilates with ordinary matter, what is the primary decay pathway and the resulting particles that particle detectors must track to confirm the annihilation event?",
            options: [
                "Positronium emission leading to 2 photons.",
                "Gluon plasma expansion yielding top quarks.",
                "Annihilation into roughly 3 to 4 charged and neutral pions, with neutral pions decaying into pairs of gamma rays.",
                "Direct conversion into a single high-energy Z boson."
            ],
            correctAnswer: 2,
            explanation: "Antiproton-proton (or neutron) annihilations primarily result in a spray of mesons, predominantly 3 to 4 pions on average. The charged pions curve in the magnetic field and hit detectors, while neutral pions almost instantly decay into two gamma-ray photons."
        }
    ];

    const description = "The Ultra God Tier Antimatter Factory. A staggering industrial complex spanning miles, integrating a proton synchrotron, stochastic decel rings, Surko positron accumulators, and Ioffe-Pritchard magnetic traps. Designed to produce, cool, and magnetically confine kilograms of antihydrogen. Extreme caution required: loss of superconducting containment will result in catastrophic annihilation events.";

    function animate(time, speed, meshes) {
        // Run all registered update functions
        for (let i = 0; i < updatables.length; i++) {
            updatables[i](time * speed);
        }
    }

    return { group, parts, description, quizQuestions, animate };
}
