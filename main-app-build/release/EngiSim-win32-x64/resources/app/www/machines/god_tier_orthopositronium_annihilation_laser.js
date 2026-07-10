import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // -------------------------------------------------------------------------
    // CUSTOM HIGH-TECH MATERIALS (Supplemental to Imports)
    // -------------------------------------------------------------------------
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 0.8
    });

    const neonPurple = new THREE.MeshStandardMaterial({
        color: 0xaa00ff,
        emissive: 0xaa00ff,
        emissiveIntensity: 3.0,
        transparent: true,
        opacity: 0.9,
        wireframe: true
    });

    const gammaBeamMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const crystalMat = new THREE.MeshPhysicalMaterial({
        color: 0x88ccff,
        transmission: 0.9,
        opacity: 1,
        metalness: 0.2,
        roughness: 0.05,
        ior: 2.5,
        thickness: 5.0,
        specularIntensity: 2.0,
        specularColor: 0xffffff,
        emissive: 0x001133,
        emissiveIntensity: 0.5
    });

    // -------------------------------------------------------------------------
    // HELPER FUNCTIONS FOR COMPLEX GEOMETRIES
    // -------------------------------------------------------------------------

    function createLatheProfile(points2D, segments, material) {
        const points = points2D.map(p => new THREE.Vector2(p[0], p[1]));
        const geom = new THREE.LatheGeometry(points, segments);
        return new THREE.Mesh(geom, material);
    }

    function createTube(curvePath, tubularSegments, radius, radialSegments, material) {
        const curve = new THREE.CatmullRomCurve3(curvePath);
        const geom = new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, false);
        return new THREE.Mesh(geom, material);
    }

    function createExtrudedShape(shapePoints, depth, material) {
        const shape = new THREE.Shape();
        if(shapePoints.length > 0) {
            shape.moveTo(shapePoints[0][0], shapePoints[0][1]);
            for(let i = 1; i < shapePoints.length; i++) {
                shape.lineTo(shapePoints[i][0], shapePoints[i][1]);
            }
            shape.lineTo(shapePoints[0][0], shapePoints[0][1]);
        }
        const extrudeSettings = { depth: depth, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.2, bevelThickness: 0.2 };
        const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const mesh = new THREE.Mesh(geom, material);
        return mesh;
    }

    // -------------------------------------------------------------------------
    // TIRE AND SUSPENSION SYSTEM (Mandatory complex off-road tracks)
    // -------------------------------------------------------------------------
    function buildTire() {
        const tireGroup = new THREE.Group();
        
        // Main Torus for the tire body
        const tireGeom = new THREE.TorusGeometry(8, 3.5, 32, 100);
        const tire = new THREE.Mesh(tireGeom, rubber);
        tireGroup.add(tire);

        // Hundreds of tiny extruded BoxGeometry lugs for aggressive off-road tread
        const lugCount = 120;
        const lugGeom = new THREE.BoxGeometry(4.5, 1.5, 2.5);
        for(let i = 0; i < lugCount; i++) {
            const theta = (i / lugCount) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeom, rubber);
            // Position along the outer edge of the torus
            lug.position.x = Math.cos(theta) * 11;
            lug.position.y = Math.sin(theta) * 11;
            lug.rotation.z = theta;
            
            // Alternate staggered treads
            if(i % 2 === 0) {
                lug.position.z = 1.5;
                lug.rotation.x = 0.2;
            } else {
                lug.position.z = -1.5;
                lug.rotation.x = -0.2;
            }
            tireGroup.add(lug);
        }

        // Complex rim with spoked arrays
        const rimGeom = new THREE.CylinderGeometry(5, 5, 4, 32);
        rimGeom.rotateX(Math.PI / 2);
        const rim = new THREE.Mesh(rimGeom, darkSteel);
        tireGroup.add(rim);

        const spokeCount = 16;
        const spokeGeom = new THREE.CylinderGeometry(0.3, 0.5, 10, 16);
        for(let i = 0; i < spokeCount; i++) {
            const theta = (i / spokeCount) * Math.PI * 2;
            const spoke = new THREE.Mesh(spokeGeom, chrome);
            spoke.position.x = Math.cos(theta) * 2.5;
            spoke.position.y = Math.sin(theta) * 2.5;
            spoke.rotation.z = theta;
            spoke.rotation.x = Math.PI / 2;
            
            // Inner bracing
            const braceGeom = new THREE.BoxGeometry(1, 4, 0.5);
            const brace = new THREE.Mesh(braceGeom, aluminum);
            brace.position.x = Math.cos(theta) * 4;
            brace.position.y = Math.sin(theta) * 4;
            brace.rotation.z = theta;
            tireGroup.add(spoke);
            tireGroup.add(brace);
        }

        const hubcapGeom = new THREE.CylinderGeometry(2, 2.5, 4.5, 32);
        hubcapGeom.rotateX(Math.PI / 2);
        const hubcap = new THREE.Mesh(hubcapGeom, steel);
        tireGroup.add(hubcap);

        // Add to meshes for animation
        return tireGroup;
    }

    meshes.tires = [];
    const suspensionBase = new THREE.Group();
    const wheelPositions = [
        [-25, -15, 20], [25, -15, 20], [-25, -15, -20], [25, -15, -20],
        [-45, -15, 20], [45, -15, 20], [-45, -15, -20], [45, -15, -20]
    ];
    
    wheelPositions.forEach((pos, idx) => {
        const tire = buildTire();
        tire.position.set(pos[0], pos[1], pos[2]);
        if(pos[2] > 0) {
            // Right side tires need to be oriented correctly
            tire.rotation.y = 0;
        } else {
            tire.rotation.y = Math.PI;
        }
        meshes.tires.push({ mesh: tire, side: pos[2] > 0 ? 1 : -1 });
        suspensionBase.add(tire);

        // Heavy-duty axles connecting wheels to base
        const axleGeom = new THREE.CylinderGeometry(1.5, 1.5, 15, 16);
        axleGeom.rotateX(Math.PI / 2);
        const axle = new THREE.Mesh(axleGeom, darkSteel);
        axle.position.set(pos[0], pos[1], pos[2] > 0 ? 12 : -12);
        suspensionBase.add(axle);
        
        // Hydraulic shocks
        const shockGeom = new THREE.CylinderGeometry(1, 1, 10, 16);
        const shock = new THREE.Mesh(shockGeom, chrome);
        shock.position.set(pos[0], pos[1] + 8, pos[2] > 0 ? 10 : -10);
        suspensionBase.add(shock);
        
        const shockHousingGeom = new THREE.CylinderGeometry(1.5, 1.5, 6, 16);
        const shockHousing = new THREE.Mesh(shockHousingGeom, steel);
        shockHousing.position.set(pos[0], pos[1] + 12, pos[2] > 0 ? 10 : -10);
        suspensionBase.add(shockHousing);
    });
    group.add(suspensionBase);

    // -------------------------------------------------------------------------
    // MAIN TRACKING BASE & TURRET MOUNT
    // -------------------------------------------------------------------------
    const baseProfile = [
        [30, 0], [40, 2], [42, 5], [42, 10], [35, 15], [30, 15], [20, 20], [0, 20]
    ];
    const trackingBaseMesh = createLatheProfile(baseProfile, 64, darkSteel);
    trackingBaseMesh.position.y = -5;
    group.add(trackingBaseMesh);

    // Gear teeth on the base for azimuth rotation
    const azimuthGearGroup = new THREE.Group();
    const toothGeom = new THREE.BoxGeometry(2, 4, 3);
    for(let i = 0; i < 120; i++) {
        const theta = (i / 120) * Math.PI * 2;
        const tooth = new THREE.Mesh(toothGeom, steel);
        tooth.position.set(Math.cos(theta) * 41.5, -2, Math.sin(theta) * 41.5);
        tooth.rotation.y = -theta;
        azimuthGearGroup.add(tooth);
    }
    group.add(azimuthGearGroup);

    // Rotating Turret Platform
    const turretPlatform = new THREE.Group();
    turretPlatform.position.y = 15;
    group.add(turretPlatform);
    meshes.turretPlatform = turretPlatform; // Can rotate in Azimuth

    const platformDeckGeom = new THREE.CylinderGeometry(28, 30, 4, 64);
    const platformDeck = new THREE.Mesh(platformDeckGeom, aluminum);
    turretPlatform.add(platformDeck);

    // Structural Side Yokes (Hold the massive barrel)
    const yokeShape = [
        [-10, 0], [10, 0], [12, 10], [8, 40], [4, 50], [-4, 50], [-8, 40], [-12, 10]
    ];
    const leftYoke = createExtrudedShape(yokeShape, 6, darkSteel);
    leftYoke.position.set(-15, 2, -18);
    leftYoke.rotation.y = Math.PI / 2;
    turretPlatform.add(leftYoke);

    const rightYoke = createExtrudedShape(yokeShape, 6, darkSteel);
    rightYoke.position.set(15, 2, -18);
    rightYoke.rotation.y = Math.PI / 2;
    turretPlatform.add(rightYoke);

    // Elevation Trunnions
    const trunnionGeom = new THREE.CylinderGeometry(4, 4, 40, 32);
    trunnionGeom.rotateZ(Math.PI / 2);
    const trunnions = new THREE.Mesh(trunnionGeom, chrome);
    trunnions.position.set(0, 45, 0);
    turretPlatform.add(trunnions);

    // -------------------------------------------------------------------------
    // THE GRASER SYSTEM (Gamma-Ray Laser Array)
    // -------------------------------------------------------------------------
    const elevationAssembly = new THREE.Group();
    elevationAssembly.position.set(0, 45, 0);
    turretPlatform.add(elevationAssembly);
    meshes.elevationAssembly = elevationAssembly; // Pitch control

    // 1. Primary Containment Vessel (Positronium Bose-Einstein Condensate Core)
    const coreShellGeom = new THREE.IcosahedronGeometry(12, 3);
    const coreShell = new THREE.Mesh(coreShellGeom, darkSteel);
    coreShell.position.set(0, 0, -20);
    elevationAssembly.add(coreShell);

    const innerCoreGeom = new THREE.IcosahedronGeometry(10, 4);
    const innerCore = new THREE.Mesh(innerCoreGeom, crystalMat);
    innerCore.position.set(0, 0, -20);
    elevationAssembly.add(innerCore);

    // Quantum Lattice (Inside the core)
    meshes.latticeNodes = [];
    const latticeGroup = new THREE.Group();
    const nodeGeom = new THREE.SphereGeometry(0.5, 8, 8);
    for(let x = -2; x <= 2; x++) {
        for(let y = -2; y <= 2; y++) {
            for(let z = -2; z <= 2; z++) {
                if (Math.abs(x) + Math.abs(y) + Math.abs(z) <= 4) {
                    const node = new THREE.Mesh(nodeGeom, neonBlue);
                    node.position.set(x * 2.5, y * 2.5, z * 2.5);
                    latticeGroup.add(node);
                    meshes.latticeNodes.push({ mesh: node, baseX: node.position.x, baseY: node.position.y, baseZ: node.position.z });
                }
            }
        }
    }
    latticeGroup.position.set(0, 0, -20);
    elevationAssembly.add(latticeGroup);
    meshes.latticeGroup = latticeGroup;

    // Superconducting Magnetic Coils (Toroidal Confinement)
    meshes.confinementCoils = [];
    for(let i = 0; i < 6; i++) {
        const coilGeom = new THREE.TorusGeometry(14, 1.5, 32, 64);
        const coil = new THREE.Mesh(coilGeom, copper);
        coil.position.set(0, 0, -20);
        coil.rotation.x = (i / 6) * Math.PI;
        coil.rotation.y = (i / 6) * Math.PI;
        elevationAssembly.add(coil);
        meshes.confinementCoils.push(coil);
    }

    // 2. Cryogenic Cooling Array
    const condenserGroup = new THREE.Group();
    const condenserBox = new THREE.BoxGeometry(18, 12, 16);
    const condenser = new THREE.Mesh(condenserBox, steel);
    condenser.position.set(0, 18, -25);
    condenserGroup.add(condenser);

    // Heat Exchanger Fins
    const finGeom = new THREE.BoxGeometry(0.2, 14, 14);
    for(let i = -40; i <= 40; i++) {
        const fin = new THREE.Mesh(finGeom, aluminum);
        fin.position.set(i * 0.2, 22, -25);
        condenserGroup.add(fin);
    }
    
    // Liquid Helium Circulator Pipes (TubeGeometry)
    const pipeMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.2 });
    for(let p = 0; p < 8; p++) {
        const angle = (p / 8) * Math.PI * 2;
        const pipePath = [
            new THREE.Vector3(Math.cos(angle)*12, Math.sin(angle)*12, -20),
            new THREE.Vector3(Math.cos(angle)*15, Math.sin(angle)*15, -15),
            new THREE.Vector3(Math.cos(angle)*16, 18, -20),
            new THREE.Vector3(Math.cos(angle)*8, 20, -25)
        ];
        const pipe = createTube(pipePath, 20, 0.6, 8, pipeMaterial);
        condenserGroup.add(pipe);
    }
    elevationAssembly.add(condenserGroup);

    // 3. Electron/Positron Injector Rings (Linear Accelerators feeding the core)
    const injectorGeom = new THREE.CylinderGeometry(3, 3, 30, 32);
    injectorGeom.rotateX(Math.PI / 2);
    const injectorL = new THREE.Mesh(injectorGeom, steel);
    injectorL.position.set(-20, 0, -20);
    injectorL.rotation.y = Math.PI / 4;
    elevationAssembly.add(injectorL);

    const injectorR = new THREE.Mesh(injectorGeom, steel);
    injectorR.position.set(20, 0, -20);
    injectorR.rotation.y = -Math.PI / 4;
    elevationAssembly.add(injectorR);

    // Accelerator rings along the injectors
    meshes.acceleratorRings = [];
    for(let i = -10; i <= 10; i += 4) {
        const ringGeom = new THREE.TorusGeometry(4, 0.8, 16, 32);
        const ringL = new THREE.Mesh(ringGeom, chrome);
        ringL.position.set(0, 0, i);
        injectorL.add(ringL);
        meshes.acceleratorRings.push(ringL);

        const ringR = new THREE.Mesh(ringGeom, chrome);
        ringR.position.set(0, 0, i);
        injectorR.add(ringR);
        meshes.acceleratorRings.push(ringR);
    }

    // 4. Stimulated Emission Trigger (X-Ray Flash Lamp Array)
    const triggerHousingGeom = new THREE.TorusGeometry(8, 2, 32, 64);
    const triggerHousing = new THREE.Mesh(triggerHousingGeom, darkSteel);
    triggerHousing.position.set(0, 0, -5);
    elevationAssembly.add(triggerHousing);

    meshes.flashLamps = [];
    for(let i = 0; i < 12; i++) {
        const lampGeom = new THREE.CylinderGeometry(0.5, 0.5, 4, 16);
        const lamp = new THREE.Mesh(lampGeom, neonPurple);
        const theta = (i / 12) * Math.PI * 2;
        lamp.position.set(Math.cos(theta) * 6, Math.sin(theta) * 6, -5);
        lamp.rotation.z = theta;
        lamp.rotation.x = Math.PI / 2;
        elevationAssembly.add(lamp);
        meshes.flashLamps.push(lamp);
    }

    // 5. The Massive Gamma Collimator Barrel
    const barrelProfile = [
        [8, 0], [12, 5], [12, 10], [9, 15], [9, 30], [14, 35], [14, 45], 
        [10, 50], [10, 80], [13, 85], [13, 95], [8, 100], [6, 120]
    ];
    const mainBarrel = createLatheProfile(barrelProfile, 64, darkSteel);
    mainBarrel.rotation.x = Math.PI / 2;
    // mainBarrel zero point is at 0,0,0, but it extends along +Y which becomes +Z because of rotation
    mainBarrel.position.set(0, 0, 0); 
    elevationAssembly.add(mainBarrel);

    // Segmented Armor Plates on the Barrel
    const plateGeom = new THREE.CylinderGeometry(15, 15, 10, 8, 1, false, 0, Math.PI / 4);
    plateGeom.rotateX(Math.PI / 2);
    for(let zPos = 15; zPos <= 90; zPos += 20) {
        for(let a = 0; a < 8; a++) {
            const plate = new THREE.Mesh(plateGeom, steel);
            plate.position.set(0, 0, zPos);
            plate.rotation.z = (a / 8) * Math.PI * 2;
            elevationAssembly.add(plate);
        }
    }

    // Bragg Diffraction Mirrors (Internal Lenses for Gamma-ray Focusing)
    const lensGeom = new THREE.CylinderGeometry(6, 6, 1, 32);
    lensGeom.rotateX(Math.PI / 2);
    for(let zPos = 10; zPos <= 110; zPos += 25) {
        const lens = new THREE.Mesh(lensGeom, glass);
        lens.position.set(0, 0, zPos);
        elevationAssembly.add(lens);
    }

    // 6. The Gamma Ray Beam (Invisible until animated)
    const beamGeom = new THREE.CylinderGeometry(2, 2, 300, 32);
    beamGeom.rotateX(Math.PI / 2);
    const gammaBeam = new THREE.Mesh(beamGeom, gammaBeamMat);
    gammaBeam.position.set(0, 0, 150 + 120); // Extends far out
    gammaBeam.scale.set(0, 1, 0); // Initially scaled to 0
    elevationAssembly.add(gammaBeam);
    meshes.gammaBeam = gammaBeam;

    // 7. Hydraulic Elevation Pistons
    const pistonCylinderGeom = new THREE.CylinderGeometry(2.5, 2.5, 25, 32);
    const pistonRodGeom = new THREE.CylinderGeometry(1.5, 1.5, 25, 32);
    
    // Left Piston
    const pistonL = new THREE.Group();
    const pCylL = new THREE.Mesh(pistonCylinderGeom, darkSteel);
    const pRodL = new THREE.Mesh(pistonRodGeom, chrome);
    pRodL.position.y = 12.5;
    pistonL.add(pCylL);
    pistonL.add(pRodL);
    pistonL.position.set(-20, 20, 0);
    pistonL.rotation.x = Math.PI / 4;
    turretPlatform.add(pistonL);
    meshes.pistonL = pRodL;

    // Right Piston
    const pistonR = new THREE.Group();
    const pCylR = new THREE.Mesh(pistonCylinderGeom, darkSteel);
    const pRodR = new THREE.Mesh(pistonRodGeom, chrome);
    pRodR.position.y = 12.5;
    pistonR.add(pCylR);
    pistonR.add(pRodR);
    pistonR.position.set(20, 20, 0);
    pistonR.rotation.x = Math.PI / 4;
    turretPlatform.add(pistonR);
    meshes.pistonR = pRodR;

    // 8. Operator Cabin & Quantum Diagnostics Systems
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(25, 10, -25);
    turretPlatform.add(cabinGroup);

    const cabinBodyShape = [
        [0, 0], [15, 0], [18, 10], [15, 20], [5, 20], [0, 10]
    ];
    const cabinBody = createExtrudedShape(cabinBodyShape, 12, darkSteel);
    cabinBody.rotation.y = -Math.PI / 2;
    cabinGroup.add(cabinBody);

    const windowGeom = new THREE.PlaneGeometry(10, 8);
    const cabinWindow = new THREE.Mesh(windowGeom, tinted);
    cabinWindow.position.set(6, 12, -6.1);
    cabinWindow.rotation.y = Math.PI;
    cabinGroup.add(cabinWindow);

    // Glowing Control Panels Inside
    const panelGeom = new THREE.BoxGeometry(4, 2, 0.5);
    const panel = new THREE.Mesh(panelGeom, neonBlue);
    panel.position.set(6, 10, -5);
    panel.rotation.x = -Math.PI / 4;
    cabinGroup.add(panel);

    // Radar / Antenna Array
    const dishGeom = new THREE.SphereGeometry(4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 3);
    const dish = new THREE.Mesh(dishGeom, aluminum);
    dish.position.set(10, 25, -6);
    dish.rotation.x = -Math.PI / 2;
    cabinGroup.add(dish);
    meshes.radarDish = dish;

    const antennaGeom = new THREE.CylinderGeometry(0.2, 0.2, 15);
    const antenna = new THREE.Mesh(antennaGeom, steel);
    antenna.position.set(10, 30, -6);
    cabinGroup.add(antenna);


    // -------------------------------------------------------------------------
    // MASSIVE PARTS ARRAY (Rich metadata for encyclopedia)
    // -------------------------------------------------------------------------
    parts.push(
        {
            name: "Bose-Einstein Condensate Containment Sphere",
            description: "An ultra-dense, gravitationally reinforced sphere that holds billions of positronium atoms in a unified quantum state. Capable of maintaining structural integrity under extreme energetic stress.",
            material: "Hyper-Alloy Dark Steel & Magnetic Plasma",
            function: "Contains the volatile positron-electron matrix prior to stimulated annihilation.",
            assemblyOrder: 1,
            connections: ["superconducting_toroidal_coils", "cryo_condenser_banks"],
            failureEffect: "Spontaneous uncollimated matter-antimatter detonation; catastrophic local spacetime fracturing.",
            cascadeFailures: ["cryo_condenser_banks", "gamma_collimator_barrel"],
            originalPosition: {x: 0, y: 45, z: -20},
            explodedPosition: {x: 0, y: 100, z: -60}
        },
        {
            name: "Superconducting Toroidal Coils",
            description: "Six massive, liquid-helium-cooled copper electromagnets that generate a complex multipole magnetic bottle, isolating the positronium from physical walls.",
            material: "Niobium-Titanium / Oxygen-Free Copper",
            function: "Magnetic confinement and levitation of the active medium.",
            assemblyOrder: 2,
            connections: ["primary_containment_vessel"],
            failureEffect: "Loss of magnetic confinement; plasma touches the walls, resulting in immediate thermal vaporization of the core.",
            cascadeFailures: ["primary_containment_vessel"],
            originalPosition: {x: 0, y: 45, z: -20},
            explodedPosition: {x: -30, y: 60, z: -40}
        },
        {
            name: "Cryogenic Condenser Banks",
            description: "Extreme cooling radiators and pumps that flow superfluid helium-4 around the containment vessel, maintaining temperatures near 10 nanoKelvins.",
            material: "Industrial Steel & Aluminum Heat Fins",
            function: "Thermal regulation of the BEC core.",
            assemblyOrder: 3,
            connections: ["helium_circulation_pipes"],
            failureEffect: "Thermal drift; the positronium atoms break their degenerate state and begin premature, chaotic annihilation.",
            cascadeFailures: [],
            originalPosition: {x: 0, y: 63, z: -25},
            explodedPosition: {x: 0, y: 120, z: -20}
        },
        {
            name: "Liquid Helium Circulation Pipes",
            description: "High-pressure tubing that constantly circulates cryogenics. Uses specialized non-turbulent flow metrics to prevent vibrational disruptions.",
            material: "Reinforced Cryo-Polymers",
            function: "Moves coolant between the condenser and the coils.",
            assemblyOrder: 4,
            connections: ["cryo_condenser_banks", "superconducting_toroidal_coils"],
            failureEffect: "Coolant leak causing localized freezing and immediate brittle fracturing of adjacent components.",
            cascadeFailures: ["superconducting_toroidal_coils"],
            originalPosition: {x: 0, y: 63, z: -20},
            explodedPosition: {x: 40, y: 90, z: -20}
        },
        {
            name: "Positron & Electron Injector Rings",
            description: "Dual linear accelerators that feed particles into the core at exact relational velocities, allowing them to bind into ortho-positronium rather than immediately annihilating.",
            material: "Polished Steel & Chrome Rings",
            function: "Supplies the raw fuel (matter and antimatter) to the system.",
            assemblyOrder: 5,
            connections: ["primary_containment_vessel"],
            failureEffect: "Asymmetric injection leads to a matter-antimatter imbalance, causing excessive background gamma radiation.",
            cascadeFailures: ["quantum_diagnostic_sensors"],
            originalPosition: {x: -20, y: 45, z: -40},
            explodedPosition: {x: -60, y: 45, z: -80}
        },
        {
            name: "Stimulated Emission X-Ray Trigger",
            description: "A ring of ultra-high-intensity flash lamps that pulse precisely at the resonant frequency of the positronium lattice, forcing a simultaneous, cascading collapse.",
            material: "Neon-Doped Synthetic Quartz",
            function: "Initiates the graser firing sequence.",
            assemblyOrder: 6,
            connections: ["gamma_collimator_barrel"],
            failureEffect: "Asynchronous firing causing a 'fizzle', releasing standard thermal radiation instead of a coherent gamma beam.",
            cascadeFailures: ["primary_containment_vessel"],
            originalPosition: {x: 0, y: 45, z: -5},
            explodedPosition: {x: 0, y: 30, z: -40}
        },
        {
            name: "Gamma Collimator Barrel",
            description: "A colossal, heavy-metal barrel designed to channel and focus the output gamma rays. Built with dense Z-materials to prevent radiation leakage.",
            material: "Depleted Uranium & Tungsten Alloys",
            function: "Focuses and directs the lethal gamma-ray burst.",
            assemblyOrder: 7,
            connections: ["bragg_diffraction_mirrors", "segmented_armor_plates"],
            failureEffect: "Beam spread causing immense collateral radiation damage to the immediate surroundings.",
            cascadeFailures: ["operator_cabin"],
            originalPosition: {x: 0, y: 45, z: 0},
            explodedPosition: {x: 0, y: 80, z: 100}
        },
        {
            name: "Bragg Diffraction Mirrors",
            description: "Instead of traditional optical lenses, these use precisely spaced crystalline atomic planes to refract and focus gamma rays through Bragg scattering.",
            material: "Perfectly Flawless Silicon-28 Crystals",
            function: "Focusing optics for extreme-high-energy photons.",
            assemblyOrder: 8,
            connections: ["gamma_collimator_barrel"],
            failureEffect: "Crystal shattering under photon pressure, turning the laser into an omnidirectional gamma bomb.",
            cascadeFailures: ["gamma_collimator_barrel"],
            originalPosition: {x: 0, y: 45, z: 60},
            explodedPosition: {x: -50, y: 50, z: 120}
        },
        {
            name: "Segmented Armor Plates",
            description: "Overlapping radiation shielding along the length of the barrel to protect the chassis from back-scatter.",
            material: "Lead-Lined Steel",
            function: "Protection against ionizing radiation.",
            assemblyOrder: 9,
            connections: ["gamma_collimator_barrel"],
            failureEffect: "Operator and localized electronics suffer lethal/destructive rad doses.",
            cascadeFailures: ["quantum_diagnostic_sensors"],
            originalPosition: {x: 0, y: 45, z: 50},
            explodedPosition: {x: 60, y: 50, z: 80}
        },
        {
            name: "Azimuth Tracking Turret Base",
            description: "The massive rotating platform that allows the heavy graser to turn horizontally 360 degrees. Supported by industrial-grade ball bearings.",
            material: "Dark Forged Steel",
            function: "Horizontal targeting and structural support.",
            assemblyOrder: 10,
            connections: ["hydraulic_elevation_struts", "heavy_duty_chassis"],
            failureEffect: "Turret jams, rendering the weapon incapable of tracking moving targets.",
            cascadeFailures: [],
            originalPosition: {x: 0, y: 15, z: 0},
            explodedPosition: {x: 0, y: 20, z: 0}
        },
        {
            name: "Hydraulic Elevation Struts",
            description: "Massive pistons capable of lifting hundreds of tons, allowing precise vertical pitch adjustments of the collimator barrel.",
            material: "Chromium Plated Steel",
            function: "Vertical targeting (Pitch control).",
            assemblyOrder: 11,
            connections: ["azimuth_tracking_turret_base", "gamma_collimator_barrel"],
            failureEffect: "Barrel drops under its own immense weight, slamming into the deck and misaligning the optics.",
            cascadeFailures: ["gamma_collimator_barrel", "bragg_diffraction_mirrors"],
            originalPosition: {x: -20, y: 35, z: 0},
            explodedPosition: {x: -40, y: -10, z: 0}
        },
        {
            name: "Structural Side Yokes",
            description: "Heavy cast trunnion supports that take the rotational load of the entire barrel and containment assembly.",
            material: "Titanium Enriched Steel",
            function: "Load-bearing joints for pitch rotation.",
            assemblyOrder: 12,
            connections: ["azimuth_tracking_turret_base", "gamma_collimator_barrel"],
            failureEffect: "Structural shear, causing the entire weapon assembly to detach and collapse.",
            cascadeFailures: ["gamma_collimator_barrel", "primary_containment_vessel"],
            originalPosition: {x: -15, y: 17, z: -18},
            explodedPosition: {x: -30, y: 10, z: -30}
        },
        {
            name: "Operator Cabin",
            description: "An isolated, lead-lined, and electromagnetically shielded control booth. Features tinted radiation-proof glass and complex bio-monitors.",
            material: "Lead-Glass & Dark Steel",
            function: "Provides a safe environment for human operators or AI cores.",
            assemblyOrder: 13,
            connections: ["azimuth_tracking_turret_base"],
            failureEffect: "Compromised life-support and immediate radiation poisoning of personnel.",
            cascadeFailures: [],
            originalPosition: {x: 25, y: 25, z: -25},
            explodedPosition: {x: 80, y: 10, z: -40}
        },
        {
            name: "Quantum Diagnostic Sensors",
            description: "Advanced radar dishes and antennae that read the entanglement state of the positronium cloud and the atmospheric refraction ahead of the beam.",
            material: "Aluminum & Gold-Foil Relays",
            function: "Telemetry and quantum state monitoring.",
            assemblyOrder: 14,
            connections: ["operator_cabin"],
            failureEffect: "Loss of state telemetry, forcing blind or calculated-guess firing protocols.",
            cascadeFailures: [],
            originalPosition: {x: 35, y: 40, z: -31},
            explodedPosition: {x: 90, y: 70, z: -50}
        },
        {
            name: "Heavy-Duty Suspension & Tread System",
            description: "An eight-wheel independent suspension system featuring massive rubber off-road tires with deep lugs, designed to bear the colossal weight of the Graser and traverse harsh terrain.",
            material: "Vulcanized Rubber & Chrome Shocks",
            function: "Mobility and recoil absorption.",
            assemblyOrder: 15,
            connections: ["chassis_undercarriage"],
            failureEffect: "Immobility and inability to absorb the violent recoil of the cooling/venting systems during firing.",
            cascadeFailures: ["hydraulic_elevation_struts"],
            originalPosition: {x: -25, y: -15, z: 20},
            explodedPosition: {x: -70, y: -15, z: 60}
        }
    );

    // -------------------------------------------------------------------------
    // EXPERT QUIZ QUESTIONS (PhD Level QED & Laser Physics)
    // -------------------------------------------------------------------------
    const quizQuestions = [
        {
            question: "In the context of an Orthopositronium Gamma-Ray Laser, what fundamentally prevents the standard optical pumping mechanisms used in conventional lasers from achieving population inversion in the positronium plasma?",
            options: [
                "The spontaneous annihilation lifetime of ortho-positronium (142 ns) is too short to allow for traditional slow optical pumping to build a sufficient metastable population.",
                "Positronium atoms cannot absorb photons of any wavelength, making optical pumping entirely impossible.",
                "The intense gravitational field required to contain the plasma red-shifts the pump photons out of resonance.",
                "Optical pumping would instantly convert all ortho-positronium into para-positronium, preventing gamma-ray emission."
            ],
            correctAnswer: 0,
            explanation: "Ortho-positronium has a vacuum lifetime of only about 142 nanoseconds before it annihilates into three gamma rays. This incredibly short window means that traditional optical pumping (which is relatively slow) cannot build up the necessary population inversion before the atoms decay naturally. This necessitates extremely rapid, intense trigger mechanisms."
        },
        {
            question: "Why is Bose-Einstein Condensation (BEC) of positronium theoretically desirable for the operation of a high-gain annihilation Graser?",
            options: [
                "BEC causes the positronium atoms to share the exact same quantum state, resulting in a macroscopic wave function that dramatically increases the probability of stimulated, coherent multiphoton emission.",
                "BEC raises the temperature of the core, adding thermal kinetic energy to the output gamma rays.",
                "BEC alters the fundamental charge of the positrons, turning them into heavier muons.",
                "BEC prevents the formation of gamma rays, converting the output entirely into highly focused microwave radiation."
            ],
            correctAnswer: 0,
            explanation: "In a Bose-Einstein Condensate, all the bosonic positronium atoms collapse into the lowest quantum state, behaving as a single macro-quantum oscillator. When one atom undergoes stimulated emission (annihilation), the indistinguishability of the atoms drastically enhances the probability that others will follow in exact phase, creating highly coherent gamma radiation."
        },
        {
            question: "How do Bragg diffraction mirrors focus the gamma-ray beam, given that standard glass or metallic mirrors cannot reflect photons of such extreme energy?",
            options: [
                "They utilize the periodic atomic planes of a perfect crystal lattice; when the gamma rays strike at the specific Bragg angle, constructive interference of the scattered waves acts like a mirror.",
                "They use intense magnetic fields to bend the path of the neutrally-charged gamma rays.",
                "They rely on total internal reflection within a vacuum tube coated with depleted uranium.",
                "They utilize gravitational lensing generated by a microscopic black hole at the center of the mirror."
            ],
            correctAnswer: 0,
            explanation: "Gamma rays have wavelengths on the order of picometers (similar to atomic spacing). They pass straight through standard mirrors. However, by using a perfect crystal, gamma rays hitting the lattice planes at a specific angle (Bragg's Law: nλ = 2d sin θ) will undergo coherent scattering (diffraction) that can be shaped to focus the beam."
        },
        {
            question: "The theoretical decay of Para-positronium yields two gamma rays, whereas Ortho-positronium yields three. Why must the Graser utilize Ortho-positronium?",
            options: [
                "Para-positronium decays much too quickly (125 ps), making it impossible to accumulate a dense enough population for stimulated emission without it spontaneously detonating.",
                "Three gamma rays are required to breach standard armor plating, whereas two are easily deflected.",
                "Ortho-positronium is negatively charged and can be contained by electric fields, while Para-positronium is neutral.",
                "Para-positronium only annihilates into neutrinos, which cannot be used as a weaponized beam."
            ],
            correctAnswer: 0,
            explanation: "Para-positronium (spins anti-parallel) has a drastically shorter lifetime of ~125 picoseconds compared to Ortho-positronium's 142 nanoseconds. It is effectively impossible to trap and condense Para-positronium before it decays. Ortho-positronium lives roughly 1000 times longer, giving physicists a tiny fraction of a second to manipulate it."
        },
        {
            question: "During the firing sequence, what is the primary source of the extreme recoil experienced by the chassis, given that photons possess no rest mass?",
            options: [
                "Photons carry momentum (p = E/c); firing a petawatt-class beam of gamma rays imparts a massive reactionary force back onto the collimator and chassis.",
                "The recoil is entirely due to the sudden expansion of the liquid helium coolant vaporizing.",
                "The magnetic coils violently repelling each other when the power is suddenly cut.",
                "Positrons leaking from the containment vessel and detonating in the atmosphere behind the machine."
            ],
            correctAnswer: 0,
            explanation: "Even though photons have zero rest mass, they carry relativistic momentum defined by p = E/c (or p = h/λ). A Graser emitting an incomprehensible amount of energy (E) in a microscopic timeframe will generate a huge amount of momentum, causing violent physical recoil according to Newton's Third Law."
        }
    ];

    // -------------------------------------------------------------------------
    // ANIMATION & LOGIC LOOP
    // -------------------------------------------------------------------------
    let beamFired = false;
    let chargeCycle = 0;

    const animate = function (time, speed, meshesObj = meshes) {
        // Time factor scaled by user speed
        const t = time * speed * 0.001;

        // 1. Suspension & Driving Animation
        if(meshesObj.tires) {
            meshesObj.tires.forEach(tireData => {
                // If the machine is moving forward, rotate tires
                // Assuming it crawls very slowly due to massive weight
                tireData.mesh.rotation.z -= speed * 0.02 * tireData.side;
            });
        }

        // 2. Turret Tracking (Azimuth & Pitch)
        // Sweeps slowly side to side, and pitches up and down
        if(meshesObj.turretPlatform) {
            meshesObj.turretPlatform.rotation.y = Math.sin(t * 0.3) * 0.5;
        }
        
        let pitch = Math.sin(t * 0.5) * 0.2 + 0.2; // Ranging from 0 to 0.4 radians up
        if(meshesObj.elevationAssembly) {
            meshesObj.elevationAssembly.rotation.x = -pitch;
        }

        // Hydraulic Piston synchronization to the pitch
        if(meshesObj.pistonL && meshesObj.pistonR) {
            // As barrel pitches up (negative rot x), pistons must extend
            const extension = pitch * 15; 
            meshesObj.pistonL.position.y = 12.5 + extension;
            meshesObj.pistonR.position.y = 12.5 + extension;
        }

        // 3. Radar Dish Spinning
        if(meshesObj.radarDish) {
            meshesObj.radarDish.rotation.z = t * 2;
        }

        // 4. Injector Accelerator Rings pulsing
        if(meshesObj.acceleratorRings) {
            meshesObj.acceleratorRings.forEach((ring, idx) => {
                // Creates a traveling wave effect along the injectors
                const scale = 1.0 + Math.sin(t * 10 + idx * 0.5) * 0.2;
                ring.scale.set(scale, scale, scale);
                // Pulse color/emissive if we have access to it, here we just scale
            });
        }

        // 5. Containment Core Dynamics
        chargeCycle = (t * 0.5) % 4; // 4 second overall cycle: 3s charge, 1s fire/cool
        
        // Coils rotate to simulate magnetic flux
        if(meshesObj.confinementCoils) {
            meshesObj.confinementCoils.forEach((coil, idx) => {
                coil.rotation.z = t * (idx % 2 === 0 ? 1 : -1) * (1 + chargeCycle);
            });
        }

        // Lattice Nodes vibrating
        if(meshesObj.latticeNodes) {
            const intensity = Math.max(0, (chargeCycle - 2)); // High intensity right before fire
            meshesObj.latticeNodes.forEach(nodeData => {
                const jitterX = (Math.random() - 0.5) * intensity * 0.5;
                const jitterY = (Math.random() - 0.5) * intensity * 0.5;
                const jitterZ = (Math.random() - 0.5) * intensity * 0.5;
                nodeData.mesh.position.set(
                    nodeData.baseX + jitterX,
                    nodeData.baseY + jitterY,
                    nodeData.baseZ + jitterZ
                );
            });
        }

        // 6. Firing Sequence (Trigger and Beam)
        if(chargeCycle > 3.0 && chargeCycle < 3.2) {
            // Flash lamps trigger!
            if(meshesObj.flashLamps) {
                meshesObj.flashLamps.forEach(lamp => {
                    lamp.material.emissiveIntensity = 10;
                });
            }
            
            // Beam fires
            if(meshesObj.gammaBeam) {
                // Expanding the cylinder to max scale instantly
                meshesObj.gammaBeam.scale.set(1, 1, 1);
                // Flicker opacity
                meshesObj.gammaBeam.material.opacity = 0.8 + Math.random() * 0.2;
                
                // Recoil: push the whole barrel back slightly
                meshesObj.elevationAssembly.position.z = Math.random() * 1.5;
            }
        } else {
            // Cool down / Charging
            if(meshesObj.flashLamps) {
                meshesObj.flashLamps.forEach(lamp => {
                    lamp.material.emissiveIntensity = 0.5 + Math.sin(t * 5) * 0.5;
                });
            }
            if(meshesObj.gammaBeam) {
                // Retract beam to nothing
                meshesObj.gammaBeam.scale.set(0, 1, 0);
                // Reset recoil position
                meshesObj.elevationAssembly.position.z = 0;
            }
        }
    };

    return { group, parts, description: "God Tier Orthopositronium Annihilation Gamma-Ray Laser (Graser). The pinnacle of weaponized quantum electrodynamics.", quizQuestions, animate };
}
