import * as THREE from 'three';

export function createMachine() {
    const group = new THREE.Group();

    // --- 1. Filter Housing (Pipe) ---
    const housingGeo = new THREE.CylinderGeometry(2, 2, 8, 32, 1, true, 0, Math.PI); // Half pipe
    const housingMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.7, roughness: 0.3, side: THREE.DoubleSide });
    const housing = new THREE.Mesh(housingGeo, housingMat);
    housing.rotation.z = Math.PI / 2;
    housing.rotation.x = -Math.PI / 2; // Open side facing camera
    group.add(housing);

    // --- 2. Semi-permeable Membrane ---
    const membraneGeo = new THREE.CylinderGeometry(1.9, 1.9, 0.2, 32);
    const membraneMat = new THREE.MeshPhysicalMaterial({ 
        color: 0xeeeeee, transmission: 0.5, opacity: 1, transparent: true, roughness: 0.9 
    });
    const membrane = new THREE.Mesh(membraneGeo, membraneMat);
    membrane.rotation.z = Math.PI / 2;
    membrane.position.x = 0;
    membrane.userData = { id: 'ro_membrane', name: 'Semi-Permeable Membrane', description: 'Microscopic pores allow small water molecules through, but block larger salt ions and impurities.' };
    group.add(membrane);

    // Membrane Grid overlay (visual texture)
    const gridHelper = new THREE.GridHelper(4, 20, 0x000000, 0x000000);
    gridHelper.rotation.z = Math.PI / 2;
    gridHelper.position.x = 0.11;
    group.add(gridHelper);

    // --- 3. Particles (Water vs Salt) ---
    const partCount = 300;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(partCount * 3);
    const pColor = new Float32Array(partCount * 3);
    const pSize = new Float32Array(partCount);
    const pType = new Float32Array(partCount); // 0: H2O (passes), 1: Na+ (blocked), 2: Cl- (blocked)

    for(let i=0; i<partCount; i++){
        pPos[i*3] = -4 + Math.random()*2; // Start on left (high pressure side)
        
        // Random circle placement inside pipe
        const r = Math.random() * 1.8;
        const theta = Math.random() * Math.PI * 2;
        pPos[i*3+1] = Math.cos(theta) * r;
        pPos[i*3+2] = Math.sin(theta) * r;

        // Determine particle type
        const rand = Math.random();
        if (rand < 0.7) {
            // H2O (Pure water, blue, small)
            pType[i] = 0;
            pSize[i] = 0.1;
            pColor[i*3] = 0.2; pColor[i*3+1] = 0.6; pColor[i*3+2] = 1.0;
        } else if (rand < 0.85) {
            // Na+ (Sodium, purple, large)
            pType[i] = 1;
            pSize[i] = 0.2;
            pColor[i*3] = 0.6; pColor[i*3+1] = 0.2; pColor[i*3+2] = 0.8;
        } else {
            // Cl- (Chlorine, green, large)
            pType[i] = 2;
            pSize[i] = 0.25;
            pColor[i*3] = 0.2; pColor[i*3+1] = 0.8; pColor[i*3+2] = 0.2;
        }
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pColor, 3));
    pGeo.setAttribute('size', new THREE.BufferAttribute(pSize, 1));

    // Shader material to handle different sizes
    const shaderMat = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 }
        },
        vertexShader: `
            attribute vec3 color;
            attribute float size;
            varying vec3 vColor;
            void main() {
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            void main() {
                // Circular particle
                float d = distance(gl_PointCoord, vec2(0.5, 0.5));
                if (d > 0.5) discard;
                gl_FragColor = vec4(vColor, 0.9);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(pGeo, shaderMat);
    particles.userData = { id: 'ro_fluid', name: 'Pressurized Saline Solution', description: 'High pressure forces the fluid against the membrane. Only pure H2O makes it through to the other side.' };
    group.add(particles);

    // --- 4. Animation ---
    let time = 0;
    group.userData.animate = function(delta) {
        time += delta;

        const pos = particles.geometry.attributes.position.array;
        
        for(let i=0; i<partCount; i++){
            let x = pos[i*3];
            let y = pos[i*3+1];
            let z = pos[i*3+2];
            const type = pType[i];

            // Move towards membrane (high pressure)
            if (x < 0) {
                x += delta * 2; // Fast flow
            } else if (x >= 0 && x < 0.2) {
                // At the membrane
                if (type === 0) {
                    // Water passes through slowly (permeates)
                    x += delta * 0.5;
                } else {
                    // Salt is blocked, diverted down the brine discharge tube
                    // We'll simulate them sliding down the face of the membrane
                    y -= delta * 1.5;
                    // If they reach the bottom, reset
                    if (y < -1.9) {
                        x = 4; // flag for reset
                    }
                }
            } else {
                // Past membrane (Pure water flow)
                if (type === 0) {
                    x += delta * 1.5; // Flow out
                }
            }

            // Reset particles
            if (x > 4) {
                x = -4 - Math.random();
                const r = Math.random() * 1.8;
                const theta = Math.random() * Math.PI * 2;
                y = Math.cos(theta) * r;
                z = Math.sin(theta) * r;
            }

            pos[i*3] = x;
            pos[i*3+1] = y;
            pos[i*3+2] = z;
        }

        particles.geometry.attributes.position.needsUpdate = true;
    };

    return group;
}
