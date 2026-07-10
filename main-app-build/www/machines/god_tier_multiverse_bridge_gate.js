import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // ----------------------------------------------------------------------------------
    // CUSTOM ADVANCED MATERIALS
    // ----------------------------------------------------------------------------------
    const emissiveBlue = new THREE.MeshStandardMaterial({ color: 0x001133, emissive: 0x0088ff, emissiveIntensity: 2.5, metalness: 0.8, roughness: 0.2 });
    const emissiveRed = new THREE.MeshStandardMaterial({ color: 0x330000, emissive: 0xff0033, emissiveIntensity: 3.0, metalness: 0.7, roughness: 0.3 });
    const emissiveGreen = new THREE.MeshStandardMaterial({ color: 0x002200, emissive: 0x00ff55, emissiveIntensity: 2.5, metalness: 0.5, roughness: 0.4 });
    const emissiveWhite = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, emissive: 0xffffff, emissiveIntensity: 2.0, metalness: 0.9, roughness: 0.1 });
    const gold = new THREE.MeshStandardMaterial({ color: 0xffaa00, metalness: 1.0, roughness: 0.3 });
    const glowingPlasma = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 4.0, transparent: true, opacity: 0.8 });
    const darkAlloy = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.9, roughness: 0.5, flatShading: true });
    
    // Shader Material for the Event Horizon (Multiverse Portal)
    const portalVertexShader = `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform float time;
        uniform float activeState; // 0 to 1

        // Classic noise for vertex displacement
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        
        float snoise(vec3 v) {
            const vec2 C = vec2(1.0/6.0, 1.0/3.0) ;
            const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
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
            return 105.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                          dot(p2,x2), dot(p3,x3) ) );
        }

        void main() {
            vUv = uv;
            vPosition = position;
            
            // Calculate distance from center for the splash/kawoosh effect
            float dist = length(position.xy);
            
            // The rippling wave moving outwards
            float wave = sin(dist * 0.5 - time * 10.0) * exp(-dist * 0.1);
            
            // Noise based displacement
            float noiseVal = snoise(vec3(position.xy * 0.2, time * 0.5));
            
            // Combine displacements, scaled by activeState
            float zDisp = (wave * 5.0 + noiseVal * 2.0) * activeState;
            
            vec3 newPos = position + vec3(0.0, 0.0, zDisp);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
        }
    `;

    const portalFragmentShader = `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform float time;
        uniform float activeState;

        // FBM and complex noise for the portal visual
        float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }
        float noise(vec2 st) {
            vec2 i = floor(st);
            vec2 f = fract(st);
            vec2 u = f*f*(3.0-2.0*f);
            return mix( mix( random( i + vec2(0.0,0.0) ), 
                             random( i + vec2(1.0,0.0) ), u.x),
                        mix( random( i + vec2(0.0,1.0) ), 
                             random( i + vec2(1.0,1.0) ), u.x), u.y);
        }
        float fbm(vec2 st) {
            float value = 0.0;
            float amplitude = .5;
            float frequency = 0.;
            for (int i = 0; i < 5; i++) {
                value += amplitude * noise(st);
                st *= 2.;
                amplitude *= .5;
            }
            return value;
        }

        void main() {
            vec2 st = vUv * 10.0;
            float dist = length(vUv - 0.5);
            
            // Create a swirling domain warp
            vec2 q = vec2(0.);
            q.x = fbm( st + 0.00*time);
            q.y = fbm( st + vec2(1.0));
            vec2 r = vec2(0.);
            r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ 0.15*time );
            r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ 0.126*time);
            float f = fbm(st+r);
            
            // Color palette representing alternate universes
            vec3 color1 = vec3(0.1, 0.5, 0.9); // Blue
            vec3 color2 = vec3(0.9, 0.2, 0.8); // Purple/Pink
            vec3 color3 = vec3(0.0, 0.9, 0.5); // Green/Cyan
            vec3 color4 = vec3(0.0, 0.0, 0.1); // Deep void
            
            // Mix based on noise and radius
            vec3 finalColor = mix(color4, color1, clamp((f*f)*4.0,0.0,1.0));
            finalColor = mix(finalColor, color2, clamp(length(q),0.0,1.0));
            finalColor = mix(finalColor, color3, clamp(length(r.x),0.0,1.0));
            
            // Add a glowing core and edge ring
            float edgeGlow = smoothstep(0.4, 0.5, dist);
            finalColor += vec3(0.5, 0.8, 1.0) * (1.0 - smoothstep(0.0, 0.1, dist)) * 2.0;
            finalColor += vec3(0.2, 0.5, 1.0) * edgeGlow * 2.0;
            
            // Discard pixels outside the radius to keep it perfectly circular
            if (dist > 0.5) discard;
            
            // Apply activation state alpha scaling and brightness
            float alpha = smoothstep(0.0, 0.2, activeState);
            finalColor *= (activeState * 2.0); // Brighten as it opens
            
            gl_FragColor = vec4(finalColor, alpha);
        }
    `;

    const portalMaterial = new THREE.ShaderMaterial({
        vertexShader: portalVertexShader,
        fragmentShader: portalFragmentShader,
        uniforms: {
            time: { value: 0.0 },
            activeState: { value: 0.0 }
        },
        transparent: true,
        side: THREE.DoubleSide
    });
    meshes.portalMaterial = portalMaterial;

    // ----------------------------------------------------------------------------------
    // UTILITY: ADD PART FUNCTION
    // ----------------------------------------------------------------------------------
    function addPart(name, description, material, func, groupObj, failureEffect, cascade, orig, expl, addToArray = true) {
        if(addToArray) {
            parts.push({
                name, description, material, function: func, assemblyOrder: parts.length + 1,
                connections: [], failureEffect, cascadeFailures: cascade,
                originalPosition: orig, explodedPosition: expl
            });
        }
        group.add(groupObj);
    }

    // ----------------------------------------------------------------------------------
    // GEOMETRY GENERATORS
    // ----------------------------------------------------------------------------------

    // 1. Base Pedestal Foundation
    const buildBasePedestal = () => {
        const pedGroup = new THREE.Group();
        
        // Main base body
        const shape = new THREE.Shape();
        shape.moveTo(-45, -30);
        shape.lineTo(45, -30);
        shape.lineTo(35, 15);
        shape.lineTo(20, 20);
        shape.lineTo(-20, 20);
        shape.lineTo(-35, 15);
        shape.lineTo(-45, -30);

        const extrudeSettings = { depth: 50, bevelEnabled: true, bevelSegments: 6, steps: 2, bevelSize: 2, bevelThickness: 2 };
        const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const mesh = new THREE.Mesh(geo, darkAlloy);
        mesh.position.set(0, -20, -25);
        pedGroup.add(mesh);

        // Stairs at the front
        const stairGroup = new THREE.Group();
        for(let i=0; i<15; i++) {
            const w = 30 + (15 - i);
            const stairGeo = new THREE.BoxGeometry(w, 2, 4);
            const stairMesh = new THREE.Mesh(stairGeo, steel);
            stairMesh.position.set(0, -19 + i*2, 25 + i*4);
            stairGroup.add(stairMesh);
            
            // Add neon strips under stairs
            const stripGeo = new THREE.BoxGeometry(w-2, 0.5, 0.5);
            const stripMesh = new THREE.Mesh(stripGeo, emissiveBlue);
            stripMesh.position.set(0, -19 + i*2 + 0.5, 25 + i*4 + 2);
            stairGroup.add(stripMesh);
        }
        pedGroup.add(stairGroup);

        // Side support struts
        for(let side of [-1, 1]) {
            const strutGeo = new THREE.BoxGeometry(10, 30, 40);
            const strutMesh = new THREE.Mesh(strutGeo, darkSteel);
            strutMesh.position.set(side * 40, -5, 0);
            strutMesh.rotation.z = side * 0.1;
            pedGroup.add(strutMesh);

            // Hydraulic pistons on the struts
            const cylGeo = new THREE.CylinderGeometry(2, 2, 30, 16);
            const cylMesh = new THREE.Mesh(cylGeo, chrome);
            cylMesh.position.set(side * 42, 5, 0);
            cylMesh.rotation.z = side * 0.2;
            pedGroup.add(cylMesh);
        }

        return pedGroup;
    };

    // 2. Primary Outer Chassis
    const buildOuterRing = () => {
        const ringGroup = new THREE.Group();
        const R = 40; // Ring radius
        
        // Torus 1: Main bulk
        const torusGeo1 = new THREE.TorusGeometry(R, 5, 64, 128);
        const torusMesh1 = new THREE.Mesh(torusGeo1, darkAlloy);
        ringGroup.add(torusMesh1);

        // Torus 2: Outer rail
        const torusGeo2 = new THREE.TorusGeometry(R + 5.5, 1, 32, 128);
        const torusMesh2 = new THREE.Mesh(torusGeo2, steel);
        ringGroup.add(torusMesh2);

        // Inner glowing tracks
        const trackGeo = new THREE.TorusGeometry(R - 4, 0.5, 16, 128);
        const trackMesh = new THREE.Mesh(trackGeo, emissiveBlue);
        ringGroup.add(trackMesh);

        // Massive structural ribs around the ring
        for(let i=0; i<36; i++) {
            const angle = (i / 36) * Math.PI * 2;
            const ribGeo = new THREE.BoxGeometry(8, 12, 14);
            const ribMesh = new THREE.Mesh(ribGeo, darkSteel);
            const x = Math.cos(angle) * R;
            const y = Math.sin(angle) * R;
            ribMesh.position.set(x, y, 0);
            ribMesh.lookAt(0, 0, 0);
            
            // Add glowing nodes on the ribs
            if (i % 2 === 0) {
                const nodeGeo = new THREE.SphereGeometry(1.5, 16, 16);
                const nodeMesh = new THREE.Mesh(nodeGeo, emissiveGreen);
                nodeMesh.position.set(0, 6, 0);
                ribMesh.add(nodeMesh);
            }
            ringGroup.add(ribMesh);
        }
        
        // Raise it up so it stands on the pedestal
        ringGroup.position.set(0, R + 10, 0);
        meshes.outerRingPos = new THREE.Vector3(0, R + 10, 0);
        return ringGroup;
    };

    // 3. Superconducting Inner Dialing Ring
    const buildInnerRing = () => {
        const innerGroup = new THREE.Group();
        const R = 34.5;
        
        const innerTorus = new THREE.TorusGeometry(R, 2, 64, 256);
        const innerMesh = new THREE.Mesh(innerTorus, copper);
        innerGroup.add(innerMesh);

        // Glyph Plates
        const glyphGroup = new THREE.Group();
        for(let i=0; i<39; i++) {
            const angle = (i / 39) * Math.PI * 2;
            const plateGroup = new THREE.Group();
            
            // Plate base
            const plateGeo = new THREE.BoxGeometry(3, 4, 1.5);
            const plateMesh = new THREE.Mesh(plateGeo, chrome);
            
            // Intricate glyph (simplified as a cluster of small glowing boxes for geometry)
            const glyphGeos = new THREE.Group();
            for(let g=0; g<5; g++) {
                const gB = new THREE.BoxGeometry(0.5, 0.5, 0.5);
                const gM = new THREE.Mesh(gB, emissiveWhite);
                gM.position.set((Math.random()-0.5)*2, (Math.random()-0.5)*2, 0.8);
                glyphGeos.add(gM);
            }
            
            plateGroup.add(plateMesh);
            plateGroup.add(glyphGeos);

            const x = Math.cos(angle) * R;
            const y = Math.sin(angle) * R;
            plateGroup.position.set(x, y, 2.5); // slightly in front
            
            // Look away from center
            plateGroup.rotation.z = angle + Math.PI/2;
            
            glyphGroup.add(plateGroup);
        }
        innerGroup.add(glyphGroup);
        
        innerGroup.position.copy(meshes.outerRingPos);
        meshes.innerRingGroup = innerGroup; // For animation
        return innerGroup;
    };

    // 4. Chevron Lock Mechanisms
    const buildChevrons = () => {
        const chevsGroup = new THREE.Group();
        const R = 41; // Outside the outer ring
        meshes.chevronLocks = [];
        
        for(let i=0; i<9; i++) {
            // Distribute chevrons evenly, but leave a gap at the very bottom
            // Angles: from -210 deg to 30 deg maybe? Let's do symmetrical.
            // Top is at PI/2 (90 deg). 
            const angle = Math.PI/2 + (i - 4) * (Math.PI / 5.5);
            
            const chevContainer = new THREE.Group();
            
            // Chevron Housing
            const housingShape = new THREE.Shape();
            housingShape.moveTo(-4, -6);
            housingShape.lineTo(4, -6);
            housingShape.lineTo(6, 2);
            housingShape.lineTo(2, 6);
            housingShape.lineTo(-2, 6);
            housingShape.lineTo(-6, 2);
            housingShape.lineTo(-4, -6);
            
            const hGeo = new THREE.ExtrudeGeometry(housingShape, { depth: 12, bevelEnabled: true, bevelSize: 0.5, bevelThickness: 0.5 });
            const hMesh = new THREE.Mesh(hGeo, steel);
            hMesh.position.set(0, 0, -6);
            chevContainer.add(hMesh);
            
            // Sliding lock mechanism (the part that moves inward)
            const lockSlider = new THREE.Group();
            
            // Slider geometry
            const sliderGeo = new THREE.BoxGeometry(6, 8, 8);
            const sliderMesh = new THREE.Mesh(sliderGeo, darkAlloy);
            lockSlider.add(sliderMesh);
            
            // Glowing Crystal inside the slider
            const crystalGeo = new THREE.OctahedronGeometry(2.5, 0);
            const crystalMesh = new THREE.Mesh(crystalGeo, emissiveRed);
            crystalMesh.position.set(0, -3, 5); // Pointing inwards
            crystalMesh.scale.set(1, 1.5, 1);
            lockSlider.add(crystalMesh);
            
            chevContainer.add(lockSlider);

            // Position container on ring
            const x = Math.cos(angle) * R;
            const y = Math.sin(angle) * R;
            chevContainer.position.set(x, y, 0);
            chevContainer.rotation.z = angle - Math.PI/2;
            
            chevsGroup.add(chevContainer);
            
            meshes.chevronLocks.push({
                container: chevContainer,
                slider: lockSlider,
                crystal: crystalMesh,
                angle: angle,
                locked: false
            });
        }
        
        chevsGroup.position.copy(meshes.outerRingPos);
        return chevsGroup;
    };

    // 5 & 6. Zero Point Module Array (Generators)
    const buildGenerator = (side) => {
        const genGroup = new THREE.Group();
        const sign = side === 'left' ? -1 : 1;
        
        // Base of generator
        const baseGeo = new THREE.CylinderGeometry(12, 14, 20, 32);
        const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
        baseMesh.position.set(0, 10, 0);
        genGroup.add(baseMesh);

        // Transparent Containment Chamber
        const glassGeo = new THREE.CylinderGeometry(10, 10, 30, 32);
        const glassMesh = new THREE.Mesh(glassGeo, glass);
        glassMesh.position.set(0, 35, 0);
        genGroup.add(glassMesh);
        
        // Inner Plasma Core
        const coreGeo = new THREE.CylinderGeometry(4, 4, 28, 16);
        const coreMesh = new THREE.Mesh(coreGeo, glowingPlasma);
        coreMesh.position.set(0, 35, 0);
        genGroup.add(coreMesh);
        
        if (!meshes.plasmaCores) meshes.plasmaCores = [];
        meshes.plasmaCores.push(coreMesh);

        // Spinning Magnetic Rings around the chamber
        const ringsGroup = new THREE.Group();
        for(let i=0; i<5; i++) {
            const ringGeo = new THREE.TorusGeometry(12, 1.5, 16, 64);
            const ringMesh = new THREE.Mesh(ringGeo, copper);
            ringMesh.position.set(0, 25 + i * 5, 0);
            ringMesh.rotation.x = Math.PI / 2;
            
            // Add nodes to ring
            for(let j=0; j<4; j++) {
                const nG = new THREE.BoxGeometry(4, 3, 4);
                const nM = new THREE.Mesh(nG, steel);
                nM.position.set(Math.cos(j*Math.PI/2)*12, 0, Math.sin(j*Math.PI/2)*12);
                ringMesh.add(nM);
            }
            ringsGroup.add(ringMesh);
        }
        genGroup.add(ringsGroup);
        if(!meshes.generatorRings) meshes.generatorRings = [];
        meshes.generatorRings.push({ group: ringsGroup, speed: sign * 0.02 });

        // Heat dissipating fins on top
        const finGroup = new THREE.Group();
        const capGeo = new THREE.CylinderGeometry(14, 12, 10, 32);
        const capMesh = new THREE.Mesh(capGeo, darkAlloy);
        capMesh.position.set(0, 55, 0);
        finGroup.add(capMesh);
        
        for(let i=0; i<36; i++) {
            const fG = new THREE.BoxGeometry(1, 15, 6);
            const fM = new THREE.Mesh(fG, aluminum);
            const a = (i/36)*Math.PI*2;
            fM.position.set(Math.cos(a)*12, 60, Math.sin(a)*12);
            fM.lookAt(0, 60, 0);
            finGroup.add(fM);
        }
        genGroup.add(finGroup);

        genGroup.position.set(sign * 70, -20, -30);
        return genGroup;
    };

    // 7. Coolant & Energy Conduits
    const buildConduits = () => {
        const conduitsGroup = new THREE.Group();
        
        // Function to create a tube between two points with some control points
        const createPipe = (start, end, midOffset, mat, rad) => {
            const mid1 = new THREE.Vector3().lerpVectors(start, end, 0.33).add(midOffset);
            const mid2 = new THREE.Vector3().lerpVectors(start, end, 0.66).add(midOffset);
            const curve = new THREE.CatmullRomCurve3([start, mid1, mid2, end]);
            const tubeGeo = new THREE.TubeGeometry(curve, 64, rad, 16, false);
            return new THREE.Mesh(tubeGeo, mat);
        };

        // Connect generators to pedestal and ring
        for(let side of [-1, 1]) {
            const genPos = new THREE.Vector3(side * 70, -10, -30);
            const pedPos = new THREE.Vector3(side * 30, -15, -20);
            const ringPos = new THREE.Vector3(side * 40, meshes.outerRingPos.y, -5);
            
            // Thick coolant pipes to pedestal
            conduitsGroup.add(createPipe(genPos, pedPos, new THREE.Vector3(0, -10, -20), rubber, 3));
            conduitsGroup.add(createPipe(new THREE.Vector3(genPos.x, genPos.y+5, genPos.z), new THREE.Vector3(pedPos.x, pedPos.y+5, pedPos.z), new THREE.Vector3(0, -5, -15), rubber, 3));
            
            // Glowing energy conduits to ring
            conduitsGroup.add(createPipe(new THREE.Vector3(genPos.x, genPos.y+40, genPos.z), ringPos, new THREE.Vector3(side * 20, 20, -40), emissiveBlue, 1.5));
            conduitsGroup.add(createPipe(new THREE.Vector3(genPos.x, genPos.y+45, genPos.z), new THREE.Vector3(ringPos.x, ringPos.y+10, ringPos.z), new THREE.Vector3(side * 25, 25, -45), emissiveBlue, 1.5));
        }

        return conduitsGroup;
    };

    // 8. Operator Control Console
    const buildConsole = () => {
        const consoleGroup = new THREE.Group();
        
        // Desk
        const deskGeo = new THREE.BoxGeometry(30, 2, 15);
        const deskMesh = new THREE.Mesh(deskGeo, darkAlloy);
        deskMesh.position.set(0, 15, 60);
        deskMesh.rotation.x = 0.1; // Tilted slightly towards operator
        consoleGroup.add(deskMesh);

        // Screens
        const screenGroup = new THREE.Group();
        for(let i=0; i<3; i++) {
            const scGeo = new THREE.BoxGeometry(12, 8, 0.5);
            const scMesh = new THREE.Mesh(scGeo, darkSteel);
            const displayGeo = new THREE.PlaneGeometry(11, 7);
            const displayMesh = new THREE.Mesh(displayGeo, emissiveBlue);
            displayMesh.position.z = 0.26;
            
            const screen = new THREE.Group();
            screen.add(scMesh);
            screen.add(displayMesh);
            
            const angle = (i-1) * 0.4; // curve around
            screen.position.set(Math.sin(angle)*15, 22, 55 - Math.cos(angle)*5);
            screen.rotation.y = angle;
            screenGroup.add(screen);
        }
        consoleGroup.add(screenGroup);

        // Buttons and Joysticks
        for(let i=0; i<20; i++) {
            const bGeo = new THREE.BoxGeometry(1, 0.5, 1);
            const bMat = Math.random() > 0.5 ? emissiveRed : emissiveGreen;
            const bMesh = new THREE.Mesh(bGeo, bMat);
            bMesh.position.set((Math.random()-0.5)*25, 16.2, 58 + (Math.random()-0.5)*10);
            bMesh.rotation.x = 0.1;
            consoleGroup.add(bMesh);
        }

        // Base pedestal for the desk
        const dBaseGeo = new THREE.CylinderGeometry(5, 8, 35, 16);
        const dBaseMesh = new THREE.Mesh(dBaseGeo, steel);
        dBaseMesh.position.set(0, -2.5, 62);
        consoleGroup.add(dBaseMesh);

        return consoleGroup;
    };

    // 9. Multiverse Portal Vortex (Event Horizon)
    const buildEventHorizon = () => {
        // High segment count for vertex displacement
        const portalGeo = new THREE.CircleGeometry(33, 256);
        const portalMesh = new THREE.Mesh(portalGeo, meshes.portalMaterial);
        
        portalMesh.position.copy(meshes.outerRingPos);
        portalMesh.position.z = 0; // Exactly in the center of the ring
        
        meshes.portalMesh = portalMesh;
        return portalMesh;
    };

    // 10. Subatomic Particle Accelerator (Tachyon Flow)
    const buildParticles = () => {
        const particleCount = 15000;
        const pGeo = new THREE.BufferGeometry();
        const pPositions = new Float32Array(particleCount * 3);
        const pColors = new Float32Array(particleCount * 3);
        const pVelocities = []; // We will store this externally for animation
        
        for(let i=0; i<particleCount; i++) {
            // Initial random scatter within a sphere
            const r = Math.random() * 50;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta) + meshes.outerRingPos.y;
            const z = r * Math.cos(phi) + 100; // start them away from portal
            
            pPositions[i*3] = x;
            pPositions[i*3+1] = y;
            pPositions[i*3+2] = z;
            
            pColors[i*3] = 0.2 + Math.random()*0.8;
            pColors[i*3+1] = 0.5 + Math.random()*0.5;
            pColors[i*3+2] = 1.0;
            
            pVelocities.push(new THREE.Vector3(
                (Math.random()-0.5)*2,
                (Math.random()-0.5)*2,
                -Math.random()*5 - 2
            ));
        }
        
        pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
        pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));
        
        // Use an additive blending points material
        const pMat = new THREE.PointsMaterial({
            size: 0.5,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.8,
            map: createCircleTexture() // Need a circular texture to not be square
        });
        
        const particleSystem = new THREE.Points(pGeo, pMat);
        meshes.particleSystem = particleSystem;
        meshes.particleVelocities = pVelocities;
        meshes.particleData = pPositions;
        
        return particleSystem;
    };

    function createCircleTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 32; canvas.height = 32;
        const context = canvas.getContext('2d');
        const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, 32, 32);
        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    // 11. Tachyon Emission Antennae
    const buildAntennae = () => {
        const antennaeGroup = new THREE.Group();
        
        for(let side of [-1, 1]) {
            const arr = new THREE.Group();
            
            // Central Mast
            const mastGeo = new THREE.CylinderGeometry(1.5, 3, 60, 16);
            const mastMesh = new THREE.Mesh(mastGeo, chrome);
            mastMesh.position.set(0, 30, 0);
            arr.add(mastMesh);
            
            // Prongs
            for(let p=0; p<4; p++) {
                const prongGeo = new THREE.CylinderGeometry(0.5, 1, 20, 8);
                const prongMesh = new THREE.Mesh(prongGeo, gold);
                prongMesh.position.set(0, 45, 10);
                prongMesh.rotation.x = Math.PI/4;
                
                // Wrap in a group to rotate around mast
                const prongPivot = new THREE.Group();
                prongPivot.add(prongMesh);
                prongPivot.rotation.y = (p/4) * Math.PI * 2;
                arr.add(prongPivot);
            }
            
            // Glowing tip
            const tipGeo = new THREE.SphereGeometry(3, 16, 16);
            const tipMesh = new THREE.Mesh(tipGeo, emissiveWhite);
            tipMesh.position.set(0, 60, 0);
            arr.add(tipMesh);
            
            arr.position.set(side * 60, meshes.outerRingPos.y + 20, -10);
            arr.rotation.z = side * -0.2; // Angle outwards
            arr.rotation.x = -0.3; // Angle backwards
            
            antennaeGroup.add(arr);
            
            if(!meshes.antennaeGroups) meshes.antennaeGroups = [];
            meshes.antennaeGroups.push(arr);
        }
        
        return antennaeGroup;
    };


    // ----------------------------------------------------------------------------------
    // ADD PARTS TO HIERARCHY
    // ----------------------------------------------------------------------------------
    const pedGroup = buildBasePedestal();
    addPart('Base_Pedestal_Foundation', 'Massive dark alloy foundation housing quantum harmonic dampeners.', 'Dark Alloy & Steel', 'Provides structural stability against multiversal shear forces.', pedGroup, 'Structural collapse leading to localized gravity well.', ['Event_Horizon_Stabilization_Field', 'Multiverse_Portal_Vortex'], {x:0, y:0, z:0}, {x:0, y:-100, z:0});

    const outRing = buildOuterRing();
    addPart('Primary_Stargate_Outer_Chassis', 'The main structural loop containing tachyon channels and exotic matter conduits.', 'Dark Alloy, Steel, Emissive', 'Contains the immense energy of the dialing sequence and anchors the wormhole.', outRing, 'Ring fractures, releasing deadly tachyon radiation.', ['Magnetic_Confinement_Coils', 'Wavefunction_Collapse_Inhibitor'], {x:0, y:0, z:0}, {x:0, y:0, z:-150});

    const inRing = buildInnerRing();
    addPart('Superconducting_Inner_Dialing_Ring', 'Copper-alloy rotating ring inscribed with Everett branch coordinates.', 'Copper & Emissive', 'Rotates at high velocity to lock in the multiversal address.', inRing, 'Inability to target a specific universe, resulting in a random connection.', ['Chevron_Lock_Mechanism_Array'], {x:0, y:0, z:0}, {x:0, y:0, z:100});

    const chevs = buildChevrons();
    addPart('Chevron_Lock_Mechanism_Array', 'Nine locking mechanisms with quantum resonance crystals.', 'Steel & Red Quantum Crystals', 'Locks down the 9-dimensional coordinates one by one.', chevs, 'Address fails to encode, aborting dialing sequence explosively.', ['Everett_Branch_Navigational_Computer'], {x:0, y:0, z:0}, {x:0, y:120, z:0});

    const genLeft = buildGenerator('left');
    addPart('Zero_Point_Module_Array_Left', 'Extracts vacuum energy to power the macroscopic superposition state.', 'Dark Steel, Glass, Plasma', 'Provides 50% of the exawatt power requirement.', genLeft, 'Power fluctuation causing incomplete portal formation.', ['Coolant_Circulation_Piping'], {x:0, y:0, z:0}, {x:-150, y:0, z:0});

    const genRight = buildGenerator('right');
    addPart('Zero_Point_Module_Array_Right', 'Extracts vacuum energy to power the macroscopic superposition state.', 'Dark Steel, Glass, Plasma', 'Provides 50% of the exawatt power requirement.', genRight, 'Power fluctuation causing incomplete portal formation.', ['Coolant_Circulation_Piping'], {x:0, y:0, z:0}, {x:150, y:0, z:0});

    const cond = buildConduits();
    addPart('Coolant_and_Energy_Conduits', 'High-pressure rubber and glowing energetic transfer tubes.', 'Rubber & Emissive Blue', 'Transfers thermal waste and raw energy from ZPMs to the rings.', cond, 'Meltdown of the primary chassis due to thermal overload.', ['Primary_Stargate_Outer_Chassis'], {x:0, y:0, z:0}, {x:0, y:-50, z:-100});

    const cons = buildConsole();
    addPart('Operator_Control_Console', 'Advanced multi-screen interface for dialing and monitoring wavefunction branching.', 'Dark Alloy & Emissive Screens', 'Allows human operator to input destination coordinates and monitor safety protocols.', cons, 'Loss of control, automatic shutdown sequence initiated.', [], {x:0, y:0, z:0}, {x:0, y:50, z:150});

    const port = buildEventHorizon();
    addPart('Multiverse_Portal_Vortex', 'The tear in the fabric of localized reality, bound by the ring.', 'Exotic Shader Material', 'Allows matter to traverse into alternate Everett branches.', port, 'Total existence failure for anyone inside the event horizon.', [], {x:0, y:0, z:0}, {x:0, y:0, z:0});

    const partsys = buildParticles();
    addPart('Subatomic_Particle_Accelerator_Field', 'Visualization of tachyon flow and localized probability fields.', 'Photonic Point Sprites', 'Stabilizes the entrance vector for macroscopic entities.', partsys, 'Severe biological distortion upon entry.', [], {x:0, y:0, z:0}, {x:0, y:0, z:200});

    const ants = buildAntennae();
    addPart('Tachyon_Emission_Antennae', 'Twin gold-tipped arrays projecting a stabilization field into the 5th dimension.', 'Chrome, Gold, Emissive', 'Prevents the wormhole from collapsing into a black hole.', ants, 'Spatiotemporal rupture in the immediate vicinity.', ['Multiverse_Portal_Vortex'], {x:0, y:0, z:0}, {x:0, y:150, z:-50});

    // Create a few more parts for the requirement (Total needs to be 15+)
    // Let's create invisible or structural logical parts grouped inside existing ones, or just standalone details.
    
    // 12. Magnetic Confinement Coils (Detailed torus behind the ring)
    const coilGroup = new THREE.Group();
    const coilGeo = new THREE.TorusGeometry(38, 3, 16, 128);
    const coilMesh = new THREE.Mesh(coilGeo, copper);
    coilGroup.add(coilMesh);
    coilGroup.position.copy(meshes.outerRingPos);
    coilGroup.position.z = -10;
    addPart('Magnetic_Confinement_Coils', 'Massive copper toroids for shaping the singularity.', 'Copper', 'Contains the edge of the event horizon.', coilGroup, 'Wormhole expands and consumes the facility.', [], {x:0, y:0, z:0}, {x:0, y:0, z:-200});

    // 13. Temporal Distortion Dampeners (Detailed boxes on the pedestal)
    const dampGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const dGeo = new THREE.BoxGeometry(10, 15, 10);
        const dMesh = new THREE.Mesh(dGeo, darkSteel);
        dMesh.position.set((i-1.5)*25, -15, -10);
        dampGroup.add(dMesh);
    }
    addPart('Temporal_Distortion_Dampeners', 'Heavy computational blocks synchronizing localized time.', 'Dark Steel', 'Prevents temporal shearing during transit.', dampGroup, 'Travelers age rapidly or reverse in age during transit.', [], {x:0, y:0, z:0}, {x:0, y:-80, z:50});

    // 14. Everett Branch Navigational Computer (Server racks behind console)
    const navGroup = new THREE.Group();
    for(let i=0; i<3; i++) {
        const rackGeo = new THREE.BoxGeometry(8, 25, 12);
        const rackMesh = new THREE.Mesh(rackGeo, darkAlloy);
        rackMesh.position.set((i-1)*12, 12.5, 80);
        
        // blinking lights
        for(let j=0; j<10; j++) {
            const light = new THREE.Mesh(new THREE.PlaneGeometry(1,1), emissiveGreen);
            light.position.set((i-1)*12 - 2 + (j%3)*2, 5 + Math.floor(j/3)*3, 86.1);
            navGroup.add(light);
            if(!meshes.blinkingLights) meshes.blinkingLights = [];
            meshes.blinkingLights.push(light);
        }
        navGroup.add(rackMesh);
    }
    addPart('Everett_Branch_Navigational_Computer', 'Quantum superposition computer calculating infinite probabilities.', 'Dark Alloy & Circuitry', 'Calculates the exact resonance frequency for the target universe.', navGroup, 'Dialing a universe with hostile physical laws.', [], {x:0, y:0, z:0}, {x:0, y:0, z:250});

    // 15. Wavefunction Collapse Inhibitor (Ring inside the inner ring)
    const inhibGroup = new THREE.Group();
    const inhibGeo = new THREE.TorusGeometry(32, 1, 16, 128);
    const inhibMesh = new THREE.Mesh(inhibGeo, emissiveWhite);
    inhibGroup.add(inhibMesh);
    inhibGroup.position.copy(meshes.outerRingPos);
    addPart('Wavefunction_Collapse_Inhibitor', 'Intense photonic ring preventing decoherence.', 'Emissive Light', 'Keeps the traveler in a superposition state while inside the wormhole.', inhibGroup, 'Traveler collapses into a smear of subatomic particles.', [], {x:0, y:0, z:0}, {x:0, y:0, z:150});


    // ----------------------------------------------------------------------------------
    // QUIZ QUESTIONS (PhD Level Quantum Mechanics / Many Worlds)
    // ----------------------------------------------------------------------------------
    const quizQuestions = [
        {
            question: "In the Everett Many-Worlds Interpretation, which of the following is responsible for the apparent collapse of the wavefunction from the perspective of an observer?",
            options: [
                "Environmental decoherence leading to branching of the universal wavefunction.",
                "Objective reduction orchestrated by gravitational self-energy.",
                "Non-linear modifications to the Schrödinger equation at macroscopic scales.",
                "The physical interaction of a conscious mind with a superposition state."
            ],
            correctAnswer: 0,
            explanation: "In MWI, there is no physical collapse; instead, the observer becomes entangled with the system. Environmental decoherence diagonalizes the reduced density matrix, causing the branches to become effectively non-interacting, leading to the subjective appearance of collapse."
        },
        {
            question: "When describing the Multiverse through the formalism of decoherence histories (consistent histories), what mathematical condition must be satisfied for two branches to be considered fully independent?",
            options: [
                "The overlap integral of their spatial wavefunctions must be exactly 1.",
                "The off-diagonal elements of the reduced density matrix of the pointer states must approach zero.",
                "The Hamiltonian must be entirely anti-Hermitian.",
                "The Born rule probabilities must sum to a value greater than 1."
            ],
            correctAnswer: 1,
            explanation: "For branches to be independent (decohered), the interference terms between them must vanish. This is mathematically represented by the off-diagonal elements of the reduced density matrix approaching zero in the pointer basis."
        },
        {
            question: "In the context of quantum computing and the Many-Worlds Interpretation, David Deutsch argues that a quantum computer achieves computational speedup by:",
            options: [
                "Utilizing closed timelike curves to send information back in time.",
                "Delegating computations to identical counterfactual machines in parallel universes and interfering the results.",
                "Rapidly alternating between macroscopic superpositions and deterministic classical states.",
                "Bypassing Heisenberg's uncertainty principle via quantum entanglement tunneling."
            ],
            correctAnswer: 1,
            explanation: "Deutsch, a staunch proponent of MWI, posits that a quantum computer works by splitting into multiple Everett branches, performing calculations in parallel universes, and then recombining (interfering) the branches to yield the final result."
        },
        {
            question: "If a Multiverse Bridge Gate were to create a wormhole connecting two distinct Everett branches, what fundamental conservation law would be seemingly violated locally, necessitating a generalized multidimensional conservation framework?",
            options: [
                "Conservation of baryon number.",
                "Unitarity of the universal evolution operator.",
                "Conservation of angular momentum.",
                "Local conservation of probability (unitarity within a single branch)."
            ],
            correctAnswer: 3,
            explanation: "Transferring matter from one branch to another would mean the probability norm (and physical mass/energy) within a single branch would change, violating local unitarity and conservation laws unless viewed from the perspective of the entire global wavefunction."
        },
        {
            question: "According to the Wigner's friend thought experiment extended to a Many-Worlds framework, before Wigner communicates with his friend who has measured a quantum system, Wigner describes the combined system of (friend + quantum object) as:",
            options: [
                "An entangled superposition of the friend having observed different outcomes.",
                "A mixed state representing classical ignorance of the friend's result.",
                "A collapsed pure state determined retrocausally by Wigner's future measurement.",
                "A disentangled product state with hidden variables."
            ],
            correctAnswer: 0,
            explanation: "In MWI, everything evolves strictly according to the unitary Schrödinger equation. Wigner must describe his friend and the object as a massive entangled superposition until Wigner himself interacts with them and joins the entangled state."
        }
    ];

    // ----------------------------------------------------------------------------------
    // ANIMATION LOGIC (Complex State Machine)
    // ----------------------------------------------------------------------------------
    const state = {
        phase: 0, // 0: Idle, 1: Dialing, 2: Kawoosh, 3: Stable, 4: Shutdown
        dialPhase: 0,
        timeInPhase: 0,
        lockedChevrons: 0,
        innerRingSpeed: 0,
        targetRingSpeed: 0,
        portalScale: 0.001
    };

    meshes.portalMesh.scale.set(state.portalScale, state.portalScale, 1);
    meshes.portalMaterial.uniforms.activeState.value = 0.0;

    const animate = (time, speed, meshesObj = meshes) => {
        const dt = 0.016 * speed; // assuming 60fps base
        
        // Update portal shader time
        if(meshesObj.portalMaterial) {
            meshesObj.portalMaterial.uniforms.time.value += dt;
        }

        // Spin generator rings
        if(meshesObj.generatorRings) {
            meshesObj.generatorRings.forEach(ring => {
                ring.group.rotation.y += ring.speed * speed;
            });
        }

        // Blinking server lights
        if(meshesObj.blinkingLights) {
            meshesObj.blinkingLights.forEach(light => {
                if(Math.random() > 0.95) {
                    light.material.emissiveIntensity = Math.random() * 3;
                }
            });
        }
        
        // Pulse plasma cores
        if(meshesObj.plasmaCores) {
            const pulse = Math.sin(time * 5) * 0.5 + 3.5;
            meshesObj.plasmaCores.forEach(core => {
                core.material.emissiveIntensity = pulse;
            });
        }
        
        // Antennae subtle rotation
        if(meshesObj.antennaeGroups) {
            meshesObj.antennaeGroups.forEach((ant, idx) => {
                const dir = idx === 0 ? 1 : -1;
                ant.rotation.y = Math.sin(time * 0.5) * 0.1 * dir;
            });
        }

        // Particle System update (swirling into the portal)
        if(meshesObj.particleSystem && meshesObj.particleData) {
            const positions = meshesObj.particleSystem.geometry.attributes.position.array;
            const target = meshesObj.outerRingPos;
            
            for(let i=0; i<15000; i++) {
                let px = positions[i*3];
                let py = positions[i*3+1];
                let pz = positions[i*3+2];
                
                // Vortex physics
                const dx = target.x - px;
                const dy = target.y - py;
                const dz = target.z - pz;
                const distSq = dx*dx + dy*dy + dz*dz;
                
                // Gravity pull towards center
                const pull = state.phase >= 2 ? (1000 / (distSq + 100)) : 0.1;
                
                let vx = meshesObj.particleVelocities[i].x;
                let vy = meshesObj.particleVelocities[i].y;
                let vz = meshesObj.particleVelocities[i].z;
                
                vx += dx * pull * dt * 0.01;
                vy += dy * pull * dt * 0.01;
                vz += dz * pull * dt * 0.01;
                
                // Swirl tangential force
                const swirlStr = state.phase >= 2 ? 2.0 : 0.5;
                vx += -dy * swirlStr * dt * 0.01;
                vy += dx * swirlStr * dt * 0.01;
                
                // Dampening
                vx *= 0.98;
                vy *= 0.98;
                vz *= 0.98;
                
                px += vx * speed;
                py += vy * speed;
                pz += vz * speed;
                
                // Reset if they pass through the portal
                if(pz < -10) {
                    const r = Math.random() * 50 + 50;
                    const theta = Math.random() * Math.PI * 2;
                    const phi = Math.acos((Math.random() * 2) - 1);
                    px = r * Math.sin(phi) * Math.cos(theta);
                    py = r * Math.sin(phi) * Math.sin(theta) + target.y;
                    pz = r * Math.cos(phi) + 150;
                    vx = 0; vy = 0; vz = -Math.random()*10 - 5;
                }
                
                positions[i*3] = px;
                positions[i*3+1] = py;
                positions[i*3+2] = pz;
                
                meshesObj.particleVelocities[i].set(vx, vy, vz);
            }
            meshesObj.particleSystem.geometry.attributes.position.needsUpdate = true;
        }


        // STATE MACHINE
        state.timeInPhase += dt;

        if (state.phase === 0) {
            // Idle to Dialing transition (Triggered cyclically for demonstration)
            if (state.timeInPhase > 3.0) {
                state.phase = 1;
                state.timeInPhase = 0;
                state.lockedChevrons = 0;
                meshesObj.chevronLocks.forEach(c => {
                    c.locked = false;
                    c.slider.position.y = 0; // reset
                    c.crystal.material.emissiveIntensity = 0.5;
                    c.crystal.material.color.setHex(0x330000);
                });
            }
        } else if (state.phase === 1) {
            // DIALING SEQUENCE
            // Inner ring speeds up and slows down
            if (state.lockedChevrons < 9) {
                const cycleTime = 2.0; // Time per chevron lock
                const localTime = state.timeInPhase % cycleTime;
                
                if (localTime < 0.2 && state.targetRingSpeed === 0) {
                    // Start spinning
                    state.targetRingSpeed = (Math.random() > 0.5 ? 1 : -1) * 2.0;
                } else if (localTime > 1.5 && state.targetRingSpeed !== 0) {
                    // Stop spinning
                    state.targetRingSpeed = 0;
                }
                
                // Lock the chevron exactly at the end of the cycle
                const currentChevronIdx = state.lockedChevrons;
                if (localTime > 1.8 && !meshesObj.chevronLocks[currentChevronIdx].locked) {
                    const chevron = meshesObj.chevronLocks[currentChevronIdx];
                    chevron.locked = true;
                    // Flash and lock
                    chevron.crystal.material.emissiveIntensity = 5.0;
                    chevron.crystal.material.color.setHex(0xffaaaa);
                    chevron.slider.position.y = -2; // move inward
                    state.lockedChevrons++;
                }
                
            } else {
                // All chevrons locked, proceed to kawoosh
                if (state.timeInPhase > 9 * 2.0 + 1.0) {
                    state.phase = 2;
                    state.timeInPhase = 0;
                }
            }
            
            // Smoothly update inner ring rotation speed
            state.innerRingSpeed += (state.targetRingSpeed - state.innerRingSpeed) * 0.1;
            if(meshesObj.innerRingGroup) {
                meshesObj.innerRingGroup.rotation.z += state.innerRingSpeed * dt;
            }
            
        } else if (state.phase === 2) {
            // KAWOOSH (Portal Opening)
            state.portalScale += (1.0 - state.portalScale) * 0.1;
            meshesObj.portalMesh.scale.set(state.portalScale, state.portalScale, 1);
            meshesObj.portalMaterial.uniforms.activeState.value = Math.min(1.0, state.timeInPhase * 0.5);
            
            if (state.timeInPhase > 3.0) {
                state.phase = 3;
                state.timeInPhase = 0;
            }
        } else if (state.phase === 3) {
            // STABLE WORMHOLE
            meshesObj.portalMaterial.uniforms.activeState.value = 1.0;
            
            // Stay open for a while
            if (state.timeInPhase > 10.0) {
                state.phase = 4;
                state.timeInPhase = 0;
            }
        } else if (state.phase === 4) {
            // SHUTDOWN
            state.portalScale += (0.001 - state.portalScale) * 0.1;
            meshesObj.portalMesh.scale.set(Math.max(0.001, state.portalScale), Math.max(0.001, state.portalScale), 1);
            meshesObj.portalMaterial.uniforms.activeState.value = Math.max(0.0, 1.0 - state.timeInPhase);
            
            if (state.timeInPhase > 2.0) {
                state.phase = 0;
                state.timeInPhase = 0;
            }
        }
    };

    return { group, parts, description: "Multiverse Bridge Gate (Ultra God Tier) - Capable of piercing Everett wavefunction branches.", quizQuestions, animate };
}
