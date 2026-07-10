import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const description = "The God-Tier Hyperspace Jump Gate. A class-5 mega-structure capable of bending the fabric of space-time to bridge intergalactic distances. Features a stabilized artificial singularity, multi-dimensional chronometric rings, gravimetric anchor pylons, and handles transit of massive colony vessels.";

    // ============================================================================
    // CUSTOM HIGH-TECH MATERIALS
    // ============================================================================
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 2.5,
        roughness: 0.1,
        metalness: 0.8,
        transparent: true,
        opacity: 0.9
    });

    const neonPurple = new THREE.MeshStandardMaterial({
        color: 0x8800ff,
        emissive: 0x8800ff,
        emissiveIntensity: 3.0,
        roughness: 0.2,
        metalness: 0.9
    });

    const neonCyan = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 4.0,
        roughness: 0.1,
        metalness: 1.0
    });
    
    const neonOrange = new THREE.MeshStandardMaterial({
        color: 0xff6600,
        emissive: 0xff6600,
        emissiveIntensity: 3.5,
        roughness: 0.3,
        metalness: 0.7
    });

    const intenseWhite = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 5.0,
        roughness: 0.0,
        metalness: 1.0
    });

    // ============================================================================
    // SINGULARITY CORE (EVENT HORIZON) SHADER
    // ============================================================================
    const wormholeVertexShader = `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform float time;
        void main() {
            vUv = uv;
            vPosition = position;
            vec3 pos = position;
            float dist = length(pos.xy);
            // Ripple effect propagating outward from the singularity
            pos.z += sin(dist * 0.5 - time * 10.0) * 2.5 * exp(-dist * 0.04);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `;

    const wormholeFragmentShader = `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform float time;
        void main() {
            vec2 uv = vUv - 0.5;
            float dist = length(uv);
            float angle = atan(uv.y, uv.x);
            
            // Swirling galaxy/spiral effect
            float spiral = sin(15.0 * angle + 40.0 * dist - time * 8.0);
            float spiral2 = cos(8.0 * angle + 20.0 * dist - time * 5.0);
            
            vec3 colorInner = vec3(0.0, 0.8, 1.0);
            vec3 colorOuter = vec3(0.4, 0.0, 0.8);
            
            vec3 finalColor = mix(colorInner, colorOuter, dist * 2.0);
            finalColor += vec3(spiral * 0.3 * (1.0 - dist * 2.0));
            finalColor += vec3(spiral2 * 0.2 * (1.0 - dist * 2.0));
            
            // Event horizon black hole center
            float blackHole = smoothstep(0.05, 0.15, dist);
            finalColor *= blackHole;
            
            // Intense glow near the edge of the singularity
            float glow = exp(-(dist - 0.15) * 20.0) * 2.5;
            finalColor += vec3(glow * 0.5, glow * 0.8, glow);
            
            // Gravitational lensing rim
            float rim = smoothstep(0.45, 0.5, dist);
            finalColor += mix(vec3(0.0), vec3(0.5, 0.2, 1.0), rim);
            
            float alpha = 1.0 - smoothstep(0.48, 0.5, dist);
            gl_FragColor = vec4(finalColor, alpha);
        }
    `;

    const wormholeMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0.0 }
        },
        vertexShader: wormholeVertexShader,
        fragmentShader: wormholeFragmentShader,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false
    });

    const wormholeGeom = new THREE.PlaneGeometry(100, 100, 128, 128);
    const wormhole = new THREE.Mesh(wormholeGeom, wormholeMaterial);
    group.add(wormhole);

    parts.push({
        name: "Singularity Core",
        description: "A stable artificially generated wormhole event horizon, bending spacetime to bridge vast interstellar distances.",
        material: "Exotic Matter / Quantum Fields",
        function: "Space-time distortion and transportation",
        assemblyOrder: 1,
        connections: ["Inner Ring Assembly", "Gravitational Stabilizers"],
        failureEffect: "Spontaneous spaghettification of the local solar system.",
        cascadeFailures: ["Total localized reality collapse", "Temporal paradoxes"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -200 }
    });

    // ============================================================================
    // OUTER MEGA-STRUCTURE (PRIMARY DARK MATTER TORUS)
    // ============================================================================
    const outerRingGroup = new THREE.Group();
    group.add(outerRingGroup);

    // Main structural torus (Massive scale)
    const ring1Geom = new THREE.TorusGeometry(60, 4, 64, 256);
    const ring1 = new THREE.Mesh(ring1Geom, darkSteel);
    outerRingGroup.add(ring1);
    
    // Secondary parallel containment toruses
    const ring2Geom = new THREE.TorusGeometry(62, 1.5, 32, 256);
    const ring2 = new THREE.Mesh(ring2Geom, steel);
    ring2.position.z = 4;
    outerRingGroup.add(ring2);

    const ring3Geom = new THREE.TorusGeometry(62, 1.5, 32, 256);
    const ring3 = new THREE.Mesh(ring3Geom, steel);
    ring3.position.z = -4;
    outerRingGroup.add(ring3);

    parts.push({
        name: "Primary Dark Matter Torus",
        description: "The main structural framework of the gate, housing dark matter containment fields.",
        material: "Dark Steel / Neutronium Alloy",
        function: "Structural integrity and dark matter circulation",
        assemblyOrder: 2,
        connections: ["Singularity Core", "Flux Stabilizer Nodules"],
        failureEffect: "Containment breach leading to implosion.",
        cascadeFailures: ["Singularity destabilization"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 150 }
    });

    // Outer ring greebles: 120 Flux Stabilizer Nodules (Extensive Geometry Loop)
    const noduleCount = 120;
    for(let i=0; i<noduleCount; i++) {
        const angle = (i / noduleCount) * Math.PI * 2;
        const x = Math.cos(angle) * 60;
        const y = Math.sin(angle) * 60;
        
        const noduleGroup = new THREE.Group();
        noduleGroup.position.set(x, y, 0);
        // Look tangentially outward
        noduleGroup.lookAt(new THREE.Vector3(x * 2, y * 2, 0));
        
        // Main block (ExtrudeGeometry to avoid simple cubes)
        const blockShape = new THREE.Shape();
        blockShape.moveTo(-2, -2);
        blockShape.lineTo(2, -2);
        blockShape.lineTo(3, 0);
        blockShape.lineTo(2, 2);
        blockShape.lineTo(-2, 2);
        blockShape.lineTo(-3, 0);
        blockShape.lineTo(-2, -2);
        
        const blockExtrudeSettings = { depth: 8, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.1, bevelThickness: 0.1 };
        const blockGeom = new THREE.ExtrudeGeometry(blockShape, blockExtrudeSettings);
        const block = new THREE.Mesh(blockGeom, darkSteel);
        block.position.z = -4;
        noduleGroup.add(block);

        // Heat sinks
        for(let j=0; j<4; j++) {
            const finGeom = new THREE.BoxGeometry(0.5, 5, 2);
            const fin = new THREE.Mesh(finGeom, copper);
            fin.position.set(-1.5 + j, 0, 4);
            noduleGroup.add(fin);
        }

        // Energy emitters pointing inwards towards the core
        const emitterGeom = new THREE.CylinderGeometry(0.5, 0.2, 6, 16);
        const emitter = new THREE.Mesh(emitterGeom, neonBlue);
        emitter.rotation.x = Math.PI / 2;
        emitter.position.z = -6;
        noduleGroup.add(emitter);
        
        // Micro-pipes
        const pipeCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(2, 0, -2),
            new THREE.Vector3(4, 2, 0),
            new THREE.Vector3(2, 0, 2)
        ]);
        const pipeGeom = new THREE.TubeGeometry(pipeCurve, 8, 0.2, 8, false);
        const pipe1 = new THREE.Mesh(pipeGeom, chrome);
        noduleGroup.add(pipe1);

        const pipeCurve2 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-2, 0, -2),
            new THREE.Vector3(-4, -2, 0),
            new THREE.Vector3(-2, 0, 2)
        ]);
        const pipeGeom2 = new THREE.TubeGeometry(pipeCurve2, 8, 0.2, 8, false);
        const pipe2 = new THREE.Mesh(pipeGeom2, chrome);
        noduleGroup.add(pipe2);

        outerRingGroup.add(noduleGroup);
    }

    parts.push({
        name: "Flux Stabilizer Nodules",
        description: "120 distinct modules distributed along the primary torus to maintain gravity shear fields.",
        material: "Copper, Dark Steel, Chrome",
        function: "Gravity shear stabilization",
        assemblyOrder: 3,
        connections: ["Primary Dark Matter Torus"],
        failureEffect: "Micro-fissures in space-time near the gate edge.",
        cascadeFailures: ["Sub-space communication blackout"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 200, y: 200, z: 0 }
    });

    // ============================================================================
    // INNER CHRONO AND SPATIAL RINGS
    // ============================================================================
    const innerRing1Group = new THREE.Group();
    const innerRing2Group = new THREE.Group();
    group.add(innerRing1Group);
    group.add(innerRing2Group);

    // Inner Ring 1 - Chrono Ring
    const chronoGeom = new THREE.TorusGeometry(45, 2, 32, 128);
    const chronoRing = new THREE.Mesh(chronoGeom, chrome);
    innerRing1Group.add(chronoRing);
    
    // Add glowing segments to inner ring 1
    for(let i=0; i<36; i++) {
        const angle = (i / 36) * Math.PI * 2;
        const cx = Math.cos(angle) * 45;
        const cy = Math.sin(angle) * 45;
        const segGeom = new THREE.CylinderGeometry(2.5, 2.5, 4.5, 32);
        const seg = new THREE.Mesh(segGeom, neonPurple);
        seg.position.set(cx, cy, 0);
        seg.lookAt(new THREE.Vector3(cx * 2, cy * 2, 0));
        seg.rotation.x = Math.PI / 2;
        innerRing1Group.add(seg);
    }

    parts.push({
        name: "Chrono-Sync Ring",
        description: "High-speed counter-rotating inner ring that synchronizes temporal relativity for exiting matter.",
        material: "Chrome / Neon Plasma",
        function: "Temporal synchronization",
        assemblyOrder: 4,
        connections: ["Singularity Core"],
        failureEffect: "Matter arrives before it departed.",
        cascadeFailures: ["Causality loops"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -100 }
    });

    // Inner Ring 2 - Spatial Ring
    const spatialGeom = new THREE.TorusGeometry(35, 1.5, 32, 128);
    const spatialRing = new THREE.Mesh(spatialGeom, aluminum);
    innerRing2Group.add(spatialRing);

    for(let i=0; i<24; i++) {
        const angle = (i / 24) * Math.PI * 2;
        const cx = Math.cos(angle) * 35;
        const cy = Math.sin(angle) * 35;
        
        const housing = new THREE.Mesh(new THREE.CylinderGeometry(2, 3, 3, 6), steel);
        housing.position.set(cx, cy, 0);
        housing.lookAt(new THREE.Vector3(0, 0, 0));
        housing.rotation.x = Math.PI / 2;
        
        const core = new THREE.Mesh(new THREE.SphereGeometry(1.5, 16, 16), neonCyan);
        core.position.set(cx, cy, 0);
        
        innerRing2Group.add(housing);
        innerRing2Group.add(core);
    }

    parts.push({
        name: "Spatial Distortion Ring",
        description: "Focuses the exotic matter to widen the aperture of the singularity.",
        material: "Aluminum / Cyan Plasma",
        function: "Aperture widening",
        assemblyOrder: 5,
        connections: ["Chrono-Sync Ring"],
        failureEffect: "Aperture collapse, shearing incoming vessels in half.",
        cascadeFailures: ["Catastrophic matter-antimatter annihilation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 100 }
    });

    // ============================================================================
    // DIMENSIONAL ANCHOR PYLONS
    // ============================================================================
    const pylonGroup = new THREE.Group();
    group.add(pylonGroup);

    for(let i=0; i<4; i++) {
        const angle = (i / 4) * Math.PI * 2 + (Math.PI / 4);
        const px = Math.cos(angle) * 65;
        const py = Math.sin(angle) * 65;
        
        const pylonObj = new THREE.Group();
        pylonObj.position.set(px, py, 0);
        pylonObj.lookAt(new THREE.Vector3(0, 0, 0));
        pylonObj.rotation.y = Math.PI / 2;

        // Base strut
        const strutGeom = new THREE.CylinderGeometry(3, 8, 45, 32);
        const strut = new THREE.Mesh(strutGeom, darkSteel);
        strut.rotation.z = Math.PI / 2;
        strut.position.x = 22.5;
        pylonObj.add(strut);

        // Energy containment fields along strut
        const fieldGeom = new THREE.CylinderGeometry(4.5, 4.5, 35, 16);
        const field = new THREE.Mesh(fieldGeom, glass);
        field.rotation.z = Math.PI / 2;
        field.position.x = 22.5;
        pylonObj.add(field);
        
        // Inner glowing plasma stream
        const plasmaGeom = new THREE.CylinderGeometry(1.5, 1.5, 35, 16);
        const plasma = new THREE.Mesh(plasmaGeom, neonOrange);
        plasma.rotation.z = Math.PI / 2;
        plasma.position.x = 22.5;
        pylonObj.add(plasma);

        // Heavy armor plating (Lathed rings)
        for(let j=0; j<6; j++) {
            const armorGeom = new THREE.TorusGeometry(5, 1.5, 16, 32);
            const armor = new THREE.Mesh(armorGeom, steel);
            armor.rotation.y = Math.PI / 2;
            armor.position.set(10 + j*5, 0, 0);
            pylonObj.add(armor);
        }

        pylonGroup.add(pylonObj);
    }

    parts.push({
        name: "Dimensional Anchor Pylons",
        description: "Four massive stabilizing arms that project a zero-point gravity field, preventing the gate from being sucked into its own wormhole.",
        material: "Dark Steel, Orange Plasma, Armor Plating",
        function: "Real-space tethering",
        assemblyOrder: 6,
        connections: ["Primary Dark Matter Torus"],
        failureEffect: "Gate collapses into the singularity, taking local planets with it.",
        cascadeFailures: ["Galactic arm destabilization"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 300, y: 0, z: -300 }
    });

    // ============================================================================
    // EXTRA GREEBLES & SYSTEMS TO SATISFY "MASSIVE COMPLEXITY"
    // ============================================================================

    // 7. Tachyon Sensor Array
    const sensorGroup = new THREE.Group();
    for(let i=0; i<8; i++){
        const angle = (i/8) * Math.PI * 2;
        const sx = Math.cos(angle) * 75;
        const sy = Math.sin(angle) * 75;
        const sensor = new THREE.Mesh(new THREE.ConeGeometry(1.5, 6, 16), glass);
        sensor.position.set(sx, sy, 5);
        sensor.lookAt(new THREE.Vector3(0,0,0));
        sensor.rotation.x -= Math.PI / 2; // Point outwards
        
        const sensorBase = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 2, 16), steel);
        sensorBase.position.set(sx, sy, 3);
        sensorBase.lookAt(new THREE.Vector3(0,0,0));
        sensorBase.rotation.x -= Math.PI / 2;
        
        sensorGroup.add(sensor);
        sensorGroup.add(sensorBase);
    }
    group.add(sensorGroup);

    parts.push({
        name: "Tachyon Sensor Array",
        description: "Detects superluminal particles to predict incoming quantum anomalies before they manifest.",
        material: "Quartz / Titanium",
        function: "Early warning and telemetry",
        assemblyOrder: 7,
        connections: ["Primary Dark Matter Torus"],
        failureEffect: "Gate fails to calibrate for incoming mass.",
        cascadeFailures: ["Vessel destruction upon exit"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 50 }
    });

    // 8. Plasma Venting Manifolds
    const ventGroup = new THREE.Group();
    for(let i=0; i<16; i++){
        const angle = (i/16) * Math.PI * 2;
        const vx = Math.cos(angle) * 55;
        const vy = Math.sin(angle) * 55;
        const vent = new THREE.Mesh(new THREE.TorusGeometry(2, 0.8, 16, 32), chrome);
        vent.position.set(vx, vy, -6);
        vent.rotation.x = Math.PI/2;
        vent.rotation.y = angle;
        ventGroup.add(vent);
    }
    group.add(ventGroup);

    parts.push({
        name: "Plasma Venting Manifolds",
        description: "Expels superheated plasma from the secondary fusion reactions to prevent thermal cascade.",
        material: "Chrome / Heat-resistant Ceramics",
        function: "Thermal regulation",
        assemblyOrder: 8,
        connections: ["Primary Dark Matter Torus"],
        failureEffect: "Thermal runaway melting the inner structural supports.",
        cascadeFailures: ["Complete structural collapse"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -50 }
    });
    
    // 9. Magnetic Confinement Coils
    const coilGroup = new THREE.Group();
    for(let i=0; i<32; i++){
        const angle = (i/32) * Math.PI * 2;
        const cx = Math.cos(angle) * 50;
        const cy = Math.sin(angle) * 50;
        const coil = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 10, 32), copper);
        coil.position.set(cx, cy, 0);
        coil.rotation.z = angle;
        coilGroup.add(coil);
    }
    group.add(coilGroup);

    parts.push({
        name: "Magnetic Confinement Coils",
        description: "Wraps the primary torus in a billion-Tesla magnetic field to contain the antimatter flow.",
        material: "Superconducting Copper",
        function: "Antimatter containment",
        assemblyOrder: 9,
        connections: ["Primary Dark Matter Torus"],
        failureEffect: "Antimatter contacts normal matter.",
        cascadeFailures: ["10,000 Megaton explosion"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 50, y: 50, z: 0 }
    });

    // 10. Sub-space Communication Antenna
    const commsGroup = new THREE.Group();
    const commsBase = new THREE.Mesh(new THREE.CylinderGeometry(2, 5, 15, 32), darkSteel);
    commsBase.position.set(0, 85, 0);
    const commsDish = new THREE.Mesh(new THREE.SphereGeometry(8, 32, 32, 0, Math.PI), aluminum);
    commsDish.position.set(0, 92.5, 0);
    commsDish.rotation.x = -Math.PI / 2;
    
    // Dish antenna spike
    const commsSpike = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 10, 16), chrome);
    commsSpike.position.set(0, 97.5, 0);
    
    commsGroup.add(commsBase);
    commsGroup.add(commsDish);
    commsGroup.add(commsSpike);
    group.add(commsGroup);

    parts.push({
        name: "Sub-space Communication Array",
        description: "Transmits instantaneous telemetry across galactic distances using quantum entanglement.",
        material: "Aluminum, Dark Steel",
        function: "Interstellar Communication",
        assemblyOrder: 10,
        connections: ["Primary Dark Matter Torus"],
        failureEffect: "Loss of remote control from Command.",
        cascadeFailures: ["Gate becomes fully autonomous (Rogue AI potential)"],
        originalPosition: { x: 0, y: 80, z: 0 },
        explodedPosition: { x: 0, y: 150, z: 0 }
    });

    // 11. Zero-Point Energy Siphons
    const siphonGroup = new THREE.Group();
    for(let i=0; i<6; i++){
        const angle = (i/6) * Math.PI * 2;
        const sx = Math.cos(angle) * 40;
        const sy = Math.sin(angle) * 40;
        const siphon = new THREE.Mesh(new THREE.OctahedronGeometry(3.5, 2), neonPurple); // Detailed octahedron
        siphon.position.set(sx, sy, 12);
        
        const cage = new THREE.Mesh(new THREE.IcosahedronGeometry(4.5, 1), wireframeMaterial(steel));
        cage.position.set(sx, sy, 12);
        
        siphonGroup.add(siphon);
        siphonGroup.add(cage);
    }
    group.add(siphonGroup);

    // Helper for wireframe
    function wireframeMaterial(mat) {
        return new THREE.MeshBasicMaterial({color: 0x555555, wireframe: true});
    }

    parts.push({
        name: "Zero-Point Energy Siphons",
        description: "Extracts infinite energy directly from the quantum vacuum state to power the singularity.",
        material: "Purple Plasma / Exotic Matter",
        function: "Power generation",
        assemblyOrder: 11,
        connections: ["Singularity Core"],
        failureEffect: "Power drop, singularity pinches off.",
        cascadeFailures: ["Gate shutdown"],
        originalPosition: { x: 0, y: 0, z: 12 },
        explodedPosition: { x: 0, y: 0, z: 80 }
    });

    // 12. Navigational Deflectors
    const deflectorGroup = new THREE.Group();
    for(let i=0; i<12; i++){
        const angle = (i/12) * Math.PI * 2;
        const dx = Math.cos(angle) * 25;
        const dy = Math.sin(angle) * 25;
        const defGeom = new THREE.CylinderGeometry(4, 4, 1, 6); // Hexagonal deflectors
        const def = new THREE.Mesh(defGeom, tinted);
        def.position.set(dx, dy, 20);
        def.lookAt(new THREE.Vector3(0,0,50));
        def.rotation.x = Math.PI / 2;
        deflectorGroup.add(def);
    }
    group.add(deflectorGroup);

    parts.push({
        name: "Navigational Deflectors",
        description: "Pushes micro-meteoroids and interstellar dust out of the flight path entering the gate.",
        material: "Tinted Glass / Forcefield",
        function: "Debris clearing",
        assemblyOrder: 12,
        connections: ["Singularity Core"],
        failureEffect: "Dust grains impact ships at 0.99c.",
        cascadeFailures: ["Vessel destruction"],
        originalPosition: { x: 0, y: 0, z: 20 },
        explodedPosition: { x: 0, y: 0, z: 100 }
    });

    // 13. Quantum Entanglement Router
    const routerGroup = new THREE.Group();
    const routerMesh = new THREE.Mesh(new THREE.DodecahedronGeometry(6, 1), neonOrange);
    routerMesh.position.set(0, -85, 0);
    
    // Rings around router
    const routerRing1 = new THREE.Mesh(new THREE.TorusGeometry(10, 0.5, 16, 64), chrome);
    routerRing1.position.set(0, -85, 0);
    routerRing1.rotation.x = Math.PI / 4;

    const routerRing2 = new THREE.Mesh(new THREE.TorusGeometry(10, 0.5, 16, 64), chrome);
    routerRing2.position.set(0, -85, 0);
    routerRing2.rotation.x = -Math.PI / 4;

    routerGroup.add(routerMesh);
    routerGroup.add(routerRing1);
    routerGroup.add(routerRing2);
    group.add(routerGroup);

    parts.push({
        name: "Quantum Entanglement Router",
        description: "Manages the multi-dimensional routing tables to ensure ships exit at the correct spatial coordinates.",
        material: "Orange Plasma / Silicon",
        function: "Destination Routing",
        assemblyOrder: 13,
        connections: ["Primary Dark Matter Torus"],
        failureEffect: "Ship exits in the middle of a star.",
        cascadeFailures: ["Total loss of crew"],
        originalPosition: { x: 0, y: -85, z: 0 },
        explodedPosition: { x: 0, y: -150, z: 0 }
    });

    // ============================================================================
    // SPACECRAFT: USS PROMETHEUS (WARP / SPAGHETTIFICATION EFFECT)
    // ============================================================================
    const shipGroup = new THREE.Group();
    
    // Main Hull (Lathe Geometry for aerodynamic/hydrodynamic hyper-shape)
    const points = [];
    for ( let i = 0; i <= 30; i ++ ) {
        const t = i / 30;
        const x = Math.sin(t * Math.PI) * 5 + 1.5; // radius
        const y = (t - 0.5) * 60; // length
        points.push( new THREE.Vector2( x, y ) );
    }
    const hullGeom = new THREE.LatheGeometry(points, 64);
    const hull = new THREE.Mesh(hullGeom, steel);
    hull.rotation.x = Math.PI / 2; // Point along Z
    shipGroup.add(hull);

    // Engine Section
    const engineGroup = new THREE.Group();
    engineGroup.position.z = 30; // Back of the ship
    
    // 5 Main Thrusters
    for(let i=0; i<5; i++) {
        const angle = (i/5) * Math.PI * 2;
        const ex = Math.cos(angle) * 4;
        const ey = Math.sin(angle) * 4;
        
        // Bell
        const bellGeom = new THREE.CylinderGeometry(2, 0.5, 8, 32);
        const bell = new THREE.Mesh(bellGeom, darkSteel);
        bell.rotation.x = Math.PI / 2;
        bell.position.set(ex, ey, 4);
        engineGroup.add(bell);

        // Plume
        const plumeGeom = new THREE.CylinderGeometry(1.8, 4, 15, 32);
        const plume = new THREE.Mesh(plumeGeom, neonBlue);
        plume.rotation.x = Math.PI / 2;
        plume.position.set(ex, ey, 15);
        engineGroup.add(plume);
    }
    
    // Central Super-thruster
    const centerBell = new THREE.Mesh(new THREE.CylinderGeometry(3, 1, 10, 32), darkSteel);
    centerBell.rotation.x = Math.PI / 2;
    centerBell.position.set(0, 0, 5);
    engineGroup.add(centerBell);
    const centerPlume = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 6, 20, 32), intenseWhite);
    centerPlume.rotation.x = Math.PI / 2;
    centerPlume.position.set(0, 0, 20);
    engineGroup.add(centerPlume);

    shipGroup.add(engineGroup);

    // Ship Wings (ExtrudeGeometry)
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0);
    wingShape.lineTo(25, -15);
    wingShape.lineTo(25, -20);
    wingShape.lineTo(0, -10);
    wingShape.lineTo(-25, -20);
    wingShape.lineTo(-25, -15);
    wingShape.lineTo(0, 0);

    const extrudeSettings = { depth: 1.5, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.5, bevelThickness: 0.5 };
    const wings = new THREE.Mesh(new THREE.ExtrudeGeometry(wingShape, extrudeSettings), darkSteel);
    wings.rotation.x = Math.PI / 2;
    wings.position.set(0, 0, 10);
    shipGroup.add(wings);

    // Cargo/Habitat Rings
    for(let i=0; i<4; i++) {
        const habGeom = new THREE.TorusGeometry(12, 1.5, 32, 128);
        const hab = new THREE.Mesh(habGeom, plastic);
        hab.position.z = -15 + i*10;
        shipGroup.add(hab);
        
        // Spokes
        for(let j=0; j<6; j++) {
            const spokeGeom = new THREE.CylinderGeometry(0.5, 0.5, 12, 16);
            const spoke = new THREE.Mesh(spokeGeom, steel);
            spoke.rotation.z = (j/6) * Math.PI;
            spoke.position.z = -15 + i*10;
            shipGroup.add(spoke);
        }
    }

    // Cargo containers along the spine
    for(let i = 0; i < 15; i++) {
        const cargoGroup = new THREE.Group();
        cargoGroup.position.z = -20 + i * 3;
        
        const hexGeom = new THREE.CylinderGeometry(2.5, 2.5, 2.5, 6);
        const cargo = new THREE.Mesh(hexGeom, aluminum);
        cargo.rotation.z = Math.PI / 2;
        cargoGroup.add(cargo);

        const lightGeom = new THREE.BoxGeometry(0.3, 0.3, 0.3);
        const light = new THREE.Mesh(lightGeom, neonBlue);
        light.position.y = 2.6;
        cargoGroup.add(light);

        shipGroup.add(cargoGroup);
    }

    // Command Bridge
    const bridgeGeom = new THREE.BoxGeometry(4, 3, 8);
    const bridge = new THREE.Mesh(bridgeGeom, aluminum);
    bridge.position.set(0, 7, -25);
    shipGroup.add(bridge);
    
    // Windows on bridge
    const windowGeom = new THREE.PlaneGeometry(3.5, 1.5);
    const windowMesh = new THREE.Mesh(windowGeom, tinted);
    windowMesh.position.set(0, 7.1, -29);
    windowMesh.rotation.x = -Math.PI / 8;
    shipGroup.add(windowMesh);

    // Antenna array
    const antGeom = new THREE.CylinderGeometry(0.15, 0.15, 15, 16);
    const antenna = new THREE.Mesh(antGeom, chrome);
    antenna.position.set(0, 12, -25);
    shipGroup.add(antenna);

    // Position ship away from gate initially
    shipGroup.position.set(0, 0, 400);
    group.add(shipGroup);

    parts.push({
        name: "USS Prometheus (Colony Ship)",
        description: "A massive multi-generation colony ship, weighing 4.2 million metric tons, equipped with habitat rings and fusion drives.",
        material: "Steel, Plastic, Titanium",
        function: "Interstellar colonization and transport",
        assemblyOrder: 14,
        connections: ["None (Free floating)"],
        failureEffect: "Loss of 50,000 colonists.",
        cascadeFailures: ["Mission Failure"],
        originalPosition: { x: 0, y: 0, z: 400 },
        explodedPosition: { x: -300, y: 0, z: 400 }
    });

    // ============================================================================
    // PARTICLE ACCELERATOR SYSTEM (VISUAL EFFECTS)
    // ============================================================================
    // Thousands of particles flowing into the wormhole
    const particleCount = 2000;
    const particles = new THREE.Group();
    const particleGeom = new THREE.BoxGeometry(0.5, 0.5, 3);
    
    const particleData = [];
    for(let i=0; i<particleCount; i++) {
        const pMat = Math.random() > 0.5 ? neonBlue : neonCyan;
        const pMesh = new THREE.Mesh(particleGeom, pMat);
        
        const radius = 10 + Math.random() * 90;
        const theta = Math.random() * Math.PI * 2;
        const z = 10 + Math.random() * 250;
        
        pMesh.position.set(radius * Math.cos(theta), radius * Math.sin(theta), z);
        pMesh.lookAt(new THREE.Vector3(0,0,0));
        
        particles.add(pMesh);
        particleData.push({
            mesh: pMesh,
            radius: radius,
            theta: theta,
            z: z,
            speed: 1.0 + Math.random() * 3.0,
            spin: (Math.random() - 0.5) * 0.15
        });
    }
    group.add(particles);

    parts.push({
        name: "Hawking Radiation Particles",
        description: "Highly charged exotic particles escaping the event horizon, caught in the magnetic containment field.",
        material: "Pure Energy",
        function: "Energy bleed-off",
        assemblyOrder: 15,
        connections: ["Singularity Core"],
        failureEffect: "Radiation flooding the local sector.",
        cascadeFailures: ["Biosphere annihilation on nearby planets"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -200, z: 0 }
    });


    // ============================================================================
    // ANIMATION & LOGIC (EXTREME SYNCHRONIZATION)
    // ============================================================================
    
    let shipPhase = 0; // 0: approaching, 1: warping, 2: reset
    
    const animate = (time, speed, meshes) => {
        // Update wormhole shader
        if(wormholeMaterial.uniforms) {
            wormholeMaterial.uniforms.time.value = time;
        }

        // Counter-rotating rings
        outerRingGroup.rotation.z = time * 0.05 * speed;
        
        innerRing1Group.rotation.z = -time * 0.4 * speed;
        innerRing1Group.rotation.x = Math.sin(time * 0.6) * 0.05; // slight gyroscopic wobble
        innerRing1Group.rotation.y = Math.cos(time * 0.6) * 0.05;

        innerRing2Group.rotation.z = time * 0.8 * speed;
        innerRing2Group.rotation.x = Math.cos(time * 0.9) * 0.1;
        innerRing2Group.rotation.y = Math.sin(time * 0.9) * 0.1;

        // Router spinning
        routerRing1.rotation.y = time * 1.5 * speed;
        routerRing2.rotation.x = time * 1.5 * speed;
        routerMesh.rotation.z = -time * 0.5 * speed;

        // Siphon pulsing
        siphonGroup.children.forEach((child, index) => {
            if(child.geometry.type === 'OctahedronGeometry') {
                const scale = 1.0 + Math.sin(time * 5.0 + index) * 0.2;
                child.scale.set(scale, scale, scale);
            }
        });

        // Particle dynamics (spiral inward, accelerating towards singularity)
        for(let i=0; i<particleCount; i++) {
            let data = particleData[i];
            data.theta += data.spin * speed;
            
            // Accelerate as they get closer to z=0
            const currentSpeed = data.speed * speed * (1.0 + (300 - data.z) * 0.01);
            
            data.z -= currentSpeed;
            data.radius -= (currentSpeed * 0.05);

            // Reset particle if it enters singularity
            if(data.z < 0 || data.radius < 5) {
                data.z = 150 + Math.random() * 200;
                data.radius = 20 + Math.random() * 80;
                data.theta = Math.random() * Math.PI * 2;
            }

            data.mesh.position.set(
                data.radius * Math.cos(data.theta),
                data.radius * Math.sin(data.theta),
                data.z
            );
            data.mesh.lookAt(new THREE.Vector3(0,0,0));
        }

        // Ship Animation (Approach -> Spaghettify -> Jump -> Reset)
        if(shipPhase === 0) {
            // Approaching
            shipGroup.position.z -= 1.5 * speed;
            
            // Spaghettification Zone
            if(shipGroup.position.z < 150) {
                // Calculate stretch factor based on proximity to event horizon (exponential increase)
                const stretch = 1.0 + Math.pow((150 - shipGroup.position.z) * 0.05, 2);
                const squash = 1.0 / Math.sqrt(stretch); // Preserve volume visually
                shipGroup.scale.set(squash, squash, stretch);
                
                // Extreme gravitational vibration
                const jitter = (150 - shipGroup.position.z) * 0.01;
                shipGroup.position.x = (Math.random() - 0.5) * jitter;
                shipGroup.position.y = (Math.random() - 0.5) * jitter;
                
                // Thrusters glow brighter
                centerPlume.scale.set(1, 1, 1 + stretch * 0.5);
            } else {
                shipGroup.scale.set(1, 1, 1);
                shipGroup.position.x = 0;
                shipGroup.position.y = 0;
                centerPlume.scale.set(1, 1, 1);
            }

            // Cross event horizon
            if(shipGroup.position.z < -10) {
                shipPhase = 1;
                // Flash effect by scaling singularity
                wormhole.scale.set(1.8, 1.8, 1.8);
            }
        } else if (shipPhase === 1) {
            // Ship has warped, reset singularity scale
            wormhole.scale.lerp(new THREE.Vector3(1,1,1), 0.05 * speed);
            shipGroup.visible = false;
            
            // Wait briefly before resetting
            if(wormhole.scale.x < 1.05) {
                shipPhase = 2;
            }
        } else if (shipPhase === 2) {
            // Reset ship far away
            shipGroup.position.set(0, 0, 400);
            shipGroup.scale.set(1,1,1);
            shipGroup.visible = true;
            shipPhase = 0;
        }
    };

    // ============================================================================
    // PHD-LEVEL QUIZ QUESTIONS
    // ============================================================================
    const quizQuestions = [
        {
            question: "In the context of the Alcubierre drive metric and this hyperspace gate, what type of energy density is strictly required to create the negative space-time curvature for the wormhole throat to remain open?",
            options: [
                "Zero-point vacuum energy",
                "Positive Mass-Energy Equivalence",
                "Negative Energy Density (Exotic Matter)",
                "Bose-Einstein Condensate"
            ],
            correctAnswer: 2,
            explanation: "General relativity requires negative energy density (exotic matter) to prop open a traversable wormhole throat, explicitly violating the Null Energy Condition."
        },
        {
            question: "As the USS Prometheus approaches the event horizon, the observed wavelength of light emitted from its stern engines appears to lengthen to a stationary observer on the gate. What is the fundamental cause of this?",
            options: [
                "Gravitational Blueshift",
                "Gravitational Redshift due to Time Dilation",
                "Cherenkov Radiation",
                "Synchrotron Radiation"
            ],
            correctAnswer: 1,
            explanation: "Gravitational redshift occurs when electromagnetic radiation propagates out of a deep gravitational well, losing energy and increasing in wavelength, correlated directly with gravitational time dilation."
        },
        {
            question: "The extreme stretching of the spacecraft along the axis of the singularity (Spaghettification) is mathematically represented by the divergence of which tensor?",
            options: [
                "The Riemann Curvature Tensor (specifically the Weyl tensor components)",
                "The Stress-Energy Tensor",
                "The Ricci Tensor",
                "The Metric Tensor"
            ],
            correctAnswer: 0,
            explanation: "Spaghettification (extreme tidal forces) is a consequence of the non-uniformity of the gravitational field, described by the Weyl tensor components of the Riemann curvature tensor in a vacuum."
        },
        {
            question: "To prevent the wormhole from collapsing into a standard Schwarzschild black hole, the 'Chrono-Sync' rings must counteract the throat's natural tendency to pinch off. According to the Morris-Thorne metric, what parameter must exceed the mass-energy density?",
            options: [
                "Radial tension",
                "Angular momentum",
                "Electromagnetic flux",
                "Isotropic pressure"
            ],
            correctAnswer: 0,
            explanation: "To keep the wormhole open, the radial tension must be exceedingly large, surpassing the mass-energy density, thus necessitating exotic matter with negative pressure."
        },
        {
            question: "The anchor pylons prevent the gate from undergoing gravitational collapse. If the singularity is rapidly rotating (Kerr metric), what is the boundary called where the rotational frame-dragging of spacetime equals the speed of light, forcing all matter to co-rotate?",
            options: [
                "The Ergosphere (Static Limit)",
                "The Photon Sphere",
                "The Cauchy Horizon",
                "The Accretion Disk"
            ],
            correctAnswer: 0,
            explanation: "The ergosphere is the region bounded by the static limit outside a rotating black hole's event horizon, where space-time itself is dragged along so severely that no object can remain stationary."
        }
    ];

    return { group, parts, description, quizQuestions, animate };
}
