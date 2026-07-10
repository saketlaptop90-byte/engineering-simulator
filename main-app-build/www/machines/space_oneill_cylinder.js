import { steel, aluminum, glass, darkSteel, blueAccent } from '../utils/materials.js';

export function createONeillCylinder(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const rotatingBody = new THREE.Group();

    // Habitat Cylinder
    const radius = 50;
    const length = 200;
    const shellGeo = new THREE.CylinderGeometry(radius, radius, length, 64, 1, true);
    const shell = new THREE.Mesh(shellGeo, steel);
    shell.rotation.z = Math.PI / 2;
    rotatingBody.add(shell);

    // Window strips
    for(let i=0; i<3; i++) {
        const windowGeo = new THREE.CylinderGeometry(radius * 1.01, radius * 1.01, length * 0.9, 8, 1, true, (i * Math.PI * 2)/3, 0.5);
        const windowMesh = new THREE.Mesh(windowGeo, glass);
        windowMesh.rotation.z = Math.PI / 2;
        rotatingBody.add(windowMesh);
    }

    group.add(rotatingBody);

    // End Caps
    const capGeo = new THREE.CylinderGeometry(radius, radius, 5, 64);
    const capMat = darkSteel;
    const leftCap = new THREE.Mesh(capGeo, capMat);
    leftCap.position.x = -length / 2;
    leftCap.rotation.z = Math.PI / 2;
    rotatingBody.add(leftCap);

    const rightCap = new THREE.Mesh(capGeo, capMat);
    rightCap.position.x = length / 2;
    rightCap.rotation.z = Math.PI / 2;
    rotatingBody.add(rightCap);

    // Animation: Rotate main cylinder
    const times = [0, 20];
    const values = [0, Math.PI * 2];
    const track = new THREE.NumberKeyframeTrack(`${rotatingBody.uuid}.rotation[x]`, times, values);
    const clip = new THREE.AnimationClip('Spin', 20, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
