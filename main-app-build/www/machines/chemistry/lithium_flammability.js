import * as THREE from 'three';

export function createLithiumFlammability(scene, renderer, camera) {
    const group = new THREE.Group();

    // Lithium burns with a brilliant crimson/red flame.
    
    // The burning chunk
    const liGeo = new THREE.DodecahedronGeometry(2, 1);
    const liMat = new THREE.MeshStandardMaterial({
        color: 0x333333,
        emissive: 0xff0033, // red glow
        emissiveIntensity: 0.5,
        roughness: 0.8,
        metalness: 0.2
    });
    const chunk = new THREE.Mesh(liGeo, liMat);
    group.add(chunk);
    
    // Add glowing cracks
    const wireGeo = new THREE.WireframeGeometry(liGeo);
    const wireMat = new THREE.LineBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.8
    });
    const cracks = new THREE.LineSegments(wireGeo, wireMat);
    chunk.add(cracks);

    // Crimson Flame Particle System
    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];
    const lifetimes = [];
    const colors = new Float32Array(particleCount * 3);
    
    const colorStart = new THREE.Color(0xffffff); // white hot core
    const colorMid = new THREE.Color(0xff0033);   // crimson signature
    const colorEnd = new THREE.Color(0x330000);   // dark smoke

    for (let i = 0; i < particleCount; i++) {
        positions[i*3] = (Math.random() - 0.5) * 2;
        positions[i*3+1] = (Math.random() - 0.5) * 2;
        positions[i*3+2] = (Math.random() - 0.5) * 2;
        
        velocities.push({
            x: (Math.random() - 0.5) * 0.05,
            y: Math.random() * 0.15 + 0.05,
            z: (Math.random() - 0.5) * 0.05
        });
        
        lifetimes.push(Math.random()); // 0 to 1
        
        colors[i*3] = 1;
        colors[i*3+1] = 0;
        colors[i*3+2] = 0;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Create a custom shader material for the fire
    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            pointTexture: { value: createCircleTexture() }
        },
        vertexShader: `
            attribute vec3 color;
            varying vec3 vColor;
            void main() {
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                // Make particles smaller as they go up (simulated by distance from origin y=0)
                float size = 400.0 / -mvPosition.z;
                gl_PointSize = size * max(0.1, (5.0 - position.y)/5.0); 
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform sampler2D pointTexture;
            varying vec3 vColor;
            void main() {
                gl_FragColor = vec4(vColor, 1.0);
                gl_FragColor = gl_FragColor * texture2D(pointTexture, gl_PointCoord);
            }
        `,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true
    });

    const fire = new THREE.Points(geometry, material);
    group.add(fire);
    
    // Intense point light from the fire
    const fireLight = new THREE.PointLight(0xff0033, 5, 20);
    group.add(fireLight);
    
    // Ambient light
    group.add(new THREE.AmbientLight(0x222222));

    let time = 0;

    function createCircleTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
        gradient.addColorStop(0.5, 'rgba(255,0,51,0.2)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 32, 32);
        return new THREE.CanvasTexture(canvas);
    }

    return {
        update: () => {
            time += 0.016;
            material.uniforms.time.value = time;
            
            // Rotate chunk slowly
            chunk.rotation.y = time * 0.5;
            chunk.rotation.x = time * 0.3;
            
            // Pulse emissive
            liMat.emissiveIntensity = 0.5 + Math.sin(time * 10) * 0.3;
            fireLight.intensity = 3 + Math.sin(time * 15) * 1;
            
            // Animate particles
            const pos = geometry.attributes.position.array;
            const col = geometry.attributes.color.array;
            
            for (let i = 0; i < particleCount; i++) {
                lifetimes[i] += 0.02;
                
                if (lifetimes[i] >= 1.0) {
                    // Respawn at base
                    lifetimes[i] = 0;
                    pos[i*3] = (Math.random() - 0.5) * 3;
                    pos[i*3+1] = (Math.random() - 0.5) * 2;
                    pos[i*3+2] = (Math.random() - 0.5) * 3;
                }
                
                // Move
                pos[i*3] += velocities[i].x + Math.sin(time*2 + i)*0.01; // sway
                pos[i*3+1] += velocities[i].y;
                pos[i*3+2] += velocities[i].z + Math.cos(time*2 + i)*0.01;
                
                // Update color based on lifetime (white -> crimson -> dark)
                const t = lifetimes[i];
                let currentColor;
                if (t < 0.2) {
                    currentColor = colorStart.clone().lerp(colorMid, t / 0.2);
                } else {
                    currentColor = colorMid.clone().lerp(colorEnd, (t - 0.2) / 0.8);
                }
                
                col[i*3] = currentColor.r;
                col[i*3+1] = currentColor.g;
                col[i*3+2] = currentColor.b;
            }
            
            geometry.attributes.position.needsUpdate = true;
            geometry.attributes.color.needsUpdate = true;
        },
        cleanup: () => {
            liGeo.dispose();
            liMat.dispose();
            wireGeo.dispose();
            wireMat.dispose();
            geometry.dispose();
            material.uniforms.pointTexture.value.dispose();
            material.dispose();
        }
    };
}