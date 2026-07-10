import * as materials from '../utils/materials.js';

export function createSpotWeldingClamp(THREE) {
    const group = new THREE.Group();

    // Base bracket
    const baseGeo = new THREE.BoxGeometry(0.5, 1.0, 0.5);
    const baseMesh = new THREE.Mesh(baseGeo, materials.castIron || new THREE.MeshStandardMaterial({ color: 0x222222 }));
    group.add(baseMesh);

    // Fixed Arm (Lower)
    const lowerArmGeo = new THREE.BoxGeometry(1.5, 0.2, 0.2);
    const lowerArmMesh = new THREE.Mesh(lowerArmGeo, materials.copper || new THREE.MeshStandardMaterial({ color: 0xb87333 }));
    lowerArmMesh.position.set(0.75, -0.4, 0);
    group.add(lowerArmMesh);

    const lowerElectrodeGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.2);
    const lowerElectrode = new THREE.Mesh(lowerElectrodeGeo, materials.copper || new THREE.MeshStandardMaterial({ color: 0xb87333 }));
    lowerElectrode.position.set(1.4, -0.2, 0);
    group.add(lowerElectrode);

    // Pivot Group for Upper Arm
    const upperArmPivot = new THREE.Group();
    upperArmPivot.position.set(0, 0.4, 0);
    upperArmPivot.name = 'upperArm';
    group.add(upperArmPivot);

    const upperArmGeo = new THREE.BoxGeometry(1.5, 0.2, 0.2);
    const upperArmMesh = new THREE.Mesh(upperArmGeo, materials.copper || new THREE.MeshStandardMaterial({ color: 0xb87333 }));
    upperArmMesh.position.set(0.75, 0, 0);
    upperArmPivot.add(upperArmMesh);

    const upperElectrodeGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.2);
    const upperElectrode = new THREE.Mesh(upperElectrodeGeo, materials.copper || new THREE.MeshStandardMaterial({ color: 0xb87333 }));
    upperElectrode.position.set(1.4, -0.2, 0);
    upperArmPivot.add(upperElectrode);

    // Spark / Flash
    const sparkGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const sparkMat = new THREE.MeshBasicMaterial({ color: 0xffffaa, transparent: true, opacity: 0 });
    const spark = new THREE.Mesh(sparkGeo, sparkMat);
    spark.position.set(1.4, -0.05, 0);
    spark.name = 'spark';
    group.add(spark);

    // Animation: Clamp down, spark, clamp up
    const times = [0, 0.5, 1.5, 2.0];
    const dropAngle = -0.143; // Gap is ~0.2, dist is 1.4. asin(0.2/1.4)
    const rotations = [0, dropAngle, dropAngle, 0];
    const armTrack = new THREE.NumberKeyframeTrack(`upperArm.rotation[z]`, times, rotations);

    const sparkTimes = [0, 0.5, 0.6, 0.8, 1.0, 1.4, 1.5, 2.0];
    const sparkOpacities = [0, 0, 1, 0, 1, 0, 0, 0];
    const sparkTrack = new THREE.NumberKeyframeTrack(`spark.material.opacity`, sparkTimes, sparkOpacities);

    const sparkScaleTimes = [0.5, 0.75, 1.0, 1.25, 1.5];
    const sparkScales = [1,1,1, 1.5,1.5,1.5, 0.8,0.8,0.8, 1.2,1.2,1.2, 1,1,1];
    const sparkScaleTrack = new THREE.VectorKeyframeTrack(`spark.scale`, sparkScaleTimes, sparkScales);

    const clip = new THREE.AnimationClip('SpotWeld', 2, [armTrack, sparkTrack, sparkScaleTrack]);

    return { group, animationClips: [clip] };
}
