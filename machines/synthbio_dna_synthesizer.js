import { materials } from '../utils/materials.js';

export function createDNASynthesizer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base machine
    const baseGeo = new THREE.BoxGeometry( 6, 2, 4 );
    const baseMat = materials.darkMetal || new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.9, roughness: 0.5 });
    const base = new THREE.Mesh( baseGeo, baseMat );
    base.position.y = -1;
    group.add( base );

    // Printing chamber
    const chamberGeo = new THREE.CylinderGeometry( 1.5, 1.5, 3, 32 );
    const chamberMat = materials.glass || new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.2, transmission: 0.9 });
    const chamber = new THREE.Mesh( chamberGeo, chamberMat );
    chamber.position.set( 0, 1.5, 0 );
    group.add( chamber );

    // DNA strand being printed
    const dnaGroup = new THREE.Group();
    const nodeGeo = new THREE.SphereGeometry( 0.1, 16, 16 );
    const matA = materials.highlight || new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const matT = materials.glowingBlue || new THREE.MeshStandardMaterial({ color: 0x0000ff });
    
    for (let i = 0; i < 20; i++) {
        const node = new THREE.Mesh( nodeGeo, i % 2 === 0 ? matA : matT );
        node.position.set( Math.sin(i * 0.5) * 0.5, i * 0.1, Math.cos(i * 0.5) * 0.5 );
        dnaGroup.add( node );
    }
    dnaGroup.position.set(0, 0.5, 0);
    group.add( dnaGroup );

    // Print head
    const headGeo = new THREE.ConeGeometry( 0.3, 1, 16 );
    const headMat = materials.metallic || new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 1 });
    const head = new THREE.Mesh( headGeo, headMat );
    head.rotation.x = Math.PI;
    head.position.set( 0, 3, 0 );
    group.add( head );

    // Animation: Printing process
    const times = [0, 2, 4];
    const headPosTrack = new THREE.VectorKeyframeTrack(`${head.uuid}.position`, times, [0,3,0, 0,2,0, 0,3,0]);
    const dnaPosTrack = new THREE.VectorKeyframeTrack(`${dnaGroup.uuid}.position`, times, [0,0.5,0, 0,1.5,0, 0,0.5,0]);

    const clip = new THREE.AnimationClip('DNAPrinting', 4, [headPosTrack, dnaPosTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
