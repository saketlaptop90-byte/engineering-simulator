import * as THREE from 'three';

export function createMachine() {
    const group = new THREE.Group();

    // --- Materials ---
    const naCoreMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.5, roughness: 0.5 }); // Sodium (Metal)
    const clCoreMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, metalness: 0.2, roughness: 0.8 }); // Chlorine (Gas/Nonmetal)
    const shellMat = new THREE.MeshBasicMaterial({ color: 0x444444, wireframe: true, transparent: true, opacity: 0.3 });
    const electronMat = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // Yellow electrons for visibility
    const valenceElectronMat = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red for the transferring electron

    // --- 1. Sodium (Na) Atom ---
    const naAtom = new THREE.Group();
    naAtom.position.set(-4, 0, 0);
    
    const naCore = new THREE.Mesh(new THREE.SphereGeometry(0.8, 16, 16), naCoreMat);
    naCore.userData = { id: 'na_nucleus', name: 'Sodium Nucleus (11 Protons)', description: 'Has one weakly bound valence electron.' };
    naAtom.add(naCore);

    // Na Shells (n=1, n=2, n=3)
    const naShells = [1.2, 1.8, 2.5];
    naShells.forEach(r => {
        naAtom.add(new THREE.Mesh(new THREE.SphereGeometry(r, 16, 16), shellMat));
    });

    // Populate Na inner electrons (2 in n=1, 8 in n=2)
    for(let i=0; i<10; i++){
        const r = i < 2 ? naShells[0] : naShells[1];
        const e = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), electronMat);
        const theta = (i / (i<2?2:8)) * Math.PI * 2;
        e.position.set(Math.cos(theta)*r, Math.sin(theta)*r, 0);
        naAtom.add(e);
    }
    
    // The Na Valence Electron
    const naValence = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), valenceElectronMat);
    naValence.position.set(naShells[2], 0, 0);
    naValence.userData = { id: 'valence_electron', name: 'Valence Electron', description: 'This electron will be donated to Chlorine to achieve a stable octet.' };
    naAtom.add(naValence);
    
    group.add(naAtom);

    // --- 2. Chlorine (Cl) Atom ---
    const clAtom = new THREE.Group();
    clAtom.position.set(4, 0, 0);
    
    const clCore = new THREE.Mesh(new THREE.SphereGeometry(0.9, 16, 16), clCoreMat);
    clCore.userData = { id: 'cl_nucleus', name: 'Chlorine Nucleus (17 Protons)', description: 'Highly electronegative, it wants to gain one electron to complete its octet.' };
    clAtom.add(clCore);

    // Cl Shells (n=1, n=2, n=3)
    const clShells = [1.3, 2.0, 2.8];
    clShells.forEach(r => {
        clAtom.add(new THREE.Mesh(new THREE.SphereGeometry(r, 16, 16), shellMat));
    });

    // Populate Cl inner electrons (2 in n=1, 8 in n=2, 7 in n=3)
    let clElectronCount = 0;
    for(let shellIdx = 0; shellIdx < 3; shellIdx++){
        const r = clShells[shellIdx];
        const maxE = shellIdx === 0 ? 2 : (shellIdx === 1 ? 8 : 7);
        for(let i=0; i<maxE; i++){
            const e = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), electronMat);
            const theta = (i / maxE) * Math.PI * 2;
            e.position.set(Math.cos(theta)*r, Math.sin(theta)*r, 0);
            clAtom.add(e);
            clElectronCount++;
        }
    }
    group.add(clAtom);

    // --- 3. Electrostatic Force Field (Invisible initially) ---
    const fieldGeo = new THREE.CylinderGeometry(0.5, 0.5, 8, 16);
    const fieldMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending, depthWrite: false });
    const field = new THREE.Mesh(fieldGeo, fieldMat);
    field.rotation.z = Math.PI / 2;
    field.userData = { id: 'ionic_bond', name: 'Ionic Bond (Electrostatic Attraction)', description: 'The positive Na+ ion and negative Cl- ion attract each other strongly.' };
    group.add(field);

    // --- 4. Animation Sequence (The Reaction) ---
    let time = 0;
    let phase = 0; // 0: Idle, 1: Transfer, 2: Attraction, 3: Bonded

    group.userData.animate = function(delta) {
        time += delta;

        // Spin the atoms slightly
        naAtom.rotation.y += delta * 0.5;
        naAtom.rotation.x += delta * 0.2;
        clAtom.rotation.y -= delta * 0.3;
        clAtom.rotation.z += delta * 0.1;

        if (phase === 0) {
            // Wait a few seconds before reacting
            if (time > 2.0) {
                phase = 1;
                // Detach valence electron from Na and move it to world space for the transfer
                group.attach(naValence);
            }
        } else if (phase === 1) {
            // Electron transfers from Na to Cl
            const targetPos = new THREE.Vector3();
            // Calculate a spot on Cl's outer shell
            clAtom.getWorldPosition(targetPos);
            targetPos.x -= clShells[2]; // attach to the left side of Cl shell
            
            naValence.position.lerp(targetPos, delta * 3);
            
            if (naValence.position.distanceTo(targetPos) < 0.2) {
                phase = 2;
                // Attach to Cl
                clAtom.attach(naValence);
                // Now they are ions: Na+ and Cl-
                naCoreMat.color.setHex(0xaaaaaa); // Stays silverish
                clCoreMat.color.setHex(0x00ff44); // Glows slightly brighter green
                naCoreMat.emissive.setHex(0x220000); // Positive charge indication
                clCoreMat.emissive.setHex(0x000022); // Negative charge indication
            }
        } else if (phase === 2) {
            // Electrostatic attraction pulls them together
            const speed = delta * 2;
            if (naAtom.position.x < -2.5) naAtom.position.x += speed;
            if (clAtom.position.x > 2.5) clAtom.position.x -= speed;
            
            // Fade in the ionic bond field
            if (fieldMat.opacity < 0.4) fieldMat.opacity += delta * 0.5;

            if (naAtom.position.x >= -2.5 && clAtom.position.x <= 2.5) {
                phase = 3;
            }
        } else if (phase === 3) {
            // Bonded. Pulse the field.
            fieldMat.opacity = 0.3 + Math.sin(time * 5) * 0.1;
            
            // Reset sequence every 10 seconds
            if (time > 12.0) {
                time = 0;
                phase = 0;
                // Reset positions
                naAtom.position.set(-4, 0, 0);
                clAtom.position.set(4, 0, 0);
                fieldMat.opacity = 0;
                // Reattach valence to Na
                naAtom.attach(naValence);
                naValence.position.set(naShells[2], 0, 0);
                // Remove emissive charges
                naCoreMat.emissive.setHex(0x000000);
                clCoreMat.emissive.setHex(0x000000);
            }
        }
    };

    return group;
}
