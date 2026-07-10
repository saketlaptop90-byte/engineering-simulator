export function createTesseract(THREE) {
    const group = new THREE.Group();

    // 16 vertices of a tesseract (±1, ±1, ±1, ±1)
    const vertices4D = [];
    for (let i = 0; i < 16; i++) {
        vertices4D.push([
            (i & 1) ? 1 : -1,
            (i & 2) ? 1 : -1,
            (i & 4) ? 1 : -1,
            (i & 8) ? 1 : -1
        ]);
    }

    // 32 edges: connect vertices that differ by exactly 1 bit
    const edges = [];
    for (let i = 0; i < 16; i++) {
        for (let j = i + 1; j < 16; j++) {
            let diff = i ^ j;
            if (diff === 1 || diff === 2 || diff === 4 || diff === 8) {
                edges.push([i, j]);
            }
        }
    }

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(edges.length * 2 * 3);
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.8 });
    const lines = new THREE.LineSegments(geometry, material);
    group.add(lines);

    // Create an AnimationClip that rotates the 4D points
    const times = [];
    const values = [];
    const numFrames = 120;
    const duration = 4;

    for (let f = 0; f <= numFrames; f++) {
        const t = f / numFrames;
        times.push(t * duration);
        
        const angleXW = t * Math.PI * 2;
        const angleYW = t * Math.PI * 2 * 1.5;
        const cxw = Math.cos(angleXW), sxw = Math.sin(angleXW);
        const cyw = Math.cos(angleYW), syw = Math.sin(angleYW);

        const currentPositions = [];
        
        for (let e = 0; e < edges.length; e++) {
            for (let vIdx of edges[e]) {
                const v = vertices4D[vIdx];
                let x = v[0], y = v[1], z = v[2], w = v[3];

                // Rotate XW
                let nx = x * cxw - w * sxw;
                let nw = x * sxw + w * cxw;
                x = nx; w = nw;

                // Rotate YW
                let ny = y * cyw - w * syw;
                nw = y * syw + w * cyw;
                y = ny; w = nw;

                // Project 4D to 3D (stereographic projection or perspective)
                const distance = 3;
                const wDiv = 1 / (distance - w);
                
                currentPositions.push(x * wDiv * 2, y * wDiv * 2, z * wDiv * 2);
            }
        }
        values.push(...currentPositions);
    }

    // Use a Float32Array for values to avoid huge arrays if possible, but let's just use standard array
    const positionTrack = new THREE.VectorKeyframeTrack(
        lines.uuid + '.geometry.attributes.position.array',
        times,
        values
    );

    const clip = new THREE.AnimationClip('TesseractRotation', duration, [positionTrack]);

    // To make VectorKeyframeTrack work on arbitrary arrays, we might need to do something hacky
    // or we use morph targets.
    // Three.js animation system doesn't natively animate `position.array` directly easily without Morph Targets.
    // Wait, VectorKeyframeTrack can't animate float32array elements linearly as a single block if it's not a Vector3 property.
    // Let's use Morph Targets!
    
    // Morph targets for BufferGeometry
    const morphAttributes = [];
    const morphTargetDictionary = {};
    const morphTargetInfluences = [];
    
    for (let f = 0; f <= numFrames; f++) {
        const morphPositions = new Float32Array(values.slice(f * edges.length * 6, (f + 1) * edges.length * 6));
        morphAttributes.push(new THREE.BufferAttribute(morphPositions, 3));
        morphTargetDictionary['frame' + f] = f;
        morphTargetInfluences.push(0);
    }
    
    geometry.morphAttributes.position = morphAttributes;
    lines.morphTargetDictionary = morphTargetDictionary;
    lines.morphTargetInfluences = morphTargetInfluences;
    
    // Set initial position
    geometry.setAttribute('position', morphAttributes[0]);

    // Animation clip for morphTargetInfluences
    const morphTracks = [];
    for (let f = 0; f <= numFrames; f++) {
        const trackTimes = [];
        const trackValues = [];
        for (let i = 0; i <= numFrames; i++) {
            trackTimes.push((i / numFrames) * duration);
            trackValues.push(i === f ? 1 : 0);
        }
        morphTracks.push(new THREE.NumberKeyframeTrack(
            lines.uuid + '.morphTargetInfluences[' + f + ']',
            trackTimes,
            trackValues
        ));
    }
    
    const morphClip = new THREE.AnimationClip('TesseractMorph', duration, morphTracks);

    return { group, animationClips: [morphClip] };
}
