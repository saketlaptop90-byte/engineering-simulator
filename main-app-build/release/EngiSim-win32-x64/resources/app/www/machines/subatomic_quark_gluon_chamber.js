import { darkSteel, glass, copper, gold } from '../utils/materials.js';

export function createQuarkGluonChamber(THREE) {
    const group = new THREE.Group();
    group.name = "QuarkGluonChamber";

    const base = new THREE.Mesh(new THREE.CylinderGeometry(4, 5, 2, 32), darkSteel);
    base.position.y = 1;
    group.add(base);

    const containment = new THREE.Mesh(new THREE.SphereGeometry(3.5, 32, 32), glass);
    containment.position.y = 6;
    group.add(containment);

    const plasmaCore = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.5, 2),
        new THREE.MeshBasicMaterial({ color: 0xff0055, wireframe: true, transparent: true, opacity: 0.8 })
    );
    plasmaCore.name = "PlasmaCore";
    plasmaCore.position.y = 6;
    group.add(plasmaCore);

    const ring = new THREE.Mesh(new THREE.TorusGeometry(4, 0.15, 16, 100), gold);
    ring.name = "ConfinementRing";
    ring.position.y = 6;
    group.add(ring);

    const times = [0, 1, 2];
    const scales = [1, 1, 1, 1.4, 1.4, 1.4, 1, 1, 1];
    const scaleTrack = new THREE.VectorKeyframeTrack('PlasmaCore.scale', times, scales);

    const q0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI, Math.PI, 0));
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI * 2, Math.PI * 2, 0));
    const rotTrack = new THREE.QuaternionKeyframeTrack('ConfinementRing.quaternion', times, [
        q0.x, q0.y, q0.z, q0.w,
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w
    ]);

    const clip = new THREE.AnimationClip('PlasmaContainment', 2, [scaleTrack, rotTrack]);

    return { group, animationClips: [clip] };
}
