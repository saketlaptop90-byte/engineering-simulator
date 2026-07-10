import { darkSteel, chrome, carbonFiber, blueAccent } from '../utils/materials.js';

export function createCarbonNanotubeWeaver(THREE) {
    const group = new THREE.Group();
    group.name = 'Carbon Nanotube Weaver';

    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 2, 0.5, 32), darkSteel);
    group.add(base);

    const tubeGeo = new THREE.CylinderGeometry(0.3, 0.3, 4, 16);
    // Move origin to bottom so it scales up from base
    tubeGeo.translate(0, 2, 0); 
    const tube = new THREE.Mesh(tubeGeo, carbonFiber);
    tube.position.y = 0.25;
    group.add(tube);

    const ringGeo = new THREE.TorusGeometry(0.8, 0.1, 16, 32);
    const ring = new THREE.Mesh(ringGeo, chrome);
    ring.position.y = 2.5;
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    const spindles = new THREE.Group();
    spindles.position.y = 2.5;
    group.add(spindles);

    for (let i = 0; i < 6; i++) {
        const spindle = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.6), blueAccent);
        spindle.position.set(0.6 * Math.cos(i * Math.PI / 3), 0, 0.6 * Math.sin(i * Math.PI / 3));
        spindle.rotation.x = Math.PI / 2;
        spindles.add(spindle);
    }

    const duration = 2;
    const ringTimes = [];
    const ringQuats = [];
    for(let i=0; i<=8; i++) {
        const t = (i / 8) * duration;
        const ang = i * Math.PI / 2;
        const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), ang);
        ringTimes.push(t);
        ringQuats.push(q.x, q.y, q.z, q.w);
    }

    const ringRot = new THREE.QuaternionKeyframeTrack(
        `${spindles.uuid}.quaternion`,
        ringTimes,
        ringQuats
    );

    const tubeScale = new THREE.VectorKeyframeTrack(
        `${tube.uuid}.scale`,
        [0, 2],
        [1, 0.01, 1,  1, 1, 1]
    );

    const ringPos = new THREE.VectorKeyframeTrack(
        `${ring.uuid}.position`,
        [0, 2],
        [0, 0.5, 0,  0, 4.5, 0]
    );

    const spindlesPos = new THREE.VectorKeyframeTrack(
        `${spindles.uuid}.position`,
        [0, 2],
        [0, 0.5, 0,  0, 4.5, 0]
    );

    const clip = new THREE.AnimationClip('Weave', duration, [
        ringRot, tubeScale, ringPos, spindlesPos
    ]);

    return { group, animationClips: [clip] };
}
