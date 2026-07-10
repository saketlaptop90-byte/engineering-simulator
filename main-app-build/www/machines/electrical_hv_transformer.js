import { materials } from '../utils/materials.js';

export function createTransformer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Core (darkSteel)
    const coreGeometry = new THREE.BoxGeometry(4, 5, 2);
    const core = new THREE.Mesh(coreGeometry, materials.darkSteel);
    group.add(core);

    // Coils (copper)
    const coilGeometry = new THREE.CylinderGeometry(1.2, 1.2, 4, 32);
    const leftCoil = new THREE.Mesh(coilGeometry, materials.copper);
    leftCoil.position.set(-1.5, 0, 0);
    const rightCoil = new THREE.Mesh(coilGeometry, materials.copper);
    rightCoil.position.set(1.5, 0, 0);
    group.add(leftCoil);
    group.add(rightCoil);

    // Bushings (porcelain)
    const bushingGeometry = new THREE.CylinderGeometry(0.3, 0.4, 2, 16);
    const bushing1 = new THREE.Mesh(bushingGeometry, materials.porcelain);
    bushing1.position.set(-1.5, 3.5, 0);
    const bushing2 = new THREE.Mesh(bushingGeometry, materials.porcelain);
    bushing2.position.set(1.5, 3.5, 0);
    group.add(bushing1);
    group.add(bushing2);

    // Animation: Magnetic field pulsing (scaling the coils slightly)
    const pulseTrack1 = new THREE.VectorKeyframeTrack(
        leftCoil.name || leftCoil.uuid + '.scale',
        [0, 0.5, 1],
        [1, 1, 1, 1.05, 1.02, 1.05, 1, 1, 1]
    );
    // Workaround: THREE.js animation clips typically use names or UUIDs, 
    // it's safer to name the objects.
    leftCoil.name = 'leftCoil';
    rightCoil.name = 'rightCoil';

    const track1 = new THREE.VectorKeyframeTrack(
        'leftCoil.scale',
        [0, 0.5, 1],
        [1, 1, 1, 1.05, 1.02, 1.05, 1, 1, 1]
    );
    const track2 = new THREE.VectorKeyframeTrack(
        'rightCoil.scale',
        [0, 0.5, 1],
        [1, 1, 1, 1.05, 1.02, 1.05, 1, 1, 1]
    );

    const clip = new THREE.AnimationClip('Pulsing', 1, [track1, track2]);
    animationClips.push(clip);

    return { group, animationClips };
}
