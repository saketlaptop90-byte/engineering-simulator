import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // Helper functions for complex geometries
    function createExtrudedProfile(points, depth, color, materialTemplate) {
        const shape = new THREE.Shape();
        if(points.length > 0) {
            shape.moveTo(points[0][0], points[0][1]);
            for (let i = 1; i < points.length; i++) {
                shape.lineTo(points[i][0], points[i][1]);
            }
            shape.lineTo(points[0][0], points[0][1]);
        }
        const extrudeSettings = { depth: depth, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.08, bevelThickness: 0.08 };
        const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geom.center();
        const mat = materialTemplate.clone();
        if (color) mat.color.setHex(color);
        return new THREE.Mesh(geom, mat);
    }

    function createLatheProfile(points, segments, color, materialTemplate) {
        const p = points.map(pt => new THREE.Vector2(pt[0], pt[1]));
        const geom = new THREE.LatheGeometry(p, segments);
        geom.center();
        const mat = materialTemplate.clone();
        if(color) mat.color.setHex(color);
        return new THREE.Mesh(geom, mat);
    }
    
    // --- PART 1: OPTICAL BREADBOARD TABLE ---
    const tableGroup = new THREE.Group();
    const tableShape = new THREE.Shape();
    tableShape.moveTo(-16, -12);
    tableShape.lineTo(16, -12);
    tableShape.lineTo(16, 12);
    tableShape.lineTo(-16, 12);
    
    // Generate thousands of threaded mounting holes (simulated via boolean or complex paths, here we use path holes for realism)
    for(let i = -15; i <= 15; i+=2) {
        for(let j = -11; j <= 11; j+=2) {
            const hole = new THREE.Path();
            hole.absarc(i, j, 0.25, 0, Math.PI * 2, false);
            tableShape.holes.push(hole);
        }
    }
    
    const tableExtrudeSettings = { depth: 1.5, bevelEnabled: true, bevelThickness: 0.2, bevelSize: 0.1, bevelSegments: 5 };
    const tableGeom = new THREE.ExtrudeGeometry(tableShape, tableExtrudeSettings);
    tableGeom.rotateX(Math.PI / 2);
    const tableMesh = new THREE.Mesh(tableGeom, aluminum.clone());
    tableMesh.material.color.setHex(0x2a2a2a);
    tableMesh.position.y = -2;
    tableGroup.add(tableMesh);

    // Vibration Isolation Legs (4)
    const legPoints = [
        [0, 0], [1.8, 0], [1.8, 1], [1.4, 1.2], [1.4, 4], [2.2, 4.2], [2.2, 5], [1.2, 5.2], [1.2, 7], [2.5, 7], [2.5, 7.5], [0, 7.5]
    ];
    const legPositions = [ [-14, -8, -10], [14, -8, -10], [-14, -8, 10], [14, -8, 10] ];
    legPositions.forEach((pos) => {
        const leg = createLatheProfile(legPoints, 48, 0x111111, darkSteel);
        leg.position.set(pos[0], pos[1], pos[2]);
        tableGroup.add(leg);
        
        // Add intricate pneumatic springs around the legs
        const springCurve = new THREE.CatmullRomCurve3(
            Array.from({length: 60}).map((_, i) => {
                const t = i / 59;
                const angle = t * Math.PI * 24;
                return new THREE.Vector3(Math.cos(angle)*2.6, t*6 - 3, Math.sin(angle)*2.6);
            })
        );
        const springGeom = new THREE.TubeGeometry(springCurve, 250, 0.2, 12, false);
        const springMesh = new THREE.Mesh(springGeom, chrome.clone());
        springMesh.position.copy(leg.position);
        tableGroup.add(springMesh);
    });
    
    group.add(tableGroup);
    
    parts.push({
        name: "Vibration-Isolating Optical Breadboard",
        description: "A massive, honeycomb-core Invar breadboard table mounted on active pneumatic isolation legs to prevent sub-micron seismic vibrations from disturbing the spectrometer.",
        material: "Invar Alloy, Carbon Fiber, Chrome Springs",
        function: "Provides a strictly rigid and vibration-free horizontal datum for the high-precision photonic components.",
        assemblyOrder: 1,
        connections: ["Laboratory Floor", "Laser Housing", "Prism Mount", "Detector Array"],
        failureEffect: "Environmental vibrations introduce immense noise into the spectral readings, blurring microscopic spectral lines.",
        cascadeFailures: ["Loss of alignment in collimator", "Detector saturation errors"],
        originalPosition: {x: 0, y: -2, z: 0},
        explodedPosition: {x: 0, y: -12, z: 0}
    });

    // --- PART 2: THE HIGH-POWER WHITE LASER SOURCE ---
    const laserGroup = new THREE.Group();
    
    // Laser Housing Base
    const laserBasePoints = [[-4, -2.5], [4, -2.5], [4, 2.5], [-4, 2.5]];
    const laserBase = createExtrudedProfile(laserBasePoints, 5, 0x1e1e1e, darkSteel);
    laserBase.position.set(-11, 0, 0);
    laserGroup.add(laserBase);
    
    // Laser Emitter Barrel (Lathe)
    const barrelPts = [[0,0], [1.8,0], [1.8,1], [1.5,1.2], [1.5,5], [1.9,5.2], [1.9,6], [1.2,6.1], [1.2,7], [0,7]];
    const barrel = createLatheProfile(barrelPts, 48, 0x444444, steel);
    barrel.rotation.z = -Math.PI / 2;
    barrel.position.set(-7.5, 0.5, 0);
    laserGroup.add(barrel);
    
    // Heatsink Ribs on Barrel
    for(let i=0; i<12; i++) {
        const rib = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.15, 16, 64), copper.clone());
        rib.rotation.y = Math.PI / 2;
        rib.position.set(-9.5 + i*0.4, 0.5, 0);
        laserGroup.add(rib);
    }
    
    group.add(laserGroup);
    
    parts.push({
        name: "Supercontinuum Laser Emitter",
        description: "A photonic-crystal fiber supercontinuum laser generating an intense, highly collimated, extremely broad-spectrum white light beam stretching from UV to IR.",
        material: "Tungsten, Copper Heatsinks, Stainless Steel Casing",
        function: "Generates the raw multi-wavelength coherent light required for dispersion and absorption analysis.",
        assemblyOrder: 2,
        connections: ["Optical Table", "Liquid Cooling Pipes", "Collimator Lens"],
        failureEffect: "Beam intensity fluctuates violently or fails entirely, halting all spectral emission.",
        cascadeFailures: ["Cooling system boil-off", "Detector signal baseline loss"],
        originalPosition: {x: -11, y: 0, z: 0},
        explodedPosition: {x: -18, y: 6, z: 0}
    });

    // --- PART 3: HIGH-VOLTAGE LASER TRANSFORMER ---
    const transformerGroup = new THREE.Group();
    const transBody = new THREE.Mesh(new THREE.BoxGeometry(6, 7, 5), darkSteel.clone());
    transBody.position.set(-13, -1.5, -7);
    transformerGroup.add(transBody);
    
    // Add glowing hazard lights and large coils
    for(let c=0; c<3; c++) {
        const coilGeom = new THREE.TorusGeometry(1.2, 0.4, 32, 100);
        const coil = new THREE.Mesh(coilGeom, copper.clone());
        coil.rotation.y = Math.PI / 2;
        coil.position.set(-15, 0, -9.5 + c*2.5);
        transformerGroup.add(coil);
    }
    
    const powerCableCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-13, 0, -4.5),
        new THREE.Vector3(-13, 0, -2),
        new THREE.Vector3(-11, 0, 0)
    ]);
    const powerCable = new THREE.Mesh(new THREE.TubeGeometry(powerCableCurve, 32, 0.3, 16, false), rubber.clone());
    transformerGroup.add(powerCable);
    
    group.add(transformerGroup);

    parts.push({
        name: "High-Voltage Laser Transformer",
        description: "A step-up transformer providing 50,000 Volts to drive the non-linear photonic crystal fibers inside the laser.",
        material: "Copper Coils, Iron Core, High-Density Polyethylene",
        function: "Converts mains electricity into the extreme voltages needed to sustain a supercontinuum plasma state.",
        assemblyOrder: 3,
        connections: ["Optical Table", "Supercontinuum Laser Emitter", "Main Power Grid"],
        failureEffect: "Arc flash or power failure, dropping the laser output to zero.",
        cascadeFailures: ["Power surge damage to control console"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -15, y: 0, z: -15}
    });

    // --- PART 4: CRYOGENIC COOLING MANIFOLD ---
    const coolingGroup = new THREE.Group();
    const pipeCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-11, 0, 2.5),
        new THREE.Vector3(-11, -1, 5),
        new THREE.Vector3(-6, -1.5, 7),
        new THREE.Vector3(0, -1.5, 8),
        new THREE.Vector3(0, -2.5, 8)
    ]);
    const pipeGeom = new THREE.TubeGeometry(pipeCurve, 64, 0.25, 16, false);
    const pipe1 = new THREE.Mesh(pipeGeom, rubber.clone());
    pipe1.material.color.setHex(0x111111);
    coolingGroup.add(pipe1);
    
    const pipeCurve2 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-12, 0, 2.5),
        new THREE.Vector3(-13, -1, 6),
        new THREE.Vector3(-8, -2, 9),
        new THREE.Vector3(2, -2, 9),
        new THREE.Vector3(2, -2.5, 9)
    ]);
    const pipeGeom2 = new THREE.TubeGeometry(pipeCurve2, 64, 0.25, 16, false);
    const pipe2 = new THREE.Mesh(pipeGeom2, rubber.clone());
    pipe2.material.color.setHex(0x002255);
    coolingGroup.add(pipe2);
    
    group.add(coolingGroup);
    parts.push({
        name: "Cryogenic Cooling Manifold",
        description: "High-pressure, titanium-reinforced rubber hoses circulating liquid nitrogen to prevent thermal deformation of the laser cavity.",
        material: "Vulcanized Rubber, Titanium Mesh",
        function: "Maintains optimal operating temperature for the supercontinuum laser, preventing wavelength drift due to heat.",
        assemblyOrder: 4,
        connections: ["Supercontinuum Laser Emitter", "Sub-table Chiller Unit"],
        failureEffect: "Thermal runaway in the laser casing.",
        cascadeFailures: ["Laser emitter meltdown", "Catastrophic optical misalignment"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -5, z: 12}
    });

    // --- PART 5: COLLIMATOR LENS ASSEMBLY ---
    const collimatorGroup = new THREE.Group();
    
    const mountProfile = [[0,0], [2.5,0], [2.5,0.6], [1.8,1.0], [1.8, 1.5], [2.5, 1.8], [2.5, 2.5], [0,2.5]];
    const collimatorMount = createLatheProfile(mountProfile, 64, 0xaaaaaa, chrome);
    collimatorMount.rotation.z = Math.PI / 2;
    collimatorMount.position.set(-3.5, 0.5, 0);
    collimatorGroup.add(collimatorMount);
    
    const lensGeom = new THREE.SphereGeometry(1.6, 48, 48);
    lensGeom.scale(0.2, 1, 1);
    const lensMesh = new THREE.Mesh(lensGeom, glass.clone());
    lensMesh.material.opacity = 0.6;
    lensMesh.material.transparent = true;
    lensMesh.material.color.setHex(0x88ccff);
    lensMesh.position.set(-3.5, 0.5, 0);
    collimatorGroup.add(lensMesh);
    
    group.add(collimatorGroup);
    
    parts.push({
        name: "Achromatic Collimating Lens Set",
        description: "A precision-crafted multi-element lens array designed to perfectly parallelize the white light beam before it hits the prism, eliminating spherical aberration.",
        material: "Fluorite Glass, Chrome Housing",
        function: "Ensures the incident light rays are strictly parallel to maximize spectral resolution and avoid focal blur.",
        assemblyOrder: 5,
        connections: ["Optical Table", "Supercontinuum Laser Emitter"],
        failureEffect: "Light beam diverges, causing a blurry and overlapping spectrum.",
        cascadeFailures: ["Loss of precision in detector array"],
        originalPosition: {x: -3.5, y: 0.5, z: 0},
        explodedPosition: {x: -3.5, y: 9, z: 0}
    });

    // --- PART 6: THE WHITE LIGHT INCIDENT BEAM ---
    const whiteBeamGeom = new THREE.CylinderGeometry(0.15, 0.15, 8, 32);
    whiteBeamGeom.rotateZ(Math.PI / 2);
    const whiteBeamMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 5,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
    });
    const whiteBeam = new THREE.Mesh(whiteBeamGeom, whiteBeamMat);
    whiteBeam.position.set(-3.5, 0.5, 0); 
    meshes.whiteBeam = whiteBeam;
    group.add(whiteBeam);

    parts.push({
        name: "Coherent White Light Beam",
        description: "A highly concentrated, collimated photon stream carrying equal intensities of all visible and near-visible wavelengths.",
        material: "Photons (Pure Energy)",
        function: "The subject of spectral dispersion; the raw data source.",
        assemblyOrder: 6,
        connections: ["Laser Emitter", "Collimating Lens", "Prism Face"],
        failureEffect: "No light transmission.",
        cascadeFailures: [],
        originalPosition: {x: -3.5, y: 0.5, z: 0},
        explodedPosition: {x: -3.5, y: 0.5, z: 6}
    });

    // --- PART 7: KINEMATIC PRISM MOUNT & STAGE ---
    const prismMountGroup = new THREE.Group();
    
    const stageBasePts = [[0,0], [3.5,0], [3.5,0.6], [3.2,0.9], [3.2, 1.2], [0,1.2]];
    const stageBase = createLatheProfile(stageBasePts, 64, 0x333333, steel);
    stageBase.position.set(0, -0.6, 0);
    prismMountGroup.add(stageBase);
    
    const platformPts = [[0,0], [3,0], [3, 0.4], [0, 0.4]];
    const platform = createLatheProfile(platformPts, 64, 0x666666, aluminum);
    platform.position.set(0, 0.6, 0);
    meshes.prismPlatform = platform;
    prismMountGroup.add(platform);
    
    for(let k=0; k<3; k++) {
        const knobGroup = new THREE.Group();
        const knobStem = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1.2, 16), chrome.clone());
        knobStem.rotation.x = Math.PI / 2;
        
        const knobHead = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.5, 32), darkSteel.clone());
        knobHead.rotation.x = Math.PI / 2;
        knobHead.position.z = 0.6;
        
        // Knurling
        for(let r=0; r<24; r++) {
            const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.5, 0.06), steel.clone());
            ridge.position.set(Math.cos(r/24 * Math.PI*2)*0.4, 0.6, Math.sin(r/24 * Math.PI*2)*0.4);
            knobGroup.add(ridge);
        }
        
        knobGroup.add(knobStem);
        knobGroup.add(knobHead);
        
        knobGroup.position.set(Math.cos(k * Math.PI*2/3) * 3, 0.3, Math.sin(k * Math.PI*2/3) * 3);
        knobGroup.lookAt(new THREE.Vector3(0, 0.3, 0));
        prismMountGroup.add(knobGroup);
        
        if (k === 0) meshes.micrometer1 = knobGroup;
        if (k === 1) meshes.micrometer2 = knobGroup;
        if (k === 2) meshes.micrometer3 = knobGroup;
    }
    
    group.add(prismMountGroup);

    parts.push({
        name: "Goniometric Kinematic Stage",
        description: "A highly complex 6-axis positioning stage with ultra-fine micrometer screws allowing microradian precision adjustment of the prism's angle of incidence.",
        material: "Stainless Steel, Brass Threads, Anodized Aluminum",
        function: "Positions the prism with extreme accuracy to achieve minimum deviation and optimal spectral separation.",
        assemblyOrder: 7,
        connections: ["Optical Table", "Equilateral Dispersing Prism"],
        failureEffect: "Prism vibrates or misaligns, causing shifting spectral lines.",
        cascadeFailures: ["Calibration failure", "Inaccurate wavelength measurements"],
        originalPosition: {x: 0, y: -0.6, z: 0},
        explodedPosition: {x: 0, y: -6, z: 0}
    });

    // --- PART 8: THE EQUILATERAL DISPERSING PRISM ---
    const prismShape = new THREE.Shape();
    const side = 4;
    const h = side * Math.sqrt(3) / 2;
    prismShape.moveTo(-side/2, -h/3);
    prismShape.lineTo(side/2, -h/3);
    prismShape.lineTo(0, 2*h/3);
    prismShape.lineTo(-side/2, -h/3);
    
    const prismExtrude = { depth: 2.5, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.08, bevelThickness: 0.08 };
    const prismGeom = new THREE.ExtrudeGeometry(prismShape, prismExtrude);
    prismGeom.center();
    
    const highIndexGlass = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.2,
        roughness: 0,
        transmission: 1.0,
        ior: 1.8, 
        thickness: 2.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0,
        transparent: true,
        opacity: 0.85
    });
    
    const prismMesh = new THREE.Mesh(prismGeom, highIndexGlass);
    prismMesh.position.set(0, 1.8, 0);
    prismMesh.rotation.x = Math.PI / 2;
    prismMesh.rotation.z = -Math.PI / 6;
    meshes.prism = prismMesh;
    group.add(prismMesh);

    parts.push({
        name: "Flint Glass Equilateral Prism",
        description: "A flawless, ultra-pure synthetic fused silica triangular prism. Its extremely high refractive index causes severe dispersion of incident poly-chromatic light.",
        material: "Dense Flint Glass (SF11)",
        function: "Refracts different wavelengths of light at distinct angles via Snell's Law, transforming a single beam into a continuous optical spectrum.",
        assemblyOrder: 8,
        connections: ["Goniometric Kinematic Stage"],
        failureEffect: "Scratches or internal atomic defects cause severe light scattering and loss of resolution.",
        cascadeFailures: ["Spectral noise", "Blind spots in detector"],
        originalPosition: {x: 0, y: 1.8, z: 0},
        explodedPosition: {x: 0, y: 14, z: 0}
    });

    // --- PART 9: THE DISPERSED RAINBOW SPECTRUM ---
    const spectrumGroup = new THREE.Group();
    meshes.spectrumBeams = [];
    
    const colors = [
        { c: 0xff0000, name: "Red", angle: 0.1, zOffset: 0.4 },
        { c: 0xff7f00, name: "Orange", angle: 0.18, zOffset: 0.25 },
        { c: 0xffff00, name: "Yellow", angle: 0.26, zOffset: 0.1 },
        { c: 0x00ff00, name: "Green", angle: 0.34, zOffset: -0.05 },
        { c: 0x0000ff, name: "Blue", angle: 0.42, zOffset: -0.2 },
        { c: 0x4b0082, name: "Indigo", angle: 0.50, zOffset: -0.35 },
        { c: 0x9400d3, name: "Violet", angle: 0.58, zOffset: -0.5 }
    ];
    
    colors.forEach((col, idx) => {
        const beamLength = 9.5;
        const sGeom = new THREE.CylinderGeometry(0.08, 0.2, beamLength, 32);
        sGeom.translate(0, beamLength/2, 0); 
        
        const sMat = new THREE.MeshStandardMaterial({
            color: col.c,
            emissive: col.c,
            emissiveIntensity: 6,
            transparent: true,
            opacity: 0.85,
            blending: THREE.AdditiveBlending
        });
        
        const beam = new THREE.Mesh(sGeom, sMat);
        beam.position.set(0, 0.5, 0); 
        beam.rotation.z = -Math.PI / 2 + col.angle;
        beam.rotation.x = col.zOffset * 0.2; 
        
        meshes.spectrumBeams.push({mesh: beam, baseAngleZ: beam.rotation.z, baseAngleX: beam.rotation.x});
        spectrumGroup.add(beam);
        
        parts.push({
            name: `${col.name} Spectral Band`,
            description: `Highly dispersed ${col.name.toLowerCase()} coherent light ray resulting from the wavelength-dependent refractive index of the prism.`,
            material: "Photons",
            function: "Travels towards the sensor array for intensity measurement at specific wavelengths.",
            assemblyOrder: 9 + idx,
            connections: ["Prism Face", "Detector Array"],
            failureEffect: "Band missing due to absorption in optical path.",
            cascadeFailures: ["Incomplete spectral data"],
            originalPosition: {x: 0, y: 0.5, z: 0},
            explodedPosition: {x: Math.cos(-Math.PI/2 + col.angle)*6, y: 0.5, z: Math.sin(col.zOffset)*6}
        });
    });
    
    group.add(spectrumGroup);

    // --- PART 10: PRECISION STEPPER MOTOR DRIVE ---
    const motorGroup = new THREE.Group();
    const motorBase = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 2.5, 64), darkSteel.clone());
    motorGroup.add(motorBase);
    
    for(let m=0; m<12; m++) {
        const rib = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.1, 0.1, 64), steel.clone());
        rib.position.y = -1 + m*0.18;
        motorGroup.add(rib);
    }
    
    motorGroup.position.set(0, -1.2, -2);
    meshes.motor = motorGroup;
    group.add(motorGroup);

    parts.push({
        name: "Precision Stepper Motor Drive",
        description: "A high-torque, micro-stepping NEMA 34 motor capable of 51,200 steps per revolution.",
        material: "Neodymium Magnets, Copper Windings, Steel",
        function: "Drives the swivel arm across the spectral arc with sub-milliradian precision.",
        assemblyOrder: 16,
        connections: ["Optical Table Pivot", "Motorized Swivel Articulation Arm"],
        failureEffect: "Skipped steps cause the detector to misalign with the expected wavelength.",
        cascadeFailures: ["Corrupted data mapping"],
        originalPosition: {x: 0, y: -1.2, z: -2},
        explodedPosition: {x: 0, y: -8, z: -8}
    });

    // --- PART 11: MOTORIZED SWIVEL ARTICULATION ARM ---
    const swivelGroup = new THREE.Group();
    
    const pivotGeom = new THREE.CylinderGeometry(1.8, 1.8, 0.6, 64);
    const pivotMesh = new THREE.Mesh(pivotGeom, darkSteel.clone());
    pivotMesh.position.set(0, -0.2, 0);
    swivelGroup.add(pivotMesh);
    
    const armShape = new THREE.Shape();
    armShape.moveTo(-1.2, 0);
    armShape.lineTo(1.2, 0);
    armShape.lineTo(0.6, 11);
    armShape.lineTo(-0.6, 11);
    
    const armGeom = new THREE.ExtrudeGeometry(armShape, {depth: 0.4, bevelEnabled: true});
    armGeom.rotateX(Math.PI / 2);
    armGeom.rotateY(-Math.PI / 2);
    const armMesh = new THREE.Mesh(armGeom, aluminum.clone());
    armMesh.position.set(0, -0.1, 0);
    swivelGroup.add(armMesh);
    
    meshes.detectorSwivel = swivelGroup;
    group.add(swivelGroup);
    
    parts.push({
        name: "Motorized Swivel Articulation Arm",
        description: "A heavy-duty precision CNC-machined radial arm that smoothly swings the detector telescope across the optical field to scan the entire spectrum.",
        material: "Aerospace-grade Aluminum",
        function: "Supports and positions the heavy detector tube along the arc of dispersed light.",
        assemblyOrder: 17,
        connections: ["Stepper Motor Drive", "Detector Telescope Tube"],
        failureEffect: "Arm binds or stutters during sweep, causing uneven spectral sampling.",
        cascadeFailures: ["Stepper motor burnout"],
        originalPosition: {x: 0, y: -0.1, z: 0},
        explodedPosition: {x: 0, y: -10, z: 10}
    });

    // --- PART 12: DETECTOR TELESCOPE TUBE ---
    const telescopeGroup = new THREE.Group();
    
    const telePts = [
        [0,0], [1.4,0], [1.4, 0.6], [1.8, 1.2], [1.8, 6], [1.4, 6.5], [1.4, 8], [0.9, 8], [0.9, 9], [0,9]
    ];
    const teleGeom = createLatheProfile(telePts, 64, 0x111111, plastic);
    teleGeom.rotation.z = Math.PI / 2;
    teleGeom.position.set(9.5, 0.5, 0);
    telescopeGroup.add(teleGeom);
    
    const objLensGeom = new THREE.CylinderGeometry(1.75, 1.75, 0.25, 48);
    objLensGeom.rotateZ(Math.PI / 2);
    const objLens = new THREE.Mesh(objLensGeom, glass.clone());
    objLens.material.color.setHex(0x550055); 
    objLens.position.set(5.1, 0.5, 0);
    telescopeGroup.add(objLens);
    
    const hubGeom = new THREE.BoxGeometry(2.5, 2.5, 2.5);
    const hubMesh = new THREE.Mesh(hubGeom, steel.clone());
    hubMesh.position.set(10.5, 0.5, 0);
    telescopeGroup.add(hubMesh);
    
    for(let i=0; i<4; i++) {
        const cableCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(11, 0.5, (i-1.5)*0.4),
            new THREE.Vector3(12, -1.5, (i-1.5)*0.6),
            new THREE.Vector3(11, -3, (i-1.5)*1.2),
            new THREE.Vector3(0, -3, 6) 
        ]);
        const cableGeom = new THREE.TubeGeometry(cableCurve, 48, 0.08, 12, false);
        const cable = new THREE.Mesh(cableGeom, rubber.clone());
        cable.material.color.setHex(0xffaa00);
        telescopeGroup.add(cable);
    }
    
    for(let i=0; i<12; i++) {
        const finGeom = new THREE.BoxGeometry(2.2, 0.06, 2.2);
        const fin = new THREE.Mesh(finGeom, copper.clone());
        fin.position.set(10.5, 1.8 + i*0.12, 0);
        telescopeGroup.add(fin);
    }

    swivelGroup.add(telescopeGroup);

    parts.push({
        name: "Photomultiplier Tube & CCD Array Telescope",
        description: "An ultra-sensitive telescope containing an objective focusing lens, narrow slit aperture, and a liquid-cooled CCD array capable of counting individual photons.",
        material: "Carbon Fiber, Steel, Copper Fins",
        function: "Captures and quantifies the exact intensity of light at specific angles, converting photons into digital signals.",
        assemblyOrder: 18,
        connections: ["Swivel Articulation Arm", "Data Umbilical Cables"],
        failureEffect: "Thermal noise overwhelms the CCD, resulting in a saturated, useless read-out.",
        cascadeFailures: ["Data corruption"],
        originalPosition: {x: 9.5, y: 0.5, z: 0},
        explodedPosition: {x: 18, y: 0.5, z: 0}
    });

    // --- PART 13: SPECTROSCOPIC COMMAND TERMINAL ---
    const consoleGroup = new THREE.Group();
    
    const consoleShape = new THREE.Shape();
    consoleShape.moveTo(0, 0);
    consoleShape.lineTo(4.5, 0);
    consoleShape.lineTo(4.5, 3.5);
    consoleShape.lineTo(1.5, 6);
    consoleShape.lineTo(0, 6);
    
    const consoleGeom = new THREE.ExtrudeGeometry(consoleShape, {depth: 7, bevelEnabled: true, bevelThickness: 0.2});
    consoleGeom.center();
    const consoleMesh = new THREE.Mesh(consoleGeom, plastic.clone());
    consoleMesh.material.color.setHex(0x1a1a1a);
    consoleMesh.position.set(-9, 3, 8);
    consoleGroup.add(consoleMesh);
    
    const screenGeom = new THREE.PlaneGeometry(4, 4.5);
    const screenMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff, emissive: 0x0088ff, emissiveIntensity: 2.5, transparent: true, opacity: 0.85
    });
    const screenMesh = new THREE.Mesh(screenGeom, screenMat);
    screenMesh.position.set(-7.3, 4.2, 8);
    screenMesh.rotation.y = Math.PI / 2;
    screenMesh.rotation.x = -Math.PI / 6;
    consoleGroup.add(screenMesh);
    
    const gridMat = new THREE.LineBasicMaterial({ color: 0xffffff });
    const gridPoints = [];
    for(let i= -1.8; i <= 1.8; i+=0.4) {
        gridPoints.push(new THREE.Vector3(i, -2.1, 0.02), new THREE.Vector3(i, 2.1, 0.02));
        gridPoints.push(new THREE.Vector3(-1.8, i*1.2, 0.02), new THREE.Vector3(1.8, i*1.2, 0.02));
    }
    const gridLineGeom = new THREE.BufferGeometry().setFromPoints(gridPoints);
    const gridLines = new THREE.LineSegments(gridLineGeom, gridMat);
    screenMesh.add(gridLines);

    // Glowing buttons and switches
    for(let i=0; i<6; i++) {
        for(let j=0; j<2; j++) {
            const btnGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.2, 16);
            btnGeom.rotateX(Math.PI/2);
            const btnMat = new THREE.MeshStandardMaterial({color: 0xff0000, emissive: (j%2===0)?0x00ff00:0xff0000, emissiveIntensity: 2});
            const btn = new THREE.Mesh(btnGeom, btnMat);
            btn.position.set(-8.5, 2.5 + j*0.5, 5.5 + i*0.8);
            btn.rotation.y = Math.PI/2;
            consoleGroup.add(btn);
        }
    }
    
    group.add(consoleGroup);

    parts.push({
        name: "Spectroscopic Command Terminal",
        description: "A hardened terminal with an active matrix OLED holographic display and physical interlock overrides, calculating the spectral density graph in real-time.",
        material: "Polycarbonate, Silicon Semiconductors, Gorilla Glass",
        function: "Aggregates CCD data, applies Fourier transforms, and renders the absorption/emission spectrum graph.",
        assemblyOrder: 19,
        connections: ["Data Umbilical Cables", "Optical Table Base"],
        failureEffect: "Loss of user interface; the spectrometer continues scanning but data cannot be viewed or logged.",
        cascadeFailures: ["Experiment timeline ruined"],
        originalPosition: {x: -9, y: 3, z: 8},
        explodedPosition: {x: -9, y: 3, z: 18}
    });

    // --- PART 14: QUAD-HYDRAULIC TABLE LEVELING SYSTEM ---
    const actuatorGroup = new THREE.Group();
    const actPositions = [ [-11, -6, -7], [11, -6, -7], [-11, -6, 7], [11, -6, 7] ];
    
    actPositions.forEach(pos => {
        const cyl1 = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 4, 32), steel.clone());
        cyl1.position.set(pos[0], pos[1], pos[2]);
        actuatorGroup.add(cyl1);
        
        const cyl2 = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 5, 32), chrome.clone());
        cyl2.position.set(pos[0], pos[1] + 2.5, pos[2]);
        actuatorGroup.add(cyl2);
        
        const hydraulicHoseCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(pos[0]+1.2, pos[1], pos[2]),
            new THREE.Vector3(pos[0]+3, pos[1]-1.5, pos[2]+1.5),
            new THREE.Vector3(0, -8, 0)
        ]);
        const hoseGeom = new THREE.TubeGeometry(hydraulicHoseCurve, 32, 0.15, 12, false);
        const hose = new THREE.Mesh(hoseGeom, rubber.clone());
        actuatorGroup.add(hose);
    });
    
    const pumpGeom = new THREE.CylinderGeometry(2.5, 2.5, 3, 48);
    const pump = new THREE.Mesh(pumpGeom, darkSteel.clone());
    pump.position.set(0, -8, 0);
    actuatorGroup.add(pump);
    
    group.add(actuatorGroup);

    parts.push({
        name: "Quad-Hydraulic Table Leveling System",
        description: "Heavy-duty chrome-plated hydraulic pistons operating at 4000 PSI to perfectly level the multi-ton optical table.",
        material: "Forged Steel, Chrome, Hydraulic Fluid",
        function: "Maintains absolute level orientation relative to gravity to prevent gravity-induced strain on optical mounts.",
        assemblyOrder: 20,
        connections: ["Optical Table", "Central Pump Unit"],
        failureEffect: "Table tilts, causing minute gravity-induced sagging of the optical arm.",
        cascadeFailures: ["Calibration loss", "Focal point drift"],
        originalPosition: {x: 0, y: -6, z: 0},
        explodedPosition: {x: 0, y: -20, z: 0}
    });

    const description = "The Advanced Photonic Prism Spectrometer is a massive, hyper-complex laboratory instrument. It utilizes a supercontinuum white laser source, collimated through achromatic lenses, and directed into a high-index flint glass equilateral prism. The extreme precision of the goniometric stage and motorized radial arm allows ultra-high resolution mapping of the dispersed spectral bands. Every component, from the cryogenic cooling lines to the pneumatic vibration-isolating table, is designed to eliminate noise and maximize optical fidelity.";

    const quizQuestions = [
        {
            question: "What is the function of the Achromatic Collimating Lens Set?",
            options: [
                "To parallelize the incident white light beam",
                "To disperse the light into a rainbow",
                "To absorb infrared radiation",
                "To amplify the laser beam intensity"
            ],
            correctAnswer: 0,
            explanation: "Collimating lenses perfectly parallelize light rays, ensuring all incident light strikes the prism at the exact same angle, which is critical for sharp spectral lines."
        },
        {
            question: "Why is the optical table mounted on pneumatic isolation legs?",
            options: [
                "To prevent sub-micron environmental vibrations from blurring readings",
                "To adjust the height of the experiment for the user",
                "To electrically ground the laser source",
                "To provide cooling for the hydraulic leveling system"
            ],
            correctAnswer: 0,
            explanation: "In high-precision optics, even microscopic vibrations from the building or floor can cause massive shifts in the beam alignment, ruining the data."
        },
        {
            question: "What material is the Equilateral Dispersing Prism made of in this machine?",
            options: [
                "Dense Flint Glass (SF11)",
                "Standard Window Glass",
                "Optical Quality Acrylic",
                "Polished Aluminum"
            ],
            correctAnswer: 0,
            explanation: "Dense Flint Glass has a very high refractive index and high dispersive power, which spreads the constituent wavelengths of light far apart for easier measurement."
        },
        {
            question: "What happens if the Cryogenic Cooling Manifold fails?",
            options: [
                "Thermal runaway in the laser casing leading to catastrophic optical misalignment",
                "The prism shatters from the cold",
                "The pneumatic legs deflate",
                "The detector array freezes"
            ],
            correctAnswer: 0,
            explanation: "The supercontinuum laser generates immense heat. Without cryogenic cooling, thermal expansion would distort the optical cavity and melt the components."
        },
        {
            question: "Which color spectral band has the largest angle of deviation passing through the prism?",
            options: [
                "Violet",
                "Red",
                "Green",
                "Yellow"
            ],
            correctAnswer: 0,
            explanation: "Violet light has a shorter wavelength and experiences a higher refractive index in glass compared to red light, causing it to bend (deviate) the most."
        }
    ];

    function animate(time, speed, activeMeshes) {
        if (activeMeshes.prismPlatform) {
            const angle = Math.sin(time * 0.5 * speed) * 0.12;
            activeMeshes.prismPlatform.rotation.y = angle;
            activeMeshes.prism.rotation.y = angle;
            
            if (activeMeshes.spectrumBeams) {
                activeMeshes.spectrumBeams.forEach((beamObj, index) => {
                    const dynamicSpread = angle * (1 + index * 0.15);
                    beamObj.mesh.rotation.z = beamObj.baseAngleZ + dynamicSpread;
                    
                    const pulse = (Math.sin(time * 5 + index) * 0.2) + 0.8;
                    beamObj.mesh.material.opacity = 0.85 * pulse;
                });
            }
        }
        
        if (activeMeshes.micrometer1) activeMeshes.micrometer1.rotation.y = time * speed * 2;
        if (activeMeshes.micrometer2) activeMeshes.micrometer2.rotation.y = -time * speed * 1.5;
        if (activeMeshes.micrometer3) activeMeshes.micrometer3.rotation.y = time * speed;

        if (activeMeshes.detectorSwivel) {
            const sweep = Math.sin(time * 0.2 * speed) * 0.45 + 0.25; 
            activeMeshes.detectorSwivel.rotation.y = sweep;
        }
        
        if (activeMeshes.motor) {
            activeMeshes.motor.rotation.y = time * speed * 4;
        }

        if (activeMeshes.whiteBeam) {
            activeMeshes.whiteBeam.material.opacity = 0.85 + Math.sin(time * 12 * speed) * 0.15;
        }
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate,
        meshes
    };
}

// Auto-generated missing stub
export function createPrismSpectrometer() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
