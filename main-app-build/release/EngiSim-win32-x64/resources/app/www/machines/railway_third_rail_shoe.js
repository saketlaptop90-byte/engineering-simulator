import { materials } from '../utils/materials.js';

export function createThirdRailShoe(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main Arm Base
    const baseGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.5);
    const baseMat = (materials && materials.metalDark) || new THREE.MeshStandardMaterial({color: 0x444444});
    const base = new THREE.Mesh(baseGeo, baseMat);
    group.add(base);

    // Main Arm
    const armGeo = new THREE.BoxGeometry(0.8, 0.15, 0.15);
    const arm = new THREE.Mesh(armGeo, baseMat);
    arm.position.set(0.4, 0, 0);
    group.add(arm);

    // Shoe pivot
    const shoePivot = new THREE.Group();
    shoePivot.name = 'ShoePivot';
    shoePivot.position.set(0.8, 0, 0);
    arm.add(shoePivot);

    // Shoe paddle
    const shoeGeo = new THREE.BoxGeometry(0.4, 0.1, 0.3);
    const shoeMat = (materials && materials.copper) || new THREE.MeshStandardMaterial({color: 0xb87333});
    const shoe = new THREE.Mesh(shoeGeo, shoeMat);
    shoe.position.set(0.1, -0.1, 0);
    shoePivot.add(shoe);

    // Animation: Shoe suspension flexing along the track
    const times = [0, 0.5, 1, 1.5, 2];
    
    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0.1));
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -0.1));
    const qNeutral = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));

    const trackValues = [
        qNeutral.x, qNeutral.y, qNeutral.z, qNeutral.w,
        q1.x, q1.y, q1.z, q1.w,
        qNeutral.x, qNeutral.y, qNeutral.z, qNeutral.w,
        q2.x, q2.y, q2.z, q2.w,
        qNeutral.x, qNeutral.y, qNeutral.z, qNeutral.w
    ];

    const track = new THREE.QuaternionKeyframeTrack(shoePivot.uuid + '.quaternion', times, trackValues);
    const clip = new THREE.AnimationClip('FlexShoe', 2, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
