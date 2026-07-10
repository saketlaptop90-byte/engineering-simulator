import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // ==============================================================================
    // 1. CUSTOM ADVANCED MATERIALS
    // ==============================================================================
    const scoopFieldMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x0088ff,
        emissive: 0x0022dd,
        emissiveIntensity: 3.5,
        transparent: true,
        opacity: 0.1,
        wireframe: true,
        side: THREE.DoubleSide,
        roughness: 0.1,
        metalness: 0.8
    });

    const plasmaCoreMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffaa00,
        emissiveIntensity: 8.0,
        transparent: true,
        opacity: 0.9,
        wireframe: false
    });

    const fusionExhaustMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff2200,
        emissiveIntensity: 6.0,
        transparent: true,
        opacity: 0.8
    });

    const neonBlueMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 2.0
    });

    const gothicHullMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.9,
        metalness: 0.6,
        bumpScale: 0.05
    });

    const heatRadiatorMaterial = new THREE.MeshStandardMaterial({
        color: 0x222222,
        emissive: 0x881100,
        emissiveIntensity: 0.8,
        roughness: 0.7,
        metalness: 0.9
    });

    // ==============================================================================
    // 2. HELPER FUNCTIONS FOR EXTREME COMPLEXITY
    // ==============================================================================

    // Generates a complex extruded shape for Gothic-style hull plating
    function createGothicPlate() {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(2, 0);
        shape.lineTo(2.5, 1);
        shape.lineTo(2, 2);
        shape.lineTo(1.5, 2.5);
        shape.lineTo(0.5, 2.5);
        shape.lineTo(0, 2);
        shape.lineTo(-0.5, 1);
        shape.lineTo(0, 0);

        const extrudeSettings = {
            depth: 0.5,
            bevelEnabled: true,
            bevelSegments: 4,
            steps: 2,
            bevelSize: 0.1,
            bevelThickness: 0.1
        };

        const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geo.center();
        return new THREE.Mesh(geo, darkSteel);
    }

    // Creates heavily detailed piping using TubeGeometry
    function createCoolantPipes(radius, length, count, spiralFactor) {
        const pipeGroup = new THREE.Group();
        for (let i = 0; i < count; i++) {
            const path = new THREE.CurvePath();
            const points = [];
            const angleOffset = (i / count) * Math.PI * 2;
            for (let j = 0; j <= 20; j++) {
                const z = (j / 20) * length - length / 2;
                const r = radius + Math.sin(j * 0.5) * 0.2;
                const theta = angleOffset + z * spiralFactor;
                const x = Math.cos(theta) * r;
                const y = Math.sin(theta) * r;
                points.push(new THREE.Vector3(x, y, z));
            }
            const curve = new THREE.CatmullRomCurve3(points);
            const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.15, 12, false);
            const pipeMesh = new THREE.Mesh(tubeGeo, copper);
            pipeGroup.add(pipeMesh);
        }
        return pipeGroup;
    }

    // Centrifuge habitat rings
    function createHabitatRing(radius, tubeRadius, spokeCount, moduleCount) {
        const ringGroup = new THREE.Group();
        
        // Main Torus
        const torusGeo = new THREE.TorusGeometry(radius, tubeRadius, 32, 100);
        const torusMesh = new THREE.Mesh(torusGeo, steel);
        ringGroup.add(torusMesh);

        // Inner support torus
        const innerTorusGeo = new THREE.TorusGeometry(radius - tubeRadius * 2, tubeRadius * 0.5, 16, 64);
        const innerTorusMesh = new THREE.Mesh(innerTorusGeo, darkSteel);
        ringGroup.add(innerTorusMesh);

        // Spokes
        for (let i = 0; i < spokeCount; i++) {
            const angle = (i / spokeCount) * Math.PI * 2;
            const spokeGeo = new THREE.CylinderGeometry(0.5, 0.5, radius, 16);
            const spoke = new THREE.Mesh(spokeGeo, aluminum);
            spoke.position.set(Math.cos(angle) * (radius / 2), Math.sin(angle) * (radius / 2), 0);
            spoke.rotation.z = angle + Math.PI / 2;
            ringGroup.add(spoke);
        }

        // Habitat modules (Lathed detailed pods)
        const podPoints = [];
        for (let i = 0; i <= 10; i++) {
            podPoints.push(new THREE.Vector2(Math.sin(i * 0.3) * 1.5 + 0.5, (i - 5) * 0.8));
        }
        const podGeo = new THREE.LatheGeometry(podPoints, 32);

        for (let i = 0; i < moduleCount; i++) {
            const angle = (i / moduleCount) * Math.PI * 2;
            const pod = new THREE.Mesh(podGeo, tinted);
            pod.position.set(Math.cos(angle) * (radius + tubeRadius + 1), Math.sin(angle) * (radius + tubeRadius + 1), 0);
            pod.rotation.x = Math.PI / 2;
            pod.rotation.z = angle;
            
            // Neon strips on pods
            const neonGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.2, 32);
            const neonStrip = new THREE.Mesh(neonGeo, neonBlueMaterial);
            pod.add(neonStrip);
            
            ringGroup.add(pod);
        }

        return ringGroup;
    }

    // Creates the massive magnetic scoop (Lathe geometry)
    function createMagneticScoopBase() {
        const points = [];
        const maxRadius = 150;
        const length = 300;
        for (let i = 0; i <= 50; i++) {
            const t = i / 50;
            // Exponential curve for funnel
            const r = 5 + Math.pow(t, 3) * maxRadius;
            const z = t * length;
            points.push(new THREE.Vector2(r, z));
        }
        const geo = new THREE.LatheGeometry(points, 64);
        const mesh = new THREE.Mesh(geo, scoopFieldMaterial);
        mesh.rotation.x = -Math.PI / 2;
        return mesh;
    }

    // Creates radiator fin arrays for heat dissipation
    function createRadiatorArrays(radius, length, count) {
        const radGroup = new THREE.Group();
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            
            // Complex fin shape
            const shape = new THREE.Shape();
            shape.moveTo(0, 0);
            shape.lineTo(0, length);
            shape.lineTo(15, length * 0.8);
            shape.lineTo(20, length * 0.5);
            shape.lineTo(15, length * 0.2);
            shape.lineTo(0, 0);

            const extrudeOpts = { depth: 0.2, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.1, bevelThickness: 0.1 };
            const finGeo = new THREE.ExtrudeGeometry(shape, extrudeOpts);
            const fin = new THREE.Mesh(finGeo, heatRadiatorMaterial);

            fin.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, -length/2);
            fin.rotation.z = angle;
            fin.rotation.y = Math.PI / 2;
            
            // Add glowing heat pipes to each fin
            const pipeGeo = new THREE.CylinderGeometry(0.2, 0.2, length * 0.7, 8);
            const pipe = new THREE.Mesh(pipeGeo, new THREE.MeshStandardMaterial({color: 0xff2200, emissive: 0xaa1100, emissiveIntensity: 2}));
            pipe.rotation.x = Math.PI / 2;
            pipe.position.set(8, length * 0.5, 0.5);
            fin.add(pipe);

            radGroup.add(fin);
        }
        return radGroup;
    }

    // Create the extreme fusion torch drive
    function createFusionDrive() {
        const driveGroup = new THREE.Group();
        
        // Nozzle Bells
        for(let i=0; i<3; i++) {
            const bellPoints = [];
            for (let j = 0; j <= 30; j++) {
                const t = j / 30;
                bellPoints.push(new THREE.Vector2(5 + Math.pow(t, 2) * (15 + i*5), -t * (40 + i*10)));
            }
            const bellGeo = new THREE.LatheGeometry(bellPoints, 64);
            const bell = new THREE.Mesh(bellGeo, darkSteel);
            driveGroup.add(bell);
        }

        // Magnetic confinement rings around nozzle
        for(let i=1; i<=10; i++) {
            const ringGeo = new THREE.TorusGeometry(10 + Math.pow(i/10, 2)*20, 1.5, 16, 64);
            const ring = new THREE.Mesh(ringGeo, steel);
            ring.position.z = -i * 4;
            
            // Add neon glowing conduits
            const neonRingGeo = new THREE.TorusGeometry(10 + Math.pow(i/10, 2)*20 + 1.6, 0.4, 8, 32);
            const neonRing = new THREE.Mesh(neonRingGeo, neonBlueMaterial);
            ring.add(neonRing);

            driveGroup.add(ring);
        }

        // Plasma Core
        const coreGeo = new THREE.SphereGeometry(8, 64, 64);
        const core = new THREE.Mesh(coreGeo, plasmaCoreMaterial);
        core.position.z = 5;
        driveGroup.add(core);

        return driveGroup;
    }

    // Particle system for Hydrogen collection (Bussard Scoop)
    function createInterstellarHydrogen() {
        const particleCount = 20000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = [];

        for (let i = 0; i < particleCount; i++) {
            // Distribute in a huge cylinder ahead of the ship
            const r = Math.sqrt(Math.random()) * 200;
            const theta = Math.random() * 2 * Math.PI;
            const x = r * Math.cos(theta);
            const y = r * Math.sin(theta);
            const z = Math.random() * 2000 + 300; // Far ahead

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            velocities.push({
                x: -x * 0.001,
                y: -y * 0.001,
                z: -Math.random() * 15 - 5 // Fast moving towards the ship
            });
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const material = new THREE.PointsMaterial({
            color: 0xaaccff,
            size: 1.5,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(geometry, material);
        particles.userData.velocities = velocities;
        return particles;
    }

    // Particle system for the Fusion Torch Exhaust
    function createExhaustPlume() {
        const particleCount = 10000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const lifetimes = new Float32Array(particleCount);
        const velocities = [];

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 2] = -Math.random() * 50;

            velocities.push({
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2,
                z: -Math.random() * 30 - 20 // Extreme rearward velocity
            });
            lifetimes[i] = Math.random();
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('lifetime', new THREE.BufferAttribute(lifetimes, 1));

        const material = new THREE.PointsMaterial({
            color: 0xff4400,
            size: 3.0,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(geometry, material);
        particles.userData.velocities = velocities;
        particles.userData.lifetimes = lifetimes;
        return particles;
    }

    // Creates the central spine truss network
    function createTrussSpine(length, radius) {
        const trussGroup = new THREE.Group();
        const segments = Math.floor(length / 20);
        
        for (let i = 0; i < segments; i++) {
            const z = (i * 20) - length / 2;
            
            // Hexagonal bulkheads
            const bulkheadGeo = new THREE.CylinderGeometry(radius, radius, 2, 6);
            const bulkhead = new THREE.Mesh(bulkheadGeo, steel);
            bulkhead.rotation.x = Math.PI / 2;
            bulkhead.position.z = z;
            trussGroup.add(bulkhead);

            // Longitudinal struts
            if (i < segments - 1) {
                for (let j = 0; j < 6; j++) {
                    const angle = (j / 6) * Math.PI * 2;
                    const strutGeo = new THREE.CylinderGeometry(1, 1, 20, 8);
                    const strut = new THREE.Mesh(strutGeo, darkSteel);
                    strut.position.set(Math.cos(angle) * (radius - 2), Math.sin(angle) * (radius - 2), z + 10);
                    strut.rotation.x = Math.PI / 2;
                    trussGroup.add(strut);
                }
                
                // Cross bracing
                for (let j = 0; j < 6; j++) {
                    const angle1 = (j / 6) * Math.PI * 2;
                    const angle2 = ((j+1) / 6) * Math.PI * 2;
                    
                    const p1 = new THREE.Vector3(Math.cos(angle1) * (radius - 2), Math.sin(angle1) * (radius - 2), z);
                    const p2 = new THREE.Vector3(Math.cos(angle2) * (radius - 2), Math.sin(angle2) * (radius - 2), z + 20);
                    
                    const distance = p1.distanceTo(p2);
                    const crossGeo = new THREE.CylinderGeometry(0.5, 0.5, distance, 8);
                    const cross = new THREE.Mesh(crossGeo, aluminum);
                    
                    // Position at midpoint and look at p2
                    const midpoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
                    cross.position.copy(midpoint);
                    cross.lookAt(p2);
                    cross.rotation.x += Math.PI / 2;
                    trussGroup.add(cross);
                }
            }
        }
        return trussGroup;
    }


    // ==============================================================================
    // 3. ASSEMBLING THE MASSIVE MACHINE
    // ==============================================================================

    const shipGroup = new THREE.Group();

    // Part 1: Central Gothic Spine
    const spineLength = 800;
    const spineRadius = 30;
    const mainSpine = createTrussSpine(spineLength, spineRadius);
    shipGroup.add(mainSpine);
    parts.push({
        name: "Primary Transtemporal Spine",
        description: "Miles-long hexagonal truss core supporting all ship subsystems and absorbing relativistic stress.",
        material: steel,
        function: "Structural integrity and central power distribution",
        assemblyOrder: 1,
        connections: ["Habitat Rings", "Magnetic Scoop", "Fusion Drive"],
        failureEffect: "Catastrophic structural shear and immediate vessel destruction at 0.9c.",
        cascadeFailures: ["Loss of all systems", "Complete annihilation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 100, z: 0 },
        mesh: mainSpine
    });

    // Part 2: Heavy Gothic Plating (Greebles along spine)
    const armorGroup = new THREE.Group();
    for (let i = 0; i < 40; i++) {
        const plate = createGothicPlate();
        const angle = (i % 6) * (Math.PI / 3);
        const zPos = (i * 20) - spineLength / 2.2;
        plate.position.set(Math.cos(angle) * (spineRadius + 5), Math.sin(angle) * (spineRadius + 5), zPos);
        plate.scale.set(10, 10, 10);
        plate.rotation.z = angle + Math.PI / 2;
        plate.rotation.y = Math.PI / 2;
        armorGroup.add(plate);
    }
    shipGroup.add(armorGroup);
    parts.push({
        name: "Relativistic Ablative Armor",
        description: "Gothic-styled hyper-dense depleted uranium plating to survive interstellar dust impacts at fractional lightspeed.",
        material: darkSteel,
        function: "Kinetic shielding",
        assemblyOrder: 2,
        connections: ["Primary Transtemporal Spine"],
        failureEffect: "Dust impacts will cause nuclear-yield explosions on the internal structure.",
        cascadeFailures: ["Breach in coolant lines", "Decompression of habitats"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -150, y: 0, z: 0 },
        mesh: armorGroup
    });

    // Part 3: Alpha Habitat Ring
    const habitatAlpha = createHabitatRing(80, 5, 8, 16);
    habitatAlpha.position.z = 200;
    shipGroup.add(habitatAlpha);
    parts.push({
        name: "Alpha Centrifuge Habitat",
        description: "1G spin gravity environment containing crew quarters, hydroponics, and primary command.",
        material: aluminum,
        function: "Life support and gravity generation",
        assemblyOrder: 3,
        connections: ["Primary Transtemporal Spine"],
        failureEffect: "Zero-G exposure and massive crew casualties.",
        cascadeFailures: ["Loss of command and control"],
        originalPosition: { x: 0, y: 0, z: 200 },
        explodedPosition: { x: 0, y: 250, z: 200 },
        mesh: habitatAlpha
    });

    // Part 4: Beta Habitat Ring
    const habitatBeta = createHabitatRing(120, 6, 12, 24);
    habitatBeta.position.z = 100;
    // Rotate slightly for visual complexity
    habitatBeta.rotation.z = Math.PI / 12; 
    shipGroup.add(habitatBeta);
    parts.push({
        name: "Beta Centrifuge Habitat",
        description: "Massive secondary ring for cryo-stasis vaults and heavy manufacturing.",
        material: aluminum,
        function: "Long-term population storage and fabrication",
        assemblyOrder: 4,
        connections: ["Primary Transtemporal Spine"],
        failureEffect: "Loss of 80% of colonist population.",
        cascadeFailures: ["Mission failure parameters met"],
        originalPosition: { x: 0, y: 0, z: 100 },
        explodedPosition: { x: 0, y: -250, z: 100 },
        mesh: habitatBeta
    });

    // Part 5: Coolant Piping Network
    const coolantNetwork = createCoolantPipes(spineRadius + 2, spineLength - 100, 12, 0.01);
    shipGroup.add(coolantNetwork);
    parts.push({
        name: "Superfluid Helium Coolant Network",
        description: "Extensive capillary system pumping liquid helium at 2 Kelvin to superconducting magnetic coils.",
        material: copper,
        function: "Thermal regulation for the Bussard scoop and fusion core",
        assemblyOrder: 5,
        connections: ["Primary Transtemporal Spine", "Magnetic Scoop Base", "Fusion Torch"],
        failureEffect: "Superconductors quench, causing violent release of stored magnetic energy.",
        cascadeFailures: ["Plasma containment failure", "Shipwide vaporization"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 150, y: 150, z: 0 },
        mesh: coolantNetwork
    });

    // Part 6: Radiator Fin Arrays
    const radiatorArrays = createRadiatorArrays(spineRadius + 15, 250, 16);
    radiatorArrays.position.z = -100;
    shipGroup.add(radiatorArrays);
    parts.push({
        name: "Waste Heat Radiator Phalanx",
        description: "Massive graphene fin arrays glowing cherry red as they dump terawatts of fusion waste heat into the void.",
        material: heatRadiatorMaterial,
        function: "Thermodynamic venting",
        assemblyOrder: 6,
        connections: ["Primary Transtemporal Spine", "Superfluid Helium Coolant Network"],
        failureEffect: "Internal temperature spikes, melting the hull.",
        cascadeFailures: ["Coolant flash-boiling", "Reactor SCRAM"],
        originalPosition: { x: 0, y: 0, z: -100 },
        explodedPosition: { x: 0, y: 0, z: -300 },
        mesh: radiatorArrays
    });

    // Part 7: Forward Magnetic Scoop Emitters
    const scoopEmitterGroup = new THREE.Group();
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const emitterGeo = new THREE.CylinderGeometry(4, 2, 80, 16);
        const emitter = new THREE.Mesh(emitterGeo, chrome);
        emitter.position.set(Math.cos(angle) * (spineRadius + 20), Math.sin(angle) * (spineRadius + 20), spineLength / 2 - 20);
        emitter.rotation.x = Math.PI / 2;
        // Angle them outward
        emitter.rotation.x += Math.PI/2;
        emitter.rotation.y = angle;
        emitter.rotation.z = -Math.PI / 8;
        
        const neonTipGeo = new THREE.ConeGeometry(5, 10, 16);
        const neonTip = new THREE.Mesh(neonTipGeo, neonBlueMaterial);
        neonTip.position.y = 45;
        emitter.add(neonTip);
        
        scoopEmitterGroup.add(emitter);
    }
    shipGroup.add(scoopEmitterGroup);
    parts.push({
        name: "Peta-Tesla Field Emitters",
        description: "Generates the structural basis for the thousand-kilometer electromagnetic funnel.",
        material: chrome,
        function: "Ionizing and channeling interstellar hydrogen",
        assemblyOrder: 7,
        connections: ["Primary Transtemporal Spine", "Forward Sensor Phalanx"],
        failureEffect: "Scoop field collapses, starving the reactor of fuel.",
        cascadeFailures: ["Loss of thrust", "Inability to decelerate"],
        originalPosition: { x: 0, y: 0, z: spineLength / 2 - 20 },
        explodedPosition: { x: 0, y: 0, z: spineLength / 2 + 100 },
        mesh: scoopEmitterGroup
    });

    // Part 8: The Holographic/Magnetic Scoop Field
    const magneticFunnel = createMagneticScoopBase();
    magneticFunnel.position.z = spineLength / 2;
    shipGroup.add(magneticFunnel);
    parts.push({
        name: "Electromagnetic Funnel",
        description: "A colossal, invisible (but glowing due to ionized plasma) magnetic field acting as a ramscoop.",
        material: scoopFieldMaterial,
        function: "Collecting sparse interstellar medium (ISM) for fuel",
        assemblyOrder: 8,
        connections: ["Peta-Tesla Field Emitters"],
        failureEffect: "Fuel starvation.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: spineLength / 2 },
        explodedPosition: { x: 0, y: 200, z: spineLength / 2 + 150 },
        mesh: magneticFunnel
    });

    // Part 9: Hydrogen Particle System
    const hydrogenParticles = createInterstellarHydrogen();
    magneticFunnel.add(hydrogenParticles); // Attach to funnel so it moves with it
    parts.push({
        name: "Interstellar Medium (Hydrogen)",
        description: "Highly diffuse protons rushing into the scoop at relativistic speeds.",
        material: null,
        function: "Fuel source",
        assemblyOrder: 9,
        connections: ["Electromagnetic Funnel"],
        failureEffect: "Vacuum.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 500 },
        mesh: hydrogenParticles
    });

    // Part 10: Anti-Matter Confinement Bottles
    const antimatterGroup = new THREE.Group();
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const bottleGeo = new THREE.CapsuleGeometry(10, 40, 16, 32);
        const bottle = new THREE.Mesh(bottleGeo, glass);
        
        const amCoreGeo = new THREE.CylinderGeometry(2, 2, 35, 16);
        const amCore = new THREE.Mesh(amCoreGeo, new THREE.MeshStandardMaterial({color: 0xaa00ff, emissive: 0x6600ff, emissiveIntensity: 5}));
        bottle.add(amCore);

        bottle.position.set(Math.cos(angle) * (spineRadius + 10), Math.sin(angle) * (spineRadius + 10), -spineLength / 2 + 100);
        bottle.rotation.x = Math.PI / 2;
        antimatterGroup.add(bottle);
    }
    shipGroup.add(antimatterGroup);
    parts.push({
        name: "Antimatter Catalyzer Vaults",
        description: "Stores antiprotons suspended in Penning traps to catalyze the fusion reaction.",
        material: glass,
        function: "Ignition catalyst for the fusion torch",
        assemblyOrder: 10,
        connections: ["Primary Transtemporal Spine", "Fusion Reactor Core"],
        failureEffect: "Containment breach results in matter-antimatter annihilation, vaporizing the aft section.",
        cascadeFailures: ["Complete vessel destruction"],
        originalPosition: { x: 0, y: 0, z: -spineLength / 2 + 100 },
        explodedPosition: { x: -200, y: -200, z: -spineLength / 2 + 100 },
        mesh: antimatterGroup
    });

    // Part 11: Fusion Reactor Core Shell
    const coreShellGeo = new THREE.SphereGeometry(60, 64, 64);
    const coreShell = new THREE.Mesh(coreShellGeo, steel);
    coreShell.position.z = -spineLength / 2;
    // Add intricate panel lines
    const coreWireframe = new THREE.Mesh(new THREE.SphereGeometry(60.5, 32, 32), new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true, transparent: true, opacity: 0.5}));
    coreShell.add(coreWireframe);
    shipGroup.add(coreShell);
    parts.push({
        name: "Tokamak Stellarator Hybrid Core",
        description: "The heavily shielded beating heart of the ship, fusing collected hydrogen into helium.",
        material: steel,
        function: "Primary energy generation",
        assemblyOrder: 11,
        connections: ["Antimatter Catalyzer Vaults", "Superfluid Helium Coolant Network"],
        failureEffect: "Plasma touches the walls, melting the reactor instantly.",
        cascadeFailures: ["Loss of main drive", "Loss of all electrical power"],
        originalPosition: { x: 0, y: 0, z: -spineLength / 2 },
        explodedPosition: { x: 0, y: 250, z: -spineLength / 2 },
        mesh: coreShell
    });

    // Part 12: Fusion Torch Drive
    const mainDrive = createFusionDrive();
    mainDrive.position.z = -spineLength / 2 - 60;
    shipGroup.add(mainDrive);
    parts.push({
        name: "Exhaust Nozzle & Confinement Rings",
        description: "Directs the continuous nuclear explosion out the rear to provide steady 1G acceleration for years.",
        material: darkSteel,
        function: "Propulsion",
        assemblyOrder: 12,
        connections: ["Tokamak Stellarator Hybrid Core"],
        failureEffect: "Asymmetric thrust, sending the ship into an unrecoverable relativistic spin.",
        cascadeFailures: ["Crew killed by extreme G-forces"],
        originalPosition: { x: 0, y: 0, z: -spineLength / 2 - 60 },
        explodedPosition: { x: 0, y: -250, z: -spineLength / 2 - 60 },
        mesh: mainDrive
    });

    // Part 13: Exhaust Plume
    const exhaustPlume = createExhaustPlume();
    mainDrive.add(exhaustPlume);
    parts.push({
        name: "Fusion Plasma Exhaust",
        description: "A blinding beam of superheated helium plasma and radiation.",
        material: null,
        function: "Reaction mass expulsion",
        assemblyOrder: 13,
        connections: ["Exhaust Nozzle & Confinement Rings"],
        failureEffect: "Flameout.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -400 },
        mesh: exhaustPlume
    });

    // Part 14: Secondary Vectoring Thrusters
    const rcsGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const angle = (i/4)*Math.PI*2;
        const thrusterGeo = new THREE.CylinderGeometry(3, 8, 15, 16);
        const thruster = new THREE.Mesh(thrusterGeo, steel);
        thruster.position.set(Math.cos(angle) * (spineRadius + 15), Math.sin(angle) * (spineRadius + 15), -spineLength / 2 + 50);
        thruster.rotation.x = Math.PI / 2;
        thruster.rotation.z = angle + Math.PI/2;
        
        const glowGeo = new THREE.CylinderGeometry(2.5, 2.5, 1, 16);
        const glow = new THREE.Mesh(glowGeo, neonBlueMaterial);
        glow.position.y = -8;
        thruster.add(glow);

        rcsGroup.add(thruster);
    }
    shipGroup.add(rcsGroup);
    parts.push({
        name: "Attitude Control Toroidal Thrusters",
        description: "Massive maneuvering thrusters capable of rotating the million-ton vessel.",
        material: steel,
        function: "Vectoring and rotation",
        assemblyOrder: 14,
        connections: ["Primary Transtemporal Spine"],
        failureEffect: "Inability to steer, potentially missing the target star system by lightyears.",
        cascadeFailures: ["Navigation failure"],
        originalPosition: { x: 0, y: 0, z: -spineLength / 2 + 50 },
        explodedPosition: { x: 0, y: 300, z: -spineLength / 2 + 50 },
        mesh: rcsGroup
    });

    // Part 15: Forward Deflector Array
    const deflectorGeo = new THREE.SphereGeometry(spineRadius + 5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 4);
    const deflector = new THREE.Mesh(deflectorGeo, chrome);
    deflector.position.z = spineLength / 2;
    shipGroup.add(deflector);
    parts.push({
        name: "Navigational Deflector Array",
        description: "Creates a localized warp bubble to push macro-particles out of the ship's path.",
        material: chrome,
        function: "Path clearing",
        assemblyOrder: 15,
        connections: ["Primary Transtemporal Spine"],
        failureEffect: "Impact with a grain of sand at 0.99c will deliver the energy of a small nuclear bomb.",
        cascadeFailures: ["Ablative armor depletion", "Hull breach"],
        originalPosition: { x: 0, y: 0, z: spineLength / 2 },
        explodedPosition: { x: 0, y: -200, z: spineLength / 2 + 50 },
        mesh: deflector
    });

    // Part 16: Deep Space Comm Array
    const commArrayGroup = new THREE.Group();
    const dishGeo = new THREE.CylinderGeometry(20, 0.5, 10, 32);
    const dish = new THREE.Mesh(dishGeo, steel);
    dish.rotation.x = Math.PI / 2;
    dish.position.y = spineRadius + 40;
    dish.position.z = 150;
    
    const antennaGeo = new THREE.CylinderGeometry(0.5, 0.5, 25, 8);
    const antenna = new THREE.Mesh(antennaGeo, aluminum);
    antenna.position.y = 5;
    dish.add(antenna);

    commArrayGroup.add(dish);
    shipGroup.add(commArrayGroup);
    parts.push({
        name: "Tachyon-Burst Communications Dish",
        description: "Hyper-sensitive phased array for communicating with Earth across lightyears, compensating for extreme red-shift.",
        material: steel,
        function: "Interstellar telemetry",
        assemblyOrder: 16,
        connections: ["Primary Transtemporal Spine"],
        failureEffect: "Complete isolation from humanity.",
        cascadeFailures: ["Loss of mission updates"],
        originalPosition: { x: 0, y: spineRadius + 40, z: 150 },
        explodedPosition: { x: 0, y: spineRadius + 200, z: 150 },
        mesh: commArrayGroup
    });

    group.add(shipGroup);

    // ==============================================================================
    // 4. METADATA & ACADEMIC QUIZ
    // ==============================================================================

    const description = "The God-Tier Bussard Ramjet Interstellar Cruiser. A multi-kilometer long marvel of extreme engineering designed to accelerate continuously at 1G, scooping diffuse interstellar hydrogen to fuel its antimatter-catalyzed fusion torch drive. Operating near the speed of light, it experiences profound relativistic effects, requiring peta-tesla magnetic fields and ablative armor to survive the journey between stars.";

    const quizQuestions = [
        {
            question: "In a Bussard Ramjet operating at relativistic speeds (v -> c), the scooped interstellar medium induces a drag force. At what critical velocity does the ram-drag exactly equal the maximum theoretical fusion thrust, effectively setting the universal speed limit for this class of vessel?",
            options: [
                "0.15c, due to the low cross-section of p-p chain fusion.",
                "0.99c, limited by time dilation of the crew.",
                "Approx 0.12c to 0.18c, because the energy extracted from fusion (approx 0.007mc^2) cannot overcome the kinetic energy cost of accelerating the incoming mass to the ship's reference frame.",
                "It has no speed limit; as long as there is hydrogen, it accelerates."
            ],
            correctAnswer: 2,
            explanation: "The ram-drag problem (noted by Fishback in 1969) states that at around 0.12c to 0.18c, the momentum drag of scooping stationary interstellar matter equals the thrust generated by fusing it, unless exotic physics like CNO cycle catalysis or dark matter conversion are employed."
        },
        {
            question: "How does the 'Blue-Shift' effect of incoming interstellar radiation at 0.9c impact the design of the forward deflector shields?",
            options: [
                "It shifts visible light into the microwave spectrum, requiring faraday cages.",
                "It shifts the cosmic microwave background (CMB) and incoming starlight into high-energy X-rays and Gamma rays, necessitating massive amounts of shielding to prevent crew death by radiation.",
                "It reduces the energy of incoming photons, making navigation easier.",
                "It has no effect on shielding, only on communication arrays."
            ],
            correctAnswer: 1,
            explanation: "As the ship approaches the speed of light, the Doppler effect drastically blue-shifts incoming photons. The 2.7K CMB and normal starlight are shifted into lethal ionizing radiation (X-rays/Gamma rays), requiring immensely thick physical shielding or advanced plasma deflection."
        },
        {
            question: "The magnetic funnel requires a field strength on the order of 10^14 Tesla to compress diffuse hydrogen to fusion-ready densities. What fundamental physical limitation prevents standard metallic superconductors from generating such a field?",
            options: [
                "The Meissner effect limits the color of the glow.",
                "The critical magnetic field (Hc); above this limit, the magnetic field destroys the superconducting state (quenching), reverting the material to normal electrical resistance and instantly melting the coils.",
                "There is no limitation; enough copper can generate any field.",
                "The Hall effect causes the electrons to leak into space."
            ],
            correctAnswer: 1,
            explanation: "Superconductors have a critical magnetic field (Hc). If the generated magnetic field exceeds this threshold, the Cooper pairs are broken, superconductivity is lost, and the massive electrical current encounters sudden, immense resistance, vaporizing the coils."
        },
        {
            question: "Why is an antimatter catalyst (like antiprotons) utilized in the Tokamak Stellarator Hybrid Core instead of relying purely on magnetic confinement and ohmic heating?",
            options: [
                "Antimatter looks cooler in the reactor core.",
                "To reduce the weight of the ship by removing standard fuel.",
                "Antiprotons injected into the plasma annihilate with protons, releasing gamma rays and pions that deposit massive thermal energy rapidly, lowering the required ignition temperature and vastly increasing the cross-section for the p-B11 or D-T fusion reactions.",
                "Antimatter generates artificial gravity for the centrifuge."
            ],
            correctAnswer: 2,
            explanation: "Antimatter-catalyzed nuclear pulse propulsion uses micro-amounts of antiprotons to induce immediate and complete fusion of the target fuel, bypassing the immense pressure/temperature thresholds normally required for sustained stellarator fusion."
        },
        {
            question: "Assuming a constant 1g (9.8 m/s^2) acceleration, how much proper time (ship time) elapses for the crew to travel to the Andromeda Galaxy (2.5 million lightyears away), and what is the primary consequence of this?",
            options: [
                "2.5 million years; the crew must be in cryo-stasis the entire time.",
                "Approx 28 years; due to time dilation, the crew experiences only a few decades, while millions of years pass on Earth, making it a one-way trip to a fundamentally altered universe.",
                "100 years; restricted by the speed of light.",
                "It is instantaneous due to quantum tunneling."
            ],
            correctAnswer: 1,
            explanation: "At a constant 1g acceleration (and decelerating at 1g for the second half), relativistic time dilation allows crossing immense cosmic distances in a single human lifetime from the ship's reference frame (t = (c/a) * arccosh(ad/c^2 + 1)). However, millions of years pass for the outside universe."
        }
    ];

    // ==============================================================================
    // 5. EXTREME ANIMATION LOGIC
    // ==============================================================================

    function animate(time, speed, meshes) {
        // time is time in seconds, speed is a multiplier
        const t = time * speed;

        // 1. Rotate the habitat rings to simulate artificial gravity
        habitatAlpha.rotation.z = t * 0.5; // Faster spin for smaller ring
        habitatBeta.rotation.z = t * 0.3;  // Slower spin for larger ring

        // 2. Pulse the Magnetic Scoop field (Simulating Peta-Tesla fluctuations)
        magneticFunnel.material.emissiveIntensity = 2.0 + Math.sin(t * 5) * 1.5;
        // Rotate the funnel slowly
        magneticFunnel.rotation.y = t * 0.1;

        // 3. Animate Interstellar Hydrogen Particles (Bussard Scoop Collection)
        const hPositions = hydrogenParticles.geometry.attributes.position.array;
        const hVelocities = hydrogenParticles.userData.velocities;
        for (let i = 0; i < hVelocities.length; i++) {
            hPositions[i * 3] += hVelocities[i].x * speed;
            hPositions[i * 3 + 1] += hVelocities[i].y * speed;
            hPositions[i * 3 + 2] += hVelocities[i].z * speed;

            // If particle passes the scoop, reset it far ahead
            if (hPositions[i * 3 + 2] < spineLength / 2 - 50) {
                const r = Math.sqrt(Math.random()) * 200;
                const theta = Math.random() * 2 * Math.PI;
                hPositions[i * 3] = r * Math.cos(theta);
                hPositions[i * 3 + 1] = r * Math.sin(theta);
                hPositions[i * 3 + 2] = Math.random() * 1000 + 500;
            }
            
            // Relativistic Blue-Shift effect: as they get closer, they get brighter/more violet
            // Simulated by adjusting material color dynamically in a real shader, but here we just update opacity via distance
        }
        hydrogenParticles.geometry.attributes.position.needsUpdate = true;

        // 4. Animate Fusion Exhaust Plume
        const ePositions = exhaustPlume.geometry.attributes.position.array;
        const eLifetimes = exhaustPlume.geometry.attributes.lifetime.array;
        const eVelocities = exhaustPlume.userData.velocities;
        
        for(let i=0; i< eVelocities.length; i++) {
            ePositions[i*3] += eVelocities[i].x * speed;
            ePositions[i*3+1] += eVelocities[i].y * speed;
            ePositions[i*3+2] += eVelocities[i].z * speed;
            
            eLifetimes[i] -= 0.02 * speed;
            
            if(eLifetimes[i] <= 0) {
                // Reset at nozzle
                ePositions[i*3] = (Math.random() - 0.5) * 10;
                ePositions[i*3+1] = (Math.random() - 0.5) * 10;
                ePositions[i*3+2] = -Math.random() * 10; // Start slightly inside nozzle
                eLifetimes[i] = 1.0;
                eVelocities[i].x = (Math.random() - 0.5) * 2;
                eVelocities[i].y = (Math.random() - 0.5) * 2;
            }
        }
        exhaustPlume.geometry.attributes.position.needsUpdate = true;

        // 5. Plasma Core pulsing
        const coreMesh = mainDrive.children[mainDrive.children.length - 1]; // Assuming core is last added
        if(coreMesh && coreMesh.material === plasmaCoreMaterial) {
            coreMesh.scale.setScalar(1.0 + Math.sin(t * 20) * 0.05); // High frequency flutter
            plasmaCoreMaterial.emissiveIntensity = 8.0 + Math.random() * 2.0;
        }

        // 6. Slowly rotate Comm dish tracking Earth
        commArrayGroup.children[0].rotation.z = Math.sin(t * 0.1) * 0.5;
        commArrayGroup.children[0].rotation.y = Math.cos(t * 0.05) * 0.5;

        // 7. General Ship vibration (extreme power output)
        shipGroup.position.x = (Math.random() - 0.5) * 0.5 * speed;
        shipGroup.position.y = (Math.random() - 0.5) * 0.5 * speed;
    }

    return { group, parts, description, quizQuestions, animate };
}
