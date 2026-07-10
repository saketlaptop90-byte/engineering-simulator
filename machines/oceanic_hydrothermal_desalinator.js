import { titanium, glass, darkSteel } from '../utils/materials.js';

export function createHydrothermalDesalinator(THREE) {
    const group = new THREE.Group();

    // Central Glass Tank
    const tankGeo = new THREE.CylinderGeometry(3, 3, 10, 16);
    const tank = new THREE.Mesh(tankGeo, glass);
    tank.position.y = 5;
    group.add(tank);

    // Support Frames
    const frameGeo = new THREE.TorusGeometry(3.5, 0.5, 8, 24);
    const frame1 = new THREE.Mesh(frameGeo, darkSteel);
    frame1.rotation.x = Math.PI / 2;
    frame1.position.y = 2;
    group.add(frame1);

    const frame2 = new THREE.Mesh(frameGeo, darkSteel);
    frame2.rotation.x = Math.PI / 2;
    frame2.position.y = 8;
    group.add(frame2);

    // Pump piston inside tank
    const pistonGeo = new THREE.CylinderGeometry(1, 1, 4, 16);
    const piston = new THREE.Mesh(pistonGeo, titanium);
    piston.position.y = 5;
    group.add(piston);

    const positionKF = new THREE.VectorKeyframeTrack(
        '.children[3].position',
        [0, 1, 2],
        [0, 3, 0, 0, 7, 0, 0, 3, 0]
    );

    const clip = new THREE.AnimationClip('PumpAction', 2, [positionKF]);

    return { group, animationClips: [clip] };
}
