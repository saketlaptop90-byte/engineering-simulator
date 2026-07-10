import { materials } from '../utils/materials.js';

export function createMechanicalKeyboardSwitch(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Housing bottom
    const bottomGeo = new THREE.BoxGeometry(1.5, 1, 1.5);
    const bottomMesh = new THREE.Mesh(bottomGeo, materials.darkPlastic || materials.metallic);
    bottomMesh.position.y = 0.5;
    group.add(bottomMesh);

    // Housing top (transparent if possible)
    const topGeo = new THREE.BoxGeometry(1.5, 0.8, 1.5);
    const topMesh = new THREE.Mesh(topGeo, materials.glass || materials.metallic);
    topMesh.position.y = 1.4;
    group.add(topMesh);

    // Stem
    const stemGroup = new THREE.Group();
    stemGroup.name = "Switch_Stem";
    stemGroup.position.y = 1.8;
    group.add(stemGroup);

    const stemGeo = new THREE.BoxGeometry(0.6, 1.2, 0.6);
    const stemMesh = new THREE.Mesh(stemGeo, materials.redPlastic || materials.metallic);
    stemGroup.add(stemMesh);

    const crossGeo = new THREE.BoxGeometry(0.8, 0.4, 0.2);
    const crossMesh1 = new THREE.Mesh(crossGeo, materials.redPlastic || materials.metallic);
    crossMesh1.position.y = 0.4;
    stemGroup.add(crossMesh1);
    
    const crossMesh2 = new THREE.Mesh(crossGeo, materials.redPlastic || materials.metallic);
    crossMesh2.rotation.y = Math.PI / 2;
    crossMesh2.position.y = 0.4;
    stemGroup.add(crossMesh2);

    // Spring
    const springGroup = new THREE.Group();
    springGroup.name = "Switch_Spring";
    springGroup.position.y = 1.0;
    group.add(springGroup);

    // Simulating a spring with a cylinder that scales in Y
    const springGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.8, 16, 1, true);
    const springMesh = new THREE.Mesh(springGeo, materials.metallic);
    // Move origin to bottom of spring
    springMesh.position.y = 0.4;
    springGroup.add(springMesh);

    // Animation: Press and release
    const times = [0, 0.2, 0.4, 1.0];
    const stemValues = [
        0, 1.8, 0,
        0, 1.4, 0, // Pressed down
        0, 1.8, 0, // Released
        0, 1.8, 0  // Idle
    ];
    const stemTrack = new THREE.VectorKeyframeTrack('Switch_Stem.position', times, stemValues);

    const springTimes = [0, 0.2, 0.4, 1.0];
    const springValues = [
        1, 1, 1,
        1, 0.5, 1, // Compressed
        1, 1, 1,   // Released
        1, 1, 1    // Idle
    ];
    const springTrack = new THREE.VectorKeyframeTrack('Switch_Spring.scale', springTimes, springValues);

    const pressClip = new THREE.AnimationClip('Press', 1, [stemTrack, springTrack]);
    animationClips.push(pressClip);

    return { group, animationClips };
}
