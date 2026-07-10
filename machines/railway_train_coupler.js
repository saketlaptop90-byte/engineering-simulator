import { materials } from '../utils/materials.js';

export function createTrainCoupler(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main Body
    const bodyGeo = new THREE.CylinderGeometry(0.3, 0.3, 1);
    bodyGeo.rotateZ(Math.PI / 2);
    const bodyMat = (materials && materials.metalHeavy) || new THREE.MeshStandardMaterial({color: 0x222222});
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    group.add(body);

    // Knuckle pivot
    const knucklePivot = new THREE.Group();
    knucklePivot.name = 'KnucklePivot';
    knucklePivot.position.set(0.5, 0, 0.15);
    group.add(knucklePivot);

    // Knuckle hook (Torus)
    const knuckleGeo = new THREE.TorusGeometry(0.2, 0.08, 16, 32, Math.PI * 1.5);
    const knuckleMat = (materials && materials.metalSteel) || new THREE.MeshStandardMaterial({color: 0x555555});
    const knuckle = new THREE.Mesh(knuckleGeo, knuckleMat);
    knuckle.position.set(0.1, 0, 0);
    knuckle.rotation.x = Math.PI / 2;
    knucklePivot.add(knuckle);

    // Animation: Knuckle opening and closing
    const times = [0, 1, 2, 3];
    
    const qOpen = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -Math.PI/2, 0));
    const qClosed = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));

    const trackValues = [
        qOpen.x, qOpen.y, qOpen.z, qOpen.w,
        qClosed.x, qClosed.y, qClosed.z, qClosed.w,
        qClosed.x, qClosed.y, qClosed.z, qClosed.w,
        qOpen.x, qOpen.y, qOpen.z, qOpen.w
    ];

    const track = new THREE.QuaternionKeyframeTrack(knucklePivot.uuid + '.quaternion', times, trackValues);
    const clip = new THREE.AnimationClip('LockCoupler', 3, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
