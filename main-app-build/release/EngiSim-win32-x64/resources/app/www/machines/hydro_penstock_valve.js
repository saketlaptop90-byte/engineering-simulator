import { steel, darkSteel, copper, concrete } from '../utils/materials.js';

export function createPenstockValve(THREE) {
    const group = new THREE.Group();
    group.name = 'PenstockValve';

    // Pipe
    const pipeGeo = new THREE.CylinderGeometry(2, 2, 8, 32, 1, true);
    const pipe = new THREE.Mesh(pipeGeo, darkSteel);
    pipe.rotation.z = Math.PI / 2;
    group.add(pipe);

    // Flanges
    const flangeGeo = new THREE.TorusGeometry(2.1, 0.2, 16, 64);
    const flange1 = new THREE.Mesh(flangeGeo, steel);
    flange1.position.x = -4;
    flange1.rotation.y = Math.PI / 2;
    group.add(flange1);

    const flange2 = new THREE.Mesh(flangeGeo, steel);
    flange2.position.x = 4;
    flange2.rotation.y = Math.PI / 2;
    group.add(flange2);

    // Valve Body
    const valveBodyGeo = new THREE.SphereGeometry(2.2, 32, 32);
    const valveBody = new THREE.Mesh(valveBodyGeo, darkSteel);
    valveBody.scale.x = 0.8;
    group.add(valveBody);

    const stemDomeGeo = new THREE.CylinderGeometry(0.8, 1.2, 1.5, 16);
    const stemDome = new THREE.Mesh(stemDomeGeo, steel);
    stemDome.position.y = 2.2;
    group.add(stemDome);

    // Valve Mechanism (Butterfly Valve inside)
    const discGeo = new THREE.CylinderGeometry(1.9, 1.9, 0.2, 32);
    const disc = new THREE.Mesh(discGeo, copper);
    disc.name = 'ValveDisc';
    disc.rotation.x = Math.PI / 2;
    group.add(disc);

    // Actuator / Wheel
    const wheelGroup = new THREE.Group();
    wheelGroup.name = 'ActuatorWheel';
    wheelGroup.position.y = 4;
    group.add(wheelGroup);

    const stemGeo = new THREE.CylinderGeometry(0.2, 0.2, 2, 16);
    const stem = new THREE.Mesh(stemGeo, steel);
    stem.position.y = -1;
    wheelGroup.add(stem);

    const wheelTorusGeo = new THREE.TorusGeometry(1, 0.1, 16, 32);
    const wheelTorus = new THREE.Mesh(wheelTorusGeo, steel);
    wheelTorus.rotation.x = Math.PI / 2;
    wheelGroup.add(wheelTorus);

    const spokeGeo = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
    const spoke1 = new THREE.Mesh(spokeGeo, steel);
    spoke1.rotation.x = Math.PI / 2;
    wheelGroup.add(spoke1);
    const spoke2 = new THREE.Mesh(spokeGeo, steel);
    spoke2.rotation.z = Math.PI / 2;
    wheelGroup.add(spoke2);

    // Animations
    const operateClip = new THREE.AnimationClip('Operate', 6, [
        new THREE.NumberKeyframeTrack('ValveDisc.rotation[x]', [0, 3, 6], [Math.PI / 2, 0, Math.PI / 2]),
        new THREE.NumberKeyframeTrack('ActuatorWheel.rotation[y]', [0, 3, 6], [0, Math.PI * 4, 0])
    ]);

    return { group, animationClips: [operateClip] };
}
