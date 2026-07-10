import * as THREE from 'three';

export function createBerylliumShieldingEffect(scene, renderer, camera) {
    const group = new THREE.Group();

    // Visualizes shielding: 
    // Core electrons (1s) form a barrier that shields valence electrons (2s) from full nuclear pull.

    const nucleus = new THREE.Mesh(
        new THREE.SphereGeometry(0.4, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0xff0044 })
    );
    group.add(nucleus);

    // Inner 1s shell (Core electrons)
    const coreShell = new THREE.Mesh(
        new THREE.SphereGeometry(2, 32, 32),
        new THREE.MeshBasicMaterial({ 
            color: 0x4444ff, 
            transparent: true, 
            opacity: 0.3,
            depthWrite: false 
        })
    );
    group.add(coreShell);

    // Add 2 electrons inside core
    const eGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const eMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    const coreE1 = new THREE.Mesh(eGeo, eMat);
    const coreE2 = new THREE.Mesh(eGeo, eMat);
    group.add(coreE1);
    group.add(coreE2);

    // Valence electron
    const valE1 = new THREE.Mesh(eGeo, eMat);
    const valE2 = new THREE.Mesh(eGeo, eMat);
    group.add(valE1);
    group.add(valE2);

    // Shielding visualization: Ray/Beam from nucleus gets partially blocked by core shell
    const beamGeo = new THREE.CylinderGeometry(0.05, 0.5, 5, 16);
    // Move origin to tip
    beamGeo.translate(0, 2.5, 0); 
    const beamMat = new THREE.MeshBasicMaterial({
        color: 0xffaa00,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const beams = [];

    // Attach beams pointing from nucleus to valence electrons
    for(let i=0; i<2; i++) {
        const beam = new THREE.Mesh(beamGeo, beamMat);
        group.add(beam);
        beams.push(beam);
    }

    let time = 0;

    return {
        update: () => {
            time += 0.016;

            // Animate core electrons tightly
            coreE1.position.set(Math.cos(time*2)*1.5, Math.sin(time*2)*1.5, 0);
            coreE2.position.set(Math.cos(time*2 + Math.PI)*1.5, Math.sin(time*2 + Math.PI)*1.5, 0);

            // Animate valence electrons loosely
            valE1.position.set(Math.cos(time*0.5)*4, 0, Math.sin(time*0.5)*4);
            valE2.position.set(Math.cos(time*0.6 + Math.PI)*4, Math.sin(time*0.6 + Math.PI)*4, 0);
            
            // Pulse core shell to show "shielding" activity
            coreShell.scale.setScalar(1 + Math.sin(time * 5)*0.05);
            coreShell.material.opacity = 0.3 + Math.sin(time * 5)*0.1;

            // Beams follow valence electrons
            const targets = [valE1.position, valE2.position];
            beams.forEach((beam, i) => {
                // Point beam from center to valence
                const target = targets[i];
                const dir = target.clone().normalize();
                
                // Align cylinder along direction
                const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), dir);
                beam.quaternion.copy(quaternion);
                
                // Dynamic opacity: inside core (strong), outside core (weak due to shielding)
                // We use a custom shader for this ideally, but for simple mesh, just pulse it
                beam.material.opacity = 0.2 + Math.sin(time*10 + i)*0.1;
            });

            group.rotation.y = time * 0.1;
            group.rotation.x = Math.sin(time * 0.2) * 0.2;
        },
        cleanup: () => {
            nucleus.geometry.dispose();
            nucleus.material.dispose();
            coreShell.geometry.dispose();
            coreShell.material.dispose();
            eGeo.dispose();
            eMat.dispose();
            beamGeo.dispose();
            beamMat.dispose();
        }
    };
}