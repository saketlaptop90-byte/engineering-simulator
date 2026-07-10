import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // --- CUSTOM HIGHEST-TECH MATERIALS ---
    const darkEnergyMat = new THREE.MeshStandardMaterial({
        color: 0x050011,
        emissive: 0x4a0088,
        emissiveIntensity: 5.0,
        roughness: 0.0,
        metalness: 1.0,
        wireframe: false,
        transparent: true,
        opacity: 0.95
    });

    const darkEnergyFluidMat = new THREE.MeshPhysicalMaterial({
        color: 0x110033,
        emissive: 0x8800ff,
        emissiveIntensity: 8.0,
        roughness: 0.1,
        metalness: 0.9,
        transmission: 0.9,
        thickness: 2.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const spaceGridMat = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.4,
        wireframe: true
    });

    const neonPurple = new THREE.MeshStandardMaterial({
        color: 0x8800ff,
        emissive: 0x8800ff,
        emissiveIntensity: 3.0,
    });

    const neonCyan = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2.0,
    });

    const hyperChrome = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.05,
        metalness: 1.0,
        envMapIntensity: 2.0
    });
    
    const heavilyArmoredPlating = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.8,
        metalness: 0.7,
        bumpScale: 0.02
    });

    // We'll store animatable references in meshes object
    meshes.pumpPistons = [];
    meshes.pumpCylinders = [];
    meshes.vortexRings = [];
    meshes.vortexCore = null;
    meshes.spaceGridNodes = [];
    meshes.spaceGridLines = [];
    meshes.fluidStreams = [];
    meshes.containmentGears = [];
    meshes.heatSinkFins = [];
    meshes.hydraulicRods = [];
    meshes.valves = [];
    meshes.energyPulses = [];

    // ==========================================
    // SUB-SYSTEM: MASSIVE ARMORED BASE PLATFORM
    // ==========================================
    const buildBasePlatform = () => {
        const baseGroup = new THREE.Group();
        
        // Main Octagonal Base
        const shape = new THREE.Shape();
        const size = 120;
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const x = Math.cos(angle) * size;
            const y = Math.sin(angle) * size;
            if (i === 0) shape.moveTo(x, y);
            else shape.lineTo(x, y);
        }
        shape.closePath();

        const extrudeSettings = {
            depth: 15,
            bevelEnabled: true,
            bevelSegments: 5,
            steps: 2,
            bevelSize: 2,
            bevelThickness: 3
        };

        const baseGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
        baseMesh.rotation.x = -Math.PI / 2;
        baseMesh.position.y = -15;
        baseMesh.receiveShadow = true;
        baseGroup.add(baseMesh);

        // Add 8 huge support anchors
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2 + (Math.PI / 8);
            const anchorGeo = new THREE.BoxGeometry(20, 30, 20);
            const anchor = new THREE.Mesh(anchorGeo, heavilyArmoredPlating);
            anchor.position.set(Math.cos(angle) * 115, 0, Math.sin(angle) * 115);
            anchor.lookAt(0, 0, 0);
            baseGroup.add(anchor);

            // Anchor detailing (rivets and lights)
            const lightGeo = new THREE.CylinderGeometry(2, 2, 21, 16);
            const light = new THREE.Mesh(lightGeo, neonPurple);
            light.rotation.z = Math.PI / 2;
            light.position.set(0, 10, 10.5);
            anchor.add(light);
        }

        group.add(baseGroup);

        parts.push({
            name: "Goliath Armored Base",
            description: "A supermassive octagonal foundation reinforced with depleted uranium plating to withstand the extreme gravitational shear caused by dark energy fluid dynamics.",
            material: "Dark Steel / Armor Plating",
            function: "Anchors the entire God-Tier pumping system to the bedrock, preventing dimensional slippage.",
            assemblyOrder: 1,
            connections: ["Geodesic Stabilizers", "Primary Coolant Manifolds"],
            failureEffect: "Complete structural collapse, causing the dimensional tear to swallow the facility.",
            cascadeFailures: ["Containment Rings", "Hydraulic Arrays"],
            originalPosition: { x: 0, y: -15, z: 0 },
            explodedPosition: { x: 0, y: -50, z: 0 }
        });
    };

    // ==========================================
    // SUB-SYSTEM: CENTRAL ENERGY REACTOR & VORTEX
    // ==========================================
    const buildCentralReactor = () => {
        const reactorGroup = new THREE.Group();

        // Reactor Housing - Lathed geometry
        const points = [];
        for (let i = 0; i <= 20; i++) {
            const t = i / 20;
            points.push(new THREE.Vector2(Math.sin(t * Math.PI) * 30 + 10, (t * 80) - 40));
        }
        const housingGeo = new THREE.LatheGeometry(points, 64);
        const housing = new THREE.Mesh(housingGeo, chrome);
        housing.position.y = 40;
        reactorGroup.add(housing);

        // The actual space tear / dark energy core
        const coreGeo = new THREE.IcosahedronGeometry(18, 4);
        const core = new THREE.Mesh(coreGeo, darkEnergyFluidMat);
        core.position.y = 80;
        reactorGroup.add(core);
        meshes.vortexCore = core;

        // Nested intricate Torus knots around the core
        for(let i=0; i<3; i++) {
            const knotGeo = new THREE.TorusKnotGeometry(25 + i*5, 1.5 - i*0.3, 200, 32, 3+i, 4+i);
            const knot = new THREE.Mesh(knotGeo, i%2===0 ? neonPurple : neonCyan);
            knot.position.y = 80;
            reactorGroup.add(knot);
            meshes.vortexRings.push(knot);
        }

        // Inner Containment Cylinder
        const containGeo = new THREE.CylinderGeometry(35, 35, 100, 32, 1, true);
        const contain = new THREE.Mesh(containGeo, new THREE.MeshPhysicalMaterial({
            color: 0xffffff, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1, side: THREE.DoubleSide
        }));
        contain.position.y = 60;
        reactorGroup.add(contain);

        group.add(reactorGroup);

        parts.push({
            name: "Dimensional Tear Reactor Core",
            description: "The heart of the facility where the vacuum of space is literally wrenched apart to allow raw dark energy to condense into a pumpable fluid state.",
            material: "Hyper-Chrome / Exotic Dark Energy Fluid",
            function: "Condenses vacuum energy into a physical state through extreme localized gravitational manipulation.",
            assemblyOrder: 5,
            connections: ["Dark Energy Mainlines", "Vortex Containment Field"],
            failureEffect: "Uncontrolled expansion of the universe at a localized point, tearing the solar system apart.",
            cascadeFailures: ["Space Grid Fabric", "Everything"],
            originalPosition: { x: 0, y: 80, z: 0 },
            explodedPosition: { x: 0, y: 150, z: 0 }
        });
    };

    // ==========================================
    // SUB-SYSTEM: MASSIVE HYDRAULIC PUMPS
    // ==========================================
    const buildPumps = () => {
        const numPumps = 12;
        const radius = 60;

        for (let i = 0; i < numPumps; i++) {
            const angle = (i / numPumps) * Math.PI * 2;
            const pumpGroup = new THREE.Group();
            
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            pumpGroup.position.set(x, 20, z);
            
            // Point pump towards the center
            pumpGroup.lookAt(0, 80, 0);

            // Cylinder base
            const cylGeo = new THREE.CylinderGeometry(8, 8, 50, 32);
            cylGeo.translate(0, 25, 0);
            const cyl = new THREE.Mesh(cylGeo, steel);
            cyl.rotation.x = Math.PI / 2; // point along Z
            pumpGroup.add(cyl);
            meshes.pumpCylinders.push(cyl);

            // Detailing on cylinder
            const ringGeo = new THREE.TorusGeometry(8.5, 1, 16, 32);
            for(let r=0; r<5; r++) {
                const ring = new THREE.Mesh(ringGeo, copper);
                ring.position.z = 10 + r * 8;
                pumpGroup.add(ring);
            }

            // Piston Rod
            const rodGeo = new THREE.CylinderGeometry(4, 4, 60, 32);
            rodGeo.translate(0, 30, 0);
            const rod = new THREE.Mesh(rodGeo, chrome);
            rod.rotation.x = Math.PI / 2;
            pumpGroup.add(rod);
            
            // Piston Head
            const headGeo = new THREE.CylinderGeometry(7.5, 7.5, 5, 32);
            const head = new THREE.Mesh(headGeo, darkSteel);
            head.position.y = 60;
            rod.add(head);

            // Energy fluid tube exiting pump
            const tubeGeo = new THREE.CylinderGeometry(2, 2, 80, 16);
            const tube = new THREE.Mesh(tubeGeo, darkEnergyMat);
            tube.position.z = -20;
            pumpGroup.add(tube);

            meshes.pumpPistons.push({
                rod: rod,
                baseZ: rod.position.z,
                phase: i * (Math.PI * 2 / numPumps)
            });

            group.add(pumpGroup);
        }

        parts.push({
            name: "Hyper-Hydraulic Injection Pumps",
            description: "A ring of 12 colossally scaled hydraulic pumps utilizing frictionless chrome pistons to forcefully inject dark fluid into the spacetime fabric.",
            material: "Forged Steel / Titanium-Chrome Alloy",
            function: "Pressurizes the dark energy fluid to millions of atmospheres before injection.",
            assemblyOrder: 3,
            connections: ["Base Platform", "Injection Nozzle Network"],
            failureEffect: "Backflow of dark energy, causing explosive decompression of local spacetime.",
            cascadeFailures: ["Cooling Towers"],
            originalPosition: { x: radius, y: 20, z: 0 },
            explodedPosition: { x: radius*2, y: 20, z: 0 }
        });
    };

    // ==========================================
    // SUB-SYSTEM: PIPING & CABLING NETWORK
    // ==========================================
    const buildPipes = () => {
        const pipeGroup = new THREE.Group();
        const pipeMat = copper;
        const pipeMat2 = steel;

        // Generate a chaotic but beautiful network of pipes
        for(let i=0; i<40; i++) {
            const points = [];
            const startRadius = 80 + Math.random() * 40;
            const angle = Math.random() * Math.PI * 2;
            
            let curX = Math.cos(angle) * startRadius;
            let curZ = Math.sin(angle) * startRadius;
            let curY = 0;

            points.push(new THREE.Vector3(curX, curY, curZ));
            
            for(let j=0; j<4; j++) {
                curY += 20 + Math.random() * 30;
                curX += (Math.random() - 0.5) * 30;
                curZ += (Math.random() - 0.5) * 30;
                points.push(new THREE.Vector3(curX, curY, curZ));
            }
            
            // Connect to central reactor at the top
            points.push(new THREE.Vector3(Math.cos(angle)*30, 80 + Math.random()*20, Math.sin(angle)*30));

            const curve = new THREE.CatmullRomCurve3(points);
            const tubeGeo = new THREE.TubeGeometry(curve, 64, 1.5 + Math.random()*2, 8, false);
            const tube = new THREE.Mesh(tubeGeo, Math.random() > 0.5 ? pipeMat : pipeMat2);
            pipeGroup.add(tube);
        }

        // Add some glowing energy transfer pipes
        for(let i=0; i<15; i++) {
            const points = [];
            const angle = (i/15) * Math.PI * 2;
            points.push(new THREE.Vector3(Math.cos(angle)*100, -10, Math.sin(angle)*100));
            points.push(new THREE.Vector3(Math.cos(angle)*50, 40, Math.sin(angle)*50));
            points.push(new THREE.Vector3(0, 110, 0)); // Feed to top

            const curve = new THREE.CatmullRomCurve3(points);
            const tubeGeo = new THREE.TubeGeometry(curve, 64, 2, 16, false);
            const tube = new THREE.Mesh(tubeGeo, neonCyan);
            pipeGroup.add(tube);
            meshes.fluidStreams.push({ mesh: tube, curve: curve });
        }

        group.add(pipeGroup);

        parts.push({
            name: "Superconducting Fluid Conduits",
            description: "A labyrinthine network of copper and steel tubes woven seamlessly around the core to transfer cryo-cooled dark fluid at relativistic speeds.",
            material: "Superconducting Copper / High-Tensile Steel",
            function: "Circulation of dark energy, coolant, and hydraulic fluids.",
            assemblyOrder: 4,
            connections: ["Hydraulic Pumps", "Reactor Core"],
            failureEffect: "Severe leaking of dark fluid, rapidly accelerating the aging of anything it touches.",
            cascadeFailures: ["Pump Integrity"],
            originalPosition: { x: 0, y: 50, z: 0 },
            explodedPosition: { x: 0, y: 50, z: 80 }
        });
    };

    // ==========================================
    // SUB-SYSTEM: THE SPACE GRID (Spacetime Expansion Vis)
    // ==========================================
    const buildSpaceGrid = () => {
        const gridGroup = new THREE.Group();
        gridGroup.position.y = 120; // Hovering above the reactor

        const gridSize = 10;
        const spacing = 15;
        const offset = (gridSize * spacing) / 2;

        for(let x=0; x<=gridSize; x++) {
            for(let y=0; y<=gridSize; y++) {
                for(let z=0; z<=gridSize; z++) {
                    const posX = (x * spacing) - offset;
                    const posY = (y * spacing) - offset;
                    const posZ = (z * spacing) - offset;
                    
                    // Node
                    const distToCenter = Math.sqrt(posX*posX + posY*posY + posZ*posZ);
                    if(distToCenter < 120) {
                        const nodeGeo = new THREE.SphereGeometry(1, 8, 8);
                        const node = new THREE.Mesh(nodeGeo, neonPurple);
                        node.position.set(posX, posY, posZ);
                        
                        meshes.spaceGridNodes.push({
                            mesh: node,
                            ox: posX, oy: posY, oz: posZ,
                            dist: distToCenter
                        });
                        gridGroup.add(node);
                    }
                }
            }
        }

        // Lines connecting nodes (just an abstract wireframe sphere instead of exhaustive lines to save performance, but we make it look complex)
        const wireSphereGeo = new THREE.IcosahedronGeometry(70, 4);
        const wireSphere = new THREE.Mesh(wireSphereGeo, spaceGridMat);
        gridGroup.add(wireSphere);
        meshes.spaceGridLines.push(wireSphere);

        group.add(gridGroup);

        parts.push({
            name: "Spacetime Localized Manifold Grid",
            description: "A synthetic projection of the local spacetime metric. As dark energy is pumped in, the grid physically expands, demonstrating the tearing of the cosmic fabric.",
            material: "Holographic Photonic Mesh",
            function: "Measures and visualizes the artificial cosmological constant induced by the pump.",
            assemblyOrder: 6,
            connections: ["Reactor Core"],
            failureEffect: "Loss of metric telemetry; pump may accidentally trigger a false vacuum decay.",
            cascadeFailures: ["None"],
            originalPosition: { x: 0, y: 120, z: 0 },
            explodedPosition: { x: 0, y: 250, z: 0 }
        });
    };

    // ==========================================
    // SUB-SYSTEM: OPERATOR CONTROL CABINS
    // ==========================================
    const buildControlCabins = () => {
        for(let i=0; i<4; i++) {
            const angle = (i/4) * Math.PI * 2 + (Math.PI/4);
            const cabGroup = new THREE.Group();
            
            cabGroup.position.set(Math.cos(angle)*90, 5, Math.sin(angle)*90);
            cabGroup.lookAt(0, 5, 0);

            // Main Cabin Body
            const bodyGeo = new THREE.BoxGeometry(15, 12, 12);
            const body = new THREE.Mesh(bodyGeo, aluminum);
            cabGroup.add(body);

            // Tinted Windows
            const windowGeo = new THREE.BoxGeometry(16, 6, 13);
            const win = new THREE.Mesh(windowGeo, tinted);
            win.position.y = 2;
            cabGroup.add(win);

            // Antennas
            const antGeo = new THREE.CylinderGeometry(0.2, 0.2, 10);
            const ant = new THREE.Mesh(antGeo, chrome);
            ant.position.set(5, 10, -3);
            cabGroup.add(ant);

            // Display Screens inside (glowing)
            const screenGeo = new THREE.PlaneGeometry(8, 4);
            const screen = new THREE.Mesh(screenGeo, neonCyan);
            screen.position.set(0, 2, 5.5);
            screen.rotation.y = Math.PI; // face inward
            cabGroup.add(screen);

            group.add(cabGroup);
        }

        parts.push({
            name: "Telemetry & Operation Bunkers",
            description: "Heavily shielded, multi-station control cabins where PhD cosmologists and engineers monitor the equation of state of the localized vacuum.",
            material: "Aluminum / Lead / Tinted Plasteel",
            function: "Houses the lifeforms insane enough to operate a God-Tier Dark Energy Pump.",
            assemblyOrder: 2,
            connections: ["Base Platform", "Sensor Relays"],
            failureEffect: "Lethal exposure to Hawking radiation and chronological distortion.",
            cascadeFailures: ["Operator Sanity"],
            originalPosition: { x: 90, y: 5, z: 0 },
            explodedPosition: { x: 150, y: 5, z: 0 }
        });
    };

    // ==========================================
    // SUB-SYSTEM: MASSIVE RADIATORS/HEAT SINKS
    // ==========================================
    const buildHeatSinks = () => {
        const radiatorGroup = new THREE.Group();

        for(let i=0; i<8; i++) {
            const angle = (i/8) * Math.PI * 2;
            const sinkGroup = new THREE.Group();
            sinkGroup.position.set(Math.cos(angle)*70, 0, Math.sin(angle)*70);
            sinkGroup.lookAt(0, 0, 0);

            // Fins
            for(let f=0; f<20; f++) {
                const finGeo = new THREE.BoxGeometry(2, 30, 15);
                const fin = new THREE.Mesh(finGeo, darkSteel);
                fin.position.set(f*1.5 - 15, 15, 0);
                sinkGroup.add(fin);
                meshes.heatSinkFins.push(fin);
            }

            // Glowing heat pipe
            const pipeGeo = new THREE.CylinderGeometry(2, 2, 30, 16);
            const pipe = new THREE.Mesh(pipeGeo, new THREE.MeshStandardMaterial({color: 0xff3300, emissive: 0xff1100, emissiveIntensity: 2}));
            pipe.rotation.z = Math.PI/2;
            pipe.position.set(0, 5, 8);
            sinkGroup.add(pipe);

            radiatorGroup.add(sinkGroup);
        }

        group.add(radiatorGroup);

        parts.push({
            name: "Entropy Expulsion Radiators",
            description: "Towering arrays of thermally conductive fins designed to vent the astronomical heat generated by violating the laws of thermodynamics.",
            material: "Graphene-infused Dark Steel",
            function: "Radiates excess thermal energy out of the system.",
            assemblyOrder: 3,
            connections: ["Coolant Conduits", "Base Platform"],
            failureEffect: "Thermal runaway leading to an localized micro-supernova.",
            cascadeFailures: ["Everything"],
            originalPosition: { x: 70, y: 0, z: 0 },
            explodedPosition: { x: 120, y: -20, z: 0 }
        });
    };

    // ==========================================
    // EXECUTING BUILD FUNCTIONS
    // ==========================================
    buildBasePlatform();
    buildHeatSinks();
    buildPumps();
    buildPipes();
    buildCentralReactor();
    buildSpaceGrid();
    buildControlCabins();

    // ==========================================
    // ADDITIONAL MICRO DETAILS (RIVETS, GEARS, PARTICLES)
    // ==========================================
    const buildMicroDetails = () => {
        // A huge ring gear turning at the base of the reactor
        const gearGeo = new THREE.TorusGeometry(45, 3, 16, 64);
        const gear = new THREE.Mesh(gearGeo, steel);
        gear.position.y = 35;
        gear.rotation.x = Math.PI/2;
        
        // Gear teeth
        for(let i=0; i<64; i++) {
            const toothGeo = new THREE.BoxGeometry(4, 4, 8);
            const tooth = new THREE.Mesh(toothGeo, chrome);
            const angle = (i/64) * Math.PI * 2;
            tooth.position.set(Math.cos(angle)*45, 0, Math.sin(angle)*45);
            tooth.rotation.y = -angle;
            gear.add(tooth);
        }
        
        group.add(gear);
        meshes.containmentGears.push(gear);

        // Venting particles (energy pulses)
        for(let i=0; i<30; i++) {
            const pulseGeo = new THREE.CylinderGeometry(0.5, 0.5, 10, 8);
            const pulse = new THREE.Mesh(pulseGeo, neonPurple);
            pulse.position.set((Math.random()-0.5)*100, Math.random()*150, (Math.random()-0.5)*100);
            pulse.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
            group.add(pulse);
            meshes.energyPulses.push({
                mesh: pulse,
                speed: Math.random() * 2 + 1,
                originY: pulse.position.y
            });
        }
    };
    buildMicroDetails();

    const description = "The God-Tier Dark Energy Pump is an impossibly complex, colossal cosmological engineering marvel. It is designed to extract, condense, and pressurize the vacuum energy of the universe (Dark Energy) into a fluid state, and then forcefully inject it back into localized coordinates of spacetime. By doing so, it artificially inflates space, pushing galaxies apart at an accelerated rate from a single point. It features heavily armored base platforms, 12 hyper-hydraulic injector pumps, superconducting fluid conduits, and a projected holographic metric grid to monitor the literal tearing of the space-time continuum.";

    const quizQuestions = [
        {
            question: "The observed accelerating expansion of the universe is often attributed to dark energy. In the standard ΛCDM cosmological model, what is the equation of state parameter 'w' for dark energy, and what does it imply about its energy density as the universe expands?",
            options: [
                "w = 0, energy density decreases proportionally with volume.",
                "w = -1, energy density remains strictly constant regardless of cosmic expansion.",
                "w = 1/3, energy density scales equivalently to relativistic radiation.",
                "w < -1, energy density increases with time, leading to a Big Rip."
            ],
            answer: 1,
            explanation: "In the ΛCDM model, dark energy is a cosmological constant (Λ) with an equation of state w = -1. This means its pressure is equal to the negative of its energy density, causing the energy density to remain perfectly constant even as the volume of the universe increases."
        },
        {
            question: "If this pump were to malfunction and inject 'Phantom Energy' into the local vacuum, driving the equation of state parameter w to be strictly less than -1 (w < -1), what is the ultimate theoretical fate of the universe in this localized region?",
            options: [
                "The Big Crunch",
                "The Big Bounce",
                "The Big Rip",
                "Thermal Equilibrium (Heat Death)"
            ],
            answer: 2,
            explanation: "Phantom energy (w < -1) possesses an energy density that grows as the universe expands. This causes the expansion rate to accelerate to infinity in a finite amount of time, tearing apart galaxies, stars, planets, and eventually atoms themselves in a scenario known as the Big Rip."
        },
        {
            question: "The pump utilizes advanced sensors to calibrate against the Cosmological Constant Problem. This problem refers to the massive discrepancy between the theoretical calculation of vacuum zero-point energy from quantum field theory and the observed value of dark energy density. By approximately what immense factor do these two values differ?",
            options: [
                "10^10",
                "10^40",
                "10^120",
                "10^500"
            ],
            answer: 2,
            explanation: "Quantum field theory predicts a vacuum energy density that is approximately 10^120 times larger than the extremely small, positive value observed via cosmology. This 120-order-of-magnitude discrepancy is widely considered one of the worst theoretical predictions in the history of physics."
        },
        {
            question: "To accurately target the injection coordinates, the pump operators must map the expansion history of the universe using 'standard rulers'. Which of the following cosmological phenomena provides a highly precise standard ruler based on primordial sound waves frozen in the distribution of galaxies?",
            options: [
                "Type Ia Supernovae",
                "Baryon Acoustic Oscillations (BAO)",
                "Gravitational Lensing",
                "The Sachs-Wolfe Effect"
            ],
            answer: 1,
            explanation: "Baryon Acoustic Oscillations (BAO) are regular, periodic fluctuations in the density of the visible baryonic matter of the universe. They originated as acoustic density waves in the primordial plasma. Their characteristic length scale provides a 'standard ruler' to measure the universe's expansion history."
        },
        {
            question: "Suppose the operators decide to switch the pump's configuration from a Cosmological Constant (Λ) to a 'Quintessence' field. How does a Quintessence model fundamentally differ from a standard Cosmological Constant?",
            options: [
                "Quintessence is a static tensor field that only acts on dark matter.",
                "Quintessence is a dynamic scalar field whose equation of state and energy density can vary over time.",
                "Quintessence requires a modification of General Relativity rather than introducing a new energy component.",
                "Quintessence inherently possesses a positive pressure, decelerating expansion."
            ],
            answer: 1,
            explanation: "Quintessence models introduce a scalar field that evolves dynamically over cosmic time. Unlike the cosmological constant which has a fixed w = -1 and constant energy density, the energy density and equation of state of a quintessence field can change."
        }
    ];

    // ==========================================
    // HYPER-COMPLEX ANIMATION LOGIC
    // ==========================================
    const animate = (time, speed, meshesObj) => {
        // Ensure meshesObj was passed, otherwise use our internal closure
        const m = meshesObj || meshes;
        const adjustedSpeed = speed * 1.5;

        // 1. Pump Pistons oscillating with phase
        if (m.pumpPistons) {
            m.pumpPistons.forEach((piston, index) => {
                // Sine wave based on time + unique phase offset
                const offset = Math.sin(time * 2.5 * adjustedSpeed + piston.phase) * 15;
                piston.rod.position.z = piston.baseZ + offset;
            });
        }

        // 2. Central Vortex Rings rotating chaotically
        if (m.vortexRings) {
            m.vortexRings.forEach((ring, index) => {
                ring.rotation.x += 0.01 * adjustedSpeed * (index + 1);
                ring.rotation.y -= 0.015 * adjustedSpeed * (index + 1);
                ring.rotation.z += 0.005 * adjustedSpeed;
                
                // Pulse thickness/scale
                const s = 1 + Math.sin(time * 4 + index) * 0.1;
                ring.scale.set(s, s, s);
            });
        }

        // 3. Vortex Core pulsing and rotating
        if (m.vortexCore) {
            m.vortexCore.rotation.y += 0.05 * adjustedSpeed;
            m.vortexCore.rotation.z += 0.02 * adjustedSpeed;
            const coreScale = 1 + Math.sin(time * 6 * adjustedSpeed) * 0.15;
            m.vortexCore.scale.set(coreScale, coreScale, coreScale);
            // Dynamic emissive intensity
            m.vortexCore.material.emissiveIntensity = 5 + Math.sin(time * 10) * 3;
        }

        // 4. Space Grid stretching!
        if (m.spaceGridNodes) {
            // Simulate localized expansion
            const expansionFactor = 1 + (Math.sin(time * 1.5 * adjustedSpeed) * 0.5 + 0.5) * 0.4; 
            // oscillates between 1.0 and 1.4

            m.spaceGridNodes.forEach(node => {
                // Apply expansion based on distance from center (inverse square-ish)
                const effect = Math.max(0, 1 - (node.dist / 120));
                const currentExpansion = 1 + (expansionFactor - 1) * effect;
                
                node.mesh.position.x = node.ox * currentExpansion;
                node.mesh.position.y = node.oy * currentExpansion;
                node.mesh.position.z = node.oz * currentExpansion;
            });
        }

        if (m.spaceGridLines) {
            m.spaceGridLines.forEach(line => {
                const s = 1 + (Math.sin(time * 1.5 * adjustedSpeed) * 0.5 + 0.5) * 0.2;
                line.scale.set(s, s, s);
                line.rotation.y += 0.002 * adjustedSpeed;
                line.material.opacity = 0.2 + Math.sin(time*5)*0.1;
            });
        }

        // 5. Containment Gears spinning
        if (m.containmentGears) {
            m.containmentGears.forEach(gear => {
                gear.rotation.z += 0.02 * adjustedSpeed; // Because it's rotated on X, spinning around its local Z is the visual Y
            });
        }

        // 6. Energy Pulses venting up and disappearing
        if (m.energyPulses) {
            m.energyPulses.forEach(pulse => {
                pulse.mesh.position.y += pulse.speed * adjustedSpeed * 5;
                if (pulse.mesh.position.y > 300) {
                    pulse.mesh.position.y = -50;
                    pulse.mesh.position.x = (Math.random()-0.5)*100;
                    pulse.mesh.position.z = (Math.random()-0.5)*100;
                }
                pulse.mesh.rotation.y += 0.1 * adjustedSpeed;
                pulse.mesh.rotation.x += 0.05 * adjustedSpeed;
            });
        }
    };

    return { group, parts, description, quizQuestions, animate, meshes };
}
