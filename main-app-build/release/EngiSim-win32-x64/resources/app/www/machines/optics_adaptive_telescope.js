import * as sharedMaterials from '../utils/materials.js';

export function createAdaptiveTelescope(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const getMat = (name, fallback) => (sharedMaterials[name] || (sharedMaterials.default && sharedMaterials.default[name]) || fallback);

    const metalMat = getMat('metal', new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.3 }));
    const mirrorMat = getMat('mirror', new THREE.MeshStandardMaterial({ color: 0xddddff, metalness: 1.0, roughness: 0.0 }));

    // Mount
    const mountGeom = new THREE.CylinderGeometry(2, 3, 2, 32);
    const mount = new THREE.Mesh(mountGeom, metalMat);
    mount.position.set(0, 1, 0);
    group.add(mount);

    const armGeom = new THREE.BoxGeometry(1, 4, 1);
    const arm1 = new THREE.Mesh(armGeom, metalMat);
    arm1.position.set(2.5, 4, 0);
    group.add(arm1);
    const arm2 = new THREE.Mesh(armGeom, metalMat);
    arm2.position.set(-2.5, 4, 0);
    group.add(arm2);

    const telescopeTube = new THREE.Group();
    telescopeTube.position.set(0, 5, 0);
    telescopeTube.rotation.x = Math.PI / 4;
    group.add(telescopeTube);

    // Primary Mirror Segments
    const segments = [];
    const hexGeom = new THREE.CylinderGeometry(0.9, 0.9, 0.2, 6);
    hexGeom.rotateX(Math.PI / 2); // Face forward

    const positions = [
        [0, 0], [1.6, 0], [-1.6, 0],
        [0.8, 1.4], [-0.8, 1.4],
        [0.8, -1.4], [-0.8, -1.4]
    ];

    positions.forEach((pos, i) => {
        const seg = new THREE.Mesh(hexGeom, mirrorMat);
        seg.position.set(pos[0], pos[1], -2);
        seg.name = `Segment_${i}`;
        telescopeTube.add(seg);
        segments.push(seg);
    });

    // Secondary Mirror Support
    const strutGeom = new THREE.CylinderGeometry(0.05, 0.05, 4);
    const strut1 = new THREE.Mesh(strutGeom, metalMat);
    strut1.position.set(1, 1, 0);
    strut1.rotation.x = Math.PI / 2;
    strut1.rotation.y = -Math.PI / 6;
    telescopeTube.add(strut1);

    const secondaryMirrorGeom = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 16);
    secondaryMirrorGeom.rotateX(Math.PI / 2);
    const secondaryMirror = new THREE.Mesh(secondaryMirrorGeom, mirrorMat);
    secondaryMirror.position.set(0, 0, 2);
    telescopeTube.add(secondaryMirror);

    // Animations: Segment tilt
    const tracks = [];
    segments.forEach((seg, i) => {
        const times = [0, 1 + i * 0.2, 2 + i * 0.2, 4];
        const initialRot = new THREE.Quaternion().setFromEuler(seg.rotation);
        const tiltX = new THREE.Euler(0.1, 0, 0);
        const tiltRot = new THREE.Quaternion().setFromEuler(tiltX);
        const values = [
            initialRot.x, initialRot.y, initialRot.z, initialRot.w,
            tiltRot.x, tiltRot.y, tiltRot.z, tiltRot.w,
            initialRot.x, initialRot.y, initialRot.z, initialRot.w,
            initialRot.x, initialRot.y, initialRot.z, initialRot.w
        ];
        tracks.push(new THREE.QuaternionKeyframeTrack(`${seg.name}.quaternion`, times, values));
    });

    const clip = new THREE.AnimationClip('AdaptiveOptics', 4, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
