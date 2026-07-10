import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const updatables = []; 

    // =========================================================================
    // 1. ADVANCED MATERIAL & SHADER DEFINITIONS
    // =========================================================================
    
    // Emissive materials for the star, lasers, and quantum components
    const starCoreMaterial = new THREE.MeshStandardMaterial({
        color: 0xffeebb,
        emissive: 0xffaa00,
        emissiveIntensity: 8.0,
        roughness: 0.2,
        metalness: 0.1,
    });

    const starCoronaMaterial = new THREE.MeshStandardMaterial({
        color: 0xff5500,
        emissive: 0xff2200,
        emissiveIntensity: 4.0,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const laserCoreMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 25.0,
        transparent: true,
        opacity: 0.95
    });

    const laserAuraMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const dataRingMaterial = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 10.0,
        transparent: true,
        opacity: 0.8,
        wireframe: true
    });

    const screenMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 2.0
    });

    const swarmLaserMaterial = new THREE.MeshStandardMaterial({
        color: 0xffddaa,
        emissive: 0xffaa44,
        emissiveIntensity: 6.0,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    // =========================================================================
    // 2. HELPER FUNCTIONS FOR HYPER-REALISTIC GEOMETRIES
    // =========================================================================

    // Generates an extremely detailed off-road tire using Torus and Box lugs
    function createOffRoadTire(radius, tube, lugCount, lugSize) {
        const tireGroup = new THREE.Group();
        
        // Main Torus (Base tire)
        const torusGeo = new THREE.TorusGeometry(radius, tube, 32, 128);
        const torusMesh = new THREE.Mesh(torusGeo, rubber);
        tireGroup.add(torusMesh);
        
        // Lugs for aggressive off-road treads
        const lugGeo = new THREE.BoxGeometry(lugSize.x, lugSize.y, lugSize.z);
        const instancedLugs = new THREE.InstancedMesh(lugGeo, rubber, lugCount);
        const dummy = new THREE.Object3D();
        
        for (let i = 0; i < lugCount; i++) {
            const angle = (i / lugCount) * Math.PI * 2;
            const dist = radius + tube - 0.05; // slightly embedded
            
            dummy.position.set(Math.cos(angle) * dist, Math.sin(angle) * dist, 0);
            dummy.rotation.set(0, 0, angle);
            
            // Staggered lug pattern for extreme realism
            if (i % 2 === 0) {
                dummy.position.z += tube * 0.4;
                dummy.rotation.y += 0.2;
            } else {
                dummy.position.z -= tube * 0.4;
                dummy.rotation.y -= 0.2;
            }
            
            dummy.updateMatrix();
            instancedLugs.setMatrixAt(i, dummy.matrix);
        }
        tireGroup.add(instancedLugs);
        
        // Intricate Rim Design
        const rimRadius = radius - tube * 0.5;
        const rimGeo = new THREE.CylinderGeometry(rimRadius, rimRadius, tube * 1.5, 64);
        rimGeo.rotateX(Math.PI / 2);
        const rimMesh = new THREE.Mesh(rimGeo, chrome);
        tireGroup.add(rimMesh);
        
        // Complex Spoke Array
        const spokeGeo = new THREE.CylinderGeometry(tube * 0.1, tube * 0.1, rimRadius * 2, 16);
        spokeGeo.rotateX(Math.PI / 2);
        const numSpokes = 16;
        const instancedSpokes = new THREE.InstancedMesh(spokeGeo, darkSteel, numSpokes);
        for(let i = 0; i < numSpokes; i++) {
            dummy.position.set(0,0,0);
            dummy.rotation.set(0, 0, (i / numSpokes) * Math.PI);
            dummy.updateMatrix();
            instancedSpokes.setMatrixAt(i, dummy.matrix);
        }
        tireGroup.add(instancedSpokes);
        
        // Add hubcap
        const hubGeo = new THREE.CylinderGeometry(tube * 0.4, tube * 0.5, tube * 1.6, 32);
        hubGeo.rotateX(Math.PI / 2);
        const hubMesh = new THREE.Mesh(hubGeo, aluminum);
        tireGroup.add(hubMesh);

        return tireGroup;
    }

    // Generates a complex hydraulic piston mechanism
    function createHydraulicPiston(length, radius) {
        const pistonGroup = new THREE.Group();
        
        // Outer Cylinder (Housing)
        const outerGeo = new THREE.CylinderGeometry(radius, radius, length * 0.6, 32);
        const outerMesh = new THREE.Mesh(outerGeo, darkSteel);
        outerMesh.position.y = length * 0.3;
        pistonGroup.add(outerMesh);
        
        // Inner Cylinder (Rod)
        const innerGeo = new THREE.CylinderGeometry(radius * 0.6, radius * 0.6, length * 0.8, 32);
        const innerMesh = new THREE.Mesh(innerGeo, chrome);
        innerMesh.position.y = length * 0.7; // Extends outwards
        pistonGroup.add(innerMesh);
        
        // Hydraulic lines winding around
        class LineCurve extends THREE.Curve {
            constructor() { super(); }
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const x = Math.sin(t * Math.PI * 4) * (radius * 1.2);
                const y = t * length * 0.5 + (length * 0.05);
                const z = Math.cos(t * Math.PI * 4) * (radius * 1.2);
                return optionalTarget.set(x, y, z);
            }
        }
        const lineGeo = new THREE.TubeGeometry(new LineCurve(), 64, radius * 0.1, 8, false);
        const lineMesh = new THREE.Mesh(lineGeo, rubber);
        pistonGroup.add(lineMesh);
        
        // Base mount
        const mountGeo = new THREE.BoxGeometry(radius * 3, radius * 0.5, radius * 3);
        const mountMesh = new THREE.Mesh(mountGeo, steel);
        pistonGroup.add(mountMesh);

        return pistonGroup;
    }

    // Generates a highly detailed operator cabin
    function createOperatorCabin() {
        const cabinGroup = new THREE.Group();
        
        // Main Hull (Extruded Tech Shape)
        const hullShape = new THREE.Shape();
        hullShape.moveTo(-2, 0);
        hullShape.lineTo(2, 0);
        hullShape.lineTo(2.5, 2);
        hullShape.lineTo(1.5, 4);
        hullShape.lineTo(-1.5, 4);
        hullShape.lineTo(-2.5, 2);
        hullShape.lineTo(-2, 0);
        
        const extrudeSettings = { depth: 4, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };
        const hullGeo = new THREE.ExtrudeGeometry(hullShape, extrudeSettings);
        hullGeo.translate(0, 0, -2);
        const hullMesh = new THREE.Mesh(hullGeo, steel);
        cabinGroup.add(hullMesh);
        
        // Tinted Glass Windshield
        const glassGeo = new THREE.BoxGeometry(3.8, 1.8, 4.2);
        const glassMesh = new THREE.Mesh(glassGeo, tinted);
        glassMesh.position.set(0, 2.5, 0);
        cabinGroup.add(glassMesh);
        
        // Interior Details (Visible through glass)
        // Steering wheel (Torus)
        const wheelGeo = new THREE.TorusGeometry(0.4, 0.05, 16, 32);
        const wheelMesh = new THREE.Mesh(wheelGeo, plastic);
        wheelMesh.rotation.x = Math.PI / 4;
        wheelMesh.position.set(0, 1.5, 1);
        cabinGroup.add(wheelMesh);
        
        // Control Panels (Glowing screens)
        const panelGeo = new THREE.BoxGeometry(2, 0.5, 0.1);
        const panelMesh = new THREE.Mesh(panelGeo, screenMaterial);
        panelMesh.rotation.x = -Math.PI / 6;
        panelMesh.position.set(0, 1.2, 1.5);
        cabinGroup.add(panelMesh);
        
        // Joysticks (Small cylinders)
        const stickGeo = new THREE.CylinderGeometry(0.02, 0.05, 0.4, 16);
        const stick1 = new THREE.Mesh(stickGeo, chrome);
        stick1.position.set(-0.8, 1.4, 1.2);
        stick1.rotation.x = Math.PI / 8;
        const stick2 = stick1.clone();
        stick2.position.set(0.8, 1.4, 1.2);
        cabinGroup.add(stick1);
        cabinGroup.add(stick2);
        
        // Grilles on the back
        const grilleGeo = new THREE.BoxGeometry(2.5, 2, 0.1);
        const grilleMesh = new THREE.Mesh(grilleGeo, darkSteel);
        grilleMesh.position.set(0, 1, -2.05);
        cabinGroup.add(grilleMesh);
        
        // Ladder on the side
        const ladderGroup = new THREE.Group();
        const railGeo = new THREE.CylinderGeometry(0.05, 0.05, 4, 8);
        const rail1 = new THREE.Mesh(railGeo, aluminum);
        rail1.position.set(-0.3, 0, 0);
        const rail2 = new THREE.Mesh(railGeo, aluminum);
        rail2.position.set(0.3, 0, 0);
        ladderGroup.add(rail1, rail2);
        
        const rungGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.6, 8);
        rungGeo.rotateZ(Math.PI / 2);
        for(let i=0; i<8; i++) {
            const rung = new THREE.Mesh(rungGeo, aluminum);
            rung.position.y = -1.8 + i * 0.5;
            ladderGroup.add(rung);
        }
        ladderGroup.position.set(-2.6, 2, 0);
        cabinGroup.add(ladderGroup);

        return cabinGroup;
    }

    // Generates a massive Orbital Tractor for maintenance
    function createOrbitalTractor() {
        const tractorGroup = new THREE.Group();
        
        // Main Chassis
        const chassisGeo = new THREE.BoxGeometry(10, 2, 16);
        const chassisMesh = new THREE.Mesh(chassisGeo, darkSteel);
        chassisMesh.position.y = 3;
        tractorGroup.add(chassisMesh);
        
        // 4 Massive Off-Road Tires
        const tirePos = [
            [-5.5, 2.5, 6], [5.5, 2.5, 6],
            [-5.5, 2.5, -6], [5.5, 2.5, -6]
        ];
        
        tirePos.forEach((pos, index) => {
            const tire = createOffRoadTire(2.0, 0.8, 150, new THREE.Vector3(1.2, 0.5, 2.0));
            tire.position.set(pos[0], pos[1], pos[2]);
            if(index % 2 !== 0) tire.rotation.y = Math.PI; // Flip right side tires
            tractorGroup.add(tire);
        });
        
        // Hydraulic Suspensions connecting tires to chassis
        tirePos.forEach(pos => {
            const piston = createHydraulicPiston(3, 0.4);
            piston.position.set(pos[0] * 0.8, 0, pos[2]);
            tractorGroup.add(piston);
        });
        
        // Operator Cabin mounted on top
        const cabin = createOperatorCabin();
        cabin.position.set(0, 4, 4);
        tractorGroup.add(cabin);
        
        // Exhaust Stacks
        const exhaustGeo = new THREE.CylinderGeometry(0.4, 0.4, 4, 16);
        const exhaust1 = new THREE.Mesh(exhaustGeo, chrome);
        exhaust1.position.set(-4, 6, -4);
        const exhaust2 = exhaust1.clone();
        exhaust2.position.set(4, 6, -4);
        tractorGroup.add(exhaust1, exhaust2);

        // Side mirrors
        const mirrorGeo = new THREE.BoxGeometry(0.2, 1, 0.5);
        const mirror1 = new THREE.Mesh(mirrorGeo, chrome);
        mirror1.position.set(-3, 6, 4);
        const mirror2 = mirror1.clone();
        mirror2.position.set(3, 6, 4);
        tractorGroup.add(mirror1, mirror2);

        return tractorGroup;
    }

    // =========================================================================
    // 3. SYSTEM ASSEMBLY: CENTRAL STAR
    // =========================================================================
    const systemScale = 1; // Used to scale entire scene if needed
    const starRadius = 200;
    const starGroup = new THREE.Group();
    
    const coreGeo = new THREE.SphereGeometry(starRadius, 128, 128);
    const starCore = new THREE.Mesh(coreGeo, starCoreMaterial);
    starGroup.add(starCore);
    
    // Multiple layered coronas
    const coronaGeo1 = new THREE.SphereGeometry(starRadius * 1.05, 64, 64);
    const corona1 = new THREE.Mesh(coronaGeo1, starCoronaMaterial);
    starGroup.add(corona1);
    
    const coronaGeo2 = new THREE.SphereGeometry(starRadius * 1.12, 64, 64);
    const corona2 = new THREE.Mesh(coronaGeo2, starCoronaMaterial);
    starGroup.add(corona2);

    // Solar Flares (Dynamic Tubes)
    const flareCount = 12;
    const flares = [];
    for(let i=0; i<flareCount; i++) {
        class FlareCurve extends THREE.Curve {
            constructor() { super(); }
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const angle = t * Math.PI;
                const r = starRadius + Math.sin(angle) * (100 + Math.random() * 100);
                const x = Math.cos(angle) * r;
                const y = Math.sin(angle) * r;
                const z = 0;
                return optionalTarget.set(x, y, z);
            }
        }
        const flareGeo = new THREE.TubeGeometry(new FlareCurve(), 64, 5 + Math.random() * 5, 16, false);
        const flareMesh = new THREE.Mesh(flareGeo, starCoronaMaterial);
        
        // Randomly orient flares
        flareMesh.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
        starGroup.add(flareMesh);
        flares.push({ mesh: flareMesh, speed: 0.2 + Math.random() * 0.5 });
    }
    
    group.add(starGroup);

    // =========================================================================
    // 4. SYSTEM ASSEMBLY: DYSON SWARM (INSTANCED MESH)
    // =========================================================================
    const dysonSwarmCount = 15000;
    const swarmGroup = new THREE.Group();
    
    // Complex Satellite Geometry (Merged via code logically for the instance)
    // We will use multiple InstancedMeshes to give multi-material to the swarm
    
    // Body (Extrude)
    const satShape = new THREE.Shape();
    satShape.moveTo(0, 2); satShape.lineTo(1, 1); satShape.lineTo(1, -1);
    satShape.lineTo(0, -2); satShape.lineTo(-1, -1); satShape.lineTo(-1, 1);
    const satExtrude = { depth: 4, bevelEnabled: true, bevelThickness: 0.2, bevelSize: 0.2, bevelSegments: 2 };
    const satBodyGeo = new THREE.ExtrudeGeometry(satShape, satExtrude);
    satBodyGeo.translate(0, 0, -2);
    
    // Solar Panels (Planes)
    const panelGeo = new THREE.BoxGeometry(12, 0.2, 4);
    
    // Emitter (Cylinder)
    const emitterGeo = new THREE.CylinderGeometry(0.5, 0.5, 4, 16);
    emitterGeo.rotateX(Math.PI / 2); // point along Z
    emitterGeo.translate(0, 0, 4);

    const swarmBodyInstanced = new THREE.InstancedMesh(satBodyGeo, steel, dysonSwarmCount);
    const swarmPanelInstanced = new THREE.InstancedMesh(panelGeo, glass, dysonSwarmCount); // highly reflective glass for panels
    const swarmEmitterInstanced = new THREE.InstancedMesh(emitterGeo, copper, dysonSwarmCount);
    
    // Swarm Lasers pointing to node
    const swarmLaserGeo = new THREE.CylinderGeometry(0.2, 0.2, 1, 8);
    swarmLaserGeo.rotateX(Math.PI / 2); // point along Z
    swarmLaserGeo.translate(0, 0, 0.5); // base at origin, extends to +Z
    const swarmLaserInstanced = new THREE.InstancedMesh(swarmLaserGeo, swarmLaserMaterial, dysonSwarmCount);

    const swarmData = [];
    const dummy = new THREE.Object3D();
    
    // Pre-calculate orbits
    for (let i = 0; i < dysonSwarmCount; i++) {
        // Orbit radius between 400 and 1200
        const radius = 400 + Math.random() * 800;
        // Orbit angles
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        // Orbital speed
        const speed = (0.001 + Math.random() * 0.004) * (Math.random() > 0.5 ? 1 : -1);
        
        swarmData.push({ radius, theta, phi, speed });
    }
    
    swarmGroup.add(swarmBodyInstanced);
    swarmGroup.add(swarmPanelInstanced);
    swarmGroup.add(swarmEmitterInstanced);
    swarmGroup.add(swarmLaserInstanced);
    group.add(swarmGroup);

    // =========================================================================
    // 5. SYSTEM ASSEMBLY: FOCUSING NODE (THE COLLECTOR)
    // =========================================================================
    const nodePos = new THREE.Vector3(0, 2000, 0);
    const nodeGroup = new THREE.Group();
    nodeGroup.position.copy(nodePos);
    
    // Core Lens System
    const lensRadius = 150;
    const lensGeo = new THREE.SphereGeometry(lensRadius, 64, 64);
    // Flatten it to look like a convex lens
    lensGeo.scale(1, 0.2, 1);
    const primaryLens = new THREE.Mesh(lensGeo, glass);
    nodeGroup.add(primaryLens);
    
    const secondaryLens = new THREE.Mesh(lensGeo, tinted);
    secondaryLens.position.y = 100;
    secondaryLens.scale.set(0.8, 0.8, 0.8);
    nodeGroup.add(secondaryLens);

    // Containment Rings (Nested Toruses with gear teeth)
    const ringGroup = new THREE.Group();
    const ringRadii = [250, 320, 400, 500];
    const rings = [];
    
    ringRadii.forEach((r, idx) => {
        const ringGeo = new THREE.TorusGeometry(r, 20 + idx * 5, 32, 128);
        const ringMesh = new THREE.Mesh(ringGeo, steel);
        
        // Add intricate teeth/cooling fins to rings
        const finGeo = new THREE.BoxGeometry(30, 40 + idx * 10, 10);
        const numFins = 60 + idx * 20;
        const instancedFins = new THREE.InstancedMesh(finGeo, darkSteel, numFins);
        for(let i=0; i<numFins; i++) {
            const angle = (i/numFins) * Math.PI * 2;
            dummy.position.set(Math.cos(angle) * r, 0, Math.sin(angle) * r);
            dummy.rotation.set(0, -angle, 0);
            dummy.updateMatrix();
            instancedFins.setMatrixAt(i, dummy.matrix);
        }
        
        const subGroup = new THREE.Group();
        subGroup.add(ringMesh);
        subGroup.add(instancedFins);
        subGroup.rotation.x = Math.PI / 2;
        ringGroup.add(subGroup);
        rings.push({ mesh: subGroup, speed: (idx % 2 === 0 ? 1 : -1) * (0.01 - idx * 0.002) });
    });
    nodeGroup.add(ringGroup);

    // Structural Lattice connecting rings to core
    const strutGeo = new THREE.CylinderGeometry(5, 5, 500, 16);
    strutGeo.rotateX(Math.PI / 2);
    for(let i=0; i<8; i++) {
        const angle = (i/8) * Math.PI * 2;
        const strut = new THREE.Mesh(strutGeo, aluminum);
        strut.position.set(Math.cos(angle) * 250, 0, Math.sin(angle) * 250);
        strut.rotation.y = -angle;
        nodeGroup.add(strut);
    }

    // Add Orbital Tractors driving on the outer containment ring!
    const outerRingRadius = 500;
    for(let i=0; i<4; i++) {
        const tractor = createOrbitalTractor();
        const angle = (i/4) * Math.PI * 2 + Math.PI/4;
        
        tractor.position.set(Math.cos(angle) * outerRingRadius, 40, Math.sin(angle) * outerRingRadius);
        // orient them driving around the ring
        tractor.rotation.y = -angle + Math.PI/2; 
        nodeGroup.add(tractor);
    }

    group.add(nodeGroup);

    // =========================================================================
    // 6. SYSTEM ASSEMBLY: GALAXY-PIERCING MAIN LASER
    // =========================================================================
    const laserLength = 15000;
    const mainLaserGroup = new THREE.Group();
    mainLaserGroup.position.set(0, 2000, 0); // Starts at the node
    
    // Core intense beam
    const coreBeamGeo = new THREE.CylinderGeometry(20, 20, laserLength, 64);
    coreBeamGeo.translate(0, laserLength / 2, 0);
    const coreBeam = new THREE.Mesh(coreBeamGeo, laserCoreMaterial);
    mainLaserGroup.add(coreBeam);
    
    // Outer Aura beams (Pulse effect)
    const auraBeamGeo = new THREE.CylinderGeometry(40, 40, laserLength, 64);
    auraBeamGeo.translate(0, laserLength / 2, 0);
    const auraBeam = new THREE.Mesh(auraBeamGeo, laserAuraMaterial);
    mainLaserGroup.add(auraBeam);
    
    // Data Rings travelling up the beam
    const numDataRings = 80;
    const ringInstancedGeo = new THREE.TorusGeometry(50, 3, 16, 64);
    ringInstancedGeo.rotateX(Math.PI / 2);
    const dataRings = new THREE.InstancedMesh(ringInstancedGeo, dataRingMaterial, numDataRings);
    mainLaserGroup.add(dataRings);

    // Magnetic Confinement Spirals
    const spiralRadius = 80;
    class SpiralCurve extends THREE.Curve {
        constructor(offsetAngle) { 
            super(); 
            this.offsetAngle = offsetAngle;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const angle = t * Math.PI * 40 + this.offsetAngle; // 20 turns
            const x = Math.cos(angle) * spiralRadius;
            const z = Math.sin(angle) * spiralRadius;
            const y = t * laserLength;
            return optionalTarget.set(x, y, z);
        }
    }
    const spiralGeo1 = new THREE.TubeGeometry(new SpiralCurve(0), 1000, 5, 16, false);
    const spiral1 = new THREE.Mesh(spiralGeo1, copper);
    const spiralGeo2 = new THREE.TubeGeometry(new SpiralCurve(Math.PI), 1000, 5, 16, false);
    const spiral2 = new THREE.Mesh(spiralGeo2, copper);
    
    mainLaserGroup.add(spiral1, spiral2);
    group.add(mainLaserGroup);


    // =========================================================================
    // 7. EXTREMELY DETAILED PARTS ARRAY DEFINITIONS
    // =========================================================================
    
    parts.push({
        name: "Central Star Core",
        description: "The primary energy source for the entire array. A captive G-type main-sequence star undergoing artificially accelerated fusion via magnetic squeezing to provide exawatt-level power outputs for the intergalactic beam.",
        material: "Custom Emissive Plasma",
        function: "Generates raw stellar energy through thermonuclear fusion.",
        assemblyOrder: 1,
        connections: ["Stellar Corona", "Solar Flare Generators", "Dyson Swarm Array Alpha"],
        failureEffect: "Total system power loss. Array collapses into dormant state.",
        cascadeFailures: ["Dyson Swarm Array Alpha", "Main Laser Emitter Core"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -2000, z: 0 }
    });

    parts.push({
        name: "Stellar Corona",
        description: "The turbulent outer atmosphere of the star. Harnessed and contained by the swarm to prevent mass ejection events from destroying delicate orbital optics.",
        material: "Transparent Plasma Envelope",
        function: "Thermal regulation and initial energy buffering.",
        assemblyOrder: 2,
        connections: ["Central Star Core"],
        failureEffect: "Uncontrolled coronal mass ejections damaging the inner swarm.",
        cascadeFailures: ["Solar Flare Generators", "Inner Orbit Hubs"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 500, y: -1500, z: 500 }
    });

    parts.push({
        name: "Solar Flare Generators",
        description: "Artificially induced magnetic flux tubes that intentionally trigger solar flares, channeling plasma along specific vectors to power secondary induction rings.",
        material: "Magnetohydrodynamic Plasma",
        function: "Secondary peak-load power generation.",
        assemblyOrder: 3,
        connections: ["Stellar Corona", "Magnetic Confinement Coils"],
        failureEffect: "Power surges during data transmission bursts.",
        cascadeFailures: ["Quantum Data Encoder"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -800, y: -1000, z: -800 }
    });

    parts.push({
        name: "Dyson Swarm Array Alpha",
        description: "The innermost shell of 5,000 highly resilient energy-harvesting satellites. They absorb extreme UV and X-ray radiation directly from the corona.",
        material: "Tungsten-Carbon Lattice",
        function: "Primary energy harvesting and initial beam collimation.",
        assemblyOrder: 4,
        connections: ["Central Star Core", "Collector Node Main Hull"],
        failureEffect: "33% drop in overall beam intensity.",
        cascadeFailures: ["Collector Node Overload"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 1000, y: 0, z: -1000 }
    });

    parts.push({
        name: "Dyson Swarm Array Beta",
        description: "The middle shell of 5,000 satellites. These possess massive solar panels specifically tuned to the visible and infrared spectrum of the captive star.",
        material: "Gallium Arsenide Metamaterials",
        function: "Secondary energy harvesting and phase-alignment relay.",
        assemblyOrder: 5,
        connections: ["Collector Node Main Hull", "Phase Alignment Matrix"],
        failureEffect: "Phase decoherence in the main laser beam.",
        cascadeFailures: ["Intergalactic Beam Matrix"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -1500, y: 500, z: 1500 }
    });

    parts.push({
        name: "Dyson Swarm Array Gamma",
        description: "The outermost shell of 5,000 satellites. They act as orbital correctors, using gravity wave dampeners to keep the entire swarm in perfect geometric sync.",
        material: "Titanium-Iridium Alloy",
        function: "Orbital stabilization and fine-tuning targeting.",
        assemblyOrder: 6,
        connections: ["Collector Node Main Hull", "Gravity Wave Dampener"],
        failureEffect: "Swarm orbital decay leading to Kessler syndrome.",
        cascadeFailures: ["Entire Swarm Destruction"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 2000, y: 1000, z: 2000 }
    });

    parts.push({
        name: "Swarm Energy Transmitters",
        description: "Millions of microscopic copper-beryllium emitter nodes mounted on each satellite, projecting individual energy beams towards the central focusing node.",
        material: "Copper-Beryllium",
        function: "Energy transmission from swarm to node.",
        assemblyOrder: 7,
        connections: ["Dyson Swarm Arrays", "Primary Collimator Ring"],
        failureEffect: "Energy build-up in satellites causing thermal detonation.",
        cascadeFailures: ["Dyson Swarm Array Beta"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 500, z: 0 }
    });

    parts.push({
        name: "Collector Node Main Hull",
        description: "A megastructure the size of a small moon, positioned perfectly at the focal point of the swarm. It absorbs the combined exawatt energy and processes it.",
        material: "Neutronium Plating",
        function: "Central processing, cooling, and beam generation hub.",
        assemblyOrder: 8,
        connections: ["Swarm Energy Transmitters", "Primary Collimator Ring"],
        failureEffect: "Catastrophic supernova-scale explosion.",
        cascadeFailures: ["Solar System Annihilation"],
        originalPosition: { x: 0, y: 2000, z: 0 },
        explodedPosition: { x: 0, y: 3500, z: 0 }
    });

    parts.push({
        name: "Primary Collimator Ring",
        description: "The outermost massive rotating gear-ring of the Collector Node. It aligns incoming swarm energy beams into a coherent inward spiral.",
        material: "Steel / Dark Steel",
        function: "Initial beam focusing and wavelength synchronization.",
        assemblyOrder: 9,
        connections: ["Collector Node Main Hull", "Secondary Collimator Ring"],
        failureEffect: "Energy spillover vaporizing nearby operator cabins.",
        cascadeFailures: ["Operator Cabin Alpha", "Operator Cabin Beta"],
        originalPosition: { x: 0, y: 2000, z: 0 },
        explodedPosition: { x: 0, y: 2000, z: 1000 }
    });

    parts.push({
        name: "Secondary Collimator Ring",
        description: "The inner counter-rotating ring. Contains micro-fractal lenses that filter out noisy photons and ensure pure chromatic consistency.",
        material: "Chrome / Steel",
        function: "Secondary beam purification.",
        assemblyOrder: 10,
        connections: ["Primary Collimator Ring", "Tertiary Collimator Ring"],
        failureEffect: "Chromatic aberration in the main beam over long distances.",
        cascadeFailures: ["Intergalactic Beam Matrix"],
        originalPosition: { x: 0, y: 2000, z: 0 },
        explodedPosition: { x: 0, y: 2000, z: -1000 }
    });

    parts.push({
        name: "Orbital Tractor 1 (North Quadrant)",
        description: "A colossal maintenance vehicle featuring aggressive off-road treads designed to traverse the micro-gravity surface of the primary collimator ring.",
        material: "Dark Steel / Rubber / Chrome",
        function: "Manual alignment of misaligned fractal lenses and surface repair.",
        assemblyOrder: 11,
        connections: ["Primary Collimator Ring"],
        failureEffect: "Gradual degradation of ring efficiency due to lack of maintenance.",
        cascadeFailures: ["Primary Collimator Ring"],
        originalPosition: { x: 0, y: 2040, z: 500 },
        explodedPosition: { x: 0, y: 3000, z: 1500 }
    });

    parts.push({
        name: "Tractor Off-Road Treads",
        description: "Complex toroidal structures with hundreds of extruded block lugs, providing immense grip via electromagnetic adhesion to the node's hull.",
        material: "Vulcanized Rubber / Chrome Rims",
        function: "Traction and traversal across rotating megastructures.",
        assemblyOrder: 12,
        connections: ["Orbital Tractor 1"],
        failureEffect: "Tractor drifts into space or falls into the beam core.",
        cascadeFailures: ["Orbital Tractor 1 Destruction"],
        originalPosition: { x: -5.5, y: 2042.5, z: 506 },
        explodedPosition: { x: -20, y: 3000, z: 1550 }
    });

    parts.push({
        name: "Tractor Hydraulic Suspension",
        description: "Massive nested cylinders containing liquid-metal hydraulic fluid, capable of absorbing impacts from micrometeorites while maintaining tire contact.",
        material: "Dark Steel / Chrome / Rubber Tubes",
        function: "Shock absorption and chassis leveling.",
        assemblyOrder: 13,
        connections: ["Tractor Off-Road Treads", "Orbital Tractor 1"],
        failureEffect: "Suspension collapse, rendering tractor immobile.",
        cascadeFailures: ["Tractor Off-Road Treads"],
        originalPosition: { x: -4, y: 2040, z: 506 },
        explodedPosition: { x: -10, y: 3100, z: 1500 }
    });

    parts.push({
        name: "Operator Cabin Alpha",
        description: "Pressurized observation and command deck attached to the Tractor. Features tinted radiation-shielded glass, steering toruses, and glowing control panels.",
        material: "Steel / Tinted Glass / Plastic",
        function: "Life support and manual override controls for engineer crews.",
        assemblyOrder: 14,
        connections: ["Orbital Tractor 1"],
        failureEffect: "Loss of life support. Crew incapacitation.",
        cascadeFailures: ["Manual Override Systems"],
        originalPosition: { x: 0, y: 2044, z: 504 },
        explodedPosition: { x: 0, y: 3500, z: 2000 }
    });

    parts.push({
        name: "Magnetic Confinement Coils",
        description: "Twin intertwining copper spirals stretching thousands of kilometers along the main beam axis. They generate a multi-tesla field to prevent beam expansion.",
        material: "Superconducting Copper",
        function: "Prevents thermal blooming and plasma expansion of the laser.",
        assemblyOrder: 15,
        connections: ["Main Laser Emitter Core", "Plasma Cooling Radiators"],
        failureEffect: "Laser beam expands, incinerating relay stations.",
        cascadeFailures: ["Intergalactic Beam Matrix"],
        originalPosition: { x: 0, y: 5000, z: 0 },
        explodedPosition: { x: 2000, y: 5000, z: 0 }
    });

    parts.push({
        name: "Plasma Cooling Radiators",
        description: "Extruded fin arrays that utilize the Stefan-Boltzmann law to radiate petawatts of waste heat into the cosmic microwave background.",
        material: "Aluminum / Carbon Nanotubes",
        function: "Thermal dissipation.",
        assemblyOrder: 16,
        connections: ["Collector Node Main Hull"],
        failureEffect: "Node structural melting.",
        cascadeFailures: ["Collector Node Main Hull"],
        originalPosition: { x: 0, y: 2000, z: 0 },
        explodedPosition: { x: -3000, y: 2000, z: 0 }
    });

    parts.push({
        name: "Quantum Data Encoder",
        description: "A torus ring that injects orbital angular momentum (OAM) states into the laser photons, multiplexing vast amounts of data across the universe.",
        material: "Emissive Magenta Photonic Crystal",
        function: "Data modulation and signal encoding.",
        assemblyOrder: 17,
        connections: ["Main Laser Emitter Core"],
        failureEffect: "Beam fires continuously without transmitting any usable data.",
        cascadeFailures: ["Intergalactic Communication Link"],
        originalPosition: { x: 0, y: 2000, z: 0 },
        explodedPosition: { x: 0, y: 4000, z: 3000 }
    });

    parts.push({
        name: "Phase Alignment Matrix",
        description: "Optical lattice within the primary lens that adjusts the focal length dynamically to compensate for gravitational lensing caused by dark matter.",
        material: "Glass / Titanium",
        function: "Dynamic focal length adjustment.",
        assemblyOrder: 18,
        connections: ["Primary Collimator Ring", "Collector Node Main Hull"],
        failureEffect: "Beam misses target galaxy by several lightyears.",
        cascadeFailures: ["Signal Loss"],
        originalPosition: { x: 0, y: 2000, z: 0 },
        explodedPosition: { x: 0, y: 1500, z: 0 }
    });

    parts.push({
        name: "Subspace Modulator",
        description: "An experimental drive core that slightly warps local spacetime to reduce the speed-of-light delay, utilizing micro-wormholes for the beam.",
        material: "Dark Steel / Chrome",
        function: "Apparent FTL signal transmission.",
        assemblyOrder: 19,
        connections: ["Collector Node Main Hull"],
        failureEffect: "Signal drops to standard lightspeed.",
        cascadeFailures: ["Communication Lag"],
        originalPosition: { x: 0, y: 2100, z: 0 },
        explodedPosition: { x: 1000, y: 2100, z: -1000 }
    });

    parts.push({
        name: "Gravity Wave Dampener",
        description: "Installed on the outer Swarm Gamma array, these emitters cancel out the gravitational ripples caused by the colossal mass of the Collector Node.",
        material: "Titanium-Iridium",
        function: "Spacetime stabilization.",
        assemblyOrder: 20,
        connections: ["Dyson Swarm Array Gamma"],
        failureEffect: "Severe tidal forces rip apart the inner solar system.",
        cascadeFailures: ["Planetary Orbits Destabilized"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -3000, z: 0 }
    });

    parts.push({
        name: "Tachyon Pulse Injector",
        description: "A backup communication array that fires hypothetical faster-than-light particles alongside the main photon beam as a handshake signal.",
        material: "Chrome / Emissive Blue Material",
        function: "Target acquisition handshake protocol.",
        assemblyOrder: 21,
        connections: ["Main Laser Emitter Core"],
        failureEffect: "Receiver galaxy cannot prepare for the incoming exawatt beam.",
        cascadeFailures: ["Receiver Array Vaporized"],
        originalPosition: { x: 0, y: 2500, z: 0 },
        explodedPosition: { x: -2000, y: 2500, z: 2000 }
    });

    parts.push({
        name: "Main Laser Emitter Core",
        description: "The blindingly bright central cylinder of the beam. It carries the raw energy transferred from the star, acting as the carrier wave for the data.",
        material: "Pure White Emissive Plasma",
        function: "Intergalactic power and data carrier.",
        assemblyOrder: 22,
        connections: ["Collector Node Main Hull", "Intergalactic Beam Matrix"],
        failureEffect: "Complete failure of the primary function of the array.",
        cascadeFailures: ["Mission Failure"],
        originalPosition: { x: 0, y: 9500, z: 0 },
        explodedPosition: { x: 0, y: 15000, z: 0 }
    });

    parts.push({
        name: "Intergalactic Beam Matrix",
        description: "The combined structure of the Core, Aura, Data Rings, and Magnetic Spirals. This cohesive beam pierces through the interstellar medium.",
        material: "Various Plasma and Energy Fields",
        function: "Deliver coherent energy across billions of lightyears.",
        assemblyOrder: 23,
        connections: ["Main Laser Emitter Core"],
        failureEffect: "Beam scatters upon hitting the Oort cloud.",
        cascadeFailures: ["None. Just sad engineers."],
        originalPosition: { x: 0, y: 9500, z: 0 },
        explodedPosition: { x: 0, y: 20000, z: 0 }
    });
    
    parts.push({
        name: "Beam Stabilizer Rings",
        description: "Aura rings that travel along the beam path, continually refreshing the magnetic confinement field to prevent decay over astronomical distances.",
        material: "Cyan Emissive Plasma",
        function: "Long-range beam cohesion.",
        assemblyOrder: 24,
        connections: ["Magnetic Confinement Coils"],
        failureEffect: "Beam divergence increases exponentially past 100 parsecs.",
        cascadeFailures: ["Intergalactic Beam Matrix"],
        originalPosition: { x: 0, y: 5000, z: 0 },
        explodedPosition: { x: 5000, y: 5000, z: 5000 }
    });

    parts.push({
        name: "Dark Matter Lens",
        description: "A theoretical construct positioned at the very tip of the visible beam. It artificially concentrates local dark matter to act as a final gravitational lens.",
        material: "Invisible / Refractive Metamaterial",
        function: "Ultimate collimation for inter-supercluster distances.",
        assemblyOrder: 25,
        connections: ["Intergalactic Beam Matrix"],
        failureEffect: "Beam cannot reach adjacent superclusters.",
        cascadeFailures: ["Intergalactic Beam Matrix"],
        originalPosition: { x: 0, y: 17000, z: 0 },
        explodedPosition: { x: 0, y: 25000, z: 0 }
    });

    // =========================================================================
    // 8. QUIZ QUESTIONS (PhD LEVEL)
    // =========================================================================
    const quizQuestions = [
        {
            question: "The Dyson Swarm utilizes solar radiation pressure to maintain orbital stability without consuming reaction mass. Which of the following equations best describes the radiation pressure P_rad exerted on a perfectly reflecting satellite sail at distance r from a star of luminosity L?",
            options: [
                "P_rad = L / (4 * pi * r^2 * c)",
                "P_rad = 2L / (4 * pi * r^2 * c)",
                "P_rad = L / (2 * pi * r * c^2)",
                "P_rad = 4L / (pi * r^2 * c)"
            ],
            correctAnswer: 1,
            explanation: "For a perfectly reflecting surface, the momentum transfer is twice that of complete absorption. Radiation pressure is Force/Area. Force is dp/dt. Thus, the pressure is 2 * Intensity / c, yielding P_rad = 2L / (4 * pi * r^2 * c)."
        },
        {
            question: "To ensure the primary intergalactic laser beam remains collimated over millions of lightyears, the focusing node must combat diffraction. According to the Rayleigh range formula z_R = (pi * w_0^2) / lambda, to maximize the distance before the beam diverges significantly, the engineers must:",
            options: [
                "Decrease the beam waist w_0 and increase the wavelength lambda.",
                "Increase the beam waist w_0 and decrease the wavelength lambda.",
                "Use a highly divergent secondary lens.",
                "Rely on gravitational lensing from dark matter exclusively."
            ],
            correctAnswer: 1,
            explanation: "To maximize the Rayleigh range (the distance over which the beam remains relatively straight), you must increase the numerator (beam waist w_0) and decrease the denominator (wavelength lambda). Hence, large aperture UV/X-ray lasers are ideal."
        },
        {
            question: "The quantum data encoder pulses the laser to transmit information. If it uses orbital angular momentum (OAM) multiplexing with photons, how many theoretical distinct states can be transmitted per photon?",
            options: [
                "2 (Spin up and Spin down)",
                "4 (Bell states)",
                "Infinite (Unbounded OAM states l * h-bar)",
                "Dependent entirely on the Planck length"
            ],
            correctAnswer: 2,
            explanation: "Unlike spin angular momentum which is limited to two states (left and right circular polarization) for a photon, orbital angular momentum (OAM) can theoretically take on any integer value l, meaning an infinite dimensional Hilbert space and infinite data states per photon."
        },
        {
            question: "The Orbital Tractors feature aggressive off-road treads designed to traverse the focusing node's micro-gravity surface. To maximize traction (friction) in a near-zero gravity environment, what mechanism MUST these treads utilize?",
            options: [
                "Standard pneumatic pressure deformation.",
                "Electrostatic adhesion or magnetic interlocking with the node's hull.",
                "Aerodynamic downforce generated by exhaust stacks.",
                "Centrifugal force from the rotating node ring."
            ],
            correctAnswer: 1,
            explanation: "Friction relies on normal force. In micro-gravity, normal force from mass is negligible. Therefore, artificial normal force must be generated via magnetic or electrostatic adhesion between the rubber metamaterials and the steel hull."
        },
        {
            question: "The central star is undergoing active stellar lifting to provide raw materials for the swarm. Which method of stellar lifting uses the star's own magnetic field to funnel plasma out of the poles?",
            options: [
                "Thermal expansion lifting",
                "Centrifugal equatorial lifting",
                "Magnetohydrodynamic (MHD) polar jet extraction",
                "Hawking radiation harvesting"
            ],
            correctAnswer: 2,
            explanation: "MHD polar jet extraction artificially strengthens the star's magnetic poles, effectively creating a 'squeeze' that forces plasma to escape along the magnetic field lines, similar to astrophysical jets seen in quasars."
        }
    ];

    const description = "The God-Tier Stellar Laser Array is an awe-inspiring megastructure. It harnesses the total energy output of a captive G-type star using a Dyson Swarm of 15,000 satellites. This energy is beamed to a colossal Focusing Node, where it is collimated, phase-aligned, and magnetically confined into a singular, exawatt-class laser beam capable of transmitting quantum data across billions of lightyears. Features meticulously detailed orbital tractors for maintenance, complex hydraulic suspensions, and rotating structural geometries.";

    // =========================================================================
    // 9. HYPER-COMPLEX ANIMATION LOOP
    // =========================================================================
    
    // Pre-allocate matrices for performance
    const mat = new THREE.Matrix4();
    const pos = new THREE.Vector3();
    const quat = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    
    const animate = (time, speed, meshes) => {
        const t = time * speed;
        
        // 1. Star Pulsation & Flares
        starCore.scale.setScalar(1 + 0.02 * Math.sin(t * 5));
        corona1.rotation.y = t * 0.2;
        corona2.rotation.x = t * 0.15;
        corona2.scale.setScalar(1 + 0.05 * Math.cos(t * 3));
        
        flares.forEach(flare => {
            flare.mesh.rotation.x += flare.speed * 0.01 * speed;
            flare.mesh.rotation.y += flare.speed * 0.015 * speed;
        });

        // 2. Dyson Swarm Orbital Mechanics
        for (let i = 0; i < dysonSwarmCount; i++) {
            const data = swarmData[i];
            // Update orbital angle
            data.theta += data.speed * speed;
            
            // Calculate new position
            const x = data.radius * Math.sin(data.phi) * Math.cos(data.theta);
            const y = data.radius * Math.sin(data.phi) * Math.sin(data.theta);
            const z = data.radius * Math.cos(data.phi);
            
            dummy.position.set(x, y, z);
            
            // Point satellite towards the Focusing Node!
            dummy.lookAt(nodePos);
            dummy.updateMatrix();
            
            swarmBodyInstanced.setMatrixAt(i, dummy.matrix);
            swarmPanelInstanced.setMatrixAt(i, dummy.matrix);
            swarmEmitterInstanced.setMatrixAt(i, dummy.matrix);
            
            // Update the laser beam linking swarm to node
            const dist = dummy.position.distanceTo(nodePos);
            // Scale the cylinder (which starts at origin and goes to +Z) to reach the node
            dummy.scale.set(1, 1, dist);
            dummy.updateMatrix();
            swarmLaserInstanced.setMatrixAt(i, dummy.matrix);
        }
        
        swarmBodyInstanced.instanceMatrix.needsUpdate = true;
        swarmPanelInstanced.instanceMatrix.needsUpdate = true;
        swarmEmitterInstanced.instanceMatrix.needsUpdate = true;
        swarmLaserInstanced.instanceMatrix.needsUpdate = true;
        
        // Pulse the swarm lasers
        swarmLaserMaterial.opacity = 0.3 + 0.2 * Math.sin(t * 10);

        // 3. Focusing Node Rotations
        rings.forEach(ring => {
            ring.mesh.rotation.z += ring.speed * speed;
        });
        
        // 4. Main Laser Beam Effects
        // Pulse aura intensity
        laserAuraMaterial.emissiveIntensity = 4.0 + 2.0 * Math.sin(t * 8);
        
        // Move data rings up the beam
        for(let i = 0; i < numDataRings; i++) {
            // Y position from 0 to laserLength
            let yPos = ( (t * 500 + i * (laserLength / numDataRings)) % laserLength );
            dummy.position.set(0, yPos, 0);
            
            // Wobbly rotation for the rings to simulate quantum spin
            dummy.rotation.set(
                Math.sin(t * 2 + i) * 0.2,
                t * 5 + i,
                Math.cos(t * 2 + i) * 0.2
            );
            
            // Scale pulse
            const s = 1 + 0.2 * Math.sin(t * 10 + i);
            dummy.scale.set(s, s, s);
            
            dummy.updateMatrix();
            dataRings.setMatrixAt(i, dummy.matrix);
        }
        dataRings.instanceMatrix.needsUpdate = true;
        
        // Rotate magnetic confinement spirals
        spiral1.rotation.y = t * 2;
        spiral2.rotation.y = t * 2;
        
        // Bobbing the entire laser group slightly for energy recoil effect
        mainLaserGroup.position.y = 2000 + 10 * Math.sin(t * 15);
    };

    return { group, parts, description, quizQuestions, animate };
}
