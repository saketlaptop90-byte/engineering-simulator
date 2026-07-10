export function createVortexShedding(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Cylinder obstacle
    const cylinderGeo = new THREE.CylinderGeometry(1, 1, 4, 32);
    const cylinderMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const cylinder = new THREE.Mesh(cylinderGeo, cylinderMat);
    group.add(cylinder);

    // Flow particles
    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    // Custom shader for vortex shedding motion
    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 }
        },
        vertexShader: `
            uniform float time;
            void main() {
                vec3 pos = position;
                // Move particles along X axis
                pos.x += time * 2.0;
                pos.x = mod(pos.x + 10.0, 20.0) - 10.0;
                
                // Vortex street approximation
                if (pos.x > 0.0) {
                    float vortex = sin(pos.x * 2.0 - time * 5.0) * exp(-pos.x * 0.1);
                    pos.z += vortex * 0.5 * sign(pos.z + 0.01);
                } else if (abs(pos.z) < 1.0) {
                    pos.z += sign(pos.z) * 1.5; // Avoid cylinder
                }
                
                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_PointSize = 4.0 * (10.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            void main() {
                float r = distance(gl_PointCoord, vec2(0.5));
                if (r > 0.5) discard;
                gl_FragColor = vec4(0.2, 0.6, 1.0, 0.8);
            }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    group.add(particles);

    // Provide an animation clip to update the 'time' uniform by animating a dummy object
    const dummy = new THREE.Object3D();
    const track = new THREE.NumberKeyframeTrack('.position[x]', [0, 10], [0, 10]);
    const clip = new THREE.AnimationClip('VortexSheddingAnim', 10, [track]);
    animationClips.push(clip);

    group.userData.update = (dt) => {
        material.uniforms.time.value += dt;
    };

    return { group, animationClips };
}
