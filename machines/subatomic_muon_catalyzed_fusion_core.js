import { darkSteel, glass, copper, gold } from '../utils/materials.js';

export function createMuonCatalyzedFusionCore(THREE) {
    const group = new THREE.Group();
    group.name = "MuonCatalyzedFusionCore";

    const pedestal = new THREE.Mesh(new THREE.BoxGeometry(6, 1, 6), darkSteel);
    pedestal.position.y = 0.5;
    group.add(pedestal);

    const core = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 8, 32), glass);
    core.position.y = 5;
    group.add(core);

    const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.5, 7.8, 16),
        new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.9 })
    );
    beam.name = "MuonBeam";
    beam.position.y = 5;
    group.add(beam);

    const coil1 = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.3, 16, 64), copper);
    coil1.name = "Coil1";
    coil1.rotation.x = Math.PI / 2;
    coil1.position.y = 3;
    group.add(coil1);

    const coil2 = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.3, 16, 64), copper);
    coil2.name = "Coil2";
    coil2.rotation.x = Math.PI / 2;
    coil2.position.y = 7;
    group.add(coil2);

    const times = [0, 0.5, 1];
    const beamScales = [1, 1, 1, 1.5, 1, 1.5, 1, 1, 1];
    const scaleTrack = new THREE.VectorKeyframeTrack('MuonBeam.scale', times, beamScales);

    const q0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0));
    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, Math.PI, 0));
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, Math.PI * 2, 0));
    const coilTrack1 = new THREE.QuaternionKeyframeTrack('Coil1.quaternion', times, [
        q0.x, q0.y, q0.z, q0.w, q1.x, q1.y, q1.z, q1.w, q2.x, q2.y, q2.z, q2.w
    ]);
    const coilTrack2 = new THREE.QuaternionKeyframeTrack('Coil2.quaternion', times, [
        q0.x, q0.y, q0.z, q0.w, q1.x, q1.y, q1.z, q1.w, q2.x, q2.y, q2.z, q2.w
    ]);

    const clip = new THREE.AnimationClip('FusionProcess', 1, [scaleTrack, coilTrack1, coilTrack2]);

    return { group, animationClips: [clip] };
}
