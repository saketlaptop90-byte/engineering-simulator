import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};
    const tethers = [];
    const pistons = [];
    const wheels = [];
    const lights = [];
    const energyRings = [];

    // ==========================================
    // 1. CUSTOM HIGH-TECH MATERIALS
    // ==========================================
    const matQuantumSingularity = new THREE.MeshStandardMaterial({
        color: 0x000000,
        emissive: 0xaa00ff,
        emissiveIntensity: 5.0,
        roughness: 0.0,
        metalness: 1.0,
        wireframe: false
    });

    const matWhiteHoleEmission = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 15.0,
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 0.8
    });

    const matEventHorizon = new THREE.MeshPhysicalMaterial({
        color: 0x010101,
        emissive: 0x000000,
        roughness: 0.9,
        metalness: 0.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        transparent: true,
        opacity: 0.95
    });

    const matErgosphere = new THREE.MeshPhysicalMaterial({
        color: 0x220055,
        emissive: 0x110033,
        emissiveIntensity: 2.0,
        transmission: 0.9,
        opacity: 1.0,
        metalness: 0.5,
        roughness: 0.1,
        ior: 1.5,
        thickness: 5.0,
        side: THREE.DoubleSide
    });

    const matTetherGlowing = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 8.0,
        roughness: 0.2,
        metalness: 0.8,
        wireframe: true
    });

    const matTetherHot = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffee,
        emissiveIntensity: 12.0,
        roughness: 0.1,
        metalness: 0.9
    });

    const matTireRubber = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.9,
        metalness: 0.1
    });

    const matNeonRed = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 5.0
    });

    const matGoldFoil = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        roughness: 0.3,
        metalness: 1.0,
        bumpScale: 0.02
    });

    // ==========================================
    // 2. HELPER FUNCTIONS FOR COMPLEX GEOMETRIES
    // ==========================================

    function createLatheGenerator() {
        const points = [];
        for ( let i = 0; i <= 30; i ++ ) {
            const v = i / 30;
            const x = Math.sin(v * Math.PI * 4) * 2 + 8 + Math.cos(v * Math.PI) * 3;
            const y = (i - 15) * 1.5;
            points.push( new THREE.Vector2( x, y ) );
        }
        const geom = new THREE.LatheGeometry( points, 64 );
        return geom;
    }

    function createComplexWheel(radius, tube, lugCount) {
        const wheelGroup = new THREE.Group();
        
        // Main Torus for tire
        const tireGeom = new THREE.TorusGeometry(radius, tube, 32, 128);
        const tire = new THREE.Mesh(tireGeom, matTireRubber);
        wheelGroup.add(tire);
        
        // Aggressive Off-Road Lugs
        const lugGeom = new THREE.BoxGeometry(tube * 1.5, tube * 0.8, tube * 1.2);
        for (let i = 0; i < lugCount; i++) {
            const theta = (i / lugCount) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeom, matTireRubber);
            // Position on the surface of the torus
            lug.position.set(
                Math.cos(theta) * (radius + tube * 0.6),
                Math.sin(theta) * (radius + tube * 0.6),
                0
            );
            lug.rotation.z = theta;
            // Alternate lug angle for aggressive V-tread
            lug.rotation.x = i % 2 === 0 ? 0.2 : -0.2;
            wheelGroup.add(lug);
        }

        // Complex Spoke Array (Rims)
        const rimRadius = radius - tube + 2;
        const rimGeom = new THREE.CylinderGeometry(rimRadius, rimRadius, tube * 1.1, 64);
        const rim = new THREE.Mesh(rimGeom, chrome);
        rim.rotation.x = Math.PI / 2;
        wheelGroup.add(rim);

        // Spokes
        const spokeCount = 12;
        const spokeGeom = new THREE.CylinderGeometry(tube * 0.1, tube * 0.2, rimRadius * 2, 16);
        for (let i = 0; i < spokeCount / 2; i++) {
            const theta = (i / (spokeCount / 2)) * Math.PI;
            const spoke = new THREE.Mesh(spokeGeom, darkSteel);
            spoke.rotation.z = theta;
            spoke.rotation.x = Math.PI / 2;
            wheelGroup.add(spoke);
        }

        // Center Hub
        const hubGeom = new THREE.CylinderGeometry(tube * 0.8, tube * 1.0, tube * 1.5, 32);
        const hub = new THREE.Mesh(hubGeom, steel);
        hub.rotation.x = Math.PI / 2;
        wheelGroup.add(hub);

        // Glowing Hub Cap
        const capGeom = new THREE.SphereGeometry(tube * 0.6, 32, 32);
        const cap = new THREE.Mesh(capGeom, matTetherGlowing);
        cap.scale.z = 0.3;
        cap.position.z = tube * 0.75;
        wheelGroup.add(cap);
        
        return wheelGroup;
    }

    function createLQGTether(startPt, endPt, segments, radius) {
        class CustomSinCurve extends THREE.Curve {
            constructor(scale, start, end) {
                super();
                this.scale = scale;
                this.start = start;
                this.end = end;
            }
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const tx = this.start.x + (this.end.x - this.start.x) * t;
                const ty = this.start.y + (this.end.y - this.start.y) * t;
                const tz = this.start.z + (this.end.z - this.start.z) * t;
                
                // Add some quantum fluctuation/wobble
                const wobbleX = Math.sin(t * Math.PI * 10) * this.scale * (1 - Math.abs(2 * t - 1));
                const wobbleY = Math.cos(t * Math.PI * 15) * this.scale * (1 - Math.abs(2 * t - 1));
                
                return optionalTarget.set(tx + wobbleX, ty + wobbleY, tz);
            }
        }
        
        const path = new CustomSinCurve(5.0, startPt, endPt);
        const geom = new THREE.TubeGeometry(path, segments, radius, 16, false);
        const mesh = new THREE.Mesh(geom, matTetherGlowing);
        return mesh;
    }

    function createHydraulicPiston(length, radius) {
        const pistonGroup = new THREE.Group();
        
        // Outer Cylinder
        const outerGeom = new THREE.CylinderGeometry(radius, radius, length * 0.6, 32);
        const outer = new THREE.Mesh(outerGeom, darkSteel);
        outer.position.y = length * 0.3;
        pistonGroup.add(outer);
        
        // Inner Cylinder (The part that moves)
        const innerGeom = new THREE.CylinderGeometry(radius * 0.7, radius * 0.7, length * 0.8, 32);
        const inner = new THREE.Mesh(innerGeom, chrome);
        inner.position.y = length * 0.7; // Starts extended
        pistonGroup.add(inner);
        
        // Pressure Rings
        for(let i=0; i<5; i++) {
            const ringGeom = new THREE.TorusGeometry(radius * 1.1, radius * 0.1, 16, 32);
            const ring = new THREE.Mesh(ringGeom, copper);
            ring.rotation.x = Math.PI / 2;
            ring.position.y = length * 0.1 + (i * length * 0.1);
            pistonGroup.add(ring);
        }

        // Hydraulic fluid line (Tube)
        class LineCurve extends THREE.Curve {
            getPoint(t, opt = new THREE.Vector3()) {
                const tx = Math.sin(t * Math.PI) * radius * 2;
                const ty = t * length * 0.6;
                const tz = Math.cos(t * Math.PI) * radius * 2;
                return opt.set(tx, ty, tz);
            }
        }
        const lineGeom = new THREE.TubeGeometry(new LineCurve(), 32, radius * 0.15, 8, false);
        const line = new THREE.Mesh(lineGeom, rubber);
        pistonGroup.add(line);

        return { group: pistonGroup, innerCylinder: inner };
    }

    function createExtrudedPanel(width, height, depth) {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(width, 0);
        shape.lineTo(width - depth, height);
        shape.lineTo(depth, height);
        shape.lineTo(0, 0);

        const extrudeSettings = {
            steps: 2,
            depth: depth,
            bevelEnabled: true,
            bevelThickness: 1,
            bevelSize: 1,
            bevelOffset: 0,
            bevelSegments: 3
        };

        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geometry.center();
        return new THREE.Mesh(geometry, aluminum);
    }

    function createControlCabin() {
        const cabinGroup = new THREE.Group();
        
        // Main Pod
        const podGeom = new THREE.IcosahedronGeometry(15, 2);
        const pod = new THREE.Mesh(podGeom, darkSteel);
        cabinGroup.add(pod);

        // Tinted Viewing Glass
        const glassGeom = new THREE.SphereGeometry(14.5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2.5);
        const glassMesh = new THREE.Mesh(glassGeom, tinted);
        glassMesh.rotation.x = Math.PI / 2;
        glassMesh.position.z = 2;
        cabinGroup.add(glassMesh);

        // Interior details (Seats, Screens)
        const seatGeom = new THREE.BoxGeometry(4, 6, 4);
        const seat = new THREE.Mesh(seatGeom, rubber);
        seat.position.set(0, -5, -2);
        cabinGroup.add(seat);

        const screenGeom = new THREE.PlaneGeometry(8, 4);
        const screen = new THREE.Mesh(screenGeom, matTetherGlowing);
        screen.position.set(0, -2, 8);
        screen.rotation.y = Math.PI;
        cabinGroup.add(screen);

        const screen2Geom = new THREE.PlaneGeometry(4, 3);
        const screen2 = new THREE.Mesh(screen2Geom, matNeonRed);
        screen2.position.set(-6, -3, 6);
        screen2.rotation.y = Math.PI - 0.5;
        cabinGroup.add(screen2);

        const screen3Geom = new THREE.PlaneGeometry(4, 3);
        const screen3 = new THREE.Mesh(screen3Geom, matNeonRed);
        screen3.position.set(6, -3, 6);
        screen3.rotation.y = Math.PI + 0.5;
        cabinGroup.add(screen3);

        // Antennas
        const antGeom = new THREE.CylinderGeometry(0.2, 0.5, 10, 8);
        const ant1 = new THREE.Mesh(antGeom, steel);
        ant1.position.set(-5, 12, -5);
        ant1.rotation.z = 0.3;
        ant1.rotation.x = -0.3;
        cabinGroup.add(ant1);

        const ant2 = new THREE.Mesh(antGeom, steel);
        ant2.position.set(5, 12, -5);
        ant2.rotation.z = -0.3;
        ant2.rotation.x = -0.3;
        cabinGroup.add(ant2);
        
        return cabinGroup;
    }

    // ==========================================
    // 3. ASSEMBLING THE MACHINE
    // ==========================================

    // --- MAIN CHASSIS (Crawler Base) ---
    const chassisGroup = new THREE.Group();
    group.add(chassisGroup);
    
    // Main base body
    const baseGeom = new THREE.BoxGeometry(100, 20, 180);
    const base = new THREE.Mesh(baseGeom, darkSteel);
    base.position.y = 30;
    chassisGroup.add(base);

    // Chassis details (Rivets and Panels)
    for(let i=0; i<10; i++) {
        for(let j=0; j<18; j++) {
            const rivetGeom = new THREE.SphereGeometry(0.5, 8, 8);
            const rivet = new THREE.Mesh(rivetGeom, chrome);
            rivet.position.set(-49 + (i * 10.8), 40.5, -89 + (j * 10.4));
            chassisGroup.add(rivet);
        }
    }

    // Huge Crawler Wheels
    const wheelPositions = [
        [-60, 30, -70],
        [ 60, 30, -70],
        [-60, 30,  70],
        [ 60, 30,  70],
        [-60, 30, -20],
        [ 60, 30, -20],
        [-60, 30,  20],
        [ 60, 30,  20]
    ];

    wheelPositions.forEach((pos, index) => {
        const wheel = createComplexWheel(15, 6, 40);
        wheel.position.set(pos[0], pos[1], pos[2]);
        wheel.rotation.y = pos[0] > 0 ? 0 : Math.PI; // Flip one side
        chassisGroup.add(wheel);
        wheels.push(wheel);

        // Axle connection
        const axleGeom = new THREE.CylinderGeometry(3, 3, 20, 16);
        const axle = new THREE.Mesh(axleGeom, steel);
        axle.rotation.z = Math.PI / 2;
        axle.position.set(pos[0] > 0 ? pos[0] - 10 : pos[0] + 10, pos[1], pos[2]);
        chassisGroup.add(axle);
        
        // Suspension Springs
        const springGeom = new THREE.TorusKnotGeometry(4, 1.5, 100, 16, 2, 10);
        const spring = new THREE.Mesh(springGeom, copper);
        spring.position.set(pos[0] > 0 ? pos[0] - 10 : pos[0] + 10, pos[1] + 10, pos[2]);
        spring.scale.set(1, 2, 1);
        chassisGroup.add(spring);
    });


    // --- THE PLANCK STAR CORE ---
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, 120, 0); // Suspended high above the chassis
    group.add(coreGroup);

    // 1. The Superposition Core (Black/White hole)
    const singularityGeom = new THREE.SphereGeometry(10, 64, 64);
    const singularity = new THREE.Mesh(singularityGeom, matQuantumSingularity);
    coreGroup.add(singularity);
    meshes.singularity = singularity;

    // 2. The Event Horizon Shell
    const eventHorizonGeom = new THREE.SphereGeometry(12, 64, 64);
    const eventHorizon = new THREE.Mesh(eventHorizonGeom, matEventHorizon);
    coreGroup.add(eventHorizon);
    meshes.eventHorizon = eventHorizon;

    // 3. Ergosphere (Oblate Spheroid)
    const ergosphereGeom = new THREE.SphereGeometry(20, 64, 64);
    const ergosphere = new THREE.Mesh(ergosphereGeom, matErgosphere);
    ergosphere.scale.set(1.5, 0.8, 1.5);
    coreGroup.add(ergosphere);
    meshes.ergosphere = ergosphere;

    // 4. Hawking Radiation Jets
    const jetGeom = new THREE.CylinderGeometry(0.5, 15, 200, 32, 1, true);
    
    const jetTop = new THREE.Mesh(jetGeom, matWhiteHoleEmission);
    jetTop.position.y = 100;
    coreGroup.add(jetTop);
    
    const jetBottom = new THREE.Mesh(jetGeom, matWhiteHoleEmission);
    jetBottom.rotation.x = Math.PI;
    jetBottom.position.y = -100;
    coreGroup.add(jetBottom);
    
    meshes.jetTop = jetTop;
    meshes.jetBottom = jetBottom;

    // 5. Accretion Disk (Energy Rings)
    for(let i=0; i<3; i++) {
        const ringGeom = new THREE.TorusGeometry(35 + i*15, 2 - i*0.5, 16, 100);
        const ring = new THREE.Mesh(ringGeom, matWhiteHoleEmission);
        ring.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.2;
        ring.rotation.y = (Math.random() - 0.5) * 0.2;
        coreGroup.add(ring);
        energyRings.push(ring);
    }

    // --- CONTAINMENT ARRAY (Generators & Tethers) ---
    const containmentGroup = new THREE.Group();
    containmentGroup.position.set(0, 120, 0);
    group.add(containmentGroup);

    const nodePositions = [
        new THREE.Vector3(0, 70, 0),
        new THREE.Vector3(0, -70, 0),
        new THREE.Vector3(70, 0, 0),
        new THREE.Vector3(-70, 0, 0),
        new THREE.Vector3(0, 0, 70),
        new THREE.Vector3(0, 0, -70),
        new THREE.Vector3(45, 45, 45),
        new THREE.Vector3(-45, 45, 45),
        new THREE.Vector3(45, -45, 45),
        new THREE.Vector3(-45, -45, 45),
        new THREE.Vector3(45, 45, -45),
        new THREE.Vector3(-45, 45, -45),
        new THREE.Vector3(45, -45, -45),
        new THREE.Vector3(-45, -45, -45)
    ];

    nodePositions.forEach((pos, idx) => {
        // Node Generator Base
        const nodeGeom = createLatheGenerator();
        const node = new THREE.Mesh(nodeGeom, chrome);
        
        // Orient node towards center
        node.position.copy(pos);
        node.lookAt(new THREE.Vector3(0,0,0));
        node.rotateX(Math.PI / 2); // Adjust lathe orientation
        
        containmentGroup.add(node);

        // Add Gold Foil heat shields
        const shieldGeom = new THREE.SphereGeometry(15, 16, 16, 0, Math.PI, 0, Math.PI);
        const shield = new THREE.Mesh(shieldGeom, matGoldFoil);
        shield.position.copy(pos);
        shield.lookAt(new THREE.Vector3(0,0,0));
        containmentGroup.add(shield);

        // Loop Quantum Gravity Tethers connecting to core
        // Multiple tethers per node
        for(let t=0; t<3; t++) {
            const startPt = pos.clone().add(new THREE.Vector3(
                (Math.random()-0.5)*10,
                (Math.random()-0.5)*10,
                (Math.random()-0.5)*10
            ));
            // Connect near the event horizon
            const endPt = new THREE.Vector3(
                (Math.random()-0.5)*10,
                (Math.random()-0.5)*10,
                (Math.random()-0.5)*10
            );
            const tether = createLQGTether(startPt, endPt, 64, 0.5);
            containmentGroup.add(tether);
            tethers.push({ mesh: tether, startPt, endPt, timeOffset: Math.random() * 100 });
        }

        // Structural Support Struts connecting to Chassis
        if (pos.y <= 0) {
            const strutGeom = new THREE.CylinderGeometry(2, 4, 100, 16);
            const strut = new THREE.Mesh(strutGeom, darkSteel);
            const strutMid = new THREE.Vector3().addVectors(pos, new THREE.Vector3(pos.x * 0.5, -120, pos.z * 0.5)).multiplyScalar(0.5);
            strut.position.copy(strutMid);
            strut.lookAt(pos);
            strut.rotateX(Math.PI/2);
            containmentGroup.add(strut);
        }
    });

    // --- SUPPORT ARMS & HYDRAULICS ---
    const towerGroup = new THREE.Group();
    group.add(towerGroup);

    // 4 Massive Support Towers
    const towerPositions = [
        [-40, 40, -40],
        [ 40, 40, -40],
        [-40, 40,  40],
        [ 40, 40,  40]
    ];

    towerPositions.forEach(pos => {
        // Tower Main Pillar
        const pillarGeom = new THREE.BoxGeometry(15, 120, 15);
        const pillar = new THREE.Mesh(pillarGeom, steel);
        pillar.position.set(pos[0], pos[1] + 40, pos[2]);
        towerGroup.add(pillar);

        // Tower Inner Core (glowing)
        const coreGeom = new THREE.CylinderGeometry(3, 3, 120, 16);
        const innerCore = new THREE.Mesh(coreGeom, matTetherGlowing);
        innerCore.position.set(pos[0], pos[1] + 40, pos[2]);
        towerGroup.add(innerCore);

        // Tower Lattice (Wireframe)
        const latticeGeom = new THREE.BoxGeometry(17, 120, 17, 2, 10, 2);
        const latticeMat = new THREE.MeshBasicMaterial({ color: 0x333333, wireframe: true });
        const lattice = new THREE.Mesh(latticeGeom, latticeMat);
        lattice.position.set(pos[0], pos[1] + 40, pos[2]);
        towerGroup.add(lattice);

        // Hydraulic Pistons supporting the Containment Array
        const pistonData = createHydraulicPiston(80, 5);
        const piston = pistonData.group;
        piston.position.set(pos[0], pos[1] + 100, pos[2]);
        piston.lookAt(new THREE.Vector3(0, 120, 0));
        piston.rotateX(Math.PI/2);
        towerGroup.add(piston);
        pistons.push(pistonData.innerCylinder);
    });

    // --- OPERATOR COMMAND SPHERE ---
    const cabin = createControlCabin();
    // Suspended from a giant boom arm at the back
    cabin.position.set(0, 150, 120);
    group.add(cabin);

    // Boom Arm
    const boomGeom = new THREE.CylinderGeometry(4, 6, 120, 16);
    const boom = new THREE.Mesh(boomGeom, aluminum);
    boom.position.set(0, 90, 80);
    boom.rotation.x = -Math.PI / 4;
    group.add(boom);

    // Boom Hydraulics
    const boomHydraulic = createHydraulicPiston(60, 3);
    boomHydraulic.group.position.set(0, 60, 40);
    boomHydraulic.group.rotation.x = -Math.PI / 6;
    group.add(boomHydraulic.group);

    // Radiator Panels at the back of the chassis
    for(let i=0; i<8; i++) {
        const panel = createExtrudedPanel(10, 40, 2);
        panel.position.set(-35 + (i*10), 50, 80);
        panel.rotation.x = Math.PI / 6;
        group.add(panel);
    }

    // Exhaust Stacks
    for(let i=0; i<4; i++) {
        const stackGeom = new THREE.CylinderGeometry(3, 4, 30, 16);
        const stack = new THREE.Mesh(stackGeom, chrome);
        stack.position.set(i % 2 === 0 ? -45 : 45, 60, 50 + Math.floor(i/2) * 20);
        group.add(stack);
        
        // Exhaust Smoke (simplified as glowing particles emitting)
        const smokeGeom = new THREE.SphereGeometry(4, 16, 16);
        const smoke = new THREE.Mesh(smokeGeom, matWhiteHoleEmission);
        smoke.position.set(stack.position.x, stack.position.y + 20, stack.position.z);
        group.add(smoke);
        lights.push(smoke);
    }


    // ==========================================
    // 4. PARTS DECLARATION (Extreme Detail)
    // ==========================================
    
    parts.push({
        name: "Planck Star Core",
        description: "An ultra-dense singularity in a state of quantum superposition between a black hole and a white hole. It vibrates violently at the Planck frequency, attempting to rebound into a new universe via a Big Bounce.",
        material: "Quantum Singularity Emissive Matrix",
        function: "Source of infinite energy and catastrophic spatial distortion.",
        assemblyOrder: 1,
        connections: ["Event Horizon Shell", "LQG Tether Array"],
        failureEffect: "Instantaneous creation of a localized Big Bang, eradicating the simulator in a false-vacuum decay event.",
        cascadeFailures: ["Event Horizon Shell", "Containment Nodes", "Ergosphere"],
        originalPosition: { x: 0, y: 120, z: 0 },
        explodedPosition: { x: 0, y: 300, z: 0 }
    });

    parts.push({
        name: "Event Horizon Shell",
        description: "The boundary region where the escape velocity equals the speed of light. Held artificially rigid by the containment field to prevent the ergosphere from collapsing inward.",
        material: "Hyper-Dense Carbon Nanotube / Exotic Matter Composite",
        function: "Defines the boundary of the singularity and prevents spaghettification of the stabilizer chassis.",
        assemblyOrder: 2,
        connections: ["Planck Star Core", "Hawking Radiation Regulators"],
        failureEffect: "Spaghettification of all surrounding matter within a 10km radius.",
        cascadeFailures: ["Hawking Radiation Regulators", "LQG Tether Array"],
        originalPosition: { x: 0, y: 120, z: 0 },
        explodedPosition: { x: 0, y: 250, z: 50 }
    });

    parts.push({
        name: "Ergosphere Torus",
        description: "A region of spacetime dragged by the extreme rotation of the Planck star. Objects within must move faster than light relative to the outside universe just to remain stationary.",
        material: "Spacetime Metric Distorter Material",
        function: "Facilitates the Penrose Process to extract infinite rotational energy to power the crawler base.",
        assemblyOrder: 3,
        connections: ["Event Horizon Shell", "Accretion Disk"],
        failureEffect: "Loss of frame-dragging control, causing the entire machine to be spun out of normal spacetime into a closed timelike curve.",
        cascadeFailures: ["Main Chassis", "Support Towers"],
        originalPosition: { x: 0, y: 120, z: 0 },
        explodedPosition: { x: 0, y: 200, z: -50 }
    });

    parts.push({
        name: "Loop Quantum Gravity Tether Array (Alpha)",
        description: "Hundreds of shimmering tethers constructed from quantized loops of spacetime itself. They physically pull the Planck Star's surface back to prevent the Big Bounce.",
        material: "Quantized Spacetime Filaments",
        function: "Directly counteracts the quantum repulsion at the Planck density.",
        assemblyOrder: 4,
        connections: ["Planck Star Core", "Containment Nodes"],
        failureEffect: "The singularity expands by 10^30 meters in a fraction of a second.",
        cascadeFailures: ["All"],
        originalPosition: { x: 0, y: 120, z: 0 },
        explodedPosition: { x: 100, y: 150, z: 100 }
    });
    
    parts.push({
        name: "Containment Node Generators (x14)",
        description: "Massive geometric array of nodes that anchor the LQG Tethers. Each node generates a gravimetric field equivalent to 10 Jupiter masses.",
        material: "Ultra-Chrome / Gold Foil",
        function: "Provides the anchoring mass and magnetic monopole flux necessary to tension the tethers.",
        assemblyOrder: 5,
        connections: ["LQG Tether Array", "Hydraulic Support Struts"],
        failureEffect: "Tether snapping, resulting in a whip-crack that severs spacetime geometry locally.",
        cascadeFailures: ["LQG Tether Array"],
        originalPosition: { x: 0, y: 120, z: 0 },
        explodedPosition: { x: -100, y: 150, z: -100 }
    });

    parts.push({
        name: "Hawking Radiation Collector (North Jet)",
        description: "A massive conical collector positioned at the pole to capture blinding streams of virtual particle pairs converting to real energy.",
        material: "White Hole Emission Absorber",
        function: "Vents extreme Hawking radiation to prevent thermal runaway of the core.",
        assemblyOrder: 6,
        connections: ["Event Horizon Shell", "Radiator Panels"],
        failureEffect: "Evaporation of the black hole in a flash of gamma rays equivalent to 1 million supernovas.",
        cascadeFailures: ["Planck Star Core", "Radiator Panels"],
        originalPosition: { x: 0, y: 220, z: 0 },
        explodedPosition: { x: 0, y: 400, z: 0 }
    });

    parts.push({
        name: "Penrose Process Energy Rings (Accretion Disk)",
        description: "Three interlocking rings of superheated plasma and exotic matter orbiting the ergosphere, tapping rotational energy.",
        material: "White-Hot Plasma Matrix",
        function: "Powers the hydraulic locomotion and quantum computers.",
        assemblyOrder: 7,
        connections: ["Ergosphere Torus"],
        failureEffect: "Plasma detonation incinerating the crawler base.",
        cascadeFailures: ["Main Chassis", "Hydraulic Pistons"],
        originalPosition: { x: 0, y: 120, z: 0 },
        explodedPosition: { x: 0, y: 120, z: 200 }
    });

    parts.push({
        name: "Main Crawler Chassis",
        description: "A gargantuan mobile platform built from dark steel and reinforced with gravitational dampeners. Crawls across planets to maintain an optimal geodesical trajectory.",
        material: "Dark Steel / Chrome Rivets",
        function: "Supports the entire multi-billion ton mass of the stabilizer.",
        assemblyOrder: 8,
        connections: ["Giant Crawler Wheels", "Support Towers"],
        failureEffect: "Structural collapse under extreme gravity, sinking the machine to the center of the planet.",
        cascadeFailures: ["Giant Crawler Wheels", "Tower Lattice"],
        originalPosition: { x: 0, y: 30, z: 0 },
        explodedPosition: { x: 0, y: -50, z: 0 }
    });

    parts.push({
        name: "Giant Crawler Wheels (x8)",
        description: "Massive torus-geometry tires with aggressive extruded lugs, supported by complex cylinder spoke arrays. Capable of driving over mountains.",
        material: "Ultra-Density Rubber / Steel",
        function: "Locomotion and seismic shock absorption.",
        assemblyOrder: 9,
        connections: ["Main Crawler Chassis", "Suspension Springs"],
        failureEffect: "Immobility, leading to sub-optimal geodesic alignment and eventual containment breach.",
        cascadeFailures: ["Main Crawler Chassis"],
        originalPosition: { x: -60, y: 30, z: 70 },
        explodedPosition: { x: -150, y: 0, z: 150 }
    });

    parts.push({
        name: "Support Towers & Lattice",
        description: "Four massive structural towers housing glowing inner cores, utilizing a wireframe lattice geometry for maximum rigidity against gravity waves.",
        material: "Steel / Glowing Quantum Cores",
        function: "Elevates and suspends the containment array above the chassis.",
        assemblyOrder: 10,
        connections: ["Main Crawler Chassis", "Hydraulic Pistons"],
        failureEffect: "The core crashes into the chassis, instantly annihilating it.",
        cascadeFailures: ["Containment Node Generators", "Hydraulic Pistons"],
        originalPosition: { x: -40, y: 70, z: -40 },
        explodedPosition: { x: -100, y: 70, z: -100 }
    });

    parts.push({
        name: "Hydraulic Tether Actuators (Pistons)",
        description: "Gigantic nested cylinders with pressure rings and rubber fluid lines, constantly adjusting to the micro-fluctuations of the vibrating singularity.",
        material: "Dark Steel / Chrome / Rubber",
        function: "Maintains exact tension on the containment nodes.",
        assemblyOrder: 11,
        connections: ["Support Towers", "Containment Node Generators"],
        failureEffect: "Asymmetric tension leading to core destabilization and spin-out.",
        cascadeFailures: ["Containment Node Generators"],
        originalPosition: { x: -40, y: 170, z: -40 },
        explodedPosition: { x: -80, y: 200, z: -80 }
    });

    parts.push({
        name: "Operator Command Sphere",
        description: "An icosahedron-based suspended pod with tinted viewing glass, multiple neon-glowing telemetry screens, and dual antennas.",
        material: "Dark Steel / Tinted Glass / Rubber / Neon",
        function: "Houses the brave (or foolish) PhD operators managing the quantum state.",
        assemblyOrder: 12,
        connections: ["Boom Arm"],
        failureEffect: "Operators are exposed to raw Hawking radiation and temporal paradoxes.",
        cascadeFailures: ["None (Operators are expendable)"],
        originalPosition: { x: 0, y: 150, z: 120 },
        explodedPosition: { x: 0, y: 200, z: 300 }
    });
    
    parts.push({
        name: "Tachyon Field Generator",
        description: "Embedded within the node lattice, this generates particles that travel backward in time to predict singularity fluctuations before they happen.",
        material: "Gold Foil / Chrome",
        function: "Predictive stabilization algorithm hardware.",
        assemblyOrder: 13,
        connections: ["Containment Node Generators"],
        failureEffect: "Causality loop collapse; the machine destroys itself yesterday.",
        cascadeFailures: ["Operator Command Sphere"],
        originalPosition: { x: 45, y: 165, z: 45 },
        explodedPosition: { x: 150, y: 250, z: 150 }
    });
    
    parts.push({
        name: "Antimatter Flux Capacitor",
        description: "Located near the exhaust stacks, it annihilates leaked exotic matter from the ergosphere to prevent local reality decay.",
        material: "Aluminum / Steel",
        function: "Waste management for a god-tier machine.",
        assemblyOrder: 14,
        connections: ["Exhaust Stacks", "Main Crawler Chassis"],
        failureEffect: "Exotic matter pollution, causing nearby terrain to invert its gravitational pull.",
        cascadeFailures: ["Exhaust Stacks"],
        originalPosition: { x: 45, y: 60, z: 50 },
        explodedPosition: { x: 100, y: 100, z: 100 }
    });

    parts.push({
        name: "Entanglement Entropy Radiators",
        description: "Eight large extruded panels at the rear. They don't radiate heat; they radiate excess quantum entanglement to the surrounding environment to keep the core's entropy localized.",
        material: "Aluminum Extrusions",
        function: "Prevents the AMPS Firewall from forming at the event horizon and burning the tethers.",
        assemblyOrder: 15,
        connections: ["Main Crawler Chassis"],
        failureEffect: "Firewall paradox destroys the event horizon smooth structure.",
        cascadeFailures: ["Event Horizon Shell"],
        originalPosition: { x: -35, y: 50, z: 80 },
        explodedPosition: { x: -100, y: 100, z: 200 }
    });


    // ==========================================
    // 5. PHD-LEVEL QUIZ QUESTIONS
    // ==========================================
    
    const quizQuestions = [
        {
            question: "In the context of Loop Quantum Gravity (LQG) utilized by the tether array, the area of the event horizon is quantized. Which of the following best represents the formula for the area spectrum gap of the event horizon in LQG?",
            options: [
                "A = 4π * Planck Length squared",
                "A = 8πγ * Planck Length squared * sum(sqrt(j(j+1)))",
                "A = 16πG^2 M^2 / c^4",
                "A = hc / (4πGM)"
            ],
            correctAnswer: 1,
            explanation: "In Loop Quantum Gravity, the area operator has a discrete spectrum. The area is given by 8πγ(l_p)^2 sum(sqrt(j(j+1))), where γ is the Barbero-Immirzi parameter, l_p is the Planck length, and j are the spin-network edge labels intersecting the surface."
        },
        {
            question: "The Entanglement Entropy Radiators are designed to prevent the 'AMPS Firewall'. The AMPS paradox suggests a breakdown in which fundamental principle of quantum mechanics or general relativity?",
            options: [
                "The equivalence principle (monogamy of entanglement conflict)",
                "The Heisenberg uncertainty principle",
                "The constancy of the speed of light",
                "The conservation of angular momentum"
            ],
            correctAnswer: 0,
            explanation: "The AMPS (Almheiri, Marolf, Polchinski, Sully) Firewall paradox arises because if black hole evaporation is unitary (preserving information), late-time Hawking radiation must be fully entangled with early radiation. However, for the event horizon to be smooth (equivalence principle), late radiation must also be entangled with the interior vacuum. Quantum mechanics prohibits this 'monogamy of entanglement', implying a high-energy firewall at the horizon."
        },
        {
            question: "To stabilize the Planck Star core against a 'Big Bounce', the machine manipulates the Bekenstein bound. What does the Bekenstein bound dictate?",
            options: [
                "The maximum temperature of a black hole.",
                "The maximum amount of information (entropy) that can be contained within a given finite region of space with a finite amount of energy.",
                "The minimum mass required to form a black hole.",
                "The speed limit of quantum entanglement."
            ],
            correctAnswer: 1,
            explanation: "The Bekenstein bound is an upper limit on the entropy S (or information I) that can be contained within a given finite region of space which has a finite amount of energy. S ≤ (2πkRE)/(hc)."
        },
        {
            question: "The Hawking Radiation Collectors must handle extreme temperatures as the Planck star mass approaches the Planck mass. How does the Hawking temperature of a Schwarzschild black hole scale with its mass M?",
            options: [
                "T is directly proportional to M",
                "T is proportional to M squared",
                "T is inversely proportional to M",
                "T is independent of M"
            ],
            correctAnswer: 2,
            explanation: "The Hawking temperature is given by T = (hc^3) / (8πkGM). Therefore, the temperature is inversely proportional to the mass of the black hole. As the mass approaches the Planck mass, the temperature approaches the Planck temperature (violently hot)."
        },
        {
            question: "The Ergosphere Torus facilitates energy extraction via the Penrose Process. What is the theoretical maximum efficiency of energy extraction from a rotating (Kerr) black hole using this process?",
            options: [
                "10%",
                "20.7%",
                "29%",
                "42.8%"
            ],
            correctAnswer: 2,
            explanation: "For an extreme Kerr black hole (spinning at the maximum possible rate), the irreducible mass is M_ir = M / sqrt(2). The maximum energy that can be extracted is M - M_ir, which is approximately 29.29% of the initial total mass-energy of the black hole."
        }
    ];

    // ==========================================
    // 6. EXTREME ANIMATION LOGIC
    // ==========================================

    function animate(time, speed, meshesGroup) {
        const t = time * speed;

        // 1. Core Vibrations (Quantum Superposition)
        // The core pulses rapidly and erratically
        const pulse = 1 + Math.sin(t * 50) * 0.05 + Math.random() * 0.05;
        if (meshes.singularity) {
            meshes.singularity.scale.set(pulse, pulse, pulse);
            // Flicker between black hole and white hole emissive intensity
            meshes.singularity.material.emissiveIntensity = 5.0 + Math.sin(t * 30) * 4.0;
        }

        // 2. Event Horizon wobbles due to extreme gravity waves
        if (meshes.eventHorizon) {
            meshes.eventHorizon.scale.set(
                1 + Math.sin(t * 10) * 0.02,
                1 + Math.cos(t * 11) * 0.02,
                1 + Math.sin(t * 12) * 0.02
            );
        }

        // 3. Ergosphere rapid rotation
        if (meshes.ergosphere) {
            meshes.ergosphere.rotation.y = t * 5.0; // Extreme spin
            meshes.ergosphere.rotation.z = Math.sin(t * 2) * 0.1; // Precession
        }

        // 4. Hawking Radiation Jets pulsing
        if (meshes.jetTop && meshes.jetBottom) {
            const jetPulse = 1 + Math.sin(t * 20) * 0.2;
            meshes.jetTop.scale.set(jetPulse, 1, jetPulse);
            meshes.jetBottom.scale.set(jetPulse, 1, jetPulse);
            meshes.jetTop.material.emissiveIntensity = 10 + Math.random() * 10;
        }

        // 5. Accretion Disk / Energy Rings complex chaotic spin
        energyRings.forEach((ring, index) => {
            const speedMult = (index + 1) * 2.0;
            ring.rotation.z += 0.05 * speed * speedMult;
            ring.rotation.x += 0.01 * speed * Math.sin(t + index);
            ring.scale.setScalar(1 + Math.sin(t * 15 + index) * 0.03);
        });

        // 6. Loop Quantum Gravity Tethers writhing and glowing
        tethers.forEach((tetherData, index) => {
            const { mesh, startPt, endPt, timeOffset } = tetherData;
            const currentT = t + timeOffset;
            
            // Re-generate tube geometry to animate the path
            class AnimateCurve extends THREE.Curve {
                getPoint(u, opt = new THREE.Vector3()) {
                    const tx = startPt.x + (endPt.x - startPt.x) * u;
                    const ty = startPt.y + (endPt.y - startPt.y) * u;
                    const tz = startPt.z + (endPt.z - startPt.z) * u;
                    
                    // Violent quantum fluctuations
                    const wobbleX = Math.sin(u * Math.PI * 8 + currentT * 10) * 2.0 * (1 - Math.abs(2 * u - 1));
                    const wobbleY = Math.cos(u * Math.PI * 12 + currentT * 15) * 2.0 * (1 - Math.abs(2 * u - 1));
                    const wobbleZ = Math.sin(u * Math.PI * 10 - currentT * 12) * 2.0 * (1 - Math.abs(2 * u - 1));
                    
                    return opt.set(tx + wobbleX, ty + wobbleY, tz + wobbleZ);
                }
            }
            
            const newGeom = new THREE.TubeGeometry(new AnimateCurve(), 32, 0.5, 8, false);
            mesh.geometry.dispose();
            mesh.geometry = newGeom;

            // Flash white-hot when under extreme strain
            if (Math.sin(currentT * 5) > 0.8) {
                mesh.material = matTetherHot;
            } else {
                mesh.material = matTetherGlowing;
            }
        });

        // 7. Giant Crawler Wheels rotating and suspension bounce
        wheels.forEach((wheel, index) => {
            // Forward movement spin
            const spinDir = wheel.position.x > 0 ? 1 : -1;
            wheel.rotation.z -= 0.05 * speed * spinDir;
            
            // Suspension micro-adjustments
            wheel.position.y = 30 + Math.sin(t * 10 + index) * 1.5;
        });

        // 8. Hydraulic Pistons adjusting dynamically
        pistons.forEach((innerCylinder, index) => {
            // Rapidly sliding in and out to counter gravity waves
            innerCylinder.position.y = 56 + Math.sin(t * 20 + index * 2) * 5;
        });

        // 9. Exhaust stack particles pulsing
        lights.forEach((light, index) => {
            light.scale.setScalar(1 + Math.random() * 0.5);
            light.position.y = 80 + Math.sin(t * 5 + index) * 5;
            light.material.emissiveIntensity = 2 + Math.random() * 5;
        });
        
        // 10. General machine subtle rumble
        meshesGroup.position.y = Math.sin(t * 20) * 0.5;
        meshesGroup.rotation.z = Math.sin(t * 15) * 0.005;
    }

    return {
        group,
        parts,
        description: "The Ultra God Tier Planck Star Stabilizer. A billion-ton mobile crawling fortress designed to safely suspend, contain, and extract energy from a black hole/white hole quantum superposition using loop-quantum-gravity tethers and tachyon fields.",
        quizQuestions,
        animate
    };
}
