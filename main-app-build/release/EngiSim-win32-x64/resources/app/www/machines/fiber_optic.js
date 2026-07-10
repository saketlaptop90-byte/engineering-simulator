import * as THREE from 'three';

export function createMachine() {
    const group = new THREE.Group();

    // --- 1. Outer Protective Jacket ---
    const jacketGeo = new THREE.CylinderGeometry(1.2, 1.2, 8, 32, 1, true, 0, Math.PI); // Half pipe
    const jacketMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, roughness: 0.8, side: THREE.DoubleSide });
    const jacket = new THREE.Mesh(jacketGeo, jacketMat);
    jacket.rotation.z = Math.PI / 2;
    jacket.rotation.x = -Math.PI / 2;
    jacket.position.y = 0;
    group.add(jacket);

    // --- 2. Cladding (Lower Refractive Index) ---
    const cladGeo = new THREE.CylinderGeometry(0.8, 0.8, 8, 32, 1, true, 0, Math.PI);
    const cladMat = new THREE.MeshPhysicalMaterial({ 
        color: 0xffffff, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1, ior: 1.45, side: THREE.DoubleSide 
    });
    const cladding = new THREE.Mesh(cladGeo, cladMat);
    cladding.rotation.z = Math.PI / 2;
    cladding.rotation.x = -Math.PI / 2;
    cladding.userData = { id: 'cladding', name: 'Cladding Layer', description: 'Has a slightly lower refractive index than the core, acting as a perfect mirror for shallow angles.' };
    group.add(cladding);

    // --- 3. The Core (Higher Refractive Index) ---
    const coreGeo = new THREE.CylinderGeometry(0.4, 0.4, 8, 32, 1, true, 0, Math.PI);
    const coreMat = new THREE.MeshPhysicalMaterial({ 
        color: 0x88ccff, transmission: 0.95, opacity: 1, transparent: true, roughness: 0.05, ior: 1.5, side: THREE.DoubleSide 
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.rotation.z = Math.PI / 2;
    core.rotation.x = -Math.PI / 2;
    core.userData = { id: 'fiber_core', name: 'Glass Core', description: 'Extremely pure silica glass where the light pulses travel.' };
    group.add(core);

    // Provide a back wall to the core so we can see light hitting it
    const coreBackGeo = new THREE.CylinderGeometry(0.4, 0.4, 8, 32, 1, true, Math.PI, Math.PI);
    const coreBackMat = new THREE.MeshStandardMaterial({ color: 0x224466, roughness: 0.1, metalness: 0.5, side: THREE.DoubleSide });
    const coreBack = new THREE.Mesh(coreBackGeo, coreBackMat);
    coreBack.rotation.z = Math.PI / 2;
    coreBack.rotation.x = -Math.PI / 2;
    group.add(coreBack);

    // --- 4. Light Pulses (Data Transmission) ---
    // We will simulate 3 different data streams (red, green, blue light - Wavelength Division Multiplexing)
    const pulseCount = 60;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pulseCount * 3);
    const pColor = new Float32Array(pulseCount * 3);
    const pType = new Float32Array(pulseCount); // 0: red, 1: green, 2: blue
    const pAngle = new Float32Array(pulseCount); // Bouncing angle

    for(let i=0; i<pulseCount; i++){
        pPos[i*3] = -4 + Math.random()*8; // X
        
        // Pick a color stream
        const stream = i % 3;
        pType[i] = stream;
        if (stream === 0) { pColor[i*3] = 1.0; pColor[i*3+1] = 0.2; pColor[i*3+2] = 0.2; pAngle[i] = 0.15; } // Red, shallow bounce
        else if (stream === 1) { pColor[i*3] = 0.2; pColor[i*3+1] = 1.0; pColor[i*3+2] = 0.2; pAngle[i] = 0.25; } // Green, medium
        else { pColor[i*3] = 0.2; pColor[i*3+1] = 0.4; pColor[i*3+2] = 1.0; pAngle[i] = 0.35; } // Blue, steep

        // Initial Y based on bounce sine wave
        pPos[i*3+1] = Math.sin(pPos[i*3] / pAngle[i]) * 0.38;
        pPos[i*3+2] = 0; // Flat Z for easy viewing
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pColor, 3));
    
    // Custom shader to make them look like glowing laser pulses
    const shaderMat = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 }
        },
        vertexShader: `
            attribute vec3 color;
            varying vec3 vColor;
            void main() {
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = 15.0 * (300.0 / -mvPosition.z); // Size of light pulse
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            void main() {
                // Soft glowing dot
                float d = distance(gl_PointCoord, vec2(0.5, 0.5));
                float alpha = 1.0 - (d * 2.0);
                if (alpha < 0.0) discard;
                // Core is bright white, edges are colored
                vec3 finalColor = mix(vec3(1.0), vColor, d * 2.0);
                gl_FragColor = vec4(finalColor, max(alpha, 0.0));
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const pulses = new THREE.Points(pGeo, shaderMat);
    pulses.userData = { id: 'light_pulses', name: 'Laser Pulses (Total Internal Reflection)', description: 'Data encoded in light. The light hits the cladding boundary at a shallow angle and reflects perfectly back into the core with zero loss.' };
    group.add(pulses);

    // --- 5. Animation ---
    let time = 0;
    group.userData.animate = function(delta) {
        time += delta;
        const pos = pulses.geometry.attributes.position.array;
        
        for(let i=0; i<pulseCount; i++){
            // Light travels incredibly fast
            let speed = delta * 15;
            pos[i*3] += speed;

            // Recalculate Y based on the sine wave to simulate bouncing off walls (Total Internal Reflection)
            // The absolute value of the sine isn't quite right for a sharp bounce, we need a triangle wave
            // Triangle wave equation: abs((x % p) - (p/2))
            
            const x = pos[i*3];
            const period = pAngle[i] * 4; // Distance for one full bounce cycle
            // Normalize x to the period
            let modX = x % period;
            if (modX < 0) modX += period; // handle negative x
            
            // Map to -0.38 to 0.38 (core bounds)
            const bounceY = (Math.abs(modX - (period/2)) / (period/2)) * 0.76 - 0.38;
            pos[i*3+1] = bounceY;

            // Reset to left side
            if (pos[i*3] > 4) {
                pos[i*3] -= 8;
            }
        }
        pulses.geometry.attributes.position.needsUpdate = true;
    };

    return group;
}
