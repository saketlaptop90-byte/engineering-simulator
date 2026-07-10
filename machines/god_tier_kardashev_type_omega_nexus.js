import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

/**
 * ============================================================================
 * MACHINE: TYPE OMEGA NEXUS (GOD TIER)
 * KARDASHEV SCALE: TYPE OMEGA (Beyond Type VI)
 * DESCRIPTION: A localized intersection of bulk higher-dimensional reality 
 * projecting into a 3D manifold. Designed by entities that exist outside 
 * time and space to dictate the localized fundamental laws of physics, 
 * logic, and ontological permanence.
 * 
 * FEATURES:
 * - Recursive hyper-fractal cores.
 * - Procedurally generated Dyson-manifold armor.
 * - Non-Euclidean topological anomalies.
 * - Void and Galaxy custom ShaderMaterials.
 * - Source-code emission matrices.
 * - Deep hydraulic and tensor-field suspension logic.
 * ============================================================================
 */

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const updatables = [];
    
    // Shared clock for all internal shaders and animations
    const uniforms = {
        time: { value: 0.0 },
        resolution: { value: new THREE.Vector2(1024, 1024) }
    };

    // ============================================================================
    // SHADER DEFINITIONS
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
            vec3 pos = position;
            // Introduce spatial rippling to simulate gravitational sheer
            float distortion = sin(time * 0.5 + pos.y * 5.0) * 0.5 + cos(time * 0.3 + pos.z * 5.0) * 0.5;
            pos += normal * distortion * 0.2;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `;

    const voidFragmentShader = `
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        uniform float time;
        
        // Pseudo-random hashing for noise
        float hash(vec3 p) {
            p = fract(p * 0.3183099 + .1);
            p *= 17.0;
            return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
        }
        
        // 3D Value Noise
        float noise(in vec3 x) {
            vec3 i = floor(x);
            vec3 f = fract(x);
            f = f * f * (3.0 - 2.0 * f);
            return mix(mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
                           mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
                       mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                           mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
        }
        
        // Fractal Brownian Motion
        float fbm(vec3 p) {
            float f = 0.0;
            f += 0.5000 * noise(p); p = p * 2.02;
            f += 0.2500 * noise(p); p = p * 2.03;
            f += 0.1250 * noise(p); p = p * 2.01;
            f += 0.0625 * noise(p); p = p * 2.04;
            f += 0.03125 * noise(p);
            return f / 0.96875;
        }
        
        void main() {
            vec3 p = vPosition * 0.5 + vec3(time * 0.1, time * 0.15, time * -0.05);
            float n = fbm(p * 2.0);
            vec3 color = vec3(0.0);
            
            // Starfield simulation
            float s = pow(noise(p * 20.0), 30.0) * 5.0;
            color += vec3(s);
            
            // Nebula background
            vec3 nebula1 = vec3(0.05, 0.0, 0.1);
            vec3 nebula2 = vec3(0.0, 0.3, 0.4);
            vec3 nebulaColor = mix(nebula1, nebula2, n);
            color += nebulaColor * fbm(p * 4.0 - vec3(time * 0.2));
            
            // Dark matter occlusions
            float dm = fbm(p * 0.5 + vec3(time * 0.05));
            color -= vec3(dm * 0.6);
            
            // Edge Fresnel glow
            vec3 viewDir = normalize(-vPosition);
            float fresnel = pow(1.0 - max(dot(normalize(vNormal), viewDir), 0.0), 4.0);
            color += vec3(0.8, 0.2, 1.0) * fresnel * 2.0;
            
            gl_FragColor = vec4(max(color, vec3(0.0)), 1.0);
        }
    `;

    const galaxyVertexShader = `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform float time;
        void main() {
            vUv = uv;
            vPosition = position;
            // Rapid high-frequency vibration
            vec3 pos = position;
            pos.x += sin(pos.y * 50.0 + time * 10.0) * 0.02;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `;

    const galaxyFragmentShader = `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform float time;
        
        // Simplex noise equivalent
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
        
        void main() {
            vec3 p = vPosition * 3.0;
            float r = length(p.xy);
            float a = atan(p.y, p.x);
            
            // Spiral arms
            float spiral = sin(a * 4.0 - r * 3.0 - time * 2.0);
            
            // Noise for structure
            float noiseVal = snoise(vec3(p.x, p.y, time * 0.1));
            
            // Color mapping
            vec3 coreColor = vec3(1.0, 0.8, 0.5);
            vec3 armColor = vec3(0.2, 0.4, 1.0);
            vec3 edgeColor = vec3(0.1, 0.0, 0.2);
            
            vec3 color = mix(edgeColor, armColor, smoothstep(-1.0, 1.0, spiral + noiseVal * 0.5));
            color = mix(color, coreColor, smoothstep(2.0, 0.0, r));
            
            // Star flecks
            float stars = pow(snoise(p * 20.0), 20.0);
            color += vec3(stars) * 2.0;
            
            gl_FragColor = vec4(color, 1.0);
        }
    `;

    const sourceCodeVertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    const sourceCodeFragmentShader = `
        varying vec2 vUv;
        uniform float time;
        uniform sampler2D codeTexture;
        
        void main() {
            vec2 uv = vUv;
            // Matrix digital rain effect
            uv.y += time * 0.5;
            vec4 texColor = texture2D(codeTexture, fract(uv));
            
            // Glitch horizontal
            float glitch = step(0.98, fract(sin(time * 43.0 + uv.y * 100.0) * 43758.5453));
            uv.x += glitch * 0.05;
            
            vec4 finalColor = texture2D(codeTexture, fract(uv));
            finalColor.rgb *= vec3(0.1, 1.0, 0.4) * 1.5; // Neon green
            
            gl_FragColor = finalColor;
        }
    `;

    // ============================================================================
    // PROCEDURAL TEXTURE GENERATION
    // ============================================================================

    function createSourceCodeTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, 1024, 1024);
        
        ctx.font = 'bold 16px monospace';
        ctx.fillStyle = '#ffffff';
        
        // Glyphs and math symbols
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ∀∂∃∅∇∈∉∑∫∮∝∞∧∨∩∪≈≠≡≤≥⊂⊃⊆⊇⊕⊗⊥';
        
        for (let i = 0; i < 64; i++) {
            for (let j = 0; j < 64; j++) {
                if (Math.random() > 0.3) {
                    const char = chars.charAt(Math.floor(Math.random() * chars.length));
                    ctx.fillText(char, i * 16, j * 16);
                }
            }
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }

    // ============================================================================
    // MATERIALS CONFIGURATION
    // ============================================================================

    const voidMaterial = new THREE.ShaderMaterial({
        vertexShader: voidVertexShader,
        fragmentShader: voidFragmentShader,
        uniforms: uniforms,
        side: THREE.DoubleSide,
        transparent: true
    });

    const galaxyMaterial = new THREE.ShaderMaterial({
        vertexShader: galaxyVertexShader,
        fragmentShader: galaxyFragmentShader,
        uniforms: uniforms,
        side: THREE.DoubleSide
    });

    const sourceTexture = createSourceCodeTexture();
    const sourceCodeMaterial = new THREE.ShaderMaterial({
        vertexShader: sourceCodeVertexShader,
        fragmentShader: sourceCodeFragmentShader,
        uniforms: {
            time: uniforms.time,
            codeTexture: { value: sourceTexture }
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    });

    // Extremely complex PBR material for the hyper-structure chassis
    const chassisMaterial = darkSteel.clone();
    chassisMaterial.metalness = 1.0;
    chassisMaterial.roughness = 0.1;
    chassisMaterial.clearcoat = 1.0;
    chassisMaterial.clearcoatRoughness = 0.1;
    chassisMaterial.wireframe = false;

    const neonMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 5.0,
        metalness: 0.8,
        roughness: 0.2
    });

    const goldMaterial = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        metalness: 1.0,
        roughness: 0.3,
        emissive: 0x331100,
        emissiveIntensity: 0.5
    });

    // ============================================================================
    // GEOMETRY GENERATORS & COMPLEX STRUCTURES
    // ============================================================================

    /**
     * Builds a recursive tesseract-like structure using wireframes and inner hyper-spheres
     */
    function buildQuantumSingularity() {
        const singularityGroup = new THREE.Group();
        
        // Central void sphere
        const coreGeo = new THREE.IcosahedronGeometry(20, 12);
        const coreMesh = new THREE.Mesh(coreGeo, voidMaterial);
        singularityGroup.add(coreMesh);
        
        parts.push({
            name: 'Absolute_Singularity_Core',
            description: 'A gravitationally collapsed point containing infinite density. Bypasses the Pauli exclusion principle via higher-dimensional folding.',
            material: 'VoidShader',
            function: 'Provides infinite zero-point energy.',
            assemblyOrder: 0,
            connections: ['Chronos_Manifold', 'Fractal_Matrices'],
            failureEffect: 'Instantaneous local vacuum collapse (False Vacuum Decay).',
            cascadeFailures: ['Reality_Anchors'],
            originalPosition: {x: 0, y: 0, z: 0},
            explodedPosition: {x: 0, y: 100, z: 0}
        });

        updatables.push({
            mesh: coreMesh,
            update: (time) => {
                coreMesh.rotation.y = time * 0.2;
                coreMesh.rotation.x = Math.sin(time * 0.1) * 0.5;
                const scale = 1.0 + Math.sin(time * 5.0) * 0.05;
                coreMesh.scale.set(scale, scale, scale);
            }
        });

        // Tesseract wireframes (nested)
        const tesseractGeo = new THREE.BoxGeometry(40, 40, 40, 4, 4, 4);
        const wireMat = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 2, transparent: true, opacity: 0.8 });
        
        for (let i = 0; i < 4; i++) {
            const wireMesh = new THREE.LineSegments(new THREE.EdgesGeometry(tesseractGeo), wireMat);
            const scale = 1.0 + (i * 0.3);
            wireMesh.scale.set(scale, scale, scale);
            singularityGroup.add(wireMesh);
            
            updatables.push({
                mesh: wireMesh,
                index: i,
                update: (time, obj) => {
                    obj.mesh.rotation.x = time * 0.1 * (obj.index + 1) * (obj.index % 2 === 0 ? 1 : -1);
                    obj.mesh.rotation.y = time * 0.15 * (obj.index + 1);
                    obj.mesh.rotation.z = time * 0.05 * (obj.index + 1);
                }
            });

            parts.push({
                name: `Tesseract_Constraint_Shell_${i}`,
                description: `4D hypercube projection serving as a containment field for the singularity. Level ${i}.`,
                material: 'NeonCyan_LineBasic',
                function: 'Prevents spatial shearing of the 3D local volume.',
                assemblyOrder: i + 1,
                connections: ['Absolute_Singularity_Core'],
                failureEffect: 'Spacetime curvature diverges to infinity.',
                cascadeFailures: [],
                originalPosition: {x: 0, y: 0, z: 0},
                explodedPosition: {x: 0, y: 0, z: (i+1) * 60}
            });
        }
        
        return singularityGroup;
    }

    /**
     * Procedurally generates a hyper-complex Lissajous knot wrapped in hydraulic conduits
     */
    function buildChronosManifold() {
        const manifoldGroup = new THREE.Group();
        
        // Define a complex 3D Lissajous curve
        const curvePoints = [];
        const segments = 1000;
        for (let i = 0; i <= segments; i++) {
            const t = (i / segments) * Math.PI * 2;
            // Prime number frequencies for non-intersecting complex loops
            const x = 80 * Math.sin(3 * t + Math.PI/2);
            const y = 80 * Math.sin(5 * t);
            const z = 80 * Math.cos(7 * t);
            curvePoints.push(new THREE.Vector3(x, y, z));
        }
        
        const curve = new THREE.CatmullRomCurve3(curvePoints, true, 'catmullrom', 0.5);
        
        // Base tube
        const tubeGeo = new THREE.TubeGeometry(curve, 500, 4, 16, true);
        const tubeMesh = new THREE.Mesh(tubeGeo, galaxyMaterial);
        manifoldGroup.add(tubeMesh);
        
        parts.push({
            name: 'Chronos_Lissajous_Manifold',
            description: 'A closed timelike curve looped onto itself using exotic matter. Traverses multiple temporal dimensions.',
            material: 'GalaxyShader',
            function: 'Manipulates localized causality and prevents grandfather paradoxes.',
            assemblyOrder: 5,
            connections: ['Absolute_Singularity_Core'],
            failureEffect: 'Causality inversion; the machine ceases to have ever been built.',
            cascadeFailures: ['All'],
            originalPosition: {x: 0, y: 0, z: 0},
            explodedPosition: {x: 100, y: 100, z: -100}
        });

        // Hydraulic secondary constraints wrapping the manifold
        for(let j=0; j<4; j++) {
            const wrapCurvePoints = [];
            for (let i = 0; i <= segments; i++) {
                const t = (i / segments) * Math.PI * 2;
                const basePt = curve.getPoint(i / segments);
                const tangent = curve.getTangent(i / segments);
                const normal = new THREE.Vector3(0,1,0).cross(tangent).normalize();
                const binormal = new THREE.Vector3().crossVectors(tangent, normal).normalize();
                
                // Wrap around the base curve
                const angle = (i / segments) * Math.PI * 100 + (j * Math.PI/2);
                const radius = 6;
                const offset = normal.multiplyScalar(Math.cos(angle) * radius).add(binormal.multiplyScalar(Math.sin(angle) * radius));
                wrapCurvePoints.push(basePt.add(offset));
            }
            const wrapCurve = new THREE.CatmullRomCurve3(wrapCurvePoints, true);
            const wrapGeo = new THREE.TubeGeometry(wrapCurve, 500, 0.8, 8, true);
            const wrapMesh = new THREE.Mesh(wrapGeo, chrome);
            manifoldGroup.add(wrapMesh);

            parts.push({
                name: `Causality_Hydraulic_Tether_${j}`,
                description: 'Super-fluid hydraulic lines channeling liquid tachyons to cool the manifold.',
                material: 'Chrome',
                function: 'Thermal regulation of exotic matter.',
                assemblyOrder: 6 + j,
                connections: ['Chronos_Lissajous_Manifold'],
                failureEffect: 'Tachyon boiling leading to spontaneous localized timeline erasure.',
                cascadeFailures: [],
                originalPosition: {x: 0, y: 0, z: 0},
                explodedPosition: {x: -150 + (j*50), y: -100, z: 150}
            });
        }
        
        updatables.push({
            mesh: manifoldGroup,
            update: (time) => {
                manifoldGroup.rotation.x = time * -0.05;
                manifoldGroup.rotation.y = time * 0.08;
            }
        });

        return manifoldGroup;
    }

    /**
     * Builds floating monolithic structures covered in source code
     */
    function buildRealityAnchors() {
        const anchorsGroup = new THREE.Group();
        const numAnchors = 12;
        const radius = 150;
        
        for (let i = 0; i < numAnchors; i++) {
            const angle = (i / numAnchors) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            // Complex extruded monolith
            const shape = new THREE.Shape();
            shape.moveTo(0, 5);
            shape.lineTo(15, 0);
            shape.lineTo(10, -50);
            shape.lineTo(0, -60);
            shape.lineTo(-10, -50);
            shape.lineTo(-15, 0);
            shape.lineTo(0, 5);
            
            const extrudeSettings = {
                depth: 10,
                bevelEnabled: true,
                bevelSegments: 5,
                steps: 2,
                bevelSize: 2,
                bevelThickness: 2
            };
            
            const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            geo.center();
            
            const mesh = new THREE.Mesh(geo, chassisMaterial);
            mesh.position.set(x, 0, z);
            // Face outward
            mesh.rotation.y = -angle + Math.PI / 2;
            
            anchorsGroup.add(mesh);
            
            // Add Source Code Projection screen to the front of the monolith
            const screenGeo = new THREE.PlaneGeometry(18, 90);
            const screenMesh = new THREE.Mesh(screenGeo, sourceCodeMaterial);
            screenMesh.position.set(0, -2.5, 6.1);
            mesh.add(screenMesh);
            
            // Add hydraulic lifters to bottom
            const pistonGeo = new THREE.CylinderGeometry(2, 2, 40, 16);
            const pistonMesh = new THREE.Mesh(pistonGeo, steel);
            pistonMesh.position.set(0, -50, 0);
            mesh.add(pistonMesh);

            const rodGeo = new THREE.CylinderGeometry(1, 1, 60, 16);
            const rodMesh = new THREE.Mesh(rodGeo, chrome);
            rodMesh.position.set(0, -70, 0);
            mesh.add(rodMesh);
            
            parts.push({
                name: `Ontological_Anchor_Monolith_${i}`,
                description: `Extruded dark-steel monolith enforcing physical laws within the Nexus's domain. Sector ${i}.`,
                material: 'DarkSteel / SourceCode Screen',
                function: 'Projects standard model physics into the local vacuum.',
                assemblyOrder: 15 + i,
                connections: ['Subspace_Grid'],
                failureEffect: 'Physics degrades to non-Euclidean geometry locally.',
                cascadeFailures: [],
                originalPosition: {x, y: 0, z},
                explodedPosition: {x: x * 2.5, y: -200, z: z * 2.5}
            });

            // Complex independent animation for each anchor
            updatables.push({
                mesh: mesh,
                rod: rodMesh,
                baseY: mesh.position.y,
                offset: i,
                update: (time, obj) => {
                    // Floating effect
                    const floatY = Math.sin(time * 0.5 + obj.offset) * 15.0;
                    obj.mesh.position.y = obj.baseY + floatY;
                    
                    // Pitch and roll slightly
                    obj.mesh.rotation.x = Math.sin(time * 1.2 + obj.offset) * 0.1;
                    obj.mesh.rotation.z = Math.cos(time * 0.8 + obj.offset) * 0.05;

                    // Counter-animate rod to stay grounded
                    obj.rod.position.y = -70 - floatY;
                }
            });
        }
        
        return anchorsGroup;
    }

    /**
     * Procedurally generates massive dyson-sphere style interlocking panels
     */
    function buildDysonSwarm() {
        const swarmGroup = new THREE.Group();
        
        const panelCount = 200;
        const radius = 250;
        
        const panelGeo = new THREE.BoxGeometry(30, 30, 2);
        // Randomize panel geometry by modifying vertices
        const posAttribute = panelGeo.attributes.position;
        for (let i = 0; i < posAttribute.count; i++) {
            const z = posAttribute.getZ(i);
            if (z > 0) {
                // Extrude outer face randomly
                posAttribute.setZ(i, z + Math.random() * 5);
            }
        }
        panelGeo.computeVertexNormals();

        // Use instanced mesh for performance while generating massive detail
        const instancedMesh = new THREE.InstancedMesh(panelGeo, goldMaterial, panelCount);
        
        const dummy = new THREE.Object3D();
        const positions = [];
        const rotations = [];
        const speeds = [];

        for (let i = 0; i < panelCount; i++) {
            // Fibonacci sphere distribution
            const phi = Math.acos(1 - 2 * (i + 0.5) / panelCount);
            const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
            
            const x = radius * Math.cos(theta) * Math.sin(phi);
            const y = radius * Math.sin(theta) * Math.sin(phi);
            const z = radius * Math.cos(phi);
            
            dummy.position.set(x, y, z);
            dummy.lookAt(0, 0, 0); // Face the core
            
            // Add a mechanical offset
            dummy.translateZ(Math.random() * 20);
            
            dummy.updateMatrix();
            instancedMesh.setMatrixAt(i, dummy.matrix);
            
            positions.push(new THREE.Vector3(x, y, z));
            rotations.push({ phi, theta });
            speeds.push((Math.random() - 0.5) * 0.2);
            
            parts.push({
                name: `Dyson_Hyper_Panel_${i}`,
                description: 'Automated solar-mass scale energy collectors extracting hawking radiation from the micro-black holes.',
                material: 'Gold PBR',
                function: 'Power generation and spatial shielding.',
                assemblyOrder: 30 + i,
                connections: ['Swarm_Grid'],
                failureEffect: 'Micro-black hole evaporation destroys local star systems.',
                cascadeFailures: [],
                originalPosition: {x, y, z},
                explodedPosition: {x: x * 3.0, y: y * 3.0, z: z * 3.0}
            });
        }
        
        swarmGroup.add(instancedMesh);
        
        updatables.push({
            mesh: instancedMesh,
            count: panelCount,
            dummy: dummy,
            rotations: rotations,
            speeds: speeds,
            radius: radius,
            update: (time, obj) => {
                for (let i = 0; i < obj.count; i++) {
                    const rot = obj.rotations[i];
                    // Orbit mechanics
                    rot.theta += obj.speeds[i] * 0.05;
                    
                    const phi = rot.phi;
                    const theta = rot.theta;
                    
                    const x = obj.radius * Math.cos(theta) * Math.sin(phi);
                    const y = obj.radius * Math.sin(theta) * Math.sin(phi);
                    const z = obj.radius * Math.cos(phi);
                    
                    obj.dummy.position.set(x, y, z);
                    obj.dummy.lookAt(0, 0, 0);
                    // Pulsing translation
                    obj.dummy.translateZ(Math.sin(time * 2.0 + i) * 10);
                    
                    obj.dummy.updateMatrix();
                    obj.mesh.setMatrixAt(i, obj.dummy.matrix);
                }
                obj.mesh.instanceMatrix.needsUpdate = true;
            }
        });

        return swarmGroup;
    }

    /**
     * Massive procedural gears and off-road omni-treads (as requested for 'tires/gears' detail)
     * Even though it's a cosmic nexus, we incorporate absurdly massive mechanical drives
     * that shift entire tectonic plates of space.
     */
    function buildTectonicDrives() {
        const driveGroup = new THREE.Group();
        
        const numDrives = 4;
        const driveDistance = 200;
        
        for (let i = 0; i < numDrives; i++) {
            const angle = (i / numDrives) * Math.PI * 2 + Math.PI/4;
            const x = Math.cos(angle) * driveDistance;
            const z = Math.sin(angle) * driveDistance;
            
            const wheelGroup = new THREE.Group();
            
            // Massive Rim
            const rimGeo = new THREE.CylinderGeometry(40, 40, 30, 32);
            const rimMesh = new THREE.Mesh(rimGeo, darkSteel);
            rimMesh.rotation.x = Math.PI / 2;
            wheelGroup.add(rimMesh);
            
            // Intricate Spokes
            for (let s = 0; s < 12; s++) {
                const spokeAngle = (s / 12) * Math.PI * 2;
                const spokeGeo = new THREE.BoxGeometry(4, 38, 4);
                const spokeMesh = new THREE.Mesh(spokeGeo, chrome);
                spokeMesh.position.set(Math.cos(spokeAngle) * 20, Math.sin(spokeAngle) * 20, 0);
                spokeMesh.rotation.z = spokeAngle;
                wheelGroup.add(spokeMesh);
            }
            
            // Tread base (Torus)
            const treadBaseGeo = new THREE.TorusGeometry(45, 10, 16, 64);
            const treadBaseMesh = new THREE.Mesh(treadBaseGeo, rubber);
            wheelGroup.add(treadBaseMesh);
            
            // Hundreds of extruded off-road lugs
            const lugCount = 80;
            const lugGeo = new THREE.BoxGeometry(15, 6, 25); // very aggressive
            
            const lugInstanced = new THREE.InstancedMesh(lugGeo, rubber, lugCount);
            const dummy = new THREE.Object3D();
            
            for (let l = 0; l < lugCount; l++) {
                const lAngle = (l / lugCount) * Math.PI * 2;
                dummy.position.set(Math.cos(lAngle) * 55, Math.sin(lAngle) * 55, 0);
                dummy.rotation.z = lAngle + Math.PI/2;
                // Alternate chevron pattern
                dummy.rotation.x = (l % 2 === 0) ? 0.2 : -0.2;
                dummy.updateMatrix();
                lugInstanced.setMatrixAt(l, dummy.matrix);
            }
            wheelGroup.add(lugInstanced);
            
            wheelGroup.position.set(x, -150, z);
            wheelGroup.rotation.y = -angle;
            
            driveGroup.add(wheelGroup);
            
            parts.push({
                name: `Tectonic_Spacetime_Tread_${i}`,
                description: 'Hyper-massive omni-tread utilizing aggressive rubberized neutronium lugs to physically grip and shift the fabric of space-time.',
                material: 'Neutronium Rubber / Dark Steel',
                function: 'Locomotion across the 11th-dimensional bulk.',
                assemblyOrder: 250 + i,
                connections: ['Main_Chassis'],
                failureEffect: 'Loss of traction resulting in sliding down the local gravity well into a lower dimension.',
                cascadeFailures: [],
                originalPosition: {x, y: -150, z},
                explodedPosition: {x: x * 1.5, y: -300, z: z * 1.5}
            });
            
            updatables.push({
                mesh: wheelGroup,
                offset: i,
                update: (time, obj) => {
                    // Spin the wheels
                    obj.mesh.rotation.z = time * 2.0;
                    // Steer slightly based on sine wave
                    obj.mesh.rotation.y = -angle + Math.sin(time * 0.5 + obj.offset) * 0.2;
                }
            });
        }
        
        return driveGroup;
    }

    /**
     * Central glowing core nexus and neon particle emitters
     */
    function buildEnergyNexus() {
        const nexusGroup = new THREE.Group();
        
        // Complex lathed central pillar
        const points = [];
        for ( let i = 0; i < 50; i ++ ) {
            const t = i / 50;
            // Intricate profile
            const r = 10 + Math.sin(t * Math.PI * 10) * 5 + Math.cos(t * Math.PI * 20) * 2;
            points.push( new THREE.Vector2( r, (t - 0.5) * 300 ) );
        }
        const latheGeo = new THREE.LatheGeometry(points, 64);
        const latheMesh = new THREE.Mesh(latheGeo, glass);
        
        // Inner glowing core
        const innerGeo = new THREE.CylinderGeometry(5, 5, 290, 32);
        const innerMesh = new THREE.Mesh(innerGeo, neonMaterial);
        
        nexusGroup.add(latheMesh);
        nexusGroup.add(innerMesh);
        
        // Light sources
        const light1 = new THREE.PointLight(0x00ffff, 10, 500);
        light1.position.set(0, 150, 0);
        nexusGroup.add(light1);
        
        const light2 = new THREE.PointLight(0x00ffff, 10, 500);
        light2.position.set(0, -150, 0);
        nexusGroup.add(light2);

        parts.push({
            name: `Central_Energy_Nexus_Pillar`,
            description: 'Lathed macro-glass containment vessel for the primary tachyon flow. Profile mathematically defined by the Riemann zeta function zeroes.',
            material: 'Macro-Glass / Neon Core',
            function: 'Routes zero-point energy to all subsystems.',
            assemblyOrder: 10,
            connections: ['Absolute_Singularity_Core', 'Tectonic_Spacetime_Tread_0'],
            failureEffect: 'Total energy blackout and rapid expansion of the singularity.',
            cascadeFailures: ['Chronos_Manifold', 'Dyson_Hyper_Panel_0'],
            originalPosition: {x: 0, y: 0, z: 0},
            explodedPosition: {x: 0, y: 0, z: 0}
        });

        updatables.push({
            mesh: nexusGroup,
            inner: innerMesh,
            light1: light1,
            light2: light2,
            update: (time, obj) => {
                obj.inner.scale.x = 1.0 + Math.sin(time * 20.0) * 0.1;
                obj.inner.scale.z = 1.0 + Math.sin(time * 20.0) * 0.1;
                obj.light1.intensity = 10 + Math.sin(time * 10.0) * 5;
                obj.light2.intensity = 10 + Math.cos(time * 12.0) * 5;
            }
        });
        
        return nexusGroup;
    }

    /**
     * Builds hyper-fractal floating geometric constructs around the periphery
     */
    function buildFractalMatrix() {
        const matrixGroup = new THREE.Group();
        
        function buildNode(depth, size, pos) {
            if (depth === 0) {
                const geo = new THREE.TetrahedronGeometry(size);
                const mesh = new THREE.Mesh(geo, chrome);
                mesh.position.copy(pos);
                matrixGroup.add(mesh);
                
                parts.push({
                    name: `Fractal_Compute_Node_${Math.random().toString(36).substring(7)}`,
                    description: 'Terminal node of the hyper-fractal AI matrix.',
                    material: 'Chrome',
                    function: 'Calculates the eigenvalues of the universe.',
                    assemblyOrder: 500,
                    connections: ['Fractal_Parent'],
                    failureEffect: 'Minor calculation errors leading to slight variations in the fine-structure constant.',
                    cascadeFailures: [],
                    originalPosition: {x: pos.x, y: pos.y, z: pos.z},
                    explodedPosition: {x: pos.x * 2.0, y: pos.y * 2.0, z: pos.z * 2.0}
                });

                updatables.push({
                    mesh: mesh,
                    basePos: pos.clone(),
                    offset: Math.random() * 10,
                    update: (time, obj) => {
                        obj.mesh.rotation.x += 0.05;
                        obj.mesh.rotation.y += 0.05;
                        const pulsate = 1.0 + Math.sin(time * 2.0 + obj.offset) * 0.5;
                        obj.mesh.position.copy(obj.basePos).multiplyScalar(pulsate);
                    }
                });
                return;
            }
            
            const geo = new THREE.OctahedronGeometry(size);
            const mesh = new THREE.Mesh(geo, tinted);
            mesh.position.copy(pos);
            matrixGroup.add(mesh);
            
            const offset = size * 2.5;
            const dirs = [
                new THREE.Vector3(1, 1, 1).normalize(),
                new THREE.Vector3(-1, 1, -1).normalize(),
                new THREE.Vector3(1, -1, -1).normalize(),
                new THREE.Vector3(-1, -1, 1).normalize()
            ];
            
            dirs.forEach(d => {
                buildNode(depth - 1, size * 0.4, pos.clone().add(d.multiplyScalar(offset)));
            });
        }
        
        // Build 4 fractal trees
        buildNode(3, 30, new THREE.Vector3(200, 200, 200));
        buildNode(3, 30, new THREE.Vector3(-200, 200, -200));
        buildNode(3, 30, new THREE.Vector3(200, -200, -200));
        buildNode(3, 30, new THREE.Vector3(-200, -200, 200));
        
        return matrixGroup;
    }

    // ============================================================================
    // ASSEMBLY
    // ============================================================================
    
    group.add(buildQuantumSingularity());
    group.add(buildChronosManifold());
    group.add(buildRealityAnchors());
    group.add(buildDysonSwarm());
    group.add(buildTectonicDrives());
    group.add(buildEnergyNexus());
    group.add(buildFractalMatrix());

    // Master rotation for the entire construct
    updatables.push({
        mesh: group,
        update: (time, obj) => {
            // Very slow, majestic rotation of the entire Omega Nexus
            obj.mesh.rotation.y = Math.sin(time * 0.05) * 0.2;
            obj.mesh.position.y = Math.sin(time * 0.1) * 20.0;
        }
    });

    // ============================================================================
    // QUIZ QUESTIONS (PhD LEVEL THEORETICAL PHYSICS & ONTOLOGY)
    // ============================================================================

    const quizQuestions = [
        {
            question: "In the context of the AdS/CFT correspondence, how does the Type Omega Nexus resolve the firewall paradox at the event horizon of its localized extremal black holes?",
            options: [
                "By entangling the interior modes with the early Hawking radiation via ER=EPR bridges, ensuring unitary evolution without a singularity.",
                "By violating the monogamy of quantum entanglement through non-unitary state reduction.",
                "By mapping the bulk spacetime to a lower-dimensional boundary theory where gravity and firewalls are non-existent.",
                "By utilizing tachyon condensation to smoothly dissolve the singularity into a fuzzball state prior to horizon formation."
            ],
            correctAnswer: 0,
            explanation: "The ER=EPR hypothesis suggests that entangled particles are connected by Einstein-Rosen bridges (wormholes), which preserves unitarity and avoids the necessity of a firewall breaking entanglement at the horizon."
        },
        {
            question: "When the Nexus shifts its ontological substrate into a false vacuum state, which specific mechanism prevents catastrophic vacuum decay across the local multiverse?",
            options: [
                "The emission of localized Coleman-De Luccia instantons that mathematically stabilize the bubble wall's expansion rate.",
                "Infinite potential barriers created by topological defects in the compactified Calabi-Yau manifold.",
                "A temporal stasis field that freezes the decay rate strictly to the reciprocal of the Planck time.",
                "The spontaneous symmetry breaking of the Higgs field localized exclusively within the Nexus core, raising the vacuum expectation value."
            ],
            correctAnswer: 0,
            explanation: "Coleman-De Luccia instantons govern the nucleation rate of true vacuum bubbles. By controlling these, the Nexus can stabilize the false vacuum and prevent the bubble walls from expanding at the speed of light."
        },
        {
            question: "According to the Wheeler-DeWitt equation modeling the Nexus's internal Chronos Manifold, what is the profound implication of the wave function of the universe lacking a time derivative (HΨ = 0)?",
            options: [
                "It implies that time is an emergent, illusionary property only valid in the semiclassical limit of the Nexus's macro-states (the Problem of Time).",
                "It indicates that the Nexus operates strictly faster than light, permanently reversing macroscopic causality.",
                "It demonstrates that the internal singularity is infinitely hot, effectively decoupling time from spatial dimensions.",
                "It proves that the Nexus has reached perfect thermal equilibrium with the cosmic microwave background, halting all entropy."
            ],
            correctAnswer: 0,
            explanation: "The Wheeler-DeWitt equation has no time parameter, leading to the 'Problem of Time' in quantum gravity, suggesting time does not exist fundamentally but emerges macroscopically."
        },
        {
            question: "The Reality Anchors utilize Casimir-driven zero-point energy extraction. Under the Scharnhorst effect, what happens to photons traversing the micro-gaps between the Anchor plates?",
            options: [
                "They exceed the speed of light in vacuum (c) due to the lowered refractive index of the Casimir vacuum.",
                "They undergo spontaneous parametric down-conversion into massive axions.",
                "They gain infinite relativistic mass and collapse into primordial micro black holes.",
                "They are perfectly reflected backwards in time, creating a localized Bose-Einstein condensate of tachyons."
            ],
            correctAnswer: 0,
            explanation: "The Scharnhorst effect predicts that light signals traveling between two closely spaced conducting plates (Casimir vacuum) will travel slightly faster than c due to the absence of virtual particle interactions."
        },
        {
            question: "If the Nexus's Tachyon accelerators cross the Cauchy horizon of its engineered Kerr-Newman geometry, what happens to the predictability of the resulting spacetime?",
            options: [
                "Predictability breaks down completely as the strong cosmic censorship conjecture is violated, allowing closed timelike curves and infinite blue-shifts.",
                "The spacetime immediately regularizes into a completely stable, flat Minkowski space.",
                "The curvature scalar rapidly diverges to absolute infinity, resulting in a naked singularity visible to external observers.",
                "The acceleration of tachyons abruptly halts, as they cannot mathematically possess real momentum past an event horizon."
            ],
            correctAnswer: 0,
            explanation: "The Cauchy horizon is the boundary of the domain of dependence. Crossing it means past events no longer uniquely determine the future, severely violating predictability and potentially allowing time travel."
        }
    ];

    // ============================================================================
    // ANIMATION LOOP
    // ============================================================================

    const animate = (time, speed, meshes) => {
        // Update shared uniforms for custom shaders
        uniforms.time.value = time * speed;

        // Iterate over all updatable components
        for (let i = 0; i < updatables.length; i++) {
            const obj = updatables[i];
            if (obj && typeof obj.update === 'function') {
                obj.update(time * speed, obj);
            }
        }
    };

    const description = "The Kardashev Type Omega Nexus is a theoretical engineering construct built by intelligences existing outside of the standard multidimensional bulk. It features recursive fractal mathematics made physical, containing captive localized singularities, chronos manifolds that wrap causality into closed loops, and reality anchors that write fundamental physics directly into the local vacuum via emitted 'source code'. It utilizes extreme non-Euclidean geometry and massive mechanical tectonic drives to traverse 11-dimensional space.";

    return { group, parts, description, quizQuestions, animate };
}
