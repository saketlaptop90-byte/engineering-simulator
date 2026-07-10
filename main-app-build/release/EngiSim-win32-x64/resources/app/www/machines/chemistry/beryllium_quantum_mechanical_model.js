import * as THREE from 'three';

export function createBerylliumQuantumMechanicalModel(scene, renderer, camera) {
    const group = new THREE.Group();

    // Beryllium (Z=4): 1s2 2s2 orbital probability clouds
    // 1s is a small dense sphere
    // 2s is a larger, less dense sphere with a radial node

    const particleCount = 20000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const c1s = new THREE.Color(0xff3366); // 1s orbital color
    const c2s = new THREE.Color(0x33ccff); // 2s orbital color

    for (let i = 0; i < particleCount; i++) {
        // Random spherical coordinates
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        // Probability distribution (approximation)
        // Beryllium 1s
        let r, col;
        if (i < particleCount * 0.4) {
            // 1s is tight to nucleus
            r = Math.abs(randomGaussian(0, 1.0));
            col = c1s;
        } else {
            // 2s has a node. Let's approximate two peaks.
            if (Math.random() > 0.8) {
                // Inner 2s lobe
                r = Math.abs(randomGaussian(1.5, 0.5));
            } else {
                // Outer 2s lobe
                r = Math.abs(randomGaussian(4.5, 1.5));
            }
            col = c2s;
        }
        
        positions[i*3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i*3+2] = r * Math.cos(phi);
        
        colors[i*3] = col.r;
        colors[i*3+1] = col.g;
        colors[i*3+2] = col.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const cloud = new THREE.Points(geometry, material);
    group.add(cloud);

    // Nucleus
    const nucleus = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    group.add(nucleus);

    let time = 0;

    // Helper for gaussian distribution
    function randomGaussian(mean, stdev) {
        let u = 1 - Math.random(); // Converting [0,1) to (0,1]
        let v = Math.random();
        let z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
        return z * stdev + mean;
    }

    return {
        update: () => {
            time += 0.01;
            
            // Quantum fluctuations - slightly scale and rotate
            cloud.rotation.y = time * 0.1;
            cloud.rotation.x = Math.sin(time * 0.2) * 0.1;
            
            cloud.scale.setScalar(1 + Math.sin(time * 5) * 0.02);
        },
        cleanup: () => {
            geometry.dispose();
            material.dispose();
            nucleus.geometry.dispose();
            nucleus.material.dispose();
        }
    };
}