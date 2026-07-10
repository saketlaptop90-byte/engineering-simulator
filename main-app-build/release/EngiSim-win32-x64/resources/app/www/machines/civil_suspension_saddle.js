import { materials } from '../utils/materials.js';

export function createSuspensionSaddle(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Tower Top Base
    const baseGeo = new THREE.BoxGeometry(6, 2, 4);
    const base = new THREE.Mesh(baseGeo, materials.concrete);
    group.add(base);

    // Roller assembly
    const rollerGroup = new THREE.Group();
    rollerGroup.position.y = 1;
    group.add(rollerGroup);

    const rollerGeo = new THREE.CylinderGeometry(0.5, 0.5, 3);
    for(let i=0; i<5; i++) {
        const roller = new THREE.Mesh(rollerGeo, materials.steel);
        roller.rotation.z = Math.PI / 2;
        roller.position.set(0, 0.5, -1.5 + i * 0.75);
        rollerGroup.add(roller);
    }

    // Saddle casting
    const saddleGeo = new THREE.BoxGeometry(4, 1.5, 4.5);
    const saddle = new THREE.Mesh(saddleGeo, materials.steel);
    saddle.position.y = 1.75;
    rollerGroup.add(saddle);

    // Main Cable
    const cableGeo = new THREE.CylinderGeometry(0.6, 0.6, 20, 16);
    const cable = new THREE.Mesh(cableGeo, materials.steel);
    cable.rotation.x = Math.PI / 2;
    cable.position.y = 2.5;
    rollerGroup.add(cable);

    // Animation: Minor thermal expansion/contraction shifting saddle over rollers
    const saddleShift = new THREE.NumberKeyframeTrack(
        `${rollerGroup.uuid}.position[z]`,
        [0, 5, 10],
        [0, 0.5, 0]
    );

    const clip = new THREE.AnimationClip('SaddleShift', 10, [saddleShift]);
    animationClips.push(clip);

    return { group, animationClips };
}
