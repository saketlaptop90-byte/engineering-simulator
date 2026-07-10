import * as materials from '../utils/materials.js';

export function createPumpjack(THREE) {
    const group = new THREE.Group();
    group.name = "Pumpjack";

    const matMetal = materials.metalMaterial || materials.metal || new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 });
    const matDark = materials.darkMaterial || materials.dark || new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.3 });
    const matHighlight = materials.warningMaterial || materials.highlight || new THREE.MeshStandardMaterial({ color: 0xffcc00, metalness: 0.5, roughness: 0.5 });

    // Concrete Pad
    const pad = new THREE.Mesh(new THREE.BoxGeometry(12, 0.2, 4), new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.9 }));
    pad.position.y = -0.1;
    group.add(pad);

    // Base skid
    const skidGeo = new THREE.BoxGeometry(10, 0.4, 2);
    const skid = new THREE.Mesh(skidGeo, matDark);
    skid.position.y = 0.2;
    group.add(skid);

    // Sampson Post (central pillar)
    const postGeo = new THREE.CylinderGeometry(0.4, 0.8, 5, 4);
    const post = new THREE.Mesh(postGeo, matMetal);
    post.position.set(0, 2.9, 0);
    post.rotation.y = Math.PI / 4;
    group.add(post);

    // Walking Beam (rocking beam)
    const beamGroup = new THREE.Group();
    beamGroup.position.set(0, 5.4, 0);
    beamGroup.name = "walkingBeam";
    
    const beamGeo = new THREE.BoxGeometry(8, 0.5, 0.5);
    const beam = new THREE.Mesh(beamGeo, matHighlight);
    beamGroup.add(beam);

    // Horsehead
    const horseheadGeo = new THREE.CylinderGeometry(1, 1, 0.6, 32, 1, false, 0, Math.PI);
    const horsehead = new THREE.Mesh(horseheadGeo, matHighlight);
    horsehead.rotation.x = Math.PI / 2;
    horsehead.rotation.z = Math.PI / 2;
    horsehead.position.set(4, -0.75, 0);
    beamGroup.add(horsehead);

    // Pitman Arm Assembly (Approximated as attached to beam)
    const pitmanArm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 4), matMetal);
    pitmanArm.position.set(-2.5, -2, 0.7);
    beamGroup.add(pitmanArm);

    group.add(beamGroup);

    // Gearbox & Motor
    const gearGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const gearbox = new THREE.Mesh(gearGeo, matDark);
    gearbox.position.set(-2.5, 1.15, 0);
    group.add(gearbox);

    const motorGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.2);
    const motor = new THREE.Mesh(motorGeo, matMetal);
    motor.rotation.x = Math.PI / 2;
    motor.position.set(-4, 1, 0);
    group.add(motor);

    // Crank Pivot & Counterweight
    const crankPivot = new THREE.Group();
    crankPivot.position.set(-2.5, 1.15, 0.85);
    crankPivot.name = "crankPivot";
    
    const crankGeo = new THREE.BoxGeometry(0.3, 2.5, 0.3);
    const crank = new THREE.Mesh(crankGeo, matMetal);
    crank.position.set(0, 1.25, 0);
    crankPivot.add(crank);

    const counterweightGeo = new THREE.BoxGeometry(1.2, 1.5, 0.5);
    const counterweight = new THREE.Mesh(counterweightGeo, matDark);
    counterweight.position.set(0, 2.2, 0);
    crankPivot.add(counterweight);

    group.add(crankPivot);

    // Animations
    const duration = 3; 

    // Crank rotation
    const crankTimes = [0, duration/4, duration/2, 3*duration/4, duration];
    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI/2);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 3*Math.PI/2);
    const q4 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 2*Math.PI);
    
    const crankTrack = new THREE.QuaternionKeyframeTrack('crankPivot.quaternion', crankTimes, [
        ...q0.toArray(), ...q1.toArray(), ...q2.toArray(), ...q3.toArray(), ...q4.toArray()
    ]);

    // Walking Beam Rocking
    const beamTimes = [0, duration/2, duration];
    const bq0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI/12);
    const bq1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI/12);
    const bq2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI/12);

    const beamTrack = new THREE.QuaternionKeyframeTrack('walkingBeam.quaternion', beamTimes, [
        ...bq0.toArray(), ...bq1.toArray(), ...bq2.toArray()
    ]);

    const clip = new THREE.AnimationClip('PumpjackCycle', duration, [crankTrack, beamTrack]);

    return { group, animationClips: [clip] };
}
