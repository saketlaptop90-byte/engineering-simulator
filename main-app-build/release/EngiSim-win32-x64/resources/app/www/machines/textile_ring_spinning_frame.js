import * as materials from '../utils/materials.js';

export function createRingSpinningFrame(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const metal = materials.metal || new THREE.MeshStandardMaterial({ color: 0x777777, metalness: 0.9, roughness: 0.1 });
    const plastic = materials.plastic || new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.4 });
    const yarn = materials.yarn || new THREE.MeshStandardMaterial({ color: 0xffffee, roughness: 1.0 });

    const frameBase = new THREE.Mesh(new THREE.BoxGeometry(5, 0.2, 1), metal);
    frameBase.position.y = 0.1;
    group.add(frameBase);

    for (let i = 0; i < 5; i++) {
        const xPos = -2 + i * 1;

        const spindle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1, 8), metal);
        spindle.position.set(xPos, 0.7, 0.2);
        group.add(spindle);

        const bobbin = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.8, 16), plastic);
        bobbin.position.set(xPos, 0.7, 0.2);
        group.add(bobbin);

        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.02, 8, 24), metal);
        ring.position.set(xPos, 0.5, 0.2);
        ring.rotation.x = Math.PI / 2;
        group.add(ring);

        const traveler = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.04), metal);
        
        const pivot = new THREE.Group();
        pivot.position.set(xPos, 0.5, 0.2);
        pivot.add(traveler);
        traveler.position.set(0.15, 0, 0);
        group.add(pivot);

        const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.2, 16), metal);
        roller.position.set(xPos, 1.5, 0);
        roller.rotation.z = Math.PI / 2;
        group.add(roller);

        const yarnThread = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 1, 4), yarn);
        yarnThread.position.set(xPos, 1.0, 0.1);
        yarnThread.rotation.x = -0.1;
        group.add(yarnThread);

        const bobbinRotTrack = new THREE.NumberKeyframeTrack(
            bobbin.uuid + '.rotation[y]',
            [0, 1],
            [0, Math.PI * 10]
        );

        const travelerRotTrack = new THREE.NumberKeyframeTrack(
            pivot.uuid + '.rotation[y]',
            [0, 1],
            [0, Math.PI * 10]
        );

        const rollerRotTrack = new THREE.NumberKeyframeTrack(
            roller.uuid + '.rotation[x]',
            [0, 1],
            [0, Math.PI * 2]
        );

        const clip = new THREE.AnimationClip(`Spinning_${i}`, 1, [bobbinRotTrack, travelerRotTrack, rollerRotTrack]);
        animationClips.push(clip);
    }

    return { group, animationClips };
}
