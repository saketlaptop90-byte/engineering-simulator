import * as materials from '../utils/materials.js';

export function createMudMotor(THREE) {
    const group = new THREE.Group();
    group.name = "MudMotor";

    const matMetal = materials.metalMaterial || materials.metal || new THREE.MeshStandardMaterial({ color: 0x777777, metalness: 0.8, roughness: 0.2 });
    const matGreen = materials.successMaterial || materials.primary || new THREE.MeshStandardMaterial({ color: 0x117722, metalness: 0.3, roughness: 0.5 });
    const matDark = materials.darkMaterial || materials.dark || new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.6, roughness: 0.8 });

    // Top Sub
    const topSub = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 2, 32), matMetal);
    topSub.position.y = 6;
    group.add(topSub);

    // Power Section (Stator Housing)
    const powerGeo = new THREE.CylinderGeometry(0.8, 0.8, 6, 32);
    const powerHousing = new THREE.Mesh(powerGeo, matGreen);
    powerHousing.position.y = 2;
    group.add(powerHousing);

    // Transmission Section (Bent Housing)
    const bentHousingGroup = new THREE.Group();
    bentHousingGroup.position.y = -1;
    bentHousingGroup.rotation.z = 0.05; // ~2.8 degrees bend for directional drilling
    group.add(bentHousingGroup);

    const transGeo = new THREE.CylinderGeometry(0.8, 0.8, 3, 32);
    const trans = new THREE.Mesh(transGeo, matMetal);
    trans.position.y = -1.5;
    bentHousingGroup.add(trans);

    // Bearing Assembly
    const bearingGeo = new THREE.CylinderGeometry(0.85, 0.85, 2, 32);
    const bearing = new THREE.Mesh(bearingGeo, matDark);
    bearing.position.y = -4;
    bentHousingGroup.add(bearing);

    // Drill Bit
    const bitGroup = new THREE.Group();
    bitGroup.position.y = -5.5;
    bitGroup.name = "mudMotorBit";
    bentHousingGroup.add(bitGroup);

    const bitGeo = new THREE.ConeGeometry(1, 1.5, 12);
    const bit = new THREE.Mesh(bitGeo, matMetal);
    bit.rotation.x = Math.PI; // point downwards
    bitGroup.add(bit);

    // Animation: Bit rotates independently of the housing
    const times = [0, 0.5, 1];
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 2*Math.PI);

    const bitRotTrack = new THREE.QuaternionKeyframeTrack('mudMotorBit.quaternion', times, [
        ...q1.toArray(), ...q2.toArray(), ...q3.toArray()
    ]);

    const clip = new THREE.AnimationClip('MudMotor_Drilling', 1, [bitRotTrack]);

    return { group, animationClips: [clip] };
}
