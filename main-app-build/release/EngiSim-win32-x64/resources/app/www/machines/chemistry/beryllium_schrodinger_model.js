import * as THREE from 'three';

export function createBerylliumSchrodingerModel(scene, renderer, camera) {
    const group = new THREE.Group();

    // Schrodinger Model for Beryllium
    // Represents wave functions visually. 1s is spherically symmetric, 2s is spherically symmetric with a node.

    const uniforms = {
        time: { value: 0 },
        color1s: { value: new THREE.Color(0xff4488) },
        color2s: { value: new THREE.Color(0x4488ff) }
    };

    const shaderMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: `
            varying vec3 vPosition;
            void main() {
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 color1s;
            uniform vec3 color2s;
            varying vec3 vPosition;
            
            void main() {
                float r = length(vPosition);
                
                // Simulating wave function squared (probability)
                // 1s wave
                float psi1s = exp(-r * 1.5) * 2.0;
                
                // 2s wave (has a node)
                float psi2s = (2.0 - r * 0.8) * exp(-r * 0.4) * 0.5;
                float prob2s = psi2s * psi2s;
                
                float totalProb = psi1s + prob2s;
                
                // Add some quantum fluctuation over time
                float fluc = sin(r * 10.0 - time * 5.0) * 0.05;
                
                vec3 finalColor = mix(color2s, color1s, psi1s / (totalProb + 0.01));
                
                float alpha = (totalProb + fluc) * 0.4;
                if(alpha < 0.01) discard;
                
                gl_FragColor = vec4(finalColor, alpha);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
    });

    // Create a series of nested spheres to act as a volume renderer
    const sphereCount = 40;
    const maxRadius = 6.0;
    for(let i = 1; i <= sphereCount; i++) {
        const radius = (i / sphereCount) * maxRadius;
        const geo = new THREE.SphereGeometry(radius, 32, 32);
        const mesh = new THREE.Mesh(geo, shaderMaterial);
        group.add(mesh);
    }

    const nucleus = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    group.add(nucleus);

    let time = 0;

    return {
        update: () => {
            time += 0.016;
            uniforms.time.value = time;
            group.rotation.y = time * 0.1;
        },
        cleanup: () => {
            shaderMaterial.dispose();
            nucleus.geometry.dispose();
            nucleus.material.dispose();
            group.children.forEach(c => {
                if(c.geometry) c.geometry.dispose();
            });
        }
    };
}