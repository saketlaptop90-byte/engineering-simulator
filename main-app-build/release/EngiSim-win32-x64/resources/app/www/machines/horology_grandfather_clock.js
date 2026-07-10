import { materials } from '../utils/materials.js';

export function createGrandfatherClock(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Body (Wood)
    const bodyGeometry = new THREE.BoxGeometry(2, 8, 1.5);
    const body = new THREE.Mesh(bodyGeometry, materials.wood);
    body.position.y = 4;
    group.add(body);

    // Clock Face (Steel/Brass)
    const faceGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.1, 32);
    const face = new THREE.Mesh(faceGeometry, materials.brass);
    face.rotation.x = Math.PI / 2;
    face.position.set(0, 6.5, 0.75);
    group.add(face);

    // Pendulum (Rod and Bob)
    const pendulumGroup = new THREE.Group();
    pendulumGroup.name = "Pendulum";

    const rodGeometry = new THREE.CylinderGeometry(0.05, 0.05, 4);
    const rod = new THREE.Mesh(rodGeometry, materials.steel);
    rod.position.y = -2;
    pendulumGroup.add(rod);
    
    const bobGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 32);
    const bob = new THREE.Mesh(bobGeometry, materials.brass);
    bob.rotation.x = Math.PI / 2;
    bob.position.y = -4;
    pendulumGroup.add(bob);

    pendulumGroup.position.set(0, 5, 0.4);
    group.add(pendulumGroup);

    // Animation: Pendulum swinging
    const pendulumTrack = new THREE.NumberKeyframeTrack(
        'Pendulum.rotation[z]',
        [0, 1, 2],
        [0.2, -0.2, 0.2]
    );

    const clip = new THREE.AnimationClip('PendulumSwing', 2, [pendulumTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
