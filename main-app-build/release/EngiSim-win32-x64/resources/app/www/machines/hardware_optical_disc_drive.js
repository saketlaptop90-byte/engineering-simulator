import { materials } from '../utils/materials.js';

export function createOpticalDiscDrive(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Drive Casing
    const casingGeo = new THREE.BoxGeometry(5, 1.5, 6);
    const casingMesh = new THREE.Mesh(casingGeo, materials.darkMetal || materials.metallic);
    casingMesh.position.y = 0.75;
    group.add(casingMesh);

    // Tray
    const trayGeo = new THREE.BoxGeometry(4.8, 0.2, 5.5);
    const trayMesh = new THREE.Mesh(trayGeo, materials.plastic || materials.metallic);
    trayMesh.position.set(0, 1, 0);
    trayMesh.name = "ODD_Tray";
    group.add(trayMesh);

    // Disc (on tray)
    const discGeo = new THREE.CylinderGeometry(2, 2, 0.05, 32);
    const discMesh = new THREE.Mesh(discGeo, materials.shinyMetal || materials.metallic);
    discMesh.position.set(0, 0.15, 0);
    discMesh.name = "ODD_Disc";
    trayMesh.add(discMesh);

    // Laser assembly (under disc)
    const laserGeo = new THREE.BoxGeometry(0.5, 0.2, 1);
    const laserMesh = new THREE.Mesh(laserGeo, materials.metallic);
    laserMesh.position.set(1, -0.1, 0);
    laserMesh.name = "ODD_Laser";
    trayMesh.add(laserMesh);

    // Animations
    // 1. Tray opening and closing
    const trayTimes = [0, 2, 4, 6];
    const trayValues = [
        0, 1, 0,
        0, 1, 4,
        0, 1, 4,
        0, 1, 0
    ];
    const trayTrack = new THREE.VectorKeyframeTrack('ODD_Tray.position', trayTimes, trayValues);
    
    // 2. Disc spinning
    const spinTimes = [0, 0.25, 0.5, 0.75, 1];
    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI/2);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI*1.5);
    const q4 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI*2);
    const spinValues = [
        ...q0.toArray(), ...q1.toArray(), ...q2.toArray(), ...q3.toArray(), ...q4.toArray()
    ];
    const spinTrack = new THREE.QuaternionKeyframeTrack('ODD_Disc.quaternion', spinTimes, spinValues);

    // 3. Laser seeking (sliding along radius)
    const laserTimes = [0, 1, 2, 3, 4];
    const laserValues = [
        1, -0.1, 0,
        0.5, -0.1, 0,
        1.5, -0.1, 0,
        0.8, -0.1, 0,
        1, -0.1, 0
    ];
    const laserTrack = new THREE.VectorKeyframeTrack('ODD_Laser.position', laserTimes, laserValues);

    const mainClip = new THREE.AnimationClip('ODD_Action', 6, [trayTrack, spinTrack, laserTrack]);
    animationClips.push(mainClip);

    return { group, animationClips };
}
