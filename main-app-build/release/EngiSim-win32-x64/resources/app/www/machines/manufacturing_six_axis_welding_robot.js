import { steel, castIron, orangeAccent, darkSteel, fire } from '../utils/materials.js';

export function createSixAxisWeldingRobot(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const baseGeo = new THREE.CylinderGeometry(1, 1.2, 0.5, 32);
    const base = new THREE.Mesh(baseGeo, castIron);
    base.position.y = 0.25;
    group.add(base);

    // Axis 1 (Waist)
    const waistGeo = new THREE.CylinderGeometry(0.8, 0.8, 1, 32);
    const waist = new THREE.Mesh(waistGeo, orangeAccent);
    waist.position.y = 1;
    waist.name = "Waist";
    group.add(waist);

    // Axis 2 (Shoulder)
    const shoulderGroup = new THREE.Group();
    shoulderGroup.position.y = 0.5;
    waist.add(shoulderGroup);
    shoulderGroup.name = "Shoulder";

    const arm1Geo = new THREE.BoxGeometry(0.5, 3, 0.5);
    const arm1 = new THREE.Mesh(arm1Geo, orangeAccent);
    arm1.position.y = 1.5;
    shoulderGroup.add(arm1);

    // Axis 3 (Elbow)
    const elbowGroup = new THREE.Group();
    elbowGroup.position.y = 3;
    shoulderGroup.add(elbowGroup);
    elbowGroup.name = "Elbow";

    const arm2Geo = new THREE.BoxGeometry(0.4, 2, 0.4);
    const arm2 = new THREE.Mesh(arm2Geo, orangeAccent);
    arm2.position.y = 1;
    elbowGroup.add(arm2);

    // Axis 4, 5, 6 (Wrist and Torch)
    const wristGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.5, 16);
    const wrist = new THREE.Mesh(wristGeo, darkSteel);
    wrist.position.y = 2;
    elbowGroup.add(wrist);

    const torchGeo = new THREE.ConeGeometry(0.1, 0.5, 16);
    const torch = new THREE.Mesh(torchGeo, steel);
    torch.position.y = 0.5;
    wrist.add(torch);

    const sparkGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const spark = new THREE.Mesh(sparkGeo, fire);
    spark.position.y = 0.3;
    torch.add(spark);

    // Animation
    const times = [0, 1, 2, 3, 4];
    
    // Waist rotation
    const waistRot = [
        0,0,0,1,
        0,0.3826834,0,0.9238795, // 45 deg
        0,0.7071068,0,0.7071068, // 90 deg
        0,0.3826834,0,0.9238795,
        0,0,0,1
    ];
    const waistTrack = new THREE.QuaternionKeyframeTrack(waist.name + '.quaternion', times, waistRot);

    // Shoulder rotation
    const shoulderRot = [
        0,0,0,1,
        0.1305262,0,0,0.9914449, // 15 deg
        0.258819,0,0,0.9659258, // 30 deg
        0.1305262,0,0,0.9914449,
        0,0,0,1
    ];
    const shoulderTrack = new THREE.QuaternionKeyframeTrack(shoulderGroup.name + '.quaternion', times, shoulderRot);

    // Spark visibility (scale)
    spark.name = "Spark";
    const sparkTimes = [0, 0.5, 1, 1.5, 2, 2.5, 3];
    const sparkScale = [
        0,0,0,
        1,1,1,
        0,0,0,
        1,1,1,
        0,0,0,
        1,1,1,
        0,0,0
    ];
    const sparkTrack = new THREE.VectorKeyframeTrack(spark.name + '.scale', sparkTimes, sparkScale);

    const clip = new THREE.AnimationClip('WeldCycle', 4, [waistTrack, shoulderTrack, sparkTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
