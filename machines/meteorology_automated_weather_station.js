import * as materials from '../utils/materials.js';

export function createAutomatedWeatherStation(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const matMetal = materials.metal || new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.8, roughness: 0.3 });
    const matPlastic = materials.plastic || new THREE.MeshStandardMaterial({ color: 0xdddddd });
    const matSolar = materials.glass || new THREE.MeshStandardMaterial({ color: 0x000033, roughness: 0.1, metalness: 0.5 });

    // Main Mast
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 6), matMetal);
    mast.position.y = 3;
    group.add(mast);

    // Solar Panel
    const solarPanel = new THREE.Mesh(new THREE.BoxGeometry(1, 0.05, 1.5), matSolar);
    solarPanel.position.set(0.6, 2.5, 0);
    solarPanel.rotation.z = Math.PI / 4;
    group.add(solarPanel);

    // Temperature Shield
    const shieldGroup = new THREE.Group();
    shieldGroup.position.set(-0.5, 3.5, 0);
    for(let i=0; i<5; i++) {
        const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.05), matPlastic);
        plate.position.y = i * 0.1;
        shieldGroup.add(plate);
    }
    group.add(shieldGroup);

    // Wind Vane (Direction)
    const vaneGroup = new THREE.Group();
    vaneGroup.name = "windVane";
    vaneGroup.position.y = 6.2;
    group.add(vaneGroup);

    const vaneRod = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1), matMetal);
    vaneRod.rotation.x = Math.PI / 2;
    vaneGroup.add(vaneRod);

    const vaneTail = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.3, 0.3), matMetal);
    vaneTail.position.z = -0.5;
    vaneGroup.add(vaneTail);

    const vaneHead = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.2), matMetal);
    vaneHead.rotation.x = Math.PI / 2;
    vaneHead.position.z = 0.5;
    vaneGroup.add(vaneHead);

    // Anemometer (Speed)
    const anemometerGroup = new THREE.Group();
    anemometerGroup.position.set(0.5, 6, 0);
    group.add(anemometerGroup);
    
    const anemoBase = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.2), matMetal);
    anemoBase.rotation.z = Math.PI / 2;
    anemoBase.position.x = -0.25;
    anemometerGroup.add(anemoBase);

    const cupsGroup = new THREE.Group();
    cupsGroup.name = "cups";
    anemometerGroup.add(cupsGroup);

    for(let i=0; i<3; i++) {
        const angle = (i / 3) * Math.PI * 2;
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.4), matMetal);
        arm.rotation.z = Math.PI / 2;
        arm.rotation.y = angle;
        arm.position.set(Math.cos(angle)*0.2, 0, -Math.sin(angle)*0.2);
        cupsGroup.add(arm);
        
        const cup = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16, 0, Math.PI), matPlastic);
        cup.rotation.y = angle;
        cup.position.set(Math.cos(angle)*0.4, 0, -Math.sin(angle)*0.4);
        cupsGroup.add(cup);
    }

    // Animations
    // 1. Spinning cups
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI * 2);
    
    const trackCups = new THREE.QuaternionKeyframeTrack('cups.quaternion', [0, 0.5, 1], [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ]);
    
    // 2. Vane oscillating slightly
    const v1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), -0.2);
    const v2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0.3);
    const v3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), -0.2);

    const trackVane = new THREE.QuaternionKeyframeTrack('windVane.quaternion', [0, 2, 4], [
        v1.x, v1.y, v1.z, v1.w,
        v2.x, v2.y, v2.z, v2.w,
        v3.x, v3.y, v3.z, v3.w
    ]);

    const clip = new THREE.AnimationClip('WeatherStationAnim', 4, [trackCups, trackVane]);
    animationClips.push(clip);

    return { group, animationClips };
}
