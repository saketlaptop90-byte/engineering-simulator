export function createSeismometerStation(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base housing
    const baseGeometry = new THREE.BoxGeometry(2, 1, 2);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.5 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0.5;
    group.add(base);

    // Sensor unit
    const sensorGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1.2, 16);
    const sensorMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8 });
    const sensor = new THREE.Mesh(sensorGeometry, sensorMaterial);
    sensor.position.y = 1.6;
    group.add(sensor);

    // Recording needle (simplified)
    const needleGeometry = new THREE.BoxGeometry(0.1, 0.1, 1);
    const needleMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const needle = new THREE.Mesh(needleGeometry, needleMaterial);
    needle.position.set(0.6, 1.6, 0);
    group.add(needle);

    // Animation for seismometer needle shaking
    const rotTrackName = needle.uuid + '.rotation';
    const times = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
    const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0.2, 0)).toArray();
    const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -0.2, 0)).toArray();
    const q3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0.1, 0)).toArray();
    const q4 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -0.1, 0)).toArray();
    const q5 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)).toArray();
    const values = [...q1, ...q2, ...q3, ...q4, ...q5, ...q5];
    const track = new THREE.QuaternionKeyframeTrack(rotTrackName, times, values);
    const clip = new THREE.AnimationClip('SeismicTremor', 0.5, [track]);
    animationClips.push(clip);

    return { group, animationClips };
}
