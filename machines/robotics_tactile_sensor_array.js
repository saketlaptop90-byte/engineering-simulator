import * as materials from '../utils/materials.js';

export function createTactileSensorArray(THREE) {
    const group = new THREE.Group();
    
    const baseMat = materials.metalMaterial || new THREE.MeshStandardMaterial({ color: 0x444444 });
    const sensorMat = materials.glassMaterial || new THREE.MeshStandardMaterial({ color: 0x44dd44, transparent: true, opacity: 0.8 });

    const base = new THREE.Mesh(new THREE.BoxGeometry(4, 0.2, 4), baseMat);
    group.add(base);

    const sensors = new THREE.Group();
    sensors.name = 'Sensors';
    group.add(sensors);

    for(let i=0; i<4; i++) {
        for(let j=0; j<4; j++) {
            const sensor = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16), sensorMat);
            sensor.position.set(-1.5 + i, 0.2, -1.5 + j);
            sensors.add(sensor);
        }
    }

    const times = [0, 0.5, 1, 1.5, 2];
    const values = [1, 1.5, 1, 0.5, 1];
    
    // Animate scale y of sensors to simulate tactile response
    const tracks = [];
    sensors.children.forEach((s, idx) => {
        s.name = `Sensor_${idx}`;
        const delayValues = values.map(v => 1 + (v - 1) * Math.sin(idx + 1));
        tracks.push(new THREE.NumberKeyframeTrack(s.name + '.scale[y]', times, delayValues));
    });

    const clip = new THREE.AnimationClip('sense', 2, tracks);

    return { group, animationClips: [clip] };
}
