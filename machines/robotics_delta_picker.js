import { materials } from '../utils/materials.js';

export function createDeltaPicker(THREE) {
    const group = new THREE.Group();
    
    const matBase = materials?.metal || new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.2 });
    const matArms = materials?.carbon || new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.3, roughness: 0.8 });
    const matEffector = materials?.accent || new THREE.MeshStandardMaterial({ color: 0xff3300, metalness: 0.5, roughness: 0.5 });
    
    // Top Base
    const topBaseGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.2, 6);
    const topBase = new THREE.Mesh(topBaseGeo, matBase);
    topBase.position.y = 5;
    group.add(topBase);

    // End Effector
    const effectorGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 6);
    const effector = new THREE.Mesh(effectorGeo, matEffector);
    effector.position.y = 1;
    group.add(effector);

    const arms = [];
    const tracks = [];
    
    for (let i = 0; i < 3; i++) {
        const angle = (i * Math.PI * 2) / 3;
        
        const bicepGroup = new THREE.Group();
        bicepGroup.position.set(Math.cos(angle) * 1.2, 5, Math.sin(angle) * 1.2);
        bicepGroup.rotation.y = -angle;
        group.add(bicepGroup);

        const bicepGeo = new THREE.BoxGeometry(0.2, 2, 0.2);
        const bicep = new THREE.Mesh(bicepGeo, matArms);
        bicep.position.y = -1;
        bicepGroup.add(bicep);
        
        arms.push(bicepGroup);

        // Forearm (just visual line to effector)
        const forearmGeo = new THREE.CylinderGeometry(0.05, 0.05, 3, 8);
        const forearm = new THREE.Mesh(forearmGeo, matArms);
        forearm.position.set(0, -2, 0);
        bicepGroup.add(forearm);

        // Animation for bicep
        const times = [0, 1, 2, 3, 4];
        const val1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0.2);
        const val2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), -0.5);
        const val3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0.5);
        
        const qValues = [
            val1.x, val1.y, val1.z, val1.w,
            val2.x, val2.y, val2.z, val2.w,
            val3.x, val3.y, val3.z, val3.w,
            val2.x, val2.y, val2.z, val2.w,
            val1.x, val1.y, val1.z, val1.w
        ];
        
        tracks.push(new THREE.QuaternionKeyframeTrack(`${bicepGroup.uuid}.quaternion`, times, qValues));
    }

    // Effector position animation
    const times = [0, 1, 2, 3, 4];
    const posValues = [
        0, 1, 0,
        0, 2.5, 0,
        1, 1.5, 1,
        -1, 1.5, -1,
        0, 1, 0
    ];
    tracks.push(new THREE.VectorKeyframeTrack(`${effector.uuid}.position`, times, posValues));

    const animationClip = new THREE.AnimationClip('DeltaMovement', 4, tracks);

    return { group, animationClips: [animationClip] };
}
