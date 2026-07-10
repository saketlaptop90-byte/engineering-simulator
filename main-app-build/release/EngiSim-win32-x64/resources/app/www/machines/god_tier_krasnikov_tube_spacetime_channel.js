import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

/**
 * GOD TIER KRASNIKOV TUBE SPACETIME CHANNEL
 * 
 * A monumental macrostructure that permanently alters the spacetime metric along its axis,
 * allowing superluminal return trips without violating local Lorentz invariance. 
 * This model generates an incredibly detailed spaceframe, exotic matter confinement rings, 
 * negative energy pulsars, and distorted light cone visualizations.
 */
export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Core animation registry
    const animatedObjects = {
        scaffoldRings: [],
        innerContainmentRings: [],
        exoticMatterBeams: [],
        spacetimeGridNodes: [],
        spacetimeGridLines: [],
        lightCones: [],
        radiationParticles: null,
        ship: null,
        shipThrusters: [],
        shipWarpCoils: [],
        hydraulics: [],
        casimirPlates: [],
        tachyonEmitters: [],
        energyPulses: []
    };

    // ============================================================================
    // ADVANCED CUSTOM MATERIALS
    // ============================================================================
    
    const exoticMatterMat = new THREE.MeshStandardMaterial({
        color: 0x9900ff,
        emissive: 0x5500aa,
        emissiveIntensity: 4.0,
        transparent: true,
        opacity: 0.8,
        wireframe: true,
        side: THREE.DoubleSide
    });

    const negativeEnergyMat = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00aaff,
        emissiveIntensity: 6.0,
        transparent: true,
        opacity: 0.7,
        transmission: 0.9,
        roughness: 0.1,
        metalness: 0.8,
        blending: THREE.AdditiveBlending
    });

    const spacetimeGridMat = new THREE.LineBasicMaterial({
        color: 0x0055aa,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
    });

    const spacetimeDistortedMat = new THREE.LineBasicMaterial({
        color: 0xff0055,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const cherenkovMat = new THREE.MeshBasicMaterial({
        color: 0x0088ff,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
    });

    const hullMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.95,
        roughness: 0.15,
        envMapIntensity: 2.5
    });
    
    const darkHullMat = new THREE.MeshStandardMaterial({
        color: 0x111111,
        metalness: 0.8,
        roughness: 0.6
    });

    const neonBlueMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true });
    const neonRedMat = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

    // ============================================================================
    // METRICS & CONSTANTS
    // ============================================================================
    const tubeRadius = 25;
    const tubeLength = 350;
    const ringCount = 80;
    const zStep = tubeLength / ringCount;
    
    // ============================================================================
    // 1. TOPOLOGICAL SPACETIME GRID (MINKOWSKI TO KRASNIKOV METRIC)
    // ============================================================================
    const gridGroup = new THREE.Group();
    const numRings = 120;
    const segmentsPerRing = 48;

    for (let i = 0; i <= numRings; i++) {
        const z = -tubeLength/2 + (i / numRings) * tubeLength;
        
        // Circumferential lines
        const ringGeo = new THREE.BufferGeometry();
        const ringVerts = [];
        for (let j = 0; j <= segmentsPerRing; j++) {
            const theta = (j / segmentsPerRing) * Math.PI * 2;
            ringVerts.push(Math.cos(theta) * tubeRadius, Math.sin(theta) * tubeRadius, z);
        }
        ringGeo.setAttribute('position', new THREE.Float32BufferAttribute(ringVerts, 3));
        const ringLine = new THREE.Line(ringGeo, spacetimeGridMat);
        gridGroup.add(ringLine);
        animatedObjects.spacetimeGridLines.push({ mesh: ringLine, type: 'ring', zOrig: z, rOrig: tubeRadius });

        // Longitudinal lines (only generate once)
        if (i === 0) {
            for (let j = 0; j < segmentsPerRing; j++) {
                const theta = (j / segmentsPerRing) * Math.PI * 2;
                const longGeo = new THREE.BufferGeometry();
                const longVerts = [];
                for (let k = 0; k <= numRings; k++) {
                    const kz = -tubeLength/2 + (k / numRings) * tubeLength;
                    longVerts.push(Math.cos(theta) * tubeRadius, Math.sin(theta) * tubeRadius, kz);
                }
                longGeo.setAttribute('position', new THREE.Float32BufferAttribute(longVerts, 3));
                const longLine = new THREE.Line(longGeo, spacetimeGridMat);
                gridGroup.add(longLine);
                animatedObjects.spacetimeGridLines.push({ mesh: longLine, type: 'long', theta: theta });
            }
        }
    }
    group.add(gridGroup);
    
    parts.push({
        name: "Topological Spacetime Grid",
        description: "Visualizes the underlying manifold. Distortions represent the non-trivial metric tensor allowing superluminal paths.",
        material: "Holographic Projection",
        function: "Metric monitoring",
        assemblyOrder: 1,
        connections: ["Manifold"],
        failureEffect: "Loss of topological reference",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -60, z: 0}
    });

    // ============================================================================
    // 2. MACRO-SCAFFOLDING (THE EXOTIC MATTER CONTAINMENT HULL)
    // ============================================================================
    const scaffoldGroup = new THREE.Group();
    
    const outerRingGeo = new THREE.TorusGeometry(tubeRadius + 6, 1.5, 32, 64);
    const innerRingGeo = new THREE.TorusGeometry(tubeRadius + 1, 0.8, 16, 64);
    const casimirPlateGeo = new THREE.BoxGeometry(4, 0.2, 4);
    const strutGeo = new THREE.CylinderGeometry(0.3, 0.3, 6, 16);
    
    for (let i = 0; i <= ringCount; i++) {
        const zPos = -tubeLength/2 + i * zStep;
        
        // Outer massive structural ring
        const outerRing = new THREE.Mesh(outerRingGeo, darkHullMat);
        outerRing.position.z = zPos;
        scaffoldGroup.add(outerRing);
        
        // Inner exotic matter containment ring
        const innerRing = new THREE.Mesh(innerRingGeo, exoticMatterMat);
        innerRing.position.z = zPos;
        scaffoldGroup.add(innerRing);
        
        animatedObjects.scaffoldRings.push({ outer: outerRing, inner: innerRing, z: zPos, index: i });
        
        // Truss connectors between inner and outer rings
        for (let s = 0; s < 12; s++) {
            const theta = (s / 12) * Math.PI * 2 + (i % 2 === 0 ? 0 : Math.PI/12);
            
            // Strut
            const strut = new THREE.Mesh(strutGeo, steel);
            strut.position.set(Math.cos(theta) * (tubeRadius + 3.5), Math.sin(theta) * (tubeRadius + 3.5), zPos);
            strut.rotation.z = theta + Math.PI/2;
            scaffoldGroup.add(strut);
            
            // Casimir Plates for negative energy generation
            if (s % 3 === 0) {
                const plate = new THREE.Mesh(casimirPlateGeo, chrome);
                plate.position.set(Math.cos(theta) * (tubeRadius + 5), Math.sin(theta) * (tubeRadius + 5), zPos);
                plate.rotation.set(0, 0, theta);
                scaffoldGroup.add(plate);
                animatedObjects.casimirPlates.push({ mesh: plate, z: zPos, theta: theta });
            }
        }
        
        // Longitudinal connecting beams
        if (i < ringCount) {
            for (let b = 0; b < 6; b++) {
                const theta = (b / 6) * Math.PI * 2;
                const beamGeo = new THREE.CylinderGeometry(0.5, 0.5, zStep, 8);
                const beam = new THREE.Mesh(beamGeo, darkSteel);
                beam.position.set(Math.cos(theta) * (tubeRadius + 6), Math.sin(theta) * (tubeRadius + 6), zPos + zStep/2);
                beam.rotation.x = Math.PI / 2;
                scaffoldGroup.add(beam);
            }
        }
        
        // Registering parts for a subset to avoid overwhelming the parts array, but we'll add plenty
        if (i % 5 === 0) {
            parts.push({
                name: `Containment Ring Assembly Block ${i/5}`,
                description: `Massive macro-ring designed to compress vacuum fluctuations and extract negative energy density via the Casimir effect.`,
                material: "Dark Steel / Chrome / Exotic Matter",
                function: "Spacetime warp stabilization",
                assemblyOrder: 10 + i,
                connections: [`Ring ${i-1}`, `Ring ${i+1}`],
                failureEffect: "Metric collapse leading to macroscopic black hole formation",
                cascadeFailures: ["Adjacent Rings", "Spacetime Fabric"],
                originalPosition: {x: 0, y: 0, z: zPos},
                explodedPosition: {x: 0, y: 80 + (i%3)*20, z: zPos}
            });
        }
    }
    group.add(scaffoldGroup);

    // ============================================================================
    // 3. NEGATIVE ENERGY PULSARS (AXIAL BEAMS)
    // ============================================================================
    const pulsarGroup = new THREE.Group();
    const numPulsars = 8;
    const pulsarGeo = new THREE.CylinderGeometry(1.5, 1.5, tubeLength + 20, 32);
    
    for (let p = 0; p < numPulsars; p++) {
        const theta = (p / numPulsars) * Math.PI * 2;
        const radius = tubeRadius + 9;
        
        const pulsar = new THREE.Mesh(pulsarGeo, negativeEnergyMat);
        pulsar.rotation.x = Math.PI / 2;
        pulsar.position.set(Math.cos(theta) * radius, Math.sin(theta) * radius, 0);
        pulsarGroup.add(pulsar);
        
        // Pulsar housing rings
        for (let h = 0; h < 20; h++) {
            const hRingGeo = new THREE.TorusGeometry(2.5, 0.4, 16, 32);
            const hRing = new THREE.Mesh(hRingGeo, steel);
            hRing.rotation.x = Math.PI/2;
            hRing.rotation.y = theta;
            hRing.position.set(Math.cos(theta) * radius, Math.sin(theta) * radius, -tubeLength/2 + (h/19)*tubeLength);
            pulsarGroup.add(hRing);
        }

        animatedObjects.exoticMatterBeams.push({ mesh: pulsar, theta: theta, baseRadius: 1.5 });
        
        parts.push({
            name: `Axial Negative Energy Pulsar Array ${p}`,
            description: "Projects immense streams of exotic matter parallel to the tube to maintain the non-Minkowski metric.",
            material: "Negative Energy Plasma",
            function: "Metric generation",
            assemblyOrder: 100 + p,
            connections: ["Containment Rings"],
            failureEffect: "Tube pinch-off",
            cascadeFailures: ["Entire Tube Structure"],
            originalPosition: {x: Math.cos(theta) * radius, y: Math.sin(theta) * radius, z: 0},
            explodedPosition: {x: Math.cos(theta) * (radius + 40), y: Math.sin(theta) * (radius + 40), z: 0}
        });
    }
    group.add(pulsarGroup);

    // ============================================================================
    // 4. COMPLEX HYDRAULIC METRIC-TUNERS
    // ============================================================================
    const mechGroup = new THREE.Group();
    const cylGeo = new THREE.CylinderGeometry(0.8, 0.8, 4, 16);
    const rodGeo = new THREE.CylinderGeometry(0.4, 0.4, 5, 16);
    
    for (let i = 0; i < ringCount; i+=4) {
        const zPos = -tubeLength/2 + i * zStep;
        for (let s = 0; s < 4; s++) {
            const theta = (s / 4) * Math.PI * 2 + Math.PI/4;
            
            const pGroup = new THREE.Group();
            
            const cylinder = new THREE.Mesh(cylGeo, darkSteel);
            cylinder.rotation.z = Math.PI / 2;
            cylinder.position.x = 2;
            pGroup.add(cylinder);
            
            const rod = new THREE.Mesh(rodGeo, chrome);
            rod.rotation.z = Math.PI / 2;
            rod.position.x = 4;
            pGroup.add(rod);
            
            pGroup.position.set(Math.cos(theta) * (tubeRadius + 6), Math.sin(theta) * (tubeRadius + 6), zPos);
            pGroup.rotation.z = theta;
            mechGroup.add(pGroup);
            
            animatedObjects.hydraulics.push({
                rod: rod,
                baseX: 4,
                offset: i * 0.2 + s
            });
        }
    }
    group.add(mechGroup);
    
    parts.push({
        name: "Macro-Hydraulic Metric Tuners",
        description: "Massive physical pistons that micro-adjust the position of exotic matter containment fields to prevent quantum vacuum divergence.",
        material: "Adamantium / Chrome",
        function: "Resonance dampening",
        assemblyOrder: 150,
        connections: ["Outer Scaffold"],
        failureEffect: "Quantum instability build up",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -40, z: 0}
    });

    // ============================================================================
    // 5. LIGHT CONE VISUALIZERS (SHOWING THE TIPPING OF SPACETIME)
    // ============================================================================
    const lightConeGroup = new THREE.Group();
    const normalConeGeo = new THREE.ConeGeometry(4, 8, 32);
    const tippedConeGeo = new THREE.ConeGeometry(4, 8, 32);
    
    for (let c = 0; c < 20; c++) {
        const z = -tubeLength/2 + (c / 19) * tubeLength;
        
        // Normal light cone outside the tube
        const outerCone = new THREE.Mesh(normalConeGeo, neonBlueMat);
        outerCone.position.set(tubeRadius + 20, 0, z);
        outerCone.rotation.x = Math.PI / 2; // Pointing "forward" in time (Z axis)
        lightConeGroup.add(outerCone);
        
        // Distorted light cone inside the tube
        const innerCone = new THREE.Mesh(tippedConeGeo, neonRedMat);
        innerCone.position.set(tubeRadius - 10, 0, z);
        innerCone.rotation.x = Math.PI / 2;
        lightConeGroup.add(innerCone);
        
        animatedObjects.lightCones.push({
            outer: outerCone,
            inner: innerCone,
            z: z
        });
    }
    group.add(lightConeGroup);

    parts.push({
        name: "Null Geodesic Holographic Array",
        description: "Projects real-time representations of local light cones. Inside the tube, the cones tip over, allowing paths to point backwards in global coordinate time.",
        material: "Photonic",
        function: "Navigation Telemetry",
        assemblyOrder: 160,
        connections: [],
        failureEffect: "Navigational hazard, flying into a singularity",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -60, y: 0, z: 0}
    });

    // ============================================================================
    // 6. THE COURIER SPACECRAFT (ULTRA DETAILED)
    // ============================================================================
    const shipGroup = new THREE.Group();
    
    // Main fuselage (Lathe Geometry for sleekness)
    const points = [];
    for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        const radius = Math.sin(t * Math.PI) * 3;
        const height = t * 30 - 15;
        points.push(new THREE.Vector2(radius, height));
    }
    const fuselageGeo = new THREE.LatheGeometry(points, 32);
    const fuselage = new THREE.Mesh(fuselageGeo, hullMat);
    fuselage.rotation.x = -Math.PI / 2; // point forward along Z
    shipGroup.add(fuselage);

    // Operator Cabin (Tinted glass)
    const cabinGeo = new THREE.BoxGeometry(4, 2, 8);
    const cabin = new THREE.Mesh(cabinGeo, tinted);
    cabin.position.set(0, 2, 5);
    shipGroup.add(cabin);

    // Warp Coils / Alcubierre Hybrid Rings on the ship
    for (let w = 0; w < 5; w++) {
        const coilGeo = new THREE.TorusGeometry(4 + w*0.2, 0.5, 16, 64);
        const coil = new THREE.Mesh(coilGeo, chrome);
        coil.position.z = -5 + w * 2.5;
        shipGroup.add(coil);
        animatedObjects.shipWarpCoils.push(coil);
    }

    // Engine Block
    const engineBlockGeo = new THREE.CylinderGeometry(2, 3, 6, 8);
    const engineBlock = new THREE.Mesh(engineBlockGeo, darkSteel);
    engineBlock.rotation.x = Math.PI / 2;
    engineBlock.position.z = -15;
    shipGroup.add(engineBlock);

    // Main Thrusters
    for (let t = 0; t < 3; t++) {
        const theta = (t / 3) * Math.PI * 2;
        const tGeo = new THREE.CylinderGeometry(1, 0.2, 4, 16);
        const thruster = new THREE.Mesh(tGeo, copper);
        thruster.rotation.x = Math.PI / 2;
        thruster.position.set(Math.cos(theta)*1.5, Math.sin(theta)*1.5, -19);
        shipGroup.add(thruster);

        // Exhaust Plume
        const plumeGeo = new THREE.ConeGeometry(0.8, 15, 16);
        const plume = new THREE.Mesh(plumeGeo, negativeEnergyMat);
        plume.rotation.x = -Math.PI / 2;
        plume.position.set(Math.cos(theta)*1.5, Math.sin(theta)*1.5, -28);
        shipGroup.add(plume);
        animatedObjects.shipThrusters.push(plume);
    }
    
    // Side pylons
    for (let p = 0; p < 2; p++) {
        const sign = p === 0 ? 1 : -1;
        const pylonGeo = new THREE.BoxGeometry(8, 0.5, 4);
        const pylon = new THREE.Mesh(pylonGeo, steel);
        pylon.position.set(sign * 6, 0, -5);
        pylon.rotation.z = sign * Math.PI / 12;
        shipGroup.add(pylon);
        
        const emitterGeo = new THREE.SphereGeometry(1, 16, 16);
        const emitter = new THREE.Mesh(emitterGeo, cherenkovMat);
        emitter.position.set(sign * 10, 0, -5);
        shipGroup.add(emitter);
        animatedObjects.tachyonEmitters.push(emitter);
    }

    shipGroup.position.z = -tubeLength/2;
    group.add(shipGroup);
    animatedObjects.ship = shipGroup;

    parts.push({
        name: "Superluminal Courier Vessel",
        description: "A highly advanced spacecraft equipped with tachyon emitters. It traverses the Krasnikov tube, riding the modified metric to achieve effective FTL travel.",
        material: "Neutronium Alloy / Chrono-glass",
        function: "Payload delivery",
        assemblyOrder: 200,
        connections: ["Free floating within channel"],
        failureEffect: "Ship annihilated by tidal forces",
        cascadeFailures: ["Tube instability from explosion"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 150, z: 0}
    });

    // ============================================================================
    // 7. CHERENKOV RADIATION PARTICLE SWARM (Using InstancedMesh)
    // ============================================================================
    const particleCount = 5000;
    const pGeo = new THREE.BoxGeometry(0.1, 0.1, 6);
    const pMat = new THREE.MeshBasicMaterial({ 
        color: 0x0088ff, 
        transparent: true, 
        opacity: 0.8, 
        blending: THREE.AdditiveBlending 
    });
    
    const particleSystem = new THREE.InstancedMesh(pGeo, pMat, particleCount);
    const dummyNode = new THREE.Object3D();
    const pData = [];
    
    for (let i = 0; i < particleCount; i++) {
        // Distribute particles mainly inside the tube
        const radius = Math.random() * (tubeRadius - 5);
        const theta = Math.random() * Math.PI * 2;
        const z = -tubeLength/2 + Math.random() * tubeLength;
        const speed = 2 + Math.random() * 5;
        
        dummyNode.position.set(Math.cos(theta)*radius, Math.sin(theta)*radius, z);
        dummyNode.updateMatrix();
        particleSystem.setMatrixAt(i, dummyNode.matrix);
        
        pData.push({ radius, theta, z, speed });
    }
    
    particleSystem.instanceMatrix.needsUpdate = true;
    group.add(particleSystem);
    
    animatedObjects.radiationParticles = {
        mesh: particleSystem,
        data: pData,
        dummy: dummyNode
    };

    parts.push({
        name: "Cherenkov Vacuum Radiation",
        description: "Photons emitted as the ship travels faster than the phase velocity of light in the modified vacuum of the tube.",
        material: "Photonic",
        function: "Energy bleed-off",
        assemblyOrder: 210,
        connections: [],
        failureEffect: "Thermal overloading of the exotic matter scaffold",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 200, z: 0}
    });

    // ============================================================================
    // METADATA & QUIZ
    // ============================================================================
    const description = "The God Tier Krasnikov Tube Spacetime Channel is a colossal megastructure that artificially distorts the fabric of the universe along its length. By laying down a permanent wake of exotic matter and negative energy, it alters the local metric tensor, tipping the light cones. This allows a spacecraft to travel back along the tube and arrive shortly after it left, enabling effective superluminal travel without the horizon problems of an Alcubierre drive. This highly complex model visualizes the exotic matter containment rings, negative energy pulsars, macro-hydraulic metric tuners, null geodesic holograms, and a tachyon-emitting courier spacecraft traversing the modified vacuum amidst intense Cherenkov radiation.";

    const quizQuestions = [
        {
            question: "Unlike the Alcubierre drive, what fundamental advantage does the Krasnikov tube provide to the crew regarding control and causality?",
            options: [
                "It uses less energy than an Alcubierre drive by a factor of 10^10.",
                "It can be built without exotic matter.",
                "The ship does not have to carry a distortion bubble; the tube is laid down subluminally, ensuring the crew always remains in causal contact with the metric they are modifying.",
                "The Krasnikov tube shields the crew from Hawking radiation perfectly."
            ],
            correctAnswer: 2,
            explanation: "The Alcubierre drive suffers from the 'horizon problem' where the front of the warp bubble is causally disconnected from the ship. The Krasnikov tube avoids this by having the ship lay down the modified spacetime in its wake at subluminal speeds. The superluminal effect only applies to the return journey through the already established tube."
        },
        {
            question: "To theoretically stabilize a Krasnikov tube, what type of energy distribution is strictly required, violating standard energy conditions?",
            options: [
                "High density positive mass (like a neutron star).",
                "A distribution of negative energy density (exotic matter).",
                "Pure electromagnetic plasma.",
                "Dark matter halos."
            ],
            correctAnswer: 1,
            explanation: "Like traversing wormholes and warp drives, a Krasnikov tube requires regions of negative energy density to distort spacetime in the required manner, thereby violating the Weak and Null Energy Conditions."
        },
        {
            question: "How is the local light cone geometry fundamentally altered inside the Krasnikov tube for a returning spacecraft?",
            options: [
                "The light cones are narrowed to a singular line.",
                "The light cones are inverted 180 degrees into the past.",
                "The light cones are expanded to encompass all space.",
                "The light cones are 'tipped' over along the axis of the tube, allowing a globally spacelike trajectory to be locally timelike."
            ],
            correctAnswer: 3,
            explanation: "The metric is tailored to tip the future light cones along the path of the tube. This allows a trajectory that points 'backwards' in coordinate time (relative to flat space outside) to still remain within the future light cone of the traveler."
        },
        {
            question: "What catastrophic event is predicted by semiclassical gravity if two intersecting Krasnikov tubes are arranged to form a Closed Timelike Curve (time machine)?",
            options: [
                "Spontaneous disintegration into tachyons.",
                "A quantum vacuum divergence: vacuum fluctuations loop infinitely, continuously blue-shifting and destroying the structure.",
                "The creation of a stable, traversable wormhole.",
                "The universe undergoes a false vacuum decay."
            ],
            correctAnswer: 1,
            explanation: "According to Hawking's Chronology Protection Conjecture, right before a Closed Timelike Curve is formed, vacuum fluctuations would circulate through the loop infinitely, generating a divergent energy density that destroys the time machine before it can function."
        },
        {
            question: "What physical mechanism is most often cited as a theoretical source for the 'exotic matter' needed to construct such a macrostructure?",
            options: [
                "Nuclear fusion.",
                "Antimatter annihilation.",
                "The Casimir effect and squeezed quantum states.",
                "Hawking radiation from primordial black holes."
            ],
            correctAnswer: 2,
            explanation: "The Casimir effect and certain squeezed states of light are known physical phenomena that exhibit localized negative energy densities relative to the surrounding vacuum, making them the primary candidate mechanisms for generating exotic matter."
        }
    ];

    // ============================================================================
    // EXTREME ANIMATION LOGIC
    // ============================================================================
    const animate = (time, speed = 1) => {
        const t = time * speed;
        
        // 1. Spacetime Grid Waving (Simulating metric fluctuations)
        animatedObjects.spacetimeGridLines.forEach(line => {
            if (line.type === 'ring') {
                const scale = 1 + Math.sin(t * 3 + line.zOrig * 0.05) * 0.02;
                line.mesh.scale.set(scale, scale, 1);
                
                // Color pulse based on distortion
                const intensity = Math.abs(Math.sin(t * 2 + line.zOrig * 0.02));
                line.mesh.material.color.setHSL(0.6 - intensity * 0.1, 1, 0.5 + intensity * 0.3);
            }
            if (line.type === 'long') {
                const positions = line.mesh.geometry.attributes.position.array;
                for (let k = 0; k <= numRings; k++) {
                    const z = -tubeLength/2 + (k / numRings) * tubeLength;
                    // Standing wave interference pattern
                    const wave1 = Math.sin(t * 4 + z * 0.1) * 0.5;
                    const wave2 = Math.cos(t * 2 - z * 0.05) * 0.5;
                    const r = tubeRadius + wave1 + wave2;
                    
                    positions[k * 3] = Math.cos(line.theta) * r;
                    positions[k * 3 + 1] = Math.sin(line.theta) * r;
                }
                line.mesh.geometry.attributes.position.needsUpdate = true;
            }
        });

        // 2. Courier Ship Traversal Loop
        if (animatedObjects.ship) {
            // Ship travels backwards down the Z axis (the 'return' trip through the tube)
            const cycleDuration = 4.0; 
            const progress = (t % cycleDuration) / cycleDuration;
            const shipZ = tubeLength/2 - progress * tubeLength; // moving from +Z to -Z
            
            animatedObjects.ship.position.z = shipZ;
            animatedObjects.ship.rotation.z = t * 3; // intense rolling
            
            // Ship engine pulsing
            animatedObjects.shipThrusters.forEach((thruster, idx) => {
                thruster.scale.y = 1 + Math.random() * 1.5;
                thruster.scale.x = 1 + Math.sin(t*20 + idx) * 0.2;
                thruster.scale.z = 1 + Math.sin(t*20 + idx) * 0.2;
                thruster.material.emissiveIntensity = 5 + Math.random() * 5;
            });
            
            // Ship warp coil sequencing
            animatedObjects.shipWarpCoils.forEach((coil, idx) => {
                coil.rotation.x = t * 5 * (idx % 2 === 0 ? 1 : -1);
                coil.rotation.y = t * 3;
                coil.scale.setScalar(1 + Math.sin(t * 10 + idx) * 0.1);
            });
            
            // Tachyon emitters pulsing
            animatedObjects.tachyonEmitters.forEach(emitter => {
                emitter.scale.setScalar(1 + Math.random() * 1.5);
                emitter.material.color.setHex(Math.random() > 0.5 ? 0xffffff : 0x0088ff);
            });

            // 3. Ring Response to Ship Passage (The metric dynamically responding)
            animatedObjects.scaffoldRings.forEach(ringObj => {
                const dist = Math.abs(ringObj.z - shipZ);
                
                // Outer ring counter-rotation
                ringObj.outer.rotation.z = t * 0.5 + ringObj.index * 0.1;
                ringObj.inner.rotation.z = -t * 1.0 - ringObj.index * 0.1;
                
                if (dist < 30) {
                    // Extreme reaction near the ship
                    const influence = 1 - (dist / 30);
                    ringObj.inner.scale.setScalar(1 + influence * 0.2);
                    ringObj.inner.material.emissiveIntensity = 4.0 + influence * 10.0;
                    ringObj.inner.material.color.setHex(0xffffff);
                    
                    ringObj.outer.scale.setScalar(1 + influence * 0.05);
                } else {
                    // Idle state
                    ringObj.inner.scale.setScalar(1);
                    ringObj.inner.material.emissiveIntensity = 4.0 + Math.sin(t * 5 + ringObj.index * 0.2) * 1.5;
                    ringObj.inner.material.color.setHex(0x9900ff);
                    
                    ringObj.outer.scale.setScalar(1);
                }
            });
            
            // 4. Light Cones tipping drastically near the ship
            animatedObjects.lightCones.forEach(coneObj => {
                const dist = coneObj.z - shipZ; // distance vector
                
                if (Math.abs(dist) < 40) {
                    const influence = 1 - (Math.abs(dist) / 40);
                    // The inner light cone tips open in the direction of travel
                    // Normal orientation is Math.PI/2. We tip it towards 0 or PI.
                    const tipAngle = (Math.PI / 2) * influence * Math.sign(dist);
                    coneObj.inner.rotation.y = tipAngle; 
                    coneObj.inner.scale.setScalar(1 + influence * 0.8);
                    coneObj.inner.material.color.setHex(0xffffff);
                } else {
                    // Return to static tipped state
                    coneObj.inner.rotation.y = Math.PI / 4; 
                    coneObj.inner.scale.setScalar(1);
                    coneObj.inner.material.color.setHex(0xff0000);
                }
                
                // Outer cone just bobs
                coneObj.outer.rotation.z = t + coneObj.z * 0.01;
            });
        }

        // 5. Negative Energy Beams Pulsing
        animatedObjects.exoticMatterBeams.forEach((beam, idx) => {
            const pulse = Math.sin(t * 10 + beam.theta * 2);
            beam.mesh.scale.x = 1 + pulse * 0.3;
            beam.mesh.scale.z = 1 + pulse * 0.3;
            beam.mesh.material.emissiveIntensity = 6.0 + pulse * 3.0;
        });

        // 6. Hydraulic Metric Tuners Pumping
        animatedObjects.hydraulics.forEach(hyd => {
            // Complex non-linear pumping motion
            const pump = Math.sin(t * 8 + hyd.offset) * Math.cos(t * 3 - hyd.offset);
            hyd.rod.position.x = hyd.baseX + pump * 0.8;
        });
        
        // 7. Casimir Plates Vibrating
        animatedObjects.casimirPlates.forEach(plateData => {
            plateData.mesh.position.x = Math.cos(plateData.theta) * (tubeRadius + 5 + Math.random()*0.2 - 0.1);
            plateData.mesh.position.y = Math.sin(plateData.theta) * (tubeRadius + 5 + Math.random()*0.2 - 0.1);
            plateData.mesh.material.emissiveIntensity = Math.random() * 2;
        });

        // 8. Cherenkov Radiation System Streaming
        const pSys = animatedObjects.radiationParticles;
        for (let i = 0; i < particleCount; i++) {
            const p = pSys.data[i];
            
            // Move opposite to ship direction to simulate relative velocity
            p.z += p.speed * speed * 25; 
            
            if (p.z > tubeLength/2) {
                p.z = -tubeLength/2;
                p.radius = Math.random() * (tubeRadius - 2);
            }
            
            // Vortex swirling
            p.theta += p.speed * 0.02 * speed;
            
            // Perturb based on ship proximity if ship exists
            let localRadius = p.radius;
            if (animatedObjects.ship) {
                const sDist = Math.abs(p.z - animatedObjects.ship.position.z);
                if (sDist < 20) {
                    localRadius += (20 - sDist) * 0.5; // push outwards
                }
            }
            
            pSys.dummy.position.set(Math.cos(p.theta)*localRadius, Math.sin(p.theta)*localRadius, p.z);
            pSys.dummy.rotation.set(0, 0, p.theta); // orient to center
            pSys.dummy.updateMatrix();
            pSys.mesh.setMatrixAt(i, pSys.dummy.matrix);
        }
        pSys.mesh.instanceMatrix.needsUpdate = true;
    };

    return { group, parts, description, quizQuestions, animate };
}
