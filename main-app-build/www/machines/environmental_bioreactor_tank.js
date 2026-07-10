import * as materials from '../utils/materials.js';

export function createBioreactorTank(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main Tank
    const tankGeom = new THREE.CylinderGeometry(3, 3, 10, 32);
    const tank = new THREE.Mesh(tankGeom, materials.glass);
    tank.position.y = 5;
    group.add(tank);

    // Base and Top
    const capGeom = new THREE.CylinderGeometry(3.2, 3.2, 0.5, 32);
    const base = new THREE.Mesh(capGeom, materials.darkSteel);
    base.position.y = 0.25;
    group.add(base);

    const top = new THREE.Mesh(capGeom, materials.darkSteel);
    top.position.y = 9.75;
    group.add(top);

    // Agitator Shaft
    const shaftGeom = new THREE.CylinderGeometry(0.2, 0.2, 10, 16);
    const shaftGroup = new THREE.Group();
    shaftGroup.name = 'bio_shaftGroup';
    shaftGroup.position.y = 5;
    
    const shaft = new THREE.Mesh(shaftGeom, materials.steel);
    shaftGroup.add(shaft);

    // Impellers
    const impellerGeom = new THREE.BoxGeometry(4, 0.1, 0.5);
    for (let h = -3; h <= 3; h += 3) {
        const impeller1 = new THREE.Mesh(impellerGeom, materials.aluminum);
        impeller1.position.y = h;
        impeller1.rotation.y = Math.PI / 4;
        shaftGroup.add(impeller1);

        const impeller2 = new THREE.Mesh(impellerGeom, materials.aluminum);
        impeller2.position.y = h;
        impeller2.rotation.y = -Math.PI / 4;
        shaftGroup.add(impeller2);
    }
    group.add(shaftGroup);

    // Aeration Ring
    const ringGeom = new THREE.TorusGeometry(2, 0.1, 16, 32);
    const ring = new THREE.Mesh(ringGeom, materials.copper);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 1;
    group.add(ring);

    // Bubbles (simulated with small spheres that move up)
    const bubbleGroup = new THREE.Group();
    const bubbleGeom = new THREE.SphereGeometry(0.15, 8, 8);
    for (let i = 0; i < 20; i++) {
        const bubble = new THREE.Mesh(bubbleGeom, materials.whitePlastic);
        const theta = Math.random() * Math.PI * 2;
        const r = Math.random() * 2;
        bubble.position.set(Math.cos(theta)*r, Math.random() * 8, Math.sin(theta)*r);
        bubbleGroup.add(bubble);
    }
    bubbleGroup.position.y = 1;
    group.add(bubbleGroup);

    // Animation
    const shaftTrack = new THREE.NumberKeyframeTrack(
        `bio_shaftGroup.rotation[y]`,
        [0, 2],
        [0, Math.PI * 4]
    );

    const bubbleTracks = [];
    bubbleGroup.children.forEach((bubble, index) => {
        bubble.name = `bio_bubble_${index}`;
        const startY = bubble.position.y;
        const endY = startY + 8;
        const track = new THREE.VectorKeyframeTrack(
            `${bubble.name}.position`,
            [0, 2],
            [bubble.position.x, startY, bubble.position.z, bubble.position.x, endY, bubble.position.z]
        );
        bubbleTracks.push(track);
    });

    const clip = new THREE.AnimationClip('Bioreactor_Operation', 2, [shaftTrack, ...bubbleTracks]);
    animationClips.push(clip);

    group.userData.animatedObjects = [shaftGroup, ...bubbleGroup.children];

    return { group, animationClips };
}
