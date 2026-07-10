import { materials } from '../utils/materials.js';

export function createCommutatorDCMotor(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const copper = materials?.copper || new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.8, roughness: 0.3 });
    const steel = materials?.steel || new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.4 });
    const iron = materials?.iron || new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.7, roughness: 0.6 });
    const carbon = materials?.carbon || new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9 });
    const sparkMat = materials?.spark || new THREE.MeshBasicMaterial({ color: 0xffffaa, transparent: true, opacity: 0.8 });

    // Stator
    const statorGeom = new THREE.TorusGeometry(5, 1, 16, 64);
    const stator = new THREE.Mesh(statorGeom, iron);
    group.add(stator);

    // Rotor
    const rotorGroup = new THREE.Group();
    const rotorCoreGeom = new THREE.CylinderGeometry(3.8, 3.8, 4, 16);
    const rotorCore = new THREE.Mesh(rotorCoreGeom, steel);
    rotorCore.rotation.x = Math.PI / 2;
    rotorGroup.add(rotorCore);

    // Windings (Copper)
    const windingGeom = new THREE.BoxGeometry(7, 4.5, 4.5);
    const windings = new THREE.Mesh(windingGeom, copper);
    rotorGroup.add(windings);

    // Commutator
    const commGeom = new THREE.CylinderGeometry(2, 2, 2, 16);
    const commutator = new THREE.Mesh(commGeom, copper);
    commutator.position.z = 3;
    commutator.rotation.x = Math.PI / 2;
    rotorGroup.add(commutator);

    group.add(rotorGroup);

    // Brushes (Carbon)
    const brushGeom = new THREE.BoxGeometry(1, 1.5, 1);
    const topBrush = new THREE.Mesh(brushGeom, carbon);
    topBrush.position.set(0, 2.5, 3);
    const bottomBrush = new THREE.Mesh(brushGeom, carbon);
    bottomBrush.position.set(0, -2.5, 3);
    group.add(topBrush, bottomBrush);

    // Sparks
    const sparkGeom = new THREE.SphereGeometry(0.2, 8, 8);
    const spark1 = new THREE.Mesh(sparkGeom, sparkMat);
    spark1.position.set(0, 2.1, 3);
    const spark2 = new THREE.Mesh(sparkGeom, sparkMat);
    spark2.position.set(0, -2.1, 3);
    group.add(spark1, spark2);

    // Animations
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 2*Math.PI);
    
    const rotorTrack = new THREE.QuaternionKeyframeTrack(
        'Rotor.quaternion',
        [0, 1, 2],
        [...q1.toArray(), ...q2.toArray(), ...q3.toArray()]
    );
    
    const sparkScaleTrack = new THREE.VectorKeyframeTrack(
        '.scale',
        [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        [1,1,1, 1.5,1.5,1.5, 0.5,0.5,0.5, 2,2,2, 1,1,1, 0.2,0.2,0.2, 1.8,1.8,1.8, 0.8,0.8,0.8, 1.2,1.2,1.2, 0.5,0.5,0.5, 1.5,1.5,1.5]
    );

    rotorGroup.name = 'Rotor';
    spark1.name = 'Spark1';
    spark2.name = 'Spark2';
    
    const sTrack1 = sparkScaleTrack.clone();
    sTrack1.name = 'Spark1.scale';
    const sTrack2 = sparkScaleTrack.clone();
    sTrack2.name = 'Spark2.scale';

    const motorClip = new THREE.AnimationClip('DC_Motor_Run', 2, [rotorTrack, sTrack1, sTrack2]);
    animationClips.push(motorClip);

    return { group, animationClips };
}
