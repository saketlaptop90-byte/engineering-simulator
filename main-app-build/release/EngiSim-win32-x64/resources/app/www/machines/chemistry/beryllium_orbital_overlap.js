import * as THREE from 'three';

export function createBerylliumOrbitalOverlap(scene, renderer, camera) {
    const group = new THREE.Group();

    // Visualizes a Be atom forming a bond (e.g., BeH2), showing orbital overlap
    // Be uses an sp hybridized orbital to overlap with H 1s orbitals.
    
    // Central Be atom
    const beNucleus = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffaa00 })
    );
    group.add(beNucleus);

    // Two H nuclei
    const hGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const hMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    const h1 = new THREE.Mesh(hGeo, hMat);
    h1.position.set(-3, 0, 0);
    group.add(h1);
    
    const h2 = new THREE.Mesh(hGeo, hMat);
    h2.position.set(3, 0, 0);
    group.add(h2);

    // Be sp hybrid orbitals (two large lobes pointing outwards)
    const spGeo = new THREE.SphereGeometry(1.5, 32, 32);
    // Stretch
    const pos = spGeo.attributes.position.array;
    for(let i=0; i<pos.length; i+=3) {
        if(pos[i] < 0) {
            pos[i] *= 0.5; // small back lobe
        } else {
            pos[i] *= 2.0; // large front lobe
        }
    }
    spGeo.computeVertexNormals();

    const spMat = new THREE.MeshPhysicalMaterial({
        color: 0xff0044,
        transparent: true,
        opacity: 0.5,
        transmission: 0.5,
        roughness: 0.2
    });

    const sp1 = new THREE.Mesh(spGeo, spMat);
    sp1.position.set(-0.5, 0, 0); // shift slightly
    sp1.rotation.y = Math.PI; // point left
    group.add(sp1);

    const sp2 = new THREE.Mesh(spGeo, spMat);
    sp2.position.set(0.5, 0, 0);
    // points right natively
    group.add(sp2);

    // H 1s orbitals
    const sGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const sMat = new THREE.MeshPhysicalMaterial({
        color: 0x00c8ff,
        transparent: true,
        opacity: 0.5,
        transmission: 0.5,
        roughness: 0.2
    });
    
    const s1 = new THREE.Mesh(sGeo, sMat);
    s1.position.copy(h1.position);
    group.add(s1);

    const s22 = new THREE.Mesh(sGeo, sMat);
    s22.position.copy(h2.position);
    group.add(s22);

    // Add glowing overlap regions (intersection between sp and s)
    const overlapGeo = new THREE.SphereGeometry(0.8, 16, 16);
    const overlapMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
    
    const ov1 = new THREE.Mesh(overlapGeo, overlapMat);
    ov1.position.set(-2, 0, 0);
    ov1.scale.set(1.5, 0.8, 0.8);
    group.add(ov1);

    const ov2 = new THREE.Mesh(overlapGeo, overlapMat);
    ov2.position.set(2, 0, 0);
    ov2.scale.set(1.5, 0.8, 0.8);
    group.add(ov2);

    const light = new THREE.PointLight(0xffffff, 2, 20);
    group.add(light);
    group.add(new THREE.AmbientLight(0x404040, 2));

    let time = 0;

    return {
        update: () => {
            time += 0.016;
            
            // Gently rotate whole molecule
            group.rotation.y = Math.sin(time*0.5) * 0.3;
            group.rotation.x = Math.sin(time*0.3) * 0.1;
            
            // Pulse overlap regions
            const pulse = 1.0 + Math.sin(time * 5) * 0.1;
            ov1.scale.set(1.5 * pulse, 0.8 * pulse, 0.8 * pulse);
            ov2.scale.set(1.5 * pulse, 0.8 * pulse, 0.8 * pulse);
            
            ov1.material.opacity = 0.6 + Math.sin(time * 5) * 0.4;
            ov2.material.opacity = 0.6 + Math.cos(time * 5) * 0.4;
        },
        cleanup: () => {
            beNucleus.geometry.dispose(); beNucleus.material.dispose();
            hGeo.dispose(); hMat.dispose();
            spGeo.dispose(); spMat.dispose();
            sGeo.dispose(); sMat.dispose();
            overlapGeo.dispose(); overlapMat.dispose();
        }
    };
}