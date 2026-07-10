import { yellowAccent, steel, darkSteel, concrete } from '../utils/materials.js';

export function createTunnelBoringMachine(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Shield (body)
    const shieldGeo = new THREE.CylinderGeometry(3, 3, 10, 32);
    shieldGeo.rotateZ(Math.PI / 2);
    const shield = new THREE.Mesh(shieldGeo, steel);
    group.add(shield);

    // Cutter Head
    const cutterGeo = new THREE.CylinderGeometry(3.1, 3.1, 1, 32);
    cutterGeo.rotateZ(Math.PI / 2);
    const cutterHead = new THREE.Mesh(cutterGeo, darkSteel);
    cutterHead.position.set(5.5, 0, 0);
    cutterHead.name = "cutterHead";
    group.add(cutterHead);

    // Add some teeth to cutter head
    const toothGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    for (let i = 0; i < 8; i++) {
        const tooth = new THREE.Mesh(toothGeo, yellowAccent);
        const angle = (i / 8) * Math.PI * 2;
        tooth.position.set(0, Math.cos(angle) * 2.5, Math.sin(angle) * 2.5);
        cutterHead.add(tooth);
    }

    // Trailing Gear
    const trailingGeo = new THREE.BoxGeometry(15, 2, 2);
    const trailingGear = new THREE.Mesh(trailingGeo, yellowAccent);
    trailingGear.position.set(-12.5, -1, 0);
    group.add(trailingGear);

    // Animations: Cutter Head Boring
    const tracks = [
        new THREE.NumberKeyframeTrack('cutterHead.rotation[x]', [0, 5, 10], [0, Math.PI * 2, Math.PI * 4])
    ];
    const clip = new THREE.AnimationClip('TBM_Boring', 10, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
