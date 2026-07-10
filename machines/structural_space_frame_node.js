import * as materials from '../utils/materials.js';

export function createSpaceFrameNode(THREE) {
    const group = new THREE.Group();
    group.name = "SpaceFrameNode";

    const nodeMat = materials.highlight || new THREE.MeshStandardMaterial({ color: 0xffaa00, metalness: 0.9, roughness: 0.2 });
    const strutMat = materials.steel || new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8, roughness: 0.4 });
    const boltMat = materials.dark || new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.5 });

    // Central Node
    const sphereGeo = new THREE.SphereGeometry(0.6, 32, 32);
    const node = new THREE.Mesh(sphereGeo, nodeMat);
    group.add(node);

    // Struts config
    const strutAngles = [
        { x: 1, y: 0, z: 0 },
        { x: -1, y: 0, z: 0 },
        { x: 0, y: 1, z: 0 },
        { x: 0, y: -1, z: 0 },
        { x: 0.707, y: 0.707, z: 0 },
        { x: -0.707, y: -0.707, z: 0 },
        { x: 0, y: 0.707, z: 0.707 },
        { x: 0, y: -0.707, z: -0.707 }
    ];

    const struts = [];
    const strutGeo = new THREE.CylinderGeometry(0.15, 0.15, 3, 16);
    strutGeo.translate(0, 1.5, 0); // Pivot at the base

    strutAngles.forEach((dir) => {
        const strutGroup = new THREE.Group();
        
        const direction = new THREE.Vector3(dir.x, dir.y, dir.z).normalize();
        const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
        strutGroup.quaternion.copy(quaternion);
        
        // Connector piece
        const connector = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.4, 16), boltMat);
        connector.position.y = 0.6;
        strutGroup.add(connector);
        
        // Strut beam
        const strut = new THREE.Mesh(strutGeo, strutMat);
        strut.position.y = 0.8; 
        strutGroup.add(strut);
        
        group.add(strutGroup);
        struts.push(strut);
    });

    // Animation: Struts fly in to connect to the central node
    const times = [0, 2, 4];
    const tracks = [];

    struts.forEach(strut => {
        const startY = 3.5; // Disconnected state
        const endY = 0.8;   // Connected state
        const track = new THREE.VectorKeyframeTrack(
            strut.uuid + '.position',
            times,
            [0, startY, 0,  0, endY, 0,  0, endY, 0]
        );
        tracks.push(track);
    });

    // Node rotates for visual inspection during assembly
    const rotTrack = new THREE.QuaternionKeyframeTrack(
        group.uuid + '.quaternion',
        [0, 4],
        [
            new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)).toArray(),
            new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 4, Math.PI * 2, 0)).toArray()
        ].flat()
    );
    tracks.push(rotTrack);

    const clip = new THREE.AnimationClip('Assemble', 4, tracks);

    return { group, animationClips: [clip] };
}
