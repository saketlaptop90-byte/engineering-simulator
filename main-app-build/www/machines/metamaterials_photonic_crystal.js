import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Emissive / Glowing Materials
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00aaff,
        emissive: 0x00aaff,
        emissiveIntensity: 3.5,
        transparent: true,
        opacity: 0.9,
    });
    
    const neonPurple = new THREE.MeshStandardMaterial({
        color: 0xaa00ff,
        emissive: 0xaa00ff,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.6,
    });

    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff1144,
        emissive: 0xff1144,
        emissiveIntensity: 4.0,
    });

    const laserCoreMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 5.0,
    });

    // 1. Massive Base Platform - Highly detailed
    const baseShape = new THREE.Shape();
    // Complex polygonal footprint
    baseShape.moveTo(-30, -15);
    baseShape.lineTo(25, -15);
    baseShape.lineTo(35, 0);
    baseShape.lineTo(25, 15);
    baseShape.lineTo(-30, 15);
    baseShape.lineTo(-40, 0);
    baseShape.lineTo(-30, -15);
    
    // Add intricate mounting holes and cooling channels
    for (let i = -20; i <= 20; i += 10) {
        const hole = new THREE.Path();
        hole.absarc(i, 8, 2, 0, Math.PI * 2, false);
        baseShape.holes.push(hole);
        const hole2 = new THREE.Path();
        hole2.absarc(i, -8, 2, 0, Math.PI * 2, false);
        baseShape.holes.push(hole2);
    }

    const baseExtrudeSettings = { 
        depth: 3, 
        bevelEnabled: true, 
        bevelSegments: 5, 
        steps: 2, 
        bevelSize: 0.8, 
        bevelThickness: 1 
    };
    const baseGeo = new THREE.ExtrudeGeometry(baseShape, baseExtrudeSettings);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.rotation.x = Math.PI / 2;
    baseMesh.position.y = -8;
    group.add(baseMesh);

    parts.push({
        name: "base_platform",
        description: "Massive dark steel foundation plate engineered with internal cooling channels. Anchors the quantum system to prevent decoherence.",
        material: "darkSteel",
        function: "Provides extreme vibrational stability and thermal anchoring for the nanometer-scale photonic waveguide operations.",
        assemblyOrder: 1,
        connections: ["support_frame", "power_supply"],
        failureEffect: "Macroscopic vibration leading to severe signal decoherence and beam scattering.",
        cascadeFailures: ["waveguide_defect", "glowing_beam_core"],
        originalPosition: { x: 0, y: -8, z: 0 },
        explodedPosition: { x: 0, y: -25, z: 0 }
    });

    // 2. Support Frame Lattice
    const frameGroup = new THREE.Group();
    const trussRadius = 0.4;
    // Build a highly complex truss structure spanning the base
    for(let i = -25; i <= 20; i += 5) {
        // Vertical pillars
        const vGeo = new THREE.CylinderGeometry(trussRadius, trussRadius, 10, 16);
        const vMesh1 = new THREE.Mesh(vGeo, aluminum);
        vMesh1.position.set(i, -3, -10);
        const vMesh2 = new THREE.Mesh(vGeo, aluminum);
        vMesh2.position.set(i, -3, 10);
        frameGroup.add(vMesh1, vMesh2);

        // Diagonal Cross braces
        if (i < 20) {
            const crossGeo = new THREE.CylinderGeometry(trussRadius*0.7, trussRadius*0.7, 21, 16);
            const cross1 = new THREE.Mesh(crossGeo, steel);
            cross1.position.set(i + 2.5, -3, -10);
            cross1.rotation.z = Math.PI / 4;
            frameGroup.add(cross1);
            
            const cross2 = new THREE.Mesh(crossGeo, steel);
            cross2.position.set(i + 2.5, -3, 10);
            cross2.rotation.z = -Math.PI / 4;
            frameGroup.add(cross2);
        }
    }
    // Horizontal main rails
    const hGeo = new THREE.CylinderGeometry(trussRadius*1.5, trussRadius*1.5, 50, 32);
    const hMesh1 = new THREE.Mesh(hGeo, darkSteel);
    hMesh1.rotation.z = Math.PI / 2;
    hMesh1.position.set(-2.5, 2, -10);
    const hMesh2 = new THREE.Mesh(hGeo, darkSteel);
    hMesh2.rotation.z = Math.PI / 2;
    hMesh2.position.set(-2.5, 2, 10);
    frameGroup.add(hMesh1, hMesh2);
    group.add(frameGroup);

    parts.push({
        name: "support_frame",
        description: "Intricate aluminum and steel truss lattice.",
        material: "aluminum/steel",
        function: "Elevates and isolates the photonic crystal array from the massive base, dampening resonant frequencies.",
        assemblyOrder: 2,
        connections: ["base_platform", "alignment_pistons"],
        failureEffect: "Misalignment of crystal array relative to laser injector.",
        cascadeFailures: ["crystal_slab"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 15, z: 25 }
    });

    // 3. Alignment Pistons & Actuators
    const pistonGroup = new THREE.Group();
    const pistonPositions = [
        [-15, 8], [15, 8], [-15, -8], [15, -8], [0, 8], [0, -8]
    ];
    pistonPositions.forEach((pos, idx) => {
        // Outer hydraulic cylinder
        const outGeo = new THREE.CylinderGeometry(1.2, 1.2, 5, 32);
        const outMesh = new THREE.Mesh(outGeo, darkSteel);
        outMesh.position.set(pos[0], 0, pos[1]);
        
        // Inner chrome shaft
        const inGeo = new THREE.CylinderGeometry(0.7, 0.7, 6, 32);
        const inMesh = new THREE.Mesh(inGeo, chrome);
        inMesh.position.set(pos[0], 3, pos[1]);
        
        // Hydraulic lines winding around
        const linePath = new THREE.CatmullRomCurve3([
            new THREE.Vector3(pos[0], -2, pos[1] + 1.2),
            new THREE.Vector3(pos[0] + 1, -1, pos[1] + 2),
            new THREE.Vector3(pos[0] + 2, -4, pos[1] + 3),
            new THREE.Vector3(pos[0] + 4, -7, pos[1] + 2)
        ]);
        const lineGeo = new THREE.TubeGeometry(linePath, 16, 0.2, 8, false);
        const lineMesh = new THREE.Mesh(lineGeo, rubber);
        
        // Actuator casing flanges
        const flangeGeo = new THREE.TorusGeometry(1.4, 0.2, 16, 32);
        const flangeMesh = new THREE.Mesh(flangeGeo, copper);
        flangeMesh.position.set(pos[0], 2, pos[1]);
        flangeMesh.rotation.x = Math.PI / 2;

        pistonGroup.add(outMesh, inMesh, lineMesh, flangeMesh);
    });
    group.add(pistonGroup);

    parts.push({
        name: "alignment_pistons",
        description: "Six-axis high-precision hydraulic actuators with nanometer resolution.",
        material: "darkSteel/chrome",
        function: "Dynamically adjusts the pitch, roll, and yaw of the crystal slab in real-time to correct for thermal drift.",
        assemblyOrder: 3,
        connections: ["support_frame", "crystal_slab"],
        failureEffect: "Failure to mechanically correct for thermal expansion, misaligning the beam.",
        cascadeFailures: ["glowing_beam_core"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 25, z: -25 }
    });

    // 4. Photonic Crystal Slab (High-Index Glass Pillar Array)
    const crystalGroup = new THREE.Group();
    const pillarGeo = new THREE.CylinderGeometry(0.18, 0.18, 2.5, 16);
    
    // Hexagonal lattice parameters
    const latticeSpacing = 0.8;
    const rows = 40;
    const cols = 80;
    
    // Definition of the line defect (waveguide channel)
    // Starts straight, then takes a sharp 60-degree bend, then another straight, then another bend.
    const isDefect = (r, c) => {
        // First straight section
        if (c < 30 && r === 20) return true;
        // First bend (60 degrees)
        if (c >= 30 && c < 50) {
            const expectedRow = 20 + Math.floor((c - 30) / 2);
            if (r === expectedRow) return true;
        }
        // Second bend (back to straight)
        if (c >= 50) {
            const expectedRow = 20 + 10; // 30
            if (r === expectedRow) return true;
        }
        return false;
    };

    // Instantiate thousands of pillars. To maintain performance, we use InstancedMesh for the bulk lattice.
    // However, since we want a hyper-realistic scene, we will create actual meshes or rely on ThreeJS optimization.
    // For strict compatibility and "massive file" nature, we will populate them.
    const dummy = new THREE.Object3D();
    const instancedGeo = new THREE.CylinderGeometry(0.18, 0.18, 2.5, 16);
    const pillarCount = rows * cols;
    const pillarInstanced = new THREE.InstancedMesh(instancedGeo, glass, pillarCount);
    let pillarIdx = 0;

    for(let r = 0; r < rows; r++) {
        for(let c = 0; c < cols; c++) {
            if (isDefect(r, c)) continue; // Leave defect empty
            
            const x = (c - cols/2) * latticeSpacing;
            const z = (r - rows/2) * latticeSpacing * Math.sqrt(3) + (c % 2 === 0 ? latticeSpacing * Math.sqrt(3)/2 : 0);
            
            dummy.position.set(x, 7.25, z);
            dummy.updateMatrix();
            pillarInstanced.setMatrixAt(pillarIdx++, dummy.matrix);
        }
    }
    pillarInstanced.count = pillarIdx; // Set to actual count
    crystalGroup.add(pillarInstanced);

    // Thick fused silica bottom and top bounding plates
    const slabGeo = new THREE.BoxGeometry(cols * latticeSpacing + 4, 0.5, rows * latticeSpacing * Math.sqrt(3) + 4);
    const bottomSlab = new THREE.Mesh(slabGeo, glass);
    bottomSlab.position.set(0, 5.75, 0);
    const topSlab = new THREE.Mesh(slabGeo, glass);
    topSlab.position.set(0, 8.75, 0);
    crystalGroup.add(bottomSlab, topSlab);
    
    // Titanium edge banding around the crystal
    const bandGeo = new THREE.BoxGeometry(cols * latticeSpacing + 4.5, 3.5, rows * latticeSpacing * Math.sqrt(3) + 4.5);
    const bandMesh = new THREE.Mesh(bandGeo, chrome);
    bandMesh.position.set(0, 7.25, 0);
    crystalGroup.add(bottomSlab, topSlab); 
    
    group.add(crystalGroup);

    parts.push({
        name: "crystal_slab",
        description: "Massive periodic dielectric nanostructure consisting of thousands of high-index fused silica pillars arranged in a flawless hexagonal lattice.",
        material: "glass",
        function: "Creates an omnidirectional photonic bandgap, completely preventing light of the operating wavelength from propagating anywhere except through the defect.",
        assemblyOrder: 4,
        connections: ["alignment_pistons", "waveguide_defect"],
        failureEffect: "Loss of the photonic bandgap, causing the quantum state light to scatter uncontrollably into the bulk structure.",
        cascadeFailures: ["sensor_array", "glowing_beam_core"],
        originalPosition: { x: 0, y: 6, z: 0 },
        explodedPosition: { x: 0, y: 40, z: 0 }
    });

    parts.push({
        name: "waveguide_defect",
        description: "Highly engineered line defect etched into the crystal lattice, featuring multiple precise 60-degree bends.",
        material: "vacuum",
        function: "Acts as a lossless quantum channel to guide entangled photons around tight bends with absolutely zero scattering loss.",
        assemblyOrder: 5,
        connections: ["crystal_slab", "glowing_beam_core"],
        failureEffect: "Light cannot propagate through the intended geometrical path.",
        cascadeFailures: ["photonic_sensor_array"],
        originalPosition: { x: 0, y: 7.25, z: 0 },
        explodedPosition: { x: 0, y: 50, z: 0 }
    });

    // 6. Laser Injector Housing
    const injectorGroup = new THREE.Group();
    
    // Main cylindrical laser body
    const bodyGeo = new THREE.CylinderGeometry(2.5, 3.2, 12, 64);
    const bodyMesh = new THREE.Mesh(bodyGeo, darkSteel);
    bodyMesh.rotation.z = Math.PI / 2;
    // Align with the start of the defect.
    // Column 0, Row 20
    const startX = (0 - cols/2) * latticeSpacing;
    const startZ = (20 - rows/2) * latticeSpacing * Math.sqrt(3);
    
    bodyMesh.position.set(startX - 10, 7.25, startZ); 
    injectorGroup.add(bodyMesh);

    // Dense array of Copper Heat Sinks on injector
    for(let i=0; i<15; i++) {
        const ringGeo = new THREE.TorusGeometry(3.3, 0.3, 32, 64);
        const ringMesh = new THREE.Mesh(ringGeo, copper);
        ringMesh.rotation.y = Math.PI / 2;
        ringMesh.position.set(startX - 14 + i*0.8, 7.25, startZ);
        injectorGroup.add(ringMesh);
    }

    // High Voltage wiring to injector
    const hvPath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(startX - 15, 7.25, startZ),
        new THREE.Vector3(startX - 18, 5, startZ + 5),
        new THREE.Vector3(startX - 20, -5, startZ + 10)
    ]);
    const hvGeo = new THREE.TubeGeometry(hvPath, 64, 0.4, 16, false);
    const hvMesh = new THREE.Mesh(hvGeo, rubber);
    injectorGroup.add(hvMesh);

    group.add(injectorGroup);

    parts.push({
        name: "laser_injector_body",
        description: "Heavy dark steel housing enclosing the super-cooled quantum cascade laser diode.",
        material: "darkSteel/copper",
        function: "Generates the ultra-high-intensity, coherent photon stream required to penetrate the waveguide.",
        assemblyOrder: 6,
        connections: ["power_supply", "injector_optics"],
        failureEffect: "Laser fails to emit, or catastrophically melts due to heat sink failure.",
        cascadeFailures: ["glowing_beam_core", "photonic_sensor_array"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -30, y: 10, z: -20 }
    });

    // 7. Injector Optics & Beam Steering
    const opticsGroup = new THREE.Group();
    
    // A series of intricate lenses
    for(let i=0; i<4; i++) {
        const lensGeo = new THREE.SphereGeometry(1.5 - i*0.2, 32, 32, 0, Math.PI*2, 0, Math.PI/4);
        const lens = new THREE.Mesh(lensGeo, tinted);
        lens.rotation.z = -Math.PI / 2;
        lens.position.set(startX - 3.5 + i*0.8, 7.25, startZ);
        
        const mountGeo = new THREE.CylinderGeometry(1.6 - i*0.2, 1.6 - i*0.2, 0.4, 32);
        const mount = new THREE.Mesh(mountGeo, chrome);
        mount.rotation.z = Math.PI / 2;
        mount.position.set(startX - 3.7 + i*0.8, 7.25, startZ);
        
        opticsGroup.add(lens, mount);
    }
    group.add(opticsGroup);

    parts.push({
        name: "injector_optics",
        description: "Multi-stage tinted glass lenses set in micron-precision chrome mounts.",
        material: "tinted/chrome",
        function: "Focuses and collimates the divergent laser beam perfectly into the crystal's sub-micron defect aperture.",
        assemblyOrder: 7,
        connections: ["laser_injector_body", "glowing_beam_core"],
        failureEffect: "Beam defocuses, ablating the edge of the fused silica crystal slab.",
        cascadeFailures: ["crystal_slab"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -20, y: 15, z: -25 }
    });

    // 8. Glowing Beam Core & 9. Beam Halo
    // Calculate precise waveguide path
    const wPath = new THREE.CurvePath();
    
    const p1 = new THREE.Vector3(startX - 5, 7.25, startZ); // start deep in optics
    const p2 = new THREE.Vector3((30 - cols/2) * latticeSpacing, 7.25, startZ); // straight up to col 30
    const p3 = new THREE.Vector3((50 - cols/2) * latticeSpacing, 7.25, (30 - rows/2) * latticeSpacing * Math.sqrt(3)); // angle to col 50, row 30
    const p4 = new THREE.Vector3((cols - 1 - cols/2) * latticeSpacing + 5, 7.25, (30 - rows/2) * latticeSpacing * Math.sqrt(3)); // straight out to end
    
    const l1 = new THREE.LineCurve3(p1, p2);
    const l2 = new THREE.LineCurve3(p2, p3);
    const l3 = new THREE.LineCurve3(p3, p4);
    
    wPath.add(l1);
    wPath.add(l2);
    wPath.add(l3);

    const coreGeo = new THREE.TubeGeometry(wPath, 200, 0.04, 16, false);
    const coreMesh = new THREE.Mesh(coreGeo, laserCoreMat);
    group.add(coreMesh);

    const haloGeo = new THREE.TubeGeometry(wPath, 200, 0.2, 24, false);
    const haloMesh = new THREE.Mesh(haloGeo, neonBlue);
    group.add(haloMesh);

    const outerHaloGeo = new THREE.TubeGeometry(wPath, 200, 0.6, 32, false);
    const outerHaloMesh = new THREE.Mesh(outerHaloGeo, neonPurple);
    group.add(outerHaloMesh);

    // Particle Array for moving photons in the waveguide
    const photonCount = 80;
    const photonGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const photonMeshes = [];
    for(let i=0; i<photonCount; i++) {
        const pMesh = new THREE.Mesh(photonGeo, laserCoreMat);
        group.add(pMesh);
        photonMeshes.push({
            mesh: pMesh,
            progress: i / photonCount
        });
    }

    parts.push({
        name: "glowing_beam_core",
        description: "Intense, highly collimated beam of entangled quantum photons.",
        material: "laserCoreMat",
        function: "Transmits quantum information bidirectionally through the photonic crystal defect.",
        assemblyOrder: 8,
        connections: ["injector_optics", "photonic_sensor_array"],
        failureEffect: "Information loss, quantum state decoherence.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 55, z: 0 }
    });

    parts.push({
        name: "beam_halo",
        description: "Intense evanescent optical field extending beyond the core, glowing with Cherenkov-like radiation.",
        material: "neonBlue/neonPurple",
        function: "Facilitates near-field coupling with adjacent micro-ring resonators and stabilizes the primary beam.",
        assemblyOrder: 9,
        connections: ["glowing_beam_core"],
        failureEffect: "Reduced coupling efficiency across the lattice.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 60, z: 0 }
    });

    // 10. Photonic Sensor Array & Output Coupler
    const sensorGroup = new THREE.Group();
    const endX = p4.x;
    const endZ = p4.z;

    // Collimating exit optics
    const exitLensGeo = new THREE.SphereGeometry(1.2, 32, 32, 0, Math.PI*2, 0, Math.PI/3);
    const exitLens = new THREE.Mesh(exitLensGeo, tinted);
    exitLens.rotation.z = Math.PI / 2;
    exitLens.position.set(endX - 2.5, 7.25, endZ);
    sensorGroup.add(exitLens);
    
    // Array of single-photon avalanche diodes (SPAD)
    for(let i=0; i<4; i++) {
        for(let j=0; j<4; j++) {
            const dishGeo = new THREE.CylinderGeometry(0.2, 0.05, 0.5, 16);
            const dishMesh = new THREE.Mesh(dishGeo, chrome);
            dishMesh.rotation.z = Math.PI / 2;
            dishMesh.position.set(endX - 1, 7.25 + (j - 1.5)*0.5, endZ + (i - 1.5)*0.5);
            sensorGroup.add(dishMesh);
        }
    }
    
    // Massive sensor housing block
    const sensorHousingGeo = new THREE.BoxGeometry(4, 6, 6);
    const sensorHousing = new THREE.Mesh(sensorHousingGeo, darkSteel);
    sensorHousing.position.set(endX + 1, 7.25, endZ);
    sensorGroup.add(sensorHousing);
    
    group.add(sensorGroup);

    parts.push({
        name: "photonic_sensor_array",
        description: "Ultra-sensitive 4x4 array of Single-Photon Avalanche Diodes (SPADs).",
        material: "chrome/darkSteel",
        function: "Detects the output photons and translates quantum optical states into electrical pulses.",
        assemblyOrder: 10,
        connections: ["glowing_beam_core", "sensor_wiring"],
        failureEffect: "Zero data readout; complete loss of telemetry from the waveguide output.",
        cascadeFailures: ["processing_unit"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 30, y: 15, z: 30 }
    });

    // 11. Heavy Sensor Wiring Harness
    const wireGroup = new THREE.Group();
    for(let i=0; i<8; i++) {
        const wPathX = new THREE.CatmullRomCurve3([
            new THREE.Vector3(endX + 3, 7.25 + (i%2)*0.5, endZ - 2 + i*0.5),
            new THREE.Vector3(endX + 8, 4, endZ + i*0.8),
            new THREE.Vector3(endX + 10, -5, endZ + 5 + i*0.8),
            new THREE.Vector3(20, -5, 30 + i*0.4),
            new THREE.Vector3(15, 0, 35)
        ]);
        const wGeo = new THREE.TubeGeometry(wPathX, 64, 0.15, 12, false);
        const wMesh = new THREE.Mesh(wGeo, copper);
        wireGroup.add(wMesh);
    }
    group.add(wireGroup);

    parts.push({
        name: "sensor_wiring",
        description: "Thick gauge, cryogenically cooled copper-gold alloy wiring harness.",
        material: "copper",
        function: "Transmits ultra-fast electronic pulses from the SPAD sensor directly to the quantum processor without impedance loss.",
        assemblyOrder: 11,
        connections: ["photonic_sensor_array", "processing_unit"],
        failureEffect: "Severe signal attenuation and Johnson-Nyquist noise injection.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 25, y: -10, z: 35 }
    });

    // 12. Supercomputing Processing Unit
    const cpuGroup = new THREE.Group();
    const cpuBaseGeo = new THREE.BoxGeometry(10, 16, 8);
    const cpuBase = new THREE.Mesh(cpuBaseGeo, darkSteel);
    cpuBase.position.set(12, 0, 40);
    cpuGroup.add(cpuBase);

    // Quantum server blade racks glowing intensely
    const rackCount = 10;
    const blades = [];
    for(let i=0; i<rackCount; i++) {
        const rackGeo = new THREE.BoxGeometry(8, 0.4, 6);
        const rackMesh = new THREE.Mesh(rackGeo, neonBlue);
        rackMesh.position.set(12, -6 + i*1.4, 40.2);
        cpuGroup.add(rackMesh);
        blades.push(rackMesh);
    }

    // Processing cooling pipes
    const cpuCoolingGeo = new THREE.CylinderGeometry(0.5, 0.5, 16, 16);
    const cpuCool1 = new THREE.Mesh(cpuCoolingGeo, chrome);
    cpuCool1.position.set(6.5, 0, 40);
    const cpuCool2 = new THREE.Mesh(cpuCoolingGeo, chrome);
    cpuCool2.position.set(17.5, 0, 40);
    cpuGroup.add(cpuCool1, cpuCool2);

    group.add(cpuGroup);

    parts.push({
        name: "processing_unit",
        description: "Quantum-classical hybrid supercomputer mainframe with integrated blade servers.",
        material: "darkSteel/neon",
        function: "Decodes the complex photonic interference patterns and reconstructs the quantum state vectors into readable data.",
        assemblyOrder: 12,
        connections: ["sensor_wiring", "control_panel"],
        failureEffect: "Data corruption; raw photon counts cannot be interpreted by human operators.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 15, y: 5, z: 55 }
    });

    // 13. Cryogenic Cooling System
    const coolGroup = new THREE.Group();
    const radiatorGeo = new THREE.BoxGeometry(6, 14, 12);
    const radiatorMesh = new THREE.Mesh(radiatorGeo, aluminum);
    radiatorMesh.position.set(-35, 2, 20);
    coolGroup.add(radiatorMesh);

    // Radiator fins
    for(let i=0; i<25; i++) {
        const finGeo = new THREE.BoxGeometry(6.4, 0.1, 11.6);
        const finMesh = new THREE.Mesh(finGeo, steel);
        finMesh.position.set(-35, -4.5 + i*0.5, 20);
        coolGroup.add(finMesh);
    }

    // Massive pipes connecting radiator to injector
    const pipePath1 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-35, -2, 14),
        new THREE.Vector3(-35, -2, 0),
        new THREE.Vector3(-35, 2, startZ + 4),
        new THREE.Vector3(startX - 12, 5, startZ + 2)
    ]);
    const pipeGeo1 = new THREE.TubeGeometry(pipePath1, 64, 0.8, 16, false);
    const pipeMesh1 = new THREE.Mesh(pipeGeo1, rubber);
    coolGroup.add(pipeMesh1);
    
    group.add(coolGroup);

    parts.push({
        name: "cooling_system",
        description: "Industrial-grade liquid helium radiator and massive rubberized piping network.",
        material: "aluminum/rubber",
        function: "Maintains the laser injector and surrounding base at near absolute zero to prevent chaotic thermal noise.",
        assemblyOrder: 13,
        connections: ["laser_injector_body", "base_platform"],
        failureEffect: "System immediately overheats, initiating explosive emergency shutdown procedures.",
        cascadeFailures: ["laser_injector_body", "glowing_beam_core"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -50, y: 10, z: 30 }
    });

    // 14. Gigawatt Power Supply Capacitor Bank
    const powerGroup = new THREE.Group();
    const pBaseGeo = new THREE.BoxGeometry(24, 6, 12);
    const pBase = new THREE.Mesh(pBaseGeo, darkSteel);
    pBase.position.set(-20, -5, -25);
    powerGroup.add(pBase);

    // Array of huge cylindrical capacitors
    for(let i=0; i<5; i++) {
        for(let j=0; j<2; j++) {
            const capGeo = new THREE.CylinderGeometry(1.8, 1.8, 8, 32);
            const capMesh = new THREE.Mesh(capGeo, copper);
            capMesh.position.set(-28 + i*4, 2, -28 + j*6);
            
            const capTopGeo = new THREE.CylinderGeometry(0.8, 0.8, 1.5, 16);
            const capTop = new THREE.Mesh(capTopGeo, chrome);
            capTop.position.set(-28 + i*4, 6.5, -28 + j*6);
            
            // Neon status indicator rings
            const indGeo = new THREE.TorusGeometry(1.9, 0.1, 16, 32);
            const indMesh = new THREE.Mesh(indGeo, neonRed);
            indMesh.position.set(-28 + i*4, 5, -28 + j*6);
            indMesh.rotation.x = Math.PI/2;
            
            powerGroup.add(capMesh, capTop, indMesh);
        }
    }
    group.add(powerGroup);

    parts.push({
        name: "power_supply",
        description: "Massive ultra-capacitor bank array.",
        material: "copper/darkSteel",
        function: "Delivers gigawatt pulses to the quantum cascade laser with microscopic timing precision.",
        assemblyOrder: 14,
        connections: ["base_platform", "laser_injector_body"],
        failureEffect: "Inconsistent beam power, causing spontaneous mode-hopping in the laser.",
        cascadeFailures: ["laser_injector_body"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -30, y: -20, z: -40 }
    });

    // 15. Operator Control Panel & Diagnostics
    const controlGroup = new THREE.Group();
    const deskGeo = new THREE.BoxGeometry(16, 1.5, 6);
    const deskMesh = new THREE.Mesh(deskGeo, plastic);
    deskMesh.rotation.x = Math.PI/12;
    deskMesh.position.set(-5, 6, 45);
    controlGroup.add(deskMesh);

    // Holographic Screens
    const screens = [];
    for(let i=0; i<4; i++) {
        const screenGeo = new THREE.BoxGeometry(3.5, 2.5, 0.1);
        const screenMesh = new THREE.Mesh(screenGeo, neonBlue);
        screenMesh.position.set(-10 + i*4, 8.5, 43.5);
        screenMesh.rotation.x = -Math.PI/12;
        controlGroup.add(screenMesh);
        screens.push(screenMesh);
    }

    // Complex Joysticks, dials and buttons
    for(let i=0; i<3; i++) {
        const joyBaseGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 16);
        const joyBase = new THREE.Mesh(joyBaseGeo, darkSteel);
        joyBase.position.set(-8 + i*6, 6.7, 45);
        
        const joyStickGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 16);
        const joyStick = new THREE.Mesh(joyStickGeo, chrome);
        joyStick.position.set(-8 + i*6, 7.5, 44.8);
        joyStick.rotation.x = Math.PI/12;
        
        controlGroup.add(joyBase, joyStick);
    }
    group.add(controlGroup);

    parts.push({
        name: "control_panel",
        description: "Primary operator console featuring curved holographic displays and tactile alignment joysticks.",
        material: "plastic/neon",
        function: "Allows manual override, tuning of the laser cavity, and real-time monitoring of the waveguide telemetry.",
        assemblyOrder: 15,
        connections: ["processing_unit", "alignment_pistons"],
        failureEffect: "Complete loss of manual control; system reverts to unstable auto-pilot.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -10, y: 15, z: 65 }
    });

    // 16. Heavy Safety Enclosure (Clean Room Shielding)
    const glassGeo = new THREE.BoxGeometry(70, 35, 60);
    const glassMesh = new THREE.Mesh(glassGeo, tinted);
    glassMesh.position.set(-5, 8, 5);
    
    // Add intricate framing to the glass
    const frameEdgesGeo = new THREE.EdgesGeometry(glassGeo);
    const frameEdgesMat = new THREE.LineBasicMaterial({ color: 0x222222, linewidth: 3 });
    const frameEdges = new THREE.LineSegments(frameEdgesGeo, frameEdgesMat);
    frameEdges.position.copy(glassMesh.position);

    group.add(glassMesh, frameEdges);

    parts.push({
        name: "safety_enclosure",
        description: "Heavy-duty tinted poly-glass shielding enclosure with titanium framing.",
        material: "tinted",
        function: "Protects operators from stray high-intensity radiation while maintaining a Class 1 clean-room environment around the crystal.",
        assemblyOrder: 16,
        connections: ["base_platform"],
        failureEffect: "Contamination of the crystal lattice by dust, leading to massive scattering loss and explosive heating.",
        cascadeFailures: ["crystal_slab", "glowing_beam_core"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 70, z: 0 }
    });

    // Overview Description
    const description = "The Photonic Crystal Waveguide is an ultra high-tech, hyper-realistic metamaterial simulator. It features a massive array of thousands of fused silica pillars arranged in a flawless hexagonal lattice. A meticulously engineered line defect acts as a lossless waveguide, guiding a tightly collimated, glowing quantum beam around sharp 60-degree bends without scattering. The machine boasts six-axis hydraulic alignment, a gigawatt power capacitor bank, extreme liquid helium cooling, and a hybrid supercomputing node for quantum state processing.";

    // Interactive Quiz Questions
    const quizQuestions = [
        {
            question: "What physical phenomenon prevents the laser light from scattering out of the waveguide defect?",
            options: [
                "The omnidirectional photonic bandgap created by the periodic dielectric lattice.",
                "Intense magnetic fields confining the photons into a plasma.",
                "Total internal reflection identical to standard fiber optic cables.",
                "The tinted poly-glass safety enclosure absorbing the scatter."
            ],
            correctAnswer: 0,
            explanation: "In a photonic crystal, the highly periodic arrangement of materials creates a bandgap that absolutely forbids light of certain specific wavelengths from propagating through the bulk, effectively trapping it entirely inside the line defect."
        },
        {
            question: "What is the primary function of the six-axis hydraulic alignment pistons?",
            options: [
                "To dynamically adjust pitch, roll, and yaw of the crystal slab to correct for sub-micron thermal drift.",
                "To compress the silica crystal into a tighter waveguide shape for higher frequencies.",
                "To pump pressurized liquid helium directly into the primary radiator.",
                "To rotate the laser injector 360 degrees for multi-angle scanning."
            ],
            correctAnswer: 0,
            explanation: "The heavy-duty hydraulic pistons provide nanometer-resolution alignment, dynamically correcting for minute thermal expansion by adjusting the orientation of the massive crystal slab relative to the laser injector."
        },
        {
            question: "Why does the beam display a thick glowing halo outside of the central core?",
            options: [
                "It represents the evanescent optical field extending beyond the core, enabling near-field coupling.",
                "It is simply a graphical glitch in the optical simulation software.",
                "It indicates that the high-power laser is actively melting the adjacent glass pillars.",
                "It serves as a warning indicator that the liquid helium cooling system is failing."
            ],
            correctAnswer: 0,
            explanation: "The glowing halo visually represents the evanescent field that extends slightly into the forbidden zone of the crystal. This is a critical quantum optical effect used for near-field coupling to adjacent structures like ring resonators."
        },
        {
            question: "Which major subsystem is responsible for decoding the complex quantum interference patterns at the output?",
            options: [
                "The Quantum-Classical Hybrid Processing Unit.",
                "The Gigawatt Power Supply Capacitor Bank.",
                "The Multi-Stage Injector Optics.",
                "The Heavy Support Frame Lattice."
            ],
            correctAnswer: 0,
            explanation: "The quantum-classical hybrid processing unit uses massive parallel blade servers to decode the raw photon counts from the SPAD array and reconstruct them into usable telemetry."
        },
        {
            question: "What catastrophic event would likely occur if the tinted safety enclosure was breached during operation?",
            options: [
                "Microscopic dust contamination causing massive scattering loss and explosive localized heating.",
                "The quantum cascade laser would immediately run out of power and shut down.",
                "The hydraulic pistons would abruptly lose pressure, dropping the entire crystal slab.",
                "The supercomputer blade servers would spontaneously catch fire."
            ],
            correctAnswer: 0,
            explanation: "The safety enclosure maintains a Class 1 clean-room environment. Dust settling on a sub-micron scale lattice would instantly scatter the tightly collimated gigawatt laser beam, leading to immediate catastrophic heating and destruction of the waveguide."
        }
    ];

    // Extreme Animation Logic
    let timeElapsed = 0;

    function animate(time, speed, meshes) {
        timeElapsed += speed;

        // 1. Extreme pulsing of the glowing beam core and halos
        if (coreMesh.material) {
            // Rapid high-frequency flickering of the intense core
            coreMesh.material.emissiveIntensity = 4.5 + Math.sin(timeElapsed * 25) * 1.5;
            
            // Slow, powerful breathing of the inner halo
            haloMesh.material.emissiveIntensity = 2.0 + Math.sin(timeElapsed * 5) * 1.0;
            
            // Unstable erratic flickering of the outer halo
            outerHaloMesh.material.emissiveIntensity = 1.0 + Math.random() * 0.5;
        }

        // 2. Animate individual photon particles surging through the waveguide path
        photonMeshes.forEach(p => {
            p.progress += speed * 0.15; // Speed of photons
            if (p.progress > 1) p.progress -= 1;
            
            // Get position along the complex CurvePath
            const pt = wPath.getPointAt(p.progress);
            if (pt) {
                p.mesh.position.copy(pt);
                // Pulse photon size slightly
                const scale = 1.0 + Math.sin(p.progress * 100) * 0.3;
                p.mesh.scale.set(scale, scale, scale);
            }
        });

        // 3. Dynamic six-axis hydraulic stabilization (Pistons moving)
        pistonGroup.children.forEach((child, index) => {
            // Target the inner chrome cylinder meshes (index % 4 === 1 based on group structure)
            if (index % 4 === 1) {
                child.position.y = 3 + Math.sin(timeElapsed * 4 + index) * 0.15;
            }
        });
        
        // 4. Subtle, ultra-smooth crystal slab tilting (simulating the thermal compensation)
        crystalGroup.rotation.x = Math.sin(timeElapsed * 2) * 0.002;
        crystalGroup.rotation.z = Math.cos(timeElapsed * 2.5) * 0.002;
        
        // 5. Processing unit blade servers - Cascading data processing lights
        blades.forEach((blade, index) => {
            if (blade.material) {
                // Creates a cascading waterfall effect of processing loads
                const intensity = (Math.sin(timeElapsed * 10 - index * 0.8) + 1) / 2;
                blade.material.emissiveIntensity = 0.5 + intensity * 3.5;
                
                // Color shift based on load
                if (intensity > 0.9) {
                    blade.material.emissive.setHex(0xffffff); // Peak load flashes white
                } else {
                    blade.material.emissive.setHex(0x00aaff); // Standard neon blue
                }
            }
        });

        // 6. Holographic Control Panel Screens displaying real-time telemetry
        screens.forEach((screen, index) => {
            if (screen.material) {
                // Different refresh rates for different screens
                screen.material.emissiveIntensity = 1.0 + Math.sin(timeElapsed * (8 + index)) * 1.2;
                screen.material.opacity = 0.7 + Math.random() * 0.2;
            }
        });
        
        // 7. Analog operator joysticks tracking the autonomous correction
        const joystickGroupSize = 2; // joyBase + joyStick
        // The joysticks are added sequentially in controlGroup (after desk and 4 screens)
        // Indices: desk(0), screens(1,2,3,4), joyBase1(5), joyStick1(6)...
        for (let i = 0; i < 3; i++) {
            const joystickIndex = 5 + (i * joystickGroupSize) + 1;
            const joystick = controlGroup.children[joystickIndex];
            if (joystick) {
                // Jerky, precise machine-like movements
                joystick.rotation.x = Math.PI/12 + Math.sin(timeElapsed * 12 + i) * 0.05;
                joystick.rotation.z = Math.cos(timeElapsed * 15 + i*2) * 0.05;
            }
        }
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createPhotonicCrystalWaveguide() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
