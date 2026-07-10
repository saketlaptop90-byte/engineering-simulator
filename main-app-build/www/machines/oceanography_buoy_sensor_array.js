export function createBuoySensorArray(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Buoy float
    const floatGeo = new THREE.CylinderGeometry(2, 2, 1, 32);
    const floatMat = new THREE.MeshStandardMaterial({ color: 0xff3300, metalness: 0.1, roughness: 0.9 });
    const floatMesh = new THREE.Mesh(floatGeo, floatMat);
    floatMesh.position.y = 0;
    group.add(floatMesh);

    // Antenna
    const antennaGeo = new THREE.CylinderGeometry(0.1, 0.1, 3, 16);
    const metalMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8, roughness: 0.2 });
    const antenna = new THREE.Mesh(antennaGeo, metalMat);
    antenna.position.y = 2;
    group.add(antenna);

    // Sensor line
    const lineGeo = new THREE.CylinderGeometry(0.05, 0.05, 10, 8);
    const lineMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const line = new THREE.Mesh(lineGeo, lineMat);
    line.position.y = -5;
    group.add(line);

    // Sensors
    for (let i = 0; i < 3; i++) {
        const sensorGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const sensorMat = new THREE.MeshStandardMaterial({ color: 0x00ffcc });
        const sensor = new THREE.Mesh(sensorGeo, sensorMat);
        sensor.position.y = -3 - (i * 3);
        group.add(sensor);
    }

    // Bobbing animation
    const buoyName = 'buoyGroup';
    group.name = buoyName;

    const yTrack = new THREE.NumberKeyframeTrack(
        buoyName + '.position[y]',
        [0, 2, 4],
        [0, 0.5, 0]
    );

    const bobClip = new THREE.AnimationClip('Bobbing', 4, [yTrack]);
    animationClips.push(bobClip);

    return { group, animationClips };
}
