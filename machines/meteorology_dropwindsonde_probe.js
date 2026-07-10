import { colors, getMaterial } from '../utils/materials.js';

export function createDropwindsondeProbe(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    group.name = "DropwindsondeSystem";

    // Parachute
    const chuteGeometry = new THREE.SphereGeometry(1.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const chuteMaterial = getMaterial('fabric', colors.orange || 0xff8c00);
    chuteMaterial.side = THREE.DoubleSide;
    const chute = new THREE.Mesh(chuteGeometry, chuteMaterial);
    chute.position.y = 4;
    chute.scale.y = 0.8;
    group.add(chute);

    // Chute lines
    const lineMaterial = getMaterial('plastic', colors.white);
    for(let i=0; i<8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 1.4;
        
        const lineGeom = new THREE.CylinderGeometry(0.01, 0.01, 4.2, 4);
        const line = new THREE.Mesh(lineGeom, lineMaterial);
        
        line.position.x = Math.cos(angle) * (radius / 2);
        line.position.z = Math.sin(angle) * (radius / 2);
        line.position.y = 2;
        
        line.lookAt(0, 0, 0); 
        line.rotateX(Math.PI / 2);
        
        group.add(line);
    }

    // Probe Body
    const bodyGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1.2, 16);
    const body = new THREE.Mesh(bodyGeometry, getMaterial('plastic', colors.white));
    body.position.y = -0.6;
    group.add(body);

    // Sensor arms (deployable)
    const armGroup1 = new THREE.Group();
    armGroup1.position.y = -0.4;
    armGroup1.name = "SensorArm1";
    group.add(armGroup1);
    
    const arm1Geom = new THREE.BoxGeometry(0.4, 0.02, 0.05);
    const arm1 = new THREE.Mesh(arm1Geom, getMaterial('metallic', colors.silver));
    arm1.position.x = 0.2;
    armGroup1.add(arm1);

    const armGroup2 = new THREE.Group();
    armGroup2.position.y = -0.6;
    armGroup2.name = "SensorArm2";
    group.add(armGroup2);
    
    const arm2Geom = new THREE.BoxGeometry(0.4, 0.02, 0.05);
    const arm2 = new THREE.Mesh(arm2Geom, getMaterial('metallic', colors.silver));
    arm2.position.x = -0.2;
    armGroup2.add(arm2);

    // Antenna
    const antennaGeom = new THREE.CylinderGeometry(0.01, 0.01, 0.8, 8);
    const antenna = new THREE.Mesh(antennaGeom, getMaterial('metallic', colors.silver));
    antenna.position.y = -1.6;
    group.add(antenna);

    // Animation: Falling/Swaying, and sensor arms deploying
    const duration = 4;
    
    // Swaying
    const times = [0, 1, 2, 3, 4];
    const swayQ0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const swayQ1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.1, 0, 0.1));
    const swayQ2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const swayQ3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.1, 0, -0.1));
    const swayQ4 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));

    const swayTrack = new THREE.QuaternionKeyframeTrack('DropwindsondeSystem.quaternion', times, [
        swayQ0.x, swayQ0.y, swayQ0.z, swayQ0.w,
        swayQ1.x, swayQ1.y, swayQ1.z, swayQ1.w,
        swayQ2.x, swayQ2.y, swayQ2.z, swayQ2.w,
        swayQ3.x, swayQ3.y, swayQ3.z, swayQ3.w,
        swayQ4.x, swayQ4.y, swayQ4.z, swayQ4.w
    ]);
    
    // Arm deployment
    const armTimes = [0, 1];
    
    const foldQ1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, -Math.PI/2));
    const openQ1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    
    const foldQ2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI/2));
    const openQ2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));

    const arm1Track = new THREE.QuaternionKeyframeTrack('SensorArm1.quaternion', armTimes, [
        foldQ1.x, foldQ1.y, foldQ1.z, foldQ1.w,
        openQ1.x, openQ1.y, openQ1.z, openQ1.w
    ]);
    
    const arm2Track = new THREE.QuaternionKeyframeTrack('SensorArm2.quaternion', armTimes, [
        foldQ2.x, foldQ2.y, foldQ2.z, foldQ2.w,
        openQ2.x, openQ2.y, openQ2.z, openQ2.w
    ]);

    const clip = new THREE.AnimationClip('DeployAndFall', duration, [swayTrack, arm1Track, arm2Track]);
    animationClips.push(clip);

    return { group, animationClips };
}
