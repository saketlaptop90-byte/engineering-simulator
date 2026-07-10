import * as THREE from 'three';

export function createBerylliumCoordinateBonding(scene, renderer, camera) {
    const group = new THREE.Group();

    // Visualizes a coordinate (dative) bond.
    // BeCl2 is electron deficient (only 4 valence electrons). It accepts lone pairs from another Cl 
    // to form a polymer chain (solid BeCl2) via coordinate bonds.
    // We'll show a Cl atom donating BOTH electrons to an empty orbital on Be.

    // Be Atom (Acceptor)
    const beGeo = new THREE.SphereGeometry(2, 32, 32);
    const beMat = new THREE.MeshPhysicalMaterial({ color: 0x00c8ff, transparent: true, opacity: 0.5, transmission: 0.8 });
    const be = new THREE.Mesh(beGeo, beMat);
    be.position.set(-3, 0, 0);
    group.add(be);
    
    // Empty sp3 orbital on Be
    const emptyOrb = new THREE.Mesh(
        new THREE.SphereGeometry(1.5, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.3 })
    );
    emptyOrb.position.set(1.5, 0, 0); // pointing towards Cl
    be.add(emptyOrb);

    // Cl Atom (Donor)
    const clGeo = new THREE.SphereGeometry(2.5, 32, 32);
    const clMat = new THREE.MeshPhysicalMaterial({ color: 0x00ff44, transparent: true, opacity: 0.5, transmission: 0.8 });
    const cl = new THREE.Mesh(clGeo, clMat);
    cl.position.set(3, 0, 0);
    group.add(cl);

    // Lone pair on Cl
    const eGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const eMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const pair = new THREE.Group();
    const e1 = new THREE.Mesh(eGeo, eMat); e1.position.set(0, 0.4, 0);
    const e2 = new THREE.Mesh(eGeo, eMat); e2.position.set(0, -0.4, 0);
    pair.add(e1); pair.add(e2);
    group.add(pair);

    // Arrow showing donation
    const arrow = new THREE.ArrowHelper(new THREE.Vector3(-1,0,0), new THREE.Vector3(1,0,0), 3, 0xff0044, 0.5, 0.3);
    group.add(arrow);

    const light = new THREE.PointLight(0xffffff, 2, 20);
    group.add(light);
    group.add(new THREE.AmbientLight(0x404040, 2));

    let time = 0;

    return {
        update: () => {
            time += 0.016;

            const cycle = (time % 4) / 4; // 4 second loop
            
            // Animation: Lone pair moves from Cl into the empty orbital of Be
            if (cycle < 0.2) {
                // Wait at Cl
                pair.position.set(1.5, 0, 0); // Just outside Cl
                arrow.setLength(0.1, 0.1, 0.1); // hidden
            } else if (cycle < 0.8) {
                // Transfer
                const t = (cycle - 0.2) / 0.6;
                pair.position.set(1.5 - (3.0 * t), 0, 0); // Move left
                
                // Grow arrow
                arrow.position.set(1.5, 0, 0);
                arrow.setLength(Math.max(0.1, 3.0 * t), 0.5, 0.3);
                
                // Pulse empty orbital as it receives electrons
                emptyOrb.material.color.setHex(0xffff00);
                emptyOrb.material.opacity = 0.3 + 0.5 * t;
            } else {
                // Wait at Be
                pair.position.set(-1.5, 0, 0); // Inside Be's empty orbital
                emptyOrb.material.color.setHex(0xffff00);
                emptyOrb.material.opacity = 0.8;
            }

            // Spin the pair
            pair.rotation.x = time * 5;
            
            group.rotation.y = Math.sin(time*0.5)*0.2;
        },
        cleanup: () => {
            beGeo.dispose(); beMat.dispose();
            emptyOrb.geometry.dispose(); emptyOrb.material.dispose();
            clGeo.dispose(); clMat.dispose();
            eGeo.dispose(); eMat.dispose();
            arrow.line.geometry.dispose(); arrow.cone.geometry.dispose();
        }
    };
}