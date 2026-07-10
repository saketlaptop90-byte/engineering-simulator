import * as THREE from 'three';

export function createBerylliumEffectiveNuclearCharge(scene, renderer, camera) {
    const group = new THREE.Group();

    // Zeff (Effective Nuclear Charge) = Z - S
    // For Be: Z = 4. Core electrons S = 2. Zeff roughly = +2 for valence electrons.
    // Visualized as a split nucleus effect or color gradient showing the math

    // Center shows +4
    const nucGeo = new THREE.SphereGeometry(1, 32, 32);
    const nucMat = new THREE.MeshBasicMaterial({ color: 0xff0044 });
    const nucleus = new THREE.Mesh(nucGeo, nucMat);
    group.add(nucleus);

    // Create a 3D text label or sprite for "+4"
    const createTextSprite = (text, color, size) => {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        ctx.font = 'bold 100px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 128, 128);
        const tex = new THREE.CanvasTexture(canvas);
        const mat = new THREE.SpriteMaterial({ map: tex, depthTest: false });
        const sprite = new THREE.Sprite(mat);
        sprite.scale.set(size, size, 1);
        return { sprite, tex, mat };
    };

    const zLabel = createTextSprite('+4 (Z)', '#ffffff', 2);
    zLabel.sprite.position.y = 1.5;
    group.add(zLabel.sprite);

    // Inner shield boundary (S=2)
    const shieldGeo = new THREE.SphereGeometry(2.5, 32, 32);
    const shieldMat = new THREE.MeshBasicMaterial({ color: 0x4444ff, transparent: true, opacity: 0.2, side: THREE.DoubleSide });
    const shield = new THREE.Mesh(shieldGeo, shieldMat);
    group.add(shield);
    
    const sLabel = createTextSprite('-2 (S)', '#8888ff', 2);
    sLabel.sprite.position.set(0, 3, 0);
    group.add(sLabel.sprite);

    // Valence electron experiencing Zeff
    const valGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const valMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    const valE = new THREE.Mesh(valGeo, valMat);
    group.add(valE);

    const zeffLabel = createTextSprite('Zeff ≈ +2', '#00ffcc', 3);
    group.add(zeffLabel.sprite);

    // Force line from nucleus to valence
    const lineMat = new THREE.LineDashedMaterial({ color: 0x00ffcc, dashSize: 0.2, gapSize: 0.1 });
    const lineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0)]);
    const line = new THREE.Line(lineGeo, lineMat);
    line.computeLineDistances();
    group.add(line);

    let time = 0;

    return {
        update: () => {
            time += 0.016;

            // Orbit valence electron
            const r = 5.0;
            const angle = time * 0.5;
            valE.position.set(Math.cos(angle)*r, 0, Math.sin(angle)*r);
            
            // Update line
            const positions = line.geometry.attributes.position.array;
            positions[3] = valE.position.x;
            positions[4] = valE.position.y;
            positions[5] = valE.position.z;
            line.geometry.attributes.position.needsUpdate = true;
            line.computeLineDistances(); // Required for dashed lines

            zeffLabel.sprite.position.copy(valE.position);
            zeffLabel.sprite.position.y += 1.0; // Float above electron

            // Slight bobbing of nucleus and shield
            nucleus.scale.setScalar(1 + Math.sin(time*4)*0.05);
            shield.scale.setScalar(1 + Math.cos(time*4)*0.02);
            
            group.rotation.x = 0.2; // Slight tilt
        },
        cleanup: () => {
            nucGeo.dispose(); nucMat.dispose();
            shieldGeo.dispose(); shieldMat.dispose();
            valGeo.dispose(); valMat.dispose();
            zLabel.tex.dispose(); zLabel.mat.dispose();
            sLabel.tex.dispose(); sLabel.mat.dispose();
            zeffLabel.tex.dispose(); zeffLabel.mat.dispose();
            lineGeo.dispose(); lineMat.dispose();
        }
    };
}