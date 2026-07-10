import { colors, getMaterial } from '../utils/materials.js';

export function createTippingBucketRainGauge(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Outer Enclosure
    const enclosureGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
    const enclosureMaterial = getMaterial('metallic', colors.white);
    enclosureMaterial.transparent = true;
    enclosureMaterial.opacity = 0.3; // Make it see-through
    const enclosure = new THREE.Mesh(enclosureGeometry, enclosureMaterial);
    enclosure.position.y = 1;
    group.add(enclosure);

    // Funnel
    const funnelGeometry = new THREE.ConeGeometry(0.5, 0.5, 32, 1, true);
    const funnel = new THREE.Mesh(funnelGeometry, getMaterial('metallic', colors.silver));
    funnel.rotation.x = Math.PI;
    funnel.position.y = 1.75;
    group.add(funnel);

    // Inner Mechanism Base
    const mechBaseGeometry = new THREE.BoxGeometry(0.4, 0.1, 0.4);
    const mechBase = new THREE.Mesh(mechBaseGeometry, getMaterial('plastic', colors.black));
    mechBase.position.y = 0.5;
    group.add(mechBase);

    // Pivot Stand
    const standGeometry = new THREE.BoxGeometry(0.05, 0.3, 0.2);
    const stand = new THREE.Mesh(standGeometry, getMaterial('metallic', colors.darkGrey));
    stand.position.y = 0.7;
    group.add(stand);

    // Tipping Bucket Assembly
    const bucketGroup = new THREE.Group();
    bucketGroup.position.y = 0.85;
    bucketGroup.name = "BucketAssembly";
    group.add(bucketGroup);

    // Bucket Shape
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0.2, 0.15);
    shape.lineTo(0, -0.1);
    shape.lineTo(-0.2, 0.15);
    shape.lineTo(0, 0);

    const extrudeSettings = { depth: 0.2, bevelEnabled: false };
    const bucketGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const bucket = new THREE.Mesh(bucketGeometry, getMaterial('metallic', colors.silver));
    bucket.position.z = -0.1;
    bucketGroup.add(bucket);

    // Animation: Bucket Tipping
    const duration = 4;
    const times = [0, 1.8, 2.0, 3.8, 4.0];
    const maxTip = Math.PI / 6;
    
    const q0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, maxTip));
    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, maxTip));
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -maxTip));
    const q3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -maxTip));
    const q4 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, maxTip));

    const values = [
        q0.x, q0.y, q0.z, q0.w,
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w,
        q4.x, q4.y, q4.z, q4.w
    ];

    const tipTrack = new THREE.QuaternionKeyframeTrack('BucketAssembly.quaternion', times, values);
    
    // Simulate water drop
    const dropGeometry = new THREE.SphereGeometry(0.02, 8, 8);
    const dropMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    const drop = new THREE.Mesh(dropGeometry, dropMaterial);
    drop.name = "WaterDrop";
    group.add(drop);

    const dropTimes = [0, 1.8, 1.81, 2.0, 3.8, 3.81, 4.0];
    const dropPositions = [
        0, 1.5, 0,
        0, 0.9, 0,
        0, 1.5, 0,
        0, 1.5, 0,
        0, 0.9, 0,
        0, 1.5, 0,
        0, 1.5, 0
    ];
    const dropScale = [
        1,1,1, 1,1,1, 0,0,0, 1,1,1, 1,1,1, 0,0,0, 1,1,1
    ];
    const dropPosTrack = new THREE.VectorKeyframeTrack('WaterDrop.position', dropTimes, dropPositions);
    const dropScaleTrack = new THREE.VectorKeyframeTrack('WaterDrop.scale', dropTimes, dropScale);

    const clip = new THREE.AnimationClip('TippingAction', duration, [tipTrack, dropPosTrack, dropScaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
