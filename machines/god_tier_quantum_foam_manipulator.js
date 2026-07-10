import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // =========================================================================================
    // ADVANCED GLOWING & NEON MATERIALS FOR QUANTUM FOAM MANIPULATOR
    // =========================================================================================
    const customEmissiveBlue = new THREE.MeshStandardMaterial({ color: 0x0044ff, emissive: 0x0022ff, emissiveIntensity: 3, transparent: true, opacity: 0.9, wireframe: false });
    const customEmissiveRed = new THREE.MeshStandardMaterial({ color: 0xff1100, emissive: 0xff0000, emissiveIntensity: 2.5 });
    const customEmissivePurple = new THREE.MeshStandardMaterial({ color: 0x8800ff, emissive: 0xaa00ff, emissiveIntensity: 4 });
    const customEmissiveGreen = new THREE.MeshStandardMaterial({ color: 0x00ff44, emissive: 0x00ff11, emissiveIntensity: 3 });
    const customEmissiveCyan = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00aaff, emissiveIntensity: 3 });
    const beamMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 5, transparent: true, opacity: 0.6 });
    const foamMaterial = new THREE.MeshPhysicalMaterial({ 
        color: 0x111111, emissive: 0x220033, emissiveIntensity: 0.5, 
        clearcoat: 1, clearcoatRoughness: 0.1, transmission: 0.9, 
        opacity: 1, transparent: true, ior: 1.5 
    });
    const plasmaMaterial = new THREE.MeshPhysicalMaterial({ 
        color: 0x221155, transmission: 0.95, opacity: 1, 
        transparent: true, roughness: 0.05, ior: 1.1, emissive: 0x110033, emissiveIntensity: 0.8
    });

    const animatedMeshes = {
        foamNodes: [],
        foamEdges: [],
        rotors: [],
        pistons: [],
        beams: [],
        topologicalShifters: [],
        plasmaRings: [],
        gears: [],
        particles: [],
        consoleLights: [],
        coolingFans: []
    };

    // =========================================================================================
    // 1. MASSIVE BASE PLATFORM & SUB-STRUCTURE
    // =========================================================================================
    const baseGroup = new THREE.Group();
    
    // Main pedestal lathe geometry
    const basePoints = [];
    for(let i = 0; i <= 40; i++) {
        basePoints.push(new THREE.Vector2( Math.sin(i*0.25)*4 + 50 - (i*0.6), i*1.5 ));
    }
    const baseGeom = new THREE.LatheGeometry(basePoints, 128);
    const baseMesh = new THREE.Mesh(baseGeom, darkSteel);
    baseGroup.add(baseMesh);

    // High-tech detail rings on base pedestal
    for(let i=0; i<15; i++) {
        const ringGeom = new THREE.TorusGeometry(48 - i*1.8, 0.6, 32, 128);
        const ringMesh = new THREE.Mesh(ringGeom, chrome);
        ringMesh.position.y = i * 2.8;
        ringMesh.rotation.x = Math.PI / 2;
        baseGroup.add(ringMesh);
    }

    // Hexagonal structural floor plates surrounding the base
    const hexRadius = 2.5;
    const hexShape = new THREE.Shape();
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        hexShape.lineTo(Math.cos(angle) * hexRadius, Math.sin(angle) * hexRadius);
    }
    const hexExtrudeSettings = { depth: 0.8, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.15, bevelThickness: 0.15 };
    const hexGeom = new THREE.ExtrudeGeometry(hexShape, hexExtrudeSettings);
    const floorGroup = new THREE.Group();
    for (let x = -60; x <= 60; x += hexRadius * 1.8) {
        for (let z = -60; z <= 60; z += hexRadius * 1.5) {
            const dist = Math.sqrt(x*x + z*z);
            if (dist < 55 && dist > 25) {
                const hexMesh = new THREE.Mesh(hexGeom, (Math.random() > 0.8) ? darkSteel : steel);
                hexMesh.rotation.x = Math.PI / 2;
                hexMesh.position.set(x, 40, z);
                floorGroup.add(hexMesh);
                
                // Add tiny glowing nodes to some hexes
                if (Math.random() > 0.9) {
                    const glowNode = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.2, 16), customEmissiveCyan);
                    glowNode.position.set(x, 40.2, z);
                    floorGroup.add(glowNode);
                    animatedMeshes.consoleLights.push({ mesh: glowNode, phase: Math.random()*Math.PI*2, speed: 2 + Math.random()*3 });
                }
            }
        }
    }
    baseGroup.add(floorGroup);
    group.add(baseGroup);

    // =========================================================================================
    // 2. MASSIVE MOBILITY TIRES / TRACKS (Aggressive off-road)
    // =========================================================================================
    const tireGroup = new THREE.Group();
    for (let t = 0; t < 12; t++) {
        const angle = (t / 12) * Math.PI * 2;
        const wheel = new THREE.Group();
        
        // The spinning assembly of the tire
        const spinGroup = new THREE.Group();

        // Main tire torus
        const tireGeom = new THREE.TorusGeometry(10, 3.5, 48, 120);
        const tireMesh = new THREE.Mesh(tireGeom, rubber);
        spinGroup.add(tireMesh);

        // Aggressive Treads (Hundreds of extruded BoxGeometry lugs)
        const lugGeom = new THREE.BoxGeometry(4.5, 2, 2);
        const numLugs = 90;
        for(let l = 0; l < numLugs; l++) {
            const lugAngle = (l / numLugs) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeom, rubber);
            lug.position.set(Math.cos(lugAngle)*12.5, Math.sin(lugAngle)*12.5, 0);
            lug.rotation.z = lugAngle;
            spinGroup.add(lug);
        }

        // Complex Cylinder Rim
        const rimGeom = new THREE.CylinderGeometry(7, 7, 2.5, 64);
        const rimMesh = new THREE.Mesh(rimGeom, chrome);
        rimMesh.rotation.x = Math.PI / 2;
        spinGroup.add(rimMesh);

        // Intricate Spoke Array
        const spokeGeom = new THREE.CylinderGeometry(0.3, 0.6, 13.5);
        for(let s = 0; s < 24; s++) {
            const spokeAngle = (s / 24) * Math.PI * 2;
            const spoke = new THREE.Mesh(spokeGeom, steel);
            spoke.rotation.z = spokeAngle;
            spoke.position.set(Math.cos(spokeAngle)*3.5, Math.sin(spokeAngle)*3.5, 0);
            spinGroup.add(spoke);
        }
        
        // Add glowing brake calipers/rotors inner glow
        const rotorGeom = new THREE.TorusGeometry(5, 0.3, 16, 64);
        const rotorGlow = new THREE.Mesh(rotorGeom, customEmissiveRed);
        spinGroup.add(rotorGlow);

        wheel.add(spinGroup);
        animatedMeshes.gears.push(spinGroup); // Will rotate around its local Z axis

        // Inner non-spinning hubcap / Suspension mount
        const hubGeom = new THREE.CylinderGeometry(2, 2, 4.5, 32);
        const hubMesh = new THREE.Mesh(hubGeom, darkSteel);
        hubMesh.rotation.x = Math.PI / 2;
        wheel.add(hubMesh);

        // Suspension arm connecting to base
        const suspGeom = new THREE.BoxGeometry(3, 3, 15);
        const suspMesh = new THREE.Mesh(suspGeom, darkSteel);
        suspMesh.position.set(0, 5, -8);
        suspMesh.rotation.x = Math.PI/6;
        wheel.add(suspMesh);
        
        wheel.position.set(Math.cos(angle)*65, 13, Math.sin(angle)*65);
        wheel.rotation.y = -angle + Math.PI/2;
        
        tireGroup.add(wheel);
    }
    group.add(tireGroup);

    // =========================================================================================
    // 3. THE QUANTUM FOAM CORE (The Macroscopic Spacetime Fabric)
    // =========================================================================================
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, 110, 0);
    
    // Core containment shell (Plasma / Glass)
    const shellGeom = new THREE.IcosahedronGeometry(28, 4);
    const shellMesh = new THREE.Mesh(shellGeom, plasmaMaterial);
    coreGroup.add(shellMesh);
    animatedMeshes.plasmaRings.push(shellMesh);
    
    // Inner secondary shell for parallax refraction
    const innerShellGeom = new THREE.IcosahedronGeometry(24, 3);
    const innerShellMesh = new THREE.Mesh(innerShellGeom, new THREE.MeshStandardMaterial({ color: 0xaa00ff, wireframe: true, transparent: true, opacity: 0.15 }));
    coreGroup.add(innerShellMesh);
    animatedMeshes.plasmaRings.push(innerShellMesh);

    // The bubbling quantum foam nodes
    const nodeGeom = new THREE.IcosahedronGeometry(1.5, 2);
    for(let i=0; i<600; i++) {
        // Random spherical distribution
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const r = Math.cbrt(Math.random()) * 23; 
        
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);
        
        // Assign random emissive high-energy materials
        const nodeMat = (i%4===0) ? customEmissivePurple : (i%4===1) ? customEmissiveBlue : (i%4===2) ? customEmissiveCyan : foamMaterial;
        const node = new THREE.Mesh(nodeGeom, nodeMat);
        node.position.set(x, y, z);
        
        // Store precise orbital mechanics for the vertex animation loop
        node.userData = {
            ox: x, oy: y, oz: z,
            phase: Math.random() * Math.PI * 2,
            speed: 0.8 + Math.random() * 2.0,
            amp: 1.5 + Math.random() * 3,
            matOrig: nodeMat
        };
        
        coreGroup.add(node);
        animatedMeshes.foamNodes.push(node);
    }

    // Connect nodes with topological tensor tubes (Spacetime tearing/restitching)
    const tubeMat = new THREE.MeshStandardMaterial({ color: 0x5500aa, emissive: 0x440099, emissiveIntensity: 2.5, wireframe: true, transparent: true, opacity: 0.6 });
    for(let i=0; i<250; i++) {
        const n1 = animatedMeshes.foamNodes[Math.floor(Math.random()*animatedMeshes.foamNodes.length)];
        const n2 = animatedMeshes.foamNodes[Math.floor(Math.random()*animatedMeshes.foamNodes.length)];
        if(n1.position.distanceTo(n2.position) < 12 && n1 !== n2) {
            const curve = new THREE.CatmullRomCurve3([
                n1.position,
                new THREE.Vector3().lerpVectors(n1.position, n2.position, 0.5).add(new THREE.Vector3(Math.random()*3, Math.random()*3, Math.random()*3)),
                n2.position
            ]);
            const tubeGeom = new THREE.TubeGeometry(curve, 12, 0.25, 6, false);
            const tube = new THREE.Mesh(tubeGeom, tubeMat);
            tube.userData = { n1, n2 };
            coreGroup.add(tube);
            animatedMeshes.foamEdges.push({ mesh: tube, n1, n2 });
        }
    }
    group.add(coreGroup);

    // =========================================================================================
    // 4. ENERGY INJECTORS & SMOOTHING EMITTERS (Precision Lattice Beams)
    // =========================================================================================
    const emittersGroup = new THREE.Group();
    for(let i=0; i<16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        const emitter = new THREE.Group();
        
        // Heavy Armored Emitter Base
        const emBaseGeom = new THREE.BoxGeometry(7, 5, 14);
        const emBase = new THREE.Mesh(emBaseGeom, darkSteel);
        emBase.position.set(0, 0, 0);
        emitter.add(emBase);

        // Vents on Emitter Base
        for(let v=0; v<4; v++) {
            const ventGeom = new THREE.BoxGeometry(8, 0.5, 0.5);
            const vent = new THREE.Mesh(ventGeom, chrome);
            vent.position.set(0, 1 + v*0.8, 5);
            emitter.add(vent);
        }
        
        // Articulated Boom Arm Assembly
        const boomGeom = new THREE.CylinderGeometry(2, 2.5, 25, 32);
        const boom = new THREE.Mesh(boomGeom, aluminum);
        boom.rotation.x = Math.PI / 2;
        boom.position.set(0, 0, -12);
        emitter.add(boom);
        
        // Complex Hydraulic Pistons controlling the boom
        // Main bottom piston
        const pistonOutGeom = new THREE.CylinderGeometry(1.2, 1.2, 10);
        const pistonOut = new THREE.Mesh(pistonOutGeom, darkSteel);
        pistonOut.rotation.x = Math.PI/2;
        pistonOut.position.set(0, -3.5, -6);
        
        const pistonInGeom = new THREE.CylinderGeometry(0.6, 0.6, 14);
        const pistonIn = new THREE.Mesh(pistonInGeom, chrome);
        pistonIn.rotation.x = Math.PI/2;
        pistonIn.position.set(0, -3.5, -12);
        emitter.add(pistonOut, pistonIn);
        animatedMeshes.pistons.push({ out: pistonOut, in: pistonIn, baseZ: -12, travel: 5, phase: angle });

        // Side micro-hydraulics
        for(let s=-1; s<=1; s+=2) {
            const mPistonOut = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 6), darkSteel);
            mPistonOut.rotation.x = Math.PI/2;
            mPistonOut.position.set(s*3, 0, -5);
            const mPistonIn = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 8), chrome);
            mPistonIn.rotation.x = Math.PI/2;
            mPistonIn.position.set(s*3, 0, -9);
            emitter.add(mPistonOut, mPistonIn);
            animatedMeshes.pistons.push({ out: mPistonOut, in: mPistonIn, baseZ: -9, travel: 3, phase: angle + Math.PI });
        }
        
        // Magnetic Focus Lens Assembly
        const lensGeom = new THREE.TorusGeometry(3.5, 1, 32, 64);
        const lensMat = i%2===0 ? customEmissiveGreen : customEmissiveRed;
        const lens = new THREE.Mesh(lensGeom, lensMat);
        lens.position.set(0, 0, -26);
        emitter.add(lens);
        
        const lensCoreGeom = new THREE.SphereGeometry(2, 32, 32);
        const lensCore = new THREE.Mesh(lensCoreGeom, glass);
        lensCore.position.set(0, 0, -26);
        emitter.add(lensCore);
        
        // Pulsing Energy Beams hitting the Quantum Core
        const beamGeom = new THREE.CylinderGeometry(0.6, 0.6, 26, 32);
        const beam = new THREE.Mesh(beamGeom, beamMaterial);
        beam.rotation.x = Math.PI / 2;
        beam.position.set(0, 0, -39); // stretches to center core
        emitter.add(beam);
        animatedMeshes.beams.push({ mesh: beam, phase: angle, type: 'laser' });
        
        // Topological shifters (Spinning rings shaping the beam)
        for(let r=0; r<4; r++) {
            const shiftGeom = new THREE.TorusGeometry(3, 0.4, 16, 64);
            const shifter = new THREE.Mesh(shiftGeom, customEmissivePurple);
            shifter.position.set(0, 0, -10 - r*4);
            emitter.add(shifter);
            animatedMeshes.topologicalShifters.push({ mesh: shifter, speed: (r+1)*0.08 * (r%2===0?1:-1), axis: 'z' });
        }
        
        // Ring position
        emitter.position.set(Math.cos(angle)*70, 110, Math.sin(angle)*70);
        emitter.lookAt(new THREE.Vector3(0, 110, 0)); // Aim precisely at center core
        
        emittersGroup.add(emitter);
    }
    group.add(emittersGroup);

    // =========================================================================================
    // 5. MASSIVE CONTAINMENT RINGS & GYROSCOPIC STABILIZERS
    // =========================================================================================
    const ringSystem = new THREE.Group();
    ringSystem.position.set(0, 110, 0);
    for(let r=0; r<5; r++) {
        const ringRad = 45 + r*8;
        const ringThickness = 2.5 - r*0.3;
        const ringGeom = new THREE.TorusGeometry(ringRad, ringThickness, 64, 256);
        const ringMat = r%3===0 ? darkSteel : r%3===1 ? aluminum : steel;
        const ring = new THREE.Mesh(ringGeom, ringMat);
        
        // Intricate machinery nodes mounted on rings
        for(let n=0; n<32; n++) {
            const nAngle = (n/32)*Math.PI*2;
            const nodeGroup = new THREE.Group();
            
            const nodeBox = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5), darkSteel);
            nodeGroup.add(nodeBox);

            const glowCore = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 5.2, 16), customEmissiveBlue);
            glowCore.rotation.z = Math.PI/2;
            nodeGroup.add(glowCore);

            nodeGroup.position.set(Math.cos(nAngle)*ringRad, Math.sin(nAngle)*ringRad, 0);
            nodeGroup.rotation.z = nAngle;
            ring.add(nodeGroup);
        }
        
        ring.rotation.x = Math.PI/2 + (r*0.25);
        ring.rotation.y = (r*0.15);
        ringSystem.add(ring);
        animatedMeshes.rotors.push({ mesh: ring, speed: (r%2===0?1:-1) * (0.003 + r*0.0015), axis: 'y' });
        animatedMeshes.rotors.push({ mesh: ring, speed: (r%2!==0?1:-1) * (0.002 + r*0.001), axis: 'x' });
    }
    group.add(ringSystem);

    // =========================================================================================
    // 6. WALKWAYS, CATWALKS, RAILINGS & STAIRS
    // =========================================================================================
    const walkwayGroup = new THREE.Group();
    for(let w=0; w<8; w++) {
        const angle = (w/8)*Math.PI*2;
        
        // Main elevated catwalk spanning outward
        const catGeom = new THREE.BoxGeometry(12, 0.6, 55);
        const catwalk = new THREE.Mesh(catGeom, steel);
        catwalk.position.set(Math.cos(angle)*40, 45, Math.sin(angle)*40);
        catwalk.rotation.y = -angle;
        walkwayGroup.add(catwalk);
        
        // Grating texture simulation via wireframe overlay
        const grateGeom = new THREE.PlaneGeometry(11.8, 54.8, 20, 100);
        const grateMesh = new THREE.Mesh(grateGeom, new THREE.MeshBasicMaterial({color:0x222222, wireframe:true}));
        grateMesh.rotation.x = -Math.PI/2;
        grateMesh.position.set(Math.cos(angle)*40, 45.31, Math.sin(angle)*40);
        grateMesh.rotation.y = -angle;
        walkwayGroup.add(grateMesh);

        // Intricate safety railings and stanchions
        for(let s=-1; s<=1; s+=2) {
            const railGeom = new THREE.CylinderGeometry(0.15, 0.15, 55);
            const railTop = new THREE.Mesh(railGeom, aluminum);
            const railMid = new THREE.Mesh(railGeom, aluminum);
            
            railTop.rotation.x = Math.PI/2;
            railMid.rotation.x = Math.PI/2;
            
            railTop.position.set(Math.cos(angle)*40 + Math.cos(-angle)*s*5.8, 48, Math.sin(angle)*40 - Math.sin(-angle)*s*5.8);
            railMid.position.set(Math.cos(angle)*40 + Math.cos(-angle)*s*5.8, 46.5, Math.sin(angle)*40 - Math.sin(-angle)*s*5.8);
            
            railTop.rotation.y = -angle;
            railMid.rotation.y = -angle;
            walkwayGroup.add(railTop, railMid);
            
            // Vertical Stanchions
            for(let st=-26; st<=26; st+=3.5) {
                const stGeom = new THREE.CylinderGeometry(0.12, 0.12, 3);
                const stanchion = new THREE.Mesh(stGeom, steel);
                
                const localX = s * 5.8;
                const localZ = st;
                const worldX = Math.cos(-angle)*localX + Math.sin(-angle)*localZ;
                const worldZ = -Math.sin(-angle)*localX + Math.cos(-angle)*localZ;
                
                stanchion.position.set(Math.cos(angle)*40 + worldX, 46.5, Math.sin(angle)*40 + worldZ);
                walkwayGroup.add(stanchion);
            }
        }

        // Support pillars connecting catwalk to ground
        const pillarGeom = new THREE.CylinderGeometry(1, 1.5, 45, 16);
        const pillar = new THREE.Mesh(pillarGeom, darkSteel);
        pillar.position.set(Math.cos(angle)*60, 22.5, Math.sin(angle)*60);
        walkwayGroup.add(pillar);
    }
    group.add(walkwayGroup);

    // =========================================================================================
    // 7. OPERATOR CABINS & MULTI-SCREEN CONTROL CONSOLES
    // =========================================================================================
    for(let c=0; c<4; c++) {
        const cAngle = (c/4)*Math.PI*2 + (Math.PI/4); // Offset from walkways
        
        const cabinGroup = new THREE.Group();
        
        // Massive octagonal cabin shell
        const cabinGeom = new THREE.CylinderGeometry(12, 10, 14, 8);
        const cabinMesh = new THREE.Mesh(cabinGeom, aluminum);
        cabinGroup.add(cabinMesh);
        
        // Wrap-around tinted observation glass
        const windowGeom = new THREE.CylinderGeometry(12.2, 10.2, 6, 8, 1, true, 0, Math.PI);
        const windowMesh = new THREE.Mesh(windowGeom, tinted);
        windowMesh.position.y = 2;
        cabinGroup.add(windowMesh);

        // Control Desk Console
        const deskGeom = new THREE.BoxGeometry(16, 2, 6);
        const desk = new THREE.Mesh(deskGeom, darkSteel);
        desk.position.set(0, -1, 5);
        cabinGroup.add(desk);

        // Bank of extremely detailed glowing screens
        for(let s=0; s<8; s++) {
            const screenGeom = new THREE.PlaneGeometry(3.5, 2.5);
            const screenMat = [customEmissiveBlue, customEmissiveGreen, customEmissiveRed, customEmissiveCyan, customEmissivePurple][s%5];
            const screen = new THREE.Mesh(screenGeom, screenMat);
            
            const px = -10.5 + (s%4)*7;
            const py = s < 4 ? 2 : 5; // Two rows of screens
            const pz = 6.5;
            
            screen.position.set(px, py, pz);
            screen.rotation.x = -Math.PI / 6;
            if(px < -5) screen.rotation.y = Math.PI / 8;
            if(px > 5) screen.rotation.y = -Math.PI / 8;
            
            cabinGroup.add(screen);
        }

        // Thousands of tiny blinking LEDs on console
        for(let led=0; led<150; led++) {
            const ledGeom = new THREE.BoxGeometry(0.15, 0.1, 0.15);
            const ledMat = Math.random()>0.5 ? customEmissiveRed : customEmissiveCyan;
            const ledMesh = new THREE.Mesh(ledGeom, ledMat);
            ledMesh.position.set(-7 + Math.random()*14, 0.1, 3 + Math.random()*4);
            cabinGroup.add(ledMesh);
            animatedMeshes.consoleLights.push({ mesh: ledMesh, phase: Math.random()*10, speed: 5 + Math.random()*10 });
        }

        // High-tech operator chairs
        for(let seat=0; seat<3; seat++) {
            const seatGroup = new THREE.Group();
            const base = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 2), chrome);
            base.position.y = -3;
            const bottom = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.8, 2.5), rubber);
            bottom.position.y = -2;
            const back = new THREE.Mesh(new THREE.BoxGeometry(2.5, 4, 0.6), rubber);
            back.position.set(0, 0, -1);
            const head = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1, 0.6), rubber);
            head.position.set(0, 2.5, -1);
            
            seatGroup.add(base, bottom, back, head);
            seatGroup.position.set(-6 + seat*6, -1, 1);
            cabinGroup.add(seatGroup);
        }

        cabinGroup.position.set(Math.cos(cAngle)*90, 52, Math.sin(cAngle)*90);
        cabinGroup.lookAt(new THREE.Vector3(0, 52, 0));
        group.add(cabinGroup);
    }

    // =========================================================================================
    // 8. EXHAUST STACKS & PARTICLE EMITTERS
    // =========================================================================================
    const exhaustGroup = new THREE.Group();
    for(let e=0; e<10; e++) {
        const eAngle = (e/10)*Math.PI*2;
        const stackGroup = new THREE.Group();
        
        // Massive chimney structure
        const stackGeom = new THREE.CylinderGeometry(4, 5.5, 45, 32);
        const stack = new THREE.Mesh(stackGeom, darkSteel);
        stackGroup.add(stack);
        
        // Heat dissipating fins
        for(let f=0; f<12; f++) {
            const finGeom = new THREE.TorusGeometry(4.8, 0.8, 16, 64);
            const fin = new THREE.Mesh(finGeom, steel);
            fin.position.y = -15 + f*3;
            fin.rotation.x = Math.PI/2;
            stackGroup.add(fin);
        }

        // Plasma vents inside stacks
        const ventGeom = new THREE.CylinderGeometry(3.5, 3.5, 1, 32);
        const vent = new THREE.Mesh(ventGeom, customEmissivePurple);
        vent.position.y = 22.5;
        stackGroup.add(vent);

        // Animated ascending particles simulating exhaust/Hawking radiation venting
        for(let p=0; p<20; p++) {
            const partGeom = new THREE.SphereGeometry(0.8, 16, 16);
            const particle = new THREE.Mesh(partGeom, customEmissivePurple);
            
            // Random offset within the stack radius
            const ox = (Math.random()-0.5)*5;
            const oz = (Math.random()-0.5)*5;
            particle.position.set(ox, 23 + Math.random()*30, oz);
            
            stackGroup.add(particle);
            animatedMeshes.particles.push({ 
                mesh: particle, 
                baseY: 23, 
                speed: 1 + Math.random()*2,
                wobbleSpeed: Math.random()*5,
                ox: ox, oz: oz
            });
        }
        
        stackGroup.position.set(Math.cos(eAngle)*95, 62.5, Math.sin(eAngle)*95);
        exhaustGroup.add(stackGroup);
    }
    group.add(exhaustGroup);

    // =========================================================================================
    // 9. SPACETIME TENSION CABLES, HYDRAULIC LINES & COOLING PIPES
    // =========================================================================================
    const cableGroup = new THREE.Group();
    // Route 48 massive complex pipes
    for(let c=0; c<48; c++) {
        const angle1 = (c/48)*Math.PI*2;
        const angle2 = ((c+8)%48)/48 * Math.PI*2;
        
        const start = new THREE.Vector3(Math.cos(angle1)*65, 45, Math.sin(angle1)*65);
        const end = new THREE.Vector3(Math.cos(angle2)*35, 120, Math.sin(angle2)*35);
        
        // Create organic sagging curves using CatmullRom
        const mid = new THREE.Vector3(
            Math.cos(angle1)*55, 
            80 + Math.sin(c)*20, // Variation in slack
            Math.sin(angle1)*55
        );
        
        const curve = new THREE.CatmullRomCurve3([start, mid, end]);
        const thickness = 0.6 + Math.random()*1.2;
        const cableGeom = new THREE.TubeGeometry(curve, 48, thickness, 12, false);
        
        let cableMat = rubber;
        if(c%4 === 0) cableMat = copper;
        if(c%4 === 1) cableMat = customEmissiveCyan;
        if(c%4 === 2) cableMat = chrome;
        
        const cable = new THREE.Mesh(cableGeom, cableMat);
        cableGroup.add(cable);
    }
    group.add(cableGroup);

    // =========================================================================================
    // 10. MAGNETIC CONFINEMENT COILS & POWER CORE
    // =========================================================================================
    const powerGroup = new THREE.Group();
    // Central pillar connecting base to core
    const corePillarGeom = new THREE.CylinderGeometry(15, 20, 60, 64);
    const corePillar = new THREE.Mesh(corePillarGeom, darkSteel);
    corePillar.position.set(0, 70, 0);
    powerGroup.add(corePillar);

    // Huge spiral magnetic coil wrapped around the pillar
    const coilGeom = new THREE.TorusGeometry(18, 2, 32, 100);
    for(let coil=0; coil<15; coil++) {
        const coilMesh = new THREE.Mesh(coilGeom, copper);
        coilMesh.position.set(0, 45 + coil*4, 0);
        coilMesh.rotation.x = Math.PI/2;
        
        // Add micro-transformers to the coil
        for(let mt=0; mt<6; mt++) {
            const mtAngle = (mt/6)*Math.PI*2 + (coil*0.2);
            const mtBox = new THREE.Mesh(new THREE.BoxGeometry(4, 6, 4), steel);
            mtBox.position.set(Math.cos(mtAngle)*18, 0, Math.sin(mtAngle)*18);
            coilMesh.add(mtBox);
        }
        powerGroup.add(coilMesh);
    }
    group.add(powerGroup);

    // =========================================================================================
    // 11. DEFINING 15+ EXTREMELY DETAILED PARTS
    // =========================================================================================
    parts.push(
        {
            name: "Planck-Scale Resonance Core",
            description: "The macroscopic projection of the quantum foam. It bubbles chaotically as spacetime tears, restitches, and violently fluctuates. Contains highly compressed vacuum energy driven by non-perturbative topological shifting.",
            material: "customEmissivePurple",
            function: "Simulates, amplifies, and physically manipulates the fundamental structure of space itself.",
            assemblyOrder: 1,
            connections: ["Smoothing Emitters", "Roughening Emitters", "Magnetic Confinement Coils", "Spacetime Tension Cables"],
            failureEffect: "Spontaneous micro-black hole formation leading to runaway accretion.",
            cascadeFailures: ["Temporal closed timelike curves", "False vacuum decay", "Complete annihilation of local baryonic matter"],
            originalPosition: {x: 0, y: 110, z: 0},
            explodedPosition: {x: 0, y: 250, z: 0}
        },
        {
            name: "Smoothing Emitters",
            description: "High-energy lattice beams injecting negative-entropy fields directly into the quantum foam, forcing chaotic probability amplitudes into rigid, localized eigenstates.",
            material: "customEmissiveGreen",
            function: "Decreases the topological entropy and artificially lowers the Planck constant locally.",
            assemblyOrder: 2,
            connections: ["Resonance Core", "Power Core", "Hydraulic Actuators"],
            failureEffect: "Spacetime becomes infinitely rigid, freezing all kinetic and thermal energy.",
            cascadeFailures: ["Absolute zero zone creation", "Shattering of the spatial manifold", "Photonic stall"],
            originalPosition: {x: 70, y: 110, z: 0},
            explodedPosition: {x: 180, y: 110, z: 0}
        },
        {
            name: "Topological Shifter Rings",
            description: "Rapidly spinning, hyper-dense torus arrays that twist the geometry of the emitter beams through higher spatial dimensions, allowing the beam to bypass standard 3D collision mechanics.",
            material: "customEmissivePurple",
            function: "Alters the winding number and Euler characteristic of the target space.",
            assemblyOrder: 3,
            connections: ["Smoothing Emitters", "Roughening Emitters"],
            failureEffect: "Spatial inversion; inside-out conversion of nearby machinery.",
            cascadeFailures: ["Operator spatial inversion", "Geometric paradox cascade", "Tesseract unraveling"],
            originalPosition: {x: 60, y: 110, z: 0},
            explodedPosition: {x: 150, y: 150, z: 50}
        },
        {
            name: "Magnetic Confinement Coils",
            description: "Massive copper super-coils carrying tera-amperes of current to establish a magnetic bottle strong enough to contain localized gravity well distortions.",
            material: "copper",
            function: "Prevents the manipulated gravity fields from ripping the facility from its foundation.",
            assemblyOrder: 4,
            connections: ["Power Core", "Base Pedestal"],
            failureEffect: "Magnetic field collapse resulting in an uncontrolled gravity sheer.",
            cascadeFailures: ["Facility uplift", "Tidal forces shredding structural hex plates", "Tire track implosion"],
            originalPosition: {x: 0, y: 70, z: 0},
            explodedPosition: {x: 0, y: -50, z: 0}
        },
        {
            name: "Hawking Radiation Shields",
            description: "Supercooled dark-steel baffles integrated into the exhaust stacks, designed to capture and redirect the intense bursts of Hawking radiation emitted by transient micro-black holes.",
            material: "darkSteel",
            function: "Prevents immediate vaporization of the surrounding facility and operators from gamma-ray bursts.",
            assemblyOrder: 5,
            connections: ["Exhaust Stacks", "Plasma Vents", "Cooling Pipes"],
            failureEffect: "Catastrophic thermal runaway and lethal gamma-ray exposure.",
            cascadeFailures: ["Operator incineration", "Structural melting", "Plasma vent overload"],
            originalPosition: {x: 95, y: 62.5, z: 0},
            explodedPosition: {x: 180, y: 100, z: 180}
        },
        {
            name: "Aggressive Mobility Treads",
            description: "Massive, multi-ton rubber and chrome wheel arrays with hundreds of extruded lugs, designed to traverse seismically unstable terrain altered by localized gravity shifts.",
            material: "rubber",
            function: "Provides locomotion and vibration dampening for the manipulator.",
            assemblyOrder: 6,
            connections: ["Base Pedestal", "Suspension Arms", "Hydraulic Actuators"],
            failureEffect: "Loss of mobility and immense vibrational resonance feedback.",
            cascadeFailures: ["Axle snapping", "Base structure fracturing", "Operator cabin detachment"],
            originalPosition: {x: 65, y: 13, z: 0},
            explodedPosition: {x: 120, y: 0, z: -120}
        },
        {
            name: "Spacetime Tension Cables",
            description: "Thick, multi-layered conduits carrying highly pressurized exotic matter and liquid helium to synchronize the various emitters across vast distances.",
            material: "customEmissiveCyan",
            function: "Balances the structural and energy load across the entire chassis during dimensional shifts.",
            assemblyOrder: 7,
            connections: ["Emitters", "Power Core", "Exhaust Stacks"],
            failureEffect: "Exotic matter leak inducing localized negative gravity.",
            cascadeFailures: ["Machinery violently repelled into orbit", "Cable whipping at hypersonic speeds"],
            originalPosition: {x: 45, y: 80, z: 45},
            explodedPosition: {x: 80, y: 120, z: 80}
        },
        {
            name: "Operator Control Cabins",
            description: "Heavily shielded, octagonal command centers featuring tinted macro-glass, multi-screen diagnostic consoles, and thousands of manual telemetry overrides.",
            material: "aluminum",
            function: "Houses human operators conducting delicate adjustments to the foam lattice.",
            assemblyOrder: 8,
            connections: ["Walkways", "Base Pedestal", "Telemetry Network"],
            failureEffect: "Loss of manual override capabilities and life support.",
            cascadeFailures: ["Operator asphyxiation", "Blind automated firing of lattice beams", "Uncontrolled chain reactions"],
            originalPosition: {x: 90, y: 52, z: 90},
            explodedPosition: {x: 180, y: 80, z: 180}
        },
        {
            name: "Plasma Containment Shell",
            description: "A shimmering, iridescent barrier of hyper-compressed plasma and exotic electromagnetic shielding enclosing the resonance core.",
            material: "plasmaMaterial",
            function: "Acts as the primary barrier preventing the raw quantum foam from expanding into the macro-universe.",
            assemblyOrder: 9,
            connections: ["Resonance Core", "Containment Rings"],
            failureEffect: "Explosive decompression of exotic energy.",
            cascadeFailures: ["Immediate incineration of containment rings", "Shockwave leveling the facility"],
            originalPosition: {x: 0, y: 110, z: 0},
            explodedPosition: {x: 0, y: 110, z: 200}
        },
        {
            name: "Hydraulic Piston Actuators",
            description: "Gigantic, chrome-plated telescoping pistons that articulate the heavy emitter boom arms with micrometer precision.",
            material: "chrome",
            function: "Aims and stabilizes the energy injectors.",
            assemblyOrder: 10,
            connections: ["Emitters", "Emitter Base"],
            failureEffect: "Jammed pistons leading to misaligned energy beams.",
            cascadeFailures: ["Beam slicing through operator cabins", "Asymmetric core pressure", "Core implosion"],
            originalPosition: {x: 70, y: 100, z: 0},
            explodedPosition: {x: 120, y: 130, z: 40}
        },
        {
            name: "Gyroscopic Stabilizer Rings",
            description: "Massive, counter-rotating metallic rings encircling the core, compensating for angular momentum anomalies generated by the foam.",
            material: "steel",
            function: "Maintains the geometric orientation of the entire facility against non-Euclidean twisting forces.",
            assemblyOrder: 11,
            connections: ["Base Pedestal", "Plasma Containment Shell"],
            failureEffect: "Severe gyroscopic precession of the core.",
            cascadeFailures: ["Facility capsizing", "Centrifugal disintegration of catwalks"],
            originalPosition: {x: 0, y: 110, z: 0},
            explodedPosition: {x: 0, y: 110, z: -200}
        },
        {
            name: "Hexagonal Ground Plates",
            description: "Interlocking, shock-absorbing tungsten-steel floor grates that ground rogue electrical discharges and dimensional static.",
            material: "darkSteel",
            function: "Provides a safe walking surface while acting as a massive Faraday cage.",
            assemblyOrder: 12,
            connections: ["Base Pedestal", "Walkways"],
            failureEffect: "Lethal dimensional static buildup.",
            cascadeFailures: ["Spontaneous arc flashes", "Personnel electrocution", "Sensor burnouts"],
            originalPosition: {x: 0, y: 40, z: 0},
            explodedPosition: {x: 0, y: -20, z: 0}
        },
        {
            name: "Calabi-Yau Folding Lenses",
            description: "Intricate glass and energy constructs located at the tip of the emitters that fold the raw energy beam into six extra hidden dimensions.",
            material: "glass",
            function: "Ensures the beam interacts directly with the foundational string-theory membranes.",
            assemblyOrder: 13,
            connections: ["Emitters", "Topological Shifters"],
            failureEffect: "Beam scatters into strictly 3D space.",
            cascadeFailures: ["Unintended local melting", "Failure to manipulate the foam", "Extreme energy blowback"],
            originalPosition: {x: 60, y: 110, z: 0},
            explodedPosition: {x: 200, y: 110, z: -50}
        },
        {
            name: "Exhaust Stack Heat Sinks",
            description: "Towering chimneys lined with thermal dissipating fins to bleed off the astronomical heat generated by manipulating spacetime.",
            material: "darkSteel",
            function: "Thermal regulation and venting of radioactive plasma ash.",
            assemblyOrder: 14,
            connections: ["Base Pedestal", "Hawking Radiation Shields"],
            failureEffect: "Core meltdown.",
            cascadeFailures: ["Liquefaction of support struts", "Explosive boiling of hydraulic fluids"],
            originalPosition: {x: 95, y: 62.5, z: 0},
            explodedPosition: {x: 180, y: 200, z: 0}
        },
        {
            name: "Elevated Catwalk Network",
            description: "A labyrinth of steel grating and aluminum railings allowing personnel to traverse the massive machine structure for maintenance.",
            material: "steel",
            function: "Personnel access and structural cross-bracing.",
            assemblyOrder: 15,
            connections: ["Operator Cabins", "Containment Rings", "Base Pedestal"],
            failureEffect: "Catwalk collapse due to excessive gravitational shear.",
            cascadeFailures: ["Fatalities due to falling", "Debris jamming the mobility treads"],
            originalPosition: {x: 40, y: 45, z: 40},
            explodedPosition: {x: 100, y: 0, z: 100}
        }
    );

    // =========================================================================================
    // 12. PhD-LEVEL QUANTUM GRAVITY QUIZ
    // =========================================================================================
    const quizQuestions = [
        {
            question: "In Loop Quantum Gravity (LQG), the area operator possesses a discrete, quantized spectrum. What is the precise minimum non-zero area eigenvalue for a surface intersected transversally by a single spin network edge carrying the fundamental representation (spin j = 1/2)?",
            options: [
                "A) 8πγ(l_p)² √(j(j+1))",
                "B) 4πγ(l_p)² j",
                "C) γ(l_p)² (j(j+1))",
                "D) 8π(l_p)² (j+1/2)"
            ],
            answer: "A",
            explanation: "In Loop Quantum Gravity, the area eigenvalue is A = 8πγ(l_p)² √(j(j+1)), where γ is the Barbero-Immirzi parameter, l_p is the Planck length, and j is the spin on the intersecting edge. For j=1/2, this gives the smallest quantum of area, making spacetime fundamentally granular at the Planck scale, which is the foundational physics this machine exploits."
        },
        {
            question: "Within the context of the AdS/CFT correspondence (holographic principle), the Ryu-Takayanagi formula relates the entanglement entropy of a boundary conformal field theory subregion (A) to what specific bulk geometric quantity?",
            options: [
                "A) The volume of the maximal slice homologous to the boundary subregion A.",
                "B) The area of the minimal bulk codimension-2 surface homologous to the boundary subregion A.",
                "C) The Euler characteristic of the bulk spacetime integrated over region A.",
                "D) The integral of the Weyl tensor squared over the entire bulk."
            ],
            answer: "B",
            explanation: "The Ryu-Takayanagi formula (S = Area(γ) / 4G) powerfully links quantum entanglement on the boundary CFT to geometry in the bulk AdS space. It states that the entanglement entropy is proportional to the area of the minimal bulk surface homologous to the boundary region. The manipulator uses this principle to calculate necessary energy injections."
        },
        {
            question: "According to the black hole information paradox and the resulting 'firewall' hypothesis (AMPS paradox), which of the following postulates of black hole complementarity must logically be sacrificed to prevent a firewall of high-energy quanta at the event horizon?",
            options: [
                "A) The unitarity of quantum mechanics (information is conserved).",
                "B) The validity of semiclassical field theory strictly outside the stretched horizon.",
                "C) 'No drama' (the equivalence principle holds, and an infalling observer notices nothing unusual at the horizon).",
                "D) The discreteness of the Hawking radiation spectrum."
            ],
            answer: "C",
            explanation: "The AMPS (Almheiri, Marolf, Polchinski, Sully) paper showed that to preserve both unitarity and semiclassical field theory, a freely falling observer must burn up at a 'firewall' just inside the event horizon. To avoid a firewall, one must sacrifice the 'No drama' equivalence principle postulate. The machine's Hawking Shields are explicitly designed to capture firewall emissions."
        },
        {
            question: "In the history of String Theory, what is the profound significance of the anomaly cancellation mechanism discovered by Michael Green and John Schwarz in 1984?",
            options: [
                "A) It demonstrated that bosonic string theory is tachyon-free exactly in 26 dimensions.",
                "B) It proved that Type I string theory with gauge group SO(32) is uniquely free of both gauge and gravitational anomalies.",
                "C) It mathematically proved that M-theory compactified on a Calabi-Yau manifold directly yields the Standard Model.",
                "D) It established the exact non-perturbative dual equivalence between Type IIA and Type IIB string theories."
            ],
            answer: "B",
            explanation: "The Green-Schwarz mechanism sparked the First Superstring Revolution by proving that chiral anomalies logically cancel out in 10-dimensional superstring theory if and only if the gauge group is SO(32) or E8 x E8. This proved string theory was mathematically consistent. The manipulator's Calabi-Yau folding lenses depend entirely on this 10D anomaly-free geometry."
        },
        {
            question: "The Wheeler-DeWitt equation, traditionally written as HΨ = 0, is the central equation of canonical quantum gravity. Why does this equation notoriously suffer from the 'Problem of Time'?",
            options: [
                "A) The Hamiltonian constraint does not contain a time derivative, rendering the quantum state stationary with respect to coordinate time.",
                "B) Time requires a continuous spectrum, but the Wheeler-DeWitt equation forcefully yields discrete time steps.",
                "C) It strictly violates Lorentz invariance at the Planck scale, making time indistinguishable from spatial dimensions.",
                "D) The wave functional Ψ diverges to infinity unless a specific, non-relativistic time coordinate is chosen, breaking general covariance."
            ],
            answer: "A",
            explanation: "In general relativity, the Hamiltonian is a constraint that must vanish (H = 0). When quantized in canonical quantum gravity, this leads to the Wheeler-DeWitt equation HΨ = 0. Because there is no equivalent to the ∂/∂t term found in the standard Schrödinger equation, the 'wavefunction of the universe' appears completely frozen, leading to profound philosophical and mathematical debates about the emergent nature of time."
        }
    ];

    // =========================================================================================
    // 13. EXTREME ANIMATION LOGIC (Synchronized Chaotics)
    // =========================================================================================
    const animate = (time, speed, meshes) => {
        const t = time * 0.001 * speed;
        
        // 1. Animate quantum foam bubbling (Lissajous curves, chaotic expansion)
        animatedMeshes.foamNodes.forEach(node => {
            const data = node.userData;
            // Extremely complex mathematical positioning simulating non-Euclidean space
            node.position.x = data.ox + Math.sin(t * data.speed + data.phase) * data.amp * Math.cos(t * 0.5);
            node.position.y = data.oy + Math.cos(t * data.speed * 1.1 + data.phase) * data.amp * Math.sin(t * 0.3);
            node.position.z = data.oz + Math.sin(t * data.speed * 0.9 + data.phase) * data.amp * Math.cos(t * 0.7);
            
            // Pulse node scale simulating probabilistic density fluctuations
            const scale = 1 + Math.sin(t * data.speed * 2.5 + data.phase) * 0.8;
            node.scale.setScalar(Math.max(0.1, scale)); 
            
            // Emissive pulsing 
            if(node.material !== foamMaterial) {
                node.material.emissiveIntensity = 2 + Math.sin(t * 6 + data.phase) * 3;
            }
        });

        // 2. Tearing and restitching topological tensor tubes
        animatedMeshes.foamEdges.forEach(edge => {
            const dist = edge.n1.position.distanceTo(edge.n2.position);
            // Simulate tube connection by scaling Z based on distance
            // Since CatmullRom Curve is baked in, we fake dynamic tension via scaling & opacity jitter
            edge.mesh.scale.set(1 + Math.sin(t*10)*0.2, 1 + Math.sin(t*10)*0.2, dist / 12); 
            edge.mesh.material.opacity = 0.4 + Math.sin(t * 15 + edge.n1.position.x) * 0.4;
        });

        // 3. Rotate massive containment rings and gyros
        animatedMeshes.rotors.forEach(rotor => {
            if(rotor.axis === 'y') rotor.mesh.rotation.y += rotor.speed * speed;
            if(rotor.axis === 'x') rotor.mesh.rotation.x += rotor.speed * speed;
            if(rotor.axis === 'z') rotor.mesh.rotation.z += rotor.speed * speed;
        });

        // 4. Animate hydraulic pistons extending and retracting rhythmically
        animatedMeshes.pistons.forEach(piston => {
            const travel = Math.sin(t * 2.5 + piston.phase) * piston.travel;
            piston.in.position.z = piston.baseZ + travel; // slide inner piston
        });

        // 5. Fire high-energy lattice beams
        animatedMeshes.beams.forEach(beam => {
            const intensity = (Math.sin(t * 8 + beam.phase) + 1) / 2; // 0 to 1
            
            // Intense pulsing effect
            beam.mesh.material.emissiveIntensity = intensity * 8;
            
            // Beams physically expand and contract
            beam.mesh.scale.z = 1 + intensity * 0.8; // Reach into core
            beam.mesh.scale.x = 0.3 + intensity * 1.5; // Thicken
            beam.mesh.scale.y = 0.3 + intensity * 1.5;
        });

        // 6. Spin topological shifters chaotically 
        animatedMeshes.topologicalShifters.forEach(shifter => {
            if(shifter.axis === 'x') shifter.mesh.rotation.x += shifter.speed * speed;
            if(shifter.axis === 'y') shifter.mesh.rotation.y += shifter.speed * speed;
            if(shifter.axis === 'z') shifter.mesh.rotation.z += shifter.speed * speed;
            
            // Wobble effect
            shifter.mesh.rotation.x += Math.sin(t*10) * 0.01 * speed;
        });

        // 7. Roll the massive off-road tracks/gears
        animatedMeshes.gears.forEach(gear => {
            // Wheels rotate around their local Z axis as built
            gear.rotation.z += 0.05 * speed;
        });
        
        // 8. Pulse and rotate the protective plasma shell
        animatedMeshes.plasmaRings.forEach((shell, index) => {
            shell.scale.setScalar(1 + Math.sin(t*4 + index)*0.03);
            shell.rotation.y += (0.01 + index*0.005) * speed;
            shell.rotation.z += (0.005 + index*0.01) * speed;
        });

        // 9. Emit particles from exhaust stacks simulating Hawking radiation venting
        animatedMeshes.particles.forEach(part => {
            part.mesh.position.y += part.speed * speed;
            // Wobble
            part.mesh.position.x = part.ox + Math.sin(part.mesh.position.y * 0.5) * part.wobbleSpeed;
            part.mesh.position.z = part.oz + Math.cos(part.mesh.position.y * 0.5) * part.wobbleSpeed;
            
            // Reset to base of stack if it goes too high
            if(part.mesh.position.y > part.baseY + 40) {
                part.mesh.position.y = part.baseY;
                part.mesh.position.x = part.ox;
                part.mesh.position.z = part.oz;
            }
            
            // Fade out as it rises
            const fade = 1 - ((part.mesh.position.y - part.baseY) / 40);
            part.mesh.material.opacity = Math.max(0, fade);
            part.mesh.material.transparent = true;
        });

        // 10. Blinking console LEDs and node lights
        animatedMeshes.consoleLights.forEach(light => {
            const blink = Math.sin(t * light.speed + light.phase);
            light.mesh.material.emissiveIntensity = blink > 0.5 ? 4 : 0;
        });
    };

    return { group, parts, description: "God Tier Quantum Foam Manipulator: A colossal, planetary-scale apparatus designed to directly rewrite the Planck-scale fabric of spacetime.", quizQuestions, animate };
}
