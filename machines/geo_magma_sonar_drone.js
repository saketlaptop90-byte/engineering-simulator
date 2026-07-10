import { titanium, darkSteel, gold, glass } from '../utils/materials.js';

export function createMagmaOceanSonarDrone(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main hull
    const hullGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const hull = new THREE.Mesh(hullGeo, titanium);
    hull.scale.z = 1.5;
    group.add(hull);

    // Viewport
    const viewGeo = new THREE.SphereGeometry(1, 16, 16);
    const viewport = new THREE.Mesh(viewGeo, glass);
    viewport.position.z = 1.5;
    viewport.scale.z = 0.5;
    group.add(viewport);

    // Sonar dish
    const dishGeo = new THREE.CylinderGeometry(1, 0.5, 0.5, 16);
    const dishGroup = new THREE.Group();
    dishGroup.name = "sonarDish";
    const dish = new THREE.Mesh(dishGeo, gold);
    dish.rotation.x = Math.PI / 2;
    dish.position.z = -1.5;
    dishGroup.add(dish);
    group.add(dishGroup);

    // Propellers
    const propGroup1 = new THREE.Group();
    propGroup1.name = "prop1";
    const propGeo = new THREE.BoxGeometry(0.2, 2, 0.2);
    const prop1 = new THREE.Mesh(propGeo, darkSteel);
    propGroup1.add(prop1);
    propGroup1.position.set(2, 0, -1);
    group.add(propGroup1);

    const propGroup2 = new THREE.Group();
    propGroup2.name = "prop2";
    const prop2 = new THREE.Mesh(propGeo, darkSteel);
    propGroup2.add(prop2);
    propGroup2.position.set(-2, 0, -1);
    group.add(propGroup2);

    // Animations: props spin, dish oscillates
    const p0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0);
    const p1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI/2);
    const p2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI);
    const p3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI*1.5);
    const p4 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI*2);
    const propTimes = [0, 0.25, 0.5, 0.75, 1.0];
    const propVals = [
        p0.x, p0.y, p0.z, p0.w,
        p1.x, p1.y, p1.z, p1.w,
        p2.x, p2.y, p2.z, p2.w,
        p3.x, p3.y, p3.z, p3.w,
        p4.x, p4.y, p4.z, p4.w
    ];

    const prop1Track = new THREE.QuaternionKeyframeTrack('prop1.quaternion', propTimes, propVals);
    const prop2Track = new THREE.QuaternionKeyframeTrack('prop2.quaternion', propTimes, propVals);

    const d0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0);
    const d1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0.5);
    const d2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0);
    const d3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), -0.5);
    const d4 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0);
    const dishTimes = [0, 0.25, 0.5, 0.75, 1.0];
    const dishVals = [
        d0.x, d0.y, d0.z, d0.w,
        d1.x, d1.y, d1.z, d1.w,
        d2.x, d2.y, d2.z, d2.w,
        d3.x, d3.y, d3.z, d3.w,
        d4.x, d4.y, d4.z, d4.w
    ];
    const dishTrack = new THREE.QuaternionKeyframeTrack('sonarDish.quaternion', dishTimes, dishVals);

    const clip = new THREE.AnimationClip('DroneAnim', 1, [prop1Track, prop2Track, dishTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
