import { steel, darkSteel, copper } from '../utils/materials.js';

export function createMaglevUndercarriage(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main Chassis
    const chassisGeo = new THREE.BoxGeometry(10, 2, 4);
    const chassis = new THREE.Mesh(chassisGeo, darkSteel);
    chassis.name = 'chassis';
    group.add(chassis);

    // Electromagnets along the sides
    for (let i = -1; i <= 1; i += 2) {
        for (let j = -1; j <= 1; j += 2) {
            const magnetGroup = new THREE.Group();
            magnetGroup.position.set(i * 3, -1.5, j * 1.5);
            
            const coreGeo = new THREE.BoxGeometry(2, 1, 1);
            const core = new THREE.Mesh(coreGeo, steel);
            magnetGroup.add(core);

            const coilGeo = new THREE.TorusGeometry(0.8, 0.2, 16, 16);
            const coil = new THREE.Mesh(coilGeo, copper);
            coil.rotation.x = Math.PI / 2;
            magnetGroup.add(coil);

            chassis.add(magnetGroup); // Add to chassis to follow hover animation
        }
    }

    // Hover Animation (floating up and down)
    const times = [0, 1, 2];
    const yValues = [0, 0.2, 0];
    const positionTrack = new THREE.VectorKeyframeTrack('chassis.position', times, [
        0, yValues[0], 0,
        0, yValues[1], 0,
        0, yValues[2], 0
    ]);

    const clip = new THREE.AnimationClip('Hover', 2, [positionTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
