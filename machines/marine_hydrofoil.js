import { darkSteel, brass, glass, paintedMetal } from '../utils/materials.js';

export function createHydrofoil(THREE) {
    const group = new THREE.Group();

    const boatGroup = new THREE.Group();
    group.add(boatGroup);

    // Hull
    const hullGeo = new THREE.CapsuleGeometry(3, 20, 16, 32);
    hullGeo.rotateZ(Math.PI / 2);
    const hull = new THREE.Mesh(hullGeo, paintedMetal);
    boatGroup.add(hull);

    // Cabin
    const cabinGeo = new THREE.BoxGeometry(14, 3, 5);
    const cabin = new THREE.Mesh(cabinGeo, paintedMetal);
    cabin.position.set(0, 3, 0);
    boatGroup.add(cabin);

    const windows = new THREE.Mesh(new THREE.BoxGeometry(14.2, 1.5, 5.2), glass);
    windows.position.set(0, 3.2, 0);
    boatGroup.add(windows);

    // Foils (underwater wings)
    const foilGroup = new THREE.Group();
    boatGroup.add(foilGroup);

    // Front Foil
    const frontStrut = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 4), darkSteel);
    frontStrut.position.set(8, -3, 0);
    foilGroup.add(frontStrut);
    
    const frontWing = new THREE.Mesh(new THREE.BoxGeometry(1, 0.2, 6), darkSteel);
    frontWing.position.set(8, -5, 0);
    foilGroup.add(frontWing);

    // Rear Foil
    const rearStrut1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 4), darkSteel);
    rearStrut1.position.set(-8, -3, 2);
    foilGroup.add(rearStrut1);

    const rearStrut2 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 4), darkSteel);
    rearStrut2.position.set(-8, -3, -2);
    foilGroup.add(rearStrut2);

    const rearWing = new THREE.Mesh(new THREE.BoxGeometry(1, 0.2, 8), darkSteel);
    rearWing.position.set(-8, -5, 0);
    foilGroup.add(rearWing);

    // Propeller on Rear Foil
    const propGroup = new THREE.Group();
    propGroup.position.set(-9, -5, 0);
    const prop = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.2, 16), brass);
    prop.rotation.z = Math.PI / 2;
    propGroup.add(prop);
    foilGroup.add(propGroup);

    // Animations
    // 1. Boat lifts up on foils
    const liftTrack = new THREE.NumberKeyframeTrack(
        `${boatGroup.uuid}.position[y]`,
        [0, 3, 6],
        [0, 4, 0]
    );

    // 2. Propeller spin
    const propTrack = new THREE.NumberKeyframeTrack(
        `${propGroup.uuid}.rotation[x]`,
        [0, 0.5],
        [0, Math.PI * 2]
    );

    const liftClip = new THREE.AnimationClip('FoilLift', 6, [liftTrack]);
    const spinClip = new THREE.AnimationClip('PropSpin', 0.5, [propTrack]);

    return { group, animationClips: [liftClip, spinClip] };
}
