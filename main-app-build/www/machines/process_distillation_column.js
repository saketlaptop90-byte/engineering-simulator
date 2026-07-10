import { materials } from '../utils/materials.js';

export function createFractionalDistillationColumn(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Column body
    const columnGeom = new THREE.CylinderGeometry(2, 2, 20, 32);
    const column = new THREE.Mesh(columnGeom, materials.steel);
    group.add(column);

    // Trays (internal structure represented outside for simulation)
    for (let i = 0; i < 8; i++) {
        const trayGeom = new THREE.CylinderGeometry(2.1, 2.1, 0.2, 32);
        const tray = new THREE.Mesh(trayGeom, materials.copper);
        tray.position.y = -8 + i * 2.2;
        group.add(tray);
    }

    // Reboiler at bottom
    const reboilerGeom = new THREE.CylinderGeometry(3, 3, 4, 32);
    reboilerGeom.rotateZ(Math.PI / 2);
    const reboiler = new THREE.Mesh(reboilerGeom, materials.iron);
    reboiler.position.set(4, -10, 0);
    group.add(reboiler);

    // Condenser at top
    const condenserGeom = new THREE.CylinderGeometry(1.5, 1.5, 5, 32);
    condenserGeom.rotateZ(Math.PI / 2);
    const condenser = new THREE.Mesh(condenserGeom, materials.aluminum);
    condenser.position.set(-4, 10, 0);
    group.add(condenser);

    // Vapors going up
    const vaporGroup = new THREE.Group();
    for(let i=0; i<10; i++) {
        const bubbleGeom = new THREE.SphereGeometry(0.2, 8, 8);
        const bubble = new THREE.Mesh(bubbleGeom, materials.glass);
        bubble.position.set((Math.random() - 0.5)*3, -9 + i*2, (Math.random() - 0.5)*3);
        vaporGroup.add(bubble);
    }
    group.add(vaporGroup);

    // Animations (vapor rising)
    const vaporTrack = new THREE.VectorKeyframeTrack(
        `${vaporGroup.uuid}.position`,
        [0, 1, 2],
        [
            0, 0, 0,
            0, 2, 0,
            0, 4, 0
        ]
    );
    const clip = new THREE.AnimationClip('Distill', 2, [vaporTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
