import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // High tech emissive materials for simulation
    const magmaGlow = new THREE.MeshStandardMaterial({
        color: 0xff3300,
        emissive: 0xff2200,
        emissiveIntensity: 3,
        roughness: 0.2,
        metalness: 0.1,
        transparent: true,
        opacity: 0.95
    });

    const ledGlow = new THREE.MeshStandardMaterial({
        color: 0x00ffcc,
        emissive: 0x00ffcc,
        emissiveIntensity: 2,
        roughness: 0.2,
        metalness: 0.5
    });

    const waterMat = new THREE.MeshStandardMaterial({
        color: 0x006699,
        transparent: true,
        opacity: 0.6,
        roughness: 0.1,
        metalness: 0.8
    });

    // =========================================================================
    // 1. Main Simulator Chassis
    // =========================================================================
    const chassisPts = [
        new THREE.Vector2(-18, -12),
        new THREE.Vector2(18, -12),
        new THREE.Vector2(19, -13),
        new THREE.Vector2(19, -18),
        new THREE.Vector2(-19, -18),
        new THREE.Vector2(-19, -13)
    ];
    const chassisShape = new THREE.Shape(chassisPts);
    const chassisGeo = new THREE.ExtrudeGeometry(chassisShape, { depth: 12, bevelEnabled: true, bevelThickness: 0.5, bevelSize: 0.5, bevelSegments: 5 });
    const chassis = new THREE.Mesh(chassisGeo, darkSteel);
    chassis.position.z = -6;
    group.add(chassis);
    meshes.chassis = chassis;

    const chassisStruts = new THREE.Group();
    for(let i=0; i<8; i++) {
        const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 24, 16), steel);
        strut.rotation.x = Math.PI / 2;
        strut.position.set(-15 + i*4.2, -15, 0);
        chassisStruts.add(strut);
        
        const brace = new THREE.Mesh(new THREE.BoxGeometry(0.4, 24, 0.4), darkSteel);
        brace.rotation.z = Math.PI / 4;
        brace.position.set(-15 + i*4.2, -15, 0);
        chassisStruts.add(brace);
        
        const brace2 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 24, 0.4), darkSteel);
        brace2.rotation.z = -Math.PI / 4;
        brace2.position.set(-15 + i*4.2, -15, 0);
        chassisStruts.add(brace2);
    }
    group.add(chassisStruts);

    parts.push({
        name: 'Main_Simulator_Chassis',
        description: 'Heavy duty dark steel framework with cross-braced cylindrical struts, supporting the immense tectonic forces of the simulation.',
        material: 'darkSteel',
        function: 'Structural integrity and heavy-duty housing for all extreme-pressure geological sub-components.',
        assemblyOrder: 1,
        connections: ['Hydraulic_Drive_System', 'Continental_Lithosphere_Base'],
        failureEffect: 'Catastrophic structural collapse and decompression of the simulator.',
        cascadeFailures: ['All systems'],
        originalPosition: { x: 0, y: 0, z: -6 },
        explodedPosition: { x: 0, y: -20, z: -20 }
    });

    // =========================================================================
    // 2. Continental Lithosphere Base
    // =========================================================================
    const contGroup = new THREE.Group();
    const contPts = [
        new THREE.Vector2(0, 0),
        new THREE.Vector2(16, 0),
        new THREE.Vector2(16, 5),
        new THREE.Vector2(13, 6),
        new THREE.Vector2(11, 5.5),
        new THREE.Vector2(8, 7), // Volcano base
        new THREE.Vector2(7, 5.2),
        new THREE.Vector2(2, 5),
        new THREE.Vector2(0, 2) // Trench edge
    ];
    const contShape = new THREE.Shape(contPts);
    const contGeo = new THREE.ExtrudeGeometry(contShape, { depth: 10, bevelEnabled: true, bevelThickness: 0.2, bevelSize: 0.2, bevelSegments: 3 });
    const continentalBase = new THREE.Mesh(contGeo, steel);
    continentalBase.position.set(0, -5, -5);
    contGroup.add(continentalBase);
    
    // Topographical ridge detailing
    for (let i = 0; i < 25; i++) {
        const ridgeGeo = new THREE.BoxGeometry(0.5, Math.random()*2, 9.6);
        const ridge = new THREE.Mesh(ridgeGeo, aluminum);
        ridge.position.set(2 + (i/25)*13, 1 + Math.random(), 0);
        ridge.rotation.z = (Math.random() - 0.5) * 0.2;
        contGroup.add(ridge);
    }
    group.add(contGroup);

    parts.push({
        name: 'Continental_Lithosphere_Base',
        description: 'High-density steel and aluminum construct representing the buoyant, thick continental crust.',
        material: 'steel',
        function: 'Resists subduction, acts as the overriding plate forcing the oceanic plate deep into the mantle simulator.',
        assemblyOrder: 2,
        connections: ['Main_Simulator_Chassis', 'Stratovolcano_Cone_Structure', 'Subduction_Trench_Interface'],
        failureEffect: 'Unrealistic plate collision, causing crumpled simulation output.',
        cascadeFailures: ['Stratovolcano_Cone_Structure', 'Accretionary_Wedge_Mechanisms'],
        originalPosition: { x: 0, y: -5, z: -5 },
        explodedPosition: { x: 10, y: 5, z: -15 }
    });

    // =========================================================================
    // 3. Oceanic Lithosphere Plate
    // =========================================================================
    const oceanGroup = new THREE.Group();
    const oceanPts = [
        new THREE.Vector2(-18, 4),
        new THREE.Vector2(-2, 4),
        new THREE.Vector2(6, -4), // subducting angle
        new THREE.Vector2(11, -11),
        new THREE.Vector2(10, -12),
        new THREE.Vector2(5, -5.5),
        new THREE.Vector2(-3, 2),
        new THREE.Vector2(-18, 2)
    ];
    const oceanShape = new THREE.Shape(oceanPts);
    const oceanGeo = new THREE.ExtrudeGeometry(oceanShape, { depth: 9.6, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1, bevelSegments: 2 });
    const oceanicPlate = new THREE.Mesh(oceanGeo, copper);
    oceanicPlate.position.set(0, -4.8, -4.8);
    oceanGroup.add(oceanicPlate);

    // Stratigraphic layers (Lines)
    for (let i = 0; i < 6; i++) {
        const lineGeo = new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3([
                new THREE.Vector3(-17, 3.8 - i*0.3, 0),
                new THREE.Vector3(-2, 3.8 - i*0.3, 0),
                new THREE.Vector3(6, -4 - i*0.3, 0),
                new THREE.Vector3(10.5, -10.5 - i*0.3, 0)
            ]), 
            32, 0.05, 8, false
        );
        const lineMesh = new THREE.Mesh(lineGeo, darkSteel);
        lineMesh.position.set(0, -4.8, -4.8);
        oceanGroup.add(lineMesh);
        
        const lineMeshBack = lineMesh.clone();
        lineMeshBack.position.z += 9.6;
        oceanGroup.add(lineMeshBack);
    }
    group.add(oceanGroup);
    meshes.oceanGroup = oceanGroup;

    parts.push({
        name: 'Oceanic_Lithosphere_Plate',
        description: 'Dense, multi-layered copper and dark steel plate simulating the mafic composition and high density of aging oceanic crust.',
        material: 'copper',
        function: 'Subducts beneath the continental plate, carrying simulated volatiles (water) into the deep mantle to initiate melting.',
        assemblyOrder: 3,
        connections: ['Hydraulic_Drive_System', 'Subduction_Trench_Interface'],
        failureEffect: 'Plate jams at the trench interface, halting tectonic simulation entirely.',
        cascadeFailures: ['Hydraulic_Drive_System', 'Seismic_Foci_LED_Array'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -20, y: 5, z: 15 }
    });

    // =========================================================================
    // 4. Hydraulic Drive System
    // =========================================================================
    const hydraulicGroup = new THREE.Group();
    const cylGeo = new THREE.CylinderGeometry(0.6, 0.6, 10, 32);
    const pistonGeo = new THREE.CylinderGeometry(0.35, 0.35, 10, 32);
    
    meshes.pistons = [];
    for (let i = 0; i < 4; i++) {
        const cyl = new THREE.Mesh(cylGeo, darkSteel);
        cyl.rotation.z = Math.PI / 2;
        cyl.position.set(-12, -1, -3 + i*2);
        
        const piston = new THREE.Mesh(pistonGeo, chrome);
        piston.rotation.z = Math.PI / 2;
        piston.position.set(-7, -1, -3 + i*2);
        
        const ringGeo = new THREE.TorusGeometry(0.8, 0.15, 16, 32);
        const ring = new THREE.Mesh(ringGeo, chrome);
        ring.rotation.y = Math.PI / 2;
        ring.position.set(5, 0, 0);
        cyl.add(ring);
        
        hydraulicGroup.add(cyl);
        hydraulicGroup.add(piston);
        meshes.pistons.push(piston);
    }
    group.add(hydraulicGroup);

    parts.push({
        name: 'Hydraulic_Drive_System',
        description: 'Extreme-pressure chrome and dark steel hydraulic rams driving the oceanic plate, simulating slab pull and ridge push forces.',
        material: 'chrome',
        function: 'Provides the massive kinetic force required for continuous, scaled tectonic subduction.',
        assemblyOrder: 4,
        connections: ['Main_Simulator_Chassis', 'Oceanic_Lithosphere_Plate'],
        failureEffect: 'Loss of subduction drive, stalling the tectonic cycle simulation.',
        cascadeFailures: ['Magma_Generation_Chamber', 'Stratovolcano_Cone_Structure'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -25, y: -5, z: -5 }
    });

    // =========================================================================
    // 5. Asthenosphere Viscous Sim
    // =========================================================================
    const magmaGroup = new THREE.Group();
    const asthenospherePts = [
        new THREE.Vector2(5, -12),
        new THREE.Vector2(16, -12),
        new THREE.Vector2(16, 0),
        new THREE.Vector2(7, -3),
        new THREE.Vector2(4, -6)
    ];
    const asthShape = new THREE.Shape(asthenospherePts);
    const asthGeo = new THREE.ExtrudeGeometry(asthShape, { depth: 9.6, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1, bevelSegments: 2 });
    const asthGlass = new THREE.Mesh(asthGeo, glass);
    asthGlass.position.set(0, -4.8, -4.8);
    magmaGroup.add(asthGlass);

    parts.push({
        name: 'Asthenosphere_Viscous_Sim',
        description: 'Reinforced glass containment filled with highly viscous, glowing synthetic magma representing the ductile mantle wedge.',
        material: 'glass',
        function: 'Provides a medium for partial melting, hydration, and diapiric rise of simulated magma.',
        assemblyOrder: 5,
        connections: ['Main_Simulator_Chassis', 'Magma_Generation_Chamber'],
        failureEffect: 'Magma containment breach, flooding the lower mechanism bays.',
        cascadeFailures: ['Magma_Generation_Chamber', 'Volcanic_Conduit_Pipes'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 5, y: -25, z: 20 }
    });

    // =========================================================================
    // 6. Magma Generation Chamber
    // =========================================================================
    meshes.magmaBlobs = [];
    const blobGeo = new THREE.SphereGeometry(1.2, 32, 32);
    for (let i = 0; i < 10; i++) {
        const blob = new THREE.Mesh(blobGeo, magmaGlow);
        blob.position.set(7 + Math.random()*7, -10 + Math.random()*8, -3.5 + Math.random()*7);
        blob.scale.set(Math.random()*0.5 + 0.5, Math.random()*0.5 + 0.5, Math.random()*0.5 + 0.5);
        magmaGroup.add(blob);
        meshes.magmaBlobs.push({ mesh: blob, basePos: blob.position.clone(), phase: Math.random()*Math.PI*2 });
    }
    group.add(magmaGroup);

    parts.push({
        name: 'Magma_Generation_Chamber',
        description: 'Primary fusion nodes where simulated partial melting (flux melting) of the mantle wedge occurs.',
        material: 'plastic',
        function: 'Generates simulated magma due to volatile release from the subducting slab lowering the melting point.',
        assemblyOrder: 6,
        connections: ['Asthenosphere_Viscous_Sim', 'Volcanic_Conduit_Pipes'],
        failureEffect: 'No synthetic magma produced, disabling volcanic activity.',
        cascadeFailures: ['Stratovolcano_Cone_Structure'],
        originalPosition: { x: 8, y: -8, z: 0 },
        explodedPosition: { x: 15, y: -30, z: 10 }
    });

    // =========================================================================
    // 7. Volcanic Conduit Pipes
    // =========================================================================
    const pipeGroup = new THREE.Group();
    const pipePath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(8, -6, 0),
        new THREE.Vector3(8.8, -3, 0),
        new THREE.Vector3(8.2, 0, 0),
        new THREE.Vector3(7.8, 4, 0),
        new THREE.Vector3(8.0, 8.5, 0)
    ]);
    const pipeGeo = new THREE.TubeGeometry(pipePath, 64, 0.5, 16, false);
    const pipe = new THREE.Mesh(pipeGeo, tinted);
    pipeGroup.add(pipe);

    const flowGeo = new THREE.TubeGeometry(pipePath, 64, 0.3, 8, false);
    const flowMesh = new THREE.Mesh(flowGeo, magmaGlow);
    pipeGroup.add(flowMesh);
    meshes.magmaFlow = flowMesh;

    const branchPath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(8.2, 0, 0),
        new THREE.Vector3(10.0, 2.5, 0),
        new THREE.Vector3(11.0, 5.0, 0)
    ]);
    const branchGeo = new THREE.TubeGeometry(branchPath, 32, 0.25, 8, false);
    const branch = new THREE.Mesh(branchGeo, tinted);
    pipeGroup.add(branch);

    const branchFlow = new THREE.Mesh(new THREE.TubeGeometry(branchPath, 32, 0.15, 8, false), magmaGlow);
    pipeGroup.add(branchFlow);
    meshes.magmaBranchFlow = branchFlow;

    group.add(pipeGroup);

    parts.push({
        name: 'Volcanic_Conduit_Pipes',
        description: 'High-temperature tinted glass and chrome conduits channeling magma from the asthenosphere to the surface vents.',
        material: 'tinted',
        function: 'Transports pressurized magma through the continental crust to the stratovolcano.',
        assemblyOrder: 7,
        connections: ['Magma_Generation_Chamber', 'Stratovolcano_Cone_Structure'],
        failureEffect: 'Magma blockage causing explosive simulated subsurface rupture (dike swarm failure).',
        cascadeFailures: ['Stratovolcano_Cone_Structure', 'Continental_Lithosphere_Base'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 12, y: 15, z: -20 }
    });

    // =========================================================================
    // 8. Stratovolcano Cone Structure
    // =========================================================================
    const volcanoGroup = new THREE.Group();
    const volcPts = [];
    for (let i = 0; i <= 30; i++) {
        const t = i / 30;
        const radius = 6 * (1 - Math.pow(t, 0.6)) + 0.6; // exponential curve for classic stratovolcano
        const y = t * 7;
        volcPts.push(new THREE.Vector2(radius, y));
    }
    const volcGeo = new THREE.LatheGeometry(volcPts, 64);
    const volcano = new THREE.Mesh(volcGeo, steel);
    volcano.position.set(8.0, 1.5, 0);
    
    const craterGeo = new THREE.CylinderGeometry(0.7, 0.1, 1.2, 32);
    const crater = new THREE.Mesh(craterGeo, darkSteel);
    crater.position.set(8.0, 8.0, 0);
    
    volcanoGroup.add(volcano);
    volcanoGroup.add(crater);

    for(let i=0; i<12; i++) {
        const strutGeo = new THREE.BoxGeometry(0.15, 8, 0.15);
        const strut = new THREE.Mesh(strutGeo, chrome);
        strut.position.set(8.0, 4.5, 0);
        strut.rotation.z = Math.PI / 7;
        strut.rotation.y = (i / 12) * Math.PI * 2;
        strut.translateX(2.8);
        volcanoGroup.add(strut);
    }
    group.add(volcanoGroup);

    parts.push({
        name: 'Stratovolcano_Cone_Structure',
        description: 'Advanced steel and chrome conical construct representing a composite volcano formed by viscous lava and ash layers.',
        material: 'steel',
        function: 'Vents extreme pressure and erupts synthetic magma materials to the surface.',
        assemblyOrder: 8,
        connections: ['Continental_Lithosphere_Base', 'Volcanic_Conduit_Pipes', 'Eruption_Simulator_Nozzle'],
        failureEffect: 'Catastrophic flank collapse, leading to a simulated debris avalanche and pyroclastic surge.',
        cascadeFailures: ['Eruption_Simulator_Nozzle'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 15, y: 20, z: 15 }
    });

    // =========================================================================
    // 9. Eruption Simulator Nozzle
    // =========================================================================
    const eruptionGroup = new THREE.Group();
    const nozzleGeo = new THREE.CylinderGeometry(0.4, 0.6, 1.5, 16);
    const nozzle = new THREE.Mesh(nozzleGeo, chrome);
    nozzle.position.set(8.0, 8.5, 0);
    eruptionGroup.add(nozzle);

    meshes.particles = [];
    const particleGeo = new THREE.SphereGeometry(0.18, 8, 8);
    for (let i = 0; i < 80; i++) {
        const particle = new THREE.Mesh(particleGeo, magmaGlow.clone());
        particle.position.set(8.0, 9.0, 0);
        particle.visible = false;
        eruptionGroup.add(particle);
        meshes.particles.push({
            mesh: particle,
            velocity: new THREE.Vector3(),
            life: 0,
            active: false
        });
    }
    group.add(eruptionGroup);

    parts.push({
        name: 'Eruption_Simulator_Nozzle',
        description: 'High-speed chrome ejector module for simulating plinian ash plumes, pyroclastic flows, and lava fountaining.',
        material: 'chrome',
        function: 'Atomizes and disperses synthetic magma particles into the controlled atmosphere above the simulator.',
        assemblyOrder: 9,
        connections: ['Stratovolcano_Cone_Structure'],
        failureEffect: 'Nozzle choke, causing extreme pressure buildup resulting in a caldera-forming explosion.',
        cascadeFailures: ['Volcanic_Conduit_Pipes', 'Stratovolcano_Cone_Structure'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 8.0, y: 30, z: 0 }
    });

    // =========================================================================
    // 10. Wadati-Benioff Zone Sensors
    // =========================================================================
    const seismicGroup = new THREE.Group();
    meshes.seismicNodes = [];
    const nodeGeo = new THREE.OctahedronGeometry(0.25);
    for (let i = 0; i < 40; i++) {
        const node = new THREE.Mesh(nodeGeo, ledGlow);
        const t = Math.random();
        const x = 0 + t * 10;
        const y = -2.5 - t * 8;
        const z = -4.5 + Math.random() * 9.0;
        node.position.set(x, y, z);
        
        if (i > 0) {
            const prev = meshes.seismicNodes[i-1].mesh.position;
            const wirePath = new THREE.CatmullRomCurve3([prev, node.position]);
            const wireGeo = new THREE.TubeGeometry(wirePath, 4, 0.02, 4, false);
            const wire = new THREE.Mesh(wireGeo, copper);
            seismicGroup.add(wire);
        }
        
        seismicGroup.add(node);
        meshes.seismicNodes.push({ mesh: node, baseIntensity: Math.random() });
    }
    group.add(seismicGroup);

    parts.push({
        name: 'Wadati_Benioff_Zone_Sensors',
        description: 'A deeply embedded network of glowing octahedral sensors tracing the subducting slab to track megathrust seismic activity.',
        material: 'aluminum',
        function: 'Visualizes deep earthquake foci distribution and monitors the slab dip angle.',
        assemblyOrder: 10,
        connections: ['Oceanic_Lithosphere_Plate', 'Asthenosphere_Viscous_Sim'],
        failureEffect: 'Loss of critical seismic monitoring data telemetry for early warning systems.',
        cascadeFailures: ['Seismic_Foci_LED_Array'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 5, y: 10, z: 25 }
    });

    // =========================================================================
    // 11. Seismic Foci LED Array
    // =========================================================================
    parts.push({
        name: 'Seismic_Foci_LED_Array',
        description: 'Linked directly to the Wadati-Benioff sensors, these LEDs flash intensely during simulated stick-slip rupture events.',
        material: 'plastic',
        function: 'Provides immediate visual feedback for localized tectonic slip and stress release.',
        assemblyOrder: 11,
        connections: ['Wadati_Benioff_Zone_Sensors'],
        failureEffect: 'No visual indication of magnitude 9.0+ earthquake events.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -15, z: 30 }
    });

    // =========================================================================
    // 12. Oceanic Basin Fluid Container
    // =========================================================================
    const oceanBasinPts = [
        new THREE.Vector2(-18, 1.5),
        new THREE.Vector2(-0.5, 1.5), // edge of trench
        new THREE.Vector2(0, -0.5), // depth at trench
        new THREE.Vector2(-18, -0.8)
    ];
    const oceanBasinShape = new THREE.Shape(oceanBasinPts);
    const oceanBasinGeo = new THREE.ExtrudeGeometry(oceanBasinShape, { depth: 9.6, bevelEnabled: false });
    const oceanWater = new THREE.Mesh(oceanBasinGeo, waterMat);
    oceanWater.position.set(0, -4.8, -4.8);
    group.add(oceanWater);
    meshes.oceanWater = oceanWater;

    parts.push({
        name: 'Oceanic_Basin_Fluid_Container',
        description: 'Tinted glass and pressurized fluid chamber maintaining the oceanic hydrosphere above the abyssal plain.',
        material: 'glass',
        function: 'Simulates oceanic hydrostatic pressure, drives trench sedimentation, and provides water for mantle hydration.',
        assemblyOrder: 12,
        connections: ['Oceanic_Lithosphere_Plate', 'Subduction_Trench_Interface'],
        failureEffect: 'Massive simulated megathrust tsunami event and catastrophic fluid leak.',
        cascadeFailures: ['Subduction_Trench_Interface'],
        originalPosition: { x: 0, y: -4.8, z: -4.8 },
        explodedPosition: { x: -15, y: 20, z: -10 }
    });

    // =========================================================================
    // 13. Subduction Trench Interface
    // =========================================================================
    const trenchGeo = new THREE.BoxGeometry(2.5, 2.5, 10);
    const trenchMesh = new THREE.Mesh(trenchGeo, darkSteel);
    trenchMesh.position.set(-0.5, -3.5, 0);
    trenchMesh.rotation.z = Math.PI / 8;
    group.add(trenchMesh);

    parts.push({
        name: 'Subduction_Trench_Interface',
        description: 'High-friction dark steel mechanism at the convergent boundary marking the deepest part of the simulated ocean.',
        material: 'darkSteel',
        function: 'Forms the topographic depression of the trench and forcefully governs the subduction angle hinge.',
        assemblyOrder: 13,
        connections: ['Oceanic_Lithosphere_Plate', 'Continental_Lithosphere_Base'],
        failureEffect: 'Plate collision angle skewed, structurally breaking the simulator hinges.',
        cascadeFailures: ['Oceanic_Lithosphere_Plate', 'Continental_Lithosphere_Base'],
        originalPosition: { x: 0, y: -3.5, z: 0 },
        explodedPosition: { x: -5, y: 10, z: -25 }
    });

    // =========================================================================
    // 14. Accretionary Wedge Mechanisms
    // =========================================================================
    const wedgeGeo = new THREE.ConeGeometry(2, 4, 5);
    const wedgeMesh = new THREE.Mesh(wedgeGeo, copper);
    wedgeMesh.position.set(1.5, -2.5, 0);
    wedgeMesh.rotation.x = Math.PI / 2;
    wedgeMesh.rotation.z = -Math.PI / 5;
    
    // Wedge details
    for (let i=0; i<4; i++) {
        const slice = new THREE.Mesh(new THREE.BoxGeometry(0.1, 4.2, 5), plastic);
        slice.position.set(1 + i*0.2, -2.5 + i*0.2, 0);
        slice.rotation.z = -Math.PI / 5;
        group.add(slice);
    }
    group.add(wedgeMesh);

    parts.push({
        name: 'Accretionary_Wedge_Mechanisms',
        description: 'Highly folded copper and plastic modules simulating the off-scraping of marine sediments from the subducting plate.',
        material: 'copper',
        function: 'Accumulates deformed, imbricate thrust slices of sediment at the leading edge of the overriding continental plate.',
        assemblyOrder: 14,
        connections: ['Subduction_Trench_Interface', 'Continental_Lithosphere_Base'],
        failureEffect: 'Subduction erosion occurs instead of accretion, unnaturally migrating the trench landward.',
        cascadeFailures: [],
        originalPosition: { x: 1.5, y: -2.5, z: 0 },
        explodedPosition: { x: 4, y: 12, z: 8 }
    });

    // =========================================================================
    // 15. Magma Diapir Pumps
    // =========================================================================
    const pumpGroup = new THREE.Group();
    meshes.pumps = [];
    for(let i=0; i<4; i++) {
        const pumpGeo = new THREE.CylinderGeometry(0.4, 0.4, 2.5, 16);
        const pump = new THREE.Mesh(pumpGeo, steel);
        pump.position.set(8 + i*0.8 - 1.2, -6 + i*0.6, -3 + i*2);
        
        const innerPump = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2.8, 16), chrome);
        pump.add(innerPump);
        meshes.pumps.push({ mesh: innerPump, speedOffset: i });
        
        // Add pump housings
        const housing = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), darkSteel);
        pump.add(housing);

        pumpGroup.add(pump);
    }
    group.add(pumpGroup);

    parts.push({
        name: 'Magma_Diapir_Pumps',
        description: 'Steel and chrome pumping mechanisms physically forcing synthetic magma upward through the viscous asthenosphere medium.',
        material: 'steel',
        function: 'Simulates the buoyant, density-driven rise of hot magma blobs (diapirs) through the mantle.',
        assemblyOrder: 15,
        connections: ['Asthenosphere_Viscous_Sim', 'Magma_Generation_Chamber'],
        failureEffect: 'Magma pools at depth, cooling prematurely into large plutons instead of erupting.',
        cascadeFailures: ['Volcanic_Conduit_Pipes'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 18, y: -10, z: 20 }
    });

    // =========================================================================
    // 16. Subduction Angle Adjuster
    // =========================================================================
    const adjusterGeo = new THREE.TorusGeometry(1.2, 0.3, 16, 32);
    const adjuster = new THREE.Mesh(adjusterGeo, rubber);
    adjuster.position.set(3, -7, 5.5);
    adjuster.rotation.x = Math.PI / 2;
    
    // Spoke details
    for (let i=0; i<4; i++) {
        const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2.4), chrome);
        spoke.rotation.z = i * Math.PI/4;
        adjuster.add(spoke);
    }
    group.add(adjuster);
    meshes.adjuster = adjuster;

    parts.push({
        name: 'Subduction_Angle_Adjuster',
        description: 'Heavy rubber and chrome toroid linkage controlling the dip angle of the descending oceanic slab.',
        material: 'rubber',
        function: 'Calibrates whether the subduction is steep (e.g., Mariana type) or shallow/flat (e.g., Chilean type).',
        assemblyOrder: 16,
        connections: ['Subduction_Trench_Interface', 'Oceanic_Lithosphere_Plate'],
        failureEffect: 'Slab tear or locking, destroying the lower asthenosphere mechanisms.',
        cascadeFailures: ['Hydraulic_Drive_System'],
        originalPosition: { x: 3, y: -7, z: 5.5 },
        explodedPosition: { x: 3, y: -15, z: 18 }
    });

    // =========================================================================
    // 17. Cooling Fin Arrays
    // =========================================================================
    const finGroup = new THREE.Group();
    meshes.coolingFans = [];
    for (let i = 0; i < 6; i++) {
        const finMount = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.5, 1.2), darkSteel);
        finMount.position.set(9, -3, -9 + i*3.6);
        finGroup.add(finMount);
        
        const fanGeo = new THREE.CylinderGeometry(1, 1, 1.4, 16);
        const fan = new THREE.Mesh(fanGeo, chrome);
        fan.rotation.x = Math.PI / 2;
        fan.position.copy(finMount.position);
        fan.position.x += 0.3;
        
        // Add fan blades
        for(let j=0; j<5; j++) {
            const blade = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.8, 0.4), aluminum);
            blade.rotation.y = j * Math.PI*2/5;
            fan.add(blade);
        }

        finGroup.add(fan);
        meshes.coolingFans.push(fan);
    }
    group.add(finGroup);
    
    parts.push({
        name: 'Cooling_Fin_Arrays',
        description: 'Massive active cooling fan blocks designed to extract the immense heat generated by the simulated magma generation chamber.',
        material: 'aluminum',
        function: 'Prevents total thermal meltdown of the asthenosphere glass containment.',
        assemblyOrder: 17,
        connections: ['Asthenosphere_Viscous_Sim', 'Main_Simulator_Chassis'],
        failureEffect: 'Thermal runaway leading to glass containment shatter and fluid leak.',
        cascadeFailures: ['Asthenosphere_Viscous_Sim'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 12, y: -5, z: -30 }
    });

    // =========================================================================
    // 18. Tectonic Gear Transmission
    // =========================================================================
    meshes.gears = [];
    for(let i=0; i<5; i++) {
        const gearShape = new THREE.Shape();
        const teeth = 18;
        const outerRad = 1.4;
        const innerRad = 1.1;
        for(let j=0; j<teeth*2; j++) {
            const angle = j * Math.PI / teeth;
            const rad = (j%2 === 0) ? outerRad : innerRad;
            if (j===0) gearShape.moveTo(Math.cos(angle)*rad, Math.sin(angle)*rad);
            else gearShape.lineTo(Math.cos(angle)*rad, Math.sin(angle)*rad);
        }
        const gearExGeo = new THREE.ExtrudeGeometry(gearShape, { depth: 0.3, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05 });
        const gear = new THREE.Mesh(gearExGeo, steel);
        gear.position.set(-14, -6 + i*1.4, 6);
        gear.rotation.x = Math.PI/2;
        if (i%2 !== 0) gear.rotation.z = Math.PI / teeth; // mesh teeth
        group.add(gear);
        meshes.gears.push({ mesh: gear, speed: (i%2===0 ? 1 : -1) });
    }

    parts.push({
        name: 'Tectonic_Gear_Transmission',
        description: 'A heavy-duty transmission gear train linking the hydraulic drives to the subducting plate tracks.',
        material: 'steel',
        function: 'Steps down the hydraulic speed to match the incredibly slow, grinding pace of real tectonic plates.',
        assemblyOrder: 18,
        connections: ['Hydraulic_Drive_System', 'Oceanic_Lithosphere_Plate'],
        failureEffect: 'Gear stripping, causing the oceanic plate to violently snap forward (mega-quake) or halt.',
        cascadeFailures: ['Oceanic_Lithosphere_Plate'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -30, y: -10, z: 15 }
    });


    const description = "A massive, ultra high-tech mechanical simulator of a tectonic subduction zone. It features extreme-pressure hydraulic rams forcing a simulated oceanic lithosphere beneath a thick continental crust. It includes advanced viscous magma generation chambers, diapir pumps, functional stratovolcano particle ejectors, and a Wadati-Benioff zone LED seismic tracking grid. Designed to withstand and visualize immense geological forces in real-time.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Wadati-Benioff Zone Sensors?",
            options: [
                "To monitor atmospheric ash dispersion",
                "To visually trace deep seismic earthquake foci along the subducting slab",
                "To pump magma into the conduit",
                "To drive the hydraulic rams"
            ],
            answer: "To visually trace deep seismic earthquake foci along the subducting slab",
            explanation: "The Wadati-Benioff zone is a deep active seismic area in a subduction zone. The sensors trace this interface to visualize earthquake depths and the angle of the descending slab."
        },
        {
            question: "Which component simulates the buoyant, density-driven rise of magma through the mantle?",
            options: [
                "Magma_Diapir_Pumps",
                "Accretionary_Wedge_Mechanisms",
                "Subduction_Angle_Adjuster",
                "Hydraulic_Drive_System"
            ],
            answer: "Magma_Diapir_Pumps",
            explanation: "Magma diapirs are buoyant, hot blobs of magma rising through the cooler mantle, simulated here mechanically by the deep asthenosphere pumps."
        },
        {
            question: "What catastrophic failure occurs if the Subduction_Angle_Adjuster breaks?",
            options: [
                "Magma pools at depth",
                "Tsunami event occurs",
                "Slab tear or locking, destroying lower mechanisms",
                "Flank collapse of the volcano"
            ],
            answer: "Slab tear or locking, destroying lower mechanisms",
            explanation: "Without precise angle calibration, the massive kinetic forces would cause the slab to tear or lock against the overriding plate, resulting in a catastrophic jam of the drive mechanisms."
        },
        {
            question: "The Magma_Generation_Chamber relies on input from which simulated geological process?",
            options: [
                "Volatile release (water) from the subducting slab lowering the melting point",
                "Friction from the Accretionary Wedge",
                "Solar radiation heating the oceanic crust",
                "Meteorite impacts"
            ],
            answer: "Volatile release (water) from the subducting slab lowering the melting point",
            explanation: "In real subduction zones, water brought down by the oceanic plate lowers the melting temperature of the mantle wedge (flux melting), generating the magma that feeds stratovolcanoes."
        },
        {
            question: "What is the purpose of the Accretionary_Wedge_Mechanisms?",
            options: [
                "To cool the magma chamber",
                "To simulate the off-scraping of marine sediments from the subducting plate",
                "To increase the speed of subduction",
                "To generate earthquakes"
            ],
            answer: "To simulate the off-scraping of marine sediments from the subducting plate",
            explanation: "As the oceanic plate subducts, sediments on top of it are often scraped off against the overriding continental plate, forming a folded accretionary wedge at the trench."
        }
    ];

    // =========================================================================
    // Animation Loop
    // =========================================================================
    function animate(time, speed, activeMeshes) {
        const t = time * speed;
        
        // 1. Oceanic Plate Subduction (Stick-Slip oscillation)
        const slip = Math.sin(t * 0.4) * 0.5 + 0.5; // 0 to 1 smooth
        activeMeshes.oceanGroup.position.x = slip * 1.8;
        activeMeshes.oceanGroup.position.y = slip * -1.8;
        
        // 2. Hydraulic Pistons pushing synchronously
        activeMeshes.pistons.forEach((piston) => {
            piston.position.x = -7 + slip * 1.8;
        });

        // 3. Tectonic Gears transmission
        activeMeshes.gears.forEach(gearData => {
            gearData.mesh.rotation.z += gearData.speed * 0.02 * speed;
        });

        // 4. Magma blobs pulsing and rising in Asthenosphere
        activeMeshes.magmaBlobs.forEach(blobData => {
            blobData.phase += 0.04 * speed;
            const scale = 0.8 + Math.sin(blobData.phase) * 0.3;
            blobData.mesh.scale.set(scale, scale, scale);
            blobData.mesh.position.y = blobData.basePos.y + Math.sin(t * 1.5 + blobData.phase) * 0.6;
            // Magma color intensity pulse
            if (blobData.mesh.material.emissiveIntensity !== undefined) {
                blobData.mesh.material.emissiveIntensity = 1 + Math.sin(blobData.phase) * 2;
            }
        });

        // 5. Magma Flow in Conduit Pipes
        if (activeMeshes.magmaFlow.material.emissiveIntensity !== undefined) {
            activeMeshes.magmaFlow.material.emissiveIntensity = 2 + Math.sin(t * 5) * 1.5;
            activeMeshes.magmaBranchFlow.material.emissiveIntensity = 2 + Math.cos(t * 4) * 1.5;
        }

        // 6. Magma Diapir Pumps actuating
        activeMeshes.pumps.forEach((pumpData) => {
            pumpData.mesh.position.y = Math.sin(t * 6 + pumpData.speedOffset) * 0.9;
        });

        // 7. Volcanic Eruption Particles (Plinian Plume)
        activeMeshes.particles.forEach((p) => {
            if (!p.active) {
                // Erupt in massive pulses corresponding to magma flow peaks
                if (Math.random() > 0.92 && Math.sin(t * 5) > 0.5) { 
                    p.active = true;
                    p.life = 1.0;
                    p.mesh.visible = true;
                    p.mesh.position.set(8.0 + (Math.random()-0.5)*0.3, 9.0, (Math.random()-0.5)*0.3);
                    p.velocity.set((Math.random()-0.5)*0.15, 0.3 + Math.random()*0.3, (Math.random()-0.5)*0.15);
                    p.mesh.scale.set(1,1,1);
                    p.mesh.material = magmaGlow.clone(); // individual material for fading
                }
            } else {
                p.life -= 0.015 * speed;
                if (p.life <= 0) {
                    p.active = false;
                    p.mesh.visible = false;
                } else {
                    p.mesh.position.addScaledVector(p.velocity, speed);
                    p.velocity.y -= 0.003 * speed; // Gravity settling
                    p.velocity.x += (Math.random()-0.5) * 0.02; // wind dispersion
                    
                    const scale = p.life * 1.5;
                    p.mesh.scale.set(scale, scale, scale);
                    
                    // Fade from bright orange magma to dark grey ash
                    if (p.life < 0.6) {
                        p.mesh.material.color.setHex(0x444444);
                        p.mesh.material.emissive.setHex(0x000000);
                        p.mesh.material.transparent = true;
                        p.mesh.material.opacity = p.life;
                    }
                }
            }
        });

        // 8. Seismic LED Foci flashing (Megathrust Quakes)
        const slipRate = Math.cos(t * 0.4); // derivative of slip represents velocity
        const isQuake = (slipRate > 0.85); // High velocity phase of stick-slip
        activeMeshes.seismicNodes.forEach(nodeData => {
            if (isQuake && Math.random() > 0.6) {
                nodeData.mesh.material.emissiveIntensity = 6;
                nodeData.mesh.scale.set(1.8, 1.8, 1.8);
            } else {
                nodeData.mesh.material.emissiveIntensity = nodeData.baseIntensity + Math.sin(t*4 + nodeData.baseIntensity*15)*0.5;
                nodeData.mesh.scale.set(1, 1, 1);
            }
        });

        // 9. Subduction Angle Adjuster spinning
        activeMeshes.adjuster.rotation.z += 0.015 * speed;

        // 10. Cooling Fans spinning rapidly
        activeMeshes.coolingFans.forEach(fan => {
            fan.rotation.y += 0.3 * speed;
        });
        
        // 11. Subtle fluid oscillation in Oceanic Basin
        activeMeshes.oceanWater.position.y = -4.8 + Math.sin(t * 2) * 0.05;
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
export function createSubductionZone() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
