import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

// ============================================================================
// CLARKETECH PROGRAMMABLE MATTER ASSEMBLER (GOD TIER)
// ============================================================================
// A hyper-advanced nanotechnology construction platform manipulating a fluid-like
// cloud of programmable matter (utility fog) to construct macroscopic megastructures.
// ============================================================================

// --- CUSTOM SHADERS FOR ADVANCED VISUALS ---

const naniteVertexShader = `
    uniform float time;
    uniform float progress;
    
    attribute vec3 targetPosition;
    attribute float randomSeed;
    attribute vec3 swarmOffset;
    
    varying float vDistance;
    varying vec3 vColor;
    varying float vState;

    // Classic Perlin 3D Noise 
    // by Stefan Gustavson
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
    vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

    float cnoise(vec3 P){
      vec3 Pi0 = floor(P); // Integer part for indexing
      vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
      Pi0 = mod(Pi0, 289.0);
      Pi1 = mod(Pi1, 289.0);
      vec3 Pf0 = fract(P); // Fractional part for interpolation
      vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
      vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
      vec4 iy = vec4(Pi0.y, Pi0.y, Pi1.y, Pi1.y);
      vec4 iz0 = Pi0.z * vec4(1.0);
      vec4 iz1 = Pi1.z * vec4(1.0);
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
      float n100 = dot(g100, vec3(Pf1.x, Pf0.y, Pf0.z));
      float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
      float n110 = dot(g110, vec3(Pf1.x, Pf1.y, Pf0.z));
      float n001 = dot(g001, vec3(Pf0.x, Pf0.y, Pf1.z));
      float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
      float n011 = dot(g011, vec3(Pf0.x, Pf1.y, Pf1.z));
      float n111 = dot(g111, vec3(Pf1.x, Pf1.y, Pf1.z));
      vec3 fade_xyz = fade(Pf0);
      vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
      vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
      float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
      return 2.2 * n_xyz;
    }

    // Curl noise for fluid-like motion
    vec3 curlNoise(vec3 p) {
        float e = 0.1;
        vec3 dx = vec3(e, 0.0, 0.0);
        vec3 dy = vec3(0.0, e, 0.0);
        vec3 dz = vec3(0.0, 0.0, e);
        
        vec3 p_x0 = vec3(cnoise(p - dx), cnoise(p - dx + vec3(12.3, 45.6, 78.9)), cnoise(p - dx + vec3(98.7, 65.4, 32.1)));
        vec3 p_x1 = vec3(cnoise(p + dx), cnoise(p + dx + vec3(12.3, 45.6, 78.9)), cnoise(p + dx + vec3(98.7, 65.4, 32.1)));
        vec3 p_y0 = vec3(cnoise(p - dy), cnoise(p - dy + vec3(12.3, 45.6, 78.9)), cnoise(p - dy + vec3(98.7, 65.4, 32.1)));
        vec3 p_y1 = vec3(cnoise(p + dy), cnoise(p + dy + vec3(12.3, 45.6, 78.9)), cnoise(p + dy + vec3(98.7, 65.4, 32.1)));
        vec3 p_z0 = vec3(cnoise(p - dz), cnoise(p - dz + vec3(12.3, 45.6, 78.9)), cnoise(p - dz + vec3(98.7, 65.4, 32.1)));
        vec3 p_z1 = vec3(cnoise(p + dz), cnoise(p + dz + vec3(12.3, 45.6, 78.9)), cnoise(p + dz + vec3(98.7, 65.4, 32.1)));
        
        float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
        float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
        float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;
        
        return normalize(vec3(x, y, z) / (2.0 * e));
    }

    void main() {
        // Calculate dynamic swarm position
        float t = time * 0.5 + randomSeed * 100.0;
        
        vec3 noisePos = swarmOffset * 0.2 + vec3(t * 0.2);
        vec3 curl = curlNoise(noisePos) * 15.0;
        vec3 fluidPosition = swarmOffset + curl;
        
        // Determine state based on progress and random seed
        // Progress goes from 0 to 1. Particles with lower randomSeed solidify first.
        float transitionThreshold = progress;
        float state = smoothstep(transitionThreshold - 0.1, transitionThreshold + 0.1, randomSeed);
        vState = state;
        
        // Morph between fluid state and solid target structure
        vec3 finalPosition = mix(targetPosition, fluidPosition, state);
        
        // Add micro-vibrations to fluid state
        vec3 microNoise = vec3(cnoise(finalPosition * 10.0 + time), cnoise(finalPosition * 10.0 + time + 10.0), cnoise(finalPosition * 10.0 + time + 20.0));
        finalPosition += microNoise * 0.1 * state;

        vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(finalPosition, 1.0);
        
        // Transform the vertex coordinates 
        vec3 transformed = position;
        
        // Scale down if solidified to form a dense crystal lattice look
        float scale = mix(1.0, 1.5 + sin(time*5.0 + randomSeed*10.0)*0.5, state);
        transformed *= scale;
        
        gl_Position = projectionMatrix * mvPosition + vec4(transformed, 0.0);
        
        // Calculate varying for fragment shader
        vDistance = length(mvPosition.xyz);
        
        // Colors: Fluid = glowing cyan/purple, Solid = dark metallic/silver
        vec3 fluidColor = mix(vec3(0.0, 1.0, 1.0), vec3(0.8, 0.0, 1.0), sin(time + randomSeed * 6.28) * 0.5 + 0.5);
        vec3 solidColor = vec3(0.7, 0.75, 0.8);
        vColor = mix(solidColor, fluidColor, state);
    }
`;

const naniteFragmentShader = `
    varying float vDistance;
    varying vec3 vColor;
    varying float vState;

    void main() {
        // Circular particle
        vec2 coord = gl_PointCoord - vec2(0.5);
        if(length(coord) > 0.5) discard;
        
        // Soft edge for fluid, hard edge for solid
        float alpha = mix(1.0, smoothstep(0.5, 0.3, length(coord)), vState);
        
        // Glow intensity
        float glow = mix(1.0, 2.0, vState);
        
        gl_FragColor = vec4(vColor * glow, alpha);
    }
`;

const holoFieldVertexShader = `
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
`;

const holoFieldFragmentShader = `
    uniform float time;
    uniform vec3 color;
    varying vec3 vWorldPosition;
    varying vec3 vNormal;

    void main() {
        vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
        float fresnel = dot(viewDirection, vNormal);
        fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
        fresnel = pow(fresnel, 3.0);
        
        float scanline = sin(vWorldPosition.y * 20.0 - time * 5.0) * 0.5 + 0.5;
        float gridX = sin(vWorldPosition.x * 10.0) * 0.5 + 0.5;
        float gridZ = sin(vWorldPosition.z * 10.0) * 0.5 + 0.5;
        float grid = pow(gridX * gridZ, 4.0);
        
        float alpha = (fresnel * 0.8 + scanline * 0.2 + grid * 0.5) * 0.5;
        
        gl_FragColor = vec4(color, alpha);
    }
`;


export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // ==========================================
    // MATERIALS
    // ==========================================
    const blackMetal = new THREE.MeshStandardMaterial({
        color: 0x111111,
        metalness: 0.9,
        roughness: 0.2,
        envMapIntensity: 1.0
    });
    
    const glowingBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00aaff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.9
    });
    
    const glowingPurple = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xaa00ff,
        emissiveIntensity: 2.0
    });
    
    const goldContacts = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        metalness: 1.0,
        roughness: 0.1
    });

    const energyMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            color: { value: new THREE.Color(0x00ffff) }
        },
        vertexShader: holoFieldVertexShader,
        fragmentShader: holoFieldFragmentShader,
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    // ==========================================
    // PROCEDURAL MEGASTRUCTURE GENERATION (THE TARGET)
    // ==========================================
    // The target structure is a highly complex starship warp core / zero-point extractor
    const targetGeometries = [];
    const targetPositions = [];
    
    const numCoreRings = 24;
    for(let i=0; i<numCoreRings; i++) {
        const y = (i - numCoreRings/2) * 1.5;
        const radius = 5 + Math.sin(i * Math.PI / numCoreRings) * 4;
        const ringGeo = new THREE.TorusGeometry(radius, 0.4, 16, 64);
        ringGeo.translate(0, y, 0);
        targetGeometries.push(ringGeo);
        
        // Inner complex structures
        for(let j=0; j<8; j++) {
            const angle = (j / 8) * Math.PI * 2;
            const strut = new THREE.BoxGeometry(2, 0.5, radius * 0.8);
            strut.translate(Math.cos(angle) * radius * 0.5, y, Math.sin(angle) * radius * 0.5);
            strut.rotateY(-angle);
            targetGeometries.push(strut);
            
            // Add tiny greebles
            const greeble = new THREE.CylinderGeometry(0.2, 0.2, 1, 8);
            greeble.translate(Math.cos(angle) * radius * 0.9, y + 0.5, Math.sin(angle) * radius * 0.9);
            targetGeometries.push(greeble);
        }
    }
    
    // Central Spine
    const spineGeo = new THREE.CylinderGeometry(2, 2, numCoreRings * 1.5, 32);
    targetGeometries.push(spineGeo);
    
    // Combine all target geometries to extract particle positions
    const mergedTargetGeo = mergeBufferGeometries(THREE, targetGeometries);
    
    // Extract points for programmable matter targets
    const posAttribute = mergedTargetGeo.attributes.position;
    const vertexCount = posAttribute.count;
    const NUM_NANITES = 100000; // 100k particles
    
    const targetPositionsArray = new Float32Array(NUM_NANITES * 3);
    const randomSeedsArray = new Float32Array(NUM_NANITES);
    const swarmOffsetArray = new Float32Array(NUM_NANITES * 3);
    
    // We will randomly sample vertices from the target geometry to form the target positions
    for(let i=0; i<NUM_NANITES; i++) {
        const vIdx = Math.floor(Math.random() * vertexCount);
        targetPositionsArray[i*3] = posAttribute.getX(vIdx);
        targetPositionsArray[i*3+1] = posAttribute.getY(vIdx);
        targetPositionsArray[i*3+2] = posAttribute.getZ(vIdx);
        
        randomSeedsArray[i] = Math.random();
        
        // Fluid swarm forms a large sphere around the construction site
        const rho = 15 + Math.random() * 20;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        swarmOffsetArray[i*3] = rho * Math.sin(phi) * Math.cos(theta);
        swarmOffsetArray[i*3+1] = rho * Math.sin(phi) * Math.sin(theta) + 10;
        swarmOffsetArray[i*3+2] = rho * Math.cos(phi);
    }
    
    // Particle Geometry (a tiny tetrahedron for each nanite)
    const naniteGeo = new THREE.TetrahedronGeometry(0.05, 0);
    const instancedNaniteGeo = new THREE.InstancedBufferGeometry();
    instancedNaniteGeo.index = naniteGeo.index;
    instancedNaniteGeo.attributes.position = naniteGeo.attributes.position;
    instancedNaniteGeo.attributes.normal = naniteGeo.attributes.normal;
    
    instancedNaniteGeo.setAttribute('targetPosition', new THREE.InstancedBufferAttribute(targetPositionsArray, 3));
    instancedNaniteGeo.setAttribute('randomSeed', new THREE.InstancedBufferAttribute(randomSeedsArray, 1));
    instancedNaniteGeo.setAttribute('swarmOffset', new THREE.InstancedBufferAttribute(swarmOffsetArray, 3));
    
    const naniteMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            progress: { value: 0.0 } // 0 = fully fluid, 1 = fully solid
        },
        vertexShader: naniteVertexShader,
        fragmentShader: naniteFragmentShader,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    const naniteCloud = new THREE.InstancedMesh(instancedNaniteGeo, naniteMaterial, NUM_NANITES);
    group.add(naniteCloud);
    
    parts.push({
        name: "Utility Fog Swarm",
        description: "100,000 sub-atomic nanite constructors operating in synchronized swarm logic, acting as programmable matter.",
        material: "Femtotech Metamaterial",
        function: "Morphs seamlessly between a fluid-like transportation state and a highly rigid solid lattice to construct megastructures.",
        assemblyOrder: 1,
        connections: ["Holographic Control Fields", "Zero-Point Pylons"],
        failureEffect: "Swarm logic decoherence leading to 'gray goo' cascade or spontaneous matter disintegration.",
        cascadeFailures: ["Matter Disintegration", "Quantum Vacuum Collapse"],
        originalPosition: { x: 0, y: 10, z: 0 },
        explodedPosition: { x: 0, y: 30, z: 0 }
    });

    // ==========================================
    // BASE & CONTAINMENT FIELD
    // ==========================================
    const baseGroup = new THREE.Group();
    
    // Main foundation ring
    const foundationGeo = new THREE.TorusGeometry(30, 2, 64, 128);
    const foundation = new THREE.Mesh(foundationGeo, blackMetal);
    foundation.rotation.x = Math.PI / 2;
    foundation.position.y = -20;
    baseGroup.add(foundation);

    parts.push({
        name: "Containment Foundation Ring",
        description: "A massive super-dense torus generating the lower bounds of the gravitational containment field.",
        material: "Neutronium-laced Hypersteel",
        function: "Prevents localized space-time tearing caused by intense utility fog mass fluctuations.",
        assemblyOrder: 2,
        connections: ["Graviton Injectors", "Emitter Pylons"],
        failureEffect: "Gravitational shear waves destroying surrounding landscape.",
        cascadeFailures: ["Micro-singularity Formation"],
        originalPosition: { x: 0, y: -20, z: 0 },
        explodedPosition: { x: 0, y: -50, z: 0 }
    });
    
    // Inner glowing containment grid
    const gridGeo = new THREE.CylinderGeometry(28, 28, 0.5, 64);
    const grid = new THREE.Mesh(gridGeo, glowingBlue);
    grid.position.y = -19.5;
    baseGroup.add(grid);

    // ==========================================
    // EMITTER PYLONS (6 highly detailed towers)
    // ==========================================
    const pylons = [];
    const numPylons = 6;
    const pylonRadius = 25;
    
    for(let i=0; i<numPylons; i++) {
        const pGroup = new THREE.Group();
        const angle = (i / numPylons) * Math.PI * 2;
        
        // Pylon Base
        const pBaseGeo = new THREE.CylinderGeometry(4, 5, 10, 16);
        const pBase = new THREE.Mesh(pBaseGeo, darkSteel);
        pBase.position.y = -15;
        pGroup.add(pBase);
        
        // Main Shaft (Hexagonal)
        const shaftGeo = new THREE.CylinderGeometry(2, 3, 50, 6);
        const shaft = new THREE.Mesh(shaftGeo, blackMetal);
        shaft.position.y = 15;
        pGroup.add(shaft);
        
        // Energy Veins along shaft
        const veinGeo = new THREE.CylinderGeometry(2.1, 3.1, 48, 6, 1, true);
        const veinMaterial = glowingPurple.clone();
        veinMaterial.wireframe = true;
        const vein = new THREE.Mesh(veinGeo, veinMaterial);
        vein.position.y = 15;
        pGroup.add(vein);
        
        // Articulated Projection Head
        const headGroup = new THREE.Group();
        headGroup.position.y = 42;
        
        const headJointGeo = new THREE.SphereGeometry(3, 32, 32);
        const headJoint = new THREE.Mesh(headJointGeo, chrome);
        headGroup.add(headJoint);
        
        // Projection Lens Housing
        const housingGeo = new THREE.CylinderGeometry(2, 4, 8, 16);
        const housing = new THREE.Mesh(housingGeo, darkSteel);
        housing.rotation.x = Math.PI / 2;
        housing.position.z = 4;
        headGroup.add(housing);
        
        // The actual Lens
        const lensGeo = new THREE.SphereGeometry(2, 32, 32, 0, Math.PI*2, 0, Math.PI/2);
        const lens = new THREE.Mesh(lensGeo, glowingBlue);
        lens.rotation.x = Math.PI / 2;
        lens.position.z = 8;
        headGroup.add(lens);
        
        // Hydraulic supports for the head
        for(let h=0; h<3; h++) {
            const hAngle = (h/3) * Math.PI * 2;
            const hydGeo = new THREE.CylinderGeometry(0.2, 0.2, 6);
            const hyd = new THREE.Mesh(hydGeo, steel);
            hyd.position.set(Math.cos(hAngle)*2, -3, Math.sin(hAngle)*2);
            hyd.rotation.x = Math.PI/6 * Math.cos(hAngle);
            hyd.rotation.z = Math.PI/6 * Math.sin(hAngle);
            headGroup.add(hyd);
        }
        
        pGroup.add(headGroup);
        
        // Position the entire pylon
        pGroup.position.x = Math.cos(angle) * pylonRadius;
        pGroup.position.z = Math.sin(angle) * pylonRadius;
        
        // Rotate to face center
        pGroup.rotation.y = -angle - Math.PI/2;
        
        baseGroup.add(pGroup);
        pylons.push({ group: pGroup, head: headGroup });
        
        parts.push({
            name: `Holographic Emitter Pylon ${i+1}`,
            description: "Projects non-local quantum magnetic fields to dictate the morphing target coordinates of the utility fog.",
            material: "Superconducting Chrome/Steel Alloy",
            function: "Provides structural blueprint data and field manipulation energy.",
            assemblyOrder: 3 + i,
            connections: ["Containment Foundation", "Utility Fog Swarm"],
            failureEffect: "Loss of structural blueprint data causing utility fog to crystallize in random fractal patterns.",
            cascadeFailures: ["Structural Mutation", "Energy Overload"],
            originalPosition: { x: pGroup.position.x, y: 0, z: pGroup.position.z },
            explodedPosition: { x: pGroup.position.x * 2.5, y: 20, z: pGroup.position.z * 2.5 }
        });
    }
    
    // ==========================================
    // HOLOGRAPHIC CONTROL FIELDS
    // ==========================================
    // Volumetric cones emitted from pylons to the center
    const fieldGroups = new THREE.Group();
    for(let i=0; i<numPylons; i++) {
        const angle = (i / numPylons) * Math.PI * 2;
        // Distance from pylon head to center (approx 0, 42, 0 to pylonRadius, 42, 0)
        // Actually target center is varying, let's target (0, 10, 0)
        const pylonPos = new THREE.Vector3(Math.cos(angle)*pylonRadius, 42, Math.sin(angle)*pylonRadius);
        const targetPos = new THREE.Vector3(0, 10, 0);
        
        const dist = pylonPos.distanceTo(targetPos);
        const coneGeo = new THREE.ConeGeometry(8, dist, 32, 1, true);
        const cone = new THREE.Mesh(coneGeo, energyMaterial);
        
        // Position halfway
        cone.position.copy(pylonPos).lerp(targetPos, 0.5);
        
        // Look at target
        cone.lookAt(targetPos);
        cone.rotateX(Math.PI/2); // Align cone correctly
        
        fieldGroups.add(cone);
    }
    group.add(fieldGroups);
    group.add(baseGroup);

    // ==========================================
    // SUB-COMPONENTS & GREEBLES (Massive detail injection)
    // ==========================================
    const detailGroup = new THREE.Group();
    
    // Add cooling vents and quantum piping around the base
    const pipeGeo = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(30, -20, 0),
            new THREE.Vector3(35, -15, 0),
            new THREE.Vector3(35, -5, 5),
            new THREE.Vector3(25, -5, 10),
            new THREE.Vector3(20, -10, 15)
        ]), 64, 0.8, 16, false
    );
    
    for(let k=0; k<12; k++) {
        const pGroup = new THREE.Group();
        const p1 = new THREE.Mesh(pipeGeo, copper);
        pGroup.add(p1);
        
        // Control boxes
        const box = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 4), chrome);
        box.position.set(35, -10, 2);
        pGroup.add(box);
        
        pGroup.rotation.y = (k/12) * Math.PI * 2;
        detailGroup.add(pGroup);
    }
    baseGroup.add(detailGroup);

    parts.push({
        name: "Quantum Phase Cooling Pipes",
        description: "Circulates liquid helium-3 mixed with chroniton particles to maintain absolute zero in the primary processors.",
        material: "Copper/Graphene Composite",
        function: "Thermal regulation of the massive computational load required for nanite swarm coordination.",
        assemblyOrder: 15,
        connections: ["Main Processors", "Pylon Bases"],
        failureEffect: "Thermal runaway melting the assembler into radioactive slag.",
        cascadeFailures: ["Processor Melt", "Containment Breach"],
        originalPosition: { x: 0, y: -15, z: 0 },
        explodedPosition: { x: 0, y: -40, z: 0 }
    });

    parts.push({
        name: "Sub-space Data Transceivers",
        description: "High-bandwidth FTL communication nodes linking the assembler to the planetary master-AI.",
        material: "Tachyon-infused Quartz",
        function: "Downloads blueprints for megastructures directly into pylon memory banks.",
        assemblyOrder: 16,
        connections: ["Pylon Bases", "Outer Ring"],
        failureEffect: "Data corruption leading to inverted structure generation (building structures inside-out).",
        cascadeFailures: ["Blueprint Corruption"],
        originalPosition: { x: 35, y: -10, z: 2 },
        explodedPosition: { x: 60, y: -10, z: 30 }
    });

    // Central Zero-Point Energy Core
    const coreGeo = new THREE.IcosahedronGeometry(6, 2);
    const coreMat = glowingPurple.clone();
    coreMat.wireframe = true;
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.y = -10;
    baseGroup.add(coreMesh);
    
    const coreInner = new THREE.Mesh(new THREE.OctahedronGeometry(4, 0), glowingBlue);
    coreInner.position.y = -10;
    baseGroup.add(coreInner);

    parts.push({
        name: "Zero-Point Energy Core",
        description: "Extracts limitless energy from the quantum vacuum fluctuations to power the assembler.",
        material: "Stabilized Strangelet Crystal",
        function: "Provides the immense exawatts of power required for continuous nanite replication and field generation.",
        assemblyOrder: 17,
        connections: ["Containment Foundation", "Cooling Pipes"],
        failureEffect: "Catastrophic vacuum decay initiating a false-vacuum collapse.",
        cascadeFailures: ["Complete Universal Annihilation (Localized)"],
        originalPosition: { x: 0, y: -10, z: 0 },
        explodedPosition: { x: 0, y: -80, z: 0 }
    });

    // ==========================================
    // HELPER FUNCTIONS
    // ==========================================
    function mergeBufferGeometries(THREE, geometries) {
        // Very basic custom geometry merger for simplicity in this context
        // In a real Three.js app, we'd use BufferGeometryUtils
        let totalVertices = 0;
        for(let g of geometries) {
            totalVertices += g.attributes.position.count;
        }
        
        const mergedPositions = new Float32Array(totalVertices * 3);
        let offset = 0;
        
        for(let g of geometries) {
            const positions = g.attributes.position.array;
            for(let i=0; i<positions.length; i++) {
                mergedPositions[offset++] = positions[i];
            }
        }
        
        const mergedGeo = new THREE.BufferGeometry();
        mergedGeo.setAttribute('position', new THREE.BufferAttribute(mergedPositions, 3));
        return mergedGeo;
    }

    // ==========================================
    // METADATA & EXPORTS
    // ==========================================

    const description = "A God-Tier Clarketech Programmable Matter Assembler. Utilizing trillions of femtotech utility fog nanites, it manipulates matter at the sub-atomic scale. Holographic emitter pylons project structural blueprints via quantum magnetic fields, causing the fluidic nanite cloud to rapidly solidify into macroscopic megastructures (such as starship engines or dyson sphere segments). Features zero-point energy extraction and sub-space blueprint processing.";

    const quizQuestions = [
        {
            question: "How does the utility fog achieve macroscopic rigidity from a fluid state?",
            options: [
                "By freezing the nanites using liquid helium.",
                "Through physical interlocking and strong nuclear force manipulation at the contact nodes.",
                "By increasing gravitational mass until they compress into a solid.",
                "By using standard chemical adhesives extruded from the nanites."
            ],
            correctAnswer: 1,
            explanation: "Clarketech utility fog achieves rigidity by mechanically interlocking their fractal arms and directly modulating strong nuclear forces to create bonds stronger than diamond."
        },
        {
            question: "What is the primary function of the non-local quantum magnetic fields projected by the pylons?",
            options: [
                "To provide thermal energy to the fog.",
                "To dictate the localized space-time coordinates and target state for each individual nanite.",
                "To shield the structure from cosmic radiation.",
                "To prevent the nanites from rusting."
            ],
            correctAnswer: 1,
            explanation: "The fields act as a 4D blueprint, imparting coordinate data and energy state instructions directly to the nanites via quantum entanglement, ensuring perfect synchronization."
        },
        {
            question: "Why must the Zero-Point Energy core be stabilized with chroniton particles?",
            options: [
                "To make it glow purple.",
                "To prevent the extracted vacuum energy from cascading into a false vacuum decay.",
                "To speed up the construction process by manipulating local time.",
                "Both B and C."
            ],
            correctAnswer: 3,
            explanation: "Extracting zero-point energy risks vacuum decay; chroniton stabilization both dampens localized universal collapse and allows localized time dilation to accelerate construction."
        },
        {
            question: "What occurs during a 'gray goo' cascade failure in this specific assembler?",
            options: [
                "The nanites stop working and turn into dust.",
                "The swarm logic decoheres, causing uncontrolled replication and random matter disassembly.",
                "The structure turns completely gray due to lack of paint.",
                "The pylons explode into a gray cloud."
            ],
            correctAnswer: 1,
            explanation: "Without the pylon control fields, the swarm logic can revert to baseline replication programming, indiscriminately disassembling surrounding matter to build more nanites."
        },
        {
            question: "How do the femtotech nanites traverse the fluid-state cloud without colliding destructively?",
            options: [
                "They are extremely soft.",
                "They utilize advanced curl-noise fluid dynamic algorithms and micro-repulsion fields.",
                "They rely purely on random Brownian motion.",
                "They travel on microscopic tracks."
            ],
            correctAnswer: 1,
            explanation: "The swarm operates as an advanced non-Newtonian fluid, calculating perfect Navier-Stokes flow paths and using localized repulsion fields to prevent chaotic collisions."
        }
    ];

    // ==========================================
    // ANIMATION LOOP
    // ==========================================
    
    // Animation state variables
    let buildPhase = 0; // 0 to 1
    let buildDirection = 1;
    let cycleTime = 0;

    const animate = (time, speed, meshes) => {
        const delta = 0.01 * speed;
        cycleTime += delta;
        
        // 1. Manage build cycle (morphing from fluid to solid and back)
        // A full cycle takes roughly 1000 delta ticks
        buildPhase += delta * 0.2 * buildDirection;
        if(buildPhase > 1.2) {
            buildDirection = -1;
        } else if (buildPhase < -0.2) {
            buildDirection = 1;
        }
        
        // Clamp progress for shader between 0 and 1
        const clampedProgress = Math.max(0.0, Math.min(1.0, buildPhase));
        
        // Update Nanite Shader Uniforms
        naniteMaterial.uniforms.time.value = cycleTime;
        naniteMaterial.uniforms.progress.value = clampedProgress;
        
        // Update Energy Fields Shader Uniforms
        energyMaterial.uniforms.time.value = cycleTime;
        
        // 2. Animate Pylons
        pylons.forEach((pylon, idx) => {
            // Pulse the veins
            const vein = pylon.group.children[2];
            vein.material.emissiveIntensity = 1 + Math.sin(cycleTime * 5 + idx) * 0.5;
            
            // Articulate the head tracking the construction
            // When buildPhase is low, scan wide. When high, focus tight.
            const head = pylon.head;
            
            // Calculate a sweeping target position based on progress and time
            const targetHeight = -20 + clampedProgress * 50; // Scan upwards as it builds
            const targetRadius = 10 + Math.sin(cycleTime * 2 + idx) * 5;
            
            const scanTarget = new THREE.Vector3(
                Math.cos(cycleTime + idx) * targetRadius,
                targetHeight,
                Math.sin(cycleTime + idx) * targetRadius
            );
            
            // Pylon head world position (approx)
            const headWorldPos = new THREE.Vector3().copy(pylon.group.position);
            headWorldPos.y += 42; // Height of head
            
            // Look at target (smoothly)
            // For simplicity in this demo, direct lookAt, but we only rotate X and Z relative to base
            head.lookAt(scanTarget);
            
            // Update the holographic cone fields to match the head
            const cone = fieldGroups.children[idx];
            cone.position.copy(headWorldPos).lerp(scanTarget, 0.5);
            cone.lookAt(scanTarget);
            cone.rotateX(Math.PI/2);
            
            // Adjust cone scale based on distance and progress
            const dist = headWorldPos.distanceTo(scanTarget);
            cone.scale.set(1, dist, 1);
            
            // Pulse field intensity
            cone.material.opacity = 0.3 + Math.sin(cycleTime * 10 + idx) * 0.2;
            
            // If building is complete, dim the fields
            if(clampedProgress > 0.95) {
                cone.material.opacity *= (1.0 - clampedProgress) * 20.0;
            }
        });
        
        // 3. Rotate cores and base elements
        coreMesh.rotation.x += 0.05 * speed;
        coreMesh.rotation.y += 0.03 * speed;
        coreInner.rotation.x -= 0.04 * speed;
        coreInner.rotation.y -= 0.06 * speed;
        
        // Pulse core
        coreMesh.material.emissiveIntensity = 2 + Math.sin(cycleTime * 20) * 1;
        coreInner.material.emissiveIntensity = 2 + Math.cos(cycleTime * 25) * 1.5;
        
        // Slowly rotate the entire base for dramatic effect
        baseGroup.rotation.y += 0.001 * speed;
    };

    return { group, parts, description, quizQuestions, animate };
}
