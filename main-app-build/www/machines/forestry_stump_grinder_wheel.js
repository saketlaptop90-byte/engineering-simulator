import { materials } from '../utils/materials.js';

export function createStumpGrinderWheel(THREE) {
    const group = new THREE.Group();
    group.name = "StumpGrinder";
    const animationClips = [];

    // Boom arm
    const boomGeo = new THREE.BoxGeometry(0.2, 0.2, 2);
    const boom = new THREE.Mesh(boomGeo, materials.yellowMetal || new THREE.MeshStandardMaterial({color: 0xffaa00}));
    boom.position.set(0, 1, 1);
    group.add(boom);

    // Cutting head group (swings)
    const headGroup = new THREE.Group();
    headGroup.name = "HeadGroup";
    headGroup.position.set(0, 1, 2);
    group.add(headGroup);

    // Head shield
    const shieldGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.3, 32, 1, false, 0, Math.PI);
    const shield = new THREE.Mesh(shieldGeo, materials.yellowMetal || new THREE.MeshStandardMaterial({color: 0xffaa00}));
    shield.rotation.y = Math.PI / 2;
    shield.rotation.z = Math.PI / 2;
    headGroup.add(shield);

    // Grinder Wheel
    const wheelGroup = new THREE.Group();
    wheelGroup.name = "GrinderWheel";
    headGroup.add(wheelGroup);

    const wheelGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32);
    const wheel = new THREE.Mesh(wheelGeo, materials.steel || new THREE.MeshStandardMaterial({color: 0xaaaaaa}));
    wheel.rotation.z = Math.PI / 2;
    wheelGroup.add(wheel);

    // Teeth
    const toothGeo = new THREE.BoxGeometry(0.05, 0.05, 0.05);
    const teethMat = materials.darkMetal || new THREE.MeshStandardMaterial({color: 0x333333});
    for(let i=0; i<16; i++) {
        const tooth = new THREE.Mesh(toothGeo, teethMat);
        const angle = i * Math.PI / 8;
        tooth.position.set(0, Math.cos(angle) * 0.5, Math.sin(angle) * 0.5);
        wheelGroup.add(tooth);
    }

    // Animations
    // Swing motion
    const swingTimes = [0, 1, 2, 3, 4];
    const swingValues = [];
    const swingAngles = [0, Math.PI/6, 0, -Math.PI/6, 0];
    swingAngles.forEach(angle => {
        const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
        swingValues.push(q.x, q.y, q.z, q.w);
    });
    const swingTrack = new THREE.QuaternionKeyframeTrack(`${headGroup.name}.quaternion`, swingTimes, swingValues);

    // Wheel spin
    const spinTimes = [];
    const spinValues = [];
    for(let i=0; i<=16; i++) {
        spinTimes.push(i * 0.25);
        const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), (i%4) * Math.PI/2);
        spinValues.push(q.x, q.y, q.z, q.w);
    }
    const spinTrack = new THREE.QuaternionKeyframeTrack(`${wheelGroup.name}.quaternion`, spinTimes, spinValues);

    const clip = new THREE.AnimationClip('GrindAction', 4, [swingTrack, spinTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
