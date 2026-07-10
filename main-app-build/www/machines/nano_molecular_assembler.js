import { titanium, chrome, darkSteel, blueAccent, redAccent, glass } from '../utils/materials.js';

export function createMolecularAssembler(THREE) {
    const group = new THREE.Group();
    group.name = 'Molecular Assembler';

    // Base plate
    const baseGeo = new THREE.CylinderGeometry(2, 2, 0.2, 32);
    const base = new THREE.Mesh(baseGeo, darkSteel);
    base.position.y = 0.1;
    group.add(base);

    // Chamber
    const chamberGeo = new THREE.CylinderGeometry(1.8, 1.8, 3, 32, 1, true);
    const chamber = new THREE.Mesh(chamberGeo, glass);
    chamber.position.y = 1.7;
    group.add(chamber);

    // Arms
    const armGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8);
    const arm1 = new THREE.Mesh(armGeo, titanium);
    arm1.position.set(-1, 1.5, 0);
    group.add(arm1);

    const arm2 = new THREE.Mesh(armGeo, titanium);
    arm2.position.set(1, 1.5, 0);
    group.add(arm2);

    // Atoms
    const atomGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const atom1 = new THREE.Mesh(atomGeo, redAccent);
    atom1.position.set(-0.5, 1.5, 0);
    group.add(atom1);

    const atom2 = new THREE.Mesh(atomGeo, blueAccent);
    atom2.position.set(0.5, 1.5, 0);
    group.add(atom2);

    const bondedAtomGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const bondedAtom = new THREE.Mesh(bondedAtomGeo, chrome);
    bondedAtom.position.set(0, 1.5, 0);
    bondedAtom.scale.set(0.01, 0.01, 0.01);
    group.add(bondedAtom);

    // Animations
    const duration = 2;

    const q1a = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), -Math.PI/4);
    const q1b = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0);
    const arm1Rot = new THREE.QuaternionKeyframeTrack(
        `${arm1.uuid}.quaternion`,
        [0, 1, 2],
        [q1a.x, q1a.y, q1a.z, q1a.w, q1b.x, q1b.y, q1b.z, q1b.w, q1a.x, q1a.y, q1a.z, q1a.w]
    );

    const q2a = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI/4);
    const q2b = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0);
    const arm2Rot = new THREE.QuaternionKeyframeTrack(
        `${arm2.uuid}.quaternion`,
        [0, 1, 2],
        [q2a.x, q2a.y, q2a.z, q2a.w, q2b.x, q2b.y, q2b.z, q2b.w, q2a.x, q2a.y, q2a.z, q2a.w]
    );

    const atom1Pos = new THREE.VectorKeyframeTrack(
        `${atom1.uuid}.position`,
        [0, 1, 2],
        [-0.5, 1.5, 0,  -0.1, 1.5, 0,  -0.5, 1.5, 0]
    );

    const atom2Pos = new THREE.VectorKeyframeTrack(
        `${atom2.uuid}.position`,
        [0, 1, 2],
        [0.5, 1.5, 0,  0.1, 1.5, 0,  0.5, 1.5, 0]
    );

    const atom1Scale = new THREE.VectorKeyframeTrack(
        `${atom1.uuid}.scale`,
        [0, 0.9, 1, 2],
        [1, 1, 1,  1, 1, 1,  0.01, 0.01, 0.01,  1, 1, 1]
    );

    const atom2Scale = new THREE.VectorKeyframeTrack(
        `${atom2.uuid}.scale`,
        [0, 0.9, 1, 2],
        [1, 1, 1,  1, 1, 1,  0.01, 0.01, 0.01,  1, 1, 1]
    );

    const bondedScale = new THREE.VectorKeyframeTrack(
        `${bondedAtom.uuid}.scale`,
        [0, 0.9, 1, 1.9, 2],
        [0.01, 0.01, 0.01,  0.01, 0.01, 0.01,  1, 1, 1,  1, 1, 1,  0.01, 0.01, 0.01]
    );

    const clip = new THREE.AnimationClip('Assemble', duration, [
        arm1Rot, arm2Rot, atom1Pos, atom2Pos, atom1Scale, atom2Scale, bondedScale
    ]);

    return { group, animationClips: [clip] };
}
