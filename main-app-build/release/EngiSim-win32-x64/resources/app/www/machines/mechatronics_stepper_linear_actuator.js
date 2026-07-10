import * as materials from '../utils/materials.js';

export function createStepperLinearActuator(THREE) {
    const group = new THREE.Group();

    const aluminum = materials.aluminum || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 });
    const steel = materials.steel || new THREE.MeshStandardMaterial({ color: 0x777777, metalness: 0.9, roughness: 0.3 });
    const blackPlastic = materials.blackPlastic || new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });

    const motorBody = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), blackPlastic);
    motorBody.position.set(-5, 1, 0);
    group.add(motorBody);

    const motorCap = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.2, 16), aluminum);
    motorCap.rotation.z = Math.PI / 2;
    motorCap.position.set(-3.9, 1, 0);
    group.add(motorCap);

    const leadScrew = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 10, 16), steel);
    leadScrew.rotation.z = Math.PI / 2;
    leadScrew.position.set(1.2, 1, 0);
    group.add(leadScrew);

    const rail1 = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 10, 16), steel);
    rail1.rotation.z = Math.PI / 2;
    rail1.position.set(1.2, 1, 0.8);
    group.add(rail1);

    const rail2 = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 10, 16), steel);
    rail2.rotation.z = Math.PI / 2;
    rail2.position.set(1.2, 1, -0.8);
    group.add(rail2);

    const endBlock = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2, 2), aluminum);
    endBlock.position.set(6.45, 1, 0);
    group.add(endBlock);

    const carriage = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 2.2), aluminum);
    carriage.position.set(-2, 1, 0);
    group.add(carriage);

    const screwTrack = new THREE.NumberKeyframeTrack(
        leadScrew.uuid + '.rotation[x]',
        [0, 1, 2, 3, 4],
        [0, Math.PI * 4, Math.PI * 8, Math.PI * 4, 0]
    );

    const carriageTrack = new THREE.NumberKeyframeTrack(
        carriage.uuid + '.position[x]',
        [0, 2, 4],
        [-2, 5, -2]
    );

    const clip = new THREE.AnimationClip('Actuate', 4, [screwTrack, carriageTrack]);

    return { group, animationClips: [clip] };
}
