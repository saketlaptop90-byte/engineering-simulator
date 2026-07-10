import * as THREE from 'three';

export function createBerylliumCovalentRadius(scene, renderer, camera) {
    const group = new THREE.Group();

    // Visualizes Covalent Radius (approx 90 pm).
    // Defined as half the distance between two identical bonded Be atoms.
    // (Note: Be2 doesn't form stable covalent bonds natively under standard conditions due to bond order 0,
    // but the concept applies).

    const covR = 3; // visual scale for 90 pm
    const bondDist = covR * 2; // distance between nuclei

    const atomGeo = new THREE.SphereGeometry(covR, 64, 64);
    const atomMat = new THREE.MeshPhysicalMaterial({
        color: 0x00c8ff,
        transparent: true,
        opacity: 0.4,
        transmission: 0.8,
        roughness: 0.1
    });

    const atom1 = new THREE.Mesh(atomGeo, atomMat);
    atom1.position.set(-covR, 0, 0);
    group.add(atom1);

    const atom2 = new THREE.Mesh(atomGeo, atomMat);
    atom2.position.set(covR, 0, 0);
    group.add(atom2);

    // Nuclei
    const nucGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const nucMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    
    const n1 = new THREE.Mesh(nucGeo, nucMat);
    n1.position.set(-covR, 0, 0);
    group.add(n1);
    
    const n2 = new THREE.Mesh(nucGeo, nucMat);
    n2.position.set(covR, 0, 0);
    group.add(n2);

    // Bond axis line
    const lineGeo = new THREE.BufferGeometry().setFromPoints([n1.position, n2.position]);
    const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
    group.add(new THREE.Line(lineGeo, lineMat));

    // Measure bracket for "d" (internuclear distance)
    const bracketGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-covR, -covR-0.5, 0),
        new THREE.Vector3(-covR, -covR-1.0, 0),
        new THREE.Vector3(covR, -covR-1.0, 0),
        new THREE.Vector3(covR, -covR-0.5, 0)
    ]);
    group.add(new THREE.Line(bracketGeo, lineMat));

    // Radius bracket for "r = d/2"
    const rBracketGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-covR, covR+0.5, 0),
        new THREE.Vector3(-covR, covR+1.0, 0),
        new THREE.Vector3(0, covR+1.0, 0),
        new THREE.Vector3(0, covR+0.5, 0)
    ]);
    group.add(new THREE.Line(rBracketGeo, lineMat));

    const createLabel = (text, x, y, size) => {
        const canvas = document.createElement('canvas');
        canvas.width = 256; canvas.height = 128;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 50px Arial';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(text, 128, 64);
        const tex = new THREE.CanvasTexture(canvas);
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false }));
        sprite.scale.set(size, size/2, 1);
        sprite.position.set(x, y, 0);
        group.add(sprite);
        return { tex, sprite };
    };

    const ld = createLabel('d (Internuclear)', 0, -covR-1.5, 4);
    const lr = createLabel('r (Covalent)', -covR/2, covR+1.5, 3);

    const light = new THREE.PointLight(0xffffff, 2, 20);
    group.add(light);
    group.add(new THREE.AmbientLight(0x404040, 2));

    let time = 0;

    return {
        update: () => {
            time += 0.016;

            // Slowly rotate the molecule to see 3D shape, but keep labels facing camera
            // We rotate a sub-group if we wanted, but let's just gently rock it on X and Z
            group.rotation.x = Math.sin(time * 0.5) * 0.1;
            group.rotation.y = Math.sin(time * 0.3) * 0.15;
            
            // Pulse the overlap region (additive blending creates a glow at the intersection)
            atom1.scale.setScalar(1 + Math.sin(time*2)*0.01);
            atom2.scale.setScalar(1 + Math.sin(time*2)*0.01);
        },
        cleanup: () => {
            atomGeo.dispose(); atomMat.dispose();
            nucGeo.dispose(); nucMat.dispose();
            lineGeo.dispose(); lineMat.dispose();
            bracketGeo.dispose(); rBracketGeo.dispose();
            ld.tex.dispose(); ld.sprite.material.dispose();
            lr.tex.dispose(); lr.sprite.material.dispose();
        }
    };
}