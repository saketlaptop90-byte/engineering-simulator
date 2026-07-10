import { materials } from '../utils/materials.js';

export function createSubstationSwitchgear(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base Frame
    const baseGeom = new THREE.BoxGeometry(6, 1, 4);
    const base = new THREE.Mesh(baseGeom, materials.darkSteel);
    group.add(base);

    // Insulators (porcelain)
    const insGeom = new THREE.CylinderGeometry(0.3, 0.5, 3, 16);
    const ins1 = new THREE.Mesh(insGeom, materials.porcelain);
    ins1.position.set(-2, 2, 0);
    const ins2 = new THREE.Mesh(insGeom, materials.porcelain);
    ins2.position.set(2, 2, 0);
    group.add(ins1);
    group.add(ins2);

    // Conductors and Switch Arms (copper / brass)
    const armGeom = new THREE.BoxGeometry(3, 0.2, 0.4);
    const switchArmGroup = new THREE.Group();
    switchArmGroup.name = 'switchArmGroup';
    switchArmGroup.position.set(-2, 3.5, 0); // Pivot point

    const arm = new THREE.Mesh(armGeom, materials.copper);
    arm.position.set(1.5, 0, 0); // Offset so it pivots from one end
    switchArmGroup.add(arm);
    group.add(switchArmGroup);
    
    // Spark / Arc (using a mesh with scaling or opacity animation)
    const arcGeom = new THREE.BoxGeometry(4, 0.1, 0.1);
    // Note: materials should be cloned or we just use a basic material for sparks.
    const arcMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0 });
    const arc = new THREE.Mesh(arcGeom, arcMat);
    arc.name = 'arc';
    arc.position.set(0, 3.5, 0);
    group.add(arc);

    // Animation: Switch opening and closing, and spark flashing
    // Switch arm rotation
    const qOpen = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI / 4);
    const qClosed = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0);

    const armTrack = new THREE.QuaternionKeyframeTrack(
        'switchArmGroup.quaternion',
        [0, 1, 2, 3, 4],
        [qClosed.x, qClosed.y, qClosed.z, qClosed.w,
         qOpen.x, qOpen.y, qOpen.z, qOpen.w,
         qOpen.x, qOpen.y, qOpen.z, qOpen.w,
         qClosed.x, qClosed.y, qClosed.z, qClosed.w,
         qClosed.x, qClosed.y, qClosed.z, qClosed.w]
    );

    // Arc opacity track
    const arcOpacityTrack = new THREE.NumberKeyframeTrack(
        'arc.material.opacity',
        [0, 2.8, 2.9, 3.0, 3.1, 4],
        [0, 0, 1, 0, 1, 0]
    );

    const clip = new THREE.AnimationClip('SwitchOperation', 4, [armTrack, arcOpacityTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
