import * as materials from '../utils/materials.js';

export function createAutomatedHaulTruck(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const matMetal = materials.metalMaterial || new THREE.MeshStandardMaterial({ color: 0x777777, roughness: 0.6, metalness: 0.6 });
    const matYellow = materials.yellowMaterial || new THREE.MeshStandardMaterial({ color: 0xffcc00, roughness: 0.4, metalness: 0.1 });
    const matDark = materials.darkMaterial || new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9, metalness: 0.1 });
    const matTire = materials.rubberMaterial || new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9, metalness: 0 });

    // Chassis
    const chassisGeo = new THREE.BoxGeometry(10, 1.5, 6);
    const chassis = new THREE.Mesh(chassisGeo, matDark);
    chassis.position.set(0, 3, 0);
    group.add(chassis);

    // Wheels
    const wheelGeo = new THREE.CylinderGeometry(2, 2, 1.5, 24);
    wheelGeo.rotateX(Math.PI / 2);
    
    const wheelPositions = [
        [3.5, 2, 3.5], [-3.5, 2, 3.5],
        [3.5, 2, -3.5], [-3.5, 2, -3.5]
    ];
    
    const wheels = [];
    wheelPositions.forEach((pos, idx) => {
        const w = new THREE.Mesh(wheelGeo, matTire);
        w.position.set(...pos);
        w.name = `Wheel_${idx}`;
        group.add(w);
        wheels.push(w);
    });

    // Cabin
    const cabinGeo = new THREE.BoxGeometry(2.5, 2.5, 4);
    const cabin = new THREE.Mesh(cabinGeo, matMetal);
    cabin.position.set(3, 5, 1);
    group.add(cabin);

    // Dump Bed
    const bedGroup = new THREE.Group();
    bedGroup.name = "DumpBed";
    bedGroup.position.set(-4.5, 4, 0); // Hinge point
    group.add(bedGroup);

    const bedBaseGeo = new THREE.BoxGeometry(11, 0.5, 7);
    const bedBase = new THREE.Mesh(bedBaseGeo, matYellow);
    bedBase.position.set(4.5, 0, 0);
    bedGroup.add(bedBase);

    const bedWallGeo = new THREE.BoxGeometry(11, 3, 0.5);
    const leftWall = new THREE.Mesh(bedWallGeo, matYellow);
    leftWall.position.set(4.5, 1.5, 3.25);
    const rightWall = new THREE.Mesh(bedWallGeo, matYellow);
    rightWall.position.set(4.5, 1.5, -3.25);
    bedGroup.add(leftWall, rightWall);

    const bedFrontGeo = new THREE.BoxGeometry(0.5, 3, 7);
    const frontWall = new THREE.Mesh(bedFrontGeo, matYellow);
    frontWall.position.set(9.75, 1.5, 0);
    bedGroup.add(frontWall);

    // Animations
    const times = [0, 2, 4, 6, 8];
    // Driving wheels
    const wQ1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0);
    const wQ2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), -Math.PI);
    const wQ3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), -Math.PI*2);
    const wheelVals = [...wQ1.toArray(), ...wQ2.toArray(), ...wQ3.toArray(), ...wQ2.toArray(), ...wQ1.toArray()];
    
    const wheelTracks = wheels.map((w, idx) => 
        new THREE.QuaternionKeyframeTrack(`${w.name}.quaternion`, times, wheelVals)
    );

    // Dump sequence
    const bQ1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0);
    const bQ2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0); // Wait
    const bQ3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI / 4); // Dump
    const bQ4 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI / 4); // Hold
    const bQ5 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0); // Return
    
    const bedVals = [...bQ1.toArray(), ...bQ2.toArray(), ...bQ3.toArray(), ...bQ4.toArray(), ...bQ5.toArray()];
    const bedTrack = new THREE.QuaternionKeyframeTrack('DumpBed.quaternion', times, bedVals);

    const clip = new THREE.AnimationClip('HaulAndDump', 8, [...wheelTracks, bedTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
