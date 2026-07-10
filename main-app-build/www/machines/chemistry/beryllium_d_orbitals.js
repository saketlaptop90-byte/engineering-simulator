import * as THREE from 'three';

export function createBerylliumDOrbitals(scene, renderer, camera) {
    const group = new THREE.Group();

    // Beryllium has absolutely no native d-orbitals (they start at n=3).
    // We will visualize them as highly abstract, faint mathematical constructs (cloverleaf shapes)
    // to represent the "empty accessible states" high up in energy.

    const createClover = (color, plane) => {
        const cloverGroup = new THREE.Group();
        
        // 4 lobes
        const offsets = [
            new THREE.Vector3(2, 2, 0),
            new THREE.Vector3(-2, 2, 0),
            new THREE.Vector3(-2, -2, 0),
            new THREE.Vector3(2, -2, 0)
        ];
        
        const geo = new THREE.SphereGeometry(1, 16, 16);
        // Stretch lobe
        const pos = geo.attributes.position.array;
        for(let i=0; i<pos.length; i+=3) {
            pos[i] *= 0.5; // narrow
            pos[i+1] *= 1.5; // long
            pos[i+2] *= 0.5; // narrow
        }
        geo.computeVertexNormals();
        
        const mat = new THREE.MeshBasicMaterial({
            color: color,
            wireframe: true,
            transparent: true,
            opacity: 0.05,
            blending: THREE.AdditiveBlending
        });

        offsets.forEach((off, i) => {
            const lobe = new THREE.Mesh(geo, mat);
            lobe.position.copy(off);
            // Point towards center
            lobe.lookAt(0,0,0);
            lobe.rotateX(Math.PI / 2);
            cloverGroup.add(lobe);
        });

        if (plane === 'xy') {
            // default
        } else if (plane === 'xz') {
            cloverGroup.rotation.x = Math.PI / 2;
        } else if (plane === 'yz') {
            cloverGroup.rotation.y = Math.PI / 2;
        }

        return cloverGroup;
    };

    // d_xy, d_xz, d_yz (cloverleafs)
    group.add(createClover(0xffaa00, 'xy'));
    group.add(createClover(0x00ffaa, 'xz'));
    group.add(createClover(0xaa00ff, 'yz'));

    // d_z2 (donut + dumbbell)
    const dz2Group = new THREE.Group();
    const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.05 });
    
    const dumbbell = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 6, 16), mat);
    // Pinch ends
    const pos = dumbbell.geometry.attributes.position.array;
    for(let i=0; i<pos.length; i+=3) {
        const y = Math.abs(pos[i+1]);
        const scale = 1.0 - (y / 3.0);
        pos[i] *= scale;
        pos[i+2] *= scale;
    }
    dumbbell.geometry.computeVertexNormals();
    dz2Group.add(dumbbell);

    const donut = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.4, 16, 32), mat);
    donut.rotation.x = Math.PI / 2;
    dz2Group.add(donut);
    
    group.add(dz2Group);

    // Nucleus
    const nucleus = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    group.add(nucleus);

    let time = 0;

    return {
        update: () => {
            time += 0.016;

            // Slowly rotate the entire abstract construct
            group.rotation.y = time * 0.1;
            group.rotation.x = time * 0.05;
            group.rotation.z = time * 0.08;
            
            // Ghostly pulse
            group.traverse(child => {
                if(child.isMesh && child.material.wireframe) {
                    child.material.opacity = 0.02 + Math.sin(time*2)*0.03;
                }
            });
        },
        cleanup: () => {
            group.traverse(child => {
                if(child.isMesh) {
                    child.geometry.dispose();
                    child.material.dispose();
                }
            });
        }
    };
}