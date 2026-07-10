import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};
    const animationState = {
        time: 0,
        tethers: [],
        swarms: [],
        tires: [],
        pistons: [],
        stars: [],
        smokeParticles: null,
        coreParticles: null,
        stations: [],
        radars: []
    };

    const description = "The God-Tier Kardashev Type III Harvester is a hyper-dimensional, galaxy-spanning rig. It features a central cosmic operator cabin that directs planetary-scale spacetime tires, harvesting stars via Dyson nodes and funneling stellar energy through relativistic tethers into a central galactic core engine block.";

    // ==========================================
    // CUSTOM MATERIALS & SHADERS
    // ==========================================

    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00aaff, emissive: 0x0055ff, emissiveIntensity: 3.0, roughness: 0.1, metalness: 0.8
    });
    const neonPurple = new THREE.MeshStandardMaterial({
        color: 0xaa00ff, emissive: 0x6600ff, emissiveIntensity: 3.0, roughness: 0.1, metalness: 0.8
    });
    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0044, emissive: 0xff0022, emissiveIntensity: 3.5, roughness: 0.2, metalness: 0.9
    });
    const hologramMat = new THREE.MeshBasicMaterial({
        color: 0x00ffff, transparent: true, opacity: 0.4, wireframe: true, blending: THREE.AdditiveBlending
    });
    const darkMatterMat = new THREE.MeshPhysicalMaterial({
        color: 0x050505, metalness: 1.0, roughness: 0.2, clearcoat: 1.0, clearcoatRoughness: 0.1
    });

    const tetherVertexShader = `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform float time;
        void main() {
            vUv = uv;
            vPosition = position;
            vec3 pos = position;
            float wave = sin(uv.x * 30.0 - time * 15.0) * 2.5;
            pos.y += wave * normal.y;
            pos.z += wave * normal.z;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `;

    const tetherFragmentShader = `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        void main() {
            float pulse = sin(vUv.x * 60.0 - time * 25.0) * 0.5 + 0.5;
            float scanline = sin(vUv.y * 150.0) * 0.15;
            vec3 col = mix(color1, color2, pulse) + scanline;
            float glow = smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.8, vUv.y);
            gl_FragColor = vec4(col * 2.5, glow * 0.9);
        }
    `;

    // ==========================================
    // HELPER FUNCTIONS FOR EXTREME COMPLEXITY
    // ==========================================

    function createRivets(targetGroup, radius, height, count, material) {
        const rivetGeo = new THREE.SphereGeometry(radius, 8, 8);
        for (let i = 0; i < count; i++) {
            const rivet = new THREE.Mesh(rivetGeo, material);
            const angle = (i / count) * Math.PI * 2;
            rivet.position.set(Math.cos(angle) * height, 0, Math.sin(angle) * height);
            targetGroup.add(rivet);
        }
    }

    function createPanelLines(targetGroup, radius, height, segments, material) {
        const lineGeo = new THREE.CylinderGeometry(radius + 0.1, radius + 0.1, height, segments, 1, true);
        const lineMat = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true, transparent: true, opacity: 0.3 });
        const lines = new THREE.Mesh(lineGeo, lineMat);
        targetGroup.add(lines);
    }

    // ==========================================
    // 1. SPACETIME TIRES (4x)
    // ==========================================
    function buildSpacetimeTire(name, x, y, z, rotY) {
        const tireGroup = new THREE.Group();
        tireGroup.position.set(x, y, z);
        tireGroup.rotation.y = rotY;

        // Base Torus
        const torusGeo = new THREE.TorusGeometry(120, 45, 64, 128);
        const torus = new THREE.Mesh(torusGeo, rubber);
        tireGroup.add(torus);

        // Hundreds of extruded BoxGeometry lugs for aggressive off-road treads
        const lugCount = 200;
        const lugShape = new THREE.Shape();
        lugShape.moveTo(0, 0);
        lugShape.lineTo(20, 0);
        lugShape.lineTo(15, 10);
        lugShape.lineTo(5, 10);
        lugShape.lineTo(0, 0);
        const extrudeSettings = { depth: 50, bevelEnabled: true, bevelThickness: 2, bevelSize: 1, bevelSegments: 3 };
        const lugGeo = new THREE.ExtrudeGeometry(lugShape, extrudeSettings);
        lugGeo.center();

        const lugsGroup = new THREE.Group();
        for (let i = 0; i < lugCount; i++) {
            const lug = new THREE.Mesh(lugGeo, rubber);
            const angle = (i / lugCount) * Math.PI * 2;
            const r = 165; // radius + torus tube
            lug.position.set(Math.cos(angle) * r, Math.sin(angle) * r, (i % 2 === 0) ? -15 : 15);
            lug.rotation.z = angle + Math.PI / 2;
            lug.rotation.x = (i % 2 === 0) ? 0.2 : -0.2;
            lugsGroup.add(lug);
        }
        tireGroup.add(lugsGroup);

        // Complex Rims
        const rimGeo = new THREE.CylinderGeometry(110, 110, 50, 64);
        const rim = new THREE.Mesh(rimGeo, darkSteel);
        rim.rotation.x = Math.PI / 2;
        tireGroup.add(rim);

        // Complex Spoke Arrays
        const spokeCount = 24;
        const spokeGroup = new THREE.Group();
        const spokeGeo = new THREE.CylinderGeometry(4, 2, 110, 16);
        for (let i = 0; i < spokeCount; i++) {
            const spoke = new THREE.Mesh(spokeGeo, chrome);
            const angle = (i / spokeCount) * Math.PI * 2;
            spoke.position.set(Math.cos(angle) * 55, Math.sin(angle) * 55, 0);
            spoke.rotation.z = angle;
            spoke.rotation.x = Math.PI / 2;
            
            // Add hydraulic micro-adjusters to spokes
            const adjusterGeo = new THREE.CylinderGeometry(6, 6, 20, 16);
            const adjuster = new THREE.Mesh(adjusterGeo, neonBlue);
            adjuster.position.y = 20;
            spoke.add(adjuster);

            spokeGroup.add(spoke);
        }
        tireGroup.add(spokeGroup);

        // Hubcap (LatheGeometry)
        const hubPoints = [];
        for (let i = 0; i <= 10; i++) {
            hubPoints.push(new THREE.Vector2(Math.sin(i * 0.2) * 20, i * 3));
        }
        const hubGeo = new THREE.LatheGeometry(hubPoints, 64);
        const hub = new THREE.Mesh(hubGeo, chrome);
        hub.rotation.x = Math.PI / 2;
        hub.position.z = 25;
        tireGroup.add(hub);

        const hubBack = hub.clone();
        hubBack.rotation.x = -Math.PI / 2;
        hubBack.position.z = -25;
        tireGroup.add(hubBack);

        group.add(tireGroup);
        animationState.tires.push(tireGroup);
        return tireGroup;
    }

    const tireFL = buildSpacetimeTire('Spacetime_Tire_FL', -250, -150, 400, 0);
    const tireFR = buildSpacetimeTire('Spacetime_Tire_FR', 250, -150, 400, 0);
    const tireRL = buildSpacetimeTire('Spacetime_Tire_RL', -250, -150, -400, 0);
    const tireRR = buildSpacetimeTire('Spacetime_Tire_RR', 250, -150, -400, 0);

    // ==========================================
    // 2. GALACTIC CORE ENGINE BLOCK
    // ==========================================
    function buildGalacticCoreEngine() {
        const engineGroup = new THREE.Group();
        
        // Massive Engine Housing
        const housingGeo = new THREE.CylinderGeometry(200, 180, 600, 64);
        const housing = new THREE.Mesh(housingGeo, darkMatterMat);
        housing.rotation.x = Math.PI / 2;
        engineGroup.add(housing);

        createPanelLines(engineGroup, 201, 600, 64, darkSteel);

        // Core Singularity (Particles)
        const coreGeo = new THREE.BufferGeometry();
        const coreCount = 100000;
        const corePos = new Float32Array(coreCount * 3);
        const coreCol = new Float32Array(coreCount * 3);
        
        for (let i = 0; i < coreCount; i++) {
            const r = Math.random() * 150;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);
            
            corePos[i*3] = x; corePos[i*3+1] = y; corePos[i*3+2] = z;
            
            const color = new THREE.Color();
            color.setHSL(0.6 + (r/150)*0.2, 1.0, 0.5);
            coreCol[i*3] = color.r; coreCol[i*3+1] = color.g; coreCol[i*3+2] = color.b;
        }
        coreGeo.setAttribute('position', new THREE.BufferAttribute(corePos, 3));
        coreGeo.setAttribute('color', new THREE.BufferAttribute(coreCol, 3));
        
        const coreParticles = new THREE.Points(coreGeo, new THREE.PointsMaterial({
            size: 1.5, vertexColors: true, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.8, depthWrite: false
        }));
        engineGroup.add(coreParticles);
        animationState.coreParticles = coreParticles;

        // Containment Rings (Torus)
        for (let i = 0; i < 5; i++) {
            const ringGeo = new THREE.TorusGeometry(220 + i*20, 10, 32, 128);
            const ring = new THREE.Mesh(ringGeo, chrome);
            ring.rotation.y = Math.PI / 2;
            ring.rotation.x = (i * Math.PI) / 5;
            engineGroup.add(ring);
            animationState.radars.push(ring); // reuse radar array for spinning rings
        }

        group.add(engineGroup);
        return engineGroup;
    }
    const engineBlock = buildGalacticCoreEngine();

    // ==========================================
    // 3. COSMIC OPERATOR CABIN
    // ==========================================
    function buildOperatorCabin() {
        const cabinGroup = new THREE.Group();
        cabinGroup.position.set(0, 300, 300);

        // Main Shell (ExtrudeGeometry)
        const shellShape = new THREE.Shape();
        shellShape.moveTo(-100, 0);
        shellShape.lineTo(100, 0);
        shellShape.lineTo(120, 80);
        shellShape.lineTo(80, 150); // roof back
        shellShape.lineTo(-80, 150); // roof front
        shellShape.lineTo(-120, 80);
        shellShape.lineTo(-100, 0);
        
        const extrudeSettings = { depth: 150, bevelEnabled: true, bevelThickness: 5, bevelSize: 5, bevelSegments: 8 };
        const shellGeo = new THREE.ExtrudeGeometry(shellShape, extrudeSettings);
        shellGeo.center();
        const shell = new THREE.Mesh(shellGeo, steel);
        cabinGroup.add(shell);

        // Tinted Glass Windows
        const windowGeo = new THREE.PlaneGeometry(140, 60);
        const windowMesh = new THREE.Mesh(windowGeo, tinted);
        windowMesh.position.set(0, 35, 76);
        windowMesh.rotation.x = -0.2;
        cabinGroup.add(windowMesh);

        // Huge Grille
        const grilleGroup = new THREE.Group();
        grilleGroup.position.set(0, -30, 76);
        for (let i = -50; i <= 50; i += 10) {
            const slatGeo = new THREE.BoxGeometry(4, 50, 4);
            const slat = new THREE.Mesh(slatGeo, chrome);
            slat.position.x = i;
            grilleGroup.add(slat);
        }
        cabinGroup.add(grilleGroup);

        // Side Mirrors
        function buildMirror(side) {
            const mirrorGroup = new THREE.Group();
            const armGeo = new THREE.CylinderGeometry(2, 2, 40, 16);
            const arm = new THREE.Mesh(armGeo, darkSteel);
            arm.rotation.z = side * Math.PI / 2;
            arm.position.x = side * 20;
            
            const headGeo = new THREE.BoxGeometry(10, 40, 20);
            const head = new THREE.Mesh(headGeo, plastic);
            head.position.x = side * 40;
            
            const glassGeo = new THREE.PlaneGeometry(8, 38);
            const glassMesh = new THREE.Mesh(glassGeo, chrome);
            glassMesh.position.set(side * 40.5, 0, 10.1);
            glassMesh.rotation.y = side * Math.PI / 2;

            mirrorGroup.add(arm, head, glassMesh);
            mirrorGroup.position.set(side * 80, 20, 60);
            return mirrorGroup;
        }
        cabinGroup.add(buildMirror(1));
        cabinGroup.add(buildMirror(-1));

        // Interior: Steering Wheel
        const wheelGroup = new THREE.Group();
        wheelGroup.position.set(0, 10, 30);
        const wheelTorus = new THREE.Mesh(new THREE.TorusGeometry(15, 2, 16, 64), rubber);
        wheelGroup.add(wheelTorus);
        for(let i=0; i<3; i++) {
            const spoke = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 15, 16), aluminum);
            spoke.position.y = 7.5;
            spoke.rotation.z = (i * Math.PI * 2) / 3;
            wheelGroup.add(spoke);
        }
        wheelGroup.rotation.x = -Math.PI / 4;
        cabinGroup.add(wheelGroup);

        // Interior: Control Panels & Glowing Screens
        const dashboardGeo = new THREE.BoxGeometry(120, 20, 30);
        const dashboard = new THREE.Mesh(dashboardGeo, darkSteel);
        dashboard.position.set(0, -10, 40);
        cabinGroup.add(dashboard);

        for(let i=0; i<5; i++) {
            const screenGeo = new THREE.PlaneGeometry(15, 10);
            const screen = new THREE.Mesh(screenGeo, neonBlue);
            screen.position.set(-40 + i*20, 5, 45.1);
            screen.rotation.x = -0.2;
            cabinGroup.add(screen);
        }

        // Interior: Joysticks
        for(let i of [-1, 1]) {
            const joyGroup = new THREE.Group();
            const base = new THREE.Mesh(new THREE.CylinderGeometry(4, 6, 10, 32), darkSteel);
            const stick = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 20, 32), chrome);
            stick.position.y = 15;
            const knob = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), neonRed);
            knob.position.y = 25;
            joyGroup.add(base, stick, knob);
            joyGroup.position.set(i * 30, -5, 25);
            joyGroup.rotation.x = 0.2;
            cabinGroup.add(joyGroup);
        }

        // Ladders to Cabin
        function buildLadder(x, y, z) {
            const ladderGroup = new THREE.Group();
            const railGeo = new THREE.CylinderGeometry(2, 2, 200, 16);
            const railL = new THREE.Mesh(railGeo, aluminum);
            railL.position.set(-10, -100, 0);
            const railR = new THREE.Mesh(railGeo, aluminum);
            railR.position.set(10, -100, 0);
            ladderGroup.add(railL, railR);

            const rungGeo = new THREE.CylinderGeometry(1, 1, 20, 16);
            for(let i = -190; i < 0; i += 10) {
                const rung = new THREE.Mesh(rungGeo, steel);
                rung.position.set(0, i, 0);
                rung.rotation.z = Math.PI / 2;
                ladderGroup.add(rung);
            }
            ladderGroup.position.set(x, y, z);
            return ladderGroup;
        }
        cabinGroup.add(buildLadder(-100, 0, 0));
        cabinGroup.add(buildLadder(100, 0, 0));

        group.add(cabinGroup);
        return cabinGroup;
    }
    const cabin = buildOperatorCabin();

    // ==========================================
    // 4. HYDRAULIC PISTONS & LINES
    // ==========================================
    function buildHydraulicActuator(startX, startY, startZ, endX, endY, endZ) {
        const pistonGroup = new THREE.Group();
        const start = new THREE.Vector3(startX, startY, startZ);
        const end = new THREE.Vector3(endX, endY, endZ);
        const distance = start.distanceTo(end);
        
        pistonGroup.position.copy(start);
        pistonGroup.lookAt(end);

        // Barrel (Outer Cylinder)
        const barrelGeo = new THREE.CylinderGeometry(15, 15, distance * 0.6, 32);
        const barrel = new THREE.Mesh(barrelGeo, darkSteel);
        barrel.rotation.x = Math.PI / 2;
        barrel.position.z = distance * 0.3;
        pistonGroup.add(barrel);

        // Rod (Inner Cylinder)
        const rodGeo = new THREE.CylinderGeometry(8, 8, distance * 0.5, 32);
        const rod = new THREE.Mesh(rodGeo, chrome);
        rod.rotation.x = Math.PI / 2;
        rod.position.z = distance * 0.75;
        pistonGroup.add(rod);

        // Hydraulic Fluid Lines wrapped around barrel
        const lineCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(16, 0, 0),
            new THREE.Vector3(0, 16, distance * 0.15),
            new THREE.Vector3(-16, 0, distance * 0.3),
            new THREE.Vector3(0, -16, distance * 0.45),
            new THREE.Vector3(16, 0, distance * 0.6)
        ]);
        const lineGeo = new THREE.TubeGeometry(lineCurve, 64, 2, 16, false);
        const lineMesh = new THREE.Mesh(lineGeo, rubber);
        pistonGroup.add(lineMesh);

        group.add(pistonGroup);
        animationState.pistons.push({ rod, dist: distance });
        return pistonGroup;
    }
    
    // Connect cabin to tires
    buildHydraulicActuator(-100, 300, 300, -250, -50, 400);
    buildHydraulicActuator(100, 300, 300, 250, -50, 400);
    buildHydraulicActuator(-100, 300, 300, -250, -50, -400);
    buildHydraulicActuator(100, 300, 300, 250, -50, -400);

    // Extensive hydraulic lines (TubeGeometry) connecting Engine to Cabin
    for(let i=0; i<20; i++) {
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(Math.random()*100 - 50, 100, Math.random()*100 - 50),
            new THREE.Vector3(Math.random()*150 - 75, 200, Math.random()*150 - 75),
            new THREE.Vector3((i%2===0?-80:80), 300, 250)
        ]);
        const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 32, 2, 8, false), copper);
        group.add(tube);
    }

    // ==========================================
    // 5. EXHAUST STACKS
    // ==========================================
    function buildExhaustStack(x, y, z) {
        const exhaustGroup = new THREE.Group();
        exhaustGroup.position.set(x, y, z);

        const exhaustProfile = [
            new THREE.Vector2(30, 0),
            new THREE.Vector2(35, 20),
            new THREE.Vector2(35, 40),
            new THREE.Vector2(30, 60),
            new THREE.Vector2(30, 200),
            new THREE.Vector2(45, 200),
            new THREE.Vector2(45, 210),
            new THREE.Vector2(30, 210),
            new THREE.Vector2(30, 300),
            new THREE.Vector2(50, 320),
            new THREE.Vector2(50, 340)
        ];
        const stackGeo = new THREE.LatheGeometry(exhaustProfile, 64);
        const stack = new THREE.Mesh(stackGeo, chrome);
        exhaustGroup.add(stack);

        // Flap
        const flapGeo = new THREE.CylinderGeometry(50, 50, 5, 32);
        const flap = new THREE.Mesh(flapGeo, darkSteel);
        flap.position.set(0, 345, 0);
        flap.rotation.x = 0.5;
        exhaustGroup.add(flap);
        animationState.radars.push(flap); // just to animate it flapping

        group.add(exhaustGroup);
        return exhaustGroup;
    }
    buildExhaustStack(-150, 100, -200);
    buildExhaustStack(150, 100, -200);

    // Dark Matter Smoke Particles
    const smokeCount = 5000;
    const smokeGeo = new THREE.BufferGeometry();
    const smokePos = new Float32Array(smokeCount * 3);
    for(let i=0; i<smokeCount; i++) {
        smokePos[i*3] = (Math.random()-0.5)*300;
        smokePos[i*3+1] = 400 + Math.random()*1000;
        smokePos[i*3+2] = -200 + (Math.random()-0.5)*100;
    }
    smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePos, 3));
    const smokeMat = new THREE.PointsMaterial({
        color: 0x220033, size: 40, transparent: true, opacity: 0.4, depthWrite: false, blending: THREE.AdditiveBlending
    });
    const smokeParticles = new THREE.Points(smokeGeo, smokeMat);
    group.add(smokeParticles);
    animationState.smokeParticles = smokeParticles;

    // ==========================================
    // 6. STARS & DYSON NODES
    // ==========================================
    function buildStarWithDysonNode(x, y, z, scale, colorHex) {
        const nodeGroup = new THREE.Group();
        nodeGroup.position.set(x, y, z);

        // The Star
        const starGeo = new THREE.SphereGeometry(100 * scale, 64, 64);
        const starMat = new THREE.MeshStandardMaterial({
            color: colorHex, emissive: colorHex, emissiveIntensity: 2.0, wireframe: true
        });
        const star = new THREE.Mesh(starGeo, starMat);
        nodeGroup.add(star);
        animationState.stars.push(star);

        // Core Halo
        const haloGeo = new THREE.SphereGeometry(120 * scale, 64, 64);
        const haloMat = new THREE.MeshBasicMaterial({
            color: colorHex, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending, depthWrite: false
        });
        const halo = new THREE.Mesh(haloGeo, haloMat);
        nodeGroup.add(halo);

        // Dyson Swarm (InstancedMesh)
        const panelGeo = new THREE.BoxGeometry(10*scale, 1*scale, 5*scale);
        const panelMat = new THREE.MeshStandardMaterial({color: 0x111111, metalness: 0.9, roughness: 0.1, emissive: colorHex, emissiveIntensity: 0.2});
        const swarmCount = 2000;
        const swarm = new THREE.InstancedMesh(panelGeo, panelMat, swarmCount);
        
        const dummy = new THREE.Object3D();
        for(let i=0; i<swarmCount; i++) {
            const r = 180 * scale + Math.random() * 50 * scale;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            
            dummy.position.set(
                r * Math.sin(phi) * Math.cos(theta),
                r * Math.sin(phi) * Math.sin(theta),
                r * Math.cos(phi)
            );
            dummy.lookAt(0,0,0);
            dummy.updateMatrix();
            swarm.setMatrixAt(i, dummy.matrix);
        }
        nodeGroup.add(swarm);
        animationState.swarms.push({mesh: swarm, speed: (Math.random()*0.02 + 0.01)});

        // Dyson Megastructure Framework (Lathe & Torus)
        const frameMat = new THREE.MeshPhysicalMaterial({
            color: 0x222222, metalness: 1.0, roughness: 0.3, wireframe: true
        });
        for(let i=0; i<3; i++) {
            const ringGeo = new THREE.TorusGeometry(250 * scale + i*20, 5*scale, 32, 128);
            const ring = new THREE.Mesh(ringGeo, frameMat);
            ring.rotation.x = Math.random() * Math.PI;
            ring.rotation.y = Math.random() * Math.PI;
            nodeGroup.add(ring);
            animationState.swarms.push({mesh: ring, speed: -0.01 * (i+1)});
        }

        group.add(nodeGroup);
        return nodeGroup;
    }

    const star1 = buildStarWithDysonNode(-1500, 800, -2000, 1.5, 0xffaa00);
    const star2 = buildStarWithDysonNode(2000, -500, -1500, 1.0, 0x00ffff);
    const star3 = buildStarWithDysonNode(500, 1500, 2500, 2.0, 0xff2222);

    // ==========================================
    // 7. ENERGY TETHERS (Custom Shaders)
    // ==========================================
    function buildEnergyTether(startVec, endVec, col1, col2) {
        const distance = startVec.distanceTo(endVec);
        const midPoint = startVec.clone().lerp(endVec, 0.5);
        midPoint.y += distance * 0.2; // arc

        const curve = new THREE.CatmullRomCurve3([startVec, midPoint, endVec]);
        const tubeGeo = new THREE.TubeGeometry(curve, 128, 20, 32, false);
        
        const mat = new THREE.ShaderMaterial({
            vertexShader: tetherVertexShader,
            fragmentShader: tetherFragmentShader,
            uniforms: {
                time: { value: 0 },
                color1: { value: new THREE.Color(col1) },
                color2: { value: new THREE.Color(col2) }
            },
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide
        });

        const tether = new THREE.Mesh(tubeGeo, mat);
        group.add(tether);
        animationState.tethers.push(mat);

        // Add structural support rings along tether
        const ringsGroup = new THREE.Group();
        for(let i=0.1; i<0.9; i+=0.05) {
            const pt = curve.getPoint(i);
            const tang = curve.getTangent(i);
            const ring = new THREE.Mesh(new THREE.TorusGeometry(40, 5, 16, 32), darkSteel);
            ring.position.copy(pt);
            ring.lookAt(pt.clone().add(tang));
            ringsGroup.add(ring);
        }
        group.add(ringsGroup);

        return curve;
    }

    const tether1 = buildEnergyTether(new THREE.Vector3(0,0,0), new THREE.Vector3(-1500, 800, -2000), 0xffaa00, 0xff0000);
    const tether2 = buildEnergyTether(new THREE.Vector3(0,0,0), new THREE.Vector3(2000, -500, -1500), 0x00ffff, 0x0000ff);
    const tether3 = buildEnergyTether(new THREE.Vector3(0,0,0), new THREE.Vector3(500, 1500, 2500), 0xff2222, 0xff00ff);

    // ==========================================
    // 8. HYPER-COMPLEX SPACE STATIONS
    // ==========================================
    function buildSpaceStation(posVec) {
        const stationGroup = new THREE.Group();
        stationGroup.position.copy(posVec);

        // Central Hub (Icosahedron)
        const hubGeo = new THREE.IcosahedronGeometry(80, 2);
        const hub = new THREE.Mesh(hubGeo, steel);
        stationGroup.add(hub);

        // Habitation Rings
        for(let i=0; i<3; i++) {
            const ringGeo = new THREE.TorusGeometry(150 + i*50, 15, 32, 64);
            const ring = new THREE.Mesh(ringGeo, aluminum);
            ring.rotation.x = Math.PI / 2;
            ring.position.y = (i - 1) * 60;
            stationGroup.add(ring);
            
            // Add pods to rings
            for(let j=0; j<12; j++) {
                const pod = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), neonPurple);
                const angle = (j/12) * Math.PI*2;
                pod.position.set(Math.cos(angle)*(150+i*50), (i-1)*60, Math.sin(angle)*(150+i*50));
                stationGroup.add(pod);
            }
        }

        // Solar Arrays / Antennas
        for(let i=0; i<4; i++) {
            const arrayGeo = new THREE.BoxGeometry(200, 5, 40);
            const array = new THREE.Mesh(arrayGeo, glass);
            const angle = (i/4) * Math.PI*2;
            array.position.set(Math.cos(angle)*250, 0, Math.sin(angle)*250);
            array.rotation.y = -angle;
            stationGroup.add(array);
        }

        group.add(stationGroup);
        animationState.stations.push(stationGroup);
        return stationGroup;
    }

    buildSpaceStation(tether1.getPoint(0.3));
    buildSpaceStation(tether2.getPoint(0.6));
    buildSpaceStation(tether3.getPoint(0.5));

    // ==========================================
    // EXPORT PARTS LIST
    // ==========================================

    parts.push(
        {
            name: 'God_Tier_Spacetime_Tire_FL',
            description: 'A planetary-scale wheel that grips the fabric of spacetime, utilizing microscopic black holes embedded in the extruded lugs to generate traction across the cosmic web.',
            material: 'rubber/darkSteel/chrome',
            function: 'Omniversal mobility and stabilization of the rig along the galactic plane.',
            assemblyOrder: 1,
            connections: ['Hydraulic_Spacetime_Actuator_Left', 'Galactic_Core_Engine_Block'],
            failureEffect: 'Loss of cosmic traction, causing the rig to drift uncontrolled into hyperspace.',
            cascadeFailures: ['Cosmic_Operator_Cabin', 'Energy_Tether_Network_Hub'],
            originalPosition: {x: -250, y: -150, z: 400},
            explodedPosition: {x: -600, y: -300, z: 800}
        },
        {
            name: 'God_Tier_Spacetime_Tire_FR',
            description: 'Massive Torus geometry with complex spoke arrays, distributing gravitational loads from the harvested stars.',
            material: 'rubber/darkSteel/chrome',
            function: 'Load distribution and forward spacetime propulsion.',
            assemblyOrder: 2,
            connections: ['Hydraulic_Spacetime_Actuator_Right', 'Galactic_Core_Engine_Block'],
            failureEffect: 'Gravitational imbalance triggering a localized false-vacuum decay.',
            cascadeFailures: ['Galactic_Core_Engine_Block'],
            originalPosition: {x: 250, y: -150, z: 400},
            explodedPosition: {x: 600, y: -300, z: 800}
        },
        {
            name: 'God_Tier_Spacetime_Tire_RL',
            description: 'Rear port spacetime tread, responsible for carving anchor points in the cosmic microwave background.',
            material: 'rubber/darkSteel/chrome',
            function: 'Anchoring during heavy stellar siphoning.',
            assemblyOrder: 3,
            connections: ['Exhaust_Stack_Left', 'Galactic_Core_Engine_Block'],
            failureEffect: 'Rig decoupling from the cosmic microwave background.',
            cascadeFailures: ['Stellar_Dyson_Node_Alpha'],
            originalPosition: {x: -250, y: -150, z: -400},
            explodedPosition: {x: -600, y: -300, z: -800}
        },
        {
            name: 'God_Tier_Spacetime_Tire_RR',
            description: 'Rear starboard spacetime tread, featuring extreme hydraulic micro-adjusters on the rim spokes.',
            material: 'rubber/darkSteel/chrome',
            function: 'Precision alignment of the rig against stellar drift.',
            assemblyOrder: 4,
            connections: ['Exhaust_Stack_Right', 'Galactic_Core_Engine_Block'],
            failureEffect: 'Tether misalignment leading to catastrophic energy backflow.',
            cascadeFailures: ['Energy_Tether_Beta', 'Stellar_Dyson_Node_Beta'],
            originalPosition: {x: 250, y: -150, z: -400},
            explodedPosition: {x: 600, y: -300, z: -800}
        },
        {
            name: 'Galactic_Core_Engine_Block',
            description: 'A captured supermassive black hole encased in a dark matter housing, acting as the central engine for the Harvester.',
            material: 'darkMatterMat/chrome',
            function: 'Generates infinite energy through Hawking radiation and Penrose extraction.',
            assemblyOrder: 5,
            connections: ['All_Spacetime_Tires', 'Energy_Tethers', 'Cosmic_Operator_Cabin'],
            failureEffect: 'Uncontained singularity expansion, consuming the local galaxy group.',
            cascadeFailures: ['Everything'],
            originalPosition: {x: 0, y: 0, z: 0},
            explodedPosition: {x: 0, y: 1000, z: 0}
        },
        {
            name: 'Cosmic_Operator_Cabin',
            description: 'A god-tier control rig resembling a truck cabin but the size of a solar system, featuring tinted glass, steering wheels, and neon-lit joysticks.',
            material: 'steel/tinted/neonBlue/plastic',
            function: 'Houses the Trans-Dimensional Operator and provides neural linkage to the Harvester.',
            assemblyOrder: 6,
            connections: ['Galactic_Core_Engine_Block', 'Hydraulic_Actuators'],
            failureEffect: 'Loss of rig control, AI takes over with hostile intent.',
            cascadeFailures: ['Hydraulic_Actuators'],
            originalPosition: {x: 0, y: 300, z: 300},
            explodedPosition: {x: 0, y: 800, z: 1200}
        },
        {
            name: 'Omniversal_Steering_Interface',
            description: 'A rubber and aluminum steering wheel connected to the fabric of spacetime, allowing manual driving of the galaxy.',
            material: 'rubber/aluminum',
            function: 'Navigational input.',
            assemblyOrder: 7,
            connections: ['Cosmic_Operator_Cabin'],
            failureEffect: 'Inability to alter course through the multiverse.',
            cascadeFailures: [],
            originalPosition: {x: 0, y: 310, z: 330},
            explodedPosition: {x: 0, y: 850, z: 1250}
        },
        {
            name: 'Hydraulic_Spacetime_Actuator_Left',
            description: 'A massive cylinder-within-cylinder piston that adjusts the pitch of the entire Galactic Core Engine.',
            material: 'darkSteel/chrome/rubber',
            function: 'Pitch control and tension management for the Alpha Tether.',
            assemblyOrder: 8,
            connections: ['Cosmic_Operator_Cabin', 'God_Tier_Spacetime_Tire_FL'],
            failureEffect: 'Tether snaps due to over-tension, whipping across the galaxy and cleaving planets.',
            cascadeFailures: ['Energy_Tether_Alpha', 'Hyper_Relay_Station_One'],
            originalPosition: {x: -175, y: 125, z: 350},
            explodedPosition: {x: -500, y: 500, z: 600}
        },
        {
            name: 'Hydraulic_Spacetime_Actuator_Right',
            description: 'Counterpart to the left actuator, equipped with extensive copper hydraulic fluid lines.',
            material: 'darkSteel/chrome/rubber/copper',
            function: 'Pitch control and tension management for the Beta Tether.',
            assemblyOrder: 9,
            connections: ['Cosmic_Operator_Cabin', 'God_Tier_Spacetime_Tire_FR'],
            failureEffect: 'Asymmetric engine pitch, inducing a fatal flat spin of the rig.',
            cascadeFailures: ['Galactic_Core_Engine_Block'],
            originalPosition: {x: 175, y: 125, z: 350},
            explodedPosition: {x: 500, y: 500, z: 600}
        },
        {
            name: 'Dark_Matter_Exhaust_Stack_Left',
            description: 'A towering LatheGeometry stack venting waste entropy and dark matter exhaust into the void.',
            material: 'chrome/darkSteel',
            function: 'Thermal and entropic venting.',
            assemblyOrder: 10,
            connections: ['Galactic_Core_Engine_Block'],
            failureEffect: 'Entropic buildup, causing the engine to age trillions of years in seconds.',
            cascadeFailures: ['Galactic_Core_Engine_Block'],
            originalPosition: {x: -150, y: 100, z: -200},
            explodedPosition: {x: -400, y: 600, z: -500}
        },
        {
            name: 'Stellar_Dyson_Node_Alpha',
            description: 'A complex web of Lathe and Torus structures wrapping an entire star, accompanied by an InstancedMesh swarm of 2000 collection panels.',
            material: 'frameMat/starMat',
            function: 'Total stellar energy extraction.',
            assemblyOrder: 11,
            connections: ['Energy_Tether_Alpha'],
            failureEffect: 'Star goes supernova uncontained, annihilating the node.',
            cascadeFailures: ['Energy_Tether_Alpha'],
            originalPosition: {x: -1500, y: 800, z: -2000},
            explodedPosition: {x: -3000, y: 1600, z: -4000}
        },
        {
            name: 'Stellar_Dyson_Node_Beta',
            description: 'A highly advanced Dyson Swarm around a blue giant, rotating at extreme velocities to counter gravitational collapse.',
            material: 'frameMat/starMat',
            function: 'Total stellar energy extraction.',
            assemblyOrder: 12,
            connections: ['Energy_Tether_Beta'],
            failureEffect: 'Blue giant collapses into a black hole, reversing the energy tether flow.',
            cascadeFailures: ['Energy_Tether_Beta', 'Galactic_Core_Engine_Block'],
            originalPosition: {x: 2000, y: -500, z: -1500},
            explodedPosition: {x: 4000, y: -1000, z: -3000}
        },
        {
            name: 'Energy_Tether_Alpha',
            description: 'A vast TubeGeometry conduit utilizing custom shaders to pulse collected stellar energy back to the rig.',
            material: 'ShaderMaterial(tether)',
            function: 'Energy transmission across lightyears.',
            assemblyOrder: 13,
            connections: ['Stellar_Dyson_Node_Alpha', 'Galactic_Core_Engine_Block'],
            failureEffect: 'Plasma leak capable of sterilizing nearby star systems.',
            cascadeFailures: ['Hyper_Relay_Station_One'],
            originalPosition: {x: -750, y: 400, z: -1000},
            explodedPosition: {x: -1500, y: 800, z: -2000}
        },
        {
            name: 'Hyper_Relay_Station_One',
            description: 'An intricate Icosahedron-based space station strung along the tether, featuring Torus habitation rings and massive docking bays.',
            material: 'steel/aluminum/glass/neonPurple',
            function: 'Maintains tether stability and houses the Harvester maintenance drones.',
            assemblyOrder: 14,
            connections: ['Energy_Tether_Alpha'],
            failureEffect: 'Station de-orbits into the tether, causing a catastrophic blockage.',
            cascadeFailures: ['Energy_Tether_Alpha'],
            originalPosition: {x: -450, y: 240, z: -600},
            explodedPosition: {x: -900, y: 480, z: -1200}
        },
        {
            name: 'Energy_Tether_Network_Hub',
            description: 'The central junction box located beneath the Cabin, where all tethers converge before entering the Engine Block. Secured by thousands of rivets and panel lines.',
            material: 'darkMatterMat/copper',
            function: 'Energy routing and multiplexing.',
            assemblyOrder: 15,
            connections: ['Energy_Tether_Alpha', 'Energy_Tether_Beta', 'Galactic_Core_Engine_Block'],
            failureEffect: 'Short circuit resulting in a Big Bang level event.',
            cascadeFailures: ['Everything'],
            originalPosition: {x: 0, y: 150, z: 0},
            explodedPosition: {x: 0, y: -500, z: 500}
        }
    );

    // ==========================================
    // QUIZ QUESTIONS
    // ==========================================
    const quizQuestions = [
        {
            question: "Within the Galactic Core Engine Block, if the central singularity is a Kerr black hole, how does the rig extract rotational energy without violating the second law of black hole thermodynamics?",
            options: [
                "By injecting negative-mass tachyons into the event horizon.",
                "Via the Penrose process in the ergosphere, splitting particles so one falls in with negative energy and the other escapes with greater mass-energy.",
                "By harvesting Hawking radiation which strictly increases the black hole's mass.",
                "By reversing the Lense-Thirring effect using dark matter exhaust."
            ],
            correctAnswer: 1,
            explanation: "The Penrose process allows energy extraction from a rotating (Kerr) black hole by dropping mass into the ergosphere, splitting it, and letting the negative energy portion fall in while the other escapes with more energy than it started with."
        },
        {
            question: "The custom ShaderMaterial on the Energy Tethers pulses due to relativistic energy transfer. If energy is flowing down the tether at 0.99c, how does time dilation affect the observed pulse frequency from the Cosmic Operator Cabin (assuming the cabin is stationary relative to the tether)?",
            options: [
                "The frequency appears infinitely high due to length contraction.",
                "The frequency appears significantly lower (redshifted) due to time dilation.",
                "The frequency is unaffected because energy is massless.",
                "The frequency appears perfectly synchronized due to quantum entanglement."
            ],
            correctAnswer: 1,
            explanation: "Due to relativistic time dilation (and the transverse Doppler effect if viewed perpendicularly), processes moving at speeds close to c appear to run slower to a stationary observer, thus lowering the observed frequency."
        },
        {
            question: "The Stellar Dyson Nodes utilize thousands of panels in an InstancedMesh swarm. If we are searching for Kardashev Type III signatures in a distant galaxy, what specific thermal emission profile should we look for?",
            options: [
                "A massive excess of high-energy gamma rays.",
                "A perfectly uniform cosmic microwave background.",
                "An anomalous excess of mid-to-far infrared radiation obscuring visible starlight.",
                "A complete absence of all electromagnetic radiation."
            ],
            correctAnswer: 2,
            explanation: "Dyson spheres/swarms absorb high-energy starlight and re-radiate waste heat. According to thermodynamics, this waste heat peaks in the mid-to-far infrared spectrum."
        },
        {
            question: "The planetary-scale Spacetime Tires are designed to grip the fabric of spacetime itself. What general relativistic effect must the tires overcome when rotating massively dense objects (like the embedded micro black holes in the treads)?",
            options: [
                "The Lense-Thirring effect (frame-dragging).",
                "The Unruh effect.",
                "The Casimir effect.",
                "The Chandrasekhar limit."
            ],
            correctAnswer: 0,
            explanation: "Frame-dragging, or the Lense-Thirring effect, occurs when a massive rotating object twists the fabric of spacetime around it, which the tires would have to heavily compensate for to maintain traction."
        },
        {
            question: "The Dark Matter Exhaust Stacks vent entropic waste. If the dark matter used has the equation of state w = -1, how does venting it affect the local cosmic expansion rate around the rig?",
            options: [
                "It causes the local region to contract, forming a Big Crunch.",
                "It has no effect on expansion, only on local gravity.",
                "It acts identically to dark energy (cosmological constant), accelerating local expansion.",
                "It decelerates expansion by increasing the local matter density parameter."
            ],
            correctAnswer: 2,
            explanation: "An equation of state of w = -1 corresponds to the cosmological constant (dark energy). Venting this into the local environment would cause a localized accelerated expansion of space."
        }
    ];

    // ==========================================
    // EXTREME ANIMATION LOGIC
    // ==========================================
    const animate = (time, speed, activeMeshes) => {
        animationState.time = time * speed;

        // Animate Shaders
        animationState.tethers.forEach(shader => {
            shader.uniforms.time.value = animationState.time;
        });

        // Rotate Tires
        animationState.tires.forEach(tire => {
            tire.rotation.x -= 0.05 * speed;
        });

        // Animate Dyson Swarms & Frames
        animationState.swarms.forEach(swarmObj => {
            swarmObj.mesh.rotation.x += swarmObj.speed * speed;
            swarmObj.mesh.rotation.y += swarmObj.speed * speed * 0.5;
        });

        // Orbit Stars slightly
        animationState.stars.forEach((star, index) => {
            star.position.y += Math.sin(time * speed + index) * 2;
        });

        // Spin Space Stations
        animationState.stations.forEach(station => {
            station.rotation.y += 0.01 * speed;
        });

        // Hydraulic Pistons pulsing (sine wave)
        animationState.pistons.forEach((piston, index) => {
            const extension = Math.sin(time * speed * 2 + index) * (piston.dist * 0.1);
            piston.rod.position.z = (piston.dist * 0.75) + extension;
        });

        // Spin Radars / Rings / Flaps
        animationState.radars.forEach((radar, index) => {
            if(radar.geometry.type === 'TorusGeometry') {
                radar.rotation.z += 0.02 * speed * (index % 2 === 0 ? 1 : -1);
            } else if (radar.geometry.type === 'CylinderGeometry') {
                // Exhaust flaps
                radar.rotation.x = 0.5 + Math.sin(time * speed * 5) * 0.2;
            }
        });

        // Swirl Galactic Core Particles
        if(animationState.coreParticles) {
            animationState.coreParticles.rotation.y += 0.005 * speed;
            animationState.coreParticles.rotation.z = Math.sin(time * speed * 0.2) * 0.1;
        }

        // Animate Dark Matter Smoke
        if(animationState.smokeParticles) {
            const positions = animationState.smokeParticles.geometry.attributes.position.array;
            for(let i=0; i<positions.length; i+=3) {
                positions[i+1] += 10 * speed; // move up
                if(positions[i+1] > 2000) {
                    positions[i+1] = 400; // reset height
                    positions[i] = (Math.random()-0.5)*300; // reset x
                    positions[i+2] = -200 + (Math.random()-0.5)*100; // reset z
                }
            }
            animationState.smokeParticles.geometry.attributes.position.needsUpdate = true;
        }
    };

    return { group, parts, description, quizQuestions, animate };
}
