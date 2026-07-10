import * as THREE from 'three';

export function createMachine() {
    const group = new THREE.Group();

    // --- 1. The Energy Singularity (Core) ---
    const coreGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const coreMat = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0.0 },
            color: { value: new THREE.Color(0xffffff) }
        },
        vertexShader: `
            varying vec3 vNormal;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 color;
            varying vec3 vNormal;
            
            void main() {
                // Highly erratic pulsing representing antimatter annihilation
                float intensity = 0.5 + 0.5 * sin(time * 20.0) * sin(time * 45.0);
                float glow = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
                
                gl_FragColor = vec4(color * (intensity + glow + 1.0), 1.0);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.userData = { id: 'antimatter_core', name: 'Annihilation Singularity', description: 'Matter and antimatter collide here, converting 100% of their mass into pure energy.' };
    group.add(core);

    // --- 2. Gyroscopic Containment Rings ---
    const ringMat = new THREE.MeshStandardMaterial({
        color: 0x222222,
        metalness: 0.9,
        roughness: 0.2,
        emissive: 0x000511
    });

    const rings = [];
    const numRings = 4;
    for (let i = 0; i < numRings; i++) {
        const radius = 2.5 + i * 0.8;
        const ringGeo = new THREE.TorusGeometry(radius, 0.15, 16, 64);
        const ring = new THREE.Mesh(ringGeo, ringMat);
        
        // Add small glowing nodes to the rings
        const nodeGeo = new THREE.SphereGeometry(0.2, 8, 8);
        const nodeMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
        for(let j=0; j<4; j++) {
            const node = new THREE.Mesh(nodeGeo, nodeMat);
            const angle = (j / 4) * Math.PI * 2;
            node.position.x = Math.cos(angle) * radius;
            node.position.y = Math.sin(angle) * radius;
            ring.add(node);
        }

        ring.userData = { id: `containment_ring_${i}`, name: `Magnetic Containment Ring ${i+1}`, description: 'Creates an impenetrable magnetic bottle to hold the antimatter.' };
        rings.push({ mesh: ring, speedX: (Math.random()-0.5)*2, speedY: (Math.random()-0.5)*2, speedZ: (Math.random()-0.5)*2 });
        group.add(ring);
    }

    // --- 3. Thruster Nozzle ---
    const nozzleGeo = new THREE.CylinderGeometry(2, 4, 6, 32, 1, true);
    const nozzleMat = new THREE.MeshStandardMaterial({
        color: 0x111111,
        metalness: 0.9,
        roughness: 0.5,
        side: THREE.DoubleSide
    });
    const nozzle = new THREE.Mesh(nozzleGeo, nozzleMat);
    nozzle.position.z = -5;
    nozzle.rotation.x = Math.PI / 2;
    nozzle.userData = { id: 'magnetic_nozzle', name: 'Magnetic Nozzle', description: 'Directs the gamma ray and pion exhaust backwards to produce thrust.' };
    group.add(nozzle);

    // --- 4. Exhaust Particle Stream ---
    const exhaustCount = 500;
    const exhaustGeo = new THREE.BufferGeometry();
    const exhaustPositions = new Float32Array(exhaustCount * 3);
    const exhaustLifetimes = new Float32Array(exhaustCount); // 0 to 1

    for(let i=0; i<exhaustCount; i++) {
        exhaustPositions[i*3] = (Math.random()-0.5) * 2;
        exhaustPositions[i*3+1] = (Math.random()-0.5) * 2;
        exhaustPositions[i*3+2] = -2 - Math.random() * 8; // Shoot backwards along Z
        exhaustLifetimes[i] = Math.random();
    }
    exhaustGeo.setAttribute('position', new THREE.BufferAttribute(exhaustPositions, 3));
    exhaustGeo.setAttribute('lifetime', new THREE.BufferAttribute(exhaustLifetimes, 1));

    const exhaustMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.15,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const exhaustStream = new THREE.Points(exhaustGeo, exhaustMat);
    exhaustStream.userData = { id: 'exhaust_stream', name: 'Relativistic Exhaust', description: 'High-energy particles exiting the nozzle at significant fractions of the speed of light.' };
    group.add(exhaustStream);

    // --- 5. Animation Loop ---
    let time = 0;
    group.userData.animate = function(delta) {
        time += delta;
        
        // Pulse the core
        coreMat.uniforms.time.value = time;
        
        // Spin the rings in chaotic gyroscope pattern
        rings.forEach(r => {
            r.mesh.rotation.x += r.speedX * delta;
            r.mesh.rotation.y += r.speedY * delta;
            r.mesh.rotation.z += r.speedZ * delta;
        });

        // Animate the exhaust stream
        const positions = exhaustStream.geometry.attributes.position.array;
        const lifetimes = exhaustStream.geometry.attributes.lifetime.array;
        
        for(let i=0; i<exhaustCount; i++) {
            lifetimes[i] -= delta * 2.0; // Decay rate
            
            // Move backwards extremely fast
            positions[i*3+2] -= delta * 20.0;
            
            // Expand outward slightly
            positions[i*3] *= 1.05;
            positions[i*3+1] *= 1.05;

            // Reset particle if dead
            if (lifetimes[i] < 0 || positions[i*3+2] < -15) {
                lifetimes[i] = 1.0;
                // Respawn near the core
                positions[i*3] = (Math.random()-0.5) * 1.5;
                positions[i*3+1] = (Math.random()-0.5) * 1.5;
                positions[i*3+2] = -2;
            }
        }
        exhaustStream.geometry.attributes.position.needsUpdate = true;
        
        // Color shift the exhaust based on time
        exhaustMat.color.setHSL(0.6 + Math.sin(time*5)*0.1, 1.0, 0.7);
    };

    return group;
}
