import * as THREE from 'three';

export function createDiamondLattice() {
    const group = new THREE.Group();
    group.userData = {
        name: 'Diamond Lattice',
        description: 'Tetrahedral crystal lattice of Diamond, showcasing incredible hardness and refractive properties.',
        type: 'Chemistry'
    };

    // Advanced God-Tier Shader Material
    const godTierMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            color1: { value: new THREE.Color(0x00ffff) },
            color2: { value: new THREE.Color(0xff00ff) }
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vPosition;
            varying vec3 vNormal;
            uniform float time;
            void main() {
                vUv = uv;
                vNormal = normalize(normalMatrix * normal);
                vPosition = position;
                vec3 pos = position;
                // Add subtle quantum fluctuation
                pos.x += sin(time * 2.0 + position.y) * 0.02;
                pos.y += cos(time * 2.0 + position.x) * 0.02;
                pos.z += sin(time * 2.0 + position.z) * 0.02;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            varying vec2 vUv;
            varying vec3 vPosition;
            varying vec3 vNormal;
            uniform float time;
            uniform vec3 color1;
            uniform vec3 color2;
            
            void main() {
                float pulse = (sin(time * 3.0) + 1.0) * 0.5;
                vec3 viewDir = normalize(cameraPosition - vPosition);
                float rim = 1.0 - max(dot(viewDir, vNormal), 0.0);
                rim = smoothstep(0.6, 1.0, rim);
                
                float pattern = sin(vUv.x * 20.0 + time) * cos(vUv.y * 20.0 + time);
                vec3 baseColor = mix(color1, color2, vUv.x + pattern * 0.2);
                
                vec3 finalColor = baseColor * (0.5 + 0.5 * pulse) + vec3(rim) * 1.5;
                gl_FragColor = vec4(finalColor, 0.85);
            }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    // Nucleus / Core
    const coreGeo = new THREE.SphereGeometry(1, 64, 64);
    const core = new THREE.Mesh(coreGeo, godTierMaterial);
    group.add(core);
    
    // Orbital rings / Bonds
    const ringGeo = new THREE.TorusGeometry(3, 0.05, 16, 100);
    const ringMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: 0x00c8ff,
        emissiveIntensity: 2.0,
        metalness: 1.0,
        roughness: 0.1,
        clearcoat: 1.0
    });
    
    const rings = 5;
    for(let i = 0; i < rings; i++) {
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.random() * Math.PI;
        ring.rotation.y = Math.random() * Math.PI;
        
        // Custom animation function
        ring.userData.update = (time) => {
            ring.rotation.x += 0.01 * (i + 1);
            ring.rotation.y += 0.015 * (i + 1);
        };
        group.add(ring);
    }

    // Add particle swarm
    const particleCount = 1000;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    for(let i=0; i<particleCount*3; i++) {
        pPos[i] = (Math.random() - 0.5) * 10;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
        size: 0.05,
        color: 0x00ffff,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(pGeo, pMat);
    group.add(particles);

    group.userData.update = (time) => {
        godTierMaterial.uniforms.time.value = time;
        group.children.forEach(child => {
            if(child.userData.update) child.userData.update(time);
        });
        particles.rotation.y = time * 0.1;
        particles.rotation.x = time * 0.05;
    };

    return group;
}
