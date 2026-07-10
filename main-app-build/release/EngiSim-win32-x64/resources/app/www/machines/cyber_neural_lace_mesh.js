import { titanium, copper, darkSteel } from '../utils/materials.js';

export function createNeuralLaceMesh(THREE) {
    const group = new THREE.Group();

    const numNodes = 50;
    const radius = 2;
    const nodesGroup = new THREE.Group();
    nodesGroup.name = 'nodesGroup';
    
    const nodeGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const nodes = [];

    for (let i = 0; i < numNodes; i++) {
        const phi = Math.acos(-1 + (2 * i) / numNodes);
        const theta = Math.sqrt(numNodes * Math.PI) * phi;
        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(phi);
        const node = new THREE.Mesh(nodeGeometry, copper);
        node.position.set(x, y, z);
        node.name = `node${i}`;
        nodesGroup.add(node);
        nodes.push({ mesh: node, basePos: new THREE.Vector3(x, y, z) });
    }
    
    group.add(nodesGroup);

    const material = new THREE.LineBasicMaterial({ color: 0x878681, transparent: true, opacity: 0.5 });
    const points = [];
    for(let i=0; i<numNodes; i++) {
        for(let j=i+1; j<numNodes; j++) {
            if (nodes[i].basePos.distanceTo(nodes[j].basePos) < 1.2) {
                points.push(nodes[i].basePos.x, nodes[i].basePos.y, nodes[i].basePos.z);
                points.push(nodes[j].basePos.x, nodes[j].basePos.y, nodes[j].basePos.z);
            }
        }
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    const lines = new THREE.LineSegments(geometry, material);
    lines.name = 'connectingLines';
    group.add(lines);
    
    const coreGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const core = new THREE.Mesh(coreGeometry, darkSteel);
    core.name = 'core';
    group.add(core);

    const times = [0, 2, 4];
    const tracks = [];
    const scaleValues = [1, 1, 1, 1.2, 1.2, 1.2, 1, 1, 1];
    tracks.push(new THREE.VectorKeyframeTrack('nodesGroup.scale', times, scaleValues));
    tracks.push(new THREE.VectorKeyframeTrack('connectingLines.scale', times, scaleValues));

    const coreScaleValues = [1, 1, 1, 0.8, 0.8, 0.8, 1, 1, 1];
    tracks.push(new THREE.VectorKeyframeTrack('core.scale', times, coreScaleValues));

    const clip = new THREE.AnimationClip('PulseMesh', 4, tracks);

    return { group, animationClips: [clip] };
}
