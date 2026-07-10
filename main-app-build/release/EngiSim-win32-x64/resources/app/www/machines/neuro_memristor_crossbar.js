import { getMaterial } from '../utils/materials.js';

export function createMemristorCrossbar(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const linesGroup = new THREE.Group();
    group.add(linesGroup);

    const lineMatHorizontal = getMaterial('metal_copper', THREE) || new THREE.MeshStandardMaterial({ color: 0xb87333 });
    const lineMatVertical = getMaterial('metal_silver', THREE) || new THREE.MeshStandardMaterial({ color: 0xc0c0c0 });
    const activeMat = getMaterial('glow_green', THREE) || new THREE.MeshBasicMaterial({ color: 0x00ff00 });

    const hGeo = new THREE.CylinderGeometry(0.1, 0.1, 6, 16);
    hGeo.rotateZ(Math.PI / 2); // Align with X-axis
    const vGeo = new THREE.CylinderGeometry(0.1, 0.1, 6, 16);
    
    // Create crossbar interconnects
    for (let i = 0; i < 5; i++) {
        // Horizontal lines (Top layer)
        const hLine = new THREE.Mesh(hGeo, lineMatHorizontal);
        hLine.position.set(0, 0.2, (i - 2) * 1.2);
        linesGroup.add(hLine);

        // Vertical lines (Bottom layer)
        const vLine = new THREE.Mesh(vGeo, lineMatVertical);
        vLine.position.set((i - 2) * 1.2, -0.2, 0);
        vLine.rotateX(Math.PI / 2); // Align with Z-axis
        linesGroup.add(vLine);
    }

    // Memristor nodes (at intersection points)
    const nodesGroup = new THREE.Group();
    nodesGroup.name = 'memristor_nodes';
    group.add(nodesGroup);

    const nodeGeo = new THREE.BoxGeometry(0.3, 0.4, 0.3);
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            const node = new THREE.Mesh(nodeGeo, activeMat);
            node.position.set((i - 2) * 1.2, 0, (j - 2) * 1.2);
            nodesGroup.add(node);
        }
    }

    // Animation: Changing memristor resistance states (visualized by vertical scaling/squashing)
    const times = [0, 1, 2];
    const values = [
        1, 1, 1,
        1, 0.1, 1,
        1, 1, 1
    ];
    const track = new THREE.VectorKeyframeTrack('memristor_nodes.scale', times, values);
    const clip = new THREE.AnimationClip('state_change', 2, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
