import * as THREE from 'three';

export function createBerylliumElectronCloud(scene, renderer, camera) {
    const group = new THREE.Group();

    // Electron cloud using particles, Z=4
    const particleCount = 15000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const alphas = new Float32Array(particleCount);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
        // Distribute mainly in 2 regions: inner core (1s) and outer (2s)
        let r;
        if (Math.random() < 0.5) {
            // 1s
            r = Math.random() * 1.5;
        } else {
            // 2s
            r = 2.0 + Math.random() * 3.0;
        }
        
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        positions[i*3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i*3+2] = r * Math.cos(phi);
        
        // Closer to center = more opaque
        alphas[i] = Math.max(0.1, 1.0 - (r / 5.0));
        sizes[i] = Math.random() * 0.15;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
        uniforms: {
            color: { value: new THREE.Color(0x00ffcc) },
            time: { value: 0 }
        },
        vertexShader: `
            attribute float alpha;
            attribute float size;
            varying float vAlpha;
            uniform float time;
            
            void main() {
                vAlpha = alpha;
                // Add jitter
                vec3 pos = position;
                pos.x += sin(time * 10.0 + position.y) * 0.05;
                pos.y += cos(time * 11.0 + position.z) * 0.05;
                
                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform vec3 color;
            varying float vAlpha;
            void main() {
                // Circular particle
                float d = distance(gl_PointCoord, vec2(0.5));
                if(d > 0.5) discard;
                
                // Glow edge
                float a = vAlpha * (1.0 - (d * 2.0));
                gl_FragColor = vec4(color, a);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const cloud = new THREE.Points(geometry, material);
    group.add(cloud);

    const nucleus = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    group.add(nucleus);

    let time = 0;

    return {
        update: () => {
            time += 0.016;
            material.uniforms.time.value = time;
            cloud.rotation.y = time * 0.15;
            cloud.rotation.z = time * 0.05;
        },
        cleanup: () => {
            geometry.dispose();
            material.dispose();
            nucleus.geometry.dispose();
            nucleus.material.dispose();
        }
    };
}