import { materials } from '../utils/materials.js';

export function createHydraulicForgingHammer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base/Anvil
    const anvilGeometry = new THREE.BoxGeometry(4, 2, 4);
    const anvil = new THREE.Mesh(anvilGeometry, materials.heavyIron || materials.steel);
    anvil.position.y = 1;
    group.add(anvil);

    // Workpiece
    const workGeometry = new THREE.BoxGeometry(1, 0.5, 1);
    const workpiece = new THREE.Mesh(workGeometry, materials.hotMetal || new THREE.MeshStandardMaterial({ color: 0xff4500 }));
    workpiece.position.y = 2.25;
    group.add(workpiece);

    // Frame
    const frameGeometry = new THREE.BoxGeometry(1, 10, 1);
    const frame1 = new THREE.Mesh(frameGeometry, materials.steel);
    frame1.position.set(-2.5, 6, 0);
    const frame2 = new THREE.Mesh(frameGeometry, materials.steel);
    frame2.position.set(2.5, 6, 0);
    group.add(frame1);
    group.add(frame2);

    // Hammer Head
    const headGeometry = new THREE.BoxGeometry(2, 2, 2);
    const head = new THREE.Mesh(headGeometry, materials.steel);
    head.position.y = 8;
    group.add(head);

    // Animation: Hammer striking
    const times = [0, 0.5, 0.6, 1.5];
    const values = [
        0, 8, 0,
        0, 8, 0,
        0, 3.5, 0,
        0, 8, 0
    ];
    const positionTrack = new THREE.VectorKeyframeTrack(`${head.uuid}.position`, times, values);
    
    // Workpiece deformation animation
    const wpTimes = [0, 0.6, 1.5];
    const wpScale = [
        1, 1, 1,
        1.2, 0.8, 1.2,
        1.2, 0.8, 1.2
    ];
    const scaleTrack = new THREE.VectorKeyframeTrack(`${workpiece.uuid}.scale`, wpTimes, wpScale);

    const clip = new THREE.AnimationClip('Strike', 1.5, [positionTrack, scaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
