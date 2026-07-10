import { allMaterials as mat, tinted } from '../utils/materials.js';

export function createHolographicProjectorArray(THREE) {
    const group = new THREE.Group();
    group.name = "Holographic Projector Array";
    const animationClips = [];

    // Base Frame
    const frameGeo = new THREE.TorusGeometry(4, 0.2, 16, 64);
    const frame = new THREE.Mesh(frameGeo, mat.darkSteel);
    frame.rotation.x = Math.PI / 2;
    group.add(frame);

    // Projector nodes
    const nodes = [];
    const nodeCount = 6;
    for (let i = 0; i < nodeCount; i++) {
        const angle = (i / nodeCount) * Math.PI * 2;
        const x = Math.cos(angle) * 4;
        const z = Math.sin(angle) * 4;

        const nodeGroup = new THREE.Group();
        nodeGroup.position.set(x, 0, z);
        nodeGroup.rotation.y = -angle;

        const baseGeo = new THREE.BoxGeometry(0.8, 0.4, 0.8);
        const base = new THREE.Mesh(baseGeo, mat.aluminum);
        nodeGroup.add(base);

        const lensGeo = new THREE.CylinderGeometry(0.2, 0.3, 0.5, 16);
        const lens = new THREE.Mesh(lensGeo, mat.glass);
        lens.position.set(0, 0, -0.4);
        lens.rotation.x = Math.PI / 2;
        nodeGroup.add(lens);

        nodes.push(nodeGroup);
        group.add(nodeGroup);
    }

    // Hologram Center
    const holoGroup = new THREE.Group();
    holoGroup.position.y = 2;
    group.add(holoGroup);

    const holoMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.6,
        wireframe: true
    });
    
    const holoCoreGeo = new THREE.IcosahedronGeometry(1.5, 1);
    const holoCore = new THREE.Mesh(holoCoreGeo, holoMat);
    holoGroup.add(holoCore);

    // Light beams
    const beams = [];
    for (let i = 0; i < nodeCount; i++) {
        const angle = (i / nodeCount) * Math.PI * 2;
        const x = Math.cos(angle) * 3.8;
        const z = Math.sin(angle) * 3.8;

        const beamLength = Math.sqrt(x*x + 2*2 + z*z);
        const beamGeo = new THREE.CylinderGeometry(0.05, 0.3, beamLength, 16);
        const beamMat = tinted(mat.glass, 0x00ffff);
        beamMat.emissive = new THREE.Color(0x00ffff);
        beamMat.emissiveIntensity = 0.5;

        const beam = new THREE.Mesh(beamGeo, beamMat);
        
        // Position at midpoint
        beam.position.set(x/2, 1, z/2);
        beam.lookAt(0, 2, 0);
        beam.rotateX(Math.PI/2);
        group.add(beam);
        beams.push(beam);
    }

    // Animation
    const times = [0, 1, 2, 3, 4];
    
    // Rotate Hologram
    const coreRotTracks = [
        new THREE.NumberKeyframeTrack(`${holoGroup.uuid}.rotation[y]`, [0, 4], [0, Math.PI * 2]),
        new THREE.NumberKeyframeTrack(`${holoGroup.uuid}.position[y]`, [0, 1, 2, 3, 4], [2, 2.2, 2, 1.8, 2])
    ];

    const clip = new THREE.AnimationClip('HoloProjection', 4, coreRotTracks);
    animationClips.push(clip);

    return { group, animationClips };
}
