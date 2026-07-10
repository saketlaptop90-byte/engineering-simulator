import { getMaterial } from '../utils/materials.js';

export function createSEM(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const baseGeo = new THREE.BoxGeometry(4, 0.5, 4);
    const baseMat = getMaterial('metal_dark', THREE) || new THREE.MeshStandardMaterial({ color: 0x333333 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.25;
    group.add(base);

    // Column
    const colGeo = new THREE.CylinderGeometry(0.8, 1, 5, 32);
    const colMat = getMaterial('metal_light', THREE) || new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const column = new THREE.Mesh(colGeo, colMat);
    column.position.y = 3 + 0.5;
    group.add(column);

    // Sample Chamber
    const chamberGeo = new THREE.BoxGeometry(3, 2, 3);
    const chamberMat = getMaterial('metal_brushed', THREE) || new THREE.MeshStandardMaterial({ color: 0x666666 });
    const chamber = new THREE.Mesh(chamberGeo, chamberMat);
    chamber.position.y = 1.5;
    group.add(chamber);

    // Electron Beam (Visual)
    const beamGeo = new THREE.CylinderGeometry(0.02, 0.05, 3, 8);
    const beamMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.8 });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.y = 2.5;
    beam.name = 'ElectronBeam';
    group.add(beam);

    // Animation: Beam scanning back and forth
    const times = [0, 1, 2, 3, 4];
    
    // Create quaternions for scanning rotation
    const q0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.05, 0, 0.05));
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.05, 0, 0.05));
    const q3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -0.05));
    
    const values = [
        ...q0.toArray(),
        ...q1.toArray(),
        ...q2.toArray(),
        ...q3.toArray(),
        ...q0.toArray()
    ];

    const beamTrack = new THREE.QuaternionKeyframeTrack(`${beam.name}.quaternion`, times, values);
    const clip = new THREE.AnimationClip('ScanningBeam', 4, [beamTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
