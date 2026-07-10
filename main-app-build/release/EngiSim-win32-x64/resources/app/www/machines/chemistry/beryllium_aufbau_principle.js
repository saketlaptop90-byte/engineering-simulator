import * as THREE from 'three';

export function createBerylliumAufbauPrinciple(scene, renderer, camera) {
    const group = new THREE.Group();

    // Visualizes building up the atom from the nucleus out.
    // Nucleus -> adds 1s shell -> adds 2 electrons -> adds 2s shell -> adds 2 electrons.
    // Done as a continuous 15 second loop.

    // Nucleus
    const nucleus = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0xff0044 })
    );
    group.add(nucleus);

    // Shells
    const s1Geo = new THREE.SphereGeometry(2, 32, 32);
    const s1Mat = new THREE.MeshPhysicalMaterial({ color: 0x00c8ff, transparent: true, opacity: 0, transmission: 0.8, side: THREE.DoubleSide });
    const s1 = new THREE.Mesh(s1Geo, s1Mat);
    group.add(s1);

    const s2Geo = new THREE.SphereGeometry(4, 32, 32);
    const s2Mat = new THREE.MeshPhysicalMaterial({ color: 0xffaa00, transparent: true, opacity: 0, transmission: 0.8, side: THREE.DoubleSide });
    const s2 = new THREE.Mesh(s2Geo, s2Mat);
    group.add(s2);

    // Electrons
    const eGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const eMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    
    const electrons = [
        new THREE.Mesh(eGeo, eMat),
        new THREE.Mesh(eGeo, eMat),
        new THREE.Mesh(eGeo, eMat),
        new THREE.Mesh(eGeo, eMat)
    ];
    electrons.forEach(e => {
        e.visible = false;
        group.add(e);
    });

    const light = new THREE.PointLight(0xffffff, 2, 20);
    group.add(light);
    group.add(new THREE.AmbientLight(0x404040, 2));

    let time = 0;

    return {
        update: () => {
            time += 0.016;
            
            const cycle = (time % 15) / 15; // 15 second cycle

            // Reset visibilities based on cycle
            s1Mat.opacity = 0;
            s2Mat.opacity = 0;
            electrons.forEach(e => e.visible = false);

            if (cycle > 0.1) {
                // Fade in 1s shell
                s1Mat.opacity = Math.min(0.4, (cycle - 0.1) * 2);
            }
            if (cycle > 0.25) {
                electrons[0].visible = true;
                electrons[1].visible = true;
                electrons[0].position.set(Math.cos(time*2)*2, 0, Math.sin(time*2)*2);
                electrons[1].position.set(Math.cos(time*2+Math.PI)*2, 0, Math.sin(time*2+Math.PI)*2);
            }
            if (cycle > 0.5) {
                // Fade in 2s shell
                s2Mat.opacity = Math.min(0.3, (cycle - 0.5) * 2);
            }
            if (cycle > 0.75) {
                electrons[2].visible = true;
                electrons[3].visible = true;
                electrons[2].position.set(0, Math.cos(time*1.5)*4, Math.sin(time*1.5)*4);
                electrons[3].position.set(0, Math.cos(time*1.5+Math.PI)*4, Math.sin(time*1.5+Math.PI)*4);
            }
            
            // Rotate the whole atom structure
            group.rotation.y = time * 0.1;
            group.rotation.z = time * 0.05;
        },
        cleanup: () => {
            nucleus.geometry.dispose(); nucleus.material.dispose();
            s1Geo.dispose(); s1Mat.dispose();
            s2Geo.dispose(); s2Mat.dispose();
            eGeo.dispose(); eMat.dispose();
        }
    };
}