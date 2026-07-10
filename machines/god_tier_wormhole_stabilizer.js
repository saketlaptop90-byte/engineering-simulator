import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const updatables = [];

    // ==========================================
    // CUSTOM SHADERS & EXOTIC MATERIALS
    // ==========================================
    
    // Wormhole Event Horizon Shader (Gravitational Lensing & Swirl)
    const wormholeShader = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0.0 },
            coreColor: { value: new THREE.Color(0x000000) },
            edgeColor: { value: new THREE.Color(0x2255ff) },
            accretionColor: { value: new THREE.Color(0xffaa00) }
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vPosition;
            uniform float time;
            
            void main() {
                vUv = uv;
                vNormal = normalize(normalMatrix * normal);
                
                // Pulsating spatial distortion
                vec3 pos = position;
                float distortion = sin(pos.y * 5.0 + time * 3.0) * 0.15;
                pos += normal * distortion;
                
                vPosition = (modelViewMatrix * vec4(pos, 1.0)).xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 coreColor;
            uniform vec3 edgeColor;
            uniform vec3 accretionColor;
            
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vPosition;
            
            // Pseudo-random noise for accretion disk
            float random(vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
            }
            
            void main() {
                // Center origin
                vec2 uv = vUv * 2.0 - 1.0;
                float r = length(uv);
                float angle = atan(uv.y, uv.x);
                
                // Frame dragging / swirling effect
                float swirl = angle + (1.0 / (r + 0.1)) * 2.0 - time * 4.0;
                float noise = random(vec2(cos(swirl), sin(swirl)) * r * 10.0 + time * 0.1);
                
                // Inverse light logic (dark core, bright ring)
                float coreMask = smoothstep(0.2, 0.35, r);
                float ringMask = smoothstep(0.5, 0.3, r) * smoothstep(0.1, 0.3, r);
                
                vec3 color = mix(coreColor, edgeColor, coreMask);
                color = mix(color, accretionColor, ringMask * noise * 1.5);
                
                // Edge fading for sphere projection
                float alpha = smoothstep(1.0, 0.8, r);
                
                // Add extreme brightness at the photon sphere
                float photonSphere = smoothstep(0.35, 0.32, r) * smoothstep(0.28, 0.32, r);
                color += accretionColor * photonSphere * 3.0;
                
                gl_FragColor = vec4(color, alpha);
            }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const exoticMatterMat = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x002288,
        emissiveIntensity: 2.5,
        transmission: 0.95,
        opacity: 1,
        metalness: 0.9,
        roughness: 0.05,
        ior: 1.2,
        thickness: 5.0,
        transparent: true,
        side: THREE.DoubleSide,
        wireframe: false
    });

    const neonPulseMat = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00aa,
        emissiveIntensity: 2.0,
        roughness: 0.2,
        metalness: 0.8
    });

    const plasmaStreamMat = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    });

    // ==========================================
    // HELPER GENERATORS FOR HYPER-REALISM
    // ==========================================

    function createFlangedCylinder(radiusTop, radiusBottom, height, radialSegments, material, flangeExtension, flangeThickness) {
        const cylGeom = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
        const cyl = new THREE.Mesh(cylGeom, material);
        
        const flangeGeomTop = new THREE.TorusGeometry(radiusTop + flangeExtension/2, flangeExtension/2, 4, radialSegments);
        const flangeTop = new THREE.Mesh(flangeGeomTop, material);
        flangeTop.rotation.x = Math.PI / 2;
        flangeTop.position.y = height / 2;
        
        const flangeGeomBot = new THREE.TorusGeometry(radiusBottom + flangeExtension/2, flangeExtension/2, 4, radialSegments);
        const flangeBot = new THREE.Mesh(flangeGeomBot, material);
        flangeBot.rotation.x = Math.PI / 2;
        flangeBot.position.y = -height / 2;
        
        cyl.add(flangeTop);
        cyl.add(flangeBot);
        return cyl;
    }

    function createHydraulicPiston(length, radius) {
        const pistonGroup = new THREE.Group();
        
        // Outer cylinder (housing)
        const housingGeom = new THREE.CylinderGeometry(radius, radius, length * 0.6, 16);
        const housing = new THREE.Mesh(housingGeom, steel);
        housing.position.y = length * 0.3;
        
        // Inner rod
        const rodGeom = new THREE.CylinderGeometry(radius * 0.6, radius * 0.6, length * 0.8, 16);
        const rod = new THREE.Mesh(rodGeom, chrome);
        rod.position.y = length * 0.7; // Initial extended position
        
        // Connectors
        const connectorGeom = new THREE.SphereGeometry(radius * 1.5, 16, 16);
        const baseConn = new THREE.Mesh(connectorGeom, darkSteel);
        const topConn = new THREE.Mesh(connectorGeom, darkSteel);
        topConn.position.y = length * 0.4;
        rod.add(topConn);
        
        housing.add(baseConn);
        pistonGroup.add(housing);
        pistonGroup.add(rod);
        
        return { group: pistonGroup, rod: rod, housing: housing, length: length };
    }

    function createTrussPylon(height, width, depth) {
        const trussGroup = new THREE.Group();
        
        // Main vertical beams
        const beamGeom = new THREE.CylinderGeometry(1.5, 1.5, height, 8);
        const positions = [
            [-width/2, -depth/2], [width/2, -depth/2],
            [-width/2, depth/2], [width/2, depth/2]
        ];
        
        positions.forEach(pos => {
            const beam = new THREE.Mesh(beamGeom, darkSteel);
            beam.position.set(pos[0], height/2, pos[1]);
            trussGroup.add(beam);
        });
        
        // Cross bracing
        const segments = Math.floor(height / (width * 1.5));
        const segmentHeight = height / segments;
        
        const braceMaterial = steel;
        for (let i = 0; i < segments; i++) {
            const yOffset = i * segmentHeight + segmentHeight/2;
            
            // Horizontal braces
            const hBraceGeomX = new THREE.CylinderGeometry(0.8, 0.8, width, 8);
            const hBraceX1 = new THREE.Mesh(hBraceGeomX, braceMaterial);
            hBraceX1.position.set(0, yOffset, depth/2);
            hBraceX1.rotation.z = Math.PI/2;
            
            const hBraceX2 = new THREE.Mesh(hBraceGeomX, braceMaterial);
            hBraceX2.position.set(0, yOffset, -depth/2);
            hBraceX2.rotation.z = Math.PI/2;
            
            const hBraceGeomZ = new THREE.CylinderGeometry(0.8, 0.8, depth, 8);
            const hBraceZ1 = new THREE.Mesh(hBraceGeomZ, braceMaterial);
            hBraceZ1.position.set(width/2, yOffset, 0);
            hBraceZ1.rotation.x = Math.PI/2;
            
            const hBraceZ2 = new THREE.Mesh(hBraceGeomZ, braceMaterial);
            hBraceZ2.position.set(-width/2, yOffset, 0);
            hBraceZ2.rotation.x = Math.PI/2;
            
            trussGroup.add(hBraceX1, hBraceX2, hBraceZ1, hBraceZ2);
            
            // Diagonal braces (simplified using planes for massive structural look, or thin cylinders)
            const diagLengthFront = Math.sqrt(width*width + segmentHeight*segmentHeight);
            const diagGeomFront = new THREE.CylinderGeometry(0.6, 0.6, diagLengthFront, 8);
            const diagFront = new THREE.Mesh(diagGeomFront, braceMaterial);
            diagFront.position.set(0, yOffset, depth/2);
            diagFront.rotation.z = Math.atan2(width, segmentHeight);
            trussGroup.add(diagFront);
            
            const diagBack = new THREE.Mesh(diagGeomFront, braceMaterial);
            diagBack.position.set(0, yOffset, -depth/2);
            diagBack.rotation.z = -Math.atan2(width, segmentHeight);
            trussGroup.add(diagBack);
        }
        
        return trussGroup;
    }

    // ==========================================
    // MASSIVE COMPONENT ASSEMBLY
    // ==========================================

    // 1. BASE FOUNDATION
    const foundationGroup = new THREE.Group();
    const baseGeom = new THREE.CylinderGeometry(150, 160, 10, 64);
    const baseMesh = new THREE.Mesh(baseGeom, darkSteel);
    baseMesh.position.y = -5;
    foundationGroup.add(baseMesh);

    // Foundation detailing (Grilles and Trenches)
    const trenchGeom = new THREE.TorusGeometry(100, 4, 16, 64);
    const trenchMesh = new THREE.Mesh(trenchGeom, steel);
    trenchMesh.rotation.x = Math.PI / 2;
    trenchMesh.position.y = 0.5;
    foundationGroup.add(trenchMesh);

    const floorGratingGeom = new THREE.RingGeometry(20, 140, 64, 4);
    const floorGrating = new THREE.Mesh(floorGratingGeom, steel);
    floorGrating.rotation.x = -Math.PI / 2;
    floorGrating.position.y = 0.1;
    // Add wireframe to simulate grating
    const gratingWire = new THREE.LineSegments(
        new THREE.WireframeGeometry(floorGratingGeom),
        new THREE.LineBasicMaterial({ color: 0x222222 })
    );
    gratingWire.rotation.x = -Math.PI / 2;
    gratingWire.position.y = 0.15;
    foundationGroup.add(floorGrating);
    foundationGroup.add(gratingWire);

    group.add(foundationGroup);

    // 2. THE STATOR RINGS & MAGNETIC COILS (Containment Field Generators)
    const statorGroup = new THREE.Group();
    statorGroup.position.y = 80; // Elevated above ground
    
    const ringRadius = 60;
    const ringTube = 8;
    const mainStatorGeom = new THREE.TorusGeometry(ringRadius, ringTube, 32, 128);
    const mainStator = new THREE.Mesh(mainStatorGeom, aluminum);
    mainStator.rotation.x = Math.PI / 2;
    statorGroup.add(mainStator);

    // Inner rotating magnetic exotic matter housing
    const innerStatorGeom = new THREE.TorusGeometry(ringRadius - 12, ringTube * 0.6, 32, 128);
    const innerStator = new THREE.Mesh(innerStatorGeom, darkSteel);
    innerStator.rotation.x = Math.PI / 2;
    statorGroup.add(innerStator);
    updatables.push({ mesh: innerStator, type: 'rotate', axis: 'z', speed: 0.5 }); // Rotates around its local Z (which is world Y due to rotation.x)

    // Exotic Matter Primary Ring (Glowing inverse material)
    const exoticRingGeom = new THREE.TorusGeometry(ringRadius - 12, ringTube * 0.4, 32, 128);
    const exoticRing = new THREE.Mesh(exoticRingGeom, exoticMatterMat);
    exoticRing.rotation.x = Math.PI / 2;
    statorGroup.add(exoticRing);
    updatables.push({ mesh: exoticRing, type: 'pulse', baseScale: 1.0, amplitude: 0.05, speed: 10.0 });

    // Instanced Mesh for Thousands of Copper Coils wrapping the main stator
    const coilCount = 720; // High detail
    const coilGeom = new THREE.TorusGeometry(ringTube * 1.2, 0.4, 8, 32);
    const coilInstanced = new THREE.InstancedMesh(coilGeom, copper, coilCount);
    
    const dummy = new THREE.Object3D();
    for (let i = 0; i < coilCount; i++) {
        const angle = (i / coilCount) * Math.PI * 2;
        
        // Position along the main ring
        dummy.position.set(
            Math.cos(angle) * ringRadius,
            0,
            Math.sin(angle) * ringRadius
        );
        
        // Orient the torus to wrap around the ring tube
        dummy.rotation.y = -angle;
        dummy.rotation.x = Math.PI / 2; 
        
        dummy.updateMatrix();
        coilInstanced.setMatrixAt(i, dummy.matrix);
    }
    statorGroup.add(coilInstanced);

    // Instanced Mesh for Stator Bolts/Rivets
    const boltCount = 360;
    const boltGeom = new THREE.CylinderGeometry(0.5, 0.5, 1, 6);
    const boltInstanced = new THREE.InstancedMesh(boltGeom, darkSteel, boltCount);
    for (let i = 0; i < boltCount; i++) {
        const angle = (i / boltCount) * Math.PI * 2;
        dummy.position.set(
            Math.cos(angle) * (ringRadius + ringTube * 1.5),
            0,
            Math.sin(angle) * (ringRadius + ringTube * 1.5)
        );
        dummy.rotation.set(0, -angle, Math.PI / 2);
        dummy.updateMatrix();
        boltInstanced.setMatrixAt(i, dummy.matrix);
    }
    statorGroup.add(boltInstanced);

    group.add(statorGroup);

    // 3. WORMHOLE THROAT & EVENT HORIZON
    const throatGroup = new THREE.Group();
    throatGroup.position.y = 80;

    // The Event Horizon Sphere
    const eventHorizonGeom = new THREE.SphereGeometry(25, 64, 64);
    const eventHorizon = new THREE.Mesh(eventHorizonGeom, wormholeShader);
    throatGroup.add(eventHorizon);
    
    // The Gravitational Lensing Shell (Refractive distortion simulation via transparency & scaling)
    const lensingGeom = new THREE.SphereGeometry(27, 64, 64);
    const lensingMat = new THREE.MeshPhysicalMaterial({
        transmission: 1.0,
        opacity: 1,
        metalness: 0,
        roughness: 0,
        ior: 2.5, // High index of refraction for gravity lensing
        thickness: 5,
        transparent: true,
        side: THREE.DoubleSide
    });
    const lensingShell = new THREE.Mesh(lensingGeom, lensingMat);
    throatGroup.add(lensingShell);
    updatables.push({ mesh: lensingShell, type: 'pulse', baseScale: 1.0, amplitude: 0.02, speed: 2.0 });

    // The Throat funnel (Hyperbolic Lathe)
    const throatPoints = [];
    for (let i = 0; i <= 64; i++) {
        const t = (i / 64) * Math.PI - (Math.PI / 2); // -PI/2 to PI/2
        // Hyperbolic profile: x = a * cosh(t), y = b * sinh(t)
        const x = 24 * Math.cosh(t * 1.5); 
        const y = 80 * Math.sinh(t * 1.5);
        throatPoints.push(new THREE.Vector2(x, y));
    }
    const funnelGeom = new THREE.LatheGeometry(throatPoints, 64);
    const funnelMat = new THREE.MeshStandardMaterial({
        color: 0x050510,
        emissive: 0x020211,
        metalness: 0.8,
        roughness: 0.2,
        side: THREE.DoubleSide,
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });
    const funnel = new THREE.Mesh(funnelGeom, funnelMat);
    throatGroup.add(funnel);
    updatables.push({ mesh: funnel, type: 'rotate', axis: 'y', speed: 1.0 });

    group.add(throatGroup);

    // 4. SUB-SPACE ANCHORING PYLONS & HYDRAULIC STABILIZERS
    const numPylons = 4;
    const pylonRadius = 110;
    const pylonHeight = 160;
    
    const pylonsGroup = new THREE.Group();
    const hydraulics = []; // Keep track to animate

    for (let i = 0; i < numPylons; i++) {
        const angle = (i / numPylons) * Math.PI * 2;
        
        // Main Pylon
        const pylon = createTrussPylon(pylonHeight, 20, 20);
        pylon.position.set(
            Math.cos(angle) * pylonRadius,
            0,
            Math.sin(angle) * pylonRadius
        );
        // Look at center
        pylon.rotation.y = -angle + Math.PI/2;
        pylonsGroup.add(pylon);

        // Heavy Base for Pylon
        const pBaseGeom = new THREE.BoxGeometry(30, 20, 30);
        const pBase = new THREE.Mesh(pBaseGeom, darkSteel);
        pBase.position.set(
            Math.cos(angle) * pylonRadius,
            10,
            Math.sin(angle) * pylonRadius
        );
        pBase.rotation.y = -angle + Math.PI/2;
        pylonsGroup.add(pBase);

        // Upper Anchor Point
        const anchorGeom = new THREE.CylinderGeometry(8, 8, 25, 16);
        const anchor = new THREE.Mesh(anchorGeom, steel);
        anchor.rotation.x = Math.PI/2;
        anchor.position.set(
            Math.cos(angle) * (pylonRadius - 10),
            pylonHeight - 20,
            Math.sin(angle) * (pylonRadius - 10)
        );
        anchor.rotation.y = -angle;
        pylonsGroup.add(anchor);

        // Hydraulic Stabilizer Arm (Connects pylon to stator)
        // We will create a complex armature that dynamically adjusts
        const piston = createHydraulicPiston(60, 4);
        
        // Position base of piston at anchor
        piston.group.position.copy(anchor.position);
        
        // Point piston towards the stator ring edge
        const targetPos = new THREE.Vector3(
            Math.cos(angle) * (ringRadius + ringTube),
            80,
            Math.sin(angle) * (ringRadius + ringTube)
        );
        piston.group.lookAt(targetPos);
        piston.group.rotateX(Math.PI/2); // Adjust orientation for cylinder
        
        pylonsGroup.add(piston.group);
        
        hydraulics.push({
            rod: piston.rod,
            baseOffset: piston.length * 0.7,
            phase: i * Math.PI/2 // Different phase for each piston
        });
    }
    group.add(pylonsGroup);
    
    // Register hydraulics for animation (they constantly micro-adjust to stabilize the throat)
    updatables.push({ type: 'hydraulics', items: hydraulics, speed: 2.0, amplitude: 5.0 });

    // 5. EXOTIC MASS INJECTORS
    const numInjectors = 8;
    const injectorGroup = new THREE.Group();
    injectorGroup.position.y = 80;

    for (let i = 0; i < numInjectors; i++) {
        const angle = (i / numInjectors) * Math.PI * 2;
        
        const singleInjector = new THREE.Group();
        
        // Injector Body
        const bodyGeom = new THREE.CylinderGeometry(4, 6, 30, 16);
        const body = new THREE.Mesh(bodyGeom, steel);
        body.rotation.x = Math.PI / 2;
        singleInjector.add(body);
        
        // Glass containment chamber
        const chamberGeom = new THREE.CylinderGeometry(3.5, 3.5, 15, 16);
        const chamber = new THREE.Mesh(chamberGeom, glass);
        chamber.rotation.x = Math.PI / 2;
        chamber.position.z = 22; // Extended forward
        singleInjector.add(chamber);
        
        // Glowing exotic matter inside chamber
        const matterGeom = new THREE.CylinderGeometry(2, 2, 14, 16);
        const matter = new THREE.Mesh(matterGeom, neonPulseMat);
        matter.rotation.x = Math.PI / 2;
        matter.position.z = 22;
        singleInjector.add(matter);
        updatables.push({ mesh: matter, type: 'pulse', baseScale: 1.0, amplitude: 0.2, speed: 15.0 });
        
        // Focusing Nozzle
        const nozzleGeom = new THREE.ConeGeometry(3.5, 10, 16);
        const nozzle = new THREE.Mesh(nozzleGeom, darkSteel);
        nozzle.rotation.x = -Math.PI / 2;
        nozzle.position.z = 34.5;
        singleInjector.add(nozzle);
        
        // Energy Beam (Stream of plasma into the horizon)
        const streamGeom = new THREE.CylinderGeometry(0.5, 1.5, 20, 8);
        const stream = new THREE.Mesh(streamGeom, plasmaStreamMat);
        stream.rotation.x = Math.PI / 2;
        stream.position.z = 49.5;
        singleInjector.add(stream);
        updatables.push({ mesh: stream, type: 'flicker' });

        // Position radially around the event horizon, pointing inward
        const dist = 65; // Distance from center
        singleInjector.position.set(
            Math.cos(angle) * dist,
            0,
            Math.sin(angle) * dist
        );
        singleInjector.lookAt(new THREE.Vector3(0, 0, 0));
        
        injectorGroup.add(singleInjector);
    }
    group.add(injectorGroup);

    // 6. CONTROL CABIN & OBSERVATION DECK
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, 80, 130); // Suspended on one side
    
    // Main deck structure
    const deckGeom = new THREE.BoxGeometry(40, 5, 30);
    const deck = new THREE.Mesh(deckGeom, darkSteel);
    cabinGroup.add(deck);
    
    // Cabin housing
    const housingGeom = new THREE.BoxGeometry(36, 18, 20);
    const housingMat = steel;
    const cabin = new THREE.Mesh(housingGeom, housingMat);
    cabin.position.y = 11.5;
    cabin.position.z = 2;
    cabinGroup.add(cabin);
    
    // Large tinted viewing window
    const windowGeom = new THREE.PlaneGeometry(34, 14);
    const windowMesh = new THREE.Mesh(windowGeom, tinted);
    windowMesh.position.set(0, 11.5, -8.1); // Front face
    windowMesh.rotation.y = Math.PI; // Face the wormhole
    cabinGroup.add(windowMesh);
    
    // Glowing Control Panels inside (visible through glass)
    const panelGeom = new THREE.BoxGeometry(20, 4, 4);
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x222222, emissive: 0x00ff00, emissiveIntensity: 0.5 });
    const panel = new THREE.Mesh(panelGeom, panelMat);
    panel.position.set(0, 5, -5);
    cabinGroup.add(panel);
    
    // Walkway connecting cabin to the outer structure
    const walkwayGeom = new THREE.BoxGeometry(10, 2, 50);
    const walkway = new THREE.Mesh(walkwayGeom, darkSteel);
    walkway.position.set(0, 1, 35);
    cabinGroup.add(walkway);
    
    group.add(cabinGroup);

    // 7. COOLANT CIRCULATION TUBES (Complex Spline Geometry)
    const tubeMat = rubber;
    const coolantGroup = new THREE.Group();
    coolantGroup.position.y = 80;
    
    for(let i=0; i<4; i++) {
        const angle = (i/4) * Math.PI*2 + Math.PI/4;
        
        // Create a winding path for pipes
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(Math.cos(angle)*120, -70, Math.sin(angle)*120), // Base
            new THREE.Vector3(Math.cos(angle)*90, -30, Math.sin(angle)*90),
            new THREE.Vector3(Math.cos(angle)*70, 0, Math.sin(angle)*70),
            new THREE.Vector3(Math.cos(angle)*60, 20, Math.sin(angle)*60), // Connect to stator
        ]);
        
        const tubeGeom = new THREE.TubeGeometry(curve, 64, 2.5, 12, false);
        const tube = new THREE.Mesh(tubeGeom, tubeMat);
        coolantGroup.add(tube);
        
        // Twin pipe
        const curve2 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(Math.cos(angle)*120 + 5, -70, Math.sin(angle)*120 + 5), 
            new THREE.Vector3(Math.cos(angle)*90 + 5, -30, Math.sin(angle)*90 + 5),
            new THREE.Vector3(Math.cos(angle)*70 + 5, 0, Math.sin(angle)*70 + 5),
            new THREE.Vector3(Math.cos(angle)*60 + 5, 15, Math.sin(angle)*60 + 5),
        ]);
        const tube2 = new THREE.Mesh(new THREE.TubeGeometry(curve2, 64, 2.5, 12, false), tubeMat);
        coolantGroup.add(tube2);
    }
    group.add(coolantGroup);

    // ==========================================
    // DEFINING PARTS FOR THE ENCYCLOPEDIA
    // ==========================================
    
    parts.push({
        name: "Wormhole Event Horizon",
        description: "The boundary in spacetime through which matter passes. Maintained by a spherical shell of negative energy density.",
        material: "Custom Gravitational Shader",
        function: "Provides the traversable throat for faster-than-light or cross-dimensional transit.",
        assemblyOrder: 20,
        connections: ["Gravitational Lensing Shell", "Wormhole Throat"],
        failureEffect: "Spontaneous topological collapse, violently severing the Einstein-Rosen bridge and releasing immense Hawking radiation.",
        cascadeFailures: ["Temporal Shear Compensator Network", "Singularity Core"],
        originalPosition: {x: 0, y: 80, z: 0},
        explodedPosition: {x: 0, y: 150, z: 0}
    });

    parts.push({
        name: "Exotic Matter Primary Containment Torus",
        description: "Massive aluminum-steel torus housing the Casimir-effect generated negative mass required to prop the throat open.",
        material: "Aluminum, Steel, Copper Coils",
        function: "Prevents the wormhole from pinching off and becoming a black hole.",
        assemblyOrder: 10,
        connections: ["Sub-space Anchoring Pylon Alpha", "Hydraulic Stabilizers"],
        failureEffect: "Exotic matter leaks causing localized anti-gravity anomalies, destroying structural integrity.",
        cascadeFailures: ["Inner Gravitational Stabilizer Array"],
        originalPosition: {x: 0, y: 80, z: 0},
        explodedPosition: {x: 0, y: 80, z: -100}
    });

    parts.push({
        name: "Magnetic Field Generators (720x Coils)",
        description: "Thousands of superconducting copper coils wrapped around the stator ring, carrying teramperes of current.",
        material: "Superconducting Copper",
        function: "Confines the exotic matter to the inner torus to prevent it from annihilating with normal matter.",
        assemblyOrder: 12,
        connections: ["Exotic Matter Primary Containment Torus", "Coolant Circulation Tubes"],
        failureEffect: "Magnetic quench leading to instantaneous vaporization of the stator rings.",
        cascadeFailures: ["Exotic Matter Primary Containment Torus"],
        originalPosition: {x: 0, y: 80, z: 0},
        explodedPosition: {x: 0, y: 120, z: 0}
    });

    parts.push({
        name: "Graviton Focusing Rings",
        description: "Counter-rotating inner dark steel rings that precisely sculpt the gravitational gradient.",
        material: "Dark Steel, Chrome",
        function: "Smooths the tidal forces at the event horizon so macroscopic objects are not spaghettified.",
        assemblyOrder: 15,
        connections: ["Wormhole Event Horizon"],
        failureEffect: "Extreme tidal shear; any passing matter undergoes fatal spaghettification.",
        cascadeFailures: ["Temporal Shear Compensator Network"],
        originalPosition: {x: 0, y: 80, z: 0},
        explodedPosition: {x: 0, y: 80, z: 100}
    });

    parts.push({
        name: "Exotic Mass Injector Nodes",
        description: "Eight radial injectors equipped with glass containment chambers and plasma nozzles.",
        material: "Steel, Glass, Neon Pulse Core",
        function: "Continuously feeds negative mass-energy into the throat to counter the natural tendency of spacetime to close.",
        assemblyOrder: 16,
        connections: ["Wormhole Throat", "Coolant Circulation Tubes"],
        failureEffect: "Throat starves of negative energy and begins micro-collapses, causing violent gravitational tremors.",
        cascadeFailures: ["Wormhole Event Horizon"],
        originalPosition: {x: 0, y: 80, z: 0},
        explodedPosition: {x: 100, y: 80, z: 100}
    });

    parts.push({
        name: "Sub-space Anchoring Pylons (Array)",
        description: "Four immense dark steel truss towers bolted directly into the planetary crust.",
        material: "Dark Steel, Steel Bracing",
        function: "Absorbs the immense recoil and dimensional torsion generated by the open wormhole.",
        assemblyOrder: 1,
        connections: ["Base Foundation", "Hydraulic Stabilizer Arms"],
        failureEffect: "The entire facility is ripped from the ground and sucked into the wormhole.",
        cascadeFailures: ["Base Foundation", "Control Cabin"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -150, y: 0, z: -150}
    });

    parts.push({
        name: "Hydraulic Stabilizer Arms",
        description: "Heavy-duty steel and chrome pistons connecting the static pylons to the vibrating containment rings.",
        material: "Steel, Chrome",
        function: "Dampens micro-fluctuations in the spatial fabric by mechanically pushing/pulling the stator in real-time.",
        assemblyOrder: 5,
        connections: ["Sub-space Anchoring Pylons", "Exotic Matter Primary Containment Torus"],
        failureEffect: "Uncontrollable harmonic resonance in the stator, vibrating the machine to dust.",
        cascadeFailures: ["Magnetic Field Generators"],
        originalPosition: {x: 0, y: 80, z: 0},
        explodedPosition: {x: -80, y: 150, z: 80}
    });

    parts.push({
        name: "Coolant Circulation Tubes",
        description: "Thick, winding rubberized chromite tubing pulsing with liquid helium-4.",
        material: "Rubberized Chromite",
        function: "Keeps the superconducting coils below 4 Kelvin.",
        assemblyOrder: 13,
        connections: ["Magnetic Field Generators", "Base Foundation"],
        failureEffect: "Coolant leak causes localized freezing, followed by coil overheat and magnetic quench.",
        cascadeFailures: ["Magnetic Field Generators"],
        originalPosition: {x: 0, y: 40, z: 0},
        explodedPosition: {x: 100, y: 40, z: -100}
    });

    parts.push({
        name: "Control Cabin / Observation Deck",
        description: "Suspended steel and tinted glass module shielding operators from high-energy particle radiation.",
        material: "Steel, Tinted Glass",
        function: "Houses the operational crew and the Chrono-distortion Rectifiers terminal.",
        assemblyOrder: 8,
        connections: ["Base Foundation"],
        failureEffect: "Cabin decompresses or detaches, exposing crew to hard vacuum or severe radiation.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 80, z: 130},
        explodedPosition: {x: 0, y: 80, z: 250}
    });

    parts.push({
        name: "Base Foundation / Trench Deck",
        description: "The primary structural platform, featuring heavy floor grating and maintenance trenches.",
        material: "Dark Steel",
        function: "Provides the rigid footprint necessary for the anchoring pylons.",
        assemblyOrder: 0,
        connections: ["Sub-space Anchoring Pylons"],
        failureEffect: "Structural sinking, throwing the wormhole out of alignment with its exit node.",
        cascadeFailures: ["Sub-space Anchoring Pylons"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -50, z: 0}
    });

    parts.push({
        name: "Gravitational Lensing Shell",
        description: "A transparent, high-IOR spherical boundary layer surrounding the event horizon.",
        material: "Refractive Metamaterial",
        function: "Visually and physically bends surrounding light and matter away from the hazardous edges of the throat.",
        assemblyOrder: 19,
        connections: ["Wormhole Event Horizon"],
        failureEffect: "Blinding flashes of un-lensed Hawking radiation burning anything in the hangar.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 80, z: 0},
        explodedPosition: {x: 0, y: 180, z: 0}
    });
    
    parts.push({
        name: "Quantum Fluctuation Dampeners",
        description: "Micro-scale processors embedded in the inner stator.",
        material: "Silicon, Copper",
        function: "Predicts and cancels out vacuum energy spikes before they destabilize the throat.",
        assemblyOrder: 14,
        connections: ["Inner Gravitational Stabilizer Array"],
        failureEffect: "Quantum foam boils over, causing random localized micro-wormholes to spawn.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 80, z: 0},
        explodedPosition: {x: -100, y: 80, z: -100}
    });

    parts.push({
        name: "Temporal Shear Compensator Network",
        description: "Chronal-syncing relays wired directly to the event horizon edge.",
        material: "Chrome, Optical Fiber",
        function: "Ensures that the time dilation at the entrance perfectly matches the exit node to prevent closed timelike curves (time travel paradoxes).",
        assemblyOrder: 18,
        connections: ["Wormhole Throat", "Control Cabin"],
        failureEffect: "Creation of a Closed Timelike Curve, triggering Hawking's Chronology Protection Conjecture and instantly vaporizing the machine.",
        cascadeFailures: ["Wormhole Event Horizon", "Wormhole Throat"],
        originalPosition: {x: 0, y: 80, z: 0},
        explodedPosition: {x: 0, y: -100, z: 200}
    });

    parts.push({
        name: "Dark Energy Emitters",
        description: "Secondary injection nozzles providing repulsive gravity.",
        material: "Steel, Neon Pulse Core",
        function: "Balances the extreme attractive gravity of the positive-mass components of the machine.",
        assemblyOrder: 17,
        connections: ["Exotic Mass Injector Nodes"],
        failureEffect: "Machine collapses under its own immense artificial gravity.",
        cascadeFailures: ["Exotic Matter Primary Containment Torus"],
        originalPosition: {x: 0, y: 80, z: 0},
        explodedPosition: {x: 150, y: 80, z: -150}
    });

    parts.push({
        name: "Singularity Core (Fail-Safe)",
        description: "An ultra-dense micro-black hole housed beneath the foundation.",
        material: "Degenerate Matter (Simulated)",
        function: "If containment fails, the core is released to swallow the wormhole and evaporate safely, preventing unbounded spatial tearing.",
        assemblyOrder: 0,
        connections: ["Base Foundation"],
        failureEffect: "Total planetary consumption if the fail-safe itself fails.",
        cascadeFailures: ["Base Foundation", "Sub-space Anchoring Pylons"],
        originalPosition: {x: 0, y: -20, z: 0},
        explodedPosition: {x: 0, y: -200, z: 0}
    });


    // ==========================================
    // EXTREME PHD-LEVEL QUIZ QUESTIONS
    // ==========================================

    const quizQuestions = [
        {
            question: "In the context of the Morris-Thorne wormhole metric $ds^2 = -e^{2\\Phi(r)}dt^2 + (1 - b(r)/r)^{-1}dr^2 + r^2(d\\theta^2 + \\sin^2\\theta d\\phi^2)$, what condition must the shape function $b(r)$ and redshift function $\\Phi(r)$ satisfy at the throat $r_0$ to ensure traversability without an event horizon?",
            options: [
                "$\\Phi(r)$ must be finite everywhere, and $b(r_0) = r_0$, with $b'(r_0) < 1$.",
                "$\\Phi(r)$ must diverge at $r_0$, and $b(r_0) = r_0$.",
                "$b(r_0) = 0$ and $\\Phi'(r_0) = 1$.",
                "$\\Phi(r_0) = 0$ and $b'(r_0) > 1$."
            ],
            answer: 0
        },
        {
            question: "The Flamm paraboloid is an isometric embedding of the spatial slice of the Schwarzschild metric. For a traversable wormhole, why is the exotic matter (negative energy density) physically required at the throat according to the Raychaudhuri equation?",
            options: [
                "To violate the Null Energy Condition (NEC), causing converging null geodesics to defocus at the throat.",
                "To increase the local gravitational constant $G$.",
                "To satisfy the Strong Energy Condition (SEC) and prevent singular collapse.",
                "To induce a positive cosmological constant at the throat boundary."
            ],
            answer: 0
        },
        {
            question: "If the Casimir effect is used as a source of negative vacuum energy to stabilize the wormhole, how does the required energy density scale with the throat radius $r_0$ for a macroscopic wormhole?",
            options: [
                "It scales as $1/r_0^2$, requiring astronomically massive plates or equivalent boundary conditions.",
                "It scales linearly with $r_0$.",
                "It is independent of $r_0$.",
                "It scales as $r_0^3$, growing with volume."
            ],
            answer: 0
        },
        {
            question: "In the Visser thin-shell wormhole model constructed via the Darmois-Israel junction conditions, what defines the surface stress-energy tensor $S_{ij}$ on the joining shell?",
            options: [
                "The discontinuity in the extrinsic curvature $K_{ij}$ across the shell.",
                "The trace of the Riemann curvature tensor.",
                "The integral of the Weyl tensor over the shell volume.",
                "The covariant derivative of the metric tensor."
            ],
            answer: 0
        },
        {
            question: "Considering a time-machine configuration formed by moving one mouth of a traversable wormhole relativistically (yielding a time dilation difference), what quantum field theory mechanism is hypothesized to destroy the wormhole just as closed timelike curves (CTCs) form?",
            options: [
                "The chronology protection conjecture via a divergent vacuum polarization (Hawking's theorem).",
                "The spontaneous emission of gravitons evaporating the throat.",
                "The transformation of the throat into a Kerr-Newman black hole.",
                "The sudden violation of the Bekenstein bound."
            ],
            answer: 0
        }
    ];

    // ==========================================
    // COMPLEX ANIMATION LOGIC
    // ==========================================

    function animate(time, speed, meshes) {
        const dt = speed * 0.016; // rough delta time based on standard 60fps
        const t = time * 0.001 * speed; // Time in seconds scaled by speed

        // Update Shader Time
        wormholeShader.uniforms.time.value = t;

        // Process all updatables
        updatables.forEach(item => {
            if (item.type === 'rotate') {
                if (item.axis === 'x') item.mesh.rotation.x += item.speed * dt;
                if (item.axis === 'y') item.mesh.rotation.y += item.speed * dt;
                if (item.axis === 'z') item.mesh.rotation.z += item.speed * dt;
            } 
            else if (item.type === 'pulse') {
                const s = item.baseScale + Math.sin(t * item.speed) * item.amplitude;
                item.mesh.scale.set(s, s, s);
                // Also pulse emissive intensity if applicable
                if (item.mesh.material && item.mesh.material.emissiveIntensity !== undefined) {
                    item.mesh.material.emissiveIntensity = 2.0 + Math.sin(t * item.speed * 2.0) * 1.0;
                }
            }
            else if (item.type === 'flicker') {
                item.mesh.material.opacity = 0.5 + Math.random() * 0.5;
            }
            else if (item.type === 'hydraulics') {
                // Micro-adjustments of the hydraulic stabilizing arms
                item.items.forEach(hyd => {
                    // Sine wave based oscillation representing compensation for quantum fluctuations
                    const offset = Math.sin(t * item.speed + hyd.phase) * item.amplitude;
                    
                    // The inner rod moves up and down (local Y axis for the cylinder)
                    hyd.rod.position.y = hyd.baseOffset + offset;
                });
            }
        });
    }

    return {
        group,
        parts,
        description: "Ultra God Tier Wormhole Stabilizer. Uses concentrated negative mass via exotic matter injectors to prop open an Einstein-Rosen bridge, compensating for temporal shear and quantum foam fluctuations in real-time.",
        quizQuestions,
        animate
    };
}
