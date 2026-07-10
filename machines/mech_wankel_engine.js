import { darkSteel, aluminum, brass } from '../utils/materials.js';

export function createWankelEngine(THREE) {
    const group = new THREE.Group();
    group.name = 'WankelEngine';

    const shape = new THREE.Shape();
    for (let i = 0; i <= 64; i++) {
        const theta = (i / 64) * Math.PI * 2;
        const R = 3;
        const e = 1;
        const x = R * Math.cos(theta) + e * Math.cos(3 * theta);
        const y = R * Math.sin(theta) + e * Math.sin(3 * theta);
        if (i === 0) shape.moveTo(x, y);
        else shape.lineTo(x, y);
    }
    const extrudeSettings = { depth: 2, bevelEnabled: false };
    const housingGeom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const housing = new THREE.Mesh(housingGeom, darkSteel);
    housing.position.z = -1.5;
    group.add(housing);

    const shaftGroup = new THREE.Group();
    shaftGroup.name = 'eccentricShaft';
    group.add(shaftGroup);

    const shaftGeom = new THREE.CylinderGeometry(0.5, 0.5, 4, 16);
    const shaft = new THREE.Mesh(shaftGeom, aluminum);
    shaft.rotation.x = Math.PI / 2;
    shaftGroup.add(shaft);

    const rotorGroup = new THREE.Group();
    rotorGroup.name = 'rotor';
    group.add(rotorGroup);

    const rotorShape = new THREE.Shape();
    for (let i = 0; i <= 3; i++) {
        const angle = (i / 3) * Math.PI * 2;
        const x = 3.5 * Math.cos(angle);
        const y = 3.5 * Math.sin(angle);
        if (i === 0) rotorShape.moveTo(x, y);
        else rotorShape.lineTo(x, y);
    }
    const rotorGeom = new THREE.ExtrudeGeometry(rotorShape, { depth: 1, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.2, bevelThickness: 0.2 });
    const rotor = new THREE.Mesh(rotorGeom, brass);
    rotor.position.z = -0.5;
    rotorGroup.add(rotor);

    const duration = 3; 
    const frames = 60;
    const times = [];
    const rotorPos = [];
    const rotorRot = [];
    const shaftRot = [];

    for (let i = 0; i <= frames; i++) {
        const t = (i / frames) * duration;
        times.push(t);

        const shaftAngle = (i / frames) * Math.PI * 2 * 3;
        const rotorAngle = (i / frames) * Math.PI * 2;

        const qS = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), shaftAngle);
        shaftRot.push(qS.x, qS.y, qS.z, qS.w);

        const e = 1;
        const rx = e * Math.cos(shaftAngle);
        const ry = e * Math.sin(shaftAngle);
        rotorPos.push(rx, ry, 0);

        const qR = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), rotorAngle);
        rotorRot.push(qR.x, qR.y, qR.z, qR.w);
    }

    const shaftTrack = new THREE.QuaternionKeyframeTrack('eccentricShaft.quaternion', times, shaftRot);
    const rotorPosTrack = new THREE.VectorKeyframeTrack('rotor.position', times, rotorPos);
    const rotorRotTrack = new THREE.QuaternionKeyframeTrack('rotor.quaternion', times, rotorRot);

    const clip = new THREE.AnimationClip('WankelAction', duration, [shaftTrack, rotorPosTrack, rotorRotTrack]);

    return { group, animationClips: [clip] };
}
