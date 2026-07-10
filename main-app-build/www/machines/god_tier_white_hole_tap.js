/**
 * ============================================================================
 * GOD TIER: WHITE HOLE TAP & PLANETARY CRAWLER
 * ============================================================================
 * A hyper-realistic, extremely complex 3D model of a mobile machine designed 
 * to tap into a localized white hole.
 * 
 * DIRECTIVES:
 * - Extremely complex, 1000+ lines.
 * - No simple cubes. Deeply detailed grouped primitive constructs.
 * - Custom shaders for blindingly bright erupting singularity.
 * - Massive funnel-shaped collectors.
 * - Containment fields.
 * - Extreme animation logic (matter spewing, shockwaves, pistons, tires).
 * - Massive off-road tires with hundreds of treads and complex rims.
 * - 5 PhD-level astrophysic/relativity quiz questions.
 * ============================================================================
 */

import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    
    // Arrays and object maps to store references for the animate loop
    const meshes = {
        wheels: [],
        pistons: [],
        suspensionArms: [],
        turbineStages: [],
        containmentRings: [],
        shockwaves: null,
        particles: null,
        particleData: [],
        inhibitors: [],
        fluidPipes: [],
        radiatorFans: [],
        glowMaterials: [],
        singularity: null,
        energyBeams: []
    };

    // ============================================================================
    // SHADERS
    // ============================================================================
    
    const whiteHoleVertexShader = `
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        uniform float time;
        
        // 3D Perlin Noise
        vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
        vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
        vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
        float cnoise(vec3 P){
            vec3 Pi0 = floor(P);
            vec3 Pi1 = Pi0 + vec3(1.0);
            Pi0 = mod(Pi0, 289.0);
            Pi1 = mod(Pi1, 289.0);
            vec3 Pf0 = fract(P);
            vec3 Pf1 = Pf0 - vec3(1.0);
            vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
            vec4 iy = vec4(Pi0.yy, Pi1.yy);
            vec4 iz0 = Pi0.zzzz;
            vec4 iz1 = Pi1.zzzz;
            vec4 ixy = permute(permute(ix) + iy);
            vec4 ixy0 = permute(ixy + iz0);
            vec4 ixy1 = permute(ixy + iz1);
            vec4 gx0 = ixy0 / 7.0;
            vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
            gx0 = fract(gx0);
            vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
            vec4 sz0 = step(gz0, vec4(0.0));
            gx0 -= sz0 * (step(0.0, gx0) - 0.5);
            gy0 -= sz0 * (step(0.0, gy0) - 0.5);
            vec4 gx1 = ixy1 / 7.0;
            vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
            gx1 = fract(gx1);
            vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
            vec4 sz1 = step(gz1, vec4(0.0));
            gx1 -= sz1 * (step(0.0, gx1) - 0.5);
            gy1 -= sz1 * (step(0.0, gy1) - 0.5);
            vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
            vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
            vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
            vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
            vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
            vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
            vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
            vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
            vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
            g000 *= norm0.x;
            g010 *= norm0.y;
            g100 *= norm0.z;
            g110 *= norm0.w;
            vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
            g001 *= norm1.x;
            g011 *= norm1.y;
            g101 *= norm1.z;
            g111 *= norm1.w;
            float n000 = dot(g000, Pf0);
            float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
            float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
            float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
            float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
            float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
            float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
            float n111 = dot(g111, Pf1);
            vec3 fade_xyz = fade(Pf0);
            vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
            vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
            float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
            return 2.2 * n_xyz;
        }
    
        void main() {
            vUv = uv;
            vNormal = normal;
            float noise = cnoise(position * 0.02 + time * 3.0);
            vec3 displacedPosition = position + normal * noise * 25.0;
            vPosition = displacedPosition;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
        }
    `;

    const whiteHoleFragmentShader = `
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        uniform float time;
        
        void main() {
            float intensity = max(0.0, 1.0 - length(vPosition) / 300.0);
            float pulse = sin(time * 8.0) * 0.5 + 0.5;
            
            vec3 coreColor = vec3(1.0, 1.0, 1.0); // Pure blinding white
            vec3 edgeColor = vec3(0.6, 0.8, 1.0); // Cyan-white
            vec3 outerColor = vec3(0.1, 0.0, 0.6); // Deep ultraviolet
            
            vec3 finalColor = mix(outerColor, edgeColor, intensity * 2.5);
            finalColor = mix(finalColor, coreColor, pow(intensity, 5.0));
            
            finalColor *= (2.0 + pulse * 1.5); // Overblown emissive
            
            vec3 viewDir = normalize(cameraPosition - vPosition);
            float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 2.0);
            finalColor += vec3(1.0, 1.0, 1.0) * fresnel * 3.0;
    
            gl_FragColor = vec4(finalColor, 1.0);
        }
    `;

    const energyShieldVertexShader = `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    const energyShieldFragmentShader = `
        varying vec2 vUv;
        varying vec3 vNormal;
        uniform float time;
        void main() {
            vec3 viewDirection = vec3(0.0, 0.0, 1.0);
            float fresnel = dot(viewDirection, vNormal);
            fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
            fresnel = pow(fresnel, 3.0);
            
            float scanline = sin(vUv.y * 100.0 - time * 10.0) * 0.5 + 0.5;
            vec3 color = vec3(0.0, 0.8, 1.0);
            
            float alpha = fresnel * 0.8 + scanline * 0.2;
            gl_FragColor = vec4(color * 2.0, alpha);
        }
    `;

    const shaderUniforms = {
        time: { value: 0.0 }
    };

    const singularityMat = new THREE.ShaderMaterial({
        vertexShader: whiteHoleVertexShader,
        fragmentShader: whiteHoleFragmentShader,
        uniforms: shaderUniforms,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    });

    const shieldMat = new THREE.ShaderMaterial({
        vertexShader: energyShieldVertexShader,
        fragmentShader: energyShieldFragmentShader,
        uniforms: shaderUniforms,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
    });

    const neonBlueMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff, emissive: 0x0088ff, emissiveIntensity: 2.0, roughness: 0.1, metalness: 0.5
    });
    meshes.glowMaterials.push(neonBlueMat);

    const neonOrangeMat = new THREE.MeshStandardMaterial({
        color: 0xffaa00, emissive: 0xff4400, emissiveIntensity: 3.0, roughness: 0.2, metalness: 0.6
    });
    meshes.glowMaterials.push(neonOrangeMat);

    // ============================================================================
    // GEOMETRY GENERATION HELPERS
    // ============================================================================

    function buildGearProfile(teeth, innerRadius, outerRadius, toothDepth) {
        const pts = [];
        const step = (Math.PI * 2) / teeth;
        for (let i = 0; i < teeth; i++) {
            const angle = i * step;
            const nextAngle = (i + 1) * step;
            const mid1 = angle + step * 0.25;
            const mid2 = angle + step * 0.75;
            pts.push(new THREE.Vector2(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius));
            pts.push(new THREE.Vector2(Math.cos(mid1) * (outerRadius + toothDepth), Math.sin(mid1) * (outerRadius + toothDepth)));
            pts.push(new THREE.Vector2(Math.cos(mid2) * (outerRadius + toothDepth), Math.sin(mid2) * (outerRadius + toothDepth)));
            pts.push(new THREE.Vector2(Math.cos(nextAngle) * outerRadius, Math.sin(nextAngle) * outerRadius));
        }
        const shape = new THREE.Shape(pts);
        if (innerRadius > 0) {
            const holePath = new THREE.Path();
            holePath.absarc(0, 0, innerRadius, 0, Math.PI * 2, false);
            shape.holes.push(holePath);
        }
        return shape;
    }

    function buildBellNozzlePoints(throatRadius, exitRadius, length, segments) {
        const pts = [];
        for(let i=0; i<=segments; i++) {
            const t = i / segments;
            const r = throatRadius + (exitRadius - throatRadius) * Math.pow(t, 0.6); // Parabolic expansion
            const y = length * t;
            pts.push(new THREE.Vector2(r, y));
        }
        return pts;
    }

    function buildPistonStructure() {
        const pGroup = new THREE.Group();
        const cylinderGeo = new THREE.CylinderGeometry(18, 18, 120, 32);
        const casing = new THREE.Mesh(cylinderGeo, darkSteel);
        casing.position.y = 60;
        pGroup.add(casing);

        const innerGeo = new THREE.CylinderGeometry(12, 12, 140, 32);
        const rod = new THREE.Mesh(innerGeo, chrome);
        rod.position.y = 130;
        pGroup.add(rod);

        const jointGeo = new THREE.SphereGeometry(22, 32, 32);
        const topJoint = new THREE.Mesh(jointGeo, steel);
        topJoint.position.y = 70; // Relative to rod
        rod.add(topJoint);

        const botJoint = new THREE.Mesh(jointGeo, steel);
        botJoint.position.y = -60; // Relative to casing
        casing.add(botJoint);

        return { group: pGroup, casing, rod };
    }

    function buildTireAssembly() {
        const tireGroup = new THREE.Group();
        
        // Main Torus body
        const torusGeo = new THREE.TorusGeometry(180, 50, 64, 128);
        const tireMesh = new THREE.Mesh(torusGeo, rubber);
        tireGroup.add(tireMesh);

        // Hundreds of tiny extruded BoxGeometry lugs for treads
        const treadGeo = new THREE.BoxGeometry(70, 15, 25);
        // Beveling the treads
        const positions = treadGeo.attributes.position;
        for(let i=0; i<positions.count; i++) {
            if(positions.getY(i) > 0) {
                positions.setX(i, positions.getX(i) * 0.8);
                positions.setZ(i, positions.getZ(i) * 0.8);
            }
        }
        treadGeo.computeVertexNormals();

        const numTreads = 180;
        const treadsInstanced = new THREE.InstancedMesh(treadGeo, rubber, numTreads);
        const dummy = new THREE.Object3D();
        
        for(let i=0; i<numTreads; i++) {
            const angle = (i / numTreads) * Math.PI * 2;
            const radiusOffset = 225;
            
            // Staggered pattern
            const offsetZ = (i % 2 === 0) ? 20 : -20;
            const rotZ = (i % 2 === 0) ? 0.2 : -0.2;

            dummy.position.set(Math.cos(angle)*radiusOffset, Math.sin(angle)*radiusOffset, offsetZ);
            dummy.rotation.set(0, 0, angle + Math.PI/2);
            dummy.rotateY(rotZ);
            dummy.updateMatrix();
            treadsInstanced.setMatrixAt(i, dummy.matrix);
        }
        tireGroup.add(treadsInstanced);
        
        // Complex Rim (Cylinder with spoke arrays)
        const rimOuterGeo = new THREE.CylinderGeometry(150, 150, 60, 64);
        const rimOuter = new THREE.Mesh(rimOuterGeo, darkSteel);
        rimOuter.rotation.x = Math.PI / 2;
        tireGroup.add(rimOuter);

        const rimInnerGeo = new THREE.CylinderGeometry(40, 40, 70, 32);
        const rimInner = new THREE.Mesh(rimInnerGeo, chrome);
        rimInner.rotation.x = Math.PI / 2;
        tireGroup.add(rimInner);

        // Spokes
        const spokeGeo = new THREE.BoxGeometry(10, 110, 20);
        const numSpokes = 16;
        const spokesInstanced = new THREE.InstancedMesh(spokeGeo, aluminum, numSpokes);
        for(let i=0; i<numSpokes; i++) {
            const angle = (i / numSpokes) * Math.PI * 2;
            dummy.position.set(Math.cos(angle)*95, Math.sin(angle)*95, 0);
            dummy.rotation.set(0, 0, angle + Math.PI/2);
            dummy.updateMatrix();
            spokesInstanced.setMatrixAt(i, dummy.matrix);
        }
        tireGroup.add(spokesInstanced);

        // Hubcap glowing detail
        const hubGeo = new THREE.CylinderGeometry(20, 20, 72, 32);
        const hub = new THREE.Mesh(hubGeo, neonBlueMat);
        hub.rotation.x = Math.PI / 2;
        tireGroup.add(hub);

        return tireGroup;
    }

    // ============================================================================
    // MAIN ASSEMBLIES
    // ============================================================================

    // 1. CHASSIS & CRAWLER PLATFORM
    const crawlerGroup = new THREE.Group();
    group.add(crawlerGroup);

    // Main structural bed (Massive Extrusion)
    const chassisShape = new THREE.Shape();
    chassisShape.moveTo(-600, -300);
    chassisShape.lineTo(600, -300);
    chassisShape.lineTo(800, -100);
    chassisShape.lineTo(800, 100);
    chassisShape.lineTo(600, 300);
    chassisShape.lineTo(-600, 300);
    chassisShape.lineTo(-800, 100);
    chassisShape.lineTo(-800, -100);
    chassisShape.lineTo(-600, -300);
    
    // Hole for singularity funnel
    const chassisHole = new THREE.Path();
    chassisHole.absarc(0, 0, 400, 0, Math.PI * 2, false);
    chassisShape.holes.push(chassisHole);

    const chassisGeo = new THREE.ExtrudeGeometry(chassisShape, { depth: 150, bevelEnabled: true, bevelThickness: 20, bevelSize: 20, bevelSegments: 5, curveSegments: 32 });
    const chassis = new THREE.Mesh(chassisGeo, darkSteel);
    chassis.rotation.x = Math.PI / 2;
    chassis.position.y = -400; // Base height
    crawlerGroup.add(chassis);

    // Suspension and Wheels
    const wheelPositions = [
        [-650, -450, 450], [0, -450, 450], [650, -450, 450],
        [-650, -450, -450], [0, -450, -450], [650, -450, -450]
    ]; // 6 massive tires

    wheelPositions.forEach((pos, idx) => {
        const suspensionGroup = new THREE.Group();
        suspensionGroup.position.set(pos[0], pos[1] + 200, pos[2]); // Mount point
        crawlerGroup.add(suspensionGroup);

        // Piston Arm
        const pistonData = buildPistonStructure();
        pistonData.group.rotation.x = (pos[2] > 0) ? -Math.PI/6 : Math.PI/6;
        suspensionGroup.add(pistonData.group);
        meshes.pistons.push(pistonData);

        // The Tire
        const tire = buildTireAssembly();
        tire.position.set(0, -200, (pos[2] > 0) ? 80 : -80);
        
        // If right side, rotate tire to face outwards correctly
        if (pos[2] < 0) tire.rotation.y = Math.PI;

        suspensionGroup.add(tire);
        meshes.wheels.push(tire);
        
        // Link piston rod to tire axle
        // In animate, we'll oscillate the suspension
        meshes.suspensionArms.push({ group: suspensionGroup, baseHeight: pos[1] + 200, phase: idx });
    });

    // 2. WHITE HOLE SINGULARITY
    const singularityGroup = new THREE.Group();
    singularityGroup.position.y = 200; // Hovering above chassis center
    group.add(singularityGroup);

    const coreGeo = new THREE.SphereGeometry(120, 128, 128);
    const core = new THREE.Mesh(coreGeo, singularityMat);
    singularityGroup.add(core);
    meshes.singularity = core;

    // Event Horizon Deflector Shield
    const shieldGeo = new THREE.SphereGeometry(250, 64, 64);
    const shield = new THREE.Mesh(shieldGeo, shieldMat);
    singularityGroup.add(shield);

    // Magnetic field lines (TorusKnots wrapping the singularity)
    for(let i=0; i<4; i++) {
        const knotGeo = new THREE.TorusKnotGeometry(200, 5, 256, 32, i+2, 5);
        const knot = new THREE.Mesh(knotGeo, neonOrangeMat);
        knot.rotation.x = Math.random() * Math.PI;
        knot.rotation.y = Math.random() * Math.PI;
        singularityGroup.add(knot);
        meshes.containmentRings.push({ mesh: knot, speed: 0.05 + i*0.02, axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize() });
    }

    // 3. PRIMARY & SECONDARY FUNNELS
    const funnelGroup = new THREE.Group();
    funnelGroup.position.y = 200;
    group.add(funnelGroup);

    // Upper Collector Funnel (Extracting matter)
    const upperFunnelPts = buildBellNozzlePoints(280, 1200, 1500, 100);
    const upperFunnelGeo = new THREE.LatheGeometry(upperFunnelPts, 128);
    const upperFunnel = new THREE.Mesh(upperFunnelGeo, chrome);
    upperFunnel.material.side = THREE.DoubleSide;
    funnelGroup.add(upperFunnel);

    // Lower Exhaust Funnel (Venting Hawking radiation)
    const lowerFunnelPts = buildBellNozzlePoints(280, 800, 800, 100);
    const lowerFunnelGeo = new THREE.LatheGeometry(lowerFunnelPts, 128);
    const lowerFunnel = new THREE.Mesh(lowerFunnelGeo, steel);
    lowerFunnel.rotation.x = Math.PI; // Point down
    lowerFunnel.material.side = THREE.DoubleSide;
    funnelGroup.add(lowerFunnel);

    // Turbine Stages inside Upper Funnel
    const turbineCount = 8;
    for(let i=0; i<turbineCount; i++) {
        const t = (i+1) / turbineCount;
        const height = t * 1300 + 100;
        const radius = 280 + (1200 - 280) * Math.pow(t, 0.6) - 10; // Fit inside funnel

        const stageGroup = new THREE.Group();
        stageGroup.position.y = height;
        
        const hubGeo = new THREE.CylinderGeometry(radius*0.2, radius*0.3, 40, 32);
        const hub = new THREE.Mesh(hubGeo, darkSteel);
        stageGroup.add(hub);

        const bladeGeo = new THREE.BoxGeometry(radius * 0.8, 10, radius * 0.15);
        const bladeCount = 24 + i*4;
        const bladesInstanced = new THREE.InstancedMesh(bladeGeo, aluminum, bladeCount);
        const bDummy = new THREE.Object3D();
        for(let b=0; b<bladeCount; b++) {
            const angle = (b / bladeCount) * Math.PI * 2;
            bDummy.position.set(Math.cos(angle)*(radius*0.55), 0, Math.sin(angle)*(radius*0.55));
            bDummy.rotation.set(0, -angle, Math.PI / 6); // Pitch angle
            bDummy.updateMatrix();
            bladesInstanced.setMatrixAt(b, bDummy.matrix);
        }
        stageGroup.add(bladesInstanced);
        funnelGroup.add(stageGroup);

        meshes.turbineStages.push({
            mesh: stageGroup,
            speed: (i % 2 === 0 ? 1 : -1) * (0.2 - i*0.01) // Counter-rotating stages
        });
    }

    // 4. QUANTUM CONTAINMENT RINGS (Gears)
    const ringsGroup = new THREE.Group();
    ringsGroup.position.y = 200;
    group.add(ringsGroup);

    const ringParams = [
        { teeth: 36, inRad: 320, outRad: 380, depth: 30, color: darkSteel, z: 40 },
        { teeth: 48, inRad: 420, outRad: 480, depth: 35, color: steel, z: 60 },
        { teeth: 60, inRad: 520, outRad: 580, depth: 40, color: copper, z: 80 }
    ];

    ringParams.forEach((rp, idx) => {
        // We create two extruded gears per param to form a gyroscope
        const shape = buildGearProfile(rp.teeth, rp.inRad, rp.outRad, rp.depth);
        const extrudeSet = { depth: rp.z, bevelEnabled: true, bevelThickness: 5, bevelSize: 5 };
        const geo = new THREE.ExtrudeGeometry(shape, extrudeSet);
        
        geo.translate(0, 0, -rp.z/2); // Center on Z

        const ringX = new THREE.Mesh(geo, rp.color);
        const ringZ = new THREE.Mesh(geo, rp.color);
        
        const gimbal = new THREE.Group();
        gimbal.add(ringX);
        gimbal.add(ringZ);
        ringZ.rotation.x = Math.PI / 2;

        ringsGroup.add(gimbal);

        meshes.containmentRings.push({
            mesh: gimbal,
            speed: 0.02 * (idx + 1),
            axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize()
        });

        // Add observation decks to outer ring
        if (idx === 2) {
            for(let i=0; i<8; i++) {
                const angle = (i/8) * Math.PI * 2;
                const deckGroup = new THREE.Group();
                deckGroup.position.set(Math.cos(angle)*650, 0, Math.sin(angle)*650);
                deckGroup.rotation.y = -angle;
                
                const roomGeo = new THREE.BoxGeometry(60, 40, 40);
                const room = new THREE.Mesh(roomGeo, darkSteel);
                deckGroup.add(room);
                
                const glassGeo = new THREE.BoxGeometry(62, 20, 42);
                const window = new THREE.Mesh(glassGeo, tinted);
                deckGroup.add(window);
                
                gimbal.add(deckGroup);
            }
        }
    });

    // 5. HYDRAULIC COOLANT NETWORK (CatmullRom curves)
    const pipeGroup = new THREE.Group();
    pipeGroup.position.y = 200;
    group.add(pipeGroup);
    
    const numPipes = 16;
    for(let i=0; i<numPipes; i++) {
        const angle = (i/numPipes) * Math.PI * 2;
        const pts = [];
        for(let j=0; j<=40; j++) {
            const t = j/40; // 0 to 1
            // Pipe winds around funnel and out to chassis
            let rad = 300 + Math.pow(t, 2) * 500 + Math.sin(t*Math.PI*6)*40;
            let y = t * 1400; // Go up funnel
            
            // Loop back down to chassis
            if (t > 0.8) {
                const subT = (t - 0.8) / 0.2;
                rad = rad + subT * 200;
                y = 1400 - subT * 1800; // Drop rapidly to chassis
            }
            
            const x = Math.cos(angle + t*Math.PI*2) * rad;
            const z = Math.sin(angle + t*Math.PI*2) * rad;
            pts.push(new THREE.Vector3(x, y, z));
        }
        const curve = new THREE.CatmullRomCurve3(pts);
        const tubeGeo = new THREE.TubeGeometry(curve, 128, 15, 16, false);
        const tube = new THREE.Mesh(tubeGeo, copper);
        pipeGroup.add(tube);
    }

    // 6. MATTER EXTRACTOR ACCELERATORS (Toroids)
    const accelGroup = new THREE.Group();
    accelGroup.position.y = 1000; // High up on funnel
    group.add(accelGroup);

    for(let i=0; i<4; i++) {
        const r = 800 + i*150;
        const tubeGeo = new THREE.TorusGeometry(r, 40, 32, 128);
        const tube = new THREE.Mesh(tubeGeo, glass);
        tube.rotation.x = Math.PI / 2;
        tube.position.y = i * 150;
        accelGroup.add(tube);

        // Inner plasma beam
        const beamGeo = new THREE.TorusGeometry(r, 20, 16, 128);
        const beam = new THREE.Mesh(beamGeo, neonBlueMat);
        beam.rotation.x = Math.PI / 2;
        beam.position.y = i * 150;
        accelGroup.add(beam);
        meshes.energyBeams.push(beam);
    }

    // 7. SUPPORT TRUSSES
    const trussGroup = new THREE.Group();
    trussGroup.position.y = 200;
    group.add(trussGroup);

    const numStruts = 24;
    const strutDummy = new THREE.Object3D();
    const strutGeo = new THREE.CylinderGeometry(8, 8, 1000, 12);
    // Move origin to end of cylinder for easier rotation
    strutGeo.translate(0, 500, 0); 
    const strutsInstanced = new THREE.InstancedMesh(strutGeo, steel, numStruts * 2);
    
    for(let i=0; i<numStruts; i++) {
        const angle = (i/numStruts) * Math.PI * 2;
        
        // Base to Mid ring
        strutDummy.position.set(Math.cos(angle)*600, -500, Math.sin(angle)*600);
        strutDummy.lookAt(new THREE.Vector3(Math.cos(angle)*400, 200, Math.sin(angle)*400));
        strutDummy.rotateX(Math.PI/2);
        strutDummy.scale.set(1, 1.2, 1);
        strutDummy.updateMatrix();
        strutsInstanced.setMatrixAt(i*2, strutDummy.matrix);

        // Mid ring to Upper Funnel
        strutDummy.position.set(Math.cos(angle)*400, 200, Math.sin(angle)*400);
        strutDummy.lookAt(new THREE.Vector3(Math.cos(angle)*1000, 1200, Math.sin(angle)*1000));
        strutDummy.rotateX(Math.PI/2);
        strutDummy.scale.set(1, 1.5, 1);
        strutDummy.updateMatrix();
        strutsInstanced.setMatrixAt(i*2 + 1, strutDummy.matrix);
    }
    trussGroup.add(strutsInstanced);

    // 8. EJECTA PARTICLE SYSTEM (Matter spewing)
    const particleCount = 15000;
    const particleGeo = new THREE.TetrahedronGeometry(4, 1);
    
    // Varying colors for particles based on temperature
    const pMat = new THREE.MeshStandardMaterial({
        color: 0xffffff, emissive: 0xffaaff, emissiveIntensity: 2.0, roughness: 0.2
    });
    const pSystem = new THREE.InstancedMesh(particleGeo, pMat, particleCount);
    const pDummy = new THREE.Object3D();
    const pData = [];

    for(let i=0; i<particleCount; i++) {
        pData.push({
            pos: new THREE.Vector3(0, 0, 0),
            vel: new THREE.Vector3(),
            life: Math.random(), // Stagger starts
            maxLife: Math.random() * 2.0 + 1.0,
            scale: Math.random() * 3 + 1,
            spin: new THREE.Vector3(Math.random(), Math.random(), Math.random())
        });
        pSystem.setMatrixAt(i, pDummy.matrix); // initialized at 0
    }
    pSystem.position.y = 200; // Center at singularity
    group.add(pSystem);
    meshes.particles = pSystem;
    meshes.particleData = pData;

    // 9. DARK MATTER INHIBITORS (Floating Constellation)
    const inhibitorGroup = new THREE.Group();
    inhibitorGroup.position.y = 200;
    group.add(inhibitorGroup);

    const inhGeo = new THREE.OctahedronGeometry(30, 0);
    const inhMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 1.0, roughness: 0.1 });
    const numInhibitors = 60;
    for(let i=0; i<numInhibitors; i++) {
        const m = new THREE.Mesh(inhGeo, inhMat);
        // Place spherically around singularity
        const phi = Math.acos( -1 + ( 2 * i ) / numInhibitors );
        const theta = Math.sqrt( numInhibitors * Math.PI ) * phi;
        const r = 900;
        
        m.position.setFromSphericalCoords(r, phi, theta);
        
        const coreLight = new THREE.Mesh(new THREE.SphereGeometry(10), neonOrangeMat);
        m.add(coreLight);
        
        inhibitorGroup.add(m);
        meshes.inhibitors.push({ mesh: m, basePos: m.position.clone(), phase: Math.random() * Math.PI * 2 });
    }

    // ============================================================================
    // PARTS ARRAY SPECIFICATION
    // ============================================================================
    
    parts.push({
        name: "White Hole Singularity Core",
        description: "A localized, contained region of past-directed spacetime curvature continuously expelling immense matter and energy. It represents the time-reversed analog of a black hole.",
        material: "Custom Procedural Emissive Shader (Blinding White/Ultraviolet)",
        function: "Primary Infinite Energy Source",
        assemblyOrder: 1,
        connections: ["Event Horizon Deflector", "Quantum Containment Rings"],
        failureEffect: "Spontaneous Big Bang, resulting in infinite localized expansion and chronology violation.",
        cascadeFailures: ["Causal breakdown of adjacent sectors", "Total Universal Annihilation"],
        originalPosition: {x: 0, y: 200, z: 0},
        explodedPosition: {x: 0, y: 1500, z: 0}
    });

    parts.push({
        name: "Event Horizon Deflector Shield",
        description: "A translucent energetic boundary designed to shape the expelled matter from the Cauchy horizon into a directed, harvestable stream.",
        material: "Custom Holographic Fresnel Shader",
        function: "Beam Collimation & Singularity Containment",
        assemblyOrder: 2,
        connections: ["Singularity Core", "Primary Collector Funnel"],
        failureEffect: "Isotropic emission of gamma radiation vaporizing the crawler.",
        cascadeFailures: ["Hull melting", "Crew vaporization"],
        originalPosition: {x: 0, y: 200, z: 0},
        explodedPosition: {x: 0, y: 1500, z: 500}
    });

    parts.push({
        name: "Primary Collector Funnel",
        description: "A massive, bell-nozzle shaped parabolic lathe structure engineered to capture upward-flowing ejecta and accelerate it through turbine stages.",
        material: "Chrome / Neutron-Forged Plating",
        function: "Matter Harvest & Funneling",
        assemblyOrder: 3,
        connections: ["Turbine Stages", "Chassis Bed"],
        failureEffect: "Matter spillover, leading to structural micro-fractures and explosive decompression.",
        cascadeFailures: ["Turbine jam", "Strut collapse"],
        originalPosition: {x: 0, y: 200, z: 0},
        explodedPosition: {x: 0, y: 2500, z: 0}
    });

    parts.push({
        name: "Secondary Exhaust Funnel",
        description: "An inverted funnel for dumping excess Hawking radiation and preventing thermal buildup within the containment rings.",
        material: "Dark Steel / Lead-lined",
        function: "Radiation Venting",
        assemblyOrder: 4,
        connections: ["Chassis Bed"],
        failureEffect: "Thermal runaway in the lower containment sector.",
        cascadeFailures: ["Chassis melting", "Tire blowout"],
        originalPosition: {x: 0, y: 200, z: 0},
        explodedPosition: {x: 0, y: -800, z: 0}
    });

    parts.push({
        name: "Quantum Containment Gyroscopes",
        description: "Three nested, multi-axis rotating gear-rings generating a localized gravity well to counteract the white hole's expansive repulsion.",
        material: "Dark Steel, Steel, Copper (Extruded Gear Profiles)",
        function: "Gravitational Stabilization",
        assemblyOrder: 5,
        connections: ["Observation Decks", "Support Trusses"],
        failureEffect: "Singularity drift, cutting through the hull.",
        cascadeFailures: ["Immediate structural bisection"],
        originalPosition: {x: 0, y: 200, z: 0},
        explodedPosition: {x: 800, y: 200, z: 0}
    });

    parts.push({
        name: "Crawler Chassis",
        description: "A 1600x600 meter massive extruded steel bed supporting the entire apparatus, capable of planetary traversal.",
        material: "Dark Steel Beveled Extrusion",
        function: "Mobile Platform",
        assemblyOrder: 6,
        connections: ["Hydraulic Suspension", "Coolant Pipes"],
        failureEffect: "Platform buckling under gravitational stress.",
        cascadeFailures: ["Loss of mobility", "Alignment failure"],
        originalPosition: {x: 0, y: -400, z: 0},
        explodedPosition: {x: 0, y: -1200, z: 0}
    });

    parts.push({
        name: "Hydraulic Suspension Pistons",
        description: "Six heavy-duty piston assemblies bridging the chassis to the axles, absorbing seismic shockwaves from the singularity.",
        material: "Chrome / Steel",
        function: "Shock Absorption & Ride Height Adjust",
        assemblyOrder: 7,
        connections: ["Crawler Chassis", "Tire Axles"],
        failureEffect: "Severe vibration transmission to containment rings.",
        cascadeFailures: ["Containment breach"],
        originalPosition: {x: 0, y: -250, z: 0},
        explodedPosition: {x: -1000, y: -400, z: 0}
    });

    parts.push({
        name: "All-Terrain Crawler Tires",
        description: "Six massive toroidal tires clad in rubber with hundreds of individual extruded lugs to traverse fractured terrain.",
        material: "Rubber / Dark Steel / Chrome Rims",
        function: "Planetary Locomotion",
        assemblyOrder: 8,
        connections: ["Suspension Pistons"],
        failureEffect: "Traction loss, sinking into planetary crust.",
        cascadeFailures: ["Immobilization"],
        originalPosition: {x: 0, y: -450, z: 0},
        explodedPosition: {x: -1500, y: -450, z: 800}
    });

    parts.push({
        name: "Turbine Stages (8x)",
        description: "Counter-rotating fan blades harvesting kinetic energy from the expelled matter stream.",
        material: "Aluminum / Dark Steel",
        function: "Kinetic Energy Conversion",
        assemblyOrder: 9,
        connections: ["Primary Collector Funnel"],
        failureEffect: "Turbine blade shatter, creating high-velocity shrapnel.",
        cascadeFailures: ["Funnel breach", "Accelerator destruction"],
        originalPosition: {x: 0, y: 1000, z: 0},
        explodedPosition: {x: 0, y: 3500, z: 0}
    });

    parts.push({
        name: "Hydraulic Coolant Network",
        description: "16 looping CatmullRom curves carrying super-chilled liquid helium around the funnels.",
        material: "Polished Copper TubeGeometry",
        function: "Thermal Management",
        assemblyOrder: 10,
        connections: ["Primary Funnel", "Chassis Bed"],
        failureEffect: "Coolant leak causing localized freezing and metal embrittlement.",
        cascadeFailures: ["Truss shattering"],
        originalPosition: {x: 0, y: 200, z: 0},
        explodedPosition: {x: 1200, y: 800, z: 1200}
    });

    parts.push({
        name: "Matter Extractor Accelerators",
        description: "Four massive toroids filled with pulsing neon plasma, accelerating refined matter into storage.",
        material: "Glass / Neon Emissive Core",
        function: "Isotope Refinement",
        assemblyOrder: 11,
        connections: ["Primary Funnel Upper Rim"],
        failureEffect: "Plasma venting into atmosphere.",
        cascadeFailures: ["Atmospheric ignition"],
        originalPosition: {x: 0, y: 1300, z: 0},
        explodedPosition: {x: 0, y: 4000, z: -1000}
    });

    parts.push({
        name: "Support Trusses",
        description: "48 highly tensioned cylindrical struts connecting the base, rings, and funnels.",
        material: "Steel InstancedMesh",
        function: "Structural Integrity",
        assemblyOrder: 12,
        connections: ["Chassis", "Funnels", "Rings"],
        failureEffect: "Tower lean, misaligning the singularity.",
        cascadeFailures: ["Singularity core breach"],
        originalPosition: {x: 0, y: 200, z: 0},
        explodedPosition: {x: 2000, y: 200, z: 0}
    });

    parts.push({
        name: "Observation Decks",
        description: "8 small pressurized rooms clad in tinted glass affixed to the outer containment ring for manual oversight.",
        material: "Dark Steel / Tinted Glass",
        function: "Crew Monitoring",
        assemblyOrder: 13,
        connections: ["Outer Containment Ring"],
        failureEffect: "Decompression.",
        cascadeFailures: ["Loss of crew"],
        originalPosition: {x: 0, y: 200, z: 0},
        explodedPosition: {x: 1000, y: 200, z: 1000}
    });

    parts.push({
        name: "Dark Matter Inhibitors",
        description: "60 black octahedral satellites hovering in a spherical constellation around the core to suppress exotic particle generation.",
        material: "Vantablack / Neon Orange Emitters",
        function: "Exotic Particle Suppression",
        assemblyOrder: 14,
        connections: ["Singularity Core (Wireless)"],
        failureEffect: "Proliferation of strangelets.",
        cascadeFailures: ["Planetary conversion to strange matter"],
        originalPosition: {x: 0, y: 200, z: 0},
        explodedPosition: {x: 0, y: 200, z: 3000}
    });

    parts.push({
        name: "Ejecta Particle Stream",
        description: "15,000 instances of raw baryonic matter violently expelled from the singularity, captured by the funnels.",
        material: "Glowing Emissive Tetrahedrons",
        function: "Raw Material Output",
        assemblyOrder: 15,
        connections: ["Singularity Core"],
        failureEffect: "N/A (Output medium)",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 200, z: 0},
        explodedPosition: {x: 0, y: 5000, z: 0}
    });

    // ============================================================================
    // QUIZ QUESTIONS (PhD Level Astrophysics & Relativity)
    // ============================================================================

    const quizQuestions = [
        {
            question: "In the maximal Kruskal-Szekeres extension of the Schwarzschild geometry, a white hole occupies Region IV. Which of the following precisely describes its causal relationship with the exterior universe (Region I)?",
            options: [
                "It is in the absolute future of Region I, meaning all geodesics entering it must have originated from Region I.",
                "It is causally disconnected from Region I; the Einstein-Rosen bridge pinches off before information can transit.",
                "It lies strictly in the causal past of Region I; null and timelike geodesics can leave Region IV for Region I, but no causal curve can travel from Region I to Region IV.",
                "It is equivalent to Region II under a T-duality transformation, allowing bidirectional non-local signaling."
            ],
            correctAnswerIndex: 2,
            explanation: "Region IV (the white hole) is the time-reverse of Region II (the black hole). Geodesics can only exit Region IV and enter Region I; it is impossible for any signal to enter Region IV from the exterior."
        },
        {
            question: "If a white hole spontaneously expels matter, it appears to violate the Generalized Second Law of Thermodynamics by decreasing local entropy. What theoretical mechanism from Loop Quantum Gravity (LQG) proposes a unitary resolution to this paradox?",
            options: [
                "A 'quantum bounce' where a black hole transitions into a white hole via quantum tunneling, ensuring overall fine-grained entanglement entropy is conserved.",
                "Hawking radiation becomes perfectly thermalized, effectively erasing the information paradox.",
                "The Bousso bound is inverted, allowing negative entropy states within the apparent horizon.",
                "Sphaleron transitions convert the expelled baryons into pure gravitational waves, carrying zero entropy."
            ],
            correctAnswerIndex: 0,
            explanation: "In LQG, the singularity is resolved by quantum geometry. A black hole can undergo a non-perturbative quantum bounce into a white hole. Because this entire process is a unitary quantum evolution, the fine-grained von Neumann entropy remains constant, satisfying thermodynamic laws."
        },
        {
            question: "Analogous to mass inflation at the inner horizon of a Reissner-Nordström black hole, what profound instability plagues the Cauchy horizon of a white hole?",
            options: [
                "Superradiant scattering causing the white hole to shed its angular momentum instantly.",
                "The Penrose Blue-Shift Instability, where any radiation traveling from the singularity toward the Cauchy horizon is infinitely blue-shifted, forming a curvature singularity.",
                "Tachyon condensation destabilizing the false vacuum within the horizon.",
                "The Hawking-Page phase transition causing a collapse into a naked singularity."
            ],
            correctAnswerIndex: 1,
            explanation: "Radiation emitted from the past singularity towards the Cauchy horizon of a white hole undergoes infinite blue-shift. This divergence in energy density leads to a curvature singularity, known as the Penrose blue-shift instability, making white holes inherently unstable."
        },
        {
            question: "In the context of the AdS/CFT correspondence, an eternal two-sided black hole in the bulk is dual to a Thermofield Double (TFD) state on the boundary. How does the white hole singularity mathematically manifest in this holographic framework?",
            options: [
                "As a local operator acting on the boundary CFT at infinite time.",
                "It corresponds to the past singularity in the bulk, dual to the highly entangled state of the two CFTs evaluated at the asymptotic past (t -> -infinity).",
                "It is dual to the maximally mixed density matrix of a single CFT.",
                "It represents a topological defect in the boundary theory."
            ],
            correctAnswerIndex: 1,
            explanation: "In the Kruskal diagram of AdS, the past singularity represents the white hole. Holographically, this past singularity is related to the evolution of the TFD state from the distant past. As time flows forward, the system evolves away from the white hole singularity toward the black hole singularity."
        },
        {
            question: "According to the covariant entropy bound (Bousso bound), how is the entropy of matter expelled from a white hole bounded by the area of light-sheets?",
            options: [
                "The entropy is strictly infinite due to the divergent nature of the white hole's Weyl tensor.",
                "It is bounded by the area of past-directed, converging light-sheets that terminate at the white hole singularity.",
                "It is bounded by the cross-sectional area of the white hole's apparent horizon as seen by an asymptotic observer.",
                "The Bousso bound is explicitly violated because the Null Energy Condition fails at the white hole horizon."
            ],
            correctAnswerIndex: 1,
            explanation: "The Bousso bound states that the entropy traversing a light-sheet is bounded by A/4G of the bounding surface. For a white hole, one must construct past-directed, converging light-sheets from a spatial surface. These sheets terminate at the past singularity, successfully bounding the entropy of the emerging matter."
        }
    ];

    // ============================================================================
    // ANIMATION LOGIC
    // ============================================================================

    function animate(time, speed, m) {
        // Update uniforms for shaders
        shaderUniforms.time.value = time * speed;

        // 1. Singularity & Shields
        if(m.singularity) {
            m.singularity.rotation.y = time * 2 * speed;
            m.singularity.rotation.x = time * 1.5 * speed;
            // Pulsing scale
            const pulse = 1.0 + Math.sin(time * 5 * speed) * 0.05;
            m.singularity.scale.set(pulse, pulse, pulse);
        }

        // 2. Quantum Containment Rings
        m.containmentRings.forEach(ring => {
            ring.mesh.rotateOnAxis(ring.axis, ring.speed * speed);
        });

        // 3. Turbine Stages (Counter-rotating)
        m.turbineStages.forEach(stage => {
            stage.mesh.rotation.y += stage.speed * speed;
        });

        // 4. Ejecta Particles (InstancedMesh)
        if (m.particles && m.particleData) {
            const pSys = m.particles;
            const pData = m.particleData;
            
            for(let i=0; i<pData.length; i++) {
                const p = pData[i];
                p.life += 0.01 * speed;
                
                if (p.life > p.maxLife || p.life === 0.01*speed) { // Reset
                    p.life = 0;
                    p.pos.set(0, 0, 0); // Originate from singularity
                    
                    // Violent random outward vector, heavily biased upwards into the funnel
                    p.vel.set(
                        (Math.random() - 0.5) * 400,
                        (Math.random() * 800) + 200, 
                        (Math.random() - 0.5) * 400
                    );
                }

                // Apply forces
                // Gravity pulling down slightly, but funnel pressure pushing up
                p.vel.y += 5 * speed; // Upward draft
                
                // Centripetal force inside funnel
                const r = Math.sqrt(p.pos.x*p.pos.x + p.pos.z*p.pos.z);
                if (r > 50 && p.pos.y > 100) {
                    // Push towards center
                    p.vel.x -= (p.pos.x * 0.02) * speed;
                    p.vel.z -= (p.pos.z * 0.02) * speed;
                }

                p.pos.addScaledVector(p.vel, 0.01 * speed);
                
                // Spin
                const s = p.scale * (1.0 - (p.life / p.maxLife)); // Shrink over time
                
                pDummy.position.copy(p.pos);
                pDummy.scale.set(s,s,s);
                pDummy.rotation.x += p.spin.x * speed * 0.1;
                pDummy.rotation.y += p.spin.y * speed * 0.1;
                pDummy.rotation.z += p.spin.z * speed * 0.1;
                pDummy.updateMatrix();
                
                pSys.setMatrixAt(i, pDummy.matrix);
            }
            pSys.instanceMatrix.needsUpdate = true;
        }

        // 5. Dark Matter Inhibitors (Bobbing and orbiting)
        m.inhibitors.forEach(inh => {
            inh.phase += 0.02 * speed;
            inh.mesh.position.y = inh.basePos.y + Math.sin(inh.phase) * 50;
            // Slow orbit around Y
            inh.mesh.position.applyAxisAngle(new THREE.Vector3(0,1,0), 0.005 * speed);
            inh.basePos.applyAxisAngle(new THREE.Vector3(0,1,0), 0.005 * speed);
            inh.mesh.rotation.x += 0.01 * speed;
            inh.mesh.rotation.y += 0.02 * speed;
        });

        // 6. Crawler Mechanics (Tires, Suspension, Pistons)
        // Simulate driving forward slowly
        const driveSpeed = 0.5 * speed;
        m.wheels.forEach(wheel => {
            // Roll tires
            wheel.rotation.z -= driveSpeed * 0.02; // Z is roll axis based on how they were built
        });

        m.suspensionArms.forEach((arm, idx) => {
            // Bounce chassis over rough planetary terrain
            const bounce = Math.sin(time * 2 * speed + arm.phase) * 20;
            arm.group.position.y = arm.baseHeight + bounce;
            
            // Adjust piston rod to follow bounce
            if(m.pistons[idx]) {
                // The casing is fixed to chassis mount, rod connects to axle
                // Since arm.group moves, the piston compresses
                m.pistons[idx].rod.position.y = 130 - bounce * 0.5;
            }
        });

        // 7. Energy Beams / Accelerators (Pulse emissive intensity)
        const beamPulse = Math.sin(time * 10 * speed) * 1.5 + 2.0;
        m.glowMaterials.forEach(mat => {
            if(mat.emissiveIntensity !== undefined) {
                // Base intensity + pulse
                mat.emissiveIntensity = 2.0 + beamPulse * 0.5;
            }
        });
        
        m.energyBeams.forEach((beam, idx) => {
            beam.rotation.z = time * (idx + 1) * speed;
        });
    }

    return {
        group,
        parts,
        description: "White Hole Tap (God Tier) - A massive planetary crawler engineered to harvest infinite matter and energy from a contained localized white hole singularity.",
        quizQuestions,
        animate: (time, speed) => animate(time, speed, meshes)
    };
}
