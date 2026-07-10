import { materials } from '../utils/materials.js';

export function createMetalStampingPress(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const baseGeometry = new THREE.BoxGeometry(6, 1, 4);
    const base = new THREE.Mesh(baseGeometry, materials.steel);
    base.position.y = 0.5;
    group.add(base);

    // Die
    const dieGeometry = new THREE.BoxGeometry(3, 0.5, 2);
    const die = new THREE.Mesh(dieGeometry, materials.hardMetal || materials.steel);
    die.position.y = 1.25;
    group.add(die);

    // Metal Sheet (Workpiece)
    const sheetGeometry = new THREE.PlaneGeometry(4, 3);
    const sheet = new THREE.Mesh(sheetGeometry, materials.aluminum || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide }));
    sheet.rotation.x = -Math.PI / 2;
    sheet.position.y = 1.51;
    group.add(sheet);

    // Columns
    const colGeometry = new THREE.CylinderGeometry(0.3, 0.3, 8);
    for (let i = -1; i <= 1; i+=2) {
        for (let j = -1; j <= 1; j+=2) {
            const col = new THREE.Mesh(colGeometry, materials.steel);
            col.position.set(i * 2.5, 4.5, j * 1.5);
            group.add(col);
        }
    }

    // Ram (Moving part)
    const ramGeometry = new THREE.BoxGeometry(4, 1, 3);
    const ram = new THREE.Mesh(ramGeometry, materials.steel);
    ram.position.y = 7;
    group.add(ram);

    // Punch
    const punchGeometry = new THREE.BoxGeometry(2.8, 1, 1.8);
    const punch = new THREE.Mesh(punchGeometry, materials.hardMetal || materials.steel);
    punch.position.y = 6;
    group.add(punch);
    
    // Group Ram and Punch for animation
    const movingParts = new THREE.Group();
    movingParts.add(ram);
    movingParts.add(punch);
    group.add(movingParts);

    // Animation: Stamping down and up
    const times = [0, 1, 1.2, 2.5];
    const positions = [
        0, 0, 0,
        0, -4.5, 0,
        0, -4.5, 0,
        0, 0, 0
    ];
    const ramTrack = new THREE.VectorKeyframeTrack(`${movingParts.uuid}.position`, times, positions);
    
    const clip = new THREE.AnimationClip('Stamp', 2.5, [ramTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
