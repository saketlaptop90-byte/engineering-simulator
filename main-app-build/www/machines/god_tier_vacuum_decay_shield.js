import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

/**
 * GOD TIER: VACUUM DECAY SHIELD
 * ---------------------------------------------------------
 * A galaxy-sized megastructure designed to halt the expansion 
 * of a false vacuum decay bubble. The most extreme engineering
 * project ever conceived. 
 * ---------------------------------------------------------
 */

// ============================================================================
// ADVANCED PROCEDURAL NOISE (SIMPLEX 3D) FOR QUANTUM FLUCTUATIONS
// ============================================================================
const F3 = 1.0 / 3.0;
const G3 = 1.0 / 6.0;
class SimplexNoise {
    constructor(random = Math.random) {
        this.p = new Uint8Array(256);
        for (let i = 0; i < 256; i++) this.p[i] = Math.floor(random() * 256);
        this.perm = new Uint8Array(512);
        this.permMod12 = new Uint8Array(512);
        for (let i = 0; i < 512; i++) {
            this.perm[i] = this.p[i & 255];
            this.permMod12[i] = (this.perm[i] % 12);
        }
    }
    dot(g, x, y, z) { return g[0] * x + g[1] * y + g[2] * z; }
    noise3D(xin, yin, zin) {
        const permMod12 = this.permMod12, perm = this.perm;
        let n0, n1, n2, n3;
        const s = (xin + yin + zin) * F3;
        const i = Math.floor(xin + s), j = Math.floor(yin + s), k = Math.floor(zin + s);
        const t = (i + j + k) * G3;
        const X0 = i - t, Y0 = j - t, Z0 = k - t;
        const x0 = xin - X0, y0 = yin - Y0, z0 = zin - Z0;
        let i1, j1, k1, i2, j2, k2;
        if (x0 >= y0) {
            if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
            else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; }
            else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; }
        } else {
            if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; }
            else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; }
            else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
        }
        const x1 = x0 - i1 + G3, y1 = y0 - j1 + G3, z1 = z0 - k1 + G3;
        const x2 = x0 - i2 + 2.0 * G3, y2 = y0 - j2 + 2.0 * G3, z2 = z0 - k2 + 2.0 * G3;
        const x3 = x0 - 1.0 + 3.0 * G3, y3 = y0 - 1.0 + 3.0 * G3, z3 = z0 - 1.0 + 3.0 * G3;
        const ii = i & 255, jj = j & 255, kk = k & 255;
        let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
        if (t0 < 0) n0 = 0.0;
        else {
            const gi0 = permMod12[ii + perm[jj + perm[kk]]] * 3;
            t0 *= t0; n0 = t0 * t0 * (SimplexNoise.grad3[gi0] * x0 + SimplexNoise.grad3[gi0 + 1] * y0 + SimplexNoise.grad3[gi0 + 2] * z0);
        }
        let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
        if (t1 < 0) n1 = 0.0;
        else {
            const gi1 = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]] * 3;
            t1 *= t1; n1 = t1 * t1 * (SimplexNoise.grad3[gi1] * x1 + SimplexNoise.grad3[gi1 + 1] * y1 + SimplexNoise.grad3[gi1 + 2] * z1);
        }
        let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
        if (t2 < 0) n2 = 0.0;
        else {
            const gi2 = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]] * 3;
            t2 *= t2; n2 = t2 * t2 * (SimplexNoise.grad3[gi2] * x2 + SimplexNoise.grad3[gi2 + 1] * y2 + SimplexNoise.grad3[gi2 + 2] * z2);
        }
        let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
        if (t3 < 0) n3 = 0.0;
        else {
            const gi3 = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]] * 3;
            t3 *= t3; n3 = t3 * t3 * (SimplexNoise.grad3[gi3] * x3 + SimplexNoise.grad3[gi3 + 1] * y3 + SimplexNoise.grad3[gi3 + 2] * z3);
        }
        return 32.0 * (n0 + n1 + n2 + n3);
    }
}
SimplexNoise.grad3 = new Float32Array([1,1,0, -1,1,0, 1,-1,0, -1,-1,0, 1,0,1, -1,0,1, 1,0,-1, -1,0,-1, 0,1,1, 0,-1,1, 0,1,-1, 0,-1,-1]);
const noiseGen = new SimplexNoise();

// ============================================================================
// CUSTOM SHADERS FOR VOID AND ABSOLUTE ENERGY SHIELD
// ============================================================================

const voidVertexShader = `
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
uniform float time;
void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normal;
    // The void eats space, jittering the vertices based on high-frequency noise
    float jitter = sin(position.x * 50.0 + time * 10.0) * cos(position.y * 50.0 - time * 15.0) * 0.1;
    vec3 newPos = position + normal * jitter;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
}
`;

const voidFragmentShader = `
uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

// Inverted physics / pure blackness
void main() {
    float dist = length(vPosition);
    float glow = abs(sin(dist * 10.0 - time * 2.0));
    
    // The boundary edge bleeds absolute zero (black) into deep purple/magenta Hawking radiation
    vec3 baseColor = vec3(0.0, 0.0, 0.0);
    vec3 radiationColor = vec3(0.4, 0.0, 0.8);
    
    // Fresnel effect inverted
    float fresnel = dot(normalize(vNormal), vec3(0.0, 0.0, 1.0));
    fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
    fresnel = pow(fresnel, 3.0);
    
    // Mixing black with terrifying magenta tearing
    float tear = step(0.95, fract(sin(dot(vUv, vec2(12.9898, 78.233)) + time) * 43758.5453));
    
    vec3 finalColor = mix(baseColor, radiationColor, fresnel * glow);
    finalColor += tear * vec3(1.0, 0.0, 1.0) * 0.5;
    
    gl_FragColor = vec4(finalColor, 1.0);
}
`;

const shieldVertexShader = `
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
uniform float time;

void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normal;
    
    // Extreme rippling for a shield under immense stress
    vec3 pos = position;
    float wave1 = sin(pos.y * 0.5 + time * 3.0) * 2.0;
    float wave2 = cos(pos.x * 0.5 - time * 4.0) * 2.0;
    float wave3 = sin((pos.x + pos.y) * 0.2 + time * 5.0) * 1.5;
    
    pos += normal * (wave1 + wave2 + wave3);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const shieldFragmentShader = `
uniform float time;
uniform float stress;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
    // Intense energy barrier holding back nothingness
    float pattern = abs(sin(vUv.x * 50.0 + time * 2.0) * cos(vUv.y * 50.0 - time * 2.0));
    
    // Fracturing lines
    float crack = step(0.98, fract(sin(dot(vUv, vec2(12.9898, 78.233)) + time * 0.1) * 43758.5453));
    
    vec3 coreColor = vec3(0.0, 0.8, 1.0);
    vec3 hotColor = vec3(1.0, 1.0, 1.0);
    vec3 crackColor = vec3(1.0, 0.2, 0.0); // Red hot plasma leaking
    
    // Shield pulsing
    float pulse = (sin(time * 10.0) * 0.5 + 0.5) * stress;
    
    vec3 color = mix(coreColor, hotColor, pattern + pulse);
    color = mix(color, crackColor, crack * stress);
    
    float alpha = 0.7 + pattern * 0.3 + crack;
    
    gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
}
`;

export function createMachine(THREE) {
    const group = new THREE.Group();
    group.name = "VacuumDecayShield_GodTier";

    // Data structures for tracking interactive elements
    const animatedMeshes = [];
    const energyConduits = [];
    const hydraulics = [];
    const warningLights = [];
    const coolingVents = [];
    
    // Materials
    const voidMaterial = new THREE.ShaderMaterial({
        vertexShader: voidVertexShader,
        fragmentShader: voidFragmentShader,
        uniforms: { time: { value: 0.0 } },
        side: THREE.DoubleSide,
        transparent: false
    });

    const shieldMaterial = new THREE.ShaderMaterial({
        vertexShader: shieldVertexShader,
        fragmentShader: shieldFragmentShader,
        uniforms: { 
            time: { value: 0.0 },
            stress: { value: 0.85 } // Critical stress
        },
        side: THREE.DoubleSide,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const emissiveBlue = new THREE.MeshStandardMaterial({ 
        color: 0x000000, emissive: 0x00aaff, emissiveIntensity: 5.0, wireframe: false
    });
    
    const emissiveRed = new THREE.MeshStandardMaterial({ 
        color: 0x000000, emissive: 0xff0000, emissiveIntensity: 8.0 
    });

    const exoticMatterMat = new THREE.MeshStandardMaterial({
        color: 0xff00ff, metalness: 1.0, roughness: 0.1, emissive: 0x440044, emissiveIntensity: 2.0
    });

    // ============================================================================
    // 1. THE VOID ENTITY (The Expanding Bubble of False Vacuum Decay)
    // ============================================================================
    // A massive sphere section encroaching from the Z-negative direction
    const voidGeo = new THREE.SphereGeometry(1500, 128, 128, 0, Math.PI * 2, 0, Math.PI / 3);
    const voidEntity = new THREE.Mesh(voidGeo, voidMaterial);
    voidEntity.position.set(0, 0, -1000);
    // Face the void towards the shield
    voidEntity.rotation.x = Math.PI / 2;
    group.add(voidEntity);
    animatedMeshes.push({ mesh: voidEntity, type: 'void' });

    // ============================================================================
    // 2. THE ABSOLUTE ENERGY SHIELD
    // ============================================================================
    // A colossal curved barrier meeting the void
    const shieldGeo = new THREE.SphereGeometry(800, 256, 256, 0, Math.PI * 2, 0, Math.PI / 4);
    const shield = new THREE.Mesh(shieldGeo, shieldMaterial);
    shield.position.set(0, 0, -400);
    shield.rotation.x = -Math.PI / 2;
    group.add(shield);
    animatedMeshes.push({ mesh: shield, type: 'shield' });

    // ============================================================================
    // 3. THE MEGASTRUCTURE (Generators, Framework, Hydraulics)
    // ============================================================================
    const megastructureGroup = new THREE.Group();
    megastructureGroup.position.set(0, 0, 100); // Set safely behind the shield
    group.add(megastructureGroup);

    // --- A. PRIMARY CONTAINMENT RINGS ---
    // Complex Torus Knots forming the stabilization backbone
    for (let i = 0; i < 3; i++) {
        const ringGeo = new THREE.TorusKnotGeometry(400 + i * 150, 20 + i * 10, 300, 64, 2 + i, 3 + i);
        const ring = new THREE.Mesh(ringGeo, steel);
        ring.position.z = i * 100;
        megastructureGroup.add(ring);
        animatedMeshes.push({ mesh: ring, type: 'containment_ring', speed: 0.05 * (i % 2 === 0 ? 1 : -1) });

        // Add emissive tracks to the rings
        const trackGeo = new THREE.TorusKnotGeometry(400 + i * 150, 22 + i * 10, 300, 16, 2 + i, 3 + i);
        const track = new THREE.Mesh(trackGeo, emissiveBlue);
        track.position.z = i * 100;
        megastructureGroup.add(track);
        animatedMeshes.push({ mesh: track, type: 'containment_track', speed: 0.05 * (i % 2 === 0 ? 1 : -1) });
    }

    // --- B. HIGGS-FIELD STABILIZERS (Complex Lathe Geometries) ---
    // Extruding intricate profiles for massive pylons
    const pylonPoints = [];
    for (let i = 0; i <= 50; i++) {
        const y = i * 10;
        const x = 50 + Math.sin(i * 0.5) * 20 + (i > 40 ? (i - 40) * 15 : 0);
        pylonPoints.push(new THREE.Vector2(x, y));
    }
    const pylonGeo = new THREE.LatheGeometry(pylonPoints, 64);
    const numPylons = 12;
    for (let i = 0; i < numPylons; i++) {
        const angle = (i / numPylons) * Math.PI * 2;
        const pylonGroup = new THREE.Group();
        
        const pylon = new THREE.Mesh(pylonGeo, darkSteel);
        // Position on an outer radius, pointing towards the center
        pylonGroup.position.set(Math.cos(angle) * 700, Math.sin(angle) * 700, 200);
        pylonGroup.lookAt(0, 0, -400); // Aiming at the shield epicenter
        pylonGroup.rotateX(Math.PI / 2); // Correct lathe orientation
        
        // Detailed paneling on pylons
        const panelGeo = new THREE.CylinderGeometry(55, 55, 500, 16, 1, true);
        const panel = new THREE.Mesh(panelGeo, chrome);
        panel.position.y = 250;
        pylonGroup.add(panel);

        // Add cascading energy rings along the pylon
        for (let j = 0; j < 5; j++) {
            const eRingGeo = new THREE.TorusGeometry(60 + j * 5, 5, 16, 64);
            const eRing = new THREE.Mesh(eRingGeo, emissiveBlue);
            eRing.position.y = 100 + j * 80;
            eRing.rotation.x = Math.PI / 2;
            pylonGroup.add(eRing);
            energyConduits.push({ mesh: eRing, phase: j * 0.5 + i });
        }

        pylonGroup.add(pylon);
        megastructureGroup.add(pylonGroup);
        animatedMeshes.push({ mesh: pylonGroup, type: 'pylon_vibration' });
    }

    // --- C. EXOTIC MASS HEAT SINKS (Aggressive Treads & Spikes) ---
    // 1000s of extruded fins acting as heat radiators facing normal space
    const heatSinkRingGroup = new THREE.Group();
    heatSinkRingGroup.position.z = 400;
    megastructureGroup.add(heatSinkRingGroup);
    animatedMeshes.push({ mesh: heatSinkRingGroup, type: 'heatsink_ring', speed: 0.1 });

    const coreGeo = new THREE.TorusGeometry(600, 50, 32, 128);
    const core = new THREE.Mesh(coreGeo, copper);
    heatSinkRingGroup.add(core);

    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.lineTo(20, 0);
    finShape.lineTo(15, 80);
    finShape.lineTo(5, 80);
    finShape.lineTo(0, 0);
    const finExtrudeSettings = { depth: 5, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 1, bevelThickness: 1 };
    const finGeo = new THREE.ExtrudeGeometry(finShape, finExtrudeSettings);

    const numFins = 360;
    for (let i = 0; i < numFins; i++) {
        const angle = (i / numFins) * Math.PI * 2;
        const fin = new THREE.Mesh(finGeo, aluminum);
        
        fin.position.x = Math.cos(angle) * 600;
        fin.position.y = Math.sin(angle) * 600;
        
        // Orient fins radiating outward
        fin.rotation.z = angle - Math.PI / 2;
        fin.rotation.x = Math.PI / 2;
        
        // Make some fins glow red hot randomly
        if (i % 7 === 0) {
            fin.material = emissiveRed;
            coolingVents.push({ mesh: fin, baseAngle: angle });
        }
        
        heatSinkRingGroup.add(fin);
    }

    // --- D. MASSIVE HYDRAULIC DAMPENERS (Absorbing the Vacuum's Push) ---
    // Connecting the main megastructure to the shield emitters
    const numHydraulics = 24;
    for(let i=0; i < numHydraulics; i++) {
        const angle = (i / numHydraulics) * Math.PI * 2;
        const hGroup = new THREE.Group();
        
        const outerCylGeo = new THREE.CylinderGeometry(30, 30, 300, 32);
        const outerCyl = new THREE.Mesh(outerCylGeo, steel);
        
        const innerCylGeo = new THREE.CylinderGeometry(15, 15, 300, 32);
        const innerCyl = new THREE.Mesh(innerCylGeo, chrome);
        innerCyl.position.y = 150; // Pushed out

        const pistonHeadGeo = new THREE.BoxGeometry(50, 20, 50);
        const pistonHead = new THREE.Mesh(pistonHeadGeo, darkSteel);
        pistonHead.position.y = 310;
        
        hGroup.add(outerCyl);
        hGroup.add(innerCyl);
        hGroup.add(pistonHead);
        
        // Position midway between structure and shield
        hGroup.position.set(Math.cos(angle) * 300, Math.sin(angle) * 300, -100);
        hGroup.lookAt(Math.cos(angle) * 300, Math.sin(angle) * 300, -400); // Point to shield
        hGroup.rotateX(Math.PI / 2);

        megastructureGroup.add(hGroup);
        hydraulics.push({ inner: innerCyl, head: pistonHead, phase: i });
    }

    // --- E. TACHYON EMITTER ARRAY (Central Core) ---
    // Very intricate core element with nested spinning geometries and tinted glass
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, 0, 0);
    megastructureGroup.add(coreGroup);
    animatedMeshes.push({ mesh: coreGroup, type: 'core', speed: -0.2 });

    const coreGlassGeo = new THREE.DodecahedronGeometry(150, 2);
    const coreGlass = new THREE.Mesh(coreGlassGeo, tinted);
    coreGroup.add(coreGlass);

    const innerCoreGeo = new THREE.IcosahedronGeometry(100, 1);
    const innerCore = new THREE.Mesh(innerCoreGeo, exoticMatterMat);
    coreGroup.add(innerCore);
    animatedMeshes.push({ mesh: innerCore, type: 'inner_core', speed: 0.5 });

    // Surrounding framework for the core
    const frameGeo = new THREE.TorusGeometry(180, 10, 16, 100);
    const frameX = new THREE.Mesh(frameGeo, darkSteel);
    frameX.rotation.x = Math.PI / 2;
    const frameY = new THREE.Mesh(frameGeo, darkSteel);
    frameY.rotation.y = Math.PI / 2;
    coreGroup.add(frameX);
    coreGroup.add(frameY);

    // --- F. SPATIAL ANCHOR CABLES (Tube Geometries) ---
    // Massive cables routing exotic matter from the void edge to the heat sinks
    const numCables = 16;
    for(let i=0; i<numCables; i++) {
        const a1 = (i / numCables) * Math.PI * 2;
        const a2 = ((i + 2) / numCables) * Math.PI * 2;
        
        const points = [];
        points.push(new THREE.Vector3(Math.cos(a1) * 300, Math.sin(a1) * 300, -200)); // Shield connection
        points.push(new THREE.Vector3(Math.cos(a1) * 500, Math.sin(a1) * 500, 0));    // Mid point 1
        points.push(new THREE.Vector3(Math.cos(a2) * 600, Math.sin(a2) * 600, 200));  // Mid point 2
        points.push(new THREE.Vector3(Math.cos(a2) * 600, Math.sin(a2) * 600, 400));  // Heat sink connection

        const curve = new THREE.CatmullRomCurve3(points);
        const tubeGeo = new THREE.TubeGeometry(curve, 64, 15, 16, false);
        const tube = new THREE.Mesh(tubeGeo, rubber);
        megastructureGroup.add(tube);
        
        // Add energy pulses flowing through cables
        const pulseGeo = new THREE.SphereGeometry(18, 16, 16);
        const pulse = new THREE.Mesh(pulseGeo, emissiveBlue);
        megastructureGroup.add(pulse);
        animatedMeshes.push({ mesh: pulse, type: 'cable_pulse', curve: curve, progress: i / numCables });
    }

    // --- G. OPERATOR CITADEL (Scale reference and Control) ---
    // Tiny in comparison, located far back in normal space
    const citadelGroup = new THREE.Group();
    citadelGroup.position.set(0, 800, 600);
    megastructureGroup.add(citadelGroup);

    const citadelBaseGeo = new THREE.CylinderGeometry(100, 150, 50, 8);
    const citadelBase = new THREE.Mesh(citadelBaseGeo, darkSteel);
    citadelGroup.add(citadelBase);

    const citadelTowerGeo = new THREE.BoxGeometry(40, 200, 40);
    const citadelTower = new THREE.Mesh(citadelTowerGeo, steel);
    citadelTower.position.y = 100;
    citadelGroup.add(citadelTower);

    const citadelDomeGeo = new THREE.SphereGeometry(60, 32, 32, 0, Math.PI*2, 0, Math.PI/2);
    const citadelDome = new THREE.Mesh(citadelDomeGeo, glass);
    citadelDome.position.y = 200;
    citadelGroup.add(citadelDome);
    
    // Add thousands of tiny warning lights to give a sense of immense scale
    const lightGeo = new THREE.SphereGeometry(1, 4, 4);
    const lightMesh = new THREE.InstancedMesh(lightGeo, emissiveRed, 500);
    const dummy = new THREE.Object3D();
    for(let i=0; i<500; i++) {
        const radius = 200 + Math.random() * 800;
        const theta = Math.random() * Math.PI * 2;
        const z = -200 + Math.random() * 800;
        dummy.position.set(Math.cos(theta)*radius, Math.sin(theta)*radius, z);
        dummy.updateMatrix();
        lightMesh.setMatrixAt(i, dummy.matrix);
    }
    megastructureGroup.add(lightMesh);
    warningLights.push(lightMesh);

    // ============================================================================
    // MACHINE PARTS CATALOG (Extremely Detailed)
    // ============================================================================
    const parts = [
        {
            name: "Primary Higgs-Field Stabilizer Pylons",
            description: "Colossal lathe-turned pylons constructed from hyper-dense dark steel. These structures project a restorative Higgs field to reinforce the metastable vacuum state against the encroaching void.",
            material: "darkSteel, chrome, emissiveBlue",
            function: "Spacetime reinforcement and scalar field stabilization",
            assemblyOrder: 1,
            connections: ["Central Core", "Spatial Anchor Cables"],
            failureEffect: "Localized false vacuum collapse, resulting in immediate cessation of local physical laws.",
            cascadeFailures: ["Void-Edge Deflector", "Exotic Mass Heat Sinks"],
            originalPosition: { x: 0, y: 0, z: 200 },
            explodedPosition: { x: 0, y: 0, z: 800 }
        },
        {
            name: "Void-Edge Deflector Shield",
            description: "A continuous, immaterial barrier of pure energy. It acts as the final boundary condition preventing the true vacuum bubble from expanding into normal spacetime.",
            material: "ShaderMaterial (Additive Blending, Procedural Fracturing)",
            function: "Physical and energetic boundary containment",
            assemblyOrder: 2,
            connections: ["Hydraulic Dampeners", "Tachyon Emitter Array"],
            failureEffect: "Universal annihilation at the speed of light.",
            cascadeFailures: ["Everything"],
            originalPosition: { x: 0, y: 0, z: -400 },
            explodedPosition: { x: 0, y: 0, z: -1000 }
        },
        {
            name: "Exotic Mass Heat Sinks",
            description: "Tens of thousands of aluminum and copper composite fins arrayed in a massive ring. They radiate the incomprehensible latent heat released during the vacuum phase transition into safe dimensions.",
            material: "aluminum, copper, emissiveRed",
            function: "Thermal and entropic exhaust",
            assemblyOrder: 3,
            connections: ["Spatial Anchor Cables", "Primary Containment Rings"],
            failureEffect: "Thermal runaway causing the megastructure to melt into a quark-gluon plasma.",
            cascadeFailures: ["Tachyon Emitter Array"],
            originalPosition: { x: 0, y: 0, z: 400 },
            explodedPosition: { x: 0, y: 0, z: 1200 }
        },
        {
            name: "Hydraulic Dampeners (Quantum-Scale)",
            description: "Massive physical shock absorbers. As the void pushes against the deflector shield, macroscopic quantum fluctuations create immense physical strain. These dampeners absorb the kinetic translation.",
            material: "steel, chrome, darkSteel",
            function: "Kinetic stress absorption",
            assemblyOrder: 4,
            connections: ["Void-Edge Deflector", "Primary Containment Rings"],
            failureEffect: "Structural fracturing of the megastructure framework.",
            cascadeFailures: ["Primary Higgs-Field Stabilizer Pylons"],
            originalPosition: { x: 0, y: 0, z: -100 },
            explodedPosition: { x: 1000, y: 1000, z: -100 }
        },
        {
            name: "Tachyon Emitter Array Core",
            description: "The beating heart of the shield. A nested gyroscopic structure containing a core of exotic matter that emits backwards-time-traveling particles to pre-emptively reinforce weak points in the shield.",
            material: "tinted glass, darkSteel, exoticMatterMat",
            function: "Causality manipulation and shield prediction",
            assemblyOrder: 5,
            connections: ["Primary Containment Rings"],
            failureEffect: "Shield response lag, allowing microscopic voids to penetrate normal space.",
            cascadeFailures: ["Operator Citadel"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: -1000, y: 0, z: 0 }
        },
        {
            name: "Primary Containment Rings",
            description: "Massive Torus Knots woven through higher spatial dimensions. They provide the fundamental scaffolding for all other megastructure components.",
            material: "steel, emissiveBlue",
            function: "Structural integrity and power routing",
            assemblyOrder: 6,
            connections: ["All Components"],
            failureEffect: "Complete disarticulation of the shield apparatus.",
            cascadeFailures: ["Everything"],
            originalPosition: { x: 0, y: 0, z: 100 },
            explodedPosition: { x: 0, y: -1000, z: 100 }
        },
        {
            name: "Spatial Anchor Cables",
            description: "Thick rubberized pipelines containing fluidic exotic matter. They act as both power conduits and literal anchors, pinning the megastructure's coordinates to the cosmic microwave background.",
            material: "rubber, emissiveBlue",
            function: "Power transfer and spatial locking",
            assemblyOrder: 7,
            connections: ["Void-Edge Deflector", "Exotic Mass Heat Sinks"],
            failureEffect: "Megastructure drifts into the void.",
            cascadeFailures: ["Void-Edge Deflector"],
            originalPosition: { x: 0, y: 0, z: 100 },
            explodedPosition: { x: 500, y: 500, z: 500 }
        },
        {
            name: "Operator Citadel",
            description: "A tiny habitat for the trillions of digitized consciousnesses managing the micro-adjustments of the shield. Heavily armored and shielded from the extreme radiation.",
            material: "darkSteel, steel, glass",
            function: "Command, control, and quantum calculation",
            assemblyOrder: 8,
            connections: ["Exotic Mass Heat Sinks"],
            failureEffect: "Loss of manual overrides; automation takes over with 80% efficiency.",
            cascadeFailures: [],
            originalPosition: { x: 0, y: 800, z: 600 },
            explodedPosition: { x: 0, y: 2000, z: 600 }
        },
        {
            name: "Zero-Point Energy Siphon",
            description: "Extracts virtual particles from the vacuum of normal space, converting them into the immense power required to sustain the shield.",
            material: "chrome, exoticMatterMat",
            function: "Power Generation",
            assemblyOrder: 9,
            connections: ["Tachyon Emitter Array Core"],
            failureEffect: "Power blackout. Instant universal death.",
            cascadeFailures: ["Primary Containment Rings", "Void-Edge Deflector"],
            originalPosition: { x: 0, y: -500, z: 0 },
            explodedPosition: { x: 0, y: -1500, z: 0 }
        },
        {
            name: "Casimir-Effect Dampeners",
            description: "Arrays of plates positioned mere nanometers apart across the entire structure, manipulating the Casimir force to create repulsive zones that keep the structure from crushing itself under its own gravity.",
            material: "aluminum, steel",
            function: "Anti-gravity and structural support",
            assemblyOrder: 10,
            connections: ["Primary Containment Rings"],
            failureEffect: "Structure collapses into a black hole.",
            cascadeFailures: ["Operator Citadel", "Tachyon Emitter Array Core"],
            originalPosition: { x: 400, y: 0, z: 100 },
            explodedPosition: { x: 1200, y: 0, z: 100 }
        },
        {
            name: "Non-Euclidean Reflector Dish",
            description: "A geometric paradox built to reflect Hawking radiation emitted by the edge of the void back into the void, preventing the radiation from boiling normal space.",
            material: "chrome, glass",
            function: "Radiation shielding",
            assemblyOrder: 11,
            connections: ["Void-Edge Deflector"],
            failureEffect: "Normal space behind the shield becomes an uninhabitable radiation bath.",
            cascadeFailures: ["Operator Citadel"],
            originalPosition: { x: -400, y: 0, z: -200 },
            explodedPosition: { x: -1200, y: 0, z: -200 }
        },
        {
            name: "Sub-Planck Spacetime Stitcher",
            description: "Microscopic drone swarms that constantly repair tears in the fabric of spacetime caused by the sheer stress of the deflector shield.",
            material: "plastic, emissiveBlue",
            function: "Spacetime maintenance",
            assemblyOrder: 12,
            connections: ["Void-Edge Deflector", "Primary Higgs-Field Stabilizer Pylons"],
            failureEffect: "Micro-fissures in reality.",
            cascadeFailures: ["Hydraulic Dampeners"],
            originalPosition: { x: 200, y: 200, z: -300 },
            explodedPosition: { x: 800, y: 800, z: -300 }
        },
        {
            name: "Baryogenesis Igniter",
            description: "In the event of a breach, this device forces rapid baryogenesis to create an immense wall of matter, acting as a physical plug against the void.",
            material: "darkSteel, emissiveRed",
            function: "Emergency breach containment",
            assemblyOrder: 13,
            connections: ["Primary Containment Rings"],
            failureEffect: "No backup if the main shield fails.",
            cascadeFailures: [],
            originalPosition: { x: -200, y: -200, z: 200 },
            explodedPosition: { x: -800, y: -800, z: 200 }
        },
        {
            name: "Dark Energy Ramscoop",
            description: "Funnels ambient dark energy from the accelerating expansion of the universe into the shield's reserves.",
            material: "copper, tinted",
            function: "Auxiliary power generation",
            assemblyOrder: 14,
            connections: ["Zero-Point Energy Siphon"],
            failureEffect: "Power fluctuations during high-stress void surges.",
            cascadeFailures: ["Casimir-Effect Dampeners"],
            originalPosition: { x: 0, y: 600, z: 400 },
            explodedPosition: { x: 0, y: 1500, z: 400 }
        },
        {
            name: "String-Theory Harmonic Resonator",
            description: "Vibrates at precise frequencies to ensure that the 11-dimensional strings composing the megastructure do not unravel under the influence of the true vacuum.",
            material: "chrome, exoticMatterMat",
            function: "Fundamental particle integrity",
            assemblyOrder: 15,
            connections: ["Tachyon Emitter Array Core"],
            failureEffect: "Megastructure disintegrates into fundamental strings.",
            cascadeFailures: ["Everything"],
            originalPosition: { x: 0, y: 0, z: -50 },
            explodedPosition: { x: 0, y: 0, z: -800 }
        }
    ];

    // ============================================================================
    // PHD-LEVEL QUIZ QUESTIONS (Quantum Field Theory & False Vacuum Decay)
    // ============================================================================
    const quizQuestions = [
        {
            question: "In the context of the Coleman-De Luccia mechanism for false vacuum decay, how does the inclusion of gravitational effects (via the Gauss-Bonnet term or general relativity) alter the tunneling rate Γ compared to the flat-space instanton solution?",
            options: [
                "Gravity universally increases the tunneling rate by providing a lower energy barrier for bubble nucleation.",
                "Gravity suppresses the tunneling rate, and can even completely stabilize the false vacuum if the energy difference is too small.",
                "Gravity has no effect on the tunneling rate; the O(4)-symmetric bounce solution is entirely independent of the metric.",
                "Gravity alters the geometry of the bubble but leaves the Euclidean action S_E exactly identical to the flat-space case."
            ],
            correctAnswer: 1,
            explanation: "In Coleman and De Luccia's seminal 1980 paper, they showed that gravity tends to stabilize the false vacuum. If the energy density difference between the true and false vacua is small compared to the gravitational effects (specifically, if the true vacuum has a negative cosmological constant that is too large), the Euclidean bounce solution fails to exist, making the decay rate precisely zero."
        },
        {
            question: "Assuming the Standard Model Higgs potential is metastable at high energies, which of the following physical parameters has the most dominant and sensitive effect on the critical energy scale Λ where the quartic coupling λ turns negative?",
            options: [
                "The mass of the W boson (mW)",
                "The strong coupling constant (αs)",
                "The mass of the Top Quark (mt)",
                "The mass of the electron (me)"
            ],
            correctAnswer: 2,
            explanation: "The renormalization group evolution of the Higgs quartic coupling λ is highly sensitive to the top quark Yukawa coupling due to its immense mass. A heavier top quark drives λ to negative values more rapidly at high energy scales. Current measurements of the top mass (~173 GeV) and Higgs mass (~125 GeV) place the universe in a metastable region, extremely close to the boundary of stability."
        },
        {
            question: "What is the primary role of the O(4)-symmetric 'bounce' solution in calculating the transition probability of a scalar field from a metastable false vacuum to a true vacuum state?",
            options: [
                "It describes the real-time classical evolution of the field rolling down the potential barrier.",
                "It is a solution to the Euclidean (imaginary time) equations of motion that minimizes the action and dictates the semi-classical tunneling amplitude.",
                "It represents the maximum energy state (the sphaleron) at the exact peak of the potential barrier.",
                "It dictates the expansion velocity of the bubble wall post-nucleation."
            ],
            correctAnswer: 1,
            explanation: "In semi-classical quantum field theory (following Sidney Coleman's work), vacuum decay is a quantum tunneling event. The tunneling rate is dominated by the classical path in Euclidean (imaginary) time that interpolates between the false vacuum and the true vacuum. This O(4)-symmetric Euclidean solution is called the 'bounce', and its action S_E determines the decay rate Γ ~ A exp(-S_E)."
        },
        {
            question: "If a true vacuum bubble nucleates within our false vacuum, the bubble wall expands asymptotically at the speed of light. What energy dynamic fundamentally drives this relentless expansion?",
            options: [
                "The conservation of angular momentum forcing the wall outwards.",
                "The latent heat (difference in vacuum energy density) between the false and true vacuum being entirely converted into the kinetic energy of the bubble wall.",
                "Dark energy repulsion concentrated specifically at the domain wall interface.",
                "Quantum entanglement between the interior and exterior fields pulling the boundary apart."
            ],
            correctAnswer: 1,
            explanation: "As the bubble expands, the volume of the true vacuum (which has lower energy) increases. The energy released by this transition cannot disappear; it is deposited directly into the bubble wall. Because the volume scales as r^3 and the surface area as r^2, the immense energy difference highly accelerates the wall, driving it asymptotically to the speed of light, making it a perfectly destructive shell of infinite Lorentz factor."
        },
        {
            question: "In a scenario where the universe decays into a true vacuum characterized by a negative cosmological constant (an Anti-de Sitter vacuum), what is the ultimate fate of the spacetime inside the nucleated bubble?",
            options: [
                "It expands infinitely, resulting in a perfectly cold, empty, flat universe.",
                "It undergoes rapid gravitational collapse, leading to a Big Crunch singularity within a finite, very short proper time.",
                "It perfectly mirrors our current universe but with inverted electromagnetic charges.",
                "It forms a static, eternal closed universe bounded by the bubble wall."
            ],
            correctAnswer: 1,
            explanation: "According to Coleman-De Luccia tunneling, if the true vacuum has a negative cosmological constant (AdS space), the geometry inside the bubble is inherently unstable to gravitational collapse. An observer inside the bubble would see the universe contract rapidly, ending in a Big Crunch singularity shortly after the bubble wall passes them."
        }
    ];

    // ============================================================================
    // ANIMATION LOOP (Complex math, noise sampling, physics simulation)
    // ============================================================================
    function animate(time, speed, meshes) {
        const delta = time * 0.001; // Scale time for shaders
        
        // Update shaders
        voidMaterial.uniforms.time.value = delta * speed * 2.0;
        shieldMaterial.uniforms.time.value = delta * speed * 5.0;
        
        // Fluctuate shield stress based on 3D noise
        const stressNoise = noiseGen.noise3D(delta * 0.1, 0, 0);
        shieldMaterial.uniforms.stress.value = 0.7 + (stressNoise * 0.3); // High stress

        // Vibrate the entire megastructure based on shield stress
        const vibration = shieldMaterial.uniforms.stress.value > 0.85 ? (shieldMaterial.uniforms.stress.value - 0.85) * 10 : 0;
        megastructureGroup.position.x = (Math.random() - 0.5) * vibration;
        megastructureGroup.position.y = (Math.random() - 0.5) * vibration;

        // Animate all registered elements
        animatedMeshes.forEach(item => {
            if (item.type.includes('ring') || item.type === 'core' || item.type === 'inner_core' || item.type === 'containment_track') {
                item.mesh.rotation.z += item.speed * speed;
            }
            if (item.type === 'cable_pulse') {
                item.progress += 0.005 * speed;
                if (item.progress > 1) item.progress = 0;
                // Get point on curve
                const pt = item.curve.getPointAt(item.progress);
                item.mesh.position.copy(pt);
            }
            if (item.type === 'pylon_vibration') {
                // Subtle aggressive vibration for pylons
                item.mesh.rotation.z += (Math.random() - 0.5) * 0.01 * speed;
            }
        });

        // Animate energy conduits (pulsing opacity/emissive)
        energyConduits.forEach(conduit => {
            const pulse = (Math.sin(delta * 10.0 + conduit.phase) * 0.5 + 0.5);
            conduit.mesh.scale.setScalar(1.0 + pulse * 0.1);
        });

        // Animate massive hydraulics reacting to the void's push
        hydraulics.forEach(hyd => {
            // Noise based compression
            const push = (noiseGen.noise3D(delta * 2.0, hyd.phase, 0) * 0.5 + 0.5); // 0 to 1
            const compression = push * 100; // compress up to 100 units
            hyd.inner.position.y = 150 - compression * 0.5;
            hyd.head.position.y = 310 - compression;
        });

        // Blink warning lights randomly
        if (warningLights.length > 0) {
            const instancedMesh = warningLights[0];
            const color = new THREE.Color();
            for(let i=0; i<500; i++) {
                if (Math.random() > 0.95) {
                    color.setHex(Math.random() > 0.5 ? 0xff0000 : 0x000000);
                    instancedMesh.setColorAt(i, color);
                }
            }
            instancedMesh.instanceColor.needsUpdate = true;
        }
    }

    return {
        group,
        parts,
        description: "The God-Tier Vacuum Decay Shield. A desperate, galaxy-spanning megastructure designed to halt the expansion of a true vacuum bubble. It utilizes exotic matter, tachyon emitters, and localized Higgs-field stabilization to hold back absolute nothingness.",
        quizQuestions,
        animate
    };
}
