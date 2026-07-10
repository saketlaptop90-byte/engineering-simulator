import { darkSteel, glass, copper, gold } from '../utils/materials.js';

export function createHiggsFieldModulator(THREE) {
    const group = new THREE.Group();
    group.name = "HiggsFieldModulator";

    const centerNode = new THREE.Mesh(new THREE.OctahedronGeometry(2, 0), gold);
    centerNode.name = "CenterNode";
    centerNode.position.y = 5;
    group.add(centerNode);

    const fieldShell = new THREE.Mesh(
        new THREE.IcosahedronGeometry(6, 3),
        new THREE.MeshBasicMaterial({ color: 0xffd700, wireframe: true, transparent: true, opacity: 0.2 })
    );
    fieldShell.name = "FieldShell";
    fieldShell.position.y = 5;
    group.add(fieldShell);

    const support1 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 10, 16), darkSteel);
    support1.position.set(4, 5, 4);
    group.add(support1);

    const support2 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 10, 16), darkSteel);
    support2.position.set(-4, 5, -4);
    group.add(support2);

    const times = [0, 2, 4];
    const q0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI, 0));
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI * 2, 0));
    const shellRot = [q0.x, q0.y, q0.z, q0.w, q1.x, q1.y, q1.z, q1.w, q2.x, q2.y, q2.z, q2.w];
    const shellTrack = new THREE.QuaternionKeyframeTrack('FieldShell.quaternion', times, shellRot);

    const nodeScales = [1, 1, 1, 1.8, 1.8, 1.8, 1, 1, 1];
    const nodeTrack = new THREE.VectorKeyframeTrack('CenterNode.scale', times, nodeScales);

    const clip = new THREE.AnimationClip('ModulateField', 4, [shellTrack, nodeTrack]);

    return { group, animationClips: [clip] };
}
