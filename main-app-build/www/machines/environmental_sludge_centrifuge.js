import * as materials from '../utils/materials.js';

export function createSludgeCentrifuge(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base Frame
    const frameGeom = new THREE.BoxGeometry(10, 1, 4);
    const frame = new THREE.Mesh(frameGeom, materials.darkSteel);
    frame.position.y = 0.5;
    group.add(frame);

    // Support Legs
    const legGeom = new THREE.BoxGeometry(0.5, 3, 3);
    const leftLeg = new THREE.Mesh(legGeom, materials.steel);
    leftLeg.position.set(-4, 2.5, 0);
    group.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeom, materials.steel);
    rightLeg.position.set(4, 2.5, 0);
    group.add(rightLeg);

    // Outer Casing (transparent half-cut cylinder for visibility)
    const casingGeom = new THREE.CylinderGeometry(1.8, 1.8, 7, 32, 1, false, 0, Math.PI);
    const casing = new THREE.Mesh(casingGeom, materials.glass);
    casing.rotation.z = Math.PI / 2;
    casing.position.set(0, 4, 0);
    group.add(casing);

    // Solid Bowl & Screw Conveyor Group
    const rotorGroup = new THREE.Group();
    rotorGroup.name = 'centrifuge_rotorGroup';
    rotorGroup.position.set(0, 4, 0);
    group.add(rotorGroup);

    const bowlGeom = new THREE.CylinderGeometry(1.5, 1.5, 6, 32);
    const bowl = new THREE.Mesh(bowlGeom, materials.titanium);
    bowl.rotation.z = Math.PI / 2;
    bowl.material = materials.titanium.clone();
    bowl.material.transparent = true;
    bowl.material.opacity = 0.5; // Make bowl slightly transparent to see screw
    rotorGroup.add(bowl);

    const screwGeom = new THREE.CylinderGeometry(0.5, 0.5, 6.2, 16);
    const screw = new THREE.Mesh(screwGeom, materials.steel);
    screw.rotation.z = Math.PI / 2;
    rotorGroup.add(screw);

    // Screw Threads
    const threadGroup = new THREE.Group();
    for(let i=0; i<30; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.1, 8, 32), materials.aluminum);
        ring.position.x = -2.9 + i*0.2;
        ring.rotation.y = Math.PI / 2;
        ring.rotation.x = i * 0.5; 
        threadGroup.add(ring);
    }
    rotorGroup.add(threadGroup);

    // Motor
    const motorGeom = new THREE.BoxGeometry(2, 2, 2);
    const motor = new THREE.Mesh(motorGeom, materials.castIron);
    motor.position.set(-6, 4, 0);
    group.add(motor);

    // Animation
    const rotorTrack = new THREE.NumberKeyframeTrack(
        `centrifuge_rotorGroup.rotation[x]`,
        [0, 1],
        [0, Math.PI * 8]
    );

    const clip = new THREE.AnimationClip('Centrifuge_Spin', 1, [rotorTrack]);
    animationClips.push(clip);

    group.userData.animatedObjects = [rotorGroup];

    return { group, animationClips };
}
