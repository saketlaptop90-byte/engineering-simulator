import { materials } from '../utils/materials.js';

export function createLevelCrossing(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const baseGeo = new THREE.BoxGeometry(1, 0.5, 1);
    const baseMat = (materials && materials.metalDark) || new THREE.MeshStandardMaterial({color: 0x333333});
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.25;
    group.add(base);

    // Pole
    const poleGeo = new THREE.CylinderGeometry(0.1, 0.1, 3);
    const poleMat = (materials && materials.metalLight) || new THREE.MeshStandardMaterial({color: 0x888888});
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.y = 1.5;
    group.add(pole);

    // Barrier Pivot
    const pivot = new THREE.Group();
    pivot.name = 'BarrierPivot';
    pivot.position.set(0, 2.5, 0);
    group.add(pivot);

    // Barrier
    const barrierGeo = new THREE.BoxGeometry(4, 0.2, 0.1);
    const barrierMat = (materials && materials.metalPaintedRed) || new THREE.MeshStandardMaterial({color: 0xff0000});
    const barrier = new THREE.Mesh(barrierGeo, barrierMat);
    barrier.position.set(2, 0, 0); // Offset so it pivots from the end
    pivot.add(barrier);

    // Animation: Barrier lowering and raising
    const times = [0, 2, 4, 6];
    
    // Create quaternion track
    const qUp = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI/2)); // Up position
    const qDown = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)); // Down position

    const trackValues = [
        qUp.x, qUp.y, qUp.z, qUp.w,
        qDown.x, qDown.y, qDown.z, qDown.w,
        qDown.x, qDown.y, qDown.z, qDown.w,
        qUp.x, qUp.y, qUp.z, qUp.w
    ];

    const trackName = pivot.uuid + '.quaternion';
    const track = new THREE.QuaternionKeyframeTrack(trackName, times, trackValues);
    
    const clip = new THREE.AnimationClip('LowerBarrier', 6, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
