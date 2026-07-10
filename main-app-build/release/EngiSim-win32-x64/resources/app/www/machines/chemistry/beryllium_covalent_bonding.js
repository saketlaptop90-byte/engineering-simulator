import * as THREE from 'three';

export function createBerylliumCovalentBonding(scene, renderer, camera) {
    const group = new THREE.Group();

    // Visualizes a covalent bond (sharing of electrons).
    // Beryllium forms covalent bonds in gaseous BeCl2, for example.
    // We will show a central Be sharing electrons with two Cl atoms.

    const createAtom = (color, label, radius) => {
        const mesh = new THREE.Mesh(
            new THREE.SphereGeometry(radius, 32, 32),
            new THREE.MeshPhysicalMaterial({ color: color, transparent: true, opacity: 0.5, transmission: 0.8, roughness: 0.2 })
        );
        const nuc = new THREE.Mesh(
            new THREE.SphereGeometry(0.3, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        mesh.add(nuc);
        
        // Label
        const canvas = document.createElement('canvas');
        canvas.width = 128; canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(label, 64, 32);
        const tex = new THREE.CanvasTexture(canvas);
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false }));
        sprite.scale.set(3, 1.5, 1);
        sprite.position.y = radius + 1;
        mesh.add(sprite);
        
        return { mesh, tex, sprite };
    };

    const be = createAtom(0x00c8ff, 'Be', 2);
    const cl1 = createAtom(0x00ff44, 'Cl', 2.5);
    const cl2 = createAtom(0x00ff44, 'Cl', 2.5);

    cl1.mesh.position.set(-4, 0, 0);
    cl2.mesh.position.set(4, 0, 0);
    
    group.add(be.mesh);
    group.add(cl1.mesh);
    group.add(cl2.mesh);

    // Shared electrons (Covalent bonds)
    const eGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const eMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    
    // Bond 1: Be - Cl1
    const pair1 = [new THREE.Mesh(eGeo, eMat), new THREE.Mesh(eGeo, eMat)];
    group.add(pair1[0]); group.add(pair1[1]);
    
    // Bond 2: Be - Cl2
    const pair2 = [new THREE.Mesh(eGeo, eMat), new THREE.Mesh(eGeo, eMat)];
    group.add(pair2[0]); group.add(pair2[1]);

    // Glowing overlap regions
    const overlapGeo = new THREE.BoxGeometry(2, 1, 1);
    const overlapMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending });
    const ov1 = new THREE.Mesh(overlapGeo, overlapMat);
    ov1.position.set(-2, 0, 0);
    const ov2 = new THREE.Mesh(overlapGeo, overlapMat);
    ov2.position.set(2, 0, 0);
    group.add(ov1);
    group.add(ov2);

    const light = new THREE.PointLight(0xffffff, 2, 20);
    group.add(light);
    group.add(new THREE.AmbientLight(0x404040, 2));

    let time = 0;

    return {
        update: () => {
            time += 0.016;

            // Animate shared electron pairs in figure-8s or tight circles in the overlap region
            const angle = time * 5;
            
            // Pair 1
            pair1[0].position.set(-2 + Math.cos(angle)*0.5, Math.sin(angle)*0.5, 0);
            pair1[1].position.set(-2 + Math.cos(angle+Math.PI)*0.5, Math.sin(angle+Math.PI)*0.5, 0);
            
            // Pair 2
            pair2[0].position.set(2 + Math.cos(angle)*0.5, Math.sin(angle)*0.5, 0);
            pair2[1].position.set(2 + Math.cos(angle+Math.PI)*0.5, Math.sin(angle+Math.PI)*0.5, 0);
            
            // Pulse overlaps
            const pulse = 1 + Math.sin(time*10)*0.1;
            ov1.scale.set(1, pulse, pulse);
            ov2.scale.set(1, pulse, pulse);

            group.rotation.y = time * 0.2;
            group.rotation.x = Math.sin(time*0.5)*0.1;
        },
        cleanup: () => {
            be.mesh.children.forEach(c => { if(c.geometry) c.geometry.dispose(); if(c.material) c.material.dispose(); });
            be.mesh.geometry.dispose(); be.mesh.material.dispose(); be.tex.dispose();
            
            cl1.mesh.children.forEach(c => { if(c.geometry) c.geometry.dispose(); if(c.material) c.material.dispose(); });
            cl1.mesh.geometry.dispose(); cl1.mesh.material.dispose(); cl1.tex.dispose();
            
            cl2.mesh.children.forEach(c => { if(c.geometry) c.geometry.dispose(); if(c.material) c.material.dispose(); });
            cl2.mesh.geometry.dispose(); cl2.mesh.material.dispose(); cl2.tex.dispose();
            
            eGeo.dispose(); eMat.dispose();
            overlapGeo.dispose(); overlapMat.dispose();
        }
    };
}