import * as materials from '../utils/materials.js';

export function createMicrowaveParabolicDish(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main support pole
    const poleGeo = new THREE.CylinderGeometry(0.3, 0.3, 4);
    const pole = new THREE.Mesh(poleGeo, materials.steel);
    pole.position.y = -2;
    group.add(pole);

    // Pan / Tilt mount mechanism
    const panGroup = new THREE.Group();
    group.add(panGroup);

    const bracketBaseGeo = new THREE.BoxGeometry(0.8, 0.4, 0.8);
    const bracketBase = new THREE.Mesh(bracketBaseGeo, materials.darkSteel);
    panGroup.add(bracketBase);

    const tiltGroup = new THREE.Group();
    panGroup.add(tiltGroup);

    const bracketArmGeo = new THREE.BoxGeometry(0.2, 1, 0.4);
    const bracketArm = new THREE.Mesh(bracketArmGeo, materials.aluminum);
    bracketArm.position.set(0.4, 0.5, 0);
    tiltGroup.add(bracketArm);

    const bracketArm2 = new THREE.Mesh(bracketArmGeo, materials.aluminum);
    bracketArm2.position.set(-0.4, 0.5, 0);
    tiltGroup.add(bracketArm2);

    // Dish backing structure
    const dishBackingGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.4);
    const dishBacking = new THREE.Mesh(dishBackingGeo, materials.castIron);
    dishBacking.rotation.x = Math.PI / 2;
    dishBacking.position.set(0, 0.8, 0.3);
    tiltGroup.add(dishBacking);

    // The Parabolic Dish (approximated with a flattened sphere segment)
    const dishGeo = new THREE.SphereGeometry(3, 32, 16, 0, Math.PI * 2, 0, Math.PI / 3);
    const dish = new THREE.Mesh(dishGeo, materials.whitePlastic);
    dish.rotation.x = -Math.PI / 2;
    dish.position.set(0, 0.8, 0.5);
    tiltGroup.add(dish);

    // Radome cover
    const coverGeo = new THREE.CylinderGeometry(2.55, 2.55, 0.1, 32);
    const cover = new THREE.Mesh(coverGeo, materials.whitePlastic);
    cover.rotation.x = Math.PI / 2;
    cover.position.set(0, 0.8, 1.8);
    tiltGroup.add(cover);

    // Feed Horn
    const feedGeo = new THREE.CylinderGeometry(0.1, 0.2, 1.2);
    const feed = new THREE.Mesh(feedGeo, materials.brass);
    feed.rotation.x = Math.PI / 2;
    feed.position.set(0, 0.8, 1);
    tiltGroup.add(feed);

    // Animations: Scanning or Tracking
    const panTrack = new THREE.NumberKeyframeTrack(`${panGroup.uuid}.rotation[y]`, 
        [0, 5, 10, 15, 20], 
        [0, Math.PI/6, 0, -Math.PI/6, 0]
    );

    const tiltTrack = new THREE.NumberKeyframeTrack(`${tiltGroup.uuid}.rotation[x]`, 
        [0, 2.5, 7.5, 12.5, 17.5, 20], 
        [0, Math.PI/12, -Math.PI/12, Math.PI/12, -Math.PI/12, 0]
    );

    const scanClip = new THREE.AnimationClip('DishTracking', 20, [panTrack, tiltTrack]);
    animationClips.push(scanClip);

    return { group, animationClips };
}
