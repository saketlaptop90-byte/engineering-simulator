import { copper, darkSteel } from '../utils/materials.js';

export function createSiliconeMuscleArray(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const muscleMat = new THREE.MeshPhysicalMaterial({
        color: 0xff4444,
        transmission: 0.5,
        opacity: 0.9,
        transparent: true,
        roughness: 0.4,
        metalness: 0.0
    });

    const frameGeo = new THREE.BoxGeometry(4, 0.2, 2);
    const frame1 = new THREE.Mesh(frameGeo, darkSteel);
    frame1.position.z = -1;
    group.add(frame1);

    const frame2 = new THREE.Mesh(frameGeo, darkSteel);
    frame2.position.z = 1;
    group.add(frame2);

    const muscles = [];
    for (let i = 0; i < 5; i++) {
        const muscleGeo = new THREE.CylinderGeometry(0.2, 0.2, 2, 16);
        const muscle = new THREE.Mesh(muscleGeo, muscleMat);
        muscle.rotation.x = Math.PI / 2;
        muscle.position.x = -1.6 + i * 0.8;
        group.add(muscle);
        muscles.push(muscle);
        
        // Copper wire wraps
        const wireGeo = new THREE.TorusGeometry(0.21, 0.02, 8, 24);
        for(let j = 0; j < 5; j++) {
            const wire = new THREE.Mesh(wireGeo, copper);
            wire.position.y = -0.6 + j * 0.3;
            wire.rotation.x = Math.PI / 2;
            muscle.add(wire);
        }
    }

    // Animation: Contraction and Expansion
    const tracks = [];
    const times = [0, 0.5, 1, 1.5, 2];

    muscles.forEach((muscle, idx) => {
        const delay = idx * 0.2;
        const sTimes = times.map(t => t + delay);
        const scaleValues = [
            1, 1, 1,
            1.5, 0.8, 1.5, // Bulge and shorten
            1, 1, 1,
            1.5, 0.8, 1.5,
            1, 1, 1
        ];
        
        const track = new THREE.VectorKeyframeTrack(`${muscle.uuid}.scale`, sTimes, scaleValues);
        tracks.push(track);
    });

    const clip = new THREE.AnimationClip('MuscleContraction', 4, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
