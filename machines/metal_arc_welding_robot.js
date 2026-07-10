import * as materials from '../utils/materials.js';

export function createArcWeldingRobot(THREE) {
    const group = new THREE.Group();
    group.name = 'ArcWeldingRobot';
    const animationClips = [];

    // Base
    const baseGeometry = new THREE.CylinderGeometry(1, 1.2, 0.5, 32);
    const base = new THREE.Mesh(baseGeometry, materials.darkMetal || new THREE.MeshStandardMaterial({color: 0x333333}));
    base.position.y = 0.25;
    group.add(base);

    // Turret (rotates Y)
    const turretGeometry = new THREE.CylinderGeometry(0.8, 0.8, 1, 32);
    const turret = new THREE.Mesh(turretGeometry, materials.robotYellow || new THREE.MeshStandardMaterial({color: 0xffcc00}));
    turret.position.y = 1;
    turret.name = 'Turret';
    base.add(turret);

    // Arm 1 (rotates Z)
    const arm1Geometry = new THREE.BoxGeometry(0.6, 2, 0.6);
    arm1Geometry.translate(0, 1, 0); // pivot at bottom
    const arm1 = new THREE.Mesh(arm1Geometry, materials.robotYellow || new THREE.MeshStandardMaterial({color: 0xffcc00}));
    arm1.position.y = 0.4;
    arm1.name = 'Arm1';
    turret.add(arm1);

    // Arm 2 (rotates Z)
    const arm2Geometry = new THREE.BoxGeometry(0.4, 1.8, 0.4);
    arm2Geometry.translate(0, 0.9, 0);
    const arm2 = new THREE.Mesh(arm2Geometry, materials.robotYellow || new THREE.MeshStandardMaterial({color: 0xffcc00}));
    arm2.position.y = 2;
    arm2.name = 'Arm2';
    arm1.add(arm2);

    // Welder Head
    const headGeometry = new THREE.CylinderGeometry(0.1, 0.2, 0.5, 16);
    const head = new THREE.Mesh(headGeometry, materials.darkMetal || new THREE.MeshStandardMaterial({color: 0x111111}));
    head.position.y = 1.8;
    head.rotation.x = Math.PI / 2;
    head.name = 'Head';
    arm2.add(head);

    // Spark Particles (Hack with scale to simulate flashing)
    const sparkGeo = new THREE.SphereGeometry(0.3, 8, 8);
    const sparkMat = new THREE.MeshBasicMaterial({color: 0xffff00, transparent: true, opacity: 0.8});
    const sparks = new THREE.Mesh(sparkGeo, sparkMat);
    sparks.position.set(0, 0.3, 0); 
    sparks.name = 'Sparks';
    head.add(sparks);

    // Animations
    const duration = 4;
    const times = [0, 1, 2, 3, 4];
    
    // Animate rotations
    const turretRot = new THREE.NumberKeyframeTrack('Turret.rotation[y]', times, [0, Math.PI/4, 0, -Math.PI/4, 0]);
    const arm1Rot = new THREE.NumberKeyframeTrack('Arm1.rotation[z]', times, [0, Math.PI/6, 0, -Math.PI/6, 0]);
    const arm2Rot = new THREE.NumberKeyframeTrack('Arm2.rotation[z]', times, [0, -Math.PI/4, 0, Math.PI/4, 0]);
    
    // Spark animation
    const sparkTimes = [];
    const sparkScales = [];
    for(let i=0; i<=40; i++) {
        sparkTimes.push(i * 0.1);
        const scale = (i % 2 === 0) ? 1.5 : 0.1;
        sparkScales.push(scale, scale, scale);
    }
    const sparkScale = new THREE.VectorKeyframeTrack('Sparks.scale', sparkTimes, sparkScales);

    const clip = new THREE.AnimationClip('WeldCycle', duration, [
        turretRot, arm1Rot, arm2Rot, sparkScale
    ]);

    animationClips.push(clip);

    return { group, animationClips };
}
