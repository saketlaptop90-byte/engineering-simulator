import * as THREE from 'three';

export function createBerylliumPauliExclusion(scene, renderer, camera) {
    const group = new THREE.Group();

    // Pauli Exclusion Principle: No two electrons can have the exact same 4 quantum numbers.
    // If they share n, l, ml, they MUST have opposite ms (spin).
    // Visualized as a 3D slot machine or quantum state box.

    // A box representing the 2s orbital
    const boxGeo = new THREE.BoxGeometry(4, 2, 2);
    const boxMat = new THREE.MeshBasicMaterial({ color: 0x00c8ff, wireframe: true, transparent: true, opacity: 0.5 });
    const box = new THREE.Mesh(boxGeo, boxMat);
    group.add(box);

    // Text labels for the orbital state
    const createTextSprite = (text, color, size) => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        ctx.font = 'bold 80px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 256, 64);
        const tex = new THREE.CanvasTexture(canvas);
        const mat = new THREE.SpriteMaterial({ map: tex, depthTest: false });
        const sprite = new THREE.Sprite(mat);
        sprite.scale.set(size, size/4, 1);
        return { sprite, tex, mat };
    };

    const label = createTextSprite('2s Orbital (n=2, l=0, ml=0)', '#ffffff', 8);
    label.sprite.position.y = 2;
    group.add(label.sprite);

    // The two electrons
    const eGeo = new THREE.SphereGeometry(0.5, 32, 32);
    
    // E1: Spin Up
    const e1 = new THREE.Mesh(eGeo, new THREE.MeshBasicMaterial({ color: 0xff0044 }));
    e1.position.set(-1, 0, 0);
    const arr1 = new THREE.ArrowHelper(new THREE.Vector3(0,1,0), new THREE.Vector3(0,0,0), 1.5, 0xffffff, 0.4, 0.2);
    e1.add(arr1);
    const l1 = createTextSprite('ms = +1/2', '#ffaaaa', 3);
    l1.sprite.position.set(0, -1.2, 0);
    e1.add(l1.sprite);
    group.add(e1);

    // E2: Spin Down
    const e2 = new THREE.Mesh(eGeo, new THREE.MeshBasicMaterial({ color: 0x0044ff }));
    e2.position.set(1, 0, 0);
    const arr2 = new THREE.ArrowHelper(new THREE.Vector3(0,-1,0), new THREE.Vector3(0,0,0), 1.5, 0xffffff, 0.4, 0.2);
    e2.add(arr2);
    const l2 = createTextSprite('ms = -1/2', '#aaaaff', 3);
    l2.sprite.position.set(0, 1.2, 0);
    e2.add(l2.sprite);
    group.add(e2);

    // Rejection simulation (what if they try to have the same spin?)
    // A red glowing "X" will appear if they clash
    const clashMat = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0 });
    const clashGeo1 = new THREE.BoxGeometry(3, 0.2, 0.2);
    const clash1 = new THREE.Mesh(clashGeo1, clashMat);
    clash1.rotation.z = Math.PI / 4;
    const clash2 = new THREE.Mesh(clashGeo1, clashMat);
    clash2.rotation.z = -Math.PI / 4;
    const clashGroup = new THREE.Group();
    clashGroup.add(clash1);
    clashGroup.add(clash2);
    clashGroup.position.z = 1.5;
    group.add(clashGroup);

    let time = 0;

    return {
        update: () => {
            time += 0.016;

            // Scenario animation cycle (10 seconds)
            const cycle = (time % 10) / 10;
            
            if (cycle < 0.4) {
                // Happy state: Opposite spins
                arr1.setDirection(new THREE.Vector3(0, 1, 0));
                arr2.setDirection(new THREE.Vector3(0, -1, 0));
                e1.position.x = -1 + Math.sin(time*5)*0.1;
                e2.position.x = 1 - Math.sin(time*5)*0.1;
                
                clashMat.opacity = 0;
            } else if (cycle < 0.5) {
                // E2 flips its spin to try and match E1!
                const flipProgress = (cycle - 0.4) / 0.1;
                // Rotate arrow from -1 to 1
                const angle = -Math.PI/2 + (flipProgress * Math.PI);
                arr2.setDirection(new THREE.Vector3(0, Math.sin(angle), Math.cos(angle)));
            } else if (cycle < 0.9) {
                // Clash state: Same spin!
                arr2.setDirection(new THREE.Vector3(0, 1, 0));
                
                // Repelled away from each other violently
                e1.position.x = -1 - (cycle - 0.5)*5;
                e2.position.x = 1 + (cycle - 0.5)*5;
                
                // Flash big red X
                clashMat.opacity = 0.5 + Math.sin(time*20)*0.5;
            } else {
                // Reset
                const resetProgress = (cycle - 0.9) / 0.1;
                arr2.setDirection(new THREE.Vector3(0, -1, 0));
                e1.position.x = -1 - (1-resetProgress)*2;
                e2.position.x = 1 + (1-resetProgress)*2;
                clashMat.opacity = 0;
            }

            // Always slowly rotate the whole box
            group.rotation.y = time * 0.1;
        },
        cleanup: () => {
            boxGeo.dispose(); boxMat.dispose();
            eGeo.dispose();
            e1.material.dispose(); e2.material.dispose();
            label.tex.dispose(); label.mat.dispose();
            l1.tex.dispose(); l1.mat.dispose();
            l2.tex.dispose(); l2.mat.dispose();
            arr1.line.geometry.dispose(); arr1.cone.geometry.dispose();
            arr2.line.geometry.dispose(); arr2.cone.geometry.dispose();
            clashGeo1.dispose(); clashMat.dispose();
        }
    };
}