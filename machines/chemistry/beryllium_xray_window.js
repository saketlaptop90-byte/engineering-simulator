import * as THREE from 'three';

export function createBerylliumXRayWindow(scene, renderer, camera) {
    const group = new THREE.Group();

    // X-ray source casing
    const tubeGeo = new THREE.CylinderGeometry(1.5, 1.5, 5, 32);
    tubeGeo.rotateZ(Math.PI / 2);
    const tubeMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.2 });
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    tube.position.set(-6, 0, 0);
    group.add(tube);

    // Be Window
    const windowGeo = new THREE.CylinderGeometry(1, 1, 0.1, 32);
    windowGeo.rotateZ(Math.PI / 2);
    const windowMat = new THREE.MeshPhysicalMaterial({ 
        color: 0xaaccff, 
        metalness: 0.8, 
        roughness: 0.1,
        transparent: true,
        opacity: 0.6,
        clearcoat: 1.0
    });
    const beWindow = new THREE.Mesh(windowGeo, windowMat);
    beWindow.position.set(-3.5, 0, 0);
    group.add(beWindow);

    // Particles (X-Rays)
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const opacities = new Float32Array(particleCount);
    
    for(let i=0; i<particleCount; i++) {
        positions[i*3] = -5 + Math.random() * 10;
        positions[i*3+1] = (Math.random() - 0.5) * 1.5;
        positions[i*3+2] = (Math.random() - 0.5) * 1.5;
        opacities[i] = Math.random();
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));
    
    const material = new THREE.ShaderMaterial({
        uniforms: {
            color: { value: new THREE.Color(0x00ffff) },
            time: { value: 0 }
        },
        vertexShader: `
            attribute float opacity;
            varying float vOpacity;
            void main() {
                vOpacity = opacity;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = 4.0 * (10.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform vec3 color;
            varying float vOpacity;
            void main() {
                float dist = length(gl_PointCoord - vec2(0.5));
                if (dist > 0.5) discard;
                gl_FragColor = vec4(color, vOpacity * (1.0 - dist * 2.0));
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    const points = new THREE.Points(geometry, material);
    group.add(points);

    // Target object
    const targetGeo = new THREE.BoxGeometry(2, 4, 4);
    const targetMat = new THREE.MeshStandardMaterial({ color: 0x55ff55, wireframe: true });
    const target = new THREE.Mesh(targetGeo, targetMat);
    target.position.set(4, 0, 0);
    group.add(target);

    return {
        group,
        update: () => {
            const positions = points.geometry.attributes.position.array;
            for(let i=0; i<particleCount; i++) {
                positions[i*3] += 0.2; // Move right
                if (positions[i*3] > 4) {
                    positions[i*3] = -5;
                    positions[i*3+1] = (Math.random() - 0.5) * 1.5;
                    positions[i*3+2] = (Math.random() - 0.5) * 1.5;
                }
            }
            points.geometry.attributes.position.needsUpdate = true;
            points.rotation.x += 0.001;
        }
    };
}
