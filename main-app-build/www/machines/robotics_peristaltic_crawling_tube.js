import { copper, darkSteel } from '../utils/materials.js';

export function createPeristalticCrawlingTube(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const tubeMat = new THREE.MeshPhysicalMaterial({
        color: 0xddbb99,
        roughness: 0.6,
        metalness: 0.0,
        transmission: 0.2,
        transparent: true,
        opacity: 0.9
    });

    const numSegments = 12;
    const radius = 0.4;
    const length = 0.5;

    const segments = [];
    const tracks = [];

    for (let i = 0; i < numSegments; i++) {
        const segGeo = new THREE.TorusGeometry(radius, 0.15, 16, 32);
        const segment = new THREE.Mesh(segGeo, tubeMat);
        segment.position.x = i * length - (numSegments * length) / 2;
        segment.rotation.y = Math.PI / 2;
        group.add(segment);
        segments.push(segment);

        // Internal actuators
        const actGeo = new THREE.CylinderGeometry(0.05, 0.05, radius * 2);
        const actuator1 = new THREE.Mesh(actGeo, darkSteel);
        const actuator2 = new THREE.Mesh(actGeo, copper);
        actuator2.rotation.x = Math.PI / 2;
        segment.add(actuator1);
        segment.add(actuator2);

        // Peristaltic wave animation
        const times = [0, 0.5, 1, 1.5, 2, 2.5, 3];
        const delay = i * 0.2;
        const sTimes = times.map(t => t + delay);
        
        const scaleValues = [
            1, 1, 1,
            1.5, 1.5, 1.5,
            0.8, 0.8, 0.8,
            1, 1, 1,
            1, 1, 1,
            1, 1, 1,
            1, 1, 1
        ];
        
        const track = new THREE.VectorKeyframeTrack(`${segment.uuid}.scale`, sTimes, scaleValues);
        tracks.push(track);
    }

    // Connective skin
    const skinGeo = new THREE.CylinderGeometry(radius+0.15, radius+0.15, numSegments * length, 32, numSegments, true);
    const skinMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.8,
        transparent: true,
        opacity: 0.5,
        wireframe: true // To show internals clearly while demonstrating skin
    });
    const skin = new THREE.Mesh(skinGeo, skinMat);
    skin.rotation.z = Math.PI / 2;
    group.add(skin);

    const clip = new THREE.AnimationClip('PeristalticWave', 5, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
