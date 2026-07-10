import * as THREE from 'three';

export function createMachine(scene) {
    const group = new THREE.Group();
    

    const dnaGroup = new THREE.Group();
    group.add(dnaGroup);

    // Nucleotide base colors
    const colors = {
        A: 0xff0000, // Adenine (Red)
        T: 0x00ff00, // Thymine (Green)
        C: 0x0000ff, // Cytosine (Blue)
        G: 0xffff00  // Guanine (Yellow)
    };
    const pairs = { 'A': 'T', 'T': 'A', 'C': 'G', 'G': 'C' };
    const bases = ['A', 'T', 'C', 'G'];

    const helixRadius = 1.5;
    const helixStep = 0.8;
    const numPairs = 30;
    
    // Geometries
    const backboneGeom = new THREE.SphereGeometry(0.3, 16, 16);
    const bbMat1 = new THREE.MeshStandardMaterial({ color: 0x888888 }); // Leading backbone
    const bbMat2 = new THREE.MeshStandardMaterial({ color: 0xaaaaaa }); // Lagging backbone

    const rungGeom = new THREE.CylinderGeometry(0.15, 0.15, helixRadius, 8);
    rungGeom.rotateZ(Math.PI/2);
    rungGeom.translate(helixRadius/2, 0, 0);

    const baseMeshes = [];

    // Construct intact double helix
    for (let i = 0; i < numPairs; i++) {
        const angle = i * 0.4;
        const y = i * helixStep;
        
        // Random base for strand 1
        const b1 = bases[Math.floor(Math.random() * 4)];
        const b2 = pairs[b1]; // Complementary base
        
        const pairGroup = new THREE.Group();
        pairGroup.position.set(0, y, 0);
        pairGroup.rotation.y = angle;
        
        // Strand 1 (Left)
        const s1 = new THREE.Mesh(backboneGeom, bbMat1);
        s1.position.set(-helixRadius, 0, 0);
        pairGroup.add(s1);
        
        const m1 = new THREE.MeshStandardMaterial({ color: colors[b1] });
        const r1 = new THREE.Mesh(rungGeom, m1);
        r1.position.set(-helixRadius, 0, 0);
        pairGroup.add(r1);

        // Strand 2 (Right)
        const s2 = new THREE.Mesh(backboneGeom, bbMat2);
        s2.position.set(helixRadius, 0, 0);
        pairGroup.add(s2);
        
        const m2 = new THREE.MeshStandardMaterial({ color: colors[b2] });
        const r2 = new THREE.Mesh(rungGeom, m2);
        // Flip to point inward from the right
        r2.rotation.z = Math.PI;
        r2.position.set(helixRadius, 0, 0);
        pairGroup.add(r2);

        dnaGroup.add(pairGroup);
        baseMeshes.push({ group: pairGroup, s1, s2, r1, r2, y: y, unwound: false });
    }

    // Helicase Enzyme (Unzipper)
    const helicaseGeom = new THREE.TorusGeometry(1, 0.4, 16, 32);
    helicaseGeom.rotateX(Math.PI/2);
    const helicaseMat = new THREE.MeshStandardMaterial({ color: 0xff00ff, transparent: true, opacity: 0.8 });
    const helicase = new THREE.Mesh(helicaseGeom, helicaseMat);
    dnaGroup.add(helicase);

    // DNA Polymerase (Builder)
    const polGeom = new THREE.BoxGeometry(2, 2, 2);
    const polMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, transparent: true, opacity: 0.8 });
    const polymerase = new THREE.Mesh(polGeom, polMat);
    dnaGroup.add(polymerase);

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
    };

    createLabel("Helicase (Unzipping)", new THREE.Vector3(4, 0, 0), "magenta");
    createLabel("DNA Polymerase (Building)", new THREE.Vector3(-4, -5, 0), "cyan");
    createLabel("Original DNA", new THREE.Vector3(0, 20, 0), "white");
    createLabel("Replicated Strands", new THREE.Vector3(0, -10, 0), "lightgreen");

    // Animation state
    let helicaseY = 0;
    const maxY = numPairs * helixStep;
    
    // Position the whole group so we watch it flow
    dnaGroup.position.y = -maxY / 2;

    group.userData.animate = (delta) => {
        // Move helicase up
        helicaseY += delta * 2; // speed
        if(helicaseY > maxY + 5) {
            // Reset
            helicaseY = -5;
            baseMeshes.forEach(bm => {
                bm.unwound = false;
                bm.s1.position.x = -helixRadius;
                bm.s2.position.x = helixRadius;
                bm.r1.visible = true;
                bm.r2.visible = true;
                
                // Reset new strand backbones if any
                if(bm.newS1) bm.newS1.visible = false;
                if(bm.newS2) bm.newS2.visible = false;
                if(bm.newR1) bm.newR1.visible = false;
                if(bm.newR2) bm.newR2.visible = false;
            });
        }
        
        helicase.position.y = helicaseY;
        helicase.rotation.z += delta * 5; // Spin helicase
        
        polymerase.position.y = helicaseY - 3;
        polymerase.position.x = -2.5;

        // Unzip logic
        baseMeshes.forEach(bm => {
            if (bm.y < helicaseY && !bm.unwound) {
                // Split them apart
                const splitDist = 2; // how far they separate
                
                // Animate splitting
                bm.s1.position.x -= delta * 5;
                bm.s2.position.x += delta * 5;
                
                if (bm.s1.position.x <= -helixRadius - splitDist) {
                    bm.s1.position.x = -helixRadius - splitDist;
                    bm.s2.position.x = helixRadius + splitDist;
                    bm.unwound = true;
                }
            }
            
            // Polymerase logic (Building new strands)
            if (bm.unwound && bm.y < polymerase.position.y) {
                // Create new complementary base if not exists
                if (!bm.newS1) {
                    bm.newS1 = new THREE.Mesh(backboneGeom, bbMat2); // New lagging backbone
                    bm.newS1.position.set(-helixRadius, 0, 0);
                    bm.group.add(bm.newS1);
                    
                    bm.newR1 = new THREE.Mesh(rungGeom, bm.r2.material); // Comp base
                    bm.newR1.rotation.z = Math.PI;
                    bm.newR1.position.set(-helixRadius, 0, 0);
                    bm.group.add(bm.newR1);
                    
                    // Strand 2 new pair
                    bm.newS2 = new THREE.Mesh(backboneGeom, bbMat1);
                    bm.newS2.position.set(helixRadius, 0, 0);
                    bm.group.add(bm.newS2);
                    
                    bm.newR2 = new THREE.Mesh(rungGeom, bm.r1.material);
                    bm.newR2.position.set(helixRadius, 0, 0);
                    bm.group.add(bm.newR2);
                }
                
                bm.newS1.visible = true;
                bm.newR1.visible = true;
                bm.newS2.visible = true;
                bm.newR2.visible = true;
            }
        });
        
        // Spin the whole DNA slowly
        dnaGroup.rotation.y -= delta * 0.2;
    };

    return group;
}
