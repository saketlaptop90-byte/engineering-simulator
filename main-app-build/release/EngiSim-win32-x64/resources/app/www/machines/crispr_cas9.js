import * as THREE from 'three';

export function createMachine(scene) {
    const group = new THREE.Group();
    

    // DNA Target Strand
    const dnaGroup = new THREE.Group();
    group.add(dnaGroup);
    
    // We will lay out the DNA horizontally
    const bases = ['A', 'T', 'C', 'G'];
    const colors = { A: 0xff0000, T: 0x00ff00, C: 0x0000ff, G: 0xffff00 };
    const pairs = { 'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C' };
    
    const numPairs = 40;
    const helixRadius = 1;
    const helixStep = 0.6;
    
    const bbGeom = new THREE.SphereGeometry(0.3, 16, 16);
    const bbMat1 = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const bbMat2 = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const rungGeom = new THREE.CylinderGeometry(0.1, 0.1, helixRadius, 8);
    rungGeom.rotateX(Math.PI/2);
    rungGeom.translate(0, 0, helixRadius/2);
    
    const baseMeshes = [];
    
    // PAM sequence target (NGG) around index 20
    const targetIndex = 20;
    
    for(let i=0; i<numPairs; i++) {
        let b1 = bases[Math.floor(Math.random() * 4)];
        if (i === targetIndex) b1 = 'C';
        if (i === targetIndex + 1) b1 = 'C';
        if (i === targetIndex + 2) b1 = 'C'; // Force PAM complementary site
        
        let b2 = pairs[b1];
        
        const pairGroup = new THREE.Group();
        pairGroup.position.set((i - numPairs/2) * helixStep, 0, 0);
        
        // Initial rotation
        pairGroup.rotation.x = i * 0.3; 
        
        // S1 (top)
        const s1 = new THREE.Mesh(bbGeom, bbMat1);
        s1.position.set(0, 0, -helixRadius);
        pairGroup.add(s1);
        
        const m1 = new THREE.Mesh(rungGeom, new THREE.MeshStandardMaterial({ color: colors[b1] }));
        m1.position.set(0, 0, -helixRadius);
        pairGroup.add(m1);
        
        // S2 (bottom)
        const s2 = new THREE.Mesh(bbGeom, bbMat2);
        s2.position.set(0, 0, helixRadius);
        pairGroup.add(s2);
        
        const m2 = new THREE.Mesh(rungGeom, new THREE.MeshStandardMaterial({ color: colors[b2] }));
        m2.rotation.y = Math.PI;
        m2.position.set(0, 0, helixRadius);
        pairGroup.add(m2);
        
        dnaGroup.add(pairGroup);
        baseMeshes.push({ group: pairGroup, s1, s2, r1: m1, r2: m2, angle: i * 0.3 });
    }

    // Cas9 Protein (Enzyme Blob)
    const cas9Geom = new THREE.IcosahedronGeometry(4, 2); // large blob
    const cas9Mat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 1, transparent: true, opacity: 0.6 });
    const cas9 = new THREE.Mesh(cas9Geom, cas9Mat);
    cas9.position.set(-15, 0, 0); // starts off to the left
    group.add(cas9);
    
    // sgRNA (Guide RNA) inside Cas9
    const rnaGeom = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
            new THREE.Vector3(-2, 1, 0),
            new THREE.Vector3(0, 2, 0),
            new THREE.Vector3(2, 0, 0)
        ]), 
        20, 0.2, 8, false
    );
    const rnaMat = new THREE.MeshStandardMaterial({ color: 0xff00ff }); // Magenta
    const rna = new THREE.Mesh(rnaGeom, rnaMat);
    cas9.add(rna);

    // Scissors (HNH & RuvC nuclease domains)
    const scissorGeom = new THREE.ConeGeometry(0.5, 2, 16);
    const scissorMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.9 });
    const scis1 = new THREE.Mesh(scissorGeom, scissorMat);
    scis1.position.set(0, 2, 2);
    scis1.rotation.x = Math.PI/2;
    cas9.add(scis1);
    
    const scis2 = new THREE.Mesh(scissorGeom, scissorMat);
    scis2.position.set(0, -2, 2);
    scis2.rotation.x = Math.PI/2;
    cas9.add(scis2);

    let phase = 0; // 0=searching, 1=unwinding, 2=cutting, 3=done

    // Labels
    const createLabel = (text, pos, color) => {
        const lcan = document.createElement('canvas');
        lcan.width = 256; lcan.height = 64;
        const lctx = lcan.getContext('2d');
        lctx.fillStyle = color;
        lctx.font = 'bold 24px Arial';
        lctx.textAlign = 'center';
        lctx.fillText(text, 128, 40);
        const tex = new THREE.CanvasTexture(lcan);
        const spriteMat = new THREE.SpriteMaterial({ map: tex, transparent: true });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.position.copy(pos);
        sprite.scale.set(3, 0.75, 1);
        group.add(sprite);
        return sprite;
    };

    const lblCas9 = createLabel("Cas9 Protein", new THREE.Vector3(-15, 5, 0), "white");
    const lblSgRNA = createLabel("sgRNA (Guide)", new THREE.Vector3(-15, 6.5, 0), "magenta");
    const lblTarget = createLabel("Target DNA Sequence", new THREE.Vector3(0, -4, 0), "lightgreen");
    const lblPAM = createLabel("PAM Sequence (NGG)", new THREE.Vector3(2, -5.5, 0), "yellow");

    const flashGeom = new THREE.PlaneGeometry(10, 10);
    const flashMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending });
    const flash = new THREE.Mesh(flashGeom, flashMat);
    group.add(flash);

    group.userData.animate = (delta) => {
        
        if (phase === 0) {
            // Searching
            cas9.position.x += delta * 4;
            lblCas9.position.x = cas9.position.x;
            lblSgRNA.position.x = cas9.position.x;
            
            // Reached target PAM site
            if (cas9.position.x >= -1) {
                cas9.position.x = -1;
                phase = 1;
            }
        } else if (phase === 1) {
            // Unwinding the DNA at the target site (indices 10 to 20)
            let fullyUnwound = true;
            for(let i=10; i<=22; i++) {
                const bm = baseMeshes[i];
                // Rotate flat
                if (bm.group.rotation.x > 0.05) {
                    bm.group.rotation.x -= delta * 2;
                    fullyUnwound = false;
                } else if (bm.group.rotation.x < -0.05) {
                    bm.group.rotation.x += delta * 2;
                    fullyUnwound = false;
                } else {
                    bm.group.rotation.x = 0;
                }
                
                // Separate strands
                if (bm.s1.position.z > -helixRadius - 1.5) {
                    bm.s1.position.z -= delta * 2;
                    bm.s2.position.z += delta * 2;
                    fullyUnwound = false;
                }
            }
            if(fullyUnwound) phase = 2;
            
        } else if (phase === 2) {
            // Cutting
            scis1.position.z -= delta * 4;
            scis2.position.z -= delta * 4;
            
            if (scis1.position.z <= 0) {
                // Cut happens
                flash.position.set(-1, 0, 0);
                flash.material.opacity = 1;
                phase = 3;
            }
        } else if (phase === 3) {
            // Separation of double strand break (DSB)
            flash.material.opacity -= delta * 2;
            if (flash.material.opacity < 0) flash.material.opacity = 0;
            
            // Move left half away
            for(let i=0; i<=16; i++) { // Cut is around index 16
                baseMeshes[i].group.position.x -= delta;
            }
            // Move right half away
            for(let i=17; i<numPairs; i++) {
                baseMeshes[i].group.position.x += delta;
            }
            
            if (baseMeshes[0].group.position.x < -15) {
                // Reset simulation
                phase = 0;
                cas9.position.set(-15, 0, 0);
                scis1.position.set(0, 2, 2);
                scis2.position.set(0, -2, 2);
                
                baseMeshes.forEach((bm, i) => {
                    bm.group.position.set((i - numPairs/2) * helixStep, 0, 0);
                    bm.group.rotation.x = bm.angle;
                    bm.s1.position.set(0, 0, -helixRadius);
                    bm.s2.position.set(0, 0, helixRadius);
                });
            }
        }
        
        // Gentle float for DNA
        dnaGroup.position.y = Math.sin(Date.now() * 0.001) * 0.5;
    };

    return group;
}
