import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const updatables = [];

    // ==========================================
    // CUSTOM MATERIALS
    // ==========================================

    const pureVoidMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        roughness: 1.0,
        metalness: 0.0,
        emissive: 0x000000,
        depthWrite: true,
    });

    const voidHaloMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x110033,
        emissive: 0x220066,
        emissiveIntensity: 5.0,
        transparent: true,
        opacity: 0.6,
        wireframe: true,
        roughness: 0.1,
    });

    const laserMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 10.0,
        transparent: true,
        opacity: 0.8,
    });

    const warningLaserMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 15.0,
        transparent: true,
        opacity: 0.9,
    });

    const quantumGold = new THREE.MeshPhysicalMaterial({
        color: 0xffd700,
        metalness: 1.0,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        emissive: 0x332200,
    });

    const activeChrome = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 1.0,
        roughness: 0.1,
        emissive: 0x112233,
        emissiveIntensity: 0.5,
    });

    const neonPurple = new THREE.MeshStandardMaterial({
        color: 0x8a2be2,
        emissive: 0x8a2be2,
        emissiveIntensity: 8.0,
        transparent: true,
        opacity: 0.7,
    });

    const tachyonMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffaa,
        emissive: 0x00ffaa,
        emissiveIntensity: 12.0,
        wireframe: true
    });

    const superCoolantMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x0088ff,
        transmission: 0.9,
        opacity: 1,
        metalness: 0,
        roughness: 0,
        ior: 1.5,
        thickness: 2.0,
        emissive: 0x0022ff,
        emissiveIntensity: 2.0
    });

    // ==========================================
    // 1. TRUE VACUUM ANOMALY CORE
    // ==========================================

    const voidGroup = new THREE.Group();
    const voidGeometry = new THREE.SphereGeometry(15, 128, 128);
    const voidCore = new THREE.Mesh(voidGeometry, pureVoidMaterial);
    voidGroup.add(voidCore);

    // Event Horizon Containment Field
    const haloGeometry = new THREE.SphereGeometry(15.5, 64, 64);
    const voidHalo = new THREE.Mesh(haloGeometry, voidHaloMaterial);
    voidGroup.add(voidHalo);

    // Inner fluctuating spikes (Hawking Radiation simulacrum)
    const spikesGeo = new THREE.IcosahedronGeometry(14, 4);
    const spikesMesh = new THREE.Mesh(spikesGeo, warningLaserMaterial);
    spikesMesh.material.wireframe = true;
    voidGroup.add(spikesMesh);

    group.add(voidGroup);
    updatables.push({
        mesh: voidGroup,
        type: 'void_core',
        baseScale: 1.0
    });

    parts.push({
        name: 'True Vacuum Anomaly Core & Event Horizon Field',
        description: 'A localized region of true vacuum, threatening to expand and rewrite the laws of physics in the observable universe. Encased in a metric-tensor manipulation field attempting to enforce Minkowski spacetime boundary conditions.',
        material: pureVoidMaterial,
        function: 'Target of the defusion process; must be contained.',
        assemblyOrder: 1,
        connections: ['Reality Anchor Rings', 'Photon Confinement Lasers Array'],
        failureEffect: 'Universe undergoes immediate and irreversible phase transition. Game over.',
        cascadeFailures: ['Everything'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 150, z: 0 },
        mesh: voidGroup
    });

    // ==========================================
    // 2. REALITY ANCHOR RINGS
    // ==========================================

    const anchorRings = new THREE.Group();
    const ringCount = 12;
    const ringMeshes = [];
    for (let i = 0; i < ringCount; i++) {
        const ringGeo = new THREE.TorusGeometry(25 + i * 3, 0.5 + Math.random() * 0.8, 64, 200);
        const ringMesh = new THREE.Mesh(ringGeo, activeChrome);
        ringMesh.rotation.x = Math.random() * Math.PI;
        ringMesh.rotation.y = Math.random() * Math.PI;
        ringMesh.rotation.z = Math.random() * Math.PI;
        
        // Add intricate stabilizing nodes to each ring
        const nodeCount = 16 + Math.floor(Math.random() * 10);
        for (let j = 0; j < nodeCount; j++) {
            const angle = (j / nodeCount) * Math.PI * 2;
            const nodeGeo = new THREE.OctahedronGeometry(1.5 + Math.random(), 2);
            const nodeMesh = new THREE.Mesh(nodeGeo, quantumGold);
            nodeMesh.position.set(
                (25 + i * 3) * Math.cos(angle),
                (25 + i * 3) * Math.sin(angle),
                0
            );
            nodeMesh.rotation.z = angle;
            
            // Sub-nodes on nodes
            const subNodeGeo = new THREE.BoxGeometry(0.5, 0.5, 3);
            const subNode = new THREE.Mesh(subNodeGeo, tachyonMaterial);
            nodeMesh.add(subNode);

            ringMesh.add(nodeMesh);
        }
        
        anchorRings.add(ringMesh);
        ringMeshes.push({
            mesh: ringMesh,
            axis: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(),
            speed: (Math.random() * 0.05) - 0.025
        });
    }
    group.add(anchorRings);
    updatables.push({
        type: 'anchor_rings',
        rings: ringMeshes
    });

    parts.push({
        name: 'Reality Anchor Rings',
        description: 'Multi-axis gyroscopic stabilizing rings that physically lock the local spacetime geometry into a predefined topology using extreme mass-energy concentrations.',
        material: activeChrome,
        function: 'Prevents spatial shearing, topological tearing, and keeps the core geometry Euclidean.',
        assemblyOrder: 2,
        connections: ['Event Horizon Containment Field', 'Quantum Harmonic Oscillator Banks'],
        failureEffect: 'Severe spatial distortion; geometry becomes non-Euclidean.',
        cascadeFailures: ['Photon Confinement Lasers Array', 'Dimensional Bulwark Plating'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -200 },
        mesh: anchorRings
    });

    // ==========================================
    // 3. PHOTON CONFINEMENT LASERS ARRAY
    // ==========================================

    const laserGroup = new THREE.Group();
    const laserCount = 1000;
    const laserBeams = [];
    
    // Using Fibonacci sphere distribution for even covering
    const phi = Math.PI * (3 - Math.sqrt(5)); 
    for (let i = 0; i < laserCount; i++) {
        const y = 1 - (i / (laserCount - 1)) * 2; 
        const radius = Math.sqrt(1 - y * y);
        const theta = phi * i;

        const x = Math.cos(theta) * radius;
        const z = Math.sin(theta) * radius;

        const distance = 45 + Math.random() * 30;
        const startPoint = new THREE.Vector3(x * distance, y * distance, z * distance);
        
        // Emitter base
        const baseGeo = new THREE.CylinderGeometry(0.5, 1.2, 4, 16);
        const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
        baseMesh.position.copy(startPoint);
        baseMesh.lookAt(0, 0, 0);
        baseMesh.rotateX(Math.PI / 2);

        // Heat sinks on the base
        for(let k = 0; k < 4; k++) {
            const sinkGeo = new THREE.BoxGeometry(1.5, 0.2, 3);
            const sink = new THREE.Mesh(sinkGeo, copper);
            sink.position.y = 1;
            sink.rotation.y = (Math.PI / 4) * k;
            baseMesh.add(sink);
        }

        laserGroup.add(baseMesh);
        
        // Laser beam
        const beamLength = distance - 15.5; // Pointing to the void core surface
        const beamGeo = new THREE.CylinderGeometry(0.05, 0.15, beamLength, 8);
        
        // Some lasers are red, most are cyan
        const isWarning = Math.random() > 0.9;
        const mat = isWarning ? warningLaserMaterial : laserMaterial;
        
        const beamMesh = new THREE.Mesh(beamGeo, mat);
        // Position at midpoint between start and origin surface
        const direction = startPoint.clone().normalize();
        const midPoint = startPoint.clone().sub(direction.clone().multiplyScalar(beamLength / 2));
        
        beamMesh.position.copy(midPoint);
        beamMesh.lookAt(0, 0, 0);
        beamMesh.rotateX(Math.PI / 2);
        
        laserBeams.push({ mesh: beamMesh, baseScale: 1.0, isWarning, phase: Math.random() * Math.PI * 2 });
        laserGroup.add(beamMesh);
    }
    group.add(laserGroup);
    updatables.push({
        type: 'lasers',
        beams: laserBeams
    });

    parts.push({
        name: 'Photon Confinement Lasers Array',
        description: '1000 ultra-high-intensity gamma-ray lasers applying continuous radiation pressure to the anomaly surface, structured via a Fibonacci sphere distribution.',
        material: darkSteel,
        function: 'Counteracts the expansion pressure of the true vacuum using extreme photon momentum.',
        assemblyOrder: 3,
        connections: ['Reality Anchor Rings', 'Zero-Point Energy Tether'],
        failureEffect: 'Vacuum overcomes radiation pressure and expands slightly.',
        cascadeFailures: ['Gravimetric Shear Braces'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 250, y: 0, z: 0 },
        mesh: laserGroup
    });

    // ==========================================
    // 4. CHRONAL DISTORTION DAMPENERS
    // ==========================================

    const dampenerGroup = new THREE.Group();
    const dampenerCount = 24;
    const dampeners = [];
    
    // Intricate Lathe Geometry for the dampeners (bell-like shapes)
    const lathePoints = [];
    for ( let i = 0; i <= 30; i ++ ) {
        const t = i / 30;
        const x = Math.sin(t * Math.PI * 2) * 2 + 3 + (t * 4);
        const y = (t - 0.5) * 20;
        lathePoints.push( new THREE.Vector2( x, y ) );
    }
    const dampenerGeo = new THREE.LatheGeometry(lathePoints, 32);

    for (let i = 0; i < dampenerCount; i++) {
        const theta = (i / dampenerCount) * Math.PI * 2;
        const radius = 80;
        const x = Math.cos(theta) * radius;
        const z = Math.sin(theta) * radius;

        const dampener = new THREE.Group();
        
        const bell = new THREE.Mesh(dampenerGeo, glass);
        
        // Inner glowing core of the dampener
        const innerCoreGeo = new THREE.CylinderGeometry(1, 1, 20, 16);
        const innerCore = new THREE.Mesh(innerCoreGeo, neonPurple);
        
        // Outer rings on the dampener
        for(let r = 0; r < 5; r++) {
            const outRingGeo = new THREE.TorusGeometry(5 + r*0.5, 0.5, 16, 32);
            const outRing = new THREE.Mesh(outRingGeo, chrome);
            outRing.position.y = (r - 2) * 4;
            outRing.rotation.x = Math.PI / 2;
            bell.add(outRing);
        }

        dampener.add(bell);
        dampener.add(innerCore);
        
        dampener.position.set(x, 0, z);
        dampener.lookAt(0,0,0);
        dampener.rotateX(Math.PI / 2);

        dampenerGroup.add(dampener);
        dampeners.push({
            group: dampener,
            innerCore: innerCore,
            phase: i * 0.5,
            originalPos: new THREE.Vector3(x, 0, z)
        });
    }
    group.add(dampenerGroup);
    updatables.push({
        type: 'dampeners',
        items: dampeners
    });

    parts.push({
        name: 'Chronal Distortion Dampeners',
        description: 'Arrangement of 24 hyper-fluidic time-dilation bells that resonate anti-chronitons to stabilize local timeflow around the anomaly.',
        material: glass,
        function: 'Prevents time from speeding up or stopping near the core.',
        assemblyOrder: 4,
        connections: ['Dimensional Bulwark Plating'],
        failureEffect: 'Temporal localized freezing; repair crews age to dust instantly.',
        cascadeFailures: ['Operator Chronosphere'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -250, y: 0, z: 0 },
        mesh: dampenerGroup
    });

    // ==========================================
    // 5. ANTIMATTER COOLING PIPES
    // ==========================================
    
    const pipesGroup = new THREE.Group();
    const pipeCount = 15;
    
    // Create complex snaking paths
    for (let i = 0; i < pipeCount; i++) {
        class CustomSinCurve extends THREE.Curve {
            constructor( scale = 1, seed = 0 ) {
                super();
                this.scale = scale;
                this.seed = seed;
            }
            getPoint( t, optionalTarget = new THREE.Vector3() ) {
                const tx = Math.sin( 2 * Math.PI * t + this.seed ) * 40;
                const ty = (t - 0.5) * 150;
                const tz = Math.cos( 4 * Math.PI * t + this.seed ) * 40;
                return optionalTarget.set( tx, ty, tz ).multiplyScalar( this.scale );
            }
        }
        
        const path = new CustomSinCurve( 1, i * 2.5 );
        const tubeGeo = new THREE.TubeGeometry( path, 100, 2, 16, false );
        const tubeMesh = new THREE.Mesh( tubeGeo, superCoolantMaterial );
        
        // Add reinforcing rings along the tube
        const tubeRingsGeo = new THREE.TubeGeometry( path, 100, 2.2, 8, false );
        const tubeRingsMat = new THREE.MeshStandardMaterial({ color: 0x222222, wireframe: true });
        const tubeRingsMesh = new THREE.Mesh(tubeRingsGeo, tubeRingsMat);

        pipesGroup.add( tubeMesh );
        pipesGroup.add( tubeRingsMesh );
    }
    
    pipesGroup.rotation.x = Math.PI / 2;
    group.add(pipesGroup);
    
    updatables.push({
        type: 'pipes',
        group: pipesGroup
    });

    parts.push({
        name: 'Antimatter Cooling Pipe Network',
        description: 'Hyper-refrigerated conduits pumping liquid antiprotons to absorb excess Hawking radiation emitted by the containment field.',
        material: superCoolantMaterial,
        function: 'Thermal regulation of the entire defusion rig.',
        assemblyOrder: 5,
        connections: ['Chronal Distortion Dampeners', 'Zero-Point Energy Tether'],
        failureEffect: 'Catastrophic meltdown and spontaneous creation of micro black holes.',
        cascadeFailures: ['Photon Confinement Lasers Array'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -200, z: 0 },
        mesh: pipesGroup
    });

    // ==========================================
    // 6. ZERO-POINT ENERGY TETHER (MAIN PILLAR)
    // ==========================================

    const tetherGroup = new THREE.Group();
    
    const pillarGeo = new THREE.CylinderGeometry(15, 20, 300, 32);
    const pillarMesh = new THREE.Mesh(pillarGeo, darkSteel);
    tetherGroup.add(pillarMesh);

    // Huge glowing extrusions on the pillar
    for (let i = 0; i < 8; i++) {
        const exGeo = new THREE.BoxGeometry(5, 280, 5);
        const exMesh = new THREE.Mesh(exGeo, neonPurple);
        const angle = (i / 8) * Math.PI * 2;
        exMesh.position.set(Math.cos(angle) * 18, 0, Math.sin(angle) * 18);
        exMesh.rotation.y = -angle;
        tetherGroup.add(exMesh);
    }
    
    // Massive mechanical gears on top and bottom
    const createGear = (yPos) => {
        const gearShape = new THREE.Shape();
        const outerRadius = 40;
        const innerRadius = 35;
        const teeth = 24;
        
        for (let i = 0; i < teeth * 2; i++) {
            const angle = (i / (teeth * 2)) * Math.PI * 2;
            const r = i % 2 === 0 ? outerRadius : innerRadius;
            if (i === 0) gearShape.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
            else gearShape.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
        }
        gearShape.lineTo(outerRadius, 0);

        const holePath = new THREE.Path();
        holePath.absarc(0, 0, 16, 0, Math.PI * 2, false);
        gearShape.holes.push(holePath);

        const extrudeSettings = { depth: 10, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 1, bevelThickness: 1 };
        const gearGeo = new THREE.ExtrudeGeometry(gearShape, extrudeSettings);
        const gearMesh = new THREE.Mesh(gearGeo, steel);
        
        gearMesh.rotation.x = Math.PI / 2;
        gearMesh.position.y = yPos;
        return gearMesh;
    };

    const topGear = createGear(140);
    const bottomGear = createGear(-150);
    tetherGroup.add(topGear);
    tetherGroup.add(bottomGear);

    group.add(tetherGroup);
    
    updatables.push({
        type: 'tether',
        topGear: topGear,
        bottomGear: bottomGear
    });

    parts.push({
        name: 'Zero-Point Energy Tether',
        description: 'A colossal structural pillar drawing vacuum energy directly from local spacetime to power the containment grids.',
        material: darkSteel,
        function: 'Primary power generation and structural backbone.',
        assemblyOrder: 6,
        connections: ['Gravimetric Shear Braces', 'Antimatter Cooling Pipe Network'],
        failureEffect: 'Loss of power to all systems; instant vacuum collapse.',
        cascadeFailures: ['True Vacuum Anomaly Core'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 250 },
        mesh: tetherGroup
    });

    // ==========================================
    // 7. GRAVIMETRIC SHEAR BRACES
    // ==========================================

    const bracesGroup = new THREE.Group();
    const braceShape = new THREE.Shape();
    // I-Beam shape
    braceShape.moveTo(-5, -5);
    braceShape.lineTo(5, -5);
    braceShape.lineTo(5, -3);
    braceShape.lineTo(1, -3);
    braceShape.lineTo(1, 3);
    braceShape.lineTo(5, 3);
    braceShape.lineTo(5, 5);
    braceShape.lineTo(-5, 5);
    braceShape.lineTo(-5, 3);
    braceShape.lineTo(-1, 3);
    braceShape.lineTo(-1, -3);
    braceShape.lineTo(-5, -3);
    braceShape.lineTo(-5, -5);

    const braceExtrude = { depth: 200, bevelEnabled: false };
    const braceGeo = new THREE.ExtrudeGeometry(braceShape, braceExtrude);
    
    // Place them around as a cage
    for(let i = 0; i < 6; i++) {
        const brace = new THREE.Mesh(braceGeo, steel);
        const angle = (i / 6) * Math.PI * 2;
        
        brace.position.set(Math.cos(angle) * 100, -100, Math.sin(angle) * 100);
        brace.rotation.y = -angle + Math.PI / 2;
        brace.rotation.x = -Math.PI / 4; // Angle them inwards towards the top
        
        // Add detailed bolts
        for(let b=0; b<10; b++) {
            const boltGeo = new THREE.CylinderGeometry(1, 1, 12, 8);
            const bolt = new THREE.Mesh(boltGeo, copper);
            bolt.position.set(0, 0, b * 20 + 10);
            bolt.rotation.z = Math.PI / 2;
            brace.add(bolt);
        }

        bracesGroup.add(brace);
    }
    group.add(bracesGroup);

    parts.push({
        name: 'Gravimetric Shear Braces',
        description: 'Heavy hyper-dense I-beams forming a macro-structural cage. Designed to withstand gravity gradients of up to 10^6 Gs.',
        material: steel,
        function: 'Physical structural integrity of the outer shell.',
        assemblyOrder: 7,
        connections: ['Zero-Point Energy Tether', 'Dimensional Bulwark Plating'],
        failureEffect: 'Catastrophic structural spaghettification.',
        cascadeFailures: ['Dimensional Bulwark Plating', 'Subatomic Resonators'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 200, y: 200, z: 200 },
        mesh: bracesGroup
    });

    // ==========================================
    // 8. QUANTUM HARMONIC OSCILLATOR BANKS
    // ==========================================

    const oscillatorGroup = new THREE.Group();
    const latticeGeo = new THREE.BoxGeometry(10, 10, 10);
    const edgesGeo = new THREE.EdgesGeometry(latticeGeo);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 2 });

    for(let x = -1; x <= 1; x+=2) {
        for(let y = -1; y <= 1; y+=2) {
            for(let z = -1; z <= 1; z+=2) {
                const bank = new THREE.Group();
                
                // 3x3x3 grid of lines
                for(let i=-1; i<=1; i++) {
                    for(let j=-1; j<=1; j++) {
                        for(let k=-1; k<=1; k++) {
                            const lines = new THREE.LineSegments(edgesGeo, lineMat);
                            lines.position.set(i*10, j*10, k*10);
                            
                            // Glowing inner sphere
                            const sGeo = new THREE.SphereGeometry(2, 8, 8);
                            const sMesh = new THREE.Mesh(sGeo, tachyonMaterial);
                            sMesh.position.set(i*10, j*10, k*10);
                            bank.add(sMesh);

                            bank.add(lines);
                        }
                    }
                }
                
                bank.position.set(x * 120, y * 120, z * 120);
                oscillatorGroup.add(bank);
            }
        }
    }
    group.add(oscillatorGroup);

    parts.push({
        name: 'Quantum Harmonic Oscillator Banks',
        description: 'Vast macroscopic quantum lattices that cancel out probability wavefunctions that lead to vacuum decay.',
        material: tachyonMaterial,
        function: 'Probability manipulation and timeline pruning.',
        assemblyOrder: 8,
        connections: ['Reality Anchor Rings'],
        failureEffect: 'Sudden existence of highly improbable, deadly subatomic events.',
        cascadeFailures: ['Vacuum Decay Sensors'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -200, y: -200, z: -200 },
        mesh: oscillatorGroup
    });

    // ==========================================
    // 9. SUBATOMIC RESONATORS
    // ==========================================

    const resonatorGroup = new THREE.Group();
    const resCount = 8;
    const resKnots = [];

    for(let i=0; i<resCount; i++) {
        const knotGeo = new THREE.TorusKnotGeometry(15, 3, 200, 32, Math.floor(Math.random()*5)+2, Math.floor(Math.random()*5)+3);
        const knotMesh = new THREE.Mesh(knotGeo, quantumGold);
        
        const angle = (i/resCount) * Math.PI * 2;
        knotMesh.position.set(Math.cos(angle) * 150, 0, Math.sin(angle) * 150);
        
        resonatorGroup.add(knotMesh);
        resKnots.push({
            mesh: knotMesh,
            rotSpeedX: Math.random() * 0.1,
            rotSpeedY: Math.random() * 0.1
        });
    }
    group.add(resonatorGroup);
    updatables.push({
        type: 'resonators',
        knots: resKnots
    });

    parts.push({
        name: 'Subatomic Resonators',
        description: 'Massive Torus Knots tuned to the precise vibrational frequency of the Higgs boson.',
        material: quantumGold,
        function: 'Stimulates the local Higgs field to resist returning to a zero-energy state.',
        assemblyOrder: 9,
        connections: ['Gravimetric Shear Braces'],
        failureEffect: 'Higgs field instability; mass loses its meaning.',
        cascadeFailures: ['All Structural Components'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 300, z: 300 },
        mesh: resonatorGroup
    });

    // ==========================================
    // 10. VACUUM DECAY SENSORS
    // ==========================================
    
    const sensorGroup = new THREE.Group();
    const sensorGeo = new THREE.OctahedronGeometry(4, 0);
    const sensorMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: 0x00aaff,
        emissiveIntensity: 5.0,
        wireframe: false,
        metalness: 1.0,
        roughness: 0.0,
        transmission: 1.0
    });

    for(let i=0; i<100; i++) {
        const sensor = new THREE.Mesh(sensorGeo, sensorMat);
        // Distribute them in a large outer sphere
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const r = 220 + Math.random() * 20;
        
        sensor.position.set(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi)
        );
        sensor.lookAt(0,0,0);
        sensorGroup.add(sensor);
    }
    group.add(sensorGroup);

    parts.push({
        name: 'Vacuum Decay Sensors',
        description: 'Hundreds of hyper-sensitive crystalline matrices floating in the outer perimeter, detecting microscopic bubble nucleations.',
        material: sensorMat,
        function: 'Early warning system for localized vacuum decay.',
        assemblyOrder: 10,
        connections: ['Quantum Harmonic Oscillator Banks'],
        failureEffect: 'Blind to decay bubbles; sudden death without warning.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -400 },
        mesh: sensorGroup
    });

    // ==========================================
    // 11. DIMENSIONAL BULWARK PLATING
    // ==========================================

    const bulwarkGroup = new THREE.Group();
    const hexShape = new THREE.Shape();
    const hexRadius = 20;
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        if(i === 0) hexShape.moveTo(Math.cos(angle) * hexRadius, Math.sin(angle) * hexRadius);
        else hexShape.lineTo(Math.cos(angle) * hexRadius, Math.sin(angle) * hexRadius);
    }
    hexShape.lineTo(Math.cos(0) * hexRadius, Math.sin(0) * hexRadius);
    
    // Add a circular hole
    const hexHole = new THREE.Path();
    hexHole.absarc(0, 0, 8, 0, Math.PI * 2, false);
    hexShape.holes.push(hexHole);

    const hexExtrude = { depth: 5, bevelEnabled: true, bevelThickness: 2, bevelSize: 2 };
    const hexGeo = new THREE.ExtrudeGeometry(hexShape, hexExtrude);
    
    // Create a truncated icosahedron (buckyball) pattern for plates
    const tIcoGeo = new THREE.IcosahedronGeometry(280, 1);
    const pos = tIcoGeo.attributes.position;
    
    for (let i = 0; i < pos.count; i++) {
        const plate = new THREE.Mesh(hexGeo, darkSteel);
        const pVec = new THREE.Vector3().fromBufferAttribute(pos, i);
        plate.position.copy(pVec);
        plate.lookAt(0,0,0);
        
        // Add a glowing core in the hole
        const coreGeo = new THREE.CylinderGeometry(7, 7, 6, 16);
        const core = new THREE.Mesh(coreGeo, warningLaserMaterial);
        core.rotation.x = Math.PI / 2;
        core.position.z = 2.5;
        plate.add(core);

        bulwarkGroup.add(plate);
    }
    group.add(bulwarkGroup);

    parts.push({
        name: 'Dimensional Bulwark Plating',
        description: 'Massive hexagonal ablative armor plates forming a Dyson-sphere-like outer shell. Forged in the heart of a neutron star.',
        material: darkSteel,
        function: 'Protects the outside universe from radiation leaks and physical shrapnel.',
        assemblyOrder: 11,
        connections: ['Gravimetric Shear Braces'],
        failureEffect: 'Lethal gamma radiation floods the solar system.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -400, y: 0, z: 0 },
        mesh: bulwarkGroup
    });

    // ==========================================
    // 12. TACHYON PULSE EMITTERS
    // ==========================================

    const tachyonGroup = new THREE.Group();
    for (let r = 0; r < 3; r++) {
        const pulseRingGeo = new THREE.TorusGeometry(180, 2, 16, 64);
        const pulseRing = new THREE.Mesh(pulseRingGeo, neonPurple);
        pulseRing.rotation.x = Math.PI / 2;
        pulseRing.position.y = (r - 1) * 100;
        
        // Emitters on ring
        for(let e=0; e<32; e++) {
            const emGeo = new THREE.ConeGeometry(5, 15, 8);
            const em = new THREE.Mesh(emGeo, chrome);
            const angle = (e/32) * Math.PI * 2;
            em.position.set(Math.cos(angle)*180, 0, Math.sin(angle)*180);
            em.rotation.x = -Math.PI/2;
            pulseRing.add(em);
        }
        tachyonGroup.add(pulseRing);
    }
    group.add(tachyonGroup);

    parts.push({
        name: 'Tachyon Pulse Emitters',
        description: 'Rings that emit faster-than-light particles backwards in time, allowing the system to react to quantum fluctuations before they happen.',
        material: neonPurple,
        function: 'Negative-latency response system.',
        assemblyOrder: 12,
        connections: ['Dimensional Bulwark Plating'],
        failureEffect: 'Response time drops to the speed of light; too slow to catch decay events.',
        cascadeFailures: ['Quantum Harmonic Oscillator Banks'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 400, z: 0 },
        mesh: tachyonGroup
    });

    // ==========================================
    // 13. SPACETIME STITCHING NEEDLES
    // ==========================================

    const needleGroup = new THREE.Group();
    for(let i=0; i<12; i++) {
        const nGeo = new THREE.CylinderGeometry(0.1, 8, 250, 16);
        const needle = new THREE.Mesh(nGeo, activeChrome);
        
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const r = 200;
        
        needle.position.set(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi)
        );
        needle.lookAt(0,0,0);
        needle.rotateX(-Math.PI/2);
        
        // Threads
        const tGeo = new THREE.CylinderGeometry(0.5, 0.5, 300, 8);
        const thread = new THREE.Mesh(tGeo, warningLaserMaterial);
        thread.position.y = -150;
        needle.add(thread);

        needleGroup.add(needle);
    }
    group.add(needleGroup);

    parts.push({
        name: 'Spacetime Stitching Needles',
        description: 'Colossal micro-singularity laced needles physically piercing the fabric of spacetime to sew torn dimensions back together.',
        material: activeChrome,
        function: 'Repairs macro-tears in reality caused by the void.',
        assemblyOrder: 13,
        connections: ['Dimensional Bulwark Plating'],
        failureEffect: 'Rifts open into unmapped hostile dimensions.',
        cascadeFailures: ['Reality Anchor Rings'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 300, y: -300, z: 0 },
        mesh: needleGroup
    });

    // ==========================================
    // 14. OPERATOR CHRONOSPHERE
    // ==========================================

    const chronoGroup = new THREE.Group();
    const podGeo = new THREE.SphereGeometry(25, 32, 32);
    const pod = new THREE.Mesh(podGeo, tinted);
    
    const consoleGeo = new THREE.BoxGeometry(20, 10, 10);
    const consoleMesh = new THREE.Mesh(consoleGeo, darkSteel);
    consoleMesh.position.set(0, -10, 10);
    consoleMesh.rotation.x = -Math.PI / 4;
    pod.add(consoleMesh);
    
    // Monitors
    for(let i=0; i<3; i++) {
        const monGeo = new THREE.PlaneGeometry(8, 6);
        const mon = new THREE.Mesh(monGeo, laserMaterial);
        mon.position.set((i-1)*10, 5, 2);
        consoleMesh.add(mon);
    }

    // Connective gantry
    const gantryGeo = new THREE.BoxGeometry(10, 150, 10);
    const gantry = new THREE.Mesh(gantryGeo, steel);
    gantry.position.set(0, -75, 0);
    pod.add(gantry);

    chronoGroup.add(pod);
    chronoGroup.position.set(0, 320, 0); // At the very top
    group.add(chronoGroup);

    parts.push({
        name: 'Operator Chronosphere',
        description: 'A heavily shielded, time-dilated command module where a single operator monitors the collapse. Subjectively, they have been working for 10,000 years.',
        material: tinted,
        function: 'Manual override and catastrophic decision making.',
        assemblyOrder: 14,
        connections: ['Zero-Point Energy Tether'],
        failureEffect: 'Loss of human intuition in predicting non-linear quantum chaos.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 500, z: 0 },
        mesh: chronoGroup
    });

    // ==========================================
    // 15. QUANTUM ENTANGLEMENT WEB
    // ==========================================

    const webGroup = new THREE.Group();
    const webMat = new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.3 });
    const webPoints = [];
    
    // Connect random points around the sphere
    for(let i=0; i<500; i++) {
        const r1 = 150 + Math.random()*100;
        const u1 = Math.random(); const v1 = Math.random();
        const p1 = new THREE.Vector3(
            r1 * Math.sin(Math.acos(2*v1-1)) * Math.cos(2*Math.PI*u1),
            r1 * Math.sin(Math.acos(2*v1-1)) * Math.sin(2*Math.PI*u1),
            r1 * Math.cos(Math.acos(2*v1-1))
        );

        const r2 = 150 + Math.random()*100;
        const u2 = Math.random(); const v2 = Math.random();
        const p2 = new THREE.Vector3(
            r2 * Math.sin(Math.acos(2*v2-1)) * Math.cos(2*Math.PI*u2),
            r2 * Math.sin(Math.acos(2*v2-1)) * Math.sin(2*Math.PI*u2),
            r2 * Math.cos(Math.acos(2*v2-1))
        );
        
        webPoints.push(p1, p2);
    }
    
    const webGeo = new THREE.BufferGeometry().setFromPoints(webPoints);
    const webMesh = new THREE.LineSegments(webGeo, webMat);
    webGroup.add(webMesh);
    group.add(webGroup);
    
    updatables.push({
        type: 'web',
        mesh: webMesh
    });

    parts.push({
        name: 'Quantum Entanglement Web',
        description: 'A literal manifestation of macroscopic quantum entanglement, forming a neural network of instantaneous data transfer across the rig.',
        material: tachyonMaterial,
        function: 'Zero-latency telemetry and computational synchronization.',
        assemblyOrder: 15,
        connections: ['Vacuum Decay Sensors', 'Operator Chronosphere'],
        failureEffect: 'Decoherence; systems fall out of sync and destroy each other.',
        cascadeFailures: ['All Systems'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 500 },
        mesh: webGroup
    });


    // ==========================================
    // ANIMATION LOGIC
    // ==========================================

    const animate = (time, speed, meshes) => {
        // time is absolute time, speed is a multiplier
        const t = time * speed;

        updatables.forEach(item => {
            if (item.type === 'void_core') {
                // The void constantly tries to expand and pulsates rapidly
                const scaleOscillation = 1.0 + Math.sin(t * 10) * 0.05 + Math.cos(t * 25) * 0.02;
                item.mesh.scale.set(scaleOscillation, scaleOscillation, scaleOscillation);
                // Rotate the containment field rapidly
                item.mesh.children[1].rotation.y = t * 2;
                item.mesh.children[1].rotation.z = t * 1.5;
                // Spikes scale aggressively
                const spikeScale = 1.0 + Math.sin(t * 50) * 0.1;
                item.mesh.children[2].scale.set(spikeScale, spikeScale, spikeScale);
            }
            
            if (item.type === 'anchor_rings') {
                // Violent, complex rotation
                item.rings.forEach((ringData, idx) => {
                    ringData.mesh.rotateOnAxis(ringData.axis, ringData.speed + Math.sin(t * 2 + idx) * 0.05);
                    // Shake violently
                    ringData.mesh.position.x = (Math.random() - 0.5) * 0.5;
                    ringData.mesh.position.y = (Math.random() - 0.5) * 0.5;
                    ringData.mesh.position.z = (Math.random() - 0.5) * 0.5;
                });
            }

            if (item.type === 'lasers') {
                // Pulse laser intensity
                item.beams.forEach(beamData => {
                    // beamData.mesh is the cylinder. The material is shared, so we can't change emissive per mesh easily,
                    // but we can scale the beams to simulate pulsing energy
                    const pulse = 1.0 + Math.sin(t * 20 + beamData.phase) * 0.2;
                    beamData.mesh.scale.set(pulse, 1, pulse); // Thicken/thin the beam
                });
                // Pulse the shared materials directly
                laserMaterial.emissiveIntensity = 10.0 + Math.sin(t * 15) * 5.0;
                warningLaserMaterial.emissiveIntensity = 15.0 + Math.sin(t * 30) * 10.0;
            }

            if (item.type === 'dampeners') {
                item.items.forEach(dampener => {
                    // Bells rock back and forth
                    dampener.group.rotation.z = Math.sin(t * 5 + dampener.phase) * 0.2;
                    // Inner core pulses
                    const coreScale = 1.0 + Math.sin(t * 10 + dampener.phase) * 0.5;
                    dampener.innerCore.scale.set(coreScale, 1, coreScale);
                    // Move slightly in and out
                    const offset = Math.sin(t * 2 + dampener.phase) * 5;
                    const dir = dampener.originalPos.clone().normalize();
                    dampener.group.position.copy(dampener.originalPos).add(dir.multiplyScalar(offset));
                });
            }

            if (item.type === 'pipes') {
                // Rotate the entire pipe assembly slowly
                item.group.rotation.z = t * 0.5;
                item.group.rotation.x = (Math.PI / 2) + Math.sin(t) * 0.1;
                // Animate the coolant transmission
                superCoolantMaterial.emissiveIntensity = 2.0 + Math.sin(t * 8) * 1.5;
            }

            if (item.type === 'tether') {
                // Gears grind in opposite directions
                item.topGear.rotation.z = t * 1.5;
                item.bottomGear.rotation.z = -t * 1.5;
            }

            if (item.type === 'resonators') {
                // Knots writhe and spin
                item.knots.forEach(knot => {
                    knot.mesh.rotation.x += knot.rotSpeedX;
                    knot.mesh.rotation.y += knot.rotSpeedY;
                    const scale = 1.0 + Math.sin(t * 12 + knot.rotSpeedX * 100) * 0.1;
                    knot.mesh.scale.set(scale, scale, scale);
                });
            }

            if (item.type === 'web') {
                // Flash the web opacity
                item.mesh.material.opacity = 0.3 + Math.sin(t * 50) * 0.2;
                item.mesh.rotation.y = t * 0.1;
                item.mesh.rotation.x = t * 0.05;
            }
        });
        
        // Global group rotation to give a sense of immense scale floating in space
        group.rotation.y = t * 0.05;
        group.rotation.x = Math.sin(t * 0.02) * 0.1;
    };


    const description = "The Ultra God Tier False Vacuum Bomb Defuser. A desperate, moon-sized megalithic structure constructed around a nucleating bubble of True Vacuum. Utilizing reality anchors, chronal dampeners, and gamma-ray confinement grids, it holds back the localized collapse of the Higgs field, preventing an irreversible phase transition that would instantly annihilate the observable universe at the speed of light.";

    const quizQuestions = [
        {
            question: "In the context of Coleman-De Luccia tunneling, what determines the decay rate of a metastable false vacuum state into a true vacuum?",
            options: [
                "The Euclidean action evaluated at the O(4)-symmetric bounce solution.",
                "The expectation value of the Higgs field near the black hole event horizon.",
                "The cross-section of tachyon interactions within the containment grid.",
                "The superposition of the wavefunctions of all chronal dampeners."
            ],
            answer: 0,
            explanation: "The decay rate is proportional to exp(-B/hbar), where B is the difference in the Euclidean action between the bounce solution (an O(4) symmetric instanton) and the false vacuum background."
        },
        {
            question: "Why do the Photon Confinement Lasers alone fail to halt vacuum decay without the Quantum Harmonic Oscillator Banks?",
            options: [
                "Radiation pressure is a classical phenomenon and cannot suppress quantum tunneling events occurring below the Planck length.",
                "The lasers reflect off the event horizon.",
                "The lasers require too much energy from the Zero-Point Tether.",
                "Photons decay into electron-positron pairs near true vacuum."
            ],
            answer: 0,
            explanation: "Vacuum decay is fundamentally a quantum tunneling event through a potential barrier. Classical radiation pressure cannot prevent the probabilistic nucleation of a true vacuum bubble."
        },
        {
            question: "The Reality Anchor Rings utilize localized, extreme concentrations of mass-energy. How does this theoretically stabilize the false vacuum?",
            options: [
                "By creating deep gravitational wells that increase the effective potential barrier width for the tunneling instanton.",
                "By spinning so fast they reverse time locally.",
                "By crushing the vacuum bubble with pure kinetic force.",
                "By generating a Faraday cage against Higgs bosons."
            ],
            answer: 0,
            explanation: "A strong gravitational background (like a primordial black hole or extreme mass concentration) can theoretically alter the geometry of the bounce solution, either catalyzing or suppressing the decay rate depending on the coupling to gravity. Here, it is engineered to increase the action B, suppressing the decay."
        },
        {
            question: "If the Antimatter Cooling Pipes rupture and cause a micro black hole, what is the immediate risk to the False Vacuum?",
            options: [
                "Black holes act as nucleation seeds, catastrophically increasing the probability of vacuum decay.",
                "The black hole will swallow the true vacuum bubble.",
                "Hawking radiation will freeze the dampeners.",
                "It will generate a paradox that erases the machine."
            ],
            answer: 0,
            explanation: "Theoretical calculations show that primordial or micro black holes can act as highly efficient nucleation sites for vacuum decay, lowering the action required for a true vacuum bubble to form, thus triggering the apocalypse faster."
        },
        {
            question: "The Operator Chronosphere is highly time-dilated. Assuming an external observer sees 1 second pass, but the operator experiences 10 years, what is the approximate Lorentz factor (γ) required?",
            options: [
                "3.15 x 10^8",
                "1.0000005",
                "9.81 x 10^4",
                "3.00 x 10^8"
            ],
            answer: 0,
            explanation: "10 years is approximately 315,360,000 seconds. If Δt (operator) = γ * Δt_0 (external), then γ = 315,360,000 / 1 = 3.15 x 10^8. This requires extreme metric manipulation, nearly indistinguishable from an event horizon."
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
