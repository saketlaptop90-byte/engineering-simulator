import * as mats from '../utils/materials.js';

export function createTBMShield(THREE) {
    const group = new THREE.Group();
    group.name = 'TBMShield';
    
    // Shield body
    const bodyGeo = new THREE.CylinderGeometry(3, 3, 8, 32);
    // rotate so it's horizontal
    bodyGeo.rotateZ(Math.PI / 2);
    const body = new THREE.Mesh(bodyGeo, mats.steel);
    body.position.y = 3;
    group.add(body);

    // Cutter Head
    const headGroup = new THREE.Group();
    headGroup.name = 'CutterHead';
    headGroup.position.set(4.1, 3, 0); // front of the shield
    group.add(headGroup);

    const headGeo = new THREE.CylinderGeometry(3.1, 3.1, 0.5, 32);
    headGeo.rotateZ(Math.PI / 2);
    const headMesh = new THREE.Mesh(headGeo, mats.orangeAccent);
    headGroup.add(headMesh);

    // Add some cutters (teeth)
    for(let i=0; i<8; i++) {
        const toothGeo = new THREE.BoxGeometry(0.6, 0.3, 0.3);
        const tooth = new THREE.Mesh(toothGeo, mats.titanium);
        const angle = (i / 8) * Math.PI * 2;
        tooth.position.set(0.3, Math.cos(angle)*2.5, Math.sin(angle)*2.5);
        headGroup.add(tooth);
    }

    // Screw Conveyor
    const screwGeo = new THREE.CylinderGeometry(0.5, 0.5, 4, 16);
    screwGeo.rotateZ(Math.PI / 2);
    const screw = new THREE.Mesh(screwGeo, mats.darkSteel);
    screw.position.set(-2, 1, 0);
    screw.name = 'ScrewConveyor';
    group.add(screw);

    // Animation: Cutter head rotates, screw rotates
    const times = [0, 5];
    const rotStart = new THREE.Quaternion().setFromEuler(new THREE.Euler(0,0,0));
    const rotEnd = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI * 2, 0, 0));
    
    const headTrack = new THREE.QuaternionKeyframeTrack('CutterHead.quaternion', times, [
        rotStart.x, rotStart.y, rotStart.z, rotStart.w,
        rotEnd.x, rotEnd.y, rotEnd.z, rotEnd.w
    ]);

    const screwTrack = new THREE.QuaternionKeyframeTrack('ScrewConveyor.quaternion', times, [
        rotStart.x, rotStart.y, rotStart.z, rotStart.w,
        rotEnd.x, rotEnd.y, rotEnd.z, rotEnd.w
    ]);

    const clip = new THREE.AnimationClip('TBMBoring', 5.0, [headTrack, screwTrack]);

    return { group, animationClips: [clip] };
}
