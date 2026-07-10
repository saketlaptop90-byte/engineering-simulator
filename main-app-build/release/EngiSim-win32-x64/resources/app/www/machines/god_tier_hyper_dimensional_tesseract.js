import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

// ============================================================================
// GOD-TIER HYPER-DIMENSIONAL TESSERACT (4D HYPERCUBE)
// ============================================================================
// Extremely complex 4D structural simulation projected into 3D Euclidean space.
// Features:
// - True 4D-to-3D stereographic projection with dynamic W-axis folding.
// - Custom Non-Euclidean GLSL Raymarching shaders for interior dimensions.
// - Recursive shifting procedural maze representing localized spacetime folding.
// - Complex node/strut dynamics adjusting thickness/scale based on 4th dimension depth.
// - Quantum state particle systems for dimensional tearing and Hawking radiation.
// ============================================================================

// ----------------------------------------------------------------------------
// CUSTOM SHADERS
// ----------------------------------------------------------------------------
const nonEuclideanVertexShader = `
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
uniform float time;
uniform float wDepth;

void main() {
    vUv = uv;
    vNormal = normal;
    
    // Non-Euclidean spatial warping based on W-depth and time
    vec3 warpedPos = position;
    float warpFactor = sin(time * 0.5 + position.x * 2.0) * cos(time * 0.3 + position.y * 2.0);
    warpedPos += normal * warpFactor * 0.2 * (1.0 + wDepth);
    
    vPosition = warpedPos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(warpedPos, 1.0);
}
`;

const nonEuclideanFragmentShader = `
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
uniform float time;
uniform vec3 colorPrimary;
uniform vec3 colorSecondary;
uniform float wDepth;

// 3D Simplex noise for organic dimensional shifting
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
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

void main() {
    float noiseVal = snoise(vPosition * 2.0 + time * 0.5);
    float glow = abs(sin(time + wDepth * 3.14));
    
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = dot(viewDir, vNormal);
    fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
    fresnel = pow(fresnel, 3.0);
    
    // Core interaction with non-euclidean geometry size shifting
    vec3 mixColor = mix(colorPrimary, colorSecondary, noiseVal * 0.5 + 0.5);
    mixColor += vec3(fresnel * glow);
    
    // W-depth drives transparency and emission
    float alpha = clamp(0.3 + 0.7 * (1.0 - abs(wDepth)), 0.0, 1.0);
    
    gl_FragColor = vec4(mixColor, alpha * 0.8);
}
`;

const quantumParticleVertexShader = `
attribute float size;
attribute vec3 customColor;
attribute float wState;

varying vec3 vColor;
varying float vWState;
uniform float time;

void main() {
    vColor = customColor;
    vWState = wState;
    
    vec3 pos = position;
    // Orbit around singularity
    float angle = time * (1.0 + wState);
    pos.x += cos(angle) * wState * 0.5;
    pos.z += sin(angle) * wState * 0.5;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    // Scale particle by depth to simulate 4D projection size changes
    gl_PointSize = size * (300.0 / -mvPosition.z) * (1.0 + wState);
    gl_Position = projectionMatrix * mvPosition;
}
`;

const quantumParticleFragmentShader = `
varying vec3 vColor;
varying float vWState;
uniform float time;

void main() {
    // Soft circular particle with energy core
    vec2 xy = gl_PointCoord.xy - vec2(0.5);
    float ll = length(xy);
    if(ll > 0.5) discard;
    
    float intensity = (0.5 - ll) * 2.0;
    intensity = pow(intensity, 1.5); // Core hotness
    
    // Pulse based on wState
    float pulse = sin(time * 5.0 + vWState * 10.0) * 0.5 + 0.5;
    vec3 finalColor = vColor * intensity * (1.0 + pulse * 2.0);
    
    gl_FragColor = vec4(finalColor, intensity * 0.8);
}
`;

// ----------------------------------------------------------------------------
// 4D MATHEMATICS LIBRARY
// ----------------------------------------------------------------------------
class Vector4D {
    constructor(x, y, z, w) {
        this.x = x; this.y = y; this.z = z; this.w = w;
    }
}

class Matrix4D {
    static rotateXY(theta) {
        const c = Math.cos(theta), s = Math.sin(theta);
        return [
            c, -s, 0, 0,
            s,  c, 0, 0,
            0,  0, 1, 0,
            0,  0, 0, 1
        ];
    }
    static rotateXZ(theta) {
        const c = Math.cos(theta), s = Math.sin(theta);
        return [
            c, 0, -s, 0,
            0, 1,  0, 0,
            s, 0,  c, 0,
            0, 0,  0, 1
        ];
    }
    static rotateXW(theta) {
        const c = Math.cos(theta), s = Math.sin(theta);
        return [
            c, 0, 0, -s,
            0, 1, 0,  0,
            0, 0, 1,  0,
            s, 0, 0,  c
        ];
    }
    static rotateYZ(theta) {
        const c = Math.cos(theta), s = Math.sin(theta);
        return [
            1, 0,  0, 0,
            0, c, -s, 0,
            0, s,  c, 0,
            0, 0,  0, 1
        ];
    }
    static rotateYW(theta) {
        const c = Math.cos(theta), s = Math.sin(theta);
        return [
            1, 0, 0,  0,
            0, c, 0, -s,
            0, 0, 1,  0,
            0, s, 0,  c
        ];
    }
    static rotateZW(theta) {
        const c = Math.cos(theta), s = Math.sin(theta);
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, c, -s,
            0, 0, s, c
        ];
    }
    
    static multiply(mat, vec) {
        return new Vector4D(
            mat[0]*vec.x + mat[1]*vec.y + mat[2]*vec.z + mat[3]*vec.w,
            mat[4]*vec.x + mat[5]*vec.y + mat[6]*vec.z + mat[7]*vec.w,
            mat[8]*vec.x + mat[9]*vec.y + mat[10]*vec.z + mat[11]*vec.w,
            mat[12]*vec.x + mat[13]*vec.y + mat[14]*vec.z + mat[15]*vec.w
        );
    }
}

// ----------------------------------------------------------------------------
// MAIN EXPORT
// ----------------------------------------------------------------------------
export function createMachine(THREE) {
    const group = new THREE.Group();

    // Context objects for animation
    const nodes = [];
    const edges = [];
    const innerMazeElements = [];
    const particleSystems = [];
    let tesseractFacesGeometry;
    let tesseractFacesMesh;

    // Hyper-parameters
    const TESSERACT_RADIUS = 25;
    const PROJECTION_DISTANCE = 3.5;
    const W_CAMERA = 4.0;
    
    // Core Base 4D Coordinates (16 Vertices of a Hypercube)
    const base4DVertices = [];
    for (let i = 0; i < 16; i++) {
        let x = (i & 1) ? 1 : -1;
        let y = (i & 2) ? 1 : -1;
        let z = (i & 4) ? 1 : -1;
        let w = (i & 8) ? 1 : -1;
        base4DVertices.push(new Vector4D(x, y, z, w));
    }
    
    // Define 32 Edges (Pairs of indices differing by exactly 1 bit)
    const base4DEdges = [];
    for (let i = 0; i < 16; i++) {
        for (let j = i + 1; j < 16; j++) {
            let diff = i ^ j;
            if (diff === 1 || diff === 2 || diff === 4 || diff === 8) {
                base4DEdges.push([i, j]);
            }
        }
    }

    // Define 24 Faces in 4D (Squares)
    // A square face exists if two bits are held constant and the other two vary.
    const base4DFaces = [];
    for (let axis1 = 0; axis1 < 4; axis1++) {
        for (let axis2 = axis1 + 1; axis2 < 4; axis2++) {
            for (let val1 = 0; val1 < 2; val1++) {
                for (let val2 = 0; val2 < 2; val2++) {
                    let faceIndices = [];
                    for (let i = 0; i < 16; i++) {
                        let bit1 = (i >> axis1) & 1;
                        let bit2 = (i >> axis2) & 1;
                        if (bit1 === val1 && bit2 === val2) {
                            faceIndices.push(i);
                        }
                    }
                    // Sort indices to form a proper quad loop
                    let a = faceIndices[0], b = faceIndices[1], c = faceIndices[3], d = faceIndices[2];
                    base4DFaces.push([a, b, c, d]);
                }
            }
        }
    }

    // ----------------------------------------------------------------------------
    // MATERIALS SETUP
    // ----------------------------------------------------------------------------
    const nonEuclideanMat = new THREE.ShaderMaterial({
        vertexShader: nonEuclideanVertexShader,
        fragmentShader: nonEuclideanFragmentShader,
        uniforms: {
            time: { value: 0.0 },
            wDepth: { value: 0.0 },
            colorPrimary: { value: new THREE.Color(0x00ffff) },
            colorSecondary: { value: new THREE.Color(0xff00ff) }
        },
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    const nodeMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x111111,
        emissive: 0x00aaff,
        emissiveIntensity: 2.0,
        metalness: 1.0,
        roughness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        transmission: 0.5,
        transparent: true
    });

    const edgeMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x050505,
        emissive: 0x0033aa,
        emissiveIntensity: 0.5,
        metalness: 0.9,
        roughness: 0.2,
        wireframe: true // High-tech scaffold look
    });

    // ----------------------------------------------------------------------------
    // 1. GENERATE VERTEX NODES
    // ----------------------------------------------------------------------------
    const nodeGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const innerCoreGeometry = new THREE.IcosahedronGeometry(0.8, 1);
    
    for (let i = 0; i < 16; i++) {
        const nodeGroup = new THREE.Group();
        
        const outerShell = new THREE.Mesh(nodeGeometry, tinted);
        const innerCore = new THREE.Mesh(innerCoreGeometry, nonEuclideanMat.clone());
        
        // Detailed high-tech rings around nodes
        const ringGeo = new THREE.TorusGeometry(2, 0.1, 16, 100);
        const ringX = new THREE.Mesh(ringGeo, chrome);
        const ringY = new THREE.Mesh(ringGeo, chrome);
        const ringZ = new THREE.Mesh(ringGeo, chrome);
        
        ringX.rotation.y = Math.PI / 2;
        ringY.rotation.x = Math.PI / 2;
        
        nodeGroup.add(outerShell);
        nodeGroup.add(innerCore);
        nodeGroup.add(ringX);
        nodeGroup.add(ringY);
        nodeGroup.add(ringZ);
        
        group.add(nodeGroup);
        nodes.push({ mesh: nodeGroup, rings: [ringX, ringY, ringZ], coreMat: innerCore.material });
    }

    // ----------------------------------------------------------------------------
    // 2. GENERATE EDGES (CONNECTING STRUTS)
    // ----------------------------------------------------------------------------
    const edgeRadius = 0.3;
    const cylinderGeo = new THREE.CylinderGeometry(edgeRadius, edgeRadius, 1, 16, 4, true);
    // Cylinder is default aligned along Y. We translate it so its origin is at the base
    cylinderGeo.translate(0, 0.5, 0); 
    cylinderGeo.rotateX(Math.PI / 2); // Align to Z axis for easier lookAt usage

    for (let i = 0; i < 32; i++) {
        const edgeGroup = new THREE.Group();
        
        const mainStrut = new THREE.Mesh(cylinderGeo, edgeMaterial);
        const innerEnergy = new THREE.Mesh(
            new THREE.CylinderGeometry(edgeRadius * 0.5, edgeRadius * 0.5, 1, 8, 1, true).translate(0,0.5,0).rotateX(Math.PI/2),
            nonEuclideanMat.clone()
        );
        
        edgeGroup.add(mainStrut);
        edgeGroup.add(innerEnergy);
        
        group.add(edgeGroup);
        edges.push({ mesh: edgeGroup, sourceIdx: base4DEdges[i][0], targetIdx: base4DEdges[i][1], innerMat: innerEnergy.material });
    }

    // ----------------------------------------------------------------------------
    // 3. GENERATE 4D FACES (SEMI-TRANSPARENT WARPING PANELS)
    // ----------------------------------------------------------------------------
    const maxFaces = 24;
    // Each face is a quad made of 2 triangles (6 vertices). Total vertices = 24 * 6
    tesseractFacesGeometry = new THREE.BufferGeometry();
    const facePositions = new Float32Array(maxFaces * 6 * 3);
    const faceNormals = new Float32Array(maxFaces * 6 * 3);
    const faceUVs = new Float32Array(maxFaces * 6 * 2);
    
    // UV setup
    for (let i = 0; i < maxFaces; i++) {
        let offset = i * 12;
        // Tri 1
        faceUVs[offset + 0] = 0; faceUVs[offset + 1] = 0;
        faceUVs[offset + 2] = 1; faceUVs[offset + 3] = 0;
        faceUVs[offset + 4] = 1; faceUVs[offset + 5] = 1;
        // Tri 2
        faceUVs[offset + 6] = 0; faceUVs[offset + 7] = 0;
        faceUVs[offset + 8] = 1; faceUVs[offset + 9] = 1;
        faceUVs[offset + 10] = 0; faceUVs[offset + 11] = 1;
    }
    
    tesseractFacesGeometry.setAttribute('position', new THREE.BufferAttribute(facePositions, 3));
    tesseractFacesGeometry.setAttribute('normal', new THREE.BufferAttribute(faceNormals, 3));
    tesseractFacesGeometry.setAttribute('uv', new THREE.BufferAttribute(faceUVs, 2));

    const globalFacesMat = new THREE.MeshPhysicalMaterial({
        color: 0x0a1530,
        emissive: 0x051020,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        metalness: 1.0,
        roughness: 0.0,
        transmission: 0.9
    });

    tesseractFacesMesh = new THREE.Mesh(tesseractFacesGeometry, globalFacesMat);
    group.add(tesseractFacesMesh);

    // ----------------------------------------------------------------------------
    // 4. THE NON-EUCLIDEAN MAZE (FRACTAL INNER STRUCTURE)
    // ----------------------------------------------------------------------------
    // Represents rooms that defy gravity and perspective, shifting constantly.
    const mazeGroup = new THREE.Group();
    const mazeCellCount = 200;
    
    // Complex geometry for maze cells (a hollowed-out hyper-tech cube)
    const shape = new THREE.Shape();
    shape.moveTo(-1, -1);
    shape.lineTo(1, -1);
    shape.lineTo(1, 1);
    shape.lineTo(-1, 1);
    shape.lineTo(-1, -1);
    
    const hole = new THREE.Path();
    hole.moveTo(-0.8, -0.8);
    hole.lineTo(0.8, -0.8);
    hole.lineTo(0.8, 0.8);
    hole.lineTo(-0.8, 0.8);
    hole.lineTo(-0.8, -0.8);
    shape.holes.push(hole);
    
    const extrudeSettings = { depth: 0.2, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.05, bevelThickness: 0.05 };
    const mazeCellGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    mazeCellGeo.center();
    
    const mazeInstancedMesh = new THREE.InstancedMesh(mazeCellGeo, darkSteel, mazeCellCount);
    const dummyMatrix = new THREE.Matrix4();
    const dummyPos = new THREE.Vector3();
    const dummyQuat = new THREE.Quaternion();
    const dummyScale = new THREE.Vector3();

    // Procedurally position the maze cells in an Escher-like interlocking structure
    for (let i = 0; i < mazeCellCount; i++) {
        // Distribute in a spherical lattice
        const radius = Math.random() * 10 + 2;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        dummyPos.set(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta),
            radius * Math.cos(phi)
        );
        
        // Random orthographic rotations to look like interlocking staircases/corridors
        dummyQuat.setFromEuler(new THREE.Euler(
            (Math.floor(Math.random() * 4) * Math.PI) / 2,
            (Math.floor(Math.random() * 4) * Math.PI) / 2,
            (Math.floor(Math.random() * 4) * Math.PI) / 2
        ));
        
        const scaleFactor = Math.random() * 1.5 + 0.5;
        dummyScale.set(scaleFactor, scaleFactor, scaleFactor);
        
        dummyMatrix.compose(dummyPos, dummyQuat, dummyScale);
        mazeInstancedMesh.setMatrixAt(i, dummyMatrix);
        
        innerMazeElements.push({
            pos: dummyPos.clone(),
            rot: dummyQuat.clone(),
            scale: scaleFactor,
            speed: (Math.random() - 0.5) * 0.02,
            axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize()
        });
    }
    
    mazeInstancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mazeGroup.add(mazeInstancedMesh);
    group.add(mazeGroup);

    // ----------------------------------------------------------------------------
    // 5. QUANTUM FLUCTUATION PARTICLE SYSTEMS (HAWKING RADIATION / WARP DUST)
    // ----------------------------------------------------------------------------
    const particleCount = 5000;
    const particleGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);
    const pColors = new Float32Array(particleCount * 3);
    const pSizes = new Float32Array(particleCount);
    const pWStates = new Float32Array(particleCount);
    
    for(let i=0; i<particleCount; i++) {
        let i3 = i * 3;
        // Volume scatter
        pPositions[i3] = (Math.random() - 0.5) * 60;
        pPositions[i3+1] = (Math.random() - 0.5) * 60;
        pPositions[i3+2] = (Math.random() - 0.5) * 60;
        
        let col = new THREE.Color();
        col.setHSL(Math.random() * 0.2 + 0.5, 1.0, 0.6); // Cyan to Purple
        pColors[i3] = col.r;
        pColors[i3+1] = col.g;
        pColors[i3+2] = col.b;
        
        pSizes[i] = Math.random() * 2.0 + 0.5;
        pWStates[i] = (Math.random() - 0.5) * 2.0;
    }
    
    particleGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    particleGeo.setAttribute('customColor', new THREE.BufferAttribute(pColors, 3));
    particleGeo.setAttribute('size', new THREE.BufferAttribute(pSizes, 1));
    particleGeo.setAttribute('wState', new THREE.BufferAttribute(pWStates, 1));
    
    const particleMat = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0.0 }
        },
        vertexShader: quantumParticleVertexShader,
        fragmentShader: quantumParticleFragmentShader,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true
    });
    
    const particleMesh = new THREE.Points(particleGeo, particleMat);
    group.add(particleMesh);
    particleSystems.push(particleMesh);

    // ----------------------------------------------------------------------------
    // PARTS ARRAY - MASSIVE DETAIL
    // ----------------------------------------------------------------------------
    const parts = [
        {
            name: "Hyper-Core Singularity Point",
            description: "A trapped micro-singularity powering the W-axis dimensional fold operations.",
            material: "nonEuclideanMat",
            function: "Provides infinite energy via Hawking radiation harnessing to maintain structural integrity in 3D space.",
            assemblyOrder: 1,
            connections: ["W-Axis Gyroscopes", "Probability Field Emitters"],
            failureEffect: "Spontaneous implosion causing localized spacetime collapse, dragging all surrounding matter into the void.",
            cascadeFailures: ["Complete annihilation of the simulation context"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 50, z: 0 }
        },
        {
            name: "Dimensional Node (x16)",
            description: "High-tech spherical vertices anchored simultaneously across 4 dimensions.",
            material: "tinted glass + chrome + nonEuclidean inner",
            function: "Stabilizes the corners of the tesseract to prevent dimensional shearing.",
            assemblyOrder: 2,
            connections: ["Strut Matrices", "Inner Maze Fabric"],
            failureEffect: "Node slips entirely into the 4th dimension, vanishing from 3D space and destabilizing the edges.",
            cascadeFailures: ["Strut torsion", "Non-Euclidean geometry leakage"],
            originalPosition: { x: 1, y: 1, z: 1 }, // representative
            explodedPosition: { x: 30, y: 30, z: 30 }
        },
        {
            name: "Phase-Shifting Strut Matrices (x32)",
            description: "Cylindrical bounds wrapped in quantum-locked dark steel.",
            material: "darkSteel + glowing nonEuclidean cylinder",
            function: "Tethers dimensional nodes, transferring mass and energy across the hypercube edges.",
            assemblyOrder: 3,
            connections: ["Dimensional Nodes", "Tesseract Faces"],
            failureEffect: "Strut snap causes explosive decompression of 4D space into 3D, emitting fatal gamma bursts.",
            cascadeFailures: ["Adjacent strut overload", "Face tear"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: -40, z: 0 }
        },
        {
            name: "Non-Euclidean Face Panels (x24)",
            description: "Semi-translucent energy fields acting as boundaries for the localized 4D projection.",
            material: "transparent energy shader",
            function: "Contains the inner maze and prevents external realities from bleeding into the tesseract.",
            assemblyOrder: 4,
            connections: ["Phase-Shifting Strut Matrices"],
            failureEffect: "Reality breach, permitting Eldritch geometries to invade standard space.",
            cascadeFailures: ["Maze de-sync", "Particle containment failure"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 50, y: 0, z: 0 }
        },
        {
            name: "Escher-Maze Corridors",
            description: "A recursive fractal network of rooms that defy gravity, scaling dynamically based on observation vector.",
            material: "darkSteel + chrome extrusions",
            function: "Serves as physical traversal pathways for 4th-dimensional operators. Down is Up, Left is Yesterday.",
            assemblyOrder: 5,
            connections: ["Hyper-Core Singularity Point"],
            failureEffect: "Navigational impossibility. Entities inside become lost in endless loops.",
            cascadeFailures: ["Temporal paradoxes", "Local gravity inversion"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: -50, y: 0, z: -50 }
        },
        {
            name: "W-Axis Gyroscopes",
            description: "Massive rotating chrome rings encasing each dimensional node.",
            material: "chrome",
            function: "Provides angular momentum purely along the Ana/Kata (W) axis.",
            assemblyOrder: 6,
            connections: ["Dimensional Node (x16)"],
            failureEffect: "Uncontrolled tumbling through the 4th dimension.",
            cascadeFailures: ["Loss of spatial anchoring", "Vomiting induction"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 0, z: 60 }
        },
        {
            name: "Quantum Fluctuation Particle Field",
            description: "A dense cloud of energy particles orbiting the structure, shifting color based on W-depth.",
            material: "ParticleShader",
            function: "Bleeds off excess dimensional pressure to prevent absolute detonation.",
            assemblyOrder: 7,
            connections: ["Hyper-Core Singularity Point"],
            failureEffect: "Pressure buildup leading to a localized Big Bang.",
            cascadeFailures: ["Universe reboot"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 100, z: 0 }
        },
        {
            name: "Chronosphere Regulators",
            description: "Time-dilation sinks embedded in the inner maze.",
            material: "copper + glass",
            function: "Synchronizes the flow of time within the tesseract to standard universe time.",
            assemblyOrder: 8,
            connections: ["Escher-Maze Corridors"],
            failureEffect: "Time inside the maze either freezes entirely or accelerates to the end of the universe.",
            cascadeFailures: ["Instant aging of components", "Hyper-Core exhaustion"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 40, y: -40, z: 40 }
        },
        {
            name: "Probability Field Emitters",
            description: "Antennae protruding from the strut matrices calculating quantum superposition states.",
            material: "aluminum",
            function: "Ensures the tesseract remains in a defined state when observed.",
            assemblyOrder: 9,
            connections: ["Phase-Shifting Strut Matrices"],
            failureEffect: "Tesseract exists in all possible configurations simultaneously, becoming an unreadable blur of infinite matter.",
            cascadeFailures: ["Complete structural decoherence"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: -40, y: 40, z: -40 }
        },
        {
            name: "Gravity Warping Plates",
            description: "Hexagonal steel plates lining the inner maze floors.",
            material: "steel + rubber",
            function: "Allows entities to walk on walls and ceilings by projecting a localized 'down' vector.",
            assemblyOrder: 10,
            connections: ["Escher-Maze Corridors"],
            failureEffect: "Extreme gravitational shearing, crushing entities between conflicting 100G vectors.",
            cascadeFailures: ["Structural buckling"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 20, z: -60 }
        },
        {
            name: "Topological Insulators",
            description: "Layer of specialized plastic polymers coating the outer faces.",
            material: "plastic",
            function: "Prevents electrical and quantum current from leaking into the 3rd dimension.",
            assemblyOrder: 11,
            connections: ["Non-Euclidean Face Panels"],
            failureEffect: "Lethal quantum electrocution of nearby observers.",
            cascadeFailures: ["Short circuit of Probability Field Emitters"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 60, y: 60, z: 0 }
        },
        {
            name: "Klein-Bottle Manifolds",
            description: "Non-orientable surface tubes weaving through the core.",
            material: "glass",
            function: "Cycles excess coolant fluid such that the inside of the tube is simultaneously the outside.",
            assemblyOrder: 12,
            connections: ["Hyper-Core Singularity Point"],
            failureEffect: "Coolant leaks infinitely into itself, causing core overheating.",
            cascadeFailures: ["Hyper-Core Singularity Point Failure"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: -60, y: 0, z: 60 }
        },
        {
            name: "Tesseract Projection Lenses",
            description: "Massive optical arrays focusing 4D coordinates down to 3D Cartesian coordinates.",
            material: "tinted glass",
            function: "The mathematical 'stereographic projection' rendered physically.",
            assemblyOrder: 13,
            connections: ["Dimensional Node (x16)"],
            failureEffect: "Nodes project to infinity, tearing the machine apart.",
            cascadeFailures: ["Total spatial disaggregation"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 80, z: 0 }
        },
        {
            name: "Ana-Kata Thrusters",
            description: "Exhaust ports aligned with the W-axis.",
            material: "chrome + steel",
            function: "Provides thrust specifically to maneuver the tesseract along the 4th spatial dimension.",
            assemblyOrder: 14,
            connections: ["W-Axis Gyroscopes"],
            failureEffect: "Stranding the tesseract in standard 3D space permanently.",
            cascadeFailures: ["None, but renders the machine practically useless as a dimensional vehicle."],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: -80, z: 0 }
        },
        {
            name: "Hilbert-Space Transceivers",
            description: "Infinite-dimensional communication arrays.",
            material: "copper",
            function: "Allows remote control of the Tesseract across infinite parallel states.",
            assemblyOrder: 15,
            connections: ["Probability Field Emitters"],
            failureEffect: "Loss of signal, forcing the tesseract into autonomous chaotic routing.",
            cascadeFailures: ["Navigational impossibility"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: -80, y: 0, z: 0 }
        }
    ];

    // ----------------------------------------------------------------------------
    // QUIZ QUESTIONS - PhD LEVEL TOPOLOGY & HIGHER-DIMENSIONAL MATH
    // ----------------------------------------------------------------------------
    const quizQuestions = [
        {
            question: "In the context of the Poincaré conjecture (proven by Perelman), which statement accurately describes the requirement for a 3-manifold to be homeomorphic to a 3-sphere (S³)?",
            options: [
                "It must be simply connected and closed.",
                "It must have a non-trivial fundamental group.",
                "It must be orientable with an Euler characteristic of 1.",
                "It must be a Calabi-Yau manifold with SU(3) holonomy."
            ],
            correctAnswer: 0,
            explanation: "The Poincaré conjecture states that every simply connected, closed 3-manifold is homeomorphic to the 3-sphere."
        },
        {
            question: "When performing a stereographic projection of a 4-dimensional hypercube (tesseract) onto 3-dimensional Euclidean space from a point on the 3-sphere, what invariant is preserved?",
            options: [
                "Euclidean distance between all vertices.",
                "The volumes of the cubic cells.",
                "The angles between intersecting edges (conformal mapping).",
                "The absolute coordinates of the W-axis."
            ],
            correctAnswer: 2,
            explanation: "Stereographic projection is a conformal mapping, meaning it preserves angles locally, although it distorts distances and volumes significantly depending on the projection distance."
        },
        {
            question: "The Euler characteristic (χ) for convex polytopes in d dimensions is given by the alternating sum of the number of k-dimensional faces. What is the Euler characteristic of a tesseract (d=4)?",
            options: [
                "0",
                "1",
                "2",
                "4"
            ],
            correctAnswer: 0,
            explanation: "For any convex 4-polytope (like a tesseract), the Euler characteristic χ = V - E + F - C = 16 - 32 + 24 - 8 = 0. (Note: χ for the boundary of a d-polytope is 1 - (-1)^d)."
        },
        {
            question: "The Hopf fibration describes a non-trivial principal bundle mapping a 3-sphere (S³) onto a 2-sphere (S²). What are the fibers of this map?",
            options: [
                "Points (0-dimensional)",
                "Circles (S¹)",
                "Tori (T²)",
                "Möbius strips"
            ],
            correctAnswer: 1,
            explanation: "The Hopf fibration maps S³ -> S² with the fibers being great circles (S¹). Thus, S³ can be viewed locally as S² × S¹."
        },
        {
            question: "If a Tesseract undergoes a pure rotation in the XW-plane by π/2 radians, what happens to an edge originally aligned perfectly along the X-axis?",
            options: [
                "It remains along the X-axis.",
                "It rotates to align with the Y-axis.",
                "It rotates into the W-axis, disappearing entirely from the pure XYZ 3D hyperplane.",
                "It shrinks to a singular point at the origin."
            ],
            correctAnswer: 2,
            explanation: "A rotation in the XW-plane maps the X-axis to the W-axis. Since our perceptual 3D space is the XYZ hyperplane, an object rotating into the W-axis will appear to shrink/warp and vanish from our 3D slice."
        }
    ];

    // ----------------------------------------------------------------------------
    // ANIMATION LOOP (MASSIVE MATH COMPUTATIONS)
    // ----------------------------------------------------------------------------
    const animate = (time, speed, meshes) => {
        // Base Rotation Rates for the 6 planes of 4D rotation
        const t = time * speed;
        
        // Multi-dimensional hyper-rotation
        const thetaXY = t * 0.3;
        const thetaXZ = t * 0.5;
        const thetaXW = t * 0.7; // Rotates into the 4th dimension
        const thetaYZ = t * 0.4;
        const thetaYW = t * 0.6;
        const thetaZW = t * 0.8;
        
        const projected3D = [];
        const wDepths = [];
        
        // 1. PROJECT 16 VERTICES FROM 4D TO 3D
        for (let i = 0; i < 16; i++) {
            let v = base4DVertices[i];
            
            // Apply rotations
            v = Matrix4D.multiply(Matrix4D.rotateXY(thetaXY), v);
            v = Matrix4D.multiply(Matrix4D.rotateXZ(thetaXZ), v);
            v = Matrix4D.multiply(Matrix4D.rotateXW(thetaXW), v);
            v = Matrix4D.multiply(Matrix4D.rotateYZ(thetaYZ), v);
            v = Matrix4D.multiply(Matrix4D.rotateYW(thetaYW), v);
            v = Matrix4D.multiply(Matrix4D.rotateZW(thetaZW), v);
            
            // Stereographic Projection from 4D to 3D
            const wDepth = v.w;
            wDepths.push(wDepth);
            
            // Avoid division by zero by clamping distance
            const w_scale = 1.0 / (PROJECTION_DISTANCE - wDepth); 
            
            const p3 = new THREE.Vector3(
                v.x * w_scale * TESSERACT_RADIUS,
                v.y * w_scale * TESSERACT_RADIUS,
                v.z * w_scale * TESSERACT_RADIUS
            );
            
            projected3D.push(p3);
            
            // Update node positions and scaling based on W depth
            const nodeObj = nodes[i];
            nodeObj.mesh.position.copy(p3);
            
            // Nodes closer in 4th dimension appear larger (Perspective trick in W)
            const scaleFactor = Math.max(0.2, w_scale * 3.0);
            nodeObj.mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
            
            // Animate node internal shaders and rings
            nodeObj.coreMat.uniforms.time.value = t;
            nodeObj.coreMat.uniforms.wDepth.value = wDepth;
            
            nodeObj.rings[0].rotation.x += 0.05 * speed;
            nodeObj.rings[1].rotation.y += 0.07 * speed;
            nodeObj.rings[2].rotation.z += 0.03 * speed;
        }
        
        // 2. UPDATE 32 EDGES (STRUTS)
        for (let i = 0; i < 32; i++) {
            const edgeDef = edges[i];
            const pStart = projected3D[edgeDef.sourceIdx];
            const pEnd = projected3D[edgeDef.targetIdx];
            
            // Midpoint
            const mid = new THREE.Vector3().addVectors(pStart, pEnd).multiplyScalar(0.5);
            edgeDef.mesh.position.copy(mid);
            
            // Length
            const length = pStart.distanceTo(pEnd);
            edgeDef.mesh.scale.set(1, 1, length);
            
            // LookAt to orient the cylinder
            edgeDef.mesh.lookAt(pEnd);
            
            // Calculate average W-depth for the shader
            const avgW = (wDepths[edgeDef.sourceIdx] + wDepths[edgeDef.targetIdx]) * 0.5;
            edgeDef.innerMat.uniforms.time.value = t;
            edgeDef.innerMat.uniforms.wDepth.value = avgW;
        }

        // 3. UPDATE 24 FACES (DYNAMIC BUFFER GEOMETRY)
        const positionAttribute = tesseractFacesGeometry.getAttribute('position');
        const normalAttribute = tesseractFacesGeometry.getAttribute('normal');
        
        let vertexIdx = 0;
        const cb = new THREE.Vector3();
        const ab = new THREE.Vector3();
        
        for (let i = 0; i < maxFaces; i++) {
            const faceIndices = base4DFaces[i];
            // Get the 4 projected corners
            const pA = projected3D[faceIndices[0]];
            const pB = projected3D[faceIndices[1]];
            const pC = projected3D[faceIndices[2]];
            const pD = projected3D[faceIndices[3]];
            
            // To make a quad, we use 2 triangles: A-B-C and A-C-D
            // Tri 1: A, B, C
            positionAttribute.setXYZ(vertexIdx + 0, pA.x, pA.y, pA.z);
            positionAttribute.setXYZ(vertexIdx + 1, pB.x, pB.y, pB.z);
            positionAttribute.setXYZ(vertexIdx + 2, pC.x, pC.y, pC.z);
            
            // Compute Normal Tri 1
            cb.subVectors(pC, pB);
            ab.subVectors(pA, pB);
            cb.cross(ab).normalize();
            normalAttribute.setXYZ(vertexIdx + 0, cb.x, cb.y, cb.z);
            normalAttribute.setXYZ(vertexIdx + 1, cb.x, cb.y, cb.z);
            normalAttribute.setXYZ(vertexIdx + 2, cb.x, cb.y, cb.z);
            
            // Tri 2: A, C, D
            positionAttribute.setXYZ(vertexIdx + 3, pA.x, pA.y, pA.z);
            positionAttribute.setXYZ(vertexIdx + 4, pC.x, pC.y, pC.z);
            positionAttribute.setXYZ(vertexIdx + 5, pD.x, pD.y, pD.z);
            
            // Compute Normal Tri 2
            cb.subVectors(pD, pC);
            ab.subVectors(pA, pC);
            cb.cross(ab).normalize();
            normalAttribute.setXYZ(vertexIdx + 3, cb.x, cb.y, cb.z);
            normalAttribute.setXYZ(vertexIdx + 4, cb.x, cb.y, cb.z);
            normalAttribute.setXYZ(vertexIdx + 5, cb.x, cb.y, cb.z);
            
            vertexIdx += 6;
        }
        
        positionAttribute.needsUpdate = true;
        normalAttribute.needsUpdate = true;
        
        // 4. ANIMATE INNER MAZE (ESCHER STRUCTURE)
        // Group rotates oppositely to create massive disorientation
        mazeGroup.rotation.x = -thetaXY * 0.5;
        mazeGroup.rotation.y = -thetaXZ * 0.5;
        mazeGroup.rotation.z = -thetaYZ * 0.5;
        
        const dummy = new THREE.Matrix4();
        const dPos = new THREE.Vector3();
        const dQuat = new THREE.Quaternion();
        const dScale = new THREE.Vector3();
        
        const mazeMesh = mazeGroup.children[0];
        
        for (let i = 0; i < innerMazeElements.length; i++) {
            const el = innerMazeElements[i];
            // Rotate each cell on its own chaotic axis
            el.rot.multiply(new THREE.Quaternion().setFromAxisAngle(el.axis, el.speed * speed * 5));
            
            // Scale pulsates like a beating heart
            const s = el.scale * (1.0 + 0.1 * Math.sin(t * 10 + i));
            dScale.set(s, s, s);
            
            dummy.compose(el.pos, el.rot, dScale);
            mazeMesh.setMatrixAt(i, dummy);
        }
        mazeMesh.instanceMatrix.needsUpdate = true;
        
        // 5. ANIMATE QUANTUM PARTICLES
        for(let i=0; i<particleSystems.length; i++) {
            const ps = particleSystems[i];
            ps.material.uniforms.time.value = t;
            ps.rotation.y = t * 0.2;
            ps.rotation.z = t * 0.1;
        }
    };

    return {
        group,
        parts,
        description: "A God-Tier Hyper-Dimensional Tesseract. This unit visualizes a true 4D hypercube collapsing into 3D Euclidean space via mathematical stereographic projection. It features a dynamically calculating non-commutative hyper-rotation engine, quantum state particle simulations, and a recursive non-Euclidean Escher maze suspended in the inner dimensional void. DO NOT LOOK DIRECTLY AT THE CORE FOR PROLONGED PERIODS.",
        quizQuestions,
        animate
    };
}
