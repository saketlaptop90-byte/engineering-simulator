import { steel, yellowAccent, darkSteel, redAccent, blueAccent } from '../utils/materials.js';

export function createStarshipDockingBay(THREE) {
    const group = new THREE.Group();

    // Hangar / Bay Structure
    const bayGeo = new THREE.CylinderGeometry(80, 80, 200, 32, 1, true, 0, Math.PI);
    const bayMat = steel.clone();
    bayMat.side = THREE.DoubleSide;
    const bay = new THREE.Mesh(bayGeo, bayMat);
    bay.rotation.x = Math.PI / 2;
    group.add(bay);

    // Flooring
    const floorGeo = new THREE.BoxGeometry(160, 5, 200);
    const floor = new THREE.Mesh(floorGeo, darkSteel);
    group.add(floor);

    // Docking Arms
    const leftArmGroup = new THREE.Group();
    leftArmGroup.name = "LeftArm";
    leftArmGroup.position.set(-60, 0, 0);

    const armBaseGeo = new THREE.CylinderGeometry(5, 5, 20);
    const leftBase = new THREE.Mesh(armBaseGeo, darkSteel);
    leftArmGroup.add(leftBase);

    const armExtGeo = new THREE.BoxGeometry(40, 5, 5);
    const leftExt = new THREE.Mesh(armExtGeo, yellowAccent);
    leftExt.position.x = 20;
    leftArmGroup.add(leftExt);
    group.add(leftArmGroup);

    const rightArmGroup = new THREE.Group();
    rightArmGroup.name = "RightArm";
    rightArmGroup.position.set(60, 0, 0);
    
    const rightBase = new THREE.Mesh(armBaseGeo, darkSteel);
    rightArmGroup.add(rightBase);

    const rightExt = new THREE.Mesh(armExtGeo, yellowAccent);
    rightExt.position.x = -20;
    rightArmGroup.add(rightExt);
    group.add(rightArmGroup);

    // Ship
    const shipGroup = new THREE.Group();
    shipGroup.name = "Ship";
    shipGroup.position.set(0, 20, 150); // Starts outside
    
    const hullGeo = new THREE.CapsuleGeometry(15, 50, 16, 32);
    const hull = new THREE.Mesh(hullGeo, blueAccent);
    hull.rotation.x = Math.PI / 2;
    shipGroup.add(hull);

    const engineGeo = new THREE.CylinderGeometry(8, 12, 15, 16);
    const engine = new THREE.Mesh(engineGeo, redAccent);
    engine.position.z = 35;
    engine.rotation.x = Math.PI / 2;
    shipGroup.add(engine);

    group.add(shipGroup);

    // Animation
    // 1. Ship moves in
    // 2. Arms rotate to clamp

    const times = [0, 4, 6, 10];
    // Ship position (x, y, z)
    const shipVals = [
        0, 20, 150, // t=0
        0, 20, 0,   // t=4
        0, 20, 0,   // t=6
        0, 20, 150  // t=10
    ];
    const shipPosTrack = new THREE.VectorKeyframeTrack('Ship.position', times, shipVals);

    // Left Arm Rotation
    const la0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), -Math.PI/2); // open
    const la1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), -Math.PI/2);
    const la2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0); // clamped
    const la3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), -Math.PI/2);
    
    // Right Arm Rotation
    const ra0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI/2); // open
    const ra1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI/2);
    const ra2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0); // clamped
    const ra3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI/2);

    const leftArmTrack = new THREE.QuaternionKeyframeTrack('LeftArm.quaternion', times, [
        la0.x, la0.y, la0.z, la0.w,
        la1.x, la1.y, la1.z, la1.w,
        la2.x, la2.y, la2.z, la2.w,
        la3.x, la3.y, la3.z, la3.w,
    ]);

    const rightArmTrack = new THREE.QuaternionKeyframeTrack('RightArm.quaternion', times, [
        ra0.x, ra0.y, ra0.z, ra0.w,
        ra1.x, ra1.y, ra1.z, ra1.w,
        ra2.x, ra2.y, ra2.z, ra2.w,
        ra3.x, ra3.y, ra3.z, ra3.w,
    ]);

    const clip = new THREE.AnimationClip('DockingSequence', 10, [shipPosTrack, leftArmTrack, rightArmTrack]);

    return { group, animationClips: [clip] };
}
