import { steel, aluminum } from '../utils/materials.js';

export function createWeighInMotion(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Road surface
    const roadGeom = new THREE.BoxGeometry(4, 0.1, 8);
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.9 });
    const road = new THREE.Mesh(roadGeom, roadMat);
    road.position.set(0, 0.05, 0);
    group.add(road);

    // WIM Sensors (pads in the road)
    const padGeom = new THREE.BoxGeometry(3, 0.12, 0.5);
    const padMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.8, roughness: 0.4 });
    
    const pad1 = new THREE.Mesh(padGeom, padMat);
    pad1.position.set(0, 0.05, -1);
    pad1.name = 'Pad1';
    group.add(pad1);

    const pad2 = new THREE.Mesh(padGeom, padMat);
    pad2.position.set(0, 0.05, 1);
    pad2.name = 'Pad2';
    group.add(pad2);

    // Inductive Loop Wire (visible in road)
    const loopGeom = new THREE.TorusGeometry(1, 0.02, 4, 4);
    const loopMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const loop = new THREE.Mesh(loopGeom, loopMat);
    loop.rotation.x = Math.PI / 2;
    loop.rotation.z = Math.PI / 4;
    loop.position.set(0, 0.11, 0);
    group.add(loop);

    // Overhead scanner gantry
    const gantryPole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 4), steel);
    gantryPole.position.set(2.5, 2, 0);
    group.add(gantryPole);

    const gantryArm = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.2, 0.2), steel);
    gantryArm.position.set(1, 4, 0);
    group.add(gantryArm);

    // Scanner unit
    const scannerUnit = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), aluminum);
    scannerUnit.position.set(0, 3.8, 0);
    group.add(scannerUnit);

    const laserGeom = new THREE.ConeGeometry(0.5, 4, 16);
    const laserMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, transparent: true, opacity: 0.3 });
    const laser = new THREE.Mesh(laserGeom, laserMat);
    laser.position.set(0, 1.8, 0);
    laser.name = 'ScannerLaser';
    group.add(laser);

    // Animations: Pads depressing as phantom wheels pass
    const pad1Track = new THREE.VectorKeyframeTrack(
        'Pad1.position',
        [0, 1, 1.2, 1.4, 4],
        [0, 0.05, -1,   0, 0.05, -1,   0, 0.02, -1,   0, 0.05, -1,   0, 0.05, -1]
    );

    const pad2Track = new THREE.VectorKeyframeTrack(
        'Pad2.position',
        [0, 1.5, 1.7, 1.9, 4],
        [0, 0.05, 1,   0, 0.05, 1,   0, 0.02, 1,   0, 0.05, 1,   0, 0.05, 1]
    );

    // Laser flashing
    const laserTrack = new THREE.VectorKeyframeTrack(
        'ScannerLaser.scale',
        [0, 0.8, 1, 2.1, 2.3, 4],
        [0.01,0.01,0.01,  0.01,0.01,0.01,  1,1,1,  1,1,1,  0.01,0.01,0.01,  0.01,0.01,0.01]
    );

    const clip = new THREE.AnimationClip('WIM_Sequence', 4, [pad1Track, pad2Track, laserTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
