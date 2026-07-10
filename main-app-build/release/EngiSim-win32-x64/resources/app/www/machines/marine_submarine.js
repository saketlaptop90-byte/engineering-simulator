import { darkSteel, brass, glass, paintedMetal } from '../utils/materials.js';

export function createSubmarine(THREE) {
    const group = new THREE.Group();

    // Main hull
    const hullGeometry = new THREE.CylinderGeometry(2, 2, 20, 32);
    hullGeometry.rotateZ(Math.PI / 2);
    const hull = new THREE.Mesh(hullGeometry, darkSteel);
    group.add(hull);

    // Front dome
    const frontDomeGeo = new THREE.SphereGeometry(2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    frontDomeGeo.rotateZ(Math.PI / 2);
    const frontDome = new THREE.Mesh(frontDomeGeo, darkSteel);
    frontDome.position.x = 10;
    group.add(frontDome);

    // Back cone
    const backConeGeo = new THREE.ConeGeometry(2, 5, 32);
    backConeGeo.rotateZ(-Math.PI / 2);
    const backCone = new THREE.Mesh(backConeGeo, darkSteel);
    backCone.position.x = -12.5;
    group.add(backCone);

    // Sail (conning tower)
    const sailGeo = new THREE.BoxGeometry(3, 4, 1.5);
    const sail = new THREE.Mesh(sailGeo, darkSteel);
    sail.position.set(3, 3, 0);
    group.add(sail);

    // Periscope
    const periscopeGeo = new THREE.CylinderGeometry(0.1, 0.1, 3, 16);
    const periscope = new THREE.Mesh(periscopeGeo, darkSteel);
    periscope.position.set(3, 4, 0);
    group.add(periscope);

    // Propeller
    const propellerGroup = new THREE.Group();
    propellerGroup.position.set(-15, 0, 0);
    const propHubGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const propHub = new THREE.Mesh(propHubGeo, brass);
    propellerGroup.add(propHub);

    for (let i = 0; i < 5; i++) {
        const bladeGeo = new THREE.BoxGeometry(0.1, 2, 0.5);
        const blade = new THREE.Mesh(bladeGeo, brass);
        blade.position.y = 1;
        
        const pivot = new THREE.Group();
        pivot.rotation.x = (i / 5) * Math.PI * 2;
        pivot.add(blade);
        propellerGroup.add(pivot);
    }
    group.add(propellerGroup);

    // Animations
    const propellerTrack = new THREE.NumberKeyframeTrack(
        `${propellerGroup.uuid}.rotation[x]`,
        [0, 1],
        [0, Math.PI * 2]
    );

    const periscopeTrack = new THREE.NumberKeyframeTrack(
        `${periscope.uuid}.position[y]`,
        [0, 2, 4],
        [4, 6, 4]
    );

    const propellerClip = new THREE.AnimationClip('SpinPropeller', 1, [propellerTrack]);
    const periscopeClip = new THREE.AnimationClip('RaisePeriscope', 4, [periscopeTrack]);

    return { group, animationClips: [propellerClip, periscopeClip] };
}
