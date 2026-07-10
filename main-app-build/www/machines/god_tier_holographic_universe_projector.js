import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};
    const updaters = [];
    let elapsedTime = 0;

    // =========================================================================
    // 1. THEORETICAL PHYSICS SHADER DEFINITIONS
    // =========================================================================
    
    // AdS/CFT Holographic Boundary Surface Shader
    // Simulates a 2D surface encoding 3D bulk information via complex fractal noise.
    const boundaryVertexShader = `
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        uniform float uTime;
        void main() {
            vUv = uv;
            vPosition = position;
            vNormal = normal;
            // Quantum fluctuations on the boundary
            vec3 pos = position;
            float fluctuation = sin(pos.x * 20.0 + uTime) * cos(pos.y * 20.0 + uTime) * cos(pos.z * 20.0 + uTime) * 0.1;
            pos += normal * fluctuation;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `;

    const boundaryFragmentShader = `
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        uniform float uTime;

        // Pseudo-random generator
        float hash(vec2 p) {
            return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }

        // Value noise
        float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
                       mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
        }

        // Fractal Brownian Motion (FBM) for intricate boundary encoding patterns
        float fbm(vec2 p) {
            float v = 0.0;
            float a = 0.5;
            mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
            for (int i = 0; i < 8; i++) {
                v += a * noise(p);
                p = rot * p * 2.0 + vec2(100.0);
                a *= 0.5;
            }
            return v;
        }

        void main() {
            vec2 st = vUv * 15.0;
            
            // Domain warping for holographic flow
            vec2 q = vec2(0.0);
            q.x = fbm(st + 0.1 * uTime);
            q.y = fbm(st + vec2(1.0));
            
            vec2 r = vec2(0.0);
            r.x = fbm(st + 1.0 * q + vec2(1.7, 9.2) + 0.15 * uTime);
            r.y = fbm(st + 1.0 * q + vec2(8.3, 2.8) + 0.126 * uTime);
            
            float f = fbm(st + r);
            
            // Neon cyan to deep violet holographic palette
            vec3 color1 = vec3(0.0, 1.0, 1.0); // Cyan
            vec3 color2 = vec3(0.5, 0.0, 1.0); // Violet
            vec3 baseColor = mix(color1, color2, clamp(f * f * 4.0, 0.0, 1.0));
            
            baseColor = mix(baseColor, vec3(1.0, 1.0, 1.0), clamp(length(q) - 1.0, 0.0, 1.0));
            
            // Fresnel edge glow
            vec3 viewDir = normalize(cameraPosition - vPosition);
            float fresnel = dot(viewDir, vNormal);
            fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
            fresnel = pow(fresnel, 3.0);
            
            float finalAlpha = clamp(f * 1.5, 0.2, 0.8) + fresnel;
            vec3 finalColor = baseColor + (vec3(0.0, 1.0, 0.8) * fresnel * 2.0);
            
            gl_FragColor = vec4(finalColor, finalAlpha);
        }
    `;

    const boundaryUniforms = { uTime: { value: 0.0 } };
    const holographicMaterial = new THREE.ShaderMaterial({
        vertexShader: boundaryVertexShader,
        fragmentShader: boundaryFragmentShader,
        uniforms: boundaryUniforms,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    // Central Black Hole Event Horizon Shader (Hawking Radiation)
    const bhVertexShader = `
        varying vec2 vUv;
        varying vec3 vNormal;
        uniform float uTime;
        void main() {
            vUv = uv;
            vNormal = normal;
            vec3 pos = position;
            // Event horizon breathing
            pos += normal * sin(uTime * 5.0) * 0.02;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `;

    const bhFragmentShader = `
        varying vec2 vUv;
        varying vec3 vNormal;
        uniform float uTime;
        
        void main() {
            vec2 center = vec2(0.5, 0.5);
            float dist = distance(vUv, center);
            
            // Pitch black center
            vec3 color = vec3(0.0);
            
            // Hawking radiation edges
            float glow = smoothstep(0.4, 0.5, dist);
            float flicker = fract(sin(dot(vUv * uTime, vec2(12.9898, 78.233))) * 43758.5453);
            vec3 radiationColor = vec3(1.0, 0.5, 0.0) * flicker;
            
            color = mix(color, radiationColor, glow);
            
            gl_FragColor = vec4(color, 1.0);
        }
    `;

    const bhUniforms = { uTime: { value: 0.0 } };
    const blackHoleMaterial = new THREE.ShaderMaterial({
        vertexShader: bhVertexShader,
        fragmentShader: bhFragmentShader,
        uniforms: bhUniforms
    });

    // =========================================================================
    // 2. INDUSTRIAL OFF-ROAD CHASSIS GENERATION
    // =========================================================================

    const chassisGroup = new THREE.Group();
    
    // A. Main Body Frame (ExtrudeGeometry with immense detail)
    const frameShape = new THREE.Shape();
    frameShape.moveTo(-40, -5);
    frameShape.lineTo(40, -5);
    frameShape.lineTo(45, 0);
    frameShape.lineTo(45, 5);
    frameShape.lineTo(30, 8);
    frameShape.lineTo(-30, 8);
    frameShape.lineTo(-45, 5);
    frameShape.lineTo(-45, 0);
    frameShape.lineTo(-40, -5);

    const frameExtrudeSettings = { depth: 20, bevelEnabled: true, bevelSegments: 4, steps: 2, bevelSize: 0.5, bevelThickness: 0.5 };
    const frameGeo = new THREE.ExtrudeGeometry(frameShape, frameExtrudeSettings);
    frameGeo.translate(0, 0, -10); // Center the depth
    const frameMesh = new THREE.Mesh(frameGeo, darkSteel);
    chassisGroup.add(frameMesh);

    // B. Panel Lines and Rivets on Chassis
    const rivetGeo = new THREE.SphereGeometry(0.3, 8, 8);
    const rivetCoords = [];
    for (let x = -38; x <= 38; x += 4) {
        rivetCoords.push(new THREE.Vector3(x, -4, 10.5));
        rivetCoords.push(new THREE.Vector3(x, -4, -10.5));
        rivetCoords.push(new THREE.Vector3(x, 7, 10.5));
        rivetCoords.push(new THREE.Vector3(x, 7, -10.5));
    }
    rivetCoords.forEach(pos => {
        const rivet = new THREE.Mesh(rivetGeo, steel);
        rivet.position.copy(pos);
        chassisGroup.add(rivet);
    });

    // C. Exhaust Stacks (Chrome Tubes with smoke particles)
    const exhaustGeo = new THREE.CylinderGeometry(1.5, 1.5, 15, 16);
    const ex1 = new THREE.Mesh(exhaustGeo, chrome);
    ex1.position.set(-35, 10, 12);
    const ex2 = new THREE.Mesh(exhaustGeo, chrome);
    ex2.position.set(-35, 10, -12);
    const ex3 = new THREE.Mesh(exhaustGeo, chrome);
    ex3.position.set(35, 10, 12);
    const ex4 = new THREE.Mesh(exhaustGeo, chrome);
    ex4.position.set(35, 10, -12);
    chassisGroup.add(ex1, ex2, ex3, ex4);

    // D. Operator Cabin
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(20, 12, 0);
    
    // Cabin Exterior
    const cabinGeo = new THREE.BoxGeometry(14, 10, 16);
    const cabinExterior = new THREE.Mesh(cabinGeo, steel);
    cabinGroup.add(cabinExterior);

    // Cabin Windows (Tinted Glass)
    const windowGeoFront = new THREE.BoxGeometry(13.8, 6, 0.2);
    const windowFront = new THREE.Mesh(windowGeoFront, tinted);
    windowFront.position.set(0, 1, 8.05);
    const windowGeoSide = new THREE.BoxGeometry(0.2, 6, 15.8);
    const windowSide1 = new THREE.Mesh(windowGeoSide, tinted);
    windowSide1.position.set(7.05, 1, 0);
    const windowSide2 = new THREE.Mesh(windowGeoSide, tinted);
    windowSide2.position.set(-7.05, 1, 0);
    cabinGroup.add(windowFront, windowSide1, windowSide2);

    // Cabin Interior - Control Panels
    const dashGeo = new THREE.BoxGeometry(13, 2, 4);
    const dashboard = new THREE.Mesh(dashGeo, darkSteel);
    dashboard.position.set(0, -2, 5);
    cabinGroup.add(dashboard);

    // Holographic Monitors in Cabin
    const monitorGeo = new THREE.PlaneGeometry(3, 2);
    const monitorMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 1 });
    for(let i = -1; i <= 1; i += 1) {
        if(i === 0) continue;
        const monitor = new THREE.Mesh(monitorGeo, monitorMat);
        monitor.position.set(i * 4, -0.5, 3.1);
        monitor.rotation.x = -Math.PI / 4;
        cabinGroup.add(monitor);
    }

    // Steering/Joysticks
    const stickBaseGeo = new THREE.CylinderGeometry(0.5, 0.5, 2);
    const stickTopGeo = new THREE.SphereGeometry(0.6);
    const stick1Base = new THREE.Mesh(stickBaseGeo, steel);
    stick1Base.position.set(-3, -1, 4);
    stick1Base.rotation.x = Math.PI / 6;
    const stick1Top = new THREE.Mesh(stickTopGeo, plastic);
    stick1Top.position.set(0, 1.2, 0);
    stick1Base.add(stick1Top);
    
    const stick2Base = new THREE.Mesh(stickBaseGeo, steel);
    stick2Base.position.set(3, -1, 4);
    stick2Base.rotation.x = Math.PI / 6;
    const stick2Top = new THREE.Mesh(stickTopGeo, plastic);
    stick2Top.position.set(0, 1.2, 0);
    stick2Base.add(stick2Top);
    cabinGroup.add(stick1Base, stick2Base);
    
    chassisGroup.add(cabinGroup);

    // E. Heavy Wheels with Lugs and Suspensions
    const wheels = [];
    const wheelPositions = [
        { x: -30, y: -10, z: 18 },
        { x: -10, y: -10, z: 18 },
        { x: 10, y: -10, z: 18 },
        { x: 30, y: -10, z: 18 },
        { x: -30, y: -10, z: -18 },
        { x: -10, y: -10, z: -18 },
        { x: 10, y: -10, z: -18 },
        { x: 30, y: -10, z: -18 }
    ];

    const wheelRadius = 6;
    const tireGeo = new THREE.TorusGeometry(wheelRadius, 2.5, 32, 100);
    const lugGeo = new THREE.BoxGeometry(3, 1, 5.5);
    const rimGeo = new THREE.CylinderGeometry(4.5, 4.5, 3.5, 32);
    rimGeo.rotateX(Math.PI / 2);
    const spokeGeo = new THREE.CylinderGeometry(0.3, 0.3, wheelRadius * 1.5, 16);
    
    // Hydraulic Suspension Geos
    const shockOuterGeo = new THREE.CylinderGeometry(1.2, 1.2, 6, 16);
    const shockInnerGeo = new THREE.CylinderGeometry(0.8, 0.8, 6, 16);

    wheelPositions.forEach((pos, idx) => {
        const wheelAssembly = new THREE.Group();
        wheelAssembly.position.set(pos.x, pos.y, pos.z);

        const wheelPivot = new THREE.Group(); // Handles rotation

        // Tire
        const tire = new THREE.Mesh(tireGeo, rubber);
        wheelPivot.add(tire);

        // Lugs (Aggressive Off-road Treads)
        const numLugs = 72;
        for (let i = 0; i < numLugs; i++) {
            const angle = (i / numLugs) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeo, rubber);
            lug.position.set(Math.cos(angle) * (wheelRadius + 1.2), Math.sin(angle) * (wheelRadius + 1.2), 0);
            lug.rotation.z = angle;
            wheelPivot.add(lug);
        }

        // Rim
        const rim = new THREE.Mesh(rimGeo, chrome);
        wheelPivot.add(rim);

        // Spokes
        const numSpokes = 16;
        for (let i = 0; i < numSpokes; i++) {
            const angle = (i / numSpokes) * Math.PI * 2;
            const spoke = new THREE.Mesh(spokeGeo, steel);
            spoke.rotation.z = angle;
            wheelPivot.add(spoke);
        }

        wheelAssembly.add(wheelPivot);
        
        // Suspension
        const shockOuter = new THREE.Mesh(shockOuterGeo, darkSteel);
        shockOuter.position.set(0, 6, (pos.z > 0 ? -3 : 3));
        const shockInner = new THREE.Mesh(shockInnerGeo, chrome);
        shockInner.position.set(0, 3, (pos.z > 0 ? -3 : 3));
        
        wheelAssembly.add(shockOuter);
        wheelAssembly.add(shockInner);

        chassisGroup.add(wheelAssembly);
        wheels.push({ pivot: wheelPivot, assembly: wheelAssembly, shockInner: shockInner, origY: pos.y });
    });

    group.add(chassisGroup);

    // =========================================================================
    // 3. HOLOGRAPHIC UNIVERSE PROJECTOR (PAYLOAD)
    // =========================================================================
    
    const projectorGroup = new THREE.Group();
    projectorGroup.position.set(-10, 20, 0);

    // A. Base Turret & Containment Rings
    const turretBaseGeo = new THREE.CylinderGeometry(15, 18, 4, 64);
    const turretBase = new THREE.Mesh(turretBaseGeo, steel);
    projectorGroup.add(turretBase);

    // Hydraulic elevation arms for the containment rings
    const armGeo = new THREE.BoxGeometry(4, 30, 4);
    const arm1 = new THREE.Mesh(armGeo, darkSteel);
    arm1.position.set(0, 15, 18);
    arm1.rotation.x = -Math.PI / 8;
    const arm2 = new THREE.Mesh(armGeo, darkSteel);
    arm2.position.set(0, 15, -18);
    arm2.rotation.x = Math.PI / 8;
    projectorGroup.add(arm1, arm2);

    // Containment Rings (Gimbal)
    const gimbalGroup = new THREE.Group();
    gimbalGroup.position.set(0, 30, 0);

    const ringOuterGeo = new THREE.TorusGeometry(22, 1.5, 32, 100);
    const ringOuter = new THREE.Mesh(ringOuterGeo, chrome);
    gimbalGroup.add(ringOuter);

    const ringInnerGeo = new THREE.TorusGeometry(19, 1.2, 32, 100);
    const ringInner = new THREE.Mesh(ringInnerGeo, copper);
    gimbalGroup.add(ringInner);

    // Energy conduits (TubeGeometry wrapped around rings)
    class HelixCurve extends THREE.Curve {
        constructor(radius, tube, spiralCount) {
            super();
            this.radius = radius;
            this.tube = tube;
            this.spiralCount = spiralCount;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const u = t * Math.PI * 2 * this.spiralCount;
            const v = t * Math.PI * 2;
            const x = (this.radius + this.tube * Math.cos(u)) * Math.cos(v);
            const y = (this.radius + this.tube * Math.cos(u)) * Math.sin(v);
            const z = this.tube * Math.sin(u);
            return optionalTarget.set(x, y, z);
        }
    }
    const conduitCurve = new HelixCurve(22, 2.5, 40);
    const conduitGeo = new THREE.TubeGeometry(conduitCurve, 300, 0.4, 8, true);
    const conduitMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2 });
    const conduit = new THREE.Mesh(conduitGeo, conduitMat);
    ringOuter.add(conduit);

    // B. Holographic Boundary Sphere (The 2D CFT Surface)
    const boundaryGeo = new THREE.SphereGeometry(16, 128, 128);
    const boundarySphere = new THREE.Mesh(boundaryGeo, holographicMaterial);
    gimbalGroup.add(boundarySphere);

    // C. The 3D Bulk (Interior Projections)
    const bulkGroup = new THREE.Group();

    // -- Galaxies (Particle System) --
    const galaxyParticles = 20000;
    const galaxyGeo = new THREE.BufferGeometry();
    const galaxyPositions = new Float32Array(galaxyParticles * 3);
    const galaxyColors = new Float32Array(galaxyParticles * 3);
    const colorInside = new THREE.Color(0xffaa00);
    const colorOutside = new THREE.Color(0x00aaff);

    for (let i = 0; i < galaxyParticles; i++) {
        // Spiral galaxy formula
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 12;
        const spiralOffset = radius * 2.0;
        const finalAngle = angle + spiralOffset;
        
        const x = Math.cos(finalAngle) * radius;
        const y = (Math.random() - 0.5) * (14 - radius) * 0.5; // Thicker at center
        const z = Math.sin(finalAngle) * radius;

        galaxyPositions[i * 3] = x;
        galaxyPositions[i * 3 + 1] = y;
        galaxyPositions[i * 3 + 2] = z;

        const mixRatio = radius / 12;
        const mixedColor = colorInside.clone().lerp(colorOutside, mixRatio);
        galaxyColors[i * 3] = mixedColor.r;
        galaxyColors[i * 3 + 1] = mixedColor.g;
        galaxyColors[i * 3 + 2] = mixedColor.b;
    }

    galaxyGeo.setAttribute('position', new THREE.BufferAttribute(galaxyPositions, 3));
    galaxyGeo.setAttribute('color', new THREE.BufferAttribute(galaxyColors, 3));
    const galaxyMat = new THREE.PointsMaterial({ size: 0.1, vertexColors: true, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
    const galaxyPoints = new THREE.Points(galaxyGeo, galaxyMat);
    bulkGroup.add(galaxyPoints);

    // -- Central Black Hole --
    const bhGeo = new THREE.SphereGeometry(2, 64, 64);
    const blackHole = new THREE.Mesh(bhGeo, blackHoleMaterial);
    bulkGroup.add(blackHole);

    // Accretion Disk (Extruded Torus with glowing material)
    const accretionGeo = new THREE.TorusGeometry(3.5, 0.8, 16, 100);
    accretionGeo.scale(1, 1, 0.1);
    const accretionMat = new THREE.MeshStandardMaterial({
        color: 0xff5500,
        emissive: 0xff3300,
        emissiveIntensity: 3,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
    });
    const accretionDisk = new THREE.Mesh(accretionGeo, accretionMat);
    accretionDisk.rotation.x = Math.PI / 3;
    bulkGroup.add(accretionDisk);

    // -- MERA Tensor Network (Emergent Spacetime structure) --
    // We create a complex branching web of cylinders and spheres connecting the boundary to the center.
    const tensorGroup = new THREE.Group();
    const nodeGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const nodeMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 1 });
    const edgeMat = new THREE.MeshStandardMaterial({ color: 0x005500, wireframe: true });

    function buildTensorTree(depth, maxDepth, radius, theta, phi) {
        if (depth > maxDepth) return;
        
        // Node position in spherical coords
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        
        const node = new THREE.Mesh(nodeGeo, nodeMat);
        node.position.set(x, y, z);
        tensorGroup.add(node);

        // Branching logic to simulate hyperbolic tiling of AdS space
        if (depth < maxDepth) {
            const newRadius = radius * 0.7; // Closer to boundary means more nodes, but we build inward. Wait, AdS boundary is at r=16, center is r=0.
            // Let's build from center outward to match MERA visually
            const outRadius = radius + (16 / maxDepth);
            
            const branches = 3;
            for (let i = 0; i < branches; i++) {
                const newTheta = theta + (Math.random() - 0.5) * Math.PI / depth;
                const newPhi = phi + (Math.random() - 0.5) * Math.PI / depth;
                
                const nx = outRadius * Math.sin(newPhi) * Math.cos(newTheta);
                const ny = outRadius * Math.cos(newPhi);
                const nz = outRadius * Math.sin(newPhi) * Math.sin(newTheta);
                
                // Edge
                const dist = Math.sqrt(Math.pow(nx-x,2) + Math.pow(ny-y,2) + Math.pow(nz-z,2));
                const edgeGeo = new THREE.CylinderGeometry(0.02, 0.02, dist, 4);
                const edge = new THREE.Mesh(edgeGeo, edgeMat);
                
                // Orient edge
                const midX = (x + nx) / 2;
                const midY = (y + ny) / 2;
                const midZ = (z + nz) / 2;
                edge.position.set(midX, midY, midZ);
                edge.lookAt(nx, ny, nz);
                edge.rotateX(Math.PI / 2);
                
                tensorGroup.add(edge);
                
                buildTensorTree(depth + 1, maxDepth, outRadius, newTheta, newPhi);
            }
        }
    }
    
    // Seed the MERA network from 6 orthogonal directions
    const seedDirs = [
        [0, 0], [Math.PI/2, 0], [Math.PI, 0], [3*Math.PI/2, 0], [0, Math.PI/2], [0, -Math.PI/2]
    ];
    seedDirs.forEach(dir => buildTensorTree(1, 4, 3, dir[0], dir[1]));
    
    bulkGroup.add(tensorGroup);

    // -- String Theory Branes / Calabi-Yau Manifold Projection --
    // We create a parametric geometry to simulate the wrapped dimensions
    const cyGroup = new THREE.Group();
    const cyMat = new THREE.MeshStandardMaterial({ color: 0xff00ff, wireframe: true, side: THREE.DoubleSide, emissive: 0x550055 });
    
    // Parametric equation approximation of a 2D slice of a Calabi-Yau quintic
    function calabiYau(u, v, target) {
        const uPI = u * Math.PI * 2;
        const vPI = v * Math.PI * 2;
        const n = 3; // symmetry fold
        
        // Complex trigonometric mappings to simulate the manifold
        const r = Math.cos(n * uPI) + 2;
        const x = r * Math.cos(vPI) * Math.cos(uPI);
        const y = r * Math.sin(vPI);
        const z = r * Math.cos(vPI) * Math.sin(uPI);
        
        // Introduce some exotic twisting
        const twist = Math.sin(vPI * 2) * 0.5;
        
        target.set(x + twist, y, z - twist).multiplyScalar(0.8);
    }
    
    const cyGeo = new THREE.ParametricGeometry(calabiYau, 60, 60);
    const cyMesh = new THREE.Mesh(cyGeo, cyMat);
    cyGroup.add(cyMesh);
    cyGroup.position.set(5, 5, -5); // Offset from black hole
    bulkGroup.add(cyGroup);

    gimbalGroup.add(bulkGroup);
    projectorGroup.add(gimbalGroup);
    group.add(projectorGroup);

    // =========================================================================
    // 4. ANIMATION LOGIC
    // =========================================================================
    
    updaters.push((time, speed) => {
        elapsedTime += speed * 0.01;
        
        // Update Shaders
        boundaryUniforms.uTime.value = elapsedTime;
        bhUniforms.uTime.value = elapsedTime;

        // Drive Mechanics
        const wheelRotationSpeed = speed * 0.05;
        wheels.forEach((w, idx) => {
            // Rotate wheels
            w.pivot.rotation.z -= wheelRotationSpeed;
            // Compress suspension (Sine wave over terrain)
            const terrainOffset = Math.sin(elapsedTime * 2.0 + idx) * 0.5;
            w.assembly.position.y = w.origY + terrainOffset;
            w.shockInner.position.y = 3 - terrainOffset * 0.5;
        });

        // Gimbal Mechanics
        ringOuter.rotation.x = Math.sin(elapsedTime * 0.5) * 0.5;
        ringOuter.rotation.z = elapsedTime * 0.2;
        ringInner.rotation.y = elapsedTime * 0.3;
        ringInner.rotation.x = Math.cos(elapsedTime * 0.4) * 0.5;

        // Bulk Dynamics
        galaxyPoints.rotation.y = elapsedTime * 0.1;
        accretionDisk.rotation.z = -elapsedTime * 1.5;
        tensorGroup.rotation.y = elapsedTime * 0.05;
        tensorGroup.rotation.z = elapsedTime * 0.02;
        
        // Calabi-Yau breathing and spinning
        cyGroup.rotation.x = elapsedTime * 0.3;
        cyGroup.rotation.y = elapsedTime * 0.4;
        const scaleFreq = Math.sin(elapsedTime) * 0.2 + 1.0;
        cyGroup.scale.set(scaleFreq, scaleFreq, scaleFreq);
        
        // Boundary fluctuations
        boundarySphere.rotation.y = elapsedTime * 0.05;
    });

    const animate = (time, speed, activeMeshes) => {
        updaters.forEach(fn => fn(time, speed));
    };

    // =========================================================================
    // 5. PARTS METADATA
    // =========================================================================

    parts.push({
        name: 'HeavyIndustrialChassis',
        description: 'Massive extruded steel frame providing the mobile base for the universal projector. Withstands immense gravitational anomalies.',
        material: 'darkSteel, steel',
        function: 'Structural integrity and terrestrial mobility.',
        assemblyOrder: 1,
        connections: ['HydraulicSuspensionSystem', 'OperatorCabin', 'ExhaustSystem', 'ProjectorTurretBase'],
        failureEffect: 'Chassis bending under extreme localized gravity, rendering mobility impossible.',
        cascadeFailures: ['ProjectorTurretBase', 'HolographicBoundarySphere'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -20, z: 0 }
    });

    parts.push({
        name: 'HydraulicSuspensionSystem',
        description: 'Eight-point independent dual-cylinder hydraulic suspension array. Cushions the quantum matrix from terrestrial shocks.',
        material: 'darkSteel, chrome',
        function: 'Terrain adaptation and payload stabilization.',
        assemblyOrder: 2,
        connections: ['HeavyIndustrialChassis', 'FrontLeftWheelAssembly', 'FrontRightWheelAssembly', 'RearLeftWheelAssembly', 'RearRightWheelAssembly'],
        failureEffect: 'Severe vibrations propagating to the CFT boundary, causing holographic decoherence.',
        cascadeFailures: ['HolographicBoundarySphere', 'TensorNetworkMatrix'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -30, y: -10, z: 0 }
    });

    parts.push({
        name: 'AllTerrainTractionWheels',
        description: 'Eight immense torus-geometry tires, each fitted with 72 massive box-geometry lugs for uncompromising grip.',
        material: 'rubber, chrome, steel',
        function: 'Locomotion across extreme environments.',
        assemblyOrder: 3,
        connections: ['HydraulicSuspensionSystem'],
        failureEffect: 'Loss of mobility; localized immobility during critical cosmic deployment.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -50, y: -20, z: 50 }
    });

    parts.push({
        name: 'OperatorCabin',
        description: 'Shielded command module with tinted anti-radiation glass, twin-joystick array, and real-time spacetime telemetry screens.',
        material: 'steel, tinted glass, plastic',
        function: 'Human-machine interface for navigating and tuning the bulk universe.',
        assemblyOrder: 4,
        connections: ['HeavyIndustrialChassis', 'ControlInterface'],
        failureEffect: 'Lethal exposure to Hawking radiation; loss of manual tuning capability.',
        cascadeFailures: ['ControlInterface'],
        originalPosition: { x: 20, y: 12, z: 0 },
        explodedPosition: { x: 60, y: 30, z: 0 }
    });

    parts.push({
        name: 'QuantumEntanglementCoils',
        description: 'Helical copper and chrome conduits wrapped around the gimbal rings, flooding the projector with localized entanglement field vectors.',
        material: 'chrome, copper, neon emissive',
        function: 'Powers the AdS/CFT dictionary translation mechanism.',
        assemblyOrder: 5,
        connections: ['ProjectorTurretBase', 'HolographicBoundarySphere'],
        failureEffect: 'Information loss; the bulk universe disconnects from the boundary map.',
        cascadeFailures: ['TensorNetworkMatrix', 'BulkGalacticProjections'],
        originalPosition: { x: -10, y: 50, z: 0 },
        explodedPosition: { x: -10, y: 80, z: 30 }
    });

    parts.push({
        name: 'HolographicBoundarySphere',
        description: 'The 2D CFT surface. A glowing, mathematically dense fractal membrane where all information of the 3D bulk is perfectly encoded.',
        material: 'Custom ShaderMaterial (Cyan/Violet FBM)',
        function: 'Acts as the conformal field theory boundary, generating the interior AdS space via holography.',
        assemblyOrder: 6,
        connections: ['QuantumEntanglementCoils', 'TensorNetworkMatrix'],
        failureEffect: 'Catastrophic firewall event; the boundary collapses, instantly annihilating the bulk.',
        cascadeFailures: ['TensorNetworkMatrix', 'BulkGalacticProjections', 'CentralBlackHoleSingularity', 'CalabiYauManifoldCore'],
        originalPosition: { x: -10, y: 50, z: 0 },
        explodedPosition: { x: -10, y: 120, z: 0 }
    });

    parts.push({
        name: 'TensorNetworkMatrix',
        description: 'A massive interconnected fractal branching structure (MERA) physically manifesting the entanglement patterns that weave the fabric of emergent spacetime.',
        material: 'Green Emissive Nodes, Wireframe Edges',
        function: 'Translates quantum entanglement from the boundary into smooth bulk geometries.',
        assemblyOrder: 7,
        connections: ['HolographicBoundarySphere', 'BulkGalacticProjections'],
        failureEffect: 'Spacetime tears; the bulk dissolves into a disorganized soup of disconnected quantum states.',
        cascadeFailures: ['BulkGalacticProjections', 'CentralBlackHoleSingularity'],
        originalPosition: { x: -10, y: 50, z: 0 },
        explodedPosition: { x: 30, y: 90, z: -40 }
    });

    parts.push({
        name: 'BulkGalacticProjections',
        description: 'A swirling maelstrom of 20,000 highly detailed particle systems forming spiral arms, nebulae, and stellar clusters within the bulk.',
        material: 'PointsMaterial (Vertex Colors, Additive Blending)',
        function: 'Simulates the macroscopic classical gravitational phenomena emerging from the quantum boundary.',
        assemblyOrder: 8,
        connections: ['TensorNetworkMatrix', 'CentralBlackHoleSingularity'],
        failureEffect: 'Galactic orbits decay; stars undergo premature heat death or collapse into the center.',
        cascadeFailures: [],
        originalPosition: { x: -10, y: 50, z: 0 },
        explodedPosition: { x: -50, y: 60, z: 50 }
    });

    parts.push({
        name: 'CentralBlackHoleSingularity',
        description: 'A gravitationally infinite core featuring a pulsating event horizon shader, Hawking radiation fringes, and an intensely glowing accretion disk.',
        material: 'Custom ShaderMaterial (Black/Orange), Emissive Torus',
        function: 'Tests the Bekenstein-Hawking entropy limits and resolves the information paradox within the simulation.',
        assemblyOrder: 9,
        connections: ['BulkGalacticProjections', 'CalabiYauManifoldCore'],
        failureEffect: 'Information paradox violation; simulation crashes due to infinite density divide-by-zero errors.',
        cascadeFailures: ['BulkGalacticProjections'],
        originalPosition: { x: -10, y: 50, z: 0 },
        explodedPosition: { x: 0, y: 50, z: 0 }
    });

    parts.push({
        name: 'CalabiYauManifoldCore',
        description: 'A 3D projection of a 6-dimensional wrapped compactified space. Twists and breathes constantly, hiding the extra dimensions of string theory.',
        material: 'Magenta Wireframe Emissive',
        function: 'Provides the underlying string vibrations that dictate the physical constants of the simulated universe.',
        assemblyOrder: 10,
        connections: ['CentralBlackHoleSingularity'],
        failureEffect: 'Constants of nature spontaneously shift; fundamental forces unify improperly, shredding atomic bonds.',
        cascadeFailures: ['BulkGalacticProjections'],
        originalPosition: { x: -5, y: 55, z: -5 },
        explodedPosition: { x: -30, y: 80, z: -30 }
    });

    // =========================================================================
    // 6. EXTREMELY DIFFICULT PhD-LEVEL QUIZ QUESTIONS
    // =========================================================================

    const quizQuestions = [
        {
            question: "The AdS/CFT correspondence conjectures an exact equivalence between a theory of quantum gravity in Anti-de Sitter (AdS) space and a Conformal Field Theory (CFT) on its boundary. Which of the following best describes how the Bekenstein-Hawking entropy of a black hole in the AdS bulk is encoded in the boundary CFT?",
            options: [
                "It is proportional to the number of localized excitations in the CFT vacuum.",
                "It is exactly equivalent to the entanglement entropy of a thermal mixed state in the boundary CFT, famously computed via the Ryu-Takayanagi formula.",
                "It is derived purely from the anomalous dimension of the primary operators acting at the infinite boundary.",
                "It strictly matches the degrees of freedom of open strings attached to D-branes localized at the exact center of the bulk."
            ],
            correctAnswer: 1,
            explanation: "The Ryu-Takayanagi formula beautifully links the geometric area of minimal surfaces in the AdS bulk to the quantum entanglement entropy of subregions in the CFT. For a black hole, the minimal surface wraps the event horizon, perfectly matching the Bekenstein-Hawking entropy to the thermal entanglement entropy of the boundary state."
        },
        {
            question: "In the context of the holographic principle and bulk reconstruction, what vital role does the HKLL (Hamilton-Kabat-Lifschitz-Lowe) procedure play?",
            options: [
                "It proves that string theory is the only valid theory of quantum gravity.",
                "It maps the renormalization group flow of the boundary theory to the radial coordinate of the AdS space.",
                "It provides a rigorous mathematical method to reconstruct local bulk operators acting on the AdS spacetime using non-local, smeared operators smeared over space and time in the boundary CFT.",
                "It defines the topological constraints required for Calabi-Yau manifold compactification in 11-dimensional M-theory."
            ],
            correctAnswer: 2,
            explanation: "The HKLL procedure is a fundamental tool for 'bulk reconstruction.' It shows how a local field operator deep inside the AdS bulk can be represented as an integral (a 'smearing') of operators localized only on the boundary CFT, demonstrating precisely how the hologram projects inward."
        },
        {
            question: "Consider a purely gravitational bulk described by classical Einstein gravity (with no stringy effects). According to the AdS/CFT dictionary, what specific limit does this correspond to in the dual SU(N) gauge theory?",
            options: [
                "Weak 't Hooft coupling (λ -> 0) and small N limit.",
                "Strong 't Hooft coupling (λ -> ∞) and large N limit (N -> ∞).",
                "Strong 't Hooft coupling (λ -> ∞) but N exactly equal to 4.",
                "Weak 't Hooft coupling (λ -> 0) and large N limit (N -> ∞)."
            ],
            correctAnswer: 1,
            explanation: "To suppress quantum gravity corrections (making gravity classical), we need the large N limit (Planck length goes to zero). To suppress stringy corrections (making the strings behave like point particles, hence Einstein gravity), we need the strong 't Hooft coupling limit (λ -> ∞). Therefore, classical Einstein gravity maps to the strongly coupled, large N limit of the CFT."
        },
        {
            question: "According to the ER=EPR conjecture within the holographic framework, what is the geometric equivalent in the bulk of two maximally entangled quantum systems on the boundary?",
            options: [
                "A stable Calabi-Yau manifold connecting their respective branes.",
                "A shared, non-traversable Einstein-Rosen bridge (a wormhole) connecting the two regions in the bulk spacetime.",
                "A repulsive de Sitter space expansion pushing the two systems apart.",
                "A cosmic string vibrating with a tachyonic frequency."
            ],
            correctAnswer: 1,
            explanation: "The ER=EPR conjecture, proposed by Maldacena and Susskind, suggests that quantum entanglement (EPR paradox) and wormholes (Einstein-Rosen bridges) are two descriptions of the exact same underlying physical reality. Entangled particles are connected by microscopic wormholes."
        },
        {
            question: "When applying AdS/CFT to resolve the black hole information paradox, what is the significance of the 'Page curve'?",
            options: [
                "It plots the rate of Hawking radiation emission, showing an exponential increase followed by a sudden stop.",
                "It describes the trajectory of an infalling observer as they cross the event horizon without experiencing a 'firewall'.",
                "It tracks the von Neumann entropy of the Hawking radiation over time; it initially rises as the black hole evaporates, but must eventually turn over and decrease to zero to conserve quantum information.",
                "It charts the expansion rate of the AdS space boundary as bulk matter is consumed."
            ],
            correctAnswer: 2,
            explanation: "Don Page demonstrated that if information is preserved (unitary evolution), the entanglement entropy of the emitted Hawking radiation cannot simply grow forever. It must rise initially, hit a maximum halfway through evaporation (the Page time), and then drop to zero as the final bits of information are radiated away. Recent breakthroughs in holography (using quantum extremal islands) have successfully reproduced this curve."
        }
    ];

    const description = "The Holographic Universe Projector (Ultra God Tier) is an immensely complex synthesis of heavy industrial engineering and theoretical physics. Mounted on a massive 8-wheeled off-road platform complete with independent hydraulic suspensions and an operator cabin, the projector utilizes an immense toroidal gimbal array to stabilize a 2D Conformal Field Theory (CFT) boundary sphere. This glowing, fractal-encoded membrane perfectly projects a 3D Anti-de Sitter (AdS) bulk universe within its interior. Inside, quantum entanglement geometrically manifests as a MERA tensor network, projecting classical gravitational phenomena such as 20,000-particle galaxies, a pulsating central black hole with an accretion disk, and a hyper-dimensional Calabi-Yau manifold core.";

    return { group, parts, description, quizQuestions, animate };
}
