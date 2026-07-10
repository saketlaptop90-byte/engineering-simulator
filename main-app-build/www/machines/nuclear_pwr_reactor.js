import { concrete, darkSteel, glass, glowing } from '../utils/materials.js';

export function createPWR(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const vesselGeometry = new THREE.CylinderGeometry(4, 4, 12, 32);
    const vessel = new THREE.Mesh(vesselGeometry, darkSteel);
    vessel.position.y = 6;
    group.add(vessel);

    const coreGeometry = new THREE.CylinderGeometry(3.5, 3.5, 6, 32);
    const core = new THREE.Mesh(coreGeometry, glowing);
    core.position.y = 4;
    group.add(core);

    const rodGroup = new THREE.Group();
    const rodGeometry = new THREE.CylinderGeometry(0.2, 0.2, 8, 16);
    
    const rodPositions = [[-1, -1], [-1, 1], [1, -1], [1, 1], [0, 0]];
    rodPositions.forEach((pos) => {
        const rod = new THREE.Mesh(rodGeometry, darkSteel);
        rod.position.set(pos[0], 4, pos[1]);
        rodGroup.add(rod);
    });
    
    rodGroup.position.set(0, 8, 0);
    group.add(rodGroup);

    const times = [0, 2, 4];
    const values = [0, 8, 0, 0, 4, 0, 0, 8, 0];
    const rodTrack = new THREE.VectorKeyframeTrack(rodGroup.uuid + '.position', times, values);
    const rodClip = new THREE.AnimationClip('RodPlunge', 4, [rodTrack]);
    animationClips.push(rodClip);

    return { group, animationClips };
}
