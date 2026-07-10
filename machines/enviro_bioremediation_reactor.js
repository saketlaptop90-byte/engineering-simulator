import * as materials from '../utils/materials.js';

export function createBioremediationReactor(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main Tank
    const tankGeo = new THREE.CylinderGeometry(3, 3, 8, 32);
    const tankMat = materials.glassMaterial || new THREE.MeshPhysicalMaterial({ color: 0xaaffaa, transparent: true, opacity: 0.6, roughness: 0.1, transmission: 0.9 });
    const tank = new THREE.Mesh(tankGeo, tankMat);
    tank.position.set(0, 4, 0);
    group.add(tank);

    // Agitator / Stirrer
    const stirrerGroup = new THREE.Group();
    stirrerGroup.position.set(0, 4, 0);
    stirrerGroup.name = 'stirrer';

    const shaftGeo = new THREE.CylinderGeometry(0.2, 0.2, 7, 8);
    const shaftMat = materials.metalMaterial || new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const shaft = new THREE.Mesh(shaftGeo, shaftMat);
    stirrerGroup.add(shaft);

    const bladeGeo = new THREE.BoxGeometry(4, 0.2, 0.5);
    for (let i = 0; i < 3; i++) {
        const blade = new THREE.Mesh(bladeGeo, shaftMat);
        blade.position.set(0, -2 + i * 2, 0);
        blade.rotation.y = i * Math.PI / 3;
        stirrerGroup.add(blade);
    }
    group.add(stirrerGroup);

    // Aeration Bubbles
    const bubbleGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const bubbleMat = materials.bubbleMaterial || new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
    for (let i = 0; i < 10; i++) {
        const bubble = new THREE.Mesh(bubbleGeo, bubbleMat);
        bubble.position.set((Math.random()-0.5)*4, Math.random()*8, (Math.random()-0.5)*4);
        bubble.name = `bubble_${i}`;
        group.add(bubble);

        const track = new THREE.VectorKeyframeTrack(
            `bubble_${i}.position`,
            [0, 2],
            [bubble.position.x, 0, bubble.position.z, bubble.position.x, 8, bubble.position.z]
        );
        animationClips.push(new THREE.AnimationClip(`BubbleRise_${i}`, 2, [track]));
    }

    // Stirrer Animation
    const stirrerTrack = new THREE.QuaternionKeyframeTrack(
        'stirrer.quaternion',
        [0, 1, 2],
        [
            new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0).toArray(),
            new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI).toArray(),
            new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI * 2).toArray()
        ].flat()
    );
    animationClips.push(new THREE.AnimationClip('Stirring', 2, [stirrerTrack]));

    return { group, animationClips };
}
