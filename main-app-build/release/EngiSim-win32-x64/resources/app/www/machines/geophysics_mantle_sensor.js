import { darkSteel, copper, titanium } from '../utils/materials.js';

export function createMantleSensorArray(THREE) {
    const group = new THREE.Group();
    group.name = "MantleSensorArray";

    // Central Core
    const coreGeo = new THREE.IcosahedronGeometry(3, 1);
    const core = new THREE.Mesh(coreGeo, copper);
    core.position.y = 5;
    group.add(core);

    // Sensor Arms
    const arms = [];
    for(let i=0; i<6; i++) {
        const armGroup = new THREE.Group();
        armGroup.position.y = 5;
        
        const armGeo = new THREE.BoxGeometry(0.5, 8, 0.5);
        armGeo.translate(0, 4, 0); // Translate geometry so origin is at the base
        const arm = new THREE.Mesh(armGeo, titanium);
        
        arm.rotation.z = Math.PI / 4;
        
        armGroup.rotation.y = (i / 6) * Math.PI * 2;
        armGroup.add(arm);
        
        group.add(armGroup);
        arms.push(arm);
    }

    // Base casing
    const baseGeo = new THREE.CylinderGeometry(2, 4, 2, 32);
    const base = new THREE.Mesh(baseGeo, darkSteel);
    base.position.y = 1;
    group.add(base);

    // Animation
    const tracks = [];
    
    // Core pulsing
    tracks.push(new THREE.VectorKeyframeTrack(
        `${core.uuid}.scale`,
        [0, 1, 2],
        [1, 1, 1, 1.2, 1.2, 1.2, 1, 1, 1]
    ));

    // Arms opening and closing
    arms.forEach((arm) => {
        tracks.push(new THREE.NumberKeyframeTrack(
            `${arm.uuid}.rotation[z]`,
            [0, 1, 2],
            [Math.PI / 4, Math.PI / 2, Math.PI / 4]
        ));
    });

    const clip = new THREE.AnimationClip("SensorPulse", 2, tracks);

    return { group, animationClips: [clip] };
}
