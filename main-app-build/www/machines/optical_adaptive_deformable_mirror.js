import { getMaterials } from '../utils/materials.js';

export function createAdaptiveDeformableMirror(THREE) {
    const group = new THREE.Group();
    const materials = getMaterials(THREE);
    
    // Base Mount
    const mountGeo = new THREE.CylinderGeometry(4, 4.5, 2, 64);
    const mount = new THREE.Mesh(mountGeo, materials.plastic);
    group.add(mount);

    // Electronics Base
    const boardGeo = new THREE.CylinderGeometry(3.5, 3.5, 0.5, 64);
    const board = new THREE.Mesh(boardGeo, materials.metal);
    board.position.y = 1.25;
    group.add(board);

    const gridSize = 7;
    const spacing = 0.8;
    const offset = ((gridSize - 1) * spacing) / 2;

    const actuators = new THREE.Group();
    actuators.position.y = 1.5;
    group.add(actuators);

    const mirrorSegments = new THREE.Group();
    mirrorSegments.position.y = 2.5;
    group.add(mirrorSegments);

    const segments = [];
    
    // Create hexagonal grid approximation using squares for simplicity, or just squares
    const hexGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 6);
    
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const x = i * spacing - offset;
            const z = j * spacing - offset;
            
            // Make it roughly circular
            if (x*x + z*z > 9) continue;

            // Actuator
            const actGeo = new THREE.CylinderGeometry(0.1, 0.1, 1, 16);
            const actuator = new THREE.Mesh(actGeo, materials.chrome);
            actuator.position.set(x, 0.5, z);
            actuators.add(actuator);

            // Mirror segment
            const segment = new THREE.Mesh(hexGeo, materials.glass); // Glass material for reflectivity
            segment.position.set(x, 0, z);
            segment.name = `segment_${i}_${j}`;
            
            // Connect segment visually to actuator
            const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.5), materials.metal);
            stem.position.y = -0.25;
            segment.add(stem);
            
            mirrorSegments.add(segment);
            segments.push({ mesh: segment, x: i, z: j, ox: x, oz: z });
        }
    }

    // Animation: Wave pattern on the deformable mirror
    const tracks = [];
    const duration = 4;
    const frames = 20;
    
    segments.forEach((seg) => {
        const times = [];
        const values = [];
        
        for (let k = 0; k <= frames; k++) {
            const t = (k / frames) * duration;
            times.push(t);
            
            // Wave equation based on distance from center and time
            const dist = Math.sqrt(seg.ox*seg.ox + seg.oz*seg.oz);
            const yOffset = Math.sin(dist * 2 - t * Math.PI) * 0.2;
            
            // Position Y track
            values.push(yOffset);
        }
        
        const yTrack = new THREE.NumberKeyframeTrack(`${seg.mesh.name}.position[y]`, times, values);
        tracks.push(yTrack);
        
        // Tilt tracks
        const tiltTimes = times;
        const rotXValues = [];
        const rotZValues = [];
        for (let k = 0; k <= frames; k++) {
            const t = (k / frames) * duration;
            const dist = Math.sqrt(seg.ox*seg.ox + seg.oz*seg.oz);
            const tiltX = Math.cos(dist * 2 - t * Math.PI) * 0.1 * (seg.oz / (dist || 1));
            const tiltZ = -Math.cos(dist * 2 - t * Math.PI) * 0.1 * (seg.ox / (dist || 1));
            rotXValues.push(tiltX);
            rotZValues.push(tiltZ);
        }
        const rotXTrack = new THREE.NumberKeyframeTrack(`${seg.mesh.name}.rotation[x]`, tiltTimes, rotXValues);
        const rotZTrack = new THREE.NumberKeyframeTrack(`${seg.mesh.name}.rotation[z]`, tiltTimes, rotZValues);
        tracks.push(rotXTrack, rotZTrack);
    });

    const clip = new THREE.AnimationClip('WaveDeformation', duration, tracks);

    return { group, animationClips: [clip] };
}
