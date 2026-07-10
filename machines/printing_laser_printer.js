import { steel, aluminum, blackPlastic, rubber } from '../utils/materials.js';

export function createLaserPrinter(THREE) {
    const group = new THREE.Group();
    group.name = "LaserPrinter";
    const animationClips = [];

    // Outer Casing
    const casingGeo = new THREE.BoxGeometry(4, 2.5, 3.5);
    const casingMat = new THREE.MeshLambertMaterial({ color: 0xeeeeee, transparent: true, opacity: 0.7 });
    const casing = new THREE.Mesh(casingGeo, casingMat);
    casing.position.y = 1.25;
    group.add(casing);

    // Paper Tray
    const trayGeo = new THREE.BoxGeometry(3, 0.2, 4);
    const tray = new THREE.Mesh(trayGeo, blackPlastic);
    tray.position.set(0, 0.2, 1.5);
    group.add(tray);

    // Photoreceptor Drum
    const drumPivot = new THREE.Group();
    drumPivot.position.set(0, 1.5, 0);
    group.add(drumPivot);

    const drumGeo = new THREE.CylinderGeometry(0.4, 0.4, 2.8, 32);
    const drumMat = new THREE.MeshLambertMaterial({ color: 0x00aaff });
    const drum = new THREE.Mesh(drumGeo, drumMat);
    drum.rotation.z = Math.PI / 2;
    drum.name = "drum";
    drumPivot.add(drum);

    // Toner Hopper
    const hopperGeo = new THREE.BoxGeometry(2.8, 0.8, 0.8);
    const hopper = new THREE.Mesh(hopperGeo, blackPlastic);
    hopper.position.set(0, 2, -0.6);
    group.add(hopper);

    // Laser/Scanner Unit
    const scannerGeo = new THREE.BoxGeometry(2, 0.3, 1);
    const scanner = new THREE.Mesh(scannerGeo, steel);
    scanner.position.set(0, 2.2, 0.8);
    group.add(scanner);

    // Paper
    const paperGroup = new THREE.Group();
    paperGroup.name = "paperGroup";
    paperGroup.position.set(0, 0.4, 2);
    group.add(paperGroup);

    const paperGeo = new THREE.PlaneGeometry(2.1, 2.97);
    const paperMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const paper = new THREE.Mesh(paperGeo, paperMat);
    paper.rotation.x = -Math.PI / 2;
    paperGroup.add(paper);

    // Animations
    const paperTimes = [0, 1, 2, 3];
    const paperPos = [
        0, 0.4, 2,
        0, 0.4, -1,
        0, 1.8, -1,
        0, 2.5, 1
    ];
    const paperTrack = new THREE.VectorKeyframeTrack('paperGroup.position', paperTimes, paperPos);

    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 4);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);

    const paperRotTrack = new THREE.QuaternionKeyframeTrack('paperGroup.quaternion', paperTimes, [
        q0.x, q0.y, q0.z, q0.w,
        q0.x, q0.y, q0.z, q0.w,
        q1.x, q1.y, q1.z, q1.w,
        q3.x, q3.y, q3.z, q3.w
    ]);

    const drumTimes = [0, 1.5, 3];
    const dq0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
    const dq1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);
    const dq2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI * 2);
    
    const drumTrack = new THREE.QuaternionKeyframeTrack('drum.quaternion', drumTimes, [
        dq0.x, dq0.y, dq0.z, dq0.w,
        dq1.x, dq1.y, dq1.z, dq1.w,
        dq2.x, dq2.y, dq2.z, dq2.w
    ]);

    const clip = new THREE.AnimationClip('Print', 3, [paperTrack, paperRotTrack, drumTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
