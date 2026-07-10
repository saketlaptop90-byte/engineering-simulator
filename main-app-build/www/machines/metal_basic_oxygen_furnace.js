import { materials } from '../utils/materials.js';

export function createBasicOxygenFurnace(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Vessel
    const vesselGroup = new THREE.Group();
    vesselGroup.position.y = 5;

    const vesselGeometry = new THREE.SphereGeometry(3, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.7);
    const vessel = new THREE.Mesh(vesselGeometry, materials.steel);
    vesselGroup.add(vessel);
    group.add(vesselGroup);

    // Oxygen Lance
    const lanceGeometry = new THREE.CylinderGeometry(0.2, 0.2, 8, 16);
    const lance = new THREE.Mesh(lanceGeometry, materials.steel);
    lance.position.set(0, 10, 0);
    group.add(lance);

    // Flames/Sparks
    const flameGeometry = new THREE.ConeGeometry(1, 2, 16);
    const flames = new THREE.Mesh(flameGeometry, materials.fire || new THREE.MeshBasicMaterial({ color: 0xffaa00 }));
    flames.position.set(0, 5, 0);
    flames.visible = false;
    group.add(flames);

    // Animation: Lance lowering, blowing, vessel tilting
    const times = [0, 1, 3, 4, 6];
    
    // Lance position
    const lancePos = [
        0, 10, 0,
        0, 5, 0,
        0, 5, 0,
        0, 10, 0,
        0, 10, 0
    ];
    const lanceTrack = new THREE.VectorKeyframeTrack(`${lance.uuid}.position`, times, lancePos);

    // Vessel tilt (rotation)
    const vesselRot = [
        0, 0, 0, 1,
        0, 0, 0, 1,
        0, 0, 0, 1,
        0, 0, 0, 1,
        0, 0, 0.707, 0.707 // 90 degree tilt
    ];
    const vesselTrack = new THREE.QuaternionKeyframeTrack(`${vesselGroup.uuid}.quaternion`, times, vesselRot);

    const clip = new THREE.AnimationClip('OxygenBlowAndPour', 6, [lanceTrack, vesselTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
