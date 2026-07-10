import { titanium, glass, darkSteel } from '../utils/materials.js';

export function createAbyssalHabitat(THREE) {
    const group = new THREE.Group();
    
    // Base geometry
    const coreGeo = new THREE.CylinderGeometry(5, 5, 8, 16);
    const core = new THREE.Mesh(coreGeo, titanium);
    group.add(core);
    
    // Dome
    const domeGeo = new THREE.SphereGeometry(4.8, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeo, glass);
    dome.position.y = 4;
    group.add(dome);

    // Airlock Frame
    const airlockGeo = new THREE.BoxGeometry(3, 4, 3);
    const airlock = new THREE.Mesh(airlockGeo, darkSteel);
    airlock.position.set(4, 0, 0);
    group.add(airlock);
    
    // Animation: Airlock door sliding (simulated by moving a door part)
    const doorGeo = new THREE.BoxGeometry(0.2, 3, 2);
    const door = new THREE.Mesh(doorGeo, titanium);
    door.position.set(5.5, 0, 0);
    group.add(door);

    const positionKF = new THREE.VectorKeyframeTrack(
        '.children[3].position',
        [0, 2, 4],
        [5.5, 0, 0,  5.5, 1.5, 0,  5.5, 0, 0]
    );

    const clip = new THREE.AnimationClip('AirlockCycle', 4, [positionKF]);

    return { group, animationClips: [clip] };
}
