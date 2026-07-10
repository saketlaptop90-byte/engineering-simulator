import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const description = "The Macroscopic Quantum Tunneling Bridge (MQT-Bridge) represents the absolute pinnacle of localized spacetime probability engineering. By projecting an inverted potential energy field and entangling the macroscopic wavefunction of an entire multi-ton reconnaissance rover, the bridge induces a localized probability wave collapse on the distal side of an impenetrable solid energy barrier. This circumvents classical kinematics entirely. The structure features primary and secondary wave-function resonance generators, supercooled fluid manifolds, massive hydraulic phase-anchor pylons, entanglement radiators, and a heavily fortified central control spire, operating in perfect synchronization to maintain delicate phase-coherence.";

    // --- CUSTOM GOD-TIER MATERIALS ---
    const energyGlowBlue = new THREE.MeshStandardMaterial({ color: 0x0033ff, emissive: 0x0022cc, emissiveIntensity: 2.5, metalness: 0.8, roughness: 0.2, transparent: true, opacity: 0.85 });
    const energyGlowPurple = new THREE.MeshStandardMaterial({ color: 0x6600ff, emissive: 0x4400cc, emissiveIntensity: 3.0, metalness: 0.9, roughness: 0.1, transparent: true, opacity: 0.9 });
    const barrierMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xff3300, emissiveIntensity: 4.0, metalness: 0.1, roughness: 0.1, transparent: true, opacity: 0.7, side: THREE.DoubleSide });
    const darkMatterMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, metalness: 1.0, roughness: 0.3 });
    const plasmaCyan = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 5.0, transparent: true, opacity: 0.95 });
    const neonPink = new THREE.MeshStandardMaterial({ color: 0xff00ff, emissive: 0xff0055, emissiveIntensity: 4.0 });
    const ultraChrome = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1.0, roughness: 0.05 });
    const probabilityMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 2.0, transparent: true, opacity: 1.0, wireframe: true });

    // --- ANIMATION STATE TRACKING ---
    const animatedObjects = {
        rings: [],
        pylons: [],
        conduits: [],
        rover: null,
        wheels: [],
        roverMeshes: [],
        barrier: null,
        barrierHex: null,
        reactors: [],
        radarDish: null,
        lasers: []
    };

    // --- PROCEDURAL GENERATION HELPER FUNCTIONS ---
    function createLatheGeometry(points, segments) {
        const pts = points.map(p => new THREE.Vector2(p[0], p[1]));
        return new THREE.LatheGeometry(pts, segments);
    }

    function createCurvedPipe(start, end, midOffset, radius, colorMat) {
        const path = new THREE.CurvePath();
        const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5).add(midOffset);
        const curve1 = new THREE.QuadraticBezierCurve3(start, start.clone().add(midOffset.clone().multiplyScalar(0.5)), midPoint);
        const curve2 = new THREE.QuadraticBezierCurve3(midPoint, end.clone().add(midOffset.clone().multiplyScalar(0.5)), end);
        path.add(curve1);
        path.add(curve2);
        return new THREE.Mesh(new THREE.TubeGeometry(path, 32, radius, 8, false), colorMat);
    }

    // --- BUILDER: PYLON ---
    function buildPylon(index) {
        const pylonGrp = new THREE.Group();
        
        // Base footprint
        const baseGeo = new THREE.CylinderGeometry(12, 18, 10, 16);
        const base = new THREE.Mesh(baseGeo, darkSteel);
        base.position.y = 5;
        pylonGrp.add(base);

        // Main struts
        for(let i=0; i<6; i++) {
            const strut = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 80, 8), steel);
            const angle = (i/6)*Math.PI*2;
            strut.position.set(Math.cos(angle)*8, 40+5, Math.sin(angle)*8);
            pylonGrp.add(strut);
        }

        // Inner glowing core
        const core = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 78, 16), plasmaCyan);
        core.position.y = 45;
        pylonGrp.add(core);
        
        // Core containment rings
        for(let i=0; i<15; i++) {
            const ring = new THREE.Mesh(new THREE.TorusGeometry(5, 0.8, 16, 32), copper);
            ring.rotation.x = Math.PI/2;
            ring.position.y = 10 + i*5;
            pylonGrp.add(ring);
        }
        
        // Emitter Head
        const head = new THREE.Mesh(new THREE.CylinderGeometry(6, 12, 20, 16), darkMatterMat);
        head.position.y = 85 + 10;
        pylonGrp.add(head);

        // Emitter spikes
        const spikeGeo = new THREE.ConeGeometry(1, 15, 8);
        for(let i=0; i<8; i++) {
            const spike = new THREE.Mesh(spikeGeo, energyGlowBlue);
            const angle = (i/8)*Math.PI*2;
            spike.position.set(Math.cos(angle)*5, 100, Math.sin(angle)*5);
            spike.rotation.x = -Math.PI/6 * Math.cos(angle);
            spike.rotation.z = Math.PI/6 * Math.sin(angle);
            pylonGrp.add(spike);
        }

        // Complex Hydraulic side braces
        for(let i=0; i<3; i++) {
            const braceAngle = (i/3)*Math.PI*2;
            
            const braceGrp = new THREE.Group();
            const braceBase = new THREE.Mesh(new THREE.BoxGeometry(6, 6, 20), steel);
            braceBase.position.set(0, 3, 15);
            braceGrp.add(braceBase);
            
            // Outer Cylinder
            const outerCyl = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 25), chrome);
            outerCyl.position.set(0, 15, 10);
            outerCyl.rotation.x = Math.PI/4;
            braceGrp.add(outerCyl);

            // Inner Piston
            const innerPiston = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 25), darkSteel);
            innerPiston.position.set(0, 25, 0);
            innerPiston.rotation.x = Math.PI/4;
            braceGrp.add(innerPiston);
            
            braceGrp.rotation.y = braceAngle;
            pylonGrp.add(braceGrp);
        }

        // Add to parts array tracking
        parts.push({
            name: `Phase Anchor Pylon 0${index+1}`,
            description: `Maintains spatial lock on the multidimensional probability matrix using a supercooled plasma core and complex hydraulic stabilization.`,
            material: "Dark Steel, Chrome, Plasma",
            function: "Probability field confinement",
            assemblyOrder: index + 10,
            connections: ["MQT Barrier Array", "Cooling Manifolds", "Ground Girders"],
            failureEffect: "Localized probability collapse, resulting in the tunneling object partially materializing inside solid rock.",
            cascadeFailures: ["Waveform Destabilization", "Spacetime Rupture"],
            originalPosition: new THREE.Vector3(),
            explodedPosition: new THREE.Vector3(0, index*10 + 50, 0) // Will be updated during assembly
        });

        return pylonGrp;
    }

    // --- BUILDER: CONTROL SPIRE ---
    function buildControlSpire() {
        const spireGrp = new THREE.Group();
        // Massive 15-story building out of boxes, cylinders, tinted glass, balconies
        for(let i=0; i<15; i++) {
            const floorGeo = new THREE.BoxGeometry(25 - i*0.8, 5, 25 - i*0.8);
            const floor = new THREE.Mesh(floorGeo, steel);
            floor.position.y = i * 5;
            spireGrp.add(floor);
            
            // Tinted Windows
            const windowGeo = new THREE.BoxGeometry(24 - i*0.8, 3, 24.5 - i*0.8);
            const windows = new THREE.Mesh(windowGeo, tinted);
            windows.position.y = i * 5;
            spireGrp.add(windows);
            
            // Observation Balcony
            if (i % 4 === 0) {
                const balc = new THREE.Mesh(new THREE.BoxGeometry(28 - i*0.8, 0.8, 28 - i*0.8), darkSteel);
                balc.position.y = i * 5 - 2;
                spireGrp.add(balc);

                // Railings
                const rail = new THREE.Mesh(new THREE.BoxGeometry(28 - i*0.8, 2, 28 - i*0.8), new THREE.MeshStandardMaterial({color: 0x555555, wireframe: true}));
                rail.position.y = i * 5 - 0.5;
                spireGrp.add(rail);
            }
        }
        
        // Top Radar Dome
        const domeHeight = 15 * 5;
        const dome = new THREE.Mesh(new THREE.SphereGeometry(8, 32, 16, 0, Math.PI*2, 0, Math.PI/2), glass);
        dome.position.y = domeHeight;
        spireGrp.add(dome);

        // Rotating Radar dish inside dome
        const dish = new THREE.Mesh(new THREE.CylinderGeometry(5, 0.5, 3, 16), chrome);
        dish.position.y = domeHeight + 1;
        dish.rotation.x = Math.PI/4;
        spireGrp.add(dish);
        animatedObjects.radarDish = dish;

        // Comm Antennas
        for(let i=0; i<4; i++) {
            const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 30), steel);
            antenna.position.set((i%2===0?1:-1) * 6, domeHeight + 15, (i<2?1:-1) * 6);
            spireGrp.add(antenna);
            
            const blinker = new THREE.Mesh(new THREE.SphereGeometry(0.8, 8, 8), neonPink);
            blinker.position.copy(antenna.position);
            blinker.position.y += 15;
            spireGrp.add(blinker);
        }

        parts.push({
            name: "Central Overwatch Control Spire",
            description: "15-story command center coordinating the petabytes of phase-state telemetry required to prevent macroscopic decoherence.",
            material: "Steel, Tinted Glass, Dark Matter Composites",
            function: "Telemetry and Operations",
            assemblyOrder: 1,
            connections: ["Underground Fiber Grid", "Comm Antennas"],
            failureEffect: "Loss of synchronization, resulting in immediate emergency scram of all wave-generators.",
            cascadeFailures: ["Total System Gridlock"],
            originalPosition: new THREE.Vector3(-150, -50, 150),
            explodedPosition: new THREE.Vector3(-250, 0, 250)
        });
        
        return spireGrp;
    }

    // --- BUILDER: WAVEFORM GENERATORS ---
    function buildWaveformGenerators() {
        const genGrp = new THREE.Group();
        
        const ringSpecs = [
            { rad: 80, thick: 4.5, mat: chrome, coils: 48, speed: 0.8, name: "Primary Resonance Ring" },
            { rad: 70, thick: 3.5, mat: darkSteel, coils: 24, speed: -1.2, name: "Phase Conjugator Ring" },
            { rad: 60, thick: 4.0, mat: copper, coils: 36, speed: 1.5, name: "Superconducting Mag-lev Ring" },
            { rad: 50, thick: 2.0, mat: steel, coils: 72, speed: -2.0, name: "High-Frequency Harmonic Ring" },
            { rad: 40, thick: 5.0, mat: darkMatterMat, coils: 12, speed: 0.5, name: "Core Confinement Toroid" }
        ];

        ringSpecs.forEach((spec, rIdx) => {
            const ringMesh = new THREE.Mesh(new THREE.TorusGeometry(spec.rad, spec.thick, 64, 128), spec.mat);
            
            for(let i=0; i<spec.coils; i++) {
                const coil = new THREE.Mesh(new THREE.CylinderGeometry(spec.thick*1.5, spec.thick*1.5, spec.thick*3.5, 16), (i%2===0 ? energyGlowBlue : plasmaCyan));
                coil.rotation.x = Math.PI/2;
                const angle = (i/spec.coils) * Math.PI * 2;
                coil.position.set(Math.cos(angle)*spec.rad, Math.sin(angle)*spec.rad, 0);
                coil.lookAt(new THREE.Vector3(0,0,0));
                ringMesh.add(coil);
            }
            
            // Add particle accelerators on ring
            for(let i=0; i<6; i++) {
                const emitter = new THREE.Mesh(new THREE.BoxGeometry(spec.thick*2.5, spec.thick*2.5, spec.thick*5), steel);
                const angle = (i/6) * Math.PI * 2 + Math.PI/6;
                emitter.position.set(Math.cos(angle)*spec.rad, Math.sin(angle)*spec.rad, 0);
                emitter.lookAt(new THREE.Vector3(0,0,0));
                ringMesh.add(emitter);
            }

            // Offset along Z
            ringMesh.position.z = 20 * rIdx + 20;

            animatedObjects.rings.push({mesh: ringMesh, speed: spec.speed});
            genGrp.add(ringMesh);

            parts.push({
                name: spec.name,
                description: `Generates a localized probability distortion field at ${Math.abs(spec.speed * 100)} THz to envelope the target vessel.`,
                material: "Various Hyper-Alloys",
                function: "Probability Distortion",
                assemblyOrder: 2 + rIdx,
                connections: ["Power Grid", "Adjacent Rings"],
                failureEffect: "Spontaneous creation of anti-matter due to phase-shear.",
                cascadeFailures: ["Complete Facility Vaporization"],
                originalPosition: new THREE.Vector3(0, 0, ringMesh.position.z),
                explodedPosition: new THREE.Vector3(0, spec.rad * 2, ringMesh.position.z)
            });
        });

        return genGrp;
    }

    // --- BUILDER: ENERGY BARRIER ---
    function buildBarrier() {
        const barrierGrp = new THREE.Group();
        const barrierSize = 250;
        
        // Base solid plane
        const wall = new THREE.Mesh(new THREE.BoxGeometry(barrierSize, barrierSize, 10), barrierMat);
        barrierGrp.add(wall);
        
        // Front glowing layers
        const frontGlow1 = new THREE.Mesh(new THREE.BoxGeometry(barrierSize, barrierSize, 14), new THREE.MeshStandardMaterial({color: 0xff0000, emissive: 0xff2200, transparent: true, opacity: 0.5}));
        barrierGrp.add(frontGlow1);
        const frontGlow2 = new THREE.Mesh(new THREE.BoxGeometry(barrierSize, barrierSize, 18), new THREE.MeshStandardMaterial({color: 0xffffff, emissive: 0xff8800, transparent: true, opacity: 0.2}));
        barrierGrp.add(frontGlow2);

        // Intricate hexagon pattern overlay
        const hexGrp = new THREE.Group();
        const hexRadius = 8;
        const dx = hexRadius * Math.sqrt(3);
        const dy = hexRadius * 1.5;
        
        for(let row=-15; row<=15; row++) {
            for(let col=-15; col<=15; col++) {
                const hex = new THREE.Mesh(new THREE.CylinderGeometry(hexRadius-0.5, hexRadius-0.5, 20, 6), darkSteel);
                hex.rotation.x = Math.PI/2;
                hex.rotation.y = Math.PI/2; // align pointy tops
                
                const x = col * dx + (row%2===0 ? 0 : dx/2);
                const y = row * dy;
                
                hex.position.set(x, y, 0);
                
                // Only add if within circular bounds to make it look like a portal
                if (x*x + y*y < 110*110) {
                    // inner energy
                    const inner = new THREE.Mesh(new THREE.CylinderGeometry(hexRadius-2.0, hexRadius-2.0, 21, 6), plasmaCyan);
                    inner.rotation.x = Math.PI/2;
                    inner.rotation.y = Math.PI/2;
                    inner.position.set(x, y, 0);
                    
                    hexGrp.add(inner);
                    hexGrp.add(hex);
                }
            }
        }
        
        barrierGrp.add(hexGrp);
        animatedObjects.barrierHex = hexGrp;

        parts.push({
            name: "Impenetrable Zero-Point Energy Wall",
            description: "A solid wall of compressed spacetime density representing an infinite potential barrier. Uncrossable by classical mechanics.",
            material: "Zero-Point Energy, Dark Steel Hex-Lattice",
            function: "Target Obstacle",
            assemblyOrder: 0,
            connections: ["Dimensional Fabric"],
            failureEffect: "Uncontrolled singularity formation.",
            cascadeFailures: ["Local Solar System Collapse"],
            originalPosition: new THREE.Vector3(0,0,0),
            explodedPosition: new THREE.Vector3(0, -100, 0)
        });
        
        return barrierGrp;
    }

    // --- BUILDER: GROUND REACTORS ---
    function buildPowerGenerators() {
        const powerGrp = new THREE.Group();
        // Huge array of fusion reactors on the ground
        for(let r=0; r<4; r++) {
            for(let c=0; c<4; c++) {
                const reactor = new THREE.Group();
                
                const dome = new THREE.Mesh(new THREE.SphereGeometry(15, 32, 16, 0, Math.PI*2, 0, Math.PI/2), chrome);
                dome.position.y = 0;
                reactor.add(dome);

                const ventGeo = new THREE.CylinderGeometry(2, 2, 25, 16);
                const vent = new THREE.Mesh(ventGeo, darkSteel);
                vent.position.set(10, 12.5, 10);
                reactor.add(vent);
                
                const smokeGlow = new THREE.Mesh(new THREE.SphereGeometry(4, 16, 16), energyGlowPurple);
                smokeGlow.position.set(10, 28, 10);
                reactor.add(smokeGlow);
                
                // Cooling pipes
                const pipe = createCurvedPipe(new THREE.Vector3(-10, 5, 0), new THREE.Vector3(-25, 0, 0), new THREE.Vector3(0, 10, 0), 1.5, copper);
                reactor.add(pipe);

                reactor.position.set(-180 + c*40, -50, -180 + r*40);
                powerGrp.add(reactor);
                animatedObjects.reactors.push(smokeGlow);
            }
        }
        
        parts.push({
            name: "Deuterium Fusion Array",
            description: "16 interconnected fusion reactors supplying the 1.21 Exawatts required to power the MQT phase coils.",
            material: "Chrome, Dark Steel, Plasma",
            function: "Power Generation",
            assemblyOrder: 8,
            connections: ["MQT Pylons", "Waveform Generators"],
            failureEffect: "Total blackout and bridge collapse.",
            cascadeFailures: ["Target Vessel Annihilation"],
            originalPosition: new THREE.Vector3(-120, -50, -120),
            explodedPosition: new THREE.Vector3(-300, -50, -300)
        });

        return powerGrp;
    }

    // --- BUILDER: QUANTUM RECONNAISSANCE ROVER (THE TARGET VESSEL) ---
    function buildRover() {
        const roverGrp = new THREE.Group();
        
        // Main Hull Body
        const hullGeo = new THREE.BoxGeometry(22, 10, 45);
        const hull = new THREE.Mesh(hullGeo, new THREE.MeshStandardMaterial({color: 0xcccccc, metalness: 0.8, roughness: 0.4}));
        hull.position.y = 12;
        roverGrp.add(hull);

        // Front Grille
        const grilleGrp = new THREE.Group();
        const grilleFrame = new THREE.Mesh(new THREE.BoxGeometry(20, 8, 2), darkSteel);
        grilleGrp.add(grilleFrame);
        for(let i=-8; i<=8; i+=2) {
            const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 8), chrome);
            bar.position.set(i, 0, 1);
            grilleGrp.add(bar);
        }
        grilleGrp.position.set(0, 12, 23.5);
        roverGrp.add(grilleGrp);

        // Cab
        const cabGeo = new THREE.BoxGeometry(18, 10, 18);
        const cab = new THREE.Mesh(cabGeo, tinted);
        cab.position.set(0, 22, 8);
        roverGrp.add(cab);

        // Detailed Cab Interior
        const cabInterior = new THREE.Group();
        
        // Steering wheel
        const steeringWheel = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.2, 16, 32), plastic);
        steeringWheel.position.set(-4, -2, 6);
        steeringWheel.rotation.x = Math.PI/4;
        cabInterior.add(steeringWheel);

        // Joysticks
        for(let i=-1; i<=1; i+=2) {
            const joystick = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1.5), steel);
            joystick.position.set(4 + i, -2.5, 6);
            joystick.rotation.x = Math.PI/8;
            cabInterior.add(joystick);
            const joyKnob = new THREE.Mesh(new THREE.SphereGeometry(0.3), neonPink);
            joyKnob.position.set(4 + i, -1.8, 6.3);
            cabInterior.add(joyKnob);
        }

        // Control Panel
        const controlPanel = new THREE.Mesh(new THREE.BoxGeometry(14, 3, 1), darkMatterMat);
        controlPanel.position.set(0, -2.5, 8.5);
        controlPanel.rotation.x = -Math.PI/6;
        cabInterior.add(controlPanel);

        // Glowing Screens
        for(let i=0; i<4; i++) {
            const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 1.5), plasmaCyan);
            screen.position.set(-4.5 + i*3, 0.5, 0.51);
            controlPanel.add(screen);
        }

        cab.add(cabInterior);

        // Side Mirrors
        for(let i=-1; i<=1; i+=2) {
            const mirrorStem = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 3), darkSteel);
            mirrorStem.position.set(i*9.5, 0, 6);
            mirrorStem.rotation.z = -i*Math.PI/4;
            cab.add(mirrorStem);
            
            const mirrorBox = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2, 1.5), chrome);
            mirrorBox.position.set(i*10.8, 1, 6);
            cab.add(mirrorBox);
        }

        // Ladders
        for(let side=-1; side<=1; side+=2) {
            const ladderGrp = new THREE.Group();
            for(let i=0; i<6; i++) {
                const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 3), steel);
                rung.rotation.z = Math.PI/2;
                rung.position.set(0, i*1.5, 0);
                ladderGrp.add(rung);
            }
            const rail1 = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 9), steel);
            rail1.position.set(-1.5, 3.75, 0);
            ladderGrp.add(rail1);
            const rail2 = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 9), steel);
            rail2.position.set(1.5, 3.75, 0);
            ladderGrp.add(rail2);

            ladderGrp.position.set(side*11.2, -5, 0);
            hull.add(ladderGrp);
        }

        // Engine block & Exhaust Stacks
        const engineGeo = new THREE.BoxGeometry(14, 8, 16);
        const engine = new THREE.Mesh(engineGeo, darkSteel);
        engine.position.set(0, 16, -14);
        roverGrp.add(engine);

        for(let i=-1; i<=1; i+=2) {
            const exhaustStack = new THREE.Group();
            const lowerPipe = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 8), chrome);
            lowerPipe.position.y = 4;
            exhaustStack.add(lowerPipe);
            const upperPipe = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 4), chrome);
            upperPipe.position.y = 10;
            exhaustStack.add(upperPipe);
            const flap = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.2), darkSteel);
            flap.position.set(0, 12, 0.5);
            flap.rotation.x = Math.PI/4;
            exhaustStack.add(flap);

            exhaustStack.position.set(i*8, 20, -18);
            roverGrp.add(exhaustStack);
        }

        // Hyper-Realistic Tires (Torus combined with hundreds of BoxGeometry lugs, Cylinder Rims, complex spokes)
        const tirePositions = [
            [-14, 6, 16], [14, 6, 16],
            [-14, 6, -2], [14, 6, -2],
            [-14, 6, -18], [14, 6, -18] // Massive 6x6 Off-Road Drive
        ];

        const tireGeo = new THREE.TorusGeometry(5, 2.5, 32, 128);
        const rimGeo = new THREE.CylinderGeometry(3.5, 3.5, 5, 32);
        const lugGeo = new THREE.BoxGeometry(2, 0.8, 5);
        const lugMat = new THREE.MeshStandardMaterial({color: 0x111111, roughness: 0.9});
        const spokeGeo = new THREE.CylinderGeometry(0.3, 0.3, 7, 16);
        
        tirePositions.forEach(pos => {
            const wheelGrp = new THREE.Group();
            
            // Tire body
            const tire = new THREE.Mesh(tireGeo, lugMat);
            tire.rotation.y = Math.PI/2;
            wheelGrp.add(tire);
            
            // Aggressive off-road lugs (hundreds overall across 6 tires)
            for(let i=0; i<40; i++) {
                const lug = new THREE.Mesh(lugGeo, lugMat);
                const angle = (i/40) * Math.PI * 2;
                lug.position.set(Math.cos(angle)*6.0, Math.sin(angle)*6.0, 0);
                lug.lookAt(new THREE.Vector3(0,0,0));
                
                // Offset alternative lugs for tread pattern
                if(i%2===0) lug.position.z += 1;
                else lug.position.z -= 1;

                tire.add(lug);
            }

            // Rim
            const rim = new THREE.Mesh(rimGeo, chrome);
            rim.rotation.x = Math.PI/2;
            tire.add(rim);

            // Complex Spoke Array
            for(let i=0; i<12; i++) {
                const spoke = new THREE.Mesh(spokeGeo, steel);
                const angle = (i/12) * Math.PI * 2;
                spoke.position.set(Math.cos(angle)*1.75, Math.sin(angle)*1.75, 0);
                spoke.lookAt(new THREE.Vector3(0,0,0));
                spoke.rotation.x += Math.PI/2;
                
                // intricate sub-struts
                const subStrut = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2), copper);
                subStrut.position.set(0, 1.5, 0);
                subStrut.rotation.x = Math.PI/4;
                spoke.add(subStrut);

                tire.add(spoke);
            }

            // Hydraulic Suspension Pistons (Cylinder in Cylinder) connecting wheel to hull
            const suspension = new THREE.Group();
            const susOuter = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 6), darkSteel);
            susOuter.position.set(0, 4, 0);
            suspension.add(susOuter);
            const susInner = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 6), chrome);
            susInner.position.set(0, 8, 0);
            suspension.add(susInner);
            const coil = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.2, 16, 64), copper);
            coil.rotation.x = Math.PI/2;
            for(let c=0; c<8; c++) {
                const coilClone = coil.clone();
                coilClone.position.y = 2 + c*0.8;
                suspension.add(coilClone);
            }
            wheelGrp.add(suspension);

            wheelGrp.position.set(...pos);
            roverGrp.add(wheelGrp);
            
            animatedObjects.wheels.push(tire);
        });

        // Track and isolate all materials in the rover to allow dynamic phase-shifting without affecting global scene materials
        roverGrp.traverse((child) => {
            if (child.isMesh && child.material) {
                child.material = child.material.clone();
                child.material.transparent = true;
                child.material.opacity = 1.0;
                animatedObjects.roverMeshes.push(child);
            }
        });

        parts.push({
            name: "MQT-R6 Heavy Reconnaissance Rover",
            description: "A heavily shielded, all-terrain, 6-wheeled transport vehicle. Features aggressive traction treads, hydraulic suspension, and a pressurized cab for macroscopic tunneling transport.",
            material: "Hyper-Alloys, Titanium, Carbon Composites",
            function: "Payload and Transport",
            assemblyOrder: 15,
            connections: ["Spacetime Continuum"],
            failureEffect: "Loss of crew, vehicle vaporization, and conversion into hawking radiation.",
            cascadeFailures: ["None. The crew just dies."],
            originalPosition: new THREE.Vector3(0, -50, 400),
            explodedPosition: new THREE.Vector3(0, 100, 400)
        });

        return roverGrp;
    }

    // --- SCENE ASSEMBLY ---
    
    // Add Control Spire
    const spire = buildControlSpire();
    spire.position.set(-150, -50, 150);
    group.add(spire);

    // Add Power Generators
    const reactors = buildPowerGenerators();
    group.add(reactors);

    // Add Barrier
    const barrier = buildBarrier();
    barrier.position.set(0, -50, 0);
    group.add(barrier);

    // Add Waveform Generator Rings
    const ringsGrp = buildWaveformGenerators();
    ringsGrp.position.set(0, -50, 0);
    group.add(ringsGrp);

    // Add Anchor Pylons in a massive circle
    for(let i=0; i<8; i++) {
        const pylon = buildPylon(i);
        const angle = (i/8) * Math.PI*2;
        pylon.position.set(Math.cos(angle)*130, -50, Math.sin(angle)*130 + 70); 
        pylon.lookAt(new THREE.Vector3(0, -50, 70));
        group.add(pylon);
        
        // Update parts array originalPosition
        const pylonPart = parts.find(p => p.name === `Phase Anchor Pylon 0${i+1}`);
        if(pylonPart) {
            pylonPart.originalPosition.copy(pylon.position);
            pylonPart.explodedPosition.copy(pylon.position).add(new THREE.Vector3(Math.cos(angle)*80, 50, Math.sin(angle)*80));
        }
    }

    // Structural Girders connecting Pylons
    for(let i=0; i<8; i++) {
        const angle1 = (i/8) * Math.PI*2;
        const angle2 = ((i+1)/8) * Math.PI*2;
        
        const p1 = new THREE.Vector3(Math.cos(angle1)*130, -30, Math.sin(angle1)*130 + 70);
        const p2 = new THREE.Vector3(Math.cos(angle2)*130, -30, Math.sin(angle2)*130 + 70);
        
        const dist = p1.distanceTo(p2);
        const g = new THREE.Mesh(new THREE.BoxGeometry(4, 4, dist), steel);
        
        g.position.copy(p1).lerp(p2, 0.5);
        g.lookAt(p2);
        
        group.add(g);
    }

    // Add The Rover
    const rover = buildRover();
    rover.position.set(0, -50, 400); // starts far away
    group.add(rover);
    animatedObjects.rover = rover;


    // --- ADVANCED PHD-LEVEL QUIZ QUESTIONS ---
    const quizQuestions = [
        {
            question: "In the framework of the WKB (Wentzel–Kramers–Brillouin) approximation, how does the transmission coefficient for a macroscopic object tunneling through a rectangular potential barrier scale with the object's mass (M) and the barrier width (a)?",
            options: [
                "Proportional to exp(-M * a)",
                "Proportional to exp(-sqrt(M) * a)",
                "Proportional to exp(-M * a^2)",
                "Inversely proportional to M * a"
            ],
            correctAnswerIndex: 1,
            explanation: "The WKB transmission probability T scales as exp(-2 * integral(sqrt(2M(V-E))/hbar dx)). Therefore, the exponent is directly proportional to the square root of the mass and linearly proportional to the barrier width a."
        },
        {
            question: "When analyzing Macroscopic Quantum Tunneling (MQT) in superconducting quantum interference devices (SQUIDs), what role does environmental dissipation play according to the Caldeira-Leggett model?",
            options: [
                "It exponentially enhances the tunneling rate by providing thermal kicks.",
                "It exponentially suppresses the tunneling rate by increasing the effective Euclidean action.",
                "It has no effect on the tunneling rate strictly at zero temperature.",
                "It introduces purely imaginary phase oscillations without altering the decay envelope."
            ],
            correctAnswerIndex: 1,
            explanation: "The Caldeira-Leggett model demonstrates that coupling to an environment (a bath of harmonic oscillators) introduces friction, which increases the effective action in the path integral formulation, thereby exponentially suppressing the tunneling rate."
        },
        {
            question: "The 'Hartman effect' in quantum tunneling paradoxically implies that for sufficiently thick opaque barriers, the tunneling time (as measured by the phase time of a transmitted wave packet) becomes:",
            options: [
                "Exponentially large, strictly preventing macroscopic tunneling.",
                "Zero, indicating infinite localized velocity.",
                "Independent of the barrier thickness, suggesting an apparent superluminal effective group velocity.",
                "Directly proportional to the barrier width squared, consistent with classical diffusion."
            ],
            correctAnswerIndex: 2,
            explanation: "The Hartman effect occurs when the phase time for a tunneling particle asymptotes to a constant value as the barrier width increases. This implies that for a wide enough barrier, the effective speed exceeds the speed of light, though it cannot be used to transmit information superluminally."
        },
        {
            question: "In the instanton formulation of macroscopic quantum tunneling, what does the 'instanton' mathematically represent?",
            options: [
                "A real-time classical trajectory of the particle oscillating in a well.",
                "A classical solution to the equations of motion formulated in imaginary time (Euclidean spacetime).",
                "A localized topological defect in the electromagnetic zero-point field.",
                "A virtual particle mediating the tunneling force via gauge boson exchange."
            ],
            correctAnswerIndex: 1,
            explanation: "An instanton is a non-perturbative solution to the classical equations of motion in imaginary time (t -> i * tau). It corresponds to the path of least Euclidean action connecting two classical vacua, dominating the path integral for the tunneling amplitude."
        },
        {
            question: "Why is macroscopic quantum tunneling incredibly rare or virtually impossible for everyday, room-temperature objects, independent of environmental decoherence?",
            options: [
                "Everyday objects lack a defined wavefunction due to relativistic mass bounds.",
                "The de Broglie wavelength of a macroscopic object is far larger than typical barrier widths.",
                "The required quantum action is astronomically large, making the tunneling probability scale as e^(-10^30) or worse.",
                "The gravitational binding energy of the object exceeds the strong nuclear force of the barrier."
            ],
            correctAnswerIndex: 2,
            explanation: "For macroscopic objects, the mass M is roughly ~10^26 times larger than an electron. Since the WKB exponent scales with sqrt(M), the negative exponent becomes massively huge, driving the tunneling probability to effectively absolute zero."
        }
    ];

    // --- COMPLEX ANIMATION LOGIC (STATE MACHINE) ---
    let tunnelState = 0;
    let tunnelProgress = 0;
    
    // Z-coordinates for the rover's journey
    const shipStartZ = 350;
    const shipBarrierZ = 120;
    const shipExitZ = -120;
    const shipEndZ = -350;

    function animate(time, speed, meshes) {
        const t = time * speed;
        
        // Always rotate radar dish
        if (animatedObjects.radarDish) {
            animatedObjects.radarDish.rotation.y += 0.05 * speed;
        }

        // Always pulse reactors
        if (animatedObjects.reactors.length > 0) {
            const scale = 1.0 + Math.sin(t * 5) * 0.2;
            animatedObjects.reactors.forEach(r => {
                r.scale.set(scale, scale, scale);
                r.material.emissiveIntensity = 3.0 + Math.sin(t * 10) * 2;
            });
        }

        // Rotate Hex Barrier
        if (animatedObjects.barrierHex) {
            animatedObjects.barrierHex.rotation.z = Math.sin(t * 0.5) * 0.05; // slight wobble
        }

        // Rotate Generators based on state
        const ringMultiplier = (tunnelState === 1 || tunnelState === 2) ? 10 : (tunnelState === 3 ? 20 : 1);
        animatedObjects.rings.forEach(ringObj => {
            ringObj.mesh.rotation.z += ringObj.speed * 0.01 * speed * ringMultiplier;
        });

        if (!animatedObjects.rover) return;
        const rover = animatedObjects.rover;
        
        // Rotate tires if moving
        if (tunnelState === 0 || tunnelState === 1 || tunnelState === 4 || tunnelState === 5) {
            animatedObjects.wheels.forEach(w => w.rotation.z += 0.1 * speed);
            // Engine vibration
            rover.position.y = -50 + Math.random() * 0.5;
        } else {
            rover.position.y = -50;
        }

        // TUNNELING STATE MACHINE
        if (tunnelState === 0) { 
            // STATE 0: Approach
            rover.position.z -= 0.8 * speed;
            if(rover.position.z < shipBarrierZ) {
                tunnelState = 1; 
                tunnelProgress = 0;
            }
        } else if (tunnelState === 1) { 
            // STATE 1: Spool up Generators, slow down rover
            rover.position.z -= 0.2 * speed;
            tunnelProgress += 0.01 * speed;
            
            if(tunnelProgress >= 1) {
                tunnelState = 2; 
                tunnelProgress = 0;
            }
        } else if (tunnelState === 2) { 
            // STATE 2: Wavefunction Dissolution (Probability smear)
            rover.position.z -= 0.05 * speed;
            
            // Rover vibrating violently as probability wave smears
            rover.position.x = (Math.random() - 0.5) * tunnelProgress * 15;
            rover.position.y = -50 + (Math.random() - 0.5) * tunnelProgress * 15;
            
            tunnelProgress += 0.005 * speed; // Slow dissolution
            
            // Phase shift materials to wireframe and glowing energy
            animatedObjects.roverMeshes.forEach(m => {
                m.opacity = 1.0 - tunnelProgress;
                m.wireframe = tunnelProgress > 0.4;
                m.emissive = new THREE.Color(0x00ffff);
                m.emissiveIntensity = tunnelProgress * 10;
            });

            if(tunnelProgress >= 1) {
                tunnelState = 3; 
            }
        } else if (tunnelState === 3) { 
            // STATE 3: The Quantum Tunnel (Instantaneous mapping)
            rover.position.z = shipExitZ;
            rover.position.x = 0;
            rover.position.y = -50;
            tunnelState = 4;
            tunnelProgress = 0;
        } else if (tunnelState === 4) { 
            // STATE 4: Reconstitute on the other side
            rover.position.z -= 0.1 * speed;
            tunnelProgress += 0.01 * speed;
            
            // Re-solidify materials
            animatedObjects.roverMeshes.forEach(m => {
                m.opacity = tunnelProgress;
                m.wireframe = tunnelProgress < 0.6;
                m.emissiveIntensity = (1.0 - tunnelProgress) * 10;
                if(tunnelProgress >= 0.95) {
                    m.emissive = new THREE.Color(0x000000); // reset
                }
            });

            if(tunnelProgress >= 1) {
                tunnelState = 5;
            }
        } else if (tunnelState === 5) { 
            // STATE 5: Depart
            rover.position.z -= 0.8 * speed;
            
            if(rover.position.z < shipEndZ) {
                tunnelState = 0; // Reset loop
                rover.position.z = shipStartZ;
                
                // Ensure materials are perfectly reset
                animatedObjects.roverMeshes.forEach(m => {
                    m.opacity = 1.0;
                    m.wireframe = false;
                    m.emissive = new THREE.Color(0x000000);
                    m.emissiveIntensity = 0;
                });
            }
        }
    }

    return { group, parts, description, quizQuestions, animate };
}
