import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // 1. Base Mounting Interface (Highly detailed ExtrudeGeometry)
    const baseShape = new THREE.Shape();
    baseShape.moveTo(-5.5, -5.5);
    baseShape.lineTo(5.5, -5.5);
    baseShape.lineTo(7.5, -3.5);
    baseShape.lineTo(7.5, 3.5);
    baseShape.lineTo(5.5, 5.5);
    baseShape.lineTo(-5.5, 5.5);
    baseShape.lineTo(-7.5, 3.5);
    baseShape.lineTo(-7.5, -3.5);
    baseShape.lineTo(-5.5, -5.5);
    
    // Add intricate mounting holes and stress relief cutouts
    const createHole = (x, y, r) => {
        const path = new THREE.Path();
        path.absarc(x, y, r, 0, Math.PI * 2, false);
        baseShape.holes.push(path);
    };
    createHole(-4.5, -4.5, 0.6);
    createHole(4.5, -4.5, 0.6);
    createHole(-4.5, 4.5, 0.6);
    createHole(4.5, 4.5, 0.6);
    createHole(-6, 0, 0.4);
    createHole(6, 0, 0.4);

    const baseExtrudeSettings = { depth: 1.5, bevelEnabled: true, bevelSegments: 6, steps: 2, bevelSize: 0.25, bevelThickness: 0.25 };
    const baseGeometry = new THREE.ExtrudeGeometry(baseShape, baseExtrudeSettings);
    const baseMesh = new THREE.Mesh(baseGeometry, darkSteel);
    baseMesh.rotation.x = Math.PI / 2;
    baseMesh.position.y = -5;
    group.add(baseMesh);
    meshes.base = baseMesh;

    parts.push({
        name: "Kinematic Mounting Interface Plate",
        description: "High-precision machined titanium-alloy base plate for securing the Star Tracker to the spacecraft bus. Employs a kinematic mount design to ensure zero thermal-mechanical drift or stress transfer from the spacecraft frame to the delicate optics.",
        material: "Dark Steel / Titanium Alloy",
        function: "Structural support, mechanical isolation, and alignment reference.",
        assemblyOrder: 1,
        connections: ["Spacecraft Bus", "Thermal Control Unit", "Sensor Housing"],
        failureEffect: "Misalignment of the entire optical axis, leading to massive attitude determination errors and loss of spacecraft orientation.",
        cascadeFailures: ["Loss of spacecraft attitude control", "Antenna pointing failure", "Power loss due to solar array misalignment"],
        originalPosition: { x: 0, y: -5, z: 0 },
        explodedPosition: { x: 0, y: -15, z: 0 }
    });

    // 2. Main Sensor Housing (Complex Cylinder with cutouts and ridges)
    const housingGroup = new THREE.Group();
    const housingGeom = new THREE.CylinderGeometry(4.8, 5.8, 6, 64, 8, false);
    const housingMesh = new THREE.Mesh(housingGeom, aluminum);
    housingMesh.position.y = -1.5;
    housingGroup.add(housingMesh);
    
    // Add external structural ribbing to housing
    for(let i=0; i<16; i++) {
        const ribGeom = new THREE.BoxGeometry(0.4, 6.2, 0.8);
        const ribMesh = new THREE.Mesh(ribGeom, darkSteel);
        const angle = (i / 16) * Math.PI * 2;
        ribMesh.position.set(Math.cos(angle)*5.3, -1.5, Math.sin(angle)*5.3);
        ribMesh.rotation.y = -angle;
        housingGroup.add(ribMesh);
    }
    group.add(housingGroup);
    meshes.housing = housingGroup;

    parts.push({
        name: "Primary Sensor Housing & Shielding",
        description: "Massive aerospace-grade aluminum monolithic housing. Houses the extremely sensitive Focal Plane Array (FPA) and Front-End Electronics (FEE). Features internal tantalum electromagnetic and ionizing radiation shielding.",
        material: "Aerospace Aluminum with Tantalum lining",
        function: "Protects delicate sensors from micrometeoroids, harsh space radiation, and electromagnetic interference.",
        assemblyOrder: 2,
        connections: ["Kinematic Mounting Interface", "FPA Board", "Optical Baffle Assembly"],
        failureEffect: "Radiation degradation of the sensor array causing massive pixel death.",
        cascadeFailures: ["Increased noise in star images", "Complete loss of tracking capability"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -10, z: -15 }
    });

    // 3. Focal Plane Array (FPA) Board (Extrude geometry with micro details)
    const fpaBoardShape = new THREE.Shape();
    fpaBoardShape.moveTo(-3.5, -3.5);
    fpaBoardShape.lineTo(3.5, -3.5);
    fpaBoardShape.lineTo(3.5, 3.5);
    fpaBoardShape.lineTo(-3.5, 3.5);
    fpaBoardShape.lineTo(-3.5, -3.5);
    const fpaExtrudeSettings = { depth: 0.3, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.05, bevelThickness: 0.05 };
    const fpaBoardGeom = new THREE.ExtrudeGeometry(fpaBoardShape, fpaExtrudeSettings);
    const fpaBoardMesh = new THREE.Mesh(fpaBoardGeom, copper); 
    fpaBoardMesh.rotation.x = Math.PI / 2;
    fpaBoardMesh.position.y = -2.2;
    group.add(fpaBoardMesh);
    meshes.fpaBoard = fpaBoardMesh;

    // FPA Sensor Chip (CMOS/CCD) - glossy glowing
    const fpaSensorGeom = new THREE.BoxGeometry(2.5, 0.15, 2.5);
    const fpaSensorMat = new THREE.MeshStandardMaterial({ color: 0x111155, emissive: 0x002244, roughness: 0.05, metalness: 0.95 });
    const fpaSensorMesh = new THREE.Mesh(fpaSensorGeom, fpaSensorMat);
    fpaSensorMesh.position.y = -1.9;
    group.add(fpaSensorMesh);
    meshes.fpaSensor = fpaSensorMesh;

    parts.push({
        name: "Focal Plane Array (FPA) & Detector",
        description: "A customized 8-Megapixel back-illuminated Active Pixel Sensor (APS) with extreme quantum efficiency. Detects star photons down to visual magnitude 8.5 at rapid frame rates.",
        material: "Silicon/Copper/Gold interconnects",
        function: "Converts incident starlight photons into analog electrical charge arrays for processing.",
        assemblyOrder: 3,
        connections: ["Primary Sensor Housing", "FEE Board", "Optics Assembly"],
        failureEffect: "Complete loss of star field imaging capability.",
        cascadeFailures: ["Total instrument failure", "Satellite safe-mode trigger"],
        originalPosition: { x: 0, y: -1.9, z: 0 },
        explodedPosition: { x: 18, y: -5, z: 0 }
    });

    // 4. Stray Light Baffle Assembly (Lathe Geometry, hyper detailed)
    const bafflePoints = [];
    // Generating complex internal vanes for the baffle
    for (let i = 0; i < 40; i++) {
        let radiusBase = 4.8 + (i * 0.08);
        let y = 1.5 + (i * 0.35);
        bafflePoints.push(new THREE.Vector2(radiusBase, y));
        // Add a sharp knife-edge vane pointing inward
        bafflePoints.push(new THREE.Vector2(radiusBase - 0.5, y + 0.1));
        bafflePoints.push(new THREE.Vector2(radiusBase, y + 0.2));
    }
    const baffleGeom = new THREE.LatheGeometry(bafflePoints, 128);
    const baffleMesh = new THREE.Mesh(baffleGeom, darkSteel); 
    group.add(baffleMesh);
    meshes.baffle = baffleMesh;

    parts.push({
        name: "Stray Light Rejection Baffle",
        description: "Intricate conical structure with 40 internal razor-sharp knife-edge vanes. Coated in ultra-black carbon nanotubes to absorb 99.99% of off-axis light.",
        material: "Anodized Aluminum / Carbon Nanotube Coating",
        function: "Attenuates stray light by a factor of 10^10, enabling star tracking even when pointing within 25 degrees of the Sun.",
        assemblyOrder: 4,
        connections: ["Primary Sensor Housing", "Lens Assembly Aperture"],
        failureEffect: "Sensor saturation from solar or planetary albedo stray light.",
        cascadeFailures: ["Loss of tracking during significant orbital phases", "Attitude drift"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 18, z: 0 }
    });

    // 5. Optics / Lens Assembly (Multi-element)
    const opticsGroup = new THREE.Group();
    const lensHousingGeom = new THREE.CylinderGeometry(4.4, 4.4, 3.5, 64, 4, false);
    const lensHousingMesh = new THREE.Mesh(lensHousingGeom, steel);
    lensHousingMesh.position.y = 0;
    opticsGroup.add(lensHousingMesh);

    // Primary Lens
    const lens1Geom = new THREE.SphereGeometry(4.2, 64, 64, 0, Math.PI * 2, 0, Math.PI / 4.5);
    const lens1Mesh = new THREE.Mesh(lens1Geom, glass);
    lens1Mesh.position.y = -1.2;
    lens1Mesh.rotation.x = Math.PI;
    opticsGroup.add(lens1Mesh);

    // Secondary Corrector Lens
    const lens2Geom = new THREE.SphereGeometry(3.9, 64, 64, 0, Math.PI * 2, 0, Math.PI / 5);
    const lens2Mesh = new THREE.Mesh(lens2Geom, tinted);
    lens2Mesh.position.y = 1.2;
    opticsGroup.add(lens2Mesh);
    
    group.add(opticsGroup);
    meshes.optics = opticsGroup;

    parts.push({
        name: "Apochromatic Refractive Optics Assembly",
        description: "Six-element highly corrected apochromatic lens system utilizing exotic glasses. Focuses starlight accurately across the entire FPA with zero chromatic aberration and minimal distortion.",
        material: "Fused Silica / Lanthanum Crown Glass / Titanium Housing",
        function: "Forms a perfectly sharp, diffraction-limited image of the star field on the detector.",
        assemblyOrder: 5,
        connections: ["Stray Light Baffle", "FPA & Detector"],
        failureEffect: "Out-of-focus images, severe chromatic aberration, or thermal defocusing.",
        cascadeFailures: ["Centroiding algorithms fail to calculate sub-pixel accuracy", "Attitude noise increases"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -18, y: 5, z: 0 }
    });

    // 6. Active Cooling Radiator System & TEC
    const radiatorGroup = new THREE.Group();
    for (let i = 0; i < 32; i++) {
        const finGeom = new THREE.BoxGeometry(0.15, 5, 2.5);
        const finMesh = new THREE.Mesh(finGeom, aluminum);
        const angle = (i / 32) * Math.PI * 2;
        finMesh.position.x = Math.cos(angle) * 6.2;
        finMesh.position.z = Math.sin(angle) * 6.2;
        finMesh.position.y = -1.5;
        finMesh.rotation.y = -angle;
        radiatorGroup.add(finMesh);
    }
    group.add(radiatorGroup);
    meshes.radiator = radiatorGroup;

    parts.push({
        name: "Thermoelectric Cooler (TEC) & Radiator Array",
        description: "Multi-stage Peltier cooler coupled to a massive 32-fin radial radiator assembly. Dissipates heat generated by the FPA to extreme outer space.",
        material: "High-conductivity Aluminum / Bismuth Telluride",
        function: "Maintains the sensor at optimum cryogenic operating temperatures (-40C) to eliminate dark current noise.",
        assemblyOrder: 6,
        connections: ["Primary Sensor Housing", "FPA Board base"],
        failureEffect: "Detector overheating.",
        cascadeFailures: ["Massive dark current thermal noise", "Loss of dim star tracking capabilities"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 18 }
    });

    // 7. Ammonia Heat Pipes (Complex TubeGeometry routing)
    class PipeCurve extends THREE.Curve {
        constructor(scale = 1, start, end, control1, control2) {
            super();
            this.scale = scale;
            this.start = start;
            this.end = end;
            this.control1 = control1;
            this.control2 = control2;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const temp = new THREE.Vector3();
            // Cubic bezier
            const k0 = (1 - t) * (1 - t) * (1 - t);
            const k1 = 3 * (1 - t) * (1 - t) * t;
            const k2 = 3 * (1 - t) * t * t;
            const k3 = t * t * t;
            temp.x = this.start.x*k0 + this.control1.x*k1 + this.control2.x*k2 + this.end.x*k3;
            temp.y = this.start.y*k0 + this.control1.y*k1 + this.control2.y*k2 + this.end.y*k3;
            temp.z = this.start.z*k0 + this.control1.z*k1 + this.control2.z*k2 + this.end.z*k3;
            return optionalTarget.copy(temp).multiplyScalar(this.scale);
        }
    }

    const pipesGroup = new THREE.Group();
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const start = new THREE.Vector3(Math.cos(angle)*3, -2, Math.sin(angle)*3);
        const end = new THREE.Vector3(Math.cos(angle)*6, -3.5, Math.sin(angle)*6);
        const c1 = new THREE.Vector3(Math.cos(angle)*3, -4, Math.sin(angle)*3);
        const c2 = new THREE.Vector3(Math.cos(angle)*6, 0, Math.sin(angle)*6);
        const path = new PipeCurve(1, start, end, c1, c2);
        const pipeGeom = new THREE.TubeGeometry(path, 32, 0.25, 12, false);
        const pipeMesh = new THREE.Mesh(pipeGeom, copper);
        pipesGroup.add(pipeMesh);
    }
    group.add(pipesGroup);
    meshes.pipes = pipesGroup;

    parts.push({
        name: "Capillary Pumped Loop Heat Pipes",
        description: "Intricate phase-change heat transfer pipes moving thermal energy from the inner electronics core out to the radiator fins. Operates with zero moving parts.",
        material: "Copper matrix / Ammonia working fluid",
        function: "Passive, highly efficient isothermal heat transport.",
        assemblyOrder: 7,
        connections: ["FPA Thermal Block", "Radiator Fins base"],
        failureEffect: "Thermal bottleneck and localized hotspots.",
        cascadeFailures: ["Overheating of localized electronics", "Permanent sensor degradation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -12, y: -12, z: -12 }
    });

    // 8. Electronic Processing Unit (EPU) / DPU Box
    const epuGroup = new THREE.Group();
    const epuGeom = new THREE.BoxGeometry(6, 3.5, 4);
    const epuMesh = new THREE.Mesh(epuGeom, steel);
    epuMesh.position.set(0, -6.75, -4);
    epuGroup.add(epuMesh);
    
    // EPU Cooling Ribs
    for(let i=0; i<10; i++) {
        const epuRib = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.1, 4.2), aluminum);
        epuRib.position.set(0, -5.5 - (i*0.3), -4);
        epuGroup.add(epuRib);
    }
    group.add(epuGroup);
    meshes.epu = epuGroup;

    parts.push({
        name: "Data Processing Unit (DPU) Enclosure",
        description: "Ruggedized, massively shielded compute module. Contains dual-redundant FPGAs, RAM, and the Star Catalog.",
        material: "Radiation-hardened Aluminum and Lead shielding",
        function: "Runs complex image processing: background extraction, star centroiding, catalog pattern matching, and quaternion generation at 10Hz.",
        assemblyOrder: 8,
        connections: ["Kinematic Mount", "Spacecraft Data Bus"],
        failureEffect: "Cannot calculate attitude vectors from raw images.",
        cascadeFailures: ["No orientation data sent to Attitude Control System", "Mission critical failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -20, z: -18 }
    });

    // 9. DPU Connectors & Harness (Torus segments + Cylinders)
    const connectorGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
        const connGeom = new THREE.CylinderGeometry(0.4, 0.4, 0.8, 24);
        const connMesh = new THREE.Mesh(connGeom, chrome);
        connMesh.rotation.x = Math.PI / 2;
        connMesh.position.set(-2 + i * 1.33, -6.75, -6.4);
        connectorGroup.add(connMesh);
        
        // Add cables emerging from connectors
        const cablePath = new THREE.CurvePath();
        const startPt = new THREE.Vector3(-2 + i * 1.33, -6.75, -6.8);
        const endPt = new THREE.Vector3(-2 + i * 1.33, -9, -8);
        const cPt1 = new THREE.Vector3(-2 + i * 1.33, -6.75, -8);
        const curve = new THREE.CubicBezierCurve3(startPt, cPt1, endPt, endPt);
        const cableGeom = new THREE.TubeGeometry(curve, 16, 0.15, 8, false);
        const cableMesh = new THREE.Mesh(cableGeom, rubber);
        connectorGroup.add(cableMesh);
    }
    group.add(connectorGroup);
    meshes.connectors = connectorGroup;

    parts.push({
        name: "MIL-DTL-38999 Connectors & SpaceWire Harness",
        description: "High-reliability aerospace circular connectors tied to heavy shielded SpaceWire cables.",
        material: "Gold-plated beryllium copper contacts, PTFE cabling",
        function: "Provides robust electrical interface for primary power, redundant power, and high-speed telemetry data bus.",
        assemblyOrder: 9,
        connections: ["DPU Enclosure", "Spacecraft Main Bus Harness"],
        failureEffect: "Intermittent power or corrupted data packets.",
        cascadeFailures: ["Complete instrument drop-out from spacecraft telemetry", "False safing events"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -22, z: -25 }
    });

    // 10. Star Catalog Memory Module (Internal PCB)
    const memGeom = new THREE.BoxGeometry(4, 0.1, 2.5);
    const memMat = new THREE.MeshStandardMaterial({ color: 0x004400, metalness: 0.2, roughness: 0.8 });
    const memMesh = new THREE.Mesh(memGeom, memMat);
    memMesh.position.set(0, -5, -4);
    group.add(memMesh);
    meshes.memory = memMesh;

    // Add high-density microchips
    for (let i = 0; i < 12; i++) {
        const chipGeom = new THREE.BoxGeometry(0.5, 0.15, 0.5);
        const chipMesh = new THREE.Mesh(chipGeom, darkSteel);
        chipMesh.position.set(-1.5 + (i%4)*1.0, 0.1, -0.6 + Math.floor(i/4)*0.6);
        memMesh.add(chipMesh);
    }

    parts.push({
        name: "Non-Volatile Star Catalog EEPROM Board",
        description: "Triple-modular redundant (TMR) solid-state memory array. Stores the massive database of over 100,000 reference stars and their exact celestial coordinates.",
        material: "Rad-hard Silicon / FR4 PCB / Conformal Coating",
        function: "Crucial for the 'Lost in Space' algorithm which uses subgraph isomorphism to match observed star triangles against the catalog.",
        assemblyOrder: 10,
        connections: ["DPU Internal Bus Motherboard"],
        failureEffect: "Bit flips corrupting star coordinates.",
        cascadeFailures: ["Star tracker incorrectly calculates attitude", "Spacecraft points in wrong direction"],
        originalPosition: { x: 0, y: -5, z: -4 },
        explodedPosition: { x: 8, y: -15, z: -18 }
    });

    // 11. Baffle Support Struts (Complex truss structures)
    const strutGroup = new THREE.Group();
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const strutGeom = new THREE.CylinderGeometry(0.15, 0.15, 12, 12);
        const strutMesh = new THREE.Mesh(strutGeom, steel);
        
        // Form a rigid triangular truss
        strutMesh.position.x = Math.cos(angle) * 5.2;
        strutMesh.position.z = Math.sin(angle) * 5.2;
        strutMesh.position.y = 8;
        
        strutMesh.rotation.z = Math.sin(angle) * 0.15;
        strutMesh.rotation.x = -Math.cos(angle) * 0.15;
        
        // Cross bracing
        if (i % 2 === 0) {
           strutMesh.rotation.z *= -1;
           strutMesh.rotation.x *= -1;
        }

        strutGroup.add(strutMesh);
    }
    group.add(strutGroup);
    meshes.struts = strutGroup;

    parts.push({
        name: "CFRP Baffle Truss Framework",
        description: "Ultra-rigid truss system ensuring the long optical baffle does not vibrate or undergo thermal expansion deformation during launch or orbit.",
        material: "Carbon Fiber Reinforced Polymer (CFRP) tubes with Titanium end-fittings",
        function: "Extreme vibration dampening and maintaining precise optical alignment under immense G-forces.",
        assemblyOrder: 11,
        connections: ["Kinematic Mount Edge", "Stray Light Baffle Outer Rim"],
        failureEffect: "Baffle harmonic resonance during launch.",
        cascadeFailures: ["Baffle snaps, obstructing optics", "Mission failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 28, z: 0 }
    });

    // 12. Aperture Dust Cover (Motorized)
    const coverGroup = new THREE.Group();
    coverGroup.position.set(0, 15.5, 7.5); // hinges on edge
    
    // Detailed cover with ribs
    const coverGeom = new THREE.CylinderGeometry(8, 8, 0.4, 64);
    const coverMesh = new THREE.Mesh(coverGeom, aluminum);
    coverMesh.position.set(0, 0, -7.5);
    coverGroup.add(coverMesh);
    
    for (let i=0; i<4; i++) {
        const coverRib = new THREE.Mesh(new THREE.BoxGeometry(15, 0.5, 0.5), steel);
        coverRib.position.set(0, 0, -7.5);
        coverRib.rotation.y = (i/4) * Math.PI;
        coverGroup.add(coverRib);
    }
    
    group.add(coverGroup);
    meshes.coverGroup = coverGroup;

    parts.push({
        name: "Deployable Optics Dust Cover",
        description: "Heavy-duty motorized lid protecting the delicate apochromatic optics from dust, rocket exhaust plumes, and outgassing contamination.",
        material: "Aluminum honeycomb core with Teflon coating",
        function: "Contamination prevention during launch, orbit insertion, and nearby thruster firings.",
        assemblyOrder: 12,
        connections: ["Stray Light Baffle rim hinge", "Deployment Actuator"],
        failureEffect: "Hinge cold-welds; fails to open in orbit.",
        cascadeFailures: ["Instrument is permanently blind and utterly useless"],
        originalPosition: { x: 0, y: 15.5, z: 7.5 },
        explodedPosition: { x: 0, y: 40, z: 20 }
    });

    // 13. Dust Cover Actuator Motor & Gearbox
    const motorGroup = new THREE.Group();
    const motorGeom = new THREE.CylinderGeometry(1, 1, 2.5, 32);
    const motorMesh = new THREE.Mesh(motorGeom, darkSteel);
    motorMesh.rotation.z = Math.PI / 2;
    motorMesh.position.set(0, 15.5, 7.5);
    motorGroup.add(motorMesh);
    
    const gearboxGeom = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const gearboxMesh = new THREE.Mesh(gearboxGeom, steel);
    gearboxMesh.position.set(1.8, 15.5, 7.5);
    motorGroup.add(gearboxMesh);
    
    group.add(motorGroup);
    meshes.motor = motorGroup;

    parts.push({
        name: "Cover Actuator & Harmonic Drive Gearbox",
        description: "High-torque, vacuum-rated stepper motor integrated with a zero-backlash harmonic drive gear reduction unit.",
        material: "Stainless Steel / Neodymium Magnets / Copper windings",
        function: "Provides the immense torque required to break launch locks and smoothly swing the dust cover open 270 degrees.",
        assemblyOrder: 13,
        connections: ["Deployable Dust Cover", "DPU Motor Controller"],
        failureEffect: "Motor winding short or gear tooth fracture.",
        cascadeFailures: ["Cover stuck in semi-open position, blocking Field of View"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 12, y: 35, z: 25 }
    });

    // 14. Outer Thermal Blanket (MLI - Multi-Layer Insulation approximation)
    // We'll create a wrinkled looking shell around the central housing and baffle base
    const mliGeom = new THREE.CylinderGeometry(6.3, 6.3, 8, 48, 15, true);
    // Displace vertices significantly for a highly realistic crinkled MLI look
    const posAttribute = mliGeom.attributes.position;
    for (let i = 0; i < posAttribute.count; i++) {
        const x = posAttribute.getX(i);
        const y = posAttribute.getY(i);
        const z = posAttribute.getZ(i);
        // High frequency noise for wrinkles
        const noise = (Math.sin(x*10) * Math.cos(y*15) * Math.sin(z*10)) * 0.15;
        posAttribute.setXYZ(i, x + noise*Math.sign(x), y, z + noise*Math.sign(z));
    }
    mliGeom.computeVertexNormals();
    const mliMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, metalness: 0.9, roughness: 0.3, side: THREE.DoubleSide }); // Crinkled Gold Kapton
    const mliMesh = new THREE.Mesh(mliGeom, mliMat);
    mliMesh.position.y = -0.5;
    group.add(mliMesh);
    meshes.mli = mliMesh;

    parts.push({
        name: "Multi-Layer Insulation (MLI) Blanket",
        description: "25 ultra-thin layers of Aluminized Kapton and Mylar separated by Dacron netting. Carefully tailored to wrap the entire instrument while leaving optics and radiators exposed.",
        material: "Aluminized Kapton / Mylar / Dacron",
        function: "Provides extreme passive thermal isolation, protecting the instrument from massive temperature swings (+150C to -150C) generated by solar radiation in space.",
        assemblyOrder: 14,
        connections: ["Primary Sensor Housing (wrapped around exterior)"],
        failureEffect: "Tears in blanket leading to localized thermal leaks.",
        cascadeFailures: ["Severe thermal gradients across optics", "Boresight thermal drift invalidating factory calibration"],
        originalPosition: { x: 0, y: -0.5, z: 0 },
        explodedPosition: { x: -25, y: -5, z: 0 }
    });

    // 15. Diagnostic LED Panel & Alignment Prism (Glowing/Glass)
    const diagGroup = new THREE.Group();
    const panelGeom = new THREE.BoxGeometry(2.5, 0.8, 0.2);
    const panelMesh = new THREE.Mesh(panelGeom, darkSteel);
    panelMesh.position.set(0, -4.5, -4.2);
    diagGroup.add(panelMesh);

    // Alignment Prism (for optical calibration on ground)
    const prismGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.4, 3);
    const prismMesh = new THREE.Mesh(prismGeom, glass);
    prismMesh.rotation.x = Math.PI / 2;
    prismMesh.position.set(-0.8, -4.5, -4.0);
    diagGroup.add(prismMesh);

    // LEDs
    const ledLights = [];
    for (let i = 0; i < 5; i++) {
        const ledGeom = new THREE.SphereGeometry(0.08, 16, 16);
        const ledMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 2 });
        const ledMesh = new THREE.Mesh(ledGeom, ledMat);
        ledMesh.position.set(-0.1 + i*0.3, -4.5, -4.05);
        diagGroup.add(ledMesh);
        ledLights.push(ledMesh);
    }
    group.add(diagGroup);
    meshes.leds = ledLights;

    parts.push({
        name: "Optical Alignment Cube & Diagnostic Panel",
        description: "Contains a precision optical cube reference mirror for pre-launch theodolite alignment, alongside status LEDs indicating Power, FPA Status, Comm Link, Memory, and Tracking Lock.",
        material: "BK7 Optical Glass Mirror / Aluminum Panel",
        function: "Crucial for ground diagnostics and mapping the instrument's optical axis to the spacecraft's mechanical axes.",
        assemblyOrder: 15,
        connections: ["EPU Box Exterior"],
        failureEffect: "Mirror shifts during integration.",
        cascadeFailures: ["Incorrect alignment matrix loaded into flight software", "Continuous pointing error in orbit"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -12, z: -30 }
    });

    // 16. Fasteners, Safety Wire, & Hydraulic Dampers
    const fastenerGroup = new THREE.Group();
    const rivetGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 12);
    // Base plate fasteners
    for (let i = 0; i < 48; i++) {
        const angle = (i / 48) * Math.PI * 2;
        const rivet = new THREE.Mesh(rivetGeom, chrome);
        rivet.position.set(Math.cos(angle)*7.2, -4.8, Math.sin(angle)*7.2);
        rivet.rotation.x = Math.PI/2;
        fastenerGroup.add(rivet);
    }
    // Baffle ring fasteners
    for (let i = 0; i < 36; i++) {
        const angle = (i / 36) * Math.PI * 2;
        const rivet = new THREE.Mesh(rivetGeom, chrome);
        rivet.position.set(Math.cos(angle)*4.9, 1.4, Math.sin(angle)*4.9);
        fastenerGroup.add(rivet);
    }
    group.add(fastenerGroup);
    meshes.fasteners = fastenerGroup;

    parts.push({
        name: "Precision Locking Fasteners & Safety Wire",
        description: "Hundreds of specialized A286 aerospace bolts. Each is torqued to exact specifications and laced together with stainless steel safety wire to entirely prevent back-out.",
        material: "A286 Stainless Steel / Titanium / Inconel wire",
        function: "Mechanically secures all subassemblies against the violent acoustic and vibrational environment of a rocket launch.",
        assemblyOrder: 16,
        connections: ["All major mechanical junctions"],
        failureEffect: "A single bolt backs out and floats freely in zero-g.",
        cascadeFailures: ["Bolt drifts into optics path causing eclipses", "Structural decoupling causing fatal harmonic resonance"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 35 }
    });

    const quizQuestions = [
        {
            question: "What is the primary function of the Stray Light Baffle and its internal knife-edge vanes?",
            options: [
                "To focus the starlight precisely onto the center of the FPA.",
                "To prevent off-axis bright objects (Sun, Earth, Moon) from entering the optics and saturating the sensor.",
                "To actively cool the electronic processing unit through convection.",
                "To act as a structural mount for the spacecraft body."
            ],
            correctAnswer: 1,
            explanation: "The baffle uses highly light-absorbent coatings and sharp internal vanes to block and absorb stray light bouncing off the walls, ensuring the extremely dim stars can be seen even when very bright objects are nearby in space."
        },
        {
            question: "Why does the Focal Plane Array (FPA) require active cryogenic cooling (via TEC and Radiators)?",
            options: [
                "To prevent the glass lenses from cracking under vacuum.",
                "To drastically reduce thermal dark current noise in the silicon pixels.",
                "To keep the structural supports from expanding.",
                "To power the stepper motor for the dust cover."
            ],
            correctAnswer: 1,
            explanation: "In semiconductor sensors, high temperatures generate spurious thermal electrons (dark current) which introduces heavy noise that can easily obscure dim stars. Cooling the FPA drastically improves the signal-to-noise ratio."
        },
        {
            question: "What happens if the 'Lost in Space' algorithm fails due to a Star Catalog memory error?",
            options: [
                "The tracker uses the Sun as a backup navigation point.",
                "The instrument cannot identify the star pattern and completely fails to determine spacecraft attitude.",
                "The spacecraft's thrusters automatically fire to spin up.",
                "The dust cover automatically closes to reset the sensor."
            ],
            correctAnswer: 1,
            explanation: "The 'Lost in Space' algorithm requires the onboard, non-volatile star catalog memory to match the observed star triangles/polygons against the database. Without it, the tracker simply sees meaningless dots and cannot calculate a quaternion."
        },
        {
            question: "What is the primary heat-transfer mechanism utilized by the Multi-Layer Insulation (MLI)?",
            options: [
                "Conduction through the gold layers.",
                "Convection of trapped air inside the blanket.",
                "Reflecting thermal radiation to isolate the instrument from extreme temperature swings.",
                "Blocking electromagnetic interference from the spacecraft."
            ],
            correctAnswer: 2,
            explanation: "In the vacuum of space, convection is impossible. MLI manages heat transfer entirely by reflecting thermal radiation, keeping the instrument's temperature stable despite the extreme thermal environment."
        },
        {
            question: "Why is the Dust Cover motorized and deployable, rather than just a fixed piece of glass?",
            options: [
                "Glass would alter the optical path, and the cover must protect the optics from physical dust and thruster exhaust contamination during launch.",
                "To close every time the spacecraft passes into Earth's shadow to save power.",
                "To act as a secondary sun-shade.",
                "To adjust the aperture size based on the overall brightness of the star field."
            ],
            correctAnswer: 0,
            explanation: "Optics are incredibly sensitive to contamination from rocket exhaust and outgassing. The solid cover stays closed during the dirty phases of launch and early orbit operations, and opens once it is safe in deep space to begin tracking."
        }
    ];

    let animationTime = 0;
    
    function animate(time, speed, meshesObj) {
        animationTime += speed * 0.01;

        // 1. Dust Cover Opening Animation Sequence
        // Complex opening logic: smoothly opens to 270 degrees
        if (meshesObj.coverGroup && meshesObj.motor) {
            // Oscillate between closed (0) and open (-270 deg / -1.5 PI)
            const targetRotation = (Math.sin(animationTime * 0.4) * 0.5 + 0.5) * (Math.PI * 1.5); 
            meshesObj.coverGroup.rotation.x = -targetRotation;
            
            // Motor gear visual rotation (spins faster due to gear ratio)
            meshesObj.motor.children[0].rotation.y = targetRotation * 50; 
        }

        // 2. High-Tech Blinking Diagnostic LEDs
        if (meshesObj.leds) {
            // Power LED (steady green)
            meshesObj.leds[0].material.emissiveIntensity = 2.5;
            
            // Comms LED (rapid stochastic blink for data packet transfer)
            meshesObj.leds[1].material.emissiveIntensity = Math.random() > 0.3 ? 3 : 0;
            
            // Processing LED (rhythmic calculation blink)
            meshesObj.leds[2].material.emissiveIntensity = (Math.sin(animationTime * 15) > 0) ? 2 : 0.1;
            
            // Memory Read/Write LED (bursts)
            meshesObj.leds[3].material.emissiveIntensity = (Math.sin(animationTime * 8) > 0.5 && Math.random() > 0.5) ? 3 : 0;
            
            // Tracking Lock LED (slow pulse until locked, then steady)
            const lockPhase = Math.sin(animationTime * 0.3);
            if (lockPhase > 0.6) {
                 meshesObj.leds[4].material.color.setHex(0xff0000); // Red: Searching / Lost lock
                 meshesObj.leds[4].material.emissive.setHex(0xff0000);
                 meshesObj.leds[4].material.emissiveIntensity = Math.abs(Math.sin(animationTime * 5)) * 3;
            } else {
                 meshesObj.leds[4].material.color.setHex(0x00ff00); // Green: Solid Lock
                 meshesObj.leds[4].material.emissive.setHex(0x00ff00);
                 meshesObj.leds[4].material.emissiveIntensity = 3;
            }
        }

        // 3. MLI Thermal Breathing / Crinkle Effect
        // Simulates the subtle shifting of the crinkled thermal blanket in vacuum
        if (meshesObj.mli) {
            const scaleOffset = Math.sin(animationTime * 0.5) * 0.003;
            meshesObj.mli.scale.set(1 + scaleOffset, 1 + scaleOffset * 0.2, 1 + scaleOffset);
            // Slowly rotate MLI slightly to show off specular highlights on wrinkles
            meshesObj.mli.rotation.y = Math.sin(animationTime * 0.1) * 0.05;
        }

        // 4. Subtle vibration during motor movement
        if (meshesObj.coverGroup && Math.sin(animationTime * 0.4) > -0.9 && Math.sin(animationTime * 0.4) < 0.9) {
            // When cover is actively moving, add tiny vibration to the base
            const vib = (Math.random() - 0.5) * 0.01;
            meshesObj.base.position.x = vib;
            meshesObj.base.position.z = vib;
        } else if (meshesObj.base) {
            meshesObj.base.position.x = 0;
            meshesObj.base.position.z = 0;
        }
    }

    return { 
        group, 
        parts, 
        description: "Advanced High-Accuracy Autonomous Spacecraft Star Tracker (Autonomous Stellar Compass). Capable of determining absolute spacecraft attitude in 3D space by recognizing stellar constellations with arc-second precision.", 
        quizQuestions, 
        animate, 
        meshes 
    };
}

// Auto-generated missing stub
export function createStarTracker() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
