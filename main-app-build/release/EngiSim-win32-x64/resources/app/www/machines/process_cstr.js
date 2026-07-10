import { materials } from '../utils/materials.js';

export function createCSTR(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Tank
    const tankGeom = new THREE.CylinderGeometry(5, 5, 12, 32);
    const tank = new THREE.Mesh(tankGeom, materials.glass); // glass to see inside
    // Note: ensure materials.glass is transparent in your materials definition
    tank.material = tank.material.clone();
    tank.material.transparent = true;
    tank.material.opacity = 0.5;
    group.add(tank);

    // Stirrer shaft
    const shaftGeom = new THREE.CylinderGeometry(0.2, 0.2, 14, 16);
    const shaft = new THREE.Mesh(shaftGeom, materials.steel);
    shaft.position.y = 1;
    group.add(shaft);

    // Impeller
    const impellerGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
        const bladeGeom = new THREE.BoxGeometry(4, 0.5, 0.1);
        const blade = new THREE.Mesh(bladeGeom, materials.steel);
        blade.rotation.y = (Math.PI / 2) * i;
        blade.position.x = Math.cos((Math.PI / 2) * i) * 2;
        blade.position.z = Math.sin((Math.PI / 2) * i) * 2;
        impellerGroup.add(blade);
    }
    impellerGroup.position.y = -4;
    shaft.add(impellerGroup); // attach to shaft

    // Motor
    const motorGeom = new THREE.BoxGeometry(2, 2, 2);
    const motor = new THREE.Mesh(motorGeom, materials.iron);
    motor.position.y = 8;
    group.add(motor);

    // Animation for stirrer
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 2*Math.PI);
    
    const stirTrack = new THREE.QuaternionKeyframeTrack(
        `${shaft.uuid}.quaternion`,
        [0, 0.5, 1],
        [...q1.toArray(), ...q2.toArray(), ...q3.toArray()]
    );
    const clip = new THREE.AnimationClip('Stir', 1, [stirTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
