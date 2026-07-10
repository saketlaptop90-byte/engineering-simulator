import * as materials from '../utils/materials.js';

export function createRotarySteerableSystem(THREE) {
    const group = new THREE.Group();
    group.name = "RotarySteerableSystem";

    const matMetal = materials.metalMaterial || materials.metal || new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.3 });
    const matBlue = materials.primaryMaterial || materials.highlight || new THREE.MeshStandardMaterial({ color: 0x0055ff, metalness: 0.4, roughness: 0.4 });
    const matDrill = materials.darkMaterial || materials.dark || new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.6 });

    // Drill collar
    const collarGeo = new THREE.CylinderGeometry(0.8, 0.8, 6, 32);
    const collar = new THREE.Mesh(collarGeo, matMetal);
    collar.position.y = 3;
    group.add(collar);

    // RSS Bias Unit (Steering unit)
    const biasGroup = new THREE.Group();
    biasGroup.position.y = -1;
    group.add(biasGroup);

    const housingGeo = new THREE.CylinderGeometry(0.9, 0.9, 2, 32);
    const housing = new THREE.Mesh(housingGeo, matBlue);
    biasGroup.add(housing);

    // Steering Pads (3 pads)
    const padTracks = [];
    const padTimes = [0, 0.5, 1, 1.5, 2];

    for (let i = 0; i < 3; i++) {
        const padGroup = new THREE.Group();
        padGroup.name = `steerPad${i}`;
        
        const padGeo = new THREE.BoxGeometry(0.5, 1.6, 0.2);
        const pad = new THREE.Mesh(padGeo, matMetal);
        pad.position.z = 0.9;
        
        const angle = (i * 2 * Math.PI) / 3;
        padGroup.rotation.y = angle;
        
        padGroup.add(pad);
        biasGroup.add(padGroup);

        pad.name = `padMesh${i}`;
        const z0 = 0.9;
        const zOut = 1.3;
        
        const padPos = [
            0, 0, z0,
            0, 0, i === 0 ? zOut : z0,
            0, 0, i === 1 ? zOut : z0,
            0, 0, i === 2 ? zOut : z0,
            0, 0, z0
        ];
        padTracks.push(new THREE.VectorKeyframeTrack(`padMesh${i}.position`, padTimes, padPos));
    }

    // Drill Bit
    const bitGroup = new THREE.Group();
    bitGroup.name = "drillBit";
    bitGroup.position.y = -2.5;
    group.add(bitGroup);

    const bitGeo = new THREE.ConeGeometry(1.1, 1.5, 12);
    const bit = new THREE.Mesh(bitGeo, matDrill);
    bit.rotation.x = Math.PI; // point downwards
    bitGroup.add(bit);

    // Rotate Bit
    const rotTimes = [0, 1, 2];
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 2*Math.PI);

    const bitRotTrack = new THREE.QuaternionKeyframeTrack('drillBit.quaternion', rotTimes, [
        ...q1.toArray(), ...q2.toArray(), ...q3.toArray()
    ]);

    const clip = new THREE.AnimationClip('RSS_Steering', 2, [...padTracks, bitRotTrack]);

    return { group, animationClips: [clip] };
}
