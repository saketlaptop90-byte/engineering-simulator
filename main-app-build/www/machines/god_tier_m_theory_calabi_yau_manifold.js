import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const description = "Ultra God Tier M-Theory Calabi-Yau Manifold Extruder Crawler. This colossal mobile platform un-furls the 6 hidden spatial dimensions of string theory into macroscopic 3D space. It is equipped with an 8-wheel hyper-tread chassis, 12 multi-stage extradimensional hydraulic energy pumps, a 6-stage nested stabilization gimbal gyroscope, and a central core containing a true mathematically-projected 6D Calabi-Yau manifold contained within a warped phase-aligned quantum sphere.";

    // --------------------------------------------------------
    // Custom High-Tech Materials
    // --------------------------------------------------------
    const neonPurple = new THREE.MeshStandardMaterial({ 
        color: 0xaa22ff, 
        emissive: 0x8a2be2, 
        emissiveIntensity: 3.5, 
        transparent: true,
        opacity: 0.9,
        wireframe: false 
    });
    
    const energyCyan = new THREE.MeshStandardMaterial({ 
        color: 0x00ffff, 
        emissive: 0x00ffff, 
        emissiveIntensity: 4.0 
    });

    const manifoldMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 1.0,
        roughness: 0.1,
        transmission: 0.9,
        thickness: 1.5,
        clearcoat: 1.0,
        side: THREE.DoubleSide,
        emissive: 0x330066,
        emissiveIntensity: 0.8
    });

    const manifoldWireMat = new THREE.MeshBasicMaterial({ 
        color: 0xff00ff, 
        wireframe: true, 
        transparent: true, 
        opacity: 0.25 
    });

    const containmentMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0.0 }
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            uniform float time;

            // Ashima's 3D Simplex Noise
            vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
            vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
            float snoise(vec3 v) { 
                const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
                const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
                vec3 i  = floor(v + dot(v, C.yyy) );
                vec3 x0 = v - i + dot(i, C.xxx) ;
                vec3 g = step(x0.yzx, x0.xyz);
                vec3 l = 1.0 - g;
                vec3 i1 = min( g.xyz, l.zxy );
                vec3 i2 = max( g.xyz, l.zxy );
                vec3 x1 = x0 - i1 + C.xxx;
                vec3 x2 = x0 - i2 + C.yyy;
                vec3 x3 = x0 - D.yyy;
                i = mod289(i); 
                vec4 p = permute( permute( permute( 
                           i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                         + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                         + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
                float n_ = 0.142857142857; 
                vec3  ns = n_ * D.wyz - D.xzx;
                vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  
                vec4 x_ = floor(j * ns.z);
                vec4 y_ = floor(j - 7.0 * x_ );    
                vec4 x = x_ *ns.x + ns.yyyy;
                vec4 y = y_ *ns.x + ns.yyyy;
                vec4 h = 1.0 - abs(x) - abs(y);
                vec4 b0 = vec4( x.xy, y.xy );
                vec4 b1 = vec4( x.zw, y.zw );
                vec4 s0 = floor(b0)*2.0 + 1.0;
                vec4 s1 = floor(b1)*2.0 + 1.0;
                vec4 sh = -step(h, vec4(0.0));
                vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
                vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
                vec3 p0 = vec3(a0.xy,h.x);
                vec3 p1 = vec3(a0.zw,h.y);
                vec3 p2 = vec3(a1.xy,h.z);
                vec3 p3 = vec3(a1.zw,h.w);
                vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
                p0 *= norm.x;
                p1 *= norm.y;
                p2 *= norm.z;
                p3 *= norm.w;
                vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
                m = m * m;
                return 105.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
            }

            void main() {
                vUv = uv;
                vNormal = normalize(normalMatrix * normal);
                vec3 p = position;
                
                // Extremely complex spatial warping
                float noiseVal = snoise(p * 0.015 + time * 0.8);
                p += normal * noiseVal * 35.0;
                
                vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
                vViewPosition = -mvPosition.xyz;
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            uniform float time;
            void main() {
                vec3 viewDir = normalize(vViewPosition);
                float fresnel = dot(viewDir, vNormal);
                fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
                fresnel = pow(fresnel, 2.5);
                
                // Hexagonal hyper-grid phase pattern
                vec2 p = vUv * 60.0;
                vec2 q = vec2(p.x * 1.1547, p.y + p.x * 0.5773);
                vec2 grid = abs(fract(q) - 0.5);
                float hex = max(grid.x, grid.y);
                float line = smoothstep(0.38, 0.42, hex);
                
                vec3 baseColor = vec3(0.05, 0.0, 0.15);
                vec3 glowColor = vec3(0.9, 0.2, 1.0) * fresnel * 2.5;
                vec3 lineColor = vec3(0.0, 1.0, 1.0) * line * (0.6 + 0.4 * sin(time * 8.0 + vUv.y * 30.0));
                
                float alpha = 0.4 + 0.5 * fresnel + line * 0.5;
                gl_FragColor = vec4(baseColor + glowColor + lineColor, min(alpha, 1.0));
            }
        `,
        transparent: true,
        side: THREE.DoubleSide
    });

    // --------------------------------------------------------
    // 6D Mathematics Engine
    // --------------------------------------------------------
    class Vector6 {
        constructor(x1=0, x2=0, x3=0, x4=0, x5=0, x6=0) {
            this.x = [x1, x2, x3, x4, x5, x6];
        }
        set(x1, x2, x3, x4, x5, x6) {
            this.x[0] = x1; this.x[1] = x2; this.x[2] = x3;
            this.x[3] = x4; this.x[4] = x5; this.x[5] = x6;
            return this;
        }
        clone() { return new Vector6(this.x[0], this.x[1], this.x[2], this.x[3], this.x[4], this.x[5]); }
    }

    class Matrix6 {
        constructor() {
            this.elements = new Float32Array(36);
            this.identity();
        }
        identity() {
            for(let i=0; i<36; i++) {
                this.elements[i] = (i % 7 === 0) ? 1.0 : 0.0;
            }
            return this;
        }
        makeRotation(i, j, theta) {
            this.identity();
            const c = Math.cos(theta);
            const s = Math.sin(theta);
            this.elements[i * 6 + i] = c;
            this.elements[i * 6 + j] = -s;
            this.elements[j * 6 + i] = s;
            this.elements[j * 6 + j] = c;
            return this;
        }
        multiply(b) {
            const ae = this.elements;
            const be = b.elements;
            const te = new Float32Array(36);
            for(let r = 0; r < 6; r++) {
                for(let c = 0; c < 6; c++) {
                    let sum = 0;
                    for(let k = 0; k < 6; k++) {
                        sum += ae[r * 6 + k] * be[k * 6 + c];
                    }
                    te[r * 6 + c] = sum;
                }
            }
            this.elements = te;
            return this;
        }
    }

    // --------------------------------------------------------
    // Geometry Generation: 6D Calabi-Yau Manifold
    // --------------------------------------------------------
    const U_SEGMENTS = 100;
    const V_SEGMENTS = 100;
    const vertexCount = U_SEGMENTS * V_SEGMENTS;
    const rawVertices6D = new Float32Array(vertexCount * 6);
    
    let vIdx = 0;
    for(let u = 0; u < U_SEGMENTS; u++) {
        for(let v = 0; v < V_SEGMENTS; v++) {
            const u_val = (u / (U_SEGMENTS - 1)) * Math.PI * 2;
            const v_val = (v / (V_SEGMENTS - 1)) * Math.PI * 2;
            
            // Complex parametric equations embedding a 2-manifold in 6D
            rawVertices6D[vIdx++] = Math.cos(u_val) * Math.sin(v_val) * (1.5 + 0.8 * Math.cos(3*u_val));
            rawVertices6D[vIdx++] = Math.sin(u_val) * Math.cos(v_val) * (1.5 + 0.8 * Math.sin(3*v_val));
            rawVertices6D[vIdx++] = Math.cos(u_val + v_val) * Math.sin(2*u_val) * 1.5;
            rawVertices6D[vIdx++] = Math.sin(u_val - v_val) * Math.cos(2*v_val) * 1.5;
            rawVertices6D[vIdx++] = Math.cos(4*u_val) * Math.cos(4*v_val) * 1.2;
            rawVertices6D[vIdx++] = Math.sin(5*u_val) * Math.sin(5*v_val) * 1.2;
        }
    }

    const manifoldIndices = [];
    for(let u = 0; u < U_SEGMENTS - 1; u++) {
        for(let v = 0; v < V_SEGMENTS - 1; v++) {
            const a = u * V_SEGMENTS + v;
            const b = u * V_SEGMENTS + (v + 1);
            const c = (u + 1) * V_SEGMENTS + v;
            const d = (u + 1) * V_SEGMENTS + (v + 1);
            manifoldIndices.push(a, b, c);
            manifoldIndices.push(c, b, d);
        }
    }

    const manifoldGeom = new THREE.BufferGeometry();
    manifoldGeom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertexCount * 3), 3));
    
    const manifoldUvs = new Float32Array(vertexCount * 2);
    let uvIdx = 0;
    for(let u = 0; u < U_SEGMENTS; u++) {
        for(let v = 0; v < V_SEGMENTS; v++) {
            manifoldUvs[uvIdx++] = u / (U_SEGMENTS - 1);
            manifoldUvs[uvIdx++] = v / (V_SEGMENTS - 1);
        }
    }
    manifoldGeom.setAttribute('uv', new THREE.BufferAttribute(manifoldUvs, 2));
    manifoldGeom.setIndex(manifoldIndices);
    manifoldGeom.computeVertexNormals();

    const manifoldMesh = new THREE.Mesh(manifoldGeom, manifoldMaterial);
    const wireMesh = new THREE.Mesh(manifoldGeom, manifoldWireMat);
    manifoldMesh.add(wireMesh);
    manifoldMesh.position.y = 200; // Center of the core
    group.add(manifoldMesh);

    // --------------------------------------------------------
    // Geometry Generation: Warp Containment Field
    // --------------------------------------------------------
    const containmentGeom = new THREE.SphereGeometry(180, 128, 128);
    const containmentMesh = new THREE.Mesh(containmentGeom, containmentMaterial);
    containmentMesh.position.y = 200;
    group.add(containmentMesh);

    // --------------------------------------------------------
    // Crawler Main Chassis
    // --------------------------------------------------------
    const chassisGroup = new THREE.Group();
    group.add(chassisGroup);

    // Massive central structural block
    const chassisBodyGeom = new THREE.BoxGeometry(320, 60, 640);
    const chassisBody = new THREE.Mesh(chassisBodyGeom, darkSteel);
    chassisBody.position.y = 30;
    chassisGroup.add(chassisBody);

    // Side walkways
    const walkwayGeom = new THREE.BoxGeometry(380, 8, 620);
    const walkway = new THREE.Mesh(walkwayGeom, steel);
    walkway.position.y = 60;
    chassisGroup.add(walkway);

    // Safety Railings (Hundreds of cylinders)
    const railGeom = new THREE.CylinderGeometry(1.5, 1.5, 620, 8);
    railGeom.rotateX(Math.PI / 2);
    
    const leftRail = new THREE.Mesh(railGeom, aluminum);
    leftRail.position.set(-185, 80, 0);
    chassisGroup.add(leftRail);
    
    const rightRail = new THREE.Mesh(railGeom, aluminum);
    rightRail.position.set(185, 80, 0);
    chassisGroup.add(rightRail);

    const postGeom = new THREE.CylinderGeometry(1.5, 1.5, 20, 8);
    for(let i=0; i<=20; i++) {
        const zPos = -310 + i * 31;
        
        const lPost = new THREE.Mesh(postGeom, aluminum);
        lPost.position.set(-185, 70, zPos);
        chassisGroup.add(lPost);
        
        const rPost = new THREE.Mesh(postGeom, aluminum);
        rPost.position.set(185, 70, zPos);
        chassisGroup.add(rPost);
    }

    // Front/Rear Bumpers with glowing warning lights
    const bumperGeom = new THREE.BoxGeometry(340, 20, 20);
    const fBumper = new THREE.Mesh(bumperGeom, darkSteel);
    fBumper.position.set(0, 30, 330);
    chassisGroup.add(fBumper);
    
    const rBumper = new THREE.Mesh(bumperGeom, darkSteel);
    rBumper.position.set(0, 30, -330);
    chassisGroup.add(rBumper);

    // --------------------------------------------------------
    // Operator Cabin
    // --------------------------------------------------------
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(0, 64, 250);
    chassisGroup.add(cabinGroup);

    const cabinBodyGeom = new THREE.BoxGeometry(140, 90, 100);
    const cabinBody = new THREE.Mesh(cabinBodyGeom, darkSteel);
    cabinBody.position.y = 45;
    cabinGroup.add(cabinBody);

    // Tinted windshields
    const glassGeomF = new THREE.PlaneGeometry(120, 50);
    const glassMeshF = new THREE.Mesh(glassGeomF, tinted);
    glassMeshF.position.set(0, 50, 51);
    cabinGroup.add(glassMeshF);

    // Steering Torus & Control Yoke
    const swGeom = new THREE.TorusGeometry(12, 2, 16, 32);
    const swMesh = new THREE.Mesh(swGeom, plastic);
    swMesh.rotation.x = Math.PI / 4;
    swMesh.position.set(-30, 30, 30);
    cabinGroup.add(swMesh);

    // Complex glowing control panels inside
    const screenGeom = new THREE.PlaneGeometry(40, 25);
    const screenMesh = new THREE.Mesh(screenGeom, energyCyan);
    screenMesh.position.set(30, 35, 49);
    screenMesh.rotation.y = -Math.PI / 6;
    cabinGroup.add(screenMesh);

    // Roof Radar array
    const radarGroup = new THREE.Group();
    radarGroup.position.set(0, 90, 0);
    
    const dishGeom = new THREE.SphereGeometry(20, 32, 16, 0, Math.PI * 2, 0, Math.PI / 3);
    const dish = new THREE.Mesh(dishGeom, steel);
    dish.rotation.x = -Math.PI / 2;
    dish.position.y = 10;
    radarGroup.add(dish);
    
    const antennaGeom = new THREE.CylinderGeometry(0.5, 0.5, 40);
    const antenna = new THREE.Mesh(antennaGeom, aluminum);
    antenna.position.set(0, 30, 0);
    radarGroup.add(antenna);
    
    cabinGroup.add(radarGroup);

    // --------------------------------------------------------
    // Exotic Matter Exhaust Stacks
    // --------------------------------------------------------
    const exhaustGroup = new THREE.Group();
    exhaustGroup.position.set(0, 64, -280);
    chassisGroup.add(exhaustGroup);

    for(let i=0; i<4; i++) {
        const stackGeom = new THREE.CylinderGeometry(18, 18, 160, 16);
        const stack = new THREE.Mesh(stackGeom, darkSteel);
        stack.position.set(-105 + i*70, 80, 0);
        
        const glowGeom = new THREE.CylinderGeometry(17, 17, 162, 16);
        const glow = new THREE.Mesh(glowGeom, neonPurple);
        glow.position.copy(stack.position);
        
        // Vent flaps on top
        const flapGeom = new THREE.BoxGeometry(40, 5, 2);
        const flap = new THREE.Mesh(flapGeom, steel);
        flap.position.set(-105 + i*70, 162, 0);
        flap.rotation.x = Math.PI / 4;
        
        exhaustGroup.add(stack);
        exhaustGroup.add(glow);
        exhaustGroup.add(flap);
    }

    // --------------------------------------------------------
    // Wheel and Suspension Generation
    // --------------------------------------------------------
    const wheels = [];
    const wheelPositions = [
        [-210, -220], [-210, -73], [-210, 73], [-210, 220],
        [ 210, -220], [ 210, -73], [ 210, 73], [ 210, 220]
    ];

    function createWheel(x, z, sideMultiplier) {
        const wGroup = new THREE.Group();
        wGroup.position.set(x, -80, z);

        // Cylinder Rim
        const rimGeom = new THREE.CylinderGeometry(50, 50, 40, 32);
        const rim = new THREE.Mesh(rimGeom, chrome);
        rim.rotation.z = Math.PI / 2;
        wGroup.add(rim);

        // Complex Spoke Array (24 spokes per wheel)
        for(let i=0; i<24; i++) {
            const angle = (i / 24) * Math.PI * 2;
            const spokeGeom = new THREE.CylinderGeometry(2.5, 2.5, 50, 8);
            const spoke = new THREE.Mesh(spokeGeom, steel);
            spoke.rotation.x = angle;
            spoke.position.y = Math.cos(angle) * 25;
            spoke.position.z = Math.sin(angle) * 25;
            wGroup.add(spoke);
        }

        // Torus Tire
        const tireGeom = new THREE.TorusGeometry(70, 25, 32, 64);
        const tire = new THREE.Mesh(tireGeom, rubber);
        tire.rotation.y = Math.PI / 2;
        wGroup.add(tire);

        // Hyper-Treads (Aggressive off-road lugs)
        const treadsGroup = new THREE.Group();
        const treadGeom = new THREE.BoxGeometry(22, 10, 12);
        
        // 120 pairs of lugs per wheel
        for(let i=0; i<120; i++) {
            const angle = (i / 120) * Math.PI * 2;
            
            const leftLug = new THREE.Mesh(treadGeom, rubber);
            leftLug.position.set(0, 95, 0);
            leftLug.rotation.y = 0.45; // Chevron angle
            const pLeft = new THREE.Group();
            pLeft.rotation.x = angle;
            pLeft.add(leftLug);
            leftLug.position.x = -15;

            const rightLug = new THREE.Mesh(treadGeom, rubber);
            rightLug.position.set(0, 95, 0);
            rightLug.rotation.y = -0.45;
            const pRight = new THREE.Group();
            pRight.rotation.x = angle;
            pRight.add(rightLug);
            rightLug.position.x = 15;

            treadsGroup.add(pLeft);
            treadsGroup.add(pRight);
        }
        wGroup.add(treadsGroup);

        // Hydraulic Suspension Piston
        const pistonGroup = new THREE.Group();
        pistonGroup.position.set(x, -20, z); // Midway between chassis and wheel
        
        const outerGeom = new THREE.CylinderGeometry(12, 12, 60, 16);
        const outer = new THREE.Mesh(outerGeom, darkSteel);
        outer.position.y = 20;
        pistonGroup.add(outer);
        
        const innerGeom = new THREE.CylinderGeometry(8, 8, 80, 16);
        const inner = new THREE.Mesh(innerGeom, chrome);
        inner.position.y = -20;
        pistonGroup.add(inner);

        // Heavy-duty control arm to chassis
        const armGeom = new THREE.BoxGeometry(40, 10, 20);
        const arm = new THREE.Mesh(armGeom, steel);
        arm.position.set(sideMultiplier > 0 ? 30 : -30, 20, 0);
        pistonGroup.add(arm);

        return { wGroup, treadsGroup, pistonGroup, innerPiston: inner };
    }

    wheelPositions.forEach((pos) => {
        const sideMultiplier = pos[0] > 0 ? -1 : 1;
        const { wGroup, treadsGroup, pistonGroup, innerPiston } = createWheel(pos[0], pos[1], sideMultiplier);
        group.add(wGroup);
        group.add(pistonGroup);
        wheels.push({ wGroup, innerPiston, x: pos[0], z: pos[1], offsetPhase: pos[1]*0.05 + pos[0]*0.02 });
    });

    // --------------------------------------------------------
    // Nested 6-Stage Stabilization Gimbal Gyroscope
    // --------------------------------------------------------
    const gimbalGroup = new THREE.Group();
    gimbalGroup.position.y = 200; // Centered on manifold
    group.add(gimbalGroup);

    const gimbalRings = [];
    for(let i=0; i<6; i++) {
        const rGroup = new THREE.Group();
        const tGeom = new THREE.TorusGeometry(190 + i*35, 6, 32, 128);
        const tMesh = new THREE.Mesh(tGeom, darkSteel);
        rGroup.add(tMesh);
        
        // Add 36 glowing quantum phase aligners around each ring
        for(let j=0; j<36; j++) {
            const nodeGeom = new THREE.BoxGeometry(15, 15, 25);
            const nodeMesh = new THREE.Mesh(nodeGeom, energyCyan);
            const angle = (j / 36) * Math.PI * 2;
            const radius = 190 + i*35;
            nodeMesh.position.set(Math.cos(angle)*radius, Math.sin(angle)*radius, 0);
            nodeMesh.rotation.z = angle;
            rGroup.add(nodeMesh);
        }
        
        if (i > 0) {
            gimbalRings[i-1].add(rGroup);
        } else {
            gimbalGroup.add(rGroup);
        }
        gimbalRings.push(rGroup);
    }

    // --------------------------------------------------------
    // 12-Point Radial Energy Injection Towers (Dodecahedral Layout)
    // --------------------------------------------------------
    const towersGroup = new THREE.Group();
    towersGroup.position.y = 64; // Sit on chassis
    group.add(towersGroup);

    for(let i=0; i<12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const radiusBase = 280;
        
        const towerBase = new THREE.Group();
        towerBase.position.set(Math.cos(angle) * radiusBase, 0, Math.sin(angle) * radiusBase);
        
        const padGeom = new THREE.CylinderGeometry(40, 50, 20, 16);
        const pad = new THREE.Mesh(padGeom, darkSteel);
        pad.position.y = 10;
        towerBase.add(pad);
        towersGroup.add(towerBase);

        // Angled Shaft pointing directly at the core (0, 200, 0 in global, or 0, 136, 0 relative to towersGroup)
        const shaftGroup = new THREE.Group();
        shaftGroup.position.set(Math.cos(angle) * radiusBase, 20, Math.sin(angle) * radiusBase);
        
        // lookAt target
        shaftGroup.lookAt(new THREE.Vector3(0, 200 - 64, 0));

        // Shaft cylinder
        const shaftGeom = new THREE.CylinderGeometry(15, 20, 220, 16);
        shaftGeom.rotateX(Math.PI / 2); // Align cylinder height along Z-axis for lookAt
        const shaft = new THREE.Mesh(shaftGeom, steel);
        shaft.position.set(0, 0, 110); // Offset to extend outwards from base
        shaftGroup.add(shaft);

        // Glowing Accelerator Rings along the shaft
        for(let k=1; k<=6; k++) {
            const sRingGeom = new THREE.TorusGeometry(26, 4, 16, 32);
            const sRing = new THREE.Mesh(sRingGeom, energyCyan);
            sRing.position.set(0, 0, k * 35 + 10);
            shaftGroup.add(sRing);
        }

        // Support Pistons holding the shaft at angle
        const pGeom = new THREE.CylinderGeometry(6, 6, 120, 8);
        pGeom.rotateX(Math.PI / 2);
        const pMesh = new THREE.Mesh(pGeom, chrome);
        pMesh.position.set(0, -30, 60);
        shaftGroup.add(pMesh);

        towersGroup.add(shaftGroup);
    }

    // --------------------------------------------------------
    // Component Parts Manifest
    // --------------------------------------------------------
    parts.push({
        name: "God-Tier M-Theory Calabi-Yau Core",
        description: "A 6-dimensional compactified spatial manifold mathematically projected into 3D branespace. Modulates vacuum expectation values.",
        material: "Hyper-Transmissive Quantized Glass",
        function: "Vacuum State Compaction/Expansion",
        assemblyOrder: 15,
        connections: ["Containment Sphere", "U-Axis 6D Gimbal"],
        failureEffect: "Spontaneous false vacuum decay locally annihilating 3D space.",
        cascadeFailures: ["Total Brane Collapse", "Gravity Inversion", "Time-Dilation Runaway"],
        originalPosition: {x: 0, y: 200, z: 0},
        explodedPosition: {x: 0, y: 1200, z: 0}
    });

    parts.push({
        name: "Quantum Vacuum Containment Field Sphere",
        description: "A hyper-spatial barrier generating massive phase interference to prevent the Calabi-Yau geometry from fully intersecting local reality.",
        material: "Plasma-Lined Force Screen",
        function: "Dimensional Boundary Enforcement",
        assemblyOrder: 14,
        connections: ["Calabi-Yau Core", "Energy Injection Towers"],
        failureEffect: "Unregulated localized extradimensional spillage causing severe spatial warping.",
        cascadeFailures: ["Core Destabilization", "Gimbal Fracture"],
        originalPosition: {x: 0, y: 200, z: 0},
        explodedPosition: {x: 0, y: 1000, z: 0}
    });

    parts.push({
        name: "U-Axis 6D Stabilizer Gimbal",
        description: "The innermost and smallest stabilization ring, mathematically locked to the 6th spatial dimension axis.",
        material: "Dark Steel with Energy Cyan Phase Nodes",
        function: "6th-Dimensional Gyroscopic Stabilization",
        assemblyOrder: 13,
        connections: ["V-Axis 5D Gimbal", "Calabi-Yau Core"],
        failureEffect: "Manifold drifts along the U-axis causing micro-singularities.",
        cascadeFailures: ["Outer Gimbal Shearing"],
        originalPosition: {x: 0, y: 200, z: 0},
        explodedPosition: {x: 0, y: 800, z: 0}
    });

    parts.push({
        name: "V-Axis 5D Stabilizer Gimbal",
        description: "The 5th dimension stabilization ring.",
        material: "Dark Steel",
        function: "5th-Dimensional Gyroscopic Stabilization",
        assemblyOrder: 12,
        connections: ["W-Axis 4D Gimbal", "U-Axis 6D Gimbal"],
        failureEffect: "Manifold phase shift.",
        cascadeFailures: ["V-Axis Collapse"],
        originalPosition: {x: 0, y: 200, z: 0},
        explodedPosition: {x: 0, y: 700, z: 0}
    });

    parts.push({
        name: "W-Axis 4D Stabilizer Gimbal",
        description: "The 4th dimension stabilization ring.",
        material: "Dark Steel",
        function: "4th-Dimensional Gyroscopic Stabilization",
        assemblyOrder: 11,
        connections: ["Z-Axis 3D Gimbal", "V-Axis 5D Gimbal"],
        failureEffect: "Tesseract-like inversion of local matter.",
        cascadeFailures: ["W-Axis Collapse"],
        originalPosition: {x: 0, y: 200, z: 0},
        explodedPosition: {x: 0, y: 600, z: 0}
    });

    parts.push({
        name: "Z-Axis 3D Stabilizer Gimbal",
        description: "Primary depth stabilization ring for local 3D mapping.",
        material: "Dark Steel",
        function: "3D Depth Gyroscopic Stabilization",
        assemblyOrder: 10,
        connections: ["Y-Axis 2D Gimbal", "W-Axis 4D Gimbal"],
        failureEffect: "Severe localized spatial depth distortion.",
        cascadeFailures: ["Z-Axis Collapse"],
        originalPosition: {x: 0, y: 200, z: 0},
        explodedPosition: {x: 0, y: 500, z: 0}
    });

    parts.push({
        name: "Y-Axis 2D Stabilizer Gimbal",
        description: "Primary vertical stabilization ring.",
        material: "Dark Steel",
        function: "Vertical Gyroscopic Stabilization",
        assemblyOrder: 9,
        connections: ["X-Axis 1D Gimbal", "Z-Axis 3D Gimbal"],
        failureEffect: "Gravity shear along the Y-plane.",
        cascadeFailures: ["Y-Axis Collapse"],
        originalPosition: {x: 0, y: 200, z: 0},
        explodedPosition: {x: 0, y: 400, z: 0}
    });

    parts.push({
        name: "X-Axis 1D Stabilizer Gimbal",
        description: "Massive outermost ring anchoring the entire gyroscopic assembly to the chassis.",
        material: "Dark Steel",
        function: "Horizontal Gyroscopic Stabilization",
        assemblyOrder: 8,
        connections: ["Chassis Foundation", "Y-Axis 2D Gimbal"],
        failureEffect: "Total physical detachment of the manifold core.",
        cascadeFailures: ["Catastrophic Global Structural Failure"],
        originalPosition: {x: 0, y: 200, z: 0},
        explodedPosition: {x: 0, y: 300, z: 0}
    });

    parts.push({
        name: "12-Point Radial Energy Injection Towers",
        description: "Array of 12 massive towers arranged in a projected dodecahedral formation, constantly pumping exotic matter into the core.",
        material: "Steel and Chrome",
        function: "Core Pressurization and Extradimensional Pumping",
        assemblyOrder: 7,
        connections: ["Chassis Foundation", "Containment Sphere"],
        failureEffect: "Energy starvation of the manifold leading to implosion.",
        cascadeFailures: ["Tower Meltdown", "Manifold Collapse"],
        originalPosition: {x: 0, y: 64, z: 0},
        explodedPosition: {x: 400, y: 150, z: 400}
    });

    parts.push({
        name: "Exotic Matter Exhaust Stacks",
        description: "Four massive rear-mounted chimneys venting excess dimensional friction as high-energy plasma.",
        material: "Dark Steel with Neon Plasma Vents",
        function: "Thermal and Dimensional Friction Exhaust",
        assemblyOrder: 6,
        connections: ["Chassis Foundation"],
        failureEffect: "Chassis melting from 6D friction heat buildup.",
        cascadeFailures: ["Chassis Slagging"],
        originalPosition: {x: 0, y: 64, z: -280},
        explodedPosition: {x: 0, y: 150, z: -600}
    });

    parts.push({
        name: "Operator Cabin with Instrumentation",
        description: "A heavily shielded, lead-glass lined control center for the Extruder pilot.",
        material: "Dark Steel and Tinted Quantum Glass",
        function: "Human/Machine Interface and Navigation",
        assemblyOrder: 5,
        connections: ["Chassis Foundation"],
        failureEffect: "Loss of crawler control.",
        cascadeFailures: ["Unintended Dimensional Ramming"],
        originalPosition: {x: 0, y: 64, z: 250},
        explodedPosition: {x: 0, y: 150, z: 600}
    });

    parts.push({
        name: "Mobile Chassis Foundation Platform",
        description: "The immense reinforced structural backbone holding the entire Extruder together.",
        material: "Dark Steel and Aluminum",
        function: "Structural Integrity and Load Bearing",
        assemblyOrder: 4,
        connections: ["Wheels", "Towers", "Cabin", "Exhaust"],
        failureEffect: "Complete structural collapse under the weight of extradimensional geometry.",
        cascadeFailures: ["Total System Disintegration"],
        originalPosition: {x: 0, y: 30, z: 0},
        explodedPosition: {x: 0, y: 0, z: 0}
    });

    parts.push({
        name: "Active Hydraulic Suspension Actuators",
        description: "Massive chrome-plated pistons continuously adjusting ride height across extreme terrain.",
        material: "Chrome and Dark Steel",
        function: "Kinetic Shock Absorption",
        assemblyOrder: 3,
        connections: ["Chassis Foundation", "Wheel Assemblies"],
        failureEffect: "Severe vibration transferring to the delicate manifold core.",
        cascadeFailures: ["Gimbal Misalignment", "Core Destabilization"],
        originalPosition: {x: 0, y: -20, z: 0},
        explodedPosition: {x: 0, y: -100, z: 0}
    });

    parts.push({
        name: "Octa-Drive Hyper-Tread Wheel Assemblies",
        description: "Eight gigantic off-road wheels equipped with heavy rubber chevron lugs for ultimate traction.",
        material: "Rubber, Chrome, and Steel",
        function: "Locomotion and Traction",
        assemblyOrder: 2,
        connections: ["Suspension Actuators"],
        failureEffect: "Immobilization of the Extruder platform.",
        cascadeFailures: ["Mission Failure"],
        originalPosition: {x: 0, y: -80, z: 0},
        explodedPosition: {x: 400, y: -200, z: 400}
    });

    parts.push({
        name: "Wheel Rim Spoke Arrays",
        description: "Heavy-duty cylindrical steel spokes transferring immense torque from the hub to the treads.",
        material: "Steel",
        function: "Torque Transmission",
        assemblyOrder: 1,
        connections: ["Tires"],
        failureEffect: "Wheel collapse under shear stress.",
        cascadeFailures: ["Suspension Breakage"],
        originalPosition: {x: 0, y: -80, z: 0},
        explodedPosition: {x: 600, y: -200, z: 600}
    });

    // --------------------------------------------------------
    // PhD-Level String Theory Quiz
    // --------------------------------------------------------
    const quizQuestions = [
        {
            question: "In the context of string theory, Calabi-Yau manifolds are utilized to compactify extra dimensions. What specific property of these manifolds ensures that N=1 supersymmetry is preserved in the resulting 4-dimensional effective field theory?",
            options: [
                "They have SU(3) holonomy.",
                "They are non-Kähler.",
                "They possess a non-vanishing first Chern class.",
                "They are hyper-Kähler."
            ],
            correctAnswer: 0,
            explanation: "Calabi-Yau threefolds have SU(3) holonomy, which breaks the original 10D supersymmetry (N=2) down to exactly N=1 in the 4D non-compact spacetime, a critical requirement for realistic particle physics models."
        },
        {
            question: "M-theory unifies the five distinct superstring theories. It operates in how many spacetime dimensions, and what are its fundamental extended objects?",
            options: [
                "10 dimensions; Strings and D-branes",
                "11 dimensions; M2-branes and M5-branes",
                "26 dimensions; Bosonic strings",
                "12 dimensions; F-theory branes"
            ],
            correctAnswer: 1,
            explanation: "M-theory requires 11 spacetime dimensions. Its fundamental objects are not strings, but rather two-dimensional membranes (M2-branes) and five-dimensional membranes (M5-branes)."
        },
        {
            question: "The Euler characteristic χ of a Calabi-Yau threefold determines the number of generations of chiral fermions in the resulting particle physics model. What is the precise relationship in the standard embedding?",
            options: [
                "Generations = |χ| / 2",
                "Generations = χ",
                "Generations = |χ| / 4",
                "Generations = 2 |χ|"
            ],
            correctAnswer: 0,
            explanation: "In standard compactifications of the E8 x E8 heterotic string on a Calabi-Yau threefold, the net number of chiral fermion generations is equal to half the absolute value of the Euler characteristic."
        },
        {
            question: "T-duality is a profound symmetry in string theory. If a string is compactified on a circle of radius R, T-duality states it is physically equivalent to a theory compactified on a circle of what radius (where α' is the Regge slope)?",
            options: [
                "α' / R^2",
                "α' / R",
                "R / α'",
                "√(α') / R"
            ],
            correctAnswer: 1,
            explanation: "T-duality relates a theory on a circle of radius R to one on a circle of radius α'/R, exchanging winding modes with Kaluza-Klein momentum modes."
        },
        {
            question: "In the intersection of D-branes in extra dimensions, standard model gauge groups can be engineered. Which configuration of intersecting D6-branes in Type IIA string theory is typically used to realize chiral fermions?",
            options: [
                "Parallel, non-intersecting branes",
                "Branes intersecting at right angles in all tori",
                "Branes intersecting at angles in the internal manifold",
                "Coincident D3-branes at a smooth point"
            ],
            correctAnswer: 2,
            explanation: "Chiral fermions arise precisely at the intersection locus of D6-branes that intersect at angles within the internal Calabi-Yau or toroidal manifold in Type IIA orientifold models."
        }
    ];

    // --------------------------------------------------------
    // Animation Logic
    // --------------------------------------------------------
    const animate = (time, speed, meshes) => {
        const timeSec = time * 0.001;
        const dt = speed * 0.05;

        // 1. Crawler Wheel Rotation and Suspension
        wheels.forEach(w => {
            // Rotate wheels based on speed
            w.wGroup.rotation.x += dt;
            
            // Complex suspension terrain physics
            const offset = Math.sin(timeSec * 4 + w.offsetPhase) * 12 * speed + 
                           Math.cos(timeSec * 7 + w.z * 0.02) * 5 * speed;
            
            w.wGroup.position.y = -80 + offset;
            
            // Stretch the inner hydraulic piston
            // Base of piston is fixed to chassis at y=-20.
            // Inner piston local origin is at y=-20 relative to pistonGroup.
            // Adjust scale or position. Position is safer without distorting mesh.
            w.innerPiston.position.y = -20 + (offset * 0.5); 
        });

        // 2. Radar Dish Spin
        radarGroup.rotation.y += dt * 1.5;

        // 3. Nested Gimbal Rotation
        if(gimbalRings.length === 6) {
            gimbalRings[0].rotation.x += dt * 0.15;
            gimbalRings[1].rotation.y += dt * 0.22;
            gimbalRings[2].rotation.z += dt * 0.35;
            gimbalRings[3].rotation.x -= dt * 0.42;
            gimbalRings[4].rotation.y -= dt * 0.55;
            gimbalRings[5].rotation.z -= dt * 0.68;
        }

        // 4. Containment Field Uniform Update
        if(containmentMesh && containmentMesh.material.uniforms) {
            containmentMesh.material.uniforms.time.value = timeSec;
            containmentMesh.rotation.y += dt * 0.1;
        }

        // 5. 6D Calabi-Yau Manifold Unfurling Matrix Computation
        const m6 = new Matrix6();
        const tmp = new Matrix6();

        // Accumulate highly complex 6D rotations over 15 orthogonal planes
        m6.multiply(tmp.makeRotation(0, 1, timeSec * 0.22 * speed));
        m6.multiply(tmp.makeRotation(2, 3, timeSec * 0.31 * speed));
        m6.multiply(tmp.makeRotation(4, 5, timeSec * 0.17 * speed));
        
        m6.multiply(tmp.makeRotation(0, 4, timeSec * 0.25 * speed));
        m6.multiply(tmp.makeRotation(1, 5, timeSec * 0.13 * speed));
        m6.multiply(tmp.makeRotation(0, 3, timeSec * 0.19 * speed));
        
        m6.multiply(tmp.makeRotation(1, 2, timeSec * 0.28 * speed));
        m6.multiply(tmp.makeRotation(3, 4, timeSec * 0.36 * speed));

        // Apply matrix transform and project down to 3D
        const posAttr = manifoldMesh.geometry.attributes.position;
        const posArray = posAttr.array;

        for(let i=0; i<vertexCount; i++) {
            const idx = i * 6;
            let x1 = rawVertices6D[idx];
            let x2 = rawVertices6D[idx+1];
            let x3 = rawVertices6D[idx+2];
            let x4 = rawVertices6D[idx+3];
            let x5 = rawVertices6D[idx+4];
            let x6 = rawVertices6D[idx+5];
            
            const e = m6.elements;
            // 6D Vector-Matrix multiplication
            const nx1 = e[0]*x1 + e[1]*x2 + e[2]*x3 + e[3]*x4 + e[4]*x5 + e[5]*x6;
            const nx2 = e[6]*x1 + e[7]*x2 + e[8]*x3 + e[9]*x4 + e[10]*x5 + e[11]*x6;
            const nx3 = e[12]*x1 + e[13]*x2 + e[14]*x3 + e[15]*x4 + e[16]*x5 + e[17]*x6;
            const nx4 = e[18]*x1 + e[19]*x2 + e[20]*x3 + e[21]*x4 + e[22]*x5 + e[23]*x6;
            const nx5 = e[24]*x1 + e[25]*x2 + e[26]*x3 + e[27]*x4 + e[28]*x5 + e[29]*x6;
            const nx6 = e[30]*x1 + e[31]*x2 + e[32]*x3 + e[33]*x4 + e[34]*x5 + e[35]*x6;
            
            // Multi-stage Stereographic Projection: 6D -> 5D -> 4D -> 3D
            const d1 = 1.0 / (2.5 - nx6 * 0.5);
            const px1 = nx1 * d1; const px2 = nx2 * d1; const px3 = nx3 * d1; const px4 = nx4 * d1; const px5 = nx5 * d1;
            
            const d2 = 1.0 / (2.5 - px5 * 0.5);
            const px1_2 = px1 * d2; const px2_2 = px2 * d2; const px3_2 = px3 * d2; const px4_2 = px4 * d2;
            
            const d3 = 1.0 / (2.5 - px4_2 * 0.5);
            const fx = px1_2 * d3 * 100;
            const fy = px2_2 * d3 * 100;
            const fz = px3_2 * d3 * 100;
            
            posArray[i*3] = fx;
            posArray[i*3+1] = fy;
            posArray[i*3+2] = fz;
        }
        
        posAttr.needsUpdate = true;
        manifoldMesh.geometry.computeVertexNormals();
        manifoldMesh.rotation.y += dt * 0.05;
        manifoldMesh.rotation.z += dt * 0.03;
    };

    return { group, parts, description, quizQuestions, animate };
}
