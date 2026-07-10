import { carbonFiber, titanium, wireCoil, gold, glass } from '../utils/materials.js';

export function createRetinalImplant(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const eyeGlobeGeo = new THREE.SphereGeometry(2, 64, 64);
    const eyeGlobe = new THREE.Mesh(eyeGlobeGeo, glass);
    group.add(eyeGlobe);

    const implantBaseGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.2, 32);
    const implantBase = new THREE.Mesh(implantBaseGeo, titanium);
    implantBase.position.z = -1.9;
    implantBase.rotation.x = Math.PI / 2;
    eyeGlobe.add(implantBase);

    const electrodeArrayGeo = new THREE.PlaneGeometry(1.2, 1.2, 10, 10);
    const electrodeArray = new THREE.Mesh(electrodeArrayGeo, gold);
    electrodeArray.position.y = 0.15;
    electrodeArray.rotation.x = -Math.PI / 2;
    implantBase.add(electrodeArray);

    const processorGeo = new THREE.BoxGeometry(0.5, 0.5, 0.2);
    const processor = new THREE.Mesh(processorGeo, carbonFiber);
    processor.position.z = 0.3;
    implantBase.add(processor);

    const wireGeo = new THREE.TorusGeometry(2.5, 0.05, 16, 100, Math.PI);
    const wire = new THREE.Mesh(wireGeo, wireCoil);
    wire.position.z = -1;
    wire.rotation.x = Math.PI / 2;
    group.add(wire);

    const opticSensorGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 32);
    const opticSensor = new THREE.Mesh(opticSensorGeo, titanium);
    opticSensor.position.z = 1.9;
    opticSensor.rotation.x = Math.PI / 2;
    eyeGlobe.add(opticSensor);

    const lensGeo = new THREE.SphereGeometry(0.3, 32, 32);
    const lens = new THREE.Mesh(lensGeo, glass);
    lens.position.y = 0.2;
    opticSensor.add(lens);

    const scanLaserGeo = new THREE.CylinderGeometry(0.02, 0.02, 4);
    const scanLaserMat = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.5 });
    const scanLaser = new THREE.Mesh(scanLaserGeo, scanLaserMat);
    scanLaser.position.y = 2.2;
    scanLaser.name = "ScanLaser";
    opticSensor.add(scanLaser);

    const laserTrack = new THREE.NumberKeyframeTrack(
        'ScanLaser.rotation[x]',
        [0, 1, 2, 3, 4],
        [-0.2, 0.2, -0.2, 0.2, -0.2]
    );
    const laserZTrack = new THREE.NumberKeyframeTrack(
        'ScanLaser.rotation[z]',
        [0, 2, 4],
        [-0.2, 0.2, -0.2]
    );

    const clip = new THREE.AnimationClip('Scan', 4, [laserTrack, laserZTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
