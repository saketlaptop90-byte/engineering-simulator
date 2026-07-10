import * as THREE from 'three';

export function createBerylliumPOrbitals(scene, renderer, camera) {
    const group = new THREE.Group();

    // Beryllium has empty 2p orbitals natively. We will render them as "hollow" or wireframe blueprints
    // to show where they *would* be.

    // A p-orbital is typically a dumbbell shape. We'll use two spheres pushed apart for a simple approximation,
    // or deformed spheres.

    const createLobe = (color, offset, axis) => {
        const geo = new THREE.SphereGeometry(1.5, 32, 32);
        // Deform into teardrop/lobe
        const positions = geo.attributes.position.array;
        for(let i=0; i<positions.length; i+=3) {
            // Stretch along Y mostly
            const y = positions[i+1];
            if (y < 0) {
                // flatten the bottom near origin
                positions[i] *= (1.5 + y/1.5);
                positions[i+2] *= (1.5 + y/1.5);
            } else {
                positions[i+1] *= 1.5; // stretch top
            }
        }
        geo.computeVertexNormals();

        // Wireframe holographic material
        const mat = new THREE.MeshBasicMaterial({
            color: color,
            wireframe: true,
            transparent: true,
            opacity: 0.15,
            blending: THREE.AdditiveBlending
        });

        const mesh = new THREE.Mesh(geo, mat);
        
        // Position lobe
        mesh.position.copy(offset);
        
        // Orient lobe
        if (axis === 'x') mesh.rotation.z = -Math.PI / 2 * Math.sign(offset.x);
        if (axis === 'z') mesh.rotation.x = Math.PI / 2 * Math.sign(offset.z);
        if (axis === 'y') {
            if (offset.y < 0) mesh.rotation.x = Math.PI;
        }

        return mesh;
    };

    // 2px (Red)
    group.add(createLobe(0xff0044, new THREE.Vector3(2,0,0), 'x'));
    group.add(createLobe(0xff0044, new THREE.Vector3(-2,0,0), 'x'));

    // 2py (Green)
    group.add(createLobe(0x00ff44, new THREE.Vector3(0,2,0), 'y'));
    group.add(createLobe(0x00ff44, new THREE.Vector3(0,-2,0), 'y'));

    // 2pz (Blue)
    group.add(createLobe(0x0044ff, new THREE.Vector3(0,0,2), 'z'));
    group.add(createLobe(0x0044ff, new THREE.Vector3(0,0,-2), 'z'));

    // Nucleus
    const nucleus = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    group.add(nucleus);
    
    // Filled 2s orbital inside, for context
    const s2 = new THREE.Mesh(
        new THREE.SphereGeometry(1.2, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0x444444, transparent: true, opacity: 0.5 })
    );
    group.add(s2);

    let time = 0;

    return {
        update: () => {
            time += 0.016;

            // Slowly rotate the entire orbital set
            group.rotation.y = time * 0.2;
            group.rotation.x = time * 0.1;
            
            // Pulse the empty p-orbitals
            group.children.forEach(c => {
                if (c.material && c.material.wireframe) {
                    c.material.opacity = 0.1 + Math.sin(time * 3)*0.05;
                }
            });
        },
        cleanup: () => {
            group.children.forEach(c => {
                if(c.geometry) c.geometry.dispose();
                if(c.material) c.material.dispose();
            });
        }
    };
}