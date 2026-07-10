export function createNeuralNetwork(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const nodes = [];
    const nodeGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const nodeMat = new THREE.MeshStandardMaterial({ color: 0x9b59b6 });

    // Create a 3x3x3 grid of neurons
    for (let x = -2; x <= 2; x += 2) {
        for (let y = -2; y <= 2; y += 2) {
            for (let z = -2; z <= 2; z += 2) {
                const node = new THREE.Mesh(nodeGeo, nodeMat);
                node.position.set(x + (Math.random()-0.5), y + (Math.random()-0.5), z + (Math.random()-0.5));
                nodes.push(node);
                group.add(node);
            }
        }
    }

    // Connect nodes
    const lineMat = new THREE.LineBasicMaterial({ color: 0x7f8c8d, transparent: true, opacity: 0.3 });
    const lines = new THREE.Group();
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            if (nodes[i].position.distanceTo(nodes[j].position) < 3) {
                const points = [nodes[i].position, nodes[j].position];
                const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(lineGeo, lineMat);
                lines.add(line);
            }
        }
    }
    group.add(lines);

    // Animation: network rotation
    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI * 2);
    
    const rotTimes = [0, 5, 10];
    const rotValues = [
        q0.x, q0.y, q0.z, q0.w,
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w
    ];
    
    const rotTrack = new THREE.QuaternionKeyframeTrack(`${group.uuid}.quaternion`, rotTimes, rotValues);
    const clip = new THREE.AnimationClip('NetworkSpin', 10, [rotTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
