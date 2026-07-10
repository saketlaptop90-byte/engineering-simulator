import { materials } from '../utils/materials.js';

export function createScaraArm(THREE) {
    const group = new THREE.Group();
    
    // Default materials if the imported ones are not fully defined
    const matBase = materials?.metal || new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.4, metalness: 0.8 });
    const matArm1 = materials?.plastic || new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.3, metalness: 0.2 });
    const matArm2 = materials?.accent || new THREE.MeshStandardMaterial({ color: 0xffaa00, roughness: 0.3, metalness: 0.5 });
    
    const baseGeo = new THREE.CylinderGeometry(1, 1.2, 0.5, 32);
    const base = new THREE.Mesh(baseGeo, matBase);
    base.position.y = 0.25;
    group.add(base);

    const pillarGeo = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
    const pillar = new THREE.Mesh(pillarGeo, matBase);
    pillar.position.y = 1.25;
    group.add(pillar);

    // Link 1
    const link1 = new THREE.Group();
    link1.position.set(0, 2.25, 0);
    group.add(link1);

    const arm1Geo = new THREE.BoxGeometry(3, 0.5, 1);
    const arm1 = new THREE.Mesh(arm1Geo, matArm1);
    arm1.position.set(1.5, 0, 0);
    link1.add(arm1);

    const joint2Geo = new THREE.CylinderGeometry(0.6, 0.6, 0.6, 32);
    const joint2 = new THREE.Mesh(joint2Geo, matBase);
    joint2.position.set(3, 0, 0);
    link1.add(joint2);

    // Link 2
    const link2 = new THREE.Group();
    link2.position.set(3, 0, 0);
    link1.add(link2);

    const arm2Geo = new THREE.BoxGeometry(2.5, 0.4, 0.8);
    const arm2 = new THREE.Mesh(arm2Geo, matArm2);
    arm2.position.set(1.25, 0, 0);
    link2.add(arm2);

    // Z-axis mechanism
    const zAxisGeo = new THREE.CylinderGeometry(0.2, 0.2, 2, 16);
    const zAxis = new THREE.Mesh(zAxisGeo, matBase);
    zAxis.position.set(2.5, 0, 0);
    link2.add(zAxis);

    // Animation clips
    const duration = 4;
    const times = [0, 1, 2, 3, 4];

    // Link1 rotation
    const link1Values = [
        0, 0, 0, 1,
        0, 0.707, 0, 0.707, // 90 deg
        0, 0, 0, 1, // 0 deg
        0, -0.707, 0, 0.707, // -90 deg
        0, 0, 0, 1
    ];
    const track1 = new THREE.QuaternionKeyframeTrack(`${link1.uuid}.quaternion`, times, link1Values);

    // Link2 rotation
    const link2Values = [
        0, 0, 0, 1,
        0, -0.382, 0, 0.924, // -45 deg
        0, 0, 0, 1,
        0, 0.382, 0, 0.924, // 45 deg
        0, 0, 0, 1
    ];
    const track2 = new THREE.QuaternionKeyframeTrack(`${link2.uuid}.quaternion`, times, link2Values);
    
    // Z-axis translation
    const zAxisValues = [
        2.5, 0, 0,
        2.5, -0.5, 0,
        2.5, 0, 0,
        2.5, 0.5, 0,
        2.5, 0, 0
    ];
    const track3 = new THREE.VectorKeyframeTrack(`${zAxis.uuid}.position`, times, zAxisValues);

    const animationClip = new THREE.AnimationClip('ScaraMovement', duration, [track1, track2, track3]);

    return { group, animationClips: [animationClip] };
}

// Auto-generated missing stub
export function createSCARA() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
