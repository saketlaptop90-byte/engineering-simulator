import * as THREE from 'three';

export function createBerylliumHybridization(scene, renderer, camera) {
    const group = new THREE.Group();

    // Visualizes Beryllium sp hybridization
    // Shows the 2s and 2p_x orbitals morphing into two sp hybrid orbitals over time.

    // s orbital (spherical)
    const sGeo = new THREE.SphereGeometry(1.5, 32, 32);
    // p orbital (dumbbell)
    const pGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const pos = pGeo.attributes.position.array;
    for(let i=0; i<pos.length; i+=3) {
        if(pos[i] < 0) {
            pos[i] *= 1.5;
            pos[i+1] *= 0.6;
            pos[i+2] *= 0.6;
        } else {
            pos[i] *= 1.5;
            pos[i+1] *= 0.6;
            pos[i+2] *= 0.6;
        }
    }
    pGeo.computeVertexNormals();

    // sp hybrid orbital (large lobe front, small lobe back)
    const spGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const spPos = spGeo.attributes.position.array;
    for(let i=0; i<spPos.length; i+=3) {
        if(spPos[i] < 0) {
            spPos[i] *= 0.5;
            spPos[i+1] *= 0.5;
            spPos[i+2] *= 0.5;
        } else {
            spPos[i] *= 2.0;
        }
    }
    spGeo.computeVertexNormals();

    const mat1 = new THREE.MeshPhysicalMaterial({ color: 0x00c8ff, transparent: true, opacity: 0.6, transmission: 0.5 });
    const mat2 = new THREE.MeshPhysicalMaterial({ color: 0xff0044, transparent: true, opacity: 0.6, transmission: 0.5 });

    const mesh1 = new THREE.Mesh(sGeo, mat1);
    const mesh2 = new THREE.Mesh(pGeo, mat2);
    
    group.add(mesh1);
    group.add(mesh2);

    // Nucleus
    const nucleus = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    group.add(nucleus);

    const light = new THREE.PointLight(0xffffff, 2, 20);
    group.add(light);
    group.add(new THREE.AmbientLight(0x404040, 2));

    let time = 0;
    let state = 0; // 0 = unhybridized, 1 = hybridizing, 2 = hybridized, 3 = unhybridizing

    return {
        update: () => {
            time += 0.016;

            // Animation cycle
            const cycle = (time % 8) / 8; // 8 second cycle
            
            let morphTarget = 0; // 0 for pure, 1 for hybrid
            
            if (cycle < 0.2) {
                // Pause at pure s & p
                morphTarget = 0;
            } else if (cycle < 0.4) {
                // Morphing to sp
                morphTarget = (cycle - 0.2) / 0.2;
            } else if (cycle < 0.7) {
                // Pause at sp hybrid
                morphTarget = 1;
            } else if (cycle < 0.9) {
                // Morphing back
                morphTarget = 1.0 - ((cycle - 0.7) / 0.2);
            } else {
                morphTarget = 0;
            }

            // We interpolate the geometry manually for a smooth morph
            // Since all three geometries are SphereGeometry(1.5, 32, 32), they share the same vertex count
            
            const arr1 = mesh1.geometry.attributes.position.array;
            const arr2 = mesh2.geometry.attributes.position.array;
            const srcS = sGeo.attributes.position.array;
            const srcP = pGeo.attributes.position.array;
            const srcSP = spGeo.attributes.position.array;

            for(let i = 0; i < arr1.length; i+=3) {
                // Mesh 1: s -> sp (facing right)
                arr1[i] = srcS[i] * (1 - morphTarget) + srcSP[i] * morphTarget;
                arr1[i+1] = srcS[i+1] * (1 - morphTarget) + srcSP[i+1] * morphTarget;
                arr1[i+2] = srcS[i+2] * (1 - morphTarget) + srcSP[i+2] * morphTarget;

                // Mesh 2: p -> sp (facing left)
                // Note: to face left, we negate the X axis of the sp geometry
                arr2[i] = srcP[i] * (1 - morphTarget) + (-srcSP[i]) * morphTarget;
                arr2[i+1] = srcP[i+1] * (1 - morphTarget) + srcSP[i+1] * morphTarget;
                arr2[i+2] = srcP[i+2] * (1 - morphTarget) + srcSP[i+2] * morphTarget;
            }

            mesh1.geometry.attributes.position.needsUpdate = true;
            mesh1.geometry.computeVertexNormals();
            
            mesh2.geometry.attributes.position.needsUpdate = true;
            mesh2.geometry.computeVertexNormals();

            // Gently rotate scene
            group.rotation.y = time * 0.3;
            group.rotation.x = Math.sin(time*0.5)*0.1;
        },
        cleanup: () => {
            sGeo.dispose(); pGeo.dispose(); spGeo.dispose();
            mesh1.geometry.dispose(); mesh2.geometry.dispose();
            mat1.dispose(); mat2.dispose();
            nucleus.geometry.dispose(); nucleus.material.dispose();
        }
    };
}