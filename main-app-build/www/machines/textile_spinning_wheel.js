import { wood, steel, iron, aluminum } from '../utils/materials.js';

export function createSpinningWheel(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base Table
    const tableGeo = new THREE.BoxGeometry(4, 0.2, 1.5);
    const table = new THREE.Mesh(tableGeo, wood);
    table.position.y = 1.5;
    group.add(table);

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 8);
    for(let i=0; i<3; i++) {
        const leg = new THREE.Mesh(legGeo, wood);
        leg.position.set(i===0 ? -1.5 : 1.5, 0.75, i===1 ? 0.5 : -0.5);
        group.add(leg);
    }

    // Drive Wheel
    const wheelGeo = new THREE.TorusGeometry(1.2, 0.05, 8, 32);
    const wheel = new THREE.Mesh(wheelGeo, wood);
    wheel.position.set(-1, 2.8, 0);
    wheel.name = "driveWheel";
    group.add(wheel);
    
    // Wheel Spokes
    const spokeGeo = new THREE.CylinderGeometry(0.03, 0.03, 2.4, 8);
    for(let i=0; i<4; i++) {
        const spoke = new THREE.Mesh(spokeGeo, wood);
        spoke.rotation.z = (Math.PI / 4) * i;
        wheel.add(spoke);
    }

    // Flyer and Bobbin Assembly
    const flyerGroup = new THREE.Group();
    flyerGroup.position.set(1.5, 2.5, 0);
    flyerGroup.name = "flyerGroup";
    group.add(flyerGroup);

    const flyerGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8);
    const flyer = new THREE.Mesh(flyerGeo, wood);
    flyer.rotation.z = Math.PI / 2;
    flyerGroup.add(flyer);

    const bobbinGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.8, 16);
    const bobbin = new THREE.Mesh(bobbinGeo, wood);
    bobbin.rotation.z = Math.PI / 2;
    bobbin.name = "bobbin";
    flyerGroup.add(bobbin);

    // Foot Pedal (Treadle)
    const pedalGeo = new THREE.BoxGeometry(1.5, 0.1, 1);
    const pedal = new THREE.Mesh(pedalGeo, wood);
    pedal.position.set(0, 0.2, 0);
    pedal.name = "pedal";
    group.add(pedal);

    // Animations
    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI * 2);

    const wheelTrack = new THREE.QuaternionKeyframeTrack('driveWheel.quaternion', [0, 1, 2], [...q0.toArray(), ...q1.toArray(), ...q2.toArray()]);
    
    // Flyer spins faster than drive wheel
    const qf0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
    const qf1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);
    const qf2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI * 2);
    
    const flyerTrack = new THREE.QuaternionKeyframeTrack('flyerGroup.quaternion', [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2], [
        ...qf0.toArray(), ...qf1.toArray(), ...qf2.toArray(),
        ...qf0.toArray(), ...qf1.toArray(), ...qf2.toArray(),
        ...qf0.toArray(), ...qf1.toArray(), ...qf2.toArray()
    ]);

    // Pedal pumping
    const pedalRot0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -0.2);
    const pedalRot1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0.2);

    const pedalTrack = new THREE.QuaternionKeyframeTrack('pedal.quaternion', [0, 0.5, 1, 1.5, 2], [
        ...pedalRot0.toArray(), ...pedalRot1.toArray(), ...pedalRot0.toArray(), ...pedalRot1.toArray(), ...pedalRot0.toArray()
    ]);

    const clip = new THREE.AnimationClip('SpinningAction', 2, [wheelTrack, flyerTrack, pedalTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
