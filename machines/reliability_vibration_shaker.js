import * as materials from '../utils/materials.js';

export function createElectrodynamicVibrationShaker(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base trunnion
    const baseGeo = new THREE.BoxGeometry(3, 1, 3);
    const base = new THREE.Mesh(baseGeo, materials.castIron);
    group.add(base);

    const supportGeo = new THREE.BoxGeometry(0.5, 3, 2);
    const support1 = new THREE.Mesh(supportGeo, materials.castIron);
    support1.position.set(-1.25, 2, 0);
    group.add(support1);

    const support2 = new THREE.Mesh(supportGeo, materials.castIron);
    support2.position.set(1.25, 2, 0);
    group.add(support2);

    // Shaker body (armature housing)
    const bodyGeo = new THREE.CylinderGeometry(1.5, 1.5, 2.5, 32);
    const body = new THREE.Mesh(bodyGeo, materials.bluePaint || materials.steel);
    body.position.y = 2.5;
    group.add(body);

    // Armature table (the vibrating part)
    const tableGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.2, 32);
    const table = new THREE.Mesh(tableGeo, materials.steel);
    table.position.y = 3.8;
    table.name = "ArmatureTable";
    group.add(table);

    // Test Item
    const itemGeo = new THREE.BoxGeometry(1, 1, 1);
    const item = new THREE.Mesh(itemGeo, materials.brass);
    item.position.y = 0.6; // relative to table
    table.add(item);

    // Animation: High frequency vibration
    const times = [];
    const values = [];
    const duration = 2; // 2 seconds
    const hz = 20; // 20 vibrations per second

    for (let i = 0; i <= hz * duration; i++) {
        const time = i / hz;
        times.push(time);
        // Sine wave motion up and down
        const displacement = 3.8 + Math.sin(time * Math.PI * 2 * hz) * 0.1;
        values.push(0, displacement, 0);
    }

    const vibTrack = new THREE.VectorKeyframeTrack(
        `ArmatureTable.position`,
        times,
        values
    );

    const clip = new THREE.AnimationClip('Vibrate', duration, [vibTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
