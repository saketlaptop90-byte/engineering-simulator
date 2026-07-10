import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Core Materials
    const jdGreen = new THREE.MeshStandardMaterial({ color: 0xcc0000, metalness: 0.5, roughness: 0.3 });
    const castIron = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8, metalness: 0.7 });
    const brass = new THREE.MeshStandardMaterial({ color: 0xb5a642, roughness: 0.4, metalness: 0.8 });
    const redPaint = new THREE.MeshStandardMaterial({ color: 0xcc0000, metalness: 0.3, roughness: 0.5 });
    
    // Physics State
    group.userData.state = {
        throttle: 0.0,
        rpm: 800,
        electricity: 1.0,
        heat: 0.0
    };
    group.userData.animatedMeshes = {};

    // 1. Engine System
    function buildEngineSystem() {
        const sys = new THREE.Group();
        sys.position.set(0, 1.8, 1.0);
        
        // Engine Block
        const blockGeo = new THREE.BoxGeometry(1.0, 1.2, 1.8);
        const block = new THREE.Mesh(blockGeo, castIron);
        sys.add(block);
        parts.push({ mesh: block, name: "Engine Block", description: "Main casing containing cylinders.", function: "Housing for internal combustion."});
        
        // Cylinders & Pistons
        for(let i=0; i<4; i++) {
            const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.4), aluminum);
            cyl.position.set(0, 0.3, -0.45 + (i*0.3));
            sys.add(cyl);
            group.userData.animatedMeshes[`piston_${i}`] = cyl;
            parts.push({ mesh: cyl, name: `Piston ${i+1}`, description: "Reciprocating engine piston.", function: "Compresses fuel/air mixture."});
        }
        
        // Crankshaft
        const crank = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.4).rotateX(Math.PI/2), steel);
        crank.position.set(0, -0.3, 0);
        sys.add(crank);
        group.userData.animatedMeshes['crankshaft'] = crank;
        parts.push({ mesh: crank, name: "Crankshaft", description: "Rotating shaft.", function: "Converts linear piston motion to rotational."});
        
        group.add(sys);
    }

    // 2. Fuel System
    function buildFuelSystem() {
        const sys = new THREE.Group();
        const tank = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.6), plastic);
        tank.position.set(0, 1.2, -1.0);
        sys.add(tank);
        parts.push({ mesh: tank, name: "Fuel Tank", description: "Main diesel reservoir.", function: "Stores diesel fuel."});
        
        const lines = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.0).rotateX(Math.PI/2), copper);
        lines.position.set(0, 1.5, 0);
        sys.add(lines);
        parts.push({ mesh: lines, name: "Fuel Lines", description: "High pressure lines.", function: "Delivers fuel to injectors."});
        group.add(sys);
    }

    // 3. Air Intake System
    function buildAirIntakeSystem() {
        const sys = new THREE.Group();
        const filter = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.6), plastic);
        filter.position.set(0.6, 2.5, 1.5);
        sys.add(filter);
        parts.push({ mesh: filter, name: "Air Filter", description: "Heavy duty filtration unit.", function: "Cleans intake air."});
        
        const turbo = new THREE.Mesh(new THREE.SphereGeometry(0.15), castIron);
        turbo.position.set(0.5, 2.2, 0.8);
        sys.add(turbo);
        group.userData.animatedMeshes['turbo'] = turbo;
        parts.push({ mesh: turbo, name: "Turbocharger", description: "Exhaust driven turbine.", function: "Forces compressed air into cylinders."});
        group.add(sys);
    }

    // 4. Exhaust System
    function buildExhaustSystem() {
        const sys = new THREE.Group();
        const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.5), chrome);
        pipe.position.set(0.5, 3.0, 0.8);
        sys.add(pipe);
        parts.push({ mesh: pipe, name: "Exhaust Pipe", description: "Vertical exhaust stack.", function: "Vents combustion gases."});
        group.add(sys);
    }

    // 5. Cooling System
    function buildCoolingSystem() {
        const sys = new THREE.Group();
        const rad = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.0, 0.2), aluminum);
        rad.position.set(0, 1.8, 1.8);
        sys.add(rad);
        parts.push({ mesh: rad, name: "Radiator", description: "Heat exchanger.", function: "Cools engine coolant."});
        
        const fan = new THREE.Group();
        for(let i=0; i<4; i++) {
            const blade = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.1, 0.02), plastic);
            blade.rotation.z = (Math.PI/2) * i;
            fan.add(blade);
        }
        fan.position.set(0, 1.8, 1.65);
        sys.add(fan);
        group.userData.animatedMeshes['cooling_fan'] = fan;
        parts.push({ mesh: fan, name: "Cooling Fan", description: "Belt-driven fan.", function: "Pulls air through radiator."});
        group.add(sys);
    }

    // 6. Lubrication System
    function buildLubricationSystem() {
        const sys = new THREE.Group();
        const pan = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 1.2), castIron);
        pan.position.set(0, 1.2, 1.0);
        sys.add(pan);
        parts.push({ mesh: pan, name: "Oil Pan", description: "Reservoir at bottom of engine.", function: "Holds engine oil."});
        group.add(sys);
    }

    // 7. Electrical System
    function buildElectricalSystem() {
        const sys = new THREE.Group();
        const battery = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.2), plastic);
        battery.position.set(-0.5, 1.5, -0.5);
        sys.add(battery);
        parts.push({ mesh: battery, name: "12V Battery", description: "Lead-acid battery.", function: "Provides starting power."});
        
        const alternator = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.2).rotateZ(Math.PI/2), aluminum);
        alternator.position.set(-0.4, 1.8, 1.4);
        sys.add(alternator);
        group.userData.animatedMeshes['alternator'] = alternator;
        parts.push({ mesh: alternator, name: "Alternator", description: "Belt-driven generator.", function: "Recharges battery and powers electrics."});
        group.add(sys);
    }

    // 8. Transmission System
    function buildTransmissionSystem() {
        const sys = new THREE.Group();
        const gearbox = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 1.0), castIron);
        gearbox.position.set(0, 1.5, -0.2);
        sys.add(gearbox);
        parts.push({ mesh: gearbox, name: "Transmission Gearbox", description: "Main casing for gears.", function: "Multiplies engine torque."});
        group.add(sys);
    }

    // 9. Drive Train
    function buildDriveTrain() {
        const sys = new THREE.Group();
        const driveshaft = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.5).rotateX(Math.PI/2), steel);
        driveshaft.position.set(0, 1.2, -1.0);
        sys.add(driveshaft);
        group.userData.animatedMeshes['driveshaft'] = driveshaft;
        parts.push({ mesh: driveshaft, name: "Drive Shaft", description: "Main connecting shaft.", function: "Transmits power to rear axle."});
        group.add(sys);
    }

    // 10. Steering System
    function buildSteeringSystem() {
        const sys = new THREE.Group();
        const column = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.0).rotateX(-Math.PI/4), darkSteel);
        column.position.set(0, 2.2, -0.5);
        sys.add(column);
        
        const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.03, 8, 32), plastic);
        wheel.rotation.x = -Math.PI/4;
        wheel.position.set(0, 2.5, -0.2);
        sys.add(wheel);
        group.userData.animatedMeshes['steering_wheel'] = wheel;
        parts.push({ mesh: wheel, name: "Steering Wheel", description: "Operator interface.", function: "Controls front axle angle."});
        group.add(sys);
    }

    // 11. Brake System
    function buildBrakeSystem() {
        const sys = new THREE.Group();
        const pedal = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.2, 0.1), rubber);
        pedal.position.set(0.2, 1.8, -0.5);
        sys.add(pedal);
        parts.push({ mesh: pedal, name: "Brake Pedal", description: "Foot control.", function: "Activates hydraulic brakes."});
        group.add(sys);
    }

    // 12. Hydraulic System
    function buildHydraulicSystem() {
        const sys = new THREE.Group();
        const pump = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.2), castIron);
        pump.position.set(0.3, 1.6, -0.2);
        sys.add(pump);
        parts.push({ mesh: pump, name: "Hydraulic Pump", description: "High pressure fluid pump.", function: "Powers hitch and implements."});
        group.add(sys);
    }

    // 13. Three-Point Hitch System
    function buildHitchSystem() {
        const sys = new THREE.Group();
        const liftArms = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 0.6), steel);
        liftArms.position.set(0, 1.2, -2.0);
        sys.add(liftArms);
        group.userData.animatedMeshes['hitch'] = liftArms;
        parts.push({ mesh: liftArms, name: "3-Point Hitch", description: "Rear attachment point.", function: "Lifts and stabilizes implements."});
        group.add(sys);
    }

    // 14. Power Take-Off (PTO)
    function buildPTOSystem() {
        const sys = new THREE.Group();
        const pto = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.3).rotateX(Math.PI/2), steel);
        pto.position.set(0, 1.4, -2.2);
        sys.add(pto);
        group.userData.animatedMeshes['pto'] = pto;
        parts.push({ mesh: pto, name: "PTO Shaft", description: "Splined output shaft.", function: "Provides rotational power to implements."});
        group.add(sys);
    }

    // 15. Front Axle Assembly
    function buildFrontAxle() {
        const sys = new THREE.Group();
        const axle = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.15, 0.15), castIron);
        axle.position.set(0, 0.8, 1.5);
        sys.add(axle);
        parts.push({ mesh: axle, name: "Front Axle", description: "Pivoting beam.", function: "Supports front weight and steers."});
        group.add(sys);
    }

    // 16. Rear Axle Assembly
    function buildRearAxle() {
        const sys = new THREE.Group();
        const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 2.0).rotateZ(Math.PI/2), castIron);
        axle.position.set(0, 1.0, -1.2);
        sys.add(axle);
        parts.push({ mesh: axle, name: "Rear Axle", description: "Heavy duty planetary axle.", function: "Transmits final drive torque to wheels."});
        group.add(sys);
    }

    // 17. Wheels and Tires
    function buildWheels() {
        const sys = new THREE.Group();
        const rearGeo = new THREE.TorusGeometry(0.8, 0.3, 16, 64);
        const rr = new THREE.Mesh(rearGeo, rubber);
        rr.position.set(1.2, 1.0, -1.2);
        const rl = rr.clone();
        rl.position.set(-1.2, 1.0, -1.2);
        
        const frontGeo = new THREE.TorusGeometry(0.5, 0.2, 16, 64);
        const fr = new THREE.Mesh(frontGeo, rubber);
        fr.position.set(1.0, 0.8, 1.5);
        const fl = fr.clone();
        fl.position.set(-1.0, 0.8, 1.5);
        
        sys.add(rr, rl, fr, fl);
        group.userData.animatedMeshes['wheels'] = [rr, rl, fr, fl];
        parts.push({ mesh: rr, name: "Rear Tire", description: "Ag-tread pneumatic tire.", function: "Provides primary traction."});
        parts.push({ mesh: fr, name: "Front Tire", description: "Ribbed steering tire.", function: "Provides directional control."});
        group.add(sys);
    }

    // 18. Chassis and Frame
    function buildChassis() {
        const sys = new THREE.Group();
        const frame = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 4.0), jdGreen);
        frame.position.set(0, 1.3, 0);
        sys.add(frame);
        parts.push({ mesh: frame, name: "Main Frame", description: "Heavy structural rails.", function: "Supports all major systems."});
        group.add(sys);
    }

    // 19. Operator Station
    function buildOperatorStation() {
        const sys = new THREE.Group();
        const seat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 0.5), plastic);
        seat.position.set(0, 2.0, -1.0);
        const back = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.1), plastic);
        back.position.set(0, 2.25, -1.2);
        sys.add(seat, back);
        parts.push({ mesh: seat, name: "Suspension Seat", description: "Pneumatic comfort seat.", function: "Operator station."});
        group.add(sys);
    }

    // 20. Cab (if equipped)
    function buildCab() {
        const sys = new THREE.Group();
        const glassGeo = new THREE.BoxGeometry(1.4, 1.5, 1.4);
        const glassMesh = new THREE.Mesh(glassGeo, tinted);
        glassMesh.position.set(0, 2.8, -0.8);
        sys.add(glassMesh);
        parts.push({ mesh: glassMesh, name: "Enclosed Cabin", description: "Climate controlled glass enclosure.", function: "Protects operator from elements."});
        group.add(sys);
    }

    // 21. Lighting System
    function buildLighting() {
        const sys = new THREE.Group();
        const headlight = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.1, 0.1), glass);
        headlight.position.set(0.3, 1.8, 2.0);
        const h2 = headlight.clone();
        h2.position.set(-0.3, 1.8, 2.0);
        sys.add(headlight, h2);
        parts.push({ mesh: headlight, name: "LED Headlight", description: "High intensity discharge.", function: "Illuminates forward path."});
        group.add(sys);
    }

    // 22. Safety Equipment
    function buildSafety() {
        const sys = new THREE.Group();
        const rops = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.0, 0.1), steel);
        rops.position.set(0, 2.8, -1.4);
        sys.add(rops);
        parts.push({ mesh: rops, name: "ROPS", description: "Roll Over Protection Structure.", function: "Protects operator in a roll-over."});
        group.add(sys);
    }

    // Execute all 22 builds
    buildEngineSystem();
    buildFuelSystem();
    buildAirIntakeSystem();
    buildExhaustSystem();
    buildCoolingSystem();
    buildLubricationSystem();
    buildElectricalSystem();
    buildTransmissionSystem();
    buildDriveTrain();
    buildSteeringSystem();
    buildBrakeSystem();
    buildHydraulicSystem();
    buildHitchSystem();
    buildPTOSystem();
    buildFrontAxle();
    buildRearAxle();
    buildWheels();
    buildChassis();
    buildOperatorStation();
    buildCab();
    buildLighting();
    buildSafety();

    // 100,000 Bolt Instanced Mesh integration
    const boltCount = 100000;
    const boltGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.02, 6); 
    const instancedBolts = new THREE.InstancedMesh(boltGeo, steel, boltCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < boltCount; i++) {
        dummy.position.set((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 3 + 1.5, (Math.random() - 0.5) * 4);
        dummy.updateMatrix();
        instancedBolts.setMatrixAt(i, dummy.matrix);
    }
    instancedBolts.instanceMatrix.needsUpdate = true;
    group.add(instancedBolts);
    parts.push({ mesh: instancedBolts, name: "100,000 Fasteners", description: "Array of all nuts, bolts, and screws holding the 22 systems together.", function: "Mechanical fastening." });

    // Dynamic Animation Loop
    group.userData.animate = function(time) {
        const state = group.userData.state;
        state.throttle = (Math.sin(time * 0.0005) + 1.0) / 2.0; 
        state.rpm = 800 + (state.throttle * 2200); 
        
        const speed = state.rpm / 800; // Multiplier
        
        // Animate Pistons
        for(let i=0; i<4; i++) {
            const piston = group.userData.animatedMeshes[`piston_${i}`];
            if(piston) piston.position.y = 0.3 + Math.sin(time * 0.01 * speed + i) * 0.1;
        }
        
        // Animate Fans & Shafts
        if(group.userData.animatedMeshes['crankshaft']) group.userData.animatedMeshes['crankshaft'].rotation.x += 0.1 * speed;
        if(group.userData.animatedMeshes['cooling_fan']) group.userData.animatedMeshes['cooling_fan'].rotation.z += 0.2 * speed;
        if(group.userData.animatedMeshes['turbo']) group.userData.animatedMeshes['turbo'].rotation.y += 0.5 * speed;
        if(group.userData.animatedMeshes['alternator']) group.userData.animatedMeshes['alternator'].rotation.x += 0.3 * speed;
        if(group.userData.animatedMeshes['driveshaft']) group.userData.animatedMeshes['driveshaft'].rotation.x += 0.1 * speed;
        if(group.userData.animatedMeshes['pto']) group.userData.animatedMeshes['pto'].rotation.x += 0.1 * speed;
        
        // Animate Wheels
        const wheels = group.userData.animatedMeshes['wheels'];
        if(wheels) {
            const wheelSpeed = state.throttle * 0.1;
            wheels.forEach(w => w.rotation.x -= wheelSpeed);
        }
    };

    group.userData.parts = parts;
    group.userData.quiz = [
        {
            question: "How many major systems does a modern tractor possess according to this blueprint?",
            options: ["10", "15", "22", "50"],
            correct: 2
        }
    ];

    return group;
}
