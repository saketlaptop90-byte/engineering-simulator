import { materials } from '../utils/materials.js';

export function createCNCGlassCuttingTable(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base Table
    const tableGeometry = new THREE.BoxGeometry(10, 1, 6);
    const tableMat = materials.metal ? materials.metal : new THREE.MeshStandardMaterial({ color: 0x888888 });
    const table = new THREE.Mesh(tableGeometry, tableMat);
    table.position.y = 0.5;
    group.add(table);

    // Glass Sheet
    const glassGeometry = new THREE.BoxGeometry(8, 0.05, 4);
    const glassMat = materials.glass ? materials.glass : new THREE.MeshPhysicalMaterial({ transmission: 0.9, opacity: 1, transparent: true, roughness: 0, ior: 1.5 });
    const glass = new THREE.Mesh(glassGeometry, glassMat);
    glass.position.y = 1.025;
    group.add(glass);

    // Cutting Bridge (X-axis movement)
    const bridgeGroup = new THREE.Group();
    bridgeGroup.position.set(-4, 1.5, 0);
    
    const bridgeGeometry = new THREE.BoxGeometry(0.5, 0.5, 6);
    const bridgeMat = materials.darkMetal ? materials.darkMetal : new THREE.MeshStandardMaterial({ color: 0x444444 });
    const bridge = new THREE.Mesh(bridgeGeometry, bridgeMat);
    bridgeGroup.add(bridge);

    // Cutting Head (Y-axis movement on the bridge)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, -0.3, -2);
    
    const headGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.4);
    const headMat = materials.accent ? materials.accent : new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const head = new THREE.Mesh(headGeometry, headMat);
    headGroup.add(head);

    // Cutting blade
    const bladeGeometry = new THREE.ConeGeometry(0.02, 0.1);
    const bladeMat = materials.metal ? materials.metal : new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const blade = new THREE.Mesh(bladeGeometry, bladeMat);
    blade.position.y = -0.2;
    headGroup.add(blade);

    bridgeGroup.add(headGroup);
    group.add(bridgeGroup);

    // Animations
    const times = [0, 2, 4, 6, 8];
    const bridgePositions = [
        -4, 1.5, 0,
        4, 1.5, 0,
        4, 1.5, 0,
        -4, 1.5, 0,
        -4, 1.5, 0
    ];
    
    const headPositions = [
        0, -0.3, -2,
        0, -0.3, -2,
        0, -0.3, 2,
        0, -0.3, 2,
        0, -0.3, -2
    ];

    const bridgeTrack = new THREE.VectorKeyframeTrack(`${bridgeGroup.uuid}.position`, times, bridgePositions);
    const headTrack = new THREE.VectorKeyframeTrack(`${headGroup.uuid}.position`, times, headPositions);

    const clip = new THREE.AnimationClip('Cutting', 8, [bridgeTrack, headTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
