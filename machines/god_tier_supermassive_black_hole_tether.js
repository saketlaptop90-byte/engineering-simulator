import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const animState = {
        singularity: null,
        ergosphere: null,
        diskSegments: [],
        jets: [],
        tetherSegments: [],
        cars: [],
        reactionWheels: [],
        pistons: [],
        screens: [],
        rads: [],
        pumps: []
    };

    const description = "God Tier Supermassive Black Hole Tether. A staggering megastructure extending deep into the ergosphere of a rotating Kerr-metric supermassive black hole. Harvesting relativistic plasma and exotic particles, the tether uses hyper-tensile carbon-nanotube lattices and magnetic containment rings. Features include a gargantuan orbital counterweight, glowing relativistic harvester cars, massive gyroscopic stabilization tires, and intricate operator cabins.";

    const quizQuestions = [
        {
            question: "In the context of a rotating Kerr black hole, what is the Penrose process primarily used for by this megastructure?",
            options: [
                "Extracting rotational energy directly from the ergosphere",
                "Increasing the black hole's mass via targeted feeding",
                "Stabilizing the event horizon against Hawking radiation",
                "Forming the outer accretion disk artificially"
            ],
            answer: "Extracting rotational energy directly from the ergosphere"
        },
        {
            question: "What astrophysically defined boundary dictates the innermost edge of the surrounding accretion disk before matter inevitably plunges?",
            options: [
                "The Innermost Stable Circular Orbit (ISCO)",
                "The Photon Sphere",
                "The Schwarzschild radius",
                "The Static Limit"
            ],
            answer: "The Innermost Stable Circular Orbit (ISCO)"
        },
        {
            question: "The extreme frame-dragging effect near a rotating supermassive black hole, which places intense torsional strain on the tether, is known as:",
            options: [
                "Lense-Thirring precession",
                "Gravitational redshift",
                "Spaghettification",
                "The Chandrasekhar limit"
            ],
            answer: "Lense-Thirring precession"
        },
        {
            question: "What immense forces must the hyper-tensile tether withstand when extending into the ergosphere?",
            options: [
                "Extreme tidal forces and rotational shear",
                "Only pure radial gravity",
                "Electromagnetic repulsion from dark matter",
                "Weak nuclear force degradation"
            ],
            answer: "Extreme tidal forces and rotational shear"
        },
        {
            question: "Why do the harvester cars glow red-hot despite operating in the near-vacuum of space above the main disk?",
            options: [
                "Interaction with high-density plasma upflows, synchrotron radiation, and blue-shifted photons",
                "Internal mechanical failure of their cooling pumps",
                "Spontaneous combustion of onboard oxygen reserves",
                "Dark matter annihilation against the hull"
            ],
            answer: "Interaction with high-density plasma upflows, synchrotron radiation, and blue-shifted photons"
        }
    ];

    // ==========================================
    // CUSTOM MATERIALS
    // ==========================================
    const voidMat = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 1.0, metalness: 0.0, emissive: 0x000000 });
    const neonRed = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff1111, emissiveIntensity: 2.5, roughness: 0.1, metalness: 0.8 });
    const neonOrange = new THREE.MeshStandardMaterial({ color: 0xff8800, emissive: 0xff4400, emissiveIntensity: 3.0, roughness: 0.2, metalness: 0.6 });
    const neonBlue = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x00aaff, emissiveIntensity: 2.0, roughness: 0.2, metalness: 0.7 });
    const neonPurple = new THREE.MeshStandardMaterial({ color: 0x8800ff, emissive: 0xaa00ff, emissiveIntensity: 2.5, roughness: 0.1, metalness: 0.9 });
    const intenseWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 4.0, roughness: 0.0, metalness: 0.5 });
    const ablativeHull = new THREE.MeshStandardMaterial({ color: 0x220000, emissive: 0x880000, emissiveIntensity: 0.5, metalness: 0.9, roughness: 0.4 });
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x00ff88, emissive: 0x00ff88, emissiveIntensity: 1.5, roughness: 0.2, metalness: 0.1 });
    const hologramMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 1.0, transparent: true, opacity: 0.6, wireframe: true });
    
    // ==========================================
    // HELPER FUNCTIONS
    // ==========================================
    function registerPart(mesh, name, desc, mat, func, order, connections, fail, cascade, origPos, explPos) {
        mesh.name = name;
        mesh.position.copy(origPos);
        group.add(mesh);
        parts.push({
            name, description: desc, material: mat, function: func, assemblyOrder: order,
            connections, failureEffect: fail, cascadeFailures: cascade, originalPosition: origPos, explodedPosition: explPos
        });
        return mesh;
    }

    function createHydraulicPiston(len, rad, innerRatio = 0.7) {
        const pGroup = new THREE.Group();
        const outerGeo = new THREE.CylinderGeometry(rad, rad, len * 0.6, 32);
        const outer = new THREE.Mesh(outerGeo, steel);
        outer.position.y = len * 0.3;
        const innerGeo = new THREE.CylinderGeometry(rad * innerRatio, rad * innerRatio, len * 0.6, 32);
        const inner = new THREE.Mesh(innerGeo, chrome);
        inner.position.y = len * 0.7;
        pGroup.add(outer);
        pGroup.add(inner);
        animState.pistons.push({ inner, baseLength: len });
        return pGroup;
    }

    function createHydraulicLine(points, radius) {
        const curve = new THREE.CatmullRomCurve3(points);
        const tubeGeo = new THREE.TubeGeometry(curve, 32, radius, 12, false);
        return new THREE.Mesh(tubeGeo, rubber);
    }

    function addRivets(targetGroup, radius, count, yPos) {
        for(let i=0; i<count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const rGeo = new THREE.SphereGeometry(radius * 0.05, 8, 8);
            const rMesh = new THREE.Mesh(rGeo, darkSteel);
            rMesh.position.set(Math.cos(angle)*radius, yPos, Math.sin(angle)*radius);
            targetGroup.add(rMesh);
        }
    }

    // ==========================================
    // PART BUILDERS
    // ==========================================

    function buildSingularityCore() {
        const core = new THREE.Group();
        const ehGeo = new THREE.SphereGeometry(200, 128, 128);
        const eh = new THREE.Mesh(ehGeo, voidMat);
        core.add(eh);

        const photonGeo = new THREE.SphereGeometry(210, 64, 64);
        const photonMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1.0, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending });
        const photon = new THREE.Mesh(photonGeo, photonMat);
        core.add(photon);
        
        animState.singularity = core;
        return core;
    }

    function buildErgosphereBoundary() {
        const ergoGeo = new THREE.SphereGeometry(350, 64, 64);
        ergoGeo.scale(1.2, 0.8, 1.2); // Oblate spheroid
        const ergoMat = new THREE.MeshStandardMaterial({ color: 0x8800ff, emissive: 0x4400aa, wireframe: true, transparent: true, opacity: 0.05, blending: THREE.AdditiveBlending });
        const ergo = new THREE.Mesh(ergoGeo, ergoMat);
        animState.ergosphere = ergo;
        return ergo;
    }

    function buildAccretionDisk(innerRadius, count, startEmissive, endEmissive) {
        const disk = new THREE.Group();
        for(let i=0; i<count; i++) {
            const r = innerRadius + i * 12;
            const t = 4 + Math.random() * 8;
            const geo = new THREE.TorusGeometry(r, t, 32, 128);
            
            // Interpolate colors
            const c1 = new THREE.Color(startEmissive);
            const c2 = new THREE.Color(endEmissive);
            const c = c1.lerp(c2, i/count);
            
            const mat = new THREE.MeshStandardMaterial({
                color: c, emissive: c, emissiveIntensity: 2.0 - (i/count)*1.5,
                transparent: true, opacity: 0.85 - (i/count)*0.5, blending: THREE.AdditiveBlending
            });
            
            const ring = new THREE.Mesh(geo, mat);
            ring.rotation.x = Math.PI / 2;
            ring.rotation.y = Math.random() * Math.PI;
            
            // Add debris
            for(let d=0; d<20; d++) {
                const debGeo = new THREE.BoxGeometry(t, t, t);
                const deb = new THREE.Mesh(debGeo, mat);
                const a = Math.random() * Math.PI * 2;
                deb.position.set(Math.cos(a)*r, (Math.random()-0.5)*t*2, Math.sin(a)*r);
                deb.rotation.set(Math.random(), Math.random(), Math.random());
                ring.add(deb);
            }
            
            disk.add(ring);
            animState.diskSegments.push({ mesh: ring, speed: 0.08 - (i/count)*0.06, baseRot: ring.rotation.y });
        }
        return disk;
    }

    function buildPolarJet(isNorth) {
        const jet = new THREE.Group();
        const dir = isNorth ? 1 : -1;
        
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(20, 0);
        shape.bezierCurveTo(40, 200, 100, 800, 300, 2000);
        shape.lineTo(0, 2000);
        shape.lineTo(0, 0);
        
        const geo = new THREE.LatheGeometry(shape.getPoints(), 64);
        const mat = new THREE.MeshStandardMaterial({
            color: 0x0088ff, emissive: 0x0044ff, emissiveIntensity: 2.0,
            transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending, side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(geo, mat);
        if(!isNorth) mesh.rotation.x = Math.PI;
        
        jet.add(mesh);
        
        // Add energy core
        const coreGeo = new THREE.CylinderGeometry(5, 50, 2000, 32);
        coreGeo.translate(0, 1000, 0);
        const coreMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 4.0, transparent: true, opacity: 0.8 });
        const core = new THREE.Mesh(coreGeo, coreMat);
        if(!isNorth) core.rotation.x = Math.PI;
        jet.add(core);

        animState.jets.push({ mesh: jet, baseScale: 1.0 });
        return jet;
    }

    function buildTetherSection(length, segments, yOffset) {
        const sec = new THREE.Group();
        const segLen = length / segments;
        for(let i=0; i<segments; i++) {
            const y = (i * segLen) - (length/2) + (segLen/2);
            
            // Core
            const coreGeo = new THREE.CylinderGeometry(15, 15, segLen, 64);
            const core = new THREE.Mesh(coreGeo, darkSteel);
            core.position.y = y;
            sec.add(core);
            
            // Outer lattice
            const latticeGeo = new THREE.CylinderGeometry(18, 18, segLen, 16, 1, true);
            const latticeMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.3, wireframe: true });
            const lattice = new THREE.Mesh(latticeGeo, latticeMat);
            lattice.position.y = y;
            sec.add(lattice);

            // Energy Pulse ring
            const pulseGeo = new THREE.TorusGeometry(19, 1, 16, 64);
            const pulse = new THREE.Mesh(pulseGeo, neonBlue);
            pulse.position.y = y;
            sec.add(pulse);
            
            animState.tetherSegments.push({ mesh: pulse, index: i, total: segments });
        }
        
        sec.position.y = yOffset;
        return sec;
    }

    function buildMagneticNodes(count, spacing, startY) {
        const nodes = new THREE.Group();
        for(let i=0; i<count; i++) {
            const nodeGroup = new THREE.Group();
            
            // Central Torus
            const tGeo = new THREE.TorusGeometry(40, 8, 32, 128);
            const tMesh = new THREE.Mesh(tGeo, steel);
            tMesh.rotation.x = Math.PI/2;
            nodeGroup.add(tMesh);
            
            // Spokes
            for(let s=0; s<6; s++) {
                const angle = (s/6) * Math.PI * 2;
                const spokeGeo = new THREE.CylinderGeometry(2, 2, 40, 16);
                const spoke = new THREE.Mesh(spokeGeo, chrome);
                spoke.position.set(Math.cos(angle)*20, 0, Math.sin(angle)*20);
                spoke.rotation.z = Math.PI/2;
                spoke.rotation.y = -angle;
                nodeGroup.add(spoke);
            }

            // Outer emitter
            const emitGeo = new THREE.TorusGeometry(42, 2, 16, 128);
            const emit = new THREE.Mesh(emitGeo, neonPurple);
            emit.rotation.x = Math.PI/2;
            nodeGroup.add(emit);

            nodeGroup.position.y = startY + i * spacing;
            nodes.add(nodeGroup);
        }
        return nodes;
    }

    function buildReactionWheel() {
        const wheelGroup = new THREE.Group();
        
        // TIRES: Torus with tiny extruded lugs
        const torusGeo = new THREE.TorusGeometry(80, 20, 64, 256);
        const torusMesh = new THREE.Mesh(torusGeo, rubber);
        wheelGroup.add(torusMesh);
        
        const lugCount = 400;
        for(let i=0; i<lugCount; i++) {
            const angle = (i / lugCount) * Math.PI * 2;
            // Aggressive off-road tread lug
            const lugShape = new THREE.Shape();
            lugShape.moveTo(-2, -2); lugShape.lineTo(2, -2); lugShape.lineTo(1, 4); lugShape.lineTo(-1, 4);
            const lugGeo = new THREE.ExtrudeGeometry(lugShape, { depth: 10, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.5, bevelThickness: 0.5 });
            lugGeo.translate(0, 0, -5); // center depth
            const lugMesh = new THREE.Mesh(lugGeo, rubber);
            lugMesh.position.set(Math.cos(angle)*100, Math.sin(angle)*100, 0);
            lugMesh.rotation.z = angle - Math.PI/2;
            wheelGroup.add(lugMesh);
        }
        
        // Rims: CylinderGeometry with complex spoke arrays
        const rimGeo = new THREE.CylinderGeometry(60, 60, 16, 128);
        const rimMesh = new THREE.Mesh(rimGeo, chrome);
        rimMesh.rotation.x = Math.PI / 2;
        wheelGroup.add(rimMesh);
        
        const spokeCount = 48;
        for(let i=0; i<spokeCount; i++) {
            const angle = (i / spokeCount) * Math.PI * 2;
            const sGroup = new THREE.Group();
            
            const spokeGeo = new THREE.CylinderGeometry(1, 3, 60, 16);
            const spokeMesh = new THREE.Mesh(spokeGeo, steel);
            spokeMesh.position.y = 30;
            sGroup.add(spokeMesh);

            // Add detail piston to spoke
            const p = createHydraulicPiston(20, 1.5);
            p.position.set(2, 30, 0);
            sGroup.add(p);
            
            sGroup.rotation.z = angle;
            wheelGroup.add(sGroup);
        }

        // Center hub
        const centerGeo = new THREE.SphereGeometry(25, 32, 32);
        const center = new THREE.Mesh(centerGeo, darkSteel);
        wheelGroup.add(center);

        return wheelGroup;
    }

    function buildHarvesterCar() {
        const car = new THREE.Group();
        
        // Highly detailed complex main body using ExtrudeGeometry (No simple cubes)
        const bShape = new THREE.Shape();
        bShape.moveTo(0, 0); bShape.lineTo(40, 0); bShape.lineTo(45, 10); bShape.lineTo(45, 80); 
        bShape.lineTo(35, 100); bShape.lineTo(20, 110); bShape.lineTo(-20, 110); 
        bShape.lineTo(-35, 100); bShape.lineTo(-45, 80); bShape.lineTo(-45, 10); bShape.lineTo(-40, 0); bShape.lineTo(0,0);
        const exSet = { depth: 40, bevelEnabled: true, bevelSegments: 8, steps: 2, bevelSize: 2, bevelThickness: 2 };
        const bodyGeo = new THREE.ExtrudeGeometry(bShape, exSet);
        bodyGeo.translate(0, -50, -20);
        const body = new THREE.Mesh(bodyGeo, ablativeHull);
        car.add(body);
        
        // Add panel lines
        const panelGeo = new THREE.BoxGeometry(92, 1, 42);
        for(let y=-30; y<=90; y+=20) {
            const panel = new THREE.Mesh(panelGeo, darkSteel);
            panel.position.y = y;
            car.add(panel);
        }

        // Add Rivets
        addRivets(car, 45, 30, -40);
        addRivets(car, 45, 30, 80);
        
        // Hydraulic Gripping Claws (4 around the tether)
        for(let c=0; c<4; c++) {
            const angle = (c/4) * Math.PI * 2;
            const clawGrp = new THREE.Group();
            
            const armGeo = new THREE.BoxGeometry(10, 40, 10);
            const arm = new THREE.Mesh(armGeo, steel);
            arm.position.y = 20;
            clawGrp.add(arm);
            
            const p1 = createHydraulicPiston(30, 2);
            p1.position.set(8, 20, 0);
            p1.rotation.z = Math.PI/8;
            clawGrp.add(p1);

            clawGrp.position.set(Math.cos(angle)*25, -60, Math.sin(angle)*25);
            clawGrp.rotation.y = -angle;
            clawGrp.rotation.x = Math.PI/6;
            car.add(clawGrp);
        }

        // Cooling Fins / Radiators
        const finGeo = new THREE.BoxGeometry(2, 60, 15);
        for(let f=0; f<10; f++) {
            const fin1 = new THREE.Mesh(finGeo, copper);
            fin1.position.set(-46, 20, -15 + f*3);
            car.add(fin1);
            
            const fin2 = new THREE.Mesh(finGeo, copper);
            fin2.position.set(46, 20, -15 + f*3);
            car.add(fin2);
        }

        // Detailed Operator Cabin
        const cabinGroup = new THREE.Group();
        const cabShape = new THREE.Shape();
        cabShape.moveTo(-15,0); cabShape.lineTo(15,0); cabShape.lineTo(12,20); cabShape.lineTo(-12,20); cabShape.lineTo(-15,0);
        const cabGeo = new THREE.ExtrudeGeometry(cabShape, {depth: 25, bevelEnabled: true});
        cabGeo.translate(0, 0, -12.5);
        const cabin = new THREE.Mesh(cabGeo, plastic);
        cabinGroup.add(cabin);

        // Tinted Glass Front
        const glassGeo = new THREE.PlaneGeometry(20, 15);
        const glass = new THREE.Mesh(glassGeo, tinted);
        glass.position.set(0, 10, 13);
        glass.rotation.x = -0.1;
        cabinGroup.add(glass);

        // Inside cabin: Steering Wheel
        const steerGeo = new THREE.TorusGeometry(3, 0.4, 16, 32);
        const wheel = new THREE.Mesh(steerGeo, rubber);
        wheel.position.set(0, 8, 8);
        wheel.rotation.x = -Math.PI/3;
        cabinGroup.add(wheel);

        // Inside cabin: Joysticks
        const joyGeo = new THREE.CylinderGeometry(0.5, 0.5, 5);
        const joy1 = new THREE.Mesh(joyGeo, darkSteel);
        joy1.position.set(-6, 6, 8);
        joy1.rotation.x = -0.5;
        const joyBall = new THREE.Mesh(new THREE.SphereGeometry(1, 16,16), neonRed);
        joyBall.position.y = 2.5;
        joy1.add(joyBall);
        cabinGroup.add(joy1);

        const joy2 = joy1.clone();
        joy2.position.set(6, 6, 8);
        cabinGroup.add(joy2);

        // Inside cabin: Glowing Control Screens
        const scGeo = new THREE.PlaneGeometry(6, 4);
        const screen1 = new THREE.Mesh(scGeo, screenMat);
        screen1.position.set(-8, 10, 9);
        screen1.rotation.y = Math.PI/4;
        cabinGroup.add(screen1);
        animState.screens.push(screen1);

        const screen2 = new THREE.Mesh(scGeo, neonOrange);
        screen2.position.set(8, 10, 9);
        screen2.rotation.y = -Math.PI/4;
        cabinGroup.add(screen2);
        animState.screens.push(screen2);

        cabinGroup.position.set(0, 110, 20);
        car.add(cabinGroup);

        // Side Mirrors
        const mGrp1 = new THREE.Group();
        const mArm = new THREE.Mesh(new THREE.CylinderGeometry(0.5,0.5,10), steel);
        mArm.rotation.z = Math.PI/2;
        mArm.position.x = 5;
        mGrp1.add(mArm);
        const mBox = new THREE.Mesh(new THREE.BoxGeometry(2, 6, 4), plastic);
        mBox.position.set(10, 0, 0);
        const mGlass = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 5.8), chrome);
        mGlass.position.set(10, 0, 2.1);
        mGrp1.add(mBox); mGrp1.add(mGlass);
        mGrp1.position.set(15, 115, 30);
        car.add(mGrp1);

        const mGrp2 = mGrp1.clone();
        mGrp2.position.set(-15, 115, 30);
        mGrp2.scale.set(-1, 1, 1);
        car.add(mGrp2);

        // Exhaust Stacks
        for(let e=0; e<4; e++) {
            const exGeo = new THREE.CylinderGeometry(2, 3, 20, 16);
            const ex = new THREE.Mesh(exGeo, darkSteel);
            ex.position.set(-30 + (e%2)*60, 120, -10 + Math.floor(e/2)*10);
            
            const fire = new THREE.Mesh(new THREE.SphereGeometry(2.5, 16, 16), neonBlue);
            fire.position.y = 12;
            fire.scale.y = 3;
            ex.add(fire);
            animState.rads.push(fire); // reuse rads array for pulsing
            
            car.add(ex);
        }

        // Ladders
        const ladGrp = new THREE.Group();
        const railGeo = new THREE.CylinderGeometry(0.5, 0.5, 140);
        const r1 = new THREE.Mesh(railGeo, steel); r1.position.x = -3;
        const r2 = new THREE.Mesh(railGeo, steel); r2.position.x = 3;
        ladGrp.add(r1); ladGrp.add(r2);
        for(let l=-65; l<65; l+=5) {
            const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.4,0.4, 6), steel);
            rung.rotation.z = Math.PI/2;
            rung.position.y = l;
            ladGrp.add(rung);
        }
        ladGrp.position.set(0, 20, 21);
        car.add(ladGrp);

        // Hydraulic Lines wrapping the body
        const pts = [
            new THREE.Vector3(-45, -40, 0),
            new THREE.Vector3(-47, 0, 10),
            new THREE.Vector3(-46, 50, -5),
            new THREE.Vector3(-30, 90, 0),
            new THREE.Vector3(-15, 105, 10)
        ];
        const hLine1 = createHydraulicLine(pts, 1.5);
        car.add(hLine1);

        return car;
    }

    function buildOrbitalCounterweightHub() {
        const hub = new THREE.Group();
        
        // Main structural core using LatheGeometry
        const pts = [];
        for(let i=0; i<=40; i++) {
            pts.push(new THREE.Vector2(100 + Math.sin(i*0.3)*30, (i-20)*20));
        }
        const coreGeo = new THREE.LatheGeometry(pts, 128);
        const core = new THREE.Mesh(coreGeo, darkSteel);
        hub.add(core);

        // Add 8 massive spokes to connect to centrifuge rings
        for(let i=0; i<8; i++) {
            const angle = (i/8) * Math.PI * 2;
            const spokeGeo = new THREE.BoxGeometry(400, 30, 30);
            const spoke = new THREE.Mesh(spokeGeo, steel);
            spoke.position.set(Math.cos(angle)*200, 0, Math.sin(angle)*200);
            spoke.rotation.y = -angle;
            
            // Add pipes on spokes
            const pipeGeo = new THREE.CylinderGeometry(5, 5, 400);
            const pipe = new THREE.Mesh(pipeGeo, copper);
            pipe.rotation.z = Math.PI/2;
            pipe.position.set(0, 20, 0);
            spoke.add(pipe);

            hub.add(spoke);
        }

        // Centrifuge Rings (Counter-rotating habitats)
        const ring1Geo = new THREE.TorusGeometry(380, 40, 64, 256);
        const ring1 = new THREE.Mesh(ring1Geo, plastic);
        ring1.rotation.x = Math.PI/2;
        ring1.position.y = 50;
        
        // Add windows to ring1
        for(let w=0; w<100; w++) {
            const a = (w/100)*Math.PI*2;
            const win = new THREE.Mesh(new THREE.PlaneGeometry(10, 20), intenseWhite);
            win.position.set(Math.cos(a)*421, 0, Math.sin(a)*421);
            win.rotation.y = -a + Math.PI/2;
            ring1.add(win);
        }
        hub.add(ring1);
        
        const ring2 = ring1.clone();
        ring2.position.y = -50;
        hub.add(ring2);

        animState.diskSegments.push({mesh: ring1, speed: 0.01, baseRot: 0});
        animState.diskSegments.push({mesh: ring2, speed: -0.01, baseRot: 0});

        return hub;
    }

    function buildEnergyRadiators() {
        const radGrp = new THREE.Group();
        const radGeo = new THREE.BoxGeometry(20, 600, 200);
        
        for(let i=0; i<4; i++) {
            const angle = (i/4)*Math.PI*2 + Math.PI/4;
            const panelGrp = new THREE.Group();
            
            const panel = new THREE.Mesh(radGeo, darkSteel);
            panelGrp.add(panel);
            
            // Glowing coolant lines on radiator
            for(let c=-80; c<=80; c+=20) {
                const line = new THREE.Mesh(new THREE.BoxGeometry(22, 580, 5), neonRed);
                line.position.z = c;
                panelGrp.add(line);
                animState.rads.push(line);
            }
            
            panelGrp.position.set(Math.cos(angle)*500, 300, Math.sin(angle)*500);
            panelGrp.rotation.y = -angle;
            radGrp.add(panelGrp);
        }
        return radGrp;
    }

    function buildCoolantPumpStation() {
        const pumpGrp = new THREE.Group();
        const baseGeo = new THREE.CylinderGeometry(150, 180, 100, 64);
        const base = new THREE.Mesh(baseGeo, darkSteel);
        pumpGrp.add(base);

        for(let i=0; i<12; i++) {
            const angle = (i/12) * Math.PI * 2;
            
            // Huge pistons
            const p = createHydraulicPiston(80, 10);
            p.position.set(Math.cos(angle)*120, 50, Math.sin(angle)*120);
            p.rotation.y = -angle;
            p.rotation.z = Math.PI/8;
            pumpGrp.add(p);
            
            // Vast tubing
            const tubeCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(Math.cos(angle)*130, 0, Math.sin(angle)*130),
                new THREE.Vector3(Math.cos(angle)*160, 100, Math.sin(angle)*160),
                new THREE.Vector3(0, 150, 0)
            ]);
            const tube = new THREE.Mesh(new THREE.TubeGeometry(tubeCurve, 32, 6, 16, false), copper);
            pumpGrp.add(tube);
        }
        return pumpGrp;
    }

    function buildAntimatterContainmentPods() {
        const amGrp = new THREE.Group();
        for(let i=0; i<16; i++) {
            const angle = (i/16)*Math.PI*2;
            const podGrp = new THREE.Group();
            
            const shellGeo = new THREE.CapsuleGeometry(30, 80, 32, 32);
            const shell = new THREE.Mesh(shellGeo, chrome);
            podGrp.add(shell);
            
            const coreGeo = new THREE.SphereGeometry(25, 32, 32);
            const core = new THREE.Mesh(coreGeo, neonPurple);
            podGrp.add(core);
            animState.rads.push(core);
            
            // Grille wrap
            for(let g=0; g<10; g++) {
                const grGeo = new THREE.TorusGeometry(31, 2, 8, 32);
                const gr = new THREE.Mesh(grGeo, steel);
                gr.position.y = -40 + g*10;
                gr.rotation.x = Math.PI/2;
                podGrp.add(gr);
            }

            podGrp.position.set(Math.cos(angle)*600, -200, Math.sin(angle)*600);
            podGrp.rotation.x = Math.PI/4;
            podGrp.rotation.y = -angle;
            amGrp.add(podGrp);
        }
        return amGrp;
    }

    function buildObservationControlDeck() {
        const deckGrp = new THREE.Group();
        const hullGeo = new THREE.SphereGeometry(80, 64, 64, 0, Math.PI*2, 0, Math.PI/2.5);
        const hull = new THREE.Mesh(hullGeo, plastic);
        deckGrp.add(hull);
        
        const floorGeo = new THREE.CylinderGeometry(75, 75, 5, 64);
        const floor = new THREE.Mesh(floorGeo, steel);
        floor.position.y = 40;
        deckGrp.add(floor);
        
        const winGeo = new THREE.SphereGeometry(78, 64, 64, 0, Math.PI*2, Math.PI/2.5, Math.PI/1.5);
        const win = new THREE.Mesh(winGeo, hologramMat);
        deckGrp.add(win);

        // Control consoles inside
        for(let i=0; i<5; i++) {
            const angle = (i/5)*Math.PI + Math.PI/2;
            const console = new THREE.Group();
            
            const desk = new THREE.Mesh(new THREE.BoxGeometry(20, 15, 10), darkSteel);
            desk.position.y = 47.5;
            console.add(desk);
            
            const screen = new THREE.Mesh(new THREE.PlaneGeometry(16, 8), neonBlue);
            screen.position.set(0, 56, -4);
            screen.rotation.x = -Math.PI/6;
            console.add(screen);
            animState.screens.push(screen);
            
            // Add tiny joysticks
            const joy = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 4), steel);
            joy.position.set(-5, 56, 2);
            joy.rotation.x = -0.5;
            console.add(joy);

            console.position.set(Math.cos(angle)*40, 0, Math.sin(angle)*40);
            console.rotation.y = -angle + Math.PI/2;
            deckGrp.add(console);
        }

        return deckGrp;
    }


    // ==========================================
    // ASSEMBLY
    // ==========================================

    // 1. Singularity
    registerPart(buildSingularityCore(), 'Singularity_Core', 'The event horizon of the supermassive black hole. Perfectly black, absorbing all light, surrounded by a faint photon sphere.', 'voidMat / emissiveWhite', 'Gravitational anchor point. Spacetime curvature source.', 1, ['Ergosphere_Boundary', 'Inner_Accretion_Disk'], 'End of the universe as we know it.', ['All'], new THREE.Vector3(0, -6000, 0), new THREE.Vector3(0, -6000, 0));

    // 2. Ergosphere
    registerPart(buildErgosphereBoundary(), 'Ergosphere_Boundary', 'The region where spacetime is dragged at the speed of light. Visualization grid of the oblate spheroid boundary.', 'hologramMat', 'Defines the extraction zone for the Penrose process.', 2, ['Singularity_Core'], 'Loss of rotational energy harvesting capability.', [], new THREE.Vector3(0, -6000, 0), new THREE.Vector3(0, -6000, 0));

    // 3. Inner Disk
    registerPart(buildAccretionDisk(220, 10, 0xffffff, 0xff5500), 'Inner_Accretion_Disk', 'Ultra-hot plasma swirling at the ISCO. Generates immense X-ray radiation.', 'Multi-layered Emissive', 'Provides raw thermal and kinetic energy.', 3, ['Singularity_Core'], 'Tether incineration from uncontained plasma flares.', ['Primary_Tether_Lower'], new THREE.Vector3(0, -6000, 0), new THREE.Vector3(0, -6000, 0));

    // 4. Outer Disk
    registerPart(buildAccretionDisk(350, 20, 0xff2200, 0x440000), 'Outer_Accretion_Disk', 'Cooler, slower rotating matter forming the bulk of the disk.', 'Multi-layered Emissive', 'Feeds the inner disk and provides shielding.', 4, ['Inner_Accretion_Disk'], 'Starvation of the energy extraction process.', [], new THREE.Vector3(0, -6000, 0), new THREE.Vector3(0, -6000, 0));

    // 5. Polar Jet North
    registerPart(buildPolarJet(true), 'Relativistic_Jet_North', 'Astrophysical jet of ionized matter accelerated to relativistic speeds along the magnetic poles.', 'neonBlue', 'Exhaust mechanism for non-accreted matter.', 5, ['Singularity_Core'], 'Magnetic field collapse.', ['Magnetic_Containment_Nodes'], new THREE.Vector3(0, -6000, 0), new THREE.Vector3(0, -4000, 0));

    // 6. Polar Jet South
    registerPart(buildPolarJet(false), 'Relativistic_Jet_South', 'Astrophysical jet extending downward.', 'neonBlue', 'Exhaust mechanism.', 6, ['Singularity_Core'], 'Magnetic field collapse.', ['Magnetic_Containment_Nodes'], new THREE.Vector3(0, -6000, 0), new THREE.Vector3(0, -8000, 0));

    // 7. Tether Lower
    registerPart(buildTetherSection(3000, 150, -3500), 'Primary_Tether_Lower', 'Lower segment of the hyper-tensile carbon-nanotube composite tether. Pulses with extracted energy.', 'darkSteel / neonBlue', 'Structural backbone and energy conduit.', 7, ['Magnetic_Containment_Nodes', 'Orbital_Counterweight_Hub'], 'Catastrophic snapping due to tidal forces.', ['Harvester_Car_Alpha', 'Orbital_Counterweight_Hub'], new THREE.Vector3(0,0,0), new THREE.Vector3(0, -3500, 500));

    // 8. Tether Upper
    registerPart(buildTetherSection(3000, 150, -500), 'Primary_Tether_Upper', 'Upper segment of the tether connecting to the counterweight.', 'darkSteel / neonBlue', 'Structural backbone.', 8, ['Primary_Tether_Lower', 'Orbital_Counterweight_Hub'], 'Orbital trajectory destabilization.', ['Orbital_Counterweight_Hub'], new THREE.Vector3(0,0,0), new THREE.Vector3(0, -500, -500));

    // 9. Magnetic Nodes
    registerPart(buildMagneticNodes(20, 300, -4800), 'Magnetic_Containment_Nodes', 'Giant toroidal electromagnets spaced along the tether to prevent plasma degradation.', 'steel / neonPurple', 'Shields the tether from intense disk radiation.', 9, ['Primary_Tether_Lower'], 'Tether melting.', ['Primary_Tether_Lower'], new THREE.Vector3(0,0,0), new THREE.Vector3(300, -2000, 0));

    // 10. Harvester Car Alpha
    const carA = buildHarvesterCar();
    animState.cars.push({ mesh: carA, offset: 0, speed: 0.05 });
    registerPart(carA, 'Harvester_Car_Alpha', 'Relativistic climbing vehicle designed to harvest zero-point energy. Features intricate cabins, hydraulics, and glowing ablative shielding.', 'ablativeHull / copper', 'Matter/Energy transport.', 10, ['Primary_Tether_Lower'], 'Vaporization.', [], new THREE.Vector3(0, -2000, 0), new THREE.Vector3(-300, -2000, 300));

    // 11. Harvester Car Beta
    const carB = buildHarvesterCar();
    carB.rotation.y = Math.PI;
    animState.cars.push({ mesh: carB, offset: Math.PI, speed: 0.04 });
    registerPart(carB, 'Harvester_Car_Beta', 'Secondary transport climber.', 'ablativeHull', 'Matter/Energy transport.', 11, ['Primary_Tether_Lower'], 'Vaporization.', [], new THREE.Vector3(0, -3000, 0), new THREE.Vector3(300, -3000, -300));

    // 12. Harvester Car Gamma
    const carC = buildHarvesterCar();
    carC.rotation.y = Math.PI/2;
    animState.cars.push({ mesh: carC, offset: Math.PI/2, speed: 0.06 });
    registerPart(carC, 'Harvester_Car_Gamma', 'Tertiary rapid transport climber.', 'ablativeHull', 'Matter/Energy transport.', 12, ['Primary_Tether_Upper'], 'Vaporization.', [], new THREE.Vector3(0, -1000, 0), new THREE.Vector3(300, -1000, 300));

    // 13. Counterweight Hub
    registerPart(buildOrbitalCounterweightHub(), 'Orbital_Counterweight_Hub', 'Gargantuan station keeping the tether taut via centrifugal force. Contains vast habitats.', 'darkSteel / plastic', 'Tension provision and habitation.', 13, ['Primary_Tether_Upper'], 'Station de-orbit into the black hole.', ['All'], new THREE.Vector3(0, 1500, 0), new THREE.Vector3(0, 2000, 0));

    // 14. Reaction Wheels
    const rwGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const angle = (i/4)*Math.PI*2;
        const rw = buildReactionWheel();
        rw.position.set(Math.cos(angle)*800, 0, Math.sin(angle)*800);
        rw.rotation.y = -angle;
        rwGroup.add(rw);
        animState.reactionWheels.push(rw);
    }
    registerPart(rwGroup, 'Gyroscopic_Reaction_Wheels', 'Four colossal tire-like structures with extruded lugs and spoke arrays providing extreme gyroscopic stabilization.', 'rubber / chrome', 'Counteracts Lense-Thirring precession.', 14, ['Orbital_Counterweight_Hub'], 'Uncontrollable spin.', ['Primary_Tether_Upper'], new THREE.Vector3(0, 1500, 0), new THREE.Vector3(0, 2500, 800));

    // 15. Coolant Pumps
    registerPart(buildCoolantPumpStation(), 'Coolant_Pump_Station', 'Vast array of hydraulic pistons and copper piping circulating superfluid helium.', 'darkSteel / copper', 'Thermal regulation.', 15, ['Orbital_Counterweight_Hub', 'Primary_Tether_Upper'], 'Meltdown.', ['Orbital_Counterweight_Hub'], new THREE.Vector3(0, 1000, 0), new THREE.Vector3(0, 1000, 500));

    // 16. Observation Deck
    registerPart(buildObservationControlDeck(), 'Observation_Control_Deck', 'Command center with tinted holographic glass, joysticks, steering wheels, and glowing screens.', 'plastic / hologramMat', 'Operational oversight.', 16, ['Orbital_Counterweight_Hub'], 'Loss of manual control.', [], new THREE.Vector3(0, 1900, 0), new THREE.Vector3(0, 3000, 0));

    // 17. Energy Radiators
    registerPart(buildEnergyRadiators(), 'Energy_Radiator_Arrays', 'Massive flat panels dissipating exotic waste heat, laced with glowing red coolant lines.', 'darkSteel / neonRed', 'Heat dissipation.', 17, ['Orbital_Counterweight_Hub'], 'Thermal buildup.', ['Coolant_Pump_Station'], new THREE.Vector3(0, 1500, 0), new THREE.Vector3(-1000, 1500, 0));

    // 18. Antimatter Pods
    registerPart(buildAntimatterContainmentPods(), 'Antimatter_Containment_Ring', 'Ring of heavily shielded pods storing anti-particles harvested from the jet.', 'chrome / neonPurple', 'Energy storage.', 18, ['Orbital_Counterweight_Hub'], '10,000 megaton annihilation explosion.', ['Orbital_Counterweight_Hub'], new THREE.Vector3(0, 1800, 0), new THREE.Vector3(1000, 1800, 1000));


    // ==========================================
    // ANIMATION LOOP
    // ==========================================
    function animate(time, speed, meshes) {
        const t = time * speed;
        
        // 1. Black Hole Spin (Extreme speed)
        if(animState.singularity) {
            animState.singularity.rotation.y = t * 5.0;
        }
        
        // 2. Ergosphere warping
        if(animState.ergosphere) {
            animState.ergosphere.rotation.y = t * 2.0;
            animState.ergosphere.scale.x = 1.2 + Math.sin(t*3)*0.02;
            animState.ergosphere.scale.z = 1.2 + Math.cos(t*3)*0.02;
        }

        // 3. Accretion Disk & Centrifuge Rings differential rotation
        animState.diskSegments.forEach(seg => {
            seg.mesh.rotation.y = seg.baseRot + t * seg.speed * 20;
        });

        // 4. Polar Jets pulsing
        animState.jets.forEach(jet => {
            jet.mesh.scale.set(
                jet.baseScale + Math.sin(t*15)*0.05,
                1,
                jet.baseScale + Math.sin(t*15)*0.05
            );
        });

        // 5. Tether pulsing
        animState.tetherSegments.forEach(seg => {
            const phase = (seg.index / seg.total) * Math.PI * 20;
            // Modulate emissive intensity to look like energy traveling UP the tether
            if(seg.mesh.material && seg.mesh.material.emissiveIntensity !== undefined) {
                seg.mesh.material.emissiveIntensity = Math.max(0, Math.sin(t * 10 - phase) * 3);
            }
        });

        // 6. Harvester Cars climbing
        animState.cars.forEach(car => {
            // Sine wave to move up and down the tether
            const climbPhase = t * car.speed + car.offset;
            car.mesh.position.y = -2000 + Math.sin(climbPhase) * 2500;
            
            // Adjust glowing hull based on depth (closer to black hole = hotter)
            car.mesh.children.forEach(child => {
                if(child.material === ablativeHull) {
                    const depthFactor = Math.max(0, (-car.mesh.position.y - 500) / 4000);
                    child.material.emissiveIntensity = 0.5 + depthFactor * 4.0;
                }
            });
        });

        // 7. Hydraulics Pumping
        animState.pistons.forEach((p, i) => {
            p.inner.position.y = p.baseLength * 0.5 + Math.sin(t * 8 + i) * p.baseLength * 0.2;
        });

        // 8. Reaction Wheels spinning
        animState.reactionWheels.forEach(rw => {
            rw.rotation.z -= 2.0 * speed;
            rw.rotation.x += Math.sin(t)*0.01; // slight gyroscopic wobble
        });

        // 9. Screens Flickering
        animState.screens.forEach((s, i) => {
            s.material.emissiveIntensity = 1.0 + Math.random() * 1.5;
        });

        // 10. Radiators / Pods pulsing
        animState.rads.forEach((r, i) => {
            r.material.emissiveIntensity = 1.0 + Math.sin(t*5 + i*0.1)*0.5;
            if(r.geometry.type === 'SphereGeometry') { // Exhaust fire
                r.scale.set(1 + Math.random()*0.2, 3 + Math.random(), 1 + Math.random()*0.2);
            }
        });
    }

    return { group, parts, description, quizQuestions, animate };
}
