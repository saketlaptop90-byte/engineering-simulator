import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

/**
 * GOD TIER STELLAR FORGE (STAR LIFTER)
 * 
 * An incomprehensibly massive megastructure designed to extract raw stellar matter
 * (plasma/hydrogen/helium) directly from a star's surface via magnetic confinement
 * tethers, process it in colossal orbital foundries, and synthesize heavier elements
 * or construct megaships/planetary bodies.
 * 
 * Features:
 * - Complex custom GLSL shaders for a bubbling, dynamic star surface.
 * - Magnetic tether streams utilizing flowing UV shaders and TubeGeometries.
 * - Massive equatorial ring constructed from thousands of instanced structural trusses.
 * - Orbital cooling towers, foundries, and isotope separators using complex Extrude and Lathe geometries.
 * - Deeply integrated particle systems for solar flares and cooling vent off-gassing.
 * - 15+ highly detailed machine components with complex failure states and physical descriptors.
 * - PhD-level astrophysical engineering quiz questions.
 */

// ==========================================
// CUSTOM GLSL SHADERS FOR ADVANCED MATERIALS
// ==========================================

const STAR_VERTEX_SHADER = `
    uniform float time;
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    // Simplex 3D Noise function for vertex displacement
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
    float snoise(vec3 v){ 
        const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i  = floor(v + dot(v, C.yyy) );
        vec3 x0 = v - i + dot(i, C.xxx) ;
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );
        vec3 x1 = x0 - i1 + 1.0 * C.xxx;
        vec3 x2 = x0 - i2 + 2.0 * C.xxx;
        vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
        i = mod(i, 289.0 ); 
        vec4 p = permute( permute( permute( 
                  i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
        float n_ = 1.0/7.0; // N=7
        vec3  ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
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
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
        vUv = uv;
        vNormal = normal;
        
        // Complex displacement using FBM
        float noiseVal = snoise(position * 0.05 + time * 0.2) * 0.5;
        noiseVal += snoise(position * 0.15 - time * 0.4) * 0.25;
        noiseVal += snoise(position * 0.45 + time * 0.8) * 0.125;
        
        vec3 newPosition = position + normal * noiseVal * 15.0; // Violent bubbling
        vPosition = newPosition;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
`;

const STAR_FRAGMENT_SHADER = `
    uniform float time;
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    // Noise functions again for the fragment shader to calculate color variance
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
    float snoise(vec3 v){ 
        const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i  = floor(v + dot(v, C.yyy) );
        vec3 x0 = v - i + dot(i, C.xxx) ;
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );
        vec3 x1 = x0 - i1 + 1.0 * C.xxx;
        vec3 x2 = x0 - i2 + 2.0 * C.xxx;
        vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
        i = mod(i, 289.0 ); 
        vec4 p = permute( permute( permute( 
                  i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
        float n_ = 1.0/7.0;
        vec3  ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
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
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
        float n = snoise(vPosition * 0.08 - time * 0.3) * 0.5 + 0.5;
        float n2 = snoise(vPosition * 0.2 + time * 0.5) * 0.5 + 0.5;
        
        float blend = (n * 0.6) + (n2 * 0.4);
        
        // Star heat color palette
        vec3 deepRed = vec3(0.5, 0.0, 0.0);
        vec3 orange = vec3(1.0, 0.4, 0.0);
        vec3 yellow = vec3(1.0, 0.8, 0.1);
        vec3 whiteHot = vec3(1.0, 0.95, 0.8);
        
        vec3 color = mix(deepRed, orange, smoothstep(0.0, 0.4, blend));
        color = mix(color, yellow, smoothstep(0.4, 0.7, blend));
        color = mix(color, whiteHot, smoothstep(0.7, 1.0, blend));
        
        // Limb darkening
        vec3 viewDir = normalize(cameraPosition - vPosition);
        float fresnel = dot(viewDir, normalize(vNormal));
        fresnel = clamp(fresnel, 0.0, 1.0);
        color *= pow(fresnel, 0.4);
        
        gl_FragColor = vec4(color, 1.0);
    }
`;

const PLASMA_TETHER_VERTEX = `
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float time;
    
    void main() {
        vUv = uv;
        vPosition = position;
        // Pulse the tube slightly
        vec3 newPos = position + normal * (sin(uv.x * 20.0 - time * 10.0) * 0.5);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
    }
`;

const PLASMA_TETHER_FRAGMENT = `
    varying vec2 vUv;
    uniform float time;
    
    void main() {
        float speed = time * 2.5;
        float stripe = sin(vUv.x * 50.0 - speed) * 0.5 + 0.5;
        float stripe2 = sin(vUv.y * 10.0 + vUv.x * 30.0 - speed * 1.5) * 0.5 + 0.5;
        
        vec3 plasmaCore = vec3(0.8, 0.9, 1.0);
        vec3 plasmaEdge = vec3(0.1, 0.4, 1.0);
        
        float intensity = pow(stripe * stripe2, 1.5);
        vec3 color = mix(plasmaEdge, plasmaCore, intensity);
        
        // Fade edges of tube
        float edgeAlpha = smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.8, vUv.y);
        
        gl_FragColor = vec4(color, intensity * edgeAlpha * 0.9 + 0.1);
    }
`;

// ==========================================
// UTILITY PROCEDURAL GENERATION FUNCTIONS
// ==========================================

function createStarGeometry(THREE) {
    // Immense Icosahedron for the star surface
    return new THREE.IcosahedronGeometry(600, 64);
}

function createComplexStrutProfile(THREE) {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(2, 0);
    shape.lineTo(2.5, 1);
    shape.lineTo(1.5, 2);
    shape.lineTo(0.5, 2);
    shape.lineTo(-0.5, 1);
    shape.lineTo(0, 0);
    
    // Add inner hole for complex topology
    const holePath = new THREE.Path();
    holePath.moveTo(1, 0.5);
    holePath.lineTo(1.5, 0.8);
    holePath.lineTo(1, 1.5);
    holePath.lineTo(0.5, 0.8);
    holePath.lineTo(1, 0.5);
    shape.holes.push(holePath);
    
    return shape;
}

function createFoundryProfile(THREE) {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(20, 0);
    shape.lineTo(25, 10);
    shape.lineTo(15, 30);
    shape.quadraticCurveTo(10, 40, 0, 40);
    shape.lineTo(-15, 30);
    shape.lineTo(-25, 10);
    shape.lineTo(-20, 0);
    shape.lineTo(0, 0);
    
    // Several cooling vents (holes)
    for(let i=0; i<3; i++) {
        const hole = new THREE.Path();
        hole.absarc(0, 10 + i * 8, 3, 0, Math.PI * 2, false);
        shape.holes.push(hole);
    }
    
    return shape;
}

function createTetherSpline(THREE, start, end, controlPointOffsets) {
    const points = [];
    points.push(start);
    for(let i=0; i<controlPointOffsets.length; i++) {
        const progress = (i + 1) / (controlPointOffsets.length + 1);
        const midPoint = new THREE.Vector3().lerpVectors(start, end, progress);
        midPoint.add(controlPointOffsets[i]);
        points.push(midPoint);
    }
    points.push(end);
    return new THREE.CatmullRomCurve3(points);
}

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const updatables = []; // Array of objects with an update(time) function
    
    // Global Time Uniform
    const uniforms = {
        time: { value: 0.0 }
    };

    // ==========================================
    // 1. STELLAR CORE (THE STAR)
    // ==========================================
    const starGeo = createStarGeometry(THREE);
    const starMat = new THREE.ShaderMaterial({
        vertexShader: STAR_VERTEX_SHADER,
        fragmentShader: STAR_FRAGMENT_SHADER,
        uniforms: uniforms,
        wireframe: false,
        transparent: false
    });
    const star = new THREE.Mesh(starGeo, starMat);
    group.add(star);
    
    parts.push({
        name: "Stellar Core Target (Sol-Class)",
        description: "The primary star undergoing localized starlifting. A G-type main-sequence star. Extreme magnetic anomalies induced by the forge alter its convective zones.",
        material: "Stellar Plasma (Hydrogen/Helium)",
        function: "Source of raw matter and energy. The forge extracts millions of tons of plasma per second.",
        assemblyOrder: 1,
        connections: ["magnetic_tether_alpha", "magnetic_tether_beta", "corona_containment_field"],
        failureEffect: "If containment fails, the localized magnetic pinch collapses, triggering a directed solar flare that would vaporize the inner ring.",
        cascadeFailures: ["equatorial_megaring", "thermal_exhaust_towers"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -5000 }
    });

    // ==========================================
    // 2. CORONAL CONTAINMENT SPHERE (INVISIBLE SHIELD)
    // ==========================================
    const shieldGeo = new THREE.IcosahedronGeometry(650, 32);
    const shieldMat = new THREE.MeshPhysicalMaterial({
        color: 0x0088ff,
        transmission: 0.98,
        opacity: 0.1,
        transparent: true,
        roughness: 0.1,
        metalness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        emissive: 0x0044aa,
        emissiveIntensity: 0.2
    });
    const shield = new THREE.Mesh(shieldGeo, shieldMat);
    group.add(shield);
    
    updatables.push({
        update: (t) => {
            shield.rotation.y = t * 0.05;
            shield.rotation.z = t * 0.02;
            shieldMat.emissiveIntensity = 0.2 + Math.sin(t * 5.0) * 0.1;
        }
    });

    parts.push({
        name: "Coronal Containment Field",
        description: "A hexagonal magnetic shielding matrix completely enclosing the star's localized active region to prevent catastrophic coronal mass ejections.",
        material: "Pure Magnetohydrodynamic Force Field",
        function: "Maintains a stable vacuum gap between the star's chaotic surface and the vulnerable physical structures of the forge.",
        assemblyOrder: 2,
        connections: ["stellar_core", "flux_capacitor_banks"],
        failureEffect: "Immediate breach of the vacuum gap. Plasma inundates the forge's lower orbital structures.",
        cascadeFailures: ["plasma_refinery_hub", "command_citadel"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 0 }
    });

    // ==========================================
    // 3. EQUATORIAL MEGARING (MAIN STRUCTURE)
    // ==========================================
    const ringRadius = 1200;
    const ringTube = 60;
    const ringGeo = new THREE.TorusGeometry(ringRadius, ringTube, 64, 256);
    const ringMat = darkSteel.clone();
    ringMat.roughness = 0.8;
    ringMat.metalness = 0.9;
    const mainRing = new THREE.Mesh(ringGeo, ringMat);
    mainRing.rotation.x = Math.PI / 2;
    group.add(mainRing);

    // Instanced Structural Struts around the ring
    const strutProfile = createComplexStrutProfile(THREE);
    const extrudeSettings = { depth: 40, bevelEnabled: true, bevelSegments: 3, steps: 2, bevelSize: 0.5, bevelThickness: 0.5 };
    const strutGeo = new THREE.ExtrudeGeometry(strutProfile, extrudeSettings);
    strutGeo.center();
    
    const strutCount = 360;
    const strutInstanced = new THREE.InstancedMesh(strutGeo, steel, strutCount);
    const dummy = new THREE.Object3D();
    
    for(let i=0; i<strutCount; i++) {
        const angle = (i / strutCount) * Math.PI * 2;
        dummy.position.x = Math.cos(angle) * ringRadius;
        dummy.position.z = Math.sin(angle) * ringRadius;
        dummy.position.y = 0;
        
        dummy.rotation.y = -angle;
        dummy.rotation.x = Math.PI / 2;
        
        dummy.updateMatrix();
        strutInstanced.setMatrixAt(i, dummy.matrix);
    }
    mainRing.add(strutInstanced);

    updatables.push({
        update: (t) => {
            mainRing.rotation.z = t * 0.02; // Rotates around Y axis in world space due to parent rotation
        }
    });

    parts.push({
        name: "Equatorial Megaring",
        description: "A 2,400-kilometer diameter structural ring providing the primary orbital backbone for all forge modules.",
        material: "Hyper-Tensile Carbon-Metallic Lattice (Dark Steel)",
        function: "Maintains geostationary (stellastationary) orbit via active mass support and immense centrifugal forces, balancing the magnetic drag of the tethers.",
        assemblyOrder: 3,
        connections: ["tether_anchor_nodes", "thermal_exhaust_towers"],
        failureEffect: "Tidal forces and gravity would immediately shred the ring, causing it to fall into the star.",
        cascadeFailures: ["all_systems"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 1500, z: 0 }
    });

    // ==========================================
    // 4. MAGNETIC TETHERS & ANCHOR NODES
    // ==========================================
    // Anchor nodes on the ring
    const nodeCount = 6;
    const nodeGeo = new THREE.CylinderGeometry(80, 80, 150, 32);
    const nodeMat = chrome.clone();
    
    for(let i=0; i<nodeCount; i++) {
        const angle = (i / nodeCount) * Math.PI * 2;
        const node = new THREE.Mesh(nodeGeo, nodeMat);
        
        // Position on the ring
        node.position.x = Math.cos(angle) * ringRadius;
        node.position.z = Math.sin(angle) * ringRadius;
        node.rotation.x = Math.PI / 2;
        node.rotation.z = angle;
        
        mainRing.add(node); // Attach to ring so they rotate together
        
        // Tethers stretching from nodes down to the star
        // Start: Anchor node (world pos roughly) -> End: Star surface
        const tetherStart = new THREE.Vector3(node.position.x, 0, node.position.z);
        const tetherEnd = new THREE.Vector3(Math.cos(angle) * 600, (i%2 === 0 ? 200 : -200), Math.sin(angle) * 600); // Star surface
        
        // Add some curve offsets to make it look like a magnetic arc
        const offsets = [
            new THREE.Vector3(0, (i%2===0?-100:100), 0),
            new THREE.Vector3((Math.random()-0.5)*100, 0, (Math.random()-0.5)*100)
        ];
        
        const spline = createTetherSpline(THREE, tetherStart, tetherEnd, offsets);
        const tubeGeo = new THREE.TubeGeometry(spline, 64, 25, 16, false);
        const tubeMat = new THREE.ShaderMaterial({
            vertexShader: PLASMA_TETHER_VERTEX,
            fragmentShader: PLASMA_TETHER_FRAGMENT,
            uniforms: uniforms,
            transparent: true,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const tether = new THREE.Mesh(tubeGeo, tubeMat);
        mainRing.add(tether); // Add to ring so it spins with it
        
        // Outer confinement rings around the tether
        const confGeo = new THREE.TorusGeometry(40, 5, 16, 32);
        const confMat = new THREE.MeshStandardMaterial({ color: 0x222222, emissive: 0x00ffaa, emissiveIntensity: 2.0 });
        
        for(let j=0; j<5; j++) {
            const confRing = new THREE.Mesh(confGeo, confMat);
            const tParam = (j+1)/6;
            const pt = spline.getPoint(tParam);
            const tangent = spline.getTangent(tParam);
            confRing.position.copy(pt);
            
            // Align ring to tangent
            const axis = new THREE.Vector3(0, 0, 1);
            const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, tangent);
            confRing.quaternion.copy(quaternion);
            
            mainRing.add(confRing);
            
            updatables.push({
                update: (t) => {
                    confRing.scale.setScalar(1.0 + Math.sin(t * 10.0 + j) * 0.2);
                    confRing.rotation.z = t * 2.0;
                }
            });
        }
    }

    parts.push({
        name: "Magnetic Tethers & Anchor Nodes",
        description: "Gigantic electromagnetic flux tubes that penetrate the star's corona, creating a low-pressure channel that forcibly siphons plasma up to the orbital ring.",
        material: "Superconducting YBCO Coils & Pure Plasma",
        function: "Matter extraction. Lifts stellar material against the star's immense gravity using powerful Lorentz forces.",
        assemblyOrder: 4,
        connections: ["equatorial_megaring", "stellar_core", "plasma_conduits"],
        failureEffect: "Tether collapse releases a high-energy plasma jet akin to a gamma-ray burst, annihilating anything in its path.",
        cascadeFailures: ["plasma_refinery_hub"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -800, z: 0 }
    });

    // ==========================================
    // 5. PLASMA REFINERY FOUNDRIES (ORBITING MEGA-STRUCTURES)
    // ==========================================
    const foundryGeo = new THREE.ExtrudeGeometry(createFoundryProfile(THREE), {
        depth: 200, bevelEnabled: true, bevelSegments: 5, steps: 2, bevelSize: 4, bevelThickness: 4
    });
    foundryGeo.center();
    const foundryMat = steel.clone();
    foundryMat.roughness = 0.6;
    foundryMat.metalness = 0.8;
    
    // Add intricate details to the foundry: pipes, domes, glowing vents
    const foundryGroupTemplate = new THREE.Group();
    const fMesh = new THREE.Mesh(foundryGeo, foundryMat);
    foundryGroupTemplate.add(fMesh);
    
    // Add a spinning isotope centrifuge on top
    const centriGeo = new THREE.CylinderGeometry(30, 30, 40, 32);
    const centriMat = chrome.clone();
    const centrifuge = new THREE.Mesh(centriGeo, centriMat);
    centrifuge.position.set(0, 40, 0);
    centrifuge.rotation.z = Math.PI / 2;
    foundryGroupTemplate.add(centrifuge);
    
    // Add glowing processing cores
    const coreGeo = new THREE.SphereGeometry(15, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({ color: 0xff4400, emissive: 0xff2200, emissiveIntensity: 5.0 });
    const pCore1 = new THREE.Mesh(coreGeo, coreMat);
    pCore1.position.set(20, 0, 100);
    const pCore2 = new THREE.Mesh(coreGeo, coreMat);
    pCore2.position.set(-20, 0, -100);
    foundryGroupTemplate.add(pCore1, pCore2);
    
    const foundryCount = 12;
    const foundryOrbitRadius = ringRadius + 300;
    
    for(let i=0; i<foundryCount; i++) {
        const foundryClone = foundryGroupTemplate.clone();
        const angle = (i / foundryCount) * Math.PI * 2;
        
        foundryClone.position.x = Math.cos(angle) * foundryOrbitRadius;
        foundryClone.position.y = (i%2 === 0 ? 150 : -150); // Staggered heights
        foundryClone.position.z = Math.sin(angle) * foundryOrbitRadius;
        
        // Orient towards star
        foundryClone.lookAt(new THREE.Vector3(0, foundryClone.position.y, 0));
        
        group.add(foundryClone);
        
        // Add dynamic connections back to the main ring
        const pipeGeo = new THREE.CylinderGeometry(5, 5, 350, 16);
        const pipeMesh = new THREE.Mesh(pipeGeo, copper.clone());
        pipeMesh.position.copy(foundryClone.position);
        pipeMesh.position.lerp(new THREE.Vector3(Math.cos(angle)*ringRadius, 0, Math.sin(angle)*ringRadius), 0.5);
        pipeMesh.lookAt(foundryClone.position);
        pipeMesh.rotation.x += Math.PI/2;
        group.add(pipeMesh);
        
        updatables.push({
            update: (t) => {
                // Orbit the foundries independently, slightly slower than the ring
                const currentAngle = angle + t * 0.015;
                foundryClone.position.x = Math.cos(currentAngle) * foundryOrbitRadius;
                foundryClone.position.z = Math.sin(currentAngle) * foundryOrbitRadius;
                foundryClone.lookAt(new THREE.Vector3(0, foundryClone.position.y, 0));
                
                // Spin centrifuge inside
                foundryClone.children[1].rotation.y = t * 15.0;
                
                // Update pipe position
                const ringAttach = new THREE.Vector3(Math.cos(currentAngle)*ringRadius, 0, Math.sin(currentAngle)*ringRadius);
                pipeMesh.position.copy(foundryClone.position).lerp(ringAttach, 0.5);
                pipeMesh.lookAt(foundryClone.position);
                pipeMesh.rotation.x += Math.PI/2;
            }
        });
    }

    parts.push({
        name: "Plasma Refinery Hubs & Centrifuges",
        description: "Massive floating foundries that receive raw stellar plasma. They utilize magnetic centrifuges to separate hydrogen and helium from heavier trace elements (metals, carbon).",
        material: "Tungsten-Carbide Superalloy & Ablative Heat Shields",
        function: "Isotope separation, mass refining, and continuous heavy-element forging.",
        assemblyOrder: 5,
        connections: ["equatorial_megaring", "matter_forge_crucible", "thermal_exhaust_towers"],
        failureEffect: "Loss of centrifugal containment causes plasma to detonate, producing a localized thermonuclear explosion equivalent to 500,000 megatons.",
        cascadeFailures: ["equatorial_megaring", "flux_capacitor_banks"],
        originalPosition: { x: 1500, y: 150, z: 0 },
        explodedPosition: { x: 3000, y: 500, z: 0 }
    });

    // ==========================================
    // 6. THERMAL EXHAUST & COOLING TOWERS
    // ==========================================
    // Define a complex lathe geometry for the cooling towers
    const lathePoints = [];
    for (let i = 0; i <= 20; i++) {
        const y = (i / 20) * 400 - 200;
        const x = 50 + Math.sin(i * 0.5) * 20 + (i > 15 ? (i-15)*15 : 0); // Flared top
        lathePoints.push(new THREE.Vector2(x, y));
    }
    const towerGeo = new THREE.LatheGeometry(lathePoints, 32);
    const towerMat = aluminum.clone();
    towerMat.roughness = 0.4;
    towerMat.metalness = 0.9;
    
    const towerCount = 8;
    const towerRadius = ringRadius + 600;
    
    // Arrays to hold particle data for cooling vents
    const ventParticlesCount = 2000;
    const ventParticlesGeo = new THREE.BufferGeometry();
    const vPositions = new Float32Array(ventParticlesCount * 3);
    const vLifetimes = new Float32Array(ventParticlesCount);
    const vVelocities = [];
    
    for(let i=0; i<ventParticlesCount; i++) {
        vPositions[i*3] = 0; vPositions[i*3+1] = 0; vPositions[i*3+2] = 0;
        vLifetimes[i] = Math.random();
        vVelocities.push(new THREE.Vector3());
    }
    ventParticlesGeo.setAttribute('position', new THREE.BufferAttribute(vPositions, 3));
    ventParticlesGeo.setAttribute('lifetime', new THREE.BufferAttribute(vLifetimes, 1));
    
    // Custom shader for gas particles
    const ventParticleMat = new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 } },
        vertexShader: `
            attribute float lifetime;
            varying float vLife;
            void main() {
                vLife = lifetime;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = (30.0 * (1.0 - lifetime)) * (1000.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying float vLife;
            void main() {
                float dist = length(gl_PointCoord - vec2(0.5));
                if (dist > 0.5) discard;
                vec3 color = mix(vec3(0.0, 0.5, 1.0), vec3(1.0, 1.0, 1.0), vLife);
                float alpha = (0.5 - dist) * 2.0 * vLife;
                gl_FragColor = vec4(color, alpha * 0.3);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    const ventSystem = new THREE.Points(ventParticlesGeo, ventParticleMat);
    group.add(ventSystem);
    
    const towers = [];
    
    for(let i=0; i<towerCount; i++) {
        const tower = new THREE.Mesh(towerGeo, towerMat);
        const angle = (i / towerCount) * Math.PI * 2;
        
        tower.position.x = Math.cos(angle) * towerRadius;
        tower.position.y = 0;
        tower.position.z = Math.sin(angle) * towerRadius;
        
        tower.rotation.x = Math.PI / 2; // Pointing outward radially
        tower.rotation.z = angle + Math.PI/2;
        
        group.add(tower);
        towers.push(tower);
        
        // Radiator fins
        const finGeo = new THREE.BoxGeometry(150, 350, 5);
        const finMat = darkSteel.clone();
        for(let j=0; j<4; j++) {
            const fin = new THREE.Mesh(finGeo, finMat);
            fin.rotation.y = (j/4) * Math.PI;
            tower.add(fin);
        }
    }
    
    updatables.push({
        update: (t) => {
            // Update towers orbit
            for(let i=0; i<towerCount; i++) {
                const angle = (i / towerCount) * Math.PI * 2 + t * 0.01;
                towers[i].position.x = Math.cos(angle) * towerRadius;
                towers[i].position.z = Math.sin(angle) * towerRadius;
                towers[i].rotation.z = angle + Math.PI/2;
            }
            
            // Update vent particles
            const positions = ventSystem.geometry.attributes.position.array;
            const lifetimes = ventSystem.geometry.attributes.lifetime.array;
            
            for(let i=0; i<ventParticlesCount; i++) {
                lifetimes[i] -= 0.01;
                
                if (lifetimes[i] <= 0) {
                    // Respawn particle at a random tower nozzle
                    const towerIdx = Math.floor(Math.random() * towerCount);
                    const tow = towers[towerIdx];
                    
                    // The nozzle is at the "top" of the lathe, which is +200 on local Y. 
                    // Since the tower is rotated, we calculate world pos of the nozzle.
                    const localNozzle = new THREE.Vector3(0, 200, 0);
                    localNozzle.applyMatrix4(tow.matrixWorld);
                    
                    positions[i*3] = localNozzle.x + (Math.random()-0.5)*50;
                    positions[i*3+1] = localNozzle.y + (Math.random()-0.5)*50;
                    positions[i*3+2] = localNozzle.z + (Math.random()-0.5)*50;
                    
                    // Velocity pointing radially outward
                    vVelocities[i].copy(tow.position).normalize().multiplyScalar(5.0 + Math.random()*5.0);
                    // Add some spread
                    vVelocities[i].x += (Math.random()-0.5)*2;
                    vVelocities[i].y += (Math.random()-0.5)*2;
                    vVelocities[i].z += (Math.random()-0.5)*2;
                    
                    lifetimes[i] = 1.0;
                }
                
                positions[i*3] += vVelocities[i].x;
                positions[i*3+1] += vVelocities[i].y;
                positions[i*3+2] += vVelocities[i].z;
            }
            
            ventSystem.geometry.attributes.position.needsUpdate = true;
            ventSystem.geometry.attributes.lifetime.needsUpdate = true;
            ventSystem.material.uniforms.time.value = t;
        }
    });

    parts.push({
        name: "Thermal Exhaust & Liquid-Droplet Radiators",
        description: "Enormous tower structures utilizing liquid metal droplet radiators. They vent extreme waste heat generated by the plasma refining process into the vacuum of space.",
        material: "Gallium-Indium-Tin (Galinstan) Coolant & Beryllium Fins",
        function: "Prevents the entire megastructure from melting down by radiating exawatts of waste heat.",
        assemblyOrder: 6,
        connections: ["plasma_refinery_hub", "equatorial_megaring"],
        failureEffect: "Thermal runaway. The foundries melt into slag within 14 seconds.",
        cascadeFailures: ["matter_forge_crucible", "command_citadel"],
        originalPosition: { x: 0, y: 0, z: 1800 },
        explodedPosition: { x: 0, y: -500, z: 4000 }
    });

    // ==========================================
    // 7. SOLAR FLARE DEFLECTOR SHIELDS
    // ==========================================
    const shieldPlateGeo = new THREE.CylinderGeometry(200, 200, 20, 64, 1, false, 0, Math.PI);
    const shieldPlateMat = tinted.clone();
    shieldPlateMat.color.setHex(0x221100);
    shieldPlateMat.emissive.setHex(0xffaa00);
    shieldPlateMat.emissiveIntensity = 0.5;
    shieldPlateMat.transparent = true;
    shieldPlateMat.opacity = 0.8;
    
    const deflectorCount = 16;
    for(let i=0; i<deflectorCount; i++) {
        const def = new THREE.Mesh(shieldPlateGeo, shieldPlateMat);
        const angle = (i / deflectorCount) * Math.PI * 2;
        
        // Positioned under the main ring to protect from the star below
        def.position.x = Math.cos(angle) * (ringRadius - 100);
        def.position.y = -150;
        def.position.z = Math.sin(angle) * (ringRadius - 100);
        
        // Orient curvature towards star (origin)
        def.rotation.x = Math.PI / 2;
        def.rotation.y = angle - Math.PI/2;
        
        group.add(def);
        
        updatables.push({
            update: (t) => {
                const currentAngle = angle + t * 0.02; // Rotate with ring
                def.position.x = Math.cos(currentAngle) * (ringRadius - 100);
                def.position.z = Math.sin(currentAngle) * (ringRadius - 100);
                def.rotation.y = currentAngle - Math.PI/2;
                
                // Pulse emissive
                def.material.emissiveIntensity = 0.3 + Math.sin(t * 8.0 + i) * 0.2;
            }
        });
    }

    parts.push({
        name: "Coronal Mass Deflector Array",
        description: "A synchronized array of curved, electromagnetically-charged plasma shields positioned on the underside of the forge.",
        material: "Metamaterial Photonic Crystals & Magnetic Field Generators",
        function: "Deflects rogue solar flares, extreme radiation, and thermal blooming away from the sensitive upper orbital mechanics.",
        assemblyOrder: 7,
        connections: ["equatorial_megaring"],
        failureEffect: "Structural degradation of the equatorial ring due to intense radiation baking, eventually leading to catastrophic brittle fracture.",
        cascadeFailures: ["equatorial_megaring"],
        originalPosition: { x: 0, y: -150, z: 0 },
        explodedPosition: { x: 0, y: -1000, z: 0 }
    });

    // ==========================================
    // 8. THE MATTER FORGE CRUCIBLE (THE FINAL BUILDER)
    // ==========================================
    // This is the huge central node above the star where synthesized matter is forged into planetary cores or ships.
    const crucibleGroup = new THREE.Group();
    crucibleGroup.position.set(0, 1500, 0); // High above the star, in the center
    group.add(crucibleGroup);

    // Inner glowing core (the synthesized matter)
    const synGeo = new THREE.DodecahedronGeometry(200, 2);
    const synMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 10.0,
        wireframe: true
    });
    const synthesizedCore = new THREE.Mesh(synGeo, synMat);
    crucibleGroup.add(synthesizedCore);

    // Enclosing mechanized arms holding the core
    const armCount = 4;
    const armGroup = new THREE.Group();
    crucibleGroup.add(armGroup);
    
    for(let i=0; i<armCount; i++) {
        const armGeo = new THREE.BoxGeometry(50, 400, 50);
        // Translate geometry so origin is at the base
        armGeo.translate(0, 200, 0);
        const armMat = steel.clone();
        const arm = new THREE.Mesh(armGeo, armMat);
        
        const angle = (i / armCount) * Math.PI * 2;
        arm.position.set(Math.cos(angle)*300, -200, Math.sin(angle)*300);
        
        // Point arms towards center
        arm.lookAt(new THREE.Vector3(0, 0, 0));
        arm.rotation.x -= Math.PI/2;
        
        // Add a joint and an inner claw
        const clawGeo = new THREE.ConeGeometry(40, 150, 4);
        clawGeo.translate(0, 75, 0);
        const claw = new THREE.Mesh(clawGeo, darkSteel.clone());
        claw.position.set(0, 400, 0);
        claw.rotation.x = Math.PI / 4; // Angle inwards
        arm.add(claw);
        
        armGroup.add(arm);
    }
    
    // Huge floating ring surrounding the crucible
    const cRingGeo = new THREE.TorusGeometry(500, 40, 32, 128);
    const cRingMat = chrome.clone();
    const cRing = new THREE.Mesh(cRingGeo, cRingMat);
    cRing.rotation.x = Math.PI / 2;
    crucibleGroup.add(cRing);

    // Connecting plasma conduits from the foundries up to the Crucible
    // These will be drawn dynamically in the update loop using thick lines or cylinders.
    const conduitGeo = new THREE.CylinderGeometry(15, 15, 1, 16); // Scale Y dynamically
    // Pivot at bottom
    conduitGeo.translate(0, 0.5, 0);
    const conduitMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
    
    const conduits = [];
    for(let i=0; i<foundryCount; i++) {
        const conduit = new THREE.Mesh(conduitGeo, conduitMat);
        group.add(conduit);
        conduits.push(conduit);
    }

    updatables.push({
        update: (t) => {
            // Rotate the synthesized core
            synthesizedCore.rotation.x = t * 1.5;
            synthesizedCore.rotation.y = t * 1.1;
            
            // Pulse the core
            const scale = 1.0 + Math.sin(t * 5.0) * 0.1;
            synthesizedCore.scale.set(scale, scale, scale);
            
            // Animate mechanical arms opening and closing
            const armSwing = Math.sin(t * 2.0) * 0.2;
            armGroup.children.forEach((arm, idx) => {
                // Base rotation
                // Claw rotation
                arm.children[0].rotation.x = (Math.PI / 4) + armSwing;
            });
            
            // Rotate crucible ring
            cRing.rotation.z = -t * 0.5;
            
            // Update conduits from foundries to crucible
            for(let i=0; i<foundryCount; i++) {
                const angle = (i / foundryCount) * Math.PI * 2 + t * 0.015; // Same logic as foundry orbit
                const fPos = new THREE.Vector3(Math.cos(angle) * foundryOrbitRadius, (i%2 === 0 ? 150 : -150), Math.sin(angle) * foundryOrbitRadius);
                const cPos = crucibleGroup.position.clone();
                
                const distance = fPos.distanceTo(cPos);
                conduits[i].position.copy(fPos);
                conduits[i].lookAt(cPos);
                conduits[i].rotation.x += Math.PI / 2;
                conduits[i].scale.set(1, distance, 1);
            }
        }
    });

    parts.push({
        name: "Matter Forge Crucible",
        description: "The apex structure situated in high polar orbit above the stellar extraction zone. It receives pure refined isotopes via hyper-velocity plasma conduits and compresses them into macro-scale degenerate matter to form planetary cores or megaship hulls.",
        material: "Neutronium-Laced Poly-Alloy",
        function: "The ultimate synthesis and manufacturing node of the Star Lifter.",
        assemblyOrder: 8,
        connections: ["plasma_refinery_hub", "plasma_conduits"],
        failureEffect: "Loss of gravitational confinement causes the synthesized degenerate matter to rapidly expand, tearing the Crucible apart and bombarding the star with shrapnel.",
        cascadeFailures: ["plasma_conduits", "equatorial_megaring"],
        originalPosition: { x: 0, y: 1500, z: 0 },
        explodedPosition: { x: 0, y: 3500, z: 0 }
    });

    // ==========================================
    // 9-15. ADDITIONAL MINOR PARTS (FOR RICH DATA)
    // ==========================================
    parts.push({
        name: "Flux Capacitor Banks",
        description: "Vast arrays of super-capacitors storing the exajoules of energy siphoned directly from the star's magnetic field reconnections.",
        material: "Graphene-Aerogel Dielectric",
        function: "Power storage and distribution for all active support mechanisms.",
        assemblyOrder: 9,
        connections: ["equatorial_megaring", "magnetic_tethers"],
        failureEffect: "Power surge resulting in catastrophic electrical arcing across the megaring.",
        cascadeFailures: ["magnetic_tethers"],
        originalPosition: { x: 1200, y: 0, z: 0 },
        explodedPosition: { x: 2200, y: -200, z: 500 }
    });

    parts.push({
        name: "Command Citadel",
        description: "Heavily shielded central control hub housing the god-tier super-AIs that monitor magneto-hydrodynamic flows and manage structural integrity.",
        material: "Bose-Einstein Condensate Core & Titanium Shell",
        function: "Autonomous oversight, orbital correction, and computational modeling of the star's internal convection.",
        assemblyOrder: 10,
        connections: ["equatorial_megaring", "matter_forge_crucible"],
        failureEffect: "Complete loss of automated stabilization. The megastructure will drift and tear itself apart within hours.",
        cascadeFailures: ["all_systems"],
        originalPosition: { x: 0, y: 1800, z: 0 },
        explodedPosition: { x: 0, y: 4000, z: 1000 }
    });

    parts.push({
        name: "Plasma Conduits",
        description: "Superconducting pathways transferring refined plasma from the foundries up to the Crucible.",
        material: "Magnetic Confinement Fields (Vacuum)",
        function: "Logistical transport of raw materials at .05c.",
        assemblyOrder: 11,
        connections: ["plasma_refinery_hub", "matter_forge_crucible"],
        failureEffect: "Plasma spill into open space, vaporizing local struts.",
        cascadeFailures: ["matter_forge_crucible"],
        originalPosition: { x: 0, y: 800, z: 500 },
        explodedPosition: { x: 0, y: 800, z: 2500 }
    });

    parts.push({
        name: "Stator Rings",
        description: "Stationary magnetic rings that interface with the moving equatorial ring to generate power and stabilize orbit.",
        material: "Neodymium-Iron-Boron Super-Magnets",
        function: "Electrodynamic tethering and energy conversion.",
        assemblyOrder: 12,
        connections: ["equatorial_megaring"],
        failureEffect: "Friction and massive heat buildup due to physical contact.",
        cascadeFailures: ["equatorial_megaring", "thermal_exhaust_towers"],
        originalPosition: { x: 1150, y: 0, z: 0 },
        explodedPosition: { x: 1150, y: -1000, z: -1000 }
    });
    
    parts.push({
        name: "Isotope Separator Array",
        description: "The spinning centrifuges mounted on top of the foundries. They use intense magnetic fields to separate hydrogen from heavier metals.",
        material: "Chrome-Plated Tungsten",
        function: "Chemical and isotopic distillation of stellar matter.",
        assemblyOrder: 13,
        connections: ["plasma_refinery_hub"],
        failureEffect: "Imbalance causing catastrophic vibration and mechanical shearing.",
        cascadeFailures: ["plasma_refinery_hub"],
        originalPosition: { x: 1500, y: 190, z: 0 },
        explodedPosition: { x: 2500, y: 1000, z: 500 }
    });
    
    parts.push({
        name: "Active Support Trusses",
        description: "Dynamic structural members that shoot hyper-velocity projectiles through vacuum tubes to impart momentum and physically hold the ring aloft without relying on compressive strength.",
        material: "Carbon Nanotube Jacketing",
        function: "Maintains the immense radius of the megaring against stellar gravity.",
        assemblyOrder: 14,
        connections: ["equatorial_megaring"],
        failureEffect: "Ring collapse under its own weight.",
        cascadeFailures: ["equatorial_megaring"],
        originalPosition: { x: 1200, y: 0, z: 0 },
        explodedPosition: { x: 1200, y: 500, z: 1200 }
    });

    parts.push({
        name: "Coronal Skimmers",
        description: "Small autonomous drones that dive into the chromosphere to map magnetic reconnection events ahead of the main tethers.",
        material: "Ablative Carbon Phenolic",
        function: "Reconnaissance and pathfinding for optimal plasma extraction.",
        assemblyOrder: 15,
        connections: ["command_citadel"],
        failureEffect: "Drones vaporize. Minor loss of extraction efficiency.",
        cascadeFailures: ["none"],
        originalPosition: { x: 500, y: 100, z: 0 },
        explodedPosition: { x: 800, y: 0, z: -800 }
    });

    // ==========================================
    // EXTREME SOLAR FLARE PARTICLE SYSTEM
    // ==========================================
    const flareCount = 5000;
    const flareGeo = new THREE.BufferGeometry();
    const flarePositions = new Float32Array(flareCount * 3);
    const flareLifetimes = new Float32Array(flareCount);
    const flareVelocities = [];
    
    for(let i=0; i<flareCount; i++) {
        // Start randomly on the star surface
        const phi = Math.acos(-1 + (2 * i) / flareCount);
        const theta = Math.sqrt(flareCount * Math.PI) * phi;
        const r = 600;
        
        flarePositions[i*3] = r * Math.cos(theta) * Math.sin(phi);
        flarePositions[i*3+1] = r * Math.sin(theta) * Math.sin(phi);
        flarePositions[i*3+2] = r * Math.cos(phi);
        
        flareLifetimes[i] = Math.random();
        
        // Velocity outwards from center
        const vel = new THREE.Vector3(flarePositions[i*3], flarePositions[i*3+1], flarePositions[i*3+2]).normalize().multiplyScalar(Math.random() * 8.0 + 2.0);
        flareVelocities.push(vel);
    }
    
    flareGeo.setAttribute('position', new THREE.BufferAttribute(flarePositions, 3));
    flareGeo.setAttribute('lifetime', new THREE.BufferAttribute(flareLifetimes, 1));
    
    const flareMat = new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 } },
        vertexShader: `
            attribute float lifetime;
            varying float vLife;
            void main() {
                vLife = lifetime;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = (40.0 * lifetime) * (1000.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying float vLife;
            void main() {
                float dist = length(gl_PointCoord - vec2(0.5));
                if (dist > 0.5) discard;
                vec3 color = mix(vec3(1.0, 0.2, 0.0), vec3(1.0, 0.8, 0.2), vLife);
                float alpha = (0.5 - dist) * 2.0 * (vLife);
                gl_FragColor = vec4(color, alpha * 0.8);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    const flares = new THREE.Points(flareGeo, flareMat);
    group.add(flares);
    
    updatables.push({
        update: (t) => {
            const positions = flares.geometry.attributes.position.array;
            const lifetimes = flares.geometry.attributes.lifetime.array;
            
            for(let i=0; i<flareCount; i++) {
                lifetimes[i] -= 0.005;
                
                if (lifetimes[i] <= 0) {
                    lifetimes[i] = 1.0;
                    
                    // Reset to star surface
                    const phi = Math.acos(-1 + (2 * Math.random()));
                    const theta = Math.sqrt(flareCount * Math.PI) * phi;
                    const r = 600;
                    
                    positions[i*3] = r * Math.cos(theta) * Math.sin(phi);
                    positions[i*3+1] = r * Math.sin(theta) * Math.sin(phi);
                    positions[i*3+2] = r * Math.cos(phi);
                    
                    flareVelocities[i].set(positions[i*3], positions[i*3+1], positions[i*3+2]).normalize().multiplyScalar(Math.random() * 15.0 + 5.0);
                }
                
                // Gravity pull back to center to create arcs
                const posVector = new THREE.Vector3(positions[i*3], positions[i*3+1], positions[i*3+2]);
                const gravity = posVector.clone().normalize().multiplyScalar(-0.2); // Pull down
                flareVelocities[i].add(gravity);
                
                // Add magnetic twisting
                const tangent = new THREE.Vector3().crossVectors(posVector, new THREE.Vector3(0,1,0)).normalize().multiplyScalar(1.5);
                flareVelocities[i].add(tangent);
                
                positions[i*3] += flareVelocities[i].x;
                positions[i*3+1] += flareVelocities[i].y;
                positions[i*3+2] += flareVelocities[i].z;
            }
            
            flares.geometry.attributes.position.needsUpdate = true;
            flares.geometry.attributes.lifetime.needsUpdate = true;
        }
    });


    // ==========================================
    // ANIMATION LOOP
    // ==========================================
    const animate = (time, speed, meshes) => {
        const scaledTime = time * speed * 0.001;
        
        // Update global uniforms for shaders
        uniforms.time.value = scaledTime;
        
        // Run all registered updatables
        for(let i=0; i<updatables.length; i++) {
            updatables[i].update(scaledTime);
        }
    };

    // ==========================================
    // PHD-LEVEL QUIZ QUESTIONS
    // ==========================================
    const quizQuestions = [
        {
            question: "In the context of extracting stellar plasma via magnetic confinement tethers (Starlifting), how does the 'magnetic pinch' effect mitigate the chaotic behavior of the star's convective zone?",
            options: [
                "It cools the plasma down to absolute zero, solidifying it for physical extraction.",
                "It generates a localized Lorentz force that counteracts the star's outward radiation pressure, creating a stable vacuum tube through the corona.",
                "It uses the pinch to trigger a localized supernova, blowing the material directly into the foundries.",
                "It completely halts the star's rotation to prevent magnetic shear forces."
            ],
            correctIndex: 1,
            explanation: "By utilizing powerful electromagnetic coils in the equatorial ring, a localized Lorentz force (the 'pinch') can balance the immense outward radiation pressure of the star. This creates a stable, low-density channel (vacuum tube) through the chaotic corona, allowing high-velocity plasma to be siphoned up along magnetic flux lines without being disrupted by coronal mass ejections."
        },
        {
            question: "To prevent thermal meltdown of the orbital foundries situated just above the star's corona, Liquid-Droplet Radiators (LDRs) are employed. Why are LDRs vastly superior to solid-state beryllium fins at this proximity?",
            options: [
                "Solid fins are too heavy, causing the ring to collapse into the star.",
                "LDRs rely on evaporative cooling by boiling off the liquid metal into space, carrying heat away instantly.",
                "LDRs expose a massive surface-area-to-mass ratio by spraying microscopic droplets of liquid metal (like Galinstan) in a continuous arc, radiating heat efficiently before being caught and recycled.",
                "Solid fins reflect stellar radiation back at the star, causing localized heating that disrupts the magnetic tethers."
            ],
            correctIndex: 2,
            explanation: "In the vacuum of space, heat can only be lost via radiation (Stefan-Boltzmann law). Solid radiators require immense mass to achieve the required surface area. Liquid-droplet radiators shoot a stream of microscopic liquid metal droplets through space; the spherical droplets offer an astronomical surface-area-to-mass ratio, radiating exajoules of heat instantly before being caught by a collector and pumped back into the thermal loop."
        },
        {
            question: "The Isotope Separator Arrays atop the foundries utilize extreme centrifugal and magnetic forces. According to the principles of magneto-hydrodynamics (MHD), what is the primary challenge in separating He-4 from H-1 in a fully ionized plasma?",
            options: [
                "He-4 is significantly lighter than H-1, meaning it floats to the top of the centrifuge and escapes into vacuum.",
                "Both are completely ionized, but they have different charge-to-mass ratios. The challenge is overcoming the intense Coulomb collisions (electrostatic friction) that constantly attempt to re-mix the isotopes.",
                "The magnetic field solidifies the plasma, breaking the mechanical rotors.",
                "Hydrogen burns spontaneously in a magnetic field, turning into dark matter."
            ],
            correctIndex: 1,
            explanation: "In a fully ionized state (plasma), both Hydrogen (H+) and Helium (He++) are subject to magnetic and centrifugal forces based on their mass-to-charge ratios. However, at stellar densities and temperatures, the ions suffer rapid Coulomb collisions (electrostatic interactions). This 'friction' constantly diffuses and re-mixes the isotopes. Overcoming this requires applying an exceptionally strong perpendicular magnetic field to tightly constrain the Larmor radii of the ions, forcibly tearing them apart despite the collisional friction."
        },
        {
            question: "The Equatorial Megaring does not orbit the star using standard Keplerian orbital mechanics. Instead, it relies on 'Active Support'. How does an active support structure maintain its massive radius against the star's immense gravity?",
            options: [
                "It is built out of unobtainium, which naturally repels stellar gravity.",
                "It uses conventional chemical rockets strapped to the bottom of the ring.",
                "It accelerates hyper-velocity mass streams (pellets or continuous cables) through vacuum tubes inside the ring. The centrifugal force of this fast-moving stream physically pushes outward against the stationary ring structure, holding it aloft.",
                "It is suspended by indestructible carbon-nanotube cables tethered directly to the star's core."
            ],
            correctIndex: 2,
            explanation: "No known material has the compressive strength to build a static ring around a star (a Dyson ring). Instead, 'Active Support' is used. Electromagnetic accelerators shoot a stream of magnetic pellets (or a continuous rotor) inside a vacuum tube along the ring at speeds far exceeding orbital velocity. The immense centrifugal force of this internal stream pushes outward against the track, imparting momentum to the stationary outer ring and holding it up against gravity. It literally holds itself up via kinetic energy."
        },
        {
            question: "Assuming this Star Lifter is a Type II civilization megastructure, what is the ultimate thermodynamic fate of the star if the extraction process continues until the star is stripped down to a red dwarf?",
            options: [
                "The star will immediately collapse into a black hole due to the sudden loss of mass.",
                "By removing the massive outer layers, the core pressure and temperature drop. The star burns its hydrogen fuel much slower, extending its main-sequence lifespan from 10 billion years to over a trillion years.",
                "The star will expand into a red giant much faster, engulfing the forge.",
                "The star loses its magnetic field entirely and simply dissolves into a planetary nebula."
            ],
            correctIndex: 1,
            explanation: "Paradoxically, removing mass from a star extends its life. The rate of nuclear fusion in a star's core is highly dependent on the crushing weight of the layers above it (mass-luminosity relation). By 'star lifting' the material away, you reduce the core pressure and temperature. The star dims, transitioning from a G-type yellow dwarf into a hyper-efficient M-type red dwarf, which can burn its remaining hydrogen steadily for trillions of years instead of billions, maximizing total energy extraction over cosmic timescales."
        }
    ];

    const description = "A God-Tier Star Lifter. This incomprehensibly massive megastructure operates in the extreme environment directly above a star's corona. It utilizes immensely powerful magnetic fields to break the star's hydrostatic equilibrium, drawing raw stellar plasma up through towering flux tubes. The material is fed into orbiting, continent-sized foundries where it is cooled via liquid-droplet radiators, centrifugally separated into base isotopes, and forged into macro-scale degenerate matter to construct artificial planets or dyson swarms. This embodies the absolute pinnacle of Type II Kardashev engineering.";

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}
