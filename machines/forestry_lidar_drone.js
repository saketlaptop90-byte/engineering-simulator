import {
    metalMaterial,
    glassMaterial,
    blackRubberMaterial,
    redPaintMaterial
} from '../utils/materials.js';

export function createLidarDrone(THREE) {
    const group = new THREE.Group();
    group.name = 'LidarDrone';
    const animationClips = [];

    // Core Body (Sleek quadcopter)
    const bodyGeo = new THREE.BoxGeometry(1.2, 0.4, 1.2);
    const body = new THREE.Mesh(bodyGeo, metalMaterial);
    group.add(body);

    // Dome / Camera housing
    const domeGeo = new THREE.SphereGeometry(0.5, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeo, glassMaterial);
    dome.position.y = 0.2;
    body.add(dome);

    // LIDAR Scanner underneath
    const lidarGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.4, 16);
    const lidar = new THREE.Mesh(lidarGeo, redPaintMaterial);
    lidar.name = 'lidarScanner';
    lidar.position.y = -0.4;
    body.add(lidar);

    // Laser beam representation (semi-transparent)
    const beamGeo = new THREE.ConeGeometry(3, 6, 16, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.2, side: THREE.DoubleSide });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.y = -3;
    lidar.add(beam);

    // 4 Quadcopter Arms
    const armPositions = [
        [1, 1],
        [-1, 1],
        [1, -1],
        [-1, -1]
    ];
    
    armPositions.forEach((pos, index) => {
        // Arm
        const armGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.5);
        const arm = new THREE.Mesh(armGeo, metalMaterial);
        arm.position.set(pos[0] * 0.75, 0, pos[1] * 0.75);
        arm.rotation.x = Math.PI / 2;
        arm.rotation.z = Math.atan2(pos[1], pos[0]);
        body.add(arm);

        // Rotor Motor
        const motorGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.2);
        const motor = new THREE.Mesh(motorGeo, redPaintMaterial);
        motor.position.set(pos[0] * 1.5, 0.1, pos[1] * 1.5);
        body.add(motor);

        // Propeller
        const propGeo = new THREE.BoxGeometry(1.2, 0.02, 0.1);
        const prop = new THREE.Mesh(propGeo, blackRubberMaterial);
        prop.position.set(pos[0] * 1.5, 0.2, pos[1] * 1.5);
        prop.name = `droneProp_${index}`;
        body.add(prop);
    });

    // Animations
    const times = [0, 0.25, 0.5];
    const tracks = [];

    // Propellers spinning fast
    armPositions.forEach((_, index) => {
        const propQuats = [];
        const qProp = new THREE.Quaternion();
        [0, Math.PI, Math.PI * 2].forEach(angle => {
            qProp.setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle * (index % 2 === 0 ? 1 : -1));
            propQuats.push(qProp.x, qProp.y, qProp.z, qProp.w);
        });
        tracks.push(new THREE.QuaternionKeyframeTrack(`droneProp_${index}.quaternion`, times, propQuats));
    });

    // LIDAR Scanner spinning
    const lidarQuats = [];
    const qLidar = new THREE.Quaternion();
    [0, Math.PI, Math.PI * 2].forEach(angle => {
        qLidar.setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
        lidarQuats.push(qLidar.x, qLidar.y, qLidar.z, qLidar.w);
    });
    tracks.push(new THREE.QuaternionKeyframeTrack('lidarScanner.quaternion', times, lidarQuats));

    // Drone gentle hover
    const hoverTimes = [0, 1, 2, 3, 4];
    const hoverVals = [
        0, 0, 0,
        0, 0.2, 0.1,
        0, 0, 0,
        0, -0.2, -0.1,
        0, 0, 0
    ];
    tracks.push(new THREE.VectorKeyframeTrack('LidarDrone.position', hoverTimes, hoverVals));

    const clip = new THREE.AnimationClip('LidarScanFlight', 4, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
