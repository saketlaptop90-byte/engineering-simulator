import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // 1. Discharge Chamber (Main Body) - LatheGeometry
    const chamberPoints = [];
    for (let i = 0; i <= 20; i++) {
        chamberPoints.push(new THREE.Vector2(
            2.5 + Math.sin(i * 0.1) * 0.2,
            (i - 10) * 0.4
        ));
    }
    const chamberGeo = new THREE.LatheGeometry(chamberPoints, 64);
    const chamberMesh = new THREE.Mesh(chamberGeo, steel);
    chamberMesh.rotation.x = Math.PI / 2;
    group.add(chamberMesh);
    meshes.chamber = chamberMesh;
    parts.push({
        name: "Discharge Chamber",
        description: "Contains the xenon plasma during ionization. The chamber walls are lined with magnetic rings.",
        material: "steel",
        function: "Contains plasma",
        assemblyOrder: 1,
        connections: ["Magnetic Rings", "Ion Optics", "Propellant Feed"],
        failureEffect: "Plasma leakage, loss of thrust.",
        cascadeFailures: ["Thermal runaway", "Thrust loss"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 0}
    });

    // 2. Magnetic Rings (Multipole magnets)
    const magnetGroup = new THREE.Group();
    for (let i = 0; i < 8; i++) {
        const ringGeo = new THREE.TorusGeometry(2.6, 0.15, 16, 64);
        const ringMesh = new THREE.Mesh(ringGeo, darkSteel);
        ringMesh.position.z = (i - 3.5) * 0.6;
        magnetGroup.add(ringMesh);
    }
    group.add(magnetGroup);
    meshes.magnets = magnetGroup;
    parts.push({
        name: "Magnetic Confinement Rings",
        description: "Produces a multipole magnetic field to confine electrons and increase ionization efficiency.",
        material: "darkSteel",
        function: "Confines electrons",
        assemblyOrder: 2,
        connections: ["Discharge Chamber"],
        failureEffect: "Poor ionization, high wall erosion.",
        cascadeFailures: ["Rapid wall failure"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 5, z: 0}
    });

    // 3. Ion Optics (Grid assembly)
    const opticsGroup = new THREE.Group();
    
    // Screen Grid
    const gridGeo = new THREE.CylinderGeometry(2.4, 2.4, 0.05, 64);
    const screenGrid = new THREE.Mesh(gridGeo, chrome);
    screenGrid.position.z = 2.0;
    screenGrid.rotation.x = Math.PI / 2;
    opticsGroup.add(screenGrid);
    
    // Accelerator Grid
    const accGrid = new THREE.Mesh(gridGeo, darkSteel);
    accGrid.position.z = 2.15;
    accGrid.rotation.x = Math.PI / 2;
    opticsGroup.add(accGrid);
    
    // Grid mounting ring
    const mountGeo = new THREE.TorusGeometry(2.45, 0.2, 32, 64);
    const mountMesh = new THREE.Mesh(mountGeo, aluminum);
    mountMesh.position.z = 2.075;
    opticsGroup.add(mountMesh);

    group.add(opticsGroup);
    meshes.optics = opticsGroup;
    parts.push({
        name: "Ion Optics Grid System",
        description: "High-voltage grid assembly (screen and accelerator grids) that extracts and accelerates ions.",
        material: "chrome",
        function: "Accelerates ions",
        assemblyOrder: 3,
        connections: ["Discharge Chamber"],
        failureEffect: "Grid shorting, complete loss of thrust.",
        cascadeFailures: ["Power Processing Unit overload"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 5}
    });

    // 4. Hollow Cathode Neutralizer
    const neutralizerGroup = new THREE.Group();
    const neutBodyGeo = new THREE.CylinderGeometry(0.15, 0.15, 1.2, 32);
    const neutBody = new THREE.Mesh(neutBodyGeo, copper);
    neutBody.position.set(3.0, 0, 2.5);
    neutBody.rotation.x = Math.PI / 2;
    neutBody.rotation.y = -Math.PI / 6;
    neutralizerGroup.add(neutBody);

    const neutTipGeo = new THREE.ConeGeometry(0.15, 0.3, 32);
    const neutTip = new THREE.Mesh(neutTipGeo, chrome);
    neutTip.position.set(3.0, 0, 3.1);
    neutTip.rotation.x = Math.PI / 2;
    neutTip.rotation.y = -Math.PI / 6;
    neutralizerGroup.add(neutTip);
    
    group.add(neutralizerGroup);
    meshes.neutralizer = neutralizerGroup;
    parts.push({
        name: "Hollow Cathode Neutralizer",
        description: "Emits electrons into the ion plume to neutralize it, preventing the spacecraft from building a negative charge.",
        material: "copper",
        function: "Neutralizes ion beam",
        assemblyOrder: 4,
        connections: ["Discharge Chamber exterior"],
        failureEffect: "Spacecraft charging, beam stalling.",
        cascadeFailures: ["Complete spacecraft electrical failure"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 3, y: 0, z: 2}
    });
    
    // 5. Plume (Ion Beam)
    const plumeGroup = new THREE.Group();
    const plumeMat = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0044ff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const plumeCoreMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x00aaff,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const plumeGeo = new THREE.ConeGeometry(3.5, 12, 64, 1, true);
    const plumeMesh = new THREE.Mesh(plumeGeo, plumeMat);
    plumeMesh.position.z = 8.15;
    plumeMesh.rotation.x = -Math.PI / 2;
    plumeGroup.add(plumeMesh);

    const plumeCoreGeo = new THREE.CylinderGeometry(2.0, 2.8, 8, 32, 1, true);
    const plumeCore = new THREE.Mesh(plumeCoreGeo, plumeCoreMat);
    plumeCore.position.z = 6.15;
    plumeCore.rotation.x = -Math.PI / 2;
    plumeGroup.add(plumeCore);

    // Particle-like rings in the plume
    const plumeRings = [];
    for(let i=0; i<15; i++) {
        const rGeo = new THREE.TorusGeometry(2.0 + (i*0.1), 0.05, 8, 32);
        const rMesh = new THREE.Mesh(rGeo, plumeCoreMat);
        rMesh.position.z = 2.5 + (i * 0.6);
        plumeRings.push(rMesh);
        plumeGroup.add(rMesh);
    }
    meshes.plumeRings = plumeRings;

    group.add(plumeGroup);
    meshes.plume = plumeGroup;
    parts.push({
        name: "Ion Plume",
        description: "High-velocity stream of xenon ions producing thrust. Emits a characteristic blue glow.",
        material: "glowing",
        function: "Provides thrust",
        assemblyOrder: 5,
        connections: ["Ion Optics"],
        failureEffect: "N/A",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 10}
    });

    // 6. Xenon Feed Lines (Hydraulic/Pneumatic complex pipes)
    const feedLineGroup = new THREE.Group();
    class CustomCurve extends THREE.Curve {
        constructor(scale = 1) {
            super();
            this.scale = scale;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const tx = Math.cos(t * Math.PI * 1.5) * 1.5;
            const ty = Math.sin(t * Math.PI * 1.5) * 1.5;
            const tz = -3.0 + t * 4.0;
            return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
        }
    }
    const path1 = new CustomCurve(1);
    const tubeGeo1 = new THREE.TubeGeometry(path1, 64, 0.08, 16, false);
    const tubeMesh1 = new THREE.Mesh(tubeGeo1, copper);
    feedLineGroup.add(tubeMesh1);
    
    // Add multiple complex feed lines
    for(let i=0; i<4; i++) {
        const points = [];
        for(let j=0; j<=10; j++) {
            points.push(new THREE.Vector3(
                (Math.random() - 0.5) * 2 + Math.cos(i*Math.PI/2)*1.8,
                (Math.random() - 0.5) * 2 + Math.sin(i*Math.PI/2)*1.8,
                -4 + j*0.5
            ));
        }
        const curve = new THREE.CatmullRomCurve3(points);
        const tbGeo = new THREE.TubeGeometry(curve, 64, 0.05, 12, false);
        const tb = new THREE.Mesh(tbGeo, aluminum);
        feedLineGroup.add(tb);
    }

    group.add(feedLineGroup);
    meshes.feedLines = feedLineGroup;
    parts.push({
        name: "Xenon Feed Lines",
        description: "Pipes delivering highly pressurized xenon gas into the discharge chamber.",
        material: "copper",
        function: "Propellant delivery",
        assemblyOrder: 6,
        connections: ["Discharge Chamber", "Xenon Tank"],
        failureEffect: "Propellant leak, fuel exhaustion.",
        cascadeFailures: ["Loss of mission"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -2, y: 2, z: -2}
    });

    // 7. Power Processing Unit (PPU)
    const ppuGroup = new THREE.Group();
    
    const ppuShape = new THREE.Shape();
    ppuShape.moveTo(-2, -2);
    ppuShape.lineTo(2, -2);
    ppuShape.lineTo(2, 2);
    ppuShape.lineTo(1.5, 2.5);
    ppuShape.lineTo(-1.5, 2.5);
    ppuShape.lineTo(-2, 2);
    ppuShape.lineTo(-2, -2);
    
    const extrudeSettings = { depth: 3, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };
    const ppuGeo = new THREE.ExtrudeGeometry(ppuShape, extrudeSettings);
    const ppuMesh = new THREE.Mesh(ppuGeo, steel);
    ppuMesh.position.set(0, 4.5, -1.5);
    ppuGroup.add(ppuMesh);
    
    // Add glowing heat sinks on PPU
    const sinkGeo = new THREE.BoxGeometry(3.5, 0.2, 2.5);
    for(let i=0; i<5; i++) {
        const sink = new THREE.Mesh(sinkGeo, darkSteel);
        sink.position.set(0, 6.0 + i*0.3, 0);
        ppuGroup.add(sink);
    }
    
    // LED Indicators on PPU
    const ledMat = new THREE.MeshStandardMaterial({color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 2});
    const ledGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const leds = [];
    for(let i=0; i<4; i++) {
        const led = new THREE.Mesh(ledGeo, ledMat);
        led.position.set(-1.5 + i*0.4, 4.5, 1.6);
        leds.push(led);
        ppuGroup.add(led);
    }
    meshes.ppuLeds = leds;

    group.add(ppuGroup);
    meshes.ppu = ppuGroup;
    parts.push({
        name: "Power Processing Unit (PPU)",
        description: "Converts solar array power to the various high voltages required by the thruster.",
        material: "steel",
        function: "Power conditioning",
        assemblyOrder: 7,
        connections: ["Ion Optics", "Discharge Chamber"],
        failureEffect: "Total thruster shutdown.",
        cascadeFailures: ["Loss of propulsion"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 8, z: 0}
    });

    // 8. Main Wiring Harness
    const harnessGroup = new THREE.Group();
    const harnessCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 4.5, 1.5),
        new THREE.Vector3(1, 3.5, 1.0),
        new THREE.Vector3(2.5, 2.0, 0),
        new THREE.Vector3(2.7, 0, 1.0)
    ]);
    const harnessGeo = new THREE.TubeGeometry(harnessCurve, 64, 0.15, 16, false);
    const harness = new THREE.Mesh(harnessGeo, rubber);
    harnessGroup.add(harness);

    // smaller wires
    for(let i=0; i<5; i++) {
        const wCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 4.5, -1.0 + i*0.5),
            new THREE.Vector3(-1.5, 3.0, -1.0 + i*0.5),
            new THREE.Vector3(-2.6, 0, -1.0 + i*0.5)
        ]);
        const wGeo = new THREE.TubeGeometry(wCurve, 32, 0.04, 8, false);
        const wMat = i%2==0 ? new THREE.MeshStandardMaterial({color:0xff0000}) : new THREE.MeshStandardMaterial({color:0x0000ff});
        const w = new THREE.Mesh(wGeo, wMat);
        harnessGroup.add(w);
    }

    group.add(harnessGroup);
    meshes.harness = harnessGroup;
    parts.push({
        name: "High Voltage Wiring Harness",
        description: "Thick insulated cables delivering high-tension power from the PPU to the grids.",
        material: "rubber",
        function: "Power transmission",
        assemblyOrder: 8,
        connections: ["PPU", "Ion Optics"],
        failureEffect: "Arcing, electrical shorts.",
        cascadeFailures: ["PPU destruction"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -3, y: 0, z: 0}
    });

    // 9. Backplate / Propellant Injector Array
    const backplateGroup = new THREE.Group();
    const bpGeo = new THREE.CylinderGeometry(2.4, 2.4, 0.2, 64);
    const backplate = new THREE.Mesh(bpGeo, aluminum);
    backplate.rotation.x = Math.PI/2;
    backplate.position.z = -2.5;
    backplateGroup.add(backplate);
    
    // Injector nozzles
    const injGeo = new THREE.ConeGeometry(0.08, 0.2, 16);
    for(let r=0.5; r<2.2; r+=0.5) {
        const count = Math.floor(r * 6);
        for(let i=0; i<count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const inj = new THREE.Mesh(injGeo, chrome);
            inj.position.set(Math.cos(angle)*r, Math.sin(angle)*r, -2.35);
            inj.rotation.x = Math.PI/2;
            backplateGroup.add(inj);
        }
    }
    
    group.add(backplateGroup);
    meshes.backplate = backplateGroup;
    parts.push({
        name: "Propellant Injector Backplate",
        description: "Distributes xenon gas evenly into the discharge chamber.",
        material: "aluminum",
        function: "Gas distribution",
        assemblyOrder: 9,
        connections: ["Discharge Chamber", "Xenon Feed Lines"],
        failureEffect: "Uneven plasma distribution, reduced efficiency.",
        cascadeFailures: ["Hot spots, premature wear"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: -4}
    });

    // 10. Thermal Radiator Fins (Side)
    const radGroup = new THREE.Group();
    const finGeo = new THREE.BoxGeometry(0.1, 4.0, 4.0);
    for(let i=0; i<8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const fin = new THREE.Mesh(finGeo, aluminum);
        fin.position.set(Math.cos(angle)*3.2, Math.sin(angle)*3.2, -0.5);
        fin.rotation.z = angle;
        radGroup.add(fin);
    }
    group.add(radGroup);
    meshes.radiators = radGroup;
    parts.push({
        name: "Thermal Radiators",
        description: "Dissipates excess heat generated by the plasma and magnetic coils.",
        material: "aluminum",
        function: "Heat dissipation",
        assemblyOrder: 10,
        connections: ["Discharge Chamber"],
        failureEffect: "Overheating.",
        cascadeFailures: ["Magnet demagnetization", "Structural warping"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -5, z: 0}
    });

    // 11. Gimbal Mounting Bracket
    const gimbalGroup = new THREE.Group();
    const bracketShape = new THREE.Shape();
    bracketShape.absarc(0, 0, 3.8, 0, Math.PI, true);
    bracketShape.lineTo(-4.2, 0);
    bracketShape.absarc(0, 0, 4.2, Math.PI, 0, false);
    bracketShape.lineTo(3.8, 0);
    
    const brGeo = new THREE.ExtrudeGeometry(bracketShape, {depth: 0.5, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.05, bevelThickness: 0.05});
    const bracket = new THREE.Mesh(brGeo, steel);
    bracket.position.z = -1.0;
    gimbalGroup.add(bracket);
    
    // Actuators
    const actGeo = new THREE.CylinderGeometry(0.2, 0.2, 2.0, 32);
    const actuator1 = new THREE.Mesh(actGeo, chrome);
    actuator1.position.set(-4.0, -1.0, -0.75);
    actuator1.rotation.x = Math.PI/2;
    gimbalGroup.add(actuator1);
    
    const actuator2 = new THREE.Mesh(actGeo, chrome);
    actuator2.position.set(4.0, -1.0, -0.75);
    actuator2.rotation.x = Math.PI/2;
    gimbalGroup.add(actuator2);

    group.add(gimbalGroup);
    meshes.gimbal = gimbalGroup;
    parts.push({
        name: "Thrust Vector Control Gimbal",
        description: "Allows the entire thruster to pivot, directing the thrust vector for spacecraft attitude control.",
        material: "steel",
        function: "Thrust vectoring",
        assemblyOrder: 11,
        connections: ["Spacecraft Bus", "Discharge Chamber"],
        failureEffect: "Inability to steer.",
        cascadeFailures: ["Loss of trajectory control"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -6, y: 0, z: 0}
    });

    // 12. Xenon Storage Tank
    const tankGroup = new THREE.Group();
    const tankGeo = new THREE.SphereGeometry(1.8, 64, 64);
    const tank = new THREE.Mesh(tankGeo, darkSteel);
    tank.scale.set(1, 1, 1.2);
    tank.position.set(0, -5, -4);
    tankGroup.add(tank);
    
    // Tank banding
    const bandGeo = new THREE.TorusGeometry(1.82, 0.05, 16, 64);
    const band1 = new THREE.Mesh(bandGeo, aluminum);
    band1.rotation.x = Math.PI/2;
    band1.position.set(0, -5, -4);
    tankGroup.add(band1);
    
    const band2 = new THREE.Mesh(bandGeo, aluminum);
    band2.rotation.y = Math.PI/2;
    band2.position.set(0, -5, -4);
    tankGroup.add(band2);

    group.add(tankGroup);
    meshes.tank = tankGroup;
    parts.push({
        name: "Xenon Storage Tank",
        description: "High-pressure composite overwrapped pressure vessel containing supercritical xenon.",
        material: "darkSteel",
        function: "Propellant storage",
        assemblyOrder: 12,
        connections: ["Xenon Feed Lines"],
        failureEffect: "Rupture, rapid loss of fuel.",
        cascadeFailures: ["Explosion", "Mission end"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -8, z: -8}
    });

    // 13. Hollow Cathode Electron Emitter (Internal)
    const hcGroup = new THREE.Group();
    const hcGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 32);
    const hcMesh = new THREE.Mesh(hcGeo, chrome);
    hcMesh.position.set(0, 0, -1.5);
    hcMesh.rotation.x = Math.PI/2;
    hcGroup.add(hcMesh);
    
    // Plasma glow internal
    const hcGlowMat = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xff5500,
        emissiveIntensity: 3.0,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    const hcGlowGeo = new THREE.SphereGeometry(0.3, 32, 32);
    const hcGlow = new THREE.Mesh(hcGlowGeo, hcGlowMat);
    hcGlow.position.set(0,0,-0.7);
    hcGroup.add(hcGlow);
    meshes.hcGlow = hcGlow;

    group.add(hcGroup);
    meshes.hollowCathode = hcGroup;
    parts.push({
        name: "Discharge Cathode",
        description: "Primary electron source inside the chamber to initiate xenon ionization.",
        material: "chrome",
        function: "Electron emission",
        assemblyOrder: 13,
        connections: ["Backplate"],
        failureEffect: "Failure to ignite plasma.",
        cascadeFailures: ["Complete thrust loss"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: -6}
    });

    // 14. Anode Wall Liner
    const linerGeo = new THREE.CylinderGeometry(2.45, 2.45, 4.0, 64, 1, true);
    const linerMat = new THREE.MeshStandardMaterial({color: 0x333333, metalness: 0.8, roughness: 0.5, side: THREE.DoubleSide});
    const liner = new THREE.Mesh(linerGeo, linerMat);
    liner.rotation.x = Math.PI/2;
    liner.position.z = -0.5;
    group.add(liner);
    meshes.liner = liner;
    parts.push({
        name: "Anode Wall Liner",
        description: "Serves as the positive electrode in the discharge chamber, collecting electrons after they have ionized xenon.",
        material: "custom",
        function: "Anode collection",
        assemblyOrder: 14,
        connections: ["Discharge Chamber inner wall"],
        failureEffect: "Reduced ionization efficiency.",
        cascadeFailures: ["Sputtering damage to walls"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 5, y: 0, z: 0}
    });

    // 15. Diagnostics Sensors Array
    const sensorGroup = new THREE.Group();
    const sBaseGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const sProbeGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.8, 16);
    for(let i=0; i<3; i++) {
        const s = new THREE.Group();
        const b = new THREE.Mesh(sBaseGeo, glass);
        const p = new THREE.Mesh(sProbeGeo, copper);
        p.position.y = 0.4;
        s.add(b);
        s.add(p);
        s.position.set(2.8 * Math.cos(i*2.1), 2.8 * Math.sin(i*2.1), -1.0);
        s.rotation.z = i*2.1;
        sensorGroup.add(s);
    }
    group.add(sensorGroup);
    meshes.sensors = sensorGroup;
    parts.push({
        name: "Diagnostic Sensor Array",
        description: "Langmuir probes and thermocouples to monitor plasma density, temperature, and grid erosion rates.",
        material: "glass/copper",
        function: "Telemetry monitoring",
        assemblyOrder: 15,
        connections: ["Discharge Chamber", "Wiring Harness"],
        failureEffect: "Loss of telemetry.",
        cascadeFailures: ["Unnoticed erosion", "Catastrophic failure"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 4, y: 4, z: -2}
    });

    // Animations variables
    const clock = new THREE.Clock();

    const animate = (time, speed, meshesObj = meshes) => {
        const t = time * speed;
        
        // Pulse PPU LEDs
        if(meshesObj.ppuLeds) {
            meshesObj.ppuLeds.forEach((led, i) => {
                led.material.emissiveIntensity = 1.0 + Math.sin(t * 10 + i) * 0.8;
            });
        }
        
        // Pulse Cathode Glow
        if(meshesObj.hcGlow) {
            meshesObj.hcGlow.material.emissiveIntensity = 2.0 + Math.sin(t * 25) * 1.5;
            meshesObj.hcGlow.scale.setScalar(1.0 + Math.sin(t * 30)*0.1);
        }

        // Animate Plume Rings
        if(meshesObj.plumeRings) {
            meshesObj.plumeRings.forEach((ring, i) => {
                // Move rings outward
                ring.position.z += 0.5 * speed;
                if (ring.position.z > 14) {
                    ring.position.z = 2.5;
                    ring.scale.setScalar(1.0);
                }
                const progress = (ring.position.z - 2.5) / 11.5;
                const scale = 1.0 + progress * 2.0;
                ring.scale.setScalar(scale);
                ring.material.opacity = 1.0 - progress;
            });
        }

        // Subtle Gimbal rotation to simulate vectoring
        if(meshesObj.gimbal) {
            meshesObj.gimbal.rotation.y = Math.sin(t * 0.5) * 0.05;
            meshesObj.gimbal.rotation.x = Math.cos(t * 0.4) * 0.05;
        }

        // Entire group gentle vibration based on thrust
        group.position.x = Math.sin(t * 50) * 0.005;
        group.position.y = Math.cos(t * 43) * 0.005;
    };

    const description = "The highly advanced Deep Space Ion Thruster. Utilizing electrostatic acceleration, it ionizes xenon gas and accelerates it through a high-voltage grid array to produce continuous, hyper-efficient thrust. Features include intricate magnetic confinement rings, a neutralizing hollow cathode, complex PPU electronics, and animated plasma plumes.";

    const quizQuestions = [
        {
            question: "What is the function of the Magnetic Confinement Rings?",
            options: [
                "To accelerate ions",
                "To cool the chamber",
                "To produce a multipole field confining electrons",
                "To store xenon gas"
            ],
            correctAnswer: 2,
            explanation: "The magnetic rings produce a multipole magnetic field along the chamber walls, bouncing electrons back into the plasma to increase the chance of them colliding with and ionizing neutral xenon atoms."
        },
        {
            question: "Why is a Hollow Cathode Neutralizer required?",
            options: [
                "To inject xenon into the chamber",
                "To emit electrons into the ion plume to prevent spacecraft charging",
                "To power the PPU",
                "To steer the thrust vector"
            ],
            correctAnswer: 1,
            explanation: "Because the thruster emits positively charged ions, the spacecraft would quickly build up a massive negative charge. The neutralizer emits electrons into the exhaust plume to maintain electrical neutrality."
        },
        {
            question: "What happens if the Ion Optics Grid System shorts out?",
            options: [
                "Thrust increases",
                "Plasma changes color",
                "Complete loss of thrust and potential PPU overload",
                "The neutralizer stops working"
            ],
            correctAnswer: 2,
            explanation: "A grid short (often caused by sputtering/erosion flakes bridging the microscopic gap between grids) prevents the high voltage field from forming, stopping ion acceleration entirely and causing massive current spikes in the Power Processing Unit."
        },
        {
            question: "What is the primary role of the Power Processing Unit (PPU)?",
            options: [
                "To store xenon",
                "To convert solar array power into high voltages for the grids and discharge chamber",
                "To vector the thrust",
                "To cool the magnetic rings"
            ],
            correctAnswer: 1,
            explanation: "The PPU takes raw, fluctuating power from the solar arrays and converts it into the heavily regulated, very high voltages (often >1000V) required by the accelerator grids and discharge cathode."
        },
        {
            question: "How does the Discharge Cathode function within the thruster?",
            options: [
                "It accelerates the spacecraft",
                "It absorbs stray ions",
                "It serves as the primary electron source to initiate xenon ionization",
                "It acts as a structural support"
            ],
            correctAnswer: 2,
            explanation: "The discharge cathode (located inside the chamber) emits the initial stream of high-energy electrons that collide with neutral xenon gas atoms, knocking off outer electrons and creating the positively charged xenon plasma."
        }
    ];

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createIonThruster() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
