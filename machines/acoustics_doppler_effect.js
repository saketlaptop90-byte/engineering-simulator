import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // ==========================================
    // 1. ADVANCED MATERIALS DEFINITION
    // ==========================================
    
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x0044ff,
        emissive: 0x0088ff,
        emissiveIntensity: 2.0,
        metalness: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.9
    });

    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0044,
        emissiveIntensity: 2.0,
        metalness: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.9
    });

    const plasmaPurple = new THREE.MeshStandardMaterial({
        color: 0x8800ff,
        emissive: 0xaa00ff,
        emissiveIntensity: 3.0,
        wireframe: true
    });

    const hyperAlloy = new THREE.MeshStandardMaterial({
        color: 0x8899aa,
        metalness: 0.95,
        roughness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const superconductingCoil = new THREE.MeshStandardMaterial({
        color: 0xb87333,
        metalness: 1.0,
        roughness: 0.3,
        emissive: 0x331100,
        emissiveIntensity: 0.5
    });
    
    const HUDMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
    });

    const dopplerEmitterFrontMat = new THREE.MeshStandardMaterial({
        color: 0x00ff00, // Starts green
        emissive: 0x00ff00,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.95
    });

    const dopplerEmitterRearMat = new THREE.MeshStandardMaterial({
        color: 0x00ff00, // Starts green
        emissive: 0x00ff00,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.95
    });

    meshes.dopplerFrontMat = dopplerEmitterFrontMat;
    meshes.dopplerRearMat = dopplerEmitterRearMat;

    // ==========================================
    // 2. MAGLEV TRACK GENERATION
    // ==========================================
    const trackGroup = new THREE.Group();
    const trackLength = 2000;
    const magnetSpacing = 5;
    const magnetCount = Math.floor(trackLength / magnetSpacing);

    // Track Bed Foundation
    const bedGeom = new THREE.BoxGeometry(20, 2, trackLength);
    const bedMesh = new THREE.Mesh(bedGeom, darkSteel);
    bedMesh.position.y = -5;
    trackGroup.add(bedMesh);

    // Magnetic Rails (Left and Right)
    const railGeom = new THREE.BoxGeometry(2, 4, trackLength);
    const leftRail = new THREE.Mesh(railGeom, steel);
    leftRail.position.set(-6, -2, 0);
    trackGroup.add(leftRail);

    const rightRail = new THREE.Mesh(railGeom, steel);
    rightRail.position.set(6, -2, 0);
    trackGroup.add(rightRail);

    // Electromagnets along rails (InstancedMesh for massive scale)
    const magGeom = new THREE.CylinderGeometry(1.5, 1.5, 4, 16);
    magGeom.rotateX(Math.PI / 2);
    const leftMagInst = new THREE.InstancedMesh(magGeom, superconductingCoil, magnetCount);
    const rightMagInst = new THREE.InstancedMesh(magGeom, superconductingCoil, magnetCount);
    const dummy = new THREE.Object3D();

    let idx = 0;
    for(let z = -trackLength/2; z < trackLength/2; z += magnetSpacing) {
        dummy.position.set(-6, -2, z);
        dummy.updateMatrix();
        leftMagInst.setMatrixAt(idx, dummy.matrix);
        
        dummy.position.set(6, -2, z);
        dummy.updateMatrix();
        rightMagInst.setMatrixAt(idx, dummy.matrix);
        idx++;
    }
    trackGroup.add(leftMagInst);
    trackGroup.add(rightMagInst);

    // Cryogenic Cooling Conduits (Pipes)
    const pipeGeom = new THREE.CylinderGeometry(0.5, 0.5, trackLength, 12);
    pipeGeom.rotateX(Math.PI / 2);
    
    const leftPipe1 = new THREE.Mesh(pipeGeom, chrome);
    leftPipe1.position.set(-8, -4, 0);
    trackGroup.add(leftPipe1);
    
    const leftPipe2 = new THREE.Mesh(pipeGeom, chrome);
    leftPipe2.position.set(-8.5, -3, 0);
    trackGroup.add(leftPipe2);

    const rightPipe1 = new THREE.Mesh(pipeGeom, chrome);
    rightPipe1.position.set(8, -4, 0);
    trackGroup.add(rightPipe1);
    
    const rightPipe2 = new THREE.Mesh(pipeGeom, chrome);
    rightPipe2.position.set(8.5, -3, 0);
    trackGroup.add(rightPipe2);

    // Structural Ribs underneath
    const ribGeom = new THREE.BoxGeometry(24, 2, 1);
    const ribInst = new THREE.InstancedMesh(ribGeom, darkSteel, magnetCount / 2);
    idx = 0;
    for(let z = -trackLength/2; z < trackLength/2; z += magnetSpacing * 2) {
        dummy.position.set(0, -6, z);
        dummy.updateMatrix();
        ribInst.setMatrixAt(idx, dummy.matrix);
        idx++;
    }
    trackGroup.add(ribInst);

    // Track Status Lights (Instanced)
    const lightGeom = new THREE.SphereGeometry(0.3, 8, 8);
    const trackLights = new THREE.InstancedMesh(lightGeom, neonBlue, magnetCount);
    idx = 0;
    for(let z = -trackLength/2; z < trackLength/2; z += magnetSpacing) {
        dummy.position.set(-10, -1, z);
        dummy.updateMatrix();
        trackLights.setMatrixAt(idx, dummy.matrix);
        idx++;
    }
    trackGroup.add(trackLights);
    meshes.trackLights = trackLights;
    meshes.trackLightsBaseZ = -trackLength/2;
    meshes.trackLightsSpacing = magnetSpacing;
    meshes.trackLightsCount = magnetCount;

    group.add(trackGroup);

    // ==========================================
    // 3. SLED HULL & CHASSIS
    // ==========================================
    const sledGroup = new THREE.Group();
    meshes.sledGroup = sledGroup;

    // Aerodynamic / Relativistic Main Hull
    const hullPoints = [];
    hullPoints.push(new THREE.Vector2(0, 30));    // Nose tip
    hullPoints.push(new THREE.Vector2(1, 25));
    hullPoints.push(new THREE.Vector2(2.5, 15));
    hullPoints.push(new THREE.Vector2(3.5, 5));
    hullPoints.push(new THREE.Vector2(4.0, -5));  // Mid section
    hullPoints.push(new THREE.Vector2(4.0, -15));
    hullPoints.push(new THREE.Vector2(4.5, -20)); // Engine bulge
    hullPoints.push(new THREE.Vector2(4.5, -25));
    hullPoints.push(new THREE.Vector2(3.0, -30)); // Taper back
    hullPoints.push(new THREE.Vector2(2.0, -32));
    
    const hullGeom = new THREE.LatheGeometry(hullPoints, 64);
    hullGeom.rotateX(-Math.PI / 2); // Align with Z axis (forward is -Z, backward is +Z)
    const hullMesh = new THREE.Mesh(hullGeom, hyperAlloy);
    sledGroup.add(hullMesh);

    // Lateral Heat Radiators
    for (let side = -1; side <= 1; side += 2) {
        const radiatorGroup = new THREE.Group();
        for(let i=0; i<15; i++) {
            const finGeom = new THREE.BoxGeometry(3, 8, 0.2);
            const fin = new THREE.Mesh(finGeom, darkSteel);
            fin.position.set(0, 0, i * 0.8 - 6);
            radiatorGroup.add(fin);
        }
        radiatorGroup.position.set(side * 5, 0, 0);
        radiatorGroup.rotation.z = side * Math.PI / 8;
        sledGroup.add(radiatorGroup);
    }

    // Magnetic Levitation Skids
    const skidGeom = new THREE.BoxGeometry(2, 2, 40);
    const leftSkid = new THREE.Mesh(skidGeom, chrome);
    leftSkid.position.set(-6, -3, 0);
    sledGroup.add(leftSkid);

    const rightSkid = new THREE.Mesh(skidGeom, chrome);
    rightSkid.position.set(6, -3, 0);
    sledGroup.add(rightSkid);

    // Skid Connectors
    const connectorGeom = new THREE.CylinderGeometry(0.5, 0.5, 6, 16);
    connectorGeom.rotateZ(Math.PI / 2);
    for (let zOffset of [-15, 0, 15]) {
        const connL = new THREE.Mesh(connectorGeom, steel);
        connL.position.set(-4, -1.5, zOffset);
        connL.rotation.y = Math.PI / 6;
        sledGroup.add(connL);

        const connR = new THREE.Mesh(connectorGeom, steel);
        connR.position.set(4, -1.5, zOffset);
        connR.rotation.y = -Math.PI / 6;
        sledGroup.add(connR);
    }

    // ==========================================
    // 4. RELATIVISTIC ENGINES & CORES
    // ==========================================

    // Anti-Matter Containment Core (Visible in center)
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, 1, -5);
    
    const coreSphere = new THREE.Mesh(new THREE.IcosahedronGeometry(2, 4), plasmaPurple);
    coreGroup.add(coreSphere);

    const containmentRings = [];
    for(let i=0; i<4; i++) {
        const ringGeom = new THREE.TorusGeometry(2.5 + i*0.2, 0.1, 16, 64);
        const ring = new THREE.Mesh(ringGeom, chrome);
        ring.rotation.x = Math.random() * Math.PI;
        ring.rotation.y = Math.random() * Math.PI;
        coreGroup.add(ring);
        containmentRings.push({ mesh: ring, axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(), speed: 0.05 + i*0.02 });
    }
    meshes.containmentRings = containmentRings;
    sledGroup.add(coreGroup);

    // Main Propulsion Thrusters (Rear)
    const thrusterGroup = new THREE.Group();
    thrusterGroup.position.set(0, 0, 32); // Back of the sled
    
    const mainNozzleGeom = new THREE.CylinderGeometry(1, 3, 6, 32);
    mainNozzleGeom.rotateX(Math.PI / 2);
    const mainNozzle = new THREE.Mesh(mainNozzleGeom, darkSteel);
    thrusterGroup.add(mainNozzle);

    // Exhaust Plume (Animated later)
    const plumeGeom = new THREE.ConeGeometry(2.8, 15, 32);
    plumeGeom.rotateX(Math.PI / 2);
    plumeGeom.translate(0, 0, 10); // Shift back
    const plumeMesh = new THREE.Mesh(plumeGeom, neonRed);
    thrusterGroup.add(plumeMesh);
    meshes.rearPlume = plumeMesh;

    sledGroup.add(thrusterGroup);

    // Retro-Braking Thrusters (Front)
    for(let i=0; i<4; i++) {
        const retroGeom = new THREE.CylinderGeometry(0.2, 0.6, 2, 16);
        retroGeom.rotateX(-Math.PI / 2);
        const retro = new THREE.Mesh(retroGeom, steel);
        
        const angle = (i / 4) * Math.PI * 2 + Math.PI/4;
        retro.position.set(Math.cos(angle)*3, Math.sin(angle)*3, -25);
        
        // Retro exhaust
        const retroExhaustGeom = new THREE.ConeGeometry(0.5, 4, 16);
        retroExhaustGeom.rotateX(-Math.PI / 2);
        retroExhaustGeom.translate(0, 0, -3);
        const retroExhaust = new THREE.Mesh(retroExhaustGeom, neonBlue);
        retroExhaust.visible = false; // toggled in animate
        retro.add(retroExhaust);
        
        if (!meshes.retroExhausts) meshes.retroExhausts = [];
        meshes.retroExhausts.push(retroExhaust);

        sledGroup.add(retro);
    }

    // ==========================================
    // 5. COCKPIT & SENSORS
    // ==========================================
    
    const cockpitGroup = new THREE.Group();
    cockpitGroup.position.set(0, 3.5, -12);
    
    const canopyGeom = new THREE.SphereGeometry(2.5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    canopyGeom.scale(1, 0.6, 1.5);
    const canopy = new THREE.Mesh(canopyGeom, tinted);
    cockpitGroup.add(canopy);

    // Cockpit Interior (visible through tinted glass)
    const seatGeom = new THREE.BoxGeometry(1, 1.5, 1);
    const seat = new THREE.Mesh(seatGeom, rubber);
    seat.position.set(0, -0.5, 0.5);
    cockpitGroup.add(seat);

    const controlPanelGeom = new THREE.BoxGeometry(2, 0.5, 1);
    const controlPanel = new THREE.Mesh(controlPanelGeom, darkSteel);
    controlPanel.position.set(0, -0.5, -1);
    controlPanel.rotation.x = Math.PI / 4;
    cockpitGroup.add(controlPanel);

    // HUD Screens
    for(let i=0; i<3; i++) {
        const holoGeom = new THREE.PlaneGeometry(1.2, 0.8);
        const holo = new THREE.Mesh(holoGeom, HUDMaterial);
        holo.position.set((i-1)*1.3, 0.5, -1.2 + Math.abs(i-1)*0.5);
        holo.rotation.y = (i-1) * -Math.PI/6;
        cockpitGroup.add(holo);
    }

    sledGroup.add(cockpitGroup);

    // ==========================================
    // 6. DOPPLER EMITTERS (THE CORE EXPERIMENT)
    // ==========================================

    // Forward Emitter Array (Nose)
    const frontEmitterGroup = new THREE.Group();
    frontEmitterGroup.position.set(0, 0, -31);
    
    const frontDishGeom = new THREE.CylinderGeometry(0.1, 1.5, 2, 32);
    frontDishGeom.rotateX(Math.PI / 2);
    const frontDish = new THREE.Mesh(frontDishGeom, chrome);
    frontEmitterGroup.add(frontDish);

    const frontBulbGeom = new THREE.SphereGeometry(0.8, 32, 32);
    const frontBulb = new THREE.Mesh(frontBulbGeom, dopplerEmitterFrontMat);
    frontBulb.position.z = -1.5;
    frontEmitterGroup.add(frontBulb);
    meshes.frontBulb = frontBulb;

    // Laser beam visualization (Forward)
    const fwdBeamGeom = new THREE.CylinderGeometry(0.2, 0.2, 200, 16);
    fwdBeamGeom.rotateX(Math.PI / 2);
    fwdBeamGeom.translate(0, 0, -100); // extends far forward
    const fwdBeam = new THREE.Mesh(fwdBeamGeom, dopplerEmitterFrontMat);
    frontEmitterGroup.add(fwdBeam);

    sledGroup.add(frontEmitterGroup);

    // Rear Emitter Array (Above main thruster)
    const rearEmitterGroup = new THREE.Group();
    rearEmitterGroup.position.set(0, 3, 30);
    
    const rearDishGeom = new THREE.CylinderGeometry(1.5, 0.1, 1, 32);
    rearDishGeom.rotateX(Math.PI / 2);
    const rearDish = new THREE.Mesh(rearDishGeom, chrome);
    rearEmitterGroup.add(rearDish);

    const rearBulbGeom = new THREE.SphereGeometry(0.8, 32, 32);
    const rearBulb = new THREE.Mesh(rearBulbGeom, dopplerEmitterRearMat);
    rearBulb.position.z = 1.0;
    rearEmitterGroup.add(rearBulb);
    meshes.rearBulb = rearBulb;

    // Laser beam visualization (Backward)
    const rearBeamGeom = new THREE.CylinderGeometry(0.2, 0.2, 200, 16);
    rearBeamGeom.rotateX(Math.PI / 2);
    rearBeamGeom.translate(0, 0, 100); // extends far backward
    const rearBeam = new THREE.Mesh(rearBeamGeom, dopplerEmitterRearMat);
    rearEmitterGroup.add(rearBeam);

    sledGroup.add(rearEmitterGroup);

    // ==========================================
    // 7. RELATIVISTIC DEFLECTOR DISH
    // ==========================================
    // Creates a bubble to push interstellar dust out of the way
    const deflectorGroup = new THREE.Group();
    for (let i = 0; i < 24; i++) {
        const plateGeom = new THREE.BoxGeometry(2.5, 0.2, 6);
        const plate = new THREE.Mesh(plateGeom, chrome);
        const angle = (i / 24) * Math.PI * 2;
        plate.position.set(Math.cos(angle) * 4, Math.sin(angle) * 4, -22);
        plate.rotation.z = angle;
        plate.rotation.x = Math.PI / 5; // Angled outward like an umbrella
        deflectorGroup.add(plate);
    }
    sledGroup.add(deflectorGroup);

    // Add sled to main group
    group.add(sledGroup);

    // ==========================================
    // 8. SPACE-TIME WARP VISUALIZERS
    // ==========================================
    const warpGroup = new THREE.Group();
    const ringCount = 80;
    const rings = [];
    for (let i = 0; i < ringCount; i++) {
        const ringGeom = new THREE.TorusGeometry(18 + (i%5)*0.5, 0.3, 16, 64);
        const ringMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.0, 
            emissive: 0x4444ff,
            emissiveIntensity: 0.0,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const ring = new THREE.Mesh(ringGeom, ringMat);
        
        // Distribute rings evenly along the entire 2000m track
        ring.position.z = -trackLength/2 + (i / ringCount) * trackLength; 
        warpGroup.add(ring);
        rings.push({ mesh: ring, baseZ: ring.position.z });
    }
    group.add(warpGroup);
    meshes.warpRings = rings;

    // ==========================================
    // 9. PARTS METADATA & LORE
    // ==========================================

    parts.push({
        name: "Superconducting Magnetic Track",
        description: "A 2-kilometer linear accelerator track lined with millions of neodymium-yttrium electromagnets capable of sustaining 50,000 Tesla fields.",
        material: "Steel / Copper / Superconductors",
        function: "Provides the immense repulsive force required to levitate and accelerate the relativistic sled to 0.99c.",
        assemblyOrder: 1,
        connections: ["Track Electromagnet Array", "Cryogenic Cooling Conduits", "Structural Ribs"],
        failureEffect: "Track misalignment at relativistic speeds results in instantaneous vaporization of the sled and surrounding 5 km radius.",
        cascadeFailures: ["Inertial Dampener Core", "Relativistic Sled Hull"],
        originalPosition: { x: 0, y: -5, z: 0 },
        explodedPosition: { x: 0, y: -50, z: 0 }
    });

    parts.push({
        name: "Relativistic Sled Hull",
        description: "The primary chassis constructed from a carbon-nanotube reinforced hyper-alloy, designed to withstand extreme aerodynamic shear and micro-meteorite impacts at near c.",
        material: "Hyper-Alloy Matrix",
        function: "Houses all internal systems and provides an aerodynamic profile to minimize atmospheric drag (though normally operated in a vacuum tube).",
        assemblyOrder: 2,
        connections: ["Magnetic Levitation Skids", "Anti-Matter Confinement Core", "Cockpit Canopy"],
        failureEffect: "Hull breach at 0.99c causes instantaneous atmospheric plasma incineration of internal components.",
        cascadeFailures: ["Cockpit Canopy", "Quantum Sensor Suite"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 30, z: 0 }
    });

    parts.push({
        name: "Magnetic Levitation Skids",
        description: "Twin underside rails utilizing quantum flux pinning to lock the sled securely to the magnetic track fields.",
        material: "Yttrium Barium Copper Oxide (YBCO)",
        function: "Levitates the sled friction-free and transfers immense linear acceleration forces from the track directly to the chassis.",
        assemblyOrder: 3,
        connections: ["Relativistic Sled Hull", "Superconducting Magnetic Track"],
        failureEffect: "Loss of quantum lock causes catastrophic physical collision with the track at relativistic speeds.",
        cascadeFailures: ["Relativistic Sled Hull"],
        originalPosition: { x: 0, y: -3, z: 0 },
        explodedPosition: { x: 0, y: -20, z: 0 }
    });

    parts.push({
        name: "Anti-Matter Confinement Core",
        description: "A nested Penning trap utilizing dynamically shifting multipole magnetic fields to suspend anti-hydrogen plasma.",
        material: "Plasma / Magnetic Confinement Coils",
        function: "Provides the immense energy required for both propulsion and the relativistic inertial dampening fields.",
        assemblyOrder: 4,
        connections: ["Main Propulsion Nozzle", "Relativistic Sled Hull"],
        failureEffect: "Containment failure results in matter-antimatter annihilation, yielding an uncontrolled 50-megaton explosion.",
        cascadeFailures: ["Relativistic Sled Hull", "Superconducting Magnetic Track"],
        originalPosition: { x: 0, y: 1, z: -5 },
        explodedPosition: { x: -30, y: 10, z: -5 }
    });

    parts.push({
        name: "Forward Doppler Emitter Array",
        description: "A high-precision quantum laser that emits photons at a strictly calibrated rest frequency of 600 THz (green).",
        material: "Chrome / Emissive Crystals",
        function: "Fires forward continuously. As the sled approaches c, stationary observers ahead see this light violently blueshifted into lethal gamma rays.",
        assemblyOrder: 5,
        connections: ["Relativistic Sled Hull", "Quantum Sensor Suite"],
        failureEffect: "Loss of experimental data regarding longitudinal relativistic Doppler shift.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: -31 },
        explodedPosition: { x: 0, y: 0, z: -60 }
    });

    parts.push({
        name: "Aft Doppler Emitter Array",
        description: "Matches the forward array, emitting identically calibrated 600 THz photons backward.",
        material: "Chrome / Emissive Crystals",
        function: "Fires backward. As the sled accelerates away, stationary observers behind see this light violently redshifted into invisible low-energy radio waves.",
        assemblyOrder: 6,
        connections: ["Relativistic Sled Hull", "Main Propulsion Nozzle"],
        failureEffect: "Loss of redshift metrics.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 3, z: 30 },
        explodedPosition: { x: 0, y: 20, z: 60 }
    });

    parts.push({
        name: "Relativistic Deflector Dish",
        description: "A 24-plate geometric array that generates a highly localized spatial fold.",
        material: "Chrome / Superconductors",
        function: "Sweeps stray hydrogen atoms and micro-dust out of the sled's path. At 0.99c, a grain of sand hits with the kinetic energy of a tactical nuke.",
        assemblyOrder: 7,
        connections: ["Relativistic Sled Hull"],
        failureEffect: "Impacts rapidly ablate the forward hull, tearing the sled apart within microseconds.",
        cascadeFailures: ["Forward Doppler Emitter Array", "Cockpit Canopy"],
        originalPosition: { x: 0, y: 0, z: -22 },
        explodedPosition: { x: 40, y: 0, z: -40 }
    });

    parts.push({
        name: "Main Propulsion Nozzle",
        description: "A heavily shielded magnetic nozzle that directs the intense gamma radiation and pion exhaust from matter-antimatter annihilation.",
        material: "Dark Steel / Tungsten",
        function: "Provides secondary propulsion when track acceleration is insufficient, or for extreme deep-space maneuvers.",
        assemblyOrder: 8,
        connections: ["Anti-Matter Confinement Core"],
        failureEffect: "Exhaust plume destabilization vaporizes the aft section of the sled.",
        cascadeFailures: ["Aft Doppler Emitter Array"],
        originalPosition: { x: 0, y: 0, z: 32 },
        explodedPosition: { x: 0, y: 0, z: 60 }
    });

    parts.push({
        name: "Retro-Braking Thrusters",
        description: "Four forward-canted high-impulse plasma thrusters.",
        material: "Steel",
        function: "Fires to decelerate the sled safely at the end of the 2km track, enduring forces exceeding 100,000 Gs.",
        assemblyOrder: 9,
        connections: ["Relativistic Sled Hull"],
        failureEffect: "Sled fails to stop, blasting through the track terminus at relativistic speeds.",
        cascadeFailures: ["Relativistic Sled Hull", "Superconducting Magnetic Track"],
        originalPosition: { x: 0, y: 0, z: -25 },
        explodedPosition: { x: -30, y: 0, z: -25 }
    });

    parts.push({
        name: "Cockpit Canopy",
        description: "A solid dome of synthetic hyper-diamond, doped with heavy elements.",
        material: "Tinted Diamond Glass",
        function: "Protects the (presumably artificial or highly resilient) operator from blueshifted interstellar radiation and X-rays.",
        assemblyOrder: 10,
        connections: ["Relativistic Sled Hull"],
        failureEffect: "Pilot is immediately cooked by blueshifted Cosmic Microwave Background radiation.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 3.5, z: -12 },
        explodedPosition: { x: 0, y: 25, z: -12 }
    });

    parts.push({
        name: "Quantum Sensor Suite",
        description: "Array of incredibly sensitive atomic clocks and interferometers.",
        material: "Various",
        function: "Records local proper time and compares it against stationary coordinate time to verify time dilation (dt = gamma * dtau).",
        assemblyOrder: 11,
        connections: ["Cockpit Canopy", "Data Telemetry Array"],
        failureEffect: "Experiment fails to log verifiable relativistic effects.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: -10 },
        explodedPosition: { x: 20, y: 15, z: -10 }
    });

    parts.push({
        name: "Track Electromagnet Array",
        description: "The primary stationary drive coils.",
        material: "Superconducting Coil",
        function: "Pulses in sequence to drag the sled forward using traveling magnetic waves.",
        assemblyOrder: 12,
        connections: ["Superconducting Magnetic Track"],
        failureEffect: "Propulsion stalls.",
        cascadeFailures: [],
        originalPosition: { x: -6, y: -2, z: 0 },
        explodedPosition: { x: -40, y: -2, z: 0 }
    });

    parts.push({
        name: "Cryogenic Cooling Conduits",
        description: "Tubes flowing with liquid helium at 1.8 Kelvin.",
        material: "Chrome",
        function: "Maintains the superconducting state of the track electromagnets. Without this, the coils would instantly melt from resistance.",
        assemblyOrder: 13,
        connections: ["Superconducting Magnetic Track"],
        failureEffect: "Magnets quench explosively, destroying the track.",
        cascadeFailures: ["Track Electromagnet Array", "Superconducting Magnetic Track"],
        originalPosition: { x: -8, y: -4, z: 0 },
        explodedPosition: { x: -30, y: -15, z: 0 }
    });

    parts.push({
        name: "Spacetime Warp Visualizer Rings",
        description: "Holographic projection rings distributed along the track.",
        material: "Holographic Light",
        function: "Reacts to the sled's immense gravitational and kinetic footprint, visually mapping Lorentz contraction and space-time curvature.",
        assemblyOrder: 14,
        connections: ["Superconducting Magnetic Track"],
        failureEffect: "Loss of visual audience appeal.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 50, z: 0 }
    });

    parts.push({
        name: "Data Telemetry Array",
        description: "High-gain tightbeam transmitter.",
        material: "Chrome",
        function: "Beams the sensor data back to base. Must compensate for immense Doppler shift just to maintain signal lock.",
        assemblyOrder: 15,
        connections: ["Relativistic Sled Hull"],
        failureEffect: "Sled data is isolated in its own reference frame.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 5, z: 10 },
        explodedPosition: { x: 0, y: 30, z: 10 }
    });

    // ==========================================
    // 10. DOCTORATE LEVEL QUIZ
    // ==========================================
    const quizQuestions = [
        {
            question: "The God-Tier Relativistic Sled is moving at velocity $v = 0.8c$ directly towards an observer. It emits a laser pulse at a rest wavelength of $\\lambda_0 = 500 \\text{ nm}$ (green). Calculate the observed wavelength $\\lambda_{obs}$ considering the longitudinal relativistic Doppler effect.",
            options: [
                "166.67 nm (Ultraviolet)",
                "1500 nm (Infrared)",
                "277.78 nm (Ultraviolet)",
                "900 nm (Infrared)"
            ],
            correctIndex: 0,
            explanation: "Formula: $\\lambda_{obs} = \\lambda_0 \\sqrt{\\frac{1 - \\beta}{1 + \\beta}}$ where $\\beta = v/c = 0.8$. $\\lambda_{obs} = 500 \\times \\sqrt{\\frac{1 - 0.8}{1 + 0.8}} = 500 \\times \\sqrt{\\frac{0.2}{1.8}} = 500 \\times \\sqrt{\\frac{1}{9}} = 500 \\times \\frac{1}{3} = 166.67 \\text{ nm}$."
        },
        {
            question: "If the sled undergoes constant proper acceleration $\\alpha$ starting from rest, the rapidity $\\eta$ after proper time $\\tau$ is given by $\\eta = \\alpha \\tau / c$. What is the relationship between the observed frequency $f_{obs}$ of a signal emitted forward by the sled, and its rest frequency $f_0$, as measured by an observer infinitely far ahead on the track?",
            options: [
                "$f_{obs} = f_0 e^{\\alpha \\tau / c}$",
                "$f_{obs} = f_0 \\cosh(\\alpha \\tau / c)$",
                "$f_{obs} = f_0 (1 + \\alpha \\tau / c)$",
                "$f_{obs} = f_0 \\gamma (1 + \\beta)$"
            ],
            correctIndex: 0,
            explanation: "The longitudinal relativistic Doppler shift formula in terms of rapidity $\\eta$ simplifies beautifully to $f_{obs} = f_0 e^\\eta$. Since $\\eta = \\alpha \\tau / c$, the observed frequency exponentially blueshifts as proper time elapses."
        },
        {
            question: "Consider the transverse Doppler effect. The sled passes an observer such that its point of closest approach is distance $d$. At the exact moment the sled is geometrically at the closest point (angle $90^\\circ$ in the observer's frame), the observer receives a photon emitted earlier. Due to time dilation, what is the frequency shift of this specifically received photon?",
            options: [
                "It is redshifted by a factor of $1/\\gamma$ (i.e. $f_{obs} = f_0 / \\gamma$).",
                "It is blueshifted by $\\gamma$.",
                "There is no shift ($f_{obs} = f_0$).",
                "It is redshifted by $1/\\gamma^2$."
            ],
            correctIndex: 0,
            explanation: "In the observer's frame, when the source is strictly transverse ($\\theta = 90^\\circ$), $\\cos(90^\\circ) = 0$. The general formula $f_{obs} = \\frac{f_0}{\\gamma (1 - \\beta \\cos\\theta)}$ reduces to $f_{obs} = f_0 / \\gamma$. This is a purely relativistic redshift due to time dilation of the source's clocks."
        },
        {
            question: "The sled features an anti-matter containment core. If a mass $m$ of antimatter completely annihilates with mass $m$ of matter, generating photons that are all directed precisely backward to provide thrust, what is the final velocity $v$ of the sled (initial mass $M$) if it starts from rest? (Assume ideal photon rocket).",
            options: [
                "$v/c = \\frac{1 - (M_f/M_i)^2}{1 + (M_f/M_i)^2}$ where $M_f = M_i - 2m$",
                "$v/c = 1 - e^{-2m/M}$",
                "$v/c = \\frac{2mc^2}{M}$",
                "$v/c = \\sqrt{1 - (M_f/M_i)^2}$"
            ],
            correctIndex: 0,
            explanation: "For an ideal relativistic photon rocket, the conservation of energy and momentum yields the relation $M_f / M_i = \\sqrt{\\frac{1 - \\beta}{1 + \\beta}}$. Solving for $\\beta$ gives $\\beta = \\frac{1 - (M_f/M_i)^2}{1 + (M_f/M_i)^2}$."
        },
        {
            question: "As the sled reaches $\\gamma = 100$, the headlight effect (relativistic beaming) concentrates the emitted radiation into a narrow forward cone. What is the approximate half-angle $\\theta$ (in radians) of the cone that contains half the emitted power, assuming the source emits isotropically in its rest frame?",
            options: [
                "$\\theta \\approx 1/\\gamma = 0.01$ rad",
                "$\\theta \\approx \\pi / \\gamma = 0.0314$ rad",
                "$\\theta \\approx 1/\\gamma^2 = 0.0001$ rad",
                "$\\theta \\approx \\sqrt{1 - 1/\\gamma^2} \\approx 0.9999$ rad"
            ],
            correctIndex: 0,
            explanation: "Due to relativistic aberration, a ray emitted at $90^\\circ$ in the source's rest frame (which bounds half the isotropic emission) is swept forward into the observer's frame at an angle given by $\\sin\\theta = 1/\\gamma$. For large $\\gamma$, small angle approximation gives $\\theta \\approx 1/\\gamma$ radians."
        }
    ];

    // ==========================================
    // 11. ANIMATION & RELATIVISTIC PHYSICS ENGINE
    // ==========================================

    // Helper: Map Doppler factor to an intense HSL color
    function getDopplerColor(factor) {
        // factor = 1.0 -> Rest (Green, Hue 0.33)
        // factor > 1.0 -> Blueshift (Hue moves toward 0.6 Violet, Lightness increases)
        // factor < 1.0 -> Redshift (Hue moves toward 0.0 Red, Lightness decreases)
        let hue = 0.33;
        let lightness = 0.5;
        
        if (factor > 1) {
            // Blueshift
            // A factor of 2.0 means double frequency.
            // Let's scale it so extreme blueshift maxes out at violet.
            const shift = Math.min((factor - 1) / 3, 1.0); 
            hue = 0.33 + shift * 0.35; // max ~0.68 (deep violet)
            lightness = 0.5 + shift * 0.4; // Gets intensely bright (blinding)
        } else {
            // Redshift
            const shift = Math.min((1 - factor), 1.0); 
            hue = 0.33 - shift * 0.33; // min ~0.0 (red)
            lightness = 0.5 - shift * 0.3; // Gets darker, fading to infrared
        }
        return new THREE.Color().setHSL(hue, 1.0, Math.max(0.1, Math.min(lightness, 1.0)));
    }

    function animate(time, speed, meshes) {
        // Base oscillation time
        const t = time * speed * 0.3;
        
        // Track bounds
        const maxZ = 800; // Oscillate between -800 and +800
        
        // Position: complex sinusoidal back and forth
        // Using a smoothstep-like wave to simulate high acceleration at ends, high uniform speed in middle
        const sledZ = Math.sin(t) * maxZ;
        
        // Velocity dz/dt is cosine. 
        // Max velocity occurs at z=0.
        // We define 'c' such that max velocity approaches 0.99c.
        const vRaw = Math.cos(t); // ranges -1 to 1
        const maxBeta = 0.95; // 95% speed of light peak
        const beta = vRaw * maxBeta; 
        
        // Apply position
        if (meshes.sledGroup) {
            meshes.sledGroup.position.z = sledZ;
            
            // Subtle vibration at high speeds
            const vibration = Math.abs(beta) * 0.5;
            meshes.sledGroup.position.x = (Math.random() - 0.5) * vibration;
            meshes.sledGroup.position.y = (Math.random() - 0.5) * vibration;
        }

        // Calculate Doppler shifts for Forward and Aft arrays
        // Standard formula: f_obs = f_src * sqrt((1 + v/c) / (1 - v/c))
        // Note: forward is -Z. If velocity is negative (moving towards -Z), beta_fwd is positive relative to an observer at -Z.
        const beta_fwd = -beta; // Moving towards front observer
        const beta_aft = beta;  // Moving towards rear observer
        
        const doppler_fwd = Math.sqrt((1 + beta_fwd) / (1 - beta_fwd));
        const doppler_aft = Math.sqrt((1 + beta_aft) / (1 - beta_aft));

        // Apply colors to materials
        if (meshes.dopplerFrontMat) {
            const colorFwd = getDopplerColor(doppler_fwd);
            meshes.dopplerFrontMat.color.copy(colorFwd);
            meshes.dopplerFrontMat.emissive.copy(colorFwd);
            meshes.dopplerFrontMat.emissiveIntensity = 2.5 * doppler_fwd;
        }

        if (meshes.dopplerRearMat) {
            const colorAft = getDopplerColor(doppler_aft);
            meshes.dopplerRearMat.color.copy(colorAft);
            meshes.dopplerRearMat.emissive.copy(colorAft);
            meshes.dopplerRearMat.emissiveIntensity = 2.5 * doppler_aft;
        }

        // Animate Anti-matter containment rings
        if (meshes.containmentRings) {
            meshes.containmentRings.forEach(ring => {
                // Spin faster as speed increases
                ring.mesh.rotateOnAxis(ring.axis, ring.speed * (1 + Math.abs(beta) * 5));
            });
        }

        // Animate Thrusters based on acceleration
        // Acceleration is derivative of velocity: -sin(t)
        const accel = -Math.sin(t); 
        
        // If accel is pushing towards -Z (forward), main thrusters fire
        // If accel is pushing towards +Z (backward), retro thrusters fire
        if (meshes.rearPlume) {
            const pushFwd = Math.max(0, -accel);
            meshes.rearPlume.scale.set(1 + pushFwd*2, 1 + pushFwd*5, 1 + pushFwd*2);
            meshes.rearPlume.material.opacity = pushFwd;
        }

        if (meshes.retroExhausts) {
            const pushBack = Math.max(0, accel);
            meshes.retroExhausts.forEach(ex => {
                ex.visible = pushBack > 0.1;
                ex.scale.set(1, 1 + pushBack*4, 1);
            });
        }

        // Space Warp Visualizers
        // As sled reaches high velocity, local space appears to contract/warp.
        if (meshes.warpRings) {
            meshes.warpRings.forEach(ringObj => {
                const dz = ringObj.baseZ - sledZ;
                const dist = Math.abs(dz);
                
                // Only rings near the sled react
                if (dist < 150) {
                    const warpFactor = Math.abs(beta); // 0 to 0.95
                    
                    // Lorentz contraction visual: rings stretch along Z axis relative to observer
                    ringObj.mesh.scale.z = 1 + warpFactor * 10 * (1 - dist/150);
                    ringObj.mesh.material.opacity = warpFactor * (1 - dist/150);
                    ringObj.mesh.material.emissiveIntensity = warpFactor * 5;
                    
                    // Color denotes direction of warp
                    if (beta < 0) { // Moving forward
                        ringObj.mesh.material.emissive.setHex(0x0044ff); // Blueshifted warp leading
                    } else {
                        ringObj.mesh.material.emissive.setHex(0xff0044); // Redshifted warp trailing
                    }
                    
                    // Torsional twist
                    ringObj.mesh.rotation.z = time * speed * (1 - dist/150);
                } else {
                    ringObj.mesh.scale.z = 1;
                    ringObj.mesh.material.opacity = 0;
                }
            });
        }

        // Track lights pulse sequence
        if (meshes.trackLights) {
            const lightColor = new THREE.Color(0x0044ff);
            const activeColor = new THREE.Color(0xffffff);
            
            // Dummy matrix updating for InstancedMesh is expensive, so we just pulse the global material?
            // Wait, we can't easily change individual colors on simple InstancedMesh without instanceColor attribute.
            // Let's just adjust the overall emissive based on sled speed.
            meshes.trackLights.material.emissiveIntensity = 1 + Math.abs(beta) * 5;
            
            // Alternatively, a global hue shift for the track lights as the sled powers up
            meshes.trackLights.material.emissive.setHSL(0.6, 1.0, 0.5 + Math.abs(beta)*0.5);
        }
    }

    return { group, parts, description: "Ultra God Tier Relativistic Doppler Engine. Accelerates to near light-speed to demonstrate extreme longitudinal and transverse relativistic Doppler shifts.", quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createAcousticsDopplerEffect() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
