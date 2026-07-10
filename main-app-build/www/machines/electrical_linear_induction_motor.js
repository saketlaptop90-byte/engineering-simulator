import { copper, brass, darkSteel, porcelain } from '../utils/materials.js';

export function createLinearInductionMotor(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Primary (Stator)
    const statorGroup = new THREE.Group();
    group.add(statorGroup);
    
    const statorBaseGeom = new THREE.BoxGeometry(10, 0.5, 2);
    const statorBase = new THREE.Mesh(statorBaseGeom, darkSteel);
    statorGroup.add(statorBase);
    
    for (let i = -4; i <= 4; i++) {
        const toothGeom = new THREE.BoxGeometry(0.2, 0.5, 2);
        const tooth = new THREE.Mesh(toothGeom, darkSteel);
        tooth.position.set(i, 0.5, 0);
        statorGroup.add(tooth);
        
        const windingGeom = new THREE.BoxGeometry(0.6, 0.4, 2.2);
        const winding = new THREE.Mesh(windingGeom, copper);
        winding.position.set(i, 0.3, 0);
        statorGroup.add(winding);
    }

    // Secondary (Rotor / Reaction Plate)
    const rotorGroup = new THREE.Group();
    rotorGroup.name = 'rotorGroup';
    group.add(rotorGroup);
    
    const plateGeom = new THREE.BoxGeometry(3, 0.2, 2.4);
    const plate = new THREE.Mesh(plateGeom, copper); // Copper top layer
    plate.position.y = 1.0;
    rotorGroup.add(plate);
    
    const backIronGeom = new THREE.BoxGeometry(3, 0.2, 2.4);
    const backIron = new THREE.Mesh(backIronGeom, darkSteel); // Steel back layer
    backIron.position.y = 1.2;
    rotorGroup.add(backIron);

    // Animation (translating back and forth)
    const times = [0, 2, 4];
    const values = [
        -3, 0, 0,
        3, 0, 0,
        -3, 0, 0
    ];
    const track = new THREE.VectorKeyframeTrack('rotorGroup.position', times, values);
    const clip = new THREE.AnimationClip('Translate', 4, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
