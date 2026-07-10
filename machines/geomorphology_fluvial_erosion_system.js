export function createFluvialErosionSystem(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Terrain
    const terrainGeo = new THREE.BoxGeometry(20, 5, 20);
    const terrainMat = new THREE.MeshStandardMaterial({ color: 0x228B22, roughness: 0.8 });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.position.set(0, 0, 0);
    group.add(terrain);

    // River
    const riverGeo = new THREE.PlaneGeometry(2, 20);
    const riverMat = new THREE.MeshStandardMaterial({ color: 0x1E90FF, transparent: true, opacity: 0.8, side: THREE.DoubleSide });
    const river = new THREE.Mesh(riverGeo, riverMat);
    river.rotation.x = -Math.PI / 2;
    river.position.set(0, 2.6, 0);
    group.add(river);

    // Canyon erosion animation (scaling river width or terrain)
    const trackName = river.uuid + '.scale';
    const times = [0, 5, 10];
    const values = [1, 1, 1, 2, 1, 1, 1, 1, 1];
    
    const track = new THREE.VectorKeyframeTrack(trackName, times, values);
    const clip = new THREE.AnimationClip('Erosion', 10, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
