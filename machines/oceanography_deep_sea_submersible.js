import { titanium, glass, steel, redAccent, yellowAccent } from '../utils/materials.js';

export function createDeepSeaSubmersible(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Main hull
    const hullGeometry = new THREE.CylinderGeometry(2, 2, 6, 32);
    const hull = new THREE.Mesh(hullGeometry, titanium);
    hull.rotation.z = Math.PI / 2;
    group.add(hull);

    // Front Dome
    const domeGeometry = new THREE.SphereGeometry(2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeometry, glass);
    dome.rotation.z = -Math.PI / 2;
    dome.position.x = 3;
    group.add(dome);

    // Back Cone
    const coneGeometry = new THREE.ConeGeometry(2, 2, 32);
    const cone = new THREE.Mesh(coneGeometry, titanium);
    cone.rotation.z = -Math.PI / 2;
    cone.position.x = -4;
    group.add(cone);

    // Propeller
    const propGroup = new THREE.Group();
    propGroup.position.x = -5;
    
    const propCenterGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.5, 16);
    const propCenter = new THREE.Mesh(propCenterGeo, steel);
    propCenter.rotation.z = Math.PI / 2;
    propGroup.add(propCenter);

    for(let i=0; i<4; i++) {
        const bladeGeo = new THREE.BoxGeometry(0.1, 1.5, 0.4);
        const blade = new THREE.Mesh(bladeGeo, redAccent);
        blade.position.y = 0.8;
        
        const pivot = new THREE.Group();
        pivot.rotation.x = i * Math.PI / 2;
        pivot.add(blade);
        propGroup.add(pivot);
    }
    group.add(propGroup);

    // Robotic Arms
    const armGroup1 = new THREE.Group();
    armGroup1.position.set(2, -1.5, 1.5);
    const armGeo = new THREE.CylinderGeometry(0.1, 0.1, 2, 16);
    const arm1 = new THREE.Mesh(armGeo, yellowAccent);
    arm1.rotation.x = Math.PI / 4;
    armGroup1.add(arm1);
    group.add(armGroup1);

    const armGroup2 = new THREE.Group();
    armGroup2.position.set(2, -1.5, -1.5);
    const arm2 = new THREE.Mesh(armGeo, yellowAccent);
    arm2.rotation.x = -Math.PI / 4;
    armGroup2.add(arm2);
    group.add(armGroup2);

    // Lights
    const lightGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.2, 16);
    const light1 = new THREE.Mesh(lightGeo, glass);
    light1.position.set(3, 1.5, 1);
    light1.rotation.z = Math.PI / 2;
    group.add(light1);

    const light2 = new THREE.Mesh(lightGeo, glass);
    light2.position.set(3, 1.5, -1);
    light2.rotation.z = Math.PI / 2;
    group.add(light2);

    // Animations
    const duration = 2;
    const times = [0, duration];
    
    // Propeller rotation
    const propTrack = new THREE.NumberKeyframeTrack(
        `${propGroup.uuid}.rotation[x]`,
        times,
        [0, Math.PI * 4]
    );

    // Arm 1 animation
    const arm1Track = new THREE.NumberKeyframeTrack(
        `${arm1.uuid}.rotation[x]`,
        [0, 1, 2],
        [Math.PI / 4, Math.PI / 3, Math.PI / 4]
    );
    
    // Arm 2 animation
    const arm2Track = new THREE.NumberKeyframeTrack(
        `${arm2.uuid}.rotation[x]`,
        [0, 1, 2],
        [-Math.PI / 4, -Math.PI / 3, -Math.PI / 4]
    );

    const clip = new THREE.AnimationClip('SubmersibleOperation', duration, [propTrack, arm1Track, arm2Track]);
    animationClips.push(clip);

    return { group, animationClips };
}
