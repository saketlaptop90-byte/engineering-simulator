import { materials } from '../utils/materials.js';

export function createEngineeredPhage(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Icosahedral Head
    const headGeo = new THREE.IcosahedronGeometry( 1.5, 0 );
    const headMat = materials.metallic || new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8, roughness: 0.3 });
    const head = new THREE.Mesh( headGeo, headMat );
    head.position.y = 3;
    group.add( head );

    // Collar
    const collarGeo = new THREE.CylinderGeometry( 0.6, 0.6, 0.3, 16 );
    const collarMat = materials.darkMetal || new THREE.MeshStandardMaterial({ color: 0x333333 });
    const collar = new THREE.Mesh( collarGeo, collarMat );
    collar.position.y = 1.7;
    group.add( collar );

    // Tail Sheath
    const sheathGeo = new THREE.CylinderGeometry( 0.4, 0.4, 2.5, 16 );
    const sheathMat = materials.highlight || new THREE.MeshStandardMaterial({ color: 0x4488ff });
    const sheath = new THREE.Mesh( sheathGeo, sheathMat );
    sheath.position.y = 0.3;
    group.add( sheath );

    // Base Plate
    const plateGeo = new THREE.CylinderGeometry( 1.2, 1.2, 0.2, 6 );
    const plateMat = materials.metallic || new THREE.MeshStandardMaterial({ color: 0x999999 });
    const plate = new THREE.Mesh( plateGeo, plateMat );
    plate.position.y = -1.0;
    group.add( plate );

    // Tail Fibers
    const fiberGeo = new THREE.CylinderGeometry( 0.05, 0.05, 2 );
    const fibers = new THREE.Group();
    fibers.position.y = -1.0;
    
    for (let i = 0; i < 6; i++) {
        const fiber = new THREE.Mesh( fiberGeo, headMat );
        const angle = (i / 6) * Math.PI * 2;
        fiber.position.x = Math.cos(angle) * 1.5;
        fiber.position.z = Math.sin(angle) * 1.5;
        fiber.position.y = -0.5;
        
        // Tilt fibers outwards
        fiber.lookAt(new THREE.Vector3(fiber.position.x * 2, -2, fiber.position.z * 2));
        fibers.add( fiber );
    }
    group.add( fibers );

    // Animation: Phage injection (sheath contracts, head moves down)
    const times = [0, 1.5, 3];
    const headTrack = new THREE.VectorKeyframeTrack(`${head.uuid}.position`, times, [0,3,0, 0,1.5,0, 0,3,0]);
    const collarTrack = new THREE.VectorKeyframeTrack(`${collar.uuid}.position`, times, [0,1.7,0, 0,0.2,0, 0,1.7,0]);
    const sheathScaleTrack = new THREE.VectorKeyframeTrack(`${sheath.uuid}.scale`, times, [1,1,1, 1,0.4,1, 1,1,1]);
    const sheathPosTrack = new THREE.VectorKeyframeTrack(`${sheath.uuid}.position`, times, [0,0.3,0, 0,-0.5,0, 0,0.3,0]);

    const clip = new THREE.AnimationClip('Injection', 3, [headTrack, collarTrack, sheathScaleTrack, sheathPosTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
