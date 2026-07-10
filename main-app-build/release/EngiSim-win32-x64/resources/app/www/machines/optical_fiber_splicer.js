import { getMaterials } from '../utils/materials.js';

export function createFiberSplicer(THREE) {
    const group = new THREE.Group();
    const materials = getMaterials(THREE);
    
    // Splicer body
    const bodyGeo = new THREE.BoxGeometry(6, 4, 4);
    const body = new THREE.Mesh(bodyGeo, materials.plastic);
    body.position.y = 2;
    group.add(body);

    // Working area / V-groove base
    const vGrooveBaseGeo = new THREE.BoxGeometry(3, 1, 2);
    const vGrooveBase = new THREE.Mesh(vGrooveBaseGeo, materials.metal);
    vGrooveBase.position.set(0, 4.5, 0);
    group.add(vGrooveBase);

    // Left Clamp
    const leftClampGroup = new THREE.Group();
    leftClampGroup.position.set(-2, 5, 0);
    leftClampGroup.name = "leftClamp";
    group.add(leftClampGroup);

    const leftClamp = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.5, 1), materials.chrome);
    leftClampGroup.add(leftClamp);

    const leftFiber = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3), materials.glass);
    leftFiber.rotation.z = Math.PI / 2;
    leftFiber.position.x = 1.5;
    leftClampGroup.add(leftFiber);

    // Right Clamp
    const rightClampGroup = new THREE.Group();
    rightClampGroup.position.set(2, 5, 0);
    rightClampGroup.name = "rightClamp";
    group.add(rightClampGroup);

    const rightClamp = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.5, 1), materials.chrome);
    rightClampGroup.add(rightClamp);

    const rightFiber = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3), materials.glass);
    rightFiber.rotation.z = Math.PI / 2;
    rightFiber.position.x = -1.5;
    rightClampGroup.add(rightFiber);

    // Electrodes
    const electrodeMat = materials.metal;
    const electrode1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.1, 1), electrodeMat);
    electrode1.position.set(0, 5, -1);
    electrode1.rotation.x = Math.PI / 2;
    group.add(electrode1);

    const electrode2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.1, 1), electrodeMat);
    electrode2.position.set(0, 5, 1);
    electrode2.rotation.x = -Math.PI / 2;
    group.add(electrode2);

    // Arc Spark
    const sparkGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const sparkMat = new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0 });
    const spark = new THREE.Mesh(sparkGeo, sparkMat);
    spark.position.set(0, 5, 0);
    spark.name = "arcSpark";
    group.add(spark);

    // Screen
    const screenGeo = new THREE.PlaneGeometry(2.5, 1.5);
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 2.5, 2.01);
    group.add(screen);

    // Animation: Alignment and Splicing
    const times = [0, 1, 2, 2.5, 3, 4];
    
    // Clamps moving in
    const leftXValues = [-2, -1.5, -1.45, -1.45, -1.45, -2];
    const rightXValues = [2, 1.5, 1.45, 1.45, 1.45, 2];
    const leftTrack = new THREE.NumberKeyframeTrack(`${leftClampGroup.name}.position[x]`, times, leftXValues);
    const rightTrack = new THREE.NumberKeyframeTrack(`${rightClampGroup.name}.position[x]`, times, rightXValues);

    // Spark flash
    const sparkTimes = [0, 1.9, 2, 2.2, 2.4, 2.5, 4];
    const sparkOpacities = [0, 0, 1, 0.5, 1, 0, 0];
    const sparkScales = [1, 1, 1.5, 1, 1.5, 1, 1];
    const sparkOpacityTrack = new THREE.NumberKeyframeTrack(`${spark.name}.material.opacity`, sparkTimes, sparkOpacities);
    
    // Scale track for spark (x, y, z)
    const sparkScaleValues = [];
    for (let s of sparkScales) sparkScaleValues.push(s, s, s);
    const sparkScaleTrack = new THREE.VectorKeyframeTrack(`${spark.name}.scale`, sparkTimes, sparkScaleValues);

    const clip = new THREE.AnimationClip('SplicingCycle', 4, [leftTrack, rightTrack, sparkOpacityTrack, sparkScaleTrack]);

    return { group, animationClips: [clip] };
}
