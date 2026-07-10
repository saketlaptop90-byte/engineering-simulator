import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const description = "God-Tier Penrose Process Extractor Megastructure. A colossal, highly detailed stellar-engine harnessing the rotational energy of a supermassive Kerr black hole via frame-dragging. Massive chunks of matter are linearly accelerated from mobile Crawler-Cities driving along an orbital track. The matter is fired into the ergosphere, fractured, and escaping energized fragments are captured yielding incomprehensible energy output.";

    // --- CUSTOM MATERIALS ---
    const eventHorizonMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        roughness: 1.0,
        metalness: 0.0,
        emissive: 0x000000,
        side: THREE.FrontSide
    });

    const ergoMaterial = new THREE.MeshStandardMaterial({
        color: 0x110022,
        emissive: 0x220055,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.15,
        wireframe: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    });

    const plasmaMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
    });

    const screenMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 2.0,
    });

    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 4.0,
    });

    // --- ANIMATION STATE ---
    const animState = {
        blackHoleSpin: 0,
        accretionRings: [],
        crawlers: [],
        payloads: [],
        pistons: [],
        wheels: [],
        lights: [],
        timeInternal: 0
    };

    // --- HELPER FUNCTIONS ---
    function createHydraulicPiston(radius, length, baseMat, shaftMat) {
        const pGroup = new THREE.Group();
        
        // Outer cylinder (Base)
        const baseGeo = new THREE.CylinderGeometry(radius, radius, length * 0.6, 16);
        const base = new THREE.Mesh(baseGeo, baseMat);
        base.position.y = length * 0.3;
        pGroup.add(base);

        // Inner cylinder (Shaft)
        const shaftGeo = new THREE.CylinderGeometry(radius * 0.6, radius * 0.6, length * 0.8, 16);
        const shaft = new THREE.Mesh(shaftGeo, shaftMat);
        shaft.position.y = length * 0.7;
        pGroup.add(shaft);

        animState.pistons.push({ shaft: shaft, basePos: length * 0.7, range: length * 0.2, speed: Math.random() * 2 + 1, offset: Math.random() * Math.PI });
        
        return pGroup;
    }

    function createWheel(radius, width) {
        const wheelGroup = new THREE.Group();
        
        // Torus for tire
        const tireGeo = new THREE.TorusGeometry(radius, width/2, 32, 64);
        const tire = new THREE.Mesh(tireGeo, rubber);
        wheelGroup.add(tire);
        
        // Extruded BoxGeometry lugs for aggressive off-road treads
        const numLugs = 72;
        const lugGeo = new THREE.BoxGeometry(width * 1.2, radius * 0.15, radius * 0.2);
        for(let i = 0; i < numLugs; i++) {
            const angle = (i / numLugs) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, rubber);
            lug.position.set(Math.cos(angle) * (radius + width/2.2), Math.sin(angle) * (radius + width/2.2), 0);
            lug.rotation.z = angle;
            wheelGroup.add(lug);
        }
        
        // Rim Hub
        const rimGeo = new THREE.CylinderGeometry(radius * 0.7, radius * 0.7, width * 0.9, 32);
        const rim = new THREE.Mesh(rimGeo, chrome);
        rim.rotation.x = Math.PI / 2;
        wheelGroup.add(rim);
        
        // Complex spoke array
        for(let i = 0; i < 12; i++) {
            const spokeGeo = new THREE.CylinderGeometry(radius * 0.04, radius * 0.08, radius * 1.4, 16);
            const spoke = new THREE.Mesh(spokeGeo, darkSteel);
            spoke.rotation.z = (i / 12) * Math.PI * 2;
            spoke.rotation.x = Math.PI / 2;
            wheelGroup.add(spoke);
            
            // Sub-spokes
            const subSpokeGeo = new THREE.CylinderGeometry(radius * 0.02, radius * 0.02, radius * 1.4, 8);
            const subSpoke = new THREE.Mesh(subSpokeGeo, copper);
            subSpoke.rotation.z = (i / 12) * Math.PI * 2 + (Math.PI / 24);
            subSpoke.rotation.x = Math.PI / 2;
            wheelGroup.add(subSpoke);
        }

        // Add bolts
        for(let i=0; i<8; i++) {
            const boltAngle = (i/8)*Math.PI*2;
            const bolt = new THREE.Mesh(new THREE.CylinderGeometry(radius*0.05, radius*0.05, width*1.0, 8), steel);
            bolt.position.set(Math.cos(boltAngle)*radius*0.3, Math.sin(boltAngle)*radius*0.3, 0);
            bolt.rotation.x = Math.PI/2;
            wheelGroup.add(bolt);
        }

        animState.wheels.push(wheelGroup);
        return wheelGroup;
    }

    function buildCabin() {
        const cabinGroup = new THREE.Group();
        
        // Main cabin chassis
        const chassis = new THREE.Mesh(new THREE.BoxGeometry(40, 30, 50), steel);
        cabinGroup.add(chassis);

        // Tinted Windows
        const frontWindow = new THREE.Mesh(new THREE.BoxGeometry(36, 15, 2), tinted);
        frontWindow.position.set(0, 5, 25);
        cabinGroup.add(frontWindow);

        const sideWindowL = new THREE.Mesh(new THREE.BoxGeometry(2, 15, 40), tinted);
        sideWindowL.position.set(-20, 5, 0);
        cabinGroup.add(sideWindowL);

        const sideWindowR = new THREE.Mesh(new THREE.BoxGeometry(2, 15, 40), tinted);
        sideWindowR.position.set(20, 5, 0);
        cabinGroup.add(sideWindowR);

        // Side Mirrors
        for(let side of [-1, 1]) {
            const mirrorArm = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 10), darkSteel);
            mirrorArm.rotation.z = (Math.PI / 2) * side;
            mirrorArm.position.set(side * 25, 5, 20);
            cabinGroup.add(mirrorArm);

            const mirrorBody = new THREE.Mesh(new THREE.BoxGeometry(2, 6, 4), plastic);
            mirrorBody.position.set(side * 30, 5, 20);
            cabinGroup.add(mirrorBody);
            
            const reflective = new THREE.Mesh(new THREE.BoxGeometry(2.1, 5, 3), chrome);
            reflective.position.set(side * 30, 5, 20);
            cabinGroup.add(reflective);
        }

        // Interior details
        // Operator Seat
        const seatBase = new THREE.Mesh(new THREE.BoxGeometry(10, 5, 10), rubber);
        seatBase.position.set(0, -10, 10);
        cabinGroup.add(seatBase);
        
        const seatBack = new THREE.Mesh(new THREE.BoxGeometry(10, 15, 2), rubber);
        seatBack.position.set(0, -2.5, 5);
        cabinGroup.add(seatBack);

        // Steering Column and Wheel
        const column = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 10), darkSteel);
        column.position.set(0, -5, 15);
        column.rotation.x = Math.PI / 4;
        cabinGroup.add(column);

        const sWheelGeo = new THREE.TorusGeometry(4, 0.5, 16, 32);
        const sWheel = new THREE.Mesh(sWheelGeo, plastic);
        sWheel.position.set(0, -1, 18.5);
        sWheel.rotation.x = -Math.PI / 4;
        
        // Steering spokes
        for(let i=0; i<3; i++) {
            const sp = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 4), steel);
            sp.position.set(0, -1, 18.5);
            sp.rotation.x = -Math.PI / 4;
            sp.rotation.z = (i/3)*Math.PI*2;
            cabinGroup.add(sp);
        }
        cabinGroup.add(sWheel);

        // Joysticks
        for(let side of [-1, 1]) {
            const stickBase = new THREE.Mesh(new THREE.BoxGeometry(4, 2, 4), plastic);
            stickBase.position.set(side * 8, -8, 12);
            cabinGroup.add(stickBase);

            const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 5), steel);
            stick.position.set(side * 8, -5, 12);
            cabinGroup.add(stick);

            const stickHead = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16), neonRed);
            stickHead.position.set(side * 8, -2, 12);
            cabinGroup.add(stickHead);
        }

        // Glowing Control Panel
        const panel = new THREE.Mesh(new THREE.BoxGeometry(20, 1, 10), darkSteel);
        panel.position.set(0, -5, 22);
        panel.rotation.x = Math.PI / 6;
        cabinGroup.add(panel);

        const screen1 = new THREE.Mesh(new THREE.PlaneGeometry(8, 6), screenMaterial);
        screen1.position.set(-4, -4.4, 22);
        screen1.rotation.x = -Math.PI / 3;
        cabinGroup.add(screen1);

        const screen2 = new THREE.Mesh(new THREE.PlaneGeometry(8, 6), screenMaterial);
        screen2.position.set(4, -4.4, 22);
        screen2.rotation.x = -Math.PI / 3;
        cabinGroup.add(screen2);

        // Ladders on the side
        const ladderGroup = new THREE.Group();
        const lRail1 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 30), steel);
        lRail1.position.set(-20, -15, -10);
        ladderGroup.add(lRail1);
        const lRail2 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 30), steel);
        lRail2.position.set(-20, -15, -15);
        ladderGroup.add(lRail2);
        
        for(let i=0; i<8; i++) {
            const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 5), steel);
            rung.position.set(-20, -25 + (i * 4), -12.5);
            rung.rotation.x = Math.PI / 2;
            ladderGroup.add(rung);
        }
        cabinGroup.add(ladderGroup);

        return cabinGroup;
    }

    function buildExhaustStack() {
        const exhaust = new THREE.Group();
        const base = new THREE.Mesh(new THREE.CylinderGeometry(4, 5, 10), darkSteel);
        exhaust.add(base);

        const pipe = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 30), chrome);
        pipe.position.y = 20;
        exhaust.add(pipe);

        const cap = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 2), steel);
        cap.position.y = 35;
        exhaust.add(cap);
        
        // Flap
        const flap = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.4, 0.5), steel);
        flap.position.set(0, 36, 1);
        flap.rotation.x = Math.PI / 4;
        exhaust.add(flap);

        return exhaust;
    }

    // --- 1. BLACK HOLE & ERGOSPHERE ---
    function constructBlackHole() {
        const bhGroup = new THREE.Group();
        
        const eventHorizonRadius = 80;
        const ehGeometry = new THREE.SphereGeometry(eventHorizonRadius, 128, 128);
        const eventHorizon = new THREE.Mesh(ehGeometry, eventHorizonMaterial);
        bhGroup.add(eventHorizon);
        
        parts.push({
            name: "Singularity Event Horizon",
            description: "The boundary of no return. Perfectly black, absorbing all incident light. Rotation parameter a ≈ M.",
            material: "Spacetime Singularity",
            function: "Gravitational Anchor",
            assemblyOrder: 1,
            connections: ["Ergosphere", "Accretion Disk"],
            failureEffect: "Spaghettification",
            cascadeFailures: ["Reality collapse"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: -1000, z: 0 }
        });

        const ergosphereEquator = 200;
        const ergospherePole = 80;
        const ergoGeometry = new THREE.SphereGeometry(ergosphereEquator, 128, 128);
        const ergosphere = new THREE.Mesh(ergoGeometry, ergoMaterial);
        ergosphere.scale.set(1, ergospherePole / ergosphereEquator, 1);
        bhGroup.add(ergosphere);
        
        parts.push({
            name: "Ergosphere Boundary (Stationary Limit Surface)",
            description: "The region where spacetime is dragged faster than the speed of light. Frame-dragging is absolute here.",
            material: "Quantum Vacuum",
            function: "Energy Extraction Zone",
            assemblyOrder: 2,
            connections: ["Event Horizon"],
            failureEffect: "Loss of frame-dragging",
            cascadeFailures: ["Energy extraction cessation"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 1000, z: 0 }
        });

        return { bhGroup, eventHorizon, ergosphere };
    }

    // --- 2. ACCRETION DISK ---
    function constructAccretionDisk() {
        const accretionDiskGroup = new THREE.Group();
        
        // Hundreds of rings for extreme detail
        for (let i = 0; i < 300; i++) {
            const inner = 220 + (i * 2.5) + Math.random() * 5;
            const outer = inner + 2.0 + Math.random() * 4;
            const ringGeo = new THREE.RingGeometry(inner, outer, 128);
            
            const t = i / 300;
            // Hot X-ray blue in center, cooling to orange/red at edges
            const r = 0.5 + t * 0.5;
            const g = 0.8 - (t * 0.6);
            const b = 1.0 - (t * 0.9);
            const color = new THREE.Color(r, g, b);
            
            const ringMat = new THREE.MeshStandardMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 6.0 * (1.0 - t) + 1.0,
                transparent: true,
                opacity: 0.6 * (1.0 - t) + 0.05,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending
            });
            
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = Math.PI / 2;
            
            // Warp the disk slightly due to frame dragging
            ring.rotation.x += (Math.random() - 0.5) * 0.05 * (1.0 - t);
            ring.rotation.y += (Math.random() - 0.5) * 0.05 * (1.0 - t);
            
            ring.userData.rotationSpeed = (0.01 + 0.1 * (1.0 - t)) * (Math.random() > 0.1 ? 1 : -1);
            animState.accretionRings.push(ring);
            accretionDiskGroup.add(ring);
        }

        parts.push({
            name: "Superheated Accretion Disk",
            description: "Plasma and stellar dust spiraling into the black hole at relativistic speeds, emitting intense X-rays.",
            material: "Degenerate Plasma",
            function: "Illumination and ambient energy generation",
            assemblyOrder: 3,
            connections: ["Event Horizon"],
            failureEffect: "Overheating of station shields",
            cascadeFailures: ["Thermal meltdown"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: -500, z: 0 }
        });

        return accretionDiskGroup;
    }

    // --- 3. ORBITAL TRACK ---
    function constructOrbitalTrack(radius) {
        const trackGroup = new THREE.Group();
        
        // Massive double rail system
        const railGeo = new THREE.TorusGeometry(radius, 15, 64, 256);
        const railOuter = new THREE.Mesh(railGeo, steel);
        railOuter.rotation.x = Math.PI / 2;
        railOuter.position.y = -50;
        trackGroup.add(railOuter);

        const railInner = new THREE.Mesh(new THREE.TorusGeometry(radius - 120, 15, 64, 256), steel);
        railInner.rotation.x = Math.PI / 2;
        railInner.position.y = -50;
        trackGroup.add(railInner);

        // Cross ties connecting rails
        for(let i=0; i<360; i+=2) {
            const angle = (i * Math.PI) / 180;
            const tieGeo = new THREE.BoxGeometry(160, 10, 20);
            const tie = new THREE.Mesh(tieGeo, darkSteel);
            
            const x = Math.cos(angle) * (radius - 60);
            const z = Math.sin(angle) * (radius - 60);
            tie.position.set(x, -50, z);
            tie.rotation.y = -angle;
            trackGroup.add(tie);
            
            // Add glowing navigation nodes
            if(i % 10 === 0) {
                const navLight = new THREE.Mesh(new THREE.SphereGeometry(5, 16, 16), plasmaMaterial);
                navLight.position.set(x, -35, z);
                trackGroup.add(navLight);
                animState.lights.push(navLight);
            }
        }

        parts.push({
            name: "Orbital Megatrack",
            description: "A colossal, static ring structure anchoring the mobile Crawler-Cities against immense gravitational tides.",
            material: "Neutron-Star Forged Steel",
            function: "Structural chassis and traversal path",
            assemblyOrder: 4,
            connections: ["Crawler-Cities"],
            failureEffect: "Track fracture",
            cascadeFailures: ["Crawler derailment", "Infall into singularity"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 800, z: 0 }
        });

        return trackGroup;
    }

    // --- 4. CRAWLER CITIES (The Extractors) ---
    function constructCrawler(angleOffset, trackRadius) {
        const crawlerGroup = new THREE.Group();
        
        // Main Chassis
        const chassis = new THREE.Mesh(new THREE.BoxGeometry(100, 40, 250), darkSteel);
        chassis.position.y = 20;
        crawlerGroup.add(chassis);

        // Wheels Setup (8 per side, total 16 massive off-road tires)
        const wheelY = -10;
        for(let i=0; i<8; i++) {
            const zOffset = -100 + (i * 28.5);
            
            // Left Wheel
            const wL = createWheel(20, 12);
            wL.position.set(-60, wheelY, zOffset);
            wL.rotation.y = Math.PI / 2;
            crawlerGroup.add(wL);

            // Right Wheel
            const wR = createWheel(20, 12);
            wR.position.set(60, wheelY, zOffset);
            wR.rotation.y = Math.PI / 2;
            crawlerGroup.add(wR);
            
            // Axles
            const axle = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 120), steel);
            axle.position.set(0, wheelY, zOffset);
            axle.rotation.z = Math.PI / 2;
            crawlerGroup.add(axle);
        }

        // Operator Cabin (Front)
        const cabin = buildCabin();
        cabin.position.set(0, 60, 100);
        crawlerGroup.add(cabin);
        
        // Exhaust Stacks
        for(let zOff of [50, 0, -50]) {
            const exL = buildExhaustStack();
            exL.position.set(-45, 40, zOff);
            crawlerGroup.add(exL);
            
            const exR = buildExhaustStack();
            exR.position.set(45, 40, zOff);
            crawlerGroup.add(exR);
        }

        // Massive Hydraulic Lines
        const tubePath = new THREE.CatmullRomCurve3([
            new THREE.Vector3(40, 20, 80),
            new THREE.Vector3(50, 60, 40),
            new THREE.Vector3(40, 70, -20),
            new THREE.Vector3(20, 50, -80)
        ]);
        const tubeGeo = new THREE.TubeGeometry(tubePath, 64, 4, 16, false);
        const tube = new THREE.Mesh(tubeGeo, rubber);
        crawlerGroup.add(tube);
        
        const tubePath2 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-40, 20, 80),
            new THREE.Vector3(-50, 60, 40),
            new THREE.Vector3(-40, 70, -20),
            new THREE.Vector3(-20, 50, -80)
        ]);
        const tube2 = new THREE.Mesh(new THREE.TubeGeometry(tubePath2, 64, 4, 16, false), rubber);
        crawlerGroup.add(tube2);

        // RAILGUN ASSEMBLY (Mounted on top, pointing inwards to black hole)
        const gunGroup = new THREE.Group();
        gunGroup.position.set(0, 80, -20);
        
        // Turret Base
        const turretBase = new THREE.Mesh(new THREE.CylinderGeometry(30, 40, 20, 32), steel);
        gunGroup.add(turretBase);

        // Pitch mechanism (Hydraulics)
        const gunPitchGroup = new THREE.Group();
        gunPitchGroup.position.y = 20;

        const barrelGeo = new THREE.BoxGeometry(20, 20, 300);
        const barrel = new THREE.Mesh(barrelGeo, darkSteel);
        barrel.position.z = -100;
        gunPitchGroup.add(barrel);

        // Magnetic Acceleration Coils
        const coilGeo = new THREE.TorusGeometry(25, 5, 16, 32);
        const coils = [];
        for(let i=0; i<12; i++) {
            const coilMat = new THREE.MeshStandardMaterial({
                color: 0xffaa00,
                emissive: 0xff5500,
                emissiveIntensity: 0,
                metalness: 0.8
            });
            const coil = new THREE.Mesh(coilGeo, coilMat);
            coil.position.z = -30 - (i * 20);
            gunPitchGroup.add(coil);
            coils.push(coil);
        }
        
        // Elevating hydraulic cylinders
        const liftPistonL = createHydraulicPiston(4, 40, steel, chrome);
        liftPistonL.position.set(-15, -20, 20);
        liftPistonL.rotation.x = Math.PI / 4;
        gunPitchGroup.add(liftPistonL);

        const liftPistonR = createHydraulicPiston(4, 40, steel, chrome);
        liftPistonR.position.set(15, -20, 20);
        liftPistonR.rotation.x = Math.PI / 4;
        gunPitchGroup.add(liftPistonR);

        // Point the gun down towards the ergosphere slightly
        gunPitchGroup.rotation.x = -Math.PI / 8;
        gunGroup.add(gunPitchGroup);
        
        // Point the turret sideways towards the black hole center
        // Crawler drives forward along the ring (Z axis relative to ring), so X points to center.
        gunGroup.rotation.y = -Math.PI / 2;
        
        crawlerGroup.add(gunGroup);

        // MAGNETIC CATCHER (Mounted at the rear of crawler)
        const catcherGroup = new THREE.Group();
        catcherGroup.position.set(0, 60, -120);
        // Face the opposite direction of the shot, expecting the return fragment
        catcherGroup.rotation.y = Math.PI / 2; 

        const funnelGeo = new THREE.CylinderGeometry(50, 10, 80, 32, 1, true);
        const funnelMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9, side: THREE.DoubleSide });
        const funnel = new THREE.Mesh(funnelGeo, funnelMat);
        funnel.rotation.x = Math.PI / 2;
        catcherGroup.add(funnel);

        const containRing = new THREE.Mesh(new THREE.TorusGeometry(55, 3, 16, 64), plasmaMaterial);
        containRing.position.z = 40;
        catcherGroup.add(containRing);

        crawlerGroup.add(catcherGroup);

        // Position crawler on track
        const x = Math.cos(angleOffset) * (trackRadius - 60);
        const z = Math.sin(angleOffset) * (trackRadius - 60);
        crawlerGroup.position.set(x, 0, z);
        crawlerGroup.rotation.y = -angleOffset;

        animState.crawlers.push({
            group: crawlerGroup,
            angle: angleOffset,
            radius: trackRadius - 60,
            coils: coils,
            gunPitch: gunPitchGroup,
            catcher: containRing,
            state: 'firing', // firing, splitting, escaping
            fireProgress: Math.random() // stagger
        });

        return crawlerGroup;
    }

    // --- PAYLOADS ---
    function constructPayloads(crawlerIndex) {
        const payloadGrp = new THREE.Group();
        
        // Original Mass Chunk
        const chunkGeo = new THREE.DodecahedronGeometry(12);
        const chunk = new THREE.Mesh(chunkGeo, steel);
        payloadGrp.add(chunk);
        
        // Negative Energy Fragment (Red, infalling)
        const fragNegGeo = new THREE.TetrahedronGeometry(8);
        const fragNegMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 3.0 });
        const fragNeg = new THREE.Mesh(fragNegGeo, fragNegMat);
        fragNeg.visible = false;
        payloadGrp.add(fragNeg);

        // Positive Energy Fragment (Cyan, escaping)
        const fragPosGeo = new THREE.OctahedronGeometry(15);
        const fragPosMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 8.0 });
        const fragPos = new THREE.Mesh(fragPosGeo, fragPosMat);
        fragPos.visible = false;
        payloadGrp.add(fragPos);

        group.add(payloadGrp);

        animState.payloads.push({
            group: payloadGrp,
            chunk: chunk,
            fragNeg: fragNeg,
            fragPos: fragPos,
            crawlerIdx: crawlerIndex
        });
    }

    // --- ASSEMBLE THE MEGASTRUCTURE ---
    const { bhGroup, eventHorizon, ergosphere } = constructBlackHole();
    group.add(bhGroup);

    const accretionDisk = constructAccretionDisk();
    group.add(accretionDisk);

    const trackRadius = 1200;
    const orbitalTrack = constructOrbitalTrack(trackRadius);
    group.add(orbitalTrack);

    // Add 4 massive Crawler-Cities
    const numCrawlers = 4;
    for(let i = 0; i < numCrawlers; i++) {
        const angle = (i / numCrawlers) * Math.PI * 2;
        const crawler = constructCrawler(angle, trackRadius);
        group.add(crawler);
        constructPayloads(i);
        
        parts.push({
            name: `Mobile Crawler-City ${i+1}`,
            description: "A gigantic mobile platform traversing the orbital track. Features operator cabins with tinted glass, joysticks, glowing screens, off-road treads, exhausts, and hydraulic pistons. Mounts the mass driver and capture funnel.",
            material: "Hyper-Alloy & Carbon Nanotubes",
            function: "Payload firing and capture orchestration",
            assemblyOrder: 5 + i,
            connections: ["Orbital Megatrack", "Railgun", "Magnetic Catcher"],
            failureEffect: "Explosive derailment",
            cascadeFailures: ["Track destruction", "Loss of extraction capability"],
            originalPosition: crawler.position.clone(),
            explodedPosition: new THREE.Vector3(crawler.position.x * 2, 500, crawler.position.z * 2)
        });
    }

    // --- ANIMATION LOOP ---
    const animate = (time, speed, meshes) => {
        const delta = speed * 0.01;
        animState.timeInternal += delta;

        // 1. Rotate Black Hole and Ergosphere (Frame dragging simulation)
        eventHorizon.rotation.y += 0.08 * speed;
        ergosphere.rotation.y += 0.08 * speed;

        // 2. Rotate Accretion Disk (Differential rotation)
        animState.accretionRings.forEach(ring => {
            ring.rotation.z += ring.userData.rotationSpeed * speed;
        });

        // 3. Pulse Navigation Lights
        animState.lights.forEach((light, i) => {
            light.material.emissiveIntensity = (Math.sin(animState.timeInternal * 5 + i) + 1) * 2;
        });

        // 4. Animate Hydraulic Pistons
        animState.pistons.forEach(p => {
            const oscillation = Math.sin(animState.timeInternal * p.speed + p.offset);
            p.shaft.position.y = p.basePos + (oscillation * p.range);
        });

        // 5. Drive Crawler-Cities along the track
        animState.crawlers.forEach((crawlerObj, i) => {
            // Crawlers move slowly along the track
            crawlerObj.angle -= 0.002 * speed; 
            const curX = Math.cos(crawlerObj.angle) * crawlerObj.radius;
            const curZ = Math.sin(crawlerObj.angle) * crawlerObj.radius;
            crawlerObj.group.position.set(curX, 0, curZ);
            crawlerObj.group.rotation.y = -crawlerObj.angle;

            // Spin wheels
            animState.wheels.forEach(wheel => {
                // Approximate rotation relative to track
                wheel.rotation.x -= 0.05 * speed; 
            });

            // Handle Payload Firing Sequence
            const payload = animState.payloads[i];
            const pGroup = payload.group;
            crawlerObj.fireProgress += 0.005 * speed;

            // Compute global positions
            const crawlerPos = crawlerObj.group.position.clone();
            // Gun points towards black hole center (0,0,0) with some elevation
            const dirToCenter = new THREE.Vector3(0,0,0).sub(crawlerPos).normalize();
            
            // Ergosphere boundary hit point
            const hitPoint = dirToCenter.clone().multiplyScalar(200); // radius of ergosphere equator
            
            if (crawlerObj.state === 'firing') {
                payload.chunk.visible = true;
                payload.fragNeg.visible = false;
                payload.fragPos.visible = false;

                // Animate coils lighting up sequentially
                const coilProg = crawlerObj.fireProgress * 1.5; // Coils light up fast
                crawlerObj.coils.forEach((coil, idx) => {
                    const idxNorm = idx / crawlerObj.coils.length;
                    if (Math.abs(coilProg - idxNorm) < 0.1) {
                        coil.material.emissiveIntensity = 8.0;
                    } else {
                        coil.material.emissiveIntensity *= 0.8; // fade out
                    }
                });

                // Move payload from gun to ergosphere
                pGroup.position.lerpVectors(crawlerPos, hitPoint, crawlerObj.fireProgress);
                payload.chunk.rotation.x += 0.2 * speed;
                payload.chunk.rotation.y += 0.3 * speed;

                if (crawlerObj.fireProgress >= 1.0) {
                    crawlerObj.state = 'splitting';
                    crawlerObj.fireProgress = 0;
                    crawlerObj.catcher.scale.setScalar(2.0); // flash catcher
                }
            } 
            else if (crawlerObj.state === 'splitting') {
                payload.chunk.visible = false;
                payload.fragNeg.visible = true;
                payload.fragPos.visible = true;

                // Negative fragment spirals into event horizon
                const fallProg = Math.min(crawlerObj.fireProgress * 2.0, 1.0);
                const spiralAngle = fallProg * Math.PI * 4;
                const currentRad = 200 - (fallProg * (200 - 80)); // 80 is event horizon
                
                payload.fragNeg.position.set(
                    Math.cos(spiralAngle) * currentRad,
                    -fallProg * 50,
                    Math.sin(spiralAngle) * currentRad
                );
                payload.fragNeg.scale.setScalar(1 - fallProg * 0.9);

                // Positive fragment escapes back to catcher via complex frame-dragged curve
                const escProg = Math.min(crawlerObj.fireProgress * 1.2, 1.0);
                // Compute catcher absolute position
                // Catcher is offset -120 in Z relative to crawler (which means backwards on track)
                const catcherOffset = new THREE.Vector3(0, 60, -120).applyEuler(crawlerObj.group.rotation);
                const catcherAbsolute = crawlerPos.clone().add(catcherOffset);

                // Bezier curve for escape trajectory using the ergosphere's rotation direction
                const curveControl = new THREE.Vector3(hitPoint.x * 0.5, 150, hitPoint.z * 0.5);
                const escCurve = new THREE.QuadraticBezierCurve3(hitPoint, curveControl, catcherAbsolute);
                
                const pos = escCurve.getPoint(escProg);
                // Position is absolute, group is at 0,0,0 for fragments now
                pGroup.position.set(0,0,0); 
                payload.fragPos.position.copy(pos);
                payload.fragPos.rotation.x += 1.0 * speed;
                payload.fragPos.rotation.y += 1.0 * speed;

                if (crawlerObj.fireProgress >= 1.0) {
                    crawlerObj.state = 'firing';
                    crawlerObj.fireProgress = 0;
                    payload.fragNeg.scale.setScalar(1);
                    crawlerObj.catcher.scale.setScalar(1.0);
                }
            }

            // Pulse catcher containment ring smoothly
            if (crawlerObj.catcher.scale.x > 1.0) {
                crawlerObj.catcher.scale.lerp(new THREE.Vector3(1,1,1), 0.05);
            }
        });
    };

    // --- QUIZ QUESTIONS ---
    const quizQuestions = [
        {
            question: "In the Penrose process, what is the theoretical maximum percentage of a maximally rotating Kerr black hole's rest mass that can be extracted as energy?",
            options: ["10.5%", "20.7%", "29.0%", "42.3%"],
            correctAnswer: 1,
            explanation: "For an extreme Kerr black hole (spin parameter a = M), the irreducible mass is M/sqrt(2). The difference between the total mass M and the irreducible mass represents the rotational energy available, which is (1 - 1/sqrt(2))M ≈ 0.207M, or 20.7%."
        },
        {
            question: "What physical condition defines the outer boundary of the ergosphere?",
            options: [
                "The radial coordinate equals the Schwarzschild radius.",
                "The time-translational Killing vector becomes null.",
                "The escape velocity exceeds the speed of light in a vacuum.",
                "The curvature scalar diverges to infinity."
            ],
            correctAnswer: 1,
            explanation: "The outer boundary of the ergosphere, or stationary limit surface, occurs where the time-translational Killing vector field becomes null (g_tt = 0). Inside this boundary, the vector becomes spacelike, meaning an observer cannot remain stationary with respect to infinity; they must co-rotate with the black hole."
        },
        {
            question: "For a particle to extract energy via the Penrose process, it must split into two fragments. What must be true about the fragment that falls into the event horizon?",
            options: [
                "It must have a negative angular momentum.",
                "It must exceed the speed of light locally.",
                "It must possess negative energy as measured by an observer at spatial infinity.",
                "It must have a rest mass of zero."
            ],
            correctAnswer: 2,
            explanation: "In the ergosphere, the energy corresponding to the time-translational Killing vector can be negative. The infalling fragment must be injected into an orbit with negative energy (E < 0) relative to infinity. By conservation of energy, the escaping fragment must then have more energy than the original incident particle."
        },
        {
            question: "The dragging of inertial frames by a rotating mass, which creates the ergosphere, is known in general relativity as the:",
            options: [
                "Shapiro Time Delay",
                "Lense-Thirring Effect",
                "Geodetic Effect",
                "Nordtvedt Effect"
            ],
            correctAnswer: 1,
            explanation: "The Lense-Thirring effect describes how a rotating massive body drags spacetime along with it. In a Kerr black hole, this effect is so extreme inside the stationary limit surface that all particles must co-rotate, creating the ergosphere."
        },
        {
            question: "In the context of the Kerr metric, what happens to the event horizons as the spin parameter 'a' increases and approaches the mass 'M'?",
            options: [
                "The outer horizon expands indefinitely.",
                "The inner (Cauchy) horizon and outer event horizon approach each other and merge at a=M.",
                "The ergosphere shrinks until it disappears.",
                "The singularity transforms from a ring to a point."
            ],
            correctAnswer: 1,
            explanation: "In the Kerr metric, the radii of the event horizons are given by r_± = M ± sqrt(M^2 - a^2). As the spin 'a' approaches the mass 'M', the inner horizon (r_-) and outer horizon (r_+) merge at r = M. This represents an extremal black hole."
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
