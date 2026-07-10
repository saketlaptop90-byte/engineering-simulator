import * as THREE from 'three';

export function createBerylliumMetallicBonding(scene, renderer, camera) {
    const group = new THREE.Group();

    // Visualizes the "Sea of Electrons" model for metallic Beryllium.
    // A 3x3x3 grid of Be2+ cations, surrounded by a fluid, moving cloud of delocalized electrons.

    // Be2+ Cations
    const cationGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const cationMat = new THREE.MeshPhongMaterial({ color: 0xff0044, shininess: 100 });
    
    const spacing = 3;
    const offset = spacing; // center at 0
    
    for(let x = -1; x <= 1; x++) {
        for(let y = -1; y <= 1; y++) {
            for(let z = -1; z <= 1; z++) {
                const cation = new THREE.Mesh(cationGeo, cationMat);
                cation.position.set(x * spacing, y * spacing, z * spacing);
                group.add(cation);
            }
        }
    }

    // Delocalized Electrons (Sea)
    const eGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const eMat = new THREE.MeshBasicMaterial({ color: 0x00c8ff });
    
    const electrons = [];
    const numElectrons = 100; // Beryllium provides 2 valence e- per atom
    
    for(let i=0; i<numElectrons; i++) {
        const e = new THREE.Mesh(eGeo, eMat);
        // Random position in the box
        e.position.set(
            (Math.random() - 0.5) * spacing * 3,
            (Math.random() - 0.5) * spacing * 3,
            (Math.random() - 0.5) * spacing * 3
        );
        group.add(e);
        electrons.push({
            mesh: e,
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.1
            )
        });
    }

    // Semi-transparent box showing the metal volume
    const boxGeo = new THREE.BoxGeometry(spacing*3 + 1, spacing*3 + 1, spacing*3 + 1);
    const boxMat = new THREE.MeshBasicMaterial({ color: 0x00c8ff, wireframe: true, transparent: true, opacity: 0.1 });
    const box = new THREE.Mesh(boxGeo, boxMat);
    group.add(box);

    const light = new THREE.PointLight(0xffffff, 2, 20);
    group.add(light);
    group.add(new THREE.AmbientLight(0x404040, 2));

    let time = 0;

    return {
        update: () => {
            time += 0.016;

            // Rotate the whole crystal structure
            group.rotation.y = time * 0.1;
            group.rotation.x = Math.sin(time*0.2) * 0.1;

            // Move electrons like a fluid (random walk + bounce off walls)
            const bounds = (spacing * 3 + 1) / 2;
            
            electrons.forEach(e => {
                e.mesh.position.add(e.velocity);
                
                // Add slight wobble
                e.velocity.x += (Math.random() - 0.5) * 0.02;
                e.velocity.y += (Math.random() - 0.5) * 0.02;
                e.velocity.z += (Math.random() - 0.5) * 0.02;
                e.velocity.clampLength(0, 0.15); // speed limit

                // Bounce off walls
                if (Math.abs(e.mesh.position.x) > bounds) { e.velocity.x *= -1; e.mesh.position.x = Math.sign(e.mesh.position.x)*bounds; }
                if (Math.abs(e.mesh.position.y) > bounds) { e.velocity.y *= -1; e.mesh.position.y = Math.sign(e.mesh.position.y)*bounds; }
                if (Math.abs(e.mesh.position.z) > bounds) { e.velocity.z *= -1; e.mesh.position.z = Math.sign(e.mesh.position.z)*bounds; }
            });
        },
        cleanup: () => {
            cationGeo.dispose(); cationMat.dispose();
            eGeo.dispose(); eMat.dispose();
            boxGeo.dispose(); boxMat.dispose();
        }
    };
}