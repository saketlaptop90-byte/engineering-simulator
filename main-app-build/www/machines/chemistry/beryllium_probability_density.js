import * as THREE from 'three';

export function createBerylliumProbabilityDensity(scene, renderer, camera) {
    const group = new THREE.Group();

    // 3D Heatmap for probability density using instanced meshes (voxels)
    const gridSize = 20;
    const spacing = 0.5;
    const offset = (gridSize * spacing) / 2;

    const geometry = new THREE.BoxGeometry(spacing*0.8, spacing*0.8, spacing*0.8);
    const material = new THREE.MeshBasicMaterial({
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const instancedMesh = new THREE.InstancedMesh(geometry, material, Math.pow(gridSize, 3));
    group.add(instancedMesh);

    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    let idx = 0;

    const baseColor = new THREE.Color(0xff8800);
    const hotColor = new THREE.Color(0xffffff);

    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            for (let z = 0; z < gridSize; z++) {
                const px = (x * spacing) - offset;
                const py = (y * spacing) - offset;
                const pz = (z * spacing) - offset;
                
                const r = Math.sqrt(px*px + py*py + pz*pz);
                
                // Probability function for Be (approx)
                const p1s = Math.exp(-r * 1.5) * 3.0;
                const p2s = Math.pow(2.0 - r*0.8, 2) * Math.exp(-r * 0.4) * 0.5;
                const prob = p1s + p2s;
                
                if (prob > 0.05) {
                    dummy.position.set(px, py, pz);
                    
                    // Scale voxel based on probability
                    const s = Math.min(1.0, prob);
                    dummy.scale.setScalar(s);
                    dummy.updateMatrix();
                    
                    instancedMesh.setMatrixAt(idx, dummy.matrix);
                    
                    // Color mix
                    color.copy(baseColor).lerp(hotColor, Math.min(1.0, prob*0.5));
                    instancedMesh.setColorAt(idx, color);
                    
                    // Store initial data for animation
                    // (We can't easily animate properties per instance in JS every frame for 8000 cubes, 
                    // so we will rotate the whole group and apply a global scale pulse)
                    
                    idx++;
                }
            }
        }
    }
    instancedMesh.count = idx;
    instancedMesh.instanceMatrix.needsUpdate = true;
    if(instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;

    // Center marker
    const nucleus = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    group.add(nucleus);

    let time = 0;

    return {
        update: () => {
            time += 0.016;
            group.rotation.y = time * 0.2;
            group.rotation.x = Math.sin(time * 0.5) * 0.1;
            
            // Pulse effect
            const pulse = 1.0 + Math.sin(time * 4) * 0.02;
            instancedMesh.scale.setScalar(pulse);
        },
        cleanup: () => {
            geometry.dispose();
            material.dispose();
            instancedMesh.dispose();
            nucleus.geometry.dispose();
            nucleus.material.dispose();
        }
    };
}