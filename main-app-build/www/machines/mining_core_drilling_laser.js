import { darkSteel, titanium, copper, glass } from '../utils/materials.js';

export function createCoreDrillingLaser(THREE) {
    const group = new THREE.Group();
    group.name = "CoreDrillingLaser";

    // Power Base
    const baseGeo = new THREE.CylinderGeometry(3.5, 3.5, 1.5, 32);
    const base = new THREE.Mesh(baseGeo, darkSteel);
    base.position.y = 0.75;
    group.add(base);

    // Laser Turret
    const turretGroup = new THREE.Group();
    turretGroup.name = "LaserTurret";
    turretGroup.position.y = 1.5;

    // Emitter Arm
    const armGeo = new THREE.BoxGeometry(2, 2, 6);
    const arm = new THREE.Mesh(armGeo, titanium);
    arm.position.z = 2;
    arm.position.y = 1;
    turretGroup.add(arm);

    // Copper Heat Sinks
    for (let i = 0; i < 5; i++) {
        const sinkGeo = new THREE.BoxGeometry(2.2, 0.4, 0.2);
        const sinkTop = new THREE.Mesh(sinkGeo, copper);
        sinkTop.position.set(0, 2.1, 1 + i * 0.8);
        turretGroup.add(sinkTop);
    }

    // Rotating Focusing Lenses
    const lensGroup = new THREE.Group();
    lensGroup.name = "FocusingLenses";
    lensGroup.position.set(0, 1, 5);
    
    for (let i = 0; i < 3; i++) {
        const lensGeo = new THREE.CylinderGeometry(0.8 - i * 0.15, 0.8 - i * 0.15, 0.2, 32);
        const lens = new THREE.Mesh(lensGeo, glass);
        lens.rotation.x = Math.PI / 2;
        lens.position.z = i * 0.5;
        lensGroup.add(lens);
    }
    turretGroup.add(lensGroup);

    // High Energy Laser Beam
    const beamGeo = new THREE.CylinderGeometry(0.2, 0.2, 20, 16);
    // Translate to scale from base
    beamGeo.translate(0, 10, 0); 
    const beam = new THREE.Mesh(beamGeo, glass);
    beam.rotation.x = Math.PI / 2;
    beam.position.set(0, 1, 6.5);
    beam.name = "LaserBeam";
    beam.scale.set(1, 0.001, 1); // Hidden initially
    turretGroup.add(beam);

    group.add(turretGroup);

    // Animations: Lens Rotation and Laser Firing
    const times = [0, 1, 4, 5];
    const beamScaleValues = [
        1, 0.001, 1, // idle
        1, 1, 1,     // fully extended
        1, 1, 1,     // holding fire
        1, 0.001, 1  // shutdown
    ];
    const beamTrack = new THREE.VectorKeyframeTrack('LaserBeam.scale', times, beamScaleValues);

    const lensTimes = [0, 2.5, 5];
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI * 2);
    
    const lensValues = [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ];
    const lensTrack = new THREE.QuaternionKeyframeTrack('FocusingLenses.quaternion', lensTimes, lensValues);

    const clip = new THREE.AnimationClip('DrillCore', 5, [beamTrack, lensTrack]);

    return { group, animationClips: [clip] };
}
