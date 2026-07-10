import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';
import * as THREE from 'three';

export function createMachine() {
    const group = new THREE.Group();
    const parts = [];

    // --- ADVANCED MATERIALS ---
    const neonCyan = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 3.0, metalness: 0.1, roughness: 0.1 });
    const neonOrange = new THREE.MeshStandardMaterial({ color: 0xff6600, emissive: 0xff3300, emissiveIntensity: 4.0, metalness: 0.3, roughness: 0.2 });
    const neonMagenta = new THREE.MeshStandardMaterial({ color: 0xff00ff, emissive: 0xaa00aa, emissiveIntensity: 2.5, metalness: 0.2, roughness: 0.2 });
    const magFieldMat = new THREE.MeshPhysicalMaterial({ color: 0x00aaff, emissive: 0x0055ff, emissiveIntensity: 2.0, transparent: true, opacity: 0.2, wireframe: true, transmission: 0.9 });
    const starCrustMat = new THREE.MeshStandardMaterial({ color: 0x111111, emissive: 0x220000, emissiveIntensity: 0.8, metalness: 0.9, roughness: 0.7, wireframe: true });
    const pastaMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00aa00, emissiveIntensity: 5.0, metalness: 1.0, roughness: 0.0, transparent: true, opacity: 0.8 });
    const superDenseAlloy = new THREE.MeshPhysicalMaterial({ color: 0x222222, metalness: 1.0, roughness: 0.4, clearcoat: 1.0, clearcoatRoughness: 0.1 });
    const heatShieldMat = new THREE.MeshStandardMaterial({ color: 0x883300, metalness: 0.6, roughness: 0.8 });
    const goldFoil = new THREE.MeshStandardMaterial({ color: 0xffcc00, metalness: 1.0, roughness: 0.3 });
    const reactorGlow = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 10.0 });
    
    // --- HELPER FUNCTIONS ---
    function createCylinder(rT, rB, h, rSeg, mat) {
        const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rT, rB, h, rSeg), mat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    }

    function createTorus(r, t, rSeg, tSeg, mat) {
        const mesh = new THREE.Mesh(new THREE.TorusGeometry(r, t, rSeg, tSeg), mat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    }

    // --- COMPLEX WHEEL ASSEMBLIES (TIRES) ---
    // User specifically requested TorusGeometry with hundreds of tiny extruded BoxGeometry lugs, CylinderGeometry rims, complex spokes.
    function createHeavyGravityTire(isRightSide) {
        const tireGroup = new THREE.Group();
        
        // Main Torus
        const mainTire = createTorus(12, 4, 64, 128, rubber);
        tireGroup.add(mainTire);
        
        // Hundreds of tiny extruded lugs for grip on nuclear pasta
        const lugCount = 200;
        const lugGeo = new THREE.BoxGeometry(1.5, 2.5, 9);
        for(let i = 0; i < lugCount; i++) {
            const theta = (i / lugCount) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, rubber);
            lug.position.x = Math.cos(theta) * 15;
            lug.position.y = Math.sin(theta) * 15;
            lug.rotation.z = theta + (i % 2 === 0 ? 0.1 : -0.1); // Zigzag tread pattern
            lug.castShadow = true;
            tireGroup.add(lug);
        }
        
        // Complex Cylinder Rims
        const rimGeo = new THREE.CylinderGeometry(8, 8, 8.5, 64);
        rimGeo.rotateX(Math.PI / 2);
        const rim = new THREE.Mesh(rimGeo, superDenseAlloy);
        tireGroup.add(rim);
        
        // Complex Spoke Arrays
        const spokeCount = 24;
        for(let i = 0; i < spokeCount; i++) {
            const theta = (i / spokeCount) * Math.PI * 2;
            
            // Primary Spoke
            const spoke = createCylinder(0.8, 1.2, 12, 16, chrome);
            spoke.position.x = Math.cos(theta) * 6;
            spoke.position.y = Math.sin(theta) * 6;
            spoke.rotation.z = theta;
            spoke.rotation.x = Math.PI / 2;
            tireGroup.add(spoke);
            
            // Secondary reinforcement strut
            const strut = createCylinder(0.3, 0.3, 10, 8, steel);
            strut.position.x = Math.cos(theta + 0.1) * 5;
            strut.position.y = Math.sin(theta + 0.1) * 5;
            strut.position.z = isRightSide ? 2 : -2;
            strut.rotation.z = theta + 0.2;
            strut.rotation.x = Math.PI / 2.5 * (isRightSide ? 1 : -1);
            tireGroup.add(strut);
        }

        // Central Hub with glowing core
        const hub = createCylinder(3, 3, 9, 32, darkSteel);
        hub.rotation.x = Math.PI / 2;
        tireGroup.add(hub);
        
        const hubGlow = createCylinder(1, 1, 9.2, 32, neonCyan);
        hubGlow.rotation.x = Math.PI / 2;
        tireGroup.add(hubGlow);
        
        return tireGroup;
    }

    const wheelPositions = [
        [-45, 12, -35], [45, 12, -35], 
        [-45, 12, 35], [45, 12, 35],
        [-45, 12, 0], [45, 12, 0],
        [-45, 12, -70], [45, 12, -70],
        [-45, 12, 70], [45, 12, 70]
    ];
    
    const wheels = [];
    wheelPositions.forEach((pos, index) => {
        const isRight = pos[0] > 0;
        const wheel = createHeavyGravityTire(isRight);
        wheel.position.set(pos[0], pos[1], pos[2]);
        if (isRight) wheel.rotation.y = Math.PI;
        group.add(wheel);
        wheels.push(wheel);
        
        parts.push({
            name: `Hyper-Grav Traction Wheel Assembly ${index + 1}`,
            description: "Toroidal traction device with hundreds of macro-lugs specifically designed to grip the solid lattice of a neutron star's iron-56 crust.",
            material: "Degenerate Rubber & Super-Dense Alloy",
            function: "Provides locomotion against 10^11 Gs of gravity.",
            assemblyOrder: 1 + index,
            connections: ["Suspension Struts", "Magnetic Axles"],
            failureEffect: "Irrecoverable sinking into the nuclear pasta layer.",
            cascadeFailures: ["Drive motor implosion", "Locomotion loss"],
            originalPosition: { x: pos[0], y: pos[1], z: pos[2] },
            explodedPosition: { x: pos[0] * 1.8, y: pos[1], z: pos[2] * 1.5 }
        });
    });

    // --- SUSPENSION AND HYDRAULIC PISTONS ---
    const suspensionSystems = [];
    wheelPositions.forEach((pos, index) => {
        const isRight = pos[0] > 0;
        const suspGroup = new THREE.Group();
        
        // Main Shock Absorber
        const outerShock = createCylinder(2, 2, 20, 16, darkSteel);
        const innerShock = createCylinder(1.5, 1.5, 20, 16, chrome);
        innerShock.position.y = -10;
        suspGroup.add(outerShock);
        suspGroup.add(innerShock);
        
        // Spring using TubeGeometry
        class SpringCurve extends THREE.Curve {
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const height = 15;
                const coils = 5;
                const radius = 3;
                const x = Math.cos(t * Math.PI * 2 * coils) * radius;
                const z = Math.sin(t * Math.PI * 2 * coils) * radius;
                const y = (t * height) - (height / 2);
                return optionalTarget.set(x, y, z);
            }
        }
        const springGeo = new THREE.TubeGeometry(new SpringCurve(), 100, 0.5, 16, false);
        const spring = new THREE.Mesh(springGeo, steel);
        spring.position.y = -5;
        suspGroup.add(spring);
        
        suspGroup.position.set(pos[0] + (isRight ? -10 : 10), pos[1] + 15, pos[2]);
        suspGroup.rotation.z = isRight ? Math.PI / 6 : -Math.PI / 6;
        
        group.add(suspGroup);
        suspSystems.push({ group: suspGroup, inner: innerShock, spring: spring });
    });
    
    var suspSystems = suspensionSystems; // local ref

    // --- MAIN MONOLITHIC HULL ---
    const hullGroup = new THREE.Group();
    
    // Base layered extrusions for armored plating
    const hullShape = new THREE.Shape();
    hullShape.moveTo(-30, -90);
    hullShape.lineTo(30, -90);
    hullShape.lineTo(40, -60);
    hullShape.lineTo(35, 60);
    hullShape.lineTo(20, 95);
    hullShape.lineTo(-20, 95);
    hullShape.lineTo(-35, 60);
    hullShape.lineTo(-40, -60);
    hullShape.lineTo(-30, -90);
    
    const extrudeSettings = { depth: 35, bevelEnabled: true, bevelSegments: 8, steps: 4, bevelSize: 2, bevelThickness: 3 };
    const hullGeo = new THREE.ExtrudeGeometry(hullShape, extrudeSettings);
    hullGeo.center();
    const mainHull = new THREE.Mesh(hullGeo, superDenseAlloy);
    mainHull.rotation.x = Math.PI / 2;
    mainHull.position.y = 35;
    hullGroup.add(mainHull);
    
    // Heat Shielding Plating
    const shieldShape = new THREE.Shape();
    shieldShape.moveTo(-28, -88);
    shieldShape.lineTo(28, -88);
    shieldShape.lineTo(38, -58);
    shieldShape.lineTo(33, 58);
    shieldShape.lineTo(18, 93);
    shieldShape.lineTo(-18, 93);
    shieldShape.lineTo(-33, 58);
    shieldShape.lineTo(-38, -58);
    shieldShape.lineTo(-28, -88);
    
    const shieldExtrude = { depth: 5, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 1, bevelThickness: 1 };
    const shieldGeo = new THREE.ExtrudeGeometry(shieldShape, shieldExtrude);
    shieldGeo.center();
    const heatShield = new THREE.Mesh(shieldGeo, heatShieldMat);
    heatShield.rotation.x = Math.PI / 2;
    heatShield.position.y = 15; // Bottom plate
    hullGroup.add(heatShield);
    
    group.add(hullGroup);

    parts.push({
        name: "Monolithic Degenerate Matter Hull",
        description: "Primary chassis forged from a collapsed alloy of tungsten and degenerate electrons, capable of withstanding starquakes.",
        material: "Super-Dense Alloy",
        function: "Houses all internal systems and prevents immediate spaghettification of the crew.",
        assemblyOrder: 15,
        connections: ["Suspension Systems", "Reactor Core", "Drill Assembly"],
        failureEffect: "Crushing implosion reducing the entire machine to a pancake one atom thick.",
        cascadeFailures: ["Total structural obliteration"],
        originalPosition: { x: 0, y: 35, z: 0 },
        explodedPosition: { x: 0, y: 80, z: 0 }
    });

    // --- REACTOR CORE & MAGNETIC FIELD GENERATORS ---
    const reactorGroup = new THREE.Group();
    
    const reactorCore = new THREE.Mesh(new THREE.SphereGeometry(15, 64, 64), reactorGlow);
    reactorGroup.add(reactorCore);
    
    // Magnetic containment rings
    const magRings = [];
    for(let i = 0; i < 5; i++) {
        const ring = createTorus(20 + i * 3, 1.5, 32, 100, magFieldMat);
        ring.rotation.x = Math.random() * Math.PI;
        ring.rotation.y = Math.random() * Math.PI;
        reactorGroup.add(ring);
        magRings.push(ring);
    }
    
    // Core structural cage
    const cageGeo = new THREE.IcosahedronGeometry(28, 1);
    const cage = new THREE.Mesh(cageGeo, new THREE.MeshStandardMaterial({ color: 0x333333, wireframe: true, wireframeLinewidth: 3 }));
    reactorGroup.add(cage);
    
    reactorGroup.position.set(0, 50, -40);
    group.add(reactorGroup);
    
    parts.push({
        name: "Magnetar Resonant Reactor Core",
        description: "Harnesses the ambient 10^15 Gauss magnetic field lines to generate localized anti-gravity and power.",
        material: "Plasma & Magnetic Field Lines",
        function: "Power generation and local gravity negation.",
        assemblyOrder: 20,
        connections: ["Main Hull", "Cooling Towers"],
        failureEffect: "Uncontained plasma breach, instant vaporization.",
        cascadeFailures: ["Magnetic shielding collapse", "Hull implosion"],
        originalPosition: { x: 0, y: 50, z: -40 },
        explodedPosition: { x: 0, y: 150, z: -60 }
    });

    // --- HYDRAULIC LINES & CABLING (TUBE GEOMETRY) ---
    class PipeCurve extends THREE.Curve {
        constructor(startX, startY, startZ, endX, endY, endZ) {
            super();
            this.points = [
                new THREE.Vector3(startX, startY, startZ),
                new THREE.Vector3(startX, startY + 20, startZ + 20),
                new THREE.Vector3(endX, endY + 20, endZ - 20),
                new THREE.Vector3(endX, endY, endZ)
            ];
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const spline = new THREE.CubicBezierCurve3(this.points[0], this.points[1], this.points[2], this.points[3]);
            return spline.getPoint(t, optionalTarget);
        }
    }

    const pipes = [];
    for(let i = 0; i < 30; i++) {
        const startX = (Math.random() - 0.5) * 40;
        const startZ = (Math.random() - 0.5) * 80;
        const endX = (Math.random() - 0.5) * 40;
        const endZ = (Math.random() - 0.5) * 80;
        const path = new PipeCurve(startX, 45, startZ, endX, 45, endZ);
        const pipeGeo = new THREE.TubeGeometry(path, 64, 0.8 + Math.random() * 1.5, 12, false);
        const mat = Math.random() > 0.5 ? copper : (Math.random() > 0.5 ? goldFoil : darkSteel);
        const pipe = new THREE.Mesh(pipeGeo, mat);
        group.add(pipe);
        pipes.push(pipe);
    }
    
    parts.push({
        name: "Superfluid Helium-3 Coolant Lines",
        description: "Intricate network of pipes circulating superfluid He-3 to prevent the drill and reactor from melting down.",
        material: "Copper, Gold Foil, Dark Steel",
        function: "Thermal regulation across the entire vessel.",
        assemblyOrder: 25,
        connections: ["Reactor Core", "Drill Assembly", "Radiator Fins"],
        failureEffect: "Thermal runaway and catastrophic melting of the hull.",
        cascadeFailures: ["Drill seizure", "Reactor breach"],
        originalPosition: { x: 0, y: 45, z: 0 },
        explodedPosition: { x: 0, y: 100, z: 0 }
    });

    // --- OPERATOR CABIN & INTERIOR DETAILS ---
    const cabinGroup = new THREE.Group();
    
    // Cabin Exterior
    const cabinExtGeo = new THREE.BoxGeometry(24, 18, 26);
    const cabinExt = new THREE.Mesh(cabinExtGeo, steel);
    cabinGroup.add(cabinExt);
    
    // Tinted Viewports
    const viewportGeo = new THREE.BoxGeometry(22, 10, 27);
    const viewport = new THREE.Mesh(viewportGeo, tinted);
    viewport.position.y = 2;
    cabinGroup.add(viewport);
    
    // Cabin Interior Details (visible through tinted glass if close)
    const seatGeo = new THREE.BoxGeometry(4, 6, 4);
    const seat = new THREE.Mesh(seatGeo, rubber);
    seat.position.set(0, -5, 5);
    cabinGroup.add(seat);
    
    const consoleGeo = new THREE.BoxGeometry(16, 4, 6);
    const controlConsole = new THREE.Mesh(consoleGeo, darkSteel);
    controlConsole.position.set(0, -4, -8);
    controlConsole.rotation.x = Math.PI / 8;
    cabinGroup.add(controlConsole);
    
    // Glowing Screens on Console
    for(let i=0; i<3; i++) {
        const screenGeo = new THREE.PlaneGeometry(4, 3);
        const screen = new THREE.Mesh(screenGeo, neonCyan);
        screen.position.set((i-1)*5, -3, -10);
        screen.rotation.x = -Math.PI / 8;
        cabinGroup.add(screen);
    }
    
    // Joysticks
    const joyStickGeo = new THREE.CylinderGeometry(0.2, 0.2, 3);
    const joy1 = new THREE.Mesh(joyStickGeo, chrome);
    joy1.position.set(-5, -2, -6);
    joy1.rotation.x = Math.PI / 6;
    cabinGroup.add(joy1);
    
    const joy2 = joy1.clone();
    joy2.position.set(5, -2, -6);
    cabinGroup.add(joy2);
    
    // Roof Antennas / Sensors
    for(let i=0; i<4; i++) {
        const antenna = createCylinder(0.2, 0.5, 15, 8, chrome);
        antenna.position.set((i%2===0?-10:10), 16, (i<2?-10:10));
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(1), neonOrange);
        bulb.position.y = 7.5;
        antenna.add(bulb);
        cabinGroup.add(antenna);
    }

    cabinGroup.position.set(0, 70, 20);
    group.add(cabinGroup);

    parts.push({
        name: "Command and Control Bridge",
        description: "Neutron-shielded cabin featuring redundant fly-by-wire controls and high-fidelity sensor arrays.",
        material: "Steel, Tinted Glass, Neon Displays",
        function: "Safely houses the operator in an environment lethal millions of times over.",
        assemblyOrder: 30,
        connections: ["Main Hull", "Sensor Arrays"],
        failureEffect: "Immediate lethal radiation exposure and crushing of the operator.",
        cascadeFailures: ["Total loss of manual control"],
        originalPosition: { x: 0, y: 70, z: 20 },
        explodedPosition: { x: 0, y: 120, z: 40 }
    });

    // --- MASSIVE PASTA EXTRACTOR DRILL (LATHE + EXTRUDE) ---
    const drillAssembly = new THREE.Group();
    
    // Main Drill Collar
    const collar = createCylinder(12, 15, 20, 32, darkSteel);
    drillAssembly.add(collar);
    
    // Lathe Geometry Drill Core
    const drillPoints = [];
    for (let i = 0; i <= 50; i++) {
        const radius = 10 - (i * 0.18); // Tapers to a point
        const height = -i * 2;
        drillPoints.push(new THREE.Vector2(Math.max(radius, 0.1), height));
    }
    const drillCoreGeo = new THREE.LatheGeometry(drillPoints, 64);
    const drillCore = new THREE.Mesh(drillCoreGeo, chrome);
    drillCore.position.y = -10;
    drillAssembly.add(drillCore);
    
    // Helical Flutes (Blades) using TubeGeometry wrapping around the core
    const fluteCount = 4;
    for(let f = 0; f < fluteCount; f++) {
        class FluteCurve extends THREE.Curve {
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const heightOffset = t * 100;
                const r = 10 - (t * 10) + 1; // slightly larger than core
                const angle = (t * Math.PI * 10) + ((f / fluteCount) * Math.PI * 2);
                return optionalTarget.set(Math.cos(angle) * r, -10 - heightOffset, Math.sin(angle) * r);
            }
        }
        const fluteGeo = new THREE.TubeGeometry(new FluteCurve(), 128, 1.5, 16, false);
        const flute = new THREE.Mesh(fluteGeo, neonMagenta);
        drillAssembly.add(flute);
    }
    
    // Extraction Tube (Internal)
    const extractionTube = createCylinder(4, 4, 110, 32, glass);
    extractionTube.position.y = -60;
    drillAssembly.add(extractionTube);
    
    // Pasta chunks flowing up the tube
    const pastaChunks = [];
    const chunkGeo = new THREE.IcosahedronGeometry(1.5, 0);
    for(let i=0; i<20; i++) {
        const chunk = new THREE.Mesh(chunkGeo, pastaMat);
        chunk.position.y = -110 + (i * 5);
        chunk.rotation.set(Math.random(), Math.random(), Math.random());
        drillAssembly.add(chunk);
        pastaChunks.push({ mesh: chunk, offset: i * 5 });
    }
    
    drillAssembly.position.set(0, 35, 90);
    drillAssembly.rotation.x = -Math.PI / 3;
    group.add(drillAssembly);
    
    parts.push({
        name: "Hyper-Dense Nuclear Pasta Extractor",
        description: "A lathe-machined, multi-fluted drill head that operates at hypersonic RPM to sheer through the Gnocchi and Spaghetti phases of degenerate matter.",
        material: "Chrome, Neon Emitters, Reinforced Glass",
        function: "Extracts ultra-dense matter from the neutron star crust.",
        assemblyOrder: 40,
        connections: ["Front Hull", "Pasta Containment Silos"],
        failureEffect: "Drill bit shattering, unleashing explosive kinetic energy.",
        cascadeFailures: ["Hydraulic blowout", "Hull breach"],
        originalPosition: { x: 0, y: 35, z: 90 },
        explodedPosition: { x: 0, y: 35, z: 160 }
    });

    // --- HYDRAULIC PISTONS FOR DRILL ARTICULATION ---
    const drillPistons = [];
    for(let i=0; i<4; i++) {
        const pGroup = new THREE.Group();
        const outer = createCylinder(3, 3, 40, 32, darkSteel);
        const inner = createCylinder(2, 2, 40, 32, chrome);
        inner.position.y = -20;
        pGroup.add(outer);
        pGroup.add(inner);
        
        pGroup.position.set((i < 2 ? -15 : 15), 45, 60 + (i % 2 === 0 ? 0 : 15));
        pGroup.lookAt(0, 35, 90);
        group.add(pGroup);
        drillPistons.push({ group: pGroup, inner: inner });
    }

    // --- COOLING TOWERS / RADIATORS ---
    const radiatorGroup = new THREE.Group();
    for(let i=0; i<20; i++) {
        const finGeo = new THREE.BoxGeometry(2, 30, 15);
        const fin = new THREE.Mesh(finGeo, aluminum);
        fin.position.set((i - 10) * 4, 15, 0);
        radiatorGroup.add(fin);
    }
    radiatorGroup.position.set(0, 75, -20);
    group.add(radiatorGroup);

    parts.push({
        name: "Photon Emission Radiator Array",
        description: "Massive aluminum fins designed to radiate petawatts of waste heat directly into the freezing vacuum of space.",
        material: "Aluminum",
        function: "Dissipates extreme thermal loads from the reactor and drill.",
        assemblyOrder: 35,
        connections: ["Coolant Lines", "Upper Hull"],
        failureEffect: "Instantaneous melting of internal electronics.",
        cascadeFailures: ["Reactor meltdown"],
        originalPosition: { x: 0, y: 75, z: -20 },
        explodedPosition: { x: 0, y: 140, z: -20 }
    });

    // --- NEUTRON STAR SURFACE (ENVIRONMENTAL CONTEXT) ---
    // A terrifyingly intense, fast-spinning neutron star surface
    const starSurfaceGroup = new THREE.Group();
    
    const starGeo = new THREE.SphereGeometry(2000, 256, 256);
    const star = new THREE.Mesh(starGeo, starCrustMat);
    star.position.y = -2005; // Ground level is at y= -5 essentially
    starSurfaceGroup.add(star);
    
    // Magnetic field lines erupting from the surface
    const fieldLines = [];
    for(let i=0; i<50; i++) {
        const path = new PipeCurve(
            (Math.random()-0.5)*300, 0, (Math.random()-0.5)*300,
            (Math.random()-0.5)*300, 200 + Math.random()*200, (Math.random()-0.5)*300
        );
        const lineGeo = new THREE.TubeGeometry(path, 32, 1.5, 8, false);
        const line = new THREE.Mesh(lineGeo, magFieldMat);
        line.position.y = -2005;
        starSurfaceGroup.add(line);
        fieldLines.push(line);
    }
    
    group.add(starSurfaceGroup);

    // --- ANIMATION LOGIC ---
    const state = {
        wheelRotation: 0,
        drillRotation: 0,
        pistonTime: 0,
        magTime: 0,
        pastaTime: 0,
        starquakeTimer: 0
    };

    const animate = (delta, speed, meshes) => {
        const scaledSpeed = speed * delta * 20; // Fast animations
        
        // Locomotion
        state.wheelRotation -= scaledSpeed * 0.5;
        wheels.forEach(w => {
            w.rotation.x = state.wheelRotation; // Assuming forward is along Z, wheels roll on X
        });
        
        // Suspension springs flexing slightly over the crust
        suspSystems.forEach((s, idx) => {
            const flex = Math.sin(state.wheelRotation * 5 + idx) * 2;
            s.inner.position.y = -10 + flex;
            s.spring.scale.y = 1 + (flex * 0.05);
        });

        // Drill Assembly Rotation (Extremely Fast)
        state.drillRotation += scaledSpeed * 5;
        drillAssembly.rotation.y = state.drillRotation; // Spin along local axis
        
        // Drill Articulation Pistons
        state.pistonTime += scaledSpeed * 0.2;
        drillPistons.forEach((p, idx) => {
            p.inner.position.y = -20 + Math.sin(state.pistonTime + idx) * 5;
        });
        
        // Pasta Extraction Flow
        state.pastaTime += scaledSpeed * 2;
        pastaChunks.forEach(c => {
            let yPos = -110 + ((c.offset + state.pastaTime) % 100);
            c.mesh.position.y = yPos;
            c.mesh.rotation.x += 0.1;
            c.mesh.rotation.y += 0.2;
        });
        
        // Magnetar Reactor Rings
        state.magTime += scaledSpeed * 0.5;
        magRings.forEach((ring, idx) => {
            ring.rotation.x += 0.05 * (idx % 2 === 0 ? 1 : -1);
            ring.rotation.y += 0.03;
            ring.scale.setScalar(1 + Math.sin(state.magTime * 5 + idx) * 0.1);
        });
        
        // Star Surface & Magnetic Lines (The Magnetar Environment)
        // 1000 Hz spin is visually represented by massive rotational speed
        starSurfaceGroup.rotation.y += scaledSpeed * 2;
        
        // Starquakes (Sudden violent snapping of magnetic field lines)
        state.starquakeTimer += delta;
        if (state.starquakeTimer > 5) {
            // Trigger Starquake
            if (state.starquakeTimer < 5.2) {
                star.position.x = (Math.random() - 0.5) * 10;
                star.position.z = (Math.random() - 0.5) * 10;
                fieldLines.forEach(line => {
                    line.material.emissiveIntensity = 10.0;
                    line.scale.x = 2.0;
                    line.scale.z = 2.0;
                });
            } else {
                star.position.x = 0;
                star.position.z = 0;
                fieldLines.forEach(line => {
                    line.material.emissiveIntensity = 2.0;
                    line.scale.set(1, 1, 1);
                });
                state.starquakeTimer = 0;
            }
        }
    };

    const description = "Ultra God Tier Neutron Star Crust Miner. A monstrous, impossibly robust machine designed to harvest 'nuclear pasta' from the crushing depths of a magnetar's crust. Operating in an environment with a billion-tesla magnetic field and 10^11 Gs of gravity, it utilizes magnetic resonance shielding, ultra-dense degenerate matter plating, and heavy gravity traction wheels. Its primary drill lathe operates at hypersonic speeds to shear through the nuclear gnocchi and spaghetti phases of matter, while surviving apocalyptic starquakes.";

    const quizQuestions = [
        {
            question: "What is the primary theoretical phase of matter in the innermost crust of a neutron star, colloquially referred to as 'nuclear pasta'?",
            options: [
                "Quark-Gluon Plasma",
                "Gnocchi and Spaghetti phases (complex rods and slabs of nuclear matter)",
                "Superfluid Helium-3",
                "Bose-Einstein Condensate"
            ],
            answer: 1,
            explanation: "In the inner crust, the competition between short-range nuclear attraction and long-range Coulomb repulsion causes nucleons to arrange into complex geometric shapes, resembling pasta (gnocchi, spaghetti, lasagna) before dissolving into a uniform fluid core."
        },
        {
            question: "Which macroscopic property of a neutron star is most directly responsible for the immense structural stresses that lead to 'starquakes'?",
            options: [
                "Neutrino cooling rate exceeding photon emission",
                "The pinning of superfluid vortices to the solid crystalline crust",
                "Electron degeneracy pressure failing at the core",
                "Photodisintegration of iron-56 isotopes"
            ],
            answer: 1,
            explanation: "As the neutron star spins down over time, the superfluid interior and solid crust must rotate together. Superfluid vortices pin to the lattice of the solid crust, building immense mechanical stress until the crust catastrophically fractures in a starquake."
        },
        {
            question: "In the context of magnetars, what mechanism is primarily believed to power their intense soft gamma repeater (SGR) and anomalous X-ray pulsar (AXP) emissions?",
            options: [
                "Accretion of matter from a binary companion star",
                "Runaway nuclear fusion of residual surface hydrogen",
                "The decay and reorganization of their ultra-strong magnetic fields",
                "Hawking radiation emitted from a central singularity"
            ],
            answer: 2,
            explanation: "Unlike rotation-powered pulsars, magnetars are powered by the decay and violent reorganization of their extreme internal magnetic fields (up to 10^15 Gauss). These magnetic field shifts crack the crust and drive intense X-ray and gamma-ray flares."
        },
        {
            question: "What is the approximate mass density of the nuclear pasta formations found at the base of the neutron star crust?",
            options: [
                "10^3 kg/m^3 (Density of Water)",
                "10^9 kg/m^3 (Density of a White Dwarf)",
                "10^14 g/cm^3 (Nuclear Saturation Density)",
                "10^20 kg/m^3 (Density of a Black Hole Singularity)"
            ],
            answer: 2,
            explanation: "Nuclear pasta exists at densities just below nuclear saturation density, roughly around 10^14 grams per cubic centimeter (or 10^17 kg/m^3). At these extreme densities, atomic nuclei are squeezed so tightly they merge into continuous structures."
        },
        {
            question: "The outer crust of a neutron star, which this machine must traverse, is primarily composed of what type of nuclei forming a rigid body-centered cubic (bcc) crystal lattice?",
            options: [
                "Hydrogen and Helium-4",
                "Iron-56 and increasingly neutron-rich isotopes",
                "Free-floating quarks and gluons",
                "Antimatter positrons and antiprotons"
            ],
            answer: 1,
            explanation: "The outermost surface begins largely as iron-56, the end point of stellar nucleosynthesis. As depth and pressure increase, electrons are squeezed into protons via electron capture, creating increasingly neutron-rich isotopes (like Iron-62 or Krypton-118) forming a rigid crystal lattice until the 'neutron drip' line is reached."
        }
    ];

    return { group, parts, description, quizQuestions, animate };
}
