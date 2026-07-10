import { iron, steel, darkSteel } from '../utils/materials.js';

export function createRailSwitchMechanism(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Static Outer Rails
    for (let i = -1; i <= 1; i += 2) {
        const railGeo = new THREE.BoxGeometry(0.5, 1, 20);
        const rail = new THREE.Mesh(railGeo, steel);
        rail.position.set(i * 3, 0.5, 0);
        group.add(rail);
    }

    // Switch Motor Enclosure
    const boxGeo = new THREE.BoxGeometry(2, 1.5, 2);
    const motorBox = new THREE.Mesh(boxGeo, darkSteel);
    motorBox.position.set(5, 0.75, 0);
    group.add(motorBox);

    // Moving Switch Points
    const pointsGroup = new THREE.Group();
    pointsGroup.name = 'pointsGroup';
    
    for (let i = -1; i <= 1; i += 2) {
        const pointGeo = new THREE.BoxGeometry(0.3, 1, 10);
        const point = new THREE.Mesh(pointGeo, iron);
        point.position.set(i * 3 + 0.5, 0.5, 5);
        point.rotation.y = 0.05 * i; // Slight angle for points
        pointsGroup.add(point);
    }

    // Linkage Rod
    const linkageGeo = new THREE.CylinderGeometry(0.2, 0.2, 5);
    const linkage = new THREE.Mesh(linkageGeo, iron);
    linkage.rotation.z = Math.PI / 2;
    linkage.position.set(2, 0.5, 8);
    pointsGroup.add(linkage);

    group.add(pointsGroup);

    // Animation: Switch moving left to right
    const times = [0, 1, 2, 3, 4];
    const xPositions = [0, -0.8, -0.8, 0, 0];
    
    const posValues = [];
    times.forEach((t, i) => {
        posValues.push(xPositions[i], 0, 0);
    });

    const switchTrack = new THREE.VectorKeyframeTrack('pointsGroup.position', times, posValues);
    const clip = new THREE.AnimationClip('Switch', 4, [switchTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
