import * as THREE from 'three';

export function createBerylliumHundsRule(scene, renderer, camera) {
    const group = new THREE.Group();

    // Hund's Rule visualization (though Be doesn't really use it much as it only fills 1s and 2s fully,
    // we can visualize what happens if we excite it to 2p).
    // Let's show the 2p orbitals (px, py, pz) as 3 boxes. 
    // We drop 2 electrons in. Hund's rule says they go into separate boxes with parallel spins first.
    // If they go into the same box, the box flashes red (repulsion).

    const createBox = (x, labelText) => {
        const geo = new THREE.BoxGeometry(2, 2, 2);
        const mat = new THREE.MeshBasicMaterial({ color: 0x00c8ff, wireframe: true, transparent: true, opacity: 0.5 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, 0, 0);

        const canvas = document.createElement('canvas');
        canvas.width = 256; canvas.height = 128;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 60px Arial';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(labelText, 128, 64);
        const tex = new THREE.CanvasTexture(canvas);
        const spriteMat = new THREE.SpriteMaterial({ map: tex, depthTest: false });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.scale.set(2, 1, 1);
        sprite.position.set(x, -2, 0);
        group.add(sprite);
        
        group.add(mesh);
        return { mesh, tex, spriteMat };
    };

    const boxPx = createBox(-3, '2px');
    const boxPy = createBox(0, '2py');
    const boxPz = createBox(3, '2pz');

    const eGeo = new THREE.SphereGeometry(0.4, 32, 32);
    const eMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    
    // Electron 1
    const e1 = new THREE.Mesh(eGeo, eMat);
    const a1 = new THREE.ArrowHelper(new THREE.Vector3(0,1,0), new THREE.Vector3(0,0,0), 1.2, 0xff0044, 0.4, 0.2);
    e1.add(a1);
    group.add(e1);

    // Electron 2
    const e2 = new THREE.Mesh(eGeo, eMat);
    const a2 = new THREE.ArrowHelper(new THREE.Vector3(0,1,0), new THREE.Vector3(0,0,0), 1.2, 0x0044ff, 0.4, 0.2);
    e2.add(a2);
    group.add(e2);

    // Repulsion flare
    const flareMat = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0, blending: THREE.AdditiveBlending });
    const flare = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), flareMat);
    group.add(flare);

    let time = 0;

    return {
        update: () => {
            time += 0.016;
            
            const cycle = (time % 10) / 10;
            
            // e1 is always in 2px spinning up
            e1.position.set(-3, Math.sin(time*5)*0.1, 0);
            
            if (cycle < 0.4) {
                // Happy state: e2 is in 2py spinning up (Hund's Rule followed)
                e2.position.set(0, Math.sin(time*5+1)*0.1, 0);
                a2.setDirection(new THREE.Vector3(0,1,0));
                flareMat.opacity = 0;
            } else if (cycle < 0.5) {
                // Transitioning
                e2.position.lerp(new THREE.Vector3(-3, 0, 0), (cycle-0.4)*10);
            } else if (cycle < 0.9) {
                // Bad state: e2 forces itself into 2px with e1, but still spin up!
                // Major repulsion violation of both Hund and Pauli if spins are same.
                // Let's say it forces spin down, so it violates Hund's (pairing before filling).
                e2.position.set(-3 + (Math.random()-0.5)*0.2, (Math.random()-0.5)*0.2, 0.5);
                a2.setDirection(new THREE.Vector3(0,-1,0));
                
                // Repulsion flare active on box px
                flare.position.set(-3, 0, 0);
                flare.scale.setScalar(1 + Math.sin(time*30)*0.1);
                flareMat.opacity = 0.6;
            } else {
                // Reset
                e2.position.lerp(new THREE.Vector3(0, 0, 0), (cycle-0.9)*10);
                a2.setDirection(new THREE.Vector3(0,1,0));
                flareMat.opacity = 0;
            }

            group.rotation.y = Math.sin(time*0.5) * 0.2;
        },
        cleanup: () => {
            boxPx.mesh.geometry.dispose(); boxPx.mesh.material.dispose(); boxPx.tex.dispose(); boxPx.spriteMat.dispose();
            boxPy.mesh.geometry.dispose(); boxPy.mesh.material.dispose(); boxPy.tex.dispose(); boxPy.spriteMat.dispose();
            boxPz.mesh.geometry.dispose(); boxPz.mesh.material.dispose(); boxPz.tex.dispose(); boxPz.spriteMat.dispose();
            eGeo.dispose(); eMat.dispose();
            a1.line.geometry.dispose(); a1.cone.geometry.dispose();
            a2.line.geometry.dispose(); a2.cone.geometry.dispose();
            flare.geometry.dispose(); flareMat.dispose();
        }
    };
}