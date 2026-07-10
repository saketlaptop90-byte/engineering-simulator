import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // =========================================================================
    // 1. CUSTOM GOD-TIER MATERIALS
    // =========================================================================
    const matCoreEnergy = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: 0x00ffff,
        emissiveIntensity: 10,
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 1.0,
        clearcoat: 1.0,
        side: THREE.DoubleSide
    });

    const matTrueVacuumInner = new THREE.MeshBasicMaterial({ 
        color: 0x000000, 
        side: THREE.DoubleSide 
    });

    const matTrueVacuumOuter = new THREE.MeshPhysicalMaterial({
        color: 0x8800ff,
        emissive: 0xaa00ff,
        emissiveIntensity: 15,
        transparent: true,
        opacity: 0.7,
        roughness: 0.0,
        metalness: 1.0,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
    });

    const matScreenGlowing = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 2,
        roughness: 0.4
    });

    const matPlasmaLine = new THREE.MeshStandardMaterial({
        color: 0xff0055,
        emissive: 0xff0055,
        emissiveIntensity: 5,
        wireframe: true
    });

    const matQuantumLattice = new THREE.MeshStandardMaterial({
        color: 0x222222,
        emissive: 0x110033,
        emissiveIntensity: 0.5,
        wireframe: true,
        transparent: true,
        opacity: 0.4
    });

    // =========================================================================
    // 2. STATE & ANIMATION CONTEXT
    // =========================================================================
    const state = {
        time: 0,
        phase: 0, // 0: Idle/Charge, 1: Tunneling, 2: Decay/Expansion
        chargeLevel: 0,
        bubbleRadius: 0,
        particles: null,
        particleData: [],
        gimbals: [],
        acceleratorCoils: [],
        pistons: [],
        rotors: [],
        displays: [],
        wheels: [],
        energyArcs: [],
        potentialGrid: null,
        bubbleInner: null,
        bubbleOuter: null,
        realityAnchors: [],
        hydraulicRods: []
    };

    // =========================================================================
    // 3. UTILITY FUNCTIONS
    // =========================================================================
    class CustomSinCurve extends THREE.Curve {
        constructor( scale = 1, frequency = 1, amplitude = 0.5 ) {
            super();
            this.scale = scale;
            this.frequency = frequency;
            this.amplitude = amplitude;
        }
        getPoint( t, optionalTarget = new THREE.Vector3() ) {
            const tx = t * 3 - 1.5;
            const ty = Math.sin( 2 * Math.PI * t * this.frequency ) * this.amplitude;
            const tz = Math.cos( 2 * Math.PI * t * this.frequency ) * this.amplitude;
            return optionalTarget.set( tx, ty, tz ).multiplyScalar( this.scale );
        }
    }

    // =========================================================================
    // 4. COMPONENT BUILDERS
    // =========================================================================

    function buildMassiveMobilitySystem() {
        const mobGroup = new THREE.Group();
        // 8 massive wheels for the crawler platform
        const positions = [
            [-80, -40, -100], [80, -40, -100],
            [-80, -40, -35],  [80, -40, -35],
            [-80, -40, 35],   [80, -40, 35],
            [-80, -40, 100],  [80, -40, 100]
        ];
        
        positions.forEach((pos, idx) => {
            const wheelGroup = new THREE.Group();
            
            // Tire base (Torus)
            const tireGeo = new THREE.TorusGeometry( 20, 8, 32, 100 );
            const tire = new THREE.Mesh( tireGeo, rubber );
            tire.rotation.y = Math.PI/2;
            wheelGroup.add(tire);
            
            // Hundreds of tiny extruded BoxGeometry lugs for off-road treads
            const numLugs = 180;
            const lugGroup = new THREE.Group();
            for(let l=0; l<numLugs; l++) {
                const angle = (l / numLugs) * Math.PI * 2;
                const lugGeo = new THREE.BoxGeometry( 18, 2, 5 );
                const lug = new THREE.Mesh( lugGeo, rubber );
                lug.position.set(0, Math.cos(angle) * 27, Math.sin(angle) * 27);
                lug.rotation.x = -angle;
                
                // chevron shape pattern
                if (l % 2 === 0) {
                    lug.rotation.y = Math.PI / 8;
                    lug.position.x = 4;
                } else {
                    lug.rotation.y = -Math.PI / 8;
                    lug.position.x = -4;
                }
                lugGroup.add(lug);
            }
            wheelGroup.add(lugGroup);
            
            // Rims with complex spoke arrays
            const rimGeo = new THREE.CylinderGeometry( 16, 16, 12, 32 );
            const rim = new THREE.Mesh( rimGeo, darkSteel );
            rim.rotation.z = Math.PI/2;
            wheelGroup.add(rim);
            
            // Inner complex spokes
            for(let s=0; s<16; s++) {
                const sAngle = (s/16) * Math.PI * 2;
                const spokeGeo = new THREE.CylinderGeometry( 0.8, 1.5, 32 );
                const spoke = new THREE.Mesh( spokeGeo, chrome );
                spoke.position.set(0, Math.cos(sAngle)*8, Math.sin(sAngle)*8);
                spoke.rotation.x = -sAngle;
                wheelGroup.add(spoke);
            }
            
            // Axle connection and hydraulic shock absorbers
            const axleGeo = new THREE.CylinderGeometry( 5, 5, 30 );
            const axle = new THREE.Mesh( axleGeo, steel );
            axle.rotation.z = Math.PI/2;
            axle.position.x = pos[0] > 0 ? -15 : 15;
            wheelGroup.add(axle);

            const shockGeo = new THREE.CylinderGeometry( 3, 3, 20 );
            const shock = new THREE.Mesh( shockGeo, copper );
            shock.position.set(pos[0] > 0 ? -15 : 15, 15, 0);
            wheelGroup.add(shock);
            
            wheelGroup.position.set(...pos);
            mobGroup.add(wheelGroup);
            state.wheels.push({ mesh: wheelGroup, side: pos[0] > 0 ? 1 : -1 }); 
        });

        // Chassis body
        const chassisGeo = new THREE.BoxGeometry( 140, 20, 260 );
        const chassis = new THREE.Mesh( chassisGeo, darkSteel );
        chassis.position.y = -10;
        mobGroup.add(chassis);

        // Add 500 decorative rivets/bolts to chassis
        const boltGeo = new THREE.CylinderGeometry(0.5, 0.5, 1, 8);
        const boltMesh = new THREE.InstancedMesh(boltGeo, chrome, 500);
        const dummy = new THREE.Object3D();
        let bIdx = 0;
        for(let i=0; i<25; i++) {
            for(let j=0; j<20; j++) {
                dummy.position.set(-68 + i*5.6, 0.5, -128 + j*13.4);
                dummy.updateMatrix();
                boltMesh.setMatrixAt(bIdx++, dummy.matrix);
            }
        }
        mobGroup.add(boltMesh);

        group.add(mobGroup);
        
        parts.push({
            name: "God-Tier Mobility Treads & Crawler Chassis",
            description: "Massive off-road wheels and chassis designed to transport the 10-million ton Doomsday trigger across shattered planetary terrain.",
            material: "Rubber, Dark Steel, Chrome",
            function: "Locomotion and immense weight distribution.",
            assemblyOrder: 1,
            connections: ["Primary Containment Frame"],
            failureEffect: "Immobilization of the trigger, rendering it vulnerable to intervention.",
            cascadeFailures: ["Chassis Fracture", "Alignment Skew", "Axle Collapse"],
            originalPosition: {x: 0, y: -40, z: 0},
            explodedPosition: {x: 0, y: -100, z: 0}
        });
    }

    function buildFoundationAndPipes() {
        const foundGroup = new THREE.Group();
        
        // Massive octagonal base
        const baseGeo = new THREE.CylinderGeometry(120, 130, 10, 8);
        const base = new THREE.Mesh(baseGeo, steel);
        base.position.y = 10;
        foundGroup.add(base);

        // Intricate piping network underneath
        const pipeMat = copper;
        for(let p=0; p<100; p++) {
            const points = [];
            let currX = (Math.random()-0.5)*200;
            let currY = (Math.random()-0.5)*15 + 5;
            let currZ = (Math.random()-0.5)*200;
            points.push(new THREE.Vector3(currX, currY, currZ));
            
            for(let s=0; s<4; s++) {
                const axis = Math.floor(Math.random()*3);
                const dist = (Math.random()+0.5)*20 * (Math.random() > 0.5 ? 1 : -1);
                if(axis===0) currX += dist;
                if(axis===1) currY += dist;
                if(axis===2) currZ += dist;
                points.push(new THREE.Vector3(currX, currY, currZ));
            }
            
            const path = new THREE.CatmullRomCurve3(points, false, 'chordal', 0.5);
            const tubeGeo = new THREE.TubeGeometry(path, 16, 0.8, 8, false);
            const tube = new THREE.Mesh(tubeGeo, pipeMat);
            foundGroup.add(tube);
        }

        group.add(foundGroup);

        parts.push({
            name: "Coolant & Plasma Manifold Matrix",
            description: "Over 10,000 km of hyper-cooled copper tubing circulating exotic superfluids to prevent the base from melting.",
            material: "Copper",
            function: "Thermal regulation of the reality-bending energies.",
            assemblyOrder: 2,
            connections: ["Crawler Chassis", "Containment Chamber"],
            failureEffect: "Instantaneous vaporization of the machine and the surrounding continent.",
            cascadeFailures: ["Core Meltdown", "Explosive Decompression"],
            originalPosition: {x: 0, y: 10, z: 0},
            explodedPosition: {x: 0, y: -20, z: 0}
        });
    }

    function buildContainmentChamber() {
        const chamberGroup = new THREE.Group();
        chamberGroup.position.y = 70;
        
        // Giant outer ring (Torus)
        const ringGeo = new THREE.TorusGeometry( 90, 8, 64, 128 );
        const ringMesh = new THREE.Mesh( ringGeo, darkSteel );
        ringMesh.rotation.x = Math.PI / 2;
        chamberGroup.add(ringMesh);
        
        // Complex structural ribs connecting outer ring to an inner ring
        const innerRingGeo = new THREE.TorusGeometry( 60, 4, 32, 128 );
        const innerRing = new THREE.Mesh( innerRingGeo, steel );
        innerRing.rotation.x = Math.PI / 2;
        chamberGroup.add(innerRing);

        for (let i = 0; i < 72; i++) {
            const angle = (i / 72) * Math.PI * 2;
            // Rib
            const ribGeo = new THREE.BoxGeometry( 30, 15, 2 );
            const rib = new THREE.Mesh( ribGeo, darkSteel );
            rib.position.set( Math.cos(angle) * 75, 0, Math.sin(angle) * 75 );
            rib.rotation.y = -angle;
            chamberGroup.add(rib);

            // Hydraulic pistons connecting ribs
            const pistonGeo = new THREE.CylinderGeometry(0.8, 0.8, 15);
            const piston = new THREE.Mesh(pistonGeo, chrome);
            piston.position.set( Math.cos(angle) * 60, 7.5, Math.sin(angle) * 60 );
            piston.rotation.x = Math.PI/2;
            piston.rotation.z = -angle;
            chamberGroup.add(piston);
            state.hydraulicRods.push(piston);
        }

        // Add 3 massive rotating gimbals (Spherical containment)
        const gimbalRadii = [45, 35, 25];
        gimbalRadii.forEach((r, idx) => {
            const gGeo = new THREE.TorusGeometry(r, 2, 16, 100);
            const gMesh = new THREE.Mesh(gGeo, idx % 2 === 0 ? aluminum : copper);
            chamberGroup.add(gMesh);
            state.gimbals.push(gMesh);
        });

        group.add(chamberGroup);
        
        parts.push({
            name: "Primary Magnetic Confinement Sphere",
            description: "Three nested super-conducting gimbals and heavy ribs designed to contain the chaotic pre-decay state.",
            material: "Dark Steel, Aluminum, Copper",
            function: "Prevents premature decoherence of the targeted vacuum state.",
            assemblyOrder: 3,
            connections: ["Manifold Matrix", "Core"],
            failureEffect: "Uncontrolled, localized false vacuum decay resulting in a jagged, unstable bubble.",
            cascadeFailures: ["Gimbal Lock", "Magnetic Reconnection Blast"],
            originalPosition: {x: 0, y: 70, z: 0},
            explodedPosition: {x: 0, y: 150, z: 0}
        });
    }

    function buildQuantumTunnelingAccelerators() {
        const accGroup = new THREE.Group();
        accGroup.position.y = 70;
        const numAccelerators = 12;
        
        for(let i=0; i<numAccelerators; i++) {
            const angle = (i / numAccelerators) * Math.PI * 2;
            const barrelGroup = new THREE.Group();
            
            // Main Extruded Barrel Shape (Hexagonal)
            const hexShape = new THREE.Shape();
            for(let h=0; h<6; h++) {
                const a = (h/6) * Math.PI * 2;
                if(h===0) hexShape.moveTo(Math.cos(a)*6, Math.sin(a)*6);
                else hexShape.lineTo(Math.cos(a)*6, Math.sin(a)*6);
            }
            hexShape.closePath();
            
            const extrudeSettings = { depth: 70, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.5, bevelThickness: 0.5 };
            const tubeGeo = new THREE.ExtrudeGeometry( hexShape, extrudeSettings );
            const tube = new THREE.Mesh( tubeGeo, darkSteel );
            // Extrude goes along Z, we want it pointing towards center
            tube.position.z = 25; 
            barrelGroup.add(tube);
            
            // Magnetic acceleration coils wrapping the barrel
            for(let j=0; j<15; j++) {
                const coilGeo = new THREE.TorusGeometry( 8, 1, 16, 64 );
                const coil = new THREE.Mesh( coilGeo, copper );
                coil.position.z = 30 + j * 4;
                barrelGroup.add(coil);
                state.acceleratorCoils.push({ mesh: coil, index: j, accelIndex: i });
            }
            
            // Exotic plasma injectors (sine wave tubes) on the side
            const path1 = new CustomSinCurve( 20, 2, 2 );
            const path2 = new CustomSinCurve( 20, 2, -2 );
            const feedGeo1 = new THREE.TubeGeometry( path1, 30, 0.5, 8, false );
            const feedGeo2 = new THREE.TubeGeometry( path2, 30, 0.5, 8, false );
            const feed1 = new THREE.Mesh( feedGeo1, glass );
            const feed2 = new THREE.Mesh( feedGeo2, glass );
            feed1.position.set(7, 0, 45);
            feed2.position.set(-7, 0, 45);
            feed1.rotation.y = Math.PI/2;
            feed2.rotation.y = Math.PI/2;
            barrelGroup.add(feed1);
            barrelGroup.add(feed2);
            
            // Exhaust vents
            const ventGeo = new THREE.BoxGeometry(4, 2, 10);
            const vent = new THREE.Mesh(ventGeo, steel);
            vent.position.set(0, 7, 75);
            barrelGroup.add(vent);

            barrelGroup.rotation.y = angle;
            accGroup.add(barrelGroup);
        }
        
        group.add(accGroup);

        parts.push({
            name: "Quantum Tunneling Accelerators",
            description: "12 massive hexagonal particle guns that fire strangelets converging at the exact center to pierce the Higgs barrier.",
            material: "Dark Steel, Copper, Glass",
            function: "Energy delivery and barrier penetration.",
            assemblyOrder: 4,
            connections: ["Containment Chamber", "Energy Grid"],
            failureEffect: "Asymmetric tunneling, causing the machine to rip itself apart without triggering full decay.",
            cascadeFailures: ["Barrel Rupture", "Coil Sublimation"],
            originalPosition: {x: 0, y: 70, z: 0},
            explodedPosition: {x: 0, y: 70, z: 200} // concept exploded
        });
    }

    function buildHiggsExciterCore() {
        const coreGroup = new THREE.Group();
        coreGroup.position.y = 70;

        // Central Polyhedron (The Exciter)
        const exciterGeo = new THREE.IcosahedronGeometry(8, 2);
        const exciter = new THREE.Mesh(exciterGeo, matCoreEnergy);
        coreGroup.add(exciter);
        state.rotors.push(exciter);

        // Inner wireframe lattice
        const latticeGeo = new THREE.IcosahedronGeometry(12, 1);
        const lattice = new THREE.Mesh(latticeGeo, matQuantumLattice);
        coreGroup.add(lattice);
        state.rotors.push(lattice);

        // Concentrated energy spikes
        for(let i=0; i<20; i++) {
            const spikeGeo = new THREE.ConeGeometry(0.5, 20, 8);
            const spike = new THREE.Mesh(spikeGeo, chrome);
            
            // distribute randomly on sphere
            const phi = Math.acos( -1 + ( 2 * i ) / 20 );
            const theta = Math.sqrt( 20 * Math.PI ) * phi;
            
            spike.position.setFromSphericalCoords(8, phi, theta);
            spike.lookAt(0, 0, 0);
            // push out slightly
            spike.position.multiplyScalar(1.5);
            coreGroup.add(spike);
        }

        group.add(coreGroup);

        parts.push({
            name: "Higgs Exciter Core",
            description: "The unimaginably dense focal point. A synthetic crystal of stabilized top quarks and Higgs bosons.",
            material: "Synthetic Exotic Matter, Chrome",
            function: "Provides the nucleation site for the true vacuum bubble.",
            assemblyOrder: 5,
            connections: ["Accelerators"],
            failureEffect: "Creation of a microscopic black hole.",
            cascadeFailures: ["Spaghettification"],
            originalPosition: {x: 0, y: 70, z: 0},
            explodedPosition: {x: 0, y: 70, z: 0}
        });
    }

    function buildRealityAnchorTethers() {
        const anchorGroup = new THREE.Group();
        
        for(let c=0; c<8; c++) {
            const chain = new THREE.Group();
            for(let i=0; i<45; i++) {
                const linkGeo = new THREE.TorusGeometry(3, 1, 16, 32);
                linkGeo.scale(1, 1.5, 1); // stretch into chain link
                const link = new THREE.Mesh(linkGeo, steel);
                link.rotation.y = (i % 2 === 0) ? 0 : Math.PI/2;
                link.position.y = i * 5;
                chain.add(link);
            }
            
            const angle = (c/8)*Math.PI*2;
            chain.position.set(Math.cos(angle)*130, 20, Math.sin(angle)*130);
            
            // Aim at the top of the containment chamber
            chain.lookAt(0, 120, 0);
            // Tilt back a bit to simulate tension
            chain.rotateX(Math.PI / 6);
            
            anchorGroup.add(chain);
            state.realityAnchors.push(chain);
        }
        group.add(anchorGroup);

        parts.push({
            name: "Reality Anchor Tethers",
            description: "Macroscopic chains of neutron-star degenerate matter designed to literally hold space-time together from the recoil.",
            material: "Degenerate Matter (Steel representation)",
            function: "Stabilizes the local manifold during charge-up.",
            assemblyOrder: 6,
            connections: ["Foundation Base", "Local Bedrock"],
            failureEffect: "Machine gets violently flung into a higher dimension before decay initiates.",
            cascadeFailures: ["Tether Snap", "Dimensional Shear"],
            originalPosition: {x: 0, y: 20, z: 0},
            explodedPosition: {x: 150, y: 20, z: 150}
        });
    }

    function buildPhaseSpaceResonators() {
        const resGroup = new THREE.Group();
        for (let i = 0; i < 16; i++) {
            const angle = (i / 16) * Math.PI * 2;
            const res = new THREE.Group();
            
            // Base block
            const baseGeo = new THREE.BoxGeometry(8, 6, 8);
            const base = new THREE.Mesh(baseGeo, darkSteel);
            res.add(base);
            
            // Oscillating Crystal
            const crystalGeo = new THREE.OctahedronGeometry(4, 0);
            crystalGeo.scale(1, 2.5, 1);
            const crystal = new THREE.Mesh(crystalGeo, matCoreEnergy);
            crystal.position.y = 10;
            res.add(crystal);
            
            // Holding struts
            for(let j=0; j<4; j++) {
                const strutGeo = new THREE.CylinderGeometry(0.4, 0.4, 12);
                const strut = new THREE.Mesh(strutGeo, chrome);
                const sAngle = (j/4) * Math.PI * 2 + Math.PI/4;
                strut.position.set(Math.cos(sAngle)*4, 6, Math.sin(sAngle)*4);
                strut.lookAt(0, 10, 0);
                res.add(strut);
            }
            
            res.position.set(Math.cos(angle)*100, 15, Math.sin(angle)*100);
            res.lookAt(0, 15, 0);
            resGroup.add(res);
            state.rotors.push(crystal);
            state.energyArcs.push(crystal); // animate emissive intensity
        }
        group.add(resGroup);

        parts.push({
            name: "Phase Space Resonators",
            description: "16 massive crystalline arrays that vibrate precisely at the frequency of the false vacuum's false minimum.",
            material: "Dark Steel, Chrome, Core Energy",
            function: "Shatters the quantum probability waveforms.",
            assemblyOrder: 7,
            connections: ["Foundation Base"],
            failureEffect: "Premature wave-function collapse, resulting in mere localized explosions.",
            cascadeFailures: ["Harmonic Dissonance"],
            originalPosition: {x: 0, y: 15, z: 0},
            explodedPosition: {x: 0, y: -50, z: 0}
        });
    }

    function buildOperatorControlNexus() {
        const nexusGroup = new THREE.Group();
        
        // Massive cantilevered arm holding the nexus
        const armGeo = new THREE.BoxGeometry(10, 10, 80);
        const arm = new THREE.Mesh(armGeo, darkSteel);
        arm.position.set(0, -10, -40);
        nexusGroup.add(arm);

        // Tinted cabin structure
        const cabinGeo = new THREE.BoxGeometry(40, 20, 25);
        const cabin = new THREE.Mesh(cabinGeo, tinted); 
        cabin.position.y = 0;
        nexusGroup.add(cabin);
        
        // Exoskeleton Frame
        const frameGeo = new THREE.BoxGeometry(42, 22, 27);
        const frameMat = new THREE.MeshStandardMaterial({color: 0x222222, wireframe: true});
        const frame = new THREE.Mesh(frameGeo, frameMat);
        frame.position.y = 0;
        nexusGroup.add(frame);
        
        // Control panel array
        const panelGeo = new THREE.BoxGeometry(30, 2, 8);
        const panel = new THREE.Mesh(panelGeo, steel);
        panel.position.set(0, -2, 8);
        panel.rotation.x = Math.PI / 8;
        nexusGroup.add(panel);
        
        // Glowing screens
        for(let i=0; i<10; i++) {
            const screenGeo = new THREE.PlaneGeometry(4, 3);
            const screen = new THREE.Mesh(screenGeo, matScreenGlowing); 
            screen.position.set(-15 + i*3.3, 3, 7);
            screen.rotation.x = -Math.PI / 8;
            screen.rotation.y = Math.PI; // face inward
            nexusGroup.add(screen);
            state.displays.push(screen);
        }
        
        // Joysticks
        for(let j=0; j<8; j++) {
            const stickGroup = new THREE.Group();
            const baseGeo = new THREE.CylinderGeometry(0.8, 1.0, 1);
            const base = new THREE.Mesh(baseGeo, chrome);
            stickGroup.add(base);
            const shaftGeo = new THREE.CylinderGeometry(0.2, 0.2, 2.5);
            const shaft = new THREE.Mesh(shaftGeo, chrome);
            shaft.position.y = 1.25;
            stickGroup.add(shaft);
            const knobGeo = new THREE.SphereGeometry(0.5);
            const knob = new THREE.Mesh(knobGeo, plastic);
            knob.position.y = 2.5;
            stickGroup.add(knob);
            
            stickGroup.position.set(-13 + j*3.7, -1, 10);
            stickGroup.rotation.x = Math.PI / 8;
            nexusGroup.add(stickGroup);
            state.pistons.push(stickGroup); // animate wobble
        }
        
        // Detailed operator chairs
        function buildChair(x, y, z) {
            const chairGroup = new THREE.Group();
            for(let i=0; i<5; i++) {
                const legGeo = new THREE.CylinderGeometry(0.2, 0.3, 1.5);
                const leg = new THREE.Mesh(legGeo, steel);
                leg.rotation.x = Math.PI/2;
                leg.position.y = 0.3;
                const a = (i/5)*Math.PI*2;
                leg.position.x = Math.cos(a) * 0.8;
                leg.position.z = Math.sin(a) * 0.8;
                leg.lookAt(0, 0.3, 0);
                chairGroup.add(leg);
            }
            const poleGeo = new THREE.CylinderGeometry(0.3, 0.3, 2);
            const pole = new THREE.Mesh(poleGeo, chrome);
            pole.position.y = 1.3;
            chairGroup.add(pole);
            const seatGeo = new THREE.BoxGeometry(2.5, 0.4, 2.5);
            const seat = new THREE.Mesh(seatGeo, rubber);
            seat.position.y = 2.5;
            chairGroup.add(seat);
            const backGeo = new THREE.BoxGeometry(2.5, 3, 0.4);
            const back = new THREE.Mesh(backGeo, rubber);
            back.position.set(0, 4.2, -1.05);
            chairGroup.add(back);
            chairGroup.position.set(x, y, z);
            return chairGroup;
        }

        for(let k=0; k<6; k++) {
            const chair = buildChair(-12 + k*4.8, -8, 2);
            nexusGroup.add(chair);
        }
        
        nexusGroup.position.set(0, 110, -140); // high up and far back
        group.add(nexusGroup);

        parts.push({
            name: "Operator Control Nexus",
            description: "The suicidal command center. Features tinted radiation-proof glass, holographic displays, and complex joysticks.",
            material: "Tinted Glass, Steel, Rubber",
            function: "Allows mad scientists to orchestrate the end of the universe.",
            assemblyOrder: 8,
            connections: ["Main Frame"],
            failureEffect: "Operator incineration prior to universal collapse.",
            cascadeFailures: ["Life Support Failure"],
            originalPosition: {x: 0, y: 110, z: -140},
            explodedPosition: {x: 0, y: 200, z: -250}
        });
    }

    function buildHiggsPotentialVisualizer() {
        // Creates a dynamic grid representing the Higgs field potential "Mexican hat"
        const gridGeo = new THREE.PlaneGeometry(300, 300, 128, 128);
        const gridMat = new THREE.MeshBasicMaterial({ 
            color: 0x00aaff, 
            wireframe: true, 
            transparent: true, 
            opacity: 0.15 
        });
        const gridMesh = new THREE.Mesh(gridGeo, gridMat);
        gridMesh.rotation.x = -Math.PI / 2;
        gridMesh.position.y = 35; // Hovering below the core
        group.add(gridMesh);
        
        state.potentialGrid = gridMesh;

        parts.push({
            name: "Holographic Potential Field Visualizer",
            description: "A 300-meter wide holographic grid plotting the real-time scalar field potential of the local vacuum.",
            material: "Holographic Light (Wireframe)",
            function: "Visual monitoring of the tunneling probability.",
            assemblyOrder: 9,
            connections: ["Control Nexus Sensors"],
            failureEffect: "Blind operation of the trigger.",
            cascadeFailures: [],
            originalPosition: {x: 0, y: 35, z: 0},
            explodedPosition: {x: 0, y: 0, z: 0}
        });
    }

    function buildQuantumVacuumFluctuations() {
        // InstancedMesh representing virtual particle pairs popping in and out
        const particleGeo = new THREE.TetrahedronGeometry(1.5, 0);
        const particleCount = 8000;
        const particleMesh = new THREE.InstancedMesh(particleGeo, matPlasmaLine, particleCount);
        
        const dummy = new THREE.Object3D();
        for(let i=0; i<particleCount; i++) {
            const radius = Math.random() * 150 + 20;
            const angle = Math.random() * Math.PI * 2;
            const y = (Math.random() - 0.5) * 150 + 70;
            
            state.particleData.push({
                radius: radius,
                angle: angle,
                y: y,
                speed: (Math.random() - 0.5) * 0.02,
                freq: Math.random() * 2 + 0.5,
                phase: Math.random() * Math.PI * 2,
                rotSpeed: Math.random() * 0.1,
                alive: true
            });
            
            dummy.position.set(Math.cos(angle)*radius, y, Math.sin(angle)*radius);
            dummy.updateMatrix();
            particleMesh.setMatrixAt(i, dummy.matrix);
        }
        
        group.add(particleMesh);
        state.particles = particleMesh;

        parts.push({
            name: "Vacuum Fluctuation Field",
            description: "Visible manifestations of virtual particles being excited by the machine's immense gravitational and electromagnetic stresses.",
            material: "Plasma / Virtual Energy",
            function: "Ambient reality noise.",
            assemblyOrder: 10,
            connections: ["Spacetime"],
            failureEffect: "None.",
            cascadeFailures: [],
            originalPosition: {x: 0, y: 70, z: 0},
            explodedPosition: {x: 0, y: 70, z: 0}
        });
    }

    function buildTrueVacuumBubble() {
        // The apocalypse itself.
        const geo = new THREE.SphereGeometry(1, 64, 64);
        
        // Inner pitch black void
        const innerBubble = new THREE.Mesh(geo, matTrueVacuumInner);
        innerBubble.position.y = 70;
        innerBubble.scale.set(0.001, 0.001, 0.001);
        innerBubble.visible = false;
        group.add(innerBubble);
        
        // Outer emissive shockwave
        const outerBubble = new THREE.Mesh(geo, matTrueVacuumOuter);
        outerBubble.position.y = 70;
        outerBubble.scale.set(0.001, 0.001, 0.001);
        outerBubble.visible = false;
        group.add(outerBubble);
        
        state.bubbleInner = innerBubble;
        state.bubbleOuter = outerBubble;

        parts.push({
            name: "True Vacuum Bubble",
            description: "A rapidly expanding sphere of lower-energy vacuum where the Higgs field has a different value, destroying all known physics.",
            material: "Absolute Void & High-Energy Boundary",
            function: "Eradication of the universe.",
            assemblyOrder: 11,
            connections: ["The Core"],
            failureEffect: "Success means failure of existence.",
            cascadeFailures: ["The Universe"],
            originalPosition: {x: 0, y: 70, z: 0},
            explodedPosition: {x: 0, y: 70, z: 0}
        });
    }

    function buildSubatomicSensors() {
        const sensorGroup = new THREE.Group();
        for(let i=0; i<40; i++) {
            const probeGeo = new THREE.CylinderGeometry(0.2, 0.2, 10);
            const probe = new THREE.Mesh(probeGeo, chrome);
            const r = Math.random() * 40 + 30;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            probe.position.set(
                r * Math.sin(phi) * Math.cos(theta),
                r * Math.cos(phi) + 70,
                r * Math.sin(phi) * Math.sin(theta)
            );
            probe.lookAt(0, 70, 0);
            
            // tiny dish at the end
            const dishGeo = new THREE.CylinderGeometry(1.5, 0.1, 1);
            const dish = new THREE.Mesh(dishGeo, steel);
            dish.position.z = 5;
            dish.rotation.x = Math.PI/2;
            probe.add(dish);
            
            sensorGroup.add(probe);
        }
        group.add(sensorGroup);

        parts.push({
            name: "Subatomic Sensor Array",
            description: "40 delicate probes monitoring local quantum chromodynamics and electroweak symmetry breaking points.",
            material: "Chrome, Steel",
            function: "Telemetry.",
            assemblyOrder: 12,
            connections: ["Primary Containment Sphere"],
            failureEffect: "Loss of precision targeting for the tunnel event.",
            cascadeFailures: [],
            originalPosition: {x: 0, y: 70, z: 0},
            explodedPosition: {x: 0, y: 100, z: 0}
        });
    }

    function buildPlasmaInjectorValves() {
        const valveGroup = new THREE.Group();
        for(let i=0; i<8; i++) {
            const angle = (i/8)*Math.PI*2;
            const vGeo = new THREE.TorusKnotGeometry(4, 1.5, 64, 16);
            const vMesh = new THREE.Mesh(vGeo, copper);
            vMesh.position.set(Math.cos(angle)*80, -5, Math.sin(angle)*80);
            vMesh.rotation.x = Math.PI/2;
            valveGroup.add(vMesh);
            state.rotors.push(vMesh);
        }
        group.add(valveGroup);

        parts.push({
            name: "Plasma Injector Valves",
            description: "Complex torus knot manifolds that mix strange quark matter with high-energy positrons.",
            material: "Copper",
            function: "Fuel delivery.",
            assemblyOrder: 13,
            connections: ["Piping Matrix"],
            failureEffect: "Plasma leak causing immediate vaporization of the lower decks.",
            cascadeFailures: [],
            originalPosition: {x: 0, y: -5, z: 0},
            explodedPosition: {x: 0, y: -30, z: 0}
        });
    }

    function buildHawkingRadiationVents() {
        const ventGroup = new THREE.Group();
        for(let i=0; i<6; i++) {
            const angle = (i/6)*Math.PI*2;
            const vGeo = new THREE.CylinderGeometry(4, 6, 20);
            const vMesh = new THREE.Mesh(vGeo, darkSteel);
            vMesh.position.set(Math.cos(angle)*110, 30, Math.sin(angle)*110);
            // tilt outwards
            vMesh.lookAt(Math.cos(angle)*200, 80, Math.sin(angle)*200);
            vMesh.rotateX(Math.PI/2);
            ventGroup.add(vMesh);
        }
        group.add(ventGroup);

        parts.push({
            name: "Hawking Radiation Vents",
            description: "Massive exhaust stacks designed to bleed off stray virtual particles that become real via Unruh radiation near the core.",
            material: "Dark Steel",
            function: "Prevents immediate explosive build-up of rogue particles.",
            assemblyOrder: 14,
            connections: ["Foundation Base"],
            failureEffect: "Thermal runaway.",
            cascadeFailures: [],
            originalPosition: {x: 0, y: 30, z: 0},
            explodedPosition: {x: 0, y: 50, z: 0}
        });
    }

    function buildSpacetimeDistortionCoils() {
        const coilGroup = new THREE.Group();
        for(let i=0; i<3; i++) {
            const coilGeo = new THREE.TorusGeometry(120, 2, 32, 100);
            const coil = new THREE.Mesh(coilGeo, chrome);
            coil.rotation.x = Math.PI/2;
            coil.position.y = 40 + i * 30;
            coilGroup.add(coil);
            // We'll scale these dynamically
            state.gimbals.push(coil); 
        }
        group.add(coilGroup);

        parts.push({
            name: "Spacetime Distortion Coils",
            description: "Giant chrome rings generating immense frame-dragging effects to artificially lower the tunneling energy barrier.",
            material: "Chrome",
            function: "Barrier manipulation.",
            assemblyOrder: 15,
            connections: ["Gravity"],
            failureEffect: "Time dilation tearing the machine into distinct temporal frames.",
            cascadeFailures: ["Chronological Fracture"],
            originalPosition: {x: 0, y: 70, z: 0},
            explodedPosition: {x: 0, y: 150, z: 0}
        });
    }

    // Call all builders
    buildMassiveMobilitySystem();
    buildFoundationAndPipes();
    buildContainmentChamber();
    buildQuantumTunnelingAccelerators();
    buildHiggsExciterCore();
    buildRealityAnchorTethers();
    buildPhaseSpaceResonators();
    buildOperatorControlNexus();
    buildHiggsPotentialVisualizer();
    buildQuantumVacuumFluctuations();
    buildSubatomicSensors();
    buildPlasmaInjectorValves();
    buildHawkingRadiationVents();
    buildSpacetimeDistortionCoils();
    buildTrueVacuumBubble();

    // =========================================================================
    // 5. ANIMATION & LOGIC
    // =========================================================================
    
    function animate(time, speed, meshes) {
        const t = time * speed;
        
        // ----------------------------------------------------
        // PHASE TIMELINE (20 Second Loop)
        // 0-10s: Charging, potential well deepens, rings spin
        // 10-12s: Tunneling Event, intense light, extreme jitter
        // 12-18s: Bubble Expansion, obliteration of particles
        // 18-20s: Resetting
        // ----------------------------------------------------
        const phaseTime = t % 20;
        
        if (phaseTime < 10) {
            state.phase = 0;
            state.chargeLevel = phaseTime / 10;
            state.bubbleRadius = 0;
        } else if (phaseTime < 12) {
            state.phase = 1;
            state.chargeLevel = 1 + (phaseTime - 10); // goes 1 to 3
            state.bubbleRadius = 0;
        } else if (phaseTime < 18) {
            state.phase = 2;
            // Bubble expands exponentially (pseudo-speed-of-light)
            state.bubbleRadius = Math.pow((phaseTime - 12) * 8, 2.5); 
        } else {
            state.phase = 3; // Reset
            state.bubbleRadius = 0;
            state.chargeLevel = 0;
        }

        const phase0Speed = 1 + state.chargeLevel * 10;
        const phase1Speed = 11 + Math.random() * 5; // chaotic

        // Animate Wheels (Crawler movement)
        if (state.phase < 2) {
            state.wheels.forEach(w => {
                w.mesh.children[0].rotation.z -= 0.005 * phase0Speed * w.side; // tire
                w.mesh.children[1].rotation.z -= 0.005 * phase0Speed * w.side; // lugs
                w.mesh.children[2].rotation.x -= 0.005 * phase0Speed * w.side; // rims
            });
        }

        // Animate Gimbals & Distortion Coils
        state.gimbals.forEach((g, idx) => {
            const rotSpeed = state.phase === 1 ? phase1Speed : phase0Speed;
            if(idx % 3 === 0) g.rotation.x += 0.01 * rotSpeed;
            if(idx % 3 === 1) g.rotation.y += 0.015 * rotSpeed;
            if(idx % 3 === 2) g.rotation.z += 0.02 * rotSpeed;
            
            // Wobbly scale for distortion coils
            if (idx >= 3) {
                const s = 1 + Math.sin(t * 5 + idx) * 0.05 * state.chargeLevel;
                g.scale.set(s, s, s);
            }
        });

        // Animate Rotors (Crystals, Valves, Core)
        state.rotors.forEach((r, idx) => {
            const rotSpeed = state.phase === 1 ? phase1Speed : phase0Speed;
            r.rotation.y += 0.02 * rotSpeed * (idx % 2 === 0 ? 1 : -1);
            r.rotation.z += 0.01 * rotSpeed;
        });

        // Animate Pistols & Hydraulic Rods
        state.pistons.forEach((p, idx) => {
            p.rotation.x = Math.PI/8 + Math.sin(t * 10 + idx) * 0.1 * state.chargeLevel;
            p.rotation.z = Math.cos(t * 8 + idx) * 0.1 * state.chargeLevel;
        });
        
        state.hydraulicRods.forEach((rod, idx) => {
            // simulate pumping
            rod.scale.y = 1 + Math.sin(t * 15 + idx) * 0.2 * state.chargeLevel;
        });

        // Animate Accelerator Coils (Energy Pulses)
        state.acceleratorCoils.forEach(coilData => {
            const pulse = (t * 8 - coilData.index) % 15;
            if (Math.abs(pulse) < 1.5 && state.phase < 2) {
                coilData.mesh.material.emissiveIntensity = 10 * state.chargeLevel;
                // scale up slightly when pulsing
                coilData.mesh.scale.set(1.1, 1.1, 1.1);
            } else {
                coilData.mesh.material.emissiveIntensity = 1;
                coilData.mesh.scale.set(1, 1, 1);
            }
        });

        // Animate Displays & Energy Arcs
        state.displays.forEach((d, idx) => {
            d.material.emissiveIntensity = 2 + Math.random() * 2 * state.chargeLevel;
            if (state.phase === 1) d.material.color.setHex(0xff0000); // red alert
            else d.material.color.setHex(0x00ff00);
        });

        state.energyArcs.forEach(arc => {
            arc.material.emissiveIntensity = 5 + 10 * state.chargeLevel;
        });

        // =====================================================================
        // PARTICLE SYSTEM (VACUUM FLUCTUATIONS)
        // =====================================================================
        if (state.particles) {
            const dummy = new THREE.Object3D();
            for(let i=0; i<state.particleData.length; i++) {
                const data = state.particleData[i];
                
                if (state.phase < 2) {
                    // Pre-decay: particles orbit and jitter
                    const jitterAmount = state.phase === 1 ? 5 : state.chargeLevel * 1.5;
                    const jitterX = (Math.random() - 0.5) * jitterAmount;
                    const jitterY = (Math.random() - 0.5) * jitterAmount;
                    const jitterZ = (Math.random() - 0.5) * jitterAmount;
                    
                    data.angle += data.speed * (1 + state.chargeLevel * 3);
                    const r = data.radius * (1 - state.chargeLevel * 0.3); // pull towards center
                    
                    const x = Math.cos(data.angle) * r + jitterX;
                    const z = Math.sin(data.angle) * r + jitterZ;
                    const y = data.y + Math.sin(t * data.freq + data.phase) * 5 * state.chargeLevel + jitterY;
                    
                    dummy.position.set(x, y, z);
                    dummy.rotation.x += data.rotSpeed;
                    dummy.rotation.y += data.rotSpeed;
                    dummy.scale.set(1, 1, 1);
                    data.alive = true;
                    
                } else if (state.phase === 2) {
                    // Decay: Bubble expands, particles inside are obliterated
                    if (!data.alive) continue;
                    
                    const x = Math.cos(data.angle) * data.radius;
                    const z = Math.sin(data.angle) * data.radius;
                    // distance to core center (0, 70, 0)
                    const dy = data.y - 70;
                    const distSq = x*x + dy*dy + z*z;
                    
                    if (distSq < state.bubbleRadius * state.bubbleRadius) {
                        // Consumed by true vacuum
                        dummy.position.set(0,0,0);
                        dummy.scale.set(0,0,0);
                        data.alive = false;
                    } else {
                        dummy.position.set(x, data.y, z);
                    }
                } else {
                    // Reset
                    const x = Math.cos(data.angle) * data.radius;
                    const z = Math.sin(data.angle) * data.radius;
                    dummy.position.set(x, data.y, z);
                    dummy.scale.set(1, 1, 1);
                    data.alive = true;
                }
                
                dummy.updateMatrix();
                state.particles.setMatrixAt(i, dummy.matrix);
            }
            state.particles.instanceMatrix.needsUpdate = true;
        }

        // =====================================================================
        // TRUE VACUUM BUBBLE EXPANSION
        // =====================================================================
        if (state.phase === 2) {
            state.bubbleInner.visible = true;
            state.bubbleOuter.visible = true;
            const r = Math.max(0.001, state.bubbleRadius);
            state.bubbleInner.scale.set(r, r, r);
            state.bubbleOuter.scale.set(r * 1.05, r * 1.05, r * 1.05); // slightly larger for glow effect
        } else {
            state.bubbleInner.visible = false;
            state.bubbleOuter.visible = false;
        }

        // =====================================================================
        // HIGGS POTENTIAL GRID MORPHING
        // =====================================================================
        if (state.potentialGrid) {
            const pos = state.potentialGrid.geometry.attributes.position;
            for(let i=0; i<pos.count; i++) {
                const x = pos.getX(i);
                const y = pos.getY(i);
                const dist = Math.sqrt(x*x + y*y);
                
                // Base Mexican Hat shape (scaled for the 300 unit grid)
                const rNorm = dist / 40; 
                const hat = -20 * rNorm * rNorm + 1.5 * Math.pow(rNorm, 4);
                
                // Add tunneling well deepening over time
                const tunnelDepth = state.phase === 1 ? 60 : 30 * state.chargeLevel;
                const tunnelingWell = -tunnelDepth * Math.exp(-dist*dist / 400);
                
                // Add true vacuum drop
                const trueVacuumWell = (state.phase === 2 && dist < state.bubbleRadius) ? -100 : 0;
                
                // Quantum jitters
                const jitter = (Math.random() - 0.5) * (1 + state.chargeLevel * 4);
                
                let z = hat + tunnelingWell + trueVacuumWell + jitter;
                
                // Clamp and set
                pos.setZ(i, Math.max(-150, Math.min(50, z))); 
            }
            pos.needsUpdate = true;
            state.potentialGrid.geometry.computeVertexNormals();
        }
    }

    const description = "The God-Tier False Vacuum Decay Trigger. An impossibly massive, highly unethical physics construct mounted on continent-crushing crawler treads. It utilizes 12 quantum tunneling accelerators and 16 phase space resonators to overcome the energy barrier of the current universe's metastable Higgs field state. Upon firing, it generates a microscopic bubble of true vacuum which exponentially expands at the speed of light, altering fundamental physical constants and obliterating all standard model particles in its wake.";

    const quizQuestions = [
        {
            question: "Which theoretical mechanism allows the universe to transition from a metastable false vacuum to the true vacuum?",
            options: [
                "Baryogenesis via leptogenesis",
                "Coleman-De Luccia instanton tunneling",
                "Spontaneous symmetry breaking of the strong force",
                "Hawking radiation emission"
            ],
            correctAnswer: 1,
            explanation: "False vacuum decay is classically forbidden but can occur via quantum tunneling. The standard theoretical description of this non-perturbative process in scalar field theory is the Coleman-De Luccia instanton, which describes the tunneling rate through the energy barrier."
        },
        {
            question: "In the context of the Standard Model, which two particle masses largely dictate whether our universe's vacuum state is stable or metastable?",
            options: [
                "The electron mass and the muon mass",
                "The W boson mass and the Z boson mass",
                "The top quark mass and the Higgs boson mass",
                "The up quark mass and the down quark mass"
            ],
            correctAnswer: 2,
            explanation: "The top quark mass and the Higgs boson mass govern the renormalization group running of the Higgs quartic coupling (λ). Current measurements suggest λ turns negative at very high energy scales, implying a metastable vacuum."
        },
        {
            question: "What happens to the fundamental laws of physics inside a bubble of true vacuum?",
            options: [
                "They remain identical, but all matter is turned to antimatter.",
                "Gravity becomes repulsive, expanding the bubble.",
                "The Higgs vacuum expectation value changes, radically altering the masses of elementary particles and destabilizing all known bound states of matter.",
                "Time flows in reverse."
            ],
            correctAnswer: 2,
            explanation: "The true vacuum corresponds to a different global minimum of the Higgs field. A new vacuum expectation value means particles would have different masses (or no mass), making atoms, chemistry, and life as we know it impossible."
        },
        {
            question: "Why does the bubble wall of the true vacuum expand at exactly the speed of light?",
            options: [
                "Because photons are pushing it from the inside.",
                "Because the energy difference between the false and true vacua provides an enormous pressure differential that continuously accelerates the bubble wall.",
                "Because it is made of massless gluons.",
                "Because the expansion of the universe pulls it outward."
            ],
            correctAnswer: 1,
            explanation: "The latent heat/energy released by the transition from false to true vacuum provides an overwhelming outward pressure. The bubble wall accelerates indefinitely, and its velocity asymptotically approaches the speed of light (Lorentz factor goes to infinity)."
        },
        {
            question: "If a false vacuum decay were initiated in a distant galaxy, what warning would an observer on Earth receive before being engulfed by the bubble wall?",
            options: [
                "A massive burst of neutrinos.",
                "A gravitational wave signal.",
                "A bright flash of gamma rays.",
                "Absolutely no warning."
            ],
            correctAnswer: 3,
            explanation: "Because the bubble wall expands at the speed of light, no signal (light, gravity, or otherwise) can outpace it. An observer would be destroyed at the exact moment they received any information about the bubble's existence."
        }
    ];

    return { group, parts, description, quizQuestions, animate };
}
