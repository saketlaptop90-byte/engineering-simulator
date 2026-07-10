import * as THREE from 'three';

export function createMachine() {
    const group = new THREE.Group();

    // --- 1. Materials for Bases ---
    // DNA: A, T, C, G
    // RNA: A, U, C, G
    const matA = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Adenine (Red)
    const matT = new THREE.MeshStandardMaterial({ color: 0x00ff00 }); // Thymine (Green)
    const matC = new THREE.MeshStandardMaterial({ color: 0x0000ff }); // Cytosine (Blue)
    const matG = new THREE.MeshStandardMaterial({ color: 0xffff00 }); // Guanine (Yellow)
    const matU = new THREE.MeshStandardMaterial({ color: 0xff8800 }); // Uracil (Orange)

    const baseMats = [matA, matT, matC, matG];
    
    // Helper to get pairing
    // A-T (0-1), C-G (2-3)
    function getPair(index, isRNA) {
        if (index === 0) return isRNA ? matU : matT;
        if (index === 1) return matA;
        if (index === 2) return matG;
        if (index === 3) return matC;
    }

    // --- 2. The DNA Helix ---
    const helixGroup = new THREE.Group();
    group.add(helixGroup);

    const bpCount = 30; // Base pairs
    const dnaStructure = [];

    const backboneGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const backMat1 = new THREE.MeshStandardMaterial({ color: 0x666666 });
    const backMat2 = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const baseGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 8);

    for (let i = 0; i < bpCount; i++) {
        const bp = new THREE.Group();
        bp.position.y = (i - bpCount/2) * 0.4;
        
        // Random base for strand 1
        const bType = Math.floor(Math.random() * 4);
        
        // Backbone 1
        const bb1 = new THREE.Mesh(backboneGeo, backMat1);
        bb1.position.x = -1;
        bp.add(bb1);

        // Backbone 2
        const bb2 = new THREE.Mesh(backboneGeo, backMat2);
        bb2.position.x = 1;
        bp.add(bb2);

        // Base 1
        const b1 = new THREE.Mesh(baseGeo, baseMats[bType]);
        b1.rotation.z = Math.PI / 2;
        b1.position.x = -0.4;
        bp.add(b1);

        // Base 2
        const b2 = new THREE.Mesh(baseGeo, getPair(bType, false));
        b2.rotation.z = Math.PI / 2;
        b2.position.x = 0.4;
        bp.add(b2);

        helixGroup.add(bp);
        
        dnaStructure.push({
            group: bp,
            b1: b1,
            b2: b2,
            type: bType,
            baseRot: i * 0.4 // Natural twist
        });
    }

    // --- 3. RNA Polymerase (Enzyme) ---
    const enzymeGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const enzymeMat = new THREE.MeshPhysicalMaterial({ color: 0xaaaaaa, transmission: 0.6, transparent: true, opacity: 0.8, roughness: 0.2 });
    const enzyme = new THREE.Mesh(enzymeGeo, enzymeMat);
    enzyme.scale.set(1.5, 1, 1);
    enzyme.userData = { id: 'rna_polymerase', name: 'RNA Polymerase', description: 'Unzips the DNA double helix and matches RNA nucleotides to build a messenger RNA (mRNA) strand.' };
    group.add(enzyme);

    // --- 4. The mRNA Strand ---
    const mRNA = new THREE.Group();
    group.add(mRNA);
    const mRnaNodes = [];
    
    for (let i = 0; i < bpCount; i++) {
        const node = new THREE.Group();
        node.visible = false;
        
        const bb = new THREE.Mesh(backboneGeo, new THREE.MeshStandardMaterial({color: 0xaa4444})); // RNA backbone
        node.add(bb);

        const base = new THREE.Mesh(baseGeo, getPair(dnaStructure[i].type, true));
        base.rotation.z = Math.PI / 2;
        base.position.x = 0.6; // Stick out
        node.add(base);

        mRNA.add(node);
        mRnaNodes.push(node);
    }
    mRNA.userData = { id: 'mrna', name: 'Messenger RNA (mRNA)', description: 'A single-stranded copy of the genetic code, containing Uracil (Orange) instead of Thymine (Green). It will travel to the ribosome to build proteins.' };

    // --- 5. Animation ---
    let time = 0;
    
    group.userData.animate = function(delta) {
        time += delta * 2.5; // Transcription speed
        
        // Loop time over the length of the DNA
        const maxTime = bpCount;
        const curTime = time % maxTime;

        // Position enzyme
        const enzymeY = (curTime - bpCount/2) * 0.4;
        enzyme.position.y = enzymeY;
        enzyme.rotation.y += delta; // Spin slightly

        // Animate DNA unzipping and twisting
        for (let i = 0; i < bpCount; i++) {
            const pair = dnaStructure[i];
            const distToEnzyme = Math.abs(i - curTime);

            let currentTwist = pair.baseRot;
            
            if (distToEnzyme < 3) {
                // Inside the enzyme: Untwist and Unzip
                currentTwist = 0; // Untwist completely
                
                // Unzip (pull apart)
                const unzipAmount = (3 - distToEnzyme) * 0.4;
                pair.b1.position.x = -0.4 - unzipAmount;
                pair.b2.position.x = 0.4 + unzipAmount;

                // mRNA synthesis
                if (i <= curTime && distToEnzyme < 2) {
                    mRnaNodes[i].visible = true;
                    // Position mRNA attached to strand 1
                    mRnaNodes[i].position.set(-1.0 - unzipAmount, pair.group.position.y, 0);
                    // Peel away slightly
                    mRnaNodes[i].position.x -= (curTime - i) * 0.2;
                    mRnaNodes[i].position.z = (curTime - i) * 0.5;
                }
            } else {
                // Outside enzyme: Normal twisted helix
                pair.b1.position.x = -0.4;
                pair.b2.position.x = 0.4;

                // Hide mRNA if it hasn't been built yet
                if (i > curTime) {
                    mRnaNodes[i].visible = false;
                } else {
                    // mRNA strand peeling away behind the enzyme
                    mRnaNodes[i].visible = true;
                    const timeSince = curTime - i;
                    // Trail off into the distance
                    mRnaNodes[i].position.set(
                        -1.0 - 1.2 - (timeSince * 0.1), // X
                        pair.group.position.y - (timeSince * 0.1), // Y
                        timeSince * 0.5 // Z (sticking out towards camera)
                    );
                }
            }

            // Apply global twist rotation
            pair.group.rotation.y = currentTwist;
        }

        // Global spin of the whole helix to make it look active
        helixGroup.position.y = -curTime * 0.4; // Scroll down as it reads
        mRNA.position.y = -curTime * 0.4;
    };

    return group;
}
