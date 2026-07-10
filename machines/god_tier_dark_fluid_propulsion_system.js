import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // --- CUSTOM MATERIALS FOR EXTREME TECH ---
    const darkFluidMatterMat = new THREE.MeshStandardMaterial({
        color: 0x020202,
        emissive: 0x000000,
        roughness: 0.1,
        metalness: 1.0,
        envMapIntensity: 2.0,
        transparent: true,
        opacity: 0.95
    });

    const darkEnergyEmissiveMat = new THREE.MeshStandardMaterial({
        color: 0x220044,
        emissive: 0x7700ff,
        emissiveIntensity: 2.0,
        roughness: 0.2,
        metalness: 0.8,
        transparent: true,
        opacity: 0.8
    });

    const gravityDistortionMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 1.0,
        opacity: 1,
        metalness: 0,
        roughness: 0,
        ior: 2.5,
        thickness: 5.0,
        specularIntensity: 2.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const neonCircuitMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 5.0,
        wireframe: false
    });

    const warningLightMat = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.0
    });

    // --- PROCEDURAL GEOMETRY GENERATORS ---

    // 1. Core Singularity Housing (Massive Lathe)
    const housingPoints = [];
    for (let i = 0; i <= 100; i++) {
        const t = i / 100;
        const radius = 15 + Math.sin(t * Math.PI * 4) * 2 + Math.cos(t * Math.PI * 12) * 0.5 - (t * 5);
        const y = (t - 0.5) * 40;
        housingPoints.push(new THREE.Vector2(radius, y));
    }
    const housingGeo = new THREE.LatheGeometry(housingPoints, 128);
    const housing = new THREE.Mesh(housingGeo, darkSteel);
    housing.rotation.x = Math.PI / 2;
    group.add(housing);

    parts.push({
        name: "Singularity Containment Vessel",
        description: "A hyper-dense, dark-steel forged containment lathe designed to hold the non-Newtonian dark fluid at extreme pressures. Its rippled surface acts as a macroscopic gravimetric wave dampener, preventing local space-time from shearing off.",
        material: "darkSteel",
        function: "Maintains the structural integrity of the local metric while the dark fluid oscillates between matter and energy states.",
        assemblyOrder: 1,
        connections: ["Dark Energy Catalyzer", "Magnetic Confinement Coils", "Fluid Injectors"],
        failureEffect: "Instantaneous micro-singularity formation, spaghettifying the entire craft and adjacent star systems.",
        cascadeFailures: ["Complete Metric Collapse", "Vacuum Decay"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 50, z: 0 }
    });

    // 2. Magnetic Confinement Coils (Complex Torus Knot Arrays)
    const coilGroup = new THREE.Group();
    const coilGeo = new THREE.TorusKnotGeometry(16, 1.5, 300, 32, 7, 3);
    const coil1 = new THREE.Mesh(coilGeo, copper);
    const coil2 = new THREE.Mesh(coilGeo, copper);
    coil2.rotation.x = Math.PI / 2;
    coil2.scale.set(1.05, 1.05, 1.05);
    const coil3 = new THREE.Mesh(coilGeo, copper);
    coil3.rotation.y = Math.PI / 2;
    coil3.scale.set(1.1, 1.1, 1.1);
    
    coilGroup.add(coil1);
    coilGroup.add(coil2);
    coilGroup.add(coil3);
    group.add(coilGroup);

    parts.push({
        name: "Tri-Axial Magnetic Confinement Knots",
        description: "Superconducting copper Torus Knots woven in 7-3 topological geometries. These generate a tightly bound magnetic bottle that prevents the dark fluid from leaking into 4-dimensional bulk space.",
        material: "copper",
        function: "Puts an electromagnetic chokehold on the fluid's quantum fluctuations.",
        assemblyOrder: 2,
        connections: ["Singularity Containment Vessel", "Quantum Vacuum Regulators"],
        failureEffect: "Fluid leaks out, instantly transmuting surrounding baryonic matter into dark matter.",
        cascadeFailures: ["Massive Gravitational Anomalies", "Total Loss of Ship Mass"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 50, y: 0, z: -50 }
    });

    // 3. Exotic Thrust Nozzle (Shape Extrusion + Gravitational Lensing)
    const nozzleShape = new THREE.Shape();
    const nozzleTeeth = 36;
    for (let i = 0; i < nozzleTeeth * 2; i++) {
        const angle = (i / (nozzleTeeth * 2)) * Math.PI * 2;
        const rad = i % 2 === 0 ? 22 : 18;
        if (i === 0) nozzleShape.moveTo(Math.cos(angle) * rad, Math.sin(angle) * rad);
        else nozzleShape.lineTo(Math.cos(angle) * rad, Math.sin(angle) * rad);
    }
    nozzleShape.closePath();
    
    const extrudeSettings = {
        depth: 30,
        bevelEnabled: true,
        bevelSegments: 10,
        steps: 10,
        bevelSize: 2,
        bevelThickness: 5
    };
    const nozzleGeo = new THREE.ExtrudeGeometry(nozzleShape, extrudeSettings);
    const nozzle = new THREE.Mesh(nozzleGeo, steel);
    nozzle.position.z = 20;
    group.add(nozzle);

    // Inner gravity lens
    const lensGeo = new THREE.SphereGeometry(15, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2);
    const lens = new THREE.Mesh(lensGeo, gravityDistortionMat);
    lens.position.z = 45;
    lens.rotation.x = -Math.PI / 2;
    group.add(lens);

    parts.push({
        name: "Metric-Manipulating Thrust Nozzle & Gravity Lens",
        description: "A massive, toothed extrusion of high-tensile steel surrounding a hyper-dense refractive lens. It doesn't push exhaust; it compresses the space behind the vessel to create a localized gravity hill.",
        material: "steel, gravityDistortionMat",
        function: "Translates dark energy expansion into directional space-time curvature (Alcubierre thrust).",
        assemblyOrder: 3,
        connections: ["Singularity Containment Vessel", "Thrust Vectoring Flaps"],
        failureEffect: "Thrust vector inverses, accelerating the ship backward at thousands of Gs, crushing the crew.",
        cascadeFailures: ["Inertial Dampener Overload"],
        originalPosition: { x: 0, y: 0, z: 20 },
        explodedPosition: { x: 0, y: 0, z: 120 }
    });

    // 4. Fluid Injectors (Complex Tube Geometries Arrays)
    const injectorsGroup = new THREE.Group();
    const numInjectors = 12;
    for (let i = 0; i < numInjectors; i++) {
        const angle = (i / numInjectors) * Math.PI * 2;
        
        // Create a winding spline path for the hydraulic tubing
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(Math.cos(angle) * 30, Math.sin(angle) * 30, -30),
            new THREE.Vector3(Math.cos(angle + 0.2) * 25, Math.sin(angle + 0.2) * 25, -15),
            new THREE.Vector3(Math.cos(angle - 0.2) * 20, Math.sin(angle - 0.2) * 20, 0),
            new THREE.Vector3(Math.cos(angle) * 16, Math.sin(angle) * 16, 15)
        ]);
        
        const tubeGeo = new THREE.TubeGeometry(curve, 64, 1.5, 16, false);
        const tube = new THREE.Mesh(tubeGeo, chrome);
        
        // Add reinforcing rings along the tube
        const ringGeo = new THREE.TorusGeometry(1.8, 0.3, 8, 16);
        for(let j=0; j<=1; j+=0.1) {
            const pt = curve.getPoint(j);
            const tgt = curve.getTangent(j);
            const ring = new THREE.Mesh(ringGeo, darkSteel);
            ring.position.copy(pt);
            ring.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1), tgt);
            tube.add(ring);
        }
        
        injectorsGroup.add(tube);
    }
    group.add(injectorsGroup);

    parts.push({
        name: "Non-Newtonian Fluid Injector Manifolds",
        description: "Twelve highly complex, spiraling chrome tubes wrapped in reinforcing rings. They pump the raw dark fluid from the reservoirs into the containment core at relativistic speeds.",
        material: "chrome",
        function: "Supplies the necessary matter/energy to the singularity core.",
        assemblyOrder: 4,
        connections: ["Singularity Containment Vessel", "Dark Fluid Reservoirs"],
        failureEffect: "Fluid clogs, causing localized freeze-out of the metric, locking the ship in a stasis field permanently.",
        cascadeFailures: ["Pump Cavitation", "Timeline Desynchronization"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -80, y: 0, z: -30 }
    });

    // 5. Dark Fluid Reservoirs (Glass Spheres with animated fluid interiors)
    const reservoirsGroup = new THREE.Group();
    const resGeo = new THREE.SphereGeometry(8, 64, 64);
    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2 + (Math.PI/4);
        const res = new THREE.Mesh(resGeo, glass);
        res.position.set(Math.cos(angle) * 35, Math.sin(angle) * 35, -25);
        
        // Inner glowing core to represent static fluid
        const innerGeo = new THREE.IcosahedronGeometry(6, 3);
        const inner = new THREE.Mesh(innerGeo, darkEnergyEmissiveMat);
        res.add(inner);
        
        // Connecting struts to main body
        const strutGeo = new THREE.CylinderGeometry(1, 1, 15, 16);
        const strut = new THREE.Mesh(strutGeo, aluminum);
        strut.position.set(Math.cos(angle)*25, Math.sin(angle)*25, -25);
        strut.lookAt(res.position);
        strut.rotateX(Math.PI/2);
        reservoirsGroup.add(strut);
        
        reservoirsGroup.add(res);
    }
    group.add(reservoirsGroup);

    parts.push({
        name: "Dark Fluid Storage Vats",
        description: "Four massive spherical vats made of hyper-reinforced transparent aluminum (glass-like). Contains the raw dark fluid before injection.",
        material: "glass, darkEnergyEmissiveMat, aluminum",
        function: "Stores the exotic fuel.",
        assemblyOrder: 5,
        connections: ["Non-Newtonian Fluid Injector Manifolds"],
        failureEffect: "Fluid breaches the vat, violently expanding as dark energy and ripping the ship apart at the atomic level.",
        cascadeFailures: ["Vat Shatter", "Ship Vaporization"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 100, y: 100, z: -50 }
    });

    // 6. Thrust Vectoring Flaps (Articulating mechanism)
    const flapsGroup = new THREE.Group();
    flapsGroup.position.z = 50;
    const numFlaps = 12;
    const flapGeo = new THREE.BoxGeometry(6, 1, 15);
    // Offset geometry so rotation hinges at the base
    flapGeo.translate(0, 0, 7.5);
    
    const flaps = [];
    for (let i = 0; i < numFlaps; i++) {
        const angle = (i / numFlaps) * Math.PI * 2;
        const flapPivot = new THREE.Group();
        flapPivot.position.set(Math.cos(angle) * 22, Math.sin(angle) * 22, 0);
        flapPivot.rotation.z = angle;
        
        const flap = new THREE.Mesh(flapGeo, darkSteel);
        flapPivot.add(flap);
        
        // Add intricate piston to flap
        const pistonBaseGeo = new THREE.CylinderGeometry(0.5, 0.5, 8, 8);
        const pistonBase = new THREE.Mesh(pistonBaseGeo, chrome);
        pistonBase.position.set(0, -3, 5);
        pistonBase.rotation.x = Math.PI / 4;
        flapPivot.add(pistonBase);

        flaps.push(flapPivot);
        flapsGroup.add(flapPivot);
    }
    group.add(flapsGroup);

    parts.push({
        name: "Vectoring Space-Time Flaps",
        description: "Twelve heavy dark steel flaps positioned around the gravity lens. Each is actuated by massive chrome pistons. They physically shape the gravitational wave emissions.",
        material: "darkSteel, chrome",
        function: "Provides steering by creating asymmetrical gradients in the dark energy expansion field.",
        assemblyOrder: 6,
        connections: ["Metric-Manipulating Thrust Nozzle"],
        failureEffect: "Ship enters an uncontrollable, relativistic spin.",
        cascadeFailures: ["Navigation Failure", "Centrifugal Hull Breach"],
        originalPosition: { x: 0, y: 0, z: 50 },
        explodedPosition: { x: 0, y: 0, z: 180 }
    });

    // 7. Sub-space Harmonizer Rings (Rapidly spinning rings)
    const harmonizerGroup = new THREE.Group();
    harmonizerGroup.position.z = 10;
    const ringGeo1 = new THREE.TorusGeometry(26, 0.5, 16, 100);
    const ringGeo2 = new THREE.TorusGeometry(28, 0.5, 16, 100);
    const ringGeo3 = new THREE.TorusGeometry(30, 1.0, 16, 100);
    
    const hRing1 = new THREE.Mesh(ringGeo1, neonCircuitMat);
    const hRing2 = new THREE.Mesh(ringGeo2, chrome);
    const hRing3 = new THREE.Mesh(ringGeo3, steel);
    
    harmonizerGroup.add(hRing1);
    harmonizerGroup.add(hRing2);
    harmonizerGroup.add(hRing3);
    group.add(harmonizerGroup);

    parts.push({
        name: "Sub-space Harmonizer Rings",
        description: "Three concentric, independently rotating rings (Steel, Chrome, Neon-doped). They spin at incredible RPMs to generate a stabilizing torsion field around the nozzle.",
        material: "neonCircuitMat, chrome, steel",
        function: "Prevents localized frame-dragging from tearing the ship's superstructure apart.",
        assemblyOrder: 7,
        connections: ["Singularity Containment Vessel", "Metric-Manipulating Thrust Nozzle"],
        failureEffect: "Lense-Thirring effect reaches critical levels, twisting the ship into a corkscrew.",
        cascadeFailures: ["Torsional Shearing", "Ring Shattering"],
        originalPosition: { x: 0, y: 0, z: 10 },
        explodedPosition: { x: 0, y: 0, z: -100 }
    });

    // 8. Cooling Radiator Arrays (Massive instanced fins)
    const finGeo = new THREE.BoxGeometry(0.2, 10, 20);
    // 360 fins radially
    const finCount = 360;
    const radiatorInstanced = new THREE.InstancedMesh(finGeo, aluminum, finCount);
    const dummyObj = new THREE.Object3D();
    for (let i = 0; i < finCount; i++) {
        const angle = (i / finCount) * Math.PI * 2;
        dummyObj.position.set(Math.cos(angle) * 16, Math.sin(angle) * 16, -10);
        dummyObj.rotation.set(0, 0, angle);
        dummyObj.updateMatrix();
        radiatorInstanced.setMatrixAt(i, dummyObj.matrix);
    }
    group.add(radiatorInstanced);

    parts.push({
        name: "Quantum Heat Radiator Array",
        description: "360 ultra-thin aluminum fins arranged radially. They don't just radiate heat; they vent excess Hawking radiation generated by the micro-singularity.",
        material: "aluminum",
        function: "Thermal and radiation management of the core.",
        assemblyOrder: 8,
        connections: ["Singularity Containment Vessel"],
        failureEffect: "Core melts down, causing a runaway thermal runaway.",
        cascadeFailures: ["Heat Death of Ship"],
        originalPosition: { x: 0, y: 0, z: -10 },
        explodedPosition: { x: 0, y: -150, z: -10 }
    });

    // 9. Primary Power Conduits (Instanced ribbed tubes)
    const conduitGeo = new THREE.CylinderGeometry(2, 2, 80, 16, 64);
    // Add ribbing via displacement or geometry modification
    const posAttribute = conduitGeo.attributes.position;
    for (let i = 0; i < posAttribute.count; i++) {
        const y = posAttribute.getY(i);
        const radiusMult = 1 + Math.sin(y * 5) * 0.1;
        posAttribute.setX(i, posAttribute.getX(i) * radiusMult);
        posAttribute.setZ(i, posAttribute.getZ(i) * radiusMult);
    }
    conduitGeo.computeVertexNormals();

    const conduitGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const conduit = new THREE.Mesh(conduitGeo, rubber);
        conduit.position.set(Math.cos(angle) * 20, Math.sin(angle) * 20, 10);
        conduit.rotation.x = Math.PI / 2;
        conduitGroup.add(conduit);
    }
    group.add(conduitGroup);

    parts.push({
        name: "Super-conducting Rubberized Conduits",
        description: "Thick, ribbed cables carrying unbelievable amounts of electrical current to the magnetic coils. Encased in high-density rubber.",
        material: "rubber",
        function: "Power transmission.",
        assemblyOrder: 9,
        connections: ["Tri-Axial Magnetic Confinement Knots"],
        failureEffect: "Massive EMP burst, disabling all electronic systems instantly.",
        cascadeFailures: ["Power Loss", "Containment Failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -100, y: 100, z: 100 }
    });

    // 10. Operator Diagnostics Deck (Cabin)
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, 30, -30);
    
    const cabinGeo = new THREE.BoxGeometry(16, 10, 12);
    const cabin = new THREE.Mesh(cabinGeo, steel);
    cabinGroup.add(cabin);
    
    // Tinted window
    const windowGeo = new THREE.PlaneGeometry(14, 6);
    const cabWindow = new THREE.Mesh(windowGeo, tinted);
    cabWindow.position.set(0, 1, 6.1);
    cabinGroup.add(cabWindow);
    
    // Interior screens (Emissive)
    const screenGeo = new THREE.PlaneGeometry(4, 3);
    const screen1 = new THREE.Mesh(screenGeo, neonCircuitMat);
    screen1.position.set(-3, 1, 5.9);
    screen1.rotation.y = Math.PI;
    cabinGroup.add(screen1);
    
    const screen2 = new THREE.Mesh(screenGeo, warningLightMat);
    screen2.position.set(3, 1, 5.9);
    screen2.rotation.y = Math.PI;
    cabinGroup.add(screen2);

    group.add(cabinGroup);

    parts.push({
        name: "Diagnostics & Operations Deck",
        description: "An armored observation deck mounted precariously close to the core. Features tinted glass to prevent operators from going blind from exotic radiation, and glowing diagnostics screens.",
        material: "steel, tinted, neonCircuitMat",
        function: "Local monitoring and manual override of the dark fluid phase transitions.",
        assemblyOrder: 10,
        connections: ["Singularity Containment Vessel", "Main Hull"],
        failureEffect: "Crew is exposed directly to unfiltered dark energy, undergoing rapid biological transmutation.",
        cascadeFailures: ["Crew Loss", "Manual Control Loss"],
        originalPosition: { x: 0, y: 30, z: -30 },
        explodedPosition: { x: 0, y: 200, z: -100 }
    });

    // 11. Dark Energy Catalyzers (Nested Icosahedrons)
    const catalyzerGroup = new THREE.Group();
    for(let i=0; i<8; i++) {
        const angle = (i/8) * Math.PI * 2;
        const cat = new THREE.Group();
        cat.position.set(Math.cos(angle)*18, Math.sin(angle)*18, -15);
        
        const outerIco = new THREE.Mesh(new THREE.IcosahedronGeometry(3, 0), glass);
        const innerIco = new THREE.Mesh(new THREE.IcosahedronGeometry(1.5, 0), neonCircuitMat);
        
        cat.add(outerIco);
        cat.add(innerIco);
        
        // Add a small connecting beam
        const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 5), steel);
        beam.position.set(0, 0, 0);
        beam.lookAt(new THREE.Vector3(0,0,0));
        cat.add(beam);
        
        catalyzerGroup.add(cat);
    }
    group.add(catalyzerGroup);
    
    parts.push({
        name: "Geometric Dark Energy Catalyzers",
        description: "Platonic solid constructs (Icosahedrons) nested within glass. The specific geometry resonates with the zero-point energy field, catalysing the phase shift from clumping to expansion.",
        material: "glass, neonCircuitMat, steel",
        function: "Triggers the violent dark energy expansion phase.",
        assemblyOrder: 11,
        connections: ["Singularity Containment Vessel"],
        failureEffect: "Engine gets stuck in Dark Matter (clumping) phase, creating a black hole.",
        cascadeFailures: ["Catalyst Shatter"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 150, y: -150, z: 50 }
    });

    // 12. Structural Lattice (Extensive bracing)
    const latticeGeo = new THREE.CylinderGeometry(0.5, 0.5, 60, 8);
    const latticeGroup = new THREE.Group();
    for(let i=0; i<16; i++) {
        const strut = new THREE.Mesh(latticeGeo, darkSteel);
        strut.position.set((Math.random()-0.5)*40, (Math.random()-0.5)*40, (Math.random()-0.5)*40);
        strut.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
        latticeGroup.add(strut);
    }
    group.add(latticeGroup);
    parts.push({
        name: "Chaotic Structural Bracing",
        description: "A seemingly random web of high-strength dark steel struts. The arrangement is calculated by an AI to perfectly counter the non-linear vibrational modes of the propulsion system.",
        material: "darkSteel",
        function: "Maintains engine macro-structure.",
        assemblyOrder: 12,
        connections: ["All major components"],
        failureEffect: "Engine vibrates itself into microscopic dust.",
        cascadeFailures: ["Structural Integrity Collapse"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 200, y: 200, z: 200 }
    });

    // 13. Rivets (Thousands of instanced details)
    const rivetGeo = new THREE.SphereGeometry(0.3, 8, 8);
    const rivetCount = 2000;
    const rivetsInstanced = new THREE.InstancedMesh(rivetGeo, chrome, rivetCount);
    for(let i=0; i<rivetCount; i++) {
        // Place along the housing rims randomly but structured
        const t = Math.random();
        const angle = Math.random() * Math.PI * 2;
        const radius = 15 + Math.sin(t * Math.PI * 4) * 2 + Math.cos(t * Math.PI * 12) * 0.5 - (t * 5) + 0.2;
        const y = (t - 0.5) * 40;
        
        dummyObj.position.set(Math.cos(angle)*radius, Math.sin(angle)*radius, y);
        dummyObj.updateMatrix();
        rivetsInstanced.setMatrixAt(i, dummyObj.matrix);
    }
    group.add(rivetsInstanced);
    parts.push({
        name: "Quantum-locked Rivets",
        description: "Thousands of microscopic chrome rivets, quantum-locked in place to secure the housing plates against multi-dimensional shearing forces.",
        material: "chrome",
        function: "Fastens armor plates.",
        assemblyOrder: 13,
        connections: ["Singularity Containment Vessel"],
        failureEffect: "Armor plating flies off at relativistic speeds, turning into lethal shrapnel.",
        cascadeFailures: ["Hull breach"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -200, y: -200, z: -200 }
    });

    // 14. Phase State Monitors (Small blinking arrays)
    const monitorGeo = new THREE.BoxGeometry(1, 2, 1);
    const monitorGroup = new THREE.Group();
    for(let i=0; i<8; i++) {
        const angle = (i/8)*Math.PI*2;
        const mon = new THREE.Mesh(monitorGeo, plastic);
        mon.position.set(Math.cos(angle)*19, Math.sin(angle)*19, 5);
        
        const light = new THREE.Mesh(new THREE.SphereGeometry(0.4), warningLightMat);
        light.position.set(0, 0, 0.6);
        mon.add(light);
        
        monitorGroup.add(mon);
    }
    group.add(monitorGroup);
    parts.push({
        name: "Phase State Monitors",
        description: "Small plastic and silicon housings with intensely bright warning lights, monitoring the exact transition point between dark matter and dark energy phases.",
        material: "plastic, warningLightMat",
        function: "Provides visual and telemetry data on fluid state.",
        assemblyOrder: 14,
        connections: ["Singularity Containment Vessel"],
        failureEffect: "Loss of telemetry, blind operation of the propulsion system.",
        cascadeFailures: ["Telemetry Loss"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 50 }
    });

    // 15. The Dark Fluid (The core animated particle system)
    // We use a massive InstancedMesh to represent the fluid inside the core and nozzle.
    const fluidParticleCount = 12000;
    const fluidGeo = new THREE.IcosahedronGeometry(0.2, 1);
    
    // We will alternate the material colors inside the animate function, but start with dark matter.
    const fluidInstanced = new THREE.InstancedMesh(fluidGeo, darkFluidMatterMat, fluidParticleCount);
    
    // Store physics data per particle
    const particleData = [];
    for(let i=0; i<fluidParticleCount; i++) {
        particleData.push({
            pos: new THREE.Vector3((Math.random()-0.5)*20, (Math.random()-0.5)*20, (Math.random()-0.5)*50),
            vel: new THREE.Vector3(),
            baseRadius: Math.random() * 8,
            phaseOffset: Math.random() * Math.PI * 2,
            isExhaust: Math.random() > 0.8 // 20% are pushed out as exhaust visual
        });
        dummyObj.position.copy(particleData[i].pos);
        dummyObj.updateMatrix();
        fluidInstanced.setMatrixAt(i, dummyObj.matrix);
    }
    fluidInstanced.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    group.add(fluidInstanced);

    parts.push({
        name: "Non-Newtonian Dark Fluid",
        description: "The core propulsion medium. A swirling, chaotic liquid governed by a generalized Chaplygin gas equation of state. It clumps together gravitationally as dark matter, then violently repels itself as dark energy to generate incredible non-reactionary thrust.",
        material: "darkFluidMatterMat, darkEnergyEmissiveMat",
        function: "Fuel, reaction mass, and space-time manipulator all in one.",
        assemblyOrder: 15,
        connections: ["Singularity Containment Vessel", "Exhaust Nozzle"],
        failureEffect: "Annihilation of local space-time.",
        cascadeFailures: ["End of the Universe"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 } // Fluid doesn't explode nicely, it expands everywhere
    });


    // --- ADVANCED PHD QUIZ QUESTIONS ---
    const quizQuestions = [
        {
            question: "In the context of generalized Chaplygin gas (GCG) models unifying dark matter and dark energy within this propulsion system, what dictates the transition of the dark fluid's equation of state $p = -A / \\rho^\\alpha$ from a dust-like to a cosmological constant-like behavior?",
            options: [
                "The fluid's temperature dropping below the Hawking radiation threshold.",
                "The fluid density $\\rho$ decreasing as the scale factor expands, causing the negative pressure term to dominate.",
                "The injection of baryonic matter into the confinement coils.",
                "A sudden collapse of the localized Lense-Thirring frame-dragging effect."
            ],
            correctAnswer: 1,
            explanation: "In a GCG model, the equation of state is $p = -A / \\rho^\\alpha$. At high densities (early times or compressed states), $\\rho$ is large, making pressure $p$ negligible, thus behaving like pressureless dust (dark matter). As it expands and $\\rho$ decreases, $p$ approaches $-A / \\rho^\\alpha$, mimicking a cosmological constant (dark energy)."
        },
        {
            question: "How does the sound speed $c_s^2 = \\partial p / \\partial \\rho$ in the dark fluid evolve dynamically as it transitions to the expansion (Dark Energy) phase?",
            options: [
                "It remains strictly zero to prevent Jeans instability.",
                "It becomes infinitely large, violating causality instantly.",
                "It transitions from near zero (in the dark matter regime) to a non-zero positive value, allowing perturbations to propagate.",
                "It becomes completely negative, indicating an absolute vacuum state."
            ],
            correctAnswer: 2,
            explanation: "For the GCG model, $c_s^2 = \\alpha A / \\rho^{(\\alpha+1)}$. When the fluid is dense (dark matter regime), $c_s^2 \\approx 0$, which allows for structure formation (clumping). As density drops, $c_s^2$ increases, changing how perturbations evolve."
        },
        {
            question: "Assuming this propulsion system utilizes a localized Alcubierre warp metric driven by the dark fluid's dark energy phase, what is the fundamental requirement on the fluid's energy-momentum tensor $T_{\\mu\\nu}$ to sustain the warp bubble?",
            options: [
                "The trace of the tensor must be identically zero.",
                "It must violate the Null Energy Condition (NEC), requiring negative energy density.",
                "It must perfectly match the electromagnetic stress-energy tensor of the containment coils.",
                "It requires a strictly positive scalar curvature scalar $R$ everywhere."
            ],
            correctAnswer: 1,
            explanation: "The Alcubierre metric requires a negative energy density to expand the space behind the ship and contract it in front, fundamentally violating the Null Energy Condition (NEC) $T_{\\mu\\nu} k^\\mu k^\\nu \\ge 0$ for any null vector $k$."
        },
        {
            question: "When the dark fluid is heavily compressed in its 'clumping' (dark matter) phase inside the containment reactor, how does it evade the standard Jeans instability that would otherwise lead to catastrophic microscopic gravitational collapse?",
            options: [
                "The strong nuclear force repels the particles at Planck scales.",
                "The tri-axial magnetic confinement knots generate a counter-acting tensor field.",
                "The scale of the reactor is significantly smaller than the effective Jeans length $\\lambda_J$ of the fluid at that density and velocity dispersion.",
                "Dark matter cannot undergo gravitational collapse under any circumstances."
            ],
            correctAnswer: 2,
            explanation: "Gravitational collapse via Jeans instability only occurs for perturbations larger than the Jeans length $\\lambda_J = c_s \\sqrt{\\pi / (G \\rho)}$. If the physical dimensions of the confinement are kept smaller than $\\lambda_J$ (or if velocity dispersion/effective pressure counters it), catastrophic collapse is avoided."
        },
        {
            question: "If the exhaust nozzle manipulates the local gravitational constant $G$ via a scalar-tensor coupling to the dark fluid, what distinct observational signature would differentiate this non-Newtonian thrust from a conventional momentum-expulsion exhaust?",
            options: [
                "A massive emission of infrared photons due to blackbody radiation.",
                "The emission of quadrupole gravitational waves independent of ejected mass.",
                "A perfect Newtonian equal-and-opposite reaction registered on the ship's hull.",
                "The exhaust stream would instantly freeze into a solid crystal."
            ],
            correctAnswer: 1,
            explanation: "Conventional engines expel mass, conserving momentum $\\Delta p = 0$. Manipulating the metric dynamically via scalar-tensor fields inherently creates ripples in space-time curvature (gravitational waves), specifically quadrupole radiation due to the asymmetric geometry of the nozzle shaping the metric, with no actual rest mass being ejected."
        }
    ];

    // --- ANIMATION LOGIC ---
    let engineCycle = 0; // 0 to 10 seconds

    function animate(time, speed, meshes) {
        // speed scaling
        const delta = 0.016 * speed;
        engineCycle = (engineCycle + delta) % 10.0;
        
        // Determine Engine Phase
        // 0.0 - 4.0: Clumping (Dark Matter mode)
        // 4.0 - 5.0: Ignition/Transition
        // 5.0 - 9.0: Expansion (Dark Energy mode)
        // 9.0 - 10.0: Reset
        
        let phase = "clump";
        let phaseProgress = 0;
        if (engineCycle < 4.0) {
            phase = "clump";
            phaseProgress = engineCycle / 4.0;
        } else if (engineCycle < 5.0) {
            phase = "transition";
            phaseProgress = (engineCycle - 4.0) / 1.0;
        } else if (engineCycle < 9.0) {
            phase = "expand";
            phaseProgress = (engineCycle - 5.0) / 4.0;
        } else {
            phase = "reset";
            phaseProgress = (engineCycle - 9.0) / 1.0;
        }

        // 1. Animate the Dark Fluid Particle System
        const fluidMesh = meshes.find(m => m.geometry === fluidGeo);
        if (fluidMesh) {
            // Adjust materials based on phase
            if (phase === "clump") {
                darkFluidMatterMat.emissive.setHex(0x050011);
                darkFluidMatterMat.color.setHex(0x010101);
            } else if (phase === "transition") {
                const intensity = Math.random();
                darkFluidMatterMat.emissive.setHex(intensity > 0.5 ? 0x5500aa : 0x050011);
            } else if (phase === "expand") {
                darkFluidMatterMat.emissive.setHex(0xaa00ff);
                darkFluidMatterMat.color.setHex(0x220044);
            }

            for(let i=0; i<fluidParticleCount; i++) {
                const pd = particleData[i];
                
                if (phase === "clump") {
                    // Pull towards center line slowly
                    const targetX = Math.cos(pd.phaseOffset + time * 0.5) * pd.baseRadius * 0.2;
                    const targetY = Math.sin(pd.phaseOffset + time * 0.5) * pd.baseRadius * 0.2;
                    const targetZ = (Math.sin(time + pd.phaseOffset) * 10);
                    
                    pd.vel.x += (targetX - pd.pos.x) * 0.01;
                    pd.vel.y += (targetY - pd.pos.y) * 0.01;
                    pd.vel.z += (targetZ - pd.pos.z) * 0.01;
                    
                    // Friction
                    pd.vel.multiplyScalar(0.9);
                    
                } else if (phase === "transition") {
                    // Violent shaking
                    pd.vel.x += (Math.random() - 0.5) * 2.0;
                    pd.vel.y += (Math.random() - 0.5) * 2.0;
                    pd.vel.z += (Math.random() - 0.5) * 2.0;
                    pd.vel.multiplyScalar(0.95);
                    
                } else if (phase === "expand") {
                    // Dark energy pushing out
                    if (pd.isExhaust) {
                        pd.vel.z += 2.0; // blast out the nozzle
                        // slight radial expansion
                        pd.vel.x += (pd.pos.x) * 0.05;
                        pd.vel.y += (pd.pos.y) * 0.05;
                    } else {
                        // Internal circulation expansion
                        const targetX = Math.cos(pd.phaseOffset - time * 2) * pd.baseRadius * 1.5;
                        const targetY = Math.sin(pd.phaseOffset - time * 2) * pd.baseRadius * 1.5;
                        pd.vel.x += (targetX - pd.pos.x) * 0.05;
                        pd.vel.y += (targetY - pd.pos.y) * 0.05;
                        pd.vel.multiplyScalar(0.85);
                    }
                } else if (phase === "reset") {
                    // Quickly pull exhaust back in to loop (simulate continuous flow)
                    if (pd.pos.z > 100) {
                        pd.pos.z = -40;
                        pd.vel.set(0,0,0);
                    }
                    pd.vel.multiplyScalar(0.8);
                }

                // Apply velocity
                pd.pos.add(pd.vel);
                
                // Keep bounded somewhat if not exhaust
                if (!pd.isExhaust && pd.pos.length() > 30) {
                    pd.pos.normalize().multiplyScalar(30);
                    pd.vel.reflect(pd.pos.clone().normalize()).multiplyScalar(0.5);
                }

                dummyObj.position.copy(pd.pos);
                dummyObj.rotation.x += pd.vel.y * 0.1;
                dummyObj.rotation.y += pd.vel.x * 0.1;
                
                let scale = 1.0;
                if (phase === "expand") scale = 1.5 + Math.random();
                dummyObj.scale.set(scale, scale, scale);
                
                dummyObj.updateMatrix();
                fluidMesh.setMatrixAt(i, dummyObj.matrix);
            }
            fluidMesh.instanceMatrix.needsUpdate = true;
        }

        // 2. Animate Harmonizer Rings
        const hRings = harmonizerGroup.children;
        if (hRings.length === 3) {
            const baseSpin = 0.5 * speed;
            const spinMultiplier = (phase === "expand" || phase === "transition") ? 10.0 : 1.0;
            hRings[0].rotation.x += baseSpin * spinMultiplier * 0.02;
            hRings[0].rotation.y += baseSpin * spinMultiplier * 0.03;
            
            hRings[1].rotation.x -= baseSpin * spinMultiplier * 0.04;
            hRings[1].rotation.z += baseSpin * spinMultiplier * 0.01;
            
            hRings[2].rotation.y -= baseSpin * spinMultiplier * 0.05;
            hRings[2].rotation.z -= baseSpin * spinMultiplier * 0.02;
        }

        // 3. Animate Vectoring Flaps
        const flapsGroupRef = group.children.find(c => c === flapsGroup);
        if (flapsGroupRef) {
            flapsGroupRef.children.forEach((flapPivot, idx) => {
                // Base oscillation
                let targetRot = Math.sin(time * 2 + idx) * 0.2;
                
                // If expanding, flare out significantly
                if (phase === "expand") {
                    targetRot += 0.8; // Open wide
                } else if (phase === "transition") {
                    targetRot += (Math.random() * 0.4); // Flutter
                }
                
                // Smooth interpolation
                flapPivot.children[0].rotation.x += (targetRot - flapPivot.children[0].rotation.x) * 0.1;
                
                // Animate piston attached to it
                const piston = flapPivot.children[1];
                piston.scale.y = 1 + (flapPivot.children[0].rotation.x * 1.5);
            });
        }

        // 4. Animate Core Housing Rotation and Pulsing
        housing.rotation.y += 0.01 * speed;
        if (phase === "expand") {
            housing.scale.set(1.02, 1.02, 1.02); // Bulge
        } else {
            housing.scale.lerp(new THREE.Vector3(1,1,1), 0.1);
        }

        // 5. Warning lights on Phase State Monitors
        if (phase === "transition" || phase === "expand") {
            warningLightMat.emissiveIntensity = (Math.sin(time * 20) > 0) ? 5.0 : 0.0;
        } else {
            warningLightMat.emissiveIntensity = 0.0;
        }
        
        // 6. Catalyzer nested spinning
        catalyzerGroup.children.forEach((cat, idx) => {
            cat.rotation.x += 0.05 * speed;
            cat.rotation.y += 0.02 * speed;
            cat.children[1].rotation.z -= 0.1 * speed; // Inner spins opposite
            
            if (phase === "expand") {
                cat.position.setLength(18 + Math.sin(time*10 + idx)*2);
            } else {
                cat.position.setLength(18);
            }
        });
        
        // 7. Gravity Lens Warping
        lens.rotation.y += 0.05 * speed;
        lens.scale.x = 1 + Math.sin(time * 5) * 0.1;
        lens.scale.z = 1 + Math.cos(time * 5) * 0.1;
        if (phase === "expand") {
            gravityDistortionMat.ior = 2.5 + Math.random();
        } else {
            gravityDistortionMat.ior = 1.5;
        }
    }

    return { group, parts, description: "A God-Tier propulsion engine exploiting Dark Fluid to manipulate the space-time metric. Switches between localized gravitational collapse (Dark Matter) and violent, metric-stretching expansion (Dark Energy) to produce impossible thrust.", quizQuestions, animate };
}
