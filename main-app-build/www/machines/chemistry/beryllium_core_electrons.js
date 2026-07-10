import * as THREE from 'three';

export function createBerylliumCoreElectrons(scene, renderer, camera) {
    const group = new THREE.Group();

    // Focuses heavily on the tightly bound 1s core electrons.
    // The valence shell is stripped away or highly transparent, putting the nucleus and core front and center.

    // Nucleus (highly detailed)
    const nucleusGroup = new THREE.Group();
    const pGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const pMat = new THREE.MeshPhongMaterial({ color: 0xff0044 }); // proton
    const nMat = new THREE.MeshPhongMaterial({ color: 0x00ccff }); // neutron
    
    // 4 protons, 5 neutrons roughly arranged in a cluster
    for(let i=0; i<4; i++) {
        const p = new THREE.Mesh(pGeo, pMat);
        p.position.set((Math.random()-0.5)*0.8, (Math.random()-0.5)*0.8, (Math.random()-0.5)*0.8);
        nucleusGroup.add(p);
    }
    for(let i=0; i<5; i++) {
        const n = new THREE.Mesh(pGeo, nMat);
        n.position.set((Math.random()-0.5)*1.0, (Math.random()-0.5)*1.0, (Math.random()-0.5)*1.0);
        nucleusGroup.add(n);
    }
    group.add(nucleusGroup);

    // The tightly bound 1s Core
    const coreShell = new THREE.Mesh(
        new THREE.SphereGeometry(2.5, 64, 64),
        new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3,
            transmission: 0.9,
            roughness: 0.2,
            metalness: 0.5
        })
    );
    group.add(coreShell);

    // Core electrons (very fast, close to nucleus)
    const eGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const eMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    
    const e1 = new THREE.Mesh(eGeo, eMat);
    const e2 = new THREE.Mesh(eGeo, eMat);
    group.add(e1);
    group.add(e2);

    // Abstract "Binding Energy" chains holding them in
    const chainMat = new THREE.LineBasicMaterial({ color: 0xff0044, transparent: true, opacity: 0.6 });
    const chain1Geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0)]);
    const chain2Geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0)]);
    const chain1 = new THREE.Line(chain1Geo, chainMat);
    const chain2 = new THREE.Line(chain2Geo, chainMat);
    group.add(chain1);
    group.add(chain2);

    const light = new THREE.PointLight(0xffffff, 3, 20);
    group.add(light);
    group.add(new THREE.AmbientLight(0x404040, 2));

    let time = 0;

    return {
        update: () => {
            time += 0.016;

            // Nucleus jitter
            nucleusGroup.children.forEach((n, i) => {
                n.position.x += (Math.random()-0.5)*0.02;
                n.position.y += (Math.random()-0.5)*0.02;
                n.position.z += (Math.random()-0.5)*0.02;
                // keep them clustered
                n.position.clampLength(0, 0.8);
            });

            // Fast tight orbit
            const angle1 = time * 8;
            const angle2 = time * 8 + Math.PI;
            
            e1.position.set(Math.cos(angle1)*2, Math.sin(time*12)*0.5, Math.sin(angle1)*2);
            e2.position.set(Math.cos(angle2)*2, Math.cos(time*12)*0.5, Math.sin(angle2)*2);

            // Update binding chains
            chain1Geo.attributes.position.array[3] = e1.position.x;
            chain1Geo.attributes.position.array[4] = e1.position.y;
            chain1Geo.attributes.position.array[5] = e1.position.z;
            chain1Geo.attributes.position.needsUpdate = true;
            
            chain2Geo.attributes.position.array[3] = e2.position.x;
            chain2Geo.attributes.position.array[4] = e2.position.y;
            chain2Geo.attributes.position.array[5] = e2.position.z;
            chain2Geo.attributes.position.needsUpdate = true;

            group.rotation.x = time * 0.2;
            group.rotation.y = time * 0.3;
        },
        cleanup: () => {
            pGeo.dispose(); pMat.dispose(); nMat.dispose();
            coreShell.geometry.dispose(); coreShell.material.dispose();
            eGeo.dispose(); eMat.dispose();
            chain1Geo.dispose(); chain2Geo.dispose(); chainMat.dispose();
        }
    };
}