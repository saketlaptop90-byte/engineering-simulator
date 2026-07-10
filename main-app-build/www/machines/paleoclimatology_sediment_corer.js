import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // --------------------------------------------------------
    // HIGH-TECH CUSTOM MATERIALS
    // --------------------------------------------------------
    const neonCyan = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 1.5, roughness: 0.2, metalness: 0.8 });
    const neonOrange = new THREE.MeshStandardMaterial({ color: 0xff4400, emissive: 0xff4400, emissiveIntensity: 2.0, roughness: 0.1, metalness: 0.5 });
    const neonGreen = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 1.2, roughness: 0.3, metalness: 0.7 });
    const sensorGlass = new THREE.MeshPhysicalMaterial({ color: 0x050505, metalness: 0.9, roughness: 0.1, transparent: true, opacity: 0.8, clearcoat: 1.0 });
    const mudTexture = new THREE.MeshStandardMaterial({ color: 0x2b2219, roughness: 1.0, bumpScale: 0.1 });
    const titanium = new THREE.MeshStandardMaterial({ color: 0x8899a6, roughness: 0.4, metalness: 0.8, clearcoat: 0.2 });

    meshes.neonCyan = neonCyan;
    meshes.neonOrange = neonOrange;
    meshes.neonGreen = neonGreen;
    
    // Scale modifier for easy global sizing
    const scale = 0.5;
    group.scale.set(scale, scale, scale);
    meshes.mainGroup = group;

    // Helper: Beveled Structural Member to avoid simple cubes
    function createBeveledBar(width, height, depth, mat) {
        const shape = new THREE.Shape();
        shape.moveTo(-width/2, -height/2);
        shape.lineTo(width/2, -height/2);
        shape.lineTo(width/2, height/2);
        shape.lineTo(-width/2, height/2);
        shape.lineTo(-width/2, -height/2);
        const extrudeSettings = { depth: depth, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.05, bevelThickness: 0.05 };
        const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geom.center();
        return new THREE.Mesh(geom, mat);
    }

    // Helper: Hexagonal Bolt Array
    function addBoltArray(parent, radius, yPos, count, mat) {
        for(let i=0; i<count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const boltGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 6);
            const bolt = new THREE.Mesh(boltGeom, mat);
            bolt.position.set(Math.cos(angle) * radius, yPos, Math.sin(angle) * radius);
            bolt.rotation.x = Math.PI / 2;
            bolt.rotation.z = -angle;
            parent.add(bolt);
        }
    }

    // --------------------------------------------------------
    // PART 1: TITANIUM CUTTING SHOE (NOSE CONE)
    // --------------------------------------------------------
    const shoeGroup = new THREE.Group();
    shoeGroup.position.y = -20;
    const shoePoints = [];
    shoePoints.push(new THREE.Vector2(1.3, -1));
    shoePoints.push(new THREE.Vector2(1.4, -0.6));
    shoePoints.push(new THREE.Vector2(1.6, -0.2));
    shoePoints.push(new THREE.Vector2(1.7, 0.5));
    shoePoints.push(new THREE.Vector2(1.7, 2.5));
    shoePoints.push(new THREE.Vector2(1.3, 2.5));
    const shoeGeom = new THREE.LatheGeometry(shoePoints, 64);
    const shoeMesh = new THREE.Mesh(shoeGeom, titanium);
    shoeGroup.add(shoeMesh);
    
    // Cutting edge micro-serrations
    for(let i=0; i<36; i++) {
        const serration = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.3, 8), darkSteel);
        const angle = (i / 36) * Math.PI * 2;
        serration.position.set(Math.cos(angle)*1.35, -0.9, Math.sin(angle)*1.35);
        serration.rotation.x = Math.PI;
        shoeGroup.add(serration);
    }
    addBoltArray(shoeGroup, 1.7, 1.5, 12, steel);
    
    group.add(shoeGroup);
    parts.push({
        name: "Titanium Cutting Shoe",
        description: "Hardened titanium alloy nose cone with micro-serrated leading edges designed to penetrate dense ocean floor sediments, clays, and compacted sands.",
        material: "Titanium Alloy",
        function: "Shears and directs seafloor sediment into the core liner upon impact.",
        assemblyOrder: 1,
        connections: ["Core Catcher", "Chromoly Outer Tube"],
        failureEffect: "Inability to penetrate hard sediments; severe structural buckling.",
        cascadeFailures: ["Outer Tube Fracture", "Core Sample Destruction"],
        originalPosition: { x: 0, y: -20, z: 0 },
        explodedPosition: { x: 0, y: -30, z: 0 }
    });

    // --------------------------------------------------------
    // PART 2: CORE CATCHER MECHANISM
    // --------------------------------------------------------
    const catcherGroup = new THREE.Group();
    catcherGroup.position.y = -17;
    const catcherRing = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.1, 16, 64), copper);
    catcherRing.rotation.x = Math.PI / 2;
    catcherGroup.add(catcherRing);

    // Flexible overlapping petals
    for(let i=0; i<24; i++) {
        const angle = (i / 24) * Math.PI * 2;
        const petalGeom = new THREE.CylinderGeometry(0.15, 0.02, 1.5, 8, 1, false, 0, Math.PI);
        const petal = new THREE.Mesh(petalGeom, steel);
        petal.position.set(Math.cos(angle) * 1.3, 0.5, Math.sin(angle) * 1.3);
        petal.rotation.y = -angle + Math.PI/2;
        petal.rotation.x = Math.PI/6; // Angled inward
        catcherGroup.add(petal);
    }
    group.add(catcherGroup);
    parts.push({
        name: "Core Catcher Mechanism",
        description: "An array of flexible overlapping steel petals mounted on a copper retaining ring. They allow sediment to enter but close to prevent it from sliding out during retrieval.",
        material: "Spring Steel & Copper",
        function: "Retains the captured sediment core within the tube.",
        assemblyOrder: 2,
        connections: ["Titanium Cutting Shoe", "Polycarbonate Inner Liner"],
        failureEffect: "Complete loss of sediment sample as it falls out during ascent.",
        cascadeFailures: ["Mission Failure"],
        originalPosition: { x: 0, y: -17, z: 0 },
        explodedPosition: { x: 0, y: -25, z: 0 }
    });

    // --------------------------------------------------------
    // PART 3: POLYCARBONATE INNER LINER
    // --------------------------------------------------------
    const linerGroup = new THREE.Group();
    const linerLength = 35;
    const linerGeom = new THREE.CylinderGeometry(1.2, 1.2, linerLength, 32, 1, true);
    const liner = new THREE.Mesh(linerGeom, sensorGlass);
    liner.position.y = 0;
    linerGroup.add(liner);
    // Add sediment visual inside the liner
    const sedimentGeom = new THREE.CylinderGeometry(1.15, 1.15, linerLength * 0.8, 32);
    const sediment = new THREE.Mesh(sedimentGeom, mudTexture);
    sediment.position.y = -linerLength * 0.1;
    linerGroup.add(sediment);
    group.add(linerGroup);
    parts.push({
        name: "Polycarbonate Inner Liner",
        description: "Optically clear, high-pressure extruded polycarbonate tube that houses the actual sediment sample. Can be directly removed and placed into CT scanners.",
        material: "Polycarbonate & Mud Sample",
        function: "Encapsulates and preserves the structural integrity of the sediment stratigraphy.",
        assemblyOrder: 3,
        connections: ["Chromoly Outer Tube", "Core Catcher"],
        failureEffect: "Contamination or mixing of the sediment layers.",
        cascadeFailures: ["Data Invalidity"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -8, y: 0, z: 0 }
    });

    // --------------------------------------------------------
    // PART 4: CHROMOLY OUTER TUBE
    // --------------------------------------------------------
    const outerTubeGroup = new THREE.Group();
    const outerGeom = new THREE.CylinderGeometry(1.7, 1.7, linerLength, 64, 1, true);
    const outerTube = new THREE.Mesh(outerGeom, darkSteel);
    outerTubeGroup.add(outerTube);
    group.add(outerTubeGroup);
    parts.push({
        name: "Chromoly Outer Coring Tube",
        description: "The primary structural barrel of the corer. Forged from high-strength chromoly steel to withstand immense bending forces and pressure.",
        material: "Chromoly Steel",
        function: "Provides structural rigidity for driving the liner into the seabed.",
        assemblyOrder: 4,
        connections: ["Hydrodynamic Weight Stand", "Titanium Cutting Shoe"],
        failureEffect: "Tube bends or snaps during penetration.",
        cascadeFailures: ["Liner Shattering", "Total Corer Loss"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    // --------------------------------------------------------
    // PART 5: REINFORCEMENT RINGS ARRAY
    // --------------------------------------------------------
    const ringsGroup = new THREE.Group();
    for(let i=0; i<15; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(1.75, 0.15, 16, 64), steel);
        const yPos = (i * 2.2) - (linerLength/2) + 2;
        ring.position.y = yPos;
        ring.rotation.x = Math.PI / 2;
        // Adding bolts to each ring
        addBoltArray(ring, 1.75, 0, 8, chrome);
        ringsGroup.add(ring);
    }
    group.add(ringsGroup);
    parts.push({
        name: "Reinforcement Rings Array",
        description: "A series of heavy steel collars welded along the outer tube to prevent lateral deformation and buckling under load.",
        material: "Steel",
        function: "Distributes structural stress along the tube's axis.",
        assemblyOrder: 5,
        connections: ["Chromoly Outer Tube"],
        failureEffect: "Localized structural weaknesses leading to bending.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 12 }
    });

    // --------------------------------------------------------
    // PART 6: HYDRAULIC LINES ARRAY
    // --------------------------------------------------------
    const hydroGroup = new THREE.Group();
    for(let j=0; j<4; j++) {
        const lineGeom = new THREE.CylinderGeometry(0.06, 0.06, linerLength, 8);
        const line = new THREE.Mesh(lineGeom, copper);
        line.position.x = Math.cos(j * Math.PI/2) * 1.95;
        line.position.z = Math.sin(j * Math.PI/2) * 1.95;
        // Bracket mounts
        for(let k=0; k<10; k++) {
            const bracketGeom = new THREE.BoxGeometry(0.2, 0.2, 0.2);
            const bracket = new THREE.Mesh(bracketGeom, darkSteel);
            bracket.position.y = (k * 3.5) - (linerLength/2) + 2;
            line.add(bracket);
        }
        hydroGroup.add(line);
    }
    group.add(hydroGroup);
    parts.push({
        name: "Micro-Hydraulic Sensor Lines",
        description: "Copper piping running along the exterior to deliver hydraulic pressure and transmit data from bottom sensors to the top telemetry package.",
        material: "Copper",
        function: "Data and fluid transmission.",
        assemblyOrder: 6,
        connections: ["Chromoly Outer Tube", "Multi-Sensor CTD Package"],
        failureEffect: "Loss of real-time depth and penetration data.",
        cascadeFailures: ["Incorrect Trigger Timing"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 10, y: 0, z: 0 }
    });

    // --------------------------------------------------------
    // PART 7: HYDRODYNAMIC WEIGHT STAND
    // --------------------------------------------------------
    const standGroup = new THREE.Group();
    standGroup.position.y = 19;
    
    // Central Mast
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.0, 12, 32), chrome);
    standGroup.add(mast);
    
    // Massive Base Flange
    const baseFlange = new THREE.Mesh(new THREE.CylinderGeometry(5.5, 5.5, 0.8, 16), darkSteel);
    baseFlange.position.y = -5.5;
    addBoltArray(baseFlange, 5.0, 0.4, 24, steel);
    standGroup.add(baseFlange);

    // Support Trusses (Complex interlocking cylinders)
    for(let i=0; i<8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 8, 16), steel);
        strut.position.set(Math.cos(angle) * 3.5, -2, Math.sin(angle) * 3.5);
        strut.rotation.x = Math.PI / 6;
        strut.rotation.y = -angle + Math.PI/2;
        standGroup.add(strut);
    }

    group.add(standGroup);
    parts.push({
        name: "Hydrodynamic Weight Stand",
        description: "The immense structural cradle that interfaces the coring tube with the weight stack and lifting mechanism. Engineered to minimize drag during descent.",
        material: "Forged Steel & Chrome",
        function: "Supports the lead weights and aligns the center of gravity.",
        assemblyOrder: 7,
        connections: ["Chromoly Outer Tube", "Depleted Uranium Weight Stack"],
        failureEffect: "Catastrophic structural collapse; entire weight stack falls off.",
        cascadeFailures: ["Equipment Loss", "Cable Snap"],
        originalPosition: { x: 0, y: 19, z: 0 },
        explodedPosition: { x: 0, y: 25, z: 0 }
    });

    // --------------------------------------------------------
    // PART 8: DEPLETED URANIUM WEIGHT STACK
    // --------------------------------------------------------
    const weightGroup = new THREE.Group();
    weightGroup.position.y = 19;
    for(let w=0; w<10; w++) {
        const weightDisc = new THREE.Mesh(new THREE.CylinderGeometry(4.8, 4.8, 0.8, 32), darkSteel);
        weightDisc.position.y = -4.5 + w * 0.9;
        
        // Add lifting eyelets and cooling slots
        for(let e=0; e<6; e++) {
            const angle = (e / 6) * Math.PI * 2;
            const eyelet = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.1, 16, 32), chrome);
            eyelet.position.set(Math.cos(angle)*4.0, 0.4, Math.sin(angle)*4.0);
            eyelet.rotation.y = -angle;
            weightDisc.add(eyelet);
            
            // Slot cutouts simulated by darker inset meshes
            const slot = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.85, 0.5), neonCyan);
            slot.position.set(Math.cos(angle + 0.5)*4.5, 0, Math.sin(angle + 0.5)*4.5);
            slot.rotation.y = -(angle + 0.5);
            weightDisc.add(slot);
        }
        weightGroup.add(weightDisc);
    }
    group.add(weightGroup);
    meshes.weightStack = weightGroup; // for animation pulsing
    parts.push({
        name: "Depleted Uranium Weight Stack",
        description: "A stack of incredibly dense depleted uranium/lead alloy discs providing over 2 tons of driving force to punch through compacted seafloor layers.",
        material: "Depleted Uranium / Lead Alloy",
        function: "Provides the kinetic energy and mass required for penetration.",
        assemblyOrder: 8,
        connections: ["Hydrodynamic Weight Stand"],
        failureEffect: "Insufficient penetration into sediment.",
        cascadeFailures: ["Short Core Sample"],
        originalPosition: { x: 0, y: 19, z: 0 },
        explodedPosition: { x: 0, y: 35, z: 0 }
    });

    // --------------------------------------------------------
    // PART 9: STABILIZATION FINS
    // --------------------------------------------------------
    const finsGroup = new THREE.Group();
    finsGroup.position.y = 23;
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.lineTo(6, 0);
    finShape.lineTo(6, 8);
    finShape.lineTo(2, 12);
    finShape.lineTo(0, 12);
    finShape.lineTo(0, 0);
    const finExtrude = { depth: 0.4, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };
    
    for(let i=0; i<4; i++) {
        const finGeom = new THREE.ExtrudeGeometry(finShape, finExtrude);
        finGeom.translate(0, -6, -0.2); // Center it
        const fin = new THREE.Mesh(finGeom, aluminum);
        const angle = (i / 4) * Math.PI * 2;
        fin.position.set(Math.cos(angle)*1.5, 0, Math.sin(angle)*1.5);
        fin.rotation.y = -angle;
        
        // Add high-tech glowing edge strips
        const edgeStrip = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.2, 0.5), neonOrange);
        edgeStrip.position.set(3, -6, 0);
        fin.add(edgeStrip);
        
        finsGroup.add(fin);
    }
    group.add(finsGroup);
    parts.push({
        name: "Stabilization Fins Array",
        description: "Massive swept aluminum fins equipped with active LED tracer edges. Ensures the corer maintains a perfectly vertical attitude during its free-fall descent.",
        material: "Aerospace Aluminum",
        function: "Provides hydrodynamic stability and vertical alignment.",
        assemblyOrder: 9,
        connections: ["Hydrodynamic Weight Stand"],
        failureEffect: "Corer enters seabed at an angle, snapping the tube.",
        cascadeFailures: ["Total Corer Loss", "Irrecoverable Damage"],
        originalPosition: { x: 0, y: 23, z: 0 },
        explodedPosition: { x: 0, y: 23, z: -15 }
    });

    // --------------------------------------------------------
    // PART 10: ACOUSTIC RELEASE TRANSPONDER
    // --------------------------------------------------------
    const transponderGroup = new THREE.Group();
    transponderGroup.position.set(2.2, 12, 2.2);
    transponderGroup.rotation.y = Math.PI / 4;
    
    const transBody = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 4, 16), darkSteel);
    transponderGroup.add(transBody);
    
    // Glass dome and antenna
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.8, 16, 16, 0, Math.PI*2, 0, Math.PI/2), sensorGlass);
    dome.position.y = 2;
    transponderGroup.add(dome);
    
    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3), steel);
    antenna.position.y = 3.5;
    transponderGroup.add(antenna);
    
    const glowingRing = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.1, 16, 32), neonGreen);
    transponderGroup.add(glowingRing);
    meshes.transponderRing = glowingRing;

    group.add(transponderGroup);
    parts.push({
        name: "Acoustic Release Transponder",
        description: "A highly sensitive, pressure-proof sensor package that receives encrypted sonar pings from the surface vessel to report status or trigger emergency release.",
        material: "Titanium & Quartz Glass",
        function: "Communication and telemetry.",
        assemblyOrder: 10,
        connections: ["Hydrodynamic Weight Stand", "Multi-Sensor CTD Package"],
        failureEffect: "Loss of communication with surface ship.",
        cascadeFailures: ["Inability to retrieve device on command"],
        originalPosition: { x: 2.2, y: 12, z: 2.2 },
        explodedPosition: { x: 12, y: 12, z: 12 }
    });

    // --------------------------------------------------------
    // PART 11: TRIGGER ARM MECHANISM
    // --------------------------------------------------------
    const triggerGroup = new THREE.Group();
    triggerGroup.position.set(-2, 15, 0);
    
    // Main Lever Arm
    const arm = createBeveledBar(8, 0.6, 1.0, steel);
    arm.position.set(-3.5, 0, 0);
    triggerGroup.add(arm);
    
    // Pivot Joint
    const pivot = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1.2, 32), chrome);
    pivot.rotation.x = Math.PI / 2;
    triggerGroup.add(pivot);
    
    // Hydraulic Piston Dampener connecting arm to stand
    const pistonOuter = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 4, 16), darkSteel);
    pistonOuter.position.set(-2, 3, 0);
    pistonOuter.rotation.z = -Math.PI / 6;
    triggerGroup.add(pistonOuter);
    
    const pistonRod = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 4, 16), chrome);
    pistonRod.position.set(-3, 1.5, 0);
    pistonRod.rotation.z = -Math.PI / 6;
    triggerGroup.add(pistonRod);
    meshes.pistonRod = pistonRod;
    meshes.triggerArmGroup = triggerGroup;

    group.add(triggerGroup);
    parts.push({
        name: "Trigger Arm Mechanism",
        description: "A heavily machined steel cantilever system with hydraulic dampening. It holds the pilot weight and actuates the primary release latch upon seafloor contact.",
        material: "Steel & Chrome",
        function: "Releases the main corer into free-fall when the pilot weight hits bottom.",
        assemblyOrder: 11,
        connections: ["Hydrodynamic Weight Stand", "Trigger Tension Cable"],
        failureEffect: "Corer fails to release, or releases prematurely in the water column.",
        cascadeFailures: ["Mission Abort", "Cable Entanglement"],
        originalPosition: { x: -2, y: 15, z: 0 },
        explodedPosition: { x: -15, y: 15, z: 0 }
    });

    // --------------------------------------------------------
    // PART 12: PILOT WEIGHT ASSEMBLY
    // --------------------------------------------------------
    const pilotGroup = new THREE.Group();
    pilotGroup.position.set(-9.5, -20, 0);
    
    // Pilot Corer Body
    const pilotTube = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 6, 32), chrome);
    pilotGroup.add(pilotTube);
    
    // Pilot Weights
    for(let p=0; p<4; p++) {
        const pWeight = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.5, 16), darkSteel);
        pWeight.position.y = 1 + p * 0.6;
        pilotGroup.add(pWeight);
    }
    
    // Pilot Shoe
    const pShoe = new THREE.Mesh(new THREE.ConeGeometry(0.6, 1.0, 16), titanium);
    pShoe.position.y = -3.5;
    pShoe.rotation.x = Math.PI;
    pilotGroup.add(pShoe);

    group.add(pilotGroup);
    meshes.pilotGroup = pilotGroup;
    parts.push({
        name: "Pilot Weight Assembly",
        description: "A miniature secondary corer acting as a plumb bob. It hangs below the main corer, triggering the release arm the moment it touches the ocean floor.",
        material: "Chrome & Dark Steel",
        function: "Detects the seafloor and captures a surface sediment sample.",
        assemblyOrder: 12,
        connections: ["Trigger Tension Cable"],
        failureEffect: "Failure to detect bottom; main corer smashes into seafloor at winch speed.",
        cascadeFailures: ["Inadequate Penetration"],
        originalPosition: { x: -9.5, y: -20, z: 0 },
        explodedPosition: { x: -25, y: -20, z: 0 }
    });

    // --------------------------------------------------------
    // PART 13: TRIGGER TENSION CABLE
    // --------------------------------------------------------
    // Using TubeGeometry along a curve
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-9.5, 15, 0),
        new THREE.Vector3(-10, 5, 0),
        new THREE.Vector3(-9.5, -5, 0),
        new THREE.Vector3(-9.5, -16, 0)
    ]);
    const cableGeom = new THREE.TubeGeometry(curve, 64, 0.1, 8, false);
    const cable = new THREE.Mesh(cableGeom, steel);
    group.add(cable);
    meshes.tensionCable = cable;
    parts.push({
        name: "Trigger Tension Cable",
        description: "High-tensile braided steel wire rope linking the Trigger Arm to the Pilot Weight.",
        material: "Braided Steel",
        function: "Transmits the mechanical tension from the pilot weight to keep the release latch closed.",
        assemblyOrder: 13,
        connections: ["Trigger Arm Mechanism", "Pilot Weight Assembly"],
        failureEffect: "Premature release of the main corer.",
        cascadeFailures: ["Mission Failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -15, y: 0, z: 0 }
    });

    // --------------------------------------------------------
    // PART 14: MULTI-SENSOR CTD PACKAGE
    // --------------------------------------------------------
    const ctdGroup = new THREE.Group();
    ctdGroup.position.set(0, 5, -2.5);
    
    // Main housing
    const ctdBox = createBeveledBar(3, 4, 1.5, darkSteel);
    ctdGroup.add(ctdBox);
    
    // Sensor Probes
    const probe1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2), copper);
    probe1.position.set(-1, -2.5, 0);
    ctdGroup.add(probe1);
    
    const probe2 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.5), chrome);
    probe2.position.set(0, -2.5, 0);
    ctdGroup.add(probe2);
    
    const probe3 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), sensorGlass);
    probe3.position.set(1, -2.5, 0);
    ctdGroup.add(probe3);
    
    const ctdLight = new THREE.Mesh(new THREE.BoxGeometry(2, 0.5, 1.6), neonCyan);
    ctdLight.position.set(0, 1.5, 0);
    ctdGroup.add(ctdLight);
    meshes.ctdLight = ctdLight;

    group.add(ctdGroup);
    parts.push({
        name: "Multi-Sensor CTD Package",
        description: "Conductivity, Temperature, and Depth (CTD) profiler integrated into a pressure-resistant titanium housing. Logs critical water column data during deployment.",
        material: "Titanium & Copper",
        function: "Records oceanographic data and depth profile.",
        assemblyOrder: 14,
        connections: ["Chromoly Outer Tube", "Micro-Hydraulic Sensor Lines"],
        failureEffect: "Loss of environmental metadata for the core sample.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 5, z: -2.5 },
        explodedPosition: { x: 0, y: 5, z: -12 }
    });

    // --------------------------------------------------------
    // PART 15: LIFTING SHACKLE & BAIL
    // --------------------------------------------------------
    const shackleGroup = new THREE.Group();
    shackleGroup.position.y = 26;
    
    // Bail Loop
    const bailGeom = new THREE.TorusGeometry(2, 0.4, 32, 64, Math.PI);
    const bail = new THREE.Mesh(bailGeom, steel);
    bail.rotation.z = Math.PI;
    bail.position.y = 2;
    shackleGroup.add(bail);
    
    // Shackle Pin
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 5, 32), darkSteel);
    pin.rotation.z = Math.PI / 2;
    pin.position.y = 2;
    shackleGroup.add(pin);
    
    // Swivel Joint
    const swivel = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 1.5, 16), chrome);
    shackleGroup.add(swivel);

    group.add(shackleGroup);
    parts.push({
        name: "Massive Lifting Shackle & Bail",
        description: "Heavy-duty articulated forged steel shackle connecting the entire 3-ton assembly to the primary winch cable of the research vessel.",
        material: "Forged Steel",
        function: "Main lifting and suspension point.",
        assemblyOrder: 15,
        connections: ["Hydrodynamic Weight Stand"],
        failureEffect: "Total loss of the entire instrument package to the ocean floor.",
        cascadeFailures: ["Complete Catastrophic Loss"],
        originalPosition: { x: 0, y: 26, z: 0 },
        explodedPosition: { x: 0, y: 35, z: 0 }
    });


    // --------------------------------------------------------
    // QUIZ QUESTIONS
    // --------------------------------------------------------
    const quizQuestions = [
        {
            question: "What is the primary function of the Core Catcher Mechanism located just behind the cutting shoe?",
            options: [
                "To rapidly decelerate the corer",
                "To act as a one-way valve, preventing retrieved sediment from sliding out",
                "To send acoustic signals to the surface",
                "To inject water into the mud for lubrication"
            ],
            correctAnswer: 1,
            explanation: "The Core Catcher uses flexible metal petals that allow sediment to push inward during penetration, but immediately clamp shut to retain the core during the long haul back to the surface."
        },
        {
            question: "Why does the corer utilize a Pilot Weight Assembly hanging below the main structure?",
            options: [
                "To anchor the ship",
                "To provide extra driving mass",
                "To trigger the release mechanism exactly when it touches the seafloor",
                "To measure the ocean temperature"
            ],
            correctAnswer: 2,
            explanation: "The Pilot Weight touches the seabed first, releasing tension on the trigger arm. This drops the main corer into a free-fall to achieve maximum kinetic energy for deep sediment penetration."
        },
        {
            question: "What is the purpose of the inner Polycarbonate Liner?",
            options: [
                "To make the corer lighter",
                "To safely encapsulate the pristine sediment stratigraphy for CT scanning and transport",
                "To generate electricity",
                "To provide structural strength against bending"
            ],
            correctAnswer: 1,
            explanation: "The clear polycarbonate liner allows scientists to extract the mud core entirely intact, preserving the delicate layers of sediment that contain thousands of years of climate data."
        },
        {
            question: "Why are the Stabilization Fins crucial during the descent phase?",
            options: [
                "They prevent the corer from tumbling and ensure a perfectly vertical impact",
                "They act as submarine propellers",
                "They communicate with the acoustic transponder",
                "They cut through underwater seaweed"
            ],
            correctAnswer: 0,
            explanation: "Without massive stabilization fins, the heavy corer would tumble or spiral on the way down, hitting the seabed at an angle and likely shattering the structural tube."
        },
        {
            question: "What is the primary role of the Depleted Uranium Weight Stack?",
            options: [
                "To irradiate the sediment samples",
                "To power the onboard electronics",
                "To provide immense, dense kinetic mass required to punch deep into highly compacted seabed clays",
                "To balance the acoustic transponder"
            ],
            correctAnswer: 2,
            explanation: "To drive a 30-foot steel tube into dense oceanic clay, tremendous kinetic energy is required. Depleted uranium and lead offer extreme density, providing tons of driving force in a compact space."
        }
    ];


    // --------------------------------------------------------
    // ANIMATION FUNCTION
    // --------------------------------------------------------
    function animate(time, speed) {
        const t = time * speed;
        
        // Pulse neon glowing materials
        if (meshes.neonCyan) meshes.neonCyan.emissiveIntensity = 1.0 + Math.sin(t * 3) * 0.8;
        if (meshes.neonOrange) meshes.neonOrange.emissiveIntensity = 1.5 + Math.sin(t * 5) * 0.5;
        if (meshes.neonGreen) meshes.neonGreen.emissiveIntensity = 1.0 + Math.sin(t * 2) * 0.5;

        // Simulate ocean current bobbing on the entire assembly
        meshes.mainGroup.position.y = Math.sin(t * 1.2) * 0.2;
        meshes.mainGroup.rotation.y = Math.sin(t * 0.4) * 0.05;
        meshes.mainGroup.rotation.z = Math.sin(t * 0.6) * 0.02;

        // Pilot Weight dangling and swaying in current
        if (meshes.pilotGroup) {
            meshes.pilotGroup.rotation.z = Math.sin(t * 1.5) * 0.05;
            meshes.pilotGroup.rotation.x = Math.cos(t * 1.1) * 0.05;
            // Slightly alter tension cable to match (simulated by scaling or slight rotation)
            meshes.tensionCable.rotation.z = Math.sin(t * 1.5) * 0.02;
        }

        // Trigger arm micro-vibrations and hydraulic piston adjustments
        if (meshes.triggerArmGroup) {
            meshes.triggerArmGroup.rotation.z = Math.sin(t * 4) * 0.01;
        }
        if (meshes.pistonRod) {
            meshes.pistonRod.position.x = -3 + Math.sin(t * 4) * 0.02;
        }

        // Acoustic Transponder scanning rotation
        if (meshes.transponderRing) {
            meshes.transponderRing.rotation.x = t * 2;
            meshes.transponderRing.rotation.y = t * 3;
        }
    }

    return { group, parts, description: "Advanced Paleoclimatology Sediment Corer system capable of extreme deep-ocean deployment. Features trigger-release mechanisms, dense kinetic weights, and integrated sensor arrays.", quizQuestions, animate };
}

// Auto-generated missing stub
export function createSedimentCorer() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
