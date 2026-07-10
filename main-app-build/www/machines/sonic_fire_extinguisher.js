import { darkSteel, titanium, gold } from '../utils/materials.js';

export function createSonicFireExtinguisher(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Cylinder Body
    const tubeGeo = new THREE.CylinderGeometry(0.8, 0.8, 2, 32);
    const tube = new THREE.Mesh(tubeGeo, darkSteel);
    tube.rotation.x = Math.PI / 2;
    group.add(tube);

    // Funnel / Cone
    const coneGeo = new THREE.CylinderGeometry(1.5, 0.8, 1, 32);
    const cone = new THREE.Mesh(coneGeo, titanium);
    cone.position.z = 1.5;
    cone.rotation.x = Math.PI / 2;
    group.add(cone);

    // Speaker Diaphragm
    const diagGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.1, 32);
    const diag = new THREE.Mesh(diagGeo, gold);
    diag.name = 'diaphragm';
    diag.position.z = 0.95;
    diag.rotation.x = Math.PI / 2;
    group.add(diag);

    // Fire Particles
    const fireGroup = new THREE.Group();
    fireGroup.position.z = 3;
    group.add(fireGroup);
    
    const fireGeo = new THREE.TetrahedronGeometry(0.2);
    const fireMat = new THREE.MeshBasicMaterial({ color: 0xff4400, wireframe: true });
    const fires = [];
    for(let i=0; i<10; i++) {
        const f = new THREE.Mesh(fireGeo, fireMat);
        f.name = `fire_${i}`;
        f.position.set((Math.random()-0.5), (Math.random()-0.5), (Math.random()-0.5));
        fireGroup.add(f);
        fires.push(f);
    }

    const tracks = [];
    
    // Diaphragm pumping
    const dTimes = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
    const dZ = [0.95, 1.1, 0.95, 1.1, 0.95, 1.1, 0.95, 1.1, 0.95, 1.1, 0.95];
    const dPos = dZ.flatMap(z => [0, 0, z]);
    tracks.push(new THREE.VectorKeyframeTrack(`diaphragm.position`, dTimes, dPos));

    // Fire shrinking
    fires.forEach(f => {
        tracks.push(new THREE.VectorKeyframeTrack(`${f.name}.scale`, [0, 0.5, 1.0], [
            1,1,1,  0.1,0.1,0.1,  1,1,1
        ]));
    });

    animationClips.push(new THREE.AnimationClip('ExtinguisherAction', 1, tracks));

    return { group, animationClips };
}
