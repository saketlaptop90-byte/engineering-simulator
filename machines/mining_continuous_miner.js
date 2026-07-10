import * as sharedMaterials from '../utils/materials.js';

export function createContinuousMiner(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Fallback materials to ensure robustness
    const yellowPaint = sharedMaterials.yellowPaint || new THREE.MeshStandardMaterial({ color: 0xffaa00, roughness: 0.4 });
    const darkMetal = sharedMaterials.darkMetal || new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8 });
    const steel = sharedMaterials.steel || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 });
    const rubber = sharedMaterials.rubber || new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });

    // Main Chassis
    const chassisGeo = new THREE.BoxGeometry(4, 1.5, 8);
    const chassis = new THREE.Mesh(chassisGeo, yellowPaint);
    chassis.position.y = 1;
    group.add(chassis);

    // Left and Right Tracks
    const trackGeo = new THREE.BoxGeometry(1, 1.2, 9);
    const trackL = new THREE.Mesh(trackGeo, rubber);
    trackL.position.set(-2.5, 0.6, 0);
    group.add(trackL);
    
    const trackR = new THREE.Mesh(trackGeo, rubber);
    trackR.position.set(2.5, 0.6, 0);
    group.add(trackR);

    // Boom Support
    const boomGroup = new THREE.Group();
    boomGroup.position.set(0, 1.5, -4);
    group.add(boomGroup);

    const boomArmGeo = new THREE.BoxGeometry(2, 0.8, 5);
    const boomArm = new THREE.Mesh(boomArmGeo, yellowPaint);
    boomArm.position.set(0, 0, -2.5);
    boomGroup.add(boomArm);

    // Rotating Cutting Head
    const headGeo = new THREE.CylinderGeometry(1, 1, 4, 16);
    const cuttingHead = new THREE.Mesh(headGeo, steel);
    cuttingHead.rotation.z = Math.PI / 2;
    cuttingHead.position.set(0, 0, -5);
    boomGroup.add(cuttingHead);

    // Conical Cutting Teeth
    const toothGeo = new THREE.ConeGeometry(0.1, 0.4, 8);
    for (let i = 0; i < 16; i++) {
        for (let j = -1.5; j <= 1.5; j += 0.5) {
            const tooth = new THREE.Mesh(toothGeo, darkMetal);
            const angle = (i / 16) * Math.PI * 2 + (j * 0.5);
            tooth.position.set(j, Math.cos(angle) * 1.05, Math.sin(angle) * 1.05);
            tooth.rotation.x = -angle;
            cuttingHead.add(tooth);
        }
    }

    // Front Gathering Head
    const gatherGeo = new THREE.BoxGeometry(5, 0.5, 2);
    const gatheringHead = new THREE.Mesh(gatherGeo, yellowPaint);
    gatheringHead.position.set(0, 0.25, -5.5);
    gatheringHead.rotation.x = Math.PI / 8;
    group.add(gatheringHead);

    // Animations setup
    const headRotTrack = new THREE.NumberKeyframeTrack(
        cuttingHead.uuid + '.rotation[x]',
        [0, 1, 2, 3, 4],
        [0, Math.PI * 2, Math.PI * 4, Math.PI * 6, Math.PI * 8]
    );
    
    const boomRotTrack = new THREE.NumberKeyframeTrack(
        boomGroup.uuid + '.rotation[x]',
        [0, 2, 4],
        [-0.5, 0.2, -0.5] // Boom ranges down and up
    );

    const clip = new THREE.AnimationClip('ContinuousMinerOperate', 4, [headRotTrack, boomRotTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
