import { getMaterials } from '../utils/materials.js';

export function createHydraulicBladderAccumulator(THREE) {
    const group = new THREE.Group();
    const materials = getMaterials(THREE);
    const mMetal = materials.metal || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 });
    const mIron = materials.iron || new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.6, roughness: 0.6 });
    const mBrass = materials.brass || new THREE.MeshStandardMaterial({ color: 0xb5a642, metalness: 0.7, roughness: 0.3 });
    const mRubber = materials.rubber || new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9, metalness: 0.1 });

    const shellGeom = new THREE.CapsuleGeometry(2, 4, 32, 32);
    const shellMat = mIron.clone();
    shellMat.transparent = true;
    shellMat.opacity = 0.3;
    const shell = new THREE.Mesh(shellGeom, shellMat);
    group.add(shell);

    const bladderGroup = new THREE.Group();
    bladderGroup.name = 'bladderGroup';
    const bladderGeom = new THREE.CapsuleGeometry(1.8, 3, 32, 32);
    const bladder = new THREE.Mesh(bladderGeom, mRubber);
    bladderGroup.add(bladder);
    bladderGroup.position.y = 0.5;
    group.add(bladderGroup);

    const valveGeom = new THREE.CylinderGeometry(0.2, 0.2, 1, 16);
    const valve = new THREE.Mesh(valveGeom, mBrass);
    valve.position.y = 4.5;
    group.add(valve);

    const portGeom = new THREE.CylinderGeometry(0.4, 0.4, 1, 16);
    const port = new THREE.Mesh(portGeom, mMetal);
    port.position.y = -4.5;
    group.add(port);

    const times = [0, 2, 4];
    const scales = [1, 1, 1, 0.7, 0.9, 0.7, 1, 1, 1];
    const track = new THREE.VectorKeyframeTrack(`${bladderGroup.name}.scale`, times, scales);

    const clip = new THREE.AnimationClip('Accumulate', 4, [track]);

    return { group, animationClips: [clip] };
}
