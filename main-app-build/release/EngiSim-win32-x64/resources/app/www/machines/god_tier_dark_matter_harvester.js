import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

/**
 * GOD TIER DARK MATTER HARVESTER
 * 
 * A hyper-complex, mega-structural apparatus designed to interact with, 
 * capture, and contain invisible mass (Dark Matter, WIMPs, Axions).
 * Features gravitational wave emitters, non-Euclidean geometry, custom void shaders,
 * and intricate particle physics simulations.
 */

// ==========================================
// GLSL SHADERS (NOISE & VOID & GRAVITY)
// ==========================================

const simplexNoise3D = `
// Simplex 3D Noise 
// by Ian McEwan, Ashima Arts
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
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}
`;

const voidVertexShader = `
uniform float uTime;
uniform float uIntensity;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying float vNoise;

${simplexNoise3D}

void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    
    // Intense organic gravitational ripples
    float noise = snoise(vec3(position.x * 0.5 + uTime * 0.2, position.y * 0.5, position.z * 0.5 + uTime * 0.1));
    vNoise = noise;
    
    vec3 newPosition = position + normal * (noise * uIntensity * 2.0);
    
    vPosition = (modelViewMatrix * vec4(newPosition, 1.0)).xyz;
    gl_Position = projectionMatrix * vec4(vPosition, 1.0);
}
`;

const voidFragmentShader = `
uniform float uTime;
uniform vec3 uColorCore;
uniform vec3 uColorEdge;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying float vNoise;

void main() {
    // Non-Euclidean negative color approximation
    float intensity = dot(vNormal, vec3(0.0, 0.0, 1.0));
    intensity = smoothstep(0.0, 1.0, intensity);
    
    // Simulate light being absorbed rather than reflected (negative emission)
    vec3 finalColor = mix(uColorCore, uColorEdge, intensity + vNoise * 0.2);
    
    // Eerie glowing pulse
    float pulse = (sin(uTime * 3.0 + vNoise * 5.0) * 0.5 + 0.5) * 0.5;
    
    gl_FragColor = vec4(finalColor + pulse * vec3(0.1, 0.0, 0.3), 0.9 - pulse*0.2);
}
`;

const particleVertexShader = `
uniform float uTime;
attribute float aPhase;
attribute vec3 aTarget;
varying vec3 vColor;
varying float vLife;

${simplexNoise3D}

void main() {
    // Particles move erratically against standard gravity
    float t = mod(uTime * 0.5 + aPhase, 10.0) / 10.0; // 0 to 1 life
    
    vec3 startPos = position;
    vec3 currentPos = mix(startPos, aTarget, t);
    
    // Add immense turbulence
    float turb = snoise(vec3(currentPos.x * 2.0, uTime * 0.5, currentPos.z * 2.0));
    currentPos += vec3(turb, turb, turb) * (1.0 - t) * 5.0;
    
    vec4 mvPosition = modelViewMatrix * vec4(currentPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = (20.0 / -mvPosition.z) * (1.0 - t);
    
    vLife = t;
    vColor = mix(vec3(0.0, 0.0, 0.0), vec3(0.8, 0.1, 1.0), t);
}
`;

const particleFragmentShader = `
varying vec3 vColor;
varying float vLife;

void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if(dist > 0.5) discard;
    
    // Inverted particle color (dark matter signature)
    vec3 baseColor = vec3(1.0) - vColor; // negative color
    float alpha = (0.5 - dist) * 2.0 * (1.0 - vLife);
    gl_FragColor = vec4(baseColor, alpha * 0.8);
}
`;

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    const description = "The God Tier Dark Matter Harvester. A mega-structural array that generates a localized topological defect in spacetime to capture and compress WIMPs and Axions, converting their mass-energy into stable hyper-fluids.";

    // ==========================================
    // MATERIALS
    // ==========================================
    
    const exoticMatterMat = new THREE.ShaderMaterial({
        vertexShader: voidVertexShader,
        fragmentShader: voidFragmentShader,
        uniforms: {
            uTime: { value: 0 },
            uIntensity: { value: 1.5 },
            uColorCore: { value: new THREE.Color(0x000000) },
            uColorEdge: { value: new THREE.Color(0x2a0050) }
        },
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
    });

    const plasmaGlowMat = new THREE.MeshPhysicalMaterial({
        color: 0x110033,
        emissive: 0x6600ff,
        emissiveIntensity: 4.0,
        metalness: 0.9,
        roughness: 0.1,
        clearcoat: 1.0,
        wireframe: true
    });

    const neutroniumMat = new THREE.MeshPhysicalMaterial({
        color: 0x050505,
        metalness: 1.0,
        roughness: 0.4,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2,
        iridescence: 0.8,
        iridescenceIOR: 2.0
    });
    
    const glowingCircuitMat = new THREE.MeshStandardMaterial({
        color: 0x00ffcc,
        emissive: 0x00ffcc,
        emissiveIntensity: 2.5,
        wireframe: true
    });

    // ==========================================
    // PARAMETRIC GENERATORS
    // ==========================================
    
    // Generates a Lorenz Attractor geometry for the Strange Attractor Coil
    function createStrangeAttractor() {
        const points = [];
        let x = 0.1, y = 0, z = 0;
        const a = 10, b = 28, c = 8.0/3.0;
        const dt = 0.005;
        for (let i = 0; i < 4000; i++) {
            const dx = a * (y - x) * dt;
            const dy = (x * (b - z) - y) * dt;
            const dz = (x * y - c * z) * dt;
            x += dx; y += dy; z += dz;
            points.push(new THREE.Vector3(x * 0.5, y * 0.5, z * 0.5 - 12)); // Shift center
        }
        const curve = new THREE.CatmullRomCurve3(points);
        return new THREE.TubeGeometry(curve, 1024, 0.2, 8, false);
    }

    // Generates a Calabi-Yau-like manifold surface approximation
    function calabiYauFunction(u, v, target) {
        const theta = u * Math.PI * 2;
        const phi = v * Math.PI * 2;
        const n = 4; // Complexity
        const r = 2.0 + Math.sin(n * theta) * Math.cos(n * phi);
        const x = r * Math.cos(theta) * Math.cos(phi);
        const y = r * Math.sin(theta) * Math.cos(phi);
        const z = r * Math.sin(phi);
        // Warp into non-Euclidean-looking twists
        const twistedX = x * Math.cos(z) - y * Math.sin(z);
        const twistedY = x * Math.sin(z) + y * Math.cos(z);
        target.set(twistedX * 1.5, twistedY * 1.5, z * 1.5);
    }

    // ==========================================
    // PART ASSEMBLIES
    // ==========================================

    let partIndex = 0;

    // 1. Event Horizon Containment Torus
    const torusGeo = new THREE.TorusKnotGeometry(12, 1.5, 300, 32, 5, 7);
    const torusMesh = new THREE.Mesh(torusGeo, exoticMatterMat);
    group.add(torusMesh);
    meshes.containmentTorus = torusMesh;
    parts.push({
        name: "Event Horizon Containment Torus",
        description: "A highly deformed topological torus maintaining a localized event horizon to trap weakly interacting particles.",
        material: "exoticMatterMat (Shader)",
        function: "Confines captured dark matter using folded spacetime metrics.",
        assemblyOrder: ++partIndex,
        connections: ["Calabi-Yau Resonance Manifold", "Strange Attractor Confinement Coil"],
        failureEffect: "Instantaneous micro-singularity expansion, devouring a 400km radius.",
        cascadeFailures: ["Complete systemic structural implosion"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 20, z: 0}
    });

    // 2. Calabi-Yau Resonance Manifold
    const cyGeo = new THREE.ParametricGeometry(calabiYauFunction, 120, 120);
    const cyMesh = new THREE.Mesh(cyGeo, plasmaGlowMat);
    cyMesh.scale.set(1.5, 1.5, 1.5);
    group.add(cyMesh);
    meshes.calabiYau = cyMesh;
    parts.push({
        name: "Calabi-Yau Resonance Manifold",
        description: "An approximation of a 6-dimensional compactified space, projected into 3D. Oscillates at graviton resonance frequencies.",
        material: "plasmaGlowMat",
        function: "Resonates with hidden dimensional modes to coax Axions into electromagnetically interacting states.",
        assemblyOrder: ++partIndex,
        connections: ["Event Horizon Containment Torus", "Axion Conversion Chamber"],
        failureEffect: "Spontaneous generation of strangelets.",
        cascadeFailures: ["Topological Defect Stabilizer rupture"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -20, z: 0}
    });

    // 3. Strange Attractor Confinement Coil
    const attractorGeo = createStrangeAttractor();
    const attractorMesh = new THREE.Mesh(attractorGeo, glowingCircuitMat);
    group.add(attractorMesh);
    meshes.attractor = attractorMesh;
    parts.push({
        name: "Strange Attractor Confinement Coil",
        description: "A physical manifestation of a chaotic Lorenz attractor, carrying immense super-currents.",
        material: "glowingCircuitMat",
        function: "Provides a chaotic magnetic bottle that prevents dark matter phase-slip.",
        assemblyOrder: ++partIndex,
        connections: ["Event Horizon Containment Torus", "WIMP Capture Matrix"],
        failureEffect: "Dark matter leaks into normal spacetime, causing localized gravitational anomalies.",
        cascadeFailures: ["Superfluid Helium Cryo-Core boil-off"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 30}
    });

    // 4-7. Graviton Synchronization Emitters (Alpha, Beta, Gamma, Delta)
    const emitterGeo = new THREE.CylinderGeometry(0.5, 3, 15, 32, 8, true);
    const emitterInternalGeo = new THREE.CylinderGeometry(0.2, 1, 14, 16);
    
    meshes.emitters = [];
    const emitterAngles = [0, Math.PI/2, Math.PI, 3*Math.PI/2];
    const emitterNames = ["Alpha", "Beta", "Gamma", "Delta"];
    
    emitterAngles.forEach((angle, i) => {
        const emitterGroup = new THREE.Group();
        
        const outerMesh = new THREE.Mesh(emitterGeo, neutroniumMat);
        const innerMesh = new THREE.Mesh(emitterInternalGeo, plasmaGlowMat);
        
        // Detailed rings around the emitter
        for(let j=0; j<5; j++) {
            const ringGeo = new THREE.TorusGeometry(3.5 - j*0.2, 0.2, 16, 64);
            const ring = new THREE.Mesh(ringGeo, steel);
            ring.position.y = 5 - j*2.5;
            ring.rotation.x = Math.PI/2;
            emitterGroup.add(ring);
        }

        emitterGroup.add(outerMesh);
        emitterGroup.add(innerMesh);
        
        // Position them radially around the core
        emitterGroup.position.set(Math.cos(angle) * 25, 0, Math.sin(angle) * 25);
        emitterGroup.rotation.x = Math.PI / 2; // Point inwards
        emitterGroup.rotation.z = angle + Math.PI/2;

        group.add(emitterGroup);
        meshes.emitters.push(emitterGroup);
        
        parts.push({
            name: `Graviton Synchronization Emitter ${emitterNames[i]}`,
            description: `A hyper-dense neutronium focusing array emitting coherent gravitational waves.`,
            material: "neutroniumMat, steel, plasmaGlowMat",
            function: "Pings the local cosmic web, agitating dormant dark matter halos.",
            assemblyOrder: ++partIndex,
            connections: ["Quantum Foam Agitator", "Neutronium Plating Array"],
            failureEffect: "Emission of unchecked gravity waves, shattering the planet's crust.",
            cascadeFailures: ["Gravitational Wave Modulator overdrive"],
            originalPosition: {x: emitterGroup.position.x, y: emitterGroup.position.y, z: emitterGroup.position.z},
            explodedPosition: {
                x: emitterGroup.position.x * 2.5, 
                y: emitterGroup.position.y, 
                z: emitterGroup.position.z * 2.5
            }
        });
    });

    // 8. Superfluid Helium Cryo-Core
    const cryoGeo = new THREE.SphereGeometry(18, 64, 64);
    const cryoMat = new THREE.MeshPhysicalMaterial({
        color: 0x0044ff,
        transparent: true,
        opacity: 0.2,
        transmission: 0.9,
        ior: 1.1,
        clearcoat: 1.0
    });
    const cryoMesh = new THREE.Mesh(cryoGeo, cryoMat);
    group.add(cryoMesh);
    meshes.cryo = cryoMesh;
    parts.push({
        name: "Superfluid Helium Cryo-Core",
        description: "A gigantic sphere of liquid helium-4 cooled to 0.0001K, exhibiting zero viscosity.",
        material: "cryoMat",
        function: "Provides the thermal gradient required to slow incoming WIMPs via phonon scattering.",
        assemblyOrder: ++partIndex,
        connections: ["WIMP Capture Matrix", "Neutronium Plating Array"],
        failureEffect: "Explosive boiling of helium, rapid thermodynamic expansion.",
        cascadeFailures: ["Axion Conversion Chamber thermal blinding"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 40, y: -40, z: -40}
    });

    // 9. Topological Defect Stabilizer
    const defectGeo = new THREE.OctahedronGeometry(6, 3);
    const defectMesh = new THREE.Mesh(defectGeo, glowingCircuitMat);
    group.add(defectMesh);
    meshes.defect = defectMesh;
    parts.push({
        name: "Topological Defect Stabilizer",
        description: "A trapped cosmic string segment wrapped into a closed loop, stabilized by intense magnetic fields.",
        material: "glowingCircuitMat",
        function: "Anchors the spatial distortions created by the Harvester, preventing vacuum decay.",
        assemblyOrder: ++partIndex,
        connections: ["Event Horizon Containment Torus", "Tesseract Hyper-Projection Node"],
        failureEffect: "False vacuum decay nucleation.",
        cascadeFailures: ["Total universe collapse (localized)"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 50, z: 0}
    });

    // 10. Neutronium Plating Array (Detailed Shell)
    const shellGeo = new THREE.IcosahedronGeometry(22, 4);
    const shellMesh = new THREE.Mesh(shellGeo, neutroniumMat);
    shellMesh.material.wireframe = true; 
    group.add(shellMesh);
    meshes.shell = shellMesh;
    parts.push({
        name: "Neutronium Plating Array",
        description: "An incredibly dense, wireframe-like geodesic sphere made of degenerate neutron matter.",
        material: "neutroniumMat (Wireframe)",
        function: "Shields external spacetime from the immense tidal forces generated internally.",
        assemblyOrder: ++partIndex,
        connections: ["Superfluid Helium Cryo-Core", "Graviton Synchronization Emitters"],
        failureEffect: "Tidal forces tear apart any normal matter within a 10km radius.",
        cascadeFailures: ["Structural disintegration"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -50, y: 0, z: 50}
    });

    // 11. Axion Conversion Chamber
    const axionGeo = new THREE.LatheGeometry([
        new THREE.Vector2(1, 0),
        new THREE.Vector2(4, 5),
        new THREE.Vector2(2, 10),
        new THREE.Vector2(5, 15),
        new THREE.Vector2(1, 20)
    ], 64);
    const axionMesh = new THREE.Mesh(axionGeo, chrome);
    axionMesh.position.y = -30;
    group.add(axionMesh);
    meshes.axion = axionMesh;
    parts.push({
        name: "Axion Conversion Chamber",
        description: "A resonant cavity bathed in a 100 Tesla static magnetic field.",
        material: "chrome",
        function: "Utilizes the Primakoff effect to convert captured dark matter axions into detectable microwave photons.",
        assemblyOrder: ++partIndex,
        connections: ["Calabi-Yau Resonance Manifold", "Baryogenesis Catalysis Tube"],
        failureEffect: "Uncontrolled emission of lethal microwave radiation.",
        cascadeFailures: ["Cryo-Core boiling"],
        originalPosition: {x: 0, y: -30, z: 0},
        explodedPosition: {x: 0, y: -60, z: 0}
    });

    // 12. Dark Energy Phase Inverter
    const inverterGeo = new THREE.TorusGeometry(25, 0.5, 16, 100);
    const inverterMesh = new THREE.Mesh(inverterGeo, tinted);
    inverterMesh.rotation.x = Math.PI / 2;
    group.add(inverterMesh);
    meshes.inverter = inverterMesh;
    parts.push({
        name: "Dark Energy Phase Inverter",
        description: "A massive outer ring constructed from exotic metamaterials with a negative refractive index.",
        material: "tinted glass",
        function: "Inverts the local cosmological constant, creating a micro-region of contracting space to funnel DM.",
        assemblyOrder: ++partIndex,
        connections: ["Neutronium Plating Array", "Void Tethering Anchor"],
        failureEffect: "Runaway spatial expansion, tearing the facility apart at the subatomic level.",
        cascadeFailures: ["Vacuum decay"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: 0} // Expands in size during animation instead
    });

    // 13. WIMP Capture Matrix
    // Extremely complex internal web using TubeGeometry
    const matrixCurve = new THREE.Curves.TrefoilKnot(30);
    const matrixGeo = new THREE.TubeGeometry(matrixCurve, 300, 0.3, 12, true);
    const matrixMesh = new THREE.Mesh(matrixGeo, copper);
    matrixMesh.scale.set(0.3, 0.3, 0.3);
    group.add(matrixMesh);
    meshes.wimpMatrix = matrixMesh;
    parts.push({
        name: "WIMP Capture Matrix",
        description: "An intricate trefoil knot of superconducting copper alloys doped with xenon.",
        material: "copper",
        function: "Maximizes nuclear cross-section for Weakly Interacting Massive Particle collisions.",
        assemblyOrder: ++partIndex,
        connections: ["Strange Attractor Confinement Coil", "Superfluid Helium Cryo-Core"],
        failureEffect: "WIMPs pass through unhindered, dropping efficiency to 0%.",
        cascadeFailures: ["None, safe failure."],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: 0, z: -50}
    });

    // 14. Tesseract Hyper-Projection Node
    const tessGeo = new THREE.BoxGeometry(8, 8, 8);
    const tessEdges = new THREE.EdgesGeometry(tessGeo);
    const tessMesh = new THREE.LineSegments(tessEdges, new THREE.LineBasicMaterial({color: 0xffffff, linewidth: 2}));
    group.add(tessMesh);
    
    const tessInner = new THREE.BoxGeometry(4, 4, 4);
    const tessInnerEdges = new THREE.EdgesGeometry(tessInner);
    const tessInnerMesh = new THREE.LineSegments(tessInnerEdges, new THREE.LineBasicMaterial({color: 0xff00ff}));
    tessMesh.add(tessInnerMesh); // Inner cube linked to outer
    meshes.tesseract = tessMesh;
    meshes.tesseractInner = tessInnerMesh;
    
    parts.push({
        name: "Tesseract Hyper-Projection Node",
        description: "A 3D shadow of a 4-dimensional hypercube, acting as a spatial anchor.",
        material: "Pure Light / Vector Fields",
        function: "Projects a 4D containment field that prevents multidimensional particles from escaping.",
        assemblyOrder: ++partIndex,
        connections: ["Topological Defect Stabilizer"],
        failureEffect: "Matter randomly translates along the 4th spatial dimension, disappearing.",
        cascadeFailures: ["Complete data loss"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: -30, y: 30, z: -30}
    });

    // 15-18. Void Tethering Anchors
    meshes.tethers = [];
    const tetherAngles = [Math.PI/4, 3*Math.PI/4, 5*Math.PI/4, 7*Math.PI/4];
    tetherAngles.forEach((angle, i) => {
        const tetherGeo = new THREE.CylinderGeometry(1, 2, 40, 16);
        const tetherMesh = new THREE.Mesh(tetherGeo, darkSteel);
        tetherMesh.position.set(Math.cos(angle) * 30, -20, Math.sin(angle) * 30);
        tetherMesh.rotation.x = Math.PI / 8 * Math.cos(angle);
        tetherMesh.rotation.z = Math.PI / 8 * Math.sin(angle);
        group.add(tetherMesh);
        meshes.tethers.push(tetherMesh);
        
        parts.push({
            name: `Void Tethering Anchor Node ${i+1}`,
            description: "Massive dark steel spikes driven deep into the bedrock, laced with exotic matter.",
            material: "darkSteel",
            function: "Mechanically and gravitationally grounds the Harvester against recoil from spacetime ripples.",
            assemblyOrder: ++partIndex,
            connections: ["Dark Energy Phase Inverter"],
            failureEffect: "Harvester detaches from the planet's surface, launching itself into orbit via anti-gravity.",
            cascadeFailures: ["Catastrophic atmospheric ignition"],
            originalPosition: {x: tetherMesh.position.x, y: tetherMesh.position.y, z: tetherMesh.position.z},
            explodedPosition: {
                x: tetherMesh.position.x * 2, 
                y: tetherMesh.position.y - 30, 
                z: tetherMesh.position.z * 2
            }
        });
    });

    // 19. Baryogenesis Catalysis Tube
    const tubePath = new THREE.LineCurve3(new THREE.Vector3(0, -30, 0), new THREE.Vector3(0, -80, 0));
    const tubeGeo = new THREE.TubeGeometry(tubePath, 64, 2, 16, false);
    const tubeMesh = new THREE.Mesh(tubeGeo, glass);
    group.add(tubeMesh);
    meshes.baryoTube = tubeMesh;
    parts.push({
        name: "Baryogenesis Catalysis Tube",
        description: "A deeply shielded glass conduit filled with CP-violating plasma.",
        material: "glass, plasma",
        function: "Funnel converted dark matter back into standard baryonic matter for physical extraction.",
        assemblyOrder: ++partIndex,
        connections: ["Axion Conversion Chamber", "Exotic Matter Siphon"],
        failureEffect: "Production of antimatter instead of matter, leading to immediate annihilation.",
        cascadeFailures: ["Total vaporization of the facility"],
        originalPosition: {x: 0, y: -55, z: 0},
        explodedPosition: {x: 0, y: -90, z: 0}
    });

    // 20. Exotic Matter Siphon
    const siphonGeo = new THREE.TorusGeometry(8, 2, 32, 64);
    const siphonMesh = new THREE.Mesh(siphonGeo, rubber);
    siphonMesh.position.y = -80;
    siphonMesh.rotation.x = Math.PI / 2;
    group.add(siphonMesh);
    meshes.siphon = siphonMesh;
    parts.push({
        name: "Exotic Matter Siphon",
        description: "Industrial-scale rubberized extraction ring for interfacing with external storage.",
        material: "rubber",
        function: "The final output valve for synthesized baryonic matter.",
        assemblyOrder: ++partIndex,
        connections: ["Baryogenesis Catalysis Tube"],
        failureEffect: "Matter jams in the valve, causing backflow.",
        cascadeFailures: ["Baryogenesis Catalysis Tube rupture"],
        originalPosition: {x: 0, y: -80, z: 0},
        explodedPosition: {x: 0, y: -120, z: 0}
    });

    // 21. Quantum Foam Agitator
    const foamGeo = new THREE.DodecahedronGeometry(25, 2);
    const foamMesh = new THREE.Mesh(foamGeo, new THREE.MeshBasicMaterial({color: 0x222222, wireframe: true, transparent: true, opacity: 0.1}));
    group.add(foamMesh);
    meshes.foam = foamMesh;
    parts.push({
        name: "Quantum Foam Agitator",
        description: "A faint, barely visible dodecahedral field acting on the Planck scale.",
        material: "Energy Field",
        function: "Smooths out quantum fluctuations in the vacuum to prevent virtual particles from interfering with the dark matter flow.",
        assemblyOrder: ++partIndex,
        connections: ["Graviton Synchronization Emitters"],
        failureEffect: "Virtual black holes pop in and out of existence, causing severe micro-seismic activity.",
        cascadeFailures: ["Topological Defect Stabilizer overload"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 60, y: 60, z: 60}
    });


    // ==========================================
    // NEGATIVE-COLOR DARK MATTER PARTICLE SYSTEM
    // ==========================================
    const particleCount = 20000;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    const pTarget = new Float32Array(particleCount * 3);
    const pPhase = new Float32Array(particleCount);

    for(let i=0; i<particleCount; i++) {
        // Start out in a wide disk (the halo)
        const r = 100 + Math.random() * 100;
        const theta = Math.random() * Math.PI * 2;
        const h = (Math.random() - 0.5) * 40;
        
        pPos[i*3] = r * Math.cos(theta);
        pPos[i*3+1] = h;
        pPos[i*3+2] = r * Math.sin(theta);
        
        // Target is the Event Horizon Torus (near center)
        const tr = Math.random() * 12;
        const tt = Math.random() * Math.PI * 2;
        pTarget[i*3] = tr * Math.cos(tt);
        pTarget[i*3+1] = (Math.random() - 0.5) * 5;
        pTarget[i*3+2] = tr * Math.sin(tt);
        
        pPhase[i] = Math.random() * 10.0; // Random start phase
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('aTarget', new THREE.BufferAttribute(pTarget, 3));
    pGeo.setAttribute('aPhase', new THREE.BufferAttribute(pPhase, 1));

    const pMat = new THREE.ShaderMaterial({
        vertexShader: particleVertexShader,
        fragmentShader: particleFragmentShader,
        uniforms: {
            uTime: { value: 0 }
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending // Using additive, but shader outputs negative-like effects via alpha inversion
    });

    const particleSystem = new THREE.Points(pGeo, pMat);
    group.add(particleSystem);
    meshes.particles = particleSystem;

    // ==========================================
    // QUIZ QUESTIONS (PhD LEVEL COSMOLOGY/PHYSICS)
    // ==========================================
    const quizQuestions = [
        {
            question: "In the context of the Weakly Interacting Massive Particle (WIMP) 'miracle', what is the approximate required thermal-averaged annihilation cross-section ⟨σv⟩ for a particle to freeze out with the correct relic density to account for observed dark matter?",
            options: [
                "~3 × 10^-26 cm³/s",
                "~1 × 10^-15 cm³/s",
                "~5 × 10^-40 cm³/s",
                "~9 × 10^-9 cm³/s"
            ],
            correctAnswer: 0,
            explanation: "The WIMP miracle refers to the coincidence that a particle with weak-scale mass (100 GeV - 1 TeV) and weak-scale coupling naturally yields an annihilation cross-section of ~3 × 10^-26 cm³/s, exactly what is needed for the observed dark matter relic abundance."
        },
        {
            question: "Which anomalous observation in the rotation curves of spiral galaxies, first extensively documented by Vera Rubin, provided one of the strongest initial pieces of evidence for dark matter halos?",
            options: [
                "Rotation curves drop steeply proportional to 1/r² at the visible edge.",
                "Rotation curves remain flat at large radii, deviating from Newtonian/Keplerian decline.",
                "Galactic centers rotate significantly slower than predicted by their black hole mass.",
                "Stars in the galactic disk exhibit perpendicular oscillatory motion exceeding expected baryonic mass."
            ],
            correctAnswer: 1,
            explanation: "Vera Rubin observed that stars at the outer edges of spiral galaxies rotate at roughly the same speed as stars closer in, resulting in 'flat' rotation curves. Newtonian dynamics without dark matter predicts a Keplerian decline proportional to 1/√r."
        },
        {
            question: "In models of axion dark matter, the axion arises as a pseudo-Nambu-Goldstone boson from the spontaneous breaking of which symmetry introduced to solve the strong CP problem in quantum chromodynamics (QCD)?",
            options: [
                "Baryon minus Lepton (B-L) symmetry",
                "Chiral symmetry",
                "Peccei-Quinn symmetry",
                "Supersymmetry"
            ],
            correctAnswer: 2,
            explanation: "The Peccei-Quinn [U(1)PQ] symmetry was introduced to dynamically drive the strong CP phase to zero. When this symmetry is spontaneously broken, it gives rise to the axion."
        },
        {
            question: "Gravitational lensing by dark matter clusters can produce distortions of background galaxies. In the weak lensing regime, the distortion is quantified by convergence (κ) and shear (γ). Which of these directly describes the isotropic magnification of the source?",
            options: [
                "Shear (γ)",
                "Convergence (κ)",
                "Flexion (F)",
                "Reduced shear (g)"
            ],
            correctAnswer: 1,
            explanation: "Convergence (κ) causes an isotropic magnification (scaling) of the source image, while shear (γ) causes anisotropic stretching (distortion of the shape)."
        },
        {
            question: "What mechanism differentiates warm dark matter (WDM) from cold dark matter (CDM) in terms of structure formation in the early universe?",
            options: [
                "WDM particles decouple while relativistic, creating a non-negligible free-streaming length that smears out small-scale density perturbations.",
                "WDM particles annihilate much faster, preventing the formation of galactic halos entirely.",
                "CDM interacts strongly with photons prior to recombination, whereas WDM does not.",
                "WDM is entirely composed of primordial black holes which evaporate too quickly to form small halos."
            ],
            correctAnswer: 0,
            explanation: "Because WDM particles are lighter and decouple while still relativistic (or semi-relativistic), they 'free-stream' out of small overdense regions, erasing structure on small scales. CDM decouples when non-relativistic, preserving small-scale structure."
        }
    ];

    // ==========================================
    // ANIMATION LOGIC (EXTREME COMPLEXITY)
    // ==========================================
    const animate = (time, speed = 1, extMeshes = null) => {
        const delta = speed * 0.01;
        const totalTime = time * speed;

        // 1. Update Shader Uniforms
        exoticMatterMat.uniforms.uTime.value = totalTime;
        pMat.uniforms.uTime.value = totalTime;

        // 2. Complex Torus and Calabi-Yau rotations
        meshes.containmentTorus.rotation.x = Math.sin(totalTime * 0.5) * 0.5;
        meshes.containmentTorus.rotation.y += 0.02 * speed;
        meshes.containmentTorus.rotation.z = Math.cos(totalTime * 0.3) * 0.5;
        
        meshes.calabiYau.rotation.x -= 0.015 * speed;
        meshes.calabiYau.rotation.y += 0.03 * speed;
        // Pulse scale of Calabi-Yau based on sine waves
        const cyScale = 1.5 + Math.sin(totalTime * 2) * 0.1;
        meshes.calabiYau.scale.set(cyScale, cyScale, cyScale);

        // 3. Attractor Coil
        meshes.attractor.rotation.z += 0.05 * speed;
        meshes.attractor.rotation.x = Math.sin(totalTime) * 0.1;

        // 4. Emitters (Oscillating and focusing)
        meshes.emitters.forEach((emitter, index) => {
            // Emitters pulse radially inwards and outwards slightly
            const angle = (index * Math.PI/2);
            const rOffset = 25 + Math.sin(totalTime * 4 + index) * 2; // Pulsing distance
            emitter.position.x = Math.cos(angle) * rOffset;
            emitter.position.z = Math.sin(angle) * rOffset;
            
            // Spin the inner parts of the emitters
            emitter.children[1].rotation.y += 0.1 * speed; // inner plasma rod
            
            // Spin the focusing rings
            for(let j=2; j<=6; j++) {
                if(emitter.children[j]) {
                    emitter.children[j].rotation.y = totalTime * (j-1) * 0.5;
                }
            }
        });

        // 5. Cryo-core & Shell
        meshes.cryo.rotation.y -= 0.005 * speed;
        meshes.shell.rotation.y += 0.01 * speed;
        meshes.shell.rotation.z = Math.sin(totalTime * 0.2) * 0.2;

        // 6. Axion Chamber and Baryo Tube
        meshes.axion.rotation.y -= 0.08 * speed;
        
        // 7. Dark Energy Phase Inverter (Pulsing expansion)
        const inverterScale = 1.0 + Math.sin(totalTime * 1.5) * 0.05;
        meshes.inverter.scale.set(inverterScale, 1.0, inverterScale);
        meshes.inverter.rotation.z -= 0.02 * speed;

        // 8. Tesseract Hyper-Projection (4D rotation approximation)
        meshes.tesseract.rotation.x = totalTime * 0.4;
        meshes.tesseract.rotation.y = totalTime * 0.5;
        // Inner cube rotates opposite to simulate 4D perspective shift
        meshes.tesseractInner.rotation.x = -totalTime * 0.8;
        meshes.tesseractInner.rotation.y = -totalTime * 0.9;
        
        // Scale inner cube to simulate passing through 3D space
        const w = (Math.sin(totalTime * 2) + 1.5) / 2; // W-axis proxy
        meshes.tesseractInner.scale.set(w, w, w);

        // 9. Void Tethers
        meshes.tethers.forEach((tether, index) => {
            // Vibrate violently
            tether.position.y = -20 + (Math.random() - 0.5) * 0.2 * speed;
        });

        // 10. Quantum Foam (Erratic shaking)
        meshes.foam.rotation.x = Math.random() * Math.PI * 2;
        meshes.foam.rotation.y = Math.random() * Math.PI * 2;
        const foamScale = 1.0 + (Math.random() - 0.5) * 0.05;
        meshes.foam.scale.set(foamScale, foamScale, foamScale);

        // 11. WIMP Capture Matrix
        meshes.wimpMatrix.rotation.x += 0.03 * speed;
        meshes.wimpMatrix.rotation.y -= 0.02 * speed;
    };

    return { group, parts, description, quizQuestions, animate };
}
