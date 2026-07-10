import { steel, yellowAccent, darkSteel, rubber } from '../utils/materials.js';

export function createTBM(THREE) {
    const group = new THREE.Group();
    group.name = "TBM";

    // Main Shield
    const shieldGeo = new THREE.CylinderGeometry(3, 3, 10, 32);
    shieldGeo.rotateX(Math.PI / 2);
    const shield = new THREE.Mesh(shieldGeo, yellowAccent);
    shield.position.set(0, 3, 0);
    group.add(shield);

    // Cutting Head
    const headGroup = new THREE.Group();
    headGroup.name = "CuttingHead";
    headGroup.position.set(0, 3, 5.1);
    group.add(headGroup);

    const headBase = new THREE.Mesh(new THREE.CylinderGeometry(3.1, 3.1, 0.5, 32), darkSteel);
    headBase.rotation.x = Math.PI / 2;
    headGroup.add(headBase);

    // Cutters
    for (let i = 0; i < 6; i++) {
        const cutter = new THREE.Mesh(new THREE.BoxGeometry(0.5, 6, 0.5), steel);
        cutter.rotation.z = (i * Math.PI) / 3;
        cutter.position.z = 0.3;
        headGroup.add(cutter);
    }

    // Trailing Backup Gear
    const trailing1 = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 8), steel);
    trailing1.position.set(0, 2.5, -9);
    group.add(trailing1);

    const trailing2 = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 8), darkSteel);
    trailing2.position.set(0, 2, -18);
    group.add(trailing2);

    // Conveyor Belt
    const conveyor = new THREE.Mesh(new THREE.BoxGeometry(1, 0.2, 30), rubber);
    conveyor.position.set(0, 1, -10);
    group.add(conveyor);

    // Animations
    const duration = 5;
    const times = [0, 5];
    const headRotValues = [0, Math.PI * 2];
    const headTrack = new THREE.NumberKeyframeTrack('CuttingHead.rotation[z]', times, headRotValues);

    const clip = new THREE.AnimationClip('Boring', duration, [headTrack]);

    return { group, animationClips: [clip] };
}
