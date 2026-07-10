import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

/**
 * GOD TIER TACHYON-TACHYON COLLIDER
 * ---------------------------------------------------------
 * A theoretical, FTL (Faster-Than-Light) causality-violating 
 * particle accelerator. This massive construct contains particles 
 * moving backward in time and induces forced collisions at the 
 * Causality Inversion Core to study pre-Big Bang baryogenesis.
 * ---------------------------------------------------------
 */
export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {
        tachyonStreams: [],
        magnets: [],
        pistons: [],
        wheels: [],
        radars: [],
        baffles: [],
        gears: [],
        neonArrays: [],
        particles: []
    };

    // ==========================================
    // CUSTOM GLOWING & EXOTIC MATERIALS
    // ==========================================
    const tachyonGlow = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 6.0,
        transparent: true,
        opacity: 0.9,
        wireframe: false
    });

    const cherenkovBlue = new THREE.MeshStandardMaterial({
        color: 0x0011ff,
        emissive: 0x0033ff,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
    });

    const hyperGold = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 1.0,
        roughness: 0.1,
        emissive: 0x332200,
        emissiveIntensity: 0.5
    });

    const neonPurple = new THREE.MeshStandardMaterial({
        color: 0x8a2be2,
        emissive: 0x8a2be2,
        emissiveIntensity: 4.5,
        wireframe: true
    });

    const quantumGlass = new THREE.MeshStandardMaterial({
        color: 0xaaaaaa,
        transparent: true,
        opacity: 0.2,
        metalness: 1.0,
        roughness: 0.0
    });

    const plasmaRed = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 8.0,
        transparent: true,
        opacity: 0.85
    });

    const darkMatterShell = new THREE.MeshStandardMaterial({
        color: 0x020202,
        roughness: 0.95,
        metalness: 0.2
    });

    const consoleScreen = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 2.0
    });

    const alertScreen = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 3.0,
        wireframe: true
    });

    // ==========================================
    // HELPER FUNCTIONS FOR EXTREME COMPLEXITY
    // ==========================================

    function createExtrudedGear(radius, teeth, depth, material) {
        const shape = new THREE.Shape();
        const innerRad = radius * 0.8;
        const outerRad = radius;
        for (let i = 0; i < teeth * 2; i++) {
            const r = i % 2 === 0 ? outerRad : innerRad;
            const angle = (i / (teeth * 2)) * Math.PI * 2;
            if (i === 0) shape.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
            else shape.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
        }
        shape.closePath();
        const extrudeSettings = { depth: depth, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.5, bevelThickness: 0.5 };
        const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const mesh = new THREE.Mesh(geo, material);
        // Center the geometry
        geo.translate(0, 0, -depth / 2);
        return mesh;
    }

    function createComplexTire(radius, tubeRadius) {
        const tireGroup = new THREE.Group();
        
        // Main torus body of the tire
        const tireGeo = new THREE.TorusGeometry(radius, tubeRadius, 48, 128);
        const mainTire = new THREE.Mesh(tireGeo, rubber);
        tireGroup.add(mainTire);
        
        // Hundreds of tiny extruded BoxGeometry lugs for aggressive off-road treads
        const lugGeo = new THREE.BoxGeometry(tubeRadius * 2.4, tubeRadius * 0.9, tubeRadius * 0.6);
        const numLugs = 150;
        for (let i = 0; i < numLugs; i++) {
            const angle = (i / numLugs) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, rubber);
            lug.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
            lug.rotation.z = angle;
            // Stagger lugs for realistic tread pattern
            lug.position.z = (i % 2 === 0) ? tubeRadius * 0.5 : -tubeRadius * 0.5;
            lug.rotation.y = (i % 2 === 0) ? 0.2 : -0.2;
            tireGroup.add(lug);
        }
        
        // Complex CylinderGeometry Rim
        const rimRad = radius - tubeRadius + 1;
        const rimGeo = new THREE.CylinderGeometry(rimRad, rimRad, tubeRadius * 2.1, 64);
        const rim = new THREE.Mesh(rimGeo, chrome);
        rim.rotation.x = Math.PI / 2;
        tireGroup.add(rim);

        // Intricate spoke arrays
        const numSpokes = 16;
        const spokeGeo = new THREE.CylinderGeometry(tubeRadius * 0.15, tubeRadius * 0.15, rimRad * 2, 32);
        for (let i = 0; i < numSpokes; i++) {
            const spoke = new THREE.Mesh(spokeGeo, steel);
            spoke.rotation.x = Math.PI / 2;
            spoke.rotation.z = (i / numSpokes) * Math.PI;
            tireGroup.add(spoke);
            
            // Add cross-bracing to spokes
            const brace = new THREE.Mesh(spokeGeo, darkSteel);
            brace.rotation.x = Math.PI / 2;
            brace.rotation.z = ((i + 0.5) / numSpokes) * Math.PI;
            brace.scale.set(0.5, 0.5, 0.5);
            tireGroup.add(brace);
        }
        
        // Central hubcap and bolts
        const hubGeo = new THREE.CylinderGeometry(tubeRadius * 1.5, tubeRadius * 1.5, tubeRadius * 2.5, 32);
        const hub = new THREE.Mesh(hubGeo, darkSteel);
        hub.rotation.x = Math.PI / 2;
        tireGroup.add(hub);

        const boltGeo = new THREE.CylinderGeometry(tubeRadius * 0.2, tubeRadius * 0.2, tubeRadius * 2.8, 8);
        for(let i=0; i<8; i++) {
            const angle = (i/8)*Math.PI*2;
            const bolt = new THREE.Mesh(boltGeo, chrome);
            bolt.position.set(Math.cos(angle)*tubeRadius, Math.sin(angle)*tubeRadius, 0);
            bolt.rotation.x = Math.PI/2;
            tireGroup.add(bolt);
        }

        return tireGroup;
    }

    function createHydraulicPiston(length, radius) {
        const pGroup = new THREE.Group();
        
        // Outer housing
        const housingGeo = new THREE.CylinderGeometry(radius, radius, length * 0.6, 32);
        const housing = new THREE.Mesh(housingGeo, darkSteel);
        housing.position.y = length * 0.3;
        pGroup.add(housing);
        
        // Housing details (rivets and rings)
        const ringGeo = new THREE.TorusGeometry(radius * 1.1, radius * 0.1, 16, 32);
        for(let i=1; i<=3; i++) {
            const ring = new THREE.Mesh(ringGeo, chrome);
            ring.position.y = length * 0.15 * i;
            ring.rotation.x = Math.PI/2;
            pGroup.add(ring);
        }

        // Inner shaft (Cylinder within Cylinder)
        const shaftGeo = new THREE.CylinderGeometry(radius * 0.6, radius * 0.6, length * 0.8, 32);
        const shaft = new THREE.Mesh(shaftGeo, chrome);
        shaft.position.y = length * 0.7; // Default extension
        pGroup.add(shaft);
        
        // Shaft mounting bracket
        const bracketGeo = new THREE.BoxGeometry(radius * 2, radius * 2, radius * 2);
        const bracket = new THREE.Mesh(bracketGeo, steel);
        bracket.position.y = length * 0.4;
        shaft.add(bracket);

        // Fluid line connecting housing to base
        class FluidCurve extends THREE.Curve {
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const x = Math.sin(t * Math.PI) * radius * 2;
                const y = t * length * 0.5;
                const z = Math.cos(t * Math.PI) * radius * 2;
                return optionalTarget.set(x, y, z);
            }
        }
        const pipeGeo = new THREE.TubeGeometry(new FluidCurve(), 32, radius * 0.15, 8, false);
        const pipe = new THREE.Mesh(pipeGeo, rubber);
        pGroup.add(pipe);

        return { group: pGroup, shaft: shaft };
    }

    // ==========================================
    // 1. PRIMARY TACHYON CONTAINMENT RING
    // ==========================================
    const ringRadius = 400;
    const ringThickness = 30;
    const ringAssembly = new THREE.Group();
    meshes.ringAssembly = ringAssembly;
    group.add(ringAssembly);

    // Main vacuum shell
    const shellGeo = new THREE.TorusGeometry(ringRadius, ringThickness, 128, 512);
    const shellMesh = new THREE.Mesh(shellGeo, darkMatterShell);
    shellMesh.rotation.x = Math.PI / 2;
    ringAssembly.add(shellMesh);

    // Inner tachyon stream (glowing)
    const streamGeo = new THREE.TorusGeometry(ringRadius, ringThickness * 0.2, 64, 512);
    const streamMesh = new THREE.Mesh(streamGeo, tachyonGlow);
    streamMesh.rotation.x = Math.PI / 2;
    ringAssembly.add(streamMesh);
    meshes.tachyonStreams.push(streamMesh);

    // Quantum Coolant Piping (Extensive hydraulic/tube lines wrapping the ring)
    class CoolantCurve extends THREE.Curve {
        constructor(offsetAngle) {
            super();
            this.offsetAngle = offsetAngle;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const mainAngle = t * Math.PI * 2;
            const wrapAngle = t * Math.PI * 100 + this.offsetAngle; // Wraps around 100 times
            
            const cx = Math.cos(mainAngle) * ringRadius;
            const cz = Math.sin(mainAngle) * ringRadius;
            
            // Direction of the torus tube at this point
            const dir = new THREE.Vector3(-Math.sin(mainAngle), 0, Math.cos(mainAngle));
            const up = new THREE.Vector3(0, 1, 0);
            const right = new THREE.Vector3().crossVectors(dir, up).normalize();
            
            const rX = right.x * Math.cos(wrapAngle) * (ringThickness + 5) + up.x * Math.sin(wrapAngle) * (ringThickness + 5);
            const rY = right.y * Math.cos(wrapAngle) * (ringThickness + 5) + up.y * Math.sin(wrapAngle) * (ringThickness + 5);
            const rZ = right.z * Math.cos(wrapAngle) * (ringThickness + 5) + up.z * Math.sin(wrapAngle) * (ringThickness + 5);
            
            return optionalTarget.set(cx + rX, rY, cz + rZ);
        }
    }
    
    for(let i=0; i<4; i++) {
        const pipeGeo = new THREE.TubeGeometry(new CoolantCurve((i/4)*Math.PI*2), 1000, 2, 16, true);
        const pipeMesh = new THREE.Mesh(pipeGeo, chrome);
        ringAssembly.add(pipeMesh);
    }

    // Superconducting Quadrupole Magnets
    const numMagnets = 120;
    const magGeo = new THREE.CylinderGeometry(ringThickness * 1.5, ringThickness * 1.5, 20, 64);
    for(let i=0; i<numMagnets; i++) {
        const angle = (i / numMagnets) * Math.PI * 2;
        const mag = new THREE.Mesh(magGeo, copper);
        mag.position.set(Math.cos(angle) * ringRadius, 0, Math.sin(angle) * ringRadius);
        mag.rotation.set(Math.PI/2, 0, -angle);
        
        // Magnet details
        const magDetail = new THREE.TorusGeometry(ringThickness * 1.6, 2, 16, 64);
        const mdMesh = new THREE.Mesh(magDetail, hyperGold);
        mag.add(mdMesh);
        
        ringAssembly.add(mag);
        meshes.magnets.push(mag);
    }

    // ==========================================
    // 2. CAUSALITY INVERSION CORE (CENTER)
    // ==========================================
    const coreAssembly = new THREE.Group();
    meshes.coreAssembly = coreAssembly;
    group.add(coreAssembly);

    // Multi-faceted gem-like structure
    const coreGeo = new THREE.IcosahedronGeometry(80, 2);
    const coreMesh = new THREE.Mesh(coreGeo, cherenkovBlue);
    coreAssembly.add(coreMesh);
    meshes.tachyonStreams.push(coreMesh); // Pulsing effect

    // Core Wireframe containment
    const coreFrameGeo = new THREE.IcosahedronGeometry(85, 2);
    const coreFrame = new THREE.Mesh(coreFrameGeo, neonPurple);
    coreAssembly.add(coreFrame);

    // Complex LatheGeometry Shells
    const shellPoints = [];
    for(let i=0; i<=100; i++) {
        const t = i/100;
        const y = (t - 0.5) * 200;
        const x = 50 + Math.sin(t * Math.PI) * 100 + Math.cos(t * Math.PI * 10) * 10; 
        shellPoints.push(new THREE.Vector2(x, y));
    }
    const coreShellGeo = new THREE.LatheGeometry(shellPoints, 128);
    const coreShell = new THREE.Mesh(coreShellGeo, quantumGlass);
    coreAssembly.add(coreShell);

    // Cherenkov Emission Baffles
    for(let i=0; i<12; i++) {
        const angle = (i/12) * Math.PI * 2;
        const baffleGeo = new THREE.CylinderGeometry(5, 20, 150, 32);
        const baffle = new THREE.Mesh(baffleGeo, hyperGold);
        baffle.position.set(Math.cos(angle)*120, 0, Math.sin(angle)*120);
        baffle.rotation.x = Math.PI/2;
        baffle.rotation.z = -angle;
        coreAssembly.add(baffle);
        meshes.baffles.push(baffle);
    }

    // ==========================================
    // 3. TEMPORAL OVERRIDE COMMAND RIG (MOBILE UNIT)
    // ==========================================
    // A massive vehicle driving along the outer edge of the ring
    const rigAssembly = new THREE.Group();
    meshes.rigAssembly = rigAssembly;
    // Position it on the outer edge
    rigAssembly.position.set(ringRadius + 150, -50, 0);
    group.add(rigAssembly);

    // Main Chassis
    const chassisGeo = new THREE.BoxGeometry(160, 40, 240);
    const chassis = new THREE.Mesh(chassisGeo, darkSteel);
    chassis.position.y = 40;
    rigAssembly.add(chassis);

    // Huge Off-Road Tires
    const wheelPositions = [
        [90, 20, 100], [-90, 20, 100],
        [90, 20, -100], [-90, 20, -100],
        [90, 20, 0], [-90, 20, 0] // 6-wheel drive
    ];
    wheelPositions.forEach((pos, idx) => {
        const wheel = createComplexTire(25, 10);
        wheel.position.set(pos[0], pos[1], pos[2]);
        wheel.rotation.y = Math.PI / 2; // Face forward
        
        // Add hydraulics connecting wheel to chassis
        const hyd = createHydraulicPiston(60, 4);
        hyd.group.position.set(pos[0] > 0 ? pos[0]-20 : pos[0]+20, pos[1]+20, pos[2]);
        hyd.group.rotation.z = pos[0] > 0 ? -Math.PI/6 : Math.PI/6;
        rigAssembly.add(hyd.group);
        meshes.pistons.push(hyd);

        rigAssembly.add(wheel);
        meshes.wheels.push(wheel);
    });

    // Detailed Operator Cabin
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, 80, 50);
    rigAssembly.add(cabinGroup);
    
    // Cabin base
    const cabBaseGeo = new THREE.BoxGeometry(100, 60, 80);
    const cabBase = new THREE.Mesh(cabBaseGeo, steel);
    cabinGroup.add(cabBase);

    // Tinted Glass Windows
    const windowGeoFront = new THREE.BoxGeometry(90, 30, 5);
    const windowFront = new THREE.Mesh(windowGeoFront, tinted);
    windowFront.position.set(0, 10, 40);
    cabinGroup.add(windowFront);

    const windowGeoSide = new THREE.BoxGeometry(5, 30, 60);
    const windowSideL = new THREE.Mesh(windowGeoSide, tinted);
    windowSideL.position.set(48, 10, 0);
    cabinGroup.add(windowSideL);
    
    const windowSideR = new THREE.Mesh(windowGeoSide, tinted);
    windowSideR.position.set(-48, 10, 0);
    cabinGroup.add(windowSideR);

    // Interior details (visible through glass)
    const steeringGeo = new THREE.TorusGeometry(8, 1, 16, 32);
    const steering = new THREE.Mesh(steeringGeo, plastic);
    steering.position.set(-20, 0, 30);
    steering.rotation.x = Math.PI / 4;
    cabinGroup.add(steering);

    const joystickGeo = new THREE.CylinderGeometry(1, 1, 15, 16);
    const joystick = new THREE.Mesh(joystickGeo, rubber);
    joystick.position.set(20, -10, 30);
    joystick.rotation.x = Math.PI / 6;
    cabinGroup.add(joystick);

    const screenGeo = new THREE.BoxGeometry(20, 15, 2);
    const screen1 = new THREE.Mesh(screenGeo, consoleScreen);
    screen1.position.set(-20, 15, 35);
    screen1.rotation.x = -Math.PI/8;
    cabinGroup.add(screen1);

    const screen2 = new THREE.Mesh(screenGeo, alertScreen);
    screen2.position.set(20, 15, 35);
    screen2.rotation.x = -Math.PI/8;
    cabinGroup.add(screen2);

    // Exterior Rig Details: Grilles, Exhausts, Mirrors, Ladders
    // Grille
    const grilleGroup = new THREE.Group();
    grilleGroup.position.set(0, 40, 122);
    const barGeo = new THREE.BoxGeometry(120, 2, 2);
    for(let i=0; i<15; i++) {
        const bar = new THREE.Mesh(barGeo, chrome);
        bar.position.y = (i - 7) * 4;
        grilleGroup.add(bar);
    }
    rigAssembly.add(grilleGroup);

    // Exhaust Stacks
    const exGeo = new THREE.CylinderGeometry(6, 6, 80, 32);
    const exL = new THREE.Mesh(exGeo, darkSteel);
    exL.position.set(60, 100, -80);
    rigAssembly.add(exL);
    
    const exR = new THREE.Mesh(exGeo, darkSteel);
    exR.position.set(-60, 100, -80);
    rigAssembly.add(exR);

    // Side Mirrors
    const mirrorBracketGeo = new THREE.CylinderGeometry(0.5, 0.5, 20, 8);
    const mirrorGeo = new THREE.BoxGeometry(5, 15, 2);
    
    const mirrorLGrp = new THREE.Group();
    const bracketL = new THREE.Mesh(mirrorBracketGeo, chrome);
    bracketL.rotation.z = Math.PI/2;
    bracketL.position.set(60, 10, 30);
    const mirrorL = new THREE.Mesh(mirrorGeo, glass);
    mirrorL.position.set(70, 10, 30);
    mirrorL.rotation.y = -Math.PI/6;
    mirrorLGrp.add(bracketL);
    mirrorLGrp.add(mirrorL);
    cabinGroup.add(mirrorLGrp);

    const mirrorRGrp = new THREE.Group();
    const bracketR = new THREE.Mesh(mirrorBracketGeo, chrome);
    bracketR.rotation.z = Math.PI/2;
    bracketR.position.set(-60, 10, 30);
    const mirrorR = new THREE.Mesh(mirrorGeo, glass);
    mirrorR.position.set(-70, 10, 30);
    mirrorR.rotation.y = Math.PI/6;
    mirrorRGrp.add(bracketR);
    mirrorRGrp.add(mirrorR);
    cabinGroup.add(mirrorRGrp);

    // Ladders
    const ladderGroup = new THREE.Group();
    ladderGroup.position.set(-82, 40, 0);
    const railGeo = new THREE.CylinderGeometry(1, 1, 100, 16);
    const rail1 = new THREE.Mesh(railGeo, steel);
    rail1.position.z = 10;
    const rail2 = new THREE.Mesh(railGeo, steel);
    rail2.position.z = -10;
    ladderGroup.add(rail1);
    ladderGroup.add(rail2);
    
    const rungGeo = new THREE.CylinderGeometry(1, 1, 20, 16);
    for(let i=0; i<15; i++) {
        const rung = new THREE.Mesh(rungGeo, steel);
        rung.rotation.x = Math.PI/2;
        rung.position.y = (i - 7) * 6;
        ladderGroup.add(rung);
    }
    rigAssembly.add(ladderGroup);

    // Panel lines & Rivets (Intricate Detail)
    const rivetGeo = new THREE.SphereGeometry(0.5, 8, 8);
    for(let i=0; i<100; i++) {
        const rivet = new THREE.Mesh(rivetGeo, darkSteel);
        rivet.position.set(
            (Math.random() - 0.5) * 158,
            60 + (Math.random() - 0.5) * 38,
            120
        );
        rigAssembly.add(rivet);
    }

    // ==========================================
    // 4. INJECTION MANIFOLD AND ACCELERATORS
    // ==========================================
    const injAssembly = new THREE.Group();
    meshes.injAssembly = injAssembly;
    group.add(injAssembly);

    for(let i=0; i<4; i++) {
        const angle = (i/4) * Math.PI * 2;
        const trackGeo = new THREE.CylinderGeometry(20, 20, 800, 64);
        const track = new THREE.Mesh(trackGeo, aluminum);
        track.rotation.z = Math.PI/2;
        track.rotation.y = angle;
        track.position.set(Math.cos(angle)*600, 0, Math.sin(angle)*600);
        
        // Add extreme detail to tracks (acceleration rings)
        for(let j=0; j<20; j++) {
            const accRingGeo = new THREE.TorusGeometry(35, 5, 32, 64);
            const accRing = new THREE.Mesh(accRingGeo, plasmaRed);
            accRing.rotation.y = Math.PI/2;
            accRing.position.x = (j - 10) * 35;
            track.add(accRing);
            meshes.neonArrays.push(accRing);
        }

        // Add gears
        const gear1 = createExtrudedGear(30, 16, 10, darkSteel);
        gear1.position.set(0, 50, 0);
        track.add(gear1);
        meshes.gears.push(gear1);

        const gear2 = createExtrudedGear(30, 16, 10, darkSteel);
        gear2.position.set(0, -50, 0);
        track.add(gear2);
        meshes.gears.push(gear2);

        injAssembly.add(track);
    }

    // ==========================================
    // 5. CAUSALITY PARTICLE SYSTEM (FTL VISUALS)
    // ==========================================
    // Representing tachyons moving backward in time and normal particles moving forward
    const particleGeo = new THREE.SphereGeometry(2, 8, 8);
    const particleMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    // Using InstancedMesh for massive scale performance
    const numParticles = 2000;
    meshes.particles = new THREE.InstancedMesh(particleGeo, particleMat, numParticles);
    
    const dummy = new THREE.Object3D();
    const particleData = [];
    for(let i=0; i<numParticles; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const r = 50 + Math.random() * 800;
        
        dummy.position.set(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi)
        );
        dummy.updateMatrix();
        meshes.particles.setMatrixAt(i, dummy.matrix);
        
        particleData.push({
            r: r, theta: theta, phi: phi,
            speed: (Math.random() * 5 + 5) * (Math.random() > 0.5 ? 1 : -1), // Reverse time speeds
            offset: Math.random() * 1000
        });
    }
    meshes.particles.instanceMatrix.needsUpdate = true;
    meshes.particleData = particleData; // store metadata for animation
    group.add(meshes.particles);


    // ==========================================
    // POPULATE PARTS ARRAY (15+ Highly Detailed)
    // ==========================================
    parts.push(
        {
            name: "Primary Toroidal Containment Field",
            description: "A 400-meter radius vacuum chamber operating at 0.0001 Kelvin. Houses the primary tachyon stream.",
            material: "Dark Matter Alloy / Niobium-Titanium",
            function: "Prevents faster-than-light tachyons from interacting with normal spacetime prior to designated collision.",
            assemblyOrder: 1,
            connections: ["Superconducting Quadrupole Magnets", "Anti-Time Injection Manifold"],
            failureEffect: "Instantaneous catastrophic causality breakdown; localized false vacuum decay.",
            cascadeFailures: ["Causality Inversion Core", "Event Horizon Dampeners", "Entire Observable Universe"],
            originalPosition: {x: 0, y: 0, z: 0},
            explodedPosition: {x: 0, y: -200, z: 0}
        },
        {
            name: "Superconducting Quadrupole Magnets",
            description: "120 ultra-high-field magnetic arrays spaced evenly around the ring.",
            material: "Copper / Chrome / HyperGold",
            function: "Focuses and steers the tachyonic beam against standard temporal flow friction.",
            assemblyOrder: 2,
            connections: ["Primary Toroidal Containment Field", "Quantum Coolant Piping"],
            failureEffect: "Beam defocusing leading to micro-black hole formation along the track.",
            cascadeFailures: ["Vacuum Chamber Housing", "Temporal Override Command Rig"],
            originalPosition: {x: 0, y: 0, z: 0},
            explodedPosition: {x: 0, y: 200, z: 0}
        },
        {
            name: "Causality Inversion Core",
            description: "A multi-faceted Icosahedral nexus at the exact center of the collider.",
            material: "Cherenkov-emitting Metamaterial / Neon Purple Wireframe",
            function: "Forces tachyon-tachyon collision by locally reversing the arrow of time, inducing a pre-Big Bang state.",
            assemblyOrder: 3,
            connections: ["Cherenkov Emission Baffles", "Sub-Planck Measurement Arrays"],
            failureEffect: "Temporal paradox generation; events prior to collision become unwritten.",
            cascadeFailures: ["Everything"],
            originalPosition: {x: 0, y: 0, z: 0},
            explodedPosition: {x: 0, y: 0, z: 400}
        },
        {
            name: "Cherenkov Emission Baffles",
            description: "12 large cylindrical baffles surrounding the core.",
            material: "HyperGold / Quantum Glass",
            function: "Absorbs and redirects exotic radiation emitted as tachyons decelerate below infinite velocity.",
            assemblyOrder: 4,
            connections: ["Causality Inversion Core"],
            failureEffect: "Lethal bursts of blue Cherenkov radiation sterilizing a 50-light-year radius.",
            cascadeFailures: ["FTL Telemetry Sensors"],
            originalPosition: {x: 0, y: 0, z: 0},
            explodedPosition: {x: 200, y: 0, z: 200}
        },
        {
            name: "Temporal Override Command Rig",
            description: "A massive, mobile 6-wheeled off-road maintenance vehicle locked to the outer ring.",
            material: "Dark Steel / Tinted Glass",
            function: "Allows human operators to navigate the causality distortion field and perform localized repairs.",
            assemblyOrder: 5,
            connections: ["Primary Toroidal Containment Field"],
            failureEffect: "Operators trapped in an infinite time-loop.",
            cascadeFailures: ["Manual Override Systems"],
            originalPosition: {x: 550, y: -50, z: 0},
            explodedPosition: {x: 800, y: -50, z: 300}
        },
        {
            name: "Command Rig Hydraulics",
            description: "Intricate piston and cylinder systems connecting the chassis to the off-road tires.",
            material: "Chrome / Dark Steel / Rubber lines",
            function: "Absorbs macroscopic quantum fluctuations and physical bumps on the containment ring.",
            assemblyOrder: 6,
            connections: ["Temporal Override Command Rig", "Rig Aggressive Tires"],
            failureEffect: "Chassis misalignment leading to temporal sheer of the cabin.",
            cascadeFailures: ["Operator Cabin"],
            originalPosition: {x: 550, y: -50, z: 0},
            explodedPosition: {x: 800, y: -150, z: 300}
        },
        {
            name: "Rig Aggressive Off-Road Tires",
            description: "6 massive Torus tires with 150 extruded BoxGeometry lugs each and complex spoke arrays.",
            material: "Rubber / Chrome / Steel",
            function: "Provides physical traction against the shifting topological geometry of spacetime near the ring.",
            assemblyOrder: 7,
            connections: ["Command Rig Hydraulics"],
            failureEffect: "Loss of traction, vehicle falls into the 4th dimension.",
            cascadeFailures: ["None"],
            originalPosition: {x: 550, y: -50, z: 0},
            explodedPosition: {x: 800, y: -250, z: 300}
        },
        {
            name: "Quantum Coolant Piping",
            description: "Thousands of meters of intertwined Catmull-Rom curves wrapping the primary torus.",
            material: "Chrome",
            function: "Circulates liquid exotic matter to maintain superconductivity.",
            assemblyOrder: 8,
            connections: ["Primary Toroidal Containment Field", "Exotic Matter Pumps"],
            failureEffect: "Thermal runaway; ring melts into quark-gluon plasma.",
            cascadeFailures: ["Superconducting Quadrupole Magnets"],
            originalPosition: {x: 0, y: 0, z: 0},
            explodedPosition: {x: 0, y: -400, z: 0}
        },
        {
            name: "Anti-Time Injection Manifold",
            description: "4 massive linear tracks crossing the primary ring.",
            material: "Aluminum / Plasma Red Acceleration Rings",
            function: "Accelerates regular matter to light-speed, then forces a phase transition into tachyons.",
            assemblyOrder: 9,
            connections: ["Tachyon Pre-Accelerators", "Primary Toroidal Containment Field"],
            failureEffect: "Particles annihilate upon phase transition.",
            cascadeFailures: ["Tachyon Pre-Accelerators"],
            originalPosition: {x: 0, y: 0, z: 0},
            explodedPosition: {x: 0, y: 400, z: 0}
        },
        {
            name: "Extruded Gear Assemblies",
            description: "Massive 32-tooth extruded metallic gears driving the injection phase modulators.",
            material: "Dark Steel",
            function: "Mechanically synchronizes the frequency of injection with the temporal rotation of the core.",
            assemblyOrder: 10,
            connections: ["Anti-Time Injection Manifold"],
            failureEffect: "Phase desynchronization.",
            cascadeFailures: ["None"],
            originalPosition: {x: 0, y: 0, z: 0},
            explodedPosition: {x: 300, y: 400, z: 0}
        },
        {
            name: "Sub-Planck Measurement Arrays",
            description: "Microscopic (scaled up for visibility) arrays of sensors analyzing collision debris.",
            material: "Quantum Glass",
            function: "Measures lengths smaller than the Planck length to determine string vibrational modes.",
            assemblyOrder: 11,
            connections: ["Causality Inversion Core"],
            failureEffect: "Loss of experimental data.",
            cascadeFailures: ["None"],
            originalPosition: {x: 0, y: 0, z: 0},
            explodedPosition: {x: -200, y: 0, z: 200}
        },
        {
            name: "Chronon Extraction Valves",
            description: "Vents excess temporal pressure built up during FTL collisions.",
            material: "Steel",
            function: "Prevents time around the collider from freezing completely.",
            assemblyOrder: 12,
            connections: ["Vacuum Chamber Housing"],
            failureEffect: "Local time stops; machine becomes eternally frozen in one instant.",
            cascadeFailures: ["Everything"],
            originalPosition: {x: 0, y: 0, z: 0},
            explodedPosition: {x: -400, y: 0, z: 0}
        },
        {
            name: "Forward-Time Deflectors",
            description: "Spherical shields mounted on the core assembly.",
            material: "Tinted Glass",
            function: "Deflects stray bradyons (slower-than-light particles) away from the tachyon stream.",
            assemblyOrder: 13,
            connections: ["Causality Inversion Core"],
            failureEffect: "Bradyon-Tachyon annihilation, yielding infinite imaginary energy.",
            cascadeFailures: ["Primary Toroidal Containment Field"],
            originalPosition: {x: 0, y: 0, z: 0},
            explodedPosition: {x: 0, y: 0, z: -300}
        },
        {
            name: "FTL Telemetry Sensors",
            description: "Neon arrays wrapping the injection manifold.",
            material: "Plasma Red",
            function: "Transmits collision data back in time to researchers before the experiment even starts.",
            assemblyOrder: 14,
            connections: ["Anti-Time Injection Manifold"],
            failureEffect: "Researchers must wait for light-speed signals to receive data.",
            cascadeFailures: ["Grant Funding"],
            originalPosition: {x: 0, y: 0, z: 0},
            explodedPosition: {x: -300, y: -300, z: 0}
        },
        {
            name: "Baryogenesis Inhibitors",
            description: "Dodecahedral nodes placed around the core.",
            material: "Plasma Red / HyperGold",
            function: "Prevents the collision energy from spontaneously creating a new universe (baryogenesis).",
            assemblyOrder: 15,
            connections: ["Causality Inversion Core"],
            failureEffect: "A new Big Bang occurs within the laboratory.",
            cascadeFailures: ["The existing Universe"],
            originalPosition: {x: 0, y: 0, z: 0},
            explodedPosition: {x: 0, y: 500, z: -500}
        },
        {
            name: "Operator Cabin Control Systems",
            description: "Intricate interior featuring glowing screens, joysticks, and steering column.",
            material: "Plastic / Green Console / Red Alert Screens",
            function: "Provides UI/UX for piloting the Command Rig through causality storms.",
            assemblyOrder: 16,
            connections: ["Temporal Override Command Rig"],
            failureEffect: "Loss of manual control.",
            cascadeFailures: ["Command Rig Hydraulics"],
            originalPosition: {x: 550, y: -50, z: 0},
            explodedPosition: {x: 800, y: 50, z: 300}
        },
        {
            name: "Rig Exhaust Stacks and Grilles",
            description: "Massive dark steel cylinders and chrome bars.",
            material: "Dark Steel / Chrome",
            function: "Vents waste temporal exhaust (chroniton radiation) away from the operator.",
            assemblyOrder: 17,
            connections: ["Temporal Override Command Rig"],
            failureEffect: "Operator ages to death in seconds.",
            cascadeFailures: ["Operator Life Support"],
            originalPosition: {x: 550, y: -50, z: 0},
            explodedPosition: {x: 800, y: 150, z: 300}
        }
    );

    // ==========================================
    // 5 PHD-LEVEL QUIZ QUESTIONS
    // ==========================================
    const quizQuestions = [
        {
            question: "If tachyons possess imaginary rest mass, what happens to their momentum as their velocity approaches infinity?",
            options: [
                "Momentum approaches infinity",
                "Momentum approaches zero",
                "Momentum becomes imaginary",
                "Momentum equals rest mass"
            ],
            correctAnswer: 1,
            explanation: "According to special relativity applied to tachyons (E = mc^2 / sqrt(v^2/c^2 - 1) where m is imaginary), energy decreases as velocity increases. At infinite velocity, energy is zero, and momentum reaches its minimum real value (mc), often generalized as approaching zero in classical limits."
        },
        {
            question: "In the context of the Feinberg reinterpretation principle, how is a negative-energy tachyon moving backward in time physically observed?",
            options: [
                "As a negative-energy tachyon moving backward in time",
                "As a positive-energy tachyon moving forward in time",
                "As a bradyon with imaginary mass",
                "It is unobservable due to the event horizon"
            ],
            correctAnswer: 1,
            explanation: "Feinberg proposed the reinterpretation principle to avoid paradoxes of negative energy states. A tachyon emitted with negative energy traveling backward in time is mathematically and physically equivalent to a tachyon absorbed with positive energy traveling forward in time."
        },
        {
            question: "Cherenkov radiation is emitted when a charged particle exceeds the phase velocity of light in a medium. For charged tachyons in a vacuum, what is the expected Cherenkov emission profile?",
            options: [
                "Continuous emission leading to infinite momentum and zero velocity",
                "Continuous emission leading to infinite velocity and zero energy",
                "No emission occurs in a vacuum",
                "Emission of virtual photons only"
            ],
            correctAnswer: 1,
            explanation: "Since a tachyon travels faster than light in a vacuum, a charged tachyon would continuously emit Cherenkov radiation. Losing energy causes a tachyon to accelerate. Therefore, it would continuously radiate, losing all energy and accelerating to infinite velocity."
        },
        {
            question: "Which violation of the energy conditions is strictly required to stabilize a macroscopic traversable wormhole used in tachyon redirection?",
            options: [
                "Strong energy condition",
                "Dominant energy condition",
                "Null energy condition (Weak energy condition)",
                "Conservation of energy"
            ],
            correctAnswer: 2,
            explanation: "Traversable wormholes require 'exotic matter' with negative energy density to keep the throat open, violating the Null Energy Condition (and by extension the Weak and Strong energy conditions)."
        },
        {
            question: "According to spontaneous symmetry breaking in string theory, tachyon condensation results in:",
            options: [
                "The creation of a stable D-brane",
                "The decay of an unstable D-brane into the closed string vacuum",
                "The acceleration of universe expansion",
                "The formation of a macroscopic black hole"
            ],
            correctAnswer: 1,
            explanation: "In string theory, a tachyon represents an instability in the system (a local maximum in the potential). Tachyon condensation is the process where the system rolls down to a stable minimum, physically interpreted as the decay of an unstable D-brane, leaving behind only the closed string vacuum."
        }
    ];

    // ==========================================
    // EXTREME ANIMATION LOGIC
    // ==========================================
    function animate(time, speed, meshesObj) {
        const t = time * speed;

        // Tachyon Stream Reverse Time Logic
        meshesObj.tachyonStreams.forEach((stream, i) => {
            // Rotating extremely fast, backward
            stream.rotation.z = -t * 15;
            // Pulsing based on sine waves to simulate energy fluctuations
            const pulse = 6 + Math.sin(t * 30 + i) * 4;
            if(stream.material && stream.material.emissiveIntensity !== undefined) {
                stream.material.emissiveIntensity = pulse;
            }
        });

        // Containment Ring Rotation
        if(meshesObj.ringAssembly) {
            meshesObj.ringAssembly.rotation.y = t * 0.2;
            meshesObj.ringAssembly.rotation.x = Math.sin(t) * 0.05; // slight wobble
        }

        // Core Complex Articulation
        if(meshesObj.coreAssembly) {
            meshesObj.coreAssembly.rotation.x = t * 2;
            meshesObj.coreAssembly.rotation.y = -t * 2.5;
            meshesObj.coreAssembly.rotation.z = t * 1.5;
            
            const coreScale = 1 + Math.sin(t * 40) * 0.1;
            meshesObj.coreAssembly.scale.set(coreScale, coreScale, coreScale);
        }

        // Baffles counter-rotating
        meshesObj.baffles.forEach((b, i) => {
            b.rotation.x += speed * 5 * (i % 2 === 0 ? 1 : -1);
        });

        // Command Rig moving along the outer ring
        if(meshesObj.rigAssembly) {
            const rigAngle = t * 0.5;
            meshesObj.rigAssembly.position.set(
                Math.cos(rigAngle) * (ringRadius + 150),
                Math.sin(t * 5) * 5 - 50, // suspension bounce
                Math.sin(rigAngle) * (ringRadius + 150)
            );
            meshesObj.rigAssembly.rotation.y = -rigAngle;
        }

        // Wheels turning
        meshesObj.wheels.forEach(w => {
            w.rotation.z -= speed * 15;
        });

        // Hydraulics pumping (Pistons extending/retracting)
        meshesObj.pistons.forEach((p, i) => {
            // shaft default y is 40. oscillating between 30 and 50
            p.shaft.position.y = 40 + Math.sin(t * 10 + i) * 10;
        });

        // Gears spinning
        meshesObj.gears.forEach((g, i) => {
            g.rotation.z = t * 8 * (i % 2 === 0 ? 1 : -1);
        });

        // Neon Arrays pulsing sequentially
        meshesObj.neonArrays.forEach((n, i) => {
            const phase = (i / meshesObj.neonArrays.length) * Math.PI * 2;
            n.material.opacity = 0.5 + Math.sin(t * 20 + phase) * 0.5;
        });

        // Particle System Causality Violation
        if (meshesObj.particles && meshesObj.particleData) {
            const matrix = new THREE.Matrix4();
            const position = new THREE.Vector3();
            
            for (let i = 0; i < meshesObj.particleData.length; i++) {
                const data = meshesObj.particleData[i];
                
                // Advance or reverse time for particle
                const pTime = t * data.speed + data.offset;
                
                // Complex Lissajous/Orbital paths
                position.set(
                    data.r * Math.sin(data.phi + pTime * 0.1) * Math.cos(data.theta + pTime * 2),
                    data.r * Math.sin(data.phi + pTime * 0.1) * Math.sin(data.theta + pTime * 2),
                    data.r * Math.cos(data.phi + pTime * 0.1)
                );
                
                // Add jitter (quantum tunneling effect)
                if (Math.random() > 0.98) {
                    position.x += (Math.random() - 0.5) * 50;
                    position.y += (Math.random() - 0.5) * 50;
                    position.z += (Math.random() - 0.5) * 50;
                }
                
                matrix.setPosition(position);
                meshesObj.particles.setMatrixAt(i, matrix);
            }
            meshesObj.particles.instanceMatrix.needsUpdate = true;
        }
    }

    return { 
        group, 
        parts, 
        description: "Ultra God Tier Tachyon-Tachyon Collider. Features FTL reverse-time particle containment, causality inversion core, and an integrated mobile command rig with aggressive off-road tires, complex hydraulics, and detailed operator cabin.", 
        quizQuestions, 
        animate: (t, s) => animate(t, s, meshes) 
    };
}
