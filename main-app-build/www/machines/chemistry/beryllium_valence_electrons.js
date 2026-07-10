import * as THREE from 'three';

export function createBerylliumValenceElectrons(scene, renderer, camera) {
    const group = new THREE.Group();

    // Focus heavily on the two 2s valence electrons that govern Beryllium's chemical properties.
    // Core is greyed out. Valence shell is bright and interactive.

    // Core (Nucleus + 1s shell)
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x444444, transparent: true, opacity: 0.8 });
    const core = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), coreMat);
    group.add(core);

    // Valence Shell (2s)
    const valGeo = new THREE.SphereGeometry(5, 64, 64);
    const valMat = new THREE.MeshBasicMaterial({ color: 0x00c8ff, wireframe: true, transparent: true, opacity: 0.15 });
    const valenceShell = new THREE.Mesh(valGeo, valMat);
    group.add(valenceShell);

    // The two valence electrons
    const eGeo = new THREE.SphereGeometry(0.5, 32, 32);
    const eMat = new THREE.MeshPhongMaterial({ color: 0xffff00, emissive: 0xaa5500, shininess: 100 });
    
    const e1 = new THREE.Mesh(eGeo, eMat);
    const e2 = new THREE.Mesh(eGeo, eMat);
    group.add(e1);
    group.add(e2);

    // Add glowing trails for the valence electrons
    const trailMat = new THREE.LineBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.5 });
    const trail1Geo = new THREE.BufferGeometry();
    const trail2Geo = new THREE.BufferGeometry();
    const trailLen = 50;
    const t1Pos = new Float32Array(trailLen * 3);
    const t2Pos = new Float32Array(trailLen * 3);
    trail1Geo.setAttribute('position', new THREE.BufferAttribute(t1Pos, 3));
    trail2Geo.setAttribute('position', new THREE.BufferAttribute(t2Pos, 3));
    const trail1 = new THREE.Line(trail1Geo, trailMat);
    const trail2 = new THREE.Line(trail2Geo, trailMat);
    group.add(trail1);
    group.add(trail2);

    const light = new THREE.PointLight(0xffffff, 2, 20);
    group.add(light);
    group.add(new THREE.AmbientLight(0x404040, 2));

    let time = 0;

    return {
        update: () => {
            time += 0.016;

            // Move valence electrons in a complex 3D orbit
            const angle1 = time * 2;
            const angle2 = time * 2.1 + Math.PI; // slightly different speed to break symmetry eventually
            
            const p1 = new THREE.Vector3(
                Math.cos(angle1) * 5,
                Math.sin(angle1*0.5) * 5,
                Math.sin(angle1) * 5
            );
            
            const p2 = new THREE.Vector3(
                Math.cos(angle2) * 5,
                Math.sin(angle2*0.7) * 5,
                Math.sin(angle2) * 5
            );

            e1.position.copy(p1);
            e2.position.copy(p2);

            // Update trails
            for(let i=trailLen-1; i>0; i--) {
                t1Pos[i*3] = t1Pos[(i-1)*3];
                t1Pos[i*3+1] = t1Pos[(i-1)*3+1];
                t1Pos[i*3+2] = t1Pos[(i-1)*3+2];
                
                t2Pos[i*3] = t2Pos[(i-1)*3];
                t2Pos[i*3+1] = t2Pos[(i-1)*3+1];
                t2Pos[i*3+2] = t2Pos[(i-1)*3+2];
            }
            t1Pos[0] = p1.x; t1Pos[1] = p1.y; t1Pos[2] = p1.z;
            t2Pos[0] = p2.x; t2Pos[1] = p2.y; t2Pos[2] = p2.z;
            
            trail1Geo.attributes.position.needsUpdate = true;
            trail2Geo.attributes.position.needsUpdate = true;
            
            // Pulse the valence shell
            valenceShell.scale.setScalar(1 + Math.sin(time*10)*0.02);
            
            group.rotation.y = time * 0.1;
        },
        cleanup: () => {
            core.geometry.dispose(); coreMat.dispose();
            valGeo.dispose(); valMat.dispose();
            eGeo.dispose(); eMat.dispose();
            trail1Geo.dispose(); trail2Geo.dispose(); trailMat.dispose();
        }
    };
}