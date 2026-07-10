export function createLaminarTurbulentPipe(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Pipe exterior (transparent)
    const pipeGeo = new THREE.CylinderGeometry(2, 2, 20, 32, 1, true);
    pipeGeo.rotateZ(Math.PI / 2);
    const pipeMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.2,
        roughness: 0.1,
        transmission: 0.9,
        side: THREE.DoubleSide
    });
    const pipe = new THREE.Mesh(pipeGeo, pipeMat);
    group.add(pipe);

    // Particles representing fluid
    const particleCount = 3000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20; // x from -10 to 10
        const r = Math.random() * 1.8;
        const theta = Math.random() * Math.PI * 2;
        positions[i * 3 + 1] = r * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(theta);
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 }
        },
        vertexShader: `
            uniform float time;
            varying vec3 vColor;
            void main() {
                vec3 pos = position;
                
                // Base flow velocity profile (parabolic for laminar, flatter for turbulent)
                float r = sqrt(pos.y * pos.y + pos.z * pos.z);
                
                // Transition point at x = 0
                float isTurbulent = smoothstep(-2.0, 2.0, pos.x);
                
                float laminarV = 1.0 - (r / 2.0)*(r / 2.0); // Parabolic
                float turbulentV = pow(1.0 - (r / 2.0), 1.0/7.0); // 1/7th power law
                
                float velocity = mix(laminarV, turbulentV, isTurbulent) * 5.0;
                
                pos.x += velocity * time;
                pos.x = mod(pos.x + 10.0, 20.0) - 10.0;
                
                // Add chaotic motion in turbulent region
                if (pos.x > 0.0) {
                    float noiseY = sin(pos.x * 10.0 + time * 5.0) * 0.5 * isTurbulent;
                    float noiseZ = cos(pos.x * 12.0 + time * 4.0) * 0.5 * isTurbulent;
                    pos.y += noiseY;
                    pos.z += noiseZ;
                    
                    // Keep inside pipe
                    float newR = sqrt(pos.y * pos.y + pos.z * pos.z);
                    if (newR > 1.9) {
                        pos.y *= 1.9 / newR;
                        pos.z *= 1.9 / newR;
                    }
                }
                
                // Color based on turbulence
                vColor = mix(vec3(0.0, 0.5, 1.0), vec3(1.0, 0.2, 0.0), isTurbulent);
                
                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_PointSize = 3.0 * (10.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            void main() {
                float dist = distance(gl_PointCoord, vec2(0.5));
                if (dist > 0.5) discard;
                gl_FragColor = vec4(vColor, 0.8);
            }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    group.add(particles);

    const dummy = new THREE.Object3D();
    const track = new THREE.NumberKeyframeTrack('.position[x]', [0, 10], [0, 10]);
    const clip = new THREE.AnimationClip('PipeAnim', 10, [track]);
    animationClips.push(clip);

    group.userData.update = (dt) => {
        material.uniforms.time.value += dt * 0.5;
    };

    return { group, animationClips };
}
