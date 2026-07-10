import { castIron, darkSteel, redAccent, steel, titanium, wireCoil } from '../utils/materials.js';

export function createSeafloorDrillRig(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const baseGeo = new THREE.BoxGeometry(6, 1, 6);
    const base = new THREE.Mesh(baseGeo, castIron);
    base.position.y = -0.5;
    group.add(base);

    // Derrick (Tower)
    const derrickGeo = new THREE.CylinderGeometry(0.5, 1.5, 8, 4);
    const derrick = new THREE.Mesh(derrickGeo, darkSteel);
    derrick.position.y = 4;
    group.add(derrick);

    // Drill String (Rotating part)
    const drillGroup = new THREE.Group();
    drillGroup.position.y = 4;
    
    const pipeGeo = new THREE.CylinderGeometry(0.2, 0.2, 8, 16);
    const pipe = new THREE.Mesh(pipeGeo, steel);
    drillGroup.add(pipe);

    // Drill Bit
    const bitGeo = new THREE.ConeGeometry(0.4, 1, 8);
    const bit = new THREE.Mesh(bitGeo, titanium);
    bit.position.y = -4.5;
    drillGroup.add(bit);

    group.add(drillGroup);

    // Support structures
    for(let i=0; i<4; i++) {
        const supportGeo = new THREE.BoxGeometry(0.3, 3, 0.3);
        const support = new THREE.Mesh(supportGeo, redAccent);
        support.position.set(
            2 * (i%2 === 0 ? 1 : -1),
            1.5,
            2 * (i < 2 ? 1 : -1)
        );
        group.add(support);
    }

    // Pipes on the side
    const coilGeo = new THREE.TorusGeometry(0.8, 0.1, 16, 100);
    const coil = new THREE.Mesh(coilGeo, wireCoil);
    coil.rotation.x = Math.PI / 2;
    coil.position.set(2, 0.5, 0);
    group.add(coil);

    // Drill Animation
    const times = [0, 2];
    const rotTrack = new THREE.NumberKeyframeTrack(
        `${drillGroup.uuid}.rotation[y]`,
        times,
        [0, Math.PI * 8] // fast rotation
    );
    
    // Up and down plunging motion
    const plungeTimes = [0, 1, 2];
    const plungeValues = [4, 3, 4];
    const posTrack = new THREE.NumberKeyframeTrack(
        `${drillGroup.uuid}.position[y]`,
        plungeTimes,
        plungeValues
    );

    const clip = new THREE.AnimationClip('Drilling', 2, [rotTrack, posTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
