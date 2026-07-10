import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    const createCylinder = (rTop, rBot, h, rs, hs, mat) => new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, h, rs, hs), mat);
    const createLathe = (points, segs, mat) => new THREE.Mesh(new THREE.LatheGeometry(points, segs), mat);
    const createTorus = (r, t, rs, ts, mat) => new THREE.Mesh(new THREE.TorusGeometry(r, t, rs, ts), mat);

    // Custom Materials
    const fluidA = new THREE.MeshPhysicalMaterial({ color: 0xff0055, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1, ior: 1.33 });
    const fluidB = new THREE.MeshPhysicalMaterial({ color: 0x0055ff, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1, ior: 1.33 });
    const fluidC = new THREE.MeshPhysicalMaterial({ color: 0x55ff00, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1, ior: 1.33 });
    const fluidPHUp = new THREE.MeshPhysicalMaterial({ color: 0xffaaaa, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1, ior: 1.33 });
    const fluidPHDn = new THREE.MeshPhysicalMaterial({ color: 0xaaaaff, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1, ior: 1.33 });
    const screenGlow = new THREE.MeshStandardMaterial({ color: 0x00ffcc, emissive: 0x00ffcc, emissiveIntensity: 2.0, roughness: 0.2 });
    const redGlow = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2.0 });
    const greenGlow = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 2.0 });
    const tankGlass = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.95, opacity: 1, transparent: true, roughness: 0.05, ior: 1.5, thickness: 0.1 });
    const siliconeTube = new THREE.MeshPhysicalMaterial({ color: 0xdddddd, transmission: 0.8, opacity: 1, transparent: true, roughness: 0.2, ior: 1.4 });
    const fluidMixed = new THREE.MeshPhysicalMaterial({ color: 0x88cc88, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1, ior: 1.33 });

    // 1. MAIN SUPPORT FRAME
    const frameGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
        const x = (i % 2 === 0) ? -2 : 2;
        const z = (i < 2) ? -1 : 1;
        const leg = createCylinder(0.1, 0.1, 5, 16, 1, aluminum);
        leg.position.set(x, 2.5, z);
        frameGroup.add(leg);

        const foot = createCylinder(0.15, 0.2, 0.2, 16, 1, rubber);
        foot.position.set(x, 0.1, z);
        frameGroup.add(foot);
    }
    const rails = [-2.5, 0, 2.5];
    rails.forEach(y => {
        const hRail1 = createCylinder(0.08, 0.08, 4, 16, 1, aluminum);
        hRail1.rotation.z = Math.PI / 2;
        hRail1.position.set(0, y + 2.5, -1);
        frameGroup.add(hRail1);

        const hRail2 = createCylinder(0.08, 0.08, 4, 16, 1, aluminum);
        hRail2.rotation.z = Math.PI / 2;
        hRail2.position.set(0, y + 2.5, 1);
        frameGroup.add(hRail2);

        const xRail1 = createCylinder(0.08, 0.08, 2, 16, 1, aluminum);
        xRail1.rotation.x = Math.PI / 2;
        xRail1.position.set(-2, y + 2.5, 0);
        frameGroup.add(xRail1);

        const xRail2 = createCylinder(0.08, 0.08, 2, 16, 1, aluminum);
        xRail2.rotation.x = Math.PI / 2;
        xRail2.position.set(2, y + 2.5, 0);
        frameGroup.add(xRail2);
    });
    const crossBrace = createCylinder(0.05, 0.05, 4.47, 16, 1, darkSteel);
    crossBrace.rotation.z = Math.atan2(5, 4);
    crossBrace.position.set(0, 2.5, -1);
    frameGroup.add(crossBrace);
    group.add(frameGroup);

    parts.push({
        name: "Main Support Frame",
        description: "Anodized aluminum structural framework with anti-vibration rubber mounts.",
        material: "Anodized Aluminum / Rubber",
        function: "Provides rigid support and dampens vibrations from the high-torque peristaltic pumps.",
        assemblyOrder: 1,
        connections: ["All components"],
        failureEffect: "Excessive vibration leading to tubing fatigue and micro-leaks.",
        cascadeFailures: ["Pump misalignment", "Fluid leakages"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 }
    });

    // TANKS
    const tankConfigs = [
        { name: "Nutrient A", mat: fluidA, x: -1.5, z: 0.5 },
        { name: "Nutrient B", mat: fluidB, x: -0.5, z: 0.5 },
        { name: "Nutrient C (Micro)", mat: fluidC, x: 0.5, z: 0.5 },
        { name: "pH UP", mat: fluidPHUp, x: 1.5, z: -0.2 },
        { name: "pH DOWN", mat: fluidPHDn, x: 1.5, z: 0.8 }
    ];

    const generateTankPoints = () => {
        const pts = [];
        pts.push(new THREE.Vector2(0, 0));
        pts.push(new THREE.Vector2(0.3, 0));
        pts.push(new THREE.Vector2(0.4, 0.1));
        pts.push(new THREE.Vector2(0.4, 1.8));
        pts.push(new THREE.Vector2(0.3, 1.9));
        pts.push(new THREE.Vector2(0.15, 1.95));
        pts.push(new THREE.Vector2(0.15, 2.1));
        pts.push(new THREE.Vector2(0.16, 2.15));
        return pts;
    };
    const tankPoints = generateTankPoints();

    tankConfigs.forEach((cfg, idx) => {
        const tGroup = new THREE.Group();
        const tank = createLathe(tankPoints, 32, tankGlass);
        tGroup.add(tank);

        const fluidPts = tankPoints.map(p => new THREE.Vector2(p.x * 0.98, p.y)).slice(0, 5);
        fluidPts.push(new THREE.Vector2(0, 1.8));
        const fluid = createLathe(fluidPts, 32, cfg.mat);
        tGroup.add(fluid);

        const cap = createCylinder(0.18, 0.18, 0.1, 32, 1, plastic);
        cap.position.y = 2.15;
        tGroup.add(cap);
        
        const probe = createCylinder(0.01, 0.01, 2, 8, 1, steel);
        probe.position.set(0.1, 1, 0.1);
        tGroup.add(probe);

        tGroup.position.set(cfg.x, 0.1, cfg.z);
        group.add(tGroup);

        parts.push({
            name: `${cfg.name} Tank`,
            description: `High-capacity borosilicate glass reservoir for ${cfg.name}. Includes internal ultrasonic level sensors.`,
            material: "Borosilicate Glass / HDPE",
            function: `Stores and monitors the volume of ${cfg.name} solution.`,
            assemblyOrder: 2 + idx,
            connections: ["Suction Tubing Network", "Sensor Bus"],
            failureEffect: "Contamination or crystallization of nutrient salts.",
            cascadeFailures: ["Pump blockage", "Nutrient deficiency in crop"],
            originalPosition: { x: cfg.x, y: 0.1, z: cfg.z },
            explodedPosition: { x: cfg.x * 1.5, y: -2, z: cfg.z * 1.5 }
        });
    });

    // PUMPS (Peristaltic)
    const pumpsGroup = new THREE.Group();
    meshes.rotors = [];
    const pumpPositions = [
        { x: -1.5, y: 3.5, z: 0.5 },
        { x: -0.5, y: 3.5, z: 0.5 },
        { x: 0.5, y: 3.5, z: 0.5 },
        { x: 1.5, y: 3.5, z: 0.2 },
        { x: 1.5, y: 3.5, z: 0.8 }
    ];

    pumpPositions.forEach((pos, idx) => {
        const pGroup = new THREE.Group();
        
        const motor = createCylinder(0.15, 0.15, 0.3, 16, 1, darkSteel);
        motor.rotation.x = Math.PI / 2;
        motor.position.z = -0.15;
        pGroup.add(motor);
        
        for(let f = 0; f < 5; f++) {
            const fin = createCylinder(0.16, 0.16, 0.02, 16, 1, aluminum);
            fin.rotation.x = Math.PI / 2;
            fin.position.z = -0.05 - (f * 0.05);
            pGroup.add(fin);
        }

        const head = createCylinder(0.2, 0.2, 0.1, 32, 1, plastic);
        head.rotation.x = Math.PI / 2;
        head.position.z = 0.05;
        pGroup.add(head);
        
        const cover = createCylinder(0.21, 0.21, 0.02, 32, 1, tankGlass);
        cover.rotation.x = Math.PI / 2;
        cover.position.z = 0.11;
        pGroup.add(cover);

        const rotorGroup = new THREE.Group();
        rotorGroup.position.z = 0.05;
        const hub = createCylinder(0.06, 0.06, 0.08, 16, 1, steel);
        hub.rotation.x = Math.PI / 2;
        rotorGroup.add(hub);

        for(let r = 0; r < 3; r++) {
            const angle = (r / 3) * Math.PI * 2;
            const arm = createCylinder(0.02, 0.02, 0.12, 8, 1, aluminum);
            arm.rotation.x = Math.PI / 2;
            arm.rotation.z = angle;
            arm.position.x = Math.cos(angle) * 0.06;
            arm.position.y = Math.sin(angle) * 0.06;
            rotorGroup.add(arm);

            const roller = createCylinder(0.04, 0.04, 0.08, 16, 1, plastic);
            roller.rotation.x = Math.PI / 2;
            roller.position.x = Math.cos(angle) * 0.12;
            roller.position.y = Math.sin(angle) * 0.12;
            rotorGroup.add(roller);
        }
        meshes.rotors.push(rotorGroup);
        pGroup.add(rotorGroup);

        pGroup.position.set(pos.x, pos.y, pos.z);
        pumpsGroup.add(pGroup);

        parts.push({
            name: `Peristaltic Pump ${idx+1}`,
            description: `Precision stepper-motor driven peristaltic pump with planetary roller gears. Capable of micro-dosing to 0.1mL accuracy.`,
            material: "NEMA17 Steel / Delrin / Polycarbonate",
            function: `Pumps exact volumes of solution without fluid contacting mechanical parts.`,
            assemblyOrder: 7 + idx,
            connections: ["Suction Tubing", "Discharge Tubing", "Control Board"],
            failureEffect: "Loss of dosing capability or inaccurate dosing volumes.",
            cascadeFailures: ["Nutrient lockout in plants", "pH imbalance"],
            originalPosition: { x: pos.x, y: pos.y, z: pos.z },
            explodedPosition: { x: pos.x, y: pos.y + 2, z: pos.z + 2 }
        });
    });
    group.add(pumpsGroup);

    // TUBING NETWORK
    class CustomCurve extends THREE.Curve {
        constructor(scale, p1, p2, p3, p4) {
            super();
            this.scale = scale;
            this.p1 = p1; this.p2 = p2; this.p3 = p3; this.p4 = p4;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const v = new THREE.Vector3();
            v.x = Math.pow(1-t, 3)*this.p1.x + 3*Math.pow(1-t, 2)*t*this.p2.x + 3*(1-t)*Math.pow(t, 2)*this.p3.x + Math.pow(t, 3)*this.p4.x;
            v.y = Math.pow(1-t, 3)*this.p1.y + 3*Math.pow(1-t, 2)*t*this.p2.y + 3*(1-t)*Math.pow(t, 2)*this.p3.y + Math.pow(t, 3)*this.p4.y;
            v.z = Math.pow(1-t, 3)*this.p1.z + 3*Math.pow(1-t, 2)*t*this.p2.z + 3*(1-t)*Math.pow(t, 2)*this.p3.z + Math.pow(t, 3)*this.p4.z;
            return optionalTarget.copy(v).multiplyScalar(this.scale);
        }
    }

    const suctionGroup = new THREE.Group();
    const dischargeGroup = new THREE.Group();
    
    pumpPositions.forEach((pos, idx) => {
        const tPos = tankConfigs[idx];
        const p1 = new THREE.Vector3(tPos.x, 2.15, tPos.z);
        const p2 = new THREE.Vector3(tPos.x, 3.0, tPos.z);
        const p3 = new THREE.Vector3(pos.x - 0.2, pos.y - 0.5, pos.z + 0.1);
        const p4 = new THREE.Vector3(pos.x - 0.15, pos.y - 0.1, pos.z + 0.05);

        const sCurve = new CustomCurve(1, p1, p2, p3, p4);
        const sTubeGeom = new THREE.TubeGeometry(sCurve, 64, 0.02, 16, false);
        const sTube = new THREE.Mesh(sTubeGeom, siliconeTube);
        suctionGroup.add(sTube);

        const sFluid = new THREE.Mesh(new THREE.TubeGeometry(sCurve, 64, 0.015, 16, false), tankConfigs[idx].mat);
        suctionGroup.add(sFluid);

        const m1 = new THREE.Vector3(pos.x + 0.15, pos.y - 0.1, pos.z + 0.05);
        const m2 = new THREE.Vector3(pos.x + 0.3, pos.y + 0.5, pos.z + 0.2);
        const m3 = new THREE.Vector3(0, pos.y + 0.8, -0.5);
        const m4 = new THREE.Vector3(0, 4.5, -0.8 + (idx * 0.1));

        const dCurve = new CustomCurve(1, m1, m2, m3, m4);
        const dTubeGeom = new THREE.TubeGeometry(dCurve, 64, 0.02, 16, false);
        const dTube = new THREE.Mesh(dTubeGeom, siliconeTube);
        dischargeGroup.add(dTube);

        const dFluid = new THREE.Mesh(new THREE.TubeGeometry(dCurve, 64, 0.015, 16, false), tankConfigs[idx].mat);
        dischargeGroup.add(dFluid);
    });
    group.add(suctionGroup);
    group.add(dischargeGroup);

    parts.push({
        name: "Suction Tubing Network",
        description: "Medical-grade platinum-cured silicone tubing. Highly resistant to chemical degradation.",
        material: "Silicone Elastomer",
        function: "Transports raw nutrients and pH adjusters from reservoirs to pumps.",
        assemblyOrder: 12,
        connections: ["Tanks", "Pump Inlets"],
        failureEffect: "Air ingress leading to cavitation and inaccurate dosing.",
        cascadeFailures: ["Pump head degradation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 3 }
    });

    parts.push({
        name: "Discharge Tubing Network",
        description: "High-pressure rated micro-tubing. Connects pump outputs to the central mixing manifold.",
        material: "Silicone Elastomer / PTFE",
        function: "Delivers metered doses to the manifold under positive pressure.",
        assemblyOrder: 13,
        connections: ["Pump Outlets", "Manifold"],
        failureEffect: "Tube rupture under pressure.",
        cascadeFailures: ["Chemical spill", "Short circuits"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -3 }
    });

    // MIXING MANIFOLD
    const manifoldGroup = new THREE.Group();
    const chamber = createCylinder(0.15, 0.15, 1.5, 32, 1, glass);
    chamber.rotation.x = Math.PI / 2;
    chamber.position.set(0, 4.5, -0.5);
    manifoldGroup.add(chamber);

    const cap1 = createCylinder(0.18, 0.18, 0.1, 16, 1, aluminum);
    cap1.rotation.x = Math.PI / 2;
    cap1.position.set(0, 4.5, -1.25);
    manifoldGroup.add(cap1);

    const cap2 = createCylinder(0.18, 0.18, 0.1, 16, 1, aluminum);
    cap2.rotation.x = Math.PI / 2;
    cap2.position.set(0, 4.5, 0.25);
    manifoldGroup.add(cap2);

    const mainInlet = createCylinder(0.08, 0.08, 0.5, 16, 1, plastic);
    mainInlet.position.set(0, 4.5, -1.5);
    mainInlet.rotation.x = Math.PI / 2;
    manifoldGroup.add(mainInlet);

    const mainOutlet = createCylinder(0.08, 0.08, 0.5, 16, 1, plastic);
    mainOutlet.position.set(0, 4.5, 0.5);
    mainOutlet.rotation.x = Math.PI / 2;
    manifoldGroup.add(mainOutlet);

    const spiralPts = [];
    for(let i=0; i<=100; i++) {
        const t = i/100;
        const angle = t * Math.PI * 10;
        const r = 0.1;
        spiralPts.push(new THREE.Vector3(Math.cos(angle)*r, t*1.4 - 0.7, Math.sin(angle)*r));
    }
    const spiralCurve = new THREE.CatmullRomCurve3(spiralPts);
    const spiralGeom = new THREE.TubeGeometry(spiralCurve, 200, 0.02, 8, false);
    const spiral = new THREE.Mesh(spiralGeom, plastic);
    spiral.rotation.x = Math.PI / 2;
    spiral.position.set(0, 4.5, -0.5);
    manifoldGroup.add(spiral);

    group.add(manifoldGroup);

    parts.push({
        name: "Hydrodynamic Mixing Manifold",
        description: "Inline blending chamber featuring a helical static mixer to ensure instantaneous homogenization of all inputs.",
        material: "Quartz Glass / 316L Stainless Steel / PTFE",
        function: "Combines raw water with injected nutrients and buffers before dispatching to the root zone.",
        assemblyOrder: 14,
        connections: ["Discharge Tubing", "Main Water Line"],
        failureEffect: "Incomplete mixing leading to localized pH/EC spikes.",
        cascadeFailures: ["Root burn", "Sensor misreadings"],
        originalPosition: { x: 0, y: 4.5, z: -0.5 },
        explodedPosition: { x: 0, y: 7, z: -0.5 }
    });

    // ELECTRICAL CONTROL BOX & LCD
    const elecGroup = new THREE.Group();
    const enclosureShape = new THREE.Shape();
    enclosureShape.moveTo(0, 0);
    enclosureShape.lineTo(1.2, 0);
    enclosureShape.lineTo(1.2, 0.8);
    enclosureShape.lineTo(0, 0.8);
    enclosureShape.lineTo(0, 0);
    const extrudeSettings = { depth: 0.2, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.02, bevelThickness: 0.02 };
    const enclosureGeom = new THREE.ExtrudeGeometry(enclosureShape, extrudeSettings);
    const enclosure = new THREE.Mesh(enclosureGeom, darkSteel);
    enclosure.position.set(-0.6, 5.0, 0.3);
    elecGroup.add(enclosure);

    const screenShape = new THREE.Shape();
    screenShape.moveTo(0,0);
    screenShape.lineTo(1.0, 0);
    screenShape.lineTo(1.0, 0.6);
    screenShape.lineTo(0, 0.6);
    screenShape.lineTo(0,0);
    const screenGeom = new THREE.ExtrudeGeometry(screenShape, { depth: 0.02, bevelEnabled: false });
    const screenMesh = new THREE.Mesh(screenGeom, tinted);
    screenMesh.position.set(-0.5, 5.1, 0.51);
    elecGroup.add(screenMesh);

    meshes.uiLights = [];
    for(let i=0; i<3; i++) {
        const bar = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.05), screenGlow);
        bar.position.set(0, 5.5 - (i*0.15), 0.54);
        elecGroup.add(bar);
        meshes.uiLights.push(bar);
    }
    const statusDot = createCylinder(0.02, 0.02, 0.01, 16, 1, greenGlow);
    statusDot.rotation.x = Math.PI / 2;
    statusDot.position.set(-0.4, 5.6, 0.54);
    elecGroup.add(statusDot);
    meshes.statusDot = statusDot;

    const wireCurve = new CustomCurve(1, 
        new THREE.Vector3(0, 5.0, 0.4),
        new THREE.Vector3(-1.0, 4.5, 0.2),
        new THREE.Vector3(0, 3.8, 0),
        new THREE.Vector3(0, 3.5, -0.2)
    );
    const wireGeom = new THREE.TubeGeometry(wireCurve, 32, 0.04, 12, false);
    const wire = new THREE.Mesh(wireGeom, rubber);
    elecGroup.add(wire);

    group.add(elecGroup);

    parts.push({
        name: "Central Logic Controller & UI",
        description: "Industrial-grade microcontroller unit housed in an IP65 rated enclosure, featuring a capacitive touch TFT display.",
        material: "Powder-coated Steel / Glass / PCB",
        function: "Processes sensor telemetry, executes dosing algorithms, and provides user interface.",
        assemblyOrder: 15,
        connections: ["All Pumps", "Sensors", "Power Supply"],
        failureEffect: "System halt, catastrophic loss of environmental control.",
        cascadeFailures: ["Total crop failure"],
        originalPosition: { x: 0, y: 5.4, z: 0.4 },
        explodedPosition: { x: 0, y: 8, z: 2 }
    });

    // SENSORS
    const sensorGroup = new THREE.Group();
    const probeBody = createCylinder(0.12, 0.12, 0.4, 16, 1, plastic);
    probeBody.rotation.x = Math.PI / 2;
    probeBody.position.set(0, 4.5, 1.0);
    sensorGroup.add(probeBody);

    const probe1 = createCylinder(0.04, 0.04, 0.3, 16, 1, steel);
    probe1.position.set(-0.05, 4.65, 1.0);
    sensorGroup.add(probe1);
    
    const probe2 = createCylinder(0.04, 0.04, 0.3, 16, 1, steel);
    probe2.position.set(0.05, 4.65, 1.0);
    sensorGroup.add(probe2);

    const sWireCurve = new CustomCurve(1,
        new THREE.Vector3(0, 4.8, 1.0),
        new THREE.Vector3(0, 5.0, 0.8),
        new THREE.Vector3(0, 5.2, 0.6),
        new THREE.Vector3(0, 5.2, 0.4)
    );
    const sWire = new THREE.Mesh(new THREE.TubeGeometry(sWireCurve, 32, 0.015, 8, false), rubber);
    sensorGroup.add(sWire);
    
    group.add(sensorGroup);

    parts.push({
        name: "Dual pH & Conductivity Sensor Array",
        description: "High-frequency precision probes continuously measuring electrical conductivity (EC) and potential hydrogen (pH) levels.",
        material: "Titanium / Glass / Epoxy",
        function: "Provides real-time feedback to the logic controller to verify dosing accuracy.",
        assemblyOrder: 16,
        connections: ["Main Water Line", "Logic Controller"],
        failureEffect: "Incorrect readings triggering severe over/under dosing.",
        cascadeFailures: ["Toxic nutrient lockout", "System oscillation"],
        originalPosition: { x: 0, y: 4.5, z: 1.0 },
        explodedPosition: { x: 0, y: 4.5, z: 4.0 }
    });

    const basePlate = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.05, 2.5), aluminum);
    basePlate.position.set(0, 0, 0);
    group.add(basePlate);
    
    parts.push({
        name: "Mounting Plinth",
        description: "Thick machined aluminum base plate with integrated spill containment lips.",
        material: "6061-T6 Aluminum",
        function: "Anchors the entire assembly and contains minor fluid drips.",
        assemblyOrder: 0,
        connections: ["Main Support Frame"],
        failureEffect: "Corrosion if exposed to raw acidic concentrates.",
        cascadeFailures: ["Structural weakening"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -8, z: 0 }
    });

    const detailsGroup = new THREE.Group();
    for (let i=0; i<20; i++) {
        const hex = createCylinder(0.03, 0.03, 0.02, 6, 1, chrome);
        hex.position.set( (Math.random() - 0.5) * 4, 0.025, (Math.random() - 0.5) * 2 );
        detailsGroup.add(hex);
    }
    group.add(detailsGroup);

    meshes.tankLeds = [];
    tankConfigs.forEach((cfg) => {
        const led = createCylinder(0.02, 0.02, 0.02, 8, 1, new THREE.MeshStandardMaterial({ color: 0x00aaff, emissive: 0x00aaff, emissiveIntensity: 1 }));
        led.position.set(cfg.x, 2.2, cfg.z + 0.15);
        led.rotation.x = Math.PI / 2;
        group.add(led);
        meshes.tankLeds.push(led);
    });

    const description = "The Automated Hydroponic Nutrient Doser is a highly complex, multi-stage injection system designed for precision agriculture. Utilizing aerospace-grade stepper motors, planetary peristaltic pumps, and hydrodynamic mixing manifolds, this machine ensures perfectly balanced nutrient and pH levels. Real-time telemetry via dual inline probes guarantees strict adherence to complex feeding regimens without human intervention.";

    const quizQuestions = [
        {
            question: "What prevents the concentrated acidic and basic solutions from destroying the pump mechanics?",
            options: [
                "Peristaltic action ensures fluids only touch the silicone tubing.",
                "The pump heads are made of titanium.",
                "The fluids are diluted before reaching the pump.",
                "Magnetic impellers hover in a vacuum."
            ],
            answer: 0,
            explanation: "Peristaltic pumps work by squeezing a flexible tube, meaning the fluid never touches the mechanical gears or motor, preventing corrosion and contamination."
        },
        {
            question: "Why is a helical static mixer used in the hydrodynamic manifold?",
            options: [
                "To instantly homogenize the injected nutrients with the main water line.",
                "To filter out large particulates.",
                "To reduce the water pressure before it hits the roots.",
                "To cool the liquid down via heat exchange."
            ],
            answer: 0,
            explanation: "The helical static mixer induces severe turbulence and vortexes within the flow, forcing immediate and thorough mixing of the concentrated nutrients with the carrier water."
        },
        {
            question: "What is the primary risk if the Dual pH & Conductivity Sensor Array fails?",
            options: [
                "The system will rapidly overdose or underdose, causing toxic conditions or starvation.",
                "The water will stop flowing completely.",
                "The stepper motors will overheat and catch fire.",
                "The silicone tubing will rupture due to overpressure."
            ],
            answer: 0,
            explanation: "The logic controller relies entirely on these sensors to know when to stop dosing. A failed sensor providing false 'low' readings would cause the pumps to continuously inject fatal amounts of fertilizer or acid."
        },
        {
            question: "What is the purpose of the anti-vibration rubber mounts on the main frame?",
            options: [
                "To dampen the high-torque vibrations from the stepper motors, preventing tube fatigue.",
                "To electrically ground the machine.",
                "To allow the machine to float if the greenhouse floods.",
                "To weigh the machine down."
            ],
            answer: 0,
            explanation: "Stepper motors generate high-frequency micro-vibrations. Over time, these can loosen fittings or fatigue tubing. The rubber mounts absorb this kinetic energy."
        },
        {
            question: "Why are separate tanks used for 'Nutrient A' and 'Nutrient B'?",
            options: [
                "Because mixing them in concentrated form causes calcium and sulfates to precipitate into insoluble gypsum.",
                "Because one is for daytime and one is for nighttime.",
                "Because the pumps can only handle one color of fluid at a time.",
                "To make the machine look more complicated and expensive."
            ],
            answer: 0,
            explanation: "In hydroponics, calcium nitrate (Part A) and magnesium sulfate/phosphates (Part B) will chemically react if mixed at high concentrations, forming an insoluble precipitate that cannot be absorbed by plants."
        }
    ];

    function animate(time, speed, activeMeshes) {
        const t = time * speed;
        
        if (meshes.rotors) {
            meshes.rotors.forEach((rotor, idx) => {
                const phase = Math.sin(t * 2 + idx);
                if (phase > 0) {
                    rotor.rotation.z += 0.1 * speed;
                    meshes.tankLeds[idx].material.emissiveIntensity = 2.0;
                } else {
                    meshes.tankLeds[idx].material.emissiveIntensity = 0.2;
                }
            });
        }

        if (meshes.uiLights) {
            meshes.uiLights.forEach((light, i) => {
                light.scale.x = 0.5 + 0.5 * Math.abs(Math.sin(t * 5 + i));
            });
        }
        
        if (meshes.statusDot) {
            meshes.statusDot.material.emissiveIntensity = (Math.sin(t * 10) > 0) ? 2 : 0;
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createHydroponicDoser() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
