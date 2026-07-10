import * as THREE from 'three';

export function createMachine() {
    const group = new THREE.Group();

    // --- 1. Tanks ---
    const tankGeo = new THREE.BoxGeometry(2.5, 3, 2);
    const tankMat = new THREE.MeshPhysicalMaterial({ color: 0xeeeeee, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.2, side: THREE.DoubleSide });
    
    // Tank 1: Coagulation (Left)
    const tank1 = new THREE.Mesh(tankGeo, tankMat);
    tank1.position.set(-3, 0, 0);
    group.add(tank1);

    // Tank 2: Sedimentation (Middle)
    const tank2 = new THREE.Mesh(tankGeo, tankMat);
    tank2.position.set(0, 0, 0);
    group.add(tank2);

    // Tank 3: Filtration (Right)
    const tank3 = new THREE.Mesh(tankGeo, tankMat);
    tank3.position.set(3, 0, 0);
    group.add(tank3);

    // Water blocks inside tanks
    const waterGeo = new THREE.BoxGeometry(2.4, 2.5, 1.9);
    const waterMat = new THREE.MeshPhysicalMaterial({ color: 0x0066aa, transmission: 0.8, opacity: 1, transparent: true, roughness: 0.1 });
    
    const w1 = new THREE.Mesh(waterGeo, waterMat); w1.position.set(-3, -0.2, 0); group.add(w1);
    const w2 = new THREE.Mesh(waterGeo, waterMat); w2.position.set(0, -0.2, 0); group.add(w2);
    const w3 = new THREE.Mesh(waterGeo, waterMat); w3.position.set(3, -0.2, 0); group.add(w3);

    // Filter layers in Tank 3
    const sandGeo = new THREE.BoxGeometry(2.4, 0.5, 1.9);
    const sandMat = new THREE.MeshStandardMaterial({ color: 0xddcc99, roughness: 1.0 });
    const sand = new THREE.Mesh(sandGeo, sandMat);
    sand.position.set(3, -0.5, 0);
    group.add(sand);

    const gravelGeo = new THREE.BoxGeometry(2.4, 0.4, 1.9);
    const gravelMat = new THREE.MeshStandardMaterial({ color: 0x777777, roughness: 1.0 });
    const gravel = new THREE.Mesh(gravelGeo, gravelMat);
    gravel.position.set(3, -1.0, 0);
    gravel.userData = { id: 'filtration', name: 'Filtration', description: 'Water passes through layers of sand and gravel to remove the finest remaining impurities.' };
    group.add(gravel);

    // Connecting Pipes
    const pipeGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.5, 16);
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
    
    const p1 = new THREE.Mesh(pipeGeo, pipeMat);
    p1.rotation.z = Math.PI / 2; p1.position.set(-1.5, 0.5, 0); group.add(p1);
    
    const p2 = new THREE.Mesh(pipeGeo, pipeMat);
    p2.rotation.z = Math.PI / 2; p2.position.set(1.5, 0.5, 0); group.add(p2);

    // Stirrer in Tank 1
    const stirGroup = new THREE.Group();
    stirGroup.position.set(-3, 1, 0);
    group.add(stirGroup);
    
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2, 8), pipeMat);
    shaft.position.y = -1;
    stirGroup.add(shaft);
    
    const blade = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 0.2), pipeMat);
    blade.position.y = -1.5;
    stirGroup.add(blade);
    stirGroup.userData = { id: 'coagulation', name: 'Coagulation & Flocculation', description: 'Chemicals are added and stirred rapidly. Dirt particles stick together to form larger clumps called floc.' };

    // Sludge scraper in Tank 2
    const scraper = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.2, 1.9), new THREE.MeshStandardMaterial({color: 0x332211}));
    scraper.position.set(0, -1.4, 0);
    scraper.userData = { id: 'sedimentation', name: 'Sedimentation', description: 'The heavy floc clumps sink to the bottom as sludge, while clear water overflows to the next tank.' };
    group.add(scraper);

    // --- 2. Particles (Dirt & Floc) ---
    const pCount = 200;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pType = new Float32Array(pCount); // 0: raw dirt, 1: floc (clumped), 2: sinking, 3: pure

    for(let i=0; i<pCount; i++){
        pType[i] = 0; // Starts in Tank 1
        pPos[i*3] = -3 + (Math.random()-0.5)*2;
        pPos[i*3+1] = -1.3 + Math.random()*2;
        pPos[i*3+2] = (Math.random()-0.5)*1.5;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color: 0x664422, size: 0.1, transparent: true, opacity: 0.8 });
    const dirt = new THREE.Points(pGeo, pMat);
    group.add(dirt);

    // --- 3. Animation ---
    group.userData.animate = function(delta) {
        // Spin stirrer
        stirGroup.rotation.y += delta * 5;

        const pos = dirt.geometry.attributes.position.array;

        for(let i=0; i<pCount; i++){
            let type = pType[i];
            let x = pos[i*3];
            let y = pos[i*3+1];

            if (type === 0) {
                // Tank 1: Swirling dirt
                const dx = x - (-3);
                const dz = pos[i*3+2];
                // Swirl logic
                x = -3 + (dx * Math.cos(delta*2) - dz * Math.sin(delta*2));
                pos[i*3+2] = (dx * Math.sin(delta*2) + dz * Math.cos(delta*2));
                y += (Math.random()-0.5)*0.1;

                // Randomly clump and move to tank 2
                if (Math.random() < 0.005) {
                    type = 1;
                    x = 0 + (Math.random()-0.5)*2; // Teleport to Tank 2 top
                    y = 0.5 + Math.random()*0.5;
                }
            }
            else if (type === 1) {
                // Tank 2: Floc sinking slowly
                y -= delta * 0.3;
                if (y < -1.3) {
                    // Hit bottom (Sludge)
                    type = 2;
                }
            }
            else if (type === 2) {
                // Stuck in sludge, occasionally reset as new raw water
                if (Math.random() < 0.01) {
                    type = 0;
                    x = -3 + (Math.random()-0.5)*2;
                    y = 1.0; // drops in from top
                }
            }

            pos[i*3] = x;
            pos[i*3+1] = y;
            pType[i] = type;
        }
        
        dirt.geometry.attributes.position.needsUpdate = true;
    };

    return group;
}

// Auto-generated missing stub
export function createWaterTreatment() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
