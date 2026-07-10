import { whitePlastic, titanium, blueAccent, glass } from '../utils/materials.js';

export function createInflatableOrbitalModule(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Central Rigid Core
    const coreGeo = new THREE.CylinderGeometry(3, 3, 20, 32);
    const core = new THREE.Mesh(coreGeo, titanium);
    group.add(core);

    // Inflatable Section
    const inflatableGeo = new THREE.SphereGeometry(10, 32, 32);
    const inflatable = new THREE.Mesh(inflatableGeo, whitePlastic);
    inflatable.scale.set(1, 0.8, 1);
    group.add(inflatable);

    // Straps / Ribs
    const ribGeo = new THREE.TorusGeometry(10.1, 0.2, 16, 32);
    for (let i = 0; i < 4; i++) {
        const rib = new THREE.Mesh(ribGeo, blueAccent);
        rib.rotation.y = (Math.PI / 4) * i;
        inflatable.add(rib);
    }

    // Docking Ports
    const portGeo = new THREE.CylinderGeometry(2.5, 2.5, 2, 32);
    const topPort = new THREE.Mesh(portGeo, titanium);
    topPort.position.y = 11;
    group.add(topPort);

    const bottomPort = new THREE.Mesh(portGeo, titanium);
    bottomPort.position.y = -11;
    group.add(bottomPort);

    // Solar Arrays
    const solarGeo = new THREE.BoxGeometry(15, 0.5, 5);
    const solarLeft = new THREE.Mesh(solarGeo, glass);
    solarLeft.position.set(-12, 0, 0);
    const solarRight = new THREE.Mesh(solarGeo, glass);
    solarRight.position.set(12, 0, 0);

    const solarGroup = new THREE.Group();
    solarGroup.add(solarLeft);
    solarGroup.add(solarRight);
    group.add(solarGroup);

    // Animations: Breathing (inflation/deflation) effect and solar array rotation
    const scaleTrack = new THREE.VectorKeyframeTrack(
        `${inflatable.uuid}.scale`,
        [0, 5, 10],
        [1, 0.8, 1,   1.05, 0.85, 1.05,   1, 0.8, 1]
    );
    const inflateClip = new THREE.AnimationClip('Breathing', 10, [scaleTrack]);
    animationClips.push(inflateClip);

    const solarTrack = new THREE.NumberKeyframeTrack(`${solarGroup.uuid}.rotation[x]`, [0, 15], [0, Math.PI * 2]);
    const solarClip = new THREE.AnimationClip('SolarTracking', 15, [solarTrack]);
    animationClips.push(solarClip);

    return { group, animationClips };
}
