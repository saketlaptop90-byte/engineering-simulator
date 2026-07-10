import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const machineGroup = new THREE.Group();
    machineGroup.name = "Ultra_God_Tier_Anechoic_Wedge";
    const parts = [];
    
    // Internal lists for animation
    const animatedWedges = [];
    const energyWaves = [];
    const frostParticles = [];
    const hydraulicPistons = [];
    const cryoTubes = [];
    const quantumCores = [];
    const spaceBendingFields = [];

    // Advanced Custom Materials for "God Tier" effects
    const VantablackMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x000000,
        metalness: 0.0,
        roughness: 1.0,
        clearcoat: 0.0,
        reflectivity: 0.0,
        transmission: 0.0,
        ior: 1.0,
        emissive: 0x000000
    });

    const AbsoluteZeroFrostMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xe0f7fa,
        metalness: 0.1,
        roughness: 0.2,
        transmission: 0.9,
        ior: 1.31,
        thickness: 0.5,
        emissive: 0x001133,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.8
    });

    const QuantumEnergyMaterial = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0x8800ff,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.6,
        wireframe: true
    });

    const SpaceBendingMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x000000,
        metalness: 1.0,
        roughness: 0.0,
        transmission: 1.0,
        ior: 2.5, // High index of refraction to bend background
        thickness: 2.0,
        transparent: true,
        opacity: 0.3
    });

    // Helper: Create a single deeply detailed pyramidal wedge
    function createComplexWedge(width, depth, height) {
        const wedgeGroup = new THREE.Group();
        
        // Base Pyramid
        const geomPyramid = new THREE.CylinderGeometry(0, width / 2, height, 4, 1);
        geomPyramid.translate(0, height / 2, 0);
        const pyramid = new THREE.Mesh(geomPyramid, VantablackMaterial);
        
        // Micro-perforations (using tiny boxes along the edges)
        const perfGeom = new THREE.BoxGeometry(width * 0.05, width * 0.05, width * 0.05);
        const perfCount = 15;
        for(let i=0; i<perfCount; i++) {
            const ratio = i / perfCount;
            const yPos = ratio * height;
            const currentWidth = (1 - ratio) * (width / 2);
            
            // Four corners
            const corners = [
                [currentWidth, yPos, currentWidth],
                [-currentWidth, yPos, currentWidth],
                [currentWidth, yPos, -currentWidth],
                [-currentWidth, yPos, -currentWidth]
            ];
            
            corners.forEach(pos => {
                const perf = new THREE.Mesh(perfGeom, chrome);
                perf.position.set(pos[0], pos[1], pos[2]);
                wedgeGroup.add(perf);
            });
        }
        
        wedgeGroup.add(pyramid);
        return wedgeGroup;
    }

    // Helper: Create Fractal Wedge Arrays
    function buildFractalWedgeArray(baseWidth, levels, groupTarget, xOffset, zOffset) {
        if (levels <= 0) return;
        
        const w = baseWidth;
        const h = w * 3; 
        const wedge = createComplexWedge(w, w, h);
        wedge.position.set(xOffset, 0, zOffset);
        
        groupTarget.add(wedge);
        animatedWedges.push({
            mesh: wedge,
            baseHeight: h,
            phase: Math.random() * Math.PI * 2,
            speed: 1.5 + Math.random()
        });

        // Sub-wedges
        const subW = w / 3;
        const offset = w / 2;
        
        if (levels > 1) {
            buildFractalWedgeArray(subW, levels - 1, groupTarget, xOffset + offset, zOffset + offset);
            buildFractalWedgeArray(subW, levels - 1, groupTarget, xOffset - offset, zOffset + offset);
            buildFractalWedgeArray(subW, levels - 1, groupTarget, xOffset + offset, zOffset - offset);
            buildFractalWedgeArray(subW, levels - 1, groupTarget, xOffset - offset, zOffset - offset);
        }
    }

    // --- Base Platform (Isolation Mount) ---
    const platformGroup = new THREE.Group();
    machineGroup.add(platformGroup);

    // 1. Massive Primary Isolation Plinth
    const plinthGeom = new THREE.BoxGeometry(40, 2, 40);
    const plinth = new THREE.Mesh(plinthGeom, darkSteel);
    plinth.position.y = -1;
    platformGroup.add(plinth);
    
    parts.push({
        name: "Hyper-Dense Seismic Isolation Plinth",
        description: "A solid block of depleted uranium encased in titanium-carbide, providing an infinite mechanical impedance to incoming vibrations.",
        material: "Dark Steel / Depleted Uranium",
        function: "Establishes an absolute reference frame completely isolated from external planetary micro-seismics.",
        assemblyOrder: 1,
        connections: ["Hydraulic Dampeners", "Fractal Wedge Array Base"],
        failureEffect: "Allows quantum decoherence from micro-vibrational leakage.",
        cascadeFailures: ["Wedge Resonance Instability", "Cryogenic Seal Rupture"],
        originalPosition: { x: 0, y: -1, z: 0 },
        explodedPosition: { x: 0, y: -20, z: 0 }
    });

    // 2. Active Hydraulic Dampeners
    const createHydraulicMount = (x, z) => {
        const mount = new THREE.Group();
        mount.position.set(x, -5, z);
        
        const outerCylGeom = new THREE.CylinderGeometry(1.5, 1.5, 4, 32);
        const outerCyl = new THREE.Mesh(outerCylGeom, steel);
        outerCyl.position.y = 2;
        mount.add(outerCyl);
        
        const innerCylGeom = new THREE.CylinderGeometry(1.0, 1.0, 4, 32);
        const innerCyl = new THREE.Mesh(innerCylGeom, chrome);
        innerCyl.position.y = 4;
        mount.add(innerCyl);
        
        // Fluid line
        const lineCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(1.5, 2, 0),
            new THREE.Vector3(3, 2, 0),
            new THREE.Vector3(3, 0, -x*0.1)
        ]);
        const tubeGeom = new THREE.TubeGeometry(lineCurve, 20, 0.2, 8, false);
        const tube = new THREE.Mesh(tubeGeom, copper);
        mount.add(tube);
        
        hydraulicPistons.push({
            piston: innerCyl,
            baseY: 4,
            phase: x * z
        });
        
        return mount;
    };
    
    const mountOffsets = [
        [18, 18], [-18, 18], [18, -18], [-18, -18],
        [18, 0], [-18, 0], [0, 18], [0, -18]
    ];
    
    mountOffsets.forEach((pos, idx) => {
        const hMount = createHydraulicMount(pos[0], pos[1]);
        platformGroup.add(hMount);
        parts.push({
            name: `Active Feedback Hydraulic Mount ${idx+1}`,
            description: "Magneto-rheological fluid dampers actively opposing nanoscale vibrations via laser interferometry feedback.",
            material: "Steel / Chrome / Copper",
            function: "Real-time cancellation of residual substrate noise.",
            assemblyOrder: 2,
            connections: ["Isolation Plinth", "Cooling Subsystem"],
            failureEffect: "Low-frequency resonance amplification.",
            cascadeFailures: [],
            originalPosition: { x: pos[0], y: -5, z: pos[1] },
            explodedPosition: { x: pos[0]*2, y: -15, z: pos[1]*2 }
        });
    });

    // 3. Central Fractal Wedge Array
    const fractalGroup = new THREE.Group();
    fractalGroup.position.y = 0;
    platformGroup.add(fractalGroup);
    
    // Build massive array of fractal wedges
    buildFractalWedgeArray(12, 4, fractalGroup, 0, 0); // Center massive wedge
    // Corner massive wedges
    buildFractalWedgeArray(8, 3, fractalGroup, 12, 12);
    buildFractalWedgeArray(8, 3, fractalGroup, -12, 12);
    buildFractalWedgeArray(8, 3, fractalGroup, 12, -12);
    buildFractalWedgeArray(8, 3, fractalGroup, -12, -12);

    parts.push({
        name: "Infinite-Depth Fractal Anechoic Metamaterial Core",
        description: "Recursive arrays of Vantablack-coated pyramidal structures extending down to the nanoscale, acting as a one-way acoustic black hole.",
        material: "Vantablack / Carbon Nanotubes",
        function: "Traps and internally reflects sound waves infinitely until their energy is entirely converted to heat.",
        assemblyOrder: 3,
        connections: ["Isolation Plinth", "Cryogenic Extraction System"],
        failureEffect: "Acoustic reflection leading to standing wave formation.",
        cascadeFailures: ["Wedge Delamination", "Thermal Overload"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 25, z: 0 }
    });

    // 4. Cryogenic Cooling Extraction System (Thermal conversion)
    const cryoGroup = new THREE.Group();
    platformGroup.add(cryoGroup);
    
    const cryoRingGeom = new THREE.TorusGeometry(15, 0.8, 16, 100);
    const cryoRing1 = new THREE.Mesh(cryoRingGeom, glass);
    cryoRing1.rotation.x = Math.PI / 2;
    cryoRing1.position.y = 0.5;
    cryoGroup.add(cryoRing1);
    
    const cryoRing2 = new THREE.Mesh(cryoRingGeom, glass);
    cryoRing2.rotation.x = Math.PI / 2;
    cryoRing2.position.y = 8.0;
    cryoRing2.scale.set(0.6, 0.6, 0.6);
    cryoGroup.add(cryoRing2);

    cryoTubes.push(cryoRing1, cryoRing2);

    parts.push({
        name: "Superfluid Helium Cryo-Extraction Torus",
        description: "Circulates superfluid Helium-4 at 1.2 Kelvin to extract the immense heat generated by the fractal absorption of sound waves.",
        material: "Transparent Sapphire Glass / Liquid Helium",
        function: "Maintains absolute zero conditions to prevent thermal noise from vibrating the wedge atoms.",
        assemblyOrder: 4,
        connections: ["Fractal Anechoic Core", "Space Bending Field Generator"],
        failureEffect: "Thermal runaway; wedges glow red hot and emit blackbody acoustic radiation.",
        cascadeFailures: ["Fractal Core Meltdown", "Explosive Phase Transition"],
        originalPosition: { x: 0, y: 4, z: 0 },
        explodedPosition: { x: 0, y: -10, z: 0 }
    });

    // 5. Sound/Energy Wave Emitters & Consumers (Visualizing the sound being trapped)
    const energyGroup = new THREE.Group();
    platformGroup.add(energyGroup);
    
    // Create hundreds of tiny spheres acting as acoustic phonons entering the structure
    const phononGeom = new THREE.IcosahedronGeometry(0.3, 1);
    const phononMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 3,
        transparent: true,
        opacity: 0.8
    });
    
    for(let i = 0; i < 200; i++) {
        const p = new THREE.Mesh(phononGeom, phononMaterial);
        
        // Random starting positions in a dome over the wedges
        const radius = 25 + Math.random() * 20;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI / 2;
        
        const px = radius * Math.sin(phi) * Math.cos(theta);
        const py = radius * Math.cos(phi);
        const pz = radius * Math.sin(phi) * Math.sin(theta);
        
        p.position.set(px, py, pz);
        energyGroup.add(p);
        
        energyWaves.push({
            mesh: p,
            angle: theta,
            radius: radius,
            height: py,
            speed: 0.2 + Math.random() * 0.5
        });
    }

    parts.push({
        name: "Phonon Trajectory Visualization System",
        description: "Holographic tracking of incoming macroscopic sound waves and microscopic phonons.",
        material: "Holographic Plasma",
        function: "Provides diagnostic visual feedback of the acoustic absorption efficiency.",
        assemblyOrder: 5,
        connections: ["Energy Core"],
        failureEffect: "Loss of visual telemetry.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 25, z: 0 },
        explodedPosition: { x: 0, y: 50, z: 0 }
    });

    // 6. Absolute Zero Frost Crystal Formations
    const frostGroup = new THREE.Group();
    machineGroup.add(frostGroup);
    
    const crystalGeom = new THREE.OctahedronGeometry(0.8, 0);
    
    for (let i = 0; i < 150; i++) {
        const crystal = new THREE.Mesh(crystalGeom, AbsoluteZeroFrostMaterial);
        // Distribute around the base and wedges randomly
        const cx = (Math.random() - 0.5) * 35;
        const cz = (Math.random() - 0.5) * 35;
        const cy = Math.random() * 5;
        crystal.position.set(cx, cy, cz);
        crystal.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
        frostGroup.add(crystal);
        
        frostParticles.push({
            mesh: crystal,
            baseScale: Math.random() * 1.5 + 0.5,
            pulseSpeed: 0.05 + Math.random() * 0.1,
            phase: Math.random() * Math.PI * 2
        });
    }

    parts.push({
        name: "Bose-Einstein Condensate Frost Deposits",
        description: "Macroscopic quantum phenomena manifesting as frost due to localized regions dropping below 1 nano-Kelvin.",
        material: "Frozen Air / BEC Quantum Matter",
        function: "Passive indicator of extreme thermal energy extraction from acoustic dampening.",
        assemblyOrder: 6,
        connections: ["Cryogenic Extraction System"],
        failureEffect: "Sublimation and rapid expansion, causing a localized shockwave.",
        cascadeFailures: ["Wedge Micro-fractures"],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: 0, y: 2, z: 40 }
    });

    // 7. Space-Bending Acoustic Singularity Core
    const singularityGroup = new THREE.Group();
    singularityGroup.position.y = 15;
    platformGroup.add(singularityGroup);
    
    const coreGeom = new THREE.SphereGeometry(3, 64, 64);
    const coreMesh = new THREE.Mesh(coreGeom, SpaceBendingMaterial);
    singularityGroup.add(coreMesh);
    spaceBendingFields.push(coreMesh);

    // Inner glowing singularity
    const innerCoreGeom = new THREE.SphereGeometry(1.5, 32, 32);
    const innerCoreMesh = new THREE.Mesh(innerCoreGeom, QuantumEnergyMaterial);
    singularityGroup.add(innerCoreMesh);
    quantumCores.push(innerCoreMesh);
    
    // Orbital rings representing gravitational bending of sound
    for (let r = 0; r < 3; r++) {
        const ringGeom = new THREE.TorusGeometry(4 + r*1.5, 0.1, 16, 100);
        const ring = new THREE.Mesh(ringGeom, QuantumEnergyMaterial);
        ring.rotation.x = Math.random() * Math.PI;
        ring.rotation.y = Math.random() * Math.PI;
        singularityGroup.add(ring);
        quantumCores.push(ring);
    }

    parts.push({
        name: "Acoustic Singularity Generator",
        description: "Locally alters the refractive index of the medium to infinity, creating an acoustic event horizon from which no sound can escape.",
        material: "Metamaterial Lattice / Exotic Matter",
        function: "Bends spacetime slightly to guarantee 100% phonon capture.",
        assemblyOrder: 7,
        connections: ["Fractal Core", "Cryogenic Torus"],
        failureEffect: "Spontaneous emission of a sonic boom of infinite amplitude (Hawking-Acoustic radiation).",
        cascadeFailures: ["Total System Vaporization"],
        originalPosition: { x: 0, y: 15, z: 0 },
        explodedPosition: { x: 0, y: 40, z: 0 }
    });

    // 8. Sensory Arrays and Control Cabin
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(22, 10, 0);
    machineGroup.add(cabinGroup);

    // Platform for cabin
    const cabinPlatform = new THREE.Mesh(new THREE.BoxGeometry(6, 0.5, 6), steel);
    cabinGroup.add(cabinPlatform);
    
    const cabinBody = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5), plastic);
    cabinBody.position.y = 2.75;
    cabinGroup.add(cabinBody);
    
    const cabinWindow = new THREE.Mesh(new THREE.PlaneGeometry(4, 3), tinted);
    cabinWindow.position.set(-2.51, 3, 0);
    cabinWindow.rotation.y = -Math.PI / 2;
    cabinGroup.add(cabinWindow);

    // Massive cabling from cabin to base
    const cableCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(22, 10, 0),
        new THREE.Vector3(25, 5, 0),
        new THREE.Vector3(20, -1, 0)
    ]);
    const cableMesh = new THREE.Mesh(new THREE.TubeGeometry(cableCurve, 30, 0.5, 8, false), rubber);
    machineGroup.add(cableMesh);

    parts.push({
        name: "Telemetry & Operator Overwatch Cabin",
        description: "Heavily shielded observation deck equipped with interferometric displays and quantum phase monitors.",
        material: "Steel / Plastic / Tinted Lead Glass",
        function: "Allows a human operator to monitor the acoustic horizon without their heartbeat causing systemic resonance.",
        assemblyOrder: 8,
        connections: ["Main Data Trunk Line"],
        failureEffect: "Operator experiences intense auditory hallucinations from trapped wave echoes.",
        cascadeFailures: ["Operator Insanity"],
        originalPosition: { x: 22, y: 10, z: 0 },
        explodedPosition: { x: 40, y: 10, z: 0 }
    });

    // 9. Laser Interferometer Calibration Grid
    const gridGroup = new THREE.Group();
    machineGroup.add(gridGroup);
    
    for (let i = -20; i <= 20; i += 5) {
        // X-aligned beams
        const beamX = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 40, 8), QuantumEnergyMaterial);
        beamX.rotation.z = Math.PI / 2;
        beamX.position.set(0, 0.2, i);
        gridGroup.add(beamX);
        
        // Z-aligned beams
        const beamZ = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 40, 8), QuantumEnergyMaterial);
        beamZ.rotation.x = Math.PI / 2;
        beamZ.position.set(i, 0.2, 0);
        gridGroup.add(beamZ);
    }
    
    parts.push({
        name: "Laser Interferometer Calibration Grid",
        description: "A matrix of coherent light measuring atomic-scale displacements of the isolation plinth.",
        material: "Photonic Construct",
        function: "Provides the error signal for the hydraulic dampeners.",
        assemblyOrder: 9,
        connections: ["Active Hydraulic Mounts"],
        failureEffect: "Feedback loop goes out of phase, violently shaking the structure.",
        cascadeFailures: ["Dampener Blowout"],
        originalPosition: { x: 0, y: 0.2, z: 0 },
        explodedPosition: { x: 0, y: -5, z: -30 }
    });

    // Add extra structural bracing to the base
    const bracingGeom = new THREE.CylinderGeometry(0.3, 0.3, 30, 8);
    const bracingMaterial = new THREE.MeshStandardMaterial({color: 0x555555, metalness: 0.8, roughness: 0.2});
    
    const br1 = new THREE.Mesh(bracingGeom, bracingMaterial);
    br1.rotation.x = Math.PI / 4;
    br1.position.set(15, 0, 15);
    machineGroup.add(br1);
    
    const br2 = new THREE.Mesh(bracingGeom, bracingMaterial);
    br2.rotation.x = -Math.PI / 4;
    br2.position.set(15, 0, -15);
    machineGroup.add(br2);
    
    const br3 = new THREE.Mesh(bracingGeom, bracingMaterial);
    br3.rotation.z = Math.PI / 4;
    br3.position.set(-15, 0, 15);
    machineGroup.add(br3);
    
    const br4 = new THREE.Mesh(bracingGeom, bracingMaterial);
    br4.rotation.z = -Math.PI / 4;
    br4.position.set(-15, 0, -15);
    machineGroup.add(br4);

    parts.push({
        name: "Titanium-Alloy Structural Bracing",
        description: "High-tensile struts preventing torsional shearing of the massive plinth under gravity wave stress.",
        material: "Titanium Alloy",
        function: "Distributes eccentric loads.",
        assemblyOrder: 10,
        connections: ["Isolation Plinth"],
        failureEffect: "Torsional collapse.",
        cascadeFailures: ["Plinth Fracture"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -10, z: -40 }
    });

    // 10. Thermal Radiator Fins (Exhausting the absorbed acoustic heat)
    const radiatorGroup = new THREE.Group();
    machineGroup.add(radiatorGroup);
    
    for (let i = 0; i < 36; i++) {
        const angle = (i / 36) * Math.PI * 2;
        const finGeom = new THREE.BoxGeometry(10, 8, 0.2);
        const fin = new THREE.Mesh(finGeom, aluminum);
        
        fin.position.x = Math.cos(angle) * 25;
        fin.position.y = -2;
        fin.position.z = Math.sin(angle) * 25;
        fin.rotation.y = -angle; // Pointing outward
        
        radiatorGroup.add(fin);
    }
    
    parts.push({
        name: "Acousto-Thermal Radiator Array",
        description: "36 massive aluminum fins acting as a heatsink to dissipate the energy of a million decibels converted to heat.",
        material: "Aircraft Grade Aluminum",
        function: "Rejects thermal energy to the surrounding environment.",
        assemblyOrder: 11,
        connections: ["Cryo-Extraction Torus", "Isolation Plinth"],
        failureEffect: "Rapid heating of the plinth, causing thermal expansion and acoustic cracking.",
        cascadeFailures: ["Fractal Core Meltdown"],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -30, z: 0 }
    });

    // 11. Magnetic Confinement Coils (preventing the singularity from expanding)
    const coilGroup = new THREE.Group();
    coilGroup.position.y = 15;
    machineGroup.add(coilGroup);
    
    const coilGeom = new THREE.TubeGeometry(new THREE.TorusKnotCurve3(6, 1.5, 100, 16), 200, 0.3, 8, true);
    const coilMesh = new THREE.Mesh(coilGeom, copper);
    coilGroup.add(coilMesh);
    
    parts.push({
        name: "Superconducting Toroidal Confinement Coil",
        description: "Generates a 50 Tesla magnetic field to stabilize the acoustic singularity and prevent it from consuming atmospheric matter.",
        material: "Niobium-Titanium Superconductor / Copper Matrix",
        function: "Contains the space-bending acoustic event horizon.",
        assemblyOrder: 12,
        connections: ["Acoustic Singularity Generator", "Cryogenic Torus"],
        failureEffect: "Singularity escapes containment, permanently silencing a 5-mile radius by consuming all air molecules.",
        cascadeFailures: ["Atmospheric Implosion"],
        originalPosition: { x: 0, y: 15, z: 0 },
        explodedPosition: { x: 0, y: 60, z: 0 }
    });
    
    // 12. Flux Capacitive Regulators
    for (let i = 0; i < 4; i++) {
        const reg = new THREE.Mesh(new THREE.BoxGeometry(2, 4, 2), steel);
        const angle = (i/4) * Math.PI * 2;
        reg.position.set(Math.cos(angle)*15, 15, Math.sin(angle)*15);
        machineGroup.add(reg);
    }
    
    parts.push({
        name: "Flux Capacitive Regulators",
        description: "Manages the massive power spikes required by the magnetic confinement coils.",
        material: "Steel / Graphene",
        function: "Power conditioning and surge protection.",
        assemblyOrder: 13,
        connections: ["Magnetic Confinement Coils"],
        failureEffect: "Coil quench.",
        cascadeFailures: ["Containment Failure"],
        originalPosition: { x: 0, y: 15, z: 0 },
        explodedPosition: { x: 30, y: 30, z: 30 }
    });
    
    // 13. Operator Access Walkway
    const walkwayCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(22, 10, 5),
        new THREE.Vector3(22, 10, 20),
        new THREE.Vector3(0, 0, 30) // ground ramp
    ]);
    const walkwayGeom = new THREE.TubeGeometry(walkwayCurve, 20, 1.5, 3, false);
    const walkway = new THREE.Mesh(walkwayGeom, darkSteel);
    machineGroup.add(walkway);
    
    parts.push({
        name: "Acoustically Dampened Walkway",
        description: "Access ramp covered in anechoic tiling.",
        material: "Dark Steel / Rubber",
        function: "Allows personnel to reach the cabin without footfalls creating seismic events.",
        assemblyOrder: 14,
        connections: ["Telemetry Cabin"],
        failureEffect: "Personnel footsteps register as magnitude 2.0 earthquakes on the sensors.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 40, y: -5, z: 40 }
    });

    // 14. Quantum Vacuum Fluctuation Harvester
    const harvester = new THREE.Mesh(new THREE.DodecahedronGeometry(2), chrome);
    harvester.position.set(0, 25, 0);
    machineGroup.add(harvester);
    
    parts.push({
        name: "Quantum Vacuum Fluctuation Harvester",
        description: "Extracts zero-point energy from the perfectly silent vacuum state achieved directly above the core.",
        material: "Chrome / Metamaterial",
        function: "Powers the entire facility using the energy of silence.",
        assemblyOrder: 15,
        connections: ["Acoustic Singularity Generator"],
        failureEffect: "Total power loss.",
        cascadeFailures: ["Magnetic Confinement Failure"],
        originalPosition: { x: 0, y: 25, z: 0 },
        explodedPosition: { x: 0, y: 80, z: 0 }
    });

    const description = "The Ultra God-Tier Anechoic Wedge is a world-ending acoustic absorption engine. Using infinite-depth fractal metamaterials, superfluid cryogenic cooling, and an artificial acoustic singularity, it bends spacetime itself to achieve absolute silence. It does not just absorb sound; it consumes the vibrational kinetic energy of atoms, plunging its core to absolute zero and trapping all incoming acoustic and thermal phonons forever.";

    const quizQuestions = [
        {
            question: "In the context of the Acoustic Singularity, if the local speed of sound approaches zero due to engineered metamaterial properties, what happens to an incoming phonon?",
            options: [
                "It accelerates exponentially.",
                "It reflects perfectly due to acoustic impedance mismatch.",
                "Its wavelength approaches zero, causing it to be permanently trapped at the boundary (an acoustic event horizon).",
                "It spontaneously converts into a photon via sonoluminescence."
            ],
            correctAnswer: 2,
            explanation: "As the speed of sound $c_s$ approaches zero, the wavelength $\\lambda = c_s / f$ approaches zero. The phonon takes an infinite amount of time to cross the horizon, effectively trapping it forever—analogous to a black hole's event horizon."
        },
        {
            question: "The superfluid Helium-4 cryo-torus extracts heat. At 1.2K, what macroscopic quantum phenomenon allows helium to conduct heat with effectively zero thermal resistance?",
            options: [
                "Bose-Einstein Condensation yielding a zero-viscosity superfluid state.",
                "Meissner Effect repelling thermal photons.",
                "Quantum tunneling of phonons across the torus boundary.",
                "Fermionic degeneracy pressure."
            ],
            correctAnswer: 0,
            explanation: "Below the lambda point (~2.17 K), Helium-4 becomes a superfluid (a type of Bose-Einstein Condensate) characterized by zero viscosity and infinite thermal conductivity, perfectly suited for rapid heat extraction."
        },
        {
            question: "Why must the isolation plinth utilize an active feedback magneto-rheological dampening system rather than purely passive springs?",
            options: [
                "Passive springs would freeze at cryogenic temperatures.",
                "Passive dampeners cannot isolate against zero-frequency (DC) offsets.",
                "To actively cancel ultra-low frequency micro-seismic noise (e.g., from ocean waves) that passive systems actually amplify at their resonant frequency.",
                "Magneto-rheological fluid acts as a secondary heat sink."
            ],
            correctAnswer: 2,
            explanation: "Passive mass-spring systems exhibit a resonant frequency where they amplify rather than attenuate noise. Active feedback using laser interferometry is required to apply counter-forces to cancel out these low-frequency micro-seismic vibrations."
        },
        {
            question: "The fractal wedge array uses Vantablack/carbon nanotubes. In terms of acoustic impedance $Z = \\rho c$, how does the fractal geometry prevent reflection?",
            options: [
                "By creating a perfectly sharp boundary that reflects all energy inwards.",
                "By gradually matching the impedance of the air to the impedance of the wedge material, minimizing the reflection coefficient $R = (Z_2 - Z_1)/(Z_2 + Z_1)$.",
                "By generating destructive interference via quarter-wavelength cancellation at all frequencies simultaneously.",
                "By ionizing the air to create a vacuum layer."
            ],
            correctAnswer: 1,
            explanation: "The tapered (fractal) shape ensures the effective density and stiffness of the medium changes gradually. This smooth impedance gradient from air ($Z_1$) to the dense material ($Z_2$) minimizes reflection and maximizes absorption deep within the wedge."
        },
        {
            question: "If the magnetic confinement of the acoustic singularity fails, the system risks a 'Hawking-Acoustic' blowout. What physical mechanism would cause this?",
            options: [
                "The sudden collapse of the event horizon releasing all trapped phonons instantly as a massive shockwave.",
                "The helium boiling instantly due to a loss of pressure.",
                "The carbon nanotubes combusting upon contact with oxygen.",
                "Quantum entanglement breaking, causing the machine to vanish."
            ],
            correctAnswer: 0,
            explanation: "In an acoustic analogue to a black hole, the collapse of the artificial metric (the confinement) would cause the infinitely compressed phonons trapped at the horizon to escape simultaneously, resulting in a devastating shockwave."
        }
    ];

    function animate(time, speed, meshes) {
        // 1. Animate the fractal wedges (breathing / adapting to frequencies)
        animatedWedges.forEach(w => {
            // Subtle height and scale shifting mimicking active adaptation
            const scaleY = 1 + 0.1 * Math.sin(time * speed * w.speed + w.phase);
            w.mesh.scale.set(1, scaleY, 1);
            // Slight rotation for visual complexity
            w.mesh.rotation.y = 0.05 * Math.sin(time * speed * 0.5 + w.phase);
        });

        // 2. Animate incoming sound waves (Phonons) being sucked into the core
        energyWaves.forEach(w => {
            // Spiral inwards towards the center (0,0,0)
            w.radius -= w.speed * speed;
            w.angle += w.speed * speed * 0.5;
            w.height -= w.speed * speed;
            
            if (w.radius < 0.5 || w.height < 0) {
                // Reset to outer dome (simulating continuous incoming noise)
                w.radius = 25 + Math.random() * 20;
                w.height = 10 + Math.random() * 20;
                w.angle = Math.random() * Math.PI * 2;
            }
            
            w.mesh.position.x = w.radius * Math.cos(w.angle);
            w.mesh.position.z = w.radius * Math.sin(w.angle);
            w.mesh.position.y = w.height;
            
            // Pulse emissive intensity
            w.mesh.material.emissiveIntensity = 3 + 2 * Math.sin(time * speed * 10 + w.angle);
        });

        // 3. Absolute Zero Frost Crystals pulsing
        frostParticles.forEach(f => {
            const s = f.baseScale * (1 + 0.3 * Math.sin(time * speed * f.pulseSpeed + f.phase));
            f.mesh.scale.set(s, s, s);
            f.mesh.rotation.x += 0.01 * speed;
            f.mesh.rotation.y += 0.02 * speed;
        });

        // 4. Hydraulic Pistons actively countering "noise"
        hydraulicPistons.forEach(h => {
            // Fast, jittery movement mimicking high-frequency active feedback
            const noise = Math.sin(time * 20 * speed + h.phase) * 0.2 + 
                          Math.cos(time * 35 * speed - h.phase) * 0.1;
            h.piston.position.y = h.baseY + noise;
        });

        // 5. Cryo Tubes flow animation
        cryoTubes.forEach(t => {
            t.rotation.z = time * speed * 0.5;
            t.material.opacity = 0.5 + 0.3 * Math.sin(time * speed * 2);
        });

        // 6. Quantum Cores / Singularity spinning
        quantumCores.forEach((c, idx) => {
            c.rotation.x += 0.05 * speed * (idx % 2 === 0 ? 1 : -1);
            c.rotation.y += 0.03 * speed;
            c.rotation.z += 0.01 * speed;
            
            // Pulse the material
            if (c.material.emissiveIntensity !== undefined) {
                c.material.emissiveIntensity = 2.5 + 1.5 * Math.sin(time * speed * 3 + idx);
            }
        });

        // 7. Space Bending Field expansion/contraction
        spaceBendingFields.forEach(f => {
            const s = 1 + 0.05 * Math.sin(time * speed * 4);
            f.scale.set(s, s, s);
        });
    }

    return {
        group: machineGroup,
        parts: parts,
        description: description,
        quizQuestions: quizQuestions,
        animate: animate
    };
}

// Auto-generated missing stub
export function createAnechoicWedge() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
