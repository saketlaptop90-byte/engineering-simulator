import { materials } from '../utils/materials.js';

export function createFrothFlotationCell(THREE) {
    const group = new THREE.Group();
    group.name = "FrothFlotationGroup";

    const getMat = (name, params) => (materials && materials[name]) || new THREE.MeshStandardMaterial(params);
    const tankMat = getMat('metalTank', {color: 0x4aa564, roughness: 0.8});
    const agitatorMat = getMat('steel', {color: 0x777777});
    const frothMat = getMat('froth', {color: 0xdddddd, transparent: true, opacity: 0.85, roughness: 1.0});

    // Tank Body
    const tankGeo = new THREE.CylinderGeometry(5, 4, 8, 32);
    const tank = new THREE.Mesh(tankGeo, tankMat);
    group.add(tank);

    // Froth layer on top
    const frothGeo = new THREE.CylinderGeometry(4.8, 5, 1, 32);
    const froth = new THREE.Mesh(frothGeo, frothMat);
    froth.position.y = 4.5;
    // slightly animate froth up and down
    froth.name = "FrothLayer";
    group.add(froth);

    // Agitator Assembly
    const agitatorGroup = new THREE.Group();
    agitatorGroup.name = "Agitator";
    group.add(agitatorGroup);

    // Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.3, 0.3, 10, 16);
    const shaft = new THREE.Mesh(shaftGeo, agitatorMat);
    agitatorGroup.add(shaft);

    // Stator/Rotor Impeller
    const impellerGeo = new THREE.BoxGeometry(3, 0.4, 0.8);
    for (let i=0; i<4; i++) {
        const blade = new THREE.Mesh(impellerGeo, agitatorMat);
        blade.position.y = -3;
        blade.rotation.y = (i * Math.PI) / 4;
        agitatorGroup.add(blade);
    }

    // Motor on top
    const motorGeo = new THREE.BoxGeometry(2, 2, 2);
    const motor = new THREE.Mesh(motorGeo, tankMat);
    motor.position.y = 5.5;
    group.add(motor);

    // Animations
    const times = [0, 1, 2];
    const yAxis = new THREE.Vector3(0, 1, 0);
    const rotValues = [
        ...new THREE.Quaternion().setFromAxisAngle(yAxis, 0).toArray(),
        ...new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI).toArray(),
        ...new THREE.Quaternion().setFromAxisAngle(yAxis, Math.PI * 2).toArray()
    ];
    const rotTrack = new THREE.QuaternionKeyframeTrack('Agitator.quaternion', times, rotValues);

    const posTimes = [0, 1, 2];
    const posValues = [
        0, 4.4, 0,
        0, 4.6, 0,
        0, 4.4, 0
    ];
    const posTrack = new THREE.VectorKeyframeTrack('FrothLayer.position', posTimes, posValues);

    const clip = new THREE.AnimationClip('FlotationProcess', 2, [rotTrack, posTrack]);

    return { group, animationClips: [clip] };
}
