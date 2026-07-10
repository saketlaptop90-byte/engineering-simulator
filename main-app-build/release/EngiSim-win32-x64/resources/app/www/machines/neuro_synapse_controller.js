import { darkSteel, aluminum, copper } from '../utils/materials.js';

export function createSynapseController(THREE) {
    const group = new THREE.Group();
    group.name = "SynapseController";

    const coreGeo = new THREE.IcosahedronGeometry(0.4, 1);
    const core = new THREE.Mesh(coreGeo, copper);
    core.name = "SynapseCore";
    group.add(core);

    const shellGeo = new THREE.IcosahedronGeometry(0.6, 1);
    // Since materials are imported, we clone one to make it unique for this instance
    const shellMaterial = aluminum.clone();
    shellMaterial.transparent = true;
    shellMaterial.opacity = 0.5;
    shellMaterial.wireframe = true;
    const shell = new THREE.Mesh(shellGeo, shellMaterial);
    shell.name = "SynapseShell";
    group.add(shell);

    // Core pulsing and shell rotating
    const times = [0, 1.0, 2.0];
    
    // Core scale
    const s1 = [1, 1, 1];
    const s2 = [1.2, 1.2, 1.2];
    const scaleValues = [...s1, ...s2, ...s1];
    const scaleTrack = new THREE.VectorKeyframeTrack('SynapseCore.scale', times, scaleValues);

    // Shell rotation
    const q1 = new THREE.Quaternion().identity();
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI, 0));
    const q3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI * 2, 0));
    const rotValues = [...q1.toArray(), ...q2.toArray(), ...q3.toArray()];
    const rotTrack = new THREE.QuaternionKeyframeTrack('SynapseShell.quaternion', times, rotValues);

    const clip = new THREE.AnimationClip('SynapseFire', 2.0, [scaleTrack, rotTrack]);

    return { group, animationClips: [clip] };
}
