import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const description = "Deep Ice Neutrino Observatory (God Tier). An apocalyptic-scale marvel of high-energy physics particle detection. Spanning a cubic kilometer of pristine deep Antarctic ice, over 5,000 intricately designed Digital Optical Modules (DOMs) stand vigil against the cosmos. When an ultra-high energy neutrino collides with a subatomic particle in the ice, it unleashes a devastating cascade of Cherenkov radiation, captured in real-time by this gargantuan array. On the surface, a sprawling supercomputing facility and hot-water drilling megastructure coordinate the operation, processing exabytes of data and maintaining the colossal ice boreholes.";

    // --- Advanced Custom Materials ---
    const emissiveBlue = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x00aaff, emissiveIntensity: 5.0 });
    const emissiveRed = new THREE.MeshStandardMaterial({ color: 0xff0044, emissive: 0xff0044, emissiveIntensity: 3.0 });
    const emissiveGreen = new THREE.MeshStandardMaterial({ color: 0x00ff44, emissive: 0x00ff44, emissiveIntensity: 3.0 });
    const emissiveYellow = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xffaa00, emissiveIntensity: 3.0 });
    const iceMaterial = new THREE.MeshPhysicalMaterial({ color: 0x88ccff, transmission: 0.98, opacity: 0.1, transparent: true, roughness: 0.1, ior: 1.31, side: THREE.DoubleSide });
    const darkGlass = new THREE.MeshPhysicalMaterial({ color: 0x111111, transmission: 0.5, roughness: 0.1, ior: 1.5, transparent: true });
    
    const wireframeMat = new THREE.MeshStandardMaterial({ color: 0x444444, wireframe: true, transparent: true, opacity: 0.3 });

    // --- The Ice Volume ---
    const iceGeo = new THREE.BoxGeometry(2000, 2000, 2000);
    const iceVolume = new THREE.Mesh(iceGeo, iceMaterial);
    iceVolume.position.y = -1000;
    group.add(iceVolume);

    // --- Massive DOM Array (Instanced Mesh for extreme performance) ---
    const numStrings = 86;
    const domsPerString = 60;
    const totalDOMs = numStrings * domsPerString;
    
    // Highly detailed DOM representation for instancing
    const domSphereGeo = new THREE.SphereGeometry(3.0, 32, 32);
    const domGlassMesh = new THREE.InstancedMesh(domSphereGeo, glass, totalDOMs);
    
    // PMT Inside DOM
    const pmtLathePoints = [];
    for(let i=0; i<=10; i++) {
        pmtLathePoints.push(new THREE.Vector2(1.5 + Math.sin(i*0.3)*0.5, i * 0.3 - 1.5));
    }
    const pmtGeo = new THREE.LatheGeometry(pmtLathePoints, 16);
    const pmtMesh = new THREE.InstancedMesh(pmtGeo, chrome, totalDOMs);
    
    // Glowing active region of DOM
    const domGlowGeo = new THREE.SphereGeometry(2.8, 16, 16);
    const domGlowMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending, depthWrite: false });
    const domGlowMesh = new THREE.InstancedMesh(domGlowGeo, domGlowMat, totalDOMs);
    
    // Harness and cables for DOM
    const harnessGeo = new THREE.TorusGeometry(3.1, 0.2, 8, 32);
    const harnessMesh = new THREE.InstancedMesh(harnessGeo, darkSteel, totalDOMs);

    const domColors = new Float32Array(totalDOMs * 3);
    const domPositions = [];
    const baseColor = new THREE.Color(0x000000);
    
    const dummy = new THREE.Object3D();
    let domIndex = 0;
    const arrayRadius = 600;

    for (let s = 0; s < numStrings; s++) {
        // Spiral/Hexagonal distribution
        const r = Math.sqrt(Math.random()) * arrayRadius;
        const theta = Math.random() * 2 * Math.PI;
        const x = r * Math.cos(theta);
        const z = r * Math.sin(theta);
        
        // Render a vertical string cable
        const stringCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(x, 0, z),
            new THREE.Vector3(x, -2100, z)
        ]);
        const stringGeo = new THREE.TubeGeometry(stringCurve, 2, 0.3, 8, false);
        const stringMesh = new THREE.Mesh(stringGeo, rubber);
        group.add(stringMesh);

        for (let d = 0; d < domsPerString; d++) {
            const y = -100 - (d * 30); // From -100m down to -1900m
            
            dummy.position.set(x, y, z);
            dummy.updateMatrix();
            domGlassMesh.setMatrixAt(domIndex, dummy.matrix);
            domGlowMesh.setMatrixAt(domIndex, dummy.matrix);
            
            dummy.rotation.x = Math.PI / 2;
            dummy.updateMatrix();
            harnessMesh.setMatrixAt(domIndex, dummy.matrix);
            
            dummy.rotation.x = 0;
            dummy.position.set(x, y - 0.5, z);
            dummy.updateMatrix();
            pmtMesh.setMatrixAt(domIndex, dummy.matrix);
            
            baseColor.toArray(domColors, domIndex * 3);
            domPositions.push(new THREE.Vector3(x, y, z));
            domIndex++;
        }
    }

    domGlowMesh.instanceColor = new THREE.InstancedBufferAttribute(domColors, 3);
    domGlowMesh.instanceColor.setUsage(THREE.DynamicDrawUsage);
    
    group.add(domGlassMesh);
    group.add(pmtMesh);
    group.add(domGlowMesh);
    group.add(harnessMesh);

    // --- Surface Laboratory & Supercomputing Core ---
    const labGroup = new THREE.Group();
    labGroup.position.set(0, 5, 0);
    group.add(labGroup);

    // Elevated Platform Network
    const platformGeo = new THREE.BoxGeometry(300, 5, 200);
    const platform = new THREE.Mesh(platformGeo, darkSteel);
    labGroup.add(platform);

    const platformLegs = new THREE.Group();
    const legGeo = new THREE.CylinderGeometry(2, 2, 50, 8);
    for(let lx = -140; lx <= 140; lx += 40) {
        for(let lz = -90; lz <= 90; lz += 45) {
            const leg = new THREE.Mesh(legGeo, steel);
            leg.position.set(lx, -25, lz);
            platformLegs.add(leg);
        }
    }
    labGroup.add(platformLegs);

    // Main Compute Node Building
    const computeBldgGeo = new THREE.BoxGeometry(120, 60, 100);
    const computeBldg = new THREE.Mesh(computeBldgGeo, aluminum);
    computeBldg.position.set(60, 32.5, 0);
    labGroup.add(computeBldg);

    // Server Racks Inside Compute Node (Visible via windows)
    const windowGeo = new THREE.BoxGeometry(121, 20, 90);
    const windowMesh = new THREE.Mesh(windowGeo, darkGlass);
    windowMesh.position.set(60, 32.5, 0);
    labGroup.add(windowMesh);

    const serverRacks = new THREE.Group();
    const rackGeo = new THREE.BoxGeometry(4, 18, 12);
    const ledGeo = new THREE.BoxGeometry(4.2, 17, 2);
    for(let rx = 10; rx <= 110; rx += 10) {
        for(let rz = -35; rz <= 35; rz += 15) {
            const rack = new THREE.Mesh(rackGeo, darkSteel);
            rack.position.set(rx, 32.5, rz);
            serverRacks.add(rack);

            const ledMat = Math.random() > 0.5 ? emissiveGreen : emissiveBlue;
            const ledMatBlink = new THREE.MeshStandardMaterial().copy(ledMat);
            ledMatBlink.userData = { blinkPhase: Math.random() * Math.PI * 2, speed: 2 + Math.random() * 5 };
            const ledMesh = new THREE.Mesh(ledGeo, ledMatBlink);
            ledMesh.position.set(rx, 32.5, rz + 5.5);
            serverRacks.add(ledMesh);
        }
    }
    labGroup.add(serverRacks);

    // Massive Satellite Uplink Array
    const dishGroup = new THREE.Group();
    dishGroup.position.set(60, 80, -20);
    
    const dishMountGeo = new THREE.CylinderGeometry(4, 6, 20, 16);
    const dishMount = new THREE.Mesh(dishMountGeo, steel);
    dishMount.position.set(0, 10, 0);
    dishGroup.add(dishMount);

    const dishPivot = new THREE.Group();
    dishPivot.position.set(0, 20, 0);
    
    const dishLathePts = [];
    for (let i = 0; i <= 15; i++) {
        dishLathePts.push(new THREE.Vector2(i * 1.5, Math.pow(i, 2) * 0.04));
    }
    const mainDishGeo = new THREE.LatheGeometry(dishLathePts, 64);
    const mainDish = new THREE.Mesh(mainDishGeo, aluminum);
    mainDish.rotation.x = -Math.PI / 2;
    dishPivot.add(mainDish);

    const subReflectorGeo = new THREE.CylinderGeometry(2, 0.5, 1, 16);
    const subReflector = new THREE.Mesh(subReflectorGeo, chrome);
    subReflector.position.set(0, 0, 15);
    subReflector.rotation.x = Math.PI / 2;
    dishPivot.add(subReflector);

    const supportGeo = new THREE.CylinderGeometry(0.2, 0.2, 16, 8);
    for(let i=0; i<4; i++) {
        const support = new THREE.Mesh(supportGeo, darkSteel);
        support.position.set(Math.cos(i*Math.PI/2)*10, 0, 7.5);
        support.rotation.x = Math.PI / 2;
        support.lookAt(new THREE.Vector3(0,0,15));
        dishPivot.add(support);
    }
    
    dishGroup.add(dishPivot);
    labGroup.add(dishGroup);

    // --- Extreme Hot Water Drilling Megastructure ---
    const drillGroup = new THREE.Group();
    drillGroup.position.set(-80, 0, 40);
    labGroup.add(drillGroup);

    const derrickGeo = new THREE.CylinderGeometry(15, 30, 120, 4, 1, false, Math.PI/4);
    const derrick = new THREE.Mesh(derrickGeo, wireframeMat);
    derrick.position.y = 60;
    drillGroup.add(derrick);
    
    // Add complex truss beams to derrick manually
    const derrickTrusses = new THREE.Group();
    const beamGeo = new THREE.BoxGeometry(1, 125, 1);
    for(let i=0; i<4; i++) {
        const beam = new THREE.Mesh(beamGeo, steel);
        beam.position.set(Math.cos(i*Math.PI/2 + Math.PI/4)*22, 60, Math.sin(i*Math.PI/2 + Math.PI/4)*22);
        beam.rotation.x = Math.PI/16 * Math.cos(i*Math.PI/2 + Math.PI/4);
        beam.rotation.z = Math.PI/16 * Math.sin(i*Math.PI/2 + Math.PI/4);
        derrickTrusses.add(beam);
    }
    drillGroup.add(derrickTrusses);

    // Massive Helical Drill Core
    const drillCoreGroup = new THREE.Group();
    drillCoreGroup.position.set(0, 60, 0);
    
    const corePipeGeo = new THREE.CylinderGeometry(3, 3, 110, 16);
    const corePipe = new THREE.Mesh(corePipeGeo, chrome);
    drillCoreGroup.add(corePipe);

    const helixShape = new THREE.Shape();
    helixShape.moveTo(3, 0);
    helixShape.lineTo(6, 0);
    helixShape.lineTo(6, 1);
    helixShape.lineTo(3, 1);
    helixShape.lineTo(3, 0);
    
    const extrudeSettings = {
        steps: 200,
        depth: 100,
        bevelEnabled: false,
        extrudePath: new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, -50, 0),
            new THREE.Vector3(0, 50, 0)
        ])
    };
    
    const helixGeo = new THREE.BufferGeometry();
    const hVertices = [];
    const hIndices = [];
    const hSegments = 200;
    const hRadius = 5;
    for(let i=0; i<=hSegments; i++) {
        const t = i / hSegments;
        const y = -50 + t * 100;
        const angle = t * Math.PI * 20; // 10 twists
        const x1 = Math.cos(angle) * 3;
        const z1 = Math.sin(angle) * 3;
        const x2 = Math.cos(angle) * hRadius;
        const z2 = Math.sin(angle) * hRadius;
        
        hVertices.push(x1, y, z1);
        hVertices.push(x2, y, z2);
        hVertices.push(x1, y+1, z1);
        hVertices.push(x2, y+1, z2);
        
        if (i < hSegments) {
            const b = i * 4;
            hIndices.push(b, b+1, b+5);
            hIndices.push(b, b+5, b+4);
            hIndices.push(b+1, b+3, b+7);
            hIndices.push(b+1, b+7, b+5);
        }
    }
    helixGeo.setAttribute('position', new THREE.Float32BufferAttribute(hVertices, 3));
    helixGeo.setIndex(hIndices);
    helixGeo.computeVertexNormals();
    const helixMesh = new THREE.Mesh(helixGeo, darkSteel);
    drillCoreGroup.add(helixMesh);
    
    drillGroup.add(drillCoreGroup);

    // Operator Cabin
    const cabinGeo = new THREE.BoxGeometry(15, 10, 15);
    const cabin = new THREE.Mesh(cabinGeo, steel);
    cabin.position.set(0, 10, 20);
    drillGroup.add(cabin);
    const cabinWindowGeo = new THREE.BoxGeometry(16, 5, 16);
    const cabinWindow = new THREE.Mesh(cabinWindowGeo, tinted);
    cabinWindow.position.copy(cabin.position);
    drillGroup.add(cabinWindow);

    // Hydraulic Pistons for Drill Orientation
    const pistonGroup1 = new THREE.Group();
    pistonGroup1.position.set(10, 5, 0);
    const cylinderGeo = new THREE.CylinderGeometry(1.5, 1.5, 20, 16);
    const cylinderMesh = new THREE.Mesh(cylinderGeo, steel);
    cylinderMesh.position.y = 10;
    pistonGroup1.add(cylinderMesh);
    const rodGeo = new THREE.CylinderGeometry(0.8, 0.8, 20, 16);
    const rodMesh = new THREE.Mesh(rodGeo, chrome);
    rodMesh.position.y = 20;
    pistonGroup1.add(rodMesh);
    drillGroup.add(pistonGroup1);

    // Complex Pipe Network (Coolant / Hot Water)
    const pipeMat = rubber;
    for(let i=0; i<5; i++) {
        const pipeCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-80 + i*4, 5, 40),
            new THREE.Vector3(-40, 2, 20 + i*2),
            new THREE.Vector3(0, 2, 0),
            new THREE.Vector3(60, 2, -10 + i*5)
        ]);
        const pipeGeo = new THREE.TubeGeometry(pipeCurve, 64, 1.5, 8, false);
        const pipeMesh = new THREE.Mesh(pipeGeo, pipeMat);
        labGroup.add(pipeMesh);
    }

    // --- Neutrino Event Cherenkov Shader & Particles ---
    // Cherenkov Cone
    const coneGeo = new THREE.ConeGeometry(500, 1000, 64, 1, true);
    coneGeo.translate(0, -500, 0); // Origin at top tip

    const cherenkovMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uColor: { value: new THREE.Color(0x00aaff) },
            uIntensity: { value: 0.0 }
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vNormal;
            void main() {
                vUv = uv;
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float uTime;
            uniform vec3 uColor;
            uniform float uIntensity;
            varying vec2 vUv;
            varying vec3 vNormal;
            void main() {
                float intensity = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
                float pulse = sin(uTime * 15.0 - vUv.y * 30.0) * 0.5 + 0.5;
                vec3 finalColor = uColor * intensity * pulse * uIntensity;
                // Fade at the bottom
                float alpha = uIntensity * (1.0 - vUv.y) * 0.9;
                gl_FragColor = vec4(finalColor, alpha);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
    });
    const cherenkovCone = new THREE.Mesh(coneGeo, cherenkovMaterial);
    cherenkovCone.visible = false;
    group.add(cherenkovCone);

    // The Neutrino Particle
    const neutrinoGeo = new THREE.SphereGeometry(2, 16, 16);
    const neutrinoMesh = new THREE.Mesh(neutrinoGeo, emissiveBlue);
    neutrinoMesh.visible = false;
    group.add(neutrinoMesh);

    // Collision Flash Explosion Particles
    const flashCount = 3000;
    const flashGeo = new THREE.BufferGeometry();
    const flashPos = new Float32Array(flashCount * 3);
    const flashVel = [];
    for (let i = 0; i < flashCount; i++) {
        flashPos[i*3] = 0; flashPos[i*3+1] = 0; flashPos[i*3+2] = 0;
        const v = new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
        ).normalize().multiplyScalar(Math.random() * 100);
        flashVel.push(v);
    }
    flashGeo.setAttribute('position', new THREE.BufferAttribute(flashPos, 3));
    const flashMat = new THREE.PointsMaterial({
        color: 0x00ffff,
        size: 5,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const flashParticles = new THREE.Points(flashGeo, flashMat);
    flashParticles.visible = false;
    group.add(flashParticles);

    // Data Streaming Particles (Routing data up the cables)
    const streamCount = 5000;
    const streamGeo = new THREE.BufferGeometry();
    const streamPos = new Float32Array(streamCount * 3);
    const streamColors = new Float32Array(streamCount * 3);
    for(let i=0; i<streamCount; i++) {
        streamPos[i*3] = 99999; streamPos[i*3+1] = 99999; streamPos[i*3+2] = 99999;
        streamColors[i*3] = 0.0; streamColors[i*3+1] = 1.0; streamColors[i*3+2] = 0.5;
    }
    streamGeo.setAttribute('position', new THREE.BufferAttribute(streamPos, 3));
    streamGeo.setAttribute('color', new THREE.BufferAttribute(streamColors, 3));
    const streamMat = new THREE.PointsMaterial({
        size: 8,
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const streamPoints = new THREE.Points(streamGeo, streamMat);
    group.add(streamPoints);


    // --- Parts Array Configuration ---
    parts.push(
        {
            name: "God Tier DOM Array",
            description: "An incredibly dense array of 5,160 Digital Optical Modules forming a cubic kilometer detector in the ultra-transparent deep Antarctic ice.",
            material: "Glass / Chrome / Silicon",
            function: "Detects single Cherenkov photons emitted by charged particles traveling faster than light in ice.",
            assemblyOrder: 1,
            connections: ["Subglacial Fiber Optic Trunk"],
            failureEffect: "Loss of detection fidelity in a localized sector.",
            cascadeFailures: ["Reduced angular resolution for source tracking", "Increased false positives"],
            originalPosition: {x: 0, y: -1000, z: 0},
            explodedPosition: {x: 0, y: -2500, z: 0}
        },
        {
            name: "Surface Supercomputing Core",
            description: "A monumental data processing facility analyzing petabytes of raw PMT signal data to filter cosmic ray muons and identify elusive neutrino events in real-time.",
            material: "Aluminum / Dark Glass / Dark Steel",
            function: "Event Reconstruction and Data Storage.",
            assemblyOrder: 2,
            connections: ["Subglacial Fiber Optic Trunk", "High-Gain Satellite Uplink", "Quantum Data Buffers"],
            failureEffect: "Total detector blindness due to unanalyzed buffer overflow.",
            cascadeFailures: ["Loss of rare transient events"],
            originalPosition: {x: 60, y: 32.5, z: 0},
            explodedPosition: {x: 200, y: 150, z: 100}
        },
        {
            name: "Thermal Ice Drill Megastructure",
            description: "A gigantic, automated hot-water drilling rig capable of melting 2.5km deep holes through the ice sheet for array expansion and maintenance.",
            material: "Steel / Wireframe / Rubber",
            function: "Borehole Generation.",
            assemblyOrder: 3,
            connections: ["Primary Coolant Lines", "Helical Drill Bit"],
            failureEffect: "Inability to deploy new strings, freezing of active boreholes.",
            cascadeFailures: ["Gradual array degradation", "Irrecoverable string loss"],
            originalPosition: {x: -80, y: 60, z: 40},
            explodedPosition: {x: -250, y: 200, z: 200}
        },
        {
            name: "Helical Drill Bit Core",
            description: "Massive twisted titanium-alloy cylinder focusing 5 Megawatts of thermal energy to melt pristine ice without introducing impurities.",
            material: "Dark Steel / Chrome",
            function: "Ice Penetration and Sublimation.",
            assemblyOrder: 4,
            connections: ["Thermal Ice Drill Megastructure"],
            failureEffect: "Drill stalling and rapid freeze-in.",
            cascadeFailures: ["Loss of multi-million dollar drilling equipment"],
            originalPosition: {x: -80, y: 60, z: 40},
            explodedPosition: {x: -250, y: -50, z: 200}
        },
        {
            name: "High-Gain Satellite Uplink",
            description: "A massive, articulating parabolic dish transmitting highly compressed neutrino candidate events to the northern hemisphere over geosynchronous satellites.",
            material: "Aluminum / Steel",
            function: "Global Data Telemetry.",
            assemblyOrder: 5,
            connections: ["Surface Supercomputing Core"],
            failureEffect: "Loss of real-time alerts to the global astronomical community.",
            cascadeFailures: ["Missed multi-messenger astronomy opportunities"],
            originalPosition: {x: 60, y: 100, z: -20},
            explodedPosition: {x: 250, y: 300, z: -150}
        },
        {
            name: "Antarctic Ice Shield (Volume)",
            description: "Over a cubic kilometer of some of the purest ice on Earth. The extreme pressure bubbles out air, leaving a perfectly transparent medium for Cherenkov light propagation.",
            material: "Translucent Ice Shader",
            function: "Interaction Medium and Cosmic Ray Shield.",
            assemblyOrder: 6,
            connections: ["God Tier DOM Array"],
            failureEffect: "N/A - Geological feature",
            cascadeFailures: [],
            originalPosition: {x: 0, y: -1000, z: 0},
            explodedPosition: {x: 0, y: 500, z: 0}
        }
    );

    // --- Extreme Animation System ---
    let animState = 0; // 0: Idle, 1: Neutrino Incoming, 2: Cherenkov Collision, 3: Data Streaming
    let animTimer = 0;
    let eventPosition = new THREE.Vector3();
    let coneDirection = new THREE.Vector3();
    let activeDataNodes = [];
    
    const litColor = new THREE.Color(0x00ffff);
    const dimColor = new THREE.Color(0x000000);

    const animate = (time, speed, meshes) => {
        // 1. Continuous Lab Animations
        // Server Racks Blinking
        serverRacks.children.forEach(child => {
            if (child.material && child.material.userData && child.material.userData.speed) {
                const phase = time * child.material.userData.speed + child.material.userData.blinkPhase;
                child.material.emissiveIntensity = (Math.sin(phase) > 0) ? 3.0 : 0.2;
            }
        });

        // Satellite Dish Tracking
        dishPivot.rotation.z = Math.sin(time * 0.1) * 0.5;
        dishPivot.rotation.y = time * 0.05;

        // Drill Rig Rotation and Piston pumping
        drillCoreGroup.rotation.y += speed * 2;
        drillCoreGroup.position.y = 60 + Math.sin(time * 2) * 5; // Pumping action
        rodMesh.position.y = 20 + Math.sin(time * 2) * 2; // Sync piston

        // 2. High-Energy Event State Machine
        animTimer += speed;

        if (animState === 0) {
            // Idle, wait for event (increased chance for simulation visibility)
            if (Math.random() < 0.02 * speed) {
                animState = 1;
                animTimer = 0;
                
                // Deep event origin
                eventPosition.set(
                    (Math.random() - 0.5) * 800,
                    -1000 + (Math.random() - 0.5) * 800,
                    (Math.random() - 0.5) * 800
                );
                
                // Neutrinos mostly come from below (through Earth)
                coneDirection.set(
                    (Math.random() - 0.5) * 0.5,
                    0.8 + Math.random() * 0.4,
                    (Math.random() - 0.5) * 0.5
                ).normalize();
                
                neutrinoMesh.position.copy(eventPosition).add(coneDirection.clone().multiplyScalar(-2000));
                neutrinoMesh.visible = true;
                activeDataNodes = [];
            }
        } 
        else if (animState === 1) {
            // Neutrino Traveling at near light speed
            const approachSpeed = 6000 * speed; 
            const dist = neutrinoMesh.position.distanceTo(eventPosition);
            
            if (dist < approachSpeed) {
                // Collision!
                neutrinoMesh.position.copy(eventPosition);
                neutrinoMesh.visible = false;
                animState = 2;
                animTimer = 0;
                
                // Trigger Flash Particles
                flashParticles.position.copy(eventPosition);
                flashParticles.visible = true;
                flashMat.opacity = 1.0;
                const pos = flashParticles.geometry.attributes.position.array;
                for(let i=0; i<flashCount*3; i++) pos[i] = 0;
                flashParticles.geometry.attributes.position.needsUpdate = true;
                
                // Setup Cherenkov Cone
                cherenkovCone.position.copy(eventPosition);
                const axis = new THREE.Vector3(0, -1, 0); // Cone points down by default geometry
                const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, coneDirection);
                cherenkovCone.quaternion.copy(quaternion);
                
                cherenkovCone.scale.set(0.01, 0.01, 0.01);
                cherenkovCone.visible = true;
                cherenkovMaterial.uniforms.uIntensity.value = 3.0;
            } else {
                neutrinoMesh.position.add(coneDirection.clone().multiplyScalar(approachSpeed));
            }
        }
        else if (animState === 2) {
            // Cascade Expansion and DOM Lighting
            // Flash Physics
            const pos = flashParticles.geometry.attributes.position.array;
            for (let i=0; i<flashCount; i++) {
                pos[i*3] += flashVel[i].x * speed * 3;
                pos[i*3+1] += flashVel[i].y * speed * 3;
                pos[i*3+2] += flashVel[i].z * speed * 3;
            }
            flashParticles.geometry.attributes.position.needsUpdate = true;
            flashMat.opacity -= speed * 1.5;
            if(flashMat.opacity <= 0) flashParticles.visible = false;
            
            // Cone Expansion
            const scaleSpeed = 25 * speed;
            cherenkovCone.scale.addScalar(scaleSpeed);
            // Translate cone forward to maintain the tip at the event origin while it grows
            // Wait, geometry is translated so origin is at tip, so just scaling works!
            
            cherenkovMaterial.uniforms.uTime.value = time;
            cherenkovMaterial.uniforms.uIntensity.value -= speed * 0.3;
            
            // Light DOMs inside the cone wavefront
            let anyLit = false;
            const currentLength = 1000 * cherenkovCone.scale.y;
            const coneAngle = Math.atan2(500, 1000); // 26.5 deg half-angle (close to 41 deg in ice in reality)
            const cosAngle = Math.cos(coneAngle * 1.2); 
            
            for (let i = 0; i < totalDOMs; i++) {
                const domPos = domPositions[i];
                const vecToDom = new THREE.Vector3().subVectors(domPos, eventPosition);
                const dist = vecToDom.length();
                
                // If within wavefront thickness
                if (dist < currentLength && dist > currentLength - (300 * speed * 10)) {
                    vecToDom.normalize();
                    const dot = vecToDom.dot(coneDirection);
                    if (dot > cosAngle) {
                        litColor.toArray(domColors, i * 3);
                        domGlowMesh.instanceColor.needsUpdate = true;
                        anyLit = true;
                        
                        // Register for data stream
                        if(!activeDataNodes.includes(i)) {
                            activeDataNodes.push({ index: i, progress: 0, pos: domPos });
                        }
                    }
                } else if (dist < currentLength - (300 * speed * 10)) {
                    // Fade out
                    const r = domColors[i*3];
                    if (r > 0) {
                        domColors[i*3] = Math.max(0, r - speed * 3);
                        domColors[i*3+1] = Math.max(0, domColors[i*3+1] - speed * 3);
                        domColors[i*3+2] = Math.max(0, domColors[i*3+2] - speed * 3);
                        domGlowMesh.instanceColor.needsUpdate = true;
                    }
                }
            }
            
            if (cherenkovMaterial.uniforms.uIntensity.value <= 0) {
                cherenkovCone.visible = false;
                animState = 3;
                animTimer = 0;
            }
        }
        else if (animState === 3) {
            // Data streaming up the strings
            let allDone = true;
            const sPos = streamPoints.geometry.attributes.position.array;
            
            // Reset particles far away
            for(let p=0; p<streamCount*3; p++) sPos[p] = 99999;
            
            let pIdx = 0;
            for(let i=0; i<activeDataNodes.length; i++) {
                const node = activeDataNodes[i];
                if (node.progress < 1.0) {
                    allDone = false;
                    node.progress += speed * 0.2;
                    if(node.progress > 1.0) node.progress = 1.0;
                    
                    const currentY = THREE.MathUtils.lerp(node.pos.y, 0, node.progress);
                    
                    if (pIdx < streamCount) {
                        sPos[pIdx*3] = node.pos.x;
                        sPos[pIdx*3+1] = currentY;
                        sPos[pIdx*3+2] = node.pos.z;
                        pIdx++;
                    }
                }
            }
            streamPoints.geometry.attributes.position.needsUpdate = true;
            
            // Fade remaining DOM glows
            let domsFading = false;
            for (let i = 0; i < totalDOMs; i++) {
                const r = domColors[i*3];
                if (r > 0) {
                    domColors[i*3] = Math.max(0, r - speed * 2);
                    domColors[i*3+1] = Math.max(0, domColors[i*3+1] - speed * 2);
                    domColors[i*3+2] = Math.max(0, domColors[i*3+2] - speed * 2);
                    domGlowMesh.instanceColor.needsUpdate = true;
                    domsFading = true;
                }
            }
            
            if (allDone && !domsFading) {
                animState = 4;
            }
        }
        else if (animState === 4) {
            // Cleanup
            const sPos = streamPoints.geometry.attributes.position.array;
            for(let p=0; p<streamCount*3; p++) sPos[p] = 99999;
            streamPoints.geometry.attributes.position.needsUpdate = true;
            animState = 0;
        }
    };

    const quizQuestions = [
        {
            question: "Why do high-energy neutrinos produce a cone of Cherenkov radiation when interacting in ice?",
            options: [
                "Because they travel faster than the speed of light in a vacuum.",
                "Because the secondary charged particles produced travel faster than the phase velocity of light in ice.",
                "Because neutrinos carry a localized electric charge that polarizes the ice molecules directly.",
                "Because they decay into photons upon striking the oxygen nuclei."
            ],
            correctAnswer: 1,
            explanation: "When a high-energy neutrino interacts with a nucleus in the ice, it creates high-speed charged particles (like muons). If these travel faster than light's phase velocity in ice (c/n), they emit Cherenkov radiation in a cone, analogous to a sonic boom."
        },
        {
            question: "What is the primary background noise that deep ice neutrino observatories must filter out, and how do they achieve it?",
            options: [
                "Atmospheric electrons; filtered by magnetic shielding.",
                "Solar neutrinos; filtered by setting an energy threshold.",
                "Atmospheric muons produced by cosmic rays; filtered by looking deep underground and prioritizing upward-going tracks.",
                "Thermal radiation from the ice; filtered by active cooling."
            ],
            correctAnswer: 2,
            explanation: "Cosmic rays hitting the atmosphere create a massive shower of downward-going muons. By placing the detector deep in the ice and looking for 'upward-going' tracks (particles that must have traveled through the entire Earth, which only neutrinos can do without being absorbed), they filter out the atmospheric muon background."
        },
        {
            question: "In the context of neutrino detection, what distinguishes an electron neutrino (νe) event topology from a muon neutrino (νμ) event?",
            options: [
                "νe produces a long straight track, νμ produces a spherical cascade.",
                "νe produces a spherical cascade (shower), νμ produces a long straight track.",
                "νe only emits radio waves, νμ emits Cherenkov light.",
                "νe events are only visible on the surface, νμ events are deep."
            ],
            correctAnswer: 1,
            explanation: "A charged-current interaction of a muon neutrino creates a high-energy muon, which travels a long distance in the ice, creating a long 'track' of light. An electron neutrino creates a high-energy electron, which quickly scatters and creates an electromagnetic shower, resulting in a roughly spherical 'cascade' of light."
        },
        {
            question: "What is the Glashow resonance, and why is its observation in a neutrino detector significant?",
            options: [
                "The resonant production of a W boson from the collision of an antielectron neutrino with an electron at exactly 6.3 PeV.",
                "The oscillation of neutrinos between three flavors passing through Earth's core.",
                "The resonant absorption of neutrinos by the heavy hydrogen (deuterium) in the ice.",
                "The mechanical resonance of the DOMs when hit by a sonic wave from a neutrino."
            ],
            correctAnswer: 0,
            explanation: "The Glashow resonance is the resonant formation of a W- boson during the interaction of an electron antineutrino with an atomic electron, which requires an antineutrino energy of about 6.3 PeV. Its observation confirms standard model predictions at extreme energies and helps differentiate neutrinos from antineutrinos in astrophysical fluxes."
        },
        {
            question: "How is the timing and position of the DOM hits used to reconstruct a muon neutrino's track?",
            options: [
                "By measuring the acoustic echoes of the neutrino collision.",
                "By using maximum likelihood estimation to fit a moving point source of Cherenkov light to the arrival times and photon counts at each DOM.",
                "By physically moving the DOMs along strings to trace the track.",
                "By measuring the temperature change of the ice caused by the neutrino."
            ],
            correctAnswer: 1,
            explanation: "The arrival time of photons (down to nanosecond precision) and the number of photons at each DOM are fed into complex maximum likelihood reconstruction algorithms. Because the Cherenkov cone has a known geometry (~41 degrees in ice), the algorithm can accurately trace back the direction and energy of the original muon."
        }
    ];

    return { group, parts, description, quizQuestions, animate };
}
