import { getMaterials } from '../utils/materials.js';

export function createRedundancyRelay(THREE) {
    const group = new THREE.Group();
    const materials = getMaterials(THREE);
    const animationClips = [];

    // Housing
    const housingGeo = new THREE.BoxGeometry(2, 3, 2);
    const housingMat = materials.glassClear || new THREE.MeshPhysicalMaterial({ transmission: 0.9, opacity: 1, roughness: 0.2 });
    const housing = new THREE.Mesh(housingGeo, housingMat);
    group.add(housing);

    // Coils
    const coilGeo = new THREE.CylinderGeometry(0.4, 0.4, 1, 16);
    const coilMat = materials.copperCoil || new THREE.MeshStandardMaterial({ color: 0xb87333 });
    
    const coil1 = new THREE.Mesh(coilGeo, coilMat);
    coil1.position.set(-0.5, -0.5, 0);
    group.add(coil1);

    const coil2 = new THREE.Mesh(coilGeo, coilMat);
    coil2.position.set(0.5, -0.5, 0);
    group.add(coil2);

    // Switch Armature
    const armatureGeo = new THREE.BoxGeometry(1.5, 0.1, 0.5);
    const armature = new THREE.Mesh(armatureGeo, materials.metalBright || new THREE.MeshStandardMaterial({ color: 0xffffff }));
    armature.position.set(0, 0.5, 0);
    group.add(armature);

    // Contacts
    const contactGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.2);
    const contactMat = materials.metalDark || new THREE.MeshStandardMaterial({ color: 0x333333 });
    
    const contactL = new THREE.Mesh(contactGeo, contactMat);
    contactL.position.set(-0.6, 0.8, 0);
    group.add(contactL);

    const contactR = new THREE.Mesh(contactGeo, contactMat);
    contactR.position.set(0.6, 0.8, 0);
    group.add(contactR);

    // Spark Effect (Particle)
    const sparkGeo = new THREE.SphereGeometry(0.15);
    const sparkMat = materials.sparkEffect || new THREE.MeshBasicMaterial({ color: 0xaaffff });
    const spark = new THREE.Mesh(sparkGeo, sparkMat);
    spark.position.set(-0.6, 0.65, 0);
    spark.scale.set(0.01, 0.01, 0.01);
    group.add(spark);

    // Animations: Armature toggling between left and right coils
    const times = [0, 1, 1.1, 2, 3, 3.1, 4];
    
    // Armature rotation (tilting left and right)
    const rotLeft = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI/16));
    const rotRight = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -Math.PI/16));
    
    const armatureRotations = [
        rotLeft.x, rotLeft.y, rotLeft.z, rotLeft.w,
        rotLeft.x, rotLeft.y, rotLeft.z, rotLeft.w,
        rotRight.x, rotRight.y, rotRight.z, rotRight.w,
        rotRight.x, rotRight.y, rotRight.z, rotRight.w,
        rotRight.x, rotRight.y, rotRight.z, rotRight.w,
        rotLeft.x, rotLeft.y, rotLeft.z, rotLeft.w,
        rotLeft.x, rotLeft.y, rotLeft.z, rotLeft.w
    ];
    const trackArmature = new THREE.QuaternionKeyframeTrack(`${armature.uuid}.quaternion`, times, armatureRotations);

    // Spark scaling to simulate arcing during switch
    const sparkScales = [
        0.01,0.01,0.01,
        1,1,1,
        0.01,0.01,0.01,
        0.01,0.01,0.01,
        1,1,1,
        0.01,0.01,0.01,
        0.01,0.01,0.01
    ];
    const trackSpark = new THREE.VectorKeyframeTrack(`${spark.uuid}.scale`, times, sparkScales);
    
    // Spark positions
    const sparkPos = [
        -0.6,0.65,0,
        -0.6,0.65,0,
        0.6,0.65,0,
        0.6,0.65,0,
        0.6,0.65,0,
        -0.6,0.65,0,
        -0.6,0.65,0
    ];
    const trackSparkPos = new THREE.VectorKeyframeTrack(`${spark.uuid}.position`, times, sparkPos);

    const clip = new THREE.AnimationClip('Relay_Switchover', 4, [trackArmature, trackSpark, trackSparkPos]);
    animationClips.push(clip);

    return { group, animationClips };
}
