import * as materials from '../utils/materials.js';

export function createAutomatedPetriDishAnalyzer(THREE) {
    const metal = materials.metal || new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 });
    const darkMetal = materials.darkMetal || new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.4 });
    const plastic = materials.plastic || new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.5 });
    const glass = materials.glass || new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1 });

    const group = new THREE.Group();
    group.name = "AutomatedPetriDishAnalyzer";

    // Main Housing
    const housingGeo = new THREE.BoxGeometry(4, 3, 3);
    const housing = new THREE.Mesh(housingGeo, plastic);
    housing.position.y = 1.5;
    group.add(housing);

    // Input Tray
    const trayGeo = new THREE.BoxGeometry(1.5, 0.1, 2);
    const tray = new THREE.Mesh(trayGeo, darkMetal);
    tray.position.set(-1, 0.5, 1.5);
    tray.name = "InputTray";
    group.add(tray);

    // Petri Dish
    const dishGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32);
    const dish = new THREE.Mesh(dishGeo, glass);
    dish.position.set(0, 0.1, 0);
    tray.add(dish);

    // Robotic Arm
    const armGroup = new THREE.Group();
    armGroup.position.set(0, 2, 1);
    armGroup.name = "RoboticArm";

    const armBaseGeo = new THREE.CylinderGeometry(0.2, 0.2, 1);
    const armBase = new THREE.Mesh(armBaseGeo, metal);
    armBase.rotation.x = Math.PI / 2;
    armGroup.add(armBase);

    group.add(armGroup);

    // Animations: Tray sliding, arm rotating
    const times = [0, 1.5, 3];
    const trayValues = [
        -1, 0.5, 1.5,
        -1, 0.5, 0.5,
        -1, 0.5, 1.5
    ];
    const trayTrack = new THREE.VectorKeyframeTrack(tray.name + '.position', times, trayValues);

    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 2, 0));
    const q3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
    
    const armTrack = new THREE.QuaternionKeyframeTrack(armGroup.name + '.quaternion', times, [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ]);

    const analyzeClip = new THREE.AnimationClip("AnalyzeCycle", 3, [trayTrack, armTrack]);

    return { group, animationClips: [analyzeClip] };
}
