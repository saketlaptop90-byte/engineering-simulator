export function createAshPlume(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Ash plume main column
    const columnGeometry = new THREE.CylinderGeometry(1, 3, 8, 16);
    const ashMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x444444, 
        transparent: true, 
        opacity: 0.8 
    });
    const column = new THREE.Mesh(columnGeometry, ashMaterial);
    column.position.y = 4;
    group.add(column);

    // Ash umbrella region
    const umbrellaGeometry = new THREE.SphereGeometry(4, 16, 16);
    const umbrella = new THREE.Mesh(umbrellaGeometry, ashMaterial);
    umbrella.position.y = 8;
    umbrella.scale.y = 0.5;
    group.add(umbrella);

    // Animation for plume rising and expanding
    const scaleTrackName = group.uuid + '.scale';
    const times = [0, 5];
    const values = [1, 1, 1, 1.2, 1.5, 1.2];
    const track = new THREE.VectorKeyframeTrack(scaleTrackName, times, values);
    const clip = new THREE.AnimationClip('PlumeRise', 5, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
