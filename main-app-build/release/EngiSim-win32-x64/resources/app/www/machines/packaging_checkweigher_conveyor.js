import { getMaterials } from '../utils/materials.js';

export function createCheckweigherConveyor(THREE) {
    const group = new THREE.Group();
    const materials = getMaterials(THREE);
    const animationClips = [];

    // Conveyor base
    const baseGeo = new THREE.BoxGeometry(8, 0.5, 2);
    const base = new THREE.Mesh(baseGeo, materials.steel);
    group.add(base);

    // Weighing platform
    const platformGeo = new THREE.BoxGeometry(2, 0.6, 2.1);
    const platform = new THREE.Mesh(platformGeo, materials.aluminum);
    platform.position.y = 0;
    group.add(platform);

    // Conveyor belt
    const beltGeo = new THREE.PlaneGeometry(8, 1.8);
    beltGeo.rotateX(-Math.PI / 2);
    const belt = new THREE.Mesh(beltGeo, materials.rubber);
    belt.position.y = 0.35;
    group.add(belt);

    // Display Panel
    const panelGeo = new THREE.BoxGeometry(0.2, 1, 1);
    const panel = new THREE.Mesh(panelGeo, materials.plastic);
    panel.position.set(0, 1.5, 1.5);
    group.add(panel);

    // Rejector arm
    const armGeo = new THREE.BoxGeometry(0.2, 0.5, 1.5);
    const arm = new THREE.Mesh(armGeo, materials.brass);
    arm.position.set(2, 0.6, 1);
    arm.name = 'rejectorArm';
    group.add(arm);

    // Package to reject
    const boxGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const box = new THREE.Mesh(boxGeo, materials.plastic);
    box.position.set(-4, 0.8, 0);
    box.name = 'rejectBox';
    group.add(box);

    // Box animation (moving along conveyor and getting rejected)
    const boxTimes = [0, 1.5, 2, 3];
    const boxValues = [-4, 0.8, 0,  2, 0.8, 0,  2, 0.8, -2,  2, 0.8, -2]; // x, y, z
    const boxTrack = new THREE.VectorKeyframeTrack('rejectBox.position', boxTimes, boxValues);

    const checkClip = new THREE.AnimationClip('CheckweighAction', 3, [boxTrack]);
    animationClips.push(checkClip);

    return { group, animationClips };
}
