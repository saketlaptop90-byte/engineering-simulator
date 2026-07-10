import * as THREE from 'three';

export function createBerylliumThomsonModel(scene, renderer, camera) {
    const group = new THREE.Group();

    // Plum Pudding Model
    // A positively charged "pudding" sphere containing 4 electrons embedded within.
    // For Beryllium, we have 4 electrons in a +4e sphere.

    const puddingGeo = new THREE.SphereGeometry(4, 64, 64);
    
    // Custom shader to make it look like a gelatinous positive cloud
    const puddingMat = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            color: { value: new THREE.Color(0xffaa88) }
        },
        vertexShader: `
            varying vec3 vNormal;
            varying vec3 vPosition;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 color;
            varying vec3 vNormal;
            varying vec3 vPosition;
            
            // Simplex noise function placeholder (using sin waves for simplicity)
            float noise(vec3 p) {
                return sin(p.x * 2.0 + time) * sin(p.y * 2.0 + time) * sin(p.z * 2.0);
            }
            
            void main() {
                float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
                float n = noise(vPosition);
                vec3 finalColor = color + vec3(n * 0.2);
                gl_FragColor = vec4(finalColor, 0.4 + intensity * 0.5);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
    });

    const pudding = new THREE.Mesh(puddingGeo, puddingMat);
    group.add(pudding);

    // Electrons (Plums)
    const plumGeo = new THREE.SphereGeometry(0.5, 32, 32);
    const plumMat = new THREE.MeshPhongMaterial({
        color: 0x00ffff,
        emissive: 0x004488,
        shininess: 100
    });

    // Arrange 4 electrons in a tetrahedron for equilibrium
    const plums = [];
    const dist = 2.0;
    
    const positions = [
        [dist, dist, dist],
        [-dist, -dist, dist],
        [-dist, dist, -dist],
        [dist, -dist, -dist]
    ];
    
    positions.forEach(pos => {
        const p = new THREE.Mesh(plumGeo, plumMat);
        // Normalize and scale to dist
        const vec = new THREE.Vector3(...pos).normalize().multiplyScalar(dist);
        p.position.copy(vec);
        
        // Add a minus sign symbol
        const minusGeo = new THREE.BoxGeometry(0.8, 0.15, 0.1);
        const minusMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const minus = new THREE.Mesh(minusGeo, minusMat);
        minus.position.z = 0.51; // slightly outside
        p.add(minus);
        
        group.add(p);
        plums.push({ mesh: p, start: vec.clone(), minus });
    });

    const light = new THREE.PointLight(0xffffff, 2, 20);
    light.position.set(5, 5, 5);
    group.add(light);

    let time = 0;

    return {
        update: () => {
            time += 0.016;
            puddingMat.uniforms.time.value = time;

            // Slowly rotate the whole pudding
            group.rotation.y = time * 0.2;
            group.rotation.x = time * 0.1;

            // Electrons vibrate in the "jelly"
            plums.forEach((plum, i) => {
                plum.mesh.position.x = plum.start.x + Math.sin(time * 5 + i) * 0.2;
                plum.mesh.position.y = plum.start.y + Math.cos(time * 6 + i) * 0.2;
                plum.mesh.position.z = plum.start.z + Math.sin(time * 7 + i) * 0.2;
                
                // Make minus sign always face out
                plum.minus.lookAt(plum.mesh.position.clone().multiplyScalar(2));
            });
        },
        cleanup: () => {
            puddingGeo.dispose();
            puddingMat.dispose();
            plumGeo.dispose();
            plumMat.dispose();
        }
    };
}