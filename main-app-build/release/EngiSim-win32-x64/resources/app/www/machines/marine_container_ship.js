import { darkSteel, brass, glass, paintedMetal } from '../utils/materials.js';

export function createContainerShip(THREE) {
    const group = new THREE.Group();

    // Hull
    const hullGeo = new THREE.BoxGeometry(40, 5, 8);
    const hull = new THREE.Mesh(hullGeo, darkSteel);
    hull.position.y = 2.5;
    group.add(hull);

    // Bow
    const bowGeo = new THREE.ConeGeometry(4, 8, 3, 1, false, 0, Math.PI);
    bowGeo.rotateZ(-Math.PI / 2);
    bowGeo.rotateX(Math.PI / 2);
    const bow = new THREE.Mesh(bowGeo, darkSteel);
    bow.position.set(22, 2.5, 0);
    group.add(bow);

    // Bridge / Superstructure
    const bridgeGeo = new THREE.BoxGeometry(6, 6, 7);
    const bridge = new THREE.Mesh(bridgeGeo, paintedMetal);
    bridge.position.set(-15, 8, 0);
    group.add(bridge);

    const windowGeo = new THREE.BoxGeometry(6.1, 2, 6.1);
    const windowMesh = new THREE.Mesh(windowGeo, glass);
    windowMesh.position.set(-15, 9, 0);
    group.add(windowMesh);

    // Radar
    const radarGroup = new THREE.Group();
    radarGroup.position.set(-15, 11.5, 0);
    const radarMast = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 2), darkSteel);
    const radarDish = new THREE.Mesh(new THREE.BoxGeometry(2, 0.2, 0.5), paintedMetal);
    radarDish.position.y = 1;
    radarGroup.add(radarMast);
    radarGroup.add(radarDish);
    group.add(radarGroup);

    // Containers
    for (let x = -8; x <= 15; x += 2.2) {
        for (let y = 5; y <= 9; y += 2.2) {
            for (let z = -3; z <= 3; z += 2.2) {
                if (Math.random() > 0.3) {
                    const container = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), paintedMetal);
                    container.position.set(x, y + 1, z);
                    group.add(container);
                }
            }
        }
    }

    // Propeller
    const propGroup = new THREE.Group();
    propGroup.position.set(-20, 1, 0);
    const prop = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.2, 16), brass);
    prop.rotation.z = Math.PI / 2;
    propGroup.add(prop);
    group.add(propGroup);

    // Animations
    const propTrack = new THREE.NumberKeyframeTrack(
        `${propGroup.uuid}.rotation[x]`,
        [0, 1],
        [0, Math.PI * 2]
    );
    const radarTrack = new THREE.NumberKeyframeTrack(
        `${radarGroup.uuid}.rotation[y]`,
        [0, 2],
        [0, Math.PI * 2]
    );

    const propClip = new THREE.AnimationClip('PropellerSpin', 1, [propTrack]);
    const radarClip = new THREE.AnimationClip('RadarSpin', 2, [radarTrack]);

    return { group, animationClips: [propClip, radarClip] };
}
