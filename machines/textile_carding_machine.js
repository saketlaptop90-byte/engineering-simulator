import * as materials from '../utils/materials.js';

export function createCardingMachine(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const frameMat = materials.frameMaterial || new THREE.MeshStandardMaterial({ color: 0x4a5568 });
    const cylinderMat = materials.cylinderMaterial || new THREE.MeshStandardMaterial({ color: 0xa0aec0, wireframe: false });

    // Main cylinder
    const mainCylinderGeo = new THREE.CylinderGeometry(2, 2, 3, 64);
    const mainCyl = new THREE.Mesh(mainCylinderGeo, cylinderMat);
    mainCyl.rotation.x = Math.PI / 2;
    mainCyl.position.y = 2.5;
    
    const mainCylGroup = new THREE.Group();
    mainCylGroup.position.copy(mainCyl.position);
    mainCyl.position.set(0, 0, 0); // reset relative
    mainCylGroup.add(mainCyl);
    group.add(mainCylGroup);

    // Licker-in roller
    const lickerCylGeo = new THREE.CylinderGeometry(0.8, 0.8, 3, 32);
    const lickerCyl = new THREE.Mesh(lickerCylGeo, cylinderMat);
    lickerCyl.rotation.x = Math.PI / 2;
    
    const lickerGroup = new THREE.Group();
    lickerGroup.position.set(-2.2, 1.8, 0);
    lickerGroup.add(lickerCyl);
    group.add(lickerGroup);

    // Doffer roller
    const dofferCylGeo = new THREE.CylinderGeometry(1.2, 1.2, 3, 32);
    const dofferCyl = new THREE.Mesh(dofferCylGeo, cylinderMat);
    dofferCyl.rotation.x = Math.PI / 2;

    const dofferGroup = new THREE.Group();
    dofferGroup.position.set(2.5, 2.0, 0);
    dofferGroup.add(dofferCyl);
    group.add(dofferGroup);

    // Base frame
    const baseGeo = new THREE.BoxGeometry(7, 0.5, 4);
    const base = new THREE.Mesh(baseGeo, frameMat);
    base.position.y = -0.25;
    group.add(base);

    // Animation
    const duration = 2;
    const times = [];
    const mainVals = [];
    const lickerVals = [];
    const dofferVals = [];

    for (let i = 0; i <= 30; i++) {
        const t = (i / 30) * duration;
        times.push(t);
        const angle = (i / 30) * Math.PI * 2;
        
        const qMain = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), angle);
        mainVals.push(qMain.x, qMain.y, qMain.z, qMain.w);

        const qLicker = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), angle * 2); // faster
        lickerVals.push(qLicker.x, qLicker.y, qLicker.z, qLicker.w);

        const qDoffer = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -angle * 0.5); // slower, opposite
        dofferVals.push(qDoffer.x, qDoffer.y, qDoffer.z, qDoffer.w);
    }

    const track1 = new THREE.QuaternionKeyframeTrack(`${mainCylGroup.uuid}.quaternion`, times, mainVals);
    const track2 = new THREE.QuaternionKeyframeTrack(`${lickerGroup.uuid}.quaternion`, times, lickerVals);
    const track3 = new THREE.QuaternionKeyframeTrack(`${dofferGroup.uuid}.quaternion`, times, dofferVals);

    const clip = new THREE.AnimationClip('CardingAction', duration, [track1, track2, track3]);
    animationClips.push(clip);

    return { group, animationClips };
}
