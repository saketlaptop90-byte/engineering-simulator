import { aluminum, titanium, glass } from '../utils/materials.js';

export function createCarbonCaptureTower(THREE) {
    const group = new THREE.Group();
    group.name = 'CarbonCaptureTower';

    // Base
    const baseGeo = new THREE.CylinderGeometry(5, 5, 2, 32);
    const base = new THREE.Mesh(baseGeo, titanium);
    base.position.y = 1;
    group.add(base);

    // Tower Body
    const towerGeo = new THREE.CylinderGeometry(3, 4, 20, 32);
    const tower = new THREE.Mesh(towerGeo, aluminum);
    tower.position.y = 12;
    group.add(tower);

    // Glass Intake Area
    const intakeGeo = new THREE.SphereGeometry(4.5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const intake = new THREE.Mesh(intakeGeo, glass);
    intake.position.y = 22;
    group.add(intake);

    // Fan/Turbine inside intake
    const fanGroup = new THREE.Group();
    fanGroup.position.y = 22;
    
    const hubGeo = new THREE.CylinderGeometry(0.5, 0.5, 1, 16);
    const hub = new THREE.Mesh(hubGeo, titanium);
    hub.rotation.x = Math.PI / 2;
    fanGroup.add(hub);

    for(let i=0; i<4; i++) {
        const bladeGeo = new THREE.BoxGeometry(0.2, 3, 0.5);
        const blade = new THREE.Mesh(bladeGeo, aluminum);
        blade.position.y = 1.5;
        const pivot = new THREE.Group();
        pivot.rotation.z = (Math.PI / 2) * i;
        pivot.add(blade);
        fanGroup.add(pivot);
    }
    fanGroup.name = 'TurbineFan';
    group.add(fanGroup);

    // Animation: Spinning Turbine
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI * 2);
    const trackTimes = [0, 1, 2];
    const trackValues = [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ];
    const spinTrack = new THREE.QuaternionKeyframeTrack('TurbineFan.quaternion', trackTimes, trackValues);
    const spinClip = new THREE.AnimationClip('Spin', 2, [spinTrack]);

    return { group, animationClips: [spinClip] };
}
