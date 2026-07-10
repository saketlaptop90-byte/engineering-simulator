import { colors, getMaterial } from '../utils/materials.js';

export function createWeatherSatelliteAntenna(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const baseGeometry = new THREE.CylinderGeometry(1, 1, 0.5, 32);
    const base = new THREE.Mesh(baseGeometry, getMaterial('metallic', colors.darkGrey));
    group.add(base);

    // Mast
    const mastGeometry = new THREE.CylinderGeometry(0.2, 0.2, 3, 16);
    const mast = new THREE.Mesh(mastGeometry, getMaterial('metallic', colors.silver));
    mast.position.y = 1.75;
    group.add(mast);

    // Dish Base (rotates horizontally)
    const dishBaseGroup = new THREE.Group();
    dishBaseGroup.position.y = 3.25;
    group.add(dishBaseGroup);

    // Dish Pivot (rotates vertically)
    const dishPivotGroup = new THREE.Group();
    dishBaseGroup.add(dishPivotGroup);

    // Dish
    const dishGeometry = new THREE.SphereGeometry(2, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.3);
    const dish = new THREE.Mesh(dishGeometry, getMaterial('metallic', colors.white));
    dish.rotation.x = -Math.PI / 2;
    dishPivotGroup.add(dish);

    // Receiver Arm
    const armGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8);
    const arm = new THREE.Mesh(armGeometry, getMaterial('metallic', colors.silver));
    arm.position.z = 0.75;
    arm.rotation.x = Math.PI / 2;
    dishPivotGroup.add(arm);

    // Receiver Hub
    const hubGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.2, 16);
    const hub = new THREE.Mesh(hubGeometry, getMaterial('plastic', colors.black));
    hub.position.z = 1.5;
    hub.rotation.x = Math.PI / 2;
    dishPivotGroup.add(hub);

    // Animations
    const duration = 10;
    
    // Dish Base Rotation (Azimuth)
    const azTimes = [0, duration/2, duration];
    const azValues = [0, Math.PI, Math.PI * 2];
    
    // Dish Pivot Rotation (Elevation)
    const elTimes = [0, duration/4, duration/2, duration*3/4, duration];
    const elValues = [Math.PI/6, Math.PI/3, Math.PI/6, 0, Math.PI/6];
    
    dishBaseGroup.name = "DishBase";
    dishPivotGroup.name = "DishPivot";
    
    const azTrack = new THREE.NumberKeyframeTrack('DishBase.rotation[y]', azTimes, azValues);
    const elTrack = new THREE.NumberKeyframeTrack('DishPivot.rotation[x]', elTimes, elValues);
    const clip = new THREE.AnimationClip('AntennaTracking', duration, [azTrack, elTrack]);

    animationClips.push(clip);

    return { group, animationClips };
}
