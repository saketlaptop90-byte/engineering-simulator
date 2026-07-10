import { darkSteel, brass, glass, paintedMetal } from '../utils/materials.js';

export function createHovercraft(THREE) {
    const group = new THREE.Group();

    // Skirt (Cushion)
    const skirtGeo = new THREE.CapsuleGeometry(4, 10, 16, 32);
    skirtGeo.rotateZ(Math.PI / 2);
    const skirt = new THREE.Mesh(skirtGeo, darkSteel);
    skirt.scale.set(1, 0.3, 1.5);
    skirt.position.y = 1.2;
    group.add(skirt);

    // Main Body
    const bodyGeo = new THREE.BoxGeometry(14, 2, 8);
    const body = new THREE.Mesh(bodyGeo, paintedMetal);
    body.position.y = 3;
    group.add(body);

    // Cabin
    const cabinGeo = new THREE.BoxGeometry(6, 3, 5);
    const cabin = new THREE.Mesh(cabinGeo, paintedMetal);
    cabin.position.set(2, 5.5, 0);
    group.add(cabin);

    const windshield = new THREE.Mesh(new THREE.BoxGeometry(6.1, 1.5, 4.5), glass);
    windshield.position.set(2, 5.5, 0);
    group.add(windshield);

    // Lift Fans (Top)
    const liftFanGroup1 = new THREE.Group();
    liftFanGroup1.position.set(4, 4.1, 0);
    const fan1 = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.2, 16), darkSteel);
    liftFanGroup1.add(fan1);
    group.add(liftFanGroup1);

    const liftFanGroup2 = new THREE.Group();
    liftFanGroup2.position.set(-2, 4.1, 0);
    const fan2 = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.2, 16), darkSteel);
    liftFanGroup2.add(fan2);
    group.add(liftFanGroup2);

    // Thrust Propellers (Back)
    const thrustPropGroup1 = new THREE.Group();
    thrustPropGroup1.position.set(-7, 5, 2.5);
    const tProp1 = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.2, 16), brass);
    tProp1.rotation.z = Math.PI / 2;
    thrustPropGroup1.add(tProp1);
    
    const propShroud1 = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.2, 8, 24), darkSteel);
    propShroud1.rotation.y = Math.PI / 2;
    thrustPropGroup1.add(propShroud1);
    group.add(thrustPropGroup1);

    const thrustPropGroup2 = new THREE.Group();
    thrustPropGroup2.position.set(-7, 5, -2.5);
    const tProp2 = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.2, 16), brass);
    tProp2.rotation.z = Math.PI / 2;
    thrustPropGroup2.add(tProp2);
    
    const propShroud2 = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.2, 8, 24), darkSteel);
    propShroud2.rotation.y = Math.PI / 2;
    thrustPropGroup2.add(propShroud2);
    group.add(thrustPropGroup2);

    // Animations
    const liftFanTrack1 = new THREE.NumberKeyframeTrack(`${liftFanGroup1.uuid}.rotation[y]`, [0, 1], [0, Math.PI * 2]);
    const liftFanTrack2 = new THREE.NumberKeyframeTrack(`${liftFanGroup2.uuid}.rotation[y]`, [0, 1], [0, Math.PI * 2]);
    const thrustPropTrack1 = new THREE.NumberKeyframeTrack(`${thrustPropGroup1.uuid}.rotation[x]`, [0, 1], [0, Math.PI * 2]);
    const thrustPropTrack2 = new THREE.NumberKeyframeTrack(`${thrustPropGroup2.uuid}.rotation[x]`, [0, 1], [0, Math.PI * 2]);

    const fanClip = new THREE.AnimationClip('SpinFans', 0.5, [liftFanTrack1, liftFanTrack2, thrustPropTrack1, thrustPropTrack2]);

    return { group, animationClips: [fanClip] };
}
